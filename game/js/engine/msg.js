/* 런타임 메시지 저장소. 정적 데이터와 합쳐 그리되, 추가분은 G.msgs에 영속한다.
 * LM.msg.add(appId, threadId, {id, from, text, at, attach, ...}) → 'msg' 이벤트 + 알림. */
(function () {
  'use strict';
  const LM = window.LM;

  function store() {
    const g = LM.G;
    if (!g) return {};
    if (!g.msgs || typeof g.msgs !== 'object' || Array.isArray(g.msgs)) g.msgs = {};
    return g.msgs;
  }
  function threadStore(appId, threadId, create) {
    const s = store();
    const a = s[String(appId)] || (create ? (s[String(appId)] = {}) : null);
    if (!a) return null;
    const t = a[String(threadId)] || (create ? (a[String(threadId)] = []) : null);
    return t;
  }
  function toMs(at) {
    if (at == null) return LM.G ? LM.G.gameMs : Date.now();
    if (typeof at === 'number') return at;
    if (at instanceof Date) return at.getTime();
    const n = new Date(at).getTime();
    return Number.isFinite(n) ? n : (LM.G ? LM.G.gameMs : Date.now());
  }

  LM.msg = {
    list(appId, threadId) {
      const t = threadStore(appId, threadId, false);
      return t ? t.slice().sort((a, b) => a.at - b.at) : [];
    },
    all(appId) {
      const a = store()[String(appId)];
      if (!a) return [];
      const out = [];
      Object.keys(a).forEach((threadId) => {
        (a[threadId] || []).forEach((m) => out.push(Object.assign({ threadId: threadId }, m)));
      });
      return out.sort((x, y) => x.at - y.at);
    },
    add(appId, threadId, m) {
      m = m || {};
      const app = String(appId), thread = String(threadId == null ? 'default' : threadId);
      const t = threadStore(app, thread, true);
      const at = toMs(m.at);
      const id = m.id != null ? String(m.id) : ('rt:' + app + ':' + thread + ':' + at + ':' + t.length);
      const item = Object.assign({}, m, { id: id, at: at });
      const existing = t.findIndex((x) => x.id === id);
      if (existing >= 0) t[existing] = item;
      else t.push(item);
      t.sort((a, b) => a.at - b.at);
      LM.emit('msg', { appId: app, threadId: thread, message: item });
      if (item.from !== 'out' && !item.silent) {
        const n = item.notif || {};
        LM.notify({
          id: item.notifId || ('msg:' + app + ':' + thread + ':' + id),
          app: app,
          title: n.title != null ? n.title : (item.title != null ? item.title : (LM.APPS && LM.APPS[app]) || app),
          body: n.body != null ? n.body : (item.text || ''),
          at: at,
          thread: thread,
          hidden: n.hidden != null ? n.hidden : !!item.hidden,
        });
      }
      if (LM._autosave) LM._autosave();
      return item;
    },
  };
})();
