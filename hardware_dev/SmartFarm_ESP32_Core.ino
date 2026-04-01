/**
 * @file SmartFarm_ESP32_Core.ino
 * @brief Integrated Controller for Smart Farm (Water Treatment + Nutrients + Aeroponics)
 * @version 1.0.0
 * 
 * [Architecture]
 * - MQTT: Command/Status Bridge to Rails Dashboard
 * - State Machine: Water Treatment -> Mixing -> Supplying -> Misting
 * - Fail-Safe: Watchdog & Local Manual Override
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// --- Configuration ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "YOUR_PC_IP"; // Rails PC IP
const int mqtt_port = 1884;

// --- Pin Definitions (Kincony KC868-A8 or Industrial ESP32) ---
#define PIN_RELAY_RAW_WATER     2  // 원수 입수 솔레노이드
#define PIN_RELAY_DRAIN_VALVE   4  // 배액 수거조 -> 정제수조 이송 펌프/밸브
#define PIN_RELAY_UV            5  // UV 살균기 (원수/배액 공용 또는 채널분리)
#define PIN_RELAY_MIX_PUMP     12  // 혼합조 순환 펌프 (교반용)
#define PIN_RELAY_DOSE_A       13  // Nutrient A 펌프
#define PIN_RELAY_DOSE_B       14  // Nutrient B 펌프
#define PIN_RELAY_RECYCLE_VALVE 15 // 정제수조 -> 혼합조 입수 밸브
#define PIN_RELAY_SUPPLY_PUMP  16  // 혼합조 -> 공급조 이송 펌프
#define PIN_RELAY_ROW_1_VALVE  17  // 구역 1 (Zone 1) 분사 솔레노이드
#define PIN_RELAY_ROW_2_VALVE  18  // 구역 2 (Zone 2) 분사 솔레노이드
#define PIN_SW_MANUAL_MODE     19  // 로컬 수동 모드 스위치

// --- Sensors ---
#define PIN_LEVEL_DCT          32  // 배액 수거조 (Drainage Collection Tank) 수위 센서
#define PIN_LEVEL_RWT          33  // 정제수조 (Recycled Water Tank) 수위 센서
#define PIN_LEVEL_MT           34  // 혼합조 (Mixing Tank) 수위 센서

// --- System State ---
enum SystemState { 
  IDLE, 
  WATER_INTAKE,   // 원수 or 배액 입수
  MISTING_ACTIVE, // 실제 분사 공정 (구역별 순차)
  RECYCLE_PROCESS, // 배액 수거조 -> 정제수조 이송/살균 공정
  EMERGENCY       // 비상 정지 상태
};
SystemState currentState = IDLE;
int currentMistingZone = 0; // 수압 부하 분산을 위한 구역 제어
unsigned long stateStartTime = 0;
bool isRecyclingMode = false;

// --- Misting & Hydraulic Configuration ---
const float NOZZLE_FLOW_LPM = 0.12;   // 0.5mm Orifice 노즐당 분사량 (L/min)
const int NOZZLES_PER_UNIT = 100;    // 유닛당 노즐 수 (A/B 랙 10 Tiers x 10개)
const float PUMP_FLOW_LPM = 20.0;    // 펌프 최대 공급 능력 (L/min)
const float DEFAULT_MIST_VOL_L = 0.5; // 유닛당 기본 목표 관수량 (L)

// --- Nozzle Health & Compensation ---
float CLOG_COMPENSATION_FACTOR = 1.0; // 노즐 고형물 고착(Clogging) 대비 보정 계수 (1.0~1.5)
                                      // 일부 막힘 시 시간을 늘려 전체 공급량을 맞춤

long calculateMistingDuration(float unitTargetVolume) {
  // T = (목표량 / 유닛총유량) * 60초 * 1000(ms) * 보정계수
  float totalFlowLpm = NOZZLE_FLOW_LPM * NOZZLES_PER_UNIT;
  long durationMs = (long)((unitTargetVolume / totalFlowLpm) * 60.0 * 1000.0 * CLOG_COMPENSATION_FACTOR);
  return durationMs;
}

// 자동 계산
const float unitFlowLPM = NOZZLE_FLOW_LPM * NOZZLES_PER_UNIT; // 유닛당 순시 유량 (12.0 L/min)
const int MAX_SIMULTANEOUS_UNITS = (int)(PUMP_FLOW_LPM / unitFlowLPM); // 동시 분사 가능 유닛 수 (e.g., 1)
const int STABILIZE_TIME_MS = 30000;  // 투입 후 대기 시간 (30초)

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // 1. Safety Check (Local Manual Override)
  bool manualMode = (digitalRead(PIN_SW_MANUAL_MODE) == LOW);
  if (manualMode) {
    handle_manual_control();
    return;
  }

  // 2. Logic Controller (State Machine)
  unsigned long now = millis();
  unsigned long elapsed = now - stateStartTime;

  switch (currentState) {
    case IDLE:
      all_off();
      break;

    case WATER_INTAKE:
      // 배액 우선 사용 로직 (Recycling Strategy)
      if (digitalRead(PIN_LEVEL_RWT) == HIGH) { // 정제수조(재활용수)에 물이 있을 때
        digitalWrite(PIN_RELAY_RECYCLE_VALVE, HIGH);
        isRecyclingMode = true;
      } else {
        digitalWrite(PIN_RELAY_RAW_WATER, HIGH);
        isRecyclingMode = false;
      }
      digitalWrite(PIN_RELAY_UV, HIGH); // 수처리 살균 항시 연동
      
      // 수위 센서(PIN_LEVEL_MT)가 High가 될 때까지 입수
      if (digitalRead(PIN_LEVEL_MT) == HIGH) {
        digitalWrite(PIN_RELAY_RECYCLE_VALVE, LOW);
        digitalWrite(PIN_RELAY_RAW_WATER, LOW);
        changeState(DOSING_A);
      }
      break;

    case DOSING_A:
      digitalWrite(PIN_RELAY_DOSE_A, HIGH);
      if (elapsed > DOSING_TIME_MS) {
        digitalWrite(PIN_RELAY_DOSE_A, LOW);
        changeState(DOSING_B);
      }
      break;

    case DOSING_B:
      digitalWrite(PIN_RELAY_DOSE_B, HIGH);
      if (elapsed > DOSING_TIME_MS) {
        digitalWrite(PIN_RELAY_DOSE_B, LOW);
        changeState(STABILIZING);
      }
      break;

    case STABILIZING:
      digitalWrite(PIN_RELAY_MIX_PUMP, HIGH); // 순환 펌프 가동
      if (elapsed > STABILIZE_TIME_MS) {
        digitalWrite(PIN_RELAY_MIX_PUMP, LOW);
        // 여기서 EC/pH 측정 후 목표달성 시 SUPPLYING으로
        changeState(SUPPLYING);
      }
      break;

    case SUPPLYING:
      digitalWrite(PIN_RELAY_SUPPLY_VALVE, HIGH);
      if (elapsed > 5000) { // 5초 후 이송 완료 가정
        digitalWrite(PIN_RELAY_SUPPLY_VALVE, LOW);
        changeState(MISTING_ACTIVE);
      }
      break;

    case MISTING_ACTIVE:
      handle_zoned_misting();
      break;

    case RECYCLE_PROCESS:
      // 배액 수거조(DCT) -> 정제수조(RWT) 이송 로직
      digitalWrite(PIN_RELAY_UV, HIGH); // UV 예열
      if (elapsed > 60000) { // 60초 예열 후 펌프 가동
        digitalWrite(PIN_RELAY_DRAIN_VALVE, HIGH);
        if (digitalRead(PIN_LEVEL_DCT) == LOW) { // 수거조 비었을 때 종료
          digitalWrite(PIN_RELAY_DRAIN_VALVE, LOW);
          changeState(IDLE);
        }
      }
      break;

    case EMERGENCY:
      all_off();
      break;
  }

  // 3. Heartbeat (Reporting to Rails)
  if (now - lastHeartbeat > 2000) {
    lastHeartbeat = now;
    publish_status();
  }
}

void changeState(SystemState newState) {
  Serial.print("State Change: ");
  Serial.print(currentState);
  Serial.print(" -> ");
  Serial.println(newState);
  currentState = newState;
  stateStartTime = millis();
}

void all_off() {
  digitalWrite(PIN_RELAY_RAW_WATER, LOW);
  digitalWrite(PIN_RELAY_UV, LOW);
  digitalWrite(PIN_RELAY_MIX_PUMP, LOW);
  digitalWrite(PIN_RELAY_DOSE_A, LOW);
  digitalWrite(PIN_RELAY_DOSE_B, LOW);
  digitalWrite(PIN_RELAY_SUPPLY_VALVE, LOW);
}

void handle_zoned_misting() {
  // 수압 유지를 위해 구역별 순차 분사
  static unsigned long lastZoneSwitch = 0;
  
  // 목표 관수량에 따른 분사 시간 계산 (ms) - 보정 계수 자동 반영
  long mistDurationMs = calculateMistingDuration(TARGET_VOL_PER_UNIT);

  if (millis() - lastZoneSwitch > mistDurationMs) {
    lastZoneSwitch = millis();
    
    // 안전을 위해 이전 모든 밸브 끔
    digitalWrite(PIN_RELAY_ROW_1_VALVE, LOW);
    digitalWrite(PIN_RELAY_ROW_2_VALVE, LOW);

    currentMistingZone++;
    
    // 현재는 코어 보드에서 구역 2개만 시뮬레이션 중 (실제 확장 가능)
    if (currentMistingZone > 2) { 
      currentMistingZone = 0;
      changeState(IDLE);
      return;
    }

    // 현재 구역 켬 (펌프 유량이 허용하는 범위 내에서 확장 제어)
    if (currentMistingZone == 1) digitalWrite(PIN_RELAY_ROW_1_VALVE, HIGH);
    if (currentMistingZone == 2) digitalWrite(PIN_RELAY_ROW_2_VALVE, HIGH);
    
    Serial.print("Misting Zone: ");
    Serial.print(currentMistingZone);
    Serial.print(" | Duration: ");
    Serial.print(mistDurationMs);
    Serial.println("ms");
  }
}

void publish_status() {
  StaticJsonDocument<300> doc;
  doc["state"] = currentState;
  doc["source"] = isRecyclingMode ? "RECYCLED" : "RAW";
  doc["zone"] = currentMistingZone;
  doc["clog_factor"] = CLOG_COMPENSATION_FACTOR;
  doc["uptime"] = millis() / 1000;
  
  char buffer[256];
  serializeJson(doc, buffer);
  client.publish("smartfarm/status/core", buffer);
}

void handle_manual_control() {
  // Logic for hardware buttons when offline/manual
  Serial.println("Warning: Manual Mode Active");
}
