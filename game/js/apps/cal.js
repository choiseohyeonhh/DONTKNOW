/* 캘린더 — 날짜의 출처. 월 보기 → 일 보기 → 일정 상세.
 * 설계: design/03-features/PERSONAL_DATA_APPS_SPECIFICATION.md 1절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-CAL-*, EVIDENCE_LEDGER E-17~E-19·E-211·E-212 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;
  const WD = ['일', '월', '화', '수', '목', '금', '토'];
  const TODAY = { y: 2026, m: 3, d: 17 };

  /* 고정 일정. GJ 반복은 1/9~3/6 화·금(3/10 이후 삭제). */
  const EVENTS = [
    { y: 2026, m: 3, d: 1, time: '14:00', title: '고시원 계약', place: '청운고시원', calendar: '기본', memo: '3/16 입실 예정', ev: 'E-18' },
    { y: 2026, m: 3, d: 16, time: '', title: '입실', place: '청운고시원', calendar: '기본', memo: '지난 일정', ev: 'E-13' },
    { y: 2026, m: 3, d: 20, time: '10:00', title: '성원서', place: '성원경찰서 수사과', calendar: '기본', memo: '출석요구', ev: 'E-19' },
    { y: 2026, m: 4, d: 3, time: '', title: '아빠 생일 (58번째)', calendar: '생일', birthday: true, repeat: '매년', ev: 'E-211' },
    { y: 2026, m: 11, d: 2, time: '', title: '엄마', calendar: '기본', repeat: '매년', memo: '매년 11월 2일', ev: 'E-17' },
  ];
  (function addGj() {
    const end = new Date(2026, 2, 6);
    for (let t = new Date(2026, 0, 9); t <= end; t.setDate(t.getDate() + 1)) {
      const w = t.getDay();
      if (w !== 2 && w !== 5) continue;
      const first = t.getMonth() === 0 && t.getDate() === 9;
      EVENTS.push({
        y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate(), time: '12:30',
        title: first ? 'GJ 첫날' : 'GJ', calendar: '기본', repeat: '매주 화·금 · 1/9~3/6',
        memo: first ? 'GJ 첫날' : null, gj: true, ev: 'E-39',
      });
    }
  })();

  let view = { y: 2026, m: 3 };
  let root = null;

  LM.register({
    id: 'cal',
    render(app) { root = app.root; view = { y: 2026, m: 3 }; app.start((nav) => monthPage(nav)); },
  });

  const eventsOn = (y, m, d) => EVENTS.filter((e) => e.y === y && e.m === m && e.d === d);
  const isPast = (e) => e.y < TODAY.y || (e.y === TODAY.y && (e.m < TODAY.m || (e.m === TODAY.m && e.d < TODAY.d)));
  const pad = (n) => String(n).padStart(2, '0');
  const dayLabel = (e) => {
    const dt = new Date(e.y, e.m - 1, e.d);
    return (e.m) + '월 ' + e.d + '일 ' + WD[dt.getDay()] + '요일';
  };
  const kv = (k, v) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v));

  function monthPage(nav) {
    const wrap = h('div', { class: 'cal-wrap' });
    const page = ui.page({
      title: '캘린더',
      large: false,
      left: h('button', { class: 'nb-btn cal-today', onclick: () => { view = { y: 2026, m: 3 }; draw(); } }, '오늘'),
      right: h('button', { class: 'nb-btn cal-cals', 'aria-label': '캘린더 목록', onclick: () => calendarsSheet() }, LM.icon('list')),
      body: wrap,
    });
    const draw = () => {
      const first = new Date(view.y, view.m - 1, 1).getDay();
      const days = new Date(view.y, view.m, 0).getDate();
      const cells = [];
      for (let i = 0; i < first; i++) cells.push(h('span', { class: 'cal-cell blank' }));
      for (let d = 1; d <= days; d++) {
        const evs = eventsOn(view.y, view.m, d);
        const today = view.y === TODAY.y && view.m === TODAY.m && d === TODAY.d;
        const label = view.m + '월 ' + d + '일 ' + WD[new Date(view.y, view.m - 1, d).getDay()] + '요일' + (evs.length ? ', 일정 ' + evs.length + '개' : '') + (isPast({ y: view.y, m: view.m, d }) ? ', 지남' : '');
        cells.push(h('button', {
          class: 'cal-cell' + (today ? ' today' : '') + (evs.length ? ' has' : '') + (isPast({ y: view.y, m: view.m, d }) ? ' past' : ''),
          'aria-label': label,
          onclick: () => nav.push(() => dayPage(nav, view.y, view.m, d)),
        },
        h('span', { class: 'cal-num' }, d),
        h('span', { class: 'cal-dots' }, evs.slice(0, 3).map((e) => h('i', { class: e.calendar === '생일' ? 'bday' : '' })))));
      }
      const todayEvs = eventsOn(TODAY.y, TODAY.m, TODAY.d);
      wrap.replaceChildren(
        h('div', { class: 'cal-head' },
          h('button', { class: 'cal-nav', 'aria-label': '이전 달', onclick: () => { view.m--; if (view.m < 1) { view.m = 12; view.y--; } draw(); } }, LM.icon('chevron-left')),
          h('h2', { class: 'cal-month' }, view.y + '년 ' + view.m + '월'),
          h('button', { class: 'cal-nav', 'aria-label': '다음 달', onclick: () => { view.m++; if (view.m > 12) { view.m = 1; view.y++; } draw(); } }, LM.icon('chevron-right'))),
        h('div', { class: 'cal-week' }, WD.map((w) => h('span', null, w))),
        h('div', { class: 'cal-grid', role: 'grid' }, cells),
        h('div', { class: 'cal-today-h' }, LM.fmtDate(LM.now())),
        todayEvs.length
          ? h('div', { class: 'cal-today-list' }, todayEvs.map((e) => eventRow(e, () => eventSheet(e))))
          : h('div', { class: 'cal-none' }, '오늘 일정이 없습니다.')
      );
    };
    draw();
    return page;
  }

  function dayPage(nav, y, m, d) {
    const evs = eventsOn(y, m, d).slice().sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
    return ui.page({
      title: m + '월 ' + d + '일 ' + WD[new Date(y, m - 1, d).getDay()] + '요일',
      back: '캘린더',
      nav,
      body: evs.length
        ? ui.group({ plain: true, rows: evs.map((e) => eventRow(e, () => eventSheet(e))) })
        : ui.empty({ icon: 'cal', title: '일정이 없습니다.' }),
    });
  }

  function eventRow(e, onClick) {
    return h('button', { class: 'cal-ev' + (isPast(e) ? ' past' : ''), onclick: onClick },
      h('span', { class: 'cal-time' }, e.time || '종일'),
      h('span', { class: 'cal-ev-t' },
        h('span', { class: 'cal-ev-title' }, e.title),
        e.place ? h('span', { class: 'cal-ev-sub' }, e.place) : null),
      e.calendar === '생일' ? h('span', { class: 'cal-ev-tag' }, '생일') : null);
  }

  function eventSheet(e) {
    const rows = [
      kv('날짜', dayLabel(e)),
      ['시간', e.time || '종일'],
      ['장소', e.place || '—'],
      ['캘린더', e.calendar],
      ['반복', e.repeat || '없음'],
      ['메모', e.memo || '—'],
    ].map((r) => (Array.isArray(r) ? kv(r[0], r[1]) : r));
    if (e.birthday) rows.push(kv('근거', '연락처 생일 기준 · 58번째'));
    const body = h('div', null,
      h('div', { class: 'cal-sheet-title' }, e.title),
      ui.group({ rows }),
      e.gj ? ui.notice('3/10 이후 반복 일정은 삭제되었다.') : null);
    ui.sheet(root, ui.sheetPage({ title: '일정', body }), { size: 'medium' });
  }

  function calendarsSheet() {
    const dot = () => h('span', { class: 'cal-dot' });
    const body = ui.group({
      rows: [
        ui.row({ title: '기본', subtitle: '이 폰의 일정', lead: dot(), check: true, chevron: false, onClick: () => ui.toast('기본 캘린더') }),
        ui.row({ title: '생일', subtitle: '연락처 생일에서 자동', lead: dot(), check: true, chevron: false, onClick: () => ui.toast('생일 캘린더는 연락처에서 자동으로 만든다') }),
      ],
      footer: '생일 캘린더는 연락처에서 자동으로 만들어진다. 삭제할 수 없다.',
    });
    ui.sheet(root, ui.sheetPage({ title: '캘린더', body }), { size: 'small' });
  }

  LM.searchSources.push({
    app: 'cal',
    items: () => EVENTS.map((e) => ({
      title: e.title,
      sub: (e.m) + '/' + e.d + (e.time ? ' ' + e.time : '') + ' · ' + e.calendar,
      text: e.title + ' ' + (e.place || '') + ' ' + dayLabel(e),
    })),
  });
})();
