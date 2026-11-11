/* 모아 — 성원 지역 대학생 익명 게시판(학교 메일 인증).
 * 설계: design/03-features/VIDEO_AND_COMMUNITY_SPECIFICATION.md 2절, SCREEN_SPECIFICATIONS_APPS.md SCR-MOA-*
 * 캐논: E-130·131·132·133, CHARACTERS A-20·A-24 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const POSTS = [
    {
      id: 'gosiwon', board: 'b-home', my: true, title: '성원구청 근처 싼 고시원 추천 좀',
      anon: '익명', at: '2/20', body: '다음 달부터 지낼 곳을 찾고 있어요. 성원구청 근처에 싼 고시원 있으면 추천 부탁드립니다. 역에서 멀지 않으면 좋겠어요.',
      comments: [
        { anon: '익명1', body: '청운 괜찮음 역 4분' },
        { anon: '익명2', body: '청운 3층 창문방 추천' },
        { anon: '익명5', body: '해담은 일세 돼서 급할 때 좋음' },
      ],
      commentCount: 3,
    },
    {
      id: 'jail', board: 'b-alba', my: true, title: '통장 빌려준 건데 이거 나 감옥 가냐',
      anon: '익명', at: '3/9 04:10', body: '작년부터 통장을 빌려줬어요. 돈이 들어오는 건 알았는데 제가 무슨 일을 한 건지 이제 알았습니다. 이거 나 감옥 가는 거냐. 진짜 모르고 했어요.',
      comments: [
        { anon: '익명3', body: '일단 은행에 바로 말해' }, // 자리표시(캐논 없음)
        { anon: '익명7', at: '3/9 04:31', body: '혹시 굿잡? 나도 했는데 그거 실장K 맞지? 쪽지 줘' },
        { anon: '익명9', body: '벌금 나오는 경우도 있어' }, // 자리표시(캐논 없음)
      ],
      commentCount: 32,
    },
    // 장식 글(단서 아님). Q-OPEN-143 게시판 이름·글 분배 미확정 → 자리표시(캐논 없음)
    { id: 'n1', board: 'b-free', title: '오늘 학식 뭐임', anon: '익명1', at: '3/17 12:04', body: '돈가스인가 했는데 아니네', comments: [], commentCount: 4, layer: 'T2' },
    { id: 'n2', board: 'b-free', title: '3교시 자리 맡아주실 분', anon: '익명2', at: '3/17 09:12', body: '10분만요', comments: [], commentCount: 1, layer: 'T2' },
    { id: 'n3', board: 'b-free', title: '성원대교 야경 좋다', anon: '익명4', at: '3/16 23:40', body: '산책하기 좋아요', comments: [], commentCount: 6, layer: 'T2' },
    { id: 'n4', board: 'b-home', title: '세탁기 언제 비나요', anon: '익명3', at: '3/16 21:10', body: '2층 세탁기요', comments: [], commentCount: 2, layer: 'T2' },
    { id: 'n5', board: 'b-home', title: '고시원 벌레 퇴치법', anon: '익명6', at: '3/15 19:30', body: '문 닫고 하루 약 뿌렸더니 없어졌어요', comments: [], commentCount: 8, layer: 'T2' },
    { id: 'n6', board: 'b-alba', title: '편의점 야간 하루 10', anon: '익명2', at: '3/16 22:02', body: '성원구청역 근처, 주 3회', comments: [], commentCount: 5, layer: 'T2' },
    { id: 'n7', board: 'b-alba', title: '과외 구합니다', anon: '익명8', at: '3/15 11:20', body: '고1 수학, 주 2회', comments: [], commentCount: 3, layer: 'T2' },
  ];
  const BOARDS = [
    { id: 'b-free', name: '자유게시판' },
    { id: 'b-home', name: '고시원·자취' },
    { id: 'b-alba', name: '알바·아르바이트' },
  ];
  /* 게시판 이름 3개는 Q-OPEN-143에 따라 화면 구조용 자리표시(캐논 없음). */

  const MSG = {
    with: '익명7',
    threadId: 'moa-minji',
    messages: [
      { from: 'me', at: '3/9 05:00', body: '네 실장K요', read: true },
      { from: 'them', at: '3/9 09:12', body: '나도 정지될까 무서움… 루프 minji.sw로 연락해', read: true },
    ],
  };

  LM.register({ id: 'moa', render(app) { app.start((nav) => home(nav)); } });

  const byId = (id) => POSTS.find((p) => p.id === id);
  const postsOf = (board) => POSTS.filter((p) => p.board === board && LM.visible(p) && !LM.isDeleted('moa', p.id));
  const navBtn = (icon, label, onClick) => h('button', { class: 'nb-btn', 'aria-label': label, onclick: onClick }, LM.icon(icon));

  function home(nav) {
    return ui.page({
      title: '모아', nav,
      right: h('button', { class: 'nb-btn', 'aria-label': '내 계정', onclick: () => account(nav) }, ui.avatar('이도현', 30)),
      body: [
        LM.online() ? null : ui.notice('오프라인 저장본 · 게시판은 캐시된 글만 보입니다.', 'warn'),
        h('div', { class: 'mo-verify' }, LM.icon('check'), '학교 메일 인증됨 · 익명'),
        ui.group({ header: '내 활동', rows: [
          ui.row({ title: '내가 쓴 글', value: '2', onClick: () => nav.push(() => myPosts(nav)) }),
          ui.row({ title: '내가 쓴 댓글', value: '0', onClick: () => nav.push(() => myComments(nav)) }),
          ui.row({ title: '쪽지함', value: '1', onClick: () => nav.push(() => msgList(nav)) }),
        ] }),
        ui.group({ header: '게시판', rows: BOARDS.map((b) => ui.row({ title: b.name, value: postsOf(b.id).length + '글', onClick: () => nav.push(() => board(nav, b)) })) }),
      ],
    });
  }

  function board(nav, b) {
    const list = postsOf(b.id);
    return ui.page({
      title: b.name, back: '모아', nav, large: false,
      body: [LM.online() ? null : ui.notice('오프라인 저장본 · 캐시된 글만 보입니다.', 'warn'),
        h('div', { class: 'mo-list' }, list.map((p) => postRow(nav, p)))],
    });
  }

  function postRow(nav, p) {
    const when = LM.fmt.date(p.at, /:/.test(p.at) ? 'mdhm' : 'md');
    return h('button', { class: 'mo-row', onclick: () => nav.push(() => post(nav, p)) },
      h('div', { class: 'mo-rowmain' }, h('b', null, p.title), h('span', null, p.anon + ' · 댓글 ' + p.commentCount)),
      h('small', null, when));
  }

  function post(nav, p) {
    const back = (BOARDS.find((b) => b.id === p.board) || {}).name || '모아';
    const online = LM.online();
    return ui.page({
      title: '글', back, nav, large: false,
      body: [
        h('div', { class: 'mo-detail' },
          h('h2', null, p.title),
          h('div', { class: 'mo-postmeta' }, h('span', null, p.anon), h('small', null, LM.fmt.date(p.at, /:/.test(p.at) ? 'mdhm' : 'md'))),
          online ? h('div', { class: 'mo-body' }, p.body) : ui.notice('본문은 온라인이 필요합니다. 캐시된 제목만 볼 수 있습니다.', 'warn')),
        online ? h('div', { class: 'mo-cmore' }, '댓글 ' + p.commentCount) : null,
        online ? h('div', { class: 'mo-comments' }, p.comments.map((c) => h('div', { class: 'mo-comment' },
          h('div', { class: 'mo-cmeta' }, h('b', null, c.anon), c.at ? h('span', null, LM.fmt.date(c.at, 'mdhm')) : null),
          h('div', { class: 'mo-cbody' }, c.body)))) : null,
      ],
    });
  }

  function myPosts(nav) {
    const list = POSTS.filter((p) => p.my && LM.visible(p) && !LM.isDeleted('moa', p.id));
    return ui.page({
      title: '내가 쓴 글', back: '모아', nav, large: false,
      body: [h('div', { class: 'mo-list' }, list.map((p) => postRow(nav, p)))],
    });
  }

  function myComments(nav) {
    return ui.page({
      title: '내가 쓴 댓글', back: '모아', nav, large: false,
      body: [ui.empty({ icon: 'comment', title: '댓글이 없습니다' })],
    });
  }

  function msgList(nav) {
    return ui.page({
      title: '쪽지함', back: '모아', nav, large: false,
      body: [ui.group({ plain: true, rows: [ui.row({ title: '익명7', subtitle: '나도 정지될까 무서움… 루프 minji.sw로 연락해', meta: '3/9 09:12', avatar: '익명7', avatarSize: 52, onClick: () => nav.push(() => msgRoom(nav)) })] })],
    });
  }

  function msgRoom(nav) {
    const log = h('div', { class: 'mo-bubbles' });
    log.appendChild(h('div', { class: 'mo-datediv' }, '3/9'));
    MSG.messages.forEach((m) => {
      log.appendChild(h('div', { class: 'mo-brow ' + (m.from === 'me' ? 'me' : '') },
        m.from === 'me' ? null : ui.avatar('익명7', 28),
        h('div', { class: 'mo-bcol' },
          h('div', { class: 'mo-bubble' }, m.body),
          h('small', { class: 'mo-btime' }, m.at + (m.from === 'me' ? ' · 읽음' : '')))));
    });
    return ui.page({ title: '익명7', back: '쪽지함', nav, large: false, body: [LM.online() ? null : ui.notice('오프라인 저장본 · 답장은 제공하지 않습니다.', 'warn'), log] });
  }

  function account(nav) {
    ui.sheet(nav.root, ui.sheetPage({
      title: '내 계정', cancel: '닫기',
      body: ui.group({ rows: [
        h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '학교 메일'), h('span', { class: 'kv-v mo-ok' }, '인증됨')),
        h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '표시 이름'), h('span', { class: 'kv-v' }, '익명')),
        h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '계정'), h('span', { class: 'kv-v' }, 'A-20')),
      ] }),
    }), { size: 'medium' });
  }

  LM.searchSources.push({
    app: 'moa',
    items: () => [
      ...BOARDS.map((b) => ({ title: b.name, sub: '모아 게시판', text: b.name })),
      ...POSTS.filter((p) => LM.visible(p) && !LM.isDeleted('moa', p.id)).map((p) => ({ title: p.title, sub: '모아 글 · ' + p.at, text: p.title + (LM.online() ? ' ' + p.body : '') })),
      { title: '쪽지함 · 익명7', sub: '모아 쪽지', text: '익명7 minji.sw 쪽지' },
    ],
  });
})();
