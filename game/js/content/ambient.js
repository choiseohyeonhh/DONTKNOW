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
 *  people[]       : 연락처 64명. 3.11의 {id,name,circle,talk,loop,tone} + relation, talkFriend, contact,
 *                   canon(캐논 인물 4명), background(캐논이 아닌 배경 인물).
 *  rooms[]        : 3.11의 {id,name,members,history,muted} + type, circle, count, memberCount, withSelf?.
 *                   members는 이름이 있는 참여자만 나열하고, count/memberCount는 3.9.2의 방 인원이다.
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
   "name": "배지훈",
   "circle": "성원고 동창",
   "relation": "고3 반 친구 · 축구",
   "talk": true,
   "talkFriend": true,
   "contact": true,
   "canon": false,
   "background": true,
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
   "name": "박상철",
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
     "body": "수강 정정 생각보다 괜찮음",
     "at": "2026-01-05T11:29:16+09:00",
     "day": "1/5",
     "time": "11:29"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "오늘 라면 먹을 사람",
     "at": "2026-01-05T16:06:35+09:00",
     "day": "1/5",
     "time": "16:06"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "12시에 중앙도서관 갈 사람?",
     "at": "2026-01-06T01:35:54+09:00",
     "day": "1/6",
     "time": "01:35"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "과방 자리 있어?",
     "at": "2026-01-06T14:51:32+09:00",
     "day": "1/6",
     "time": "14:51"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "오늘 짜장밥 먹을 사람",
     "at": "2026-01-07T00:59:59+09:00",
     "day": "1/7",
     "time": "00:59"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "조은찬아 잘 지내?",
     "at": "2026-01-07T16:27:59+09:00",
     "day": "1/7",
     "time": "16:27"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "발표 비었음",
     "at": "2026-01-07T22:38:40+09:00",
     "day": "1/7",
     "time": "22:38"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "9시에 성원동 분식에서 볼 사람?",
     "at": "2026-01-08T16:22:02+09:00",
     "day": "1/8",
     "time": "16:22"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "MT 준비물 뭐 챙겨?",
     "at": "2026-01-08T19:21:39+09:00",
     "day": "1/8",
     "time": "19:21"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "화요일에 축제 한대",
     "at": "2026-01-08T20:04:10+09:00",
     "day": "1/8",
     "time": "20:04"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "오늘 우동 먹을 사람",
     "at": "2026-01-08T22:40:20+09:00",
     "day": "1/8",
     "time": "22:40"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "수강신청 성공",
     "at": "2026-01-09T08:27:17+09:00",
     "day": "1/9",
     "time": "08:27"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "박정호 하는 중?",
     "at": "2026-01-09T10:53:55+09:00",
     "day": "1/9",
     "time": "10:53"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "과제 하는 중",
     "at": "2026-01-11T12:24:56+09:00",
     "day": "1/11",
     "time": "12:24"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "10시에 학생회관 갈 사람?",
     "at": "2026-01-11T15:37:57+09:00",
     "day": "1/11",
     "time": "15:37"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "과제 끝남",
     "at": "2026-01-13T04:07:32+09:00",
     "day": "1/13",
     "time": "04:07"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "김상욱 바쁘다?",
     "at": "2026-01-13T09:09:59+09:00",
     "day": "1/13",
     "time": "09:09"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "과방 비었음",
     "at": "2026-01-14T04:08:08+09:00",
     "day": "1/14",
     "time": "04:08"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "과제 준비물 뭐 챙겨?",
     "at": "2026-01-14T05:25:43+09:00",
     "day": "1/14",
     "time": "05:25"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "목요일 개강 바쁘다",
     "at": "2026-01-15T13:32:12+09:00",
     "day": "1/15",
     "time": "13:32"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "축제 많다",
     "at": "2026-01-15T13:39:06+09:00",
     "day": "1/15",
     "time": "13:39"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "10시까지 성원동 카페 갈 수 있어?",
     "at": "2026-01-15T23:39:49+09:00",
     "day": "1/15",
     "time": "23:39"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "수강신청 포기함",
     "at": "2026-01-16T13:12:11+09:00",
     "day": "1/16",
     "time": "13:12"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "오늘 성원동 카페 사람 많아?",
     "at": "2026-01-17T03:28:31+09:00",
     "day": "1/17",
     "time": "03:28"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "목요일 개강총회 미뤘음",
     "at": "2026-01-17T21:35:16+09:00",
     "day": "1/17",
     "time": "21:35"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "월요일에 수강 정정 한대",
     "at": "2026-01-18T02:02:40+09:00",
     "day": "1/18",
     "time": "02:02"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "월요일에 개강 한대",
     "at": "2026-01-18T20:39:08+09:00",
     "day": "1/18",
     "time": "20:39"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "정명숙 괜찮다?",
     "at": "2026-01-19T13:42:45+09:00",
     "day": "1/19",
     "time": "13:42"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "오늘 치킨마요 먹을 사람",
     "at": "2026-01-20T13:17:12+09:00",
     "day": "1/20",
     "time": "13:17"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "밤 11시까지 중앙도서관 갈 수 있어?",
     "at": "2026-01-20T15:39:01+09:00",
     "day": "1/20",
     "time": "15:39"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "MT 조용하다",
     "at": "2026-01-21T08:45:37+09:00",
     "day": "1/21",
     "time": "08:45"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "과방 예약됨",
     "at": "2026-01-21T20:46:59+09:00",
     "day": "1/21",
     "time": "20:46"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "튀김 먹고 과방 갈래?",
     "at": "2026-01-22T00:43:42+09:00",
     "day": "1/22",
     "time": "00:43"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "OT 망함",
     "at": "2026-01-22T00:48:10+09:00",
     "day": "1/22",
     "time": "00:48"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "컴퓨터활용 교수님 예약됨",
     "at": "2026-01-22T07:00:33+09:00",
     "day": "1/22",
     "time": "07:00"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "화요일 개강 거의 다 함",
     "at": "2026-01-24T01:30:02+09:00",
     "day": "1/24",
     "time": "01:30"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "오늘 김치찌개 먹을 사람",
     "at": "2026-01-24T10:29:29+09:00",
     "day": "1/24",
     "time": "10:29"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "경제학원론 교수님 예약됨",
     "at": "2026-01-27T11:29:10+09:00",
     "day": "1/27",
     "time": "11:29"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "회계원리 교수님 끝남",
     "at": "2026-01-28T08:42:30+09:00",
     "day": "1/28",
     "time": "08:42"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "중간고사 준비물 뭐 챙겨?",
     "at": "2026-01-28T16:08:30+09:00",
     "day": "1/28",
     "time": "16:08"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "과제 괜찮다",
     "at": "2026-01-28T19:01:30+09:00",
     "day": "1/28",
     "time": "19:01"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "배지훈 거의 다 함?",
     "at": "2026-01-29T18:08:50+09:00",
     "day": "1/29",
     "time": "18:08"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "김밥 먹고 중앙도서관 갈래?",
     "at": "2026-01-30T01:23:49+09:00",
     "day": "1/30",
     "time": "01:23"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "최준 제출함?",
     "at": "2026-01-30T11:00:12+09:00",
     "day": "1/30",
     "time": "11:00"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "컴퓨터활용 집중 안 됨",
     "at": "2026-01-30T22:14:36+09:00",
     "day": "1/30",
     "time": "22:14"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "단톡 바쁘다",
     "at": "2026-02-01T02:22:04+09:00",
     "day": "2/1",
     "time": "02:22"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "비라서 코트 못 감",
     "at": "2026-02-03T01:02:08+09:00",
     "day": "2/3",
     "time": "01:02"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "밤 11시에 학생회관 갈 사람?",
     "at": "2026-02-03T15:35:56+09:00",
     "day": "2/3",
     "time": "15:35"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "오늘 불고기덮밥 먹을 사람",
     "at": "2026-02-05T03:43:10+09:00",
     "day": "2/5",
     "time": "03:43"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "새벽 2시까지 중앙도서관 갈 수 있어?",
     "at": "2026-02-05T21:49:33+09:00",
     "day": "2/5",
     "time": "21:49"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "내일 오전 수업 있는 사람?",
     "at": "2026-02-06T06:32:05+09:00",
     "day": "2/6",
     "time": "06:32"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "2시에 잔디밭에서 볼 사람?",
     "at": "2026-02-06T11:38:31+09:00",
     "day": "2/6",
     "time": "11:38"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "OT 생각보다 괜찮음",
     "at": "2026-02-07T03:03:28+09:00",
     "day": "2/7",
     "time": "03:03"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "오늘 중앙도서관 사람 많아?",
     "at": "2026-02-07T04:33:16+09:00",
     "day": "2/7",
     "time": "04:33"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "내일 야간 수업 있는 사람?",
     "at": "2026-02-08T00:05:03+09:00",
     "day": "2/8",
     "time": "00:05"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "동아리 끝남",
     "at": "2026-02-08T11:35:11+09:00",
     "day": "2/8",
     "time": "11:35"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "과제 많다",
     "at": "2026-02-09T19:10:59+09:00",
     "day": "2/9",
     "time": "19:10"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "과방 바쁘다",
     "at": "2026-02-09T22:23:41+09:00",
     "day": "2/9",
     "time": "22:23"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "월요일 중간고사 예약됨",
     "at": "2026-02-10T01:28:37+09:00",
     "day": "2/10",
     "time": "01:28"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "꽃샘추위라서 옷 못 정함",
     "at": "2026-02-10T15:11:18+09:00",
     "day": "2/10",
     "time": "15:11"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "8시에 성원동 카페 갈 사람?",
     "at": "2026-02-11T17:30:48+09:00",
     "day": "2/11",
     "time": "17:30"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "우동 먹고 성원동 분식 갈래?",
     "at": "2026-02-12T03:14:38+09:00",
     "day": "2/12",
     "time": "03:14"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "통계학 교수님 바쁘다",
     "at": "2026-02-12T06:00:53+09:00",
     "day": "2/12",
     "time": "06:00"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "한소희 밀림?",
     "at": "2026-02-12T14:35:09+09:00",
     "day": "2/12",
     "time": "14:35"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "수요일 OT 많다",
     "at": "2026-02-14T06:01:02+09:00",
     "day": "2/14",
     "time": "06:01"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "수강신청 망함",
     "at": "2026-02-14T07:55:38+09:00",
     "day": "2/14",
     "time": "07:55"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "중앙도서관 자리 있어?",
     "at": "2026-02-15T03:42:23+09:00",
     "day": "2/15",
     "time": "03:42"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "2시에 잔디밭 갈 사람?",
     "at": "2026-02-15T06:53:50+09:00",
     "day": "2/15",
     "time": "06:53"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "과방 제출함",
     "at": "2026-02-15T16:51:35+09:00",
     "day": "2/15",
     "time": "16:51"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "최준아 밥 먹었어?",
     "at": "2026-02-16T21:28:30+09:00",
     "day": "2/16",
     "time": "21:28"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "박정우아 잘 지내?",
     "at": "2026-02-17T10:29:45+09:00",
     "day": "2/17",
     "time": "10:29"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "토요일 발표 바쁘다",
     "at": "2026-02-17T15:59:18+09:00",
     "day": "2/17",
     "time": "15:59"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "오늘 과방 사람 많아?",
     "at": "2026-02-17T17:48:39+09:00",
     "day": "2/17",
     "time": "17:48"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "학생회관 자리 있어?",
     "at": "2026-02-18T01:31:06+09:00",
     "day": "2/18",
     "time": "01:31"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "단톡 미뤘음",
     "at": "2026-02-19T11:39:49+09:00",
     "day": "2/19",
     "time": "11:39"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "경제학원론 어렵다",
     "at": "2026-02-22T22:46:57+09:00",
     "day": "2/22",
     "time": "22:46"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "꽃샘추위라서 패딩 다시 꺼냄",
     "at": "2026-02-23T10:28:05+09:00",
     "day": "2/23",
     "time": "10:28"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "라면 먹고 성원동 카페 갈래?",
     "at": "2026-02-24T14:19:58+09:00",
     "day": "2/24",
     "time": "14:19"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "바람라서 실내에만 있음",
     "at": "2026-02-24T14:23:34+09:00",
     "day": "2/24",
     "time": "14:23"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "내일 2교시 있는 사람?",
     "at": "2026-02-24T21:36:48+09:00",
     "day": "2/24",
     "time": "21:36"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "떡볶이 시킬까?",
     "at": "2026-02-26T15:18:57+09:00",
     "day": "2/26",
     "time": "15:18"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "회계원리 집중 안 됨",
     "at": "2026-02-27T01:49:54+09:00",
     "day": "2/27",
     "time": "01:49"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "오늘 성원동 분식 사람 많아?",
     "at": "2026-02-27T20:06:46+09:00",
     "day": "2/27",
     "time": "20:06"
    },
    {
     "dir": "in",
     "sender": "조은찬",
     "body": "카레라이스 시킬까?",
     "at": "2026-02-28T02:56:30+09:00",
     "day": "2/28",
     "time": "02:56"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "축제 준비물 뭐 챙겨?",
     "at": "2026-02-28T17:54:18+09:00",
     "day": "2/28",
     "time": "17:54"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "이강훈 과제 갔어?",
     "at": "2026-02-28T22:50:27+09:00",
     "day": "2/28",
     "time": "22:50"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "단톡 많다",
     "at": "2026-03-01T09:24:17+09:00",
     "day": "3/1",
     "time": "09:24"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "떡볶이 먹고 학생회관 갈래?",
     "at": "2026-03-01T11:32:58+09:00",
     "day": "3/1",
     "time": "11:32"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "마케팅원론 끝났다",
     "at": "2026-03-02T02:18:38+09:00",
     "day": "3/2",
     "time": "02:18"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "개강총회 준비물 뭐 챙겨?",
     "at": "2026-03-02T03:19:13+09:00",
     "day": "3/2",
     "time": "03:19"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "영어 끝났다",
     "at": "2026-03-02T21:40:37+09:00",
     "day": "3/2",
     "time": "21:40"
    },
    {
     "dir": "in",
     "sender": "오채린",
     "body": "제육볶음 먹고 성원동 분식 갈래?",
     "at": "2026-03-03T00:29:03+09:00",
     "day": "3/3",
     "time": "00:29"
    },
    {
     "dir": "in",
     "sender": "배수현",
     "body": "대학글쓰기 교수님 괜찮다",
     "at": "2026-03-03T04:03:02+09:00",
     "day": "3/3",
     "time": "04:03"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "오늘 학생회관 사람 많아?",
     "at": "2026-03-03T17:24:52+09:00",
     "day": "3/3",
     "time": "17:24"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "10시에 중앙도서관 갈 사람?",
     "at": "2026-03-04T00:59:17+09:00",
     "day": "3/4",
     "time": "00:59"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "과제 미뤘음",
     "at": "2026-03-04T13:25:46+09:00",
     "day": "3/4",
     "time": "13:25"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "수강 정정 성공",
     "at": "2026-03-05T21:36:27+09:00",
     "day": "3/5",
     "time": "21:36"
    },
    {
     "dir": "in",
     "sender": "서은비",
     "body": "새벽 1시에 학생회관에서 볼 사람?",
     "at": "2026-03-05T21:42:14+09:00",
     "day": "3/5",
     "time": "21:42"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "남기훈아 뭐 해?",
     "at": "2026-03-08T20:24:24+09:00",
     "day": "3/8",
     "time": "20:24"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "개강 미뤘음",
     "at": "2026-03-10T09:57:55+09:00",
     "day": "3/10",
     "time": "09:57"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "잔디밭 자리 있어?",
     "at": "2026-03-10T16:27:34+09:00",
     "day": "3/10",
     "time": "16:27"
    },
    {
     "dir": "in",
     "sender": "문지원",
     "body": "돈까스 시킬까?",
     "at": "2026-03-11T23:59:44+09:00",
     "day": "3/11",
     "time": "23:59"
    },
    {
     "dir": "in",
     "sender": "한도윤",
     "body": "금요일 MT 확인함",
     "at": "2026-03-13T03:53:34+09:00",
     "day": "3/13",
     "time": "03:53"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "밤 11시까지 과방 갈 수 있어?",
     "at": "2026-03-13T16:02:00+09:00",
     "day": "3/13",
     "time": "16:02"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "9시에 성원동 분식 갈 사람?",
     "at": "2026-03-13T19:41:43+09:00",
     "day": "3/13",
     "time": "19:41"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "수강 정정 준비물 뭐 챙겨?",
     "at": "2026-03-13T20:31:08+09:00",
     "day": "3/13",
     "time": "20:31"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "개강총회 미뤘음",
     "at": "2026-03-14T04:02:06+09:00",
     "day": "3/14",
     "time": "04:02"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "발표 준비물 뭐 챙겨?",
     "at": "2026-03-14T07:32:32+09:00",
     "day": "3/14",
     "time": "07:32"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "경제학원론 배고프다",
     "at": "2026-03-14T11:13:01+09:00",
     "day": "3/14",
     "time": "11:13"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "오늘 잔디밭 사람 많아?",
     "at": "2026-03-14T15:49:43+09:00",
     "day": "3/14",
     "time": "15:49"
    },
    {
     "dir": "in",
     "sender": "강태호",
     "body": "내일 1교시 있는 사람?",
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
     "sender": "정지훈",
     "body": "오채린은 밥 먹었어?",
     "at": "2025-11-03T01:38:22+09:00",
     "day": "11/3",
     "time": "01:38"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "회계원리 바쁘다",
     "at": "2025-11-03T11:27:39+09:00",
     "day": "11/3",
     "time": "11:27"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "비라서 실내에만 있음",
     "at": "2025-11-04T10:42:27+09:00",
     "day": "11/4",
     "time": "10:42"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "장소연은 뭐 해?",
     "at": "2025-11-06T22:57:41+09:00",
     "day": "11/6",
     "time": "22:57"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "다음 주 야자 바쁘다",
     "at": "2025-11-07T03:34:02+09:00",
     "day": "11/7",
     "time": "03:34"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "다음 주 야자 하는 중",
     "at": "2025-11-07T12:13:54+09:00",
     "day": "11/7",
     "time": "12:13"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "10시에 학원 끝나",
     "at": "2025-11-09T21:22:14+09:00",
     "day": "11/9",
     "time": "21:22"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "10시에 학원 앞에서 보자",
     "at": "2025-11-13T02:36:28+09:00",
     "day": "11/13",
     "time": "02:36"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "입대 D-1",
     "at": "2025-11-15T02:33:34+09:00",
     "day": "11/15",
     "time": "02:33"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "다음 주 학원 비었음",
     "at": "2025-11-16T04:40:44+09:00",
     "day": "11/16",
     "time": "04:40"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "오늘 컴퓨터활용 집중 안 됨",
     "at": "2025-11-18T06:45:37+09:00",
     "day": "11/18",
     "time": "06:45"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "윤재민 요즘 뭐 해?",
     "at": "2025-11-19T07:23:33+09:00",
     "day": "11/19",
     "time": "07:23"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "햇살 망했다",
     "at": "2025-11-20T20:21:18+09:00",
     "day": "11/20",
     "time": "20:21"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "학원 선방함",
     "at": "2025-11-23T23:36:28+09:00",
     "day": "11/23",
     "time": "23:36"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "송민호은 시간 돼?",
     "at": "2025-11-24T11:50:59+09:00",
     "day": "11/24",
     "time": "11:50"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "우동 먹고 갈래?",
     "at": "2025-11-27T11:32:24+09:00",
     "day": "11/27",
     "time": "11:32"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "수시 선방함",
     "at": "2025-11-27T18:23:27+09:00",
     "day": "11/27",
     "time": "18:23"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "고3 때 독서실 자주 갔지",
     "at": "2025-12-03T07:47:23+09:00",
     "day": "12/3",
     "time": "07:47"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "다음 주 알바 하는 중",
     "at": "2025-12-03T22:51:00+09:00",
     "day": "12/3",
     "time": "22:51"
    },
    {
     "dir": "in",
     "sender": "정지훈",
     "body": "윤서진은 몇 시야?",
     "at": "2025-12-04T00:07:38+09:00",
     "day": "12/4",
     "time": "00:07"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "알바 12시 예약됨",
     "at": "2025-12-04T21:16:11+09:00",
     "day": "12/4",
     "time": "21:16"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "마케팅원론 밀림",
     "at": "2025-12-07T04:04:18+09:00",
     "day": "12/7",
     "time": "04:04"
    },
    {
     "dir": "in",
     "sender": "최유빈",
     "body": "학원 바쁘다",
     "at": "2025-12-08T03:37:33+09:00",
     "day": "12/8",
     "time": "03:37"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "성원구 청년센터은 잘 지내?",
     "at": "2025-12-08T11:04:23+09:00",
     "day": "12/8",
     "time": "11:04"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "주말 모임 준비 내일 함",
     "at": "2025-12-08T22:09:38+09:00",
     "day": "12/8",
     "time": "22:09"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "토요일 동창 모임 어때?",
     "at": "2025-12-13T23:55:18+09:00",
     "day": "12/13",
     "time": "23:55"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "학원 준비 예약됨",
     "at": "2025-12-15T09:50:18+09:00",
     "day": "12/15",
     "time": "09:50"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "성원구 청년센터아 어디야?",
     "at": "2025-12-15T19:01:26+09:00",
     "day": "12/15",
     "time": "19:01"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "조현우은 수업 들었어?",
     "at": "2025-12-15T21:09:00+09:00",
     "day": "12/15",
     "time": "21:09"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "알바 6시 조용하다",
     "at": "2025-12-18T13:05:09+09:00",
     "day": "12/18",
     "time": "13:05"
    },
    {
     "dir": "in",
     "sender": "이준서",
     "body": "통계학 거의 다 함",
     "at": "2025-12-23T02:50:18+09:00",
     "day": "12/23",
     "time": "02:50"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "비라서 옷 못 정함",
     "at": "2025-12-23T09:49:15+09:00",
     "day": "12/23",
     "time": "09:49"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "알바 10시 확인함",
     "at": "2025-12-24T05:34:45+09:00",
     "day": "12/24",
     "time": "05:34"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "다음 주 수시 내일 함",
     "at": "2025-12-24T14:42:59+09:00",
     "day": "12/24",
     "time": "14:42"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "입대 한 달 남음",
     "at": "2025-12-24T23:10:17+09:00",
     "day": "12/24",
     "time": "23:10"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "수시 제출함",
     "at": "2025-12-26T21:54:49+09:00",
     "day": "12/26",
     "time": "21:54"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "입대 준비 하는 중",
     "at": "2025-12-30T02:42:37+09:00",
     "day": "12/30",
     "time": "02:42"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "토요일 야자 어때?",
     "at": "2025-12-31T22:09:23+09:00",
     "day": "12/31",
     "time": "22:09"
    },
    {
     "dir": "in",
     "sender": "정지훈",
     "body": "미세먼지 끝났다",
     "at": "2026-01-02T01:11:23+09:00",
     "day": "1/2",
     "time": "01:11"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "한소희 요즘 뭐 해?",
     "at": "2026-01-03T14:47:57+09:00",
     "day": "1/3",
     "time": "14:47"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "이현수은 수업 들었어?",
     "at": "2026-01-05T19:42:02+09:00",
     "day": "1/5",
     "time": "19:42"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "모의고사 선방함",
     "at": "2026-01-08T08:10:27+09:00",
     "day": "1/8",
     "time": "08:10"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "2시에 학원 끝나",
     "at": "2026-01-09T12:01:29+09:00",
     "day": "1/9",
     "time": "12:01"
    },
    {
     "dir": "in",
     "sender": "정지훈",
     "body": "이유나은 뭐 해?",
     "at": "2026-01-10T03:37:05+09:00",
     "day": "1/10",
     "time": "03:37"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "모의고사 성공",
     "at": "2026-01-13T11:26:04+09:00",
     "day": "1/13",
     "time": "11:26"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "미세먼지 좋다",
     "at": "2026-01-16T05:52:30+09:00",
     "day": "1/16",
     "time": "05:52"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "다음 주 입대 거의 다 함",
     "at": "2026-01-16T22:53:15+09:00",
     "day": "1/16",
     "time": "22:53"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "오늘 회계원리 졸리다",
     "at": "2026-01-17T15:01:42+09:00",
     "day": "1/17",
     "time": "15:01"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "동네 성원동 골목 바쁘다",
     "at": "2026-01-18T20:56:52+09:00",
     "day": "1/18",
     "time": "20:56"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "새벽 1시 독서실 제출함",
     "at": "2026-01-19T03:25:46+09:00",
     "day": "1/19",
     "time": "03:25"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "돈까스 먹고 갈래?",
     "at": "2026-01-19T04:50:07+09:00",
     "day": "1/19",
     "time": "04:50"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "알바 10시 바쁘다",
     "at": "2026-01-22T11:00:04+09:00",
     "day": "1/22",
     "time": "11:00"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "떡볶이 좋다",
     "at": "2026-01-24T16:29:35+09:00",
     "day": "1/24",
     "time": "16:29"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "동네 성원천 확인함",
     "at": "2026-01-27T10:47:48+09:00",
     "day": "1/27",
     "time": "10:47"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "목요일에 독서실 갈 사람",
     "at": "2026-01-30T04:03:23+09:00",
     "day": "1/30",
     "time": "04:03"
    },
    {
     "dir": "in",
     "sender": "장소연",
     "body": "학원 비었음",
     "at": "2026-01-31T19:15:24+09:00",
     "day": "1/31",
     "time": "19:15"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "입대 곧",
     "at": "2026-01-31T22:34:15+09:00",
     "day": "1/31",
     "time": "22:34"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "영어 확인함",
     "at": "2026-02-03T23:04:11+09:00",
     "day": "2/3",
     "time": "23:04"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "동창 모임 준비 예약됨",
     "at": "2026-02-08T23:50:34+09:00",
     "day": "2/8",
     "time": "23:50"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "미세먼지라서 옷 못 정함",
     "at": "2026-02-12T10:50:01+09:00",
     "day": "2/12",
     "time": "10:50"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "입대 3주 남음",
     "at": "2026-02-19T18:35:23+09:00",
     "day": "2/19",
     "time": "18:35"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "9시 성원천 제출함",
     "at": "2026-02-22T14:30:56+09:00",
     "day": "2/22",
     "time": "14:30"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "김민서 요즘 뭐 해?",
     "at": "2026-02-25T16:35:54+09:00",
     "day": "2/25",
     "time": "16:35"
    },
    {
     "dir": "in",
     "sender": "정지훈",
     "body": "정지훈 요즘 뭐 해?",
     "at": "2026-02-27T15:30:42+09:00",
     "day": "2/27",
     "time": "15:30"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "모의고사 생각보다 괜찮음",
     "at": "2026-02-28T02:49:13+09:00",
     "day": "2/28",
     "time": "02:49"
    },
    {
     "dir": "in",
     "sender": "신건우",
     "body": "고3 때 학원 앞 자주 갔지",
     "at": "2026-03-02T08:37:52+09:00",
     "day": "3/2",
     "time": "08:37"
    },
    {
     "dir": "in",
     "sender": "박세라",
     "body": "흐림 살았다",
     "at": "2026-03-04T15:45:03+09:00",
     "day": "3/4",
     "time": "15:45"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "모의고사 다 찍음",
     "at": "2026-03-04T18:18:01+09:00",
     "day": "3/4",
     "time": "18:18"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "오늘 영어 배고프다",
     "at": "2026-03-04T20:10:22+09:00",
     "day": "3/4",
     "time": "20:10"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "입대 다음 주",
     "at": "2026-03-06T01:26:09+09:00",
     "day": "3/6",
     "time": "01:26"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "수시 성공",
     "at": "2026-03-07T11:43:26+09:00",
     "day": "3/7",
     "time": "11:43"
    },
    {
     "dir": "in",
     "sender": "정지훈",
     "body": "6시에 학원 앞에서 보자",
     "at": "2026-03-07T17:00:47+09:00",
     "day": "3/7",
     "time": "17:00"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "정해성 요즘 뭐 해?",
     "at": "2026-03-10T06:17:16+09:00",
     "day": "3/10",
     "time": "06:17"
    },
    {
     "dir": "in",
     "sender": "고나영",
     "body": "짜장밥 바쁘다",
     "at": "2026-03-10T12:56:59+09:00",
     "day": "3/10",
     "time": "12:56"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "우동 망했다",
     "at": "2026-03-12T19:54:00+09:00",
     "day": "3/12",
     "time": "19:54"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "12시에 학원 끝나",
     "at": "2026-03-12T23:27:41+09:00",
     "day": "3/12",
     "time": "23:27"
    },
    {
     "dir": "in",
     "sender": "정지훈",
     "body": "토요일에 성원동 카페 갈 사람",
     "at": "2026-03-13T14:42:04+09:00",
     "day": "3/13",
     "time": "14:42"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "동창 모임 밀림",
     "at": "2026-03-13T21:07:31+09:00",
     "day": "3/13",
     "time": "21:07"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "최준은 잘 지내?",
     "at": "2026-03-14T03:39:30+09:00",
     "day": "3/14",
     "time": "03:39"
    },
    {
     "dir": "in",
     "sender": "한지수",
     "body": "경영원론 미뤘음",
     "at": "2026-03-15T01:25:44+09:00",
     "day": "3/15",
     "time": "01:25"
    },
    {
     "dir": "in",
     "sender": "김도훈",
     "body": "다들 자냐",
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
     "sender": "이유나",
     "body": "발표 결론 끝냄",
     "at": "2026-03-02T06:35:40+09:00",
     "day": "3/2",
     "time": "06:35"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "발표는 성원구 보건소가 맡기로 했지?",
     "at": "2026-03-02T14:09:23+09:00",
     "day": "3/2",
     "time": "14:09"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "3/18 23:59까지 PPT 만들기",
     "at": "2026-03-02T21:47:09+09:00",
     "day": "3/2",
     "time": "21:47"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "3/18 23:59 마감 놓치지 말자",
     "at": "2026-03-03T07:17:39+09:00",
     "day": "3/3",
     "time": "07:17"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "최민규 볼 수 있어?",
     "at": "2026-03-04T05:03:02+09:00",
     "day": "3/4",
     "time": "05:03"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "자료 찾는 중",
     "at": "2026-03-04T08:44:45+09:00",
     "day": "3/4",
     "time": "08:44"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "오늘 8시에 중앙도서관에서 모여",
     "at": "2026-03-04T10:49:49+09:00",
     "day": "3/4",
     "time": "10:49"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "사례 자료 정리함",
     "at": "2026-03-04T15:10:54+09:00",
     "day": "3/4",
     "time": "15:10"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "사례는 한서대 도서관가 맡기로 했지?",
     "at": "2026-03-04T17:12:45+09:00",
     "day": "3/4",
     "time": "17:12"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "3/18 23:59 마감 확인",
     "at": "2026-03-05T07:00:14+09:00",
     "day": "3/5",
     "time": "07:00"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "사례는 장소연가 맡기로 했지?",
     "at": "2026-03-05T21:49:34+09:00",
     "day": "3/5",
     "time": "21:49"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "마감 D-1",
     "at": "2026-03-06T00:44:53+09:00",
     "day": "3/6",
     "time": "00:44"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "보고서 작성 연습함",
     "at": "2026-03-06T11:31:06+09:00",
     "day": "3/6",
     "time": "11:31"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "3/18 새벽 1시까지 발표 연습",
     "at": "2026-03-06T12:38:36+09:00",
     "day": "3/6",
     "time": "12:38"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "박정호 확인했어?",
     "at": "2026-03-07T09:37:46+09:00",
     "day": "3/7",
     "time": "09:37"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "10시에 학생회관 어때?",
     "at": "2026-03-07T10:01:11+09:00",
     "day": "3/7",
     "time": "10:01"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "제출 내일",
     "at": "2026-03-08T02:07:32+09:00",
     "day": "3/8",
     "time": "02:07"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "사례는 배수현가 맡기로 했지?",
     "at": "2026-03-08T02:29:13+09:00",
     "day": "3/8",
     "time": "02:29"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "3/18 23:59까지 보고서 작성",
     "at": "2026-03-08T06:48:45+09:00",
     "day": "3/8",
     "time": "06:48"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "최성호 볼 수 있어?",
     "at": "2026-03-08T11:15:46+09:00",
     "day": "3/8",
     "time": "11:15"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "김도경 했어?",
     "at": "2026-03-08T15:04:44+09:00",
     "day": "3/8",
     "time": "15:04"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "3/18 23:59까지 발표 연습",
     "at": "2026-03-09T10:14:12+09:00",
     "day": "3/9",
     "time": "10:14"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "사례는 윤서진가 맡기로 했지?",
     "at": "2026-03-10T01:11:20+09:00",
     "day": "3/10",
     "time": "01:11"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "자료 확인 필요",
     "at": "2026-03-10T13:52:34+09:00",
     "day": "3/10",
     "time": "13:52"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "결론 자료 공유함",
     "at": "2026-03-11T14:46:00+09:00",
     "day": "3/11",
     "time": "14:46"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "내일 12시까지 가능?",
     "at": "2026-03-12T03:31:42+09:00",
     "day": "3/12",
     "time": "03:31"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "3/18 12시까지 발표 자료 정리",
     "at": "2026-03-12T06:32:46+09:00",
     "day": "3/12",
     "time": "06:32"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "자료 거의 다 모음",
     "at": "2026-03-12T11:19:19+09:00",
     "day": "3/12",
     "time": "11:19"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "한소희 볼 수 있어?",
     "at": "2026-03-12T11:25:44+09:00",
     "day": "3/12",
     "time": "11:25"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "오늘 9시에 성원동 분식에서 모여",
     "at": "2026-03-12T16:35:51+09:00",
     "day": "3/12",
     "time": "16:35"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "수아 볼 수 있어?",
     "at": "2026-03-12T19:44:54+09:00",
     "day": "3/12",
     "time": "19:44"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "3/18 23:59 전에 출처 정리",
     "at": "2026-03-13T01:01:38+09:00",
     "day": "3/13",
     "time": "01:01"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "내일 8시까지 가능?",
     "at": "2026-03-13T22:39:13+09:00",
     "day": "3/13",
     "time": "22:39"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "PPT 수정 중",
     "at": "2026-03-13T23:50:50+09:00",
     "day": "3/13",
     "time": "23:50"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "3/18 새벽 1시까지 발표 자료 정리",
     "at": "2026-03-14T00:20:52+09:00",
     "day": "3/14",
     "time": "00:20"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "PPT 만드는 중",
     "at": "2026-03-14T04:49:38+09:00",
     "day": "3/14",
     "time": "04:49"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "10시에 성원동 분식 어때?",
     "at": "2026-03-14T12:43:58+09:00",
     "day": "3/14",
     "time": "12:43"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "논문 찾는 중",
     "at": "2026-03-14T19:51:22+09:00",
     "day": "3/14",
     "time": "19:51"
    },
    {
     "dir": "in",
     "sender": "정시우",
     "body": "밤 11시에 중앙도서관 어때?",
     "at": "2026-03-14T23:06:04+09:00",
     "day": "3/14",
     "time": "23:06"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "12시에 중앙도서관 어때?",
     "at": "2026-03-15T03:25:29+09:00",
     "day": "3/15",
     "time": "03:25"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "3/18 23:59까지 제출 완료하자",
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
     "sender": "남기훈",
     "body": "경기 1-2",
     "at": "2025-09-02T02:17:57+09:00",
     "day": "9/2",
     "time": "02:17"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "다들 바쁘다?",
     "at": "2025-09-02T04:42:48+09:00",
     "day": "9/2",
     "time": "04:42"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "성원구 보건소 12시 가능?",
     "at": "2025-09-09T02:52:29+09:00",
     "day": "9/9",
     "time": "02:52"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "러닝 최고",
     "at": "2025-09-14T03:46:02+09:00",
     "day": "9/14",
     "time": "03:46"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "구장 예약 미뤘음",
     "at": "2025-09-14T22:52:40+09:00",
     "day": "9/14",
     "time": "22:52"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "축구화 밀림",
     "at": "2025-09-18T13:25:48+09:00",
     "day": "9/18",
     "time": "13:25"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "몸 끝남",
     "at": "2025-09-28T16:14:31+09:00",
     "day": "9/28",
     "time": "16:14"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "재현 골키퍼 가능?",
     "at": "2025-10-04T08:45:32+09:00",
     "day": "10/4",
     "time": "08:45"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "이수빈 괜찮다?",
     "at": "2025-10-06T05:53:50+09:00",
     "day": "10/6",
     "time": "05:53"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "러닝 재도전",
     "at": "2025-10-16T12:12:16+09:00",
     "day": "10/16",
     "time": "12:12"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "물 조용하다",
     "at": "2025-10-17T18:20:46+09:00",
     "day": "10/17",
     "time": "18:20"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "정다은 밤 11시 가능?",
     "at": "2025-10-27T04:35:25+09:00",
     "day": "10/27",
     "time": "04:35"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "미세먼지 예약됨",
     "at": "2025-10-31T02:32:12+09:00",
     "day": "10/31",
     "time": "02:32"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "다음 경기 확인함",
     "at": "2025-10-31T17:10:15+09:00",
     "day": "10/31",
     "time": "17:10"
    },
    {
     "dir": "in",
     "sender": "정해성",
     "body": "오채린 골키퍼 가능?",
     "at": "2025-11-02T16:35:19+09:00",
     "day": "11/2",
     "time": "16:35"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "러닝 포기",
     "at": "2025-11-03T21:08:37+09:00",
     "day": "11/3",
     "time": "21:08"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "오늘 8시 학생회관 끝남",
     "at": "2025-11-04T12:55:13+09:00",
     "day": "11/4",
     "time": "12:55"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "러닝 기록",
     "at": "2025-11-04T13:35:22+09:00",
     "day": "11/4",
     "time": "13:35"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "다들 밀림?",
     "at": "2025-11-06T09:32:29+09:00",
     "day": "11/6",
     "time": "09:32"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "비 괜찮다",
     "at": "2025-11-08T09:08:01+09:00",
     "day": "11/8",
     "time": "09:08"
    },
    {
     "dir": "in",
     "sender": "김상욱",
     "body": "이번 주 화요일 시작도 못 함",
     "at": "2025-11-16T11:20:32+09:00",
     "day": "11/16",
     "time": "11:20"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "이수빈 6시 가능?",
     "at": "2025-11-22T13:32:33+09:00",
     "day": "11/22",
     "time": "13:32"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "다들 예약됨?",
     "at": "2025-11-29T09:51:20+09:00",
     "day": "11/29",
     "time": "09:51"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "회비 2만 원",
     "at": "2025-11-30T19:35:42+09:00",
     "day": "11/30",
     "time": "19:35"
    },
    {
     "dir": "in",
     "sender": "김상욱",
     "body": "다음 경기 끝남",
     "at": "2025-12-03T03:13:08+09:00",
     "day": "12/3",
     "time": "03:13"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "최준 새벽 2시 가능?",
     "at": "2025-12-03T16:11:29+09:00",
     "day": "12/3",
     "time": "16:11"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "구장 시작도 못 함",
     "at": "2025-12-08T19:51:37+09:00",
     "day": "12/8",
     "time": "19:51"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "꽃샘추위라서 실내에만 있음",
     "at": "2025-12-17T04:10:18+09:00",
     "day": "12/17",
     "time": "04:10"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "다음 경기 조용하다",
     "at": "2025-12-17T08:34:38+09:00",
     "day": "12/17",
     "time": "08:34"
    },
    {
     "dir": "in",
     "sender": "김상욱",
     "body": "구장비 확인함",
     "at": "2025-12-23T03:25:40+09:00",
     "day": "12/23",
     "time": "03:25"
    },
    {
     "dir": "in",
     "sender": "김상욱",
     "body": "김도경 6시 가능?",
     "at": "2025-12-30T08:06:35+09:00",
     "day": "12/30",
     "time": "08:06"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "구장 하는 중",
     "at": "2026-01-08T11:05:21+09:00",
     "day": "1/8",
     "time": "11:05"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "10시에 중앙도서관 바쁘다",
     "at": "2026-01-08T14:21:00+09:00",
     "day": "1/8",
     "time": "14:21"
    },
    {
     "dir": "in",
     "sender": "김태식",
     "body": "점심 미뤘음",
     "at": "2026-01-08T14:42:40+09:00",
     "day": "1/8",
     "time": "14:42"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "김치찌개 먹고 10시에 모이자",
     "at": "2026-01-08T17:11:08+09:00",
     "day": "1/8",
     "time": "17:11"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "구장비 밀림",
     "at": "2026-01-18T11:31:39+09:00",
     "day": "1/18",
     "time": "11:31"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "다음 경기 밀림",
     "at": "2026-01-18T13:51:40+09:00",
     "day": "1/18",
     "time": "13:51"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "카레라이스 먹고 2시에 모이자",
     "at": "2026-01-18T20:38:51+09:00",
     "day": "1/18",
     "time": "20:38"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "꽃샘추위 많다",
     "at": "2026-01-19T01:57:22+09:00",
     "day": "1/19",
     "time": "01:57"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "구장 예약 하는 중",
     "at": "2026-01-20T02:16:05+09:00",
     "day": "1/20",
     "time": "02:16"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "구장비 미뤘음",
     "at": "2026-01-20T21:53:13+09:00",
     "day": "1/20",
     "time": "21:53"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "구장 예약 비었음",
     "at": "2026-01-21T15:53:59+09:00",
     "day": "1/21",
     "time": "15:53"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "회비 1만 원",
     "at": "2026-01-21T16:28:40+09:00",
     "day": "1/21",
     "time": "16:28"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "장소연 확인함?",
     "at": "2026-01-27T11:09:39+09:00",
     "day": "1/27",
     "time": "11:09"
    },
    {
     "dir": "in",
     "sender": "윤재민",
     "body": "오늘 9시 영상관 비었음",
     "at": "2026-01-28T07:21:09+09:00",
     "day": "1/28",
     "time": "07:21"
    },
    {
     "dir": "in",
     "sender": "최민규",
     "body": "이번 주 금요일 12시 학생회관",
     "at": "2026-01-31T16:19:51+09:00",
     "day": "1/31",
     "time": "16:19"
    },
    {
     "dir": "in",
     "sender": "박정우",
     "body": "바람 바쁘다",
     "at": "2026-02-02T20:16:55+09:00",
     "day": "2/2",
     "time": "20:16"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "이번 주 수요일 비었음",
     "at": "2026-02-09T06:01:10+09:00",
     "day": "2/9",
     "time": "06:01"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "경기 0-1",
     "at": "2026-02-20T17:27:20+09:00",
     "day": "2/20",
     "time": "17:27"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "몸 내일 함",
     "at": "2026-02-24T09:21:04+09:00",
     "day": "2/24",
     "time": "09:21"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "다음 주 화요일도 하는 중?",
     "at": "2026-02-26T15:13:20+09:00",
     "day": "2/26",
     "time": "15:13"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "점심 많다",
     "at": "2026-02-28T20:25:27+09:00",
     "day": "2/28",
     "time": "20:25"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "구장 확인함",
     "at": "2026-03-03T03:57:58+09:00",
     "day": "3/3",
     "time": "03:57"
    },
    {
     "dir": "in",
     "sender": "오세훈",
     "body": "토요일 10시 제출함",
     "at": "2026-03-06T20:58:28+09:00",
     "day": "3/6",
     "time": "20:58"
    },
    {
     "dir": "in",
     "sender": "남기훈",
     "body": "6시에 잔디밭 제출함",
     "at": "2026-03-08T07:08:35+09:00",
     "day": "3/8",
     "time": "07:08"
    },
    {
     "dir": "in",
     "sender": "이강훈",
     "body": "토요일 8시 맞지?",
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
     "sender": "박상철",
     "body": "점장님 바쁘다",
     "at": "2025-01-20T07:14:53+09:00",
     "day": "1/20",
     "time": "07:14"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "마감 제출함",
     "at": "2025-01-29T16:30:12+09:00",
     "day": "1/29",
     "time": "16:30"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "택배 제출함",
     "at": "2025-02-17T08:52:36+09:00",
     "day": "2/17",
     "time": "08:52"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "성원우체국 많다?",
     "at": "2025-03-04T19:28:19+09:00",
     "day": "3/4",
     "time": "19:28"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "일요일 새벽 1시 교대 시작도 못 함",
     "at": "2025-04-08T17:00:34+09:00",
     "day": "4/8",
     "time": "17:00"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "점장님 괜찮다",
     "at": "2025-04-13T00:55:20+09:00",
     "day": "4/13",
     "time": "00:55"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "오늘 하는 중",
     "at": "2025-04-13T21:45:45+09:00",
     "day": "4/13",
     "time": "21:45"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "재고 하는 중",
     "at": "2025-05-09T13:20:35+09:00",
     "day": "5/9",
     "time": "13:20"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "대타 많다",
     "at": "2025-06-11T01:43:16+09:00",
     "day": "6/11",
     "time": "01:43"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "마감 조용하다",
     "at": "2025-06-13T01:19:21+09:00",
     "day": "6/13",
     "time": "01:19"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "토요일 2시 교대 조용하다",
     "at": "2025-06-16T16:19:45+09:00",
     "day": "6/16",
     "time": "16:19"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "재고 미뤘음",
     "at": "2025-07-18T01:49:28+09:00",
     "day": "7/18",
     "time": "01:49"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "목요일 새벽 2시 교대 내일 함",
     "at": "2025-07-19T17:05:15+09:00",
     "day": "7/19",
     "time": "17:05"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "냉장고 확인함",
     "at": "2025-07-23T15:45:27+09:00",
     "day": "7/23",
     "time": "15:45"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "알바비 미뤘음",
     "at": "2025-07-25T16:37:08+09:00",
     "day": "7/25",
     "time": "16:37"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "진열 조용하다",
     "at": "2025-08-06T09:31:12+09:00",
     "day": "8/6",
     "time": "09:31"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "폐기 많다",
     "at": "2025-08-12T04:26:37+09:00",
     "day": "8/12",
     "time": "04:26"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "알바비 하는 중",
     "at": "2025-08-18T20:59:32+09:00",
     "day": "8/18",
     "time": "20:59"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "알바비 거의 다 함",
     "at": "2025-08-30T02:31:08+09:00",
     "day": "8/30",
     "time": "02:31"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "알바비 밀림",
     "at": "2025-08-30T16:16:38+09:00",
     "day": "8/30",
     "time": "16:16"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "오늘 거의 다 함",
     "at": "2025-09-11T20:26:05+09:00",
     "day": "9/11",
     "time": "20:26"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "알바비 예약됨",
     "at": "2025-09-16T21:20:38+09:00",
     "day": "9/16",
     "time": "21:20"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "재고 예약됨",
     "at": "2025-10-11T23:51:41+09:00",
     "day": "10/11",
     "time": "23:51"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "최준 화요일 미뤘음?",
     "at": "2025-11-04T20:17:08+09:00",
     "day": "11/4",
     "time": "20:17"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "진열 예약됨",
     "at": "2025-11-07T07:56:04+09:00",
     "day": "11/7",
     "time": "07:56"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "진열 많다",
     "at": "2025-11-09T15:48:21+09:00",
     "day": "11/9",
     "time": "15:48"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "냉장고 조용하다",
     "at": "2026-01-20T07:26:40+09:00",
     "day": "1/20",
     "time": "07:26"
    },
    {
     "dir": "in",
     "sender": "박상철",
     "body": "손님 괜찮다",
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
     "body": "고마워",
     "at": "2025-09-10T11:40:46+09:00",
     "day": "9/10",
     "time": "11:40"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "괜찮아 천천히 와",
     "at": "2025-09-16T04:49:40+09:00",
     "day": "9/16",
     "time": "04:49"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "나 늦을 것 같아",
     "at": "2025-09-28T18:58:57+09:00",
     "day": "9/28",
     "time": "18:58"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "ㅇㅇ",
     "at": "2025-09-30T14:26:42+09:00",
     "day": "9/30",
     "time": "14:26"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고생했어",
     "at": "2025-10-11T09:12:17+09:00",
     "day": "10/11",
     "time": "09:12"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "내일 보자",
     "at": "2025-11-13T15:01:45+09:00",
     "day": "11/13",
     "time": "15:01"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "모임 갈 거야?",
     "at": "2025-11-20T12:19:56+09:00",
     "day": "11/20",
     "time": "12:19"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "아직",
     "at": "2025-12-12T02:40:03+09:00",
     "day": "12/12",
     "time": "02:40"
    },
    {
     "dir": "in",
     "sender": "조현우",
     "body": "먹어야지",
     "at": "2026-01-12T17:11:43+09:00",
     "day": "1/12",
     "time": "17:11"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅇ",
     "at": "2026-01-26T08:24:10+09:00",
     "day": "1/26",
     "time": "08:24"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "괜찮아",
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
     "body": "내일 봐",
     "at": "2025-09-23T07:23:55+09:00",
     "day": "9/23",
     "time": "07:23"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "커피 한 잔?",
     "at": "2025-09-29T13:38:35+09:00",
     "day": "9/29",
     "time": "13:38"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "패딩 입어",
     "at": "2025-09-30T10:38:44+09:00",
     "day": "9/30",
     "time": "10:38"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "꽃샘추위래",
     "at": "2025-10-02T23:53:36+09:00",
     "day": "10/2",
     "time": "23:53"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "응",
     "at": "2025-10-20T02:06:00+09:00",
     "day": "10/20",
     "time": "02:06"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "잘 자",
     "at": "2025-12-09T14:13:32+09:00",
     "day": "12/9",
     "time": "14:13"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "오늘 너무 졸려",
     "at": "2025-12-16T00:21:59+09:00",
     "day": "12/16",
     "time": "00:21"
    },
    {
     "dir": "in",
     "sender": "윤서진",
     "body": "그럼 4시 30분",
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
     "body": "토요일 저녁 어때",
     "at": "2025-09-11T20:14:38+09:00",
     "day": "9/11",
     "time": "20:14"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "힘내",
     "at": "2025-09-17T17:49:26+09:00",
     "day": "9/17",
     "time": "17:49"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "연락할게",
     "at": "2025-09-19T21:30:49+09:00",
     "day": "9/19",
     "time": "21:30"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "나는 된다",
     "at": "2025-09-27T05:32:36+09:00",
     "day": "9/27",
     "time": "05:32"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "지금 가는 중",
     "at": "2025-10-03T18:01:46+09:00",
     "day": "10/3",
     "time": "18:01"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나중에 연락할게",
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
     "body": "좋아",
     "at": "2025-11-28T11:19:56+09:00",
     "day": "11/28",
     "time": "11:19"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "그래",
     "at": "2025-12-22T22:12:35+09:00",
     "day": "12/22",
     "time": "22:12"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "ㅋㅋㅋ",
     "at": "2026-02-06T08:14:30+09:00",
     "day": "2/6",
     "time": "08:14"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고생했어",
     "at": "2026-02-08T09:37:54+09:00",
     "day": "2/8",
     "time": "09:37"
    },
    {
     "dir": "in",
     "sender": "임동현",
     "body": "입대 날짜 나왔다",
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
     "body": "내일 보자",
     "at": "2025-10-02T14:32:02+09:00",
     "day": "10/2",
     "time": "14:32"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "퇴근하고 연락해",
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
     "body": "조금 늦어",
     "at": "2025-11-27T13:30:59+09:00",
     "day": "11/27",
     "time": "13:30"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "ㅇㅋ",
     "at": "2025-12-21T20:52:24+09:00",
     "day": "12/21",
     "time": "20:52"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오케이",
     "at": "2026-01-11T00:57:14+09:00",
     "day": "1/11",
     "time": "00:57"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "비 와서 그런가",
     "at": "2026-02-16T20:45:09+09:00",
     "day": "2/16",
     "time": "20:45"
    },
    {
     "dir": "in",
     "sender": "홍예슬",
     "body": "있어",
     "at": "2026-02-18T05:30:44+09:00",
     "day": "2/18",
     "time": "05:30"
    }
   ]
  },
  {
   "id": "talk.dm.05",
   "name": "배지훈",
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
     "sender": "배지훈",
     "body": "같이 신고 가자",
     "at": "2025-10-12T18:27:36+09:00",
     "day": "10/12",
     "time": "18:27"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "잘 자",
     "at": "2025-10-18T07:31:12+09:00",
     "day": "10/18",
     "time": "07:31"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "ㅇㅋ",
     "at": "2025-10-18T12:17:12+09:00",
     "day": "10/18",
     "time": "12:17"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "그럼 9시",
     "at": "2025-10-23T17:05:34+09:00",
     "day": "10/23",
     "time": "17:05"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "아침 8시",
     "at": "2025-11-14T02:24:24+09:00",
     "day": "11/14",
     "time": "02:24"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "이따 봐",
     "at": "2025-11-21T02:01:34+09:00",
     "day": "11/21",
     "time": "02:01"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고생했어",
     "at": "2025-12-20T19:23:56+09:00",
     "day": "12/20",
     "time": "19:23"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "봤어 미쳤지",
     "at": "2025-12-27T06:16:48+09:00",
     "day": "12/27",
     "time": "06:16"
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
     "body": "알겠어",
     "at": "2026-01-24T07:35:54+09:00",
     "day": "1/24",
     "time": "07:35"
    },
    {
     "dir": "in",
     "sender": "배지훈",
     "body": "좋아",
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
     "body": "ㅇㅋ",
     "at": "2025-10-04T17:40:51+09:00",
     "day": "10/4",
     "time": "17:40"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅇ",
     "at": "2025-10-10T10:16:03+09:00",
     "day": "10/10",
     "time": "10:16"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "12시에",
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
     "dir": "out",
     "sender": "나",
     "body": "응",
     "at": "2025-11-25T11:04:21+09:00",
     "day": "11/25",
     "time": "11:04"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "콜",
     "at": "2025-12-02T07:04:23+09:00",
     "day": "12/2",
     "time": "07:04"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "힘내",
     "at": "2025-12-08T05:25:46+09:00",
     "day": "12/8",
     "time": "05:25"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅇ",
     "at": "2025-12-17T04:31:06+09:00",
     "day": "12/17",
     "time": "04:31"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "콜",
     "at": "2026-01-08T15:29:12+09:00",
     "day": "1/8",
     "time": "15:29"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "수강신청 했어?",
     "at": "2026-01-28T16:15:53+09:00",
     "day": "1/28",
     "time": "16:15"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "ㅇㅇ",
     "at": "2026-02-05T13:04:48+09:00",
     "day": "2/5",
     "time": "13:04"
    },
    {
     "dir": "in",
     "sender": "김민서",
     "body": "빨리 해",
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
     "body": "응",
     "at": "2025-09-12T07:13:40+09:00",
     "day": "9/12",
     "time": "07:13"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "ㅇㅋ",
     "at": "2025-09-24T10:55:17+09:00",
     "day": "9/24",
     "time": "10:55"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "고마워",
     "at": "2025-11-07T00:06:41+09:00",
     "day": "11/7",
     "time": "00:06"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "조금 늦어",
     "at": "2025-11-07T13:00:44+09:00",
     "day": "11/7",
     "time": "13:00"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "내일 1교시 갈 거야?",
     "at": "2025-11-08T05:53:13+09:00",
     "day": "11/8",
     "time": "05:53"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅇ",
     "at": "2025-12-06T07:33:44+09:00",
     "day": "12/6",
     "time": "07:33"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "6시",
     "at": "2025-12-18T05:08:52+09:00",
     "day": "12/18",
     "time": "05:08"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "이따 봐",
     "at": "2026-01-19T08:34:38+09:00",
     "day": "1/19",
     "time": "08:34"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "나 졸려 죽겠음",
     "at": "2026-01-27T00:33:12+09:00",
     "day": "1/27",
     "time": "00:33"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "과방 갈래?",
     "at": "2026-02-08T09:31:15+09:00",
     "day": "2/8",
     "time": "09:31"
    },
    {
     "dir": "in",
     "sender": "최준",
     "body": "정문 앞 8시 50분",
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
     "body": "고마워",
     "at": "2025-10-23T03:14:02+09:00",
     "day": "10/23",
     "time": "03:14"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고생했어",
     "at": "2025-11-03T18:34:27+09:00",
     "day": "11/3",
     "time": "18:34"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오케이",
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
     "body": "좋아",
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
     "body": "오케이",
     "at": "2025-12-30T11:15:47+09:00",
     "day": "12/30",
     "time": "11:15"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "조금",
     "at": "2026-03-01T10:46:10+09:00",
     "day": "3/1",
     "time": "10:46"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "이따 봐",
     "at": "2026-03-05T00:54:03+09:00",
     "day": "3/5",
     "time": "00:54"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "같이 보자",
     "at": "2026-03-12T22:45:36+09:00",
     "day": "3/12",
     "time": "22:45"
    },
    {
     "dir": "in",
     "sender": "박하늘",
     "body": "도서관 앞",
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
     "body": "알고 있어",
     "at": "2025-09-16T22:00:03+09:00",
     "day": "9/16",
     "time": "22:00"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "PPT 하는 중",
     "at": "2025-09-29T05:26:56+09:00",
     "day": "9/29",
     "time": "05:26"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "고생했어",
     "at": "2025-10-09T23:52:00+09:00",
     "day": "10/9",
     "time": "23:52"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "확인했어",
     "at": "2025-11-01T09:59:25+09:00",
     "day": "11/1",
     "time": "09:59"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "이따 봐",
     "at": "2025-11-03T07:47:39+09:00",
     "day": "11/3",
     "time": "07:47"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "내일 보자",
     "at": "2025-11-04T05:13:10+09:00",
     "day": "11/4",
     "time": "05:13"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고마워",
     "at": "2025-11-09T00:59:07+09:00",
     "day": "11/9",
     "time": "00:59"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "좋아",
     "at": "2025-12-03T19:01:24+09:00",
     "day": "12/3",
     "time": "19:01"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "자료 공유할게",
     "at": "2025-12-07T12:16:25+09:00",
     "day": "12/7",
     "time": "12:16"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "잘 자",
     "at": "2025-12-28T07:09:48+09:00",
     "day": "12/28",
     "time": "07:09"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "발표는 내가",
     "at": "2026-02-07T08:50:06+09:00",
     "day": "2/7",
     "time": "08:50"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅇㅇ",
     "at": "2026-02-14T22:12:56+09:00",
     "day": "2/14",
     "time": "22:12"
    },
    {
     "dir": "in",
     "sender": "이유나",
     "body": "나 조금 늦어",
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
     "body": "ㅇㅇ",
     "at": "2025-09-12T15:31:25+09:00",
     "day": "9/12",
     "time": "15:31"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "포스터 만들었어",
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
     "body": "잘 자",
     "at": "2025-10-20T20:15:28+09:00",
     "day": "10/20",
     "time": "20:15"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고생했어",
     "at": "2025-10-26T05:26:10+09:00",
     "day": "10/26",
     "time": "05:26"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "잘 자",
     "at": "2025-10-26T11:10:58+09:00",
     "day": "10/26",
     "time": "11:10"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "이따 봐",
     "at": "2025-10-28T16:40:07+09:00",
     "day": "10/28",
     "time": "16:40"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오케이",
     "at": "2025-11-13T17:30:38+09:00",
     "day": "11/13",
     "time": "17:30"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "이따 봐",
     "at": "2025-12-22T02:08:24+09:00",
     "day": "12/22",
     "time": "02:08"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "그래",
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
     "body": "상영회 준비",
     "at": "2026-03-06T21:04:07+09:00",
     "day": "3/6",
     "time": "21:04"
    },
    {
     "dir": "in",
     "sender": "수아",
     "body": "조명도?",
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
     "body": "이따 봐",
     "at": "2025-10-22T03:03:58+09:00",
     "day": "10/22",
     "time": "03:03"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "좋아",
     "at": "2025-11-11T23:26:17+09:00",
     "day": "11/11",
     "time": "23:26"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "나중에 연락할게",
     "at": "2025-11-29T12:38:54+09:00",
     "day": "11/29",
     "time": "12:38"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "오늘 끝낼 수 있어?",
     "at": "2026-01-17T20:51:51+09:00",
     "day": "1/17",
     "time": "20:51"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "상영회 언제?",
     "at": "2026-01-23T00:35:38+09:00",
     "day": "1/23",
     "time": "00:35"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅋㅋㅋ",
     "at": "2026-02-05T07:36:10+09:00",
     "day": "2/5",
     "time": "07:36"
    },
    {
     "dir": "in",
     "sender": "재현",
     "body": "이따 봐",
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
     "body": "ㅇㅇ",
     "at": "2025-09-09T15:01:18+09:00",
     "day": "9/9",
     "time": "15:01"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "오늘 알바 어땠어?",
     "at": "2025-09-24T02:11:44+09:00",
     "day": "9/24",
     "time": "02:11"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "뭐 먹지",
     "at": "2025-09-29T10:47:32+09:00",
     "day": "9/29",
     "time": "10:47"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "가능해",
     "at": "2025-12-28T08:27:52+09:00",
     "day": "12/28",
     "time": "08:27"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "지금 가는 중",
     "at": "2026-01-12T03:58:37+09:00",
     "day": "1/12",
     "time": "03:58"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "퇴근하고 연락해",
     "at": "2026-01-25T05:26:59+09:00",
     "day": "1/25",
     "time": "05:26"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아",
     "at": "2026-02-14T23:36:44+09:00",
     "day": "2/14",
     "time": "23:36"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "수고",
     "at": "2026-02-28T01:40:42+09:00",
     "day": "2/28",
     "time": "01:40"
    },
    {
     "dir": "in",
     "sender": "이수빈",
     "body": "좋아",
     "at": "2026-03-05T06:47:32+09:00",
     "day": "3/5",
     "time": "06:47"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "고마워",
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
     "body": "조만간 뵙겠습니다",
     "at": "2025-09-21T01:13:49+09:00",
     "day": "9/21",
     "time": "01:13"
    },
    {
     "dir": "in",
     "sender": "송민호",
     "body": "요즘 어떻게 지내니",
     "at": "2025-09-23T13:11:09+09:00",
     "day": "9/23",
     "time": "13:11"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "ㅋㅋㅋ",
     "at": "2025-11-09T10:31:01+09:00",
     "day": "11/9",
     "time": "10:31"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "좋아",
     "at": "2025-11-17T01:04:00+09:00",
     "day": "11/17",
     "time": "01:04"
    },
    {
     "dir": "in",
     "sender": "송민호",
     "body": "선생님 안녕하세요",
     "at": "2025-12-04T15:25:50+09:00",
     "day": "12/4",
     "time": "15:25"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "조금 늦어",
     "at": "2025-12-08T23:27:24+09:00",
     "day": "12/8",
     "time": "23:27"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "괜찮아",
     "at": "2025-12-21T23:17:17+09:00",
     "day": "12/21",
     "time": "23:17"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "지금 가는 중",
     "at": "2025-12-29T17:22:07+09:00",
     "day": "12/29",
     "time": "17:22"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "지금 가는 중",
     "at": "2026-01-25T22:22:56+09:00",
     "day": "1/25",
     "time": "22:22"
    },
    {
     "dir": "out",
     "sender": "나",
     "body": "오케이",
     "at": "2026-02-27T16:19:06+09:00",
     "day": "2/27",
     "time": "16:19"
    },
    {
     "dir": "in",
     "sender": "송민호",
     "body": "그럴게요",
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
   "likes": 647,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2025-03-05T13:24:38.516650+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#러닝"
   ],
   "body": "밈 {meme_word}",
   "media": []
  },
  {
   "id": "LBP-0004",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2025-03-05T22:06:00+09:00",
   "likes": 16,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "caption": "친구들이랑 학원 앞",
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
   "id": "LBP-0005",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2025-03-06T14:56:00+09:00",
   "likes": 10,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-03-06T16:26:03.092401+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-03-06T17:16:11.838135+09:00",
     "body": "응원해"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구"
   ],
   "caption": "야자 끝나고 불고기덮밥",
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
   "body": "12시 예약",
   "media": []
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
    "#동네친구",
    "#알바"
   ],
   "body": "고3 동창 모임",
   "media": []
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
    "#성원동카페",
    "#봄",
    "#성원동맛집"
   ],
   "caption": "회원 마감",
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
    "#동네친구"
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
   "body": "게임 모임",
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
   "caption": "학생회관에서 점검",
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
   "body": "토요일 동창 모임",
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
   "caption": "영어 과제 모임",
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
   "likes": 23,
   "comments": [
    {
     "author": "donghyun.lim",
     "createdAt": "2025-04-07T19:45:27.338765+09:00",
     "body": "몇 시까지 해요?"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-04-07T21:08:08.020149+09:00",
     "body": "어디서 찍었어?"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2025-04-08T07:54:14.402752+09:00",
     "body": "그거 나도 봤어"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집"
   ],
   "caption": "오늘 새벽 1시까지",
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
    "#플리",
    "#밈"
   ],
   "body": "오늘 4-3",
   "media": []
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
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화",
    "#영상과",
    "#상영회"
   ],
   "body": "포스터 내일 함",
   "media": []
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
     "body": "나는 아직"
    },
    {
     "author": "game.loop",
     "createdAt": "2025-04-18T05:04:57.426210+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "body": "미세먼지 러닝",
   "media": []
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
     "body": "몇 시에?"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2025-04-19T17:26:11.221736+09:00",
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
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
   "id": "LBP-0021",
   "kind": "photo",
   "author": "chaerin.oh",
   "createdAt": "2025-04-22T22:10:00+09:00",
   "likes": 33,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2025-04-23T02:17:08.624166+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대"
   ],
   "caption": "학원 12시 끝",
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
    "#청년센터",
    "#총학생회"
   ],
   "caption": "오늘 학사 일정",
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
     "body": "상영회 기대"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-05-02T15:59:30.737758+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구",
    "#러닝"
   ],
   "caption": "농구 업데이트",
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
    "#입대",
    "#동네친구",
    "#꽃샘추위"
   ],
   "caption": "고3 때 자주 가던 독서실",
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
   "id": "LBP-0025",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2025-05-08T01:08:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2025-05-08T01:24:58.787796+09:00",
     "body": "알바 끝나고 봐"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2025-05-08T03:36:30.309363+09:00",
     "body": "몇 시에?"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-05-08T05:56:00.489264+09:00",
     "body": "아침부터 고생"
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
   "caption": "수시 {su_result}",
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
     "body": "그거 나도 봤어"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2025-05-13T18:54:22.925871+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#동네가게"
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
     "body": "역전 미쳤다"
    },
    {
     "author": "football.talk",
     "createdAt": "2025-05-20T08:48:38.445123+09:00",
     "body": "이거 어디야?"
    },
    {
     "author": "hoops.log",
     "createdAt": "2025-05-20T09:33:29.187073+09:00",
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임",
    "#밈",
    "#농구"
   ],
   "body": "음악 하이라이트",
   "media": []
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
    "#공지",
    "#한서대"
   ],
   "caption": "장학금 알림",
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
     "body": "3조 화이팅"
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
   "body": "동네 입대",
   "media": []
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
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터",
    "#한서대",
    "#총학생회"
   ],
   "body": "3/18 청년센터 행사",
   "media": []
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
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#동네가게",
    "#주말"
   ],
   "caption": "주말 소식",
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
   "place": "성원동 골목"
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
    "#입대",
    "#알바"
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
   "id": "LBP-0033",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2025-06-03T22:42:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2025-06-04T19:21:07.123785+09:00",
     "body": "꽃샘추위"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#동네친구"
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
   "id": "LBP-0034",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2025-06-06T00:00:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2025-06-06T07:39:21.756264+09:00",
     "body": "3조 화이팅"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2025-06-07T03:38:40.655063+09:00",
     "body": "역전 미쳤다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#재수"
   ],
   "body": "친구 알바",
   "media": []
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
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#재수"
   ],
   "caption": "입대 이번 달",
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
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과",
    "#단편영화",
    "#상영회"
   ],
   "caption": "영상과 회의",
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
    "#재수",
    "#꽃샘추위"
   ],
   "body": "동네 주말 모임",
   "media": []
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
     "body": "아침부터 고생"
    },
    {
     "author": "minseo.kim",
     "createdAt": "2025-06-26T10:05:17.591059+09:00",
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#재수",
    "#꽃샘추위"
   ],
   "body": "경영원론 재밌다",
   "media": []
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
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "body": "동창 학원",
   "media": []
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
     "body": "이 밈 뭐임"
    },
    {
     "author": "film.sua",
     "createdAt": "2025-06-29T14:05:16.057866+09:00",
     "body": "주말에 갈게"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지"
   ],
   "body": "동아리 공지",
   "media": []
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
    "#성원동맛집",
    "#봄",
    "#성원동카페"
   ],
   "body": "주말 오픈",
   "media": []
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
     "body": "회비 보냈어"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2025-07-11T12:52:42.717846+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#동네친구"
   ],
   "caption": "재수 끝났다",
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
   "id": "LBP-0043",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2025-07-15T23:06:00+09:00",
   "likes": 25,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2025-07-15T23:20:44.694574+09:00",
     "body": "나도 하고 싶다"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2025-07-15T23:56:14.241478+09:00",
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
   "body": "친구 주말 모임",
   "media": []
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
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리"
   ],
   "body": "성원동 카페 기록",
   "media": []
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
    "#동네친구",
    "#성원고",
    "#입대"
   ],
   "caption": "우동 먹음",
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
   "id": "LBP-0046",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2025-07-23T01:50:00+09:00",
   "likes": 176,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2025-07-23T01:56:32.288325+09:00",
     "body": "회비 보냈어"
    },
    {
     "author": "film.sua",
     "createdAt": "2025-07-23T04:50:16.351106+09:00",
     "body": "몇 시까지 해요?"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2025-07-23T10:38:51.020534+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#총학생회",
    "#한서대"
   ],
   "body": "중앙도서관 봄 행사",
   "media": []
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
     "body": "포스터 예쁘다"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2025-07-29T18:06:22.039237+09:00",
     "body": "나도 하고 싶다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#동네친구",
    "#성원고"
   ],
   "caption": "모의고사 끝남",
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
     "body": "5km 대단"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2025-07-29T10:13:52.219540+09:00",
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화"
   ],
   "caption": "필름 리뷰",
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
     "body": "커피 ㄱ?"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2025-08-12T15:37:28.604678+09:00",
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#꽃샘추위",
    "#입대"
   ],
   "body": "주말 알바",
   "media": []
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
    "#농구"
   ],
   "caption": "책 리뷰",
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
     "body": "이 밈 뭐임"
    },
    {
     "author": "meme.box",
     "createdAt": "2025-08-22T11:40:09.953098+09:00",
     "body": "이 밈 뭐임"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2025-08-22T18:57:01.861658+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "body": "동네 동창 모임",
   "media": []
  },
  {
   "id": "LBP-0052",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2025-08-22T01:41:00+09:00",
   "likes": 20,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#꽃샘추위"
   ],
   "caption": "야자 끝나고 짜장밥",
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
     "body": "오늘 학식 뭐임?"
    },
    {
     "author": "haneul.park",
     "createdAt": "2025-08-23T00:20:16.580897+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#편집",
    "#영상과"
   ],
   "caption": "학생회관에서 준비",
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
   "id": "LBP-0054",
   "kind": "photo",
   "author": "meme.box",
   "createdAt": "2025-08-23T07:18:00+09:00",
   "likes": 720,
   "comments": [
    {
     "author": "music.drawer",
     "createdAt": "2025-08-23T11:46:11.648979+09:00",
     "body": "맛있겠다"
    },
    {
     "author": "hoops.log",
     "createdAt": "2025-08-23T19:22:22.019293+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝"
   ],
   "caption": "밈 모임",
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
   "place": "성원동 카페"
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
     "body": "다음에 같이 가자"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2025-08-26T05:04:26.120189+09:00",
     "body": "주말에 갈게"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "body": "통계학 재밌다",
   "media": []
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
    "#러닝"
   ],
   "body": "3-2 경기",
   "media": []
  },
  {
   "id": "LBP-0057",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2025-09-04T01:27:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2025-09-04T01:54:45.009147+09:00",
     "body": "나도 갈래"
    },
    {
     "author": "jiwon.moon",
     "createdAt": "2025-09-04T09:46:25.741963+09:00",
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
   "id": "LBP-0058",
   "kind": "photo",
   "author": "run.daily",
   "createdAt": "2025-09-04T16:20:00+09:00",
   "likes": 118,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2025-09-04T20:38:45.783005+09:00",
     "body": "커피 ㄱ?"
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
   "caption": "바람 러닝",
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
    "#학생회"
   ],
   "caption": "캠퍼스 청년센터 행사",
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
   "place": "학생회관"
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
    "#입대",
    "#꽃샘추위",
    "#알바"
   ],
   "caption": "알바 9시 끝",
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
    "#상영회",
    "#영상과",
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
   "id": "LBP-0062",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2025-09-06T00:41:00+09:00",
   "likes": 58,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-09-06T04:36:19.472139+09:00",
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과"
   ],
   "caption": "영상관에서 마감",
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
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임"
   ],
   "body": "1-0 경기",
   "media": []
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
    "#동네친구",
    "#재수",
    "#성원고"
   ],
   "body": "입대 한 달 남음",
   "media": []
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
    "#동네가게"
   ],
   "caption": "새 프로그램 오픈",
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
    "#재수",
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
   "id": "LBP-0067",
   "kind": "text",
   "author": "gunwoo.shin",
   "createdAt": "2025-09-21T01:27:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2025-09-21T03:20:58.641287+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "minjae.bae",
     "createdAt": "2025-09-21T14:24:52.138646+09:00",
     "body": "몇 시에?"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2025-09-21T16:24:54.440066+09:00",
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
   ],
   "body": "김밥 끝났다",
   "media": []
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
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#성원동카페",
    "#주말"
   ],
   "body": "오늘 짜장밥",
   "media": []
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
     "body": "주말에 갈게"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "주말 야자",
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
    "#주말",
    "#성원동카페"
   ],
   "caption": "오늘 떡볶이",
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
    "#성원동맛집",
    "#봄",
    "#주말"
   ],
   "caption": "새로 생긴 성원동 골목",
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
   "place": "성원동 골목"
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
     "body": "역전 미쳤다"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2025-09-29T18:43:29.761182+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄",
    "#동네가게",
    "#성원동카페"
   ],
   "body": "성원동 카페 재료 준비",
   "media": []
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
     "body": "확인했어요"
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
   "body": "주말 모임",
   "media": []
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
     "body": "이거 어디야?"
    },
    {
     "author": "football.talk",
     "createdAt": "2025-09-30T10:32:16.304323+09:00",
     "body": "오늘 날씨 진짜"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#알바"
   ],
   "body": "재수 재밌다",
   "media": []
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
    "#성원고",
    "#알바"
   ],
   "caption": "재수 집중 안 됨",
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
   "id": "LBP-0077",
   "kind": "text",
   "author": "music.drawer",
   "createdAt": "2025-10-02T23:36:00+09:00",
   "likes": 171,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2025-10-03T20:52:49.887118+09:00",
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임"
   ],
   "body": "오늘의 밤 플리",
   "media": []
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
     "body": "몇 시에?"
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
   "caption": "스태프 점검",
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
    "#꽃샘추위"
   ],
   "caption": "알바 8시 끝",
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
    "#알바"
   ],
   "body": "통계학 집중 안 됨",
   "media": []
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
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#플리"
   ],
   "body": "2-1 경기",
   "media": []
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
    "#청년센터",
    "#학생회"
   ],
   "caption": "오늘 장학금",
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
   "place": "청년센터"
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
    "#총학생회"
   ],
   "caption": "캠퍼스 봄 행사",
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
   "place": "학생회관"
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
    "#동네친구",
    "#입대",
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
   "id": "LBP-0085",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2025-10-10T01:56:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2025-10-10T06:41:02.706276+09:00",
     "body": "나도 갈래"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2025-10-10T08:08:20.386868+09:00",
     "body": "편집 잘 됐다"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2025-10-10T14:11:29.008176+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#성원고",
    "#알바"
   ],
   "body": "학원 야자",
   "media": []
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
    "#꽃샘추위",
    "#동네친구"
   ],
   "body": "동창 수시",
   "media": []
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
    "#알바"
   ],
   "caption": "야자 끝나고 제육볶음",
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
   "id": "LBP-0088",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2025-10-16T21:56:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2025-10-17T01:40:39.442251+09:00",
     "body": "플리 저장"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2025-10-17T05:15:36.451881+09:00",
     "body": "도서관 자리 있어?"
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
   "body": "독서실 제출함",
   "media": []
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
     "body": "오늘 날씨 진짜"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2025-10-18T07:02:06.449527+09:00",
     "body": "응원해"
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
   "body": "김치찌개 망했다",
   "media": []
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
    "#꽃샘추위",
    "#알바",
    "#성원고"
   ],
   "body": "마케팅원론 집중 안 됨",
   "media": []
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
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임"
   ],
   "caption": "성원동 카페 모임",
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
   "id": "LBP-0092",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2025-10-21T00:22:00+09:00",
   "likes": 47,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2025-10-21T01:53:10.823457+09:00",
     "body": "최고"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회"
   ],
   "caption": "영상관에서 촬영",
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
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#영상과"
   ],
   "caption": "포스터 마감",
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
    "#축구",
    "#농구",
    "#게임"
   ],
   "body": "5km 재도전",
   "media": []
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
     "body": "도서관 자리 있어?"
    },
    {
     "author": "game.loop",
     "createdAt": "2025-10-25T16:06:42.563693+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "caption": "주말 풋살",
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
    "#주말"
   ],
   "caption": "성원동 세탁소 정리",
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
     "body": "헐"
    },
    {
     "author": "minjae.bae",
     "createdAt": "2025-10-30T07:34:58.208302+09:00",
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
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
   "id": "LBP-0098",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2025-10-31T23:42:00+09:00",
   "likes": 33,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2025-11-01T02:22:38.727753+09:00",
     "body": "좋다"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2025-11-01T11:12:50.956967+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대"
   ],
   "body": "성원동 골목 제출함",
   "media": []
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
     "body": "그거 나도 봤어"
    },
    {
     "author": "music.drawer",
     "createdAt": "2025-11-01T11:03:12.626359+09:00",
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈"
   ],
   "body": "게임 리뷰",
   "media": []
  },
  {
   "id": "LBP-0100",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2025-11-02T16:56:00+09:00",
   "likes": 54,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2025-11-02T20:53:45.099771+09:00",
     "body": "우와"
    },
    {
     "author": "donghyun.lim",
     "createdAt": "2025-11-02T23:06:09.158897+09:00",
     "body": "역전 미쳤다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "흐림 옷 못 정함",
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
     "body": "역전 미쳤다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#동네친구"
   ],
   "body": "치킨마요 망했다",
   "media": []
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
     "body": "확인했어요"
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
   "caption": "학생회관에서 연습",
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
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#입대"
   ],
   "body": "짜장밥 재밌다",
   "media": []
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
     "body": "몇 시까지 해요?"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2025-11-04T04:10:43.543601+09:00",
     "body": "발표 준비 화이팅"
    },
    {
     "author": "donghyun.lim",
     "createdAt": "2025-11-04T08:17:59.670167+09:00",
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페"
   ],
   "body": "주말 새 클래스",
   "media": []
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
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#총학생회"
   ],
   "caption": "캠퍼스 장학금",
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
    "#꽃샘추위",
    "#동네친구",
    "#재수"
   ],
   "caption": "성원동 카페에서 야자",
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
    "#동네친구"
   ],
   "body": "경제학원론 어렵다",
   "media": []
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
    "#성원동카페",
    "#봄"
   ],
   "body": "우동 {taste}",
   "media": []
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
     "body": "경기 봤어?"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2025-11-12T05:26:40.109449+09:00",
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#재수"
   ],
   "caption": "친구들이랑 성원동 분식",
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
    "#재수"
   ],
   "body": "고3 주말 모임",
   "media": []
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
     "body": "몇 시까지 해요?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝"
   ],
   "caption": "성원천 산책로 단축",
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
    "#단편영화"
   ],
   "body": "과제 제출함",
   "media": []
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
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#동네친구",
    "#성원고"
   ],
   "body": "동네 알바",
   "media": []
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
   "id": "LBP-0115",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2025-11-21T00:41:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2025-11-21T02:16:50.903711+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#재수",
    "#입대"
   ],
   "body": "김치찌개 집중 안 됨",
   "media": []
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
     "body": "나는 아직"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2025-11-23T04:55:06.443061+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#총학생회",
    "#한서대",
    "#학생회"
   ],
   "caption": "오늘 수강 정정",
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
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화"
   ],
   "caption": "편집 10시",
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
     "body": "5km 대단"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2025-11-25T06:59:48.007510+09:00",
     "body": "좋다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구"
   ],
   "body": "재수 배고프다",
   "media": []
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
     "body": "주말에 갈게"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2025-11-25T13:27:55.640608+09:00",
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#동네가게"
   ],
   "caption": "라면 맛보기",
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
     "body": "사진 예쁘다"
    },
    {
     "author": "meme.box",
     "createdAt": "2025-11-29T20:51:19.658175+09:00",
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
   "caption": "성원동 골목에서 모의고사",
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
   "id": "LBP-0121",
   "kind": "photo",
   "author": "soyeon.jang",
   "createdAt": "2025-12-01T01:28:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "haneul.park",
     "createdAt": "2025-12-01T02:52:56.125751+09:00",
     "body": "회비 보냈어"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2025-12-01T20:11:17.802055+09:00",
     "body": "나도 갈래"
    },
    {
     "author": "seojin.yoon",
     "createdAt": "2025-12-01T23:49:22.912393+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대"
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
   "id": "LBP-0122",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2025-12-01T12:32:00+09:00",
   "likes": 20,
   "comments": [
    {
     "author": "nayoung.ko",
     "createdAt": "2025-12-01T14:14:28.159626+09:00",
     "body": "커피 ㄱ?"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2025-12-02T10:20:25.984720+09:00",
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
   "caption": "재수 살았다",
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
   "likes": 352,
   "comments": [],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구",
    "#농구"
   ],
   "body": "축구 연습",
   "media": []
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
    "#플리",
    "#게임",
    "#러닝"
   ],
   "body": "성원천 운동장 경기",
   "media": []
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
    "#청년센터"
   ],
   "caption": "과제 마감 알림",
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
   "place": "중앙도서관"
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
    "#재수",
    "#성원고",
    "#입대"
   ],
   "body": "동창 주말 모임",
   "media": []
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
     "body": "좋다"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2025-12-03T11:26:28.599215+09:00",
     "body": "농구 다음에"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
   ],
   "body": "입대 D-1",
   "media": []
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
    "#동네가게",
    "#봄",
    "#주말"
   ],
   "caption": "수선 예약",
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
    "#학생회",
    "#총학생회"
   ],
   "caption": "장학금 안내",
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
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#동네친구",
    "#재수"
   ],
   "body": "고3 학원",
   "media": []
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
    "#봄"
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
   "place": "성원동 골목"
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
    "#동네친구",
    "#입대",
    "#성원고"
   ],
   "caption": "입대 다음 주",
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
     "body": "ㅋㅋㅋ"
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
   "caption": "오늘 밤 11시까지",
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
     "body": "부럽다"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2025-12-12T20:12:59.743884+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#재수"
   ],
   "caption": "라면 먹음",
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
   "author": "minjae.bae",
   "createdAt": "2025-12-12T22:20:00+09:00",
   "likes": 51,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#재수"
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
   "id": "LBP-0136",
   "kind": "photo",
   "author": "bunsik.house",
   "createdAt": "2025-12-13T23:37:00+09:00",
   "likes": 50,
   "comments": [
    {
     "author": "music.drawer",
     "createdAt": "2025-12-14T16:30:16.340788+09:00",
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말",
    "#성원동카페",
    "#동네가게"
   ],
   "caption": "새로 나온 라면",
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
    "#농구",
    "#축구"
   ],
   "body": "출근 플리 추천",
   "media": []
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
     "body": "커피 ㄱ?"
    },
    {
     "author": "game.loop",
     "createdAt": "2025-12-15T17:26:39.325991+09:00",
     "body": "알바 끝나고 봐"
    },
    {
     "author": "cut.jaehyun",
     "createdAt": "2025-12-15T20:04:28.650337+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#단편영화",
    "#촬영"
   ],
   "caption": "스태프 회의",
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
   "id": "LBP-0139",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2025-12-15T22:38:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2025-12-16T01:15:00.683148+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#알바",
    "#동네친구"
   ],
   "body": "화요일 야자",
   "media": []
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
    "#상영회",
    "#단편영화"
   ],
   "caption": "포스터 촬영",
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
    "#동네친구",
    "#입대"
   ],
   "body": "동창 야자",
   "media": []
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
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구"
   ],
   "body": "새 게임 리뷰",
   "media": []
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
    "#플리"
   ],
   "body": "성원동 카페 업데이트",
   "media": []
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
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#알바",
    "#입대"
   ],
   "caption": "동네 성원천",
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
     "body": "아침부터 고생"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2025-12-24T19:14:16.580323+09:00",
     "body": "주말에 갈게"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#재수"
   ],
   "caption": "학원 8시 끝",
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
    "#성원고",
    "#동네친구"
   ],
   "caption": "고3 때 자주 가던 학원 앞",
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
    "#한서대"
   ],
   "body": "학사 일정 안내",
   "media": []
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
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회",
    "#단편영화",
    "#편집"
   ],
   "body": "조명 시작도 못 함",
   "media": []
  },
  {
   "id": "LBP-0149",
   "kind": "photo",
   "author": "gunwoo.shin",
   "createdAt": "2025-12-30T21:36:00+09:00",
   "likes": 21,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2025-12-31T00:23:58.628141+09:00",
     "body": "꽃샘추위"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2025-12-31T11:09:18.282224+09:00",
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#재수",
    "#꽃샘추위"
   ],
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
   "id": "LBP-0150",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2025-12-31T09:11:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2025-12-31T15:59:05.493014+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
   ],
   "caption": "모의고사 생각보다 괜찮음",
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
   "id": "LBP-0151",
   "kind": "photo",
   "author": "film.sua",
   "createdAt": "2026-01-01T16:30:00+09:00",
   "likes": 72,
   "comments": [
    {
     "author": "siwoo.jung",
     "createdAt": "2026-01-02T03:21:12.936450+09:00",
     "body": "헐"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#촬영",
    "#단편영화"
   ],
   "caption": "촬영 회의",
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
     "body": "나도 하고 싶다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#플리"
   ],
   "caption": "오늘 연습",
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
     "body": "확인했어요"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2026-01-03T14:34:06.320503+09:00",
     "body": "오늘 학식 뭐임?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
   ],
   "body": "독서실 시작도 못 함",
   "media": []
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
     "body": "나도 갈래"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#입대"
   ],
   "caption": "재수 졸리다",
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
   "id": "LBP-0155",
   "kind": "text",
   "author": "hanseo.student",
   "createdAt": "2026-01-04T23:20:00+09:00",
   "likes": 419,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-01-05T01:49:28.871407+09:00",
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대"
   ],
   "body": "수강 정정 안내",
   "media": []
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
     "body": "오늘 날씨 진짜"
    },
    {
     "author": "game.loop",
     "createdAt": "2026-01-05T14:43:38.434794+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#농구"
   ],
   "body": "음악 리뷰",
   "media": []
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
     "body": "ㅇㅇ"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집"
   ],
   "caption": "스태프 촬영",
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
    "#학생회",
    "#청년센터",
    "#총학생회"
   ],
   "caption": "모임 안내",
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
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#성원고",
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
   "id": "LBP-0160",
   "kind": "text",
   "author": "chaerin.oh",
   "createdAt": "2026-01-09T21:58:00+09:00",
   "likes": 64,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-01-10T17:48:53.638487+09:00",
     "body": "우와"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-01-10T21:48:11.704320+09:00",
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#동네친구"
   ],
   "body": "알바 10시 밀림",
   "media": []
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
    "#봄",
    "#성원동맛집"
   ],
   "caption": "카레라이스 준비 완료",
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
    "#촬영",
    "#편집"
   ],
   "caption": "편집 2시",
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
     "body": "아침부터 고생"
    },
    {
     "author": "lens.minho",
     "createdAt": "2026-01-10T10:46:29.418717+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
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
   "id": "LBP-0164",
   "kind": "text",
   "author": "run.daily",
   "createdAt": "2026-01-10T10:07:00+09:00",
   "likes": 127,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-01-10T14:10:12.668648+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리"
   ],
   "body": "햇살 러닝",
   "media": []
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
     "body": "나도 갈래"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-01-11T19:57:39.036247+09:00",
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#주말"
   ],
   "body": "주말 튀김",
   "media": []
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
     "body": "맛있겠다"
    },
    {
     "author": "hoops.log",
     "createdAt": "2026-01-12T01:26:20.000561+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#게임"
   ],
   "caption": "축구 하이라이트",
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
    "#재수",
    "#동네친구",
    "#알바"
   ],
   "body": "경제학원론 끝났다",
   "media": []
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
     "body": "경기 봤어?"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-01-12T06:09:28.530323+09:00",
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#성원고",
    "#알바"
   ],
   "body": "수요일 학원",
   "media": []
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
     "body": "나는 아직"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-01-13T10:22:52.450094+09:00",
     "body": "ㅇㅇ"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-01-13T12:13:20.873943+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리"
   ],
   "body": "오늘의 밈 {meme_word}",
   "media": []
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
     "body": "3조 화이팅"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2026-01-13T16:18:45.576835+09:00",
     "body": "아침부터 고생"
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
   "id": "LBP-0171",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-01-15T01:29:00+09:00",
   "likes": 26,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-01-15T07:57:38.036384+09:00",
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
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
   "id": "LBP-0172",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-01-15T14:05:00+09:00",
   "likes": 74,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-01-16T06:39:13.561701+09:00",
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#동네가게"
   ],
   "caption": "새 프로그램 정리",
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
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#게임",
    "#러닝"
   ],
   "body": "농구 경기",
   "media": []
  },
  {
   "id": "LBP-0174",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-01-17T22:06:00+09:00",
   "likes": 35,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-01-18T07:58:52.402328+09:00",
     "body": "봄 오냐"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2026-01-18T15:08:07.799791+09:00",
     "body": "3조 화이팅"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구"
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
   "id": "LBP-0175",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2026-01-17T23:35:00+09:00",
   "likes": 7,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-01-17T23:49:37.843175+09:00",
     "body": "회비 보냈어"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고"
   ],
   "caption": "성원천에서 주말 모임",
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
     "body": "회비 보냈어"
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
   "id": "LBP-0177",
   "kind": "photo",
   "author": "daily.seongwon",
   "createdAt": "2026-01-20T19:01:00+09:00",
   "likes": 109,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-01-20T21:44:31.813796+09:00",
     "body": "5km 대단"
    },
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-01-21T00:56:15.475312+09:00",
     "body": "역전 미쳤다"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-01-21T06:10:01.847997+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#봄"
   ],
   "caption": "주말 새 가게",
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
   "likes": 35,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2026-01-21T01:26:46.286223+09:00",
     "body": "응원해"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2026-01-21T07:28:20.597510+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-01-21T08:06:38.158984+09:00",
     "body": "3조 화이팅"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄",
    "#성원동맛집",
    "#성원동카페"
   ],
   "caption": "오늘 8시까지",
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
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#동네친구",
    "#알바"
   ],
   "caption": "성원동 골목에서 알바",
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
   "id": "LBP-0180",
   "kind": "text",
   "author": "soyeon.jang",
   "createdAt": "2026-01-21T19:43:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-01-21T20:13:33.970664+09:00",
     "body": "이번 주도?"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-01-21T22:50:46.341044+09:00",
     "body": "주말에 갈게"
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
   "body": "입대 3주 남음",
   "media": []
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
    "#밈",
    "#축구"
   ],
   "caption": "밈 업데이트",
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
    "#꽃샘추위"
   ],
   "body": "친구 학원",
   "media": []
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
     "body": "이 밈 뭐임"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-01-25T12:42:07.864702+09:00",
     "body": "꽃샘추위"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게",
    "#성원동맛집",
    "#성원동카페"
   ],
   "caption": "오늘 바람",
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
   "place": "성원동 골목"
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
    "#농구",
    "#게임"
   ],
   "body": "플리 하이라이트",
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
   "body": "영어 재밌다",
   "media": []
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
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집"
   ],
   "caption": "필름 연습",
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
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#입대",
    "#알바"
   ],
   "body": "고3 수시",
   "media": []
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
     "body": "몇 시까지 해요?"
    },
    {
     "author": "seojin.yoon",
     "createdAt": "2026-01-30T05:23:06.559440+09:00",
     "body": "상영회 기대"
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
   "caption": "독서실에서 동창 모임",
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
   "id": "LBP-0189",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-01-29T19:25:00+09:00",
   "likes": 30,
   "comments": [
    {
     "author": "daily.seongwon",
     "createdAt": "2026-01-30T08:56:49.810324+09:00",
     "body": "커피 ㄱ?"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2026-01-30T11:42:47.591665+09:00",
     "body": "확인했어요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#알바"
   ],
   "caption": "모의고사 포기함",
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
    "#알바"
   ],
   "body": "월요일 학원",
   "media": []
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
    "#단편영화",
    "#촬영"
   ],
   "body": "장비 촬영",
   "media": []
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
    "#개강",
    "#과제"
   ],
   "caption": "도서관 8시 야경",
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
    "#한서대",
    "#과제"
   ],
   "caption": "MT {detail}",
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
   "id": "LBP-0194",
   "kind": "photo",
   "author": "jun.choi",
   "createdAt": "2026-02-02T20:06:00+09:00",
   "likes": 19,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2026-02-02T23:18:16.904991+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강"
   ],
   "caption": "학생회관 오늘 분위기",
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
    "#수강신청"
   ],
   "body": "3교시 마케팅원론 집중 안 됨",
   "media": []
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
   "caption": "주말 짜장밥",
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
     "body": "3조 화이팅"
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
   "body": "맡기신 옷 오픈",
   "media": []
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
     "body": "역전 미쳤다"
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
   "caption": "단편 리뷰",
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
     "body": "오늘 날씨 진짜"
    },
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-02-05T15:38:58.288965+09:00",
     "body": "이 밈 뭐임"
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
   "body": "상영회 연습",
   "media": []
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
    "#개강"
   ],
   "body": "수강신청 끝남",
   "media": []
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
     "body": "맛있겠다"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-02-08T14:21:22.937743+09:00",
     "body": "발표 준비 화이팅"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터"
   ],
   "caption": "청년센터 행사 공지",
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
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#밈",
    "#게임"
   ],
   "body": "러닝 완료",
   "media": []
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
    "#봄",
    "#동네가게",
    "#성원동맛집"
   ],
   "caption": "성원동 카페 소식",
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
    "#재수",
    "#입대"
   ],
   "body": "독서실 거의 다 함",
   "media": []
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
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#수강신청",
    "#학식"
   ],
   "body": "동아리 수강 정정",
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
     "author": "hyunwoo.cho",
     "createdAt": "2026-02-09T23:35:01.998566+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#재수",
    "#알바"
   ],
   "body": "고3 입대",
   "media": []
  },
  {
   "id": "LBP-0207",
   "kind": "text",
   "author": "minjae.bae",
   "createdAt": "2026-02-10T00:33:00+09:00",
   "likes": 49,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-02-10T02:55:19.893695+09:00",
     "body": "오늘 학식 뭐임?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "body": "모의고사 선방함",
   "media": []
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
    "#총학생회"
   ],
   "body": "장학금 일정",
   "media": []
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
    "#학생회"
   ],
   "body": "한서대학교 동아리",
   "media": []
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
     "body": "회비 보냈어"
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
   "body": "독서실 하는 중",
   "media": []
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
    "#꽃샘추위"
   ],
   "caption": "미세먼지 코트 못 감",
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
   "id": "LBP-0212",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-02-11T23:19:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-11T23:46:37.501386+09:00",
     "body": "사진 예쁘다"
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
   "caption": "운동 프로그램",
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
    "#알바",
    "#입대"
   ],
   "body": "목요일 수시",
   "media": []
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
     "body": "확인했어요"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-02-12T03:55:08.025920+09:00",
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#플리",
    "#농구"
   ],
   "body": "오늘 3-2",
   "media": []
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
    "#밈",
    "#플리",
    "#축구"
   ],
   "caption": "농구 리뷰",
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
     "body": "오늘 학식 뭐임?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구",
    "#러닝"
   ],
   "body": "오늘 새 버전",
   "media": []
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
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영26",
    "#새내기",
    "#수강신청"
   ],
   "caption": "과제하다 2시",
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
    "#동네친구",
    "#성원고",
    "#재수"
   ],
   "body": "동네 학원",
   "media": []
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
    "#학생회"
   ],
   "body": "청년센터 행사 모집",
   "media": []
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
     "body": "ㅇㅇ"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-02-15T10:06:51.190715+09:00",
     "body": "오늘 날씨 진짜"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "야자 끝나고 카레라이스",
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
   "id": "LBP-0221",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2026-02-14T22:15:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-02-15T13:09:27.423690+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
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
   "id": "LBP-0222",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-02-15T18:15:00+09:00",
   "likes": 197,
   "comments": [
    {
     "author": "biz.hanseo",
     "createdAt": "2026-02-15T23:24:11.723980+09:00",
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리"
   ],
   "body": "성원동 카페 리뷰",
   "media": []
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
    "#과제",
    "#꽃샘추위",
    "#수강신청"
   ],
   "caption": "동아리 OT",
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
    "#꽃샘추위",
    "#알바"
   ],
   "body": "성원천 미뤘음",
   "media": []
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
    "#알바",
    "#동네친구"
   ],
   "caption": "학원 새벽 1시 끝",
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
    "#개강",
    "#학식"
   ],
   "caption": "과제하다 10시",
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
   "id": "LBP-0227",
   "kind": "text",
   "author": "hyunwoo.cho",
   "createdAt": "2026-02-16T01:35:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-16T22:52:10.126323+09:00",
     "body": "도서관 자리 있어?"
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
   "body": "알바 새벽 1시 내일 함",
   "media": []
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
     "body": "확인했어요"
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
   "body": "주말 축구",
   "media": []
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
     "body": "다음에 같이 가자"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2026-02-17T23:48:31.848848+09:00",
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "잔디밭 오늘 분위기",
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
   "body": "바람 촬영 미뤘음",
   "media": []
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
    "#개강",
    "#학식"
   ],
   "caption": "1교시 끝나고 잔디밭",
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
   "id": "LBP-0232",
   "kind": "photo",
   "author": "run.daily",
   "createdAt": "2026-02-19T00:48:00+09:00",
   "likes": 79,
   "comments": [
    {
     "author": "football.talk",
     "createdAt": "2026-02-19T01:45:25.528122+09:00",
     "body": "나도 하고 싶다"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-02-19T03:21:44.459448+09:00",
     "body": "아침부터 고생"
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
   "caption": "오늘 기록",
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
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과"
   ],
   "caption": "편집실에서 마무리",
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
    "#성원동카페",
    "#주말",
    "#동네가게"
   ],
   "body": "성원동 헬스장 휴무",
   "media": []
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
     "body": "그거 나도 봤어"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2026-02-21T04:16:06.827266+09:00",
     "body": "포스터 예쁘다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
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
     "body": "이번 주도?"
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
   "id": "LBP-0237",
   "kind": "photo",
   "author": "taeho.kang",
   "createdAt": "2026-02-20T23:58:00+09:00",
   "likes": 53,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-02-21T00:37:36.458094+09:00",
     "body": "이 밈 뭐임"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2026-02-21T05:15:19.358911+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강",
    "#학식"
   ],
   "caption": "우동 먹고 학생회관",
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
    "#한서대",
    "#공지",
    "#총학생회"
   ],
   "body": "장학금 모집",
   "media": []
  },
  {
   "id": "LBP-0239",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-02-21T01:26:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-02-21T01:39:06.188660+09:00",
     "body": "편집 잘 됐다"
    },
    {
     "author": "seojin.yoon",
     "createdAt": "2026-02-21T04:55:27.235361+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원고",
    "#재수",
    "#알바"
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
   "id": "LBP-0240",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-02-21T01:57:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-02-21T21:22:18.861022+09:00",
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#학식"
   ],
   "body": "동아리 개강총회",
   "media": []
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
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#주말"
   ],
   "body": "2시 축제",
   "media": []
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
     "body": "3조 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#농구"
   ],
   "caption": "농구 모임",
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
     "body": "나도 하고 싶다"
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
   "caption": "성원동 분식에서 입대",
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
    "#한서대",
    "#과제",
    "#개강"
   ],
   "caption": "학생회관에서 과제",
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
   "id": "LBP-0245",
   "kind": "text",
   "author": "game.loop",
   "createdAt": "2026-02-23T23:32:00+09:00",
   "likes": 329,
   "comments": [
    {
     "author": "hoops.log",
     "createdAt": "2026-02-23T23:59:07.079585+09:00",
     "body": "알바 끝나고 봐"
    },
    {
     "author": "football.talk",
     "createdAt": "2026-02-24T04:44:38.556721+09:00",
     "body": "그거 나도 봤어"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-02-24T12:23:45.125446+09:00",
     "body": "발표 준비 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#러닝"
   ],
   "body": "랭크 업데이트",
   "media": []
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
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네가게"
   ],
   "body": "성원동 세탁소 마감",
   "media": []
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
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#상영회"
   ],
   "caption": "경영원론 과제 마감",
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
    "#경영26"
   ],
   "caption": "수강신청 우산 챙김",
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
    "#학식",
    "#개강",
    "#수강신청"
   ],
   "body": "내일 오전 수업",
   "media": []
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
     "body": "회비 보냈어"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-02-26T09:38:08.260969+09:00",
     "body": "최고"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과",
    "#편집",
    "#상영회"
   ],
   "body": "편집 미뤘음",
   "media": []
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
     "body": "오늘 날씨 진짜"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대"
   ],
   "body": "3/18 장학금",
   "media": []
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
     "body": "헐"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-02-26T23:17:00.540734+09:00",
     "body": "아침부터 고생"
    },
    {
     "author": "meme.box",
     "createdAt": "2026-02-27T07:19:24.228949+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#플리",
    "#농구"
   ],
   "caption": "플리 업데이트",
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
    "#편집"
   ],
   "caption": "필름 준비",
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
     "body": "커피 ㄱ?"
    },
    {
     "author": "seongwon.youth",
     "createdAt": "2026-02-28T06:22:47.158896+09:00",
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#공지",
    "#청년센터"
   ],
   "body": "한서대학교 프로그램",
   "media": []
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
     "body": "농구 다음에"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대",
    "#경영26",
    "#꽃샘추위"
   ],
   "body": "3월 발표",
   "media": []
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
     "body": "도서관 자리 있어?"
    },
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-02T11:01:10.028937+09:00",
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#입대",
    "#성원고"
   ],
   "body": "친구 동창 모임",
   "media": []
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
     "body": "봄 오냐"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#러닝",
    "#농구"
   ],
   "caption": "오늘 2-1",
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
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#동네가게",
    "#봄"
   ],
   "caption": "성원동 골목 축제",
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
   "place": "성원동 골목"
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
    "#경영26",
    "#개강"
   ],
   "caption": "수강신청 실내에만 있음",
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
    "#게임"
   ],
   "body": "오늘의 봄 플리",
   "media": []
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
     "body": "봄 오냐"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#과제"
   ],
   "caption": "수강신청 패딩 다시 꺼냄",
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
    "#수강신청",
    "#경영26"
   ],
   "caption": "도서관 2시 야경",
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
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#러닝",
    "#축구"
   ],
   "body": "5km 포기",
   "media": []
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
     "body": "주말에 갈게"
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
   "caption": "새내기 발표 인증",
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
    "#성원동맛집"
   ],
   "caption": "성원동 세탁소 수선",
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
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강",
    "#한서대",
    "#과제"
   ],
   "body": "과방 거의 다 함",
   "media": []
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
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#새내기",
    "#개강"
   ],
   "body": "오늘 컴퓨터활용 어렵다",
   "media": []
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
     "body": "확인했어요"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대"
   ],
   "body": "중간고사 거의 다 함",
   "media": []
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
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "성원동 카페 오늘 분위기",
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
    "#성원동맛집"
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
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-05T12:59:11.532965+09:00",
     "body": "몇 시까지 해요?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집"
   ],
   "body": "상영 공유",
   "media": []
  },
  {
   "id": "LBP-0272",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2026-03-05T01:13:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-05T05:10:40.573115+09:00",
     "body": "도서관 자리 있어?"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-05T13:01:26.320948+09:00",
     "body": "편집 잘 됐다"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-05T14:48:16.875878+09:00",
     "body": "우와"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#성원고"
   ],
   "caption": "주말 수시",
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
    "#동네가게",
    "#성원동맛집"
   ],
   "body": "꽃샘추위 옷 못 정함",
   "media": []
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
     "body": "최고"
    },
    {
     "author": "hoops.log",
     "createdAt": "2026-03-05T23:15:51.469182+09:00",
     "body": "꽃샘추위"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#축구",
    "#게임"
   ],
   "body": "새 게임 연습",
   "media": []
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
    "#주말",
    "#성원동카페"
   ],
   "caption": "돈까스 준비 완료",
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
   "body": "알바 9시 하는 중",
   "media": []
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
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#단편영화"
   ],
   "caption": "햇살 촬영",
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
   "id": "LBP-0278",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2026-03-05T23:35:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-06T10:16:36.060121+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "비 창밖만 봄",
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
    "#축구",
    "#러닝",
    "#농구"
   ],
   "body": "밈 리뷰",
   "media": []
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
     "body": "이번 주도?"
    },
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-03-06T13:50:52.685564+09:00",
     "body": "구장 몇 시?"
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
   "caption": "컴퓨터활용 과제 리뷰",
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
    "#입대",
    "#재수",
    "#알바"
   ],
   "body": "화요일 입대",
   "media": []
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
    "#축구",
    "#게임",
    "#농구"
   ],
   "body": "오늘 1-2",
   "media": []
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
     "body": "봄 오냐"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-07T10:02:02.996585+09:00",
     "body": "사진 잘 나왔다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#한서대"
   ],
   "body": "수강 정정 공지",
   "media": []
  },
  {
   "id": "LBP-0284",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-03-07T13:21:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-08T13:29:03.656388+09:00",
     "body": "최고"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바",
    "#동네친구"
   ],
   "caption": "야자 끝나고 떡볶이",
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
    "#입대",
    "#재수"
   ],
   "caption": "성원천에서 야자",
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
   "body": "오늘 꽃샘추위",
   "media": []
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
     "body": "발표 준비 화이팅"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학생회",
    "#총학생회",
    "#공지"
   ],
   "caption": "오늘 강좌",
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
     "body": "꽃샘추위"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-08T12:32:20.018036+09:00",
     "body": "경기 봤어?"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-03-09T00:19:01.473941+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#학식"
   ],
   "caption": "도서관 10시 야경",
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
   "id": "LBP-0289",
   "kind": "text",
   "author": "minseo.kim",
   "createdAt": "2026-03-08T00:25:00+09:00",
   "likes": 18,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-08T04:56:10.173275+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영26"
   ],
   "body": "발표 밀림",
   "media": []
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
     "body": "굿"
    },
    {
     "author": "daily.seongwon",
     "createdAt": "2026-03-09T00:37:50.384506+09:00",
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대",
    "#꽃샘추위",
    "#재수"
   ],
   "body": "알바 10시 미뤘음",
   "media": []
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
     "body": "맛있겠다"
    },
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-09T05:00:20.593938+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#플리",
    "#러닝",
    "#농구"
   ],
   "body": "밈 추천",
   "media": []
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
    "#동네친구"
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
   "id": "LBP-0293",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-08T17:13:00+09:00",
   "likes": 39,
   "comments": [
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-08T22:50:03.305534+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#촬영",
    "#단편영화"
   ],
   "caption": "상영회 점검",
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
     "body": "헐"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구"
   ],
   "body": "축구 경기",
   "media": []
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
     "body": "최고"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청",
    "#학식"
   ],
   "body": "오늘 영어 배고프다",
   "media": []
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
    "#총학생회",
    "#한서대",
    "#공지"
   ],
   "body": "봄 행사 안내",
   "media": []
  },
  {
   "id": "LBP-0297",
   "kind": "photo",
   "author": "seojin.yoon",
   "createdAt": "2026-03-08T23:22:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-09T15:42:45.943856+09:00",
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구"
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
   "id": "LBP-0298",
   "kind": "text",
   "author": "eunbi.seo",
   "createdAt": "2026-03-09T01:06:00+09:00",
   "likes": 23,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-09T04:53:20.571730+09:00",
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강",
    "#꽃샘추위",
    "#새내기"
   ],
   "body": "학식 치킨마요 {taste}",
   "media": []
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
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#촬영",
    "#단편영화"
   ],
   "caption": "조명 리뷰",
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
    "#농구"
   ],
   "caption": "랭크 기록",
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
    "#밈"
   ],
   "caption": "농구 하이라이트",
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
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말",
    "#동네가게"
   ],
   "body": "성원동 헬스장 새 클래스",
   "media": []
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
     "body": "나도 하고 싶다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#동네가게",
    "#주말"
   ],
   "caption": "제육볶음 맛보기",
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
    "#경영26",
    "#학식"
   ],
   "caption": "성원동 분식 오늘 분위기",
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
   "id": "LBP-0305",
   "kind": "photo",
   "author": "cut.jaehyun",
   "createdAt": "2026-03-10T08:52:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "frame.hana",
     "createdAt": "2026-03-11T02:12:55.889909+09:00",
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#영상과"
   ],
   "caption": "성원동 카페에서 모임",
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
   "id": "LBP-0306",
   "kind": "photo",
   "author": "yuna.lee",
   "createdAt": "2026-03-10T10:07:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-10T15:45:03.262607+09:00",
     "body": "아침부터 고생"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-03-10T18:33:43.430114+09:00",
     "body": "꽃샘추위"
    },
    {
     "author": "run.daily",
     "createdAt": "2026-03-10T22:02:12.505520+09:00",
     "body": "오늘 학식 뭐임?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강",
    "#한서대",
    "#수강신청"
   ],
   "caption": "오늘 학식 우동",
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
    "#러닝"
   ],
   "body": "러닝 기록",
   "media": []
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
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영26"
   ],
   "caption": "오늘 학식 제육볶음",
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
   "id": "LBP-0309",
   "kind": "text",
   "author": "nayoung.ko",
   "createdAt": "2026-03-10T21:04:00+09:00",
   "likes": 13,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-11T01:35:54.483672+09:00",
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#재수"
   ],
   "body": "독서실 내일 함",
   "media": []
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
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집"
   ],
   "caption": "성원동 분식 9시까지",
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
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "학원 앞에서 주말 모임",
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
   "id": "LBP-0312",
   "kind": "photo",
   "author": "hyunwoo.cho",
   "createdAt": "2026-03-11T00:03:00+09:00",
   "likes": 37,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-11T12:13:01.731376+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#입대",
    "#재수"
   ],
   "caption": "성원동 카페에서 모의고사",
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
   "id": "LBP-0313",
   "kind": "photo",
   "author": "laundry.seongwon",
   "createdAt": "2026-03-11T00:22:00+09:00",
   "likes": 30,
   "comments": [
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-11T03:38:57.259156+09:00",
     "body": "우와"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#주말"
   ],
   "caption": "맡기신 옷 수선",
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
    "#꽃샘추위"
   ],
   "body": "오늘 대학글쓰기 배고프다",
   "media": []
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
    "#밈",
    "#축구"
   ],
   "caption": "음악 모임",
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
     "body": "역전 미쳤다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#청년센터",
    "#공지",
    "#총학생회"
   ],
   "caption": "캠퍼스 과제 마감",
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
   "place": "학생회관"
  },
  {
   "id": "LBP-0317",
   "kind": "photo",
   "author": "minjae.bae",
   "createdAt": "2026-03-11T19:16:00+09:00",
   "likes": 36,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#동네친구",
    "#알바"
   ],
   "caption": "알바 6시 끝",
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
    "#수강신청",
    "#과제",
    "#개강"
   ],
   "caption": "OT {detail}",
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
   "id": "LBP-0319",
   "kind": "photo",
   "author": "donghyun.lim",
   "createdAt": "2026-03-11T21:13:00+09:00",
   "likes": 15,
   "comments": [
    {
     "author": "film.sua",
     "createdAt": "2026-03-12T08:17:05.148950+09:00",
     "body": "3조 화이팅"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#성원고"
   ],
   "caption": "흐림 우산 챙김",
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
    "#수강신청"
   ],
   "body": "과방 미뤘음",
   "media": []
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
     "body": "사진 예쁘다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학생회",
    "#한서대",
    "#총학생회"
   ],
   "caption": "참가자 공지",
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
    "#촬영"
   ],
   "caption": "대학글쓰기 과제 모임",
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
   "id": "LBP-0323",
   "kind": "photo",
   "author": "haneul.park",
   "createdAt": "2026-03-12T00:21:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-12T00:29:14.471284+09:00",
     "body": "응원해"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-12T09:16:44.237741+09:00",
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
    "#봄"
   ],
   "caption": "동네 축제",
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
   "place": "성원동 골목"
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
     "body": "편집 잘 됐다"
    },
    {
     "author": "film.sua",
     "createdAt": "2026-03-12T05:46:50.551686+09:00",
     "body": "이거 어디야?"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-03-12T19:01:18.337485+09:00",
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#편집",
    "#촬영",
    "#상영회"
   ],
   "caption": "편집 12시",
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
     "body": "다음 주에 보자"
    },
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-12T13:09:02.597350+09:00",
     "body": "좋다"
    },
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-13T02:18:09.056351+09:00",
     "body": "꽃샘추위"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강"
   ],
   "body": "학식 튀김 {taste}",
   "media": []
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
     "body": "화이팅"
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
   "caption": "필름 점검",
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
     "body": "사진 예쁘다"
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
   "body": "회계원리 졸리다",
   "media": []
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
    "#게임"
   ],
   "body": "러닝 포기",
   "media": []
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
     "body": "나도 갈래"
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
   "body": "오늘 할인",
   "media": []
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
    "#꽃샘추위",
    "#성원고",
    "#재수"
   ],
   "caption": "학원 10시 끝",
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
   "id": "LBP-0332",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-03-12T21:22:00+09:00",
   "likes": 6,
   "comments": [
    {
     "author": "soyeon.jang",
     "createdAt": "2026-03-13T18:00:43.074556+09:00",
     "body": "ㅋㅋㅋ"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기"
   ],
   "caption": "동아리 개강",
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
     "body": "편집 잘 됐다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식",
    "#경영26"
   ],
   "caption": "오늘 학식 튀김",
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
   "id": "LBP-0334",
   "kind": "text",
   "author": "taeho.kang",
   "createdAt": "2026-03-12T23:33:00+09:00",
   "likes": 13,
   "comments": [
    {
     "author": "seojin.yoon",
     "createdAt": "2026-03-12T23:57:26.971605+09:00",
     "body": "나도 하고 싶다"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-13T21:58:45.877991+09:00",
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#경영26",
    "#수강신청"
   ],
   "body": "성원동 분식 제출함",
   "media": []
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
     "body": "부럽다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#학식",
    "#새내기"
   ],
   "caption": "중앙도서관 오늘 분위기",
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
   "id": "LBP-0336",
   "kind": "photo",
   "author": "game.loop",
   "createdAt": "2026-03-13T00:08:00+09:00",
   "likes": 136,
   "comments": [
    {
     "author": "laundry.seongwon",
     "createdAt": "2026-03-13T04:20:35.311169+09:00",
     "body": "3조 화이팅"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구"
   ],
   "caption": "키보드 업데이트",
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
     "author": "minjae.bae",
     "createdAt": "2026-03-13T01:40:54.947580+09:00",
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수",
    "#꽃샘추위",
    "#성원고"
   ],
   "body": "동네 모의고사",
   "media": []
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
     "body": "도서관 자리 있어?"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-13T05:28:03.401971+09:00",
     "body": "역전 미쳤다"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동카페",
    "#동네가게"
   ],
   "body": "오늘 제육볶음",
   "media": []
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
     "body": "3조 화이팅"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-13T15:56:44.032981+09:00",
     "body": "경기 봤어?"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-13T16:43:00.826189+09:00",
     "body": "어디서 찍었어?"
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
   "body": "청년센터 참가자",
   "media": []
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
    "#축구",
    "#농구",
    "#러닝"
   ],
   "body": "성원동 카페 추천",
   "media": []
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
    "#농구",
    "#러닝"
   ],
   "body": "4-3 경기",
   "media": []
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
     "body": "나도 갈래"
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
   "id": "LBP-0343",
   "kind": "text",
   "author": "hoops.log",
   "createdAt": "2026-03-13T17:00:00+09:00",
   "likes": 57,
   "comments": [
    {
     "author": "meme.box",
     "createdAt": "2026-03-13T18:53:26.106856+09:00",
     "body": "상영회 기대"
    },
    {
     "author": "football.talk",
     "createdAt": "2026-03-14T01:42:20.231713+09:00",
     "body": "ㅋㅋㅋ"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-14T03:05:26.707972+09:00",
     "body": "나도 하고 싶다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#농구",
    "#밈"
   ],
   "body": "주말 농구",
   "media": []
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
     "body": "나도 갈래"
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
   "caption": "오늘 비",
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
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#알바"
   ],
   "caption": "오늘 김밥",
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
    "#편집"
   ],
   "caption": "영상과 마감",
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
    "#공지",
    "#청년센터"
   ],
   "body": "한서대학교 장학금",
   "media": []
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
    "#입대",
    "#꽃샘추위"
   ],
   "caption": "오늘 불고기덮밥",
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
   "author": "minjae.bae",
   "createdAt": "2026-03-14T00:38:00+09:00",
   "likes": 36,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2026-03-14T02:07:54.029767+09:00",
     "body": "꽃샘추위"
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
   "id": "LBP-0350",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2026-03-14T00:56:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "game.loop",
     "createdAt": "2026-03-14T14:38:46.179832+09:00",
     "body": "3조 화이팅"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#꽃샘추위",
    "#재수"
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
   "id": "LBP-0351",
   "kind": "text",
   "author": "daily.seongwon",
   "createdAt": "2026-03-14T01:54:00+09:00",
   "likes": 88,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-14T03:38:00.130639+09:00",
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#봄",
    "#성원동카페",
    "#동네가게"
   ],
   "body": "새벽 1시 주말",
   "media": []
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
     "body": "응원해"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-03-14T14:20:19.166471+09:00",
     "body": "꽃샘추위"
    },
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-14T21:47:06.856963+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#경영26"
   ],
   "caption": "새내기 축제 인증",
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
     "body": "최고"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#개강",
    "#수강신청"
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
   "id": "LBP-0354",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-14T16:50:00+09:00",
   "likes": 38,
   "comments": [
    {
     "author": "seongwon.cafe",
     "createdAt": "2026-03-14T18:18:18.898976+09:00",
     "body": "아침부터 고생"
    },
    {
     "author": "meme.box",
     "createdAt": "2026-03-14T21:32:39.687259+09:00",
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
   "caption": "성원동 헬스장 10시까지",
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
     "author": "minjae.bae",
     "createdAt": "2026-03-14T21:57:24.854235+09:00",
     "body": "꽃샘추위"
    },
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-14T22:20:12.130390+09:00",
     "body": "아침부터 고생"
    },
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-15T03:36:04.789777+09:00",
     "body": "오늘 날씨 진짜"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대"
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
   "id": "LBP-0356",
   "kind": "text",
   "author": "biz.hanseo",
   "createdAt": "2026-03-14T18:01:00+09:00",
   "likes": 201,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-03-14T19:06:43.306092+09:00",
     "body": "다음에 같이 가자"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-14T22:52:46.295088+09:00",
     "body": "커피 ㄱ?"
    },
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-15T01:17:42.900869+09:00",
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
   "body": "학사 일정 일정",
   "media": []
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
    "#농구"
   ],
   "body": "밈 기록",
   "media": []
  },
  {
   "id": "LBP-0358",
   "kind": "photo",
   "author": "lens.minho",
   "createdAt": "2026-03-14T18:48:00+09:00",
   "likes": 12,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-14T19:32:01.874791+09:00",
     "body": "응원해"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-14T21:30:10.068940+09:00",
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영"
   ],
   "caption": "편집실에서 모임",
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
   "id": "LBP-0359",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-03-14T20:58:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-15T00:18:22.084769+09:00",
     "body": "사진 잘 나왔다"
    },
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-15T02:03:44.627778+09:00",
     "body": "경기 봤어?"
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
   "body": "3교시 대학글쓰기 어렵다",
   "media": []
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
     "body": "알바 끝나고 봐"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#수강신청"
   ],
   "body": "3월 과제",
   "media": []
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
     "body": "주말에 갈게"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#게임",
    "#러닝"
   ],
   "body": "플리 새 버전",
   "media": []
  },
  {
   "id": "LBP-0362",
   "kind": "photo",
   "author": "nayoung.ko",
   "createdAt": "2026-03-14T22:51:00+09:00",
   "likes": 24,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-15T02:43:18.816670+09:00",
     "body": "나도 갈래"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-15T03:51:48.936260+09:00",
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#입대"
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
   "id": "LBP-0363",
   "kind": "photo",
   "author": "fitness.seongwon",
   "createdAt": "2026-03-14T22:57:00+09:00",
   "likes": 48,
   "comments": [
    {
     "author": "bunsik.house",
     "createdAt": "2026-03-15T02:39:16.322504+09:00",
     "body": "화이팅"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#성원동맛집",
    "#동네가게",
    "#봄"
   ],
   "caption": "성원동 헬스장 2시까지",
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
     "body": "다음에 같이 가자"
    },
    {
     "author": "lens.minho",
     "createdAt": "2026-03-15T00:33:49.463555+09:00",
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#촬영",
    "#영상과",
    "#상영회"
   ],
   "body": "과제 미뤘음",
   "media": []
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
    "#개강"
   ],
   "body": "내일 2교시",
   "media": []
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
    "#봄",
    "#성원동카페",
    "#성원동맛집"
   ],
   "body": "수선 정리",
   "media": []
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
     "body": "5km 대단"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#새내기",
    "#한서대"
   ],
   "caption": "비라서 우산 챙김",
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
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": true,
   "hashtags": [
    "#재수"
   ],
   "caption": "알바 새벽 2시 끝",
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
    "#단편영화"
   ],
   "body": "단편 마무리",
   "media": []
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
    "#동네친구",
    "#재수"
   ],
   "body": "입대 곧",
   "media": []
  },
  {
   "id": "LBP-0371",
   "kind": "photo",
   "author": "yeseul.hong",
   "createdAt": "2026-03-15T01:57:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-15T02:18:35.364768+09:00",
     "body": "이거 어디야?"
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
   "caption": "동네 독서실",
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
   "id": "LBP-0372",
   "kind": "photo",
   "author": "hoops.log",
   "createdAt": "2026-03-15T07:04:00+09:00",
   "likes": 42,
   "comments": [
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-16T09:57:08.527914+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#축구",
    "#러닝"
   ],
   "caption": "성원천 운동장 리뷰",
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
     "body": "응원해"
    },
    {
     "author": "game.loop",
     "createdAt": "2026-03-16T17:00:25.365313+09:00",
     "body": "주말에 갈게"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-16T23:14:56.669336+09:00",
     "body": "농구 다음에"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#봄"
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
    "#청년센터"
   ],
   "body": "장학금 공지",
   "media": []
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
     "body": "좋다"
    },
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-17T07:07:30.304399+09:00",
     "body": "우와"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#청년센터"
   ],
   "caption": "청년센터 행사 일정",
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
   "place": "중앙도서관"
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
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동네가게",
    "#봄"
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
    "#플리",
    "#러닝",
    "#축구"
   ],
   "body": "어제 게임 연습",
   "media": []
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
     "body": "ㅇㅇ"
    },
    {
     "author": "gunwoo.shin",
     "createdAt": "2026-03-17T08:06:33.764086+09:00",
     "body": "3조 화이팅"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동네친구"
   ],
   "body": "친구 야자",
   "media": []
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
     "body": "구장 몇 시?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#영상과"
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
   "id": "LBP-0380",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-03-15T23:47:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-16T16:35:42.994614+09:00",
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
    "#게임"
   ],
   "body": "밈 하이라이트",
   "media": []
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
    "#개강",
    "#한서대"
   ],
   "caption": "꽃샘추위라서 실내에만 있음",
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
    "#과제",
    "#한서대",
    "#개강"
   ],
   "body": "성원동 카페 미뤘음",
   "media": []
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
     "body": "꽃샘추위"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#촬영",
    "#상영회"
   ],
   "caption": "밤샘 편집 성공",
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
   "id": "LBP-0385",
   "kind": "photo",
   "author": "minseo.kim",
   "createdAt": "2026-03-16T11:30:00+09:00",
   "likes": 16,
   "comments": [
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-17T03:20:36.336288+09:00",
     "body": "이 밈 뭐임"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-17T07:12:20.139346+09:00",
     "body": "봄 오냐"
    },
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-17T08:23:56.295867+09:00",
     "body": "역전 미쳤다"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#꽃샘추위",
    "#수강신청"
   ],
   "caption": "동아리 동아리",
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
     "body": "다음에 같이 가자"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#재수",
    "#꽃샘추위",
    "#성원고"
   ],
   "body": "월요일 주말 모임",
   "media": []
  },
  {
   "id": "LBP-0387",
   "kind": "text",
   "author": "minjae.bae",
   "createdAt": "2026-03-16T12:34:00+09:00",
   "likes": 25,
   "comments": [],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원고"
   ],
   "body": "마케팅원론 재밌다",
   "media": []
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
    "#청년센터"
   ],
   "caption": "강좌 알림",
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
   "place": "청년센터"
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
     "body": "플리 저장"
    },
    {
     "author": "nayoung.ko",
     "createdAt": "2026-03-17T13:58:11.735799+09:00",
     "body": "굿"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#꽃샘추위",
    "#재수",
    "#성원고"
   ],
   "body": "알바 12시 거의 다 함",
   "media": []
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
    "#개강"
   ],
   "caption": "비라서 커피 삼",
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
    "#밈",
    "#러닝",
    "#플리"
   ],
   "body": "경기 업데이트",
   "media": []
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
     "body": "꽃샘추위"
    },
    {
     "author": "music.drawer",
     "createdAt": "2026-03-17T18:42:32.346771+09:00",
     "body": "그거 나도 봤어"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#밈"
   ],
   "body": "성원천 산책로 모임",
   "media": []
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
     "body": "구장 몇 시?"
    },
    {
     "author": "taeho.kang",
     "createdAt": "2026-03-17T06:19:26.364086+09:00",
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제",
    "#한서대"
   ],
   "caption": "새내기 수강 정정 인증",
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
    "#봄",
    "#동네가게",
    "#성원동맛집"
   ],
   "caption": "동네 소식",
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
   "id": "LBP-0395",
   "kind": "photo",
   "author": "eunbi.seo",
   "createdAt": "2026-03-16T23:45:00+09:00",
   "likes": 41,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-17T16:18:40.099735+09:00",
     "body": "부럽다"
    },
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-17T20:07:58.040705+09:00",
     "body": "오늘 날씨 진짜"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#개강"
   ],
   "caption": "라면 먹고 성원동 분식",
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
   "id": "LBP-0396",
   "kind": "photo",
   "author": "doyoon.han",
   "createdAt": "2026-03-16T23:50:00+09:00",
   "likes": 14,
   "comments": [
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-17T03:16:10.743060+09:00",
     "body": "그거 나도 봤어"
    },
    {
     "author": "chaerin.oh",
     "createdAt": "2026-03-17T13:03:02.171599+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#수강신청",
    "#꽃샘추위"
   ],
   "caption": "새내기 중간고사 인증",
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
   "id": "LBP-0397",
   "kind": "text",
   "author": "doyoon.han",
   "createdAt": "2026-03-17T00:09:00+09:00",
   "likes": 17,
   "comments": [
    {
     "author": "jiwon.moon",
     "createdAt": "2026-03-17T07:39:57.284598+09:00",
     "body": "어디서 찍었어?"
    },
    {
     "author": "yuna.lee",
     "createdAt": "2026-03-17T15:37:41.962214+09:00",
     "body": "부럽다"
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
   "body": "3교시 회계원리 살았다",
   "media": []
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
     "body": "주말에 갈게"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#상영회",
    "#촬영"
   ],
   "caption": "영어 과제 회의",
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
   "id": "LBP-0399",
   "kind": "photo",
   "author": "siwoo.jung",
   "createdAt": "2026-03-17T00:34:00+09:00",
   "likes": 23,
   "comments": [
    {
     "author": "jun.choi",
     "createdAt": "2026-03-17T11:38:22.190429+09:00",
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#꽃샘추위"
   ],
   "caption": "새내기 개강총회 인증",
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
   "id": "LBP-0400",
   "kind": "photo",
   "author": "jiwon.moon",
   "createdAt": "2026-03-17T01:09:00+09:00",
   "likes": 28,
   "comments": [
    {
     "author": "seongwon.youth",
     "createdAt": "2026-03-17T04:17:42.850080+09:00",
     "body": "커피 ㄱ?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#새내기"
   ],
   "caption": "1교시 끝나고 성원동 분식",
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
     "body": "사진 예쁘다"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-03-17T09:37:46.299500+09:00",
     "body": "부럽다"
    },
    {
     "author": "meme.box",
     "createdAt": "2026-03-17T11:02:05.096416+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#밈",
    "#축구"
   ],
   "body": "비 러닝",
   "media": []
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
    "#주말",
    "#봄"
   ],
   "caption": "회원 새 클래스",
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
     "body": "최고"
    },
    {
     "author": "siwoo.jung",
     "createdAt": "2026-03-17T15:59:35.890865+09:00",
     "body": "커피 ㄱ?"
    },
    {
     "author": "meme.box",
     "createdAt": "2026-03-17T17:09:33.783934+09:00",
     "body": "어디서 찍었어?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#수강신청",
    "#개강",
    "#과제"
   ],
   "caption": "경제학원론 끝나고 잔디밭",
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
     "body": "농구 다음에"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#꽃샘추위",
    "#알바"
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
    "#농구",
    "#플리",
    "#밈"
   ],
   "body": "새 플리 리뷰",
   "media": []
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
     "body": "농구 다음에"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#게임",
    "#러닝",
    "#농구"
   ],
   "body": "농구 기록",
   "media": []
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
     "body": "도서관 자리 있어?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#동네가게",
    "#성원동맛집"
   ],
   "body": "2시 예약",
   "media": []
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
    "#성원고",
    "#입대",
    "#재수"
   ],
   "body": "입대 D-3",
   "media": []
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
     "body": "나는 아직"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#러닝",
    "#농구"
   ],
   "caption": "오늘 하이라이트",
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
    "#플리",
    "#밈"
   ],
   "body": "흐림 풋살",
   "media": []
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
    "#재수"
   ],
   "body": "알바 새벽 1시 미뤘음",
   "media": []
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
     "body": "ㅇㅇ"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#성원동카페"
   ],
   "caption": "주말 제육볶음",
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
     "body": "수강신청 성공?"
    },
    {
     "author": "biz.hanseo",
     "createdAt": "2026-03-17T19:13:03.098395+09:00",
     "body": "나도 하고 싶다"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#공지"
   ],
   "caption": "동아리 안내",
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
   "place": "청년센터"
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
     "body": "다음에 같이 가자"
    },
    {
     "author": "doyoon.han",
     "createdAt": "2026-03-17T20:13:59.439488+09:00",
     "body": "최고"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제"
   ],
   "caption": "흐림라서 실내에만 있음",
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
     "body": "플리 저장"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#개강",
    "#꽃샘추위",
    "#새내기"
   ],
   "caption": "1교시 끝나고 중앙도서관",
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
   "id": "LBP-0416",
   "kind": "photo",
   "author": "frame.hana",
   "createdAt": "2026-03-17T16:22:00+09:00",
   "likes": 9,
   "comments": [
    {
     "author": "cut.jaehyun",
     "createdAt": "2026-03-17T20:53:12.498481+09:00",
     "body": "나도 갈래"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#단편영화"
   ],
   "caption": "상영회 마무리",
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
    "#영상과",
    "#촬영"
   ],
   "caption": "카메라 리뷰",
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
     "body": "이번 주도?"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#학생회"
   ],
   "caption": "과제 마감 안내",
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
   "place": "학생회관"
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
    "#성원동카페"
   ],
   "caption": "성원동 골목 행사",
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
   "place": "성원동 골목"
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
    "#플리",
    "#밈"
   ],
   "body": "밈 새 버전",
   "media": []
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
     "body": "주말에 갈게"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#학식",
    "#한서대",
    "#꽃샘추위"
   ],
   "live": true,
   "caption": "친구들이랑 과방",
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
    "#과제",
    "#새내기",
    "#개강"
   ],
   "live": true,
   "caption": "친구들이랑 잔디밭",
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
     "body": "5km 대단"
    },
    {
     "author": "haneul.park",
     "createdAt": "2026-03-18T06:45:30.038126+09:00",
     "body": "경기 봤어?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#단편영화",
    "#촬영",
    "#영상과"
   ],
   "live": true,
   "body": "촬영 점검",
   "media": []
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
     "body": "오늘 학식 뭐임?"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#러닝",
    "#농구",
    "#축구"
   ],
   "live": true,
   "caption": "성원천 운동장 모임",
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
    "#새내기",
    "#과제"
   ],
   "live": true,
   "body": "3교시 경제학원론 망했다",
   "media": []
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
     "body": "커피 ㄱ?"
    },
    {
     "author": "frame.hana",
     "createdAt": "2026-03-18T04:25:19.411292+09:00",
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "서아의 영상과",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#상영회",
    "#촬영"
   ],
   "live": true,
   "caption": "조명 준비",
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
     "body": "수강신청 성공?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#수강신청"
   ],
   "live": true,
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
   "id": "LBP-LIVE-0008",
   "kind": "text",
   "author": "jiwon.moon",
   "createdAt": "2026-03-17T23:05:00+09:00",
   "likes": 22,
   "comments": [
    {
     "author": "minseo.kim",
     "createdAt": "2026-03-18T01:43:52.810036+09:00",
     "body": "알바 끝나고 봐"
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
   "body": "바람 집중 안 됨",
   "media": []
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
    "#플리",
    "#러닝"
   ],
   "live": true,
   "body": "성원동 카페 하이라이트",
   "media": []
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
   "place": "성원동 분식"
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
     "body": "몇 시에?"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#한서대",
    "#개강"
   ],
   "live": true,
   "caption": "영어 끝나고 중앙도서관",
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
     "body": "굿"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-18T01:04:22.519006+09:00",
     "body": "상영회 기대"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#개강"
   ],
   "live": true,
   "caption": "성원동 분식에서 과제",
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
    "#밈",
    "#플리",
    "#게임"
   ],
   "live": true,
   "body": "게임 기록",
   "media": []
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
     "body": "회비 보냈어"
    },
    {
     "author": "music.drawer",
     "createdAt": "2026-03-18T06:10:44.573004+09:00",
     "body": "경기 봤어?"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-18T07:52:07.952418+09:00",
     "body": "오늘 날씨 진짜"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#수강신청",
    "#한서대",
    "#경영26"
   ],
   "live": true,
   "caption": "도서관 9시 야경",
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
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#청년센터",
    "#한서대"
   ],
   "live": true,
   "body": "오늘 도서관 연장",
   "media": []
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
    "#꽃샘추위",
    "#개강",
    "#학식"
   ],
   "live": true,
   "caption": "수강신청 산책함",
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
   "id": "LBP-LIVE-0017",
   "kind": "text",
   "author": "siwoo.jung",
   "createdAt": "2026-03-18T02:10:00+09:00",
   "likes": 8,
   "comments": [
    {
     "author": "hyunwoo.cho",
     "createdAt": "2026-03-18T05:40:28.096580+09:00",
     "body": "다음 주에 보자"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#경영26",
    "#새내기"
   ],
   "live": true,
   "body": "새내기 개강총회",
   "media": []
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
     "body": "오늘 날씨 진짜"
    }
   ],
   "noise": true,
   "circle": "성원고 동창",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#재수",
    "#입대",
    "#성원고"
   ],
   "live": true,
   "caption": "모의고사 망함",
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
   "id": "LBP-LIVE-0019",
   "kind": "text",
   "author": "seongwon.youth",
   "createdAt": "2026-03-18T05:18:00+09:00",
   "likes": 80,
   "comments": [
    {
     "author": "hanseo.student",
     "createdAt": "2026-03-18T08:06:04.485003+09:00",
     "body": "꽃샘추위"
    }
   ],
   "noise": true,
   "circle": "학교·기관 공식",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#공지",
    "#학생회",
    "#총학생회"
   ],
   "live": true,
   "body": "프로그램 안내",
   "media": []
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
     "body": "상영회 기대"
    },
    {
     "author": "fitness.seongwon",
     "createdAt": "2026-03-18T08:01:57.640676+09:00",
     "body": "회비 보냈어"
    },
    {
     "author": "minjae.bae",
     "createdAt": "2026-03-18T08:30:59.602698+09:00",
     "body": "이거 어디야?"
    }
   ],
   "noise": true,
   "circle": "동네·생활",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#주말",
    "#동네가게",
    "#봄"
   ],
   "live": true,
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
     "body": "ㅇㅇ"
    },
    {
     "author": "yeseul.hong",
     "createdAt": "2026-03-18T07:35:23.621312+09:00",
     "body": "맛있겠다"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#농구"
   ],
   "live": true,
   "body": "성원동 카페 새 버전",
   "media": []
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
     "body": "이 밈 뭐임"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#과제"
   ],
   "live": true,
   "caption": "오늘 학식 떡볶이",
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
   "id": "LBP-LIVE-0023",
   "kind": "text",
   "author": "meme.box",
   "createdAt": "2026-03-18T07:52:00+09:00",
   "likes": 262,
   "comments": [
    {
     "author": "run.daily",
     "createdAt": "2026-03-18T08:00:11.855155+09:00",
     "body": "주말에 갈게"
    }
   ],
   "noise": true,
   "circle": "관심사",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#러닝"
   ],
   "live": true,
   "body": "밈 하이라이트 이제",
   "media": []
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
    "#축구",
    "#농구"
   ],
   "live": true,
   "caption": "성원천 운동장 업데이트",
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
     "body": "나도 갈래"
    },
    {
     "author": "eunbi.seo",
     "createdAt": "2026-03-18T08:47:44.800346+09:00",
     "body": "아침부터 고생"
    }
   ],
   "noise": true,
   "circle": "한서대 경영 26 동기",
   "evidence": null,
   "cache": false,
   "hashtags": [
    "#수강신청",
    "#새내기",
    "#경영26"
   ],
   "live": true,
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
  }
 ],
 "pool": {
  "items": [
   {
    "id": "PL-0001",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "8시까지 학생회관 갈 수 있어?"
   },
   {
    "id": "PL-0002",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "화요일 MT 예약됨"
   },
   {
    "id": "PL-0003",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 시작도 못 함"
   },
   {
    "id": "PL-0004",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "김우진 시작도 못 함?"
   },
   {
    "id": "PL-0005",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "토요일 과제 미뤘음"
   },
   {
    "id": "PL-0006",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "밤 11시까지 성원동 카페 갈 수 있어?"
   },
   {
    "id": "PL-0007",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "컴퓨터활용 교수님 밀림"
   },
   {
    "id": "PL-0008",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "2시에 학생회관 갈 사람?"
   },
   {
    "id": "PL-0009",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "새벽 1시까지 과방 갈 수 있어?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0010",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "돈까스 먹고 잔디밭 갈래?"
   },
   {
    "id": "PL-0011",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "MT 시작도 못 함"
   },
   {
    "id": "PL-0012",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "경제학원론 재밌다"
   },
   {
    "id": "PL-0013",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 밀림"
   },
   {
    "id": "PL-0014",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "윤서진 괜찮다?"
   },
   {
    "id": "PL-0015",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "새벽 2시까지 성원동 분식 갈 수 있어?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0016",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "박정호 확인함?"
   },
   {
    "id": "PL-0017",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "단톡 조용하다"
   },
   {
    "id": "PL-0018",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "수요일에 축제 한대"
   },
   {
    "id": "PL-0019",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "12시에 중앙도서관에서 볼 사람?"
   },
   {
    "id": "PL-0020",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "개강총회 다 찍음"
   },
   {
    "id": "PL-0021",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "튀김 시킬까?"
   },
   {
    "id": "PL-0022",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 제출함"
   },
   {
    "id": "PL-0023",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과방 밀림"
   },
   {
    "id": "PL-0024",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "홍예슬 많다?"
   },
   {
    "id": "PL-0025",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "목요일 축제 끝남"
   },
   {
    "id": "PL-0026",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "새벽 2시까지 학생회관 갈 수 있어?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0027",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "12시에 학생회관에서 볼 사람?"
   },
   {
    "id": "PL-0028",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "OT 시작도 못 함"
   },
   {
    "id": "PL-0029",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "금요일 발표 조용하다"
   },
   {
    "id": "PL-0030",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "온통신 고객센터 조용하다?"
   },
   {
    "id": "PL-0031",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "영어 망했다"
   },
   {
    "id": "PL-0032",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "금요일 개강 많다"
   },
   {
    "id": "PL-0033",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "수강신청 다 찍음"
   },
   {
    "id": "PL-0034",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "개강총회 제출함"
   },
   {
    "id": "PL-0035",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 김밥 먹을 사람"
   },
   {
    "id": "PL-0036",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "MT 많다"
   },
   {
    "id": "PL-0037",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "수강신청 생각보다 괜찮음"
   },
   {
    "id": "PL-0038",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "단톡 괜찮다"
   },
   {
    "id": "PL-0039",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과방 하는 중"
   },
   {
    "id": "PL-0040",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "수요일에 OT 한대"
   },
   {
    "id": "PL-0041",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과방 끝남"
   },
   {
    "id": "PL-0042",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "불고기덮밥 먹고 중앙도서관 갈래?"
   },
   {
    "id": "PL-0043",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "일요일 OT 예약됨"
   },
   {
    "id": "PL-0044",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "내일 3교시 있는 사람?"
   },
   {
    "id": "PL-0045",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "6시에 중앙도서관에서 볼 사람?"
   },
   {
    "id": "PL-0046",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "개강총회 포기함"
   },
   {
    "id": "PL-0047",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "8시까지 중앙도서관 갈 수 있어?"
   },
   {
    "id": "PL-0048",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "금요일 중간고사 예약됨"
   },
   {
    "id": "PL-0049",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "수강신청 끝남"
   },
   {
    "id": "PL-0050",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "9시까지 성원동 카페 갈 수 있어?"
   },
   {
    "id": "PL-0051",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "통계학 재밌다"
   },
   {
    "id": "PL-0052",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "마케팅원론 교수님 시작도 못 함"
   },
   {
    "id": "PL-0053",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "바로택시 고객센터아 수업 들었어?"
   },
   {
    "id": "PL-0054",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "OT 준비물 뭐 챙겨?"
   },
   {
    "id": "PL-0055",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "제육볶음 먹고 잔디밭 갈래?"
   },
   {
    "id": "PL-0056",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "김태식 수강 정정 갔어?"
   },
   {
    "id": "PL-0057",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "과제 망함"
   },
   {
    "id": "PL-0058",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "12시까지 잔디밭 갈 수 있어?"
   },
   {
    "id": "PL-0059",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "흐림라서 옷 못 정함"
   },
   {
    "id": "PL-0060",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "10시까지 과방 갈 수 있어?"
   },
   {
    "id": "PL-0061",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "새벽 2시까지 성원동 카페 갈 수 있어?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0062",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "금요일 개강총회 예약됨"
   },
   {
    "id": "PL-0063",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "발표 포기함"
   },
   {
    "id": "PL-0064",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "통계학 교수님 거의 다 함"
   },
   {
    "id": "PL-0065",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "김치찌개 먹고 성원동 카페 갈래?"
   },
   {
    "id": "PL-0066",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "OT 조용하다"
   },
   {
    "id": "PL-0067",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 돈까스 먹을 사람"
   },
   {
    "id": "PL-0068",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "제육볶음 시킬까?"
   },
   {
    "id": "PL-0069",
    "room": "talk.biz26",
    "circle": "한서대 경영 26 동기",
    "text": "흐림라서 실내에만 있음"
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
    "text": "새벽 1시에 성원천에서 보자",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0072",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "월요일에 성원동 카페 갈 사람"
   },
   {
    "id": "PL-0073",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "재수 바쁘다"
   },
   {
    "id": "PL-0074",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "월요일 입대 어때?"
   },
   {
    "id": "PL-0075",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "최준아 뭐 해?"
   },
   {
    "id": "PL-0076",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "제육볶음 살았다"
   },
   {
    "id": "PL-0077",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "최민규아 밥 먹었어?"
   },
   {
    "id": "PL-0078",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "튀김 살았다"
   },
   {
    "id": "PL-0079",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "입대 D-7"
   },
   {
    "id": "PL-0080",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "일요일 동창 모임 어때?"
   },
   {
    "id": "PL-0081",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "고3 때 성원천 자주 갔지"
   },
   {
    "id": "PL-0082",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "수시 괜찮다"
   },
   {
    "id": "PL-0083",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "카레라이스 집중 안 됨"
   },
   {
    "id": "PL-0084",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "불고기덮밥 살았다"
   },
   {
    "id": "PL-0085",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "야자 제출함"
   },
   {
    "id": "PL-0086",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "동네 성원동 카페 끝남"
   },
   {
    "id": "PL-0087",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "김밥 먹고 갈래?"
   },
   {
    "id": "PL-0088",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "통계학 시작도 못 함"
   },
   {
    "id": "PL-0089",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "재수 어렵다"
   },
   {
    "id": "PL-0090",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "경영원론 확인함"
   },
   {
    "id": "PL-0091",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "다음 주 수시 하는 중"
   },
   {
    "id": "PL-0092",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "입대 D-3"
   },
   {
    "id": "PL-0093",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "짜장밥 먹고 갈래?"
   },
   {
    "id": "PL-0094",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "화요일 야자 어때?"
   },
   {
    "id": "PL-0095",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "알바 2시 괜찮다"
   },
   {
    "id": "PL-0096",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "영어 내일 함"
   },
   {
    "id": "PL-0097",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "박하늘아 잘 지내?"
   },
   {
    "id": "PL-0098",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "경제학원론 밀림"
   },
   {
    "id": "PL-0099",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "주말 모임 준비 조용하다"
   },
   {
    "id": "PL-0100",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "동네 성원동 골목 미뤘음"
   },
   {
    "id": "PL-0101",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "비라서 패딩 다시 꺼냄"
   },
   {
    "id": "PL-0102",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "햇살라서 우산 챙김"
   },
   {
    "id": "PL-0103",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "재수 살았다"
   },
   {
    "id": "PL-0104",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "햇살라서 산책함"
   },
   {
    "id": "PL-0105",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "회계원리 시작도 못 함"
   },
   {
    "id": "PL-0106",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "햇살라서 코트 못 감"
   },
   {
    "id": "PL-0107",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "일요일에 성원동 분식 갈 사람"
   },
   {
    "id": "PL-0108",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "최유빈 요즘 뭐 해?"
   },
   {
    "id": "PL-0109",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "동창 모임 생각보다 괜찮음"
   },
   {
    "id": "PL-0110",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "이현수은 잘 지내?"
   },
   {
    "id": "PL-0111",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "주말 모임 비었음"
   },
   {
    "id": "PL-0112",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "토요일 수시 어때?"
   },
   {
    "id": "PL-0113",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "동네 성원동 분식 밀림"
   },
   {
    "id": "PL-0114",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "고3 때 성원동 분식 자주 갔지"
   },
   {
    "id": "PL-0115",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "금요일에 학원 앞 갈 사람"
   },
   {
    "id": "PL-0116",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "화요일 수시 어때?"
   },
   {
    "id": "PL-0117",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "박하늘 요즘 뭐 해?"
   },
   {
    "id": "PL-0118",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "동창 모임 망함"
   },
   {
    "id": "PL-0119",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "미세먼지라서 창밖만 봄"
   },
   {
    "id": "PL-0120",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "대학글쓰기 예약됨"
   },
   {
    "id": "PL-0121",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "수요일 야자 어때?"
   },
   {
    "id": "PL-0122",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "야자 준비 밀림"
   },
   {
    "id": "PL-0123",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "알바 8시 하는 중"
   },
   {
    "id": "PL-0124",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "금요일에 성원동 분식 갈 사람"
   },
   {
    "id": "PL-0125",
    "room": "talk.hs32",
    "circle": "성원고 동창",
    "text": "알바 12시 거의 다 함"
   },
   {
    "id": "PL-0126",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "자료 정리함"
   },
   {
    "id": "PL-0127",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 밤 11시에 성원동 카페에서 모여"
   },
   {
    "id": "PL-0128",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "보고서 작성 맡음"
   },
   {
    "id": "PL-0129",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "한서아 확인 부탁"
   },
   {
    "id": "PL-0130",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 본론 다시 봄"
   },
   {
    "id": "PL-0131",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 사례 확인함"
   },
   {
    "id": "PL-0132",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 전에 PPT 만들기"
   },
   {
    "id": "PL-0133",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "사진 확인 필요"
   },
   {
    "id": "PL-0134",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "제출 거의"
   },
   {
    "id": "PL-0135",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 과방 비었다"
   },
   {
    "id": "PL-0136",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "PPT 거의 다 됨"
   },
   {
    "id": "PL-0137",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 사례 준비 중"
   },
   {
    "id": "PL-0138",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 잔디밭 붐빈다"
   },
   {
    "id": "PL-0139",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 새벽 2시까지 PPT 만들기",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0140",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "논문 공유함"
   },
   {
    "id": "PL-0141",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지 출처 정리"
   },
   {
    "id": "PL-0142",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 연습 확인함"
   },
   {
    "id": "PL-0143",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 마감 중요"
   },
   {
    "id": "PL-0144",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "내일 밤 11시까지 가능?"
   },
   {
    "id": "PL-0145",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "사례 끝냄"
   },
   {
    "id": "PL-0146",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 결론 확인함"
   },
   {
    "id": "PL-0147",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 중앙도서관 비었다"
   },
   {
    "id": "PL-0148",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 2시까지 보고서 작성"
   },
   {
    "id": "PL-0149",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "사례 자료 확인 필요"
   },
   {
    "id": "PL-0150",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "도입 확인함"
   },
   {
    "id": "PL-0151",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 2시까지 PPT 만들기"
   },
   {
    "id": "PL-0152",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "PPT 연습함"
   },
   {
    "id": "PL-0153",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "발표 자료 정리 연습함"
   },
   {
    "id": "PL-0154",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "이웃마켓 고객센터 했어?"
   },
   {
    "id": "PL-0155",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "제출 완료"
   },
   {
    "id": "PL-0156",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "과제 발표 연습 준비 중"
   },
   {
    "id": "PL-0157",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "과제 발표 연습 남았어"
   },
   {
    "id": "PL-0158",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "PPT 자료 확인 필요"
   },
   {
    "id": "PL-0159",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "PPT 자료 거의 다 모음"
   },
   {
    "id": "PL-0160",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "2시에 성원동 분식 어때?"
   },
   {
    "id": "PL-0161",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "PPT 맡음"
   },
   {
    "id": "PL-0162",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 밤 11시까지 PPT 만들기"
   },
   {
    "id": "PL-0163",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "과제 발표 자료 정리 남았어"
   },
   {
    "id": "PL-0164",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "마감 D-2"
   },
   {
    "id": "PL-0165",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "사례 자료 거의 다 모음"
   },
   {
    "id": "PL-0166",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "사례 자료 공유함"
   },
   {
    "id": "PL-0167",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "자료 부족함"
   },
   {
    "id": "PL-0168",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "논문 정리함"
   },
   {
    "id": "PL-0169",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "도입 끝냄"
   },
   {
    "id": "PL-0170",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 성원동 카페 비었다"
   },
   {
    "id": "PL-0171",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장비 하는 중"
   },
   {
    "id": "PL-0172",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다들 확인함?"
   },
   {
    "id": "PL-0173",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "회비 3만 원"
   },
   {
    "id": "PL-0174",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "몸 많다"
   },
   {
    "id": "PL-0175",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "6시에 학생회관 거의 다 함"
   },
   {
    "id": "PL-0176",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "점심 끝남",
    "window": [
     11,
     14
    ]
   },
   {
    "id": "PL-0177",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 예약 확인함"
   },
   {
    "id": "PL-0178",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이웃마켓 고객센터 골키퍼 가능?"
   },
   {
    "id": "PL-0179",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "몸 하는 중"
   },
   {
    "id": "PL-0180",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "라면 먹고 밤 11시에 모이자"
   },
   {
    "id": "PL-0181",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다들 괜찮다?"
   },
   {
    "id": "PL-0182",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "한서대 학교 행정실 골키퍼 가능?"
   },
   {
    "id": "PL-0183",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "회비 만 원"
   },
   {
    "id": "PL-0184",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 경기 괜찮다"
   },
   {
    "id": "PL-0185",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "금요일 10시 미뤘음"
   },
   {
    "id": "PL-0186",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "점심 내일 함",
    "window": [
     11,
     14
    ]
   },
   {
    "id": "PL-0187",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장 끝남"
   },
   {
    "id": "PL-0188",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "일요일 새벽 1시 밀림",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0189",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "축구화 바쁘다"
   },
   {
    "id": "PL-0190",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "꽃샘추위 괜찮다"
   },
   {
    "id": "PL-0191",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 주 화요일도 확인함?"
   },
   {
    "id": "PL-0192",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "일요일 새벽 2시 시작도 못 함",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0193",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "물 비었음"
   },
   {
    "id": "PL-0194",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다음 경기 하는 중"
   },
   {
    "id": "PL-0195",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이번 주 수요일 조용하다"
   },
   {
    "id": "PL-0196",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "점심 하는 중",
    "window": [
     11,
     14
    ]
   },
   {
    "id": "PL-0197",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이번 주 월요일 미뤘음"
   },
   {
    "id": "PL-0198",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "점심 거의 다 함",
    "window": [
     11,
     14
    ]
   },
   {
    "id": "PL-0199",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "회비 내일 함"
   },
   {
    "id": "PL-0200",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "러닝 단축"
   },
   {
    "id": "PL-0201",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "회비 조용하다"
   },
   {
    "id": "PL-0202",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "다들 시작도 못 함?"
   },
   {
    "id": "PL-0203",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "몸 시작도 못 함"
   },
   {
    "id": "PL-0204",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "홍예슬 밀림?"
   },
   {
    "id": "PL-0205",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "구장비 거의 다 함"
   },
   {
    "id": "PL-0206",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "몸 예약됨"
   },
   {
    "id": "PL-0207",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "이번 주 월요일 예약됨"
   },
   {
    "id": "PL-0208",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "배수현 괜찮다?"
   },
   {
    "id": "PL-0209",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "새벽 1시에 학생회관 괜찮다",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0210",
    "room": "talk.futsal",
    "circle": "풋살",
    "text": "고나영 골키퍼 가능?"
   },
   {
    "id": "PL-0211",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "택배 내일 함"
   },
   {
    "id": "PL-0212",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "재고 바쁘다"
   },
   {
    "id": "PL-0213",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "택배 많다"
   },
   {
    "id": "PL-0214",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "택배 시작도 못 함"
   },
   {
    "id": "PL-0215",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "택배 예약됨"
   },
   {
    "id": "PL-0216",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "금요일 새벽 2시 교대 예약됨",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0217",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "마감 내일 함"
   },
   {
    "id": "PL-0218",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "대타 제출함"
   },
   {
    "id": "PL-0219",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "일요일 8시 가능?"
   },
   {
    "id": "PL-0220",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "냉장고 미뤘음"
   },
   {
    "id": "PL-0221",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "택배 하는 중"
   },
   {
    "id": "PL-0222",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "알바비 바쁘다"
   },
   {
    "id": "PL-0223",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "마감 하는 중"
   },
   {
    "id": "PL-0224",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "점장님 예약됨"
   },
   {
    "id": "PL-0225",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "알바비 내일 함"
   },
   {
    "id": "PL-0226",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "계산대 많다"
   },
   {
    "id": "PL-0227",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "12시 교대 조용하다"
   },
   {
    "id": "PL-0228",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "재고 많다"
   },
   {
    "id": "PL-0229",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "폐기 하는 중"
   },
   {
    "id": "PL-0230",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "김태윤 금요일 많다?"
   },
   {
    "id": "PL-0231",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "손님 하는 중"
   },
   {
    "id": "PL-0232",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "오늘 시작도 못 함"
   },
   {
    "id": "PL-0233",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "냉장고 밀림"
   },
   {
    "id": "PL-0234",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "새벽 1시 교대 내일 함",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0235",
    "room": "talk.alba",
    "circle": "지난 알바",
    "text": "계산대 밀림"
   },
   {
    "id": "PL-0236",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "주말에 시간 돼?"
   },
   {
    "id": "PL-0237",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "과제 하는 중"
   },
   {
    "id": "PL-0238",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "밥은 먹었어?"
   },
   {
    "id": "PL-0239",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "이따 봐"
   },
   {
    "id": "PL-0240",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "그럼 이따"
   },
   {
    "id": "PL-0241",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "나 알바 끝나고 갈게"
   },
   {
    "id": "PL-0242",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "야 뭐 해"
   },
   {
    "id": "PL-0243",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "몇 시에 끝나?"
   },
   {
    "id": "PL-0244",
    "room": "talk.dm.01",
    "circle": "성원고 동창",
    "text": "비 온다던데 우산 챙겨"
   },
   {
    "id": "PL-0245",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "오늘 날씨 춥다"
   },
   {
    "id": "PL-0246",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "나도 망함"
   },
   {
    "id": "PL-0247",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "잘 자"
   },
   {
    "id": "PL-0248",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "모의고사 어땠어"
   },
   {
    "id": "PL-0249",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "학원 끝났어"
   },
   {
    "id": "PL-0250",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "나는 4시까지 학원"
   },
   {
    "id": "PL-0251",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "망함"
   },
   {
    "id": "PL-0252",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "3시 어때"
   },
   {
    "id": "PL-0253",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "몇 시"
   },
   {
    "id": "PL-0254",
    "room": "talk.dm.02",
    "circle": "성원고 동창",
    "text": "ㅇㅋ"
   },
   {
    "id": "PL-0255",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "마지막으로 한 번 보자"
   },
   {
    "id": "PL-0256",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "어디서 볼까"
   },
   {
    "id": "PL-0257",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "고맙다"
   },
   {
    "id": "PL-0258",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "다들 뭐라고 하더라"
   },
   {
    "id": "PL-0259",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "언제?"
   },
   {
    "id": "PL-0260",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "검색해 봐"
   },
   {
    "id": "PL-0261",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "얼마 안 남았네"
   },
   {
    "id": "PL-0262",
    "room": "talk.dm.03",
    "circle": "성원고 동창",
    "text": "고마워 지금"
   },
   {
    "id": "PL-0263",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "다행이다"
   },
   {
    "id": "PL-0264",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "고생"
   },
   {
    "id": "PL-0265",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "그럼 버스"
   },
   {
    "id": "PL-0266",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "몇 분?"
   },
   {
    "id": "PL-0267",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "너도"
   },
   {
    "id": "PL-0268",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "나 늦을 수도"
   },
   {
    "id": "PL-0269",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "10시"
   },
   {
    "id": "PL-0270",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "알바 몇 시까지야"
   },
   {
    "id": "PL-0271",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "막차 있어?"
   },
   {
    "id": "PL-0272",
    "room": "talk.dm.04",
    "circle": "성원고 동창",
    "text": "응"
   },
   {
    "id": "PL-0273",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "우리도 하자"
   },
   {
    "id": "PL-0274",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "나 운동화 새로 샀어"
   },
   {
    "id": "PL-0275",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "주말에"
   },
   {
    "id": "PL-0276",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "너무 이르다"
   },
   {
    "id": "PL-0277",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "풋살방에 말할게"
   },
   {
    "id": "PL-0278",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "오 좋다"
   },
   {
    "id": "PL-0279",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "몇 시?"
   },
   {
    "id": "PL-0280",
    "room": "talk.dm.05",
    "circle": "성원고 동창",
    "text": "오케이"
   },
   {
    "id": "PL-0281",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "학생회관 앞"
   },
   {
    "id": "PL-0282",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "먹으러 갈래?"
   },
   {
    "id": "PL-0283",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "나 하나 남았어"
   },
   {
    "id": "PL-0284",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "했어 너는"
   },
   {
    "id": "PL-0285",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "돈까스래"
   },
   {
    "id": "PL-0286",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "나 5분 늦어"
   },
   {
    "id": "PL-0287",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "됐다"
   },
   {
    "id": "PL-0288",
    "room": "talk.dm.06",
    "circle": "한서대 경영 26 동기",
    "text": "ㅇㅋ 조금"
   },
   {
    "id": "PL-0289",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "나 늦으면 먼저 해"
   },
   {
    "id": "PL-0290",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "내일 마저 하자"
   },
   {
    "id": "PL-0291",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "조금"
   },
   {
    "id": "PL-0292",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "갈까"
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
    "text": "몇 시에"
   },
   {
    "id": "PL-0295",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "좋아"
   },
   {
    "id": "PL-0296",
    "room": "talk.dm.07",
    "circle": "한서대 경영 26 동기",
    "text": "그래"
   },
   {
    "id": "PL-0297",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "고마워"
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
    "text": "ㅋㅋ"
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
    "text": "같이 하면 되지"
   },
   {
    "id": "PL-0302",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "나중에 연락할게"
   },
   {
    "id": "PL-0303",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "고마워 이따"
   },
   {
    "id": "PL-0304",
    "room": "talk.dm.08",
    "circle": "한서대 경영 26 동기",
    "text": "확인했어"
   },
   {
    "id": "PL-0305",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "괜찮아"
   },
   {
    "id": "PL-0306",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지야"
   },
   {
    "id": "PL-0307",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "3조 발표 준비 어디까지 했어?"
   },
   {
    "id": "PL-0308",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "오늘 모임 몇 시?"
   },
   {
    "id": "PL-0309",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "도서관에서"
   },
   {
    "id": "PL-0310",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "ㅋㅋㅋ"
   },
   {
    "id": "PL-0311",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "그래 내일"
   },
   {
    "id": "PL-0312",
    "room": "talk.dm.09",
    "circle": "한서대 경영 26 동기",
    "text": "내일 보자 이따"
   },
   {
    "id": "PL-0313",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "2시"
   },
   {
    "id": "PL-0314",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "영상관에서"
   },
   {
    "id": "PL-0315",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "보러 갈게"
   },
   {
    "id": "PL-0316",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "고생했어"
   },
   {
    "id": "PL-0317",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "알겠어"
   },
   {
    "id": "PL-0318",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "알겠어 내일"
   },
   {
    "id": "PL-0319",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "ㅇㅋ 지금"
   },
   {
    "id": "PL-0320",
    "room": "talk.dm.10",
    "circle": "서아·영상과",
    "text": "고생했어 내일"
   },
   {
    "id": "PL-0321",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "편집 어디까지 했어?"
   },
   {
    "id": "PL-0322",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "절반"
   },
   {
    "id": "PL-0323",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "촬영 장비 챙겼어?"
   },
   {
    "id": "PL-0324",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "해볼게"
   },
   {
    "id": "PL-0325",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "그건 내가"
   },
   {
    "id": "PL-0326",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "조명도?"
   },
   {
    "id": "PL-0327",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "나도"
   },
   {
    "id": "PL-0328",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "기대된다"
   },
   {
    "id": "PL-0329",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "3시에 만나자"
   },
   {
    "id": "PL-0330",
    "room": "talk.dm.11",
    "circle": "서아·영상과",
    "text": "늦지 마"
   },
   {
    "id": "PL-0331",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "스케줄 확인했어"
   },
   {
    "id": "PL-0332",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "언제"
   },
   {
    "id": "PL-0333",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "손님 많았지"
   },
   {
    "id": "PL-0334",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "콜"
   },
   {
    "id": "PL-0335",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "바빴어"
   },
   {
    "id": "PL-0336",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "떡볶이"
   },
   {
    "id": "PL-0337",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "야식 먹을래?",
    "window": [
     22,
     2
    ]
   },
   {
    "id": "PL-0338",
    "room": "talk.dm.12",
    "circle": "지난 알바",
    "text": "알겠어 지금"
   },
   {
    "id": "PL-0339",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "감사합니다"
   },
   {
    "id": "PL-0340",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "또 연락드릴게요"
   },
   {
    "id": "PL-0341",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "학교 근처 지나가면 들러"
   },
   {
    "id": "PL-0342",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "네"
   },
   {
    "id": "PL-0343",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "힘내라"
   },
   {
    "id": "PL-0344",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "안녕히 계세요"
   },
   {
    "id": "PL-0345",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "ㅇㅋ 이따"
   },
   {
    "id": "PL-0346",
    "room": "talk.dm.13",
    "circle": "학원·선생님",
    "text": "ㅇㅋ 내일"
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
    "text": "seongwon.cafe님이 새 게시물을 올렸습니다"
   },
   {
    "id": "PL-0349",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "football.talk님이 새 게시물을 올렸습니다"
   },
   {
    "id": "PL-0350",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "meme.box님이 새 게시물을 올렸습니다"
   },
   {
    "id": "PL-0351",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "run.daily님이 스토리를 올렸습니다"
   },
   {
    "id": "PL-0352",
    "app": "loop",
    "appName": "루프",
    "circle": "앱",
    "text": "biz.hanseo님이 새 공지를 올렸습니다"
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
    "text": "한서대학교: 수강 정정 기간 안내"
   },
   {
    "id": "PL-0355",
    "app": "mail",
    "appName": "메일",
    "circle": "앱",
    "text": "가상몰: 주문하신 상품이 배송 완료되었습니다"
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
    "text": "수강 정정 기간이 곧 끝납니다"
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
    "text": "키워드 알림: 축구화"
   },
   {
    "id": "PL-0361",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 전에 제출 완료하자",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0362",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 마감이니까 오늘 끝내자",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0363",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지 남은 건 발표 연습뿐",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0364",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 놓치면 진짜 큰일 난다",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0365",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59까지 PPT 최종 확인",
    "window": [
     21,
     24
    ]
   },
   {
    "id": "PL-0366",
    "room": "talk.team3",
    "circle": "한서대 경영 26 동기",
    "text": "3/18 23:59 전에 자료 링크 정리",
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
