# FEATURE SPECIFICATION — DONTKNOW

> **역할:** 기능 `FEAT-xx`의 단일 목록. 각 기능의 목적·사용자 행동·관련 요구사항·상세 명세 위치·MVP 포함 여부를 고정한다. 화면·데이터·상태의 상세는 링크된 03-features 문서가 단일 출처다.
> **단일 출처:** `FEAT-xx` ID. 앱의 층·핵심 수사 행동·남기는 흔적·필수 ○/△는 [[FEATURE_SPECIFICATION](FEATURE_SPECIFICATION.md)](FEATURE_SPECIFICATION.md) 0절과 같다. 요구사항은 [`../00-foundation/REQUIREMENTS.md`](../00-foundation/REQUIREMENTS.md), 범위는 [`../00-foundation/PROJECT_SCOPE.md`](../00-foundation/PROJECT_SCOPE.md)가 단일 출처다.
> **참조:** [`PRD.md`](PRD.md), [`NARRATIVE_CANON.md`](NARRATIVE_CANON.md), [`ACTION_PROOF.md`](ACTION_PROOF.md), [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md), [`TRACES_AND_REACTIONS.md`](TRACES_AND_REACTIONS.md), [`PLAYTIME_BUDGET.md`](PLAYTIME_BUDGET.md), [`BUSINESS_RULES.md`](BUSINESS_RULES.md).
> **MVP 표기:** `○ 완전` = 완전 구현, `△ 최소` = 최소 데이터·동작, `아니오` = 본편. 앱 30종은 전부 MVP 포함(○ 23 / △ 7)이다.

## 1. 셸 기능

| ID | 기능 | 목적 | 사용자 행동 | 관련 REQ | 상세 명세 | MVP |
|---|---|---|---|---|---|---|
| **FEAT-01** | 잠금화면·응급정보 | 첫 5분의 문법(잠금화면에서도 볼 수 있는 것이 있다)을 가르치고, 070921로 T1을 연다. | 잠금화면을 펼쳐 알림 23개를 읽고, 좌하단 "응급"에서 생년월일을 확인하고, 6자리 키패드에 070921을 입력한다. | REQ-F-002, REQ-F-003, REQ-F-070 | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) | ○ 완전 |
| **FEAT-02** | 홈·앱 전환 | 폰 주인의 습관(앱 배치·숨긴 블링크)을 공간으로 보여 주고, 앱 왕복을 빠르게 한다. | 3페이지 홈을 넘기고, 독·폴더를 열고, 홈 인디케이터로 앱을 전환한다. | REQ-F-004, REQ-F-008, REQ-F-016 | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) | ○ 완전 |
| **FEAT-03** | 상태바·알림·제어 센터·스크린샷 | 온라인/오프라인의 스위치와 흔적의 사전 징후(동기화 점)를 제공한다. | 상태바를 읽고, 알림 센터를 내리고, 제어 센터에서 Wi-Fi·비행기·집중 모드·스크린샷·화면 기록을 조작한다. | REQ-F-001, REQ-F-005, REQ-F-006, REQ-F-015 | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) | ○ 완전 |
| **FEAT-04** | 전역 검색 | 플레이어가 본 적 있는 낱말로 폰 전체를 가로질러 연결 시험을 한다. | 홈에서 위로 끌어 검색어를 입력하고, 앱별 결과 그룹을 연다. | REQ-F-007 | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) | ○ 완전 |
| **FEAT-05** | 공유 시트 | 무엇을 누구에게 보내느냐로 추리를 드러내고 흔적을 만든다. | 항목을 길게 눌러 공유를 고르고, 최근 상대 5명·앱·스크린샷 저장 중 하나를 선택한다. | REQ-F-009 | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) | ○ 완전 |
| **FEAT-06** | 작성창·키보드 | 대화를 선택지가 아니라 실제 타이핑과 첨부로 진행한다. | 추천 문장을 누르거나 직접 입력하고, +로 사진·파일·위치·녹음을 첨부하고, 클립보드 칩을 붙여넣는다. | REQ-F-010, REQ-F-067 | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) | ○ 완전 |
| **FEAT-07** | 정보(i) 패널 | 메타데이터를 "열어야 보이게" 해 추리의 근거를 제공한다. | 항목을 길게 눌러 정보(i)를 열고 촬영 시각·위치·보낸 기기·받은 경로·거래 메모를 확인한다. | REQ-F-011 | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) | ○ 완전 |
| **FEAT-08** | 일시정지 메뉴 | 폰 밖 유일한 게임 UI. 계속·막혔을 때·설정·저장을 제공한다. | 세 손가락 길게 누르기(데스크톱 Esc)로 열고, "막혔을 때"의 3단계 힌트를 본다. | REQ-F-012, REQ-F-060 | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) | ○ 완전 |
| **FEAT-09** | 프롤로그·엔딩 시네마틱 | 아버지가 아는 것의 경계를 자막으로만 제시하고, 결말의 정서를 스틸로 닫는다. | 프롤로그 스틸 3컷을 보고, 엔딩에서 스틸·자막·마지막 폰 화면을 본다. | REQ-F-013, REQ-F-014 | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) | ○ 완전 |

