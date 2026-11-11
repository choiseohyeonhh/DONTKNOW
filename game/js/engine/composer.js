/* 공용 작성창·공유 시트·스크린샷 저장. 설계: BUSINESS_RULES BR-14·17·18·19, SYSTEM_SHELL 4.9,
 * SCREEN_SPECIFICATIONS SCR-OS-COMPOSER·SCR-OS-SHARE-SHEET, SETTINGS 8.9 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  function norm(s) { return String(s == null ? '' : s).toLowerCase().replace(/[\s\-–—_.,·:'"“”‘’()\[\]]/g, ''); }
  function data() { return LM.C && LM.C.composer ? LM.C.composer : { suggestions: {} }; }
  function kb() { return (LM.C && LM.C.keyboard) || { clipboard: [], replace: [] }; }
  function online() { return !!(LM.online && LM.online()); }

  /* ---------- 대상 ---------- */
  const TARGETS = {
    talk: [
      { key: 'talk:jihoon', app: 'talk', thread: 'jihoon', npc: 'JH', name: '지훈' },
      { key: 'talk:seoa', app: 'talk', thread: 'seoa', npc: 'SA', name: '서아' },
    ],
    msg: [
      { key: 'msg:cirrus', app: 'msg', thread: 'cirrus', npc: 'DH', name: '도현의 슬레이트' },
    ],
    loop: [
      { key: 'loop:jihoon', app: 'loop', thread: 'jihoon', npc: 'JH', name: '지훈' },
      { key: 'loop:seoa', app: 'loop', thread: 'seoa', npc: 'SA', name: '서아' },
      { key: 'loop:harin', app: 'loop', thread: 'harin', npc: 'HR', name: '박하린' },
      { key: 'loop:minji', app: 'loop', thread: 'minji', npc: 'MJ', name: '윤민지' },
      { key: 'loop:imp', app: 'loop', thread: 'imp', npc: 'IMP', name: '@jh_lee_99' },
    ],
    mail: [
      { key: 'mail:taeyun', app: 'mail', thread: 'sent', npc: 'KT', name: '김태윤 경위', to: 'taeyun.kim@sw.police.kr' },
      { key: 'mail:cheongun', app: 'mail', thread: 'sent', npc: 'CW', name: '청운고시원', to: 'cheongun@gosiwon.kr' },
    ],
    blink: [
      { key: 'blink:main', app: 'blink', thread: 'main', npc: 'KS', name: '실장K' },
    ],
  };
  const APP_LABEL = { talk: '톡', msg: '메시지', loop: '루프 DM', mail: '메일', blink: '블링크' };
  LM.TARGETS = TARGETS;
  LM.targetFor = function (app, thread) {
    return (TARGETS[app] || []).find((t) => t.thread === String(thread)) || null;
  };
  function npcForTarget(t, payload) {
    if (!t) return null;
    if (t.npc) return t.npc;
    const to = String(t.to || '');
    if (to === 'taeyun.kim@sw.police.kr') return 'KT';
    if (to === 'cheongun@gosiwon.kr') return 'CW';
    return null;
  }

  /* ---------- 보내기 ---------- */
  LM.sendMessage = function (target, payload) {
    payload = payload || {};
    if (!online()) return false;
    const t = target || {};
    const text = String(payload.text == null ? '' : payload.text);
    const att = payload.attachment || null;
    if (!text.trim() && !att) return false;
    let suggestionId = payload.suggestionId || null;
    if (!suggestionId && t.npc) {
      const list = (data().suggestions || {})[t.npc] || [];
      const hit = list.find((s) => norm(s) === norm(text));
      if (hit) suggestionId = hit;
    }
    const at = LM.G.gameMs;
    if (t.app === 'mail') {
      const subject = payload.subject || (text.trim().split('\n')[0] || att && att.title || '(제목 없음)').slice(0, 60);
      LM.msg.add('mail', t.thread || 'sent', {
        from: 'out', title: '이도현', fromAddr: 'dohyun.lee0921@cirrus.kr', to: t.to || '',
        subject: subject, text: text, at: at,
        attach: att ? { name: att.title || '첨부', kind: att.kind || '파일', source: att.app || null, eid: att.eid || null } : null,
        eid: att && att.eid || null, silent: true,
      });
    } else {
      LM.msg.add(t.app, t.thread, { from: 'out', text: text, at: at, attach: att, eid: att && att.eid || null, silent: true });
    }
    const npc = npcForTarget(t, payload);
    if (npc) {
      LM.dialogue.send(npc, {
        app: t.app, thread: t.thread, text: text, attachment: att,
        suggestionId: suggestionId, name: t.name, title: t.name,
      });
    }
    if (LM.trace) {
      if (t.app === 'mail') LM.trace('TR-18', { to: t.to || '', npc: npc });
      if (npc === 'KS' || npc === 'IMP') LM.trace('TR-19', { npc: npc });
    }
    LM.logEvent('send', { app: t.app, thread: t.thread, npc: npc, text: text, eid: att && att.eid || null });
    if (LM._autosave) LM._autosave();
    return true;
  };

  /* ---------- 스크린샷 저장 ---------- */
  const shots = () => {
    const g = LM.G;
    if (!g.shots || !Array.isArray(g.shots)) g.shots = [];
    return g.shots;
  };
  LM.saveShot = function (item) {
    item = item || {};
    const g = LM.G;
    const id = 'shot-' + (g.logSeq || 0) + '-' + shots().length;
    const shot = {
      id: id, title: item.title || '스크린샷', key: item.key || '스크린샷 ' + LM.fmt.date(LM.now(), 'mdhm'),
      eid: item.eid || 'SHOT', app: item.app || 'photo', at: LM.G.gameMs,
    };
    shots().unshift(shot);
    LM.seen(shot.eid);
    LM.emit('shot', shot);
    if (LM._autosave) LM._autosave();
    return shot;
  };

  /* ---------- 작성창 코어 ---------- */
  function attachmentsRow(attachment) {
    const host = h('div', { class: 'cmp-attach' });
    const draw = () => {
      host.replaceChildren();
      const a = host._attachment;
      if (!a) { host.hidden = true; return; }
      host.hidden = false;
      host.appendChild(h('div', { class: 'cmp-chip' }, LM.icon(a.kind === 'photo' || a.kind === 'screenshot' ? 'photo' : a.kind === 'recording' ? 'record' : 'doc'),
        h('span', null, a.title || a.eid || '첨부'),
        h('button', { class: 'cmp-chip-x', 'aria-label': '첨부 빼기', onclick: () => { host._attachment = null; draw(); } }, LM.icon('close'))));
    };
    host._attachment = attachment || null;
    draw();
    host.set = (a) => { host._attachment = a || null; draw(); };
    host.get = () => host._attachment;
    return host;
  }

  function suggestionsRow(npc, onPick) {
    const list = (data().suggestions || {})[npc] || [];
    if (!list.length) return null;
    return h('div', { class: 'cmp-sugg', role: 'group', 'aria-label': '추천 문장' },
      list.map((s) => h('button', { class: 'cmp-sugg-chip', onclick: () => onPick(s) }, s)));
  }

  function clipboardChip(onPick) {
    const first = (kb().clipboard || [])[0];
    if (!first) return null;
    return h('div', { class: 'cmp-clip' },
      h('button', { class: 'cmp-clip-chip', 'aria-label': '붙여넣기', onclick: () => onPick(first.v) },
        LM.icon('paste'), h('span', null, '붙여넣기'), h('small', null, first.v)));
  }

  function replacementFor(token) {
    const list = kb().replace || [];
    const onlineNow = online();
    return list.find((r) => r.k === token && (!r.onlineOnly || (LM.G && LM.G.firstOnlineAt != null && onlineNow)));
  }

  function applyReplace(inp) {
    const caret = inp.selectionStart == null ? inp.value.length : inp.selectionStart;
    const before = inp.value.slice(0, caret);
    const m = before.match(/(^|\s)(\S+)$/);
    if (!m) return false;
    const token = m[2];
    const rep = replacementFor(token);
    if (!rep) return false;
    const start = caret - token.length;
    const after = inp.value.slice(caret);
    inp.value = inp.value.slice(0, start) + rep.v + ' ' + after;
    const pos = start + rep.v.length + 1;
    try { inp.setSelectionRange(pos, pos); } catch (e) { /* ignore */ }
    return true;
  }

  function pickPhoto(onPick) {
    const items = (LM.photo && LM.photo.recentItems) ? LM.photo.recentItems() : [];
    const grid = items.length
      ? h('div', { class: 'ph-grid cmp-pickgrid' }, items.map((it) => h('button', {
        class: 'ph-cell', 'aria-label': it.title || '사진',
        onclick: (e) => {
          const w = e.target.closest('.sheet-wrap'); if (w) w.close();
          onPick({ eid: it.eid, title: it.title, kind: 'photo', app: it.app || 'photo' });
        },
      }, ui.photo(it.key, { ratio: '1 / 1', caption: false }))))
      : ui.empty({ icon: 'photo', title: '사진이 없습니다' });
    const wrap = ui.sheet(null, ui.sheetPage({ title: '사진 선택', cancel: '취소', body: h('div', { class: 'cmp-picker' }, grid) }), { size: 'large' });
    return wrap;
  }

  function core(o) {
    const target = o.target || {};
    const npc = target.npc || null;
    const attachHost = attachmentsRow(o.attachment || null);
    const inp = o.multiline
      ? h('textarea', { class: 'cmp-input', rows: '3', placeholder: o.placeholder || '메시지 입력…', 'aria-label': '메시지 입력' })
      : h('input', { class: 'cmp-input', type: 'text', placeholder: o.placeholder || '메시지 입력…', 'aria-label': '메시지 입력' });
    const state = h('span', { class: 'cmp-state', role: 'status', 'aria-live': 'polite' });
    const sendBtn = h('button', { class: 'cmp-send', 'aria-label': '보내기', disabled: true }, LM.icon('send'));

    const sync = () => {
      const has = !!String(inp.value || '').trim() || !!attachHost.get();
      const allowed = online() && has;
      sendBtn.disabled = !allowed;
      sendBtn.setAttribute('aria-disabled', !allowed);
      if (!online()) state.textContent = '온라인이 필요합니다';
      else if (!has) state.textContent = '';
      else state.textContent = '';
    };

    const pickSuggestion = (s) => { inp.value = s; sync(); inp.focus(); };
    const addAttach = (a) => { attachHost.set(a); sync(); };

    const plus = h('button', { class: 'cmp-plus', 'aria-label': '첨부', onclick: () => {
      ui.actionSheet({ actions: [
        { label: '사진', onClick: () => pickPhoto(addAttach) },
        { label: '파일', onClick: () => addAttach({ eid: 'E-216', title: '교육자료.pdf', kind: 'file', app: 'file' }) },
        { label: '위치', onClick: () => addAttach({ eid: 'E-150', title: '성원구청로 31, 해담고시텔 207호', kind: 'place', app: 'hankki' }) },
        { label: '녹음', onClick: () => addAttach({ eid: 'E-37', title: '새로운 녹음 37 · 42:31', kind: 'recording', app: 'voice' }) },
      ] });
    } }, LM.icon('plus'));

    function doSend() {
      if (!online()) { state.textContent = '온라인이 필요합니다'; return false; }
      const text = String(inp.value || '');
      const att = attachHost.get();
      if (!text.trim() && !att) return false;
      const ok = LM.sendMessage(target, { text: text, attachment: att, suggestionId: o.suggestionId || null, subject: o.subject });
      if (!ok) { state.textContent = '전송 실패'; return false; }
      inp.value = '';
      attachHost.set(null);
      state.textContent = '';
      sync();
      if (o.onSent) o.onSent();
      return true;
    }

    inp.addEventListener('keydown', (e) => {
      if (e.key === ' ' && applyReplace(inp)) { e.preventDefault(); sync(); return; }
      if (e.key === 'Enter' && (!o.multiline || e.ctrlKey || e.metaKey)) { e.preventDefault(); doSend(); }
    });
    inp.addEventListener('input', sync);
    sendBtn.addEventListener('click', doSend);

    const sugg = suggestionsRow(npc, pickSuggestion);
    const clip = clipboardChip((v) => { inp.value = v; sync(); inp.focus(); });
    sync();

    const bar = h('div', { class: 'cmp-bar' },
      attachHost,
      h('div', { class: 'cmp-main' }, plus, inp, sendBtn),
      state,
      sugg,
      clip);
    bar._input = inp;
    bar._send = doSend;
    bar._attach = addAttach;
    bar.setTarget = () => {};
    return bar;
  }

  /* 앱 하단에 붙는 인라인 작성창. */
  LM.composer = {
    bar(o) { return core(Object.assign({}, o, { multiline: false })); },

    open(o) {
      o = o || {};
      const target = o.target || {};
      const bar = core(Object.assign({}, o, { multiline: true }));
      const head = h('div', { class: 'cmp-head' },
        h('button', { class: 'cmp-head-btn', onclick: () => wrap.close() }, '취소'),
        h('div', { class: 'cmp-head-title' }, target.name || o.name || '새 메시지'),
        h('button', { class: 'cmp-head-btn strong', onclick: () => { if (bar._send()) wrap.close(); } }, '보내기'));
      const body = h('div', { class: 'cmp-modal', 'data-app': target.app || '' },
        target.name ? h('div', { class: 'cmp-to' }, h('span', null, '받는 사람'), h('b', null, target.name)) : null,
        !online() ? ui.notice('온라인이 필요합니다. 입력은 초안으로 남습니다.', 'warn') : null,
        bar);
      const wrap = ui.sheet(null, h('div', { class: 'cmp-sheet' }, head, body), { size: 'large' });
      setTimeout(() => bar._input && bar._input.focus(), 120);
      return wrap;
    },
  };

  /* ---------- 공유 시트 ---------- */
  function normalizePayload(p) {
    if (p == null) return { title: '항목' };
    if (typeof p === 'string') return { title: p };
    const eid = p.eid || (p.eids && p.eids[0]) || null;
    const info = eid && LM.C && LM.C.evInfo ? LM.C.evInfo(eid) : null;
    return Object.assign({}, p, {
      eid: eid,
      eids: p.eids || (eid ? [eid] : []),
      title: p.title || (info && info.title) || eid || '항목',
      kind: p.kind || (info && info.kind) || 'item',
      app: p.app || (info && info.app) || null,
    });
  }

  function targetPicker(payload, list, title) {
    const sheet = ui.sheet(null, ui.sheetPage({
      title: title || '대상 선택', cancel: '닫기', grouped: true,
      body: ui.group({ plain: true, rows: list.map((t) => ui.row({
        title: t.name, subtitle: t.to || APP_LABEL[t.app] || t.app,
        lead: ui.avatar(t.name, 40),
        onClick: (e) => {
          if (!online()) { ui.toast('온라인이 필요합니다'); return; }
          const w = e.target.closest('.sheet-wrap'); if (w) w.close();
          if (t.custom) { LM.composer.openMailTo(payload); return; }
          openComposer(payload, t);
        },
      })) }),
    }), { size: 'medium' });
    return sheet;
  }

  function openComposer(payload, target) {
    LM.composer.open({
      target: target,
      attachment: payload.eid ? { eid: payload.eid, eids: payload.eids, title: payload.title, kind: payload.kind, app: payload.app } : null,
    });
  }

  LM.share = {
    open(p) {
      const payload = normalizePayload(p);
      const host = h('div', { class: 'share' },
        h('div', { class: 'share-what' }, LM.icon(payload.kind === 'photo' || payload.kind === 'screenshot' ? 'photo' : 'doc'), h('span', null, payload.title)),
        h('div', { class: 'share-row' }, ['talk', 'msg', 'loop', 'mail', 'blink'].map((id) => h('button', {
          class: 'share-t', 'aria-label': APP_LABEL[id],
          onclick: (e) => {
            const w = e.target.closest('.sheet-wrap'); if (w) w.close();
            if (!online()) { ui.toast('온라인이 필요합니다'); return; }
            const list = (TARGETS[id] || []).slice();
            if (id === 'mail') list.push({ key: 'mail:custom', app: 'mail', thread: 'sent', npc: null, name: '주소로 보내기', to: '', custom: true });
            targetPicker(payload, list, APP_LABEL[id] + ' 대상');
          },
        }, LM.appIcon(id, 56), h('span', null, APP_LABEL[id])))),
        h('div', { class: 'share-recent' },
          h('div', { class: 'grp-h' }, '최근'),
          h('div', { class: 'share-row' }, [
            TARGETS.talk[0], TARGETS.talk[1], TARGETS.msg[0], TARGETS.loop.find((t) => t.npc === 'MJ'), TARGETS.mail[0], TARGETS.blink[0],
          ].filter(Boolean).map((t) => h('button', {
            class: 'share-t', 'aria-label': t.name,
            onclick: (e) => {
              if (!online()) { ui.toast('온라인이 필요합니다'); return; }
              const w = e.target.closest('.sheet-wrap'); if (w) w.close();
              openComposer(payload, t);
            },
          }, ui.avatar(t.name, 56), h('span', null, t.name))))),
        ui.group({ rows: [ui.row({
          title: '스크린샷으로 저장', icon: 'screenshot', action: true,
          onClick: (e) => {
            const w = e.target.closest('.sheet-wrap'); if (w) w.close();
            LM.saveShot({ eid: payload.eid || 'SHOT', title: payload.title, app: payload.app });
            ui.toast('사진에 저장됨');
          },
        })] }));
      ui.sheet(null, ui.sheetPage({ title: '공유', body: host }), { size: 'medium' });
      if (!online()) host.insertBefore(ui.notice('오프라인입니다. 온라인 대상은 보낼 수 없습니다.', 'warn'), host.firstChild.nextSibling);
    },
  };

  /* 기존 호출부(ui.share)를 새 시트로 바꾼다. */
  ui.share = (p) => LM.share.open(p);

  /* 공유 시트의 '주소로 보내기'가 만든 대상의 주소 입력을 작성창에서 받는다. */
  LM.composer.openMailTo = function (payload) {
    const inp = h('input', { class: 'cmp-input', type: 'email', placeholder: '받는 사람 주소', 'aria-label': '받는 사람 주소' });
    const next = () => {
      const to = inp.value.trim();
      if (!to) return;
      const w = inp.closest('.sheet-wrap'); if (w) w.close();
      openComposer(payload || {}, { app: 'mail', thread: 'sent', npc: null, name: to, to: to });
    };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); next(); } });
    ui.sheet(null, ui.sheetPage({
      title: '주소로 보내기', cancel: '취소', done: '다음', onDone: next,
      body: h('div', { class: 'cmp-modal' }, inp),
    }), { size: 'small' });
    setTimeout(() => inp.focus(), 150);
  };
})();
