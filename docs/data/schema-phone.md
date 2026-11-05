# 스키마 — 폰 콘텐츠

> 실제 값은 `content/father-phone-data.md`, `content/old-phone-data.md`. 이 문서는 형식.

## 1. 연락처 `phone/father/contacts.json`

```json
{
  "contacts": [
    { "id": "CT.dohyun", "name": "도현", "number": "010-XXXX-0921", "initial": true, "behavior": "powerOff" },
    { "id": "CT.hangyeol_call", "name": "한결캐피탈", "number": "070-XXXX-3301", "initial": true, "blocked": true, "behavior": "blocked" },
    { "id": "CT.yujin", "name": "차유진", "number": "010-XXXX-4417", "initial": false, "addedBy": "K-08", "hub": "HUB.yujin" }
  ],
  "knownNumbers": [
    { "id": "NUM.0091", "number": "010-5XXX-0091", "addedBy": "K-09", "label": null, "hub": "HUB.hyung0091" }
  ]
}
```

- `behavior`: 허브 없을 때 발신 반응. `hub`가 있으면 허브 우선.
- `knownNumbers`: 이름 없이 아는 번호 [ISSUE-25]. 연락처 목록에는 "기타 번호" 섹션에 번호만.

## 2. 통화 기록 `calllog.json`

```json
{
  "entries": [
    { "id": "CL.001", "dir": "in", "missed": true, "from": "010-XXXX-3372", "contact": null, "at": "2025-11-06T10:14", "truth": "loan_spam" },
    { "id": "CL.045", "dir": "in", "missed": true, "from": "010-5XXX-0091", "contact": null, "at": "2026-03-15T02:13", "truth": "hyung", "replayHighlight": true },
    { "id": "CL.O01", "dir": "out", "missed": false, "to": "CT.dohyun", "at": "2026-03-14T23:40", "result": "powerOff" }
  ]
}
```

- `truth`: 작가·QA용 실체 태그(화면 비표시) [ISSUE-13].
- `replayHighlight`: 2회차 하이라이트 대상.
- 게임 중 발생하는 통화는 런타임에 append(`id` = `CL.R###`).

## 3. 메시지 스레드 `threads.json` (아버지), `phone/old/threads.json`

```json
{
  "threads": [
    {
      "id": "TH.f.hangyeol_sms",
      "title": "1600-XXXX",
      "contact": null,
      "replyable": true,
      "autoCloseOnFirstOpen": { "until": "done(S09)", "monologue": "MO.01" },
      "messages": [
        { "id": "001", "dir": "in", "at": "2024-08-25T09:40", "text": "[한결캐피탈] 8월 상환금 1,000,000원 입금 확인되었습니다. (입금자: 이도*)", "read": true },
        { "id": "034", "dir": "in", "at": "2026-02-25T09:52", "text": "[한결캐피탈] 2월 상환금 2,500,000원 입금 확인되었습니다. (입금자: 이도*)", "read": false }
      ]
    },
    {
      "id": "TH.o.hyung",
      "title": "형",
      "device": "old",
      "requiredInS11": true,
      "knowOnOpen": ["K-21", "K-22"],
      "knowOnScrollTop": ["KX-20"],
      "messages": [ { "id": "001", "dir": "in", "at": "2024-05-11T21:14", "text": "준호 일은 내가 정리할게. 대신 너 머리 좀 빌리자." } ]
    }
  ]
}
```

| 필드 | 설명 |
|---|---|
| `read` | 초기 읽음 상태(아버지 폰). `모두 읽음`[ISSUE-03]으로 읽음 처리된 것은 `read: true` + `readBy: "markAll"` |
| `autoCloseOnFirstOpen` | AV-01 |
| `knowOnOpen` / `knowOnScrollTop` | 열람 시 K 획득 |
| `draft` | 옛 폰 초안 메시지 `{"text": "아빠, 나 사실...", "savedAt": "2026-03-13T23:58", "to": "아빠"}` |
| `replyable` | 답장 가능 여부(엔딩 A 한결 답장) |

## 4. 톡 `talk.json`

스레드와 동일 + `profile`:

```json
{ "me": { "name": "이상철", "birthday": "04-03", "status": "", "photo": "PH.f.profile_default" } }
```

## 5. 사진 `photos.json`

```json
{ "photos": [
  { "id": "PH.f.family_2019", "takenAt": "2019-05-05", "art": "ART.photo.family_2019", "album": "카메라", "wallpaper": true },
  { "id": "PH.f.debt_adjustment", "takenAt": "2024-02-14", "art": "ART.photo.debt_form", "requiredInS11": true, "know": ["KX-14"] }
] }
```

- 사진에는 `actions` 가능: `["show"]`(대면 중 보여주기), `["setWallpaper"]`(카메라 촬영 사진만).

## 6. 은행 `bank.json`

```json
{
  "account": { "bank": "성원은행", "number": "XXX-XX-XXXX12", "balance": 412730 },
  "transactions": [
    { "at": "2026-03-05T06:00", "type": "out", "label": "자동이체 한결캐피탈", "amount": 800000, "status": "ok" },
    { "at": "2026-01-05T06:00", "type": "out", "label": "자동이체 한결캐피탈", "amount": 800000, "status": "failed", "reason": "잔액부족" }
  ],
  "loanInquiry": { "available": false, "message": "조회 권한이 없습니다(채권 이전 계좌)" }
}
```

## 7. 메모 `memo.json`, 음성메모 `voice.json`

```json
{ "memos": [
  { "id": "MM.o.remaining", "title": "남은 거", "updatedAt": "2026-02-25T23:11", "lines": ["2024.08  74,200,000", "…"], "know": [], "requiredInS11": true }
] }
```

```json
{ "voice": [
  { "id": "VM.to_dad", "title": "아빠한테", "recordedAt": "2026-03-12T01:20", "duration": 107, "audio": "AU.voice.dohyun_memo", "transcript": "…", "seekForward": false, "knowOnComplete": ["K-19"] }
] }
```

- 음성메모 자막(`transcript`)은 재생 중 화면 하단에 줄 단위로. 6초 정적 구간은 자막 없음.
