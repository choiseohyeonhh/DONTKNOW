/* 건강 — 3/14 걸음·심박의 시간대 검증.
 * 설계: design/03-features/PERSONAL_DATA_APPS_SPECIFICATION.md 5절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-HEALTH-*, EVIDENCE_LEDGER E-38 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  /* 캐논: 19:31~19:52 이동 / 20:09~20:51 거의 0 / 20:52~21:04 급증, 심박 20:52 최대 131.
   * 막대 수치와 걸음 총계는 캐논에 없다 — 구간 모양을 보이기 위한 자리표시. */
  const DAY = '3월 14일 토요일';
  const STEPS = {
    total: 6240, // 자리표시(캐논 없음)
    segments: [
      { time: '19:31~19:52', state: '이동' },
      { time: '20:09~20:51', state: '거의 0' },
      { time: '20:52~21:04', state: '급증' },
    ],
  };
  const STEP_BARS = [
    ['19:30', 170], ['19:35', 210], ['19:40', 160], ['19:45', 130], ['19:50', 90], ['19:55', 40],
    ['20:00', 20], ['20:05', 4], ['20:10', 0], ['20:15', 0], ['20:20', 0], ['20:25', 0],
    ['20:30', 0], ['20:35', 0], ['20:40', 0], ['20:45', 0], ['20:50', 8], ['20:55', 280], ['21:00', 320], ['21:05', 240],
  ]; // 자리표시: 구간 상태만 캐논, 막대 수치는 예시
  const HEARTS = [
    ['19:31', 84], ['19:52', 78], ['20:09', 76], ['20:20', 72], ['20:30', 74], ['20:40', 73],
    ['20:51', 74], ['20:52', 131], ['20:56', 128], ['21:00', 122], ['21:04', 118],
  ];
  const HEART_MAX = { v: 131, at: '20:52' };

  LM.register({ id: 'health', render(app) { app.start((nav) => summary(nav)); } });

  function chart(bars, opts) {
    const max = Math.max.apply(null, bars.map((b) => b[1])) || 1;
    return h('div', {
      class: 'he-chart' + (opts && opts.tall ? ' tall' : ''),
      role: 'img',
      'aria-label': (opts && opts.label) || '시간대별 막대 그래프',
    },
    h('div', { class: 'he-bars' }, bars.map(([t, v]) => h('span', { class: 'he-bar' + (v === 0 ? ' zero' : '') },
      h('i', { style: { height: v === 0 ? '3px' : Math.max(6, Math.round((v / max) * 100)) + '%' } })))),
    opts && opts.axis ? h('div', { class: 'he-xaxis' }, opts.axis.map((a) => h('span', null, a))) : null);
  }

  function summary(nav) {
    const card = (title, icon, value, unit, sub, kind, onClick) => h('button', {
      class: 'he-card ' + kind, onclick: onClick,
    },
    h('div', { class: 'he-card-h' }, h('span', { class: 'he-card-ic' }, LM.icon(icon)), h('span', null, title), LM.icon('chevron-right', 'he-card-chev')),
    h('div', { class: 'he-big' }, value, h('span', { class: 'he-unit' }, unit)),
    h('div', { class: 'he-sub' }, sub),
    kind === 'steps'
      ? chart(STEP_BARS, {})
      : chart(HEARTS.map(([t, v]) => [t, Math.max(0, v - 60)]), {}));

    return ui.page({
      title: '요약',
      body: [
        h('div', { class: 'he-date' }, DAY, h('span', { class: 'he-stale' }, '마지막 기록')),
        card('걸음 수', 'steps', STEPS.total.toLocaleString('en-US'), '보', '19:31~21:04', 'steps', () => nav.push(() => stepsPage(nav))),
        card('심박', 'heart', String(HEART_MAX.v), 'bpm', '최대 · ' + HEART_MAX.at, 'heart', () => nav.push(() => heartPage(nav))),
        ui.notice('이 폰의 건강 데이터는 3/15 03:58 이후 새로 기록되지 않았다.'),
      ],
    });
  }

  function stepsPage(nav) {
    const rows = STEPS.segments.map((s) => h('button', {
      class: 'he-seg', onclick: () => ui.info(s.time, [['구간', s.time], ['상태', s.state], ['날짜', DAY]]),
    },
    h('span', { class: 'he-seg-time' }, s.time),
    h('span', { class: 'he-seg-state' }, s.state),
    LM.icon('chevron-right', 'he-seg-chev')));
    return ui.page({
      title: '걸음',
      back: '요약',
      nav,
      body: [
        h('div', { class: 'he-detail-head' },
          h('div', { class: 'he-detail-date' }, DAY),
          h('div', { class: 'he-detail-big' }, STEPS.total.toLocaleString('en-US'), h('span', { class: 'he-unit' }, '보'))),
        h('div', { class: 'he-chart-wrap' }, chart(STEP_BARS, { tall: true, axis: ['19:30', '20:00', '20:30', '21:00'], label: '3월 14일 시간대별 걸음 막대' })),
        ui.group({ header: '구간', plain: true, rows }),
        ui.notice('걸음 수는 시간대 구간으로만 확인한다.'),
      ],
    });
  }

  function heartPage(nav) {
    const rows = HEARTS.map(([t, v]) => h('div', { class: 'he-hr' + (t === HEART_MAX.at ? ' max' : '') },
      h('span', { class: 'he-hr-t' }, t),
      h('span', { class: 'he-hr-v' }, v + ' bpm'),
      t === HEART_MAX.at ? h('span', { class: 'he-hr-max' }, '최대') : null));
    return ui.page({
      title: '심박',
      back: '요약',
      nav,
      body: [
        h('div', { class: 'he-detail-head' },
          h('div', { class: 'he-detail-date' }, DAY),
          h('div', { class: 'he-detail-big' }, String(HEART_MAX.v), h('span', { class: 'he-unit' }, 'bpm')),
          h('div', { class: 'he-detail-sub' }, '최대 · ' + HEART_MAX.at)),
        h('div', { class: 'he-chart-wrap' }, chart(HEARTS.map(([t, v]) => [t, v]), { tall: true, axis: ['19:30', '20:00', '20:30', '21:00'], label: '3월 14일 시간대별 심박 막대' })),
        ui.group({ header: '심박 기록', plain: true, rows }),
      ],
    });
  }

  LM.searchSources.push({
    app: 'health',
    items: () => [
      { title: '걸음 · 3/14', sub: '19:31~19:52 이동 / 20:09~20:51 거의 0 / 20:52~21:04 급증', text: '걸음 3/14 이동 정지 급증' },
      { title: '심박 · 3/14', sub: '최대 131 · 20:52', text: '심박 131 20:52' },
    ],
  });
})();
