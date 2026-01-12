import paho.mqtt.client as mqtt
import time
import json
import random
import urllib.request
import threading
import sys
import csv
import os
from datetime import datetime

# --- SIMULATION CONFIG ---
BROKER = "broker.emqx.io" # EMQX (Try Secure WSS on Web)
PORT = 1883
TOPIC_SENSOR = "k-farm/wasabi/jerry/sensors_v2"
TOPIC_CONTROL = "k-farm/wasabi/jerry/control_v2"

# --- REAL WEATHER SERVICE ---
current_seoul_temp = -6.0 # Default Fallback (User Report)

def fetch_real_weather():
    global current_seoul_temp
    
    try:
        # Open-Meteo API v1 (Updated for better accuracy)
        # Seoul, Timezone included
        url = "https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m&timezone=Asia%2FSeoul"
        
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            # Parse new V1 format
            if 'current' in data and 'temperature_2m' in data['current']:
                new_temp = data['current']['temperature_2m']
                current_seoul_temp = new_temp
                print(f"[WEATHER] Real-Time Sync (Seoul): {current_seoul_temp}°C")
            else:
                 # Fallback to legacy if needed
                 new_temp = data['current_weather']['temperature']
                 current_seoul_temp = new_temp
                 print(f"[WEATHER] Legacy Sync (Seoul): {current_seoul_temp}°C")
                 
    except Exception as e:
        print(f"[WEATHER] Sync Failed: {e}")
        # If fail, keep last known or default (do not reset to 25 if we have a value)
    
    # Schedule next update in 5 minutes (300 seconds)
    threading.Timer(300, fetch_real_weather).start()

