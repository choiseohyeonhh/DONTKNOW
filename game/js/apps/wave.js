/* 웨이브 — 브라우저. 주소창은 아래, 시작 페이지·기록·탭 개요. 외부 페이지는 열지 않는다.
 * 설계: design/03-features/PERSONAL_DATA_APPS_SPECIFICATION.md 7절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-WAVE-*, EVIDENCE_LEDGER E-140~E-142·E-220 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const SEARCHES = [
    { at: '2/24 22:05', q: '청운고시원 성원구청 후기' },
    { at: '3/9 03:20', q: '통장 빌려준 사람 처벌' },
    { at: '3/9 03:41', q: '보이스피싱 피해금 돌려주는 법' },
    { at: '3/10 09:12', q: '지급정지 본인 신청' },
    { at: '3/11 23:50', q: '머니코치 강 실장', result: '결과: 튜브 채널만' },
    { at: '3/13 10:30', q: '계좌 명의인 자수' },
    { at: '3/13 10:44', q: '성원경찰서 수사과 가는 길' },
    { at: '3/14 18:25', q: '휴대폰 녹음 들키나' },
  ];
  /* 방문 시각 일부는 검색·알림 시각에서 유도했고, 일부 도메인 표기는 자리표시(캐논 없음). */
  const VISITS = [
    { at: '3/13 10:50', title: '성원경찰서', url: 'police.go' },
    { at: '3/11 23:52', title: '머니코치 · 강 실장', url: 'side.money.kr' },
    { at: '2/24 22:10', title: '청운고시원 — 창문방 안내', url: 'cheongun-gosiwon.kr' },
    { at: '3/14 20:44', title: '루프', url: 'loop.kr' },
  ];
  /* 즐겨찾기 목록은 장식(캐논에 목록이 없다). side.money.kr·cheongun-gosiwon.kr·police.go만 문서 근거. */
  const BOOKMARKS = [
    { title: '루프', url: 'loop.kr' },
    { title: '성원경찰서', url: 'police.go' },
    { title: '청운고시원', url: 'cheongun-gosiwon.kr' },
    { title: '한끼', url: 'hankki.kr' },
    { title: '이웃마켓', url: 'market.kr' },
    { title: '누리은행', url: 'nuribank.kr' },
  ];
  const OPEN_TABS = [{ title: '청운고시원 — 창문방 304 / 305', url: 'cheongun-gosiwon.kr' }];
  const OTHER_SEARCHES = [
    { at: '3/15 08:50', q: '성원구청 일세 고시텔', result: '방문: 해담고시텔 — 성원구청역 6분 · 일세·주세 · 2층' },
    { at: '3/16 22:30', q: '휴학 신청 방법' },
    { at: '3/16 23:00', q: '자수 감경' },
    { at: '3/17 02:14', q: '보이스피싱 명의인 처벌 수위' },
  ];
  const OTHER_VISITS = [
    { at: '3/15 08:50', title: '해담고시텔 — 성원구청역 6분', url: 'haedam' },
  ];

  LM.register({ id: 'wave', render(app) { app.start((nav) => browser(nav)); } });

  function browser(nav) {
    let loaded = null;
    const content = h('div', { class: 'wv-content' });
    const addr = h('input', { class: 'wv-addr', type: 'text', placeholder: '주소 또는 검색어', 'aria-label': '주소 또는 검색어', autocomplete: 'off', spellcheck: 'false' });
    const addrRow = h('div', { class: 'wv-addr-row' }, LM.icon('lock', 'wv-lock'), addr,
      h('button', { class: 'wv-refresh', 'aria-label': '새로 고침', onclick: () => draw() }, LM.icon('refresh')));
    addr.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(addr.value.trim()); addr.blur(); } });

    const go = (url) => { loaded = url || null; addr.value = loaded || ''; draw(); content.scrollTop = 0; };
    const back = () => { if (loaded) go(null); };
    const tool = (icon, label, fn, disabled) => h('button', { class: 'wv-tool', 'aria-label': label, disabled, onclick: fn }, LM.icon(icon));
    const openLibrary = (tab) => nav.push(() => libraryPage(nav, tab, go));

    const bar = h('div', { class: 'wv-bar' },
      addrRow,
      h('div', { class: 'wv-tools' },
        tool('chevron-left', '뒤로', back, !loaded),
        tool('chevron-right', '앞으로', () => {}, true),
        tool('share', '공유', () => {
          const eid = /side\.money\.kr/.test(loaded || '') ? 'E-141' : /cheongun/.test(loaded || '') ? 'E-142' : /haedam/.test(loaded || '') ? 'E-220' : (loaded ? 'E-140' : null);
          if (eid) LM.C.see(eid);
          ui.share({ eid: eid, title: loaded || '웨이브', kind: 'search', app: 'wave' });
        }),
        tool('grid', '탭', () => openLibrary('tabs')),
        tool('list', '라이브러리', () => openLibrary('visits'))));

    const draw = () => {
      content.replaceChildren(loaded ? loadedPage(loaded) : startPage(go));
    };
    draw();

    return ui.page({ title: '웨이브', large: false, noPad: true, class: 'wv', body: content, footer: bar });
  }

  function startPage(go) {
    const favGrid = h('div', { class: 'wv-fav-grid' }, BOOKMARKS.map((b) => h('button', {
      class: 'wv-fav', onclick: () => go(b.url),
    },
    h('span', { class: 'wv-fav-tile' }, b.title.charAt(0)),
    h('span', { class: 'wv-fav-name' }, b.title))));
    const freqs = VISITS.slice(0, 4).map((v) => h('button', { class: 'wv-freq', onclick: () => go(v.url) },
      h('span', { class: 'wv-freq-ic' }, LM.icon('globe')),
      h('span', { class: 'wv-freq-t' }, h('span', { class: 'wv-freq-title' }, v.title), h('span', { class: 'wv-freq-url' }, v.url)),
      h('span', { class: 'wv-freq-at' }, v.at)));
    return h('div', { class: 'wv-start' },
      ui.section('즐겨찾기'),
      favGrid,
      ui.section('자주 방문'),
      h('div', { class: 'wv-freqs' }, freqs),
      LM.online() ? null : h('div', { class: 'wv-offline' }, LM.icon('wifi'), '오프라인 상태입니다. 기록은 이 기기에 남아 있다.'));
  }

  function loadedPage(url) {
    return h('div', { class: 'wv-page' },
      h('div', { class: 'wv-url' }, url),
      LM.online()
        ? ui.empty({ icon: 'globe', title: '페이지를 불러오지 못했습니다.', text: '연결이 끊겼습니다. 새로 고쳐 보세요.' })
        : ui.empty({ icon: 'wifi', title: '인터넷에 연결되어 있지 않음', text: 'Wi-Fi 또는 셀룰러를 켜야 페이지를 열 수 있다.' }));
  }

  function libraryPage(nav, initial, openUrl) {
    let tab = initial || 'tabs';
    const labels = ['탭', '방문 기록', '검색 기록', '북마크'];
    const keyOf = { '탭': 'tabs', '방문 기록': 'visits', '검색 기록': 'searches', '북마크': 'bookmarks' };
    const list = h('div');
    const seg = ui.segmented(labels, labels[['tabs', 'visits', 'searches', 'bookmarks'].indexOf(tab)], (v) => { tab = keyOf[v]; draw(); });
    const go = (url) => { nav.pop(); openUrl(url); };
    const draw = () => {
      const parts = [];
      if (tab === 'tabs') { LM.C.see('E-142'); LM.setEid('E-142'); }
      else if (tab === 'searches') { LM.C.see('E-140'); LM.setEid('E-140'); if (LM.online()) LM.C.see('E-220'); }
      if (tab === 'tabs') {
        parts.push(h('div', { class: 'wv-tabs' },
          h('button', { class: 'wv-tab', onclick: () => go(null) },
            h('span', { class: 'wv-tab-pv' }, LM.icon('compass')),
            h('span', { class: 'wv-tab-title' }, '시작 페이지'), h('span', { class: 'wv-tab-url' }, '웨이브')),
          OPEN_TABS.map((t) => h('button', { class: 'wv-tab', onclick: () => go(t.url) },
            h('span', { class: 'wv-tab-pv' }, LM.icon('globe')),
            h('span', { class: 'wv-tab-title' }, t.title), h('span', { class: 'wv-tab-url' }, t.url)))));
      } else if (tab === 'visits') {
        parts.push(ui.group({ header: '이 기기', rows: VISITS.map((v) => visitRow(v, go)) }));
        if (LM.online()) parts.push(ui.group({ header: '다른 기기 · 슬레이트', rows: OTHER_VISITS.map((v) => visitRow(v, go)) }));
        else parts.push(offlineNote());
      } else if (tab === 'searches') {
        parts.push(ui.group({ header: '이 기기 · 검색 기록', rows: SEARCHES.map((s) => searchRow(s, go)) }));
        if (LM.online()) parts.push(ui.group({ header: '다른 기기 · 슬레이트', rows: OTHER_SEARCHES.map((s) => searchRow(s, go)) }));
        else parts.push(offlineNote());
      } else {
        parts.push(ui.group({ header: '북마크', rows: BOOKMARKS.map((b) => ui.row({
          title: b.title, subtitle: b.url, lead: h('span', { class: 'wv-bm-ic' }, LM.icon('bookmark')),
          onClick: () => go(b.url),
        })) }));
      }
      list.replaceChildren(...parts);
    };
    draw();
    return ui.page({ title: '웨이브', back: '웨이브', nav, body: h('div', null, seg, list) });
  }

  function visitRow(v, go) {
    return ui.row({ title: v.title, subtitle: v.url, meta: LM.fmt.list(v.at), lead: h('span', { class: 'wv-bm-ic' }, LM.icon('globe')), onClick: () => go(v.url) });
  }
  function searchRow(s, go) {
    return ui.row({
      title: s.q, subtitle: s.result || s.at, meta: s.result ? LM.fmt.list(s.at) : null,
      lead: h('span', { class: 'wv-bm-ic' }, LM.icon('search')),
      onClick: () => { if (/머니코치 강 실장/.test(s.q)) LM.C.see('E-141'); go(s.q); },
    });
  }
  function offlineNote() {
    return ui.notice('오프라인 상태입니다. 다른 기기의 기록은 온라인이 되면 동기화된다.', 'warn');
  }

  LM.searchSources.push({
    app: 'wave',
    items: () => [
      ...SEARCHES.map((s) => ({ title: s.q, sub: '검색 · ' + s.at, text: s.q + ' ' + (s.result || '') })),
      ...VISITS.map((v) => ({ title: v.title, sub: '방문 · ' + v.at, text: v.title + ' ' + v.url })),
      ...BOOKMARKS.map((b) => ({ title: b.title, sub: '즐겨찾기', text: b.title + ' ' + b.url })),
    ],
  });
})();
