# 스키마 — 대화 트리

> 엔진 규칙은 `systems/dialogue.md`. 이 문서는 파일 형식.

## 1. 파일 `dialogue/Sxx/<tree>.json`

```json
{
  "schemaVersion": 1,
  "canon": "5.3",
  "id": "DLG.S07.junho.call",
  "channel": "call",
  "participants": ["father", "junho"],
  "start": "n01",
  "onHangup": "hangup",
  "nodes": {
    "n01": { "type": "line", "speaker": "junho", "text": "…여보세요.", "delayMs": 1800, "next": "n02" },
    "n02": { "type": "line", "speaker": "junho", "text": "저 아무것도 몰라요.", "tags": ["LIE"], "next": "c01" },
    "c01": {
      "type": "choice",
      "options": [
        { "id": "CH.S07.01", "text": "괜찮아. 말해 봐. 안 혼낸다.", "cond": "true", "next": "n03" },
        { "id": "CH.S07.02", "text": "유진이라는 애가 네 얘기를 하던데.", "cond": "K-08", "next": "yujin", "priority": 2 },
        { "id": "CH.S07.03", "text": "…", "cond": "true", "next": "n03" }
      ]
    },
    "yujin": {
      "type": "line", "speaker": "junho",
      "text": "유진 누나 말 믿지 마세요. 그 누나 무서운 사람이에요.",
      "tags": ["TRUE", "CANON"],
      "effects": [ { "know": "K-14" } ],
      "next": "slip"
    },
    "slip": {
      "type": "line", "speaker": "junho", "text": "저 중3 때부터… 아, 아니에요.",
      "tags": ["TRUE", "CANON"],
      "effects": [ { "know": "KX-07" }, { "monologue": "MO.05" } ],
      "next": "door"
    },
    "door": { "type": "line", "speaker": "junho", "text": "15일 새벽에 누가 저희 집 문을 막 두드렸어요.", "effects": [ { "know": "K-13" } ], "next": "door2" },
    "door2": { "type": "line", "speaker": "junho", "text": "입 다물고 있으라고요. 엄마 깼으면 진짜…", "next": "cut" },
    "cut": { "type": "end", "endReason": "interrupted", "effects": [ { "sfx": "AU.sfx.call_drop" } ] },
    "hangup": { "type": "end", "endReason": "hangup" }
  }
}
```

## 2. 노드 타입별 필드

| type | 필드 |
|---|---|
| `line` | `speaker`, `text`, `delayMs?`, `audio?`, `tags?`, `effects?`, `next` |
| `father` | `text`, `effects?`, `next` (아버지 확정 대사) |
| `choice` | `options[]`: `{id, text, cond, effects?, next, priority?, repeatable?}`, `timeoutMs` 금지 |
| `effect` | `effects`, `next` |
| `branch` | `cases[]`: `{cond, next}`, `else` |
| `pause` | `ms`, `next` |
| `monologue` | `ref`(MO id), `next` |
| `confirm` | `title?`, `body`, `ok: {text, next, effects}`, `cancel: {text, next}`, `lockMs` |
| `end` | `endReason`, `effects?` |
| `show` | `ref`(IT/PH id) — 대면 중 아이템 제시 화면, `next` |
| `requestItem` | 플레이어가 폰에서 무언가를 꺼내 보이길 기다림. `accept: [{ref, next}]`, `cancel` (S9 사진 제시) |

## 3. 채널별 추가 규칙

| channel | 규칙 |
|---|---|
| `sms`/`talk` | `line.delayMs`는 "입력 중…" 표시 시간. 아버지 선택지는 전송 버블로 렌더. 대화가 끝나면 스레드에 영구 기록(`threads` 상태에 메시지 append) |
| `call` | `audio`가 있으면 재생 끝까지 다음 노드 대기. 통화 시간 = 노드 진행 실시간 합 |
| `face` | `speaker` 표시명은 `characters.json`. 일러스트 전환은 노드 `effects`의 `{"scene": "ART.scene.x"}` |

## 4. 허브 대화 `dialogue/hub/<npc>.json`

```json
{
  "id": "HUB.detective",
  "channel": "call",
  "entries": [
    { "phase": "~S4",   "tree": "DLG.hub.detective.busy" },
    { "phase": "S5~S12", "tree": "DLG.hub.detective.main" },
    { "phase": "S13~",  "tree": null, "behavior": "locked" }
  ]
}
```

- `phase` 표기: `~S4`(S4 done 전), `S5~S12`(S5 done 후 ~ S12 done 전), `S13~`.
- `tree: null` + `behavior`: `noAnswer`(신호 가다 끊김), `powerOff`(전원 꺼짐 안내), `invalid`(없는 번호), `blocked`(차단 확인 시트), `locked`(발신 불가).

## 5. 텍스트 작성 규칙(데이터 레벨)

- `text`에 마크업 금지. 강조가 필요하면 연출로.
- `…`(U+2026) 사용, `...` 금지. 단 옛 폰 초안 "아빠, 나 사실..."은 **원문 그대로 마침표 3개**(도현의 폰 자판 입력이므로) — `[CANON]`.
- 버블 하나 = 한 문자열. 지훈·준호의 연발 문자는 노드를 나눈다.