## 2. 앱 30종

> 표의 층·핵심 수사 행동·남기는 흔적·필수는 [[FEATURE_SPECIFICATION](FEATURE_SPECIFICATION.md)](FEATURE_SPECIFICATION.md) 0절 그대로다. "목적"과 "사용자 행동"은 그 행을 구현 가능한 문장으로 푼 것이다.

| ID | 앱 | 층 | 핵심 수사 행동 | 남기는 흔적 | 필수 | 목적 | 사용자 행동 | 관련 REQ | 상세 명세 | MVP |
|---|---|---|---|---|---|---|---|---|---|---|
| **FEAT-10** | 전화 | T1 | 통화 기록 대조 | — | △ | 부재중·발신의 시간대로 3/14 밤과 3/11 신고를 확인한다. | 최근 기록을 열어 3/11 10:30 은행 통화 14분, 3/14 부재중 다수를 본다. 발신은 "서비스 없음". | REQ-F-017 | [MESSAGING](../03-features/MESSAGING_SPECIFICATION.md) | △ 최소 |
| **FEAT-11** | 메시지 | T1/T2 | 시스템 문자, **슬레이트와의 대화** | 읽음(TR-02) | ○ | 시스템 문자로 사건의 공식 사실을, 시러스 메시지로 살아 있는 아들을 만난다. | 지급정지·출석요구 문자를 읽고, 도현(슬레이트)의 "30분" 메시지에 답장한다. | REQ-F-018 | [MESSAGING](../03-features/MESSAGING_SPECIFICATION.md) | ○ 완전 |
| **FEAT-12** | 톡 | T1/T2 | 다중기기 동기화로 폰을 잃은 뒤 메시지까지 | 읽음 "1"(TR-02) | ○ | 아버지의 목소리 6통과 지훈·서아의 3/15 메시지로 관계와 생존을 확인한다. | 아빠 방의 "1"을 열고, 지훈·서아 방을 읽고, 지훈에게 공유·통화한다. | REQ-F-019 | [MESSAGING](../03-features/MESSAGING_SPECIFICATION.md) | ○ 완전 |
| **FEAT-13** | 루프 | T1~T3 | 계정·관계·시각·위치 교차, 차단·이전 이름 | 조회·활동 중·좋아요·DM 읽음(TR-03~05, 14) | ○ | SNS를 수사의 중심으로 써서 사람·조직·거짓말을 찾는다. | 계정 정보·활동 기록·차단 목록·스토리 조회자·사진으로 찾기·DM을 쓴다. | REQ-F-020 | [SNS](../03-features/SNS_SPECIFICATION.md) | ○ 완전 |
| **FEAT-14** | 블링크 | T3 | 사라지는 메시지 | 읽음·캡처(TR-06) | ○ | 실장의 위협 3통을 흔적 없이 읽는 방법을 플레이어가 찾게 한다. | 유틸 폴더에서 앱을 찾고, 미리보기·비행기 모드·스크린샷 중 방법을 골라 읽는다. | REQ-F-021, REQ-F-068 | [SECURE_MESSAGING](../03-features/SECURE_MESSAGING_SPECIFICATION.md) | ○ 완전 |
| **FEAT-15** | 메일 | T1/T2 | 영수증·안내·취소·예약 발송·경찰 | 수정(TR-09) | ○ | 공식 기록·미끼의 붕괴·마지막 선택(예약 메일)을 담는다. | 메일을 읽고, 청운 취소를 확인하고, 김태윤에게 쓰거나 예약 메일을 수정·삭제한다. | REQ-F-022 | [MAIL_AND_CLOUD](../03-features/MAIL_AND_CLOUD_SPECIFICATION.md) | ○ 완전 |
| **FEAT-16** | 사진 | T1/T3 | 메타데이터, 원본 복귀, 버스트, 최근 삭제 | 새 사진·스크린샷 동기화(TR-07) | ○ | 사진의 정보(i)와 편집 전 원본으로 사람·장소·시각을 특정한다. | 원본 복귀·버스트 18장·숨김/최근 삭제 앨범·스크린샷 12장을 확인한다. | REQ-F-023 | [MEDIA](../03-features/MEDIA_SPECIFICATION.md) | ○ 완전 |
| **FEAT-17** | 카메라 | T0/T1 | **도현의 방을 찍는다**(정체 증명, 서랍) | 동기화(TR-07) | ○ | 유일하게 "지금 아버지가 있는 방"을 보여 주고, 정체 증명의 수단이 된다. | 4구도를 넘기고 서랍을 열어 봉투 "박미선님 65"를 찍어 도현에게 보낸다. | REQ-F-024 | [MEDIA](../03-features/MEDIA_SPECIFICATION.md) | ○ 완전 |
| **FEAT-18** | 지도 | T1/T2 | 저장 장소, **최근 검색(다른 기기 포함)**, 경로 | — | ○ | 장소·이동 시간·다른 기기의 검색을 겹쳐 위치를 추리한다. | 저장 "K", 최근 검색, 경로 계산, 사진 레이어, 해담고시텔 검색을 본다. | REQ-F-025 | [MAPS_AND_MOBILITY](../03-features/MAPS_AND_MOBILITY_SPECIFICATION.md) | ○ 완전 |
| **FEAT-19** | 찾기 | T2 | 슬레이트 위치(반경), 소리 재생 | 소리(TR-11) | ○ | 아들이 지금도 같은 계정으로 살아 있음을 반경 300m로 보여 준다. | 슬레이트를 확인하고, 소리를 재생하거나 위치 공유를 요청한다. | REQ-F-026 | [MAIL_AND_CLOUD](../03-features/MAIL_AND_CLOUD_SPECIFICATION.md) | ○ 완전 |
| **FEAT-20** | 연락처 | T1 | **아빠 생일**(메모 암호), 메모 칸 | — | ○ | 메모 암호의 첫 번째 출처와 아버지의 생활(자동이체)을 남긴다. | "아빠" 카드에서 생일 1968.04.03과 메모 "5일 — 80"을 본다. | REQ-F-027 | [MESSAGING](../03-features/MESSAGING_SPECIFICATION.md) | ○ 완전 |
| **FEAT-21** | 캘린더 | T1 | 반복·지난 일정, 생일 캘린더 | — | ○ | 반복 일정으로 생활의 리듬과 자수 계획을 보여 준다. | "엄마" 11/2, 고시원 계약, 3/20 성원서, 아빠 생일 58번째를 본다. | REQ-F-028 | [PERSONAL_DATA_APPS](../03-features/PERSONAL_DATA_APPS_SPECIFICATION.md) | ○ 완전 |
| **FEAT-22** | 메모 | T1/T3 | 지워질 메모, 잠긴 메모 | 새 메모·수정 동기화(TR-08) | ○ | 아들의 미발송 편지와 빚 계산을 담고, 원격 삭제의 상실을 가장 직접적으로 보여 준다. | 잠긴 메모를 680403으로 열고 "아빠한테"·"비번"·"남은 거"를 읽는다. | REQ-F-029 | [PERSONAL_DATA_APPS](../03-features/PERSONAL_DATA_APPS_SPECIFICATION.md) | ○ 완전 |
| **FEAT-23** | 미리 알림 | T1/T2 | 도현의 체크리스트(실시간으로 체크됨) | 체크 동기화(TR-08) | ○ | 3/20 → 3/18로 앞당긴 자수 계획과 도현의 현재를 실시간으로 보여 준다. | "3/18" 목록을 읽고, 체크가 실시간으로 바뀌는 것을 본다. | REQ-F-030 | [PERSONAL_DATA_APPS](../03-features/PERSONAL_DATA_APPS_SPECIFICATION.md) | ○ 완전 |
| **FEAT-24** | 음성 메모 | T1 | 42분 녹음(기기에만), 전사 검색 | 업로드(TR-13) | ○ | 폰에만 남은 유일본 녹음을 플레이어가 지키거나 보낸다. | 전사를 켜고 "강"·"B2"를 검색하거나 파형에서 4구간을 찾아 듣는다. | REQ-F-031 | [MEDIA](../03-features/MEDIA_SPECIFICATION.md) | ○ 완전 |
| **FEAT-25** | 시계 | T1 | 알람 목록(라벨·반복) | — | △ | 원래 자수일 3/20과 화·금 리듬의 보조 출처. | 알람 "경찰서 10시"·"GJ"를 확인한다. | REQ-F-032 | [PERSONAL_DATA_APPS](../03-features/PERSONAL_DATA_APPS_SPECIFICATION.md) | △ 최소 |
| **FEAT-26** | 날씨 | T1/T2 | 저장 지역(다른 기기에서 추가된 것 포함) | — | △ | 도현이 3/15 아침 성원구청동에 있었다는 약한 정황. | 저장 지역 "성원구청동"을 온라인 후 확인한다. | REQ-F-033 | [MAPS_AND_MOBILITY](../03-features/MAPS_AND_MOBILITY_SPECIFICATION.md) | △ 최소 |
| **FEAT-27** | 건강 | T1 | 걸음·심박으로 시간대 검증 | — | △ | 3/14 밤 42분의 정지와 도주를 신체 데이터로 교차한다. | 20:09~20:51 걸음 0, 20:52~21:04 급증, 심박 131을 본다. | REQ-F-034 | [PERSONAL_DATA_APPS](../03-features/PERSONAL_DATA_APPS_SPECIFICATION.md) | △ 최소 |
| **FEAT-28** | 지갑 | T1 | 교통카드 승하차, 결제 | — | ○ | 3/14 밤의 이동과 화·금 리버뷰 반복을 분 단위로 확인한다. | 승하차 기록과 21:22 택시 결제를 본다. | REQ-F-035 | [MAPS_AND_MOBILITY](../03-features/MAPS_AND_MOBILITY_SPECIFICATION.md) | ○ 완전 |
| **FEAT-29** | 누리은행 | T3 | 거래내역 = 미드포인트 | — | ○ | 피해금·수수료·한결 이체를 한 화면에서 대조해 "나 때문이었다"에 닿게 한다. | 110221로 열고, 61건을 필터·검색하고, 상세 4건을 공유한다. | REQ-F-036 | [COMMERCE_AND_FINANCE](../03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md) | ○ 완전 |
| **FEAT-30** | 바로택시 | T1/T2 | 이용 내역, 분실물 문의, **최종 호출** | 호출(최종 행동) | ○ | 마지막 행동(어디로 갈 것인가)을 플레이어의 손에 쥐여 준다. | 이용 내역·분실물 문의를 읽고, 도착지를 검색해 호출한다. | REQ-F-037 | [MAPS_AND_MOBILITY](../03-features/MAPS_AND_MOBILITY_SPECIFICATION.md) | ○ 완전 |
| **FEAT-31** | 파일 | T1 | 첨부·다운로드, **받은 경로(근처 공유)** | — | ○ | 기기 이름 "민석의 폰"과 교육 날짜를 파일 메타로 남긴다. | 교육자료.pdf의 정보(i)에서 받은 곳·시각을 본다. | REQ-F-038 | [MAIL_AND_CLOUD](../03-features/MAIL_AND_CLOUD_SPECIFICATION.md) | ○ 완전 |
| **FEAT-32** | 웨이브 | T1/T2 | 검색·방문 기록(**다른 기기 기록 포함**), 로그아웃 상태로 웹 루프 보기 | — | ○ | 검색 기록으로 의심의 궤적을, 로그아웃 열람으로 흔적 없는 관찰을 제공한다. | 검색 기록 8줄, 다른 기기 기록, 로그아웃 loop.kr 열람을 한다. | REQ-F-039 | [PERSONAL_DATA_APPS](../03-features/PERSONAL_DATA_APPS_SPECIFICATION.md) | ○ 완전 |
| **FEAT-33** | 튜브 | T2 | 얼굴 없는 채널, 자막 검색, 댓글 흔적 | 시청 기록 | ○ | 얼굴 없는 채널의 물건(시계·화이트보드·"그치?")으로 실장을 특정한다. | 영상 2편의 핵심 구간·자막 검색·댓글·시청 기록을 본다. | REQ-F-040 | [VIDEO_AND_COMMUNITY](../03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md) | ○ 완전 |
| **FEAT-34** | 모아 | T2 | 익명 글·쪽지 | 쪽지 읽음 | ○ | "해담" 한 줄과 익명7(민지)로 또 한 명의 명의인에 닿는다. | 내 글·댓글·쪽지를 읽고 민지에게 쪽지를 보낸다. | REQ-F-041 | [VIDEO_AND_COMMUNITY](../03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md) | ○ 완전 |
| **FEAT-35** | 한끼 | T2 | 다중기기 주문 기록(배송지 = 현재 위치) | 재주문(EV-27) | ○ | 진짜 은신처의 호실(207)과 현재성을 동시에 제공한다. | 주문 3건의 배송지·주문 기기를 확인하고, 재주문을 누른다. | REQ-F-042 | [COMMERCE_AND_FINANCE](../03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md) | ○ 완전 |
| **FEAT-36** | 이웃마켓 | T1 | 급처 판매, 직거래 채팅 | — | ○ | 도현이 돈을 갚으려 했다는 사실과 3/14 밤의 약속을 보여 준다. | 판매 3건과 모니터 구매자와의 19:10 채팅을 본다. | REQ-F-043 | [COMMERCE_AND_FINANCE](../03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md) | ○ 완전 |
| **FEAT-37** | 한서 포털 | T2 | 출결, **휴학 신청(슬레이트)** | — | △ | 자수 후의 삶을 준비한 도현의 현재를 보여 준다. | 출결과 3/16 22:40 휴학 신청(신청 기기 슬레이트)을 본다. | REQ-F-044 | [PERSONAL_DATA_APPS](../03-features/PERSONAL_DATA_APPS_SPECIFICATION.md) | △ 최소 |
| **FEAT-38** | 계산기 | T1 | 기록 20줄 | — | △ | 빚 계산·93일·급처 합계로 "갚으려 했다"를 숫자로 남긴다. | 위로 쓸어 기록 20줄을 본다. | REQ-F-045 | [PERSONAL_DATA_APPS](../03-features/PERSONAL_DATA_APPS_SPECIFICATION.md) | △ 최소 |
| **FEAT-39** | 설정 | T1/T2 | Wi-Fi·시러스·스크린 타임·개인정보·알림·키보드·근처 공유·가족·암호 등 | 집중 모드·동기화·암호 변경(TR-12, 15) | ○ | 폰 주인의 생활이 가장 정직하게 남는 곳. 온라인/오프라인·흔적 관리의 중심. | 19개 메뉴를 검색·탐색하고, 동기화·미리보기·Wi-Fi·근처 공유·스크린 타임을 조작한다. | REQ-F-046, REQ-F-047 | [SETTINGS](../03-features/SETTINGS_SPECIFICATION.md) | ○ 완전(디스플레이·소리 세부는 본편) |

