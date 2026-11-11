/* 게임 시계 ×4. 시작 2026-03-17 21:10. G.gameMs 하나만 시간의 출처다.
 * 일시정지·백그라운드에서는 흐르지 않는다. 설계: STATE_MANAGEMENT 9절 */
(function () {
  'use strict';
  const LM = window.LM;
  const SPEED = 4;
  const reasons = new Set();
  let lastReal = 0;
  let lastTick = 0;
  let lastSave = 0;
  let lastMinute = null;
  let lastDay = null;

  LM.now = function () { return new Date(LM.G ? LM.G.gameMs : Date.now()); };

  LM.pause = function (reason) {
    reasons.add(reason || 'manual');
    lastReal = Date.now();
  };
  LM.resume = function (reason) {
    if (reason == null) reasons.clear();
    else reasons.delete(reason);
    lastReal = Date.now();
  };
  LM.paused = function () { return reasons.size > 0; };

  function update(forceTick) {
    const G = LM.G;
    if (!G) return;
    const real = Date.now();
    if (!lastReal) lastReal = real;
    let dt = real - lastReal;
    lastReal = real;
    if (dt < 0 || dt > 5000) dt = 0;

    if (!LM.paused() && !document.hidden && dt > 0) {
      G.gameMs += dt * SPEED;
      if (LM.sched && LM.sched._checkDue) LM.sched._checkDue();
    }

    const now = LM.now();
    const minute = Math.floor(G.gameMs / 60000);
    const day = now.getFullYear() * 400 + now.getMonth() * 32 + now.getDate();
    if (minute !== lastMinute) {
      lastMinute = minute;
      LM.emit('minute', minute);
      LM.emit('g', { path: 'gameMs', value: G.gameMs });
    }
    if (day !== lastDay) { lastDay = day; LM.emit('day', now); }

    if (forceTick || real - lastTick >= 1000) {
      lastTick = real;
      LM.emit('tick', now);
    }

    if (real - lastSave >= 5000 && !LM.paused() && !document.hidden) {
      lastSave = real;
      LM.saveGame('auto');
    }
  }

  LM.advance = function (gameMinutes) {
    const G = LM.G;
    if (!G) return LM.now();
    const mins = Number(gameMinutes) || 0;
    const target = G.gameMs + mins * 60000;
    if (LM.sched && LM.sched._advanceTo) LM.sched._advanceTo(target);
    else G.gameMs = target;
    lastReal = Date.now();
    lastMinute = Math.floor(G.gameMs / 60000);
    LM.emit('tick', LM.now());
    LM.emit('advance', { minutes: mins, gameMs: G.gameMs });
    LM.saveGame('auto');
    return LM.now();
  };

  document.addEventListener('visibilitychange', () => {
    lastReal = Date.now();
    if (document.visibilityState === 'hidden') {
      LM.saveGame('auto');
    } else {
      LM.emit('tick', LM.now());
      if (LM.sched && LM.sched._flush) LM.sched._flush();
    }
  });
  window.addEventListener('pagehide', () => { LM.saveGame('auto'); });

  lastMinute = Math.floor(LM.G.gameMs / 60000);
  setInterval(update, 100);
})();
