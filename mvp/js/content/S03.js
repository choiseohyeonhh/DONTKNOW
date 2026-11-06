(function () {
  const G = window.__game;
  const SAY = G.SAY;
  const CHOICE = G.CHOICE;
  const DO = G.DO;
  const MONO = G.MONO;
  const GOTO = G.GOTO;
  const LABEL = G.LABEL;
  const END = G.END;

  G.defPlace({ id: 'school', name: '성원고', scene: 'scene_school_gate', travelMin: { home: 20 } });

  const setScene = (scene) => DO(() => {
    const d = G.S.dlg;
    if (!d) return;
    d.scene = scene;
    G.refresh();
  });

  const ABSENCE_LINES = [
    '아버님, 말씀드린 결석 날짜입니다.',
    '4/8 4/22 4/29',
    '5/13 5/27',
    '6/10 6/24',
    '7/8 7/15',
    '8/19 8/26',
    '9/9 9/23',
    '10/14 10/28',
    '11/4 11/18',
    '12/2 12/16',
    '전부 병결로 처리됐습니다.',
  ];

  function sendAbsenceDates() {
    if (G.flag('S03.datesSent')) return;
    G.setFlag('S03.datesSent');
    G.addContact({ id: 'teacher', name: '김선생님(도현 고3담임)', num: '010-XXXX-7730', kind: 'normal', th: 'teacher' });
    ABSENCE_LINES.forEach((text, i) => {
      G.later(i * 120, () => {
        G.addMsg('teacher', G.nowMsg('them', text), { banner: i === 0 });
      }, 'S03.dates');
    });
  }

  function sendSeoyeon() {
    if (G.flag('S03.seoyeonSent')) return;
    G.setFlag('S03.seoyeonSent');
    G.addTalkContact({ id: 'seoyeon', name: '한서연' });
    const lines = [
      '안녕하세요 도현이랑 같은 반이었던 한서연이에요',
      '김쌤한테 연락받았어요',
      '도현이 폰 두 개 썼어요',
      '하나는 진짜 옛날 폰이요',
      '쉬는 시간마다 그거 보고 있었어요',
    ];
    lines.forEach((text, i) => {
      G.later(i * 700, () => {
        G.addTalkMsg('seoyeon', G.nowMsg('them', text), { banner: i === 0 });
      }, 'S03.seoyeon');
    });
  }

  function finishS3() {
    if (G.flag('S03.ended')) return;
    G.setFlag('S03.ended');
    G.endSession('S03');
    G.addTalkContact({ id: 'guard', name: '성원아파트 경비실' });
    G.addTalkMsg('guard', G.nowMsg('them', '[경비실] 이상철 님, 손님 한 분이 댁 앞에서 기다리고 계십니다'), { banner: true });
    G.refresh();
  }

  const COUNSEL_AGAIN = [
    SAY('counselor', [], '…죄송해요. 그건 원칙이라서요.'),
    GOTO('counselChoice'),
  ];

  G.defDialogue('S03.school', [
    SAY('father', [], '교문은 나흘 전과 다를 게 없었다.'),
    SAY('teacher', [], '어머, 아버님. 졸업식 때 뵙고 처음 뵙네요.'),
    SAY('teacher', [], '도현이 일로 오셨죠. 작년 4월부터 월에 두세 번씩 결석했어요. 전부 병결로 처리됐고요.'),
    SAY('teacher', [], '그때마다 아버님이 확인해 주셨잖아요. 작년 1년 내내요.'),
    CHOICE([
      { label: { c: '제가요? 저는 그런 거 보낸 적 없는데요.' }, then: [
        SAY('teacher', [], '네? 그럴 리가요. 기록에 다 남아 있는데요.'),
      ] },
      { label: { c: '…' } },
    ]),
    setScene('scene_staffroom'),
    SAY('teacher', [], '처음에 제가 두 번 전화드렸는데 안 받으시더라고요. 그러고 바로 앱으로 답을 주셨잖아요. 학부모 앱으로요.', { kx: 'KX-10' }),
    SAY('teacher', [], '졸업생이라 생활기록부로 확인했는데, 성적은 한 번도 떨어지지 않았어요. 수시 최초합격이고요.'),
    SAY('teacher', [], '고3이 그렇게 빠지는데 성적은 계속 오르니까… 솔직히 아무도 걱정을 안 했어요.'),
    SAY('teacher', [], '작년 반장한테 한번 물어볼게요. 도현이랑 친했거든요.'),
    DO(sendSeoyeon),
    SAY('teacher', [], '결석한 날짜는 정리해서 문자로 보내드릴게요.'),
    DO(sendAbsenceDates),
    SAY('teacher', [], '상담 선생님도 한번 만나 보세요. 상담실은 2층 끝이에요.'),
    CHOICE([
      { label: { c: '상담실로 간다' }, then: [
        setScene('scene_counsel_room'),
        SAY('counselor', [], '상담 내용은 제가 함부로 말씀드리기가 좀…'),
        LABEL('counselChoice'),
        CHOICE([
          { label: { c: '도현이가 없어졌습니다. 나흘쨉니다.' }, then: [
            SAY('counselor', [], '고2 때였어요. 벌써 2년 전이네요. 누군가를 지키려고 한다고 했어요. 그게 누군지는 끝까지 말을 안 했고요. 다음에 또 오라고 했는데… 안 오더라고요. 그러다 졸업식 날 불쑥 다시 왔어요. \'이제 지킬 필요 없어질 것 같아요\' 그러더라고요. 웃으면서요. 그래서 저는 다 잘 풀린 줄 알았죠.', { kn: 'K-06' }),
            MONO('2년.'),
            END(),
          ] },
          { label: { c: '선생님, 부탁 좀 드리겠습니다.' }, then: COUNSEL_AGAIN },
          { label: { c: '…알겠습니다.' }, then: [
            SAY('teacher', [], '아버님, 윤쌤이 뭐라셨어요?'),
            END(),
          ] },
        ]),
      ] },
      { label: { c: '오늘은 이만 나갈게요.' }, then: [END()] },
    ]),
  ], { onEnd: finishS3 });

  window.startS3 = function startS3(mode = 'arrive') {
    const S = G.S;
    if (S.session === 'S03' && S.dlg) return;
    if (G.flag('S03.ended')) return;
    S.phase = 'free';
    S.place = 'school';
    S.unlocked = true;
    S.stack = [];
    S.ov = null;
    S.call = null;
    S.phoneUp = false;
    S.travel = null;
    if (S.clock[0] < 9 || (S.clock[0] === 9 && S.clock[1] < 0)) S.clock = [9, 0];
    G.startSession('S03');
    G.setFlag('S03.active');
    G.runDialogue('S03.school', { channel: 'face', who: 'teacher', scene: 'scene_school_gate' });
    G.nudge('S03', [
      [90000, () => {
        if (G.S.session !== 'S03' || G.flag('S03.ended')) return;
        if (!G.has('K-06') && !G.flag('S03.nudge90')) {
          G.setFlag('S03.nudge90');
          G.addMsg('teacher', G.nowMsg('them', '상담실은 2층 끝이에요. 윤 선생님이요.'));
        }
      }],
      [450000, () => {
        if (G.S.session !== 'S03' || G.flag('S03.ended')) return;
        if (!G.has('K-06') && !G.S.dlg) G.showMono('…상담실.');
      }],
    ]);
  };

  G.defSession('S03', () => window.startS3('jump'));

  G.onArrive('school', () => window.startS3('arrive'));

  G.onTalkOpen('seoyeon', () => {
    if (!G.has('K-07')) G.grant('K-07');
    if (G.flag('S03.seoyeonAnswered')) return;
    G.setTalkChoice('seoyeon', [
      { label: '알려줘서 고마워요', then: () => {
        G.setFlag('S03.seoyeonAnswered');
        G.later(700, () => G.addTalkMsg('seoyeon', G.nowMsg('them', '음 그게 다예요'), { banner: false }), 'S03.talk');
        G.later(1400, () => G.addTalkMsg('seoyeon', G.nowMsg('them', '도현이 찾으면 저한테도 연락 주세요'), { banner: false }), 'S03.talk');
      } },
      { label: '혹시 다른 건 없었어요?', then: () => {
        G.setFlag('S03.seoyeonAnswered');
        G.later(700, () => G.addTalkMsg('seoyeon', G.nowMsg('them', '음 그게 다예요'), { banner: false }), 'S03.talk');
        G.later(1400, () => G.addTalkMsg('seoyeon', G.nowMsg('them', '도현이 찾으면 저한테도 연락 주세요'), { banner: false }), 'S03.talk');
      } },
    ]);
  });

  G.onThreadOpen('teacher', () => {
    if (G.flag('S03.datesSent') && !G.has('KX-01')) G.grant('KX-01');
  });
})();
