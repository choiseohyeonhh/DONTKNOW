/* DONTKNOW — 두 번째 기기: 도현의 옛 폰 (P4)
   엔진(engine.js)은 건드리지 않고, #screen 위에 기기 레이어를 얹는다.
   공개 API: window.OldPhone = { mount, render, act, seen, mark, onSeen, onVoiceEnd,
     setDevice, forceUnlock, beginBoot, show, lastView, notifyHangyeol, state } */
(() => {
  'use strict';
  const G = window.__game || window.DK;
  if (!G) { console.error('[DONTKNOW] oldphone: engine missing'); return; }

  const Q = new URLSearchParams(location.search);
  const SPEED = Math.max(0.01, Number(Q.get('speed')) || 1);
  const $ = (s, el = document) => el.querySelector(s);
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const h12 = (h) => { const a = h < 12 ? '오전' : '오후'; let x = h % 12; if (!x) x = 12; return `${a} ${x}`; };
  const clock12 = (c = G.S.clock) => `${h12(c[0])}:${pad(c[1])}`;
  const now = () => Date.now();
  const fmtTime = (s) => { const [h, m] = s.split(':').map(Number); return `${h12(h)}:${pad(m)}`; };
  const fmtDate = (s) => { const [y, mo, d] = s.slice(0, 10).split('-').map(Number); return `${y}. ${mo}. ${d}.`; };

  // ───────── 데이터 ─────────
  const THREADS = {
    dad: {
      id: 'dad', name: '아빠', draft: true, preview: '아빠, 나 사실...', date: '2026. 3. 13.', time: '오후 11:58',
      msgs: [],
    },
    hyung: {
      id: 'hyung', name: '형', preview: '오늘 정리하자. 전화해', date: '2026. 3. 14.', time: '오후 6:39',
      msgs: [
        ['2024-05-11 21:14', 'them', '준호 일은 내가 정리할게. 대신 너 머리 좀 빌리자.'],
        ['2024-05-11 21:20', 'me', '얼마 주실 건데요.'],
        ['2024-05-11 21:21', 'them', '하는 거 봐서. 처음엔 확인만 해'],
        ['2024-08-31 23:02', 'them', '이번 달 숫자 맞다. 수고했다'],
        ['2024-11-29 22:47', 'them', '7개월 동안 하나도 안 틀렸네'],
        ['2024-11-29 22:48', 'them', '다음 달부터 장부 네가 봐'],
        ['2025-02-27 23:30', 'me', '정리한 거 보냈어요'],
        ['2025-02-27 23:41', 'them', '이거 나보다 낫네'],
        ['2025-03-03 21:10', 'them', '이제 애들 일정도 네가 짜'],
        ['2025-04-06 22:15', 'me', '화요일은 제가 J랑 같이 갑니다'],
        ['2025-04-06 22:16', 'them', '니가 왜 가'],
        ['2025-04-06 22:16', 'me', '같이 갑니다'],
        ['2025-09-30 23:05', 'them', '이번 달도 깔끔하다'],
        ['2025-12-19 16:40', 'me', '형 저 붙었어요. 이제 그만할게요'],
        ['2025-12-19 17:02', 'them', '축하한다. 입학 전까지만 정리해. 갑자기 빠지면 애들 다쳐'],
        ['2026-01-31 23:20', 'me', '1월 정리 끝났어요'],
        ['2026-02-11 20:10', 'them', '졸업 축하한다'],
        ['2026-02-27 23:15', 'me', '2월까지 다 정리했어요. 인수인계 자료 만들어 둘게요'],
        ['2026-02-27 23:40', 'them', '3월에 보자'],
        ['2026-03-10 22:14', 'me', '형 그만둘게요. 준호도 빼주세요. 대신 아빠한테는 비밀로 해주세요'],
        ['2026-03-10 22:31', 'them', '알겠다. 대신 내가 부를 때 와라'],
        ['2026-03-14 18:39', 'them', '오늘 정리하자. 전화해'],
      ],
    },
    junho: {
      id: 'junho', name: '준호', preview: '제발', date: '2026. 3. 15.', time: '오전 1:52',
      msgs: [
        ['2024-05-12 00:31', 'them', '형 나 무서워'],
        ['2024-05-12 00:33', 'me', '괜찮아. 내가 할게. 너는 이제 하지 마.'],
        ['2025-04-07 23:10', 'me', '내일 같이 가자. 혼자 가지 마'],
        ['2025-04-07 23:12', 'them', '응'],
        ['2025-11-18 21:40', 'them', '형 나 언제까지 해'],
        ['2025-11-18 22:05', 'me', '조금만. 내가 빼줄게'],
        ['2026-03-10 22:50', 'me', '준호야 형한테 말했어. 너도 이제 끝이야'],
        ['2026-03-10 22:51', 'them', '진짜??'],
        ['2026-03-10 22:51', 'them', '그형이 빼준대?'],
        ['2026-03-10 22:53', 'me', '응'],
        ['2026-03-14 21:02', 'them', '형 전화 안받아?'],
        ['2026-03-15 01:52', 'them', '형 누가 우리집 왓어'],
        ['2026-03-15 01:52', 'them', '제발'],
      ],
    },
    yujin: {
      id: 'yujin', name: '유진 누나', preview: '누나 나 오늘 형한테 말했어요', date: '2026. 3. 10.', time: '오후 10:40',
      msgs: [
        ['2024-05-10 19:20', 'them', '형이 너 한번 보재. 내일'],
        ['2024-05-10 19:31', 'me', '준호는 진짜 빼주는 거죠'],
        ['2024-05-10 19:40', 'them', '그건 형한테 물어봐'],
        ['2025-08-14 01:12', 'me', '누나도 언젠가 여기서 나가요'],
        ['2025-08-14 01:12', 'me', '나 나가면 누나도'],
        ['2025-08-14 01:30', 'them', '넌 나갈 수 있겠지'],
        ['2026-03-10 22:40', 'me', '누나 나 오늘 형한테 말했어요'],
      ],
    },
  };

  const MEMOS = [
    {
      id: 'MM.o.remaining', title: '남은 거', date: '2026. 2. 25. 오후 11:11',
      lines: [
        '남은 거',
        '목표: 내가 4천',
        '',
        '2024.08  74,200,000',
        '2024.09  73,000,000',
        '2024.10  71,200,000',
        '2024.11  69,200,000',
        '2024.12  68,000,000',
        '2025.01  65,900,000',
        '2025.02  63,800,000',
        '2025.03  61,500,000',
        '2025.04  59,200,000',
        '2025.04 — 약국 시작. 이제 좀 빨라짐',
        '2025.05  56,600,000',
        '2025.06  53,800,000',
        '2025.07  51,800,000',
        '2025.08  49,000,000',
        '2025.09  46,000,000',
        '2025.10  43,000,000',
        '2025.11  40,500,000',
        '2025.12  37,200,000',
        '2026.01  34,700,000',
        '2026.02  31,400,000',
        '',
        '대학 가기 전에 반은 하고 싶었는데',
      ],
    },
    {
      id: 'MM.o.april_schedule', title: '4월 일정', date: '2025. 4. 5.',
      lines: [
        '4월 일정',
        '',
        '새봄  화  8 · 22 · 29   13:00  J',
        'ㅈㅁ  수  2 · 16 · 30   16:30  J',
        'ㅍㄹ  목  10 · 24       16:30  J',
        'ㅎㄴ  금  4 · 18        17:00  J',
        '',
        'J 혼자 보내지 말 것. 무조건 같이.',
      ],
    },
    { id: 'MM.o.jachui', title: '자취', date: '2025. 7. 8.', lines: ['보증금 1,000 / 2학기 / 학교 근처 / 아빠한테는 기숙사라고'] },
    { id: 'MM.o.april3', title: '4/3', date: '2026. 3. 2.', lines: ['아빠 생일'] },
  ];

  const TRANSCRIPT = [
    { s: 0, e: 8, x: '(숨소리) …아빠. 이거 연습이야. 직접은 못 할 것 같아서.' },
    { s: 8, e: 22, x: '나 고1 때, 그 아저씨들 집에 왔을 때 나 있었어. 한결캐피탈. 아빠 없을 때.' },
    { s: 22, e: 36, x: '그날 밤에 아빠가 밥 먹었냐고 물어봤잖아. 나 응이라고 했어. 그게 다였어. 2년 넘게.' },
    { s: 36, e: 46, x: '화 안 났어. 진짜로. 그냥… 아빠 혼자 그거 하고 있는 게 싫었어.' },
    { s: 46, e: 58, x: '그래서 나도 좀 했어. 아빠 모르게. 고2 때부터. 그게, 좋은 방법은 아니었어.' },
    { s: 58, e: 71, x: '처음엔 준호 때문이었는데, 나중엔… 나중엔 내가 잘하더라. 그게 제일 무서웠어.' },
    { s: 77, e: 92, x: '대학 붙었잖아. 이제 다 그만할 거야. 다 정리하고, 그 다음에 말할게.' },
    { s: 92, e: 101, x: '아빠 생일 전에. 4월 3일 전에.' },
    { s: 101, e: 107, x: '…아 이거 너무 이상하다. 다시 할게.' },
  ];
  const VM_DUR = 107;

  // 19건 입금 캡처 — 한결 문자 스레드(DATA.hangyeol)의 입금 확인과 1:1
  function buildReceipts() {
    const src = (window.DATA && window.DATA.hangyeol) || [];
    const out = [];
    src.forEach((m, i) => {
      const hit = /([0-9][0-9,]+)원 입금 확인/.exec(m.x || '');
      if (!hit) return;
      out.push({
        id: `PH.o.receipt_${pad(out.length + 1)}`,
        kind: 'receipt', amount: Number(hit[1].replace(/,/g, '')),
        date: m.d, time: m.t, ts: m.ts || '',
        label: `${fmtDateFromTs(m.ts)}`, index: i,
      });
    });
    return out;
  }
  function fmtDateFromTs(ts) {
    if (!ts || ts.length < 8) return '';
    return `${ts.slice(0, 4)}. ${Number(ts.slice(4, 6))}. ${Number(ts.slice(6, 8))}.`;
  }

  const PHOTO_DOCS = [
    { id: 'PH.o.balance_notice_2602', kind: 'photo', src: 'img/photo_balance_notice_3.jpg', date: '2026. 2. 26.', cap: '잔여원금 안내', ts: '20260226' },
    { id: 'PH.o.sleeping_father', kind: 'photo', src: 'img/wall_sleeping_father.jpg', date: '2025. 12. 20. 오전 2:10', cap: '', ts: '20251220', warm: true },
    { id: 'PH.o.balance_notice_2504', kind: 'photo', src: 'img/photo_balance_notice_2.jpg', date: '2025. 4. 3.', cap: '잔여원금 안내', ts: '20250403' },
    { id: 'PH.o.balance_notice_2408', kind: 'photo', src: 'img/photo_balance_notice_1.jpg', date: '2024. 8. 3.', cap: '상환 내역 및 잔여원금 안내', ts: '20240803' },
    { id: 'PH.o.dunning_mail', kind: 'photo', src: 'img/photo_dunning_mail.jpg', date: '2023. 11. 22.', cap: '독촉 우편', ts: '20231122' },
  ];

  const PHOTOS = () => {
    const receipts = buildReceipts();
    return [...PHOTO_DOCS, ...receipts].sort((a, b) => String(b.ts).localeCompare(String(a.ts)));
  };

  // ───────── 상태 ─────────
  const OP = {
    mounted: false,
    device: 'father',
    boot: 'off',          // off | battery | charging | boot | lock | silence | unlocked
    unlocked: false,
    view: 'home',         // home | msg | thread | memo | memoDetail | recorder | photos | photo | calc
    thread: null,
    memo: null,
    photo: null,
    digits: '',
    fails: 0,
    hint: false,
    delayUntil: 0,
    delayOnce: false,
    shakeUntil: 0,
    vm: { t: 0, playing: false, ended: false },
    seen: {},
    seenCbs: [],
    voiceCbs: [],
    lastPhoto: null,
    switches: 0,
    everBooted: false,
    calc: { disp: '0', acc: null, op: null, fresh: true },
    scrollBottom: false,
    scrollTo: null,
    threadScroll: {},
    preview: null,
  };

  // ───────── morph (engine과 같은 규칙) ─────────
  function morph(parent, html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    patchKids(parent, tpl.content);
  }
  const keyOf = (n) => (n.nodeType === 1 ? n.getAttribute('data-k') : null);
  const sameNode = (x, y) => x.nodeType === y.nodeType && x.nodeName === y.nodeName && keyOf(x) === keyOf(y);
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

  // ───────── seen / K ─────────
  function mark(id, know) {
    if (!id) return;
    const first = !OP.seen[id];
    OP.seen[id] = true;
    if (first && know) {
      const list = Array.isArray(know) ? know : [know];
      list.forEach((k) => { if (k) G.grant(k); });
    }
    if (OP.seen['MM.o.remaining'] && OP.seen['TH.f.hangyeol_sms'] && !G.has('K-20')) G.grant('K-20');
    if (first) {
      OP.seenCbs.forEach((fn) => { try { fn(id); } catch (e) { console.error(e); } });
    }
  }
  function seen(id) { return !!OP.seen[id]; }
  function onSeen(fn) { if (typeof fn === 'function') OP.seenCbs.push(fn); return () => { OP.seenCbs = OP.seenCbs.filter((f) => f !== fn); }; }
  function onVoiceEnd(fn) { if (typeof fn === 'function') OP.voiceCbs.push(fn); return () => { OP.voiceCbs = OP.voiceCbs.filter((f) => f !== fn); }; }

  // ───────── 공통 렌더 ─────────
  function statusHTML() {
    const charge = OP.boot === 'charging' || OP.boot === 'boot';
    const lvl = OP.boot === 'battery' ? 0 : 63;
    return `<div class="op-status" data-k="op-status">
      <span class="op-clock12">${clock12()}</span>
      <span class="op-svc">서비스 없음</span>
      <span class="op-bat"><i style="width:${Math.max(2, Math.round(lvl / 100 * 20))}px"></i>${charge ? '⚡' : ''}${lvl}%</span>
    </div>`;
  }
  function appHeader(title, back = true) {
    return `<div class="op-hdr" data-k="op-hdr">
      <button class="op-lft" ${back ? 'data-op="op-back"' : ''} aria-label="뒤로">${back ? '<svg viewBox="0 0 12 21"><path d="M10 2 2 10.5l8 8.5"/></svg>' : ''}</button>
      <h1>${esc(title)}</h1><span class="op-rgt"></span></div>`;
  }
  const svgMsg = '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H10l-6 4z"/></svg>';
  const svgMemo = '<svg viewBox="0 0 24 24"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>';
  const svgVoice = '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6"/></svg>';
  const svgPhotos = '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 17 5-5 4 4 3-3 4 4"/></svg>';
  const svgCalc = '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h.1M8 15h2M12 15h2M16 15h.1M8 18h2M12 18h2M16 18h.1"/></svg>';

  function offHTML() {
    return `<div class="op-off" data-k="op-off">
      <div class="op-phone-outline"><div class="op-phone-screen"></div></div>
      <div class="op-off-hint">전원이 꺼져 있다</div>
      <button class="op-primary" data-op="op-power">전원</button>
    </div>`;
  }
  function batteryHTML() {
    return `<div class="op-off" data-k="op-battery">
      <div class="op-battery-low"><svg viewBox="0 0 48 24"><rect x="2" y="4" width="40" height="16" rx="4"/><path d="M44 9v6"/><path class="empty" d="M6 8h6v8H6z"/></svg></div>
      <div class="op-off-hint">배터리 0%</div>
      <button class="op-primary" data-op="op-charge">충전</button>
    </div>`;
  }
  function chargingHTML() {
    return `<div class="op-off" data-k="op-charging">
      <div class="op-charge-anim"><i></i><i></i><i></i></div>
      <div class="op-off-hint">충전 중…</div>
    </div>`;
  }
  function bootingHTML() {
    return `<div class="op-boot" data-k="op-boot"><div class="op-logo">◐</div><div class="op-boot-name">DOHYUN</div></div>`;
  }
  function lockHTML() {
    const remain = Math.max(0, Math.ceil((OP.delayUntil - now()) / 1000));
    const delayed = remain > 0;
    const filled = Math.min(6, OP.digits.length);
    const dots = Array.from({ length: 6 }, (_, i) => `<i class="${i < filled ? 'on' : ''}"></i>`).join('');
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
    const padHTML = keys.map((k) => {
      if (k === '') return '<span></span>';
      if (k === 'del') return `<button data-op="op-pin-del" aria-label="지우기" ${delayed ? 'disabled' : ''}>지우기</button>`;
      return `<button data-op="op-pin" data-d="${k}" ${delayed ? 'disabled' : ''}>${k}</button>`;
    }).join('');
    return `<div class="op-lock ${now() < OP.shakeUntil ? 'shake' : ''} ${delayed ? 'delayed' : ''}" data-k="op-lock">
      <div class="op-lock-clock">${clock12()}</div>
      <div class="op-lock-date">3월 18일 수요일</div>
      <div class="op-lock-mid">
        <div class="op-pin-label">${delayed ? '30초 후 다시 시도' : 'PIN을 입력하세요'}${delayed ? `<b>${remain}s</b>` : ''}</div>
        <div class="op-dots" data-k="op-dots">${dots}</div>
        ${OP.hint ? '<div class="op-hint">힌트: 아빠</div>' : ''}
      </div>
      <div class="op-keys">${padHTML}</div>
    </div>`;
  }

  function homeHTML() {
    const apps = [
      ['msg', '메시지', svgMsg], ['memo', '메모', svgMemo], ['voice', '음성메모', svgVoice],
      ['photos', '사진', svgPhotos], ['calc', '계산기', svgCalc],
    ];
    return `<div class="op-home" data-k="op-home">
      <div class="op-apps">${apps.map(([id, label, svg]) => `<button class="op-app" data-op="op-app" data-app="${id}"><span class="op-icon">${svg}</span><span class="op-label">${label}</span></button>`).join('')}</div>
      <div class="op-home-foot">서비스 없음 · 알림 0</div>
    </div>`;
  }

  // 메시지
  function msgListHTML() {
    const order = ['dad', 'hyung', 'junho', 'yujin'];
    const rows = order.map((id) => {
      const t = THREADS[id];
      const draft = t.draft ? '<span class="op-draft">[초안]</span> ' : '';
      return `<button class="op-row" data-op="op-thread" data-id="${id}">
        <span class="op-ava">${id === 'dad' ? '아' : t.name.slice(0, 1)}</span>
        <span class="op-row-txt"><b>${t.name}</b><span>${draft}${esc(t.preview)}</span></span>
        <span class="op-row-meta">${esc(t.date)}<br>${esc(t.time)}</span>
      </button>`;
    }).join('');
    return `${appHeader('메시지', false)}<div class="op-scroll" data-keep="op-msglist">${rows}</div>`;
  }
  function threadHTML() {
    const t = THREADS[OP.thread] || THREADS.hyung;
    if (t.draft) {
      return `${appHeader(t.name)}<div class="op-draft-wrap" data-k="op-draft">
        <div class="op-draft-empty">보낸 메시지가 없습니다.</div>
        <div class="op-draft-bar"><div class="op-draft-field">아빠, 나 사실...<i class="op-caret"></i></div><button class="op-send" data-op="op-draft-send">전송</button></div>
      </div>`;
    }
    let body = ''; let lastD = '';
    t.msgs.forEach(([dt, from, text]) => {
      const d = fmtDate(dt);
      if (d !== lastD) { body += `<div class="op-stamp"><b>${d}</b> ${fmtTime(dt.slice(11, 16))}</div>`; lastD = d; }
      body += `<div class="op-bubble-row ${from === 'me' ? 'me' : ''}"><div class="op-bubble">${esc(text)}</div></div>`;
    });
    return `${appHeader(t.name)}<div class="op-scroll op-thread" data-keep="op-thread" data-op="op-thread-scroll">${body}</div>`;
  }

  // 메모
  function memoListHTML() {
    const rows = MEMOS.map((m) => `<button class="op-row op-memo-row" data-op="op-memo" data-id="${m.id}">
      <span class="op-row-txt"><b>${esc(m.title)}</b><span>${esc(m.lines.filter(Boolean)[1] || '')}</span></span>
      <span class="op-row-meta">${esc(m.date)}</span></button>`).join('');
    return `${appHeader('메모', false)}<div class="op-scroll">${rows}</div>`;
  }
  function memoDetailHTML() {
    const m = MEMOS.find((x) => x.id === OP.memo) || MEMOS[0];
    const body = m.lines.map((line) => {
      if (line === '') return '<div class="op-gap"></div>';
      if (/^2025\.04 —/.test(line)) return `<div class="op-memo-note">${esc(line)}</div>`;
      if (/^대학 가기 전에/.test(line)) return `<div class="op-memo-last">${esc(line)}</div>`;
      if (/^4월 일정|^새봄|^ㅈㅁ|^ㅍㄹ|^ㅎㄴ|^J 혼자/.test(line)) return `<div class="op-memo-line op-mono">${esc(line)}</div>`;
      if (/^남은 거|^목표:/.test(line)) return `<div class="op-memo-line op-memo-head">${esc(line)}</div>`;
      return `<div class="op-memo-line">${esc(line)}</div>`;
    }).join('');
    return `${appHeader(m.title)}<div class="op-scroll op-memo-detail" data-keep="op-memo">${body}</div>`;
  }

  // 음성메모
  function voiceListHTML() {
    return `${appHeader('음성메모', false)}<div class="op-scroll">
      <button class="op-row op-voice-row" data-op="op-voice" data-id="VM.to_dad">
        <span class="op-ava op-ava-round">◉</span>
        <span class="op-row-txt"><b>아빠한테</b><span>2026. 3. 12. 오전 1:20 · 1:47</span></span>
      </button></div>`;
  }
  function currentLine(t) {
    const l = TRANSCRIPT.find((x) => t >= x.s && t < x.e);
    return l ? l.x : '';
  }
  function voiceHTML() {
    const v = OP.vm;
    const mm = Math.floor(v.t / 60), ss = Math.floor(v.t % 60);
    const line = currentLine(v.t);
    const bars = Array.from({ length: 46 }, (_, i) => {
      const h = 6 + ((i * 37 + 13) % 29);
      const past = (i / 46) * VM_DUR <= v.t;
      return `<i class="${past ? 'past' : ''}" style="height:${h}px"></i>`;
    }).join('');
    return `${appHeader('아빠한테')}<div class="op-rec" data-k="op-rec">
      <div class="op-rec-title">아빠한테</div>
      <div class="op-rec-meta">2026. 3. 12. 오전 1:20</div>
      <div class="op-wave ${v.playing ? 'playing' : ''}">${bars}</div>
      <div class="op-rec-time"><span>${pad(mm)}:${pad(ss)}</span><span>1:47</span></div>
      <div class="op-rec-bar"><input type="range" min="0" max="${VM_DUR}" step="0.1" value="${v.t.toFixed(1)}" data-op="op-vm-seek" aria-label="재생 위치"></div>
      <div class="op-rec-line ${line ? 'on' : ''}">${esc(line)}</div>
      <div class="op-rec-ctrl">
        <button class="op-round" data-op="op-vm-rewind" aria-label="10초 되감기">−10</button>
        <button class="op-play" data-op="op-vm-toggle" aria-label="${v.playing ? '일시정지' : '재생'}">${v.playing ? '❚❚' : '▶'}</button>
        <button class="op-round" data-op="op-vm-fwd" aria-label="앞으로 건너뛰기 불가" disabled>+10</button>
      </div>
      ${v.ended ? '<div class="op-rec-done">재생 완료</div>' : ''}
    </div>`;
  }

  // 사진
  function photosHTML() {
    const list = PHOTOS();
    const tiles = list.map((p, i) => {
      if (p.kind === 'receipt') {
        return `<button class="op-thumb op-receipt-thumb" data-op="op-photo" data-i="${i}"><span>${(p.amount / 10000).toLocaleString()}만</span><em>입금</em></button>`;
      }
      return `<button class="op-thumb ${p.warm ? 'warm' : ''}" data-op="op-photo" data-i="${i}"><img src="${esc(p.src)}" alt=""></button>`;
    }).join('');
    return `${appHeader('사진', false)}<div class="op-scroll"><div class="op-photo-grid">${tiles}</div></div>`;
  }
  function photoHTML() {
    const list = PHOTOS();
    const p = list[OP.photo];
    if (!p) return photosHTML();
    if (p.kind === 'receipt') {
      return `${appHeader('사진')}<div class="op-photo-view" data-k="op-photoview">
        <div class="op-receipt-card"><div class="op-receipt-logo">한결캐피탈</div><div class="op-receipt-line">가상계좌 입금 완료</div>
          <div class="op-receipt-amount">${p.amount.toLocaleString()}원</div><div class="op-receipt-line">입금자 이도*</div><div class="op-receipt-line">${esc(p.date)} ${esc(p.time)}</div></div>
        <div class="op-photo-cap">${esc(p.date)}</div></div>`;
    }
    return `${appHeader('사진')}<div class="op-photo-view" data-k="op-photoview">
      <div class="op-photo-full"><img src="${esc(p.src)}" alt=""></div>
      <div class="op-photo-cap">${esc(p.date)}</div></div>`;
  }

  // 계산기
  function calcHTML() {
    const c = OP.calc;
    const keys = ['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '=', ''];
    return `${appHeader('계산기', false)}<div class="op-calc" data-k="op-calc">
      <button class="op-calc-rec" data-op="op-calc-rec">기록</button>
      <div class="op-calc-disp">${esc(c.disp)}</div>
      <div class="op-calc-keys">${keys.map((k) => k ? `<button data-op="op-calc-key" data-k="${k}" class="${/[÷×−+=]/.test(k) ? 'op-calc-op' : ''}">${k}</button>` : '<span></span>').join('')}</div>
      ${OP.preview === 'calcRec' ? `<div class="op-calc-recbox"><div>40,000,000 − 33,400,000 = 6,600,000</div><div>31,400,000 − 2,500,000 = 28,900,000</div><button data-op="op-close-preview">닫기</button></div>` : ''}
    </div>`;
  }

  function toastHTML() {
    if (!OP.preview || OP.preview === 'calcRec') return '';
    return `<div class="op-toast" data-k="op-toast">${esc(OP.preview)}</div>`;
  }

  function appHTML() {
    switch (OP.view) {
      case 'msg': return msgListHTML();
      case 'thread': return threadHTML();
      case 'memo': return memoListHTML();
      case 'memoDetail': return memoDetailHTML();
      case 'recorder': return voiceListHTML();
      case 'voice': return voiceHTML();
      case 'photos': return photosHTML();
      case 'photo': return photoHTML();
      case 'calc': return calcHTML();
      default: return homeHTML();
    }
  }

  function bodyHTML() {
    if (!OP.everBooted && OP.boot === 'off') return offHTML();
    if (OP.boot === 'off') return offHTML();
    if (OP.boot === 'battery') return batteryHTML();
    if (OP.boot === 'charging') return chargingHTML();
    if (OP.boot === 'boot') return bootingHTML();
    if (OP.boot === 'lock' || OP.boot === 'silence') return lockHTML();
    return `${appHTML()}${toastHTML()}`;
  }

  // ───────── 렌더 ─────────
  function render() {
    const layer = $('#oldphone-layer');
    if (!layer) return;
    if (OP.device !== 'old' || !G.has('K-18')) { layer.classList.remove('show'); return; }
    layer.classList.add('show');
    const keep = [...layer.querySelectorAll('[data-keep]')].map((el) => [el.dataset.keep, el.scrollTop]);
    const showStatus = !['off', 'battery', 'charging', 'boot'].includes(OP.boot);
    const html = `<div class="op-root ${OP.boot === 'unlocked' ? 'op-unlocked' : ''}" data-k="op-root">${showStatus ? statusHTML() : ''}${bodyHTML()}</div>`;
    morph(layer, html);
    keep.forEach(([k, v]) => { const el = layer.querySelector(`[data-keep="${k}"]`); if (el) el.scrollTop = v; });
    if (OP.scrollBottom) {
      const th = layer.querySelector('[data-keep="op-thread"]');
      if (th) th.scrollTop = th.scrollHeight;
      OP.scrollBottom = false;
    } else if (OP.scrollTo != null) {
      const th = layer.querySelector('[data-keep="op-thread"]');
      if (th) th.scrollTop = OP.scrollTo;
      OP.scrollTo = null;
    }
    renderTabs();
  }

  function renderTabs() {
    let el = $('#op-tabs');
    if (!el) return;
    const S = G.S;
    const busy = S.cine || S.travel || !!S.call || (S.ov && (S.ov.type === 'incoming' || S.ov.type === 'call'));
    const meta = ['notice', 'title', 'prologue'].includes(S.phase);
    const show = G.has('K-18') && !busy && !meta && !S.banner && S.session !== 'S13';
    el.style.display = show ? 'flex' : 'none';
    if (!show) return;
    morph(el, `<button class="${OP.device === 'father' ? 'on' : ''}" data-op="op-device" data-device="father">아빠 폰</button>
      <button class="${OP.device === 'old' ? 'on' : ''}" data-op="op-device" data-device="old">도현 폰</button>`);
  }

  function renderAll() { render(); renderTabs(); }

  // ───────── 기기 ─────────
  function setDevice(dev) {
    if (dev === 'old' && !G.has('K-18')) return;
    if (OP.device === dev) { renderAll(); return; }
    OP.device = dev;
    OP.switches += 1;
    G.S.v = G.S.v || {};
    G.S.v.device_switches = OP.switches;
    if (dev === 'father') pauseVm();
    renderAll();
    document.dispatchEvent(new CustomEvent('dk-device', { detail: { device: dev } }));
  }
  function forceUnlock(focus) {
    OP.everBooted = true;
    OP.boot = 'unlocked';
    OP.unlocked = true;
    OP.digits = '';
    OP.view = 'home';
    if (focus) OP.device = 'old';
    renderAll();
  }
  function beginBoot() {
    OP.device = 'old';
    if (!OP.unlocked) OP.boot = 'off';
    renderAll();
  }
  function show(dev) { setDevice(dev || 'old'); }
  function reset() {
    pauseVm();
    OP.device = 'father'; OP.boot = 'off'; OP.unlocked = false; OP.view = 'home';
    OP.thread = null; OP.memo = null; OP.photo = null;
    OP.digits = ''; OP.fails = 0; OP.hint = false;
    OP.delayUntil = 0; OP.delayOnce = false; OP.shakeUntil = 0;
    OP.vm = { t: 0, playing: false, ended: false };
    OP.seen = {}; OP.lastPhoto = null; OP.switches = 0; OP.everBooted = false;
    OP.calc = { disp: '0', acc: null, op: null, fresh: true };
    OP.scrollBottom = false; OP.scrollTo = null; OP.threadScroll = {}; OP.preview = null;
    const layer = $('#oldphone-layer');
    if (layer) layer.classList.remove('show');
    renderTabs();
  }

  function lastView() {
    return { kind: OP.view === 'photo' ? 'photo' : OP.view, id: OP.photo != null ? (PHOTOS()[OP.photo] || {}).id : null };
  }

  // ───────── 음성메모 ─────────
  let vmTimer = null;
  function renderVoice() { if (OP.device === 'old' && OP.view === 'voice') render(); }
  function startVm() {
    if (OP.vm.ended) { OP.vm.t = 0; OP.vm.ended = false; }
    OP.vm.playing = true;
    if (vmTimer) clearInterval(vmTimer);
    vmTimer = setInterval(() => {
      if (!OP.vm.playing) { clearInterval(vmTimer); vmTimer = null; return; }
      OP.vm.t += 0.2 * SPEED;
      if (OP.vm.t >= VM_DUR) {
        OP.vm.t = VM_DUR;
        OP.vm.playing = false;
        OP.vm.ended = true;
        clearInterval(vmTimer); vmTimer = null;
        mark('VM.to_dad', ['K-19']);
        OP.voiceCbs.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
      }
      renderVoice();
    }, 200);
  }
  function pauseVm() {
    OP.vm.playing = false;
    if (vmTimer) { clearInterval(vmTimer); vmTimer = null; }
    renderVoice();
  }
  function toggleVm() { if (OP.vm.playing) pauseVm(); else startVm(); }
  function seekVm(v) {
    const val = Math.max(0, Math.min(VM_DUR, Number(v) || 0));
    // 앞으로 건너뛰기 금지: 현재 위치보다 뒤로만 이동
    if (val <= OP.vm.t + 0.05) OP.vm.t = val;
    renderVoice();
  }

  // ───────── PIN ─────────
  function pin(d) {
    if (OP.boot !== 'lock' || OP.delayUntil > now()) return;
    if (OP.digits.length >= 6) return;
    OP.digits += d;
    if (OP.digits.length === 6) checkPin();
    render();
  }
  function checkPin() {
    if (OP.digits === '680403') {
      OP.digits = '';
      OP.unlocked = true;
      OP.boot = 'silence';
      OP.everBooted = true;
      render();
      G.later(2000, () => {
        OP.boot = 'unlocked';
        OP.view = 'home';
        renderAll();
      }, 'op.unlock');
      return;
    }
    OP.fails += 1;
    OP.digits = '';
    OP.shakeUntil = now() + 420;
    render();
    G.later(430, () => { OP.shakeUntil = 0; render(); }, 'op.shake');
    if (OP.fails === 1 && G.has('K-05')) G.showMono('…가족 생일.');
    if (OP.fails === 3) OP.hint = true;
    if (OP.fails === 5) G.showMono('…내 생일은 기억할까.');
    if (OP.fails === 10 && !OP.delayOnce) {
      OP.delayOnce = true;
      OP.delayUntil = now() + 30000;
      render();
    }
  }
  function pinDel() {
    if (OP.boot !== 'lock' || OP.delayUntil > now()) return;
    OP.digits = OP.digits.slice(0, -1);
    render();
  }

  // ───────── 계산기 ─────────
  function calcKey(k) {
    const c = OP.calc;
    const isNum = /^[0-9]$/.test(k);
    if (k === 'C') { c.disp = '0'; c.acc = null; c.op = null; c.fresh = true; }
    else if (k === '±') { c.disp = c.disp[0] === '-' ? c.disp.slice(1) : '-' + c.disp; }
    else if (k === '%') { c.disp = String(Number(c.disp) / 100); }
    else if (/[÷×−+]/.test(k)) {
      c.acc = Number(c.disp); c.op = k; c.fresh = true;
    } else if (k === '=') {
      if (c.op != null && c.acc != null) {
        const b = Number(c.disp);
        let r = c.acc;
        if (c.op === '+') r += b; else if (c.op === '−') r -= b; else if (c.op === '×') r *= b; else if (c.op === '÷') r = b ? r / b : 0;
        c.disp = String(Math.round(r * 1e6) / 1e6); c.acc = null; c.op = null; c.fresh = true;
      }
    } else if (k === '.') { if (!c.disp.includes('.')) c.disp += '.'; c.fresh = false; }
    else if (isNum) {
      if (c.fresh) { c.disp = k; c.fresh = false; }
      else c.disp = c.disp === '0' ? k : c.disp + k;
    }
    render();
  }

  // ───────── 입력 ─────────
  function opAct(name, el) {
    const S = G.S;
    switch (name) {
      case 'op-device': setDevice(el.dataset.device); return;
      case 'op-power': if (OP.boot === 'off') { OP.boot = 'battery'; render(); } return;
      case 'op-charge':
        if (OP.boot !== 'battery') return;
        OP.boot = 'charging'; render();
        G.later(2000, () => { OP.boot = 'boot'; render(); G.later(3000, () => { OP.boot = 'lock'; OP.everBooted = true; render(); }, 'op.boot'); }, 'op.charge');
        return;
      case 'op-pin': pin(el.dataset.d); return;
      case 'op-pin-del': pinDel(); return;
      case 'op-app': {
        const app = el.dataset.app;
        pauseVm();
        if (app === 'msg') { OP.view = 'msg'; render(); return; }
        if (app === 'memo') { OP.view = 'memo'; render(); return; }
        if (app === 'voice') { OP.view = 'recorder'; render(); return; }
        if (app === 'photos') { mark('PH.o.photos'); OP.view = 'photos'; render(); return; }
        if (app === 'calc') { OP.view = 'calc'; render(); return; }
        return;
      }
      case 'op-back': {
        pauseVm();
        if (OP.view === 'thread') OP.view = 'msg';
        else if (OP.view === 'memoDetail') OP.view = 'memo';
        else if (OP.view === 'photo') OP.view = 'photos';
        else if (OP.view === 'voice') OP.view = 'recorder';
        else OP.view = 'home';
        render(); return;
      }
      case 'op-thread': {
        const id = el.dataset.id;
        OP.thread = id;
        OP.view = 'thread';
        OP.scrollBottom = !(OP.threadScroll[id] != null);
        OP.scrollTo = OP.threadScroll[id] != null ? OP.threadScroll[id] : null;
        if (id === 'dad') mark('TH.o.dad', ['KX-19']);
        if (id === 'hyung') mark('TH.o.hyung', ['K-21', 'K-22']);
        if (id === 'junho') mark('TH.o.junho', ['KX-22']);
        if (id === 'yujin') mark('TH.o.yujin', ['KX-21']);
        render(); return;
      }
      case 'op-draft-send': {
        OP.preview = '메시지를 보낼 수 없습니다';
        render();
        G.later(2200, () => { OP.preview = null; render(); }, 'op.toast');
        return;
      }
      case 'op-memo': {
        OP.memo = el.dataset.id;
        OP.view = 'memoDetail';
        if (OP.memo === 'MM.o.remaining') mark('MM.o.remaining', ['K-20']);
        if (OP.memo === 'MM.o.april_schedule') mark('MM.o.april_schedule', ['KX-16']);
        render(); return;
      }
      case 'op-voice': OP.view = 'voice'; render(); return;
      case 'op-vm-toggle': toggleVm(); return;
      case 'op-vm-rewind': OP.vm.t = Math.max(0, OP.vm.t - 10); renderVoice(); return;
      case 'op-vm-fwd': return;
      case 'op-photo': {
        OP.photo = Number(el.dataset.i);
        OP.view = 'photo';
        const p = PHOTOS()[OP.photo];
        if (p) {
          if (p.id === 'PH.o.sleeping_father') mark('PH.o.sleeping_father', ['KX-18']);
          mark('PH.o.photos');
        }
        render(); return;
      }
      case 'op-calc-key': calcKey(el.dataset.k); return;
      case 'op-calc-rec': OP.preview = 'calcRec'; render(); return;
      case 'op-close-preview': OP.preview = null; render(); return;
      default: return;
    }
  }

  // ───────── 이벤트 ─────────
  function onDocClick(e) {
    const el = e.target.closest && e.target.closest('[data-op]');
    if (!el) return;
    if (!el.closest('#oldphone-layer, #op-tabs')) return;
    if (!el.dataset.op.startsWith('op-')) return;
    e.preventDefault();
    e.stopPropagation();
    if (OP.boot === 'silence') return; // 해제 직후 2초는 입력을 무시한다.
    opAct(el.dataset.op, el);
  }
  function onDocInput(e) {
    if (e.target && e.target.dataset && e.target.dataset.op === 'op-vm-seek') {
      seekVm(e.target.value);
    }
  }
  function onScroll(e) {
    const el = e.target;
    if (!el || !el.dataset || el.dataset.op !== 'op-thread-scroll') return;
    if (OP.thread) OP.threadScroll[OP.thread] = el.scrollTop;
    if (OP.thread !== 'hyung') return;
    if (el.scrollTop <= 8) mark('TH.o.hyung.top', ['KX-20']);
  }

  // ───────── 마운트 / 동기화 ─────────
  function ensureCss() {
    if (document.querySelector('link[href$="oldphone.css"], style[data-oldphone]')) return;
    // 단일 HTML 빌드에서 CSS가 이미 인라인됐는지 확인 (없으면 링크 주입).
    const probe = document.createElement('div');
    probe.className = 's10-layer';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);
    const applied = getComputedStyle(probe).position === 'absolute';
    probe.remove();
    if (applied) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'oldphone.css';
    document.head.appendChild(l);
  }
  function mount() {
    ensureCss();
    const screen = $('#screen');
    if (!screen) return;
    if (!$('#oldphone-layer')) {
      const layer = document.createElement('div');
      layer.id = 'oldphone-layer';
      layer.setAttribute('aria-hidden', 'true');
      screen.appendChild(layer);
    }
    if (!$('#op-tabs')) {
      const tabs = document.createElement('div');
      tabs.id = 'op-tabs';
      tabs.style.display = 'none';
      screen.appendChild(tabs);
    }
    if (!OP.mounted) {
      OP.mounted = true;
      document.addEventListener('click', onDocClick, true);
      document.addEventListener('input', onDocInput, true);
      const layer = $('#oldphone-layer');
      if (layer) layer.addEventListener('scroll', onScroll, true);
      setInterval(sync, 300);
    }
    renderAll();
  }
  let lastDelaySec = -1;
  function sync() {
    if (!G.has('K-18')) return;
    const S = G.S;
    // 대면 장면·이동·S13에서는 옛 폰을 내려놓는다(장면을 가리지 않게).
    const sceneUp = S.dlg && (S.dlg.channel === 'face' || S.dlg.channel === 'intercom') && !S.phoneUp;
    if (OP.device === 'old' && (S.session === 'S13' || S.travel || sceneUp)) {
      setDevice('father');
      return;
    }
    renderTabs();
    if (OP.device !== 'old') return;
    if (OP.boot === 'lock' && OP.delayUntil > now()) {
      const sec = Math.ceil((OP.delayUntil - now()) / 1000);
      if (sec !== lastDelaySec) { lastDelaySec = sec; render(); }
    } else if (lastDelaySec !== -1) {
      lastDelaySec = -1;
      if (OP.boot === 'lock') render();
    }
  }

  function notifyHangyeol() {
    const S = G.S;
    S.banner = {
      title: '1600-XXXX',
      body: '[한결캐피탈] 2월 상환금 2,500,000원 입금 확인…',
      id: 'hangyeol', kind: 'msg',
    };
    G.refresh();
    G.later(4200, () => {
      if (G.S.banner && G.S.banner.id === 'hangyeol') {
        G.S.banner.out = true;
        G.refresh();
        G.later(280, () => {
          if (G.S.banner && G.S.banner.id === 'hangyeol') { G.S.banner = null; G.refresh(); }
        }, 'op.banner');
      }
    }, 'op.banner');
  }

  // ───────── 공개 API ─────────
  window.OldPhone = {
    mount, render: renderAll, act: opAct, seen,
    mark, onSeen, onVoiceEnd, setDevice, forceUnlock, beginBoot, show, reset, lastView,
    notifyHangyeol, state: OP,
    data: { THREADS, MEMOS, TRANSCRIPT, VM_DUR, PHOTOS },
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
