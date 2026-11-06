/* S12 — 추적과 도피 (20:30 → 22:40)
   유진 통화(A-1/A-2/A-3) → 준호(B-1/B-2/B-3) → 22:40 형 착신 → 주차장 출발 시트 */
(function () {
  const G = window.__game || window.DK;
  if (!G) return;
  const $ = (s, el = document) => el.querySelector(s);
  const has = (k) => G.has(k);
  const flag = (k) => G.flag(k);
  const say = (who, text, extra) => G.SAY(who, [], text, extra);
  const SAY = G.SAY, DO = G.DO, WAIT = G.WAIT, GOTO = G.GOTO, LABEL = G.LABEL, END = G.END;

  function morph(parent, html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    const keyOf = (n) => (n.nodeType === 1 ? n.getAttribute('data-k') : null);
    const same = (x, y) => x.nodeType === y.nodeType && x.nodeName === y.nodeName && keyOf(x) === keyOf(y);
    const patch = (x, y) => {
      if (x.nodeType !== 1) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; return; }
      for (const at of [...x.attributes]) if (!y.hasAttribute(at.name)) x.removeAttribute(at.name);
      for (const at of y.attributes) if (x.getAttribute(at.name) !== at.value) x.setAttribute(at.name, at.value);
      patchKids(x, y);
    };
    const patchKids = (a, b) => {
      const keyed = new Map();
      for (const c of a.children) { const k = keyOf(c); if (k) keyed.set(k, c); }
      let cur = a.firstChild;
      for (const y of [...b.childNodes]) {
        let x = cur;
        const k = keyOf(y);
        if (k) { x = keyed.get(k); if (x && x !== cur) a.insertBefore(x, cur); }
        if (x && same(x, y)) { patch(x, y); cur = x.nextSibling; } else a.insertBefore(y, cur);
      }
      while (cur) { const n = cur.nextSibling; a.removeChild(cur); cur = n; }
    };
    patchKids(parent, tpl.content);
  }

  // ───────── 장소 ─────────
  G.defPlace({
    id: 'parking', name: '성원 공영주차장', scene: 'scene_parking_b3',
    travelMin: { home: 25, school: 35, police: 20, mart: 20, pharmacy: 20 },
  });

  // ───────── 유진 통화 ─────────
  const yCount = () => Number((G.S.v && G.S.v.s12_y_count) || 0);
  const yInc = () => { G.S.v = G.S.v || {}; G.S.v.s12_y_count = yCount() + 1; };
  const yUsed = (id) => flag('S12.y.' + id);
  const yCan = (id) => () => yCount() < 3 && !yUsed(id);
  const yPick = (id) => () => { G.setFlag('S12.y.' + id); yInc(); };

  G.defDialogue('S12.yujin', [
    say('yujin', '…네.'),

    LABEL('yMenu'),
    G.CHOICE([
      {
        label: { c: '너도… 거기서 나오고 싶었던 거 아니냐.' },
        cond: () => has('KX-21') && !flag('F-01') && yCan('06')(),
        do: () => { yPick('06')(); G.setFlag('FX-06'); },
        then: [say('yujin', '…'), GOTO('yMenu')],
      },
      {
        label: { c: '그 봉투, 네가 두고 간 거지?' },
        cond: () => has('K-18') && yCan('01')(),
        do: yPick('01'),
        then: [say('yujin', '…'), WAIT(3000), GOTO('yMenu')],
      },
      {
        label: { c: '준호 얘기. 그거 다 거짓말이었지?' },
        cond: () => has('K-17') && yCan('02')(),
        do: yPick('02'),
        then: [say('yujin', '…네.'), GOTO('yMenu')],
      },
      {
        label: { c: '아까 우리 집에 온 사람. 네가 보낸 거지?' },
        cond: () => has('KX-08') && yCan('03')(),
        do: yPick('03'),
        then: [say('yujin', '형이 시켰어요.'), GOTO('yMenu')],
      },
      {
        label: { c: '도현이 지금 어디 있냐.' },
        cond: yCan('07'),
        do: yPick('07'),
        then: [GOTO('yMenu')],
      },
      {
        label: { c: '…그래. 고맙다.' },
        cond: () => flag('F-01') && yCan('08')(),
        do: yPick('08'),
        then: [say('yujin', '…네.'), GOTO('yMenu')],
      },
    ]),

    // 3개를 고르면 위 CHOICE가 비고 여기로 떨어진다.
    DO(() => {
      const S = G.S;
      const d = S.dlg;
      const a2 = flag('F-01');
      const a1 = !a2 && has('K-17') && has('K-22') && has('KX-21') && flag('FX-06');
      const code = a2 ? 'A-2' : (a1 ? 'A-1' : 'A-3');
      S.v = S.v || {};
      S.v.branchA = code; S.v.branch_A = code;
      S.branch = S.branch || {}; S.branch.A = code;
      G.setFlag('S12.yujinVerdict');
      const lines = [];
      if (code === 'A-1') {
        G.setFlag('S12.yujinConfess');
        lines.push(
          say('yujin', '…나가고 싶었어요.'),
          say('yujin', '도현이가 같이 나가자고 했었는데.'),
          say('yujin', '그거, 제가 둔 거 맞아요.'),
          say('yujin', '내일 그 형사님한테 갈게요.')
        );
      } else if (code === 'A-2') {
        lines.push(say('yujin', '아버님, 저도 걱정돼서 그래요, 혹시 뭐 알게 되신 거 있으면, 저한테 먼저 말씀해 주세요, 도현이 일은 제가…'));
      } else {
        G.setFlag('S12.yujinGone');
        if (flag('S12.y.06') && !a1) lines.push(say('yujin', '…그런 거 없어요.'));
        lines.push(
          say('yujin', '그거, 제가 둔 거 맞아요. 도현이 좋아했어요, 진짜로. …저 이제 도망갈 거예요. 죄송해요.'),
          say('yujin', "형이 다 지우라고 했는데, 안 보낸 문자가 하나 있더라고요. '아빠, 나 사실.' 그거 보고 못 지우겠더라고요. 저는… 그런 거 보낼 사람이 없어서.")
        );
      }
      if (flag('S12.y.07')) {
        if (code === 'A-1') lines.push(say('yujin', '형 오피스텔이요. 주소는… 내일 형사님한테 말할게요.'));
        else if (code === 'A-2') lines.push(say('yujin', '저도 몰라요, 그래서 이렇게 걱정하는 거고요.'));
        else lines.push(say('yujin', '…몰라요. 진짜로.'));
      }
      if (d) d.queue.unshift(...lines, END());
    }),
  ], { onEnd: afterYujin });

  function dialYujin() {
    G.runDialogue('S12.yujin', { channel: 'call', who: 'yujin', opening: '' });
  }
  function afterYujin() {
    G.later(800, () => { if (G.S.call) G.endCall(); }, 'S12.yujin.end');
    G.later(1600, () => { if (G.S.session === 'S12') afterYujinNext(); }, 'S12.yujin.next');
  }
  function setBranchB(code) {
    G.S.v = G.S.v || {};
    G.S.v.branchB = code; G.S.v.branch_B = code;
    G.S.branch = G.S.branch || {}; G.S.branch.B = code;
  }
  function afterYujinNext() {
    if (flag('F-02b')) {
      setBranchB('B-1');
      G.later(60000, showJunhoIncoming, 'S12.b1');
      return;
    }
    G.later(1000, showJunhoPrompt, 'S12.junho.prompt');
  }

  // ───────── 준호 ─────────
  function showJunhoIncoming() {
    if (G.S.session !== 'S12') return;
    G.setFlag('S12.junhoIncoming');
    G.S.ov = { type: 'incoming', name: '준호', from: 'junho' };
    G.refresh();
  }

  G.defDialogue('S12.b1', [
    say('junho', '아저씨… 형이… 빼준다고 했었는데.'),
    DO(() => {
      if (has('KX-07')) return;
      G.grant('KX-07');
      const d = G.S.dlg;
      if (d) d.queue.unshift(say('junho', '저 중3 때부터예요'));
    }),
    DO(() => {
      const d = G.S.dlg;
      if (!d) return;
      d.queue.unshift(say('junho', flag('F-03') ? '경찰서에 같이 가요.' : '아저씨랑 같이 경찰서 가도 돼요?'));
    }),
    DO(() => {
      G.setFlag('FX-08');
      G.setFlag('S12.b1');
      setBranchB('B-1');
    }),
    END(),
  ], {
    onEnd: () => {
      G.later(700, () => { if (G.S.call) G.endCall(); }, 'S12.b1.end');
      finishBranch();
    },
  });

  G.defDialogue('S12.b2', [
    say('junho', '아저씨도 신고하셨다면서요. …저 살고 싶어요.'),
    DO(() => {
      G.setFlag('S12.b2');
      G.setFlag('RE.12.pending');
      setBranchB('B-2');
    }),
    END(),
  ], {
    onEnd: () => {
      G.later(800, () => { if (G.S.call) G.endCall(); }, 'S12.b2.end');
      finishBranch();
    },
  });

  function runB1() {
    G.runDialogue('S12.b1', { channel: 'call', who: 'junho', opening: '' });
  }
  function runB2() {
    G.runDialogue('S12.b2', { channel: 'call', who: 'junho', opening: '' });
  }
  function simulateDeadCall(name, text, done) {
    G.S.call = { kind: 'dead', name, state: 'ring', since: Date.now(), lines: [], deadText: text };
    G.S.ov = { type: 'call' };
    G.refresh();
    G.later(1800, () => { if (G.S.call) { G.S.call.state = 'dead'; G.refresh(); } }, 'S12.dead');
    G.later(3600, () => { if (G.S.call) G.endCall(); if (done) done(); }, 'S12.dead');
  }
  function callB3() {
    hideS12();
    simulateDeadCall('준호', '받지 않습니다.', () => {
      G.addContact({ id: 'detective', name: '성원경찰서 김태윤', num: '010-XXXX-1182', kind: 'normal', th: 'detective' });
      G.addMsg('detective', G.nowMsg('them', '박준호 학생 저희가 먼저 데려왔습니다.'));
      G.setFlag('S12.b3');
      setBranchB('B-3');
      finishBranch();
    });
  }

  function showJunhoPrompt() {
    if (G.S.session !== 'S12') return;
    if (flag('S12.branchDone')) return;
    AUX.open = true;
    AUX.mode = 'junho';
    renderS12();
  }
  function junhoCall() {
    hideS12();
    if (flag('F-02b')) { runB1(); return; }
    if (flag('F-03') && flag('F-02')) { callB3(); return; }
    runB2();
  }

  function finishBranch() {
    if (flag('S12.branchDone')) return;
    G.setFlag('S12.branchDone');
    G.later(20000, ringHyung, 'S12.hyung');
  }

  // ───────── 22:40 형 착신 ─────────
  function ringHyung() {
    if (G.S.session !== 'S12') return;
    G.S.clock = [22, 40];
    G.S.place = 'home';
    G.S.stack = [];
    G.S.ov = null;
    G.S.call = null;
    G.setFlag('S12.hyungRinging');
    G.S.ov = { type: 'incoming', name: '010-5XXX-0091', from: 'hyung' };
    G.refresh();
  }
  G.defDialogue('S12.hyung', [
    DO(() => {
      const d = G.S.dlg;
      if (!d) return;
      const line = flag('F-03')
        ? '경찰서 다녀오셨다면서요. 그래도 혼자 오세요.'
        : '아버님. 이제 얼굴 한번 봬야죠. 성원 공영주차장, 지하 3층. 열한 시요. 혼자 오세요.';
      d.queue.unshift(say('hyung', line));
    }),
    END(),
  ], { onEnd: afterHyung });

  function runHyung() {
    G.S.v = G.S.v || {};
    G.S.v.hyung_0091_calls = (Number(G.S.v.hyung_0091_calls) || 0) + 1;
    G.runDialogue('S12.hyung', { channel: 'call', who: 'hyung', opening: '' });
  }
  function afterHyung() {
    G.later(800, () => { if (G.S.call) G.endCall(); }, 'S12.hyung.end');
    G.later(1400, showDeparture, 'S12.depart');
  }
  function declineHyung() {
    if (!flag('S12.hyungRinging')) return;
    G.S.flags['S12.hyungRinging'] = false;
    G.later(20000, ringHyung, 'S12.hyung.retry');
    G.S.banner = { title: '010-5XXX-0091', body: '아버님, 받으세요.', id: '', kind: 'msg' };
    G.refresh();
    G.later(4200, () => {
      if (G.S.banner && G.S.banner.body === '아버님, 받으세요.') {
        G.S.banner.out = true; G.refresh();
        G.later(280, () => {
          if (G.S.banner && G.S.banner.body === '아버님, 받으세요.') { G.S.banner = null; G.refresh(); }
        }, 'S12.banner');
      }
    }, 'S12.banner');
  }

  // ───────── 출발 시트 ─────────
  const AUX = { open: false, mode: null };
  function layer() {
    let el = $('#s12-layer');
    if (!el) {
      el = document.createElement('div');
      el.id = 's12-layer';
      el.className = 's12-layer';
      $('#screen').appendChild(el);
    }
    return el;
  }
  function hideS12() {
    AUX.open = false;
    AUX.mode = null;
    const el = $('#s12-layer');
    if (el) el.classList.remove('show');
    hideResume();
  }
  function renderS12() {
    const el = layer();
    el.classList.toggle('show', AUX.open);
    if (!AUX.open) return;
    if (AUX.mode === 'junho') {
      morph(el, `<div class="s12-backdrop"></div><div class="s12-sheet">
        <div class="s12-grab"></div><div class="s12-kicker">연락처</div><div class="s12-name">준호</div>
        <div class="s12-sub">아랫집 103호 · 010-XXXX-0315</div>
        <div class="s12-contact"><div><div class="s12-cn">준호</div><div class="s12-cp">아랫집 · 도현이 친구</div></div>
          <button class="s12-call" data-s12="junho-call" aria-label="전화"><svg viewBox="0 0 34 34"><path d="M11.2 7.3c.7-.1 1.3.3 1.6.9l1.8 3.9c.3.6.1 1.3-.3 1.8l-1.7 1.6a14 14 0 0 0 6 6l1.6-1.7c.5-.5 1.2-.6 1.8-.3l3.9 1.8c.6.3 1 .9.9 1.6l-.5 2.7c-.1.8-.8 1.4-1.6 1.4C15 27 7.3 19 7.3 9.4c0-.8.6-1.5 1.4-1.6z"/></svg></button></div>
        <div class="s12-btns"><button class="ghost" data-s12="junho-later">나중에</button></div>
      </div>`);
      return;
    }
    morph(el, `<div class="s12-backdrop"></div><div class="s12-sheet">
      <div class="s12-grab"></div><div class="s12-kicker">길찾기</div>
      <div class="s12-name">성원 공영주차장</div>
      <div class="s12-sub">지하 3층 · 23:00 도착 · 25분</div>
      <div class="s12-btns"><button class="primary" data-s12="depart">출발</button><button class="ghost" data-s12="later">나중에</button></div>
      <div class="s12-note">도착 예정 23:00.</div>
    </div>`);
  }
  let resumeEl = null;
  function hideResume() {
    if (resumeEl) { resumeEl.remove(); resumeEl = null; }
  }
  function showResume() {
    hideResume();
    resumeEl = document.createElement('button');
    resumeEl.className = 's12-resume';
    resumeEl.dataset.s12 = 'resume';
    resumeEl.textContent = '성원 공영주차장 · 출발';
    $('#screen').appendChild(resumeEl);
  }
  function showDeparture() {
    if (G.S.session !== 'S12') return;
    G.setFlag('S12.departureShown');
    G.registerDest('parking');
    AUX.open = true;
    AUX.mode = 'depart';
    renderS12();
  }
  function depart() {
    hideS12();
    G.setFlag('S12.ended');
    G.endSession('S12');
    if (flag('RE.12.pending')) {
      G.addContact({ id: 'junho_mom', name: '103호', num: '010-XXXX-6103', kind: 'normal', th: 'junho_mom' });
      G.later(1500, () => {
        G.addMsg('junho_mom', G.nowMsg('them', '도현이 아버지… 우리 준호가 집에 안 들어와요.'));
      }, 'S12.re12');
    }
    G.startTravel('parking');
    if (!G.S.travel) {
      if (typeof window.startS13 === 'function') window.startS13('arrive');
      else G.startSession('S13');
    }
  }

  // ───────── 입력 ─────────
  function onS12Click(e) {
    const el = e.target.closest && e.target.closest('[data-s12]');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    const a = el.dataset.s12;
    if (a === 'junho-call') { junhoCall(); return; }
    if (a === 'junho-later') { hideS12(); G.later(30000, showJunhoPrompt, 'S12.junho.reprompt'); return; }
    if (a === 'depart') { depart(); return; }
    if (a === 'later') { hideS12(); showResume(); return; }
    if (a === 'resume') { hideResume(); showDeparture(); return; }
  }
  function onDecline(e) {
    if (G.S.session !== 'S12') return;
    const el = e.target.closest && e.target.closest('[data-act="decline"]');
    if (!el) return;
    if (flag('S12.junhoIncoming')) {
      G.S.flags['S12.junhoIncoming'] = false;
      G.later(5000, showJunhoPrompt, 'S12.junho.prompt');
      return;
    }
    if (flag('S12.hyungRinging')) declineHyung();
  }
  function onYujinDial(e) {
    if (!flag('S12.yujinGone')) return;
    const el = e.target.closest && e.target.closest('[data-act="dial"]');
    if (!el) return;
    const num = el.dataset.num || '';
    if (!/3927|4417/.test(num)) return;
    e.preventDefault();
    e.stopPropagation();
    G.S.call = { kind: 'dead', name: '차유진', state: 'dead', since: Date.now(), lines: [], deadText: '없는 번호' };
    G.S.ov = { type: 'call' };
    G.refresh();
    G.later(2600, () => { if (G.S.call && G.S.call.kind === 'dead') G.endCall(); }, 'S12.yujin.gone');
  }

  // ───────── 세션 시작 ─────────
  function startS12() {
    const S = G.S;
    if (S.session === 'S12' && flag('S12.active')) return;
    if (typeof window.closeS11UI === 'function') window.closeS11UI();
    if (window.OldPhone) window.OldPhone.setDevice('father');
    G.clearGroup('S12');
    S.phase = 'free';
    S.clock = [20, 30];
    S.place = 'home';
    S.unlocked = true;
    S.stack = [];
    S.ov = null;
    S.call = null;
    S.dlg = null;
    S.phoneUp = false;
    S.travel = null;
    S.routePlace = null;
    S.banner = null;
    S.mono = null;
    S.v = S.v || {};
    S.v.s12_y_count = 0;
    S.v.branchA = null; S.v.branch_A = null; S.v.branchB = null; S.v.branch_B = null;
    G.startSession('S12');
    G.setFlag('S12.active');
    G.addContact({ id: 'yujin', name: '차유진', num: '010-XXXX-4417', kind: 'normal', th: 'yujin' });
    G.refresh();
    G.later(700, () => { if (G.S.session === 'S12') dialYujin(); }, 'S12.start');
  }
  window.startS12 = startS12;
  G.startS12 = startS12;
  G.defSession('S12', () => window.startS12());

  // ───────── 훅 ─────────
  G.onAccept(() => {
    if (G.S.session !== 'S12') return false;
    if (flag('S12.junhoIncoming')) {
      G.S.flags['S12.junhoIncoming'] = false;
      runB1();
      return true;
    }
    if (flag('S12.hyungRinging')) {
      G.S.flags['S12.hyungRinging'] = false;
      runHyung();
      return true;
    }
    return false;
  });

  G.onArrive('parking', () => {
    if (typeof window.startS13 === 'function') window.startS13('arrive');
    else G.startSession('S13');
  });

  document.addEventListener('click', onS12Click, true);
  document.addEventListener('click', onDecline, true);
  document.addEventListener('click', onYujinDial, true);
})();