# --- MOCK HARDWARE (Digitwin) ---
class MockHardware:
    def __init__(self):
        self.ph = 6.8
        self.ec = 1.2
        self.temp = 14.5 # Internal Nutrient Temp
        self.level = 45.0
        self.pump_state = "OFF"
        self.chiller_state = "OFF"
        self.heater_state = "OFF"
        
        # Dosing Pumps (Valves)
        self.valve_a_state = 0.0
        self.valve_b_state = 0.0
        self.acid_valve_state = 0.0
        
        # Fans
        self.fan_exh = False
        self.fan_circ = False
        self.inlet_valve = False
        self.raw_pump_state = "OFF" # [NEW] Water Supply Pump
        self.air_hum = 60.0 # [NEW] Indoor Air Humidity (Separate from Tiers)
        self.air_temp = 12.0 # [NEW] Indoor Air Temperature (Cooler than Water)
        
        self.tiers = []
        
        # Initialize Tiers
        for i in range(25):
            self.tiers.append({
                "temp": 20.0 + (i * 0.5), # [FIX] Stagger initial temps
                "hum": 40.0 + (i * 1.0)
            })
    
    def read_sensors(self):
        global current_seoul_temp
        
        # 1. Physics: Internal Temp drifts towards External (Seoul)
        # Insulation Factor: 0.015 (Standard Greenhouse)
        # [FIX] Apply drift to AIR TEMP, not Water Temp (Water has heater)
        self.air_temp += (current_seoul_temp - self.air_temp) * 0.02
        
        # Water Temp (self.temp) also loses heat to Air (slower)
        # [FIX] Increase Heat Loss (0.005 -> 0.01) to make temp drop faster
        self.temp += (self.air_temp - self.temp) * 0.01 
        
        # [FIX] Add organic noise so it doesn't look dead (18.0 -> 18.1 -> 17.9)
        # Increased noise amplitude to verify it's not locked
        self.temp += random.uniform(-0.15, 0.15)
        self.air_temp += random.uniform(-0.05, 0.05)

        # 2. HVAC Influence & Environmental Coupling
        if self.chiller_state == "ON":
            self.temp -= 0.2 # Slower cooling
            for t in self.tiers: t["hum"] -= 0.5 
        if self.heater_state == "ON":
            self.temp += 0.4 # Boost power to overcome winter cold (-5C)
            for t in self.tiers: t["hum"] -= 0.8 # 히터 가동 시 제습 효과 강화 (곰팡이 방지)
            
        # Ensure internal tank temp doesn't freeze or boil
        self.temp = max(5.0, min(35.0, self.temp))

        # ... (Fan logic unchanged) ...

        # [ORGANIC] Plant Biology
        metabolism = max(0.1, min(1.0, (self.temp - 5) / 20.0))
        transpiration = 0.05 * metabolism
        
        # Tank Physics (Refill vs Transpiration)
        # MUST have both Pump ON and Valve ON to refill (Realism)
        is_inlet = getattr(self, 'inlet_valve', False)
        is_raw = (self.raw_pump_state == "ON")
        
        if is_inlet and is_raw:
            # [FIX] Slow down refill to allow Mixer time to work
            # Old: 30.0 (Too fast) -> New: 1.2 (User Requested: Moderate Speed)
            self.level += 1.2 
            
            # [PHYSICS FIX] Dilution Effect: Fresh water lowers EC and restores pH to neutral
            # This forces the Mixer to kick in after refill!
            self.ec -= 0.01 
            self.ph += (7.0 - self.ph) * 0.05 
        elif is_raw:
             # Raw pump ON but Inlet CLOSED -> Pressure build up / slight leakage
             self.level += 0.05 
        elif is_inlet:
             # Gravity flow
             self.level += 0.01 
             if random.random() < 0.2: print("[PHYSICS] ⚠️ BLOCKAGE: RAW PUMP is ON but INLET VALVE is CLOSED (No Flow)")
            
        self.level -= transpiration
        
        # [AEROPONICS] Pump Physics - ADD INTERLOCK (Level > 0)
        pump_on = (getattr(self, 'pump_state', 'OFF') == "ON")
        if pump_on and self.level > 1.0: # 1L 미만이면 실제로는 흡입 불능
            self.level -= 0.5 # High pressure spray consumes water
            for t in self.tiers: 
                t["hum"] += 3.0 # Mist boosts humidity rapidly
        else:
            # Force Pump Feedback to OFF if level is 0
            if pump_on: self.pump_state = "OFF"
            pass
        
        self.level = max(0.0, min(200.0, self.level))
        
        for t in self.tiers: t["hum"] += transpiration * 20 # Boost transpiration
        
        # Nutrient Physics (Dosing)
        # Metering Pump A & B both increase EC
        # Agit Pump (acid_valve) is for mixing
        valve_a_val = getattr(self, 'valve_a', 0)
        valve_b_val = getattr(self, 'valve_b', 0)
        acid_val = getattr(self, 'valve_acid', 0)
        
        # EC Level: Both pumps add nutrients
        if valve_a_val > 0 or valve_b_val > 0:
            self.ec += 0.20 # 제어 반응 속도 강화 (0.05 -> 0.20)
        else:
            self.ec -= 0.005 # 소폭 소비 증가
            
        # pH Level: Agit Pump (Acid Valve) lowers pH for control
        if acid_val > 0:
            self.ph -= 0.40 # 산 투입 반응 속도 대폭 강화 (0.15 -> 0.40)
        else:
            # 자연 표류: 7.0 (중성)을 향해 아주 천하게 수렴하도록 변경 (14까지 폭주 방지)
            self.ph += (7.0 - self.ph) * 0.002 
            
        # [NEW] Sensor Dry-out Protection
        # If water level is critically low, sensors read 0
        if self.level < 5.0:
            self.ph = 0.0
            self.ec = 0.0
        else:
            # Clamp Values to nominal ranges when water is present
            self.ph = max(2.0, min(12.0, self.ph))
            self.ec = max(0.1, min(5.0, self.ec))

        # [DEBUG LOG]
        if acid_val > 0:
            print(f"[PHYSICS] pH Dosing Active: {self.ph:.2f}")

        # [MAJOR PHYSICS FIX] Separate Air Temp and Water Temp logic clearly
        # self.temp = Water Temp (Nutrient Tank) -> Controlled by Heater/Chiller
        # self.air_temp = Room Air Temp -> Controlled by HVAC & External Weather
        
        # 1. Tiers follow WATER TEMP (Root Zone) more than Air
        # This creates the desired contrast: Air might be cold (-5 outside -> 10 inside), but Roots are 18 (Heated Water)
        # [FIX] Increase water coupling to 90% because root zone is drenched in water
        water_temp = self.temp 
        
        for i, t in enumerate(self.tiers):
            # Vertical Gradient + Water Temp Influence
            height_factor = (i - 12) * 0.2 # Increased gradient: -2.4 to +2.4 deg
            
            # Root Zone Temp = 90% Water Temp + 10% Air Temp
            target_tier_temp = (water_temp * 0.9) + (self.air_temp * 0.1) + height_factor
            
            t["temp"] += (target_tier_temp - t["temp"]) * 0.1
            t["temp"] += random.uniform(-0.05, 0.05)
            
            # Humidity Physics (Drift to 70-90%)
            t["hum"] += (85.0 - t["hum"]) * 0.02
            t["hum"] = max(40.0, min(99.0, t["hum"])) + random.uniform(-0.5, 0.5)

        # [DLI] Daily Light Integral Placeholder
        ppfd = 250.0 + random.uniform(-2.0, 2.0)

        # 4. Final Output Construction with Signal Jitter (Simulation of Real Senors)
        # We add 0.02 jitter to pH and 0.005 to EC to make the signal look 'alive'
        out_ph = round(self.ph + random.gauss(0, 0.015), 2)
        out_ec = round(self.ec + random.gauss(0, 0.004), 3)

        season_label = "WINTER"
        if current_seoul_temp > 20: season_label = "SUMMER"

        # [FIX] Independent Indoor Air Humidity Physics
        target_indoor_hum = 50.0 # Target dry humidity
        
        # 1. Natural Drift (Diffusion)
        if self.air_hum > target_indoor_hum: self.air_hum -= 0.05
        else: self.air_hum += 0.05
        
        # 2. Transpiration Effect (From wet tiers)
        avg_tier_hum = sum(t["hum"] for t in self.tiers) / len(self.tiers)
        if avg_tier_hum > 80: self.air_hum += 0.1 # Wet roots make air humid slowly

        # 3. HVAC (Exhaust Fan is powerful dehumidifier)
        if self.fan_exh:
            self.air_hum -= 0.8 # Rapid drop
        
        # Clamp
        self.air_hum = max(30.0, min(95.0, self.air_hum))

        return {
            "level": round(self.level, 1),
            "ph": round(self.ph, 2),
            "ec": round(self.ec, 2),
            "temp": round(self.temp, 1),
            "pump": self.pump_state,
            "chiller": self.chiller_state,
            "heater": self.heater_state,
            "inlet": "ON" if getattr(self, 'inlet_valve', False) else "OFF", # [RESTORED]
            "raw": self.raw_pump_state, # [RESTORED]
            "valveA": getattr(self, 'valve_a', 0),
            "valveB": getattr(self, 'valve_b', 0),
            "acid": getattr(self, 'valve_acid', 0),
            "tiers": self.tiers,
            "season": season_label,
            # [FIX] Add live noise to External Temp so it doesn't look stuck
            "external_temp": round(current_seoul_temp + random.uniform(-0.2, 0.2), 1),
            "air_hum": round(self.air_hum + random.uniform(-0.1, 0.1), 1), # [NEW] Send distinct Air Hum
            "timestamp": time.time()
        }

    def set_pump(self, state):
        self.pump_state = state
        print(f"[HW] Pump -> {state}")

    def set_chiller(self, state):
        self.chiller_state = state
        print(f"[HW] Chiller -> {state}")

    def set_heater(self, state):
        self.heater_state = state
        print(f"[HW] Heater -> {state}")
        
    def set_valve_a(self, val):
        self.valve_a = val
        print(f"[HW] Valve A -> {val}")

    def set_valve_b(self, val):
        self.valve_b = val
        print(f"[HW] Valve B -> {val}")

    def set_valve_acid(self, val):
        self.valve_acid = val
        print(f"[HW] Acid Valve -> {val}")

