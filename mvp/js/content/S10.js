/* S10 — 봉투 + 옛 폰 1 (19:10)
   현관 봉투 → K-18 → PIN → 초안(KX-19) / 음성메모(K-19) → 한결 알림 → KX-13 → S11 */
(function () {
  const G = window.__game || window.DK;
  if (!G) return;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const has = (k) => G.has(k);
  const flag = (k) => G.flag(k);

  // ───────── CN-04 ─────────
  G.defCine('CN-04', {
    skip: true,
    cuts: [
      {
        img: 'img/scene_living_table.jpg', origin: '50% 56%', from: 'scale(1.02)', to: 'scale(1.08)',
        dur: 5200, stamp: '19:10',
        cap: ['저녁 7시 10분. 집에 돌아왔다.'],
      },
    ],
  });

  // ───────── S10 봉투 레이어 ─────────
  const UI = { step: 'entrance', open: false };

  function layer() {
    let el = $('#s10-layer');
    if (!el) {
      el = document.createElement('div');
      el.id = 's10-layer';
      el.className = 's10-layer';
      $('#screen').appendChild(el);
    }
    return el;
  }
  function morph(parent, html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    const keyOf = (n) => (n.nodeType === 1 ? n.getAttribute('data-k') : null);
    const same = (x, y) => x.nodeType === y.nodeType && x.nodeName === y.nodeName && keyOf(x) === keyOf(y);
    const patch = (x, y) => {
      if (x.nodeType !== 1) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; return; }
      for (const at of [...x.attributes]) if (!y.hasAttribute(at.name)) x.removeAttribute(at.name);
      for (const at of y.attributes) if (x.getAttribute(at.name) !== at.value) x.setAttribute(at.name, at.value);
      patchKids(x, y);
    };
    const patchKids = (a, b) => {
      const keyed = new Map();
      for (const c of a.children) { const k = keyOf(c); if (k) keyed.set(k, c); }
      let cur = a.firstChild;
      for (const y of [...b.childNodes]) {
        let x = cur;
        const k = keyOf(y);
        if (k) { x = keyed.get(k); if (x && x !== cur) a.insertBefore(x, cur); }
        if (x && same(x, y)) { patch(x, y); cur = x.nextSibling; } else a.insertBefore(y, cur);
      }
      while (cur) { const n = cur.nextSibling; a.removeChild(cur); cur = n; }
    };
    patchKids(parent, tpl.content);
  }

  function sceneHTML() {
    return `<div class="s10-bg" style="background-image:url('img/scene_entrance_in_b.jpg')"></div>
      <div class="s10-shade"></div>
      <div class="s10-top"><div class="s10-time">오후 7:10</div><div class="s10-h">현관</div></div>
      <div class="s10-bottom">
        <div class="s10-card">
          <p>문 앞에 서류 봉투가 놓여 있다. 발신인은 없다.</p>
          <button class="s10-item" data-s10="open-envelope" aria-label="봉투 열기"><img src="img/item_envelope.jpg" alt="봉투"></button>
          <button class="s10-btn" data-s10="open-envelope">봉투를 든다</button>
        </div>
      </div>`;
  }
  function zoomHTML() {
    return `<div class="s10-bg" style="background-image:url('img/scene_entrance_in_b.jpg')"></div>
      <div class="s10-shade"></div>
      <div class="s10-zoom">
        <div class="s10-paper">
          <img src="img/item_envelope.jpg" alt="봉투">
          <img class="s10-postit-img" src="img/item_postit.jpg" alt="포스트잇">
          <div class="s10-postit">버리라고 했는데 못 버렸어요.</div>
          <div class="s10-note">구형 스마트폰과 포스트잇.</div>
        </div>
        <button class="s10-btn" data-s10="take-phone">휴대전화를 꺼낸다</button>
        <button class="s10-btn ghost" data-s10="close-zoom">닫기</button>
      </div>`;
  }
  function render() {
    const el = layer();
    el.style.display = UI.open ? 'block' : 'none';
    if (!UI.open) return;
    morph(el, UI.step === 'zoom' ? zoomHTML() : sceneHTML());
  }
  function openEnvelopeScene() {
    UI.open = true;
    UI.step = 'entrance';
    render();
  }
  function closeEnvelopeScene() {
    UI.open = false;
    render();
  }

  function takePhone() {
    UI.open = false;
    render();
    G.setFlag('IT.postit');
    G.grant('K-18');
    G.setFlag('S10.envelope');
    if (window.OldPhone) {
      window.OldPhone.mount();
      window.OldPhone.beginBoot();
    }
    if (has('K-07')) { G.setFlag('RE.11'); G.showMono('…두 개.'); }
    G.setFlag('S10.envelopeDone');
  }

  function onS10Click(e) {
    const el = e.target.closest && e.target.closest('[data-s10]');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    const a = el.dataset.s10;
    if (a === 'open-envelope') { UI.step = 'zoom'; render(); }
    else if (a === 'close-zoom') { UI.step = 'entrance'; render(); }
    else if (a === 'take-phone') takePhone();
  }

  // ───────── 한결 스레드 열람 (자동 닫힘 방지 + KX-13) ─────────
  function markHangyeol() {
    if (!window.OldPhone) return;
    window.OldPhone.mark('TH.f.hangyeol_sms', ['KX-13']);
    G.setFlag('S10.hangyeolOpened');
    maybeEndS10();
  }
  function onHangyeolClick(e) {
    if (!['S10', 'S11', 'S12'].includes(G.S.session)) return;
    const el = e.target.closest && e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    if (act === 'thread' && el.dataset.id === 'hangyeol') {
      // S01의 AV-01 자동 닫힘 훅을 S10 이후에는 발동시키지 않는다.
      G.setFlag('FX-02');
      setTimeout(markHangyeol, 40);
    } else if (act === 'bannerTap' && el.dataset.id === 'hangyeol') {
      G.setFlag('FX-02');
      if (window.OldPhone) window.OldPhone.setDevice('father');
      setTimeout(markHangyeol, 80);
    }
  }

  // ───────── 세션 ─────────
  function maybeEndS10() {
    const S = G.S;
    if (S.session !== 'S10' || flag('S10.ended')) return;
    if (!has('K-19')) return;
    if (!window.OldPhone || !window.OldPhone.seen('TH.f.hangyeol_sms')) return;
    G.setFlag('S10.ended');
    G.endSession('S10');
    if (typeof window.startS11 === 'function') window.startS11('continue');
    else G.startSession('S11');
  }

  function startS10() {
    const S = G.S;
    if (S.session === 'S10' && flag('S10.active') && !S.sessionDone.S10) {
      if (UI.open) render();
      return;
    }
    G.clearGroup('S10');
    if (window.OldPhone && !flag('S10.active')) window.OldPhone.reset();
    S.phase = 'free';
    S.clock = [19, 10];
    S.place = 'home';
    S.unlocked = true;
    S.stack = [];
    S.ov = null;
    S.call = null;
    S.dlg = null;
    S.phoneUp = false;
    S.travel = null;
    S.routePlace = null;
    S.navAnim = null;
    S.banner = null;
    S.mono = null;
    G.startSession('S10');
    G.setFlag('S10.active');
    if (window.OldPhone) window.OldPhone.mount();
    G.refresh();

    if (flag('S10.envelopeDone') || has('K-18')) {
      if (window.OldPhone) window.OldPhone.beginBoot();
      return;
    }
    G.playCine('CN-04', () => {
      if (G.S.session !== 'S10') return;
      openEnvelopeScene();
    });
  }
  window.startS10 = startS10;
  G.startS10 = startS10;
  G.defSession('S10', () => window.startS10());

  // 음성메모 끝 → 5초 뒤 한결 알림 (K-19 획득 후)
  if (window.OldPhone) {
    window.OldPhone.onVoiceEnd(() => {
      if (G.S.session !== 'S10') return;
      G.later(5000, () => {
        if (G.S.session !== 'S10') return;
        if (window.OldPhone.seen('TH.f.hangyeol_sms')) return;
        window.OldPhone.notifyHangyeol();
      }, 'S10.02');
      maybeEndS10();
    });
  }

  document.addEventListener('click', onS10Click, true);
  document.addEventListener('click', onHangyeolClick, true);
})();
