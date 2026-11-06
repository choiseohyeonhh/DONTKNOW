# DONTKNOW MVP (P6)

아버지의 폰을 조작하는 스토리형 추리 게임의 웹 MVP. P6에서 S01(02:47)부터 S14 엔딩 4종까지 처음부터 끝까지 플레이할 수 있다.

## 실행

```bash
# 로컬 서버(권장)
python3 -m http.server 8000 --directory mvp
# http://localhost:8000/

# 파일 직접 열기
open mvp/index.html
```

단일 HTML 빌드(이미지·폰트·CSS·스크립트 인라인):

```bash
python3 mvp/build.py mvp/dist/dontknow.html
# dist/dontknow.html 을 file:// 로 바로 열 수 있다.
```

## 조작

| 상황 | 조작 |
|---|---|
| 안내/타이틀 | `계속` → `처음부터` / `이어하기` |
| 잠금화면 | `위로 쓸어서 열기` 탭 또는 위로 드래그 |
| 폰 앱 | 아이콘 탭. 뒤로는 헤더 `‹`, 홈은 하단 인디케이터 |
| 대면·통화·인터폰 | 대사창/화면 탭으로 진행, 선택지는 버튼 탭 |
| 대면 중 폰 | 우하단 `폰` 버튼, 돌아갈 때 `장면으로 돌아가기` |
| 이동 | 길찾기 → 목적지 → `안내 시작` |
| 옛 폰 | 상단 `아빠 폰 / 도현 폰` 탭. PIN `680403`. 앱 헤더의 `홈`으로 앱 목록 복귀 |
| 엔딩 | 안내에 따라 `받기` / `보내기` 등 탭. 마지막 화면에서 `처음부터` |

## 디버그

| 옵션 | 설명 |
|---|---|
| `?debug=1` | KNOW/플래그/세션/대화 상태와 S01~S14 점프, 처음부터 |
| `?speed=N` | 모든 스케일 타이머·시네마틱·이동·음성메모를 N배 빠르게. 테스트는 `speed=30` |

브라우저 콘솔의 `window.__game`으로 상태를 읽거나 점프할 수 있다. 전체 테스트는 실제 UI만 사용하고 `window.__game`은 상태 확인용으로만 쓴다.

```js
window.__game = {
  S, jump, grant, setFlag, clearFlag, choose, runDialogue,
  has, flag, schedule, nudge, cancelNudge, cancelScheduled, clearGroup, later,
  showBanner, hideBanner, openDead, addArrive, addThreadOpen,
  addContact, addMsg, showMono, openThread, showThread, nav,
  playCine, defCine, defDialogue, defPlace, registerDest, onArrive, onThreadOpen,
  onDialContact, onAccept, defSession, setStartGame,
  startSession, endSession, startTravel, startRoute, saveCheckpoint, readCheckpoint,
  switchToCall, faceNext, clockStr, nowMsg, visibleOpts,
  addTalkContact, addTalkMsg, openTalkThread, onTalkOpen, setTalkChoice, offerReply,
  openCctv, closeCctv, setCctvTime, cctvStep, endCall
}
```

## 엔진 API 요약 (content 파일에서 사용)

```js
S.clock = [h, m]; S.place = 'home'; S.session = 'S01';
grant('K-05'); has('K-05'); setFlag('F-02'); flag('F-02'); clearFlag('F-02');

addContact({ id, name, num, kind: 'normal'|'dead'|'block'|'noanswer', th });
addMsg(threadId, { from: 'them'|'me'|'sys', text }, { banner: true });

defDialogue('S02.jihoon', [ ...nodes ], { onEnd });
runDialogue('S02.jihoon', { channel: 'sms'|'call'|'face'|'intercom', who, scene, opening });
SAY(who, m, c, { kn, kx, set }) / ME(text)
CHOICE([{ label: { m, c }, cond, call, switch, then, do }])
DO(fn) / WAIT(ms) / MONO(text) / LABEL(name) / GOTO(name) / END()

defPlace({ id, name, scene, travelMin });
registerDest(id); onArrive(id, fn); addArrive(id, fn);   // 복수 도착 훅 누적
schedule(id, ms, fn, { cond, gameMin });
nudge(session, [[ms, fn], ...]);
defCine(id, { skip, cuts: [{ img, cap, stamp, roll, ... }] });
playCine(id, done);
openDead(name, text, ms); showBanner(title, body, id, kind); hideBanner();
startSession(id); endSession(id);
```

화면 갱신은 `refresh()`가 `morph()`로 DOM만 패치한다. 통째 `innerHTML` 교체는 화면 이동(`navAnim`) 때만 일어난다.

## 세션별 구현 범위

