# DESIGN_TOKENS — LUMA OS 디자인 토큰

> **역할:** LUMA OS의 색·글자·여백·모서리·재질·그림자·움직임·크롬 치수·z-index·불투명도의 **단일 출처**.
> **단일 출처:** 이 문서. 다른 문서는 값을 복사하지 않고 여기의 토큰 이름으로 참조한다. 값이 충돌하면 이 문서가 이긴다.
> **참조:** [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) · [UI_UX_GUIDELINES.md](./UI_UX_GUIDELINES.md) · [RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md) · [ACCESSIBILITY.md](./ACCESSIBILITY.md) · [ICONOGRAPHY_AND_IMAGERY.md](./ICONOGRAPHY_AND_IMAGERY.md) · [SCREEN_SPECIFICATIONS.md](./SCREEN_SPECIFICATIONS.md) · [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md)
> **근거:** 공통 지시서 3.2의 고정값 + 원본 아트 디렉션 [ICONOGRAPHY_AND_IMAGERY](ICONOGRAPHY_AND_IMAGERY.md)(읽기 전용). 충돌 시 이 문서와 공통 지시서 3.2가 우선한다.

## 0. 원칙

| 항목 | 규칙 |
|---|---|
| 접두 | 모든 토큰은 `--lm-`으로 시작한다. |
| 단위 | 설계 단위는 pt이며 CSS px와 1:1로 대응한다. |
| 기준 프레임 | 390×844. 지원 폭 320~430(폰). 데스크톱은 390×844 프레임을 0.75~1.25배로 표시한다. |
| 테마 | **폰 기본은 다크.** `:root`가 다크, `[data-theme="light"]`가 라이트 오버라이드다. |
| 숫자 | 시각·금액·번호·날짜·개수는 `font-variant-numeric: tabular-nums`를 적용한다. |
| 색 사용 | 의미 토큰만 쓴다. 원시 hex를 화면 코드에 직접 쓰지 않는다. |
| 앱 색 | 앱별 강조색은 `--lm-app-tint` 하나만 쓴다. 앱 코드에서 새 hex를 만들지 않는다. |

## 1. 색 토큰

### 1.1 배경

| 토큰 | 라이트 | 다크 | 용도 | 금지 용도 |
|---|---|---|---|---|
| `--lm-bg` | `#F2F2F5` | `#000000` | 앱·화면 기본 배경, 그룹 배경 | 카드·셀 배경(→ `bg-elevated`) |
| `--lm-bg-elevated` | `#FFFFFF` | `#1C1C1F` | 카드, 목록 셀, 입력 필드, 시트 표면 | 화면 전체 배경 |
| `--lm-bg-grouped` | `#F2F2F5` | `#000000` | 그룹 목록의 바깥 배경 | 개별 셀 배경 |
| `--lm-bg-grouped-cell` | `#FFFFFF` | `#1C1C1F` | 그룹 목록 안의 셀 | 화면 전체 배경 |
| `--lm-bg-tertiary` | `#E9E9EE` | `#2A2A2E` | 상대 말풍선, 비활성 면, 태그 칩 | 본문 텍스트 배경(대비 부족) |

### 1.2 글자

| 토큰 | 라이트 | 다크 | 용도 | 금지 용도 |
|---|---|---|---|---|
| `--lm-label` | `#111114` | `#F5F5F7` | 본문, 제목, 핵심 수치 | 장식·비활성 텍스트 |
| `--lm-label-2` | `rgba(60,60,67,.62)` | `rgba(235,235,245,.62)` | 보조 설명, 부제, 목록의 두 번째 줄 | 17pt 이하 본문의 유일한 정보(라이트 대비 3.47:1) |
| `--lm-label-3` | `rgba(60,60,67,.32)` | `rgba(235,235,245,.32)` | 플레이스홀더, 비활성, 구분선 위 라벨 | 읽어야 하는 정보, 상태 표시 |

### 1.3 선·채움

| 토큰 | 라이트 | 다크 | 용도 | 금지 용도 |
|---|---|---|---|---|
| `--lm-separator` | `rgba(60,60,67,.18)` | `rgba(84,84,88,.6)` | 목록 구분선(0.5px), 카드 내부 구분 | 입력 필드 경계의 유일한 표시(대비 부족) |
| `--lm-fill` | `rgba(120,120,128,.16)` | `rgba(120,120,128,.32)` | 세그먼트 트랙, 검색 필드, 아이콘 버튼 배경 | 텍스트 배경 |
| `--lm-fill-2` | `rgba(120,120,128,.12)` | `rgba(120,120,128,.24)` | 보조 칩, 눌림 상태, 스크롤 흔적 | 주요 버튼 배경 |

### 1.4 의미색

