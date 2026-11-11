/* 루프 — 사진 게시물(시각 중심) + 글 게시물(공개 확산) 결합.
 * 설계: design/03-features/SNS_SPECIFICATION.md, SCREEN_SPECIFICATIONS_SNS_SETTINGS.md SCR-LOOP-*
 * 캐논: NARRATIVE_CANON 3~4절, CHARACTERS 3·5절, EVIDENCE E-40·41·44·46·47·48·49·55·57·59·101·103·222 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const S = {
    account: 'dohyun.lee',
    blocked: new Set(['moneycoach.kang', 'side.money.kr']),
  };
  const FOLLOWING = ['jihoon_j', 'harin.daily', 'seoa.film', 'campus.bowl', 'library.seat'];

  const AC = {
    'dohyun.lee': { handle: 'dohyun.lee', name: '이도현', bio: '한서대 경영 26', followers: 384, following: 132, posts: 2, self: true },
    'dontknow__': { handle: 'dontknow__', name: '도현', bio: '', followers: 7, following: 9, posts: 23, private: true },
    'jihoon_j': { handle: 'jihoon_j', name: '정지훈', bio: '', followers: 210, following: 188, posts: 3 },
    'seoa.film': { handle: 'seoa.film', name: '한서아', bio: '영상과', followers: 612, following: 240, posts: 4 },
    'harin.daily': { handle: 'harin.daily', name: '박하린', bio: '', followers: 890, following: 95, posts: 2 },
    'minji.sw': { handle: 'minji.sw', name: '윤민지', bio: '', followers: 164, following: 171, posts: 2 },
    'moneycoach.kang': { handle: 'moneycoach.kang', name: '머니코치 강', bio: '재테크·고액 알바 예방 콘텐츠', followers: '4.3만', following: 12, posts: 3, faceOn: false },
    'side.money.kr': { handle: 'side.money.kr', name: '부업 추천', bio: '하루 30 가능 · 문의 블링크', followers: '3,100', following: 4, posts: 41, joined: '2025.09', prev: [['kang.side', '2025.09~11'], ['sidejob.pro', '2025.11~2026.01']] },
    'jh_lee_99': { handle: 'jh_lee_99', name: '', bio: '', followers: 0, following: 3, posts: 0, joined: '2026.03.15', t2: true },
    'campus.bowl': { handle: 'campus.bowl', name: '한서 학식', bio: '', followers: 1400, following: 70, posts: 2 },
    'library.seat': { handle: 'library.seat', name: '도서관 자리', bio: '', followers: 320, following: 110, posts: 1 },
    'night.bus': { handle: 'night.bus', name: '야간 버스', bio: '', followers: 780, following: 55, posts: 1 },
  };
  /* 계정 팔로워·팔로잉·소개 중 캐논에 없는 값은 자리표시(캐논 없음)다. */

  const POSTS = [
    { id: 'dh-100', kind: 'photo', author: 'dohyun.lee', at: '2025.10.03', pinned: true, caption: '우리 100일 🤍', media: ['100일 · 서아와'], tags: ['seoa.film'], likes: 212, comments: [{ author: 'seoa.film', at: '2025.10.03', body: '🤍' }] },
    { id: 'dh-last', kind: 'photo', author: 'dohyun.lee', at: '3/8', caption: '캠퍼스.', media: ['캠퍼스 오후'], likes: 96, comments: [{ author: 'jh_lee_99', at: '3/15 13:20', body: '도현아 연락 좀 해 ㅠㅠ 걱정돼', t2: true }] },
    { id: 'jh-0105', kind: 'photo', author: 'jihoon_j', at: '1/5', location: '리버뷰타워', caption: '용돈 벌이 성공 ㅋ', media: ['현금 사진'], likes: 48, comments: [] },
    { id: 'harin-0308', kind: 'text', author: 'harin.daily', at: '3/8 22:40', body: '할머니가 3월 6일에 2,800만 원을 당하셨어요. 경찰은 아직 아무 말도 없고요. 상대 계좌는 "누리 352-****-7731 이*현"이라고만 나옵니다. 같은 피해 보신 분 계시면 꼭 알려 주세요. 제발요.', likes: 1204, commentCount: 112,
      likesList: [{ handle: 'dohyun.lee', at: '3/9 03:12' }, { handle: 'campus.bowl', at: '3/9 01:10' }, { handle: 'library.seat', at: '3/9 00:52' }],
      comments: [{ author: 'campus.bowl', at: '3/9 00:41', body: '힘내세요…' }, { author: 'library.seat', at: '3/9 01:02', body: '같은 계좌 저도 봤어요' }] }, // 댓글 2건 자리표시(캐논 없음)
    { id: 'kang-0305', kind: 'photo', author: 'moneycoach.kang', at: '3/5', caption: '새 사무실 🔑', media: ['창밖 성원대교', '화이트보드'], likes: 3021, comments: [], edited: true, editHistory: [{ at: '3/15 03:00', from: '리버뷰타워', to: '위치 태그 없음', t2: true }] },
    { id: 'kang-0220', kind: 'text', author: 'moneycoach.kang', at: '2/20', body: '고액 알바 조심하세요 여러분 그치?', likes: 842, commentCount: 57, comments: [] },
    { id: 'kang-0202', kind: 'photo', author: 'moneycoach.kang', at: '2/2', caption: '새 차 🖤', media: ['검은 SUV', '녹색 문자판 시계'], likes: 5100, comments: [] },
    { id: 'minji-0120', kind: 'photo', author: 'minji.sw', at: '1/20', location: '리버뷰타워', caption: '교육 끝 🍰', media: ['케이크', 'SUV 스마트키', '손목의 초록 시계', '창밖 성원대교'], likes: 76, comments: [], layer: 'T2' },
    { id: 'minji-0313', kind: 'text', author: 'minji.sw', at: '3/13', body: '계좌 정지… 다들 고액알바 조심해', likes: 22, commentCount: 8, comments: [], layer: 'T2' },
    { id: 'noise-1', kind: 'photo', author: 'campus.bowl', at: '3/13', caption: '오늘 학식', media: ['학식'], likes: 61, comments: [] },
    { id: 'noise-2', kind: 'text', author: 'library.seat', at: '3/12', body: '3층 창가 자리 비었어요', likes: 9, commentCount: 2, comments: [] },
    { id: 'noise-3', kind: 'photo', author: 'night.bus', at: '3/11', caption: '막차', media: ['야간 버스'], likes: 33, comments: [] },
  ];
  /* dh-last의 시각·문구, 단역 3개, 좋아요·팔로워 수는 자리표시(캐논 없음). */

  const DK_POSTS = [
    { id: 'dk-1', kind: 'text', author: 'dontknow__', at: '2024.08', body: '시작 7,420' },
    { id: 'dk-2', kind: 'text', author: 'dontknow__', at: '2025.12', body: '합격. 남은 거 5,620' },
    { id: 'dk-3', kind: 'text', author: 'dontknow__', at: '1/9', body: '새 알바 하루 30' },
    { id: 'dk-4', kind: 'photo', author: 'dontknow__', at: '1/20', caption: '알바 동기들', media: ['교육 단체사진 · 오른쪽이 잘림'], edited: true },
    { id: 'dk-5', kind: 'text', author: 'dontknow__', at: '1/27', body: '300 보냄' },
    { id: 'dk-6', kind: 'text', author: 'dontknow__', at: '2/14', body: '끝' },
    { id: 'dk-7', kind: 'text', author: 'dontknow__', at: '2/26', body: '남은 거 4,820' },
    { id: 'dk-8', kind: 'text', author: 'dontknow__', at: '3/9 04:02', body: '나 뭐 한 거냐' },
    { id: 'dk-9', kind: 'text', author: 'dontknow__', at: '3/12', body: '정지됐다 다행이다' },
    { id: 'dk-10', kind: 'text', author: 'dontknow__', at: '2024.10', body: '6,800' },
    { id: 'dk-11', kind: 'text', author: 'dontknow__', at: '2024.12', body: '오늘 30' }, // 자리표시(캐논 없음) — CHARACTERS의 예시 문구
    { id: 'dk-12', kind: 'text', author: 'dontknow__', at: '2025.02', body: '3,200' },
    { id: 'dk-13', kind: 'text', author: 'dontknow__', at: '2025.04', body: '월요일' },
    { id: 'dk-14', kind: 'text', author: 'dontknow__', at: '2025.06', body: '1,400' },
    { id: 'dk-15', kind: 'text', author: 'dontknow__', at: '2025.08', body: '내일' },
    { id: 'dk-16', kind: 'text', author: 'dontknow__', at: '2025.10', body: '4,900' },
    { id: 'dk-17', kind: 'text', author: 'dontknow__', at: '2025.11', body: '30' },
    { id: 'dk-18', kind: 'text', author: 'dontknow__', at: '2025.12', body: '12월' },
    { id: 'dk-19', kind: 'text', author: 'dontknow__', at: '1/2', body: '2,100' },
    { id: 'dk-20', kind: 'text', author: 'dontknow__', at: '1/15', body: '밤' },
    { id: 'dk-21', kind: 'text', author: 'dontknow__', at: '2/3', body: '5,100' },
    { id: 'dk-22', kind: 'text', author: 'dontknow__', at: '2/20', body: '내일' },
    { id: 'dk-23', kind: 'text', author: 'dontknow__', at: '3/2', body: '4,820' },
  ];
  /* DK_POSTS 10~23: Q-OPEN-136 문구·시각 미확정 → 숫자·짧은 문장 자리표시(캐논 없음). */

  const STORIES = {
    own: { author: 'dohyun.lee', at: '3/14 19:40', black: true, text: '.', own: true, viewers: [{ handle: 'moneycoach.kang', at: '3/14 19:44' }, { handle: 'jihoon_j', at: '3/14 19:47' }, { handle: 'seoa.film', at: '3/14 19:52' }], viewerMore: 31 },
    'seoa-3': { author: 'seoa.film', at: '3/14 21:40', media: '홍대입구역 밤', location: '홍대입구역', text: '', archived: true },
    'seoa-4': { author: 'seoa.film', at: '3/12 00:10', media: '새벽 거리', text: '', archived: true },
    'seoa-2': { author: 'seoa.film', at: '2/14', media: '혼자', text: '혼자 🙃', archived: true },
    'jihoon-arch': { author: 'jihoon_j', at: '3/15', black: true, text: '…', archived: true },
    'minji-1': { author: 'minji.sw', at: '1월', media: '출근길', text: '알바' },
    'kang-ad': { author: 'moneycoach.kang', at: '', media: '추천 부업 카드', text: '추천 부업' },
  };
  const HIGHLIGHTS = {
    'seoa.film': [{ title: '2월', key: 'seoa-2' }, { title: '3월', key: 'seoa-3' }],
    'moneycoach.kang': [{ title: '추천 부업', key: 'kang-ad' }],
    'minji.sw': [{ title: '알바', key: 'minji-1' }],
  };

  const ACTIVITY = [
    { icon: 'heart', text: 'harin.daily 글에 좋아요를 눌렀습니다', meta: '3/9 03:12', target: 'harin-0308' },
    { icon: 'bookmark', text: 'harin.daily 글을 저장했습니다', meta: '3/9 03:15', target: 'harin-0308' },
    { icon: 'user', text: 'moneycoach.kang을 팔로우했습니다', meta: '1/6' },
    { icon: 'user', text: 'moneycoach.kang 팔로우를 취소했습니다', meta: '3/12 00:10' },
    { icon: 'search', text: '검색: side.money.kr', meta: '3/11 23:40' },
    { icon: 'search', text: '검색: kang.side · 결과 없음', meta: '3/11 23:52' },
    { icon: 'search', text: '검색: 머니코치 강 실장', meta: '3/11 23:58' },
    { icon: 'shield', text: 'moneycoach.kang·side.money.kr을 차단했습니다', meta: '3/15 01:02 · 슬레이트에서', t2: true },
  ];

  const PLACES = {
    '리버뷰타워': { address: '성원대교 전망', count: 9 },
    '청운고시원': { address: '성원구청로 18', count: 0 },
    '해담고시텔': { address: '성원구청로 31, 2층', count: 0 },
    '홍대입구역': { address: '서울 마포구', count: 0 },
  };

  LM.register({
    id: 'loop',
    render(app) {
      app.setTabs([
        { label: '홈', icon: 'home', build: (nav) => feed(nav) },
        { label: '검색', icon: 'search', build: (nav) => searchTab(nav) },
        { label: '만들기', icon: 'plus', build: (nav) => createTab(nav) },
        { label: '활동', icon: 'heart', build: (nav) => activityTab(nav) },
        { label: '프로필', icon: 'user', build: (nav) => selfProfile(nav) },
      ], 0);
    },
  });

  const isBlocked = (handle) => S.blocked.has(handle);
  const byId = (id) => POSTS.find((p) => p.id === id) || DK_POSTS.find((p) => p.id === id);
  const avName = (handle) => (AC[handle] && AC[handle].name) || handle;
  const navBtn = (icon, label, onClick) => h('button', { class: 'nb-btn', 'aria-label': label, onclick: onClick }, LM.icon(icon));
  const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('ko-KR') : n);
  function dateAbs(v) {
    if (v == null || v === '') return '';
    const withTime = /\d{1,2}:\d{2}/.test(String(v));
    return LM.fmt.date(v, 'abs') + (withTime ? ' ' + LM.fmt.date(v, 'hm') : '');
  }
  function postVisible(p) { return LM.visible(p) && !LM.isDeleted('loop', p.id); }

  function headRow(p, nav) {
    const acc = AC[p.author] || { handle: p.author };
    return h('div', { class: 'lp-head' },
      h('button', { class: 'lp-avbtn', 'aria-label': acc.handle + ' 프로필', onclick: () => openProfile(nav, p.author) }, ui.avatar(avName(p.author), 32)),
      h('button', { class: 'lp-who', onclick: () => openProfile(nav, p.author) },
        h('span', { class: 'lp-handle' }, acc.handle),
        p.location ? h('span', { class: 'lp-sub' }, p.location) : null),
      p.edited ? h('button', { class: 'lp-edited', onclick: () => editHistory(nav, p) }, '편집됨') : null,
      h('span', { class: 'lp-flex' }),
      h('button', { class: 'lp-more', 'aria-label': '더보기', onclick: (e) => { e.stopPropagation(); postMenu(nav, p); } }, LM.icon('more')));
  }

  function photoMedia(nav, p, onDouble) {
    const wrap = h('div', { class: 'lp-media' });
    let i = 0;
    const draw = () => {
      wrap.replaceChildren(ui.photo(p.media[i], { ratio: '4 / 5', alt: p.media[i], caption: false }));
      if (p.media.length > 1) {
        wrap.appendChild(h('span', { class: 'lp-count' }, (i + 1) + '/' + p.media.length));
        wrap.appendChild(h('button', { class: 'lp-nav prev', 'aria-label': '이전 사진', onclick: (e) => { e.stopPropagation(); i = (i + p.media.length - 1) % p.media.length; draw(); } }, LM.icon('chevron-left')));
        wrap.appendChild(h('button', { class: 'lp-nav next', 'aria-label': '다음 사진', onclick: (e) => { e.stopPropagation(); i = (i + 1) % p.media.length; draw(); } }, LM.icon('chevron-right')));
        wrap.appendChild(h('div', { class: 'lp-dots' }, p.media.map((_, j) => h('i', { class: j === i ? 'on' : '' }))));
      }
    };
    draw();
    let last = 0;
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      const now = Date.now();
      if (now - last < 320) {
        onDouble && onDouble();
        const burst = LM.svg('<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>', 'lp-burst');
        wrap.appendChild(burst);
        setTimeout(() => burst.remove(), 650);
      }
      last = now;
    });
    return wrap;
  }

  function toggleLike(p, btn, lbl) {
    p.liked = !p.liked;
    p.likes = (p.likes || 0) + (p.liked ? 1 : -1);
    if (btn) {
      btn.classList.toggle('on', p.liked);
      btn.setAttribute('aria-pressed', p.liked);
      btn.replaceChildren(LM.icon(p.liked ? 'heart-fill' : 'heart', 'lp-ic'), p.kind === 'text' ? h('span', null, fmt(p.likes)) : null);
    }
    if (lbl) lbl.textContent = '좋아요 ' + fmt(p.likes) + '개';
  }

  function photoCard(nav, p) {
    const likeLabel = h('button', { class: 'lp-likes', onclick: () => likesSheet(nav, p) }, '좋아요 ' + fmt(p.likes || 0) + '개');
    const likeBtn = h('button', { class: 'lp-act', 'aria-label': '좋아요', 'aria-pressed': !!p.liked, onclick: () => toggleLike(p, likeBtn, likeLabel) }, LM.icon(p.liked ? 'heart-fill' : 'heart', 'lp-ic'));
    const saveBtn = h('button', { class: 'lp-act', 'aria-label': '저장', 'aria-pressed': !!p.saved, onclick: () => { p.saved = !p.saved; saveBtn.classList.toggle('on', !!p.saved); saveBtn.setAttribute('aria-pressed', !!p.saved); ui.toast(p.saved ? '저장했습니다' : '저장을 취소했습니다'); } }, LM.icon('bookmark', 'lp-ic'));
    const art = h('article', { class: 'lp-card', 'aria-label': p.author + ' 사진 게시물' },
      headRow(p, nav),
      photoMedia(nav, p, () => { if (!p.liked) toggleLike(p, likeBtn, likeLabel); }),
      h('div', { class: 'lp-acts' },
        likeBtn,
        h('button', { class: 'lp-act', 'aria-label': '댓글', onclick: () => nav.push(() => postDetail(nav, p)) }, LM.icon('comment', 'lp-ic')),
        h('button', { class: 'lp-act', 'aria-label': '공유', onclick: () => ui.share('사진 게시물') }, LM.icon('share', 'lp-ic')),
        h('span', { class: 'lp-flex' }),
        saveBtn),
      likeLabel,
      h('div', { class: 'lp-cap' }, h('button', { class: 'lp-handle', onclick: () => openProfile(nav, p.author) }, p.author), ' ', p.caption),
      p.location ? h('button', { class: 'lp-loc', onclick: () => nav.push(() => placePage(nav, p.location)) }, LM.icon('pin'), p.location) : null,
      p.tags && p.tags.length ? h('div', { class: 'lp-tags' }, p.tags.map((t) => h('button', { class: 'lp-tag', onclick: () => openProfile(nav, t) }, '@' + t))) : null,
      h('button', { class: 'lp-allc', onclick: () => nav.push(() => postDetail(nav, p)) }, '댓글 ' + ((p.comments && p.comments.length) || 0) + '개 모두 보기'));
    art.dataset.del = 'loop:' + p.id;
    return art;
  }

  function textCard(nav, p) {
    const likeBtn = h('button', { class: 'lp-act', 'aria-label': '좋아요', 'aria-pressed': !!p.liked, onclick: () => toggleLike(p, likeBtn, null) }, LM.icon(p.liked ? 'heart-fill' : 'heart', 'lp-ic'), h('span', null, fmt(p.likes || 0)));
    const reBtn = h('button', { class: 'lp-act', 'aria-label': '리포스트', 'aria-pressed': !!p.reposted, onclick: () => { p.reposted = !p.reposted; reBtn.classList.toggle('on', p.reposted); reBtn.setAttribute('aria-pressed', p.reposted); ui.toast(p.reposted ? '리포스트했습니다' : '리포스트를 취소했습니다'); } }, LM.icon('repost', 'lp-ic'), h('span', null, fmt((p.repostCount || 0) + (p.reposted ? 1 : 0))));
    const art = h('article', { class: 'lp-card lp-textcard', 'aria-label': p.author + ' 글 게시물' },
      headRow(p, nav),
      h('div', { class: 'lp-body' }, p.body),
      p.media && p.media.length ? h('div', { class: 'lp-tmedia' }, p.media.map((m) => ui.photo(m, { ratio: '1 / 1', alt: m, caption: false }))) : null,
      h('div', { class: 'lp-acts' },
        h('button', { class: 'lp-act', 'aria-label': '댓글', onclick: () => nav.push(() => postDetail(nav, p)) }, LM.icon('comment', 'lp-ic'), h('span', null, fmt(p.commentCount || (p.comments && p.comments.length) || 0))),
        reBtn,
        likeBtn,
        h('span', { class: 'lp-flex' }),
        h('button', { class: 'lp-act', 'aria-label': '저장', onclick: () => { p.saved = !p.saved; ui.toast(p.saved ? '저장했습니다' : '저장을 취소했습니다'); } }, LM.icon('bookmark', 'lp-ic'))),
      h('div', { class: 'lp-meta' }, dateAbs(p.at)));
    art.dataset.del = 'loop:' + p.id;
    return art;
  }

  let feedDraw = null;
  let feedMode = '팔로잉';

  function feed(nav) {
    const storyRow = h('div', { class: 'lp-stories' },
      storyBtn(nav, 'dohyun.lee', '내 스토리', 'own'),
      storyBtn(nav, 'seoa.film', 'seoa.film', 'seoa-3'),
      storyBtn(nav, 'jihoon_j', 'jihoon_j', 'jihoon-arch', 'seen'));
    const slot = h('div', { class: 'lp-feed' });
    const noticeSlot = h('div', { class: 'lp-noticeslot' });
    const seg = ui.segmented(['팔로잉', '추천'], feedMode, (m) => { feedMode = m; draw(); });

    const draw = () => {
      noticeSlot.replaceChildren();
      if (!LM.online()) noticeSlot.appendChild(ui.notice('오프라인 저장본 · 3/15 03:58 기준. 피드는 캐시만 보입니다.', 'warn'));
      if (feedMode === '팔로잉') {
        const list = POSTS.filter((p) => !isBlocked(p.author) && FOLLOWING.includes(p.author) && postVisible(p));
        slot.replaceChildren(...(list.length ? list.map((p) => (p.kind === 'photo' ? photoCard(nav, p) : textCard(nav, p))) : [ui.empty({ icon: 'grid', title: '게시물이 없습니다' })]));
      } else {
        const list = POSTS.filter((p) => !isBlocked(p.author) && !FOLLOWING.includes(p.author) && p.author !== 'dohyun.lee' && postVisible(p));
        slot.replaceChildren(adCard(), ...list.map((p) => (p.kind === 'photo' ? photoCard(nav, p) : textCard(nav, p))));
      }
    };
    draw();
    feedDraw = draw;

    const refresh = navBtn('refresh', '새로 고침', () => {
      if (!LM.online()) { noticeSlot.replaceChildren(ui.notice('오프라인 상태입니다. Wi-Fi에 연결하면 새로 고침할 수 있습니다.', 'warn')); ui.toast('오프라인'); }
      else { noticeSlot.replaceChildren(); ui.toast('새로 고침했습니다'); }
    });

    const dmBadge = h('span', { class: 'lp-badge' }, String(LM.read.unreadCount('loop') || ''));
    dmBadge.hidden = !LM.read.unreadCount('loop');
    const offRead = LM.on('read', () => {
      if (!dmBadge.isConnected) { offRead(); return; }
      const n = LM.read.unreadCount('loop');
      dmBadge.textContent = n ? String(n) : '';
      dmBadge.hidden = !n;
    });
    return ui.page({
      title: '루프', large: false, nav,
      right: [refresh, navBtn('search', '검색', () => nav.select(1)), h('button', { class: 'nb-btn lp-dmbtn', 'aria-label': '메시지', onclick: () => nav.push(() => dmList(nav)) }, LM.icon('send'), dmBadge)],
      body: [storyRow, seg, noticeSlot, slot],
    });
  }

  function storyBtn(nav, handle, label, key, ring) {
    return h('button', { class: 'lp-story', 'aria-label': label + ' 스토리', onclick: () => openStory(nav, key) },
      ui.avatar(avName(handle), 60, { ring: ring || true }),
      h('span', { class: 'lp-storyname' }, label));
  }

  function adCard() {
    return h('div', { class: 'lp-card lp-ad' },
      h('div', { class: 'lp-adbadge' }, '광고'),
      h('div', { class: 'lp-adbody' }, '추천 부업', h('small', null, '관심 있을 만한 콘텐츠')),
      h('button', { class: 'lp-adlink', onclick: () => ui.toast('광고입니다') }, '자세히'));
  }

  /* ---------- 게시물 상세 ---------- */
  function postDetail(nav, p) {
    const isPhoto = p.kind === 'photo';
    const commentsEl = h('div', { class: 'lp-comments' });
    const countEl = h('div', { class: 'lp-cmore' });
    const likeLabel = h('button', { class: 'lp-likes', onclick: () => likesSheet(nav, p) }, '좋아요 ' + fmt(p.likes || 0) + '개');
    const likeBtn = h('button', { class: 'lp-act', 'aria-label': '좋아요', 'aria-pressed': !!p.liked, onclick: () => toggleLike(p, likeBtn, likeLabel) }, LM.icon(p.liked ? 'heart-fill' : 'heart', 'lp-ic'));
    const renderComments = () => {
      const list = (p.comments || []).filter((c) => LM.visible(c));
      countEl.textContent = '댓글 ' + fmt(p.commentCount || list.length) + '개';
      commentsEl.replaceChildren(...(list.length ? list.map((c) => h('div', { class: 'lp-comment' + (c.deleted ? ' deleted' : '') },
        ui.avatar(avName(c.author), 32),
        h('div', { class: 'lp-ctext' },
          h('div', { class: 'lp-cmeta' }, h('button', { class: 'lp-chandle', onclick: () => openProfile(nav, c.author) }, AC[c.author] ? AC[c.author].handle : c.author), h('span', null, c.at)),
          h('div', { class: 'lp-cbody' }, c.deleted ? '삭제된 댓글입니다 · ' + c.at : c.body),
          c.pending ? h('div', { class: 'lp-pending' }, '전송 대기') : null))) : [h('div', { class: 'lp-nocomment' }, '댓글이 없습니다')]));
    };
    renderComments();

    const body = [headRow(p, nav)];
    if (isPhoto) {
      body.push(photoMedia(nav, p, () => { if (!p.liked) toggleLike(p, likeBtn, likeLabel); }));
      body.push(h('div', { class: 'lp-acts' },
        likeBtn,
        h('button', { class: 'lp-act', 'aria-label': '댓글', onclick: () => { const i = nav.root.querySelector('.lp-composer input'); if (i) i.focus(); } }, LM.icon('comment', 'lp-ic')),
        h('button', { class: 'lp-act', 'aria-label': '공유', onclick: () => ui.share('사진 게시물') }, LM.icon('share', 'lp-ic')),
        h('span', { class: 'lp-flex' }),
        h('button', { class: 'lp-act', 'aria-label': '저장', onclick: () => { p.saved = !p.saved; ui.toast(p.saved ? '저장했습니다' : '저장을 취소했습니다'); } }, LM.icon('bookmark', 'lp-ic'))));
      body.push(likeLabel);
      body.push(h('div', { class: 'lp-cap' }, h('button', { class: 'lp-handle', onclick: () => openProfile(nav, p.author) }, p.author), ' ', p.caption));
      if (p.location) body.push(h('button', { class: 'lp-loc', onclick: () => nav.push(() => placePage(nav, p.location)) }, LM.icon('pin'), p.location));
      if (p.tags && p.tags.length) body.push(h('div', { class: 'lp-tags' }, p.tags.map((t) => h('button', { class: 'lp-tag', onclick: () => openProfile(nav, t) }, '@' + t))));
      body.push(h('div', { class: 'lp-meta' }, dateAbs(p.at)));
    } else {
      body.push(h('div', { class: 'lp-body lp-detailbody' }, p.body));
      if (p.media && p.media.length) body.push(h('div', { class: 'lp-tmedia' }, p.media.map((m) => ui.photo(m, { ratio: '1 / 1', alt: m, caption: false }))));
      const reBtn = h('button', { class: 'lp-act', 'aria-label': '리포스트', 'aria-pressed': !!p.reposted, onclick: () => { p.reposted = !p.reposted; reBtn.classList.toggle('on', p.reposted); ui.toast(p.reposted ? '리포스트했습니다' : '리포스트를 취소했습니다'); } }, LM.icon('repost', 'lp-ic'), h('span', null, fmt(p.repostCount || 0)));
      body.push(h('div', { class: 'lp-acts' },
        h('button', { class: 'lp-act', 'aria-label': '댓글', onclick: () => { const i = nav.root.querySelector('.lp-composer input'); if (i) i.focus(); } }, LM.icon('comment', 'lp-ic'), h('span', null, fmt(p.commentCount || 0))),
        reBtn, likeBtn,
        h('button', { class: 'lp-act', 'aria-label': '인용', onclick: () => ui.toast('인용 화면(프로토타입)') }, LM.icon('edit', 'lp-ic')),
        h('span', { class: 'lp-flex' }),
        h('button', { class: 'lp-act', 'aria-label': '저장', onclick: () => { p.saved = !p.saved; ui.toast(p.saved ? '저장했습니다' : '저장을 취소했습니다'); } }, LM.icon('bookmark', 'lp-ic'))));
      body.push(h('div', { class: 'lp-meta' }, dateAbs(p.at) + (p.edited ? ' · 편집됨' : '')));
    }
    body.push(h('div', { class: 'lp-cmore-wrap' }, countEl));
    body.push(commentsEl);

    const inp = h('input', { type: 'text', placeholder: '답글 달기…', 'aria-label': '답글' });
    const send = h('button', { class: 'lp-send', onclick: () => sendComment(p, inp, renderComments) }, '게시');
    const footer = h('div', { class: 'lp-composer' }, inp, send);
    const page = ui.page({ title: '게시물', back: '뒤로', nav, large: false, body: [h('div', { data: { del: 'loop:' + p.id } }, body)], footer });
    return page;
  }

  function sendComment(p, inp, render) {
    const text = inp.value.trim();
    if (!text) return;
    p.comments = p.comments || [];
    p.comments.push({ author: S.account, at: '지금', body: text, pending: !LM.online() });
    p.commentCount = (p.commentCount || 0) + 1;
    inp.value = '';
    render();
    ui.toast(LM.online() ? '댓글을 남겼습니다' : '오프라인 · 연결되면 전송됩니다');
  }

  function likesSheet(nav, p) {
    const list = p.likesList || [{ handle: 'campus.bowl', at: p.at }, { handle: 'library.seat', at: p.at }, { handle: 'night.bus', at: p.at }];
    const rows = list.map((l) => ui.row({ title: AC[l.handle] ? AC[l.handle].handle : l.handle, meta: l.at, avatar: avName(l.handle), avatarSize: 44, onClick: (e) => { const w = e.target.closest('.sheet-wrap'); if (w) w.close(); openProfile(nav, l.handle); } }));
    ui.sheet(nav.root, ui.sheetPage({ title: '좋아요 ' + fmt(p.likes || 0) + '개', body: ui.group({ plain: true, rows }) }), { size: 'medium' });
  }

  function editHistory(nav, p) {
    if (!p.editHistory) { ui.toast('편집 기록이 없습니다'); return; }
    const rows = p.editHistory.filter((e) => LM.visible(e)).map((e) => h('div', { class: 'lp-editrow' }, h('b', null, e.from), h('span', null, '→ ' + e.to), h('small', null, e.at)));
    ui.sheet(nav.root, ui.sheetPage({ title: '편집 기록', body: h('div', { class: 'lp-editbox' }, rows) }), { size: 'medium' });
  }

  function postMenu(nav, p) {
    const actions = [];
    if (p.kind === 'text') actions.push({ label: '인용하기', onClick: () => ui.toast('인용 화면(프로토타입)') });
    if (p.kind === 'photo') actions.push({ label: '공유', onClick: () => ui.share('사진 게시물') });
    actions.push({ label: p.saved ? '저장 취소' : '저장', onClick: () => { p.saved = !p.saved; ui.toast(p.saved ? '저장했습니다' : '저장을 취소했습니다'); } });
    if (p.edited) actions.push({ label: '편집 기록 보기', onClick: () => editHistory(nav, p) });
    actions.push({ label: '이 게시물 정보', onClick: () => ui.info('게시물 정보', [['작성자', p.author], ['시각', p.at], ['종류', p.kind === 'photo' ? '사진 게시물' : '글 게시물']]) });
    ui.actionSheet({ actions });
  }

  /* ---------- 스토리 ---------- */
  function openStory(nav, key) {
    const st = STORIES[key];
    if (!st) return;
    if (!LM.online()) { ui.toast('스토리는 온라인이 필요합니다'); return; }
    const wrap = h('div', { class: 'lp-storyview', role: 'dialog', 'aria-modal': 'true' });
    const close = () => wrap.remove();
    const head = h('div', { class: 'lp-storyhead' },
      ui.avatar(avName(st.author), 32),
      h('div', { class: 'lp-storywho' }, h('b', null, AC[st.author] ? AC[st.author].handle : st.author), h('small', null, st.at + (st.own ? ' · 보관된 스토리' : st.archived ? ' · 지난 스토리' : ''))),
      h('button', { class: 'lp-storyclose', 'aria-label': '닫기', onclick: close }, LM.icon('close')));
    const media = st.black
      ? h('div', { class: 'lp-story-black' }, h('span', null, st.text))
      : h('div', { class: 'lp-story-media' }, ui.photo(st.media, { ratio: '9 / 16', alt: st.media, caption: false }), st.text ? h('div', { class: 'lp-story-cap' }, st.text) : null);
    if (st.location) media.appendChild(h('button', { class: 'lp-story-loc', onclick: () => { close(); nav.push(() => placePage(nav, st.location)); } }, LM.icon('pin'), st.location));
    const foot = st.own
      ? h('div', { class: 'lp-storyfoot' }, h('button', { class: 'lp-viewers', onclick: () => openViewers(nav, st) }, LM.icon('eye'), '조회자 ' + (st.viewers.length + (st.viewerMore || 0))))
      : h('div', { class: 'lp-storyfoot' }, h('input', { placeholder: '답장…', 'aria-label': '스토리 답장' }), h('button', { class: 'lp-send', onclick: () => ui.toast(LM.online() ? '답장을 보냈습니다' : '온라인이 필요합니다') }, '보내기'));
    wrap.append(h('div', { class: 'lp-prog' }, h('i')), head, media, foot);
    nav.root.appendChild(wrap);
  }

  function openViewers(nav, st) {
    const rows = st.viewers.map((v) => ui.row({ title: AC[v.handle] ? AC[v.handle].handle : v.handle, meta: v.at, avatar: avName(v.handle), avatarSize: 56, onClick: (e) => {
      const w = e.target.closest('.sheet-wrap'); if (w) w.close();
      nav.root.querySelectorAll('.lp-storyview').forEach((el) => el.remove());
      openProfile(nav, v.handle);
    } }));
    if (st.viewerMore) rows.push(ui.row({ title: '외 ' + st.viewerMore + '명', dim: true, avatar: '?', avatarSize: 56 }));
    ui.sheet(nav.root, ui.sheetPage({ title: '조회자 ' + (st.viewers.length + (st.viewerMore || 0)) + '명', body: ui.group({ plain: true, rows }) }), { size: 'medium' });
  }

  /* ---------- 장소 ---------- */
  function placePage(nav, name) {
    const place = PLACES[name] || { address: '', count: 0 };
    const posts = POSTS.filter((p) => p.location === name && !isBlocked(p.author));
    const cells = posts.map((p) => h('button', { class: 'lp-cell', 'aria-label': p.caption, onclick: () => nav.push(() => postDetail(nav, p)) }, ui.photo(p.media[0], { ratio: '1 / 1', alt: p.caption, caption: false })));
    if (name === '리버뷰타워') {
      for (let i = cells.length; i < place.count; i++) cells.push(h('button', { class: 'lp-cell', onclick: () => ui.toast('게시물입니다') }, ui.photo('리버뷰타워 입주민 ' + i, { ratio: '1 / 1', alt: '입주민 게시물', caption: false }))); // 입주민 게시물 자리표시
    }
    return ui.page({
      title: name, back: '뒤로', nav, large: false,
      body: [h('div', { class: 'lp-placehead' }, h('b', null, name), h('span', null, place.address), h('small', null, '게시물 ' + place.count + '개')),
        cells.length ? h('div', { class: 'lp-grid3' }, cells) : ui.empty({ icon: 'pin', title: '게시물이 없습니다', text: '이 장소를 태그한 공개 게시물이 없습니다.' })],
    });
  }

  /* ---------- 프로필 ---------- */
  let selfProfileDraw = null;

  function openProfile(nav, handle) {
    if (AC[handle] && AC[handle].t2 && !LM.online()) { ui.toast('온라인이 필요합니다'); return; }
    if (!AC[handle] && !POSTS.some((p) => p.author === handle)) { ui.toast('계정을 찾을 수 없습니다'); return; }
    nav.push(() => otherProfile(nav, handle));
  }

  function selfProfile(nav) {
    const box = h('div', { class: 'lp-prof' });
    const draw = () => { box.replaceChildren(...profileContent(nav, S.account, () => draw())); };
    draw();
    selfProfileDraw = draw;
    const more = h('button', { class: 'nb-btn', 'aria-label': '더보기', onclick: () => selfMenu(nav, () => draw()) }, LM.icon('more'));
    return ui.page({ title: '프로필', large: false, nav, right: more, body: box });
  }

  function otherProfile(nav, handle) {
    const box = h('div', { class: 'lp-prof' });
    const draw = () => { box.replaceChildren(...profileContent(nav, handle, () => draw())); };
    draw();
    const more = h('button', { class: 'nb-btn', 'aria-label': '더보기', onclick: () => profileMenu(nav, handle, () => draw()) }, LM.icon('more'));
    return ui.page({ title: '@' + handle, back: '뒤로', nav, large: false, right: more, body: box });
  }

  function profileContent(nav, handle, redraw) {
    const ac = AC[handle] || { handle, name: handle, followers: 0, following: 0, posts: 0 };
    const me = S.account === handle;
    const locked = (ac.private && !me) || (handle === 'dontknow__' && !me);
    const blocked = isBlocked(handle) && !me;
    const out = [];

    out.push(h('div', { class: 'lp-phead' },
      ui.avatar(avName(handle), 86, (HIGHLIGHTS[handle] && HIGHLIGHTS[handle].length) ? { ring: true } : null),
      h('div', { class: 'lp-pinfo' },
        h('button', { class: 'lp-pname', onclick: () => { if (me) accountSwitch(nav, redraw); } }, ac.handle, ac.private ? h('span', { class: 'lp-lockico' }, LM.icon('lock')) : null),
        ac.name && ac.name !== ac.handle ? h('div', { class: 'lp-psubname' }, ac.name) : null,
        ac.bio ? h('div', { class: 'lp-pbio' }, ac.bio) : null,
        me ? h('button', { class: 'lp-switch', onclick: () => accountSwitch(nav, redraw) }, '계정 전환') : null)));
    out.push(h('div', { class: 'lp-stats' },
      stat(fmt(ac.posts), '게시물'), stat(fmt(ac.followers), '팔로워'), stat(fmt(ac.following), '팔로잉')));
    if (handle === 'jh_lee_99') out.push(h('div', { class: 'lp-mutual' }, '함께 아는 계정 3명'));

    if (blocked) {
      out.push(ui.notice('차단한 계정입니다. 게시물·스토리·하이라이트가 숨겨집니다.', 'warn'));
      out.push(ui.button({ label: '차단 해제', kind: 'tinted', size: 's', onClick: () => { S.blocked.delete(handle); ui.toast('차단을 해제했습니다'); if (feedDraw) feedDraw(); redraw(); } }));
      return out;
    }
    if (locked) {
      out.push(h('div', { class: 'lp-locked' }, LM.icon('lock'), h('b', null, '비공개 계정'), h('span', null, '팔로우한 사람만 게시물을 볼 수 있습니다.')));
      out.push(h('div', { class: 'lp-lockstats' }, stat(fmt(ac.posts), '게시물'), stat(fmt(ac.followers), '팔로워'), stat(fmt(ac.following), '팔로잉')));
      if (!me) out.push(ui.button({ label: LM.online() ? '계정 전환으로 로그인' : '로그인은 온라인에서', kind: 'gray', size: 's', onClick: () => { if (LM.online()) accountSwitch(nav, redraw); else ui.toast('온라인이 필요합니다'); } }));
      return out;
    }

    if (handle === 'moneycoach.kang') out.push(h('div', { class: 'lp-faceoff' }, LM.icon('eye-off'), '얼굴 없음 · 손·시계·차·사무실만'));
    if (HIGHLIGHTS[handle]) out.push(highlightRow(nav, handle));
    if (handle === 'dohyun.lee' && !blocked) {
      const pin = POSTS.find((p) => p.pinned);
      out.push(h('button', { class: 'lp-pin', onclick: () => nav.push(() => postDetail(nav, pin)) },
        ui.photo(pin.media[0], { ratio: '1 / 1', alt: pin.caption, caption: false }),
        h('div', { class: 'lp-pintext' }, h('span', { class: 'lp-pinbadge' }, LM.icon('pin'), '고정 게시물'), h('b', null, pin.caption), h('small', null, 'seoa.film 태그됨'))));
    }

    const posts = accountPosts(handle);
    if (locked) return out;
    const tabs = ui.segmented(['격자', '글'], '격자', (m) => { ac._tab = m; redraw(); });
    /* segmented는 지역 상태를 다시 그리므로 content를 다시 만들 때 선택이 유지되도록 저장 */
    if (ac._tab) {
      tabs.querySelectorAll('.seg-i').forEach((b) => { const on = b.textContent === ac._tab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    }
    out.push(tabs);
    const tab = ac._tab || '격자';
    if (tab === '격자') {
      const photos = posts.filter((p) => p.kind === 'photo');
      out.push(photos.length ? h('div', { class: 'lp-grid3' }, photos.map((p) => { const b = h('button', { class: 'lp-cell', 'aria-label': p.caption || p.body, onclick: () => nav.push(() => postDetail(nav, p)) }, ui.photo(p.media[0], { ratio: '1 / 1', alt: p.caption || p.body, caption: false })); b.dataset.del = 'loop:' + p.id; return b; })) : ui.empty({ icon: 'grid', title: '사진이 없습니다' }));
    } else {
      const texts = posts.filter((p) => p.kind === 'text');
      out.push(texts.length ? h('div', { class: 'lp-plist' }, texts.map((p) => h('button', { class: 'lp-plist-row', onclick: () => nav.push(() => postDetail(nav, p)) }, h('span', null, p.body), h('small', null, p.at)))) : ui.empty({ icon: 'edit', title: '게시물이 없습니다' }));
    }
    return out;
  }

  const stat = (n, l) => h('div', { class: 'lp-stat' }, h('b', null, n), h('span', null, l));

  function highlightRow(nav, handle) {
    return h('div', { class: 'lp-highlights' }, HIGHLIGHTS[handle].map((hl) => h('button', { class: 'lp-hl', onclick: () => openStory(nav, hl.key) }, ui.avatar(avName(handle), 64, { ring: true }), h('span', null, hl.title))));
  }

  function accountPosts(handle) {
    if (handle === 'side.money.kr') {
      return Array.from({ length: 6 }, (_, i) => ({ id: 'side-' + i, kind: 'photo', author: 'side.money.kr', at: '2025.09', caption: '부업 추천', media: ['부업 추천 카드 ' + (i + 1)], watermark: 'side.money.kr', likes: 0, comments: [] }));
    }
    if (handle === 'dontknow__') return DK_POSTS.filter(postVisible);
    return POSTS.filter((p) => p.author === handle && postVisible(p));
  }

  function selfMenu(nav, redraw) {
    ui.actionSheet({
      actions: [
        { label: '계정 전환', onClick: () => accountSwitch(nav, redraw) },
        { label: '차단 목록', onClick: () => nav.push(() => blockedPage(nav, redraw)) },
        { label: '이 계정 정보', onClick: () => accountInfo(nav, S.account) },
      ],
    });
  }

  function profileMenu(nav, handle, redraw) {
    const actions = [{ label: '이 계정 정보', onClick: () => accountInfo(nav, handle) }];
    if (S.account !== handle) {
      if (isBlocked(handle)) actions.push({ label: '차단 해제', onClick: () => { S.blocked.delete(handle); ui.toast('차단을 해제했습니다'); if (feedDraw) feedDraw(); redraw(); } });
      else actions.push({ label: '차단', destructive: true, onClick: () => { S.blocked.add(handle); ui.toast('차단했습니다'); if (feedDraw) feedDraw(); redraw(); } });
    }
    ui.actionSheet({ actions });
  }

  function accountSwitch(nav, redraw) {
    const body = ui.group({ plain: true, rows: [
      ui.row({ title: 'dohyun.lee', subtitle: '현재 로그인', avatar: '이도현', avatarSize: 56, accessory: LM.icon('check', 'row-check'), onClick: () => { const w = nav.root.querySelector('.sheet-wrap'); if (w) w.close(); } }),
      ui.row({ title: 'dontknow__', subtitle: '최근 로그인한 계정 · 비공개 · 게시물 23 · 팔로워 7', avatar: '도현', avatarSize: 56, icon: 'lock', onClick: (e) => {
        if (S.account === 'dontknow__') { S.account = 'dohyun.lee'; ui.toast('dohyun.lee로 돌아왔습니다'); if (selfProfileDraw) selfProfileDraw(); const w = e.target.closest('.sheet-wrap'); if (w) w.close(); return; }
        if (!LM.online()) { ui.toast('계정 전환은 온라인에서만 할 수 있습니다'); return; }
        const w = e.target.closest('.sheet-wrap'); if (w) w.close();
        ui.actionSheet({ title: '@dontknow__ 로그인', text: '인증 코드가 dk.nowhere@mailbox.kr로 전송됩니다.', actions: [
          { label: '코드 보내기', onClick: () => { S.account = 'dontknow__'; ui.toast('로그인했습니다 · 새 기기 로그인 알림이 슬레이트에도 갔습니다'); if (selfProfileDraw) selfProfileDraw(); if (redraw) redraw(); } },
        ] });
      } }),
    ] });
    ui.sheet(nav.root, ui.sheetPage({ title: '계정 전환', cancel: '취소', body }), { size: 'medium' });
  }

  function accountInfo(nav, handle) {
    const ac = AC[handle] || { handle };
    const rows = [h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '가입일'), h('span', { class: 'kv-v' }, ac.joined || '없음'))];
    (ac.prev || []).forEach(([n, period]) => rows.push(h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '이전 사용자 이름'), h('span', { class: 'kv-v' }, n + ' · ' + period))));
    ui.sheet(nav.root, ui.sheetPage({ title: '계정 정보', body: ui.group({ rows }) }), { size: 'medium' });
  }

  function blockedPage(nav, redraw) {
    const box = h('div');
    const draw = () => {
      const list = Array.from(S.blocked);
      box.replaceChildren(list.length ? ui.group({ plain: true, rows: list.map((handle) => h('div', { class: 'lp-blockrow' },
        h('button', { class: 'lp-blockwho', onclick: () => nav.push(() => otherProfile(nav, handle)) }, ui.avatar(avName(handle), 56), h('span', null, handle)),
        h('button', { class: 'lp-unblock', onclick: () => { S.blocked.delete(handle); ui.toast('차단을 해제했습니다'); draw(); if (feedDraw) feedDraw(); if (redraw) redraw(); } }, '차단 해제'))) }) : ui.empty({ icon: 'shield', title: '차단한 계정이 없습니다' }));
    };
    draw();
    return ui.page({ title: '차단 목록', back: '프로필', nav, large: false, body: box });
  }

  /* ---------- 검색 ---------- */
  function searchTab(nav) {
    if (!LM.online()) {
      return ui.page({ title: '검색', nav, body: ui.empty({ icon: 'wifi', title: '온라인이 필요합니다', text: '오프라인에서는 피드·프로필·활동 기록만 볼 수 있습니다.' }) });
    }
    const results = h('div', { class: 'lp-searchres' });
    const input = ui.search('검색', (q) => draw(q));
    const draw = (q) => {
      const query = (q || '').trim().toLowerCase();
      const out = [];
      out.push(LM.online() ? null : ui.notice('오프라인 저장본 · 계정·태그·장소를 캐시에서만 찾습니다.', 'warn'));
      if (!query) {
        out.push(h('div', { class: 'lp-trendhead' }, '지금 성원에서'));
        out.push(ui.group({ plain: true, rows: [
          ['1', '성원대교', '성원구'], ['2', '해담', '성원구청'], ['3', '성원구청역', '성원구'], ['4', '한서대', '성원구'], ['5', '리버뷰타워', '성원구'],
        ].map(([n, name, area]) => ui.row({ title: n + '  ' + name, subtitle: area, onClick: () => name === '리버뷰타워' ? nav.push(() => placePage(nav, name)) : ui.toast('장소·태그(프로토타입)') })) }));
        out.push(h('div', { class: 'lp-trendhead' }, '사진'));
        const photos = POSTS.filter((p) => p.kind === 'photo' && !isBlocked(p.author) && postVisible(p));
        out.push(h('div', { class: 'lp-grid3' }, photos.map((p) => h('button', { class: 'lp-cell', onclick: () => nav.push(() => postDetail(nav, p)) }, ui.photo(p.media[0], { ratio: '1 / 1', alt: p.caption, caption: false })))));
      } else {
        const accts = Object.values(AC).filter((a) => !isBlocked(a.handle) && !a.t2 && (a.private ? false : (a.handle.toLowerCase().includes(query) || String(a.name).toLowerCase().includes(query))));
        if (accts.length) out.push(ui.group({ header: '계정', plain: true, rows: accts.map((a) => ui.row({ title: a.handle, subtitle: a.name, avatar: avName(a.handle), avatarSize: 44, onClick: () => openProfile(nav, a.handle) })) }));
        const places = Object.keys(PLACES).filter((n) => n.includes(query));
        if (places.length) out.push(ui.group({ header: '장소', plain: true, rows: places.map((n) => ui.row({ title: n, subtitle: PLACES[n].address + ' · 게시물 ' + PLACES[n].count, icon: 'pin', onClick: () => nav.push(() => placePage(nav, n)) })) }));
        const tags = ['성원', '고액알바', '리버뷰타워', '자취'].filter((t) => t.includes(query));
        if (tags.length) out.push(ui.group({ header: '태그', plain: true, rows: tags.map((t) => ui.row({ title: '#' + t, subtitle: '게시물', onClick: () => ui.toast('태그 페이지(프로토타입)') })) }));
        const posts = POSTS.filter((p) => !isBlocked(p.author) && postVisible(p) && ((p.body || '') + ' ' + (p.caption || '') + ' ' + (p.media || []).join(' ')).toLowerCase().includes(query));
        if (posts.length) out.push(ui.group({ header: '게시물', plain: true, rows: posts.map((p) => ui.row({ title: p.caption || p.body, subtitle: p.author, meta: p.at, onClick: () => nav.push(() => postDetail(nav, p)) })) }));
        if (accts.length + places.length + tags.length + posts.length === 0) out.push(ui.empty({ icon: 'search', title: '결과 없음', text: '이전 사용자 이름으로는 검색되지 않습니다.' }));
      }
      results.replaceChildren(...out.filter(Boolean));
    };
    draw('');
    return ui.page({ title: '검색', nav, body: [input, results] });
  }

  /* ---------- 만들기 ---------- */
  function createTab(nav) {
    let kind = '사진';
    const area = h('div');
    const draw = () => {
      area.replaceChildren(
        LM.online() ? null : ui.notice('오프라인에서는 게시할 수 없습니다. 입력은 초안으로 남습니다.', 'warn'),
        ui.segmented(['사진', '글'], kind, (m) => { kind = m; draw(); }),
        kind === '사진'
          ? h('div', { class: 'lp-picker' }, Array.from({ length: 6 }, (_, i) => h('button', { class: 'lp-pick', 'aria-label': '사진 선택', onclick: () => ui.toast('사진 선택(프로토타입)') }, ui.photo('새 게시물 사진 ' + i, { ratio: '1 / 1', alt: '사진', caption: false }))))
          : null,
        h('textarea', { class: 'lp-captionfield', placeholder: kind === '사진' ? '문구를 입력하세요' : '무슨 일이 있었나요?', maxlength: '300', 'aria-label': '본문' }),
        h('div', { class: 'lp-createfoot' }, h('span', null, '300자'), ui.button({ label: '게시', kind: LM.online() ? 'filled' : 'gray', size: 's', onClick: () => ui.toast(LM.online() ? '게시했습니다(프로토타입)' : '온라인이 필요합니다') })));
    };
    draw();
    return ui.page({ title: '만들기', large: false, nav, body: area });
  }

  /* ---------- 활동 ---------- */
  function activityTab(nav) {
    let mode = '내 활동';
    const body = h('div');
    const draw = () => {
      if (mode === '활동') {
        body.replaceChildren(ui.empty({ icon: 'heart', title: '활동이 없습니다', text: '새 좋아요·댓글·팔로우 알림이 여기에 표시됩니다.' }));
      } else {
        body.replaceChildren(h('div', { class: 'lp-actlist' }, ACTIVITY.filter((a) => LM.visible(a)).map((a) => h('button', { class: 'lp-actrow', onclick: a.target ? () => nav.push(() => postDetail(nav, byId(a.target))) : null },
          h('span', { class: 'lp-activicon' }, LM.icon(a.icon)),
          h('span', { class: 'lp-actrowtext' }, a.text, h('small', null, a.meta))))));
      }
    };
    draw();
    return ui.page({ title: '활동', large: false, nav, body: [ui.segmented(['활동', '내 활동'], mode, (m) => { mode = m; draw(); }), body] });
  }

  /* ---------- DM ---------- */
  const THREADS = [
    { id: 'jihoon', name: '지훈', handle: 'jihoon_j', last: '게시물을 공유했습니다', at: '1/8 21:14', unread: 1 },
    { id: 'seoa', name: '서아', handle: 'seoa.film', last: '그날 얘기 조금만 더 할 수 있어?', at: '3/14 20:44', unread: 0 },
    { id: 'harin', name: '박하린', handle: 'harin.daily', last: '초안: 죄송합니다. 그 계좌 제 계…', at: '3/11 02:40', unread: 0 },
  ];
  const DRAFTS = { harin: '죄송합니다. 그 계좌 제 계좌예요. 돈은 제가 어떻게든…' };
  THREADS.forEach((t) => { t.threadId = t.id; t.itemId = 'loopdm:' + t.id; });
  LM.read.register('loop', () => THREADS.filter((t) => t.unread > 0).map((t) => ({ id: t.itemId, threadId: t.id }))
    .concat(LM.msg.list('loop', 'dm').filter((m) => m.from !== 'out').map((m) => ({ id: m.id, threadId: 'dm' }))));

  function dmList(nav) {
    if (!LM.online()) {
      return ui.page({ title: '메시지', back: '루프', nav, large: false, body: ui.empty({ icon: 'wifi', title: '온라인이 필요합니다', text: '오프라인에서는 DM을 열 수 없습니다.' }) });
    }
    const host = h('div');
    const draw = () => {
      host.replaceChildren(ui.group({ plain: true, rows: THREADS.map((t) => ui.row({
        title: t.name, subtitle: t.last, meta: t.at, avatar: avName(t.handle), avatarSize: 56,
        badge: LM.read.isUnread('loop', t.itemId) ? 1 : null,
        onClick: () => nav.push(() => dmRoom(nav, t)),
      })) }));
    };
    draw();
    const offRead = LM.on('read', () => { if (host.isConnected) draw(); else offRead(); });
    return ui.page({
      title: '메시지', back: '루프', nav, large: false,
      right: h('button', { class: 'nb-btn', 'aria-label': '새 메시지', onclick: () => ui.toast('새 메시지(프로토타입)') }, LM.icon('compose')),
      body: host,
    });
  }

  function dmRoom(nav, t) {
    if (!LM.online()) {
      return ui.page({ title: t.name, back: '메시지', nav, large: false, body: ui.empty({ icon: 'wifi', title: '온라인이 필요합니다' }) });
    }
    const bubbles = h('div', { class: 'lp-bubbles' });
    const addBubble = (who, text, at, shared) => {
      bubbles.appendChild(h('div', { class: 'lp-brow ' + (who === 'me' ? 'me' : '') },
        who === 'me' ? null : ui.avatar(avName(t.handle), 28),
        h('div', { class: 'lp-bcol' },
          shared ? h('button', { class: 'lp-sharecard', onclick: () => ui.toast('원본 게시물(프로토타입)') },
            ui.photo(shared.media, { ratio: '16 / 9', alt: '부업 추천 카드', caption: false }),
            h('span', null, shared.title), h('small', null, 'side.money.kr')) : h('div', { class: 'lp-bubble' }, text),
          h('small', { class: 'lp-btime' }, at))));
    };
    const draw = () => {
      bubbles.replaceChildren();
      if (t.id === 'jihoon') {
        bubbles.appendChild(h('div', { class: 'lp-datediv' }, '1/8'));
        addBubble('them', '', '21:14', { media: '부업 추천 카드', title: '부업 추천' });
      } else if (t.id === 'seoa') {
        bubbles.appendChild(h('div', { class: 'lp-datediv' }, '3/14'));
        addBubble('them', '그날 얘기 조금만 더 할 수 있어?', '20:44');
      } else {
        bubbles.appendChild(h('div', { class: 'lp-datediv' }, '3/11'));
        bubbles.appendChild(h('div', { class: 'lp-draftnote' }, '보내지 못한 초안'));
      }
      LM.msg.list('loop', t.id).forEach((m) => addBubble(m.from === 'out' ? 'me' : 'them', m.text, LM.fmt.date(m.at, 'hm')));
    };
    draw();
    const inp = h('input', { type: 'text', placeholder: '메시지…', 'aria-label': '메시지', value: DRAFTS[t.id] || '' });
    inp.addEventListener('input', () => { DRAFTS[t.id] = inp.value; });
    const send = h('button', { class: 'lp-send', onclick: () => {
      const v = inp.value.trim();
      if (!v) return;
      if (!LM.online()) { ui.toast('온라인이 필요합니다'); return; }
      LM.msg.add('loop', t.id, { from: 'out', text: v, at: LM.G.gameMs, silent: true });
      inp.value = ''; DRAFTS[t.id] = '';
      draw();
      bubbles.scrollTop = bubbles.scrollHeight;
    } }, '보내기');
    const footer = h('div', { class: 'lp-composer' }, inp, send);
    const page = ui.page({ title: t.name, back: '메시지', nav, large: false, body: bubbles, footer });
    LM.read.mark('loop', t.itemId);
    const offRead = LM.on('read', (e) => { if (!bubbles.isConnected) { offRead(); return; } if (!e || !e.appId || e.appId === 'loop') draw(); });
    const offMsg = LM.on('msg', (e) => { if (!bubbles.isConnected) { offMsg(); return; } if (e.appId === 'loop' && e.threadId === t.id) { LM.read.mark('loop', t.itemId); draw(); } });
    setTimeout(() => { const s = page.scroller; if (s) s.scrollTop = s.scrollHeight; }, 0);
    return page;
  }

  LM.searchSources.push({
    app: 'loop',
    items: () => LM.online() ? [
      ...Object.values(AC).filter((a) => !isBlocked(a.handle) && !a.t2).map((a) => ({ title: a.handle, sub: '루프 계정', text: a.handle + ' ' + a.name })),
      ...Object.keys(PLACES).map((n) => ({ title: n, sub: '루프 장소', text: n })),
      ...POSTS.filter((p) => !isBlocked(p.author) && postVisible(p)).map((p) => ({ title: p.caption || p.body, sub: '루프 게시물', text: (p.caption || '') + ' ' + (p.body || '') })),
    ] : [],
  });
})();
