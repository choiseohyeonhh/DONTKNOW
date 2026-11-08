# DONTKNOW 문서 지도

> **v6에서 대체됨(2026-11).** 이 폴더(v5.4)는 폐기된 설계로 보관만 한다. 현재 캐논은 [`design/`](../design/README.md)이다. 폐기·계승 목록은 `design/16-consistency-and-legacy.md`.

> 캐논은 `bible.md`(v5.4) 하나다. 이 폴더의 나머지 문서는 전부 **bible을 구현 가능한 단위로 쪼갠 세부 설계**다.
> 설계 문서와 bible이 충돌하면 bible이 이긴다. `review/canon-issues.md`의 ISSUE-01~34는 **전부 채택되어 bible v5.3에 반영**됐다(bible 0.1.3). 설계 문서 본문의 `[ISSUE-xx]` 태그는 그 결정의 출처 표시다.

## 우선순위

1. `bible.md` — 정답
2. `review/canon-issues.md` — v5.2 검토 기록. 34건 전부 v5.3에 반영 완료(근거·논리 참고용)
3. 나머지 설계 문서 — 구현 기준

## 폴더 구성

| 폴더 | 내용 | 주 독자 |
|---|---|---|
| `review/` | bible 검토 결과, 플롯홀·핍진성·정합성 이슈와 결정 기록 | 서현(기획 결정) |
| `overview/` | 제품 범위·마일스톤, ID 규칙, 콘텐츠 가이드라인 | 전원 |
| `narrative/` | 타임라인 확정판, 앎 매트릭스 확장, 모순 추적, 대사 문체 기준, 인물별 집필 가이드 | 대사 작성 |
| `systems/` | 게임 엔진 규칙: 상태, KNOW, 플래그, 진행, 시간, 대화, 리액티브, 넛지, 네비, 회피 연출, 옛 폰, 분기/엔딩, 세이브, 사운드 | 구현 |
| `data/` | JSON 데이터 스키마와 조건식 문법 | 구현·데이터 입력 |
| `content/` | 실제 들어갈 값: 폰 초기 데이터, 옛 폰 데이터, 상환 원장, 단서, 장소, 에셋 목록 | 데이터 입력·아트·사운드 |
| `ui/` | 화면 설계: 비주얼 원칙, 아버지 폰 앱별, 옛 폰, 장면 화면, 오버레이, 메타 화면 | 구현·아트 |
| `sessions/` | S01~S14 세션별 상세 설계(진입/비트/선택지/획득/리액티브/넛지/종료/검증) | 구현·대사 작성 |
| `qa/` | 플레이테스트 계획, 경로별 테스트 시나리오, 정합성 체크리스트 | QA |
| `script/` (예정) | 세션별 전체 대사 파일 `Sxx.md` — 이번 작업 범위 아님 | 대사 작성 |

## 처음 읽는 순서

1. `bible.md` 0.1.4 — v5.4에서 바뀐 것(대사 문체, 시네마틱 자막). 0.1.3 — v5.3에서 바뀐 것(근거는 `review/canon-issues.md`)
2. `overview/product-scope.md` — 무엇을 어디까지 만드나
3. `systems/game-state.md` → `systems/progression.md` — 게임이 어떻게 돌아가나
4. `sessions/S01.md`, `sessions/S02.md` — 첫 수직 슬라이스 범위
5. `data/README.md` — 데이터를 어떻게 쪼개나

## 전체 파일 목록

```
docs/
├── README.md                     ← 이 문서
├── bible.md                      ← 캐논 v5.4
├── review/
│   └── canon-issues.md
├── overview/
│   ├── product-scope.md
│   ├── id-conventions.md
│   └── content-guidelines.md
├── narrative/
│   ├── timeline.md
│   ├── knowledge-matrix.md
│   ├── contradictions.md
│   ├── dialogue-style.md         ← 대사 문체 기준 (v5.4)
│   └── characters/
│       ├── father.md  dohyun.md  hyung.md  yujin.md  junho.md
│       ├── minjae.md  pharmacist.md  detective.md  jihoon.md
│       └── minor-cast.md
├── systems/
│   ├── architecture.md      game-state.md      know.md
│   ├── flags.md             progression.md     time.md
│   ├── dialogue.md          reactive-events.md idle-nudge.md
│   ├── navigation.md        avoidance-and-monologue.md
│   ├── old-phone-device.md  branching-and-endings.md
│   ├── save-and-replay.md   audio-and-haptics.md
├── data/
│   ├── README.md            conditions.md
│   ├── schema-registry.md   schema-session.md  schema-dialogue.md
│   ├── schema-event.md      schema-phone.md    schema-save.md
├── content/
│   ├── repayment-ledger.md  father-phone-data.md  old-phone-data.md
│   ├── clues.md             locations.md          absence-dates.md
│   ├── art-assets.md        art-prompts.md        audio-assets.md
├── ui/
│   ├── visual-style.md  overlays.md  meta-screens.md  cinematics.md  mockups.md
│   ├── father-phone/
│   │   ├── overview.md  phone.md  messages.md  talk.md  contacts.md
│   │   ├── photos.md  navigation.md  bank.md  memo.md  settings.md  camera.md
│   ├── old-phone/
│   │   ├── overview.md  lock-screen.md  apps.md
│   └── scenes/
│       ├── scene-view.md  intercom.md  cctv-scrubber.md  travel.md
├── sessions/
│   └── S01.md … S14.md
└── qa/
    ├── playtest-plan.md  test-scenarios.md  consistency-checklist.md
```
