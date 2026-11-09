# 열린 결정·확인 사항 (OPEN QUESTIONS)

> **역할:** 새 `design/` 문서의 "확인 사항" 249개와 [IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md) 열린 결정 표(구 15 문서 5절)의 열린 결정 7개(그중 2개는 249개와 중복)를 주제별로 병합한 전역 목록이다.
> **단일 출처:** 이 문서는 확인 사항의 전역 ID와 범주만 정한다. 캐논·수치·조건의 값은 각 근거 문서가 단일 출처다.
> **범주:** **A. 서현 결정 필요** / **B. 기본값 확정(구현자는 이대로 진행, 변경 시 알림)** / **C. 해결됨·무효**

## 읽는 법

- **A**는 맨 위에 두고 중요도(치명 → 높음 → 보통) 순으로 정렬했다. 각 항목은 선택지·현재 가정·추천·영향 문서를 적는다. **A 36건은 2026-11-09 추천안 채택으로 전부 결정됐다.**
- **B**는 문서가 이미 정한 기본값이다. 구현자는 이 값으로 진행하고, 바꿀 때만 이 표를 갱신·통보한다.
- **C**는 다른 문서에서 이미 해결됐거나 질문이 성립하지 않는 항목이다.
- "치명" = 그대로 구현하면 캐논 모순이나 엔딩 판정 오류가 생기는 항목.

총 **182개** 병합 항목: A 36 · B 125 · C 21. **A 36건 전부 결정됨(2026-11-09, 추천안 채택).**

---

## A. 서현 결정 필요

### 치명

#### Q-OPEN-001 — 엔딩 B에서 번호판 신고(F-PLATE-SENT)를 배제하지 않는 문제 · **치명** · 결정됨

- 출처: [01-product/PROGRESSION_AND_ENDINGS.md:305](../01-product/PROGRESSION_AND_ENDINGS.md) · [06-execution/ACCEPTANCE_CRITERIA.md:309](../06-execution/ACCEPTANCE_CRITERIA.md)
- 쟁점: B 조건은 `F-MAIL = deleted ∧ ¬(F-REC-SENT ∨ F-NAME-SENT)`라서, 번호판만 경찰에 보낸 뒤 예약 메일을 삭제하면 B가 된다. 그런데 6.4의 "위협 해소"에는 `F-PLATE-SENT`가 포함된다.
- 선택지: ① 현행 유지(번호판 신고는 B를 막지 않는다) / ② B 조건에 `¬F-PLATE-SENT` 추가(위협 해소 3종 모두 B를 막는다) / ③ B를 "F-REC-SENT·F-NAME-SENT·F-PLATE-SENT가 모두 거짓"으로 재정의
- 현재 가정: 현행(번호판 신고를 B에서 배제하지 않음).
- 추천: ② — B는 "위협을 해소하지 않은 채 조용히 넘어간" 결말이므로, 번호판 신고도 해소로 보아 B를 막아야 6.4의 위협 해소 정의와 일치한다.
- **결정(2026-11-09):** 추천안 채택 — ② B 조건에 `¬F-PLATE-SENT`를 추가한다(`F-MAIL = deleted ∧ ¬(F-REC-SENT ∨ F-NAME-SENT ∨ F-PLATE-SENT)`).
- 영향 문서: `01-product/PROGRESSION_AND_ENDINGS.md` 6.4, `06-execution/ACCEPTANCE_CRITERIA.md` AC-059

#### Q-OPEN-002 — 원격 지우기 뒤 녹음이 남아 있으면 엔딩 D가 나가지 않는 문제 · **치명** · 결정됨

- 출처: [01-product/PROGRESSION_AND_ENDINGS.md:306](../01-product/PROGRESSION_AND_ENDINGS.md)
- 쟁점: `F-WIPED`가 참이고 `F-REC`가 `synced`/`sent`이며 `F-LOC ≠ exact`이면 D의 세 번째 조건(`F-WIPED ∧ F-REC=lost ∧ F-LOC≠exact`)에 걸리지 않아 B/C로 떨어진다.
- 선택지: ① 현행 유지(녹음 보존·송부는 D를 막는 유효한 대응) / ② `F-WIPED ∧ F-LOC≠exact`이면 F-REC와 무관하게 D / ③ D 조건에서 F-REC=lost를 빼고 F-WIPED만 본다
- 현재 가정: 현행(D는 녹음이 유실됐을 때만).
- 추천: ① — 녹음 보존·송부는 원격 지우기의 실질적 대응이고, 위치를 밝히지 못한 책임은 B/C의 서사로 남긴다.
- **결정(2026-11-09):** 추천안 채택 — ① 현행 유지. 녹음 보존·송부는 D를 막는 유효한 대응이며, 위치 미확인 책임은 B/C의 서사로 남긴다.
- 영향 문서: `01-product/PROGRESSION_AND_ENDINGS.md` 6.1·6.4, `03-features/MAIL_AND_CLOUD_SPECIFICATION.md`

#### Q-OPEN-003 — V-11 결과 플래그가 F-NAME과 F-NAME-SENT로 갈리는 문제 · **치명** · 결정됨

- 출처: [01-product/PROGRESSION_AND_ENDINGS.md:307](../01-product/PROGRESSION_AND_ENDINGS.md)
- 쟁점: V-11의 결과 표기는 `F-NAME`인데 6.1 플래그 표에는 `F-NAME-SENT`만 있다. 엔딩 판정과 린터가 어느 이름을 읽어야 하는지 불명확하다.
- 선택지: ① `F-NAME`은 `F-NAME-SENT`의 약칭(같은 플래그) / ② `F-NAME`을 별도 플래그로 추가 / ③ 모든 표기를 `F-NAME-SENT`로 통일
- 현재 가정: 현행(V-11 표만 약칭 표기).
- 추천: ③ — 플래그 표가 단일 출처이므로 V-11 결과를 `F-NAME-SENT`로 고쳐 이름을 하나로 만든다.
- **결정(2026-11-09):** 추천안 채택 — ③ 모든 표기를 `F-NAME-SENT`로 통일한다(`F-NAME` 단독 표기 제거).
- 영향 문서: `01-product/ACTION_PROOF.md` V-11, `01-product/PROGRESSION_AND_ENDINGS.md` 6.1, 콘텐츠 린터

### 높음

#### Q-OPEN-004 — 디자인 기둥 P1~P7의 충돌 우선순위 · **높음** · 결정됨

- 출처: [00-foundation/Bible.md:106](../00-foundation/Bible.md) · [00-foundation/PRODUCT_PRINCIPLES.md:75](../00-foundation/PRODUCT_PRINCIPLES.md)
- 쟁점: P1~P7이 충돌할 때의 서열이 없다. 3.2의 후보 안(상황별 3개)은 확정이 아니다.
- 선택지: ① 표 순서(P1→P7)를 그대로 우선순위로 / ② P4(모든 진실은 두 길 이상)를 최우선 / ③ 3.2의 상황별 후보 안 3개를 그대로 채택(P2/P4, P3/P4, P5/P1)
- 현재 가정: 3.2의 상황별 후보 안(미확정).
- 추천: ③ — 단일 서열은 P3/P4 충돌에서 진행 불능을 만들 수 있고, 이미 기둥별 예외 원칙이 문서화되어 있다.
- **결정(2026-11-09):** 추천안 채택 — ③ 3.2의 상황별 후보 안 3개(P2/P4, P3/P4, P5/P1)를 그대로 채택한다. 단일 서열은 두지 않는다.
- 영향 문서: `00-foundation/PRODUCT_PRINCIPLES.md` 3.2, `00-foundation/Bible.md`, 전체 설계 문서

#### Q-OPEN-005 — 한결캐피탈(이상철) 괄호 안 이름의 의미 · **높음** · 결정됨

- 출처: [01-product/CHARACTERS.md:163](../01-product/CHARACTERS.md) · [01-product/EVIDENCE_LEDGER.md:244](../01-product/EVIDENCE_LEDGER.md) · [01-product/NARRATIVE_CANON.md:195](../01-product/NARRATIVE_CANON.md)
- 쟁점: "한결캐피탈(이상철)"의 괄호가 채무자(아버지) 표기인지 수취인 표기인지 문면만으로 갈리지 않는다. E-83 상세는 "채무자 이상철"이다.
- 선택지: ① 채무자(아버지) 표기로 통일 / ② 수취인 표기 / ③ 거래 표시는 "한결캐피탈", 괄호는 "채무자 이상철"로 분리
- 현재 가정: 현행(괄호 병기, 상세는 채무자).
- 추천: ③ — E-83 상세와 Bible 3장 5항("수수료가 한결캐피탈(이상철)로 갔다")이 아버지 빚 상환임을 가리킨다. 괄호를 채무자 이름으로 고정한다.
- **결정(2026-11-09):** 추천안 채택 — ③ 거래 표시는 "한결캐피탈", 괄호는 "채무자 이상철"로 분리한다.
- 영향 문서: `01-product/NARRATIVE_CANON.md` 핵심 진실 4, `01-product/CHARACTERS.md` P-01, `01-product/EVIDENCE_LEDGER.md` E-83

#### Q-OPEN-006 — E-05 입금 19건과 아버지 자동이체 24회의 관계 · **높음** · 결정됨

- 출처: [01-product/EVIDENCE_LEDGER.md:243](../01-product/EVIDENCE_LEDGER.md)
- 쟁점: E-05는 한결캐피탈 "입금 확인" 19건(입금자 "이도*")인데, 연대기의 아버지 자동이체는 24회(2024.03~2026.02)다.
- 선택지: ① 19건은 도현 명의 입금, 24회는 아버지 자동이체로 별개 흐름 / ② 19건을 24회로 정정 / ③ 24회를 19회로 정정
- 현재 가정: 현행(19건과 24회 병존).
- 추천: ① — E-05 입금자는 "이도*"(도현), 연대기는 아버지 계좌다. 두 흐름을 합치지 않고 각각 남긴다.
- **결정(2026-11-09):** 추천안 채택 — ① 19건은 도현 명의 입금, 24회는 아버지 자동이체로 별개 흐름이다.
- 영향 문서: `01-product/EVIDENCE_LEDGER.md` E-05, `01-product/NARRATIVE_CANON.md` 3.1, `03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md`

#### Q-OPEN-007 — F-MOVED 트리거의 우선순위(장소 입력 vs EV-27) · **높음** · 결정됨

- 출처: [01-product/USER_FLOWS.md:194](../01-product/USER_FLOWS.md) · [03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md:333](../03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md)
- 쟁점: DH≤2에서 해담·207·성원구청로 31을 입력하거나 EV-27(한끼 재주문)이 일어나면 F-MOVED가 된다. 두 조건이 겹칠 때의 순서·중복 처리가 없다.
- 선택지: ① EV-27 우선 / ② 장소 입력 우선 / ③ 먼저 발생한 트리거를 1회만 적용(F-MOVED 불리언의 멱등 처리)
- 현재 가정: 현행(미정).
- 추천: ③ — F-MOVED는 불리언이고 도주는 1회 사건이므로, 동시 발생해도 "게임 60분 뒤 1회"로 처리하면 순서 문제가 사라진다.
- **결정(2026-11-09):** 추천안 채택 — ③ 먼저 발생한 트리거를 1회만 적용한다(F-MOVED 불리언 멱등, 게임 60분 뒤 1회).
- 영향 문서: `01-product/PROGRESSION_AND_ENDINGS.md` 4.1, `01-product/USER_FLOWS.md`, `03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md`, `03-features/MAPS_AND_MOBILITY_SPECIFICATION.md`

#### Q-OPEN-008 — 단톡 글 시각 3/16과 EV-41 3/17 22:30의 불일치 · **높음** · 결정됨

- 출처: [02-design/SCREEN_SPECIFICATIONS.md:2035](../02-design/SCREEN_SPECIFICATIONS.md) · [03-features/MESSAGING_SPECIFICATION.md:214, 428](../03-features/MESSAGING_SPECIFICATION.md)
- 쟁점: MESSAGING 3.8은 단톡 "경영 26 새내기"의 글 "도현이 휴학한대?"를 3/16으로, PROGRESSION EV-41은 3/17 22:30으로 적는다.
- 선택지: ① EV-41의 3/17 22:30을 정본으로 하고 방 표를 정정 / ② 3/16을 정본으로 하고 EV-41을 정정 / ③ 3/16 기존 글 + 3/17 새 글 2건으로 분리
- 현재 가정: 현행(문서마다 다름).
- 추천: ① — EV 표가 게임 중 사건의 단일 출처이고, 3/17 밤 사건군(EV-40·42·44)과도 일관된다.
- **결정(2026-11-09):** 추천안 채택 — ① EV-41의 3/17 22:30을 정본으로 하고 메신저 방 표를 정정한다.
- 영향 문서: `03-features/MESSAGING_SPECIFICATION.md` 3.8, `01-product/PROGRESSION_AND_ENDINGS.md` EV-41, `02-design/SCREEN_SPECIFICATIONS.md` 채팅 목록

#### Q-OPEN-009 — 지훈 스토리 3/15와 EV-40 3/17 21:40의 관계 · **높음** · 결정됨

- 출처: [03-features/SNS_SPECIFICATION.md:184, 391, 538](../03-features/SNS_SPECIFICATION.md)
- 쟁점: SNS 8.5는 지훈의 보관 스토리 "…"를 3/15로, PROGRESSION EV-40은 3/17 21:40 스토리 "…"(검은 화면)로 적는다.
- 선택지: ① EV-40의 3/17 21:40 단일 스토리 / ② 3/15 보관 스토리 + 3/17 새 스토리 2건 / ③ 3/15을 정본으로 하고 EV-40 삭제
- 현재 가정: 현행(8.5 표 3/15 + EV-40 별도 사건).
- 추천: ② — "24시간 지난 보관"과 "게임 중 새 스토리"는 다른 상태이고, 조회 흔적도 각각 남아야 한다.
- **결정(2026-11-09):** 추천안 채택 — ② 3/15 보관 스토리 + 3/17 새 스토리 2건으로 둔다(조회 흔적 각각).
- 영향 문서: `03-features/SNS_SPECIFICATION.md` 8.5, `01-product/PROGRESSION_AND_ENDINGS.md` EV-40, `01-product/TRACES_AND_REACTIONS.md`

#### Q-OPEN-010 — 게임 시간 배율(×4 / ×5 / 행동 단위) · **높음** · 결정됨

