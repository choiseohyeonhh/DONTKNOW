
(function () {
  'use strict';
  const G = window.__game || window.DK;
  if (!G) return;

  const Q = new URLSearchParams(location.search);
  const SPEED = Math.max(0.01, Number(Q.get('speed')) || 1);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const img = (k) => (!k ? '' : (k.startsWith('img/') || k.startsWith('data:') || k.startsWith('http') ? k : `img/${k}.jpg`));
  const bg = (k) => `background-image:url('${esc(img(k))}')`;
  const delay = (ms) => new Promise((res) => setTimeout(res, Math.max(0, ms / SPEED)));

  
  const CSS = `
body.dk-s13-lock .scene .phonebtn,body.dk-s13-lock .scene-back{display:none!important}
body.dk-s13-lock .homeind{opacity:0;pointer-events:none}
body.s13-choice1 .scene .choices button:first-child{min-height:152px;padding:15px 16px;font-size:16px;line-height:1.55;white-space:pre-line;background:rgba(255,255,255,.16)}
body.s13-choice1 .scene .choices button:first-child:active{background:rgba(255,255,255,.26)}
.s13-fade{position:absolute;inset:0;z-index:85;background:#000;opacity:0;transition:opacity .75s ease;pointer-events:none}
.s13-fade.on{opacity:1}
.dk-ending{position:absolute;inset:0;z-index:90;display:none;overflow:hidden;background:#000;color:#E8EAED;font-family:var(--font,"Pretendard",-apple-system,sans-serif);letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.dk-ending.on{display:block}.dk-ending *{box-sizing:border-box}
.dk-scene,.dk-lock,.dk-call,.dk-thread,.dk-title,.dk-credits,.dk-end,.dk-black,.dk-ring{position:absolute;inset:0}
.dk-scene{overflow:hidden}
.dk-bg{position:absolute;inset:-2%;background-size:cover;background-position:center;filter:brightness(.72) saturate(.86);animation:dkKen 9s ease-out both}
@keyframes dkKen{from{transform:scale(1.01)}to{transform:scale(1.06)}}
.dk-shade{position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.08),rgba(0,0,0,.18) 45%,rgba(0,0,0,.76))}
.dk-stamp{position:absolute;left:28px;bottom:64px;z-index:2;font-size:15px;font-weight:600;letter-spacing:.08em;color:rgba(255,255,255,.88);text-shadow:0 1px 8px rgba(0,0,0,.7)}
.dk-cap{position:absolute;left:28px;right:28px;bottom:104px;z-index:2;font-size:16px;line-height:1.7;font-weight:450;white-space:pre-line;word-break:keep-all;text-shadow:0 1px 12px rgba(0,0,0,.9),0 0 2px rgba(0,0,0,.6);animation:dkFade 1.1s ease both .2s}
.dk-quote{position:absolute;left:24px;right:24px;bottom:106px;z-index:3;padding:18px 20px;border-radius:22px;background:rgba(14,15,17,.72);border:.5px solid rgba(255,255,255,.14);backdrop-filter:blur(18px);font-size:20px;line-height:1.5;animation:dkUp .5s ease both}
.dk-quote .who{display:block;margin-bottom:5px;font-size:13px;font-weight:700;color:rgba(255,255,255,.58)}
.dk-msgpop{position:absolute;left:50%;bottom:128px;z-index:3;transform:translateX(-50%);max-width:82%;padding:16px 22px;border-radius:22px;background:rgba(255,255,255,.96);color:#111;font-size:19px;font-weight:650;line-height:1.4;text-align:center;box-shadow:0 18px 44px -18px rgba(0,0,0,.65);animation:dkUp .55s cubic-bezier(.2,.9,.25,1) both}
.dk-black{background:#000;display:grid;place-items:center;padding:0 34px;text-align:center}
.dk-black .dk-big{font-size:22px;line-height:1.65;font-weight:500;white-space:pre-line;color:#DDE1E6;animation:dkFade 1.2s ease both}
.dk-black .dk-small{margin-top:12px;font-size:14px;line-height:1.6;color:#7F868F;white-space:pre-line;animation:dkFade 1.2s ease both .4s}
.dk-notif{position:absolute;top:62px;left:8px;right:8px;z-index:4;display:grid;grid-template-columns:42px 1fr;gap:0 12px;align-items:start;padding:13px 15px;border-radius:24px;background:rgba(248,248,250,.95);color:#000;box-shadow:0 12px 34px -12px rgba(0,0,0,.55);animation:dkDrop .5s cubic-bezier(.2,.9,.25,1) both}
.dk-notif .t{font-size:15px;font-weight:650;line-height:1.3}.dk-notif .b{margin-top:2px;font-size:15px;line-height:1.4}
.dk-notif .time{grid-column:2;margin-top:4px;font-size:12px;color:rgba(60,60,67,.6)}
.dk-appic{width:42px;height:42px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(#5EE07A,#2DBE4E);color:#fff;font-size:12px;font-weight:800}
.dk-appic.call{background:linear-gradient(#62D77A,#24A94A)}.dk-appic.sms{background:linear-gradient(#5EE07A,#2DBE4E)}
@keyframes dkDrop{from{transform:translateY(-150%);opacity:0}}
.dk-lock{color:#fff;background-size:cover;background-position:center}
.dk-lock-veil{position:absolute;inset:0;background:linear-gradient(170deg,rgba(0,0,0,.18),rgba(0,0,0,.52) 60%,rgba(0,0,0,.72))}
.dk-when{position:absolute;top:88px;left:0;right:0;text-align:center;z-index:2;animation:dkFade .8s ease both}
.dk-date{font-size:18px;font-weight:600;opacity:.86}
.dk-clock{margin-top:4px;font-size:88px;font-weight:640;line-height:1;letter-spacing:-.035em}
.dk-badgesline{position:absolute;left:0;right:0;bottom:126px;z-index:2;display:flex;justify-content:center;gap:18px;font-size:14px;color:rgba(255,255,255,.82)}
.dk-badgesline span{padding:7px 13px;border-radius:16px;background:rgba(20,22,26,.48);backdrop-filter:blur(14px)}
.dk-badgesline b{color:#fff;font-weight:700}
.dk-swipe{position:absolute;left:0;right:0;bottom:46px;z-index:2;text-align:center;font-size:13px;font-weight:600;opacity:.78}
.dk-clearing{position:absolute;left:0;right:0;bottom:170px;z-index:2;text-align:center;font-size:13px;color:rgba(255,255,255,.6)}
.dk-ring{background:radial-gradient(120% 80% at 50% 30%,#313A44 0%,#141A20 60%,#0B0E12 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:70px 28px 48px}
.dk-ring .num{font-size:26px;font-weight:650}.dk-ring .sub{margin-top:8px;font-size:14px;color:rgba(255,255,255,.55)}
.dk-ring .avatar{width:86px;height:86px;margin:42px 0 0;border-radius:50%;background:rgba(255,255,255,.1);display:grid;place-items:center}
.dk-ring .avatar svg{width:44px;height:44px;fill:rgba(255,255,255,.6)}
.dk-ring .actions{margin-top:auto}
.dk-accept{width:74px;height:74px;border-radius:50%;border:0;background:#34C759;color:#fff;font-size:16px;font-weight:700;cursor:pointer;box-shadow:0 12px 30px -12px rgba(52,199,89,.9)}
.dk-accept:active{transform:scale(.95)}.dk-ring .hint{margin-top:12px;font-size:12px;color:rgba(255,255,255,.45)}
.dk-call{background:linear-gradient(#2D3640,#161B21);display:flex;flex-direction:column;padding:72px 22px 38px}
.dk-call .top{flex:none;text-align:center}.dk-call .who{font-size:24px;font-weight:650}.dk-call .state{margin-top:7px;font-size:14px;color:rgba(255,255,255,.58)}
.dk-lines{flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:10px;overflow:hidden;padding:22px 0}
.dk-line{align-self:flex-start;max-width:82%;padding:10px 14px;border-radius:16px;background:rgba(255,255,255,.12);font-size:17px;line-height:1.45;animation:dkUp .32s ease both}
.dk-line.me{align-self:flex-end;background:rgba(10,124,255,.35)}
.dk-line .who{display:block;margin-bottom:3px;font-size:11px;font-weight:700;color:rgba(255,255,255,.55)}
.dk-call .tap{flex:none;text-align:center;font-size:12px;color:rgba(255,255,255,.4)}
.dk-callspk{background:linear-gradient(#2D3640,#161B21);display:flex;flex-direction:column;padding:72px 22px 38px}
.dk-callspk .top{text-align:center;flex:none}.dk-callspk .who{font-size:24px;font-weight:650}.dk-callspk .state{margin-top:7px;font-size:14px;color:rgba(255,255,255,.58)}
.dk-callspk .spkline{margin:auto 0;padding:20px 18px;border-radius:22px;background:rgba(255,255,255,.11);font-size:19px;line-height:1.5;text-align:center;animation:dkUp .4s ease both}
.dk-callspk .end{flex:none;text-align:center;font-size:12px;color:rgba(255,255,255,.45)}
.dk-phone{background:#fff;color:#000;display:flex;flex-direction:column}
.dk-status{flex:none;height:56px;display:flex;align-items:center;justify-content:space-between;padding:16px 30px 0;font-size:14px;font-weight:600}
.dk-threadbar{flex:none;height:60px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 16px;border-bottom:.5px solid rgba(60,60,67,.2)}
.dk-threadbar .back{color:var(--blue,#0A7CFF);font-size:21px}
.dk-threadbar .ttl{text-align:center;font-size:15px;font-weight:700}
.dk-threadbar .ttl small{display:block;margin-top:1px;font-size:11px;font-weight:500;color:rgba(60,60,67,.6)}
.dk-threadbody{flex:1;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:8px;padding:16px 14px 8px}
.dk-bubble{align-self:flex-start;max-width:82%;padding:9px 13px;border-radius:17px;background:#E9E9EB;font-size:14px;line-height:1.45}
.dk-bubble.me{align-self:flex-end;background:#0A7CFF;color:#fff}
.dk-bubble .meta{display:block;margin-top:4px;font-size:10px;opacity:.55}
.dk-compose{flex:none;padding:8px 12px 26px;border-top:.5px solid rgba(60,60,67,.18)}
.dk-reply{margin:0 4px 6px;font-size:11px;font-weight:700;color:rgba(60,60,67,.55)}
.dk-compose .row{display:flex;align-items:flex-end;gap:8px}
.dk-input{flex:1;min-height:42px;padding:11px 13px;border:1px solid #D6D6DA;border-radius:21px;font-size:14px;line-height:1.35;color:#222;background:#fff}
.dk-send{flex:none;height:38px;padding:0 15px;border-radius:19px;background:#0A7CFF;color:#fff;font-size:14px;font-weight:700;cursor:pointer}
.dk-send:active{opacity:.8}
.dk-bplus{position:absolute;left:20px;right:20px;bottom:96px;z-index:4;display:grid;gap:10px;animation:dkUp .5s ease both}
.dk-btn{min-height:54px;padding:13px 18px;border-radius:18px;border:.5px solid rgba(255,255,255,.16);background:rgba(255,255,255,.13);color:#fff;font-size:16px;line-height:1.35;text-align:left;cursor:pointer}
.dk-btn:active{background:rgba(255,255,255,.24)}.dk-btn.center{text-align:center}
.dk-title{background:#0E0F11;display:grid;place-items:center}
.dk-title h1{font-size:40px;font-weight:700;letter-spacing:-.02em;color:#E9ECEF;animation:dkFade 1.6s ease both}
.dk-credits{background:#0E0F11;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:44px 34px;text-align:center}
.dk-credit-lines{animation:dkFade 1.2s ease both}
.dk-credit-lines .logo{margin-bottom:30px;font-size:24px;font-weight:700;letter-spacing:-.02em;color:#E9ECEF}
.dk-credit-lines .row{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:10px;font-size:13px;line-height:1.5;color:#8A9099;text-align:left}
.dk-credit-lines .row b{color:#C9CDD2;font-weight:600}
.dk-after{position:absolute;top:64px;left:8px;right:8px;z-index:3}
.dk-end{background:#0E0F11;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px}
.dk-end .logo{font-size:34px;font-weight:700;letter-spacing:-.02em;color:#E9ECEF;animation:dkFade 1.4s ease both}
.dk-end .dk-btn{width:190px;text-align:center;background:#E9ECEF;color:#0E0F11;border:0;font-weight:700}
.dk-end .dk-btn:active{background:#fff}
@keyframes dkFade{from{opacity:0}}
@keyframes dkUp{from{transform:translateY(12px);opacity:0}}
@media (prefers-reduced-motion:reduce){.dk-bg{animation:none}.dk-ending *,.dk-ending *::before,.dk-ending *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
`;

  function injectCSS() {
    if (document.getElementById('dk-endings-style')) return;
    const st = document.createElement('style');
    st.id = 'dk-endings-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  let layer = null;
  let pending = null;

  function ensureLayer() {
    if (layer && layer.isConnected) return layer;
    layer = document.getElementById('dk-ending');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'dk-ending';
      layer.className = 'dk-ending';
      layer.addEventListener('click', onLayerClick);
      (document.getElementById('screen') || document.body).appendChild(layer);
    }
    return layer;
  }

  function show(html) {
    ensureLayer();
    layer.className = 'dk-ending on';
    layer.innerHTML = html;
  }

  function hide() {
    if (layer) { layer.className = 'dk-ending'; layer.innerHTML = ''; }
  }

  function settle(kind) {
    if (!pending) return false;
    if (kind && pending.kind !== kind) return false;
    const p = pending;
    pending = null;
    clearTimeout(p.timer);
    p.resolve(true);
    return true;
  }

  function waitFor(kind, autoMs) {
    return new Promise((resolve) => {
      const p = { kind, resolve, timer: null };
      pending = p;
      if (autoMs) {
        p.timer = setTimeout(() => {
          if (pending === p) { pending = null; resolve(false); }
        }, Math.max(0, autoMs / SPEED));
      }
    });
  }

  function onLayerClick(e) {
    const btn = e.target.closest('[data-dk-act]');
    if (btn) {
      const a = btn.dataset.dkAct;
      if (a === 'restart') { e.preventDefault(); return restart(); }
      if (settle(a)) return;
      if (a === 'tap' && settle('tap')) return;
      return;
    }
    settle('tap');
  }

  
  function showScene(o) {
    show(`<div class="dk-scene">
      <div class="dk-bg" style="${bg(o.img)}"></div><div class="dk-shade"></div>
      ${o.extra || ''}
      ${o.stamp ? `<div class="dk-stamp">${esc(o.stamp)}</div>` : ''}
      ${o.cap ? `<div class="dk-cap">${esc(o.cap)}</div>` : ''}
    </div>`);
  }

  function showBlack(big, small) {
    show(`<div class="dk-black">${big != null ? `<div class="dk-big">${esc(big)}</div>` : ''}${small ? `<div class="dk-small">${esc(small)}</div>` : ''}</div>`);
  }

  function showNotif(app, title, text) {
    show(`<div class="dk-black"><div class="dk-notif">
      <div class="dk-appic sms">문자</div>
      <div><div class="t">${esc(app)}</div><div class="b">${esc(text)}</div><div class="time">지금</div></div>
    </div>${title ? `<div class="dk-small">${esc(title)}</div>` : ''}</div>`);
  }

  function showLock(o) {
    const missed = o.missed == null ? 0 : o.missed;
    const unread = o.unread == null ? 0 : o.unread;
    show(`<div class="dk-lock" style="${bg(o.wallpaper)}">
      <div class="dk-lock-veil"></div>
      <div class="dk-when"><div class="dk-date">${esc(o.date || '3월 19일 목요일')}</div><div class="dk-clock">${esc(o.clock || '')}</div></div>
      <div class="dk-badgesline"><span>부재중 <b id="dk-missed">${missed}</b></span><span>미읽 <b id="dk-unread">${unread}</b></span></div>
      ${o.clearing ? '<div class="dk-clearing">남은 알림을 하나씩 확인하는 중…</div>' : ''}
      ${o.swipe === false ? '' : `<div class="dk-swipe">${esc(o.swipe || '위로 쓸어서 열기')}</div>`}
    </div>`);
  }

  function showQuote(who, text) {
    show(`<div class="dk-scene">
      <div class="dk-bg" style="${bg('img/scene_morning_empty.jpg')}"></div><div class="dk-shade"></div>
      <div class="dk-quote"><span class="who">${esc(who)}</span>${esc(text)}</div>
    </div>`);
  }

  async function rollClock(from, to, ms) {
    const el = layer && layer.querySelector('.dk-stamp');
    if (!el) return;
    const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const a = toMin(from), b = toMin(to);
    const steps = 24;
    for (let i = 1; i <= steps; i++) {
      await delay(ms / steps);
      if (!el.isConnected) return;
      const v = Math.round(a + (b - a) * (i / steps));
      el.textContent = `${pad(Math.floor(v / 60))}:${pad(v % 60)}`;
    }
  }

  
  const CALL_LINES = [
    { who: '도현', text: '…아빠.', me: false },
    { who: '아버지', text: '응.', me: true },
    { who: '도현', text: '미안해.', me: false },
    { who: '아버지', text: '괜찮아. 이제 알았어.', me: true },
    { who: '도현', text: '(숨) …음성메모 들었어?', me: false },
    { who: '아버지', text: '들었어. 다시 녹음 안 해도 돼.', me: true },
    { who: '도현', text: '아홉 시에, 거기로 갈게.', me: false },
    { who: '아버지', text: '기다릴게.', me: true },
  ];

  async function playCall() {
    show(`<div class="dk-call">
      <div class="top"><div class="who">모르는 번호</div><div class="state">통화 중</div></div>
      <div class="dk-lines" id="dk-lines"></div>
      <div class="tap">탭하면 계속</div>
    </div>`);
    await delay(4000);
    for (const line of CALL_LINES) {
      const box = layer && layer.querySelector('#dk-lines');
      if (!box) return;
      box.insertAdjacentHTML('beforeend', `<div class="dk-line ${line.me ? 'me' : ''}"><span class="who">${esc(line.who)}</span>${esc(line.text)}</div>`);
      await waitFor('tap', 3600);
    }
    await delay(500);
  }

  async function playHangyeolReply() {
    const data = (window.DATA && window.DATA.hangyeol) || [];
    const recent = data.slice(-2);
    const bubbles = recent.map((m) => `<div class="dk-bubble">${esc(m.x)}<span class="meta">${esc(m.d)} ${esc(m.t)}</span></div>`).join('');
    show(`<div class="dk-phone">
      <div class="dk-status"><span>05:55</span><span>5G&nbsp;&nbsp;41</span></div>
      <div class="dk-threadbar"><span class="back">‹</span><div class="ttl">1600-XXXX<small>한결캐피탈</small></div><span></span></div>
      <div class="dk-threadbody" id="dk-threadbody">${bubbles}</div>
      <div class="dk-compose" id="dk-compose">
        <div class="dk-reply">답장</div>
        <div class="row">
          <div class="dk-input">상환 일정 상담 요청드립니다. 이상철입니다.</div>
          <button class="dk-send" data-dk-act="send">보내기</button>
        </div>
      </div>
    </div>`);
    await waitFor('send');
    const body = layer && layer.querySelector('#dk-threadbody');
    const comp = layer && layer.querySelector('#dk-compose');
    if (body) {
      body.insertAdjacentHTML('beforeend', '<div class="dk-bubble me">상환 일정 상담 요청드립니다. 이상철입니다.<span class="meta">05:55</span></div>');
      body.scrollTop = body.scrollHeight;
    }
    if (comp) comp.innerHTML = '<div class="dk-reply">전송됨</div>';
    await delay(1400);
  }

  async function clearBadges() {
    showLock({ date: '3월 19일 목요일', clock: '05:56', wallpaper: 'img/photo_family_2019.jpg', missed: 47, unread: 23, clearing: true });
    const m = layer && layer.querySelector('#dk-missed');
    const u = layer && layer.querySelector('#dk-unread');
    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      await delay(480);
      if (m) m.textContent = String(Math.round(47 * (1 - i / steps)));
      if (u) u.textContent = String(Math.round(23 * (1 - i / steps)));
    }
    await delay(900);
  }

  function branchA() {
    const S = G.S || {};
    const b = (S.v && (S.v.branchA || S.v.branch_A)) || (S.branch && S.branch.A);
    if (b) return b;
    if (G.flag('F-01')) return 'A-2';
    if (G.has('K-17') && G.has('K-22') && G.has('KX-21') && G.flag('FX-06')) return 'A-1';
    return 'A-3';
  }

  function branchB() {
    const S = G.S || {};
    const b = (S.v && (S.v.branchB || S.v.branch_B)) || (S.branch && S.branch.B);
    if (b) return b;
    if (G.flag('F-03') && G.flag('F-02')) return 'B-3';
    if (G.flag('F-02b')) return 'B-1';
    if (G.flag('F-02')) return 'B-2';
    return null;
  }

  function afterStoryA() {
    const out = [];
    if (branchA() === 'A-1') out.push({ kind: 'msg', app: '김 형사', text: '차유진 씨 오늘 출석했습니다.' });
    const b = branchB();
    if (b === 'B-1') out.push({ kind: 'msg', app: '준호', text: '아저씨 저도 갈게요 9시' });
    else if (b === 'B-2') out.push({ kind: 'call', app: '103호', text: '부재중 1건' });
    return out;
  }

  async function playA() {
    showScene({
      img: 'img/scene_living_dawn.jpg', stamp: '05:40',
      cap: '3월 19일 목요일. 거실. 아버지는 잠들지 못했다.\n도현의 방문이 열려 있다.',
    });
    await delay(1600);
    await rollClock('05:40', '05:52', 6000);
    await delay(600);

    show(`<div class="dk-ring">
      <div class="num">모르는 번호</div><div class="sub">휴대전화</div>
      <div class="avatar"><svg viewBox="0 0 30 30"><circle cx="15" cy="11" r="5.5"/><path d="M5 27c1.4-5.4 5.2-8 10-8s8.6 2.6 10 8z"/></svg></div>
      <div class="actions"><button class="dk-accept" data-dk-act="accept">받기</button><div class="hint">받기만 가능합니다</div></div>
    </div>`);
    await waitFor('accept');
    await playCall();

    await playHangyeolReply();
    await clearBadges();

    showScene({
      img: 'img/scene_police_front_morning.jpg', stamp: '08:50',
      cap: '성원경찰서 앞. 아버지는 혼자 서 있다.\n도현은 아직 오지 않았다.',
    });
    await delay(3400);

    const wallpaper = G.flag('FX-07') ? 'img/wall_sleeping_father.jpg' : 'img/photo_family_2019.jpg';
    showLock({ date: '3월 19일 목요일', clock: '08:50', wallpaper, missed: 0, unread: 0 });
    await delay(2800);
    await titleAndCredits('A', afterStoryA());
  }

  
  async function playSpeakerphone() {
    show(`<div class="dk-callspk">
      <div class="top"><div class="who">형</div><div class="state">스피커폰</div></div>
      <div class="spkline">“봐요. 아버님은 아직도 몰라요.”</div>
      <div class="end">통화 종료</div>
    </div>`);
    await delay(2800);
  }

  function detectiveLine() {
    return '아버님, 아드님 찾았습니다. 서로 와 주셔야겠습니다.';
  }

  function hyungCaught() {
    if (G.flag('F-03')) return true;
    return Number(G.S.v && G.S.v.s13_choice) === 3 && G.flag('FX-03');
  }

  async function playB(variant) {
    if (variant === 'silent') await playSpeakerphone();

    showBlack('3일 뒤', '3월 21일 토요일');
    await delay(2200);

    showNotif('김 형사', '', detectiveLine());
    await delay(3000);

    showBlack(`마약수사계가 형의 오피스텔을 급습했다.\n도현은 구조되지만 동시에 피의자로 입건됐다.\n${hyungCaught() ? '형은 검거됐다.' : '형은 도주했다.'}`);
    await delay(3400);

    showScene({
      img: 'img/scene_interrogation_glass.jpg', stamp: '3월 21일',
      cap: variant === 'silent'
        ? '진술실 유리창 너머. 구치소가 아니다.'
        : '진술실 유리창 너머. 구치소가 아니다. 도현이 아버지를 본다.',
    });
    await delay(2200);

    if (variant === 'silent') {
      await delay(5000);
    } else {
      showScene({
        img: 'img/scene_interrogation_glass.jpg', stamp: '3월 21일',
        cap: '진술실 유리창 너머.',
        extra: '<div class="dk-quote"><span class="who">도현</span>…아빠는 몰라도 됐는데.</div>',
      });
      await delay(2600);
      await delay(5000);
    }

    if (variant === 'plus') {
      showScene({
        img: 'img/scene_interrogation_glass.jpg', stamp: '3월 21일',
        cap: '아버지는 말하지 못한다.',
        extra: '<div class="dk-bplus"><button class="dk-btn" data-dk-act="bplus">나도 너한테 말 안 한 거 있어.</button></div>',
      });
      await waitFor('bplus');
      showScene({
        img: 'img/scene_interrogation_glass_bplus.jpg', stamp: '3월 21일',
        cap: '도현이 처음으로 고개를 든다.',
      });
      await delay(2800);
    }

    await titleAndCredits('B', []);
  }

  
  async function playC() {
    await playSpeakerphone();

    showScene({
      img: 'img/scene_morning_empty.jpg', stamp: '3월 19일 아침',
      cap: '식탁. 아무도 없다.',
    });
    await delay(2800);

    showLock({ date: '3월 19일 목요일', clock: '08:10', wallpaper: 'img/photo_family_2019.jpg', missed: 0, unread: 0, swipe: false });
    await delay(15000);

    showBlack('');
    await delay(900);
    await titleAndCredits('C', []);
  }

  
  async function playD() {
    showScene({
      img: 'img/scene_entrance_in_a.jpg', stamp: '3월 19일 오후',
      cap: '현관. 도어락 소리.',
    });
    await delay(1200);
    showScene({
      img: 'img/scene_entrance_in_a.jpg', stamp: '3월 19일 오후',
      extra: '<div class="dk-quote"><span class="who">도현</span>다녀왔습니다.</div>',
    });
    await delay(2600);

    showScene({
      img: 'img/scene_living_table.jpg',
      cap: '아버지는 아무것도 묻지 않았다.\n도현의 방문이 닫히는 소리.',
    });
    await delay(3200);

    showBlack('한 달 뒤');
    await delay(2200);

    showNotif('한결캐피탈', '', '[한결캐피탈] 완납 처리되었습니다.');
    await delay(3000);

    showScene({
      img: 'img/scene_dohyun_room_newphone.jpg', stamp: '같은 시각',
      cap: '도현의 방. 새 폰 화면에 문자가 떠 있다.',
      extra: '<div class="dk-msgpop">부를 때 와라.</div>',
    });
    await delay(3400);

    showBlack('서랍이 닫히는 소리.');
    await delay(1800);
    await titleAndCredits('D', []);
  }

  
  function bannerHTML(item) {
    const isCall = item.kind === 'call';
    return `<div class="dk-notif">
      <div class="dk-appic ${isCall ? 'call' : 'sms'}">${isCall ? '부재중' : '문자'}</div>
      <div><div class="t">${esc(item.app)}</div><div class="b">${esc(item.text)}</div><div class="time">지금</div></div>
    </div>`;
  }

  async function titleAndCredits(ending, afterStory) {
    show('<div class="dk-title"><h1>DONTKNOW</h1></div>');
    await delay(2400);

    show(`<div class="dk-credits">
      <div class="dk-credit-lines">
        <div class="logo">DONTKNOW</div>
        <div class="row"><b>기획 · 각본</b><span>서현</span></div>
        <div class="row"><b>웹 프로토타입</b><span>DONTKNOW MVP</span></div>
        <div class="row"><b>끝</b><span></span></div>
      </div>
      <div class="dk-after"></div>
    </div>`);
    await delay(2200);

    const list = afterStory || [];
    for (const item of list) {
      const box = layer && layer.querySelector('.dk-after');
      if (!box) break;
      box.innerHTML = bannerHTML(item);
      await delay(3000);
    }
    if (list.length) {
      const box = layer && layer.querySelector('.dk-after');
      if (box) box.innerHTML = '';
      await delay(800);
    } else {
      await delay(1600);
    }

    show('<div class="dk-black"></div>');
    await delay(3000);
    showEndScreen(ending);
  }

  function showEndScreen(ending) {
    show(`<div class="dk-end">
      <div class="logo">DONTKNOW</div>
      <button class="dk-btn center" data-dk-act="restart">처음부터</button>
    </div>`);
  }

  function restart() {
    if (pending) { clearTimeout(pending.timer); pending = null; }
    document.querySelectorAll('.s13-fade').forEach((el) => el.remove());
    document.body.classList.remove('dk-s13-lock', 's13-choice1');
    hide();
    try { G.clearGroup('dk-ending'); } catch (e) {  }
    try {
      G.S.ov = null; G.S.call = null; G.S.dlg = null;
      G.S.banner = null; G.S.mono = null; G.S.phoneUp = false;
    } catch (e) {  }
    G.jump('S01');
  }

  
  function decide(choice) {
    choice = Number(choice) || 0;
    const f03 = G.flag('F-03');
    const bplus = G.has('K-19') && G.has('K-20');

    if (choice === 4 && !f03) return { ending: 'C', variant: null, choice };
    if (f03) return { ending: 'B', variant: choice === 4 ? 'silent' : (bplus ? 'plus' : null), choice };
    if (choice === 3) return { ending: 'B', variant: bplus ? 'plus' : null, choice };
    if (choice === 1) return { ending: 'A', variant: null, choice };
    if (choice === 2) return { ending: 'D', variant: null, choice };
    return { ending: 'C', variant: null, choice };
  }

  function markSeen(ending) {
    try {
      const key = 'dontknow.mvp.endingsSeen';
      const seen = JSON.parse(localStorage.getItem(key) || '[]');
      const arr = Array.isArray(seen) ? seen : [];
      if (!arr.includes(ending)) arr.push(ending);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {  }
  }

  async function playEnding(result) {
    injectCSS();
    ensureLayer();
    const S = G.S || {};
    if (S.v) {
      S.v.ending = result.ending;
      S.v.ending_variant = result.variant || '';
    }
    try {
      S.session = 'S14';
      S.sessionDone = S.sessionDone || {};
      S.sessionDone.S13 = true;
      S.sessionDone.S14 = true;
    } catch (e) {  }
    try {
      S.ov = null; S.call = null; S.banner = null; S.mono = null; S.phoneUp = false;
      if (typeof G.refresh === 'function') G.refresh();
    } catch (e) {  }

    if (result.ending === 'A') await playA();
    else if (result.ending === 'B') await playB(result.variant);
    else if (result.ending === 'C') await playC();
    else if (result.ending === 'D') await playD();
  }

  function resolveEnding() {
    injectCSS();
    const S = G.S || {};
    const choice = S.v ? S.v.s13_choice : null;
    const result = decide(choice);
    markSeen(result.ending);

    document.querySelectorAll('.s13-fade').forEach((el) => el.remove());
    document.body.classList.remove('dk-s13-lock', 's13-choice1');

    ensureLayer();
    layer.className = 'dk-ending on';
    layer.innerHTML = '';
    setTimeout(() => {
      playEnding(result).catch((err) => console.error('[DONTKNOW ending]', err));
    }, 0);
    return result;
  }

  injectCSS();
  G.resolveEnding = resolveEnding;
  window.resolveEnding = resolveEnding;
  window.DKEndings = { resolveEnding, decide, playEnding };
  if (typeof G.defSession === 'function') G.defSession('S14', () => resolveEnding());
})();