## 3. 게임 시스템

| ID | 기능 | 목적 | 사용자 행동 | 관련 REQ | 상세 명세 | MVP |
|---|---|---|---|---|---|---|
| **FEAT-40** | 접근 층 T0~T4·가시성 | 정보가 "언제 열리는지"를 층으로 통제해 온라인/오프라인의 긴장을 만든다. | 잠금 해제·온라인·게이트·삭제 상태에 따라 보이는 항목이 달라지는 것을 경험한다. | REQ-F-048 | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) · [`BUSINESS_RULES.md`](BUSINESS_RULES.md) | ○ 완전 |
| **FEAT-41** | 온라인/오프라인·동기화 | 위험과 정보의 교환을 플레이어가 직접 선택하게 한다. | Wi-Fi·비행기 모드를 켜고 끄고, 앱별 동기화 스위치를 바꾸고, 다른 기기 기록이 들어오는 것을 본다. | REQ-F-049 | [`BUSINESS_RULES.md`](BUSINESS_RULES.md) · [[MAIL_AND_CLOUD_SPECIFICATION](../03-features/MAIL_AND_CLOUD_SPECIFICATION.md)](../03-features/MAIL_AND_CLOUD_SPECIFICATION.md) 1절 | ○ 완전 |
| **FEAT-42** | 보존 수단 | 지워지기 전에 붙잡는 방법을 플레이어가 스스로 찾게 한다. | 먼저 읽기·스크린샷·동기화 끄기·비행기 모드·암호 변경·정체 증명 중 하나를 쓴다. | REQ-F-050 | [`BUSINESS_RULES.md`](BUSINESS_RULES.md) · [[BUSINESS_RULES](BUSINESS_RULES.md)](BUSINESS_RULES.md) 4절 | ○ 완전 |
| **FEAT-43** | 행동 증명 V·직접 입력 | 게임이 채점하지 않고, 플레이어의 행동만이 세계를 움직이게 한다. | 비밀번호·검색어를 입력하고, 단서를 공유하고, 설정을 바꾸고, 택시를 호출한다. | REQ-F-051, REQ-F-052 | [`ACTION_PROOF.md`](ACTION_PROOF.md) | ○ 완전 |
| **FEAT-44** | 흔적·반응 TR | 조사 행위가 상대에게 보이고, 상대의 반응이 새 정보가 되게 한다. | 읽고·조회하고·켜고·공유한 뒤, 상대의 새 메시지·삭제·게시물을 받는다. | REQ-F-053 | [`TRACES_AND_REACTIONS.md`](TRACES_AND_REACTIONS.md) | ○ 완전 |
| **FEAT-45** | NPC 상태·대화 | 인물이 자기 앎 안에서만 반응하게 해 세계의 일관성을 지킨다. | 추천 문장·직접 입력·공유·흔적으로 대화하고, 상태 변화(DH·JH·SA·MJ·KS 등)를 경험한다. | REQ-F-054, REQ-F-073 | [`CHARACTERS.md`](CHARACTERS.md) · [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md) 4절 | ○ 완전 |
| **FEAT-46** | 실시간 사건 EV | 세계가 플레이어와 무관하게도 움직이게 한다. | 정해진 시각의 새 스토리·배달 주문·경찰 회신을 발견하고, 행동으로 촉발된 사건을 받는다. | REQ-F-055 | [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md) 3절 | ○ 완전 |
| **FEAT-47** | "30분" 위기 | "지워지기 전에 붙잡아라"를 가장 세게 체감시킨다. | 경고 메시지에 답장하거나, 방 사진을 보내거나, 비행기 모드·암호 변경·무응답 중 하나를 택한다. | REQ-F-056 | [`BUSINESS_RULES.md`](BUSINESS_RULES.md) · [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md) EV-06·08·19 | ○ 완전 |
| **FEAT-48** | 원격 삭제·원격 지우기 | 상실을 실제로 발생시켜 선택의 무게를 만든다. | 메모·사진이 사라지는 것을 목격하고, 원격 지우기 전에 대응한다. | REQ-F-057 | [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md) EV-04·05·07·08 · [[MAIL_AND_CLOUD_SPECIFICATION](../03-features/MAIL_AND_CLOUD_SPECIFICATION.md)](../03-features/MAIL_AND_CLOUD_SPECIFICATION.md) 5절 | ○ 완전 |
| **FEAT-49** | 시계·시간 흐름 | 시간 압박을 타이머가 아니라 세상의 속도로 준다. | 상태바 시계와 타임스탬프로 남은 시간을 계산하고, 일시정지·시간 흐름 끄기를 쓴다. | REQ-F-058 | [`PLAYTIME_BUDGET.md`](PLAYTIME_BUDGET.md) 6절 | ○ 완전 |
| **FEAT-50** | 엔딩 판정 A·A′·B·C·D | 플레이어가 한 행동의 묶음으로 결말을 결정한다. | 택시 호출·호실 입력·빚 고백·예약 메일·증거 송부·위치 유출의 결과로 엔딩을 맞는다. | REQ-F-059 | [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md) 6절 | ○ 완전 |
| **FEAT-51** | 힌트 | 막힘을 이탈이 아니라 다음 행동으로 바꾼다. | 일시정지 메뉴 → 막혔을 때에서 3단계(방향·앱·위치)를 본다. | REQ-F-060 | [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md) 7절 | ○ 완전 |
| **FEAT-52** | 자동 저장 | 진행을 잃지 않게 한다. | 접근 해제·EV·공유·메일 발송 시 자동 저장된다. | REQ-F-061 | [[SYSTEM_ARCHITECTURE](../04-tech/SYSTEM_ARCHITECTURE.md)](../04-tech/SYSTEM_ARCHITECTURE.md) 1절 | ○ 완전 |
| **FEAT-53** | 이중 경로·콘텐츠 린터 | 한 화면을 놓쳐도 막히지 않게 하고, 소실 안전을 자동 검증한다. | (개발·검수) 필수 행동마다 서로 다른 앱 2개 이상의 근거를 확인한다. | REQ-F-063 | [`ACTION_PROOF.md`](ACTION_PROOF.md) · [[SYSTEM_ARCHITECTURE](../04-tech/SYSTEM_ARCHITECTURE.md)](../04-tech/SYSTEM_ARCHITECTURE.md) 5절 | ○ 완전 |
| **FEAT-54** | 엔딩 후 "다시 보기" | 놓친 기능과 남긴 흔적을 돌아보게 한다. | 엔딩 후 찾지 못한 앱 기능 수와 흔적 목록을 본다. 정답은 공개되지 않는다. | REQ-F-064 | [[BUSINESS_RULES](BUSINESS_RULES.md)](BUSINESS_RULES.md) 8절 | 아니오(본편) |
| **FEAT-55** | 미끼·진실 위치 | 오프라인의 확신(청운 304)을 온라인의 사실(해담 207)로 뒤집는다. | 청운 계약·사진을 확인한 뒤, 청운 취소 메일과 한끼·키보드·Wi-Fi 기록으로 해담 207을 찾는다. | REQ-F-065 | [`LOCATIONS.md`](LOCATIONS.md) · [[LOCATIONS](LOCATIONS.md)](LOCATIONS.md) | ○ 완전 |
| **FEAT-56** | 디버그 패널 | 개발·검수가 시각·게이트·플래그·사건을 직접 제어하게 한다. | `?debug=1`에서 시각 이동, 게이트 열기, 플래그 확인, EV 강제. | REQ-F-066 | [[SYSTEM_ARCHITECTURE](../04-tech/SYSTEM_ARCHITECTURE.md)](../04-tech/SYSTEM_ARCHITECTURE.md) 2절 | ○ 완전 |
| **FEAT-57** | 텍스트 대치·클립보드 | 실제 폰의 습관을 수사 단서로 바꾼다. | 클립보드 기록을 열고, 작성창에서 "ㅈㅅ"를 쳐 주소로 치환된다. | REQ-F-067 | [[SETTINGS_SPECIFICATION](../03-features/SETTINGS_SPECIFICATION.md)](../03-features/SETTINGS_SPECIFICATION.md) 9절 | ○ 완전 |
| **FEAT-58** | 미리보기 무읽음 열람 | 흔적을 피하는 실력 자체를 보상한다. | 알림 미리보기를 "항상"으로 바꿔 블링크 3통을 읽음 없이 본다. | REQ-F-068 | [[SETTINGS_SPECIFICATION](../03-features/SETTINGS_SPECIFICATION.md)](../03-features/SETTINGS_SPECIFICATION.md) 7절 | ○ 완전 |
| **FEAT-59** | 도현 도주 F-MOVED | 플레이어의 압박이 세계를 바꾸고, 두 번째 기회를 만든다. | DH≤2에서 해담·207을 입력하거나 재주문해 도현을 움직이게 하고, 성원스파를 다시 찾는다. | REQ-F-069 | [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md) 4.1 | ○ 완전 |
| **FEAT-60** | 온보딩 없는 학습 | 튜토리얼 대신 폰의 문법을 놀이로 가르친다. | 잠금화면의 응급정보, 정보(i), 길게 누르기를 스스로 발견한다. | REQ-F-070 | [[BUSINESS_RULES](BUSINESS_RULES.md)](BUSINESS_RULES.md) 4절 · [[SYSTEM_SHELL_SPECIFICATION](../03-features/SYSTEM_SHELL_SPECIFICATION.md)](../03-features/SYSTEM_SHELL_SPECIFICATION.md) 3절 | ○ 완전 |

