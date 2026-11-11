# DEVELOPMENT_GUIDELINES — 폴더·명명·JSDoc·콘텐츠·리뷰

> **역할:** 구현 작업의 폴더·파일 명명, 코드 스타일, JSDoc, 콘텐츠 작성 규칙, 작업 단위, 코드 리뷰 체크리스트, 금지 사항을 고정한다.
> **단일 출처:** 이 문서(개발 규칙·리뷰 기준). 모듈 트리는 [FRONTEND_ARCHITECTURE](../04-tech/FRONTEND_ARCHITECTURE.md) 1절, 상태 규칙은 [STATE_MANAGEMENT](../04-tech/STATE_MANAGEMENT.md), 콘텐츠 스키마는 [DATABASE_SCHEMA](../04-tech/DATABASE_SCHEMA.md)가 단일 출처다.
> **참조:** [SYSTEM_ARCHITECTURE](../04-tech/SYSTEM_ARCHITECTURE.md), [PRODUCT_PRINCIPLES](../00-foundation/PRODUCT_PRINCIPLES.md) 2절, [CHARACTERS](../01-product/CHARACTERS.md) 6절, [SYSTEM_SHELL_SPECIFICATION](../03-features/SYSTEM_SHELL_SPECIFICATION.md), [PERFORMANCE_REQUIREMENTS](./PERFORMANCE_REQUIREMENTS.md), [TESTING_STRATEGY](./TESTING_STRATEGY.md).
> **적용 버전:** v6.2 (2026-11).

## 1. 기본 원칙

1. **설계가 코드보다 먼저다.** 캐논에 없는 사실·규칙·인물·엔딩을 코드로 만들지 않는다. 필요하면 설계 문서를 먼저 갱신한다.
2. **작게, 검증 가능하게.** 한 작업 단위는 한 모듈 또는 한 콘텐츠 묶음이다. 테스트 없이 끝내지 않는다.
3. **단일 출처를 존중한다.** 숫자·시각·ID는 캐논 문서에서만 가져온다. 코드에 복제하지 않는다.
4. **외부 의존을 늘리지 않는다.** 새 라이브러리·프레임워크·CDN·서버를 도입하지 않는다.
5. **폰이 곧 화면이다.** 폰 밖 UI(판정·카드·별도 노트 화면)를 만들지 않는다. 일시정지 메뉴만 예외다.

## 2. 폴더·파일 명명

### 2.1 폴더

```text
game/
  css/  js/  content/  img/  fonts/  tools/  tests/
```

- 모듈 트리([FRONTEND_ARCHITECTURE](../04-tech/FRONTEND_ARCHITECTURE.md) 1절) 밖에 새 폴더를 만들지 않는다.
- 설정 앱 하위 메뉴만 `js/os/apps/settings/*.js`로 나눈다.

### 2.2 파일

| 종류 | 규칙 | 예 |
|---|---|---|
| JS 모듈 | `lowerCamelCase.js` | `visibility.js`, `composer.js` |
| 앱 모듈 | 앱 ID와 동일 | `talk.js`, `loop.js`, `bank.js` |
| 시계 앱 | `clockapp.js`(코어 `clock.js`와 충돌 방지) | — |
| CSS | `kebab-case.css` | `talk.css`, `os.css` |
| 콘텐츠 | `lowerCamelCase.json` 또는 앱별 `items/<app>.json` | `world.json`, `items/mail.json` |
| 테스트 | `route_a.js`, `crisis.js` 등 [SYSTEM_ARCHITECTURE](../04-tech/SYSTEM_ARCHITECTURE.md) 6절 이름 고정 | — |
| 이미지 | 소문자·하이픈·점 | `photo.burst.0314.11.webp` |

### 2.3 식별자

