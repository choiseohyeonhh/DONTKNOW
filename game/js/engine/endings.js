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
    const defs = '<defs>' +
      '<linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151b24"/><stop offset="1" stop-color="#07090c"/></linearGradient>' +
      '<radialGradient id="el" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#d9e6ff" stop-opacity=".38"/><stop offset="1" stop-color="#d9e6ff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c79d" stop-opacity=".55"/><stop offset="1" stop-color="#d9c79d" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#93b6d8" stop-opacity=".22"/><stop offset="1" stop-color="#93b6d8" stop-opacity=".06"/></linearGradient>' +
      '</defs>';
    const vignette = '<rect width="390" height="844" fill="#000" opacity=".18"/>';

    if (kind === 'A') {
      /* 새벽 해담고시텔 2층 복도. 문 하나가 열리고 빛이 새어 나온다. */
      return base + defs +
        '<rect width="390" height="844" fill="url(#eg)"/>' +
        '<path d="M0 0h390v844H0z" fill="#10141b"/>' +
        '<path d="M0 844V300L195 214l195 86v544z" fill="#151a22"/>' +
        '<path d="M0 844V300L195 214v630z" fill="#1b222c"/>' +
        '<path d="M195 214v630M0 328h390" stroke="#2b3442" stroke-width="2"/>' +
        '<path d="M0 844L195 548l195 296z" fill="#0a0c10"/>' +
        '<ellipse cx="195" cy="280" rx="215" ry="170" fill="url(#el)"/>' +
        '<g>' +
        '<rect x="28" y="326" width="116" height="232" rx="3" fill="#231d17" stroke="#352c23" stroke-width="3"/>' +
        '<rect x="38" y="336" width="96" height="212" fill="#17120e"/>' +
        '<rect x="54" y="352" width="26" height="12" rx="2" fill="#4c4338" opacity=".5"/>' +
        '<rect x="246" y="326" width="116" height="232" rx="3" fill="#231d17" stroke="#352c23" stroke-width="3"/>' +
        '<rect x="256" y="336" width="96" height="212" fill="#17120e"/>' +
        '<rect x="58" y="596" width="108" height="190" rx="3" fill="#1e1914" stroke="#302820" stroke-width="3"/>' +
        '<rect x="224" y="596" width="108" height="190" rx="3" fill="#1e1914" stroke="#302820" stroke-width="3"/>' +
        '</g>' +
        '<g>' +
        /* 열린 문: 안쪽 어둠과 복도로 새는 빛 */
        '<rect x="224" y="596" width="108" height="190" rx="2" fill="#050607"/>' +
        '<path d="M226 596l104 188h-104z" fill="#c9a76b" opacity=".2"/>' +
        '<path d="M248 812l48-14v26h-48z" fill="url(#warm)" opacity=".55"/>' +
        '<rect x="330" y="608" width="6" height="44" rx="3" fill="#c9b47a" opacity=".55"/>' +
        '<rect x="236" y="620" width="34" height="16" rx="2" fill="#c9b47a" opacity=".85"/>' +
        '<text x="240" y="632" fill="#2b2318" font-size="11" font-family="sans-serif">207</text>' +
        '</g>' +
        '<ellipse cx="195" cy="650" rx="250" ry="220" fill="url(#el)" opacity=".22"/>' +
        vignette + '</svg>';
    }
    if (kind === 'A′' || kind === 'A-police') {
      /* 같은 경찰서 앞. A는 두 사람이 붙어 있고, A′는 한 사람만큼 벌어져 있다. */
      const gap = kind === 'A′';
      const x1 = gap ? 126 : 162, x2 = gap ? 258 : 228;
      const y1 = 590, y2 = gap ? 594 : 591;
      return base + defs +
        '<rect width="390" height="844" fill="url(#eg)"/>' +
        '<rect x="0" y="0" width="390" height="120" fill="#0c1016"/>' +
        '<rect x="24" y="150" width="342" height="430" rx="4" fill="#161c26" stroke="#28313f" stroke-width="3"/>' +
        '<rect x="46" y="176" width="298" height="30" fill="#1f2835"/>' +
        '<rect x="66" y="250" width="106" height="260" rx="3" fill="#0d1117" stroke="#2d3745" stroke-width="3"/>' +
        '<rect x="218" y="250" width="106" height="260" rx="3" fill="#0d1117" stroke="#2d3745" stroke-width="3"/>' +
        '<rect x="76" y="260" width="86" height="240" fill="#3e566e" opacity=".22"/>' +
        '<rect x="228" y="260" width="86" height="240" fill="#3e566e" opacity=".22"/>' +
        '<path d="M180 250v260M195 250v260M210 250v260" stroke="#2d3745" stroke-width="2"/>' +
        '<rect x="0" y="580" width="390" height="264" fill="#10141a"/>' +
        '<path d="M40 700h310M70 742h250M100 784h190" stroke="#27303c" stroke-width="10" stroke-linecap="round"/>' +
        '<ellipse cx="195" cy="610" rx="250" ry="180" fill="url(#el)"/>' +
        /* 두 사람의 뒷모습, A′는 사이가 벌어져 있다. 얼굴은 보이지 않는다. */
        '<g fill="#07090c">' +
        '<ellipse cx="' + x1 + '" cy="' + y1 + '" rx="15" ry="18"/><rect x="' + (x1 - 5) + '" y="' + (y1 + 14) + '" width="10" height="12" rx="5"/>' +
        '<path d="M' + (x1 - 32) + ' 704C' + (x1 - 30) + ' 660 ' + (x1 - 18) + ' 626 ' + x1 + ' 618C' + (x1 + 18) + ' 626 ' + (x1 + 30) + ' 660 ' + (x1 + 32) + ' 704Z"/>' +
        '<path d="M' + (x1 - 18) + ' 700l-8 44h13l11-38zM' + (x1 + 18) + ' 700l8 44h-13l-11-38z"/>' +
        '<ellipse cx="' + x2 + '" cy="' + y2 + '" rx="14" ry="17"/><rect x="' + (x2 - 5) + '" y="' + (y2 + 13) + '" width="10" height="12" rx="5"/>' +
        '<path d="M' + (x2 - 30) + ' 704C' + (x2 - 28) + ' 662 ' + (x2 - 16) + ' 630 ' + x2 + ' 622C' + (x2 + 16) + ' 630 ' + (x2 + 28) + ' 662 ' + (x2 + 30) + ' 704Z"/>' +
        '<path d="M' + (x2 - 17) + ' 700l-7 44h12l10-38zM' + (x2 + 17) + ' 700l7 44h-12l-10-38z"/>' +
        '</g>' +
        vignette + '</svg>';
    }
    if (kind === 'B') {
      /* 집 거실. 도현이 돌아와 앉아 있고 폰이 울린다. */
      return base + defs +
        '<rect width="390" height="844" fill="#16120f"/>' +
        '<rect x="22" y="96" width="230" height="250" rx="4" fill="#0b0d11" stroke="#2c2a26" stroke-width="5"/>' +
        '<rect x="34" y="108" width="206" height="226" fill="#0e1620"/>' +
        '<path d="M34 250l60-58 52 44 38-34 56 66v66H34z" fill="#233142" opacity=".7"/>' +
        '<circle cx="206" cy="148" r="16" fill="#5b6b7d" opacity=".55"/>' +
        '<path d="M137 108v226M34 210h206" stroke="#2c2a26" stroke-width="3" opacity=".7"/>' +
        '<rect x="0" y="360" width="390" height="484" fill="#100d0b"/>' +
        '<ellipse cx="190" cy="520" rx="230" ry="190" fill="url(#warm)" opacity=".35"/>' +
        /* 소파 */
        '<rect x="46" y="480" width="298" height="126" rx="22" fill="#2a211a"/>' +
        '<rect x="66" y="444" width="258" height="72" rx="20" fill="#33291f"/>' +
        '<rect x="66" y="596" width="258" height="44" rx="12" fill="#241c15"/>' +
        /* 앉은 사람: 등. 얼굴은 보이지 않는다. */
        '<g fill="#0a0807">' +
        '<ellipse cx="196" cy="476" rx="18" ry="20"/><rect x="190" y="492" width="12" height="12" rx="5"/>' +
        '<path d="M152 596C154 548 172 514 196 508C220 514 238 548 240 596Z"/>' +
        '</g>' +
        '<path d="M160 526c-10 18-12 36-8 54" stroke="#3a2d23" stroke-width="9" fill="none" stroke-linecap="round"/>' +
        '<path d="M232 532c8 16 10 32 7 48" stroke="#3a2d23" stroke-width="8" fill="none" stroke-linecap="round" opacity=".8"/>' +
        /* 탁자와 울리는 폰 */
        '<rect x="222" y="586" width="112" height="12" rx="4" fill="#3a2e23"/>' +
        '<rect x="244" y="598" width="10" height="54" fill="#2a211a"/><rect x="306" y="598" width="10" height="54" fill="#2a211a"/>' +
        '<rect x="286" y="566" width="26" height="18" rx="3" fill="#0a0a0c" stroke="#5b6b7d" stroke-width="2"/>' +
        '<rect x="290" y="570" width="18" height="10" rx="1" fill="#9fc4e8" opacity=".75"/>' +
        '<circle cx="299" cy="566" r="18" fill="url(#el)" opacity=".5"/>' +
        vignette + '</svg>';
    }
    if (kind === 'C') {
      /* 진술실 유리 너머. 도현은 유리에 비친 채 앉아 있다. */
      return base + defs +
        '<rect width="390" height="844" fill="#0c1118"/>' +
        '<rect x="0" y="160" width="390" height="392" fill="#182636"/>' +
        '<rect x="30" y="186" width="330" height="340" fill="url(#glass)"/>' +
        '<g stroke="#4b6a88" stroke-width="3" opacity=".55">' +
        '<line x1="195" y1="186" x2="195" y2="526"/><line x1="30" y1="356" x2="360" y2="356"/>' +
        '<line x1="30" y1="186" x2="360" y2="526" stroke-width="1.5" opacity=".5"/>' +
        '</g>' +
        '<rect x="0" y="552" width="390" height="292" fill="#0a0d12"/>' +
        '<rect x="36" y="560" width="318" height="12" fill="#28313d"/>' +
        '<rect x="74" y="572" width="242" height="14" fill="#1b222d"/>' +
        /* 유리 너머 앉은 사람 */
        '<g fill="#070a0e" opacity=".88">' +
        '<ellipse cx="186" cy="388" rx="21" ry="24"/><rect x="180" y="408" width="12" height="12" rx="5"/>' +
        '<path d="M138 526C140 470 160 430 186 422C212 430 232 470 234 526Z"/>' +
        '</g>' +
        '<rect x="134" y="526" width="104" height="18" rx="7" fill="#070a0e" opacity=".88"/>' +
        '<rect x="70" y="588" width="250" height="64" rx="6" fill="#141b24"/>' +
        /* 의자 등받이, 이쪽에서 본 실루엣 */
        '<path d="M150 652h90l-8 96h-74z" fill="#0a0d12"/>' +
        '<path d="M168 748h54M186 748v42M204 748v42" stroke="#1c242f" stroke-width="8" stroke-linecap="round"/>' +
        '<ellipse cx="195" cy="420" rx="240" ry="240" fill="url(#el)" opacity=".3"/>' +
        vignette + '</svg>';
    }
    /* D: 빈 고시텔 방. 창문만 열려 있다. */
    return base + defs +
      '<rect width="390" height="844" fill="url(#eg)"/>' +
      '<rect x="0" y="0" width="390" height="844" fill="#0d1015"/>' +
      '<path d="M0 844V320h390v524z" fill="#12161d"/>' +
      '<rect x="28" y="188" width="186" height="210" rx="3" fill="#0b0e13" stroke="#2a303a" stroke-width="4"/>' +
      '<rect x="40" y="200" width="162" height="186" fill="#1c2a38"/>' +
      '<path d="M40 200l162 0v186l-162 0z" fill="url(#el)" opacity=".5"/>' +
      '<path d="M40 330l50-42 46 30 34-24 32 36v90H40z" fill="#101821" opacity=".9"/>' +
      '<path d="M121 200v186M40 300h162" stroke="#2a303a" stroke-width="3"/>' +
      /* 커튼이 바람에 들려 있다 */
      '<path d="M40 200c34 34 10 108 32 186H40z" fill="#2a2f38" opacity=".62"/>' +
      '<path d="M202 200c-26 48 6 112-18 186h18z" fill="#2a2f38" opacity=".5"/>' +
      /* 빈 침대: 낮게 깔린 매트리스와 베개 */
      '<rect x="164" y="574" width="206" height="104" rx="10" fill="#201a15"/>' +
      '<rect x="170" y="560" width="194" height="26" rx="10" fill="#332a22"/>' +
      '<rect x="300" y="552" width="58" height="30" rx="10" fill="#463a2e"/>' +
      '<rect x="164" y="622" width="206" height="56" rx="8" fill="#17120f"/>' +
      '<path d="M164 646h206" stroke="#2e2620" stroke-width="3" opacity=".7"/>' +
      '<rect x="176" y="678" width="8" height="30" fill="#2a211a"/><rect x="350" y="678" width="8" height="30" fill="#2a211a"/>' +
      '<rect x="156" y="700" width="218" height="6" rx="3" fill="#1a1511" opacity=".7"/>' +
      /* 작은 책상과 의자 */
      '<rect x="52" y="470" width="138" height="12" rx="3" fill="#2b241d"/>' +
      '<rect x="60" y="482" width="8" height="92" fill="#211b16"/><rect x="174" y="482" width="8" height="92" fill="#211b16"/>' +
      '<rect x="96" y="540" width="58" height="12" rx="5" fill="#221c17"/>' +
      /* 바닥의 빛 */
      '<path d="M40 614l162 0 96 92H0z" fill="#d9e6ff" opacity=".05"/>' +
      '<ellipse cx="190" cy="640" rx="250" ry="200" fill="url(#el)" opacity=".2"/>' +
      vignette + '</svg>';
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

  function sentMail() {
    const sent = LM.msg.list('mail', 'sent').filter((m) => m.from === 'out' || m.id === 'E-50-copy');
    if (sent.length) {
      const m = sent[sent.length - 1];
      return { subject: m.subject || '자수하겠습니다', at: m.at, to: m.to || null };
    }
    const st = LM.mail && LM.mail.state ? LM.mail.state() : null;
    return { subject: (st && st.subject) || '자수하겠습니다', at: null, to: (st && st.to) || null };
  }

  function phoneScreen(kind) {
    const wrap = h('div', { class: 'end-phone' });
    if (kind === 'A') {
      /* 이 폰은 도현의 계정이다. 실제 아빠 방 데이터(+런타임 메시지)를 톡 렌더러로 그린 뒤,
       * 도현이 새로 보낸 "아빠"(오른쪽 내 말풍선)을 붙인다. 옆의 안 읽음 1은 아버지가 읽는 순간 사라진다. */
      const model = LM.talkRoomData ? LM.talkRoomData('dad') : null;
      const msgs = model ? model.messages.slice() : [];
      msgs.push({ id: 'end:dad', dir: 'out', body: '아빠', day: '3/18', time: '09:02', outUnread: true });
      const log = LM.talkRenderMessages
        ? LM.talkRenderMessages({ id: 'dad', name: model ? model.name : '아빠', avatar: model ? model.avatar : '아빠', messages: msgs })
        : h('div', { class: 'talk-room' });
      wrap.setAttribute('data-app', 'talk');
      wrap.append(
        h('div', { class: 'end-phone-top' }, model ? model.name : '아빠'),
        h('div', { class: 'end-phone-body talk' }, log));
      const outs = log.querySelectorAll('.talk-line.out .talk-unread');
      const side = outs[outs.length - 1];
      if (side) setTimeout(() => { side.classList.add('fading'); setTimeout(() => side.remove(), 220); }, 1400);
      setTimeout(() => { const body = wrap.querySelector('.end-phone-body'); if (body) body.scrollTop = body.scrollHeight; }, 40);
    } else if (kind === 'A′') {
      const note = LM.noteData ? LM.noteData('n-left') : null;
      const nums = note ? String(note.body || '').match(/[0-9]{1,3}(?:,[0-9]{3})+/g) : null;
      const amount = nums && nums.length ? nums[nums.length - 1] : '48,200,000';
      wrap.append(
        h('div', { class: 'end-phone-top' }, '메모'),
        h('div', { class: 'end-phone-body' },
          h('div', { class: 'end-note-title' }, note ? note.title : '남은 거'),
          h('div', { class: 'end-note-body' }, amount)));
    } else if (kind === 'B') {
      wrap.append(
        h('div', { class: 'end-phone-top' }, '블링크'),
        h('div', { class: 'end-phone-body' },
          h('div', { class: 'end-msg in' }, '찾았다')));
    } else if (kind === 'C') {
      const mail = sentMail();
      const time = mail.at ? LM.fmt.date(mail.at, 'hm') + ' 발송' : '09:00 발송';
      wrap.append(
        h('div', { class: 'end-phone-top' }, '보낸편지함'),
        h('div', { class: 'end-phone-body' },
          h('div', { class: 'end-mail-subj' }, mail.subject),
          h('div', { class: 'end-mail-time' }, time)));
    } else {
      /* 지워진 폰에 마지막으로 남은 실제 시러스 대화. 도현에게 보내지 못한 "아빠 미안"만 실패로 남는다. */
      const ms = LM.msg.list('msg', 'cirrus').map((rt) => ({
        dir: rt.from === 'out' ? 'out' : 'in', body: rt.text || '',
      })).filter((m) => m.body);
      ms.push({ dir: 'out', body: '아빠 미안', fail: true });
      wrap.append(
        h('div', { class: 'end-phone-top' }, '메시지'),
        h('div', { class: 'end-phone-body' }, ms.map((m) => h('div', null,
          h('div', { class: 'end-msg ' + m.dir }, m.body),
          m.fail ? h('div', { class: 'end-fail' }, '전송 실패') : null))));
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

  const FRAMES = {
    A: ['A', 'A-police'],
    'A′': ['A′', 'A′'],
    B: ['B', 'B'],
    C: ['C', 'C'],
    D: ['D'],
  };

  function show(kind) {
    const dev = document.querySelector('.device');
    if (!dev || dev.querySelector('.cine-ending')) return;
    const captions = CAPTIONS[kind] || CAPTIONS.C;
    const frames = FRAMES[kind] || captions.map(() => kind);
    const host = h('div', { class: 'end-stage' });
    const advance = h('button', { class: 'end-advance', onclick: () => next() }, '다음');
    const framesEl = h('div', { class: 'end-frames', html: endingSVG(frames[0] || kind) });
    const el = h('div', { class: 'cine-ending', role: 'dialog', 'aria-label': '엔딩' },
      framesEl, host, advance);
    let step = 0;
    /* 자막 컷 수 + 마지막 폰 화면 + 크레딧 + 다시 보기 */
    const total = captions.length + 3;
    const draw = () => {
      advance.style.display = step >= total - 1 ? 'none' : '';
      advance.textContent = step < total - 1 ? '다음' : '닫기';
      host.replaceChildren();
      if (step < captions.length) {
        framesEl.innerHTML = endingSVG(frames[step] || kind);
        host.appendChild(h('div', { class: 'end-caption' }, h('p', null, captions[step])));
      } else if (step === captions.length) {
        host.appendChild(h('div', { class: 'end-caption end-phone-cap' }, h('p', null, '마지막 폰 화면')));
        host.appendChild(phoneScreen(kind));
      } else if (step === captions.length + 1) {
        host.appendChild(h('div', { class: 'end-credits' },
          h('div', { class: 'end-credit-title' }, 'DONTKNOW'),
          epilogue(kind).map((line) => h('p', null, line))));
      } else {
        host.appendChild(replay(kind));
      }
    };
    const next = () => {
      if (step >= total - 1) return;
      step++;
      draw();
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
