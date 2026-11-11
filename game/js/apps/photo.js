/* 사진 — 설계: design/03-features/MEDIA_SPECIFICATION.md 1절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-PHOTO-*, ICONOGRAPHY_AND_IMAGERY.md 6절 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const BURST_KEY = '리버뷰타워 지하 2층 주차장 검은 SUV';

  const P = (id, key, title, info, o) => Object.assign({ id, key, title, info }, o || {});

  const RECENT = [
    P('family', '가족사진 2019 늦여름 성원아파트', '가족사진', [
      ['촬영', '2019년 늦여름'], ['위치', '성원아파트'], ['기기', '도현의 폰'], ['앨범', '최근 항목'],
    ]),
    P('group', '리버뷰타워 1월 단체사진 저녁', '단체사진', [
      ['촬영', '2026.01.20 15:02'], ['위치', '리버뷰타워'], ['기기', '도현의 폰'], ['편집됨', '예 · 원본 5명'],
    ], { edited: true }),
    P('burst', BURST_KEY, '버스트', [
      ['촬영', '2026.03.14 20:02'], ['위치', '리버뷰타워 지하 2층 주차장'], ['기기', '도현의 폰'], ['버스트', '18장'],
    ], { burst: 18 }),
    P('shot1', '블링크 캡처 그만둘게요 장난하냐', '스크린샷', [
      ['촬영', '2026.03.10 14:21'], ['위치', '없음'], ['기기', '도현의 폰'], ['앨범', '스크린샷'],
    ]),
    P('shot2', '굿잡 모집 공고 캡처 side.money.kr', '스크린샷', [
      ['촬영', '2026.01.08'], ['위치', '없음'], ['기기', '도현의 폰'], ['앨범', '스크린샷'],
    ]),
    // 자리표시(캐논 없음): 최근 항목의 노이즈 사진.
    P('noise1', '성원대교 노을 산책', '성원대교', [
      ['촬영', '2025.10.03 18:40'], ['위치', '성원대교'], ['기기', '도현의 폰'], ['앨범', '최근 항목'],
    ]),
    P('noise2', '카페 창가 커피', '카페', [
      ['촬영', '2026.02.14 15:12'], ['위치', '성원구청 일대'], ['기기', '도현의 폰'], ['앨범', '최근 항목'],
    ]),
  ];

  const SHOT_NAMES = [
    ['shot1', '블링크 캡처', '2026.03.10 14:21'],
    ['shot2', '굿잡 모집 공고', '2026.01.08'],
  ];
  const SHOTS = SHOT_NAMES.map(([id, name, when]) => P(id, name + ' 스크린샷', name, [
    ['촬영', when], ['위치', '없음'], ['기기', '도현의 폰'], ['앨범', '스크린샷'],
  ]));
  // 자리표시(캐논 없음): 스크린샷 앨범의 나머지 캡처. 캐논은 "증거 캡처 12장"만 정한다.
  const SHOT_LABELS = ['은행 화면', '거래 내역', '메모', '지도', '웨이브 검색', '모아 글', '튜브 화면', '활동 기록', '계약서', '택시 영수증'];
  for (let n = 0; n < 10; n++) {
    SHOTS.push(P('shot-x' + n, SHOT_LABELS[n] + ' 캡처', SHOT_LABELS[n], [
      ['촬영', '2026.03.' + String(2 + (n % 8)).padStart(2, '0')], ['위치', '없음'], ['기기', '도현의 폰'], ['앨범', '스크린샷'],
    ]));
  }

  // 자리표시(캐논 없음): 사진 자리표시의 색만 다르게. 캐논은 "한결 우편 3장 + 채무조정서"만 정한다.
  const HIDDEN = [
    P('h1', '한결 우편 독촉 우편 1', '한결 우편', [['촬영', '2023.11.20'], ['위치', '없음'], ['기기', '도현의 폰'], ['앨범', '숨김 · 한결 우편']]),
    P('h2', '한결 우편 독촉 우편 2', '한결 우편', [['촬영', '2023.11.20'], ['위치', '없음'], ['기기', '도현의 폰'], ['앨범', '숨김 · 한결 우편']]),
    P('h3', '한결 우편 독촉 우편 3', '한결 우편', [['촬영', '2023.11.20'], ['위치', '없음'], ['기기', '도현의 폰'], ['앨범', '숨김 · 한결 우편']]),
    P('h4', '채무조정서 2024 02', '채무조정서', [['촬영', '2024.02'], ['위치', '없음'], ['기기', '도현의 폰'], ['앨범', '숨김 · 한결 우편']]),
  ];

  const ROOM = P('room', '청운고시원 304호 방 문 번호판', '청운고시원 304호', [
    ['촬영', '2026.03.01 14:30'], ['위치', '청운고시원 304호'], ['기기', '도현의 폰'], ['앨범', '최근 삭제 · 남은 15일'],
  ], { deleted: true });

  let hiddenOpen = false;
  const alive = (items) => items.filter((it) => !LM.isDeleted('photo', it.id));

  LM.register({
    id: 'photo',
    render(app) {
      app.setTabs([
        { label: '보관함', icon: 'photo', build: (nav) => library(nav) },
        { label: '앨범', icon: 'grid', build: (nav) => albums(nav) },
      ], 0);
    },
  });

  /* ---------- 보관함 ---------- */
  function library(nav) {
    return ui.page({
      title: '사진', nav, grouped: true,
      right: h('button', { class: 'nb-btn', 'aria-label': '지도에서 보기', onclick: () => ui.toast('지도에서 보기는 프로토타입에 없다') }, LM.icon('location')),
      body: [
        ui.section('최근 항목'),
        grid(alive(RECENT), (i) => nav.push(() => viewer(nav, alive(RECENT), i))),
        h('div', { class: 'ph-foot' }, '최근 항목 · ' + alive(RECENT).length + '장'),
      ],
    });
  }

  function grid(items, open) {
    return h('div', { class: 'ph-grid', role: 'list' }, items.map((it, i) => {
      const cell = h('button', {
        class: 'ph-cell', role: 'listitem', 'aria-label': (it.title || '사진') + ' 사진',
        data: { del: 'photo:' + it.id },
        onclick: () => open(i),
      }, ui.photo(it.key, { ratio: '1 / 1', caption: false }));
      if (it.burst) cell.appendChild(h('span', { class: 'ph-count' }, LM.icon('grid'), it.burst));
      if (it.edited) cell.appendChild(h('span', { class: 'ph-edit' }, LM.icon('edit')));
      return cell;
    }));
  }

  /* ---------- 앨범 ---------- */
  function albums(nav) {
    const list = [
      { id: 'recent', name: '최근 항목', icon: 'photo', items: alive(RECENT), thumb: RECENT[0] },
      { id: 'fav', name: '즐겨찾기', icon: 'heart', items: alive([RECENT[0], RECENT[5]]), thumb: RECENT[0] },
      { id: 'shots', name: '스크린샷', icon: 'screenshot', items: alive(SHOTS), thumb: SHOTS[0] },
      { id: 'hidden', name: '숨김 · 한결 우편', icon: 'lock', items: alive(HIDDEN), locked: true },
      { id: 'deleted', name: '최근 삭제된 항목', icon: 'trash', items: alive([ROOM]), remaining: 15 },
    ];
    return ui.page({
      title: '앨범', nav, grouped: true,
      body: ui.group({
        rows: list.map((a) => ui.row({
          title: a.name,
          subtitle: a.items.length + '장' + (a.remaining ? ' · 남은 ' + a.remaining + '일' : ''),
          lead: a.thumb ? h('span', { class: 'ph-alb-thumb' }, ui.photo(a.thumb.key, { ratio: '1 / 1', caption: false })) : h('span', { class: 'ph-alb-thumb ph-alb-locked' }, LM.icon('lock')),
          onClick: () => {
            if (a.locked && !hiddenOpen) return lockSheet(() => { hiddenOpen = true; nav.push(() => albumPage(nav, a)); });
            nav.push(() => albumPage(nav, a));
          },
        })),
      }),
    });
  }

  function lockSheet(ok) {
    const inp = h('input', { class: 'ph-lock-input', type: 'password', inputmode: 'numeric', maxlength: '6', 'aria-label': '기기 암호', placeholder: '6자리' });
    const box = h('div', { class: 'ph-lock', data: { app: 'photo' } },
      h('p', { class: 'ph-lock-t' }, '기기 암호를 입력하세요.'),
      inp,
      ui.notice('숨김 앨범은 기기 암호로 연다.'));
    ui.sheet(null, ui.sheetPage({
      title: '숨김 앨범', cancel: '취소', done: '열기',
      onDone: () => { if (inp.value === LM.PASSCODE) ok(); else ui.toast('암호가 맞지 않습니다'); },
      body: box,
    }), { size: 'medium' });
    setTimeout(() => inp.focus(), 400);
  }

  function albumPage(nav, a) {
    const body = h('div');
    body.appendChild(uploadNotice(a));
    const items = alive(a.items);
    body.appendChild(grid(items, (i) => nav.push(() => viewer(nav, items, i))));
    body.appendChild(h('div', { class: 'ph-foot' }, a.name + ' · ' + items.length + '장'));
    return ui.page({ title: a.name, back: '앨범', nav, grouped: true, body });
  }

  function uploadNotice(a) {
    if (a.id === 'deleted') return ui.notice('최근 삭제된 항목은 열람만 할 수 있다. 복구 버튼은 없다.', 'warn');
    if (a.id === 'hidden') return ui.notice('원격 삭제 대상 앨범이다.');
    return h('div');
  }

  /* ---------- 사진 뷰어 ---------- */
  function viewer(nav, list, start) {
    let i = start;
    const count = h('span', { class: 'phv-count' });
    const stage = h('div', { class: 'phv-stage' });
    const foot = h('div', { class: 'phv-foot' });

    const draw = () => {
      const it = list[i];
      stage.replaceChildren(fullPhoto(it));
      count.textContent = (i + 1) + ' / ' + list.length;
      foot.replaceChildren(
        h('button', { class: 'phv-btn', disabled: i === 0, 'aria-label': '이전 사진', onclick: () => { if (i > 0) { i--; draw(); } } }, LM.icon('chevron-left')),
        it.burst
          ? h('button', { class: 'phv-burst-btn', onclick: () => nav.push(() => burst(nav, it)) }, LM.icon('grid'), '버스트 ' + it.burst + '장')
          : h('span', { class: 'phv-spacer' }),
        h('button', { class: 'phv-btn', disabled: i === list.length - 1, 'aria-label': '다음 사진', onclick: () => { if (i < list.length - 1) { i++; draw(); } } }, LM.icon('chevron-right')),
      );
    };

    const scr = h('section', { class: 'scr phv' },
      h('header', { class: 'phv-bar' },
        h('button', { class: 'phv-back', onclick: () => nav.pop() }, LM.icon('chevron-left'), h('span', null, '뒤로')),
        count,
        h('button', { class: 'phv-info', 'aria-label': '정보', onclick: () => ui.info('정보', list[i].info) }, LM.icon('info'))),
      stage,
      foot);

    let sx = null;
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx; sx = null;
      if (dx > 40 && i > 0) { i--; draw(); }
      else if (dx < -40 && i < list.length - 1) { i++; draw(); }
    });

    draw();
    return scr;
  }

  function fullPhoto(it) {
    const el = ui.photo(it.key, { ratio: '4 / 5', caption: false, class: 'phv-img' });
    if (it.burst) el.appendChild(h('span', { class: 'phv-burst-badge' }, '버스트 ' + it.burst + '장'));
    return el;
  }

  /* ---------- 버스트 18장 ---------- */
  function burst(nav, item) {
    let i = 10;
    let zoom = false;
    const stage = h('div', { class: 'burst-stage' });
    const strip = h('div', { class: 'burst-strip' });
    const counter = h('span', { class: 'burst-count' });
    const hint = h('span', { class: 'burst-hint' });

    const draw = () => {
      const frame = h('div', { class: 'burst-frame' + (zoom ? ' zoom' : ''), style: { transform: 'rotate(' + ((i - 9) * 0.35) + 'deg) scale(' + (zoom ? 1.7 : 1) + ')' } },
        ui.photo(BURST_KEY, { ratio: '4 / 3', caption: false, class: 'burst-img' }),
        h('div', { class: 'burst-car' },
          h('span', { class: 'burst-plate' + (i === 10 ? ' sharp' : '') }, '38러 5512')));
      stage.replaceChildren(frame);
      counter.textContent = (i + 1) + ' / 18';
      hint.textContent = i === 10 ? '11번째 프레임 · 번호판이 선명하다' : '번호판이 흐리다';
      strip.replaceChildren(...Array.from({ length: 18 }, (_, j) => h('button', {
        class: 'burst-thumb' + (j === i ? ' on' : ''), 'aria-label': (j + 1) + '번째 프레임',
        onclick: () => { i = j; draw(); },
      }, ui.photo(BURST_KEY, { ratio: '1 / 1', caption: false }))));
    };

    const scr = h('section', { class: 'scr burstv' },
      h('header', { class: 'phv-bar' },
        h('button', { class: 'phv-back', onclick: () => nav.pop() }, LM.icon('chevron-left'), h('span', null, '뒤로')),
        counter,
        h('button', { class: 'phv-info', 'aria-label': '정보', onclick: () => ui.info('정보', item.info) }, LM.icon('info'))),
      stage,
      strip,
      h('div', { class: 'burst-tools' },
        h('button', { class: 'burst-tool', onclick: () => { zoom = !zoom; draw(); } }, '+' ),
        hint,
        h('button', { class: 'burst-tool', onclick: () => { zoom = false; draw(); } }, '−')));

    let sx = null;
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx; sx = null;
      if (dx > 40 && i > 0) { i--; draw(); }
      else if (dx < -40 && i < 17) { i++; draw(); }
    });

    draw();
    return scr;
  }

  LM.searchSources.push({
    app: 'photo',
    items: () => alive(RECENT).map((it) => ({ title: it.title, sub: it.info[0][1] + ' · ' + it.info[1][1], text: it.title + ' ' + it.key })),
  });
})();
