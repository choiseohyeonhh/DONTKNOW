/* 바로택시 — 출발 고정(현재 위치), 목적지 검색·호출, 이용 내역·영수증, 분실물 문의.
 * 설계: design/03-features/MAPS_AND_MOBILITY_SPECIFICATION.md 2절, SCREEN_SPECIFICATIONS_APPS.md SCR-TAXI-*,
 *       EVIDENCE_LEDGER.md E-12b / LOCATIONS.md L-01~L-12 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const DESTINATIONS = [
    { id: 'haedam', name: '해담고시텔', addr: '성원구청로 31', onlineOnly: true },
    { id: 'spa', name: '성원스파', addr: '성원구청역 1번 출구' },
    { id: 'cheongun', name: '청운고시원', addr: '성원구청로 18' },
    { id: 'river', name: '리버뷰타워', addr: '성원동 · 성원대교 전망' },
    { id: 'gucheong', name: '성원구청역', addr: '성원동 · 지하철 1호선' },
    { id: 'home', name: '성원아파트 103동', addr: '성원동 · 집' },
  ];

  /* 이용 내역: 3/14 21:05 리버뷰타워 → 21:22 성원구청역 2번 출구, 12,400원 (E-12b) */
  const TRIPS = [
    { id: 't1', date: '3/14', from: '리버뷰타워', to: '성원구청역 2번 출구', start: '21:05', end: '21:22', fare: '12,400원', pay: '현장 결제' },
  ];

  /* 분실물 문의: 3/15 09:02 슬레이트에서 "뒷좌석에 폰을 두고 내렸습니다." (T2) */
  const LOST = { at: '3/15 09:02', text: '뒷좌석에 폰을 두고 내렸습니다.', device: '슬레이트' };

  LM.register({ id: 'taxi', render(app) { app.start((nav) => home(nav)); } });

  function mapArt(pin) {
    return h('div', { class: 'm-map mini', role: 'region', 'aria-label': '현재 위치 지도' },
      h('div', { class: 'm-grid' }, Array.from({ length: 42 }, () => h('i'))),
      h('div', { class: 'm-river' }),
      h('div', { class: 'm-subway' }),
      pin ? h('button', { class: 'm-pin is-me', style: { left: '44%', top: '62%' }, 'aria-label': pin }, LM.icon('location', 'm-pin-ic'), h('span', null, pin)) : null);
  }

  function home(nav) {
    return ui.page({
      title: '바로택시', nav,
      right: h('button', { class: 'nb-btn', 'aria-label': '이용 내역', onclick: () => nav.push(() => history(nav)) }, LM.icon('receipt')),
      body: [
        h('div', { class: 't-mapwrap' }, mapArt('현재 위치')),
        ui.group({ rows: [
          ui.row({ title: '출발', value: '현재 위치 (성원아파트)', icon: 'location', chevron: false }),
          ui.row({ title: '도착지 입력', subtitle: '어디로 갈까요?', icon: 'search', onClick: () => nav.push(() => call(nav)) }),
        ] }),
        ui.group({ header: '최근 이용', plain: true, rows: TRIPS.map((t) => ui.row({
          title: t.from + ' → ' + t.to, subtitle: t.start + ' → ' + t.end + ' · ' + t.pay, meta: t.date, value: t.fare,
          onClick: () => nav.push(() => tripDetail(nav, t)),
        })) }),
        !LM.online() ? ui.notice('오프라인 상태입니다. 이용 내역만 볼 수 있고 호출은 할 수 없다.', 'warn') : null,
      ],
    });
  }

  function call(nav) {
    let selected = null, query = '';
    const results = h('div');
    const foot = h('div', { class: 't-foot' });
    const drawResults = () => {
      const list = DESTINATIONS.filter((d) => (!d.onlineOnly || LM.online()) && (!query || d.name.includes(query)));
      results.replaceChildren(list.length
        ? ui.group({ header: '검색 결과', plain: true, rows: list.map((d) => ui.row({
          title: d.name, subtitle: d.addr, icon: 'pin', check: selected && selected.id === d.id,
          onClick: () => { selected = d; drawResults(); drawFoot(); },
        })) })
        : ui.empty({ icon: 'search', title: '결과 없음' }));
    };
    const drawFoot = () => {
      const b = ui.button({
        label: selected ? '호출 · ' + selected.name : '호출', kind: 'filled', icon: 'car',
        onClick: () => {
          if (!LM.online()) { ui.toast('오프라인 상태입니다. 온라인이 필요합니다.'); return; }
          if (!selected) { ui.toast('도착지를 먼저 고르세요'); return; }
          confirmCall(nav, selected);
        },
      });
      foot.replaceChildren(b);
    };
    drawResults(); drawFoot();
    return ui.page({
      title: '목적지 입력', back: '바로택시', nav,
      body: [
        ui.group({ rows: [
          ui.row({ title: '출발', subtitle: '현재 위치 (성원아파트)', icon: 'location', chevron: false, meta: '현장 결제' }),
        ] }),
        ui.search('도착지 검색', (q) => { query = q.trim(); drawResults(); }),
        !LM.online() ? ui.notice('오프라인 상태입니다. 온라인이 필요합니다.', 'warn') : ui.notice('등록된 카드가 없어 현장 결제로 호출한다.', ''),
        results,
      ],
      footer: foot,
    });
  }

  function confirmCall(nav, d) {
    ui.sheet(null, ui.sheetPage({
      title: '호출', cancel: '닫기', done: '호출',
      onDone: () => { ui.toast('호출을 확정했다. 프로토타입은 최종 장면으로 넘어가지 않는다.'); },
      body: [
        h('div', { class: 't-confirm' },
          h('div', { class: 't-confirm-k' }, '도착지'),
          h('div', { class: 't-confirm-to' }, d.name),
          h('div', { class: 't-confirm-addr' }, d.addr),
          h('div', { class: 't-confirm-q' }, '지금 출발할까요?'),
          ui.notice('호출 후에는 되돌릴 수 없습니다.', 'warn'),
          h('div', { class: 't-confirm-pay' }, '현장 결제')),
      ],
    }), { size: 'medium' });
  }

  function history(nav) {
    return ui.page({
      title: '이용 내역', back: '바로택시', nav,
      body: TRIPS.length ? ui.group({
        header: '3월', plain: true, rows: TRIPS.map((t) => ui.row({
          title: t.from + ' → ' + t.to, subtitle: t.start + ' → ' + t.end + ' · ' + t.pay, meta: t.date, value: t.fare,
          onClick: () => nav.push(() => tripDetail(nav, t)),
        })),
      }) : ui.empty({ icon: 'receipt', title: '이용 내역이 없습니다' }),
    });
  }

  function tripDetail(nav, t) {
    return ui.page({
      title: '영수증', back: '이용 내역', nav, large: false,
      body: [
        h('div', { class: 't-amount' }, h('div', { class: 't-amount-n' }, t.fare), h('div', { class: 't-amount-s' }, t.date + ' ' + t.end + ' · ' + t.pay)),
        ui.group({ rows: [
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '출발'), h('span', { class: 'kv-v' }, t.from + ' · ' + t.start)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '도착'), h('span', { class: 'kv-v' }, t.to + ' · ' + t.end)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '결제'), h('span', { class: 'kv-v' }, t.pay)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '이용 기기'), h('span', { class: 'kv-v' }, '이 기기')),
        ] }),
        ui.group({ rows: [
          ui.row({ title: '분실물 문의', icon: 'inbox', subtitle: '3/15 09:02 · 다른 기기에서 문의', onClick: () => nav.push(() => lost(nav)) }),
        ] }),
      ],
    });
  }

  function lost(nav) {
    return ui.page({
      title: '분실물 문의', back: '영수증', nav, large: false,
      body: [
        ui.notice('이 문의는 다른 기기(슬레이트)에서 보냈다. 읽기만 할 수 있다.'),
        h('div', { class: 't-lost' },
          h('div', { class: 't-lost-meta' }, LOST.at + ' · ' + LOST.device),
          h('div', { class: 't-lost-text' }, LOST.text)),
        ui.group({ rows: [h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '상태'), h('span', { class: 'kv-v' }, '접수됨'))] }),
      ],
    });
  }

  LM.searchSources.push({ app: 'taxi', items: () => [
    ...TRIPS.map((t) => ({ title: '바로택시 · ' + t.from + ' → ' + t.to, sub: t.date + ' ' + t.start + ' · ' + t.fare, text: t.from + ' ' + t.to + ' ' + t.fare })),
    { title: '바로택시 분실물 문의', sub: LOST.at + ' · ' + LOST.text, text: LOST.text },
  ] });
})();
