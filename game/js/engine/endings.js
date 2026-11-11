/* 엔딩 판정·연출·다시 보기. 설계: PROGRESSION_AND_ENDINGS 6.4~6.5, BUSINESS_RULES BR-28·BR-29. */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const TRACE_LABEL = {
    'TR-01': '계정 보안 알림이 남았다',
    'TR-02': '메시지를 읽었다',
    'TR-03': '활동 상태가 보였다',
    'TR-04': 'DM을 읽었다',
    'TR-05': '스토리를 조회했다',
    'TR-06': '화면을 캡처했다',
    'TR-07': '사진이 동기화됐다',
    'TR-08': '메모·미리 알림이 동기화됐다',
    'TR-09': '예약 메일에 손댔다',
    'TR-10': '새 기기로 로그인했다',
    'TR-11': '기기 소리를 울렸다',
    'TR-12': '집중 모드를 함께 껐다',
    'TR-13': '음성 메모를 동기화했다',
    'TR-14': '좋아요·댓글을 남겼다',
    'TR-15': '계정 암호를 바꿨다',
    'TR-16': '위치 공유를 요청했다',
    'TR-17': '한끼로 다시 주문했다',
    'TR-18': '메일을 보냈다',
    'TR-19': '사칭 계정에 답했다',
  };

  function flags() { return (LM.G && LM.G.flags) || {}; }
  function threatResolved() {
    const f = flags();
    return !!(f.REC_SENT || f.NAME_SENT || f.PLATE_SENT || f.REC === 'synced');
  }

  function choose() {
    const f = flags();
    const loc = f.LOC;
    const exact = loc === 'exact';
    if (f.WIPE_SLATE || (f.LEAK && !(f.GO && exact)) || (f.WIPED && f.REC === 'lost' && !exact)) return 'D';
    if (f.MAIL === 'deleted' && !(f.REC_SENT || f.NAME_SENT || f.PLATE_SENT)) return 'B';
    if (f.GO && exact && threatResolved() && f.CONFESS) return 'A';
    if (f.GO && exact && threatResolved()) return 'A′';
    return 'C';
  }

  function endingSVG(kind) {
    const base = '<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
    const defs = '<defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141a23"/><stop offset="1" stop-color="#07090c"/></linearGradient>' +
      '<radialGradient id="el" cx=".5" cy=".42" r=".55"><stop offset="0" stop-color="#d9e6ff" stop-opacity=".4"/><stop offset="1" stop-color="#d9e6ff" stop-opacity="0"/></radialGradient></defs>';
    if (kind === 'A' || kind === 'A′') {
      return base + defs + '<rect width="390" height="844" fill="url(#eg)"/>' +
        '<rect x="104" y="220" width="182" height="380" rx="4" fill="#3a2d22"/>' +
        '<rect x="112" y="228" width="166" height="364" rx="3" fill="#0b0a09"/>' +
        '<rect x="112" y="228" width="166" height="364" rx="3" fill="url(#el)"/>' +
        '<ellipse cx="195" cy="420" rx="250" ry="300" fill="url(#el)"/>' +
        (kind === 'A'
          ? '<g fill="#07090c"><circle cx="160" cy="470" r="20"/><path d="M128 560c0-30 14-46 32-46s32 16 32 46z"/><circle cx="245" cy="466" r="20"/><path d="M213 558c0-32 15-48 32-48s32 16 32 48z"/></g>'
          : '<g fill="#07090c"><circle cx="138" cy="480" r="18"/><path d="M110 560c0-28 12-44 28-44s28 16 28 44z"/><circle cx="252" cy="480" r="18"/><path d="M224 560c0-28 12-44 28-44s28 16 28 44z"/></g>') +
        '<rect width="390" height="844" fill="#000" opacity=".18"/></svg>';
    }
    if (kind === 'B') {
      return base + defs + '<rect width="390" height="844" fill="#17130f"/>' +
        '<rect x="0" y="520" width="390" height="324" fill="#0d0b09"/>' +
        '<rect x="40" y="180" width="180" height="150" rx="4" fill="#0b0d11" stroke="#2c2a26" stroke-width="3"/>' +
        '<rect x="50" y="190" width="160" height="130" fill="#24303f" opacity=".5"/>' +
        '<ellipse cx="200" cy="500" rx="250" ry="260" fill="url(#el)"/>' +
        '<g fill="#0a0908"><circle cx="210" cy="470" r="24"/><path d="M170 610c0-44 18-70 40-70s40 26 40 70z"/></g>' +
        '<rect width="390" height="844" fill="#000" opacity=".2"/></svg>';
    }
    if (kind === 'C') {
      return base + defs + '<rect width="390" height="844" fill="#0d1117"/>' +
        '<rect x="0" y="170" width="390" height="10" fill="#2a3647"/>' +
        '<rect x="40" y="180" width="310" height="360" fill="#274057" opacity=".32"/>' +
        '<g stroke="#4b6a88" stroke-width="3" opacity=".5"><line x1="195" y1="180" x2="195" y2="540"/><line x1="40" y1="360" x2="350" y2="360"/></g>' +
        '<g fill="#06080b"><circle cx="150" cy="420" r="26"/><path d="M108 560c0-44 18-72 42-72s42 28 42 72z"/></g>' +
        '<ellipse cx="210" cy="420" rx="240" ry="240" fill="url(#el)"/>' +
        '<rect width="390" height="844" fill="#000" opacity=".22"/></svg>';
    }
    return base + defs + '<rect width="390" height="844" fill="url(#eg)"/>' +
      '<rect x="92" y="200" width="206" height="400" rx="4" fill="#332a22"/>' +
      '<rect x="100" y="208" width="190" height="384" fill="#090909"/>' +
      '<ellipse cx="195" cy="430" rx="230" ry="300" fill="url(#el)"/>' +
      '<rect width="390" height="844" fill="#000" opacity=".28"/></svg>';
  }

  const CAPTIONS = {
    A: [
      '새벽, 해담고시텔 2층 복도. 207호 문이 열린다.',
      '경찰서 앞, 두 사람의 뒷모습.',
    ],
    'A′': [
      '같은 경찰서 앞. 두 사람 사이에 한 사람만큼의 간격이 있다.',
      '말하지 않은 것이 남았다.',
    ],
    B: [
      '집 거실. 도현이 돌아와 있다.',
      '폰이 울린다.',
    ],
    C: [
      '진술실 유리 너머로 도현이 보인다.',
      '도현: "아빠가 왜 여기 있어."',
    ],
    D: [
      '빈 고시텔 방. 창문만 열려 있다.',
    ],
  };

  function phoneScreen(kind) {
    const wrap = h('div', { class: 'end-phone' });
    if (kind === 'A') {
      wrap.append(
        h('div', { class: 'end-phone-top' }, '아빠'),
        h('div', { class: 'end-phone-body' },
          h('div', { class: 'end-msg in' }, '아빠'),
          h('div', { class: 'end-read' }, '읽음')));
    } else if (kind === 'A′') {
      wrap.append(
        h('div', { class: 'end-phone-top' }, '메모'),
        h('div', { class: 'end-phone-body' },
          h('div', { class: 'end-note-title' }, '남은 거'),
          h('div', { class: 'end-note-body' }, '48,200,000')));
    } else if (kind === 'B') {
      wrap.append(
        h('div', { class: 'end-phone-top' }, '블링크'),
        h('div', { class: 'end-phone-body' },
          h('div', { class: 'end-msg in' }, '찾았다')));
    } else if (kind === 'C') {
      wrap.append(
        h('div', { class: 'end-phone-top' }, '보낸편지함'),
        h('div', { class: 'end-phone-body' },
          h('div', { class: 'end-mail-subj' }, '자수하겠습니다'),
          h('div', { class: 'end-mail-time' }, '09:00 발송')));
    } else {
      wrap.append(
        h('div', { class: 'end-phone-top' }, '메시지'),
        h('div', { class: 'end-phone-body' },
          h('div', { class: 'end-msg out' }, '아빠 미안'),
          h('div', { class: 'end-fail' }, '전송 실패')));
    }
    return wrap;
  }

  function epilogue(kind) {
    const f = flags();
    const out = [];
    const holdRec = f.REC === 'device' || f.REC === 'synced' || f.REC === 'sent';
    if (f.REC_SENT || f.NAME_SENT || f.PLATE_SENT || ((kind === 'A' || kind === 'A′') && holdRec)) out.push('강민석, 전기통신금융사기 혐의로 구속.');
    else out.push('실장K는 아직 잡히지 않았다.');
    if (kind === 'A' || kind === 'A′' || kind === 'C') out.push('김*자 씨의 1,500만 원 반환 절차가 시작됐다.');
    if (f.HARIN === 'apologized') out.push('박하린은 첫 공판에 왔다. 아버지는 맨 뒷줄에 앉았다.');
    if (kind === 'A') out.push('한결캐피탈 잔여원금 48,200,000원. 상환 계좌 입금자: 이상철.');
    if (LM.G && LM.G.dlg && Number(LM.G.dlg.turns && LM.G.dlg.turns.MJ) >= 3) out.push('윤민지도 그 주에 경찰서에 갔다.');
    return out;
  }

  function show(kind) {
    const dev = document.querySelector('.device');
    if (!dev || dev.querySelector('.cine-ending')) return;
    const captions = CAPTIONS[kind] || CAPTIONS.C;
    const host = h('div', { class: 'end-stage' });
    const advance = h('button', { class: 'end-advance', onclick: () => next() }, '다음');
    const el = h('div', { class: 'cine-ending', role: 'dialog', 'aria-label': '엔딩' },
      h('div', { class: 'end-frames', html: endingSVG(kind) }),
      host, advance);
    let step = 0;
    const total = 4;
    const draw = () => {
      advance.textContent = step < total - 1 ? '다음' : '닫기';
      advance.style.display = step >= 3 ? 'none' : '';
      host.replaceChildren();
      if (step === 0) {
        host.appendChild(h('div', { class: 'end-caption' }, captions.map((c) => h('p', null, c))));
      } else if (step === 1) {
        host.appendChild(h('div', { class: 'end-caption end-phone-cap' }, h('p', null, '마지막 폰 화면')));
        host.appendChild(phoneScreen(kind));
      } else if (step === 2) {
        host.appendChild(h('div', { class: 'end-credits' },
          h('div', { class: 'end-credit-title' }, 'DONTKNOW'),
          epilogue(kind).map((line) => h('p', null, line)),
          h('div', { class: 'end-credit-foot' }, 'v6.2')));
      } else {
        host.appendChild(replay(kind));
      }
    };
    const next = () => {
      if (step >= 3) return;
      if (step < total - 1) { step++; draw(); }
      else el.remove();
    };
    el.addEventListener('click', (e) => { if (e.target.closest('button')) return; next(); });
    draw();
    dev.appendChild(el);
  }

  function replay(kind) {
    const g = LM.G || {};
    const opened = Array.isArray(g.openedApps) ? g.openedApps : [];
    const totalApps = LM.APPS ? Object.keys(LM.APPS).length : 30;
    const notOpened = Math.max(0, totalApps - opened.filter((id, i) => opened.indexOf(id) === i).length);
    const traces = Object.keys(g.traces || {}).map((id) => TRACE_LABEL[id] || id);
    const reset = () => {
      const el = document.querySelector('.cine-ending'); if (el) el.remove();
      LM.newGame();
      if (LM.refreshShell) LM.refreshShell();
      if (LM.prologue) LM.prologue.play();
    };
    const load = () => {
      const el = document.querySelector('.cine-ending'); if (el) el.remove();
      LM.loadGame('auto');
      if (LM.refreshShell) LM.refreshShell();
    };
    return h('div', { class: 'end-replay' },
      h('h2', null, '다시 보기'),
      h('div', { class: 'end-stat' }, '열어 보지 않은 앱 기능 ', h('b', null, String(notOpened)), '개'),
      h('div', { class: 'end-stat' }, '남긴 흔적 ', h('b', null, String(traces.length)), '개'),
      traces.length ? h('div', { class: 'end-traces' }, traces.map((t) => h('div', { class: 'end-trace' }, t))) : h('div', { class: 'end-traces' }, h('div', { class: 'end-trace' }, '남긴 흔적이 없다.')),
      h('div', { class: 'end-btns' },
        h('button', { class: 'btn filled m', onclick: reset }, '처음부터'),
        h('button', { class: 'btn gray m', onclick: load }, '마지막 저장에서')));
  }

  function judge(reason) {
    const g = LM.G;
    if (!g) return null;
    if (g.ending && g.ending.shown) return g.ending;
    const kind = choose();
    g.ending = { kind: kind, at: g.gameMs, reason: reason || null, shown: false };
    if (typeof LM.meta !== 'undefined' && LM.meta && LM.meta.recordEnding) LM.meta.recordEnding(kind);
    LM.logEvent('ending', { kind: kind, reason: reason || null });
    LM.emit('ending', { kind: kind, reason: reason || null });
    show(kind);
    g.ending.shown = true;
    LM.saveGame('auto');
    return g.ending;
  }

  LM.endings = {
    judge: judge,
    choose: choose,
    threatResolved: threatResolved,
    labels: { A: '알았어', 'A′': '말하지 않은 것', B: '모르는 척', C: '늦은 답장', D: '읽음' },
  };
})();
