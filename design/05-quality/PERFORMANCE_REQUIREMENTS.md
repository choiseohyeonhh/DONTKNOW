# PERFORMANCE_REQUIREMENTS — 9MB·2초·100ms·60fps

> **역할:** 단일 HTML 9MB 이내, 첫 화면 iPhone 12급 2초, 상호작용 응답 100ms, 60fps 애니메이션, 메모리, 이벤트 스케줄러 틱 비용, 이미지 디코딩의 예산과 측정 방법을 고정한다.
> **단일 출처:** 이 문서(성능 예산·측정·회귀 기준). 자산 규격·9MB 배분은 [FILE_AND_MEDIA_MANAGEMENT](../04-tech/FILE_AND_MEDIA_MANAGEMENT.md), 렌더링 규칙은 [FRONTEND_ARCHITECTURE](../04-tech/FRONTEND_ARCHITECTURE.md) 4절, 스케줄러·시계는 [STATE_MANAGEMENT](../04-tech/STATE_MANAGEMENT.md) 8~9절이 단일 출처다.
> **참조:** [SYSTEM_ARCHITECTURE](../04-tech/SYSTEM_ARCHITECTURE.md), [SYSTEM_SHELL_SPECIFICATION](../03-features/SYSTEM_SHELL_SPECIFICATION.md), [IMPLEMENTATION_ROADMAP](../06-execution/IMPLEMENTATION_ROADMAP.md), [DEPLOYMENT_ARCHITECTURE](./DEPLOYMENT_ARCHITECTURE.md).
> **적용 버전:** v6.2 (2026-11). 측정은 외부 분석 도구 없이 브라우저 API·수동 계측으로 한다.

## 1. 예산 요약

| 항목 | 목표 | 경고 | 실패 | 측정 |
|---|---|---|---|---|
| 단일 HTML 크기 | ≤ 8.4MB | 8.4MB 초과 | **9,000,000 B 초과** | 빌드 로그 |
| 첫 화면(파일 준비 후) | ≤ 2.0s | 2.0~2.5s | > 2.5s | iPhone 12 Safari |
| 상호작용 응답 | ≤ 100ms | 100~150ms | > 150ms | pointerup→다음 페인트 |
| 애니메이션 | 60fps(16.7ms) | 45fps | < 30fps | rAF 프레임 시간 |
| JS 힙 | ≤ 120MB | 120~160MB | > 160MB | Safari Web Inspector |
| DOM 노드 | ≤ 3,500 | 3,500~5,000 | > 5,000 | `document.querySelectorAll('*').length` |
| 디코딩 이미지 메모리 | ≤ 64MB | 64~96MB | > 96MB | 추정·수동 |
| 세이브 1개 | ≤ 512KB | 512KB~1MB | > 1MB | 직렬화 크기 |
| 스케줄러 틱 평균 | ≤ 0.5ms | 0.5~2ms | > 2ms | `performance.measure` |
| 스케줄러 틱 최악 | ≤ 2ms | 2~5ms | > 5ms | 〃 |
| 이미지 디코딩 | 프레임당 ≤ 30ms | 30~50ms | > 50ms | `img.decode()` 구간 |

- **9MB는 절대 상한이다.** 넘으면 빌드 실패. 경고는 8.4MB.
- "첫 화면 2초"는 **파일이 기기에 준비된 뒤**(로컬 파일 또는 캐시 완료) 기준이다. 최초 다운로드 시간은 별도이며, 9MB 파일을 네트워크에서 받는 시간은 이 예산에 포함하지 않는다(4.1).

## 2. 정의

| 용어 | 정의 |
|---|---|
| 첫 화면 | 잠금화면이 화면에 보이고 **터치에 반응하는 시점**. 폰트·배경·키패드 준비 완료 |
| 상호작용 응답 | `pointerup`부터 다음 시각 변화가 페인트될 때까지 |
| 프레임 | 60Hz 기준 16.7ms. rAF 콜백 + 스타일 + 레이아웃 + 페인트 |
| 긴 작업 | 50ms 초과 메인 스레드 점유. 0회 목표(첫 로드 제외) |
| JS 힙 | `performance.memory.usedJSHeapSize`(Chromium) 또는 Safari Web Inspector |
| 디코딩 이미지 | 디코딩되어 메모리에 있는 이미지의 대략 `width × height × 4` 합 |
| 콜드 | 캐시 비움, 새 브라우저 탭, 파일 준비 완료 상태 |

