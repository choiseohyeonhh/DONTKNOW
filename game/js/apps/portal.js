/* 한서 포털 — 학교 계정 필요(온라인). 학생증·공지·학사(출결·휴학 신청).
 * 설계: design/03-features/PERSONAL_DATA_APPS_SPECIFICATION.md 8절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-PORTAL-*, EVIDENCE_LEDGER E-215 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const STUDENT = { name: '이도현', dept: '경영학과', year: '2026 신입생' };

  /* 공지 1·2는 알림 캐논(data.js)에서. 본문 세부는 자리표시(캐논 없음). */
  const NOTICES = [
    {
      id: 'p1', cat: '과제', at: '3/13 09:00', title: '대학글쓰기 1차 과제 제출 마감',
      body: ['제출 기한: 3/16 23:59', '분량: 2,000자 내외', '제출: 포털 과제함'],
    },
    {
      id: 'p2', cat: '학사', at: '3/14 17:00', title: '수강신청 정정 기간 안내',
      body: ['정정 기간: 3/16 ~ 3/20', '정정은 포털 학사 메뉴에서 한다.', '기간이 지나면 변경할 수 없다.'],
    },
    {
      id: 'p3', cat: '학사', at: '3/2 09:00', title: '2026학년도 1학기 학사 일정',
      body: ['3/2 개강', '3/16~3/20 수강신청 정정', '4/20~4/24 중간고사', '6/19 1학기 종강'],
    },
  ];
  const ACADEMIC = [
    ['3/2', '1학기 개강'],
    ['3/16~3/20', '수강신청 정정 기간'],
    ['4/20~4/24', '중간고사'],
    ['6/19', '1학기 종강'],
  ]; // 자리표시(캐논 없음): 학사 일정의 구체 날짜는 문서에 없다

  let subs = [];

  LM.register({
    id: 'portal',
    render(app) { subs.forEach((f) => f()); subs = []; app.start((nav) => home(nav)); },
    onClose() { subs.forEach((f) => f()); subs = []; },
  });

  function home(nav) {
    const body = h('div');
    const draw = () => {
      if (!LM.online()) {
        body.replaceChildren(
          ui.empty({ icon: 'wifi', title: '온라인이 필요합니다', text: '한서 포털은 학교 계정으로 접속한다. Wi-Fi 또는 셀룰러를 켜야 한다.' }),
          ui.notice('오프라인 상태입니다. 저장된 화면이 없다.', 'warn')
        );
        return;
      }
      body.replaceChildren(
        studentCard(),
        ui.section('공지·과제'),
        ui.group({
          rows: NOTICES.map((n) => ui.row({
            title: n.title,
            subtitle: n.cat + ' · ' + n.at,
            lead: h('span', { class: 'pt-notice-ic' }, LM.icon(n.cat === '과제' ? 'doc' : 'info')),
            onClick: () => nav.push(() => noticePage(nav, n)),
          })),
        }),
        ui.section('학사'),
        ui.group({
          rows: [
            ui.row({ title: '출결', value: '3/16~3/17 결석', icon: 'check', iconBg: 'var(--lm-tint-fill)', onClick: () => nav.push(() => attendancePage(nav)) }),
            ui.row({ title: '학사 신청', value: '접수', icon: 'doc', iconBg: 'var(--lm-tint-fill)', onClick: () => nav.push(() => leavePage(nav)) }),
            ui.row({ title: '학사 일정', value: '3/2 개강', icon: 'cal', iconBg: 'var(--lm-tint-fill)', onClick: () => nav.push(() => academicPage(nav)) }),
          ],
        }),
        ui.notice('포털에서는 새 신청을 넣을 수 없다. 열람만 된다.')
      );
    };
    draw();
    subs.push(LM.on('state', draw));
    return ui.page({ title: '한서 포털', back: null, body });
  }

  function studentCard() {
    return h('div', { class: 'pt-id' },
      h('div', { class: 'pt-id-top' }, h('span', null, '한서대학교'), h('span', { class: 'pt-id-year' }, '2026')),
      h('div', { class: 'pt-id-main' },
        ui.avatar(STUDENT.name, 58, { hue: 212 }),
        h('div', { class: 'pt-id-t' },
          h('div', { class: 'pt-id-name' }, STUDENT.name),
          h('div', { class: 'pt-id-sub' }, STUDENT.dept + ' · 1학년'),
          h('div', { class: 'pt-id-sub' }, STUDENT.year))),
      h('div', { class: 'pt-id-foot' }, '학생증', h('span', { class: 'pt-id-chip' }, 'HANSEO')));
  }

  function noticePage(nav, n) {
    return ui.page({
      title: n.cat,
      back: '한서 포털',
      nav,
      body: [
        h('div', { class: 'pt-notice' },
          h('div', { class: 'pt-notice-meta' }, n.cat + ' · ' + n.at),
          h('h1', { class: 'pt-notice-title' }, n.title),
          n.body.map((p) => h('p', { class: 'pt-notice-p' }, p))),
      ],
    });
  }

  function attendancePage(nav) {
    const day = (d, label) => ui.group({
      header: label,
      rows: [ui.row({ title: '전 과목', subtitle: '출석 기록 없음', value: '결석', chevron: false, class: 'pt-absent' })],
    });
    return ui.page({
      title: '출결',
      back: '한서 포털',
      nav,
      body: [
        day('3/16', '3월 16일 월요일'),
        day('3/17', '3월 17일 화요일'),
        ui.notice('3/16·3/17 전 과목 결석.', 'warn'),
      ],
    });
  }

  function leavePage(nav) {
    LM.C.see('E-215');
    const steps = [
      { t: '접수', at: '3/16 22:40', state: 'done' },
      { t: '학과 승인 대기', at: '현재', state: 'now' },
      { t: '승인', at: '', state: 'wait' },
    ];
    return ui.page({
      title: '학사 신청',
      back: '한서 포털',
      nav,
      body: [
        h('div', { class: 'pt-leave' },
          h('div', { class: 'pt-leave-type' }, '일반휴학 신청'),
          h('div', { class: 'pt-leave-state' }, '접수(학과 승인 대기)')),
        ui.group({
          rows: [
            kv('신청 일시', '3/16 22:40'),
            kv('신청 기기', '슬레이트'),
            kv('사유', '개인 사정'),
            kv('처리 상태', '접수'),
          ],
        }),
        ui.section('처리 단계'),
        h('div', { class: 'pt-steps' }, steps.map((s) => h('div', { class: 'pt-step ' + s.state },
          h('span', { class: 'pt-step-dot' }),
          h('span', { class: 'pt-step-t' }, s.t),
          h('span', { class: 'pt-step-at' }, s.at)))),
        ui.notice('신청 기기가 이 폰이 아니라 슬레이트다.'),
      ],
    });
  }

  function academicPage(nav) {
    return ui.page({
      title: '학사 일정',
      back: '한서 포털',
      nav,
      body: ui.group({ rows: ACADEMIC.map(([at, title]) => h('div', { class: 'pt-acad' }, h('span', { class: 'pt-acad-at' }, at), h('span', null, title))) }),
    });
  }

  function kv(k, v) { return h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v)); }

  LM.searchSources.push({
    app: 'portal',
    items: () => (LM.online() ? [
      ...NOTICES.map((n) => ({ title: n.title, sub: '한서 포털 · ' + n.at, text: n.title + ' ' + n.body.join(' ') })),
      { title: '출결', sub: '3/16~3/17 전 과목 결석', text: '출결 결석 3/16 3/17' },
      { title: '일반휴학 신청', sub: '3/16 22:40 · 접수(학과 승인 대기) · 슬레이트', text: '휴학 신청 슬레이트 개인 사정' },
    ] : []),
  });
})();