- 출처: [IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md) 열린 결정 표
- 쟁점: design/15 5절의 열린 결정. 17 문서는 ×4를 추천하지만 확정은 아니다.
- 선택지: ① ×4 + 옵션 / ② ×5 / ③ 행동 단위
- 현재 가정: ×4 + 옵션(design/15 5절 추천, 일반 165분 → 07:50 종료).
- 추천: ① — 화면을 읽는 시간도 흐르므로 ×5는 일반 165분 목표를 넘긴다.
- **결정(2026-11-09):** 추천안 채택 — ① ×4 + 옵션. 일반 165분 → 07:50 종료.
- 영향 문서: `01-product/BUSINESS_RULES.md`, `01-product/PLAYTIME_BUDGET.md`, `04-tech/STATE_MANAGEMENT.md`, [IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md) 열린 결정 표(구 15 문서 5절)

#### Q-OPEN-011 — 해담 근거의 최소 노출 수(T2 6곳 vs 4곳) · **높음** · 결정됨

- 출처: [IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md) 열린 결정 표
- 쟁점: design/15 5절의 열린 결정. 진짜 은신처 해담고시텔 207의 T2 근거를 몇 곳까지 둘지.
- 선택지: ① 6곳 유지 / ② 4곳으로 줄임 / ③ 2곳으로 줄임
- 현재 가정: 6곳 유지(design/15 5절 추천).
- 추천: ① — 미끼(청운 304)를 쓴 대가로 진짜 위치는 P4(모든 진실은 두 길 이상)에 맞게 넉넉히 둔다.
- **결정(2026-11-09):** 추천안 채택 — ① T2 6곳 유지.
- 영향 문서: `01-product/LOCATIONS.md` 5절, `01-product/EVIDENCE_LEDGER.md`, 콘텐츠 린터

#### Q-OPEN-012 — 원격 지우기 후 엔딩 연출(즉시 vs 1분) · **높음** · 결정됨

- 출처: [IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md) 열린 결정 표
- 쟁점: design/15 5절의 열린 결정. EV-08 원격 지우기가 일어난 뒤 엔딩까지의 연출.
- 선택지: ① 즉시 엔딩 판정 / ② 초기 설정 화면에서 1분 머문 뒤 엔딩 / ③ 설정 화면에서 추가 조작을 허용한 뒤 엔딩
- 현재 가정: 초기 설정 화면에서 1분 머문 뒤(design/15 5절 추천).
- 추천: ② — "안녕하세요" 초기 설정 화면의 정적이 이 엔딩의 연출이다.
- **결정(2026-11-09):** 추천안 채택 — ② 초기 설정 화면에서 1분 머문 뒤 엔딩.
- 영향 문서: `01-product/PROGRESSION_AND_ENDINGS.md` 6.4, `03-features/MAIL_AND_CLOUD_SPECIFICATION.md` 5절, `03-features/SYSTEM_SHELL_SPECIFICATION.md` 시네마틱

#### Q-OPEN-013 — 정체 숨김 분기의 MVP 포함 여부 · **높음** · 결정됨

- 출처: [01-product/FEATURE_SPECIFICATION.md:112](../01-product/FEATURE_SPECIFICATION.md) · [06-execution/DEVELOPMENT_PHASES.md:146](../06-execution/DEVELOPMENT_PHASES.md) · [IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md) 열린 결정 표
- 쟁점: design/15 5절의 열린 결정. 부계정·하린과 묶인 정체 숨김 분기(′ 상태)를 MVP에 넣을지.
- 선택지: ① MVP 포함 / ② 본편(P8)으로 미룸
- 현재 가정: 본편(P8).
- 추천: ② — 부계정·하린 대화와 함께 묶여 있고 MVP 96분 계산 밖이다.
- **결정(2026-11-09):** 추천안 채택 — ② 본편(P8)으로 미룬다.
- 영향 문서: `01-product/FEATURE_SPECIFICATION.md` FEAT-61~67, `06-execution/IMPLEMENTATION_ROADMAP.md`, `03-features/SNS_SPECIFICATION.md`, `03-features/MAIL_AND_CLOUD_SPECIFICATION.md`

#### Q-OPEN-014 — 루프 부계정(@dontknow__)의 MVP 포함 여부 · **높음** · 결정됨

- 출처: [01-product/FEATURE_SPECIFICATION.md:112](../01-product/FEATURE_SPECIFICATION.md) · [06-execution/DEVELOPMENT_PHASES.md:146](../06-execution/DEVELOPMENT_PHASES.md) · [IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md) 열린 결정 표
- 쟁점: design/15 5절의 열린 결정. G-04 부계정 로그인과 부계정 게시물 열람을 MVP에 넣을지.
- 선택지: ① MVP 포함 / ② 본편(P8)으로 미룸
- 현재 가정: 본편(P8).
- 추천: ② — 부계정 경로는 EV-09·EV-10·TR-10과 정체 숨김 분기를 함께 끌고 와 MVP 범위를 넘는다.
- **결정(2026-11-09):** 추천안 채택 — ② 본편(P8)으로 미룬다.
- 영향 문서: `01-product/FEATURE_SPECIFICATION.md` FEAT-61~67, `06-execution/IMPLEMENTATION_ROADMAP.md`, `03-features/SNS_SPECIFICATION.md`

#### Q-OPEN-015 — 플레이어의 리포스트·인용·답글·새 게시물 발행에 대한 NPC 반응 · **높음** · 결정됨

- 출처: [02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md:1844](../02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md) · [03-features/SNS_SPECIFICATION.md:76, 210, 226, 541](../03-features/SNS_SPECIFICATION.md)
- 쟁점: 플레이어의 공개 반응을 TR-14 계열 흔적으로 처리하고 새 NPC 대사를 만들지 않는다. 새 게시물 발행도 같은 규칙으로 둘지, 발행 자체를 막을지 정해야 한다.
- 선택지: ① 발행·리포스트·인용·답글 모두 허용, 새 NPC 반응 없이 TR-14 계열 흔적만 / ② 발행만 허용, 리포스트·인용은 막음 / ③ 공개 반응·발행을 모두 막음
- 현재 가정: ①(발행 허용, 새 NPC 반응·단서·플래그 없음).
- 추천: ① — P3("보는 것도 흔적")을 지키되 새 대사를 만들지 않아 앎 매트릭스와 분량 리스크를 피한다.
- **결정(2026-11-09):** 추천안 채택 — ① 발행·리포스트·인용·답글 모두 허용, 새 NPC 반응 없이 TR-14 계열 흔적만.
- 영향 문서: `03-features/SNS_SPECIFICATION.md` 4.1·8, `01-product/TRACES_AND_REACTIONS.md` TR-14, 콘텐츠 린터, `01-product/PROGRESSION_AND_ENDINGS.md`

#### Q-OPEN-016 — 잠금화면 알림 미리보기와 설정 기본값의 충돌 · **높음** · 결정됨

- 출처: [03-features/SYSTEM_SHELL_SPECIFICATION.md:84, 461](../03-features/SYSTEM_SHELL_SPECIFICATION.md)
- 쟁점: SYSTEM_SHELL·BUSINESS_RULES는 잠금화면에서 메시지·톡·메일·은행 첫 줄을 보여 준다고 하고, SETTINGS 7절은 나머지를 "잠금 해제 시"로 둔다.
- 선택지: ① 잠금화면에서 메시지·톡·메일·은행 첫 줄, 블링크·루프 DM은 "새 메시지" / ② 전부 "잠금 해제 시" / ③ 앱별 설정 기본값을 전부 "안 함"
- 현재 가정: ①(설정의 "잠금 해제 시"는 해제 후 알림 센터 표시 규칙으로 해석).
- 추천: ① — 프롤로그의 핵심 정보(은행 지급정지·경찰·지훈)가 잠금화면에서 보여야 첫 동기가 생긴다.
- **결정(2026-11-09):** 추천안 채택 — ① 잠금화면에서 메시지·톡·메일·은행 첫 줄, 블링크·루프 DM은 "새 메시지".
- 영향 문서: `03-features/SYSTEM_SHELL_SPECIFICATION.md` 3·4절, `03-features/SETTINGS_SPECIFICATION.md` 7절, `01-product/BUSINESS_RULES.md` 9절

#### Q-OPEN-017 — 다크 모드의 플레이어 전환 허용 여부 · **높음** · 결정됨

- 출처: [00-foundation/REQUIREMENTS.md:145](../00-foundation/REQUIREMENTS.md) · [03-features/SETTINGS_SPECIFICATION.md:455](../03-features/SETTINGS_SPECIFICATION.md) · [03-features/SYSTEM_SHELL_SPECIFICATION.md:75, 465](../03-features/SYSTEM_SHELL_SPECIFICATION.md)
- 쟁점: 게임 시작 시 다크(도현의 설정)는 확정이다. 설정에서 라이트/다크/자동 전환을 플레이어가 바꿀 수 있는지는 열려 있다.
- 선택지: ① 허용(스토리 영향 없음) / ② 시작 다크 고정(전환 불가) / ③ 허용하되 스토리 시점에 자동 복귀
- 현재 가정: 허용·스토리 영향 없음.
- 추천: ① — 접근성(대비·눈부심) 이점이 있고, 테마는 상태만 바꾸며 단서·플래그를 만들지 않는다.
- **결정(2026-11-09):** 추천안 채택 — ① 허용(스토리 영향 없음).
- 영향 문서: `03-features/SETTINGS_SPECIFICATION.md`, `03-features/SYSTEM_SHELL_SPECIFICATION.md`, `02-design/ACCESSIBILITY.md`, 전체 화면 명세

#### Q-OPEN-018 — 예약 메일(EV-21)의 오프라인 발송과 엔딩 판정 · **높음** · 결정됨

- 출처: [04-tech/BACKEND_ARCHITECTURE.md:171](../04-tech/BACKEND_ARCHITECTURE.md)
- 쟁점: EV-21은 3/18 09:00 발송·엔딩 판정이다. 오프라인일 때 다음 온라인에 발송할지, 09:00에 발송된 것으로 간주해 판정할지 캐논이 명시적이지 않다.
- 선택지: ① 서버에서 대기하다 다음 온라인에 발송 / ② 09:00에 발송된 것으로 간주하고 엔딩 판정 / ③ 오프라인이면 삭제와 동일하게 처리
- 현재 가정: ①(서버 대기 → 다음 온라인 발송).
- 추천: ② — 엔딩 판정 시각이 3/18 09:00으로 고정이므로, 오프라인 여부로 결말이 달라지면 안 된다.
- **결정(2026-11-09):** 추천안 채택 — ② 3/18 09:00에 발송된 것으로 간주하고 엔딩을 판정한다.
- 영향 문서: `04-tech/BACKEND_ARCHITECTURE.md`, `01-product/PROGRESSION_AND_ENDINGS.md` 3.2·6.4, `03-features/MAIL_AND_CLOUD_SPECIFICATION.md`

#### Q-OPEN-019 — 일시정지 제스처와 단일 포인터 대체 · **높음** · 결정됨

- 출처: [02-design/ACCESSIBILITY.md:336, 388](../02-design/ACCESSIBILITY.md) · [02-design/INTERACTION_SPECIFICATIONS.md:413](../02-design/INTERACTION_SPECIFICATIONS.md) · [03-features/SYSTEM_SHELL_SPECIFICATION.md:189, 462](../03-features/SYSTEM_SHELL_SPECIFICATION.md)
- 쟁점: 캐논은 일시정지를 "세 손가락 길게 / Esc"로 정의한다. 세 손가락은 WCAG 2.5.1의 단일 포인터 대체가 없고 모바일 브라우저·OS 제스처와 충돌할 수 있다.
- 선택지: ① 세 손가락 500ms + 상태바 시각 1.5초 + Esc / ② 세 손가락만 / ③ 상태바 시각 길게 + Esc
- 현재 가정: ①(세 손가락 + 상태바 시각 + Esc).
- 추천: ① — 세 손가락을 유지하되 접근성·브라우저 충돌을 상태바 시각 길게로 우회한다.
- **결정(2026-11-09):** 추천안 채택 — ① 세 손가락 500ms + 상태바 시각 1.5초 + Esc.
- 영향 문서: `02-design/INTERACTION_SPECIFICATIONS.md`, `03-features/SYSTEM_SHELL_SPECIFICATION.md`, `02-design/ACCESSIBILITY.md`

#### Q-OPEN-020 — 음성 메모 전사 퍼즐과 자막 접근성 · **높음** · 결정됨

- 출처: [02-design/ACCESSIBILITY.md:302, 387](../02-design/ACCESSIBILITY.md)
- 쟁점: 음성 메모 전사가 퍼즐(설정에서 켜야 함)인데, 접근성상 자막 기본 제공과 긴장 관계다.
- 선택지: ① 퍼즐 유지 + 접근성 "자막 항상 켜기" 설정 추가 / ② 전사 기본 켜짐 / ③ 전사 없음
- 현재 가정: ①(퍼즐 유지 + "자막 항상 켜기" 제안).
- 추천: ① — 퍼즐을 유지하면서 접근성 설정으로 우회 경로를 제공한다.
- **결정(2026-11-09):** 추천안 채택 — ① 퍼즐 유지 + 접근성 "자막 항상 켜기" 설정 추가.
- 영향 문서: `02-design/ACCESSIBILITY.md`, `03-features/MEDIA_SPECIFICATION.md`, `03-features/PERSONAL_DATA_APPS_SPECIFICATION.md`, `02-design/SCREEN_SPECIFICATIONS_APPS.md`

#### Q-OPEN-021 — 블링크 60초·잠금 30초 실시간 타이머의 기준과 일시정지 · **높음** · 결정됨

