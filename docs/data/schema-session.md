# 스키마 — 세션

> 세션 = 진행 단위. 진입·종료 조건, 시각 창, 장소, 비트 목록, 넛지 목표를 정의한다. 대사는 대화 파일에 둔다.

## 1. `sessions/Sxx.json`

```json
{
  "schemaVersion": 1,
  "canon": "5.2",
  "id": "S06",
  "title": "편의점",
  "act": "2-1",
  "targetMinutes": 10,
  "place": "PL.mart",
  "window": { "start": "13:00", "end": "13:40", "fixed": false },
  "enter": {
    "cond": "done(S05) && at(PL.mart)",
    "via": "arrive",
    "effects": [ { "ambience": "AU.amb.fluorescent" }, { "dialogue": "DLG.S06.owner" } ]
  },
  "beats": [
    { "id": "S06.b01", "label": "귀찮아하는 사장",   "doneWhen": "seen(DLG.S06.owner#n03)" },
    { "id": "S06.b02", "label": "제 아들입니다",     "doneWhen": "seen(DLG.S06.owner#son)" },
    { "id": "S06.b03", "label": "CCTV 스크럽",       "doneWhen": "seen(IT.cctv_full)" },
    { "id": "S06.b04", "label": "사장 증언",         "doneWhen": "K-12" }
  ],
  "exit": {
    "cond": "K-12 && seen(DLG.S06.owner#end)",
    "effects": [
      { "session": "S06", "status": "done" },
      { "monologue": "MO.04" },
      { "session": "S07", "status": "available" }
    ]
  },
  "nudgeGoals": [
    { "goal": "travel", "activeWhen": "!at(PL.mart)", "nudges": "NG.S06.travel" },
    { "goal": "scrub",  "activeWhen": "at(PL.mart) && !seen(IT.cctv_full)", "nudges": "NG.S06.scrub" }
  ],
  "locks": { "nav": false, "calls": false },
  "telemetry": { "trackDwell": true }
}
```

## 2. 필드

| 필드 | 설명 |
|---|---|
| `act` | 막 구조(7장): `1`, `2-1`, `mid`, `2-2`, `3` |
| `targetMinutes` | 7장 세션 시간. 플레이테스트 기준(150% 룰) |
| `window` | 게임 시계 창. `fixed: true`면 고정 이벤트 시각 |
| `enter.via` | `auto`(이전 세션 종료 시 즉시), `arrive`(장소 도착), `call`(발신/착신), `event` |
| `beats` | 세션 내부 진행 단계. `doneWhen` 조건이 참이 되면 완료 → 유휴 타이머 리셋 |
| `exit` | 종료 조건과 효과 |
| `nudgeGoals` | 현재 목표 판정. 첫 번째로 `activeWhen`이 참인 목표의 넛지 세트 사용 |
| `locks` | 세션 중 잠기는 기능(S13: nav·calls·messages 전부) |
| `variants` | 선택. 조건부 변형(예: S9 `lateArrival`) |

## 3. 세션 상태 머신

```
locked ──(이전 세션 exit 효과)──▶ available ──(enter.cond 참)──▶ active ──(exit.cond 참)──▶ done
```

- 동시에 `active`인 세션은 최대 1개.
- `available` 상태에서 `enter.cond`가 참이 되는 순간(도착·발신 등) 진입.
- 허브 대화는 세션 상태와 무관(별도 `HUB` 데이터).