| 토큰 | 라이트 | 다크 | 용도 | 금지 용도 |
|---|---|---|---|---|
| `--lm-tint` | `#2F6BFF` | `#5C8BFF` | 링크(큰 글자), 선택, 포커스, 아이콘 | 본문 크기 텍스트(라이트 `bg` 위 4.03:1), 채움(→ 1.8 `tint-fill`) |
| `--lm-on-tint` | `#FFFFFF` | `#111114` | `tint-fill` 채움 위의 글자·아이콘 | `bg` 위의 본문 |
| `--lm-destructive` | `#E5484D` | `#FF6369` | 삭제·차단·초기화 등 파괴적 동작의 테두리·아이콘·작은 배지 | 일반 강조, 오류가 아닌 경고, 장식, 본문 크기 텍스트(라이트 3.50:1), 큰 채움(→ 1.8 `destructive-fill`) |
| `--lm-success` | `#2E9E5B` | `#3DC373` | 연결됨·완료의 점·아이콘·작은 배지 | 긴 문장 텍스트(라이트 3.05:1) |
| `--lm-warning` | `#C98A1B` | `#E6A23C` | 주의의 점·아이콘·작은 배지 | 긴 문장 텍스트(라이트 2.63:1) |
| `--lm-on-status` | `#111114` | `#111114` | `success`·`warning` 채움 위의 글자 | `destructive` 위(→ `--lm-on-tint`) |

### 1.5 재질(블러)

| 토큰 | 라이트 | 다크 | 용도 | 금지 용도 |
|---|---|---|---|---|
| `--lm-material-thin` | `rgba(250,250,252,.60)` | `rgba(28,28,31,.60)` | 상태바 아래, 내비 바 | 본문을 읽는 큰 카드 |
| `--lm-material-regular` | `rgba(250,250,252,.72)` | `rgba(28,28,31,.72)` | 탭 바, 시트, 배너 | 텍스트 입력 필드 |
| `--lm-material-thick` | `rgba(250,250,252,.85)` | `rgba(28,28,31,.85)` | 독, 제어 센터, 알림 센터 | 전체 화면 배경 |
| `--lm-material-blur-thin` | `20px` | `20px` | 위 재질의 blur 반경 | — |
| `--lm-material-blur-regular` | `30px` | `30px` | 위 재질의 blur 반경 | — |
| `--lm-material-blur-thick` | `40px` | `40px` | 위 재질의 blur 반경 | — |
| `--lm-material-saturate` | `180%` | `180%` | 재질의 채도 보정 | — |

- 모든 재질은 `backdrop-filter: blur(<반경>) saturate(var(--lm-material-saturate))`를 쓴다.
- `backdrop-filter` 미지원 환경에서는 해당 재질 대신 불투명 `--lm-bg-elevated`를 쓴다.

### 1.6 그림자

그림자는 **라이트 전용**이다. 다크에서는 그림자 대신 한 단계 밝은 면(`bg-elevated` → `bg-tertiary`)으로 깊이를 만든다.

| 토큰 | 라이트 | 다크 | 용도 | 금지 용도 |
|---|---|---|---|---|
| `--lm-elev-1` | `0 1px 2px rgba(0,0,0,.10)` | `none` | 카드, 목록 셀 | 시트·모달 |
| `--lm-elev-2` | `0 4px 12px rgba(0,0,0,.12)` | `none` | 배너, 팝오버, 독 | 전체 화면 |
| `--lm-elev-3` | `0 12px 32px rgba(0,0,0,.18)` | `none` | 시트, 경고창, 일시정지 메뉴 | 목록 셀 |

### 1.7 불투명도

| 토큰 | 값 | 용도 | 금지 용도 |
|---|---|---|---|
| `--lm-op-disabled` | `0.38` | 비활성 컨트롤·텍스트 | 읽어야 하는 정보 |
| `--lm-op-secondary` | `0.62` | 보조 텍스트 오버레이(`label-2`와 동일) | 본문의 유일한 정보 |
| `--lm-op-tertiary` | `0.32` | 플레이스홀더·비활성 라벨(`label-3`와 동일) | 상태 표시 |
| `--lm-op-pressed` | `0.72` | 눌림 오버레이 | 기본 상태 |
| `--lm-op-scrim` | `0.48` | 시트·경고창 뒤 배경 어둡게 | 콘텐츠 위 오버레이 |
| `--lm-op-skeleton` | `0.08` | 로딩 스켈레톤 | 실제 콘텐츠 |
| `--lm-op-tint-wash` | `0.12` | 선택 행·태그의 앱 색 옅은 면 | 본문 배경 |
| `--lm-op-sync-dot` | `1` | 동기화 점(깜빡임은 불투명도 1↔0.35) | 설명 텍스트 |

### 1.8 접근성 파생 토큰

3.2의 기본값은 유지하되, 본문 크기(18pt 미만)에서 WCAG 2.2 AA 4.5:1을 만족하지 못하는 조합에만 파생 토큰을 쓴다. 자세한 계산은 [ACCESSIBILITY.md](./ACCESSIBILITY.md) 2절.

