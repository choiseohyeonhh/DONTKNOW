/* 파일 — 설계: design/03-features/MEDIA_SPECIFICATION.md 4절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-FILE-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const FOLDERS = [
    { key: 'download', label: '다운로드', icon: 'download' },
    { key: 'mail', label: '메일 첨부', icon: 'inbox' },
    { key: 'nearby', label: '근처 공유', icon: 'users' },
  ];

  const FILES = [
    {
      id: 'edu', name: '교육자료.pdf', folder: 'nearby', kind: 'PDF', size: '1.8MB', pages: 12,
      received: '1/20 14:12', sourceLabel: '근처 공유', sourceDevice: '민석의 폰',
      // 사기 수법 내용은 쓰지 않는다. 표지·날짜·쪽수만 캐논(E-216).
      preview: { title: 'GJ 신입 교육', sub: 'side.money.kr', meta: '2026. 1. 20. · 전체 12쪽', lines: ['1. 교육 일정과 준비물'], foot: '미리보기는 첫 페이지만 표시됩니다.' },
    },
    {
      id: 'attend', name: '출석요구서.pdf', folder: 'mail', kind: 'PDF', size: '240KB', pages: 2,
      received: '3/13 10:02', sourceLabel: '메일 첨부', sourceDevice: '성원경찰서',
      preview: { title: '출석요구서', sub: '성원경찰서 수사과', meta: '2026. 3. 13.', lines: ['이도현 귀하', '일시: 2026. 3. 20. 10:00', '장소: 성원경찰서'], foot: '미리보기는 첫 페이지만 표시됩니다.' },
    },
    {
      id: 'contract', name: '고시원_계약서.pdf', folder: 'mail', kind: 'PDF', size: '380KB', pages: 3,
      received: '2/25 16:30', sourceLabel: '메일 첨부', sourceDevice: '청운고시원',
      preview: { title: '청운고시원 입실 계약서', sub: '성원구청로 18', meta: '2026. 2. 25.', lines: ['호실: 304호', '입실 예정: 2026. 3. 16.', '총무: 오정자'], foot: '미리보기는 첫 페이지만 표시됩니다.' },
    },
    {
      id: 'rules', name: '업무수칙.pdf', folder: 'mail', kind: 'PDF', size: '120KB', pages: 1,
      received: '1/9 10:12', sourceLabel: '메일 첨부', sourceDevice: '굿잡',
      // 자리표시(캐논 없음): 본문 첫 줄만 판독된다는 사실만 캐논. 수법 내용은 쓰지 않는다.
      preview: { title: '업무수칙', sub: '굿잡', meta: '2026. 1. 9. · 1쪽', lines: ['담당자의 안내에 따라 업무를 시작합니다.'], foot: '첫 줄만 표시됩니다.' },
    },
  ];

  LM.register({
    id: 'file',
    render(app) { app.start((nav) => root(nav)); },
  });

  const kv = (k, v) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v));
  const inFolder = (key) => FILES.filter((f) => f.folder === key);

  function fileRow(nav, f) {
    const row = ui.row({
      title: f.name,
      subtitle: f.size + ' · ' + f.sourceLabel + (f.sourceDevice ? ' · ' + f.sourceDevice : ''),
      meta: f.received.split(' ')[0],
      icon: 'doc',
      onClick: () => nav.push(() => detail(nav, f)),
      onLong: () => ui.actionSheet({
        title: f.name,
        actions: [
          { label: '공유', onClick: () => ui.share(f.name) },
          { label: '정보', onClick: () => ui.info(f.name, infoPairs(f)) },
          { label: '삭제', destructive: true, onClick: () => { const i = FILES.indexOf(f); if (i >= 0) FILES.splice(i, 1); if (row.isConnected) row.remove(); ui.toast('파일을 삭제했다'); } },
        ],
      }),
    });
    return row;
  }

  function infoPairs(f) {
    return [
      ['받은 곳', f.sourceLabel + (f.sourceDevice ? ' · ' + f.sourceDevice : '')],
      ['받은 시각', f.received],
      ['종류', f.kind],
      ['크기', f.size],
      ['쪽수', f.pages + '쪽'],
    ];
  }

  /* ---------- 루트 ---------- */
  function root(nav) {
    const wrap = h('div');
    const draw = (q) => {
      const nq = String(q || '').trim().toLowerCase();
      const recent = FILES.filter((f) => !nq || f.name.toLowerCase().includes(nq));
      wrap.replaceChildren(
        ui.group({
          header: '위치', rows: [
            ui.row({ title: '이 폰', icon: 'phone', value: FILES.length + '개', onClick: () => nav.push(() => browse(nav)) }),
            ui.row({ title: '시러스 드라이브', icon: 'cloud', value: LM.online() ? '' : '오프라인', onClick: () => nav.push(() => cloud(nav)) }),
            ui.row({ title: '최근 항목', icon: 'clock', onClick: () => nav.push(() => recentPage(nav)) }),
          ],
        }),
        ui.group({
          header: '최근 항목',
          rows: recent.length ? recent.slice(0, 4).map((f) => fileRow(nav, f)) : [ui.row({ title: '파일이 없습니다.', dim: true, chevron: false })],
        }),
      );
    };
    draw('');
    return ui.page({ title: '파일', nav, search: '파일 검색', onSearch: draw, body: wrap });
  }

  function browse(nav) {
    return ui.page({
      title: '이 폰', back: '파일', nav,
      body: ui.group({
        header: '폴더',
        rows: FOLDERS.map((f) => ui.row({
          title: f.label, icon: f.icon, value: inFolder(f.key).length + '개',
          onClick: () => nav.push(() => folderPage(nav, f)),
        })),
      }),
    });
  }

  function folderPage(nav, f) {
    const list = inFolder(f.key);
    const body = h('div');
    const render = (q) => {
      const nq = String(q || '').trim().toLowerCase();
      const rows = list.filter((x) => !nq || x.name.toLowerCase().includes(nq)).map((x) => fileRow(nav, x));
      body.replaceChildren(list.length
        ? ui.group({ plain: true, rows: rows.length ? rows : [ui.row({ title: '파일이 없습니다.', dim: true, chevron: false })] })
        : ui.empty({ icon: 'folder', title: '파일이 없습니다.' }));
    };
    render('');
    return ui.page({ title: f.label, back: '이 폰', nav, search: '파일 검색', onSearch: render, body });
  }

  function recentPage(nav) {
    return ui.page({
      title: '최근 항목', back: '파일', nav,
      body: ui.group({ plain: true, rows: FILES.map((f) => fileRow(nav, f)) }),
    });
  }

  function cloud(nav) {
    return ui.page({
      title: '시러스 드라이브', back: '파일', nav,
      body: LM.online()
        ? ui.empty({ icon: 'cloud', title: '드라이브에 파일이 없습니다.' })
        : [ui.notice('오프라인 상태입니다. 시러스 드라이브를 불러올 수 없습니다.', 'warn'), ui.empty({ icon: 'cloud', title: '연결되지 않음', text: '온라인이 되면 시러스에 저장된 파일을 불러온다.' })],
    });
  }

  /* ---------- 파일 미리보기 ---------- */
  function detail(nav, f) {
    const paper = h('div', { class: 'file-paper' },
      h('div', { class: 'file-paper-head' },
        h('span', { class: 'file-paper-title' }, f.preview.title),
        f.preview.sub ? h('span', { class: 'file-paper-wm' }, f.preview.sub) : null),
      f.preview.meta ? h('div', { class: 'file-paper-meta' }, f.preview.meta) : null,
      f.preview.lines.map((l) => h('p', { class: 'file-paper-line' }, l)),
      h('div', { class: 'file-paper-foot' }, f.preview.foot));

    const body = h('div', { class: 'file-detail' },
      h('div', { class: 'file-hero' },
        h('span', { class: 'file-hero-ic' }, LM.icon('doc')),
        h('div', { class: 'file-hero-t' }, h('b', null, f.name), h('span', null, f.kind + ' · ' + f.size + ' · ' + f.pages + '쪽'))),
      paper,
      ui.group({ header: '정보', rows: infoPairs(f).map(([k, v]) => kv(k, v)) }),
      ui.notice('미리보기는 캐논 범위까지만 열린다. 그 밖의 본문은 표시되지 않는다.'),
    );

    return ui.page({
      title: f.name, back: '파일', nav, large: false,
      right: h('button', { class: 'nb-btn', 'aria-label': '공유', onclick: () => ui.share(f.name) }, LM.icon('share')),
      body,
    });
  }

  LM.searchSources.push({
    app: 'file',
    items: () => FILES.map((f) => ({ title: f.name, sub: f.kind + ' · ' + f.sourceLabel, text: f.name + ' ' + f.preview.title })),
  });
})();
