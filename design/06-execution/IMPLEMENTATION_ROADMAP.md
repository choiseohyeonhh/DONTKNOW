# IMPLEMENTATION_ROADMAP — DONTKNOW v6.2

> **역할:** MVP 목표·범위, 단계 P0~P8, 구현 방식, 리스크, 열린 결정을 한 문서에서 고정한다. 구현 착수 전제는 **P0 설계 잠금 = 서현 승인**이다.
> **단일 출처:** 단계 P0~P8의 내용·산출물·완료 기준, MVP 범위, 리스크, 열린 결정. 원본은 [[IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md)](IMPLEMENTATION_ROADMAP.md)이며, 이 문서는 그 표를 새 문서 경로로 옮긴 것이다. 수치·ID는 원본과 같다.
> **참조:** [`../00-foundation/REQUIREMENTS.md`](../00-foundation/REQUIREMENTS.md), [`../00-foundation/PROJECT_SCOPE.md`](../00-foundation/PROJECT_SCOPE.md), [`../01-product/PRD.md`](../01-product/PRD.md), [`../01-product/FEATURE_SPECIFICATION.md`](../01-product/FEATURE_SPECIFICATION.md), [`../01-product/PLAYTIME_BUDGET.md`](../01-product/PLAYTIME_BUDGET.md), [`../04-tech/FRONTEND_ARCHITECTURE.md`](../04-tech/FRONTEND_ARCHITECTURE.md), [`../05-quality/TESTING_STRATEGY.md`](../05-quality/TESTING_STRATEGY.md), [`DEVELOPMENT_PHASES.md`](./DEVELOPMENT_PHASES.md), [`ACCEPTANCE_CRITERIA.md`](./ACCEPTANCE_CRITERIA.md), [`DESIGN_TRACEABILITY.md`](./DESIGN_TRACEABILITY.md), [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md).
> **적용 버전:** v6.2 (2026-11). 플랫폼은 모바일 웹(iPhone Safari 우선), 산출물은 단일 HTML이다.

## 0. 적용 전제

1. **P0 설계 잠금 전에는 `game/` 구현을 시작하지 않는다.** 이 문서 묶음(v6.2)에 대한 서현 승인이 P0 완료다.
2. `design/`의 v6.2 문서가 캐논이다. `docs/`, `mvp/`, `prototype/`의 폐기 설계를 구현 근거로 쓰지 않는다.
3. 구현 폴더는 새 `game/`이다. 모듈 트리·테스트 이름·빌드 방식은 [`FRONTEND_ARCHITECTURE`](../04-tech/FRONTEND_ARCHITECTURE.md)와 [`TESTING_STRATEGY`](../05-quality/TESTING_STRATEGY.md)를 따른다.
4. 이 문서의 "P0"·"P1"은 **단계 이름**이다. [`NAVIGATION_ARCHITECTURE`](../02-design/NAVIGATION_ARCHITECTURE.md) 3절의 화면 우선순위 `P0`(34개)·`P1`(144개)와 다른 표기이므로 혼동하지 않는다.
5. MVP 합격선은 **보수 90분 이상**, MVP 보수 목표는 **약 96분**이다. 측정은 P7에서 한다.

## 1. MVP의 목표

> **"이 게임만의 순간 네 개를 한 판에 경험시킨다."**
> ① 잠긴 폰에서 볼 수 있는 것(응급정보)으로 문을 열고, 아빠 생일로 아들의 편지를 연다.
> ② 눈앞에서 메모가 지워지고, "30분" 안에 카메라로 아들의 방을 찍어 내가 아빠라는 걸 증명한다.
> ③ 내가 본 것이 상대에게 보인다 — 서아의 스토리를 보자 서아가 먼저 말을 건다.
> ④ 계약서의 고시원은 미끼였다. 배달 주소와 키보드가 아들의 진짜 방을 가리킨다.

MVP가 이 넷을 재미있게 만들지 못하면 본편 확장은 의미가 없다.

## 2. MVP 범위 (보수 90분 이상)

본편 보수 97분([`PLAYTIME_BUDGET`](../01-product/PLAYTIME_BUDGET.md))에서 MVP 제외 항목(부계정 G-04 약 0분 — 이미 계산 밖, 하린 대화 0, 정체 숨김 0, 후일담 변주 −1, 실장 흔적 실험 0)을 빼면 **MVP 보수 약 96분**이다. 본편과 MVP의 차이는 대부분 계산 밖의 선택 콘텐츠다.

