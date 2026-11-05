# 스키마 — 레지스트리 (KNOW·플래그·변수·인물)

## 1. `registry/know.json`

```json
{
  "schemaVersion": 1,
  "canon": "5.2",
  "know": [
    {
      "id": "K-19",
      "canonical": true,
      "summary": "도현은 아버지의 빚을 알았다",
      "source": { "session": "S10", "ref": "VM.to_dad", "on": "playComplete" },
      "alt": [],
      "unlocks": ["CH.S13.10", "END-B+"],
      "notes": "S13 고백 선택지의 전제"
    },
    {
      "id": "KX-21",
      "canonical": false,
      "summary": "유진도 나가고 싶어 했다",
      "source": { "session": "S11", "ref": "TH.o.yujin", "on": "open" },
      "alt": [],
      "unlocks": ["CH.S12.06"],
      "issue": "ISSUE-09"
    }
  ]
}
```

| 필드 | 필수 | 설명 |
|---|---|---|
| `id` | ○ | `K-nn` / `KX-nn[a]` |
| `canonical` | ○ | bible 등록 여부 |
| `summary` | ○ | 작가·QA용 한 줄. **플레이어에게 표시 안 함** |
| `source` | ○ | 정식 획득처. `on`: `nodeShown`, `open`, `playComplete`, `scrollTop`, `itemPickup`, `sessionEnd` |
| `alt` | | 대체 경로 배열(같은 구조) |
| `unlocks` | | 참조처(검증 스크립트가 역참조로 자동 생성 가능, 수기 작성은 선택) |
| `issue` | | 관련 이슈 |

> 획득 자체는 대화 노드/열람 이벤트의 `effects`에 `{"know": ...}`로 넣는다. `source`는 문서·검증용 메타데이터이며 엔진이 직접 실행하지 않는다(이중 정의 방지 — 검증 스크립트가 `source`와 실제 effects 위치가 일치하는지 검사).

## 2. `registry/flags.json`

```json
{
  "flags": [
    {
      "id": "F-03",
      "name": "TOLD_POLICE",
      "canonical": true,
      "setBy": ["DLG.hub.detective#confirm2", "DLG.S05.detective#confirm2"],
      "exclusiveWith": [],
      "lockAfter": "S13:departure",
      "affects": ["END-B", "B-3"]
    },
    {
      "id": "F-02",
      "name": "LIE_TO_JUNHO",
      "canonical": true,
      "setBy": ["DLG.S07.junho.sms#sendA"],
      "exclusiveWith": ["F-02b"],
      "lockAfter": null,
      "affects": ["B-2", "B-3"]
    }
  ]
}
```

## 3. `registry/vars.json`

```json
{
  "vars": [
    { "id": "v.s4_trust_count", "type": "int", "default": 0, "telemetry": false },
    { "id": "v.s9_path", "type": "enum", "values": ["photo", "pressure"], "default": null },
    { "id": "v.s13_choice", "type": "int", "default": null }
  ]
}
```

## 4. `registry/characters.json`

```json
{
  "characters": [
    { "id": "father",  "display": "나",        "voice": false },
    { "id": "dohyun",  "display": "도현",      "voice": true,  "voiceScope": ["S10", "S14"] },
    { "id": "hyung",   "display": "형",        "voice": true,  "voiceScope": ["S13", "END-C"], "nameHidden": true },
    { "id": "minjae",  "display": "남자",      "voice": true,  "voiceScope": ["S08"] },
    { "id": "yujin",   "display": "차유진",    "voice": false },
    { "id": "junho",   "display": "준호",      "voice": false },
    { "id": "jihoon",  "display": "정지훈",    "voice": false },
    { "id": "detective", "display": "김태윤 경위", "voice": false },
    { "id": "pharmacist", "display": "약사",   "voice": false },
    { "id": "teacher_kim", "display": "김 선생님", "voice": false },
    { "id": "counselor_yoon", "display": "윤 선생님", "voice": false },
    { "id": "seoyeon", "display": "한서연",    "voice": false },
    { "id": "owner_jang", "display": "사장",   "voice": false }
  ]
}
```

- `display`: 대면 대사창 화자명. 민재는 이름을 대지 않으므로 "남자"(인터폰). K-15 이후 재등장 없음.
- `nameHidden`: 데이터 어디에서도 실명 문자열이 나오면 검증 에러.
