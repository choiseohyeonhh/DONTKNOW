/* 루프 배경 계정·게시물, 톡 배경 연락처·방·문장 풀, 배경 알림 스케줄.
 * 설계: SNS_SPECIFICATION 8.10~8.11, MESSAGING_SPECIFICATION 3.9, DATABASE_SCHEMA 3.11/L19~L22.
 */
window.LM = window.LM || {};
window.LM.C = window.LM.C || {};
window.LM.C.ambient = {
 "people": [
  {
   "id": "BG-001",
   "name": "이상철",
   "circle": "가족",
   "relation": "아버지",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": true,
   "background": false,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-002",
   "name": "정지훈",
   "circle": "성원고 동창",
   "relation": "단짝 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": true,
   "background": false,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-003",
   "name": "조현우",
   "circle": "성원고 동창",
   "relation": "고3 반 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": "hyunwoo.cho"
  },
  {
   "id": "BG-004",
   "name": "윤서진",
   "circle": "성원고 동창",
   "relation": "고3 반 친구 · 재수",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": "seojin.yoon"
  },
  {
   "id": "BG-005",
   "name": "임동현",
   "circle": "성원고 동창",
   "relation": "고3 반 친구 · 입대 준비",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": "donghyun.lim"
  },
  {
   "id": "BG-006",
   "name": "홍예슬",
   "circle": "성원고 동창",
   "relation": "고3 반 친구 · 알바",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": "yeseul.hong"
  },
  {
   "id": "BG-007",
   "name": "배승우",
   "circle": "성원고 동창",
   "relation": "고3 반 친구 · 축구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": "seungwoo.bae"
  },
  {
   "id": "BG-008",
   "name": "장소연",
   "circle": "성원고 동창",
   "relation": "고3 반 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": "soyeon.jang"
  },
  {
   "id": "BG-009",
   "name": "신건우",
   "circle": "성원고 동창",
   "relation": "고3 반 친구 · 입대",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": "gunwoo.shin"
  },
  {
   "id": "BG-010",
   "name": "고나영",
   "circle": "성원고 동창",
   "relation": "고3 반 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": "nayoung.ko"
  },
  {
   "id": "BG-011",
   "name": "김도훈",
   "circle": "성원고 동창",
   "relation": "고3 반 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-012",
   "name": "박세라",
   "circle": "성원고 동창",
   "relation": "고3 반 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-013",
   "name": "이준서",
   "circle": "성원고 동창",
   "relation": "고3 반 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-014",
   "name": "최유빈",
   "circle": "성원고 동창",
   "relation": "고3 반 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-015",
   "name": "한지수",
   "circle": "성원고 동창",
   "relation": "고3 반 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-016",
   "name": "김민서",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": "minseo.kim"
  },
  {
   "id": "BG-017",
   "name": "최준",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": "jun.choi"
  },
  {
   "id": "BG-018",
   "name": "박하늘",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": "haneul.park"
  },
  {
   "id": "BG-019",
   "name": "이유나",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": "yuna.lee"
  },
  {
   "id": "BG-020",
   "name": "정시우",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": "siwoo.jung"
  },
  {
   "id": "BG-021",
   "name": "오채린",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": "chaerin.oh"
  },
  {
   "id": "BG-022",
   "name": "한도윤",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": "doyoon.han"
  },
  {
   "id": "BG-023",
   "name": "서은비",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": "eunbi.seo"
  },
  {
   "id": "BG-024",
   "name": "강태호",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": "taeho.kang"
  },
  {
   "id": "BG-025",
   "name": "문지원",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": "jiwon.moon"
  },
  {
   "id": "BG-026",
   "name": "배수현",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-027",
   "name": "조은찬",
   "circle": "한서대 경영 26 동기",
   "relation": "경영 26 동기",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-028",
   "name": "한서아",
   "circle": "서아·영상과",
   "relation": "전 여자친구 · 영상과",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": true,
   "background": false,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-029",
   "name": "수아",
   "circle": "서아·영상과",
   "relation": "영상과 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": "film.sua"
  },
  {
   "id": "BG-030",
   "name": "재현",
   "circle": "서아·영상과",
   "relation": "영상과 친구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": "cut.jaehyun"
  },
  {
   "id": "BG-031",
   "name": "김태식",
   "circle": "풋살",
   "relation": "풋살 모임",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-032",
   "name": "이강훈",
   "circle": "풋살",
   "relation": "풋살 모임",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-033",
   "name": "박정우",
   "circle": "풋살",
   "relation": "풋살 모임",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-034",
   "name": "최민규",
   "circle": "풋살",
   "relation": "풋살 모임",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-035",
   "name": "정해성",
   "circle": "풋살",
   "relation": "풋살 모임",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-036",
   "name": "오세훈",
   "circle": "풋살",
   "relation": "풋살 모임",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-037",
   "name": "윤재민",
   "circle": "풋살",
   "relation": "풋살 모임",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-038",
   "name": "김상욱",
   "circle": "풋살",
   "relation": "풋살 모임",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-039",
   "name": "남기훈",
   "circle": "풋살",
   "relation": "풋살 모임",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-040",
   "name": "박종석",
   "circle": "지난 알바",
   "relation": "편의점 점장",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-041",
   "name": "이수빈",
   "circle": "지난 알바",
   "relation": "편의점 알바 동료",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-042",
   "name": "정다은",
   "circle": "지난 알바",
   "relation": "편의점 알바 동료",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-043",
   "name": "김우진",
   "circle": "지난 알바",
   "relation": "편의점 알바 동료",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-044",
   "name": "송민호",
   "circle": "학원·선생님",
   "relation": "고3 담임",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-045",
   "name": "김도경",
   "circle": "학원·선생님",
   "relation": "수학 학원 선생님",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-046",
   "name": "이현수",
   "circle": "학원·선생님",
   "relation": "국어 선생님",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-047",
   "name": "최성호",
   "circle": "동네·생활",
   "relation": "헬스장 관장",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-048",
   "name": "정명숙",
   "circle": "동네·생활",
   "relation": "세탁소 사장",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-049",
   "name": "한소희",
   "circle": "동네·생활",
   "relation": "미용실 원장",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-050",
   "name": "박정호",
   "circle": "동네·생활",
   "relation": "부동산",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-051",
   "name": "오영수",
   "circle": "동네·생활",
   "relation": "편의점 사장",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-052",
   "name": "김말순",
   "circle": "동네·생활",
   "relation": "분식집 사장",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-053",
   "name": "김태윤",
   "circle": "기관·업체",
   "relation": "성원경찰서 경위",
   "talk": false,
   "talkFriend": false,
   "contact": true,
   "canon": true,
   "background": false,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-054",
   "name": "누리은행 고객센터",
   "circle": "기관·업체",
   "relation": "은행 고객센터",
   "talk": false,
   "talkFriend": false,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-055",
   "name": "바로택시 고객센터",
   "circle": "기관·업체",
   "relation": "택시 고객센터",
   "talk": false,
   "talkFriend": false,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-056",
   "name": "한서대 학교 행정실",
   "circle": "기관·업체",
   "relation": "학교 행정실",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-057",
   "name": "온통신 고객센터",
   "circle": "기관·업체",
   "relation": "통신사 고객센터",
   "talk": false,
   "talkFriend": false,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-058",
   "name": "성원구 청년센터",
   "circle": "기관·업체",
   "relation": "청년센터",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-059",
   "name": "한서대 도서관",
   "circle": "기관·업체",
   "relation": "도서관 안내",
   "talk": false,
   "talkFriend": false,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-060",
   "name": "성원구 보건소",
   "circle": "기관·업체",
   "relation": "보건소",
   "talk": false,
   "talkFriend": false,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-061",
   "name": "성원우체국",
   "circle": "기관·업체",
   "relation": "우체국",
   "talk": false,
   "talkFriend": false,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  },
  {
   "id": "BG-062",
   "name": "한끼 고객센터",
   "circle": "기관·업체",
   "relation": "배달 고객센터",
   "talk": false,
   "talkFriend": false,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "emoji",
   "loop": null
  },
  {
   "id": "BG-063",
   "name": "이웃마켓 고객센터",
   "circle": "기관·업체",
   "relation": "중고거래 고객센터",
   "talk": false,
   "talkFriend": false,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-064",
   "name": "성원구청",
   "circle": "기관·업체",
   "relation": "구청 민원실",
   "talk": false,
   "talkFriend": false,
   "contact": true,
   "canon": false,
   "background": true,
   "tone": "casual",
   "loop": null
  }
 ],
 "rooms": [
  {
   "id": "talk.biz26",
   "name": "경영 26 새내기",
   "type": "group",
   "circle": "한서대 경영 26 동기",
   "count": 52,
   "memberCount": 52,
   "members": [
    "BG-016",
    "BG-017",
    "BG-018",
    "BG-019",
    "BG-020",
    "BG-021",
    "BG-022",
    "BG-023",
    "BG-024",
    "BG-025",
    "BG-026",
    "BG-027"
   ],
   "muted": false,
   "history": [
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "내일 1교시 끝나고 학식 먹을 사람?",
     "at": "2026-01-05T11:29:16+09:00",
     "day": "1/5",
     "time": "11:29"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나 나 11시에 끝나",
     "at": "2026-01-05T16:06:35+09:00",
     "day": "1/5",
     "time": "16:06"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "과방 지금 열려 있음?",
     "at": "2026-01-06T01:35:54+09:00",
     "day": "1/6",
     "time": "01:35"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "아까 10시까지 열어준다던데",
     "at": "2026-01-06T14:51:32+09:00",
     "day": "1/6",
     "time": "14:51"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "내일 1교시 끝나고 학식 먹을 사람?",
     "at": "2026-01-07T00:59:59+09:00",
     "day": "1/7",
     "time": "00:59"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "나 12시에 끝나는데",
     "at": "2026-01-07T16:27:59+09:00",
     "day": "1/7",
     "time": "16:27"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "그럼 12시 10분에 학생회관 앞에서 보자",
     "at": "2026-01-07T22:38:40+09:00",
     "day": "1/7",
     "time": "22:38"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "내일 MT 준비물 뭐 챙겨?",
     "at": "2026-01-08T16:22:02+09:00",
     "day": "1/8",
     "time": "16:22"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "세면도구랑 여분 옷",
     "at": "2026-01-08T19:21:39+09:00",
     "day": "1/8",
     "time": "19:21"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "나는 간식 챙길게",
     "at": "2026-01-08T20:04:10+09:00",
     "day": "1/8",
     "time": "20:04"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "그럼 나는 보드게임 가져감",
     "at": "2026-01-08T22:40:20+09:00",
     "day": "1/8",
     "time": "22:40"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "경제학원론 과제 내일까지 맞아?",
     "at": "2026-01-09T08:27:17+09:00",
     "day": "1/9",
     "time": "08:27"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "응 23시 59분까지",
     "at": "2026-01-09T10:53:55+09:00",
     "day": "1/9",
     "time": "10:53"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "풋살 같이 할 사람?",
     "at": "2026-01-11T12:24:56+09:00",
     "day": "1/11",
     "time": "12:24"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "나 운동화만 있으면 감",
     "at": "2026-01-11T15:37:57+09:00",
     "day": "1/11",
     "time": "15:37"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "MT 회비 얼마였지?",
     "at": "2026-01-13T04:07:32+09:00",
     "day": "1/13",
     "time": "04:07"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "3만 원, 어제 공지에 올라왔어",
     "at": "2026-01-13T09:09:59+09:00",
     "day": "1/13",
     "time": "09:09"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "수강정정 결과 떴어?",
     "at": "2026-01-14T04:08:08+09:00",
     "day": "1/14",
     "time": "04:08"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "나 방금 확인했는데 2과목 바뀜",
     "at": "2026-01-14T05:25:43+09:00",
     "day": "1/14",
     "time": "05:25"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "경제학원론 과제 범위 3장까지 맞지?",
     "at": "2026-01-15T13:32:12+09:00",
     "day": "1/15",
     "time": "13:32"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "응 4장은 다음 주래",
     "at": "2026-01-15T13:39:06+09:00",
     "day": "1/15",
     "time": "13:39"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "다행이다 오늘 2장까지밖에 못 했어 ㅠ",
     "at": "2026-01-15T23:39:49+09:00",
     "day": "1/15",
     "time": "23:39"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "내일 1교시 있는 사람? 나는 알람 세 개 맞춰놨어",
     "at": "2026-01-16T13:12:11+09:00",
     "day": "1/16",
     "time": "13:12"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "중앙도서관 3층 자리 있음?",
     "at": "2026-01-17T03:28:31+09:00",
     "day": "1/17",
     "time": "03:28"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "지금 꽉 찼어 ㅠ",
     "at": "2026-01-17T21:35:16+09:00",
     "day": "1/17",
     "time": "21:35"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "과잠 색 뭐가 나아?",
     "at": "2026-01-18T02:02:40+09:00",
     "day": "1/18",
     "time": "02:02"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "네이비가 무난하지",
     "at": "2026-01-18T20:39:08+09:00",
     "day": "1/18",
     "time": "20:39"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "과방 프린터 또 먹통이래 ㅠㅠ",
     "at": "2026-01-19T13:42:45+09:00",
     "day": "1/19",
     "time": "13:42"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "동아리 홍보 도와줄 사람?",
     "at": "2026-01-20T13:17:12+09:00",
     "day": "1/20",
     "time": "13:17"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "나 내일 2시까지는 돼",
     "at": "2026-01-20T15:39:01+09:00",
     "day": "1/20",
     "time": "15:39"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "오늘 학식 뭐였어?",
     "at": "2026-01-21T08:45:37+09:00",
     "day": "1/21",
     "time": "08:45"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "제육볶음, 근데 금방 떨어졌대",
     "at": "2026-01-21T20:46:59+09:00",
     "day": "1/21",
     "time": "20:46"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "수강정정 결과 떴대",
     "at": "2026-01-22T00:43:42+09:00",
     "day": "1/22",
     "time": "00:43"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "나 방금 봤어, 경제학원론 이동됐음",
     "at": "2026-01-22T00:48:10+09:00",
     "day": "1/22",
     "time": "00:48"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "오 나도 같은 반 됐다",
     "at": "2026-01-22T07:00:33+09:00",
     "day": "1/22",
     "time": "07:00"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "편의점 같이 갈 사람?",
     "at": "2026-01-24T01:30:02+09:00",
     "day": "1/24",
     "time": "01:30"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "나 지금 내려감",
     "at": "2026-01-24T10:29:29+09:00",
     "day": "1/24",
     "time": "10:29"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "경제학원론 과제 범위 3장까지 맞지?",
     "at": "2026-01-27T11:29:10+09:00",
     "day": "1/27",
     "time": "11:29"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "MT 회비 냈어?",
     "at": "2026-01-28T08:42:30+09:00",
     "day": "1/28",
     "time": "08:42"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "나 어제 냈어",
     "at": "2026-01-28T16:08:30+09:00",
     "day": "1/28",
     "time": "16:08"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나도 지금 보낼게",
     "at": "2026-01-28T19:01:30+09:00",
     "day": "1/28",
     "time": "19:01"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "오늘 학식 돈가스 나온다던데",
     "at": "2026-01-29T18:08:50+09:00",
     "day": "1/29",
     "time": "18:08"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "과잠 주문 링크 다시 올려줄 사람?",
     "at": "2026-01-30T01:23:49+09:00",
     "day": "1/30",
     "time": "01:23"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "단톡 공지에 있어",
     "at": "2026-01-30T11:00:12+09:00",
     "day": "1/30",
     "time": "11:00"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "아까 위로 올라가서 못 찾았어 ㅋㅋ",
     "at": "2026-01-30T22:14:36+09:00",
     "day": "1/30",
     "time": "22:14"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "MT 사진 다 올렸어 단톡에",
     "at": "2026-02-01T02:22:04+09:00",
     "day": "2/1",
     "time": "02:22"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "3조 자료 누가 정리했지?",
     "at": "2026-02-03T01:02:08+09:00",
     "day": "2/3",
     "time": "01:02"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나 어제 올린 파일 봐",
     "at": "2026-02-03T15:35:56+09:00",
     "day": "2/3",
     "time": "15:35"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "내일 발표 순서 바뀐 거 맞지?",
     "at": "2026-02-05T03:43:10+09:00",
     "day": "2/5",
     "time": "03:43"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "응 우리 조가 두 번째래",
     "at": "2026-02-05T21:49:33+09:00",
     "day": "2/5",
     "time": "21:49"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "프린터 고쳐졌대?",
     "at": "2026-02-06T06:32:05+09:00",
     "day": "2/6",
     "time": "06:32"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "아직 안 됨, 학생회관 가야 해",
     "at": "2026-02-06T11:38:31+09:00",
     "day": "2/6",
     "time": "11:38"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "과제 같이 할 사람?",
     "at": "2026-02-07T03:03:28+09:00",
     "day": "2/7",
     "time": "03:03"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "나 지금 도서관인데 옆자리 비었어",
     "at": "2026-02-07T04:33:16+09:00",
     "day": "2/7",
     "time": "04:33"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "MT 사진 원본 어디 있음?",
     "at": "2026-02-08T00:05:03+09:00",
     "day": "2/8",
     "time": "00:05"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "단톡 파일에 올렸어",
     "at": "2026-02-08T11:35:11+09:00",
     "day": "2/8",
     "time": "11:35"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "수강신청 다 한 사람?",
     "at": "2026-02-09T19:10:59+09:00",
     "day": "2/9",
     "time": "19:10"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "나는 하나 남았어 ㅠ",
     "at": "2026-02-09T22:23:41+09:00",
     "day": "2/9",
     "time": "22:23"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "오늘 과방 몇 시까지 열어?",
     "at": "2026-02-10T01:28:37+09:00",
     "day": "2/10",
     "time": "01:28"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "11시까지랬어",
     "at": "2026-02-10T15:11:18+09:00",
     "day": "2/10",
     "time": "15:11"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "수강정정 성공한 사람 있음? 나는 대기 3번이야",
     "at": "2026-02-11T17:30:48+09:00",
     "day": "2/11",
     "time": "17:30"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "중앙도서관 지금 자리 없음",
     "at": "2026-02-12T03:14:38+09:00",
     "day": "2/12",
     "time": "03:14"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "3층은 비었어?",
     "at": "2026-02-12T06:00:53+09:00",
     "day": "2/12",
     "time": "06:00"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "3층도 만석이야 ㅠ",
     "at": "2026-02-12T14:35:09+09:00",
     "day": "2/12",
     "time": "14:35"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "내일 1교시 교수님이 출석 부르신대",
     "at": "2026-02-14T06:01:02+09:00",
     "day": "2/14",
     "time": "06:01"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "그럼 8시 50분에 보자",
     "at": "2026-02-14T07:55:38+09:00",
     "day": "2/14",
     "time": "07:55"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "내일 발표 순서 바뀐 거 맞지?",
     "at": "2026-02-15T03:42:23+09:00",
     "day": "2/15",
     "time": "03:42"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "응 우리 조가 두 번째래",
     "at": "2026-02-15T06:53:50+09:00",
     "day": "2/15",
     "time": "06:53"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "그럼 오늘 밤에 한 번만 더 맞춰보자",
     "at": "2026-02-15T16:51:35+09:00",
     "day": "2/15",
     "time": "16:51"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "내일 9시 수업인데 지금 이게 뭐냐",
     "at": "2026-02-16T21:28:30+09:00",
     "day": "2/16",
     "time": "21:28"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "프린터 고쳐졌대?",
     "at": "2026-02-17T10:29:45+09:00",
     "day": "2/17",
     "time": "10:29"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "아직 안 됨",
     "at": "2026-02-17T15:59:18+09:00",
     "day": "2/17",
     "time": "15:59"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "그럼 내일 아침에 학생회관에서 출력하자",
     "at": "2026-02-17T17:48:39+09:00",
     "day": "2/17",
     "time": "17:48"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "과잠 사이즈 표 올려줄 사람?",
     "at": "2026-02-18T01:31:06+09:00",
     "day": "2/18",
     "time": "01:31"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "동아리 홍보 부스 내일까지 한대",
     "at": "2026-02-19T11:39:49+09:00",
     "day": "2/19",
     "time": "11:39"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "중앙도서관 지금 자리 없음 ㅠ",
     "at": "2026-02-22T22:46:57+09:00",
     "day": "2/22",
     "time": "22:46"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "편의점에서 커피 사왔는데 뚜껑이 안 닫혀 있었음",
     "at": "2026-02-23T10:28:05+09:00",
     "day": "2/23",
     "time": "10:28"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "동아리 홍보 부스 도와줄 사람?",
     "at": "2026-02-24T14:19:58+09:00",
     "day": "2/24",
     "time": "14:19"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "나 2시까지 가능",
     "at": "2026-02-24T14:23:34+09:00",
     "day": "2/24",
     "time": "14:23"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "좋아 그때 보자",
     "at": "2026-02-24T21:36:48+09:00",
     "day": "2/24",
     "time": "21:36"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "단톡 공지 읽은 사람 손",
     "at": "2026-02-26T15:18:57+09:00",
     "day": "2/26",
     "time": "15:18"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "과잠 주문 오늘까지래",
     "at": "2026-02-27T01:49:54+09:00",
     "day": "2/27",
     "time": "01:49"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "링크 다시 올려줄 수 있어?",
     "at": "2026-02-27T20:06:46+09:00",
     "day": "2/27",
     "time": "20:06"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "3조 발표 자료 누가 최종 확인하지?",
     "at": "2026-02-28T02:56:30+09:00",
     "day": "2/28",
     "time": "02:56"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "내가 밤에 한 번 볼게",
     "at": "2026-02-28T17:54:18+09:00",
     "day": "2/28",
     "time": "17:54"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "고마워, 나는 발표 흐름 다듬을게",
     "at": "2026-02-28T22:50:27+09:00",
     "day": "2/28",
     "time": "22:50"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "동아리 OT 갈 사람?",
     "at": "2026-03-01T09:24:17+09:00",
     "day": "3/1",
     "time": "09:24"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "나 갈래, 몇 시야?",
     "at": "2026-03-01T11:32:58+09:00",
     "day": "3/1",
     "time": "11:32"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "내일 비 온다는데 우산 챙겨",
     "at": "2026-03-02T02:18:38+09:00",
     "day": "3/2",
     "time": "02:18"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "고마워, 나는 아예 부츠 신고 갈래",
     "at": "2026-03-02T03:19:13+09:00",
     "day": "3/2",
     "time": "03:19"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "그게 낫겠다",
     "at": "2026-03-02T21:40:37+09:00",
     "day": "3/2",
     "time": "21:40"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "오늘 학식 제육볶음이었대",
     "at": "2026-03-03T00:29:03+09:00",
     "day": "3/3",
     "time": "00:29"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "헐 나 놓쳤어",
     "at": "2026-03-03T04:03:02+09:00",
     "day": "3/3",
     "time": "04:03"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "내일은 돈가스래, 일찍 가자",
     "at": "2026-03-03T17:24:52+09:00",
     "day": "3/3",
     "time": "17:24"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "경제학원론 교재 있어?",
     "at": "2026-03-04T00:59:17+09:00",
     "day": "3/4",
     "time": "00:59"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "나 파일로 갖고 있어, 보내줄까?",
     "at": "2026-03-04T13:25:46+09:00",
     "day": "3/4",
     "time": "13:25"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "내일 비 온다며?",
     "at": "2026-03-05T21:36:27+09:00",
     "day": "3/5",
     "time": "21:36"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "우산 챙기라고 공지 떴어",
     "at": "2026-03-05T21:42:14+09:00",
     "day": "3/5",
     "time": "21:42"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "내일 비 온대, 우산 잊지 마",
     "at": "2026-03-08T20:24:24+09:00",
     "day": "3/8",
     "time": "20:24"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "다들 과제 어디까지 했어?",
     "at": "2026-03-10T09:57:55+09:00",
     "day": "3/10",
     "time": "09:57"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나는 2번까지 함 ㅠ",
     "at": "2026-03-10T16:27:34+09:00",
     "day": "3/10",
     "time": "16:27"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "3조 발표 준비물 프린트해야 하는 사람?",
     "at": "2026-03-11T23:59:44+09:00",
     "day": "3/11",
     "time": "23:59"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "경제학원론 과제 같이 할 사람?",
     "at": "2026-03-13T03:53:34+09:00",
     "day": "3/13",
     "time": "03:53"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "나 지금 도서관인데",
     "at": "2026-03-13T16:02:00+09:00",
     "day": "3/13",
     "time": "16:02"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "몇 층이야?",
     "at": "2026-03-13T19:41:43+09:00",
     "day": "3/13",
     "time": "19:41"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "3층 창가 쪽, 자리 있어",
     "at": "2026-03-13T20:31:08+09:00",
     "day": "3/13",
     "time": "20:31"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "3조 발표 순서 바뀐 거 확인했어?",
     "at": "2026-03-14T04:02:06+09:00",
     "day": "3/14",
     "time": "04:02"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "응 우리 조 두 번째래",
     "at": "2026-03-14T07:32:32+09:00",
     "day": "3/14",
     "time": "07:32"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "그럼 오늘 밤에 리허설 한 번 하자",
     "at": "2026-03-14T11:13:01+09:00",
     "day": "3/14",
     "time": "11:13"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "좋아 11시에 모여서 하자",
     "at": "2026-03-14T15:49:43+09:00",
     "day": "3/14",
     "time": "15:49"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "다들 자냐",
     "at": "2026-03-15T03:39:00+09:00",
     "day": "3/15",
     "time": "03:39"
    }
   ]
  },
  {
   "id": "talk.hs32",
   "name": "성원고 3-2",
   "type": "group",
   "circle": "성원고 동창",
   "count": 31,
   "memberCount": 31,
   "members": [
    "BG-002",
    "BG-003",
    "BG-004",
    "BG-005",
    "BG-006",
    "BG-007",
    "BG-008",
    "BG-009",
    "BG-010",
    "BG-011",
    "BG-012",
    "BG-013",
    "BG-014",
    "BG-015"
   ],
   "muted": false,
   "history": [
    {
     "dir": "in",
     "sender": "임동현",
     "body": "주말에 시간 돼?",
     "at": "2025-11-03T01:38:22+09:00",
     "day": "11/3",
     "time": "01:38"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "토요일 저녁은 괜찮아",
     "at": "2025-11-03T11:27:39+09:00",
     "day": "11/3",
     "time": "11:27"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "다들 뭐 하고 지내? 나는 요즘 집에만 있음",
     "at": "2025-11-04T10:42:27+09:00",
     "day": "11/4",
     "time": "10:42"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "재수 학원 첫날인데 벌써 지침",
     "at": "2025-11-06T22:57:41+09:00",
     "day": "11/6",
     "time": "22:57"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "재수 학원 어때?",
     "at": "2025-11-07T03:34:02+09:00",
     "day": "11/7",
     "time": "03:34"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "생각보다 빡세, 아침 7시야",
     "at": "2025-11-07T12:13:54+09:00",
     "day": "11/7",
     "time": "12:13"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "입대 날짜 드디어 나왔다",
     "at": "2025-11-09T21:22:14+09:00",
     "day": "11/9",
     "time": "21:22"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "훈련소 첫날, 폰 뺏기기 전에 남긴다",
     "at": "2025-11-13T02:36:28+09:00",
     "day": "11/13",
     "time": "02:36"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "알바 끝나고 집 가는 길",
     "at": "2025-11-15T02:33:34+09:00",
     "day": "11/15",
     "time": "02:33"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "오늘 모의고사 봤는데 수학이 어렵더라",
     "at": "2025-11-16T04:40:44+09:00",
     "day": "11/16",
     "time": "04:40"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "졸업 사진 보정하는 중",
     "at": "2025-11-18T06:45:37+09:00",
     "day": "11/18",
     "time": "06:45"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "주말에 축구할 사람?",
     "at": "2025-11-19T07:23:33+09:00",
     "day": "11/19",
     "time": "07:23"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "동네에 새로 생긴 카페 가봄",
     "at": "2025-11-20T20:21:18+09:00",
     "day": "11/20",
     "time": "20:21"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "다들 대학 어디 갔어?",
     "at": "2025-11-23T23:36:28+09:00",
     "day": "11/23",
     "time": "23:36"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "오늘은 진짜 일찍 잘 거다",
     "at": "2025-11-24T11:50:59+09:00",
     "day": "11/24",
     "time": "11:50"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "이번 주 알바 대타 가능?",
     "at": "2025-11-27T11:32:24+09:00",
     "day": "11/27",
     "time": "11:32"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "나 화요일은 돼",
     "at": "2025-11-27T18:23:27+09:00",
     "day": "11/27",
     "time": "18:23"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "풋살 몇 시야?",
     "at": "2025-12-03T07:47:23+09:00",
     "day": "12/3",
     "time": "07:47"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "8시, 구장 예약했어",
     "at": "2025-12-03T22:51:00+09:00",
     "day": "12/3",
     "time": "22:51"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "동창 모임 날짜 언제로 할까?",
     "at": "2025-12-04T00:07:38+09:00",
     "day": "12/4",
     "time": "00:07"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "다음 주 토요일 어때",
     "at": "2025-12-04T21:16:11+09:00",
     "day": "12/4",
     "time": "21:16"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "수시 결과 나왔다",
     "at": "2025-12-07T04:04:18+09:00",
     "day": "12/7",
     "time": "04:04"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "이번 주 토요일 동창 모임 어때?",
     "at": "2025-12-08T03:37:33+09:00",
     "day": "12/8",
     "time": "03:37"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "나 좋아",
     "at": "2025-12-08T11:04:23+09:00",
     "day": "12/8",
     "time": "11:04"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "나도 갈 수 있어, 시간 맞춰줘",
     "at": "2025-12-08T22:09:38+09:00",
     "day": "12/8",
     "time": "22:09"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "요즘 야자 끝나면 바로 눕는다",
     "at": "2025-12-13T23:55:18+09:00",
     "day": "12/13",
     "time": "23:55"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "재수 학원 같이 다닐 사람?",
     "at": "2025-12-15T09:50:18+09:00",
     "day": "12/15",
     "time": "09:50"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "나는 입대 준비 중이라 ㅠ",
     "at": "2025-12-15T19:01:26+09:00",
     "day": "12/15",
     "time": "19:01"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "아 맞다, 너 곧 가지",
     "at": "2025-12-15T21:09:00+09:00",
     "day": "12/15",
     "time": "21:09"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "생일인데 아무도 모름",
     "at": "2025-12-18T13:05:09+09:00",
     "day": "12/18",
     "time": "13:05"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "훈련소 생활 어때?",
     "at": "2025-12-23T02:50:18+09:00",
     "day": "12/23",
     "time": "02:50"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "첫날은 정신없었는데 지금은 적응함",
     "at": "2025-12-23T09:49:15+09:00",
     "day": "12/23",
     "time": "09:49"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "풋살 인원 두 명 부족한데",
     "at": "2025-12-24T05:34:45+09:00",
     "day": "12/24",
     "time": "05:34"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "나랑 고나영 데려갈게",
     "at": "2025-12-24T14:42:59+09:00",
     "day": "12/24",
     "time": "14:42"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "좋아 그럼 예약 확정",
     "at": "2025-12-24T23:10:17+09:00",
     "day": "12/24",
     "time": "23:10"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "고등학교 앞 지나갔는데 감회가 새롭다",
     "at": "2025-12-26T21:54:49+09:00",
     "day": "12/26",
     "time": "21:54"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "재수생은 명절이 없다",
     "at": "2025-12-30T02:42:37+09:00",
     "day": "12/30",
     "time": "02:42"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "입대 전에 한 번 모이자",
     "at": "2025-12-31T22:09:23+09:00",
     "day": "12/31",
     "time": "22:09"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "편지 받는 게 제일 큰 낙",
     "at": "2026-01-02T01:11:23+09:00",
     "day": "1/2",
     "time": "01:11"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "이번 주 알바 스케줄 겨우 짰다",
     "at": "2026-01-03T14:47:57+09:00",
     "day": "1/3",
     "time": "14:47"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "대학 첫 수업 듣고 왔음",
     "at": "2026-01-05T19:42:02+09:00",
     "day": "1/5",
     "time": "19:42"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "동창 모임 날짜 정하자",
     "at": "2026-01-08T08:10:27+09:00",
     "day": "1/8",
     "time": "08:10"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "오늘 풋살했는데 다리 후들",
     "at": "2026-01-09T12:01:29+09:00",
     "day": "1/9",
     "time": "12:01"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "성원천 산책하기 좋은 날씨",
     "at": "2026-01-10T03:37:05+09:00",
     "day": "1/10",
     "time": "03:37"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "과제가 고3 때보다 많다",
     "at": "2026-01-13T11:26:04+09:00",
     "day": "1/13",
     "time": "11:26"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "졸업 사진 원본 있어?",
     "at": "2026-01-16T05:52:30+09:00",
     "day": "1/16",
     "time": "05:52"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "나 단톡에 올렸어",
     "at": "2026-01-16T22:53:15+09:00",
     "day": "1/16",
     "time": "22:53"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "오늘은 친구랑 수다만 떨다 끝남",
     "at": "2026-01-17T15:01:42+09:00",
     "day": "1/17",
     "time": "15:01"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "합격하고 나니 할 게 없다",
     "at": "2026-01-18T20:56:52+09:00",
     "day": "1/18",
     "time": "20:56"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "수강신청 성공했어?",
     "at": "2026-01-19T03:25:46+09:00",
     "day": "1/19",
     "time": "03:25"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "나는 두 개 실패했어 ㅠ",
     "at": "2026-01-19T04:50:07+09:00",
     "day": "1/19",
     "time": "04:50"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "수강신청 전쟁 끝",
     "at": "2026-01-22T11:00:04+09:00",
     "day": "1/22",
     "time": "11:00"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "다들 방학 때 뭐 했어?",
     "at": "2026-01-24T16:29:35+09:00",
     "day": "1/24",
     "time": "16:29"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "오늘은 집에서 영상만 봄",
     "at": "2026-01-27T10:47:48+09:00",
     "day": "1/27",
     "time": "10:47"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "모의고사 성적표 나왔다",
     "at": "2026-01-30T04:03:23+09:00",
     "day": "1/30",
     "time": "04:03"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "오늘 저녁 먹었어?",
     "at": "2026-01-31T19:15:24+09:00",
     "day": "1/31",
     "time": "19:15"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "아직, 학원 끝나고 먹을 거야",
     "at": "2026-01-31T22:34:15+09:00",
     "day": "1/31",
     "time": "22:34"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "훈련소 가기 전에 머리 깎았다",
     "at": "2026-02-03T23:04:11+09:00",
     "day": "2/3",
     "time": "23:04"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "여기 밥은 생각보다 괜찮다",
     "at": "2026-02-08T23:50:34+09:00",
     "day": "2/8",
     "time": "23:50"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "알바비 들어왔다",
     "at": "2026-02-12T10:50:01+09:00",
     "day": "2/12",
     "time": "10:50"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "오늘은 도서관에서 공부",
     "at": "2026-02-19T18:35:23+09:00",
     "day": "2/19",
     "time": "18:35"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "졸업 앨범 나왔다",
     "at": "2026-02-22T14:30:56+09:00",
     "day": "2/22",
     "time": "14:30"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "이번 주말 경기 있음?",
     "at": "2026-02-25T16:35:54+09:00",
     "day": "2/25",
     "time": "16:35"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "동네 분식집 다시 문 열었더라",
     "at": "2026-02-27T15:30:42+09:00",
     "day": "2/27",
     "time": "15:30"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "대학 생활 생각보다 바쁘다",
     "at": "2026-02-28T02:49:13+09:00",
     "day": "2/28",
     "time": "02:49"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "오늘은 그냥 쉬는 날",
     "at": "2026-03-02T08:37:52+09:00",
     "day": "3/2",
     "time": "08:37"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "알바 대타 구해요",
     "at": "2026-03-04T15:45:03+09:00",
     "day": "3/4",
     "time": "15:45"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "나 화요일 가능",
     "at": "2026-03-04T18:18:01+09:00",
     "day": "3/4",
     "time": "18:18"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "고마워, 점장님께 말할게",
     "at": "2026-03-04T20:10:22+09:00",
     "day": "3/4",
     "time": "20:10"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "다들 연락 좀 하자",
     "at": "2026-03-06T01:26:09+09:00",
     "day": "3/6",
     "time": "01:26"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "알바 끝나고 볼래?",
     "at": "2026-03-07T11:43:26+09:00",
     "day": "3/7",
     "time": "11:43"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "몇 시에 끝나?",
     "at": "2026-03-07T17:00:47+09:00",
     "day": "3/7",
     "time": "17:00"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "주말 경기 인원 몇 명이야?",
     "at": "2026-03-10T06:17:16+09:00",
     "day": "3/10",
     "time": "06:17"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "지금 여섯 명",
     "at": "2026-03-10T12:56:59+09:00",
     "day": "3/10",
     "time": "12:56"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "졸업식 때 사진 갖고 있어?",
     "at": "2026-03-12T19:54:00+09:00",
     "day": "3/12",
     "time": "19:54"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "응 몇 장 있어, 보내줄게",
     "at": "2026-03-12T23:27:41+09:00",
     "day": "3/12",
     "time": "23:27"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "휴가 나오면 뭐 할 거야?",
     "at": "2026-03-13T14:42:04+09:00",
     "day": "3/13",
     "time": "14:42"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "일단 고기 먹고 싶다",
     "at": "2026-03-13T21:07:31+09:00",
     "day": "3/13",
     "time": "21:07"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "밤에 라면 먹고 자야지",
     "at": "2026-03-14T03:39:30+09:00",
     "day": "3/14",
     "time": "03:39"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "대학 어디 다녀?",
     "at": "2026-03-15T01:25:44+09:00",
     "day": "3/15",
     "time": "01:25"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "집에서 가까운 데로 왔어",
     "at": "2026-03-15T03:38:00+09:00",
     "day": "3/15",
     "time": "03:38"
    }
   ]
  },
  {
   "id": "talk.team3",
   "name": "경영원론 3조",
   "type": "group",
   "circle": "한서대 경영 26 동기",
   "count": 5,
   "memberCount": 5,
   "members": [
    "BG-016",
    "BG-017",
    "BG-018",
    "BG-019",
    "BG-020"
   ],
   "muted": false,
   "history": [
    {
     "dir": "in",
     "sender": "최준",
     "body": "발표 순서 정하자. 나, 김민서, 박하늘 순서 어때?",
     "at": "2026-03-02T06:35:40+09:00",
     "day": "3/2",
     "time": "06:35"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나는 좋아",
     "at": "2026-03-02T14:09:23+09:00",
     "day": "3/2",
     "time": "14:09"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "나도 괜찮아",
     "at": "2026-03-02T21:47:09+09:00",
     "day": "3/2",
     "time": "21:47"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "3/18 23:59 마감 맞지? 오늘 슬라이드 초안 올릴게",
     "at": "2026-03-03T07:17:39+09:00",
     "day": "3/3",
     "time": "07:17"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "3/18 23:59 마감이니까 오늘 역할 정하자",
     "at": "2026-03-04T05:03:02+09:00",
     "day": "3/4",
     "time": "05:03"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "나는 서론이랑 결론",
     "at": "2026-03-04T08:44:45+09:00",
     "day": "3/4",
     "time": "08:44"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "나는 사례 조사",
     "at": "2026-03-04T10:49:49+09:00",
     "day": "3/4",
     "time": "10:49"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "나는 슬라이드 정리",
     "at": "2026-03-04T15:10:54+09:00",
     "day": "3/4",
     "time": "15:10"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "나는 발표 연습 총괄",
     "at": "2026-03-04T17:12:45+09:00",
     "day": "3/4",
     "time": "17:12"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "슬라이드 나눠서 하자. 나는 1~4장 맡을게",
     "at": "2026-03-05T07:00:14+09:00",
     "day": "3/5",
     "time": "07:00"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "그럼 나는 5~8장 할게",
     "at": "2026-03-05T21:49:34+09:00",
     "day": "3/5",
     "time": "21:49"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "슬라이드 디자인 통일하자",
     "at": "2026-03-06T00:44:53+09:00",
     "day": "3/6",
     "time": "00:44"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "내가 템플릿 만들어서 공유할게",
     "at": "2026-03-06T11:31:06+09:00",
     "day": "3/6",
     "time": "11:31"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "고마워, 그걸로 다 바꾸자",
     "at": "2026-03-06T12:38:36+09:00",
     "day": "3/6",
     "time": "12:38"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "자료조사는 누가 어디까지 했어?",
     "at": "2026-03-07T09:37:46+09:00",
     "day": "3/7",
     "time": "09:37"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "나는 시장 사례 조사했어",
     "at": "2026-03-07T10:01:11+09:00",
     "day": "3/7",
     "time": "10:01"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "슬라이드 1~5장 내가 했어, 확인해줘",
     "at": "2026-03-08T02:07:32+09:00",
     "day": "3/8",
     "time": "02:07"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나 지금 보는 중",
     "at": "2026-03-08T02:29:13+09:00",
     "day": "3/8",
     "time": "02:29"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "3장 그래프 출처 다시 확인해야 할 듯",
     "at": "2026-03-08T06:48:45+09:00",
     "day": "3/8",
     "time": "06:48"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "출처는 내가 찾아볼게",
     "at": "2026-03-08T11:15:46+09:00",
     "day": "3/8",
     "time": "11:15"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "좋아, 고치면 다시 올려줘",
     "at": "2026-03-08T15:04:44+09:00",
     "day": "3/8",
     "time": "15:04"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "자료조사 맡은 부분 오늘 밤까지 보낼게",
     "at": "2026-03-09T10:14:12+09:00",
     "day": "3/9",
     "time": "10:14"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "3/18 23:59까지 제출이니까 17일 밤에는 끝내자",
     "at": "2026-03-10T01:11:20+09:00",
     "day": "3/10",
     "time": "01:11"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "응 그날 리허설까지 하자",
     "at": "2026-03-10T13:52:34+09:00",
     "day": "3/10",
     "time": "13:52"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "발표 리허설 내일 저녁에 한 번 하자",
     "at": "2026-03-11T14:46:00+09:00",
     "day": "3/11",
     "time": "14:46"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "3/18 23:59 제출 전에 최종 점검하자",
     "at": "2026-03-12T03:31:42+09:00",
     "day": "3/12",
     "time": "03:31"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "나는 슬라이드 오탈자 볼게",
     "at": "2026-03-12T06:32:46+09:00",
     "day": "3/12",
     "time": "06:32"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "나는 자료 링크 확인할게",
     "at": "2026-03-12T11:19:19+09:00",
     "day": "3/12",
     "time": "11:19"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "나는 발표 흐름 볼게",
     "at": "2026-03-12T11:25:44+09:00",
     "day": "3/12",
     "time": "11:25"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "나는 영상이랑 음향 확인할게",
     "at": "2026-03-12T16:35:51+09:00",
     "day": "3/12",
     "time": "16:35"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "좋아, 17일 밤까지 다 끝내고 18일에는 제출만 하자",
     "at": "2026-03-12T19:44:54+09:00",
     "day": "3/12",
     "time": "19:44"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "자료조사 마감 오늘까지인데 다들 어디까지 했어?",
     "at": "2026-03-13T01:01:38+09:00",
     "day": "3/13",
     "time": "01:01"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "나는 2번 자료까지 했어",
     "at": "2026-03-13T22:39:13+09:00",
     "day": "3/13",
     "time": "22:39"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나는 1번은 끝냈어",
     "at": "2026-03-13T23:50:50+09:00",
     "day": "3/13",
     "time": "23:50"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "오늘 9시에 온라인으로 모여서 리허설 하자",
     "at": "2026-03-14T00:20:52+09:00",
     "day": "3/14",
     "time": "00:20"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "나는 9시 30분까지는 가능",
     "at": "2026-03-14T04:49:38+09:00",
     "day": "3/14",
     "time": "04:49"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나도 그때 가능",
     "at": "2026-03-14T12:43:58+09:00",
     "day": "3/14",
     "time": "12:43"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "나는 조금 늦을 수도 있어",
     "at": "2026-03-14T19:51:22+09:00",
     "day": "3/14",
     "time": "19:51"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "늦으면 중간에 들어와",
     "at": "2026-03-14T23:06:04+09:00",
     "day": "3/14",
     "time": "23:06"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "출처 정리 누가 할래?",
     "at": "2026-03-15T03:25:29+09:00",
     "day": "3/15",
     "time": "03:25"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "내가 마지막에 한 번에 정리할게",
     "at": "2026-03-15T03:56:00+09:00",
     "day": "3/15",
     "time": "03:56"
    }
   ]
  },
  {
   "id": "talk.futsal",
   "name": "성원 풋살",
   "type": "group",
   "circle": "풋살",
   "count": 14,
   "memberCount": 14,
   "members": [
    "BG-031",
    "BG-032",
    "BG-033",
    "BG-034",
    "BG-035",
    "BG-036",
    "BG-037",
    "BG-038",
    "BG-039"
   ],
   "muted": false,
   "history": [
    {
     "dir": "in",
     "sender": "김태식",
     "body": "토요일 8시 맞지?",
     "at": "2025-09-02T02:17:57+09:00",
     "day": "9/2",
     "time": "02:17"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "응 8시, 구장 예약했어",
     "at": "2025-09-02T04:42:48+09:00",
     "day": "9/2",
     "time": "04:42"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "이번 주 토요일 8시 맞지?",
     "at": "2025-09-09T02:52:29+09:00",
     "day": "9/9",
     "time": "02:52"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "인원 몇 명이야?",
     "at": "2025-09-14T03:46:02+09:00",
     "day": "9/14",
     "time": "03:46"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "지금 아홉 명",
     "at": "2025-09-14T22:52:40+09:00",
     "day": "9/14",
     "time": "22:52"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "구장 예약했어, 2시간",
     "at": "2025-09-18T13:25:48+09:00",
     "day": "9/18",
     "time": "13:25"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "인원 체크: 지금 여덟 명",
     "at": "2025-09-28T16:14:31+09:00",
     "day": "9/28",
     "time": "16:14"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "회비 2만 원씩 보내줘",
     "at": "2025-10-04T08:45:32+09:00",
     "day": "10/4",
     "time": "08:45"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "오늘 비 온다는데 실내 구장으로 바꿀까?",
     "at": "2025-10-06T05:53:50+09:00",
     "day": "10/6",
     "time": "05:53"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "골키퍼 내가 할게",
     "at": "2025-10-16T12:12:16+09:00",
     "day": "10/16",
     "time": "12:12"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "축구화 새로 샀다",
     "at": "2025-10-17T18:20:46+09:00",
     "day": "10/17",
     "time": "18:20"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "이번 주는 사람 적을 것 같다",
     "at": "2025-10-27T04:35:25+09:00",
     "day": "10/27",
     "time": "04:35"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "비 오면 어쩌지?",
     "at": "2025-10-31T02:32:12+09:00",
     "day": "10/31",
     "time": "02:32"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "실내 구장으로 바꿀 수 있어",
     "at": "2025-10-31T17:10:15+09:00",
     "day": "10/31",
     "time": "17:10"
    },
    {
     "dir": "in",
     "sender": "김상욱",
     "body": "다음 주 경기 일정 나왔어",
     "at": "2025-11-02T16:35:19+09:00",
     "day": "11/2",
     "time": "16:35"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "구장비 정산 완료",
     "at": "2025-11-03T21:08:37+09:00",
     "day": "11/3",
     "time": "21:08"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "회비 얼마야?",
     "at": "2025-11-04T12:55:13+09:00",
     "day": "11/4",
     "time": "12:55"
    },
    {
     "dir": "in",
     "sender": "김상욱",
     "body": "2만 원, 공지는 위에 있어",
     "at": "2025-11-04T13:35:22+09:00",
     "day": "11/4",
     "time": "13:35"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "토요일 6시로 당길 수 있는 사람?",
     "at": "2025-11-06T09:32:29+09:00",
     "day": "11/6",
     "time": "09:32"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "인원 10명 넘으면 두 팀으로 나누자",
     "at": "2025-11-08T09:08:01+09:00",
     "day": "11/8",
     "time": "09:08"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "몸살이라 이번 주는 쉴게",
     "at": "2025-11-16T11:20:32+09:00",
     "day": "11/16",
     "time": "11:20"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "구장 예약금 보냈어",
     "at": "2025-11-22T13:32:33+09:00",
     "day": "11/22",
     "time": "13:32"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "오늘 경기 결과 3대2",
     "at": "2025-11-29T09:51:20+09:00",
     "day": "11/29",
     "time": "09:51"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "다음 주 화요일 저녁 어때?",
     "at": "2025-11-30T19:35:42+09:00",
     "day": "11/30",
     "time": "19:35"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "이번 주 경기 언제야?",
     "at": "2025-12-03T03:13:08+09:00",
     "day": "12/3",
     "time": "03:13"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "토요일 저녁 8시",
     "at": "2025-12-03T16:11:29+09:00",
     "day": "12/3",
     "time": "16:11"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "공 새로 샀다",
     "at": "2025-12-08T19:51:37+09:00",
     "day": "12/8",
     "time": "19:51"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "골키퍼 가능?",
     "at": "2025-12-17T04:10:18+09:00",
     "day": "12/17",
     "time": "04:10"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "내가 할게",
     "at": "2025-12-17T08:34:38+09:00",
     "day": "12/17",
     "time": "08:34"
    },
    {
     "dir": "in",
     "sender": "김상욱",
     "body": "이번 주말 비 예보 있음",
     "at": "2025-12-23T03:25:40+09:00",
     "day": "12/23",
     "time": "03:25"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "8시에 구장 앞에서 보자",
     "at": "2025-12-30T08:06:35+09:00",
     "day": "12/30",
     "time": "08:06"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "구장 예약하려면 인원 확정해야 해",
     "at": "2026-01-08T11:05:21+09:00",
     "day": "1/8",
     "time": "11:05"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "나는 간다",
     "at": "2026-01-08T14:21:00+09:00",
     "day": "1/8",
     "time": "14:21"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "나도",
     "at": "2026-01-08T14:42:40+09:00",
     "day": "1/8",
     "time": "14:42"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "나도 갈게, 4명 확정",
     "at": "2026-01-08T17:11:08+09:00",
     "day": "1/8",
     "time": "17:11"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "이번 주 토요일 8시, 인원 체크",
     "at": "2026-01-18T11:31:39+09:00",
     "day": "1/18",
     "time": "11:31"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "나 갈게",
     "at": "2026-01-18T13:51:40+09:00",
     "day": "1/18",
     "time": "13:51"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "나도 가능",
     "at": "2026-01-18T20:38:51+09:00",
     "day": "1/18",
     "time": "20:38"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "지난주 회비 정리해서 올릴게",
     "at": "2026-01-19T01:57:22+09:00",
     "day": "1/19",
     "time": "01:57"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "구장 예약됐어?",
     "at": "2026-01-20T02:16:05+09:00",
     "day": "1/20",
     "time": "02:16"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "방금 확인했어, 확정",
     "at": "2026-01-20T21:53:13+09:00",
     "day": "1/20",
     "time": "21:53"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "다음 주는 화요일 어때?",
     "at": "2026-01-21T15:53:59+09:00",
     "day": "1/21",
     "time": "15:53"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "나는 좋아",
     "at": "2026-01-21T16:28:40+09:00",
     "day": "1/21",
     "time": "16:28"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "인원 확인 부탁",
     "at": "2026-01-27T11:09:39+09:00",
     "day": "1/27",
     "time": "11:09"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "저번 경기 영상 봤는데 수비가 아쉽다",
     "at": "2026-01-28T07:21:09+09:00",
     "day": "1/28",
     "time": "07:21"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "구장 조명 괜찮아?",
     "at": "2026-01-31T16:19:51+09:00",
     "day": "1/31",
     "time": "16:19"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "다음 경기 골키퍼는 누가 해?",
     "at": "2026-02-02T20:16:55+09:00",
     "day": "2/2",
     "time": "20:16"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "오늘 운동하고 다리 풀렸다",
     "at": "2026-02-09T06:01:10+09:00",
     "day": "2/9",
     "time": "06:01"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "주말 날씨 좋다던데",
     "at": "2026-02-20T17:27:20+09:00",
     "day": "2/20",
     "time": "17:27"
    },
    {
     "dir": "in",
     "sender": "김상욱",
     "body": "구장 예약 사이트 열렸다",
     "at": "2026-02-24T09:21:04+09:00",
     "day": "2/24",
     "time": "09:21"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "이번 주는 9시로 하자",
     "at": "2026-02-26T15:13:20+09:00",
     "day": "2/26",
     "time": "15:13"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "회비 입금 확인",
     "at": "2026-02-28T20:25:27+09:00",
     "day": "2/28",
     "time": "20:25"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "저녁 먹고 바로 갈 사람?",
     "at": "2026-03-03T03:57:58+09:00",
     "day": "3/3",
     "time": "03:57"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "오늘 경기 재밌었다",
     "at": "2026-03-06T20:58:28+09:00",
     "day": "3/6",
     "time": "20:58"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "다음 주 인원 미리 알려줘",
     "at": "2026-03-08T07:08:35+09:00",
     "day": "3/8",
     "time": "07:08"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "구장 예약 확정",
     "at": "2026-03-15T03:33:00+09:00",
     "day": "3/15",
     "time": "03:33"
    }
   ]
  },
  {
   "id": "talk.alba",
   "name": "편의점 알바(2024)",
   "type": "group",
   "circle": "지난 알바",
   "count": 6,
   "memberCount": 6,
   "members": [
    "BG-040",
    "BG-041",
    "BG-042",
    "BG-043"
   ],
   "muted": true,
   "history": [
    {
     "dir": "in",
     "sender": "박종석",
     "body": "이번 주 토요일 2시 교대 바꿀 사람?",
     "at": "2025-01-20T07:14:53+09:00",
     "day": "1/20",
     "time": "07:14"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "저 화요일 대타 가능해요",
     "at": "2025-01-29T16:30:12+09:00",
     "day": "1/29",
     "time": "16:30"
    },
    {
     "dir": "in",
     "sender": "정다은",
     "body": "오늘 재고 정리 끝냈습니다",
     "at": "2025-02-17T08:52:36+09:00",
     "day": "2/17",
     "time": "08:52"
    },
    {
     "dir": "in",
     "sender": "김우진",
     "body": "마감하고 나왔어요",
     "at": "2025-03-04T19:28:19+09:00",
     "day": "3/4",
     "time": "19:28"
    },
    {
     "dir": "in",
     "sender": "박종석",
     "body": "냉장고 온도 확인 부탁해요",
     "at": "2025-04-08T17:00:34+09:00",
     "day": "4/8",
     "time": "17:00"
    },
    {
     "dir": "in",
     "sender": "박종석",
     "body": "내일 야간 대타 가능한 사람?",
     "at": "2025-04-13T00:55:20+09:00",
     "day": "4/13",
     "time": "00:55"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "제가 가능해요",
     "at": "2025-04-13T21:45:45+09:00",
     "day": "4/13",
     "time": "21:45"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "폐기 처리 했어요",
     "at": "2025-05-09T13:20:35+09:00",
     "day": "5/9",
     "time": "13:20"
    },
    {
     "dir": "in",
     "sender": "정다은",
     "body": "진열대 정리 중입니다",
     "at": "2025-06-11T01:43:16+09:00",
     "day": "6/11",
     "time": "01:43"
    },
    {
     "dir": "in",
     "sender": "김우진",
     "body": "손님 많아서 늦었어요",
     "at": "2025-06-13T01:19:21+09:00",
     "day": "6/13",
     "time": "01:19"
    },
    {
     "dir": "in",
     "sender": "박종석",
     "body": "다음 주 스케줄 올렸습니다",
     "at": "2025-06-16T16:19:45+09:00",
     "day": "6/16",
     "time": "16:19"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "금요일 야간 가능합니다",
     "at": "2025-07-18T01:49:28+09:00",
     "day": "7/18",
     "time": "01:49"
    },
    {
     "dir": "in",
     "sender": "정다은",
     "body": "택배 왔어요",
     "at": "2025-07-19T17:05:15+09:00",
     "day": "7/19",
     "time": "17:05"
    },
    {
     "dir": "in",
     "sender": "김우진",
     "body": "발주서 작성했어요",
     "at": "2025-07-23T15:45:27+09:00",
     "day": "7/23",
     "time": "15:45"
    },
    {
     "dir": "in",
     "sender": "박종석",
     "body": "야간 교대 구합니다",
     "at": "2025-07-25T16:37:08+09:00",
     "day": "7/25",
     "time": "16:37"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "제가 할게요",
     "at": "2025-08-06T09:31:12+09:00",
     "day": "8/6",
     "time": "09:31"
    },
    {
     "dir": "in",
     "sender": "정다은",
     "body": "알바비 들어왔나요?",
     "at": "2025-08-12T04:26:37+09:00",
     "day": "8/12",
     "time": "04:26"
    },
    {
     "dir": "in",
     "sender": "김우진",
     "body": "오늘 마감 조용했습니다",
     "at": "2025-08-18T20:59:32+09:00",
     "day": "8/18",
     "time": "20:59"
    },
    {
     "dir": "in",
     "sender": "정다은",
     "body": "재고 수량 맞는지 확인해줄 수 있어요?",
     "at": "2025-08-30T02:31:08+09:00",
     "day": "8/30",
     "time": "02:31"
    },
    {
     "dir": "in",
     "sender": "김우진",
     "body": "제가 다시 세볼게요",
     "at": "2025-08-30T16:16:38+09:00",
     "day": "8/30",
     "time": "16:16"
    },
    {
     "dir": "in",
     "sender": "박종석",
     "body": "주말에 재고 조사 있습니다",
     "at": "2025-09-11T20:26:05+09:00",
     "day": "9/11",
     "time": "20:26"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "토요일 오전 가능해요",
     "at": "2025-09-16T21:20:38+09:00",
     "day": "9/16",
     "time": "21:20"
    },
    {
     "dir": "in",
     "sender": "정다은",
     "body": "냉동고 정리했어요",
     "at": "2025-10-11T23:51:41+09:00",
     "day": "10/11",
     "time": "23:51"
    },
    {
     "dir": "in",
     "sender": "김우진",
     "body": "교대 시간 확인 부탁드려요",
     "at": "2025-11-04T20:17:08+09:00",
     "day": "11/4",
     "time": "20:17"
    },
    {
     "dir": "in",
     "sender": "박종석",
     "body": "다들 수고했어요",
     "at": "2025-11-07T07:56:04+09:00",
     "day": "11/7",
     "time": "07:56"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "다음 주 대타 가능한 날 알려드릴게요",
     "at": "2025-11-09T15:48:21+09:00",
     "day": "11/9",
     "time": "15:48"
    },
    {
     "dir": "in",
     "sender": "정다은",
     "body": "손님이 물건 찾으셔서 안내했어요",
     "at": "2026-01-20T07:26:40+09:00",
     "day": "1/20",
     "time": "07:26"
    },
    {
     "dir": "in",
     "sender": "김우진",
     "body": "진열 마무리했습니다",
     "at": "2026-02-11T13:37:35+09:00",
     "day": "2/11",
     "time": "13:37"
    }
   ]
  },
  {
   "id": "talk.dm.01",
   "name": "조현우",
   "type": "1:1",
   "circle": "성원고 동창",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-003"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "조현우",
     "body": "오늘 야자 끝나고 시간 돼?",
     "at": "2025-09-10T11:40:46+09:00",
     "day": "9/10",
     "time": "11:40"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "나 조금 늦을 것 같아",
     "at": "2025-09-16T04:49:40+09:00",
     "day": "9/16",
     "time": "04:49"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "먼저 가 있어도 돼",
     "at": "2025-09-28T18:58:57+09:00",
     "day": "9/28",
     "time": "18:58"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "어제 시험 어땠어?",
     "at": "2025-09-30T14:26:42+09:00",
     "day": "9/30",
     "time": "14:26"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나쁘지 않았어, 너는?",
     "at": "2025-10-11T09:12:17+09:00",
     "day": "10/11",
     "time": "09:12"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "나는 수학에서 좀 틀렸어",
     "at": "2025-11-13T15:01:45+09:00",
     "day": "11/13",
     "time": "15:01"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "주말에 밥 먹자",
     "at": "2025-11-20T12:19:56+09:00",
     "day": "11/20",
     "time": "12:19"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "토요일 저녁 어때?",
     "at": "2025-12-12T02:40:03+09:00",
     "day": "12/12",
     "time": "02:40"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "좋으면 연락해",
     "at": "2026-01-12T17:11:43+09:00",
     "day": "1/12",
     "time": "17:11"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아, 토요일 저녁에 보자",
     "at": "2026-01-26T08:24:10+09:00",
     "day": "1/26",
     "time": "08:24"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나 조금 늦을 수도 있어",
     "at": "2026-02-27T03:14:06+09:00",
     "day": "2/27",
     "time": "03:14"
    }
   ]
  },
  {
   "id": "talk.dm.02",
   "name": "윤서진",
   "type": "1:1",
   "circle": "성원고 동창",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-004"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "오늘 학원 끝나고 커피 한 잔?",
     "at": "2025-09-23T07:23:55+09:00",
     "day": "9/23",
     "time": "07:23"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "나 9시에 끝나",
     "at": "2025-09-29T13:38:35+09:00",
     "day": "9/29",
     "time": "13:38"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "시간 되면 9시 20분에 보자",
     "at": "2025-09-30T10:38:44+09:00",
     "day": "9/30",
     "time": "10:38"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "오늘 너무 졸려",
     "at": "2025-10-02T23:53:36+09:00",
     "day": "10/2",
     "time": "23:53"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "커피 마셔도 졸려",
     "at": "2025-10-20T02:06:00+09:00",
     "day": "10/20",
     "time": "02:06"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "그럼 오늘은 일찍 자",
     "at": "2025-12-09T14:13:32+09:00",
     "day": "12/9",
     "time": "14:13"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "내일은 몇 시에 끝나?",
     "at": "2025-12-16T00:21:59+09:00",
     "day": "12/16",
     "time": "00:21"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "나는 4시 30분이면 돼",
     "at": "2026-01-14T09:35:06+09:00",
     "day": "1/14",
     "time": "09:35"
    }
   ]
  },
  {
   "id": "talk.dm.03",
   "name": "임동현",
   "type": "1:1",
   "circle": "성원고 동창",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-005"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "임동현",
     "body": "토요일 저녁 시간 어때?",
     "at": "2025-09-11T20:14:38+09:00",
     "day": "9/11",
     "time": "20:14"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아, 나는 된다",
     "at": "2025-09-17T17:49:26+09:00",
     "day": "9/17",
     "time": "17:49"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "입대 날짜 나왔다",
     "at": "2025-09-19T21:30:49+09:00",
     "day": "9/19",
     "time": "21:30"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "다음 달 14일이야",
     "at": "2025-09-27T05:32:36+09:00",
     "day": "9/27",
     "time": "05:32"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "생각보다 빨리 왔네",
     "at": "2025-10-03T18:01:46+09:00",
     "day": "10/3",
     "time": "18:01"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "그날 전에 한 번 보자",
     "at": "2025-10-29T23:53:30+09:00",
     "day": "10/29",
     "time": "23:53"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "고마워",
     "at": "2025-11-07T09:15:39+09:00",
     "day": "11/7",
     "time": "09:15"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "훈련소 가면 연락할게",
     "at": "2025-11-28T11:19:56+09:00",
     "day": "11/28",
     "time": "11:19"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "힘내",
     "at": "2025-12-22T22:12:35+09:00",
     "day": "12/22",
     "time": "22:12"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "편지 보낼게",
     "at": "2026-02-06T08:14:30+09:00",
     "day": "2/6",
     "time": "08:14"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "주소 알려줘",
     "at": "2026-02-08T09:37:54+09:00",
     "day": "2/8",
     "time": "09:37"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "단톡에 올릴게",
     "at": "2026-02-10T10:38:04+09:00",
     "day": "2/10",
     "time": "10:38"
    }
   ]
  },
  {
   "id": "talk.dm.04",
   "name": "홍예슬",
   "type": "1:1",
   "circle": "성원고 동창",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-006"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "out",
     "sender": "나",
     "body": "이따 봐",
     "at": "2025-09-23T07:08:55+09:00",
     "day": "9/23",
     "time": "07:08"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나 조금 늦어",
     "at": "2025-10-02T14:32:02+09:00",
     "day": "10/2",
     "time": "14:32"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "괜찮아, 천천히 와",
     "at": "2025-10-21T18:44:56+09:00",
     "day": "10/21",
     "time": "18:44"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "확인했어",
     "at": "2025-11-20T06:02:39+09:00",
     "day": "11/20",
     "time": "06:02"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오늘 알바 몇 시에 끝나?",
     "at": "2025-11-27T13:30:59+09:00",
     "day": "11/27",
     "time": "13:30"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "10시",
     "at": "2025-12-21T20:52:24+09:00",
     "day": "12/21",
     "time": "20:52"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "그럼 10시 10분에 보자",
     "at": "2026-01-11T00:57:14+09:00",
     "day": "1/11",
     "time": "00:57"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "좋아",
     "at": "2026-02-16T20:45:09+09:00",
     "day": "2/16",
     "time": "20:45"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "비 와서 우산 챙겨",
     "at": "2026-02-18T05:30:44+09:00",
     "day": "2/18",
     "time": "05:30"
    }
   ]
  },
  {
   "id": "talk.dm.05",
   "name": "배승우",
   "type": "1:1",
   "circle": "성원고 동창",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-007"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "배승우",
     "body": "이번 주 풋살 갈 거야?",
     "at": "2025-10-12T18:27:36+09:00",
     "day": "10/12",
     "time": "18:27"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "토요일 8시야",
     "at": "2025-10-18T07:31:12+09:00",
     "day": "10/18",
     "time": "07:31"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "축구화 챙겨",
     "at": "2025-10-18T12:17:12+09:00",
     "day": "10/18",
     "time": "12:17"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "나 조금 늦게 갈 수도 있어",
     "at": "2025-10-23T17:05:34+09:00",
     "day": "10/23",
     "time": "17:05"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "먼저 가 있어",
     "at": "2025-11-14T02:24:24+09:00",
     "day": "11/14",
     "time": "02:24"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "오늘 경기 재밌었지?",
     "at": "2025-11-21T02:01:34+09:00",
     "day": "11/21",
     "time": "02:01"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나도 재밌었어",
     "at": "2025-12-20T19:23:56+09:00",
     "day": "12/20",
     "time": "19:23"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "다음 주에도 하자",
     "at": "2025-12-27T06:16:48+09:00",
     "day": "12/27",
     "time": "06:16"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아",
     "at": "2026-01-04T20:01:55+09:00",
     "day": "1/4",
     "time": "20:01"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "회비 보냈어",
     "at": "2026-01-24T07:35:54+09:00",
     "day": "1/24",
     "time": "07:35"
    },
    {
     "dir": "in",
     "sender": "배승우",
     "body": "확인했음",
     "at": "2026-03-06T20:46:36+09:00",
     "day": "3/6",
     "time": "20:46"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고맙게 잘 받았어",
     "at": "2026-03-11T19:31:23+09:00",
     "day": "3/11",
     "time": "19:31"
    }
   ]
  },
  {
   "id": "talk.dm.06",
   "name": "김민서",
   "type": "1:1",
   "circle": "한서대 경영 26 동기",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-016"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "김민서",
     "body": "수강신청 했어?",
     "at": "2025-10-04T17:40:51+09:00",
     "day": "10/4",
     "time": "17:40"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "응 다 했어",
     "at": "2025-10-10T10:16:03+09:00",
     "day": "10/10",
     "time": "10:16"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나는 하나 실패했어 ㅠ",
     "at": "2025-10-20T19:30:14+09:00",
     "day": "10/20",
     "time": "19:30"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "아쉽다",
     "at": "2025-10-28T00:01:33+09:00",
     "day": "10/28",
     "time": "00:01"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "다음 학기에 다시 하면 돼",
     "at": "2025-11-25T11:04:21+09:00",
     "day": "11/25",
     "time": "11:04"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오늘 과제 같이 할래?",
     "at": "2025-12-02T07:04:23+09:00",
     "day": "12/2",
     "time": "07:04"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "도서관에 있을게",
     "at": "2025-12-08T05:25:46+09:00",
     "day": "12/8",
     "time": "05:25"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "몇 시에 갈까?",
     "at": "2025-12-17T04:31:06+09:00",
     "day": "12/17",
     "time": "04:31"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나 6시에 갈게",
     "at": "2026-01-08T15:29:12+09:00",
     "day": "1/8",
     "time": "15:29"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나도 6시에 갈게",
     "at": "2026-01-28T16:15:53+09:00",
     "day": "1/28",
     "time": "16:15"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "자리 잡아둘게",
     "at": "2026-02-05T13:04:48+09:00",
     "day": "2/5",
     "time": "13:04"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "조금 늦을 수도 있어",
     "at": "2026-02-15T04:53:21+09:00",
     "day": "2/15",
     "time": "04:53"
    }
   ]
  },
  {
   "id": "talk.dm.07",
   "name": "최준",
   "type": "1:1",
   "circle": "한서대 경영 26 동기",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-017"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "최준",
     "body": "내일 1교시 갈 거야?",
     "at": "2025-09-12T07:13:40+09:00",
     "day": "9/12",
     "time": "07:13"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "나는 갈 거야",
     "at": "2025-09-24T10:55:17+09:00",
     "day": "9/24",
     "time": "10:55"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "너는?",
     "at": "2025-11-07T00:06:41+09:00",
     "day": "11/7",
     "time": "00:06"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나도 갈게",
     "at": "2025-11-07T13:00:44+09:00",
     "day": "11/7",
     "time": "13:00"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "과방에서 보자",
     "at": "2025-11-08T05:53:13+09:00",
     "day": "11/8",
     "time": "05:53"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아 그렇게 하자",
     "at": "2025-12-06T07:33:44+09:00",
     "day": "12/6",
     "time": "07:33"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "오늘 과제 했어?",
     "at": "2025-12-18T05:08:52+09:00",
     "day": "12/18",
     "time": "05:08"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "나는 아직",
     "at": "2026-01-19T08:34:38+09:00",
     "day": "1/19",
     "time": "08:34"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "밤에 같이 하자",
     "at": "2026-01-27T00:33:12+09:00",
     "day": "1/27",
     "time": "00:33"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "도서관 2층에서 보자",
     "at": "2026-02-08T09:31:15+09:00",
     "day": "2/8",
     "time": "09:31"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "나 졸려 죽겠음",
     "at": "2026-02-24T18:29:34+09:00",
     "day": "2/24",
     "time": "18:29"
    }
   ]
  },
  {
   "id": "talk.dm.08",
   "name": "박하늘",
   "type": "1:1",
   "circle": "한서대 경영 26 동기",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-018"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "out",
     "sender": "나",
     "body": "오케이",
     "at": "2025-09-28T12:52:43+09:00",
     "day": "9/28",
     "time": "12:52"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "정말 고마워",
     "at": "2025-10-23T03:14:02+09:00",
     "day": "10/23",
     "time": "03:14"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오늘 늦을 것 같아",
     "at": "2025-11-03T18:34:27+09:00",
     "day": "11/3",
     "time": "18:34"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "먼저 가",
     "at": "2025-11-08T14:20:16+09:00",
     "day": "11/8",
     "time": "14:20"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "내일 보자",
     "at": "2025-12-13T23:42:27+09:00",
     "day": "12/13",
     "time": "23:42"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋다",
     "at": "2025-12-21T22:14:36+09:00",
     "day": "12/21",
     "time": "22:14"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "과제 자료 찾았어?",
     "at": "2025-12-26T19:41:38+09:00",
     "day": "12/26",
     "time": "19:41"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "응 찾았어",
     "at": "2025-12-30T11:15:47+09:00",
     "day": "12/30",
     "time": "11:15"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "같이 볼래?",
     "at": "2026-03-01T10:46:10+09:00",
     "day": "3/1",
     "time": "10:46"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아, 도서관에서 보자",
     "at": "2026-03-05T00:54:03+09:00",
     "day": "3/5",
     "time": "00:54"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "나 지금 도서관이야",
     "at": "2026-03-12T22:45:36+09:00",
     "day": "3/12",
     "time": "22:45"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "2층 창가 자리",
     "at": "2026-03-13T16:45:47+09:00",
     "day": "3/13",
     "time": "16:45"
    }
   ]
  },
  {
   "id": "talk.dm.09",
   "name": "이유나",
   "type": "1:1",
   "circle": "한서대 경영 26 동기",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-019"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "이유나",
     "body": "발표 준비 어디까지 했어?",
     "at": "2025-09-16T22:00:03+09:00",
     "day": "9/16",
     "time": "22:00"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "나는 슬라이드 1~4장 했어",
     "at": "2025-09-29T05:26:56+09:00",
     "day": "9/29",
     "time": "05:26"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "자료조사는 내가 할게",
     "at": "2025-10-09T23:52:00+09:00",
     "day": "10/9",
     "time": "23:52"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "오늘 밤까지 보낼 수 있어",
     "at": "2025-11-01T09:59:25+09:00",
     "day": "11/1",
     "time": "09:59"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "방금 확인했어",
     "at": "2025-11-03T07:47:39+09:00",
     "day": "11/3",
     "time": "07:47"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "발표는 내가 할게",
     "at": "2025-11-04T05:13:10+09:00",
     "day": "11/4",
     "time": "05:13"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "천천히 해도 돼",
     "at": "2025-11-09T00:59:07+09:00",
     "day": "11/9",
     "time": "00:59"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "리허설은 언제 할까?",
     "at": "2025-12-03T19:01:24+09:00",
     "day": "12/3",
     "time": "19:01"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "내일 저녁 어때?",
     "at": "2025-12-07T12:16:25+09:00",
     "day": "12/7",
     "time": "12:16"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "그럼 내일 저녁 8시에 보자",
     "at": "2025-12-28T07:09:48+09:00",
     "day": "12/28",
     "time": "07:09"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "좋아, 그때 보자",
     "at": "2026-02-07T08:50:06+09:00",
     "day": "2/7",
     "time": "08:50"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나 조금 늦어",
     "at": "2026-02-14T22:12:56+09:00",
     "day": "2/14",
     "time": "22:12"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "괜찮아, 기다릴게",
     "at": "2026-03-13T22:46:00+09:00",
     "day": "3/13",
     "time": "22:46"
    }
   ]
  },
  {
   "id": "talk.dm.10",
   "name": "수아",
   "type": "1:1",
   "circle": "서아·영상과",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-029"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "out",
     "sender": "나",
     "body": "그래",
     "at": "2025-09-05T00:39:54+09:00",
     "day": "9/5",
     "time": "00:39"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오늘 촬영 몇 시야?",
     "at": "2025-09-12T15:31:25+09:00",
     "day": "9/12",
     "time": "15:31"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "2시야",
     "at": "2025-09-17T10:51:37+09:00",
     "day": "9/17",
     "time": "10:51"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "장비 챙겼어?",
     "at": "2025-10-01T14:52:18+09:00",
     "day": "10/1",
     "time": "14:52"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "응 다 챙겼어",
     "at": "2025-10-20T20:15:28+09:00",
     "day": "10/20",
     "time": "20:15"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "조명도 챙길까?",
     "at": "2025-10-26T05:26:10+09:00",
     "day": "10/26",
     "time": "05:26"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "조명은 내가 챙길게",
     "at": "2025-10-26T11:10:58+09:00",
     "day": "10/26",
     "time": "11:10"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오케이 좋아",
     "at": "2025-10-28T16:40:07+09:00",
     "day": "10/28",
     "time": "16:40"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "이따 보자",
     "at": "2025-11-13T17:30:38+09:00",
     "day": "11/13",
     "time": "17:30"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나 조금 늦을 듯",
     "at": "2025-12-22T02:08:24+09:00",
     "day": "12/22",
     "time": "02:08"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "먼저 준비하고 있어",
     "at": "2025-12-26T23:58:37+09:00",
     "day": "12/26",
     "time": "23:58"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고생했어",
     "at": "2026-02-21T08:26:39+09:00",
     "day": "2/21",
     "time": "08:26"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "상영회 준비 잘 되고 있어",
     "at": "2026-03-06T21:04:07+09:00",
     "day": "3/6",
     "time": "21:04"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "편집도 거의 끝났어",
     "at": "2026-03-09T11:37:57+09:00",
     "day": "3/9",
     "time": "11:37"
    }
   ]
  },
  {
   "id": "talk.dm.11",
   "name": "재현",
   "type": "1:1",
   "circle": "서아·영상과",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-030"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "out",
     "sender": "나",
     "body": "조금 늦어",
     "at": "2025-09-20T12:00:28+09:00",
     "day": "9/20",
     "time": "12:00"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "조금 있다 봐",
     "at": "2025-10-22T03:03:58+09:00",
     "day": "10/22",
     "time": "03:03"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "그래 좋아",
     "at": "2025-11-11T23:26:17+09:00",
     "day": "11/11",
     "time": "23:26"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오늘 편집 어디까지 했어?",
     "at": "2025-11-29T12:38:54+09:00",
     "day": "11/29",
     "time": "12:38"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "러프컷까지 했어",
     "at": "2026-01-17T20:51:51+09:00",
     "day": "1/17",
     "time": "20:51"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "색보정은 내일 할게",
     "at": "2026-01-23T00:35:38+09:00",
     "day": "1/23",
     "time": "00:35"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아, 고마워",
     "at": "2026-02-05T07:36:10+09:00",
     "day": "2/5",
     "time": "07:36"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "나중에 보자",
     "at": "2026-02-27T02:11:37+09:00",
     "day": "2/27",
     "time": "02:11"
    }
   ]
  },
  {
   "id": "talk.dm.12",
   "name": "이수빈",
   "type": "1:1",
   "circle": "지난 알바",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-041"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "이번 주 대타 가능?",
     "at": "2025-09-03T10:46:04+09:00",
     "day": "9/3",
     "time": "10:46"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "화요일 야간이야",
     "at": "2025-09-09T15:01:18+09:00",
     "day": "9/9",
     "time": "15:01"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "내가 그날 시험 때문에 안 돼",
     "at": "2025-09-24T02:11:44+09:00",
     "day": "9/24",
     "time": "02:11"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "혹시 수요일은 어때?",
     "at": "2025-09-29T10:47:32+09:00",
     "day": "9/29",
     "time": "10:47"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "수요일이면 나는 가능해",
     "at": "2025-12-28T08:27:52+09:00",
     "day": "12/28",
     "time": "08:27"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고마워 진짜",
     "at": "2026-01-12T03:58:37+09:00",
     "day": "1/12",
     "time": "03:58"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "스케줄 확인했어",
     "at": "2026-01-25T05:26:59+09:00",
     "day": "1/25",
     "time": "05:26"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나도 확인했어",
     "at": "2026-02-14T23:36:44+09:00",
     "day": "2/14",
     "time": "23:36"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "점장님께 말할게",
     "at": "2026-02-28T01:40:42+09:00",
     "day": "2/28",
     "time": "01:40"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "확인했다고 해",
     "at": "2026-03-05T06:47:32+09:00",
     "day": "3/5",
     "time": "06:47"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고맙게 잘 쓸게",
     "at": "2026-03-12T11:56:01+09:00",
     "day": "3/12",
     "time": "11:56"
    }
   ]
  },
  {
   "id": "talk.dm.13",
   "name": "송민호",
   "type": "1:1",
   "circle": "학원·선생님",
   "count": 2,
   "memberCount": 2,
   "members": [
    "BG-044"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "송민호",
     "body": "도현아, 오늘 상담 가능하니?",
     "at": "2025-09-21T01:13:49+09:00",
     "day": "9/21",
     "time": "01:13"
    },
    {
     "dir": "in",
     "sender": "송민호",
     "body": "몇 시에 올 수 있어?",
     "at": "2025-09-23T13:11:09+09:00",
     "day": "9/23",
     "time": "13:11"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "네, 4시쯤 갈 수 있어요",
     "at": "2025-11-09T10:31:01+09:00",
     "day": "11/9",
     "time": "10:31"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "교무실로 가면 될까요?",
     "at": "2025-11-17T01:04:00+09:00",
     "day": "11/17",
     "time": "01:04"
    },
    {
     "dir": "in",
     "sender": "송민호",
     "body": "그럼 4시에 교무실로 오세요",
     "at": "2025-12-04T15:25:50+09:00",
     "day": "12/4",
     "time": "15:25"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "감사합니다",
     "at": "2025-12-08T23:27:24+09:00",
     "day": "12/8",
     "time": "23:27"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "요즘 진로 고민이 있어서요",
     "at": "2025-12-21T23:17:17+09:00",
     "day": "12/21",
     "time": "23:17"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "천천히 이야기해 주세요",
     "at": "2025-12-29T17:22:07+09:00",
     "day": "12/29",
     "time": "17:22"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "네",
     "at": "2026-01-25T22:22:56+09:00",
     "day": "1/25",
     "time": "22:22"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "그럼 오늘 4시에 뵙겠습니다",
     "at": "2026-02-27T16:19:06+09:00",
     "day": "2/27",
     "time": "16:19"
    },
    {
     "dir": "in",
     "sender": "송민호",
     "body": "네, 조심히 오세요",
     "at": "2026-03-04T12:27:15+09:00",
     "day": "3/4",
     "time": "12:27"
    }
   ]
  }
 ],
 "loopAccounts": [
  {
   "id": "LBG-001",
   "handle": "minseo.kim",
   "displayName": "김민서",
   "name": "김민서",
   "bio": "경영 26 · 요즘 학교 적응 중",
   "circle": "한서대 경영 26 동기",
   "followsDohyun": true,
   "followers": 420,
   "personId": "BG-016"
  },
  {
   "id": "LBG-002",
   "handle": "jun.choi",
   "displayName": "최준",
   "name": "최준",
   "bio": "경영 26 · 농구 동아리",
   "circle": "한서대 경영 26 동기",
   "followsDohyun": true,
   "followers": 310,
   "personId": "BG-017"
  },
  {
   "id": "LBG-003",
   "handle": "haneul.park",
   "displayName": "박하늘",
   "name": "박하늘",
   "bio": "한서대 경영학과 26",
   "circle": "한서대 경영 26 동기",
   "followsDohyun": false,
   "followers": 280,
   "personId": "BG-018"
  },
  {
   "id": "LBG-004",
   "handle": "yuna.lee",
   "displayName": "이유나",
   "name": "이유나",
   "bio": "새내기 · 카페 투어 중",
   "circle": "한서대 경영 26 동기",
   "followsDohyun": true,
   "followers": 360,
   "personId": "BG-019"
  },
  {
   "id": "LBG-005",
   "handle": "siwoo.jung",
   "displayName": "정시우",
   "name": "정시우",
   "bio": "경영 26 · 노래방 자주 감",
   "circle": "한서대 경영 26 동기",
   "followsDohyun": false,
   "followers": 190,
   "personId": "BG-020"
  },
  {
   "id": "LBG-006",
   "handle": "chaerin.oh",
   "displayName": "오채린",
   "name": "오채린",
   "bio": "한서대 26 · 과잠 수집",
   "circle": "한서대 경영 26 동기",
   "followsDohyun": true,
   "followers": 510,
   "personId": "BG-021"
  },
  {
   "id": "LBG-007",
   "handle": "doyoon.han",
   "displayName": "한도윤",
   "name": "한도윤",
   "bio": "경영 26 · 커피 없으면 못 삶",
   "circle": "한서대 경영 26 동기",
   "followsDohyun": false,
   "followers": 240,
   "personId": "BG-022"
  },
  {
   "id": "LBG-008",
   "handle": "eunbi.seo",
   "displayName": "서은비",
   "name": "서은비",
   "bio": "경영 26 · 오늘도 과제 중",
   "circle": "한서대 경영 26 동기",
   "followsDohyun": true,
   "followers": 340,
   "personId": "BG-023"
  },
  {
   "id": "LBG-009",
   "handle": "taeho.kang",
   "displayName": "강태호",
   "name": "강태호",
   "bio": "경영 26 · 풋살",
   "circle": "한서대 경영 26 동기",
   "followsDohyun": true,
   "followers": 450,
   "personId": "BG-024"
  },
  {
   "id": "LBG-010",
   "handle": "jiwon.moon",
   "displayName": "문지원",
   "name": "문지원",
   "bio": "한서대 경영 26",
   "circle": "한서대 경영 26 동기",
   "followsDohyun": false,
   "followers": 220,
   "personId": "BG-025"
  },
  {
   "id": "LBG-011",
   "handle": "hyunwoo.cho",
   "displayName": "조현우",
   "name": "조현우",
   "bio": "성원고 3-2 · 요즘 백수",
   "circle": "성원고 동창",
   "followsDohyun": true,
   "followers": 260,
   "personId": "BG-003"
  },
  {
   "id": "LBG-012",
   "handle": "seojin.yoon",
   "displayName": "윤서진",
   "name": "윤서진",
   "bio": "재수 중 · 하루하루 버티는 중",
   "circle": "성원고 동창",
   "followsDohyun": true,
   "followers": 170,
   "personId": "BG-004"
  },
  {
   "id": "LBG-013",
   "handle": "donghyun.lim",
   "displayName": "임동현",
   "name": "임동현",
   "bio": "입대 준비 · 날짜만 기다리는 중",
   "circle": "성원고 동창",
   "followsDohyun": true,
   "followers": 210,
   "personId": "BG-005"
  },
  {
   "id": "LBG-014",
   "handle": "yeseul.hong",
   "displayName": "홍예슬",
   "name": "홍예슬",
   "bio": "알바 중 · 주말이 없음",
   "circle": "성원고 동창",
   "followsDohyun": false,
   "followers": 300,
   "personId": "BG-006"
  },
  {
   "id": "LBG-015",
   "handle": "seungwoo.bae",
   "displayName": "배승우",
   "name": "배승우",
   "bio": "성원고 동창 · 축구",
   "circle": "성원고 동창",
   "followsDohyun": true,
   "followers": 390,
   "personId": "BG-007"
  },
  {
   "id": "LBG-016",
   "handle": "soyeon.jang",
   "displayName": "장소연",
   "name": "장소연",
   "bio": "성원고 3-2 · 졸업 사진 보정 중",
   "circle": "성원고 동창",
   "followsDohyun": false,
   "followers": 240,
   "personId": "BG-008"
  },
  {
   "id": "LBG-017",
   "handle": "gunwoo.shin",
   "displayName": "신건우",
   "name": "신건우",
   "bio": "훈련소 앞 · 편지 기다림",
   "circle": "성원고 동창",
   "followsDohyun": true,
   "followers": 150,
   "personId": "BG-009"
  },
  {
   "id": "LBG-018",
   "handle": "nayoung.ko",
   "displayName": "고나영",
   "name": "고나영",
   "bio": "동네 친구 · 산책 좋아함",
   "circle": "성원고 동창",
   "followsDohyun": false,
   "followers": 190,
   "personId": "BG-010"
  },
  {
   "id": "LBG-019",
   "handle": "film.sua",
   "displayName": "수아",
   "name": "수아",
   "bio": "영상과 21 · 촬영",
   "circle": "서아의 영상과",
   "followsDohyun": true,
   "followers": 620,
   "personId": "BG-029"
  },
  {
   "id": "LBG-020",
   "handle": "cut.jaehyun",
   "displayName": "재현",
   "name": "재현",
   "bio": "촬영·편집 · 밤샘 전문",
   "circle": "서아의 영상과",
   "followsDohyun": true,
   "followers": 380,
   "personId": "BG-030"
  },
  {
   "id": "LBG-021",
   "handle": "frame.hana",
   "displayName": "하나",
   "name": "하나",
   "bio": "영상과 · 단편 준비 중",
   "circle": "서아의 영상과",
   "followsDohyun": false,
   "followers": 290,
   "personId": null
  },
  {
   "id": "LBG-022",
   "handle": "lens.minho",
   "displayName": "민호",
   "name": "민호",
   "bio": "단편영화 준비 중",
   "circle": "서아의 영상과",
   "followsDohyun": true,
   "followers": 340,
   "personId": null
  },
  {
   "id": "LBG-023",
   "handle": "seongwon.cafe",
   "displayName": "성원동 카페",
   "name": "성원동 카페",
   "bio": "성원동 골목 카페 · 오늘도 정상 영업",
   "circle": "동네·생활",
   "followsDohyun": true,
   "followers": 820,
   "personId": null
  },
  {
   "id": "LBG-024",
   "handle": "bunsik.house",
   "displayName": "성원 분식",
   "name": "성원 분식",
   "bio": "성원동 분식 · 밤 9시까지",
   "circle": "동네·생활",
   "followsDohyun": true,
   "followers": 610,
   "personId": null
  },
  {
   "id": "LBG-025",
   "handle": "fitness.seongwon",
   "displayName": "성원 헬스",
   "name": "성원 헬스",
   "bio": "성원동 헬스장 · 첫 달 등록 이벤트",
   "circle": "동네·생활",
   "followsDohyun": false,
   "followers": 540,
   "personId": null
  },
  {
   "id": "LBG-026",
   "handle": "laundry.seongwon",
   "displayName": "성원 세탁",
   "name": "성원 세탁",
   "bio": "세탁·수선 · 맡기고 다음 날 찾아가세요",
   "circle": "동네·생활",
   "followsDohyun": true,
   "followers": 260,
   "personId": null
  },
  {
   "id": "LBG-027",
   "handle": "daily.seongwon",
   "displayName": "성원동 생활",
   "name": "성원동 생활",
   "bio": "성원동 소식 · 동네 이모저모",
   "circle": "동네·생활",
   "followsDohyun": true,
   "followers": 1130,
   "personId": null
  },
  {
   "id": "LBG-028",
   "handle": "football.talk",
   "displayName": "축구 이야기",
   "name": "축구 이야기",
   "bio": "축구·전술 이야기 · 주말 경기 리뷰",
   "circle": "관심사",
   "followsDohyun": true,
   "followers": 2400,
   "personId": null
  },
  {
   "id": "LBG-029",
   "handle": "game.loop",
   "displayName": "게임 한 판",
   "name": "게임 한 판",
   "bio": "게임·리뷰 · 한 판만 더",
   "circle": "관심사",
   "followsDohyun": true,
   "followers": 3100,
   "personId": null
  },
  {
   "id": "LBG-030",
   "handle": "music.drawer",
   "displayName": "음악 서랍",
   "name": "음악 서랍",
   "bio": "오늘의 플레이리스트",
   "circle": "관심사",
   "followsDohyun": false,
   "followers": 1700,
   "personId": null
  },
  {
   "id": "LBG-031",
   "handle": "meme.box",
   "displayName": "밈 상자",
   "name": "밈 상자",
   "bio": "오늘의 밈 · 웃고 갑니다",
   "circle": "관심사",
   "followsDohyun": true,
   "followers": 5200,
   "personId": null
  },
  {
   "id": "LBG-032",
   "handle": "run.daily",
   "displayName": "러닝 기록",
   "name": "러닝 기록",
   "bio": "매일 5km · 기록 인증",
   "circle": "관심사",
   "followsDohyun": false,
   "followers": 980,
   "personId": null
  },
  {
   "id": "LBG-033",
   "handle": "hoops.log",
   "displayName": "농구 로그",
   "name": "농구 로그",
   "bio": "주말 농구 · 로그 남김",
   "circle": "관심사",
   "followsDohyun": false,
   "followers": 760,
   "personId": null
  },
  {
   "id": "LBG-034",
   "handle": "hanseo.student",
   "displayName": "한서대 총학생회",
   "name": "한서대 총학생회",
   "bio": "한서대학교 총학생회 공식",
   "circle": "학교·기관 공식",
   "followsDohyun": true,
   "followers": 4300,
   "personId": null
  },
  {
   "id": "LBG-035",
   "handle": "biz.hanseo",
   "displayName": "경영학과 학생회",
   "name": "경영학과 학생회",
   "bio": "한서대 경영학과 학생회",
   "circle": "학교·기관 공식",
   "followsDohyun": true,
   "followers": 1600,
   "personId": null
  },
  {
   "id": "LBG-036",
   "handle": "seongwon.youth",
   "displayName": "성원구 청년센터",
   "name": "성원구 청년센터",
   "bio": "성원구 청년센터 공식",
   "circle": "학교·기관 공식",
   "followsDohyun": false,
   "followers": 1200,
   "personId": null
  }
 ],
 "loopPosts": [
  {
   "id": "LBP-0001",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2025-03-03T14:28:00+09:00",
   "likes": 39,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2025-03-03T16:40:32.342093+09:00",
     "body": "화이팅"
    },
    {
     "author": "lens.minho",
     "createdAt": "2025-03-03T21:53:27.253828+09:00",
     "body": "몇 시까지 했어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#모의고사"
   ],
   "caption": "책상 정리하고 공부 시작",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0002",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2025-03-05T01:26:00+09:00",
   "likes": 35,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#고3",
    "#졸업"
   ],
   "body": "야자실 자리 뺏겼다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0003",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2025-03-05T08:13:00+09:00",
   "likes": 647,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2025-03-05T13:24:38.516650+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#오늘의밈",
    "#웃김"
   ],
   "body": "오늘의 밈: 아침에 일어났는데 이미 9시",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0004",
   "kind": "photo",
   "author": "seungwoo.bae",
   "createdAt": "2025-03-05T22:06:00+09:00",
   "likes": 16,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#성원고"
   ],
   "caption": "야자 자리",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0005",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2025-03-06T14:56:00+09:00",
   "likes": 10,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-03-06T16:26:03.092401+09:00",
     "body": "좋아요"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-03-06T17:16:11.838135+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#고3",
    "#졸업"
   ],
   "caption": "야자 끝나고 분식",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0006",
   "kind": "text",
   "author": "bunsik.house",
   "createdAt": "2025-03-07T01:43:00+09:00",
   "likes": 50,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2025-03-07T05:25:14.822478+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동분식",
    "#동네맛집",
    "#떡볶이"
   ],
   "body": "오늘 메뉴 준비 완료",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0007",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2025-03-14T01:59:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2025-03-14T03:04:55.856726+09:00",
     "body": "감성 좋다"
    },
    {
     "author": "music.drawer",
     "createdAt": "2025-03-14T10:03:59.903627+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#모의고사",
    "#입학준비"
   ],
   "caption": "야자 끝난 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0008",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2025-03-15T22:47:00+09:00",
   "likes": 35,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#입학준비"
   ],
   "body": "수시 결과 기다리는 중인데 하루가 안 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0009",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2025-03-20T01:42:00+09:00",
   "likes": 68,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네헬스",
    "#성원동헬스장"
   ],
   "caption": "이번 주 운동 시간 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "street",
     "palette": [
      "#d9d4cc",
      "#9d978d",
      "#4f4a44"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0010",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2025-03-22T22:27:00+09:00",
   "likes": 6,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#고3",
    "#수시"
   ],
   "caption": "야자 끝나고 친구랑 라면",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0011",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2025-03-26T23:26:00+09:00",
   "likes": 10,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2025-03-26T23:59:50.677528+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#고3",
    "#야자"
   ],
   "caption": "문제집 또 펴는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0012",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2025-03-29T17:47:00+09:00",
   "likes": 181,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임리뷰",
    "#패치"
   ],
   "body": "한 판만 하려다 세 판 했다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0013",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2025-04-01T18:44:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2025-04-01T19:38:02.932950+09:00",
     "body": "편집 화이팅"
    },
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-04-01T19:43:51.208175+09:00",
     "body": "상영회 언제야?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#촬영"
   ],
   "caption": "오늘 촬영 끝",
   "media": [
    {
     "kind": "photo",
     "scene": "film",
     "palette": [
      "#3c3a44",
      "#76717f",
      "#17161b"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0014",
   "kind": "text",
   "author": "jun.choi",
   "createdAt": "2025-04-02T00:24:00+09:00",
   "likes": 41,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#수시",
    "#입학준비"
   ],
   "body": "수시 결과 기다리는 중인데 하루가 안 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0015",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2025-04-02T22:59:00+09:00",
   "likes": 41,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#영상과"
   ],
   "caption": "영화 관련 책 읽는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0016",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2025-04-07T11:33:00+09:00",
   "likes": 23,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2025-04-07T19:45:27.338765+09:00",
     "body": "감성 좋다"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-04-07T21:08:08.020149+09:00",
     "body": "좋아요"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2025-04-08T07:54:14.402752+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#세탁",
    "#동네가게"
   ],
   "caption": "오늘 맡긴 옷은 내일 찾아가세요",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 세탁소"
  },
  {
   "id": "LBP-0017",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2025-04-09T22:14:00+09:00",
   "likes": 287,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경기리뷰",
    "#주말축구"
   ],
   "body": "주말 경기 리뷰 올립니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0018",
   "kind": "text",
   "author": "cut.jaehyun",
   "createdAt": "2025-04-17T01:00:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-04-17T05:33:31.796790+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과",
    "#편집"
   ],
   "body": "편집 끝",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0019",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2025-04-17T17:26:00+09:00",
   "likes": 112,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2025-04-17T21:22:10.869359+09:00",
     "body": "이거 뭐야"
    },
    {
     "author": "game.loop",
     "createdAt": "2025-04-18T05:04:57.426210+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#기록",
    "#러닝",
    "#성원천"
   ],
   "body": "오늘 5km 완료",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0020",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2025-04-18T23:07:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2025-04-18T23:33:52.201657+09:00",
     "body": "공감"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2025-04-19T17:26:11.221736+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#성원고"
   ],
   "body": "야자실 자리 뺏겼다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0021",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2025-04-22T22:10:00+09:00",
   "likes": 33,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2025-04-23T02:17:08.624166+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#수시",
    "#야자"
   ],
   "caption": "문제집 또 펴는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0022",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2025-04-23T23:11:00+09:00",
   "likes": 299,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#캠퍼스",
    "#공지"
   ],
   "caption": "개강 주간 행사 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "campus",
     "palette": [
      "#cfd9e6",
      "#8ea6bd",
      "#3d566e"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0023",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2025-05-02T00:49:00+09:00",
   "likes": 87,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2025-05-02T00:55:51.308001+09:00",
     "body": "좋아요"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-05-02T15:59:30.737758+09:00",
     "body": "몇 km 뛰었어?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말농구",
    "#농구"
   ],
   "caption": "농구 대신 러닝",
   "media": [
    {
     "kind": "photo",
     "scene": "run",
     "palette": [
      "#dbe9db",
      "#91b98f",
      "#3f5f3d"
     ]
    }
   ],
   "place": "성원천 운동장"
  },
  {
   "id": "LBP-0024",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2025-05-06T09:10:00+09:00",
   "likes": 15,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#졸업",
    "#성원고"
   ],
   "caption": "하교길 하늘",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0025",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2025-05-08T01:08:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2025-05-08T01:24:58.787796+09:00",
     "body": "야경 예쁘다"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2025-05-08T03:36:30.309363+09:00",
     "body": "밤에 뭐 해?"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-05-08T05:56:00.489264+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#수시"
   ],
   "caption": "야자 끝나고 집 가는 길",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0026",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2025-05-12T23:49:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-05-13T02:38:15.265884+09:00",
     "body": "좋아요"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2025-05-13T18:54:22.925871+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네카페",
    "#커피",
    "#성원동카페"
   ],
   "caption": "오늘의 원두 소개합니다",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0027",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2025-05-19T17:01:00+09:00",
   "likes": 77,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2025-05-19T21:14:46.991991+09:00",
     "body": "좋아요"
    },
    {
     "author": "football.talk",
     "createdAt": "2025-05-20T08:48:38.445123+09:00",
     "body": "멋지네요"
    },
    {
     "author": "hoops.log",
     "createdAt": "2025-05-20T09:33:29.187073+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#플레이리스트",
    "#오늘의노래"
   ],
   "body": "오늘의 플레이리스트: 밤 산책",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0028",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2025-05-21T01:38:00+09:00",
   "likes": 142,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#프로그램",
    "#공지",
    "#성원구"
   ],
   "caption": "청년 프로그램 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "market",
     "palette": [
      "#efe8d8",
      "#cbb78f",
      "#67583a"
     ]
    }
   ],
   "place": "성원구 청년센터"
  },
  {
   "id": "LBP-0029",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2025-05-21T19:10:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-05-22T08:17:40.650956+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#입학준비"
   ],
   "body": "수시 결과 기다리는 중인데 하루가 안 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0030",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2025-05-23T22:18:00+09:00",
   "likes": 70,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-05-24T03:17:49.907712+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영학과",
    "#공지"
   ],
   "body": "이번 달 학과 일정 안내드립니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0031",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2025-05-23T23:11:00+09:00",
   "likes": 61,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-05-24T02:22:48.905441+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원천",
    "#동네소식"
   ],
   "caption": "성원동 골목 소식",
   "media": [
    {
     "kind": "photo",
     "scene": "flowers",
     "palette": [
      "#f6e3ea",
      "#dca9bd",
      "#7a4b5d"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0032",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2025-05-26T18:39:00+09:00",
   "likes": 21,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#졸업"
   ],
   "caption": "체육 시간 농구",
   "media": [
    {
     "kind": "photo",
     "scene": "court",
     "palette": [
      "#e8d9c8",
      "#bd9871",
      "#5f4630"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0033",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2025-06-03T22:42:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2025-06-04T19:21:07.123785+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#수시",
    "#야자"
   ],
   "caption": "야자 끝나고 친구랑 라면",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0034",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2025-06-06T00:00:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2025-06-06T07:39:21.756264+09:00",
     "body": "힘내"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2025-06-07T03:38:40.655063+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#야자"
   ],
   "body": "수시 결과 기다리는 중인데 하루가 안 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0035",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2025-06-14T19:52:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2025-06-14T21:35:35.970492+09:00",
     "body": "운동 화이팅"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#입학준비",
    "#새내기"
   ],
   "caption": "체력 관리 시작",
   "media": [
    {
     "kind": "photo",
     "scene": "gym",
     "palette": [
      "#dedede",
      "#a5a5a5",
      "#4a4a4a"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0036",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2025-06-17T23:52:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2025-06-18T00:00:43.678016+09:00",
     "body": "촬영 잘 됐어?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#필름",
    "#상영회",
    "#영상과"
   ],
   "caption": "오늘 촬영 장비 점검",
   "media": [
    {
     "kind": "photo",
     "scene": "camera",
     "palette": [
      "#dfe3e7",
      "#9aa4ad",
      "#3d454c"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0037",
   "kind": "text",
   "author": "yuna.lee",
   "createdAt": "2025-06-19T00:09:00+09:00",
   "likes": 27,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#새내기",
    "#야자"
   ],
   "body": "수시 결과 기다리는 중인데 하루가 안 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0038",
   "kind": "text",
   "author": "haneul.park",
   "createdAt": "2025-06-25T22:57:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2025-06-25T23:54:37.954355+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "minseo.kim",
     "createdAt": "2025-06-26T10:05:17.591059+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#야자",
    "#입학준비"
   ],
   "body": "수시 결과 기다리는 중인데 하루가 안 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0039",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2025-06-26T00:35:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2025-06-26T17:34:18.048434+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#모의고사",
    "#야자"
   ],
   "body": "야자실 자리 뺏겼다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0040",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2025-06-29T10:39:00+09:00",
   "likes": 62,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2025-06-29T13:13:07.348683+09:00",
     "body": "좋아요"
    },
    {
     "author": "film.sua",
     "createdAt": "2025-06-29T14:05:16.057866+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원구",
    "#프로그램"
   ],
   "body": "이번 달 청년 프로그램 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0041",
   "kind": "text",
   "author": "laundry.seongwon",
   "createdAt": "2025-07-05T23:18:00+09:00",
   "likes": 30,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동세탁소",
    "#동네가게"
   ],
   "body": "오늘 맡긴 옷은 내일 찾아가세요",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0042",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2025-07-10T20:05:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-07-11T11:45:47.982190+09:00",
     "body": "좋아요"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2025-07-11T12:52:42.717846+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#입학준비",
    "#수시"
   ],
   "caption": "하교길 하늘",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0043",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2025-07-15T23:06:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2025-07-15T23:20:44.694574+09:00",
     "body": "힘내"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2025-07-15T23:56:14.241478+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#새내기"
   ],
   "body": "수시 결과 기다리는 중인데 하루가 안 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0044",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2025-07-17T17:05:00+09:00",
   "likes": 56,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2025-07-18T03:50:14.513266+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#오늘의노래"
   ],
   "body": "이 노래 하루 종일 반복",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0045",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2025-07-22T23:09:00+09:00",
   "likes": 34,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#졸업",
    "#성원고"
   ],
   "caption": "야자 끝나고 분식",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 식당"
  },
  {
   "id": "LBP-0046",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2025-07-23T01:50:00+09:00",
   "likes": 176,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2025-07-23T01:56:32.288325+09:00",
     "body": "멋지네요"
    },
    {
     "author": "film.sua",
     "createdAt": "2025-07-23T04:50:16.351106+09:00",
     "body": "좋다"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2025-07-23T10:38:51.020534+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영학과",
    "#한서대"
   ],
   "body": "새내기 OT 장소 공지",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0047",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2025-07-28T15:21:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2025-07-28T15:42:25.152650+09:00",
     "body": "늦게까지 고생"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2025-07-29T18:06:22.039237+09:00",
     "body": "감성 좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#야자"
   ],
   "caption": "야자 끝난 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0048",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2025-07-28T23:54:00+09:00",
   "likes": 31,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2025-07-29T02:29:40.480225+09:00",
     "body": "상영회 언제야?"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2025-07-29T10:13:52.219540+09:00",
     "body": "장비 좋다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과",
    "#상영회"
   ],
   "caption": "카메라 새로 빌렸다",
   "media": [
    {
     "kind": "photo",
     "scene": "camera",
     "palette": [
      "#dfe3e7",
      "#9aa4ad",
      "#3d454c"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0049",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2025-08-11T22:48:00+09:00",
   "likes": 42,
   "comments": [
    {
     "author": "music.drawer",
     "createdAt": "2025-08-11T23:24:20.352477+09:00",
     "body": "좋아요"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2025-08-12T15:37:28.604678+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#고3"
   ],
   "body": "예비번호 몇 번이면 붙는 거야?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0050",
   "kind": "photo",
   "author": "game.loop",
   "createdAt": "2025-08-19T01:39:00+09:00",
   "likes": 172,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임",
    "#한판만",
    "#게임리뷰"
   ],
   "caption": "게임하다 보니 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0051",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2025-08-21T20:35:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-08-21T23:01:44.265589+09:00",
     "body": "좋아요"
    },
    {
     "author": "meme.box",
     "createdAt": "2025-08-22T11:40:09.953098+09:00",
     "body": "멋지네요"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-08-22T18:57:01.861658+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#졸업"
   ],
   "body": "야자실 자리 뺏겼다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0052",
   "kind": "photo",
   "author": "seungwoo.bae",
   "createdAt": "2025-08-22T01:41:00+09:00",
   "likes": 20,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#야자",
    "#고3"
   ],
   "caption": "야자 끝나고 분식",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0053",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2025-08-22T21:15:00+09:00",
   "likes": 30,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2025-08-22T21:30:51.539718+09:00",
     "body": "포스터 예쁘다"
    },
    {
     "author": "haneul.park",
     "createdAt": "2025-08-23T00:20:16.580897+09:00",
     "body": "상영회 언제야?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#단편영화",
    "#영상과"
   ],
   "caption": "상영회 포스터 나왔다",
   "media": [
    {
     "kind": "photo",
     "scene": "poster",
     "palette": [
      "#f1e7d0",
      "#c6a56a",
      "#5f4a25"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0054",
   "kind": "photo",
   "author": "meme.box",
   "createdAt": "2025-08-23T07:18:00+09:00",
   "likes": 720,
   "comments": [
    {
     "author": "music.drawer",
     "createdAt": "2025-08-23T11:46:11.648979+09:00",
     "body": "좋아요"
    },
    {
     "author": "hoops.log",
     "createdAt": "2025-08-23T19:22:22.019293+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#짤",
    "#웃김",
    "#오늘의밈"
   ],
   "caption": "밈 친구들이랑",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0055",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2025-08-25T14:41:00+09:00",
   "likes": 64,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2025-08-25T20:27:12.366129+09:00",
     "body": "좋다"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2025-08-26T05:04:26.120189+09:00",
     "body": "힘내"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#모의고사"
   ],
   "body": "수시 결과 기다리는 중인데 하루가 안 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0056",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2025-08-28T18:55:00+09:00",
   "likes": 99,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#주말농구",
    "#코트"
   ],
   "body": "주말 농구 결과",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0057",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2025-09-04T01:27:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2025-09-04T01:54:45.009147+09:00",
     "body": "분위기 좋다"
    },
    {
     "author": "jiwon.moon",
     "createdAt": "2025-09-04T09:46:25.741963+09:00",
     "body": "여기 어디야?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#졸업",
    "#모의고사"
   ],
   "caption": "학원 끝나고 커피",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0058",
   "kind": "photo",
   "author": "run.daily",
   "createdAt": "2025-09-04T16:20:00+09:00",
   "likes": 118,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2025-09-04T20:38:45.783005+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#기록"
   ],
   "caption": "러닝 크루 사람들",
   "media": [
    {
     "kind": "photo",
     "scene": "sports",
     "palette": [
      "#d9e8cf",
      "#8bb37a",
      "#36502f"
     ]
    }
   ],
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0059",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2025-09-04T22:52:00+09:00",
   "likes": 557,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#공지"
   ],
   "caption": "중앙도서관 연장 운영 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "campus",
     "palette": [
      "#cfd9e6",
      "#8ea6bd",
      "#3d566e"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0060",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2025-09-05T00:44:00+09:00",
   "likes": 6,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#고3",
    "#졸업"
   ],
   "caption": "야자 간식 사러",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동 편의점"
  },
  {
   "id": "LBP-0061",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2025-09-05T16:56:00+09:00",
   "likes": 46,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#필름",
    "#단편영화"
   ],
   "caption": "오늘 촬영 장비 점검",
   "media": [
    {
     "kind": "photo",
     "scene": "camera",
     "palette": [
      "#dfe3e7",
      "#9aa4ad",
      "#3d454c"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0062",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2025-09-06T00:41:00+09:00",
   "likes": 58,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-09-06T04:36:19.472139+09:00",
     "body": "상영회 기대된다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#영상과",
    "#단편영화"
   ],
   "caption": "상영회 리허설",
   "media": [
    {
     "kind": "photo",
     "scene": "stage",
     "palette": [
      "#241f2e",
      "#4b3a5e",
      "#120f18"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0063",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2025-09-11T06:00:00+09:00",
   "likes": 342,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2025-09-12T00:42:20.838340+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구",
    "#전술"
   ],
   "body": "오늘 전술 한 줄",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0064",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2025-09-11T16:29:00+09:00",
   "likes": 19,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#고3",
    "#입학준비"
   ],
   "body": "수시 결과 기다리는 중인데 하루가 안 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0065",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2025-09-17T00:50:00+09:00",
   "likes": 51,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#운동",
    "#동네헬스"
   ],
   "caption": "이번 주 운동 시간 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0066",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2025-09-20T00:22:00+09:00",
   "likes": 26,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#수시",
    "#고3"
   ],
   "caption": "고3 친구들이랑",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0067",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2025-09-21T01:27:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2025-09-21T03:20:58.641287+09:00",
     "body": "다음에 같이 하자"
    },
    {
     "author": "seungwoo.bae",
     "createdAt": "2025-09-21T14:24:52.138646+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2025-09-21T16:24:54.440066+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#성원고"
   ],
   "body": "모의고사 끝나고 다들 죽은 듯",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0068",
   "kind": "text",
   "author": "bunsik.house",
   "createdAt": "2025-09-21T19:05:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2025-09-21T20:46:34.453977+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#떡볶이",
    "#분식",
    "#성원동분식"
   ],
   "body": "주말에는 재료가 일찍 떨어져요",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0069",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2025-09-22T01:01:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2025-09-22T10:42:40.408141+09:00",
     "body": "몇 시까지 했어?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#모의고사"
   ],
   "caption": "문제집 또 펴는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원고 도서관"
  },
  {
   "id": "LBP-0070",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2025-09-24T01:52:00+09:00",
   "likes": 39,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네카페",
    "#커피",
    "#성원동카페"
   ],
   "caption": "오늘의 원두 소개합니다",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0071",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2025-09-26T13:46:00+09:00",
   "likes": 32,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2025-09-26T22:10:59.654059+09:00",
     "body": "우리도 보자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#모의고사"
   ],
   "caption": "고3 친구들이랑",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0072",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2025-09-26T23:58:00+09:00",
   "likes": 73,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원천",
    "#성원동"
   ],
   "caption": "성원동 골목 소식",
   "media": [
    {
     "kind": "photo",
     "scene": "court",
     "palette": [
      "#e8d9c8",
      "#bd9871",
      "#5f4630"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0073",
   "kind": "text",
   "author": "seongwon.cafe",
   "createdAt": "2025-09-29T00:07:00+09:00",
   "likes": 105,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2025-09-29T01:58:52.415544+09:00",
     "body": "힘내"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-09-29T18:43:29.761182+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#디저트"
   ],
   "body": "오늘의 원두 소개합니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0074",
   "kind": "text",
   "author": "daily.seongwon",
   "createdAt": "2025-09-29T18:15:00+09:00",
   "likes": 161,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2025-09-29T20:24:13.336053+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원천",
    "#성원동",
    "#동네소식"
   ],
   "body": "성원동 골목 소식",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0075",
   "kind": "text",
   "author": "yeseul.hong",
   "createdAt": "2025-09-29T22:51:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-09-30T06:27:14.805014+09:00",
     "body": "좋다"
    },
    {
     "author": "football.talk",
     "createdAt": "2025-09-30T10:32:16.304323+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#고3"
   ],
   "body": "야자실 자리 뺏겼다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0076",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2025-09-30T01:44:00+09:00",
   "likes": 31,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#모의고사"
   ],
   "caption": "학원 가는 버스",
   "media": [
    {
     "kind": "photo",
     "scene": "bus",
     "palette": [
      "#d7e2ea",
      "#8ea6b8",
      "#4a5e6d"
     ]
    }
   ],
   "place": "성원동 정류장"
  },
  {
   "id": "LBP-0077",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2025-10-02T23:36:00+09:00",
   "likes": 171,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2025-10-03T20:52:49.887118+09:00",
     "body": "응원합니다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#플레이리스트"
   ],
   "body": "출근길에 듣기 좋은 곡",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0078",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2025-10-03T18:36:00+09:00",
   "likes": 54,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2025-10-03T23:25:07.524302+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#영상과",
    "#필름"
   ],
   "caption": "스태프 모임",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0079",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2025-10-03T23:27:00+09:00",
   "likes": 53,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#새내기",
    "#모의고사"
   ],
   "caption": "야자 간식 사러",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동 편의점"
  },
  {
   "id": "LBP-0080",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2025-10-06T00:33:00+09:00",
   "likes": 24,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#야자",
    "#입학준비"
   ],
   "body": "예비번호 몇 번이면 붙는 거야?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0081",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2025-10-06T14:15:00+09:00",
   "likes": 97,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2025-10-07T03:32:32.787947+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#코트",
    "#주말농구"
   ],
   "body": "오늘 3점슛 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0082",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2025-10-06T23:33:00+09:00",
   "likes": 46,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#프로그램",
    "#공지",
    "#성원구"
   ],
   "caption": "이번 주 프로그램 신청 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "market",
     "palette": [
      "#efe8d8",
      "#cbb78f",
      "#67583a"
     ]
    }
   ],
   "place": "성원구 청년센터"
  },
  {
   "id": "LBP-0083",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2025-10-07T13:54:00+09:00",
   "likes": 515,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#캠퍼스",
    "#한서대",
    "#총학생회"
   ],
   "caption": "개강 주간 행사 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0084",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2025-10-09T16:06:00+09:00",
   "likes": 25,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#야자",
    "#수시"
   ],
   "caption": "체육 시간 농구",
   "media": [
    {
     "kind": "photo",
     "scene": "court",
     "palette": [
      "#e8d9c8",
      "#bd9871",
      "#5f4630"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0085",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2025-10-10T01:56:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2025-10-10T06:41:02.706276+09:00",
     "body": "좋아요"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2025-10-10T08:08:20.386868+09:00",
     "body": "힘내"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2025-10-10T14:11:29.008176+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#새내기"
   ],
   "body": "수시 결과 기다리는 중인데 하루가 안 감",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0086",
   "kind": "text",
   "author": "seojin.yoon",
   "createdAt": "2025-10-14T15:57:00+09:00",
   "likes": 5,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#수시",
    "#성원고"
   ],
   "body": "야자실 자리 뺏겼다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0087",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2025-10-15T00:12:00+09:00",
   "likes": 10,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#고3",
    "#수시"
   ],
   "caption": "모의고사 오답 정리",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0088",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2025-10-16T21:56:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2025-10-17T01:40:39.442251+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2025-10-17T05:15:36.451881+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#수시",
    "#모의고사"
   ],
   "body": "모의고사 끝나고 다들 죽은 듯",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0089",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2025-10-18T01:19:00+09:00",
   "likes": 46,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-10-18T04:51:16.150798+09:00",
     "body": "좋아요"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2025-10-18T07:02:06.449527+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#야자"
   ],
   "body": "예비번호 몇 번이면 붙는 거야?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0090",
   "kind": "text",
   "author": "jun.choi",
   "createdAt": "2025-10-18T20:34:00+09:00",
   "likes": 41,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#수시",
    "#새내기"
   ],
   "body": "예비번호 몇 번이면 붙는 거야?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0091",
   "kind": "photo",
   "author": "meme.box",
   "createdAt": "2025-10-20T22:43:00+09:00",
   "likes": 318,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2025-10-21T19:42:58.734090+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#웃김",
    "#오늘의밈"
   ],
   "caption": "밈 계정인데 카페 사진",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0092",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2025-10-21T00:22:00+09:00",
   "likes": 47,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2025-10-21T01:53:10.823457+09:00",
     "body": "촬영 잘 됐어?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#촬영"
   ],
   "caption": "오늘 촬영 장비 점검",
   "media": [
    {
     "kind": "photo",
     "scene": "camera",
     "palette": [
      "#dfe3e7",
      "#9aa4ad",
      "#3d454c"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0093",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2025-10-21T01:21:00+09:00",
   "likes": 43,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2025-10-21T01:43:15.422009+09:00",
     "body": "상영회 언제야?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#필름",
    "#영상과",
    "#상영회"
   ],
   "caption": "오늘 촬영 장비 점검",
   "media": [
    {
     "kind": "photo",
     "scene": "camera",
     "palette": [
      "#dfe3e7",
      "#9aa4ad",
      "#3d454c"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0094",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2025-10-21T18:38:00+09:00",
   "likes": 37,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#오운완",
    "#기록",
    "#러닝"
   ],
   "body": "아침 러닝 기록",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0095",
   "kind": "photo",
   "author": "football.talk",
   "createdAt": "2025-10-24T16:08:00+09:00",
   "likes": 351,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2025-10-24T22:33:36.253826+09:00",
     "body": "좋아요"
    },
    {
     "author": "game.loop",
     "createdAt": "2025-10-25T16:06:42.563693+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구",
    "#주말축구",
    "#전술"
   ],
   "caption": "축구 대신 러닝",
   "media": [
    {
     "kind": "photo",
     "scene": "run",
     "palette": [
      "#dbe9db",
      "#91b98f",
      "#3f5f3d"
     ]
    }
   ],
   "place": "성원천 운동장"
  },
  {
   "id": "LBP-0096",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2025-10-27T01:06:00+09:00",
   "likes": 19,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#세탁"
   ],
   "caption": "오늘 맡긴 옷은 내일 찾아가세요",
   "media": [
    {
     "kind": "photo",
     "scene": "flowers",
     "palette": [
      "#f6e3ea",
      "#dca9bd",
      "#7a4b5d"
     ]
    }
   ],
   "place": "성원동 세탁소"
  },
  {
   "id": "LBP-0097",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2025-10-30T00:02:00+09:00",
   "likes": 8,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2025-10-30T03:20:48.629557+09:00",
     "body": "커피 맛있어?"
    },
    {
     "author": "seungwoo.bae",
     "createdAt": "2025-10-30T07:34:58.208302+09:00",
     "body": "나도 가고 싶다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#고3",
    "#졸업"
   ],
   "caption": "학원 끝나고 커피",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0098",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2025-10-31T23:42:00+09:00",
   "likes": 33,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2025-11-01T02:22:38.727753+09:00",
     "body": "힘내"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2025-11-01T11:12:50.956967+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#새내기",
    "#야자"
   ],
   "body": "면접 끝나고 나오는데 다리가 풀린다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0099",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2025-11-01T01:24:00+09:00",
   "likes": 306,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2025-11-01T02:00:12.036956+09:00",
     "body": "좋아요"
    },
    {
     "author": "music.drawer",
     "createdAt": "2025-11-01T11:03:12.626359+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한판만",
    "#게임"
   ],
   "body": "이번 패치 후기",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0100",
   "kind": "photo",
   "author": "seungwoo.bae",
   "createdAt": "2025-11-02T16:56:00+09:00",
   "likes": 54,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2025-11-02T20:53:45.099771+09:00",
     "body": "오늘 사람 많아?"
    },
    {
     "author": "donghyun.lim",
     "createdAt": "2025-11-02T23:06:09.158897+09:00",
     "body": "운동 화이팅"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#성원고"
   ],
   "caption": "체력 관리 시작",
   "media": [
    {
     "kind": "photo",
     "scene": "gym",
     "palette": [
      "#dedede",
      "#a5a5a5",
      "#4a4a4a"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0101",
   "kind": "text",
   "author": "haneul.park",
   "createdAt": "2025-11-03T22:35:00+09:00",
   "likes": 32,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2025-11-04T05:12:04.056048+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#모의고사"
   ],
   "body": "예비번호 몇 번이면 붙는 거야?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0102",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2025-11-03T23:13:00+09:00",
   "likes": 33,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-11-04T03:18:20.856808+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과",
    "#촬영",
    "#필름"
   ],
   "caption": "상영회 리허설",
   "media": [
    {
     "kind": "photo",
     "scene": "stage",
     "palette": [
      "#241f2e",
      "#4b3a5e",
      "#120f18"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0103",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2025-11-04T01:01:00+09:00",
   "likes": 31,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-11-04T12:18:23.700523+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#수시",
    "#모의고사"
   ],
   "body": "예비번호 몇 번이면 붙는 거야?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0104",
   "kind": "text",
   "author": "fitness.seongwon",
   "createdAt": "2025-11-04T01:53:00+09:00",
   "likes": 68,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2025-11-04T03:03:15.873051+09:00",
     "body": "좋아요"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2025-11-04T04:10:43.543601+09:00",
     "body": "멋지네요"
    },
    {
     "author": "donghyun.lim",
     "createdAt": "2025-11-04T08:17:59.670167+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네헬스",
    "#헬스",
    "#성원동헬스장"
   ],
   "body": "이번 주 운동 시간 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0105",
   "kind": "photo",
   "author": "biz.hanseo",
   "createdAt": "2025-11-07T23:48:00+09:00",
   "likes": 239,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2025-11-08T11:47:42.196074+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영학과",
    "#공지",
    "#한서대"
   ],
   "caption": "학과 자료실 운영 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "market",
     "palette": [
      "#efe8d8",
      "#cbb78f",
      "#67583a"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0106",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2025-11-09T22:02:00+09:00",
   "likes": 29,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#입학준비",
    "#야자"
   ],
   "caption": "야자 끝난 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0107",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2025-11-09T22:41:00+09:00",
   "likes": 10,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-11-10T02:40:15.825375+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#고3"
   ],
   "body": "야자실 자리 뺏겼다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0108",
   "kind": "text",
   "author": "bunsik.house",
   "createdAt": "2025-11-10T01:11:00+09:00",
   "likes": 67,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동분식",
    "#동네맛집"
   ],
   "body": "새 떡볶이 레시피 도전 중",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0109",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2025-11-12T00:14:00+09:00",
   "likes": 44,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2025-11-12T04:06:22.924541+09:00",
     "body": "좋아요"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2025-11-12T05:26:40.109449+09:00",
     "body": "어디야?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#고3",
    "#입학준비"
   ],
   "caption": "야자 끝나고 친구랑 라면",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0110",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2025-11-12T10:51:00+09:00",
   "likes": 14,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#야자"
   ],
   "body": "면접 끝나고 나오는데 다리가 풀린다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0111",
   "kind": "photo",
   "author": "run.daily",
   "createdAt": "2025-11-12T17:32:00+09:00",
   "likes": 46,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2025-11-12T17:57:21.100053+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#기록",
    "#러닝",
    "#성원천"
   ],
   "caption": "러닝 책 읽는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0112",
   "kind": "text",
   "author": "lens.minho",
   "createdAt": "2025-11-16T18:57:00+09:00",
   "likes": 12,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#편집",
    "#상영회"
   ],
   "body": "단편영화 준비 중",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0113",
   "kind": "text",
   "author": "yuna.lee",
   "createdAt": "2025-11-18T07:36:00+09:00",
   "likes": 31,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2025-11-18T17:31:16.790563+09:00",
     "body": "힘내"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#입학준비",
    "#수시"
   ],
   "body": "예비번호 몇 번이면 붙는 거야?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0114",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2025-11-19T01:37:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-11-19T07:07:23.768973+09:00",
     "body": "나도 배고파"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#야자",
    "#졸업"
   ],
   "caption": "야자 끝나고 분식",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 식당"
  },
  {
   "id": "LBP-0115",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2025-11-21T00:41:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2025-11-21T02:16:50.903711+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#수시"
   ],
   "body": "면접 끝나고 나오는데 다리가 풀린다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0116",
   "kind": "photo",
   "author": "biz.hanseo",
   "createdAt": "2025-11-22T10:40:00+09:00",
   "likes": 147,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2025-11-22T11:53:43.936746+09:00",
     "body": "좋아요"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2025-11-23T04:55:06.443061+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#학생회"
   ],
   "caption": "새내기 OT 장소 공지",
   "media": [
    {
     "kind": "photo",
     "scene": "market",
     "palette": [
      "#efe8d8",
      "#cbb78f",
      "#67583a"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0117",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2025-11-23T15:11:00+09:00",
   "likes": 53,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2025-11-23T15:11:42.471998+09:00",
     "body": "컷 좋다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#필름",
    "#촬영",
    "#영상과"
   ],
   "caption": "오늘 촬영 끝",
   "media": [
    {
     "kind": "photo",
     "scene": "film",
     "palette": [
      "#3c3a44",
      "#76717f",
      "#17161b"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0118",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2025-11-24T22:55:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2025-11-25T04:00:21.458250+09:00",
     "body": "다음에 같이 하자"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2025-11-25T06:59:48.007510+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#고3"
   ],
   "body": "모의고사 끝나고 다들 죽은 듯",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0119",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2025-11-25T07:26:00+09:00",
   "likes": 65,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2025-11-25T08:00:32.402362+09:00",
     "body": "좋아요"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-11-25T13:27:55.640608+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네카페",
    "#커피",
    "#디저트"
   ],
   "caption": "새 디저트 나왔어요",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0120",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2025-11-29T11:47:00+09:00",
   "likes": 52,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2025-11-29T17:45:25.015916+09:00",
     "body": "좋아요"
    },
    {
     "author": "meme.box",
     "createdAt": "2025-11-29T20:51:19.658175+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#모의고사"
   ],
   "caption": "모의고사 오답 정리",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0121",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2025-12-01T01:28:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2025-12-01T02:52:56.125751+09:00",
     "body": "다들 언제 모여?"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2025-12-01T20:11:17.802055+09:00",
     "body": "즐거워 보인다"
    },
    {
     "author": "seojin.yoon",
     "createdAt": "2025-12-01T23:49:22.912393+09:00",
     "body": "다음엔 나도 불러줘"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#고3",
    "#모의고사"
   ],
   "caption": "고3 친구들이랑",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0122",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2025-12-01T12:32:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "nayoung.ko",
     "createdAt": "2025-12-01T14:14:28.159626+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2025-12-02T10:20:25.984720+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#야자",
    "#졸업"
   ],
   "caption": "학원 가는 버스",
   "media": [
    {
     "kind": "photo",
     "scene": "bus",
     "palette": [
      "#d7e2ea",
      "#8ea6b8",
      "#4a5e6d"
     ]
    }
   ],
   "place": "성원동 정류장"
  },
  {
   "id": "LBP-0123",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2025-12-01T19:29:00+09:00",
   "likes": 352,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#전술",
    "#주말축구",
    "#경기리뷰"
   ],
   "body": "후반 교체가 승부 갈랐다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0124",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2025-12-02T01:24:00+09:00",
   "likes": 103,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#슛",
    "#코트",
    "#농구"
   ],
   "body": "농구화 새로 샀다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0125",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2025-12-02T01:58:00+09:00",
   "likes": 477,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#캠퍼스",
    "#총학생회",
    "#공지"
   ],
   "caption": "개강 주간 행사 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0126",
   "kind": "text",
   "author": "jun.choi",
   "createdAt": "2025-12-02T10:25:00+09:00",
   "likes": 27,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#모의고사",
    "#입학준비"
   ],
   "body": "면접 끝나고 나오는데 다리가 풀린다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0127",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2025-12-03T06:21:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2025-12-03T07:54:08.416572+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2025-12-03T11:26:28.599215+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#고3",
    "#새내기"
   ],
   "body": "예비번호 몇 번이면 붙는 거야?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0128",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2025-12-05T23:46:00+09:00",
   "likes": 22,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#세탁",
    "#수선"
   ],
   "caption": "가게 앞 꽃",
   "media": [
    {
     "kind": "photo",
     "scene": "flowers",
     "palette": [
      "#f6e3ea",
      "#dca9bd",
      "#7a4b5d"
     ]
    }
   ],
   "place": "성원동 세탁소"
  },
  {
   "id": "LBP-0129",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2025-12-06T22:09:00+09:00",
   "likes": 61,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원구",
    "#청년센터",
    "#공지"
   ],
   "caption": "청년 프로그램 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "stage",
     "palette": [
      "#241f2e",
      "#4b3a5e",
      "#120f18"
     ]
    }
   ],
   "place": "성원구 청년센터"
  },
  {
   "id": "LBP-0130",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2025-12-07T15:44:00+09:00",
   "likes": 6,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-12-07T16:33:18.734653+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#고3",
    "#졸업"
   ],
   "body": "모의고사 끝나고 다들 죽은 듯",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0131",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2025-12-11T22:13:00+09:00",
   "likes": 65,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원천",
    "#동네소식",
    "#성원동"
   ],
   "caption": "성원동 골목 소식",
   "media": [
    {
     "kind": "photo",
     "scene": "run",
     "palette": [
      "#dbe9db",
      "#91b98f",
      "#3f5f3d"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0132",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2025-12-12T01:16:00+09:00",
   "likes": 12,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#수시",
    "#새내기"
   ],
   "caption": "체력 관리 시작",
   "media": [
    {
     "kind": "photo",
     "scene": "gym",
     "palette": [
      "#dedede",
      "#a5a5a5",
      "#4a4a4a"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0133",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2025-12-12T11:09:00+09:00",
   "likes": 47,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2025-12-13T07:21:27.591757+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네헬스",
    "#성원동헬스장",
    "#운동"
   ],
   "caption": "이번 주 운동 시간 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0134",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2025-12-12T18:31:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2025-12-12T18:54:14.426275+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2025-12-12T20:12:59.743884+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#야자",
    "#수시"
   ],
   "caption": "야자 끝나고 분식",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0135",
   "kind": "photo",
   "author": "seungwoo.bae",
   "createdAt": "2025-12-12T22:20:00+09:00",
   "likes": 51,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#졸업",
    "#성원고"
   ],
   "caption": "야자 끝나고 집 가는 길",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원고 정문"
  },
  {
   "id": "LBP-0136",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2025-12-13T23:37:00+09:00",
   "likes": 50,
   "comments": [
    {
     "author": "music.drawer",
     "createdAt": "2025-12-14T16:30:16.340788+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동분식",
    "#동네맛집",
    "#분식"
   ],
   "caption": "오늘 메뉴 준비 완료",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0137",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2025-12-14T00:17:00+09:00",
   "likes": 172,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#플레이리스트",
    "#음악"
   ],
   "body": "비 오는 날 플리",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0138",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2025-12-15T12:37:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2025-12-15T16:02:13.847545+09:00",
     "body": "우리도 보자"
    },
    {
     "author": "game.loop",
     "createdAt": "2025-12-15T17:26:39.325991+09:00",
     "body": "좋아요"
    },
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-12-15T20:04:28.650337+09:00",
     "body": "다들 언제 모여?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#필름",
    "#편집"
   ],
   "caption": "스태프 모임",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0139",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2025-12-15T22:38:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-12-16T01:15:00.683148+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#새내기",
    "#고3"
   ],
   "body": "예비번호 몇 번이면 붙는 거야?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0140",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2025-12-16T01:52:00+09:00",
   "likes": 35,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#촬영",
    "#영상과"
   ],
   "caption": "무대 조명 맞추는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "stage",
     "palette": [
      "#241f2e",
      "#4b3a5e",
      "#120f18"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0141",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2025-12-21T07:59:00+09:00",
   "likes": 15,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#졸업"
   ],
   "body": "수시 원서 접수하고 왔다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0142",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2025-12-21T17:07:00+09:00",
   "likes": 143,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2025-12-21T19:18:33.076868+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#패치",
    "#게임리뷰"
   ],
   "body": "오늘 게임 기록",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0143",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2025-12-21T20:08:00+09:00",
   "likes": 394,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#짤",
    "#오늘의밈"
   ],
   "body": "이 짤 보면 무조건 웃음",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0144",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2025-12-23T01:46:00+09:00",
   "likes": 53,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2025-12-23T06:19:54.283265+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#수시",
    "#새내기"
   ],
   "caption": "야자 끝나고 친구랑 라면",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0145",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2025-12-24T15:32:00+09:00",
   "likes": 40,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2025-12-24T16:51:34.806920+09:00",
     "body": "야경 예쁘다"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2025-12-24T19:14:16.580323+09:00",
     "body": "밤에 뭐 해?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#수시",
    "#모의고사"
   ],
   "caption": "야자 끝난 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0146",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2025-12-24T22:47:00+09:00",
   "likes": 38,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#모의고사",
    "#고3"
   ],
   "caption": "야자 끝난 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0147",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2025-12-25T01:11:00+09:00",
   "likes": 163,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학생회",
    "#공지",
    "#경영학과"
   ],
   "body": "과잠 주문 마감 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0148",
   "kind": "text",
   "author": "lens.minho",
   "createdAt": "2025-12-29T07:37:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2025-12-29T13:21:53.289077+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#영상과"
   ],
   "body": "장비 정리",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0149",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2025-12-30T21:36:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2025-12-31T00:23:58.628141+09:00",
     "body": "하늘 예쁘다"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2025-12-31T11:09:18.282224+09:00",
     "body": "오늘 날씨 좋더라"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#수시"
   ],
   "caption": "하교길 하늘",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0150",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2025-12-31T09:11:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2025-12-31T15:59:05.493014+09:00",
     "body": "나도 집중해야 하는데"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#입학준비"
   ],
   "caption": "책상 정리하고 공부 시작",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0151",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-01-01T16:30:00+09:00",
   "likes": 72,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-01-02T03:21:12.936450+09:00",
     "body": "편집 화이팅"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#단편영화",
    "#필름"
   ],
   "caption": "오늘 촬영 끝",
   "media": [
    {
     "kind": "photo",
     "scene": "film",
     "palette": [
      "#3c3a44",
      "#76717f",
      "#17161b"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0152",
   "kind": "photo",
   "author": "game.loop",
   "createdAt": "2026-01-02T10:44:00+09:00",
   "likes": 295,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-01-02T12:10:21.640143+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한판만",
    "#게임리뷰",
    "#패치"
   ],
   "caption": "게임하다가 듣는 플리",
   "media": [
    {
     "kind": "photo",
     "scene": "music",
     "palette": [
      "#e3d6ef",
      "#a98ac4",
      "#4f3a63"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0153",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-01-02T18:42:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-01-03T14:12:23.807466+09:00",
     "body": "좋아요"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2026-01-03T14:34:06.320503+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#새내기",
    "#고3"
   ],
   "body": "오늘 모의고사 수학만 세 번 봤다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0154",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-01-04T22:28:00+09:00",
   "likes": 34,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2026-01-05T03:12:18.548034+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#야자",
    "#입학준비"
   ],
   "caption": "고3 친구들이랑",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0155",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2026-01-04T23:20:00+09:00",
   "likes": 419,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-01-05T01:49:28.871407+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#캠퍼스",
    "#한서대"
   ],
   "body": "이번 달 총학생회 공지",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0156",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-01-04T23:43:00+09:00",
   "likes": 237,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-01-05T07:24:23.407287+09:00",
     "body": "좋아요"
    },
    {
     "author": "game.loop",
     "createdAt": "2026-01-05T14:43:38.434794+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#오늘의노래",
    "#플리"
   ],
   "body": "새로 나온 앨범 들었는데 좋다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0157",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-01-06T23:03:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-01-07T06:02:26.210547+09:00",
     "body": "장비 좋다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#편집",
    "#단편영화"
   ],
   "caption": "렌즈 청소하는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "camera",
     "palette": [
      "#dfe3e7",
      "#9aa4ad",
      "#3d454c"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0158",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2026-01-08T06:03:00+09:00",
   "likes": 87,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#청년센터",
    "#프로그램"
   ],
   "caption": "청년 프로그램 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원구 청년센터"
  },
  {
   "id": "LBP-0159",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2026-01-08T23:16:00+09:00",
   "likes": 52,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-01-09T16:09:36.102498+09:00",
     "body": "즐거워 보인다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#새내기",
    "#입학준비"
   ],
   "caption": "고3 친구들이랑",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0160",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2026-01-09T21:58:00+09:00",
   "likes": 64,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-01-10T17:48:53.638487+09:00",
     "body": "힘내"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-01-10T21:48:11.704320+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#입학준비"
   ],
   "body": "예비번호 몇 번이면 붙는 거야?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0161",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-01-09T23:26:00+09:00",
   "likes": 63,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#분식",
    "#성원동분식",
    "#동네맛집"
   ],
   "caption": "새 떡볶이 레시피 도전 중",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0162",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-01-10T00:23:00+09:00",
   "likes": 52,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#단편영화"
   ],
   "caption": "편집실 야근",
   "media": [
    {
     "kind": "photo",
     "scene": "film",
     "palette": [
      "#3c3a44",
      "#76717f",
      "#17161b"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0163",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2026-01-10T01:25:00+09:00",
   "likes": 30,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-01-10T04:03:03.864079+09:00",
     "body": "좋아요"
    },
    {
     "author": "lens.minho",
     "createdAt": "2026-01-10T10:46:29.418717+09:00",
     "body": "어디야?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#성원고"
   ],
   "caption": "야자 끝나고 분식",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 식당"
  },
  {
   "id": "LBP-0164",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-01-10T10:07:00+09:00",
   "likes": 127,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-01-10T14:10:12.668648+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#오운완",
    "#성원천",
    "#기록"
   ],
   "body": "페이스 조금 올렸다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0165",
   "kind": "text",
   "author": "seongwon.cafe",
   "createdAt": "2026-01-11T14:45:00+09:00",
   "likes": 118,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-01-11T15:30:21.426659+09:00",
     "body": "멋지네요"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-01-11T19:57:39.036247+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#커피",
    "#동네카페",
    "#디저트"
   ],
   "body": "새 디저트 나왔어요",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0166",
   "kind": "photo",
   "author": "football.talk",
   "createdAt": "2026-01-11T22:03:00+09:00",
   "likes": 73,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-01-11T22:35:22.934049+09:00",
     "body": "좋아요"
    },
    {
     "author": "hoops.log",
     "createdAt": "2026-01-12T01:26:20.000561+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구",
    "#전술"
   ],
   "caption": "오늘 경기",
   "media": [
    {
     "kind": "photo",
     "scene": "court",
     "palette": [
      "#e8d9c8",
      "#bd9871",
      "#5f4630"
     ]
    }
   ],
   "place": "성원천 운동장"
  },
  {
   "id": "LBP-0167",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2026-01-11T23:54:00+09:00",
   "likes": 17,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#입학준비"
   ],
   "body": "오늘 모의고사 수학만 세 번 봤다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0168",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2026-01-12T01:33:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-01-12T04:50:54.320055+09:00",
     "body": "멋지네요"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-01-12T06:09:28.530323+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#고3",
    "#야자"
   ],
   "body": "수시 원서 접수하고 왔다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0169",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-01-12T22:40:00+09:00",
   "likes": 235,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-01-13T00:27:03.271250+09:00",
     "body": "이거 뭐야"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-01-13T10:22:52.450094+09:00",
     "body": "공감"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-01-13T12:13:20.873943+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#짤",
    "#웃김"
   ],
   "body": "친구가 보내준 밈 저장",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0170",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2026-01-12T22:54:00+09:00",
   "likes": 32,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-01-13T07:07:46.143212+09:00",
     "body": "나도 배고파"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2026-01-13T16:18:45.576835+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#야자",
    "#졸업"
   ],
   "caption": "친구랑 국밥",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0171",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-01-15T01:29:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-01-15T07:57:38.036384+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#입학준비",
    "#고3"
   ],
   "caption": "야자 끝나고 친구랑 라면",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0172",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-01-15T14:05:00+09:00",
   "likes": 74,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-01-16T06:39:13.561701+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#헬스",
    "#성원동헬스장",
    "#동네헬스"
   ],
   "caption": "새 기구 들어왔어요",
   "media": [
    {
     "kind": "photo",
     "scene": "street",
     "palette": [
      "#d9d4cc",
      "#9d978d",
      "#4f4a44"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0173",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2026-01-16T00:06:00+09:00",
   "likes": 112,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-01-16T11:10:56.281012+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말농구",
    "#코트",
    "#농구"
   ],
   "body": "동네 코트에서",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0174",
   "kind": "photo",
   "author": "seungwoo.bae",
   "createdAt": "2026-01-17T22:06:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-01-18T07:58:52.402328+09:00",
     "body": "야식 사러 갔어?"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2026-01-18T15:08:07.799791+09:00",
     "body": "나도 과자 먹고 싶다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#졸업",
    "#야자"
   ],
   "caption": "야자 간식 사러",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동 마트"
  },
  {
   "id": "LBP-0175",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2026-01-17T23:35:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-01-17T23:49:37.843175+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#야자",
    "#모의고사"
   ],
   "caption": "고3 친구들이랑",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0176",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2026-01-18T13:17:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2026-01-18T17:13:24.701278+09:00",
     "body": "편의점 뭐 샀어?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#고3"
   ],
   "caption": "야자 간식 사러",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동 편의점"
  },
  {
   "id": "LBP-0177",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-01-20T19:01:00+09:00",
   "likes": 109,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-01-20T21:44:31.813796+09:00",
     "body": "좋아요"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-01-21T00:56:15.475312+09:00",
     "body": "멋지네요"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-01-21T06:10:01.847997+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동",
    "#동네소식"
   ],
   "caption": "성원동 골목 소식",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0178",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-01-21T01:21:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2026-01-21T01:26:46.286223+09:00",
     "body": "좋아요"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2026-01-21T07:28:20.597510+09:00",
     "body": "멋지네요"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-01-21T08:06:38.158984+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#세탁",
    "#동네가게",
    "#성원동세탁소"
   ],
   "caption": "오늘 맡긴 옷은 내일 찾아가세요",
   "media": [
    {
     "kind": "photo",
     "scene": "interior",
     "palette": [
      "#ece6de",
      "#c1b3a0",
      "#665c50"
     ]
    }
   ],
   "place": "성원동 세탁소"
  },
  {
   "id": "LBP-0179",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-01-21T19:35:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-01-22T09:22:29.847988+09:00",
     "body": "경기 언제야?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#새내기",
    "#고3"
   ],
   "caption": "체육 시간 농구",
   "media": [
    {
     "kind": "photo",
     "scene": "court",
     "palette": [
      "#e8d9c8",
      "#bd9871",
      "#5f4630"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0180",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2026-01-21T19:43:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-01-21T20:13:33.970664+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-01-21T22:50:46.341044+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#성원고",
    "#모의고사"
   ],
   "body": "모의고사 끝나고 다들 죽은 듯",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0181",
   "kind": "photo",
   "author": "meme.box",
   "createdAt": "2026-01-22T22:09:00+09:00",
   "likes": 731,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#짤",
    "#오늘의밈"
   ],
   "caption": "밈 계정이지만 이 노래는 진지하게",
   "media": [
    {
     "kind": "photo",
     "scene": "music",
     "palette": [
      "#e3d6ef",
      "#a98ac4",
      "#4f3a63"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0182",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-01-23T23:13:00+09:00",
   "likes": 24,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#야자"
   ],
   "body": "야자실에서 라면 먹는 게 유일한 낙",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0183",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-01-24T23:59:00+09:00",
   "likes": 137,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-01-25T11:49:07.384968+09:00",
     "body": "하늘 예쁘다"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-01-25T12:42:07.864702+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#골목",
    "#동네소식"
   ],
   "caption": "성원동 골목 소식",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0184",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-01-25T12:20:00+09:00",
   "likes": 120,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#오늘의노래",
    "#플레이리스트"
   ],
   "body": "잠 안 올 때 듣는 곡",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0185",
   "kind": "text",
   "author": "haneul.park",
   "createdAt": "2026-01-25T22:09:00+09:00",
   "likes": 30,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#고3",
    "#새내기"
   ],
   "body": "면접 끝나고 나오는데 다리가 풀린다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0186",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-01-27T01:18:00+09:00",
   "likes": 28,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-01-27T01:27:22.983377+09:00",
     "body": "촬영 잘 됐어?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#필름",
    "#촬영"
   ],
   "caption": "카메라 새로 빌렸다",
   "media": [
    {
     "kind": "photo",
     "scene": "camera",
     "palette": [
      "#dfe3e7",
      "#9aa4ad",
      "#3d454c"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0187",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2026-01-29T00:32:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-01-29T03:20:25.173859+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#모의고사"
   ],
   "body": "면접 끝나고 나오는데 다리가 풀린다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0188",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2026-01-29T06:51:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-01-30T04:44:58.597875+09:00",
     "body": "다음엔 나도 불러줘"
    },
    {
     "author": "seojin.yoon",
     "createdAt": "2026-01-30T05:23:06.559440+09:00",
     "body": "우리도 보자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#고3",
    "#수시"
   ],
   "caption": "고3 친구들이랑",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0189",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-01-29T19:25:00+09:00",
   "likes": 30,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2026-01-30T08:56:49.810324+09:00",
     "body": "좋아요"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2026-01-30T11:42:47.591665+09:00",
     "body": "늦게까지 고생"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#야자",
    "#수시"
   ],
   "caption": "야자 끝난 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0190",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2026-01-30T00:57:00+09:00",
   "likes": 16,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#고3",
    "#수시"
   ],
   "body": "오늘은 학원 쉬는 날",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0191",
   "kind": "text",
   "author": "cut.jaehyun",
   "createdAt": "2026-02-01T00:48:00+09:00",
   "likes": 50,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#영상과"
   ],
   "body": "오늘 촬영",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0192",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-02-02T06:50:00+09:00",
   "likes": 36,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#고3",
    "#모의고사"
   ],
   "caption": "문제집 또 펴는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0193",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2026-02-02T13:45:00+09:00",
   "likes": 72,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#수시",
    "#새내기"
   ],
   "caption": "책상 정리하고 공부 시작",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0194",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-02-02T20:06:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2026-02-02T23:18:16.904991+09:00",
     "body": "분위기 좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#야자",
    "#수시"
   ],
   "caption": "학원 끝나고 커피",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0195",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2026-02-02T20:46:00+09:00",
   "likes": 26,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#수시",
    "#입학준비"
   ],
   "body": "오늘 모의고사 수학만 세 번 봤다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0196",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-02-03T00:06:00+09:00",
   "likes": 28,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2026-02-03T13:52:49.042547+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#분식",
    "#성원동분식",
    "#떡볶이"
   ],
   "caption": "주말에는 재료가 일찍 떨어져요",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0197",
   "kind": "text",
   "author": "laundry.seongwon",
   "createdAt": "2026-02-03T01:39:00+09:00",
   "likes": 27,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-02-03T06:58:34.989736+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#세탁",
    "#수선"
   ],
   "body": "수선 문의 받습니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0198",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-02-04T00:34:00+09:00",
   "likes": 83,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-02-04T11:44:41.106298+09:00",
     "body": "리허설 화이팅"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#단편영화"
   ],
   "caption": "발표 준비",
   "media": [
    {
     "kind": "photo",
     "scene": "stage",
     "palette": [
      "#241f2e",
      "#4b3a5e",
      "#120f18"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0199",
   "kind": "text",
   "author": "frame.hana",
   "createdAt": "2026-02-04T20:08:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-02-04T22:38:17.957449+09:00",
     "body": "힘내"
    },
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-02-05T15:38:58.288965+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#편집",
    "#상영회"
   ],
   "body": "단편 준비 중",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0200",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2026-02-06T22:44:00+09:00",
   "likes": 37,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#모의고사"
   ],
   "body": "면접 끝나고 나오는데 다리가 풀린다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0201",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2026-02-07T20:31:00+09:00",
   "likes": 53,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-02-08T00:30:08.291908+09:00",
     "body": "좋아요"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-02-08T14:21:22.937743+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#프로그램",
    "#청년센터"
   ],
   "caption": "청년센터 운영 시간 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "market",
     "palette": [
      "#efe8d8",
      "#cbb78f",
      "#67583a"
     ]
    }
   ],
   "place": "성원구 청년센터"
  },
  {
   "id": "LBP-0202",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-02-08T13:01:00+09:00",
   "likes": 123,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-02-08T13:50:45.610058+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#기록"
   ],
   "body": "비 와서 실내 러닝",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0203",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-02-08T21:50:00+09:00",
   "likes": 53,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#디저트",
    "#동네카페"
   ],
   "caption": "오늘의 원두 소개합니다",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0204",
   "kind": "text",
   "author": "yeseul.hong",
   "createdAt": "2026-02-08T23:06:00+09:00",
   "likes": 9,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#성원고",
    "#야자"
   ],
   "body": "모의고사 끝나고 다들 죽은 듯",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0205",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2026-02-09T01:57:00+09:00",
   "likes": 46,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-02-09T19:42:13.963201+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#새내기"
   ],
   "body": "면접 끝나고 나오는데 다리가 풀린다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0206",
   "kind": "text",
   "author": "seojin.yoon",
   "createdAt": "2026-02-09T22:19:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-02-09T23:35:01.998566+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#수시",
    "#성원고"
   ],
   "body": "모의고사 끝나고 다들 죽은 듯",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0207",
   "kind": "text",
   "author": "seungwoo.bae",
   "createdAt": "2026-02-10T00:33:00+09:00",
   "likes": 49,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-02-10T02:55:19.893695+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#성원고",
    "#모의고사"
   ],
   "body": "야자실 자리 뺏겼다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0208",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-02-10T12:49:00+09:00",
   "likes": 232,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영학과",
    "#공지"
   ],
   "body": "이번 주 학과 행사 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0209",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2026-02-10T22:38:00+09:00",
   "likes": 164,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#캠퍼스"
   ],
   "body": "개강 주간 행사 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0210",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2026-02-10T22:42:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-02-12T01:56:54.560188+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#수시",
    "#모의고사"
   ],
   "body": "수시 원서 접수하고 왔다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0211",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2026-02-11T14:30:00+09:00",
   "likes": 20,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#성원고"
   ],
   "caption": "하교길 하늘",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0212",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-02-11T23:19:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-11T23:46:37.501386+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네헬스",
    "#성원동헬스장"
   ],
   "caption": "이번 주 운동 시간 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "gym",
     "palette": [
      "#dedede",
      "#a5a5a5",
      "#4a4a4a"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0213",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2026-02-11T23:38:00+09:00",
   "likes": 18,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#졸업"
   ],
   "body": "수시 원서 접수하고 왔다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0214",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-02-12T00:16:00+09:00",
   "likes": 116,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-02-12T00:42:09.000555+09:00",
     "body": "좋아요"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-02-12T03:55:08.025920+09:00",
     "body": "힘내"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구",
    "#주말축구",
    "#전술"
   ],
   "body": "이번 라운드 관전 포인트",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0215",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-02-12T14:52:00+09:00",
   "likes": 98,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#코트"
   ],
   "caption": "오늘은 러닝으로",
   "media": [
    {
     "kind": "photo",
     "scene": "run",
     "palette": [
      "#dbe9db",
      "#91b98f",
      "#3f5f3d"
     ]
    }
   ],
   "place": "성원천 운동장"
  },
  {
   "id": "LBP-0216",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-02-13T01:30:00+09:00",
   "likes": 306,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-02-13T13:30:02.027454+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임",
    "#게임리뷰"
   ],
   "body": "친구랑 협동 플레이",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0217",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-02-13T23:23:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-02-14T01:56:37.821496+09:00",
     "body": "책상 깔끔하다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#새내기",
    "#모의고사"
   ],
   "caption": "책상 정리하고 공부 시작",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0218",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2026-02-14T00:57:00+09:00",
   "likes": 19,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#성원고"
   ],
   "body": "오늘은 학원 쉬는 날",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0219",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2026-02-14T07:53:00+09:00",
   "likes": 94,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#프로그램",
    "#공지"
   ],
   "body": "청년센터 이용 시간 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0220",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2026-02-14T22:12:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "nayoung.ko",
     "createdAt": "2026-02-14T22:16:07.007131+09:00",
     "body": "맛있겠다"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-02-15T10:06:51.190715+09:00",
     "body": "어디야?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#졸업",
    "#수시"
   ],
   "caption": "친구랑 국밥",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 식당"
  },
  {
   "id": "LBP-0221",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2026-02-14T22:15:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-02-15T13:09:27.423690+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#모의고사"
   ],
   "caption": "친구랑 국밥",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0222",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-02-15T18:15:00+09:00",
   "likes": 197,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-02-15T23:24:11.723980+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#오늘의밈",
    "#밈",
    "#웃김"
   ],
   "body": "요즘 유행하는 밈 정리",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0223",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2026-02-15T20:07:00+09:00",
   "likes": 46,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#고3"
   ],
   "caption": "문제집 또 펴는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0224",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2026-02-15T22:58:00+09:00",
   "likes": 16,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#수시",
    "#성원고"
   ],
   "body": "졸업 사진 찍었다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0225",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2026-02-15T23:51:00+09:00",
   "likes": 22,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#졸업"
   ],
   "caption": "야자 끝나고 집 가는 길",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0226",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-02-16T00:50:00+09:00",
   "likes": 30,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#수시"
   ],
   "caption": "모의고사 오답 정리",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0227",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2026-02-16T01:35:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-16T22:52:10.126323+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#야자"
   ],
   "body": "오늘은 학원 쉬는 날",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0228",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-02-16T13:40:00+09:00",
   "likes": 238,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2026-02-16T20:47:22.086167+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경기리뷰",
    "#주말축구",
    "#전술"
   ],
   "body": "수비 라인 이야기",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0229",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-02-17T10:10:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-02-17T11:12:53.881186+09:00",
     "body": "여기 어디야?"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2026-02-17T23:48:31.848848+09:00",
     "body": "커피 맛있어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#수시",
    "#고3"
   ],
   "caption": "학원 끝나고 커피",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0230",
   "kind": "text",
   "author": "frame.hana",
   "createdAt": "2026-02-18T07:14:00+09:00",
   "likes": 31,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-02-18T11:18:11.999484+09:00",
     "body": "힘내"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#필름",
    "#단편영화",
    "#편집"
   ],
   "body": "오늘 편집실",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0231",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2026-02-18T08:21:00+09:00",
   "likes": 40,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#고3"
   ],
   "caption": "하교길 하늘",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0232",
   "kind": "photo",
   "author": "run.daily",
   "createdAt": "2026-02-19T00:48:00+09:00",
   "likes": 79,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2026-02-19T01:45:25.528122+09:00",
     "body": "멋지네요"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-02-19T03:21:44.459448+09:00",
     "body": "경기 언제야?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#기록",
    "#오운완",
    "#러닝"
   ],
   "caption": "오늘은 같이 운동",
   "media": [
    {
     "kind": "photo",
     "scene": "sports",
     "palette": [
      "#d9e8cf",
      "#8bb37a",
      "#36502f"
     ]
    }
   ],
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0233",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-02-19T10:35:00+09:00",
   "likes": 56,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2026-02-19T15:09:06.272615+09:00",
     "body": "상영회 언제야?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#편집",
    "#영상과"
   ],
   "caption": "장면 하나 더 찍었다",
   "media": [
    {
     "kind": "photo",
     "scene": "film",
     "palette": [
      "#3c3a44",
      "#76717f",
      "#17161b"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0234",
   "kind": "text",
   "author": "fitness.seongwon",
   "createdAt": "2026-02-20T10:54:00+09:00",
   "likes": 78,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#운동",
    "#동네헬스"
   ],
   "body": "새 기구 들어왔어요",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0235",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-02-20T20:10:00+09:00",
   "likes": 70,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-02-20T23:39:53.554114+09:00",
     "body": "좋아요"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2026-02-21T04:16:06.827266+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네맛집",
    "#성원동분식"
   ],
   "caption": "오늘 메뉴 준비 완료",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0236",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-02-20T22:39:00+09:00",
   "likes": 71,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-02-21T21:43:29.713671+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네카페",
    "#커피",
    "#성원동카페"
   ],
   "caption": "새 디저트 나왔어요",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0237",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2026-02-20T23:58:00+09:00",
   "likes": 53,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-02-21T00:37:36.458094+09:00",
     "body": "나도 배고파"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2026-02-21T05:15:19.358911+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#수시",
    "#모의고사"
   ],
   "caption": "학원 앞 분식집",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0238",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-02-21T00:42:00+09:00",
   "likes": 63,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#경영학과"
   ],
   "body": "중간고사 대비 자료실 운영",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0239",
   "kind": "photo",
   "author": "seungwoo.bae",
   "createdAt": "2026-02-21T01:26:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-21T01:39:06.188660+09:00",
     "body": "좋아요"
    },
    {
     "author": "seojin.yoon",
     "createdAt": "2026-02-21T04:55:27.235361+09:00",
     "body": "야식 사러 갔어?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#성원고"
   ],
   "caption": "편의점에서",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동 마트"
  },
  {
   "id": "LBP-0240",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-02-21T01:57:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-02-21T21:22:18.861022+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#모의고사",
    "#수시"
   ],
   "body": "수능 끝나고 폰만 보고 있음",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0241",
   "kind": "text",
   "author": "daily.seongwon",
   "createdAt": "2026-02-21T22:59:00+09:00",
   "likes": 146,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2026-02-22T05:51:38.522443+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동",
    "#동네소식"
   ],
   "body": "오늘 동네 날씨",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0242",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-02-22T01:12:00+09:00",
   "likes": 101,
   "comments": [
    {
     "author": "music.drawer",
     "createdAt": "2026-02-22T16:00:46.968498+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#코트",
    "#농구"
   ],
   "caption": "컨디션 조절 러닝",
   "media": [
    {
     "kind": "photo",
     "scene": "run",
     "palette": [
      "#dbe9db",
      "#91b98f",
      "#3f5f3d"
     ]
    }
   ],
   "place": "성원천 운동장"
  },
  {
   "id": "LBP-0243",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2026-02-23T01:19:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-02-23T01:52:26.300864+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#수시",
    "#졸업"
   ],
   "caption": "친구랑 국밥",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 식당"
  },
  {
   "id": "LBP-0244",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-02-23T06:52:00+09:00",
   "likes": 14,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수시",
    "#야자",
    "#모의고사"
   ],
   "caption": "문제집 또 펴는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0245",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-02-23T23:32:00+09:00",
   "likes": 329,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-02-23T23:59:07.079585+09:00",
     "body": "오늘도 화이팅"
    },
    {
     "author": "football.talk",
     "createdAt": "2026-02-24T04:44:38.556721+09:00",
     "body": "응원합니다"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-02-24T12:23:45.125446+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한판만",
    "#게임",
    "#패치"
   ],
   "body": "새로 나온 게임 해봄",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0246",
   "kind": "text",
   "author": "laundry.seongwon",
   "createdAt": "2026-02-24T22:11:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-24T22:11:26.757821+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#성원동세탁소",
    "#세탁"
   ],
   "body": "주말 영업시간 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0247",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-02-24T22:30:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-02-25T01:17:36.171054+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#필름",
    "#편집"
   ],
   "caption": "시나리오 수정 중",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0248",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-02-25T14:26:00+09:00",
   "likes": 23,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입학준비",
    "#야자"
   ],
   "caption": "하교길 하늘",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0249",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2026-02-25T15:50:00+09:00",
   "likes": 14,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#모의고사",
    "#수시"
   ],
   "body": "야자실에서 라면 먹는 게 유일한 낙",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0250",
   "kind": "text",
   "author": "film.sua",
   "createdAt": "2026-02-25T19:03:00+09:00",
   "likes": 91,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-02-26T00:31:43.244636+09:00",
     "body": "좋아요"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-02-26T09:38:08.260969+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#촬영",
    "#영상과"
   ],
   "body": "오늘 촬영",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0251",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2026-02-25T19:33:00+09:00",
   "likes": 244,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-02-26T06:15:57.800697+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#총학생회",
    "#캠퍼스"
   ],
   "body": "중앙도서관 연장 운영 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0252",
   "kind": "photo",
   "author": "music.drawer",
   "createdAt": "2026-02-26T17:50:00+09:00",
   "likes": 59,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-26T18:31:52.290408+09:00",
     "body": "좋아요"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-02-26T23:17:00.540734+09:00",
     "body": "분위기 좋다"
    },
    {
     "author": "meme.box",
     "createdAt": "2026-02-27T07:19:24.228949+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플레이리스트",
    "#음악",
    "#플리"
   ],
   "caption": "카페에서 듣는 플리",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0253",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-02-26T23:21:00+09:00",
   "likes": 46,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#영상과",
    "#상영회"
   ],
   "caption": "카메라 새로 빌렸다",
   "media": [
    {
     "kind": "photo",
     "scene": "camera",
     "palette": [
      "#dfe3e7",
      "#9aa4ad",
      "#3d454c"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0254",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-02-27T18:52:00+09:00",
   "likes": 203,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-02-27T20:08:30.371087+09:00",
     "body": "오늘도 화이팅"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2026-02-28T06:22:47.158896+09:00",
     "body": "응원합니다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#한서대",
    "#경영학과"
   ],
   "body": "학과 단톡 공지 확인 부탁드립니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0255",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2026-02-28T15:59:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-02-28T20:51:54.925295+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#고3",
    "#새내기"
   ],
   "body": "야자실에서 라면 먹는 게 유일한 낙",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0256",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2026-03-01T14:10:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-01T18:11:31.654261+09:00",
     "body": "좋다"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-02T11:01:10.028937+09:00",
     "body": "힘내"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#동창"
   ],
   "body": "요즘 뭐 하고 지내? 나는 집에서 쉬는 중",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0257",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-03-01T14:34:00+09:00",
   "likes": 96,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-01T22:03:08.298171+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말농구",
    "#코트",
    "#슛"
   ],
   "caption": "농구 대신 러닝",
   "media": [
    {
     "kind": "photo",
     "scene": "run",
     "palette": [
      "#dbe9db",
      "#91b98f",
      "#3f5f3d"
     ]
    }
   ],
   "place": "성원천 운동장"
  },
  {
   "id": "LBP-0258",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-03-01T15:40:00+09:00",
   "likes": 147,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-02T01:32:55.368201+09:00",
     "body": "이번 주 나갈 사람?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#골목",
    "#성원동",
    "#동네소식"
   ],
   "caption": "성원동 골목 소식",
   "media": [
    {
     "kind": "photo",
     "scene": "sports",
     "palette": [
      "#d9e8cf",
      "#8bb37a",
      "#36502f"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0259",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-03-01T15:56:00+09:00",
   "likes": 15,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#한서대"
   ],
   "caption": "새내기 친구들이랑 첫 모임",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0260",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-03-01T20:05:00+09:00",
   "likes": 247,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#음악"
   ],
   "body": "오늘의 한 곡",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0261",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2026-03-02T06:54:00+09:00",
   "likes": 23,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-02T09:10:52.649261+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#과제",
    "#학식"
   ],
   "caption": "오늘 하늘 진짜 맑음",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0262",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2026-03-02T16:11:00+09:00",
   "likes": 22,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#수강신청",
    "#학식"
   ],
   "caption": "전공책 드디어 샀다",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "한서대 중앙도서관"
  },
  {
   "id": "LBP-0263",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-03-02T20:03:00+09:00",
   "likes": 68,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-03T07:24:12.479843+09:00",
     "body": "이거 뭐야"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원천",
    "#기록",
    "#오운완"
   ],
   "body": "오늘은 7km",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0264",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-03-02T23:44:00+09:00",
   "likes": 32,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-03T00:32:15.562478+09:00",
     "body": "나도 가고 싶다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#새내기"
   ],
   "caption": "수업 끝나고 카페에서 과제",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0265",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-03-03T01:22:00+09:00",
   "likes": 28,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#세탁",
    "#동네가게"
   ],
   "caption": "오늘 맡긴 옷은 내일 찾아가세요",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동 세탁소"
  },
  {
   "id": "LBP-0266",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2026-03-03T15:03:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-03T18:47:40.629618+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#수강신청"
   ],
   "body": "개강 첫날, 생각보다 정신없다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0267",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-03-03T20:13:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-03-03T20:56:19.837345+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#한서대",
    "#학식"
   ],
   "body": "개강 첫날, 생각보다 정신없다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0268",
   "kind": "text",
   "author": "yuna.lee",
   "createdAt": "2026-03-03T23:04:00+09:00",
   "likes": 50,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2026-03-04T01:21:57.357442+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#한서대",
    "#수강신청"
   ],
   "body": "개강 첫날, 생각보다 정신없다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0269",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-03-04T01:58:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-04T16:17:43.684704+09:00",
     "body": "분위기 좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#경영26"
   ],
   "caption": "수업 끝나고 카페에서 과제",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "한서대 앞 카페"
  },
  {
   "id": "LBP-0270",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-04T20:38:00+09:00",
   "likes": 27,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네카페",
    "#디저트",
    "#성원동카페"
   ],
   "caption": "오늘의 원두 소개합니다",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0271",
   "kind": "text",
   "author": "lens.minho",
   "createdAt": "2026-03-04T22:55:00+09:00",
   "likes": 13,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-03-05T04:26:36.333629+09:00",
     "body": "좋다"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-05T12:59:11.532965+09:00",
     "body": "힘내"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#촬영",
    "#편집"
   ],
   "body": "촬영 테스트",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0272",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2026-03-05T01:13:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-05T05:10:40.573115+09:00",
     "body": "다들 언제 모여?"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-05T13:01:26.320948+09:00",
     "body": "즐거워 보인다"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-05T14:48:16.875878+09:00",
     "body": "다음엔 나도 불러줘"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#모의고사"
   ],
   "caption": "오랜만에 모인 얼굴들",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0273",
   "kind": "text",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-05T10:36:00+09:00",
   "likes": 77,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#운동",
    "#헬스",
    "#성원동헬스장"
   ],
   "body": "등록 문의 환영합니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0274",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-03-05T21:55:00+09:00",
   "likes": 109,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2026-03-05T22:51:47.149862+09:00",
     "body": "공감"
    },
    {
     "author": "hoops.log",
     "createdAt": "2026-03-05T23:15:51.469182+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#패치",
    "#한판만"
   ],
   "body": "랭크 올렸다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0275",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-03-05T22:04:00+09:00",
   "likes": 49,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#분식",
    "#동네맛집",
    "#성원동분식"
   ],
   "caption": "오늘 메뉴 준비 완료",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0276",
   "kind": "text",
   "author": "yeseul.hong",
   "createdAt": "2026-03-05T22:49:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-06T07:41:34.213161+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말",
    "#알바",
    "#성원고"
   ],
   "body": "오늘 알바 끝나고 집 가는 길",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0277",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-03-05T22:55:00+09:00",
   "likes": 88,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-06T03:49:29.066864+09:00",
     "body": "하늘 예쁘다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#편집"
   ],
   "caption": "촬영 가는 길 하늘",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0278",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2026-03-05T23:35:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-06T10:16:36.060121+09:00",
     "body": "오늘 날씨 좋더라"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#졸업"
   ],
   "caption": "오늘 하늘 예쁨",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원고 운동장"
  },
  {
   "id": "LBP-0279",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-06T00:37:00+09:00",
   "likes": 733,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#웃김",
    "#밈",
    "#짤"
   ],
   "body": "오늘도 웃고 갑니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0280",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-03-06T00:54:00+09:00",
   "likes": 23,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-03-06T04:11:23.593798+09:00",
     "body": "몇 시까지 했어?"
    },
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-03-06T13:50:52.685564+09:00",
     "body": "나도 집중해야 하는데"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#필름",
    "#영상과"
   ],
   "caption": "시나리오 수정 중",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0281",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2026-03-06T22:48:00+09:00",
   "likes": 21,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#졸업",
    "#동창"
   ],
   "body": "요즘 뭐 하고 지내? 나는 집에서 쉬는 중",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0282",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-03-06T23:42:00+09:00",
   "likes": 308,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#전술",
    "#주말축구",
    "#경기리뷰"
   ],
   "body": "오늘 경기 재밌었다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0283",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2026-03-07T01:50:00+09:00",
   "likes": 608,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-07T02:29:12.764503+09:00",
     "body": "좋다"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-07T10:02:02.996585+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#캠퍼스",
    "#한서대"
   ],
   "body": "새내기 환영 행사 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0284",
   "kind": "photo",
   "author": "seungwoo.bae",
   "createdAt": "2026-03-07T13:21:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-08T13:29:03.656388+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#대학생",
    "#동창"
   ],
   "caption": "동창 모임에서 고기",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0285",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2026-03-07T22:01:00+09:00",
   "likes": 8,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#훈련소",
    "#군대"
   ],
   "caption": "동네 골목 불빛",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0286",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-07T23:00:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-08T00:06:51.922321+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#성원고",
    "#군대"
   ],
   "body": "입대 날짜 나왔다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0287",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2026-03-07T23:06:00+09:00",
   "likes": 67,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-08T04:23:00.602018+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#성원구",
    "#청년센터"
   ],
   "caption": "청년 프로그램 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "notice",
     "palette": [
      "#e9eef3",
      "#aab7c4",
      "#46515c"
     ]
    }
   ],
   "place": "성원구 청년센터"
  },
  {
   "id": "LBP-0288",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2026-03-08T00:02:00+09:00",
   "likes": 62,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-08T03:07:02.141606+09:00",
     "body": "책상 깔끔하다"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-08T12:32:20.018036+09:00",
     "body": "화이팅"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-03-09T00:19:01.473941+09:00",
     "body": "몇 시까지 했어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청",
    "#한서대"
   ],
   "caption": "1교시 필기 시작",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "한서대 중앙도서관"
  },
  {
   "id": "LBP-0289",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2026-03-08T00:25:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-08T04:56:10.173275+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#한서대"
   ],
   "body": "개강 첫날, 생각보다 정신없다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0290",
   "kind": "text",
   "author": "yeseul.hong",
   "createdAt": "2026-03-08T00:29:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-08T00:45:21.428870+09:00",
     "body": "멋지네요"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2026-03-09T00:37:50.384506+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동창",
    "#성원고",
    "#주말"
   ],
   "body": "이번 주 알바 스케줄 겨우 짰다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0291",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-08T09:06:00+09:00",
   "likes": 592,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-03-08T12:36:09.182716+09:00",
     "body": "확인했습니다"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-09T05:00:20.593938+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#웃김"
   ],
   "body": "이거 왜 웃기지",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0292",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2026-03-08T09:28:00+09:00",
   "likes": 12,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#성원고"
   ],
   "caption": "재수 학원 교재",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0293",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-08T17:13:00+09:00",
   "likes": 39,
   "comments": [
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-08T22:50:03.305534+09:00",
     "body": "컷 좋다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#필름"
   ],
   "caption": "오늘 촬영 끝",
   "media": [
    {
     "kind": "photo",
     "scene": "film",
     "palette": [
      "#3c3a44",
      "#76717f",
      "#17161b"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0294",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-03-08T18:32:00+09:00",
   "likes": 302,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-03-09T14:19:10.455486+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구",
    "#주말축구"
   ],
   "body": "주말 경기 일정",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0295",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-03-08T22:17:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-09T08:31:19.889058+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청",
    "#경영26"
   ],
   "body": "1교시 9시는 진짜 너무하다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0296",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2026-03-08T22:25:00+09:00",
   "likes": 309,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#공지",
    "#캠퍼스"
   ],
   "body": "학생회관 운영 시간 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0297",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2026-03-08T23:22:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-09T15:42:45.943856+09:00",
     "body": "경기 언제야?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#야자",
    "#재수",
    "#성원고"
   ],
   "caption": "주말에 축구",
   "media": [
    {
     "kind": "photo",
     "scene": "sports",
     "palette": [
      "#d9e8cf",
      "#8bb37a",
      "#36502f"
     ]
    }
   ],
   "place": "성원동 풋살장"
  },
  {
   "id": "LBP-0298",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2026-03-09T01:06:00+09:00",
   "likes": 23,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-09T04:53:20.571730+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#새내기",
    "#수강신청"
   ],
   "body": "1교시 9시는 진짜 너무하다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0299",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-03-09T01:06:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-09T05:42:36.118662+09:00",
     "body": "무대 좋다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#필름",
    "#편집"
   ],
   "caption": "상영회 리허설",
   "media": [
    {
     "kind": "photo",
     "scene": "stage",
     "palette": [
      "#241f2e",
      "#4b3a5e",
      "#120f18"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0300",
   "kind": "photo",
   "author": "game.loop",
   "createdAt": "2026-03-09T01:43:00+09:00",
   "likes": 414,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한판만",
    "#게임",
    "#게임리뷰"
   ],
   "caption": "게임하다가 웃긴 짤",
   "media": [
    {
     "kind": "photo",
     "scene": "meme",
     "palette": [
      "#f7e7a8",
      "#e2b84d",
      "#6b5314"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0301",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-03-09T14:02:00+09:00",
   "likes": 37,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#코트",
    "#슛"
   ],
   "caption": "오늘은 러닝으로",
   "media": [
    {
     "kind": "photo",
     "scene": "run",
     "palette": [
      "#dbe9db",
      "#91b98f",
      "#3f5f3d"
     ]
    }
   ],
   "place": "성원천 운동장"
  },
  {
   "id": "LBP-0302",
   "kind": "text",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-09T14:18:00+09:00",
   "likes": 40,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-09T22:08:48.711494+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네헬스",
    "#운동"
   ],
   "body": "저녁 시간대 붐빕니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0303",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-09T19:55:00+09:00",
   "likes": 48,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-10T14:22:47.639625+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#디저트",
    "#성원동카페",
    "#동네카페"
   ],
   "caption": "새 디저트 나왔어요",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0304",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-03-09T22:25:00+09:00",
   "likes": 34,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식",
    "#과제"
   ],
   "caption": "학식 오늘 진짜 괜찮았음",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0305",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-03-10T08:52:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2026-03-11T02:12:55.889909+09:00",
     "body": "여기 어디야?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과",
    "#상영회",
    "#단편영화"
   ],
   "caption": "편집하다가 카페로",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0306",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-03-10T10:07:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-10T15:45:03.262607+09:00",
     "body": "어디야?"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-03-10T18:33:43.430114+09:00",
     "body": "좋아요"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-03-10T22:02:12.505520+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식",
    "#경영26",
    "#새내기"
   ],
   "caption": "학식 오늘 진짜 괜찮았음",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0307",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-03-10T18:52:00+09:00",
   "likes": 114,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원천",
    "#러닝",
    "#기록"
   ],
   "body": "러닝화 새로 샀다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0308",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-03-10T20:10:00+09:00",
   "likes": 27,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-10T21:40:55.127099+09:00",
     "body": "나도 배고파"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#학식",
    "#과제"
   ],
   "caption": "학식 오늘 진짜 괜찮았음",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "한서대 앞 식당"
  },
  {
   "id": "LBP-0309",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2026-03-10T21:04:00+09:00",
   "likes": 13,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-11T01:35:54.483672+09:00",
     "body": "힘내"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#대학생",
    "#성원고"
   ],
   "body": "요즘 뭐 하고 지내? 나는 집에서 쉬는 중",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0310",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-03-10T22:20:00+09:00",
   "likes": 64,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-11T03:20:20.892873+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동분식",
    "#분식",
    "#떡볶이"
   ],
   "caption": "새 떡볶이 레시피 도전 중",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0311",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-10T23:59:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-11T14:57:38.967129+09:00",
     "body": "감성 좋다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#훈련소",
    "#입대"
   ],
   "caption": "동네 골목 불빛",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원고 정문"
  },
  {
   "id": "LBP-0312",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2026-03-11T00:03:00+09:00",
   "likes": 37,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-11T12:13:01.731376+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#동창",
    "#대학생"
   ],
   "caption": "재수 학원 교재",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "성원고 도서관"
  },
  {
   "id": "LBP-0313",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-03-11T00:22:00+09:00",
   "likes": 30,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-11T03:38:57.259156+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#수선"
   ],
   "caption": "오늘 맡긴 옷은 내일 찾아가세요",
   "media": [
    {
     "kind": "photo",
     "scene": "flowers",
     "palette": [
      "#f6e3ea",
      "#dca9bd",
      "#7a4b5d"
     ]
    }
   ],
   "place": "성원동 세탁소"
  },
  {
   "id": "LBP-0314",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2026-03-11T00:50:00+09:00",
   "likes": 23,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#학식",
    "#과제"
   ],
   "body": "개강 첫날, 생각보다 정신없다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0315",
   "kind": "photo",
   "author": "music.drawer",
   "createdAt": "2026-03-11T01:08:00+09:00",
   "likes": 222,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플레이리스트",
    "#오늘의노래",
    "#플리"
   ],
   "caption": "카페에서 듣는 플리",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0316",
   "kind": "photo",
   "author": "biz.hanseo",
   "createdAt": "2026-03-11T17:50:00+09:00",
   "likes": 144,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2026-03-11T21:33:22.239122+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#공지"
   ],
   "caption": "학과 자료실 운영 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0317",
   "kind": "photo",
   "author": "seungwoo.bae",
   "createdAt": "2026-03-11T19:16:00+09:00",
   "likes": 36,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#성원고"
   ],
   "caption": "동네 마트",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동 편의점"
  },
  {
   "id": "LBP-0318",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2026-03-11T20:52:00+09:00",
   "likes": 30,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#학식",
    "#한서대"
   ],
   "caption": "학식 오늘 진짜 괜찮았음",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0319",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2026-03-11T21:13:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-03-12T08:17:05.148950+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#군대",
    "#입대",
    "#성원고"
   ],
   "caption": "오늘 하늘 예쁨",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0320",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2026-03-11T21:26:00+09:00",
   "likes": 50,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영26",
    "#새내기",
    "#과제"
   ],
   "body": "개강 첫날, 생각보다 정신없다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0321",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2026-03-11T22:26:00+09:00",
   "likes": 42,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-12T00:25:09.488246+09:00",
     "body": "이거 뭐야"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#프로그램",
    "#청년센터"
   ],
   "caption": "청년 프로그램 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "market",
     "palette": [
      "#efe8d8",
      "#cbb78f",
      "#67583a"
     ]
    }
   ],
   "place": "성원구 청년센터"
  },
  {
   "id": "LBP-0322",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-03-11T22:57:00+09:00",
   "likes": 69,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과",
    "#촬영"
   ],
   "caption": "시나리오 수정 중",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0323",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-03-12T00:21:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-12T00:29:14.471284+09:00",
     "body": "하늘 예쁘다"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-12T09:16:44.237741+09:00",
     "body": "오늘 날씨 좋더라"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#학식"
   ],
   "caption": "오늘 하늘 진짜 맑음",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0324",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-03-12T00:34:00+09:00",
   "likes": 106,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원천",
    "#동네소식"
   ],
   "caption": "성원동 골목 소식",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0325",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-03-12T01:11:00+09:00",
   "likes": 30,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2026-03-12T02:39:54.864246+09:00",
     "body": "좋아요"
    },
    {
     "author": "film.sua",
     "createdAt": "2026-03-12T05:46:50.551686+09:00",
     "body": "상영회 기대된다"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-03-12T19:01:18.337485+09:00",
     "body": "리허설 화이팅"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#필름"
   ],
   "caption": "상영회 리허설",
   "media": [
    {
     "kind": "photo",
     "scene": "stage",
     "palette": [
      "#241f2e",
      "#4b3a5e",
      "#120f18"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0326",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2026-03-12T01:14:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2026-03-12T05:49:41.638591+09:00",
     "body": "다음에 같이 하자"
    },
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-12T13:09:02.597350+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-13T02:18:09.056351+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#수강신청",
    "#과제"
   ],
   "body": "1교시 9시는 진짜 너무하다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0327",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-03-12T01:18:00+09:00",
   "likes": 39,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-03-12T02:02:13.952882+09:00",
     "body": "상영회 언제야?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#촬영"
   ],
   "caption": "오늘 촬영 장비 점검",
   "media": [
    {
     "kind": "photo",
     "scene": "camera",
     "palette": [
      "#dfe3e7",
      "#9aa4ad",
      "#3d454c"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0328",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2026-03-12T01:54:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-12T14:03:03.740879+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#동창"
   ],
   "body": "오늘은 친구랑 오랜만에 만났다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0329",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-03-12T18:17:00+09:00",
   "likes": 128,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#기록",
    "#성원천"
   ],
   "body": "기록 갱신",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0330",
   "kind": "text",
   "author": "bunsik.house",
   "createdAt": "2026-03-12T19:19:00+09:00",
   "likes": 42,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-12T23:59:45.109215+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#분식",
    "#성원동분식"
   ],
   "body": "오늘 영업시간 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0331",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2026-03-12T20:37:00+09:00",
   "likes": 16,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#모의고사",
    "#성원고"
   ],
   "caption": "재수 학원 자리",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "성원동 독서실"
  },
  {
   "id": "LBP-0332",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-03-12T21:22:00+09:00",
   "likes": 6,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-13T18:00:43.074556+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#과제",
    "#경영26"
   ],
   "caption": "학식 오늘 진짜 괜찮았음",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0333",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-03-12T22:01:00+09:00",
   "likes": 11,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-12T22:44:56.925719+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청",
    "#학식",
    "#경영26"
   ],
   "caption": "학식 오늘 진짜 괜찮았음",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "한서대 앞 식당"
  },
  {
   "id": "LBP-0334",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2026-03-12T23:33:00+09:00",
   "likes": 13,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-12T23:57:26.971605+09:00",
     "body": "힘내"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-13T21:58:45.877991+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청",
    "#새내기",
    "#과제"
   ],
   "body": "개강 첫날, 생각보다 정신없다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0335",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2026-03-12T23:45:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-13T03:10:17.250600+09:00",
     "body": "야경 예쁘다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#새내기"
   ],
   "caption": "도서관 나오니 벌써 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "한서대 정문"
  },
  {
   "id": "LBP-0336",
   "kind": "photo",
   "author": "game.loop",
   "createdAt": "2026-03-13T00:08:00+09:00",
   "likes": 136,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-13T04:20:35.311169+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#패치",
    "#게임"
   ],
   "caption": "게임하다가 운동 나옴",
   "media": [
    {
     "kind": "photo",
     "scene": "run",
     "palette": [
      "#dbe9db",
      "#91b98f",
      "#3f5f3d"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0337",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2026-03-13T00:29:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-13T01:40:54.947580+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#훈련소",
    "#성원고",
    "#입대"
   ],
   "body": "입대 날짜 나왔다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0338",
   "kind": "text",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-13T00:32:00+09:00",
   "likes": 62,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-13T01:41:58.255853+09:00",
     "body": "다음에 같이 하자"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-13T05:28:03.401971+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#디저트",
    "#성원동카페",
    "#커피"
   ],
   "body": "주말 영업시간 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0339",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2026-03-13T01:02:00+09:00",
   "likes": 37,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-03-13T03:24:05.949208+09:00",
     "body": "멋지네요"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-13T15:56:44.032981+09:00",
     "body": "확인했습니다"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-13T16:43:00.826189+09:00",
     "body": "힘내"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터",
    "#공지",
    "#성원구"
   ],
   "body": "이번 주 프로그램 신청 받습니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0340",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-03-13T01:06:00+09:00",
   "likes": 106,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#음악",
    "#플레이리스트"
   ],
   "body": "기분 좋아지는 플리",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0341",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-03-13T01:41:00+09:00",
   "likes": 310,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#전술",
    "#축구",
    "#경기리뷰"
   ],
   "body": "골키퍼 선방 모음",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0342",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-03-13T01:51:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-13T06:06:19.772218+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#수강신청"
   ],
   "caption": "수업 끝나고 친구랑 분식",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0343",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2026-03-13T17:00:00+09:00",
   "likes": 57,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-03-13T18:53:26.106856+09:00",
     "body": "멋지네요"
    },
    {
     "author": "football.talk",
     "createdAt": "2026-03-14T01:42:20.231713+09:00",
     "body": "확인했습니다"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-14T03:05:26.707972+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#슛",
    "#농구"
   ],
   "body": "이번 주 경기",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0344",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-03-13T18:15:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-13T21:03:27.663696+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수선",
    "#동네가게"
   ],
   "caption": "가게 앞 꽃",
   "media": [
    {
     "kind": "photo",
     "scene": "flowers",
     "palette": [
      "#f6e3ea",
      "#dca9bd",
      "#7a4b5d"
     ]
    }
   ],
   "place": "성원동 세탁소"
  },
  {
   "id": "LBP-0345",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-13T20:17:00+09:00",
   "likes": 6,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2026-03-14T11:15:16.157291+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#군대"
   ],
   "caption": "동창 모임에서 고기",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 식당"
  },
  {
   "id": "LBP-0346",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-03-13T22:19:00+09:00",
   "likes": 27,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#상영회",
    "#촬영"
   ],
   "caption": "오늘 촬영 장비 점검",
   "media": [
    {
     "kind": "photo",
     "scene": "camera",
     "palette": [
      "#dfe3e7",
      "#9aa4ad",
      "#3d454c"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0347",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2026-03-13T23:30:00+09:00",
   "likes": 144,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#캠퍼스",
    "#한서대",
    "#총학생회"
   ],
   "body": "이번 주 캠퍼스 소식",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0348",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2026-03-14T00:12:00+09:00",
   "likes": 28,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말",
    "#동창",
    "#알바"
   ],
   "caption": "동창 모임에서 고기",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0349",
   "kind": "photo",
   "author": "seungwoo.bae",
   "createdAt": "2026-03-14T00:38:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2026-03-14T02:07:54.029767+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동창",
    "#성원고",
    "#대학생"
   ],
   "caption": "오랜만에 만나서 먹은 밥",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 식당"
  },
  {
   "id": "LBP-0350",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2026-03-14T00:56:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2026-03-14T14:38:46.179832+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동창",
    "#성원고"
   ],
   "caption": "동창 모임에서 고기",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0351",
   "kind": "text",
   "author": "daily.seongwon",
   "createdAt": "2026-03-14T01:54:00+09:00",
   "likes": 88,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-14T03:38:00.130639+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#골목",
    "#동네소식"
   ],
   "body": "새로 문 연 가게 소개",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0352",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-03-14T13:07:00+09:00",
   "likes": 30,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-14T13:34:04.835544+09:00",
     "body": "맛있겠다"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-03-14T14:20:19.166471+09:00",
     "body": "어디야?"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-14T21:47:06.856963+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#수강신청",
    "#과제"
   ],
   "caption": "수업 끝나고 친구랑 분식",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0353",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-03-14T14:27:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-03-15T03:44:15.009435+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영26",
    "#과제",
    "#학식"
   ],
   "caption": "오늘 하늘 진짜 맑음",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0354",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-14T16:50:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-14T18:18:18.898976+09:00",
     "body": "멋지네요"
    },
    {
     "author": "meme.box",
     "createdAt": "2026-03-14T21:32:39.687259+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네헬스",
    "#헬스"
   ],
   "caption": "이번 주 운동 시간 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "gym",
     "palette": [
      "#dedede",
      "#a5a5a5",
      "#4a4a4a"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0355",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2026-03-14T17:07:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-14T21:57:24.854235+09:00",
     "body": "나도 배고파"
    },
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-14T22:20:12.130390+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-15T03:36:04.789777+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동창",
    "#대학생"
   ],
   "caption": "동창 모임에서 고기",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 식당"
  },
  {
   "id": "LBP-0356",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-03-14T18:01:00+09:00",
   "likes": 201,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-03-14T19:06:43.306092+09:00",
     "body": "좋아요"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-14T22:52:46.295088+09:00",
     "body": "멋지네요"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-15T01:17:42.900869+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학생회",
    "#경영학과",
    "#공지"
   ],
   "body": "경영학과 새내기 환영합니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0357",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-14T18:35:00+09:00",
   "likes": 704,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#웃김",
    "#밈",
    "#오늘의밈"
   ],
   "body": "밈 하나 올리고 갑니다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0358",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-14T18:48:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-14T19:32:01.874791+09:00",
     "body": "디자인 좋다"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-14T21:30:10.068940+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#필름"
   ],
   "caption": "상영회 포스터 나왔다",
   "media": [
    {
     "kind": "photo",
     "scene": "poster",
     "palette": [
      "#f1e7d0",
      "#c6a56a",
      "#5f4a25"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0359",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-03-14T20:58:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-15T00:18:22.084769+09:00",
     "body": "공감"
    },
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-15T02:03:44.627778+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영26",
    "#수강신청",
    "#새내기"
   ],
   "body": "경제학원론 첫 수업 듣고 옴",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0360",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2026-03-14T21:48:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-15T01:01:32.947702+09:00",
     "body": "힘내"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#새내기",
    "#수강신청"
   ],
   "body": "1교시 9시는 진짜 너무하다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0361",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-03-14T22:49:00+09:00",
   "likes": 96,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2026-03-14T23:08:18.158614+09:00",
     "body": "확인했습니다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플레이리스트",
    "#플리"
   ],
   "body": "카페에서 듣던 노래",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0362",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2026-03-14T22:51:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-15T02:43:18.816670+09:00",
     "body": "우리도 보자"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-15T03:51:48.936260+09:00",
     "body": "다들 언제 모여?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#동창"
   ],
   "caption": "오랜만에 모인 얼굴들",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0363",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-14T22:57:00+09:00",
   "likes": 48,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-15T02:39:16.322504+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#헬스",
    "#운동"
   ],
   "caption": "새 기구 들어왔어요",
   "media": [
    {
     "kind": "photo",
     "scene": "gym",
     "palette": [
      "#dedede",
      "#a5a5a5",
      "#4a4a4a"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0364",
   "kind": "text",
   "author": "frame.hana",
   "createdAt": "2026-03-14T23:22:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-03-15T00:01:12.781283+09:00",
     "body": "다음에 같이 하자"
    },
    {
     "author": "lens.minho",
     "createdAt": "2026-03-15T00:33:49.463555+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#영상과",
    "#단편영화"
   ],
   "body": "상영회 준비",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0365",
   "kind": "text",
   "author": "yuna.lee",
   "createdAt": "2026-03-14T23:52:00+09:00",
   "likes": 15,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청",
    "#학식"
   ],
   "body": "1교시 9시는 진짜 너무하다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0366",
   "kind": "text",
   "author": "laundry.seongwon",
   "createdAt": "2026-03-15T00:25:00+09:00",
   "likes": 33,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#수선",
    "#성원동세탁소"
   ],
   "body": "겨울옷 보관 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0367",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2026-03-15T00:28:00+09:00",
   "likes": 39,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-15T01:55:56.523187+09:00",
     "body": "하늘 예쁘다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#경영26"
   ],
   "caption": "캠퍼스 하늘",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0368",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-15T00:35:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-15T02:21:10.914452+09:00",
     "body": "나도 과자 먹고 싶다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#군대"
   ],
   "caption": "동네 마트",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동 마트"
  },
  {
   "id": "LBP-0369",
   "kind": "text",
   "author": "cut.jaehyun",
   "createdAt": "2026-03-15T01:18:00+09:00",
   "likes": 35,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#단편영화"
   ],
   "body": "러프컷 확인 중",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0370",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2026-03-15T01:32:00+09:00",
   "likes": 13,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#졸업",
    "#성원고"
   ],
   "body": "대학 생활 생각보다 바쁘다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0371",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2026-03-15T01:57:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-15T02:18:35.364768+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#주말",
    "#동창"
   ],
   "caption": "막차",
   "media": [
    {
     "kind": "photo",
     "scene": "bus",
     "palette": [
      "#d7e2ea",
      "#8ea6b8",
      "#4a5e6d"
     ]
    }
   ],
   "place": "성원동 정류장"
  },
  {
   "id": "LBP-0372",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-03-15T07:04:00+09:00",
   "likes": 42,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-16T09:57:08.527914+09:00",
     "body": "경기 언제야?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#농구",
    "#슛"
   ],
   "caption": "주말 농구장",
   "media": [
    {
     "kind": "photo",
     "scene": "court",
     "palette": [
      "#e8d9c8",
      "#bd9871",
      "#5f4630"
     ]
    }
   ],
   "place": "성원천 운동장"
  },
  {
   "id": "LBP-0373",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-15T17:04:00+09:00",
   "likes": 99,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-15T23:55:48.824919+09:00",
     "body": "좋아요"
    },
    {
     "author": "game.loop",
     "createdAt": "2026-03-16T17:00:25.365313+09:00",
     "body": "멋지네요"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-16T23:14:56.669336+09:00",
     "body": "오늘 영업해?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동네카페",
    "#디저트",
    "#성원동카페"
   ],
   "caption": "오늘의 원두 소개합니다",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0374",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-03-15T18:24:00+09:00",
   "likes": 233,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영학과",
    "#학생회",
    "#공지"
   ],
   "body": "이번 주 조별 과제 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0375",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2026-03-15T19:21:00+09:00",
   "likes": 455,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-17T02:35:21.750068+09:00",
     "body": "포스터 예쁘다"
    },
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-17T07:07:30.304399+09:00",
     "body": "상영회 언제야?"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#캠퍼스",
    "#총학생회",
    "#공지"
   ],
   "caption": "개강 주간 행사 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "poster",
     "palette": [
      "#f1e7d0",
      "#c6a56a",
      "#5f4a25"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0376",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-03-15T19:43:00+09:00",
   "likes": 41,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-16T03:55:25.286572+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#떡볶이",
    "#성원동분식"
   ],
   "caption": "주말에는 재료가 일찍 떨어져요",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0377",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-03-15T22:55:00+09:00",
   "likes": 134,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#패치",
    "#게임리뷰",
    "#게임"
   ],
   "body": "게임 ost 좋다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0378",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2026-03-15T23:23:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-17T06:03:17.173048+09:00",
     "body": "공감"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-17T08:06:33.764086+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원고",
    "#동창"
   ],
   "body": "오늘은 친구랑 오랜만에 만났다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0379",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-15T23:44:00+09:00",
   "likes": 43,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-03-16T13:12:54.488217+09:00",
     "body": "상영회 언제야?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#단편영화",
    "#필름"
   ],
   "caption": "포스터 붙이는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "poster",
     "palette": [
      "#f1e7d0",
      "#c6a56a",
      "#5f4a25"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0380",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-03-15T23:47:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-16T16:35:42.994614+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#과제"
   ],
   "caption": "수업 끝나고 친구랑 분식",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "한서대 앞 식당"
  },
  {
   "id": "LBP-0381",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-16T00:27:00+09:00",
   "likes": 299,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#짤",
    "#밈",
    "#오늘의밈"
   ],
   "body": "오늘의 짤",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0382",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2026-03-16T00:38:00+09:00",
   "likes": 9,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제",
    "#수강신청",
    "#경영26"
   ],
   "caption": "오늘 하늘 진짜 맑음",
   "media": [
    {
     "kind": "photo",
     "scene": "sky",
     "palette": [
      "#dceaf7",
      "#9ec4e8",
      "#4e7aa8"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0383",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2026-03-16T01:04:00+09:00",
   "likes": 46,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#수강신청"
   ],
   "body": "경제학원론 첫 수업 듣고 옴",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0384",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-03-16T01:46:00+09:00",
   "likes": 23,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-03-16T03:37:38.215786+09:00",
     "body": "디자인 좋다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#편집",
    "#필름",
    "#촬영"
   ],
   "caption": "상영회 포스터 나왔다",
   "media": [
    {
     "kind": "photo",
     "scene": "poster",
     "palette": [
      "#f1e7d0",
      "#c6a56a",
      "#5f4a25"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0385",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2026-03-16T11:30:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-17T03:20:36.336288+09:00",
     "body": "즐거워 보인다"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-17T07:12:20.139346+09:00",
     "body": "다음엔 나도 불러줘"
    },
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-17T08:23:56.295867+09:00",
     "body": "우리도 보자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#학식",
    "#새내기"
   ],
   "caption": "새내기 친구들이랑 첫 모임",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0386",
   "kind": "text",
   "author": "seojin.yoon",
   "createdAt": "2026-03-16T11:35:00+09:00",
   "likes": 5,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-17T13:09:03.008971+09:00",
     "body": "힘내"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#모의고사",
    "#재수",
    "#성원고"
   ],
   "body": "재수 학원 첫날인데 벌써 지침",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0387",
   "kind": "text",
   "author": "seungwoo.bae",
   "createdAt": "2026-03-16T12:34:00+09:00",
   "likes": 25,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#대학생",
    "#졸업"
   ],
   "body": "요즘 뭐 하고 지내? 나는 집에서 쉬는 중",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0388",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2026-03-16T16:26:00+09:00",
   "likes": 84,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#공지",
    "#성원구",
    "#청년센터"
   ],
   "caption": "이번 주 프로그램 신청 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "market",
     "palette": [
      "#efe8d8",
      "#cbb78f",
      "#67583a"
     ]
    }
   ],
   "place": "성원구 청년센터"
  },
  {
   "id": "LBP-0389",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2026-03-16T16:56:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-17T03:52:53.984410+09:00",
     "body": "다음에 같이 하자"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-17T13:58:11.735799+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#군대",
    "#성원고",
    "#입대"
   ],
   "body": "훈련소 가기 전에 머리 깎았다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0390",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-03-16T18:06:00+09:00",
   "likes": 38,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제",
    "#새내기",
    "#경영26"
   ],
   "caption": "학교 앞 카페 새로 생겼다",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0391",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-03-16T19:02:00+09:00",
   "likes": 335,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경기리뷰",
    "#전술"
   ],
   "body": "중원 싸움이 핵심",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0392",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-03-16T21:00:00+09:00",
   "likes": 126,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-03-17T01:44:32.441173+09:00",
     "body": "확인했습니다"
    },
    {
     "author": "music.drawer",
     "createdAt": "2026-03-17T18:42:32.346771+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원천",
    "#기록",
    "#오운완"
   ],
   "body": "천천히 30분",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0393",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-03-16T22:15:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-03-17T00:28:55.431079+09:00",
     "body": "좋아요"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-17T06:19:26.364086+09:00",
     "body": "나도 집중해야 하는데"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제",
    "#한서대",
    "#새내기"
   ],
   "caption": "1교시 필기 시작",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "한서대 중앙도서관"
  },
  {
   "id": "LBP-0394",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-03-16T23:28:00+09:00",
   "likes": 87,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원천",
    "#동네소식"
   ],
   "caption": "성원동 골목 소식",
   "media": [
    {
     "kind": "photo",
     "scene": "store",
     "palette": [
      "#efe4d2",
      "#c7ab84",
      "#6b5437"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0395",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2026-03-16T23:45:00+09:00",
   "likes": 41,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-17T16:18:40.099735+09:00",
     "body": "어디야?"
    },
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-17T20:07:58.040705+09:00",
     "body": "나도 배고파"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#수강신청",
    "#한서대"
   ],
   "caption": "학식 오늘 진짜 괜찮았음",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0396",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-03-16T23:50:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-17T03:16:10.743060+09:00",
     "body": "캠퍼스 좋다"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-17T13:03:02.171599+09:00",
     "body": "학교 크다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#수강신청"
   ],
   "caption": "첫 캠퍼스 구경",
   "media": [
    {
     "kind": "photo",
     "scene": "campus",
     "palette": [
      "#cfd9e6",
      "#8ea6bd",
      "#3d566e"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0397",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2026-03-17T00:09:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2026-03-17T07:39:57.284598+09:00",
     "body": "공감"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-17T15:37:41.962214+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#학식",
    "#한서대"
   ],
   "body": "개강 첫날, 생각보다 정신없다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0398",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-03-17T00:21:00+09:00",
   "likes": 58,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2026-03-17T19:23:18.241983+09:00",
     "body": "밤에 뭐 해?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#편집",
    "#촬영",
    "#상영회"
   ],
   "caption": "편집실 창밖",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0399",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2026-03-17T00:34:00+09:00",
   "likes": 23,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-17T11:38:22.190429+09:00",
     "body": "다들 언제 모여?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#한서대"
   ],
   "caption": "새내기 친구들이랑 첫 모임",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0400",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-03-17T01:09:00+09:00",
   "likes": 28,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-03-17T04:17:42.850080+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#학식",
    "#수강신청"
   ],
   "caption": "과방에서 라면 끓여 먹는 중",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0401",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-03-17T01:10:00+09:00",
   "likes": 40,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-17T04:50:52.709232+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-03-17T09:37:46.299500+09:00",
     "body": "이거 뭐야"
    },
    {
     "author": "meme.box",
     "createdAt": "2026-03-17T11:02:05.096416+09:00",
     "body": "응원합니다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원천",
    "#러닝",
    "#기록"
   ],
   "body": "성원천 코스",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0402",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-17T01:17:00+09:00",
   "likes": 63,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동네헬스",
    "#성원동헬스장"
   ],
   "caption": "이번 주 운동 시간 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "flowers",
     "palette": [
      "#f6e3ea",
      "#dca9bd",
      "#7a4b5d"
     ]
    }
   ],
   "place": "성원동 헬스장"
  },
  {
   "id": "LBP-0403",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-03-17T01:26:00+09:00",
   "likes": 27,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-17T03:22:39.893998+09:00",
     "body": "늦게까지 고생"
    },
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-17T15:59:35.890865+09:00",
     "body": "감성 좋다"
    },
    {
     "author": "meme.box",
     "createdAt": "2026-03-17T17:09:33.783934+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#학식"
   ],
   "caption": "도서관 나오니 벌써 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0404",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2026-03-17T03:46:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-17T11:03:59.862098+09:00",
     "body": "야경 예쁘다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#대학생",
    "#성원고"
   ],
   "caption": "동네 골목 불빛",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0405",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-03-17T04:27:00+09:00",
   "likes": 222,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#오늘의노래",
    "#플레이리스트",
    "#음악"
   ],
   "body": "이번 주 플리 정리",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0406",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2026-03-17T05:40:00+09:00",
   "likes": 58,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2026-03-17T15:30:28.451967+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#주말농구",
    "#슛",
    "#코트"
   ],
   "body": "슛 연습 중",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0407",
   "kind": "text",
   "author": "bunsik.house",
   "createdAt": "2026-03-17T07:20:00+09:00",
   "likes": 43,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-17T19:09:40.496690+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원동분식",
    "#분식"
   ],
   "body": "점심시간 대기 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0408",
   "kind": "text",
   "author": "yeseul.hong",
   "createdAt": "2026-03-17T07:58:00+09:00",
   "likes": 23,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동창",
    "#알바"
   ],
   "body": "알바비 들어왔다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0409",
   "kind": "photo",
   "author": "game.loop",
   "createdAt": "2026-03-17T08:20:00+09:00",
   "likes": 317,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-17T15:11:03.390349+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#게임리뷰",
    "#패치",
    "#한판만"
   ],
   "caption": "오늘은 러닝으로 컨디션 조절",
   "media": [
    {
     "kind": "photo",
     "scene": "run",
     "palette": [
      "#dbe9db",
      "#91b98f",
      "#3f5f3d"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0410",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-03-17T10:58:00+09:00",
   "likes": 178,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#축구",
    "#경기리뷰",
    "#주말축구"
   ],
   "body": "이번 주 경기 예상",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0411",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2026-03-17T12:31:00+09:00",
   "likes": 31,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#군대",
    "#성원고",
    "#입대"
   ],
   "body": "편지 받는 게 제일 큰 낙",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-0412",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-17T12:37:00+09:00",
   "likes": 78,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2026-03-17T13:05:40.935451+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원동카페",
    "#디저트",
    "#커피"
   ],
   "caption": "오늘의 원두 소개합니다",
   "media": [
    {
     "kind": "photo",
     "scene": "flowers",
     "palette": [
      "#f6e3ea",
      "#dca9bd",
      "#7a4b5d"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0413",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2026-03-17T14:32:00+09:00",
   "likes": 167,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-17T15:49:10.808189+09:00",
     "body": "좋아요"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-17T19:13:03.098395+09:00",
     "body": "멋지네요"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#프로그램",
    "#청년센터",
    "#성원구"
   ],
   "caption": "청년 프로그램 안내",
   "media": [
    {
     "kind": "photo",
     "scene": "poster",
     "palette": [
      "#f1e7d0",
      "#c6a56a",
      "#5f4a25"
     ]
    }
   ],
   "place": "성원구 청년센터"
  },
  {
   "id": "LBP-0414",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2026-03-17T14:43:00+09:00",
   "likes": 31,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-03-17T18:14:55.816595+09:00",
     "body": "즐거워 보인다"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-17T20:13:59.439488+09:00",
     "body": "다음엔 나도 불러줘"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제",
    "#새내기",
    "#수강신청"
   ],
   "caption": "새내기 친구들이랑 첫 모임",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-0415",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2026-03-17T15:22:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-17T16:13:25.556375+09:00",
     "body": "밤에 뭐 해?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#새내기",
    "#한서대"
   ],
   "caption": "도서관 나오니 벌써 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "한서대 정문"
  },
  {
   "id": "LBP-0416",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-03-17T16:22:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-03-17T20:53:12.498481+09:00",
     "body": "편집 화이팅"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#필름",
    "#촬영"
   ],
   "caption": "오늘 촬영 끝",
   "media": [
    {
     "kind": "photo",
     "scene": "film",
     "palette": [
      "#3c3a44",
      "#76717f",
      "#17161b"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0417",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-17T16:44:00+09:00",
   "likes": 24,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#단편영화",
    "#필름"
   ],
   "caption": "편집실 야근",
   "media": [
    {
     "kind": "photo",
     "scene": "film",
     "palette": [
      "#3c3a44",
      "#76717f",
      "#17161b"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-0418",
   "kind": "photo",
   "author": "biz.hanseo",
   "createdAt": "2026-03-17T18:16:00+09:00",
   "likes": 114,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-03-17T19:03:59.573569+09:00",
     "body": "오늘도 공부 중이네"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영학과",
    "#한서대",
    "#학생회"
   ],
   "caption": "새내기 OT 장소 공지",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "한서대학교"
  },
  {
   "id": "LBP-0419",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-03-17T18:25:00+09:00",
   "likes": 143,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원천",
    "#성원동",
    "#동네소식"
   ],
   "caption": "성원동 골목 소식",
   "media": [
    {
     "kind": "photo",
     "scene": "court",
     "palette": [
      "#e8d9c8",
      "#bd9871",
      "#5f4630"
     ]
    }
   ],
   "place": "성원동"
  },
  {
   "id": "LBP-0420",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-17T20:26:00+09:00",
   "likes": 320,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#오늘의밈",
    "#짤",
    "#밈"
   ],
   "body": "웃긴 영상 찾음",
   "media": [],
   "place": null
  }
 ],
 "loopPostsLive": [
  {
   "id": "LBP-LIVE-0001",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-03-17T21:10:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-18T00:09:51.321880+09:00",
     "body": "우리도 보자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#새내기",
    "#과제",
    "#수강신청"
   ],
   "live": true,
   "caption": "새내기 친구들이랑 첫 모임",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-LIVE-0002",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-03-17T21:34:00+09:00",
   "likes": 24,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#수강신청",
    "#경영26"
   ],
   "live": true,
   "caption": "새내기 친구들이랑 첫 모임",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "성원동 분식"
  },
  {
   "id": "LBP-LIVE-0003",
   "kind": "text",
   "author": "frame.hana",
   "createdAt": "2026-03-17T21:53:00+09:00",
   "likes": 23,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-03-18T03:19:44.923375+09:00",
     "body": "힘내"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-03-18T06:45:30.038126+09:00",
     "body": "다음에 같이 하자"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#상영회",
    "#촬영",
    "#영상과"
   ],
   "live": true,
   "body": "촬영 스태프 모집",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-LIVE-0004",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-03-17T21:55:00+09:00",
   "likes": 51,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-03-18T06:39:56.414224+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#코트",
    "#주말농구",
    "#슛"
   ],
   "live": true,
   "caption": "컨디션 조절 러닝",
   "media": [
    {
     "kind": "photo",
     "scene": "run",
     "palette": [
      "#dbe9db",
      "#91b98f",
      "#3f5f3d"
     ]
    }
   ],
   "place": "성원천 운동장"
  },
  {
   "id": "LBP-LIVE-0005",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2026-03-17T22:07:00+09:00",
   "likes": 44,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#수강신청",
    "#새내기"
   ],
   "live": true,
   "body": "경제학원론 첫 수업 듣고 옴",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-LIVE-0006",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-03-17T22:16:00+09:00",
   "likes": 55,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-18T00:33:30.325838+09:00",
     "body": "상영회 언제야?"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-03-18T04:25:19.411292+09:00",
     "body": "컷 좋다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#필름",
    "#촬영",
    "#영상과"
   ],
   "live": true,
   "caption": "오늘 촬영 끝",
   "media": [
    {
     "kind": "photo",
     "scene": "film",
     "palette": [
      "#3c3a44",
      "#76717f",
      "#17161b"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-LIVE-0007",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-03-17T22:25:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-18T00:49:03.349823+09:00",
     "body": "다들 언제 모여?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#과제",
    "#한서대"
   ],
   "live": true,
   "caption": "과방에서 다 같이",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-LIVE-0008",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2026-03-17T23:05:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-18T01:43:52.810036+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제",
    "#학식",
    "#새내기"
   ],
   "live": true,
   "body": "1교시 9시는 진짜 너무하다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-LIVE-0009",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-17T23:28:00+09:00",
   "likes": 280,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#짤",
    "#웃김"
   ],
   "live": true,
   "body": "이 밈 아는 사람?",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-LIVE-0010",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-03-17T23:44:00+09:00",
   "likes": 36,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#상영회",
    "#편집",
    "#영상과"
   ],
   "live": true,
   "caption": "스태프 모임",
   "media": [
    {
     "kind": "photo",
     "scene": "friends",
     "palette": [
      "#e8dcd8",
      "#bda49a",
      "#66504a"
     ]
    }
   ],
   "place": "한서대 영상관"
  },
  {
   "id": "LBP-LIVE-0011",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-03-17T23:49:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2026-03-18T00:09:48.324871+09:00",
     "body": "좋아요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#학식",
    "#수강신청"
   ],
   "live": true,
   "caption": "전공책 드디어 샀다",
   "media": [
    {
     "kind": "photo",
     "scene": "books",
     "palette": [
      "#e8e3d8",
      "#b7ab93",
      "#5f5645"
     ]
    }
   ],
   "place": "한서대 중앙도서관"
  },
  {
   "id": "LBP-LIVE-0012",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2026-03-18T00:07:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-03-18T00:25:01.775486+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-18T01:04:22.519006+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#새내기",
    "#한서대"
   ],
   "live": true,
   "caption": "학식 오늘 진짜 괜찮았음",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "한서대 앞 식당"
  },
  {
   "id": "LBP-LIVE-0013",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-03-18T00:38:00+09:00",
   "likes": 254,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#패치",
    "#한판만"
   ],
   "live": true,
   "body": "주말에 몰아서",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-LIVE-0014",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-03-18T00:46:00+09:00",
   "likes": 8,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2026-03-18T04:28:59.343697+09:00",
     "body": "늦게까지 고생"
    },
    {
     "author": "music.drawer",
     "createdAt": "2026-03-18T06:10:44.573004+09:00",
     "body": "좋아요"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-18T07:52:07.952418+09:00",
     "body": "감성 좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#수강신청"
   ],
   "live": true,
   "caption": "도서관 나오니 벌써 밤",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원동 골목"
  },
  {
   "id": "LBP-LIVE-0015",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-03-18T01:26:00+09:00",
   "likes": 170,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-18T08:29:16.020007+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영학과",
    "#공지"
   ],
   "live": true,
   "body": "학생회 회의 결과 공유",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-LIVE-0016",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-03-18T01:40:00+09:00",
   "likes": 23,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#수강신청"
   ],
   "live": true,
   "caption": "1교시 필기 시작",
   "media": [
    {
     "kind": "photo",
     "scene": "desk",
     "palette": [
      "#e6e0d6",
      "#b8aa94",
      "#5a5043"
     ]
    }
   ],
   "place": "한서대 중앙도서관"
  },
  {
   "id": "LBP-LIVE-0017",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-03-18T02:10:00+09:00",
   "likes": 8,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-18T05:40:28.096580+09:00",
     "body": "공감"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#과제"
   ],
   "live": true,
   "body": "과방 위치 드디어 찾았다",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-LIVE-0018",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-18T04:55:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-18T08:35:50.415313+09:00",
     "body": "야경 예쁘다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#군대",
    "#입대",
    "#성원고"
   ],
   "live": true,
   "caption": "늦게까지 공부하고",
   "media": [
    {
     "kind": "photo",
     "scene": "night",
     "palette": [
      "#2f3b56",
      "#1e2638",
      "#0d111a"
     ]
    }
   ],
   "place": "성원고 정문"
  },
  {
   "id": "LBP-LIVE-0019",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2026-03-18T05:18:00+09:00",
   "likes": 80,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-18T08:06:04.485003+09:00",
     "body": "오늘도 화이팅"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#청년센터",
    "#공지"
   ],
   "live": true,
   "body": "청년 상담 프로그램 안내",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-LIVE-0020",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-18T06:27:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-18T07:05:37.620351+09:00",
     "body": "오늘도 화이팅"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-18T08:01:57.640676+09:00",
     "body": "응원합니다"
    },
    {
     "author": "seungwoo.bae",
     "createdAt": "2026-03-18T08:30:59.602698+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원동카페",
    "#디저트"
   ],
   "live": true,
   "caption": "가게 앞 꽃이 폈어요",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "성원동 카페"
  },
  {
   "id": "LBP-LIVE-0021",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-18T06:48:00+09:00",
   "likes": 639,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-18T07:00:37.508409+09:00",
     "body": "공감"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-18T07:35:23.621312+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#밈",
    "#오늘의밈",
    "#짤"
   ],
   "live": true,
   "body": "새로 나온 밈",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-LIVE-0022",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-03-18T07:46:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-18T08:47:44.544307+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#과제"
   ],
   "live": true,
   "caption": "중앙도서관 앞에서 김밥",
   "media": [
    {
     "kind": "photo",
     "scene": "food",
     "palette": [
      "#f3d9c4",
      "#d98e63",
      "#7a3e2b"
     ]
    }
   ],
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-LIVE-0023",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-18T07:52:00+09:00",
   "likes": 262,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-03-18T08:00:11.855155+09:00",
     "body": "응원합니다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#밈",
    "#오늘의밈",
    "#짤"
   ],
   "live": true,
   "body": "오늘의 밈은 이거",
   "media": [],
   "place": null
  },
  {
   "id": "LBP-LIVE-0024",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-03-18T08:17:00+09:00",
   "likes": 81,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#농구",
    "#코트",
    "#주말농구"
   ],
   "live": true,
   "caption": "주말 경기 리뷰",
   "media": [
    {
     "kind": "photo",
     "scene": "sports",
     "palette": [
      "#d9e8cf",
      "#8bb37a",
      "#36502f"
     ]
    }
   ],
   "place": "성원천 운동장"
  },
  {
   "id": "LBP-LIVE-0025",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2026-03-18T08:37:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-18T08:39:05.629876+09:00",
     "body": "커피 맛있어?"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-18T08:47:44.800346+09:00",
     "body": "나도 가고 싶다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제",
    "#한서대",
    "#새내기"
   ],
   "live": true,
   "caption": "수업 끝나고 카페에서 과제",
   "media": [
    {
     "kind": "photo",
     "scene": "cafe",
     "palette": [
      "#e7d8c9",
      "#b99b7d",
      "#5b4636"
     ]
    }
   ],
   "place": "한서대 앞 카페"
  }
 ],
 "pool": {
  "items": [
   {
    "id": "PL-0001",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 1교시 있는 사람? 나는 알람 세 개 맞췄다"
   },
   {
    "id": "PL-0002",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 아직 다 못 했는데 같이 할 사람?"
   },
   {
    "id": "PL-0003",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "MT 사진 원본 누가 갖고 있어?"
   },
   {
    "id": "PL-0004",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 학식 뭐 나오는지 아는 사람?"
   },
   {
    "id": "PL-0005",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과잠 사이즈 표 다시 올려줄 수 있어?"
   },
   {
    "id": "PL-0006",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "수강정정 결과 확인한 사람?"
   },
   {
    "id": "PL-0007",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "중앙도서관 지금 자리 있어?"
   },
   {
    "id": "PL-0008",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 비 온다는데 우산 챙겨"
   },
   {
    "id": "PL-0009",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "동아리 OT 신청한 사람?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0010",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 과방 몇 시까지 열어?"
   },
   {
    "id": "PL-0011",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "경제학원론 3장까지 맞지?"
   },
   {
    "id": "PL-0012",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "나 지금 과제하다가 졸았다"
   },
   {
    "id": "PL-0013",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과잠 색깔 뭐가 제일 나아?"
   },
   {
    "id": "PL-0014",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 9시 수업인데 벌써 걱정이다"
   },
   {
    "id": "PL-0015",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "학생회관 프린터 고쳐졌대?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0016",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "MT 회비 냈어?"
   },
   {
    "id": "PL-0017",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "단톡 공지 읽은 사람?"
   },
   {
    "id": "PL-0018",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 학식 돈가스였는데 놓쳤다"
   },
   {
    "id": "PL-0019",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 조별 발표 순서 바뀐 거 맞지?"
   },
   {
    "id": "PL-0020",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "새내기 OT 때 사진 어디 있음?"
   },
   {
    "id": "PL-0021",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과방에 두고 온 우산 있으면 알려줘"
   },
   {
    "id": "PL-0022",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "수강신청 하나 남았는데 어떻게 해야 해?"
   },
   {
    "id": "PL-0023",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 2교시 끝나고 밥 먹을 사람?"
   },
   {
    "id": "PL-0024",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 범위 교수님이 어디까지래?"
   },
   {
    "id": "PL-0025",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "나 지금 편의점인데 뭐 사다 줄까?"
   },
   {
    "id": "PL-0026",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 과방 사람 많았어?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0027",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "중앙도서관 3층 창가 자리 비었어?"
   },
   {
    "id": "PL-0028",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "MT 준비물 뭐 챙겨야 해?"
   },
   {
    "id": "PL-0029",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과잠 주문 링크 다시 올려줘"
   },
   {
    "id": "PL-0030",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 발표 조 우리 순서 몇 번째야?"
   },
   {
    "id": "PL-0031",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "경제학원론 노트 필기한 사람?"
   },
   {
    "id": "PL-0032",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 수업 출석 체크했어?"
   },
   {
    "id": "PL-0033",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "나 내일 1교시 못 갈 것 같아 ㅠ"
   },
   {
    "id": "PL-0034",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "동아리 홍보 부스 내일까지래"
   },
   {
    "id": "PL-0035",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "학식 줄 너무 길다"
   },
   {
    "id": "PL-0036",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 파일 어디에 올려?"
   },
   {
    "id": "PL-0037",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 같이 도서관 갈 사람?"
   },
   {
    "id": "PL-0038",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과잠 나왔다는 문자 왔다"
   },
   {
    "id": "PL-0039",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "MT 사진 보정한 거 올려줄 수 있어?"
   },
   {
    "id": "PL-0040",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 학원 끝나고 뭐 했어?"
   },
   {
    "id": "PL-0041",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 아침에 프린트할 사람?"
   },
   {
    "id": "PL-0042",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "수강정정 마감이 언제야?"
   },
   {
    "id": "PL-0043",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "나 과제하다가 밤샜다"
   },
   {
    "id": "PL-0044",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과방 냉장고에 내 음료 있어?"
   },
   {
    "id": "PL-0045",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 3교시 있는 사람?"
   },
   {
    "id": "PL-0046",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "경제학원론 교재 파일 있어?"
   },
   {
    "id": "PL-0047",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 과방 청소 당번 누구야?"
   },
   {
    "id": "PL-0048",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 학식 메뉴 봤어?"
   },
   {
    "id": "PL-0049",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과잠 입어 보고 사이즈 알려줄게"
   },
   {
    "id": "PL-0050",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "MT 날짜 다시 알려줘"
   },
   {
    "id": "PL-0051",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "나 지금 도서관인데 자리 있다"
   },
   {
    "id": "PL-0052",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 제출 형식 맞춰야 해?"
   },
   {
    "id": "PL-0053",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 1교시 끝나고 카페 갈 사람?"
   },
   {
    "id": "PL-0054",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 수업 필기 공유해줄 수 있어?"
   },
   {
    "id": "PL-0055",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "새내기 환영회 언제야?"
   },
   {
    "id": "PL-0056",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과방 와이파이 비번 뭐야?"
   },
   {
    "id": "PL-0057",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 발표 리허설 몇 시야?"
   },
   {
    "id": "PL-0058",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "나 과제 2번까지 했어"
   },
   {
    "id": "PL-0059",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 학식 제육이었대"
   },
   {
    "id": "PL-0060",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과잠 배송 조회해봤어?"
   },
   {
    "id": "PL-0061",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 비 오면 우산 가져와",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0062",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "수강정정 성공한 사람?"
   },
   {
    "id": "PL-0063",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 과방에서 라면 먹을 사람?"
   },
   {
    "id": "PL-0064",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 9시 수업 같이 들어갈 사람?"
   },
   {
    "id": "PL-0065",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "나 지금 집인데 과제하다 죽겠다"
   },
   {
    "id": "PL-0066",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "경제학원론 4장은 다음 주래"
   },
   {
    "id": "PL-0067",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "MT 사진 단톡에 다 올렸어"
   },
   {
    "id": "PL-0068",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 조별 과제 모임 몇 시야?"
   },
   {
    "id": "PL-0069",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과방 열쇠 누가 갖고 있어?"
   },
   {
    "id": "PL-0070",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "다들 자냐, 나만 과제하는 중"
   },
   {
    "id": "PL-0071",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "다들 뭐 하고 지내?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0072",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "재수 학원 첫날인데 벌써 지침"
   },
   {
    "id": "PL-0073",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "입대 날짜 드디어 나왔다"
   },
   {
    "id": "PL-0074",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "훈련소에서 보낸 편지 읽었어"
   },
   {
    "id": "PL-0075",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "알바 끝나고 집 가는 길"
   },
   {
    "id": "PL-0076",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘 모의고사 봤는데 망했다"
   },
   {
    "id": "PL-0077",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "졸업 사진 보정하는 중"
   },
   {
    "id": "PL-0078",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "주말에 축구할 사람?"
   },
   {
    "id": "PL-0079",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "동네 카페 가봄"
   },
   {
    "id": "PL-0080",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "다들 대학 어디 갔어?"
   },
   {
    "id": "PL-0081",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘은 진짜 일찍 잘 거다"
   },
   {
    "id": "PL-0082",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "수시 결과 나왔다"
   },
   {
    "id": "PL-0083",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "야자 끝나면 바로 눕는다"
   },
   {
    "id": "PL-0084",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "생일인데 아무도 모름"
   },
   {
    "id": "PL-0085",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "고등학교 앞 지나갔다"
   },
   {
    "id": "PL-0086",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "재수생은 명절이 없다"
   },
   {
    "id": "PL-0087",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "입대 전에 한 번 모이자"
   },
   {
    "id": "PL-0088",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "편지 받는 게 제일 큰 낙"
   },
   {
    "id": "PL-0089",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "이번 주 알바 스케줄 짰다"
   },
   {
    "id": "PL-0090",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "대학 첫 수업 듣고 왔음"
   },
   {
    "id": "PL-0091",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "동창 모임 날짜 정하자"
   },
   {
    "id": "PL-0092",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘 풋살했는데 다리 후들"
   },
   {
    "id": "PL-0093",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "성원천 산책하기 좋은 날씨"
   },
   {
    "id": "PL-0094",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "과제가 고3 때보다 많다"
   },
   {
    "id": "PL-0095",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘은 수다만 떨다 끝남"
   },
   {
    "id": "PL-0096",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "합격하고 나니 할 게 없다"
   },
   {
    "id": "PL-0097",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "수강신청 전쟁 끝"
   },
   {
    "id": "PL-0098",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "다들 방학 때 뭐 했어?"
   },
   {
    "id": "PL-0099",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘은 집에서 영상만 봄"
   },
   {
    "id": "PL-0100",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "모의고사 성적표 나왔다"
   },
   {
    "id": "PL-0101",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "훈련소 가기 전에 머리 깎았다"
   },
   {
    "id": "PL-0102",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "여기 밥은 생각보다 괜찮다"
   },
   {
    "id": "PL-0103",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "알바비 들어왔다"
   },
   {
    "id": "PL-0104",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘은 도서관에서 공부"
   },
   {
    "id": "PL-0105",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "졸업 앨범 나왔다"
   },
   {
    "id": "PL-0106",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "이번 주말 경기 있음?"
   },
   {
    "id": "PL-0107",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "동네 분식집 다시 문 열었더라"
   },
   {
    "id": "PL-0108",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "대학 생활 생각보다 바쁘다"
   },
   {
    "id": "PL-0109",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘은 그냥 쉬는 날"
   },
   {
    "id": "PL-0110",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "다들 연락 좀 하자"
   },
   {
    "id": "PL-0111",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "밤에 라면 먹고 자야지"
   },
   {
    "id": "PL-0112",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "재수 학원 끝나고 커피"
   },
   {
    "id": "PL-0113",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "친구가 군대 갔다"
   },
   {
    "id": "PL-0114",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "졸업하고 처음 만났다"
   },
   {
    "id": "PL-0115",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘은 야자실 대신 카페"
   },
   {
    "id": "PL-0116",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "대학 과제 조별 모임"
   },
   {
    "id": "PL-0117",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "입대 준비물 챙기는 중"
   },
   {
    "id": "PL-0118",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "모의고사 D-30"
   },
   {
    "id": "PL-0119",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "동창 단톡 오랜만이다"
   },
   {
    "id": "PL-0120",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘은 진짜 공부 안 됨"
   },
   {
    "id": "PL-0121",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "학원 끝나고 친구랑 밥"
   },
   {
    "id": "PL-0122",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "대학 캠퍼스 구경 가고 싶다"
   },
   {
    "id": "PL-0123",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "훈련소 휴가 날짜 나왔다"
   },
   {
    "id": "PL-0124",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "이번 주말에 시간 되는 사람?"
   },
   {
    "id": "PL-0125",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "다들 자냐"
   },
   {
    "id": "PL-0126",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 마감 맞지?"
   },
   {
    "id": "PL-0127",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "슬라이드 나눠서 하자"
   },
   {
    "id": "PL-0128",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "나는 1~4장 맡을게"
   },
   {
    "id": "PL-0129",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "자료조사는 내가 시장 사례 맡을게"
   },
   {
    "id": "PL-0130",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 순서 정하자"
   },
   {
    "id": "PL-0131",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "리허설 언제 할까?"
   },
   {
    "id": "PL-0132",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "출처 정리 누가 할래?"
   },
   {
    "id": "PL-0133",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지 제출하자"
   },
   {
    "id": "PL-0134",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "슬라이드 디자인 통일하자"
   },
   {
    "id": "PL-0135",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "자료 링크 공유했어"
   },
   {
    "id": "PL-0136",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 밤까지 초안 올릴게"
   },
   {
    "id": "PL-0137",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "나는 결론 부분 쓸게"
   },
   {
    "id": "PL-0138",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "서론은 누가 맡았지?"
   },
   {
    "id": "PL-0139",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "사례 조사 어디까지 했어?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0140",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 연습 한 번 더 하자"
   },
   {
    "id": "PL-0141",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 전에 끝내자"
   },
   {
    "id": "PL-0142",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "슬라이드 5~8장 확인해줘"
   },
   {
    "id": "PL-0143",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "그래프 출처 다시 봐야 해"
   },
   {
    "id": "PL-0144",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 9시에 모일 사람?"
   },
   {
    "id": "PL-0145",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "나는 9시 30분까지 가능"
   },
   {
    "id": "PL-0146",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 흐름 다듬었어"
   },
   {
    "id": "PL-0147",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "자료조사 마감 오늘까지야"
   },
   {
    "id": "PL-0148",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "출처 표기 형식 맞추자"
   },
   {
    "id": "PL-0149",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "슬라이드 템플릿 공유할게"
   },
   {
    "id": "PL-0150",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "이 부분 다시 읽어봐"
   },
   {
    "id": "PL-0151",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 멘트 길이 줄이자"
   },
   {
    "id": "PL-0152",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "나는 발표 연습 해볼게"
   },
   {
    "id": "PL-0153",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "질의응답 예상 질문 정리하자"
   },
   {
    "id": "PL-0154",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 온라인으로 모여서 하자"
   },
   {
    "id": "PL-0155",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "나는 조금 늦을 수도 있어"
   },
   {
    "id": "PL-0156",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "늦으면 중간에 들어와"
   },
   {
    "id": "PL-0157",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "슬라이드 오탈자 봤어"
   },
   {
    "id": "PL-0158",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "자료 링크 확인했어"
   },
   {
    "id": "PL-0159",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "영상이랑 음향도 확인하자"
   },
   {
    "id": "PL-0160",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 시간 몇 분이야?"
   },
   {
    "id": "PL-0161",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "10분 발표에 5분 질의응답이래"
   },
   {
    "id": "PL-0162",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "나는 2번 자료까지 했어"
   },
   {
    "id": "PL-0163",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "나는 1번은 끝냈어"
   },
   {
    "id": "PL-0164",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3조 발표 순서 두 번째래"
   },
   {
    "id": "PL-0165",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "우리 조 두 번째 맞지?"
   },
   {
    "id": "PL-0166",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 당일 몇 시에 모여?"
   },
   {
    "id": "PL-0167",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 제출이니까 17일 밤에 끝내자"
   },
   {
    "id": "PL-0168",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "최종 점검은 내가 할게"
   },
   {
    "id": "PL-0169",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "파일 이름 규칙 맞추자"
   },
   {
    "id": "PL-0170",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "슬라이드에 이름 넣어야 해?"
   },
   {
    "id": "PL-0171",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이번 주 토요일 8시 맞지?"
   },
   {
    "id": "PL-0172",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 예약했어"
   },
   {
    "id": "PL-0173",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "인원 체크: 지금 여덟 명"
   },
   {
    "id": "PL-0174",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "회비 2만 원씩"
   },
   {
    "id": "PL-0175",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "비 오면 실내로 바꿀까?"
   },
   {
    "id": "PL-0176",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "골키퍼 내가 할게",
    "window": [
     11,
     14
    ]
   },
   {
    "id": "PL-0177",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "축구화 새로 샀다"
   },
   {
    "id": "PL-0178",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이번 주는 사람 적을 것 같다"
   },
   {
    "id": "PL-0179",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 주 경기 일정 나왔어"
   },
   {
    "id": "PL-0180",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장비 정산 완료"
   },
   {
    "id": "PL-0181",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "토요일 6시로 당길 수 있는 사람?"
   },
   {
    "id": "PL-0182",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "인원 10명 넘으면 두 팀"
   },
   {
    "id": "PL-0183",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "몸살이라 이번 주 쉴게"
   },
   {
    "id": "PL-0184",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 예약금 보냈어"
   },
   {
    "id": "PL-0185",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "오늘 경기 3대2"
   },
   {
    "id": "PL-0186",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 주 화요일 저녁 어때?",
    "window": [
     11,
     14
    ]
   },
   {
    "id": "PL-0187",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "공 새로 샀다"
   },
   {
    "id": "PL-0188",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이번 주말 비 예보 있음",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0189",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "8시에 구장 앞에서 보자"
   },
   {
    "id": "PL-0190",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "지난주 회비 정리해서 올릴게"
   },
   {
    "id": "PL-0191",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "인원 확인 부탁"
   },
   {
    "id": "PL-0192",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "저번 경기 영상 봤어",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0193",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 조명 괜찮아?"
   },
   {
    "id": "PL-0194",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 경기 골키퍼 누가 해?"
   },
   {
    "id": "PL-0195",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "오늘 운동하고 다리 풀렸다"
   },
   {
    "id": "PL-0196",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "주말 날씨 좋다던데",
    "window": [
     11,
     14
    ]
   },
   {
    "id": "PL-0197",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 예약 사이트 열렸다"
   },
   {
    "id": "PL-0198",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이번 주는 9시로 하자",
    "window": [
     11,
     14
    ]
   },
   {
    "id": "PL-0199",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "회비 입금 확인"
   },
   {
    "id": "PL-0200",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "저녁 먹고 바로 갈 사람?"
   },
   {
    "id": "PL-0201",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "오늘 경기 진짜 재밌었다"
   },
   {
    "id": "PL-0202",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 주 인원 미리 알려줘"
   },
   {
    "id": "PL-0203",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 예약 확정"
   },
   {
    "id": "PL-0204",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "나 이번 주는 못 갈 것 같아"
   },
   {
    "id": "PL-0205",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "대신 다음 주에 갈게"
   },
   {
    "id": "PL-0206",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 앞에서 기다릴게"
   },
   {
    "id": "PL-0207",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "축구화 사이즈 추천해줄 사람?"
   },
   {
    "id": "PL-0208",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "오늘은 가볍게 패스 연습"
   },
   {
    "id": "PL-0209",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 경기 상대 팀 정했어?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0210",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다들 수고했어"
   },
   {
    "id": "PL-0211",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "이번 주 토요일 2시 교대 바꿀 사람?"
   },
   {
    "id": "PL-0212",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "저 화요일 대타 가능해요"
   },
   {
    "id": "PL-0213",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "오늘 재고 정리 끝냈습니다"
   },
   {
    "id": "PL-0214",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "마감하고 나왔어요"
   },
   {
    "id": "PL-0215",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "냉장고 온도 확인 부탁해요"
   },
   {
    "id": "PL-0216",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "폐기 처리 했어요",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0217",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "진열대 정리 중입니다"
   },
   {
    "id": "PL-0218",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "손님 많아서 늦었어요"
   },
   {
    "id": "PL-0219",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "다음 주 스케줄 올렸습니다"
   },
   {
    "id": "PL-0220",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "금요일 야간 가능합니다"
   },
   {
    "id": "PL-0221",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "택배 왔어요"
   },
   {
    "id": "PL-0222",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "발주서 작성했어요"
   },
   {
    "id": "PL-0223",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "야간 교대 구합니다"
   },
   {
    "id": "PL-0224",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "제가 할게요"
   },
   {
    "id": "PL-0225",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "알바비 들어왔나요?"
   },
   {
    "id": "PL-0226",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "오늘 마감 조용했습니다"
   },
   {
    "id": "PL-0227",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "주말에 재고 조사 있습니다"
   },
   {
    "id": "PL-0228",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "토요일 오전 가능해요"
   },
   {
    "id": "PL-0229",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "냉동고 정리했어요"
   },
   {
    "id": "PL-0230",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "교대 시간 확인 부탁드려요"
   },
   {
    "id": "PL-0231",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "다들 수고했어요"
   },
   {
    "id": "PL-0232",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "다음 주 대타 가능한 날 알려드릴게요"
   },
   {
    "id": "PL-0233",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "손님이 물건 찾으셔서 안내했어요"
   },
   {
    "id": "PL-0234",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "진열 마무리했습니다",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0235",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "내일 야간 대타 가능한 사람?"
   },
   {
    "id": "PL-0236",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "오늘 야자 끝나고 시간 돼?"
   },
   {
    "id": "PL-0237",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "주말에 밥 먹자"
   },
   {
    "id": "PL-0238",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "나 늦을 것 같아"
   },
   {
    "id": "PL-0239",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "먼저 가서 기다릴게"
   },
   {
    "id": "PL-0240",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "어제 시험 어땠어?"
   },
   {
    "id": "PL-0241",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "나쁘지 않았어"
   },
   {
    "id": "PL-0242",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "토요일 저녁 시간 돼?"
   },
   {
    "id": "PL-0243",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "좋아 연락할게"
   },
   {
    "id": "PL-0244",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "고마워"
   },
   {
    "id": "PL-0245",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "오늘 학원 끝나고 커피 한 잔?"
   },
   {
    "id": "PL-0246",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "나 9시에 끝나"
   },
   {
    "id": "PL-0247",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "카페에서 보자"
   },
   {
    "id": "PL-0248",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "오늘 너무 졸려"
   },
   {
    "id": "PL-0249",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "내일 몇 시에 끝나?"
   },
   {
    "id": "PL-0250",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "4시 30분"
   },
   {
    "id": "PL-0251",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "그럼 그때 보자"
   },
   {
    "id": "PL-0252",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "패딩 입어"
   },
   {
    "id": "PL-0253",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "꽃샘추위래"
   },
   {
    "id": "PL-0254",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "푹 자"
   },
   {
    "id": "PL-0255",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "토요일 저녁 어때?"
   },
   {
    "id": "PL-0256",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "입대 날짜가 나왔다"
   },
   {
    "id": "PL-0257",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "다음 달 14일이야"
   },
   {
    "id": "PL-0258",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "그날 전에 보자"
   },
   {
    "id": "PL-0259",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "훈련소 가면 연락할게"
   },
   {
    "id": "PL-0260",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "편지 보낼게"
   },
   {
    "id": "PL-0261",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "주소 알려줘"
   },
   {
    "id": "PL-0262",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "힘내"
   },
   {
    "id": "PL-0263",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "이따 봐"
   },
   {
    "id": "PL-0264",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "나 조금 늦을 것 같아"
   },
   {
    "id": "PL-0265",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "괜찮아 천천히 와"
   },
   {
    "id": "PL-0266",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "오늘 알바 몇 시에 끝나?"
   },
   {
    "id": "PL-0267",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "10시"
   },
   {
    "id": "PL-0268",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "그럼 10시 10분에 보자"
   },
   {
    "id": "PL-0269",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "비 와서 우산 챙겨"
   },
   {
    "id": "PL-0270",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "확인했어"
   },
   {
    "id": "PL-0271",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "퇴근하고 연락해"
   },
   {
    "id": "PL-0272",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "푹 쉬어"
   },
   {
    "id": "PL-0273",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "이번 주 풋살 갈 거야?"
   },
   {
    "id": "PL-0274",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "토요일 8시야"
   },
   {
    "id": "PL-0275",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "축구화 챙겨"
   },
   {
    "id": "PL-0276",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "나 늦을 수도 있어"
   },
   {
    "id": "PL-0277",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "먼저 가 있을게"
   },
   {
    "id": "PL-0278",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "오늘 경기 너무 재밌었어"
   },
   {
    "id": "PL-0279",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "다음 주에도 하자"
   },
   {
    "id": "PL-0280",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "회비 보냈어"
   },
   {
    "id": "PL-0281",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "수강신청 했어?"
   },
   {
    "id": "PL-0282",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "나는 하나 실패했어 ㅠ"
   },
   {
    "id": "PL-0283",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "다음 학기에 다시 하면 돼"
   },
   {
    "id": "PL-0284",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 과제 같이 할래?"
   },
   {
    "id": "PL-0285",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "도서관에 있을게"
   },
   {
    "id": "PL-0286",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "몇 시에 갈까?"
   },
   {
    "id": "PL-0287",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "나 6시에 갈게"
   },
   {
    "id": "PL-0288",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "자리 잡아둘게"
   },
   {
    "id": "PL-0289",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "내일 1교시 갈 거야?"
   },
   {
    "id": "PL-0290",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "나는 갈 거야"
   },
   {
    "id": "PL-0291",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "과방에서 보자"
   },
   {
    "id": "PL-0292",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 과제 했어?"
   },
   {
    "id": "PL-0293",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "나는 아직"
   },
   {
    "id": "PL-0294",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "밤에 같이 하자"
   },
   {
    "id": "PL-0295",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "도서관 2층에서 보자"
   },
   {
    "id": "PL-0296",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "나 졸려 죽겠음"
   },
   {
    "id": "PL-0297",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "오케이"
   },
   {
    "id": "PL-0298",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 늦을 것 같아"
   },
   {
    "id": "PL-0299",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "먼저 가"
   },
   {
    "id": "PL-0300",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "내일 또 보자"
   },
   {
    "id": "PL-0301",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "과제 자료 찾았어?"
   },
   {
    "id": "PL-0302",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "같이 볼래?"
   },
   {
    "id": "PL-0303",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "나 지금 도서관이야"
   },
   {
    "id": "PL-0304",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "2층 창가 자리"
   },
   {
    "id": "PL-0305",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "발표 준비 어디까지 했어?"
   },
   {
    "id": "PL-0306",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "나는 슬라이드 1~4장 했어"
   },
   {
    "id": "PL-0307",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "자료조사는 내가 할게"
   },
   {
    "id": "PL-0308",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 밤까지 보낼 수 있어"
   },
   {
    "id": "PL-0309",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "발표는 내가 할게"
   },
   {
    "id": "PL-0310",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "리허설은 언제 할까?"
   },
   {
    "id": "PL-0311",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "내일 저녁 어때?"
   },
   {
    "id": "PL-0312",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "나 조금 늦을 수도 있어"
   },
   {
    "id": "PL-0313",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "오늘 촬영 몇 시야?"
   },
   {
    "id": "PL-0314",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "2시야"
   },
   {
    "id": "PL-0315",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "장비 챙겼어?"
   },
   {
    "id": "PL-0316",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "조명도 챙길까?"
   },
   {
    "id": "PL-0317",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "조명은 내가 챙길게"
   },
   {
    "id": "PL-0318",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "조금 이따 봐"
   },
   {
    "id": "PL-0319",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "상영회 준비 잘 되고 있어"
   },
   {
    "id": "PL-0320",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "편집도 거의 끝났어"
   },
   {
    "id": "PL-0321",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "조금 늦어"
   },
   {
    "id": "PL-0322",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "나중에 봐"
   },
   {
    "id": "PL-0323",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "오늘 편집 어디까지 했어?"
   },
   {
    "id": "PL-0324",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "러프컷까지 했어"
   },
   {
    "id": "PL-0325",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "색보정은 내일 할게"
   },
   {
    "id": "PL-0326",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "상영회 언제야?"
   },
   {
    "id": "PL-0327",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "오늘 끝낼 수 있어?"
   },
   {
    "id": "PL-0328",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "진짜 고마워"
   },
   {
    "id": "PL-0329",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "편집 화이팅"
   },
   {
    "id": "PL-0330",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "내일 보자"
   },
   {
    "id": "PL-0331",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "이번 주 대타 가능?"
   },
   {
    "id": "PL-0332",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "화요일 야간이야"
   },
   {
    "id": "PL-0333",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "수요일은 어때?"
   },
   {
    "id": "PL-0334",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "수요일 가능해"
   },
   {
    "id": "PL-0335",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "스케줄 확인했어"
   },
   {
    "id": "PL-0336",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "점장님께 말할게"
   },
   {
    "id": "PL-0337",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "확인했다고 해",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0338",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "고맙습니다"
   },
   {
    "id": "PL-0339",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "선생님, 안녕하세요"
   },
   {
    "id": "PL-0340",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "오늘 상담 가능할까요?"
   },
   {
    "id": "PL-0341",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "네, 몇 시에 오실래요?"
   },
   {
    "id": "PL-0342",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "저는 4시쯤 갈 수 있어요"
   },
   {
    "id": "PL-0343",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "그럼 4시에 교무실로 오세요"
   },
   {
    "id": "PL-0344",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "요즘 진로 고민이 있어서요"
   },
   {
    "id": "PL-0345",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "천천히 이야기해요"
   },
   {
    "id": "PL-0346",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "감사합니다"
   },
   {
    "id": "PL-0347",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "minseo.kim님이 새 게시물을 올렸습니다"
   },
   {
    "id": "PL-0348",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "jun.choi님이 회원님을 팔로우했습니다"
   },
   {
    "id": "PL-0349",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "haneul.park님이 댓글을 남겼습니다"
   },
   {
    "id": "PL-0350",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "오늘 올라온 새 게시물이 3개 있습니다"
   },
   {
    "id": "PL-0351",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "chaerin.oh님이 회원님의 게시물을 좋아합니다"
   },
   {
    "id": "PL-0352",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "eunbi.seo님이 새 게시물을 올렸습니다"
   },
   {
    "id": "PL-0353",
    "app": "mail",
    "appName": "메일",
    "circle": "앱",
    "text": "한서대학교: 3월 학사 일정 안내"
   },
   {
    "id": "PL-0354",
    "app": "mail",
    "appName": "메일",
    "circle": "앱",
    "text": "한서대 경영학과: 새내기 OT 안내"
   },
   {
    "id": "PL-0355",
    "app": "mail",
    "appName": "메일",
    "circle": "앱",
    "text": "한서대 도서관: 연장 운영 안내"
   },
   {
    "id": "PL-0356",
    "app": "portal",
    "appName": "한서 포털",
    "circle": "앱",
    "text": "3/18 과제 마감 알림"
   },
   {
    "id": "PL-0357",
    "app": "portal",
    "appName": "한서 포털",
    "circle": "앱",
    "text": "수강정정 기간이 오늘까지입니다"
   },
   {
    "id": "PL-0358",
    "app": "weather",
    "appName": "날씨",
    "circle": "앱",
    "text": "06:30 오늘 성원동 날씨: 맑음, 최고 9°"
   },
   {
    "id": "PL-0359",
    "app": "market",
    "appName": "이웃마켓",
    "circle": "앱",
    "text": "키워드 알림: 모니터"
   },
   {
    "id": "PL-0360",
    "app": "market",
    "appName": "이웃마켓",
    "circle": "앱",
    "text": "키워드 알림: 자전거"
   },
   {
    "id": "PL-0361",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "교수님이 형식 알려주셨어?",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0362",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "자료조사 출처 신뢰도 확인하자",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0363",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "나는 사례 하나 더 찾아볼게",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0364",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 리허설 끝났어",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0365",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "이제 제출만 남았다",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0366",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "다들 고생했어",
    "window": [
     21,
     24
    ]
   }
  ],
  "total": 366,
  "byRoom": {
   "talk.biz26": 70,
   "talk.hs32": 55,
   "talk.team3": 51,
   "talk.futsal": 40,
   "talk.alba": 25,
   "talk.dm.01": 9,
   "talk.dm.02": 10,
   "talk.dm.03": 8,
   "talk.dm.04": 10,
   "talk.dm.05": 8,
   "talk.dm.06": 8,
   "talk.dm.07": 8,
   "talk.dm.08": 8,
   "talk.dm.09": 8,
   "talk.dm.10": 8,
   "talk.dm.11": 10,
   "talk.dm.12": 8,
   "talk.dm.13": 8,
   "app:loop": 6,
   "app:mail": 3,
   "app:portal": 2,
   "app:weather": 1,
   "app:market": 2
  },
  "note": "3.11 pool[] flattened into items[]; app notifications use app/appName instead of room."
 },
 "schedule": {
  "rates": {
   "21-24": [
    8,
    12
   ],
   "00-02": [
    3,
    6
   ],
   "02-06": [
    0,
    2
   ],
   "06-09": [
    5,
    9
   ]
  },
  "minGapSec": 30,
  "eventQuietSec": 120,
  "burst": [
   1,
   5
  ]
 }
};
