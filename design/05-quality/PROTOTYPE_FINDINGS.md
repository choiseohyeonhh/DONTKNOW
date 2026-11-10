# PROTOTYPE_FINDINGS — 폰 프로토타입 검수 결과와 본 구현 규칙

> **역할:** `phone-prototype/`(2026-11-09) 검수에서 나온 오류·불일치를 모으고, 본 구현(`game/`)이 같은 실수를 하지 않게 규칙으로 바꾼다.
> **출처:** 서현 피드백(2026-11-10) — "메시지 읽어도 1 안 사라짐, 나머지 짜잘하게 안 맞는 것들도 찾아서" + 코드·설계 대조 감사.
> **범위 결정:** 서현 지시에 따라 이 문서의 2·3절 항목은 **프로토타입에 고치지 않고 설계에만 반영**한다. 프로토타입에 반영한 것은 1절(디자인)뿐이다.

## 1. 프로토타입에 반영한 것 (2026-11-10)

| 항목 | 내용 | 설계 반영 |
|---|---|---|
| 앱 아이콘 모양 | 타일 마스크를 더 각진 슈퍼타원(n=5)으로 바꿨다. 직선 구간이 길고 모서리만 굽어 아이폰 앱 아이콘 비율에 가깝다. 폴더 아이콘도 같은 마스크 | [ICONOGRAPHY_AND_IMAGERY](../02-design/ICONOGRAPHY_AND_IMAGERY.md) 3절, AC-702 |
| 상단 끌어내리기 | 상태바 왼쪽(폭 60%) = 알림 센터, 오른쪽 = 제어 센터. 홈·앱 어디서나, 손가락을 따라 내려오고 위로 밀어 닫는다. 터치(아이폰 사파리)에서는 알림 센터 아래쪽 띠에서 밀어 올려 닫는다(목록 스크롤과 겹치지 않게) | [SYSTEM_SHELL](../03-features/SYSTEM_SHELL_SPECIFICATION.md) 4.2·4.4·4.5, [FRONTEND_ARCHITECTURE](../04-tech/FRONTEND_ARCHITECTURE.md) 제스처 표, AC-701 |
| 끌 때 글자 선택 | 기기 화면의 글자 선택·길게 누르기 메뉴를 막았다(입력칸 제외) | — |

## 2. 읽음·배지 공통 규칙 (본 구현 규범)

서현이 찾은 "메시지 앱에서 읽어도 1이 안 사라짐"은 한 앱의 버그가 아니라 **구조 문제**다. 프로토타입은 앱마다 숫자를 따로 들고 있고(`t.unread`, `LM.BADGES` 상수), 화면을 연 뒤 그 숫자를 바꾸거나 다시 그리지 않는다. 메시지·톡·블링크·루프 DM·홈 배지가 전부 같은 뿌리다(3절 1~4·21·22·37번).

1. **단일 상태:** 읽음은 상태 트리 하나(`state.read[appId][itemId] = { readAt, receipt: "sent"|"pending"|"none" }`)에만 있다. 배지 숫자를 저장하지 않는다. 홈·폴더·탭·목록 행·알림 센터 묶음·잠금화면 수는 전부 이 상태에서 **계산**한다([STATE_MANAGEMENT](../04-tech/STATE_MANAGEMENT.md)).
2. **여는 순간 읽음:** 대화·메일·DM·채팅을 화면에 띄우는 순간 `markRead(appId, itemId)`를 부른다. 그 프레임 안에 모든 배지가 함께 줄어든다(AC-707). "1" 표시는 160ms 페이드로 사라진다.
3. **오프라인:** 내 쪽 표시(배지·"1")는 바로 줄어든다. **상대에게 가는 읽음만** `receipt: "pending"`으로 미뤘다가 다음 온라인 순간 보낸다([MESSAGING](../03-features/MESSAGING_SPECIFICATION.md) 5.1, TR-02의 "오프라인에서 열면 읽음이 대기"와 같은 뜻).
4. **미리보기는 읽음이 아니다:** 알림 미리보기·잠금화면으로 본 것은 `markRead`를 부르지 않는다(V-15).
5. **알림은 원본을 따라간다:** 알림 센터·잠금화면 카드는 원본 항목 ID를 가진다. 원본이 읽히면 알림 카드도 읽힘 상태가 되고, 원본이 지워져도 카드는 남는다(SYSTEM_SHELL 4.4).
6. **배지는 읽음 개념이 있는 앱에만:** 은행·포털처럼 "안 읽은 항목"이 없는 앱은 홈 배지를 달지 않는다. 달려면 그 앱 안에 읽음 대상(새 알림 목록 등)이 있어야 한다.
7. **시작 배지:** 3/15 03:58 오프라인 캐시의 실제 안 읽은 수에서 계산한다. 첫 온라인 후 동기화분을 더해 다시 계산한다. 문서에 적힌 배지 숫자는 예시이고, 정답은 계산값이다(5절 Q-OPEN-183).