- 출처: [02-design/SCREEN_SPECIFICATIONS.md:2041](../02-design/SCREEN_SPECIFICATIONS.md) · [03-features/SECURE_MESSAGING_SPECIFICATION.md:238](../03-features/SECURE_MESSAGING_SPECIFICATION.md) · [04-tech/AUTHENTICATION_AND_SECURITY.md:244, 245](../04-tech/AUTHENTICATION_AND_SECURITY.md) · [04-tech/BACKEND_ARCHITECTURE.md:170](../04-tech/BACKEND_ARCHITECTURE.md) · [04-tech/DATABASE_SCHEMA.md:712](../04-tech/DATABASE_SCHEMA.md) · [04-tech/STATE_MANAGEMENT.md:492](../04-tech/STATE_MANAGEMENT.md)
- 쟁점: 블링크 60초 삭제와 잠금 30초 대기가 실시간인지 게임 분 환산인지, 일시정지·시네마틱에서 멈추는지 캐논이 명시적이지 않다.
- 선택지: ① 블링크 60초·잠금 30초 모두 실시간, 일시정지·시네마틱에서 정지 / ② 모두 게임 시계로 환산 / ③ 블링크만 실시간
- 현재 가정: 실시간, 일시정지 시 정지(추천).
- 추천: ① — "읽고 60초 뒤 삭제"의 체감과 잠금 대기의 목적을 지키고, 일시정지에서는 플레이어를 벌하지 않는다.
- **결정(2026-11-09):** 추천안 채택 — ① 블링크 60초·잠금 30초 모두 실시간, 일시정지·시네마틱에서 정지.
- 영향 문서: `03-features/SECURE_MESSAGING_SPECIFICATION.md`, `04-tech/AUTHENTICATION_AND_SECURITY.md`, `04-tech/BACKEND_ARCHITECTURE.md`, `04-tech/STATE_MANAGEMENT.md`, `04-tech/DATABASE_SCHEMA.md`

### 보통

#### Q-OPEN-022 — P0/P1 화면 우선순위(잠금 키패드·앱 전환기·일시정지 하위·은행 로그인) · **보통** · 결정됨

- 출처: [02-design/NAVIGATION_ARCHITECTURE.md:691](../02-design/NAVIGATION_ARCHITECTURE.md) · [02-design/SCREEN_SPECIFICATIONS.md:2032, 2033, 2040](../02-design/SCREEN_SPECIFICATIONS.md) · [02-design/SCREEN_SPECIFICATIONS_APPS.md:3355](../02-design/SCREEN_SPECIFICATIONS_APPS.md)
- 쟁점: 인벤토리는 일부 화면을 P1로 두는데 작업 지시서는 P0 상세를 요구했다. 문서는 `P1*`(P1 유지, 상세만 P0 밀도)로 처리했다.
- 선택지: ① P0로 승격 / ② P1 유지 + 상세만 P0 밀도 / ③ 별도 `P0*` 표기
- 현재 가정: P1 유지 + 상세만 P0 밀도(34개 P0 집계 불변).
- 추천: ② — 화면 인벤토리 우선순위와 P0 34개 집계를 흔들지 않는다.
- **결정(2026-11-09):** 추천안 채택 — ② P1 유지 + 상세만 P0 밀도(34개 P0 집계 불변).
- 영향 문서: `02-design/NAVIGATION_ARCHITECTURE.md` 3절, `02-design/SCREEN_SPECIFICATIONS.md`, `06-execution/ACCEPTANCE_CRITERIA.md`

#### Q-OPEN-023 — 수동 슬롯·"다시 보기"의 MVP 포함 여부 · **보통** · 결정됨

- 출처: [00-foundation/PROJECT_SCOPE.md:98](../00-foundation/PROJECT_SCOPE.md) · [01-product/FEATURE_SPECIFICATION.md:112, 114](../01-product/FEATURE_SPECIFICATION.md) · [06-execution/ACCEPTANCE_CRITERIA.md:307](../06-execution/ACCEPTANCE_CRITERIA.md)
- 쟁점: MVP는 자동 저장만이고 수동 슬롯 3·"다시 보기"는 본편으로 분류했다. SYSTEM_SHELL·지시서는 자동+수동 3을 전제한다.
- 선택지: ① MVP 제외(자동 저장만), 본편에서 수동 슬롯 3·다시 보기 / ② MVP에 수동 슬롯 3 포함 / ③ MVP에 수동 슬롯 1만 포함
- 현재 가정: ①(자동 저장만).
- 추천: ① — MVP 96분 계산과 일치하고, 저장 손실은 자동 저장으로 완화한다.
- **결정(2026-11-09):** 추천안 채택 — ① MVP 제외(자동 저장만), 본편에서 수동 슬롯 3·다시 보기.
- 영향 문서: `00-foundation/REQUIREMENTS.md`, `03-features/SYSTEM_SHELL_SPECIFICATION.md`, `01-product/FEATURE_SPECIFICATION.md` FEAT-54, `06-execution/ACCEPTANCE_CRITERIA.md` AC-062·064

#### Q-OPEN-024 — E-102 "추천 부업" 카드의 추천 지면과 단서 판정 · **보통** · 결정됨

- 출처: [03-features/SNS_SPECIFICATION.md:70, 536](../03-features/SNS_SPECIFICATION.md)
- 쟁점: 추천 지면에도 같은 크리에이티브가 뜨고, 단서 판정은 하이라이트에서만 한다. 두 서술의 관계를 확정해야 한다.
- 선택지: ① 추천 지면=같은 크리에이티브의 광고, 단서 판정은 하이라이트만 / ② 추천 지면에서도 단서 판정 / ③ 추천 지면에서 제거
- 현재 가정: ①(광고 지면과 단서 지면 분리).
- 추천: ① — E-102의 중복 판정을 막고, 광고 노출과 단서 획득을 분리한다.
- **결정(2026-11-09):** 추천안 채택 — ① 추천 지면은 같은 크리에이티브의 광고, 단서 판정은 하이라이트만.
- 영향 문서: `03-features/SNS_SPECIFICATION.md` 4.1·8.5, `01-product/EVIDENCE_LEDGER.md` E-102

#### Q-OPEN-025 — A-15 하린 글의 300자 초과 처리 · **보통** · 결정됨

- 출처: [03-features/SNS_SPECIFICATION.md:188, 537](../03-features/SNS_SPECIFICATION.md)
- 쟁점: A-15는 계좌번호·피해 호소를 담아 300자를 넘을 수 있다. 글 게시물 300자 규칙과 충돌한다.
- 선택지: ① "장문 글" 예외 허용 / ② 300자 안으로 압축 / ③ 스레드 2개로 분할
- 현재 가정: 300자 규칙 + 초과 가능(미확정).
- 추천: ② — 글 게시물 규칙을 예외 없이 유지하고 계좌·호소 문장만 남긴다.
- **결정(2026-11-09):** 추천안 채택 — ② 300자 안으로 압축한다.
- 영향 문서: `03-features/SNS_SPECIFICATION.md` 8.5, `01-product/EVIDENCE_LEDGER.md` E-47

#### Q-OPEN-026 — 블링크 "이 기기에만 저장"과 읽음·캡처 신호 전송의 관계 · **보통** · 결정됨

- 출처: [03-features/SECURE_MESSAGING_SPECIFICATION.md:237](../03-features/SECURE_MESSAGING_SPECIFICATION.md)
- 쟁점: MAIL 1절의 "서버에서 대기: 블링크 미전송 읽음"과 "이 기기에만 저장"이 충돌해 보인다.
- 선택지: ① 본문은 기기에만, 읽음·캡처 상태 신호만 전송(현행) / ② 완전 로컬(상태 신호도 다음 대화에) / ③ "서버 대기" 문구 삭제
- 현재 가정: ①(문구는 "이 대화는 이 기기에만 저장됩니다"로 한정).
- 추천: ① — 캐논의 삭제·캡처 알림을 유지하면서 암호학적 보장은 주장하지 않는다.
- **결정(2026-11-09):** 추천안 채택 — ① 본문은 기기에만, 읽음·캡처 상태 신호만 전송.
- 영향 문서: `03-features/SECURE_MESSAGING_SPECIFICATION.md` 1·4절, `03-features/MAIL_AND_CLOUD_SPECIFICATION.md`, `04-tech/AUTHENTICATION_AND_SECURITY.md` 4절

#### Q-OPEN-027 — 튜브 시청 기록이 NPC에게 가는 흔적인지 · **보통** · 결정됨

- 출처: [03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md:55, 254](../03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md)
- 쟁점: FEATURE는 튜브의 "남기는 흔적"을 시청 기록으로 적지만 TR 표에 대응 TR이 없다.
- 선택지: ① 플레이어의 로컬 수사 기록만(현행) / ② TR 추가 / ③ 도현·실장에게 보이는 흔적
- 현재 가정: ①(로컬 수사 기록만).
- 추천: ① — TR 표에 없는 흔적을 새로 만들면 반응·분량이 늘고 P3 범위가 흔들린다.
- **결정(2026-11-09):** 추천안 채택 — ① 플레이어의 로컬 수사 기록만.
- 영향 문서: `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` 2·6절, `01-product/TRACES_AND_REACTIONS.md`, `01-product/FEATURE_SPECIFICATION.md`

#### Q-OPEN-028 — 모아 쪽지 읽음이 익명7(민지)에게 가는 흔적인지 · **보통** · 결정됨

- 출처: [03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md:142, 157, 168, 255](../03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md)
- 쟁점: FEATURE는 모아의 "남기는 흔적"을 쪽지 읽음으로 적지만 TR 표에 대응 TR이 없다.
- 선택지: ① 앱 안의 읽음 시각만(현행) / ② 익명7에게 읽음 표시 / ③ TR 추가
- 현재 가정: ①(앱 안 상태만).
- 추천: ① — 쪽지 읽음은 수사 기록이고, 민지 반응은 V-09·EV-25 경로로 이미 설계되어 있다.
- **결정(2026-11-09):** 추천안 채택 — ① 앱 안의 읽음 시각만.
- 영향 문서: `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` 3·6절, `01-product/TRACES_AND_REACTIONS.md`

#### Q-OPEN-029 — 무료 체험("첫 온라인까지")의 종료·저장·재개 규칙 · **보통** · 결정됨

- 출처: [00-foundation/Bible.md:107](../00-foundation/Bible.md) · [00-foundation/REQUIREMENTS.md:146](../00-foundation/REQUIREMENTS.md)
- 쟁점: "수익 모델 = 프리미엄 단품(무료 체험: 첫 온라인까지)"만 있고 종료 지점·저장·재개 규칙이 없다.
- 선택지: ① 첫 온라인까지 체험, 종료 시 자동 저장·구매 후 같은 세이브 재개 / ② 체험 없음(유료 단품) / ③ 첫 온라인 + 30분까지 체험
- 현재 가정: 첫 온라인까지(규칙 미정).
- 추천: ① — 제품 가정과 일치하고, 체험 종료가 진행 손실로 느껴지지 않게 한다.
- **결정(2026-11-09):** 추천안 채택 — ① 첫 온라인까지 체험, 종료 시 자동 저장·구매 후 같은 세이브 재개.
- 영향 문서: `00-foundation/Bible.md`, `00-foundation/PROJECT_SCOPE.md`, `01-product/BUSINESS_RULES.md`, `01-product/PRD.md`

#### Q-OPEN-030 — 다국어·결제·웹뷰 포장의 범위와 일정 · **보통** · 결정됨

- 출처: [00-foundation/PROJECT_SCOPE.md:97](../00-foundation/PROJECT_SCOPE.md)
- 쟁점: 다국어·결제 구현·웹뷰 포장의 일정과 범위가 원본에 없다. 문서는 "현재 계획에 없음"으로만 기록했다.
- 선택지: ① 현재 계획 없음(한국어 단일·결제 미구현) / ② 웹뷰 포장만 P8 / ③ 다국어·결제를 P9 이후
- 현재 가정: ①(현재 계획 없음).
- 추천: ① — MVP·본편 범위를 흔들지 않는다.
- **결정(2026-11-09):** 추천안 채택 — ① 현재 계획 없음(한국어 단일·결제 미구현).
- 영향 문서: `00-foundation/PROJECT_SCOPE.md`, `05-quality/DEPLOYMENT_ARCHITECTURE.md`, `00-foundation/Bible.md`

#### Q-OPEN-031 — 1차 배포 채널(정적 호스팅 vs 파일 공유) · **보통** · 결정됨

- 출처: [05-quality/DEPLOYMENT_ARCHITECTURE.md:235](../05-quality/DEPLOYMENT_ARCHITECTURE.md)
- 쟁점: `file://`에서 localStorage·history 동작이 브라우저·OS 버전마다 다르다.
- 선택지: ① 정적 호스팅 1차 + 파일 공유 보조 / ② 파일 공유 1차 / ③ 앱 스토어 웹뷰 포장 1차
- 현재 가정: 정적 호스팅 1차, 파일 공유 보조(추천).
- 추천: ① — `file://`의 저장·뒤로가기 편차를 피하고, 오프라인은 파일 공유로 보조한다.
- **결정(2026-11-09):** 추천안 채택 — ① 정적 호스팅 1차 + 파일 공유 보조.
- 영향 문서: `05-quality/DEPLOYMENT_ARCHITECTURE.md`, `04-tech/AUTHENTICATION_AND_SECURITY.md` CSP, `05-quality/TESTING_STRATEGY.md`

#### Q-OPEN-032 — 배포 후 오류 제보 경로 · **보통** · 결정됨

- 출처: [05-quality/DEPLOYMENT_ARCHITECTURE.md:238](../05-quality/DEPLOYMENT_ARCHITECTURE.md)
- 쟁점: 오류 수집을 하지 않으므로 플레이어 제보 경로를 제품 차원에서 정해야 한다.
- 선택지: ① 외부 채널 없음(문서대로) / ② 배포 페이지에 메일 링크 / ③ 배포 페이지에 정적 폼 링크
- 현재 가정: 외부 채널 없음.
- 추천: ① — 서버 없는 단일 HTML 원칙을 유지하고, 필요하면 배포 페이지에 정적 안내만 둔다.
- **결정(2026-11-09):** 추천안 채택 — ① 외부 채널 없음(배포 페이지에 정적 안내만 둘 수 있다).
- 영향 문서: `05-quality/DEPLOYMENT_ARCHITECTURE.md`, `05-quality/ERROR_HANDLING.md`

#### Q-OPEN-033 — 녹음 성우와 오디오 예산 · **보통** · 결정됨

