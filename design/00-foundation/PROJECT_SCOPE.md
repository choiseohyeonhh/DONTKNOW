# PROJECT SCOPE — DONTKNOW

> **역할:** 무엇을 만들고 무엇을 만들지 않는지, 어디까지가 MVP이고 어디부터가 본편인지 고정한다.
> **단일 출처:** 제품 범위(포함/제외)와 MVP 경계는 이 문서다. 원문은 [[PRODUCT_PRINCIPLES](PRODUCT_PRINCIPLES.md)](PRODUCT_PRINCIPLES.md) 6절, [[IMPLEMENTATION_ROADMAP](../06-execution/IMPLEMENTATION_ROADMAP.md)](../06-execution/IMPLEMENTATION_ROADMAP.md) 2절. 플레이타임은 [`../01-product/PLAYTIME_BUDGET.md`](../01-product/PLAYTIME_BUDGET.md)가 단일 출처다.
> **참조:** [`Bible.md`](Bible.md), [`REQUIREMENTS.md`](REQUIREMENTS.md), [`../01-product/PRD.md`](../01-product/PRD.md), [`../01-product/FEATURE_SPECIFICATION.md`](../01-product/FEATURE_SPECIFICATION.md).

## 1. 제품 범위

[PRODUCT_PRINCIPLES](PRODUCT_PRINCIPLES.md)의 표를 그대로 따른다.

| 포함 | 제외 |
|---|---|
| 아들 폰 1대(앱 30종, [[FEATURE_SPECIFICATION](../01-product/FEATURE_SPECIFICATION.md)](../01-product/FEATURE_SPECIFICATION.md)) | 아버지 폰 UI, 카드·판정 UI |
| 실시간 계정 반응(동기화·로그인·원격 삭제·읽음·조회) | 대면 장면, 장소 일러스트 화면(카메라로 보는 도현의 방 제외) |
| 메시지·톡·DM·메일로 공유하고 묻기 | 대화 선택지 트리 |
| 시네마틱: 프롤로그 1, 엔딩별 1(스틸 + 자막) | 세션 사이 시네마틱 |
| 엔딩 4 + 변형 1 | |

**범위의 중심:** 화면에는 아들의 폰 하나만 있다. 추리는 플레이어의 머릿속에서 일어나고, 게임은 폰 안에서 한 행동(비밀번호, 검색어, 공유, 설정 변경, 답장, 택시 호출)으로만 그것을 확인한다.

## 2. 플랫폼

| 항목 | 결정 | 근거 |
|---|---|---|
| 1차 플랫폼 | **모바일 웹**(iPhone Safari 우선, 안드로이드 Chrome) | [[PRODUCT_PRINCIPLES](PRODUCT_PRINCIPLES.md)](PRODUCT_PRINCIPLES.md) 1절 |
| 화면 | 모바일: 폰 화면이 기기 화면 전체 | [[SYSTEM_SHELL_SPECIFICATION](../03-features/SYSTEM_SHELL_SPECIFICATION.md)](../03-features/SYSTEM_SHELL_SPECIFICATION.md) 1절 |
| 데스크톱 | 390×844 폰 프레임 중앙, 양옆은 도현의 방 책상(정적 배경, 정보 없음) | [[SYSTEM_SHELL_SPECIFICATION](../03-features/SYSTEM_SHELL_SPECIFICATION.md)](../03-features/SYSTEM_SHELL_SPECIFICATION.md) 1절 |
| 배포 형태 | 단일 HTML 파일(이미지·폰트 인라인), 정적 호스팅. 외부 CDN·라이브러리 없음 | [[SYSTEM_ARCHITECTURE](../04-tech/SYSTEM_ARCHITECTURE.md)](../04-tech/SYSTEM_ARCHITECTURE.md) 1절, 지시서 3.1 |
| 오프라인 | 설치 없이 로컬 파일/정적 호스팅으로 플레이. 게임 중 네트워크 불필요 | [[SYSTEM_ARCHITECTURE](../04-tech/SYSTEM_ARCHITECTURE.md)](../04-tech/SYSTEM_ARCHITECTURE.md) 1절 |
| 추후 | 웹뷰 앱 포장 | [[PRODUCT_PRINCIPLES](PRODUCT_PRINCIPLES.md)](PRODUCT_PRINCIPLES.md) 1절 |