| 토큰 | 라이트 | 다크 | 용도 | 금지 용도 |
|---|---|---|---|---|
| `--lm-label-2-aa` | `rgba(60,60,67,.74)` | `rgba(235,235,245,.62)` | 17pt 이하 보조 텍스트(라이트 4.74:1) | 장식·비활성 |
| `--lm-tint-ink` | `#2A62F0` | `#5C8BFF` | 본문 크기 링크·아이콘(라이트 4.58:1) | 채움 |
| `--lm-tint-fill` | `#2A62F0` | `#5C8BFF` | 주요 버튼·선택 알약 채움(흰 글자 5.12:1) | 본문 텍스트 |
| `--lm-destructive-ink` | `#C92A2F` | `#FF6369` | 본문 크기 파괴적 텍스트(라이트 4.87:1) | 채움 |
| `--lm-destructive-fill` | `#C92A2F` | `#FF6369` | 파괴적 버튼 채움(흰 글자 5.45:1) | 본문 텍스트 |
| `--lm-success-ink` | `#237A46` | `#3DC373` | 본문 크기 성공 텍스트(라이트 4.77:1) | 채움 |
| `--lm-warning-ink` | `#8A5A00` | `#E6A23C` | 본문 크기 주의 텍스트(라이트 5.30:1) | 채움 |

- `label-2`는 디자인 위계용 원값이다. 라이트에서 17pt 이하의 **읽어야 하는** 보조 텍스트는 `label-2-aa`를 쓴다.
- `tint`·`destructive`·`success`·`warning`은 채움·점·테두리용 원값이다. 본문 크기 텍스트는 `-ink` 파생 토큰을 쓴다.
- 이 파생 토큰 외에 새 토큰을 추가하지 않는다.

## 2. 글자 토큰

### 2.1 글꼴

| 토큰 | 값 | 용도 |
|---|---|---|
| `--lm-font-sans` | `"Pretendard Variable", Pretendard, sans-serif` | 모든 텍스트 |
| `--lm-font-num` | `"Pretendard Variable", Pretendard, sans-serif` | 숫자(항상 `tabular-nums`) |
| `--lm-tracking-large` | `-0.4px` | 20pt 이상 |
| `--lm-tracking-medium` | `-0.2px` | 15~19pt |
| `--lm-tracking-small` | `0` | 14pt 이하 |

### 2.2 타이포 스케일

| 스타일 토큰 | 크기/줄높이 | 굵기 | 자간 | 용도 | 금지 용도 |
|---|---|---|---|---|---|
| `--lm-text-large-title` | 34/41 | 700 | -0.4px | 화면 최상위 제목(설정, 앱 루트) | 목록 행 안 |
| `--lm-text-title-1` | 28/34 | 700 | -0.4px | 상세 화면 제목, 프로필 이름 | 카드 안 제목 |
| `--lm-text-title-2` | 22/28 | 700 | -0.4px | 섹션 제목, 시트 제목 | 버튼 |
| `--lm-text-title-3` | 20/25 | 600 | -0.4px | 카드 제목, 대화방 이름 | 본문 |
| `--lm-text-headline` | 17/22 | 600 | -0.2px | 목록 행 주 텍스트, 내비 제목 | 긴 문단 |
| `--lm-text-body` | 17/22 | 400 | -0.2px | 본문, 메시지, 메일 본문 | 12pt 이하 보조 |
| `--lm-text-callout` | 16/21 | 400 | -0.2px | 입력 필드, 강조 본문 | 최상위 제목 |
| `--lm-text-subhead` | 15/20 | 400 | -0.2px | 보조 설명, 두 번째 줄 | 주요 버튼 |
| `--lm-text-footnote` | 13/18 | 400 | 0 | 캡션, 메타데이터, 시각 | 본문 |
| `--lm-text-caption-1` | 12/16 | 400 | 0 | 배지, 탭 라벨, 사진 캡션 | 읽어야 하는 긴 문장 |
| `--lm-text-caption-2` | 11/13 | 500 | 0 | 최소 라벨, 상태 점 옆 글자 | 본문, 동적 글자 최소값 이하 |
| `--lm-text-display-clock` | 76/80 | 300 | -0.4px | 잠금화면 시계 전용 | 다른 화면 |

- 각 스타일은 `-size`, `-line`, `-weight`, `-tracking` 네 개의 커스텀 프로퍼티로 선언한다(예: `--lm-text-body-size: 17px`).
- 동적 글자 배율은 `--lm-type-scale`로 적용한다. 크기와 줄높이에 곱하고, `caption-2`만 `max(11px, calc(11px * var(--lm-type-scale)))`로 하한을 둔다.

### 2.3 동적 글자 단계

| 토큰 | 값 | 사용자 표기 |
|---|---|---|
| `--lm-type-scale-xs` | `0.85` | 작게 |
| `--lm-type-scale-md` | `1.0` | 기본 |
| `--lm-type-scale-lg` | `1.15` | 크게 |
| `--lm-type-scale-xl` | `1.3` | 아주 크게 |
| `--lm-type-scale` | `1.0` | 현재 적용값(기본) |