- 출처: [IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md) 열린 결정 표
- 쟁점: design/15 5절의 열린 결정. 음성 메모 42분 전체를 성우로 녹음할지, 자막만 쓸지.
- 선택지: ① MVP 자막, 본편 성우 / ② 자막만 / ③ 자막 + 핵심 4구간 클립만
- 현재 가정: MVP 자막, 본편 성우(design/15 5절 추천).
- 추천: ① — 오디오 350KB 예산으로 42분 전체를 담을 수 없고, MVP는 캐논대로 자막만 쓴다.
- **결정(2026-11-09):** 추천안 채택 — ① MVP 자막, 본편 성우.
- 영향 문서: `03-features/MEDIA_SPECIFICATION.md`, `04-tech/FILE_AND_MEDIA_MANAGEMENT.md`, `02-design/ACCESSIBILITY.md`

#### Q-OPEN-034 — 제목 표기(DONTKNOW vs @dontknow__) · **보통** · 결정됨

- 출처: [IMPLEMENTATION_ROADMAP](IMPLEMENTATION_ROADMAP.md) 열린 결정 표
- 쟁점: design/15 5절의 열린 결정. 제목을 `DONTKNOW`로 쓸지, `@dontknow__` 로고 변형으로 쓸지.
- 선택지: ① DONTKNOW / ② @dontknow__ / ③ 언더바 두 개를 숨기는 변형
- 현재 가정: 언더바 두 개를 숨기는 변형(design/15 5절 추천).
- 추천: ③ — 세 겹 의미를 유지하면서 UI에서 밈 표기처럼 보이지 않게 한다.
- **결정(2026-11-09):** 추천안 채택 — ③ 언더바 두 개를 숨기는 변형.
- 영향 문서: `00-foundation/Bible.md`, `02-design/ICONOGRAPHY_AND_IMAGERY.md`, 프롤로그·엔딩 시네마틱

#### Q-OPEN-035 — 아빠 톡방 목록 배지 6의 해석 · **보통** · 결정됨

- 출처: [02-design/SCREEN_SPECIFICATIONS.md:2034](../02-design/SCREEN_SPECIFICATIONS.md)
- 쟁점: 캐논은 "아버지의 톡 6통, 전부 1"이라고만 적는다. 6통 각각의 "1"을 목록 배지 6으로 합산하는 해석이 맞는지.
- 선택지: ① 목록 배지 6 + 대화방 각 말풍선 "1" / ② 목록 배지 없음 / ③ 6통을 대화 1개로 합침
- 현재 가정: ①(목록 배지 6).
- 추천: ① — DH-3에서 6통의 "1"이 한꺼번에 사라지는 연출과 일치한다.
- **결정(2026-11-09):** 추천안 채택 — ① 목록 배지 6 + 대화방 각 말풍선 "1".
- 영향 문서: `02-design/SCREEN_SPECIFICATIONS.md`, `03-features/MESSAGING_SPECIFICATION.md`, `01-product/PROGRESSION_AND_ENDINGS.md` 4.1

#### Q-OPEN-036 — 강민석 구독자 수 표기(4.3만 vs 43.2k vs 4만) · **보통** · 결정됨

- 출처: [01-product/CHARACTERS.md:164](../01-product/CHARACTERS.md) · [03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md:258](../03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md)
- 쟁점: CHARACTERS P-05·A-16은 "4.3만/43.2k", NARRATIVE는 "구독자 4만", VIDEO는 4.3만을 쓴다.
- 선택지: ① 4.3만으로 통일(43.2k는 같은 값의 정밀 표기) / ② 4만으로 통일 / ③ 43.2k를 정본으로
- 현재 가정: 4.3만.
- 추천: ① — 인물·계정·튜브가 같은 값을 쓰고, 43.2k는 같은 값의 정밀 표기로 본다.
- **결정(2026-11-09):** 추천안 채택 — ① 4.3만으로 통일(43.2k는 같은 값의 정밀 표기).
- 영향 문서: `01-product/CHARACTERS.md` P-05·A-16, `01-product/NARRATIVE_CANON.md`, `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md`, `03-features/SNS_SPECIFICATION.md`

---

## B. 기본값 확정

구현자는 아래 값을 그대로 쓴다. 변경이 필요하면 이 표을 갱신하고 관련 문서 작성자에게 알린다.

