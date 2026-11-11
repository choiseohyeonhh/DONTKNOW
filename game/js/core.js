/* LUMA 프로토타입 코어: DOM 헬퍼, 상태, 시계, 앱 등록, 내비 스택, 공통 UI.
 * 설계: design/02-design/COMPONENT_SPECIFICATIONS.md, INTERACTION_SPECIFICATIONS.md, NAVIGATION_ARCHITECTURE.md
 * 클래식 스크립트(모듈 아님) — file:// 에서도 동작한다. */
(function () {
  'use strict';
  const LM = (window.LM = window.LM || {});

  /* ---------- DOM ---------- */
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'style' && typeof v === 'object') { for (const sk in v) { if (sk.startsWith('--')) el.style.setProperty(sk, v[sk]); else el.style[sk] = v[sk]; } }
        else if (k === 'html') el.innerHTML = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'data' && typeof v === 'object') for (const d in v) el.dataset[d] = v[d];
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    append(el, kids);
    return el;
  }
  function append(el, kids) {
    for (const c of kids) {
      if (c == null || c === false) continue;
      if (Array.isArray(c)) append(el, c);
      else el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
    }
  }
  function svg(markup, cls) {
    const t = document.createElement('template');
    t.innerHTML = markup.trim();
    const el = t.content.firstChild;
    if (cls) el.setAttribute('class', cls);
    return el;
  }
  LM.h = h;
  LM.svg = svg;

  /* ---------- 이벤트 ---------- */
  const subs = {};
  LM.on = (ev, fn) => ((subs[ev] = subs[ev] || []).push(fn), () => (subs[ev] = subs[ev].filter((f) => f !== fn)));
  LM.emit = (ev, data) => (subs[ev] || []).forEach((f) => f(data));

  /* ---------- 상태 ---------- */
  const saved = (() => { try { return JSON.parse(localStorage.getItem('lm.proto') || '{}'); } catch (e) { return {}; } })();
  LM.state = Object.assign({
    theme: 'dark',          // 캐논: 도현의 폰은 다크로 시작(Q-OPEN-017 결정: 설정에서 전환 허용)
    textSize: 'md',
    reduceMotion: false,
    wifi: false,            // 캐논: Wi-Fi 꺼짐으로 시작
    airplane: false,
    dnd: true,              // 캐논: 방해 금지 켜진 채 시작(슬레이트 공유)
    preview: { blink: 'off', loopdm: 'off' },
    locked: true,
  }, saved.prefs || {});
  /* 게임 상태와 UI 상태를 잇는 훅. state.js가 로드되면 LM.set이 게임 상태를 G에도 기록한다. */
  LM.set = (patch) => {
    Object.assign(LM.state, patch);
    try { localStorage.setItem('lm.proto', JSON.stringify({ prefs: { theme: LM.state.theme, textSize: LM.state.textSize, reduceMotion: LM.state.reduceMotion } })); } catch (e) { /* 저장 불가 무시 */ }
    if (LM.onStateSet) { try { LM.onStateSet(patch); } catch (e) { console.error(e); } }
    LM.emit('state', patch);
  };
  LM.online = () => LM.state.wifi && !LM.state.airplane;

  /* 콘텐츠 스크립트가 엔진보다 먼저 로드되므로 스케줄러의 조기 등록을 받아 둔다. */
  if (!LM.sched) {
    const qDefs = {};
    const qCalls = [];
    LM.sched = {
      _stub: true, _qDefs: qDefs, _qCalls: qCalls,
      def(id, fn) { if (typeof fn === 'function') qDefs[id] = fn; return fn; },
      at() { qCalls.push(['at', Array.prototype.slice.call(arguments)]); },
      after() { qCalls.push(['after', Array.prototype.slice.call(arguments)]); },
      afterOnline() { qCalls.push(['afterOnline', Array.prototype.slice.call(arguments)]); },
      cancel() { return false; },
      list() { return []; },
    };
  }

  /* ---------- 표시 도우미 (시계 자체는 engine/clock.js) ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  LM.fmtTime = (d) => pad(d.getHours()) + ':' + pad(d.getMinutes());
  LM.fmtDate = (d) => (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + '일월화수목금토'[d.getDay()] + '요일';
  LM.fmtDateTime = (d) => (d.getMonth() + 1) + '/' + d.getDate() + ' ' + LM.fmtTime(d);

  /* 앱 전체가 쓰는 단일 날짜·금액 포매터(UI_UX_GUIDELINES 2.5). */
  function toDate(v, fallbackYear) {
    if (v == null || v === '') return null;
    if (v instanceof Date) return v;
    if (typeof v === 'number') return new Date(v);
    const s = String(v).trim();
    let m = s.match(/^(\d{4})[.\-\/]\s*(\d{1,2})[.\-\/]\s*(\d{1,2})\.?(?:\s+(\d{1,2}):(\d{2}))?/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
    m = s.match(/^(\d{1,2})[\/.](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?$/);
    if (m) return new Date(fallbackYear || 2026, +m[1] - 1, +m[2], +(m[3] || 0), +(m[4] || 0));
    const t = new Date(s);
    return Number.isFinite(t.getTime()) ? t : null;
  }
  function amount(v) {
    if (typeof v === 'string') {
      const t = v.replace(/[^\d.-]/g, '');
      if (t === '' || t === '-') return v;
      const n = Number(t);
      if (!Number.isFinite(n)) return v;
      v = n;
    }
    if (typeof v !== 'number' || !Number.isFinite(v)) return String(v == null ? '' : v);
    const sign = v < 0 ? '−' : '';
    return sign + Math.abs(v).toLocaleString('ko-KR') + '원';
  }
  LM.fmt = {
    pad,
    date: (v, style) => {
      const d = toDate(v);
      if (!d) return String(v == null ? '' : v);
      switch (style) {
        case 'abs': return d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate());
        case 'md': return (d.getMonth() + 1) + '/' + d.getDate();
        case 'hm': return pad(d.getHours()) + ':' + pad(d.getMinutes());
        case 'mdhm': return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
        case 'long': return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + '일월화수목금토'[d.getDay()] + '요일';
        default: return d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
      }
    },
    amount,
    toDate,
  };

  /* ---------- 앱 등록 ---------- */
  LM.apps = {};
  LM.register = (def) => { LM.apps[def.id] = def; };

  /* ---------- 움직임 ---------- */
  LM.motion = () => !(LM.state.reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function animate(el, frames, opts) {
    if (!LM.motion()) {
      const last = frames[frames.length - 1];
      return el.animate([{ opacity: 0.6 }, { opacity: 1, transform: last.transform || 'none' }], { duration: 150, fill: 'forwards' }).finished;
    }
    return el.animate(frames, Object.assign({ fill: 'forwards' }, opts)).finished;
  }
  LM.animate = animate;
  const SHEET = 'cubic-bezier(0.32, 0.72, 0, 1)';
  LM.EASE = { sheet: SHEET, std: 'cubic-bezier(0.2, 0.8, 0.2, 1)', exit: 'cubic-bezier(0.4, 0, 1, 1)' };

  /* ---------- 내비 스택 ---------- */
  function Stack(container, app) {
    this.el = h('div', { class: 'stack' });
    container.appendChild(this.el);
    this.screens = [];
    this.app = app;
    enableEdgeBack(this);
  }
  Stack.prototype.push = function (build, opts) {
    const nav = this.app;
    const scr = build(nav);
    scr.classList.add('scr');
    const prev = this.screens[this.screens.length - 1];
    this.screens.push(scr);
    this.el.appendChild(scr);
    if (prev && !(opts && opts.instant)) {
      animate(scr, [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], { duration: 350, easing: SHEET });
      animate(prev, [{ transform: 'translateX(0)', filter: 'brightness(1)' }, { transform: 'translateX(-30%)', filter: 'brightness(0.9)' }], { duration: 350, easing: SHEET })
        .then(() => prev.classList.add('covered'));
    } else if (prev) prev.classList.add('covered');
    return scr;
  };
  Stack.prototype.pop = function () {
    if (this.screens.length < 2) return false;
    const top = this.screens.pop();
    const prev = this.screens[this.screens.length - 1];
    prev.classList.remove('covered');
    animate(prev, [{ transform: 'translateX(-30%)', filter: 'brightness(0.9)' }, { transform: 'translateX(0)', filter: 'brightness(1)' }], { duration: 350, easing: SHEET });
    animate(top, [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }], { duration: 350, easing: SHEET }).then(() => top.remove());
    return true;
  };
  Stack.prototype.depth = function () { return this.screens.length; };

  function enableEdgeBack(stack) {
    let sx = 0, dx = 0, active = false, top = null, prev = null, w = 1;
    stack.el.addEventListener('pointerdown', (e) => {
      const r = stack.el.getBoundingClientRect();
      if (e.clientX - r.left > 20 || stack.screens.length < 2) return;
      active = true; sx = e.clientX; dx = 0; w = r.width;
      top = stack.screens[stack.screens.length - 1];
      prev = stack.screens[stack.screens.length - 2];
      prev.classList.remove('covered');
      stack.el.setPointerCapture(e.pointerId);
    });
    stack.el.addEventListener('pointermove', (e) => {
      if (!active) return;
      dx = Math.max(0, e.clientX - sx);
      top.getAnimations().forEach((a) => a.cancel());
      prev.getAnimations().forEach((a) => a.cancel());
      top.style.transform = `translateX(${dx}px)`;
      prev.style.transform = `translateX(${-30 + (dx / w) * 30}%)`;
    });
    const end = () => {
      if (!active) return;
      active = false;
      top.style.transform = ''; prev.style.transform = '';
      if (dx / w > 0.35) {
        stack.screens.pop();
        animate(prev, [{ transform: `translateX(${-30 + (dx / w) * 30}%)` }, { transform: 'translateX(0)' }], { duration: 240, easing: SHEET });
        animate(top, [{ transform: `translateX(${dx}px)` }, { transform: 'translateX(100%)' }], { duration: 240, easing: SHEET }).then(() => top.remove());
      } else {
        animate(top, [{ transform: `translateX(${dx}px)` }, { transform: 'translateX(0)' }], { duration: 240, easing: SHEET });
        animate(prev, [{ transform: `translateX(${-30 + (dx / w) * 30}%)` }, { transform: 'translateX(-30%)' }], { duration: 240, easing: SHEET }).then(() => prev.classList.add('covered'));
      }
    };
    stack.el.addEventListener('pointerup', end);
    stack.el.addEventListener('pointercancel', end);
  }

  /* ---------- 앱 인스턴스 ---------- */
  LM.createApp = function (def, layer) {
    const app = { id: def.id, def, root: layer, tabs: null, stacks: [], active: 0 };
    app.stack = () => app.stacks[app.active];
    app.push = (build, opts) => app.stack().push(build, opts);
    app.pop = () => app.stack().pop();
    app.present = (build, opts) => LM.ui.sheet(layer, build(app), opts);
    app.toast = (t) => LM.ui.toast(t);
    app.setTabs = (tabs, initial) => {
      app.tabs = tabs;
      const body = h('div', { class: 'tabbody' });
      layer.appendChild(body);
      const bar = h('nav', { class: 'tabbar', role: 'tablist' });
      const syncBadges = () => {
        if (!bar.isConnected) { offRead(); offMsg(); return; }
        tabs.forEach((t) => {
          if (!t._badgeEl) return;
          const n = typeof t.badge === 'function' ? t.badge() : t.badge;
          t._badgeEl.textContent = n ? String(n) : '';
          t._badgeEl.hidden = !n;
        });
      };
      const offRead = LM.on('read', syncBadges);
      const offMsg = LM.on('msg', syncBadges);
      tabs.forEach((t, i) => {
        const holder = h('div', { class: 'tabpane', hidden: true });
        body.appendChild(holder);
        const st = new Stack(holder, app);
        app.stacks.push(st);
        t._holder = holder;
        if (t.badge !== undefined) {
          t._badgeEl = h('i', { class: 'tab-badge' });
          t._badgeEl.hidden = true;
        }
        t._btn = h('button', { class: 'tab', role: 'tab', 'aria-label': t.label, onclick: () => app.select(i) },
          LM.icon(t.icon, 'tab-ic'), h('span', null, t.label), t._badgeEl || null);
        bar.appendChild(t._btn);
      });
      layer.appendChild(bar);
      layer.classList.add('has-tabbar');
      syncBadges();
      app.select = (i) => {
        if (app.active === i && app.stacks[i].depth() > 1) { while (app.stacks[i].depth() > 1) app.stacks[i].pop(); }
        app.active = i;
        tabs.forEach((t, j) => { t._holder.hidden = j !== i; t._btn.classList.toggle('on', j === i); t._btn.setAttribute('aria-selected', j === i); });
        if (!app.stacks[i].depth()) app.stacks[i].push(tabs[i].build, { instant: true });
      };
      app.select(initial || 0);
    };
    app.start = (build) => {
      const st = new Stack(layer, app);
      app.stacks.push(st);
      st.push(build, { instant: true });
    };
    return app;
  };

  /* ---------- 공통 UI ---------- */
  const ui = (LM.ui = {});

  /* 페이지: 큰 제목 내비 바 + 스크롤 본문 */
  ui.page = function (o) {
    const small = h('div', { class: 'nb-title' }, o.title || '');
    const left = h('div', { class: 'nb-left' });
    if (o.back) left.appendChild(h('button', { class: 'nb-back', 'aria-label': '뒤로', onclick: o.onBack || (() => o.nav && o.nav.pop()) }, LM.icon('chevron-left', 'nb-back-ic'), h('span', null, '뒤로')));
    if (o.left) append(left, [o.left]);
    const right = h('div', { class: 'nb-right' }, o.right || null);
    const bar = h('header', { class: 'nb' + (o.large === false ? ' nb-std' : '') + (o.transparent ? ' nb-clear' : '') }, left, small, right);
    const scroll = h('div', { class: 'sc' + (o.grouped ? ' grouped' : '') + (o.noPad ? ' nopad' : '') });
    if (o.large !== false && o.title) scroll.appendChild(h('h1', { class: 'lt' }, o.title, o.titleAccessory || null));
    if (o.search) scroll.appendChild(ui.search(o.search, o.onSearch));
    append(scroll, [o.body]);
    const s = h('section', { class: 'scr' + (o.class ? ' ' + o.class : '') }, bar, scroll, o.footer || null);
    const thr = o.large === false ? 2 : 38;
    scroll.addEventListener('scroll', () => bar.classList.toggle('scrolled', scroll.scrollTop > thr), { passive: true });
    if (o.large === false) bar.classList.add('show-title');
    s.scroller = scroll;
    return s;
  };

  ui.search = (placeholder, onInput) => {
    const inp = h('input', { type: 'search', placeholder, 'aria-label': placeholder, oninput: (e) => onInput && onInput(e.target.value) });
    return h('label', { class: 'searchf' }, LM.icon('search', 'searchf-ic'), inp);
  };

  /* 인셋 그룹 목록 */
  ui.group = (o) => h('div', { class: 'grp' + (o.plain ? ' plain' : '') },
    o.header ? h('div', { class: 'grp-h' }, o.header) : null,
    h('div', { class: 'grp-b' }, o.rows),
    o.footer ? h('div', { class: 'grp-f' }, o.footer) : null);

  ui.row = (o) => {
    const ic = o.icon ? h('span', { class: 'row-ic', style: o.iconBg ? { background: o.iconBg } : null }, LM.icon(o.icon)) : null;
    const lead = o.lead || ic || (o.avatar ? ui.avatar(o.avatar, o.avatarSize || 40) : null);
    const acc = [];
    if (o.value != null) acc.push(h('span', { class: 'row-val' }, o.value));
    if (o.badge) acc.push(ui.badge(o.badge));
    if (o.toggle) acc.push(ui.toggle(o.toggle.on, o.toggle.onChange, o.title));
    if (o.check) acc.push(LM.icon('check', 'row-check'));
    if (o.accessory) acc.push(o.accessory);
    if (o.chevron !== false && (o.onClick || o.chevron) && !o.toggle && !o.destructive && !o.action) acc.push(LM.icon('chevron-right', 'row-chev'));
    const text = h('div', { class: 'row-t' },
      h('div', { class: 'row-1' }, h('span', { class: 'row-title' }, o.title), o.meta ? h('span', { class: 'row-meta' }, o.meta) : null),
      o.subtitle ? h('div', { class: 'row-2' }, o.subtitle) : null,
      o.extra || null);
    const cls = 'row' + (o.subtitle ? ' two' : '') + (o.thumb ? ' thumb' : '') + (o.destructive ? ' destr' : '') + (o.action ? ' act' : '') + (o.dim ? ' dim' : '') + (o.class ? ' ' + o.class : '');
    const el = h(o.onClick ? 'button' : 'div', { class: cls, onclick: o.onClick || null }, lead, text, acc.length ? h('div', { class: 'row-acc' }, acc) : null);
    if (o.onLong) LM.longPress(el, o.onLong);
    return el;
  };

  ui.toggle = (on, onChange, label) => {
    const b = h('button', { class: 'sw' + (on ? ' on' : ''), role: 'switch', 'aria-checked': !!on, 'aria-label': label || '스위치' });
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const v = !b.classList.contains('on');
      b.classList.toggle('on', v); b.setAttribute('aria-checked', v);
      onChange && onChange(v);
    });
    return b;
  };

  ui.segmented = (opts, value, onChange) => {
    const el = h('div', { class: 'seg', role: 'tablist' });
    opts.forEach((o) => {
      const b = h('button', { class: 'seg-i' + (o === value ? ' on' : ''), role: 'tab', 'aria-selected': o === value, onclick: () => {
        el.querySelectorAll('.seg-i').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
        onChange && onChange(o);
      } }, o);
      el.appendChild(b);
    });
    return el;
  };

  ui.badge = (n) => h('span', { class: 'badge', 'aria-label': '안 읽은 메시지 ' + n + '개' }, n);

  ui.button = (o) => h('button', { class: 'btn ' + (o.kind || 'filled') + ' ' + (o.size || 'm'), onclick: o.onClick, disabled: o.disabled }, o.icon ? LM.icon(o.icon) : null, o.label);

  /* 아바타: 얼굴 대신 이름 첫 글자(캐논 얼굴 원칙) */
  ui.avatar = (name, size, o) => {
    o = o || {};
    const n = String(name || '?');
    let hash = 0; for (const c of n) hash = (hash * 31 + c.codePointAt(0)) >>> 0;
    const hues = [212, 28, 152, 280, 345, 190, 40, 260];
    const hue = o.hue != null ? o.hue : hues[hash % hues.length];
    const el = h('span', { class: 'av' + (o.ring ? ' ring' + (o.ring === 'seen' ? ' seen' : '') : ''), style: { width: size + 'px', height: size + 'px', fontSize: Math.round(size * 0.42) + 'px', '--av-h': hue }, 'aria-hidden': true },
      h('span', { class: 'av-in' }, o.glyph ? LM.icon(o.glyph) : n.replace(/^@/, '').charAt(0).toUpperCase()));
    if (o.active) el.appendChild(h('i', { class: 'av-dot' }));
    return el;
  };

  /* 폰 속 사진 자리표시: 실제 일러스트가 들어올 자리. 키워드로 색만 정해 결정적으로 그린다 */
  ui.photo = (key, o) => {
    o = o || {};
    let hash = 7; for (const c of String(key)) hash = (hash * 33 + c.codePointAt(0)) >>> 0;
    const a = hash % 360, b = (a + 40 + (hash % 80)) % 360;
    const night = /밤|야근|21:|20:|night|B2|주차/.test(key);
    const bg = night
      ? `radial-gradient(120% 80% at ${20 + (hash % 60)}% 20%, hsl(${a} 40% 32%), transparent 60%), linear-gradient(160deg, hsl(${b} 30% 14%), hsl(${a} 25% 8%))`
      : `radial-gradient(120% 90% at ${hash % 100}% 10%, hsl(${a} 45% 72%), transparent 55%), linear-gradient(170deg, hsl(${b} 35% 56%), hsl(${a} 30% 36%))`;
    return h('div', { class: 'ph' + (o.class ? ' ' + o.class : ''), style: { background: bg, aspectRatio: o.ratio || '1 / 1' }, role: 'img', 'aria-label': o.alt || key },
      o.caption !== false ? h('span', { class: 'ph-cap' }, o.alt || key) : null);
  };

  ui.empty = (o) => h('div', { class: 'empty' }, o.icon ? LM.icon(o.icon, 'empty-ic') : null, h('div', { class: 'empty-t' }, o.title), o.text ? h('div', { class: 'empty-s' }, o.text) : null, o.action || null);

  ui.notice = (text, kind) => h('div', { class: 'notice ' + (kind || '') }, LM.icon(kind === 'warn' ? 'alert' : 'info', 'notice-ic'), h('span', null, text));

  ui.section = (title, action) => h('div', { class: 'sec-h' }, h('span', null, title), action || null);

  /* 시트 */
  ui.sheet = (host, content, o) => {
    o = o || {};
    host = host || (LM.current && LM.current() && LM.current().root) || document.querySelector('.device');
    const scrim = h('div', { class: 'scrim' });
    const grab = h('div', { class: 'sheet-grab' }, h('i'));
    const sheet = h('div', { class: 'sheet ' + (o.size || 'large'), role: 'dialog', 'aria-modal': 'true' }, grab, content);
    const wrap = h('div', { class: 'sheet-wrap' }, scrim, sheet);
    host.appendChild(wrap);
    const close = () => {
      animate(scrim, [{ opacity: 1 }, { opacity: 0 }], { duration: 240 });
      animate(sheet, [{ transform: getComputedStyle(sheet).transform === 'none' ? 'translateY(0)' : getComputedStyle(sheet).transform }, { transform: 'translateY(100%)' }], { duration: 300, easing: SHEET }).then(() => wrap.remove());
      o.onClose && o.onClose();
    };
    scrim.addEventListener('click', close);
    animate(scrim, [{ opacity: 0 }, { opacity: 1 }], { duration: 240 });
    animate(sheet, [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 350, easing: SHEET });
    // 끌어내려 닫기
    let sy = 0, dy = 0, drag = false;
    grab.addEventListener('pointerdown', (e) => { drag = true; sy = e.clientY; grab.setPointerCapture(e.pointerId); sheet.getAnimations().forEach((a) => a.finish()); });
    grab.addEventListener('pointermove', (e) => { if (!drag) return; dy = Math.max(0, e.clientY - sy); sheet.style.transform = `translateY(${dy}px)`; });
    grab.addEventListener('pointerup', () => { drag = false; if (dy > 120) close(); else { sheet.style.transform = ''; } dy = 0; });
    wrap.close = close;
    content.closeSheet = close;
    return wrap;
  };

  ui.sheetPage = (o) => {
    const head = h('div', { class: 'sh-head' },
      h('button', { class: 'sh-btn', onclick: (e) => e.target.closest('.sheet-wrap').close() }, o.cancel || '닫기'),
      h('div', { class: 'sh-title' }, o.title || ''),
      o.done ? h('button', { class: 'sh-btn strong', onclick: (e) => { o.onDone && o.onDone(); e.target.closest('.sheet-wrap').close(); } }, o.done) : h('span', { class: 'sh-btn' }));
    return h('div', { class: 'sh-page' }, head, h('div', { class: 'sh-body' + (o.grouped ? ' grouped' : '') }, o.body));
  };

  ui.actionSheet = (o) => {
    const dev = o.host || document.querySelector('.device');
    const scrim = h('div', { class: 'scrim' });
    const box = h('div', { class: 'as', role: 'dialog' });
    const close = () => { animate(box, [{ transform: 'translateY(0)' }, { transform: 'translateY(110%)' }], { duration: 240, easing: SHEET }); animate(scrim, [{ opacity: 1 }, { opacity: 0 }], { duration: 240 }).then(() => wrap.remove()); };
    const grp = h('div', { class: 'as-grp' }, o.title ? h('div', { class: 'as-title' }, o.title, o.text ? h('small', null, o.text) : null) : null,
      o.actions.map((a) => h('button', { class: 'as-btn' + (a.destructive ? ' destr' : ''), onclick: () => { close(); a.onClick && a.onClick(); } }, a.label)));
    box.append(grp, h('button', { class: 'as-btn as-cancel', onclick: close }, '취소'));
    const wrap = h('div', { class: 'as-wrap' }, scrim, box);
    scrim.addEventListener('click', close);
    dev.appendChild(wrap);
    animate(scrim, [{ opacity: 0 }, { opacity: 1 }], { duration: 240 });
    animate(box, [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], { duration: 350, easing: SHEET });
  };

  /* 중앙 경고창: 캐논상 원격 지우기·암호 변경 확인 두 곳만 */
  ui.alert = (o) => {
    const dev = o.host || document.querySelector('.device');
    const box = h('div', { class: 'al', role: 'alertdialog', 'aria-modal': 'true' },
      h('div', { class: 'al-t' }, o.title), o.text ? h('div', { class: 'al-s' }, o.text) : null,
      h('div', { class: 'al-btns' }, o.actions.map((a) => h('button', { class: 'al-b' + (a.destructive ? ' destr' : '') + (a.cancel ? ' cancel' : ''), onclick: () => { wrap.remove(); a.onClick && a.onClick(); } }, a.label))));
    const wrap = h('div', { class: 'al-wrap' }, h('div', { class: 'scrim' }), box);
    dev.appendChild(wrap);
    animate(box, [{ transform: 'scale(1.12)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 240, easing: LM.EASE.std });
  };

  ui.toast = (text) => {
    const dev = document.querySelector('.device');
    const t = h('div', { class: 'toast', role: 'status' }, text);
    dev.appendChild(t);
    animate(t, [{ opacity: 0, transform: 'translate(-50%, 8px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 240, easing: LM.EASE.std });
    setTimeout(() => animate(t, [{ opacity: 1 }, { opacity: 0 }], { duration: 240 }).then(() => t.remove()), 3000);
  };

  /* 맥락 메뉴(길게 누르기 500ms) */
  LM.longPress = (el, fn) => {
    let t = null;
    el.addEventListener('pointerdown', (e) => { t = setTimeout(() => { t = null; el.dataset.lp = '1'; fn(e); }, 500); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => el.addEventListener(ev, () => { clearTimeout(t); }));
    el.addEventListener('click', (e) => { if (el.dataset.lp) { e.stopImmediatePropagation(); e.preventDefault(); delete el.dataset.lp; } }, true);
  };
  ui.contextMenu = (items, title) => ui.actionSheet({ title, actions: items });

  /* 정보(i) 패널: 라벨-값 2열 */
  ui.info = (title, pairs) => ui.sheet(null, ui.sheetPage({ title: title || '정보', body: ui.group({ rows: pairs.map(([k, v]) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v))) }), grouped: true }), { size: 'medium' });

  /* 공유 시트 */
  ui.share = (what) => {
    const targets = ['지훈', '서아', '아빠', '하린', '김태윤 경위'];
    const apps = [['msg', '메시지'], ['talk', '톡'], ['loop', '루프 DM'], ['mail', '메일'], ['blink', '블링크']];
    const body = h('div', { class: 'share' },
      h('div', { class: 'share-what' }, LM.icon('doc'), h('span', null, what || '항목')),
      h('div', { class: 'share-row' }, targets.map((n) => h('button', { class: 'share-t', onclick: (e) => { e.target.closest('.sheet-wrap').close(); ui.toast(n + '에게 보낼 준비가 됐다(프로토타입)'); } }, ui.avatar(n, 56), h('span', null, n)))),
      h('div', { class: 'share-row' }, apps.map(([id, n]) => h('button', { class: 'share-t', onclick: (e) => { e.target.closest('.sheet-wrap').close(); ui.toast(n + '로 공유(프로토타입)'); } }, LM.appIcon(id, 56), h('span', null, n)))),
      ui.group({ rows: [ui.row({ title: '복사', icon: 'copy', action: true, onClick: (e) => { e.target.closest('.sheet-wrap').close(); ui.toast('복사됨'); } }), ui.row({ title: '스크린샷으로 저장', icon: 'photo', action: true, onClick: (e) => { e.target.closest('.sheet-wrap').close(); ui.toast('사진에 저장됨'); } })] }));
    ui.sheet(null, ui.sheetPage({ title: '공유', body }), { size: 'medium' });
  };
})();