- 기준 프레임 **390×844**, 지원 폭 **320~430**(폰). 데스크톱은 화면 높이에 맞춰 **0.75~1.25배** 범위에서 축소·확대한다.
- 글꼴은 Pretendard. Apple 에셋·SF 폰트·SF Symbols·특정 화면 복제 금지(지시서 2절).

## 3. 플레이타임 목표

| 기준 | 목표 | 합격선 |
|---|---|---|
| 보수(숙련자 하한) | **약 97분** | **90분 이상** |
| 일반 | **약 165분** | 중앙값 140~190분 |
| 마감까지 실시간 | **177분 30초** (3/17 21:10 → 3/18 09:00) | — |
| 게임 시계 | 실시간 1분 = 게임 4분(**×4**) | — |

- 일반 플레이어는 **07:50 전후**에 최종 행동에 도달한다.
- 보수 97분의 구성: SNS(루프·튜브·모아) 약 32분(33%), 설정 약 11분(11%), 메신저·메일·대화 약 20분, 사진·카메라·미디어 약 10분, 나머지.
- 시간을 늘리는 방식의 금지 규칙(강제 대기·중복 필수 경로·수집 개수 채우기·픽셀 헌팅·설정 미로·오답 페널티)은 [`../01-product/PLAYTIME_BUDGET.md`](../01-product/PLAYTIME_BUDGET.md) 5절을 따른다.

## 4. MVP vs 본편 범위

[IMPLEMENTATION_ROADMAP](../06-execution/IMPLEMENTATION_ROADMAP.md)의 표를 그대로 따른다. **MVP 보수 목표는 90분 이상**이며, 본편 보수 97분에서 MVP 제외 항목(부계정 G-04 약 0분 — 이미 계산 밖, 하린 대화 0, 정체 숨김 0, 후일담 변주 −1, 실장 흔적 실험 0)을 빼면 **MVP 보수 약 96분**이다.

| 영역 | 포함(MVP) | 제외(본편) |
|---|---|---|
| 층 | T0~T3 전부 | — |
| 앱 | 30종 전부(○ 23종 완전 구현 / △ 7종 최소 데이터) | — |
| 설정 | [SETTINGS_SPECIFICATION](../03-features/SETTINGS_SPECIFICATION.md) ○ 메뉴 9개 + 암호 변경·가족·집중 모드 | 디스플레이·소리 세부 |
| 행동 증명 | V-01~V-06, V-09~V-14, V-16 | V-07(하린), V-08(부계정), V-15는 동작만(대사 최소) |
| 흔적 | TR-01~09, 11~13, 15, 17~19 | TR-10(부계정), TR-14 좋아요 반응 일부, TR-16 |
| 사건 | EV-01~09, 11~19, 21~23, 25~27, 30~35, 40~48 | EV-10 |
| NPC | 도현 DH 전체·F-MOVED, 지훈 JH-0~2, 서아 SA-0~2, 민지 MJ-0~2, 김태윤 회신, 실장 KS-0~3 | 하린 대화(글만), 정체 숨김 분기(′ 상태) |
| 엔딩 | A, A′, B, C, D(스틸 2컷 + 자막) | 후일담 변주 일부 |
| 아트 | 아이콘 30종(SVG), 폰 사진 30장(핵심 12장 최종 품질), 카메라 방 4구도 | 시네마틱 정식 스틸 |
| 기타 | 자동 저장, 디버그 패널, 시간 흐름 끄기, 일시정지 메뉴 힌트 | 소리, 수동 슬롯 |

**해석 규칙:** "본편 제외"는 MVP에서 기능이 아예 없어도 된다는 뜻이 아니라, **최소 동작(데이터·빈 화면·짧은 반응)으로 존재하고 대사·연출·변주를 확장하지 않는다**는 뜻이다. 예: V-15 블링크 흔적 없이 읽기는 MVP에서 동작하되 대사 최소.

## 5. 비범위

