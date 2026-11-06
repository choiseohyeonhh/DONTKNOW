(function () {
  const G = window.__game;
  const SAY = G.SAY;
  const CHOICE = G.CHOICE;
  const DO = G.DO;
  const END = G.END;

  const FATHER_OPEN = '어, 지훈아. 아저씨다.';
  const CH = (opts, extra = {}) => CHOICE([...opts, { label: { m: '(전화한다)' }, switch: true }], extra);
  const BYE = SAY('jihoon', ['네', '아저씨 도현이 소식 있으면 저한테도 꼭 알려주세요'], '네… 아저씨, 도현이 소식 있으면 저한테도 꼭 알려 주세요.');
  const GOODNIGHT = () => ({
    label: { m: '그래 알았다. 늦었는데 얼른 자라', c: '그래, 알았다. 늦었는데 얼른 자라.' },
    then: [BYE, END()],
  });

  G.defDialogue('S02.jihoon', [
    CH([{ label: { m: '그래 지훈아 무슨 일이냐' } }], { opener: true }),
    SAY('jihoon', ['죄송해요 이 시간에', '나흘 내내 참았는데', '도저히 안 되겠어서요'], '죄송해요, 이 시간에… 나흘 내내 참았는데 도저히 안 되겠어서요.'),
    CH([
      { label: { m: '근데 왜 이제야 말하는 거냐', c: '근데… 왜 이제야 말하는 거냐.' },
        then: [SAY('jihoon', ['도현이가 아무한테도 말하지 말라고 해서요', '진짜 죄송해요'], '도현이가 아무한테도 말하지 말라고 해서요… 진짜 죄송해요.')] },
      { label: { m: '그래 연락 줘서 고맙다', c: '그래. 전화 줘서 고맙다.' },
        then: [SAY('jihoon', ['아니에요', '아 그리고 아저씨', '도현이가 아저씨 얘기 자주 했어요', '아저씨 걱정된다고'], '아니에요. 아, 그리고 아저씨… 도현이가 아저씨 얘기 자주 했어요. 아저씨 걱정된다고.', { kx: 'KX-02' })] },
    ]),
    SAY('jihoon', ['3월 들어서부터 좀 이상했어요', '밥 먹자 해도 잘 안 먹고', '폰만 계속 들여다보고', '잘 웃지도 않고요'],
      '3월 들어서부터 좀 이상했어요. 점심 먹자 해도 거르고, 폰만 계속 들여다보고… 잘 웃지도 않았고요.', { kn: 'K-01' }),
    CH([
      { label: { m: '그 전에는 괜찮았고?', c: '그 전에는? 그 전엔 괜찮았냐.' },
        then: [SAY('jihoon', ['사실 고1 겨울부터 좀 조용해지긴 했어요', '고2 땐 과외 알바 한다고 맨날 바빴고요', '근데 저는 그냥 원래 그런 앤 줄 알았어요'],
          '사실 고1 겨울부터 좀 조용해지긴 했어요. 고2 땐 과외 알바 한다고 맨날 바빴고요. 근데 저는 그냥 걔가 원래 그런 앤 줄 알았어요.')] },
      { label: { m: '폰을 계속 봤다고?', c: '폰을 계속 봤다고?' }, then: [
        SAY('jihoon', ['네 맨날 뭘 확인하더라고요'], '네, 맨날 뭘 확인하더라고요.'),
        CH([
          { label: { c: '혹시 도현이 폰 비밀번호 아냐?' }, call: true,
            then: [SAY('jihoon', [], '비번은 모르는데… 걔 맨날 가족 생일 같은 거 써요. 촌스럽다고 제가 놀렸었는데.', { kn: 'K-05' })] },
          { label: { m: '그래', c: '그래.' } },
        ]),
      ] },
    ]),
    SAY('jihoon', ['그리고 13일 밤에', '걔가 저 학원 앞으로 왔었어요', '갑자기 내일 끝난다고', '뭐가 끝나냐니까 대학 오기 전에 끝냈어야 했던 거래요', '그게 다였어요'],
      '13일 밤에 걔가 저 학원 앞으로 왔었어요. 갑자기 내일 끝난다고. 뭐가 끝나냐니까, 대학 오기 전에 끝냈어야 했던 거라고만 하고…', { kn: 'K-02' }),
    SAY('jihoon', ['대학 생활 어떠냐고 물어봤는데', '그냥 웃기만 했어요'], '대학 생활 어떠냐니까 그냥 웃기만 하더라고요.'),
    SAY('jihoon', ['아 그리고 준호요', '아랫집 사는 고2', '요즘 둘이 자주 붙어 다녔어요'], '아, 그리고 준호라고… 아랫집 사는 고2요. 요즘 걔랑 둘이 자주 붙어 다녔어요.', { kn: 'K-03' }),
    DO(() => {
      const d = G.S.dlg;
      if (!d) return;
      if (d.channel === 'call') {
        d.queue.unshift(SAY('jihoon', [], "그리고 이건 좀 이상했는데… 걔가 누구랑 통화하면서 계속 '형, 형' 하더라고요. 걔 친형 없잖아요.", { kn: 'K-04' }));
      } else {
        d.queue.unshift(SAY('jihoon', ['하나 더 있는데', '이건 전화로 말씀드릴게요'], ''));
      }
    }),
    CH([
      { label: { c: '대학 친구들한테는 물어봤냐?' }, call: true,
        then: [SAY('jihoon', [], '대학은 들어간 지 2주밖에 안 됐잖아요. 거기 애들은 도현이 잘 몰라요. 걔 아는 사람은 다 성원고에 있어요.'),
          SAY('jihoon', [], '아, 윤쌤… 상담 선생님 한번 찾아가 보세요. 졸업식 날 걔 상담실 들어가는 거 봤어요.', { kx: 'KX-04' }),
          CH([GOODNIGHT()])] },
      GOODNIGHT(),
    ]),
  ], { onEnd: () => window.s2End() });

  window.startS2 = function startS2(mode = 'msg') {
    const S = G.S;
    if (G.flag('S02.ended')) return;
    if (S.session === 'S02' && G.flag('S02.active')) {
      if (mode === 'call' && S.dlg && S.dlg.channel === 'sms') {
        const opts = S.dlg.waiting ? G.visibleOpts(S.dlg.waiting) : [];
        const i = opts.findIndex((o) => o.switch);
        if (i >= 0) G.choose(i);
      }
      return;
    }
    G.clearGroup('S01.jihoon');
    G.cancelNudge('S01');
    S.session = 'S02';
    S.phase = 'free';
    S.clock = [2, 50];
    S.place = 'home';
    S.unlocked = true;
    G.startSession('S02');
    G.setFlag('S02.active');
    const top = S.stack[S.stack.length - 1];
    if (!(top && top.app === 'msg' && top.id === 'jihoon')) {
      G.openThread('jihoon');
    }
    G.runDialogue('S02.jihoon', { channel: mode === 'call' ? 'call' : 'sms', who: 'jihoon', opening: FATHER_OPEN });
    G.nudge('S02', [
      [90000, () => {
        if (G.S.session === 'S02' && G.S.dlg && G.S.dlg.channel === 'sms') G.addMsg('jihoon', G.nowMsg('them', '아저씨 보셨어요?'));
      }],
      [180000, () => {
        if (G.S.session === 'S02' && G.S.dlg && G.S.dlg.channel === 'sms') {
          G.addMsg('jihoon', G.nowMsg('them', '제가 전화 드려도 될까요?'));
          G.S.ov = { type: 'incoming', name: '정지훈(도현친구)', from: 'jihoon' };
          G.refresh();
        }
      }],
    ]);
  };

  window.s2End = function s2End() {
    const S = G.S;
    if (G.flag('S02.ended')) return;
    G.setFlag('S02.ended');
    G.cancelNudge('S02');
    G.clearGroup('q');
    G.clearGroup('S02.end');
    S.call = null;
    S.ov = null;
    S.phoneUp = false;
    S.unlocked = true;
    G.refresh();
    G.later(2000, () => {
      G.showMono('성원고.');
      G.registerDest('school');
      G.setFlag('MO.02');
    }, 'S02.end');
    G.later(4300, () => {
      S.clock = [3, 30];
      G.playCine('CN-01', () => {
        S.clock = [8, 40];
        S.place = 'home';
        S.stack = [];
        S.ov = null;
        S.call = null;
        S.dlg = null;
        S.unlocked = false;
        S.session = 'S03';
        S.sessionDone.S02 = true;
        S.destinations = [...new Set([...S.destinations, 'school'])];
        S.navAnim = 'phoneup';
        G.refresh();
        G.saveCheckpoint();
      });
    }, 'S02.end');
  };

  G.defCine('CN-01', { skip: true, cuts: [
    { img: 'hall_night', origin: '47% 74%', from: 'scale(2.35)', to: 'scale(1.7)', dur: 4200, stamp: '03:30',
      cap: ['그 뒤로도 잠은 오지 않았다.'] },
    { roll: ['03:30', '08:40'], dur: 2800 },
    { img: 'hall_night', filter: 'morning', origin: '50% 55%', from: 'scale(1.0)', to: 'scale(1.06)', dur: 4400, stamp: '08:40',
      cap: ['아침이 왔다. 방문은 여전히 닫혀 있다.', '도현이 3년을 다닌 학교, 성원고로 간다.'] },
  ] });

  G.defSession('S02', () => window.startS2('msg'));

  G.onAccept(() => {
    const S = G.S;
    if (S.session === 'S01' && G.flag('S01.jihoonEvent')) {
      S.ov = null;
      window.startS2('call');
      return true;
    }
    if (S.session === 'S02' && S.dlg && S.dlg.channel === 'sms') {
      S.ov = null;
      G.switchToCall();
      return true;
    }
    return false;
  });

  G.onDialContact('jihoon', () => {
    const S = G.S;
    if (S.session === 'S01') {
      if (G.flag('S01.jihoonEvent')) { window.startS2('call'); return true; }
      return false;
    }
    if (S.session === 'S02') {
      const d = S.dlg;
      if (d && d.channel === 'call') return true;
      if (d && d.channel === 'sms') {
        const opts = d.waiting ? G.visibleOpts(d.waiting) : [];
        const i = opts.findIndex((o) => o.switch);
        if (i >= 0) { G.choose(i); return true; }
        G.switchToCall();
        return true;
      }
    }
    return false;
  });
})();
