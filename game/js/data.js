/* 셸 데이터: 앱 이름·홈 배치·잠금화면 알림. 앱별 콘텐츠는 각 apps/*.js 안에 둔다.
 * 캐논: design/03-features/SYSTEM_SHELL_SPECIFICATION.md 4.1~4.4, design/01-product/NARRATIVE_CANON.md 3절 */
(function () {
  'use strict';
  const LM = window.LM;

  LM.APPS = {
    phone: '전화', msg: '메시지', talk: '톡', loop: '루프', blink: '블링크', mail: '메일', photo: '사진', cam: '카메라',
    map: '지도', find: '찾기', cal: '캘린더', note: '메모', voice: '음성 메모', health: '건강', wallet: '지갑', bank: '누리은행',
    taxi: '바로택시', file: '파일', set: '설정', calc: '계산기', wave: '웨이브', tube: '튜브', moa: '모아', hankki: '한끼',
    market: '이웃마켓', cont: '연락처', rem: '미리 알림', clock: '시계', wthr: '날씨', portal: '한서 포털',
  };

  /* 홈 4×5 + 독 4, 3페이지. 캐논은 톡·루프를 1페이지와 독에 함께 두지만,
   * 같은 앱 아이콘 중복은 홈 문법에 없으므로 이 구현은 독에만 둔다(보고 사항). */
  LM.HOME = {
    dock: ['phone', 'msg', 'talk', 'loop'],
    pages: [
      ['mail', 'bank', 'photo', 'cam', 'map', 'cal', 'note', 'clock', 'wthr', 'portal', 'wave', 'tube', 'set'],
      ['hankki', 'market', 'moa', 'taxi', 'wallet', 'health', 'voice', 'file', 'cont', 'rem', 'find', { folder: '유틸', apps: ['calc', 'blink'] }],
      [],
    ],
  };

  /* 배지 숫자는 저장하지 않는다. engine/read.js가 앱별 안 읽은 항목에서 계산한다.
   * 읽음 개념이 없는 은행·포털은 홈 배지를 달지 않는다(PROTOTYPE_FINDINGS 2절·37). */

  /* 잠금화면 알림 23개(3/15 03:58 이전). 굵게 확정된 건 캐논 예시, 나머지는
   * Q-OPEN-106(문구 목록 미확정)이라 캐논 사실에서 끌어온 자리표시다. 미리보기: 메시지·톡·메일·은행 = 첫 줄,
   * 블링크·루프 DM = "새 메시지"만. 모든 알림은 앱의 실제 항목과 시각·이름·문구가 같다. */
  LM.NOTIFS = [
    { app: 'tube', t: '3/15 02:10', title: '머니코치 강', body: '새 영상: 당분간 영상 쉽니다' },
    { app: 'talk', t: '3/14 23:58', title: '지훈', body: '야 너 어디야 전화 좀 받아' },
    { app: 'talk', t: '3/14 23:41', title: '경영 26 새내기', body: '지훈: 단톡 왜 안 봐' },
    { app: 'talk', t: '3/14 22:52', title: '서아', body: '알겠어. 근데 무슨 일인데?' },
    { app: 'blink', t: '3/14 21:30', title: '블링크', body: '녹음했다고? 폰 내놔', hidden: true },
    { app: 'mail', t: '3/14 21:23', title: '바로택시', body: '[바로택시] 3월 14일 이용 영수증 12,400원' },
    { app: 'loop', t: '3/14 20:44', title: '루프', body: '새 메시지', hidden: true },
    { app: 'market', t: '3/14 20:30', title: '이웃마켓', body: '모니터 거래: 구매자가 메시지를 보냈어요' },
    { app: 'blink', t: '3/14 18:40', title: '블링크', body: '오늘 8시 사무실. 안 오면 니 아빠 회사로 간다', hidden: true },
    { app: 'portal', t: '3/14 17:00', title: '한서 포털', body: '[학사] 수강신청 정정 기간 안내' },
    { app: 'talk', t: '3/14 16:12', title: '경영 26 새내기', body: '지훈: 오늘 저녁 7시 학교 앞 ㄱ?' },
    { app: 'wthr', t: '3/14 07:00', title: '날씨', body: '성원동 오늘 최고 11° 최저 2°' },
    { app: 'msg', t: '3/13 10:02', title: '성원경찰서', body: '[성원경찰서] 이도현님, 수사과 금융범죄수사팀 김태윤 경위입니다. 3/20 10:00 출석요구 안내드립니다.' },
    { app: 'mail', t: '3/13 10:02', title: '성원경찰서', body: '출석요구서 (3/20 10:00)' },
    { app: 'portal', t: '3/13 09:00', title: '한서 포털', body: '[과제] 대학글쓰기 1차 과제 제출 마감 D-3' },
    { app: 'msg', t: '3/12 09:14', title: '누리은행', body: '[누리은행] 전기통신금융사기 관련 지급정지 안내' },
    { app: 'mail', t: '3/12 09:14', title: '누리은행', body: '전기통신금융사기 관련 지급정지 안내' },
    { app: 'bank', t: '3/12 09:14', title: '누리은행', body: '지급정지된 계좌입니다. 출금·이체할 수 없습니다.' },
    { app: 'loop', t: '3/12 00:10', title: '루프', body: 'seoa.film님이 스토리를 올렸습니다' },
    { app: 'msg', t: '3/11 18:30', title: '누리카드', body: '[자동이체 실패] 3/11 출금 잔액 부족' },
    { app: 'mail', t: '3/11 08:00', title: '한서대학교', body: '새내기 오리엔테이션 사진 공유' },
    { app: 'talk', t: '3/10 22:04', title: '지훈', body: '내일 학식 ㄱ?' },
    { app: 'msg', t: '3/10 15:20', title: '이웃마켓', body: '[이웃마켓] 인증번호는 [482913] 입니다' },
  ];

  /* 응급정보(E-07) */
  LM.MEDICAL = { name: '이도현', birth: '2007년 9월 21일', blood: 'A+', memo: '왼쪽 손목 골절 수술(2021)', contact: { name: '정지훈', rel: '친구', num: '010-XXXX-2290' } };
  LM.PASSCODE = '070921';
})();