## 3. 로딩 예산(첫 화면 2.0s)

| 단계 | 예산 | 측정 |
|---|---|---|
| HTML 파싱(9MB) | ≤ 500ms | `performance.mark('parse-start/end')` |
| 콘텐츠 인덱싱(`hydrateContent`) | ≤ 80ms | 〃 |
| 상태 초기화·세이브 읽기 | ≤ 50ms | 〃 |
| 셸 첫 렌더(잠금화면) | ≤ 100ms | `first-render` |
| 배경화면 디코딩 | ≤ 60ms | `img.decode()` |
| 폰트 준비 | ≤ 100ms | `document.fonts.ready` |
| 여유(브라우저 오버헤드) | ≤ 1,110ms | — |
| **합계** | **≤ 2,000ms** | — |

- 위 단계는 **순차**가 아니다. 파싱 후 잠금화면에 필요한 것만 먼저 준비한다.
- 잠금화면에 필요 없는 앱·이미지·콘텐츠 인덱스는 첫 페인트 뒤로 미룬다(지연 인덱싱).
- `window.__game.ready`는 첫 화면 조작 가능 시점에 resolve한다.

### 3.1 최초 다운로드(예산 밖)

- 9MB 단일 HTML은 네트워크에서 받는 시간이 길다. 정적 호스팅 시 gzip/brotli·캐시 헤더를 쓴다.
- 로딩 중에는 브라우저 기본 진행 표시를 허용한다. 게임 내 가짜 로딩 화면을 만들지 않는다.
- 파일 공유(로컬 파일)는 다운로드 시간이 없다.
- **금지:** 9MB를 회피하려고 외부 청크·CDN을 쓰지 않는다([BACKEND_ARCHITECTURE](../04-tech/BACKEND_ARCHITECTURE.md)).

## 4. 상호작용 예산(100ms)

| 작업 | 예산 | 비고 |
|---|---|---|
| 포인터 피드백(눌림) | ≤ 16ms | CSS `:active`/클래스 |
| 상태 커밋 | ≤ 16ms | 동기 |
| verify + trace 판정 | ≤ 8ms | 이벤트당 |
| 스케줄러 틱(분 경계) | ≤ 2ms | 5.2 |
| morph(행 단위) | ≤ 8ms | 일반 화면 |
| 화면 push/pop 렌더 | ≤ 50ms | 새 화면 1회 |
| 앱 열기 | ≤ 100ms | 첫 렌더 포함 |
| 전역 검색(2,000항목) | ≤ 50ms | 색인된 가시 항목 |
| 세이브 쓰기 | ≤ 20ms | 6.4 |
| 이미지 1장 디코딩 | ≤ 30ms/프레임 | 6절 |

- 100ms는 **입력 → 시각 피드백**의 상한이다. 눌림 표시는 16ms 안에, 콘텐츠 갱신은 100ms 안에.
- 100ms를 넘길 것 같으면 즉시 스켈레톤·진행 표시를 먼저 보여 준다.

## 5. 60fps 애니메이션

| 규칙 | 내용 |
|---|---|
| 속성 | `transform`·`opacity`만. `width`·`height`·`top`·`left` 애니메이션 금지 |
| 레이아웃 | 애니메이션 중 레이아웃 읽기·쓰기 반복 금지 |
| 동시 애니메이션 | 화면 전환 1 + 행 페이드 다수. 동시 20개 초과 금지 |
| 블러 | `backdrop-filter`는 상태바·시트 등 작은 영역만. 전체 화면 블러 금지 |
| 그림자 | 다크에서는 그림자 대신 면 밝기. 큰 `box-shadow` 남발 금지 |
| 스크롤 | JS 스크롤 핸들러 금지. `IntersectionObserver` 사용. 리스너 `passive` |
| 긴 목록 | 80행 초과 시 윈도잉(보이는 행 + 여유 10행만 DOM) |
| reduced motion | 이동 없이 150ms 페이드 |
| ProMotion | 120Hz에서도 60fps 예산으로 측정. 프레임 드랍 0 목표 |

