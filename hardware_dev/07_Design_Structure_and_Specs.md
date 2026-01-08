# KF-MOD-SERIES 상세 설계 구조 및 디자인 명세서 (Design Structure & Specs)

**Project:** KF-MOD-SERIES v2.0 (Commercial & Home Hybrid)
**Theme:** "The Invisible Mechanics" - 고성능 기술을 수려한 디자인 속에 숨기다.

---

## 1. 아토믹 설계 언어 (Atomic Design Language)
본 시스템은 **600mm x 600mm x 600mm**의 정육면체 공간(Cube)을 기본 단위로 합니다. 
이 '아토믹 큐브'는 기능에 따라 적층되거나 확장될 수 있으며, 모든 연결부는 표준화된 인터페이스를 가집니다.

### 1-1. 프레임 워크 (The Core Frame)
*   **재질:** AL6063-T5 High-Anodized Aluminum.
*   **구조:** 3030 T-Slot Profile을 베이스로 하되, 코너 결합부는 **'다이캐스트 히든 브래킷'**을 사용하여 외부에서 볼트가 노출되지 않는 일체형 룩을 구현합니다.
*   **Spine Channel (후면):** 100mm 폭의 수직 공간을 따로 분리하여 모든 전선, 튜브, 배수관이 이 공간을 통해 이동합니다. 외부에서는 매끈한 커버만 보입니다.

### 1-2. 스킨 시스템 (Interchangeable Skins)
사용자의 공간 성격에 따라 프레임에 부착하는 패널을 선택합니다.
*   **Natural Wood Layer:** 12mm 자작나무 합판 또는 월넛 천연 무늬목 (가정, 카페용).
*   **Industrial Matte Layer:** 2mm 알루미늄 복합 판넬 + 분체 도장 (식당, 키친용).
*   **Visual Transparency Layer:** 5mm 방담(Anti-fog) 처리 강화유리 (전면 쇼케이스용).

### 1.2 아토믹 모듈 규격 (Atomic Module)
*   **Core Hub (Bottom):** 600x600x550mm (메인 탱크, 펌프, 슬라이드 트레이 내장)
*   **Grow Module:** 600x600x500mm (독립 공조 팬, LED, 에어로포닉스 노즐)
*   **Smart Crown (Top):** 600x600x100mm (통합 제어 PCB, HMI, 배선 허브)

### 1.3 히든 배선 시스템 (Hidden Wiring Excellence)
*   **Internal Raceway:** 알루미늄 프로파일(4040/8080)의 중앙 중공부(Hollow center)를 수직 배선 관로로 활용.
*   **Pogo-Pin Interface:** 모듈 적층 면에 자석식 포고 핀(Spring-loaded pins)을 배치하여 별도의 커넥터 연결 없이 적층만으로 전원과 통신 회로 구성.

---

## 2. 제품 라인업별 규격 (Structural Dimensions)

### A. LITE (Home/Entry) - 총 높이 1550mm
*   **Bottom Hub (L):** 600 x 600 x **350mm** (30L 양액, 저소음 DC 펌프).
*   **Grow Module (2단):** 600 x 600 x 600mm x 2단.

### B. PRO/SPECIALTY (Commercial/Expert) - 총 높이 2300mm
*   **Bottom Hub (P):** 600 x 600 x **500mm** (60L 양액, 고압 펌프, 펠티어 냉각).
*   **Grow Module (3단):** 600 x 600 x 600mm x 3단.

---

## 3. 기능형 모듈 내부 설계 (Internal Layout)

### 3-1. 하단 허브 (Bottom Hub)
*   **Water-tight Compartment:** 하단 2/3 지점까지 PE 라이너 처리된 저장조.
*   **Pull-out Drawer:** 기계실(펌프, 필터)은 슬라이딩 레일을 적용하여 전면에서 서랍처럼 당겨 점검 가능.

### 3-2. 재배 모듈 (Grow Module)
*   **Aero-Deck:** 하단에 25A 대구경 배수구가 경사면 설계(Slope)와 함께 통합되어 물 고임 현상 원천 차단.
*   **Light-Board:** 상단 천장부에 LED 및 환기 팬 통합 (Invisible Wiring).

---

## 4. 디자인 포인트 (Key Visual Elements)
*   **Shadow Gap:** 외관 패널과 프레임 사이에 2mm의 일정한 간격(Shadow Gap)을 두어 모던하고 정교한 가구의 느낌을 줍니다.
*   **Ambient Light:** 하단 허브와 재배 모듈 사이의 접합부에 은은한 간접 조명을 배치하여 야간 인테리어 효과를 극대화합니다.
