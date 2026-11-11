/* 읽음 단일 상태 + 계산 배지 + 원격 삭제 + 데이터 층 필터.
 * 설계: PROTOTYPE_FINDINGS 2절, STATE_MANAGEMENT, BUSINESS_RULES BR-26·BR-30·BR-32.
 * 저장하는 것은 G.read[appId][itemId] = { readAt, receipt } 뿐이다. 배지 숫자는 저장하지 않는다. */
(function () {
  'use strict';
  const LM = window.LM;

  const providers = Object.create(null);
  const RECEIPT_APPS = { talk: true, msg: true, blink: true, loop: true };

  function G() { return LM.G; }
  function readTree() {
    const g = G();
    if (!g) return {};
    if (!g.read || typeof g.read !== 'object' || Array.isArray(g.read)) g.read = {};
    return g.read;
  }
  function bucket(appId) {
    const tree = readTree();
    const id = String(appId);
    if (!tree[id] || typeof tree[id] !== 'object' || Array.isArray(tree[id])) tree[id] = {};
    return tree[id];
  }
  function marked(appId, itemId) {
    const b = readTree()[String(appId)];
    return !!(b && Object.prototype.hasOwnProperty.call(b, String(itemId)));
  }

  /* provider는 "지금 화면에 보이며 기본적으로 안 읽은 상태인 항목"만 돌려준다.
   * 항목: { id, threadId?, at? } */
  function register(appId, fn) {
    if (typeof fn === 'function') providers[String(appId)] = fn;
  }
  function hasProvider(appId) { return !!providers[String(appId)]; }
  function candidates(appId) {
    const fn = providers[String(appId)];
    if (!fn) return [];
    let list = [];
    try { list = fn() || []; } catch (e) { console.error('[read]', appId, e); }
    return list.map((it) => (typeof it === 'string' ? { id: it } : it))
      .filter((it) => it && it.id != null && it.unread !== false);
  }

  function isUnread(appId, itemId) {
    if (marked(appId, itemId)) return false;
    return candidates(appId).some((it) => String(it.id) === String(itemId));
  }

  function unreadCount(appId, threadId) {
    const b = readTree()[String(appId)] || {};
    let n = 0;
    candidates(appId).forEach((it) => {
      if (threadId != null && String(it.threadId == null ? '' : it.threadId) !== String(threadId)) return;
      if (!Object.prototype.hasOwnProperty.call(b, String(it.id))) n++;
    });
    return n;
  }

  function mark(appId, itemId, opts) {
    opts = opts || {};
    const key = String(itemId);
    const b = bucket(appId);
    if (Object.prototype.hasOwnProperty.call(b, key)) return b[key];
    const online = !!(LM.online && LM.online());
    const receipt = (opts.receipt === 'none' || !RECEIPT_APPS[String(appId)])
      ? 'none' : (online ? 'sent' : 'pending');
    b[key] = { readAt: G() ? G().gameMs : null, receipt: receipt };
    LM.emit('read', { appId: String(appId), itemId: key, receipt: receipt });
    if (LM._autosave) LM._autosave();
    return b[key];
  }

  /* 방/스레드 단위: provider가 가진 그 스레드의 안 읽은 후보를 한 번에 읽음 처리. */
  function unmark(appId, itemId) {
    const b = readTree()[String(appId)];
    if (!b || !Object.prototype.hasOwnProperty.call(b, String(itemId))) return false;
    delete b[String(itemId)];
    LM.emit('read', { appId: String(appId), itemId: String(itemId), unread: true });
    if (LM._autosave) LM._autosave();
    return true;
  }

  function markThread(appId, threadId) {
    let n = 0;
    candidates(appId).forEach((it) => {
      if (threadId != null && String(it.threadId == null ? '' : it.threadId) !== String(threadId)) return;
      if (!marked(appId, it.id)) { mark(appId, it.id); n++; }
    });
    return n;
  }

  function flushReceipts() {
    if (!LM.G) return 0;
    let changed = 0;
    const tree = readTree();
    Object.keys(tree).forEach((appId) => {
      const b = tree[appId];
      if (!b || typeof b !== 'object') return;
      Object.keys(b).forEach((itemId) => {
        const r = b[itemId];
        if (r && r.receipt === 'pending') {
          r.receipt = 'sent';
          r.sentAt = LM.G.gameMs;
          changed++;
          LM.emit('receiptSent', { appId: appId, itemId: itemId });
        }
      });
    });
    if (changed) {
      LM.emit('read', { flush: true, count: changed });
      if (LM._autosave) LM._autosave();
    }
    return changed;
  }

  LM.read = {
    mark,
    unmark,
    markThread,
    isUnread,
    unreadCount,
    badge: unreadCount,
    register,
    hasProvider,
    items: (appId) => candidates(appId).slice(),
    flush: flushReceipts,
  };
  LM.badge = (appId) => unreadCount(appId);

  LM.on('online', flushReceipts);

  /* ---------- 데이터 층 필터 ---------- */
  /* layer: 'T1'(항상) | 'T2'(온라인) | 'T3'(잠금 해제 뒤).
   * t2/onlineOnly: 온라인 전용. cachedBefore/afterCache: 오프라인 캐시 경계 이후 항목. */
  LM.visible = function (item) {
    if (!item) return false;
    if (item.hidden) return false;
    if (LM.isDeleted && item.appId != null && item.id != null && LM.isDeleted(item.appId, item.id)) return false;
    const online = !!(LM.online && LM.online());
    if (item.layer === 'T2' || item.t2 || item.onlineOnly || item.afterCache) {
      if (!online) return false;
    }
    if (item.layer === 'T3' && LM.G && !LM.G.unlocked) return false;
    if (item.cachedBefore != null && !online) {
      const limit = typeof item.cachedBefore === 'number' ? item.cachedBefore : new Date(item.cachedBefore).getTime();
      const at = item.at != null ? (typeof item.at === 'number' ? item.at : new Date(item.at).getTime()) : null;
      if (Number.isFinite(limit) && Number.isFinite(at) && at > limit) return false;
    }
    return true;
  };

  /* ---------- 원격 삭제(BR-32) ---------- */
  function deletedTree() {
    const g = G();
    if (!g) return {};
    if (!g.deleted || typeof g.deleted !== 'object' || Array.isArray(g.deleted)) g.deleted = {};
    return g.deleted;
  }
  LM.isDeleted = function (appId, itemId) {
    const b = deletedTree()[String(appId)];
    return !!(b && Object.prototype.hasOwnProperty.call(b, String(itemId)));
  };
  LM.remoteDeletedAt = function (appId, itemId) {
    const b = deletedTree()[String(appId)];
    return b && Object.prototype.hasOwnProperty.call(b, String(itemId)) ? b[String(itemId)] : null;
  };
  LM.remoteDelete = function (appId, itemId) {
    const app = String(appId), item = String(itemId);
    if (LM.isDeleted(app, item)) return false;
    deletedTree()[app] = deletedTree()[app] || {};
    deletedTree()[app][item] = G() ? G().gameMs : null;

    const sel = '[data-del="' + app + ':' + item + '"]';
    const els = Array.prototype.slice.call(document.querySelectorAll(sel));
    const appOpen = !!(LM.current && LM.current() && LM.current().id === app);
    const witnessed = els.length > 0 || appOpen;
    els.forEach((el) => {
      if (!LM.motion || LM.motion()) {
        el.style.transition = 'opacity .4s ease';
        el.style.opacity = '0';
        setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
      } else el.remove();
    });
    if (witnessed && LM.ui && LM.ui.toast) LM.ui.toast('1개 항목이 다른 기기에서 삭제됨');
    LM.emit('delete', { appId: app, itemId: item });
    LM.emit('read', { appId: app, itemId: item, deleted: true });
    if (LM._autosave) LM._autosave();
    return true;
  };
})();
