# DONTKNOW MVP — 구현 지시서 (감독: Claude / 구현: opencode 에이전트)

> 목표: S1(02:47)부터 S14 엔딩까지 **처음부터 끝까지 플레이 가능한** 웹 MVP.
> 캐논: `docs/bible.md`(v5.4). 세부 설계: `docs/README.md`부터. 세션별 설계: `docs/sessions/S01.md`~`S14.md`.
> 대사는 **세션 문서에 있는 문장 그대로** 쓴다(v5.4 문체). 문서에 없는 대사가 꼭 필요하면 `docs/narrative/dialogue-style.md`를 따르고, 인물은 자기가 모르는 걸 말하지 않는다(bible 2.3). 약물 소재는 "약/그거/그 일"로만, 수법 디테일·투약 장면 없음.

## 0. 절대 규칙

1. 디자인은 `prototype/tutorial/`을 그대로 가져간다(아이폰 UI, 색, 글꼴 Pretendard, 크기, 애니메이션, `morph()` DOM 패치, 시네마틱 플레이어). 새 화면도 같은 디자인 언어(iOS 스타일, `style.css`의 변수)로 만든다.
2. 화면 갱신은 반드시 `morph()`를 쓴다. `innerHTML` 통째 교체는 화면 이동(nav 애니메이션) 때만. 어기면 깜빡인다.
3. 외부 라이브러리·CDN 금지. 바닐라 HTML/CSS/JS. 빌드 결과는 이미지·폰트까지 인라인된 **단일 HTML 파일**.
4. API 키·비밀정보 금지. `.env` 읽지 말 것.
5. `prototype/`, `docs/`는 수정하지 않는다. 작업은 전부 `mvp/` 안에서.
6. 각 단계 끝에 Playwright 테스트로 직접 플레이해서 검증하고, 결과(통과/실패, 콘솔 에러)를 보고한다. Playwright는 설치돼 있다: `NODE_PATH=$(npm root -g) node mvp/tests/xxx.js`. 브라우저 설치 명령 금지.
7. git commit/push 금지(감독이 한다).

## 1. 구조

```
mvp/
  index.html          스크립트 순서: js/data.js → js/engine.js → js/content/*.js → js/main.js
  style.css           prototype/tutorial/style.css 복사 + 확장
  fonts/              prototype/tutorial/fonts 복사
  img/                assets/generated/crops/ 에서 필요한 것만 복사, 긴 변 1100px, JPEG q78로 축소(python3 PIL 사용, 없으면 원본 복사)
  js/data.js          prototype/tutorial/data.js(아버지 폰 데이터) + 확장
  js/engine.js        상태, 렌더(폰 앱, 통화, 대면 장면, 이동, 옛 폰, 시네마틱, 엔딩), 대화 러너, 이벤트 큐, 판정
  js/content/S01.js … S14.js, endings.js   세션별 대화·이벤트 데이터 (엔진 API만 호출)
  js/main.js          부팅
  build.py            단일 HTML 빌드 (prototype/tutorial/build.py 참고)
  tests/              Playwright 플레이 테스트
  README.md           실행법, 디버그 옵션, 구현 범위표
```

## 2. 엔진 API (content 파일이 쓰는 것)

```js
// 상태
S.clock = [h, m]; S.place = 'home'; S.know = {}; S.flags = {}; S.v = {}; S.session = 'S01';
grant('K-05'); has('K-05'); setFlag('F-02'); flag('F-02');
// 연락처·문자
addContact({ id, name, num, kind });       // kind: 'normal' | 'dead' | 'block' | 'noanswer'
addMsg(threadId, { from: 'them'|'me', text }, { banner: true });
// 대화 (모든 채널 공통 DSL)
defDialogue('S02.jihoon', [ ...nodes ]);
runDialogue('S02.jihoon', { channel: 'sms'|'call'|'face'|'intercom', who: 'jihoon', scene: 'staffroom' });
//   nodes: SAY(who, m, c, {kn, kx, set})  — m: 문자 버블 배열, c: 통화/대면 한 줄
//          ME(text)  CHOICE([{label:{m,c}, cond:()=>bool, then:[...], do:()=>{}}])
//          DO(fn)  WAIT(ms)  MONO(text)  GOTO(label)  LABEL(name)  END()
// 장소·이동
defPlace({ id, name, scene, travelMin: {home: 20, ...} });
registerDest('school');                    // 길찾기 앱 목적지에 추가
onArrive('school', () => …);
// 이벤트
schedule(id, ms, fn, { cond, gameMin });   // 실시간 ms(?speed 반영) 뒤, cond 재평가
nudge(sessionGoal, [[90000, fn], [180000, fn], …]);   // 진행 시 자동 리셋
// 시네마틱
defCine('CN-03', { skip, cuts:[{img, cap, stamp, …}] }); playCine(id, done);
// 세션
startSession('S03'); endSession('S03');
// 엔딩
resolveEnding();   // bible 8.1 판정 순서
```

