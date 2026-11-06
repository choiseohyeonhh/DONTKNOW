# P4 통합 메모 — S10 / S11 / S12 + 도현 폰

작성 범위: `mvp/js/oldphone.js`, `mvp/oldphone.css`, `mvp/js/content/S10.js`, `S11.js`, `S12.js`.
전제: 기존 파일은 고치지 않았다. 두 번째 기기와 P4 보조 UI는 **`#screen` 위에 레이어를 얹는 방식**으로 구현했고, 엔진에는 새 함수를 요구하지 않는다. 아래는 통합자가 해 줘야 하는 로드 순서와, 엔진에 정식으로 넣으면 좋을 훅이다.

## 1. 로드 순서 (필수)

`mvp/index.html`에 아래를 추가한다.

```html
<link rel="stylesheet" href="oldphone.css">
...
<script src="js/engine.js"></script>
<script src="js/oldphone.js"></script>
<script src="js/content/S01.js"></script>
...
<script src="js/content/S10.js"></script>
<script src="js/content/S11.js"></script>
<script src="js/content/S12.js"></script>
<script src="js/content/S13.js"></script>
<script src="js/content/endings.js"></script>
<script src="js/main.js"></script>
```

- `oldphone.js`는 반드시 S10/S11/S12보다 먼저. 세 파일이 `window.OldPhone`을 쓴다.
- S13/endings는 S12 뒤를 권장. S12가 `parking` 장소와 `onArrive('parking')`을 등록하지만, S13이 뒤에 로드되면 S13의 등록이 이긴다(정상). 반대 순서여도 S12의 핸들러가 `window.startS13`을 호출하므로 동작한다.
- `oldphone.css`는 `oldphone.js`가 없으면 `<link>`를 런타임 주입한다. 다만 **단일 HTML 빌드**에서는 `build.py`가 `oldphone.css`를 인라인하도록 `index.html`에 링크를 넣는 쪽이 안전하다.
- S10이 `CN-04`를 정의한다. 다른 파일이 CN-04를 정의하면 로드 순서에 따라 덮어쓴다. 하나만 남겨라.

## 2. 없는 엔진 훅 (정식 추가 권장)

현재는 전부 로컬 우회했다. 아래 시그니처로 엔진에 넣으면 content 파일이 직접 DOM/상태를 만지지 않아도 된다.

### 2.1 `showBanner(title, body, { id, kind, ms })` / `hideBanner()`

- 현재 우회: `S.banner = { title, body, id, kind }`를 직접 쓰고 `refresh()`. 숨김은 `S.banner.out = true` → 280ms 뒤 `S.banner = null`.
- 필요한 이유: S10의 `EV.S10.02`(한결 알림 띠)와 S12의 형 재착신 문자 "아버님, 받으세요."를 **메시지를 추가하지 않고** 띠로만 띄운다.
- 동작: `ms` 동안 표시, 탭 시 `onBannerTap(id, kind)` 호출. 기본 4200ms.

### 2.2 `ringIncoming({ name, from, onAccept, onDecline })` / `stopRinging()`

- 현재 우회: `S.ov = { type:'incoming', name, from }`, 수락은 `onAccept(fn)` 배열 훅, 거절은 document 캡처에서 `[data-act="decline"]`을 감시.
- 필요한 이유: S12의 준호 선착신(B-1)과 22:40 형 착신. 거절 후 20초 재착신(B-2/형)을 훅으로 처리하고 싶다.
- 동작: `onAccept`/`onDecline`을 인자로 받고, 거절 시 `S.ov`를 닫은 뒤 콜백.

### 2.3 `openDead(name, text, ms)` (엔진 내부 함수 export)

- 현재 우회: `S.call = { kind:'dead', name, state:'ring'|'dead', since, lines:[], deadText }` + `S.ov = { type:'call' }`를 직접 구성.
- 필요한 이유: S12 B-3 "준호에게 걸면 받지 않음", A-3 이후 유진 번호 "없는 번호".
- 동작: `openDead`는 이미 엔진 내부에 있다. `API`에 추가만 하면 된다.

### 2.4 `clearFlag(key)` 또는 `setFlag(key, false)`