| ID | 항목 | 확정 기본값 | 근거 문서 |
|---|---|---|---|
| Q-OPEN-037 | 콘텐츠 린터 금칙어 목록 | PRODUCT_PRINCIPLES 2.1의 5개 검사 항목을 기준으로 하고, 실제 단어 목록은 SYSTEM_ARCHITECTURE 5절 린터 구현 시 확정한다. | `00-foundation/PRODUCT_PRINCIPLES.md` 2.1, `04-tech/SYSTEM_ARCHITECTURE.md` 5절 |
| Q-OPEN-038 | WCAG 2.2 AA와 파생 토큰 | WCAG 2.2 AA를 기준으로 하고, 대비 미달 원값은 유지하되 `label-2-aa`·`tint-ink`·`tint-fill`·`destructive-ink`·`destructive-fill`·`success-ink`·`warning-ink` 7종 파생 토큰을 추가한다. | `02-design/ACCESSIBILITY.md` 10절, `02-design/DESIGN_TOKENS.md` |
| Q-OPEN-039 | 성능 2초·100ms 측정 정의 | 로컬/캐시에서 파일 준비 완료 후 잠금화면 조작 가능 2.0초. 네트워크 최초 다운로드는 별도. 100ms는 입력 피드백 기준. | `05-quality/PERFORMANCE_REQUIREMENTS.md` 1·4.1절, `04-tech/SYSTEM_ARCHITECTURE.md` 6절, `06-execution/ACCEPTANCE_CRITERIA.md` AC-102·502 |
| Q-OPEN-040 | V-04′ 데이터 ID | V-04의 대체 경로 변형으로 보고 별도 콘텐츠 행 ID를 만들지 않는다. 데이터에는 V-04의 alias로 기록한다. | `01-product/ACTION_PROOF.md` 2절, `04-tech/DATABASE_SCHEMA.md` 3절 |
| Q-OPEN-041 | 린터의 필수 ○와 엔딩 A 최소 조건 | 필수 ○ 표기와 엔딩 A 최소 조건을 린터가 별도 규칙으로 함께 검사한다. | `01-product/ACTION_PROOF.md` 2절, `04-tech/DATABASE_SCHEMA.md` 5절 |
| Q-OPEN-042 | 오프라인 텍스트 대치 노출 범위 | 이 기기에 등록된 것만 보이고, 슬레이트 동기화분은 온라인 전까지 비어 있다. | `01-product/BUSINESS_RULES.md` 5절, `03-features/PERSONAL_DATA_APPS_SPECIFICATION.md` |
| Q-OPEN-043 | 알림 기록과 동기화 삭제의 구분 | 알림 기록은 원본이 지워져도 보존하고, 동기화 삭제는 항목만 사라진다. 두 상태를 콘텐츠 데이터에서 분리한다. | `01-product/BUSINESS_RULES.md` 9절, `03-features/SYSTEM_SHELL_SPECIFICATION.md` |
| Q-OPEN-044 | E-12b 층 표기 | 층은 T1(바로택시)으로 두고, 같은 행의 "3/15 분실물 문의(T2)"는 T2 보조 단서로 병기한다. | `01-product/EVIDENCE_LEDGER.md` E-12b |
| Q-OPEN-045 | L-11의 T2/T1 관계 | L-11은 T2 전용 장소로 두고, T1 모아 2월 댓글은 보조 단서로 유지한다. | `01-product/LOCATIONS.md` 4·5절 |
| Q-OPEN-046 | L-01과 도현의 방 | 도현의 방은 L-01(성원아파트 103동) 내부로 본다. 게임 시작 장면의 책상은 그 방 안이다. | `01-product/LOCATIONS.md`, `01-product/NARRATIVE_CANON.md` 3.3 |
| Q-OPEN-047 | 연대기 표의 행 순서 | 문서 표는 원본 순서를 유지하고, 연대기 참조·화면 표시는 시각순으로 정렬한다. | `01-product/NARRATIVE_CANON.md` 3.1 |
| Q-OPEN-048 | 보수 97분의 여유와 플레이테스트 | 보수 97분을 유지하고 P7에서 숙련 테스터 실측을 가장 먼저 수행한다. | `01-product/PLAYTIME_BUDGET.md` 5절, `05-quality/TESTING_STRATEGY.md` |
| Q-OPEN-049 | 플레이타임 구성 비율의 기준 | 2절 비트 시간표의 소계를 린터 분량 검사의 기준으로 삼는다. 3절 비율은 참고 추정치다. | `01-product/PLAYTIME_BUDGET.md` 2·3절 |
| Q-OPEN-050 | 리스크 대응의 실행 주체·일정 | 대응 주체와 일정은 IMPLEMENTATION_ROADMAP의 P7·P8 단계에서 정한다. | `01-product/PRD.md` 리스크 표, `06-execution/IMPLEMENTATION_ROADMAP.md` |
| Q-OPEN-051 | MVP 보수 96분 측정 | 계산값 96분을 유지하고 실제 측정은 P7에서 한다. | `01-product/PRD.md`, `06-execution/IMPLEMENTATION_ROADMAP.md` |
| Q-OPEN-052 | 미리보기 열람과 읽음 집계의 경계 | 블링크 앱 열람은 KS-1, 잠금화면 미리보기(V-15)는 KS-0을 유지한다. 톡·메시지는 앱 열람만 읽음으로 집계하고 미리보기는 읽음이 아니다. | `01-product/TRACES_AND_REACTIONS.md` 1·2절, `01-product/ACTION_PROOF.md` V-15 |
| Q-OPEN-053 | 일시정지 메뉴의 소리 항목(MVP) | MVP에서는 "설정(소리)"을 숨기거나 비활성으로 두고, 본편에서 활성화한다. | `01-product/USER_FLOWS.md`, `03-features/SYSTEM_SHELL_SPECIFICATION.md`, `design/15-mvp-and-roadmap.md` |
| Q-OPEN-054 | 엔딩 판정 논리식의 괄호 | 6.4의 논리식을 구현할 때 ∧·∨·¬의 명시적 괄호로 고정한다. | `01-product/USER_FLOWS.md`, `01-product/PROGRESSION_AND_ENDINGS.md` 6.4 |
| Q-OPEN-055 | 온라인 전 대비의 페이싱 | 보수 합계 31.8분에 포함하고, 일반 플레이어는 생략 가능하다. 생략 시 페이싱은 P7에서 측정한다. | `01-product/USER_JOURNEYS.md`, `01-product/PLAYTIME_BUDGET.md` |
| Q-OPEN-056 | 일반 165분과 검증 목표 | 165분은 계산 기준이고, 실제 중앙값 목표는 140~190분이다. | `01-product/USER_PERSONAS.md`, `01-product/PLAYTIME_BUDGET.md` |
| Q-OPEN-057 | 전환과 일반 상태 변화의 시간 | 화면 푸시·시트 전환은 350ms, 일반 상태 변화는 160~240ms로 병기한다. | `02-design/DESIGN_SYSTEM.md` 6절, `02-design/DESIGN_TOKENS.md` |
| Q-OPEN-058 | 시스템 글리프 44종 | 44종 목록을 유지하고 P5에서 30개 앱 기능·화면 명세와 중복·누락을 재대조한다. | `02-design/ICONOGRAPHY_AND_IMAGERY.md` 3절 |
| Q-OPEN-059 | 캘린더 아이콘 날짜 | 정적 날짜를 쓴다. 실시간 시계처럼 보이지 않게 한다. | `02-design/ICONOGRAPHY_AND_IMAGERY.md` 5절 |
| Q-OPEN-060 | 설정 하위 트리 깊이 4단계 | 설정 하위 트리는 "설정 스택 예외"로 4단계를 허용한다. | `02-design/NAVIGATION_ARCHITECTURE.md` 3절, `02-design/UI_UX_GUIDELINES.md` 1.2 |
| Q-OPEN-061 | 폴더 화면의 overlay 처리 | SCR-OS-FOLDER는 overlay로 둔다. 배경 홈이 보여야 한다. | `02-design/NAVIGATION_ARCHITECTURE.md` 3절 |
| Q-OPEN-062 | 인증 화면의 탐색 깊이 | 누리은행 로그인 등 인증 화면은 탐색 깊이에 세지 않는다. | `02-design/NAVIGATION_ARCHITECTURE.md` 2절 |
| Q-OPEN-063 | 데스크톱 배경 | P5 아트 전에는 단색 폴백을 쓰고, 배경에는 스탠드·케이블 외 사물을 넣지 않는다. | `02-design/RESPONSIVE_DESIGN.md` 4절 |
| Q-OPEN-064 | 톡 친구 목록의 장식 데이터 | 내 상태 메시지·최근 공유 대상 5명은 "(장식, 단서 아님)"이며 최종 문구는 콘텐츠 작성 시 정한다. | `02-design/SCREEN_SPECIFICATIONS.md`, `03-features/MESSAGING_SPECIFICATION.md` |
| Q-OPEN-065 | 알림 23개의 앱별 배분 | 캐논 예시 3건과 블링크/루프 DM "새 메시지"만 확정하고 나머지는 콘텐츠 작성 대상으로 둔다. | `03-features/SYSTEM_SHELL_SPECIFICATION.md` 3절, `02-design/SCREEN_SPECIFICATIONS.md` |
| Q-OPEN-066 | 블링크 빈 상태 문구 | "대화가 없습니다"로 통일한다. | `02-design/UI_UX_GUIDELINES.md` 2.4, `03-features/SECURE_MESSAGING_SPECIFICATION.md` 7절 |
| Q-OPEN-067 | 음성 전사와 새 단서 | 전사 텍스트는 E-37 원문 4구간이며, 전사를 켜는 행위는 새 단서·플래그를 만들지 않는다. | `02-design/SCREEN_SPECIFICATIONS_APPS.md`, `03-features/MEDIA_SPECIFICATION.md` |
| Q-OPEN-068 | 이 폰의 모델명 | 모델명을 만들지 않고 "도현의 폰"과 시러스 계정만 표시한다. | `02-design/SCREEN_SPECIFICATIONS_APPS.md` SCR-SET-ABOUT |
| Q-OPEN-069 | 알림 설정의 앱 목록 범위 | 앱 30종을 기본값 "잠금 해제 시"로 두되, 캐논 근거·흔적은 만들지 않는다. | `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md`, `03-features/SETTINGS_SPECIFICATION.md` 7절 |
| Q-OPEN-070 | 시트 높이 단계 | 중간 55%를 기본으로 하고, 내용이 적은 화면(편집 기록·글자 크기)은 25%를 허용한다. | `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md`, `02-design/INTERACTION_SPECIFICATIONS.md` |
| Q-OPEN-071 | 거래내역의 개별 행 | 명시된 합계·시각만 표시하고, 새 개별 행을 만들 때도 캐논 수치를 넘지 않는다. | `03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md`, `01-product/EVIDENCE_LEDGER.md` |
| Q-OPEN-072 | E-39의 대표 문서 | E-39는 MAPS 문서가 대표하고, COMMERCE는 결제 행만 교차 인용한다. | `03-features/MAPS_AND_MOBILITY_SPECIFICATION.md`, `03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md` |
| Q-OPEN-073 | E-16의 시각 표기 | "3/17 21:xx" 고정 대신 게임 시각 기준 상대 표기로 구현한다. | `03-features/MAIL_AND_CLOUD_SPECIFICATION.md` |
| Q-OPEN-074 | E-218 취소 요청 메일 | 취소 요청 메일의 새 ID를 만들지 않고 E-218 상세에 "요청 접수 3/15 09:31"만 보여 준다. | `03-features/MAIL_AND_CLOUD_SPECIFICATION.md` 2.2절 |
| Q-OPEN-075 | 저장 장소 K의 메모 | "1203 / 주차 B2"로 통일한다. | `03-features/MAPS_AND_MOBILITY_SPECIFICATION.md`, `01-product/LOCATIONS.md` |
| Q-OPEN-076 | 바로택시 이동 시간 | 도착지와 무관하게 호출 확정 후 게임 +18분으로 고정한다. | `03-features/MAPS_AND_MOBILITY_SPECIFICATION.md`, `01-product/LOCATIONS.md`, `01-product/PROGRESSION_AND_ENDINGS.md` 6.3 |
| Q-OPEN-077 | 지갑 교통카드 잔액 | 숫자를 노출하지 않고 "잔액 표시(장식)"로 둔다. | `03-features/MAPS_AND_MOBILITY_SPECIFICATION.md` |
| Q-OPEN-078 | 음성 메모의 크기와 길이 | "42:31 · 41MB"로 함께 표시한다. | `03-features/MEDIA_SPECIFICATION.md`, `01-product/EVIDENCE_LEDGER.md` E-37 |
| Q-OPEN-079 | 최근 삭제된 항목의 복구 | 열람만 제공하고 복구 버튼은 두지 않는다. | `03-features/MEDIA_SPECIFICATION.md` |
| Q-OPEN-080 | 출석요구서.pdf의 E ID | 별도 E ID 없이 E-11의 첨부로 유지한다. | `03-features/MEDIA_SPECIFICATION.md`, `01-product/EVIDENCE_LEDGER.md` E-11 |
| Q-OPEN-081 | 교육자료.pdf 첨부 | 첨부를 허용하되 새 플래그를 만들지 않고 기본 회신을 쓴다. | `03-features/MEDIA_SPECIFICATION.md`, `01-product/PROGRESSION_AND_ENDINGS.md` 4.6 |
| Q-OPEN-082 | 생일인 친구 표시 | "오늘 생일인 친구 없음"만 표시하고 아빠 4/3은 노출하지 않는다. | `03-features/MESSAGING_SPECIFICATION.md` 3.4절 |
| Q-OPEN-083 | 시스템 문자 발신 번호 | 기관명과 "1600-XXXX"(한결)만 표시하고 실제 번호는 만들지 않는다. | `03-features/MESSAGING_SPECIFICATION.md` |
| Q-OPEN-084 | 메시지 목록의 혼합 | 시러스 메시지와 시스템 문자를 한 시간순 목록에 두고 유형 라벨로 구분한다. | `03-features/MESSAGING_SPECIFICATION.md` 2절 |
| Q-OPEN-085 | 전화 최근 기록 | 부재중 다수를 한 묶음으로 표시하고 첫·마지막 시각만 보여 준다. | `03-features/MESSAGING_SPECIFICATION.md` |
| Q-OPEN-086 | 메모 "비번"의 숫자 | 메모 본문에 숫자를 추가하지 않고 E-07(생년월일 끝자리) 경로로 확인한다. | `03-features/PERSONAL_DATA_APPS_SPECIFICATION.md` |
| Q-OPEN-087 | 웨이브 로그아웃 열람 | 온라인을 요구하고, 오프라인에서는 열린 탭·기록만 보인다. | `03-features/PERSONAL_DATA_APPS_SPECIFICATION.md` |
| Q-OPEN-088 | 계산기 기록의 장식 줄 | 캐논 4줄 외 16줄은 장식(단서 아님)으로 채우고 새 단서를 만들지 않는다. | `03-features/PERSONAL_DATA_APPS_SPECIFICATION.md` |
| Q-OPEN-089 | 오프라인 캡처 알림 | 상대에게 보이는 캡처 표시는 다음 온라인 때 전송한다. | `03-features/SECURE_MESSAGING_SPECIFICATION.md`, `01-product/TRACES_AND_REACTIONS.md` 1절 |
| Q-OPEN-090 | 화면 기록 저장 위치 | 사진 앱의 화면 기록 앨범에 저장한다. | `03-features/SECURE_MESSAGING_SPECIFICATION.md`, `03-features/MEDIA_SPECIFICATION.md` |
| Q-OPEN-091 | 읽음 즉시 전송과 비행기 모드 | 온라인일 때 즉시, 오프라인일 때 다음 온라인 때 전송한다. | `03-features/SECURE_MESSAGING_SPECIFICATION.md` |
| Q-OPEN-092 | 비밀 대화의 과거 표시 | 대화방에 사라진 과거를 표시하지 않고, 사진 앱의 3/10 캡처 1장만 남긴다. | `03-features/SECURE_MESSAGING_SPECIFICATION.md` |
| Q-OPEN-093 | 자동 모드의 판정 시계 | 실제 기기 시계가 아니라 게임 시계를 따른다. | `03-features/SETTINGS_SPECIFICATION.md` |
| Q-OPEN-094 | 디스플레이 메뉴와 플레이타임 | 디스플레이·접근성 옵션은 보수 97분 계산을 바꾸지 않는다. 어디서든 접근 가능하다. | `03-features/SETTINGS_SPECIFICATION.md`, `01-product/PLAYTIME_BUDGET.md` |
| Q-OPEN-095 | A-12의 나머지 14개 게시물 | 14개를 글 게시물(장식)로 두고 문구·시각은 콘텐츠 작성 시 확정한다. | `03-features/SNS_SPECIFICATION.md` 8.5절 |
| Q-OPEN-096 | A-16의 2/20 게시물 종류 | 글 게시물로 확정한다. | `03-features/SNS_SPECIFICATION.md` 8.5절 |
| Q-OPEN-097 | A-18 카드뉴스의 캐러셀 | 사진 게시물 41개로 두고, 캐러셀 수는 1~10장 범위에서 콘텐츠 작성 시 확정한다. | `03-features/SNS_SPECIFICATION.md` 8.5절 |
| Q-OPEN-098 | 활동 기록의 저장 유형 | 활동 기록 type에 `save`를 포함해 E-43("좋아요 + 저장")을 표시한다. | `03-features/SNS_SPECIFICATION.md` 8.6절, `01-product/EVIDENCE_LEDGER.md` E-43 |
| Q-OPEN-099 | 글 게시물의 DM 공유 | 루프 UI에서 글 게시물의 DM 공유 버튼을 노출하지 않는다. 사진 게시물만 DM·스토리 공유한다. | `03-features/SNS_SPECIFICATION.md` 4.2·8절 |
| Q-OPEN-100 | 추천·트렌드의 장식 범위 | 캐논 단서를 새로 만들지 않고 EV-32의 minji.sw 넛지만 예외로 둔다. | `03-features/SNS_SPECIFICATION.md` 4.1절 |
| Q-OPEN-101 | 홈 3페이지의 빈 상태 | "3페이지, 비어 있음"을 그대로 보여 준다. | `03-features/SYSTEM_SHELL_SPECIFICATION.md` 4절 |
| Q-OPEN-102 | 일시정지 설정과 LUMA 설정의 공유 범위 | 글자 크기·시간 흐름·소리·동작 줄이기와 디스플레이 값만 공유한다. | `03-features/SYSTEM_SHELL_SPECIFICATION.md`, `03-features/SETTINGS_SPECIFICATION.md` |
| Q-OPEN-103 | 첫 시네마틱 건너뛰기 | 첫 재생만 금지하고 이후 재생은 허용한다. | `03-features/SYSTEM_SHELL_SPECIFICATION.md` 10절 |
| Q-OPEN-104 | 모아 게시판 이름 | 게시판 1/2/3으로 두고 34글은 장식(단서 아님)으로 표시한다. | `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` 8절 |
| Q-OPEN-105 | 내가 쓴 댓글 | 빈 화면으로 둔다. | `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` |
| Q-OPEN-106 | 튜브 영상 길이·스틸·타임코드 | 영상별 길이와 6~10장 스틸, 자막 검색 구간의 타임코드는 콘텐츠 작성 시 확정한다. | `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` |
| Q-OPEN-107 | 익명5·익명7 표기 | 쪽지함에서 익명7 표기를 유지하고 실명 전환 시점을 두지 않는다. | `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` 8절 |
| Q-OPEN-108 | action.input의 via 값 | `suggested`·`typed`·`share` 세 값으로 고정한다. | `04-tech/API_SPECIFICATION.md` 3절, `03-features/MESSAGING_SPECIFICATION.md` |
| Q-OPEN-109 | 디버그 코드 제거 빌드 | 별도 제거 빌드를 만들지 않고 `?debug=1`·`?test=1` 파라미터 게이트만 둔다. | `04-tech/API_SPECIFICATION.md` 6절, `05-quality/DEPLOYMENT_ARCHITECTURE.md` |
| Q-OPEN-110 | ev.fire의 actions 이름 | `events.json`의 `do` 액션 이름을 그대로 담고, 다르면 DATABASE_SCHEMA 3.8을 고친다. | `04-tech/API_SPECIFICATION.md`, `04-tech/DATABASE_SCHEMA.md` 3.8절 |
| Q-OPEN-111 | 부계정 메일 코드 | 만료 10분(게임 40분), 1회용, 재전송 허용. | `04-tech/AUTHENTICATION_AND_SECURITY.md` 2.3절, `03-features/MAIL_AND_CLOUD_SPECIFICATION.md` |
| Q-OPEN-112 | CSP frame-ancestors | `<meta>` CSP를 기본으로 하고, 정적 호스팅에서는 HTTP 헤더로도 준다. 파일 공유 시에는 meta만 적용된다. | `04-tech/AUTHENTICATION_AND_SECURITY.md` 2절, `05-quality/DEPLOYMENT_ARCHITECTURE.md` |
| Q-OPEN-113 | items의 kind enum과 data 스키마 | 선택 필드 추가는 허용하고, 필수 필드 변경은 DATABASE_SCHEMA를 갱신한다. | `04-tech/DATABASE_SCHEMA.md` 3절 |
| Q-OPEN-114 | 세이브 schemaVersion 시작 값 | 첫 구현은 1로 시작하고 1→2→3 인위적 마이그레이션 체인을 만들지 않는다. | `04-tech/DATABASE_SCHEMA.md` 4절, `05-quality/DEPLOYMENT_ARCHITECTURE.md` |
| Q-OPEN-115 | 린터 L14와 T2 캐시 | "최초 노출은 online"으로 검사하고, 한 번 온라인에서 본 T2의 오프라인 캐시는 예외로 둔다. | `04-tech/DATABASE_SCHEMA.md` 5절, `04-tech/SYSTEM_ARCHITECTURE.md` 4.1절 |
| Q-OPEN-116 | 스크린샷 썸네일 | 선언적 썸네일 + stateRef로 표현하고 실제 캡처 API는 쓰지 않는다. | `04-tech/FILE_AND_MEDIA_MANAGEMENT.md` 6절 |
| Q-OPEN-117 | 폰트 서브셋과 희귀 음절 | 한글 상용 2,350자를 넣고 희귀 음절은 시스템 글꼴 폴백을 허용한다. | `04-tech/FILE_AND_MEDIA_MANAGEMENT.md` |
| Q-OPEN-118 | 오디오 350KB 예산 | 핵심 4구간 클립만 넣는다. 본편 성우 녹음 시 예산을 다시 배분한다. | `04-tech/FILE_AND_MEDIA_MANAGEMENT.md`, `03-features/MEDIA_SPECIFICATION.md` |
| Q-OPEN-119 | window.__ASSETS 전역 | 빌드 산출물 전역으로만 두고 모듈은 `content.asset(assetId)`로 접근한다. 새 전역을 늘리지 않는다. | `04-tech/FILE_AND_MEDIA_MANAGEMENT.md`, `04-tech/API_SPECIFICATION.md` 4절 |
| Q-OPEN-120 | 시계 앱 모듈 파일명 | `clockapp.js`로 고정한다. `clock.js`와 혼동하지 않는다. | `04-tech/FRONTEND_ARCHITECTURE.md` 1절, `06-execution/DEVELOPMENT_PHASES.md` |
| Q-OPEN-121 | 제스처 구현 기본값 | 길게 누르기 500ms, 두 번 탭 300ms, 뒤로 밀기 60px. INTERACTION_SPECIFICATIONS가 다른 값을 확정하면 그쪽이 우선한다. | `04-tech/FRONTEND_ARCHITECTURE.md`, `02-design/INTERACTION_SPECIFICATIONS.md` |
| Q-OPEN-122 | 브라우저 뒤로가기와 pushState | `history.pushState`로 내부 스택에 연결하고, `file://` 동작은 실기기에서 확인한다. | `04-tech/FRONTEND_ARCHITECTURE.md` |
| Q-OPEN-123 | 시간 흐름 끄기의 "앱 전환 1회" | 홈에서 다른 앱을 여는 것 1회를 게임 1분으로 본다. | `04-tech/STATE_MANAGEMENT.md` 9절, `01-product/BUSINESS_RULES.md` 5절 |
| Q-OPEN-124 | ui.stack의 저장·복원 | ui.stack을 세이브에 저장·복원하고, 실패하면 홈으로 복구한다. | `04-tech/STATE_MANAGEMENT.md` 9절 |
| Q-OPEN-125 | 동기화 점의 지속 시간 | `syncDotUntil`을 게임 1분으로 둔다(연출값). | `04-tech/STATE_MANAGEMENT.md` 9절, `03-features/SYSTEM_SHELL_SPECIFICATION.md` |
| Q-OPEN-126 | 인증 전용 모듈 | 별도 `core/auth.js`를 두지 않고 `os/shell.js`와 각 앱 모듈에 두며, 인증 상태만 `apps.*`에 저장한다. | `04-tech/SYSTEM_ARCHITECTURE.md` 2절 |
| Q-OPEN-127 | 배포 파일명 | `dontknow-6.2.0.html`처럼 버전 파일명을 유지하고 최신 링크용 `dontknow.html`을 함께 둔다. | `05-quality/DEPLOYMENT_ARCHITECTURE.md` |
| Q-OPEN-128 | 코드 스타일 | 2칸 들여쓰기, 작은따옴표, 세미콜론. 새 `game/` 폴더에 적용한다. | `05-quality/DEVELOPMENT_GUIDELINES.md` |
| Q-OPEN-129 | 오류 화면의 표현 | 게임 세계의 LUMA 시스템 UI가 아니라 중립 시트로 보여 준다. | `05-quality/ERROR_HANDLING.md` |
| Q-OPEN-130 | 이탈 방지 경고 | "경고 문구 1회"만 하고 브라우저 `beforeunload` 대화상자는 쓰지 않는다. | `05-quality/ERROR_HANDLING.md` |
| Q-OPEN-131 | localStorage 백업 개수 | 백업 1개를 유지한다. | `05-quality/ERROR_HANDLING.md` |
| Q-OPEN-132 | JS 힙·디코딩 예산 | iPhone 12급 기준 JS 힙 120MB·디코딩 64MB로 두고 실기기 측정 후 조정한다. | `05-quality/PERFORMANCE_REQUIREMENTS.md` |
| Q-OPEN-133 | 긴 목록 윈도잉 임계 | 80행을 넘으면 윈도잉하고 구현 후 실측으로 조정한다. | `05-quality/PERFORMANCE_REQUIREMENTS.md` |
| Q-OPEN-134 | Safari 메모리 측정 | 자동 회귀는 Chromium 기준, Safari는 릴리스 체크리스트에서 수동 확인한다. | `05-quality/PERFORMANCE_REQUIREMENTS.md`, `05-quality/TESTING_STRATEGY.md` |
| Q-OPEN-135 | 테스트의 __game.advance() | 상태 직접 주입 없이 시계만 진행하는 용도로 허용한다. | `05-quality/TESTING_STRATEGY.md`, `04-tech/SYSTEM_ARCHITECTURE.md` 6절 |
| Q-OPEN-136 | 시각 회귀 기준 이미지 | 저장소에 보관한다. | `05-quality/TESTING_STRATEGY.md` |
| Q-OPEN-137 | Playwright 설정·스크립트 이름 | 구현 단계에서 정하고 `mvp/tests/` 구조를 그대로 쓰지 않는다. | `05-quality/TESTING_STRATEGY.md` |
| Q-OPEN-138 | 실기기 테스트 기기 목록 | 개발 환경에서 기기·OS 버전을 확정한다. | `05-quality/TESTING_STRATEGY.md` |
| Q-OPEN-139 | AC-605 테스트 동결 | 테스트 이름·합격 기준을 동결하고 신규 3건은 Q-OPEN으로 분리한다. | `06-execution/ACCEPTANCE_CRITERIA.md` AC-605 |
| Q-OPEN-140 | 신규 단계 게이트 테스트 파일 | `p1_shell.spec.js`·`p2_reaction.spec.js`·`route_side.js`를 테스트 목록에 추가한다. | `05-quality/TESTING_STRATEGY.md` 4·9절, `06-execution/ACCEPTANCE_CRITERIA.md`, `06-execution/DEVELOPMENT_PHASES.md` |
| Q-OPEN-141 | MVP 제외 TR의 린터 목록 | TR-14 좋아요 반응 일부·TR-16을 "MVP 제외 TR"로 별도 관리한다. | `06-execution/ACCEPTANCE_CRITERIA.md` |
| Q-OPEN-142 | P6 아트 병행 범위 | P1 이후 아이콘·타일부터 시작할 수 있고 최종 교체는 P5 뒤에 한다. | `06-execution/DEVELOPMENT_PHASES.md` |
| Q-OPEN-143 | P7 완료 기준의 단일 출처 | PRODUCT_PRINCIPLES 8절과 PRD 6절을 함께 참조한다. | `06-execution/IMPLEMENTATION_ROADMAP.md`, `00-foundation/PRODUCT_PRINCIPLES.md` 8절, `01-product/PRD.md` 6절 |
| Q-OPEN-144 | P8 페이싱 재조정 | P7 일반 중앙값이 140~190분을 벗어나면 P8 범위를 재조정한다. | `06-execution/IMPLEMENTATION_ROADMAP.md`, `01-product/PLAYTIME_BUDGET.md` |
| Q-OPEN-145 | MVP 설정 ○ 메뉴 9개 | 설정 ○ 메뉴 9개를 유지하고 SETTINGS_SPECIFICATION 0절과 대조한다. | `06-execution/IMPLEMENTATION_ROADMAP.md`, `03-features/SETTINGS_SPECIFICATION.md` 0절 |
| Q-OPEN-146 | FEAT-61~67의 화면·데이터 추적 | FEAT-61~67은 본편 제외 기능으로 두고, 각 문서가 확정되면 FEAT별 SCR·데이터 링크를 FEATURE_SPECIFICATION 표에 추가한다. | `01-product/FEATURE_SPECIFICATION.md`, `06-execution/IMPLEMENTATION_ROADMAP.md` |
| Q-OPEN-147 | CMP-SEGMENTED의 선택 강조 | 색·썸·`aria-selected`로만 구분하고 600 굵기 토큰을 추가하지 않는다. | `02-design/COMPONENT_SPECIFICATIONS.md` CMP-SEGMENTED, `02-design/DESIGN_TOKENS.md` 2.2절 |
| Q-OPEN-148 | CMP-BADGE의 숫자 배경색 | `tint-fill`을 쓰고, 앱별 배지는 `--lm-app-tint`를 쓴다. 빨간 배지는 쓰지 않는다. | `02-design/COMPONENT_SPECIFICATIONS.md` CMP-BADGE, `02-design/DESIGN_SYSTEM.md` 4절 |
| Q-OPEN-149 | CMP-LIST-ROW 2줄 행의 굵기 | 주 텍스트 `headline` 600, 보조 텍스트 `subhead` 400으로 둔다. | `02-design/COMPONENT_SPECIFICATIONS.md` CMP-LIST-ROW |
| Q-OPEN-150 | CMP-KEYBOARD 높이 | 높이 286을 기본으로 하되 실제 `visualViewport` 높이에 따라 줄인다. | `02-design/COMPONENT_SPECIFICATIONS.md` CMP-KEYBOARD, `02-design/SCREEN_SPECIFICATIONS.md` |
| Q-OPEN-151 | CMP-POST-CARD-PHOTO 좋아요 색 | `--lm-app-tint`를 쓰고 하트 빨강을 예외로 두지 않는다. | `02-design/COMPONENT_SPECIFICATIONS.md` CMP-POST-CARD-PHOTO, `02-design/DESIGN_SYSTEM.md` 4절 |
| Q-OPEN-152 | 스토리 자동 진행 기본값 | 기본 켜짐(사진당 5초), 설정에서 "자동 넘김 끄기"를 제공한다. | `02-design/INTERACTION_SPECIFICATIONS.md`, `02-design/ACCESSIBILITY.md` 5.1절 |
| Q-OPEN-153 | 시트 닫기 임계값 | 높이 30% 또는 아래 속도 800px/s, 뒤로 밀기 500px/s. 설계값으로 두고 구현 감각에 맞춰 조정한다. | `02-design/INTERACTION_SPECIFICATIONS.md` |
| Q-OPEN-154 | 두 번 탭 좋아요 판정 창 | 300ms로 둔다. 사진 앱의 두 번 탭 확대와는 화면별로 분리한다. | `02-design/INTERACTION_SPECIFICATIONS.md`, `02-design/ACCESSIBILITY.md` 10절 |
| Q-OPEN-155 | 택시 도착지 검색의 필터 위치 | 낱말 사전에 있는 이름만 검색되도록 콘텐츠 데이터에서 판정하고 화면은 결과만 표시한다. | `02-design/SCREEN_SPECIFICATIONS_APPS.md` SCR-TAXI-CALL, `01-product/ACTION_PROOF.md` 3절 |
| Q-OPEN-156 | 인용 작성 화면 ID | 별도 SCR ID를 만들지 않고 `SCR-LOOP-CREATE`의 `mode="quote"` 변형으로 둔다. | `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md`, `03-features/SNS_SPECIFICATION.md` |
| Q-OPEN-157 | 게시물 시각 표기 | 게시물 카드·상세 모두 절대 시각 `YYYY.MM.DD`로 표기한다. | `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md`, `02-design/UI_UX_GUIDELINES.md` 2.5절 |
| Q-OPEN-158 | 차단된 계정 프로필 | `SCR-LOOP-PROFILE`의 `blocked=true` 상태로 두고 게시물·스토리·하이라이트를 숨기며 "차단 해제"만 보인다. | `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` |
| Q-OPEN-159 | 설정 검색 결과의 이동 | `SCR-SET-SEARCH`로 push한다. 루트 인라인 결과는 쓰지 않는다. | `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md`, `02-design/NAVIGATION_ARCHITECTURE.md` |
| Q-OPEN-160 | 루프 설정과 개인정보 화면의 역할 | `SCR-LOOP-SETTINGS`는 요약+진입, `SCR-LOOP-SETTINGS-PRIVACY`는 상세+차단 목록으로 나눈다. | `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` |
| Q-OPEN-161 | 인용 카드의 최대 높이 | 별도 높이 토큰을 두지 않고 모달 전체 화면 안에서 스크롤한다. | `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` SCR-LOOP-CREATE |

