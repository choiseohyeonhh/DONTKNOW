(function () {
  const G = window.__game;

  G.defCine('CN-00', { skip: true, cuts: [
    { text: '2026년 3월 18일 수요일', dur: 2800 },
    { img: 'hall_night', origin: '50% 55%', from: 'scale(1.02)', to: 'scale(1.1) translateY(1%)', dur: 5600,
      cap: ['토요일 저녁, 늦는다는 문자를 끝으로 아들 도현은 집에 돌아오지 않았다.', '스무 살. 대학에 들어간 지 2주 만이었다.'] },
    { img: 'hall_night', origin: '47% 74%', from: 'scale(2.2)', to: 'scale(2.35)', dur: 4200, stamp: '02:47',
      cap: ['나흘째 되는 밤. 아버지 이상철은 아들 방 앞에 서 있다.', '손에 쥔 폰이, 지금 그가 가진 전부다.'] },
  ] });

  G.defPlace({ id: 'school', name: '성원고', scene: 'scene_school_gate', travelMin: { home: 20 } });

  window.startS1 = function startS1() {
    const S = G.S;
    S.phase = 'prologue';
    S.clock = [2, 47];
    S.place = 'home';
    S.unlocked = false;
    S.stack = [];
    S.ov = null;
    S.dlg = null;
    S.travel = null;
    S.navAnim = null;
    G.startSession('S01');
    G.refresh();
    G.playCine('CN-00', () => {
      S.phase = 'free';
      S.clock = [2, 47];
      S.unlocked = false;
      S.stack = [];
      S.navAnim = 'phoneup';
      G.refresh();
      G.schedule('S01.jihoon', 10000, window.s1JihoonEvent, { cond: () => G.S.session === 'S01' });
      G.nudge('S01', [
        [90000, () => {
          if (!G.flag('S01.jihoonOpened')) G.addMsg('jihoon', G.nowMsg('them', '아저씨?'));
        }],
        [180000, () => {
          if (!G.flag('S01.jihoonOpened') && G.flag('S01.jihoonEvent')) {
            G.S.ov = { type: 'incoming', name: '정지훈(도현친구)', from: 'jihoon' };
            G.refresh();
          }
        }],
        [300000, () => {
          if (G.S.session === 'S01') G.showMono('…지훈이.');
        }],
        [450000, () => {
          if (G.S.session === 'S01' && !G.flag('S01.jihoonOpened')) {
            G.S.unlocked = true;
            G.openThread('jihoon');
          }
        }],
      ]);
    });
  };

  window.s1JihoonEvent = function s1JihoonEvent() {
    const G = window.__game;
    if (G.flag('S01.jihoonEvent')) return;
    G.setFlag('S01.jihoonEvent');
    const lines = ['아저씨 혹시 주무세요?', '도현이가 아무한테도 말하지 말랬는데요', '저 아저씨한테 할 말이 있어요'];
    lines.forEach((text, i) => {
      G.later(i * 1000, () => {
        G.addMsg('jihoon', G.nowMsg('them', text));
        const top = G.S.stack[G.S.stack.length - 1];
        if (i === lines.length - 1 && G.S.session === 'S01' && top && top.app === 'msg' && top.id === 'jihoon') {
          window.startS2('msg');
        }
      }, 'S01.jihoon');
    });
  };

  G.defSession('S01', window.startS1);

  G.onThreadOpen('jihoon', () => {
    if (G.S.session !== 'S01') return;
    G.setFlag('S01.jihoonOpened');
    G.clearGroup('S01.jihoon');
    G.cancelNudge('S01');
    if (G.flag('S01.jihoonEvent') && !G.flag('S02.active')) window.startS2('msg');
  });

  G.onThreadOpen('hangyeol', (id, th, prevUnread) => {
    if (G.flag('FX-02')) return;
    G.setFlag('FX-02');
    th.divider = prevUnread;
    th.unread = 0;
    G.showMono('…나중에.');
    G.later(350, () => {
      if (!G.S.stack.length) return;
      G.nav('homeSlow');
      G.S.stack = [];
      G.refresh();
    }, 'av01');
  });

})();
