
(function () {
  const G = window.__game || window.DK;
  if (!G) return;

  const SAY = G.SAY;
  const CHOICE = G.CHOICE;
  const DO = G.DO;
  const WAIT = G.WAIT;
  const GOTO = G.GOTO;
  const LABEL = G.LABEL;
  const END = G.END;
  const flag = (k) => G.flag(k);
  const has = (k) => G.has(k);
  const say = (who, text, extra) => SAY(who, [], text, extra);

  const S13_CSS = `
body.dk-s13-lock .scene .phonebtn,body.dk-s13-lock .scene-back{display:none!important}
body.dk-s13-lock .homeind{opacity:0;pointer-events:none}
body.s13-choice1 .scene .choices button:first-child{min-height:152px;padding:15px 16px;font-size:16px;line-height:1.55;white-space:pre-line;background:rgba(255,255,255,.16)}
body.s13-choice1 .scene .choices button:first-child:active{background:rgba(255,255,255,.26)}
.s13-fade{position:absolute;inset:0;z-index:85;background:#000;opacity:0;transition:opacity .75s ease;pointer-events:none}
.s13-fade.on{opacity:1}
`;

  function injectCSS() {
    if (document.getElementById('dk-s13-style')) return;
    const st = document.createElement('style');
    st.id = 'dk-s13-style';
    st.textContent = S13_CSS;
    document.head.appendChild(st);
  }

  const picks = () => Number(G.S.v.s13_probe_count) || 0;
  const isA2 = () => flag('F-01')
    || (G.S.v && (G.S.v.branchA === 'A-2' || G.S.v.branch_A === 'A-2'))
    || !!(G.S.branch && G.S.branch.A === 'A-2');
  const canProbe = (id, extra) => () => picks() < 2 && !flag('S13.probe' + id) && extra();

  function probe(id, text, cond, then) {
    return {
      label: { c: text },
      cond,
      do: () => {
        G.S.v.s13_probe_count = picks() + 1;
        G.setFlag('S13.probe' + id);
      },
      then: [...then, GOTO('explore')],
    };
  }

  const H01 = '도현이가 먼저 왔어요. 고2 때, 준호 빼달라고. 그리고 이번엔 그만두겠다고. 그래서 붙잡았어요. 2년을 데리고 있었는데, 문자 한 통으로 끝내자는 게 말이 됩니까.';
  const H02 = '저도 열여덟에 이랬어요. 저희 아버지도 망했거든요. 근데 저희 아버지는 끝까지 아무 말도 안 했어요. 제가 뭘 하는지도 몰랐고, 알려고도 안 했어요. 도현이 보니까 그때 제가 보이더라고요. 그래서 못 놓겠어요. 붙잡는 게 사랑이 아닌 건 알아요. 근데 놓으면 걔도 저처럼 혼자 될 것 같아서.';
  const H03 = '걔 비밀번호, 아버님 생일이에요. 알고 계셨어요? 저는 그게 제일 싫었어요.';
  const DEAL_1 = '아버님 빚, 남은 3천 제가 정리해 드릴게요. 도현이가 모아둔 자취 보증금도 그대로 두고요. 학교도 계속 다니게 하고요. 대신 아버님은 아무것도 모르는 걸로 하세요. 지금까지처럼.';
  const DEAL_2 = '2년 반 동안 잘 하셨잖아요.';

  const CHOICE1 = '그 빚, 내가 숨긴 거다.\n도현이가 그걸 갚고 있었다는 거, 오늘 알았다.\n3년 동안 아무것도 안 물어본 건 나다.\n그러니까 이번엔 내가 갚는다.\n도현이 데려와.';
  const CONFESS_2 = '그리고 내일 아침 아홉 시에, 도현이랑 같이 경찰서 간다. 걔가 한 일은 걔 입으로 말해야지. 나는 옆에 있을 거다.';
  const CONFESS_2_F03 = '…경찰은 이미 안다. 걔가 한 일은 걔 입으로 말해야지. 나는 옆에 있을 거다.';

  injectCSS();

  G.defPlace({
    id: 'parking',
    name: '성원 공영주차장',
    scene: 'scene_parking_b3',
    travelMin: { home: 25, school: 35, police: 20, mart: 20, pharmacy: 20 },
  });

  G.defCine('CN-05', {
    skip: true,
    cuts: [
      {
        img: 'img/scene_parking_b3.jpg',
        origin: '50% 58%',
        from: 'scale(1.02)',
        to: 'scale(1.08)',
        dur: 5200,
        stamp: '23:00',
        cap: ['밤 11시. 성원 공영주차장 지하 3층.'],
      },
    ],
  });

  G.defDialogue('S13.hyung', [
    
    DO(() => {
      const d = G.S.dlg;
      if (!d) return;
      const q = [];
      if (flag('F-03')) q.push(say('hyung', '경찰서 다녀오셨다면서요. 그래도 혼자 오셨네요.'));
      q.push(say('hyung', '아버님, 처음 뵙겠습니다. 도현이가 말 많이 했어요. 아, 좋은 말은 아니고요.'));
      if ((Number(G.S.v.hyung_0091_calls) || 0) >= 1) q.push(say('hyung', '전화 많이 하셨더라고요.'));
      d.queue.unshift(...q);
    }),

    LABEL('explore'),
    CHOICE([
      probe(
        '01',
        '유진이라는 여자애가 우리 집에 왔었다.',
        canProbe('01', () => (has('K-08') || has('K-10')) && !isA2()),
        [say('hyung', '유진? 처음 듣는 이름인데요.')],
      ),
      probe(
        '02',
        '도현이 옛날 폰. 그거 지금 나한테 있다.',
        canProbe('02', () => has('K-18')),
        [
          WAIT(3000),
          say('hyung', '…그거 없앴는데.'),
        ],
      ),
      probe(
        '03',
        '애한테 \'네 아빠\' 소리 했다며.',
        canProbe('03', () => has('KX-09')),
        [say('hyung', '…편의점 사장님이 귀가 밝으시네.')],
      ),
      probe(
        '04',
        '15일 새벽에 나한테 전화한 거, 너지?',
        canProbe('04', () => has('KX-05')),
        [say('hyung', '그날 받으셨으면 얘기가 달랐을 텐데.')],
      ),
      {
        label: { c: '…' },
        then: [
          say('hyung', '역시 아무것도 모르시네요.'),
          GOTO('stage2'),
        ],
      },
    ]),

    LABEL('stage2'),
    say('hyung', H01),
    CHOICE([
      {
        label: { c: '먼저 부른 건 너잖아. 그날 저녁 6시 39분에.' },
        cond: () => has('K-22'),
        then: [
          DO(() => {
            const d = G.S.dlg;
            if (!d) return;
            d.line = { who: 'hyung', text: '…' };
            G.refresh();
          }),
          WAIT(1400),
          GOTO('h02'),
        ],
      },
      {
        label: { c: '그만둔다고 했으면 놔줬어야지.' },
        cond: () => has('K-21'),
        then: [
          say('hyung', '놔주기로 했죠. 부를 때 오라고.'),
          GOTO('h02'),
        ],
      },
      {
        label: { c: '…' },
        then: [GOTO('h02')],
      },
    ]),

    LABEL('h02'),
    say('hyung', H02),
    say('hyung', H03),
    DO(() => {
      if (flag('S13.probe04') || G.S.v.s13_heard0091) return;
      G.S.v.s13_heard0091 = true;
      const d = G.S.dlg;
      if (!d) return;
      d.queue.unshift(say('hyung', '그날 받으셨으면 얘기가 달랐을 텐데.'));
    }),

    say('hyung', DEAL_1),
    WAIT(1200),
    say('hyung', DEAL_2),

    DO(() => {
      document.body.classList.toggle('s13-choice1', has('K-19') && has('K-20'));
    }),

    CHOICE([
      {
        label: { c: CHOICE1 },
        cond: () => has('K-19') && has('K-20'),
        then: [
          DO(() => {
            G.setFlag('F-05');
            G.S.v.s13_choice = 1;
            G.S.v.s13_code = 'D-1';
          }),
          DO(() => {
            const d = G.S.dlg;
            if (!d) return;
            d.queue.unshift(say('father', flag('F-03') ? CONFESS_2_F03 : CONFESS_2));
          }),
          WAIT(4000),
          say('hyung', '…시간을 주세요. 걔한테 물어볼게요.'),
          DO(() => G.setFlag('S13.hyungLeft')),
          END(),
        ],
      },
      {
        label: { c: '…알겠다.' },
        cond: () => !flag('F-03'),
        then: [
          DO(() => {
            G.setFlag('F-06');
            G.S.v.s13_choice = 2;
            G.S.v.s13_code = 'D-2';
          }),
          END(),
        ],
      },
      {
        label: { c: '…신고 취소하겠다.' },
        cond: () => flag('F-03'),
        then: [
          DO(() => {
            G.setFlag('F-06');
            G.S.v.s13_choice = 2;
            G.S.v.s13_code = 'D-2';
          }),
          say('hyung', '이미 늦으셨어요.'),
          END(),
        ],
      },
      {
        label: { c: '내일 아침에 경찰서 가서 다 말할 거다.' },
        cond: () => !flag('F-03'),
        then: [
          DO(() => {
            G.S.v.s13_choice = 3;
            G.S.v.s13_code = 'D-3';
          }),
          say('hyung', '그럼 도현이도 같이 들어가겠네요.'),
          END(),
        ],
      },
      {
        label: { c: '이미 경찰에 다 말했다.' },
        cond: () => flag('F-03'),
        then: [
          DO(() => {
            G.S.v.s13_choice = 3;
            G.S.v.s13_code = 'D-3';
          }),
          say('hyung', '그럼 도현이도 같이 들어가겠네요.'),
          END(),
        ],
      },
      {
        label: { c: '네가 내 아들한테 그 약 일 시킨 거지.' },
        cond: () => flag('F-04') || !has('K-17'),
        then: [
          DO(() => {
            G.S.v.s13_choice = 4;
            G.S.v.s13_code = 'D-C';
          }),
          say('hyung', '봐요. 아버님은 아직도 몰라요.'),
          END(),
        ],
      },
    ]),
  ], { onEnd: finishS13 });

  function outro(ms, done) {
    const host = document.getElementById('screen') || document.body;
    const el = document.createElement('div');
    el.className = 's13-fade';
    host.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on')));
    G.later(ms, done, 'S13.out');
  }

  function finishS13() {
    if (flag('S13.ended')) return;
    G.setFlag('S13.ended');
    G.endSession('S13');
    document.body.classList.remove('s13-choice1');
    const choice = Number(G.S.v.s13_choice) || 0;
    outro(choice === 1 ? 3600 : 1400, () => {
      document.body.classList.remove('dk-s13-lock');
      G.S.unlocked = true;
      if (typeof G.resolveEnding === 'function') G.resolveEnding();
      else if (typeof window.resolveEnding === 'function') window.resolveEnding();
      else console.error('[DONTKNOW] resolveEnding is missing');
    });
  }

  window.startS13 = function startS13() {
    const S = G.S;
    if (flag('S13.ended')) return;
    if (S.session === 'S13' && S.dlg) return;
    if (S.session === 'S13' && S.cine) return;

    S.phase = 'free';
    S.place = 'parking';
    S.clock = [23, 0];
    S.unlocked = false;
    S.stack = [];
    S.ov = null;
    S.call = null;
    S.banner = null;
    S.mono = null;
    S.phoneUp = false;
    S.travel = null;
    S.routePlace = null;
    S.navAnim = null;
    S.v.s13_probe_count = 0;
    S.v.s13_choice = null;
    S.v.s13_code = null;
    S.v.s13_heard0091 = false;

    try { G.cancelNudge('S12'); G.cancelNudge('S13'); } catch (e) {}
    G.startSession('S13');
    G.setFlag('S13.active');
    injectCSS();
    document.body.classList.add('dk-s13-lock');

    G.playCine('CN-05', () => {
      if (G.S.session !== 'S13') return;
      G.runDialogue('S13.hyung', { channel: 'face', who: 'hyung', scene: 'scene_parking_b3' });
    });
    G.refresh();
  };

  G.startS13 = window.startS13;
  G.defSession('S13', () => window.startS13('jump'));

  G.onArrive('parking', () => {
    if (G.flag('S13.ended')) return;
    window.startS13('arrive');
  });
})();