## 3. 검수 목록 (37건)

분류: 읽음 = 2절 위반 / 데이터 = 같은 사건이 앱마다 다름 / 캐논 = 설계와 다름 / UI = 표기·문법 불일치. **모두 본 구현에서 지킬 규칙으로 읽는다.** 프로토타입은 이 목록대로 고치지 않았다.

| # | 분류 | 심각도 | 위치(파일:줄, 2026-11-10 기준) | 무엇이 틀렸나 | 정답·근거 | 본 구현에서 지킬 규칙 |
|---|---|---|---|---|---|---|
| 1 | 읽음 | 높음 | phone-prototype/js/apps/msg.js:58-61, 102-136 | 대화방을 열어도 각 스레드의 `t.unread`가 0이 되지 않는다. `unread(t)`는 정적 `t.unread`를 그대로 반환하고, `room()`에는 talk.js:195-197 같은 markRead가 없다. 그래서 목록의 빨간 배지 "1"이 계속 남는다. | SCREEN_SPECIFICATIONS_APPS.md §3 SCR-MSG-LIST 8 "읽음은 온라인에서 방을 연 뒤 전송", SCR-MSG-ROOM 8 읽음 "1" 160ms 페이드 | 항목별 read 상태를 하나의 소스로 두고, 방 진입 시 그 항목을 읽음으로 바꾼 뒤 목록·배지를 같은 값에서 다시 그린다. |
| 2 | 읽음 | 높음 | phone-prototype/js/data.js:26, phone-prototype/js/shell.js:188-189 | 홈 배지가 정적 `LM.BADGES`다. 메일을 읽어 앱 안 배지가 5→4가 되어도 홈은 5, 메시지를 읽어도 4 그대로다. 코드 전체에서 BADGES를 쓰는 곳은 읽기뿐이다(쓰기 없음). | SYSTEM_SHELL_SPECIFICATION.md §4.2·§8.2 "배지 숫자는 앱의 '안 읽은 항목 수' 규칙", SCREEN_SPECIFICATIONS.md §3.4 11 "온라인 후 갱신" | 홈·폴더 배지는 상수로 두지 말고 중앙 unread 스토어에서 계산하며, 읽음 이벤트마다 재계산한다. |
| 3 | 읽음 | 높음 | phone-prototype/js/apps/talk.js:53, 70, 196 | 방을 열면 메시지 unread는 0이 되지만 채팅 목록 행 배지와 탭 배지는 렌더 시점 값 그대로다. 런타임 확인: 온라인에서 아빠 방을 읽은 뒤에도 탭·행 배지가 "6"으로 남았다. 오프라인 시작에서는 탭·행이 0인데 홈은 7이다. | MESSAGING_SPECIFICATION.md §3.4·§5.1, SCREEN_SPECIFICATIONS.md §4.2 8 "온라인에서 아빠 방을 열면 목록의 6과 각 1이 사라짐" | 방 읽음 시 목록 행·탭 배지를 구독 갱신하고, 오프라인 읽음은 대기 상태로 표시한다. |
| 4 | 데이터 | 높음 | phone-prototype/js/data.js:26 | 시작 배지가 오프라인 캐시 및 설계 예시와 다르다. talk 7(설계 예 6), blink 3(설계 오프라인 2), loop 2(실제 안 읽은 DM 1). 유틸 폴더 배지도 blink 3으로 계산된다. | SCREEN_SPECIFICATIONS.md §3.4 "톡 배지 6", SCREEN_SPECIFICATIONS_APPS.md §2 SCR-OS-FOLDER "블링크 배지=안 읽은 2(오프라인)→3", SECURE_MESSAGING_SPECIFICATION.md §86 | 시작 배지는 오프라인 캐시의 실제 안 읽은 수로 계산하고, 첫 온라인 후 같은 규칙으로 재계산한다. |
| 5 | 캐논 | 높음 | phone-prototype/js/apps/bank.js:36-40, 77-93 | 오프라인인데 간편비밀번호가 통하고 계좌·거래내역이 열린다. 로그인 전에 온라인 체크가 없고, 오프라인 안내만 띄운 채 잔액과 내역을 보여 준다. | COMMERCE_AND_FINANCE_SPECIFICATION.md §0·§1.4·§1.6, SCREEN_SPECIFICATIONS_APPS.md SCR-BANK-LOGIN 12 "오프라인 진입 시 온라인이 필요합니다. 키패드 비활성", SCR-BANK-HOME 12 "오프라인 진입 불가" | 은행은 온라인 전 진입을 막고 키패드를 비활성화하며 "온라인이 필요합니다"만 표시한다. |
| 6 | 캐논 | 높음 | phone-prototype/js/apps/loop.js:216-247, 351-368, 615-663 | 오프라인에서 스토리 열람·검색 탭·DM 목록/대화가 모두 동작한다. 설계는 오프라인에서 검색·스토리·DM을 불가로 정한다(캐시 피드·프로필·활동 기록만). | SNS_SPECIFICATION.md §4.7·§7 상태 "오프라인: 캐시 피드·프로필·활동 기록만. 검색·스토리·DM·실시간 불가" | 오프라인에서는 피드·프로필·활동 기록만 열고, 스토리·검색·DM은 안내와 함께 진입을 막는다. |
| 7 | 캐논 | 높음 | phone-prototype/js/apps/loop.js:23, 32, 37, 41, 56-57, 97 | 3/15 03:58 캐시 경계 이후 또는 T2 데이터가 오프라인에 노출된다: @jh_lee_99 가입·3/15 13:20 댓글, kang 편집 기록 3/15 03:00, minji 게시물(1/20·3/13), 차단·활동 기록(3/15 01:02 슬레이트). | NARRATIVE_CANON.md §4.1 "폰 안에 있는 것은 3/15 03:58 이전 데이터뿐", EVIDENCE_LEDGER.md E-46·E-103·E-104·E-105·E-222(T2) | T2 항목은 `LM.online()`일 때만 목록·프로필·검색에 노출한다. |
| 8 | 캐논 | 중간 | phone-prototype/js/apps/tube.js:111-213 | 오프라인에서도 재생·자막 검색·댓글이 동작한다. 안내만 "오프라인 저장본"이고 실제 재생이 막히지 않는다. | VIDEO_AND_COMMUNITY_SPECIFICATION.md §0·§1.7·§3 "오프라인: 재생 불가. '온라인이 필요합니다'. 캐시된 제목·채널 이름만" | 오프라인은 제목·썸네일·채널만 보여 주고 재생·검색·댓글을 막는다. |
| 9 | 캐논 | 중간 | phone-prototype/js/apps/moa.js:60-107 | 오프라인에서 게시판 글 본문·댓글을 연다. 또 3/16 23:40·3/17 12:04 등 3/15 03:58 이후 글과 3/17 09:12 글이 캐시에 있는 것처럼 보인다. | VIDEO_AND_COMMUNITY_SPECIFICATION.md §2.7·§3 "오프라인: 게시판 열람 불가. 캐시된 글 제목만", NARRATIVE_CANON.md §4.1 | 오프라인은 캐시된 글 제목만 보여 주고 본문·댓글은 막는다. |
| 10 | 캐논 | 중간 | phone-prototype/js/apps/msg.js:51-55 | 첫 온라인 즉시 EV-06 경고가 뜨고, 그 시각도 조회 시점 `LM.now()`로 찍힌다. 설계는 첫 온라인 후 게임 36분(T+36)에 고정 시각으로 도착한다. | MESSAGING_SPECIFICATION.md §2.4 "첫 온라인 후 게임 36분에 도현의 경고", SCREEN_SPECIFICATIONS_APPS.md SCR-MSG-ROOM 10 "EV-06(T+36)" | 첫 온라인 시각을 기준으로 +36분에 도착하도록 예약하고, 그 전에는 시러스 캐시만 보여 준다. |
| 11 | 캐논 | 중간 | phone-prototype/js/apps/blink.js:100, 108 | "읽고 60초 뒤 삭제" 문구만 있고, 읽음 처리·60초 카운트다운·양쪽 삭제가 구현돼 있지 않다. | SECURE_MESSAGING_SPECIFICATION.md §100 "읽음 이벤트 … 60초 카운트다운 … 0이 되면 양쪽에서 사라진다", §196 | 방 진입 시 읽음 이벤트를 만들고 60초 뒤 메시지를 지우며, 사라진 뒤에는 빈 상태 문구만 남긴다. |
| 12 | 데이터 | 중간 | phone-prototype/js/data.js:35, 42, 53 vs phone-prototype/js/apps/talk.js:22, 28, 36-37 | 잠금 알림의 톡 메시지가 앱에 없다: 서아 3/14 22:52 "알겠어. 근데 무슨 일인데?", 단톡 3/14 16:12 "지훈: 오늘 저녁 7시 학교 앞 ㄱ?", 지훈 3/10 22:04 "내일 학식 ㄱ?". 단톡 알림 제목 "새내기 단톡"도 방 이름 "경영 26 새내기"와 다르다. | SYSTEM_SHELL_SPECIFICATION.md §4.4·UI_UX_GUIDELINES.md §2.6 알림은 앱이 실제 보낸 것, MESSAGING_SPECIFICATION.md §3.4 방 이름 | 알림과 앱 메시지를 한 데이터에서 생성하고, 알림 제목은 대화방 이름과 맞춘다. |
| 13 | 데이터 | 중간 | phone-prototype/js/data.js:38, 50 vs phone-prototype/js/apps/loop.js:617-618, 75-87 | 루프 알림 3/14 20:44 "새 메시지"와 3/12 00:10 "seoa.film님이 스토리를 올렸습니다"에 대응하는 DM·스토리가 없다(지훈 DM은 1/8 21:14, 서아 스토리는 3/14 21:40·2/14). | SYSTEM_SHELL_SPECIFICATION.md §4.1·§4.4, SNS_SPECIFICATION.md §8 데이터 | 알림은 실제 DM·스토리 이벤트에서만 만들고, 시각·발신자를 그 이벤트와 맞춘다. |
| 14 | 데이터 | 중간 | phone-prototype/js/data.js:44, 51, 54 vs phone-prototype/js/apps/msg.js:24-45 | 잠금 알림 "#5678 이웃마켓 인증번호", "누리카드 자동이체 실패"에 해당 메시지 스레드가 없다. "#1234" 경찰 알림은 제목이 기관명이 아니고 본문도 앱 스레드("성원경찰서", "3/20 10:00 출석요구 안내드립니다")와 다르다. | SCREEN_SPECIFICATIONS_APPS.md SCR-MSG-LIST 10(시스템 문자 4종), UI_UX_GUIDELINES.md §2.6 기관명 제목 | 메시지 스레드와 알림의 제목·본문·시각을 일치시키고, 없는 스레드의 알림은 만들지 않는다. |
| 15 | 데이터 | 중간 | phone-prototype/js/data.js:39 vs phone-prototype/js/apps/market.js:22-26 | 이웃마켓 알림은 3/14 20:15 "구매자가 메시지를 보냈어요"인데, 채팅은 19:10(나)·20:30(구매자)뿐이라 20:15에 구매자 메시지가 없다. | COMMERCE_AND_FINANCE_SPECIFICATION.md §3.4 E-161(19:10, 20:30) | 알림 시각을 실제 메시지 시각(20:30)에 맞춘다. |
| 16 | 데이터 | 중간 | phone-prototype/js/apps/bank.js:90 vs 119 | 같은 데이터에 대해 한 화면은 "1/9 ~ 3/10 · 입금 14건", 다른 문구는 "1/9~3/6 입금 14건"이라고 적는다. | NARRATIVE_CANON.md §3.1 E-80(1/9~3/6 입금 14건), COMMERCE_AND_FINANCE_SPECIFICATION.md §1.4·§1.6, SCREEN_SPECIFICATIONS_APPS.md SCR-BANK-TRANSACTIONS 10 | 기간은 1/9~3/6으로 통일하고 3/10 김*자 15,000,000은 별도 1건으로 표기한다. |
| 17 | 데이터 | 중간 | phone-prototype/js/apps/msg.js:8-22 vs phone-prototype/js/apps/bank.js:18-19, phone-prototype/js/apps/mail.js:65-70 | 한결 "입금 확인" 19건이 전부 매월 5일 09:00으로 균일하다. 은행의 한결 출금은 1/27·2/26이고 메일 마지막 안내는 2/27인데, 메시지 마지막 확인은 2026.02.05라 2/26 이체와 대응하지 않는다. | EVIDENCE_LEDGER.md E-05·E-83, NARRATIVE_CANON.md §3.1 | 한결 확인 문자는 은행 출금일과 1:1로 맞추고 마지막 확인을 2/26(또는 2/27)로 둔다. |
| 18 | UI | 중간 | phone-prototype/js/apps/find.js:119-129 | 원격 기기 지우기가 액션 시트 2단계로 처리된다. 설계는 원격 지우기만 중앙 경고창(ui.alert)을 쓰고, 문구도 "이 기기를 원격으로 지우시겠습니까? / 사진·메시지·메모가 이 기기에서 삭제됩니다. 되돌릴 수 없습니다. / 취소·원격 지우기"로 고정한다. | UI_UX_GUIDELINES.md §4.1·§4.2, INTERACTION_SPECIFICATIONS.md §64, COMPONENT_SPECIFICATIONS.md CMP-ALERT | 원격 지우기만 `ui.alert`로, 정확한 제목·본문·버튼 순서(취소 위, 원격 지우기 아래)를 쓴다. |
| 19 | UI | 중간 | phone-prototype/js/apps/photo.js:16, 19; phone-prototype/js/apps/mail.js:28, 45; phone-prototype/js/apps/loop.js:32, 37; phone-prototype/js/apps/moa.js:11, 30; phone-prototype/js/apps/market.js:9-14 | 날짜 표기가 섞여 있다: "2026. 1. 20. 15:02"(사진·메일), "2026.03.05"(튜브), "3/8"(루프 게시물), "3월 9일"(모아·마켓 구분선), "3/17 12:04"(모아). | UI_UX_GUIDELINES.md §2.5: 메시지·목록 M/D HH:MM, 절대 날짜 YYYY.MM.DD, 잠금화면 M월 D일 요일 | 게시물·서류는 `YYYY.MM.DD`, 목록·알림은 `M/D HH:MM`, 날짜 구분선은 `M/D`로 형식을 고정한다. |
| 20 | UI | 중간 | phone-prototype/js/apps/bank.js:110, phone-prototype/js/apps/market.js:9-14 | 금액 표기가 섞인다: 은행 행은 "+15,000,000"(원 없음)인데 상세는 "+15,000,000원"이고, 마켓은 "45만 원"이다. | UI_UX_GUIDELINES.md §2.5 "금액: 천 단위 쉼표 + 원", COMPONENT_SPECIFICATIONS.md CMP-TRANSACTION-ROW "+113,000,000원" | 금액 UI는 전부 `N,NNN원`으로 통일한다(계산기 식·메모 본문 제외). |
| 21 | 읽음 | 중간 | phone-prototype/js/apps/blink.js:17, 31, 44-52 | 오프라인 배지 2는 맞지만 `unread()`가 모든 수신 메시지를 계속 세므로 방을 열어도 배지가 줄지 않는다. 읽음·60초 삭제와도 연결되지 않는다. | SECURE_MESSAGING_SPECIFICATION.md §86(오프라인 2→첫 온라인 3), §100, SCREEN_SPECIFICATIONS_APPS.md §2 SCR-OS-FOLDER 68 | 읽음 이벤트로 unread를 줄이고, 오프라인이면 대기 상태로 두며, 60초 뒤 삭제와 같은 상태를 쓴다. |
| 22 | 읽음 | 중간 | phone-prototype/js/apps/loop.js:246, 617-623, 631-663 | DM 버튼 배지가 하드코딩 2이고 실제 스레드 unread는 1이다. DM을 열어도 `t.unread`가 0이 되지 않아 목록 행 배지 1이 유지된다. | SNS_SPECIFICATION.md §4.6·§4.7 DM 읽음, SCREEN_SPECIFICATIONS_SNS_SETTINGS.md DM 읽음 "1" 페이드 | DM 읽음 시 중앙 unread를 줄이고, DM 버튼·행 배지를 같은 값에서 계산한다. |
| 23 | 데이터 | 낮음 | phone-prototype/js/data.js:52 vs phone-prototype/js/apps/mail.js:26-110 | 잠금 알림의 한서대 "새내기 오리엔테이션 사진 공유"(3/11 08:00) 메일이 받은편지함에 없다. | SCREEN_SPECIFICATIONS_APPS.md SCR-MAIL-INBOX 10, SYSTEM_SHELL_SPECIFICATION.md §4.4 | 알림은 실제 메일 항목과 연결하고, 없는 메일 알림은 만들지 않는다. |
| 24 | 데이터 | 낮음 | phone-prototype/js/apps/bank.js:96-127 | 거래내역이 5행+요약만 보인다. 설계·수용 기준은 61건이다. | ACCEPTANCE_CRITERIA.md AC-036(거래 61건), FEATURE_SPECIFICATION.md FEAT-29 | 캐논 묶음을 모두 담고 61건을 가상 스크롤/페이지로 보여 준다. |
| 25 | 데이터 | 낮음 | phone-prototype/js/apps/wallet.js:11-13 | 3/14(토) 리버뷰역 하차 행에 `repeat:true`라 "화·금 반복" 배지가 붙는다. 3/14는 사건 당일의 특별 이동이다. | EVIDENCE_LEDGER.md E-39(화·금 반복은 1/9~3/6, 3/14는 19:31~19:52 사건), MAPS_AND_MOBILITY_SPECIFICATION.md §4 | 3/14 행은 반복 아님으로 두고, 반복 배지는 1/9~3/6 화·금에만 붙인다. |
| 26 | 데이터 | 낮음 | phone-prototype/js/apps/cal.js:8, 41, 65 | TODAY가 2026-03-17 상수다. 게임 시계(×4)로 자정이 지나면 잠금화면은 3/18인데 캘린더는 3/17을 "오늘"로 표시하고 지난 일정 판정도 어긋난다. | core.js:68-70 게임 시계, SYSTEM_SHELL_SPECIFICATION.md §4.3 | "오늘"은 `LM.now()`에서 계산하고, 자정이 지나면 날짜 강조·지난 일정 판정을 다시 한다. |
| 27 | UI | 낮음 | phone-prototype/js/apps/msg.js:114; phone-prototype/js/apps/talk.js:146; phone-prototype/js/apps/market.js:67; phone-prototype/js/apps/mail.js:152 | 빈 상태 문구가 앱마다 다르다: msg "메시지 없음", talk "메시지가 없습니다", market "글이 없습니다"(설계 "판매 글이 없습니다"), mail "메일이 없습니다.". | UI_UX_GUIDELINES.md §2.4 빈 상태 표, SCREEN_SPECIFICATIONS_APPS.md SCR-MARKET-FEED 11 | 공통 빈 상태 문자열 표를 쓰고, 같은 개념은 모든 앱에서 같은 문구로 쓴다. |
| 28 | UI | 낮음 | phone-prototype/js/apps/loop.js:315, 391, 419; phone-prototype/js/apps/tube.js:128, 162, 198; phone-prototype/js/apps/clock.js:132 | 뒤로 버튼 라벨이 섞여 있다. 대부분 부모 화면명("메일함", "채팅")을 쓰지만 루프·튜브는 "뒤로", 시계 알람 상세는 현재 제목과 같은 "알람"이다. | COMPONENT_SPECIFICATIONS.md CMP-NAV-BAR 101 "뒤로 버튼 라벨 '뒤로'", SCREEN_SPECIFICATIONS_APPS.md 각 화면 "뒤로 + h1" | 뒤로 버튼 표기 규칙을 하나로 정해 전 앱에 같은 라벨을 쓴다. |
| 29 | UI | 낮음 | phone-prototype/js/shell.js:188 | 홈 배지의 접근성 라벨이 "안 읽음 N"인데 설계 문구는 "안 읽은 메시지 N개"다. | SCREEN_SPECIFICATIONS.md §3.4 14 | 스크린리더 라벨을 설계 문구("안 읽은 메시지 N개")로 맞춘다. |
| 30 | UI | 낮음 | phone-prototype/js/shell.js:403-410 | 알림 센터 헤더에 설계의 "3월 17일 화요일 · 23개" 중 총 개수가 빠져 있다. | SCREEN_SPECIFICATIONS.md §3.5 10 | 알림 센터 상단에 날짜와 총 알림 개수를 표시한다. |
| 31 | UI | 낮음 | phone-prototype/js/apps/blink.js:47-51 | "열면 상대에게 읽음 표시가 갈 수 있습니다"라는 모호한 문구를 쓴다. 설계는 관찰 가능한 동작만 말하도록 "읽음은 즉시 전송됩니다"로 정한다. | SECURE_MESSAGING_SPECIFICATION.md §42·§54 | 확정된 동작 문구("읽음은 즉시 전송됩니다")로 바꾼다. |
| 32 | UI | 낮음 | phone-prototype/js/apps/msg.js:171-187 | 오프라인에서 보내면 실패 말풍선("온라인이 필요합니다 · 다시 보내기")을 만든다. 설계는 오프라인 발신 불가·초안 유지, 전송 버튼 비활성이다. | SCREEN_SPECIFICATIONS_APPS.md SCR-MSG-ROOM 12, MESSAGING_SPECIFICATION.md §2.6 | 오프라인은 입력만 유지하고 전송 버튼을 비활성화하며 실패 말풍선을 만들지 않는다. |
| 33 | UI | 낮음 | phone-prototype/js/data.js:14-23 | 홈 1페이지에 캐논의 톡·루프 아이콘이 없고 독에만 있다(파일 주석에 적힌 의도된 예외). | SYSTEM_SHELL_SPECIFICATION.md §4.2·§8.2 "1페이지: …톡·루프, 독: 전화·메시지·톡·루프" | 캐논 확정 전까지 예외로 문서화하고, 확정 시 1페이지에도 배치한다. |
| 34 | 데이터 | 낮음 | phone-prototype/js/apps/set.js:22 | 클립보드 기록이 5개뿐이다. 설계는 최근 10개다. | SETTINGS_SPECIFICATION.md §8.9 키보드, EVIDENCE_LEDGER.md E-180(10개) | 클립보드 10개를 채우고 값·시각을 캐논과 맞춘다. |
| 35 | 캐논 | 낮음 | phone-prototype/js/apps/voice.js:7-13 | 전사 구간을 5행으로 나눠 보여 준다(27:05 남자/실장 분리). 캐논은 4구간(03:10, 11:42, 27:05, 41:50)이다. | MEDIA_SPECIFICATION.md §3.8 캐논 데이터 | 4구간으로 묶어 표시하고 내용은 캐논 그대로 둔다. |
| 36 | 데이터 | 낮음 | phone-prototype/js/apps/talk.js:28, 36-37 vs SCREEN_SPECIFICATIONS.md §4.2 10 | 설계 표는 지훈·서아 방에 배지 1을 명시하지만 프로토타입은 둘 다 0이다. 같은 표의 홈 예시는 톡 배지 6이라 문서 안 기준도 6/8로 갈린다. | SCREEN_SPECIFICATIONS.md §4.2 10, MESSAGING_SPECIFICATION.md §3.4 | 방별 unread와 홈·탭 배지의 합산 규칙을 하나로 확정한 뒤 같은 값에서 계산한다. |
| 37 | 읽음 | 낮음 | phone-prototype/js/data.js:26, phone-prototype/js/apps/bank.js, phone-prototype/js/apps/portal.js | 은행 1·포털 2 배지가 있지만 두 앱에는 읽음 상태가 없어 열어도 배지가 사라질 방법이 없다. 포털은 오프라인에서 배지 2인데 앱은 "저장된 화면이 없다"고 한다. | SYSTEM_SHELL_SPECIFICATION.md §4.2 배지=안 읽은 항목 수, SCREEN_SPECIFICATIONS_APPS.md SCR-PORTAL-HOME 12 "오프라인 접근 불가" | 배지가 있는 앱은 대응하는 읽음 상태를 갖추거나, 읽음 개념이 없으면 홈 배지를 표시하지 않는다. |

