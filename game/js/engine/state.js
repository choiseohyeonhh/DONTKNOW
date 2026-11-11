/* 단일 세이브 상태 LM.G. 설계: design/04-tech/STATE_MANAGEMENT.md
 * 모든 게임 가변 상태는 이 객체 하나에 있다. 함수·DOM·Date를 넣지 않는다. */
(function () {
  'use strict';
  const LM = window.LM;

  const AUTO_KEY = 'dk.save.auto';
  const SLOT_KEY = (slot) => (slot === 'auto' ? AUTO_KEY : 'dk.save.' + slot);
  const START = new Date(2026, 2, 17, 21, 10, 0).getTime();
  const DEFAULT_FLAGS = {
    CONFESS: false, NAME_SENT: false, REC: 'device', REC_SENT: false, PLATE_SENT: false,
    LOC_SENT: false, MAIL: 'pending', LEAK: false, WIPED: false, WIPE_SLATE: false,
    MOVED: false, HARIN: 'none', GO: false, LOC: 'none',
  };
  const DEFAULT_NPC = { DH: 0, alert: 0, JH: 0, SA: 0, HR: 0, MJ: 0, KT: 0, KS: 0, MJturns: 0 };

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function seedFromQuery() {
    try {
      const q = new URLSearchParams(location.search);
      const n = parseInt(q.get('seed'), 10);
      if (Number.isFinite(n)) return n;
    } catch (e) { /* ignore */ }
    return 20260317;
  }

  function initialNotifs() {
    return (LM.NOTIFS || []).map((n, i) => ({
      id: 'init:' + i, app: n.app, title: n.title, body: n.body,
      t: n.t, at: null, hidden: !!n.hidden, initial: true,
    }));
  }

  function baseState(seed) {
    return {
      v: 1,
      seed: seed == null ? seedFromQuery() : seed,
      gameMs: START,
      firstOnlineAt: null,
      unlocked: false,
      flags: Object.assign({}, DEFAULT_FLAGS),
      npc: Object.assign({}, DEFAULT_NPC),
      seen: {}, read: {},
      sync: { notes: true, photos: true, voice: false, mail: true },
      events: {}, traces: {}, outbox: [], msgs: {}, deleted: {}, log: [], ending: null,
      /* --- v6.2 엔진 확장 --- */
      net: { wifi: false, airplane: false },
      device: { dnd: true, preview: { blink: 'off', loopdm: 'off' }, locked: true },
      sched: [], notifs: initialNotifs(), logSeq: 0,
      prologueSeen: false,
    };
  }

  function normalize(st) {
    const base = baseState(st && st.seed);
    if (!st || typeof st !== 'object') return base;
    const out = Object.assign(base, st);
    out.flags = Object.assign({}, DEFAULT_FLAGS, st.flags || {});
    out.npc = Object.assign({}, DEFAULT_NPC, st.npc || {});
    out.sync = Object.assign({}, base.sync, st.sync || {});
    out.net = Object.assign({}, base.net, st.net || {});
    out.device = Object.assign({}, base.device, st.device || {});
    out.device.preview = Object.assign({}, base.device.preview, (st.device && st.device.preview) || {});
    ['seen', 'read', 'events', 'traces', 'msgs', 'deleted'].forEach((k) => {
      if (!out[k] || typeof out[k] !== 'object' || Array.isArray(out[k])) out[k] = {};
    });
    ['outbox', 'sched', 'log', 'notifs'].forEach((k) => {
      if (!Array.isArray(out[k])) out[k] = base[k];
    });
    if (!Number.isFinite(out.gameMs)) out.gameMs = START;
    out.logSeq = Number.isFinite(out.logSeq) ? out.logSeq : out.log.length;
    return out;
  }

  let G = baseState();
  LM.G = G;

  function replaceState(next) {
    const clean = normalize(next);
    Object.keys(G).forEach((k) => { delete G[k]; });
    Object.assign(G, clean);
    LM.G = G;
  }

  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
  }
  function storageRemove(key) {
    try { localStorage.removeItem(key); return true; } catch (e) { return false; }
  }

  function applyStateFromG() {
    LM.state.wifi = !!(G.net && G.net.wifi);
    LM.state.airplane = !!(G.net && G.net.airplane);
    LM.state.dnd = !!(G.device && G.device.dnd);
    LM.state.preview = Object.assign({}, (G.device && G.device.preview) || {});
    LM.state.locked = !!(G.device && G.device.locked);
  }

  /* ---------- 경로 API ---------- */
  function parts(path) {
    if (Array.isArray(path)) return path;
    return String(path).split('.');
  }
  function readPath(path) {
    let o = G;
    for (const p of parts(path)) { if (o == null) return undefined; o = o[p]; }
    return o;
  }
  LM.gget = readPath;
  LM.gset = function (path, value) {
    const ps = parts(path);
    let o = G;
    for (let i = 0; i < ps.length - 1; i++) {
      if (!o[ps[i]] || typeof o[ps[i]] !== 'object') o[ps[i]] = {};
      o = o[ps[i]];
    }
    o[ps[ps.length - 1]] = value;
    LM.emit('g', { path: String(path), value: value });
    autosaveSoon();
    return value;
  };

  LM.flag = function (name, value) {
    if (arguments.length < 2) return G.flags[name];
    return LM.gset('flags.' + name, value);
  };

  LM.seen = function (eid) {
    G.seen[eid] = G.gameMs;
    LM.emit('g', { path: 'seen.' + eid, value: G.gameMs });
    LM.emit('seen', { id: eid, at: G.gameMs });
    autosaveSoon();
    return G.gameMs;
  };
  LM.hasSeen = function (eid) { return !!(G.seen && Object.prototype.hasOwnProperty.call(G.seen, eid)); };

  LM.logEvent = function (type, data) {
    G.logSeq = (G.logSeq || 0) + 1;
    const entry = { seq: G.logSeq, at: G.gameMs, type: type, data: data == null ? null : data };
    G.log.push(entry);
    if (G.log.length > 500) G.log.splice(0, G.log.length - 500);
    LM.emit('log', entry);
    autosaveSoon();
    return entry;
  };

  /* ---------- 세이브 ---------- */
  let saveTimer = null;
  function autosaveSoon() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { saveTimer = null; LM.saveGame('auto'); }, 500);
  }
  LM._autosave = autosaveSoon;

  function summary() {
    const bits = [];
    bits.push(G.unlocked ? '락 해제' : '잠김');
    bits.push(LM.online && LM.online() ? 'T2' : 'T1');
    const dh = G.npc && G.npc.DH;
    if (dh != null) bits.push(dh === 'X' ? 'DH-X' : 'DH-' + dh);
    return bits.join(' · ');
  }

  LM.saveGame = function (slot) {
    slot = slot == null ? 'auto' : String(slot);
    const data = {
      kind: 'dk.save', v: 1, slot: slot,
      savedAt: Date.now(), gameMs: G.gameMs, summary: summary(),
      state: clone(G),
    };
    const ok = storageSet(SLOT_KEY(slot), JSON.stringify(data));
    LM.emit('save', { slot: slot, ok: ok, savedAt: data.savedAt });
    return ok;
  };

  LM.loadGame = function (slot) {
    slot = slot == null ? 'auto' : String(slot);
    const raw = storageGet(SLOT_KEY(slot));
    if (!raw) return false;
    try {
      const data = JSON.parse(raw);
      const st = data && data.state ? data.state : data;
      if (!st || typeof st !== 'object') return false;
      replaceState(st);
      applyStateFromG();
      LM.emit('state', {});
      LM.emit('gload', { slot: slot, savedAt: data.savedAt || null });
      if (LM._onlineCheck) LM._onlineCheck();
      return true;
    } catch (e) {
      return false;
    }
  };

  LM.listSaves = function () {
    return ['auto', '1', '2', '3'].map((slot) => {
      const raw = storageGet(SLOT_KEY(slot));
      if (!raw) return { slot: slot, exists: false };
      try {
        const d = JSON.parse(raw);
        return {
          slot: slot, exists: true, savedAt: d.savedAt || null,
          gameMs: d.gameMs || null, summary: d.summary || '',
        };
      } catch (e) {
        return { slot: slot, exists: false, corrupt: true };
      }
    });
  };

  LM.deleteSave = function (slot) {
    return storageRemove(SLOT_KEY(slot));
  };

  LM.newGame = function (seed) {
    replaceState(baseState(seed));
    applyStateFromG();
    LM.emit('state', {});
    LM.emit('newGame', { seed: G.seed });
    LM.saveGame('auto');
    return G;
  };

  /* ---------- LM.state -> G 미러 ---------- */
  const GAME_KEYS = { wifi: 'net.wifi', airplane: 'net.airplane', dnd: 'device.dnd', preview: 'device.preview', locked: 'device.locked' };
  LM.onStateSet = function (patch) {
    if (!patch) return;
    for (const k in GAME_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(patch, k)) continue;
      const path = GAME_KEYS[k];
      if (k === 'preview') LM.gset(path, Object.assign({}, patch[k] || {}));
      else LM.gset(path, !!patch[k]);
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'locked')) {
      G.unlocked = !patch.locked;
      autosaveSoon();
    }
    if (LM._onlineCheck) LM._onlineCheck();
  };

  /* ---------- 첫 온라인·온라인 전환 ---------- */
  let prevOnline = null;
  LM._onlineCheck = function () {
    const on = !!(LM.online && LM.online());
    const wasFirst = G.firstOnlineAt != null;
    if (on && G.unlocked && G.firstOnlineAt == null) {
      G.firstOnlineAt = G.gameMs;
      LM.logEvent('firstOnline', { at: G.gameMs });
      LM.emit('firstOnline', { at: G.gameMs });
      if (LM.sched && LM.sched._firstOnline) LM.sched._firstOnline();
      autosaveSoon();
    }
    if (prevOnline === false && on) LM.emit('online', { at: G.gameMs });
    if (prevOnline === true && !on) LM.emit('offline', { at: G.gameMs });
    prevOnline = on;
    if (on && LM.sched && LM.sched._flush) LM.sched._flush();
    return !wasFirst && G.firstOnlineAt != null;
  };

  LM.on('unlock', () => { if (LM._onlineCheck) LM._onlineCheck(); });

  /* ---------- 부팅: 자동 세이브가 있으면 이어서, ?new 면 새 게임 ---------- */
  (function bootState() {
    let q = null;
    try { q = new URLSearchParams(location.search); } catch (e) { q = null; }
    const forceNew = !!(q && q.has('new'));
    let loaded = false;
    if (!forceNew) {
      const raw = storageGet(AUTO_KEY);
      if (raw) {
        try {
          const data = JSON.parse(raw);
          const st = data && data.state ? data.state : data;
          if (st && typeof st === 'object') { replaceState(st); loaded = true; }
        } catch (e) { loaded = false; }
      }
    }
    if (!loaded) replaceState(baseState(seedFromQuery()));
    applyStateFromG();
    prevOnline = !!(LM.online && LM.online());
  })();

  window.DK = {
    G: () => LM.G,
    advance: (m) => (LM.advance ? LM.advance(m) : null),
    set: (path, value) => LM.gset(path, value),
    newGame: () => LM.newGame(),
    save: (slot) => LM.saveGame(slot),
    load: (slot) => LM.loadGame(slot),
  };

  window.addEventListener('pagehide', () => { LM.saveGame('auto'); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') LM.saveGame('auto');
  });
})();
