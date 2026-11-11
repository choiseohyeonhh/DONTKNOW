/* 전화 — 최근 기록·키패드·통화 상세. 캐논: MESSAGING_SPECIFICATION 1절, SCREEN_SPECIFICATIONS_APPS SCR-PHONE-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const CALLS = [
    // 3/14 21:30~23:58 부재중 다수는 한 묶음으로 접고 첫·마지막 시각만 보여 준다(Q-OPEN-116).
    { id: 'c5', direction: 'missed', name: '서아', number: '010-XXXX-0000', start: '3/14 21:30~23:58', duration: '—', grouped: true }, // 번호 자리표시(캐논 없음)
    { id: 'c4', direction: 'missed', name: '지훈', number: '010-XXXX-2290', start: '3/14 21:30~23:58', duration: '—', grouped: true },
    { id: 'c3', direction: 'missed', name: '아빠', number: '010-XXXX-0403', start: '3/14 21:30~23:58', duration: '—', grouped: true },
    { id: 'c2', direction: 'missed', name: '아빠', number: '010-XXXX-0403', start: '3/14 18:41', duration: '—' },
    { id: 'c1', direction: 'out', name: '누리은행 고객센터', number: '1588-XXXX', start: '3/11 10:30', duration: '14분 12초' },
  ];

  const DIR = { out: '발신', in: '수신', missed: '부재중' };

  LM.register({ id: 'phone', render(app) {
    app.setTabs([
      { label: '최근 기록', icon: 'clock', build: (nav) => recents(nav) },
      { label: '키패드', icon: 'keypad', build: (nav) => keypad(nav) },
    ], 0);
  } });

  function dirIcon(c) {
    return h('span', { class: 'phone-dir' + (c.direction === 'missed' ? ' miss' : '') + (c.direction === 'out' ? '' : ' flip'), 'aria-hidden': true }, LM.icon('phone-out'));
  }

  function callRow(nav, c) {
    const missed = c.direction === 'missed';
    return ui.row({
      title: c.name,
      subtitle: DIR[c.direction] + (c.grouped ? ' · 묶음' : ''),
      meta: LM.fmt.list(c.start),
      value: c.duration !== '—' ? c.duration : null,
      lead: dirIcon(c),
      class: missed ? 'phone-missed' : '',
      onClick: () => nav.push(() => detail(nav, c)),
      onLong: () => ui.actionSheet({
        title: c.name + ' · ' + c.start,
        actions: [
          { label: '정보', onClick: () => info(c) },
          { label: '번호 복사', onClick: () => ui.toast('번호를 복사했다') },
        ],
      }),
    });
  }

  function recents(nav) {
    return ui.page({
      title: '최근 기록',
      body: ui.group({ plain: true, rows: CALLS.map((c) => callRow(nav, c)) }),
    });
  }

  function info(c) {
    ui.info('통화 정보', [
      ['상대', c.name],
      ['번호', c.number || '없음'],
      ['방향', DIR[c.direction]],
      ['시작', c.start],
      ['통화 시간', c.duration],
      ['기기', '도현의 폰'],
    ]);
  }

  function detail(nav, c) {
    const body = h('div', null,
      h('div', { class: 'phone-hero' },
        ui.avatar(c.name, 56),
        h('div', { class: 'phone-hero-name' }, c.name),
        h('div', { class: 'phone-hero-sub' }, DIR[c.direction] + ' · ' + c.start)),
      ui.group({ rows: [
        kv('방향', DIR[c.direction]),
        kv('시작', c.start),
        kv('통화 시간', c.duration),
        kv('기기', '도현의 폰'),
      ] }),
      ui.group({ rows: [
        ui.row({ title: '번호 복사', icon: 'copy', action: true, onClick: () => ui.toast('번호를 복사했다') }),
        ui.row({ title: '정보', icon: 'info', action: true, onClick: () => info(c) }),
      ] }),
      h('div', { class: 'phone-detail-actions' },
        h('button', { class: 'phone-big-call', 'aria-label': '통화', onclick: noService }, LM.icon('phone-out'))));
    return ui.page({
      title: '통화 상세', back: '최근 기록', nav, large: false, grouped: true,
      body,
      right: h('button', { class: 'nb-btn', 'aria-label': '정보', onclick: () => info(c) }, LM.icon('info')),
    });
  }

  const kv = (k, v) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v));

  function noService() {
    ui.sheet(null, ui.sheetPage({
      title: '서비스 없음',
      body: ui.empty({ icon: 'alert', title: '전화를 걸 수 없습니다', text: '이 기기에서는 전화와 문자를 쓸 수 없습니다.' }),
    }), { size: 'small' });
  }

  function keypad(nav) {
    let entered = '';
    const num = h('div', { class: 'phone-num' });
    const del = h('button', { class: 'phone-del', 'aria-label': '지우기', onclick: () => { entered = entered.slice(0, -1); draw(); } }, LM.icon('backspace'));
    const numRow = h('div', { class: 'phone-numrow' }, num, del);
    const pad = h('div', { class: 'phone-pad', role: 'group', 'aria-label': '숫자 키패드' });
    const keys = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', ''], ['0', '+'], ['#', '']];

    function draw() {
      num.textContent = entered || '';
      num.classList.toggle('empty', !entered);
      del.hidden = !entered;
    }

    keys.forEach(([k, sub]) => {
      const b = h('button', { class: 'phone-key', 'aria-label': k }, h('b', null, k), sub ? h('small', null, sub) : null);
      b.addEventListener('click', () => { entered += k; draw(); });
      if (k === '0') LM.longPress(b, () => { entered += '+'; draw(); });
      pad.appendChild(b);
    });

    draw();
    const body = h('div', { class: 'phone-padwrap' },
      numRow,
      pad,
      h('div', { class: 'phone-callwrap' },
        h('button', { class: 'phone-big-call', 'aria-label': '통화', onclick: noService }, LM.icon('phone-out'))));
    return ui.page({ title: '키패드', large: false, body, class: 'phone-keypad-page' });
  }

  LM.searchSources.push({ app: 'phone', items: () => CALLS.map((c) => ({ title: c.name, sub: DIR[c.direction] + ' · ' + c.start, text: c.name + ' ' + c.number + ' ' + DIR[c.direction] })) });
})();