## 3. 여백 토큰

| 토큰 | 값 | 용도 | 금지 용도 |
|---|---|---|---|
| `--lm-space-0_5` | 2px | 사진 그리드 간격, 미세 보정 | 일반 여백 |
| `--lm-space-1` | 4px | 아이콘-라벨 간격, 칩 내부 | 목록 좌우 여백 |
| `--lm-space-2` | 8px | 밀접한 요소 사이, 배지 여백 | 섹션 구분 |
| `--lm-space-3` | 12px | 카드 내부, 목록 셀 세로 | 화면 좌우 기본 |
| `--lm-space-4` | 16px | **화면 좌우 기본 여백**, 카드 패딩 | — |
| `--lm-space-5` | 20px | 큰 카드 패딩, 시트 좌우 | 목록 셀 내부 |
| `--lm-space-6` | 24px | 섹션 사이, 그룹 사이 | 아이콘 간격 |
| `--lm-space-8` | 32px | 큰 섹션 구분, 빈 화면 상단 | 목록 행 내부 |
| `--lm-space-10` | 40px | 화면 상단 큰 여백 | 카드 내부 |
| `--lm-space-12` | 48px | 빈 화면 중앙 여백, 시네마틱 자막 아래 | 일반 레이아웃 |

- 4pt 기준. 위 표에 없는 값이 필요하면 가장 가까운 하위 토큰을 쓴다.
- 화면 좌우 기본 여백은 16이다. 예외는 전체 폭 사진·지도·시네마틱 스틸뿐이다.

## 4. 모서리 토큰

| 토큰 | 값 | 용도 | 금지 용도 |
|---|---|---|---|
| `--lm-radius-xs` | 6px | 태그, 작은 칩, 배지 | 카드 |
| `--lm-radius-sm` | 10px | 버튼, 입력 필드, 작은 썸네일 | 시트 상단 |
| `--lm-radius-md` | 14px | 그룹 목록, 카드, 사진 타일 | 알약 |
| `--lm-radius-lg` | 20px | 알림 카드, 배너, 큰 카드 | 입력 필드 |
| `--lm-radius-xl` | 28px | 시트 위 모서리, 독 배경 | 목록 셀 |
| `--lm-radius-full` | 999px | 알약 버튼, 아바타, 점 | 사각 카드 |
| `--lm-radius-icon` | 13.5px | 앱 아이콘 60×60 타일(슈퍼타원 n=4.6의 CSS 근사) | 일반 카드 |
| `--lm-radius-bubble` | 18px | 말풍선 | 버튼 |

## 5. 움직임 토큰

| 토큰 | 값 | 용도 | 금지 용도 |
|---|---|---|---|
| `--lm-dur-instant` | 100ms | 탭 눌림, 작은 상태 변화 | 화면 전환 |
| `--lm-dur-fast` | 160ms | 페이드, 체크, 배지 갱신 | 시트 |
| `--lm-dur-base` | 240ms | 일반 상태 전환, 목록 갱신 | 전체 화면 |
| `--lm-dur-slow` | 350ms | 화면 푸시, 시트, 모달 | 반복 애니메이션 |
| `--lm-ease-standard` | `cubic-bezier(0.2,0.8,0.2,1)` | 일반 전환 | 시트 |
| `--lm-ease-sheet` | `cubic-bezier(0.32,0.72,0,1)` | 시트·화면 푸시 | 퇴장 |
| `--lm-ease-exit` | `cubic-bezier(0.4,0,1,1)` | 퇴장·닫기 | 진입 |
| `--lm-tap-scale` | `0.97` | 탭 눌림 축소 | 카드 전체 |

- 화면 푸시는 350ms `ease-sheet`, 시트는 350ms `ease-sheet`, 탭 눌림은 0.97로 100ms다.
- `prefers-reduced-motion: reduce` 또는 게임 설정 "동작 줄이기"가 켜지면 이동·확대·축소를 없애고 150ms 페이드만 쓴다.
- 동기화 점의 깜빡임은 1.2초 주기, 불투명도 1↔0.35다. 초당 3회 이상 깜빡이지 않는다.

## 6. 화면 크롬 치수