---

## C. 해결됨·무효

| ID | 항목 | 해결 근거 |
|---|---|---|
| Q-OPEN-162 | E-ID 결번 | EVIDENCE_LEDGER.md가 단일 출처이며, 원장에 없는 번호는 참조되지 않는다. 결번은 오류가 아니므로 새 항목을 만들지 않는다. |
| Q-OPEN-163 | 홈 격자 4×5 | 공통 지시서 3.2·SYSTEM_SHELL·RESPONSIVE·DESIGN_SYSTEM·COMPONENT가 모두 4×5+독 3페이지로 정리됐다. COMPONENT의 4×6 표기는 정정됐다. |
| Q-OPEN-164 | 중앙 경고창 두 곳만 | UI_UX_GUIDELINES 4절·NAVIGATION·SCREEN_SPECS·SYSTEM_SHELL이 "원격 지우기·암호 변경 두 곳만"으로 통일됐다. 찾기의 기기 지우기도 2단계 액션 시트다. |
| Q-OPEN-165 | 블링크 세션·설정 일반 화면 ID | SECURE_MESSAGING 8절과 SETTINGS 10절에 SCR-BLINK-SETTINGS-SESSIONS·SCR-SET-GENERAL이 이미 반영됐다. |
| Q-OPEN-166 | 원본 4.3 아이콘 수치와 토큰 | ICONOGRAPHY 5.1이 잠금화면 시계 76·블러 30·모서리 20·행 44/60/72로 토큰 우선을 확정했다. 원본 72/16/18/56은 폐기 표기다. |
| Q-OPEN-167 | iOS 가장자리 뒤로 제스처 | 브라우저 제스처는 게임이 비활성화할 수 없다. 자동 저장 + 게임 내 뒤로 버튼 병행으로 확정됐다(질문 성립 안 함). |
| Q-OPEN-168 | 단톡 참여자 수·멤버 목록 | 캐논에 참여자 수·목록이 없고 MESSAGING·SCREEN_SPECS가 표시하지 않는 것으로 일치한다. |
| Q-OPEN-169 | 글자 크기 4단계 | 공통 지시서 3.2의 0.85/1.0/1.15/1.3을 SETTINGS와 SYSTEM_SHELL이 동일하게 쓴다. 이견 없음. |
| Q-OPEN-170 | 시러스 ID 동기화 필수 표기 | 필수 ○는 "보수 경로에서 반드시 들어가는 메뉴"의 뜻으로 유지한다. V-04 대체 경로가 있어도 표기를 바꾸지 않는다. |
| Q-OPEN-171 | 카메라 절 참조 오류 | 원본 OS/UX의 절 번호 오류다. 카메라는 MEDIA_SPECIFICATION 8절로 해석한다. |
| Q-OPEN-172 | E-71 최근 검색 범위 | LOCATIONS가 장소·검색의 단일 출처다. "리버뷰타워"(1/8)를 포함한 LOCATIONS 표기를 정본으로 삼는다. |
| Q-OPEN-173 | 30분 규칙 표기 | "30분 안에 반응이 없으면"과 EV-06+30은 같은 규칙이다. 구현 기준은 EV-06 수신 후 게임 30분이다. |
| Q-OPEN-174 | 향후 백엔드 도입 | 서버·DB·인증 서버 없음이 공통 고정 결정이다. P0에서 "도입 안 함"을 재확인한다. |
| Q-OPEN-175 | 폐기 용어 복원 | 공통 지시서 1절이 폐기 용어를 금지한다. "판정 UI가 없어져" 표기를 유지한다. |
| Q-OPEN-176 | 커밋 규칙 | 공통 지시서의 git 금지와 같은 원칙이다. 구현 단계에서도 사용자가 명시적으로 요청할 때만 커밋한다. |
| Q-OPEN-177 | 이용자 인구통계·접근성 페르소나 | 원본에 없으므로 만들지 않았다. 필요하면 P7 플레이테스트 결과로 보강한다. |
| Q-OPEN-178 | 감정 라벨 | PLAYTIME 비트 표에 없는 감정 열은 PRODUCT_PRINCIPLES의 경험 목표에서 붙인 라벨이며 새 서사 사실이 아니다. |
| Q-OPEN-179 | 아빠 생일 58번째 | P-01의 57세(1968.04.03)와 캘린더의 "58번째"는 만 나이 기준으로 일치한다. 2026.04.03에 만 58세가 된다. 680403은 생일 날짜라 영향 없다. |
| Q-OPEN-180 | 은행 간편비밀번호 오답 잠금 | COMMERCE·SCREEN_APPS·AUTH가 모두 "오답 잠금 없음·즉시 재입력"으로 일치한다. |
| Q-OPEN-181 | 시각 회귀 화면 ID | ACCEPTANCE_CRITERIA가 SCR-MAIL-INBOX·SCR-CAM-VIEWFINDER로 정정했다. |
| Q-OPEN-182 | 진술 카드 용어 | 폐기된 "카드" 대신 "진술 3건(E-108~110)"으로 표기했다. ID 범위와 내용은 원본과 같다. |

