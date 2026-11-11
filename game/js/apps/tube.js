/* 튜브 — 채널 "머니코치 강" V1~V5, 시청 화면, 시청 기록.
 * 설계: design/03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md 1절, SCREEN_SPECIFICATIONS_APPS.md SCR-TUBE-*
 * 캐논: E-120·121·122·123·124, CHARACTERS A-19 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const CHANNEL = {
    id: 'A-19', name: '머니코치 강', handle: '@moneycoach',
    subscribers: '4.3만', faceOn: false,
    bio: '재테크와 고액 알바 예방을 다루는 채널. 얼굴은 나오지 않습니다.',
  };
  /* 구독자 4.3만은 캐논. 소개 문구는 수법을 드러내지 않는 일반 문구. */

  const VIDEOS = [
    {
      id: 'V1', title: '대학생 목돈 1천 만드는 법', at: '2025.11.20', views: '12만', dur: '08:14', stills: ['대학생 목돈'],
      description: '대학생이 목돈을 만드는 기본 습관을 정리했습니다.',
      captions: [
        { t: '00:12', text: '대학생 때 가장 중요한 건 지출을 아는 거예요.' },
        { t: '01:03', text: '작은 돈부터 기록해 보세요.' },
        { t: '03:40', text: '다음 영상에서 더 자세히 다룹니다.' },
      ],
      comments: [{ author: 'campus.bowl', at: '2025.11.21', body: '도움 됐어요', like: 4 }], commentCount: 38,
    },
    {
      id: 'V2', title: '부업 추천 TOP5 (통장 하나면 OK?)', at: '2026.01.05', views: '31만', dur: '11:02', stills: ['부업 추천 TOP5'],
      description: '추천 부업 문의 → 루프 @side.money.kr',
      captions: [
        { t: '00:09', text: '요즘 부업에 관심 있는 분들이 많죠.' },
        { t: '02:14', text: '오늘은 다섯 가지만 짚어 볼게요.' },
        { t: '07:30', text: '문의는 설명란을 봐 주세요.' },
      ],
      comments: [{ author: 'library.seat', at: '1/6 09:12', body: '설명란 확인했어요', like: 2 }], commentCount: 212,
    },
    {
      id: 'V3', title: '고액 알바 조심하세요', at: '2026.02.20', views: '18만', dur: '06:47', stills: ['고액 알바 조심하세요'],
      description: '고액 알바를 권하는 말에 흔들리지 않는 방법을 이야기합니다.',
      captions: [
        { t: '00:08', text: '고액 알바, 한 번만 빌려줘도 큰일 납니다. 그치?' },
        { t: '00:41', text: '돈이 먼저 들어오면 다들 흔들리죠. 그치?' },
        { t: '01:15', text: '결국 남는 건 책임이에요. 그치?' },
        { t: '02:02', text: '손목에 차고 있는 시계도 잘 보세요.' },
      ],
      comments: [
        { author: 'minji.sw', at: '2/21', body: '잘 봤습니다', like: 1 },
        { author: 'campus.bowl', at: '2/22', body: '무섭네요', like: 3 },
      ], commentCount: 96,
    },
    {
      id: 'V4', title: '새 사무실 투어', at: '2026.03.05', views: '9.8만', dur: '09:31', stills: ['새 사무실 투어'],
      description: '새 사무실을 소개합니다.',
      captions: [
        { t: '00:05', text: '새 사무실로 옮겼습니다.' },
        { t: '00:32', text: '화이트보드에 화·금 GJ, 12F라고 적혀 있네요.' },
        { t: '00:58', text: '창밖으로 성원대교가 보입니다.' },
        { t: '01:20', text: '책상 위에 차 키가 있네요.' },
      ],
      comments: [
        { author: 'minji.sw', at: '3/13 21:02', body: '대표님 저 계좌 정지됐어요 연락 좀 주세요', like: 0, canon: true },
        { author: '구독자', at: '3/13 21:30', body: '@minji.sw 저도 정지됐어요', like: 0, reply: true },
        { author: 'campus.bowl', at: '3/6 10:12', body: '사무실 좋네요', like: 12 },
      ], commentCount: 64,
    },
    {
      id: 'V5', title: '당분간 영상 쉽니다', at: '2026.03.15 02:10', views: '2.1만', dur: '00:41', stills: ['당분간 영상 쉽니다'],
      description: '당분간 영상은 쉽니다.',
      captions: [{ t: '00:04', text: '당분간 영상은 쉽니다.' }],
      comments: [], commentCount: 17,
    },
  ];
  /* 조회수·길이·일부 댓글은 자리표시(캐논 없음). V3 "그치?" 3회·V4 화이트보드/창밖/스마트키·민지 댓글은 캐논. */

  const HISTORY = [
    { videoId: 'V4', at: '3/11 23:45', label: '다시 보기', progress: 0.72 },
    { videoId: 'V4', at: '3/6', label: '시청', progress: 0.4 },
    { videoId: 'V3', at: '2/21', label: '시청', progress: 0.9 },
    { videoId: 'V2', at: '1/6', label: '시청', progress: 1 },
  ];

  LM.register({
    id: 'tube',
    render(app) {
      app.setTabs([
        { label: '홈', icon: 'home', build: (nav) => home(nav) },
        { label: '보관함', icon: 'archive', build: (nav) => historyTab(nav) },
      ], 0);
    },
  });

  const byId = (id) => VIDEOS.find((v) => v.id === id);
  const navBtn = (icon, label, onClick) => h('button', { class: 'nb-btn', 'aria-label': label, onclick: onClick }, LM.icon(icon));
  const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('ko-KR') : n);

  function videoCard(nav, v) {
    return h('button', { class: 'tb-card', 'aria-label': v.title + ', ' + v.dur, onclick: () => nav.push(() => watch(nav, v)) },
      h('div', { class: 'tb-thumb' }, ui.photo(v.stills[0], { ratio: '16 / 9', alt: v.stills[0], caption: false }), h('span', { class: 'tb-dur' }, v.dur)),
      h('div', { class: 'tb-meta' },
        h('b', null, v.title),
        h('span', null, CHANNEL.name + ' · 조회수 ' + v.views + '회'),
        h('small', null, LM.fmt.date(v.at, 'abs'))));
  }

  function channelRow(nav) {
    return h('button', { class: 'tb-channelrow', onclick: () => nav.push(() => channel(nav)) },
      ui.avatar('머니코치 강', 52),
      h('div', { class: 'tb-chtext' }, h('b', null, CHANNEL.name), h('span', null, '구독자 ' + CHANNEL.subscribers + '명 · 얼굴 없음')),
      LM.icon('chevron-right', 'tb-chev'));
  }

  function home(nav) {
    return ui.page({
      title: '튜브', nav,
      right: navBtn('search', '검색', () => nav.push(() => search(nav))),
      body: [
        LM.online() ? null : ui.notice('오프라인 저장본 · 캐시된 제목과 썸네일만 보입니다.', 'warn'),
        h('div', { class: 'tb-sec' }, '구독 채널'),
        channelRow(nav),
        h('div', { class: 'tb-list' }, VIDEOS.slice().reverse().map((v) => videoCard(nav, v))),
        h('div', { class: 'tb-sec' }, '최근 본 영상'),
        h('div', { class: 'tb-list tb-recent' }, HISTORY.slice(0, 2).map((x) => historyRow(nav, x))),
      ],
    });
  }

  function channel(nav) {
    return ui.page({
      title: '머니코치 강', back: '뒤로', nav, large: false,
      body: [
        h('div', { class: 'tb-chan' },
          ui.avatar('머니코치 강', 72),
          h('div', { class: 'tb-chaninfo' },
            h('b', null, CHANNEL.name),
            h('span', null, '구독자 ' + CHANNEL.subscribers + '명'),
            h('span', { class: 'tb-faceoff' }, LM.icon('eye-off'), '얼굴 없음'),
            h('p', null, CHANNEL.bio))),
        ui.section('영상'),
        h('div', { class: 'tb-list' }, VIDEOS.slice().reverse().map((v) => videoCard(nav, v))),
      ],
    });
  }

  function search(nav) {
    if (!LM.online()) {
      return ui.page({ title: '검색', back: '뒤로', nav, large: false, body: ui.empty({ icon: 'wifi', title: '온라인이 필요합니다', text: '오프라인에서는 캐시된 제목과 썸네일만 볼 수 있습니다.' }) });
    }
    const res = h('div');
    const draw = (q) => {
      const query = (q || '').trim().toLowerCase();
      const out = [LM.online() ? null : ui.notice('오프라인 저장본 · 캐시에서만 찾습니다.', 'warn')];
      if (!query) {
        out.push(h('div', { class: 'tb-sec' }, '채널'), channelRow(nav));
        out.push(h('div', { class: 'tb-sec' }, '영상'), h('div', { class: 'tb-list' }, VIDEOS.map((v) => videoCard(nav, v))));
      } else {
        if ('머니코치 강'.includes(query) || query.includes('실장') || 'moneycoach'.includes(query)) {
          out.push(h('div', { class: 'tb-sec' }, '채널'), channelRow(nav));
        }
        const hits = VIDEOS.filter((v) => (v.title + ' ' + v.description + ' ' + v.captions.map((c) => c.text).join(' ')).toLowerCase().includes(query));
        out.push(h('div', { class: 'tb-sec' }, '영상'));
        out.push(hits.length ? h('div', { class: 'tb-list' }, hits.map((v) => videoCard(nav, v))) : ui.empty({ icon: 'search', title: '결과 없음' }));
      }
      res.replaceChildren(...out.filter(Boolean));
    };
    draw('');
    return ui.page({ title: '검색', back: '뒤로', nav, large: false, body: [ui.search('검색', draw), res] });
  }

  function watch(nav, v) {
    const player = h('div', { class: 'tb-player' });
    const sub = h('div', { class: 'tb-sub' }, v.captions[0] ? v.captions[0].text : '');
    const playBtn = h('button', { class: 'tb-play', 'aria-label': '재생' }, LM.icon('play'));
    let playing = false;
    const toggle = () => {
      if (!LM.online()) { ui.toast('온라인이 필요합니다'); return; }
      playing = !playing;
      player.classList.toggle('playing', playing);
      playBtn.replaceChildren(LM.icon(playing ? 'pause' : 'play'));
      playBtn.setAttribute('aria-label', playing ? '일시정지' : '재생');
      sub.textContent = playing ? (v.captions[0] ? v.captions[0].text : '') : '일시정지';
    };
    playBtn.addEventListener('click', toggle);
    player.append(ui.photo(v.stills[0], { ratio: '16 / 9', alt: v.stills[0], caption: false }),
      h('div', { class: 'tb-scrim' }), playBtn, h('div', { class: 'tb-prog' }, h('i')));
    player.addEventListener('click', (e) => { if (e.target === player || e.target.classList.contains('ph')) toggle(); });

    const capList = h('div', { class: 'tb-caps' });
    const drawCaps = (q) => {
      const query = (q || '').trim();
      const list = query ? v.captions.filter((c) => c.text.includes(query)) : v.captions;
      capList.replaceChildren(...(list.length ? list.map((c) => h('div', { class: 'tb-caprow' }, h('span', { class: 'tb-captime' }, c.t), h('span', null, c.text))) : [h('div', { class: 'tb-nocap' }, '자막에 없는 말입니다')]));
    };
    drawCaps('');

    const comments = h('div', { class: 'tb-comments' }, (v.comments || []).map((c) => h('div', { class: 'tb-comment' + (c.reply ? ' reply' : '') },
      ui.avatar(c.author, 32),
      h('div', { class: 'tb-ctext' },
        h('div', { class: 'tb-cmeta' }, h('b', null, c.author), h('span', null, c.at)),
        h('div', { class: 'tb-cbody' }, c.body),
        h('div', { class: 'tb-clike' }, LM.icon('heart', 'tb-ic14'), fmt(c.like || 0))))));

    return ui.page({
      title: v.title, back: '뒤로', nav, large: false,
      body: [
        LM.online() ? null : ui.notice('오프라인 저장본 · 제목·채널만 보입니다. 재생·자막 검색·댓글은 온라인이 필요합니다.', 'warn'),
        player, sub,
        h('div', { class: 'tb-titles' }, h('b', null, v.title), h('small', null, '조회수 ' + v.views + '회 · ' + LM.fmt.date(v.at, 'abs'))),
        h('button', { class: 'tb-wchan', onclick: () => nav.push(() => channel(nav)) }, ui.avatar('머니코치 강', 36), h('span', null, CHANNEL.name), h('small', null, '얼굴 없음'), LM.icon('chevron-right', 'tb-chev')),
        LM.online() ? h('div', { class: 'tb-sec' }, '자막') : null,
        LM.online() ? ui.search('자막 검색', drawCaps) : null,
        LM.online() ? capList : null,
        h('div', { class: 'tb-sec' }, '설명'),
        h('div', { class: 'tb-desc' }, v.description,
          v.id === 'V2' ? h('div', { class: 'tb-link', onclick: () => ui.toast('루프 계정 @side.money.kr') }, '→ 루프 @side.money.kr') : null),
        LM.online() ? h('div', { class: 'tb-sec' }, '댓글 ' + v.commentCount) : null,
        LM.online() ? comments : ui.notice('댓글은 온라인이 필요합니다.', 'warn'),
      ],
    });
  }

  function historyRow(nav, x) {
    const v = byId(x.videoId);
    return h('button', { class: 'tb-hrow', onclick: () => nav.push(() => watch(nav, v)) },
      h('div', { class: 'tb-hthumb' }, ui.photo(v.stills[0], { ratio: '16 / 9', alt: v.stills[0], caption: false }), h('span', { class: 'tb-hprog' }, h('i', { style: { width: Math.round(x.progress * 100) + '%' } }))),
      h('div', { class: 'tb-hmeta' }, h('b', null, v.title), h('span', null, x.label + ' · ' + x.at)));
  }

  function historyTab(nav) {
    return ui.page({
      title: '보관함', nav,
      body: [LM.online() ? null : ui.notice('오프라인 저장본 · 시청 기록은 이 기기에 남습니다.', 'warn'),
        ui.section('시청 기록'),
        h('div', { class: 'tb-list' }, HISTORY.map((x) => historyRow(nav, x)))],
    });
  }

  LM.searchSources.push({
    app: 'tube',
    items: () => !LM.online() ? [] : [
      { title: CHANNEL.name, sub: '튜브 채널 · 구독자 ' + CHANNEL.subscribers, text: '머니코치 강 moneycoach' },
      ...VIDEOS.map((v) => ({ title: v.title, sub: '튜브 영상 · ' + v.at, text: v.title + ' ' + v.description + ' ' + v.captions.map((c) => c.text).join(' ') })),
    ],
  });
})();