- 화면 전환 중에는 새 화면의 이미지 디코딩을 전환 뒤로 미룬다.
- `will-change`는 전환 직전에만 붙이고 끝나면 제거한다.

## 6. 이미지 디코딩

| 규칙 | 내용 |
|---|---|
| 지연 | `loading="lazy"`, `decoding="async"`, `IntersectionObserver` |
| 동시성 | 디코딩 큐 최대 2개 |
| 프레임 예산 | 프레임당 디코딩 ≤ 30ms |
| 우선순위 | 잠금화면 배경 > 현재 화면 썸네일 > 목록 6개 > 나머지 |
| 판독용 2배 | 확대 제스처 시작 시 1개만 |
| 프리로드 | 첫 화면 자산만. 그 외 금지 |
| 크기 | `width`·`height` 필수(CLS 0) |
| 해제 | 화면을 떠난 큰 이미지는 DOM에서 제거. `Image` 객체 보관 금지 |
| 실패 | 플레이스홀더. 재시도 1회 |

- data URI는 파싱 비용이 있다. 같은 자산을 여러 화면에서 쓰면 `<img>`를 재사용한다.
- 2배 레이어는 기본 화면에서 로드하지 않는다. 로드 전 확대하면 저해상도를 먼저 보여 주고 교체한다.

## 7. 메모리

| 항목 | 예산 |
|---|---|
| JS 힙 | ≤ 120MB |
| DOM 노드 | ≤ 3,500 |
| 디코딩 이미지 | ≤ 64MB |
| 이벤트 로그(메모리) | ≤ 2,000항목(세이브는 500) |
| 검색 색인 | ≤ 2,000항목 |
| 미디어 가상 항목 | ≤ 200개 |
| 세이브 문자열 | ≤ 512KB |

- 30분 연속 플레이 후 힙 증가가 20%를 넘으면 누수로 본다.
- 앱을 닫을 때 그 앱의 큰 이미지·임시 DOM·`IntersectionObserver`를 정리한다.
- `requestAnimationFrame` 루프는 하나만. 화면별 루프 금지.

## 8. 이벤트 스케줄러 틱 비용

| 항목 | 예산 |
|---|---|
| 틱 빈도 | 게임 분 경계 1회(실시간 15초) |
| 평균 | ≤ 0.5ms |
| p95 | ≤ 2ms |
| 최악 | ≤ 5ms |
| 조건 평가 | 틱당 ≤ 100개 |
| 전체 EV 수 | ≤ 500개 |
| 예약 인덱스 | `atGameMin` 기준 정렬 배열 + 포인터 |

### 8.1 구현 규칙

1. 매 프레임 전체 EV를 훑지 않는다. `gameMin`이 증가할 때만 `tick()`.
2. `atGameMin <= current`인 이벤트만 큐에서 꺼낸다. 지난 이벤트는 재평가하지 않는다.
3. 조건 재평가는 플래그·게이트·온라인 변화 시에만, **의존 인덱스**로 대상 EV만 검사한다.
4. `remoteWipe`는 큐에서 최우선. 나머지는 `atGameMin` → `priority` → ID.
5. 틱 중 상태 변경은 모아서 한 번 커밋한다. 틱 1회당 렌더 1회.
6. 틱이 5ms를 넘으면 `console.warn`(디버그) + `__errors`에 `E-CLOCK` 경고. 일반 모드에서는 조용히 계속.

## 9. 세이브 성능

| 항목 | 예산 |
|---|---|
| canonical JSON 직렬화 | ≤ 10ms |
| 체크섬 | ≤ 2ms |
| `localStorage.setItem` | ≤ 8ms |
| 합계 | ≤ 20ms |
| 자동 저장 빈도 | 접근 해제·EV·공유·메일 발송·엔딩. 연속 1초 내 중복 저장은 합친다 |

- 저장 중 입력을 막지 않는다. 저장은 동기지만 20ms 이내.
- 20ms 초과 시 로그를 줄여 재시도(최근 100개). 그래도 초과하면 다음 유휴 시간에 저장.

## 10. 측정 방법

### 10.1 브라우저 API

