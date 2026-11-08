# 14. 기술 아키텍처와 데이터 구조

> 전제: Mac/Xcode 없이 PC + iPhone에서 개발·테스트. **모바일 웹**이 1차 플랫폼. 이번 단계는 설계만 하며 `prototype/`, `mvp/` 코드는 건드리지 않는다. v6 구현은 새 폴더(`game/`)에서 시작한다.

## 1. 기술 선택

| 항목 | 결정 | 이유 |
|---|---|---|
| 언어 | 바닐라 JavaScript(ES2020 모듈) + JSDoc 타입 주석 | v5 MVP에서 검증. 빌드 도구 의존 최소. 타입 검사는 `tsc --checkJs`로 선택 |
| 렌더링 | DOM + CSS, 자체 `morph()` 패치 | 실시간 이벤트가 많아 전체 다시 그리기 금지(v5 깜빡임 교훈) |
| 상태 | 단일 상태 트리 + 이벤트 로그(재생 가능) | 세이브·리플레이·디버그 |
| 콘텐츠 | JSON(사람이 편집) → 빌드 시 검증·인라인 | 작가와 개발 분리, ID 참조 검사 |
| 빌드 | Python 빌드 스크립트 → **단일 HTML**(이미지·폰트 인라인) | 배포·공유 단순. 아티팩트·정적 호스팅 |
| 테스트 | Playwright(클릭만으로 엔딩 경로 재현) + 콘텐츠 린터 | v5에서 검증된 방식 |
| 저장 | localStorage(자동 저장 + 슬롯 3) | 서버 없음 |
| 외부 의존 | 없음(CDN·라이브러리 금지) | 오프라인 플레이, 심의·보안 |

## 2. 모듈 구성

```
game/
  index.html
  css/           os.css  notebook.css  apps/*.css  tokens.css
  js/
    core/
      state.js        단일 상태 트리, 변경 API, 이벤트 로그
      clock.js        게임 시계(실시간×6, 수첩 열면 정지, 접근성 모드)
      scheduler.js    EV 예약·조건 재평가·오프라인 대기열
      net.js          온라인/오프라인·동기화 적용(원격 삭제·지우기 실행)
      visibility.js   "지금 이 항목이 보이는가" 판정(층·온라인·삭제·게이트)
      search.js       전역 검색 색인(접근 가능 항목만)
      morph.js        DOM 패치
      save.js         자동 저장·슬롯·버전 마이그레이션
    os/
      shell.js        잠금화면·홈·상태바·제어 센터·알림·검색 UI
      apps/*.js       앱 18종(06 문서). 앱은 world 데이터만 읽고 state를 통해서만 바꾼다
    notebook/
      notebook.js     5탭 UI
      cards.js        카드 생성(facets·strength)
      judge.js        판정 엔진(11 문서 3절)
      hints.js        여백 힌트
    npc/
      dialogue.js     (인물, 상태, 보낸 것) → 응답 표 실행
    story/
      endings.js      12 문서 6.4 판정 + 시네마틱 재생
    debug/
      panel.js        ?debug=1: 시각 이동, 게이트 열기, 플래그, EV 강제 발생
  content/
    world.json        인물·계정·기기·장소
    items/*.json      앱별 항목(메시지·사진·메일·거래…)
    evidence.json     E-xx ↔ 항목 매핑, facets, note
    judge.json        C/I/Q/F 정의
    events.json       EV 정의
    npc/*.json        대화 표
    endings.json
  img/  fonts/
  tools/
    build.py          단일 HTML 빌드
    lint_content.py   ID 참조·앎 매트릭스·타임라인 검사
  tests/
    route_a.js route_b.js route_c.js route_d.js crisis.js
```

## 3. 데이터 모델

### 3.1 항목(Item) — 폰 속 모든 것의 공통 형태

