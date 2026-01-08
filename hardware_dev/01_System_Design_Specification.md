# KF-MOD-2026 모듈러 수직 농장 시스템 설계 사양서 (System Design Specification)

**Project:** KF-MOD-2026 (Modular Vertical Farm - Wasabi Edition)
**Version:** 1.0
**Lead Engineer:** Antigravity (AI System Architect)
**Status:** Initial Draft (Engineering-First Approach)

---

## 1. 핵심 개념 정립 (Core Concept)
*   **대상 작물:** 고추냉이(Wasabi) - 수온 15~18℃, 고습도, 정밀 양액 관리 필수.
*   **플랫폼:** 600mm x 600mm 아토믹 풋프린트를 기반으로 한 수직 적층형 모듈.
*   **수립 목표:** 상업적 공간(카페, 레스토랑)에 적합한 심미성을 유지하면서, 실제 산업용 성능(고압 미스트, 정밀 수온 제어)을 충족하는 엔지니어링 실체 구현.

## 2. 레이아웃 설정 (Layout Setting)
*   **수직 구성 (Vertical Stack):**
    *   **Tier 0 (Bottom Hub):** 양액 저장, 펌프, 필터, 제어부, 열교환기 집약부.
    *   **Tier 1~3 (Grow Module):** 실제 재배 공간 (에어로포닉스 분사 노즐 및 트레이).
    *   **Top Cap:** 환기 팬 및 상단 전원 분배기.
*   **측면 구성:**
    *   **Spine Area (후면):** 배관 및 배선용 수직 채널 (Maintenance Spine).

## 3. 설계 시 고려사항 (Design Constraints & Considerations)
*   **용량 확보 (Liquid Volume):** 순환 및 완충 작용을 위해 최소 80L의 양액 확보 필수.
*   **수온 유지 (Thermal Control):** 고압 펌프 작동 열 및 외부 열기 차단을 위한 하단 모듈 단열 필수. 필요 시 페티어(Peltier) 또는 소형 드라이 칠러 공간 확보.
*   **안전성 (IP Rating):** 물과 전기가 공존하므로 제어부와 펌프실의 물리적 격리(Bulkhead) 설계.
*   **정비성 (Maintenance):** 필터 교체 및 양액 보충을 위한 전면 슬라이딩 또는 도어 구조.

## 4. 완성품 구조 (Structure)
*   **Frame:** AL6063-T5 알루미늄 프로파일 (3030 또는 4040 규격).
*   **Panel:** 고투명 강화유리 또는 PC (재배부), 단열재가 포함된 복합 판넬 (하부).
*   **Interlocking:** 모듈 간 체결을 위한 고정밀 가이드 핀 및 볼트 조립 방식.

## 5. 소요부품 사양 및 공간 확보 (Specs & Spatial Allocation) - *Bottom Hub 집중 분석*

### 80L 양액 확보를 위한 체적 계산
*   **밑면적:** 600mm x 600mm (0.36㎡)
*   **순수 액체 점유 높이:** 80,000㎤ / 3,600㎠ = **222.2mm (22.2cm)**
*   **여유 공간 (Safety Margin):** 출렁임 및 상단 부품 간섭 방지를 위해 수위 상단 50mm 여유 필요. -> **272.2mm**
*   **부품 설치 공간:**
    *   **고압 펌프 (Horizontal Multistage):** 설치 브래킷 포함 최소 높이 **180mm** 요구.
    *   **제어부 및 배선 (Control Box):** 침수 방지를 위해 최상단 배치, 최소 **100mm** 요구.
*   **중간 격벽 (Internal Shelf):** 펌프와 제어부 지지를 위한 프레임 높이.

### 최종 하단 허브(Bottom Hub) 최소 높이 산정 (Z-Axis)
*   탱크 유효 높이(270mm) + 펌프/필터 기계실(180mm) + 제어부/절연부(100mm) = **총 550mm**
*   **결론:** 이전의 300mm 설계는 물리적으로 불가능함. **최소 550mm~600mm의 하부 공간 확보가 엔지니어링적 진실임.**

---

## 6. 공간 면적 및 위치 결정 (Spatial Positioning)
*(다음 단계에서 CAD 레이아웃 형식으로 상세 기술 예정)*

## 7. 프레임 조립 순서 및 방법 (Assembly Sequence)
*(구조 확정 후 정밀 기술 예정)*
