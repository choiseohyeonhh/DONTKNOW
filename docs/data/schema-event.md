# 스키마 — 이벤트(고정·리액티브·넛지·독백)

## 1. `events/fixed.json`, `events/reactive.json`

```json
{
  "schemaVersion": 1,
  "events": [
    {
      "id": "RE.01",
      "kind": "acquire",
      "trigger": { "know": "K-10" },
      "cond": "!done(S12)",
      "delay": { "realMs": 30000, "gameMin": 0 },
      "priority": 5,
      "once": true,
      "deliverDuring": { "face": "queueSilently", "call": "afterCall", "travel": "allow" },
      "actions": [ { "message": "TH.f.yujin/RE01" } ],
      "cancelIf": "done(S12)"
    },
    {
      "id": "EV.S08.01",
      "kind": "fixed",
      "trigger": { "arrive": "PL.home", "time": "16:10" },
      "cond": "done(S07) && !done(S08)",
      "delay": { "realMs": 0 },
      "timeRule": "jumpIfEarly",
      "priority": 10,
      "actions": [ { "session": "S08", "status": "active" }, { "sfx": "AU.sfx.doorbell_spam" }, { "dialogue": "DLG.S08.minjae" } ]
    }
  ]
}
```

| 필드 | 설명 |
|---|---|
| `kind` | `fixed` / `acquire` / `arrive` / `sessionEnd` / `nodeShown` |
| `trigger` | `{know}`, `{flag}`, `{arrive, time?}`, `{sessionEnd}`, `{node}`, `{seen}` 중 하나 |
| `cond` | 발화 시점 재평가 조건 |
| `delay.realMs` | 실시간 지연 |
| `delay.gameMin` | 발화 시 게임 시계 가산 |
| `timeRule` | 고정 이벤트: `jumpIfEarly`(도착이 이르면 시계 점프) / `atArrival` |
| `deliverDuring` | 대면·통화·이동 중 전달 방식 |
| `priority` | 동시 발화 정렬(높을수록 먼저) |
| `once` | 기본 true |
| `cancelIf` | 대기 중 이 조건이 참이 되면 큐에서 제거 |

## 2. `events/nudges.json`

```json
{
  "sets": [
    {
      "id": "NG.S06.scrub",
      "stages": [
        { "at": 90,  "actions": [ { "dialogue": "DLG.S06.owner.nudge90" } ] },
        { "at": 180, "actions": [ { "dialogue": "DLG.S06.owner.nudge180" } ] },
        { "at": 300, "actions": [ { "monologue": "MO.18" } ] },
        { "at": 450, "actions": [ { "ui": "cctv.seekTo", "value": "19:06:00" } ], "repeat": { "everyMs": 180000, "max": 2 } }
      ],
      "fallbackIf": { "cond": "F-04", "replace": { "90": [ { "monologue": "MO.18" } ] } }
    }
  ]
}
```

- `at`은 초. `opt.nudge_scale` 곱해서 적용.
- `fallbackIf`: 조건부 단계 교체(F-04 이후 지훈 대체 등).

## 3. `events/monologues.json`

```json
{
  "monologues": [
    { "id": "MO.01", "text": "…나중에.", "canon": true, "durationMs": 2500 },
    { "id": "MO.07", "text": "…내 생일은 기억할까.", "canon": true, "durationMs": 3000 }
  ],
  "forbiddenWhen": "active(S11) || active(S13) || active(S14)"
}
```

- `forbiddenWhen`: 독백 금지 구간. 해당 구간에 독백 효과가 실행되면 무시 + 개발 빌드 경고. 예외 플래그 `"overrideForbidden": true`는 쓰지 않는다(금지 구간에 독백이 필요하면 설계를 다시 본다).
- S8 민재 퇴장 직후 5초 금지는 대화 트리 쪽에서 `pause` 노드로 처리(이 구간은 S8 active 중이라 전역 금지 대상이 아님).
