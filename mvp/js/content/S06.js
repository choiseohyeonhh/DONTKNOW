(function () {
  const G = window.__game;
  const SAY = G.SAY;
  const CHOICE = G.CHOICE;
  const DO = G.DO;
  const GOTO = G.GOTO;
  const LABEL = G.LABEL;
  const END = G.END;

  G.defPlace({ id: 'mart', name: '하루마트 성원역점', scene: 'scene_mart_front', travelMin: { home: 30, police: 20, school: 25 } });

  const setScene = (scene) => DO(() => {
    const d = G.S.dlg;
    if (!d) return;
    d.scene = scene;
    G.refresh();
  });

  const FRAMES = [
    { at: 0, img: 'cctv_k1' },
    { at: 25, img: 'cctv_k2' },
    { at: 50, img: 'cctv_k3' },
    { at: 65, img: 'cctv_k4' },
    { at: 72, img: 'cctv_k5' },
    { at: 80, img: 'cctv_k6' },
    { at: 120, img: 'cctv_k7' },
  ];

  function openCctv() {
    G.openCctv({
      frames: FRAMES,
      start: 0,
      end: 150,
      window: [65, 80],
      need: 12,
      onDone: () => G.setFlag('S06.cctvSeen'),
    });
  }

  function sendJunhoNumber() {
    if (G.has('KX-03')) return;
    G.grant('KX-03');
    G.addContact({ id: 'junho', name: '103호', num: '010-XXXX-6103', kind: 'normal' });
    G.addMsg('jihoon', G.nowMsg('them', '준호 번호예요. 010-XXXX-6103. 103호예요.'), { banner: false });
  }

  function offerJunho() {
    if (G.has('KX-03') || G.flag('S06.numberOffered')) return;
    G.setFlag('S06.numberOffered');
    G.addMsg('jihoon', G.nowMsg('them', '아저씨 혹시 준호 번호 필요하세요?'));
    G.offerReply('jihoon', [
      { label: '필요하다', then: () => {
        G.later(700, sendJunhoNumber, 'S06.number');
      } },
    ]);
    G.schedule('S06.autoNumber', 12000, () => {
      if (!G.has('KX-03')) sendJunhoNumber();
    }, { cond: () => !G.has('KX-03') });
  }

  function finishS6() {
    if (G.flag('S06.done')) return;
    G.setFlag('S06.done');
    G.endSession('S06');
    G.later(2000, () => G.showMono('준호.'), 'S06.end');
    G.schedule('EV.S06.02', 30000, offerJunho, { cond: () => !G.has('KX-03') });
    G.refresh();
  }

  G.defDialogue('S06.mart', [
    SAY('father', [], '하루마트 성원역점. 형광등이 켜진 가게 안으로 들어간다.'),
    setScene('scene_mart_counter'),
    SAY('boss', [], '아, 그거 경찰한테 다 얘기했는데…'),
    LABEL('ask'),
    CHOICE([
      { label: { c: '그 애가 제 아들입니다.' }, then: [
        SAY('boss', [], '…아드님이요? 아이고, 그러셨어요.'),
        DO(() => G.setFlag('S06.toldFather')),
      ] },
      { label: { c: '잠깐이면 됩니다. 부탁드립니다.' }, cond: () => !G.flag('S06.softAsk'), do: () => G.setFlag('S06.softAsk'), then: [
        SAY('boss', [], '지금 좀 바빠서 그러는데…'),
        GOTO('ask'),
      ] },
    ]),
    SAY('boss', [], '이거, 계산대 모니터로 다시 돌려 드릴게요. 아들이 언제 지나갔는지 한번 보시죠.'),
    DO(openCctv),
    SAY('boss', [], '내가 그때 담배 피우러 나와 있었거든요. 근데 애 표정이… 겁에 질려 있었어요. 그건 집 나가는 애 얼굴이 아니었어.', { kn: 'K-12' }),
    LABEL('words'),
    CHOICE([
      { label: { c: '그 남자가 애한테 뭐라고 하던가요?' }, cond: () => !G.flag('S06.askedWords'), then: [
        SAY('boss', [], '남자가 \'네 아빠\' 어쩌고 한 것 같기도 하고… 확실하진 않아요.', { kx: 'KX-09' }),
        DO(() => G.setFlag('S06.askedWords')),
        GOTO('words'),
      ] },
      { label: { c: '…고맙습니다.' }, then: [END()] },
    ]),
  ], { onEnd: finishS6 });

  window.startS6 = function startS6(mode = 'arrive') {
    const S = G.S;
    if (S.session === 'S06' && S.dlg) return;
    if (G.flag('S06.done')) return;
    S.phase = 'free';
    S.place = 'mart';
    S.unlocked = true;
    S.stack = [];
    S.ov = null;
    S.call = null;
    S.phoneUp = false;
    S.travel = null;
    if (S.clock[0] < 13) S.clock = [13, 0];
    G.startSession('S06');
    G.setFlag('S06.active');
    G.runDialogue('S06.mart', { channel: 'face', who: 'boss', scene: 'scene_mart_front' });
    G.nudge('S06', [
      [90000, () => {
        if (G.S.session !== 'S06' || G.flag('S06.done')) return;
        if (G.S.cctv) G.setCctvTime(65);
        else if (!G.has('K-12')) G.addMsg('jihoon', G.nowMsg('them', '아저씨, 경찰은 뭐래요?'));
      }],
      [450000, () => {
        if (G.S.session !== 'S06' || G.flag('S06.done')) return;
        if (G.S.cctv) G.setCctvTime(65);
        else G.startRoute('mart');
      }],
    ]);
  };

  G.defSession('S06', () => window.startS6('jump'));

  G.onArrive('mart', () => window.startS6('arrive'));
})();
