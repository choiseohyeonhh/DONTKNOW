/* 시계 — 세계 시계·알람·스톱워치·타이머.
 * 설계: design/03-features/PERSONAL_DATA_APPS_SPECIFICATION.md 4절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-CLOCK-*, EVIDENCE_LEDGER E-212 */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const alarms = [
    { id: 'a1', time: '07:30', label: '경찰서 10시', repeat: '3월 20일', enabled: true, createdAt: '3/14 18:21' },
    { id: 'a2', time: '07:40', label: '1교시', repeat: '매일', enabled: true },
    { id: 'a3', time: '12:30', label: 'GJ', repeat: '화·금', enabled: false, note: '3/10 이후 꺼짐' },
  ];

  /* 세계 시계 도시는 장식(캐논 없음). 서울 기준 시차. */
  const CITIES = [
    { name: '서울', diff: 0 },
    { name: '도쿄', diff: 0 },
    { name: '런던', diff: -9 },
    { name: '뉴욕', diff: -13 },
  ];

  let subs = [];
  const listen = (ev, fn) => { subs.push(LM.on(ev, fn)); };
  const clearSubs = () => { subs.forEach((f) => f()); subs = []; };

  let sw = { acc: 0, from: 0, running: false, laps: [], iv: null };
  let tm = { total: 300000, remain: 300000, running: false, end: 0, iv: null };

  LM.register({
    id: 'clock',
    render(app) {
      clearSubs();
      stopSw(); stopTm();
      sw = { acc: 0, from: 0, running: false, laps: [], iv: null };
      tm = { total: 300000, remain: 300000, running: false, end: 0, iv: null };
      app.setTabs([
        { label: '세계 시계', icon: 'world', build: (nav) => worldPage(nav) },
        { label: '알람', icon: 'alarm', build: (nav) => alarmsPage(nav) },
        { label: '스톱워치', icon: 'stopwatch', build: (nav) => stopwatchPage(nav) },
        { label: '타이머', icon: 'timer', build: (nav) => timerPage(nav) },
      ], 1);
    },
    onClose() { clearSubs(); stopSw(); stopTm(); },
  });

  function stopSw() { if (sw.iv) { clearInterval(sw.iv); sw.iv = null; } }
  function stopTm() { if (tm.iv) { clearInterval(tm.iv); tm.iv = null; } }

  const p2 = (n) => String(n).padStart(2, '0');
  function clock(ms) {
    const cs = Math.floor(ms / 10) % 100;
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000) % 60;
    const hh = Math.floor(ms / 3600000);
    return (hh ? hh + ':' + p2(m) : p2(m)) + ':' + p2(s) + '.' + p2(cs);
  }
  function tval(ms) {
    const s = Math.ceil(ms / 1000);
    const m = Math.floor(s / 60);
    return p2(m) + ':' + p2(s % 60);
  }

  /* ---------- 세계 시계 ---------- */
  function worldPage() {
    const body = h('div', { class: 'wc-list' });
    const draw = () => {
      const base = LM.now();
      body.replaceChildren(...CITIES.map((c) => {
        const d = new Date(base.getTime() + c.diff * 3600000);
        return h('div', { class: 'wc-row' },
          h('div', { class: 'wc-city' },
            h('span', { class: 'wc-name' }, c.name),
            h('span', { class: 'wc-diff' }, c.diff === 0 ? '서울과 같은 시간' : (c.diff > 0 ? '+' : '') + c.diff + '시간')),
          h('div', { class: 'wc-time' }, LM.fmtTime(d)));
      }));
    };
    draw();
    listen('tick', draw);
    return ui.page({ title: '세계 시계', body });
  }

  /* ---------- 알람 ---------- */
  function alarmsPage(nav) {
    const body = h('div');
    const draw = () => body.replaceChildren(ui.group({
      plain: true,
      rows: alarms.map((a) => alarmRow(nav, a, draw)),
    }));
    draw();
    listen('clkAlarm', draw);
    return ui.page({ title: '알람', body });
  }

  function alarmRow(nav, a, redraw) {
    const open = () => nav.push(() => alarmDetail(nav, a));
    return h('div', {
      class: 'clk-alarm' + (a.enabled ? '' : ' off'),
      role: 'button',
      tabindex: '0',
      'aria-label': a.time + ' ' + a.label + ', ' + (a.enabled ? '켜짐' : '꺼짐'),
      onclick: open,
      onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } },
    },
    h('div', { class: 'clk-alarm-t' },
      h('div', { class: 'clk-time' }, a.time),
      h('div', { class: 'clk-label' }, a.label),
      h('div', { class: 'clk-rep' }, a.repeat + (a.enabled ? '' : ' · 꺼짐'))),
    ui.toggle(a.enabled, (v) => { a.enabled = v; LM.emit('clkAlarm'); }));
  }

  function alarmDetail(nav, a) {
    const body = h('div');
    const draw = () => {
      const rows = [
        h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '반복'), h('span', { class: 'kv-v' }, a.repeat)),
        h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '라벨'), h('span', { class: 'kv-v' }, a.label)),
      ];
      if (a.createdAt) rows.push(h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '생성'), h('span', { class: 'kv-v' }, a.createdAt)));
      if (a.lastRang) rows.push(h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, '마지막 울림'), h('span', { class: 'kv-v' }, a.lastRang)));
      body.replaceChildren(
        h('div', { class: 'clk-detail' },
          h('div', { class: 'clk-detail-time' + (a.enabled ? '' : ' off') }, a.time),
          h('div', { class: 'clk-detail-label' }, a.label),
          a.note ? h('div', { class: 'clk-detail-note' }, a.note) : null),
        ui.group({ rows }),
        ui.group({ rows: [ui.row({ title: '알람', toggle: { on: a.enabled, onChange: (v) => { a.enabled = v; LM.emit('clkAlarm'); draw(); } }, chevron: false })] })
      );
    };
    draw();
    const off = LM.on('clkAlarm', draw);
    subs.push(off);
    return ui.page({ title: '알람', back: '알람', nav, body });
  }

  /* ---------- 스톱워치 ---------- */
  function stopwatchPage() {
    const disp = h('div', { class: 'sw-display', 'aria-live': 'off' }, clock(0));
    const laps = h('div', { class: 'sw-laps' });
    const startBtn = h('button', { class: 'sw-btn main', onclick: () => toggleSw() }, '시작');
    const lapBtn = h('button', { class: 'sw-btn', onclick: () => lapSw() }, '랩');
    const resetBtn = h('button', { class: 'sw-btn', onclick: () => resetSw() }, '재설정');

    const paint = () => {
      const ms = elapsed();
      disp.textContent = clock(ms);
      startBtn.textContent = sw.running ? '멈춤' : (ms > 0 ? '계속' : '시작');
      startBtn.classList.toggle('running', sw.running);
      lapBtn.disabled = !sw.running && ms === 0;
      resetBtn.disabled = !sw.running && ms === 0 && !sw.laps.length;
      const list = sw.laps.map((l) => h('div', { class: 'sw-lap' },
        h('span', { class: 'sw-lap-n' }, '랩 ' + l.n),
        h('span', { class: 'sw-lap-split' }, clock(l.split)),
        h('span', { class: 'sw-lap-total' }, clock(l.total))));
      laps.replaceChildren(...(list.length ? list : [h('div', { class: 'sw-empty' }, '랩을 기록하려면 시작을 누른다.')]));
    };
    const tick = () => { disp.textContent = clock(elapsed()); };
    const toggleSw = () => {
      if (sw.running) {
        sw.acc = elapsed(); sw.running = false; stopSw();
      } else {
        sw.from = Date.now(); sw.running = true;
        stopSw(); sw.iv = setInterval(tick, 33);
      }
      paint();
    };
    const lapSw = () => {
      const total = elapsed();
      if (!total) return;
      const prev = sw.laps.length ? sw.laps[0].total : 0;
      sw.laps.unshift({ n: sw.laps.length + 1, split: total - prev, total });
      paint();
    };
    const resetSw = () => {
      stopSw(); sw = { acc: 0, from: 0, running: false, laps: [], iv: null };
      disp.textContent = clock(0); paint();
    };
    paint();
    return ui.page({
      title: '스톱워치',
      body: [disp, h('div', { class: 'sw-btns' }, lapBtn, startBtn, resetBtn), laps],
    });
  }
  function elapsed() { return sw.acc + (sw.running ? Date.now() - sw.from : 0); }

  /* ---------- 타이머 ---------- */
  function timerPage() {
    const disp = h('div', { class: 'tm-display' }, tval(tm.remain));
    const status = h('div', { class: 'tm-status' }, '');
    const mainBtn = h('button', { class: 'sw-btn main', onclick: () => toggleTm() }, '시작');
    const resetBtn = h('button', { class: 'sw-btn', onclick: () => resetTm() }, '재설정');
    const chips = [1, 3, 5, 10].map((min) => h('button', {
      class: 'tm-chip', onclick: () => setTm(min),
    }, min + '분'));

    const paint = () => {
      disp.textContent = tval(tm.remain);
      mainBtn.textContent = tm.running ? '일시정지' : (tm.remain < tm.total ? '계속' : '시작');
      mainBtn.classList.toggle('running', tm.running);
      resetBtn.disabled = tm.remain === tm.total && !tm.running;
      chips.forEach((c) => c.classList.toggle('on', Number(c.textContent.replace('분', '')) * 60000 === tm.total));
    };
    const tick = () => {
      tm.remain = Math.max(0, tm.end - Date.now());
      disp.textContent = tval(tm.remain);
      if (tm.remain <= 0) {
        stopTm(); tm.running = false;
        status.textContent = '시간이 다 되었습니다.';
        paint();
      }
    };
    const toggleTm = () => {
      if (tm.running) {
        tm.remain = Math.max(0, tm.end - Date.now());
        tm.running = false; stopTm();
      } else {
        if (!tm.remain) tm.remain = tm.total;
        tm.end = Date.now() + tm.remain; tm.running = true;
        stopTm(); tm.iv = setInterval(tick, 250);
      }
      paint();
    };
    const setTm = (min) => {
      stopTm(); tm.running = false; tm.total = min * 60000; tm.remain = tm.total;
      status.textContent = ''; paint();
    };
    const resetTm = () => {
      stopTm(); tm.running = false; tm.remain = tm.total; status.textContent = ''; paint();
    };
    paint();
    return ui.page({
      title: '타이머',
      body: [
        disp, status,
        h('div', { class: 'tm-chips' }, chips),
        h('div', { class: 'tm-btns' }, mainBtn, resetBtn),
        ui.notice('타이머는 이 기기에서만 울린다.'),
      ],
    });
  }

  LM.searchSources.push({
    app: 'clock',
    items: () => alarms.map((a) => ({ title: a.time + ' ' + a.label, sub: a.repeat + (a.enabled ? '' : ' · 꺼짐'), text: a.time + ' ' + a.label + ' ' + a.repeat })),
  });
})();
