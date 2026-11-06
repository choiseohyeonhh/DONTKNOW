# DONTKNOW MVP (P1)

아버지의 폰을 조작하는 스토리형 추리 게임의 웹 MVP. P1은 S1(02:47)부터 S2 종료(CN-01, 08:40)까지, 그리고 성원고 이동/도착 자리표시까지 플레이할 수 있다.

## 실행

```bash
# 로컬 서버(권장)
python3 -m http.server 8000 --directory mvp
# http://localhost:8000/

# 파일 직접 열기
open mvp/index.html
```

단일 HTML 빌드:

```bash
python3 mvp/build.py dist/dontknow.html
```

`build.py`는 CSS, 폰트, 모든 `img/` 파일을 data URI로 인라인한다. 결과물은 `file://`로 바로 열 수 있다.

## 디버그

| 옵션 | 설명 |
|---|---|
| `?debug=1` | 디버그 패널 표시. KNOW/플래그/세션/대화 상태, S01/S02/S03/S05 점프, 처음부터 |
| `?speed=N` | 모든 타이머·시네마틱을 N배 빠르게. 테스트는 `speed=20` 사용 |

브라우저 콘솔:

```js
window.__game = {
  S, jump, grant, setFlag, choose, runDialogue,
  has, flag, schedule, nudge, cancelNudge, clearGroup, later,
  addContact, addMsg, showMono, openThread, showThread, nav,
  playCine, defCine, defDialogue, defPlace, registerDest, onArrive,
  onThreadOpen, onDialContact, onAccept, defSession, setStartGame,
  startSession, endSession, startTravel, saveCheckpoint, readCheckpoint,
  switchToCall, clockStr, nowMsg, visibleOpts
}
```

## 엔진 API (content 파일에서 사용)

```js
S.clock = [h, m]; S.place = 'home'; S.session = 'S01';
grant('K-05'); has('K-05'); setFlag('F-02'); flag('F-02');

addContact({ id, name, num, kind });
addMsg(threadId, { from: 'them', text }, { banner: true });

defDialogue('S02.jihoon', [ ...nodes ], { onEnd });
runDialogue('S02.jihoon', { channel: 'sms'|'call'|'face'|'intercom', who, scene, opening });

SAY(who, m, c, { kn, kx, set })   // m: 문자 버블 배열, c: 통화/대면 한 줄
ME(text)
CHOICE([{ label: { m, c }, cond, call, switch, then, do }])
DO(fn) / WAIT(ms) / MONO(text) / LABEL(name) / GOTO(name) / END()

defPlace({ id, name, scene, travelMin });
registerDest('school');
onArrive('school', fn);
schedule(id, ms, fn, { cond, gameMin });
nudge(session, [[ms, fn], ...]);
defCine(id, { skip, cuts: [{ img, cap, stamp, roll, ... }] });
playCine(id, done);
startSession(id); endSession(id);
switchToCall();
```

화면 갱신은 `refresh()`가 `morph()`로 DOM만 패치한다. 통째 `innerHTML` 교체는 화면 이동(`navAnim`) 때만 일어난다.

## P1 범위

| 항목 | 상태 |
|---|---|
| S1 잠금화면, 지훈 문자 3건(10초), AV-01 1600-XXXX 자동 닫힘, 넛지 | 완료 |
| S2 문자/통화 대화, 선택지, 문자→통화 전환(같은 선택지 유지), K-01~K-05, KX-02, KX-04 | 완료 |
| CN-00, CN-01, S2 종료 독백 "성원고.", 목적지 등록, 08:40 잠금화면 | 완료 |
| 길찾기 → 성원고 경로 → 이동(2.5초 경로 애니메이션) → 도착 대면 장면 자리표시 | 완료 |
| 세이브: 세션 시작 체크포인트, 타이틀 [이어하기] | 완료 |
| 대면 장면, 통화, 디버그 패널, 단일 HTML 빌드 | 완료 |
| S3 이후 세션, CCTV, 옛 폰, 엔딩 | 미구현(P2~P5) |

## 테스트

```bash
NODE_PATH=$(npm root -g) node mvp/tests/p1.js
```

- A: 안내 → 처음부터 → CN-00 → 잠금 해제 → 지훈 스레드 → 문자 선택지 끝까지 → CN-01 → 08:40 → 잠금 해제 → 길찾기 → 성원고 → 이동 → 도착 자리표시
- B: S2에서 통화로 전환해 K-04, K-05, KX-04 획득 확인
- 페이지 에러/콘솔 에러가 하나라도 있으면 실패

## 알려진 빈틈

- S3 실제 대면 장면은 자리표시 한 줄뿐이다.
- 사운드·진동 없음. 배경화면은 단색 그라데이션.
- 통화 중 사용자가 먼저 끊으면 선택지가 문자 쪽으로 돌아오며 일부 분기가 건너뛰어질 수 있다.
- 중간 세션 체크포인트는 세션 시작 지점으로 돌아간다(P1은 S1/S2 시작만).
