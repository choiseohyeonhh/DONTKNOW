# P3 통합 메모 — S07 / S08 / S09가 가정한 것들

작성 범위: `mvp/js/content/S07.js`, `S08.js`, `S09.js`.
기존 파일(`index.html`, `engine.js`, `style.css`, S03~S06)은 고치지 않았다. 없는 기능은 **각 콘텐츠 파일 안의 로컬 헬퍼 · CSS 주입 · DOM 오버레이**로 우회했다. 아래는 통합자가 엔진/로더에 넣거나, 최소한 순서를 맞춰 줘야 하는 것들이다.

## 1. 로더

`index.html`에서 `js/content/S06.js` 뒤, `js/main.js` 앞에 추가한다. 셋 다 서로의 전역 함수(`armS8Home`, `tryStartS8`, `armS9Travel`)를 호출하므로 S07 → S08 → S09 순서를 지킨다.

```html
<script src="js/content/S07.js"></script>
<script src="js/content/S08.js"></script>
<script src="js/content/S09.js"></script>
```

## 2. 없는 엔진 훅 (추가 권장)

### 2.1 `addArrive(placeId, fn)` — 장소당 복수 도착 핸들러

현재 `onArrive(id, fn)`는 `ARRIVE[id] = fn`이라 마지막 등록만 남는다. S08은 이 충돌을 피하려고 `onArrive('home')`을 **등록하지 않고** 8초 뒤부터 `S.place === 'home' && !S.travel`을 폴링한다(`S08.js`의 `armS8Home`). S09는 `pharmacy`만 등록하므로 현재는 안전하다.

권장 시그니처:

```js
addArrive(placeId, fn)   // 기존 onArrive를 배열 기반으로 바꾸거나, 별도 배열에 추가
```

S10 이후 누군가 `onArrive('home')`을 다시 등록하면 S04의 홈 도착 훅이 또 사라진다. 통합 시 반드시 `addArrive`로 바꾸거나, S04/S08/S10의 홈 도착 조건을 한 핸들러로 모아야 한다.

### 2.2 `requestItem({ photoSrc, onPick, allowPhone })` / `requestPhoto(...)`

S09 경계 단계의 `(사진을 보여준다)`와 `"제 아들 일 때문에 그럽니다." → 사진 요청`을 위해 “사진첩에서 특정 사진을 골라 보여주는 대기 상태”가 필요하다. 현재 엔진에는 이런 상태나 훅이 없다.

현재 우회: `S09.js`가 `S.photos`를 읽어 전체 화면 사진 선택 오버레이(`.dk-photopick`)를 직접 띄운다. 사진을 고르면 `S.dlg.waiting`을 지우고 `S.dlg.queue`에 노드를 넣은 뒤, `.scene .dlg`를 프로그램적으로 클릭해 대화를 재개한다.

권장 시그니처:

```js
requestPhoto({
  src: 'img/photo_father_son_2022.jpg', // 기대하는 사진
  onPick: (picked) => {},                // picked: { src, matched: bool } | null(취소)
  allowPhone: true                       // 장면의 폰 버튼으로 사진 앱을 열어도 됨
})
```

엔진이 대화 러너를 알고 있으므로 `waiting`/`awaitTap`을 직접 만지지 않게 해 주는 편이 안전하다.

### 2.3 `resumeDialogue(nodes)` / `advanceFace()`

사진 선택 오버레이를 닫은 뒤 대화를 이어 붙이는 공개 API가 없다. 현재는 `S.dlg.queue`를 직접 조작하고 `document.querySelector('.scene .dlg').click()`으로 `faceNext()`를 유도한다(`S09.js`의 `resumeDialogue`).

권장 시그니처:

```js
resumeDialogue(nodes)   // 현재 대화의 queue 앞에 nodes를 넣고 runQueue()
advanceFace()           // awaitTap을 무시하고 다음 노드로
```

### 2.4 `showItem({ img, onClose, zoom })` — 아이템 확대 뷰

S08 영수증 확대(`img/item_receipt.jpg`)를 위한 공통 아이템 뷰가 없다. 현재 `S08.js`가 `.dk-receipt` 전체 화면 오버레이를 직접 만들고, 닫기 버튼에서 K-16/사진 저장/S08 종료를 처리한다.

권장 시그니처:

```js
showItem({
  img: 'img/item_receipt.jpg',
  onClose: () => {},       // 닫기 직후
  zoom: 'in' | 'none'
})
```

### 2.5 `callResult({ name, ringMs, deadText, onEnd })` 또는 `openDead` 공개

S07의 발신 시도는 “1차 6초 링 후 끊김 / 2차 이후 전원 꺼짐”이 필요하지만, 엔진의 `openDead(name, text, ms)`는 내부 함수라 `window.__game`에 없다. 현재 `S07.js`의 `deadCall`이 `S.call`/`S.ov`를 직접 세팅한다.

