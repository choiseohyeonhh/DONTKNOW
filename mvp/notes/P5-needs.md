# P5 통합 메모 — S13 / endings가 가정한 것들

작성 범위: `mvp/js/content/S13.js`, `mvp/js/content/endings.js`.
두 파일은 **기존 엔진 파일을 고치지 않는다**는 전제로, 없는 기능은 로컬 헬퍼·CSS 주입·`localStorage`로 우회했다. 아래는 통합자가 엔진/세션에 추가하거나 맞춰 줘야 하는 것들이다.

## 1. 스크립트 로드 순서

`index.html`에 아래 순서로 추가해야 한다.

```html
<script src="js/content/S13.js"></script>
<script src="js/content/endings.js"></script>
```

- 둘 다 엔진(`window.__game`) 로드 뒤여야 한다.
- `endings.js`는 `window.__game.resolveEnding`을 **추가**한다(엔진에 원래 없음). S13 마지막에 이 함수를 호출한다.
- `S13.js`는 `window.startS13()`을, `endings.js`는 `window.resolveEnding()` / `window.DKEndings`를 노출한다.
- `mvp/endings.css`는 링크하지 않아도 된다. 두 JS가 같은 규칙을 `<style>`로 주입한다. 링크를 추가하면 중복 적용만 되고 동작은 같다. 단일 HTML 빌드에서는 JS 주입본을 쓰는 쪽이 안전하다.

## 2. 없는 엔진 훅 (추가 권장)

### 2.1 `lockPhone(locked: boolean)` / `S.phoneLocked`

- 현재 엔진에는 대면 장면에서 폰 버튼을 숨기거나 폰 전체를 잠그는 상태가 없다. `sceneHTML()`은 항상 `<button class="phonebtn" data-act="phoneUp">폰</button>`을 렌더한다.
- 현재 우회: `S.unlocked = false`, `body.classList.add('dk-s13-lock')`, 주입 CSS로 `.scene .phonebtn`, `.scene-back`, `.homeind`를 숨김.
- 엔진에 넣는다면:
  - `lockPhone(true)` → `S.phoneLocked = true`; `sceneHTML()`이 폰 버튼을 렌더하지 않음; `act('phoneUp')` 무시; `act('unlock')`/홈 인디케이터 무시; `S.ov`·배너·넛지도 S13 동안 차단.
  - `lockPhone(false)` → 해제.
- S13은 폰 잠금 해제를 `finishS13()`에서 한다.

### 2.2 `addArrive(placeId, fn)` — 장소당 복수 도착 핸들러

- 현재 `onArrive(id, fn)`는 `ARRIVE[id] = fn`이라 **마지막 등록이 이전 등록을 덮어쓴다**.
- S12가 `onArrive('parking', ...)`를 등록하고 S13도 등록하면 로드 순서에 따라 하나가 사라진다.
- 권장: `onArrive`를 배열로 바꾸거나 `addArrive(id, fn)` 추가. 또는 S12가 주차장 도착 시 직접 `window.startS13('arrive')`를 호출하고 `onArrive('parking')`을 중복 등록하지 않기.
- `defCine('CN-05')`도 S12가 정의하면 S13 정의가 덮어쓴다. S13이 마지막 로드되면 S13 정의(1컷, 23:00, 자막)가 이긴다. 통합 시 하나만 남겨라.

### 2.3 `meta.endingsSeen` / `markEndingSeen(id)`

- MVP 상태에는 `meta`가 없고 세이브도 `know/flags/v/destinations`만 저장한다.
- 현재 우회: `localStorage['dontknow.mvp.endingsSeen'] = ['A'|'B'|'C'|'D']` (중복 없이 push).
- S14 공통 사양의 “메타 `endingsSeen` 추가”를 엔진 세이브에 넣으려면:
  - `S.meta = { endingsSeen: [] }` (또는 동등)
  - `markEndingSeen(endingId)` → 중복 없이 추가 + `saveCheckpoint()`에 포함.
  - `playEnding()` 마지막에 호출하면 된다.

### 2.4 체크포인트 S1~S14 해금