| 영역 | 포함 | 제외(본편) |
|---|---|---|
| 층 | T0~T3 전부 | — |
| 앱 | 30종 전부(○ 23종 완전 구현 / △ 7종 최소 데이터) | — |
| 설정 | [설정 수사](../03-features/SETTINGS_SPECIFICATION.md) ○ 메뉴 9개 + 암호 변경·가족·집중 모드 | 디스플레이·소리 세부 |
| 행동 증명 | V-01~V-06, V-09~V-14, V-16 | V-07(하린), V-08(부계정), V-15는 동작만(대사 최소) |
| 흔적 | TR-01~09, 11~13, 15, 17~19 | TR-10(부계정), TR-14 좋아요 반응 일부, TR-16 |
| 사건 | EV-01~09, 11~19, 21~23, 25~27, 30~35, 40~48 | EV-10 |
| NPC | 도현 DH 전체·F-MOVED, 지훈 JH-0~2, 서아 SA-0~2, 민지 MJ-0~2, 김태윤 회신, 실장 KS-0~3 | 하린 대화(글만), 정체 숨김 분기(′ 상태) |
| 엔딩 | A, A′, B, C, D(스틸 2컷 + 자막) | 후일담 변주 일부 |
| 아트 | 아이콘 30종(SVG), 폰 사진 30장(핵심 12장 최종 품질), 카메라 방 4구도 | 시네마틱 정식 스틸 |
| 기타 | 자동 저장, 디버그 패널, 시간 흐름 끄기, 일시정지 메뉴 힌트 | 소리, 수동 슬롯 |

**MVP 제외의 해석:** 제외 항목은 기능이 아예 없어도 된다는 뜻이 아니다. 데이터·빈 화면·짧은 반응으로 존재하고, 대사·연출·변주를 확장하지 않는다([`PROJECT_SCOPE`](../00-foundation/PROJECT_SCOPE.md) 4절).

## 3. 단계

| 단계 | 내용 | 산출물 | 완료 기준 |
|---|---|---|---|
| **P0 설계 잠금** | 이 문서 묶음 검토·확정. 열린 결정(5절) | design/ v6.2 확정 | 서현 승인 |
| **P1 OS 골격** | 상태바·잠금화면(응급정보)·홈·앱 전환·알림(미리보기 규칙)·제어 센터·검색, 콘텐츠 로더, 가시성, 시계 | 빈 앱 30개 | 잠금 해제 → 홈 → 앱 왕복, 깜빡임 0 |
| **P2 작성창·반응** | composer(추천·입력·공유·텍스트 대치), keywords, dialogue, verify, trace | 지훈 대화 1왕복, V-05 동작 | 클릭·입력만으로 서아 SA-2, 지훈 JH-2 테스트 통과 |
| **P3 온라인 계층** | Wi-Fi·동기화·앱별 스위치·다른 기기 기록·원격 삭제·대기열·원격 지우기·DH 상태 기계·카메라 | "30분" 위기 완성 | crisis.js: 다섯 해법 재현 |
| **P4 콘텐츠 1** | 메일·메모·연락처·캘린더·사진·지도·설정 데이터, 미끼(청운)와 진짜(해담) | ①·⑤ 흐름 | 미끼 격리·이중 경로 린터 통과 |
| **P5 콘텐츠 2** | 루프(차단·계정 정보·사진으로 찾기)·튜브·모아·은행·블링크, NPC 민지·김태윤·실장 | ②~④ 흐름 | route_a~d, traces, moved 통과 |
| **P6 아트** | 아이콘 SVG, 폰 사진, 카메라 방, 엔딩 스틸 | 아트 교체 | 16px 실루엣, 확대 판독 |
| **P7 플레이테스트** | 숙련 2 + 일반 4 블라인드 | 지표 리포트 | [PRODUCT_PRINCIPLES](../00-foundation/PRODUCT_PRINCIPLES.md) 8절, [PLAYTIME_BUDGET](../01-product/PLAYTIME_BUDGET.md) 6절 |
| **P8 본편 확장** | 제외분 + 부계정 + 정체 숨김 + 소리 | 본편 | 일반 165분 페이싱 |

