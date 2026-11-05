# DONTKNOW 문서 지도

> 캐논은 `bible.md`(v5.2) 하나다. 이 폴더의 나머지 문서는 전부 **bible을 구현 가능한 단위로 쪼갠 세부 설계**다.
> 설계 문서와 bible이 충돌하면 bible이 이긴다. 단, `review/canon-issues.md`에 올라간 항목은 bible 자체의 구멍이므로, 서현의 결정이 나기 전까지 설계 문서는 **추천안을 기본값으로** 따른다(본문에 `[ISSUE-xx]` 태그로 표시).

## 우선순위

1. `bible.md` — 정답
2. `review/canon-issues.md` — bible의 구멍과 추천 수정안 (결정되면 bible v5.3에 반영 후 해당 항목 닫기)
3. 나머지 설계 문서 — 구현 기준

## 폴더 구성

| 폴더 | 내용 | 주 독자 |
|---|---|---|
| `review/` | bible 검토 결과, 플롯홀·핍진성·정합성 이슈와 추천안 | 서현(기획 결정) |
| `overview/` | 제품 범위·마일스톤, ID 규칙, 콘텐츠 가이드라인 | 전원 |
| `narrative/` | 타임라인 확정판, 앎 매트릭스 확장, 모순 추적, 인물별 집필 가이드 | 대사 작성 |
| `systems/` | 게임 엔진 규칙: 상태, KNOW, 플래그, 진행, 시간, 대화, 리액티브, 넛지, 네비, 회피 연출, 옛 폰, 분기/엔딩, 세이브, 사운드 | 구현 |
| `data/` | JSON 데이터 스키마와 조건식 문법 | 구현·데이터 입력 |
| `content/` | 실제 들어갈 값: 폰 초기 데이터, 옛 폰 데이터, 상환 원장, 단서, 장소, 에셋 목록 | 데이터 입력·아트·사운드 |
| `ui/` | 화면 설계: 비주얼 원칙, 아버지 폰 앱별, 옛 폰, 장면 화면, 오버레이, 메타 화면 | 구현·아트 |
| `sessions/` | S01~S14 세션별 상세 설계(진입/비트/선택지/획득/리액티브/넛지/종료/검증) | 구현·대사 작성 |
| `qa/` | 플레이테스트 계획, 경로별 테스트 시나리오, 정합성 체크리스트 | QA |
| `script/` (예정) | 세션별 전체 대사 파일 `Sxx.md` — 이번 작업 범위 아님 | 대사 작성 |

## 처음 읽는 순서

1. `review/canon-issues.md` — 결정이 필요한 것부터
2. `overview/product-scope.md` — 무엇을 어디까지 만드나
3. `systems/game-state.md` → `systems/progression.md` — 게임이 어떻게 돌아가나
4. `sessions/S01.md`, `sessions/S02.md` — 첫 수직 슬라이스 범위
5. `data/README.md` — 데이터를 어떻게 쪼개나

## 전체 파일 목록

```
docs/
├── README.md                     ← 이 문서
├── bible.md                      ← 캐논 v5.2
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
│   ├── art-assets.md        audio-assets.md
├── ui/
│   ├── visual-style.md  overlays.md  meta-screens.md
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
