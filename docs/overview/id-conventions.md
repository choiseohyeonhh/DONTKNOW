# ID 규칙

> 모든 데이터·문서·대사 파일은 이 규칙의 ID로 서로를 참조한다. bible에 있는 ID(S, K, F, 분기 코드)는 **그대로** 쓰고, 구현을 위해 새로 필요한 ID는 접두사로 구분한다.

## 1. bible 정의 ID (변경 금지)

| 종류 | 형식 | 예 | 출처 |
|---|---|---|---|
| 세션 | `S1`~`S14` (데이터에서는 `S01`~`S14` 2자리) | `S09` | 7장 |
| KNOW | `K-01`~`K-22` | `K-19` | 5.2 |
| 플래그 | `F-01`~`F-06`, `F-02b` | `F-03` | 5.3 |
| 분기 코드 | `A-1~3`(유진), `B-1~3`(준호), `D-1~3`(형) | `A-3` | 7장 S12·S13 |
| 엔딩 | `END-A`, `END-B`, `END-B+`, `END-C`, `END-D` | | 8장 |

## 2. 구현용 신규 ID (bible 미등록)

> `X`가 붙은 것은 **bible 미등록**이라는 뜻이다. v5.3에서 정식 등록할지 서현이 결정한다.

| 종류 | 형식 | 예 | 정의 문서 |
|---|---|---|---|
| 보조 KNOW | `KX-nn` 또는 `KX-nna` | `KX-03` 준호 번호 | `systems/know.md` |
| 보조 플래그 | `FX-nn` | `FX-07 WALLPAPER_SET` | `systems/flags.md` |
| 상태 변수(카운터 등) | `v.<snake_case>` | `v.s4_trust_count` | `systems/game-state.md` |
| 세션 내 비트 | `Sxx.bNN` | `S09.b02` | 각 세션 문서 |
| 대화 트리 | `DLG.<세션>.<인물>[.<변형>]` | `DLG.S07.junho.call` | `data/schema-dialogue.md` |
| 대화 노드 | `<트리ID>#<노드>` | `DLG.S02.jihoon#n06` | 〃 |
| 선택지 | `CH.<세션>.<번호>` | `CH.S13.04` | 〃 |
| 허브 대화(세션 밖 연락) | `HUB.<인물>.<단계>` | `HUB.detective.P3` | `systems/progression.md` |
| 고정 이벤트 | `EV.<세션>.<번호>` | `EV.S08.01` 민재 도착 | `systems/reactive-events.md` |
| 리액티브 알림 | `RE.<번호>` | `RE.07` K-10 → 유진 문자 | 〃 |
| 유휴 넛지 | `NG.<세션>.<단계>` | `NG.S06.180` | `systems/idle-nudge.md` |
| 아버지 독백 | `MO.<번호>` | `MO.03` "…나중에." | `systems/avoidance-and-monologue.md` |
| 연락처 | `CT.<slug>` | `CT.jihoon`, `CT.hangyeol_call` | `content/father-phone-data.md` |
| 메시지 스레드 | `TH.<기기>.<slug>` | `TH.f.hangyeol_sms`, `TH.o.hyung` | 〃 / `content/old-phone-data.md` |
| 메시지 1건 | `<스레드ID>/<번호>` | `TH.o.hyung/031` | 〃 |
| 통화 기록 1건 | `CL.<번호>` | `CL.047` | `content/father-phone-data.md` |
| 사진 | `PH.<기기>.<slug>` | `PH.o.sleeping_father` | 〃 |
| 메모 | `MM.<기기>.<slug>` | `MM.o.remaining` | 〃 |
| 음성메모 | `VM.<slug>` | `VM.to_dad` | `content/old-phone-data.md` |
| 장소 | `PL.<slug>` | `PL.saebom_pharmacy` | `content/locations.md` |
| 단서 아이템 | `IT.<slug>` | `IT.receipt` | `content/clues.md` |
| 아트 에셋 | `ART.<분류>.<slug>` | `ART.scene.parking_b3` | `content/art-assets.md` |
| 오디오 에셋 | `AU.<분류>.<slug>` | `AU.voice.dohyun_memo` | `content/audio-assets.md` |
| 이슈 | `ISSUE-nn` | | `review/canon-issues.md` |
| 테스트 시나리오 | `TS-nn` | | `qa/test-scenarios.md` |

## 3. 슬러그 규칙

- 소문자 영문, 숫자, `_`만. 한글 슬러그 금지(파일명·URL 안전).
- 인물 슬러그 고정: `father`, `dohyun`, `hyung`, `yujin`, `junho`, `minjae`, `pharmacist`, `detective`, `jihoon`, `teacher_kim`, `seoyeon`, `counselor_yoon`, `owner_jang`, `junho_mom`, `dispatch`, `guard`(경비실), `hangyeol`.
- 기기 접두: `f` = 아버지 폰, `o` = 옛 폰.

## 4. 파일 경로 규칙 (데이터)

`data/README.md` 참고. 요약:

```
content/                 ← (구현 시) 게임 데이터 루트
  registry/know.json, flags.json
  sessions/S01.json …
  dialogue/S01/*.json …
  events/reactive.json, nudges.json, fixed.json
  phone/father/*.json, phone/old/*.json
  places.json, items.json
```

## 5. 버전 표기

- bible: `v5.2` → 결정 반영 시 `v5.3`.
- 데이터 파일: 각 JSON 최상위 `"schemaVersion"`(정수)와 `"canon": "5.2"` 필드. 캐논 버전이 바뀌면 데이터 검증 스크립트가 불일치 파일을 경고한다.
