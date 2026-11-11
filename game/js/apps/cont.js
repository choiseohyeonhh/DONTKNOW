/* 연락처 — 즐겨찾기·가나다 목록·상세. 캐논: MESSAGING_SPECIFICATION 4절, SCR-CONT-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const CONTACTS = [
    { id: 'k', name: 'K', full: 'K', sec: 'K', phone: '', address: '리버뷰타워 1203' },
    { id: 'kim', name: '김태윤', full: '김태윤 경위', sec: 'ㄱ', phone: '010-XXXX-0000', company: '성원경찰서 수사과' }, // 번호 자리표시(캐논 없음)
    { id: 'nuri', name: '누리은행 고객센터', full: '누리은행 고객센터', sec: 'ㄴ', phone: '1588-XXXX', company: '누리은행' },
    { id: 'taxi', name: '바로택시', full: '바로택시', sec: 'ㅂ', phone: '1588-XXXX', company: '바로택시' }, // 번호 자리표시(캐논 없음)
    { id: 'seoa', name: '서아', full: '한서아', sec: 'ㅅ', phone: '010-XXXX-0000', favorite: true }, // 번호 자리표시(캐논 없음)
    { id: 'police', name: '성원경찰서', full: '성원경찰서', sec: 'ㅅ', phone: '02-XXXX-XXXX' }, // 번호 자리표시(캐논 없음)
    { id: 'dad', name: '아빠', full: '이상철', sec: 'ㅇ', phone: '010-XXXX-0403', birthday: '1968년 4월 3일', company: '한빛물류', memo: '5일 — 80' },
    { id: 'me', name: '이도현', full: '이도현', sec: 'ㅇ', phone: '010-XXXX-0921', company: '한서대학교 경영학과' },
    { id: 'jh', name: '정지훈', full: '정지훈', sec: 'ㅈ', phone: '010-XXXX-2290', favorite: true },
    { id: 'cheongun', name: '청운고시원 총무 오정자', full: '오정자', sec: 'ㅊ', phone: '010-XXXX-0000', company: '청운고시원', address: '성원구청로 18' }, // 번호 자리표시(캐논 없음)
    { id: 'hankyul', name: '한결캐피탈', full: '한결캐피탈', sec: 'ㅎ', phone: '1600-XXXX' },
    { id: 'hanseo', name: '한서대학교', full: '한서대학교', sec: 'ㅎ', phone: '041-XXXX-XXXX' }, // 번호 자리표시(캐논 없음)
  ];

  LM.register({ id: 'cont', render(app) { app.start((nav) => list(nav)); } });

  const norm = (s) => String(s || '').toLowerCase().replace(/[\s\-]/g, '');
  const val = (v) => (v == null || v === '' ? '없음' : v);
  const kv = (k, v) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v));

  function row(nav, c) {
    return ui.row({
      title: c.name,
      subtitle: c.full && c.full !== c.name ? c.full : (c.phone || c.address || ''),
      avatar: c.name, avatarSize: 32,
      onClick: () => nav.push(() => detail(nav, c)),
    });
  }

  function list(nav) {
    const body = h('div');
    function draw(q) {
      const nq = norm(q);
      if (nq) {
        const hits = CONTACTS.filter((c) => norm(c.name + ' ' + c.full + ' ' + c.phone).includes(nq));
        body.replaceChildren(hits.length
          ? ui.group({ plain: true, rows: hits.map((c) => row(nav, c)) })
          : ui.empty({ icon: 'search', title: '결과 없음' }));
        return;
      }
      const favs = CONTACTS.filter((c) => c.favorite);
      const kids = [];
      if (favs.length) { kids.push(ui.section('즐겨찾기')); kids.push(ui.group({ plain: true, rows: favs.map((c) => row(nav, c)) })); }
      const secs = [];
      CONTACTS.filter((c) => !c.favorite).forEach((c) => { if (!secs.includes(c.sec)) secs.push(c.sec); });
      secs.forEach((s) => {
        kids.push(h('div', { class: 'cont-sec' }, s));
        kids.push(ui.group({ plain: true, rows: CONTACTS.filter((c) => !c.favorite && c.sec === s).map((c) => row(nav, c)) }));
      });
      body.replaceChildren(...kids);
    }
    draw('');
    return ui.page({ title: '연락처', search: '검색', onSearch: draw, body });
  }

  function detail(nav, c) {
    if (c.id === 'dad') LM.C.see('E-210');
    const body = h('div', null,
      h('div', { class: 'cont-hero' },
        ui.avatar(c.name, 86),
        h('div', { class: 'cont-hero-name' }, c.name),
        c.full && c.full !== c.name ? h('div', { class: 'cont-hero-sub' }, c.full) : null),
      ui.group({ rows: [
        ui.row({ title: '전화', value: c.phone || '없음', action: true, onClick: () => { if (c.phone) copy(c.phone); } }),
        ui.row({ title: '생일', value: c.birthday || '없음', action: true, onClick: () => { if (c.birthday) LM.openApp('cal'); } }),
      ] }),
      ui.group({ rows: [kv('회사', val(c.company)), kv('메모', val(c.memo)), kv('주소', val(c.address))] }),
      ui.group({ rows: [
        ui.row({ title: '번호 복사', icon: 'copy', action: true, onClick: () => copy(c.phone) }),
        ui.row({ title: '정보', icon: 'info', action: true, onClick: () => info(c) }),
      ] }),
    );
    const page = ui.page({
      title: c.name, back: '연락처', nav, large: false, grouped: true, body,
      right: h('button', { class: 'nb-btn', 'aria-label': '정보', onclick: () => info(c) }, LM.icon('info')),
    });
    LM.longPress(page, () => info(c));
    return page;
  }

  function copy(phone) {
    if (!phone) { ui.toast('복사할 번호가 없다'); return; }
    ui.toast('번호를 복사했다');
  }

  function info(c) {
    ui.info(c.name, [
      ['이름', val(c.full)],
      ['전화', val(c.phone)],
      ['생일', val(c.birthday)],
      ['회사', val(c.company)],
      ['메모', val(c.memo)],
      ['주소', val(c.address)],
    ]);
  }

  LM.searchSources.push({ app: 'cont', items: () => CONTACTS.map((c) => ({ title: c.name, sub: c.phone || c.address || c.full, text: c.name + ' ' + c.full + ' ' + c.phone + ' ' + c.company + ' ' + c.memo + ' ' + c.address })) });
})();