---

## 통계

| 구분 | 수 |
|---|---:|
| 원 항목(q.json) | 249 |
| design/15 5절 열린 결정 | 7 (그중 5개는 q.json에 없음) |
| 입력 합계 | 254 |
| 병합 후 | 182 |
| A. 서현 결정 필요(A 36건 전부 결정됨, 2026-11-09, 추천안 채택) | 36 (치명 3 · 높음 18 · 보통 15) |
| B. 기본값 확정 | 125 |
| C. 해결됨·무효 | 21 |

## 부록. 원 문서의 로컬 표기 → 전역 ID

같은 파일 안에서 로컬 번호가 중복되는 경우 줄 번호로 구분한다. 번호가 없는 "Q-OPEN"은 줄 번호만 적는다.

| 원 문서 | 원래 로컬 표기 | 전역 ID |
|---|---|---|
| `00-foundation/Bible.md` | Q-OPEN-01 (106행) | Q-OPEN-004 |
| `00-foundation/Bible.md` | Q-OPEN-02 (107행) | Q-OPEN-029 |
| `00-foundation/PRODUCT_PRINCIPLES.md` | Q-OPEN-03 (75행) | Q-OPEN-004 |
| `00-foundation/PRODUCT_PRINCIPLES.md` | Q-OPEN-04 (76행) | Q-OPEN-037 |
| `00-foundation/PROJECT_SCOPE.md` | Q-OPEN-05 (97행) | Q-OPEN-030 |
| `00-foundation/PROJECT_SCOPE.md` | Q-OPEN-06 (98행) | Q-OPEN-023 |
| `00-foundation/REQUIREMENTS.md` | Q-OPEN-07 (143행) | Q-OPEN-039 |
| `00-foundation/REQUIREMENTS.md` | Q-OPEN-08 (144행) | Q-OPEN-038 |
| `00-foundation/REQUIREMENTS.md` | Q-OPEN-09 (145행) | Q-OPEN-017 |
| `00-foundation/REQUIREMENTS.md` | Q-OPEN-10 (146행) | Q-OPEN-029 |
| `01-product/ACTION_PROOF.md` | Q-OPEN-01 (97행) | Q-OPEN-040 |
| `01-product/ACTION_PROOF.md` | Q-OPEN-02 (98행) | Q-OPEN-041 |
| `01-product/BUSINESS_RULES.md` | Q-OPEN-01 (277행) | Q-OPEN-042 |
| `01-product/BUSINESS_RULES.md` | Q-OPEN-02 (278행) | Q-OPEN-043 |
| `01-product/CHARACTERS.md` | Q-OPEN-01 (162행) | Q-OPEN-182 |
| `01-product/CHARACTERS.md` | Q-OPEN-02 (163행) | Q-OPEN-005 |
| `01-product/CHARACTERS.md` | Q-OPEN-03 (164행) | Q-OPEN-036 |
| `01-product/EVIDENCE_LEDGER.md` | Q-OPEN-01 (241행) | Q-OPEN-162 |
| `01-product/EVIDENCE_LEDGER.md` | Q-OPEN-02 (242행) | Q-OPEN-044 |
| `01-product/EVIDENCE_LEDGER.md` | Q-OPEN-03 (243행) | Q-OPEN-006 |
| `01-product/EVIDENCE_LEDGER.md` | Q-OPEN-04 (244행) | Q-OPEN-005 |
| `01-product/FEATURE_SPECIFICATION.md` | Q-OPEN-13 (112행) | Q-OPEN-013, Q-OPEN-014, Q-OPEN-023 |
| `01-product/FEATURE_SPECIFICATION.md` | Q-OPEN-14 (113행) | Q-OPEN-146 |
| `01-product/FEATURE_SPECIFICATION.md` | Q-OPEN-15 (114행) | Q-OPEN-023 |
| `01-product/LOCATIONS.md` | Q-OPEN-01 (107행) | Q-OPEN-045 |
| `01-product/LOCATIONS.md` | Q-OPEN-02 (108행) | Q-OPEN-046 |
| `01-product/NARRATIVE_CANON.md` | Q-OPEN-01 (194행) | Q-OPEN-047 |
| `01-product/NARRATIVE_CANON.md` | Q-OPEN-02 (195행) | Q-OPEN-005 |
| `01-product/PLAYTIME_BUDGET.md` | Q-OPEN-01 (161행) | Q-OPEN-048 |
| `01-product/PLAYTIME_BUDGET.md` | Q-OPEN-02 (162행) | Q-OPEN-049 |
| `01-product/PRD.md` | Q-OPEN-11 (111행) | Q-OPEN-050 |
| `01-product/PRD.md` | Q-OPEN-12 (112행) | Q-OPEN-051 |
| `01-product/PROGRESSION_AND_ENDINGS.md` | Q-OPEN-01 (305행) | Q-OPEN-001 |
| `01-product/PROGRESSION_AND_ENDINGS.md` | Q-OPEN-02 (306행) | Q-OPEN-002 |
| `01-product/PROGRESSION_AND_ENDINGS.md` | Q-OPEN-03 (307행) | Q-OPEN-003 |
| `01-product/TRACES_AND_REACTIONS.md` | Q-OPEN-01 (94행) | Q-OPEN-052 |
| `01-product/TRACES_AND_REACTIONS.md` | Q-OPEN-02 (95행) | Q-OPEN-052 |
| `01-product/USER_FLOWS.md` | Q-OPEN-20 (194행) | Q-OPEN-007 |
| `01-product/USER_FLOWS.md` | Q-OPEN-21 (195행) | Q-OPEN-053 |
| `01-product/USER_FLOWS.md` | Q-OPEN-22 (196행) | Q-OPEN-054 |
| `01-product/USER_JOURNEYS.md` | Q-OPEN-18 (111행) | Q-OPEN-178 |
| `01-product/USER_JOURNEYS.md` | Q-OPEN-19 (112행) | Q-OPEN-055 |
| `01-product/USER_PERSONAS.md` | Q-OPEN-16 (96행) | Q-OPEN-177 |
| `01-product/USER_PERSONAS.md` | Q-OPEN-17 (97행) | Q-OPEN-056 |
| `02-design/ACCESSIBILITY.md` | Q-OPEN-08 (302, 387행) | Q-OPEN-020 |
| `02-design/ACCESSIBILITY.md` | Q-OPEN-09 (336, 388행) | Q-OPEN-019 |
| `02-design/ACCESSIBILITY.md` | Q-OPEN-10 (389행) | Q-OPEN-038 |
| `02-design/COMPONENT_SPECIFICATIONS.md` | Q-OPEN-211 (1120행) | Q-OPEN-147 |
| `02-design/COMPONENT_SPECIFICATIONS.md` | Q-OPEN-212 (1121행) | Q-OPEN-148 |
| `02-design/COMPONENT_SPECIFICATIONS.md` | Q-OPEN-213 (1122행) | Q-OPEN-149 |
| `02-design/COMPONENT_SPECIFICATIONS.md` | Q-OPEN-214 (1123행) | Q-OPEN-150 |
| `02-design/COMPONENT_SPECIFICATIONS.md` | Q-OPEN-215 (1124행) | Q-OPEN-151 |
| `02-design/DESIGN_SYSTEM.md` | Q-OPEN-02 (252행) | Q-OPEN-057 |
| `02-design/ICONOGRAPHY_AND_IMAGERY.md` | Q-OPEN-04 (104행) | Q-OPEN-164 |
| `02-design/ICONOGRAPHY_AND_IMAGERY.md` | Q-OPEN-11 (260행) | Q-OPEN-166 |
| `02-design/ICONOGRAPHY_AND_IMAGERY.md` | Q-OPEN-12 (261행) | Q-OPEN-058 |
| `02-design/ICONOGRAPHY_AND_IMAGERY.md` | Q-OPEN-13 (262행) | Q-OPEN-059 |
| `02-design/INTERACTION_SPECIFICATIONS.md` | Q-OPEN-223 (410행) | Q-OPEN-152 |
| `02-design/INTERACTION_SPECIFICATIONS.md` | Q-OPEN-224 (411행) | Q-OPEN-153 |
| `02-design/INTERACTION_SPECIFICATIONS.md` | Q-OPEN-225 (412행) | Q-OPEN-154 |
| `02-design/INTERACTION_SPECIFICATIONS.md` | Q-OPEN-226 (413행) | Q-OPEN-019 |
| `02-design/INTERACTION_SPECIFICATIONS.md` | Q-OPEN-227 (414행) | Q-OPEN-164 |
| `02-design/NAVIGATION_ARCHITECTURE.md` | Q-OPEN-201 (691행) | Q-OPEN-022 |
| `02-design/NAVIGATION_ARCHITECTURE.md` | Q-OPEN-202 (692행) | Q-OPEN-165 |
| `02-design/NAVIGATION_ARCHITECTURE.md` | Q-OPEN-203 (693행) | Q-OPEN-060 |
| `02-design/NAVIGATION_ARCHITECTURE.md` | Q-OPEN-204 (694행) | Q-OPEN-061 |
| `02-design/NAVIGATION_ARCHITECTURE.md` | Q-OPEN-205 (695행) | Q-OPEN-062 |
| `02-design/RESPONSIVE_DESIGN.md` | Q-OPEN-06 (248행) | Q-OPEN-063 |
| `02-design/RESPONSIVE_DESIGN.md` | Q-OPEN-07 (249행) | Q-OPEN-167 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-113 (1626, 1788행) | Q-OPEN-168 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-301 (2032행) | Q-OPEN-022 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-302 (2033행) | Q-OPEN-022 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-303 (2034행) | Q-OPEN-035 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-304 (2035행) | Q-OPEN-008 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-305 (2036행) | Q-OPEN-064 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-306 (2037행) | Q-OPEN-065 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-307 (2038행) | Q-OPEN-066 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-308 (2039행) | Q-OPEN-163 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-309 (2040행) | Q-OPEN-022 |
| `02-design/SCREEN_SPECIFICATIONS.md` | Q-OPEN-310 (2041행) | Q-OPEN-021 |
| `02-design/SCREEN_SPECIFICATIONS_APPS.md` | Q-OPEN-401 (3354행) | Q-OPEN-163 |
| `02-design/SCREEN_SPECIFICATIONS_APPS.md` | Q-OPEN-402 (3355행) | Q-OPEN-022 |
| `02-design/SCREEN_SPECIFICATIONS_APPS.md` | Q-OPEN-403 (3356행) | Q-OPEN-180 |
| `02-design/SCREEN_SPECIFICATIONS_APPS.md` | Q-OPEN-404 (3357행) | Q-OPEN-164 |
| `02-design/SCREEN_SPECIFICATIONS_APPS.md` | Q-OPEN-405 (3358행) | Q-OPEN-155 |
| `02-design/SCREEN_SPECIFICATIONS_APPS.md` | Q-OPEN-406 (3359행) | Q-OPEN-067 |
| `02-design/SCREEN_SPECIFICATIONS_APPS.md` | Q-OPEN-407 (3360행) | Q-OPEN-068 |
| `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` | Q-OPEN-301 (120, 2244행) | Q-OPEN-156 |
| `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` | Q-OPEN-302 (121, 249, 2245행) | Q-OPEN-157 |
| `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` | Q-OPEN-303 (122, 2246행) | Q-OPEN-158 |
| `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` | Q-OPEN-304 (123, 2247행) | Q-OPEN-159 |
| `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` | Q-OPEN-137 (1844행) | Q-OPEN-015 |
| `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` | Q-OPEN-305 (2248행) | Q-OPEN-160 |
| `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` | Q-OPEN-306 (2249행) | Q-OPEN-161 |
| `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` | Q-OPEN-307 (2250행) | Q-OPEN-069 |
| `02-design/SCREEN_SPECIFICATIONS_SNS_SETTINGS.md` | Q-OPEN-308 (2251행) | Q-OPEN-070 |
| `03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md` | Q-OPEN(비번호) (331행) | Q-OPEN-180 |
| `03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md` | Q-OPEN(비번호) (332행) | Q-OPEN-071 |
| `03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md` | Q-OPEN(비번호) (333행) | Q-OPEN-007 |
| `03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md` | Q-OPEN(비번호) (334행) | Q-OPEN-072 |
| `03-features/MAIL_AND_CLOUD_SPECIFICATION.md` | Q-OPEN(비번호) (406행) | Q-OPEN-073 |
| `03-features/MAIL_AND_CLOUD_SPECIFICATION.md` | Q-OPEN(비번호) (407행) | Q-OPEN-074 |
| `03-features/MAIL_AND_CLOUD_SPECIFICATION.md` | Q-OPEN(비번호) (408행) | Q-OPEN-173 |
| `03-features/MAPS_AND_MOBILITY_SPECIFICATION.md` | Q-OPEN(비번호) (371행) | Q-OPEN-075 |
| `03-features/MAPS_AND_MOBILITY_SPECIFICATION.md` | Q-OPEN(비번호) (372행) | Q-OPEN-172 |
| `03-features/MAPS_AND_MOBILITY_SPECIFICATION.md` | Q-OPEN(비번호) (373행) | Q-OPEN-076 |
| `03-features/MAPS_AND_MOBILITY_SPECIFICATION.md` | Q-OPEN(비번호) (374행) | Q-OPEN-077 |
| `03-features/MEDIA_SPECIFICATION.md` | Q-OPEN(비번호) (407행) | Q-OPEN-078 |
| `03-features/MEDIA_SPECIFICATION.md` | Q-OPEN(비번호) (408행) | Q-OPEN-079 |
| `03-features/MEDIA_SPECIFICATION.md` | Q-OPEN(비번호) (409행) | Q-OPEN-080 |
| `03-features/MEDIA_SPECIFICATION.md` | Q-OPEN(비번호) (410행) | Q-OPEN-081 |
| `03-features/MESSAGING_SPECIFICATION.md` | Q-OPEN-112 (214, 428행) | Q-OPEN-008 |
| `03-features/MESSAGING_SPECIFICATION.md` | Q-OPEN-113 (215, 429행) | Q-OPEN-168 |
| `03-features/MESSAGING_SPECIFICATION.md` | Q-OPEN-111 (427행) | Q-OPEN-082 |
| `03-features/MESSAGING_SPECIFICATION.md` | Q-OPEN-114 (430행) | Q-OPEN-083 |
| `03-features/MESSAGING_SPECIFICATION.md` | Q-OPEN-115 (431행) | Q-OPEN-084 |
| `03-features/MESSAGING_SPECIFICATION.md` | Q-OPEN-116 (432행) | Q-OPEN-085 |
| `03-features/PERSONAL_DATA_APPS_SPECIFICATION.md` | Q-OPEN(비번호) (569행) | Q-OPEN-179 |
| `03-features/PERSONAL_DATA_APPS_SPECIFICATION.md` | Q-OPEN(비번호) (570행) | Q-OPEN-086 |
| `03-features/PERSONAL_DATA_APPS_SPECIFICATION.md` | Q-OPEN(비번호) (571행) | Q-OPEN-087 |
| `03-features/PERSONAL_DATA_APPS_SPECIFICATION.md` | Q-OPEN(비번호) (572행) | Q-OPEN-088 |
| `03-features/SECURE_MESSAGING_SPECIFICATION.md` | Q-OPEN-121 (237행) | Q-OPEN-026 |
| `03-features/SECURE_MESSAGING_SPECIFICATION.md` | Q-OPEN-122 (238행) | Q-OPEN-021 |
| `03-features/SECURE_MESSAGING_SPECIFICATION.md` | Q-OPEN-123 (239행) | Q-OPEN-089 |
| `03-features/SECURE_MESSAGING_SPECIFICATION.md` | Q-OPEN-124 (240행) | Q-OPEN-090 |
| `03-features/SECURE_MESSAGING_SPECIFICATION.md` | Q-OPEN-125 (241행) | Q-OPEN-091 |
| `03-features/SECURE_MESSAGING_SPECIFICATION.md` | Q-OPEN-126 (242행) | Q-OPEN-092 |
| `03-features/SETTINGS_SPECIFICATION.md` | Q-OPEN(비번호) (455행) | Q-OPEN-017 |
| `03-features/SETTINGS_SPECIFICATION.md` | Q-OPEN(비번호) (456행) | Q-OPEN-093 |
| `03-features/SETTINGS_SPECIFICATION.md` | Q-OPEN(비번호) (457행) | Q-OPEN-169 |
| `03-features/SETTINGS_SPECIFICATION.md` | Q-OPEN(비번호) (458행) | Q-OPEN-094 |
| `03-features/SETTINGS_SPECIFICATION.md` | Q-OPEN(비번호) (459행) | Q-OPEN-170 |
| `03-features/SNS_SPECIFICATION.md` | Q-OPEN-132 (70, 536행) | Q-OPEN-024 |
| `03-features/SNS_SPECIFICATION.md` | Q-OPEN-137 (76, 210, 226, 541행) | Q-OPEN-015 |
| `03-features/SNS_SPECIFICATION.md` | Q-OPEN-136 (182, 540행) | Q-OPEN-095 |
| `03-features/SNS_SPECIFICATION.md` | Q-OPEN-134 (184, 391, 538행) | Q-OPEN-009 |
| `03-features/SNS_SPECIFICATION.md` | Q-OPEN-133 (188, 537행) | Q-OPEN-025 |
| `03-features/SNS_SPECIFICATION.md` | Q-OPEN-131 (190, 535행) | Q-OPEN-096 |
| `03-features/SNS_SPECIFICATION.md` | Q-OPEN-135 (194, 539행) | Q-OPEN-097 |
| `03-features/SNS_SPECIFICATION.md` | Q-OPEN-138 (542행) | Q-OPEN-098 |
| `03-features/SNS_SPECIFICATION.md` | Q-OPEN-139 (543행) | Q-OPEN-099 |
| `03-features/SNS_SPECIFICATION.md` | Q-OPEN-140 (544행) | Q-OPEN-100 |
| `03-features/SYSTEM_SHELL_SPECIFICATION.md` | Q-OPEN-105 (75, 465행) | Q-OPEN-017 |
| `03-features/SYSTEM_SHELL_SPECIFICATION.md` | Q-OPEN-101 (84, 461행) | Q-OPEN-016 |
| `03-features/SYSTEM_SHELL_SPECIFICATION.md` | Q-OPEN-102 (189, 462행) | Q-OPEN-019 |
| `03-features/SYSTEM_SHELL_SPECIFICATION.md` | Q-OPEN-103 (463행) | Q-OPEN-101 |
| `03-features/SYSTEM_SHELL_SPECIFICATION.md` | Q-OPEN-104 (464행) | Q-OPEN-171 |
| `03-features/SYSTEM_SHELL_SPECIFICATION.md` | Q-OPEN-106 (466행) | Q-OPEN-065 |
| `03-features/SYSTEM_SHELL_SPECIFICATION.md` | Q-OPEN-107 (467행) | Q-OPEN-102 |
| `03-features/SYSTEM_SHELL_SPECIFICATION.md` | Q-OPEN-108 (468행) | Q-OPEN-103 |
| `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` | Q-OPEN-141 (55, 254행) | Q-OPEN-027 |
| `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` | Q-OPEN-142 (142, 157, 168, 255행) | Q-OPEN-028 |
| `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` | Q-OPEN-143 (149, 256행) | Q-OPEN-104 |
| `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` | Q-OPEN-144 (257행) | Q-OPEN-105 |
| `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` | Q-OPEN-145 (258행) | Q-OPEN-036 |
| `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` | Q-OPEN-146 (259행) | Q-OPEN-106 |
| `03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md` | Q-OPEN-147 (260행) | Q-OPEN-107 |
| `04-tech/API_SPECIFICATION.md` | Q-OPEN-T14 (405행) | Q-OPEN-108 |
| `04-tech/API_SPECIFICATION.md` | Q-OPEN-T15 (406행) | Q-OPEN-109 |
| `04-tech/API_SPECIFICATION.md` | Q-OPEN-T16 (407행) | Q-OPEN-110 |
| `04-tech/AUTHENTICATION_AND_SECURITY.md` | Q-OPEN-T17 (243행) | Q-OPEN-111 |
| `04-tech/AUTHENTICATION_AND_SECURITY.md` | Q-OPEN-T18 (244행) | Q-OPEN-021 |
| `04-tech/AUTHENTICATION_AND_SECURITY.md` | Q-OPEN-T19 (245행) | Q-OPEN-021 |
| `04-tech/AUTHENTICATION_AND_SECURITY.md` | Q-OPEN-T20 (246행) | Q-OPEN-112 |
| `04-tech/AUTHENTICATION_AND_SECURITY.md` | Q-OPEN-T21 (247행) | Q-OPEN-109 |
| `04-tech/BACKEND_ARCHITECTURE.md` | Q-OPEN-T07 (170행) | Q-OPEN-021 |
| `04-tech/BACKEND_ARCHITECTURE.md` | Q-OPEN-T08 (171행) | Q-OPEN-018 |
| `04-tech/BACKEND_ARCHITECTURE.md` | Q-OPEN-T09 (172행) | Q-OPEN-174 |
| `04-tech/DATABASE_SCHEMA.md` | Q-OPEN-T10 (709행) | Q-OPEN-113 |
| `04-tech/DATABASE_SCHEMA.md` | Q-OPEN-T11 (710행) | Q-OPEN-114 |
| `04-tech/DATABASE_SCHEMA.md` | Q-OPEN-T12 (711행) | Q-OPEN-115 |
| `04-tech/DATABASE_SCHEMA.md` | Q-OPEN-T13 (712행) | Q-OPEN-021 |
| `04-tech/FILE_AND_MEDIA_MANAGEMENT.md` | Q-OPEN-T26 (272행) | Q-OPEN-116 |
| `04-tech/FILE_AND_MEDIA_MANAGEMENT.md` | Q-OPEN-T27 (273행) | Q-OPEN-117 |
| `04-tech/FILE_AND_MEDIA_MANAGEMENT.md` | Q-OPEN-T28 (274행) | Q-OPEN-118 |
| `04-tech/FILE_AND_MEDIA_MANAGEMENT.md` | Q-OPEN-T29 (275행) | Q-OPEN-119 |
| `04-tech/FRONTEND_ARCHITECTURE.md` | Q-OPEN-T04 (419행) | Q-OPEN-120 |
| `04-tech/FRONTEND_ARCHITECTURE.md` | Q-OPEN-T05 (420행) | Q-OPEN-121 |
| `04-tech/FRONTEND_ARCHITECTURE.md` | Q-OPEN-T06 (421행) | Q-OPEN-122 |
| `04-tech/STATE_MANAGEMENT.md` | Q-OPEN-T22 (489행) | Q-OPEN-123 |
| `04-tech/STATE_MANAGEMENT.md` | Q-OPEN-T23 (490행) | Q-OPEN-124 |
| `04-tech/STATE_MANAGEMENT.md` | Q-OPEN-T24 (491행) | Q-OPEN-125 |
| `04-tech/STATE_MANAGEMENT.md` | Q-OPEN-T25 (492행) | Q-OPEN-021 |
| `04-tech/SYSTEM_ARCHITECTURE.md` | Q-OPEN-T01 (247행) | Q-OPEN-126 |
| `04-tech/SYSTEM_ARCHITECTURE.md` | Q-OPEN-T02 (248행) | Q-OPEN-039 |
| `04-tech/SYSTEM_ARCHITECTURE.md` | Q-OPEN-T03 (249행) | Q-OPEN-123 |
| `05-quality/DEPLOYMENT_ARCHITECTURE.md` | Q-OPEN-Q14 (235행) | Q-OPEN-031 |
| `05-quality/DEPLOYMENT_ARCHITECTURE.md` | Q-OPEN-Q15 (236행) | Q-OPEN-127 |
| `05-quality/DEPLOYMENT_ARCHITECTURE.md` | Q-OPEN-Q16 (237행) | Q-OPEN-114 |
| `05-quality/DEPLOYMENT_ARCHITECTURE.md` | Q-OPEN-Q17 (238행) | Q-OPEN-032 |
| `05-quality/DEVELOPMENT_GUIDELINES.md` | Q-OPEN-Q01 (237행) | Q-OPEN-128 |
| `05-quality/DEVELOPMENT_GUIDELINES.md` | Q-OPEN-Q02 (238행) | Q-OPEN-176 |
| `05-quality/ERROR_HANDLING.md` | Q-OPEN-Q07 (289행) | Q-OPEN-129 |
| `05-quality/ERROR_HANDLING.md` | Q-OPEN-Q08 (290행) | Q-OPEN-130 |
| `05-quality/ERROR_HANDLING.md` | Q-OPEN-Q09 (291행) | Q-OPEN-131 |
| `05-quality/PERFORMANCE_REQUIREMENTS.md` | Q-OPEN-Q10 (244행) | Q-OPEN-039 |
| `05-quality/PERFORMANCE_REQUIREMENTS.md` | Q-OPEN-Q11 (245행) | Q-OPEN-132 |
| `05-quality/PERFORMANCE_REQUIREMENTS.md` | Q-OPEN-Q12 (246행) | Q-OPEN-133 |
| `05-quality/PERFORMANCE_REQUIREMENTS.md` | Q-OPEN-Q13 (247행) | Q-OPEN-134 |
| `05-quality/TESTING_STRATEGY.md` | Q-OPEN-Q03 (399행) | Q-OPEN-135 |
| `05-quality/TESTING_STRATEGY.md` | Q-OPEN-Q04 (400행) | Q-OPEN-136 |
| `05-quality/TESTING_STRATEGY.md` | Q-OPEN-Q05 (401행) | Q-OPEN-137 |
| `05-quality/TESTING_STRATEGY.md` | Q-OPEN-Q06 (402행) | Q-OPEN-138 |
| `06-execution/ACCEPTANCE_CRITERIA.md` | Q-OPEN(비번호) (241행) | Q-OPEN-139 |
| `06-execution/ACCEPTANCE_CRITERIA.md` | Q-OPEN-A01 (305행) | Q-OPEN-039 |
| `06-execution/ACCEPTANCE_CRITERIA.md` | Q-OPEN-A02 (306행) | Q-OPEN-140 |
| `06-execution/ACCEPTANCE_CRITERIA.md` | Q-OPEN-A03 (307행) | Q-OPEN-023 |
| `06-execution/ACCEPTANCE_CRITERIA.md` | Q-OPEN-A04 (308행) | Q-OPEN-141 |
| `06-execution/ACCEPTANCE_CRITERIA.md` | Q-OPEN-A05 (309행) | Q-OPEN-001 |
| `06-execution/DEVELOPMENT_PHASES.md` | Q-OPEN-D01 (63, 81, 162행) | Q-OPEN-140 |
| `06-execution/DEVELOPMENT_PHASES.md` | Q-OPEN-D02 (146, 163행) | Q-OPEN-013, Q-OPEN-014, Q-OPEN-140 |
| `06-execution/DEVELOPMENT_PHASES.md` | Q-OPEN-D03 (164행) | Q-OPEN-142 |
| `06-execution/DEVELOPMENT_PHASES.md` | Q-OPEN-D04 (165행) | Q-OPEN-120 |
| `06-execution/DEVELOPMENT_PHASES.md` | Q-OPEN-D05 (166행) | Q-OPEN-181 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | Q-OPEN-R01 (117행) | Q-OPEN-175 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | Q-OPEN-R02 (118행) | Q-OPEN-143 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | Q-OPEN-R03 (119행) | Q-OPEN-144 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | Q-OPEN-R04 (120행) | Q-OPEN-145 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | 열린 결정 표 | Q-OPEN-010 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | 열린 결정 표 | Q-OPEN-011 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | 열린 결정 표 | Q-OPEN-012 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | 열린 결정 표 | Q-OPEN-013 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | 열린 결정 표 | Q-OPEN-014 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | 열린 결정 표 | Q-OPEN-033 |
| `06-execution/IMPLEMENTATION_ROADMAP.md` | 열린 결정 표 | Q-OPEN-034 |
