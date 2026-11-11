/* LUMA 셸: 상태바, 잠금화면(T0), 키패드, 응급정보, 홈 4×5+독, 폴더, 앱 열기/닫기, 제어 센터, 알림 센터, 전역 검색.
 * 설계: design/03-features/SYSTEM_SHELL_SPECIFICATION.md 4.1~4.6 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;
  let dev, lockEl, homeEl, curApp = null, overlay = null;

  function applyTheme() {
    document.documentElement.dataset.theme = LM.state.theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.textSize = LM.state.textSize;
    document.documentElement.dataset.reduceMotion = LM.state.reduceMotion;
  }

  /* ---------- 상태바 ---------- */
  function statusBar() {
    const time = h('span', { class: 'sb-time' });
    const left = h('div', { class: 'sb-l' }, time);
    const right = h('div', { class: 'sb-r' });
    const bar = h('div', { class: 'statusbar', role: 'status', 'aria-label': '상태 막대' }, left, right);
    const draw = () => {
      time.textContent = LM.fmtTime(LM.now());
      right.replaceChildren(...[
        LM.state.dnd ? LM.icon('moon') : null,
        LM.state.airplane ? LM.icon('plane') : h('span', { class: 'sb-carrier' }, '서비스 없음'),
        LM.state.wifi && !LM.state.airplane ? LM.icon('wifi') : null,
        LM.online() && LM.state.syncing ? h('i', { class: 'sb-sync' }) : null,
        h('span', { class: 'sb-batt', 'aria-label': '배터리 31%, 충전 중' }, h('i'), h('b', null, '31')),
        LM.icon('bolt', 'sb-bolt')].filter(Boolean));
      bar.classList.toggle('on-wall', !curApp || !!overlay || curApp.root.classList.contains('dark-chrome'));
    };
    draw();
    LM.on('tick', draw); LM.on('state', draw); LM.on('app', draw); LM.on('overlay', draw);
    // 상태바 두 번 탭 = 검색(홈), 앱 안에서 한 번 탭 = 맨 위로
    let last = 0;
    bar.style.pointerEvents = 'auto';
    bar.addEventListener('click', () => { if (bar._dragged) { bar._dragged = false; return; } const n = Date.now(); if (n - last < 350 && !LM.state.locked && !curApp) openSearch(); else if (curApp) scrollTop(); last = n; });
    edgePull(bar);
    return bar;
  }
  function scrollTop() { const s = curApp && curApp.root.querySelector('.scr:not(.covered):last-of-type .sc'); s && s.scrollTo({ top: 0, behavior: 'smooth' }); }

  function wallpaper() {
    return h('div', { class: 'wall', role: 'img', 'aria-label': '배경화면: 2019년 가족사진 자리' },
    );
  }

  /* ---------- 잠금화면 ---------- */
  function buildLock() {
    const clock = h('div', { class: 'lock-clock' });
    const date = h('div', { class: 'lock-date' });
    const tick = () => { const d = LM.now(); clock.textContent = LM.fmtTime(d); date.textContent = LM.fmtDate(d); };
    tick(); LM.on('tick', tick);

    const fail = h('span', { class: 'lost-fail' });
    const lost = h('div', { class: 'lost-card' },
      h('b', null, '분실 모드'),
      h('p', null, '이 폰을 주우셨다면 연락 부탁드립니다.', h('br'), '010-XXXX-2290'),
      h('button', { class: 'lost-btn', onclick: () => { fail.textContent = '서비스 없음'; setTimeout(() => (fail.textContent = ''), 2500); } }, LM.icon('phone-out'), '통화'), fail);

    const stack = h('div', { class: 'nstack' });
    function fillNotifs() {
      stack.replaceChildren();
      const groups = {};
      notifList().forEach((n) => { (groups[n.app] = groups[n.app] || []).push(n); });
      Object.keys(groups).forEach((app) => {
        const list = groups[app];
        const unread = groupUnread(app, list);
        const g = h('div', { class: 'ngroup collapsed' + (list.length === 1 ? ' single' : '') });
        list.forEach((n, i) => {
          const card = notifCard(n, i === 0 && list.length > 1 ? Math.max(0, unread - 1) : 0);
          card.addEventListener('click', () => {
            if (g.classList.contains('collapsed') && list.length > 1) { g.classList.remove('collapsed'); return; }
            showPasscode(() => openApp(n.app, n.thread ? { open: n.thread, thread: n.thread } : undefined));
          });
          g.appendChild(card);
        });
        stack.appendChild(g);
      });
    }
    fillNotifs();

    const scroll = h('div', { class: 'lock-scroll' },
      lost,
      h('div', { class: 'n-head' }, h('b', null, '알림 센터'), h('button', { onclick: () => stack.querySelectorAll('.ngroup').forEach((g) => g.classList.toggle('collapsed')) }, '펼치기')),
      stack);

    const el = h('div', { class: 'layer lock', 'aria-label': '잠금화면' },
      wallpaper(),
      LM.icon('lock', 'lock-lockic'),
      date, clock,
      h('div', { class: 'lock-widgets' },
        h('div', { class: 'widget past', 'aria-label': '캘린더 위젯' }, LM.icon('clock'), '다음 일정 · 3/16 입실'),
        h('div', { class: 'widget', 'aria-label': '배터리 위젯' }, LM.icon('battery'), '31% 충전 중')),
      scroll,
      h('div', { class: 'lock-foot' },
        h('button', { class: 'round-btn txt', 'aria-label': '응급', onclick: showMedical }, '응급'),
        h('button', { class: 'round-btn', 'aria-label': '카메라', onclick: () => openApp('cam', { fromLock: true }) }, LM.icon('camera'))),
      h('div', { class: 'lock-hint' }, '위로 쓸어 올려 열기'));

    // 위로 쓸어 올리기 → 키패드
    let sy = null;
    el.addEventListener('pointerdown', (e) => { if (e.target.closest('button,.lock-scroll')) return; sy = e.clientY; });
    el.addEventListener('pointerup', (e) => { if (sy != null && sy - e.clientY > 60) showPasscode(); sy = null; });
    el.querySelector('.lock-hint').style.pointerEvents = 'auto';
    el.querySelector('.lock-hint').addEventListener('click', () => showPasscode());
    el._refreshNotifs = fillNotifs;
    return el;
  }

  function notifList() {
    if (LM.notifList) return LM.notifList();
    return LM.NOTIFS || [];
  }

  function notifHidden(n) {
    if (LM.notifHidden) return LM.notifHidden(n);
    return !!n.hidden;
  }

  function groupUnread(appId, list) {
    if (LM.read && LM.read.hasProvider && LM.read.hasProvider(appId)) return LM.read.unreadCount(appId);
    return list.length;
  }

  function notifCard(n, more) {
    const hidden = notifHidden(n);
    return h('button', { class: 'ncard', 'aria-label': (LM.APPS[n.app] || n.app) + ' 알림, ' + n.title },
      LM.appIcon(n.app, 38),
      h('div', null,
        h('div', { class: 'ncard-app' }, LM.APPS[n.app] || n.app),
        n.title !== LM.APPS[n.app] ? h('div', { class: 'ncard-t' }, n.title) : null,
        h('div', { class: 'ncard-b' + (hidden ? ' hidden' : '') }, hidden ? '새 메시지' : n.body),
        h('span', { class: 'ncard-time' }, n.t || (n.at ? LM.notifTime(n.at) : ''))),
      more ? h('div', { class: 'ncard-more' }, '알림 ' + more + '개 더 보기') : null);
  }

  function openNotif(n) {
    LM.emit('notif', n);
    openApp(n.app, n.thread ? { open: n.thread, thread: n.thread } : undefined);
  }

  /* ---------- 키패드: 6자리, 오답 6회째부터 30초 대기 ---------- */
  let wrong = 0, waitUntil = 0;
  function showPasscode(after) {
    if (dev.querySelector('.passcode')) return;
    let code = '';
    const dots = h('div', { class: 'pc-dots', 'aria-hidden': true }, [0, 1, 2, 3, 4, 5].map(() => h('i')));
    const msg = h('div', { class: 'pc-msg', role: 'status' });
    const keys = [];
    const draw = () => dots.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i < code.length));
    const locked = () => Date.now() < waitUntil;
    const wait = () => {
      const left = Math.ceil((waitUntil - Date.now()) / 1000);
      if (left > 0) { msg.textContent = left + '초 후에 다시 시도하십시오'; keys.forEach((k) => (k.disabled = true)); setTimeout(wait, 250); }
      else { msg.textContent = ''; keys.forEach((k) => (k.disabled = false)); }
    };
    const press = (d) => {
      if (locked() || code.length >= 6) return;
      code += d; draw();
      if (code.length === 6) setTimeout(check, 120);
    };
    const check = () => {
      if (code === LM.PASSCODE) { wrong = 0; pc.remove(); unlock(after); return; }
      wrong++; code = '';
      dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
      setTimeout(draw, 300);
      if (wrong >= 6) { waitUntil = Date.now() + 30000; wait(); }
      else msg.textContent = '';
    };
    const L = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];
    const pad = h('div', { class: 'pc-pad' });
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((n) => { const k = h('button', { class: 'pc-key', 'aria-label': String(n), onclick: () => press(String(n)) }, h('b', null, n), h('small', null, L[n - 1] || ' ')); keys.push(k); pad.appendChild(k); });
    pad.appendChild(h('span'));
    const z = h('button', { class: 'pc-key', 'aria-label': '0', onclick: () => press('0') }, h('b', null, '0')); keys.push(z); pad.appendChild(z);
    const pc = h('div', { class: 'passcode', role: 'dialog', 'aria-label': '암호 입력' },
      h('div', { class: 'pc-title' }, '암호 입력'), dots, msg, pad,
      h('div', { class: 'pc-foot' },
        h('button', { onclick: showMedical }, '응급'),
        h('button', { onclick: () => { if (code) { code = code.slice(0, -1); draw(); } else pc.remove(); } }, '취소')));
    const onKey = (e) => { if (!pc.isConnected) return document.removeEventListener('keydown', onKey); if (/^[0-9]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') { code = code.slice(0, -1); draw(); } else if (e.key === 'Escape') pc.remove(); };
    document.addEventListener('keydown', onKey);
    dev.appendChild(pc);
    LM.animate(pc, [{ opacity: 0 }, { opacity: 1 }], { duration: 240 });
    if (locked()) wait();
  }

  function showMedical() {
    const m = LM.MEDICAL;
    const body = h('div', null,
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', padding: '4px 16px 18px' } }, ui.avatar(m.name, 60, { glyph: 'medical', hue: 0 }), h('div', null, h('div', { style: { fontSize: '24px', fontWeight: 700 } }, m.name), h('div', { style: { color: 'var(--lm-label-2)', fontSize: '15px' } }, '의료 정보'))),
      ui.group({ rows: [['생년월일', m.birth], ['혈액형', m.blood], ['의료 메모', m.memo]].map(([k, v]) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v))) }),
      ui.group({ header: '긴급 연락처', rows: [ui.row({ title: m.contact.name, subtitle: m.contact.rel + ' · ' + m.contact.num, avatar: m.contact.name, onClick: () => ui.toast('서비스 없음'), chevron: false })] }));
    ui.sheet(dev, ui.sheetPage({ title: '응급 의료 정보', cancel: '완료', body, grouped: true }));
  }

  function unlock(after) {
    LM.set({ locked: false });
    // 해제 연출 없음: 홈이 바로 나온다(캐논)
    lockEl.hidden = true;
    homeEl.hidden = false;
    LM.emit('unlock');
    if (after) after();
  }
  function lockPhone() {
    if (curApp) closeApp(true);
    closeOverlay();
    LM.set({ locked: true });
    lockEl.hidden = false; homeEl.hidden = true;
  }

  /* ---------- 홈 ---------- */
  function appButton(id) {
    const badge = h('span', { class: 'badge' });
    const b = h('button', { class: 'app', data: { app: id }, onclick: (e) => openApp(id, { from: e.currentTarget.querySelector('.appicon') }) },
      LM.appIcon(id), h('span', { class: 'app-name' }, LM.APPS[id]), badge);
    b._syncBadge = () => {
      const n = (LM.badge && LM.badge(id)) || 0;
      badge.textContent = n ? String(n) : '';
      badge.hidden = !n;
      b.setAttribute('aria-label', LM.APPS[id] + (n ? ', 안 읽은 메시지 ' + n + '개' : ''));
    };
    b._syncBadge();
    return b;
  }
  function folderButton(f) {
    const badge = h('span', { class: 'badge' });
    const b = h('button', { class: 'app', data: { folder: f.folder }, onclick: () => openFolder(f) },
      h('span', { class: 'folder-icon', style: { clipPath: `path('${LM.SQUIRCLE}')` } }, f.apps.map((id) => LM.appIcon(id, 13))), h('span', { class: 'app-name' }, f.folder), badge);
    b._syncFolder = () => {
      const n = f.apps.reduce((sum, id) => sum + ((LM.badge && LM.badge(id)) || 0), 0);
      badge.textContent = n ? String(n) : '';
      badge.hidden = !n;
    };
    b._syncFolder();
    return b;
  }
  function openFolder(f) {
    const ov = h('div', { class: 'folder-open', onclick: (e) => { if (e.target === ov) close(); } },
      h('div', null, h('h3', null, f.folder), h('div', { class: 'folder-panel' }, f.apps.map((id) => { const b = appButton(id); b.addEventListener('click', () => ov.remove()); return b; }))));
    const close = () => LM.animate(ov, [{ opacity: 1 }, { opacity: 0 }], { duration: 160 }).then(() => ov.remove());
    homeEl.appendChild(ov);
    LM.animate(ov.firstChild, [{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 350, easing: LM.EASE.sheet });
  }

  function buildHome() {
    const pages = h('div', { class: 'pages', 'aria-label': '홈 화면' });
    LM.HOME.pages.forEach((p, i) => {
      const pg = h('div', { class: 'hpage', 'aria-label': (i + 1) + '페이지' });
      p.forEach((it) => pg.appendChild(typeof it === 'string' ? appButton(it) : folderButton(it)));
      if (!p.length) pg.appendChild(h('div', { class: 'empty-page' }, ''));
      pages.appendChild(pg);
    });
    const dots = h('div', { class: 'dots', 'aria-hidden': true }, LM.HOME.pages.map((_, i) => h('i', { class: i ? '' : 'on' })));
    pages.addEventListener('scroll', () => { const i = Math.round(pages.scrollLeft / pages.clientWidth); dots.querySelectorAll('i').forEach((d, j) => d.classList.toggle('on', i === j)); }, { passive: true });
    // 마우스 휠 가로 넘김(데스크톱)
    pages.addEventListener('wheel', (e) => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 20) { e.preventDefault(); } }, { passive: false });
    const el = h('div', { class: 'layer home', hidden: true },
      wallpaper(), pages,
      h('button', { class: 'search-pill', onclick: openSearch }, LM.icon('search'), '검색'),
      dots,
      h('div', { class: 'dock' }, LM.HOME.dock.map(appButton)));
    const syncBadges = () => {
      if (!el.isConnected) return;
      el.querySelectorAll('.app[data-app]').forEach((b) => { if (b._syncBadge) b._syncBadge(); });
      el.querySelectorAll('.app[data-folder]').forEach((b) => { if (b._syncFolder) b._syncFolder(); });
    };
    LM.on('read', syncBadges);
    LM.on('msg', syncBadges);
    LM.on('state', syncBadges);
    LM.on('minute', syncBadges);

    // 제스처: 아래로 = 알림 센터(오른쪽 위에서 시작하면 제어 센터), 위로 = 검색
    let sx = 0, sy = 0, tracking = false;
    el.addEventListener('pointerdown', (e) => { if (e.target.closest('.folder-open')) return; tracking = true; sx = e.clientX; sy = e.clientY; });
    el.addEventListener('pointerup', (e) => {
      if (!tracking) return; tracking = false;
      const dx = e.clientX - sx, dy = e.clientY - sy, r = dev.getBoundingClientRect();
      if (Math.abs(dy) < 70 || Math.abs(dx) > Math.abs(dy)) return;
      if (sy - r.top < 60) return; // 맨 위는 상태바의 끌어내리기 영역
      if (dy > 0) openSearch();
    });
    return el;
  }

  /* ---------- 앱 열기/닫기 ---------- */
  function openApp(id, o) {
    o = o || {};
    if (LM.state.locked && !o.fromLock) { showPasscode(() => openApp(id, o)); return; }
    closeOverlay();
    if (curApp) closeApp(true);
    const def = LM.apps[id] || placeholderApp(id);
    const layer = h('div', { class: 'appwin', data: { app: id }, role: 'application', 'aria-label': LM.APPS[id] });
    dev.insertBefore(layer, dev.querySelector('.statusbar'));
    const app = LM.createApp(def, layer);
    app.opts = o;
    app.close = () => closeApp();
    curApp = app;
    try { def.render(app); } catch (err) { console.error(err); layer.replaceChildren(h('div', { style: { padding: '120px 24px' } }, '앱을 그리는 중 오류: ' + err.message)); }
    const from = o.from && o.from.getBoundingClientRect(), d = dev.getBoundingClientRect();
    if (from && LM.motion()) {
      const sx = from.width / d.width, sy = from.height / d.height;
      const tx = from.left + from.width / 2 - (d.left + d.width / 2), ty = from.top + from.height / 2 - (d.top + d.height / 2);
      layer.animate([{ transform: `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`, borderRadius: '60px', opacity: 0.4 }, { transform: 'none', borderRadius: '54px', opacity: 1 }], { duration: 350, easing: LM.EASE.sheet });
    } else LM.animate(layer, [{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 240, easing: LM.EASE.std });
    LM.emit('app', id);
  }
  function closeApp(instant) {
    if (!curApp) return;
    const a = curApp; curApp = null;
    a.def.onClose && a.def.onClose(a);
    if (instant) a.root.remove();
    else LM.animate(a.root, [{ transform: 'scale(1)', opacity: 1, borderRadius: '54px' }, { transform: 'scale(.3) translateY(60%)', opacity: 0, borderRadius: '80px' }], { duration: 300, easing: LM.EASE.sheet }).then(() => a.root.remove());
    if (a.opts.fromLock) lockEl.hidden = !LM.state.locked;
    LM.emit('app', null);
  }
  LM.openApp = openApp;
  LM.goHome = () => { if (curApp) closeApp(); else closeOverlay(); };
  LM.current = () => curApp;

  function placeholderApp(id) {
    return { id, render(app) { app.start(() => ui.page({ title: LM.APPS[id], body: ui.empty({ icon: 'info', title: '아직 비어 있는 앱', text: '프로토타입에서 이 앱의 화면은 준비 중이다.' }) })); } };
  }

  /* 홈 인디케이터: 위로 밀면 홈 */
  function homeIndicator() {
    const hi = h('div', { class: 'home-ind', role: 'button', 'aria-label': '홈으로', tabindex: 0 });
    let sy = null;
    hi.addEventListener('pointerdown', (e) => { sy = e.clientY; hi.setPointerCapture(e.pointerId); });
    hi.addEventListener('pointerup', (e) => { const up = sy != null && sy - e.clientY > 20; sy = null; if (up || true) goHomeAction(); });
    hi.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') goHomeAction(); });
    const draw = () => hi.classList.toggle('on-wall', !curApp);
    LM.on('app', draw); draw();
    return hi;
  }
  function goHomeAction() {
    if (dev.querySelector('.passcode')) { dev.querySelector('.passcode').remove(); return; }
    if (curApp) { const fromLock = curApp.opts.fromLock; closeApp(); if (fromLock) { lockEl.hidden = false; } return; }
    if (overlay) return closeOverlay();
    if (LM.state.locked) return showPasscode();
    const pages = homeEl.querySelector('.pages'); pages.scrollTo({ left: 0, behavior: 'smooth' });
    homeEl.querySelector('.folder-open') && homeEl.querySelector('.folder-open').remove();
  }

  /* ---------- 오버레이: 알림 센터·제어 센터·검색 ---------- */
  /* 위에서 끌어내리기: 상태바 왼쪽(화면 폭 60%까지) = 알림 센터, 오른쪽 = 제어 센터.
   * 손가락을 따라 내려오고, 놓을 때 30% 이상 내렸거나 빠르게 내렸으면 열린다. 잠금 상태에서는 열리지 않는다(캐논). */
  const PULL_SPLIT = 0.6;
  function setPull(el, p) {
    p = Math.max(0, Math.min(1, p));
    el._p = p;
    if (el.classList.contains('cc')) {
      el.style.opacity = p;
      const g = el.firstChild;
      if (g) g.style.transform = `translateY(${(1 - p) * -36}px) scale(${0.92 + 0.08 * p})`;
    } else {
      el.style.transform = `translateY(${(p - 1) * 100}%)`;
    }
  }
  function settle(el, open, done) {
    const dur = LM.motion() ? 320 : 0;
    const ease = 'cubic-bezier(0.32, 0.72, 0, 1)';
    const g = el.classList.contains('cc') ? el.firstChild : null;
    el.style.transition = `transform ${dur}ms ${ease}, opacity ${dur}ms ${ease}`;
    if (g) g.style.transition = `transform ${dur}ms ${ease}`;
    setPull(el, open ? 1 : 0);
    setTimeout(() => { el.style.transition = ''; if (g) g.style.transition = ''; done && done(); }, dur + 20);
  }
  function mountOverlay(el) {
    if (overlay && overlay !== el) { overlay.remove(); }
    overlay = el;
    dev.insertBefore(el, dev.querySelector('.statusbar'));
    LM.emit('overlay', el);
    // 열린 오버레이를 위로 끌어 닫기(손가락을 따라간다)
    let sy = null, moved = false, t0 = 0;
    const H = () => dev.getBoundingClientRect().height;
    el.addEventListener('pointerdown', (e) => {
      if (e.target.closest('input, .cc-slider')) return;
      const fromGrab = !!e.target.closest('.ov-grab');
      const sc = el.classList.contains('nc') ? el.scrollTop : 0;
      if (sc > 2 && !fromGrab) return;
      sy = e.clientY; moved = false; t0 = performance.now();
    });
    el.addEventListener('pointermove', (e) => {
      if (sy == null) return;
      const dy = e.clientY - sy;
      if (dy < -8) { if (!moved) { moved = true; try { el.setPointerCapture(e.pointerId); } catch (_) {} } setPull(el, 1 + dy / (H() * 0.5)); }
    });
    const end = (e) => {
      if (sy == null) return;
      const dy = e.clientY - sy, v = -dy / Math.max(1, performance.now() - t0);
      sy = null;
      if (!moved) return;
      el._dragClose = true;
      if (-dy > H() * 0.15 || v > 0.6) closeOverlay(); else settle(el, true);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('click', (e) => { if (el._dragClose) { el._dragClose = false; e.stopPropagation(); e.preventDefault(); } }, true);
  }
  function edgePull(bar) {
    let st = null;
    bar.style.touchAction = 'none';
    bar.addEventListener('pointerdown', (e) => {
      if (LM.state.locked || dev.querySelector('.passcode')) return;
      const r = dev.getBoundingClientRect();
      const kind = (e.clientX - r.left) > r.width * PULL_SPLIT ? 'cc' : 'nc';
      st = { kind, sy: e.clientY, h: r.height, el: null, ly: e.clientY, lt: performance.now(), v: 0 };
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove', (e) => {
      if (!st) return;
      const dy = e.clientY - st.sy, now = performance.now();
      if (now > st.lt) { st.v = (e.clientY - st.ly) / (now - st.lt); st.ly = e.clientY; st.lt = now; }
      if (!st.el) {
        if (dy < 6) return;
        if (overlay) closeOverlay(true);
        st.el = st.kind === 'cc' ? buildControl() : buildNotif();
        setPull(st.el, 0);
        mountOverlay(st.el);
      }
      setPull(st.el, dy / (st.h * (st.kind === 'cc' ? 0.35 : 0.6)));
    });
    const end = (e) => {
      if (!st) return;
      const s0 = st; st = null;
      if (!s0.el) return;
      bar._dragged = true;
      const open = s0.el._p > 0.3 || (s0.v > 0.8 && s0.el._p > 0.12);
      if (open) settle(s0.el, true);
      else settle(s0.el, false, () => { if (overlay === s0.el) { overlay = null; LM.emit('overlay', null); } s0.el.remove(); });
    };
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
  }
  function showOverlay(el, from) {
    if (overlay) closeOverlay(true);
    mountOverlay(el);
    if (from === 'top') { setPull(el, 0); requestAnimationFrame(() => settle(el, true)); }
    else LM.animate(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: LM.EASE.sheet });
  }
  function closeOverlay(instant) {
    if (!overlay) return;
    const o = overlay; overlay = null;
    LM.emit('overlay', null);
    if (instant === true) { o.remove(); return; }
    if (o.classList.contains('nc') || o.classList.contains('cc')) settle(o, false, () => o.remove());
    else LM.animate(o, [{ opacity: 1 }, { opacity: 0 }], { duration: 160 }).then(() => o.remove());
  }
  LM.closeOverlay = closeOverlay;

  function buildNotif() {
    const d = LM.now();
    const list = notifList();
    const el = h('div', { class: 'overlay nc', role: 'dialog', 'aria-label': '알림 센터' },
      h('div', { class: 'nc-date' }, LM.fmtDate(d) + ' · ' + list.length + '개'), h('div', { class: 'nc-clock' }, LM.fmtTime(d)),
      h('div', { class: 'n-head' }, h('b', null, '알림'), h('button', { onclick: closeOverlay }, '닫기')),
      h('div', { class: 'nstack' }, (() => {
        const groups = {};
        list.forEach((n) => { (groups[n.app] = groups[n.app] || []).push(n); });
        return Object.keys(groups).map((app) => {
          const arr = groups[app];
          const unread = groupUnread(app, arr);
          return h('div', { class: 'ngroup single' }, arr.map((n, i) => {
            const c = notifCard(n, i === 0 && arr.length > 1 ? Math.max(0, unread - 1) : 0);
            c.addEventListener('click', () => openNotif(n));
            return c;
          }));
        });
      })()),
      h('div', { class: 'ov-grab', 'aria-hidden': true }));
    return el;
  }
  function openNotifCenter() { showOverlay(buildNotif(), 'top'); }
  LM.openNotifCenter = openNotifCenter;

  function buildControl() {
    const s = LM.state;
    const btn = (icon, on, color, label, fn) => {
      const b = h('button', { class: 'cc-btn ' + color + (on ? ' on' : ''), 'aria-pressed': !!on, 'aria-label': label, onclick: () => { fn(); } }, LM.icon(icon));
      return b;
    };
    // 토글 뒤에는 열린 그대로 내용만 다시 그린다
    const redraw = () => { const fresh = buildControl(); const grid = fresh.firstChild; cur.firstChild.replaceWith(grid); grid.style.transform = 'none'; };
    const cur = h('div', { class: 'overlay cc', role: 'dialog', 'aria-label': '제어 센터', onclick: (e) => { if (e.target.classList.contains('cc')) closeOverlay(); } },
      h('div', { class: 'cc-grid' },
        h('div', { class: 'cc-tile cc-conn' },
          btn('plane', s.airplane, 'or', '비행기 모드', () => { LM.set({ airplane: !s.airplane }); redraw(); }),
          btn('signal', false, 'or', '셀룰러: 서비스 없음', () => ui.toast('서비스 없음')),
          btn('wifi', s.wifi && !s.airplane, 'bl', 'Wi-Fi', () => { if (s.airplane) return; LM.set({ wifi: !s.wifi }); if (LM.state.wifi) ui.toast('seongwon_home에 연결됨'); redraw(); }),
          btn('bluetooth', false, 'bl', '블루투스(장식)', () => {})),
        h('div', { class: 'cc-tile cc-wide' + '' }, btn('moon', s.dnd, 'pu', '방해 금지', () => { LM.set({ dnd: !s.dnd }); redraw(); }), h('div', null, '집중 모드', h('small', null, s.dnd ? '방해 금지 · 켬' : '끔'))),
        h('div', { class: 'cc-slider', style: { '--v': '55%' }, 'aria-label': '밝기(장식)' }, LM.icon('sun')),
        h('div', { class: 'cc-slider', style: { '--v': '35%' }, 'aria-label': '음량(장식)' }, LM.icon('bell')),
        h('button', { class: 'cc-tile cc-sq', 'aria-label': '스크린샷', onclick: () => { closeOverlay(); setTimeout(screenshot, 200); } }, h('span', { class: 'cc-btn' }, LM.icon('screenshot')), h('span', { class: 'cc-label' }, '스크린샷')),
        h('button', { class: 'cc-tile cc-sq' + (s.recording ? ' on' : ''), 'aria-label': '화면 기록', onclick: () => { LM.set({ recording: !s.recording }); ui.toast(LM.state.recording ? '화면 기록 시작' : '화면 기록이 사진에 저장됨'); redraw(); } }, h('span', { class: 'cc-rec' }), h('span', { class: 'cc-label' }, '화면 기록')),
        h('button', { class: 'cc-tile cc-sq', 'aria-label': '손전등(장식)' }, h('span', { class: 'cc-btn' }, LM.icon('torch')), h('span', { class: 'cc-label' }, '손전등')),
        h('button', { class: 'cc-tile cc-sq', 'aria-label': '잠그기', onclick: lockPhone }, h('span', { class: 'cc-btn' }, LM.icon('lock')), h('span', { class: 'cc-label' }, '잠그기'))));
    return cur;
  }
  function openControl() { showOverlay(buildControl(), 'top'); }

  function screenshot() {
    const f = h('div', { class: 'flash' });
    dev.appendChild(f);
    setTimeout(() => f.remove(), 100);
    LM.emit('screenshot', curApp ? curApp.id : 'home');
    ui.toast('스크린샷이 사진에 저장됨');
  }
  LM.screenshot = screenshot;

  /* 전역 검색: 접근 가능한 데이터 = 각 앱이 LM.searchSources에 등록 */
  LM.searchSources = [];
  function openSearch() {
    const res = h('div', { class: 'gs-res' });
    const norm = (s) => String(s).toLowerCase().replace(/[\s\-–—_.]/g, '');
    const run = (q) => {
      res.replaceChildren();
      if (!q) {
        res.appendChild(h('div', { class: 'grp-h', style: { padding: '8px 30px' } }, '앱'));
        res.appendChild(h('div', { class: 'gs-sugg' }, ['talk', 'note', 'photo', 'set'].map((id) => { const b = appButton(id); return b; })));
        return;
      }
      const nq = norm(q);
      const apps = Object.keys(LM.APPS).filter((id) => norm(LM.APPS[id]).includes(nq));
      if (apps.length) res.appendChild(ui.group({ header: '앱', rows: apps.map((id) => ui.row({ title: LM.APPS[id], lead: LM.appIcon(id, 30), onClick: () => openApp(id) })) }));
      let any = apps.length;
      LM.searchSources.forEach((src) => {
        const hits = src.items().filter((it) => norm(it.text).includes(nq)).slice(0, 5);
        if (!hits.length) return;
        any += hits.length;
        res.appendChild(ui.group({ header: LM.APPS[src.app], rows: hits.map((it) => ui.row({ title: it.title, subtitle: it.sub, lead: LM.appIcon(src.app, 30), onClick: () => openApp(src.app, { open: it.open }) })) }));
      });
      if (!any) res.appendChild(ui.empty({ title: '결과 없음' }));
    };
    const inp = h('input', { type: 'search', placeholder: '검색', 'aria-label': '전역 검색', oninput: (e) => run(e.target.value.trim()) });
    const el = h('div', { class: 'overlay gs', role: 'dialog', 'aria-label': '검색' },
      h('div', { style: { display: 'flex', alignItems: 'center', paddingRight: '12px' } }, h('label', { class: 'searchf', style: { flex: 1, marginBottom: 0 } }, LM.icon('search', 'searchf-ic'), inp), h('button', { style: { color: '#fff', fontSize: '17px' }, onclick: closeOverlay }, '취소')),
      h('div', { style: { height: '12px' } }), res);
    showOverlay(el);
    run('');
    setTimeout(() => inp.focus(), 50);
  }
  LM.openSearch = openSearch;

  /* 배너: 방해 금지 중엔 띄우지 않는다 */
  LM.banner = (n) => {
    if (LM.state.dnd || LM.state.locked) return;
    const b = h('div', { class: 'banner' }, notifCard(n));
    b.addEventListener('click', () => { b.remove(); openNotif(n); });
    dev.appendChild(b);
    LM.animate(b, [{ transform: 'translateY(-120%)' }, { transform: 'translateY(0)' }], { duration: 350, easing: LM.EASE.sheet });
    setTimeout(() => LM.animate(b, [{ transform: 'translateY(0)' }, { transform: 'translateY(-120%)' }], { duration: 240 }).then(() => b.remove()), 4000);
  };

  function refreshShell() {
    if (!dev) return;
    if (curApp) closeApp(true);
    closeOverlay(true);
    const nl = buildLock();
    const nh = buildHome();
    lockEl.replaceWith(nl);
    homeEl.replaceWith(nh);
    lockEl = nl;
    homeEl = nh;
    lockEl.hidden = !LM.state.locked;
    homeEl.hidden = !!LM.state.locked;
    LM.emit('app', null);
  }
  LM.refreshShell = refreshShell;
  LM.on('gload', refreshShell);

  /* ---------- 부팅 ---------- */
  LM.boot = function () {
    applyTheme();
    LM.on('state', applyTheme);
    dev = document.querySelector('.device');
    lockEl = buildLock();
    homeEl = buildHome();
    dev.append(homeEl, lockEl, h('div', { class: 'island' }), statusBar(), homeIndicator());
    if (!LM.state.locked) { lockEl.hidden = true; homeEl.hidden = false; }
    // 키보드: Esc = 뒤로/홈, H = 홈
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return;
      if (e.key === 'Escape') { if (dev.querySelector('.sheet-wrap')) dev.querySelector('.sheet-wrap').close(); else if (curApp && curApp.pop()) {} else goHomeAction(); }
    });
    // 개발용: ?unlock 이면 잠금 해제 상태로, ?app=id 면 그 앱을 연다. ?new 면 새 게임.
    const q = new URLSearchParams(location.search);
    if (q.has('light')) LM.set({ theme: 'light' });
    const devBypass = !!(q.has('unlock') || q.get('app'));
    if (!devBypass && LM.prologue && LM.G && !LM.G.prologueSeen) LM.prologue.play();
    if (q.has('unlock') || q.get('app')) unlock();
    if (q.get('app')) openApp(q.get('app'));
    document.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.act;
      if (a === 'notif') { if (!LM.state.locked) openNotifCenter(); }
      else if (a === 'cc') { if (!LM.state.locked) openControl(); }
      else if (a === 'search') { if (!LM.state.locked) openSearch(); }
      else if (a === 'home') goHomeAction();
      else if (a === 'lock') lockPhone();
      else if (a === 'pause') { if (LM.pauseUI) LM.pauseUI.open(); }
      else if (a === 'theme') LM.set({ theme: LM.state.theme === 'dark' ? 'light' : 'dark' });
    }));
    // 알림이 새로 오면 잠금화면 목록도 다시 그린다(알림 센터는 열 때마다 최신).
    LM.on('notifs', () => { if (lockEl && lockEl._refreshNotifs) lockEl._refreshNotifs(); });
    LM.on('read', () => { if (lockEl && lockEl._refreshNotifs) lockEl._refreshNotifs(); });
    if (LM._onlineCheck) LM._onlineCheck();
    if (LM.sched) LM.sched._flush();
    if (LM.pauseUI) LM.pauseUI.init();
    if (LM.debugPanel) LM.debugPanel.init();
  };
})();
