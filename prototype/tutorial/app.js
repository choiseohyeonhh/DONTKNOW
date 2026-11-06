/* DONTKNOW 튜토리얼(S1~S2) 프로토타입. 데이터: data.js (make_data.py 생성).
   근거: docs/sessions/S01.md, S02.md, docs/ui/father-phone/*.md, docs/systems/idle-nudge.md
   디버그: ?debug=1  배속: ?speed=10 (타이머를 N배 빠르게) */
(() => {
'use strict';

const Q = new URLSearchParams(location.search);
const SPEED = Number(Q.get('speed')) || 1;
const DEBUG = Q.has('debug');

// ───────── 상태 ─────────
const S = {
  phase: 'notice',           // notice | title | prologue | s1 | s2 | s2end | done
  navAnim: null,             // 다음 렌더에 줄 전환 애니메이션
  cine: null,                // 재생 중인 시네마틱
  clock: [2, 47],
  unlocked: false,
  stack: [],                 // 앱 내비게이션 [{app, id}]
  ov: null,                  // 시트·통화·수신 등 오버레이
  banner: null,
  mono: null,                // 독백 한 줄
  autoBottom: false,
  nav: ['집'],               // 길찾기 목적지 (성원고는 S2 종료 시 조용히 등록)
  photos: [{ src: 'img/photo_family_2019.jpg' }, { src: 'img/photo_father_son_2022.jpg' }, { src: 'img/photo_graduation_gate.jpg' }],
  notes: [],
  memoDraft: '',
  flash: false,
  tab: 'recent',
  digits: '',
  jihoonOpened: false,
  jihoonEventDone: false,
  hangyeolOpened: false,
  flags: {},                 // FX-01, FX-02, MO.02 등
  know: {},                  // K-xx / KX-xx
  s2: { mode: 'msg', queue: [], waiting: null, busy: false, typing: false, callFatherSaid: false },
  call: null,                // {kind, name, state:'ring'|'talk'|'dead', since, lines, deadText}
};

// ───────── 타이머 (SPEED 반영, 그룹 단위 취소) ─────────
const timers = new Map();
function later(ms, fn, group = null) {
  const id = setTimeout(() => { timers.delete(id); fn(); }, ms / SPEED);
  timers.set(id, group);
  return id;
}
function clearGroup(group) {
  for (const [id, g] of timers) if (g === group) { clearTimeout(id); timers.delete(id); }
}

// ───────── 유틸 ─────────
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const clockStr = () => `${pad(S.clock[0])}:${pad(S.clock[1])}`;
const nowTs = () => `20260318${pad(S.clock[0])}${pad(S.clock[1])}`;
const nowMsg = (from, text) => ({ from, text, d: '2026년 3월 18일 (수)', t: clockStr(), ts: nowTs() });
const shortDate = (ts) => `${Number(ts.slice(4, 6))}/${Number(ts.slice(6, 8))}`;
const fmtDur = (ms) => { const s = Math.floor(ms / 1000); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };
const grant = (k) => { if (k) S.know[k] = true; };

// ───────── 아이콘 (확정 시안과 동일) ─────────
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
  { id: 'contacts', label: '연락처', bg: 'linear-gradient(#F4F4F6,#D9DADF)', dark: true },
  { id: 'photos', label: '사진', bg: '#fff', dark: true },
  { id: 'map', label: '길찾기', bg: 'linear-gradient(#4FD1C5,#1E9E95)' },
  { id: 'bank', label: '은행', bg: 'linear-gradient(#4E6C96,#2E4A72)' },
  { id: 'memo', label: '메모', bg: 'linear-gradient(#FFFFFF,#F1F1F3)', dark: true },
  { id: 'settings', label: '설정', bg: 'linear-gradient(#A8ADB5,#7F858E)' },
];
const APP_NAME = { talk: '톡', contacts: '연락처', photos: '사진', map: '길찾기', bank: '은행', memo: '메모', settings: '설정', camera: '카메라', phone: '전화', msg: '메시지' };

// ───────── 연락처 ─────────
const CT = [
  { id: 'dohyun', name: '도현', num: '010-XXXX-0921', kind: 'dohyun', th: 'dohyun' },
  { id: 'jihoon', name: '정지훈(도현친구)', num: '010-XXXX-1188', kind: 'jihoon', th: 'jihoon' },
  { id: 'teacher', name: '김선생님(도현 고3담임)', num: '010-XXXX-7730', kind: 'none' },
  { id: 'dispatch', name: '배차실', num: '031-XXX-2200', kind: 'none', th: 'dispatch' },
  { id: 'hangyeol', name: '한결캐피탈', num: '070-XXXX-3301', kind: 'block', th: 'hangyeol' },
  { id: 'junho', name: '103호', num: '010-XXXX-6103', kind: 'none' },
];
const ctByNum = (n) => CT.find((c) => c.num === n);

// ───────── 메시지 스레드 (데이터: docs/content/father-phone-data.md 4장) ─────────
const T = {};
T.hangyeol = { name: '1600-XXXX', unread: 11, reply: 'none', msgs: DATA.hangyeol.map((m) => ({ from: 'them', d: m.d, t: m.t, text: m.x, ts: m.ts })) };
T.jihoon = { name: '정지훈(도현친구)', unread: 1, reply: 's2', msgs: [{ from: 'them', d: '2026년 3월 15일 (일)', t: '15:25', text: '아저씨 혹시 도현이 집에 들어왔어요?', ts: '202603151525' }] };
T.dispatch = { name: '배차실', unread: 2, reply: 'quick', quick: ['사정이 있어서 못 갑니다.', '지금 가겠습니다.'], msgs: DATA.dispatch.map((m) => ({ from: 'them', d: m.d, t: m.t, text: m.x, ts: m.ts })) };
T.univ = { name: '○○대학교', unread: 2, reply: 'none', msgs: DATA.univ.map((m) => ({ from: 'them', d: m.d, t: m.t, text: m.x, ts: m.ts })) };
T.dohyun = { name: '도현', unread: 0, reply: 'none', msgs: [{ from: 'them', d: '2026년 3월 14일 (토)', t: '18:52', text: '오늘 좀 늦어. 먼저 자', ts: '202603141852' }] };
DATA.ads.forEach((a, i) => { T['ad' + i] = { name: a.num, unread: 1, reply: 'none', msgs: [{ from: 'them', d: a.d, t: a.t, text: a.x, ts: a.ts }] }; });
const totalUnread = () => Object.values(T).reduce((n, t) => n + t.unread, 0);
const lastOf = (th) => th.msgs[th.msgs.length - 1];

// ───────── S2 대화 스크립트 (docs/sessions/S02.md 3~4장, 문체: docs/narrative/dialogue-style.md) ─────────
// 같은 노드라도 문자와 통화는 문장이 다르다. m: 문자 버블 배열 / c: 통화 자막 한 줄
// say: 지훈 발화 / choice: 선택지 / branch: 모드별 분기 / end: 종료
const SAY = (m, c, extra = {}) => ({ type: 'say', m: [].concat(m), c, ...extra });
const CH = (opts, extra = {}) => ({ type: 'choice', opts: [...opts, { label: { m: '(전화한다)' }, switch: true }], ...extra });
const GOODNIGHT = () => ({ label: { m: '그래 알았다. 늦었는데 얼른 자라', c: '그래, 알았다. 늦었는데 얼른 자라.' }, then: [BYE, { type: 'end' }] });
const BYE = SAY(['네', '아저씨 도현이 소식 있으면 저한테도 꼭 알려주세요'], '네… 아저씨, 도현이 소식 있으면 저한테도 꼭 알려 주세요.');
const S2_SCRIPT = () => [
  // CH.S02.01 — 문자 첫 답장. 통화로 시작하면 아버지 첫 마디가 대신한다.
  CH([{ label: { m: '그래 지훈아 무슨 일이냐' } }], { opener: true }),
  SAY(['죄송해요 이 시간에', '나흘 내내 참았는데', '도저히 안 되겠어서요'], '죄송해요, 이 시간에… 나흘 내내 참았는데 도저히 안 되겠어서요.'),
  CH([
    { label: { m: '근데 왜 이제야 말하는 거냐', c: '근데… 왜 이제야 말하는 거냐.' },
      then: [SAY(['도현이가 아무한테도 말하지 말라고 해서요', '진짜 죄송해요'], '도현이가 아무한테도 말하지 말라고 해서요… 진짜 죄송해요.')] },
    { label: { m: '그래 연락 줘서 고맙다', c: '그래. 전화 줘서 고맙다.' },
      then: [SAY(['아니에요', '아 그리고 아저씨', '도현이가 아저씨 얘기 자주 했어요', '아저씨 걱정된다고'], '아니에요. 아, 그리고 아저씨… 도현이가 아저씨 얘기 자주 했어요. 아저씨 걱정된다고.', { kx: 'KX-02' })] },
  ]),
  SAY(['3월 들어서부터 좀 이상했어요', '밥 먹자 해도 잘 안 먹고', '폰만 계속 들여다보고', '잘 웃지도 않고요'],
    '3월 들어서부터 좀 이상했어요. 점심 먹자 해도 거르고, 폰만 계속 들여다보고… 잘 웃지도 않았고요.', { kn: 'K-01' }),
  CH([
    { label: { m: '그 전에는 괜찮았고?', c: '그 전에는? 그 전엔 괜찮았냐.' },
      then: [SAY(['사실 고1 겨울부터 좀 조용해지긴 했어요', '고2 땐 과외 알바 한다고 맨날 바빴고요', '근데 저는 그냥 원래 그런 앤 줄 알았어요'],
        '사실 고1 겨울부터 좀 조용해지긴 했어요. 고2 땐 과외 알바 한다고 맨날 바빴고요. 근데 저는 그냥 걔가 원래 그런 앤 줄 알았어요.')] },
    { label: { m: '폰을 계속 봤다고?', c: '폰을 계속 봤다고?' }, then: [
      SAY(['네 맨날 뭘 확인하더라고요'], '네, 맨날 뭘 확인하더라고요.'),
      CH([
        { label: { c: '혹시 도현이 폰 비밀번호 아냐?' }, call: true,
          then: [SAY([], '비번은 모르는데… 걔 맨날 가족 생일 같은 거 써요. 촌스럽다고 제가 놀렸었는데.', { kn: 'K-05' })] },
        { label: { m: '그래', c: '그래.' } },
      ]),
    ] },
  ]),
  SAY(['그리고 13일 밤에', '걔가 저 학원 앞으로 왔었어요', '갑자기 내일 끝난다고', '뭐가 끝나냐니까 대학 오기 전에 끝냈어야 했던 거래요', '그게 다였어요'],
    '13일 밤에 걔가 저 학원 앞으로 왔었어요. 갑자기 내일 끝난다고. 뭐가 끝나냐니까, 대학 오기 전에 끝냈어야 했던 거라고만 하고…', { kn: 'K-02' }),
  SAY(['대학 생활 어떠냐고 물어봤는데', '그냥 웃기만 했어요'], '대학 생활 어떠냐니까 그냥 웃기만 하더라고요.'),
  SAY(['아 그리고 준호요', '아랫집 사는 고2', '요즘 둘이 자주 붙어 다녔어요'], '아, 그리고 준호라고… 아랫집 사는 고2요. 요즘 걔랑 둘이 자주 붙어 다녔어요.', { kn: 'K-03' }),
  { type: 'branch', mode: 'call',
    then: [SAY([], "그리고 이건 좀 이상했는데… 걔가 누구랑 통화하면서 계속 '형, 형' 하더라고요. 걔 친형 없잖아요.", { kn: 'K-04' })],
    else: [SAY(['하나 더 있는데', '이건 전화로 말씀드릴게요'], '')] },
  CH([
    { label: { c: '대학 친구들한테는 물어봤냐?' }, call: true,
      then: [SAY([], '대학은 들어간 지 2주밖에 안 됐잖아요. 거기 애들은 도현이 잘 몰라요. 걔 아는 사람은 다 성원고에 있어요.'),
        SAY([], '아, 윤쌤… 상담 선생님 한번 찾아가 보세요. 졸업식 날 걔 상담실 들어가는 거 봤어요.', { kx: 'KX-04' }),
        CH([GOODNIGHT()])] },
    GOODNIGHT(),
  ]),
];
const FATHER_OPEN = '어, 지훈아. 아저씨다.';
const optLabel = (o) => (S.s2.mode === 'call' ? o.label.c : o.label.m) || o.label.m || o.label.c;
const visibleOpts = (it) => it.opts.filter((o) => (S.s2.mode === 'call' ? (o.label.c && !o.switch) : (o.label.m && !o.call)));

// ───────── 메시지 추가 ─────────
function addMsg(id, m, { banner = true } = {}) {
  const th = T[id];
  m.fresh = true;
  th.msgs.push(m);
  if (m.from === 'them') {
    const viewing = S.stack.length && S.stack[S.stack.length - 1].app === 'msg' && S.stack[S.stack.length - 1].id === id;
    if (!viewing) th.unread += 1;
    if (!viewing && banner) showBanner(th.name, m.text, id);
    if (viewing) S.autoBottom = true;
  } else {
    S.autoBottom = true;
  }
  refresh();
}
function showBanner(title, body, id) {
  S.banner = { title, body, id };
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

// ───────── 스레드 열기 (AV-01, S1→S2 트리거) ─────────
function openThread(id) {
  const th = T[id];
  if (!th) return;
  if (id === 'hangyeol' && !S.hangyeolOpened) {
    // AV-01: 첫 열람 시 1.2초 뒤 독백 → 자동으로 닫힘. 재열람은 닫히지 않는다.
    S.hangyeolOpened = true;
    S.flags['FX-02'] = true;
    th.divider = th.unread;
    th.unread = 0;
    nav(S.stack.length ? 'push' : 'open');
    S.stack = [{ app: 'msg', id: null }, { app: 'msg', id }];
    S.autoBottom = true;
    refresh();
    later(1200, () => {
      showMono('…나중에.');
      later(350, () => { if (S.stack.length) { nav('homeSlow'); S.stack = []; refresh(); } }, 'av01');
    }, 'av01');
    return;
  }
  if (!th.opened) { th.opened = true; th.unread = 0; }
  else th.unread = 0;
  if (id === 'jihoon') {
    S.jihoonOpened = true;
    clearGroup('nudge1');
    if (S.phase === 's1' && S.jihoonEventDone) startS2('msg');
  }
  nav(S.stack.length ? 'push' : 'open');
  if (!S.stack.length) S.stack.push({ app: 'msg', id: null });
  S.stack.push({ app: 'msg', id });
  S.autoBottom = true;
  refresh();
}

// ───────── S1 진행 ─────────
function startPrologue() {
  S.phase = 'prologue';
  refresh();
  playCine('CN-00', startS1);
}
function startS1() {
  S.phase = 's1';
  S.clock = [2, 47];
  S.unlocked = false;
  S.stack = [];
  S.navAnim = 'phoneup';                           // 복도 스틸 위로 폰이 올라온다 (S01.md 2장)
  refresh();
  later(10000, jihoonEvent, 'ev');                 // EV.S01.01: 잠금화면이 올라온 순간부터 실시간 10초
  later(90000, () => nudgeJihoon90(), 'nudge1');
  later(180000, () => nudgeJihoon180(), 'nudge1');
  later(300000, () => { if (S.phase === 's1') showMono('…지훈이.'); }, 'nudge1');
  later(450000, () => { if (S.phase === 's1' && !S.jihoonOpened) { S.unlocked = true; openThread('jihoon'); } }, 'nudge1');
}
function jihoonEvent() {
  if (S.jihoonEventDone || S.phase !== 's1') return;
  S.jihoonEventDone = true;
  const lines = ['아저씨 혹시 주무세요?', '도현이가 아무한테도 말하지 말랬는데요', '저 아저씨한테 할 말이 있어요'];
  lines.forEach((t, i) => later(i * 1000, () => {
    addMsg('jihoon', nowMsg('them', t));
    // 이미 지훈 스레드를 보고 있었다면 세 번째 문자가 도착한 순간이 '열람'이다
    const top = S.stack[S.stack.length - 1];
    if (i === lines.length - 1 && S.phase === 's1' && top && top.app === 'msg' && top.id === 'jihoon') startS2('msg');
  }));
  refresh();
}
function nudgeJihoon90() {
  if (S.phase !== 's1' || S.jihoonOpened) return;
  addMsg('jihoon', nowMsg('them', '아저씨?'));
}
function nudgeJihoon180() {
  if (S.phase !== 's1' || S.jihoonOpened || !S.jihoonEventDone) return;
  S.ov = { type: 'incoming', name: '정지훈(도현친구)', from: 'jihoon' };
  refresh();
}

// ───────── S2 진행 ─────────
function startS2(mode) {
  clearGroup('nudge1');
  S.phase = 's2';
  S.clock = [2, 50];
  S.s2 = { mode: 'msg', queue: S2_SCRIPT(), waiting: null, busy: false, typing: false, callFatherSaid: false };
  S.autoBottom = true;
  later(90000, () => { if (S.phase === 's2' && S.s2.mode === 'msg') addMsg('jihoon', nowMsg('them', '아저씨 보셨어요?')); }, 'nudge2');
  later(180000, () => {
    if (S.phase === 's2' && S.s2.mode === 'msg') {
      addMsg('jihoon', nowMsg('them', '제가 전화 드려도 될까요?'));
      S.ov = { type: 'incoming', name: '정지훈(도현친구)', from: 'jihoon' };
      refresh();
    }
  }, 'nudge2');
  if (mode === 'call') { S.s2.mode = 'call'; openCall('jihoon'); }
  else runQueue();
  refresh();
}
function runQueue() {
  const s = S.s2;
  if (S.phase !== 's2' || s.busy || s.waiting) return;
  let it = s.queue[0];
  if (!it) return endS2();
  if (it.type === 'choice' && it.opener && s.mode === 'call') { s.queue.shift(); return runQueue(); }
  if (it.type === 'choice') { s.waiting = it; refresh(); return; }
  s.queue.shift();
  if (it.type === 'branch') { s.queue.unshift(...(s.mode === 'call' ? it.then : it.else)); return runQueue(); }
  if (it.type === 'end') return endS2();
  if (it.type === 'say') {
    const text = s.mode === 'call' ? it.c : it.m[0];
    if (!text) { grant(it.kn); grant(it.kx); return runQueue(); }
    if (s.mode === 'msg' && it.m.length > 1) {
      // 문자는 버블 하나씩. K는 마지막 버블에 붙인다.
      const rest = { ...it, m: it.m.slice(1) };
      s.queue.unshift(rest);
      it = { ...it, kn: null, kx: null };
    }
    it.text = text;
    s.busy = true;
    s.typing = s.mode === 'msg';
    refresh();
    // 지훈은 문자를 빨리 친다(버블 간 0.6~1.4초). 통화 자막은 말하는 길이만큼.
    const wait = s.mode === 'msg' ? 500 + Math.min(900, text.length * 22) : 700 + text.length * 30;
    later(wait, () => {
      s.busy = false;
      s.typing = false;
      deliverSay(it);
      runQueue();
    }, 'q');
  }
}
function deliverSay(it) {
  grant(it.kn); grant(it.kx);
  if (S.s2.mode === 'call') S.call.lines.push({ who: 'j', text: it.text });
  else addMsg('jihoon', nowMsg('them', it.text));
}
function deliverMe(text) {
  if (S.s2.mode === 'call' && S.call) S.call.lines.push({ who: 'me', text });
  else addMsg('jihoon', nowMsg('me', text));
}
function choose(i) {
  const s = S.s2;
  const it = s.waiting;
  if (!it) return;
  const opt = visibleOpts(it)[i];
  if (!opt) return;
  if (opt.switch) {
    // 같은 질문을 전화로 이어 간다: 선택지 지점은 유지되고, 통화에서는 통화 전용 선택지가 더 보인다.
    deliverMe('잠깐 전화할게');
    return switchToCall();
  }
  s.waiting = null;
  const idx = s.queue.indexOf(it);
  if (idx >= 0) s.queue.splice(idx, 1);
  if (S.ov && S.ov.type === 'choices') S.ov = null;
  deliverMe(optLabel(opt));
  s.queue.unshift(...(opt.then || []));
  runQueue();
  refresh();
}
function switchToCall() {
  if (S.phase !== 's2' || S.s2.mode === 'call') return;
  if (S.ov && S.ov.type === 'choices') S.ov = null;
  S.s2.mode = 'call';
  S.flags['FX-01'] = true;
  openCall('jihoon');
  refresh();
}
function endS2() {
  if (S.phase !== 's2') return;
  S.phase = 's2end';
  clearGroup('nudge2'); clearGroup('q');
  S.s2.waiting = null;
  if (S.call) S.call = null;
  if (S.ov && (S.ov.type === 'call' || S.ov.type === 'choices' || S.ov.type === 'incoming')) S.ov = null;
  refresh();
  later(2000, () => {
    showMono('성원고.');
    S.nav.push('성원고');
    S.flags['MO.02'] = true;
  }, 'end');
  later(4300, () => {
    S.clock = [3, 30];
    playCine('CN-01', () => {
      S.clock = [8, 40]; S.stack = []; S.unlocked = false; S.phase = 'done';
      S.navAnim = 'phoneup';
      refresh();
      later(1600, () => { S.ov = { type: 'done' }; refresh(); }, 'end');
    });
  }, 'end');
}

// ───────── 통화 ─────────
function openCall(kind, name) {
  S.call = { kind, name: name || '정지훈(도현친구)', state: 'ring', since: Date.now(), lines: [], deadText: '' };
  S.ov = { type: 'call' };
  later(1400, () => {
    if (!S.call) return;
    S.call.state = 'talk';
    S.call.since = Date.now();
    if (kind === 'jihoon' && S.s2.mode === 'call' && !S.s2.callFatherSaid) {
      S.s2.callFatherSaid = true;
      S.call.lines.push({ who: 'me', text: FATHER_OPEN });
    }
    if (kind === 'jihoon') runQueue();
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
function dial(num) {
  const c = ctByNum(num);
  const kind = c ? c.kind : 'none';
  const name = c ? c.name : num;
  if (kind === 'dohyun') return openDead(name, '전원이 꺼져 있거나 신호가 없는 곳에 있을 수 있습니다.', 1500);
  if (kind === 'block') { S.ov = { type: 'block', name }; return refresh(); }
  if (kind === 'jihoon') {
    if (S.phase === 's1' && S.jihoonEventDone) return startS2('call');
    if (S.phase === 's2' && S.s2.mode === 'msg') return switchToCall();
    if (S.phase === 's2' && S.s2.mode === 'call') return;
    return openDead(name, '받지 않습니다.', 2000);
  }
  return openDead(name, '받지 않습니다.', 2000);
}
function endCall() {
  const c = S.call;
  S.call = null;
  S.ov = null;
  if (c && c.kind === 'jihoon' && S.phase === 's2' && S.s2.mode === 'call') {
    S.s2.mode = 'msg';
    addMsg('jihoon', { from: 'sys', text: `통화 종료 · ${fmtDur(Date.now() - c.since)}`, d: '2026년 3월 18일 (수)', t: clockStr(), ts: nowTs() }, { banner: false });
    runQueue();
  }
  refresh();
}

// ───────── 화면 전환 ─────────
// 현재 화면을 복제해 떠나는 애니메이션을 주고(ghost), 새 화면에는 들어오는 애니메이션을 준다.
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

// ───────── 스틸컷 시네마틱 (docs/ui/cinematics.md) ─────────
const IMG = { hall_night: 'img/hall_night.jpg' };
const CINE = {
  'CN-00': { skip: true, cuts: [
    { text: '2026년 3월 18일 수요일', dur: 2800 },
    { img: 'hall_night', origin: '50% 55%', from: 'scale(1.02)', to: 'scale(1.1) translateY(1%)', dur: 5600,
      cap: ['토요일 저녁, 늦는다는 문자를 끝으로 아들 도현은 집에 돌아오지 않았다.', '스무 살. 대학에 들어간 지 2주 만이었다.'] },
    { img: 'hall_night', origin: '47% 74%', from: 'scale(2.2)', to: 'scale(2.35)', dur: 4200, stamp: '02:47',
      cap: ['나흘째 되는 밤. 아버지 이상철은 아들 방 앞에 서 있다.', '손에 쥔 폰이, 지금 그가 가진 전부다.'] },
  ] },
  'CN-01': { skip: true, cuts: [
    { img: 'hall_night', origin: '47% 74%', from: 'scale(2.35)', to: 'scale(1.7)', dur: 4200, stamp: '03:30',
      cap: ['그 뒤로도 잠은 오지 않았다.'] },
    { roll: ['03:30', '08:40'], dur: 2800 },
    { img: 'hall_night', filter: 'morning', origin: '50% 55%', from: 'scale(1.0)', to: 'scale(1.06)', dur: 4400, stamp: '08:40',
      cap: ['아침이 왔다. 방문은 여전히 닫혀 있다.', '도현이 3년을 다닌 학교, 성원고로 간다.'] },
  ] },
};
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function playCine(id, done) {
  const c = CINE[id];
  S.cine = { id, i: -1, done };
  S.flags[id] = true;
  const el = $('#cine');
  el.className = 'cine show';
  el.innerHTML = `${c.skip ? '<button class="skip" data-act="skipCine">건너뛰기</button>' : ''}<div class="tap">탭하면 다음 장면</div>`;
  el.dataset.act = 'cineTap';
  nextCut();
}
// 자막 타이밍: 첫 줄 0.8초, 다음 줄은 앞 줄을 읽을 시간 뒤(최소 1.4초). 컷은 마지막 줄을 읽을 시간까지 늘어난다.
const readMs = (t) => 1200 + t.length * 60;
function capTimes(cut) {
  const at = [];
  (cut.cap || []).forEach((t, i) => at.push(i ? at[i - 1] + Math.max(1400, readMs(cut.cap[i - 1]) - 300) : 800));
  const end = at.length ? at[at.length - 1] + readMs(cut.cap[cut.cap.length - 1]) : 0;
  return { at, dur: Math.max(cut.dur, end + 1000) };
}
function cineTap() {
  // 아직 안 나온 자막이 있으면 먼저 다 띄우고, 다음 탭에 넘어간다
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
    kb.style.backgroundImage = `url(${IMG[cut.img]})`;
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
    const t0 = performance.now(); const span = Math.min(1900, cut.dur - 600) / SPEED;
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
  done();
  el.classList.add('out');
  setTimeout(() => { el.className = 'cine'; el.innerHTML = ''; }, 820);
}

// ───────── 렌더: 상태바 ─────────
function renderStatus() {
  const el = $('#status');
  const hide = ['notice', 'title', 'prologue'].includes(S.phase);
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
  const apps = APPS.map((a) => `<div class="app" data-act="open" data-app="${a.id}"><div class="icon" style="background:${a.bg}">${a.dark ? '' : ''}${ICON[a.id] || ''}</div><span>${a.label}</span></div>`).join('');
  const dock = `
    <div class="icon" style="background:linear-gradient(#5EE07A,#2DBE4E)" data-act="open" data-app="phone">${ICON.phone}<b class="badge">47</b></div>
    <div class="icon" style="background:linear-gradient(#5EE07A,#2DBE4E)" data-act="open" data-app="msg">${ICON.msg}${totalUnread() ? `<b class="badge">${totalUnread()}</b>` : ''}</div>
    <div class="icon" style="background:linear-gradient(#A8ADB5,#6F757E)" data-act="open" data-app="camera">${ICON.camera}</div>`;
  return `
  <div class="apps">${apps}</div>
  <div class="search"><svg viewBox="0 0 12 12"><circle cx="5" cy="5" r="3.6"/><path d="M7.7 7.7 11 11"/></svg>검색</div>
  <div class="dock">${dock}</div>`;
}
function noticeHTML() {
  return `<div class="notice"><div><p>이 게임에는 약물 범죄, 채무, 실종을 다루는 내용이 포함되어 있습니다.</p><p>소리를 켜고, 이어폰을 권합니다.</p><button data-act="noticeOk">계속</button></div></div>`;
}
function titleHTML() {
  return `<div class="title"><div><h1>DONTKNOW</h1><p>튜토리얼 프로토타입 · S1–S2<br>아버지의 폰에서 시작한다</p><button data-act="start">시작</button></div></div>`;
}
function headerHTML(title, { left = '', right = '', back = true } = {}) {
  return `<div class="hdr"><div class="lft" ${back ? 'data-act="back"' : ''}>${back ? '<svg viewBox="0 0 12 21"><path d="M10 2 2 10.5l8 8.5"/></svg>' : ''}${esc(left)}</div><h1>${esc(title)}</h1><div class="rgt">${right}</div></div>`;
}

// 메시지 앱
function msgListHTML() {
  const ids = Object.keys(T).filter((id) => T[id].msgs.length).sort((a, b) => lastOf(T[b]).ts.localeCompare(lastOf(T[a]).ts));
  const rows = ids.map((id) => {
    const th = T[id]; const lm = lastOf(th);
    return `<div class="row" data-act="thread" data-id="${id}">
      <span class="dot ${th.unread ? '' : 'off'}"></span>
      <div class="av2" style="grid-column:2;display:none"></div>
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
  if (id === 'jihoon' && S.s2.typing && S.s2.mode === 'msg') body += `<div class="row-msg"><div class="bub typing"><i></i><i></i><i></i></div></div>`;
  const contact = CT.find((c) => c.th === id);
  const right = contact && contact.kind !== 'none' ? `<span data-act="dial" data-num="${contact.num}" style="display:grid;place-items:center;width:30px;height:30px">${ICON.phone.replace('<svg', '<svg style="width:22px;height:22px;stroke:none"')}</span>` : '';
  let field = '…'; let ready = false; let act = '';
  if (th.reply === 's2' && S.phase === 's2' && S.s2.waiting && S.s2.mode === 'msg') { field = '탭해서 답장'; ready = true; act = `data-act="compose" data-id="${id}"`; }
  if (th.reply === 's2' && S.phase === 's2' && S.s2.mode === 'call') field = '통화 중';
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
      <span></span><button class="call" data-act="keycall">${ICON.phone.replace('<svg', '<svg style="width:30px;height:30px;stroke:none;fill:#fff"')}</button><span></span></div></div>`;
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
    return `<div class="view" style="background:#fff">${headerHTML('길찾기')}
      <div class="map"><svg viewBox="0 0 390 330" preserveAspectRatio="xMidYMid slice">
        <rect width="390" height="330" fill="#E8ECEF"/>
        <path d="M0 110H390M0 240H390M90 0V330M250 0V330" stroke="#fff" stroke-width="14"/>
        <path d="M40 40h40v50H40zM150 150h60v60h-60zM290 40h60v40h-60z" fill="#D4E8D8"/>
        <path d="M70 260 L160 200 L200 130 L330 60" fill="none" stroke="#E39A3B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="70" cy="260" r="9" fill="#0A7CFF" stroke="#fff" stroke-width="3"/>
        <path d="M330 40c-9 0-15 6-15 14 0 10 15 26 15 26s15-16 15-26c0-8-6-14-15-14z" fill="#FF3B30"/>
      </svg>
      <div class="route-card"><div class="t">${S.nav.includes('성원고') && S.nav[S.nav.length - 1] === '성원고' ? '성원고' : '집'}까지 도보 18분</div><div class="s">경로 안내는 다음 단계에서 이동 시스템과 함께 붙는다</div><button class="gobtn" data-act="startnav">안내 시작</button></div></div></div>`;
  }
  const dests = S.nav.filter((d) => d !== '집').map((d) => `<div class="row" data-act="route" style="grid-template-columns:1fr auto"><div class="txt"><div class="n">${esc(d)}</div><div class="p">최근 목적지</div></div></div>`).join('');
  return `<div class="view" style="background:#fff">${headerHTML('길찾기', { back: false })}<div class="scroll list">
    <div class="section-h">현재 위치</div><div class="row" style="grid-template-columns:1fr"><div class="txt"><div class="n">집</div><div class="p">02:47 · 도현이 방 앞 복도</div></div></div>
    <div class="section-h">목적지</div>${dests || '<div class="empty">아직 등록된 목적지가 없습니다.</div>'}
    ${S.nav.length > 1 ? `<div class="row" data-act="route" style="grid-template-columns:1fr"><div class="txt"><div class="n" style="color:var(--blue)">${esc(S.nav[S.nav.length - 1])}까지 경로 보기</div></div></div>` : ''}
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
  return `<div class="view" style="background:#fff">${headerHTML('톡', { back: false })}<div class="scroll"><div class="section-h">친구</div><div class="row" style="grid-template-columns:1fr"><div class="txt"><div class="n">나</div><div class="p">상태 메시지 없음</div></div></div><div class="empty">대화가 없습니다.</div></div></div>`;
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
    case 'talk': return talkHTML();
    case 'settings': return settingsHTML();
    case 'camera': return cameraHTML();
    default: return msgListHTML();
  }
}

// ───────── DOM 패치 ─────────
// innerHTML 통째 교체 대신 바뀐 노드만 고친다. 그대로인 요소는 살아남아서
// 등장 애니메이션(통화 화면, 배너, 잠금화면 카드)이 다시 재생되지 않는다.
// data-k가 있으면 키로 짝을 맞춘다(자막 줄, 오버레이 부품, 뷰).
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
  if (S.phase === 'notice') html = noticeHTML();
  else if (S.phase === 'title') html = titleHTML();
  else if (S.phase === 'prologue') html = '<div class="blackfill"></div>';
  else if (!S.unlocked) { html = `<div class="lock" data-k="lock" style="position:absolute;inset:0">${lockHTML()}</div>`; cls = 'lock'; }
  else if (!S.stack.length) { html = `<div class="home" data-k="home" style="position:absolute;inset:0">${homeHTML()}</div>`; cls = 'home'; }
  else { const tp = S.stack[S.stack.length - 1]; html = `<div class="view-wrap" data-k="v-${S.stack.length}-${tp.app}-${tp.id ?? ''}" style="position:absolute;inset:0;background:#fff">${appView(S.stack[S.stack.length - 1])}</div>`; }
  screen.className = `screen ${cls}`;
  if (root._h !== html) {
    // 화면 이동은 새로 그리고(전환 애니메이션), 같은 화면 안의 변화는 패치한다
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
  const w = S.s2.waiting;
  if (c.state === 'talk' && c.kind === 'jihoon' && S.s2.mode === 'call' && w) {
    choices = `<div class="lbl">대답</div><div class="ch">${visibleOpts(w).map((o, i) => `<button class="opt" data-act="choose" data-i="${i}">${esc(optLabel(o))}</button>`).join('')}</div>`;
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
    if (ov.type === 'choices' && S.s2.waiting) {
      h += `<div class="scrim" data-act="closeov"></div><div class="sheet"><div class="grab"></div><h3>답장</h3><div class="group">${visibleOpts(S.s2.waiting).map((o, i) => `<button class="opt blue" data-act="choose" data-i="${i}">${esc(optLabel(o))}</button>`).join('')}</div><button class="cancel" data-act="closeov">취소</button></div>`;
    }
    if (ov.type === 'quick') {
      h += `<div class="scrim" data-act="closeov"></div><div class="sheet"><div class="grab"></div><h3>답장</h3><div class="group">${T.dispatch.quick.map((q, i) => `<button class="opt blue" data-act="quick" data-i="${i}">${esc(q)}</button>`).join('')}</div><button class="cancel" data-act="closeov">취소</button></div>`;
    }
    if (ov.type === 'block') h += `<div class="scrim" data-act="closeov"></div><div class="sheet"><div class="grab"></div><h3>차단된 번호</h3><div class="note-box">${esc(ov.name)}은(는) 차단 목록에 있어 전화를 걸 수 없습니다. 설정 › 차단된 번호에서 해제할 수 있습니다.</div><div class="group" style="margin-top:12px"><button class="opt blue" data-act="closeov" style="justify-content:center">확인</button></div></div>`;
    if (ov.type === 'done') h += `<div class="scrim" data-act="closeov"></div><div class="sheet"><div class="grab"></div><h3>튜토리얼 끝</h3><div class="note-box">S1·S2 까지 진행했습니다. S3는 아직 없습니다. 앱은 계속 둘러볼 수 있습니다.</div><div class="group" style="margin-top:12px"><button class="opt blue" data-act="closeov" style="justify-content:center">계속 둘러보기</button><button class="opt red" data-act="reset" style="justify-content:center">처음부터</button></div></div>`;
  }
  if (el._h !== h) { morph(el, h); el._h = h; }
}

function renderDebug() {
  const d = $('#debug');
  if (!DEBUG) { d.hidden = true; return; }
  d.hidden = false;
  const know = Object.keys(S.know).join(', ') || '없음';
  const flags = Object.keys(S.flags).join(', ') || '없음';
  d.innerHTML = `<b>디버그</b> · 배속 ${SPEED}×<br>
    phase: <b>${S.phase}</b> · mode: <b>${S.s2.mode}</b><br>
    queue: ${S.s2.queue.length} · waiting: ${S.s2.waiting ? 'yes' : 'no'} · busy: ${S.s2.busy}<br>
    clock: ${clockStr()} · unread: ${totalUnread()}<br>
    know: <b>${know}</b><br>flags: ${flags}<br>
    jihoon: opened ${S.jihoonOpened}, event ${S.jihoonEventDone}<br>
    nav: ${S.nav.join(' / ')}<br>
    <button data-act="reset">처음부터</button>`;
}

// 통화 시간은 글자만 바꾼다. 오버레이 전체를 다시 그리면 화면이 깜빡인다.
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
function act(name, el) {
  switch (name) {
    case 'noticeOk': S.phase = 'title'; return refresh();
    case 'start': return startPrologue();
    case 'skipCine': return endCine();
    case 'cineTap': return cineTap();
    case 'reset': return location.reload();
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
      if (T[id].reply === 'quick') { S.ov = { type: 'quick' }; return refresh(); }
      if (S.s2.waiting && S.s2.mode === 'msg') { S.ov = { type: 'choices' }; return refresh(); }
      return;
    }
    case 'choose': return choose(Number(el.dataset.i));
    case 'quick': {
      const q = T.dispatch.quick[Number(el.dataset.i)];
      S.ov = null;
      addMsg('dispatch', nowMsg('me', q));
      return;
    }
    case 'closeov': return closeOv();
    case 'dial': return dial(el.dataset.num);
    case 'accept': {
      S.ov = null;
      if (S.phase === 's1' && S.jihoonEventDone) return startS2('call');
      if (S.phase === 's2' && S.s2.mode === 'msg') return switchToCall();
      return refresh();
    }
    case 'decline': if (S.ov && S.ov.type === 'incoming') closeOv(); return;
    case 'hangup': return endCall();
    case 'bannerTap': {
      const id = el.dataset.id;
      S.banner = null;
      if (id) { if (!S.unlocked) { nav('unlock'); S.unlocked = true; S.stack = []; } return openThread(id); }
      return refresh();
    }
    case 'tab': S.tab = el.dataset.tab; return refresh();
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
    case 'startnav': return showMono('(경로 안내는 다음 빌드에서 연결됩니다)');
    case 'route': nav('push'); S.stack.push({ app: 'map', id: 'route' }); return refresh();
    case 'open-route': return;
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
$('#screen').addEventListener('pointerdown', (e) => { if (['s1', 's2', 's2end', 'done'].includes(S.phase) && !S.unlocked && !S.cine) dragY = e.clientY; });
$('#screen').addEventListener('pointerup', (e) => {
  if (dragY !== null && e.clientY - dragY < -50) act('unlock');
  dragY = null;
});

document.addEventListener('input', (e) => { if (e.target.id === 'memo-input') S.memoDraft = e.target.value; });

// 화면 맞춤 (데스크톱에서 기기 크기 조정)
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
fitDevice();

S.phase = 'notice';
refresh();

// 테스트 훅 (디버그 시에만)
if (DEBUG) window.__tut = { S, T, choose, startPrologue, refresh, playCine };
})();