## 4. 본편 전용 기능

| ID | 기능 | 목적 | 사용자 행동 | 관련 REQ | 상세 명세 | MVP |
|---|---|---|---|---|---|---|
| **FEAT-61** | 루프 부계정 @dontknow__ | 차단되지 않은 또 하나의 눈과 도현의 속마음을 제공한다. | 계정 전환 → 비밀번호 재설정 → mailbox.kr 메일 코드 → 로그인. TR-10(경계 +1), EV-10. | REQ-F-071 | [[SNS_SPECIFICATION](../03-features/SNS_SPECIFICATION.md)](../03-features/SNS_SPECIFICATION.md) 2.2 | 아니오(본편) |
| **FEAT-62** | 하린 대화·사과(V-07) | 피해자에게 직접 닿는 선택과 후일담을 제공한다. | 하린 글 좋아요·댓글·DM으로 정체 공개·사과·계좌 관련을 보낸다. F-HARIN. | REQ-F-072 | [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md) 4.4 | 아니오(본편) |
| **FEAT-63** | 정체 숨김 분기(′) | "도현인 척"하는 위험한 대화 경로를 확장한다. | 정체를 밝히지 않고 지훈·서아·하린·민지·사칭과 대화한다. | REQ-F-074 | [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md) 4절 | 아니오(본편) |
| **FEAT-64** | 후일담 변주 | 플레이어가 남긴 선택의 여파를 더 촘촘히 보여 준다. | 엔딩 크레딧 후일담에서 인물별 결과를 본다. | REQ-F-075 | [`PROGRESSION_AND_ENDINGS.md`](PROGRESSION_AND_ENDINGS.md) 6.4 | 아니오(본편) |
| **FEAT-65** | 사운드·성우 | 소리로 긴장과 정서를 보강한다. | 알림음·환경음·녹음 성우를 듣는다. 소리 없이도 모든 정보는 전달된다. | REQ-F-075 | [[SYSTEM_SHELL_SPECIFICATION](../03-features/SYSTEM_SHELL_SPECIFICATION.md)](../03-features/SYSTEM_SHELL_SPECIFICATION.md) 10절 | 아니오(본편) |
| **FEAT-66** | 수동 슬롯 3 | 플레이어가 직접 저장·불러오기로 분기를 실험한다. | 일시정지 메뉴에서 슬롯 3개에 저장·불러오기. | REQ-F-062 | [[SYSTEM_SHELL_SPECIFICATION](../03-features/SYSTEM_SHELL_SPECIFICATION.md)](../03-features/SYSTEM_SHELL_SPECIFICATION.md) 10절 | 아니오(본편) |
| **FEAT-67** | 정식 시네마틱 스틸 | 프롤로그·엔딩의 최종 품질 아트를 제공한다. | (감상) 정식 스틸과 자막을 본다. | REQ-F-075 | [[ICONOGRAPHY_AND_IMAGERY](../02-design/ICONOGRAPHY_AND_IMAGERY.md)](../02-design/ICONOGRAPHY_AND_IMAGERY.md) 6절 | 아니오(본편) |