- 현재 `saveCheckpoint()`는 단일 체크포인트만 저장한다. S14 공통 사양의 “체크포인트 S1~S14 해금”을 구현할 훅이 없다.
- S13/endings는 `S.sessionDone.S13 = true`, `S.sessionDone.S14 = true`만 세팅한다. 실제 타이틀 [이어하기]/디버그 점프 해금은 엔진이 `sessionDone`을 세이브에 포함하고 읽어야 한다.
- 권장: `saveCheckpoint()` 스냅샷에 `sessionDone` 포함, `unlockCheckpoint(sessionId)` 추가.

### 2.5 분기 코드 저장 위치 (선택)

- `endings.js`의 A 후일담은 아래 우선순위로 분기 코드를 읽는다.
  1. `S.v.branchA` / `S.v.branchB`
  2. `S.v.branch_A` / `S.v.branch_B`
  3. `S.branch.A` / `S.branch.B`
  4. 위가 없으면 플래그·K에서 직접 재계산
- S12 구현이 다른 이름(`S.v.aCode` 등)을 쓴다면 위 1~3 중 하나로 맞춰 주거나, 4번 재계산에 필요한 플래그를 정확히 세팅해야 한다.
  - A-1: `K-17 && K-22 && KX-21 && FX-06 && !F-01`
  - B-1: `F-02b`
  - B-2: `F-02`
- S13은 `S.v.s13_choice`(1~4), `S.v.s13_code`(`D-1`/`D-2`/`D-3`/`D-C`), `S.v.s13_probe_count`를 세팅한다.
- S12는 0091에 건 횟수를 `S.v.hyung_0091_calls`에 누적해야 한다. S13 1단계 첫 대사 “전화 많이 하셨더라고요.”가 이 값을 읽는다.

## 3. CHOICE 메타데이터 (선택)

- ①을 “다른 선택지보다 3배 높이” 렌더하기 위해 엔진 선택지에 높이/클래스 메타가 없다.
- 현재 우회: `①` 노출 조건(`K-19 && K-20`)일 때 `body.s13-choice1`을 켜고, `body.s13-choice1 .scene .choices button:first-child`에 `min-height:152px; white-space:pre-line`을 적용. ①이 항상 첫 번째 옵션이라 성립한다.
- 엔진에 넣는다면 `CHOICE` 옵션에 `{ tall: true }` 또는 `{ cls: 'tall' }`을 허용하고 `sceneHTML()`이 버튼에 클래스를 붙이면 더 견고하다.

## 4. 세션 문서에서 온 가정

- `F-03`, `F-04`, `F-05`, `F-06`, `F-01`, `F-02`, `F-02b`, `FX-03`, `FX-06`, `FX-07`은 이전 세션이 `S.flags`에 세팅한다.
- `K-08`, `K-10`, `K-17`, `K-18`, `K-19`, `K-20`, `K-21`, `K-22`, `KX-05`, `KX-09`, `KX-21`은 이전 세션이 `S.know`에 세팅한다.
- S13 1단계는 `v.s13_probe_count < 2`일 때만 탐색 선택지를 노출하고, 사용한 선택지는 `S13.probe01`~`probe04` 플래그로 숨긴다. `…`는 항상 노출된다.
- S13 동안 독백·넛지·리액티브 알림은 쓰지 않는다. 엔진 쪽에서 S13에 넣는 넛지가 있다면 제거해야 한다.

## 5. 사용한 이미지 (모두 `mvp/img/`에 존재)

`scene_parking_b3.jpg`, `scene_living_dawn.jpg`, `scene_police_front_morning.jpg`, `wall_sleeping_father.jpg`, `photo_family_2019.jpg`, `scene_interrogation_glass.jpg`, `scene_interrogation_glass_bplus.jpg`, `scene_morning_empty.jpg`, `scene_entrance_in_a.jpg`, `scene_living_table.jpg`, `scene_dohyun_room_newphone.jpg`.

## 6. 엔진 API 중 실제로 쓴 것 (참고)

`G.S`, `G.has`, `G.flag`, `G.grant`(간접), `G.setFlag`, `G.defDialogue`, `G.runDialogue`, `G.SAY`, `G.CHOICE`, `G.DO`, `G.WAIT`, `G.GOTO`, `G.LABEL`, `G.END`, `G.defCine`, `G.playCine`, `G.defPlace`, `G.defSession`, `G.onArrive`, `G.startSession`, `G.endSession`, `G.later`, `G.refresh`, `G.jump`, `G.clearGroup`, `G.visibleOpts`, `DATA.hangyeol`.

이 중 `resolveEnding`만 원래 없고 `endings.js`가 추가한다.
