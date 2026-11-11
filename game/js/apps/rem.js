/* 미리 알림 — "3/20 준비" → 온라인 후 "3/18".
 * 설계: design/03-features/PERSONAL_DATA_APPS_SPECIFICATION.md 3절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-REM-*, EVIDENCE_LEDGER E-214·E-214b */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const lists = [{
    id: 'l-320',
    nameOffline: '3/20 준비',
    nameOnline: '3/18',
    changedAt: '3/16 23:12',
    created: '3/14 18:30',
    items: [
      { id: 'i1', text: '캡처 정리', checked: true, checkedAt: '3/14 18:30' },
      { id: 'i2', text: '녹음 백업', checked: false },
      { id: 'i3', text: '실장 이름', checked: false },
      { id: 'i4', text: '아빠한테 말하기', checked: false },
      { id: 'i5', text: '9시 메일 예약', checked: true, checkedAt: '3/16 23:12', online: true, origin: '슬레이트' },
      { id: 'i6', text: '해담 연장 3/21', checked: false, online: true, origin: '슬레이트' },
    ],
  }];

  let hideDone = false;
  let activeOff = null;

  LM.register({
    id: 'rem',
    render(app) { app.start((nav) => listsPage(nav)); },
    onClose() { if (activeOff) { activeOff(); activeOff = null; } },
  });

  const listName = (l) => (LM.online() ? l.nameOnline : l.nameOffline);
  const visible = (l) => l.items.filter((i) => !i.online || LM.online());
  const openCount = (l) => visible(l).filter((i) => !i.checked).length;

  function listsPage(nav) {
    const body = h('div');
    const draw = () => {
      body.replaceChildren(ui.group({
        rows: lists.map((l) => {
          const v = visible(l);
          const sub = LM.online()
            ? '이름 변경 ' + l.changedAt + ' · 미완료 ' + openCount(l) + '개'
            : v.length + '개 항목 · 미완료 ' + openCount(l) + '개';
          return ui.row({
            title: listName(l),
            subtitle: sub,
            value: String(openCount(l)),
            lead: h('span', { class: 'rem-list-ic' }, LM.icon('list')),
            onClick: () => nav.push(() => listPage(nav, l)),
          });
        }),
        footer: LM.online() ? null : '슬레이트에서 바뀐 내용은 온라인이 되면 동기화된다.',
      }));
    };
    draw();
    activeOff = LM.on('state', draw);
    return ui.page({ title: '미리 알림', body });
  }

  function listPage(nav, l) {
    const body = h('div');
    const draw = () => {
      const v = visible(l);
      const todo = v.filter((i) => !i.checked);
      const done = v.filter((i) => i.checked);
      const parts = [];
      if (todo.length) parts.push(ui.group({ header: '미완료 · ' + todo.length, rows: todo.map((i) => itemRow(i, draw)) }));
      if (done.length && !hideDone) parts.push(ui.group({ header: '완료 · ' + done.length, rows: done.map((i) => itemRow(i, draw)) }));
      if (!v.length) parts.push(ui.empty({ icon: 'check', title: '항목이 없습니다.' }));
      parts.unshift(h('div', { class: 'rem-meta' }, '3/14 18:30 만듦' + (LM.online() ? ' · 3/16 23:12 이름 변경' : ' · 슬레이트와 동기화')));
      parts.push(ui.notice(LM.online()
        ? '체크하면 슬레이트에도 함께 표시된다.'
        : '오프라인 상태입니다. 체크는 다음 연결 때 동기화된다.', LM.online() ? '' : 'warn'));
      body.replaceChildren(...parts);
    };
    draw();
    const more = h('button', { class: 'nb-btn', 'aria-label': '더 보기', onclick: () => ui.actionSheet({
      title: listName(l),
      actions: [
        { label: hideDone ? '완료 항목 보기' : '완료 항목 숨기기', onClick: () => { hideDone = !hideDone; draw(); } },
        { label: '목록 이름 변경 기록', onClick: () => ui.info('목록 이름', [['원래 이름', '3/20 준비'], ['바뀐 이름', l.nameOnline], ['바뀐 시각', l.changedAt + ' · 슬레이트에서']]) },
      ],
    }) }, LM.icon('more'));
    return ui.page({ title: listName(l), back: '미리 알림', nav, right: more, body });
  }

  function itemRow(item, redraw) {
    const sub = item.checked
      ? (item.checkedAt || '') + (item.origin ? ' · ' + item.origin + '에서 체크됨' : '')
      : (item.origin ? item.origin + '에서 추가됨' : null);
    return h('button', {
      class: 'rem-row' + (item.checked ? ' done' : ''),
      role: 'checkbox',
      'aria-checked': item.checked,
      'aria-label': item.text + (item.checked ? ', 완료' : ', 미완료'),
      onclick: () => { item.checked = !item.checked; if (item.checked && !item.checkedAt) item.checkedAt = ''; redraw(); },
    },
    h('span', { class: 'rem-check' + (item.checked ? ' on' : '') }, item.checked ? LM.icon('check') : null),
    h('span', { class: 'rem-txt' },
      h('span', { class: 'rem-name' }, item.text),
      sub ? h('span', { class: 'rem-sub' }, sub) : null));
  }

  LM.searchSources.push({
    app: 'rem',
    items: () => lists.flatMap((l) => visible(l).map((i) => ({
      title: i.text,
      sub: listName(l) + (i.checked ? ' · 완료' : ''),
      text: i.text + ' ' + listName(l),
    }))),
  });
})();
