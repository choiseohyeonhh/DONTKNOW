/* 찾기 — 설계: design/03-features/MAIL_AND_CLOUD_SPECIFICATION.md 3절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-FIND-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const LABELS = [
    { name: '성원구청역', x: 53, y: 27, main: true },
    { name: '청운고시원', x: 22, y: 50 },
    { name: '해담고시텔', x: 64, y: 57 },
    { name: '성원스파', x: 37, y: 72 },
    { name: '편의점', x: 78, y: 76 },
    { name: '교회', x: 20, y: 26 },
  ];

  const DEVICES = [
    {
      id: 'phone', name: '도현의 폰', model: '이 기기', icon: 'phone', mine: true,
      last: () => '지금', where: () => '집', whereNote: () => '3/17 21:10',
    },
    {
      id: 'slate', name: '도현의 슬레이트', model: '슬레이트 9(2021) · 셀룰러 없음(Wi-Fi 전용)', icon: 'devices', mine: false,
      last: () => (LM.online() ? '방금 전' : '3월 15일'),
      where: () => (LM.online() ? '성원구청역 일대 · 반경 300m · 3분 전' : '성원구청역 일대 · 반경 300m'),
      whereNote: () => (LM.online() ? '방금 전' : '3/15 03:58 마지막 확인'),
    },
  ];

  LM.register({
    id: 'find',
    render(app) { app.start((nav) => devices(nav)); },
  });

  const kv = (k, v) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v));

  function devices(nav) {
    const online = LM.online();
    const wrap = h('div');
    const refresh = () => {
      wrap.replaceChildren(
        online ? ui.notice('위치를 확인하는 중이다. 기기 위치는 대략적인 범위로만 표시된다.') : ui.notice('오프라인 상태입니다. 마지막으로 확인된 위치만 보입니다.', 'warn'),
        ui.group({
          header: '기기', rows: DEVICES.map((d) => ui.row({
            title: d.name, subtitle: d.model, meta: d.last(), icon: d.icon,
            onClick: () => nav.push(() => devicePage(nav, d)),
          })),
        }),
        ui.section('지도'),
        mapView('slate', true),
      );
    };
    refresh();
    LM.on('state', () => { if (wrap.isConnected) refresh(); });
    return ui.page({
      title: '기기', nav,
      right: h('button', { class: 'nb-btn', 'aria-label': '새로고침', onclick: () => { ui.toast(LM.online() ? '위치를 새로 고쳤다' : '오프라인 상태입니다. 캐시만 표시합니다.'); } }, LM.icon('refresh')),
      body: wrap,
    });
  }

  /* CSS로 그린 단순 지도 면. 반경·라벨은 대략적인 위치이며 정답을 강조하지 않는다. */
  function mapView(which, compact) {
    const labelList = which === 'slate' ? LABELS : [{ name: '집', x: 50, y: 50, main: true }];
    return h('div', { class: 'find-map' + (compact ? ' compact' : ''), role: 'region', 'aria-label': '기기 위치 지도' },
      h('span', { class: 'find-river' }),
      h('span', { class: 'find-road find-road-a' }),
      h('span', { class: 'find-road find-road-b' }),
      h('span', { class: 'find-road find-road-c' }),
      which === 'slate' ? h('span', { class: 'find-radius' }, h('i', null, '반경 300m')) : null,
      labelList.map((l) => h('span', { class: 'find-pin' + (l.main ? ' main' : ''), style: { left: l.x + '%', top: l.y + '%' } }, h('i'), h('b', null, l.name))),
    );
  }

  function devicePage(nav, d) {
    const online = LM.online();
    if (d.id === 'slate' && online) LM.C.see('E-73');
    if (d.id === 'slate') LM.setEid('E-73');
    let lost = false;
    const body = h('div');
    const draw = () => {
      const lostBtn = h('button', {
        class: 'btn gray m find-action', disabled: !online,
        onclick: () => { lost = !lost; if (lostBtn) lostBtn.querySelector('span').textContent = lost ? '분실 모드 끄기' : '분실 모드 켜기'; ui.toast(lost ? '분실 모드를 켰다(프로토타입)' : '분실 모드를 껐다'); },
      }, LM.icon('lock'), h('span', null, lost ? '분실 모드 끄기' : '분실 모드 켜기'));

      body.replaceChildren(
        mapView(d.id, false),
        online ? null : ui.notice('오프라인 상태입니다. 실시간 위치를 불러올 수 없습니다.', 'warn'),
        ui.group({
          header: d.name,
          rows: [
            kv('모델', d.model),
            kv('마지막 활동', d.last()),
            kv(d.id === 'phone' ? '위치' : (online ? '위치' : '마지막으로 확인된 위치'), d.where()),
            kv('확인 시각', d.whereNote()),
          ],
        }),
        h('div', { class: 'find-actions' },
          h('button', {
            class: 'btn filled m find-action', disabled: !online,
            onclick: () => ui.toast(d.id === 'slate' ? '슬레이트에서 소리가 난다(프로토타입)' : '이 기기에서 소리가 난다(프로토타입)'),
          }, LM.icon('play'), h('span', null, '소리 재생')),
          lostBtn,
          h('button', {
            class: 'btn gray m find-action find-wipe', disabled: !online,
            onclick: () => wipe(d),
          }, LM.icon('erase'), h('span', null, '기기 지우기')),
        ),
      );
      if (lost) lostBtn.querySelector('span').textContent = '분실 모드 끄기';
    };
    draw();
    LM.on('state', () => { if (body.isConnected) draw(); });
    return ui.page({
      title: d.name, back: '기기', nav, large: false,
      right: h('button', { class: 'nb-btn', 'aria-label': '새로고침', onclick: () => { draw(); ui.toast(LM.online() ? '위치를 새로 고쳤다' : '오프라인 상태입니다.'); } }, LM.icon('refresh')),
      right: h('button', { class: 'nb-btn', 'aria-label': '공유', onclick: () => ui.share({ eid: d.id === 'slate' ? 'E-73' : null, title: d.name + ' 위치', kind: 'location', app: 'find' }) }, LM.icon('share')),
      body,
    });
  }

  function wipe(d) {
    ui.alert({
      title: '이 기기를 원격으로 지우시겠습니까?',
      text: '사진·메시지·메모가 이 기기에서 삭제됩니다. 되돌릴 수 없습니다.',
      actions: [
        { label: '취소', cancel: true },
        { label: '원격 지우기', destructive: true, onClick: () => ui.toast('프로토타입: 기기 지우기는 실행되지 않는다') },
      ],
    });
  }

  LM.searchSources.push({
    app: 'find',
    items: () => DEVICES.map((d) => ({ title: d.name, sub: d.model + ' · ' + d.last(), text: d.name + ' ' + d.model + ' ' + d.where() })),
  });
})();
