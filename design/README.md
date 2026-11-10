# DONTKNOW 설계 문서

> **이 폴더가 유일한 설계 기준이다.** 2026-11 전면 재구축판이다. 그 이전 설계(design/ 구 문서 00~19, docs/의 v5.4)는 폐기했다. 게임 캐논(이야기·숫자·단서·규칙)은 최신 확정 기획(v6.2)을 그대로 옮겼다. 그 위에 디자인 시스템·화면·기술·실행 문서를 새로 세웠다.
> 구현은 아직 시작하지 않는다. [P0 설계 잠금](06-execution/IMPLEMENTATION_ROADMAP.md)(서현 승인)과 [열린 질문](06-execution/OPEN_QUESTIONS.md) A 범주 확정이 먼저다.

## 한 줄

실종된 아들의 폰을 돌려받은 아버지가 그 폰을 뒤진다. 아들은 지금도 다른 기기로 흔적을 지우고 있다. 그 흔적이 사라지기 전에 붙잡아 진실과 아들의 위치를 밝혀낸다.

## 처음 읽는 순서

1. [Bible](00-foundation/Bible.md) — 정체성, 절대 원칙, 핵심 숫자
2. [PRD](01-product/PRD.md) → [FEATURE_SPECIFICATION](01-product/FEATURE_SPECIFICATION.md)
3. [BUSINESS_RULES](01-product/BUSINESS_RULES.md) — 게임이 어떻게 돌아가나
4. [DESIGN_SYSTEM](02-design/DESIGN_SYSTEM.md) → [NAVIGATION_ARCHITECTURE](02-design/NAVIGATION_ARCHITECTURE.md) → [SCREEN_SPECIFICATIONS](02-design/SCREEN_SPECIFICATIONS.md)
5. [SYSTEM_ARCHITECTURE](04-tech/SYSTEM_ARCHITECTURE.md)
6. [IMPLEMENTATION_ROADMAP](06-execution/IMPLEMENTATION_ROADMAP.md) → [OPEN_QUESTIONS](06-execution/OPEN_QUESTIONS.md)

## 문서 트리

