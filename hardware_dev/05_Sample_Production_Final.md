# KF-MODULAR-1500 스탠다드 듀오 샘플 제작 통합 명세서
**Model Name:** Standard Duo (1500mm High)
**Target:** Prototype Production & Commercial Sampling
**Date:** 2026-01-08
**Version:** 2.1 (Lean Specs - No Chiller)

---

## 📐 1. 외해 및 치수 (Dimensions & Layout)

| 항목 | 수치 | 비고 |
| :--- | :--- | :--- |
| **총 높이 (H)** | 1,500 mm | 바텀 허브(300) + 재배 유닛(600) x 2 |
| **가로 폭 (W)** | 600 mm | 표준 슬림형 |
| **깊이 (D)** | 600 mm | 표준 슬림형 |
| **프레임 규격** | AL 2020 | 아노다이징 블랙 (T-Slot) |
| **외장 마감** | Walnut / Glass | 마그네틱 착탈 방식 |

---

## 🧱 2. 샘플 1대 제작용 BOM (Detailed BOM for 1 Unit)

### [프레임 및 구조]
- **수직 기둥 (Pillar)**: AL-2020-1500 (1500mm) x 4ea
- **가로 빔 (Beam)**: AL-2020-600 (600mm) x 12ea
- **코너 커넥터 (Bracket)**: 3-Way Corner Bracket (2020용) x 16ea
- **수평 조절좌 (Foot)**: M8 다이캐스팅 조절좌 x 4ea
- **T-너트 & 볼트**: M5 렌치 볼트 (10mm) & M5 T-너트 x 100ea

### [바텀 허브 매커니즘 (Bottom Hub - 300H)]
- **순환 탱크**: PE 재질 슬림 탱크 (약 15L 용량) x 1ea
- **순환 펌프**: DC 24V 저전력 수중 펌프 (Max 5L/min) x 1ea
- **메인 컨트롤러**: MCU 통합 제어 보드 (Wi-Fi/앱 연동 지원) x 1ea
- **환기 팬**: 80mm 저소음 시스템 팬 (24V) x 2ea
- **외장 하단 커버**: 불투명 메탈 또는 다크 우드 밀폐형 커버 x 1set

### [재배 유닛 (Grow Unit - 600H x 2ea)]
- **식물 성장 LED**: 600mm 바형 Full Spectrum LED (30W) x 2ea
- **재배 트레이**: 600x600 ABS 사출 트레이 x 2ea
- **미스트 노즐**: 초미세 안개 분사 노즐 (0.3mm) x 4ea (유닛당 2개)
- **배관 파츠**: 16mm PE 튜브 및 퀵 커플러 x 1set

---

## 🔌 3. 전기 및 제어 배선도 (Electrical Wiring)

1. **Power Supply**: SMPS 24V/5A (Chiller 제외로 용량 최적화)
2. **Controller Wiring**:
    - **Output 1**: LED Bar (상하단 분리 제어 가능)
    - **Output 2**: 순환 펌프 (타이머 제어)
    - **Output 3**: 환기 팬 (실내 공조 활용 가변 제어)
3. **Sensor Input**:
    - **Port 1**: 상단 온습도 센서 (I2C/UART)
    - **Port 2**: 하단 수위 센서 (수위 감시)
