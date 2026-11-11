/* 카메라 — 설계: design/03-features/MEDIA_SPECIFICATION.md 2절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-CAM-VIEWFINDER */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const COMPS = ['책상', '서랍', '침대', '창밖'];

  LM.register({
    id: 'cam',
    render(app) {
      app.root.classList.add('dark-chrome');
      app.start((nav) => viewfinder(app));
    },
  });

  function viewfinder(app) {
    let comp = 0;
    let drawerOpen = false;
    let mode = '사진';
    const locked = !!(app.opts && app.opts.fromLock);

    const scenes = h('div', { class: 'cam-view' },
      sceneDesk(), sceneDrawer(() => { drawerOpen = !drawerOpen; drawDrawer(); }), sceneBed(), sceneWindow());
    const drawerEl = scenes.children[1];

    const dots = h('div', { class: 'cam-dots' }, COMPS.map((name, i) => h('button', {
      class: 'cam-dot' + (i === 0 ? ' on' : ''), 'aria-label': name + ' 구도',
      onclick: () => select(i),
    })));

    const drawDrawer = () => {
      drawerEl.classList.toggle('open', drawerOpen);
      const env = drawerEl.querySelector('.cam-envelope');
      if (env) env.hidden = !drawerOpen;
      LM.setEid(comp === 1 && drawerOpen ? 'E-217b' : comp === 0 ? 'E-217a' : null);
    };

    const select = (i) => {
      comp = i;
      Array.from(scenes.children).forEach((el, j) => { el.hidden = j !== i; });
      dots.querySelectorAll('.cam-dot').forEach((d, j) => d.classList.toggle('on', j === i));
      LM.setEid(i === 0 ? 'E-217a' : i === 1 && drawerOpen ? 'E-217b' : null);
      if (i === 1) drawDrawer();
    };

    const flashIcon = h('button', { class: 'cam-mini', 'aria-label': '플래시(장식)', onclick: () => ui.toast('플래시 자동(프로토타입)') }, LM.icon('flash'));
    const closeBtn = h('button', { class: 'cam-mini', 'aria-label': '닫기', onclick: () => app.close() }, LM.icon('close'));

    const modes = h('div', { class: 'cam-modes' },
      ['사진', '동영상'].map((m) => h('button', {
        class: 'cam-mode' + (m === mode ? ' on' : ''), 'aria-pressed': m === mode,
        onclick: () => { mode = m; modes.querySelectorAll('.cam-mode').forEach((b) => { b.classList.toggle('on', b.textContent === m); b.setAttribute('aria-pressed', b.textContent === m); }); },
      }, m)));

    const thumb = h('button', {
      class: 'cam-thumb', 'aria-label': locked ? '앨범 잠김' : '사진첩 열기',
      onclick: () => {
        if (locked) { ui.toast('잠금 상태에서는 사진첩을 열 수 없다'); return; }
        LM.openApp('photo');
      },
    }, ui.photo('성원아파트 방 창가', { ratio: '1 / 1', caption: false }));

    const shutter = h('button', {
      class: 'cam-shutter', 'aria-label': '촬영',
      onclick: () => {
        if (mode === '동영상') { ui.toast('동영상은 프로토타입에 없다'); return; }
        const flash = h('div', { class: 'flash' });
        scr.appendChild(flash);
        setTimeout(() => flash.remove(), 100);
        const eid = comp === 1 && drawerOpen ? 'E-217b' : comp === 0 ? 'E-217a' : 'SHOT';
        const title = eid === 'E-217b' ? '서랍 봉투 박미선님 65' : eid === 'E-217a' ? '책상 포스트잇' : '카메라 사진';
        LM.saveShot({ eid: eid, title: title, app: 'cam', key: COMPS[comp] + ' 촬영' });
        ui.toast('사진에 저장됨');
      },
    }, h('span', { class: 'cam-shutter-in' }));

    const scr = h('section', { class: 'scr cam' },
      scenes,
      h('div', { class: 'cam-top' }, closeBtn, dots, flashIcon),
      modes,
      h('div', { class: 'cam-bottom' },
        h('div', { class: 'cam-thumb-wrap' }, thumb, locked ? h('span', { class: 'cam-locked' }, '잠금') : null),
        shutter,
        h('button', { class: 'cam-switch', 'aria-label': '카메라 전환', onclick: () => ui.toast('전면 카메라(프로토타입)') }, LM.icon('rotate'))));

    let sx = null;
    scenes.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    scenes.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx; sx = null;
      if (dx > 50 && comp > 0) select(comp - 1);
      else if (dx < -50 && comp < COMPS.length - 1) select(comp + 1);
    });

    select(0);
    return scr;
  }

  /* ---------- 도현의 방 4구도 (CSS 면) ---------- */
  function sceneDesk() {
    return h('div', { class: 'cam-scene cam-desk' },
      h('div', { class: 'cam-monitor' }, h('span', { class: 'cam-postit' }, '이웃마켓 예약', h('br'), '3/14 리버뷰')),
      h('div', { class: 'cam-desk-top' }));
  }
  function sceneDrawer(onTap) {
    const env = h('div', { class: 'cam-envelope', hidden: true },
      h('span', { class: 'cam-env-to' }, '박미선님 65'));
    return h('div', { class: 'cam-scene cam-drawer' },
      h('div', { class: 'cam-drawer-front' },
        h('button', { class: 'cam-drawer-hotspot', 'aria-label': '서랍 열기', onclick: (e) => { e.stopPropagation(); onTap(); } },
          h('span', null, '서랍'), env)));
  }
  function sceneBed() {
    return h('div', { class: 'cam-scene cam-bed' },
      h('div', { class: 'cam-bed-shape' }),
      h('div', { class: 'cam-jacket' }, '한서대'),
      h('div', { class: 'cam-bag' }));
  }
  function sceneWindow() {
    return h('div', { class: 'cam-scene cam-window' },
      h('div', { class: 'cam-win' }, h('span', { class: 'cam-out' }), h('span', { class: 'cam-swing' })),
      h('div', { class: 'cam-sill' }));
  }
})();
