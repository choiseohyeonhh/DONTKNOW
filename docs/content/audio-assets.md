# 오디오 에셋 목록

> 근거: bible 12.4. 규칙은 `systems/audio-and-haptics.md`. 포맷 AAC(m4a), 48kHz, 음성 모노 96kbps / 환경음 스테레오 128kbps.
> 우선순위 P0 = 수직 슬라이스, P1 = 출시 필수, P2 = 품질 향상.

## 1. 음성 (실제 녹음 — 3인만)

| ID | 화자 | 내용 | 길이 | 처리 | 우선 |
|---|---|---|---|---|---|
| AU.voice.dohyun_memo | 도현 | 음성메모 "아빠한테" 전문(`old-phone-data.md` 3.1) | 1:47 | 폰 마이크 질감, 6초 정적 포함 | P1 |
| AU.voice.dohyun_end_a | 도현 | 엔딩 A 통화 4줄 | ~0:30 | 전화 대역 | P1 |
| AU.voice.dohyun_end_b | 도현 | "…아빠는 몰라도 됐는데." | ~0:04 | 유리 너머(먹먹) | P1 |
| AU.voice.dohyun_end_d | 도현 | "다녀왔습니다." | ~0:02 | 현관 잔향 | P1 |
| AU.voice.hyung_s13_* | 형 | S13 전 대사(노드 단위 파일) | ~6:00 | 주차장 잔향 | P1 |
| AU.voice.hyung_call_s12 | 형 | 22:40 착신 대사 | ~0:20 | 전화 대역 | P1 |
| AU.voice.hyung_end_c | 형 | "봐요. 아버님은 아직도 몰라요." | ~0:04 | 스피커폰 | P1 |
| AU.voice.minjae_s08_intercom | 민재 | S8 전 대사(인터폰) | ~0:40 | 인터폰 협대역 | P1 |
| AU.voice.minjae_s08_door | 민재 | S8 전 대사(문 열기 버전) | ~0:40 | 근접, 계단 잔향 | P1 |

> 성우 디렉션: 도현 — 담담, 감정이 오르면 말을 끊는다. 형 — 정중, 웃음 섞임, 웃음을 멈추는 두 지점(K-22, ①). 민재 — 시제 혼용, 숨 가쁨.

## 2. 환경음 루프 (AU.amb.*)

| ID | 장소 | 구성 | 우선 |
|---|---|---|---|
| AU.amb.home_night | 집 새벽 | 거의 무음 + 냉장고 컴프레서 주기 + 먼 차 1회/40초 | P0 |
| AU.amb.home_day | 집 낮 | 냉장고, 먼 생활 소음 | P1 |
| AU.amb.school | 학교 | 형광등, 먼 웅성거림, 종소리(1회) | P1 |
| AU.amb.police | 경찰서 | 형광등 웅웅, 정수기 꿀렁, 먼 전화벨 | P1 |
| AU.amb.mart | 편의점 | 냉장 쇼케이스, 형광등, 자동문 | P1 |
| AU.amb.pharmacy | 약국 | 형광등, 비, 자동문 차임 | P1 |
| AU.amb.parking | 주차장 | 환기팬(주), 물방울, 먼 차 | P1 |
| AU.amb.dawn | 엔딩 A 새벽 | 무음에 가까움, 첫 새소리 | P1 |

## 3. 효과음 (AU.sfx.*)

| ID | 용도 | 우선 |
|---|---|---|
| AU.sfx.vibe_wood / vibe_metal / vibe_glass | 진동음(책상 재질별) | P0 |
| AU.sfx.ring_out | 발신 신호음 | P0 |
| AU.sfx.power_off_notice | "전원이 꺼져 있어…" 안내음(가공 음성 또는 신호음 + 자막) | P0 |
| AU.sfx.call_connect / call_end / call_drop | 통화 연결/종료/끊김 | P0 |
| AU.sfx.invalid_number | "없는 번호" 안내(엔딩 A 0091) | P1 |
| AU.sfx.blocked_prompt | 차단 시트 열림 | P2 |
| AU.sfx.keypad | 키패드 탭(옛 폰 PIN) | P1 |
| AU.sfx.unlock_heavy | PIN 해제 진동(HP.heavy) | P1 |
| AU.sfx.send | 문자 전송 | P0 |
| AU.sfx.doorbell_spam | 초인종 연타(S8) | P1 |
| AU.sfx.door_bang | 문 두드림(S8) | P1 |
| AU.sfx.neighbor_door | 이웃 문 열리는 소리(S8) | P1 |
| AU.sfx.shutter_pharmacy | 약국 셔터(S9) | P1 |
| AU.sfx.camera_shutter | 아버지 폰 카메라(S8 영수증, S11) | P1 |
| AU.sfx.turn_signal | 깜빡이(이동 화면) | P1 |
| AU.sfx.car_door | 형의 차 문(S13 ③) | P1 |
| AU.sfx.envelope | 봉투 열기 | P1 |
| AU.sfx.charger | 충전기 꽂는 소리 | P1 |
| AU.sfx.auto_door_police | 경찰서 자동문 — **크레딧 후 3초**(엔딩 A, 관대한 해석용, bible) | P1 |
| AU.sfx.drawer_close | 서랍 닫힘(엔딩 D) | P2 |
| AU.sfx.breath_junho_1~3 | 준호 통화 숨소리 | P1 |
| AU.sfx.phone_line_noise | 통화 잡음 루프(텍스트 인물 통화) | P1 |
| AU.sfx.clock_fast | 시간 점프 시 시계 넘어가는 미세음 | P2 |

## 4. 음악

- 없음이 기본(12.4). 타이틀·크레딧에 피아노 단음 몇 개(선택, P2). 엔딩별 차이 없음 — 엔딩 A만 특별 취급하지 않는다(8.3 B·D 동급 원칙).