- P7의 지표는 [`PRODUCT_PRINCIPLES`](../00-foundation/PRODUCT_PRINCIPLES.md) 8절, [`PLAYTIME_BUDGET`](../01-product/PLAYTIME_BUDGET.md) 6절 검증 계획, [`TESTING_STRATEGY`](../05-quality/TESTING_STRATEGY.md) 8절을 함께 따른다. 원본 [PLAYTIME_BUDGET](../01-product/PLAYTIME_BUDGET.md)의 7절이 새 단일 출처의 6절에 대응한다.
- 원본 단계 표의 문서 번호 참조는 지시서 1절에 따라 새 단일 출처 링크로 바꿨다.
- P0의 "design/ v6.2 확정"은 [P0 설계 잠금 체크리스트](#6-구현-착수-전제-p0-설계-잠금)를 통과한 상태를 뜻한다.

### 3.1 구현 방식

- 코드는 단계별 지시서로 opencode 에이전트에 맡길 수 있다. **P2(반응)와 P3(동기화)가 설계 의도가 가장 깊은 곳**이라, 지시서에 [`ACTION_PROOF`](../01-product/ACTION_PROOF.md)·[`PROGRESSION_AND_ENDINGS`](../01-product/PROGRESSION_AND_ENDINGS.md)·[`TRACES_AND_REACTIONS`](../01-product/TRACES_AND_REACTIONS.md)를 원문 그대로 붙이고 테스트를 먼저 쓰게 한다.
- 콘텐츠(JSON)는 작가가 쓰고 린터가 검사한다.

## 4. 리스크

| 리스크 | 영향 | 대응 |
|---|---|---|
| **판정 UI가 없어 "내가 맞았나" 모름** | 불안·이탈 | 모든 V에 분명한 세계의 반응(서아의 정정, 은행 열림, 경찰 회신). 처음 한 번은 반응을 크게([`TRACES_AND_REACTIONS`](../01-product/TRACES_AND_REACTIONS.md) 6절) |
| **자유 탐색 = 막힘** | 이탈 | P4 린터, 세계의 넛지(EV-32·45·46·48), 일시정지 메뉴 힌트 3단계, 전역·설정 검색 |
| 직접 입력을 못 알아들음 | 짜증 | 사전 표기 변형(띄어쓰기·조사 무시: "강민석이"·"강민석씨"도 인정), 기본 반응이 "무슨 말이에요?" 정도로 짧음 |
| 미끼(청운)가 억울함 | "속았다" 분노 | 청운 취소 메일은 받은편지함 맨 위(새 메일)로 온다. 온라인 후 첫 화면 알림 센터에 "청운고시원" 줄이 있다. 오프라인 플레이어에게는 의도된 결과 |
| 원격 지우기 = 이른 엔딩 | 분노 | 경고 반드시 + 두 번째 기회(EV-19) + 해법 다섯 + 30분 = 실시간 7.5분 |
| 흔적이 벌처럼 느껴짐 | 소극적 플레이 | 흔적이 이득이 되는 경우를 반드시 둔다(서아가 먼저 말함, 방 사진이 신뢰를 올림) |
| 시계 압박(생각하는 시간도 흐름) | 생각하는 플레이어 손해 | ×4로 늦춤, 일시정지 메뉴, 시간 흐름 끄기 |
| 설정 메뉴가 너무 깊음 | 픽셀 헌팅 | 깊이 3단계 이하, 설정 검색, 실제 폰의 위치 관습을 따름 |
| 소재 심의 | 등급·여론 | [[PRODUCT_PRINCIPLES](../00-foundation/PRODUCT_PRINCIPLES.md)](../00-foundation/PRODUCT_PRINCIPLES.md) 7절, 린터 금칙어 |
| 모바일 웹 성능 | 로딩 | WebP·긴 변 1100px, 단일 HTML 9MB 이내, 지연 로드 |
| iOS Safari 제스처 충돌 | 조작감 | 게임 내 버튼 대체, 실기기 테스트 P1부터 |

## 5. 열린 결정 (P0에서 서현이 정할 것)

**아래 "추천"은 원본의 추천이며 확정이 아니다. 모든 행의 상태는 "서현 확정 필요"다.** 확정 결과는 [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md)에 기록하고 이 표의 상태를 갱신한다.

| 항목 | 선택지 | 추천 | 상태 |
|---|---|---|---|
| 시간 흐름 | ×4 / ×5 / 행동 단위 | **×4** + 옵션. 판정 UI가 없어져 생각하는 시간도 흐르므로 ×5에서 늦춤. 일반 165분 → 07:50 종료 | 서현 확정 필요 → [OPEN_QUESTIONS](./OPEN_QUESTIONS.md) |
| 해담 근거 최소 노출 | 지금처럼 T2 6곳 / 4곳으로 줄임 | **6곳 유지.** 미끼를 쓴 대가로 진짜 위치는 넉넉하게 | 서현 확정 필요 → [OPEN_QUESTIONS](./OPEN_QUESTIONS.md) |
| 원격 지우기 후 | 즉시 엔딩 / 초기 설정 화면에서 1분 머문 뒤 엔딩 | **1분 머문 뒤.** "안녕하세요" 화면의 정적이 이 엔딩의 연출 | 서현 확정 필요 → [OPEN_QUESTIONS](./OPEN_QUESTIONS.md) |
| 정체 숨김 MVP 포함 | 포함 / 본편 | **본편** | 서현 확정 필요 → [OPEN_QUESTIONS](./OPEN_QUESTIONS.md) |
| 루프 부계정 MVP 포함 | 포함 / 본편 | **본편** | 서현 확정 필요 → [OPEN_QUESTIONS](./OPEN_QUESTIONS.md) |
| 녹음 성우 | 자막만 / 성우 | MVP 자막, 본편 성우 | 서현 확정 필요 → [OPEN_QUESTIONS](./OPEN_QUESTIONS.md) |
| 제목 표기 | DONTKNOW / @dontknow__ 로고 변형 | 언더바 두 개를 숨기는 변형 | 서현 확정 필요 → [OPEN_QUESTIONS](./OPEN_QUESTIONS.md) |

## 6. 구현 착수 전제: P0 설계 잠금

P0 완료 판정은 다음 8개가 모두 참일 때만 한다. 상세 인수 조건은 [`ACCEPTANCE_CRITERIA.md`](./ACCEPTANCE_CRITERIA.md) AC-601~AC-608.

| # | 조건 | 판정 |
|---|---|---|
| 1 | [`REQUIREMENTS`](../00-foundation/REQUIREMENTS.md)의 REQ-F 75·REQ-N 24가 이 문서 묶음과 모순되지 않는다 | 서현 승인 |
| 2 | 5절 열린 결정 7건의 상태가 "확정"으로 바뀌고 [`OPEN_QUESTIONS`](./OPEN_QUESTIONS.md)에 기록된다 | 서현 승인 |
| 3 | [`FRONTEND_ARCHITECTURE`](../04-tech/FRONTEND_ARCHITECTURE.md) 1절 모듈 트리가 동결된다(새 모듈 0) | 서현 승인 |
| 4 | [`NAVIGATION_ARCHITECTURE`](../02-design/NAVIGATION_ARCHITECTURE.md) 화면 인벤토리 178개(P0 34 / P1 144)와 [`DEVELOPMENT_PHASES`](./DEVELOPMENT_PHASES.md)의 SCR 배정이 일치한다 | 서현 승인 |
| 5 | [`TESTING_STRATEGY`](../05-quality/TESTING_STRATEGY.md)의 테스트 이름·합격 기준이 동결된다 | 서현 승인 |
| 6 | 숫자 캐논(보수 97분·일반 165분·MVP 96분·×4·30분=7분 30초·마감 177분 30초·070921·680403 메모 암호·110221)이 원본과 일치한다 | 서현 승인 |
| 7 | 콘텐츠 스키마·린터 규칙 10종([`DATABASE_SCHEMA`](../04-tech/DATABASE_SCHEMA.md) 5절)과 빌드 절차가 동결된다 | 서현 승인 |
| 8 | 서현이 P0 설계 잠금을 승인한다 | 서현 승인 |

**승인 전 금지:** `game/` 코드 작성, 콘텐츠 JSON 작성, 테스트 파일 작성, 패키지 설치, 빌드 실행.

## 확인 사항

- **Q-OPEN-R01:** 5절 첫 행의 원문은 폐기 용어를 포함한다. 이 문서는 지시서 1절의 금지 규칙에 따라 "판정 UI가 없어져"로 바꿨다. 의미(생각하는 시간도 흐른다)는 유지했다. 원문 표기를 복원할지는 총괄이 정한다.
- **Q-OPEN-R02:** P7 완료 기준의 원문 참조에 해당하는 새 단일 출처가 [`PRODUCT_PRINCIPLES`](../00-foundation/PRODUCT_PRINCIPLES.md) 8절인지, [`PRD`](../01-product/PRD.md) 6절인지 확인이 필요하다. 이 문서는 둘을 함께 참조한다.
- **Q-OPEN-R03:** P8의 "일반 165분 페이싱"은 본편 보수 97분·일반 165분을 전제로 한다. P7에서 일반 중앙값이 140~190분을 벗어나면 P8 범위를 재조정해야 한다.
- **Q-OPEN-R04:** MVP 범위 표의 "설정 ○ 메뉴 9개"는 [`SETTINGS_SPECIFICATION`](../03-features/SETTINGS_SPECIFICATION.md) 0절의 ○ 표기와 대조해야 한다. 이 문서는 원본 [[IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md)](IMPLEMENTATION_ROADMAP.md) 2절의 값을 그대로 옮겼다.
- **대조 완료:** 원본 [[IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md)](IMPLEMENTATION_ROADMAP.md)의 MVP 범위 9행, 단계 9행, 리스크 11행, 열린 결정 7행을 그대로 옮겼다. 문서 번호 참조만 새 단일 출처 링크로 바꿨다.