권장 시그니처:

```js
callResult({ name, ringMs, deadText, onEnd })
// 또는 최소한 openDead(name, text, ms)를 API에 노출
```

### 2.6 `onDecline(fn)` / 수신 결과 훅

S07 A 경로는 “거절 시 1회 재착신”이 필요하지만, 엔진 `decline` 액션은 `closeOv()`만 호출하고 훅이 없다. 현재는 최초 착신 16초 뒤 `S.ov`가 비어 있으면 한 번 더 링하는 시간 기반 우회를 썼다(`ringJunho(true)`).

권장 시그니처:

```js
onIncomingResult((result) => {})   // result: 'accept' | 'decline' | 'miss'
```

### 2.7 `ensureThread(threadId, meta)` / `addContact`가 문자 스레드도 생성

`addContact()`는 연락처(`CT`)만 만들고 메시지 스레드(`T`)는 만들지 않는다. 그래서 S07에서 “2차 실패 후 준호 스레드 활성”을 만들려면 시스템 줄을 하나 넣어 `T.junho`를 강제 생성해야 했다(`ensureJunhoThread`, `{ from:'sys', text:'부재중 전화 n건' }`).

권장 시그니처:

```js
ensureThread(threadId, { name, num })
// addContact({ th })가 있으면 T[th]도 빈 스레드로 생성
```

### 2.8 `addThreadOpen(threadId, fn)` — 스레드 열람 훅 복수 등록

`onThreadOpen(id, fn)`도 단일 슬롯(`threadOpenHooks[id] = fn`)이다. S09가 `teacher` 스레드 열람 시 `KX-12`를 주려면 S03의 `teacher` 훅(`KX-01`)을 덮어쓰게 되므로, S09는 S03 로직을 그대로 복제했다. 통합 시 훅이 하나만 남는 문제를 정리해야 한다.

권장 시그니처:

```js
addThreadOpen(threadId, fn)   // 배열로 누적
```

### 2.9 `showMono(text, { variant, ms, blur })` / `showAfterimage(text)`

S09의 `…나중에.` 잔상은 “0.8초, 흐리게, 상단, 무음, 독백 배너와 다른 연출”이다. 현재 `S09.js`가 `.dk-afterimage` DOM을 직접 띄운다. 일반 `showMono()`는 2.3초 동안 하단에 뜨므로 맞지 않는다.

권장 시그니처:

```js
showMono(text, { variant: 'normal' | 'afterimage', ms, blur })
```

### 2.10 `toast(text, { ms })` / 길찾기 앱 알림

S09 이동 넛지의 “저장한 장소 '새봄약국' 영업 종료까지 1시간 30분”은 앱 알림인데, 엔진에 일반 토스트/알림 API가 없다. 현재 `S09.js`의 `toast()`가 상단 알약형 DOM을 띄운다.

권장 시그니처:

```js
toast(text, { ms: 3200, kind: 'map' })
```

### 2.11 `playCine(id, { inputLock, hideTap }, done)`

CN-02는 “5초 정적, 입력 무시, 자막 없음”이 연출의 핵심이다. 현재 `playCine`은 탭하면 `cineTap()`이 돌고 `#cine .tap` 안내가 항상 붙는다. `S08.js`는 `body.dk-s8-silence` 클래스로 `.tap`을 숨기고, `document` 캡처 단계에서 `pointerdown/touchstart/click/keydown`을 막은 뒤 cine가 끝나면 해제한다.

권장 시그니처:

```js
playCine(id, { inputLock: true, hideTap: true, hideSkip: true }, done)
```

### 2.12 `savePhoto({ id, src, label })`

S08 영수증 사진을 사진 앱에 자동 저장할 때 `S.photos.push({ src })`를 직접 호출하고 `PH.f.receipt_saebom` 플래그를 세운다. 사진 식별을 `src` 문자열(`photo_receipt_saebom`)로 하므로, 사진 메타데이터가 있으면 더 안전하다.

권장 시그니처:

```js
savePhoto({ id: 'PH.f.receipt_saebom', src: 'img/photo_receipt_saebom.jpg', label: '새봄약국 영수증' })
```

### 2.13 `setScene(scene, channel?)` / `setChannel(channel)`

S08에서 “문 연다”를 고르면 인터폰 채널에서 현관 대면 장면으로 전환해야 한다. 현재는 `S.dlg.scene`/`S.dlg.channel`을 직접 바꾼다(`S08.js`의 `setScene`).

권장 시그니처:

```js
setScene(sceneKey, channel?)   // 현재 대화의 장면/채널 변경 + refresh
```

### 2.14 `hasSession(id)` / `startSessionIfDefined(id)`

S09 종료 후 `window.startS10` 존재 여부로 분기하고, 없으면 `startSession('S10')` + `showMono('…집.')`로 자리표시한다. 현재 저장소에는 S10이 추가되어 `window.startS10`이 있으므로 그 경로를 탄다. 세션 정의 존재 여부를 조회하는 API가 있으면 더 깔끔하다.

