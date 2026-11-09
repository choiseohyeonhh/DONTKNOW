/* 한끼(배달) — 가게 목록(장식), 주문 내역·주문 상세(배송지), 재주문 확인.
 * 3/15 이후 슬레이트 주문(해담고시텔 207호)은 온라인일 때만 보인다(E-150).
 * 설계: design/03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md 2절, SCREEN_SPECIFICATIONS_APPS.md SCR-HANKKI-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const HAEDAM = '성원구청로 31, 해담고시텔 207호';
  const REQUEST = '문 앞에 두고 노크하지 마세요';

  /* 가게 목록은 장식(단서 아님). */
  const STORES = [
    { name: '한끼분식', sub: '김밥·라면·떡볶이', time: '25~35분', photo: '분식' },
    { name: '성원집밥', sub: '백반·제육·된장찌개', time: '30~40분', photo: '백반' },
    { name: '밤참포차', sub: '야식·안주', time: '35~45분', photo: '야식' },
    { name: '고시텔 앞 김밥', sub: '김밥·컵밥', time: '20~30분', photo: '김밥' },
  ];

  /* 1~3월 이전 주문: 배송지 "성원아파트 103동"(집). 메뉴·시각은 자리표시(캐논 없음). */
  const OLD_ORDERS = [
    { id: 'o1', at: '3/6 12:40', items: '김밥 1, 라면 1', addr: '성원아파트 103동' },
    { id: 'o2', at: '2/27 19:20', items: '컵밥 1', addr: '성원아파트 103동' },
    { id: 'o3', at: '1/15 13:10', items: '김밥 1', addr: '성원아파트 103동' },
  ].map((o) => Object.assign(o, { request: '', pay: '만나서 현금 결제', device: '이 기기' }));

  /* 3/15~3/17 슬레이트 주문(E-150). 캐논 그대로. */
  const SLATE_ORDERS = [
    { id: 's3', at: '3/17 12:15', items: '컵밥 1' },
    { id: 's2', at: '3/16 19:40', items: '김밥 1, 라면 1' },
    { id: 's1', at: '3/15 13:02', items: '컵밥 1', changed: true },
  ].map((o) => Object.assign(o, { addr: HAEDAM, request: REQUEST, pay: '만나서 현금 결제', device: '슬레이트' }));

  const LIVE_ORDER = { id: 'live', at: '3/18 07:10', items: '삼각김밥 2', addr: HAEDAM, request: REQUEST, pay: '만나서 현금 결제', device: '슬레이트', live: true };

  LM.register({ id: 'hankki', render(app) { app.start((nav) => home(nav)); } });

  function watch(el, fn) {
    const off = LM.on('state', () => { if (!el.isConnected) { off(); return; } fn(); });
  }

  function home(nav) {
    const body = h('div');
    const storeHost = h('div', { class: 'hk-stores' });
    let q = '';
    const drawStores = () => {
      const list = STORES.filter((s) => !q || (s.name + ' ' + s.sub).includes(q));
      storeHost.replaceChildren(...(list.length
        ? list.map((s) => h('button', { class: 'hk-store', onclick: () => ui.toast('가게 화면은 프로토타입에 없다') },
          h('span', { class: 'hk-thumb' }, ui.photo(s.photo, { caption: false })),
          h('span', { class: 'hk-store-t' }, h('span', { class: 'hk-store-n' }, s.name), h('span', { class: 'hk-store-s' }, s.sub), h('span', { class: 'hk-store-m' }, s.time))))
        : [ui.empty({ icon: 'store', title: '가게가 없습니다' })]));
    };
    const draw = () => {
      const kids = [
        ui.search('가게·메뉴 검색', (v) => { q = v.trim(); drawStores(); }),
        ui.group({ rows: [
          ui.row({ title: '주문 내역', subtitle: LM.online() ? '3/17 12:15 · ' + HAEDAM : '이전 주문 3건', icon: 'receipt', onClick: () => nav.push(() => orders(nav)) }),
        ] }),
        ui.section('가게'),
        storeHost,
      ];
      if (!LM.online()) kids.push(ui.notice('오프라인 상태입니다. 이전 주문만 볼 수 있다.', 'warn'));
      body.replaceChildren(...kids);
      drawStores();
    };
    draw();
    watch(body, draw);
    return ui.page({
      title: '한끼', nav,
      right: h('button', { class: 'nb-btn', 'aria-label': '주문 내역', onclick: () => nav.push(() => orders(nav)) }, LM.icon('receipt')),
      body,
    });
  }

  function orderRow(o, nav) {
    return ui.row({
      title: o.at + ' · ' + o.items,
      meta: o.live ? '주문 접수' : o.changed ? '주소 변경' : null,
      class: o.live ? 'hk-live' : '',
      extra: h('div', { class: 'hk-ord-meta' },
        h('div', { class: 'hk-ord-addr' }, o.addr),
        h('div', { class: 'hk-ord-req' }, (o.request ? o.request + ' · ' : '') + o.pay)),
      onClick: () => nav.push(() => orderDetail(nav, o)),
    });
  }

  function orders(nav) {
    const listHost = h('div');
    const draw = () => {
      const online = LM.online();
      const showLive = online && LM.now().getTime() >= new Date(2026, 2, 18, 7, 10).getTime();
      const slate = online ? (showLive ? [LIVE_ORDER].concat(SLATE_ORDERS) : SLATE_ORDERS) : [];
      const kids = [];
      if (!online) kids.push(ui.notice('오프라인 상태입니다. 이전 주문 캐시만 보인다. 온라인이 되면 최근 주문을 불러온다.', 'warn'));
      if (showLive) kids.push(h('div', { class: 'hk-newline' }, '3/18 07:10 주문 접수 (온라인)'));
      if (slate.length) kids.push(ui.group({ header: online ? '최근 주문' : null, plain: true, rows: slate.map((o) => orderRow(o, nav)) }));
      kids.push(ui.group({ header: '이전 주문', plain: true, rows: OLD_ORDERS.map((o) => orderRow(o, nav)) }));
      listHost.replaceChildren(...kids);
    };
    draw();
    watch(listHost, draw);
    return ui.page({
      title: '주문 내역', back: '한끼', nav,
      right: h('button', { class: 'nb-btn', 'aria-label': '새로고침', onclick: () => { if (!LM.online()) { ui.toast('오프라인 상태입니다'); return; } draw(); ui.toast('주문 내역을 새로 불러왔다'); } }, LM.icon('refresh')),
      body: listHost,
    });
  }

  function orderDetail(nav, o) {
    return ui.page({
      title: '주문 상세', back: '주문 내역', nav, large: false,
      body: [
        h('div', { class: 'hk-detail-head' },
          h('div', { class: 'hk-detail-at' }, o.at + (o.live ? ' · 주문 접수' : '')),
          h('div', { class: 'hk-detail-items' }, o.items)),
        h('div', { class: 'hk-addr' },
          h('div', { class: 'hk-addr-k' }, '배송지'),
          h('div', { class: 'hk-addr-v' }, o.addr),
          o.request ? h('div', { class: 'hk-addr-r' }, o.request) : null),
        ui.group({ rows: [
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '결제'), h('span', { class: 'kv-v' }, o.pay)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '주문 기기'), h('span', { class: 'kv-v' }, o.device)),
        ] }),
        ui.button({
          label: '재주문', kind: 'filled', icon: 'refresh',
          onClick: () => {
            if (!LM.online()) { ui.toast('온라인이 필요합니다'); return; }
            reorder(nav, o);
          },
        }),
        !LM.online() ? ui.notice('오프라인 상태에서는 재주문할 수 없다.', 'warn') : null,
      ],
    });
  }

  function reorder(nav, o) {
    ui.sheet(null, ui.sheetPage({
      title: '재주문', cancel: '닫기', done: '이 주소로 갑니다',
      onDone: () => ui.toast('이 주소로 주문을 접수했다(프로토타입)'),
      body: [
        h('div', { class: 'hk-reorder' },
          h('div', { class: 'hk-reorder-k' }, '배송지'),
          h('div', { class: 'hk-reorder-addr' }, o.addr),
          o.request ? h('div', { class: 'hk-reorder-req' }, o.request) : null,
          h('div', { class: 'hk-reorder-pay' }, o.pay)),
        ui.notice('프로토타입은 실제 주문을 만들지 않는다.'),
      ],
    }), { size: 'medium' });
  }

  LM.searchSources.push({ app: 'hankki', items: () => {
    const all = LM.online() ? SLATE_ORDERS.concat(OLD_ORDERS) : OLD_ORDERS;
    return all.map((o) => ({ title: '한끼 · ' + o.items, sub: o.at + ' · ' + o.addr, text: o.addr + ' ' + o.items }));
  } });
})();