| 폴더 | 문서 | 역할 |
|---|---|---|
| **00-foundation** 기준 | [Bible](00-foundation/Bible.md) | 제품 정체성·절대 원칙·핵심 숫자·문서 지도 |
| | [PRODUCT_VISION](00-foundation/PRODUCT_VISION.md) | 비전·경험 목표·차별점·성공 기준 |
| | [PRODUCT_PRINCIPLES](00-foundation/PRODUCT_PRINCIPLES.md) | 디자인 기둥 P1~P7, 콘텐츠 가이드라인 |
| | [PROJECT_SCOPE](00-foundation/PROJECT_SCOPE.md) | 포함/제외, 플랫폼, MVP vs 본편 |
| | [REQUIREMENTS](00-foundation/REQUIREMENTS.md) | REQ-F(기능)·REQ-N(비기능) |
| **01-product** 기획·캐논 | [PRD](01-product/PRD.md) | 문제·목표·범위·지표·리스크 |
| | [FEATURE_SPECIFICATION](01-product/FEATURE_SPECIFICATION.md) | FEAT 목록, 앱 30종 카탈로그 |
| | [USER_PERSONAS](01-product/USER_PERSONAS.md) · [USER_JOURNEYS](01-product/USER_JOURNEYS.md) · [USER_FLOWS](01-product/USER_FLOWS.md) | 기준 플레이어, 5흐름 여정, 핵심 흐름도 |
| | [BUSINESS_RULES](01-product/BUSINESS_RULES.md) | 게임 규칙 총람(BR): 루프, 접근 층 T0~T4, 온라인/오프라인, "30분" 위기, 시계, 작성창 |
| | [NARRATIVE_CANON](01-product/NARRATIVE_CANON.md) | **세계·진실·연대기·숫자의 단일 출처** |
| | [CHARACTERS](01-product/CHARACTERS.md) | 인물 P·계정 A·기기 D, 앎 매트릭스, 대사 원칙 |
| | [LOCATIONS](01-product/LOCATIONS.md) | 장소 L, 이동 시간, 위치 추리(청운 미끼 / 해담 207) |
| | [EVIDENCE_LEDGER](01-product/EVIDENCE_LEDGER.md) | 단서 E 원장, 보존 수단 |
| | [ACTION_PROOF](01-product/ACTION_PROOF.md) | 행동 증명 V-01~16, 낱말 사전 |
| | [PROGRESSION_AND_ENDINGS](01-product/PROGRESSION_AND_ENDINGS.md) | 게이트 G, 사건 EV, NPC 상태, 플래그 F, 엔딩 판정, 힌트 목표 |
| | [TRACES_AND_REACTIONS](01-product/TRACES_AND_REACTIONS.md) | 흔적 TR-01~19, 반응 지연 |
| | [PLAYTIME_BUDGET](01-product/PLAYTIME_BUDGET.md) | 보수 97 / 일반 165분, 시계 ×4 |
| **02-design** UI/UX | [DESIGN_SYSTEM](02-design/DESIGN_SYSTEM.md) | Apple HIG 원칙의 재해석, 위계·색·타이포·그리드·다크 모드 |
| | [DESIGN_TOKENS](02-design/DESIGN_TOKENS.md) | **토큰 단일 출처**(`--lm-*`) |
| | [UI_UX_GUIDELINES](02-design/UI_UX_GUIDELINES.md) | 내비 패턴, 문구, 상태 표현, 확인창, 게임 특수 규칙 |
| | [NAVIGATION_ARCHITECTURE](02-design/NAVIGATION_ARCHITECTURE.md) | **화면 목록(SCR) 단일 출처**, 내비 모델, 딥링크 |
| | [SCREEN_SPECIFICATIONS](02-design/SCREEN_SPECIFICATIONS.md) · [_SNS_SETTINGS](02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md) · [_APPS](02-design/SCREEN_SPECIFICATIONS_APPS.md) | 화면별 상세(공통 패턴, P0 34개 14항목 전부, P1 144개) |
| | [COMPONENT_SPECIFICATIONS](02-design/COMPONENT_SPECIFICATIONS.md) | **컴포넌트(CMP) 단일 출처** |
| | [INTERACTION_SPECIFICATIONS](02-design/INTERACTION_SPECIFICATIONS.md) | 마이크로 인터랙션·전환·동작 줄이기 대체 |
| | [RESPONSIVE_DESIGN](02-design/RESPONSIVE_DESIGN.md) · [ACCESSIBILITY](02-design/ACCESSIBILITY.md) | 320~430·데스크톱 프레임 / WCAG 2.2 AA |
| | [ICONOGRAPHY_AND_IMAGERY](02-design/ICONOGRAPHY_AND_IMAGERY.md) | 아이콘 30종·시스템 글리프, 폰 속 사진, 카메라 방, 시네마틱 |
| **03-features** 기능 상세 | [SYSTEM_SHELL](03-features/SYSTEM_SHELL_SPECIFICATION.md) | 잠금화면·홈·알림·제어 센터·검색·공유·작성창·일시정지 |
| | [MESSAGING](03-features/MESSAGING_SPECIFICATION.md) | 전화·메시지·톡(일반 메신저)·연락처 |
| | [SECURE_MESSAGING](03-features/SECURE_MESSAGING_SPECIFICATION.md) | 블링크(보안 메신저), 보안 표현 원칙 |
| | [SNS](03-features/SNS_SPECIFICATION.md) | 루프(메인 SNS: 사진 게시물 + 글 게시물 결합) |
| | [VIDEO_AND_COMMUNITY](03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md) | 튜브·모아 |
| | [MAIL_AND_CLOUD](03-features/MAIL_AND_CLOUD_SPECIFICATION.md) | 메일·시러스 ID·동기화·찾기·원격 지우기 |
| | [MAPS_AND_MOBILITY](03-features/MAPS_AND_MOBILITY_SPECIFICATION.md) | 지도·바로택시·날씨·지갑 교통 |
| | [MEDIA](03-features/MEDIA_SPECIFICATION.md) | 사진·카메라·음성 메모·파일 |
| | [PERSONAL_DATA_APPS](03-features/PERSONAL_DATA_APPS_SPECIFICATION.md) | 캘린더·메모·미리 알림·시계·건강·계산기·웨이브·한서 포털 |
| | [COMMERCE_AND_FINANCE](03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md) | 누리은행·한끼·이웃마켓·지갑 결제 |
| | [SETTINGS](03-features/SETTINGS_SPECIFICATION.md) | 설정 앱 수사(메뉴 지도) |
| **04-tech** 기술 | [SYSTEM_ARCHITECTURE](04-tech/SYSTEM_ARCHITECTURE.md) · [FRONTEND_ARCHITECTURE](04-tech/FRONTEND_ARCHITECTURE.md) | 구조·데이터 흐름 / `game/` 모듈·라우팅·렌더링 |
| | [BACKEND_ARCHITECTURE](04-tech/BACKEND_ARCHITECTURE.md) | **백엔드 없음**, 게임 속 서버의 클라이언트 시뮬레이션 |
| | [DATABASE_SCHEMA](04-tech/DATABASE_SCHEMA.md) | 서버 DB 없음 → 콘텐츠 JSON 스키마·세이브·린터 |
| | [API_SPECIFICATION](04-tech/API_SPECIFICATION.md) | HTTP 없음 → 내부 모듈 API·이벤트 버스·테스트 훅 |
| | [AUTHENTICATION_AND_SECURITY](04-tech/AUTHENTICATION_AND_SECURITY.md) | 게임 속 인증(070921·680403·110221), 실제 보안 |
| | [STATE_MANAGEMENT](04-tech/STATE_MANAGEMENT.md) · [FILE_AND_MEDIA_MANAGEMENT](04-tech/FILE_AND_MEDIA_MANAGEMENT.md) | 상태 트리·동기화·시계 / 이미지·폰트·가상 미디어 |
| **05-quality** 품질 | [DEVELOPMENT_GUIDELINES](05-quality/DEVELOPMENT_GUIDELINES.md) · [TESTING_STRATEGY](05-quality/TESTING_STRATEGY.md) · [ERROR_HANDLING](05-quality/ERROR_HANDLING.md) · [PERFORMANCE_REQUIREMENTS](05-quality/PERFORMANCE_REQUIREMENTS.md) · [DEPLOYMENT_ARCHITECTURE](05-quality/DEPLOYMENT_ARCHITECTURE.md) · [PROTOTYPE_FINDINGS](05-quality/PROTOTYPE_FINDINGS.md) | 개발 규칙, 테스트, 오류, 성능, 빌드·배포, 프로토타입 검수 |
| **06-execution** 실행 | [IMPLEMENTATION_ROADMAP](06-execution/IMPLEMENTATION_ROADMAP.md) · [DEVELOPMENT_PHASES](06-execution/DEVELOPMENT_PHASES.md) | 단계 P0~P8, 작업 패킷 WP |
| | [ACCEPTANCE_CRITERIA](06-execution/ACCEPTANCE_CRITERIA.md) | 인수 조건 AC(REQ 전부 대응) |
| | [DESIGN_TRACEABILITY](06-execution/DESIGN_TRACEABILITY.md) | 단일 출처 표, REQ→FEAT→명세→SCR→AC→WP, 구 문서 이전표 |
| | [OPEN_QUESTIONS](06-execution/OPEN_QUESTIONS.md) | 확인 사항(A 서현 결정 / B 기본값 확정 / C 해결) |