```js
hasSession('S10')            // SESSIONS['S10'] 존재 여부
startSessionIfDefined('S10') // 있으면 시작, 없으면 false
```

## 3. 로컬 우회 요약 (통합 시 참고)

| 파일 | 우회 | 이유 |
|---|---|---|
| S07 | `deadCall()`이 `S.call`/`S.ov` 직접 세팅 | `openDead` 미공개 |
| S07 | 수신 거절 감지 대신 16초 뒤 1회 재링 | `onDecline` 없음 |
| S07 | `addMsg(..., {from:'sys', text:'부재중 전화 n건'})`로 스레드 생성 | `ensureThread` 없음 |
| S08 | `onArrive('home')` 대신 8초 뒤 홈 폴링 | `onArrive` 단일 슬롯이라 S04 훅을 덮지 않기 위해 |
| S08 | `.dk-receipt` DOM 오버레이 | 아이템 확대 뷰 없음 |
| S08 | CN-02 입력 차단용 document 캡처 리스너 + body 클래스 | `playCine` 입력 잠금 없음 |
| S08 | RE.02 수신 시 스레드가 이미 열려 있으면 즉시 `KX-08` | 열람 훅이 다시 발화하지 않으므로 |
| S09 | `.dk-photopick` 사진 선택 오버레이 + `resumeDialogue` | `requestPhoto`/대화 재개 API 없음 |
| S09 | `teacher` 열람 훅에서 S03의 `KX-01` 로직을 복제 | `onThreadOpen` 단일 슬롯 |
| S09 | `.dk-afterimage`, `.dk-toast` DOM | 잔상/토스트 API 없음 |
| S09 | CN-03 후 `startTravel('home')` + 도착 폴링 | 자동 이동 API는 있으나 S10 시작 훅이 없음 |

## 4. 상태 계약 (다른 세션/통합자가 맞춰야 하는 것)

### 4.1 플래그

- `F-02` = S07 A(협박, 캐논). `F-02b` = S07 B(약속). **동시에 서지 않는다.**
- `FX-04` = S08 문 열기.
- `FX-05` = S09 아버지·아들 사진을 보여줌.
- `FX-02` = S01 AV-01(한결 스레드 자동 닫힘) 경험. S09 잔상은 이 플래그가 있을 때만.
- `K-15` = S08 민재의 약 언급. S05 김 형사 허브의 F-03/F-04 선택지가 이 플래그를 이미 본다.
- `K-16` = 새봄약국 영수증.
- `K-17` = S09 사진 경로 증언. `KX-17a` = 압박 2회 조기 종료.
- `KX-01` = 결석일 목록(S03). S09 t04 선택지 조건.
- `KX-12` = 화요일 대조. S09 t04 또는 S09 중 `teacher` 스레드 재열람으로 획득.
- `KX-08` = RE.02 유진 문자 열람.

### 4.2 `S.v`

- `s7_dialCount`, `s7_threadReady`, `s7_incoming`
- `s8_mode` (`'intercom'` | `'door'`)
- `s9_pressure`, `s9_path` (`'photo'` | `'pressure'`), `s9_late`, `s9_afterimage`
- 세션 완료는 기존과 같이 `S.sessionDone.S07/S08/S09`와 `S07.done`, `S08.done`, `S09.done` 플래그를 병행한다.

### 4.3 사진

- S08 종료 시 `S.photos`에 `{ src: 'img/photo_receipt_saebom.jpg' }`를 추가한다.
- S09 사진 경로는 `src`에 `photo_father_son_2022`가 포함된 사진을 “아버지·아들 사진”으로 판별한다.

## 5. 남은 빈틈 / 의도적으로 하지 않은 것

- S07 A/B의 “아버지 타이핑 연출(A 평소, B 글자당 160ms)”은 엔진에 타이핑 속도 훅이 없어 구현하지 않았다.
- S08 민재 음성·초인종·이웃 문 소리, S09 자동문 차임·셔터 음향은 사운드 미구현 범위라 넣지 않았다.
- S08 “인터폰 종료 → 10초 뒤 다시 밝아짐”은 구현하지 않았다. 인터폰 화면에서 선택지가 바로 뜬다.
- S09 “마감 직전 변형(셔터 반쯤)”은 `v.s9_late`만 세우고 아트 분기는 하지 않았다.
- S09 “결석일 대조”는 `teacher` 스레드를 다시 열면 `KX-12`를 주는 방식으로만 구현했다(폰을 꺼내는 전용 UI 없음).
- S10은 `window.startS10`이 있으면 그걸 호출하고, 없으면 `S10` 세션과 `…집.` 한 줄로 끝낸다. 현재 저장소의 S10은 `window.startS10`을 노출하므로 정상 연결된다.
