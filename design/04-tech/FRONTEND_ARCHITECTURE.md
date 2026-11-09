# FRONTEND_ARCHITECTURE — game/ 모듈·라우팅·렌더링·입력

> **역할:** `game/` 폴더의 모듈 트리, 모듈별 책임과 공개 함수, 화면 스택 라우팅, morph 렌더링 규칙, CSS 구조, 포인터·제스처·키보드 입력 처리를 고정한다.
> **단일 출처:** 이 문서(프론트엔드 구조). 모듈 트리는 [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 2절을 **그대로** 옮겼다. 내부 API 시그니처의 규범은 [API_SPECIFICATION](./API_SPECIFICATION.md), 상태 키는 [STATE_MANAGEMENT](./STATE_MANAGEMENT.md), 토큰 값은 [DESIGN_TOKENS](../02-design/DESIGN_TOKENS.md)가 단일 출처다.
> **참조:** [SYSTEM_ARCHITECTURE](./SYSTEM_ARCHITECTURE.md), [SYSTEM_SHELL_SPECIFICATION](../03-features/SYSTEM_SHELL_SPECIFICATION.md), [NAVIGATION_ARCHITECTURE](../02-design/NAVIGATION_ARCHITECTURE.md), [COMPONENT_SPECIFICATIONS](../02-design/COMPONENT_SPECIFICATIONS.md), [INTERACTION_SPECIFICATIONS](../02-design/INTERACTION_SPECIFICATIONS.md), [ACCESSIBILITY](../02-design/ACCESSIBILITY.md).
> **적용 버전:** v6.2 (2026-11). 외부 프레임워크·번들러·CSS 라이브러리를 쓰지 않는다.

## 1. 모듈 트리 ([SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 2절 그대로)

```text
game/
  index.html
  css/           os.css  apps/*.css  tokens.css
  js/
    core/
      state.js        단일 상태 트리, 변경 API, 이벤트 로그
      clock.js        게임 시계(실시간×4 — v6.2, 일시정지 메뉴에서만 정지, 접근성 모드)
      scheduler.js    EV 예약·조건 재평가·오프라인 대기열
      net.js          온라인/오프라인·동기화 적용(원격 삭제·지우기, 앱별 동기화 스위치, 다른 기기 기록 유입)
      trace.js        흔적(TR) 기록·전송 대기열 → 반응 트리거([TRACES_AND_REACTIONS](../01-product/TRACES_AND_REACTIONS.md))
      visibility.js   "지금 이 항목이 보이는가" 판정(층·온라인·삭제·게이트)
      search.js       전역 검색 색인(접근 가능 항목만)
      morph.js        DOM 패치
      save.js         자동 저장·슬롯·버전 마이그레이션
    os/
      shell.js        잠금화면·홈·상태바·제어 센터·알림·검색 UI
      apps/*.js       앱 30종([FEATURE_SPECIFICATION](../01-product/FEATURE_SPECIFICATION.md)). 설정은 apps/settings/*.js 하위 메뉴 분리([SETTINGS_SPECIFICATION](../03-features/SETTINGS_SPECIFICATION.md)). 카메라는 방 구도 뷰어
      composer.js     작성창: 추천 문장·직접 입력·공유 첨부·텍스트 대치·클립보드 칩
    verify/
      verify.js       행동 증명(V) 감지: 입력·검색·공유·설정·호출 이벤트를 V 정의와 대조([ACTION_PROOF](../01-product/ACTION_PROOF.md)). 화면에 아무것도 띄우지 않는다
      keywords.js     직접 입력 낱말 사전([ACTION_PROOF](../01-product/ACTION_PROOF.md) 3절), 표기 변형 정규화
      hints.js        일시정지 메뉴 "막혔을 때"([PROGRESSION_AND_ENDINGS](../01-product/PROGRESSION_AND_ENDINGS.md) 7절)
    npc/
      dialogue.js     (인물, 상태, 입력[공유 E-ID | 추천 문장 | 사전 낱말 | 흔적 TR]) → 응답 표 실행, 지연 시간([TRACES_AND_REACTIONS](../01-product/TRACES_AND_REACTIONS.md) 4절)
    story/
      endings.js      [PROGRESSION_AND_ENDINGS](../01-product/PROGRESSION_AND_ENDINGS.md) 6.4 판정 + 시네마틱 재생
    debug/
      panel.js        ?debug=1: 시각 이동, 게이트 열기, 플래그, EV 강제 발생
  content/
    world.json        인물·계정·기기·장소
    items/*.json      앱별 항목(메시지·사진·메일·거래…)
    evidence.json     E-xx ↔ 항목 매핑
    verify.json       V-xx 정의(받는 입력, 근거, 결과)
    traces.json       TR-xx 정의(행동 → 보는 사람 → 반응 EV/상태)
    keywords.json     낱말 사전
    events.json       EV 정의
    npc/*.json        대화 표
    endings.json
  img/  fonts/
  tools/
    build.py          단일 HTML 빌드
    lint_content.py   ID 참조·앎 매트릭스·타임라인 검사
  tests/
    route_a.js route_a2.js route_b.js route_c.js route_d.js crisis.js traces.js moved.js
```

- 새 모듈 파일을 추가하지 않는다. 콘텐츠 로더·부트스트랩은 `core/state.js`의 공개 함수로 둔다(모듈 트리 고정).
- `apps/*.js`의 파일명은 앱 ID와 같게 쓴다: `talk.js`, `loop.js`, `blink.js`, `mail.js`, `photo.js`, `camera.js`, `map.js`, `find.js`, `contacts.js`, `calendar.js`, `note.js`, `reminder.js`, `voice.js`, `clockapp.js`, `weather.js`, `health.js`, `wallet.js`, `bank.js`, `taxi.js`, `file.js`, `wave.js`, `tube.js`, `moa.js`, `hankki.js`, `market.js`, `portal.js`, `calc.js`, `settings.js`(설정 하위 메뉴는 `apps/settings/*.js`). `clock.js`는 코어 시계와 충돌하므로 앱 파일은 `clockapp.js`로 한다.

## 2. 모듈별 책임과 공개 함수

> 시그니처는 요약이다. 페이로드 스키마와 이벤트 목록의 규범은 [API_SPECIFICATION](./API_SPECIFICATION.md) 2~5절.

### 2.1 `core/state.js`

책임: 단일 상태 트리, 커밋/트랜잭션, 이벤트 버스, append-only 이벤트 로그, 콘텐츠 부트스트랩.

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `hydrateContent` | `hydrateContent(raw: object): ContentIndex` | 빌드 인라인 `window.__CONTENT__`를 인덱싱한다. 없으면 오류 |
| `getContent` | `getContent(): ContentIndex` | 읽기 전용 콘텐츠 인덱스 |
| `createState` | `createState(initial?: object): State` | 초기 상태 트리 생성 |
| `getState` | `getState(): State` | 읽기 전용 참조(직접 변경 금지) |
| `select` | `select<T>(path: string): T` | 경로 조회. 파생 값은 재계산 |
| `commit` | `commit(mutator: (draft: State) => void, meta: CommitMeta): void` | 동기 커밋. 커밋 후 이벤트 발행·로그 기록 |
| `transaction` | `transaction(fn: (draft: State) => void, meta: CommitMeta): void` | 여러 커밋을 한 번의 렌더로 묶는다 |
| `subscribe` | `subscribe(event: string, handler: (payload: object) => void): () => void` | 이벤트 구독. 해제 함수 반환 |
| `emit` | `emit(event: string, payload: object): void` | 코어/규칙 모듈 전용. UI는 원칙적으로 발행하지 않는다 |
| `getLog` | `getLog(fromSeq?: number): LogEntry[]` | 이벤트 로그 조회 |
| `replayTo` | `replayTo(seq: number): State` | 디버그 전용 재생 |
| `resetState` | `resetState(reason: string): void` | 새 게임/디버그 리셋 |

### 2.2 `core/clock.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `startClock` | `startClock(): void` | rAF 루프 시작. 이미 시작됐으면 무시 |
| `stopClock` | `stopClock(): void` | 루프 정지(언로드·디버그) |
| `pauseClock` | `pauseClock(reason: 'menu' \| 'cinematic' \| 'hidden'): void` | 사유별 정지. 여러 사유는 카운트로 관리 |
| `resumeClock` | `resumeClock(reason): void` | 해당 사유 해제 |
| `getGameMin` | `getGameMin(): number` | 시작 이후 경과 게임 분(정수) |
| `formatClock` | `formatClock(gameMin: number): string` | `"3월 17일 화요일 21:10"` 형식 |
| `onMinute` | `onMinute(cb: (gameMin: number) => void): () => void` | 게임 분 경계 콜백. 스케줄러가 구독 |
| `setGameMin` | `setGameMin(gameMin: number): void` | `?debug=1` 전용. 일반 모드에서 호출하면 무시 |

### 2.3 `core/scheduler.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `loadEvents` | `loadEvents(events: EventDef[]): void` | `events.json` 인덱싱 |
| `schedule` | `schedule(evId: string, atGameMin: number, opts?: object): void` | 절대 시각 예약 |
| `scheduleAfter` | `scheduleAfter(evId: string, anchor: string, plusGameMin: number): void` | `T`·`EV-06` 등 기준 상대 예약 |
| `tick` | `tick(gameMin: number): void` | 분 경계 평가. 조건 재평가·대기열 트리거 |
| `reschedule` | `reschedule(reason: string): void` | 플래그·게이트 변화 후 재평가 |
| `getScheduled` | `getScheduled(): ScheduledEvent[]` | 디버그·테스트용 |
| `flush` | `flush(untilGameMin: number): void` | 디버그·테스트 전용 즉시 진행 |

### 2.4 `core/net.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `isOnline` | `isOnline(): boolean` | `wifi && !airplane` |
| `setOnline` | `setOnline(online: boolean, reason: string): void` | 온라인 전환. 전환 시 `applySync()` |
| `applySync` | `applySync(): SyncResult` | [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 4.2 순서 적용 |
| `queueRemote` | `queueRemote(action: RemoteAction): void` | 원격 삭제·지우기·알림을 대기열에 넣는다 |
| `flushRemote` | `flushRemote(): SyncResult` | 대기열 일괄 적용 |
| `flushUploads` | `flushUploads(): SyncResult` | 이 폰의 대기 변경 업로드 |
| `getSyncState` | `getSyncState(): NetState` | 동기화 점·마지막 동기화 시각 |
| `setAppSync` | `setAppSync(app: string, enabled: boolean): void` | 설정 > 시러스 ID > 동기화 스위치 |

### 2.5 `core/trace.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `loadTraces` | `loadTraces(traces: TraceDef[]): void` | `traces.json` 인덱싱 |
| `emitTrace` | `emitTrace(trId: string, ctx: TraceContext): void` | 같은 TR은 1회만([TRACES_AND_REACTIONS](../01-product/TRACES_AND_REACTIONS.md) 6절). 대기열에 넣는다 |
| `flushTraces` | `flushTraces(): void` | 온라인 시 대기 흔적 전송 |
| `getTraceState` | `getTraceState(trId: string): TraceState` | `firedAt`, `pending`, `sent` |
| `tracesFor` | `tracesFor(owner: string): TraceState[]` | 인물별 흔적 조회 |

### 2.6 `core/visibility.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `isVisible` | `isVisible(itemId: string): boolean` | [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 4.1 공식 |
| `visibleItems` | `visibleItems(filter?: { app?: string; kind?: string; gate?: string }): Item[]` | 접근 가능 항목만 |
| `visibleApps` | `visibleApps(): string[]` | 열 수 있는 앱 |
| `canOpenScreen` | `canOpenScreen(scrId: string): boolean` | 화면 진입 가능 여부(잠금·게이트) |
| `getCache` | `getCache(): Record<string, true>` | T2 캐시된 항목 ID |

### 2.7 `core/search.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `buildIndex` | `buildIndex(): void` | 접근 가능 항목만 색인 |
| `search` | `search(query: string, opts?: { limit?: number }): SearchGroup[]` | 앱별 그룹 결과 |
| `invalidate` | `invalidate(itemId?: string): void` | 삭제·동기화 후 재색인 |
| `suggest` | `suggest(): string[]` | 최근 동기화로 새 데이터가 들어온 앱 3개 |

### 2.8 `core/morph.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `morph` | `morph(parent: Element, html: string): void` | 키 기반 패치. 전체 교체 금지 |
| `patch` | `patch(selector: string, html: string): void` | 특정 컨테이너만 패치 |
| `preserveScroll` | `preserveScroll(parent: Element): () => void` | `data-keep` 스크롤 저장·복원 |
| `setHtmlOnce` | `setHtmlOnce(parent: Element, html: string): void` | 최초 마운트/앱 전환 전용 |

### 2.9 `core/save.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `autosave` | `autosave(reason: AutosaveReason): void` | 접근 해제·EV·공유·메일 발송 시 |
| `saveToSlot` | `saveToSlot(slot: 1 \| 2 \| 3): SaveResult` | 수동 슬롯 |
| `loadSlot` | `loadSlot(slot: 1 \| 2 \| 3): LoadResult` | 슬롯 불러오기 |
| `loadAuto` | `loadAuto(): LoadResult` | 자동 저장 불러오기 |
| `listSlots` | `listSlots(): SlotMeta[]` | 시각·게임 시각·엔딩 여부 |
| `migrate` | `migrate(raw: object): { state: State; warnings: string[] }` | 버전 마이그레이션 |
| `exportSave` | `exportSave(): string` | 디버그·테스트용 JSON |
| `importSave` | `importSave(json: string): LoadResult` | 디버그·테스트용 |

### 2.10 `os/shell.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `mountShell` | `mountShell(root: Element): void` | 셸 마운트·이벤트 위임 |
| `renderShell` | `renderShell(state: State): void` | 셸 레이어 렌더(morph) |
| `navigate` | `navigate(scrId: string, params?: object, opts?: NavOptions): void` | 앱 스택 push |
| `replace` | `replace(scrId: string, params?: object): void` | 현재 화면 교체 |
| `back` | `back(): void` | 스택 pop. 홈이면 무시 |
| `home` | `home(): void` | 스택 비우기 |
| `openSheet` | `openSheet(cmpId: string, props: object): void` | 공유 시트·정보(i) 등 |
| `closeSheet` | `closeSheet(): void` | 시트 닫기 |
| `showBanner` | `showBanner(notificationId: string): void` | 상단 배너 |
| `openControlCenter` | `openControlCenter(): void` | 제어 센터 |
| `openSearch` | `openSearch(query?: string): void` | 전역 검색 |
| `showPauseMenu` | `showPauseMenu(): void` | 일시정지 메뉴 |

### 2.11 `os/apps/*.js` 공통 계약

각 앱 모듈은 다음 형태의 객체를 named export `app`으로 내보낸다. 앱별 추가 공개 함수는 그 아래에 둔다.

```js
/** @typedef {{
 *   id: string,
 *   screens: Record<string, (props: object, state: object) => string>,
 *   mount?: (ctx: AppContext) => void,
 *   onAction?: (action: AppAction, ctx: AppContext) => void,
 *   onBack?: (ctx: AppContext) => boolean
 * }} AppModule
 */
export const app = { id: 'talk', screens: {}, mount, onAction, onBack };
```

| 파일 | 책임 | 앱별 공개 함수(예) |
|---|---|---|
| `talk.js` | 친구/채팅/더보기, 방·서랍·검색·설정 | `openRoom(roomId)`, `markRead(roomId)`, `openDrawer(roomId)` |
| `loop.js` | 홈/탐색/만들기/활동/프로필, 게시물·스토리·DM | `openFeed(tab)`, `openPost(postId)`, `viewStory(accountId)`, `searchLoop(q)` |
| `blink.js` | 실장K 비밀 대화 1개, 60초 삭제·캡처 감지 | `openSecretRoom()`, `markBlinkRead()`, `captureBlink()` |
| `mail.js` | 2계정·폴더·예약 메일·첨부 | `openMailbox(account)`, `openMail(id)`, `editScheduledMail(patch)` |
| `photo.js` | 앨범·정보(i)·버스트·원본 복귀·숨김 | `openAlbum(albumId)`, `openPhoto(id)`, `restoreOriginal(id)` |
| `camera.js` | 4구도 뷰어, 서랍 열기, 촬영 | `setComposition(id)`, `openDrawer()`, `capture()` |
| `map.js` | 저장·최근·경로·사진 레이어 | `searchPlace(q)`, `routeBetween(from,to)` |
| `find.js` | 기기 목록·소리·분실 모드·기기 지우기 | `playSound(deviceId)`, `wipeDevice(deviceId)` |
| `settings.js` | 19개 메뉴·설정 검색 | `openSetting(path)`, `setToggle(path, value)` |
| 나머지 | [FEATURE_SPECIFICATION](../01-product/FEATURE_SPECIFICATION.md)의 앱별 기능 | 각 앱의 주 행동 1~3개 |

### 2.12 `os/composer.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `openComposer` | `openComposer(target: ComposerTarget): void` | 대상(톡·메시지·DM·메일·블링크) |
| `closeComposer` | `closeComposer(): void` | 초안 유지 |
| `insertText` | `insertText(text: string): void` | 커서 위치 삽입 |
| `attach` | `attach(itemId: string): void` | 공유 첨부 |
| `submit` | `submit(): void` | 행동 이벤트 발행(`action.input`/`action.share`) |
| `applyTextReplacement` | `applyTextReplacement(text: string): string` | 텍스트 대치 적용 |
| `getSuggestions` | `getSuggestions(target: ComposerTarget): string[]` | 상대별 고정 추천 문장 |

### 2.13 `verify/verify.js`·`verify/keywords.js`·`verify/hints.js`

| 모듈 | 공개 함수 | 설명 |
|---|---|---|
| `verify.js` | `loadVerify(defs)`, `evaluate(event: ActionEvent): VerifyHit[]`, `getVerifyState(vId)` | V 대조. UI 없음 |
| `keywords.js` | `normalize(text)`, `match(text, opts)`, `getDictionary()` | 조사·띄어쓰기·대소문자·하이픈 무시 |
| `hints.js` | `getHint(goalIndex: number, step: 1\|2\|3): string` | [PROGRESSION_AND_ENDINGS](../01-product/PROGRESSION_AND_ENDINGS.md) 7절 |

### 2.14 `npc/dialogue.js`·`story/endings.js`

| 모듈 | 공개 함수 | 설명 |
|---|---|---|
| `dialogue.js` | `loadNpcTables(tables)`, `resolve(npc, state, input): Reply`, `scheduleReply(reply)`, `applyReply(reply)` | 입력 우선순위는 [PROGRESSION_AND_ENDINGS](../01-product/PROGRESSION_AND_ENDINGS.md) 5절 |
| `endings.js` | `resolveEnding(state): EndingId`, `playEnding(id)`, `getEpilogue(id)` | [PROGRESSION_AND_ENDINGS](../01-product/PROGRESSION_AND_ENDINGS.md) 6.4 순서 |

### 2.15 `debug/panel.js`

| 공개 함수 | 시그니처 | 설명 |
|---|---|---|
| `mountDebug` | `mountDebug(): void` | `?debug=1`일 때만 |
| `togglePanel` | `togglePanel(): void` | 패널 표시 |
| `isDebug` | `isDebug(): boolean` | URL 파라미터 검사 |

## 3. 라우팅 — 셸 레이어와 앱 내비 스택

### 3.1 두 레이어

| 레이어 | 화면 | 상태 키 | 전환 |
|---|---|---|---|
| 셸(shell) | `SCR-OS-LOCK`, `SCR-OS-PASSCODE`, `SCR-OS-EMERGENCY`, `SCR-OS-HOME`, `SCR-OS-FOLDER`, `SCR-OS-SEARCH`, `SCR-OS-NOTIF-CENTER`, `SCR-OS-CONTROL-CENTER`, `SCR-OS-APP-SWITCHER`, `SCR-OS-SHARE-SHEET`, `SCR-OS-INFO-PANEL`, `SCR-OS-COMPOSER`, `SCR-OS-SYSTEM-ALERT`, `SCR-PAUSE-MENU`, `SCR-PAUSE-HINT`, `SCR-PAUSE-SETTINGS`, `SCR-PAUSE-SAVE`, `SCR-CINE-PROLOGUE`, `SCR-CINE-ENDING` | `ui.shell` | 셸 화면끼리 160ms fade, 시네마틱 350ms |
| 앱(app) | `SCR-<AREA>-<NAME>` (예: `SCR-TALK-ROOM`, `SCR-LOOP-FEED`) | `ui.stack[]` | push 350ms ease-sheet, pop 역방향 |
| 시트(sheet) | `CMP-SHEET`, `CMP-SHARE-SHEET`, `CMP-INFO-PANEL` | `ui.sheet` | 350ms ease-sheet |
| 배너(banner) | `CMP-NOTIFICATION-CARD` | `ui.banner` | 4초 표시 |

- **SCR- ID의 단일 출처는 [NAVIGATION_ARCHITECTURE](../02-design/NAVIGATION_ARCHITECTURE.md)다.** 이 문서는 이름 규칙(`SCR-<영역>-<이름>`)과 스택 동작만 정의하고 화면 목록을 새로 만들지 않는다.
- 컴포넌트 ID(`CMP-*`)의 단일 출처는 [COMPONENT_SPECIFICATIONS](../02-design/COMPONENT_SPECIFICATIONS.md)다.

### 3.2 스택 자료 구조

```json
{
  "ui": {
    "shell": "SCR-OS-HOME",
    "stack": [
      { "scr": "SCR-TALK-CHATS", "app": "talk", "params": {}, "scroll": "talk.list", "transition": "push" },
      { "scr": "SCR-TALK-ROOM", "app": "talk", "params": { "roomId": "dad" }, "scroll": "talk.room.dad" }
    ],
    "sheet": null,
    "banner": null,
    "navLocked": false
  }
}
```

| 동작 | 규칙 |
|---|---|
| `navigate(scr)` | 스택 맨 위에 push. 같은 SCR이면 `replace`로 처리(중복 방지) |
| `replace(scr)` | 맨 위 교체. 뒤로가기 기록을 늘리지 않는다 |
| `back()` | 맨 위 pop. 스택이 비면 홈. `navLocked`면 무시 |
| `home()` | 스택 비우고 `SCR-OS-HOME` |
| 탭 전환 | 앱 내부 하단 탭은 스택을 쌓지 않고 `ui.apps[app].tab`만 바꾼다 |
| 시트 | 스택과 별도 레이어. 뒤로가기는 시트 닫기 우선 |
| 브라우저 뒤로가기 | 부팅 시 `history.pushState` 1회, `popstate`에서 `back()` 호출. 홈에서 뒤로가면 무시하고 다시 push |
| 딥 링크 | 일반 모드 없음. `?debug=1&scr=SCR-...`만 디버그 진입 허용 |

### 3.3 전환 규칙

| 전환 | 시간·곡선 | 비고 |
|---|---|---|
| 화면 push | 350ms `ease-sheet` | 오른쪽에서 슬라이드 |
| 화면 pop | 350ms `ease-sheet` 역방향 | 왼쪽 가장자리 밀기와 동일 |
| 시트 | 350ms `ease-sheet` | 아래에서 올라옴 |
| 탭 전환 | 160ms fade | 스택 없음 |
| reduced motion | 150ms fade | 이동 없음 |

- 전환 중 입력은 `navLocked`로 1회만 허용한다. 연타로 스택이 꼬이지 않게 한다.
- 앱 전환은 전체 다시 그리기를 허용하는 **유일한** 경우다(`setHtmlOnce`). 그 외에는 `morph`만.

## 4. 렌더링 규칙

### 4.1 morph

1. 렌더 함수는 **상태 → HTML 문자열**만 만든다. DOM을 직접 조작하지 않는다.
2. `morph(parent, html)`은 `data-k` 키가 같은 노드를 재사용한다. 키가 없으면 순서 기반 비교를 하지 않고 교체한다.
3. 리스트 행은 반드시 `data-k="row-<안정 ID>"`를 준다. 인덱스 키(`row-0`) 금지.
4. `data-keep="<scrollKey>"`가 있는 스크롤 컨테이너는 패치 전 `scrollTop`을 저장하고 패치 후 복원한다.
5. `input`·`textarea`가 포커스면 해당 서브트리는 패치에서 제외하고, 값·선택 영역을 보존한다.
6. 이미지 `src`가 바뀌지 않으면 건드리지 않는다(재디코딩 방지).

### 4.2 전체 다시 그리기 금지

| 허용 | 조건 |
|---|---|
| `setHtmlOnce` | 최초 마운트, 앱 전환, 엔딩 시네마틱 시작 |
| `morph` | 그 외 모든 상태 변화 |
| 행 단위 갱신 | 삭제·읽음·새 메시지·체크 변화 |

- 실시간 사건이 보고 있는 목록을 바꿀 때는 **해당 행만** 갱신한다. 예: 원격 삭제(EV-04) → `note.list`의 해당 행에 `is-deleting` 0.4초 페이드 → 행 제거. 목록 전체를 다시 만들지 않는다.
- 스크롤 위치는 항상 유지한다. 새 항목이 아래에 붙는 채팅은 `data-keep` + `autoBottom` 규칙(바닥에 있었을 때만 따라간다).

### 4.3 렌더 파이프라인

```text
state 커밋
  → 변경 경로 수집
  → rAF 마이크로배치
  → 현재 화면 렌더 함수 1회
  → morph(parent, html)
  → 스크롤·포커스 복원
  → CSS transition
```

- 한 프레임에 여러 커밋이 와도 렌더는 1회다.
- 렌더 중 상태를 바꾸지 않는다. 필요한 후속 변경은 `queueMicrotask`로 분리한다.

## 5. CSS 구조

```text
css/
  tokens.css     DESIGN_TOKENS 구현. :root(다크), [data-theme="light"], [data-type-scale]
  os.css         셸·공통 컴포넌트(CMP-*)·레이아웃·안전영역·모션
  apps/*.css     앱별 화면. 앱 ID와 파일명 일치
```

### 5.1 tokens.css

- [DESIGN_TOKENS](../02-design/DESIGN_TOKENS.md)의 모든 토큰을 `--lm-` 접두로 1:1 구현한다. 값을 이 문서에 복제하지 않는다.
- 기본은 **다크**(도현의 설정). `data-theme="light"`일 때 라이트 토큰으로 전환한다.
- 글자 배율은 `data-type-scale="xs|md|lg|xl"`로 `--lm-type-scale`을 바꾼다(0.85/1.0/1.15/1.3). `caption-2`는 최소 11px을 유지한다.
- 숫자는 `font-variant-numeric: tabular-nums`.
- 블러 미지원 시 `@supports`로 불투명 `--lm-bg-elevated` 대체.

### 5.2 os.css·apps/*.css

| 파일 | 포함 |
|---|---|
| `os.css` | 상태바·잠금화면·홈·앱 전환·알림·검색·제어 센터·시트·배너·일시정지 메뉴·공통 목록/버튼/입력(CMP-*) |
| `apps/talk.css` 등 | 해당 앱의 화면·행·말풍선·탭. 다른 앱 선택자 침범 금지 |

- 선택자 규칙: 앱 루트에 `data-app="<id>"`를 주고 `.app-talk .row`처럼 스코프한다.
- 레이아웃은 `flex`/`grid`, 고정 프레임 390×844. 데스크톱은 프레임을 화면 높이에 맞춰 0.75~1.25배.
- 안전영역: `env(safe-area-inset-top/bottom)`. 상태바 47, 내비게이션 바 44, 탭 바 49+34.
- 애니메이션은 `transform`·`opacity`만. `width`·`height`·`top` 애니메이션 금지.
- `prefers-reduced-motion: reduce` 또는 게임 설정 "동작 줄이기" 시 이동 없이 150ms 페이드.

## 6. 입력 처리

### 6.1 포인터 이벤트

- `pointerdown` / `pointermove` / `pointerup` / `pointercancel`만 쓴다. `touchstart`·`mousedown`을 따로 등록하지 않는다.
- 버튼·행은 이벤트 위임(`data-action`, `data-id`)으로 처리한다.
- 최소 터치 영역 44×44. 시각 크기가 작은 아이콘은 투명 히트 슬롭을 8px까지 허용하되 인접 요소와 겹치지 않게 한다.
- `touch-action: manipulation`으로 더블탭 확대를 막는다. 스크롤 컨테이너는 `overscroll-behavior: contain`.

### 6.2 제스처

| 제스처 | 판정 | 결과 |
|---|---|---|
| 탭 | `pointerup`까지 이동 <10px, <300ms | 열기/누르기 |
| 길게 누르기 | `pointerdown` 후 500ms 유지, 이동 <10px | 맥락 메뉴(공유·복사·정보(i)·앱별) |
| 두 번 탭 | 300ms 내 2회, 사진 게시물만 | 좋아요(TR-14) |
| 왼쪽 가장자리 밀기 | 시작 x<20px, 오른쪽으로 60px | 뒤로 |
| 홈 인디케이터 위로 | 하단 20px에서 위로 80px | 홈. 멈추면 앱 전환기 |
| 위로 끌기(홈) | 홈에서 위로 80px | 전역 검색 |
| 아래로 끌기(상단) | 상태바에서 아래로 80px | 알림 센터 |
| 오른쪽 위에서 끌기 | 우상단 40×40에서 아래로 | 제어 센터 |
| 두 손가락 벌리기 | 사진·영상 뷰어 | 확대(번호판·화이트보드 판독) |

- 제스처 충돌 시 우선순위: 시스템 제스처(홈·뒤로) > 시트 닫기 > 화면 스크롤 > 앱 제스처.
- iOS Safari의 가장자리 뒤로가기와 충돌하지 않도록, 앱 내 뒤로가기는 화면 왼쪽 상단 버튼도 항상 제공한다.

### 6.3 키보드·IME

- 작성창은 실제 `<textarea>`를 쓴다. `inputmode="text"`, `autocapitalize="off"`, `autocorrect="off"`, `spellcheck="false"`, `font-size: 16px` 이상(iOS 확대 방지).
- 한글 조합 중에는 `compositionstart`~`compositionend` 사이에 제출하지 않는다. `Enter` 제출은 `isComposing === false`일 때만.
- 추천 문장 줄은 탭하면 즉시 전송하지 않고 입력창에 넣는다. 전송은 별도 버튼.
- 클립보드 칩은 최근 복사 1개. 붙여넣기는 `navigator.clipboard.readText()` 실패 시 내부 클립보드 상태로 대체한다(외부 권한 요청 없음).
- 텍스트 대치는 입력 완료 시점에 `applyTextReplacement`로 적용한다.
- 데스크톱: 물리 키보드 입력 허용. `Esc`는 일시정지 메뉴, `←`는 뒤로(입력 포커스가 아닐 때).

### 6.4 포커스·접근성

- 모든 인터랙티브 요소는 포커스 가능하고 `aria-label` 또는 텍스트 라벨을 가진다.
- 시트·모달은 포커스 트랩, 닫기 버튼, `aria-modal="true"`.
- 아이콘만 있는 버튼은 `aria-label` 필수.
- 상태를 색만으로 전달하지 않는다(읽음·동기화·경고에 텍스트/글리프 병행).

## 확인 사항

- `Q-OPEN-T04`: 앱 모듈 30종의 파일명 중 시계 앱을 `clockapp.js`로 정했다. 다른 작성자가 화면·모듈 ID를 `clock.js`로 고정했다면 충돌한다. 총괄이 [NAVIGATION_ARCHITECTURE](../02-design/NAVIGATION_ARCHITECTURE.md)·구현 지시서와 대조해야 한다.
- `Q-OPEN-T05`: 길게 누르기 500ms, 두 번 탭 300ms, 뒤로 밀기 60px는 이 문서의 구현 기본값이다. [INTERACTION_SPECIFICATIONS](../02-design/INTERACTION_SPECIFICATIONS.md)가 다른 값을 확정하면 그쪽이 이긴다.
- `Q-OPEN-T06`: 브라우저 뒤로가기를 내부 스택에 연결하기 위해 `history.pushState`를 쓰는 설계다. 단일 HTML을 `file://`로 열 때 `history` 동작이 브라우저마다 다를 수 있으므로 실기기 확인이 필요하다.