| 세션 | 상태 | 구현 | 단순화 / 미구현 |
|---|---|---|---|
| S01 | 구현 | 잠금화면, CN-00, 지훈 문자 3건, AV-01 자동 닫힘, 넛지 | 사운드 없음 |
| S02 | 구현 | 문자/통화 전환(선택지 유지), K-01~K-05, KX-02/KX-04, CN-01 | - |
| S03 | 구현 | 모교, 담임, 서연 톡, 결석일 문자, 상담실(K-06/K-07/KX-01/KX-10) | 서연 답장은 2택 고정 |
| S04 | 구현 | 유진 신뢰/의심, K-08, F-01, 김 형사 착신 | - |
| S05 | 구현 | CCTV 정지 화면, 통화 기록, 유진 선행 방문(K-09~K-11), 김 형사 허브, F-03/F-04, 경찰서 재방문 | 허브는 반복 대화 |
| S06 | 구현 | 편의점, CCTV 스크러버 15초, K-12/KX-09, 준호 번호(KX-03) | 영상이 아닌 7장 프레임 |
| S07 | 구현 | 준호 전화/문자, F-02(협박)/F-02b(약속), K-13/K-14 | 타이핑 속도 연출 생략 |
| S08 | 구현 | 민재 인터폰/문 열기(FX-04), CN-02 5초 정적, 영수증(K-15/K-16), RE.02 | 사운드·문 밝기 연출 생략 |
| S09 | 구현 | 약국, 사진 경로(FX-05/K-17/KX-12), 압박 2회(KX-17a), CN-03, 자동 귀가 | 사진첩 선택·잔상·토스트는 로컬 오버레이 |
| S10 | 구현 | 봉투(K-18), 옛 폰 PIN/음성메모(K-19), 초안(KX-19), 한결(KX-13/KX-20), CN-04 | PIN 10회 실패 30초 대기는 실시간 |
| S11 | 구현 | 필수 8항목, 은행/채무조정/카메라, FX-07, KX-14/KX-15, 30초 후 S12 | 은행·사진·카메라는 로컬 레이어, 넛지 없음 |
| S12 | 구현 | 유진 A-1/A-2/A-3, 준호 B-1/B-2/B-3, 22:40 형 착신, 출발 시트 | 거절 재착신은 타이머 우회 |
| S13 | 구현 | 형 대면 3단계, 탐색 선택지, 최종 4갈래, 폰 잠금 | 선택지 높이 연출은 CSS 우회 |
| S14 / endings | 구현 | A/B/B+/B-silent/C/D 판정·시퀀스·타이틀·크레딧, `endingsSeen` | 후일담은 문자 배너 위주 |

## 테스트

```bash
NODE_PATH=$(npm root -g) node mvp/tests/p1.js
NODE_PATH=$(npm root -g) node mvp/tests/p2.js
NODE_PATH=$(npm root -g) node mvp/tests/full.js
```

- `p1.js`: S1→S2 문자/통화, CN-01, 08:40, 길찾기→S3 개시
- `p2.js`: S3~S6 연속 플레이, 의심 경로 F-01 미설정, S07 점프
- `full.js`: 공지 화면에서 시작해 실제 UI 클릭만으로 엔딩 A·B·C·D를 각각 완주하고 K/플래그/분기 코드, 최종 타이틀 카드, 페이지 에러 0을 검증. `ONLY=A node mvp/tests/full.js`로 한 루트만 실행 가능.

## 알려진 빈틈

- S08 CN-02 입력 잠금, S09 사진 선택/대화 재개/잔상/토스트, S12 배너·착신은 각 content 파일의 로컬 DOM 우회를 유지한다. 엔진에는 `addArrive`·`addThreadOpen`·`openDead`·`showBanner` 등 핵심 훅만 정식 추가했다.
- 옛 폰은 `#oldphone-layer` 레이어로 동작하며 엔진이 기기 상태를 직접 소유하지 않는다. 앱 목록 복귀용 `홈` 버튼을 추가했다.
- 체크포인트는 세션 시작 지점만 저장한다(중간 저장·`sessionDone` 영구 해금 없음). `?debug=1` 점프는 S01~S14 모두 지원한다.
- S11 필수 항목은 옛 폰/아버지 폰에서 직접 열람해야 한다. 자동 완료 연출은 없다.
- 사운드·진동, 실제 CCTV 영상, 일부 장소 전용 아트는 MVP 범위 밖이다.
- 대부분의 타이머는 `?speed`에 반영되지만 PIN 10회 실패 후 30초 대기는 실시간이다. 테스트는 이 경로를 피한다.
- 단일 HTML 빌드는 약 9.2MB(이미지·폰트 인라인)이다.