필요하면 API를 늘려도 되지만, 기존 세션 콘텐츠가 깨지지 않게 하고 `mvp/README.md`의 API 절에 기록한다.

## 3. 화면(채널)

| 채널 | 설명 | 근거 문서 |
|---|---|---|
| 폰 앱 | 프로토타입 앱 전부(메시지, 전화, 연락처, 길찾기, 사진, 메모, 카메라, 설정, 톡, 은행) | `docs/ui/father-phone/*.md` |
| 통화 | 프로토타입 통화 오버레이(자막 + 대답 선택지) | 프로토타입 |
| 대면 장면 | 장소 일러스트 전체 화면(살짝 어둡게) + 하단 대사창(이름, 대사, 선택지 버튼). 대사창은 iOS 시트 느낌의 반투명 다크. 우하단 "폰" 버튼으로 폰을 올려 앱 사용 가능(장면 중 사진 보여주기 등). 얼굴 금지 원칙이라 그림은 장소만 | `docs/ui/scenes/scene-view.md` |
| 인터폰 | S8 전용. 대면 장면의 변형 | `docs/ui/scenes/intercom.md` |
| CCTV 스크러버 | S6. 프레임 7장(`cctv_k1~7`)을 슬라이더로 넘기는 뷰, 시각 표시 19:05:00~19:07:30 | `docs/ui/scenes/cctv-scrubber.md` |
| 이동 | 길찾기에서 목적지 → [안내 시작] → 이동 화면(경로 선 그려지는 2.5초 애니메이션, 도착 시각) → 시계 진행 → 도착 장면 | `docs/ui/scenes/travel.md`, `docs/systems/navigation.md` |
| 옛 폰 | K-18 이후 화면 상단에 기기 전환 탭("아빠 폰 / 도현 폰"). 다크 모드, 작은 글씨. PIN 680403. 앱: 메시지(형, 준호, 유진, 초안), 음성메모(재생 = 대본 줄이 시간에 맞춰 뜸, 앞으로 건너뛰기 불가), 메모(남은 거, 4월 일정), 사진 | `docs/ui/old-phone/*.md`, `docs/content/old-phone-data.md`, `docs/systems/old-phone-device.md` |
| 시네마틱 | 프로토타입 플레이어 + 자막 | `docs/ui/cinematics.md` |
| 엔딩 | 엔딩별 시퀀스 → 타이틀 "DONTKNOW" → 크레딧(후일담 문자) | `docs/sessions/S14.md` |

## 4. 단계

| 단계 | 범위 | 완료 기준 |
|---|---|---|
| **P1 엔진** | 구조 생성, 프로토타입 이식, 위 엔진 API, 대면 장면·이동·이벤트 큐·세이브(세션 시작 체크포인트, 타이틀에 [이어하기])·디버그(`?debug=1`, `?speed=N`, `window.__game = {S, jump, grant, setFlag, choose}`), S1·S2를 새 DSL로 이식 | 테스트: S1→S2(문자) → CN-01 → 08:40, S3 목적지 등록까지. 콘솔 에러 0 |
| **P2 1막·2막 전반** | S3 모교, S4 유진, S5 경찰서(+김 형사 허브), S6 편의점(CCTV) | 테스트: S1~S6 연속 플레이, K-06~K-12 획득 |
| **P3 2막 전반 끝·미드포인트** | S7 준호(F-02/F-02b), S8 민재(인터폰/문 열기, 정적 5초), S9 약국(사진/압박), CN-02·CN-03 | 테스트: 두 경로(F-02 / F-02b, 사진 / 압박 2회) |
| **P4 2막 후반** | S10 봉투·옛 폰·PIN·음성메모, S11 두 폰 탐색(필수 항목 체크, 카메라로 배경화면 FX-07), S12 유진·준호 분기, 22:40 착신, CN-04 | 테스트: K-18~K-22 획득, A·B 분기 코드 |
| **P5 3막** | S13 형 대면(3단계, 선택지 조건), S14 엔딩 A/B/B+/B-silent/C/D, 엔딩 판정, CN-05, 크레딧 | 테스트: 엔딩 4종 각각 도달 |
| **P6 전체 검수** | 처음부터 끝까지 엔딩 A·B·C·D 4회 풀 플레이 테스트, 버그 수정, 빌드, README 범위표 | 4회 모두 통과, 빌드 파일 생성 |

## 5. 단순화 허용 (MVP)

- 사운드·진동 없음(필요하면 화면 미세 흔들림만).
- 넛지: 각 세션 90초 NPC 문자 1개 + 450초 강제 진행 1개면 충분(`docs/systems/idle-nudge.md` 표에서 고른다).
- 세션 밖 NPC 연락(5.8)은 "지금은 통화가 어렵다"류 한 줄 응답으로 대체 가능.
- 아트가 없는 장면은 가장 가까운 그림 + 어둡게, 또는 단색 배경.
- 한결캐피탈 은행 앱 세부는 `docs/ui/father-phone/bank.md`의 최소 표시.
