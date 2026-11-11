/* 이벤트 스케줄러. 예약은 데이터로 G.sched에 남고, 실행 함수는 부팅 때 def()로 등록한다.
 * 같은 id는 최대 1회. 오프라인 전용(needsOnline) 예약은 온라인이 될 때까지 기다린다.
 * 설계: PROGRESSION_AND_ENDINGS 3절 오프라인 규칙, STATE_MANAGEMENT 7~8절 */
(function () {
  'use strict';
  const LM = window.LM;
  const defs = Object.create(null);
  const early = LM.sched && LM.sched._stub ? LM.sched : null;
  if (early) Object.assign(defs, early._qDefs || {});

  function G() { return LM.G; }
  function online() { return !!(LM.online && LM.online()); }
  function ensure() {
    const g = G();
    if (!Array.isArray(g.sched)) g.sched = [];
    if (!g.events || typeof g.events !== 'object') g.events = {};
    return g;
  }
  function toMs(when) {
    if (when instanceof Date) return when.getTime();
    if (typeof when === 'string') { const t = new Date(when).getTime(); return Number.isFinite(t) ? t : 0; }
    const n = Number(when);
    return Number.isFinite(n) ? n : 0;
  }
  function sort(a, b) {
    const ax = a.at == null ? Infinity : a.at;
    const bx = b.at == null ? Infinity : b.at;
    if (ax !== bx) return ax - bx;
    return String(a.id).localeCompare(String(b.id));
  }
  function saveSoon() { if (LM._autosave) LM._autosave(); }

  function add(entry) {
    const g = ensure();
    if (g.events[entry.id]) return false;
    g.sched = g.sched.filter((e) => e.id !== entry.id);
    g.sched.push(entry);
    g.sched.sort(sort);
    LM.emit('g', { path: 'sched', value: g.sched.length });
    LM.emit('sched', entry);
    saveSoon();
    flush();
    return true;
  }

  function def(id, fn) {
    if (typeof fn === 'function') defs[id] = fn;
    flush();
    return fn;
  }

  function at(id, when, fn, opts) {
    if (typeof fn === 'function') def(id, fn);
    return add({ id: String(id), at: toMs(when), kind: 'at', opts: opts || {} });
  }

  function after(id, gameMinutes, fn, opts) {
    if (typeof fn === 'function') def(id, fn);
    const g = ensure();
    return add({ id: String(id), at: g.gameMs + (Number(gameMinutes) || 0) * 60000, kind: 'after', opts: opts || {} });
  }

  function afterOnline(id, gameMinutes, fn, opts) {
    if (typeof fn === 'function') def(id, fn);
    const g = ensure();
    const mins = Number(gameMinutes) || 0;
    const base = g.firstOnlineAt;
    return add({
      id: String(id), at: base == null ? null : base + mins * 60000,
      kind: 'afterOnline', minutes: mins, opts: opts || {},
    });
  }

  function cancel(id) {
    const g = ensure();
    const before = g.sched.length;
    g.sched = g.sched.filter((e) => e.id !== String(id));
    if (g.sched.length !== before) { saveSoon(); LM.emit('sched:cancel', { id: String(id) }); return true; }
    return false;
  }

  function resolveAfterOnline() {
    const g = ensure();
    if (g.firstOnlineAt == null) return;
    let changed = false;
    g.sched.forEach((e) => {
      if (e.kind === 'afterOnline' && e.at == null) {
        e.at = g.firstOnlineAt + (Number(e.minutes) || 0) * 60000;
        changed = true;
      }
    });
    if (changed) { g.sched.sort(sort); saveSoon(); }
  }

  function nextDue(target, skip) {
    const g = ensure();
    let best = null;
    for (const e of g.sched) {
      if (e.at == null || e.at > target) continue;
      if (skip && skip.has(e.id)) continue;
      if (e.opts && e.opts.needsOnline && !online()) continue;
      if (!best || sort(e, best) < 0) best = e;
    }
    return best;
  }

  function fire(entry) {
    const g = ensure();
    g.sched = g.sched.filter((e) => e !== entry && e.id !== entry.id);
    g.events[entry.id] = g.gameMs;
    LM.logEvent('ev.fire', { id: entry.id, at: entry.at });
    const fn = defs[entry.id];
    if (fn) {
      try { fn({ id: entry.id, at: entry.at, late: g.gameMs - entry.at }); }
      catch (err) { console.error('[scheduler]', entry.id, err); }
    }
    LM.emit('event', { id: entry.id });
    LM.emit('g', { path: 'events.' + entry.id, value: g.events[entry.id] });
    saveSoon();
  }

  const missingWarned = Object.create(null);

  function advanceTo(target) {
    const g = ensure();
    resolveAfterOnline();
    const skip = new Set();
    let guard = 0;
    for (;;) {
      const e = nextDue(target, skip);
      if (!e) break;
      if (!defs[e.id]) {
        /* 미등록 이벤트는 그 자리에 남겨 두고, 같은 id 순서만 지킨다.
         * 다른 id의 이벤트는 막지 않는다(예전에는 여기서 전부 멈췄다). */
        if (!missingWarned[e.id]) {
          missingWarned[e.id] = true;
          console.warn('[scheduler] 등록되지 않은 이벤트를 건너뛴다:', e.id);
        }
        skip.add(e.id);
        continue;
      }
      if (e.at > g.gameMs) g.gameMs = e.at;
      fire(e);
      if (++guard > 2000) { console.warn('[scheduler] 너무 많은 이벤트'); break; }
    }
    if (g.gameMs < target) g.gameMs = target;
    return g.gameMs;
  }

  function flush() {
    resolveAfterOnline();
    const g = ensure();
    return advanceTo(g.gameMs);
  }

  LM.sched = {
    at: at,
    after: after,
    afterOnline: afterOnline,
    cancel: cancel,
    def: def,
    list: () => ensure().sched.slice(),
    _checkDue: flush,
    _flush: flush,
    _advanceTo: advanceTo,
    _firstOnline: function () { resolveAfterOnline(); flush(); },
  };

  if (early && Array.isArray(early._qCalls)) {
    early._qCalls.forEach((pair) => {
      const method = pair[0], args = pair[1] || [];
      if (LM.sched[method]) LM.sched[method].apply(null, args);
    });
  }
})();
