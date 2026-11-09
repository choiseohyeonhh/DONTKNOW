# FILE_AND_MEDIA_MANAGEMENT — 이미지·폰트·인라인 빌드·가상 미디어

> **역할:** 이미지 규격(WebP·긴 변 1100·판독용 2배 레이어), 폰트 서브셋, 단일 HTML 인라인 빌드, 9MB 예산, 지연 디코딩, 게임 안 "사진 찍기/스크린샷/화면 기록"이 만드는 **가상 미디어 항목**의 데이터 표현을 고정한다.
> **단일 출처:** 이 문서(자산 규격·인라인 빌드·가상 미디어). 아트 방향·사진 원칙은 [ICONOGRAPHY_AND_IMAGERY](../02-design/ICONOGRAPHY_AND_IMAGERY.md), 빌드·배포 절차는 [DEPLOYMENT_ARCHITECTURE](../05-quality/DEPLOYMENT_ARCHITECTURE.md), 성능 예산은 [PERFORMANCE_REQUIREMENTS](../05-quality/PERFORMANCE_REQUIREMENTS.md)가 단일 출처다.
> **참조:** [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 1·2절, [FEATURE_SPECIFICATION](../01-product/FEATURE_SPECIFICATION.md), [TRACES_AND_REACTIONS](../01-product/TRACES_AND_REACTIONS.md) TR-06·07, [SYSTEM_SHELL_SPECIFICATION](../03-features/SYSTEM_SHELL_SPECIFICATION.md), [13](../02-design/ICONOGRAPHY_AND_IMAGERY.md).
> **적용 버전:** v6.2 (2026-11). **실제 카메라·마이크·화면 캡처 API를 쓰지 않는다.**

## 1. 원칙

1. **파일 하나.** 모든 자산은 빌드 시 단일 HTML에 인라인한다. 런타임에 이미지·폰트를 네트워크에서 받지 않는다.
2. **가상 미디어.** 카메라·스크린샷·화면 기록은 게임 규칙이 만드는 데이터다. 실제 기기 캡처가 아니다.
3. **읽을 것은 확대해서 읽는다.** 판독 요소(번호판·간판·문 번호·봉투 글씨)는 2배 레이어로 따로 제작한다.
4. **예산을 넘기면 빌드 실패.** 9MB는 협상 대상이 아니다.
5. **지연 디코딩.** 첫 화면에 필요한 자산만 먼저 디코딩한다.

## 2. 자산 경로·이름

```text
game/
  img/
    os/            배경화면·아이콘·상태바 글리프
    photo/         폰 속 사진
    camera/        도현의 방 4구도 + 서랍 레이어
    cine/          프롤로그·엔딩 스틸
    thumb/         목록 썸네일·스크린샷 썸네일
  fonts/
    Pretendard.game-subset.woff2
```

| 종류 | 이름 규칙 | 예 |
|---|---|---|
| 폰 사진 | `photo.<slug>.<variant>.webp` | `photo.burst.0314.11.webp` |
| 판독용 2배 | `photo.<slug>.read2x.webp` | `photo.burst.0314.11.read2x.webp` |
| 카메라 구도 | `camera.<composition>.webp` | `camera.drawer.open.webp` |
| 썸네일 | `thumb.<slug>.webp` | `thumb.loop.profile.kang.webp` |
| 시네마틱 | `cine.<id>.webp` | `cine.ending.a.01.webp` |
| 아이콘 | `os/icon.<app>.svg` | `os/icon.talk.svg` |
| 배경화면 | `os/wallpaper.family2019.webp` | — |

- 파일명은 소문자·하이픈·점만. 공백·한글·대문자 금지.
- 자산 ID는 확장자를 뺀 경로다. `assetId`는 `img/photo/photo.burst.0314.11.webp`처럼 루트 기준 경로를 쓴다.
- 같은 장면의 변형(편집본/원본/버스트/스크린샷)은 **한 원본 + 메타데이터**로 만든다. 전체 이미지를 복제하지 않는다.

## 3. 이미지

### 3.1 규격

| 항목 | 규격 |
|---|---|
| 포맷 | WebP (손실 q=78~82, 판독용 q=85) |
| 표시 크기 | 긴 변 **1100px** 기준 |
| 판독용 | 긴 변 **2200px** 이상, 확대 시에만 로드 |
| 썸네일 | 긴 변 220~320px |
| 색 공간 | sRGB |
| 알파 | 필요한 곳만(아이콘은 SVG) |
| 메타데이터 | EXIF 제거. 게임 메타는 JSON에 둔다 |
| 파일당 | 평균 ≤ 90KB, 최대 400KB |
| alt | 콘텐츠에 `alt` 필수. 장식은 `alt: ""` |

### 3.2 변형과 레이어

| 장면 | 저장 방식 |
|---|---|
| 1/20 단체사진 편집본/원본 | 원본 1장 + `edit: { crop, x, y }`. 원본 복귀는 같은 자산의 크롭 해제 |
| 3/14 버스트 18장 | 배경 1장 + 차 레이어 1장 + 18개 `{x,y,blur}` 오프셋. 11번째만 선명 |
| 번호판 38러 5512 | `read2x` 크롭 자산 1장. 확대 전에는 읽히지 않게 |
| 서랍 봉투 "박미선님 65" | `camera.drawer.open.webp` + `read2x` |
| 스크린샷 | 썸네일 자산 + `stateRef`. 실제 화면 캡처 아님(6절) |
| 화면 기록 | 대표 키프레임 1~3장 + `durationSec`. 실제 영상 아님(6절) |

- 버스트 프레임은 런타임에 이미지를 생성하지 않는다. CSS `transform`으로 레이어를 움직인다.
- 판독용 레이어는 **확대 제스처가 시작될 때** 로드한다. 목록·상세 기본 화면에서는 로드하지 않는다.

### 3.3 이미지 예산

| 구분 | 원본(raw) | 인라인(base64, ×1.37) |
|---|---|---|
| 폰 사진·카메라·시네마틱 | ≤ 4,700,000 B | ≤ 6,439,000 B |
| 썸네일 | ≤ 250,000 B | ≤ 343,000 B |
| 아이콘·SVG·배경 | ≤ 250,000 B | ≤ 343,000 B |
| **이미지 합계** | **≤ 5,200,000 B** | **≤ 7,125,000 B** |

- 이미지 단일 파일 400KB 초과 시 빌드 실패.
- 이미지 총합 5.2MB 초과 시 빌드 실패. 4.8MB 초과 시 경고.

## 4. 폰트

| 항목 | 규격 |
|---|---|
| 글꼴 | Pretendard Variable |
| 포맷 | WOFF2 |
| 서브셋 | 게임 텍스트 + 한글 상용 2,350자 + 라틴·숫자·문장부호 |
| 크기 | ≤ 650,000 B (인라인 ≤ 891,000 B) |
| 굵기 | 300~700 가변 |
| 기능 | `tnum` 유지. `font-variant-numeric: tabular-nums` |
| 표시 | `font-display: swap` |
| 대체 | `system-ui, sans-serif` — 서브셋에 없는 입력 글자는 시스템 글꼴 |
| 라이선스 | SIL OFL. 빌드 HTML 주석에 라이선스 고지 포함 |

- 플레이어가 직접 입력하는 희귀 음절은 서브셋에 없을 수 있다. 이때 시스템 글꼴로 표시한다. 입력 자체를 막지 않는다.
- `display-clock` 76/80 300은 가변 굵기 300을 포함해야 한다.
- 폰트 서브셋은 빌드 시 고정한다. 런타임에 폰트를 추가로 받지 않는다.

## 5. 인라인 빌드

`game/tools/build.py`가 다음 순서로 단일 HTML을 만든다.

```text
1. content/*.json 로드·린터 결과 확인(린터는 별도 실행)
2. img/·fonts/ 자산을 data URI로 변환
3. CSS <link> → <style> 인라인(폰트·이미지 data URI 치환)
4. JS <script src> → <script> 인라인
5. window.__CONTENT__ 인라인
6. window.__ASSETS 인라인(assetId → data URI)
7. window.__BUILD__ 인라인(appVersion·contentVersion·hash)
8. 크기 검사(9,000,000 B)
9. dist/dontknow.html 기록
```

| 규칙 | 내용 |
|---|---|
| 의존성 | Python 표준 라이브러리만. 외부 패키지 금지 |
| 결정론 | 같은 입력 → 같은 바이트(정렬·타임스탬프 고정) |
| 압축 | HTML 자체는 minify하지 않아도 된다. 크기는 자산이 지배 |
| data URI | base64. MIME은 확장자에서 추론하되 `font/woff2`는 명시 |
| 중복 | 같은 자산을 두 번 인라인하지 않는다(해시 키 재사용) |
| 누락 | 참조 자산이 없으면 빌드 실패 |
| 해시 | `sha256` 앞 16자. `window.__BUILD__.hash` |
| 비밀값 | 없음. 서버 주소·키 금지 |

### 5.1 9MB 예산 배분

| 항목 | 인라인 크기(상한) |
|---|---|
| HTML + CSS + JS + 콘텐츠 JSON | 450,000 B |
| 폰트(서브셋) | 891,000 B |
| 이미지(사진·카메라·시네마틱·썸네일·아이콘) | 7,125,000 B |
| 오디오(선택, 음성 메모·알림음) | 350,000 B |
| data URI 접두·JSON 이스케이프·여유 | 184,000 B |
| **합계** | **9,000,000 B** |

- **경고:** 8,400,000 B 초과. **실패:** 9,000,000 B 초과.
- 빌드 로그에 카테고리별 크기를 출력한다. 초과 시 어떤 자산이 예산을 먹었는지 상위 10개를 출력한다.
- gzip 전송을 하더라도 예산은 **비압축 파일 크기** 기준이다.

## 6. 가상 미디어 항목

### 6.1 정의

플레이어가 하는 다음 행동은 **가상 미디어 항목**을 만든다.

| 행동 | `kind` | 만드는 것 | 실제 API |
|---|---|---|---|
| 카메라로 도현의 방 촬영 | `camera` | 4구도 중 1장 + 서랍 레이어 | `getUserMedia` 금지 |
| 제어 센터 > 스크린샷 | `screenshot` | 현재 화면의 선언적 썸네일 | `html2canvas`·`canvas` 캡처 금지 |
| 제어 센터 > 화면 기록 | `screenRecording` | 장면 ID + 길이 + 대표 키프레임 | `MediaRecorder` 금지 |
| 공유 시트 > "스크린샷으로 저장" | `screenshot` | 공유 대상 항목의 썸네일 | 〃 |
| 외부 이미지 공유(콘텐츠) | `sharedImage` | 콘텐츠 자산 참조 | 실제 클립보드 이미지 금지 |

- **금지 API:** `navigator.mediaDevices.getUserMedia`, `MediaRecorder`, `HTMLCanvasElement.toDataURL`, `html2canvas`, `navigator.clipboard.read()`(이미지), `navigator.share`.
- 클립보드는 **텍스트 붙여넣기 칩**에만 쓴다([FRONTEND_ARCHITECTURE](./FRONTEND_ARCHITECTURE.md) 6.3). 이미지 클립보드는 쓰지 않는다.

### 6.2 데이터 표현

`state.media.virtual`에 기록하고, 사진·파일 앱에는 `items` 항목으로 노출한다.

```json
{
  "media.screenshot.20260317T2132": {
    "id": "media.screenshot.20260317T2132",
    "kind": "screenshot",
    "source": "controlCenter.screenshot",
    "createdAtGameMin": 22,
    "screen": "SCR-LOOP-PROFILE",
    "stateRef": { "account": "A-16", "scroll": 0, "theme": "dark" },
    "assetId": "img/thumb/thumb.loop.profile.kang.webp",
    "read2xAssetId": null,
    "width": 390,
    "height": 844,
    "label": "스크린샷",
    "album": "screenshots",
    "sync": { "app": "photo", "state": "pending" },
    "trace": "TR-07",
    "virtual": true
  }
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string | ✓ | `media.<kind>.<gameMin>` 또는 UUID 대신 결정론적 키 |
| `kind` | enum | ✓ | `camera`, `screenshot`, `screenRecording`, `sharedImage` |
| `source` | string | ✓ | `camera.capture`, `controlCenter.screenshot`, `controlCenter.record`, `share.saveScreenshot` |
| `createdAtGameMin` | number | ✓ | 생성 게임 시각 |
| `screen` | string `SCR-` | — | 캡처 대상 화면 ID(스크린샷) |
| `stateRef` | object | — | 화면 상태 요약. 실제 픽셀 캡처 대신 |
| `assetId` | string | ✓ | 썸네일·대표 이미지 |
| `read2xAssetId` | string \| null | — | 판독용 2배 레이어(있는 경우) |
| `width`·`height` | number | ✓ | 표시 크기(px) |
| `label` | string | ✓ | 사진 앱 표시 이름 |
| `album` | enum | ✓ | `camera`, `screenshots`, `recordings`, `shared` |
| `sync` | object | ✓ | `app`, `state`=`localOnly`\|`pending`\|`synced` |
| `trace` | string `TR-xx` \| null | — | 이 미디어가 만드는 흔적 |
| `virtual` | boolean | ✓ | 항상 `true` |

### 6.3 카메라(도현의 방)

- 4구도: `desk`, `drawer`, `bed`, `window`. 서랍은 탭하면 `drawer.open` 레이어가 열린다.
- 촬영 결과 `assetId`는 `camera.<composition>.webp`(서랍이면 `camera.drawer.open.webp`).
- `V-04`는 다음 조건으로 판정한다: `action.share`의 `itemId`가 `media.camera.*`이고 `source = 'camera.capture'`이며 `composition = 'drawer'`이고 대상이 `P-02`.
- 촬영한 사진은 사진 앱에 `items` 항목(`kind: "photo"`, `assetId`)으로 추가된다. 정보(i)에 "촬영 위치: 성원아파트"가 표시된다.
- 사진 동기화가 켜져 있으면 슬레이트로 `sync.state = "synced"`가 되고 TR-07이 발생한다.

### 6.4 스크린샷

- 실제 화면 픽셀을 캡처하지 않는다. **선언적 썸네일**이다.
- 빌드 시 화면별 대표 썸네일을 만든다. 동적 텍스트(계좌번호·이름·시각)는 `stateRef`에 별도 저장하고, 썸네일은 정적 대표 이미지다.
- 사진 앱에서 열면 "스크린샷 · {화면 이름} · {게임 시각}"과 `stateRef` 요약을 보여 준다. 원본 화면의 모든 픽셀을 재현하지 않는다.
- 공유하면 `action.share`의 `itemId`는 `mediaId`다. 상대 앱은 썸네일을 보여 준다.
- 증거로 쓰이는 스크린샷(은행 화면, 하린 글, 블링크 캡처)은 **콘텐츠에 정의된 전용 자산**을 쓴다. 플레이어가 만든 스크린샷은 대표 썸네일이다.
- 블링크에서 스크린샷을 만들면 TR-06(캡처 감지)이 발생한다. 은행 화면 스크린샷은 TR-07(사진 동기화)로 DH 경계 +1.

### 6.5 화면 기록

- `kind: "screenRecording"`, `durationSec`, `sceneId`, `keyframeAssetIds[]`.
- 실제 영상 파일이 아니다. 사진 앱에서 재생하면 키프레임을 슬라이드로 보여 주고 "화면 기록 · 00:42"를 표시한다.
- 블링크에서 화면 기록을 시작하면 TR-06(캡처·기록 감지)이 발생한다.
- 결제·공유 대상은 `mediaId`다.

### 6.6 동기화·삭제

| 이벤트 | 처리 |
|---|---|
| 사진 동기화 켜짐 | `sync.state = "synced"`, TR-07. 슬레이트 사진첩에 나타난다 |
| 사진 동기화 꺼짐 | `sync.state = "localOnly"`. 원격 삭제가 닿지 않는다 |
| 원격 삭제(EV-05·EV-07 등) | 해당 `mediaId`의 `items` 항목 `deleted = true`. `media.virtual`에는 흔적 기록 |
| 원격 지우기(EV-08) | 모든 미디어 삭제. `device.wiped = true` |
| 플레이어 삭제 | 최근 삭제함으로 이동. 원격 삭제는 최근 삭제함을 거치지 않는다 |
| 숨김 앨범 | `album: "hidden"` + 잠금. 기기 암호로 열람 |

- 미디어 항목도 [STATE_MANAGEMENT](./STATE_MANAGEMENT.md) 2.5의 `items` 오버레이 규칙을 따른다.
- `media.virtual`에는 삭제된 항목의 메타를 남겨 "무엇이 지워졌는지"를 엔딩 후 통계에 쓸 수 있다. 단, `seen`·`inspected`처럼 판정에는 쓰지 않는다.

## 7. 지연 디코딩

| 규칙 | 내용 |
|---|---|
| 기본 | `<img loading="lazy" decoding="async" width height>` |
| 화면 밖 | `IntersectionObserver`로 뷰포트 근접 시 로드 |
| 디코딩 큐 | 동시 2개. `img.decode()` 완료 후 페이드 인 |
| 예산 | 프레임당 디코딩 30ms 이하. 초과 시 다음 프레임으로 |
| 우선순위 | 잠금화면 배경 > 현재 화면 썸네일 > 목록 6개 > 나머지 |
| 판독용 2배 | 확대 제스처 시작 시 1개만 로드 |
| 레이아웃 | `width`·`height` 필수. CLS 0 |
| 실패 | `--lm-bg-tertiary` 플레이스홀더 + `alt`. 화면은 계속 동작 |
| 메모리 | 화면을 떠난 large image는 DOM에서 제거. `Image` 객체를 오래 보관하지 않는다 |
| 프리로드 | 첫 화면 자산만. 그 외 `<link rel=preload>` 금지 |

- data URI는 브라우저 캐시에 남지만 디코딩은 매번 비용이다. 같은 이미지를 여러 화면에서 재사용하면 `<img>`를 재사용하거나 디코딩된 요소를 유지한다.
- 9MB 파일 자체의 파싱 비용은 [PERFORMANCE_REQUIREMENTS](../05-quality/PERFORMANCE_REQUIREMENTS.md) 3절.

## 8. 접근성

- 모든 이미지에 `alt`. 장식 이미지는 `alt: ""` + `role="presentation"`.
- 아이콘 버튼은 `aria-label`.
- 스크린샷 썸네일 alt: "스크린샷: {화면 이름}, {게임 시각}".
- 카메라 뷰어는 "도현의 방, {구도}" 설명. 서랍 열림은 상태 텍스트로도 알린다.
- 색만으로 정보를 전달하지 않는다(사진 동기화 상태·캡처 표시에 텍스트 병행).

## 확인 사항

- `Q-OPEN-T26`: 스크린샷을 "선언적 썸네일 + stateRef"로 표현하는 설계는 실제 화면과 픽셀 단위로 같지 않다. 플레이테스트에서 "내가 찍은 화면이 아니다"라는 위화감이 나오면, 화면별 정적 썸네일을 더 정교하게 만들거나 가상 캡처 렌더러를 검토해야 한다. **실제 캡처 API 도입은 금지**다.
- `Q-OPEN-T27`: 폰트 서브셋에 한글 상용 2,350자만 넣으면 플레이어가 입력하는 희귀 음절은 시스템 글꼴로 표시된다. 이때 굵기·자간이 달라 보일 수 있다. 허용 범위인지 디자인 확인 필요.
- `Q-OPEN-T28`: 오디오 350KB 예산은 음성 메모 42분 전체를 담을 수 없다. 캐논은 "자막만"이 MVP이므로 오디오는 핵심 4구간 클립만 넣는 것으로 가정했다. 본편 성우 녹음 시 예산을 다시 배분해야 한다.
- `Q-OPEN-T29`: `window.__ASSETS` 인라인은 [SYSTEM_ARCHITECTURE](SYSTEM_ARCHITECTURE.md) 2절 모듈 트리에 없는 런타임 전역이다. 빌드 산출물 전역으로만 두고 모듈은 `content.asset(assetId)`로 접근한다([API_SPECIFICATION](./API_SPECIFICATION.md) 4절). 새 전역을 늘리지 않도록 코드 리뷰에서 확인한다.
