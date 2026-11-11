/* 대화 엔진 — 작성창 입력을 반응표에 맞춰 해석하고, 인물별 지연 뒤에 답장을 넣는다.
 * 처리 순서: 첨부 단서 → 추천 문장 → 사전 낱말(장소→사람→돈→정체→기타) → 기본 반응.
 * 설계: PROGRESSION_AND_ENDINGS 4·5·6.2절, TRACES_AND_REACTIONS 4절, BUSINESS_RULES BR-21 */
(function () {
  'use strict';
  const LM = window.LM;
  const hooks = Object.create(null);

  function C() { return (LM.C && LM.C.dialogue) || { rows: [], dictionary: {} }; }
  function G() { return LM.G; }
  function ensure() {
    const g = G();
    if (!g) return { revealed: false, seq: 0, used: {}, turns: {}, typing: {}, kt: [], cw: 0 };
    if (!g.dlg || typeof g.dlg !== 'object') g.dlg = {};
    const d = g.dlg;
    if (typeof d.revealed !== 'boolean') d.revealed = false;
    if (!Number.isFinite(d.seq)) d.seq = 0;
    ['used', 'turns', 'typing'].forEach((k) => { if (!d[k] || typeof d[k] !== 'object') d[k] = {}; });
    if (!Array.isArray(d.kt)) d.kt = [];
    if (!Array.isArray(d.pending)) d.pending = [];
    if (typeof d.cw !== 'boolean') d.cw = false;
    return d;
  }
  LM.dialogue = LM.dialogue || {};

  /* 표기 변형(띄어쓰기·하이픈·쉼표·마침표·대소문자)을 무시한 비교형. */
  function norm(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/[\s\-–—_.,·:'"“”‘’()\[\]]/g, '');
  }

  function npcState(npc) {
    const st = G() && G().npc ? G().npc[npc] : 0;
    return st == null ? 0 : st;
  }
  function stateNum(npc) {
    let st = npcState(npc);
    if (st === 'X') return 'X';
    st = Number(st) || 0;
    /* stage 2: 도현에게 처음 말을 거는 순간을 DH-2로 본다. DH-1(의심)은 stage 3의 사건이 만든다. */
    if (npc === 'DH' && st < 2) st = 2;
    return st;
  }

  function wordsIn(text) {
    const n = norm(text);
    const dict = C().dictionary || {};
    const out = [];
    ['place', 'person', 'money', 'identity', 'other'].forEach((cls) => {
      (dict[cls] || []).forEach((w) => {
        if (n && n.indexOf(norm(w)) >= 0) out.push({ cls: cls, word: w });
      });
    });
    return out;
  }
  function hasWord(text, list) {
    const n = norm(text);
    return (list || []).some((w) => n.indexOf(norm(w)) >= 0);
  }
  function hasIdentity(text) { return wordsIn(text).some((w) => w.cls === 'identity'); }

  function eidList(att) {
    if (!att) return [];
    if (Array.isArray(att.eids)) return att.eids.slice();
    if (Array.isArray(att)) return att.map((x) => x && x.eid).filter(Boolean);
    return att.eid ? [att.eid] : [];
  }

  function rowMatches(row, m) {
    if (!row || row.npc !== m.npc) return false;
    if (row.states && row.states.indexOf(m.state) < 0) return false;
    if (row.once && m.used[row.id]) return false;
    const mt = row.match || { type: 'any' };
    if (mt.type === 'eid') {
      return m.eids.some((e) => (mt.ids || []).indexOf(e) >= 0);
    }
    if (mt.type === 'suggestion') {
      return !!m.suggestion && norm(m.suggestion) === norm(mt.value);
    }
    if (mt.type === 'attachment') {
      return m.eids.length > 0 || !!m.hasAttachment;
    }
    if (mt.type === 'word') {
      if (mt.cls && m.words.some((w) => w.cls === mt.cls)) return true;
      if (mt.valueAny && hasWord(m.text, mt.valueAny)) return true;
      return false;
    }
    if (mt.type === 'combo') {
      if (mt.identity && !(m.identity || m.revealed)) return false;
      if (mt.hidden && (m.identity || m.revealed)) return false;
      if (mt.words && !hasWord(m.text, mt.words)) return false;
      if (mt.any && !(m.words.some((w) => mt.any.some((x) => norm(x) === norm(w.word))) || hasWord(m.text, mt.any))) return false;
      if (mt.orEid && !m.eids.some((e) => mt.orEid.indexOf(e) >= 0)) return false;
      return true;
    }
    if (mt.type === 'any') return true;
    return false;
  }

  function pickRow(m) {
    const rows = C().rows || [];
    /* 1. 첨부 단서 */
    if (m.eids.length) {
      const r = rows.find((row) => rowMatches(row, m) && row.match && row.match.type === 'eid');
      if (r) return r;
      /* 단서 ID가 반응표에 없어도 첨부 자체에 반응하는 행(예: 방이 아닌 사진)이 있으면 쓴다. */
      const a = rows.find((row) => rowMatches(row, m) && row.match && row.match.type === 'attachment');
      if (a) return a;
    }
    /* 2. 추천 문장 */
    if (m.suggestion) {
      const r = rows.find((row) => rowMatches(row, m) && row.match && row.match.type === 'suggestion');
      if (r) return r;
    }
    /* 3. 사전 낱말 — 장소 → 사람 → 돈 → 정체 → 기타 + combo */
    const order = ['place', 'person', 'money', 'identity', 'other'];
    for (const cls of order) {
      if (!m.words.some((w) => w.cls === cls)) continue;
      const r = rows.find((row) => rowMatches(row, m) && row.match && row.match.type === 'word' &&
        (row.match.cls === cls || (row.match.valueAny && hasWord(m.text, row.match.valueAny))));
      if (r) return r;
    }
    const combo = rows.find((row) => rowMatches(row, m) && row.match && row.match.type === 'combo');
    if (combo) return combo;
    /* 4. 기본 반응 */
    const any = rows.find((row) => rowMatches(row, m) && row.match && row.match.type === 'any');
    if (any) return any;
    return null;
  }

  function hoursNow() { return LM.now().getHours(); }
  function isJhAsleep() { const h = hoursNow(); return h >= 1 && h < 7; }
  function isMjSilent() {
    const d = LM.now();
    return d.getTime() >= new Date(2026, 2, 18, 3, 0).getTime();
  }
  function pickDelay(npc, row) {
    let range = (row && row.delay) || (C().delay || {})[npc] || [5, 10];
    let min = range[0], max = range[1] == null ? range[0] : range[1];
    let d = min + (Math.abs(Math.round((G().gameMs / 60000) * 7919 + min)) % Math.max(1, max - min + 1));
    if (npc === 'JH' && isJhAsleep()) d = Math.max(30, d);
    if (row && row.longTyping) d = Math.max(d, 6);
    return d;
  }

  function applySide(row, m) {
    if (!row) return;
    const g = G(), d = ensure();
    if (row.state != null) {
      g.npc[m.npc] = row.state === 'X' ? 'X' : Number(row.state);
      LM.emit('npc', { npc: m.npc, state: g.npc[m.npc] });
    }
    if (row.flags) {
      Object.keys(row.flags).forEach((k) => LM.flag(k, row.flags[k]));
    }
    if (row.alert) {
      g.npc.alert = (g.npc.alert || 0) + row.alert;
      LM.emit('npc', { npc: m.npc, alert: g.npc.alert });
    }
    if (row.sets) row.sets.forEach((e) => LM.seen(e));
    if (row.hook) {
      LM.emit('dialogue:hook', { hook: row.hook, npc: m.npc });
      (hooks[m.npc] || []).forEach((fn) => { try { fn({ hook: row.hook, npc: m.npc, row: row }); } catch (e) { console.error(e); } });
    }
    if (row.reveal) d.revealed = true;
    if (row.once) d.used[row.id] = true;
  }

  function linesFor(row, m) {
    if (!row) return ['…'];
    if (row.special === 'MJ2') {
      const d = ensure();
      const i = Math.min(2, Number(d.turns.MJ) || 0);
      const stmt = (C().mjStatements || [])[i] || { line: '…', sets: [] };
      d.turns.MJ = i + 1;
      (stmt.sets || []).forEach((e) => LM.seen(e));
      return [stmt.line];
    }
    return (row.reply || ['…']).slice();
  }

  function key(app, thread) { return String(app) + ':' + String(thread); }

  function deliver(npc, ctx, lines, row) {
    const d = ensure();
    const k = key(ctx.app, ctx.thread);
    delete d.typing[k];
    const eid = row && row.sets && row.sets.length ? row.sets[row.sets.length - 1] : null;
    lines.forEach((text) => {
      LM.msg.add(ctx.app, ctx.thread, {
        from: 'in', text: text, at: G().gameMs, eid: eid, npc: npc,
        title: ctx.title || ctx.name || null,
      });
    });
    LM.emit('dlg:typing', { app: ctx.app, thread: ctx.thread, npc: npc, on: false });
  }

  function armTyping(p) {
    const d = ensure();
    LM.sched.def('dlg-typing:' + p.seq, () => {
      if (!d.pending.some((x) => x.seq === p.seq)) return;
      d.typing[key(p.app, p.thread)] = true;
      LM.emit('dlg:typing', { app: p.app, thread: p.thread, npc: p.npc, on: true });
    });
    LM.sched.at('dlg-typing:' + p.seq, p.typingAt);
  }
  function fireReply(seq) {
    const d = ensure();
    const i = d.pending.findIndex((p) => p.seq === seq);
    if (i < 0) return;
    const p = d.pending.splice(i, 1)[0];
    deliver(p.npc, { app: p.app, thread: p.thread, name: p.name, title: p.title }, p.lines, { id: p.rowId });
  }

  function nextAt(hour, minute) {
    const now = LM.now();
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0).getTime();
    return t > now.getTime() ? t : t + 86400000;
  }

  function ktFlags(text, atts) {
    const n = norm(text);
    const eids = eidList(atts);
    if (n.indexOf(norm('강민석')) >= 0) LM.flag('NAME_SENT', true);
    else if (n.indexOf(norm('민석')) >= 0) ensure().ktPartialSeong = true;
    else if (n.indexOf(norm('강실장')) >= 0 || n.indexOf(norm('실장K')) >= 0) ensure().ktPartialName = true;
    if (eids.indexOf('E-37') >= 0 || (atts && atts.kind === 'recording')) { LM.flag('REC_SENT', true); LM.flag('REC', 'sent'); }
    if (eids.indexOf('E-33') >= 0) LM.flag('PLATE_SENT', true);
    if (hasWord(text, ['해담', '해담고시텔', '207', '성원구청로 31'])) LM.flag('LOC_SENT', true);
  }

  function ktBatch() {
      const d = ensure();
      delete d.typing['mail:inbox'];
      const lines = ['아버님, 아드님은 계좌 명의인 조사 대상입니다. 직접 출석하시는 게 가장 좋습니다.'];
      if (d.ktPartialSeong) lines.push('성까지 확인되면 도움이 됩니다.');
      if (d.ktPartialName) lines.push('이름까지 확인되면 도움이 됩니다.');
      if (LM.flag('REC_SENT')) lines.push('자료 확인했습니다. 수사에 큰 도움이 됩니다.');
      if (LM.flag('NAME_SENT')) lines.push('그 이름, 저희도 다른 건으로 보고 있었습니다.');
      if (LM.flag('PLATE_SENT')) lines.push('차량 조회하겠습니다.');
      if (LM.flag('LOC_SENT')) lines.push('아드님 안전부터 확인하겠습니다.');
      d.kt = [];
      LM.msg.add('mail', 'inbox', {
        from: 'in', title: '성원경찰서 수사과', fromAddr: 'taeyun.kim@sw.police.kr',
        subject: '회신', text: lines.join('\n'), at: G().gameMs, eid: 'E-94', npc: 'KT',
      });
      LM.emit('dlg:typing', { app: 'mail', thread: 'inbox', npc: 'KT', on: false });
  }

  function scheduleKt() {
    const g = G();
    if (!g) return;
    if (g.events && g.events['dlg:kt']) return;
    const at = nextAt(8, 10);
    const d = ensure();
    if (d.kt.length && !(g.sched || []).some((e) => e.id === 'dlg-typing:kt')) {
      LM.sched.after('dlg-typing:kt', Math.max(0, (at - g.gameMs) / 60000 - 1), () => {
        const dd = ensure(); dd.typing['mail:inbox'] = true;
        LM.emit('dlg:typing', { app: 'mail', thread: 'inbox', npc: 'KT', on: true });
      });
    }
    LM.sched.def('dlg:kt', ktBatch);
    LM.sched.at('dlg:kt', at);
  }

  function cwReply() {
      LM.msg.add('mail', 'inbox', {
        from: 'in', title: '청운고시원', fromAddr: 'cheongun@gosiwon.kr',
        subject: '회신', text: '입실 취소하신 분입니다. 개인정보라 더는 말씀드릴 수 없습니다.', at: G().gameMs, npc: 'CW',
      });
  }

  function scheduleCw() {
    const g = G();
    if (!g) return;
    if ((g.sched || []).some((e) => e.id === 'dlg:cw')) return;
    if (g.events && g.events['dlg:cw']) return;
    const at = nextAt(8, 30);
    ensure().cw = true;
    LM.sched.def('dlg:cw', cwReply);
    LM.sched.at('dlg:cw', at);
  }

  /* 보낸 것으로 기록한다. 앱은 먼저 LM.msg.add를 하고 이 함수를 부른다. */
  LM.dialogue.send = function (npc, ctx) {
    ctx = ctx || {};
    if (!npc) return null;
    const g = G();
    const d = ensure();
    const text = String(ctx.text == null ? '' : ctx.text);
    const atts = ctx.attachment || null;
    const eids = eidList(atts);
    /* 도현에게 답하는 순간 DH-2. 이미 확인(3)·열림(4)·단절(X)이면 건드리지 않는다. */
    if (npc === 'DH' && g.npc.DH !== 'X' && (Number(g.npc.DH) || 0) < 2) {
      g.npc.DH = 2;
      LM.emit('npc', { npc: 'DH', state: 2 });
    }
    const m = {
      npc: npc, text: text, eids: eids, hasAttachment: !!atts,
      suggestion: ctx.suggestionId || null,
      words: wordsIn(text), identity: hasIdentity(text), revealed: d.revealed,
      state: stateNum(npc), used: d.used || {},
    };
    if (m.identity) d.revealed = true;

    /* BR-21·6.2: 정체를 숨긴 채 실장·사칭에게 "어/응/집 근처"라고 답하면 생존·근거리를 확신한다. */
    if ((npc === 'KS' || npc === 'IMP') && !d.revealed) {
      const n = norm(text);
      if (['어', '응', '집근처', '집근처야', '집근처에있어', '집근처에'].indexOf(n) >= 0) {
        LM.flag('LEAK', true);
        LM.emit('npc', { npc: npc, leak: true });
      }
    }

    /* 김태윤 경위 — 새벽엔 답하지 않고 08:10에 받은 메일 전부에 한 번에 회신한다. */
    if (npc === 'KT') {
      ktFlags(text, atts);
      d.kt.push({ at: g.gameMs, text: text, eids: eids });
      scheduleKt();
      LM.logEvent('dialogue:kt', { at: g.gameMs });
      if (LM._autosave) LM._autosave();
      return { npc: npc, deferred: true };
    }
    if (npc === 'CW') {
      scheduleCw();
      return { npc: npc, deferred: true };
    }

    /* 할란이 소진된 민지, 03:00 이후의 민지 — 읽기만. */
    if (npc === 'MJ' && (Number(d.turns.MJ) >= 3 || isMjSilent())) return { npc: npc, silent: true };

    let row = pickRow(m);
    /* stage 3 확장 훅. 반환값이 reply를 가지면 그 답을 쓴다. */
    let override = null;
    (hooks[npc] || []).forEach((fn) => {
      try {
        const r = fn({ npc: npc, ctx: ctx, match: m, row: row });
        if (r && (r.reply || r.lines)) override = r;
      } catch (e) { console.error(e); }
    });
    if (override) row = Object.assign({}, row, { reply: override.reply || override.lines, state: override.state != null ? override.state : (row && row.state) });

    applySide(row, m);
    let lines = linesFor(row, m);
    if (override && (override.reply || override.lines)) lines = override.reply || override.lines;

    const delay = pickDelay(npc, row);
    const seq = ++d.seq;
    const replyAt = g.gameMs + delay * 60000;
    const pending = {
      seq: seq, npc: npc, app: ctx.app, thread: ctx.thread, name: ctx.name, title: ctx.title,
      lines: lines, rowId: row && row.id, at: replyAt, typingAt: replyAt - Math.max(1, Math.min(delay, 1)) * 60000,
    };
    if (delay > 1) pending.typingAt = replyAt - 60000; else pending.typingAt = null;
    d.pending.push(pending);
    if (pending.typingAt != null) armTyping(pending);
    LM.sched.def('dlg-reply:' + seq, () => fireReply(seq));
    LM.sched.at('dlg-reply:' + seq, replyAt);

    LM.logEvent('dialogue:send', { npc: npc, row: row && row.id, delay: delay });
    LM.emit('dialogue:sent', { npc: npc, row: row && row.id, delay: delay, eids: eids, text: text, app: ctx.app, thread: ctx.thread });
    if (LM._autosave) LM._autosave();
    return { npc: npc, row: row && row.id, delay: delay, reply: lines };
  };

  /* stage 3가 붙일 훅. */
  LM.dialogue.on = function (npc, fn) {
    if (typeof fn !== 'function') return () => {};
    (hooks[npc] = hooks[npc] || []).push(fn);
    return () => { hooks[npc] = (hooks[npc] || []).filter((f) => f !== fn); };
  };

  LM.dialogue.typing = function (app, thread) {
    const d = ensure();
    return !!d.typing[key(app, thread)];
  };
  LM.dialogue.revealed = function () { return !!ensure().revealed; };
  LM.dialogue.state = npcState;

  function rearm() {
    const d = ensure();
    (d.pending || []).forEach((p) => {
      if (G().events && G().events['dlg-reply:' + p.seq]) return;
      LM.sched.def('dlg-reply:' + p.seq, () => fireReply(p.seq));
      LM.sched.at('dlg-reply:' + p.seq, p.at);
      if (p.typingAt != null && !(G().events && G().events['dlg-typing:' + p.seq])) armTyping(p);
    });
    if (d.kt.length) scheduleKt();
    if (d.cw) scheduleCw();
  }
  LM.dialogue._rearm = rearm;
  LM.on('gload', rearm);
  LM.on('newGame', rearm);
  try { rearm(); } catch (e) { console.error(e); }
})();
