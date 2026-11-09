# STATE_MANAGEMENT — 단일 상태 트리·로그·동기화·시계

> **역할:** 단일 상태 트리의 최상위 구조, 변경 API, 이벤트 로그와 재생, 파생 상태(가시성), 세이브 직렬화, 오프라인 대기열, 동기화 적용 알고리즘, 게임 시계를 고정한다.
> **단일 출처:** 이 문서(런타임 상태 구조·변경 규칙·대기열·시계). 콘텐츠 스키마·세이브 봉투·린터는 [DATABASE_SCHEMA](./DATABASE_SCHEMA.md), 이벤트 이름·페이로드는 [API_SPECIFICATION](./API_SPECIFICATION.md), 동기화·가시성 원본은 [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 4절이다.
> **참조:** [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 4.1~4.3, [BUSINESS_RULES](../01-product/BUSINESS_RULES.md) 3~5절, [PROGRESSION_AND_ENDINGS](../01-product/PROGRESSION_AND_ENDINGS.md) 3절, [TRACES_AND_REACTIONS](../01-product/TRACES_AND_REACTIONS.md) 1·4절, [MAIL_AND_CLOUD_SPECIFICATION](../03-features/MAIL_AND_CLOUD_SPECIFICATION.md).
> **적용 버전:** v6.2 (2026-11).

## 1. 원칙

1. **단일 상태 트리.** 게임의 모든 가변 상태는 하나의 객체에 있다. 모듈이 자기 상태를 따로 들고 있지 않는다.
2. **단일 작성자.** 상태 변경은 `core/state.js`의 `commit`/`transaction`/`patch`만 한다.
3. **직렬화 가능.** 상태에는 함수·DOM·`Map`·`Set`·`Date` 객체를 넣지 않는다. 전부 JSON 값.
4. **결정론.** 같은 상태 + 같은 이벤트 + 같은 시드 → 같은 결과. 게임 판정에 `Date.now()`·`Math.random()`을 쓰지 않는다.
5. **파생 상태는 저장하지 않는다.** 가시성·검색 색인·렌더 HTML은 매번 계산한다.
6. **로그는 append-only.** 이벤트 로그를 수정·삭제하지 않는다. 세이브에는 최근 N개만 남긴다.

## 2. 최상위 키 전체

| 키 | 타입 | 필수 | 저장 | 설명 |
|---|---|---|---|---|
| `meta` | object | ✓ | ✓ | 스키마·앱·콘텐츠 버전, 생성 시각, 시드 |
| `clock` | object | ✓ | ✓ | 게임 시계·일시정지·시간 흐름 모드 |
| `net` | object | ✓ | ✓ | Wi-Fi·비행기·온라인·앱별 동기화·동기화 점 |
| `device` | object | ✓ | ✓ | 잠금·대기·와이프·배터리·집중 모드·알림 미리보기·테마 |
| `gates` | `Record<G-xx, boolean>` | ✓ | ✓ | 게이트 열림 상태 |
| `flags` | `Record<F-xx, boolean\|string\|number>` | ✓ | ✓ | 캐논 플래그([12](../01-product/PROGRESSION_AND_ENDINGS.md) 6.1) |
| `npc` | object | ✓ | ✓ | NPC 상태·경계·마지막 응답 시각 |
| `verify` | `Record<V-xx, object>` | ✓ | ✓ | 행동 증명 성립 상태 |
| `traces` | `Record<TR-xx, object>` | ✓ | ✓ | 흔적 발생·전송 상태 |
| `seen` | `Record<itemId, gameMin>` | ✓ | ✓ | 열람 기록. 힌트·통계 전용 |
| `inspected` | `Record<itemId, true>` | ✓ | ✓ | 정보(i) 열람 기록. 판정 금지 |
| `items` | `Record<itemId, object>` | ✓ | ✓ | 콘텐츠 항목의 런타임 오버레이(삭제·읽음·캐시) |
| `apps` | object | ✓ | ✓ | 앱별 상태(2.3) |
| `media` | object | ✓ | ✓ | 가상 미디어 항목·동기화 상태 |
| `queue` | object | ✓ | ✓ | 오프라인 대기열(원격·업로드·흔적) |
| `ui` | object | ✓ | 일부 | 셸·스택·탭·작성창·스크롤 |
| `log` | `LogEntry[]` | ✓ | 최근 500 | append-only 이벤트 로그 |
| `story` | object | ✓ | ✓ | 현재 엔딩·후일담·본 엔딩 목록 |
| `debug` | object | — | — | 디버그 전용. 저장하지 않는다 |
| `inventory` | — | **없음** | — | 단서 수집·카드·소지품 개념은 v6.2에 없다. 항목은 `items`·`apps`로만 존재 |

- `inventory` 키를 만들지 않는다. "단서를 모은다"는 상태는 없다. 단서는 폰 안의 데이터 자체다([10](../01-product/EVIDENCE_LEDGER.md) 1절).
- `visibility`·`searchIndex`·`renderHTML`은 최상위 키가 아니다. 파생 상태다.

### 2.1 `meta`

```json
{
  "schemaVersion": 3,
  "appVersion": "6.2.0",
  "contentVersion": "2026.11.1",
  "createdAt": "2026-11-08T10:00:00.000Z",
  "lastSavedAt": "2026-11-08T10:30:00.000Z",
  "seed": 20261108,
  "newGame": true
}
```

### 2.2 `clock`·`net`·`device`

```json
{
  "clock": {
    "gameMin": 0,
    "lastRealMs": 0,
    "paused": { "menu": false, "cinematic": false, "hidden": false },
    "mode": "x4",
    "offAccumulator": 0
  },
  "net": {
    "wifi": false,
    "airplane": false,
    "online": false,
    "sync": { "photo": true, "note": true, "reminder": true, "voice": false, "keyboard": true, "map": true, "wave": true, "weather": true, "screenTime": true },
    "lastSyncGameMin": null,
    "syncDotUntil": null
  },
  "device": {
    "locked": true,
    "lockAttempts": 0,
    "lockoutUntilRealMs": 0,
    "wiped": false,
    "battery": 31,
    "charging": true,
    "focusMode": true,
    "notificationPreview": { "blink": "never", "loopDm": "never", "default": "unlocked" },
    "theme": "dark",
    "typeScale": "md",
    "reducedMotion": false
  }
}
```

### 2.3 `apps.*`

`apps`의 각 키는 앱 ID다. 공통으로 `opened`·`scroll`·`tab`을 둘 수 있고, 앱별 상태는 아래 표를 따른다.

| 앱 키 | 주요 상태 |
|---|---|
| `mail` | `account`, `folder`, `openMailId`, `compose`, `scheduledEdit` |
| `message` | `activeThreadId`, `readAt` |
| `talk` | `activeRoomId`, `rooms.{id}.read`, `drawerTab`, `searchQuery` |
| `loop` | `tab`, `feedSegment`, `activePostId`, `activeStoryId`, `viewedStories[]`, `liked[]`, `saved[]`, `dmDraft` |
| `blink` | `session`, `roomId`, `readMessageIds[]`, `expiresAt{}`, `captured[]` |
| `photo` | `album`, `activePhotoId`, `zoom`, `originalRestored{}`, `hiddenUnlocked` |
| `camera` | `composition`, `drawerOpen`, `lastCaptureId` |
| `map` | `tab`, `query`, `route{from,to,mode}`, `recent[]` |
| `find` | `selectedDeviceId`, `soundPlayedAt`, `shareRequested` |
| `contacts` | `selectedId`, `search` |
| `calendar` | `view`, `month`, `selectedDate` |
| `note` | `unlocked`, `passwordAttempts`, `selectedId`, `composing` |
| `reminder` | `listId`, `checks{}` |
| `voice` | `selectedId`, `transcriptEnabled`, `positionSec`, `clipRange` |
| `clockapp` | `tab`, `alarmEditId` |
| `weather` | `region` |
| `health` | `day`, `metric` |
| `wallet` | `tab` |
| `bank` | `unlocked`, `failedAttempts`, `filter`, `selectedTxId` |
| `taxi` | `destQuery`, `destPlace`, `confirming` |
| `file` | `folder`, `selectedFileId` |
| `wave` | `tab`, `query`, `historyTab` |
| `tube` | `tab`, `videoId`, `positionSec`, `captions` |
| `moa` | `tab`, `postId`, `dmId` |
| `hankki` | `tab`, `storeId`, `cart`, `reorderConfirm` |
| `market` | `tab`, `listingId`, `chatId` |
| `portal` | `tab` |
| `calc` | `display`, `history` |
| `settings` | `path`, `search`, `toggles{}` |
| `system` | `notificationCenterOpen`, `controlCenterOpen`, `searchQuery` |

- 앱 상태는 **UI 상태와 게임 상태를 구분**한다. `apps.note.unlocked`는 게임 상태(게이트), `apps.note.selectedId`는 UI 상태다. 둘 다 저장해도 되지만, UI 상태는 복원 실패해도 게임 진행에 영향이 없어야 한다.
- 앱 모듈은 자기 키 아래만 쓴다. 다른 앱 키를 직접 수정하지 않는다.

### 2.4 `npc`·`flags`·`verify`·`traces`

```json
{
  "npc": {
    "states": { "DH": "DH-0", "JH": "JH-0", "SA": "SA-0", "MJ": "MJ-0", "KS": "KS-0" }, "ktReplied": false,
    "boundary": { "DH": 0 },
    "lastReplyAt": {}
  },
  "flags": {
    "F-CONFESS": false,
    "F-NAME-SENT": false,
    "F-REC": "device",
    "F-REC-SENT": false,
    "F-PLATE-SENT": false,
    "F-LOC-SENT": false,
    "F-MAIL": "pending",
    "F-LEAK": false,
    "F-WIPED": false,
    "F-WIPE-SLATE": false,
    "F-MOVED": false,
    "F-HARIN": "none",
    "F-GO": false,
    "F-LOC": "none"
  },
  "verify": {
    "V-01": { "done": true, "atGameMin": 8 }
  },
  "traces": {
    "TR-02": { "firedAt": 58, "pending": false, "sentAt": 58, "owner": ["A-01", "P-01"] }
  }
}
```

- `flags`의 값 타입은 캐논 표를 따른다([12](../01-product/PROGRESSION_AND_ENDINGS.md) 6.1). `DH`는 `flags`가 아니라 `npc.states.DH`다.
- `traces`는 `once` 규칙 때문에 발생 후에도 상태를 남긴다.

### 2.5 `items` 오버레이

콘텐츠 항목은 불변이다. 런타임 변화만 오버레이에 기록한다.

```json
{
  "mail.taxi.0314": { "deleted": false, "remoteDeletedBy": null, "read": true, "cached": false },
  "note.letter.dad": { "deleted": true, "remoteDeletedBy": "EV-04", "read": true, "cached": false }
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `deleted` | boolean | 삭제됨(원격 포함). 렌더·검색에서 제외 |
| `remoteDeletedBy` | `EV-xx` \| null | 어떤 EV가 삭제했는지 |
| `read` | boolean | 읽음(톡·메시지·DM) |
| `checked` | boolean | 미리 알림 체크 |
| `cached` | boolean | T2 항목이 온라인에서 한 번 보여 캐시됨 |
| `edited` | object | 플레이어가 수정한 필드(예약 메일 본문) |
| `created` | object | 게임 중 생성된 항목의 데이터(진술 캡처) |

- 오버레이에 키가 없으면 콘텐츠 기본값이다.
- `deleted: true`는 영구 삭제다. 최근 삭제함으로 가지 않는다([09](../03-features/MAIL_AND_CLOUD_SPECIFICATION.md) 규칙 2).

### 2.6 `media`·`story`·`ui`·`log`·`debug`

| 키 | 주요 필드 |
|---|---|
| `media` | `virtual.{mediaId}`, `syncState` — [FILE_AND_MEDIA_MANAGEMENT](./FILE_AND_MEDIA_MANAGEMENT.md) 6절 |
| `story` | `ending`, `epilogue[]`, `seenEndings[]` |
| `ui` | `shell`, `stack[]`, `sheet`, `banner`, `composer`, `appTabs`, `navLocked`, `lastScreen` |
| `log` | `{seq, atGameMin, type, payload, source, replayable}` |
| `debug` | `{enabled, seed, forcedEvents[]}` — 저장하지 않는다 |

- `ui.stack`은 SCR ID 배열이다. 불러오기 시 [NAVIGATION_ARCHITECTURE](../02-design/NAVIGATION_ARCHITECTURE.md)에 없는 SCR이면 홈으로 복구한다.
- `ui.composer` 초안은 최대 2,000자까지 저장한다. 초과분은 저장하지 않고 화면에는 유지한다.

## 3. 변경 API

```js
commit(mutator, meta)
transaction(fn, meta)
patch(path, value, meta)
select(path)
subscribe(event, handler)
```

### 3.1 경로 표기

- 점 표기: `"apps.note.unlocked"`, `"flags.F-GO"`, `"npc.states.DH"`.
- ID에 점이 들어가는 경우(예: `mail.taxi.0314`)는 경로가 아니라 **키로만** 쓴다. `items["mail.taxi.0314"]`처럼 브래킷 접근을 쓴다. `patch()`에 점이 포함된 ID를 경로로 넘기지 않는다.

### 3.2 커밋 파이프라인

```text
commit(mutator, meta)
  → 초안(draft)에 mutator 적용
  → 변경 경로 수집
  → 유효성 검사(직렬화 가능, 정의된 키)
  → 상태 확정
  → log.append({seq, atGameMin, type, payload, source, replayable})
  → 이벤트 발행(meta.type)
  → 렌더 예약(rAF 1회)
```

- 커밋 중 예외가 나면 상태를 바꾸지 않고 롤백한다. 오류는 [ERROR_HANDLING](../05-quality/ERROR_HANDLING.md) E-STATE.
- 같은 커밋에서 `items`와 `log`를 함께 바꾸는 것은 허용한다. 단, 로그 항목은 커밋 1회당 1개다.

## 4. 이벤트 로그와 재생

### 4.1 로그 항목

```json
{
  "seq": 1042,
  "atGameMin": 71,
  "type": "ev.fire",
  "source": "scheduler",
  "replayable": true,
  "payload": { "evId": "EV-06", "actions": [{ "makeItem": "message.dohyun.warning" }] }
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `seq` | number | 1부터 증가. 재생 순서 |
| `atGameMin` | number | 게임 시각 |
| `type` | string | 이벤트 이름 |
| `source` | string | 발생 모듈 |
| `replayable` | boolean | false면 재생에서 건너뛴다(연출·디버그·UI 전용) |
| `payload` | object | 이벤트 페이로드(민감 정보 없음) |

### 4.2 재생

- **정상 플레이에서는 재생하지 않는다.** 재생은 디버그·테스트·버그 재현용이다.
- 재생 입력: 초기 상태 + 로그(seq 순) + 시드.
- 재생은 `ev.fire`·`npc.reply` 같은 **이미 발생한 이벤트를 다시 실행**하지 않고, 로그의 상태 변경 결과를 적용한다. 스케줄러를 다시 돌리지 않는다.
- `replayable: false` 항목은 건너뛴다. 예: 애니메이션, 디버그 시각 이동, UI 스크롤.
- 로그가 500개를 넘어 잘린 세이브는 **완전 재생 불가**다. 이때 재생은 "현재 상태에서 앞으로"만 가능하다.
- 엔딩 후 "다시 보기" 통계는 재생이 아니라 `seen`·`inspected`·`traces`에서 계산한다.

### 4.3 결정론

| 비결정 요소 | 처리 |
|---|---|
| NPC 지연 `{min,max}` | `meta.seed` 기반 PRNG(`mulberry32`) |
| 흔적 반응 순서 | `atGameMin` → `priority` → ID |
| 실제 시각 | 로그·세이브 메타에만. 게임 판정 금지 |
| 렌더 순서 | `data-k` 키 기준. DOM 순서에 의존 금지 |

## 5. 파생 상태 — 가시성

### 5.1 공식([SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 4.1)

```text
visible(item) =
     layerOpen(item.layer)
  && (item.gate == null || gates[item.gate] == true)
  && !items[item.id].deleted
  && (item.storage != 'server' || net.online)
```

`layerOpen`:

| 층 | 열림 조건 |
|---|---|
| T0 | 항상 |
| T1 | `gates['G-01']`(잠금 해제) |
| T2 | `net.online` **또는** `items[item.id].cached` |
| T3 | 해당 게이트(예: G-03, G-04, G-05, G-06, G-07) |
| T4 | 대화로 생성된 항목이면 생성 즉시 |

### 5.2 캐시 규칙

- T2 항목을 **온라인에서 한 번 보면** `items[id].cached = true`. 이후 오프라인에서도 보인다(루프 프로필 등).
- 원격 삭제 대상은 다음 온라인 때 캐시에서도 사라진다(`deleted = true`).
- 캐시는 항목 단위다. 앱 단위 캐시 플래그를 만들지 않는다.

### 5.3 파생 선택자

```js
isVisible(itemId)        // 5.1
visibleItems({app, kind, layer, gate})
visibleApps()
canOpenScreen(scrId)
search.search(query)     // visibleItems만 색인
```

- `visibility.js`는 상태를 쓰지 않는다. `state`를 읽고 계산만 한다.
- 검색 색인은 `visibleItems`가 바뀔 때 `search.invalidate()`로 갱신한다.
- `seen`은 가시성에 영향을 주지 않는다. 본 것과 볼 수 있는 것은 다르다.

## 6. 세이브 직렬화

### 6.1 저장 대상

| 저장 | 제외 |
|---|---|
| `meta`, `clock`, `net`, `device`, `gates`, `flags`, `npc`, `verify`, `traces`, `seen`, `inspected`, `items`, `apps`, `media`, `queue`, `story`, `log`(최근 500), `ui`(셸·스택·탭·작성창 초안) | `debug`, `visibility`, `searchIndex`, 렌더 HTML, DOM 참조, 열린 시트·배너·`navLocked` |

### 6.2 직렬화 규칙

1. 키를 사전순으로 정렬한 **canonical JSON**으로 만든다.
2. `undefined`는 버린다. `null`은 유지한다.
3. 숫자는 IEEE-754 안전 범위. 금액은 원 단위 정수.
4. `checksum`은 canonical JSON의 FNV-1a 32비트. 보안이 아니라 손상 감지다.
5. 봉투는 [DATABASE_SCHEMA](./DATABASE_SCHEMA.md) 4.2.

### 6.3 복원 순서

```text
localStorage 읽기
  → JSON.parse 실패? → 손상 복구
  → schemaVersion 검사
  → 미래 버전? → 백업 후 중단
  → 과거 버전? → 마이그레이션 체인
  → 필수 키 기본값 병합
  → 유효성 검사(SCR·항목 ID)
  → 파생 상태 재계산
  → 첫 렌더
```

- 복원 중 알 수 없는 항목 ID는 버리고 경고 로그만 남긴다. 게임은 계속된다.
- `ui.stack`의 SCR이 없으면 `SCR-OS-HOME`으로 복구한다.
- `clock.paused`의 세 값은 복원 시 모두 `false`로 초기화한다. 저장 당시의 일시정지 사유는 다음 실행에 유효하지 않다.
- 저장 실패는 [ERROR_HANDLING](../05-quality/ERROR_HANDLING.md) 3절.

## 7. 오프라인 대기열

### 7.1 구조

```json
{
  "queue": {
    "remote": [
      { "id": "r-004", "kind": "remoteDelete", "itemId": "note.letter.dad", "evId": "EV-04", "atGameMin": 55, "requires": "online", "status": "pending" }
    ],
    "traces": [
      { "id": "t-002", "trId": "TR-02", "owner": ["A-01", "P-01"], "atGameMin": 58, "cause": { "roomId": "talk.dad" } }
    ],
    "uploads": [
      { "id": "u-001", "app": "voice", "itemId": "voice.37", "atGameMin": 63, "status": "pending" }
    ]
  }
}
```

| 큐 | 언제 쌓이나 | 언제 비우나 |
|---|---|---|
| `remote` | EV가 오프라인에서 삭제·지우기·생성을 요청할 때 | 다음 온라인 |
| `traces` | TR이 오프라인에서 발생할 때 | 다음 온라인 |
| `uploads` | 이 폰의 변경(녹음 동기화, 메모, 예약 메일 수정)이 동기화 대상일 때 | 다음 온라인 |

### 7.2 규칙

1. 큐 항목은 `id`로 멱등하다. 같은 ID는 두 번 적용하지 않는다.
2. 정렬: `atGameMin` → `priority`(원격 지우기 = 0, 삭제 = 10, 알림 = 20, 흔적 = 30, 업로드 = 40) → `id`.
3. 앱별 동기화가 꺼진 앱의 `remoteDelete`는 적용하지 않고 `skipped`로 표시한다. 항목은 유지된다([18](../03-features/SETTINGS_SPECIFICATION.md)).
4. 원격 지우기(`remoteWipe`)는 앱 동기화와 무관하게 기기 전체를 지운다.
5. 흔적은 원격 행동 적용 후 전송한다. 순서가 뒤바뀌면 도현이 삭제 전에 반응하는 모순이 생긴다.
6. 큐는 세이브에 포함한다. 오프라인 상태로 저장하고 다음 실행에서도 유지된다.

## 8. 동기화 적용 알고리즘([SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 4.2)

`net.setOnline(true)`가 호출되면 `applySync()`가 다음 순서로 실행한다.

```text
applySync():
  1. net.online = true, net.lastSyncGameMin = clock.gameMin
  2. if queue.remote에 remoteWipe가 있으면:
       remoteWipe 즉시 적용
       → '지우는 중…' 8초 연출
       → device.wiped = true
       → story.ending = D 판정 트리거
       → return (다른 큐는 적용하지 않는다)
  3. queue.remote를 atGameMin 순으로 적용:
       remoteDelete:
         if app.sync[item.syncApp or item.app] == false: skip
         else: items[item.id].deleted = true
               → 알림 기록 추가("1개 항목이 다른 기기에서 삭제됨")
               → item.delete 이벤트(화면 행 0.4초 페이드)
       remoteCreate:
         → items 오버레이에 생성, 필요하면 알림
  4. queue.traces를 atGameMin 순으로 전송:
       traces[trId].pending = false, sentAt = clock.gameMin
       → trace.emit 이벤트 재발행(전송 완료)
  5. queue.uploads를 atGameMin 순으로 업로드:
       앱별 동기화가 켜진 것만. voice는 게임 4분 지연 후 완료(EV-14)
  6. 큐 비우기, syncDotUntil = clock.gameMin + 1 (동기화 점 1게임분)
```

| 단계 | 근거 |
|---|---|
| 원격 지우기 최우선 | [14](SYSTEM_ARCHITECTURE.md) 4.2 2항 |
| 원격 행동 시각순 | [14](SYSTEM_ARCHITECTURE.md) 4.2 1항 |
| 업로드는 그 뒤 | [14](SYSTEM_ARCHITECTURE.md) 4.2 3항 |
| 흔적 지연 전송 | [19](../01-product/TRACES_AND_REACTIONS.md) 1절 5항, [12](../01-product/PROGRESSION_AND_ENDINGS.md) 3.2 |

- 온라인 전환은 `G-02`를 연다. 첫 온라인이면 `TR-01`이 발생하고 `EV-02`(3/15~3/17 동기화)가 적용된다.
- 오프라인 전환은 즉시 `net.online = false`. 이후 원격 행동은 큐에만 쌓인다.
- 비행기 모드는 Wi-Fi보다 우선한다. `airplane = true`면 `wifi` 값과 무관하게 오프라인.

## 9. 시계([SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 4.3)

### 9.1 흐름

```text
requestAnimationFrame 루프
  → realDelta = performance.now() - lastRealMs
  → paused(menu|cinematic|hidden) 중이면 누적하지 않음
  → mode == 'x4': gameDelta += realDelta * 4
  → mode == 'off': 앱 전환 1회 = 게임 1분
  → gameMin = floor(gameDelta / 60000)  // 1게임분 = 15실초
  → gameMin이 증가하면 scheduler.tick(gameMin), clock.minute 이벤트
```

| 항목 | 값 |
|---|---|
| 배속 | ×4. 1게임분 = 15실초 |
| 시작 | 3/17 21:10 = 게임 분 0 |
| 마감 | 3/18 09:00 = 게임 분 710 |
| "30분" 위기 | 30게임분 = 7분 30초 |
| 백그라운드 | `visibilitychange`로 `paused.hidden = true`. 복귀해도 따라잡지 않는다 |
| 일시정지 메뉴 | `paused.menu = true`. 메뉴를 닫으면 재개 |
| 시네마틱 | `paused.cinematic = true`. 프롤로그·엔딩 재생 중 |
| 시간 흐름 끄기 | `mode = 'off'`. 앱 전환 1회당 1게임분. 자동 진행 없음 |
| 저장 | `clock.gameMin`만 저장. 불러오면 그 시각부터 |

### 9.2 시계 불변식

1. `gameMin`은 감소하지 않는다. 단, `?debug=1`의 `setClock`은 예외다.
2. 백그라운드·일시정지 중에는 게임 시각이 흐르지 않는다. 실제 시간으로 사건이 발생하지 않는다.
3. 잠금 30초 대기·원격 지우기 8초 연출·페이드 같은 **연출 타이머만** 실시간을 쓴다.
4. 모든 EV 시각은 게임 분이다. 표시용 시각 문자열은 `clock.formatClock()`이 만든다.
5. 게임 시각을 `Date` 객체로 저장하지 않는다. 정수 `gameMin`만.

### 9.3 시간 흐름 끄기(`mode: 'off'`)

- 앱 전환 1회 = 게임 1분. 앱 내 화면 이동은 세지 않는다.
- `scheduler.tick()`은 1분이 더해질 때마다 실행된다.
- 일시정지 메뉴·시네마틱은 여전히 정지한다.
- 접근성 옵션이므로 언제든 켜고 끌 수 있다. 남은 시간은 재계산하지 않는다.

## 10. 불변식 요약

| 불변식 | 검사 방법 |
|---|---|
| 상태 변경은 `state.js`만 | 코드 리뷰·ESLint 없이 grep(직접 대입 검색) |
| 로그는 append-only | `log.push`만. 수정·삭제 코드 없음 |
| 게임 판정에 실제 시각·랜덤 없음 | `Date.now`·`Math.random` 사용처 검사 |
| 파생 상태 미저장 | 세이브 직렬화 키 검사 |
| 세이브에 `inventory` 없음 | 직렬화 키 검사 |
| 오프라인 큐 멱등 | 같은 큐 2회 적용 테스트 |
| 시계 단조 증가 | 단위 테스트 |
| `visible`는 상태를 쓰지 않음 | 함수 시그니처·코드 리뷰 |

## 확인 사항

- `Q-OPEN-T22`: 시간 흐름 끄기에서 "앱 전환 1회 = 게임 1분"의 '앱 전환' 정의(앱 열기만인지, 앱 간 이동인지)를 [04](../01-product/BUSINESS_RULES.md) 5절은 명시하지 않는다. 이 문서는 "홈에서 다른 앱을 여는 것" 1회로 본다. 총괄 확인 필요.
- `Q-OPEN-T23`: `ui.stack`을 세이브에 저장해 정확히 복원할지, 항상 홈에서 시작할지 결정이 필요하다. 이 문서는 저장·복원을 기본으로 하되 실패 시 홈 복구로 적었다. 추천: 저장·복원.
- `Q-OPEN-T24`: 동기화 점(`syncDotUntil`)을 게임 1분으로 둔 것은 연출이다. 실제 캐논은 "깜빡이면 지금 무언가 오가는 중"만 정한다([05](../03-features/SYSTEM_SHELL_SPECIFICATION.md)).
- `Q-OPEN-T25`: 블링크 60초·잠금 30초 대기처럼 실시간 타이머와 게임 시계가 섞이는 지점의 일시정지 동작은 [BACKEND_ARCHITECTURE](./BACKEND_ARCHITECTURE.md) Q-OPEN-T07·[AUTHENTICATION_AND_SECURITY](./AUTHENTICATION_AND_SECURITY.md) Q-OPEN-T18과 함께 확정해야 한다.
