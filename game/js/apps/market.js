/* 이웃마켓(중고거래) — 동네 판매 글, 직거래 채팅, 나의 판매내역.
 * 급처 3건과 3/14 19:10·20:30 채팅은 캐논(E-160, E-161). 열람만 한다(새 글·답장 없음).
 * 설계: design/03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md 3절, SCREEN_SPECIFICATIONS_APPS.md SCR-MARKET-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const POSTS = [
    { id: 'cam', title: '카메라 급처', price: '45만 원', status: 'sold', statusText: '판매 완료 3/11', photo: '카메라', time: '3/10', mine: true, desc: '급처합니다. 빨리 거래 원해요', chat: 'cam' },
    { id: 'gtr', title: '통기타', price: '20만 원', status: 'sold', statusText: '판매 완료 3/12', photo: '통기타', time: '3/11', mine: true, desc: '급처합니다. 빨리 거래 원해요', chat: 'gtr' },
    { id: 'mon', title: '모니터', price: '12만 원', status: 'reserved', statusText: '예약 중', photo: '모니터', time: '3/14', mine: true, desc: '급처합니다. 빨리 거래 원해요', chat: 'mon', note: '3/14 약속 불발 · 구매자 미응답' },
    /* 아래 두 글은 동네 피드를 채우는 자리표시(캐논 없음). */
    { id: 'chair', title: '책상 의자', price: '3만 원', status: 'selling', statusText: '판매 중', photo: '의자', time: '3/15', mine: false, desc: '깨끗하게 썼습니다.', seller: '성원동 이웃' },
    { id: 'books', title: '전공책 일괄', price: '2만 원', status: 'selling', statusText: '판매 중', photo: '전공책', time: '3/16', mine: false, desc: '필기 조금 있습니다.', seller: '성원동 이웃' },
  ];
  const postById = (id) => POSTS.find((p) => p.id === id);

  /* 구매자 이름은 캐논에 없다. 상품별 구매자로만 표기한다.
   * 통기타 대화 본문은 캐논에 없어 짧고 무해한 자리표시로 채웠다. */
  const CHATS = [
    {
      id: 'mon', post: 'mon', name: '모니터 구매자', at: '3/14', unanswered: true, days: [
        { day: '3월 14일', msgs: [
          { side: 'me', text: '오늘 리버뷰역 6번 출구 가능? 8시 전에', at: '19:10' },
          { side: 'them', text: '어디세요?', at: '20:30' },
        ] },
      ], status: null,
    },
    {
      id: 'cam', post: 'cam', name: '카메라 구매자', at: '3/11', days: [
        { day: '3월 11일', msgs: [{ side: 'me', text: '현금 직거래 성원구청역 2번 출구 8시', at: '' }] },
      ], status: '판매 완료 3/11',
    },
    {
      id: 'gtr', post: 'gtr', name: '통기타 구매자', at: '3/12', days: [
        { day: '3월 12일', msgs: [
          { side: 'them', text: '아직 판매 중인가요?', at: '' },
          { side: 'me', text: '네, 있습니다.', at: '' },
        ] },
      ], status: '판매 완료 3/12',
    },
  ];
  const chatById = (id) => CHATS.find((c) => c.id === id);

  function badge(p) { return h('span', { class: 'mk-badge ' + p.status }, p.statusText); }
  const sellerName = (p) => p.mine ? '이도현' : (p.seller || '성원동 이웃');

  LM.register({
    id: 'market',
    render(app) {
      app.setTabs([
        { label: '홈', icon: 'store', build: (nav) => feed(nav) },
        { label: '채팅', icon: 'chat', badge: 1, build: (nav) => chats(nav) },
        { label: '판매', icon: 'tag', build: (nav) => sales(nav) },
      ], 0);
    },
  });

  function feed(nav) {
    const host = h('div');
    const draw = (q) => {
      const query = (q || '').trim();
      const list = POSTS.filter((p) => !query || (p.title + ' ' + p.desc).includes(query));
      host.replaceChildren(
        h('div', { class: 'mk-loc' }, LM.icon('pin'), '성원동'),
        list.length ? ui.group({ header: '동네 글', plain: true, rows: list.map(postRow(nav)) })
          : ui.empty({ icon: 'search', title: '글이 없습니다' }));
    };
    draw('');
    return ui.page({ title: '이웃마켓', nav, search: '동네에서 검색', onSearch: draw, body: host });
  }

  function postRow(nav) {
    return (p) => ui.row({
      thumb: true,
      lead: h('span', { class: 'mk-thumb' }, ui.photo(p.photo, { caption: false })),
      title: p.title,
      subtitle: '성원동 · ' + p.time,
      value: p.price,
      extra: badge(p),
      onClick: () => nav.push(() => post(nav, p)),
    });
  }

  function chats(nav) {
    return ui.page({
      title: '채팅', nav,
      body: CHATS.length ? ui.group({
        plain: true,
        rows: CHATS.map((c) => {
          const p = postById(c.post);
          const last = c.days[c.days.length - 1].msgs[c.days[c.days.length - 1].msgs.length - 1];
          return ui.row({
            avatar: c.name, title: c.name, subtitle: last.text, meta: c.at,
            extra: h('span', { class: 'mk-chat-post' }, p.title),
            badge: c.unanswered ? 1 : null,
            onClick: () => nav.push(() => chat(nav, c)),
          });
        }),
      }) : ui.empty({ icon: 'chat', title: '대화가 없습니다' }),
    });
  }

  function sales(nav) {
    const mine = POSTS.filter((p) => p.mine);
    return ui.page({
      title: '나의 판매내역', nav,
      body: [
        h('div', { class: 'mk-count' }, '판매 완료 2 · 예약 중 1'),
        ui.group({ plain: true, rows: mine.map((p) => ui.row({
          thumb: true,
          lead: h('span', { class: 'mk-thumb' }, ui.photo(p.photo, { caption: false })),
          title: p.title,
          subtitle: '성원동 · ' + p.time,
          value: p.price,
          extra: badge(p),
          onClick: () => nav.push(() => post(nav, p)),
        })) }),
      ],
    });
  }

  function post(nav, p) {
    const c = p.chat ? chatById(p.chat) : null;
    return ui.page({
      title: '상품', back: '이웃마켓', nav, large: false,
      right: h('button', { class: 'nb-btn', 'aria-label': '공유', onclick: () => ui.share(p.title + ' ' + p.price) }, LM.icon('share')),
      body: [
        h('div', { class: 'mk-hero' }, ui.photo(p.photo, { alt: p.title, ratio: '4 / 3', caption: false })),
        h('div', { class: 'mk-detail' },
          h('div', { class: 'mk-detail-title' }, p.title),
          h('div', { class: 'mk-detail-price' }, p.price),
          h('div', { class: 'mk-detail-badge' }, badge(p)),
          h('div', { class: 'mk-detail-desc' }, p.desc),
          p.note ? h('div', { class: 'mk-detail-note' }, p.note) : null),
        ui.group({ header: '판매자', rows: [ui.row({ avatar: sellerName(p), title: sellerName(p), subtitle: '성원동', chevron: false })] }),
        ui.group({ rows: [
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '거래 상태'), h('span', { class: 'kv-v' }, p.statusText)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '올린 시각'), h('span', { class: 'kv-v' }, p.time)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '거래 지역'), h('span', { class: 'kv-v' }, '성원동')),
        ] }),
        c ? ui.button({ label: '채팅하기', kind: 'filled', icon: 'chat', onClick: () => nav.push(() => chat(nav, c)) })
          : ui.notice('이 글에는 대화가 없다.'),
      ],
    });
  }

  function chat(nav, c) {
    const p = postById(c.post);
    const log = h('div', { class: 'mk-log', role: 'log', 'aria-label': c.name + ' 대화' });
    c.days.forEach((d) => {
      log.appendChild(h('div', { class: 'mk-day' }, d.day));
      d.msgs.forEach((m) => {
        log.appendChild(h('div', { class: 'mk-line ' + m.side },
          m.side === 'them' ? ui.avatar(c.name, 28) : null,
          h('div', { class: 'mk-bubble' },
            h('span', { class: 'mk-text' }, m.text),
            m.at ? h('span', { class: 'mk-time' }, m.at) : null)));
      });
    });
    if (c.status) log.appendChild(h('div', { class: 'mk-sys' }, c.status));
    if (c.unanswered) log.appendChild(h('div', { class: 'mk-un' }, LM.icon('alert'), '답장 없음 · 20:30'));
    return ui.page({
      title: c.name, back: '채팅', nav, large: false,
      right: h('button', { class: 'nb-btn', 'aria-label': '대화 정보', onclick: () => ui.info('대화 정보', [['상품', p.title], ['상태', p.statusText], ['마지막 메시지', c.at]]) }, LM.icon('info')),
      body: [log, ui.notice('이 대화는 읽기만 할 수 있다.')],
    });
  }

  LM.searchSources.push({ app: 'market', items: () => [
    ...POSTS.map((p) => ({ title: '이웃마켓 · ' + p.title, sub: p.price + ' · ' + p.statusText, text: p.title + ' ' + p.desc })),
    ...CHATS.map((c) => ({ title: '이웃마켓 채팅 · ' + c.name, sub: postById(c.post).title, text: c.name + ' ' + postById(c.post).title })),
  ] });
})();
