/* 알림 파이프라인. 모든 알림은 G.notifs에 남고(알림 기록은 원본이 지워져도 남는다),
 * 배너는 잠금 해제 + 방해 금지 아님 + 같은 앱/스레드 안이 아닐 때만 띄운다.
 * 설계: BUSINESS_RULES 8절(BR-30·31), SYSTEM_SHELL 4.6 */
(function () {
  'use strict';
  const LM = window.LM;

  function stamp(at) {
    try {
      const d = new Date(at == null ? LM.G.gameMs : at);
      const p = (n) => String(n).padStart(2, '0');
      return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    } catch (e) { return ''; }
  }
  LM.notifTime = stamp;

  function previewHidden(n) {
    if (!n) return false;
    const p = (LM.state && LM.state.preview) || {};
    if (n.hidden) {
      if (n.app === 'blink') return p.blink !== 'always';
      if (n.app === 'loop') return p.loopdm !== 'always';
      return true;
    }
    if (p[n.app] === 'off') return true;
    if (n.app === 'blink' && p.blink === 'off') return true;
    if (n.app === 'loop') {
      if (n.thread || n.body === '새 메시지') return p.loopdm === 'off' || p.loop === 'off';
    }
    return false;
  }
  LM.notifHidden = previewHidden;

  function canBanner(n) {
    if (!LM.G || !LM.G.unlocked || LM.state.locked) return false;
    if (n && n.noBanner) return false;
    if (LM.state.dnd) return false;
    const cur = LM.current && LM.current();
    if (cur && cur.id === n.app) {
      const active = (typeof cur.activeThread === 'function' ? cur.activeThread() : cur.activeThread) || LM.currentThread;
      if (!n.thread) return false;
      if (!active || active === n.thread) return false;
    }
    return true;
  }

  LM.notify = function (o) {
    o = o || {};
    if (!LM.G) return null;
    const at = o.at == null ? LM.G.gameMs : (o.at instanceof Date ? o.at.getTime() : Number(o.at));
    const n = {
      id: o.id == null ? ('n:' + (LM.G.gameMs) + ':' + Math.random().toString(36).slice(2, 7)) : String(o.id),
      app: o.app || 'system',
      title: o.title == null ? '' : String(o.title),
      body: o.body == null ? '' : String(o.body),
      at: at,
      t: o.t || stamp(at),
      thread: o.thread == null ? null : String(o.thread),
      silent: !!o.silent,
      hidden: !!o.hidden,
      ambient: !!o.ambient,
      noBanner: !!o.noBanner,
    };
    LM.G.notifs = Array.isArray(LM.G.notifs) ? LM.G.notifs : [];
    const i = LM.G.notifs.findIndex((x) => x.id === n.id);
    if (i >= 0) {
      LM.G.notifs[i] = Object.assign({}, LM.G.notifs[i], n);
    } else {
      LM.G.notifs.unshift(n);
    }
    LM.emit('notify', n);
    LM.emit('notifs', LM.G.notifs);
    if (LM._autosave) LM._autosave();
    if (!n.silent && canBanner(n)) {
      if (LM.banner) LM.banner(n);
      else LM.emit('banner', n);
    }
    return n;
  };

  LM.clearNotifs = function (app, thread) {
    if (!LM.G || !Array.isArray(LM.G.notifs)) return 0;
    const before = LM.G.notifs.length;
    LM.G.notifs = LM.G.notifs.filter((n) => {
      if (app == null) return false;
      if (n.app !== app) return true;
      if (thread == null) return false;
      return n.thread !== thread;
    });
    const removed = before - LM.G.notifs.length;
    if (removed) {
      LM.emit('notifs', LM.G.notifs);
      if (LM._autosave) LM._autosave();
    }
    return removed;
  };

  function initialEntries() {
    return (LM.NOTIFS || []).map((n, i) => ({
      id: 'init:' + i, app: n.app, title: n.title, body: n.body,
      t: n.t, at: null, hidden: !!n.hidden, initial: true,
    }));
  }

  LM.notifList = function () {
    /* 새 게임에서 data.js의 초기 알림을 G.notifs로 옮겨 두었으므로, 이후에는 G.notifs가 원본이다.
     * (지운 알림이 다시 살아나지 않게 여기서 다시 합치지 않는다.) */
    if (LM.G && Array.isArray(LM.G.notifs)) return LM.G.notifs.slice();
    return initialEntries();
  };
})();