## ID 규칙

| 접두 | 뜻 | 단일 출처 |
|---|---|---|
| P- / A- / D- | 인물 / 계정 / 기기 | [CHARACTERS](01-product/CHARACTERS.md) |
| L- | 장소 | [LOCATIONS](01-product/LOCATIONS.md) |
| E- | 단서 | [EVIDENCE_LEDGER](01-product/EVIDENCE_LEDGER.md) |
| V- | 행동 증명 | [ACTION_PROOF](01-product/ACTION_PROOF.md) |
| G- / EV- / DH-·JH-·SA-·MJ-·KS- / F- | 게이트 / 사건 / NPC 상태 / 플래그 | [PROGRESSION_AND_ENDINGS](01-product/PROGRESSION_AND_ENDINGS.md) |
| TR- | 흔적 | [TRACES_AND_REACTIONS](01-product/TRACES_AND_REACTIONS.md) |
| BR- | 게임 규칙 | [BUSINESS_RULES](01-product/BUSINESS_RULES.md) |
| T0~T4 | 정보 접근 층 | [BUSINESS_RULES](01-product/BUSINESS_RULES.md) |
| REQ-F- / REQ-N- | 요구사항 | [REQUIREMENTS](00-foundation/REQUIREMENTS.md) |
| FEAT- | 기능 | [FEATURE_SPECIFICATION](01-product/FEATURE_SPECIFICATION.md) |
| SCR- | 화면 | [NAVIGATION_ARCHITECTURE](02-design/NAVIGATION_ARCHITECTURE.md) |
| CMP- | 컴포넌트 | [COMPONENT_SPECIFICATIONS](02-design/COMPONENT_SPECIFICATIONS.md) |
| `--lm-*` | 디자인 토큰 | [DESIGN_TOKENS](02-design/DESIGN_TOKENS.md) |
| AC- / WP- | 인수 조건 / 작업 패킷 | [ACCEPTANCE_CRITERIA](06-execution/ACCEPTANCE_CRITERIA.md) / [DEVELOPMENT_PHASES](06-execution/DEVELOPMENT_PHASES.md) |
| Q-OPEN- | 확인 사항 | [OPEN_QUESTIONS](06-execution/OPEN_QUESTIONS.md) |

## 고정 전제

- 1인용 **웹 게임**. 메신저·SNS·메일은 게임 속 가상 앱이다. 상대는 대본이 있는 NPC다. 실제 계정·서버·DB·네트워크는 없다.
- 기술: 바닐라 JS(ES2020) + DOM/CSS, JSON 콘텐츠 → Python 빌드 → 단일 HTML, localStorage 저장, Playwright 테스트. 새 라이브러리 없음.
- `mvp/`, `prototype/`은 폐기된 v5 코드다. 참고만 하고 수정하지 않는다. 새 구현은 `game/`.
