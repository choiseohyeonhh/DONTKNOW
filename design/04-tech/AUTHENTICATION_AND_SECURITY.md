# AUTHENTICATION_AND_SECURITY — 게임 속 인증과 실제 보안

> **역할:** (a) 게임 속 인증 체계(잠금·메모·은행·부계정·블링크)의 입력 형식·오답 처리·잠김 상태를 캐논 값으로 고정하고, (b) 실제 제품의 보안 경계(외부 요청 0, CSP, localStorage, 빌드 산출물, 콘텐츠 안전)를 정하며, (c) 블링크의 보안 표현 원칙을 고정한다.
> **단일 출처:** 이 문서(게임 인증 구현·실제 보안·블링크 표현 원칙). 인증에 쓰이는 캐논 값의 원본은 [04](../01-product/BUSINESS_RULES.md)·[05](../03-features/SYSTEM_SHELL_SPECIFICATION.md)·[06](../01-product/FEATURE_SPECIFICATION.md)·[11](../01-product/ACTION_PROOF.md)·[12](../01-product/PROGRESSION_AND_ENDINGS.md)·[18](../03-features/SETTINGS_SPECIFICATION.md)이다.
> **참조:** [STATE_MANAGEMENT](./STATE_MANAGEMENT.md) 5절, [BACKEND_ARCHITECTURE](./BACKEND_ARCHITECTURE.md) 1·7절, [DATABASE_SCHEMA](./DATABASE_SCHEMA.md) 5절, [SECURE_MESSAGING_SPECIFICATION](../03-features/SECURE_MESSAGING_SPECIFICATION.md), [PRODUCT_PRINCIPLES](../00-foundation/PRODUCT_PRINCIPLES.md) 2절.
> **적용 버전:** v6.2 (2026-11). **실제 사용자 인증·서버 인증·OAuth·비밀번호 저장은 없다.**

## 1. 실제 인증이 없다는 뜻

- 플레이어는 계정을 만들지 않는다. 로그인·회원가입·이메일 인증·비밀번호 재설정이 없다.
- 게임 속 인증은 **로컬 상태 비교**다. 입력값을 콘텐츠의 정답 문자열과 비교하고, 맞으면 상태를 바꾼다.
- 비밀번호는 해시·암호화하지 않는다. 애초에 실제 비밀번호가 아니며, 세이브에 정답 문자열이 들어 있어도 보안 문제가 아니다.
- 실제 개인정보·실제 계정·실제 메시지를 받지 않는다.

## 2. 게임 속 인증 체계

### 2.1 한눈에 보기

| 인증 | 화면 | 입력 형식 | 정답(캐논) | 오답 처리 | 잠김 상태 | 출처 |
|---|---|---|---|---|---|---|
| 기기 잠금 | `SCR-OS-LOCK` | 숫자 6자리 | **070921** | 오답 횟수 +1. **6회째부터 30초 대기**. 잠금 초기화 없음 | 대기 중 키패드 비활성, 남은 초 표시 | [05](../03-features/SYSTEM_SHELL_SPECIFICATION.md), [11](../01-product/ACTION_PROOF.md) V-01, [12](../01-product/PROGRESSION_AND_ENDINGS.md) G-01 |
| 메모 암호 | `SCR-NOTE-LOCKED` | 숫자 6자리 | **680403** | 오답 5회 시 힌트 "아빠"를 다시 보여 준다. 잠기지 않는다 | 없음(무제한 재시도) | [PERSONAL_DATA_APPS](../03-features/PERSONAL_DATA_APPS_SPECIFICATION.md), [11](../01-product/ACTION_PROOF.md) V-02, [12](../01-product/PROGRESSION_AND_ENDINGS.md) G-06 |
| 누리은행 간편비밀번호 | `SCR-BANK-LOGIN` | 숫자 6자리 | **110221** | 캐논 미정. 구현은 즉시 재입력 허용(잠금 없음) | 없음 | [COMMERCE_AND_FINANCE](../03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md), [11](../01-product/ACTION_PROOF.md) V-03, [12](../01-product/PROGRESSION_AND_ENDINGS.md) G-03 |
| 루프 부계정 로그인 | `SCR-LOOP-ACCOUNT-SWITCH` | 메일로 받은 숫자 6자리 코드 | **메일 코드**(고정 문자열이 아니라 `mail.json`의 코드 항목) | 캐논 미정. 구현은 코드 유지·재전송 허용 | 코드 만료 10분(설계), 1회용(설계) | [11](../01-product/ACTION_PROOF.md) V-08, [12](../01-product/PROGRESSION_AND_ENDINGS.md) G-04, [18](../03-features/SETTINGS_SPECIFICATION.md) |
| 블링크 세션 | `SCR-BLINK-LIST` | 로그인 입력 없음 | 이 기기에 이미 로그인됨 | 해당 없음 | **한 기기에만 로그인**. 다른 기기 로그인 UI 없음 | [SECURE_MESSAGING](../03-features/SECURE_MESSAGING_SPECIFICATION.md), [03](../01-product/CHARACTERS.md) A-21, [12](../01-product/PROGRESSION_AND_ENDINGS.md) G-05 |
| 시러스 암호 변경 | `SCR-SET-CIRRUS-SECURITY` | 기기 암호 070921 + 새 암호 | 기기 암호 **070921** | 오답 시 변경 불가. 기기 잠금과 같은 30초 규칙을 적용하지 않는다(즉시 재입력) | 없음 | [18](../03-features/SETTINGS_SPECIFICATION.md), [04](../01-product/BUSINESS_RULES.md) 4절 해법 4 |
| 저장된 로그인 열람 | `SCR-SET-PASSWORDS` | 기기 암호 070921 | **070921** | 즉시 재입력 허용 | 없음 | [18](../03-features/SETTINGS_SPECIFICATION.md) |

