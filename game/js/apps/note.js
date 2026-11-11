/* 메모 — 잠긴 메모 2개, 메모 암호 680403(힌트 "아빠").
 * 설계: design/03-features/PERSONAL_DATA_APPS_SPECIFICATION.md 2절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-NOTE-*, EVIDENCE_LEDGER E-24~E-28, ACTION_PROOF V-02 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const CODE = '680403';

  /* 캐논 본문은 문서 그대로. '장보기'·'과제'는 장식(캐논 없음) */
  const notes = [
    {
      id: 'n-320', title: '3/20 준비', date: '3/14 18:20', sort: 202603141820, eid: 'E-27',
      body: '캡처 12장\n녹음(폰)\n실장 이름??\n아빠한테 뭐라고',
    },
    {
      id: 'n-dad', title: '아빠한테', date: '3/13 23:50', sort: 202603132350, locked: true, eid: 'E-25',
      body: '아빠 나 사실 아빠 빚 알아. 고1 때 그 사람들 왔을 때부터.\n' +
        '그래서 돈 벌었어. 근데 이상한 데서 벌었어. 나 경찰서 가야 돼.\n' +
        '아빠는 모른 척해도 돼. 근데 남은 거 4,820은 내가 진짜 갚을 거야.\n' +
        '이건 안 보낼 거야.',
    },
    {
      id: 'n-money', title: '돌려줄 돈', date: '3/12 수정', sort: 202603120000, eid: 'E-28',
      body: '박미선님 2,800\n카메라 45 ✓\n기타 20 ✓\n모니터 12\n현금 65 (서랍)\n→ 계좌 정지됨. 경찰한테 물어보기',
    },
    {
      id: 'n-hw', title: '과제', date: '3/11', sort: 202603110000,
      body: '대학글쓰기 1차 과제 — 다음 주까지\n주제 정하고 개요 쓰기', // 자리표시(캐논 없음)
    },
    {
      id: 'n-shop', title: '장보기', date: '3/8', sort: 202603080000,
      body: '우유, 달걀, 라면', // 자리표시(캐논 없음)
    },
    {
      id: 'n-left', title: '남은 거', date: '2/26', sort: 202602261200, eid: 'E-24',
      body: '목표: 졸업 전에 0\n\n2024.08 시작 7,420\n2025.12 5,620\n\n2/26 48,200,000',
    },
    {
      id: 'n-pw', title: '비번', date: '', sort: 202601010000, locked: true, eid: 'E-26',
      body: '누리: 엄마+내 생일 끝자리\n루프 부: 메일로',
    },
  ];

  let unlocked = !!(LM.G && LM.G.world && LM.G.world.noteUnlocked);
  let root = null;
  let noteOff = null;

  LM.register({
    id: 'note',
    render(app) {
      if (noteOff) { noteOff(); noteOff = null; }
      root = app.root;
      app.start((nav) => foldersPage(nav));
    },
    onClose() { if (noteOff) { noteOff(); noteOff = null; } },
  });

  const firstLine = (n) => String(n.body || '').split('\n')[0] || '메모 없음';
  const preview = (n) => (n.locked && !unlocked ? '잠긴 메모' : firstLine(n));
  const leadFor = (n) => {
    const locked = n.locked && !unlocked;
    return h('span', { class: 'nt-lead' + (locked ? ' locked' : '') }, LM.icon(n.locked ? (unlocked ? 'unlock' : 'lock') : 'doc'));
  };

  function foldersPage(nav) {
    const rows = [
      ['메모', 'all'],
      ['잠긴 메모', 'locked'],
    ].map(([name, id]) => {
      const items = (id === 'all' ? notes : notes.filter((n) => n.locked)).filter((n) => !LM.isDeleted('note', n.id));
      const lockedCount = items.filter((n) => n.locked).length;
      const sub = id === 'locked'
        ? (unlocked ? '암호로 열림' : '암호가 필요한 메모 ' + lockedCount + '개')
        : '메모 ' + items.length + '개';
      return ui.row({
        title: name,
        subtitle: sub,
        value: String(items.length),
        lead: h('span', { class: 'nt-folder' }, LM.icon(id === 'locked' ? 'lock' : 'folder')),
        onClick: () => nav.push(() => listPage(nav, id, name)),
      });
    });
    return ui.page({
      title: '메모',
      right: h('button', { class: 'nb-btn', 'aria-label': '새 메모', onclick: () => newNote(nav) }, LM.icon('compose')),
      body: [
        ui.section('나의 메모'),
        ui.group({ rows, footer: '메모는 시러스로 동기화된다. 잠긴 메모는 하나의 메모 암호를 쓴다.' }),
      ],
    });
  }

  function listPage(nav, folder, name) {
    const body = h('div');
    let q = '';
    const draw = () => {
      const items = notes
        .filter((n) => !LM.isDeleted('note', n.id))
        .filter((n) => folder === 'all' || (n.locked && folder === 'locked'))
        .filter((n) => !q || ((n.locked && !unlocked ? n.title : n.title + ' ' + n.body).toLowerCase().includes(q.toLowerCase())))
        .sort((a, b) => b.sort - a.sort);
      body.replaceChildren(
        items.length
          ? ui.group({
            plain: true,
            rows: items.map((n) => {
              const row = ui.row({
                title: n.title,
                subtitle: preview(n),
                meta: LM.fmt.list(n.date || ''),
                lead: leadFor(n),
                onClick: () => openNote(nav, n),
              });
              row.dataset.del = 'note:' + n.id;
              return row;
            }),
          })
          : ui.empty({ icon: 'doc', title: '메모가 없습니다.', text: q ? '다른 낱말로 찾아보세요.' : null })
      );
    };
    draw();
    if (noteOff) noteOff();
    noteOff = LM.on('notechange', draw);
    return ui.page({
      title: name,
      back: '메모',
      nav,
      right: h('button', { class: 'nb-btn', 'aria-label': '새 메모', onclick: () => newNote(nav) }, LM.icon('compose')),
      search: '검색',
      onSearch: (v) => { q = v.trim(); draw(); },
      body,
    });
  }

  function openNote(nav, n) {
    if (n.locked && !unlocked) lockSheet(nav, n);
    else nav.push(() => noteView(nav, n));
  }

  /* 메모 암호 시트: 6자리, 오답 5회째부터 힌트 강조. 잠기지 않는다. */
  function lockSheet(nav, n) {
    let code = '';
    let wrong = 0;
    let wrap;
    const dots = h('div', { class: 'nt-dots', 'aria-hidden': true }, [0, 1, 2, 3, 4, 5].map(() => h('i')));
    const hint = h('div', { class: 'nt-hint' }, '힌트: 아빠');
    const msg = h('div', { class: 'nt-msg', role: 'status' });
    const keys = [];
    const drawDots = () => dots.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i < code.length));
    const press = (d) => {
      if (code.length >= 6) return;
      code += d; drawDots();
      if (code.length === 6) setTimeout(check, 130);
    };
    const check = () => {
      if (code === CODE) {
        unlocked = true;
        if (LM.G) LM.gset('world.noteUnlocked', true);
        wrap.close();
        setTimeout(() => nav.push(() => noteView(nav, n)), 240);
        return;
      }
      wrong++;
      code = ''; drawDots();
      dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
      msg.textContent = '암호가 맞지 않습니다. 다시 입력하세요.';
      if (wrong >= 5) hint.classList.add('strong');
      setTimeout(drawDots, 300);
    };
    const pad = h('div', { class: 'nt-pad', role: 'group', 'aria-label': '숫자 키패드' });
    ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((d) => {
      const b = h('button', { class: 'nt-key', 'aria-label': d, onclick: () => press(d) }, d);
      keys.push(b); pad.appendChild(b);
    });
    pad.appendChild(h('span'));
    pad.appendChild(h('button', { class: 'nt-key', 'aria-label': '0', onclick: () => press('0') }, '0'));
    pad.appendChild(h('button', { class: 'nt-key nt-del', 'aria-label': '지우기', onclick: () => { code = code.slice(0, -1); drawDots(); } }, LM.icon('backspace')));
    const content = h('div', { class: 'nt-lock' },
      h('div', { class: 'nt-lock-head' }, h('div', { class: 'nt-lock-title' }, '메모 암호'), h('button', { class: 'nt-cancel', onclick: () => wrap && wrap.close() }, '취소')),
      h('div', { class: 'nt-lock-sub' }, n.title + ' · 잠긴 메모'),
      hint, dots, msg, pad);
    wrap = ui.sheet(root, content, { size: 'medium' });
    return wrap;
  }

  function noteView(nav, n) {
    if (n.eid) LM.C.see(n.eid);
    LM.setEid(n.eid || null);
    const title = h('input', { class: 'nt-title', value: n.title, 'aria-label': '메모 제목', oninput: (e) => { n.title = e.target.value; LM.emit('notechange'); } });
    const area = h('textarea', { class: 'nt-body', 'aria-label': '메모 본문', oninput: (e) => {
      n.body = e.target.value; meta.textContent = metaText(n); LM.emit('notechange');
      if (LM.trace && !(LM.G && LM.G.sync && LM.G.sync.notes === false)) LM.trace('TR-08', { kind: 'memo', title: n.title, text: n.body });
      if (!(LM.G && LM.G.world && LM.G.world.ev35) && /도현아|아빠/.test(n.body) && !(LM.G && LM.G.sync && LM.G.sync.notes === false)) LM.emit('memo:keyword', { text: n.body });
    } });
    area.value = n.body;
    const metaText = (x) => (x.locked ? '잠김 · ' : '') + (x.date || '') + ' · ' + String(x.body || '').length + '자';
    const meta = h('div', { class: 'nt-meta' }, metaText(n));
    const more = h('button', { class: 'nb-btn', 'aria-label': '더 보기', onclick: () => ui.actionSheet({
      title: n.title,
      actions: [
        { label: '공유', onClick: () => ui.share({ eid: n.eid, title: n.title, kind: 'memo', app: 'note' }) },
        { label: '삭제', destructive: true, onClick: () => ui.actionSheet({
          title: '메모를 삭제할까요?',
          text: '이 폰에서 지워진다.',
          actions: [{
            label: '삭제', destructive: true, onClick: () => {
              const i = notes.indexOf(n);
              if (i >= 0) notes.splice(i, 1);
              LM.emit('notechange');
              nav.pop(); ui.toast('메모 삭제됨');
            },
          }],
        }) },
      ],
    }) }, LM.icon('more'));
    return ui.page({
      title: '',
      large: false,
      back: '메모',
      nav,
      right: more,
      class: 'nt-edit',
      body: h('div', { class: 'nt-editor', data: { del: 'note:' + n.id } },
        meta,
        title,
        area,
        n.locked ? h('div', { class: 'nt-badge' }, LM.icon('lock'), '잠긴 메모') : null),
    });
  }

  function newNote(nav) {
    const d = LM.now();
    const stamp = (d.getMonth() + 1) + '/' + d.getDate() + ' ' + LM.fmtTime(d);
    const n = { id: 'n-new-' + Date.now(), title: '새 메모', body: '', date: stamp, sort: 999999999999, locked: false };
    notes.unshift(n);
    LM.emit('notechange');
    if (LM.trace && !(LM.G && LM.G.sync && LM.G.sync.notes === false)) LM.trace('TR-08', { kind: 'memo', title: n.title, text: n.body });
    nav.push(() => noteView(nav, n));
  }

  LM.searchSources.push({
    app: 'note',
    items: () => notes.filter((n) => !LM.isDeleted('note', n.id)).map((n) => ({
      title: n.title,
      sub: preview(n),
      text: n.title + ' ' + (n.locked && !unlocked ? '' : n.body),
    })),
  });
})();
