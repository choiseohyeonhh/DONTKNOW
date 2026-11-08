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
  css/           os.css  apps/*.css  tokens.css
  js/
    core/
      state.js        단일 상태 트리, 변경 API, 이벤트 로그
      clock.js        게임 시계(실시간×4 — v6.2, 일시정지 메뉴에서만 정지, 접근성 모드)
      scheduler.js    EV 예약·조건 재평가·오프라인 대기열
      net.js          온라인/오프라인·동기화 적용(원격 삭제·지우기, 앱별 동기화 스위치, 다른 기기 기록 유입)
      trace.js        흔적(TR) 기록·전송 대기열 → 반응 트리거(19 문서)
      visibility.js   "지금 이 항목이 보이는가" 판정(층·온라인·삭제·게이트)
      search.js       전역 검색 색인(접근 가능 항목만)
      morph.js        DOM 패치
      save.js         자동 저장·슬롯·버전 마이그레이션
    os/
      shell.js        잠금화면·홈·상태바·제어 센터·알림·검색 UI
      apps/*.js       앱 30종(06 문서). 설정은 apps/settings/*.js 하위 메뉴 분리(18 문서). 카메라는 방 구도 뷰어
      composer.js     작성창: 추천 문장·직접 입력·공유 첨부·텍스트 대치·클립보드 칩
    verify/
      verify.js       행동 증명(V) 감지: 입력·검색·공유·설정·호출 이벤트를 V 정의와 대조(11 문서). 화면에 아무것도 띄우지 않는다
      keywords.js     직접 입력 낱말 사전(11 문서 3절), 표기 변형 정규화
      hints.js        일시정지 메뉴 "막혔을 때"(12 문서 7절)
    npc/
      dialogue.js     (인물, 상태, 입력[공유 E-ID | 추천 문장 | 사전 낱말 | 흔적 TR]) → 응답 표 실행, 지연 시간(19 문서 4절)
    story/
      endings.js      12 문서 6.4 판정 + 시네마틱 재생
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

### 3.2 열람 기록(Seen)

```json
{ "seen": { "mail.taxi.0314": "2026-03-17T21:40:00+09:00" },
  "inspected": { "photo.burst.0314.11": true } }
```

- 화면에 나오지 않는다. 힌트 단계 선택과 엔딩 후 "다시 보기" 통계에만 쓴다. 판정에 쓰지 않는다(11 문서).

### 3.3 행동 증명 정의(V)

```json
{ "id": "V-12", "kind": "taxi+input",
  "accept": [ { "event": "taxi.call", "dest": ["L-11"] },
              { "event": "final.roomInput", "value": "207" } ],
  "basis": ["E-150", "E-198", "E-219", "E-220", "E-74", "E-214b", "E-73", "E-151", "E-218"],
  "onDone": [ { "set": { "F-GO": true, "F-LOC": "exact" } } ] }
```

- `basis`는 린터용(근거가 서로 다른 앱 2개 이상인지). 게임은 플레이어가 근거를 봤는지 확인하지 않는다.

### 3.3b 흔적 정의(TR)

```json
{ "id": "TR-05", "on": "loop.story.view", "owner": ["A-14", "A-16"],
  "requires": "online && !loop.viewedAs('dontknow__')",
  "visibleTo": "owner", "react": [ { "if": "owner == 'A-14'", "ev": "EV-34" },
                                   { "if": "owner == 'A-16'", "ev": "EV-31" } ] }
```

### 3.4 사건(EV)

```json
{ "id": "EV-04", "when": { "after": "T", "plusGameMin": 18 },
  "requires": "flag.firstOnline && !dh.cancelDeletes",
  "applyOn": "online",
  "do": [ { "remoteDelete": "note.letter.dad" } ] }
```

- `applyOn: "online"` → 시각이 되었을 때 오프라인이면 대기열에 넣고 다음 온라인 때 실행(12 문서 3절 규칙).

### 3.5 조건식
`flag.X`, `gate.G-03`, `v.V-04`(행동 증명 여부), `trace.TR-02`, `dh >= 3`, `loc == 'exact'`, `item.exists('voice.37')`, `online`, `time >= '2026-03-18T08:00'` 를 `&& || !`로 결합. 파서는 화이트리스트 토큰만 허용(eval 금지).

### 3.6 NPC 대화 표

```json
{ "npc": "P-03", "state": "JH-0", "recv": { "share": "E-23" },
  "reply": ["…", "도현이 살아 있어요", "어딘지는 진짜 몰라요", "근데 걔 2월에 방 구한다고 했었어요"],
  "delayGameMin": 4, "set": { "jh": "JH-1" }, "makeItem": null }
```

- `recv`는 `{share}` / `{chip}` / `{keyword}` / `{trace}` 중 하나. `makeItem`은 진술 캡처 같은 새 항목(E-108 등)을 생성.

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
- `requestAnimationFrame` 기반 누적. 탭이 백그라운드면 정지(`visibilitychange`). 일시정지 메뉴·시네마틱에서만 정지.
- 모든 EV 시각은 게임 분 단위로 저장. 실시간 변환은 표시용.

## 5. 콘텐츠 린터 (정합성 자동 검사)

`tools/lint_content.py`가 빌드 전 검사한다.

| 검사 | 내용 |
|---|---|
| ID 참조 | verify·traces·events·npc의 모든 E/G/EV/V/TR 참조가 존재하는가 |
| 이중 경로 | 필수 V(11 문서 ○)마다 `basis`가 서로 다른 `app` 2개 이상인가(P4) |
| 소실 안전 | 각 필수 V의 `basis` 중 `remoteDelete`·실장 정리(EV-22/23) 대상이 아닌 항목이 서로 다른 앱 2개 이상 남는가 |
| 흔적 짝 | 모든 TR이 반응(EV 또는 상태 변화)을 가지는가, 모든 반응 EV가 트리거를 가지는가 |
| 낱말 사전 | V의 직접 입력 값과 6.2 유출 낱말이 사전에 있는가 |
| 미끼 격리 | L-11(해담) 근거 항목이 전부 T2인가(E-130 댓글 한 줄 예외 목록) |
| 타임라인 | 항목 `ts`가 02 문서 연대기와 같은지(연대기를 JSON으로도 보관 `timeline.json`) |
| 이동 시간 | 같은 인물의 연속 위치 사이 시간이 08 문서 이동 시간표 이상인가 |
| 앎 매트릭스 | NPC 응답 문장에 금지 키워드(인물별 ✕ 정보의 키워드 목록)가 있는가 |
| 금칙어 | 01 문서 7절(수법 구체어 목록) |

## 6. 테스트

| 테스트 | 내용 |
|---|---|
| route_a.js | 070921 → 680403 → 온라인 → EV-06 "아빠다" → 카메라 서랍 → DH-3 → 은행 110221 → 경찰 메일(녹음) → 한끼 확인 → 택시 "해담고시텔" → "207" → 한결 이체 공유 → 엔딩 A. **클릭·입력만** |
| route_a2.js | 같은 경로, 빚 공유 생략 → A′ |
| route_b.js | 예약 메일 삭제(경찰에 아무것도 안 보냄) → B |
| route_c.js | 택시 "청운고시원" → C / 해담 도착했지만 위협 미해소 → C |
| route_d.js | 블링크에 "해담" 입력 → D / 무응답 → 원격 지우기(녹음 device) → D |
| crisis.js | 오프라인 대기열: 비행기 모드 중 EV-04/05 시각 경과 → 온라인 순간 일괄 삭제 / 메모 동기화 끈 뒤 EV-04 무효 |
| traces.js | TR-02(아빠 톡 읽음) → EV-30 / TR-05(서아 스토리) → EV-34 / 미리보기 설정 후 블링크 무읽음 → KS-0 유지 |
| moved.js | DH-2에서 "해담" 입력 → F-MOVED → 07:10 한끼 배송지 성원스파 |
| 불변식 | 모든 테스트에서 페이지 에러 0, 화면에 판정·정답 문구가 한 번도 나오지 않음 |

## 7. 기존 코드 재사용 판단

| 자산 | 판단 |
|---|---|
| `mvp/js/engine.js`의 `morph()`, 시계 배속, 디버그 패널 패턴 | 개념 재사용(새로 작성, 복사 시 v5 의존 제거) |
| 프로토타입 상태바·알림·통화 UI | 참고만. LUMA 디자인으로 다시 그림 |
| `mvp/build.py` | 구조 재사용(새 폴더용으로 복사·수정) |
| 세션 DSL(SAY/CHOICE…) | **폐기.** 대화는 표 기반(3.6) |
| v5 이미지 51장 | 폐기(13 문서 스타일 불일치). 일부 구도 참고만 |
