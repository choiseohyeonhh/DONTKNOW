/* 블링크 — 비밀 대화 1개, 기기 1대 로그인. 캐논: SECURE_MESSAGING_SPECIFICATION, SCR-BLINK-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const MSGS = [
    { dir: 'in', body: '오늘 8시 사무실. 안 오면 니 아빠 회사로 간다', day: '3/14', time: '18:40', eid: 'E-60' },
    { dir: 'in', body: '녹음했다고? 폰 내놔', day: '3/14', time: '21:30', eid: 'E-60' },
    { dir: 'in', body: '수요일 정오까지 돈 안 가져오면 니 아빠 회사 간다. 한빛물류 맞지?', day: '3/16', time: '21:00', onlineOnly: true, eid: 'E-60' },
  ];
  let extra = [];
  function opened() { const g = LM.G; if (!g.blink || typeof g.blink !== 'object') g.blink = { opened: false, expiry: {} }; return !!g.blink.opened; }
  function openSet(v) { const g = LM.G; if (!g.blink) g.blink = { opened: false, expiry: {} }; g.blink.opened = !!v; }
  function expiryMap() { const g = LM.G; if (!g.blink || typeof g.blink !== 'object') g.blink = { opened: false, expiry: {} }; if (!g.blink.expiry) g.blink.expiry = {}; return g.blink.expiry; }
  function expiredHas(id) { const e = expiryMap()[id]; return e != null && LM.G.gameMs >= e; }
  function arm(id) { const e = expiryMap(); if (e[id] == null) e[id] = LM.G.gameMs + 60000; return e[id]; }

  MSGS.forEach((m, i) => { m.id = 'blink:' + i; m.threadId = 'main'; });
  LM.register({ id: 'blink', render(app) { app.start((nav) => list(nav)); } });

  function runtime() {
    return LM.msg.list('blink', 'main').map((rt) => ({
      id: rt.id, dir: rt.from === 'out' ? 'out' : 'in', body: rt.text,
      day: LM.fmt.date(rt.at, 'md'), time: LM.fmt.date(rt.at, 'hm'), rt: true,
      eid: rt.eid || (rt.attach && rt.attach.eid) || null, attach: rt.attach || null,
    }));
  }
  function visible() {
    return MSGS.filter((m) => (!m.onlineOnly || LM.online()) && !expiredHas(m.id))
      .concat(extra.filter((m) => !expiredHas(m.id)), runtime().filter((m) => !expiredHas(m.id)));
  }
  function unread() { return LM.read.unreadCount('blink'); }
  function last() { const m = visible(); return m.length ? m[m.length - 1] : null; }

  LM.read.register('blink', () => visible().filter((m) => m.dir === 'in').map((m) => ({ id: m.id, threadId: 'main' })));

  function list(nav) {
    let filter = '전체';
    const holder = h('div');
    const draw = () => {
      if (filter === '그룹' || filter === '채널') { holder.replaceChildren(ui.empty({ icon: 'chat', title: '대화가 없습니다' })); return; }
      const m = last();
      holder.replaceChildren(ui.group({ plain: true, rows: [ui.row({
        title: h('span', { class: 'blink-titlewrap' }, LM.icon('lock', 'blink-lockic'), h('span', null, '실장K')),
        subtitle: unread() ? '비밀 대화 · 새 메시지' : '비밀 대화',
        meta: m ? LM.fmt.list(m.day + ' ' + m.time) : '—',
        lead: ui.avatar('실장K', 56),
        badge: unread() || null,
        onClick: () => openRoom(nav),
      })] }));
    };
    draw();
    const offRead = LM.on('read', () => { if (holder.isConnected) draw(); else offRead(); });
    const offMsg = LM.on('msg', () => { if (holder.isConnected) draw(); else offMsg(); });
    const page = ui.page({
      title: '블링크',
      right: h('button', { class: 'nb-btn', 'aria-label': '설정', onclick: () => nav.push(() => settings(nav)) }, LM.icon('gear')),
      body: [h('div', { class: 'blink-filter' }, ui.segmented(['전체', '비밀 대화', '그룹', '채널'], filter, (v) => { filter = v; draw(); })), holder],
    });
    return page;
  }

  function openRoom(nav) {
    const go = () => nav.push(() => room(nav));
    if (opened()) return go();
    ui.actionSheet({
      title: '비밀 대화 열기',
      text: '읽음은 즉시 전송됩니다.',
      actions: [{ label: '열기', onClick: () => { openSet(true); go(); } }],
    });
  }

  function room(nav) {
    let scroller = null;
    const log = h('div', { class: 'blink-room', role: 'log', 'aria-live': 'polite' });

    function draw() {
      const ms = visible();
      if (!ms.length) { log.replaceChildren(ui.empty({ icon: 'lock', title: '이 대화의 메시지는 사라졌습니다' })); return; }
      const kids = [];
      let day = null;
      const list = ms.slice().sort((a, b) => (a.day + ' ' + a.time).localeCompare(b.day + ' ' + b.time));
      list.forEach((m) => {
        if (m.day !== day) { day = m.day; kids.push(h('div', { class: 'blink-day' }, h('time', null, day))); }
        kids.push(line(m));
      });
      if (LM.dialogue && LM.dialogue.typing('blink', 'main')) {
        kids.push(h('div', { class: 'blink-line' }, h('div', { class: 'blink-bubble' }, h('span', { class: 'typing-dot' }, h('i'), h('i'), h('i')))));
      }
      log.replaceChildren(...kids);
    }

    function line(m) {
      const out = m.dir === 'out';
      const b = h('div', { class: 'blink-bubble' }, m.body,
        m.attach ? h('div', { class: 'att-card' }, LM.icon('doc'), h('div', null, h('b', null, m.attach.title || '첨부'), h('small', null, m.attach.kind || ''))) : null);
      if (m.eid) LM.C.see(m.eid);
      LM.longPress(b, () => ui.actionSheet({ actions: [
        { label: '복사', onClick: () => ui.toast('복사됨') },
        { label: '공유', onClick: () => ui.share({ eid: m.eid, eids: m.eid ? [m.eid] : [], title: m.body || (m.attach && m.attach.title), kind: m.attach ? m.attach.kind : 'message', app: 'blink' }) },
        { label: '정보', onClick: () => messageInfo(m) },
      ] }));
      const exp = expiryMap()[m.id];
      const remain = exp != null ? Math.max(0, Math.ceil((exp - LM.G.gameMs) / 1000)) : 60;
      const meta = h('div', { class: 'blink-meta' },
        out ? h('span', null, '보냄') : h('span', { class: 'blink-timer' }, LM.icon('timer'), remain + '초 뒤 삭제'),
        h('span', null, m.time));
      return h('div', { class: 'blink-line' + (out ? ' out' : '') }, b, meta);
    }

    const footer = LM.composer.bar({
      target: { app: 'blink', thread: 'main', npc: 'KS', name: '실장K' },
    });

    const body = h('div', null,
      h('div', { class: 'blink-banner', role: 'note' }, LM.icon('lock', 'blink-banner-ic'), h('span', null, '이 기기에만 저장 · 읽고 60초 뒤 삭제')),
      log);
    const page = ui.page({
      title: h('button', { class: 'blink-navtitle', onclick: () => profile() }, ui.avatar('실장K', 28), h('span', null, '실장K')),
      back: '블링크', nav, large: false, body, footer,
      right: h('button', { class: 'nb-btn', 'aria-label': '대화 정보', onclick: () => chatInfo() }, LM.icon('info')),
    });
    scroller = page.scroller;
    draw();
    setTimeout(() => { scroller.scrollTop = scroller.scrollHeight; }, 30);
    const offState = LM.on('state', () => {
      if (!log.isConnected) { offState(); return; }
      draw();
      setTimeout(() => { scroller.scrollTop = scroller.scrollHeight; }, 20);
    });
    const offMsg = LM.on('msg', (e) => {
      if (!log.isConnected) { offMsg(); return; }
      if (e.appId !== 'blink' || e.threadId !== 'main') return;
      if (e.message && e.message.from !== 'out') arm(e.message.id);
      LM.read.markThread('blink', 'main');
      draw();
    });
    // 읽음 이벤트: 이 방의 수신 메시지는 게임 시계 60초 뒤 양쪽에서 사라진다(저장·불러오기에도 남는다).
    visible().forEach((m) => {
      if (m.dir === 'in') { arm(m.id); m.threadId = 'main'; if (m.eid) LM.C.see(m.eid); }
    });
    const hadUnread = LM.read.unreadCount('blink') > 0;
    LM.read.markThread('blink', 'main');
    if (hadUnread && LM.online() && LM.trace) LM.trace('TR-06', { capture: false });
    LM.setEid('E-60');
    const offTyping = LM.on('dlg:typing', (e) => {
      if (!log.isConnected) { offTyping(); return; }
      if (e && e.app === 'blink') draw();
    });
    const timer = setInterval(() => {
      if (!log.isConnected) { clearInterval(timer); return; }
      let gone = false;
      visible().forEach((m) => { if (m.dir === 'in' && expiredHas(m.id)) gone = true; });
      if (gone) { LM.emit('read', { appId: 'blink', itemId: '-', expired: true }); draw(); }
      else draw();
    }, 1000);
    return page;
  }

  function profile() {
    ui.sheet(null, ui.sheetPage({
      title: '프로필',
      body: h('div', { class: 'blink-profile', data: { app: 'blink' } },
        h('div', { class: 'blink-photo', onclick: () => { LM.C.see('E-61'); LM.share.open({ eid: 'E-61', title: '실장K 프로필 사진', kind: 'photo', app: 'blink' }); } }, ui.photo('차 실내, 손목의 녹색 시계', { ratio: '4 / 5', alt: '차 실내, 손목의 녹색 시계' })),
        h('div', { class: 'blink-prof-name' }, '실장K'),
        h('div', { class: 'blink-prof-sub' }, 'dk와 비밀 대화'),
        ui.group({ rows: [h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '계정'), h('span', { class: 'kv-v' }, '실장K'))] })),
    }), { size: 'medium' });
  }

  function chatInfo() {
    ui.sheet(null, ui.sheetPage({
      title: '대화 정보',
      body: h('div', { data: { app: 'blink' } },
        ui.notice('이 대화는 이 기기에만 저장됩니다 · 읽으면 60초 뒤 양쪽에서 삭제됩니다'),
        ui.group({ rows: [
          kv('저장 위치', '이 기기에만'),
          kv('자동 삭제', '읽은 뒤 60초'),
          kv('읽음 시각', '—'),
          kv('보낸 기기', '실장K의 기기'),
          kv('내 기기', '도현의 폰'),
        ] })),
    }), { size: 'medium' });
  }

  function messageInfo(m) {
    ui.info('메시지 정보', [
      ['보낸 사람', m.dir === 'out' ? '나' : '실장K'],
      ['시각', m.day + ' ' + m.time],
      ['보낸 기기', m.dir === 'out' ? '도현의 폰' : '실장K의 기기'],
      ['삭제', '읽은 뒤 60초'],
      ['단서', m.eid || '—'],
    ]);
  }

  function settings(nav) {
    return ui.page({
      title: '설정', back: '블링크', nav, large: false, grouped: true,
      body: [
        ui.group({ rows: [ui.row({ title: '개인정보 및 보안', value: '이 기기 1대', onClick: () => nav.push(() => privacy(nav)) })] }),
        ui.group({ header: '보안', rows: [
          ui.row({ title: '스크린샷 알림', value: '켬' }),
          ui.row({ title: '자동 삭제 규칙', value: '읽은 뒤 60초' }),
        ] }),
      ],
    });
  }

  function privacy(nav) {
    return ui.page({
      title: '개인정보 및 보안', back: '설정', nav, large: false, grouped: true,
      body: [
        ui.group({ rows: [
          ui.row({ title: '활성 세션', value: '이 기기 1대', onClick: () => nav.push(() => sessions(nav)) }),
          ui.row({ title: '차단한 사용자', value: '0', onClick: () => nav.push(() => blocked(nav)) }),
        ] }),
        ui.group({ header: '스크린샷 알림', rows: [h('div', { class: 'blink-note' }, '스크린샷·화면 기록을 하면 상대에게 표시됩니다.')] }),
        ui.group({ header: '자동 삭제 규칙', rows: [ui.row({ title: '읽은 뒤 60초' })] }),
      ],
    });
  }

  function sessions(nav) {
    return ui.page({
      title: '활성 세션', back: '개인정보 및 보안', nav, large: false, grouped: true,
      body: [ui.group({
        rows: [ui.row({ title: '도현의 폰', subtitle: LM.online() ? '이 기기 · 지금 활동 중' : '이 기기 · 3월 15일', icon: 'devices' })],
        footer: '이 기기에서만 로그인되어 있습니다.',
      })],
    });
  }

  function blocked(nav) {
    return ui.page({
      title: '차단한 사용자', back: '개인정보 및 보안', nav, large: false,
      body: ui.empty({ icon: 'users', title: '차단한 사용자가 없습니다.' }),
    });
  }

  const kv = (k, v) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v));

  LM.searchSources.push({ app: 'blink', items: () => visible().map((m) => ({ title: '실장K', sub: m.body, text: '실장K ' + m.body })) });
})();