| 토큰 | 값 | 용도 | 금지 용도 |
|---|---|---|---|
| `--lm-statusbar-h` | 47px | 상태바 높이(노치 안전영역 포함) | 실제 기기에서 `env(safe-area-inset-top)`보다 우선 |
| `--lm-safe-top` | `env(safe-area-inset-top, 0px)` | 실제 안전영역 | — |
| `--lm-safe-bottom` | `env(safe-area-inset-bottom, 0px)` | 실제 하단 안전영역 | — |
| `--lm-navbar-h` | 44px | 내비게이션 바 | 큰 제목 상태 |
| `--lm-navbar-large-h` | 96px | 큰 제목 펼침 상태 | 일반 내비 |
| `--lm-tabbar-h` | 49px | 탭 바 본체 | — |
| `--lm-tabbar-safe-h` | 34px | 탭 바 아래 기본 안전영역 | 실제 `env()`가 있으면 그 값 |
| `--lm-home-indicator-w` | 134px | 홈 인디케이터 폭 | — |
| `--lm-home-indicator-h` | 5px | 홈 인디케이터 높이 | — |
| `--lm-home-indicator-bottom` | 8px | 홈 인디케이터 하단 여백 | — |
| `--lm-row-h` | 44px | 목록 행 1줄 | 2줄 행 |
| `--lm-row-h-2` | 60px | 목록 행 2줄 | 1줄 행 |
| `--lm-row-h-thumb` | 72px | 썸네일 있는 행 | 텍스트만 있는 행 |
| `--lm-separator-w` | 0.5px | 구분선 두께 | 테두리 전체 |
| `--lm-touch-min` | 44px | 최소 터치 영역 | — |
| `--lm-side` | 16px | 화면 좌우 기본 여백 | 전체 폭 미디어 |

- 구분선 왼쪽 들여쓰기는 그 행의 텍스트 시작점과 같다. 썸네일 행은 썸네일 오른쪽 + 12px에서 시작한다.
- 상태바는 실제 기기에서 `calc(var(--lm-safe-top) + 44px)`를 우선 적용한다. 안전영역 값이 0인 환경에서만 47px를 쓴다.

## 7. z-index 층

| 토큰 | 값 | 층 | 용도 |
|---|---|---|---|
| `--lm-z-app` | 0 | 앱 콘텐츠 | 앱 화면 본문 |
| `--lm-z-nav` | 10 | 내비게이션 | 내비 바, 큰 제목 |
| `--lm-z-tabbar` | 20 | 탭 바 | 앱 하단 탭 |
| `--lm-z-banner` | 60 | 배너 | 알림 배너, 토스트 |
| `--lm-z-sheet` | 70 | 시트 | 하단 시트, 공유 시트, 정보(i) |
| `--lm-z-center` | 80 | 제어·알림 센터 | 제어 센터, 알림 센터 |
| `--lm-z-alert` | 90 | 경고창 | 시스템 경고창 |
| `--lm-z-pause` | 100 | 일시정지 메뉴 | 게임 일시정지 메뉴 |
| `--lm-z-debug` | 999 | 디버그 | 개발 빌드 전용 |

- 위계는 셸 기준이다. 앱 0 < 내비 10 < 탭바 20 < 배너 60 < 시트 70 < 제어센터·알림센터 80 < 경고창 90 < 일시정지 메뉴 100 < 디버그 999.
- 같은 층 안에서는 DOM 순서로 겹침을 정한다. 새 층을 만들지 않는다.

## 8. 앱 강조색 30종

- 기본 타일 배정은 [ICONOGRAPHY_AND_IMAGERY](ICONOGRAPHY_AND_IMAGERY.md) 4.2 표 그대로다.
- **계산 규칙:** 타일색의 색상(H)을 유지하고 채도를 +4%p(최대 100%), 명도를 +18%p 올린 값이 라이트 tint다. 다크 tint는 라이트 tint에서 명도를 다시 +18%p 올린 값이다. 흰 타일 앱(캘린더·미리 알림)은 남색 글리프 `#2B3A67`을 기준으로 계산한다.
- `--lm-app-on-tint`는 tint 면 위의 글자·아이콘 색이다. `#FFFFFF`와 `#111114` 중 대비가 큰 쪽을 쓴다. 30종 전부 대비 4.5:1 이상이다(최소 4.60:1).

