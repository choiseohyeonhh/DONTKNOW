/* 배경 생활 엔진: 루프 배경 계정·게시물, 톡 배경 방·문장, 불규칙 알림 스케줄.
 * 설계: SNS_SPECIFICATION 8.11, MESSAGING_SPECIFICATION 3.9, DATABASE_SCHEMA 3.11.
 * 세이브에는 G.ambient.seed·cursor만 남기고, 스케줄은 시드로 다시 펼친다. */
(function () {
  'use strict';
  const LM = window.LM;
  const A = (LM.C && LM.C.ambient) || {};
  const START = new Date(2026, 2, 17, 21, 10, 0).getTime();
  const END = new Date(2026, 2, 18, 9, 0, 0).getTime();
  const CUT = new Date(2026, 2, 15, 3, 58, 0).getTime();

  const accounts = A.loopAccounts || [];
  const people = A.people || [];
  const rooms = A.rooms || [];
  const postsStatic = A.loopPosts || [];
  const postsLive = A.loopPostsLive || [];
  const items = (A.pool && A.pool.items) || [];
  const schedule = A.schedule || {
    rates: { '21-24': [8, 12], '00-02': [3, 6], '02-06': [0, 2], '06-09': [5, 9] },
    minGapSec: 30, eventQuietSec: 120, burst: [1, 5],
  };

  const accByHandle = Object.create(null);
  const accById = Object.create(null);
  accounts.forEach((a) => { accByHandle[a.handle] = a; accById[a.id] = a; });
  const personById = Object.create(null);
  people.forEach((p) => { personById[p.id] = p; });
  const roomById = Object.create(null);
  rooms.forEach((r) => { roomById[r.id] = r; });

  function G() { return LM.G; }
  function nowMs() { return G() ? G().gameMs : START; }
  function online() { return !!(LM.online && LM.online()); }
  function ts(v) { const t = new Date(v).getTime(); return Number.isFinite(t) ? t : 0; }

  function ensure() {
    const g = G();
    if (!g) return null;
    if (!g.ambient || typeof g.ambient !== 'object' || Array.isArray(g.ambient)) g.ambient = {};
    const a = g.ambient;
    if (!Number.isFinite(a.cursor)) a.cursor = 0;
    if (!Number.isFinite(a.quietUntil)) a.quietUntil = 0;
    if (!Array.isArray(a.quiet)) a.quiet = [];
    if (!a.muted || typeof a.muted !== 'object' || Array.isArray(a.muted)) a.muted = {};
    if (!Number.isFinite(a.seed)) a.seed = g.seed;
    return a;
  }

  /* ---------- 시드 난수 ---------- */
  function hash32(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function prng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randInt(r, lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }

  function hourInWindow(h, w) {
    if (!Array.isArray(w) || w.length !== 2) return true;
    const [a, b] = w;
    if (a <= b) return h >= a && h < b;
    return h >= a || h < b;
  }

  /* ---------- 루프 데이터 ---------- */
  function account(handle) { return accByHandle[String(handle)] || null; }

  function postTime(p) {
    if (p.createdAt) return ts(p.createdAt);
    return 0;
  }

  function visiblePost(p, on) {
    const t = postTime(p);
    if (!Number.isFinite(t)) return false;
    if (!on && !(p.cache || t <= CUT)) return false;
    return true;
  }

  /* 오프라인: 3/15 03:58까지의 캐시만. 온라인: 그 뒤 동기화분과 게임 중 새 게시물 포함. */
  function posts(opts) {
    opts = opts || {};
    const on = opts.online != null ? !!opts.online : online();
    const limit = opts.limit == null ? Infinity : Number(opts.limit);
    const out = [];
    for (const p of postsStatic) {
      if (!visiblePost(p, on)) continue;
      if (!on && postTime(p) > CUT) continue;
      if (on && postTime(p) > nowMs() && !p.live) continue;
      out.push(p);
      if (out.length >= limit) break;
    }
    if (on) {
      for (const p of postsLive) {
        if (postTime(p) <= nowMs()) out.push(p);
        if (out.length >= limit) break;
      }
    }
    return out.sort((a, b) => postTime(b) - postTime(a) || String(a.id).localeCompare(String(b.id)));
  }

  function liveDue() {
    if (!online()) return [];
    const t = nowMs();
    return postsLive.filter((p) => postTime(p) <= t);
  }

  function peopleInRoom(room) {
    return (room.members || []).map((id) => personById[id]).filter(Boolean);
  }
  function senderFor(room, r) {
    if (room.type === '1:1') return room.name;
    const ps = peopleInRoom(room);
    if (!ps.length) return room.name;
    return pick(r, ps).name;
  }

  function roomMuted(room) {
    const a = ensure();
    if (a && a.muted && Object.prototype.hasOwnProperty.call(a.muted, room.id)) return !!a.muted[room.id];
    return !!room.muted;
  }

  /* ---------- 스케줄 생성 ---------- */
  const planCache = { seed: null, list: null };

  function bandOfHour(h) {
    if (h >= 21 || h < 0) return '21-24';
    if (h < 2) return '00-02';
    if (h < 6) return '02-06';
    return '06-09';
  }

  const CANON_WINDOWS = (() => {
    const abs = (LM.C && LM.C.events && LM.C.events.absolute) || {};
    const q = (schedule.eventQuietSec || 120) * 1000;
    return Object.keys(abs).map((id) => {
      const x = abs[id];
      const t = new Date(2026, 2, x.day, x.h, x.m, 0).getTime();
      return [t - q, t + q];
    });
  })();

  function avoidKnown(t) {
    for (let i = 0; i < 4; i++) {
      let hit = null;
      for (const w of CANON_WINDOWS) {
        if (t >= w[0] && t <= w[1]) { hit = w; break; }
      }
      if (!hit) break;
      t = hit[1] + 1000 + Math.round(1000 * ((t % 7) / 7));
    }
    return t;
  }

  function buildQueues(seed) {
    const q = Object.create(null);
    for (const it of items) {
      if (!it.room) continue;
      (q[it.room] = q[it.room] || []).push(it);
    }
    Object.keys(q).forEach((roomId) => {
      const arr = q[roomId];
      const r = prng((seed ^ hash32(roomId)) >>> 0);
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      }
    });
    return q;
  }

  function buildPlan(seed) {
    seed = Number.isFinite(Number(seed)) ? Number(seed) : 20260317;
    if (planCache.seed === seed && planCache.list) return planCache.list;
    const r = prng((seed ^ 0x9E3779B9) >>> 0);
    const queues = buildQueues(seed);
    const qidx = Object.create(null);
    const groupRooms = rooms.filter((x) => x.type === 'group' && queues[x.id]);
    const dmRooms = rooms.filter((x) => x.type === '1:1' && queues[x.id]);
    const usedText = new Set();

    function nextItem(roomId, hour) {
      const q = queues[roomId];
      if (!q) return null;
      const start = qidx[roomId] || 0;
      for (let k = 0; k < q.length; k++) {
        const i = (start + k) % q.length;
        const it = q[i];
        if (!hourInWindow(hour, it.window)) continue;
        if (usedText.has(it.text)) continue;
        qidx[roomId] = (i + 1) % q.length;
        usedText.add(it.text);
        return it;
      }
      return null;
    }

    function pickRoom(isGroup, hour) {
      const base = isGroup ? groupRooms : dmRooms;
      if (!base.length) return null;
      for (let n = 0; n < 8; n++) {
        const room = pick(r, base);
        const it = nextItem(room.id, hour);
        if (it) return { room: room.id, item: it };
      }
      const all = isGroup ? groupRooms : dmRooms;
      for (const room of all) {
        const it = nextItem(room.id, hour);
        if (it) return { room: room.id, item: it };
      }
      return null;
    }

    const events = [];
    let clusterId = 0;

    const hours = [];
    for (let h = 21; h < 24; h++) hours.push({ day: 17, h: h, key: '21-24' });
    for (let h = 0; h < 24; h++) {
      if (h >= 0 && h < 2) hours.push({ day: 18, h: h, key: '00-02' });
      else if (h >= 2 && h < 6) hours.push({ day: 18, h: h, key: '02-06' });
      else if (h >= 6 && h < 9) hours.push({ day: 18, h: h, key: '06-09' });
    }

    for (const hb of hours) {
      const rate = schedule.rates[hb.key] || [0, 0];
      const n = randInt(r, rate[0], rate[1]);
      if (n <= 0) continue;
      const hourStart = new Date(2026, 2, hb.day, hb.h, 0, 0).getTime();
      const hourEnd = hourStart + 3600000;
      const start = hb.day === 17 && hb.h === 21 ? START : hourStart;
      const span = hourEnd - start;
      const burstMax = schedule.burst ? schedule.burst[1] : 5;
      const clusters = [];
      let left = n;
      while (left > 0) {
        const c = Math.min(left, randInt(r, 1, Math.max(1, burstMax)));
        clusters.push(c);
        left -= c;
      }
      const gap = span / Math.max(1, clusters.length);
      let cursor = start + Math.min(gap * 0.25, 90000) * r();
      for (const c of clusters) {
        clusterId++;
        const isGroup = r() < 0.75;
        let chosen = pickRoom(isGroup, hb.h);
        if (!chosen) chosen = pickRoom(!isGroup, hb.h);
        if (!chosen) break;
        const room = roomById[chosen.room];
        const sender = room ? senderFor(room, r) : '';
        let at = cursor;
        let item = chosen.item;
        for (let j = 0; j < c; j++) {
          if (j > 0) {
            at = Math.min(hourEnd - 1000, at + 10000 + Math.floor(r() * 110000));
            item = nextItem(chosen.room, hb.h) || item;
          }
          events.push({
            at: avoidKnown(at), room: chosen.room, app: null, item: item,
            sender: sender, group: isGroup, cluster: clusterId,
          });
        }
        cursor = Math.max(cursor + gap * (0.55 + r() * 0.8), at + (schedule.minGapSec || 30) * 1000 + Math.floor(r() * 20000));
      }
    }

    /* 다른 앱의 배경 알림(MESSAGING 3.9.5). 앱별 분량을 지키고, 루프 새 게시물 4건을 더한다. */
    const appItems = items.filter((it) => it.app);
    const appTarget = {
      loop: 6, mail: 3, portal: 2, weather: 1, market: 2,
    };
    const appTimes = {
      loop: [22 * 60 + 5, 23 * 60 + 20, 25 * 60 + 20, 30 * 60 + 40, 31 * 60 + 20, 32 * 60 + 10, 33 * 60], // 21:?? 보정은 아래에서
      mail: [23 * 60 + 5, 30 * 60 + 5, 32 * 60 + 20],
      portal: [21 * 60 + 50, 32 * 60 + 5],
      weather: [30 * 60 + 45],
      market: [21 * 60 + 45, 31 * 60 + 30],
    };
    function dayMinToMs(mins) {
      const base = new Date(2026, 2, 17, 0, 0, 0).getTime();
      return base + mins * 60000;
    }
    Object.keys(appTarget).forEach((app) => {
      const pool = appItems.filter((it) => it.app === app);
      const times = appTimes[app] || [];
      for (let i = 0; i < Math.min(appTarget[app], pool.length); i++) {
        let at = dayMinToMs(times[i] != null ? times[i] : (21 * 60 + 60 + i * 40));
        if (at < START) at += 24 * 60 * 60000;
        if (at > END) at = END - (i + 1) * 60000;
        events.push({ at: avoidKnown(at), room: null, app: app, item: pool[i], sender: '', group: false, cluster: 0 });
      }
    });
    const liveNotify = [0, 5, 10, 15];
    liveNotify.forEach((idx, i) => {
      const p = postsLive[idx];
      if (!p) return;
      let at = postTime(p);
      if (at < START || at > END) return;
      events.push({
        at: avoidKnown(at), room: null, app: 'loop',
        item: { id: 'live-notify-' + p.id, text: '@' + p.author + '님이 새 게시물을 올렸습니다', app: 'loop' },
        sender: '', group: false, cluster: -1 - i,
      });
    });

    events.sort((a, b) => a.at - b.at || (a.cluster - b.cluster) || String(a.item && a.item.id).localeCompare(String(b.item && b.item.id)));
    /* 다른 군집 사이 최소 간격. 한 사람이 몰아 쓰는 군집 내부는 예외다. */
    let prevCluster = null, prevAt = 0;
    for (const ev of events) {
      if (ev.cluster > 0 && ev.cluster !== prevCluster) {
        const min = prevAt + (schedule.minGapSec || 30) * 1000;
        if (ev.at < min) ev.at = min;
      }
      prevCluster = ev.cluster;
      prevAt = ev.at;
    }
    events.forEach((ev, i) => { ev.at = Math.round(ev.at); ev.i = i; ev.id = 'amb:' + seed + ':' + i; });
    planCache.seed = seed;
    planCache.list = events;
    return events;
  }

  function appTitle(app) {
    const t = { loop: '루프', mail: '메일', portal: '한서 포털', weather: '날씨', market: '이웃마켓' };
    return t[app] || app;
  }
  function appName(app) {
    const t = { loop: '루프', mail: '메일', portal: '한서 포털', weather: '날씨', market: '이웃마켓' };
    return t[app] || app;
  }

  let emitting = false;
  function deliver(ev) {
    const g = G();
    if (!g) return;
    const at = ev.at;
    if (ev.room) {
      const room = roomById[ev.room];
      if (!room) return;
      emitting = true;
      try {
        LM.msg.add('talk', ev.room, {
          id: ev.id, from: 'in', sender: ev.sender, text: ev.item.text,
          at: at, silent: true, ambient: true,
        });
        LM.notify({
          id: ev.id, app: 'talk', title: room.name, body: ev.item.text, at: at,
          thread: ev.room, ambient: true, noBanner: roomMuted(room), muted: roomMuted(room),
        });
      } finally { emitting = false; }
    } else {
      const body = ev.item.text;
      LM.notify({
        id: ev.id, app: ev.app, title: appName(ev.app), body: body, at: at,
        ambient: true, noBanner: false,
      });
    }
  }

  function pump() {
    const g = G();
    if (!g) return 0;
    const a = ensure();
    if (!a) return 0;
    if (!online()) return 0;
    const plan = buildPlan(g.seed);
    let sent = 0, guard = 0;
    while (a.cursor < plan.length) {
      const ev = plan[a.cursor];
      if (ev.at > g.gameMs) break;
      a.cursor++;
      /* 시각은 플랜에 고정한다. 캐논 절대 시각 앞뒤 120초는 buildPlan의 avoidKnown이 미리 비켜 간다.
       * 실시간 타이머·틱이 끼어들어도 같은 시드·같은 행동이면 같은 시각·같은 문장이 재현된다. */
      deliver({ at: ev.at, room: ev.room, app: ev.app, item: ev.item, sender: ev.sender, id: ev.id });
      sent++;
      if (++guard > 5000) break;
    }
    if (sent) {
      if (LM._autosave) LM._autosave();
      LM.emit('ambient:delivered', { count: sent });
    }
    return sent;
  }

  /* ---------- 캐논 반응과의 120초 조용한 창 ---------- */
  function quiet(untilMs) {
    const a = ensure();
    if (!a) return;
    const q = Math.max(Number(untilMs) || 0, nowMs() + (schedule.eventQuietSec || 120) * 1000);
    a.quietUntil = Math.max(a.quietUntil || 0, q);
    const start = nowMs();
    if (!a.quiet.some((w) => w[0] === start && w[1] === q)) a.quiet.push([start, q]);
    if (a.quiet.length > 40) a.quiet.splice(0, a.quiet.length - 40);
  }

  LM.on('event', () => { if (!emitting) quiet(); });
  LM.on('notify', (n) => { if (!emitting && n && !n.ambient && n.app !== 'system') quiet(); });
  LM.on('msg', (m) => { if (!emitting && m && m.message && !m.message.ambient) quiet(); });
  ['tick', 'minute', 'advance', 'online', 'gload', 'newGame'].forEach((ev) => LM.on(ev, () => pump()));

  /* ---------- 배경 사진 일러스트(장면 스펙 → SVG) ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c])); }
  function shade(hex, amt) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return hex || '#888';
    let n = parseInt(m[1], 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = Math.max(0, Math.min(255, Math.round(r + amt)));
    g = Math.max(0, Math.min(255, Math.round(g + amt)));
    b = Math.max(0, Math.min(255, Math.round(b + amt)));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  function sceneBody(scene, pal) {
    const c = (i) => pal[i % pal.length] || ['#d8cfc0', '#a89680', '#4b433a'][i % 3];
    const a = c(0), b = c(1), d = c(2);
    const S = [];
    const P = (s) => S.push(s);
    switch (scene) {
      case 'food':
        P('<rect width="390" height="488" fill="' + shade(b, -18) + '"/>');
        P('<rect y="250" width="390" height="238" fill="' + a + '"/>');
        P('<ellipse cx="195" cy="300" rx="150" ry="40" fill="' + shade(d, 10) + '" opacity=".28"/>');
        P('<circle cx="195" cy="270" r="74" fill="' + shade(a, 18) + '"/><circle cx="195" cy="270" r="57" fill="' + shade(d, 24) + '" opacity=".55"/>');
        P('<circle cx="195" cy="264" r="34" fill="' + shade(b, -20) + '" opacity=".8"/>');
        P('<path d="M296 240l54-34M302 258l62-6" stroke="' + shade(d, 30) + '" stroke-width="7" stroke-linecap="round" opacity=".8"/>');
        P('<ellipse cx="82" cy="316" rx="42" ry="16" fill="' + shade(a, 30) + '" opacity=".8"/>');
        P('<ellipse cx="320" cy="330" rx="38" ry="14" fill="' + shade(a, 8) + '" opacity=".7"/>');
        break;
      case 'cafe':
        P('<rect width="390" height="488" fill="' + shade(b, -20) + '"/>');
        P('<rect x="34" y="40" width="322" height="220" rx="8" fill="' + shade(b, 26) + '" opacity=".55"/>');
        P('<path d="M34 40h322M34 260h322" stroke="' + shade(d, 20) + '" stroke-width="8" opacity=".5"/>');
        P('<rect y="300" width="390" height="188" fill="' + a + '"/>');
        P('<ellipse cx="196" cy="310" rx="160" ry="34" fill="' + shade(d, 12) + '" opacity=".22"/>');
        P('<ellipse cx="196" cy="274" rx="52" ry="16" fill="' + shade(a, 22) + '"/><path d="M148 274v-42h96v42" fill="' + shade(a, 10) + '"/>');
        P('<path d="M244 240h28a16 16 0 0 1 0 34h-28" fill="none" stroke="' + shade(a, 16) + '" stroke-width="9"/>');
        P('<path d="M176 220c8-20-8-28 0-48M206 220c8-20-8-28 0-48" stroke="' + shade(a, 30) + '" stroke-width="5" opacity=".45" fill="none"/>');
        break;
      case 'desk':
      case 'books':
        P('<rect width="390" height="488" fill="' + shade(b, -12) + '"/>');
        P('<rect y="300" width="390" height="188" fill="' + a + '"/>');
        P('<rect x="34" y="96" width="140" height="174" rx="6" fill="' + shade(b, 20) + '" opacity=".6"/>');
        P('<path d="M104 96v174M34 182h140" stroke="' + shade(d, 20) + '" stroke-width="6" opacity=".5"/>');
        P('<rect x="238" y="212" width="116" height="12" rx="3" fill="' + shade(d, 28) + '"/>');
        P('<rect x="244" y="194" width="104" height="18" rx="3" fill="' + shade(a, 38) + '"/>');
        P('<rect x="252" y="174" width="88" height="20" rx="3" fill="' + shade(a, 10) + '"/>');
        P('<rect x="250" y="326" width="96" height="92" rx="4" fill="' + shade(d, 20) + '" opacity=".55"/>');
        P('<path d="M250 374h96" stroke="' + shade(a, 40) + '" stroke-width="4" opacity=".45"/>');
        P('<circle cx="122" cy="338" r="22" fill="' + shade(d, 10) + '"/><path d="M122 316v-40" stroke="' + shade(d, 10) + '" stroke-width="6"/>');
        break;
      case 'campus':
        P('<rect width="390" height="488" fill="' + shade(a, 28) + '"/>');
        P('<rect y="258" width="390" height="230" fill="' + shade(b, 12) + '"/>');
        P('<rect x="32" y="132" width="152" height="160" fill="' + shade(b, -26) + '"/><rect x="48" y="152" width="120" height="120" fill="' + shade(a, 24) + '" opacity=".35"/>');
        P('<rect x="212" y="104" width="146" height="188" fill="' + shade(b, -32) + '"/><rect x="228" y="126" width="114" height="146" fill="' + shade(a, 18) + '" opacity=".3"/>');
        P('<path d="M0 360c70-40 140-40 210 0s130 40 180 0" stroke="' + shade(a, 40) + '" stroke-width="16" fill="none" opacity=".55"/>');
        P('<rect x="72" y="250" width="22" height="94" fill="' + shade(d, 12) + '"/><circle cx="83" cy="220" r="48" fill="' + shade(d, 24) + '" opacity=".85"/>');
        P('<rect x="300" y="256" width="18" height="88" fill="' + shade(d, 6) + '"/><circle cx="309" cy="232" r="40" fill="' + shade(d, 18) + '" opacity=".8"/>');
        P('<path d="M180 488c6-80 14-130 40-186" stroke="' + shade(a, 36) + '" stroke-width="26" fill="none" opacity=".5"/>');
        break;
      case 'sky':
        P('<defs><linearGradient id="asky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + shade(a, 26) + '"/><stop offset="1" stop-color="' + shade(b, -10) + '"/></linearGradient></defs>');
        P('<rect width="390" height="488" fill="url(#asky)"/>');
        P('<circle cx="296" cy="116" r="44" fill="' + shade(a, 52) + '" opacity=".55"/>');
        P('<path d="M40 330c50-34 118-34 168 0s90 32 142 4" stroke="' + shade(a, 40) + '" stroke-width="24" fill="none" opacity=".25" stroke-linecap="round"/>');
        P('<path d="M-20 392c80-42 150-42 230 0s130 38 200 0" stroke="' + shade(b, 20) + '" stroke-width="42" fill="none" opacity=".35" stroke-linecap="round"/>');
        P('<rect y="430" width="390" height="58" fill="' + shade(d, 8) + '" opacity=".65"/>');
        break;
      case 'night':
      case 'street':
      case 'bus':
        P('<rect width="390" height="488" fill="' + shade(d, -26) + '"/>');
        P('<rect x="18" y="150" width="112" height="240" fill="' + shade(d, -8) + '"/><rect x="150" y="104" width="98" height="286" fill="' + shade(d, -4) + '"/><rect x="268" y="176" width="104" height="214" fill="' + shade(d, -10) + '"/>');
        for (let y = 170; y < 380; y += 34) {
          for (let x = 28; x < 360; x += 46) {
            if ((x + y) % 3 === 0) P('<rect x="' + x + '" y="' + y + '" width="13" height="9" fill="' + shade(a, 40) + '" opacity=".55"/>');
          }
        }
        if (scene === 'bus') {
          P('<rect x="0" y="80" width="390" height="300" fill="' + shade(b, -30) + '" opacity=".5"/>');
          P('<rect x="0" y="80" width="390" height="10" fill="' + shade(a, 20) + '" opacity=".6"/>');
          P('<rect x="0" y="360" width="390" height="128" fill="' + shade(d, 8) + '"/>');
          P('<path d="M0 420h390" stroke="' + shade(a, 10) + '" stroke-width="3" opacity=".5"/>');
        } else {
          P('<path d="M195 488L30 390h330z" fill="' + shade(d, 6) + '"/>');
          P('<path d="M195 488L120 390M195 488l75-102" stroke="' + shade(a, 16) + '" stroke-width="8" opacity=".55"/>');
        }
        P('<circle cx="292" cy="330" r="8" fill="' + shade(a, 54) + '"/><circle cx="314" cy="330" r="8" fill="' + shade(a, 54) + '"/>');
        break;
      case 'run':
      case 'court':
      case 'sports':
      case 'gym':
        P('<rect width="390" height="488" fill="' + shade(a, 10) + '"/>');
        P('<rect y="120" width="390" height="250" fill="' + shade(b, 18) + '"/>');
        P('<path d="M0 370h390" stroke="' + shade(a, 54) + '" stroke-width="5" opacity=".75"/>');
        P('<circle cx="195" cy="252" r="66" fill="none" stroke="' + shade(a, 52) + '" stroke-width="4" opacity=".65"/>');
        P('<path d="M195 120v250" stroke="' + shade(a, 52) + '" stroke-width="4" opacity=".65"/>');
        P('<rect y="370" width="390" height="118" fill="' + shade(d, -4) + '"/>');
        if (scene === 'gym') {
          P('<rect x="34" y="270" width="18" height="150" fill="' + shade(d, 26) + '"/><rect x="338" y="270" width="18" height="150" fill="' + shade(d, 26) + '"/>');
          P('<rect x="52" y="286" width="286" height="12" fill="' + shade(d, 40) + '"/>');
        } else {
          P('<circle cx="240" cy="392" r="28" fill="' + shade(a, 54) + '"/><path d="M240 364v-5M240 425v5M212 392h-5M273 392h5" stroke="' + shade(d, 26) + '" stroke-width="4"/>');
        }
        break;
      case 'film':
      case 'camera':
      case 'stage':
      case 'music':
        P('<rect width="390" height="488" fill="' + shade(d, -22) + '"/>');
        P('<path d="M-40 488L160 60h70L430 488z" fill="' + shade(d, 4) + '" opacity=".6"/>');
        P('<ellipse cx="195" cy="300" rx="120" ry="150" fill="' + shade(a, 36) + '" opacity=".32"/>');
        if (scene === 'stage' || scene === 'music') {
          P('<path d="M64 0l54 320M326 0l-54 320" stroke="' + shade(a, 48) + '" stroke-width="18" opacity=".35"/>');
          P('<rect x="86" y="330" width="218" height="18" rx="4" fill="' + shade(b, 10) + '"/>');
          P('<rect x="104" y="348" width="16" height="110" fill="' + shade(b, 0) + '"/><rect x="270" y="348" width="16" height="110" fill="' + shade(b, 0) + '"/>');
        } else {
          P('<rect x="96" y="212" width="198" height="126" rx="16" fill="' + shade(b, -6) + '" stroke="' + shade(a, 24) + '" stroke-width="5"/>');
          P('<circle cx="195" cy="274" r="42" fill="' + shade(d, 18) + '" stroke="' + shade(a, 40) + '" stroke-width="8"/>');
          P('<rect x="142" y="188" width="76" height="26" rx="6" fill="' + shade(b, 20) + '"/>');
          P('<rect x="226" y="196" width="52" height="16" rx="4" fill="' + shade(a, 30) + '"/>');
        }
        break;
      case 'friends':
        P('<rect width="390" height="488" fill="' + shade(b, -10) + '"/>');
        P('<rect y="250" width="390" height="238" fill="' + shade(a, 4) + '"/>');
        P('<ellipse cx="195" cy="320" rx="190" ry="46" fill="' + shade(d, 20) + '" opacity=".28"/>');
        [[96, 214, 38], [168, 196, 42], [246, 202, 40], [312, 220, 34]].forEach(([x, y, r], i) => {
          P('<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + shade(d, 4 + i * 4) + '"/>');
          P('<path d="M' + (x - r * 1.25) + ' 380c0-' + (r * 2.2) + ' ' + (r * 1.1) + '-' + (r * 2.9) + ' ' + (r * 1.25) + '-' + (r * 2.9) + 's' + (r * 1.25) + ' ' + (r * 0.7) + ' ' + (r * 1.25) + ' ' + (r * 2.9) + 'z" fill="' + shade(d, 2 + i * 3) + '"/>');
        });
        P('<rect x="32" y="374" width="326" height="16" rx="8" fill="' + shade(a, 28) + '" opacity=".55"/>');
        break;
      case 'flowers':
        P('<rect width="390" height="488" fill="' + shade(b, 8) + '"/>');
        P('<rect y="330" width="390" height="158" fill="' + shade(d, 6) + '" opacity=".55"/>');
        for (let i = 0; i < 7; i++) {
          const x = 62 + i * 44;
          P('<path d="M' + x + ' 430c-6-70 6-120 18-176" stroke="' + shade(d, 32) + '" stroke-width="5" fill="none"/>');
          P('<circle cx="' + (x + 18) + '" cy="' + (246 + (i % 3) * 18) + '" r="17" fill="' + shade(a, 22 + i * 4) + '"/>');
          P('<circle cx="' + (x + 18) + '" cy="' + (246 + (i % 3) * 18) + '" r="7" fill="' + shade(a, 52) + '" opacity=".7"/>');
        }
        break;
      case 'store':
      case 'market':
        P('<rect width="390" height="488" fill="' + shade(b, -6) + '"/>');
        P('<path d="M0 110h390v44H0z" fill="' + shade(a, 30) + '"/><path d="M0 110l32 44h32l-32-44zM64 110l32 44h32l-32-44zM128 110l32 44h32l-32-44zM192 110l32 44h32l-32-44zM256 110l32 44h32l-32-44zM320 110l32 44h38l-32-44z" fill="' + shade(a, 48) + '"/>');
        P('<rect x="22" y="154" width="346" height="230" fill="' + shade(d, 2) + '"/>');
        P('<rect x="42" y="178" width="306" height="14" fill="' + shade(a, 18) + '" opacity=".7"/><rect x="42" y="250" width="306" height="14" fill="' + shade(a, 18) + '" opacity=".7"/><rect x="42" y="322" width="306" height="14" fill="' + shade(a, 18) + '" opacity=".7"/>');
        for (let x = 56; x < 340; x += 46) {
          P('<rect x="' + x + '" y="200" width="26" height="42" rx="4" fill="' + shade(b, 30 + (x % 20)) + '" opacity=".8"/>');
          P('<rect x="' + x + '" y="274" width="26" height="40" rx="4" fill="' + shade(b, 12 + (x % 24)) + '" opacity=".8"/>');
        }
        P('<rect y="384" width="390" height="104" fill="' + shade(d, 10) + '"/>');
        break;
      case 'poster':
      case 'notice':
        P('<rect width="390" height="488" fill="' + shade(b, -14) + '"/>');
        P('<rect x="64" y="70" width="262" height="344" rx="4" fill="' + shade(a, 38) + '"/>');
        P('<rect x="82" y="94" width="226" height="10" fill="' + shade(d, 20) + '" opacity=".35"/><rect x="82" y="118" width="170" height="8" fill="' + shade(d, 20) + '" opacity=".25"/>');
        P('<rect x="82" y="160" width="226" height="150" fill="' + shade(b, 22) + '" opacity=".55"/>');
        P('<rect x="82" y="332" width="226" height="8" fill="' + shade(d, 20) + '" opacity=".25"/><rect x="82" y="352" width="150" height="8" fill="' + shade(d, 20) + '" opacity=".2"/>');
        P('<circle cx="300" cy="110" r="12" fill="' + shade(a, 54) + '"/>');
        break;
      case 'interior':
        P('<rect width="390" height="488" fill="' + shade(b, -8) + '"/>');
        P('<rect x="34" y="70" width="220" height="210" rx="4" fill="' + shade(a, 30) + '" opacity=".5"/>');
        P('<path d="M34 70h220v210H34z" fill="none" stroke="' + shade(d, 24) + '" stroke-width="8"/>');
        P('<rect y="320" width="390" height="168" fill="' + shade(a, 4) + '"/>');
        P('<rect x="42" y="300" width="240" height="86" rx="18" fill="' + shade(d, 18) + '"/>');
        P('<rect x="66" y="268" width="64" height="44" rx="12" fill="' + shade(d, 26) + '"/><rect x="198" y="268" width="64" height="44" rx="12" fill="' + shade(d, 26) + '"/>');
        P('<path d="M310 320v-54" stroke="' + shade(d, 20) + '" stroke-width="8"/><path d="M286 266h48l-10-34h-28z" fill="' + shade(a, 42) + '" opacity=".65"/>');
        break;
      default:
        P('<rect width="390" height="488" fill="' + shade(b, -6) + '"/>');
        P('<ellipse cx="195" cy="240" rx="170" ry="120" fill="' + shade(a, 30) + '" opacity=".5"/>');
        P('<rect y="330" width="390" height="158" fill="' + shade(d, 8) + '" opacity=".55"/>');
    }
    return S.join('');
  }

  function illustration(media, opts) {
    const pal = (media && Array.isArray(media.palette) && media.palette.length >= 2)
      ? media.palette : ['#d8cfc0', '#a89680', '#4b433a'];
    const scene = (media && media.scene) || 'sky';
    const label = (opts && opts.alt) || (media && media.alt) || scene;
    const svg = '<svg viewBox="0 0 390 488" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      sceneBody(scene, pal) +
      '<rect width="390" height="488" fill="#000" opacity=".06"/></svg>';
    return LM.h('div', { class: 'amb-media' + (opts && opts.square ? ' square' : ''), role: 'img', 'aria-label': label },
      LM.h('div', { class: 'amb-media-in', html: svg }));
  }

  /* ---------- 방 목록(talk 앱이 그대로 쓴다) ---------- */
  function ambientRooms() {
    return rooms.map((r) => ({
      id: r.id, name: r.name, type: r.type, circle: r.circle,
      count: r.count || r.memberCount, members: r.members.slice(),
      history: r.history || [], muted: roomMuted(r), ambient: true,
    }));
  }

  function contactRows() {
    return people.map((p) => ({ id: p.id, person: p }));
  }

  LM.ambient = {
    start: START,
    end: END,
    cacheCut: CUT,
    accounts: accounts,
    people: people,
    rooms: rooms,
    account: account,
    accountById: (id) => accById[id] || null,
    posts: posts,
    liveDue: liveDue,
    postTime: postTime,
    illustration: illustration,
    ambientRooms: ambientRooms,
    contacts: contactRows,
    muted: roomMuted,
    pump: pump,
    quiet: quiet,
    plan: () => buildPlan(G() ? G().seed : 20260317),
    cursor: () => (ensure() ? ensure().cursor : 0),
    _buildPlan: buildPlan,
    _deliver: deliver,
  };

  if (LM.G) ensure();
})();
