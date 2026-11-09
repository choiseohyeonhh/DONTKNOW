# API_SPECIFICATION — HTTP API 없음, 내부 모듈 API

> **역할:** HTTP API가 없는 구조에서 모듈 간 내부 API(상태 변경·이벤트 버스·콘텐츠 로더·디버그·테스트 훅)를 함수 시그니처와 페이로드로 고정한다.
> **단일 출처:** 이 문서(내부 API 계약·이벤트 이름·페이로드). 상태 트리 구조는 [STATE_MANAGEMENT](./STATE_MANAGEMENT.md), 콘텐츠 스키마는 [DATABASE_SCHEMA](./DATABASE_SCHEMA.md), 모듈 책임은 [FRONTEND_ARCHITECTURE](./FRONTEND_ARCHITECTURE.md)가 단일 출처다.
> **참조:** [SYSTEM_ARCHITECTURE](./SYSTEM_ARCHITECTURE.md) 4절, [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 3·4절, [TESTING_STRATEGY](../05-quality/TESTING_STRATEGY.md).
> **적용 버전:** v6.2 (2026-11). **HTTP 엔드포인트·REST·GraphQL·WebSocket은 없다.**

## 1. 계약 원칙

| 원칙 | 내용 |
|---|---|
| 방향 | UI → 상태 변경 API → 이벤트 버스 → 규칙 모듈. 역방향 직접 호출 금지 |
| 직렬화 | 모든 페이로드는 JSON 직렬화 가능한 값만 |
| 시각 | 게임 시각은 `gameMin`(정수). 실제 시각(`Date.now`)은 로그·세이브 메타에만 |
| 순수성 | `verify`·`trace`·`scheduler`·`visibility`는 DOM을 모른다 |
| 재현성 | 같은 상태 + 같은 이벤트 + 같은 시드 → 같은 결과 |
| 버전 | `window.__API_VERSION = 1`. 깨는 변경은 문서 갱신 + 버전 증가 |
| 실패 | 예외는 경계에서 잡고 [ERROR_HANDLING](../05-quality/ERROR_HANDLING.md) 코드로 변환 |

## 2. 상태 변경 API (`core/state.js`)

### 2.1 시그니처

```js
/**
 * @typedef {{
 *   type: string,        // 'action.input' 등 이벤트 이름
 *   source: string,      // 'ui.talk' | 'verify' | 'trace' | 'scheduler' | 'net' | 'debug'
 *   reason?: string,     // 사람이 읽는 사유
 *   gameMin: number,     // 변경 시점의 게임 분
 *   replayable?: boolean // 기본 true. false면 재생에서 건너뛴다
 * }} CommitMeta
 */

getState(): State
select<T>(path: string): T
replayTo(seq: number): State
commit(mutator: (draft: State) => void, meta: CommitMeta): void
transaction(fn: (draft: State) => void, meta: CommitMeta): void
patch(path: string, value: unknown, meta: CommitMeta): void
subscribe(event: string, handler: (payload: object) => void): () => void
emit(event: string, payload: object): void
```

### 2.2 규칙

1. `getState()`가 돌려준 객체를 직접 수정하지 않는다. 수정은 `commit`/`transaction`/`patch`만.
2. `commit`은 **동기**다. 커밋이 끝나면 이벤트가 발행되고 로그가 기록된다.
3. 한 커밋 안에서 같은 경로를 두 번 쓰면 마지막 값이 이긴다.
4. `transaction`은 여러 커밋을 한 번의 렌더로 묶는다. 중간 실패 시 전체 롤백한다.
5. `meta.gameMin`은 호출자가 `clock.getGameMin()`으로 넣는다. `state.js`가 시계를 직접 읽지 않는다.
6. `emit`은 코어·규칙 모듈 전용이다. UI는 `commit`만 한다.
7. DOM·`window`·`localStorage` 접근 금지. 저장은 `save.js`가 구독해서 처리한다.

### 2.3 예

```js
state.commit((s) => {
  s.device.locked = false;
  s.gates['G-01'] = true;
}, { type: 'action.unlock', source: 'os.shell', gameMin: clock.getGameMin() });
```

## 3. 이벤트 버스

### 3.1 필수 이벤트

| 이벤트 | 발생자 | 구독자 | 페이로드 |
|---|---|---|---|
| `action.input` | 작성창·앱 | `verify`, `trace`, `npc`, `apps` | `{ channel, target, text, attachments, via }` |
| `action.share` | 공유 시트·작성창 | `verify`, `trace`, `npc`, `apps` | `{ itemId, target, channel, message }` |
| `action.setting` | 설정·제어 센터 | `verify`, `trace`, `net`, `apps` | `{ path, value, previous, app }` |
| `net.sync` | `core/net.js` | `scheduler`, `trace`, `apps`, `save` | `{ online, applied, wiped, pendingBefore }` |
| `trace.emit` | `core/trace.js` | `scheduler`, `npc`, `apps` | `{ trId, owner, visibleTo, pending, cause }` |
| `ev.fire` | `core/scheduler.js` | `net`, `npc`, `apps`, `endings` | `{ evId, atGameMin, actions, source }` |
| `npc.reply` | `npc/dialogue.js` | `apps`, `trace`, `save` | `{ npc, state, lines, set, makeItemId, replyTo }` |
| `verify.hit` | `verify/verify.js` | `apps`, `scheduler`, `save` | `{ vId, event, input, onDone }` |
| `ending.resolve` | `story/endings.js` | `os.shell`, `save` | `{ ending, conditions, atGameMin }` |

### 3.2 보조 이벤트

| 이벤트 | 발생자 | 구독자 | 페이로드 |
|---|---|---|---|
| `clock.minute` | `core/clock.js` | `scheduler`, `os.shell` | `{ gameMin }` |
| `clock.paused` / `clock.resumed` | `core/clock.js` | `os.shell` | `{ reason }` |
| `ui.navigate` / `ui.back` | `os/shell.js` | `apps`, `debug` | `{ scr, params, stackDepth }` |
| `app.open` / `app.close` | `os/shell.js` | `apps`, `trace` | `{ app, scr }` |
| `gate.open` | 규칙 모듈 | `scheduler`, `apps` | `{ gate }` |
| `item.create` | `EV`·`npc` | `apps`, `search` | `{ itemId, item }` |
| `item.delete` | `net`·`EV` | `apps`, `search` | `{ itemId, reason, evId }` |
| `notification.push` | `EV`·`npc`·`net` | `os.shell` | `{ notificationId, app, title, body, originalItemId }` |
| `media.create` | 카메라·제어 센터 | `apps.photo`, `trace` | `{ mediaId, kind, source }` |
| `save.write` / `save.load` | `core/save.js` | `debug` | `{ slot, reason, bytes }` |
| `debug.command` | `debug/panel.js` | `state`, `scheduler` | `{ command, args }` |

### 3.3 페이로드 예

#### `action.input`

```json
{
  "channel": "talk",
  "target": { "kind": "npc", "id": "P-03", "roomId": "talk.jihoon" },
  "text": "도현이가 2월에 방 구한다고 했어요?",
  "attachments": [],
  "via": "typed",
  "gameMin": 46
}
```

#### `action.share`

```json
{
  "itemId": "talk.message.jihoon.0315",
  "target": { "kind": "npc", "id": "P-03", "roomId": "talk.jihoon" },
  "channel": "talk",
  "message": "",
  "gameMin": 52
}
```

#### `action.setting`

```json
{
  "path": "cirrus.sync.photo",
  "value": false,
  "previous": true,
  "app": "settings",
  "gameMin": 61
}
```

#### `net.sync`

```json
{
  "online": true,
  "applied": [
    { "kind": "remoteDelete", "itemId": "note.letter.dad", "evId": "EV-04" },
    { "kind": "remoteDelete", "itemId": "photo.hankyul.envelope", "evId": "EV-05" }
  ],
  "wiped": false,
  "pendingBefore": 2,
  "atGameMin": 55
}
```

#### `trace.emit`

```json
{
  "trId": "TR-02",
  "owner": ["A-01", "P-01"],
  "visibleTo": "owner",
  "pending": false,
  "cause": { "event": "app.open", "roomId": "talk.dad" },
  "atGameMin": 58
}
```

#### `ev.fire`

```json
{
  "evId": "EV-06",
  "atGameMin": 71,
  "source": "schedule",
  "actions": [
    { "makeItem": "message.dohyun.warning" },
    { "notify": "message.dohyun.warning" }
  ]
}
```

#### `npc.reply`

```json
{
  "npc": "P-02",
  "state": "DH-2",
  "replyTo": "action.input:99",
  "lines": ["아빠면 지금 내 방 사진 찍어 보내. 책상 서랍 열고."],
  "set": { "DH": "DH-2" },
  "makeItemId": null,
  "delayGameMin": 4
}
```

#### `verify.hit`

```json
{
  "vId": "V-04",
  "event": "action.share",
  "input": { "itemId": "photo.camera.drawer.0317", "target": "P-02" },
  "onDone": [{ "set": { "DH": "DH-3" }, "openGate": "G-01" }],
  "atGameMin": 63
}
```

#### `ending.resolve`

```json
{
  "ending": "A",
  "conditions": {
    "F-GO": true,
    "F-LOC": "exact",
    "threatCleared": true,
    "F-CONFESS": true,
    "F-LEAK": false,
    "F-WIPED": false
  },
  "atGameMin": 690
}
```

## 4. 콘텐츠 로더 API (`core/state.js`)

서버가 없으므로 **로더는 네트워크를 쓰지 않는다.** 빌드가 인라인한 `window.__CONTENT__`를 인덱싱한다.

```js
hydrateContent(raw: {
  world: object,
  items: object[],
  evidence: object[],
  verify: object[],
  traces: object[],
  keywords: object,
  events: object[],
  npc: object[],
  endings: object
}): ContentIndex

getContent(): ContentIndex
content.item(id: string): Item | undefined
content.items(query?: {
  app?: string, kind?: string, layer?: string, gate?: string|null,
  account?: string, place?: string, evidence?: string
}): Item[]
content.evidence(id: string): Evidence | undefined
content.verify(id: string): VerifyDef | undefined
content.trace(id: string): TraceDef | undefined
content.event(id: string): EventDef | undefined
content.npc(personId: string, state: string): NpcRule[]
content.keywords(): KeywordEntry[]
content.endings(): EndingDef[]
content.world(): WorldData
content.asset(assetId: string): string
content.resolveCondition(expr: string, state: State): boolean
```

| 규칙 | 내용 |
|---|---|
| 인덱싱 | 부팅 시 1회. ID 중복이면 부팅 실패(린터가 빌드 전에 잡지만 이중 방어) |
| 읽기 전용 | 반환 객체를 수정하지 않는다. 필요한 변경은 상태 오버레이에 |
| 순서 | `items`는 파일 로드 순서가 아니라 `ts`·ID로 안정 정렬 |
| 조건식 | 화이트리스트 파서. `eval` 금지 |
| 실패 | `hydrateContent` 실패 시 [ERROR_HANDLING](../05-quality/ERROR_HANDLING.md) E-CONTENT |

### 4.1 빌드 인라인 형태

```html
<script>
window.__CONTENT__ = {
  "world": { "...": "..." },
  "items": [ { "id": "mail.taxi.0314", "...": "..." } ],
  "evidence": [ "..." ],
  "verify": [ "..." ],
  "traces": [ "..." ],
  "keywords": { "..." },
  "events": [ "..." ],
  "npc": [ "..." ],
  "endings": { "..." }
};
window.__BUILD__ = { "appVersion": "6.2.0", "contentVersion": "2026.11.1", "hash": "sha256:..." };
</script>
```

## 5. 디버그 API (`?debug=1`)

`debug/panel.js`가 `window.__debug`를 노출한다. **일반 모드에서는 존재하지 않는다.**

| 메서드 | 시그니처 | 설명 |
|---|---|---|
| `state` | `state(): State` | 현재 상태 스냅샷(읽기 전용 복사) |
| `setClock` | `setClock(gameMin: number): void` | 게임 시각 이동 |
| `jumpTo` | `jumpTo(hhmm: string): void` | `"2026-03-18T08:00"` 형식 |
| `advance` | `advance(gameMin: number): void` | 시각 진행 + 스케줄러 flush |
| `openGate` | `openGate(gate: string): void` | 예: `G-03` |
| `setFlag` | `setFlag(flag: string, value: unknown): void` | 예: `F-REC`, `"synced"` |
| `setNpc` | `setNpc(npc: string, state: string): void` | 예: `"DH"`, `"DH-4"` |
| `fireEvent` | `fireEvent(evId: string, opts?: { force?: boolean }): void` | EV 강제 |
| `pending` | `pending(): { remote: object[]; traces: object[] }` | 대기열 |
| `flush` | `flush(): void` | 대기열 일괄 적용 |
| `showPanel` / `hidePanel` | `(): void` | 패널 |
| `seed` | `seed(n: number): void` | 지연 랜덤 시드 고정 |

### 5.1 패널 표시 항목

게임 시각, 배속, 온라인/비행기, 게이트, 플래그, NPC 상태, 대기열, 최근 이벤트 로그 20줄, 현재 SCR ID, DOM 노드 수.

### 5.2 디버그 진입

```text
dist/dontknow.html?debug=1
```

- URL 파라미터는 읽기만 한다. 게임 상태를 URL에 쓰지 않는다.
- `?debug=1`은 `window.__debug`와 `window.__game`을 함께 노출한다(테스트 편의).
- 배포 산출물에도 코드는 포함되지만, 파라미터가 없으면 비활성이다.

## 6. 테스트 훅 (`?test=1` 또는 `?debug=1`)

Playwright가 클릭·입력만으로 경로를 재현할 수 있게 한다. 테스트 훅은 게임 로직을 우회하지 않고 **같은 API를 호출**한다.

```js
window.__game = {
  ready: Promise<void>,
  state(): State,
  snapshot(): object,
  visible(app?: string): string[],
  log(): LogEntry[],
  scheduled(): object[],
  click(selector: string): Promise<void>,
  tap(selector: string): Promise<void>,
  longPress(selector: string, ms?: number): Promise<void>,
  type(selector: string, text: string): Promise<void>,
  submit(): Promise<void>,
  navigate(scrId: string): Promise<void>,
  back(): Promise<void>,
  openApp(appId: string): Promise<void>,
  setClock(gameMin: number): Promise<void>,
  advance(gameMin: number): Promise<void>,
  flushScheduler(untilGameMin: number): Promise<void>,
  setOnline(online: boolean): Promise<void>,
  setAirplane(on: boolean): Promise<void>,
  setAppSync(app: string, enabled: boolean): Promise<void>,
  fire(evId: string): Promise<void>,
  share(itemId: string, targetId: string): Promise<void>,
  ending(): string | null,
  disableAnimations(): void,
  reducedMotion(on: boolean): void,
  setSeed(n: number): void,
  reset(): Promise<void>
};
```

| 훅 | 규칙 |
|---|---|
| `ready` | 콘텐츠·세이브·첫 렌더가 끝나면 resolve |
| `click`/`tap` | 실제 포인터 이벤트를 디스패치한다. `element.click()`만 쓰지 않는다 |
| `type` | `composition` 없이 `input` 이벤트를 순차 발생. IME 테스트는 별도 |
| `setClock`/`advance` | `clock`·`scheduler`를 거친다. 상태를 직접 쓰지 않는다 |
| `fire` | `scheduler`를 거쳐 `ev.fire`를 발행한다 |
| `share` | 공유 시트와 같은 `action.share`를 발행한다 |
| `ending` | `null` 또는 `'A'|'A2'|'B'|'C'|'D'` |
| `disableAnimations` | CSS transition 0ms. 테스트 전용 |
| `reset` | 저장을 지우고 새 게임 |

### 6.1 Playwright 예

```js
await page.goto('/dist/dontknow.html?test=1');
await page.evaluate(() => window.__game.ready);
await page.evaluate(() => window.__game.setClock(0));
await page.evaluate(() => window.__game.click('[data-key="lock-keypad"]'));
await page.evaluate(() => window.__game.type('[data-key="lock-input"]', '070921'));
await page.evaluate(() => window.__game.submit());
const visible = await page.evaluate(() => window.__game.visible('talk'));
if (!visible.includes('talk.dad')) throw new Error('아빠 톡방이 보이지 않는다');
```

## 7. 오류 API

```js
window.__errors = {
  list(): ErrorEntry[],
  clear(): void,
  last(): ErrorEntry | null
};
```

```json
{ "code": "E-SAVE-QUOTA", "message": "저장 공간이 부족합니다.", "at": "2026-11-08T10:31:00.000Z", "context": { "slot": "auto", "bytes": 524288 }, "recoverable": true }
```

- 오류 코드·화면 문구·복구 정책은 [ERROR_HANDLING](../05-quality/ERROR_HANDLING.md)가 단일 출처다.
- `__errors`는 메모리 링버퍼(최근 50개)다. 네트워크로 보내지 않는다.

## 8. 버전·호환

| 항목 | 규칙 |
|---|---|
| `window.__API_VERSION` | 정수. 내부 API 깨는 변경 시 +1 |
| 이벤트 이름 | 추가는 가능. 삭제·의미 변경은 버전 증가 |
| 페이로드 | 필드 추가는 가능. 필수 필드 제거·타입 변경은 버전 증가 |
| 세이브 | [DATABASE_SCHEMA](./DATABASE_SCHEMA.md) 4.4 마이그레이션 |
| 테스트 훅 | 릴리스마다 유지. 제거 시 테스트 전부 수정 |

## 확인 사항

- `Q-OPEN-T14`: `action.input`의 `via` 값(`suggested`/`typed`/`share`)은 [COMPOSER](../03-features/MESSAGING_SPECIFICATION.md) 작성창 명세와 일치해야 한다. 다른 작성자가 `share`를 별도 이벤트로만 쓰면 이 표를 조정한다.
- `Q-OPEN-T15`: `?debug=1`·`?test=1`에서 테스트 훅을 노출하는 것은 배포 산출물에도 코드가 남는다는 뜻이다. 악용 위험은 없지만(1인용·로컬), "디버그 코드 제거 빌드"를 별도로 만들지는 [DEPLOYMENT_ARCHITECTURE](../05-quality/DEPLOYMENT_ARCHITECTURE.md)에서 결정해야 한다(추천: 제거하지 않음, 파라미터 게이트만).
- `Q-OPEN-T16`: `ev.fire`의 `actions` 배열은 `events.json`의 `do`를 그대로 담는다. `do` 액션 이름이 03-features·[PROGRESSION_AND_ENDINGS](../01-product/PROGRESSION_AND_ENDINGS.md)와 다르면 [DATABASE_SCHEMA](./DATABASE_SCHEMA.md) 3.8을 고친다.