| 앱 | 타일색 | 라이트 `--lm-app-tint` | 라이트 on-tint | 다크 `--lm-app-tint` | 다크 on-tint |
|---|---|---|---|---|---|
| 전화 | 초록 `#2E7D4F` | `#45C179` | `#111114` | `#8AD8AB` | `#111114` |
| 메시지 | 초록 `#2E7D4F` | `#45C179` | `#111114` | `#8AD8AB` | `#111114` |
| 톡 | 겨자 `#B8892B` | `#DFB460` | `#111114` | `#EED8AC` | `#111114` |
| 루프 | 자주 `#7A3E6E` | `#B55FA4` | `#111114` | `#D29EC7` | `#111114` |
| 블링크 | 먹색 `#23262B` | `#495261` | `#FFFFFF` | `#717E95` | `#111114` |
| 메일 | 남색 `#2B3A67` | `#415CAD` | `#FFFFFF` | `#7C90CD` | `#111114` |
| 사진 | 주황 `#C4622D` | `#E1956B` | `#111114` | `#F1CCB8` | `#111114` |
| 카메라 | 회청 `#4A5866` | `#6E869E` | `#111114` | `#A5B4C3` | `#111114` |
| 지도 | 청록 `#1F7A7A` | `#2DC8C8` | `#111114` | `#71DFDF` | `#111114` |
| 찾기 | 청록 `#1F7A7A` | `#2DC8C8` | `#111114` | `#71DFDF` | `#111114` |
| 캘린더 | 흰 타일 + 남색 글리프 `#2B3A67` | `#415CAD` | `#FFFFFF` | `#7C90CD` | `#111114` |
| 메모 | 겨자 `#B8892B` | `#DFB460` | `#111114` | `#EED8AC` | `#111114` |
| 음성 메모 | 먹색 `#23262B` | `#495261` | `#FFFFFF` | `#717E95` | `#111114` |
| 건강 | 주황 `#C4622D` | `#E1956B` | `#111114` | `#F1CCB8` | `#111114` |
| 지갑 | 먹색 `#23262B` | `#495261` | `#FFFFFF` | `#717E95` | `#111114` |
| 누리은행 | 남색 `#2B3A67` | `#415CAD` | `#FFFFFF` | `#7C90CD` | `#111114` |
| 바로택시 | 겨자 `#B8892B` | `#DFB460` | `#111114` | `#EED8AC` | `#111114` |
| 파일 | 회청 `#4A5866` | `#6E869E` | `#111114` | `#A5B4C3` | `#111114` |
| 설정 | 회청 `#4A5866` | `#6E869E` | `#111114` | `#A5B4C3` | `#111114` |
| 계산기 | 먹색 `#23262B` | `#495261` | `#FFFFFF` | `#717E95` | `#111114` |
| 웨이브 | 남색 `#2B3A67` | `#415CAD` | `#FFFFFF` | `#7C90CD` | `#111114` |
| 튜브 | 주황 `#C4622D` | `#E1956B` | `#111114` | `#F1CCB8` | `#111114` |
| 모아 | 회청 `#4A5866` | `#6E869E` | `#111114` | `#A5B4C3` | `#111114` |
| 한끼 | 초록 `#2E7D4F` | `#45C179` | `#111114` | `#8AD8AB` | `#111114` |
| 이웃마켓 | 겨자 `#B8892B` | `#DFB460` | `#111114` | `#EED8AC` | `#111114` |
| 연락처 | 회청 `#4A5866` | `#6E869E` | `#111114` | `#A5B4C3` | `#111114` |
| 미리 알림 | 흰 타일 + 남색 글리프 `#2B3A67` | `#415CAD` | `#FFFFFF` | `#7C90CD` | `#111114` |
| 시계 | 먹색 `#23262B` | `#495261` | `#FFFFFF` | `#717E95` | `#111114` |
| 날씨 | 청록 `#1F7A7A` | `#2DC8C8` | `#111114` | `#71DFDF` | `#111114` |
| 한서 포털 | 남색 `#2B3A67` | `#415CAD` | `#FFFFFF` | `#7C90CD` | `#111114` |

### 8.1 앱 스코프 선언 패턴

```css
[data-app="talk"] { --lm-app-tint: #DFB460; --lm-app-on-tint: #111114; }
[data-app="mail"] { --lm-app-tint: #415CAD; --lm-app-on-tint: #FFFFFF; }
[data-theme="light"] [data-app="talk"] { --lm-app-tint: #DFB460; --lm-app-on-tint: #111114; }
[data-theme="light"] [data-app="mail"] { --lm-app-tint: #415CAD; --lm-app-on-tint: #FFFFFF; }
```

> 예시는 톡·메일 두 개만 보인다. 나머지 28종은 위 표의 값을 같은 패턴으로 선언한다. 실제 구현에서는 표를 빌드 스크립트로 CSS에 생성한다.

## 9. CSS 커스텀 프로퍼티 선언 예시