> **정답 값은 캐논 그대로다.** 680403은 **메모 암호**다.
> 기기 잠금은 070921이다.

### 2.2 기기 잠금(070921)

| 항목 | 규칙 |
|---|---|
| 표시 | 6자리 점. 숫자 키패드. 왼쪽 아래 "응급", 오른쪽 아래 카메라 |
| 입력 | 숫자 0~9만. 6자리 입력 시 자동 제출 |
| 정답 | `070921` |
| 오답 | 입력 초기화. `lockAttempts += 1` |
| 대기 | `lockAttempts >= 6`이면 30초 대기. 대기 중 입력 무시. 남은 초는 숫자로 표시 |
| 잠금 초기화 | 없음. 30초가 지나면 다시 입력 가능 |
| 성공 | `device.locked = false`, `gates['G-01'] = true`, `action.unlock` 이벤트. 연출 없음 |
| 힌트 | 응급정보의 생년월일. 화면에 정답을 직접 쓰지 않는다 |
| 상태 | `state.device.lockAttempts`, `state.device.lockoutUntilGameMs`(실시간 대기) |

- 30초 대기는 **실시간**이다. 게임 시계(×4)와 무관하다. 일시정지 메뉴에서도 대기 시간은 흐른다(UX 단순화). 이는 [05](../03-features/SYSTEM_SHELL_SPECIFICATION.md) "오답 6회째부터 30초 대기"를 그대로 구현한 것이다.
- 대기 중 앱 전환·검색은 할 수 없다(잠금화면이 최상위).

### 2.3 메모 암호(680403)

| 항목 | 규칙 |
|---|---|
| 표시 | 잠긴 메모 목록 위에 암호 입력 시트. 힌트 문구 "아빠" |
| 입력 | 숫자 6자리 |
| 정답 | `680403` |
| 오답 | 5회째에 힌트를 다시 표시. 잠금·대기 없음 |
| 성공 | `gates['G-06'] = true`. "비번"·"아빠한테" 열림 |
| 상태 | `state.apps.note.passwordAttempts`, `state.apps.note.unlocked` |

- 메모 암호는 **잠긴 메모 전체**가 하나의 암호를 쓴다([PERSONAL_DATA_APPS](../03-features/PERSONAL_DATA_APPS_SPECIFICATION.md)).
- 원격 삭제(EV-04)는 암호를 풀었든 안 풀었든 적용된다. 잠금이 삭제를 막지 않는다.

### 2.4 누리은행(110221)

| 항목 | 규칙 |
|---|---|
| 조건 | 온라인(`G-02`) + 잠긴 메모 "비번" 열람(`G-06`) 후 규칙을 알 수 있다 |
| 표시 | 간편비밀번호 6자리 |
| 정답 | `110221` |
| 오답 | 캐논에 규칙 없음. **잠금 없음·즉시 재입력**. 30초 대기를 적용하지 않는다 |
| 성공 | `gates['G-03'] = true`. 거래내역 열림 |
| 상태 | `state.apps.bank.unlocked`, `state.apps.bank.failedAttempts` |

