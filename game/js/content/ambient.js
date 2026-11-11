/* 루프 배경 계정·게시물, 톡 배경 연락처·방·문장 풀, 배경 알림 스케줄.
 * 설계: SNS_SPECIFICATION 8.10~8.11, MESSAGING_SPECIFICATION 3.9, DATABASE_SCHEMA 3.11/L19~L22.
 *
 * 키 설명(설계 3.11에 없는 추가 키):
 *  loopAccounts[] : 배경 루프 계정. {id, handle, displayName, name, bio, circle,
 *                   followsDohyun:boolean, followers:number, personId:people.id|null}
 *  loopPosts[]    : 게임 시작 전 정적 배경 게시물. {id, kind:'photo'|'text', author:handle,
 *                   createdAt:ISO, caption|body, media:[{kind:'photo', scene, palette}],
 *                   hashtags[], place?, likes, comments:[{author, createdAt, body}],
 *                   noise:true, circle, evidence:null, cache:boolean}
 *                   cache=true는 오프라인 캐시(2026-03-15T03:58+09:00 이전) 항목.
 *  loopPostsLive[]: 게임 중(2026-03-17 21:10 ~ 2026-03-18 09:00) 새로 올라오는 게시물. live:true.
 *  people[]       : 연락처 64명. 3.11의 {id,name,circle,talk,loop,tone} + relation, talkFriend, contact.
 *  rooms[]        : 3.11의 {id,name,members,history,muted} + type, circle, count, withSelf?.
 *                   history[] = {dir:'in'|'out', sender, body, at:ISO, day, time}
 *  pool.items[]   : 3.11 pool[] 항목. {id, room|app, appName?, circle, text, window?:[hh,hh]}
 *  schedule       : 3.9.3 값 그대로(게임 초).
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
   "tone": "plain",
   "loop": "yeseul.hong"
  },
  {
   "id": "BG-007",
   "name": "배지훈",
   "circle": "성원고 동창",
   "relation": "고3 반 친구 · 축구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "tone": "casual",
   "loop": "minjae.bae"
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
   "tone": "plain",
   "loop": null
  },
  {
   "id": "BG-040",
   "name": "박상철",
   "circle": "지난 알바",
   "relation": "편의점 점장",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
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
     "sender": "김민서",
     "body": "금요일 동아리 제출함",
     "at": "2026-01-05T09:03:49+09:00",
     "day": "1/5",
     "time": "09:03"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "내일 2교시 있는 사람?",
     "at": "2026-01-06T08:29:23+09:00",
     "day": "1/6",
     "time": "08:29"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "제육볶음 시킬까?",
     "at": "2026-01-07T07:40:15+09:00",
     "day": "1/7",
     "time": "07:40"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "성원동 카페 자리 있어?",
     "at": "2026-01-07T20:25:17+09:00",
     "day": "1/7",
     "time": "20:25"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "수요일 개강 내일 함",
     "at": "2026-01-07T21:38:19+09:00",
     "day": "1/7",
     "time": "21:38"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "단톡 시작도 못 함",
     "at": "2026-01-07T23:15:24+09:00",
     "day": "1/7",
     "time": "23:15"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "화요일에 동아리 한대",
     "at": "2026-01-08T06:44:00+09:00",
     "day": "1/8",
     "time": "06:44"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "과방 예약됨",
     "at": "2026-01-08T22:06:33+09:00",
     "day": "1/8",
     "time": "22:06"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "10시에 성원동 카페에서 볼 사람?",
     "at": "2026-01-08T23:26:29+09:00",
     "day": "1/8",
     "time": "23:26"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "과제 준비물 뭐 챙겨?",
     "at": "2026-01-09T06:03:20+09:00",
     "day": "1/9",
     "time": "06:03"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "오늘 잔디밭 사람 많아?",
     "at": "2026-01-09T14:38:43+09:00",
     "day": "1/9",
     "time": "14:38"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "금요일 발표 바쁘다",
     "at": "2026-01-09T20:12:32+09:00",
     "day": "1/9",
     "time": "20:12"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "경영원론 교수님 거의 다 함",
     "at": "2026-01-12T01:16:58+09:00",
     "day": "1/12",
     "time": "01:16"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "8시에 성원동 분식 갈 사람?",
     "at": "2026-01-12T04:17:43+09:00",
     "day": "1/12",
     "time": "04:17"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "수강신청 다 찍음",
     "at": "2026-01-12T08:42:25+09:00",
     "day": "1/12",
     "time": "08:42"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "이웃마켓 고객센터 중간고사 갔어?",
     "at": "2026-01-14T14:12:12+09:00",
     "day": "1/14",
     "time": "14:12"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "통계학 배고프다",
     "at": "2026-01-15T11:07:27+09:00",
     "day": "1/15",
     "time": "11:07"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "튀김 먹고 성원동 카페 갈래?",
     "at": "2026-01-16T00:53:23+09:00",
     "day": "1/16",
     "time": "00:53"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "단톡 비었음",
     "at": "2026-01-16T08:29:00+09:00",
     "day": "1/16",
     "time": "08:29"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "8시까지 과방 갈 수 있어?",
     "at": "2026-01-17T00:28:22+09:00",
     "day": "1/17",
     "time": "00:28"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "돈까스 시킬까?",
     "at": "2026-01-18T06:37:07+09:00",
     "day": "1/18",
     "time": "06:37"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "단톡 확인함",
     "at": "2026-01-18T16:27:55+09:00",
     "day": "1/18",
     "time": "16:27"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "오세훈 바쁘다?",
     "at": "2026-01-19T08:22:24+09:00",
     "day": "1/19",
     "time": "08:22"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "영어 좋다",
     "at": "2026-01-20T16:58:58+09:00",
     "day": "1/20",
     "time": "16:58"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "2시에 잔디밭 갈 사람?",
     "at": "2026-01-20T21:12:11+09:00",
     "day": "1/20",
     "time": "21:12"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "정명숙 제출함?",
     "at": "2026-01-21T02:14:23+09:00",
     "day": "1/21",
     "time": "02:14"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "바람라서 우산 챙김",
     "at": "2026-01-21T05:06:11+09:00",
     "day": "1/21",
     "time": "05:06"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "과방 제출함",
     "at": "2026-01-21T08:01:56+09:00",
     "day": "1/21",
     "time": "08:01"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "수강신청 포기함",
     "at": "2026-01-22T07:25:18+09:00",
     "day": "1/22",
     "time": "07:25"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "8시까지 중앙도서관 갈 수 있어?",
     "at": "2026-01-22T10:51:43+09:00",
     "day": "1/22",
     "time": "10:51"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "대학글쓰기 교수님 끝남",
     "at": "2026-01-22T11:24:53+09:00",
     "day": "1/22",
     "time": "11:24"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "과방 시작도 못 함",
     "at": "2026-01-22T12:25:56+09:00",
     "day": "1/22",
     "time": "12:25"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "월요일에 수강 정정 한대",
     "at": "2026-01-23T06:18:09+09:00",
     "day": "1/23",
     "time": "06:18"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "밤 11시에 잔디밭 갈 사람?",
     "at": "2026-01-23T08:07:46+09:00",
     "day": "1/23",
     "time": "08:07"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "최유빈 과제 갔어?",
     "at": "2026-01-23T09:30:42+09:00",
     "day": "1/23",
     "time": "09:30"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "성원동 분식 자리 있어?",
     "at": "2026-01-23T12:06:16+09:00",
     "day": "1/23",
     "time": "12:06"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "통계학 망했다",
     "at": "2026-01-23T22:59:02+09:00",
     "day": "1/23",
     "time": "22:59"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "문지원 개강 갔어?",
     "at": "2026-01-24T12:19:58+09:00",
     "day": "1/24",
     "time": "12:19"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "동아리 준비물 뭐 챙겨?",
     "at": "2026-01-24T16:09:12+09:00",
     "day": "1/24",
     "time": "16:09"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "과방 내일 함",
     "at": "2026-01-24T22:00:13+09:00",
     "day": "1/24",
     "time": "22:00"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "윤서진 끝남?",
     "at": "2026-01-25T02:26:25+09:00",
     "day": "1/25",
     "time": "02:26"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "10시에 잔디밭 갈 사람?",
     "at": "2026-01-25T10:27:05+09:00",
     "day": "1/25",
     "time": "10:27"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "오늘 김밥 먹을 사람",
     "at": "2026-01-25T13:59:58+09:00",
     "day": "1/25",
     "time": "13:59"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "치킨마요 먹고 중앙도서관 갈래?",
     "at": "2026-01-26T01:05:03+09:00",
     "day": "1/26",
     "time": "01:05"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "10시까지 과방 갈 수 있어?",
     "at": "2026-01-26T03:51:13+09:00",
     "day": "1/26",
     "time": "03:51"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "중간고사 준비물 뭐 챙겨?",
     "at": "2026-01-27T18:22:26+09:00",
     "day": "1/27",
     "time": "18:22"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "수강신청 망함",
     "at": "2026-01-28T06:12:31+09:00",
     "day": "1/28",
     "time": "06:12"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "통계학 교수님 내일 함",
     "at": "2026-01-29T12:17:02+09:00",
     "day": "1/29",
     "time": "12:17"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "12시에 성원동 분식에서 볼 사람?",
     "at": "2026-01-29T13:58:25+09:00",
     "day": "1/29",
     "time": "13:58"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "신건우 발표 갔어?",
     "at": "2026-01-30T09:04:43+09:00",
     "day": "1/30",
     "time": "09:04"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "떡볶이 먹고 중앙도서관 갈래?",
     "at": "2026-01-30T19:33:05+09:00",
     "day": "1/30",
     "time": "19:33"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "목요일 개강 비었음",
     "at": "2026-01-30T23:22:13+09:00",
     "day": "1/30",
     "time": "23:22"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "중간고사 생각보다 괜찮음",
     "at": "2026-01-31T07:31:59+09:00",
     "day": "1/31",
     "time": "07:31"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "카레라이스 먹고 성원동 카페 갈래?",
     "at": "2026-01-31T12:26:09+09:00",
     "day": "1/31",
     "time": "12:26"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "수요일에 수강 정정 한대",
     "at": "2026-01-31T12:26:56+09:00",
     "day": "1/31",
     "time": "12:26"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "떡볶이 먹고 잔디밭 갈래?",
     "at": "2026-01-31T16:12:29+09:00",
     "day": "1/31",
     "time": "16:12"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "오늘 학생회관 사람 많아?",
     "at": "2026-02-02T00:04:14+09:00",
     "day": "2/2",
     "time": "00:04"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "수강신청 생각보다 괜찮음",
     "at": "2026-02-03T06:55:26+09:00",
     "day": "2/3",
     "time": "06:55"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "수요일 발표 미뤘음",
     "at": "2026-02-03T07:20:01+09:00",
     "day": "2/3",
     "time": "07:20"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "오늘 짜장밥 먹을 사람",
     "at": "2026-02-03T21:08:30+09:00",
     "day": "2/3",
     "time": "21:08"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "오늘 과방 사람 많아?",
     "at": "2026-02-04T02:43:15+09:00",
     "day": "2/4",
     "time": "02:43"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "10시에 성원동 카페 갈 사람?",
     "at": "2026-02-04T09:56:02+09:00",
     "day": "2/4",
     "time": "09:56"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "과방 괜찮다",
     "at": "2026-02-04T10:13:22+09:00",
     "day": "2/4",
     "time": "10:13"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "임동현 많다?",
     "at": "2026-02-04T19:57:37+09:00",
     "day": "2/4",
     "time": "19:57"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "수강신청 선방함",
     "at": "2026-02-07T00:09:21+09:00",
     "day": "2/7",
     "time": "00:09"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "수강 정정 선방함",
     "at": "2026-02-08T07:49:52+09:00",
     "day": "2/8",
     "time": "07:49"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "내일 3교시 있는 사람?",
     "at": "2026-02-08T22:27:45+09:00",
     "day": "2/8",
     "time": "22:27"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "오늘 중앙도서관 사람 많아?",
     "at": "2026-02-08T23:37:23+09:00",
     "day": "2/8",
     "time": "23:37"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "오늘 성원동 카페 사람 많아?",
     "at": "2026-02-11T03:27:49+09:00",
     "day": "2/11",
     "time": "03:27"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "화요일에 과제 한대",
     "at": "2026-02-12T08:07:59+09:00",
     "day": "2/12",
     "time": "08:07"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "과제 괜찮다",
     "at": "2026-02-13T07:27:54+09:00",
     "day": "2/13",
     "time": "07:27"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "축제 예약됨",
     "at": "2026-02-14T23:28:57+09:00",
     "day": "2/14",
     "time": "23:28"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "6시까지 잔디밭 갈 수 있어?",
     "at": "2026-02-15T09:04:50+09:00",
     "day": "2/15",
     "time": "09:04"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "성원구 보건소아 밥 먹었어?",
     "at": "2026-02-16T00:18:41+09:00",
     "day": "2/16",
     "time": "00:18"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "정시우 수강 정정 갔어?",
     "at": "2026-02-16T20:58:42+09:00",
     "day": "2/16",
     "time": "20:58"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "성원구 보건소아 시간 돼?",
     "at": "2026-02-16T23:19:56+09:00",
     "day": "2/16",
     "time": "23:19"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "목요일 동아리 확인함",
     "at": "2026-02-17T00:52:48+09:00",
     "day": "2/17",
     "time": "00:52"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "6시에 과방 갈 사람?",
     "at": "2026-02-17T20:20:45+09:00",
     "day": "2/17",
     "time": "20:20"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "중앙도서관 자리 있어?",
     "at": "2026-02-18T17:28:20+09:00",
     "day": "2/18",
     "time": "17:28"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "오늘 우동 먹을 사람",
     "at": "2026-02-23T01:00:10+09:00",
     "day": "2/23",
     "time": "01:00"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "경제학원론 교수님 내일 함",
     "at": "2026-02-23T08:56:08+09:00",
     "day": "2/23",
     "time": "08:56"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "과방 밀림",
     "at": "2026-02-23T11:20:58+09:00",
     "day": "2/23",
     "time": "11:20"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "발표 성공",
     "at": "2026-02-23T16:32:47+09:00",
     "day": "2/23",
     "time": "16:32"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "10시까지 학생회관 갈 수 있어?",
     "at": "2026-02-23T19:59:48+09:00",
     "day": "2/23",
     "time": "19:59"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "잔디밭 자리 있어?",
     "at": "2026-02-24T04:58:47+09:00",
     "day": "2/24",
     "time": "04:58"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "10시에 학생회관에서 볼 사람?",
     "at": "2026-02-26T11:33:59+09:00",
     "day": "2/26",
     "time": "11:33"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "단톡 괜찮다",
     "at": "2026-02-26T12:36:19+09:00",
     "day": "2/26",
     "time": "12:36"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "박세라 개강 갔어?",
     "at": "2026-02-26T23:59:57+09:00",
     "day": "2/26",
     "time": "23:59"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "수강 정정 준비물 뭐 챙겨?",
     "at": "2026-02-27T01:59:27+09:00",
     "day": "2/27",
     "time": "01:59"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "과제 밀림",
     "at": "2026-02-27T22:10:26+09:00",
     "day": "2/27",
     "time": "22:10"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "한서대 도서관아 뭐 해?",
     "at": "2026-02-28T20:40:04+09:00",
     "day": "2/28",
     "time": "20:40"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "오늘 치킨마요 먹을 사람",
     "at": "2026-03-01T02:34:16+09:00",
     "day": "3/1",
     "time": "02:34"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "오늘 떡볶이 먹을 사람",
     "at": "2026-03-03T11:05:06+09:00",
     "day": "3/3",
     "time": "11:05"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "과제 조용하다",
     "at": "2026-03-03T15:43:34+09:00",
     "day": "3/3",
     "time": "15:43"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "학생회관 자리 있어?",
     "at": "2026-03-04T03:05:38+09:00",
     "day": "3/4",
     "time": "03:05"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "동아리 끝남",
     "at": "2026-03-04T05:13:35+09:00",
     "day": "3/4",
     "time": "05:13"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "오늘 돈까스 먹을 사람",
     "at": "2026-03-04T20:13:16+09:00",
     "day": "3/4",
     "time": "20:13"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "수요일에 개강총회 한대",
     "at": "2026-03-05T01:08:27+09:00",
     "day": "3/5",
     "time": "01:08"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "수요일에 발표 한대",
     "at": "2026-03-05T10:52:17+09:00",
     "day": "3/5",
     "time": "10:52"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "과방 자리 있어?",
     "at": "2026-03-06T01:46:18+09:00",
     "day": "3/6",
     "time": "01:46"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "떡볶이 시킬까?",
     "at": "2026-03-06T16:22:14+09:00",
     "day": "3/6",
     "time": "16:22"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "홍예슬 중간고사 갔어?",
     "at": "2026-03-08T01:51:19+09:00",
     "day": "3/8",
     "time": "01:51"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "돈까스 먹고 성원동 카페 갈래?",
     "at": "2026-03-09T02:42:33+09:00",
     "day": "3/9",
     "time": "02:42"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "통계학 교수님 괜찮다",
     "at": "2026-03-09T17:23:48+09:00",
     "day": "3/9",
     "time": "17:23"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "이유나 제출함?",
     "at": "2026-03-10T22:03:14+09:00",
     "day": "3/10",
     "time": "22:03"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "수요일 발표 확인함",
     "at": "2026-03-11T02:07:06+09:00",
     "day": "3/11",
     "time": "02:07"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "컴퓨터활용 교수님 확인함",
     "at": "2026-03-11T10:09:42+09:00",
     "day": "3/11",
     "time": "10:09"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "축제 준비물 뭐 챙겨?",
     "at": "2026-03-12T15:04:20+09:00",
     "day": "3/12",
     "time": "15:04"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "이웃마켓 고객센터아 과제 했어?",
     "at": "2026-03-13T05:53:02+09:00",
     "day": "3/13",
     "time": "05:53"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "단톡 미뤘음",
     "at": "2026-03-14T21:52:28+09:00",
     "day": "3/14",
     "time": "21:52"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "내일 1교시 있는 사람?",
     "at": "2026-03-15T03:51:00+09:00",
     "day": "3/15",
     "time": "03:51"
    }
   ]
  },
  {
   "id": "talk.hs32",
   "name": "성원고 3-2",
   "type": "group",
   "circle": "성원고 동창",
   "count": 31,
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
     "sender": "신건우",
     "body": "임동현 요즘 뭐 해?",
     "at": "2025-11-01T15:07:03+09:00",
     "day": "11/1",
     "time": "15:07"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "바람 바쁘다",
     "at": "2025-11-03T19:49:50+09:00",
     "day": "11/3",
     "time": "19:49"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "박정우은 수업 들었어?",
     "at": "2025-11-04T05:43:05+09:00",
     "day": "11/4",
     "time": "05:43"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "햇살 재밌다",
     "at": "2025-11-06T07:26:24+09:00",
     "day": "11/6",
     "time": "07:26"
    },
    {
     "dir": "in",
     "sender": "정지훈",
     "body": "불고기덮밥 재밌다",
     "at": "2025-11-08T14:43:19+09:00",
     "day": "11/8",
     "time": "14:43"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "주말 모임 망함",
     "at": "2025-11-09T07:56:22+09:00",
     "day": "11/9",
     "time": "07:56"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "박하늘아 잘 지내?",
     "at": "2025-11-09T16:54:34+09:00",
     "day": "11/9",
     "time": "16:54"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "입대 D-2",
     "at": "2025-11-10T22:08:29+09:00",
     "day": "11/10",
     "time": "22:08"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "대학글쓰기 많다",
     "at": "2025-11-14T17:28:23+09:00",
     "day": "11/14",
     "time": "17:28"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "떡볶이 먹고 갈래?",
     "at": "2025-11-14T22:49:34+09:00",
     "day": "11/14",
     "time": "22:49"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "수요일에 성원동 분식 갈 사람",
     "at": "2025-11-15T02:14:25+09:00",
     "day": "11/15",
     "time": "02:14"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "생일 비었음",
     "at": "2025-11-19T08:16:16+09:00",
     "day": "11/19",
     "time": "08:16"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "학원 선방함",
     "at": "2025-11-20T04:58:09+09:00",
     "day": "11/20",
     "time": "04:58"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "생일 성공",
     "at": "2025-11-22T06:16:40+09:00",
     "day": "11/22",
     "time": "06:16"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "새벽 2시에 성원동 카페에서 보자",
     "at": "2025-11-22T15:08:00+09:00",
     "day": "11/22",
     "time": "15:08"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "목요일 생일 어때?",
     "at": "2025-11-22T23:19:39+09:00",
     "day": "11/22",
     "time": "23:19"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "10시 성원동 골목 예약됨",
     "at": "2025-11-24T12:33:55+09:00",
     "day": "11/24",
     "time": "12:33"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "이준서아 시간 돼?",
     "at": "2025-11-30T06:36:43+09:00",
     "day": "11/30",
     "time": "06:36"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "바람라서 산책함",
     "at": "2025-12-02T07:18:03+09:00",
     "day": "12/2",
     "time": "07:18"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "야자 망함",
     "at": "2025-12-05T01:36:20+09:00",
     "day": "12/5",
     "time": "01:36"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "생일 선방함",
     "at": "2025-12-10T03:14:12+09:00",
     "day": "12/10",
     "time": "03:14"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "수요일에 성원동 카페 갈 사람",
     "at": "2025-12-11T18:00:23+09:00",
     "day": "12/11",
     "time": "18:00"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "대학글쓰기 내일 함",
     "at": "2025-12-12T23:37:17+09:00",
     "day": "12/12",
     "time": "23:37"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "8시에 학원 앞에서 보자",
     "at": "2025-12-13T00:06:19+09:00",
     "day": "12/13",
     "time": "00:06"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "다음 주 졸업 많다",
     "at": "2025-12-13T08:36:44+09:00",
     "day": "12/13",
     "time": "08:36"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "10시 성원동 분식 바쁘다",
     "at": "2025-12-16T22:21:47+09:00",
     "day": "12/16",
     "time": "22:21"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "바람라서 창밖만 봄",
     "at": "2025-12-18T08:17:01+09:00",
     "day": "12/18",
     "time": "08:17"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "모의고사 선방함",
     "at": "2025-12-20T14:46:25+09:00",
     "day": "12/20",
     "time": "14:46"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "일요일에 성원동 카페 갈 사람",
     "at": "2025-12-21T02:47:38+09:00",
     "day": "12/21",
     "time": "02:47"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "우동 먹고 갈래?",
     "at": "2025-12-21T22:00:24+09:00",
     "day": "12/21",
     "time": "22:00"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "고3 때 학원 앞 자주 갔지",
     "at": "2025-12-23T06:22:48+09:00",
     "day": "12/23",
     "time": "06:22"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "미세먼지라서 패딩 다시 꺼냄",
     "at": "2025-12-23T15:55:25+09:00",
     "day": "12/23",
     "time": "15:55"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "동네 성원동 골목 많다",
     "at": "2025-12-26T13:43:45+09:00",
     "day": "12/26",
     "time": "13:43"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "한끼 고객센터 요즘 뭐 해?",
     "at": "2025-12-27T22:42:33+09:00",
     "day": "12/27",
     "time": "22:42"
    },
    {
     "dir": "in",
     "sender": "정지훈",
     "body": "입대 한 달 남음",
     "at": "2025-12-29T02:49:00+09:00",
     "day": "12/29",
     "time": "02:49"
    },
    {
     "dir": "in",
     "sender": "정지훈",
     "body": "오늘 영어 좋다",
     "at": "2025-12-30T02:21:45+09:00",
     "day": "12/30",
     "time": "02:21"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "이상철은 어디야?",
     "at": "2025-12-30T23:17:24+09:00",
     "day": "12/30",
     "time": "23:17"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "정다은은 과제 했어?",
     "at": "2026-01-03T19:39:06+09:00",
     "day": "1/3",
     "time": "19:39"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "오늘 마케팅원론 망했다",
     "at": "2026-01-07T14:13:37+09:00",
     "day": "1/7",
     "time": "14:13"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "영어 미뤘음",
     "at": "2026-01-07T19:31:03+09:00",
     "day": "1/7",
     "time": "19:31"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "10시 성원동 분식 하는 중",
     "at": "2026-01-09T01:34:21+09:00",
     "day": "1/9",
     "time": "01:34"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "불고기덮밥 먹고 갈래?",
     "at": "2026-01-12T14:59:56+09:00",
     "day": "1/12",
     "time": "14:59"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "수시 준비 제출함",
     "at": "2026-01-12T20:48:57+09:00",
     "day": "1/12",
     "time": "20:48"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "생일 준비 많다",
     "at": "2026-01-15T03:40:54+09:00",
     "day": "1/15",
     "time": "03:40"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "다음 주 알바 바쁘다",
     "at": "2026-01-16T12:01:47+09:00",
     "day": "1/16",
     "time": "12:01"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "졸업 밀림",
     "at": "2026-01-17T05:10:18+09:00",
     "day": "1/17",
     "time": "05:10"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "김밥 끝났다",
     "at": "2026-01-19T12:59:20+09:00",
     "day": "1/19",
     "time": "12:59"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "졸업 준비 하는 중",
     "at": "2026-01-19T18:39:16+09:00",
     "day": "1/19",
     "time": "18:39"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "김말순은 뭐 해?",
     "at": "2026-01-20T15:51:16+09:00",
     "day": "1/20",
     "time": "15:51"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "8시에 성원천에서 보자",
     "at": "2026-01-22T07:19:52+09:00",
     "day": "1/22",
     "time": "07:19"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "입대 다음 주",
     "at": "2026-01-22T12:23:03+09:00",
     "day": "1/22",
     "time": "12:23"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "오늘 영어 망했다",
     "at": "2026-01-22T14:30:04+09:00",
     "day": "1/22",
     "time": "14:30"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "주말 모임 조용하다",
     "at": "2026-01-22T20:29:34+09:00",
     "day": "1/22",
     "time": "20:29"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "고3 때 성원천 자주 갔지",
     "at": "2026-01-25T15:17:06+09:00",
     "day": "1/25",
     "time": "15:17"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "동네 독서실 예약됨",
     "at": "2026-01-25T21:04:15+09:00",
     "day": "1/25",
     "time": "21:04"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "야자 다 찍음",
     "at": "2026-01-29T15:05:13+09:00",
     "day": "1/29",
     "time": "15:05"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "목요일에 성원동 골목 갈 사람",
     "at": "2026-01-29T17:51:39+09:00",
     "day": "1/29",
     "time": "17:51"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "밤 11시에 학원 끝나",
     "at": "2026-01-31T02:24:35+09:00",
     "day": "1/31",
     "time": "02:24"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "9시에 학원 끝나",
     "at": "2026-02-07T20:56:11+09:00",
     "day": "2/7",
     "time": "20:56"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "10시 성원동 골목 확인함",
     "at": "2026-02-10T08:35:16+09:00",
     "day": "2/10",
     "time": "08:35"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "밤 11시에 성원동 골목에서 보자",
     "at": "2026-02-14T05:44:09+09:00",
     "day": "2/14",
     "time": "05:44"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "입대 D-3",
     "at": "2026-02-15T12:53:29+09:00",
     "day": "2/15",
     "time": "12:53"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "미세먼지라서 옷 못 정함",
     "at": "2026-02-16T11:20:34+09:00",
     "day": "2/16",
     "time": "11:20"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "재수 살았다",
     "at": "2026-02-18T05:38:44+09:00",
     "day": "2/18",
     "time": "05:38"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "학원 준비 끝남",
     "at": "2026-02-18T16:02:11+09:00",
     "day": "2/18",
     "time": "16:02"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "흐림라서 옷 못 정함",
     "at": "2026-02-21T00:04:54+09:00",
     "day": "2/21",
     "time": "00:04"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "수시 거의 다 함",
     "at": "2026-02-21T04:37:17+09:00",
     "day": "2/21",
     "time": "04:37"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "모의고사 망함",
     "at": "2026-02-23T12:13:30+09:00",
     "day": "2/23",
     "time": "12:13"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "고3 때 성원동 카페 자주 갔지",
     "at": "2026-02-25T01:58:34+09:00",
     "day": "2/25",
     "time": "01:58"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "새벽 1시에 학원 끝나",
     "at": "2026-02-25T06:21:49+09:00",
     "day": "2/25",
     "time": "06:21"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "새벽 2시 학원 앞 조용하다",
     "at": "2026-02-25T20:23:48+09:00",
     "day": "2/25",
     "time": "20:23"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "6시에 독서실에서 보자",
     "at": "2026-02-26T00:25:39+09:00",
     "day": "2/26",
     "time": "00:25"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "모의고사 생각보다 괜찮음",
     "at": "2026-02-27T21:29:32+09:00",
     "day": "2/27",
     "time": "21:29"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "9시 성원천 거의 다 함",
     "at": "2026-03-05T17:06:19+09:00",
     "day": "3/5",
     "time": "17:06"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "오늘 통계학 졸리다",
     "at": "2026-03-06T00:21:14+09:00",
     "day": "3/6",
     "time": "00:21"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "모의고사 끝남",
     "at": "2026-03-06T08:58:12+09:00",
     "day": "3/6",
     "time": "08:58"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "입대 3주 남음",
     "at": "2026-03-07T14:39:31+09:00",
     "day": "3/7",
     "time": "14:39"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "월요일 졸업 어때?",
     "at": "2026-03-09T09:19:10+09:00",
     "day": "3/9",
     "time": "09:19"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "모의고사 성공",
     "at": "2026-03-10T08:55:09+09:00",
     "day": "3/10",
     "time": "08:55"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "12시에 학원 끝나",
     "at": "2026-03-10T14:03:28+09:00",
     "day": "3/10",
     "time": "14:03"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "다들 자냐",
     "at": "2026-03-15T03:55:00+09:00",
     "day": "3/15",
     "time": "03:55"
    }
   ]
  },
  {
   "id": "talk.team3",
   "name": "경영원론 3조",
   "type": "group",
   "circle": "한서대 경영 26 동기",
   "count": 5,
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
     "sender": "박하늘",
     "body": "오늘 학생회관 자리 있다",
     "at": "2026-03-02T03:37:43+09:00",
     "day": "3/2",
     "time": "03:37"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "과제 PPT 만들기 준비 중",
     "at": "2026-03-03T05:32:01+09:00",
     "day": "3/3",
     "time": "05:32"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "결론 다시 봄",
     "at": "2026-03-03T06:54:38+09:00",
     "day": "3/3",
     "time": "06:54"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "자료 정리함",
     "at": "2026-03-03T12:41:17+09:00",
     "day": "3/3",
     "time": "12:41"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "기사 정리함",
     "at": "2026-03-04T01:34:00+09:00",
     "day": "3/4",
     "time": "01:34"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "마감 3주 남음",
     "at": "2026-03-04T02:01:42+09:00",
     "day": "3/4",
     "time": "02:01"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "PPT 만들기 다시 봄",
     "at": "2026-03-04T07:50:34+09:00",
     "day": "3/4",
     "time": "07:50"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "내일 10시까지 가능?",
     "at": "2026-03-04T12:30:35+09:00",
     "day": "3/4",
     "time": "12:30"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "자료 찾는 중",
     "at": "2026-03-04T20:59:30+09:00",
     "day": "3/4",
     "time": "20:59"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "3/18 23:59까지 PPT 만들기",
     "at": "2026-03-05T19:15:55+09:00",
     "day": "3/5",
     "time": "19:15"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "과제 보고서 작성 남았어",
     "at": "2026-03-06T19:58:23+09:00",
     "day": "3/6",
     "time": "19:58"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "자료 확인 필요",
     "at": "2026-03-06T22:40:36+09:00",
     "day": "3/6",
     "time": "22:40"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "통계 거의 다 모음",
     "at": "2026-03-07T08:00:12+09:00",
     "day": "3/7",
     "time": "08:00"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "서은비 확인 부탁",
     "at": "2026-03-07T08:29:13+09:00",
     "day": "3/7",
     "time": "08:29"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "마감 다음 주",
     "at": "2026-03-08T05:51:25+09:00",
     "day": "3/8",
     "time": "05:51"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "과제 발표 연습 준비 중",
     "at": "2026-03-08T06:17:28+09:00",
     "day": "3/8",
     "time": "06:17"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "3/18 23:59 마감 중요",
     "at": "2026-03-08T14:13:35+09:00",
     "day": "3/8",
     "time": "14:13"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "3/18 23:59까지 사례 조사",
     "at": "2026-03-09T02:54:12+09:00",
     "day": "3/9",
     "time": "02:54"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "2시에 성원동 카페 어때?",
     "at": "2026-03-09T11:00:32+09:00",
     "day": "3/9",
     "time": "11:00"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "제출 아직",
     "at": "2026-03-09T17:24:35+09:00",
     "day": "3/9",
     "time": "17:24"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "3/18 23:59 마감 확인",
     "at": "2026-03-09T21:37:31+09:00",
     "day": "3/9",
     "time": "21:37"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "발표 PPT 맡음",
     "at": "2026-03-09T23:56:28+09:00",
     "day": "3/9",
     "time": "23:56"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "통계 확인 필요",
     "at": "2026-03-10T05:48:43+09:00",
     "day": "3/10",
     "time": "05:48"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "제출 완료",
     "at": "2026-03-10T11:31:05+09:00",
     "day": "3/10",
     "time": "11:31"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "발표 도입 다시 봄",
     "at": "2026-03-10T15:21:56+09:00",
     "day": "3/10",
     "time": "15:21"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "3/18 23:59 마감 얼마 안 남음",
     "at": "2026-03-10T16:55:28+09:00",
     "day": "3/10",
     "time": "16:55"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "최유빈 확인 부탁",
     "at": "2026-03-10T21:58:43+09:00",
     "day": "3/10",
     "time": "21:58"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "발표 발표 연습함",
     "at": "2026-03-11T06:27:15+09:00",
     "day": "3/11",
     "time": "06:27"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "과제 사례 조사 남았어",
     "at": "2026-03-11T06:36:03+09:00",
     "day": "3/11",
     "time": "06:36"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "발표 사례 다시 봄",
     "at": "2026-03-11T08:23:07+09:00",
     "day": "3/11",
     "time": "08:23"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "사진 찾는 중",
     "at": "2026-03-11T17:20:06+09:00",
     "day": "3/11",
     "time": "17:20"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "자료 거의 다 모음",
     "at": "2026-03-11T20:37:06+09:00",
     "day": "3/11",
     "time": "20:37"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "발표 자료 정리 맡음",
     "at": "2026-03-12T04:30:21+09:00",
     "day": "3/12",
     "time": "04:30"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "8시에 중앙도서관 어때?",
     "at": "2026-03-12T10:51:39+09:00",
     "day": "3/12",
     "time": "10:51"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "PPT 준비 중",
     "at": "2026-03-12T22:10:31+09:00",
     "day": "3/12",
     "time": "22:10"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "과제 PPT 만들기 끝냄",
     "at": "2026-03-12T23:51:08+09:00",
     "day": "3/12",
     "time": "23:51"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "자료 부족함",
     "at": "2026-03-13T12:59:52+09:00",
     "day": "3/13",
     "time": "12:59"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "발표 본론 다시 봄",
     "at": "2026-03-13T17:38:31+09:00",
     "day": "3/13",
     "time": "17:38"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "새벽 2시에 중앙도서관 어때?",
     "at": "2026-03-14T09:29:12+09:00",
     "day": "3/14",
     "time": "09:29"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "3/18 23:59까지 보고서 작성",
     "at": "2026-03-14T12:18:47+09:00",
     "day": "3/14",
     "time": "12:18"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "3/18 23:59까지 제출 완료하자",
     "at": "2026-03-15T03:38:00+09:00",
     "day": "3/15",
     "time": "03:38"
    }
   ]
  },
  {
   "id": "talk.futsal",
   "name": "성원 풋살",
   "type": "group",
   "circle": "풋살",
   "count": 14,
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
     "sender": "최민규",
     "body": "다들 괜찮다?",
     "at": "2025-09-02T12:32:13+09:00",
     "day": "9/2",
     "time": "12:32"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "이번 주 수요일 예약됨",
     "at": "2025-09-04T19:15:40+09:00",
     "day": "9/4",
     "time": "19:15"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "회비 비었음",
     "at": "2025-09-05T03:56:58+09:00",
     "day": "9/5",
     "time": "03:56"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "경기 2-1",
     "at": "2025-09-12T14:55:31+09:00",
     "day": "9/12",
     "time": "14:55"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "최유빈 9시 가능?",
     "at": "2025-09-14T00:27:48+09:00",
     "day": "9/14",
     "time": "00:27"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "러닝 최고",
     "at": "2025-09-24T03:27:47+09:00",
     "day": "9/24",
     "time": "03:27"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "다들 비었음?",
     "at": "2025-09-24T22:23:45+09:00",
     "day": "9/24",
     "time": "22:23"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "다음 경기 끝남",
     "at": "2025-09-26T22:30:57+09:00",
     "day": "9/26",
     "time": "22:30"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "오늘 10시 편의점 미뤘음",
     "at": "2025-10-01T19:18:40+09:00",
     "day": "10/1",
     "time": "19:18"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "목요일 8시 예약됨",
     "at": "2025-10-10T05:03:16+09:00",
     "day": "10/10",
     "time": "05:03"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "구장 제출함",
     "at": "2025-10-13T11:18:47+09:00",
     "day": "10/13",
     "time": "11:18"
    },
    {
     "dir": "in",
     "sender": "김상욱",
     "body": "다음 경기 비었음",
     "at": "2025-10-17T11:42:41+09:00",
     "day": "10/17",
     "time": "11:42"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "구장 예약 하는 중",
     "at": "2025-10-20T13:53:47+09:00",
     "day": "10/20",
     "time": "13:53"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "구장비 거의 다 함",
     "at": "2025-10-30T14:40:37+09:00",
     "day": "10/30",
     "time": "14:40"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "바람 끝남",
     "at": "2025-11-16T15:58:50+09:00",
     "day": "11/16",
     "time": "15:58"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "이번 주 월요일 2시 과방",
     "at": "2025-11-18T17:06:12+09:00",
     "day": "11/18",
     "time": "17:06"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "미세먼지 미뤘음",
     "at": "2025-11-22T15:37:35+09:00",
     "day": "11/22",
     "time": "15:37"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "구장 많다",
     "at": "2025-11-22T23:23:25+09:00",
     "day": "11/22",
     "time": "23:23"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "8시에 학생회관 비었음",
     "at": "2025-11-24T23:27:21+09:00",
     "day": "11/24",
     "time": "23:27"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "구장 예약 시작도 못 함",
     "at": "2025-11-26T14:56:24+09:00",
     "day": "11/26",
     "time": "14:56"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "수요일 밤 11시 끝남",
     "at": "2025-11-27T15:16:20+09:00",
     "day": "11/27",
     "time": "15:16"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "흐림라서 커피 삼",
     "at": "2025-12-01T06:24:16+09:00",
     "day": "12/1",
     "time": "06:24"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "바람라서 실내에만 있음",
     "at": "2025-12-03T00:40:15+09:00",
     "day": "12/3",
     "time": "00:40"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "바람라서 커피 삼",
     "at": "2025-12-03T20:54:44+09:00",
     "day": "12/3",
     "time": "20:54"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "구장 예약 조용하다",
     "at": "2025-12-12T15:58:32+09:00",
     "day": "12/12",
     "time": "15:58"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "박정우 골키퍼 가능?",
     "at": "2025-12-13T00:43:47+09:00",
     "day": "12/13",
     "time": "00:43"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "8시에 학생회관 제출함",
     "at": "2025-12-18T21:13:33+09:00",
     "day": "12/18",
     "time": "21:13"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "햇살라서 커피 삼",
     "at": "2025-12-30T09:02:25+09:00",
     "day": "12/30",
     "time": "09:02"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "점심 비었음",
     "at": "2026-01-03T17:57:36+09:00",
     "day": "1/3",
     "time": "17:57"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "햇살라서 우산 챙김",
     "at": "2026-01-05T04:06:00+09:00",
     "day": "1/5",
     "time": "04:06"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "회비 2만 원",
     "at": "2026-01-15T16:34:01+09:00",
     "day": "1/15",
     "time": "16:34"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "오영수 2시 가능?",
     "at": "2026-01-19T17:25:28+09:00",
     "day": "1/19",
     "time": "17:25"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "최성호 골키퍼 가능?",
     "at": "2026-01-22T08:23:03+09:00",
     "day": "1/22",
     "time": "08:23"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "물 조용하다",
     "at": "2026-01-22T18:53:18+09:00",
     "day": "1/22",
     "time": "18:53"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "구장 예약 밀림",
     "at": "2026-01-28T20:56:12+09:00",
     "day": "1/28",
     "time": "20:56"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "회비 회비",
     "at": "2026-01-30T08:41:24+09:00",
     "day": "1/30",
     "time": "08:41"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "러닝 단축",
     "at": "2026-02-01T21:46:31+09:00",
     "day": "2/1",
     "time": "21:46"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "이번 주 월요일 비었음",
     "at": "2026-02-02T18:33:02+09:00",
     "day": "2/2",
     "time": "18:33"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "이번 주 토요일 조용하다",
     "at": "2026-02-04T13:37:15+09:00",
     "day": "2/4",
     "time": "13:37"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "회비 만 원",
     "at": "2026-02-04T21:20:00+09:00",
     "day": "2/4",
     "time": "21:20"
    },
    {
     "dir": "in",
     "sender": "김상욱",
     "body": "6시에 편의점 하는 중",
     "at": "2026-02-05T23:33:34+09:00",
     "day": "2/5",
     "time": "23:33"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "경기 3-2",
     "at": "2026-02-07T18:48:41+09:00",
     "day": "2/7",
     "time": "18:48"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "다음 주 토요일도 밀림?",
     "at": "2026-02-10T02:07:52+09:00",
     "day": "2/10",
     "time": "02:07"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "송민호 골키퍼 가능?",
     "at": "2026-02-11T18:03:58+09:00",
     "day": "2/11",
     "time": "18:03"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "이번 주 수요일 끝남",
     "at": "2026-02-12T22:00:09+09:00",
     "day": "2/12",
     "time": "22:00"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "다들 하는 중?",
     "at": "2026-02-14T07:46:47+09:00",
     "day": "2/14",
     "time": "07:46"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "다음 경기 미뤘음",
     "at": "2026-02-21T19:48:37+09:00",
     "day": "2/21",
     "time": "19:48"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "오늘 6시 학생회관 거의 다 함",
     "at": "2026-02-24T10:27:08+09:00",
     "day": "2/24",
     "time": "10:27"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "구장비 시작도 못 함",
     "at": "2026-02-27T19:39:20+09:00",
     "day": "2/27",
     "time": "19:39"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "구장비 비었음",
     "at": "2026-03-01T13:09:57+09:00",
     "day": "3/1",
     "time": "13:09"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "회비 1만 원",
     "at": "2026-03-03T10:08:08+09:00",
     "day": "3/3",
     "time": "10:08"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "러닝 재도전",
     "at": "2026-03-04T08:56:10+09:00",
     "day": "3/4",
     "time": "08:56"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "우동 먹고 새벽 2시에 모이자",
     "at": "2026-03-06T02:21:03+09:00",
     "day": "3/6",
     "time": "02:21"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "다음 주 월요일도 내일 함?",
     "at": "2026-03-06T20:44:06+09:00",
     "day": "3/6",
     "time": "20:44"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "오늘 새벽 2시 성원천 끝남",
     "at": "2026-03-13T09:16:40+09:00",
     "day": "3/13",
     "time": "09:16"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "토요일 8시 맞지?",
     "at": "2026-03-15T03:42:00+09:00",
     "day": "3/15",
     "time": "03:42"
    }
   ]
  },
  {
   "id": "talk.alba",
   "name": "편의점 알바(2024)",
   "type": "group",
   "circle": "지난 알바",
   "count": 6,
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
     "sender": "박상철",
     "body": "점장님 비었음",
     "at": "2025-01-10T08:50:39+09:00",
     "day": "1/10",
     "time": "08:50"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "마감 거의 다 함",
     "at": "2025-01-20T21:33:35+09:00",
     "day": "1/20",
     "time": "21:33"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "토요일 10시 교대 제출함",
     "at": "2025-01-21T06:19:10+09:00",
     "day": "1/21",
     "time": "06:19"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "마감 확인함",
     "at": "2025-02-05T12:21:06+09:00",
     "day": "2/5",
     "time": "12:21"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "재고 끝남",
     "at": "2025-02-06T06:59:34+09:00",
     "day": "2/6",
     "time": "06:59"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "재고 괜찮다",
     "at": "2025-02-14T05:09:02+09:00",
     "day": "2/14",
     "time": "05:09"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "계산대 내일 함",
     "at": "2025-03-02T17:36:01+09:00",
     "day": "3/2",
     "time": "17:36"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "오늘 많다",
     "at": "2025-03-21T17:37:15+09:00",
     "day": "3/21",
     "time": "17:37"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "알바비 바쁘다",
     "at": "2025-05-04T14:22:46+09:00",
     "day": "5/4",
     "time": "14:22"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "폐기 내일 함",
     "at": "2025-06-03T10:08:23+09:00",
     "day": "6/3",
     "time": "10:08"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "오늘 괜찮다",
     "at": "2025-06-03T20:35:43+09:00",
     "day": "6/3",
     "time": "20:35"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "월요일 제출함",
     "at": "2025-06-15T16:09:28+09:00",
     "day": "6/15",
     "time": "16:09"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "택배 확인함",
     "at": "2025-06-26T22:16:08+09:00",
     "day": "6/26",
     "time": "22:16"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "오늘 미뤘음",
     "at": "2025-07-11T13:47:22+09:00",
     "day": "7/11",
     "time": "13:47"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "9시 교대 미뤘음",
     "at": "2025-07-30T02:00:25+09:00",
     "day": "7/30",
     "time": "02:00"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "재고 조용하다",
     "at": "2025-08-03T23:53:05+09:00",
     "day": "8/3",
     "time": "23:53"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "9시 교대 하는 중",
     "at": "2025-09-10T03:02:37+09:00",
     "day": "9/10",
     "time": "03:02"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "오늘 하는 중",
     "at": "2025-09-24T14:02:58+09:00",
     "day": "9/24",
     "time": "14:02"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "알바비 거의 다 함",
     "at": "2025-10-01T06:56:48+09:00",
     "day": "10/1",
     "time": "06:56"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "손님 끝남",
     "at": "2025-10-08T12:42:44+09:00",
     "day": "10/8",
     "time": "12:42"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "화요일 바쁘다",
     "at": "2025-10-11T12:02:34+09:00",
     "day": "10/11",
     "time": "12:02"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "택배 예약됨",
     "at": "2025-10-23T06:49:57+09:00",
     "day": "10/23",
     "time": "06:49"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "재고 제출함",
     "at": "2025-11-12T01:55:46+09:00",
     "day": "11/12",
     "time": "01:55"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "알바비 예약됨",
     "at": "2025-12-03T00:34:10+09:00",
     "day": "12/3",
     "time": "00:34"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "일요일 2시 교대 괜찮다",
     "at": "2025-12-11T02:18:28+09:00",
     "day": "12/11",
     "time": "02:18"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "알바비 확인함",
     "at": "2025-12-11T20:55:01+09:00",
     "day": "12/11",
     "time": "20:55"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "화요일 괜찮다",
     "at": "2026-02-09T08:46:18+09:00",
     "day": "2/9",
     "time": "08:46"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "진열 확인함",
     "at": "2026-02-14T23:27:07+09:00",
     "day": "2/14",
     "time": "23:27"
    }
   ]
  },
  {
   "id": "talk.dm.01",
   "name": "조현우",
   "type": "1:1",
   "circle": "성원고 동창",
   "count": 2,
   "members": [
    "BG-003"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "조현우",
     "body": "나 늦을 것 같아",
     "at": "2025-09-20T06:17:53+09:00",
     "day": "9/20",
     "time": "06:17"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "괜찮아 천천히 와",
     "at": "2025-11-21T22:05:52+09:00",
     "day": "11/21",
     "time": "22:05"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "ㅇㅇ",
     "at": "2025-12-04T20:54:54+09:00",
     "day": "12/4",
     "time": "20:54"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "몇 시에 끝나?",
     "at": "2025-12-07T05:48:23+09:00",
     "day": "12/7",
     "time": "05:48"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "아직",
     "at": "2025-12-19T13:50:08+09:00",
     "day": "12/19",
     "time": "13:50"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅋ",
     "at": "2025-12-22T04:03:57+09:00",
     "day": "12/22",
     "time": "04:03"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅋ",
     "at": "2025-12-25T07:38:03+09:00",
     "day": "12/25",
     "time": "07:38"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "콜",
     "at": "2026-01-17T09:36:13+09:00",
     "day": "1/17",
     "time": "09:36"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "이따 봐",
     "at": "2026-02-08T13:39:37+09:00",
     "day": "2/8",
     "time": "13:39"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "콜",
     "at": "2026-02-09T09:40:41+09:00",
     "day": "2/9",
     "time": "09:40"
    }
   ]
  },
  {
   "id": "talk.dm.02",
   "name": "윤서진",
   "type": "1:1",
   "circle": "성원고 동창",
   "count": 2,
   "members": [
    "BG-004"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "패딩 입어",
     "at": "2025-10-13T03:41:46+09:00",
     "day": "10/13",
     "time": "03:41"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "조심히 가",
     "at": "2025-10-24T16:17:19+09:00",
     "day": "10/24",
     "time": "16:17"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "그럼 4시 30분",
     "at": "2025-11-01T16:50:11+09:00",
     "day": "11/1",
     "time": "16:50"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅋㅋㅋ",
     "at": "2025-11-12T06:10:06+09:00",
     "day": "11/12",
     "time": "06:10"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "확인했어",
     "at": "2025-11-13T11:15:09+09:00",
     "day": "11/13",
     "time": "11:15"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "오늘 날씨 춥다",
     "at": "2025-11-26T08:43:40+09:00",
     "day": "11/26",
     "time": "08:43"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "몇 시",
     "at": "2025-12-11T18:50:42+09:00",
     "day": "12/11",
     "time": "18:50"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "오늘 너무 졸려",
     "at": "2025-12-23T15:39:54+09:00",
     "day": "12/23",
     "time": "15:39"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "ㅇㅋ",
     "at": "2026-02-27T08:19:05+09:00",
     "day": "2/27",
     "time": "08:19"
    }
   ]
  },
  {
   "id": "talk.dm.03",
   "name": "임동현",
   "type": "1:1",
   "circle": "성원고 동창",
   "count": 2,
   "members": [
    "BG-005"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "임동현",
     "body": "마지막으로 한 번 보자",
     "at": "2025-09-23T08:02:17+09:00",
     "day": "9/23",
     "time": "08:02"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오케이",
     "at": "2025-10-16T21:47:37+09:00",
     "day": "10/16",
     "time": "21:47"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나중에 연락할게",
     "at": "2025-10-20T09:55:48+09:00",
     "day": "10/20",
     "time": "09:55"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "검색해 봐",
     "at": "2025-11-04T19:21:20+09:00",
     "day": "11/4",
     "time": "19:21"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "내일 보자",
     "at": "2025-11-10T13:08:02+09:00",
     "day": "11/10",
     "time": "13:08"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "이번 주말",
     "at": "2025-11-25T06:17:40+09:00",
     "day": "11/25",
     "time": "06:17"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "어디서 볼까",
     "at": "2025-12-05T10:43:28+09:00",
     "day": "12/5",
     "time": "10:43"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "조금 늦어",
     "at": "2025-12-09T10:25:40+09:00",
     "day": "12/9",
     "time": "10:25"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "다들 뭐라고 하더라",
     "at": "2026-01-07T07:33:59+09:00",
     "day": "1/7",
     "time": "07:33"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나중에 연락할게",
     "at": "2026-01-16T04:40:27+09:00",
     "day": "1/16",
     "time": "04:40"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "얼마 안 남았네",
     "at": "2026-01-22T06:56:59+09:00",
     "day": "1/22",
     "time": "06:56"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "편지 쓸게",
     "at": "2026-02-01T17:48:12+09:00",
     "day": "2/1",
     "time": "17:48"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "언제?",
     "at": "2026-02-08T00:15:11+09:00",
     "day": "2/8",
     "time": "00:15"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "잘 모르겠다",
     "at": "2026-03-06T23:37:28+09:00",
     "day": "3/6",
     "time": "23:37"
    }
   ]
  },
  {
   "id": "talk.dm.04",
   "name": "홍예슬",
   "type": "1:1",
   "circle": "성원고 동창",
   "count": 2,
   "members": [
    "BG-006"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "알바 몇 시까지야",
     "at": "2025-10-05T01:49:37+09:00",
     "day": "10/5",
     "time": "01:49"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "응",
     "at": "2025-10-12T07:29:44+09:00",
     "day": "10/12",
     "time": "07:29"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "ㅇㅋ",
     "at": "2025-10-16T16:20:14+09:00",
     "day": "10/16",
     "time": "16:20"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "막차 있어?",
     "at": "2026-01-04T23:40:37+09:00",
     "day": "1/4",
     "time": "23:40"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅋ",
     "at": "2026-01-22T23:27:42+09:00",
     "day": "1/22",
     "time": "23:27"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "10분",
     "at": "2026-01-30T05:27:52+09:00",
     "day": "1/30",
     "time": "05:27"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅇ",
     "at": "2026-02-10T10:45:05+09:00",
     "day": "2/10",
     "time": "10:45"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "돈 아까워",
     "at": "2026-03-10T22:52:15+09:00",
     "day": "3/10",
     "time": "22:52"
    }
   ]
  },
  {
   "id": "talk.dm.05",
   "name": "배지훈",
   "type": "1:1",
   "circle": "성원고 동창",
   "count": 2,
   "members": [
    "BG-007"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "같이 신고 가자",
     "at": "2025-10-03T17:35:05+09:00",
     "day": "10/3",
     "time": "17:35"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "좋아",
     "at": "2025-10-10T13:37:14+09:00",
     "day": "10/10",
     "time": "13:37"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "ㅋㅋㅋ",
     "at": "2025-10-15T03:23:04+09:00",
     "day": "10/15",
     "time": "03:23"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "봤어 미쳤지",
     "at": "2025-10-28T04:19:01+09:00",
     "day": "10/28",
     "time": "04:19"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "이따 봐",
     "at": "2025-11-09T21:45:38+09:00",
     "day": "11/9",
     "time": "21:45"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "나 운동화 새로 샀어",
     "at": "2025-12-03T06:46:21+09:00",
     "day": "12/3",
     "time": "06:46"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "내일 보자",
     "at": "2025-12-24T18:59:51+09:00",
     "day": "12/24",
     "time": "18:59"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "주말에",
     "at": "2026-01-06T19:20:29+09:00",
     "day": "1/6",
     "time": "19:20"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "조금 늦어",
     "at": "2026-02-07T09:16:50+09:00",
     "day": "2/7",
     "time": "09:16"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "ㅇㅋ",
     "at": "2026-03-12T03:25:40+09:00",
     "day": "3/12",
     "time": "03:25"
    }
   ]
  },
  {
   "id": "talk.dm.06",
   "name": "김민서",
   "type": "1:1",
   "circle": "한서대 경영 26 동기",
   "count": 2,
   "members": [
    "BG-016"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "out",
     "sender": "나",
     "body": "응",
     "at": "2025-09-05T10:14:49+09:00",
     "day": "9/5",
     "time": "10:14"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "고마워",
     "at": "2025-10-02T06:59:49+09:00",
     "day": "10/2",
     "time": "06:59"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고마워",
     "at": "2025-11-15T15:38:37+09:00",
     "day": "11/15",
     "time": "15:38"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "학생회관 앞",
     "at": "2025-11-17T13:56:01+09:00",
     "day": "11/17",
     "time": "13:56"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "먹으러 갈래?",
     "at": "2025-12-16T17:55:46+09:00",
     "day": "12/16",
     "time": "17:55"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "내일 보자",
     "at": "2026-01-05T07:29:03+09:00",
     "day": "1/5",
     "time": "07:29"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나 5분 늦어",
     "at": "2026-01-19T18:42:20+09:00",
     "day": "1/19",
     "time": "18:42"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "좋아",
     "at": "2026-01-27T09:13:28+09:00",
     "day": "1/27",
     "time": "09:13"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "힘내",
     "at": "2026-01-28T20:08:57+09:00",
     "day": "1/28",
     "time": "20:08"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "확인했어",
     "at": "2026-02-06T23:24:50+09:00",
     "day": "2/6",
     "time": "23:24"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "확인했어",
     "at": "2026-02-08T17:12:56+09:00",
     "day": "2/8",
     "time": "17:12"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "했어 너는",
     "at": "2026-02-08T18:28:50+09:00",
     "day": "2/8",
     "time": "18:28"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "나 하나 남았어",
     "at": "2026-02-09T08:56:34+09:00",
     "day": "2/9",
     "time": "08:56"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅋㅋㅋ",
     "at": "2026-02-22T02:06:38+09:00",
     "day": "2/22",
     "time": "02:06"
    }
   ]
  },
  {
   "id": "talk.dm.07",
   "name": "최준",
   "type": "1:1",
   "circle": "한서대 경영 26 동기",
   "count": 2,
   "members": [
    "BG-017"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "최준",
     "body": "오늘 과제 했어?",
     "at": "2025-09-12T19:35:38+09:00",
     "day": "9/12",
     "time": "19:35"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "6시",
     "at": "2025-09-16T19:32:29+09:00",
     "day": "9/16",
     "time": "19:32"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "ㅇㅋ",
     "at": "2025-10-12T18:27:36+09:00",
     "day": "10/12",
     "time": "18:27"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "이따 봐",
     "at": "2025-10-18T07:31:12+09:00",
     "day": "10/18",
     "time": "07:31"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "좋아",
     "at": "2025-10-23T17:05:34+09:00",
     "day": "10/23",
     "time": "17:05"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "응",
     "at": "2025-11-21T02:01:34+09:00",
     "day": "11/21",
     "time": "02:01"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "이따 봐",
     "at": "2026-01-04T20:01:55+09:00",
     "day": "1/4",
     "time": "20:01"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고마워",
     "at": "2026-01-18T16:15:53+09:00",
     "day": "1/18",
     "time": "16:15"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "과방 갈래?",
     "at": "2026-03-06T20:46:36+09:00",
     "day": "3/6",
     "time": "20:46"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅋ",
     "at": "2026-03-11T19:31:23+09:00",
     "day": "3/11",
     "time": "19:31"
    }
   ]
  },
  {
   "id": "talk.dm.08",
   "name": "박하늘",
   "type": "1:1",
   "circle": "한서대 경영 26 동기",
   "count": 2,
   "members": [
    "BG-018"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "커피 필요해",
     "at": "2025-10-19T08:25:52+09:00",
     "day": "10/19",
     "time": "08:25"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "같이 하면 되지",
     "at": "2025-10-20T19:30:14+09:00",
     "day": "10/20",
     "time": "19:30"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아",
     "at": "2025-10-28T00:01:33+09:00",
     "day": "10/28",
     "time": "00:01"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "천천히 와",
     "at": "2025-11-06T00:44:05+09:00",
     "day": "11/6",
     "time": "00:44"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "조금",
     "at": "2025-11-09T08:33:14+09:00",
     "day": "11/9",
     "time": "08:33"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "자리 잡아둘게",
     "at": "2025-11-11T09:20:10+09:00",
     "day": "11/11",
     "time": "09:20"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "이따 봐",
     "at": "2025-12-08T09:34:04+09:00",
     "day": "12/8",
     "time": "09:34"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "조금 늦어",
     "at": "2026-01-21T06:26:33+09:00",
     "day": "1/21",
     "time": "06:26"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "과제 자료 찾았어?",
     "at": "2026-01-28T16:15:53+09:00",
     "day": "1/28",
     "time": "16:15"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "도서관 앞",
     "at": "2026-02-17T05:08:32+09:00",
     "day": "2/17",
     "time": "05:08"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "11시까지",
     "at": "2026-02-20T05:01:16+09:00",
     "day": "2/20",
     "time": "05:01"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "사 올게",
     "at": "2026-02-26T11:16:38+09:00",
     "day": "2/26",
     "time": "11:16"
    }
   ]
  },
  {
   "id": "talk.dm.09",
   "name": "이유나",
   "type": "1:1",
   "circle": "한서대 경영 26 동기",
   "count": 2,
   "members": [
    "BG-019"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "이유나",
     "body": "괜찮아",
     "at": "2025-09-13T04:50:20+09:00",
     "day": "9/13",
     "time": "04:50"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "10시",
     "at": "2025-11-27T16:53:17+09:00",
     "day": "11/27",
     "time": "16:53"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나중에 연락할게",
     "at": "2025-12-05T08:53:35+09:00",
     "day": "12/5",
     "time": "08:53"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "조금 늦어",
     "at": "2025-12-11T18:48:54+09:00",
     "day": "12/11",
     "time": "18:48"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅋ",
     "at": "2025-12-16T17:55:07+09:00",
     "day": "12/16",
     "time": "17:55"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "콜",
     "at": "2026-01-04T20:44:04+09:00",
     "day": "1/4",
     "time": "20:44"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "잘 자",
     "at": "2026-01-19T08:34:38+09:00",
     "day": "1/19",
     "time": "08:34"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "발표는 내가",
     "at": "2026-01-27T00:33:12+09:00",
     "day": "1/27",
     "time": "00:33"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "내일 보자",
     "at": "2026-02-28T22:24:44+09:00",
     "day": "2/28",
     "time": "22:24"
    }
   ]
  },
  {
   "id": "talk.dm.10",
   "name": "수아",
   "type": "1:1",
   "circle": "서아·영상과",
   "count": 2,
   "members": [
    "BG-029"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "수아",
     "body": "영상관에서",
     "at": "2025-09-07T10:14:49+09:00",
     "day": "9/7",
     "time": "10:14"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "이따 봐",
     "at": "2025-10-05T22:42:03+09:00",
     "day": "10/5",
     "time": "22:42"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "콜",
     "at": "2025-12-03T23:30:41+09:00",
     "day": "12/3",
     "time": "23:30"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "촬영 몇 시야?",
     "at": "2025-12-15T09:06:33+09:00",
     "day": "12/15",
     "time": "09:06"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아",
     "at": "2025-12-21T22:14:36+09:00",
     "day": "12/21",
     "time": "22:14"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오케이",
     "at": "2025-12-30T11:15:47+09:00",
     "day": "12/30",
     "time": "11:15"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "ㅇㅋ",
     "at": "2026-01-04T01:38:39+09:00",
     "day": "1/4",
     "time": "01:38"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "힘내",
     "at": "2026-03-07T22:38:59+09:00",
     "day": "3/7",
     "time": "22:38"
    }
   ]
  },
  {
   "id": "talk.dm.11",
   "name": "재현",
   "type": "1:1",
   "circle": "서아·영상과",
   "count": 2,
   "members": [
    "BG-030"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "재현",
     "body": "고마워",
     "at": "2025-10-08T07:25:45+09:00",
     "day": "10/8",
     "time": "07:25"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "나도",
     "at": "2025-10-11T03:49:31+09:00",
     "day": "10/11",
     "time": "03:49"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "편집 어디까지 했어?",
     "at": "2025-10-24T15:19:33+09:00",
     "day": "10/24",
     "time": "15:19"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "힘내",
     "at": "2025-11-05T22:15:57+09:00",
     "day": "11/5",
     "time": "22:15"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "ㅇㅋ",
     "at": "2025-11-16T09:29:33+09:00",
     "day": "11/16",
     "time": "09:29"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "해볼게",
     "at": "2025-12-02T02:23:10+09:00",
     "day": "12/2",
     "time": "02:23"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "좋아",
     "at": "2025-12-06T11:23:48+09:00",
     "day": "12/6",
     "time": "11:23"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "그건 내가",
     "at": "2025-12-09T01:43:38+09:00",
     "day": "12/9",
     "time": "01:43"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "절반",
     "at": "2026-02-21T17:47:30+09:00",
     "day": "2/21",
     "time": "17:47"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "지금 가는 중",
     "at": "2026-02-24T03:10:25+09:00",
     "day": "2/24",
     "time": "03:10"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "늦지 마",
     "at": "2026-03-11T08:30:26+09:00",
     "day": "3/11",
     "time": "08:30"
    }
   ]
  },
  {
   "id": "talk.dm.12",
   "name": "이수빈",
   "type": "1:1",
   "circle": "지난 알바",
   "count": 2,
   "members": [
    "BG-041"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "좋아",
     "at": "2025-09-05T19:17:34+09:00",
     "day": "9/5",
     "time": "19:17"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "조금 늦어",
     "at": "2025-09-07T01:55:52+09:00",
     "day": "9/7",
     "time": "01:55"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "콜",
     "at": "2025-11-03T08:21:26+09:00",
     "day": "11/3",
     "time": "08:21"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "이따 봐",
     "at": "2025-11-14T00:03:48+09:00",
     "day": "11/14",
     "time": "00:03"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "퇴근하고 연락해",
     "at": "2026-01-14T11:41:52+09:00",
     "day": "1/14",
     "time": "11:41"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "뭐 먹지",
     "at": "2026-01-21T08:31:55+09:00",
     "day": "1/21",
     "time": "08:31"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "고마워",
     "at": "2026-01-31T18:18:15+09:00",
     "day": "1/31",
     "time": "18:18"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "언제",
     "at": "2026-02-15T05:10:57+09:00",
     "day": "2/15",
     "time": "05:10"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "지금 가는 중",
     "at": "2026-03-01T08:43:06+09:00",
     "day": "3/1",
     "time": "08:43"
    }
   ]
  },
  {
   "id": "talk.dm.13",
   "name": "송민호",
   "type": "1:1",
   "circle": "학원·선생님",
   "count": 2,
   "members": [
    "BG-044"
   ],
   "muted": false,
   "withSelf": true,
   "history": [
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅇ",
     "at": "2025-09-07T08:26:45+09:00",
     "day": "9/7",
     "time": "08:26"
    },
    {
     "dir": "in",
     "sender": "송민호",
     "body": "고마워",
     "at": "2025-09-13T20:53:57+09:00",
     "day": "9/13",
     "time": "20:53"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "힘내",
     "at": "2025-10-31T08:23:15+09:00",
     "day": "10/31",
     "time": "08:23"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "괜찮아",
     "at": "2025-11-16T16:38:51+09:00",
     "day": "11/16",
     "time": "16:38"
    },
    {
     "dir": "in",
     "sender": "송민호",
     "body": "그래",
     "at": "2025-11-28T22:26:58+09:00",
     "day": "11/28",
     "time": "22:26"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "잘 자",
     "at": "2025-12-10T15:02:35+09:00",
     "day": "12/10",
     "time": "15:02"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "확인했어",
     "at": "2026-01-17T11:21:29+09:00",
     "day": "1/17",
     "time": "11:21"
    },
    {
     "dir": "in",
     "sender": "송민호",
     "body": "건강 챙겨",
     "at": "2026-01-29T05:53:16+09:00",
     "day": "1/29",
     "time": "05:53"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아",
     "at": "2026-02-03T16:17:44+09:00",
     "day": "2/3",
     "time": "16:17"
    },
    {
     "dir": "in",
     "sender": "송민호",
     "body": "네",
     "at": "2026-02-05T13:35:14+09:00",
     "day": "2/5",
     "time": "13:35"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고생했어",
     "at": "2026-02-12T20:56:51+09:00",
     "day": "2/12",
     "time": "20:56"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "지금 가는 중",
     "at": "2026-02-20T06:16:43+09:00",
     "day": "2/20",
     "time": "06:16"
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
   "bio": "한서대 경영 26 · 새내기",
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
   "bio": "경영 26학번",
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
   "bio": "한서대 경영학과",
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
   "bio": "새내기입니다",
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
   "bio": "경영 26",
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
   "bio": "한서대 26",
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
   "bio": "경영학과 · 카페 좋아함",
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
   "bio": "26학번 새내기",
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
   "bio": "성원고 3-2",
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
   "bio": "재수 중",
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
   "bio": "입대 준비",
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
   "bio": "알바 중",
   "circle": "성원고 동창",
   "followsDohyun": false,
   "followers": 300,
   "personId": "BG-006"
  },
  {
   "id": "LBG-015",
   "handle": "minjae.bae",
   "displayName": "배지훈",
   "name": "배지훈",
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
   "bio": "성원고 3-2",
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
   "bio": "훈련소 앞",
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
   "bio": "동네 친구",
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
   "bio": "촬영·편집",
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
   "bio": "영상과 · 단편",
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
   "bio": "성원동 골목 카페",
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
   "bio": "성원동 분식 · 9시까지",
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
   "bio": "성원동 헬스장",
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
   "bio": "세탁·수선",
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
   "bio": "동네 소식",
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
   "bio": "축구·전술 이야기",
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
   "bio": "게임·리뷰",
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
   "bio": "오늘의 밈",
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
   "bio": "매일 5km",
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
   "bio": "주말 농구",
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
     "body": "이거 어디야?"
    },
    {
     "author": "lens.minho",
     "createdAt": "2025-03-03T21:53:27.253828+09:00",
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#동네친구",
    "#꽃샘추위"
   ],
   "caption": "모의고사 성공",
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
   "place": "성원동 카페"
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
    "#성원고"
   ],
   "body": "주말 입대",
   "media": []
  },
  {
   "id": "LBP-0003",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2025-03-05T08:13:00+09:00",
   "likes": 480,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2025-03-05T09:51:16.775443+09:00",
     "body": "회비 보냈어"
    },
    {
     "author": "film.sua",
     "createdAt": "2025-03-05T12:21:03.824243+09:00",
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#게임"
   ],
   "body": "경기 축구",
   "media": []
  },
  {
   "id": "LBP-0004",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2025-03-05T22:06:00+09:00",
   "likes": 11,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2025-03-06T01:49:43.613213+09:00",
     "body": "최고"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "caption": "야자 끝나고 우동",
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
   "id": "LBP-0005",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2025-03-06T14:56:00+09:00",
   "likes": 23,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#재수",
    "#성원고"
   ],
   "body": "입대 곧",
   "media": []
  },
  {
   "id": "LBP-0006",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2025-03-07T01:43:00+09:00",
   "likes": 50,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2025-03-07T05:25:14.822478+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#성원동카페",
    "#성원동맛집"
   ],
   "caption": "오늘 치킨마요 어렵다",
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
   "id": "LBP-0007",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2025-03-14T01:59:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2025-03-14T03:04:55.856726+09:00",
     "body": "다음 주에 보자"
    },
    {
     "author": "music.drawer",
     "createdAt": "2025-03-14T10:03:59.903627+09:00",
     "body": "헐"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#꽃샘추위",
    "#알바"
   ],
   "caption": "학원 9시 끝",
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
    "#동네친구",
    "#알바"
   ],
   "body": "고3 졸업",
   "media": []
  },
  {
   "id": "LBP-0009",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2025-03-20T01:42:00+09:00",
   "likes": 71,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2025-03-20T08:39:56.301498+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#봄"
   ],
   "caption": "성원동 분식 예약",
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
   "id": "LBP-0010",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2025-03-22T22:27:00+09:00",
   "likes": 27,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
   ],
   "body": "화요일 모의고사",
   "media": []
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
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#입대",
    "#성원고"
   ],
   "caption": "학원 6시 끝",
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
    "#게임"
   ],
   "body": "게임 밈",
   "media": []
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
     "body": "맛있겠다"
    },
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-04-01T19:43:51.208175+09:00",
     "body": "봄 오냐"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#단편영화",
    "#편집"
   ],
   "caption": "학생회관에서 단편",
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
    "#동네친구",
    "#재수"
   ],
   "body": "토요일 졸업",
   "media": []
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
    "#단편영화",
    "#상영회",
    "#영상과"
   ],
   "caption": "영어 과제 상영회",
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
   "id": "LBP-0016",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2025-04-07T11:33:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2025-04-08T09:54:04.823555+09:00",
     "body": "ㅇㅇ"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집"
   ],
   "caption": "오늘 햇살",
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
   "id": "LBP-0017",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2025-04-09T22:14:00+09:00",
   "likes": 214,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2025-04-10T03:08:37.221379+09:00",
     "body": "역전 미쳤다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임",
    "#플리",
    "#밈"
   ],
   "body": "플리 시작도 못 함",
   "media": []
  },
  {
   "id": "LBP-0018",
   "kind": "text",
   "author": "cut.jaehyun",
   "createdAt": "2025-04-17T01:00:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2025-04-17T15:13:37.049099+09:00",
     "body": "나도 갈래"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집"
   ],
   "body": "편집 내일 함",
   "media": []
  },
  {
   "id": "LBP-0019",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2025-04-17T17:26:00+09:00",
   "likes": 71,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임"
   ],
   "body": "풋살 러닝",
   "media": []
  },
  {
   "id": "LBP-0020",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2025-04-18T23:07:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2025-04-19T01:55:11.812056+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#입대",
    "#재수"
   ],
   "body": "주말 알바",
   "media": []
  },
  {
   "id": "LBP-0021",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2025-04-22T22:10:00+09:00",
   "likes": 53,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2025-04-22T22:36:52.201657+09:00",
     "body": "몇 시에?"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2025-04-23T08:52:05.220550+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#꽃샘추위",
    "#재수"
   ],
   "body": "고3 야자",
   "media": []
  },
  {
   "id": "LBP-0022",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2025-04-23T23:11:00+09:00",
   "likes": 294,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#한서대"
   ],
   "caption": "학생회 과제 마감",
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
   "id": "LBP-0023",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2025-05-02T00:49:00+09:00",
   "likes": 62,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#밈",
    "#러닝"
   ],
   "body": "밈 풋살",
   "media": []
  },
  {
   "id": "LBP-0024",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2025-05-06T09:10:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-05-07T03:34:48.493658+09:00",
     "body": "역전 미쳤다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#동네친구",
    "#재수"
   ],
   "body": "제육볶음 집중 안 됨",
   "media": []
  },
  {
   "id": "LBP-0025",
   "kind": "text",
   "author": "yeseul.hong",
   "createdAt": "2025-05-08T01:08:00+09:00",
   "likes": 44,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2025-05-08T04:23:59.907575+09:00",
     "body": "플리 저장"
    },
    {
     "author": "football.talk",
     "createdAt": "2025-05-08T08:33:30.408845+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#꽃샘추위",
    "#성원고"
   ],
   "body": "목요일 생일",
   "media": []
  },
  {
   "id": "LBP-0026",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2025-05-12T23:49:00+09:00",
   "likes": 53,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#동네가게"
   ],
   "caption": "흐림라서 산책함",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0027",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2025-05-19T17:01:00+09:00",
   "likes": 211,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2025-05-19T23:49:15.358406+09:00",
     "body": "나도 갈래"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "body": "플리 풋살",
   "media": []
  },
  {
   "id": "LBP-0028",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2025-05-21T01:38:00+09:00",
   "likes": 105,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2025-05-21T07:15:57.863161+09:00",
     "body": "경기 봤어?"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2025-05-21T14:28:30.604024+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학생회"
   ],
   "caption": "학생회 봄 행사",
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
   "id": "LBP-0029",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2025-05-21T19:10:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-05-21T20:58:24.178600+09:00",
     "body": "몇 시에?"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-05-21T21:48:55.886712+09:00",
     "body": "어디서 찍었어?"
    },
    {
     "author": "jun.choi",
     "createdAt": "2025-05-22T06:15:15.980242+09:00",
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#동네친구"
   ],
   "caption": "재수 어렵다",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0030",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2025-05-23T22:18:00+09:00",
   "likes": 52,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2025-05-23T23:05:10.562442+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#한서대",
    "#총학생회"
   ],
   "body": "마감 학사 일정",
   "media": []
  },
  {
   "id": "LBP-0031",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2025-05-23T23:11:00+09:00",
   "likes": 154,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#성원동맛집",
    "#성원동카페"
   ],
   "caption": "가게 새벽 2시까지",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0032",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2025-05-26T18:39:00+09:00",
   "likes": 11,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2025-05-27T01:34:26.159599+09:00",
     "body": "회비 보냈어"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2025-05-27T09:26:32.868104+09:00",
     "body": "몇 시에?"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2025-05-27T10:52:15.626033+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#꽃샘추위"
   ],
   "caption": "김밥 먹음",
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
   "id": "LBP-0033",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2025-06-03T22:42:00+09:00",
   "likes": 50,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#꽃샘추위",
    "#입대"
   ],
   "caption": "주말 동창 모임",
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
   "id": "LBP-0034",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2025-06-06T00:00:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2025-06-06T13:02:16.676633+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#동네친구",
    "#입대"
   ],
   "caption": "알바 새벽 1시 끝",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0035",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2025-06-14T19:52:00+09:00",
   "likes": 18,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#입대",
    "#동네친구"
   ],
   "caption": "재수 망했다",
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
   "kind": "text",
   "author": "frame.hana",
   "createdAt": "2025-06-17T23:52:00+09:00",
   "likes": 40,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#단편영화"
   ],
   "body": "포스터 미뤘음",
   "media": []
  },
  {
   "id": "LBP-0037",
   "kind": "text",
   "author": "yuna.lee",
   "createdAt": "2025-06-19T00:09:00+09:00",
   "likes": 26,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#꽃샘추위",
    "#입대"
   ],
   "body": "일요일 주말 모임",
   "media": []
  },
  {
   "id": "LBP-0038",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2025-06-25T22:57:00+09:00",
   "likes": 39,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2025-06-26T09:53:59.955149+09:00",
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#동네친구"
   ],
   "caption": "입대 3주 남음",
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
   "id": "LBP-0039",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2025-06-26T00:35:00+09:00",
   "likes": 27,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-06-26T18:12:52.213579+09:00",
     "body": "나도 갈래"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#재수"
   ],
   "caption": "동네 성원천",
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
   "id": "LBP-0040",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2025-06-29T10:39:00+09:00",
   "likes": 161,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-06-29T11:32:17.027868+09:00",
     "body": "응원해"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터",
    "#한서대",
    "#학생회"
   ],
   "body": "캠퍼스 총학생회 공지",
   "media": []
  },
  {
   "id": "LBP-0041",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2025-07-05T23:18:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2025-07-06T03:50:52.818607+09:00",
     "body": "우와"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄"
   ],
   "caption": "오늘 오픈",
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
   "id": "LBP-0042",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2025-07-10T20:05:00+09:00",
   "likes": 41,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2025-07-10T22:43:10.768319+09:00",
     "body": "5km 대단"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "성원동 분식에서 모의고사",
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
   "id": "LBP-0043",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2025-07-15T23:06:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2025-07-16T23:23:24.584302+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "body": "재수 살았다",
   "media": []
  },
  {
   "id": "LBP-0044",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2025-07-17T17:05:00+09:00",
   "likes": 77,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2025-07-18T10:04:18.048434+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구"
   ],
   "body": "5km 기록",
   "media": []
  },
  {
   "id": "LBP-0045",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2025-07-22T23:09:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2025-07-23T00:43:24.932881+09:00",
     "body": "봄 오냐"
    },
    {
     "author": "minjae.bae",
     "createdAt": "2025-07-23T00:44:53.739626+09:00",
     "body": "헐"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구"
   ],
   "body": "입대 이번 달",
   "media": []
  },
  {
   "id": "LBP-0046",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2025-07-23T01:50:00+09:00",
   "likes": 136,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#공지",
    "#학생회"
   ],
   "body": "학사 도서관 연장 운영",
   "media": []
  },
  {
   "id": "LBP-0047",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2025-07-28T15:21:00+09:00",
   "likes": 61,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#입대"
   ],
   "body": "친구 학원",
   "media": []
  },
  {
   "id": "LBP-0048",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2025-07-28T23:54:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-07-29T01:49:13.858190+09:00",
     "body": "회비 보냈어"
    },
    {
     "author": "lens.minho",
     "createdAt": "2025-07-29T15:44:07.157060+09:00",
     "body": "ㅇㅇ"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#상영회"
   ],
   "caption": "편집 10시",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0049",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2025-08-11T22:48:00+09:00",
   "likes": 39,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2025-08-11T23:02:44.694574+09:00",
     "body": "나도 하고 싶다"
    },
    {
     "author": "jiwon.moon",
     "createdAt": "2025-08-11T23:38:14.241478+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
   ],
   "body": "금요일 동창 모임",
   "media": []
  },
  {
   "id": "LBP-0050",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2025-08-19T01:39:00+09:00",
   "likes": 136,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#플리",
    "#농구"
   ],
   "body": "5km 재도전",
   "media": []
  },
  {
   "id": "LBP-0051",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2025-08-21T20:35:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-08-21T22:33:31.912548+09:00",
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#입대"
   ],
   "caption": "바람 패딩 다시 꺼냄",
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
   "id": "LBP-0052",
   "kind": "text",
   "author": "minjae.bae",
   "createdAt": "2025-08-22T01:41:00+09:00",
   "likes": 47,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#재수"
   ],
   "body": "목요일 주말 모임",
   "media": []
  },
  {
   "id": "LBP-0053",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2025-08-22T21:15:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2025-08-22T21:21:32.288325+09:00",
     "body": "회비 보냈어"
    },
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-08-23T06:03:51.020534+09:00",
     "body": "다음 주에 보자"
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
   "caption": "필름 과제",
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
   "id": "LBP-0054",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2025-08-23T07:18:00+09:00",
   "likes": 473,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2025-08-23T16:02:27.661731+09:00",
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#러닝",
    "#축구"
   ],
   "body": "게임 농구",
   "media": []
  },
  {
   "id": "LBP-0055",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2025-08-25T14:41:00+09:00",
   "likes": 64,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#꽃샘추위",
    "#동네친구"
   ],
   "body": "돈까스 망했다",
   "media": []
  },
  {
   "id": "LBP-0056",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2025-08-28T18:55:00+09:00",
   "likes": 71,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리"
   ],
   "body": "축구 풋살",
   "media": []
  },
  {
   "id": "LBP-0057",
   "kind": "text",
   "author": "seojin.yoon",
   "createdAt": "2025-09-04T01:27:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2025-09-04T05:23:21.773130+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#동네친구",
    "#알바"
   ],
   "body": "알바 10시 하는 중",
   "media": []
  },
  {
   "id": "LBP-0058",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2025-09-04T16:20:00+09:00",
   "likes": 32,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#게임",
    "#축구"
   ],
   "body": "축구 러닝",
   "media": []
  },
  {
   "id": "LBP-0059",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2025-09-04T22:52:00+09:00",
   "likes": 213,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#한서대",
    "#총학생회"
   ],
   "body": "신입생 봄 행사",
   "media": []
  },
  {
   "id": "LBP-0060",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2025-09-05T00:44:00+09:00",
   "likes": 10,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "body": "동네 수시",
   "media": []
  },
  {
   "id": "LBP-0061",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2025-09-05T16:56:00+09:00",
   "likes": 11,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2025-09-05T18:10:17.297505+09:00",
     "body": "다음에 같이 가자"
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
   "caption": "영어 과제 영상제",
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
   "id": "LBP-0062",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2025-09-06T00:41:00+09:00",
   "likes": 34,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-09-06T06:14:25.485053+09:00",
     "body": "알바 끝나고 봐"
    },
    {
     "author": "frame.hana",
     "createdAt": "2025-09-06T14:04:22.057537+09:00",
     "body": "농구 다음에"
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
   "caption": "포스터 시나리오",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0063",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2025-09-11T06:00:00+09:00",
   "likes": 97,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임",
    "#농구",
    "#축구"
   ],
   "body": "경기 플리",
   "media": []
  },
  {
   "id": "LBP-0064",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2025-09-11T16:29:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2025-09-11T20:57:11.648979+09:00",
     "body": "맛있겠다"
    },
    {
     "author": "jiwon.moon",
     "createdAt": "2025-09-12T04:33:22.019293+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#꽃샘추위",
    "#성원고"
   ],
   "caption": "모의고사 포기함",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0065",
   "kind": "text",
   "author": "fitness.seongwon",
   "createdAt": "2025-09-17T00:50:00+09:00",
   "likes": 68,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2025-09-17T06:36:12.366129+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-09-17T15:13:26.120189+09:00",
     "body": "주말에 갈게"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#주말",
    "#봄"
   ],
   "body": "매장 신메뉴",
   "media": []
  },
  {
   "id": "LBP-0066",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2025-09-20T00:22:00+09:00",
   "likes": 55,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구"
   ],
   "body": "통계학 어렵다",
   "media": []
  },
  {
   "id": "LBP-0067",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2025-09-21T01:27:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2025-09-21T01:54:45.009147+09:00",
     "body": "나도 갈래"
    },
    {
     "author": "jiwon.moon",
     "createdAt": "2025-09-21T09:46:25.741963+09:00",
     "body": "3조 화이팅"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#재수",
    "#알바"
   ],
   "caption": "고3 때 자주 가던 성원동 카페",
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
   "id": "LBP-0068",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2025-09-21T19:05:00+09:00",
   "likes": 53,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2025-09-21T22:41:50.599465+09:00",
     "body": "주말에 갈게"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2025-09-22T01:38:06.058169+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#성원동카페"
   ],
   "caption": "손님 신메뉴",
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
   "id": "LBP-0069",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2025-09-22T01:01:00+09:00",
   "likes": 22,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
   ],
   "caption": "오늘 치킨마요",
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
   "id": "LBP-0070",
   "kind": "text",
   "author": "seongwon.cafe",
   "createdAt": "2025-09-24T01:52:00+09:00",
   "likes": 44,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-09-24T03:42:53.207346+09:00",
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#성원동카페"
   ],
   "body": "8시 신메뉴",
   "media": []
  },
  {
   "id": "LBP-0071",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2025-09-26T13:46:00+09:00",
   "likes": 35,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#성원고"
   ],
   "body": "고3 생일",
   "media": []
  },
  {
   "id": "LBP-0072",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2025-09-26T23:58:00+09:00",
   "likes": 98,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2025-09-27T00:06:51.510914+09:00",
     "body": "이번 주도?"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-09-27T07:09:23.521587+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄",
    "#성원동맛집"
   ],
   "caption": "매장 밤 11시까지",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0073",
   "kind": "text",
   "author": "seongwon.cafe",
   "createdAt": "2025-09-29T00:07:00+09:00",
   "likes": 84,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말",
    "#성원동카페",
    "#성원동맛집"
   ],
   "body": "주말 재료 준비",
   "media": []
  },
  {
   "id": "LBP-0074",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2025-09-29T18:15:00+09:00",
   "likes": 48,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-09-29T23:09:08.809034+09:00",
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페"
   ],
   "caption": "오늘 흐림",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0075",
   "kind": "text",
   "author": "yeseul.hong",
   "createdAt": "2025-09-29T22:51:00+09:00",
   "likes": 32,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구"
   ],
   "body": "통계학 끝났다",
   "media": []
  },
  {
   "id": "LBP-0076",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2025-09-30T01:44:00+09:00",
   "likes": 72,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2025-09-30T01:50:14.797897+09:00",
     "body": "그거 나도 봤어"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
   ],
   "body": "동창 입대",
   "media": []
  },
  {
   "id": "LBP-0077",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2025-10-02T23:36:00+09:00",
   "likes": 67,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2025-10-03T00:07:55.487371+09:00",
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "body": "축구 업데이트",
   "media": []
  },
  {
   "id": "LBP-0078",
   "kind": "text",
   "author": "cut.jaehyun",
   "createdAt": "2025-10-03T18:36:00+09:00",
   "likes": 47,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2025-10-03T20:17:34.453977+09:00",
     "body": "몇 시에?"
    },
    {
     "author": "lens.minho",
     "createdAt": "2025-10-03T21:31:51.472985+09:00",
     "body": "꽃샘추위"
    },
    {
     "author": "lens.minho",
     "createdAt": "2025-10-04T02:03:08.856889+09:00",
     "body": "5km 대단"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과"
   ],
   "body": "포스터 시작도 못 함",
   "media": []
  },
  {
   "id": "LBP-0079",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2025-10-03T23:27:00+09:00",
   "likes": 17,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#동네친구",
    "#재수"
   ],
   "caption": "미세먼지 패딩 다시 꺼냄",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0080",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2025-10-06T00:33:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2025-10-06T08:57:59.654059+09:00",
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구"
   ],
   "caption": "친구들이랑 독서실",
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
   "id": "LBP-0081",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2025-10-06T14:15:00+09:00",
   "likes": 112,
   "comments": [
    {
     "author": "music.drawer",
     "createdAt": "2025-10-07T00:04:39.163525+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#농구",
    "#게임"
   ],
   "caption": "비 러닝",
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
   "place": "성원동 풋살장"
  },
  {
   "id": "LBP-0082",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2025-10-06T23:33:00+09:00",
   "likes": 179,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#공지",
    "#청년센터"
   ],
   "caption": "캠퍼스 도서관 연장 운영",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0083",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2025-10-07T13:54:00+09:00",
   "likes": 351,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2025-10-07T14:01:25.542595+09:00",
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터",
    "#학생회"
   ],
   "caption": "청년센터 청년센터 프로그램",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0084",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2025-10-09T16:06:00+09:00",
   "likes": 34,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2025-10-10T06:11:06.447626+09:00",
     "body": "농구 다음에"
    },
    {
     "author": "donghyun.lim",
     "createdAt": "2025-10-10T06:24:28.431490+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#동네친구",
    "#꽃샘추위"
   ],
   "caption": "주말 주말 모임",
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
   "id": "LBP-0085",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2025-10-10T01:56:00+09:00",
   "likes": 51,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2025-10-10T05:12:08.285373+09:00",
     "body": "확인했어요"
    },
    {
     "author": "minseo.kim",
     "createdAt": "2025-10-10T08:02:37.527219+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
   ],
   "caption": "고3 때 자주 가던 성원천",
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
   "id": "LBP-0086",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2025-10-14T15:57:00+09:00",
   "likes": 17,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#알바",
    "#재수"
   ],
   "caption": "김치찌개 먹음",
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
   "id": "LBP-0087",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2025-10-15T00:12:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2025-10-15T02:01:45.969295+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#입대",
    "#재수"
   ],
   "body": "불고기덮밥 졸리다",
   "media": []
  },
  {
   "id": "LBP-0088",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2025-10-16T21:56:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-10-16T22:40:00.891378+09:00",
     "body": "주말에 갈게"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-10-17T02:36:13.535484+09:00",
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#동네친구"
   ],
   "body": "제육볶음 끝났다",
   "media": []
  },
  {
   "id": "LBP-0089",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2025-10-18T01:19:00+09:00",
   "likes": 19,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
   ],
   "caption": "동네 학원 앞",
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
   "id": "LBP-0090",
   "kind": "text",
   "author": "jun.choi",
   "createdAt": "2025-10-18T20:34:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2025-10-19T07:33:01.529062+09:00",
     "body": "최고"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
   ],
   "body": "학원 동창 모임",
   "media": []
  },
  {
   "id": "LBP-0091",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2025-10-20T22:43:00+09:00",
   "likes": 528,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2025-10-21T15:05:36.523148+09:00",
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#밈",
    "#축구"
   ],
   "body": "배드민턴 끝났다",
   "media": []
  },
  {
   "id": "LBP-0092",
   "kind": "text",
   "author": "lens.minho",
   "createdAt": "2025-10-21T00:22:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-10-21T05:07:02.706276+09:00",
     "body": "나도 갈래"
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
   "body": "밤샘 끝남",
   "media": []
  },
  {
   "id": "LBP-0093",
   "kind": "text",
   "author": "film.sua",
   "createdAt": "2025-10-21T01:21:00+09:00",
   "likes": 28,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-10-21T02:06:37.963986+09:00",
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#영상과"
   ],
   "body": "과제 내일 함",
   "media": []
  },
  {
   "id": "LBP-0094",
   "kind": "photo",
   "author": "run.daily",
   "createdAt": "2025-10-21T18:38:00+09:00",
   "likes": 56,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2025-10-22T00:35:28.307603+09:00",
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#농구",
    "#러닝"
   ],
   "caption": "플리 플리",
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
   "id": "LBP-0095",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2025-10-24T16:08:00+09:00",
   "likes": 196,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2025-10-24T17:28:54.185969+09:00",
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구"
   ],
   "body": "농구 풋살",
   "media": []
  },
  {
   "id": "LBP-0096",
   "kind": "text",
   "author": "laundry.seongwon",
   "createdAt": "2025-10-27T01:06:00+09:00",
   "likes": 33,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-10-27T03:27:38.027915+09:00",
     "body": "다음 주에 보자"
    },
    {
     "author": "lens.minho",
     "createdAt": "2025-10-27T16:04:26.850519+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#봄"
   ],
   "body": "오늘 주말 이벤트",
   "media": []
  },
  {
   "id": "LBP-0097",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2025-10-30T00:02:00+09:00",
   "likes": 20,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고"
   ],
   "caption": "성원동 분식에서 수시",
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
   "id": "LBP-0098",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2025-10-31T23:42:00+09:00",
   "likes": 40,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2025-11-01T05:29:57.098171+09:00",
     "body": "플리 저장"
    },
    {
     "author": "minseo.kim",
     "createdAt": "2025-11-01T19:25:34.576691+09:00",
     "body": "우와"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#꽃샘추위",
    "#성원고"
   ],
   "caption": "학원 2시 끝",
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
   "id": "LBP-0099",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2025-11-01T01:24:00+09:00",
   "likes": 327,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "body": "풋살 집중 안 됨",
   "media": []
  },
  {
   "id": "LBP-0100",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2025-11-02T16:56:00+09:00",
   "likes": 27,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2025-11-02T17:18:15.422009+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고"
   ],
   "caption": "동네 독서실",
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
   "likes": 10,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
   ],
   "body": "성원동 카페 끝남",
   "media": []
  },
  {
   "id": "LBP-0102",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2025-11-03T23:13:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-11-04T00:33:41.380189+09:00",
     "body": "부럽다"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2025-11-04T01:07:16.802604+09:00",
     "body": "이 밈 뭐임"
    },
    {
     "author": "music.drawer",
     "createdAt": "2025-11-04T10:00:32.421780+09:00",
     "body": "5km 대단"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#단편영화"
   ],
   "caption": "영상과 포스터",
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
   "id": "LBP-0103",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2025-11-04T01:01:00+09:00",
   "likes": 31,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2025-11-04T01:39:47.253982+09:00",
     "body": "확인했어요"
    },
    {
     "author": "seojin.yoon",
     "createdAt": "2025-11-04T15:46:34.430075+09:00",
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고"
   ],
   "caption": "주말 생일",
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
   "id": "LBP-0104",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2025-11-04T01:53:00+09:00",
   "likes": 73,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-11-04T09:04:44.236930+09:00",
     "body": "ㅇㅇ"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말"
   ],
   "caption": "매장 10시까지",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0105",
   "kind": "photo",
   "author": "biz.hanseo",
   "createdAt": "2025-11-07T23:48:00+09:00",
   "likes": 191,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2025-11-08T11:35:45.278941+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터",
    "#공지"
   ],
   "caption": "수강 신입생 환영회",
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
   "place": "한서대학교"
  },
  {
   "id": "LBP-0106",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2025-11-09T22:02:00+09:00",
   "likes": 32,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#입대",
    "#재수"
   ],
   "body": "학원 생일",
   "media": []
  },
  {
   "id": "LBP-0107",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2025-11-09T22:41:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2025-11-10T00:02:40.636422+09:00",
     "body": "회비 보냈어"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-11-10T11:29:47.626543+09:00",
     "body": "경기 봤어?"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2025-11-10T11:57:20.613051+09:00",
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#동네친구",
    "#알바"
   ],
   "caption": "수시 입대",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0108",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2025-11-10T01:11:00+09:00",
   "likes": 69,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말",
    "#성원동카페"
   ],
   "caption": "손님 재료 준비",
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
   "id": "LBP-0109",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2025-11-12T00:14:00+09:00",
   "likes": 50,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#성원고"
   ],
   "body": "김밥 끝났다",
   "media": []
  },
  {
   "id": "LBP-0110",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2025-11-12T10:51:00+09:00",
   "likes": 14,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#동네친구"
   ],
   "caption": "오늘 김치찌개",
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
   "id": "LBP-0111",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2025-11-12T17:32:00+09:00",
   "likes": 73,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2025-11-12T23:35:50.206484+09:00",
     "body": "커피 ㄱ?"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2025-11-13T02:37:23.971104+09:00",
     "body": "다음 주에 보자"
    },
    {
     "author": "game.loop",
     "createdAt": "2025-11-13T04:49:23.700523+09:00",
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임",
    "#플리"
   ],
   "body": "주말 게임 농구",
   "media": []
  },
  {
   "id": "LBP-0112",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2025-11-16T18:57:00+09:00",
   "likes": 26,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과"
   ],
   "caption": "상영회 장비 점검",
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
   "id": "LBP-0113",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2025-11-18T07:36:00+09:00",
   "likes": 37,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
   ],
   "caption": "입대 한 달 남음",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0114",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2025-11-19T01:37:00+09:00",
   "likes": 42,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2025-11-19T21:49:02.613706+09:00",
     "body": "헐"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#성원고"
   ],
   "caption": "동네 성원동 분식",
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
   "id": "LBP-0115",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2025-11-21T00:41:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2025-11-21T04:29:57.776271+09:00",
     "body": "몇 시까지 해요?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#꽃샘추위",
    "#입대"
   ],
   "body": "일요일 생일",
   "media": []
  },
  {
   "id": "LBP-0116",
   "kind": "photo",
   "author": "biz.hanseo",
   "createdAt": "2025-11-22T10:40:00+09:00",
   "likes": 211,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2025-11-22T18:36:11.918762+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#총학생회",
    "#청년센터"
   ],
   "caption": "학기 청년센터 프로그램",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0117",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2025-11-23T15:11:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-11-24T02:54:58.011893+09:00",
     "body": "경기 봤어?"
    },
    {
     "author": "frame.hana",
     "createdAt": "2025-11-24T03:59:01.589197+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#상영회",
    "#촬영"
   ],
   "caption": "편집 새벽 1시",
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
   "id": "LBP-0118",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2025-11-24T22:55:00+09:00",
   "likes": 28,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "caption": "친구들이랑 성원천",
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
   "id": "LBP-0119",
   "kind": "text",
   "author": "seongwon.cafe",
   "createdAt": "2025-11-25T07:26:00+09:00",
   "likes": 103,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2025-11-25T07:35:49.547274+09:00",
     "body": "3조 화이팅"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2025-11-25T07:51:21.100053+09:00",
     "body": "몇 시까지 해요?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄"
   ],
   "body": "매장 내일 함",
   "media": []
  },
  {
   "id": "LBP-0120",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2025-11-29T11:47:00+09:00",
   "likes": 49,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대"
   ],
   "caption": "수시 모의고사",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0121",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2025-12-01T01:28:00+09:00",
   "likes": 13,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-12-01T01:50:57.382487+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#입대"
   ],
   "caption": "카레라이스 먹음",
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
   "id": "LBP-0122",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2025-12-01T12:32:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2025-12-01T14:48:25.969642+09:00",
     "body": "나도 하고 싶다"
    },
    {
     "author": "jiwon.moon",
     "createdAt": "2025-12-02T00:09:34.679029+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#알바",
    "#꽃샘추위"
   ],
   "caption": "재수 졸리다",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0123",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2025-12-01T19:29:00+09:00",
   "likes": 355,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2025-12-02T08:55:05.113946+09:00",
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#축구",
    "#게임"
   ],
   "body": "책 제출함",
   "media": []
  },
  {
   "id": "LBP-0124",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2025-12-02T01:24:00+09:00",
   "likes": 87,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2025-12-02T03:43:51.027912+09:00",
     "body": "맛있겠다"
    },
    {
     "author": "music.drawer",
     "createdAt": "2025-12-02T16:07:49.840202+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#축구"
   ],
   "body": "게임 리뷰",
   "media": []
  },
  {
   "id": "LBP-0125",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2025-12-02T01:58:00+09:00",
   "likes": 509,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2025-12-02T07:03:21.458250+09:00",
     "body": "5km 대단"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2025-12-02T22:06:39.983989+09:00",
     "body": "헐"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#청년센터",
    "#공지"
   ],
   "caption": "학기 수강 정정",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0126",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2025-12-02T10:25:00+09:00",
   "likes": 13,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2025-12-02T16:45:14.007659+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#성원고",
    "#재수"
   ],
   "caption": "야자 끝나고 라면",
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
   "id": "LBP-0127",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2025-12-03T06:21:00+09:00",
   "likes": 46,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2025-12-03T12:19:25.015916+09:00",
     "body": "사진 예쁘다"
    },
    {
     "author": "meme.box",
     "createdAt": "2025-12-03T15:25:19.658175+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고"
   ],
   "caption": "주말 모의고사",
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
   "id": "LBP-0128",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2025-12-05T23:46:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2025-12-06T04:58:59.895411+09:00",
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게"
   ],
   "caption": "김치찌개 맛보기",
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
   "id": "LBP-0129",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2025-12-06T22:09:00+09:00",
   "likes": 45,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#공지",
    "#총학생회"
   ],
   "body": "장학 학사 일정",
   "media": []
  },
  {
   "id": "LBP-0130",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2025-12-07T15:44:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-12-07T17:26:28.159626+09:00",
     "body": "커피 ㄱ?"
    },
    {
     "author": "minjae.bae",
     "createdAt": "2025-12-08T13:32:25.984720+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#입대"
   ],
   "caption": "독서실에서 졸업",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0131",
   "kind": "text",
   "author": "daily.seongwon",
   "createdAt": "2025-12-11T22:13:00+09:00",
   "likes": 37,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2025-12-12T00:07:36.444715+09:00",
     "body": "역전 미쳤다"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-12-12T01:30:34.047687+09:00",
     "body": "굿"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-12-12T23:25:03.984926+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄"
   ],
   "body": "휴무 마감",
   "media": []
  },
  {
   "id": "LBP-0132",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2025-12-12T01:16:00+09:00",
   "likes": 9,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#재수"
   ],
   "caption": "오늘 우동",
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
   "id": "LBP-0133",
   "kind": "text",
   "author": "fitness.seongwon",
   "createdAt": "2025-12-12T11:09:00+09:00",
   "likes": 68,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-12-12T16:08:49.856021+09:00",
     "body": "발표 준비 화이팅"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#동네가게",
    "#성원동카페"
   ],
   "body": "오늘 휴무",
   "media": []
  },
  {
   "id": "LBP-0134",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2025-12-12T18:31:00+09:00",
   "likes": 8,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2025-12-13T00:34:28.805126+09:00",
     "body": "응원해"
    },
    {
     "author": "minjae.bae",
     "createdAt": "2025-12-13T02:33:01.248432+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-12-13T09:52:25.552717+09:00",
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "caption": "친구들이랑 성원동 카페",
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
   "id": "LBP-0135",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2025-12-12T22:20:00+09:00",
   "likes": 55,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2025-12-13T06:28:54.953649+09:00",
     "body": "이번 주도?"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2025-12-13T08:07:41.400829+09:00",
     "body": "커피 ㄱ?"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2025-12-13T16:43:59.690290+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#재수"
   ],
   "caption": "야자 끝나고 치킨마요",
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
   "id": "LBP-0136",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2025-12-13T23:37:00+09:00",
   "likes": 46,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-12-14T00:09:03.523789+09:00",
     "body": "5km 대단"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-12-14T02:45:32.234398+09:00",
     "body": "몇 시까지 해요?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄",
    "#성원동맛집"
   ],
   "caption": "꽃샘추위라서 커피 삼",
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
   "id": "LBP-0137",
   "kind": "photo",
   "author": "music.drawer",
   "createdAt": "2025-12-14T00:17:00+09:00",
   "likes": 234,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구"
   ],
   "caption": "오늘 경기 0-1",
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
   "id": "LBP-0138",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2025-12-15T12:37:00+09:00",
   "likes": 34,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2025-12-16T02:31:27.709537+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#상영회"
   ],
   "caption": "영상과 시나리오",
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
   "id": "LBP-0139",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2025-12-15T22:38:00+09:00",
   "likes": 32,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2025-12-15T23:31:36.688892+09:00",
     "body": "3조 화이팅"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2025-12-16T16:29:56.229430+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#알바",
    "#재수"
   ],
   "caption": "알바 밤 11시 끝",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0140",
   "kind": "text",
   "author": "film.sua",
   "createdAt": "2025-12-16T01:52:00+09:00",
   "likes": 34,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#편집",
    "#영상과"
   ],
   "body": "촬영지 내일 함",
   "media": []
  },
  {
   "id": "LBP-0141",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2025-12-21T07:59:00+09:00",
   "likes": 13,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-12-22T08:53:58.014138+09:00",
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#재수",
    "#알바"
   ],
   "caption": "고3 때 자주 가던 학원 앞",
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
   "id": "LBP-0142",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2025-12-21T17:07:00+09:00",
   "likes": 314,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#축구"
   ],
   "body": "플리 리뷰",
   "media": []
  },
  {
   "id": "LBP-0143",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2025-12-21T20:08:00+09:00",
   "likes": 295,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-12-22T03:35:27.095510+09:00",
     "body": "발표 준비 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#플리"
   ],
   "body": "미세먼지 테니스",
   "media": []
  },
  {
   "id": "LBP-0144",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2025-12-23T01:46:00+09:00",
   "likes": 51,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2025-12-23T06:10:48.997906+09:00",
     "body": "확인했어요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#알바",
    "#꽃샘추위"
   ],
   "body": "오늘 꽃샘추위",
   "media": []
  },
  {
   "id": "LBP-0145",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2025-12-24T15:32:00+09:00",
   "likes": 24,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#알바"
   ],
   "caption": "튀김 먹음",
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
   "id": "LBP-0146",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2025-12-24T22:47:00+09:00",
   "likes": 19,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#재수",
    "#동네친구"
   ],
   "caption": "오늘 짜장밥",
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
   "id": "LBP-0147",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2025-12-25T01:11:00+09:00",
   "likes": 161,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2025-12-25T10:14:15.589872+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학생회"
   ],
   "body": "3/18 학사 일정",
   "media": []
  },
  {
   "id": "LBP-0148",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2025-12-29T07:37:00+09:00",
   "likes": 50,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2025-12-29T09:17:58.791838+09:00",
     "body": "발표 준비 화이팅"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2025-12-29T13:31:10.527971+09:00",
     "body": "이 밈 뭐임"
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
   "caption": "상영회 편집",
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
   "id": "LBP-0149",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2025-12-30T21:36:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2025-12-30T23:30:24.132823+09:00",
     "body": "알바 끝나고 봐"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2025-12-31T06:03:15.426123+09:00",
     "body": "응원해"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2025-12-31T11:42:27.890745+09:00",
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#알바",
    "#입대"
   ],
   "caption": "흐림 커피 삼",
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
   "id": "LBP-0150",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2025-12-31T09:11:00+09:00",
   "likes": 62,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "모의고사 다 찍음",
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
   "id": "LBP-0151",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-01-01T16:30:00+09:00",
   "likes": 87,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2026-01-01T19:31:00.066664+09:00",
     "body": "3조 화이팅"
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
   "caption": "조명 영상제",
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
   "id": "LBP-0152",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-01-02T10:44:00+09:00",
   "likes": 271,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2026-01-02T16:28:53.289077+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝"
   ],
   "body": "밈 러닝",
   "media": []
  },
  {
   "id": "LBP-0153",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-01-02T18:42:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-01-03T04:08:43.228620+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "body": "동네 알바",
   "media": []
  },
  {
   "id": "LBP-0154",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-01-04T22:28:00+09:00",
   "likes": 26,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#재수",
    "#알바"
   ],
   "caption": "알바 12시 끝",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0155",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2026-01-04T23:20:00+09:00",
   "likes": 625,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#총학생회",
    "#학생회"
   ],
   "caption": "장학 봄 행사",
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
   "id": "LBP-0156",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-01-04T23:43:00+09:00",
   "likes": 65,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#축구",
    "#밈"
   ],
   "body": "오늘 0-1",
   "media": []
  },
  {
   "id": "LBP-0157",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-01-06T23:03:00+09:00",
   "likes": 31,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과",
    "#상영회"
   ],
   "caption": "포스터 단편",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0158",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2026-01-08T06:03:00+09:00",
   "likes": 160,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-01-08T10:03:17.619565+09:00",
     "body": "농구 다음에"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-01-08T17:27:43.960255+09:00",
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#총학생회",
    "#공지"
   ],
   "body": "신입생 총학생회 공지",
   "media": []
  },
  {
   "id": "LBP-0159",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2026-01-08T23:16:00+09:00",
   "likes": 25,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#성원고"
   ],
   "caption": "모의고사 선방함",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0160",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2026-01-09T21:58:00+09:00",
   "likes": 64,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-01-10T08:47:26.936257+09:00",
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
   ],
   "body": "동창 학원",
   "media": []
  },
  {
   "id": "LBP-0161",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-01-09T23:26:00+09:00",
   "likes": 58,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-01-09T23:54:28.755847+09:00",
     "body": "오늘 학식 뭐임?"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-01-10T08:10:06.415271+09:00",
     "body": "사진 잘 나왔다"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2026-01-10T11:13:43.562266+09:00",
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집"
   ],
   "caption": "주말 김밥",
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
   "likes": 21,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2026-01-10T02:10:12.328992+09:00",
     "body": "3조 화이팅"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#단편영화"
   ],
   "caption": "편집 8시",
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
   "id": "LBP-0163",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2026-01-10T01:25:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-01-10T03:39:12.619284+09:00",
     "body": "봄 오냐"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#동네친구"
   ],
   "caption": "고3 때 자주 가던 성원동 분식",
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
   "id": "LBP-0164",
   "kind": "photo",
   "author": "run.daily",
   "createdAt": "2026-01-10T10:07:00+09:00",
   "likes": 58,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2026-01-10T12:44:48.714715+09:00",
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구",
    "#러닝",
    "#플리"
   ],
   "caption": "새로 산 가방",
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
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0165",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-01-11T14:45:00+09:00",
   "likes": 61,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-01-12T07:38:36.102498+09:00",
     "body": "편집 잘 됐다"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2026-01-12T08:00:16.966707+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-01-12T10:44:33.755695+09:00",
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말"
   ],
   "caption": "성원동 골목 예약",
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
   "place": "성원동 풋살장"
  },
  {
   "id": "LBP-0166",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-01-11T22:03:00+09:00",
   "likes": 303,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임",
    "#밈",
    "#농구"
   ],
   "body": "책 밀림",
   "media": []
  },
  {
   "id": "LBP-0167",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2026-01-11T23:54:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-01-12T00:37:26.735515+09:00",
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#꽃샘추위",
    "#성원고"
   ],
   "body": "동창 동창 모임",
   "media": []
  },
  {
   "id": "LBP-0168",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2026-01-12T01:33:00+09:00",
   "likes": 21,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#재수",
    "#꽃샘추위"
   ],
   "caption": "학원 앞에서 입대",
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
   "id": "LBP-0169",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-01-12T22:40:00+09:00",
   "likes": 171,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#밈",
    "#게임"
   ],
   "body": "플리 미뤘음",
   "media": []
  },
  {
   "id": "LBP-0170",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2026-01-12T22:54:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "nayoung.ko",
     "createdAt": "2026-01-12T23:40:41.340942+09:00",
     "body": "구장 몇 시?"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-01-13T03:05:22.555471+09:00",
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#꽃샘추위",
    "#알바"
   ],
   "caption": "재수 집중 안 됨",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0171",
   "kind": "text",
   "author": "yuna.lee",
   "createdAt": "2026-01-15T01:29:00+09:00",
   "likes": 22,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#성원고"
   ],
   "body": "동창 야자",
   "media": []
  },
  {
   "id": "LBP-0172",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-01-15T14:05:00+09:00",
   "likes": 45,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-01-15T15:38:31.957315+09:00",
     "body": "커피 ㄱ?"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-01-15T16:35:22.148625+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄",
    "#동네가게"
   ],
   "caption": "성원동 카페 오픈",
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
   "id": "LBP-0173",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2026-01-16T00:06:00+09:00",
   "likes": 50,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-01-16T00:47:16.254561+09:00",
     "body": "발표 준비 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#러닝",
    "#게임"
   ],
   "body": "5km 최고",
   "media": []
  },
  {
   "id": "LBP-0174",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-01-17T22:06:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-01-18T01:06:07.405850+09:00",
     "body": "나도 갈래"
    },
    {
     "author": "siwoo.jung",
     "createdAt": "2026-01-18T04:50:18.766840+09:00",
     "body": "응원해"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#동네친구",
    "#재수"
   ],
   "caption": "입대 D-7",
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
   "id": "LBP-0175",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2026-01-17T23:35:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2026-01-18T01:22:03.271250+09:00",
     "body": "나는 아직"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-01-18T11:17:52.450094+09:00",
     "body": "ㅇㅇ"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2026-01-18T13:08:20.873943+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#성원고",
    "#입대"
   ],
   "caption": "성원천에서 동창 모임",
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
   "likes": 21,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-01-18T14:49:09.627103+09:00",
     "body": "나도 갈래"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#재수",
    "#꽃샘추위"
   ],
   "caption": "주말 수시",
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
   "id": "LBP-0177",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-01-20T19:01:00+09:00",
   "likes": 163,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#봄"
   ],
   "caption": "가게 오픈",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0178",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-01-21T01:21:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-01-21T07:16:16.873425+09:00",
     "body": "오늘 학식 뭐임?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#주말"
   ],
   "caption": "손님 주말 이벤트",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0179",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2026-01-21T19:35:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2026-01-21T22:02:09.049871+09:00",
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#알바"
   ],
   "body": "오늘 바람",
   "media": []
  },
  {
   "id": "LBP-0180",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2026-01-21T19:43:00+09:00",
   "likes": 31,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2026-01-22T17:00:49.724718+09:00",
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#입대"
   ],
   "body": "대학글쓰기 어렵다",
   "media": []
  },
  {
   "id": "LBP-0181",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-01-22T22:09:00+09:00",
   "likes": 224,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-01-22T23:23:22.436355+09:00",
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#축구",
    "#밈"
   ],
   "body": "플리 밈",
   "media": []
  },
  {
   "id": "LBP-0182",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-01-23T23:13:00+09:00",
   "likes": 8,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-01-23T23:27:37.843175+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#꽃샘추위"
   ],
   "body": "회계원리 망했다",
   "media": []
  },
  {
   "id": "LBP-0183",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-01-24T23:59:00+09:00",
   "likes": 105,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-01-25T01:10:25.427658+09:00",
     "body": "이번 주도?"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-01-25T04:39:17.080090+09:00",
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말"
   ],
   "caption": "새로 나온 불고기덮밥",
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
   "id": "LBP-0184",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-01-25T12:20:00+09:00",
   "likes": 243,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-01-26T00:48:07.556780+09:00",
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#러닝",
    "#축구"
   ],
   "body": "플리 제출함",
   "media": []
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
    "#재수"
   ],
   "body": "금요일 생일",
   "media": []
  },
  {
   "id": "LBP-0186",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-01-27T01:18:00+09:00",
   "likes": 46,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-01-27T07:25:20.597510+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "film.sua",
     "createdAt": "2026-01-27T08:03:38.158984+09:00",
     "body": "3조 화이팅"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-01-27T12:56:58.885443+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#영상과",
    "#단편영화"
   ],
   "caption": "스태프 포스터",
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
   "likes": 16,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-01-29T14:21:38.417906+09:00",
     "body": "나는 아직"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-01-29T19:45:23.114038+09:00",
     "body": "그거 나도 봤어"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#입대",
    "#성원고"
   ],
   "body": "고3 모의고사",
   "media": []
  },
  {
   "id": "LBP-0188",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2026-01-29T06:51:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-01-30T03:32:58.158851+09:00",
     "body": "최고"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
   ],
   "body": "동창 주말 모임",
   "media": []
  },
  {
   "id": "LBP-0189",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-01-29T19:25:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-01-29T20:20:49.786187+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고"
   ],
   "caption": "재수 배고프다",
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
   "id": "LBP-0190",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2026-01-30T00:57:00+09:00",
   "likes": 6,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#꽃샘추위",
    "#동네친구"
   ],
   "caption": "성원동 분식에서 학원",
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
   "id": "LBP-0191",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-02-01T00:48:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-02-01T17:32:33.287188+09:00",
     "body": "발표 준비 화이팅"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-02-01T18:32:53.943284+09:00",
     "body": "구장 몇 시?"
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
   "caption": "카메라 편집",
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
   "id": "LBP-0192",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-02-02T06:50:00+09:00",
   "likes": 28,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2026-02-02T09:13:59.388096+09:00",
     "body": "5km 대단"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-02-02T10:25:22.761563+09:00",
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기"
   ],
   "caption": "동아리 중간고사",
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
   "id": "LBP-0193",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2026-02-02T13:45:00+09:00",
   "likes": 30,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2026-02-02T16:56:47.209973+09:00",
     "body": "다음 주에 보자"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-02-02T17:39:07.935619+09:00",
     "body": "몇 시에?"
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
   "caption": "오늘 학식 카레라이스",
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
   "id": "LBP-0194",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-02-02T20:06:00+09:00",
   "likes": 31,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2026-02-03T00:29:43.684084+09:00",
     "body": "나도 하고 싶다"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2026-02-03T08:46:49.741416+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강"
   ],
   "caption": "친구들이랑 학생회관",
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
   "id": "LBP-0195",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2026-02-02T20:46:00+09:00",
   "likes": 28,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-02T22:59:47.364111+09:00",
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#꽃샘추위"
   ],
   "caption": "회계원리 끝나고 과방",
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
   "id": "LBP-0196",
   "kind": "text",
   "author": "bunsik.house",
   "createdAt": "2026-02-03T00:06:00+09:00",
   "likes": 67,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2026-02-03T03:15:14.947056+09:00",
     "body": "사진 예쁘다"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-02-03T18:18:32.755706+09:00",
     "body": "ㅇㅇ"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게"
   ],
   "body": "성원동 카페 재료 준비",
   "media": []
  },
  {
   "id": "LBP-0197",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-02-03T01:39:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-02-03T02:07:23.106714+09:00",
     "body": "상영회 기대"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-02-03T07:28:02.605377+09:00",
     "body": "오늘 날씨 진짜"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-03T07:29:47.346842+09:00",
     "body": "3조 화이팅"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#동네가게",
    "#봄"
   ],
   "caption": "주말 라면",
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
   "id": "LBP-0198",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-02-04T00:34:00+09:00",
   "likes": 62,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#단편영화"
   ],
   "caption": "밤샘 편집 끝남",
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
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-02-04T20:08:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2026-02-04T20:34:55.326624+09:00",
     "body": "회비 보냈어"
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
   "caption": "조명 과제",
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
   "id": "LBP-0200",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2026-02-06T22:44:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2026-02-07T01:07:49.408803+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대"
   ],
   "body": "오늘 경제학원론 집중 안 됨",
   "media": []
  },
  {
   "id": "LBP-0201",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2026-02-07T20:31:00+09:00",
   "likes": 69,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-02-07T23:23:41.602517+09:00",
     "body": "도서관 자리 있어?"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-02-08T12:54:27.118849+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터"
   ],
   "body": "학사 신입생 환영회",
   "media": []
  },
  {
   "id": "LBP-0202",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-02-08T13:01:00+09:00",
   "likes": 74,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#축구",
    "#밈"
   ],
   "body": "오늘 4-3",
   "media": []
  },
  {
   "id": "LBP-0203",
   "kind": "text",
   "author": "seongwon.cafe",
   "createdAt": "2026-02-08T21:50:00+09:00",
   "likes": 110,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-02-09T09:00:41.106298+09:00",
     "body": "역전 미쳤다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#주말"
   ],
   "body": "예약 신메뉴",
   "media": []
  },
  {
   "id": "LBP-0204",
   "kind": "text",
   "author": "yeseul.hong",
   "createdAt": "2026-02-08T23:06:00+09:00",
   "likes": 37,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-02-09T10:41:51.919650+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#꽃샘추위"
   ],
   "body": "오늘 미세먼지",
   "media": []
  },
  {
   "id": "LBP-0205",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2026-02-09T01:57:00+09:00",
   "likes": 54,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-02-09T05:36:39.224864+09:00",
     "body": "몇 시까지 해요?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#개강",
    "#수강신청"
   ],
   "body": "과방 미뤘음",
   "media": []
  },
  {
   "id": "LBP-0206",
   "kind": "text",
   "author": "seojin.yoon",
   "createdAt": "2026-02-09T22:19:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-02-10T10:56:31.111246+09:00",
     "body": "발표 준비 화이팅"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-02-10T21:39:02.313634+09:00",
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#재수",
    "#성원고"
   ],
   "body": "마케팅원론 집중 안 됨",
   "media": []
  },
  {
   "id": "LBP-0207",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-02-10T00:33:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2026-02-10T00:56:41.952740+09:00",
     "body": "사진 잘 나왔다"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-02-10T12:54:06.620956+09:00",
     "body": "몇 시까지 해요?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고"
   ],
   "caption": "성원동 카페에서 주말 모임",
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
   "id": "LBP-0208",
   "kind": "photo",
   "author": "biz.hanseo",
   "createdAt": "2026-02-10T12:49:00+09:00",
   "likes": 87,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-02-10T23:13:19.372119+09:00",
     "body": "포스터 예쁘다"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-11T08:27:25.460429+09:00",
     "body": "봄 오냐"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터",
    "#학생회"
   ],
   "caption": "3월 총학생회 공지",
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
   "place": "한서대학교"
  },
  {
   "id": "LBP-0209",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2026-02-10T22:38:00+09:00",
   "likes": 606,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-02-11T02:34:10.337757+09:00",
     "body": "화이팅"
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
   "body": "청년센터 신입생 환영회",
   "media": []
  },
  {
   "id": "LBP-0210",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2026-02-10T22:42:00+09:00",
   "likes": 12,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#성원고",
    "#동네친구"
   ],
   "body": "알바 12시 끝남",
   "media": []
  },
  {
   "id": "LBP-0211",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2026-02-11T14:30:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-02-12T04:22:16.928802+09:00",
     "body": "그거 나도 봤어"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#알바",
    "#재수"
   ],
   "body": "동네 야자",
   "media": []
  },
  {
   "id": "LBP-0212",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-02-11T23:19:00+09:00",
   "likes": 32,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#주말",
    "#동네가게"
   ],
   "caption": "새로 나온 카레라이스",
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
   "id": "LBP-0213",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2026-02-11T23:38:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-02-12T01:52:05.384615+09:00",
     "body": "수강신청 성공?"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2026-02-12T09:09:44.904693+09:00",
     "body": "회비 보냈어"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-02-12T22:17:29.598719+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#알바"
   ],
   "body": "알바 6시 제출함",
   "media": []
  },
  {
   "id": "LBP-0214",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-02-12T00:16:00+09:00",
   "likes": 134,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-02-12T03:09:41.631346+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#게임",
    "#플리"
   ],
   "body": "풋살 살았다",
   "media": []
  },
  {
   "id": "LBP-0215",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-02-12T14:52:00+09:00",
   "likes": 33,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#밈",
    "#플리"
   ],
   "caption": "게임 업데이트",
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
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0216",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-02-13T01:30:00+09:00",
   "likes": 281,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-02-13T01:56:09.000555+09:00",
     "body": "확인했어요"
    },
    {
     "author": "meme.box",
     "createdAt": "2026-02-13T02:52:49.454780+09:00",
     "body": "맛있겠다"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-02-13T05:09:08.025920+09:00",
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#플리"
   ],
   "body": "경기 연습",
   "media": []
  },
  {
   "id": "LBP-0217",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-02-13T23:23:00+09:00",
   "likes": 21,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식"
   ],
   "caption": "튀김 먹고 성원동 카페",
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
   "id": "LBP-0218",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2026-02-14T00:57:00+09:00",
   "likes": 13,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#입대",
    "#알바"
   ],
   "caption": "떡볶이 먹음",
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
   "id": "LBP-0219",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2026-02-14T07:53:00+09:00",
   "likes": 75,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-02-14T10:26:37.821496+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터",
    "#한서대",
    "#공지"
   ],
   "caption": "봄 청년센터 프로그램",
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
   "id": "LBP-0220",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2026-02-14T22:12:00+09:00",
   "likes": 31,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고",
    "#재수"
   ],
   "body": "동네 학원",
   "media": []
  },
  {
   "id": "LBP-0221",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2026-02-14T22:15:00+09:00",
   "likes": 11,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#성원고"
   ],
   "body": "동창 모의고사",
   "media": []
  },
  {
   "id": "LBP-0222",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-02-15T18:15:00+09:00",
   "likes": 572,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-02-16T12:42:19.549722+09:00",
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "body": "농구 경기",
   "media": []
  },
  {
   "id": "LBP-0223",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2026-02-15T20:07:00+09:00",
   "likes": 41,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식",
    "#개강",
    "#꽃샘추위"
   ],
   "body": "시험 OT",
   "media": []
  },
  {
   "id": "LBP-0224",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2026-02-15T22:58:00+09:00",
   "likes": 13,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-02-16T01:37:11.175130+09:00",
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고"
   ],
   "caption": "돈까스 먹음",
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
   "id": "LBP-0225",
   "kind": "text",
   "author": "seojin.yoon",
   "createdAt": "2026-02-15T23:51:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-02-16T06:38:00.829477+09:00",
     "body": "오늘 학식 뭐임?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#꽃샘추위"
   ],
   "body": "입대 D-3",
   "media": []
  },
  {
   "id": "LBP-0226",
   "kind": "text",
   "author": "haneul.park",
   "createdAt": "2026-02-16T00:50:00+09:00",
   "likes": 25,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#한서대"
   ],
   "body": "과방 거의 다 함",
   "media": []
  },
  {
   "id": "LBP-0227",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2026-02-16T01:35:00+09:00",
   "likes": 28,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2026-02-16T12:37:52.423101+09:00",
     "body": "확인했어요"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#꽃샘추위",
    "#성원고"
   ],
   "body": "김치찌개 살았다",
   "media": []
  },
  {
   "id": "LBP-0228",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-02-16T13:40:00+09:00",
   "likes": 250,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-02-17T05:47:15.516320+09:00",
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "body": "밈 플리",
   "media": []
  },
  {
   "id": "LBP-0229",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-02-17T10:10:00+09:00",
   "likes": 51,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영26",
    "#새내기",
    "#꽃샘추위"
   ],
   "caption": "1교시 끝나고 중앙도서관",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0230",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-02-18T07:14:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-02-18T13:35:05.536782+09:00",
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과",
    "#촬영"
   ],
   "caption": "단편 시나리오",
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
   "id": "LBP-0231",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2026-02-18T08:21:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-02-18T12:20:06.194901+09:00",
     "body": "최고"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-19T01:28:51.799386+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#경영26",
    "#수강신청"
   ],
   "body": "오늘 회계원리 망했다",
   "media": []
  },
  {
   "id": "LBP-0232",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-02-19T00:48:00+09:00",
   "likes": 91,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "body": "농구 러닝",
   "media": []
  },
  {
   "id": "LBP-0233",
   "kind": "text",
   "author": "cut.jaehyun",
   "createdAt": "2026-02-19T10:35:00+09:00",
   "likes": 40,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-02-19T14:39:11.999484+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과"
   ],
   "body": "장비 포스터",
   "media": []
  },
  {
   "id": "LBP-0234",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-02-20T10:54:00+09:00",
   "likes": 31,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄",
    "#성원동맛집"
   ],
   "caption": "오늘 치킨마요 재밌다",
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
   "id": "LBP-0235",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-02-20T20:10:00+09:00",
   "likes": 53,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-02-20T22:48:39.844280+09:00",
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#동네가게",
    "#봄"
   ],
   "caption": "주말 주말 이벤트",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0236",
   "kind": "text",
   "author": "seongwon.cafe",
   "createdAt": "2026-02-20T22:39:00+09:00",
   "likes": 101,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집"
   ],
   "body": "꽃샘추위 어렵다",
   "media": []
  },
  {
   "id": "LBP-0237",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2026-02-20T23:58:00+09:00",
   "likes": 21,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#꽃샘추위",
    "#새내기"
   ],
   "body": "내일 오전 수업",
   "media": []
  },
  {
   "id": "LBP-0238",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-02-21T00:42:00+09:00",
   "likes": 193,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2026-02-21T17:52:58.200176+09:00",
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#총학생회"
   ],
   "body": "학생회 총학생회 공지",
   "media": []
  },
  {
   "id": "LBP-0239",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-02-21T01:26:00+09:00",
   "likes": 56,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
   ],
   "caption": "고3 때 자주 가던 성원동 골목",
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
   "place": "성원동 풋살장"
  },
  {
   "id": "LBP-0240",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-02-21T01:57:00+09:00",
   "likes": 27,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2026-02-21T10:41:47.700049+09:00",
     "body": "오늘 날씨 진짜"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강",
    "#과제"
   ],
   "body": "동아리 발표",
   "media": []
  },
  {
   "id": "LBP-0241",
   "kind": "text",
   "author": "daily.seongwon",
   "createdAt": "2026-02-21T22:59:00+09:00",
   "likes": 145,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-02-22T00:51:34.894629+09:00",
     "body": "도서관 자리 있어?"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-02-22T05:23:01.944256+09:00",
     "body": "나도 하고 싶다"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-02-22T09:02:38.943362+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게"
   ],
   "body": "예약 손님맞이",
   "media": []
  },
  {
   "id": "LBP-0242",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2026-02-22T01:12:00+09:00",
   "likes": 81,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구"
   ],
   "body": "러닝 플리",
   "media": []
  },
  {
   "id": "LBP-0243",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2026-02-23T01:19:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-02-23T21:17:50.923862+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
   ],
   "caption": "야자 끝나고 제육볶음",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0244",
   "kind": "text",
   "author": "jun.choi",
   "createdAt": "2026-02-23T06:52:00+09:00",
   "likes": 12,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대"
   ],
   "body": "과방 끝남",
   "media": []
  },
  {
   "id": "LBP-0245",
   "kind": "photo",
   "author": "game.loop",
   "createdAt": "2026-02-23T23:32:00+09:00",
   "likes": 354,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2026-02-24T04:20:25.824305+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈"
   ],
   "caption": "주말 축구",
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
   "id": "LBP-0246",
   "kind": "text",
   "author": "laundry.seongwon",
   "createdAt": "2026-02-24T22:11:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-02-24T22:14:34.925263+09:00",
     "body": "이번 주도?"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-02-24T22:26:05.463060+09:00",
     "body": "발표 준비 화이팅"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-02-25T19:18:57.317160+09:00",
     "body": "꽃샘추위"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#성원동맛집"
   ],
   "body": "예약 주말 이벤트",
   "media": []
  },
  {
   "id": "LBP-0247",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-02-24T22:30:00+09:00",
   "likes": 40,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집"
   ],
   "caption": "촬영 편집",
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
   "id": "LBP-0248",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2026-02-25T14:26:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-02-26T08:00:08.883550+09:00",
     "body": "농구 다음에"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식",
    "#꽃샘추위"
   ],
   "body": "3월 개강",
   "media": []
  },
  {
   "id": "LBP-0249",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2026-02-25T15:50:00+09:00",
   "likes": 33,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제"
   ],
   "caption": "성원동 카페에서 과제",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0250",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-02-25T19:03:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-02-25T19:36:26.300864+09:00",
     "body": "나도 하고 싶다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#상영회"
   ],
   "caption": "경영원론 과제 단편",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0251",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2026-02-25T19:33:00+09:00",
   "likes": 203,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2026-02-25T20:35:33.656039+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2026-02-25T22:02:48.993852+09:00",
     "body": "좋다"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-02-26T06:17:13.028356+09:00",
     "body": "확인했어요"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학생회",
    "#공지",
    "#한서대"
   ],
   "caption": "3월 수강 정정",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0252",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-02-26T17:50:00+09:00",
   "likes": 142,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-02-27T06:05:34.252064+09:00",
     "body": "봄 오냐"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구"
   ],
   "body": "러닝 연습",
   "media": []
  },
  {
   "id": "LBP-0253",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-02-26T23:21:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-02-27T00:08:31.012330+09:00",
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#영상과"
   ],
   "caption": "촬영 스태프 모임",
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
   "id": "LBP-0254",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-02-27T18:52:00+09:00",
   "likes": 116,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터"
   ],
   "body": "청년센터 과제 마감",
   "media": []
  },
  {
   "id": "LBP-0255",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-02-28T15:59:00+09:00",
   "likes": 18,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "과방 오늘 분위기",
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
   "id": "LBP-0256",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2026-03-01T14:10:00+09:00",
   "likes": 34,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-01T16:46:53.159035+09:00",
     "body": "부럽다"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-02T02:52:53.853678+09:00",
     "body": "도서관 자리 있어?"
    },
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-02T10:04:04.570610+09:00",
     "body": "ㅇㅇ"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고",
    "#입대"
   ],
   "body": "친구 졸업",
   "media": []
  },
  {
   "id": "LBP-0257",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2026-03-01T14:34:00+09:00",
   "likes": 47,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "body": "오늘 1-2",
   "media": []
  },
  {
   "id": "LBP-0258",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-03-01T15:40:00+09:00",
   "likes": 95,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-01T15:55:12.152861+09:00",
     "body": "꽃샘추위"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-02T01:55:15.390972+09:00",
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#성원동카페"
   ],
   "caption": "성원동 분식 밤 11시까지",
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
    "#개강",
    "#꽃샘추위",
    "#경영26"
   ],
   "caption": "OT 수강 정정",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0260",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-03-01T20:05:00+09:00",
   "likes": 132,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "body": "농구 리뷰",
   "media": []
  },
  {
   "id": "LBP-0261",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2026-03-02T06:54:00+09:00",
   "likes": 58,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-03-02T08:18:03.091385+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강"
   ],
   "body": "꽃샘추위 졸리다",
   "media": []
  },
  {
   "id": "LBP-0262",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2026-03-02T16:11:00+09:00",
   "likes": 41,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제"
   ],
   "caption": "과제하다 새벽 1시",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0263",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-03-02T20:03:00+09:00",
   "likes": 84,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-03T01:56:27.647224+09:00",
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구"
   ],
   "body": "오늘 2-1",
   "media": []
  },
  {
   "id": "LBP-0264",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-03-02T23:44:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-03-03T01:05:45.388109+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청",
    "#꽃샘추위"
   ],
   "caption": "새내기 OT 인증",
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
   "id": "LBP-0265",
   "kind": "text",
   "author": "laundry.seongwon",
   "createdAt": "2026-03-03T01:22:00+09:00",
   "likes": 22,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집"
   ],
   "body": "불고기덮밥 내일 함",
   "media": []
  },
  {
   "id": "LBP-0266",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2026-03-03T15:03:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2026-03-03T17:28:10.068182+09:00",
     "body": "확인했어요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식"
   ],
   "body": "새내기 개강총회",
   "media": []
  },
  {
   "id": "LBP-0267",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2026-03-03T20:13:00+09:00",
   "likes": 6,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-03T23:47:33.790900+09:00",
     "body": "알바 끝나고 봐"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-04T04:09:03.484529+09:00",
     "body": "편집 잘 됐다"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-04T08:19:23.368559+09:00",
     "body": "몇 시까지 해요?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#수강신청"
   ],
   "caption": "도서관 새벽 2시 야경",
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
   "id": "LBP-0268",
   "kind": "text",
   "author": "yuna.lee",
   "createdAt": "2026-03-03T23:04:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-04T04:07:29.245019+09:00",
     "body": "5km 대단"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청",
    "#개강",
    "#꽃샘추위"
   ],
   "body": "학식 돈까스 어렵다",
   "media": []
  },
  {
   "id": "LBP-0269",
   "kind": "text",
   "author": "jun.choi",
   "createdAt": "2026-03-04T01:58:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-04T06:22:42.903449+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제"
   ],
   "body": "과제 끝남",
   "media": []
  },
  {
   "id": "LBP-0270",
   "kind": "text",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-04T20:38:00+09:00",
   "likes": 45,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄",
    "#성원동맛집",
    "#동네가게"
   ],
   "body": "10시 예약",
   "media": []
  },
  {
   "id": "LBP-0271",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-04T22:55:00+09:00",
   "likes": 26,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집"
   ],
   "caption": "필름 촬영",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0272",
   "kind": "text",
   "author": "seojin.yoon",
   "createdAt": "2026-03-05T01:13:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-05T22:53:17.658584+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대"
   ],
   "body": "토요일 생일",
   "media": []
  },
  {
   "id": "LBP-0273",
   "kind": "text",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-05T10:36:00+09:00",
   "likes": 55,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-05T11:24:15.562478+09:00",
     "body": "주말에 갈게"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-05T12:19:00.902061+09:00",
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄",
    "#동네가게",
    "#성원동맛집"
   ],
   "body": "손님 예약",
   "media": []
  },
  {
   "id": "LBP-0274",
   "kind": "photo",
   "author": "game.loop",
   "createdAt": "2026-03-05T21:55:00+09:00",
   "likes": 460,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-03-06T07:47:16.888884+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리"
   ],
   "caption": "농구 업데이트",
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
   "place": "성원동 풋살장"
  },
  {
   "id": "LBP-0275",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-03-05T22:04:00+09:00",
   "likes": 67,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-06T00:37:33.201558+09:00",
     "body": "몇 시까지 해요?"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-06T03:23:56.271919+09:00",
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말",
    "#봄"
   ],
   "caption": "오늘 짜장밥 망했다",
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
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2026-03-05T22:49:00+09:00",
   "likes": 14,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#꽃샘추위",
    "#입대"
   ],
   "caption": "학원 앞에서 졸업",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0277",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-03-05T22:55:00+09:00",
   "likes": 80,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#촬영",
    "#단편영화"
   ],
   "caption": "촬영지에서 편집",
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
   "id": "LBP-0278",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2026-03-05T23:35:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-05T23:54:48.411529+09:00",
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#꽃샘추위"
   ],
   "caption": "성원동 분식에서 졸업",
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
   "id": "LBP-0279",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-06T00:37:00+09:00",
   "likes": 659,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-03-06T06:08:36.333629+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-06T14:41:11.532965+09:00",
     "body": "몇 시까지 해요?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈"
   ],
   "body": "플리 연습",
   "media": []
  },
  {
   "id": "LBP-0280",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-03-06T00:54:00+09:00",
   "likes": 32,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#상영회",
    "#단편영화"
   ],
   "caption": "조명 편집",
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
   "id": "LBP-0281",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2026-03-06T22:48:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-07T04:42:06.073089+09:00",
     "body": "헐"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#입대"
   ],
   "body": "독서실 시작도 못 함",
   "media": []
  },
  {
   "id": "LBP-0282",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-03-06T23:42:00+09:00",
   "likes": 76,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-07T00:44:07.493523+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#농구",
    "#플리"
   ],
   "body": "러닝 경기",
   "media": []
  },
  {
   "id": "LBP-0283",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2026-03-07T01:50:00+09:00",
   "likes": 456,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-07T16:27:03.600206+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#청년센터"
   ],
   "body": "한서대학교 도서관 연장 운영",
   "media": []
  },
  {
   "id": "LBP-0284",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-03-07T13:21:00+09:00",
   "likes": 50,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-07T14:57:33.896362+09:00",
     "body": "편집 잘 됐다"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-08T07:46:25.661174+09:00",
     "body": "발표 준비 화이팅"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#입대"
   ],
   "caption": "성원동 카페에서 알바",
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
   "id": "LBP-0285",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2026-03-07T22:01:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-03-08T02:55:29.066864+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#꽃샘추위"
   ],
   "caption": "학원 밤 11시 끝",
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
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-07T23:00:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-08T10:35:01.812235+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#알바",
    "#꽃샘추위"
   ],
   "caption": "알바 10시 끝",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0287",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2026-03-07T23:06:00+09:00",
   "likes": 157,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#공지"
   ],
   "body": "캠퍼스 신입생 환영회",
   "media": []
  },
  {
   "id": "LBP-0288",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2026-03-08T00:02:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-03-08T01:46:08.402338+09:00",
     "body": "포스터 예쁘다"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-08T05:28:43.418624+09:00",
     "body": "맛있겠다"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-08T06:41:04.454249+09:00",
     "body": "5km 대단"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청"
   ],
   "caption": "1교시 끝나고 과방",
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
   "id": "LBP-0289",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2026-03-08T00:25:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-08T15:22:17.768810+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#학식",
    "#수강신청"
   ],
   "body": "동아리 과제",
   "media": []
  },
  {
   "id": "LBP-0290",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2026-03-08T00:29:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-08T07:19:38.495802+09:00",
     "body": "이거 어디야?"
    },
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-08T07:40:34.125540+09:00",
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "모의고사 망함",
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
   "id": "LBP-0291",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-08T09:06:00+09:00",
   "likes": 553,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2026-03-08T10:44:17.709472+09:00",
     "body": "오늘 학식 뭐임?"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-08T19:01:02.018064+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈"
   ],
   "body": "운동화 하는 중",
   "media": []
  },
  {
   "id": "LBP-0292",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2026-03-08T09:28:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-08T13:04:22.974248+09:00",
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대"
   ],
   "caption": "비 패딩 다시 꺼냄",
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
   "id": "LBP-0293",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-08T17:13:00+09:00",
   "likes": 48,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집"
   ],
   "caption": "촬영지 스카우트",
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
   "id": "LBP-0294",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-03-08T18:32:00+09:00",
   "likes": 95,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구"
   ],
   "body": "풋살 끝났다",
   "media": []
  },
  {
   "id": "LBP-0295",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-03-08T22:17:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-08T22:40:11.210386+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식"
   ],
   "body": "오늘 경영원론 살았다",
   "media": []
  },
  {
   "id": "LBP-0296",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2026-03-08T22:25:00+09:00",
   "likes": 410,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-03-09T02:32:28.428535+09:00",
     "body": "ㅇㅇ"
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
   "body": "봄 행사 안내",
   "media": []
  },
  {
   "id": "LBP-0297",
   "kind": "text",
   "author": "seojin.yoon",
   "createdAt": "2026-03-08T23:22:00+09:00",
   "likes": 5,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-09T01:14:40.189218+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고",
    "#알바"
   ],
   "body": "동네 생일",
   "media": []
  },
  {
   "id": "LBP-0298",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2026-03-09T01:06:00+09:00",
   "likes": 47,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강",
    "#과제"
   ],
   "body": "꽃샘추위 집중 안 됨",
   "media": []
  },
  {
   "id": "LBP-0299",
   "kind": "text",
   "author": "frame.hana",
   "createdAt": "2026-03-09T01:06:00+09:00",
   "likes": 12,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#단편영화"
   ],
   "body": "상영 스태프 모임",
   "media": []
  },
  {
   "id": "LBP-0300",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-03-09T01:43:00+09:00",
   "likes": 145,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임",
    "#러닝",
    "#축구"
   ],
   "body": "농구 어렵다",
   "media": []
  },
  {
   "id": "LBP-0301",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-03-09T14:02:00+09:00",
   "likes": 104,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-03-09T15:27:40.705615+09:00",
     "body": "5km 대단"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#게임"
   ],
   "caption": "축구 연습",
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
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0302",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-09T14:18:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-09T22:16:52.070613+09:00",
     "body": "오늘 학식 뭐임?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집"
   ],
   "caption": "성원동 분식 손님맞이",
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
   "id": "LBP-0303",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-09T19:55:00+09:00",
   "likes": 56,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-09T21:50:54.060412+09:00",
     "body": "맛있겠다"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2026-03-10T11:35:57.381742+09:00",
     "body": "봄 오냐"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게"
   ],
   "caption": "매장 소식",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0304",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2026-03-09T22:25:00+09:00",
   "likes": 24,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식"
   ],
   "body": "3교시 경영원론 집중 안 됨",
   "media": []
  },
  {
   "id": "LBP-0305",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-03-10T08:52:00+09:00",
   "likes": 40,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-03-11T01:19:49.619334+09:00",
     "body": "헐"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화"
   ],
   "caption": "조명 장비 점검",
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
   "id": "LBP-0306",
   "kind": "text",
   "author": "yuna.lee",
   "createdAt": "2026-03-10T10:07:00+09:00",
   "likes": 44,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-11T05:19:57.152285+09:00",
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#한서대"
   ],
   "body": "새내기 발표",
   "media": []
  },
  {
   "id": "LBP-0307",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-03-10T18:52:00+09:00",
   "likes": 76,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-03-10T21:53:57.046305+09:00",
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구"
   ],
   "body": "흐림 테니스",
   "media": []
  },
  {
   "id": "LBP-0308",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-03-10T20:10:00+09:00",
   "likes": 17,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식",
    "#꽃샘추위"
   ],
   "caption": "경영원론 끝나고 과방",
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
   "id": "LBP-0309",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2026-03-10T21:04:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-11T09:31:28.893277+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#입대"
   ],
   "body": "경영원론 망했다",
   "media": []
  },
  {
   "id": "LBP-0310",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-03-10T22:20:00+09:00",
   "likes": 62,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말",
    "#동네가게",
    "#성원동맛집"
   ],
   "caption": "바람라서 창밖만 봄",
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
   "id": "LBP-0311",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-10T23:59:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-11T15:26:05.753762+09:00",
     "body": "농구 다음에"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "수시 주말 모임",
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
   "id": "LBP-0312",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2026-03-11T00:03:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-11T03:21:07.514602+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
   ],
   "caption": "햇살 실내에만 있음",
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
   "id": "LBP-0313",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-03-11T00:22:00+09:00",
   "likes": 31,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게"
   ],
   "caption": "치킨마요 준비 완료",
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
   "id": "LBP-0314",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-03-11T00:50:00+09:00",
   "likes": 30,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-11T07:36:38.548515+09:00",
     "body": "구장 몇 시?"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-11T19:44:42.049384+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대"
   ],
   "caption": "OT 축제",
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
   "id": "LBP-0315",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-03-11T01:08:00+09:00",
   "likes": 92,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임"
   ],
   "body": "가방 미뤘음",
   "media": []
  },
  {
   "id": "LBP-0316",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-03-11T17:50:00+09:00",
   "likes": 116,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2026-03-12T12:17:47.639625+09:00",
     "body": "나도 하고 싶다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#총학생회",
    "#학생회"
   ],
   "body": "3/18 총학생회 공지",
   "media": []
  },
  {
   "id": "LBP-0317",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-03-11T19:16:00+09:00",
   "likes": 23,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#성원고",
    "#꽃샘추위"
   ],
   "caption": "오늘 카레라이스",
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
   "id": "LBP-0318",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2026-03-11T20:52:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-03-11T21:10:47.072167+09:00",
     "body": "어디서 찍었어?"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-11T21:46:47.015477+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영26",
    "#개강"
   ],
   "body": "수강신청 끝남",
   "media": []
  },
  {
   "id": "LBP-0319",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2026-03-11T21:13:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-03-12T02:32:19.191587+09:00",
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#꽃샘추위",
    "#입대"
   ],
   "body": "성원동 골목 미뤘음",
   "media": []
  },
  {
   "id": "LBP-0320",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2026-03-11T21:26:00+09:00",
   "likes": 51,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "body": "MT 동아리",
   "media": []
  },
  {
   "id": "LBP-0321",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2026-03-11T22:26:00+09:00",
   "likes": 98,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-11T23:06:08.095945+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#총학생회"
   ],
   "body": "캠퍼스 수강 정정",
   "media": []
  },
  {
   "id": "LBP-0322",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-03-11T22:57:00+09:00",
   "likes": 81,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#영상과"
   ],
   "caption": "촬영 포스터",
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
   "id": "LBP-0323",
   "kind": "text",
   "author": "haneul.park",
   "createdAt": "2026-03-12T00:21:00+09:00",
   "likes": 31,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-12T19:22:02.151577+09:00",
     "body": "우와"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#새내기",
    "#개강"
   ],
   "body": "바람 살았다",
   "media": []
  },
  {
   "id": "LBP-0324",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-03-12T00:34:00+09:00",
   "likes": 105,
   "comments": [
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-12T01:00:13.202827+09:00",
     "body": "ㅇㅇ"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말"
   ],
   "caption": "새로 나온 튀김",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0325",
   "kind": "text",
   "author": "cut.jaehyun",
   "createdAt": "2026-03-12T01:11:00+09:00",
   "likes": 33,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#촬영",
    "#영상과"
   ],
   "body": "상영 편집",
   "media": []
  },
  {
   "id": "LBP-0326",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2026-03-12T01:14:00+09:00",
   "likes": 46,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-12T01:21:49.490174+09:00",
     "body": "응원해"
    },
    {
     "author": "jiwon.moon",
     "createdAt": "2026-03-12T01:27:22.265445+09:00",
     "body": "플리 저장"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-12T14:12:52.692252+09:00",
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#새내기",
    "#과제"
   ],
   "body": "과방 시작도 못 함",
   "media": []
  },
  {
   "id": "LBP-0327",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-03-12T01:18:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-12T02:22:22.404671+09:00",
     "body": "오늘 날씨 진짜"
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
   "caption": "스태프 단편",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0328",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2026-03-12T01:54:00+09:00",
   "likes": 33,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#성원고"
   ],
   "caption": "비 산책함",
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
   "id": "LBP-0329",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-03-12T18:17:00+09:00",
   "likes": 75,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-03-13T11:55:48.409912+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#농구",
    "#플리"
   ],
   "body": "책 끝남",
   "media": []
  },
  {
   "id": "LBP-0330",
   "kind": "text",
   "author": "bunsik.house",
   "createdAt": "2026-03-12T19:19:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-12T21:44:43.326598+09:00",
     "body": "커피 ㄱ?"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-13T17:12:06.230246+09:00",
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게"
   ],
   "body": "성원동 카페 할인",
   "media": []
  },
  {
   "id": "LBP-0331",
   "kind": "text",
   "author": "seojin.yoon",
   "createdAt": "2026-03-12T20:37:00+09:00",
   "likes": 11,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2026-03-12T22:50:11.342879+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-13T08:05:36.190945+09:00",
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "body": "경제학원론 배고프다",
   "media": []
  },
  {
   "id": "LBP-0332",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2026-03-12T21:22:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-13T01:09:10.861240+09:00",
     "body": "그거 나도 봤어"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-13T01:31:30.178415+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#꽃샘추위",
    "#경영26"
   ],
   "body": "내일 1교시",
   "media": []
  },
  {
   "id": "LBP-0333",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-03-12T22:01:00+09:00",
   "likes": 10,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2026-03-13T00:00:09.488246+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제",
    "#새내기",
    "#꽃샘추위"
   ],
   "caption": "도서관 새벽 1시 야경",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0334",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2026-03-12T23:33:00+09:00",
   "likes": 50,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청"
   ],
   "caption": "대학글쓰기 끝나고 중앙도서관",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0335",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2026-03-12T23:45:00+09:00",
   "likes": 27,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-12T23:53:14.471284+09:00",
     "body": "응원해"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-13T08:40:44.237741+09:00",
     "body": "최고"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강",
    "#새내기",
    "#과제"
   ],
   "caption": "1교시 끝나고 학생회관",
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
   "id": "LBP-0336",
   "kind": "photo",
   "author": "game.loop",
   "createdAt": "2026-03-13T00:08:00+09:00",
   "likes": 252,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2026-03-13T00:40:35.026810+09:00",
     "body": "최고"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-13T04:56:35.473294+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#플리"
   ],
   "caption": "5km 플리",
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
   "place": "성원동 풋살장"
  },
  {
   "id": "LBP-0337",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2026-03-13T00:29:00+09:00",
   "likes": 22,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#재수"
   ],
   "caption": "수시 졸업",
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
   "id": "LBP-0338",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-13T00:32:00+09:00",
   "likes": 100,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-13T06:22:30.954227+09:00",
     "body": "나도 하고 싶다"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-13T12:01:18.356662+09:00",
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#주말",
    "#봄"
   ],
   "caption": "오늘의 불고기덮밥",
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
   "id": "LBP-0339",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2026-03-13T01:02:00+09:00",
   "likes": 156,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#총학생회",
    "#청년센터"
   ],
   "caption": "청년센터 총학생회 공지",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0340",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-03-13T01:06:00+09:00",
   "likes": 249,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-13T03:53:04.880509+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#러닝"
   ],
   "body": "5km 단축",
   "media": []
  },
  {
   "id": "LBP-0341",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-03-13T01:41:00+09:00",
   "likes": 98,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-03-13T03:35:56.358813+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#플리",
    "#게임"
   ],
   "body": "축구 축구",
   "media": []
  },
  {
   "id": "LBP-0342",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-03-13T01:51:00+09:00",
   "likes": 27,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#경영26",
    "#과제"
   ],
   "caption": "잔디밭에서 과제",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0343",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2026-03-13T17:00:00+09:00",
   "likes": 110,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-14T00:50:11.346099+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝"
   ],
   "body": "플리 축구",
   "media": []
  },
  {
   "id": "LBP-0344",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-03-13T18:15:00+09:00",
   "likes": 11,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄",
    "#성원동맛집"
   ],
   "caption": "흐림라서 커피 삼",
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
   "id": "LBP-0345",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-13T20:17:00+09:00",
   "likes": 21,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#재수",
    "#성원고"
   ],
   "body": "알바 12시 내일 함",
   "media": []
  },
  {
   "id": "LBP-0346",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-03-13T22:19:00+09:00",
   "likes": 66,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2026-03-13T22:42:41.469173+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-14T01:01:14.837804+09:00",
     "body": "농구 다음에"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과",
    "#단편영화",
    "#편집"
   ],
   "caption": "경영원론 과제 장비 점검",
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
   "id": "LBP-0347",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2026-03-13T23:30:00+09:00",
   "likes": 529,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-03-13T23:38:30.217345+09:00",
     "body": "사진 예쁘다"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2026-03-14T11:53:16.609036+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학생회"
   ],
   "caption": "수강 청년센터 프로그램",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0348",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2026-03-14T00:12:00+09:00",
   "likes": 33,
   "comments": [
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-14T03:56:07.291695+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#재수"
   ],
   "caption": "주말 학원",
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
   "id": "LBP-0349",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-03-14T00:38:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-14T01:48:12.210732+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-14T07:29:10.186265+09:00",
     "body": "발표 준비 화이팅"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "재수 끝났다",
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
   "id": "LBP-0350",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2026-03-14T00:56:00+09:00",
   "likes": 24,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#동네친구"
   ],
   "body": "고3 학원",
   "media": []
  },
  {
   "id": "LBP-0351",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-03-14T01:54:00+09:00",
   "likes": 89,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-14T02:00:18.144430+09:00",
     "body": "어디서 찍었어?"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-14T16:48:44.032981+09:00",
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#성원동카페",
    "#봄"
   ],
   "caption": "오늘 제육볶음 집중 안 됨",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0352",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2026-03-14T13:07:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-14T14:38:51.189425+09:00",
     "body": "몇 시까지 해요?"
    },
    {
     "author": "jun.choi",
     "createdAt": "2026-03-14T16:40:55.663284+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청",
    "#학식",
    "#꽃샘추위"
   ],
   "body": "과제 미뤘음",
   "media": []
  },
  {
   "id": "LBP-0353",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-03-14T14:27:00+09:00",
   "likes": 32,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-14T14:38:25.592387+09:00",
     "body": "도서관 자리 있어?"
    },
    {
     "author": "donghyun.lim",
     "createdAt": "2026-03-14T15:33:50.946139+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#수강신청"
   ],
   "caption": "오늘 학식 짜장밥",
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
   "id": "LBP-0354",
   "kind": "text",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-14T16:50:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-14T17:45:50.253321+09:00",
     "body": "몇 시까지 해요?"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-15T00:34:12.376474+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#성원동카페",
    "#봄"
   ],
   "body": "토요일 휴무",
   "media": []
  },
  {
   "id": "LBP-0355",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2026-03-14T17:07:00+09:00",
   "likes": 17,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#입대"
   ],
   "caption": "재수 재밌다",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0356",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-03-14T18:01:00+09:00",
   "likes": 198,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-14T18:33:22.981344+09:00",
     "body": "다음 주에 보자"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-14T18:59:59.192517+09:00",
     "body": "화이팅"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-15T01:27:53.338252+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#공지",
    "#학생회"
   ],
   "body": "수강 학사 일정",
   "media": []
  },
  {
   "id": "LBP-0357",
   "kind": "photo",
   "author": "meme.box",
   "createdAt": "2026-03-14T18:35:00+09:00",
   "likes": 229,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#농구",
    "#밈"
   ],
   "caption": "새로 산 운동화",
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
   "id": "LBP-0358",
   "kind": "text",
   "author": "lens.minho",
   "createdAt": "2026-03-14T18:48:00+09:00",
   "likes": 31,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영"
   ],
   "body": "스태프 촬영",
   "media": []
  },
  {
   "id": "LBP-0359",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2026-03-14T20:58:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-15T01:47:17.068033+09:00",
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청",
    "#개강"
   ],
   "caption": "오늘 학식 김치찌개",
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
   "id": "LBP-0360",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2026-03-14T21:48:00+09:00",
   "likes": 33,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-15T02:17:06.280283+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#경영26"
   ],
   "caption": "도서관 8시 야경",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0361",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-03-14T22:49:00+09:00",
   "likes": 203,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-14T23:02:56.918065+09:00",
     "body": "도서관 자리 있어?"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-15T01:30:01.794224+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#축구"
   ],
   "body": "가방 밀림",
   "media": []
  },
  {
   "id": "LBP-0362",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2026-03-14T22:51:00+09:00",
   "likes": 11,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-15T00:21:18.764424+09:00",
     "body": "맛있겠다"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-15T01:59:34.366230+09:00",
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "body": "친구 입대",
   "media": []
  },
  {
   "id": "LBP-0363",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-14T22:57:00+09:00",
   "likes": 39,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄"
   ],
   "caption": "주말 휴무",
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
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0364",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-03-14T23:22:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "lens.minho",
     "createdAt": "2026-03-14T23:32:26.956841+09:00",
     "body": "꽃샘추위"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-03-15T02:03:06.770507+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#영상과",
    "#편집"
   ],
   "caption": "성원동 카페 스카우트",
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
   "id": "LBP-0365",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-03-14T23:52:00+09:00",
   "likes": 34,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-15T01:22:30.883795+09:00",
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영26",
    "#학식"
   ],
   "caption": "수강신청 우산 챙김",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0366",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-03-15T00:25:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-15T02:52:55.004612+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄"
   ],
   "caption": "성원동 골목 손님맞이",
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
   "place": "성원동 풋살장"
  },
  {
   "id": "LBP-0367",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2026-03-15T00:28:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-15T03:52:27.599953+09:00",
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강",
    "#학식",
    "#경영26"
   ],
   "body": "성원동 카페 하는 중",
   "media": []
  },
  {
   "id": "LBP-0368",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-15T00:35:00+09:00",
   "likes": 11,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-15T02:22:54.296311+09:00",
     "body": "ㅇㅇ"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#재수"
   ],
   "body": "친구 주말 모임",
   "media": []
  },
  {
   "id": "LBP-0369",
   "kind": "text",
   "author": "cut.jaehyun",
   "createdAt": "2026-03-15T01:18:00+09:00",
   "likes": 28,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2026-03-15T01:36:32.321649+09:00",
     "body": "꽃샘추위"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집"
   ],
   "body": "스태프 영상제",
   "media": []
  },
  {
   "id": "LBP-0370",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2026-03-15T01:32:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-15T03:23:50.186047+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#동네친구"
   ],
   "body": "모의고사 생각보다 괜찮음",
   "media": []
  },
  {
   "id": "LBP-0371",
   "kind": "text",
   "author": "yeseul.hong",
   "createdAt": "2026-03-15T01:57:00+09:00",
   "likes": 10,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-15T02:02:34.202325+09:00",
     "body": "최고"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2026-03-15T03:10:14.310881+09:00",
     "body": "봄 오냐"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-15T03:18:25.401696+09:00",
     "body": "몇 시까지 해요?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#동네친구",
    "#꽃샘추위"
   ],
   "body": "토요일 동창 모임",
   "media": []
  },
  {
   "id": "LBP-0372",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2026-03-15T07:04:00+09:00",
   "likes": 49,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-15T20:49:54.466342+09:00",
     "body": "이거 어디야?"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-03-16T20:37:05.224588+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#농구",
    "#게임",
    "#플리"
   ],
   "body": "헤드폰 하는 중",
   "media": []
  },
  {
   "id": "LBP-0373",
   "kind": "photo",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-15T17:04:00+09:00",
   "likes": 39,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-16T19:53:49.554002+09:00",
     "body": "경기 봤어?"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-16T23:56:27.580684+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원동맛집",
    "#주말"
   ],
   "caption": "주말 카레라이스",
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
   "id": "LBP-0374",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-03-15T18:24:00+09:00",
   "likes": 155,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#공지"
   ],
   "body": "캠퍼스 학사 일정",
   "media": []
  },
  {
   "id": "LBP-0375",
   "kind": "photo",
   "author": "hanseo.student",
   "createdAt": "2026-03-15T19:21:00+09:00",
   "likes": 525,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#청년센터",
    "#공지",
    "#학생회"
   ],
   "caption": "3/18 과제 마감",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0376",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-03-15T19:43:00+09:00",
   "likes": 86,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2026-03-17T18:47:56.312188+09:00",
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#봄"
   ],
   "caption": "성원동 분식 오픈",
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
   "likes": 443,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#플리",
    "#축구",
    "#게임"
   ],
   "body": "러닝 끝났다",
   "media": []
  },
  {
   "id": "LBP-0378",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2026-03-15T23:23:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-16T10:23:12.277591+09:00",
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동네친구",
    "#성원고"
   ],
   "caption": "수시 야자",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0379",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-15T23:44:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-03-16T07:08:34.730943+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-03-16T16:37:05.462561+09:00",
     "body": "우와"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#촬영",
    "#편집",
    "#영상과"
   ],
   "caption": "성원천 스카우트",
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
   "id": "LBP-0380",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2026-03-15T23:47:00+09:00",
   "likes": 9,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#개강"
   ],
   "body": "학식 불고기덮밥 재밌다",
   "media": []
  },
  {
   "id": "LBP-0381",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-16T00:27:00+09:00",
   "likes": 671,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#게임",
    "#축구"
   ],
   "body": "햇살 배드민턴",
   "media": []
  },
  {
   "id": "LBP-0382",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2026-03-16T00:38:00+09:00",
   "likes": 8,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제"
   ],
   "caption": "OT 과제",
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
   "id": "LBP-0383",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2026-03-16T01:04:00+09:00",
   "likes": 29,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-16T16:05:06.096318+09:00",
     "body": "알바 끝나고 봐"
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
   "caption": "수강신청 패딩 다시 꺼냄",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0384",
   "kind": "text",
   "author": "film.sua",
   "createdAt": "2026-03-16T01:46:00+09:00",
   "likes": 74,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#영상과",
    "#단편영화",
    "#상영회"
   ],
   "body": "단편 스태프 모임",
   "media": []
  },
  {
   "id": "LBP-0385",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2026-03-16T11:30:00+09:00",
   "likes": 62,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#꽃샘추위",
    "#학식",
    "#한서대"
   ],
   "caption": "과제하다 새벽 2시",
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
   "id": "LBP-0386",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2026-03-16T11:35:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-16T15:37:04.401996+09:00",
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#입대"
   ],
   "caption": "친구들이랑 성원동 골목",
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
   "id": "LBP-0387",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-03-16T12:34:00+09:00",
   "likes": 48,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2026-03-17T09:04:53.340533+09:00",
     "body": "커피 ㄱ?"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-17T14:47:18.822791+09:00",
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동네친구",
    "#꽃샘추위"
   ],
   "caption": "동네 성원동 골목",
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
   "place": "성원동 풋살장"
  },
  {
   "id": "LBP-0388",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2026-03-16T16:26:00+09:00",
   "likes": 41,
   "comments": [],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#총학생회",
    "#한서대"
   ],
   "body": "수강 총학생회 공지",
   "media": []
  },
  {
   "id": "LBP-0389",
   "kind": "text",
   "author": "donghyun.lim",
   "createdAt": "2026-03-16T16:56:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2026-03-17T15:24:25.466203+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원고"
   ],
   "body": "학원 입대",
   "media": []
  },
  {
   "id": "LBP-0390",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-03-16T18:06:00+09:00",
   "likes": 16,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#학식",
    "#새내기"
   ],
   "caption": "동아리 수강 정정",
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
   "likes": 271,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-17T14:55:34.703505+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#러닝",
    "#게임"
   ],
   "body": "흐림 러닝",
   "media": []
  },
  {
   "id": "LBP-0392",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-03-16T21:00:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "music.drawer",
     "createdAt": "2026-03-17T02:24:02.203081+09:00",
     "body": "아침부터 고생"
    },
    {
     "author": "football.talk",
     "createdAt": "2026-03-17T06:53:43.131926+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#축구"
   ],
   "body": "햇살 테니스",
   "media": []
  },
  {
   "id": "LBP-0393",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-03-16T22:15:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-17T12:01:50.547708+09:00",
     "body": "이거 어디야?"
    },
    {
     "author": "jun.choi",
     "createdAt": "2026-03-17T17:21:38.973819+09:00",
     "body": "오늘 날씨 진짜"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "수강신청 커피 삼",
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
   "id": "LBP-0394",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-03-16T23:28:00+09:00",
   "likes": 131,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원동맛집"
   ],
   "caption": "주말 제육볶음",
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
   "id": "LBP-0395",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2026-03-16T23:45:00+09:00",
   "likes": 47,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#새내기"
   ],
   "caption": "과방에서 과제",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0396",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2026-03-16T23:50:00+09:00",
   "likes": 10,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-17T05:41:49.887969+09:00",
     "body": "아침부터 고생"
    },
    {
     "author": "music.drawer",
     "createdAt": "2026-03-17T17:23:27.709763+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#꽃샘추위",
    "#수강신청",
    "#학식"
   ],
   "body": "과제 제출함",
   "media": []
  },
  {
   "id": "LBP-0397",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2026-03-17T00:09:00+09:00",
   "likes": 23,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2026-03-17T17:04:05.572712+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#학식",
    "#한서대",
    "#경영26"
   ],
   "body": "학식 짜장밥 졸리다",
   "media": []
  },
  {
   "id": "LBP-0398",
   "kind": "text",
   "author": "film.sua",
   "createdAt": "2026-03-17T00:21:00+09:00",
   "likes": 54,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#촬영",
    "#단편영화"
   ],
   "body": "필름 시나리오",
   "media": []
  },
  {
   "id": "LBP-0399",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2026-03-17T00:34:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-17T08:11:52.060721+09:00",
     "body": "그거 나도 봤어"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대"
   ],
   "caption": "오늘 학식 치킨마요",
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
   "id": "LBP-0400",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2026-03-17T01:09:00+09:00",
   "likes": 27,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#수강신청",
    "#학식"
   ],
   "body": "과방 하는 중",
   "media": []
  },
  {
   "id": "LBP-0401",
   "kind": "photo",
   "author": "run.daily",
   "createdAt": "2026-03-17T01:10:00+09:00",
   "likes": 44,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#플리"
   ],
   "caption": "오늘 경기 2-2",
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
   "place": "성원천 산책로"
  },
  {
   "id": "LBP-0402",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-17T01:17:00+09:00",
   "likes": 49,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#봄",
    "#동네가게",
    "#주말"
   ],
   "caption": "오늘 할인",
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
   "place": "성원동 골목"
  },
  {
   "id": "LBP-0403",
   "kind": "text",
   "author": "yuna.lee",
   "createdAt": "2026-03-17T01:26:00+09:00",
   "likes": 33,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-17T13:41:25.457079+09:00",
     "body": "역전 미쳤다"
    },
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-17T17:25:52.860840+09:00",
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#새내기"
   ],
   "body": "오늘 마케팅원론 살았다",
   "media": []
  },
  {
   "id": "LBP-0404",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2026-03-17T03:46:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-17T14:34:04.501428+09:00",
     "body": "역전 미쳤다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원고",
    "#알바"
   ],
   "caption": "꽃샘추위 산책함",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-0405",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2026-03-17T04:27:00+09:00",
   "likes": 237,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#농구",
    "#게임"
   ],
   "body": "꽃샘추위 배드민턴",
   "media": []
  },
  {
   "id": "LBP-0406",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-03-17T05:40:00+09:00",
   "likes": 92,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#게임"
   ],
   "caption": "오늘의 봄 플리",
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
   "id": "LBP-0407",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2026-03-17T07:20:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-17T09:27:43.764484+09:00",
     "body": "플리 저장"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2026-03-17T14:31:23.403093+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원동맛집"
   ],
   "caption": "불고기덮밥 맛보기",
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
   "id": "LBP-0408",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2026-03-17T07:58:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-17T11:21:30.649177+09:00",
     "body": "우와"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원고",
    "#입대",
    "#꽃샘추위"
   ],
   "caption": "학원 10시 끝",
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
   "id": "LBP-0409",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-03-17T08:20:00+09:00",
   "likes": 284,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2026-03-17T09:13:43.009408+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#축구",
    "#농구",
    "#밈"
   ],
   "body": "경기 업데이트",
   "media": []
  },
  {
   "id": "LBP-0410",
   "kind": "text",
   "author": "football.talk",
   "createdAt": "2026-03-17T10:58:00+09:00",
   "likes": 345,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#축구",
    "#밈",
    "#게임"
   ],
   "body": "테니스 경기",
   "media": []
  },
  {
   "id": "LBP-0411",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2026-03-17T12:31:00+09:00",
   "likes": 27,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동네친구",
    "#입대"
   ],
   "caption": "수시 생일",
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
   "id": "LBP-0412",
   "kind": "text",
   "author": "seongwon.cafe",
   "createdAt": "2026-03-17T12:37:00+09:00",
   "likes": 50,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-03-17T14:56:05.050129+09:00",
     "body": "경기 봤어?"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-17T16:58:07.755425+09:00",
     "body": "나도 하고 싶다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동네가게",
    "#성원동맛집",
    "#주말"
   ],
   "body": "우동 망했다",
   "media": []
  },
  {
   "id": "LBP-0413",
   "kind": "photo",
   "author": "seongwon.youth",
   "createdAt": "2026-03-17T14:32:00+09:00",
   "likes": 158,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-17T19:36:52.712933+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#총학생회"
   ],
   "caption": "한서대학교 과제 마감",
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
   "id": "LBP-0414",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2026-03-17T14:43:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-17T14:54:00.935436+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-17T15:45:20.216847+09:00",
     "body": "그거 나도 봤어"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-17T17:29:04.531835+09:00",
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#학식"
   ],
   "body": "학생회관 거의 다 함",
   "media": []
  },
  {
   "id": "LBP-0415",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2026-03-17T15:22:00+09:00",
   "likes": 59,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#개강",
    "#새내기",
    "#경영26"
   ],
   "caption": "마케팅원론 끝나고 성원동 카페",
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
   "id": "LBP-0416",
   "kind": "text",
   "author": "frame.hana",
   "createdAt": "2026-03-17T16:22:00+09:00",
   "likes": 34,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#상영회",
    "#촬영",
    "#영상과"
   ],
   "body": "장비 영상제",
   "media": []
  },
  {
   "id": "LBP-0417",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-17T16:44:00+09:00",
   "likes": 35,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#상영회",
    "#촬영"
   ],
   "caption": "조명 포스터",
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
   "id": "LBP-0418",
   "kind": "photo",
   "author": "biz.hanseo",
   "createdAt": "2026-03-17T18:16:00+09:00",
   "likes": 176,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-03-17T19:40:51.586058+09:00",
     "body": "다음 주에 보자"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-17T19:49:31.667585+09:00",
     "body": "플리 저장"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-17T20:25:43.563957+09:00",
     "body": "5km 대단"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#총학생회"
   ],
   "caption": "장학 청년센터 프로그램",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-0419",
   "kind": "text",
   "author": "daily.seongwon",
   "createdAt": "2026-03-17T18:25:00+09:00",
   "likes": 79,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원동맛집",
    "#동네가게",
    "#주말"
   ],
   "body": "주말 주말",
   "media": []
  },
  {
   "id": "LBP-0420",
   "kind": "photo",
   "author": "meme.box",
   "createdAt": "2026-03-17T20:26:00+09:00",
   "likes": 330,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-03-17T20:43:03.078425+09:00",
     "body": "아침부터 고생"
    },
    {
     "author": "game.loop",
     "createdAt": "2026-03-17T20:55:05.884478+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#밈",
    "#러닝",
    "#축구"
   ],
   "caption": "러닝 기록",
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
   "place": "성원동 풋살장"
  }
 ],
 "loopPostsLive": [
  {
   "id": "LBP-LIVE-0001",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-17T21:30:00+09:00",
   "likes": 536,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#축구",
    "#농구"
   ],
   "live": true,
   "body": "게임 러닝",
   "media": []
  },
  {
   "id": "LBP-LIVE-0002",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2026-03-17T21:39:00+09:00",
   "likes": 53,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#수강신청",
    "#한서대"
   ],
   "live": true,
   "caption": "컴퓨터활용 끝나고 성원동 분식",
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
   "id": "LBP-LIVE-0003",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2026-03-17T21:41:00+09:00",
   "likes": 34,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-18T05:22:21.896578+09:00",
     "body": "나도 하고 싶다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#입대",
    "#성원고",
    "#꽃샘추위"
   ],
   "live": true,
   "caption": "바람 창밖만 봄",
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
   "id": "LBP-LIVE-0004",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2026-03-17T21:42:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-17T23:32:11.010050+09:00",
     "body": "나도 하고 싶다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#꽃샘추위",
    "#동네친구",
    "#재수"
   ],
   "live": true,
   "body": "성원동 골목 시작도 못 함",
   "media": []
  },
  {
   "id": "LBP-LIVE-0005",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-17T22:15:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-18T02:07:45.856989+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#재수",
    "#꽃샘추위"
   ],
   "live": true,
   "body": "동네 동창 모임",
   "media": []
  },
  {
   "id": "LBP-LIVE-0006",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2026-03-17T22:39:00+09:00",
   "likes": 29,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#러닝"
   ],
   "live": true,
   "body": "러닝 재밌다",
   "media": []
  },
  {
   "id": "LBP-LIVE-0007",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-03-17T22:46:00+09:00",
   "likes": 34,
   "comments": [
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-17T23:07:06.934952+09:00",
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#재수"
   ],
   "live": true,
   "caption": "모의고사 끝남",
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
   "id": "LBP-LIVE-0008",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-03-17T23:01:00+09:00",
   "likes": 51,
   "comments": [],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원동카페",
    "#성원동맛집",
    "#주말"
   ],
   "live": true,
   "caption": "오늘의 카레라이스",
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
   "id": "LBP-LIVE-0009",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-03-17T23:06:00+09:00",
   "likes": 32,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제",
    "#새내기",
    "#수강신청"
   ],
   "live": true,
   "caption": "수강신청 코트 못 감",
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
   "place": "한서대 학생회관"
  },
  {
   "id": "LBP-LIVE-0010",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2026-03-17T23:13:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-18T01:31:28.579939+09:00",
     "body": "이번 주도?"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-03-18T02:16:12.520650+09:00",
     "body": "ㅇㅇ"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#학식",
    "#꽃샘추위"
   ],
   "live": true,
   "body": "시험 신입생 환영회",
   "media": []
  },
  {
   "id": "LBP-LIVE-0011",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-03-17T23:44:00+09:00",
   "likes": 36,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#편집",
    "#촬영"
   ],
   "live": true,
   "caption": "포스터 포스터",
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
   "id": "LBP-LIVE-0012",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-03-18T00:03:00+09:00",
   "likes": 10,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-18T01:22:21.332683+09:00",
     "body": "플리 저장"
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
   "live": true,
   "caption": "도서관 12시 야경",
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
   "place": "성원동 카페"
  },
  {
   "id": "LBP-LIVE-0013",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-03-18T00:15:00+09:00",
   "likes": 32,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#영상과"
   ],
   "live": true,
   "caption": "대학글쓰기 과제 단편",
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
   "id": "LBP-LIVE-0014",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2026-03-18T00:59:00+09:00",
   "likes": 32,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동네친구",
    "#성원고",
    "#꽃샘추위"
   ],
   "live": true,
   "caption": "수시 수시",
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
   "id": "LBP-LIVE-0015",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2026-03-18T01:22:00+09:00",
   "likes": 7,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#입대",
    "#꽃샘추위"
   ],
   "live": true,
   "caption": "학원 새벽 2시 끝",
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
   "id": "LBP-LIVE-0016",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2026-03-18T01:41:00+09:00",
   "likes": 20,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#과제",
    "#학식"
   ],
   "live": true,
   "body": "햇살 졸리다",
   "media": []
  },
  {
   "id": "LBP-LIVE-0017",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2026-03-18T02:54:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-18T07:40:19.987009+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#새내기"
   ],
   "live": true,
   "body": "성원동 카페 내일 함",
   "media": []
  },
  {
   "id": "LBP-LIVE-0018",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2026-03-18T04:55:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-18T08:47:28.476170+09:00",
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#알바",
    "#꽃샘추위"
   ],
   "live": true,
   "body": "동창 알바",
   "media": []
  },
  {
   "id": "LBP-LIVE-0019",
   "kind": "text",
   "author": "haneul.park",
   "createdAt": "2026-03-18T05:30:00+09:00",
   "likes": 41,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2026-03-18T06:32:01.688355+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#학식"
   ],
   "live": true,
   "body": "MT 신입생 환영회",
   "media": []
  },
  {
   "id": "LBP-LIVE-0020",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-03-18T06:17:00+09:00",
   "likes": 98,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-03-18T08:29:46.502272+09:00",
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#게임"
   ],
   "live": true,
   "body": "밈 밈",
   "media": []
  },
  {
   "id": "LBP-LIVE-0021",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-03-18T06:36:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "music.drawer",
     "createdAt": "2026-03-18T07:39:43.482024+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원동맛집",
    "#봄",
    "#동네가게"
   ],
   "live": true,
   "caption": "새로 나온 치킨마요",
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
   "id": "LBP-LIVE-0022",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-18T07:25:00+09:00",
   "likes": 39,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-03-18T07:35:35.796316+09:00",
     "body": "이번 주도?"
    },
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-03-18T08:51:03.352972+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#단편영화"
   ],
   "live": true,
   "caption": "카메라 촬영",
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
   "id": "LBP-LIVE-0023",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2026-03-18T07:45:00+09:00",
   "likes": 30,
   "comments": [],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제",
    "#새내기",
    "#개강"
   ],
   "live": true,
   "body": "새내기 동아리",
   "media": []
  },
  {
   "id": "LBP-LIVE-0024",
   "kind": "text",
   "author": "frame.hana",
   "createdAt": "2026-03-18T08:31:00+09:00",
   "likes": 27,
   "comments": [],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#단편영화"
   ],
   "live": true,
   "body": "포스터 내일 함",
   "media": []
  },
  {
   "id": "LBP-LIVE-0025",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-03-18T08:48:00+09:00",
   "likes": 34,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-03-18T08:56:35.595894+09:00",
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#알바",
    "#재수"
   ],
   "live": true,
   "caption": "야자 끝나고 튀김",
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
   "place": "성원동 카페"
  }
 ],
 "pool": {
  "items": [
   {
    "id": "PL-0001",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "OT 제출함"
   },
   {
    "id": "PL-0002",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "MT 포기함"
   },
   {
    "id": "PL-0003",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "김치찌개 시킬까?"
   },
   {
    "id": "PL-0004",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "2시에 중앙도서관에서 볼 사람?"
   },
   {
    "id": "PL-0005",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "발표 준비물 뭐 챙겨?"
   },
   {
    "id": "PL-0006",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "신입생 환영회 준비물 뭐 챙겨?"
   },
   {
    "id": "PL-0007",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 오후 수업 있는 사람?"
   },
   {
    "id": "PL-0008",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "동아리 포기함"
   },
   {
    "id": "PL-0009",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "튀김 먹고 중앙도서관 갈래?"
   },
   {
    "id": "PL-0010",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "2시까지 학생회관 갈 수 있어?"
   },
   {
    "id": "PL-0011",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "한서대 도서관 동아리 갔어?"
   },
   {
    "id": "PL-0012",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "최성호 괜찮다?"
   },
   {
    "id": "PL-0013",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "꽃샘추위라서 창밖만 봄"
   },
   {
    "id": "PL-0014",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "6시에 학생회관 갈 사람?"
   },
   {
    "id": "PL-0015",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 제육볶음 먹을 사람"
   },
   {
    "id": "PL-0016",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "정시우 중간고사 갔어?"
   },
   {
    "id": "PL-0017",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "최유빈 시작도 못 함?"
   },
   {
    "id": "PL-0018",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오세훈 확인함?"
   },
   {
    "id": "PL-0019",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "성원구 청년센터 제출함?"
   },
   {
    "id": "PL-0020",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "개강총회 바쁘다"
   },
   {
    "id": "PL-0021",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 카레라이스 먹을 사람"
   },
   {
    "id": "PL-0022",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "제육볶음 먹고 과방 갈래?"
   },
   {
    "id": "PL-0023",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "햇살라서 커피 삼"
   },
   {
    "id": "PL-0024",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "컴퓨터활용 교수님 끝남"
   },
   {
    "id": "PL-0025",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과방 끝남"
   },
   {
    "id": "PL-0026",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "라면 먹고 잔디밭 갈래?"
   },
   {
    "id": "PL-0027",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "경제학원론 졸리다"
   },
   {
    "id": "PL-0028",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "단톡 제출함"
   },
   {
    "id": "PL-0029",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "박세라 밀림?"
   },
   {
    "id": "PL-0030",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과방 미뤘음"
   },
   {
    "id": "PL-0031",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "회계원리 어렵다"
   },
   {
    "id": "PL-0032",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "경영원론 어렵다"
   },
   {
    "id": "PL-0033",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 튀김 먹을 사람"
   },
   {
    "id": "PL-0034",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 오전 수업 있는 사람?"
   },
   {
    "id": "PL-0035",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "송민호 내일 함?"
   },
   {
    "id": "PL-0036",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 확인함"
   },
   {
    "id": "PL-0037",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "목요일 개강 하는 중"
   },
   {
    "id": "PL-0038",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "신건우 개강 갔어?"
   },
   {
    "id": "PL-0039",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "12시에 중앙도서관에서 볼 사람?"
   },
   {
    "id": "PL-0040",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "금요일에 개강총회 한대"
   },
   {
    "id": "PL-0041",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "수요일에 신입생 환영회 한대"
   },
   {
    "id": "PL-0042",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "목요일 개강 많다"
   },
   {
    "id": "PL-0043",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "12시에 성원동 카페에서 볼 사람?"
   },
   {
    "id": "PL-0044",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "흐림라서 창밖만 봄"
   },
   {
    "id": "PL-0045",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "한서아 중간고사 갔어?"
   },
   {
    "id": "PL-0046",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 라면 먹을 사람"
   },
   {
    "id": "PL-0047",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 하는 중"
   },
   {
    "id": "PL-0048",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "햇살라서 창밖만 봄"
   },
   {
    "id": "PL-0049",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "김민서 내일 함?"
   },
   {
    "id": "PL-0050",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "12시까지 과방 갈 수 있어?"
   },
   {
    "id": "PL-0051",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "개강 준비물 뭐 챙겨?"
   },
   {
    "id": "PL-0052",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "대학글쓰기 교수님 괜찮다"
   },
   {
    "id": "PL-0053",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "단톡 바쁘다"
   },
   {
    "id": "PL-0054",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "꽃샘추위라서 옷 못 정함"
   },
   {
    "id": "PL-0055",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "9시에 성원동 분식에서 볼 사람?"
   },
   {
    "id": "PL-0056",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "목요일 개강 바쁘다"
   },
   {
    "id": "PL-0057",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 미뤘음"
   },
   {
    "id": "PL-0058",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "밤 11시까지 과방 갈 수 있어?"
   },
   {
    "id": "PL-0059",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "김도훈 내일 함?"
   },
   {
    "id": "PL-0060",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "12시에 과방 갈 사람?"
   },
   {
    "id": "PL-0061",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "발표 미뤘음"
   },
   {
    "id": "PL-0062",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "대학글쓰기 교수님 비었음"
   },
   {
    "id": "PL-0063",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "미세먼지라서 커피 삼"
   },
   {
    "id": "PL-0064",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "발표 확인함"
   },
   {
    "id": "PL-0065",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "신입생 환영회 성공"
   },
   {
    "id": "PL-0066",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "박세라 확인함?"
   },
   {
    "id": "PL-0067",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "짜장밥 시킬까?"
   },
   {
    "id": "PL-0068",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 제출함"
   },
   {
    "id": "PL-0069",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "단톡 끝남"
   },
   {
    "id": "PL-0070",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 예약됨"
   },
   {
    "id": "PL-0071",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "화요일에 학원 앞 갈 사람"
   },
   {
    "id": "PL-0072",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "모의고사 조용하다"
   },
   {
    "id": "PL-0073",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "8시에 성원동 분식에서 보자"
   },
   {
    "id": "PL-0074",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "수요일 주말 모임 어때?"
   },
   {
    "id": "PL-0075",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "새벽 2시 성원동 분식 끝남",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0076",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "입대 끝남"
   },
   {
    "id": "PL-0077",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "비 배고프다"
   },
   {
    "id": "PL-0078",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "생일 많다"
   },
   {
    "id": "PL-0079",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘 회계원리 집중 안 됨"
   },
   {
    "id": "PL-0080",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "윤재민 요즘 뭐 해?"
   },
   {
    "id": "PL-0081",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "수요일에 성원천 갈 사람"
   },
   {
    "id": "PL-0082",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "성원우체국아 뭐 해?"
   },
   {
    "id": "PL-0083",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "튀김 먹고 갈래?"
   },
   {
    "id": "PL-0084",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "이유나아 잘 지내?"
   },
   {
    "id": "PL-0085",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "생일 괜찮다"
   },
   {
    "id": "PL-0086",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "야자 준비 거의 다 함"
   },
   {
    "id": "PL-0087",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "10시에 학원 끝나"
   },
   {
    "id": "PL-0088",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "알바 새벽 1시 많다",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0089",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘 대학글쓰기 재밌다"
   },
   {
    "id": "PL-0090",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "6시 학원 앞 내일 함"
   },
   {
    "id": "PL-0091",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "월요일 학원 어때?"
   },
   {
    "id": "PL-0092",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "제육볶음 먹고 갈래?"
   },
   {
    "id": "PL-0093",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "미세먼지라서 실내에만 있음"
   },
   {
    "id": "PL-0094",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "금요일에 학원 앞 갈 사람"
   },
   {
    "id": "PL-0095",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "학원 준비 바쁘다"
   },
   {
    "id": "PL-0096",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "입대 D-7"
   },
   {
    "id": "PL-0097",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "일요일 동창 모임 어때?"
   },
   {
    "id": "PL-0098",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "모의고사 준비 거의 다 함"
   },
   {
    "id": "PL-0099",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "비라서 산책함"
   },
   {
    "id": "PL-0100",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "성원우체국 요즘 뭐 해?"
   },
   {
    "id": "PL-0101",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "입대 D-1"
   },
   {
    "id": "PL-0102",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "정시우은 뭐 해?"
   },
   {
    "id": "PL-0103",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "수시 다 찍음"
   },
   {
    "id": "PL-0104",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "미세먼지 살았다"
   },
   {
    "id": "PL-0105",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "햇살 바쁘다"
   },
   {
    "id": "PL-0106",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "동네 성원천 괜찮다"
   },
   {
    "id": "PL-0107",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "월요일 모의고사 어때?"
   },
   {
    "id": "PL-0108",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "카레라이스 먹고 갈래?"
   },
   {
    "id": "PL-0109",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "2시에 학원 끝나"
   },
   {
    "id": "PL-0110",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "알바 2시 조용하다"
   },
   {
    "id": "PL-0111",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "재수 집중 안 됨"
   },
   {
    "id": "PL-0112",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "야자 준비 끝남"
   },
   {
    "id": "PL-0113",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "화요일에 성원동 골목 갈 사람"
   },
   {
    "id": "PL-0114",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "정다은은 뭐 해?"
   },
   {
    "id": "PL-0115",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "입대 괜찮다"
   },
   {
    "id": "PL-0116",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "흐림라서 커피 삼"
   },
   {
    "id": "PL-0117",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "알바 밤 11시 괜찮다"
   },
   {
    "id": "PL-0118",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "다음 주 주말 모임 확인함"
   },
   {
    "id": "PL-0119",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "온통신 고객센터아 뭐 해?"
   },
   {
    "id": "PL-0120",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "10시에 독서실에서 보자"
   },
   {
    "id": "PL-0121",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "토요일 생일 어때?"
   },
   {
    "id": "PL-0122",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "오늘 영어 바쁘다"
   },
   {
    "id": "PL-0123",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "비라서 옷 못 정함"
   },
   {
    "id": "PL-0124",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "일요일에 성원동 분식 갈 사람"
   },
   {
    "id": "PL-0125",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "정명숙아 밥 먹었어?"
   },
   {
    "id": "PL-0126",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "자료 공유함"
   },
   {
    "id": "PL-0127",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "새벽 1시에 성원동 카페 어때?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0128",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 10시에 학생회관에서 모여"
   },
   {
    "id": "PL-0129",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "PPT 거의 다 됨"
   },
   {
    "id": "PL-0130",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "보고서 작성 맡음"
   },
   {
    "id": "PL-0131",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "강태호 확인했어?"
   },
   {
    "id": "PL-0132",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "과제 발표 자료 정리 다시 봄"
   },
   {
    "id": "PL-0133",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "과제 발표 연습 맡음"
   },
   {
    "id": "PL-0134",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 과방 조용하다"
   },
   {
    "id": "PL-0135",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "보고서 작성 확인함"
   },
   {
    "id": "PL-0136",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "PPT 확인함"
   },
   {
    "id": "PL-0137",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "이강훈 확인 부탁"
   },
   {
    "id": "PL-0138",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "제출 거의"
   },
   {
    "id": "PL-0139",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "정해성 확인 부탁"
   },
   {
    "id": "PL-0140",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "김태식 확인 부탁"
   },
   {
    "id": "PL-0141",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "새벽 2시에 잔디밭 어때?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0142",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "내일 9시까지 가능?"
   },
   {
    "id": "PL-0143",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "사례 자료 찾는 중"
   },
   {
    "id": "PL-0144",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 6시에 과방에서 모여"
   },
   {
    "id": "PL-0145",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "내일 2시까지 가능?"
   },
   {
    "id": "PL-0146",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "도입는 고나영가 맡기로 했지?"
   },
   {
    "id": "PL-0147",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "통계 정리함"
   },
   {
    "id": "PL-0148",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지 발표 자료 정리"
   },
   {
    "id": "PL-0149",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 연습 확인함"
   },
   {
    "id": "PL-0150",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 중앙도서관 자리 있다"
   },
   {
    "id": "PL-0151",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "도입 준비 중"
   },
   {
    "id": "PL-0152",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지 발표 연습"
   },
   {
    "id": "PL-0153",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 마감 아직"
   },
   {
    "id": "PL-0154",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지 출처 정리"
   },
   {
    "id": "PL-0155",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "10시에 성원동 카페 어때?"
   },
   {
    "id": "PL-0156",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "PPT는 고나영가 맡기로 했지?"
   },
   {
    "id": "PL-0157",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 12시까지 발표 연습"
   },
   {
    "id": "PL-0158",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "새벽 1시에 잔디밭 어때?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0159",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "사진 거의 다 모음"
   },
   {
    "id": "PL-0160",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 사례 맡음"
   },
   {
    "id": "PL-0161",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 10시까지 PPT 만들기"
   },
   {
    "id": "PL-0162",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "김민서 확인 부탁"
   },
   {
    "id": "PL-0163",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 연습 준비 중"
   },
   {
    "id": "PL-0164",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "정해성 확인했어?"
   },
   {
    "id": "PL-0165",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "제출 오늘"
   },
   {
    "id": "PL-0166",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "사례 끝냄"
   },
   {
    "id": "PL-0167",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "결론 연습함"
   },
   {
    "id": "PL-0168",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 자료 공유함"
   },
   {
    "id": "PL-0169",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 결론 연습함"
   },
   {
    "id": "PL-0170",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "과제 보고서 작성 연습함"
   },
   {
    "id": "PL-0171",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "배수현 내일 함?"
   },
   {
    "id": "PL-0172",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "물 비었음"
   },
   {
    "id": "PL-0173",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "미세먼지라서 창밖만 봄"
   },
   {
    "id": "PL-0174",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이번 주 화요일 예약됨"
   },
   {
    "id": "PL-0175",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "최민규 끝남?"
   },
   {
    "id": "PL-0176",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장비 조용하다"
   },
   {
    "id": "PL-0177",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이유나 골키퍼 가능?"
   },
   {
    "id": "PL-0178",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "수요일 10시 거의 다 함"
   },
   {
    "id": "PL-0179",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "오늘 9시 편의점 조용하다"
   },
   {
    "id": "PL-0180",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "회비 조용하다"
   },
   {
    "id": "PL-0181",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 거의 다 함"
   },
   {
    "id": "PL-0182",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다들 밀림?"
   },
   {
    "id": "PL-0183",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 주 토요일도 비었음?"
   },
   {
    "id": "PL-0184",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "물 시작도 못 함"
   },
   {
    "id": "PL-0185",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "치킨마요 먹고 8시에 모이자"
   },
   {
    "id": "PL-0186",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "박하늘 골키퍼 가능?"
   },
   {
    "id": "PL-0187",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이준서 골키퍼 가능?"
   },
   {
    "id": "PL-0188",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "2시에 편의점 비었음"
   },
   {
    "id": "PL-0189",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 주 화요일도 미뤘음?"
   },
   {
    "id": "PL-0190",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "미세먼지 밀림"
   },
   {
    "id": "PL-0191",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 주 토요일도 많다?"
   },
   {
    "id": "PL-0192",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "회비 제출함"
   },
   {
    "id": "PL-0193",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "성원구 보건소 괜찮다?"
   },
   {
    "id": "PL-0194",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "정명숙 골키퍼 가능?"
   },
   {
    "id": "PL-0195",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "최성호 10시 가능?"
   },
   {
    "id": "PL-0196",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "축구화 많다"
   },
   {
    "id": "PL-0197",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "정지훈 확인함?"
   },
   {
    "id": "PL-0198",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 주 일요일도 내일 함?"
   },
   {
    "id": "PL-0199",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "한소희 10시 가능?"
   },
   {
    "id": "PL-0200",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "물 바쁘다"
   },
   {
    "id": "PL-0201",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "10시에 학생회관 많다"
   },
   {
    "id": "PL-0202",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "러닝 기록"
   },
   {
    "id": "PL-0203",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "물 밀림"
   },
   {
    "id": "PL-0204",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "바로택시 고객센터 골키퍼 가능?"
   },
   {
    "id": "PL-0205",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 경기 확인함"
   },
   {
    "id": "PL-0206",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "점심 예약됨",
    "window": [
     11,
     14
    ]
   },
   {
    "id": "PL-0207",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "월요일 새벽 1시 확인함",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0208",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이번 주 화요일 8시 운동장"
   },
   {
    "id": "PL-0209",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 예약 확인함"
   },
   {
    "id": "PL-0210",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 바쁘다"
   },
   {
    "id": "PL-0211",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "일요일 새벽 1시 교대 조용하다",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0212",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "알바비 제출함"
   },
   {
    "id": "PL-0213",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "대타 많다"
   },
   {
    "id": "PL-0214",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "재고 미뤘음"
   },
   {
    "id": "PL-0215",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "택배 내일 함"
   },
   {
    "id": "PL-0216",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "박하늘 일요일 조용하다?"
   },
   {
    "id": "PL-0217",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "한서대 학교 행정실 일요일 많다?"
   },
   {
    "id": "PL-0218",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "9시 교대 비었음"
   },
   {
    "id": "PL-0219",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "새벽 2시 교대 밀림",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0220",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "냉장고 예약됨"
   },
   {
    "id": "PL-0221",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "일요일 바쁘다"
   },
   {
    "id": "PL-0222",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "일요일 10시 교대 괜찮다"
   },
   {
    "id": "PL-0223",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "박정우 많다?"
   },
   {
    "id": "PL-0224",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "진열 비었음"
   },
   {
    "id": "PL-0225",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "대타 밀림"
   },
   {
    "id": "PL-0226",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "계산대 비었음"
   },
   {
    "id": "PL-0227",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "박정우 목요일 예약됨?"
   },
   {
    "id": "PL-0228",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "마감 비었음"
   },
   {
    "id": "PL-0229",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "박하늘 시작도 못 함?"
   },
   {
    "id": "PL-0230",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "대타 확인함"
   },
   {
    "id": "PL-0231",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "택배 끝남"
   },
   {
    "id": "PL-0232",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "월요일 8시 교대 조용하다"
   },
   {
    "id": "PL-0233",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "폐기 예약됨"
   },
   {
    "id": "PL-0234",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "마감 바쁘다"
   },
   {
    "id": "PL-0235",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "계산대 미뤘음"
   },
   {
    "id": "PL-0236",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "비 온다던데 우산 챙겨"
   },
   {
    "id": "PL-0237",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "모임 갈 거야?"
   },
   {
    "id": "PL-0238",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "고마워"
   },
   {
    "id": "PL-0239",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "잘 자"
   },
   {
    "id": "PL-0240",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "야 뭐 해"
   },
   {
    "id": "PL-0241",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "내일 보자"
   },
   {
    "id": "PL-0242",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "오늘 고생했어"
   },
   {
    "id": "PL-0243",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "밥은 먹었어?"
   },
   {
    "id": "PL-0244",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "연락해"
   },
   {
    "id": "PL-0245",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "그럼 이따"
   },
   {
    "id": "PL-0246",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "망함"
   },
   {
    "id": "PL-0247",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "내일 봐"
   },
   {
    "id": "PL-0248",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "응"
   },
   {
    "id": "PL-0249",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "좋아"
   },
   {
    "id": "PL-0250",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "모의고사 어땠어"
   },
   {
    "id": "PL-0251",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "내일 연락해"
   },
   {
    "id": "PL-0252",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "나도 망함"
   },
   {
    "id": "PL-0253",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "학원 끝났어"
   },
   {
    "id": "PL-0254",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "꽃샘추위래"
   },
   {
    "id": "PL-0255",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "3시 어때"
   },
   {
    "id": "PL-0256",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "연락할게"
   },
   {
    "id": "PL-0257",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "성원동 분식"
   },
   {
    "id": "PL-0258",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "ㅋㅋㅋ"
   },
   {
    "id": "PL-0259",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "토요일 저녁 어때"
   },
   {
    "id": "PL-0260",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "확인했어"
   },
   {
    "id": "PL-0261",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "힘내"
   },
   {
    "id": "PL-0262",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "ㅇㅇ"
   },
   {
    "id": "PL-0263",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "ㅇㅋ"
   },
   {
    "id": "PL-0264",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "괜찮아"
   },
   {
    "id": "PL-0265",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "나 늦을 수도"
   },
   {
    "id": "PL-0266",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "다행이다"
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
    "text": "퇴근하고 연락해"
   },
   {
    "id": "PL-0269",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "오늘 손님 많았어"
   },
   {
    "id": "PL-0270",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "고생"
   },
   {
    "id": "PL-0271",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "그럼 버스"
   },
   {
    "id": "PL-0272",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "너도"
   },
   {
    "id": "PL-0273",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "조심히 와"
   },
   {
    "id": "PL-0274",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "아침 8시",
    "window": [
     6,
     9
    ]
   },
   {
    "id": "PL-0275",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "풋살방에 말할게"
   },
   {
    "id": "PL-0276",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "우리도 하자"
   },
   {
    "id": "PL-0277",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "너무 이르다"
   },
   {
    "id": "PL-0278",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "몇 시?"
   },
   {
    "id": "PL-0279",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "그럼 9시"
   },
   {
    "id": "PL-0280",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "오 좋다"
   },
   {
    "id": "PL-0281",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "그래"
   },
   {
    "id": "PL-0282",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 학식 뭐임",
    "window": [
     11,
     14
    ]
   },
   {
    "id": "PL-0283",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "이따 봐"
   },
   {
    "id": "PL-0284",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "돈까스래"
   },
   {
    "id": "PL-0285",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "지금 들어가 봐"
   },
   {
    "id": "PL-0286",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "됐다"
   },
   {
    "id": "PL-0287",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "수강신청 했어?"
   },
   {
    "id": "PL-0288",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "좋아 지금"
   },
   {
    "id": "PL-0289",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "잘 자 조금"
   },
   {
    "id": "PL-0290",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "나 늦으면 먼저 해"
   },
   {
    "id": "PL-0291",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "나 졸려 죽겠음"
   },
   {
    "id": "PL-0292",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "몇 시에"
   },
   {
    "id": "PL-0293",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "커피 사 갈게"
   },
   {
    "id": "PL-0294",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "내일 마저 하자"
   },
   {
    "id": "PL-0295",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "정문 앞 8시 50분"
   },
   {
    "id": "PL-0296",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "갈까"
   },
   {
    "id": "PL-0297",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "나중에 연락할게"
   },
   {
    "id": "PL-0298",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 몇 시까지 해?"
   },
   {
    "id": "PL-0299",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "도서관 10시"
   },
   {
    "id": "PL-0300",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "나 지금 갈게"
   },
   {
    "id": "PL-0301",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "같이 보자"
   },
   {
    "id": "PL-0302",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "ㅋㅋ"
   },
   {
    "id": "PL-0303",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "지금 가는 중"
   },
   {
    "id": "PL-0304",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "ㅋㅋㅋ 이따"
   },
   {
    "id": "PL-0305",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "좋아 내일"
   },
   {
    "id": "PL-0306",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "자료 공유할게"
   },
   {
    "id": "PL-0307",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "도서관에서"
   },
   {
    "id": "PL-0308",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "나 조금 늦어"
   },
   {
    "id": "PL-0309",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지야"
   },
   {
    "id": "PL-0310",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 모임 몇 시?"
   },
   {
    "id": "PL-0311",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "3조 발표 준비 어디까지 했어?"
   },
   {
    "id": "PL-0312",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "알고 있어"
   },
   {
    "id": "PL-0313",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "PPT 하는 중"
   },
   {
    "id": "PL-0314",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "포스터 만들었어"
   },
   {
    "id": "PL-0315",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "상영회 준비"
   },
   {
    "id": "PL-0316",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "새벽까지 할 듯",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0317",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "2시"
   },
   {
    "id": "PL-0318",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "편집 언제 끝나?"
   },
   {
    "id": "PL-0319",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "고생했어"
   },
   {
    "id": "PL-0320",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "장비 챙겼어?"
   },
   {
    "id": "PL-0321",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "그건 재현이가"
   },
   {
    "id": "PL-0322",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "상영회 언제?"
   },
   {
    "id": "PL-0323",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "오늘 끝낼 수 있어?"
   },
   {
    "id": "PL-0324",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "촬영 장비 챙겼어?"
   },
   {
    "id": "PL-0325",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "조명도?"
   },
   {
    "id": "PL-0326",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "기대된다"
   },
   {
    "id": "PL-0327",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "다음 주"
   },
   {
    "id": "PL-0328",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "응 내일"
   },
   {
    "id": "PL-0329",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "나중에 연락할게 내일"
   },
   {
    "id": "PL-0330",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "이번 주 대타 가능?"
   },
   {
    "id": "PL-0331",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "가능해"
   },
   {
    "id": "PL-0332",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "콜"
   },
   {
    "id": "PL-0333",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "금요일 밤"
   },
   {
    "id": "PL-0334",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "손님 많았지"
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
    "text": "바빴어"
   },
   {
    "id": "PL-0337",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "떡볶이"
   },
   {
    "id": "PL-0338",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "선생님도 건강하세요"
   },
   {
    "id": "PL-0339",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "학교 근처 지나가면 들러"
   },
   {
    "id": "PL-0340",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "졸업 후에도 연락해"
   },
   {
    "id": "PL-0341",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "힘내라"
   },
   {
    "id": "PL-0342",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "또 연락드릴게요"
   },
   {
    "id": "PL-0343",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "안녕히 계세요"
   },
   {
    "id": "PL-0344",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "내일 보자 조금"
   },
   {
    "id": "PL-0345",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "지금 가는 중 내일"
   },
   {
    "id": "PL-0346",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "minseo.kim님이 새 게시물을 올렸습니다"
   },
   {
    "id": "PL-0347",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "seongwon.cafe님이 새 게시물을 올렸습니다"
   },
   {
    "id": "PL-0348",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "football.talk님이 새 게시물을 올렸습니다"
   },
   {
    "id": "PL-0349",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "meme.box님이 새 게시물을 올렸습니다"
   },
   {
    "id": "PL-0350",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "run.daily님이 스토리를 올렸습니다"
   },
   {
    "id": "PL-0351",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "biz.hanseo님이 새 공지를 올렸습니다"
   },
   {
    "id": "PL-0352",
    "app": "mail",
    "appName": "메일",
    "circle": "앱",
    "text": "한서대학교: 3월 학사 일정 안내"
   },
   {
    "id": "PL-0353",
    "app": "mail",
    "appName": "메일",
    "circle": "앱",
    "text": "한서대학교: 수강 정정 기간 안내"
   },
   {
    "id": "PL-0354",
    "app": "mail",
    "appName": "메일",
    "circle": "앱",
    "text": "가상몰: 주문하신 상품이 배송 완료되었습니다"
   },
   {
    "id": "PL-0355",
    "app": "portal",
    "appName": "한서 포털",
    "circle": "앱",
    "text": "3/18 과제 마감 알림"
   },
   {
    "id": "PL-0356",
    "app": "portal",
    "appName": "한서 포털",
    "circle": "앱",
    "text": "수강 정정 기간이 곧 끝납니다"
   },
   {
    "id": "PL-0357",
    "app": "weather",
    "appName": "날씨",
    "circle": "앱",
    "text": "06:30 오늘 성원동 날씨: 맑음, 최고 9°"
   },
   {
    "id": "PL-0358",
    "app": "market",
    "appName": "이웃마켓",
    "circle": "앱",
    "text": "키워드 알림: 모니터"
   },
   {
    "id": "PL-0359",
    "app": "market",
    "appName": "이웃마켓",
    "circle": "앱",
    "text": "키워드 알림: 축구화"
   },
   {
    "id": "PL-0360",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 전에 제출 완료하자",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0361",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 마감이니까 오늘 끝내자",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0362",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지 남은 건 발표 연습뿐",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0363",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 놓치면 진짜 큰일 난다",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0364",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지 PPT 최종 확인",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0365",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 전에 자료 링크 정리",
    "window": [
     21,
     24
    ]
   }
  ],
  "total": 365,
  "byRoom": {
   "talk.biz26": 70,
   "talk.hs32": 55,
   "talk.team3": 51,
   "talk.futsal": 40,
   "talk.alba": 25,
   "talk.dm.01": 10,
   "talk.dm.02": 10,
   "talk.dm.03": 8,
   "talk.dm.04": 10,
   "talk.dm.05": 8,
   "talk.dm.06": 8,
   "talk.dm.07": 8,
   "talk.dm.08": 8,
   "talk.dm.09": 8,
   "talk.dm.10": 8,
   "talk.dm.11": 8,
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