```css
/* 다크가 기본. :root = 폰 기본 테마 */
:root {
  color-scheme: dark;

  /* 배경 */
  --lm-bg: #000000;
  --lm-bg-elevated: #1C1C1F;
  --lm-bg-grouped: #000000;
  --lm-bg-grouped-cell: #1C1C1F;
  --lm-bg-tertiary: #2A2A2E;

  /* 글자 */
  --lm-label: #F5F5F7;
  --lm-label-2: rgba(235, 235, 245, 0.62);
  --lm-label-3: rgba(235, 235, 245, 0.32);

  /* 선·채움 */
  --lm-separator: rgba(84, 84, 88, 0.6);
  --lm-fill: rgba(120, 120, 128, 0.32);
  --lm-fill-2: rgba(120, 120, 128, 0.24);

  /* 의미색 */
  --lm-tint: #5C8BFF;
  --lm-tint-ink: #5C8BFF;
  --lm-tint-fill: #5C8BFF;
  --lm-on-tint: #111114;
  --lm-destructive: #FF6369;
  --lm-destructive-ink: #FF6369;
  --lm-destructive-fill: #FF6369;
  --lm-success: #3DC373;
  --lm-success-ink: #3DC373;
  --lm-warning: #E6A23C;
  --lm-warning-ink: #E6A23C;
  --lm-on-status: #111114;
  --lm-label-2-aa: rgba(235, 235, 245, 0.62);

  /* 재질 */
  --lm-material-thin: rgba(28, 28, 31, 0.60);
  --lm-material-regular: rgba(28, 28, 31, 0.72);
  --lm-material-thick: rgba(28, 28, 31, 0.85);
  --lm-material-blur-thin: 20px;
  --lm-material-blur-regular: 30px;
  --lm-material-blur-thick: 40px;
  --lm-material-saturate: 180%;

  /* 그림자: 다크에서는 없음 */
  --lm-elev-1: none;
  --lm-elev-2: none;
  --lm-elev-3: none;

  /* 불투명도 */
  --lm-op-disabled: 0.38;
  --lm-op-secondary: 0.62;
  --lm-op-tertiary: 0.32;
  --lm-op-pressed: 0.72;
  --lm-op-scrim: 0.48;
  --lm-op-skeleton: 0.08;
  --lm-op-tint-wash: 0.12;
  --lm-op-sync-dot: 1;

  /* 글꼴 */
  --lm-font-sans: "Pretendard Variable", Pretendard, sans-serif;
  --lm-font-num: "Pretendard Variable", Pretendard, sans-serif;
  --lm-tracking-large: -0.4px;
  --lm-tracking-medium: -0.2px;
  --lm-tracking-small: 0;

  /* 타이포 */
  --lm-text-large-title-size: 34px;
  --lm-text-large-title-line: 41px;
  --lm-text-large-title-weight: 700;
  --lm-text-large-title-tracking: var(--lm-tracking-large);
  --lm-text-title-1-size: 28px;
  --lm-text-title-1-line: 34px;
  --lm-text-title-1-weight: 700;
  --lm-text-title-1-tracking: var(--lm-tracking-large);
  --lm-text-title-2-size: 22px;
  --lm-text-title-2-line: 28px;
  --lm-text-title-2-weight: 700;
  --lm-text-title-2-tracking: var(--lm-tracking-large);
  --lm-text-title-3-size: 20px;
  --lm-text-title-3-line: 25px;
  --lm-text-title-3-weight: 600;
  --lm-text-title-3-tracking: var(--lm-tracking-large);
  --lm-text-headline-size: 17px;
  --lm-text-headline-line: 22px;
  --lm-text-headline-weight: 600;
  --lm-text-headline-tracking: var(--lm-tracking-medium);
  --lm-text-body-size: 17px;
  --lm-text-body-line: 22px;
  --lm-text-body-weight: 400;
  --lm-text-body-tracking: var(--lm-tracking-medium);
  --lm-text-callout-size: 16px;
  --lm-text-callout-line: 21px;
  --lm-text-callout-weight: 400;
  --lm-text-callout-tracking: var(--lm-tracking-medium);
  --lm-text-subhead-size: 15px;
  --lm-text-subhead-line: 20px;
  --lm-text-subhead-weight: 400;
  --lm-text-subhead-tracking: var(--lm-tracking-medium);
  --lm-text-footnote-size: 13px;
  --lm-text-footnote-line: 18px;
  --lm-text-footnote-weight: 400;
  --lm-text-footnote-tracking: var(--lm-tracking-small);
  --lm-text-caption-1-size: 12px;
  --lm-text-caption-1-line: 16px;
  --lm-text-caption-1-weight: 400;
  --lm-text-caption-1-tracking: var(--lm-tracking-small);
  --lm-text-caption-2-size: 11px;
  --lm-text-caption-2-line: 13px;
  --lm-text-caption-2-weight: 500;
  --lm-text-caption-2-tracking: var(--lm-tracking-small);
  --lm-text-display-clock-size: 76px;
  --lm-text-display-clock-line: 80px;
  --lm-text-display-clock-weight: 300;
  --lm-text-display-clock-tracking: var(--lm-tracking-large);

  /* 동적 글자 */
  --lm-type-scale-xs: 0.85;
  --lm-type-scale-md: 1.0;
  --lm-type-scale-lg: 1.15;
  --lm-type-scale-xl: 1.3;
  --lm-type-scale: var(--lm-type-scale-md);

  /* 여백 */
  --lm-space-0_5: 2px;
  --lm-space-1: 4px;
  --lm-space-2: 8px;
  --lm-space-3: 12px;
  --lm-space-4: 16px;
  --lm-space-5: 20px;
  --lm-space-6: 24px;
  --lm-space-8: 32px;
  --lm-space-10: 40px;
  --lm-space-12: 48px;

  /* 모서리 */
  --lm-radius-xs: 6px;
  --lm-radius-sm: 10px;
  --lm-radius-md: 14px;
  --lm-radius-lg: 20px;
  --lm-radius-xl: 28px;
  --lm-radius-full: 999px;
  --lm-radius-icon: 13.5px;
  --lm-radius-bubble: 18px;

  /* 움직임 */
  --lm-dur-instant: 100ms;
  --lm-dur-fast: 160ms;
  --lm-dur-base: 240ms;
  --lm-dur-slow: 350ms;
  --lm-ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --lm-ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);
  --lm-ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --lm-tap-scale: 0.97;

  /* 크롬 */
  --lm-statusbar-h: 47px;
  --lm-safe-top: env(safe-area-inset-top, 0px);
  --lm-safe-bottom: env(safe-area-inset-bottom, 0px);
  --lm-navbar-h: 44px;
  --lm-navbar-large-h: 96px;
  --lm-tabbar-h: 49px;
  --lm-tabbar-safe-h: 34px;
  --lm-home-indicator-w: 134px;
  --lm-home-indicator-h: 5px;
  --lm-home-indicator-bottom: 8px;
  --lm-row-h: 44px;
  --lm-row-h-2: 60px;
  --lm-row-h-thumb: 72px;
  --lm-separator-w: 0.5px;
  --lm-touch-min: 44px;
  --lm-side: 16px;

  /* z-index */
  --lm-z-app: 0;
  --lm-z-nav: 10;
  --lm-z-tabbar: 20;
  --lm-z-banner: 60;
  --lm-z-sheet: 70;
  --lm-z-center: 80;
  --lm-z-alert: 90;
  --lm-z-pause: 100;
  --lm-z-debug: 999;
}

/* 라이트 오버라이드: 값만 바꾼다. 구조·치수·움직임은 그대로 */
[data-theme="light"] {
  color-scheme: light;

  --lm-bg: #F2F2F5;
  --lm-bg-elevated: #FFFFFF;
  --lm-bg-grouped: #F2F2F5;
  --lm-bg-grouped-cell: #FFFFFF;
  --lm-bg-tertiary: #E9E9EE;

  --lm-label: #111114;
  --lm-label-2: rgba(60, 60, 67, 0.62);
  --lm-label-3: rgba(60, 60, 67, 0.32);

  --lm-separator: rgba(60, 60, 67, 0.18);
  --lm-fill: rgba(120, 120, 128, 0.16);
  --lm-fill-2: rgba(120, 120, 128, 0.12);

  --lm-tint: #2F6BFF;
  --lm-tint-ink: #2A62F0;
  --lm-tint-fill: #2A62F0;
  --lm-on-tint: #FFFFFF;
  --lm-destructive: #E5484D;
  --lm-destructive-ink: #C92A2F;
  --lm-destructive-fill: #C92A2F;
  --lm-success: #2E9E5B;
  --lm-success-ink: #237A46;
  --lm-warning: #C98A1B;
  --lm-warning-ink: #8A5A00;
  --lm-on-status: #111114;
  --lm-label-2-aa: rgba(60, 60, 67, 0.74);

  --lm-material-thin: rgba(250, 250, 252, 0.60);
  --lm-material-regular: rgba(250, 250, 252, 0.72);
  --lm-material-thick: rgba(250, 250, 252, 0.85);

  --lm-elev-1: 0 1px 2px rgba(0, 0, 0, 0.10);
  --lm-elev-2: 0 4px 12px rgba(0, 0, 0, 0.12);
  --lm-elev-3: 0 12px 32px rgba(0, 0, 0, 0.18);
}

/* 사용자 동적 글자 */
[data-text-size="xs"] { --lm-type-scale: var(--lm-type-scale-xs); }
[data-text-size="md"] { --lm-type-scale: var(--lm-type-scale-md); }
[data-text-size="lg"] { --lm-type-scale: var(--lm-type-scale-lg); }
[data-text-size="xl"] { --lm-type-scale: var(--lm-type-scale-xl); }

/* 본문 적용 예 */
.lm-body {
  font-family: var(--lm-font-sans);
  font-size: calc(var(--lm-text-body-size) * var(--lm-type-scale));
  line-height: calc(var(--lm-text-body-line) * var(--lm-type-scale));
  font-weight: var(--lm-text-body-weight);
  letter-spacing: var(--lm-text-body-tracking);
  font-variant-numeric: tabular-nums;
}
```

## 확인 사항

- **없음(문서 내 미해결).** 아래는 해결된 충돌 기록이다.
  - 원본 아트 디렉션 4.3의 "잠금화면 시계 72pt Light", "목록 행 높이 56pt"는 공통 지시서 3.2의 `display-clock 76/80 300`, 목록 행 44/60/72로 대체한다. [ICONOGRAPHY_AND_IMAGERY.md](./ICONOGRAPHY_AND_IMAGERY.md)에 원문과 함께 우선순위를 적었다.
  - 원본 아트 디렉션 3.1의 색 토큰(`--os-*`)은 폐기한다. 이 문서의 `--lm-*`가 단일 출처다.