```json
{
  "id": "mail.taxi.0314",
  "app": "mail",
  "account": "A-01",
  "kind": "mail",
  "ts": "2026-03-14T21:23:00+09:00",
  "place": "L-02",
  "layer": "T1",
  "gate": null,
  "storage": "cloud",
  "remoteDelete": null,
  "evidence": "E-12",
  "data": {
    "from": "receipt@baro-taxi.kr",
    "subject": "이용 영수증",
    "body": "…",
    "meta": { "pickup": "리버뷰타워", "pickupTs": "21:05", "drop": "성원구청역 2번 출구", "dropTs": "21:22", "fare": 12400 }
  },
  "search": ["바로택시", "리버뷰타워", "성원구청역", "12400"]
}
```

| 필드 | 의미 |
|---|---|
| `layer` | T0~T3(04 문서 3절). `visibility.js`가 사용 |
| `storage` | `device` / `cloud` / `server`(예약 메일) — 09 문서 1절 |
| `remoteDelete` | 원격 삭제 EV ID(예: `"EV-04"`). 해당 EV 적용 시 영구 삭제 |
| `gate` | 이 항목을 열기 위해 필요한 G-xx |
| `evidence` | 핵심 증거면 E-xx, 노이즈면 null |
| `search` | 검색 색인 키워드(본문 자동 색인에 추가) |

### 3.2 카드(Card)

```json
{ "cid": "c17", "src": "mail.taxi.0314", "evidence": "E-12",
  "facets": ["time", "place", "text"], "strength": "strong",
  "note": "택시. 리버뷰에서 9시 5분. 성원구청역 9시 22분",
  "pinnedAt": "2026-03-17T22:05:00+09:00" }
```

- `facets`는 붙일 때 플레이어가 그 항목의 정보(i)를 열었는지(`state.inspected[itemId]`)로 결정.

### 3.3 판정 정의

```json
{ "id": "Q-01", "type": "question",
  "text": "폰은 어떻게 도현이 손을 떠났나",
  "appearsWhen": "always",
  "sets": [ { "all": [ ["E-12", "E-12b"], ["E-01", "E-02"] ], "facets": ["place"] } ],
  "minStrong": 1,
  "success": "택시에 두고 내렸다. 누가 뺏은 게 아니다.",
  "partial": { "missingFacet.time": "어디서인지는 알겠는데 언제인지 모르겠다." },
  "miss": ["이건 다른 얘기다.", "시간이 안 맞는다."],
  "onSuccess": [ { "reveal": "Q-05" } ] }
```

- `all`의 각 원소는 "이 중 하나"(대체 증거 목록).
- `appearsWhen` / `onSuccess`는 조건식 문법(아래 3.5)을 쓴다.

### 3.4 사건(EV)

```json
{ "id": "EV-04", "when": { "after": "T", "plusGameMin": 18 },
  "requires": "flag.firstOnline && !dh.cancelDeletes",
  "applyOn": "online",
  "do": [ { "remoteDelete": "note.letter.dad" } ] }
```

- `applyOn: "online"` → 시각이 되었을 때 오프라인이면 대기열에 넣고 다음 온라인 때 실행(12 문서 3절 규칙).

### 3.5 조건식
`flag.X`, `gate.G-03`, `q.Q-04`(성공 여부), `dh >= 3`, `loc == 'exact'`, `item.exists('voice.37')`, `online`, `time >= '2026-03-18T08:00'` 를 `&& || !`로 결합. 파서는 화이트리스트 토큰만 허용(eval 금지).

### 3.6 NPC 대화 표

```json
{ "npc": "P-03", "state": "JH-0", "recv": "E-23",
  "reply": ["…", "도현이 살아 있어요", "어딘지는 진짜 몰라요", "근데 걔 2월에 방 구한다고 했었어요"],
  "delayGameMin": 4, "set": { "jh": "JH-1" }, "makeCard": null }
```

## 4. 핵심 알고리즘