- 은행 잠금은 "보안 기능"이 아니라 **추리 게이트**다. 오답에 시간 페널티를 주지 않는다([PLAYTIME_BUDGET](../01-product/PLAYTIME_BUDGET.md) "오답 페널티 없음").
- 정답을 화면에 직접 쓰지 않는다. 근거는 E-26·E-17·E-07.

### 2.5 루프 부계정 로그인 코드

| 항목 | 규칙 |
|---|---|
| 조건 | 온라인. 메일 두 번째 계정(`A-02`, dk.nowhere@mailbox.kr) 접근 |
| 코드 | 메일 앱에 `mail.loop.code.0317` 항목으로 표시되는 **숫자 6자리** |
| 표시 | `SCR-LOOP-ACCOUNT-SWITCH`에 6자리 입력 |
| 오답 | 캐논에 규칙 없음. **잠금 없음**. 코드는 유지되고 "코드 다시 받기" 가능 |
| 만료 | 설계: 실시간 10분(게임 40분). 만료 시 "코드가 만료되었습니다. 다시 받기" |
| 성공 | `gates['G-04'] = true`. `TR-10` 발생, 도현 경계 +1 |
| 상태 | `state.apps.loop.loginCode`, `state.apps.loop.codeExpiresAtGameMin` |

- 저장된 로그인(`E-201`)의 암호는 **3/15 01:10에 변경되어** 사용할 수 없다. 플레이어는 메일 코드로만 들어간다([18](../03-features/SETTINGS_SPECIFICATION.md)).
- 코드 만료·1회용은 **설계 결정**이다. 캐논은 "메일 코드 6자리"만 정한다. [확인 사항](#확인-사항) 참조.

### 2.6 블링크 단일 기기

| 항목 | 규칙 |
|---|---|
| 로그인 | 이 폰에 이미 로그인된 상태(`A-21`, "dk"). 로그인 화면이 없다 |
| 세션 | `state.apps.blink.session = 'D-01'`. 하나뿐 |
| 다른 기기 | 로그인 UI·기기 추가 없음. "이 기기에만 저장" 문구만 표시 |
| 이유 | 캐논: 블링크는 한 기기에만 로그인된다([SECURE_MESSAGING](../03-features/SECURE_MESSAGING_SPECIFICATION.md)). 도현은 슬레이트로 이 대화를 볼 수 없다 |
| 로그아웃 | 없음. 앱 삭제·재설치 없음 |
| 캡처 | 스크린샷·화면 기록 시 상대에게 표시(게임 규칙) |

- 블링크의 "단일 기기"는 실제 세션 관리가 아니다. 상태 값 하나와 UI 문구다.

### 2.7 인증 상태와 흔적

| 인증 성공 | 상태 변화 | 흔적 |
|---|---|---|
| 기기 잠금 | `G-01`, `device.locked=false` | 온라인이면 TR-01(첫 온라인과 결합) |
| 메모 암호 | `G-06` | 없음 |
| 은행 | `G-03` | 없음 |
| 부계정 | `G-04` | **TR-10**(새 기기 로그인), DH 경계 +1 |
| 블링크 열기 | 없음 | **TR-06**(읽음·캡처) |
| 시러스 암호 변경 | 슬레이트 로그아웃 | **TR-15**, DH-X |
| 저장된 로그인 열람 | 없음 | 없음 |

## 3. 실제 보안

### 3.1 외부 요청 0

| 항목 | 규칙 |
|---|---|
| 네트워크 API | `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon` 금지 |
| 외부 URL | CDN·폰트·이미지·스크립트 URL 금지. 모든 자산은 data URI |
| 서비스 워커 | 사용하지 않는다 |
| 링크 | 외부 링크를 열지 않는다. `target="_blank"` 금지 |
| 분석·오류 수집 | 없음. `window.__errors`는 메모리 링버퍼 |

### 3.2 CSP

단일 HTML이므로 인라인 스크립트·스타일을 허용해야 한다. 대신 **연결과 외부 출처를 전부 막는다.**

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'none';
  script-src 'unsafe-inline';
  style-src 'unsafe-inline';
  img-src data: blob:;
  font-src data:;
  media-src data: blob:;
  connect-src 'none';
  object-src 'none';
  base-uri 'none';
  form-action 'none';
  frame-ancestors 'none';
">
```

| 지시문 | 이유 |
|---|---|
| `default-src 'none'` | 기본 차단 |
| `script-src 'unsafe-inline'` | 단일 HTML의 인라인 스크립트. 외부 스크립트는 없음 |
| `style-src 'unsafe-inline'` | 인라인 CSS. 외부 스타일 없음 |
| `img-src data: blob:` | 인라인 이미지·가상 미디어 썸네일 |
| `font-src data:` | 인라인 Pretendard |
| `connect-src 'none'` | **네트워크 요청 0** 강제 |
| `object-src 'none'` | 플러그인 차단 |
| `base-uri 'none'` | base 태그 주입 차단 |
| `form-action 'none'` | 폼 전송 차단 |
| `frame-ancestors 'none'` | 임베드 차단. **meta에서는 무시될 수 있으므로 정적 호스팅 시 HTTP 헤더로도 준다** |

- `eval`·`new Function`·`setTimeout(string)` 금지. 조건식은 화이트리스트 파서([DATABASE_SCHEMA](./DATABASE_SCHEMA.md) 3.7).
- CSP는 `unsafe-inline` 때문에 XSS를 막지 못한다. **1차 방어는 출력 이스케이프**다(3.4).

### 3.3 localStorage

| 항목 | 규칙 |
|---|---|
| 저장 내용 | 게임 상태·설정·세이브 메타만 |
| 실제 개인정보 | 저장하지 않는다. 실제 이름·전화번호·이메일·위치·기기 ID를 받지 않는다 |
| 가상 개인정보 | 캐논의 가상 인물·계정·전화번호(마스킹된 `010-XXXX-2290` 등)만 |
| 추적 식별자 | 없음. UUID·핑거프린트·광고 ID 없음 |
| 만료 | 없음. 플레이어가 삭제하기 전까지 유지 |
| 암호화 | 하지 않는다. 비밀값이 없으므로 불필요 |
| 용량 | 세이브 ≤ 512KB, 전체 ≤ 2MB 목표 |

- `localStorage` 접근은 `core/save.js`만 한다. 다른 모듈이 직접 읽지 않는다.
- Safari 프라이빗 모드·용량 초과는 [ERROR_HANDLING](../05-quality/ERROR_HANDLING.md) 3절.

### 3.4 출력 이스케이프·DOM 안전

- 플레이어가 입력한 텍스트, NPC 대사, 콘텐츠 문자열을 HTML에 넣을 때는 **반드시 이스케이프**한다. `textContent`를 우선하고, HTML 문자열 조립 시 `escapeHtml()`을 거친다.
- `innerHTML`에 원시 입력을 넣지 않는다. `morph()`도 HTML 문자열을 받으므로 렌더 함수가 이스케이프 책임을 진다.
- 콘텐츠는 신뢰하지만, 빌드 린터가 스키마·금칙어를 검사한다. 그래도 런타임 이스케이프를 생략하지 않는다.
- `href`·`src`에 동적 문자열을 넣지 않는다. 자산은 빌드 시 고정된 data URI 키만 쓴다.

### 3.5 빌드 산출물

| 항목 | 규칙 |
|---|---|
| 비밀값 | API 키·토큰·서버 주소·계정을 넣지 않는다 |
| 소스맵 | 배포 산출물에 넣지 않는다 |
| 빌드 정보 | `window.__BUILD__`에 앱 버전·콘텐츠 버전·해시만 |
| 디버그 코드 | `?debug=1` 게이트로 비활성. 제거 빌드는 선택 |
| 라이선스 | 외부 라이브러리가 없으므로 번들 라이선스 고지 불필요. 폰트 라이선스는 별도 확인 |

### 3.6 콘텐츠 안전(소재 원칙)

- 사기는 **흐름(누가·언제·얼마)**만 쓴다. 사기 대본·세탁 방식·계정 탈취·수사 회피 요령을 쓰지 않는다([01](../00-foundation/PRODUCT_PRINCIPLES.md) 2절).
- 업무수칙·교육자료 PDF는 제목과 첫 줄만 판독된다. 전문을 쓰지 않는다.
- 실제 서비스명·실존 브랜드를 게임 UI에 쓰지 않는다. 앱 이름은 캐논 이름만.
- 린터 금칙어(L10)가 위반을 빌드 전에 막는다. 금칙어 목록은 [DATABASE_SCHEMA](./DATABASE_SCHEMA.md) 5절.
- 폭력은 메시지로만. 자해·자살을 다루지 않는다.

### 3.7 위협 모델

| 위협 | 영향 | 대응 | 허용 여부 |
|---|---|---|---|
| 플레이어가 개발자 도구로 상태·세이브를 바꿈 | 진행 조작 | 없음 | **허용**(1인용) |
| XSS(플레이어 입력) | 로컬 실행 | 출력 이스케이프, CSP | 차단 |
| 악성 콘텐츠 JSON | 빌드 시 실행 | 콘텐츠는 데이터만. 린터·스키마 | 차단 |
| 외부 요청으로 정보 유출 | 없음 | `connect-src 'none'`, 코드에 네트워크 API 없음 | 차단 |
| 세이브 손상 | 진행 손실 | 체크섬·백업·슬롯 | 복구 |
| 실제 개인정보 저장 | 프라이버시 | 가상 데이터만 | 차단 |
| 게임 속 "해킹"을 현실로 재현 | 사회적 위험 | 수법 미기술, 가족이 가진 것만 | 콘텐츠 정책 |

## 4. 블링크 보안 표현 원칙

### 4.1 말해도 되는 것(동작)

| 문구 | 의미 |
|---|---|
| "이 기기에만 저장" | 이 폰에만 대화가 있다는 게임 규칙 |
| "읽고 60초 뒤 삭제" | 읽음 후 삭제 타이머 |
| "스크린샷하면 상대에게 표시됩니다" | 게임 규칙 |
| "한 기기에만 로그인" | 세션 상태 |
| "읽음은 즉시 전송됩니다" | 게임 규칙(지연 없음) |

### 4.2 말하면 안 되는 것(암호학적 보장)

- "종단간 암호화", "암호화되어 안전합니다", "서버도 내용을 볼 수 없습니다", "완전 삭제 보장", "복구 불가".
- 실제 암호·보안 프로토콜을 설명하거나 암시하지 않는다.
- 스크린샷 감지·삭제를 실제 기기 기능처럼 단정하지 않는다. **게임 규칙**임을 문서에만 적고, UI는 동작만 말한다.

### 4.3 게임 자체의 사실

- 이 게임은 **어떤 실제 메시지도 저장·전송하지 않는다.** 블링크 대화는 콘텐츠 JSON과 상태 트리다.
- 60초 삭제·캡처 감지·읽음 전송은 전부 시뮬레이션이다. 실제 기기 API(`getUserMedia`, `MediaRecorder`, 클립보드 감시)를 쓰지 않는다.
- 실제 스크린샷 API도 쓰지 않는다. 스크린샷은 가상 미디어 항목이다([FILE_AND_MEDIA_MANAGEMENT](./FILE_AND_MEDIA_MANAGEMENT.md) 6절).

## 확인 사항

- `Q-OPEN-T17`: 은행(110221)의 오답 잠금 없음은 [COMMERCE_AND_FINANCE](../03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md)가 확정했다. 부계정 메일 코드의 만료 시간(이 문서는 10분)·1회용 여부·재전송 횟수는 캐논에 없어 설계로 두었다. 총괄이 확정해야 한다.
- `Q-OPEN-T18`: 기기 잠금 30초 대기를 **실시간**으로 둘지, 게임 시계 정지와 함께 멈출지 캐논이 명시적이지 않다. 이 문서는 실시간으로 적었다. [STATE_MANAGEMENT](./STATE_MANAGEMENT.md) 9절과 일치하는지 확인 필요.
- `Q-OPEN-T19`: 블링크 60초 삭제가 실시간 60초인지 게임 분 환산인지 [BACKEND_ARCHITECTURE](./BACKEND_ARCHITECTURE.md) Q-OPEN-T07과 같은 미결이다.
- `Q-OPEN-T20`: CSP의 `frame-ancestors`는 `<meta>`에서 무시될 수 있다. 정적 호스팅 시 HTTP 헤더로도 줄지, 파일 공유만 지원할지 [DEPLOYMENT_ARCHITECTURE](../05-quality/DEPLOYMENT_ARCHITECTURE.md)에서 확정해야 한다.
- `Q-OPEN-T21`: "디버그 코드 제거 빌드"를 만들지 여부는 [API_SPECIFICATION](./API_SPECIFICATION.md) Q-OPEN-T15와 같은 미결이다.
