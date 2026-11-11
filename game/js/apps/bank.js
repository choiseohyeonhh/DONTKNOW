/* 누리은행 — 6자리 간편비밀번호(110221), 지급정지 계좌, 거래내역·상세.
 * 은행 앱에는 흐름(누가·언제·얼마)만 둔다. 수법·대본은 쓰지 않는다.
 * 설계: design/03-features/COMMERCE_AND_FINANCE_SPECIFICATION.md 1절, SCREEN_SPECIFICATIONS_APPS.md SCR-BANK-*,
 *       EVIDENCE_LEDGER.md E-80~E-84 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const PIN = '110221';
  const ACCOUNT = '352-1048-7731';
  const BALANCE = '15,212,400원';

  /* 캐논 수치 + AC-036의 61건. 개별 금액·상대가 문서에 있는 것만 캐논이고,
   * 나머지는 1/9~3/6의 흐름을 채우는 자리표시다(수법·대본 없음). */
  function buildTx() {
    const rows = [
      { id: 'kim', date: '3/10', time: '11:05', type: 'in', name: '김*자', amount: 15000000, memo: '출금 없음 · 이후 지급정지', eid: 'E-84' },
      { id: 'park-out', date: '3/6', time: '14:40', type: 'out', name: '지정 계좌', amount: 28000000, memo: '박미선 입금액 이체', eid: 'E-82' },
      { id: 'park-in', date: '3/6', time: '14:12', type: 'in', name: '박미선', amount: 28000000, memo: '—', eid: 'E-82' },
      { id: 'han1', date: '2/26', time: '—', type: 'out', name: '한결캐피탈', amount: 3400000, memo: '가상계좌 / 채무자 이상철', eid: 'E-83' },
      { id: 'han2', date: '1/27', time: '—', type: 'out', name: '한결캐피탈', amount: 3000000, memo: '가상계좌 / 채무자 이상철', eid: 'E-83' },
    ];
    const start = new Date(2026, 0, 9).getTime();
    const span = new Date(2026, 2, 6).getTime() - start;
    const namesIn = ['GJ정산', '환전', '이체', '입금'];
    const namesOut = ['환전', 'GJ정산', '편의점', '카페'];
    let i = 0;
    while (rows.length < 61) {
      const d = new Date(start + ((i * 7919) % span));
      const type = i % 5 === 0 || i % 7 === 0 ? 'out' : 'in';
      const name = type === 'in' ? namesIn[i % namesIn.length] : namesOut[i % namesOut.length];
      const amount = type === 'in' ? [640000, 1200000, 2100000, 480000][i % 4] : [30000, 12000, 87000, 450000][i % 4];
      rows.push({
        id: 'f' + i,
        date: (d.getMonth() + 1) + '/' + d.getDate(),
        time: String(9 + (i % 10)).padStart(2, '0') + ':' + String((i * 13) % 60).padStart(2, '0'),
        type: type, name: name, amount: amount, memo: '—',
        eid: name === 'GJ정산' ? 'E-81' : 'E-80',
      });
      i++;
    }
    const key = (t) => {
      const d = LM.fmt.toDate(t.date + ' ' + (t.time === '—' ? '00:00' : t.time));
      return d ? d.getTime() : 0;
    };
    return rows.sort((a, b) => key(b) - key(a));
  }
  const TX = buildTx();
  const SUMMARY = [
    ['GJ정산 합계', '6,400,000원'],
    ['입금 14건 합계', '113,000,000원'],
  ];

  const amt = (n) => LM.fmt.amount(n);

  LM.register({ id: 'bank', render(app) { app.start((nav) => login(nav)); } });

  function login(nav) {
    const offline = !LM.online();
    let pin = '', busy = offline;
    let waitUntil = 0, waitTimer = null;
    const dots = h('div', { class: 'b-dots' });
    const err = h('div', { class: 'b-err', role: 'alert' });
    const drawDots = () => dots.replaceChildren(...Array.from({ length: 6 }, (_, i) => h('i', { class: pin.length > i ? 'on' : '' })));
    const keyEls = [];

    const setKeys = () => {
      const locked = busy || !LM.online() || Date.now() < waitUntil;
      keyEls.forEach((b) => { b.disabled = locked; });
    };
    const countdown = () => {
      if (waitTimer) clearTimeout(waitTimer);
      const left = Math.ceil((waitUntil - Date.now()) / 1000);
      if (left > 0) {
        err.textContent = left + '초 후에 다시 시도하십시오';
        setKeys();
        waitTimer = setTimeout(countdown, 250);
      } else {
        waitUntil = 0; busy = false; pin = ''; drawDots(); err.textContent = ''; setKeys();
        if (LM.G) LM.gset('world.bankWaitUntil', 0);
      }
    };

    const submit = () => {
      if (!LM.online()) { err.textContent = '온라인이 필요합니다.'; return; }
      if (pin === PIN) {
        pin = ''; drawDots(); err.textContent = ''; waitUntil = 0;
        if (waitTimer) clearTimeout(waitTimer);
        if (LM.G) LM.gset('world.bankOpened', true);
        nav.push(() => home(nav));
        return;
      }
      busy = true;
      err.textContent = '암호가 맞지 않습니다.';
      dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
      waitUntil = Date.now() + 30000;
      if (LM.G) LM.gset('world.bankWaitUntil', waitUntil);
      countdown();
    };
    const press = (d) => {
      if (busy || !LM.online() || Date.now() < waitUntil || pin.length >= 6) return;
      pin += d; err.textContent = ''; drawDots();
      if (pin.length === 6) setTimeout(submit, 120);
    };
    const back = () => { if (busy || Date.now() < waitUntil || !pin) return; pin = pin.slice(0, -1); drawDots(); };

    const keys = [];
    for (let n = 1; n <= 9; n++) keys.push(h('button', { class: 'b-key', 'aria-label': String(n), onclick: () => press(String(n)), disabled: offline }, String(n)));
    keys.push(h('span', { class: 'b-key ghost', 'aria-hidden': 'true' }));
    keys.push(h('button', { class: 'b-key', 'aria-label': '0', onclick: () => press('0'), disabled: offline }, '0'));
    keys.push(h('button', { class: 'b-key', 'aria-label': '지우기', onclick: back, disabled: offline }, LM.icon('backspace')));
    keyEls.push(...keys);
    drawDots();
    if (LM.G && LM.G.world && LM.G.world.bankWaitUntil > Date.now()) { waitUntil = LM.G.world.bankWaitUntil; busy = true; countdown(); }
    setKeys();

    const head = h('header', { class: 'nb nb-std show-title' },
      h('div', { class: 'nb-left' }, h('button', { class: 'nb-back', onclick: () => nav.close() }, '취소')),
      h('div', { class: 'nb-title' }, '간편비밀번호'),
      h('div', { class: 'nb-right' }));

    return h('section', { class: 'b-login' },
      head,
      h('div', { class: 'b-login-body' },
        h('div', { class: 'b-bank' }, '누리은행'),
        h('div', { class: 'b-guide' }, offline ? '온라인이 필요합니다' : '간편비밀번호를 입력하세요'),
        offline ? ui.notice('온라인 연결 전에는 계좌에 들어갈 수 없습니다. 키패드가 비활성화되었습니다.', 'warn') : null,
        h('div', { class: 'b-acctno' }, '352-****-7731'),
        dots,
        err,
        h('div', { class: 'b-pad', role: 'group', 'aria-label': '숫자 키패드' }, keys)));
  }

  function home(nav) {
    if (!LM.online()) return login(nav);
    return ui.page({
      title: '계좌', back: '로그인', nav,
      right: h('button', { class: 'nb-btn', 'aria-label': '새로고침', onclick: () => ui.toast(LM.online() ? '새로고침했다' : '오프라인 상태입니다') }, LM.icon('refresh')),
      body: [
        h('div', { class: 'b-acct' },
          h('div', { class: 'b-acct-top' }, h('span', null, '누리은행'), h('span', { class: 'b-stop' }, '지급정지')),
          h('div', { class: 'b-acct-no' }, ACCOUNT),
          h('div', { class: 'b-acct-bal' }, BALANCE),
          h('div', { class: 'b-acct-owner' }, '이도현')),
        !LM.online() ? ui.notice('오프라인 상태입니다. 마지막으로 저장된 계좌 정보를 보여 준다.', 'warn') : null,
        ui.notice('지급정지된 계좌입니다. 출금·이체할 수 없습니다.', 'warn'),
        ui.group({ rows: [
          ui.row({ title: '거래내역', subtitle: '1/9~3/6 · 입금 14건', icon: 'receipt', onClick: () => nav.push(() => transactions(nav)) }),
        ] }),
      ],
    });
  }

  function transactions(nav) {
    let filter = 'all', q = '';
    const listHost = h('div');
    const match = (t) => (filter === 'all' || t.type === filter) && (!q || (t.name + ' ' + t.memo).includes(q));
    const drawList = () => {
      const rows = TX.filter(match);
      const groups = [];
      let last = null;
      rows.forEach((t) => {
        if (t.date !== last) { last = t.date; groups.push({ date: t.date, rows: [] }); }
        groups[groups.length - 1].rows.push(ui.row({
          title: t.name,
          subtitle: t.memo !== '—' ? t.memo : null,
          meta: t.time !== '—' ? t.time : null,
          value: h('span', { class: 'b-amt ' + t.type }, (t.type === 'in' ? '+' : '−') + amt(t.amount)),
          onClick: () => nav.push(() => txDetail(nav, t)),
        }));
      });
      const kids = [];
      if (rows.length) kids.push(...groups.map((g) => ui.group({ header: LM.fmt.list(g.date + ' 00:00'), plain: true, rows: g.rows })));
      else kids.push(ui.empty({ icon: 'receipt', title: '거래가 없습니다' }));
      kids.push(
        ui.group({ header: '요약', rows: SUMMARY.map(([k, v]) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v))) }),
        h('div', { class: 'grp-f b-note' }, '1/9~3/6 입금 14건은 같은 날 "환전" 계좌로 출금됐다.'));
      listHost.replaceChildren(...kids);
    };
    drawList();
    const seg = ui.segmented(['전체', '입금', '출금'], '전체', (name) => { filter = name === '전체' ? 'all' : name === '입금' ? 'in' : 'out'; drawList(); });
    return ui.page({
      title: '거래내역', back: '계좌', nav,
      body: [seg, ui.search('상대·메모 검색', (v) => { q = v.trim(); drawList(); }), listHost],
    });
  }

  function txDetail(nav, t) {
    if (t.eid) LM.C.see(t.eid);
    LM.setEid(t.eid || null);
    const sign = t.type === 'in' ? '+' : '−';
    return ui.page({
      title: '거래 상세', back: '거래내역', nav, large: false,
      right: h('button', { class: 'nb-btn', 'aria-label': '공유', onclick: () => ui.share({ eid: t.eid, title: t.name + ' ' + amt(t.amount), kind: 'transaction', app: 'bank' }) }, LM.icon('share')),
      body: [
        h('div', { class: 'b-amount ' + t.type },
          h('div', { class: 'b-amount-k' }, t.type === 'in' ? '입금' : '출금'),
          h('div', { class: 'b-amount-n' }, sign + amt(t.amount)),
          h('div', { class: 'b-amount-s' }, t.date + (t.time !== '—' ? ' ' + t.time : ''))),
        ui.group({ rows: [
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '상대'), h('span', { class: 'kv-v' }, t.name)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '일시'), h('span', { class: 'kv-v' }, t.date + (t.time !== '—' ? ' ' + t.time : ''))),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '금액'), h('span', { class: 'kv-v' }, sign + amt(t.amount))),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '메모'), h('span', { class: 'kv-v' }, t.memo)),
          h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '계좌'), h('span', { class: 'kv-v' }, ACCOUNT)),
        ] }),
        ui.button({ label: '공유', kind: 'tinted', icon: 'share', onClick: () => ui.share({ eid: t.eid, title: t.name + ' ' + amt(t.amount), kind: 'transaction', app: 'bank' }) }),
      ],
    });
  }

  LM.searchSources.push({ app: 'bank', items: () => !LM.online() ? [] : [
    { title: '누리은행 계좌', sub: ACCOUNT + ' · ' + BALANCE, text: ACCOUNT },
    ...TX.map((t) => ({ title: '누리은행 · ' + t.name, sub: t.date + ' ' + (t.type === 'in' ? '입금' : '출금') + ' ' + amt(t.amount), text: t.name + ' ' + t.memo })),
  ] });
})();
