/* 흔적(TR-01~TR-19). 플레이어가 실제로 한 행동에서 한 번만 기록한다.
 * 오프라인이면 pending으로 남고, 다음 온라인 순간 한꺼번에 전달된다.
 * 전달되면 engine/events.js가 인물별 지연 뒤 반응을 만든다. 경고 UI는 없다.
 * 설계: TRACES_AND_REACTIONS 1~6절, PROGRESSION_AND_ENDINGS 3.1·4.1 */
(function () {
  'use strict';
  const LM = window.LM;

  function G() { return LM.G; }
  function online() { return !!(LM.online && LM.online()); }
  function tree() {
    const g = G();
    if (!g) return {};
    if (!g.traces || typeof g.traces !== 'object' || Array.isArray(g.traces)) g.traces = {};
    return g.traces;
  }

  function record(id, meta) {
    const g = G();
    if (!g) return null;
    const key = String(id);
    const t = tree();
    if (t[key]) return t[key];
    const rec = {
      id: key, at: g.gameMs, pending: !online(),
      deliveredAt: null, meta: meta == null ? null : meta,
    };
    t[key] = rec;
    LM.logEvent('trace', { id: key, pending: rec.pending });
    LM.emit('trace', rec);
    if (LM._autosave) LM._autosave();
    if (online()) deliver(key);
    return rec;
  }

  function deliver(id) {
    const g = G();
    const rec = tree()[String(id)];
    if (!g || !rec || rec.deliveredAt != null) return false;
    rec.pending = false;
    rec.deliveredAt = g.gameMs;
    LM.logEvent('trace:delivered', { id: String(id), at: g.gameMs });
    LM.emit('trace:delivered', rec);
    if (LM.ev && typeof LM.ev.onTrace === 'function') {
      try { LM.ev.onTrace(String(id), rec); } catch (e) { console.error('[traces]', id, e); }
    }
    if (LM._autosave) LM._autosave();
    return true;
  }

  function flush() {
    if (!online()) return 0;
    let n = 0;
    Object.keys(tree()).forEach((id) => { if (deliver(id)) n++; });
    return n;
  }

  LM.trace = record;
  LM.trace.flush = flush;
  LM.trace.deliver = deliver;
  LM.trace.all = () => Object.assign({}, tree());
  LM.trace.pending = () => Object.keys(tree()).filter((id) => !tree()[id].deliveredAt);
  LM.trace.has = (id) => !!tree()[String(id)];
  LM.trace.online = online;

  LM.on('online', flush);
  LM.on('gload', flush);
  try { flush(); } catch (e) { console.error(e); }
})();