```js
performance.mark('app-start');
// …
performance.mark('first-render');
performance.measure('first-screen', 'app-start', 'first-render');

new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    if (e.duration > 50) window.__errors?.list(); // 긴 작업 기록
  }
}).observe({ type: 'longtask', buffered: true });

new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    // LCP·CLS 기록
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

| 지표 | 도구 |
|---|---|
| 첫 화면 | `performance.mark/measure`, Safari Web Inspector 타임라인 |
| 상호작용 | `pointerup` 마크 → `requestAnimationFrame` + `performance.now()` |
| 프레임 | rAF 델타 히스토그램 |
| 힙 | Chromium `performance.memory`, Safari Web Inspector |
| DOM | `document.querySelectorAll('*').length` |
| 세이브 | `JSON.stringify(state).length`, `setItem` 구간 |
| 스케줄러 | `performance.measure('scheduler.tick')` |
| 디코딩 | `img.decode()` 전후 `performance.now()` |

### 10.2 조건

- iPhone 12급 Safari, 최신 iOS, 저전력 모드 **끔**.
- 파일 준비 완료(로컬 또는 캐시), 새 탭, 캐시 비움.
- 폰트·이미지 콜드 디코딩 1회, 이후 웜 1회 측정.
- 화면: `SCR-OS-LOCK` → `SCR-OS-HOME` → `SCR-TALK-ROOM` → `SCR-LOOP-FEED`.
- 측정값은 5회 중앙값. 최악값도 기록.

### 10.3 자동 회귀

- Playwright에서 `performance.mark/measure` 값을 읽어 표에 기록한다.
- Chromium 기준이지만, Safari 실기기 수동 측정을 별도로 한다.
- 예산 초과는 PR 실패로 처리한다. 경고는 리뷰에서 판단.

## 11. 최적화 규칙

| 규칙 | 이유 |
|---|---|
| 첫 화면에 필요한 것만 인덱싱 | 9MB 파싱·인덱싱 비용 |
| 앱 전환 시에만 전체 렌더 | morph 비용 |
| 행 단위 갱신·스크롤 유지 | 체감·프레임 |
| 80행 초과 윈도잉 | DOM·레이아웃 |
| 이미지 지연·2배 레이어 분리 | 메모리·디코딩 |
| 블러 최소화 | iOS Safari GPU 비용 |
| CSS 변수 테마 전환 | 재렌더 없이 색 변경 |
| 이벤트 위임 | 리스너 수 |
| `passive` 스크롤 | 스크롤 지연 |
| 저장 로그 500개 | 세이브 크기·시간 |
| 검색 색인 가시 항목만 | 검색 시간·메모리 |

## 12. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| 9MB HTML 파싱 | 첫 화면 지연 | 지연 인덱싱, 첫 화면 자산 최소화 |
| base64 팽창 | 파일 크기 | 원본 자산 예산 5.2MB, 빌드 경고 |
| iOS Safari 메모리 | 크래시 | DOM·이미지 해제, 윈도잉, 힙 모니터 |
| 대형 JSON 인덱싱 | 긴 작업 | 인덱스 지연·청크 |
| 블러·그림자 | 프레임 드랍 | 작은 영역만, 다크는 면 밝기 |
| 2배 레이어 | 메모리 | 확대 시 1개만 |
| 폰트 서브셋 | 대체 글꼴 혼합 | 서브셋 확대 또는 시스템 대체 허용 |
| 최초 다운로드 | 이탈 | 정적 호스팅 캐시·압축, 파일 공유 안내 |

## 확인 사항

- `Q-OPEN-Q10`: "첫 화면 2초"를 파일 준비 후로 정의했다. 네트워크 최초 다운로드까지 2초를 요구하면 9MB 단일 HTML과 양립하지 않는다. 요구사항 원문의 의도를 총괄이 확인해야 한다(추천: 파일 준비 후 2초, 다운로드는 별도).
- `Q-OPEN-Q11`: JS 힙 120MB·디코딩 64MB는 iPhone 12급 기준 추정치다. 실기기 측정 후 조정한다.
- `Q-OPEN-Q12`: 긴 목록 윈도잉 임계값 80행은 화면·행 높이에 따라 다르다. 구현 후 실측으로 조정한다.
- `Q-OPEN-Q13`: Safari에는 `performance.memory`가 없어 힙 측정이 수동이다. 자동 회귀는 Chromium 기준으로 하고, Safari는 릴리스 체크리스트에 넣는다.
