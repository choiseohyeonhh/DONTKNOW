/* 디버그 패널 (?debug). 게임 상태 확인 + 시간 이동. window.DK는 항상 노출된다(state.js). */
(function () {
  'use strict';
  const LM = window.LM;
  const h = LM.h;
  let el = null;

  function fmt(ms) {
    try { return LM.fmtDateTime(new Date(ms)); } catch (e) { return String(ms); }
  }

  function draw() {
    if (!el || !LM.G) return;
    const G = LM.G;
    const dh = G.npc ? (G.npc.DH === 'X' ? 'X' : G.npc.DH) : '?';
    el.querySelector('.dk-dbg-body').textContent =
      'time ' + fmt(G.gameMs) + '\n' +
      'online ' + (LM.online() ? 'Y' : 'N') + '  wifi ' + (LM.state.wifi ? 'Y' : 'N') + '  air ' + (LM.state.airplane ? 'Y' : 'N') + '\n' +
      'DH ' + dh + '  alert ' + (G.npc ? G.npc.alert : '?') + '  firstOnline ' + (G.firstOnlineAt ? fmt(G.firstOnlineAt) : '-') + '\n' +
      'flags ' + Object.keys(G.flags || {}).filter((k) => G.flags[k] && G.flags[k] !== 'none' && G.flags[k] !== 'pending').map((k) => k + '=' + G.flags[k]).join(' ') + '\n' +
      'sched ' + (G.sched ? G.sched.length : 0) + '  events ' + Object.keys(G.events || {}).length + '  notifs ' + (G.notifs ? G.notifs.length : 0);
  }

  function btn(label, fn) {
    return h('button', { onclick: fn }, label);
  }

  function init() {
    let q = null;
    try { q = new URLSearchParams(location.search); } catch (e) { q = null; }
    if (!q || !q.has('debug') || el) return;
    el = h('div', { class: 'dk-debug', role: 'region', 'aria-label': '디버그 패널' },
      h('div', { class: 'dk-dbg-head' }, h('b', null, 'DEBUG'), btn('×', () => el.remove())),
      h('pre', { class: 'dk-dbg-body' }),
      h('div', { class: 'dk-dbg-btns' },
        btn('+10분', () => LM.advance(10)),
        btn('+60분', () => LM.advance(60)),
        btn('Wi-Fi', () => LM.set({ airplane: false, wifi: !(LM.state.wifi && !LM.state.airplane) })),
        btn('덤프', () => { try { console.log('[DK state]', JSON.stringify(LM.G, null, 2)); } catch (e) { console.log(LM.G); } }),
        btn('리셋', () => { LM.newGame(); location.reload(); })));
    document.body.appendChild(el);
    draw();
    LM.on('tick', draw);
    LM.on('g', draw);
    LM.on('state', draw);
    LM.on('notify', draw);
  }

  LM.debugPanel = { init: init, draw: draw };
})();
