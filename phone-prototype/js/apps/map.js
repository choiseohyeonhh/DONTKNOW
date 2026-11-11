/* 지도 — 가상 성원시 단순화 지도(CSS 도로·블록), 장소 카드, 저장·최근 검색, 고정 시간표 경로.
 * 설계: design/03-features/MAPS_AND_MOBILITY_SPECIFICATION.md 1절, SCREEN_SPECIFICATIONS_APPS.md SCR-MAP-*,
 *       design/01-product/LOCATIONS.md 1~3절, EVIDENCE_LEDGER.md E-70/E-71/E-219 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  /* 장소: 주소·주변 설명은 문서에 있는 것만. 성원대교 전망·일세·주세·성원구청로 18/31은 캐논. */
  const PLACES = [
    { id: 'home', name: '성원아파트 103동', addr: '성원동 · 집', note: '현재 위치', x: 24, y: 27, pin: 'home' },
    { id: 'hanbit', name: '한빛물류', addr: '성원동 · 물류센터', note: '', x: 12, y: 44, pin: 'store' },
    { id: 'river', name: '리버뷰타워', addr: '성원동 · 성원대교 전망', note: '성원대교 전망', x: 64, y: 20, pin: 'pin' },
    { id: 'gucheong', name: '성원구청역', addr: '성원동 · 지하철 1호선', note: '성원구청 인근', x: 54, y: 45, pin: 'pin' },
    { id: 'cheongun', name: '청운고시원', addr: '성원구청로 18', note: '2월 25일 계약 · 3월 입실 예정', x: 40, y: 38, pin: 'pin' },
    { id: 'haedam', name: '해담고시텔', addr: '성원구청로 31 · 2층', note: '일세·주세, 2층', x: 47, y: 33, pin: 'pin', onlineOnly: true, hidePin: true },
    { id: 'police', name: '성원경찰서', addr: '성원동 · 수사과', note: '수사과', x: 79, y: 44, pin: 'pin' },
    { id: 'hanseo', name: '한서대학교', addr: '서울 · 한서대', note: '도현의 학교', x: 17, y: 11, pin: 'pin' },
    { id: 'spa', name: '성원스파', addr: '성원구청역 1번 출구', note: '24시 찜질방', x: 62, y: 52, pin: 'pin' },
    { id: 'lost', name: '성원역 유실물센터', addr: '성원역', note: '', x: 84, y: 27, pin: 'pin' },
    { id: 'hongdae', name: '홍대입구역', addr: '서울 · 지하철 2호선', note: '', x: 90, y: 10, pin: 'pin' },
  ];
  const byId = (id) => PLACES.find((p) => p.id === id);

  /* 최근 검색: 이 기기 3건은 캐논(E-71). 슬레이트 기록은 온라인 후에만(E-219). */
  const RECENT = [
    { q: '청운고시원', at: '2/24', place: 'cheongun' },
    { q: '성원경찰서 수사과', at: '3/13', place: 'police' },
    { q: '리버뷰타워', at: '1/8', place: 'river' },
  ];
  const RECENT_SLATE = [{ q: '해담고시텔', at: '3/15 09:05', place: 'haedam' }];

  /* 저장 장소: "K" = 리버뷰타워, 메모 "1203 / 주차 B2", 1/9 (E-70) */
  let saved = [{ label: 'K', place: 'river', memo: '1203 / 주차 B2', date: '1/9' }];

  /* 이동 시간표(LOCATIONS.md 2절). 없는 구간은 값을 만들지 않는다. */
  const ROUTES = {
    'home|river': { transit: 25, taxi: 15, walk: null },
    'river|gucheong': { transit: 27, taxi: 17, walk: null },
    'river|hongdae': { transit: 55, taxi: 45, walk: null },
    'gucheong|hongdae': { transit: 40, taxi: 35, walk: null },
    'gucheong|cheongun': { transit: null, taxi: null, walk: 4 },
    'gucheong|haedam': { transit: null, taxi: null, walk: 6 },
    'gucheong|spa': { transit: null, taxi: null, walk: 1 },
    'home|haedam': { transit: 30, taxi: 18, walk: null },
    'home|police': { transit: 20, taxi: 10, walk: null },
    'haedam|police': { transit: 15, taxi: 8, walk: null },
  };
  const MODES = [['transit', '대중교통'], ['taxi', '택시·차'], ['walk', '도보']];
  function duration(a, b, mode) {
    const k1 = a + '|' + b, k2 = b + '|' + a;
    const row = ROUTES[k1] || ROUTES[k2];
    return row ? row[mode] : null;
  }

  LM.register({ id: 'map', render(app) { app.start((nav) => home(nav)); } });

  function visiblePlaces() { return PLACES.filter((p) => !p.onlineOnly || LM.online()); }

  function mapArt(o) {
    o = o || {};
    const grid = h('div', { class: 'm-grid' }, Array.from({ length: 56 }, () => h('i')));
    const pins = (o.pins || []).map((p) => h('button', {
      class: 'm-pin' + (p.current ? ' is-me' : ''), style: { left: p.x + '%', top: p.y + '%' }, 'aria-label': p.name,
      onclick: p.onTap || null,
    }, LM.icon(p.pin === 'home' ? 'home' : p.pin === 'store' ? 'store' : 'pin', 'm-pin-ic'), h('span', null, p.name)));
    return h('div', { class: 'm-map' + (o.mini ? ' mini' : ''), role: 'region', 'aria-label': '성원시 지도' },
      grid,
      h('div', { class: 'm-river' }),
      h('div', { class: 'm-bridge' }),
      h('div', { class: 'm-subway' }),
      h('div', { class: 'm-river-label' }, '성원천'),
      h('div', { class: 'm-bridge-label' }, '성원대교'),
      pins);
  }

  function topBar(nav) {
    return h('header', { class: 'm-top' },
      h('div', { class: 'm-top-in' },
        h('h1', null, '지도'),
        h('div', { class: 'm-top-btns' },
          h('button', { class: 'm-circle', 'aria-label': '현재 위치', onclick: () => ui.toast('현재 위치는 성원아파트 103동이다') }, LM.icon('location')),
          h('button', { class: 'm-circle', 'aria-label': '저장한 장소', onclick: () => nav.push(() => savedPage(nav)) }, LM.icon('bookmark')))));
  }

  function home(nav) {
    const screen = h('section', { class: 'm-home' });
    const cardHost = h('div');
    const panel = h('div', { class: 'm-panel' });
    const grab = h('div', { class: 'm-grab', role: 'button', 'aria-label': '지도 패널 펼치기' }, h('i'));

    const showCard = (p) => {
      const card = h('div', { class: 'm-card', role: 'dialog', 'aria-label': p.name },
        h('button', { class: 'm-card-x', 'aria-label': '닫기', onclick: () => card.remove() }, LM.icon('close')),
        h('div', { class: 'm-card-name' }, p.name),
        h('div', { class: 'm-card-addr' }, p.addr),
        p.note ? h('div', { class: 'm-card-note' }, p.note) : null,
        h('div', { class: 'm-card-btns' },
          h('button', { class: 'm-cbtn', onclick: () => { card.remove(); nav.push(() => place(nav, p)); } }, LM.icon('info'), '상세'),
          h('button', { class: 'm-cbtn primary', onclick: () => { card.remove(); nav.push(() => route(nav, p.id)); } }, LM.icon('nav'), '경로')));
      cardHost.replaceChildren(card);
    };

    const pins = visiblePlaces().filter((p) => !p.hidePin).map((p) => Object.assign({}, p, { onTap: () => showCard(p) }));

    const fav = (id, label, icon) => h('button', { class: 'm-fav', onclick: () => nav.push(() => place(nav, byId(id))) }, LM.icon(icon, 'm-fav-ic'), label);

    const recentRows = RECENT.map((r) => ui.row({
      title: r.q, meta: r.at, icon: 'clock', onClick: () => nav.push(() => place(nav, byId(r.place))),
    }));
    const slateRows = LM.online() ? RECENT_SLATE.map((r) => ui.row({
      title: r.q, meta: r.at, icon: 'devices', subtitle: '슬레이트에서', onClick: () => nav.push(() => place(nav, byId(r.place))),
    })) : [];

    const savedRows = saved.map((s) => {
      const p = byId(s.place);
      return ui.row({ title: s.label, subtitle: p.name + ' · ' + s.memo, meta: s.date, icon: 'bookmark', onClick: () => nav.push(() => place(nav, p)) });
    });

    panel.append(
      grab,
      h('div', { class: 'm-panel-body' },
        h('button', { class: 'm-search', onclick: () => nav.push(() => search(nav)) }, LM.icon('search'), h('span', null, '장소 검색')),
        !LM.online() ? ui.notice('지도를 불러올 수 없다(캐시만)', 'warn') : null,
        h('div', { class: 'm-favs' }, fav('home', '집', 'home'), fav('hanbit', '회사', 'store'), fav('river', 'K', 'star')),
        ui.group({ header: '최근 검색', plain: true, rows: recentRows.concat(slateRows) }),
        ui.group({ header: '저장한 장소', plain: true, rows: savedRows.length ? savedRows : [ui.empty({ icon: 'bookmark', title: '저장한 장소가 없습니다' })] })));

    screen.append(mapArt({ pins }), topBar(nav), cardHost, panel);

    /* 아래에서 끌어올리는 패널 */
    let open = false, dragging = false, startY = 0, startOff = 0, lastOff = 0, moved = false, collapsed = 0;
    grab.addEventListener('pointerdown', (e) => {
      dragging = true; moved = false; startY = e.clientY;
      collapsed = panel.offsetHeight * 0.46;
      startOff = open ? 0 : collapsed; lastOff = startOff;
      panel.style.transition = 'none';
      grab.setPointerCapture(e.pointerId);
    });
    grab.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dy = e.clientY - startY;
      if (Math.abs(dy) > 4) moved = true;
      lastOff = Math.max(0, Math.min(collapsed, startOff + dy));
      panel.style.transform = 'translateY(' + lastOff + 'px)';
    });
    const release = () => {
      if (!dragging) return;
      dragging = false;
      panel.style.transition = ''; panel.style.transform = '';
      if (!moved) open = !open;
      else open = lastOff < collapsed * 0.55;
      panel.classList.toggle('open', open);
      grab.setAttribute('aria-label', open ? '지도 패널 접기' : '지도 패널 펼치기');
    };
    grab.addEventListener('pointerup', release);
    grab.addEventListener('pointercancel', release);

    return screen;
  }

  function search(nav) {
    const host = h('div');
    const draw = (q) => {
      const query = (q || '').trim();
      if (!query) {
        const rows = RECENT.map((r) => ui.row({ title: r.q, meta: r.at, icon: 'clock', onClick: () => nav.push(() => place(nav, byId(r.place))) }));
        const slate = LM.online() ? RECENT_SLATE.map((r) => ui.row({ title: r.q, meta: r.at, icon: 'devices', subtitle: '슬레이트에서', onClick: () => nav.push(() => place(nav, byId(r.place))) })) : [];
        host.replaceChildren(...[ui.group({ header: '최근 검색', plain: true, rows: rows.length ? rows : [ui.empty({ icon: 'clock', title: '최근 검색이 없습니다' })] }), slate.length ? ui.group({ header: '다른 기기', plain: true, rows: slate }) : null].filter(Boolean));
        return;
      }
      const hits = visiblePlaces().filter((p) => (p.name + ' ' + p.addr).toLowerCase().includes(query.toLowerCase()));
      host.replaceChildren(hits.length
        ? ui.group({ header: '검색 결과 ' + hits.length, plain: true, rows: hits.map((p) => ui.row({ title: p.name, subtitle: p.addr, icon: 'pin', onClick: () => nav.push(() => place(nav, p)) })) })
        : ui.empty({ icon: 'search', title: '결과 없음', text: '다른 이름으로 찾아보세요.' }));
    };
    draw('');
    return ui.page({ title: '장소 검색', back: '지도', nav, search: '장소 또는 주소', onSearch: draw, body: host });
  }

  function place(nav, p) {
    const isSaved = saved.some((s) => s.place === p.id);
    const saveKv = h('span', { class: 'kv-v' }, isSaved ? '저장한 장소' : '저장 안 함');
    const saveBtn = ui.button({
      label: isSaved ? '저장됨' : '저장', kind: isSaved ? 'gray' : 'tinted', icon: 'bookmark',
      onClick: () => {
        const has = saved.some((s) => s.place === p.id);
        if (has) { saved = saved.filter((s) => s.place !== p.id); ui.toast('저장을 해제했다'); }
        else { saved.push({ label: p.name, place: p.id, memo: '', date: '3/17' }); ui.toast('저장했다'); }
        saveKv.textContent = has ? '저장 안 함' : '저장한 장소';
        saveBtn.classList.toggle('gray', has);
        saveBtn.classList.toggle('tinted', !has);
        if (saveBtn.lastChild) saveBtn.lastChild.textContent = has ? '저장' : '저장됨';
      },
    });
    return ui.page({
      title: p.name, back: '지도', nav, large: false,
      right: h('button', { class: 'nb-btn', 'aria-label': '공유', onclick: () => ui.share(p.name) }, LM.icon('share')),
      body: [
        h('div', { class: 'm-mini-wrap' }, mapArt({ mini: true, pins: [Object.assign({}, p, { x: 50, y: 74 })] })),
        h('div', { class: 'm-place-head' }, h('div', { class: 'm-place-name' }, p.name), h('div', { class: 'm-place-addr' }, p.addr)),
        ui.group({ rows: [
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '주변'), h('span', { class: 'kv-v' }, p.note || '—')),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '저장'), saveKv),
        ] }),
        h('div', { class: 'm-place-btns' },
          ui.button({ label: '경로', kind: 'filled', icon: 'nav', onClick: () => nav.push(() => route(nav, p.id)) }),
          saveBtn,
          ui.button({ label: '공유', kind: 'gray', icon: 'share', onClick: () => ui.share(p.name) })),
      ],
    });
  }

  function route(nav, fromId) {
    let from = fromId || 'home';
    let to = from === 'home' ? 'river' : from === 'gucheong' ? 'hongdae' : from === 'hongdae' ? 'gucheong' : 'home';
    let mode = 'transit';
    const body = h('div');
    const pick = (cb) => {
      let wrap;
      const body = h('div', { class: 'm-picker' }, ui.group({
        plain: true,
        rows: visiblePlaces().map((p) => ui.row({
          title: p.name, subtitle: p.addr, icon: 'pin',
          onClick: () => { if (wrap) wrap.close(); cb(p.id); },
        })),
      }));
      wrap = ui.sheet(null, ui.sheetPage({ title: '장소 선택', cancel: '닫기', body }), { size: 'medium' });
    };
    const draw = () => {
      const mins = duration(from, to, mode);
      const modeName = MODES.find((m) => m[0] === mode)[1];
      body.replaceChildren(
        ui.group({ rows: [
          ui.row({ title: '출발', value: byId(from).name, icon: 'location', chevron: false, onClick: () => pick((id) => { from = id; draw(); }) }),
          ui.row({ title: '도착', value: byId(to).name, icon: 'pin', chevron: false, onClick: () => pick((id) => { to = id; draw(); }) }),
          ui.row({ title: '출발·도착 바꾸기', icon: 'refresh', action: true, onClick: () => { const t = from; from = to; to = t; draw(); } }),
        ] }),
        ui.segmented(MODES.map((m) => m[1]), modeName, (name) => { mode = MODES.find((m) => m[1] === name)[0]; draw(); }),
        h('div', { class: 'm-route-map' }, mapArt({ mini: true, pins: [Object.assign({}, byId(from), { x: 26, y: 74 }), Object.assign({}, byId(to), { x: 74, y: 30 })] })),
        mins == null
          ? ui.notice('이 구간의 ' + modeName + ' 이동 시간은 표에 없다.', 'warn')
          : h('div', { class: 'm-dur' },
            h('div', { class: 'm-dur-n' }, mins + '분'),
            h('div', { class: 'm-dur-s' }, modeName + ' · 고정 시간표'),
            from === to ? h('div', { class: 'm-dur-w' }, '같은 장소입니다.') : null));
    };
    draw();
    return ui.page({ title: '경로', back: '장소', nav, large: false, body });
  }

  function savedPage(nav) {
    return ui.page({
      title: '저장', back: '지도', nav,
      body: saved.length ? ui.group({
        header: '저장한 장소', rows: saved.map((s) => {
          const p = byId(s.place);
          return ui.row({ title: s.label, subtitle: p.name + (s.memo ? ' · ' + s.memo : ''), meta: s.date, icon: 'bookmark', onClick: () => nav.push(() => place(nav, p)) });
        }),
      }) : ui.empty({ icon: 'bookmark', title: '저장한 장소가 없습니다' }),
    });
  }

  LM.searchSources.push({ app: 'map', items: () => visiblePlaces().map((p) => ({ title: p.name, sub: p.addr, text: p.name + ' ' + p.addr })) });
})();
