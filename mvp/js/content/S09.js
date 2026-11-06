(function () {
  const G = window.__game || window.DK;
  if (!G) return;

  const SAY = G.SAY;
  const CHOICE = G.CHOICE;
  const DO = G.DO;
  const MONO = G.MONO;
  const GOTO = G.GOTO;
  const LABEL = G.LABEL;
  const END = G.END;

  const CSS = `
.dk-photopick{position:absolute;inset:0;z-index:90;background:rgba(8,9,10,.96);display:flex;flex-direction:column;padding:62px 14px 26px;color:#fff;animation:dkS9Fade .2s ease both}
.dk-pp-head{display:flex;align-items:center;justify-content:space-between;padding:0 8px 14px;font-size:18px;font-weight:700}
.dk-pp-cancel{color:#8ab4ff;font-size:15px;font-weight:600;padding:4px 2px}
.dk-pp-grid{flex:1;overflow:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:5px;align-content:start}
.dk-pp-photo{aspect-ratio:1;border-radius:4px;overflow:hidden;background:#1b1d21;padding:0}
.dk-pp-photo img{width:100%;height:100%;object-fit:cover;display:block}
.dk-pp-photo.blank{background:linear-gradient(#3c4047,#25282d)}
.dk-pp-hint{padding:12px 8px 0;color:rgba(255,255,255,.45);font-size:12px}
.dk-afterimage{position:absolute;z-index:56;top:64px;left:16px;right:16px;text-align:center;font-size:16px;color:rgba(255,255,255,.72);filter:blur(.4px);opacity:0;animation:dkAfter 800ms ease both;pointer-events:none;text-shadow:0 1px 8px rgba(0,0,0,.6)}
.dk-toast{position:absolute;z-index:88;top:62px;left:18px;right:18px;padding:12px 16px;border-radius:18px;background:rgba(24,26,30,.92);color:#e8eaed;font-size:13.5px;line-height:1.45;text-align:center;box-shadow:0 12px 30px -12px rgba(0,0,0,.7);animation:dkToastIn .3s ease both;pointer-events:none;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
@keyframes dkAfter{0%{opacity:0}25%{opacity:.85}70%{opacity:.6}100%{opacity:0}}
@keyframes dkToastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
@keyframes dkS9Fade{from{opacity:0}to{opacity:1}}
`;

  function injectCSS() {
    if (document.getElementById('dk-s9-style')) return;
    const st = document.createElement('style');
    st.id = 'dk-s9-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  injectCSS();

  G.defPlace({
    id: 'pharmacy',
    name: '새봄약국',
    scene: 'scene_pharmacy_in',
    travelMin: { home: 20, school: 30, police: 20, mart: 20 },
  });

  G.defCine('CN-03', {
    skip: true,
    cuts: [
      {
        img: 'img/scene_pharmacy_shutter.jpg',
        origin: '50% 58%',
        from: 'scale(1.02)',
        to: 'scale(1.06)',
        dur: 5200,
        cap: ['그날 약국은 평소보다 일찍 셔터를 내렸다.'],
      },
      {
        img: 'img/scene_pharmacy_bench.jpg',
        origin: '50% 60%',
        from: 'scale(1.03)',
        to: 'scale(1.09)',
        dur: 4800,
      },
    ],
  });

  const pressure = () => Number(G.S.v.s9_pressure) || 0;

  function setScene(scene) {
    const d = G.S.dlg;
    if (!d) return;
    d.scene = scene;
    G.refresh();
  }

  function toast(text, ms = 3200) {
    const old = document.querySelector('.dk-toast');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'dk-toast';
    el.textContent = text;
    document.getElementById('screen').appendChild(el);
    G.later(ms, () => { if (el.isConnected) el.remove(); }, 'S09.toast');
  }

  function speakNudge(who, text, ms = 2400) {
    const d = G.S.dlg;
    if (!d) return;
    const oldLine = d.line;
    const oldWait = d.waiting;
    d.line = { who, text };
    G.refresh();
    G.later(ms, () => {
      if (G.S.dlg !== d || d.waiting !== oldWait) return;
      if (d.line && d.line.text === text) {
        d.line = oldLine;
        G.refresh();
      }
    }, 'S09.nudge');
  }

  function showAfterimage() {
    const el = document.createElement('div');
    el.className = 'dk-afterimage';
    el.textContent = '…나중에.';
    document.getElementById('screen').appendChild(el);
    G.later(850, () => { if (el.isConnected) el.remove(); }, 'S09.afterimage');
  }

  function resumeDialogue(nodes) {
    const d = G.S.dlg;
    if (!d) return;
    d.waiting = null;
    d.busy = false;
    d.awaitTap = true;
    d.line = { who: 'pharmacist', text: '…' };
    d.queue.length = 0;
    d.queue.unshift(...nodes);
    G.refresh();
    if (typeof G.faceNext === 'function') G.faceNext();
  }

  function openPhotoPicker() {
    const S = G.S;
    if (S.v.s9_pickerOpen) return;
    S.v.s9_pickerOpen = true;
    const photos = S.photos.map((p, i) => ({ src: p && p.src ? p.src : '', i }));
    const tiles = photos.map((p) => {
      if (!p.src) return `<button type="button" class="dk-pp-photo blank" data-pi="${p.i}" aria-label="사진"></button>`;
      return `<button type="button" class="dk-pp-photo" data-pi="${p.i}"><img src="${p.src}" alt=""></button>`;
    }).join('');
    const el = document.createElement('div');
    el.className = 'dk-photopick';
    el.innerHTML = `<div class="dk-pp-head"><span>사진</span><span class="dk-pp-cancel" data-cancel>취소</span></div>
      <div class="dk-pp-grid">${tiles}</div>
      <div class="dk-pp-hint">보여줄 사진을 고르세요</div>`;
    const stop = (e) => e.stopPropagation();
    el.addEventListener('click', stop);
    el.addEventListener('pointerdown', stop);
    el.addEventListener('click', (e) => {
      const cancel = e.target.closest('[data-cancel]');
      if (cancel) {
        closeAndHandle('cancel');
        return;
      }
      const btn = e.target.closest('[data-pi]');
      if (!btn) return;
      const i = Number(btn.dataset.pi);
      const p = S.photos[i];
      if (!p || !p.src) return;
      const key = p.id || String(p.src);
      closeAndHandle(key.indexOf('father_son') >= 0 || key.indexOf('photo_father_son_2022') >= 0 ? 'father_son' : 'other');
    });
    function closeAndHandle(result) {
      S.v.s9_pickerOpen = false;
      if (el.isConnected) el.remove();
      if (result === 'father_son') {
        G.setFlag('FX-05');
        G.setFlag('S09.guardDone');
        S.v.s9_path = 'photo';
        resumeDialogue([GOTO('testimony')]);
      } else if (result === 'other') {
        resumeDialogue([SAY('pharmacist', [], '…이건 뭐예요?'), GOTO('guard')]);
      } else {
        resumeDialogue([GOTO('guard')]);
      }
    }
    document.getElementById('screen').appendChild(el);
  }

  function guardNudges() {
    return [
      [90000, () => {
        const d = G.S.dlg;
        if (!d || d.id !== 'S09.pharmacist' || !d.waiting || G.flag('S09.guardDone')) return;
        speakNudge('pharmacist', '저… 다른 손님 기다리세요');
      }],
      [180000, () => {
        const d = G.S.dlg;
        if (!d || d.id !== 'S09.pharmacist' || G.flag('S09.guardDone')) return;
        G.showMono('…사진.');
      }],
      [450000, () => {
        const d = G.S.dlg;
        if (!d || d.id !== 'S09.pharmacist' || !d.waiting || G.flag('S09.guardDone')) return;
        if (!G.S.v.s9_pickerOpen) openPhotoPicker();
      }],
    ];
  }

  function armS9Travel() {
    const S = G.S;
    if (G.flag('S09.armed') || G.flag('S09.done')) return;
    G.setFlag('S09.armed');
    G.startSession('S09');
    G.setFlag('S09.awaitingTravel');
    G.nudge('S09', [
      [90000, () => {
        if (G.S.session !== 'S09' || G.flag('S09.done') || G.S.place === 'pharmacy') return;
        G.showMono('…새봄약국.');
      }],
      [180000, () => {
        if (G.S.session !== 'S09' || G.flag('S09.done') || G.S.place === 'pharmacy') return;
        toast("저장한 장소 '새봄약국' 영업 종료까지 1시간 30분");
      }],
      [300000, () => {
        if (G.S.session !== 'S09' || G.flag('S09.done') || G.S.place === 'pharmacy') return;
        G.addContact({ id: 'yujin', name: '차유진', num: '010-XXXX-4417', kind: 'normal', th: 'yujin' });
        G.addMsg('yujin', G.nowMsg('them', '아버님, 오늘 많이 피곤하시죠? 오늘은 일찍 쉬세요.'));
      }],
      [450000, () => {
        if (G.S.session !== 'S09' || G.flag('S09.done')) return;
        if (G.S.place === 'pharmacy') startS9Dialogue();
        else G.startRoute('pharmacy');
      }],
    ]);
  }

  function startS9Dialogue() {
    const S = G.S;
    if (G.flag('S09.done')) return;
    if (S.place !== 'pharmacy') return;
    if (S.dlg && S.dlg.id === 'S09.pharmacist') return;
    G.cancelNudge('S09');
    G.setFlag('S09.active');
    S.phase = 'free';
    S.unlocked = true;
    S.stack = [];
    S.ov = null;
    S.call = null;
    S.phoneUp = false;
    S.travel = null;
    const mins = S.clock[0] * 60 + S.clock[1];
    if (mins < 17 * 60) S.clock = [17, 0];
    if (mins >= 18 * 60 + 20) S.v.s9_late = true;
    G.startSession('S09');
    G.runDialogue('S09.pharmacist', {
      channel: 'face',
      who: 'pharmacist',
      scene: 'img/scene_pharmacy_in.jpg',
    });
    G.nudge('S09', guardNudges());
  }

  function waitHome(fn) {
    const tick = () => {
      const S = G.S;
      if (S.travel) { G.later(250, tick, 'S09.home'); return; }
      if (S.place === 'home') { fn(); return; }
      G.later(250, tick, 'S09.home');
    };
    G.later(250, tick, 'S09.home');
  }

  function finishS9(path) {
    const S = G.S;
    if (G.flag('S09.done')) return;
    G.setFlag('S09.done');
    G.setFlag('S09.ended');
    G.setFlag('S09.path.' + path);
    G.cancelNudge('S09');
    G.endSession('S09');
    S.call = null;
    S.ov = null;
    S.phoneUp = false;
    S.phase = 'prologue';
    G.refresh();
    const delay = S.v.s9_afterimage ? 1300 : 350;
    G.later(delay, () => {
      G.playCine('CN-03', () => {
        S.phase = 'free';
        S.clock = [18, 50];
        S.place = 'pharmacy';
        S.stack = [];
        S.ov = null;
        S.call = null;
        S.dlg = null;
        S.travel = null;
        G.startTravel('home');
        waitHome(() => {
          S.clock = [19, 10];
          S.place = 'home';
          S.travel = null;
          S.stack = [];
          S.ov = null;
          S.dlg = null;
          S.phase = 'free';
          S.unlocked = true;
          G.setFlag('S09.arrivedHome');
          if (typeof window.startS10 === 'function') {
            window.startS10();
          } else {
            G.startSession('S10');
            G.showMono('…집.');
          }
          G.refresh();
        });
      });
    }, 'S09.shutter');
  }

  G.defDialogue('S09.pharmacist', [
    SAY('father', [], '영수증 사진을 내민다.'),
    SAY('pharmacist', [], '죄송한데 그건 개인정보라 말씀 못 드려요.'),
    LABEL('guard'),
    CHOICE([
      {
        label: { c: '그럼 경찰서 가서 말씀하시겠습니까?' },
        cond: () => pressure() === 0,
        do: () => { G.S.v.s9_pressure = 1; },
        then: [
          SAY('pharmacist', [], '경찰이요? …그럼 경찰한테 말할게요.'),
          GOTO('guard'),
        ],
      },
      {
        label: { c: '그럼 경찰서 가서 말씀하시겠습니까?' },
        cond: () => pressure() >= 1,
        then: [
          SAY('pharmacist', [], '준호라는 애가 화요일마다 와서 받아 갔어요. 제가 아는 건 그게 다예요.', { kx: 'KX-17a' }),
          SAY('pharmacist', [], '이제 그만 가 주세요.'),
          DO(() => {
            G.setFlag('S09.guardDone');
            G.setFlag('S09.pressureEnd');
            G.S.v.s9_path = 'pressure';
          }),
          END(),
        ],
      },
      {
        label: { c: '(사진을 보여준다)' },
        do: () => openPhotoPicker(),
        then: [GOTO('guard')],
      },
      {
        label: { c: '제 아들 일 때문에 그럽니다.' },
        then: [
          SAY('pharmacist', [], '…아드님 사진 있으세요?'),
          DO(() => openPhotoPicker()),
          GOTO('guard'),
        ],
      },
    ]),
    LABEL('testimony'),
    SAY('pharmacist', [], '작년 봄부터였으니까… 1년 가까이 됐네요.'),
    SAY('pharmacist', [], '처방전 들고 들어온 건 거의 작은 애였어요. 준호, 그렇게 부르던 것 같고요.'),
    SAY('pharmacist', [], '이 학생은… 거의 매번 같이 왔어요. 안에는 안 들어오고 밖에서 기다리고요. 시계를 자꾸 보더라고요. 무슨 일정표라도 있는 사람처럼.'),
    SAY('pharmacist', [], '늘 화요일 낮이었어요. 평일 대낮에 교복 입은 애가 오니까 기억이 나요.'),
    CHOICE([
      {
        label: { c: '늘 화요일이었다고요?' },
        cond: () => G.has('KX-01'),
        then: [
          SAY('pharmacist', [], '…네. 늘요.', { kn: 'KX-12' }),
          MONO('…같은 날이다.'),
        ],
      },
      { label: { c: '…' } },
    ]),
    DO(() => setScene('scene_pharmacy_bench')),
    SAY('pharmacist', [], '1월이었나, 문 닫을 때쯤이었는데요. 저 앞 벤치에서 혼자 울고 있더라고요. 들어오라고 할까 하다가… 안 했어요.', { kn: 'K-17' }),
    CHOICE([
      {
        label: { c: '그걸 다 보시고도, 왜 신고를 안 하셨습니까.' },
        then: [
          SAY('pharmacist', [], '확인 전화 한 통이면 됐어요. 근데 안 했어요. 내 일 아니라고 생각했고… 매출도 있고요.'),
          SAY('pharmacist', [], '…아버님도 모르셨잖아요. 저도 몰랐던 걸로 했어요. 그렇게 하면 편하니까.'),
          DO(() => {
            if (!G.flag('FX-02')) return;
            G.S.v.s9_afterimage = true;
            showAfterimage();
          }),
          END(),
        ],
      },
      { label: { c: '…감사합니다.' }, then: [END()] },
    ]),
  ], { onEnd: () => finishS9(G.flag('S09.pressureEnd') ? 'pressure' : 'photo') });

  G.onArrive('pharmacy', () => startS9Dialogue());

  G.onThreadOpen('teacher', () => {
    // S03의 teacher 열람 훅(KX-01)을 보존하면서 S9의 RE.10을 얹는다.
    if (G.flag('S03.datesSent') && !G.has('KX-01')) G.grant('KX-01');
    if (G.S.session !== 'S09' || !G.flag('S09.active') || G.flag('S09.done')) return;
    if (!G.has('KX-01') || G.has('KX-12') || G.flag('S09.kx12')) return;
    G.setFlag('S09.kx12');
    G.grant('KX-12');
    G.later(2000, () => G.showMono('…같은 날이다.'), 'S09.mono');
  });

  window.armS9Travel = armS9Travel;
  window.startS9 = startS9Dialogue;

  G.defSession('S09', () => {
    G.S.place = 'pharmacy';
    G.S.clock = [17, 0];
    startS9Dialogue();
  });
})();