| 항목 | 상태 | 근거 |
|---|---|---|
| 서버·DB·인증 서버·네트워크 API | **현재 계획에 없음.** 게임 속 "온라인/동기화/실시간"은 모두 클라이언트 안의 시뮬레이션 | [[SYSTEM_ARCHITECTURE](../04-tech/SYSTEM_ARCHITECTURE.md)](../04-tech/SYSTEM_ARCHITECTURE.md) 1절, 지시서 3.1 |
| 실제 사용자 계정·실제 메시지 송수신 | **현재 계획에 없음.** 앱은 게임 속 가상 앱, 상대는 대본이 있는 NPC | 지시서 0절 |
| 다국어 | **현재 계획에 없음.** 한국어 단일 | 지시서(문서에 근거 없음) |
| 결제·수익화 구현 | **현재 계획에 없음.** 수익 모델은 프리미엄 단품 가정만 있음 | [[PRODUCT_PRINCIPLES](PRODUCT_PRINCIPLES.md)](PRODUCT_PRINCIPLES.md) 1절 |
| 아버지 폰 UI, 대면 장면, 장소 일러스트, 선택지 트리 | **명시적 제외** | [[PRODUCT_PRINCIPLES](PRODUCT_PRINCIPLES.md)](PRODUCT_PRINCIPLES.md) 6절 |
| 실제 서비스 연동·소셜 로그인 | **현재 계획에 없음** | [[SYSTEM_ARCHITECTURE](../04-tech/SYSTEM_ARCHITECTURE.md)](../04-tech/SYSTEM_ARCHITECTURE.md) 1절 |
| 아날로그 판정·카드·결론 빈칸 | **폐기** | [[BUSINESS_RULES](../01-product/BUSINESS_RULES.md)](../01-product/BUSINESS_RULES.md) 1절 |

## 6. 산출물과 단계

| 단계 | 내용 | 완료 기준 |
|---|---|---|
| **P0 설계 잠금** | 이 문서 묶음 검토·확정. 열린 결정 | 서현 승인 |
| **P1 OS 골격** | 상태바·잠금화면·홈·앱 전환·알림·제어 센터·검색, 콘텐츠 로더, 가시성, 시계 | 잠금 해제 → 홈 → 앱 왕복, 깜빡임 0 |
| **P2 작성창·반응** | 작성창·키워드·대화·행동 증명·흔적 | 지훈 대화 1왕복, V-05 동작 |
| **P3 온라인 계층** | Wi-Fi·동기화·원격 삭제·대기열·원격 지우기·도현 상태·카메라 | "30분" 위기 다섯 해법 재현 |
| **P4 콘텐츠 1** | 메일·메모·연락처·캘린더·사진·지도·설정, 미끼(청운)와 진짜(해담) | 이중 경로 린터 통과 |
| **P5 콘텐츠 2** | 루프·튜브·모아·은행·블링크, NPC 민지·김태윤·실장 | route_a~d, traces, moved 통과 |
| **P6 아트** | 아이콘 SVG, 폰 사진, 카메라 방, 엔딩 스틸 | 16px 실루엣, 확대 판독 |
| **P7 플레이테스트** | 숙련 2 + 일반 4 블라인드 | 성공 기준·플레이타임 충족 |
| **P8 본편 확장** | 제외분 + 부계정 + 정체 숨김 + 소리 | 일반 165분 페이싱 |

상세 로드맵은 [`../06-execution/IMPLEMENTATION_ROADMAP.md`](../06-execution/IMPLEMENTATION_ROADMAP.md), [`../06-execution/DEVELOPMENT_PHASES.md`](../06-execution/DEVELOPMENT_PHASES.md)를 따른다.

## 확인 사항

- **Q-OPEN-05:** 다국어·결제·웹뷰 포장의 일정과 범위는 원본에 없다. 이 문서는 "현재 계획에 없음"으로만 기록했다. 사업 계획 확정 시 갱신한다.
- **Q-OPEN-06:** MVP에서 "수동 슬롯"이 제외([IMPLEMENTATION_ROADMAP](../06-execution/IMPLEMENTATION_ROADMAP.md))이나, [SYSTEM_SHELL_SPECIFICATION](../03-features/SYSTEM_SHELL_SPECIFICATION.md)과 지시서는 "자동 저장 + 수동 슬롯 3"을 전제한다. MVP는 자동 저장만, 본편에서 수동 슬롯 3을 포함하는 것으로 해석했다. P0 확정 필요.
