# game/ 개발 공통 지침 (모든 작업자 필독)

## 무엇을 만드나
DONTKNOW v6.2 — 스마트폰 수사 어드벤처 웹게임. 플레이어(아버지)는 실종된 아들 도현의 폰(가상 OS "LUMA")을 조작해 사건을 푼다.
결과물은 **처음부터 엔딩까지 플레이 가능한 단일 HTML 파일** `game/dist/dontknow.html`(빌드: `python3 game/tools/build.py`).

## 설계 기준 (단일 출처)
- 모든 설계는 `design/` 폴더. 시작은 `design/README.md`.
- 숫자·이름·시각: `design/01-product/NARRATIVE_CANON.md`
- 진행·사건·NPC 반응·플래그·엔딩·힌트: `design/01-product/PROGRESSION_AND_ENDINGS.md`
- 행동 증명 V-xx·낱말 사전: `design/01-product/ACTION_PROOF.md`
- 흔적 TR-xx: `design/01-product/TRACES_AND_REACTIONS.md`
- 단서 E-xx: `design/01-product/EVIDENCE_LEDGER.md`
- 인물·앎 매트릭스(인물은 자기가 모르는 걸 말할 수 없다): `design/01-product/CHARACTERS.md`
- 게임 규칙(원격 지우기 해법, 힌트 등): `design/01-product/BUSINESS_RULES.md`
- 앱별 기능: `design/03-features/*.md`, 화면: `design/02-design/SCREEN_SPECIFICATIONS*.md`
- 상태 구조: `design/04-tech/STATE_MANAGEMENT.md`, 데이터: `design/04-tech/DATABASE_SCHEMA.md`
- 프로토타입 검수 37건과 읽음·배지 공통 규칙: `design/05-quality/PROTOTYPE_FINDINGS.md`
- 인수 조건: `design/06-execution/ACCEPTANCE_CRITERIA.md`
설계와 코드가 다르면 설계가 정답이다. 설계에 없는 걸 지어내야 하면 최소한으로 하고 보고서에 적는다.

## 코드 구조 (phone-prototype에서 시작했다 — 디자인은 그대로 유지)
- 바닐라 JS 클래식 스크립트, 전역 `window.LM`. 번들러·npm 의존성 없음. `file://`로 열려야 한다.
- `js/core.js` LM API(h(), 이벤트 on/emit, 상태, 시계, 내비 스택, sheet/actionSheet/alert/toast), `js/icons.js`, `js/data.js`, `js/shell.js` 셸, `js/apps/<id>.js` 앱 30종(`LM.register({id, render(app)})`).
- 새 게임 로직은 `js/engine/*.js`, 콘텐츠 데이터는 `js/content/*.js`(전역 `LM.C.<이름>`에 객체 대입). index.html에 `<script>` 순서: core → icons → data → content/* → engine/* → shell → apps/* → boot.
- `tools/build.py`가 index.html의 스크립트 목록과 단일 HTML 인라인을 맡는다. 새 폴더(js/engine, js/content)도 목록·인라인에 포함되게 유지한다.
- 디자인(토큰·컴포넌트·아이콘·제스처)은 phone-prototype 것을 그대로 쓴다. 새 화면도 같은 컴포넌트(`LM.ui.*`, css/os.css 클래스)로 만든다.

## 금지
- `phone-prototype/`, `design/` 수정 금지. 작업은 `game/` 안에서만.
- 외부 네트워크 요청·CDN 금지. 래스터 이미지 생성 금지(그림은 SVG/CSS 코드로).
- 실제 브랜드명 금지(카카오·인스타 등). 앱 이름은 설계의 가상 이름.
- 사기 "수법"(대본·세탁·계정 탈취 기술) 묘사 금지. 흐름(누가·언제·얼마)만.
- 비밀값·API 키 하드코딩 금지.
- `git commit`/`git push` 하지 않는다(감독이 리뷰 후 커밋한다).

## 문체
- UI 문자열·대사는 한국어. 대사는 실제 구어(잘린 평서형 금지). 설계에 적힌 대사는 글자 그대로 쓴다.
- 게임은 "틀렸습니다"·점수·판정 UI를 보여 주지 않는다. 세계의 반응(답장·사건)으로만 알린다.

## 검증
- Playwright 사용 가능: `require('playwright')`, `chromium.launch()`(설치 명령 금지). 테스트는 `game/tests/*.js`(node로 실행)에 둔다.
- 작업 끝에 반드시: (1) `node --check`로 모든 js 문법 확인 (2) 관련 테스트 실행 (3) 콘솔 오류 0 확인 (4) `python3 game/tools/build.py` 성공.
- 개발용 주소 옵션: `?unlock`, `?app=<id>`, `?light`, `?debug`(디버그 패널), `?seed=<n>`.

## 보고 형식
작업 끝에: 바꾼 파일 목록, 구현한 것, 설계와 다르게 한 것(이유), 테스트 명령과 결과, 남은 문제.
