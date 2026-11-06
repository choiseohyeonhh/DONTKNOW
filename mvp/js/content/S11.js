/* S11 — 두 폰 자유 탐색 (19:40~20:30)
   대사·독백 없음. 필수 8항목을 모두 본 뒤 30초 → 유진 자동 발신(S12). */
(function () {
  const G = window.__game || window.DK;
  if (!G) return;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const has = (k) => G.has(k);
  const flag = (k) => G.flag(k);
  const OP = () => window.OldPhone;

  const REQUIRED = [
    'TH.f.hangyeol_sms',      // 1 아버지 한결 SMS
    'PH.f.debt_adjustment',   // 2 아버지 사진 — 채무조정 신청서
    'MM.o.remaining',         // 3 옛 폰 메모 남은 거
    'MM.o.april_schedule',    // 4 옛 폰 메모 4월 일정
    'TH.o.hyung',             // 5 옛 폰 형 스레드
    'TH.o.junho',             // 6 옛 폰 준호 스레드
    'TH.o.yujin',             // 7 옛 폰 유진 스레드
    'PH.o.photos',            // 8 옛 폰 사진
  ];

  // ───────── S11 아버지 폰 확장 UI ─────────
  const AUX = {
    open: false, mode: null,
    viewId: null, zoom: false, notice: '',
    cameraSleeping: false, cameraSrc: '',
    captured: false, flash: false,
  };
  const CAM_PHOTOS = [];
  let camSeq = 0;

  const FATHER_PHOTOS = () => ([
    ...CAM_PHOTOS,
    { id: 'PH.f.graduation_gate', date: '2026. 2. 11.', src: 'img/photo_graduation_gate.jpg', label: '졸업식' },
    { id: 'PH.f.receipt_grocery', date: '2025. 9. 7.', src: 'img/item_receipt.jpg', label: '장보기' },
    { id: 'PH.f.debt_adjustment', date: '2024. 2. 14.', src: 'img/photo_debt_form.jpg', label: '서류' },
    { id: 'PH.f.father_son_2022', date: '2022. 10. 3.', src: 'img/photo_father_son_2022.jpg', label: '도현' },
    { id: 'PH.f.family_2019', date: '2019. 5. 5.', src: 'img/photo_family_2019.jpg', label: '가족' },
  ]);

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

  function layer() {
    let el = $('#s11-layer');
    if (!el) {
      el = document.createElement('div');
      el.id = 's11-layer';
      el.className = 's11-layer';
      $('#screen').appendChild(el);
    }
    return el;
  }
  function hideAux() {
    AUX.open = false;
    AUX.mode = null;
    const el = $('#s11-layer');
    if (el) el.classList.remove('show');
  }
  function openAux(mode) {
    AUX.open = true;
    AUX.mode = mode;
    AUX.notice = '';
    renderAux();
  }
  function renderAux() {
    const el = layer();
    el.classList.toggle('show', AUX.open);
    if (!AUX.open) return;
    let html = '';
    if (AUX.mode === 'bank') html = bankHTML();
    else if (AUX.mode === 'photos') html = photosHTML();
    else if (AUX.mode === 'viewer') html = viewerHTML();
    else if (AUX.mode === 'camera') html = cameraHTML();
    morph(el, html);
  }

  // 은행
  function hdr(title, act = 's11-close') {
    return `<div class="s11-hdr"><button class="s11-lft" data-op="${act}"><svg viewBox="0 0 12 21"><path d="M10 2 2 10.5l8 8.5"/></svg></button><h1>${esc(title)}</h1><span></span></div>`;
  }
  function bankMonths() {
    const out = [];
    const fails = new Set(['2024-09', '2024-12', '2025-07', '2025-11', '2026-01']);
    for (let y = 2024; y <= 2026; y++) {
      for (let m = 1; m <= 12; m++) {
        const key = `${y}-${String(m).padStart(2, '0')}`;
        if (key < '2024-03' || key > '2026-03') continue;
        out.push({ key, y, m, fail: fails.has(key) });
      }
    }
    return out.reverse();
  }
  function bankRows() {
    const rows = [];
    bankMonths().forEach(({ y, m, fail }) => {
      const mm = String(m).padStart(2, '0');
      if (!(y === 2026 && m > 2)) rows.push({ d: `${mm}.15`, t: '카드대금', a: '-1,140,000', cls: '', sub: '' });
      rows.push({ d: `${mm}.10`, t: '급여 ○○물류', a: '+2,780,000', cls: '', sub: '' });
      rows.push({ d: `${mm}.05`, t: '자동이체 한결캐피탈', a: fail ? '출금실패' : '-800,000', cls: fail ? 'fail' : '', sub: fail ? '잔액부족' : '' });
    });
    return rows.map((r) => `<div class="s11-row"><div><div class="s11-r1">${esc(r.t)}</div><div class="s11-r2">${esc(r.d)}${r.sub ? ' · ' + esc(r.sub) : ''}</div></div><div class="s11-amt ${r.cls}">${esc(r.a)}</div></div>`).join('');
  }
  function bankHTML() {
    OP().mark('BANK.f.detail', ['KX-15']);
    return `${hdr('은행')}
      <div class="s11-scroll">
        <div class="s11-hero"><div class="s11-bank">성원은행 입출금</div><div class="s11-bal">412,730원</div><div class="s11-acc">이상철 · 110-XXX-XXXXXX</div></div>
        <div class="s11-sec">최근 거래 · 전체</div>
        ${bankRows()}
        <button class="s11-link" data-op="s11-bank-loan">대출·채무 조회 <span>›</span></button>
        ${AUX.notice ? `<div class="s11-note">${esc(AUX.notice)}</div>` : ''}
        <div class="s11-note">자동이체 한결캐피탈 800,000원 · 기간 전체</div>
      </div>`;
  }

  // 사진
  function photosHTML() {
    const list = FATHER_PHOTOS();
    const tiles = list.map((p) => `<button class="s11-thumb" data-op="s11-photo" data-id="${esc(p.id)}"><img src="${esc(p.src)}" alt=""></button>`).join('');
    return `${hdr('사진')}<div class="s11-scroll"><div class="s11-grid">${tiles}</div></div>`;
  }
  function viewerHTML() {
    const p = FATHER_PHOTOS().find((x) => x.id === AUX.viewId);
    if (!p) return photosHTML();
    const actions = [];
    if (p.id === 'PH.f.debt_adjustment') {
      OP().mark('PH.f.debt_adjustment', ['KX-14']);
      actions.push(`<button data-op="s11-zoom">${AUX.zoom ? '축소' : '확대'}</button>`);
    }
    if (p.cam && p.sleeping) actions.push('<button class="primary" data-op="s11-wallpaper">배경화면으로 설정</button>');
    if (AUX.captured) actions.push('<button data-op="s11-to-photos">사진첩</button>');
    return `${hdr('사진')}
      <div class="s11-viewer">
        <div class="s11-img"><img class="${AUX.zoom ? 'zoom' : ''}" src="${esc(p.src)}" alt=""></div>
        <div class="s11-cap">${esc(p.date)}${p.id === 'PH.f.debt_adjustment' ? ' · 채무조정 신청서' : ''}</div>
        <div class="s11-actions">${actions.join('')}</div>
        ${AUX.notice ? `<div class="s11-confirm"><p>${esc(AUX.notice)}</p><button data-op="s11-notice-close">확인</button></div>` : ''}
      </div>`;
  }

  // 카메라
  function openCamera() {
    const lv = OP().lastView();
    AUX.cameraSleeping = lv.kind === 'photo' && lv.id === 'PH.o.sleeping_father';
    AUX.cameraSrc = AUX.cameraSleeping ? 'img/wall_sleeping_father.jpg' : 'img/scene_living_table.jpg';
    AUX.flash = false;
    AUX.captured = false;
    openAux('camera');
  }
  function cameraHTML() {
    return `<div class="s11-cam">
      <div class="s11-hdr" style="background:transparent;border:0;position:absolute;top:0;left:0;right:0;z-index:2">
        <button class="s11-lft" data-op="s11-close" style="color:#fff"><svg viewBox="0 0 12 21" style="stroke:#fff"><path d="M10 2 2 10.5l8 8.5"/></svg></button>
        <h1 style="color:#fff">카메라</h1><span></span>
      </div>
      <div class="s11-finder">
        <img src="${esc(AUX.cameraSrc)}" alt="">
        <div class="s11-moire"></div>
      </div>
      <div class="s11-shutter-wrap"><button class="s11-shutter" data-op="s11-shutter" aria-label="촬영"><i></i></button></div>
      ${AUX.flash ? '<div class="s11-flash"></div>' : ''}
      ${AUX.notice ? `<div class="s11-confirm"><p>${esc(AUX.notice)}</p><button data-op="s11-notice-close">확인</button></div>` : ''}
    </div>`;
  }
  function shutter() {
    const p = {
      id: `PH.f.cam_${++camSeq}`, date: '2026. 3. 18.', src: AUX.cameraSrc,
      label: '촬영', cam: true, sleeping: AUX.cameraSleeping,
    };
    CAM_PHOTOS.unshift(p);
    AUX.viewId = p.id;
    AUX.captured = true;
    AUX.zoom = false;
    AUX.flash = true;
    renderAux();
    G.later(360, () => { AUX.flash = false; AUX.mode = 'viewer'; renderAux(); }, 'S11.flash');
  }
  function setWallpaper() {
    const p = FATHER_PHOTOS().find((x) => x.id === AUX.viewId);
    if (!p || !p.cam || !p.sleeping) return;
    G.setFlag('FX-07');
    G.S.v.wallpaper = p.id;
    AUX.notice = '배경화면으로 설정했습니다.';
    renderAux();
  }

  // ───────── 이벤트 ─────────
  function onAuxClick(e) {
    const el = e.target.closest && e.target.closest('[data-op]');
    if (!el) return;
    const op = el.dataset.op;
    if (!op.startsWith('s11-')) return;
    if (!el.closest('#s11-layer')) return;
    e.preventDefault();
    e.stopPropagation();
    if (op === 's11-close') { hideAux(); return; }
    if (op === 's11-bank-loan') { AUX.notice = '조회 권한이 없습니다(채권 이전 계좌)'; renderAux(); return; }
    if (op === 's11-photo') {
      AUX.viewId = el.dataset.id;
      AUX.zoom = false;
      AUX.captured = false;
      AUX.notice = '';
      AUX.mode = 'viewer';
      if (AUX.viewId === 'PH.f.debt_adjustment') OP().mark('PH.f.debt_adjustment', ['KX-14']);
      renderAux(); return;
    }
    if (op === 's11-zoom') { AUX.zoom = !AUX.zoom; renderAux(); return; }
    if (op === 's11-wallpaper') { setWallpaper(); return; }
    if (op === 's11-to-photos') { AUX.mode = 'photos'; AUX.captured = false; renderAux(); return; }
    if (op === 's11-shutter') { shutter(); return; }
    if (op === 's11-notice-close') { AUX.notice = ''; renderAux(); return; }
  }
  function onEngineOpen(e) {
    if (G.S.session !== 'S11') return;
    const el = e.target.closest && e.target.closest('[data-act="open"]');
    if (!el) return;
    const app = el.dataset.app;
    if (!['bank', 'photos', 'camera'].includes(app)) return;
    e.preventDefault();
    e.stopPropagation();
    if (window.OldPhone) window.OldPhone.setDevice('father');
    if (app === 'bank') openAux('bank');
    else if (app === 'photos') openAux('photos');
    else openCamera();
  }
  function onDevice(e) {
    if (e.detail && e.detail.device === 'old' && AUX.open) hideAux();
  }

  // ───────── 종료 판정 ─────────
  function complete() {
    return REQUIRED.every((id) => OP() && OP().seen(id));
  }
  function checkComplete() {
    if (G.S.session !== 'S11' || flag('S11.exitScheduled')) return;
    if (!complete()) return;
    G.setFlag('S11.exitScheduled');
    G.setFlag('S11.allSeen');
    G.later(30000, () => {
      if (G.S.session !== 'S11') return;
      G.setFlag('S11.ended');
      G.endSession('S11');
      if (typeof window.startS12 === 'function') window.startS12('auto');
      else G.startSession('S12');
    }, 'S11.exit');
  }

  // ───────── 세션 시작 ─────────
  function startS11(mode) {
    const S = G.S;
    if (S.session === 'S11' && flag('S11.active') && mode !== 'jump') return;
    hideAux();
    G.clearGroup('S11');
    S.phase = 'free';
    S.place = 'home';
    S.unlocked = true;
    S.ov = null;
    S.call = null;
    S.dlg = null;
    S.phoneUp = false;
    S.travel = null;
    S.routePlace = null;
    S.banner = null;
    S.mono = null;
    if (S.clock[0] < 19 || (S.clock[0] === 19 && S.clock[1] < 40)) S.clock = [19, 40];
    if (mode === 'jump') S.stack = [];
    G.startSession('S11');
    G.setFlag('S11.active');
    if (window.OldPhone) {
      window.OldPhone.mount();
      if (mode === 'jump') {
        window.OldPhone.reset();
        window.OldPhone.forceUnlock(true);
        window.OldPhone.setDevice('old');
      } else if (!window.OldPhone.state.unlocked) {
        window.OldPhone.forceUnlock(false);
      }
    }
    G.refresh();
    setTimeout(checkComplete, 100);
  }
  window.startS11 = startS11;
  G.startS11 = startS11;
  window.closeS11UI = hideAux;
  G.defSession('S11', () => window.startS11('jump'));

  if (window.OldPhone) window.OldPhone.onSeen(() => checkComplete());
  document.addEventListener('click', onAuxClick, true);
  document.addEventListener('click', onEngineOpen, true);
  document.addEventListener('dk-device', onDevice);
})();
