# 스키마 — 세이브

> 저장 방침은 `systems/save-and-replay.md`, 상태 정의는 `systems/game-state.md`.

## 1. 스냅샷 `localStorage["dontknow.save.v1"]`

```json
{
  "meta": { "schemaVersion": 1, "canon": "5.3", "savedAt": 1767225600000, "playthrough": 1, "contentHash": "a1b2c3" },
  "clock": { "day": 18, "min": 610 },
  "location": "PL.police",
  "device": "father",
  "session": { "current": "S05", "status": { "S01": "done", "S02": "done", "S03": "done", "S04": "done", "S05": "active" } },
  "know": ["K-01", "K-02", "K-03", "K-06", "K-07", "K-08", "KX-01", "KX-03"],
  "flags": ["FX-01"],
  "vars": { "v.s2_mode": "call", "v.s4_trust_count": 1 },
  "branch": {},
  "ending": null,
  "phone": {
    "contactsAdded": ["CT.yujin", "CT.seoyeon"],
    "knownNumbers": [],
    "callLogAppended": [ { "id": "CL.R001", "dir": "out", "to": "CT.jihoon", "at": "18T02:52", "dur": 412 } ],
    "callSeen": ["010-XXXX-1188"],
    "threadState": { "TH.f.jihoon": { "unread": 0, "everOpened": true, "appended": ["S02-001", "S02-002"] } },
    "autoCloseUsed": [],
    "nav": ["PL.home", "PL.police", "PL.school"],
    "wallpaper": "PH.f.family_2019",
    "photosAdded": []
  },
  "oldPhone": { "obtained": false },
  "queue": [ { "id": "RE.01", "fireAtReal": 22000 } ],
  "idle": { "elapsedMs": 12000, "fired": [] },
  "dialogue": { "tree": "DLG.S05.detective", "resumeNode": "c02" },
  "seen": ["IT.cctv_stills"]
}
```

## 2. 규칙

- 초기 데이터(47건, 23건 등)는 세이브에 넣지 않는다. **차분만** 저장(`appended`, `seen`, `unread` 변화).
- `queue`의 실시간 지연은 "남은 ms"로 저장(절대 시각 아님 — 앱 재개 시 그만큼 남음).
- `contentHash`: 콘텐츠 빌드 해시. 불일치 시 노드 폴백 검사.

## 3. 체크포인트 `localStorage["dontknow.cp.Sxx"]`

- 세션 진입 직전 스냅샷. 같은 형식. 세션 선택(클리어 후)에서 사용.

## 4. 메타 `localStorage["dontknow.meta"]`

```json
{ "endingsSeen": ["END-D"], "playthroughs": 1, "firstCompletedAt": 1767230000000,
  "settings": { "textScale": 1.0, "volume": { "master": 0.8, "voice": 1.0, "sfx": 0.8 }, "hapticSound": true, "realVibration": true } }
```

## 5. 액션 로그 `IndexedDB: dontknow.log`

```json
{ "t": 183220, "type": "CHOOSE", "payload": { "tree": "DLG.S04.yujin", "option": "CH.S04.02" } }
```

- 액션 타입 목록: `OPEN_APP, CLOSE_APP, OPEN_THREAD, SCROLL, SEND_CHOICE, CHOOSE, CALL, HANGUP, NAV_START, ARRIVE, TICK_IDLE, FIRE_EVENT, PIN_INPUT, PLAY_VOICE, SEEK_VOICE, SWITCH_DEVICE, CAMERA_SHOT, SET_WALLPAPER, CONFIRM, SHOW_ITEM, SAVE, LOAD`.
- 플레이테스트 빌드에서 "로그 내보내기" → JSON 파일 다운로드(텔레메트리 수집).
