/* 사건(EV)·도현 상태(DH)·경계(alert)·원격 지우기·F-MOVED·시각 사건.
 * 설계: PROGRESSION_AND_ENDINGS 3·4·6절, BUSINESS_RULES 4.1·5·8절,
 *       MAIL_AND_CLOUD_SPECIFICATION 5절, TRACES_AND_REACTIONS 2·3절.
 * 원칙: 흔적 경고 UI를 띄우지 않는다. 세계의 반응(메시지·삭제·사건)으로만 알린다. */
(function () {
  'use strict';
  const LM = window.LM;
  const h = LM.h;

  function G() { return LM.G; }
  function online() { return !!(LM.online && LM.online()); }
  function C() { return (LM.C && LM.C.events) || { texts: {}, delay: {} }; }
  function T(key) { return (C().texts || {})[key] || ''; }
  function ensure() {
    const g = G();
    if (!g) return null;
    if (!g.world || typeof g.world !== 'object') g.world = {};
    if (!g.events || typeof g.events !== 'object') g.events = {};
    if (!g.traces || typeof g.traces !== 'object') g.traces = {};
    if (!g.npc || typeof g.npc !== 'object') g.npc = { DH: 0, alert: 0 };
    return g;
  }
  function saveSoon() { if (LM._autosave) LM._autosave(); }
  function atTime(o) { return new Date(2026, 2, o.day, o.h, o.m, 0, 0).getTime(); }
  function delayFor(npc) {
    const r = (C().delay || {})[npc] || [3, 8];
    const min = r[0], max = r[1] == null ? r[0] : r[1];
    const seed = Math.abs(Math.round((G().gameMs / 60000) * 7919 + min));
    return min + (seed % Math.max(1, max - min + 1));
  }
  function dhNum() { const v = G().npc.DH; return v === 'X' ? 'X' : (Number(v) || 0); }

  /* ---------- 메시지 도우미 ---------- */
  const THREAD = {
    DH: { app: 'msg', thread: 'cirrus', title: '도현의 슬레이트', name: '도현의 슬레이트' },
    JH: { app: 'talk', thread: 'jihoon', title: '지훈', name: '지훈' },
    SA: { app: 'talk', thread: 'seoa', title: '서아', name: '서아' },
    HR: { app: 'loop', thread: 'harin', title: '박하린', name: '박하린' },
    MJ: { app: 'loop', thread: 'minji', title: '윤민지', name: '윤민지' },
    IMP: { app: 'loop', thread: 'imp', title: '@jh_lee_99', name: '@jh_lee_99' },
    KS: { app: 'blink', thread: 'main', title: '실장K', name: '실장K' },
  };
  function npcMsg(npc, text, opts) {
    const t = THREAD[npc];
    if (!t || !text) return null;
    opts = opts || {};
    return LM.msg.add(t.app, t.thread, {
      from: 'in', text: text, at: G().gameMs, npc: npc,
      title: t.title, eid: opts.eid || null,
      notif: { title: opts.title || t.title, body: opts.body || text, hidden: !!opts.hidden },
    });
  }
  function later(id, minutes, fn) {
    LM.sched.def(id, fn);
    LM.sched.after(id, Math.max(0, minutes), fn);
  }

  /* ---------- 도현 상태·경계 ---------- */
  function setDH(state) {
    const g = ensure();
    if (!g) return;
    if (g.npc.DH === 'X') return;
    const next = state === 'X' ? 'X' : Number(state);
    if (g.npc.DH === next) return;
    g.npc.DH = next;
    LM.emit('npc', { npc: 'DH', state: next });
    LM.logEvent('dh:state', { state: next });
    saveSoon();
  }

  function cancelEv(id, mark) {
    ensure();
    LM.sched.cancel(id);
    if (mark !== false) G().events[id] = G().gameMs;
  }

  function alert(delta, opts) {
    const g = ensure();
    if (!g) return;
    const st = g.npc.DH;
    if (st === 'X') return;
    const n = Number(st) || 0;
    if (n < 1 || n > 2) return;
    if (opts && opts.onlyState != null && n !== opts.onlyState) return;
    g.npc.alert = Math.max(0, (Number(g.npc.alert) || 0) + delta);
    LM.emit('npc', { npc: 'DH', alert: g.npc.alert, delta: delta });
    LM.logEvent('dh:alert', { delta: delta, alert: g.npc.alert });
    if (g.npc.alert >= 3 && (n === 1 || n === 2)) {
      dhX('alert', { keepWipe: true });
      armWipe(0, true);
    }
    saveSoon();
  }

  function dhX(reason, opts) {
    const g = ensure();
    if (!g) return;
    opts = opts || {};
    cancelEv('EV-19');
    if (!opts.keepWipe) {
      cancelEv('EV-08');
      cancelEv('EV-08b');
    }
    if (g.npc.DH === 'X') return;
    g.npc.DH = 'X';
    g.world.dhX = { reason: reason, at: g.gameMs };
    LM.emit('npc', { npc: 'DH', state: 'X', reason: reason });
    LM.logEvent('dh:x', { reason: reason });
    saveSoon();
  }

  /* ---------- 원격 지우기(EV-08) ---------- */
  function showWipe() {
    const dev = document.querySelector('.device');
    if (!dev || dev.querySelector('.wipe-setup')) return;
    const el = h('div', { class: 'wipe-setup', role: 'dialog', 'aria-modal': 'true', 'aria-label': '초기 설정' },
      h('div', { class: 'wipe-lang' },
        h('div', { class: 'wipe-hello' }, '안녕하세요'),
        h('div', { class: 'wipe-sub' }, 'LUMA'),
        h('div', { class: 'wipe-pick' }, h('span', null, '한국어'), h('span', { class: 'wipe-chev' }, '›')),
        h('div', { class: 'wipe-note' }, '지우는 중… 이 기기의 데이터가 삭제되었습니다.')),
      h('div', { class: 'wipe-foot' }, h('span', null, '계속')));
    dev.appendChild(el);
  }

  function wipeNow(reason) {
    const g = ensure();
    if (!g || g.flags.WIPED) return;
    g.flags.WIPED = true;
    g.world.wipe = { reason: reason, at: g.gameMs };
    if (g.flags.REC === 'device') g.flags.REC = 'lost';
    LM.logEvent('wipe', { reason: reason });
    LM.emit('wipe', { reason: reason });
    showWipe();
    saveSoon();
    later('EV-08:judge', 1, () => judge('wiped'));
  }

  function ev08() {
    const g = ensure();
    if (!g) return;
    if (g.flags.WIPED) return;
    if (!g.world.forceWipe) {
      const n = dhNum();
      if (n === 'X' || n >= 2) return;
    }
    g.world.forceWipe = false;
    wipeNow('EV-08');
  }
  function armWipe(minutes, force) {
    const g = ensure();
    if (!g) return;
    if (force) {
      g.world.forceWipe = true;
      cancelEv('EV-08');
      const id = 'EV-08b';
      LM.sched.def(id, ev08);
      LM.sched.after(id, 0, ev08, { needsOnline: true });
    } else {
      LM.sched.def('EV-08', ev08);
      LM.sched.after('EV-08', minutes, ev08, { needsOnline: true });
    }
  }

  function judge(kind) {
    const g = ensure();
    if (!g) return;
    g.judgements = Array.isArray(g.judgements) ? g.judgements : [];
    g.judgements.push({ kind: kind, at: g.gameMs });
    if (!g.ending) g.ending = { kind: kind, at: g.gameMs };
    LM.logEvent('judge', { kind: kind });
    let handled = false;
    if (LM.endings && typeof LM.endings.judge === 'function') {
      try { LM.endings.judge(kind); handled = true; } catch (e) { console.error(e); }
    }
    LM.emit('judge', { kind: kind, at: g.gameMs, handled: handled });
    saveSoon();
  }

  /* ---------- F-MOVED ---------- */
  function triggerMoved(reason) {
    const g = ensure();
    if (!g || g.flags.MOVED) return false;
    g.flags.MOVED = true;
    g.world.movedTrigger = { reason: reason, at: g.gameMs };
    LM.logEvent('moved:trigger', { reason: reason });
    LM.emit('flags', { name: 'MOVED', value: true });
    const id = 'dh:move';
    LM.sched.def(id, () => {
      g.world.dhPlace = '성원스파';
      g.world.dhMovedAt = g.gameMs;
      LM.logEvent('moved:done', { at: g.gameMs });
      LM.emit('moved', { place: '성원스파', at: g.gameMs });
      LM.notify({ app: 'find', title: '찾기', body: '도현의 슬레이트 · 마지막 활동 방금 전', silent: false });
      saveSoon();
    });
    LM.sched.after(id, 60);
    saveSoon();
    return true;
  }

  /* ---------- EV-02 / EV-03 ---------- */
  function ev02() {
    (C().syncBurst || []).forEach((n, i) => {
      LM.notify({
        id: 'EV-02:' + i, app: n.app, title: n.title, body: n.body,
        t: n.t, hidden: !!n.hidden,
      });
    });
  }

  function ev03() {
    const g = ensure();
    if (!g) return;
    if (LM.trace) LM.trace('TR-01', { at: g.gameMs });
    setDH(1);
    const m = C().securityMail;
    if (m) {
      LM.msg.add('mail', 'inbox', {
        id: 'cirrus:ev03', from: 'in', title: m.from, fromAddr: m.fromAddr,
        subject: m.subject, text: m.text, at: g.gameMs, eid: 'E-16', silent: true,
      });
    }
    LM.logEvent('EV-03', { at: g.gameMs });
  }

  /* ---------- 상대 시각 사건 ---------- */
  const abs = {};
  abs['EV-40'] = function () {
    const g = ensure(); g.world.storyJihoon = true;
    LM.notify({ app: 'loop', title: '루프', body: 'jihoon_j님이 스토리를 올렸습니다' });
  };
  abs['EV-41'] = function () {
    LM.notify({ app: 'talk', title: '경영 26 새내기', body: '도현이 휴학한대?' });
  };
  abs['EV-42'] = function () {
    const g = ensure(); g.world.storyKang = true;
    LM.notify({ app: 'loop', title: '루프', body: '새 스토리가 있습니다' });
  };
  abs['EV-43'] = function () {
    const g = ensure(); g.world.slateWave = true;
    LM.emit('world', { id: 'EV-43' });
  };
  abs['EV-44'] = function () {
    const g = ensure(); g.world.storySeoa = true;
    LM.notify({ app: 'loop', title: '루프', body: 'seoa.film님이 스토리를 올렸습니다' });
  };
  abs['EV-45'] = function () {
    const g = ensure();
    if (g.flags.REC !== 'device') return;
    LM.notify({ app: 'set', title: '시러스', body: T('ev45') });
  };
  abs['EV-46'] = function () {
    const g = ensure();
    if (!(Number(g.npc.JH) > 0)) return;
    npcMsg('JH', T('ev46'));
  };
  abs['EV-26'] = function () {
    const g = ensure();
    if (!online()) return;
    g.world.liveOrder = true;
    const place = g.world.dhPlace || '해담고시텔 207호';
    LM.notify({ app: 'hankki', title: '한끼', body: '주문 접수 · ' + place, thread: null });
    LM.logEvent('EV-26', { place: place });
  };
  abs['EV-48'] = function () {
    const g = ensure(); g.world.remDepart = true;
    LM.notify({ app: 'rem', title: '미리 알림', body: T('ev48') });
  };
  abs['EV-21'] = function () {
    const g = ensure();
    if (g.flags.MAIL !== 'deleted') g.flags.MAIL = 'sent';
    LM.logEvent('EV-21', { mail: g.flags.MAIL });
    judge('deadline');
  };

  function scheduleAbsolute() {
    const list = C().absolute || {};
    Object.keys(list).forEach((id) => {
      const fn = abs[id];
      if (!fn) return;
      LM.sched.def(id, fn);
      LM.sched.at(id, atTime(list[id]), fn, id === 'EV-26' ? { needsOnline: true } : undefined);
    });
  }

  /* ---------- 위기: EV-06 → EV-19 / EV-08 ---------- */
  function ev06() {
    const g = ensure();
    if (!g) return;
    npcMsg('DH', T('ev06'), { eid: 'E-90' });
    g.world.ev06At = g.gameMs;
    if (Number(g.npc.DH) === 1) {
      LM.sched.def('EV-19', ev19);
      LM.sched.after('EV-19', 15, ev19, { needsOnline: true });
      armWipe(30);
    }
  }
  function ev19() {
    const g = ensure();
    if (!g || g.flags.WIPED) return;
    if (Number(g.npc.DH) !== 1) return;
    npcMsg('DH', T('ev19'), { eid: 'E-90' });
    LM.logEvent('EV-19', { at: g.gameMs });
  }
  function shortcutEv19() {
    const g = ensure();
    if (!g || !g.world.ev06At) return;
    if (g.events['EV-19']) return;
    const target = g.world.ev06At + 5 * 60000;
    if (!G().sched.some((e) => e.id === 'EV-19')) return;
    LM.sched.cancel('EV-19');
    LM.sched.def('EV-19', ev19);
    LM.sched.after('EV-19', Math.max(0, (target - g.gameMs) / 60000), ev19, { needsOnline: true });
    LM.logEvent('EV-30:shortcut', { at: g.gameMs });
  }

  /* ---------- EV-30: 아빠 톡 열람 ---------- */
  function ev30() {
    const g = ensure();
    if (!g || Number(g.npc.DH) !== 1) return;
    alert(-1);
    shortcutEv19();
    later('EV-30:msg', delayFor('DH'), () => {
      npcMsg('DH', T('ev30'));
    });
    LM.logEvent('EV-30', { at: g.gameMs });
  }

  /* ---------- 실장(KS) 연쇄 ---------- */
  function ks1() {
    const g = ensure();
    if (!g) return;
    if (g.npc.KS === 2 || g.npc.KS === 3) return;
    if (g.npc.KS === 1) return;
    g.npc.KS = 1;
    g.world.ks1At = g.gameMs;
    LM.emit('npc', { npc: 'KS', state: 1 });
    LM.logEvent('KS-1', { at: g.gameMs });
    LM.sched.def('EV-22', () => {
      g.world.sidePrivate = true;
      LM.notify({ app: 'loop', title: '루프', body: 'side.money.kr 계정이 비공개로 전환되었습니다' });
    });
    LM.sched.after('EV-22', 20);
    LM.sched.def('EV-23', () => {
      g.world.kangHighlightsGone = true;
      g.world.minjiCommentGone = true;
      LM.notify({ app: 'loop', title: '루프', body: '게시물 일부가 삭제되었습니다' });
    });
    LM.sched.after('EV-23', 40);
    scheduleEv11(30);
    saveSoon();
  }
  function scheduleEv11(minutes) {
    const g = ensure();
    if (!g.world.ev11Scheduled) g.world.ev11Scheduled = true;
    else if (g.events['EV-11']) return;
    LM.sched.def('EV-11', () => {
      npcMsg('IMP', T('ev11'), { eid: 'E-46' });
      LM.logEvent('EV-11', { at: g.gameMs });
    });
    LM.sched.after('EV-11', minutes == null ? 30 : minutes);
  }
  function ev12() {
    const g = ensure();
    if (!g) return;
    g.npc.KS = 2;
    LM.emit('npc', { npc: 'KS', state: 2 });
    npcMsg('KS', '누구냐. 도현이 아니지');
    LM.logEvent('EV-12', { at: g.gameMs });
  }
  function leak() {
    const g = ensure();
    if (!g || g.world.leakHandled) return;
    g.world.leakHandled = true;
    g.npc.KS = 3;
    LM.emit('npc', { npc: 'KS', state: 3 });
    LM.sched.def('EV-17', () => {
      g.world.leakStory = true;
      LM.notify({ app: 'loop', title: '루프', body: '@jh_lee_99님이 스토리를 올렸습니다' });
      LM.logEvent('EV-17', { at: g.gameMs });
    });
    LM.sched.after('EV-17', 120);
    LM.logEvent('LEAK', { at: g.gameMs });
  }

  /* ---------- EV-14: 음성 메모 업로드 ---------- */
  function ev14() {
    const g = ensure();
    if (!g) return;
    g.flags.REC = 'synced';
    g.world.remBackup = true;
    LM.notify({ app: 'set', title: '시러스', body: '새로운 녹음 37 업로드 완료' });
    if (Number(g.npc.DH) >= 2) npcMsg('DH', T('ev14dh2'));
    else if (Number(g.npc.DH) === 1) alert(1);
    LM.logEvent('EV-14', { at: g.gameMs });
  }

  /* ---------- EV-15: 찾기 소리 ---------- */
  function ev15() {
    const g = ensure();
    if (!g) return;
    if (Number(g.npc.DH) === 1 || Number(g.npc.DH) === 2) alert(1);
    else if (Number(g.npc.DH) >= 3) npcMsg('DH', T('ev15dh3'));
    LM.logEvent('EV-15', { at: g.gameMs });
  }

  /* ---------- EV-18: 예약 메일 ---------- */
  function ev18() {
    const g = ensure();
    if (!g) return;
    if (Number(g.npc.DH) >= 3) npcMsg('DH', T('ev18dh3'));
    else if (Number(g.npc.DH) === 1 || Number(g.npc.DH) === 2) {
      alert(2);
      npcMsg('DH', T('ev18low'));
    }
    LM.logEvent('EV-18', { at: g.gameMs });
  }

  /* ---------- EV-27: 한끼 재주문 ---------- */
  function ev27() {
    const g = ensure();
    if (!g) return;
    const n = Number(g.npc.DH);
    if (n >= 3) {
      g.npc.alert = 0;
      npcMsg('DH', T('ev27dh3'));
    } else if (n === 1 || n === 2) {
      npcMsg('DH', T('ev27low'));
      alert(2);
      triggerMoved('EV-27');
    }
    LM.logEvent('EV-27', { at: g.gameMs });
  }

  /* ---------- EV-16: DH-4 진입 ---------- */
  function ev16() {
    const g = ensure();
    if (!g || g.events['EV-16']) return;
    later('EV-16:msg', delayFor('DH'), () => npcMsg('DH', T('ev16'), { eid: 'E-91' }));
    g.events['EV-16'] = g.gameMs;
  }

  /* ---------- 흔적 반응 ---------- */
  function onTrace(id, rec) {
    const meta = (rec && rec.meta) || {};
    const g = ensure();
    if (!g) return;
    const react = (npc, fn, fixed) => {
      const d = fixed == null ? delayFor(npc) : fixed;
      LM.sched.def('TR:' + id + ':' + npc, fn);
      LM.sched.after('TR:' + id + ':' + npc, d, fn);
    };

    switch (id) {
      case 'TR-01':
        break;
      case 'TR-02':
        if (meta.kind === 'dad') {
          later('TR:TR-02:ev30', delayFor('DH'), ev30);
        } else if (meta.npc === 'JH') {
          react('JH', () => npcMsg('JH', T('tr02jh')), 3);
        } else if (meta.npc === 'SA') {
          alert(0);
        }
        break;
      case 'TR-03':
        react('SA', () => {
          const gg = ensure();
          if (!gg || gg.npc.DH === 'X') return;
          if (!(Number(gg.npc.SA) > 0)) { gg.npc.SA = 1; LM.emit('npc', { npc: 'SA', state: 1 }); }
          npcMsg('SA', T('ev34sa'));
        });
        scheduleEv11(30);
        break;
      case 'TR-04':
        if (meta.thread === 'seoa') react('SA', () => npcMsg('SA', T('tr04sa')));
        else if (meta.thread === 'imp') react('IMP', () => npcMsg('IMP', T('tr04imp')));
        break;
      case 'TR-05':
        if (meta.handle === 'seoa.film') {
          react('SA', () => {
            const gg = ensure();
            if (!(Number(gg.npc.SA) > 0)) { gg.npc.SA = 1; LM.emit('npc', { npc: 'SA', state: 1 }); }
            npcMsg('SA', T('ev34sa'));
          });
        } else if (meta.handle === 'moneycoach.kang') {
          ks1();
        }
        break;
      case 'TR-06':
        if (meta.capture) react('KS', ev12);
        else ks1();
        break;
      case 'TR-07':
        if (meta.source === 'cam' && meta.room) { g.flags.ROOM_PHOTO = true; alert(-1); }
        if (meta.app === 'bank' || /^E-8\d/.test(String(meta.eid || ''))) alert(1);
        if (meta.eid === 'E-47') react('DH', () => npcMsg('DH', '그거 보지 마'));
        break;
      case 'TR-08':
        if (meta.kind === 'reminder' && /아빠한테/.test(String(meta.text || ''))) {
          react('DH', () => npcMsg('DH', T('tr08check')));
        } else if (meta.kind === 'memo' && /도현아/.test(String(meta.text || ''))) {
          react('DH', () => npcMsg('DH', Number(ensure().npc.DH) >= 3 ? '메모 봤어. 아빠가 쓴 거지' : T('tr08who')));
        }
        break;
      case 'TR-09':
        later('TR:TR-09:ev18', delayFor('DH'), ev18);
        break;
      case 'TR-10':
        alert(1);
        LM.notify({ app: 'mail', title: '시러스', body: 'dontknow__ 새 기기 로그인', hidden: false });
        break;
      case 'TR-11':
        later('TR:TR-11:ev15', delayFor('DH'), ev15);
        break;
      case 'TR-12':
        alert(1, { onlyState: 1 });
        break;
      case 'TR-13':
        later('EV-14', 4, ev14);
        if (!g.events['EV-13note']) {
          g.events['EV-13note'] = g.gameMs;
          LM.notify({ app: 'rem', title: '미리 알림', body: '녹음 백업' });
        }
        break;
      case 'TR-14':
        if (meta.author === 'harin.daily' || meta.thread === 'harin') {
          react('HR', () => npcMsg('HR', T('tr14harin')), 30);
        } else if (meta.author === 'moneycoach.kang') {
          ks1();
        }
        break;
      case 'TR-15':
        dhX('password');
        break;
      case 'TR-16':
        if (Number(g.npc.DH) === 4) {
          g.world.locShared = true;
          LM.emit('locShared', {});
        } else {
          alert(1);
          react('DH', () => npcMsg('DH', T('tr16no')));
        }
        break;
      case 'TR-17':
        later('TR:TR-17:ev27', delayFor('DH'), ev27);
        break;
      case 'TR-18':
      case 'TR-19':
        break;
      default:
        break;
    }
  }

  /* ---------- 도현 대화 훅 ---------- */
  function onDialogueSent(e) {
    const g = ensure();
    if (!g || !e) return;
    if (e.npc === 'DH') {
      if (Number(g.npc.DH) < 2) setDH(2);
      const text = String(e.text || '');
      if (Number(g.npc.DH) <= 2 && /(해담|207|성원구청로\s*31)/.test(text)) triggerMoved('dialogue');
      if (g.flags.LEAK) leak();
    } else if (e.npc === 'KS' || e.npc === 'IMP') {
      if (g.flags.LEAK) leak();
    } else if (e.npc === 'SA' && LM.dialogue && !LM.dialogue.revealed()) {
      if (!g.world.alertSA) { g.world.alertSA = true; alert(1); }
    } else if (e.npc === 'MJ') {
      if (!g.world.ev25) {
        g.world.ev25 = true;
        LM.sched.def('EV-25', () => {
          LM.C.see('E-110');
          g.world.minjiCapture = true;
          LM.msg.add('loop', 'minji', { from: 'in', text: '@jh_lee_99가 또 DM 했어요. 캡처해 뒀어요.', at: g.gameMs, npc: 'MJ', eid: 'E-110' });
          LM.logEvent('EV-25', { at: g.gameMs });
        });
        LM.sched.after('EV-25', 30);
      }
    }
    if (e.npc === 'KT' && (e.eids || []).indexOf('E-37') >= 0) {
      g.flags.REC = 'sent';
      g.flags.REC_SENT = true;
    }
  }

  function onDialogueHook(e) {
    if (!e || e.hook !== 'DH3') return;
    const g = ensure();
    if (!g) return;
    ['EV-04', 'EV-05', 'EV-06', 'EV-07', 'EV-08', 'EV-08b', 'EV-19'].forEach((id) => cancelEv(id));
    g.world.dh3 = { at: g.gameMs };
    if (LM.read) {
      for (let i = 1; i <= 6; i++) LM.read.mark('talk', 'dad:' + i);
    }
    LM.emit('dh3', { at: g.gameMs });
    LM.logEvent('DH-3', { at: g.gameMs });
  }

  /* ---------- 부트 ---------- */
  function afterFirstOnline() {
    const g = ensure();
    if (!g || g.firstOnlineAt == null) return;
    const t = g.firstOnlineAt;
    LM.sched.def('EV-02', ev02);
    LM.sched.at('EV-02', t, ev02);
    LM.sched.def('EV-03', ev03);
    LM.sched.at('EV-03', t, ev03);
    ['EV-04', 'EV-05', 'EV-06', 'EV-07', 'EV-09'].forEach((id) => {
      const mins = { 'EV-04': 18, 'EV-05': 30, 'EV-06': 36, 'EV-07': 48, 'EV-09': 40 }[id];
      LM.sched.def(id, evHandlers[id]);
      LM.sched.afterOnline(id, mins, evHandlers[id], { needsOnline: true });
    });
  }

  const evHandlers = {
    'EV-04': function () {
      const g = ensure();
      if (!g || g.sync.notes === false) return;
      LM.remoteDelete('note', 'n-dad');
    },
    'EV-05': function () {
      const g = ensure();
      if (!g || g.sync.photos === false) return;
      ['h1', 'h2', 'h3', 'h4'].forEach((id) => LM.remoteDelete('photo', id));
    },
    'EV-06': ev06,
    'EV-07': function () {
      const g = ensure();
      if (!g || g.sync.notes === false) return;
      LM.remoteDelete('note', 'n-left');
    },
    'EV-09': function () {
      const g = ensure();
      if (!g) return;
      g.world.subArchived = true;
      if (!g.world.subLoggedIn) LM.emit('subArchived', {});
    },
  };

  function boot() {
    const g = ensure();
    if (!g) return;
    scheduleAbsolute();
    if (g.firstOnlineAt != null) afterFirstOnline();
    if (g.flags.WIPED) showWipe();
  }

  LM.ev = {
    onTrace: onTrace,
    alert: alert,
    dhX: dhX,
    setDH: setDH,
    judge: judge,
    wipeNow: wipeNow,
    armWipe: armWipe,
    triggerMoved: triggerMoved,
    moved: () => !!(ensure() && G().world.dhMovedAt),
    dhPlace: () => ((ensure() && G().world.dhPlace) || '해담고시텔 207호'),
    locShared: () => !!(ensure() && G().world.locShared),
    changeCirrusPassword: function () { dhX('password'); LM.emit('cirrus:password'); },
    removeDevice: function () { dhX('device'); LM.emit('cirrus:device'); },
    slateWipe: function () {
      const g = ensure();
      if (!g) return;
      g.flags.WIPE_SLATE = true;
      dhX('slate');
      judge('slate');
    },
    familyRequest: function () {
      if (LM.trace) LM.trace('TR-16');
    },
    kangSeen: function () { ks1(); },
  };

  /* 도현이 방 사진을 동기화한 뒤 "아빠다"를 보내면 V-04′: 두 줄로 답한다. */
  if (LM.dialogue && LM.dialogue.on) {
    LM.dialogue.on('DH', (p) => {
      const g = ensure();
      if (!g || !g.flags.ROOM_PHOTO) return null;
      if (Number(g.npc.DH) < 1 || Number(g.npc.DH) > 2) return null;
      if (!p.match || !p.match.identity) return null;
      return { reply: [T('roomAsk'), T('dadAsk')], state: 2 };
    });
  }

  LM.on('firstOnline', afterFirstOnline);
  LM.on('dialogue:sent', onDialogueSent);
  LM.on('dialogue:hook', onDialogueHook);
  LM.on('npc', (e) => { if (e && e.npc === 'DH' && Number(e.state) === 4) ev16(); });
  LM.on('gload', boot);
  LM.on('newGame', boot);
  LM.on('g', (e) => { if (e && e.path === 'flags.LEAK' && e.value) leak(); });
  LM.on('memo:keyword', () => {
    const g = ensure();
    if (!g || g.world.ev35) return;
    if (g.npc.DH === 'X' || Number(g.npc.DH) < 1) return;
    g.world.ev35 = true;
    npcMsg('DH', Number(g.npc.DH) >= 3 ? '메모 봤어. 아빠가 쓴 거지' : T('ev35'));
    LM.logEvent('EV-35', { at: g.gameMs });
  });
  LM.on('online', () => { if (LM.G && LM.G.flags.LEAK) leak(); });
  try { boot(); } catch (e) { console.error(e); }
})();