## 4. 공통 원인과 본 구현 장치

| 원인 | 해당 번호 | 본 구현 장치 |
|---|---|---|
| 앱마다 사본 데이터 | 12~17·23 | 같은 사건은 콘텐츠 항목 하나에서 모든 앱 화면과 알림을 만든다. 앱별 사본 금지(AC-708, 린터 L07) |
| 숫자 하드코딩 | 1~4·21·22·36·37 | 2절 단일 상태 + 계산 배지(AC-707) |
| 오프라인·T2 게이트 누락 | 5~9 | 층(T1/T2)·온라인 게이트를 항목 필드로 두고 화면이 아니라 데이터 계층에서 거른다(린터 L14) |
| 게임 시계 미사용 | 10·26 | "오늘"·도착 시각은 전부 게임 시계에서 계산. 예약 사건은 이벤트 큐(T+36 등) |
| 표기 규칙 미적용 | 19·20·27~29 | 날짜·금액·빈 상태·뒤로 라벨을 공통 포매터·문자열 표 하나로([UI_UX_GUIDELINES](../02-design/UI_UX_GUIDELINES.md) 2절). 앱 코드에서 날짜·금액 문자열을 직접 만들지 않는다 |
| 프로토타입 범위 밖 동작 | 11·24·35 | 본 구현 WP에서 캐논대로(블링크 60초 삭제, 거래 61건, 전사 4구간) |

## 5. 결정이 필요한 것 ([OPEN_QUESTIONS](../06-execution/OPEN_QUESTIONS.md) A 범주에 등록)

- **Q-OPEN-183 (톡 시작 배지):** 화면 명세 4.2는 톡 홈 배지 6과 지훈·서아 방 배지 1을 함께 적어 서로 맞지 않는다. 캐논상 3/14 22:31 서아 방 메시지는 도현이 보낸 것이므로 서아 방의 안 읽음은 0이고, 지훈 3/14 23:58은 1이다. **추천:** 오프라인 시작 배지 = 지훈 1(톡 1), 첫 온라인 후 아빠 6통을 더해 7, 3/17 22:30 단톡 글 이후 8. 문서의 "6"은 계산값으로 바꾼다.
- **Q-OPEN-184 (홈 1페이지 톡·루프 중복):** 캐논은 톡·루프를 1페이지와 독에 함께 둔다. 같은 앱 아이콘 두 개는 홈 문법에 없다. **추천:** 1페이지에서 빼고 독에만 둔다(프로토타입과 같음).
- **은행 오프라인 진입(3절 5번):** 프로토타입은 화면 확인용으로 열어 두었다. 본 구현은 캐논대로 온라인 전 진입 불가. 결정 불필요.