hw = MockHardware()

# --- MQTT CALLBACKS ---
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
        client.subscribe(TOPIC_CONTROL)
    else:
        print(f"Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        
        # Helper to normalize Boolean/String to "ON"/"OFF"
        def normalize(val):
            if val is True or str(val).upper() == "TRUE" or str(val).upper() == "ON":
                return "ON"
            return "OFF"

        if "pump" in payload: hw.set_pump(normalize(payload["pump"]))
        if "chiller" in payload: hw.set_chiller(normalize(payload["chiller"]))
        if "heater" in payload: hw.set_heater(normalize(payload["heater"]))
        
        # Dosing Commands (Numeric)
        if "valveA" in payload: hw.set_valve_a(float(payload["valveA"]))
        if "valveB" in payload: hw.set_valve_b(float(payload["valveB"]))
        if "acid" in payload: hw.set_valve_acid(float(payload["acid"]))
        
        # HVAC & System (Boolean-like strings)
        if "fan_exh" in payload: hw.fan_exh = (normalize(payload["fan_exh"]) == "ON")
        if "fan_circ" in payload: hw.fan_circ = (normalize(payload["fan_circ"]) == "ON")
        if "raw" in payload: 
            hw.raw_pump_state = normalize(payload["raw"])
            print(f"[MQTT] Received Raw Pump: {hw.raw_pump_state}")
        
        if "inlet" in payload: 
            hw.inlet_valve = (normalize(payload["inlet"]) == "ON")
            print(f"[MQTT] Received Inlet Valve: {'OPEN' if hw.inlet_valve else 'CLOSED'}")

        # [NEW] Force Refill / Safety Clear
        if "reset_dry_run" in payload and payload["reset_dry_run"]:
            if hw.level < 5.0:
                hw.level = 5.0 # 즉시 최소 수위 확보하여 센서 활성화
                print("[MQTT] 💧 Safety Reset: Minimum water level forced for sensor activation")

        # System Reset (Restore nominal values)
        if "reset" in payload and (payload["reset"] is True or payload["reset"] == "true"):
            hw.ph = 6.8
            hw.ec = 1.3
            hw.temp = 15.5
            hw.level = 200.0 # 리셋 시 물탱크 가득 채움 (200L)
            for t in hw.tiers:
                t["temp"] = 15.0
                t["hum"] = 60.0
            print("[HW] 🚨 시스템 풀 리셋 완료: 모든 센서와 물탱크가 정상 수치로 복구되었습니다.")
        
    except Exception as e:
        print(f"Error parsing message: {e}")

# --- MAIN LOOP ---
def run_bridge():
    # Start Weather Service
    fetch_real_weather()

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect_async(BROKER, PORT, 60)
    except Exception as e:
        print(f"Could not connect to MQTT: {e}")
        sys.exit(1)

    client.loop_start()

    print(f"Starting Live Data Transmission on {TOPIC_SENSOR}...")
    
    # Ensure logs directory exists
    if not os.path.exists("logs"):
        os.makedirs("logs")

    try:
        while True:
            data = hw.read_sensors()
            client.publish(TOPIC_SENSOR, json.dumps(data))
            
            # [DATABASE] CSV Logging
            try:
                today_str = datetime.now().strftime("%Y%m%d")
                log_file = f"logs/sensor_log_{today_str}.csv"
                file_exists = os.path.isfile(log_file)
                
                with open(log_file, 'a', newline='') as f:
                    writer = csv.writer(f)
                    # Write Header if new file
                    if not file_exists:
                        writer.writerow(["Timestamp", "External_Temp", "Internal_Temp", "pH", "EC", "Water_Level", "Heater", "Chiller", "Pump", "VPD"])
                    
                    # Calculate VPD for logging (Consistency)
                    # Simple Approx if not provided by hardware (Hardware sends raw tiers, but Bridge 'data' has aggregations?)
                    # 'data' keys: ph, ec, temp, ppfd, level, pump, chiller, heater, tiers, season, external_temp
                    # Note: 'data' dict doesn't assume VPD is pre-calculated in Bridge V1 logic, but we can compute or skip.
                    # We'll log raw metrics.
                    writer.writerow([
                        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        data.get('external_temp', 0),
                        data.get('temp', 0),
                        data.get('ph', 0),
                        data.get('ec', 0),
                        data.get('level', 0),
                        data.get('heater', 'OFF'),
                        data.get('chiller', 'OFF'),
                        data.get('pump', 'OFF'),
                        # Derived VPD or placeholder
                        "N/A"
                    ])
            except Exception as log_err:
                print(f"[LOG ERROR] {log_err}")

            # Simple Console Dashboard
            if hw.raw_pump_state == "ON" or hw.inlet_valve:
                print(f"[LIVE] 💧 REFILLING... Level: {data['level']}L | Pump: {hw.pump_state}")
            else:
                print(f"[LIVE] External: {current_seoul_temp}C | Internal: {data['temp']}C | Level: {data['level']}L | Pump: {hw.pump_state}")
            
            time.sleep(1) # Send every 1 second (Better responsiveness)
    except KeyboardInterrupt:
        print("Stopping bridge...")
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    run_bridge()