- 현재: `setFlag`는 항상 `true`만 넣는다. `S12.junhoIncoming`, `S12.hyungRinging`을 소비 후 끄기 위해 `G.S.flags[key] = false`를 직접 대입한다.
- 동작: `clearFlag('S12.hyungRinging')` 또는 `setFlag(k, value)`.

### 2.5 앱 열기 인터셉트 `onAppOpen(appId, fn)`

- 현재 우회: S11 동안 document 캡처에서 `[data-act="open"][data-app="bank|photos|camera"]`를 잡아 `stopPropagation()` 후 자체 레이어를 띄운다.
- 필요한 이유: S11의 은행 상세(자동이체 800,000 · 5회 실패)와 채무조정 사진은 엔진의 정적 `bankHTML()`/`photosHTML()`로는 표현할 수 없다.
- 동작: `fn(el)`이 `true`를 반환하면 엔진의 기본 앱 열기를 건너뛴다. 세션 조건은 content가 판단.

### 2.6 사진 등록 / 배경화면 설정

- `addPhoto({ id, src, date, meta })` — S11의 `PH.f.debt_adjustment`, 카메라 촬영 `PH.f.cam_*`를 아버지 폰 사진첩에 정식 등록.
- `setWallpaper(photoId)` — `S.v.wallpaper = photoId`, `FX-07` 세팅, 잠금화면 배경 교체.
- 현재 우회: S11이 자체 사진 목록(`FATHER_PHOTOS`, `CAM_PHOTOS`)을 들고 자체 뷰어를 띄운다. 배경화면 설정은 `G.setFlag('FX-07'); G.S.v.wallpaper = id`.

### 2.7 두 번째 기기 등록

- `registerDevice({ id, label, onEnter, onLeave })`, `setDevice(id)`, `S.device`.
- 현재 우회: `oldphone.js`가 `#oldphone-layer`(z-index 44)와 `#op-tabs`(z-index 66)를 `#screen`에 직접 붙이고 `OP.device`로 관리한다. 엔진은 두 번째 기기를 모른다.
- 필요한 이유: S13에서 옛 폰 사용 금지, S12 자동 전환(아버지 폰), 엔딩별 옛 폰 행방.
- 동작: 기기 전환 시 0.4s 크로스페이드, 상태바/배터리/시간 표기 분기.

### 2.8 실시간 타이머 `laterReal(ms)`

- 현재 `later()`는 `?speed=N`으로 나뉜다. S11 종료 30초는 `?speed=20`에서 1.5초가 된다(테스트 편의).
- S10 PIN 10회 실패의 30초 입력 지연은 문서상 **실시간**이라 `Date.now()` 기준으로 구현했다. 테스트에서 기다리기 싫으면 `OldPhone.state.delayUntil = Date.now() - 1`로 해제할 수 있다.
- S11의 30초도 실시간이어야 한다면 `laterReal`을 추가하고 `S11.js`의 `G.later(30000, ...)`를 바꿔라.

## 3. 의존하는 기존 엔진 계약

아래는 이미 있거나 P1~P3에서 안정적으로 쓰이는 것들이다. 이름/동작이 바뀌면 P4가 깨진다.

- 상태: `S.phase`, `S.session`, `S.clock`, `S.place`, `S.unlocked`, `S.stack`, `S.ov`, `S.call`, `S.banner`, `S.mono`, `S.travel`, `S.flags`, `S.know`, `S.v`.
- 함수: `grant`, `has`, `flag`, `setFlag`, `later`, `clearGroup`, `startSession`, `endSession`, `refresh`, `showMono`, `addMsg`, `addContact`, `nowMsg`, `defCine`, `playCine`, `defDialogue`, `runDialogue`, `defPlace`, `registerDest`, `onArrive`, `onAccept`, `defSession`, `visibleOpts`, `choose`, `startTravel`, `endCall`, `SAY`, `CHOICE`, `DO`, `WAIT`, `GOTO`, `LABEL`, `END`.
- DOM/데이터 계약: `#screen`, `#root`, `#overlay`, `#cine`; `[data-act="open"][data-app]`, `[data-act="thread"][data-id]`, `[data-act="dial"][data-num]`, `[data-act="bannerTap"][data-id]`, `[data-act="accept"]`, `[data-act="decline"]`.
- 레이어 z-index: 옛 폰 44 < S11 45 < S10/S12 46 < 엔진 overlay 50 < 배너 60 < 시네마틱 80. 배너가 옛 폰 위로 보이도록 한 의도다.
- S13: `window.startS13`(있으면), `onArrive('parking')`, `CN-05`는 S13이 정의한다. S12는 `parking` 장소를 자체 정의하고 출발 시 `startTravel('parking')`을 호출한다.

