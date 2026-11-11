/* 날씨 — 현재 지역 큰 카드, 시간별·10일 예보, 저장 지역.
 * "성원구청동"(다른 기기 3/15 08:40 추가)은 온라인일 때만 보인다(E-213).
 * 설계: design/03-features/MAPS_AND_MOBILITY_SPECIFICATION.md 3절, SCREEN_SPECIFICATIONS_APPS.md SCR-WTHR-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  /* 예보 값은 장식(단서 아님). 3월 중순 수도권 수준의 기온만 맞춘다. */
  const CITIES = [
    {
      id: 'seongwon', name: '성원시', sub: '현재 위치', current: true, now: 8, cond: '구름 조금', icon: 'cloudy', hi: 11, lo: 2, base: 0,
    },
    { id: 'hanseo', name: '한서대', sub: '서울', now: 7, cond: '맑음', icon: 'sunny', hi: 10, lo: 1, base: -1 },
    { id: 'gucheong', name: '성원구청동', sub: '다른 기기에서 추가됨', addedAt: '3/15 08:40', onlineOnly: true, now: 8, cond: '흐림', icon: 'cloudy', hi: 10, lo: 3, base: 0 },
    { id: 'incheon', name: '인천', sub: '인천', now: 7, cond: '바람', icon: 'cloudy', hi: 9, lo: 2, base: -1 },
    { id: 'suwon', name: '수원', sub: '경기', now: 8, cond: '맑음', icon: 'sunny', hi: 12, lo: 1, base: 1 },
    { id: 'chuncheon', name: '춘천', sub: '강원', now: 5, cond: '흐림', icon: 'cloudy', hi: 8, lo: -1, base: -3 },
  ];

  const DAILY = [
    ['화', 'cloudy', 11, 2, 10], ['수', 'rain', 9, 3, 60], ['목', 'cloudy', 10, 4, 20],
    ['금', 'sunny', 12, 3, 0], ['토', 'sunny', 13, 4, 0], ['일', 'cloudy', 11, 5, 20],
    ['월', 'rain', 9, 4, 70], ['화', 'cloudy', 10, 3, 30], ['수', 'sunny', 12, 2, 0], ['목', 'sunny', 13, 3, 0],
  ];
  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
  const TEMP_BY_HOUR = { 0: 5, 1: 5, 2: 4, 3: 4, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 11, 13: 11, 14: 11, 15: 10, 16: 10, 17: 9, 18: 9, 19: 8, 20: 8, 21: 8, 22: 7, 23: 6 };

  let currentId = 'seongwon';
  let added = new Set(['hanseo']);
  let removed = new Set();
  let liveDraw = null, liveEl = null;

  LM.on('state', () => {
    const c = city(currentId);
    if (c && c.onlineOnly && !LM.online()) currentId = 'seongwon';
    if (liveEl && liveEl.isConnected && liveDraw) liveDraw();
  });

  LM.register({ id: 'wthr', render(app) { app.start((nav) => home(nav)); } });

  function city(id) { return CITIES.find((c) => c.id === id); }
  function visibleCities() {
    return CITIES.filter((c) => {
      if (c.current) return true;
      if (c.onlineOnly) return LM.online() && !removed.has(c.id);
      return added.has(c.id) && !removed.has(c.id);
    });
  }
  function extraCities() { return CITIES.filter((c) => !c.current && !c.onlineOnly); }

  function home(nav) {
    const scroll = h('div', { class: 'w-scroll' });
    const draw = () => {
      const c = city(currentId);
      scroll.replaceChildren(nowBlock(c), hourlyBlock(c), dailyBlock(c), cityBlock(nav));
    };
    draw();
    liveDraw = draw; liveEl = scroll;
    return h('section', { class: 'w-screen' },
      h('header', { class: 'w-top' },
        h('div', { class: 'w-top-in' },
          h('h1', null, '날씨'),
          h('button', { class: 'w-listbtn', 'aria-label': '지역 목록', onclick: () => nav.push(() => cities(nav)) }, LM.icon('list')))),
      scroll);
  }

  function nowBlock(c) {
    return h('div', { class: 'w-now' },
      h('div', { class: 'w-now-city' }, c.name, c.current ? h('small', null, '현재 위치') : c.onlineOnly ? h('small', null, '다른 기기에서 추가됨 · ' + c.addedAt) : null),
      h('div', { class: 'w-now-temp' }, c.now + '°'),
      h('div', { class: 'w-now-cond' }, LM.icon(c.icon, 'w-cond-ic'), c.cond),
      h('div', { class: 'w-now-hl' }, '최고 ' + c.hi + '°  최저 ' + c.lo + '°'));
  }

  function hourlyBlock(c) {
    const nowH = LM.now().getHours();
    const items = Array.from({ length: 12 }, (_, i) => {
      const hour = (nowH + i) % 24;
      const night = hour < 7 || hour >= 20;
      const icon = c.cond === '바람' || c.cond === '흐림' ? 'cloudy' : night ? 'moonc' : c.icon;
      return h('div', { class: 'w-h-item' + (i === 0 ? ' now' : '') },
        h('div', { class: 'w-h-t' }, i === 0 ? '지금' : hour + '시'),
        LM.icon(icon, 'w-h-ic'),
        h('div', { class: 'w-h-v' }, TAX(c, hour) + '°'));
    });
    return h('div', { class: 'w-block' },
      ui.section('시간별 예보'),
      h('div', { class: 'w-hourly' }, items));
  }
  function TAX(c, hour) { return (TEMP_BY_HOUR[hour] || 6) + c.base; }

  function dailyBlock(c) {
    return h('div', { class: 'w-block' },
      ui.section('10일 예보'),
      h('div', { class: 'w-daily' }, DAILY.map(([day, icon, hi, lo, pop]) => h('div', { class: 'w-d-row' },
        h('span', { class: 'w-d-day' }, day),
        h('span', { class: 'w-d-ic' }, LM.icon(icon)),
        h('span', { class: 'w-d-pop' }, pop ? pop + '%' : ''),
        h('span', { class: 'w-d-lo' }, (lo + c.base) + '°'),
        h('span', { class: 'w-d-bar' }, h('i', { style: { left: Math.max(0, 20 + (lo + c.base) * 4) + '%', right: Math.max(0, 44 - (hi + c.base) * 3) + '%' } })),
        h('span', { class: 'w-d-hi' }, (hi + c.base) + '°')))));
  }

  function cityBlock(nav) {
    const list = visibleCities();
    return h('div', { class: 'w-block w-block-last' },
      ui.section('저장 지역', h('button', { onclick: () => nav.push(() => cities(nav)) }, '목록')),
      ui.group({
        plain: true,
        rows: list.map((c) => ui.row({
          title: c.name,
          subtitle: c.current ? '현재 위치' : c.onlineOnly ? '다른 기기에서 추가됨 · ' + c.addedAt : (c.sub || ''),
          value: c.now + '°', icon: c.current ? 'location' : 'pin',
          onClick: () => { if (c.id === 'gucheong' && LM.online()) LM.C.see('E-213'); currentId = c.id; drawHome(); },
        })),
      }));
  }

  function drawHome() { if (liveDraw) liveDraw(); }

  function cities(nav) {
    const body = () => visibleCities().map((c) => ui.row({
      title: c.name,
      subtitle: c.current ? '현재 위치 · 삭제할 수 없음' : c.onlineOnly ? '다른 기기에서 추가됨 · ' + c.addedAt : (c.sub || ''),
      value: c.now + '°', check: currentId === c.id,
      onClick: () => { if (c.id === 'gucheong' && LM.online()) LM.C.see('E-213'); currentId = c.id; drawHome(); nav.pop(); },
      onLong: c.current ? null : () => ui.actionSheet({
        title: c.name + ' 삭제', text: c.onlineOnly ? '다른 기기에서 추가한 지역이다.' : '',
        actions: [{ label: '지역 삭제', destructive: true, onClick: () => { if (currentId === c.id) currentId = 'seongwon'; removed.add(c.id); added.delete(c.id); drawHome(); ui.toast('지역을 삭제했다'); nav.pop(); nav.push(() => cities(nav)); } }],
      }),
    }));
    const host = h('div');
    const draw = () => {
      host.replaceChildren(
        ui.group({ header: '지역', plain: true, rows: body() }),
        ui.group({ rows: [ui.row({ title: '지역 추가', icon: 'plus', action: true, onClick: () => addSheet(nav) })] }));
    };
    draw();
    return ui.page({ title: '지역', back: '날씨', nav, body: host });
  }

  function addSheet(nav) {
    const pool = extraCities();
    ui.sheet(null, ui.sheetPage({
      title: '지역 추가', cancel: '닫기', grouped: true,
      body: ui.group({ rows: pool.map((c) => ui.row({
        title: c.name, subtitle: c.sub || '', check: added.has(c.id) && !removed.has(c.id),
        onClick: () => {
          if (added.has(c.id) && !removed.has(c.id)) { added.delete(c.id); }
          else { added.add(c.id); removed.delete(c.id); }
          drawHome();
          document.querySelectorAll('.sheet-wrap').forEach((w) => w.close());
          nav.pop(); nav.push(() => cities(nav));
        },
      })) }),
    }), { size: 'medium' });
  }

  LM.searchSources.push({ app: 'wthr', items: () => visibleCities().map((c) => ({ title: c.name + ' 날씨', sub: c.now + '° · ' + c.cond, text: c.name + ' 날씨 ' + c.cond })) });
})();