## 5. FEAT ↔ REQ 추적 요약

| 구분 | FEAT | 개수 |
|---|---|---|
| 셸 | FEAT-01~09 | 9 |
| 앱 30종 | FEAT-10~39 | 30 |
| 게임 시스템 | FEAT-40~60 | 21 |
| 본편 전용 | FEAT-61~67 | 7 |
| **합계** |  | **67** |

- 모든 `REQ-F`는 하나 이상의 FEAT에 매핑된다. 본편 전용 FEAT-61~67은 REQ-F-071~075·REQ-F-062에 매핑된다.
- MVP FEAT = 60개(셸 9 + 앱 30 + 시스템 21). 본편 전용 7개.

## 확인 사항

- **Q-OPEN-13:** FEAT-61~67(부계정·하린 대화·정체 숨김·후일담 변주·사운드·수동 슬롯·정식 스틸)은 [IMPLEMENTATION_ROADMAP](../06-execution/IMPLEMENTATION_ROADMAP.md)의 "본편 제외"를 기능 단위로 옮긴 것이다. 요구사항은 REQ-F-071~075·REQ-F-062로 매핑했다.
- **Q-OPEN-14:** 앱 30종의 상세 명세 문서 경로는 지시서 4절의 03-features 배정을 따랐다. 각 문서가 확정되면 FEAT별 화면 목록(SCR-)·데이터 필드 링크를 이 표에 추가한다.
- **Q-OPEN-15:** FEAT-54 "다시 보기"는 [BUSINESS_RULES](BUSINESS_RULES.md)에 있으나 [IMPLEMENTATION_ROADMAP](../06-execution/IMPLEMENTATION_ROADMAP.md) MVP 목록에 없다. 본편으로 분류했다. P7에서 MVP 포함 여부를 재검토할 수 있다.
