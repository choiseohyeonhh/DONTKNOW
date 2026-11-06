(function () {
  const G = window.__game || window.DK;
  if (!G) return;

  const SAY = G.SAY;
  const CHOICE = G.CHOICE;
  const DO = G.DO;
  const END = G.END;

  const CSS = `
body.dk-s8-silence #cine .tap, body.dk-s8-silence #cine .skip { display: none !important; }
.dk-receipt{position:absolute;inset:0;z-index:90;background:rgba(4,5,6,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:66px 24px 46px;animation:dkS8Fade .25s ease both}
.dk-receipt-card{width:100%;max-height:610px;display:grid;place-items:center;overflow:hidden;border-radius:8px;animation:dkS8Zoom .65s cubic-bezier(.2,.8,.2,1) both}
.dk-receipt-card img{max-width:100%;max-height:610px;object-fit:contain;filter:contrast(1.03) brightness(1.02);box-shadow:0 20px 50px -18px rgba(0,0,0,.85)}
.dk-receipt-close{min-width:130px;height:44px;border-radius:22px;background:rgba(255,255,255,.16);color:#fff;font-size:15px;font-weight:700;border:.5px solid rgba(255,255,255,.22)}
@keyframes dkS8Zoom{from{transform:scale(.62);opacity:0}to{transform:scale(1.02);opacity:1}}
@keyframes dkS8Fade{from{opacity:0}to{opacity:1}}
`;

  function injectCSS() {
    if (document.getElementById('dk-s8-style')) return;
    const st = document.createElement('style');
    st.id = 'dk-s8-style';
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

  G.defCine('CN-02', {
    skip: false,
    cuts: [
      {
        img: 'img/scene_entrance_in_a.jpg',
        origin: '50% 52%',
        from: 'scale(1.0)',
        to: 'scale(1.02)',
        dur: 5200,
      },
    ],
  });

  function setScene(scene, channel) {
    const d = G.S.dlg;
    if (!d) return;
    d.scene = scene;
    if (channel) d.channel = channel;
    G.refresh();
  }

  function armS8Home() {
    const S = G.S;
    if (G.flag('S08.done') || G.flag('S08.active') || G.flag('S08.armed')) return;
    G.setFlag('S08.armed');
    G.setFlag('S08.awaitingHome');
    G.startSession('S08');
    G.nudge('S08', [
      [90000, () => {
        if (G.S.session !== 'S08' || G.flag('S08.done') || G.flag('S08.active')) return;
        G.addMsg('jihoon', G.nowMsg('them', '아저씨 집에 계세요?'));
      }],
      [180000, () => {
        if (G.S.session !== 'S08' || G.flag('S08.done') || G.flag('S08.active')) return;
        G.addTalkContact({ id: 'guard', name: '성원아파트 경비실' });
        G.addTalkMsg('guard', G.nowMsg('them', '[경비실] 댁 앞에 어떤 분이 계속 서성인다고 민원이 들어와서요'));
      }],
      [300000, () => {
        if (G.S.session !== 'S08' || G.flag('S08.done') || G.flag('S08.active')) return;
        G.showMono('…집.');
      }],
      [450000, () => {
        if (G.S.session !== 'S08' || G.flag('S08.done') || G.flag('S08.active')) return;
        if (G.S.place === 'home') tryStartS8();
        else G.startRoute('home');
      }],
    ]);
    G.later(8000, function watchHome() {
      if (G.flag('S08.done') || G.flag('S08.active')) return;
      if (G.S.place === 'home' && !G.S.travel && !G.S.dlg) {
        tryStartS8();
        return;
      }
      G.later(600, watchHome, 'S08.watch');
    }, 'S08.watch');
  }

  function tryStartS8() {
    const S = G.S;
    if (G.flag('S08.done') || G.flag('S08.active')) return;
    if (S.place !== 'home') return;
    if (S.dlg && (S.dlg.channel === 'face' || S.dlg.channel === 'intercom')) return;
    G.cancelNudge('S08');
    G.setFlag('S08.active');
    S.phase = 'free';
    S.unlocked = true;
    S.stack = [];
    S.ov = null;
    S.call = null;
    S.phoneUp = false;
    S.travel = null;
    const mins = S.clock[0] * 60 + S.clock[1];
    if (mins < 16 * 60 + 10) S.clock = [16, 10];
    S.v.s8_mode = 'intercom';
    G.startSession('S08');
    G.runDialogue('S08.minjae', {
      channel: 'intercom',
      who: 'minjae',
      scene: 'img/scene_intercom.jpg',
    });
    G.nudge('S08', [
      [300000, () => {
        if (G.flag('S08.done') || G.has('K-16')) return;
        G.showMono('그 영수증… 약국 이름이 뭐였지.');
      }],
      [450000, () => {
        if (G.flag('S08.done') || G.flag('S08.receiptSeen')) return;
        showReceipt();
      }],
    ]);
  }

  G.defDialogue('S08.minjae', [
    SAY('minjae', [], '도현이 있어요? 도현이! 나와 봐!'),
    CHOICE([
      {
        label: { c: '인터폰으로 말한다' },
        do: () => { G.S.v.s8_mode = 'intercom'; },
      },
      {
        label: { c: '문 연다' },
        do: () => {
          G.S.v.s8_mode = 'door';
          G.setFlag('FX-04');
          setScene('img/scene_entrance_in_a.jpg', 'face');
        },
      },
    ]),
    SAY('minjae', [], '도현이가 나한테 약을 줬어! 줘야 돼, 도현이가 준대!', { kn: 'K-15' }),
    CHOICE([
      {
        label: { c: '무슨 약? 무슨 소리야.' },
        then: [
          SAY('minjae', [], '유진이가 그랬어. 그 집 가서 말하라고. 아니, 유진이가 아니라…'),
        ],
      },
      {
        label: { c: '도현이 집에 없어. 가.' },
        then: [
          SAY('minjae', [], '거짓말! 줘. 도현이가 준대. 도현이가 줬어. 줘!'),
          SAY('minjae', [], '유진이가 그랬어. 그 집 가서 말하라고. 아니, 유진이가 아니라…'),
        ],
      },
      {
        label: { c: '…' },
        then: [
          SAY('minjae', [], '…'),
          SAY('minjae', [], '유진이가 그랬어. 그 집 가서 말하라고. 아니, 유진이가 아니라…'),
        ],
      },
    ]),
    DO(() => setScene('img/scene_entrance_in_a.jpg', 'face')),
    SAY('minjae', [], '…도현이가 준댔는데.'),
    END(),
  ], { onEnd: afterMinjae });

  function afterMinjae() {
    if (G.flag('S08.done')) return;
    G.setFlag('S08.dialogueDone');
    const body = document.body;
    const block = (e) => { e.stopPropagation(); e.preventDefault(); };
    body.classList.add('dk-s8-silence');
    document.addEventListener('pointerdown', block, true);
    document.addEventListener('touchstart', block, true);
    document.addEventListener('click', block, true);
    document.addEventListener('keydown', block, true);
    G.playCine('CN-02', () => {
      body.classList.remove('dk-s8-silence');
      document.removeEventListener('pointerdown', block, true);
      document.removeEventListener('touchstart', block, true);
      document.removeEventListener('click', block, true);
      document.removeEventListener('keydown', block, true);
      G.later(200, showReceipt, 'S08.receipt');
    });
  }

  function showReceipt() {
    if (G.flag('S08.done')) return;
    if (G.flag('S08.receiptSeen')) { finishS8(); return; }
    G.setFlag('S08.receiptSeen');
    G.setFlag('PH.f.receipt_saebom');
    G.grant('K-16');
    if (!G.S.photos.some((p) => p.src && String(p.src).indexOf('photo_receipt_saebom') >= 0)) {
      G.S.photos.push({ src: 'img/photo_receipt_saebom.jpg' });
    }
    const el = document.createElement('div');
    el.className = 'dk-receipt';
    el.innerHTML = `<div class="dk-receipt-card"><img src="img/item_receipt.jpg" alt=""></div><button class="dk-receipt-close" type="button">닫기</button>`;
    const stop = (e) => e.stopPropagation();
    el.addEventListener('click', stop);
    el.addEventListener('pointerdown', stop);
    el.querySelector('.dk-receipt-close').addEventListener('click', (e) => {
      e.stopPropagation();
      el.remove();
      finishS8();
    });
    document.getElementById('screen').appendChild(el);
    G.refresh();
  }

  function finishS8() {
    const S = G.S;
    if (G.flag('S08.done')) return;
    G.setFlag('S08.done');
    G.setFlag('S08.ended');
    G.cancelNudge('S08');
    G.endSession('S08');
    S.dlg = null;
    S.phoneUp = false;
    G.registerDest('pharmacy');
    G.setFlag('S08.awaitingTravel');
    if (typeof window.armS9Travel === 'function') window.armS9Travel();
    G.refresh();
    G.schedule('RE.02', 60000, () => {
      if (G.flag('RE.02')) return;
      G.setFlag('RE.02');
      G.setFlag('S08.re02Sent');
      G.addContact({ id: 'yujin', name: '차유진', num: '010-XXXX-4417', kind: 'normal', th: 'yujin' });
      G.addMsg('yujin', G.nowMsg('them', '아버님 괜찮으세요? 혹시 집에 이상한 사람 오지 않았어요?'));
      const top = G.S.stack[G.S.stack.length - 1];
      if (top && top.app === 'msg' && top.id === 'yujin') G.grant('KX-08');
    }, { cond: () => !G.flag('RE.02') });
    G.later(400, () => {
      if (G.S.place === 'home' && !G.S.dlg && !G.S.ov) G.startRoute('pharmacy');
    }, 'S08.route');
  }

  G.onThreadOpen('yujin', () => {
    if (G.flag('S08.re02Sent') && !G.has('KX-08')) G.grant('KX-08');
  });

  window.armS8Home = armS8Home;
  window.tryStartS8 = tryStartS8;

  G.defSession('S08', () => {
    G.S.place = 'home';
    G.S.clock = [16, 10];
    G.setFlag('S07.ended');
    tryStartS8();
  });
})();