## 3-1. P3 세션과의 접점

- S09는 귀가 후 `window.startS10()`을 호출한다(19:10). S10이 CN-04와 현관 봉투를 이어받는다.
- S07이 `F-02` / `F-02b`를 세팅하고, S05가 `F-03`, S08이 `KX-08`을 만든다. S12의 A/B 분기는 이 값을 그대로 읽는다.
- S11의 유진 스레드(KX-21)는 아버지 폰 S04가 아니라 **옛 폰 데이터**에서 획득한다. S12 A-1은 `K-17 && K-22 && KX-21 && FX-06 && !F-01`이다.
- S09가 `window.startS10`을 찾지 못하면 `G.startSession('S10')`으로 떨어지지만, S10.js가 로드돼 있어야 봉투 연출이 나온다.

## 4. 이번 구현이 직접 부여하는 K/플래그

| 트리거 | 부여 |
|---|---|
| 옛 폰 형 스레드 열기 | `K-21`, `K-22` |
| 형 스레드 최상단 스크롤 | `KX-20` |
| 준호 스레드 열기 | `KX-22` |
| 유진 스레드 열기 | `KX-21` |
| 초안 `[초안] 아빠, 나 사실...` 열기 | `KX-19` |
| 음성메모 "아빠한테" 끝까지 재생 | `K-19` |
| `MM.o.remaining` + `TH.f.hangyeol_sms` 둘 다 열람 | `K-20` |
| 메모 "4월 일정" | `KX-16` |
| 사진 "잠든 아버지" | `KX-18` |
| 한결 SMS 스레드 열람(S10~) | `KX-13` |
| 채무조정 신청서 사진 | `KX-14` |
| S11 은행 앱 상세(선택) | `KX-15` |
| 카메라로 잠든 아버지 촬영 후 [배경화면으로 설정] | `FX-07` |
| S12 유진 선택지 "너도… 거기서 나오고 싶었던 거 아니냐." | `FX-06` |
| S12 준호 B-1 통화 성립 | `FX-08` |

S10에서 한결 스레드를 열 때 `FX-02`를 먼저 세워 S01의 AV-01 자동 닫힘 훅을 무력화한다. S10의 스레드는 자동으로 닫히지 않는다.

## 5. 알려진 리스크 / 의도적 생략

- `?speed=20`에서 S10 알림 띠는 4.2초/20 ≈ 210ms만 보인다. 테스트는 `page.evaluate`로 즉시 클릭하거나 `speed=1`을 써라.
- S11의 비언어 넛지(90/180/450초)는 구현하지 않았다. "독백·NPC 알림 0"을 우선했다.
- S11의 아버지 폰 은행/사진/카메라 자체 뷰는 `S.session === 'S11'`일 때만 엔진 앱 열기를 가로챈다. S10/S12 이후에는 엔진 기본 앱이 그대로 동작한다.
- S12는 유진/준호/형 외의 연락처 전화를 바꾸지 않는다. 유진 "없는 번호"는 `010-XXXX-3927`/`4417`로 거는 경우만 캡처한다.
- B-2의 `RE.12`(103호 착신 문자)는 출발 직후 1.5초 뒤 메시지로 넣는다. S13 이동 중에 뜨는 것이 문서 의도다.
- S12 B-3의 김 형사 문자는 `T.detective` 스레드에 추가된다. P2에서 이미 만들어진 스레드를 전제한다.
- 옛 폰의 `seen`은 엔진 `know`와 별개다. 첫 열람 시 위 표의 K를 직접 `grant`한다. 세션 재시작 시 `S10.js`가 `OldPhone.reset()`으로 `seen`을 비운다(`jump('S10')` 재현 대비).