### 4.1 가시성(visibility)
```
visible(item) =
  item.layer 열림 (T0 항상, T1 = gate.G-01, T2 = online 또는 캐시 존재)
  && (item.gate == null || gate 열림)
  && !deleted[item.id]
  && (item.storage != 'server' || online)
```
- **캐시 규칙:** T2 항목 중 한 번 온라인에서 본 것은 캐시되어 오프라인에서도 보인다(루프 프로필 등). 단, 원격 삭제 대상은 다음 온라인 때 캐시에서도 사라진다.

### 4.2 동기화 적용(net.js)
1. 온라인 전환 시: 대기열의 원격 행동을 시각순으로 적용(삭제 → 알림 문구 → 화면 행 페이드).
2. 원격 지우기 명령이 대기열에 있으면 **다른 무엇보다 먼저** 실행 → 지우기 연출 → 폰 잠금 상태 `wiped`.
3. 이 폰에서의 대기 변경(예약 메일 수정, 녹음 업로드)은 그 뒤 업로드.

### 4.3 시계
- `requestAnimationFrame` 기반 누적. 탭이 백그라운드면 정지(`visibilitychange`). 수첩 열림·시네마틱·설정 화면에서 정지.
- 모든 EV 시각은 게임 분 단위로 저장. 실시간 변환은 표시용.

## 5. 콘텐츠 린터 (정합성 자동 검사)

`tools/lint_content.py`가 빌드 전 검사한다.

| 검사 | 내용 |
|---|---|
| ID 참조 | judge·events·npc의 모든 E/G/EV/Q/C/I 참조가 존재하는가 |
| 이중 경로 | 필수 Q(Q-01~Q-08)마다 서로 다른 `app`의 증거로 이루어진 성공 조합이 2개 이상인가(P4) |
| 소실 안전 | 각 필수 Q에 `remoteDelete`가 없는 증거만으로 이루어진 성공 조합이 1개 이상인가 |
| 타임라인 | 항목 `ts`가 02 문서 연대기와 같은지(연대기를 JSON으로도 보관 `timeline.json`) |
| 이동 시간 | 같은 인물의 연속 위치 사이 시간이 08 문서 이동 시간표 이상인가 |
| 앎 매트릭스 | NPC 응답 문장에 금지 키워드(인물별 ✕ 정보의 키워드 목록)가 있는가 |
| 금칙어 | 01 문서 7절(수법 구체어 목록) |

## 6. 테스트

| 테스트 | 내용 |
|---|---|
| route_a.js | 잠금 해제 → 온라인 → EV-06에 "아빠다" → 내 폰 톡 → Q-01~08 → "한결 거 아빠가 알아" → 고시원 304 → 엔딩 A. **클릭만** |
| route_b.js | 예약 메일 삭제 → B |
| route_c.js | 시러스 암호 변경(단절) → 녹음 메일 → 09:00 → C |
| route_d.js | 블링크에 Q-07 카드 → D / 무응답 → 원격 지우기 → D |
| crisis.js | 오프라인 대기열: 비행기 모드 중 EV-04/05 시각 경과 → 온라인 순간 일괄 삭제 확인 |
| 불변식 | 모든 테스트에서 페이지 에러 0, 원격 삭제 후 카드 strength=weak 확인 |

## 7. 기존 코드 재사용 판단

| 자산 | 판단 |
|---|---|
| `mvp/js/engine.js`의 `morph()`, 시계 배속, 디버그 패널 패턴 | 개념 재사용(새로 작성, 복사 시 v5 의존 제거) |
| 프로토타입 상태바·알림·통화 UI | 참고만. LUMA 디자인으로 다시 그림 |
| `mvp/build.py` | 구조 재사용(새 폴더용으로 복사·수정) |
| 세션 DSL(SAY/CHOICE…) | **폐기.** 대화는 표 기반(3.6) |
| v5 이미지 51장 | 폐기(13 문서 스타일 불일치). 일부 구도 참고만 |
