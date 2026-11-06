/* DONTKNOW MVP 엔진 (P1).
   프로토타입(tutorial/app.js)을 이식하고 대화 DSL·장소/이동·이벤트 큐·세이브·디버그를 일반화했다.
   디버그: ?debug=1  배속: ?speed=N */
(() => {
'use strict';

const Q = new URLSearchParams(location.search);
const SPEED = Math.max(0.01, Number(Q.get('speed')) || 1);
const DEBUG = Q.has('debug');
const CHECKPOINT_KEY = 'dontknow.mvp.checkpoint';

// ───────── 상태 ─────────
const S = {
  phase: 'notice',           // notice | title | prologue | free
  navAnim: null,
  cine: null,
  clock: [2, 47],
  place: 'home',
  unlocked: false,
  stack: [],
  ov: null,
  banner: null,
  mono: null,
  autoBottom: false,
  destinations: ['home'],
  photos: [
    { id: 'family_2019', src: 'img/photo_family_2019.jpg' },
    { id: 'father_son_2022', src: 'img/photo_father_son_2022.jpg' },
    { id: 'graduation_gate', src: 'img/photo_graduation_gate.jpg' },
  ],
  notes: [],
  memoDraft: '',
  flash: false,
  tab: 'recent',
  digits: '',
  flags: {},
  know: {},
  v: {},
  session: null,
  sessionDone: {},
  dlg: null,
  call: null,
  phoneUp: false,
  travel: null,
  routePlace: null,
  hasCheckpoint: false,
  talkTab: 'friends',
  talkChoice: null,
  replyOffer: null,
  cctv: null,
};

// ───────── 타이머 (SPEED 반영, 그룹 단위 취소) ─────────
const timers = new Map();
let timerSeq = 0;
function later(ms, fn, group = null) {
  const id = ++timerSeq;
  const to = setTimeout(() => { timers.delete(id); fn(); }, Math.max(0, ms / SPEED));
  timers.set(id, { to, group });
  return id;
}
function clearGroup(group) {
  for (const [id, t] of timers) if (t.group === group) { clearTimeout(t.to); timers.delete(id); }
}

// ───────── 이벤트 큐 ─────────
const events = new Map();
function schedule(id, ms, fn, { cond = null, gameMin = 0 } = {}) {
  const key = id || ('ev.' + (++timerSeq));
  if (events.has(key)) { clearTimeout(events.get(key).to); events.delete(key); }
  const to = setTimeout(() => {
    const e = events.get(key);
    events.delete(key);
    if (e && e.cond && !evalCond(e.cond)) return;
    if (gameMin) advanceClock(gameMin);
    try { fn(); } catch (err) { console.error(err); }
  }, Math.max(0, ms / SPEED));
  events.set(key, { to, cond, fn });
  return key;
}
function cancelScheduled(id) {
  const e = events.get(id);
  if (e) { clearTimeout(e.to); events.delete(id); }
}
const nudgeGroups = new Map();
function nudge(sessionGoal, stages) {
  cancelNudge(sessionGoal);
  const ids = [];
  stages.forEach(([ms, fn], i) => {
    const id = `nudge.${sessionGoal}.${i}`;
    ids.push(schedule(id, ms, () => { if (S.session === sessionGoal) fn(); }, { cond: () => S.session === sessionGoal }));
  });
  nudgeGroups.set(sessionGoal, ids);
}
function cancelNudge(session) {
  const ids = nudgeGroups.get(session);
  if (ids) { ids.forEach(cancelScheduled); nudgeGroups.delete(session); }
}
function cancelAllNudges() { for (const k of [...nudgeGroups.keys()]) cancelNudge(k); }
function cancelAllTimers() {
  for (const t of timers.values()) clearTimeout(t.to);
  timers.clear();
  for (const e of events.values()) clearTimeout(e.to);
  events.clear();
  nudgeGroups.clear();
}

// ───────── 유틸 ─────────
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const clockStr = (c = S.clock) => `${pad(c[0])}:${pad(c[1])}`;
const nowTs = () => `20260318${pad(S.clock[0])}${pad(S.clock[1])}`;
const nowMsg = (from, text) => ({ from, text, d: '2026년 3월 18일 (수)', t: clockStr(), ts: nowTs() });
const shortDate = (ts) => `${Number(ts.slice(4, 6))}/${Number(ts.slice(6, 8))}`;
const fmtDur = (ms) => { const s = Math.floor(ms / 1000); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };
function advanceClock(min) {
  const total = S.clock[0] * 60 + S.clock[1] + min;
  S.clock = [Math.floor(total / 60) % 24, total % 60];
}
function clockAfter(min) {
  const total = S.clock[0] * 60 + S.clock[1] + min;
  return [Math.floor(total / 60) % 24, total % 60];
}
function grant(...ids) {
  for (const k of ids.flat()) {
    if (!k) continue;
    if (Array.isArray(k)) { k.forEach((x) => grant(x)); continue; }
    if (typeof k === 'object') { for (const x of Object.keys(k)) if (k[x]) S.know[x] = true; continue; }
    S.know[k] = true;
  }
}
const has = (k) => !!S.know[k];
function setFlag(...ids) { for (const k of ids.flat()) if (k) S.flags[k] = true; }
function clearFlag(...ids) { for (const k of ids.flat()) if (k) S.flags[k] = false; }
const flag = (k) => !!S.flags[k];
function evalCond(c) {
  if (c == null) return true;
  if (typeof c === 'function') return !!c();
  if (typeof c === 'boolean') return c;
  if (typeof c === 'string') {
    return c.split('&&').every((part) => part.split('||').some((raw) => {
      const t = raw.trim();
      if (!t) return true;
      if (t[0] === '!') { const k = t.slice(1).trim(); return !(S.know[k] || S.flags[k] || S.v[k]); }
      return !!(S.know[t] || S.flags[t] || S.v[t]);
    }));
  }
  return true;
}
const numSession = (id) => Number(String(id).replace(/\D/g, '')) || 0;

// ───────── 아이콘 ─────────
const ICON = {
  phone: '<svg viewBox="0 0 34 34"><path class="f" d="M11.2 7.3c.7-.1 1.3.3 1.6.9l1.8 3.9c.3.6.1 1.3-.3 1.8l-1.7 1.6a14 14 0 0 0 6 6l1.6-1.7c.5-.5 1.2-.6 1.8-.3l3.9 1.8c.6.3 1 .9.9 1.6l-.5 2.7c-.1.8-.8 1.4-1.6 1.4C15 27 7 19 7 9.4c0-.8.6-1.5 1.4-1.6z"/></svg>',
  msg: '<svg viewBox="0 0 34 34"><path class="f" d="M17 7.5c6 0 10.8 4 10.8 9s-4.8 9-10.8 9c-1.2 0-2.4-.2-3.5-.5L7.8 27l1.5-4.5c-1.9-1.6-3.1-3.8-3.1-6C6.2 11.5 11 7.5 17 7.5z"/></svg>',
  camera: '<svg viewBox="0 0 34 34"><path class="s" d="M6 12h4.5l1.8-3h9.4l1.8 3H28v13H6z"/><circle class="s" cx="17" cy="18" r="4.2"/></svg>',
  talk: '<svg viewBox="0 0 34 34"><path class="f" d="M17 7c6.1 0 11 3.9 11 8.8s-4.9 8.7-11 8.7c-1 0-2-.1-3-.3L8.6 27l1.2-4.6C7.5 20.8 6 18.4 6 15.8 6 10.9 10.9 7 17 7z"/></svg>',
  contacts: '<svg viewBox="0 0 34 34"><circle cx="17" cy="13.5" r="5" fill="#9A9EA6"/><path d="M8 27c1.3-4.6 4.7-7 9-7s7.7 2.4 9 7" fill="#9A9EA6"/></svg>',
  photos: '<svg viewBox="0 0 34 34"><g opacity=".92"><ellipse cx="17" cy="9.5" rx="3.2" ry="5.5" fill="#F6B73C"/><ellipse cx="17" cy="24.5" rx="3.2" ry="5.5" fill="#4A8CF0"/><ellipse cx="9.5" cy="17" rx="5.5" ry="3.2" fill="#3FC37A"/><ellipse cx="24.5" cy="17" rx="5.5" ry="3.2" fill="#E9546B"/></g></svg>',
  map: '<svg viewBox="0 0 34 34"><path class="f" d="M17 6l8 21-8-4.6L9 27z"/></svg>',
  bank: '<svg viewBox="0 0 34 34"><path class="s" d="M7 13.5 17 8l10 5.5M9.5 14.5v8M14.5 14.5v8M19.5 14.5v8M24.5 14.5v8M7 25.5h20"/></svg>',
  memo: '<svg viewBox="0 0 34 34"><rect x="5" y="5" width="24" height="7" rx="1" fill="#F5C342"/><path d="M8 17h18M8 21.5h18M8 26h12" stroke="#C9C9CE" stroke-width="1.4"/></svg>',
  settings: '<svg viewBox="0 0 34 34"><circle class="s" cx="17" cy="17" r="4"/><path class="s" d="M17 6.5v3.5M17 24v3.5M6.5 17H10M24 17h3.5M9.6 9.6l2.5 2.5M21.9 21.9l2.5 2.5M9.6 24.4l2.5-2.5M21.9 12.1l2.5-2.5"/></svg>',
};
const APPS = [
  { id: 'talk', label: '톡', bg: 'linear-gradient(#9A84F0,#6E55D8)' },
  { id: 'contacts', label: '연락처', bg: 'linear-gradient(#F4F4F6,#D9DADF)' },
  { id: 'photos', label: '사진', bg: '#fff' },
  { id: 'map', label: '길찾기', bg: 'linear-gradient(#4FD1C5,#1E9E95)' },
  { id: 'bank', label: '은행', bg: 'linear-gradient(#4E6C96,#2E4A72)' },
  { id: 'memo', label: '메모', bg: 'linear-gradient(#FFFFFF,#F1F1F3)' },
  { id: 'settings', label: '설정', bg: 'linear-gradient(#A8ADB5,#7F858E)' },
];
const APP_NAME = { talk: '톡', contacts: '연락처', photos: '사진', map: '길찾기', bank: '은행', memo: '메모', settings: '설정', camera: '카메라', phone: '전화', msg: '메시지' };

const CHARS = {
  father: '아버지', me: '아버지', dohyun: '도현', jihoon: '정지훈', teacher: '김 선생님',
  counselor: '윤 선생님', detective: '김 형사', minjae: '민재', pharmacist: '최 약사', yujin: '유진',
  junho: '준호', boss: '장 사장', hyung: '형', intercom: '인터폰',
};
const charName = (who) => CHARS[who] || who || '';

// ───────── 연락처·메시지 ─────────
const CT = [
  { id: 'dohyun', name: '도현', num: '010-XXXX-0921', kind: 'dohyun', th: 'dohyun' },
  { id: 'jihoon', name: '정지훈(도현친구)', num: '010-XXXX-1188', kind: 'jihoon', th: 'jihoon' },
  { id: 'teacher', name: '김선생님(도현 고3담임)', num: '010-XXXX-7730', kind: 'none', th: 'teacher' },
  { id: 'dispatch', name: '배차실', num: '031-XXX-2200', kind: 'none', th: 'dispatch' },
  { id: 'hangyeol', name: '한결캐피탈', num: '070-XXXX-3301', kind: 'block', th: 'hangyeol' },
  { id: 'detective', name: '성원경찰서 김태윤', num: '010-XXXX-1182', kind: 'normal', th: 'detective' },
  { id: 'junho_mom', name: '103호', num: '010-XXXX-6103', kind: 'none', th: 'junho_mom' },
];
const ctByNum = (n) => CT.find((c) => c.num === n);
function addContact(c) {
  if (!c || !c.id) return;
  const found = CT.find((x) => x.id === c.id);
  if (!found) CT.push({ kind: 'normal', ...c });
  else if (c.name) { found.name = c.name; if (c.num) found.num = c.num; if (c.th) found.th = c.th; }
  if (T[c.id] && c.name) T[c.id].name = c.name;
}

const T = {};
T.hangyeol = { name: '1600-XXXX', unread: 11, reply: 'none', msgs: DATA.hangyeol.map((m) => ({ from: 'them', d: m.d, t: m.t, text: m.x, ts: m.ts })) };
T.jihoon = { name: '정지훈(도현친구)', unread: 1, reply: 'none', msgs: [{ from: 'them', d: '2026년 3월 15일 (일)', t: '15:25', text: '아저씨 혹시 도현이 집에 들어왔어요?', ts: '202603151525' }] };
T.dispatch = { name: '배차실', unread: 2, reply: 'quick', quick: ['사정이 있어서 못 갑니다.', '지금 가겠습니다.'], msgs: DATA.dispatch.map((m) => ({ from: 'them', d: m.d, t: m.t, text: m.x, ts: m.ts })) };
T.univ = { name: '○○대학교', unread: 2, reply: 'none', msgs: DATA.univ.map((m) => ({ from: 'them', d: m.d, t: m.t, text: m.x, ts: m.ts })) };
T.dohyun = { name: '도현', unread: 0, reply: 'none', msgs: [{ from: 'them', d: '2026년 3월 14일 (토)', t: '18:52', text: '오늘 좀 늦어. 먼저 자', ts: '202603141852' }] };
T.teacher = { name: '김선생님(도현 고3담임)', unread: 0, reply: 'none', msgs: [] };
T.yujin = { name: '차유진', unread: 0, reply: 'none', msgs: [] };
T.detective = { name: '성원경찰서 김태윤', unread: 0, reply: 'none', msgs: [] };
T.junho = { name: '준호', unread: 0, reply: 'none', msgs: [] };
T.junho_mom = { name: '103호', unread: 0, reply: 'none', msgs: [] };
DATA.ads.forEach((a, i) => { T['ad' + i] = { name: a.num, unread: 1, reply: 'none', msgs: [{ from: 'them', d: a.d, t: a.t, text: a.x, ts: a.ts }] }; });
const totalUnread = () => Object.values(T).reduce((n, t) => n + t.unread, 0);
const lastOf = (th) => th.msgs[th.msgs.length - 1];

// ───────── 톡 (메신저) ─────────
const TALK = {
  profile: { name: '이상철', birthday: '1968년 4월 3일' },
  friends: [
    { id: 'dohyun', name: '도현', status: '' },
    { id: 'office', name: '성원아파트 관리사무소', status: '공지 채널' },
  ],
  chats: {},
};
const talkUnread = (id) => (TALK.chats[id] && TALK.chats[id].unread) || 0;
function addTalkContact(c) {
  if (!c || !c.id) return;
  if (!TALK.friends.find((x) => x.id === c.id)) TALK.friends.push({ id: c.id, name: c.name || c.id, status: c.status || '' });
}
function addTalkMsg(id, m, { banner = true } = {}) {
  const friend = TALK.friends.find((x) => x.id === id);
  let chat = TALK.chats[id];
  if (!chat) chat = TALK.chats[id] = { id, name: (friend && friend.name) || id, msgs: [], unread: 0, opened: false };
  const msg = { from: 'them', d: '2026년 3월 18일 (수)', t: clockStr(), ts: nowTs(), ...m };
  msg.fresh = true;
  chat.msgs.push(msg);
  if (msg.from === 'them') {
    const top = S.stack[S.stack.length - 1];
    const viewing = top && top.app === 'talk' && top.id === id;
    if (!viewing) chat.unread += 1;
    if (!viewing && banner) showBanner(chat.name, msg.text, id, 'talk');
    if (viewing) S.autoBottom = true;
  } else {
    S.autoBottom = true;
  }
  refresh();
}
const talkOpenHooks = {};
function onTalkOpen(id, fn) { talkOpenHooks[id] = fn; }
function openTalkThread(id) {
  const chat = TALK.chats[id];
  if (!chat) return;
  chat.unread = 0;
  chat.opened = true;
  nav(S.stack.length ? 'push' : 'open');
  if (!S.stack.length) S.stack.push({ app: 'talk', id: null });
  S.stack.push({ app: 'talk', id });
  S.autoBottom = true;
  S.unlocked = true;
  refresh();
  const hook = talkOpenHooks[id];
  if (hook) hook(id, chat);
  refresh();
}
function setTalkChoice(id, opts) {
  S.talkChoice = id && opts ? { id, opts } : null;
  refresh();
}
function pickTalkChoice(i) {
  const c = S.talkChoice;
  if (!c || !c.opts[i]) return;
  const opt = c.opts[i];
  S.talkChoice = null;
  addTalkMsg(c.id, { from: 'me', text: opt.label });
  if (typeof opt.then === 'function') opt.then();
  refresh();
}

function offerReply(threadId, opts) {
  if (!T[threadId]) return;
  S.replyOffer = { id: threadId, opts: opts || [] };
  T[threadId].reply = 'offer';
  refresh();
}
function pickOfferReply(i) {
  const o = S.replyOffer;
  if (!o || !o.opts[i]) return;
  const opt = o.opts[i];
  S.replyOffer = null;
  if (T[o.id]) T[o.id].reply = 'none';
  S.ov = null;
  addMsg(o.id, nowMsg('me', opt.label));
  if (typeof opt.then === 'function') opt.then();
  refresh();
}

// ───────── 대화 DSL ─────────
const DIALOGUES = {};
function SAY(who, m, c, extra = {}) {
  return { type: 'say', who, m: Array.isArray(m) ? m : (m == null ? [] : [m]), c: c || '', ...extra };
}
function ME(text, extra = {}) { return { type: 'me', text, ...extra }; }
function CHOICE(opts, extra = {}) { return { type: 'choice', opts, ...extra }; }
function DO(fn) { return { type: 'do', fn }; }
function WAIT(ms) { return { type: 'wait', ms }; }
function MONO(text) { return { type: 'mono', text }; }
function LABEL(name) { return { type: 'label', name }; }
function GOTO(name) { return { type: 'goto', name }; }
function END(extra = {}) { return { type: 'end', ...extra }; }
function defDialogue(id, nodes, opts = {}) {
  const labels = {};
  nodes.forEach((n, i) => { if (n.type === 'label') labels[n.name] = i; });
  DIALOGUES[id] = { id, nodes, labels, onEnd: opts.onEnd || null, opts };
}

const threadForWho = (who) => (who === 'father' || who === 'me' ? 'jihoon' : who);
function labelText(o, ch) {
  const L = o.label;
  if (L == null) return '';
  if (typeof L === 'string') return L;
  if (ch === 'call') return L.c || '';
  if (ch === 'sms') return L.m || '';
  return L.c || L.m || '';
}
function visibleOpts(node) {
  const d = S.dlg;
  const ch = d ? d.channel : 'sms';
  return ((node && node.opts) || []).filter((o) => {
    if (!evalCond(o.cond)) return false;
    if (o.switch) return ch === 'sms';
    if (o.call) return ch === 'call';
    return !!labelText(o, ch);
  });
}

function runDialogue(id, opts = {}) {
  const def = DIALOGUES[id];
  if (!def) { console.warn('[DONTKNOW] no dialogue', id); return null; }
  const channel = opts.channel || 'sms';
  const d = {
    id, channel, who: opts.who || 'npc', scene: opts.scene || null,
    nodes: def.nodes, labels: def.labels, pc: 0, queue: [],
    waiting: null, busy: false, typing: false, active: false,
    line: null, awaitTap: false, tapTimer: null,
    onEnd: opts.onEnd || def.onEnd, opening: opts.opening || '',
    callFatherSaid: false, history: [],
  };
  S.dlg = d;
  S.phoneUp = false;
  if (channel === 'sms') { S.autoBottom = true; T[threadForWho(d.who)] && (T[threadForWho(d.who)].reply = 's2'); }
  if (channel === 'face' || channel === 'intercom') S.autoBottom = false;
  if (channel === 'call') {
    openCall(d.who, charName(d.who), () => {
      if (S.dlg !== d) return;
      d.active = true;
      if (d.opening && !d.callFatherSaid) {
        d.callFatherSaid = true;
        S.call.lines.push({ who: 'me', text: d.opening });
      }
      runQueue();
    });
  } else {
    d.active = true;
    runQueue();
  }
  refresh();
  return d;
}

function nextNode() {
  const d = S.dlg;
  if (!d) return null;
  if (d.queue.length) return d.queue.shift();
  if (d.pc >= d.nodes.length) return null;
  return d.nodes[d.pc++];
}
function runQueue() {
  const d = S.dlg;
  if (!d || !d.active) return;
  for (;;) {
    if (!S.dlg || S.dlg !== d || !d.active || d.waiting || d.busy || d.awaitTap || S.phoneUp) return;
    const it = nextNode();
    if (!it) { finishDialogue('natural'); return; }
    if (handleNode(it)) return;
  }
}
function handleNode(it) {
  const d = S.dlg;
  switch (it.type) {
    case 'label': return false;
    case 'goto': d.pc = d.labels[it.name] != null ? d.labels[it.name] : d.pc; return false;
    case 'do': if (typeof it.fn === 'function') it.fn(); return false;
    case 'mono': showMono(it.text); return false;
    case 'wait':
      d.busy = true;
      later(it.ms || 500, () => { if (S.dlg !== d) return; d.busy = false; runQueue(); }, 'q');
      return true;
    case 'end': finishDialogue(it.reason || 'end'); return true;
    case 'say': return processSay(it);
    case 'me': return processMe(it);
    case 'choice':
      if (it.opener && d.channel === 'call') return false;
      return processChoice(it);
    default: return false;
  }
}
function applySet(it) {
  if (!it.set) return;
  if (Array.isArray(it.set)) setFlag(...it.set);
  else if (typeof it.set === 'string') setFlag(it.set);
  else if (typeof it.set === 'object') Object.keys(it.set).forEach((k) => { if (it.set[k]) setFlag(k); });
}
function grantDelivery(it, last, ch) {
  if (!last) return;
  grant(it.kn, it.kx);
  if (ch !== 'sms') grant(it.knCall, it.kxCall);
  applySet(it);
}
function processSay(it) {
  const d = S.dlg;
  const ch = d.channel;
  if (ch === 'sms') {
    const m = it.m || [];
    if (!m.length) { grantDelivery(it, true, ch); return false; }
    const text = String(m[0]);
    const rest = m.slice(1);
    if (rest.length) {
      d.queue.unshift({ ...it, m: rest });
      it = { ...it, kn: null, kx: null, knCall: null, kxCall: null, set: null };
    }
    d.busy = true; d.typing = true;
    d.history.push({ type: 'say', text });
    refresh();
    const wait = 500 + Math.min(900, text.length * 22);
    later(wait, () => {
      if (S.dlg !== d) return;
      d.busy = false; d.typing = false;
      addMsg(threadForWho(it.who || d.who), nowMsg('them', text));
      grantDelivery(it, rest.length === 0, ch);
      runQueue();
      refresh();
    }, 'q');
    return true;
  }
  const text = it.c || (Array.isArray(it.m) ? it.m.join(' ') : (it.m || ''));
  if (!text) { grantDelivery(it, true, ch); return false; }
  d.busy = true;
  const wait = ch === 'call' ? 700 + text.length * 30 : 0;
  const deliver = () => {
    if (S.dlg !== d) return;
    d.busy = false;
    grantDelivery(it, true, ch);
    if (ch === 'call') {
      if (S.call) S.call.lines.push({ who: it.who || d.who, text });
      runQueue();
      refresh();
    } else {
      showFaceLine(it.who || d.who, text);
    }
  };
  if (wait) later(wait, deliver, 'q'); else deliver();
  return true;
}
function processMe(it) {
  const d = S.dlg;
  const ch = d.channel;
  const text = it.text || '';
  if (!text) return false;
  if (ch === 'sms') {
    addMsg(threadForWho(d.who), nowMsg('me', text));
    return false;
  }
  if (ch === 'call') {
    if (S.call) S.call.lines.push({ who: 'me', text });
    refresh();
    return false;
  }
  showFaceLine('father', text);
  return true;
}
function processChoice(it) {
  const d = S.dlg;
  const opts = visibleOpts(it);
  if (!opts.length) return false;
  d.waiting = it;
  d.busy = false;
  refresh();
  return true;
}
function choose(i) {
  const d = S.dlg;
  if (!d || !d.waiting) return;
  const opts = visibleOpts(d.waiting);
  const opt = opts[i];
  if (!opt) return;
  if (opt.switch) {
    S.ov = null;
    processMe({ type: 'me', text: '잠깐 전화할게' });
    switchToCall();
    return;
  }
  d.waiting = null;
  if (S.ov && S.ov.type === 'choices') S.ov = null;
  if (typeof opt.do === 'function') opt.do();
  applySet(opt);
  processMe({ type: 'me', text: labelText(opt, d.channel) });
  if (opt.then && opt.then.length) d.queue.unshift(...opt.then);
  runQueue();
  refresh();
}
function showFaceLine(who, text) {
  const d = S.dlg;
  if (!d) return;
  d.line = { who, text };
  d.awaitTap = true;
  d.busy = false;
  d.history.push({ type: 'line', who, text });
  scheduleFaceAuto();
  refresh();
}
function scheduleFaceAuto() {
  const d = S.dlg;
  if (!d) return;
  clearTimeout(d.tapTimer);
  d.tapTimer = setTimeout(() => {
    if (S.dlg !== d || !d.awaitTap || S.phoneUp) return;
    d.awaitTap = false;
    runQueue();
    refresh();
  }, Math.max(1200, 5000 / SPEED));
}
function faceNext() {
  const d = S.dlg;
  if (!d || !d.awaitTap || S.phoneUp) return;
  clearTimeout(d.tapTimer);
  d.awaitTap = false;
  runQueue();
  refresh();
}
function finishDialogue(reason) {
  const d = S.dlg;
  if (!d) return;
  clearTimeout(d.tapTimer);
  d.active = false;
  const onEnd = d.onEnd;
  S.dlg = null;
  if (onEnd) onEnd(reason);
  refresh();
}

// ───────── 통화 ─────────
function openCall(kind, name, onConnect) {
  S.call = { kind, name: name || charName(kind), state: 'ring', since: Date.now(), lines: [], deadText: '' };
  S.ov = { type: 'call' };
  later(1400, () => {
    if (!S.call) return;
    S.call.state = 'talk';
    S.call.since = Date.now();
    if (onConnect) onConnect();
    refresh();
  }, 'call');
  refresh();
}
function openDead(name, text, ms = 2000) {
  S.call = { kind: 'dead', name, state: 'ring', since: Date.now(), lines: [], deadText: text };
  S.ov = { type: 'call' };
  later(ms, () => { if (S.call && S.call.kind === 'dead') { S.call.state = 'dead'; refresh(); } }, 'call');
  refresh();
}
function endCall() {
  const c = S.call;
  S.call = null;
  S.ov = null;
  if (c && c.kind !== 'dead' && S.dlg && S.dlg.channel === 'call') {
    const d = S.dlg;
    d.channel = 'sms';
    d.active = true;
    S.autoBottom = true;
    T[threadForWho(d.who)] && (T[threadForWho(d.who)].reply = 's2');
    addMsg(threadForWho(d.who), { from: 'sys', text: `통화 종료 · ${fmtDur(Date.now() - c.since)}` }, { banner: false });
    if (d.waiting && visibleOpts(d.waiting).length === 0) d.waiting = null;
    runQueue();
  }
  refresh();
}
function switchToCall() {
  const d = S.dlg;
  if (!d || d.channel === 'call') return;
  d.channel = 'call';
  d.active = false;
  setFlag('FX-01');
  if (d.waiting && visibleOpts(d.waiting).length === 0) d.waiting = null;
  openCall(d.who, charName(d.who), () => {
    if (S.dlg !== d) return;
    d.active = true;
    if (d.opening && !d.callFatherSaid) {
      d.callFatherSaid = true;
      S.call.lines.push({ who: 'me', text: d.opening });
    }
    runQueue();
  });
  refresh();
}

// ───────── 훅 ─────────
const threadOpenHooks = {};
function onThreadOpen(id, fn) { if (!id || typeof fn !== 'function') return; (threadOpenHooks[id] = threadOpenHooks[id] || []).push(fn); }
function addThreadOpen(id, fn) { onThreadOpen(id, fn); }
const acceptHooks = [];
function onAccept(fn) { acceptHooks.push(fn); }
const dialHooks = {};
function onDialContact(id, fn) { dialHooks[id] = fn; }
let startGameFn = null;
function setStartGame(fn) { startGameFn = fn; }
const SESSIONS = {};
function defSession(id, start) { SESSIONS[id] = { start }; }

// ───────── 장소·이동 ─────────
const PLACES = {};
const ARRIVE = {};
function defPlace(p) { if (p && p.id) PLACES[p.id] = p; }
function registerDest(id) {
  if (!id || !PLACES[id]) return;
  if (!S.destinations.includes(id)) S.destinations.push(id);
}
function onArrive(id, fn) { if (!id || typeof fn !== 'function') return; (ARRIVE[id] = ARRIVE[id] || []).push(fn); }
function addArrive(id, fn) { onArrive(id, fn); }
function travelMin(from, to) {
  const p = PLACES[to];
  return (p && p.travelMin && p.travelMin[from]) || 20;
}
defPlace({ id: 'home', name: '집', scene: 'hall_night', travelMin: { school: 20 } });
defPlace({ id: 'school', name: '성원고', scene: 'scene_school_gate', travelMin: { home: 20 } });

function startRoute(placeId) {
  if (!PLACES[placeId]) return;
  S.routePlace = placeId;
  nav('push');
  S.stack.push({ app: 'map', id: 'route' });
  refresh();
}
function startTravel(dest) {
  if (!PLACES[dest] || S.travel) return;
  const minutes = travelMin(S.place, dest);
  S.travel = { from: S.place, dest, minutes, arriveClock: clockAfter(minutes), started: false };
  S.stack = [];
  S.ov = null;
  S.phoneUp = false;
  S.routePlace = null;
  S.unlocked = true;
  S.navAnim = null;
  refresh();
}
function beginTravelAnimation() {
  const t = S.travel;
  if (!t || t.started) return;
  t.started = true;
  const path = document.getElementById('travel-route');
  const dot = document.getElementById('travel-dot');
  const dur = Math.max(120, 2500 / SPEED);
  if (!path) { later(200, () => arriveAt(t.dest), 'travel'); return; }
  let len = 0;
  try { len = path.getTotalLength(); } catch (e) { len = 0; }
  if (len) {
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
  }
  const t0 = performance.now();
  const frame = (now) => {
    if (S.travel !== t) return;
    const k = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    if (len) {
      path.style.strokeDashoffset = String(len * (1 - e));
      if (dot) { const pt = path.getPointAtLength(len * e); dot.setAttribute('cx', String(pt.x)); dot.setAttribute('cy', String(pt.y)); }
    }
    if (k < 1) requestAnimationFrame(frame);
    else later(180, () => arriveAt(t.dest), 'travel');
  };
  requestAnimationFrame(frame);
}
function arriveAt(dest) {
  const t = S.travel;
  if (!t || t.dest !== dest) return;
  S.clock = t.arriveClock;
  S.place = dest;
  S.travel = null;
  S.unlocked = true;
  S.stack = [];
  S.ov = null;
  S.phoneUp = false;
  S.navAnim = null;
  refresh();
  later(180, () => {
    const fns = ARRIVE[dest] || [];
    if (fns.length) fns.forEach((fn) => { try { fn(dest); } catch (err) { console.error(err); } });
    else { S.phase = 'free'; refresh(); }
  }, 'travel');
}

// ───────── 메시지 추가 ─────────
function addMsg(id, m, { banner = true } = {}) {
  let th = T[id];
  if (!th) {
    const c = CT.find((x) => x.id === id);
    th = T[id] = { name: (c && c.name) || id, unread: 0, reply: 'none', msgs: [] };
  }
  const msg = { from: 'them', d: '2026년 3월 18일 (수)', t: clockStr(), ts: nowTs(), ...m };
  msg.fresh = true;
  th.msgs.push(msg);
  if (msg.from === 'them') {
    const top = S.stack[S.stack.length - 1];
    const viewing = top && top.app === 'msg' && top.id === id;
    if (!viewing) th.unread += 1;
    if (!viewing && banner) showBanner(th.name, msg.text, id, 'msg');
    if (viewing) S.autoBottom = true;
  } else {
    S.autoBottom = true;
  }
  refresh();
}
function showBanner(title, body, id, kind = 'msg') {
  S.banner = { title, body, id, kind };
  clearGroup('banner');
  later(4200, () => hideBanner(body), 'banner');
  refresh();
}
function hideBanner(body) {
  if (!S.banner || (body && S.banner.body !== body)) return;
  S.banner.out = true;
  refresh();
  later(280, () => { S.banner = null; refresh(); }, 'banner');
}
function showMono(text) {
  S.mono = text;
  S.monoN = (S.monoN || 0) + 1;
  clearGroup('mono');
  later(2300, () => { S.mono = null; refresh(); }, 'mono');
  refresh();
}

// ───────── CCTV 스크러버 ─────────
function hms(t) {
  let v = 19 * 3600 + 5 * 60 + Math.round(t);
  const h = Math.floor(v / 3600); v -= h * 3600;
  const m = Math.floor(v / 60); v -= m * 60;
  return `${pad(h)}:${pad(m)}:${pad(v)}`;
}
function openCctv(opts = {}) {
  S.cctv = {
    t: opts.start || 0,
    end: opts.end || 150,
    win: opts.window || [65, 80],
    need: (opts.need || 12) * 1000,
    seen: 0,
    playing: false,
    frames: opts.frames || [],
    onDone: opts.onDone || null,
  };
  S.phoneUp = false;
  if (S.dlg) S.dlg.busy = true;
  refresh();
}
function closeCctv() {
  const c = S.cctv;
  if (!c) return;
  S.cctv = null;
  clearGroup('cctv');
  if (S.dlg) { S.dlg.busy = false; runQueue(); }
  refresh();
}
function cctvSeenBetween(a, b) {
  const c = S.cctv;
  if (!c) return;
  const lo = Math.max(Math.min(a, b), c.win[0]);
  const hi = Math.min(Math.max(a, b), c.win[1]);
  if (hi > lo) c.seen += (hi - lo) * 1000;
}
function setCctvTime(t) {
  const c = S.cctv;
  if (!c) return;
  cctvSeenBetween(c.t, t);
  c.t = Math.max(0, Math.min(c.end, t));
  refresh();
}
function cctvTick() {
  const c = S.cctv;
  if (!c || !c.playing) return;
  if (c.t >= c.end) { c.playing = false; refresh(); return; }
  setCctvTime(c.t + 0.1);
  later(100, cctvTick, 'cctv');
}
function toggleCctvPlay() {
  const c = S.cctv;
  if (!c) return;
  c.playing = !c.playing;
  if (c.playing) { clearGroup('cctv'); later(100, cctvTick, 'cctv'); }
  else clearGroup('cctv');
  refresh();
}
function cctvStep(dir) {
  const c = S.cctv;
  if (!c) return;
  c.playing = false;
  clearGroup('cctv');
  setCctvTime(c.t + dir * 5);
}
function cctvDone() {
  const c = S.cctv;
  if (!c || c.seen + 1 < c.need) return;
  const done = c.onDone;
  S.cctv = null;
  clearGroup('cctv');
  S.flags['CCTV.seen'] = true;
  if (done) done();
  if (S.dlg) { S.dlg.busy = false; runQueue(); }
  refresh();
}

// ───────── 스레드 열기 ─────────
function showThread(id) {
  const top = S.stack[S.stack.length - 1];
  if (top && top.app === 'msg' && top.id === id) return;
  nav(S.stack.length ? 'push' : 'open');
  if (!S.stack.length) S.stack.push({ app: 'msg', id: null });
  S.stack.push({ app: 'msg', id });
  S.autoBottom = true;
  S.unlocked = true;
  refresh();
}
function openThread(id) {
  const th = T[id];
  if (!th) return;
  const prevUnread = th.unread;
  if (!th.opened) th.opened = true;
  th.unread = 0;
  nav(S.stack.length ? 'push' : 'open');
  if (!S.stack.length) S.stack.push({ app: 'msg', id: null });
  S.stack.push({ app: 'msg', id });
  S.autoBottom = true;
  S.unlocked = true;
  refresh();
  const hooks = threadOpenHooks[id] || [];
  hooks.forEach((fn) => { try { fn(id, th, prevUnread); } catch (e) { console.error(e); } });
  refresh();
}

// ───────── 시네마틱 ─────────
const IMG = { hall_night: 'img/hall_night.jpg' };
const CINE = {};
function defCine(id, data) { CINE[id] = data; }
function imgPath(k) {
  if (!k) return '';
  if (k.startsWith('img/') || k.startsWith('data:') || k.startsWith('http')) return k;
  if (window.__ASSETS && window.__ASSETS[k]) return window.__ASSETS[k];
  if (IMG[k]) return IMG[k];
  return `img/${k}.jpg`;
}
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function playCine(id, done) {
  const c = CINE[id];
  if (!c) { if (done) done(); return; }
  S.cine = { id, i: -1, done };
  S.flags[id] = true;
  const el = $('#cine');
  el.className = 'cine show';
  el.innerHTML = `${c.skip === false ? '' : '<button class="skip" data-act="skipCine">건너뛰기</button>'}<div class="tap">탭하면 다음 장면</div>`;
  el.dataset.act = 'cineTap';
  nextCut();
}
const readMs = (t) => 1200 + t.length * 60;
function capTimes(cut) {
  const at = [];
  (cut.cap || []).forEach((t, i) => at.push(i ? at[i - 1] + Math.max(1400, readMs(cut.cap[i - 1]) - 300) : 800));
  const end = at.length ? at[at.length - 1] + readMs(cut.cap[cut.cap.length - 1]) : 0;
  return { at, dur: Math.max(cut.dur || 0, end + 1000) };
}
function cineTap() {
  const rest = [...document.querySelectorAll('#cine .cut:last-child .caps p:not(.on)')];
  if (!rest.length) return nextCut();
  clearGroup('cine');
  rest.forEach((p) => p.classList.add('on'));
  later(2600, nextCut, 'cine');
}
function nextCut() {
  if (!S.cine) return;
  clearGroup('cine');
  const c = CINE[S.cine.id];
  S.cine.i += 1;
  if (S.cine.i >= c.cuts.length) return endCine();
  const cut = c.cuts[S.cine.i];
  const tm = capTimes(cut);
  const el = $('#cine');
  const div = document.createElement('div');
  div.className = 'cut';
  if (cut.img) {
    const kb = document.createElement('div');
    kb.className = `kb ${cut.filter || ''}`;
    kb.style.backgroundImage = `url(${imgPath(cut.img)})`;
    kb.style.transformOrigin = cut.origin || '50% 50%';
    kb.style.transform = REDUCED ? cut.to : cut.from;
    div.appendChild(kb);
    if (!REDUCED) requestAnimationFrame(() => requestAnimationFrame(() => {
      kb.style.transition = `transform ${tm.dur + 1400}ms cubic-bezier(.3,.1,.4,1)`;
      kb.style.transform = cut.to;
    }));
  }
  if (cut.text) div.insertAdjacentHTML('beforeend', `<div class="txt">${esc(cut.text)}</div>`);
  if (cut.stamp) div.insertAdjacentHTML('beforeend', `<div class="stamp">${esc(cut.stamp)}</div>`);
  if (cut.cap) {
    div.insertAdjacentHTML('beforeend', `<div class="caps">${cut.cap.map((t) => `<p>${esc(t)}</p>`).join('')}</div>`);
    const ps = div.querySelectorAll('.caps p');
    tm.at.forEach((t, i) => later(t, () => ps[i].classList.add('on'), 'cine'));
  }
  if (cut.roll) {
    div.insertAdjacentHTML('beforeend', `<div class="roll">${cut.roll[0]}</div>`);
    const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const a = toMin(cut.roll[0]); const b = toMin(cut.roll[1]);
    const t0 = performance.now(); const span = Math.min(1900, (cut.dur || 2800) - 600) / SPEED;
    const rollEl = div.querySelector('.roll');
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / span);
      const e = 1 - Math.pow(1 - k, 3);
      const v = Math.round(a + (b - a) * e);
      rollEl.textContent = `${pad(Math.floor(v / 60))}:${pad(v % 60)}`;
      if (k < 1 && rollEl.isConnected) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  el.appendChild(div);
  requestAnimationFrame(() => requestAnimationFrame(() => div.classList.add('on')));
  const olds = [...el.querySelectorAll('.cut')].slice(0, -1);
  setTimeout(() => olds.forEach((o) => o.remove()), 1400);
  later(tm.dur, nextCut, 'cine');
}
function endCine() {
  if (!S.cine) return;
  clearGroup('cine');
  const done = S.cine.done;
  S.cine = null;
  const el = $('#cine');
  delete el.dataset.act;
  if (done) done();
  el.classList.add('out');
  setTimeout(() => { el.className = 'cine'; el.innerHTML = ''; }, 820);
}

// ───────── 세션·세이브 ─────────
function saveCheckpoint() {
  try {
    const snap = {
      session: S.session, clock: [...S.clock], place: S.place,
      know: { ...S.know }, flags: { ...S.flags }, v: { ...S.v },
      destinations: [...S.destinations], savedAt: Date.now(),
    };
    localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(snap));
    S.hasCheckpoint = true;
  } catch (e) { /* 사파리 개인정보 보호·용량 초과 등은 무시 */ }
}
function readCheckpoint() {
  try {
    const raw = localStorage.getItem(CHECKPOINT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function startSession(id) {
  cancelAllNudges();
  S.session = id;
  S.sessionDone[id] = false;
  saveCheckpoint();
}
function endSession(id) {
  if (S.session === id) S.session = null;
  S.sessionDone[id] = true;
  cancelNudge(id);
}
const SESSION_CLOCK = {
  S01: [2, 47], S02: [2, 50], S03: [8, 40], S04: [10, 30], S05: [11, 30], S06: [13, 0],
  S07: [14, 0], S08: [16, 10], S09: [17, 0], S10: [19, 10], S11: [19, 40], S12: [20, 30], S13: [23, 0], S14: [8, 50],
};
const SESSION_PLACE = {
  S01: 'home', S02: 'home', S03: 'home', S04: 'home', S05: 'police', S06: 'mart', S07: 'home', S08: 'home',
  S09: 'pharmacy', S10: 'home', S11: 'home', S12: 'home', S13: 'parking', S14: 'home',
};
const KNOW_BY_SESSION = {
  S02: ['K-01', 'K-02', 'K-03', 'K-04', 'K-05', 'KX-02', 'KX-04'],
  S03: ['K-06', 'K-07', 'KX-01', 'KX-10'],
  S04: ['K-08', 'F-01'],
  S05: ['K-09', 'K-10', 'K-11', 'KX-05', 'KX-06', 'KX-11'],
  S06: ['K-12', 'KX-09'],
  S07: ['K-13', 'K-14', 'KX-03', 'KX-07'],
  S08: ['K-15', 'KX-08'],
  S09: ['K-16', 'K-17', 'KX-12', 'KX-17a'],
  S10: ['K-18', 'K-19', 'K-20', 'K-21', 'K-22', 'KX-13', 'KX-14', 'KX-15', 'KX-16', 'KX-18', 'KX-19', 'KX-20', 'KX-21', 'KX-22'],
};
function jump(id) {
  const target = numSession(id);
  cancelAllTimers();
  const cine = $('#cine');
  if (cine) { cine.className = 'cine'; cine.innerHTML = ''; delete cine.dataset.act; }
  S.know = {}; S.flags = {}; S.v = {}; S.sessionDone = {};
  S.clock = [2, 47]; S.place = 'home'; S.destinations = ['home'];
  S.unlocked = true; S.stack = []; S.ov = null; S.banner = null; S.mono = null;
  S.dlg = null; S.call = null; S.phoneUp = false; S.travel = null; S.routePlace = null;
  S.cine = null; S.phase = 'free'; S.autoBottom = false;
  S.cctv = null; S.talkChoice = null; S.replyOffer = null; clearGroup('cctv');
  document.body.classList.remove('dk-s13-lock', 's13-choice1', 'dk-s8-silence', 'dk-s10-open');
  document.querySelectorAll('.s13-fade').forEach((el) => el.remove());
  ['s10-layer', 's11-layer', 's12-layer'].forEach((lid) => {
    const el = document.getElementById(lid);
    if (el) { el.classList.remove('show'); el.style.display = 'none'; }
  });
  const endEl = document.getElementById('dk-ending');
  if (endEl) { endEl.className = 'dk-ending'; endEl.innerHTML = ''; }
  if (window.closeS11UI) { try { window.closeS11UI(); } catch (e) {} }
  if (window.OldPhone) { try { window.OldPhone.reset(); } catch (e) {} }
  Object.keys(KNOW_BY_SESSION).forEach((sid) => {
    if (numSession(sid) < target) {
      KNOW_BY_SESSION[sid].forEach((k) => { if (/^K/.test(k)) S.know[k] = true; });
      S.sessionDone[sid] = true;
    }
  });
  if (target >= 3) S.destinations.push('school');
  if (target >= 5) S.destinations.push('police');
  if (target >= 6) S.destinations.push('mart');
  if (target >= 4) addContact({ id: 'yujin', name: '차유진', num: '010-XXXX-4417', kind: 'normal', th: 'yujin' });
  if (target >= 7) {
    grant('KX-03');
    addContact({ id: 'junho', name: '준호', num: '010-XXXX-0315', kind: 'normal', th: 'junho' });
  }
  const st = SESSIONS[id];
  if (st && st.start) {
    st.start();
  } else {
    S.clock = SESSION_CLOCK[id] || [8, 40];
    S.place = SESSION_PLACE[id] || 'home';
    startSession(id);
    S.phase = 'free';
    S.unlocked = true;
  }
  const stEl = $('#status');
  if (stEl && !['notice', 'title', 'prologue'].includes(S.phase) && !S.cine) stEl.style.display = '';
  refresh();
}
function resumeCheckpoint() {
  const snap = readCheckpoint();
  if (!snap) return;
  jump(snap.session || 'S01');
  if (snap.know) S.know = { ...S.know, ...snap.know };
  if (snap.flags) S.flags = { ...S.flags, ...snap.flags };
  if (snap.v) S.v = { ...S.v, ...snap.v };
  if (Array.isArray(snap.destinations)) S.destinations = [...new Set([...S.destinations, ...snap.destinations])];
  if (Array.isArray(snap.clock) && snap.clock.length === 2) S.clock = snap.clock;
  if (snap.place) S.place = snap.place;
  refresh();
}

// ───────── 화면 전환 ─────────
const GHOST = { home: 'ghost-close', homeSlow: 'ghost-close-slow', pop: 'ghost-pop', unlock: 'ghost-up' };
function nav(type) {
  S.navAnim = type;
  const g = GHOST[type];
  const cur = $('#root').firstElementChild;
  if (!g || !cur) return;
  const ghost = document.createElement('div');
  ghost.className = `ghost ${g}`;
  ghost.appendChild(cur.cloneNode(true));
  $('#screen').insertBefore(ghost, $('#overlay'));
  const kill = () => ghost.remove();
  ghost.addEventListener('animationend', kill);
  setTimeout(kill, 900);
}
function closeOv() {
  if (!S.ov || S.ov.type === 'call') return;
  const el = $('#overlay');
  el.classList.add('closing');
  setTimeout(() => { el.classList.remove('closing'); S.ov = null; refresh(); }, 230);
}

// ───────── 렌더: 상태바 ─────────
function renderStatus() {
  const el = $('#status');
  const hide = ['notice', 'title', 'prologue'].includes(S.phase) || !!S.cine;
  el.style.display = hide ? 'none' : '';
  if (hide) return;
  el.innerHTML = `<span>${clockStr()}</span><span class="r"><span class="sig"><i></i><i></i><i></i><i></i></span><svg class="wifi" viewBox="0 0 16 12"><path d="M8 2.2c2.4 0 4.6.9 6.2 2.5l1.3-1.3A10.6 10.6 0 0 0 8 .4C5.1.4 2.4 1.5.5 3.4l1.3 1.3A8.8 8.8 0 0 1 8 2.2zm0 3.6c1.4 0 2.7.5 3.6 1.4l1.3-1.3A6.9 6.9 0 0 0 8 4c-1.9 0-3.6.7-4.9 1.9l1.3 1.3c1-.9 2.2-1.4 3.6-1.4zM8 9.4 9.7 11a2.4 2.4 0 0 0-3.4 0z"/></svg><span class="bat"><span class="lvl" style="width:10px"></span>41</span></span>`;
}

// ───────── 렌더: 루트 ─────────
function lockHTML() {
  const latest = Object.entries(T).filter(([, t]) => t.unread > 0).sort((a, b) => lastOf(b[1]).ts.localeCompare(lastOf(a[1]).ts))[0];
  const [lid, lth] = latest || ['dispatch', T.dispatch];
  const lm = lastOf(lth);
  const more = Math.max(0, totalUnread() - 1);
  return `
  <div class="when"><div class="date">3월 18일 수요일</div><div class="clock">${clockStr()}</div></div>
  <div class="stack">
    <div class="ncard"><div class="appic" style="background:linear-gradient(#5EE07A,#2DBE4E)"><svg viewBox="0 0 24 24"><path d="M6.6 2.8c.6-.1 1.1.2 1.4.7l1.5 3.2c.2.5.1 1.1-.3 1.5L7.8 9.6a12 12 0 0 0 6.6 6.6l1.4-1.4c.4-.4 1-.5 1.5-.3l3.2 1.5c.5.3.8.8.7 1.4l-.4 2.4c-.1.7-.7 1.2-1.4 1.2C10.4 21 3 13.6 3 4.6c0-.7.5-1.3 1.2-1.4z"/></svg></div><div><div class="t">부재중 전화 47건</div><div class="b">${esc(callsLatestName())}</div></div><div class="time">어제</div></div>
    <div class="ncard"><div class="appic" style="background:linear-gradient(#5EE07A,#2DBE4E)"><svg viewBox="0 0 24 24"><path d="M12 3.5c5 0 9 3.3 9 7.5s-4 7.5-9 7.5c-1 0-2-.1-2.9-.4L4.5 20l1.2-3.6C4 15 3 13.1 3 11c0-4.2 4-7.5 9-7.5z"/></svg></div><div><div class="t">${esc(lth.name)}</div><div class="b">${esc(lm.text)}</div></div><div class="time">${lm.ts === nowTs() ? '지금' : shortDate(lm.ts)}</div>${more ? `<div class="more">메시지 ${more}개 더 있음</div>` : ''}</div>
  </div>
  <div class="qa" style="left:46px"><svg viewBox="0 0 24 24"><path d="M8 3h8v3l-2 4v10a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V10L8 6z"/><path d="M12 13v2"/></svg></div>
  <div class="qa" style="right:46px" data-act="open" data-app="camera"><svg viewBox="0 0 24 24"><path d="M3 8h4l1.6-2.5h6.8L17 8h4v11H3z"/><circle cx="12" cy="13.3" r="3.6"/></svg></div>
  <div class="swipe" data-act="unlock">위로 쓸어서 열기</div>`;
}
function callsLatestName() {
  const c = DATA.calls[0];
  return `${c.name || c.n} 외 다수`;
}
function homeHTML() {
  const apps = APPS.map((a) => `<div class="app" data-act="open" data-app="${a.id}"><div class="icon" style="background:${a.bg}">${ICON[a.id] || ''}</div><span>${a.label}</span></div>`).join('');
  const dock = `
    <div class="icon" style="background:linear-gradient(#5EE07A,#2DBE4E)" data-act="open" data-app="phone">${ICON.phone}<b class="badge">47</b></div>
    <div class="icon" style="background:linear-gradient(#5EE07A,#2DBE4E)" data-act="open" data-app="msg">${ICON.msg}${totalUnread() ? `<b class="badge">${totalUnread()}</b>` : ''}</div>
    <div class="icon" style="background:linear-gradient(#A8ADB5,#6F757E)" data-act="open" data-app="camera">${ICON.camera}</div>`;
  return `
  ${sceneBackHTML()}
  <div class="apps">${apps}</div>
  <div class="search"><svg viewBox="0 0 12 12"><circle cx="5" cy="5" r="3.6"/><path d="M7.7 7.7 11 11"/></svg>검색</div>
  <div class="dock">${dock}</div>`;
}
function noticeHTML() {
  return `<div class="notice"><div><p>이 게임에는 약물 범죄, 채무, 실종을 다루는 내용이 포함되어 있습니다.</p><p>소리를 켜고, 이어폰을 권합니다.</p><button data-act="noticeOk">계속</button></div></div>`;
}
function titleHTML() {
  const resume = S.hasCheckpoint ? `<button class="alt" data-act="resume">이어하기</button>` : '';
  return `<div class="title"><div><h1>DONTKNOW</h1><p>아버지의 폰에서 시작한다<br>S1–S14 · 엔딩 4종</p><div class="btns"><button data-act="start">처음부터</button>${resume}</div></div></div>`;
}
function headerHTML(title, { left = '', right = '', back = true } = {}) {
  return `<div class="hdr"><div class="lft" ${back ? 'data-act="back"' : ''}>${back ? '<svg viewBox="0 0 12 21"><path d="M10 2 2 10.5l8 8.5"/></svg>' : ''}${esc(left)}</div><h1>${esc(title)}</h1><div class="rgt">${right}</div></div>`;
}
function sceneBackHTML() {
  return S.dlg && (S.dlg.channel === 'face' || S.dlg.channel === 'intercom') && S.phoneUp
    ? '<div class="scene-back" data-act="sceneReturn">장면으로 돌아가기</div>' : '';
}

// 메시지 앱
function msgListHTML() {
  const ids = Object.keys(T).filter((id) => T[id].msgs.length).sort((a, b) => lastOf(T[b]).ts.localeCompare(lastOf(T[a]).ts));
  const rows = ids.map((id) => {
    const th = T[id]; const lm = lastOf(th);
    return `<div class="row" data-act="thread" data-id="${id}">
      <span class="dot ${th.unread ? '' : 'off'}"></span>
      <div class="txt" style="grid-column:2"><div class="n">${esc(th.name)}</div><div class="p">${esc(lm.text)}</div></div>
      <div class="meta">${shortDate(lm.ts)}${th.unread ? `<br><span class="unread">${th.unread}</span>` : ''}</div>
    </div>`;
  }).join('');
  return `<div class="view" style="background:#fff">${headerHTML('메시지', { back: false, left: '편집', right: '' })}<div class="scroll list">${rows}</div></div>`;
}
function threadHTML(id) {
  const th = T[id];
  let body = ''; let lastD = '';
  const divAt = th.divider ? th.msgs.length - th.divider : -1;
  th.msgs.forEach((m, i) => {
    if (i === divAt) body += `<div class="newmark">읽지 않은 메시지 ${th.divider}개</div>`;
    if (m.from === 'sys') { body += `<div class="sysline">${esc(m.text)}</div>`; return; }
    if (m.d !== lastD) { body += `<div class="stamp"><b>${esc(m.d)}</b> ${esc(m.t)}</div>`; lastD = m.d; }
    body += `<div class="row-msg ${m.from === 'me' ? 'me' : ''}"><div class="bub ${m.fresh ? 'pop' : ''}">${esc(m.text)}</div></div>`;
    m.fresh = false;
  });
  const d = S.dlg;
  if (d && d.channel === 'sms' && d.typing && threadForWho(d.who) === id) body += `<div class="row-msg"><div class="bub typing"><i></i><i></i><i></i></div></div>`;
  const contact = CT.find((c) => c.th === id);
  const right = contact && contact.kind !== 'none' ? `<span data-act="dial" data-num="${contact.num}" style="display:grid;place-items:center;width:30px;height:30px">${ICON.phone.replace('<svg', '<svg style="width:22px;height:22px;stroke:none"')}</span>` : '';
  let field = '…'; let ready = false; let act = '';
  if (th.reply === 'offer' && S.replyOffer && S.replyOffer.id === id) { field = '탭해서 답장'; ready = true; act = `data-act="compose" data-id="${id}"`; }
  if (th.reply === 's2' && d && d.channel === 'sms' && d.waiting && threadForWho(d.who) === id) { field = '탭해서 답장'; ready = true; act = `data-act="compose" data-id="${id}"`; }
  if (th.reply === 's2' && d && d.channel === 'call' && threadForWho(d.who) === id) field = '통화 중';
  if (th.reply === 'quick') { field = '탭해서 답장'; ready = true; act = `data-act="compose" data-id="${id}"`; }
  return `<div class="view" style="background:#fff">${headerHTML(th.name, { right })}
    <div class="scroll" data-keep="thread"><div class="thread-body">${body}</div></div>
    <div class="compose"><div class="plus"><svg viewBox="0 0 16 16"><path d="M8 2v12M2 8h12"/></svg></div><div class="field ${ready ? 'ready' : ''}" ${act}>${field}</div></div>
  </div>`;
}

// 전화 앱
function phoneHTML() {
  const seg = `<div class="seg2"><button class="${S.tab === 'recent' ? 'on' : ''}" data-act="tab" data-tab="recent">최근기록</button><button class="${S.tab === 'keypad' ? 'on' : ''}" data-act="tab" data-tab="keypad">키패드</button></div>`;
  if (S.tab === 'keypad') {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
    return `<div class="view" style="background:#fff">${headerHTML('키패드', { back: false })}${seg}
      <div class="dial-disp" style="text-align:center;font-size:30px;min-height:58px;padding-top:12px">${esc(S.digits)}</div>
      <div class="dial">${keys.map((k) => `<button data-act="key" data-k="${k}">${k}</button>`).join('')}
      <span></span><button class="callkey" data-act="keycall">${ICON.phone.replace('<svg', '<svg style="width:30px;height:30px;stroke:none;fill:#fff"')}</button><span></span></div></div>`;
  }
  const rows = DATA.calls.map((c) => {
    const label = c.name || c.n;
    return `<div class="row" data-act="dial" data-num="${esc(c.n)}" style="grid-template-columns:14px 1fr auto">
      <span class="dot off"></span><div class="txt" style="grid-column:2"><div class="n">${esc(label)}</div><div class="p">${esc(c.n)}</div></div>
      <div class="meta">${esc(c.d)} ${esc(c.t)}</div></div>`;
  }).join('');
  return `<div class="view" style="background:#fff">${headerHTML('최근기록', { back: false, left: '편집' })}${seg}<div class="scroll list" data-keep="phone">${rows}</div></div>`;
}

// 연락처
function contactsHTML(id) {
  if (id) {
    const c = CT.find((x) => x.id === id);
    if (!c) return contactsHTML();
    const hasMsg = c.th && T[c.th];
    return `<div class="view" style="background:var(--grouped)">${headerHTML('연락처')}<div class="scroll">
      <div class="big"><div class="avatar" style="width:84px;height:84px;margin:0 auto;border-radius:50%;background:linear-gradient(#B7BDC8,#8C939E);display:grid;place-items:center"><svg viewBox="0 0 30 30" width="44" height="44" fill="#fff"><circle cx="15" cy="11" r="5.5"/><path d="M5 27c1.4-5.4 5.2-8 10-8s8.6 2.6 10 8z"/></svg></div>
      <div class="n" style="margin-top:14px">${esc(c.name)}</div><div class="num">${esc(c.num)}</div>
      <div class="btns"><div class="rb" data-act="dial" data-num="${c.num}"><i>${ICON.phone.replace('<svg', '<svg style="stroke:none"')}</i>전화</div>${hasMsg ? `<div class="rb" data-act="thread" data-id="${c.th}"><i><svg viewBox="0 0 26 26"><path d="M4 6h18v12H10l-6 4z"/></svg></i>메시지</div>` : ''}</div></div>
    </div></div>`;
  }
  const rows = CT.map((c) => `<div class="row" data-act="contact" data-id="${c.id}" style="grid-template-columns:1fr auto"><div class="txt"><div class="n">${esc(c.name)}</div></div></div>`).join('');
  return `<div class="view" style="background:#fff">${headerHTML('연락처', { back: false })}<div class="scroll list">${rows}</div></div>`;
}

// 사진
function photosHTML(i) {
  if (i !== undefined && i !== null && S.stack.length && S.stack[S.stack.length - 1].id === i) {
    const p = S.photos[i];
    return `<div class="view" style="background:#000">${headerHTML('사진', { left: '' })}<div style="flex:1;display:grid;place-items:center;min-height:0"><img src="${esc(p.src || '')}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;${p.src ? '' : 'display:none'}"></div></div>`;
  }
  const tiles = S.photos.map((p, idx) => `<button data-act="photo" data-i="${idx}">${p.src ? `<img src="${esc(p.src)}" alt="">` : `<div style="width:100%;height:100%;background:linear-gradient(#8A929C,#5C646E)"></div>`}</button>`).join('');
  return `<div class="view" style="background:#fff">${headerHTML('사진', { back: false })}<div class="scroll"><div class="grid3">${tiles}</div></div></div>`;
}

// 길찾기
function mapHTML(route) {
  if (route) {
    const pid = S.routePlace;
    const p = PLACES[pid];
    if (!p) return mapHTML(false);
    const min = travelMin(S.place, pid);
    const arrive = clockStr(clockAfter(min));
    return `<div class="view" style="background:#fff">${headerHTML('길찾기')}
      <div class="map"><svg viewBox="0 0 390 330" preserveAspectRatio="xMidYMid slice">
        <rect width="390" height="330" fill="#E8ECEF"/>
        <path d="M0 110H390M0 240H390M90 0V330M250 0V330" stroke="#fff" stroke-width="14"/>
        <path d="M40 40h40v50H40zM150 150h60v60h-60zM290 40h60v40h-60z" fill="#D4E8D8"/>
        <path d="M70 260 L160 200 L200 130 L330 60" fill="none" stroke="#E39A3B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="70" cy="260" r="9" fill="#0A7CFF" stroke="#fff" stroke-width="3"/>
        <path d="M330 40c-9 0-15 6-15 14 0 10 15 26 15 26s15-16 15-26c0-8-6-14-15-14z" fill="#FF3B30"/>
      </svg>
      <div class="route-card"><div class="t">${esc(p.name)}까지 ${min}분</div><div class="s">도착 예정 ${arrive} · ${esc(PLACES[S.place] ? PLACES[S.place].name : '집')}에서 출발</div><button class="gobtn" data-act="startnav">안내 시작</button></div></div></div>`;
  }
  const dests = S.destinations.filter((d) => d !== S.place && PLACES[d]).map((d) => `<div class="row" data-act="route" data-place="${d}" style="grid-template-columns:1fr auto"><div class="txt"><div class="n">${esc(PLACES[d].name)}</div><div class="p">최근 목적지</div></div></div>`).join('');
  const here = PLACES[S.place] || PLACES.home;
  return `<div class="view" style="background:#fff">${headerHTML('길찾기', { back: false })}<div class="scroll list">
    <div class="section-h">현재 위치</div><div class="row" style="grid-template-columns:1fr"><div class="txt"><div class="n">${esc(here.name)}</div><div class="p">${clockStr()} · ${esc(here.name)}</div></div></div>
    <div class="section-h">목적지</div>${dests || '<div class="empty">아직 등록된 목적지가 없습니다.</div>'}
  </div></div>`;
}

// 은행
function bankHTML() {
  return `<div class="view" style="background:var(--grouped)">${headerHTML('은행', { back: false })}<div class="scroll">
    <div class="section-h">입출금 통장</div><div class="kv"><span>잔액</span><span class="k2">확인 필요</span></div>
    <div class="section-h">최근 거래</div><div class="empty">최근 3개월 거래 내역이 없습니다.</div></div></div>`;
}

// 메모
function memoHTML(id) {
  if (id === 'new') {
    return `<div class="view" style="background:#fff">${headerHTML('새 메모', { left: '취소' })}<textarea class="ta" id="memo-input" placeholder="내용을 입력">${esc(S.memoDraft || '')}</textarea><div style="padding:0 16px"><button class="gobtn" data-act="savenote">저장</button></div></div>`;
  }
  const rows = S.notes.length ? S.notes.map((n) => `<div class="note-row"><div class="n">${esc(n.text.split('\n')[0])}</div><div class="p">${esc(n.d)}</div></div>`).join('') : '<div class="empty">메모가 없습니다.<br>오른쪽 위 버튼으로 새 메모를 쓸 수 있습니다.</div>';
  return `<div class="view" style="background:#fff">${headerHTML('메모', { back: false, right: '<span data-act="newnote">새로운</span>' })}<div class="scroll">${rows}</div></div>`;
}

// 톡·설정·카메라
function talkHTML() {
  const seg = `<div class="seg2"><button class="${S.talkTab === 'friends' ? 'on' : ''}" data-act="talktab" data-tab="friends">친구</button><button class="${S.talkTab === 'chats' ? 'on' : ''}" data-act="talktab" data-tab="chats">채팅</button></div>`;
  if (S.talkTab === 'chats') {
    const ids = Object.keys(TALK.chats).sort((a, b) => {
      const x = TALK.chats[a].msgs[TALK.chats[a].msgs.length - 1];
      const y = TALK.chats[b].msgs[TALK.chats[b].msgs.length - 1];
      return (y ? y.ts : '').localeCompare(x ? x.ts : '');
    });
    const rows = ids.map((id) => {
      const c = TALK.chats[id];
      const lm = c.msgs[c.msgs.length - 1] || { text: '', ts: '' };
      return `<div class="row" data-act="talkopen" data-id="${id}" style="grid-template-columns:17px 1fr auto">
        <span class="dot ${c.unread ? '' : 'off'}"></span>
        <div class="txt" style="grid-column:2"><div class="n">${esc(c.name)}</div><div class="p">${esc(lm.text)}</div></div>
        <div class="meta">${lm.ts ? shortDate(lm.ts) : ''}${c.unread ? `<br><span class="unread">${c.unread}</span>` : ''}</div></div>`;
    }).join('');
    return `<div class="view" style="background:#fff">${headerHTML('톡', { back: false })}${seg}<div class="scroll list">${rows || '<div class="empty">대화가 없습니다.</div>'}</div></div>`;
  }
  const avatar = '<svg viewBox="0 0 30 30"><circle cx="15" cy="11" r="5.5"/><path d="M5 27c1.4-5.4 5.2-8 10-8s8.6 2.6 10 8z"/></svg>';
  const friends = TALK.friends.map((f) => {
    const chat = TALK.chats[f.id];
    const status = f.status || '';
    return `<div class="row talk-friend" ${chat ? `data-act="talkopen" data-id="${f.id}"` : ''}>
      <div class="av2" style="grid-column:1">${avatar}</div>
      <div class="txt" style="grid-column:2"><div class="n">${esc(f.name)}</div><div class="p">${esc(status)}</div></div></div>`;
  }).join('');
  return `<div class="view" style="background:var(--grouped)">${headerHTML('톡', { back: false })}${seg}<div class="scroll list">
    <div class="talk-profile"><div class="ava"><svg viewBox="0 0 30 30"><circle cx="15" cy="11" r="5.5"/><path d="M5 27c1.4-5.4 5.2-8 10-8s8.6 2.6 10 8z"/></svg></div>
      <div><div class="n">${esc(TALK.profile.name)}</div><div class="b">생일 ${esc(TALK.profile.birthday)}</div></div></div>
    <div class="section-h">친구 ${TALK.friends.length}</div>${friends}</div></div>`;
}
function talkThreadHTML(id) {
  const chat = TALK.chats[id];
  if (!chat) return talkHTML();
  let body = ''; let lastD = '';
  chat.msgs.forEach((m) => {
    if (m.d !== lastD) { body += `<div class="stamp"><b>${esc(m.d)}</b> ${esc(m.t)}</div>`; lastD = m.d; }
    body += `<div class="row-msg ${m.from === 'me' ? 'me' : ''}"><div class="bub ${m.fresh ? 'pop' : ''}">${esc(m.text)}</div></div>`;
    m.fresh = false;
  });
  const waiting = S.talkChoice && S.talkChoice.id === id;
  const choices = waiting
    ? `<div class="talk-choices">${S.talkChoice.opts.map((o, i) => `<button data-act="talkchoose" data-i="${i}">${esc(o.label)}</button>`).join('')}</div>`
    : '';
  return `<div class="view talk-thread" style="background:#F7F8FA">${headerHTML(chat.name)}
    <div class="scroll" data-keep="talkthread"><div class="thread-body">${body}</div></div>${choices}</div>`;
}
function settingsHTML() {
  return `<div class="view" style="background:var(--grouped)">${headerHTML('설정', { back: false })}<div class="scroll">
    <div class="section-h">알림</div><div class="kv"><span>알림 허용</span><span class="k2">켬</span></div>
    <div class="section-h">차단된 번호</div><div class="kv"><span>070-XXXX-3301</span><span class="k2">2023년 8월 14일</span></div>
    <div class="sec-gap"></div><div class="kv"><span>잠금 암호</span><span class="k2">없음</span></div></div></div>`;
}
function cameraHTML() {
  return `<div class="cam"><div class="finder"></div><div style="position:absolute;top:56px;left:0;right:0;text-align:center;font-size:15px">사진</div>
    <div class="shutter" data-act="shutter"><i></i></div>${S.flash ? '<div class="flash"></div>' : ''}
    <div class="hdr" style="position:absolute;top:0;left:0;right:0;background:transparent;border:0;height:98px;color:#fff"><div class="lft" data-act="back" style="color:#fff">${'<svg viewBox="0 0 12 21" style="stroke:#fff"><path d="M10 2 2 10.5l8 8.5"/></svg>'}</div><h1 style="color:#fff">카메라</h1><div></div></div></div>`;
}
function appView(top) {
  switch (top.app) {
    case 'msg': return top.id ? threadHTML(top.id) : msgListHTML();
    case 'phone': return phoneHTML();
    case 'contacts': return contactsHTML(top.id);
    case 'photos': return photosHTML(top.id);
    case 'map': return mapHTML(top.id === 'route');
    case 'bank': return bankHTML();
    case 'memo': return memoHTML(top.id);
    case 'talk': return top.id ? talkThreadHTML(top.id) : talkHTML();
    case 'settings': return settingsHTML();
    case 'camera': return cameraHTML();
    default: return msgListHTML();
  }
}

// ───────── 렌더: CCTV ─────────
function cctvFrame(c) {
  let k = c.frames.length ? c.frames[0] : null;
  for (const f of c.frames) if (c.t >= f.at) k = f;
  return k ? imgPath(k.img) : '';
}
function cctvHTML() {
  const c = S.cctv;
  if (!c) return '';
  const ticks = [0, 60, 120].map((at) => `<i style="left:${(at / c.end) * 100}%"></i>`).join('');
  const ready = c.seen + 1 >= c.need;
  return `<div class="cctv" data-k="cctv">
    <div class="cctv-h"><div class="camlabel">CAM 02 · 2026-03-14</div><div class="tc">${hms(c.t)}</div></div>
    <div class="monitor">
      <div class="frame" style="background-image:url('${esc(cctvFrame(c))}')"></div>
      <div class="scan"></div>
      ${c.playing ? '' : '<div class="pause">일시정지</div>'}
    </div>
    <div class="ctrl">
      <button data-act="cctvStep" data-dir="-1" aria-label="5초 뒤로">◀◀</button>
      <button data-act="cctvPlay" aria-label="재생">${c.playing ? '❚❚' : '▶'}</button>
      <button data-act="cctvStep" data-dir="1" aria-label="5초 앞으로">▶▶</button>
    </div>
    <div class="timeline">
      <input id="cctv-range" type="range" min="0" max="${c.end}" step="0.5" value="${c.t}">
      <div class="ticks">${ticks}</div>
      <div class="ends"><span>19:05:00</span><span>19:07:30</span></div>
    </div>
    <div class="cctv-foot"><button class="cctv-done" data-act="cctvDone" ${ready ? '' : 'disabled'}>확인</button></div>
  </div>`;
}

// ───────── 렌더: 대면 장면·이동 ─────────
function sceneHTML() {
  const d = S.dlg;
  if (!d) return '';
  const img = imgPath(d.scene || 'scene_home_hall_night');
  const line = d.line || { who: d.who, text: '' };
  const opts = d.waiting ? visibleOpts(d.waiting) : [];
  const choices = opts.length
    ? `<div class="choices">${opts.map((o, i) => `<button data-act="choose" data-i="${i}">${esc(labelText(o, d.channel))}</button>`).join('')}</div>`
    : (d.awaitTap ? '<div class="tapnext">탭하면 계속</div>' : '');
  return `<div class="scene ${d.channel === 'intercom' ? 'intercom' : ''}" data-k="scene">
    <div class="bg" style="background-image:url('${esc(img)}')"></div><div class="shade"></div>
    ${d.channel === 'intercom' ? '<div class="ipbadge">인터폰</div>' : ''}
    <div class="dlg" data-act="dlgNext">
      <div class="who">${esc(charName(line.who))}</div>
      <div class="line">${esc(line.text || '…')}</div>
      ${choices}
    </div>
    <button class="phonebtn" data-act="phoneUp">폰</button>
  </div>`;
}
function travelHTML() {
  const t = S.travel;
  const p = PLACES[t.dest];
  return `<div class="travel" data-k="travel">
    <div class="top"><div class="dest">${esc(p ? p.name : t.dest)}</div><div class="arr">도착 ${clockStr(t.arriveClock)} · ${t.minutes}분</div></div>
    <div class="mapwrap"><svg viewBox="0 0 390 560" preserveAspectRatio="xMidYMid slice">
      <path class="road" d="M-20 120H410M-20 300H410M-20 455H410M80 -20V580M220 -20V580M330 -20V580"/>
      <path class="roadthin" d="M0 200H390M0 380H390M150 -20V580M285 -20V580"/>
      <path class="route" id="travel-route" d="M-10 510 C70 470 110 430 150 380 S235 290 260 220 S320 120 410 60"/>
      <circle class="dot" id="travel-dot" cx="-10" cy="510" r="5"/>
    </svg></div>
    <div class="travelmsg">안내 중</div>
  </div>`;
}

// ───────── DOM 패치 ─────────
function morph(parent, html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  patchKids(parent, tpl.content);
}
function keyOf(n) { return n.nodeType === 1 ? n.getAttribute('data-k') : null; }
function sameNode(x, y) { return x.nodeType === y.nodeType && x.nodeName === y.nodeName && keyOf(x) === keyOf(y); }
function patchKids(a, b) {
  const keyed = new Map();
  for (const c of a.children) { const k = keyOf(c); if (k) keyed.set(k, c); }
  let cur = a.firstChild;
  for (const y of [...b.childNodes]) {
    let x = cur;
    const k = keyOf(y);
    if (k) { x = keyed.get(k); if (x && x !== cur) a.insertBefore(x, cur); }
    if (x && sameNode(x, y)) { patchNode(x, y); cur = x.nextSibling; } else a.insertBefore(y, cur);
  }
  while (cur) { const n = cur.nextSibling; a.removeChild(cur); cur = n; }
}
function patchNode(x, y) {
  if (x.nodeType !== 1) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; return; }
  for (const at of [...x.attributes]) if (!y.hasAttribute(at.name)) x.removeAttribute(at.name);
  for (const at of y.attributes) if (x.getAttribute(at.name) !== at.value) x.setAttribute(at.name, at.value);
  patchKids(x, y);
}

function renderRoot() {
  const root = $('#root');
  const screen = $('#screen');
  const keep = [...root.querySelectorAll('[data-keep]')].map((el) => [el.dataset.keep, el.scrollTop]);
  let html; let cls = '';
  const inScene = S.dlg && (S.dlg.channel === 'face' || S.dlg.channel === 'intercom') && !S.phoneUp;
  if (S.phase === 'notice') html = noticeHTML();
  else if (S.phase === 'title') html = titleHTML();
  else if (S.phase === 'prologue') html = '<div class="blackfill"></div>';
  else if (S.cctv) { html = cctvHTML(); cls = 'cctv'; }
  else if (S.travel) { html = travelHTML(); cls = 'travel'; }
  else if (inScene) { html = sceneHTML(); cls = 'scene'; }
  else if (!S.unlocked) { html = `<div class="lock" data-k="lock" style="position:absolute;inset:0">${lockHTML()}</div>`; cls = 'lock'; }
  else if (!S.stack.length) { html = `<div class="home" data-k="home" style="position:absolute;inset:0">${homeHTML()}</div>`; cls = 'home'; }
  else { const tp = S.stack[S.stack.length - 1]; html = `<div class="view-wrap" data-k="v-${S.stack.length}-${tp.app}-${tp.id ?? ''}" style="position:absolute;inset:0;background:#fff">${sceneBackHTML()}${appView(tp)}</div>`; }
  screen.className = `screen ${cls}`;
  if (root._h !== html) {
    if (S.navAnim) root.innerHTML = html; else morph(root, html);
    root._h = html;
    if (S.navAnim && root.firstElementChild) root.firstElementChild.classList.add(`anim-${S.navAnim === 'homeSlow' ? 'home' : S.navAnim}`);
    keep.forEach(([k, v]) => { const el = root.querySelector(`[data-keep="${k}"]`); if (el) el.scrollTop = v; });
  }
  S.navAnim = null;
  if (S.autoBottom) {
    const th = root.querySelector('[data-keep="thread"]');
    if (th) th.scrollTop = th.scrollHeight;
    S.autoBottom = false;
  }
  if (S.travel && !S.travel.started) requestAnimationFrame(beginTravelAnimation);
  const hi = $('#homeind');
  const meta = ['notice', 'title', 'prologue'].includes(S.phase);
  hi.disabled = !S.unlocked || meta;
  hi.style.display = meta ? 'none' : '';
}

// ───────── 렌더: 오버레이 ─────────
function callHTML() {
  const c = S.call;
  const name = c.name;
  const ring = c.state === 'ring';
  const dead = c.state === 'dead';
  let subs = '';
  if (c.state === 'talk') {
    const base = Math.max(0, c.lines.length - 3);
    const last = c.lines.slice(-3);
    subs = last.map((l, i) => `<div data-k="l${base + i}" class="sub ${l.who === 'me' ? 'me' : ''} ${i < last.length - 1 ? 'past' : 'fresh'}">${l.who === 'me' ? '나: ' : ''}${esc(l.text)}</div>`).join('');
  }
  let choices = '';
  const d = S.dlg;
  if (c.state === 'talk' && d && d.channel === 'call' && d.waiting) {
    const opts = visibleOpts(d.waiting);
    if (opts.length) choices = `<div class="lbl">대답</div><div class="ch">${opts.map((o, i) => `<button class="opt" data-act="choose" data-i="${i}">${esc(labelText(o, 'call'))}</button>`).join('')}</div>`;
  }
  const status = ring ? '연결 중…' : dead ? c.deadText : fmtDur(Date.now() - c.since);
  return `<div class="call" data-k="call">
    <div class="who">${esc(name)}</div><div class="st ${ring ? 'ring' : ''}" id="call-st">${status}</div>
    <div class="av"><svg viewBox="0 0 30 30"><circle cx="15" cy="11" r="5.5"/><path d="M5 27c1.4-5.4 5.2-8 10-8s8.6 2.6 10 8z"/></svg></div>
    <div class="subs">${subs}</div>
    ${choices}
    <button class="end" data-act="hangup" aria-label="${dead || ring ? '닫기' : '끊기'}" style="margin-top:auto"><svg viewBox="0 0 24 24"><path d="M3 13c3-3 15-3 18 0l-2 4-3-1v-2c-2-.7-6-.7-8 0v2l-3 1-2-4z"/></svg></button>
    <div style="font-size:12px;margin-top:10px;color:rgba(255,255,255,.55)">${dead || ring ? '' : '끊기'}</div>
  </div>`;
}
function renderOv() {
  const el = $('#overlay');
  let h = '';
  if (S.banner) h += `<div class="banner ${S.banner.out ? 'out' : ''}" data-k="banner" data-act="bannerTap" data-id="${S.banner.id || ''}"><div class="appic" style="background:linear-gradient(#5EE07A,#2DBE4E)">${'<svg viewBox="0 0 24 24" style="width:22px;height:22px;fill:#fff"><path d="M12 3.5c5 0 9 3.3 9 7.5s-4 7.5-9 7.5c-1 0-2-.1-2.9-.4L4.5 20l1.2-3.6C4 15 3 13.1 3 11c0-4.2 4-7.5 9-7.5z"/></svg>'}</div><div><div class="t">${esc(S.banner.title)}</div><div class="b">${esc(S.banner.body)}</div></div><div class="time">지금</div></div>`;
  if (S.mono) h += `<div class="mono" data-k="mono-${S.monoN}"><span>${esc(S.mono)}</span></div>`;
  const ov = S.ov;
  if (ov) {
    if (ov.type === 'call' && S.call) h += callHTML();
    if (ov.type === 'incoming') h += `<div class="scrim" data-act="decline"></div><div class="sheet" style="top:60px;bottom:auto;padding-top:24px;text-align:center"><div style="font-size:14px;color:var(--label2)">휴대전화</div><div style="font-size:26px;font-weight:600;margin:6px 0 30px">${esc(ov.name)}</div><div style="display:flex;justify-content:space-around"><div class="rb" data-act="decline" style="color:var(--red)"><i style="background:var(--red)"><svg viewBox="0 0 24 24" style="stroke:none;fill:#fff;transform:rotate(135deg)"><path d="M3 13c3-3 15-3 18 0l-2 4-3-1v-2c-2-.7-6-.7-8 0v2l-3 1-2-4z"/></svg></i>거절</div><div class="rb" data-act="accept" style="color:var(--green)"><i style="background:var(--green)"><svg viewBox="0 0 24 24" style="stroke:none;fill:#fff"><path d="M6.6 2.8c.6-.1 1.1.2 1.4.7l1.5 3.2c.2.5.1 1.1-.3 1.5L7.8 9.6a12 12 0 0 0 6.6 6.6l1.4-1.4c.4-.4 1-.5 1.5-.3l3.2 1.5c.5.3.8.8.7 1.4l-.4 2.4c-.1.7-.7 1.2-1.4 1.2C10.4 21 3 13.6 3 4.6c0-.7.5-1.3 1.2-1.4z"/></svg></i>받기</div></div></div>`;
    if (ov.type === 'choices' && S.dlg && S.dlg.waiting) {
      h += `<div class="scrim" data-act="closeov"></div><div class="sheet"><div class="grab"></div><h3>답장</h3><div class="group">${visibleOpts(S.dlg.waiting).map((o, i) => `<button class="opt blue" data-act="choose" data-i="${i}">${esc(labelText(o, S.dlg.channel))}</button>`).join('')}</div><button class="cancel" data-act="closeov">취소</button></div>`;
    }
    if (ov.type === 'quick') {
      h += `<div class="scrim" data-act="closeov"></div><div class="sheet"><div class="grab"></div><h3>답장</h3><div class="group">${T.dispatch.quick.map((q, i) => `<button class="opt blue" data-act="quick" data-i="${i}">${esc(q)}</button>`).join('')}</div><button class="cancel" data-act="closeov">취소</button></div>`;
    }
    if (ov.type === 'offer' && S.replyOffer) {
      h += `<div class="scrim" data-act="closeov"></div><div class="sheet"><div class="grab"></div><h3>답장</h3><div class="group">${S.replyOffer.opts.map((o, i) => `<button class="opt blue" data-act="offerPick" data-i="${i}">${esc(o.label)}</button>`).join('')}</div><button class="cancel" data-act="closeov">취소</button></div>`;
    }
    if (ov.type === 'block') h += `<div class="scrim" data-act="closeov"></div><div class="sheet"><div class="grab"></div><h3>차단된 번호</h3><div class="note-box">${esc(ov.name)}은(는) 차단 목록에 있어 전화를 걸 수 없습니다. 설정 › 차단된 번호에서 해제할 수 있습니다.</div><div class="group" style="margin-top:12px"><button class="opt blue" data-act="closeov" style="justify-content:center">확인</button></div></div>`;
  }
  if (el._h !== h) { morph(el, h); el._h = h; }
}

function renderDebug() {
  const d = $('#debug');
  if (!DEBUG) { d.hidden = true; return; }
  d.hidden = false;
  const know = Object.keys(S.know).join(', ') || '없음';
  const flags = Object.keys(S.flags).join(', ') || '없음';
  const dlg = S.dlg ? `${S.dlg.id} · ${S.dlg.channel} · ${S.dlg.waiting ? 'waiting' : 'run'}` : '없음';
  d.innerHTML = `<b>디버그</b> · 배속 ${SPEED}×<br>
    session: <b>${S.session || '-'}</b> · phase: <b>${S.phase}</b><br>
    clock: ${clockStr()} · place: <b>${S.place}</b><br>
    dlg: ${esc(dlg)}<br>
    know: <b>${esc(know)}</b><br>flags: ${esc(flags)}<br>
    destinations: ${S.destinations.join(' / ') || '없음'}<br>
    <div class="jumps">${['S01','S02','S03','S04','S05','S06','S07','S08','S09','S10','S11','S12','S13','S14'].map((id) => `<button data-act="jump" data-session="${id}">${id}</button>`).join('')}</div>
    <button data-act="reset">처음부터</button>`;
}

// 통화 시간은 글자만 바꾼다.
setInterval(() => {
  const st = document.getElementById('call-st');
  if (S.call && S.call.state === 'talk' && st) st.textContent = fmtDur(Date.now() - S.call.since);
}, 1000);

function refresh() {
  renderStatus();
  renderRoot();
  renderOv();
  renderDebug();
}

// ───────── 입력 ─────────
function dial(num) {
  const c = ctByNum(num);
  const kind = c ? c.kind : 'none';
  const name = c ? c.name : num;
  if (c && dialHooks[c.id]) { if (dialHooks[c.id](c) === true) return; }
  if (kind === 'dohyun') return openDead(name, '전원이 꺼져 있거나 신호가 없는 곳에 있을 수 있습니다.', 1500);
  if (kind === 'block') { S.ov = { type: 'block', name }; return refresh(); }
  return openDead(name, '받지 않습니다.', 2000);
}
function acceptIncoming() {
  S.ov = null;
  for (const fn of acceptHooks) if (fn() === true) { refresh(); return; }
  refresh();
}
function act(name, el) {
  switch (name) {
    case 'noticeOk': S.phase = 'title'; return refresh();
    case 'start': return startGameFn ? startGameFn() : jump('S01');
    case 'resume': return resumeCheckpoint();
    case 'skipCine': return endCine();
    case 'cineTap': return cineTap();
    case 'reset': try { localStorage.removeItem(CHECKPOINT_KEY); } catch (e) {} return location.reload();
    case 'unlock': if (S.unlocked) return; nav('unlock'); S.unlocked = true; S.stack = []; return refresh();
    case 'home': if (S.unlocked && S.stack.length) { nav('home'); S.stack = []; S.ov = S.ov && S.ov.type === 'done' ? S.ov : null; refresh(); } return;
    case 'open': {
      const app = el.dataset.app;
      if (!S.unlocked) { nav('unlock'); S.unlocked = true; } else nav('open');
      S.stack.push({ app, id: null });
      if (app === 'phone') S.tab = 'recent';
      return refresh();
    }
    case 'back': nav(S.stack.length > 1 ? 'pop' : 'home'); S.stack.pop(); return refresh();
    case 'thread': return openThread(el.dataset.id);
    case 'compose': {
      const id = el.dataset.id;
      if (T[id].reply === 'offer' && S.replyOffer) { S.ov = { type: 'offer' }; return refresh(); }
      if (T[id].reply === 'quick') { S.ov = { type: 'quick' }; return refresh(); }
      if (S.dlg && S.dlg.waiting && S.dlg.channel === 'sms') { S.ov = { type: 'choices' }; return refresh(); }
      return;
    }
    case 'choose': return choose(Number(el.dataset.i));
    case 'quick': {
      const q = T.dispatch.quick[Number(el.dataset.i)];
      S.ov = null;
      addMsg('dispatch', nowMsg('me', q));
      return;
    }
    case 'offerPick': return pickOfferReply(Number(el.dataset.i));
    case 'closeov': return closeOv();
    case 'dial': return dial(el.dataset.num);
    case 'accept': return acceptIncoming();
    case 'decline': if (S.ov && S.ov.type === 'incoming') closeOv(); return;
    case 'hangup': return endCall();
    case 'bannerTap': {
      const id = el.dataset.id;
      const kind = S.banner && S.banner.kind;
      S.banner = null;
      if (id) {
        if (!S.unlocked) { nav('unlock'); S.unlocked = true; S.stack = []; }
        if (kind === 'talk') return openTalkThread(id);
        return openThread(id);
      }
      return refresh();
    }
    case 'tab': S.tab = el.dataset.tab; return refresh();
    case 'talktab': S.talkTab = el.dataset.tab; return refresh();
    case 'talkopen': return openTalkThread(el.dataset.id);
    case 'talkchoose': return pickTalkChoice(Number(el.dataset.i));
    case 'cctvPlay': return toggleCctvPlay();
    case 'cctvStep': return cctvStep(Number(el.dataset.dir) || 1);
    case 'cctvDone': return cctvDone();
    case 'key': S.digits += el.dataset.k; return refresh();
    case 'keycall': if (S.digits) { const n = S.digits; S.digits = ''; return dial(n); } return;
    case 'contact': nav('push'); S.stack.push({ app: 'contacts', id: el.dataset.id }); return refresh();
    case 'photo': nav('push'); S.stack.push({ app: 'photos', id: Number(el.dataset.i) }); return refresh();
    case 'newnote': nav('push'); S.stack.push({ app: 'memo', id: 'new' }); return refresh();
    case 'savenote': {
      const v = ($('#memo-input') || {}).value || '';
      if (v.trim()) S.notes.unshift({ text: v.trim(), d: '3월 18일' });
      nav('pop');
      S.stack.pop();
      S.memoDraft = '';
      return refresh();
    }
    case 'shutter': {
      S.photos.push({ src: null });
      S.flash = true;
      refresh();
      later(350, () => { S.flash = false; refresh(); }, 'flash');
      return;
    }
    case 'route': return startRoute(el.dataset.place);
    case 'startnav': return S.routePlace ? startTravel(S.routePlace) : null;
    case 'phoneUp': S.phoneUp = true; if (S.dlg) clearTimeout(S.dlg.tapTimer); return refresh();
    case 'sceneReturn':
      S.phoneUp = false;
      S.stack = [];
      S.ov = null;
      if (S.dlg && S.dlg.awaitTap) scheduleFaceAuto();
      return refresh();
    case 'dlgNext': return faceNext();
    case 'jump': return jump(el.dataset.session);
    default: return;
  }
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  if (el.disabled) return;
  if (el.dataset.act === 'home' && (!S.unlocked || ['notice', 'title', 'prologue'].includes(S.phase))) return;
  e.stopPropagation();
  act(el.dataset.act, el);
});

// 잠금화면: 위로 쓸기
let dragY = null;
$('#screen').addEventListener('pointerdown', (e) => { if (S.unlocked === false && !S.cine) dragY = e.clientY; });
$('#screen').addEventListener('pointerup', (e) => {
  if (dragY !== null && e.clientY - dragY < -50) act('unlock');
  dragY = null;
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'memo-input') S.memoDraft = e.target.value;
  if (e.target.id === 'cctv-range' && S.cctv) setCctvTime(Number(e.target.value));
});

// 화면 맞춤
function fitDevice() {
  const f = $('#fit');
  if (window.innerWidth <= 500) { f.style.transform = ''; f.style.height = ''; return; }
  const s = Math.min(1, (window.innerHeight - 40) / 868);
  f.style.transform = `scale(${s})`;
  f.style.height = `${868 * s}px`;
  f.style.width = '414px';
  f.style.margin = '0 auto';
}
window.addEventListener('resize', fitDevice);

function boot() {
  S.hasCheckpoint = !!readCheckpoint();
  S.phase = 'notice';
  fitDevice();
  refresh();
}

// ───────── 전역 API ─────────
const API = {
  S, boot, jump, grant, setFlag, clearFlag, choose, runDialogue, refresh,
  has, flag, schedule, nudge, cancelNudge, cancelScheduled, clearGroup, later,
  showBanner, hideBanner, openDead, addArrive, addThreadOpen,
  addContact, addMsg, showMono, openThread, showThread, nav, playCine, defCine,
  addTalkContact, addTalkMsg, openTalkThread, onTalkOpen, setTalkChoice, offerReply, pickTalkChoice,
  openCctv, closeCctv, setCctvTime, toggleCctvPlay, cctvStep, cctvDone,
  defDialogue, defPlace, registerDest, onArrive, addArrive, onThreadOpen, addThreadOpen, onDialContact, onAccept, defSession, setStartGame,
  startSession, endSession, startTravel, startRoute, endCall, saveCheckpoint, readCheckpoint, charName,
  clockStr, nowMsg, labelText, visibleOpts, switchToCall, faceNext,
  SAY, ME, CHOICE, DO, WAIT, MONO, LABEL, GOTO, END,
};
Object.assign(window, {
  S, DATA,
  grant, has, setFlag, clearFlag, flag, evalCond,
  schedule, nudge, later, clearGroup, showBanner, hideBanner, openDead,
  addContact, addMsg, showMono, openThread, showThread, nav, refresh,
  addTalkContact, addTalkMsg, openTalkThread, onTalkOpen, setTalkChoice, offerReply,
  defDialogue, runDialogue, choose, SAY, ME, CHOICE, DO, WAIT, MONO, LABEL, GOTO, END,
  defCine, playCine, defPlace, registerDest, onArrive, addArrive, onThreadOpen, addThreadOpen, onDialContact, onAccept, defSession, setStartGame,
  startSession, endSession, startTravel, startRoute, endCall, switchToCall, saveCheckpoint, readCheckpoint,
  openCctv, closeCctv, setCctvTime, cctvStep, faceNext,
  clockStr, nowMsg, fmtDur, advanceClock,
});
window.__game = API;
window.DK = API;
})();
