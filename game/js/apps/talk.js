/* 톡 — 친구·채팅·더보기. 캐논: MESSAGING_SPECIFICATION 3절, SCREEN_SPECIFICATIONS 4절 SCR-TALK-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const ROOMS = [
    {
      id: 'dad', name: '아빠', avatar: '아빠', type: '1:1', npc: null,
      messages: [
        { dir: 'out', body: '오늘 좀 늦어 먼저 자', day: '3/14', time: '18:52', eid: 'E-20' },
        { dir: 'in', body: '도현아 어디냐', day: '3/15', time: '08:10', onlineOnly: true, unread: 1 },
        { dir: 'in', body: '경찰서 다녀왔다. 성인이라 가출로 본단다', day: '3/15', time: '22:40', onlineOnly: true, unread: 1 },
        { dir: 'in', body: '서아가 토요일 밤 10시까지 같이 있었다더라. 서아랑 있었으면 연락 좀 해라', day: '3/16', time: '14:05', onlineOnly: true, unread: 1 },
        { dir: 'in', body: '지훈이도 모른다더라', day: '3/16', time: '14:06', onlineOnly: true, unread: 1 },
        { dir: 'in', body: '폰 찾았다. 택시에 있었단다', day: '3/17', time: '17:30', onlineOnly: true, unread: 1 },
        { dir: 'in', body: '밥은 먹고 다니냐', day: '3/17', time: '19:02', onlineOnly: true, unread: 1 },
      ],
    },
    {
      id: 'group', name: '경영 26 새내기', avatar: '경', type: 'group', npc: null,
      messages: [
        { dir: 'in', sender: '지훈', body: '오늘 저녁 7시 학교 앞 ㄱ?', day: '3/14', time: '16:12', unread: 0 },
        { dir: 'in', sender: '지훈', body: '단톡 왜 안 봐', day: '3/14', time: '23:41', unread: 0 },
        { dir: 'in', body: '도현이 휴학한대?', day: '3/17', time: '22:30', unread: 1, onlineOnly: true, at: new Date(2026, 2, 17, 22, 30) }, // EV-41: 게임 중 새 글
      ],
    },
    {
      id: 'jihoon', name: '지훈', avatar: '지훈', type: '1:1', npc: 'JH',
      messages: [
        { dir: 'in', body: '내일 학식 ㄱ?', day: '3/10', time: '22:04', unread: 0 },
        { dir: 'in', body: '야 너 어디야 전화 좀 받아', day: '3/14', time: '23:58', unread: 1, eid: 'E-21' },
        { dir: 'out', body: '폰 잃어버림… 우리 아빠한테는 말하지 마', day: '3/15', time: '10:40', onlineOnly: true, fromSlate: true, eid: 'E-23' }, // 도현(슬레이트) → 지훈(E-23)
      ],
    },
    {
      id: 'seoa', name: '서아', avatar: '서아', type: '1:1', npc: 'SA',
      messages: [
        // 도현이 슬레이트에서 보냄(E-22). 3/14 밤엔 폰도 켜져 있어 오프라인 캐시에 있다
        { dir: 'out', body: '혹시 경찰이 물어보면 그날 나랑 저녁 먹었다고 해줘', day: '3/14', time: '22:31', fromSlate: true, eid: 'E-22' },
        { dir: 'out', body: '이유는 나중에 말할게', day: '3/14', time: '22:31', fromSlate: true },
        { dir: 'in', body: '알겠어. 근데 무슨 일인데?', day: '3/14', time: '22:52', unread: 0 },
      ],
    },
  ];
  ROOMS.forEach((r) => {
    r.extra = []; r.muted = false;
    r.messages.forEach((m, i) => { if (m.id == null) m.id = r.id + ':' + i; m.threadId = r.id; });
  });

  /* 캐논 '경영 26 새내기'는 배경 방(talk.biz26)으로 대체한다. EV-41만 그 방의 정적 메시지로 얹는다. */
  const groupIdx = ROOMS.findIndex((r) => r.id === 'group');
  if (groupIdx >= 0) ROOMS.splice(groupIdx, 1);

  function ambientRoom(r) {
    const messages = (r.history || []).map((m, i) => ({
      id: r.id + ':h' + i, dir: m.dir, sender: m.sender, body: m.body,
      day: m.day, time: m.time, at: new Date(m.at).getTime(), threadId: r.id, unread: 0,
    }));
    if (r.id === 'talk.biz26') {
      messages.push({
        id: 'group:EV41', dir: 'in', body: '도현이 휴학한대?', day: '3/17', time: '22:30',
        at: new Date(2026, 2, 17, 22, 30), onlineOnly: true, unread: 1, threadId: r.id,
      });
    }
    return {
      id: r.id, name: r.name, avatar: r.type === 'group' ? r.name.charAt(0) : r.name,
      type: r.type, npc: null, messages: messages, extra: [], muted: r.muted,
      ambient: true, count: r.count, members: r.members,
    };
  }
  const AMBIENT_ROOMS = (LM.ambient ? LM.ambient.ambientRooms() : []).map(ambientRoom);
  AMBIENT_ROOMS.forEach((r) => {
    r.messages.forEach((m) => { if (m.id == null) m.id = r.id + ':' + r.messages.indexOf(m); m.threadId = r.id; });
    ROOMS.push(r);
  });

  const SPECIAL_FRIEND = {
    'BG-001': { name: '아빠', room: 'dad', favorite: false },
    'BG-002': { name: '지훈', room: 'jihoon', favorite: true },
    'BG-028': { name: '서아', room: 'seoa', favorite: true },
  };
  function roomForPerson(id) {
    const sp = SPECIAL_FRIEND[id];
    if (sp) return sp.room;
    const r = AMBIENT_ROOMS.find((x) => x.type === '1:1' && (x.members || []).includes(id));
    return r ? r.id : null;
  }
  const FRIENDS = (LM.ambient ? LM.ambient.people.filter((p) => p.talkFriend) : []).map((p) => {
    const sp = SPECIAL_FRIEND[p.id];
    return {
      name: sp ? sp.name : p.name, favorite: sp ? !!sp.favorite : false,
      room: roomForPerson(p.id), personId: p.id,
    };
  });

  LM.register({ id: 'talk', render(app) {
    app.setTabs([
      { label: '친구', icon: 'user', build: (nav) => friends(nav) },
      { label: '채팅', icon: 'chat', badge: () => totalUnread(), build: (nav) => chats(nav) },
      { label: '더보기', icon: 'more', build: (nav) => more(nav) },
    ], 1);
  } });

  function atMs(m) {
    if (m.at instanceof Date) return m.at.getTime();
    if (typeof m.at === 'number') return m.at;
    const d = LM.fmt && LM.fmt.toDate ? LM.fmt.toDate((m.day || '') + ' ' + (m.time || '00:00')) : null;
    return d ? d.getTime() : 0;
  }
  function runtime(room) {
    return LM.msg.list('talk', room.id).map((rt) => ({
      id: rt.id, dir: rt.from === 'out' ? 'out' : 'in', body: rt.text,
      day: LM.fmt.date(rt.at, 'md'), time: LM.fmt.date(rt.at, 'hm'),
      attach: rt.attach || null, eid: rt.eid || (rt.attach && rt.attach.eid) || null,
      npc: rt.npc || null, rt: true,
    }));
  }
  function staticVisible(room) {
    return room.messages.filter((m) => LM.visible(m) && (!m.at || LM.now() >= m.at));
  }
  function visible(room) {
    return staticVisible(room).concat(room.extra, runtime(room)).sort((a, b) => atMs(a) - atMs(b));
  }
  function last(room) { const m = visible(room); return m.length ? m[m.length - 1] : null; }
  function roomUnread(room) {
    let n = visible(room).filter((m) => m.dir === 'in' && LM.read.isUnread('talk', m.id)).length;
    if (room.ambient) {
      /* 배경 잡담은 홈·탭 숫자에서는 빼지만(캐논 배지 실험 보호), 방 행에서는 안 읽음을 보여 준다. */
      const read = (LM.G && LM.G.read && LM.G.read.talk) || {};
      n += LM.msg.list('talk', room.id).filter((rt) => rt.from !== 'out' && rt.ambient && !read[rt.id]).length;
    }
    return n;
  }
  function markAmbientRead(room) {
    if (!room.ambient) return;
    LM.msg.list('talk', room.id).forEach((rt) => { if (rt.from !== 'out' && rt.ambient) LM.read.mark('talk', rt.id); });
  }
  function staticUnread(room) {
    return staticVisible(room).filter((m) => m.dir === 'in' && LM.read.isUnread('talk', m.id)).length;
  }
  /* 배경 방의 실시간 잡담은 방 행에만 세고, 홈·탭 숫자는 캐논 대화 기준을 유지한다.
   * (배경 잡담이 캐논의 읽음 배지 실험을 덮지 않게. 배경 방 자체의 안 읽음은 행에 보인다.) */
  function totalUnread() { return ROOMS.reduce((n, r) => n + (r.ambient ? staticUnread(r) : roomUnread(r)), 0); }

  LM.read.register('talk', () => {
    const out = [];
    ROOMS.forEach((r) => {
      staticVisible(r).forEach((m) => { if (m.dir === 'in' && m.unread > 0) out.push({ id: m.id, threadId: r.id }); });
      /* 배경 방의 실시간 잡담은 알림 센터·방 행에만 남기고, 홈 배지 계산에서는 뺀다.
       * 캐논 대화의 읽음 실험(AC-707)을 배경 잡담이 덮지 않게 한다. */
      LM.msg.list('talk', r.id).forEach((rt) => { if (rt.from !== 'out' && !(r.ambient && rt.ambient)) out.push({ id: rt.id, threadId: r.id }); });
    });
    return out;
  });

  function chats(nav) {
    const host = h('div');
    const draw = () => {
      host.replaceChildren(ui.group({ plain: true, rows: ROOMS.filter((r) => last(r)).map((r) => {
        const m = last(r);
        const n = roomUnread(r);
        const row = ui.row({
          title: r.name, subtitle: m ? (m.body || (m.attach && m.attach.title) || '첨부') : '메시지 없습니다', meta: m ? LM.fmt.list(m.day + ' ' + m.time) : '—',
          avatar: r.avatar, avatarSize: 56, badge: r.muted ? null : (n || null),
          accessory: r.muted && n ? h('span', { class: 'talk-mutedot', 'aria-label': '안 읽은 메시지 ' + n + '개' }) : null,
          class: 'talk-chatrow', onClick: () => nav.push(() => room(nav, r)),
        });
        r._titleEl = row.querySelector('.row-title');
        return row;
      }) }));
    };
    draw();
    const offRead = LM.on('read', () => { if (host.isConnected) draw(); else offRead(); });
    const offMsg = LM.on('msg', () => { if (host.isConnected) draw(); else offMsg(); });
    return ui.page({ title: '채팅', body: host });
  }

  function friends(nav) {
    const favs = FRIENDS.filter((f) => f.favorite);
    const rest = FRIENDS.filter((f) => !f.favorite);
    const row = (f) => ui.row({
      title: f.name, avatar: f.name, avatarSize: 40,
      onClick: () => { const r = ROOMS.find((x) => x.id === f.room); if (r) nav.push(() => room(nav, r, '친구')); else ui.toast('톡 대화가 없다'); },
    });
    return ui.page({
      title: '친구',
      body: [
        h('div', { class: 'talk-me' },
          ui.avatar('이도현', 56),
          h('div', null, h('div', { class: 'talk-me-name' }, '이도현'), h('div', { class: 'talk-me-sub' }, '상태 메시지 없음'))), // 상태 메시지 자리표시(캐논 없음)
        h('div', { class: 'talk-bday' }, '오늘 생일인 친구 없음'),
        ui.section('즐겨찾기'),
        ui.group({ plain: true, rows: favs.map(row) }),
        ui.section('친구'),
        ui.group({ plain: true, footer: '톡 프로필이 있는 친구만 표시된다.', rows: rest.map(row) }),
      ],
    });
  }

  function more(nav) {
    return ui.page({
      title: '더보기',
      body: [
        ui.group({ rows: [ui.row({ title: '이도현', subtitle: '상태 메시지 없음', avatar: '이도현', avatarSize: 58, class: 'talk-meprofile' })] }), // 상태 메시지 자리표시(캐논 없음)
        ui.group({ rows: [
          ui.row({ title: '톡 설정', icon: 'gear', onClick: () => nav.push(() => moreSettings(nav)) }),
          ui.row({ title: '도움말', icon: 'info', onClick: () => nav.push(() => ui.page({ title: '도움말', back: '더보기', nav, large: false, grouped: true, body: ui.empty({ icon: 'info', title: '도움말', text: '도움말은 준비 중이다.' }) })) }),
          ui.row({ title: '앱 정보', icon: 'doc', onClick: () => nav.push(() => ui.page({ title: '앱 정보', back: '더보기', nav, large: false, grouped: true, body: ui.group({ rows: [kv('이름', '톡')] }) })) }),
        ] }),
      ],
    });
  }

  function moreSettings(nav) {
    return ui.page({
      title: '톡 설정', back: '더보기', nav, large: false, grouped: true,
      body: [
        ui.group({ rows: [ui.row({ title: '알림', toggle: { on: true } })] }),
        ui.group({ rows: [ui.row({ title: '차단한 친구', value: '0' })] }),
      ],
    });
  }

  const kv = (k, v) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v));
  const toMin = (t) => { const [a, b] = t.split(':').map(Number); return a * 60 + b; };

  function line(r, m, ghost, i) {
    const out = m.dir === 'out';
    const b = h('div', { class: 'talk-bubble' }, m.body,
      m.attach ? h('div', { class: 'att-card' }, LM.icon('doc'), h('div', null, h('b', null, m.attach.title || '첨부'), h('small', null, m.attach.kind || ''))) : null);
    if (m.eid) LM.C.see(m.eid);
    LM.longPress(b, () => ui.actionSheet({ actions: [
      { label: '답장', onClick: () => ui.toast('답장은 입력창에서 한다') },
      { label: '복사', onClick: () => ui.toast('복사됨') },
      { label: '공유', onClick: () => ui.share({ eid: m.eid, eids: m.eid ? [m.eid] : [], title: m.body || (m.attach && m.attach.title), kind: m.attach ? m.attach.kind : 'message', app: 'talk' }) },
      { label: '정보', onClick: () => ui.info('메시지 정보', [['보낸 사람', out ? '나' : r.name], ['시각', m.day + ' ' + m.time], ['보낸 기기', m.fromSlate ? '도현의 슬레이트' : '도현의 폰'], ['단서', m.eid || '—']]) },
    ] }));
    const unread = (m.dir === 'in' && LM.read.isUnread('talk', m.id)) || !!m.outUnread;
    const side = h('div', { class: 'talk-side' },
      unread ? h('span', { class: 'talk-unread', 'aria-label': '안 읽은 메시지 1개' }, '1') : null,
      h('span', null, m.time),
      m.fromSlate ? h('span', { class: 'talk-slate' }, '슬레이트에서') : null);
    const bodyCol = h('div', { class: 'talk-body' },
      m.dir === 'in' && !ghost && r.type === 'group' && m.sender ? h('div', { class: 'talk-name' }, m.sender) : null,
      h('div', { class: 'talk-row' + (out ? ' out' : '') }, out ? side : null, b, out ? null : side));
    return h('div', { class: 'talk-line' + (out ? ' out' : ''), data: { mid: r.id + '-' + i } },
      h('div', { class: 'talk-av' + (out || ghost ? ' ghost' : '') }, ui.avatar(r.avatar, 32)),
      bodyCol);
  }

  function room(nav, r, backLabel) {
    let scroller = null;
    const log = h('div', { class: 'talk-room', role: 'log', 'aria-live': 'polite' });

    function draw() {
      const ms = visible(r);
      const kids = [];
      let day = null, prev = null;
      ms.forEach((m, i) => {
        if (m.day !== day) {
          day = m.day; prev = null;
          kids.push(h('div', { class: 'talk-day' }, h('time', null, day)));
        }
        const ghost = prev && prev.dir === m.dir && prev.dir === 'in' && prev.day === m.day && (toMin(m.time) - toMin(prev.time)) <= 10;
        kids.push(line(r, m, ghost, i));
        if (m.dir === 'in') prev = m;
        else prev = null;
      });
      if (!ms.length) kids.push(ui.empty({ icon: 'chat', title: '메시지가 없습니다' }));
      if (LM.dialogue && LM.dialogue.typing('talk', r.id)) {
        kids.push(h('div', { class: 'talk-line' },
          h('div', { class: 'talk-av' }, ui.avatar(r.avatar, 32)),
          h('div', { class: 'talk-body' }, h('div', { class: 'talk-row' }, h('div', { class: 'talk-bubble' }, h('span', { class: 'typing-dot' }, h('i'), h('i'), h('i')))))));
      }
      if (!LM.online()) kids.push(h('div', { class: 'talk-pending' }, '오프라인 · 읽음과 발신은 다음 온라인 때 전송된다'));
      log.replaceChildren(...kids);
    }

    const footer = composer(r, () => {
      if (!LM.online()) { ui.toast('오프라인 상태입니다 · 온라인이 필요합니다'); return false; }
      return true;
    }, (text) => {
      LM.msg.add('talk', r.id, { from: 'out', text: text, at: LM.G.gameMs, silent: true });
      setTimeout(() => { if (scroller) scroller.scrollTop = scroller.scrollHeight; }, 20);
    });

    const page = ui.page({
      title: r.name, back: backLabel || '채팅', nav, large: false, body: log, footer,
      right: [
        h('button', { class: 'nb-btn', 'aria-label': '검색', onclick: () => nav.push(() => searchRoom(nav, r)) }, LM.icon('search')),
        h('button', { class: 'nb-btn', 'aria-label': '서랍', onclick: () => drawer(r) }, LM.icon('list')),
        h('button', { class: 'nb-btn', 'aria-label': '대화방 설정', onclick: () => nav.push(() => roomSettings(nav, r)) }, LM.icon('gear')),
      ],
    });
    r._page = page;
    scroller = page.scroller;
    draw();
    setTimeout(() => { scroller.scrollTop = scroller.scrollHeight; }, 30);
    // 방을 여는 순간 읽음. 각 "1"은 160ms 페이드로 사라지고 목록·탭·홈 배지도 같은 상태에서 다시 계산된다.
    const offRead = LM.on('read', (e) => {
      if (!log.isConnected) { offRead(); return; }
      if (e && e.appId && e.appId !== 'talk') return;
      const badges = log.querySelectorAll('.talk-unread');
      if (badges.length) {
        badges.forEach((x) => x.classList.add('fading'));
        setTimeout(() => { if (log.isConnected) draw(); }, 170);
      } else draw();
    });
    const offMsg = LM.on('msg', (e) => {
      if (!log.isConnected) { offMsg(); return; }
      if (e.appId !== 'talk' || e.threadId !== r.id) return;
      LM.read.markThread('talk', r.id);
      draw();
      setTimeout(() => { if (scroller) scroller.scrollTop = scroller.scrollHeight; }, 20);
    });
    const offState = LM.on('state', () => {
      if (!log.isConnected) { offState(); return; }
      draw();
      setTimeout(() => { scroller.scrollTop = scroller.scrollHeight; }, 20);
    });
    const hadUnread = roomUnread(r) > 0;
    LM.read.markThread('talk', r.id);
    markAmbientRead(r);
    if (hadUnread && !r.ambient && LM.online() && LM.trace) LM.trace('TR-02', { kind: r.id === 'dad' ? 'dad' : 'other', npc: r.npc, thread: r.id });
    visible(r).forEach((m) => LM.C.see(m.eid));
    const lastEidMsg = visible(r).slice().reverse().find((m) => m.eid);
    LM.setEid(lastEidMsg ? lastEidMsg.eid : null);
    const offTyping = LM.on('dlg:typing', (e) => {
      if (!log.isConnected) { offTyping(); return; }
      if (e && e.app === 'talk' && e.thread === r.id) draw();
    });
    return page;
  }

  function composer(r, precheck, onSend) {
    return LM.composer.bar({
      target: { app: 'talk', thread: r.id, npc: r.npc, name: r.name },
      placeholder: r.muted ? '알림 꺼짐 · 메시지 입력' : '메시지 입력',
    });
  }

  function drawer(r) {
    let tab = '사진·동영상';
    const body = h('div');
    const draw = () => body.replaceChildren(
      ui.segmented(['사진·동영상', '파일', '링크'], tab, (v) => { tab = v; draw(); }),
      ui.empty({ icon: 'photo', title: tab + '이 없습니다', text: '이 대화에는 첨부가 없다.' }));
    draw();
    ui.sheet(null, ui.sheetPage({ title: '대화방 서랍', body }), { size: 'large' });
  }

  function searchRoom(nav, r) {
    const res = h('div');
    const run = (q) => {
      res.replaceChildren();
      const nq = String(q || '').trim();
      const list = visible(r).filter((m) => !nq || m.body.includes(nq));
      if (!nq) { res.appendChild(ui.empty({ icon: 'search', title: '대화 검색', text: '메시지 본문을 검색한다.' })); return; }
      if (!list.length) { res.appendChild(ui.empty({ icon: 'search', title: '결과 없음' })); return; }
      res.appendChild(ui.group({ plain: true, rows: list.map((m) => {
        const idx = visible(r).indexOf(m);
        return ui.row({ title: m.body, subtitle: m.day + ' ' + m.time, onClick: () => {
          nav.pop();
          setTimeout(() => {
            const el = document.querySelector('.appwin[data-app="talk"] [data-mid="' + r.id + '-' + idx + '"]');
            if (el) el.scrollIntoView({ block: 'center' });
          }, 420);
        } });
      }) }));
    };
    run('');
    return ui.page({ title: '검색', back: r.name, nav, large: false, search: '대화 검색', onSearch: run, body: res });
  }

  function roomSettings(nav, r) {
    return ui.page({
      title: '대화방 설정', back: r.name, nav, large: false, grouped: true,
      body: [
        r.type === 'group' ? ui.group({ rows: [ui.row({ title: '참여자', value: (r.count || (r.members || []).length || 0) + '명' })] }) : null,
        ui.group({ rows: [ui.row({ title: '알림 끄기', toggle: { on: r.muted, onChange: (v) => {
          r.muted = v;
          if (r.ambient && LM.G) { LM.G.ambient = LM.G.ambient || {}; LM.G.ambient.muted = LM.G.ambient.muted || {}; LM.G.ambient.muted[r.id] = v; }
          ui.toast(v ? '이 방의 알림을 껐다' : '이 방의 알림을 켰다');
        } } })] }),
        ui.group({ rows: [ui.row({ title: '방 이름', value: r.name, onClick: () => rename(r) })] }),
      ],
    });
  }

  function rename(r) {
    const inp = h('input', { class: 'talk-name-input', type: 'text', value: r.name, maxlength: 20, 'aria-label': '방 이름' });
    ui.sheet(null, ui.sheetPage({
      title: '방 이름', cancel: '취소', done: '저장',
      onDone: () => {
        const v = inp.value.trim();
        if (!v) return;
        r.name = v;
        if (r._page) { const t = r._page.querySelector('.nb-title'); if (t) t.textContent = v; }
        if (r._titleEl) r._titleEl.textContent = v;
        ui.toast('방 이름을 바꿨다');
      },
      body: h('div', { class: 'talk-sheetscope', data: { app: 'talk' } }, h('div', { class: 'grp' }, h('div', { class: 'grp-b' }, h('div', { class: 'talk-namewrap' }, inp)))),
    }), { size: 'small' });
  }

  /* 엔딩 등 다른 화면이 톡의 실제 방 렌더러·CSS를 그대로 재사용할 수 있게 내보낸다. */
  LM.talkPreview = function (o) {
    o = o || {};
    const r = { id: o.threadId || 'preview', name: o.name || '아빠', avatar: o.avatar || o.name || '아빠', type: '1:1', muted: false, npc: null };
    const log = h('div', { class: 'talk-room', role: 'log' });
    (o.messages || []).forEach((m, i) => {
      const msg = Object.assign({ id: 'preview:' + i, dir: 'in', day: '', time: '' }, m);
      if (m.day) log.appendChild(h('div', { class: 'talk-day' }, h('time', null, m.day)));
      log.appendChild(line(r, msg, false, i));
    });
    return log;
  };

  LM.searchSources.push({ app: 'talk', items: () => ROOMS.flatMap((r) => visible(r).map((m) => ({ title: r.name, sub: m.body, text: r.name + ' ' + m.body }))) });
})();
