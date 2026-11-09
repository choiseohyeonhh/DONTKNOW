/* 메시지 — 시스템 문자와 시러스(슬레이트) 대화. 캐논: MESSAGING_SPECIFICATION 2절, SCR-MSG-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const EV06 = '이 폰 가지고 있는 사람. 30분 안에 대답 없으면 원격으로 지웁니다.';
  const HANKYUL = (() => {
    const out = [];
    let y = 2024, m = 8;
    for (let i = 0; i < 19; i++) {
      out.push({
        dir: 'in',
        body: '[한결캐피탈] 입금 확인 (입금자 이도*)',
        day: y + '.' + String(m).padStart(2, '0') + '.05', // 날짜 자리표시(캐논은 2024.08~2026.02 범위만)
        time: '09:00', // 시각 자리표시(캐논 없음)
        origin: '한결캐피탈',
        addr: '1600-XXXX',
      });
      m++; if (m > 12) { m = 1; y++; }
    }
    return out;
  })();

  const THREADS = [
    {
      id: 'ontong', type: 'system', name: '온통신', address: '온통신', icon: 'signal', unread: 1,
      messages: [{ dir: 'in', body: '[온통신] 분실 정지 신청이 접수되었습니다. 이 기기에서는 통화와 문자가 되지 않습니다.', day: '3/15', time: '09:10', origin: '온통신' }],
    },
    {
      id: 'police', type: 'system', name: '성원경찰서', address: '성원경찰서 수사과', icon: 'shield', unread: 1,
      messages: [{ dir: 'in', body: '[성원경찰서] 이도현님, 수사과 금융범죄수사팀 김태윤 경위입니다. 3/20 10:00 출석요구 안내드립니다.', day: '3/13', time: '10:02', origin: '성원경찰서' }],
    },
    {
      id: 'bank', type: 'system', name: '누리은행', address: '누리은행', icon: 'card', unread: 1,
      messages: [{ dir: 'in', body: '[누리은행] 전기통신금융사기 관련 지급정지 안내', day: '3/12', time: '09:14', origin: '누리은행' }],
    },
    {
      id: 'hankyul', type: 'system', name: '한결캐피탈', address: '1600-XXXX', icon: 'receipt', unread: 1,
      messages: HANKYUL,
    },
    {
      id: 'cirrus', type: 'cirrus', name: '도현의 슬레이트', address: 'dohyun.lee0921@cirrus.kr', unread: 0,
      messages: [],
    },
  ];

  THREADS.forEach((t) => { t.extra = []; });

  LM.register({ id: 'msg', render(app) { app.start((nav) => list(nav)); } });

  function baseMessages(t) {
    if (t.id !== 'cirrus') return t.messages;
    if (!LM.online()) return [];
    const n = LM.now();
    return [{ dir: 'in', body: EV06, day: (n.getMonth() + 1) + '/' + n.getDate(), time: LM.fmtTime(n), origin: '도현의 슬레이트', slate: true }];
  }
  function messages(t) { return baseMessages(t).concat(t.extra); }
  function unread(t) {
    if (t.id === 'cirrus') return LM.online() ? 1 : 0;
    return t.unread;
  }
  function last(t) {
    const m = messages(t);
    return m.length ? m[m.length - 1] : null;
  }
  function listTime(m) { return m.day.length > 7 ? m.day.slice(0, 7) : m.day + ' ' + m.time; }
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
    return ui.page({
      title: '메시지',
      right: h('button', { class: 'nb-btn', 'aria-label': '새 메시지', onclick: () => ui.toast(LM.online() ? '새 메시지는 온라인에서 동기화된다' : '오프라인 상태입니다') }, LM.icon('compose')),
      body: ui.group({ plain: true, rows: THREADS.map((t) => listRow(nav, t)) }),
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
      if (!ms.length) kids.push(ui.empty({ icon: 'chat', title: '메시지 없음', text: t.id === 'cirrus' ? '첫 온라인 후 슬레이트에서 온 메시지가 동기화된다.' : null }));
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
    const off = LM.on('state', () => {
      if (!log.isConnected) { off(); return; }
      draw();
      setTimeout(() => { scroller.scrollTop = scroller.scrollHeight; }, 20);
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
    const b = h('div', { class: 'msg-bubble' }, m.body);
    LM.longPress(b, () => ui.actionSheet({
      actions: [
        { label: '복사', onClick: () => ui.toast('복사됨') },
        { label: '공유', onClick: () => ui.share(m.body) },
        { label: '정보', onClick: () => messageInfo(t, m) },
      ],
    }));
    return h('div', { class: 'msg-line' + (out ? ' out' : '') + (m.fail ? ' failed' : '') },
      !out && m.slate ? h('div', { class: 'msg-sender' }, '도현의 슬레이트') : null,
      b, meta);
  }

  function composer(t, onSend) {
    const inp = h('input', { class: 'msg-inp', type: 'text', placeholder: t.type === 'system' ? '답장할 수 없는 번호' : '메시지 입력', 'aria-label': '메시지 입력' });
    const go = () => onSend(inp.value);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    return h('div', { class: 'msg-composer' },
      h('button', { class: 'msg-plus', 'aria-label': '첨부', onclick: () => ui.actionSheet({ actions: [
        { label: '사진', onClick: () => ui.toast('프로토타입: 사진 첨부는 보내지 않는다') },
        { label: '파일', onClick: () => ui.toast('프로토타입: 파일 첨부는 보내지 않는다') },
      ] }) }, LM.icon('plus')),
      inp,
      h('button', { class: 'msg-send', 'aria-label': '보내기', onclick: go }, LM.icon('send')));
  }

  function send(t, text, draw, scroller) {
    if (!text.trim()) return;
    const n = LM.now();
    const day = (n.getMonth() + 1) + '/' + n.getDate();
    const time = LM.fmtTime(n);
    let fail = null;
    if (t.type === 'system') fail = '서비스 없음';
    else if (!LM.online()) fail = '온라인이 필요합니다';
    const m = { dir: 'out', body: text, day, time, fail: !!fail, reason: fail };
    t.extra.push(m);
    draw();
    if (!fail) {
      const inp = document.querySelector('.appwin[data-app="msg"] .msg-inp');
      if (inp) inp.value = '';
    }
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
