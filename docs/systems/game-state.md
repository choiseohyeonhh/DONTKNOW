# 게임 상태 모델

> 엔진이 들고 있는 상태의 전체 목록. 세이브 대상과 일치한다(`data/schema-save.md`).
> 원칙: **화면에 보이는 모든 것은 이 상태에서 계산된다.** UI가 자체 상태로 게임 진행을 기억하지 않는다(스크롤 위치 같은 순수 표시 상태 제외).

## 1. 최상위 구조

| 키 | 타입 | 설명 |
|---|---|---|
| `meta` | object | 세이브 버전, 캐논 버전, 회차, 시작 시각(실시간) |
| `clock` | `{day: 18|19|21, min: number}` | 게임 시계. `min`은 자정 기준 분(02:47 = 167) |
| `location` | PlaceId | 현재 장소(`PL.home_hall` 등) |
| `device` | `"father" \| "old"` | 현재 조작 중인 기기 |
| `session` | `{current: SessionId \| null, status: map<SessionId, "locked"\|"available"\|"active"\|"done">}` | |
| `phase` | `P0`~`P14` | NPC 허브 응답 단계(`systems/progression.md` 6장) |
| `know` | `Set<KId \| KXId>` | 획득한 앎. 획득 순서·시각은 `knowLog`에 |
| `knowLog` | `[{id, clock, session}]` | 텔레메트리·디버그 |
| `flags` | `Set<FId \| FXId>` | 불리언 플래그 |
| `vars` | `map<string, number \| string>` | 카운터·열거 값(`v.*`) |
| `branch` | `{A?: "A-1"\|"A-2"\|"A-3", B?: ..., D?: ...}` | 분기 코드 |
| `ending` | `EndingId \| null` | 판정 결과 |
| `phone` | object | 아버지 폰 상태(아래 2장) |
| `oldPhone` | object | 옛 폰 상태(아래 3장) |
| `queue` | `[ScheduledEvent]` | 리액티브·고정 이벤트 대기열 |
| `idle` | `{lastProgressAt: ms, firedStages: [90,180,300]}` | 유휴 넛지 |
| `dialogue` | `{treeId, nodeId, history: [nodeId]} \| null` | 진행 중 대화 |
| `seen` | `Set<string>` | 열람 기록(메시지·사진·메모·아이템). 미확인 항목 판정 |

## 2. 아버지 폰 상태 `phone`

| 키 | 설명 |
|---|---|
| `contacts` | `map<ContactId, {visible, name, number, blocked}>` — 초기 + 자동 추가 |
| `knownNumbers` | 이름 없이 알게 된 번호(0091 등) [ISSUE-25] |
| `callLog` | `[CallEntry]` — 초기 데이터 + 게임 중 발생. `missed`, `seenInList` |
| `threads` | `map<ThreadId, {messages: [MsgRef], unread: number, everOpened: bool, lastOpenedAt}>` |
| `talk` | 톡 대화방 상태(threads와 동일 구조) |
| `photos` | 사진 목록(초기 + 카메라 촬영) |
| `wallpaper` | `"PH.f.family_2019"` 기본, `FX-07` 시 카메라 사진 ID |
| `nav` | `{destinations: Set<PlaceId>, history}` |
| `memo` | 아버지 메모(읽기 전용) |
| `badges` | 계산값(저장 안 함): 부재중 배지 = `missed && !seenInList`, 메시지 배지 = Σ unread |
| `lockedApps` | 특정 연출 중 잠긴 앱(S13 동안 전화·메시지) |
| `autoCloseUsed` | `Set<ThreadId>` — S1 자동 닫힘이 이미 발동한 스레드 |