| 대상 | 규칙 |
|---|---|
| 변수·함수 | `lowerCamelCase` |
| 클래스·타입(없으면 typedef) | `PascalCase` |
| 상수 | `UPPER_SNAKE_CASE` (예: `GAME_MIN_MS = 15000`) |
| 이벤트 이름 | `도메인.동작` (예: `action.input`, `trace.emit`) |
| 상태 키 | 콘텐츠와 동일한 camelCase |
| 캐논 ID | **그대로**. `E-12`, `V-04`, `TR-02`, `EV-06`, `G-03`, `F-GO`, `DH-2`, `L-11` |
| DOM 키 | `data-k="row-<id>"`, `data-keep="<scrollKey>"`, `data-action`, `data-id` |
| 화면 | `SCR-<영역>-<이름>` — 단일 출처는 [NAVIGATION_ARCHITECTURE](../02-design/NAVIGATION_ARCHITECTURE.md) |
| 컴포넌트 | `CMP-<이름>` — 단일 출처는 [COMPONENT_SPECIFICATIONS](../02-design/COMPONENT_SPECIFICATIONS.md) |

- 캐논 ID를 새로 만들지 않는다. `E-999`, `V-99` 같은 임시 ID를 커밋하지 않는다.
- 화면·컴포넌트 ID를 이 문서에서 새로 정의하지 않는다.

## 3. 코드 스타일

| 항목 | 규칙 |
|---|---|
| 모듈 | ES2020 `import`/`export`. named export 우선 |
| 들여쓰기 | 2칸 |
| 따옴표 | 작은따옴표. JSON은 큰따옴표 |
| 세미콜론 | 붙인다 |
| 줄 길이 | 120자 권장 |
| 중괄호 | 항상 |
| 비교 | `===`/`!==` |
| 비동기 | `async/await`. 콜백 지옥 금지 |
| 전역 | `window.__game`·`window.__debug`·`window.__errors`만. 그 외 전역 오염 금지 |
| 주석 | "왜"를 쓴다. 코드가 말하는 "무엇"은 쓰지 않는다 |
| 언어 | 코드 식별자·주석은 영어, 사용자 노출 문구는 콘텐츠 JSON |

- `eval`, `new Function`, 문자열 `setTimeout` 금지.
- `var` 금지. `let`/`const`.
- 구조 분해·템플릿 리터럴 사용.
- 예외는 경계에서 잡고 오류 코드로 변환한다([ERROR_HANDLING](./ERROR_HANDLING.md)).

## 4. JSDoc

- 모든 공개 함수에 `@param`·`@returns`를 쓴다.
- 공유 타입은 `core/state.js`에 `@typedef`로 둔다. 새 types 파일을 만들지 않는다.
- `@ts-check`는 선택. `tsc --checkJs`를 쓰더라도 빌드 산출물에는 타입을 넣지 않는다.

```js
/**
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} app
 * @property {'T0'|'T1'|'T2'|'T3'|'T4'} layer
 * @property {'device'|'cloud'|'server'} storage
 * @property {object} data
 */

/**
 * 항목이 지금 보이는지 판정한다.
 * @param {string} itemId
 * @returns {boolean}
 */
export function isVisible(itemId) { /* … */ }
```

- `any`를 남발하지 않는다. 불가피하면 `@type {unknown}` + 좁히기.
- 콜백 타입은 `@callback` 또는 인라인 함수 타입으로 쓴다.

## 5. 상태·렌더 규칙

| 규칙 | 내용 |
|---|---|
| 상태 변경 | `state.commit`/`transaction`/`patch`만. 직접 대입 금지 |
| 코어 | DOM·`window`·`localStorage` 접근 금지 |
| 저장 | `core/save.js`만 `localStorage` 접근 |
| 시각 | 게임 판정에 `Date.now()` 금지. `clock.getGameMin()` |
| 랜덤 | `Math.random()` 금지. 시드 PRNG |
| 사건 | `setTimeout`으로 게임 사건 발생 금지. `scheduler`만 |
| 렌더 | `morph`만. 전체 다시 그리기는 앱 전환·최초 마운트뿐 |
| 키 | 리스트 행에 안정 `data-k`. 인덱스 키 금지 |
| 스크롤 | `data-keep`으로 보존 |
| 이스케이프 | 플레이어 입력·NPC 대사는 반드시 이스케이프 |

