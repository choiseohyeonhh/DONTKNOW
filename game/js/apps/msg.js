/* 메시지 — 시스템 문자와 시러스(슬레이트) 대화. 캐논: MESSAGING_SPECIFICATION 2절, SCR-MSG-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const EV06 = '이 폰 가지고 있는 사람. 30분 안에 대답 없으면 원격으로 지웁니다.';
  const HANKYUL = (() => {
    const out = [];
    const row = (day) => ({
      dir: 'in',
      body: '[한결캐피탈] 입금 확인 (입금자 이도*)',
      day: day,
      time: '09:00', // 시각 자리표시(캐논 없음)
      origin: '한결캐피탈',
      addr: '1600-XXXX',
      eid: 'E-05',
    });
    let y = 2024, m = 8;
    for (let i = 0; i < 17; i++) {
      out.push(row(y + '.' + String(m).padStart(2, '0') + '.05')); // 2024.08~2025.12
      m++; if (m > 12) { m = 1; y++; }
    }
    // 마지막 두 확인은 은행 출금일(1/27·2/26)과 1:1로 맞춘다(E-05·E-83).
    out.push(row('2026.01.27'));
    out.push(row('2026.02.26'));
    return out;
  })();

  const THREADS = [
    {
      id: 'ontong', type: 'system', name: '온통신', address: '온통신', icon: 'signal', unread: 1,
      messages: [{ dir: 'in', body: '[온통신] 분실 정지 신청이 접수되었습니다. 이 기기에서는 통화와 문자가 되지 않습니다.', day: '3/15', time: '09:10', origin: '온통신' }],
    },
    {
      id: 'police', type: 'system', name: '성원경찰서', address: '성원경찰서 수사과', icon: 'shield', unread: 1,
      messages: [{ dir: 'in', body: '[성원경찰서] 이도현님, 수사과 금융범죄수사팀 김태윤 경위입니다. 3/20 10:00 출석요구 안내드립니다.', day: '3/13', time: '10:02', origin: '성원경찰서', eid: 'E-04' }],
    },
    {
      id: 'bank', type: 'system', name: '누리은행', address: '누리은행', icon: 'card', unread: 1,
      messages: [{ dir: 'in', body: '[누리은행] 전기통신금융사기 관련 지급정지 안내', day: '3/12', time: '09:14', origin: '누리은행', eid: 'E-03' }],
    },
    {
      id: 'hankyul', type: 'system', name: '한결캐피탈', address: '1600-XXXX', icon: 'receipt', unread: 1,
      messages: HANKYUL,
    },
    {
      id: 'market', type: 'system', name: '이웃마켓', address: '이웃마켓', icon: 'store', unread: 0,
      messages: [{ dir: 'in', body: '[이웃마켓] 인증번호는 [482913] 입니다', day: '3/10', time: '15:20', origin: '이웃마켓' }],
    },
    {
      id: 'nuricard', type: 'system', name: '누리카드', address: '누리카드', icon: 'card', unread: 0,
      messages: [{ dir: 'in', body: '[자동이체 실패] 3/11 출금 잔액 부족', day: '3/11', time: '18:30', origin: '누리카드' }],
    },
    {
      id: 'cirrus', type: 'cirrus', name: '도현의 슬레이트', address: 'dohyun.lee0921@cirrus.kr', unread: 0,
      messages: [],
    },
  ];

  THREADS.forEach((t) => {
    t.extra = [];
    t.messages.forEach((m, i) => { if (m.id == null) m.id = t.id + ':' + i; m.threadId = t.id; });
  });

  LM.register({ id: 'msg', render(app) { app.start((nav) => list(nav)); } });

  function runtime(t) {
    return LM.msg.list('msg', t.id).map((rt) => ({
      id: rt.id, dir: rt.from === 'out' ? 'out' : 'in', body: rt.text,
      day: LM.fmt.date(rt.at, 'md'), time: LM.fmt.date(rt.at, 'hm'), rt: true,
      origin: rt.origin || null, slate: !!rt.slate, syncedAt: rt.syncedAt || null,
      attach: rt.attach || null, eid: rt.eid || (rt.attach && rt.attach.eid) || null,
    }));
  }
  function messages(t) { return t.messages.concat(t.extra, runtime(t)); }
  function unread(t) { return LM.read.unreadCount('msg', t.id); }

  LM.read.register('msg', () => {
    const out = [];
    THREADS.forEach((t) => {
      if (t.unread > 0) {
        const lastIn = t.messages.slice().reverse().find((m) => m.dir === 'in');
        if (lastIn) out.push({ id: lastIn.id, threadId: t.id });
      }
      LM.msg.list('msg', t.id).forEach((rt) => { if (rt.from !== 'out') out.push({ id: rt.id, threadId: t.id }); });
    });
    return out;
  });
  function last(t) {
    const m = messages(t);
    return m.length ? m[m.length - 1] : null;
  }
  function listTime(m) { return LM.fmt.list((m.day || '') + ' ' + (m.time || '')); }
  function preview(t) {
    const m = last(t);
    if (!m) return '메시지 없음';
    if (m.fail) return '전송 실패';
    return m.body;
  }

  function chip(t) {
    return h('span', { class: 'msg-chip' + (t.type === 'cirrus' ? ' cirrus' : '') }, t.type === 'cirrus' ? '시러스' : '시스템');
  }

  function listRow(nav, t) {
    const m = last(t);
    const lead = t.type === 'cirrus'
      ? ui.avatar('도현', 40)
      : h('span', { class: 'msg-sysav', 'aria-hidden': true }, LM.icon(t.icon));
    return ui.row({
      title: h('span', { class: 'msg-titlewrap' }, h('span', { class: 'msg-name' }, t.name), chip(t)),
      subtitle: preview(t),
      meta: m ? listTime(m) : '—',
      lead,
      badge: unread(t) || null,
      onClick: () => nav.push(() => room(nav, t)),
      onLong: () => threadInfo(t),
    });
  }

  function list(nav) {
    const host = h('div');
    const draw = () => { host.replaceChildren(ui.group({ plain: true, rows: THREADS.map((t) => listRow(nav, t)) })); };
    draw();
    const offRead = LM.on('read', () => { if (host.isConnected) draw(); else offRead(); });
    const offMsg = LM.on('msg', () => { if (host.isConnected) draw(); else offMsg(); });
    return ui.page({
      title: '메시지',
      right: h('button', { class: 'nb-btn', 'aria-label': '새 메시지', onclick: () => ui.toast(LM.online() ? '새 메시지는 온라인에서 동기화된다' : '오프라인 상태입니다') }, LM.icon('compose')),
      body: host,
    });
  }

  function room(nav, t) {
    const log = h('div', { class: 'msg-room', role: 'log', 'aria-live': 'polite' });
    let scroller = null;

    function draw() {
      const ms = messages(t);
      const kids = [];
      let day = null;
      ms.forEach((m) => {
        if (m.day !== day) { day = m.day; kids.push(h('div', { class: 'msg-day' }, h('time', null, day))); }
        kids.push(bubble(t, m, () => retry(t, m, draw, scroller)));
      });
      if (!ms.length) kids.push(ui.empty({ icon: 'chat', title: '메시지가 없습니다', text: t.id === 'cirrus' ? '첫 온라인 후 슬레이트에서 온 메시지가 동기화된다.' : null }));
      if (LM.dialogue && LM.dialogue.typing('msg', t.id)) kids.push(h('div', { class: 'msg-line' }, h('div', { class: 'msg-bubble' }, h('span', { class: 'typing-dot' }, h('i'), h('i'), h('i')))));
      log.replaceChildren(...kids);
    }

    const footer = composer(t, (text) => send(t, text, draw, scroller));
    const body = h('div', null,
      t.address && t.address !== t.name ? h('div', { class: 'msg-addr' }, t.name + ' · ' + t.address) : null,
      log);

    const page = ui.page({
      title: t.name, back: '메시지', nav, large: false, body, footer,
      right: h('button', { class: 'nb-btn', 'aria-label': '정보', onclick: () => threadInfo(t) }, LM.icon('info')),
    });
    scroller = page.scroller;
    draw();
    setTimeout(() => { scroller.scrollTop = scroller.scrollHeight; }, 30);
    const offState = LM.on('state', () => {
      if (!log.isConnected) { offState(); return; }
      draw();
      setTimeout(() => { scroller.scrollTop = scroller.scrollHeight; }, 20);
    });
    const offRead = LM.on('read', (e) => {
      if (!log.isConnected) { offRead(); return; }
      if (e && e.appId && e.appId !== 'msg') return;
      draw();
    });
    const offMsg = LM.on('msg', (e) => {
      if (!log.isConnected) { offMsg(); return; }
      if (e.appId !== 'msg' || e.threadId !== t.id) return;
      LM.read.markThread('msg', t.id);
      draw();
      setTimeout(() => { if (scroller) scroller.scrollTop = scroller.scrollHeight; }, 20);
    });
    const hadUnread = LM.read.unreadCount('msg', t.id) > 0;
    LM.read.markThread('msg', t.id);
    if (hadUnread && LM.online() && LM.trace) LM.trace('TR-02', { kind: t.id === 'cirrus' ? 'dh' : 'system', npc: t.type === 'cirrus' ? 'DH' : null, thread: t.id });
    messages(t).forEach((m) => LM.C.see(m.eid));
    const lastEidMsg = messages(t).slice().reverse().find((m) => m.eid);
    LM.setEid(lastEidMsg ? lastEidMsg.eid : null);
    const offTyping = LM.on('dlg:typing', (e) => {
      if (!log.isConnected) { offTyping(); return; }
      if (e && e.app === 'msg' && e.thread === t.id) draw();
    });
    return page;
  }

  function bubble(t, m, onRetry) {
    const out = m.dir === 'out';
    const meta = h('div', { class: 'msg-meta' },
      m.fail ? h('span', { class: 'msg-fail' }, '!') : null,
      h('span', null, m.time),
      out && !m.fail ? h('span', null, '전송됨') : null,
      m.fail ? h('button', { class: 'msg-retry', onclick: onRetry }, (m.reason || '전송 실패') + ' · 다시 보내기') : null);
    const b = h('div', { class: 'msg-bubble' }, m.body,
      m.attach ? h('div', { class: 'att-card' }, LM.icon('doc'), h('div', null, h('b', null, m.attach.title || '첨부'), h('small', null, m.attach.kind || ''))) : null);
    if (m.eid) LM.C.see(m.eid);
    LM.longPress(b, () => ui.actionSheet({
      actions: [
        { label: '복사', onClick: () => ui.toast('복사됨') },
        { label: '공유', onClick: () => ui.share({ eid: m.eid, eids: m.eid ? [m.eid] : [], title: m.body || (m.attach && m.attach.title), kind: m.attach ? m.attach.kind : 'message', app: 'msg' }) },
        { label: '정보', onClick: () => messageInfo(t, m) },
      ],
    }));
    return h('div', { class: 'msg-line' + (out ? ' out' : '') + (m.fail ? ' failed' : '') },
      !out && m.slate ? h('div', { class: 'msg-sender' }, '도현의 슬레이트') : null,
      b, meta);
  }

  function composer(t, onSend) {
    if (t.type === 'system') {
      return h('div', { class: 'msg-composer' }, h('input', { class: 'msg-inp', type: 'text', placeholder: '답장할 수 없는 번호', 'aria-label': '메시지 입력', disabled: true }), h('button', { class: 'msg-send', disabled: true, 'aria-label': '보내기' }, LM.icon('send')));
    }
    return LM.composer.bar({
      target: { app: 'msg', thread: t.id, npc: 'DH', name: t.name },
    });
  }

  function send(t, text, draw, scroller) {
    if (!text.trim()) return;
    if (t.type === 'system') { ui.toast('서비스 없음'); return; }
    if (!LM.online()) { ui.toast('온라인이 필요합니다'); return; }
    LM.msg.add('msg', t.id, { from: 'out', text: text, at: LM.G.gameMs, silent: true });
    const inp = document.querySelector('.appwin[data-app="msg"] .msg-inp');
    if (inp) inp.value = '';
    setTimeout(() => { if (scroller) scroller.scrollTop = scroller.scrollHeight; }, 20);
  }

  function retry(t, m, draw, scroller) {
    const i = t.extra.indexOf(m);
    if (i >= 0) t.extra.splice(i, 1);
    send(t, m.body, draw, scroller);
  }

  function threadInfo(t) {
    ui.info(t.name, [
      ['주소', t.address],
      ['유형', t.type === 'cirrus' ? '시러스 메시지' : '시스템 문자'],
      ['보낸 기기', t.type === 'cirrus' ? '도현의 슬레이트' : '—'],
      ['안 읽음', String(unread(t))],
    ]);
  }

  function messageInfo(t, m) {
    ui.info('메시지 정보', [
      ['보낸 사람', m.dir === 'out' ? '나' : t.name],
      ['시각', m.day + ' ' + m.time],
      ['보낸 기기', m.dir === 'out' ? '도현의 폰' : (m.slate ? '도현의 슬레이트' : '—')],
      ['유형', t.type === 'cirrus' ? '시러스' : '시스템 문자'],
    ]);
  }

  LM.searchSources.push({ app: 'msg', items: () => THREADS.map((t) => ({ title: t.name, sub: preview(t), text: t.name + ' ' + messages(t).map((m) => m.body).join(' ') })) });
})();