### 배지 규칙(12.1)
- 잠금화면·홈 배지 숫자 = 아버지가 외면한 것의 양.
- 부재중 배지: **번호(발신자) 단위로 확인해야 줄어든다.** 최근기록 목록에서 행을 탭해 상세를 보거나 그 번호로 다시 걸면 그 번호의 부재중 전부가 "확인"된다. 목록을 여는 것만으로는 0이 되지 않는다.
  - 이유: 실제 폰은 목록을 열면 배지가 0이 되지만, 그러면 S1 첫 탭에 47이 사라지고 "플레이할수록 배지가 줄어든다"(12.1)가 죽는다. 이 게임에서 배지는 기능이 아니라 서사 계기판이다. 핍진성 비용은 "아버지 폰은 오래된 기종"이라는 UI 설정으로 흡수.
  - 엔딩 A 마지막 시퀀스에서 남은 부재중·미읽을 아버지가 하나씩 여는 연출로 0을 만든다(`sessions/S14.md`).
- 메시지 배지: 스레드를 열면 그 스레드 unread가 0. 목록의 `모두 읽음` 메뉴는 존재하지만 **비활성**(회색, 탭하면 독백 "…그건 이제 안 한다." — S11 이후에만. 그 전엔 숨김). 아버지의 2025-10-20 행동[ISSUE-03]을 플레이어가 반복할 수 없게 한다.

## 3. 옛 폰 상태 `oldPhone`

| 키 | 설명 |
|---|---|
| `obtained` | K-18 시 true |
| `charged` | 충전 연출 완료 |
| `unlocked` | PIN 성공 |
| `pinFails` | 실패 횟수 |
| `hintShown` | 3회 실패 후 "아빠" 힌트 표시 여부 |
| `seen` | 열람한 항목(전역 `seen`과 공유 가능) |
| `voiceMemo` | `{played: bool, completed: bool, position: s}` |

## 4. 변수 목록 `vars` (v.*)

| 키 | 타입 | 용도 | 세팅 위치 |
|---|---|---|---|
| `v.s2_mode` | `"sms"\|"call"` | S2 진행 방식 | S2 |
| `v.s4_trust_count` | number | F-01 판정 | S4 선택지 3지점 |
| `v.s4_doubt_count` | number | 텔레메트리 | S4 |
| `v.s5_visits` | number | 경찰서 방문 횟수 | 도착 시 |
| `v.s7_call_attempts` | number | 준호 발신 횟수 | S7 |
| `v.s8_mode` | `"door"\|"intercom"` | 영수증 획득 방식 | S8 |
| `v.s9_pressure` | number | 압박 횟수, 2 이상이면 조기 종료 | S9 |
| `v.s9_path` | `"photo"\|"pressure"` | | S9 |
| `v.pin_fails` | number | PIN 실패 | S10 |
| `v.s11_unseen` | number | S11 미확인 필수 항목 수(계산값) | S11 |
| `v.s13_choice` | `1\|2\|3\|4` | S13 최종 선택 | S13 |
| `v.s13_probe_count` | number | 1단계 탐색 선택지 사용 수 | S13 |
| `v.hyung_0091_calls` | number | 플레이어가 0091에 건 횟수 | 상시 |
| `v.nudge_count_<session>` | number | 넛지 발동 수(텔레메트리) | 스케줄러 |

## 5. 상태 불변식 (검증 스크립트·런타임 assert)

1. `F-02`와 `F-02b`는 동시에 참일 수 없다.
2. `F-05`와 `F-06`은 동시에 참일 수 없다.
3. `K-20`이 있으면 `K-19`가 있어야 한다(S10 → S11 순서).
4. `ending != null`이면 `session.status.S13 == "done"`.
5. `device == "old"`이면 `oldPhone.unlocked || 현재 화면이 옛 폰 잠금화면`.
6. `clock`은 단조 증가(되돌아가지 않음). 세이브 불러오기 제외.
7. S13 출발 시트 수락 이후 `flags`에 F-03, F-04 추가 불가(분기 잠금).

## 6. 초기 상태 (게임 시작)

- `clock = {day:18, min:167}`(02:47), `location = PL.home_hall`, `device = "father"`.
- `session.status`: S1 = active, 나머지 locked.
- `phone`: `content/father-phone-data.md`의 초기 데이터 그대로. 부재중 47(미확인), 미읽 23.
- `know`, `flags`: 비어 있음. (아버지는 빚을 알지만 그건 K가 아니다 — K는 "게임 중 아버지가 새로 아는 것"이다.)
- `queue`: `EV.S01.01`(지훈 문자 10초 후) 예약.