## 6. 콘텐츠 작성 규칙

### 6.1 캐논

- 숫자·시각·금액·ID·비밀번호·대사 원문은 캐논 문서에서 그대로 옮긴다. 반올림·요약 금지.
- 캐논에 없는 이야기 사실·단서·인물·엔딩·규칙을 만들지 않는다.
- UI 구조(탭·목록·빈 화면)는 설계할 수 있다. 장식 콘텐츠는 "장식(단서 아님)"으로 표시한다.
- 모순·불명확함은 임의로 고치지 않고 해당 문서의 "확인 사항"에 적는다.

### 6.2 대사

- 인물은 자기가 모르는 것을 말할 수 없다([03](../01-product/CHARACTERS.md) 4절 앎 매트릭스).
- 메신저 문장은 짧게 쪼갠다(한 버블 = 한 생각). 인물별 말투를 지킨다.
- 플레이어가 보내는 것은 선택지가 아니라 공유·직접 입력·추천 문장이다.
- 감정은 설명하지 않는다. 읽음·지연·취소 흔적으로 보여 준다.

### 6.3 소재

- 사기는 흐름만. 사기 대본·세탁·계정 탈취·수사 회피 요령 금지([01](../00-foundation/PRODUCT_PRINCIPLES.md) 2절).
- 실제 서비스명·실존 브랜드를 UI에 쓰지 않는다. 캐논 앱 이름만.
- 폭력은 메시지로만. 자해·자살 없음.

### 6.4 하드코딩 금지

- 사용자 노출 문구는 전부 `content/*.json`에 둔다. JS·CSS에 문구를 박지 않는다.
- 예외: 디버그 패널, 오류 화면 문구(오류 문서가 단일 출처), 접근성 라벨 중 콘텐츠에 둘 수 없는 것.
- 숫자·시각을 코드에 복제하지 않는다. 콘텐츠에서 읽는다.

## 7. 작업 단위

| 단위 | 범위 | 완료 조건 |
|---|---|---|
| 모듈 작업 | 한 `core/*` 또는 `os/apps/*` | 단위 테스트 + 경로 테스트 영향 확인 |
| 콘텐츠 묶음 | 한 앱 또는 한 인물의 항목·대사 | 린터 통과 |
| 화면 작업 | 한 `SCR-*` 또는 한 앱 화면 | 스크린샷(다크/라이트) + 접근성 체크 |
| 버그 수정 | 재현 테스트 먼저 | 재현 테스트 통과 + 회귀 없음 |
| 리팩터 | 동작 변화 없음 | 기존 테스트 전부 통과 |

- 한 작업에 기능 추가와 대규모 리팩터를 섞지 않는다.
- 설계 변경이 필요하면 코드보다 문서를 먼저 고친다.
- 커밋은 사용자가 명시적으로 요청할 때만 한다. 이 저장소의 작업 지시가 git 명령을 금지하면 따른다.

## 8. 코드 리뷰 체크리스트

### 8.1 기능·상태

- [ ] 캐논 값·ID를 그대로 썼는가.
- [ ] 상태 변경이 `commit`/`transaction`을 거치는가.
- [ ] `inventory`·카드·판정 상태를 만들지 않았는가.
- [ ] 게임 판정에 `seen`·`inspected`를 쓰지 않았는가.
- [ ] `Date.now()`·`Math.random()`을 게임 로직에 쓰지 않았는가.
- [ ] 오프라인 큐·멱등성이 유지되는가.
- [ ] 세이브/복원에서 새 키가 직렬화되는가(또는 의도적으로 제외했는가).

### 8.2 렌더·입력

