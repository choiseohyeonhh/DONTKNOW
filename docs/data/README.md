# 데이터 설계 개요

> CLAUDE.md "다음 작업 후보 2: 세션/KNOW/플래그/리액티브 알림을 JSON으로 분리(bible 5장, 7장, 10장 기준)"의 설계.
> 원칙: **코드에 대사·숫자·조건을 하드코딩하지 않는다.** 엔진은 데이터를 실행할 뿐이다.

## 1. 파일 레이아웃 (구현 시 `content/` 루트)

```
content/
  manifest.json                 ← 전체 파일 목록, schemaVersion, canon
  registry/
    know.json                   ← K, KX 정의 (schema-registry.md)
    flags.json                  ← F, FX 정의
    vars.json                   ← v.* 정의(타입·기본값)
    characters.json             ← 인물 키, 표시명, 음성 유무
  sessions/
    S01.json … S14.json         ← 세션 정의 (schema-session.md)
  dialogue/
    S01/ … S14/                 ← 대화 트리 (schema-dialogue.md)
      S02.jihoon.sms.json
      S02.jihoon.call.json
    hub/
      jihoon.json detective.json yujin.json junho.json misc.json
  events/
    fixed.json                  ← EV.*
    reactive.json               ← RE.*
    nudges.json                 ← NG.*
    monologues.json             ← MO.*
  phone/
    father/
      contacts.json calllog.json threads.json talk.json
      photos.json bank.json memo.json settings.json
    old/
      threads.json memo.json voice.json photos.json
  world/
    places.json                 ← PL.*, 이동 시간 행렬
    items.json                  ← IT.*
  endings/
    resolver.json               ← 판정표(우선순위 규칙)
    sequences/A.json B.json C.json D.json
  assets/
    art.json audio.json         ← 에셋 ID → 파일 경로
```

## 2. 공통 규약

- 모든 파일 최상위: `{"schemaVersion": 1, "canon": "5.3", ...}`.
- 모든 엔티티는 `id` 필드 필수. ID 규칙은 `overview/id-conventions.md`.
- 텍스트는 UTF-8, 줄바꿈은 `\n`. 한 버블/한 줄 = 한 문자열.
- 시각: 게임 시계는 `"HH:MM"` 문자열(+ `day` 필드), 과거 타임스탬프는 ISO `"2026-03-14T18:39"`(초 없음, 타임존 없음 — 게임 내 로컬 시각).
- 금액: 정수(원). 표시 포맷은 UI가 담당.
- 조건식: 문자열, `data/conditions.md` 문법.
- 효과: 배열, `data/conditions.md` 4장.

## 3. 검증 스크립트 `tools/validate-content` (설계)

| 검사 | 실패 시 |
|---|---|
| JSON 스키마 일치 | 에러 |
| 모든 참조 ID 존재(대화의 next, 조건의 K/F, 이벤트의 대상) | 에러 |
| 조건식 파싱 | 에러 |
| K 도달 가능성: 선택지 조건의 K가 그보다 앞선 세션에서 획득 가능한가 | 경고 |
| `[CANON]` 태그 대사가 bible 원문과 일치하는가(공백 정규화 후) | 경고 |
| 금칙어(약품명 목록, "한재석") 포함 | 에러 |
| 아버지 선택지 20자 초과(S13 ① 제외) | 경고 |
| 상환 원장 합계(`content/repayment-ledger.md` 값과 bank/threads/memo 일치) | 에러 |
| 부재중 47, 미읽 23 합계 | 에러 |
| 날짜의 요일 표기 일치 | 에러 |

## 4. 데이터 입력 순서 (권장)

1. registry(K/F/v) — 모든 참조의 뿌리
2. world(places, items)
3. phone/father 초기 데이터 — `content/father-phone-data.md` 옮기기
4. sessions S01~S02 + dialogue S01~S02 — 수직 슬라이스
5. events(S1~S2분)
6. 이후 세션 단위로 반복

## 5. 대사 원고와의 관계

- `docs/script/Sxx.md`(예정) = 사람이 읽고 고치는 원고.
- `content/dialogue/` = 엔진이 읽는 데이터.
- 단일 소스는 **데이터 JSON**으로 정한다. 원고는 데이터에서 자동 생성(`tools/export-script`)하거나, 원고를 먼저 쓰고 한 번 옮긴 뒤엔 데이터를 고친다. 둘을 따로 고치지 않는다.
- 원고 작성 단계(대사가 자주 바뀌는 시기)에는 원고 → 데이터 변환기를 만드는 대신 손으로 옮긴다. 세션 14개 × 평균 노드 60개 수준이라 변환기 비용이 더 크다.
