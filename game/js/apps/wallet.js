/* 지갑 — 성원페이 교통카드(승하차)와 결제(현장 결제 1건). 카드 면은 단색.
 * 설계: design/03-features/MAPS_AND_MOBILITY_SPECIFICATION.md 4절, COMMERCE_AND_FINANCE_SPECIFICATION.md 4절,
 *       SCREEN_SPECIFICATIONS_APPS.md SCR-WALLET-*, E-39 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  /* 승하차: 3/14 19:31 성원구청역 승차 → 19:52 리버뷰역 하차가 캐논(E-39).
   * 그 밖의 날짜·시각은 "1/9 이후 화·금 리버뷰역 반복"을 보여 주기 위한 자리표시다. */
  const RIDES = [
    { date: '3/14', time: '19:31', station: '성원구청역', type: '승차', repeat: false },
    { date: '3/14', time: '19:52', station: '리버뷰역', type: '하차', repeat: false },
    { date: '3/13', time: '08:12', station: '성원구청역', type: '승차', repeat: false },
    { date: '3/13', time: '18:40', station: '리버뷰역', type: '하차', repeat: false },
    { date: '3/10', time: '08:05', station: '성원구청역', type: '승차', repeat: false },
    { date: '3/10', time: '18:31', station: '리버뷰역', type: '하차', repeat: false },
    { date: '3/6', time: '08:20', station: '성원구청역', type: '승차', repeat: false },
    { date: '3/6', time: '18:22', station: '리버뷰역', type: '하차', repeat: true },
  ];

  /* 결제: 3/14 21:22 바로택시 12,400원, 현장 결제(E-39). 등록 카드 없음. */
  const PAYMENTS = [
    { id: 'p1', merchant: '바로택시', at: '3/14 21:22', amount: '12,400원', method: '현장 결제' },
  ];

  LM.register({ id: 'wallet', render(app) { app.start((nav) => home(nav)); } });

  function home(nav) {
    return ui.page({
      title: '지갑', nav,
      body: [
        h('div', { class: 'w-cards' },
          h('button', { class: 'w-card transit', 'aria-label': '성원페이 교통카드', onclick: () => nav.push(() => transit(nav)) },
            h('div', { class: 'w-card-top' }, h('span', { class: 'w-card-brand' }, '성원페이'), LM.icon('bus', 'w-card-ic')),
            h('div', { class: 'w-card-name' }, '교통카드'),
            h('div', { class: 'w-card-sub' }, '성원구청역 · 리버뷰역')),
          h('button', { class: 'w-card pay', 'aria-label': '결제', onclick: () => nav.push(() => payments(nav)) },
            h('div', { class: 'w-card-top' }, h('span', { class: 'w-card-brand' }, '결제'), LM.icon('card', 'w-card-ic')),
            h('div', { class: 'w-card-name' }, '등록된 카드 없음'),
            h('div', { class: 'w-card-sub' }, '현장 결제만 가능'))),
        ui.group({ rows: [
          ui.row({ title: '교통카드', subtitle: '3/14 19:31 승차 · 성원구청역', icon: 'bus', onClick: () => nav.push(() => transit(nav)) }),
          ui.row({ title: '결제', subtitle: '3/14 21:22 · 바로택시 12,400원', icon: 'receipt', onClick: () => nav.push(() => payments(nav)) }),
        ] }),
      ],
    });
  }

  function transit(nav) {
    const groups = [];
    let lastDate = null;
    RIDES.forEach((r) => {
      if (r.date !== lastDate) {
        lastDate = r.date;
        groups.push({ date: r.date, rows: [] });
      }
      groups[groups.length - 1].rows.push(ui.row({
        title: r.station + ' ' + r.type,
        meta: r.time,
        icon: r.type === '승차' ? 'bus' : 'pin',
        extra: r.repeat ? h('span', { class: 'w-rep' }, '화·금 반복') : null,
        chevron: false,
      }));
    });
    return ui.page({
      title: '교통카드', back: '지갑', nav, large: false,
      body: [
        h('div', { class: 'w-mini transit' },
          h('div', { class: 'w-mini-brand' }, '성원페이'),
          h('div', { class: 'w-mini-name' }, '교통카드'),
          h('div', { class: 'w-mini-sub' }, '사용 중')),
        ui.notice('1월 9일 이후 화·금요일에 리버뷰역 하차가 반복된다.'),
        ...groups.map((g) => ui.group({ header: g.date, plain: true, rows: g.rows })),
        h('div', { class: 'grp-f w-note' }, '승하차 내역만 표시한다. 잔액·충전은 이 앱에 없다.'),
      ],
    });
  }

  function payments(nav) {
    return ui.page({
      title: '결제', back: '지갑', nav, large: false,
      body: [
        ui.notice('등록된 카드가 없습니다 · 현장 결제', 'warn'),
        ui.group({
          header: '결제 내역',
          rows: PAYMENTS.map((p) => ui.row({
            title: p.merchant, subtitle: p.method, meta: p.at, value: p.amount,
            onClick: () => nav.push(() => paymentDetail(nav, p)),
          })),
        }),
        h('div', { class: 'grp-f w-note' }, '이 기기의 기기 지갑에는 결제 수단이 등록되어 있지 않다.'),
      ],
    });
  }

  function paymentDetail(nav, p) {
    return ui.page({
      title: '결제 상세', back: '결제', nav, large: false,
      right: h('button', { class: 'nb-btn', 'aria-label': '공유', onclick: () => ui.share(p.merchant + ' ' + p.amount) }, LM.icon('share')),
      body: [
        h('div', { class: 'w-amount' }, h('div', { class: 'w-amount-n' }, p.amount), h('div', { class: 'w-amount-s' }, p.at)),
        ui.group({ rows: [
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '가맹점'), h('span', { class: 'kv-v' }, p.merchant)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '일시'), h('span', { class: 'kv-v' }, p.at)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '금액'), h('span', { class: 'kv-v' }, p.amount)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '결제 수단'), h('span', { class: 'kv-v' }, p.method)),
        ] }),
        ui.button({ label: '공유', kind: 'tinted', icon: 'share', onClick: () => ui.share(p.merchant + ' ' + p.amount) }),
      ],
    });
  }

  LM.searchSources.push({ app: 'wallet', items: () => [
    ...RIDES.map((r) => ({ title: '성원페이 · ' + r.station + ' ' + r.type, sub: r.date + ' ' + r.time, text: r.station + ' ' + r.type })),
    ...PAYMENTS.map((p) => ({ title: '지갑 결제 · ' + p.merchant, sub: p.at + ' · ' + p.amount, text: p.merchant + ' ' + p.amount })),
  ] });
})();