- [ ] 전체 다시 그리기를 하지 않았는가.
- [ ] 리스트 행에 안정 `data-k`가 있는가.
- [ ] 스크롤·포커스가 유지되는가.
- [ ] 44×44 터치 영역을 지켰는가.
- [ ] 포인터 이벤트만 썼는가(`touchstart`/`mousedown` 중복 등록 없음).
- [ ] IME 조합 중 제출하지 않는가.

### 8.3 성능·접근성

- [ ] 상호작용 100ms·60fps 예산을 넘기지 않는가.
- [ ] 이미지에 `width`·`height`·`loading`·`decoding`이 있는가.
- [ ] `prefers-reduced-motion`을 존중하는가.
- [ ] 색만으로 정보를 전달하지 않는가.
- [ ] 아이콘 버튼에 `aria-label`이 있는가.

### 8.4 보안·콘텐츠

- [ ] 외부 요청·외부 URL·새 라이브러리가 없는가.
- [ ] 플레이어 입력을 이스케이프했는가.
- [ ] `localStorage` 접근이 `save.js`뿐인가.
- [ ] 실제 서비스명·금칙어·폐기 용어가 없는가.
- [ ] 사용자 노출 문구가 콘텐츠에 있는가.
- [ ] 린터·테스트가 통과하는가.

### 8.5 문서

- [ ] 새 상태 키·이벤트·콘텐츠 필드를 문서에 반영했는가.
- [ ] 확인 사항에 미결을 적었는가.
- [ ] 링크가 새 경로로 유효한가.

## 9. 금지 목록

| 금지 | 이유 |
|---|---|
| 외부 라이브러리·프레임워크·CDN·폰트 URL | 단일 HTML·오프라인 |
| 서버·DB·인증 서버·네트워크 API | [BACKEND_ARCHITECTURE](../04-tech/BACKEND_ARCHITECTURE.md) |
| 전체 다시 그리기(앱 전환 제외) | 깜빡임·스크롤 튐 |
| JS에 사용자 노출 문구 하드코딩 | 콘텐츠/코드 분리 |
| `eval`·`new Function` | 보안·CSP |
| `innerHTML`에 이스케이프 없는 입력 | XSS |
| `localStorage` 직접 접근(코어 밖) | 저장 일관성 |
| `setTimeout`으로 게임 사건 발생 | 시계·재현성 |
| 실제 카메라·마이크·화면 캡처 API | 가상 미디어 원칙 |
| 폐기 용어: 카드 판정·C-/I-/Q- ID·기기 잠금과 메모 암호를 혼동한 서술·청운 304를 진짜 은신처로 쓰기 | v6.2 캐논 |
| 실제 서비스명을 게임 UI에 쓰기 | 가상 세계 |
| 캐논에 없는 인물·단서·엔딩 추가 | 캐논 위반 |
| git 명령을 작업 지시 없이 실행 | 저장소 규칙 |

## 10. 완료 정의(Definition of Done)

1. 설계 문서와 코드가 일치한다.
2. 콘텐츠 린터가 `--strict`로 통과한다.
3. 단위·경로 테스트가 통과한다.
4. 화면 스크린샷(다크/라이트)이 갱신됐다.
5. 성능 예산을 넘지 않는다.
6. 접근성 체크리스트를 통과한다.
7. 오류 처리 경로가 정의돼 있다.
8. 변경 사항이 문서에 반영됐다.

## 확인 사항

- `Q-OPEN-Q01`: 코드 스타일(2칸·작은따옴표·세미콜론)은 이 문서의 결정이다. 기존 `mvp/` 스타일과 완전히 같지 않을 수 있으나, `game/`은 새 폴더이므로 이 규칙을 따른다. 팀이 다른 포매터를 쓰면 이 절을 갱신한다.
- `Q-OPEN-Q02`: "커밋은 사용자가 명시적으로 요청할 때만"은 이 작업 지시의 git 금지와 같은 원칙이다. 실제 구현 단계에서 커밋 규칙이 달라지면 총괄이 정한다.
