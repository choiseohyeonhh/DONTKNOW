# 아트 에셋 목록

> 근거: bible 12.1~12.3. 사양: 세로 1170×2532 기준(@3x), WebP + JPEG 폴백. 장면은 1인칭 정지 + 미세 모션 레이어(별도 PNG/WebP 알파 또는 CSS 애니메이션).
> 상태: `□` 미착수. 우선순위 P0 = 수직 슬라이스(M2), P1 = 1차 출시 필수, P2 = 품질 향상.

## 1. 장면 (ART.scene.*)

| ID | 장소/컷 | 세션 | 미세 모션 | 우선 |
|---|---|---|---|---|
| ART.scene.home_hall_night | 도현 방 앞 복도, 02:47, 방문 틈 아래 빛 없음 | S1, S2 | 없음(정지 그 자체) | P0 |
| ART.scene.school_gate | 성원고 교문, 아침 | S3 | 나무 그림자 | P1 |
| ART.scene.staffroom | 교무실, 담임 책상 쪽(담임은 손·어깨) | S3 | 형광등 | P1 |
| ART.scene.counsel_room | 상담실, 창가, 상담교사 손에 쥔 머그 | S3 | 커튼 | P1 |
| ART.scene.entrance_in | 현관 안쪽, 신발장, 현관문 | S4, S8, S10 | 없음 | P1 |
| ART.scene.entrance_yujin | 현관 열린 문 너머 유진(어깨 아래·손) | S4 | 없음 | P1 |
| ART.scene.police_office | 실종수사팀 사무실, 김 형사 책상 너머 손, 서류 | S5 | 형광등 깜빡임 1개 | P1 |
| ART.scene.mart_counter | 편의점 계산대, 모니터 | S6 | 냉장고 문 반사 | P1 |
| ART.scene.mart_front | 편의점 앞(19:07의 장소) — 낮 | S6 | 행인 그림자 | P2 |
| ART.scene.intercom | 인터폰 화면 프레임(영상은 별도) | S8 | 화면 노이즈 | P1 |
| ART.scene.pharmacy_in | 약국 카운터 너머 약사의 손, 진열장 | S9 | 형광등 | P1 |
| ART.scene.pharmacy_bench | 창밖 벤치, 비 젖음 | S9 | 빗방울 | P1 |
| ART.scene.pharmacy_shutter | 셔터 내려가는 컷 | S9 종료 | 셔터 이동 | P1 |
| ART.scene.living_table | 거실 테이블 위 봉투·포스트잇·충전기 | S10~S12 | 없음 | P1 |
| ART.scene.parking_b3 | 지하 3층, 깜빡이는 형광등 하나, 형의 뒷모습(차 옆) | S13 | 형광등 깜빡임(불규칙 아님, 고정 패턴) | P1 |
| ART.scene.living_dawn | 거실 새벽 05:40, 도현 방문이 열려 있음 | S14 A | 창밖 빛 변화 | P1 |
| ART.scene.police_front_morning | 경찰서 앞 08:50, 아버지 손에 두 폰 | S14 A | 자동문 반사 | P1 |
| ART.scene.interrogation_glass | 진술실 유리창 너머 도현의 실루엣(얼굴 보이지 않음 → B+에서 고개를 듦: 실루엣의 각도만 변함) | S14 B | 없음 | P1 |
| ART.scene.dohyun_room_newphone | 도현의 방, 책상 위 새 폰 화면만 밝음 | S14 D | 화면 빛 | P1 |
| ART.scene.morning_empty | 다음 날 아침, 식탁 | S14 C | 없음 | P1 |

## 2. 사진 (ART.photo.*) — 폰 안의 사진

| ID | 내용 | 비고 | 우선 |
|---|---|---|---|
| ART.photo.family_2019 | 세 가족, 어머니 생존. **따뜻한 색은 여기만** | 배경화면 | P0 |
| ART.photo.father_son_2022 | 도현(중3)·아버지, 어색한 거리. 도현 얼굴 보임(사진 속에서만 허용) | S9 | P1 |
| ART.photo.debt_form | 채무조정 신청서, 비스듬히, 흐림 | S11 | P1 |
| ART.photo.graduation_gate | 교문 졸업식 현수막, 사람 없음 | | P2 |
| ART.photo.receipt_saebom | 영수증을 폰으로 찍은 사진 | S8 이후 | P1 |
| ART.photo.dunning_mail | 독촉 우편 | 옛 폰 | P1 |
| ART.photo.balance_notice ×3 | 잔여원금 안내 우편 | 옛 폰 | P1 |
| ART.photo.deposit_capture | 입금 완료 화면 캡처 템플릿(금액만 바꿔 19장 생성 — UI 렌더로 대체 가능) | 옛 폰 | P1 |
| ART.photo.admission_capture | 합격 조회 화면(대학명 블러) | 옛 폰 | P2 |
| ART.photo.sleeping_father | 잠든 아버지 뒷모습, 소파, TV 불빛 | 엔딩 A 배경화면 원본 | P1 |
| ART.photo.sleeping_father_moire | 위 사진을 다른 폰 화면 너머로 찍은 버전(모아레, 약간 기울어짐) | FX-07 | P1 |
| 질감용 사진 | 배차 차량, 마트 영수증 | | P2 |

## 3. 아이템 확대 (ART.item.*)

| ID | 내용 | 우선 |
|---|---|---|
| ART.item.receipt | 구겨진 약봉투 조각 + 영수증(품목 찢김) | P1 |
| ART.item.envelope | 서류 봉투, 발신인 없음 | P1 |
| ART.item.postit | "버리라고 했는데 못 버렸어요" — 유진 필체 | P1 |
| ART.item.yujin_note | 연락처 쪽지 — 같은 필체 | P1 |
| ART.item.old_phone_off | 꺼진 옛 폰, 배터리 0% | P1 |
| ART.item.cctv_still_1~3 | 19:05 / 19:06 / 19:07 저화질 정지 화면 | P1 |

## 4. 영상형 (ART.video.*)

| ID | 내용 | 사양 | 우선 |
|---|---|---|---|
| ART.video.cctv_full | 19:05:30~19:07:30 편의점 앞 CCTV(흑백 저화질, 2분). 19:06:05~19:06:20 15초 구간: 어깨 잡음, 귓속말, 움찔, 고개 숙임 | 프레임 시퀀스 또는 MP4(H.264, 무음). 스크러버로 탐색 | P1 |
| ART.video.intercom_minjae | 인터폰 영상(흔들리는 프레이밍, 땀). 얼굴은 화질로 뭉갬 | 10~15초 루프 | P1 |

## 5. UI 그래픽

| ID | 내용 | 우선 |
|---|---|---|
| ART.ui.icons_father | 기본 아이콘 세트(큰 사이즈, 평범한 OS 기본 느낌, 특정 실제 OS 모방 금지) | P0 |
| ART.ui.icons_old | 옛 폰 아이콘(다크, 미니멀) | P1 |
| ART.ui.map_dark | 네비 어두운 지도 타일(가공 도로망) | P1 |
| ART.ui.title | 타이틀 "DONTKNOW" 로고타입 | P1 |
| ART.ui.app_icon | PWA 아이콘(홈 화면) | P1 |
