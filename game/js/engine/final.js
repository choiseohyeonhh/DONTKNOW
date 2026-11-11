/* 최종 행동(V-12): 바로택시 호출 뒤 최종 장면. 설계: PROGRESSION_AND_ENDINGS 6.3,
 * SCREEN_SPECIFICATIONS_APPS SCR-TAXI-CONFIRM. 호출은 되돌릴 수 없고, 장면이 끝나면 엔딩 판정. */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;
  let active = null;

  const DEST = {
    haedam: { name: '해담고시텔', addr: '성원구청로 31' },
    spa: { name: '성원스파', addr: '성원구청역 1번 출구' },
    cheongun: { name: '청운고시원', addr: '성원구청로 18' },
    river: { name: '리버뷰타워', addr: '성원동 · 성원대교 전망' },
    gucheong: { name: '성원구청역', addr: '성원동 · 지하철 1호선' },
    home: { name: '성원아파트 103동', addr: '성원동 · 집' },
  };

  function threatResolved() {
    const f = (LM.G && LM.G.flags) || {};
    return !!(f.REC_SENT || f.NAME_SENT || f.PLATE_SENT || f.REC === 'synced');
  }

  function money(text) {
    return /한결|빚|4820|48,?200,?000|이상철/.test(String(text || ''));
  }

  function svg(kind) {
    const base = '<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
    const defs = '<defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#171b22"/><stop offset="1" stop-color="#080a0d"/></linearGradient>' +
      '<linearGradient id="fw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4658"/><stop offset="1" stop-color="#1b222d"/></linearGradient>' +
      '<linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c79d" stop-opacity=".34"/><stop offset="1" stop-color="#d9c79d" stop-opacity="0"/></linearGradient></defs>';
    if (kind === 'corridor') {
      return base + defs + '<rect width="390" height="844" fill="url(#fg)"/>' +
        '<rect x="0" y="0" width="390" height="70" fill="#0b0e13"/>' +
        '<path d="M0 844 L0 300 L170 210 L390 300 L390 844 Z" fill="#12161d"/>' +
        '<path d="M170 210 L170 844" stroke="#242b36" stroke-width="2"/>' +
        '<rect x="212" y="300" width="140" height="330" rx="4" fill="#2a211a"/>' +
        '<rect x="218" y="306" width="128" height="318" rx="3" fill="#191410"/>' +
        '<rect x="238" y="326" width="88" height="120" rx="2" fill="#0c0d10" stroke="#3b3027" stroke-width="3"/>' +
        '<circle cx="332" cy="480" r="7" fill="#c9b47a"/><rect x="326" y="470" width="12" height="6" rx="3" fill="#bfa96f"/>' +
        '<text x="256" y="478" fill="#b8aa8c" font-size="18" font-family="sans-serif">207</text>' +
        '<rect x="0" y="640" width="390" height="204" fill="#0a0c10"/>' +
        '<ellipse cx="285" cy="440" rx="190" ry="250" fill="url(#fl)"/>' +
        '<rect width="390" height="844" fill="#000" opacity=".22"/>' + '</svg>';
    }
    if (kind === 'counter') {
      return base + defs + '<rect width="390" height="844" fill="#151a20"/>' +
        '<rect x="0" y="430" width="390" height="150" fill="#2a241c"/>' +
        '<rect x="0" y="580" width="390" height="264" fill="#0c0e12"/>' +
        '<rect x="70" y="250" width="250" height="190" rx="8" fill="#1b2532" stroke="#2f3d50" stroke-width="3"/>' +
        '<text x="116" y="300" fill="#79a8d8" font-size="22" font-family="sans-serif">성원스파</text>' +
        '<text x="130" y="336" fill="#8b9bb0" font-size="13" font-family="sans-serif">24시 찜질방 · 카운터</text>' +
        '<rect x="150" y="372" width="90" height="8" rx="4" fill="#3c4c60"/>' +
        '<circle cx="96" cy="600" r="36" fill="#0a0c10"/><path d="M52 720c0-44 20-72 44-72s44 28 44 72z" fill="#0a0c10"/>' +
        '<ellipse cx="200" cy="360" rx="240" ry="210" fill="url(#fl)"/>' +
        '<rect width="390" height="844" fill="#000" opacity=".2"/>' + '</svg>';
    }
    if (kind === 'cheongun') {
      return base + defs + '<rect width="390" height="844" fill="url(#fg)"/>' +
        '<rect x="0" y="0" width="390" height="40" fill="#0a0c10"/>' +
        '<rect x="40" y="180" width="310" height="420" fill="#1a1713"/>' +
        '<rect x="58" y="200" width="274" height="380" fill="#241f19"/>' +
        '<rect x="150" y="300" width="90" height="200" rx="3" fill="#0f0e0c"/>' +
        '<text x="170" y="360" fill="#9a8f7b" font-size="26" font-family="sans-serif">304</text>' +
        '<rect x="0" y="650" width="390" height="194" fill="#0a0b0e"/>' +
        '<ellipse cx="195" cy="420" rx="220" ry="260" fill="url(#fl)"/>' +
        '<rect width="390" height="844" fill="#000" opacity=".24"/>' + '</svg>';
    }
    if (kind === 'station') {
      return base + defs + '<rect width="390" height="844" fill="#10151c"/>' +
        '<rect x="0" y="480" width="390" height="364" fill="#0a0c10"/>' +
        '<rect x="30" y="200" width="330" height="120" rx="8" fill="#1a2433" stroke="#2c3e55" stroke-width="3"/>' +
        '<circle cx="90" cy="260" r="28" fill="#2b4d70"/><text x="76" y="268" fill="#cfe3ff" font-size="22" font-family="sans-serif">1</text>' +
        '<text x="140" y="252" fill="#b8c9de" font-size="20" font-family="sans-serif">성원구청역</text>' +
        '<text x="140" y="280" fill="#7f93ab" font-size="13" font-family="sans-serif">1번 출구 · 성원스파 방향</text>' +
        '<rect x="0" y="430" width="390" height="6" fill="#2a3545"/>' +
        '<ellipse cx="200" cy="300" rx="220" ry="180" fill="url(#fl)"/>' +
        '<rect width="390" height="844" fill="#000" opacity=".22"/>' + '</svg>';
    }
    if (kind === 'home' || kind === 'river') {
      return base + defs + '<rect width="390" height="844" fill="url(#fg)"/>' +
        '<rect x="30" y="180" width="330" height="300" rx="6" fill="#0b0d11"/>' +
        '<rect x="44" y="194" width="302" height="272" fill="url(#fw)" opacity=".55"/>' +
        '<text x="120" y="360" fill="#93a6bd" font-size="17" font-family="sans-serif">아무도 없다</text>' +
        '<rect x="0" y="600" width="390" height="244" fill="#0a0b0d"/>' +
        '<ellipse cx="200" cy="360" rx="250" ry="240" fill="url(#fl)"/>' +
        '<rect width="390" height="844" fill="#000" opacity=".26"/>' + '</svg>';
    }
    return base + defs + '<rect width="390" height="844" fill="url(#fg)"/><rect width="390" height="844" fill="#000" opacity=".3"/></svg>';
  }

  function stillKind(dest, moved) {
    if (moved && dest === 'spa') return 'counter';
    if (dest === 'haedam') return 'corridor';
    if (dest === 'cheongun') return 'cheongun';
    if (dest === 'gucheong') return 'station';
    if (dest === 'river') return 'river';
    if (dest === 'home') return 'home';
    return 'home';
  }

  function start(destId) {
    const g = LM.G;
    if (!g || active) return false;
    if (g.ending && g.ending.shown) return false;
    const dest = DEST[destId] ? destId : 'home';
    const moved = !!LM.flag('MOVED');
    LM.flag('GO', true);
    LM.advance(18);
    if (LM.G.ending && LM.G.ending.shown) return false;

    let loc = 'wrong';
    if (dest === 'haedam') loc = moved ? 'wrong' : 'near';
    else if (dest === 'spa') loc = moved ? 'exact' : 'wrong';
    else if (dest === 'gucheong') loc = 'near';
    LM.flag('LOC', loc);

    const dev = document.querySelector('.device');
    if (!dev) return false;
    const thread = h('div', { class: 'final-thread', role: 'log', 'aria-live': 'polite' });
    const caption = h('div', { class: 'final-caption' });
    const inp = h('input', { class: 'final-input', type: 'text', placeholder: '메시지', 'aria-label': '메시지' });
    const send = h('button', { class: 'final-send', 'aria-label': '보내기' }, LM.icon('send'));
    const end = h('button', { class: 'final-end', onclick: () => finish() }, '돌아서 나온다');
    const bar = h('div', { class: 'final-bar' }, inp, send, end);
    const el = h('div', { class: 'final-scene', role: 'dialog', 'aria-label': '최종 장면' },
      h('div', { class: 'final-still', html: svg(stillKind(dest, moved)) }),
      h('div', { class: 'final-scrim' }),
      caption,
      thread,
      bar);
    active = el;
    dev.appendChild(el);

    const say = (from, text) => {
      thread.appendChild(h('div', { class: 'final-msg ' + (from === 'out' ? 'out' : 'in') },
        h('div', { class: 'final-bubble' }, text)));
      thread.scrollTop = thread.scrollHeight;
    };
    const cap = (text) => { caption.textContent = text; };
    let resolved = loc === 'exact';
    let asked = false;

    const askThreat = () => {
      if (asked) return;
      asked = true;
      setTimeout(() => {
        say('in', '그 사람… 경찰이 알아?');
        if (threatResolved()) {
          if (resolved) cap('문이 열린다.');
        } else {
          say('in', '아빠 먼저 가. 9시에 나 혼자 갈게');
          cap('문은 열리지 않았다.');
        }
      }, 450);
    };

    if (dest === 'haedam' && !moved) {
      cap('2층 복도. 207호 문이 보인다.');
      say('in', '__호 앞이야');
    } else if (dest === 'spa' && moved) {
      cap('성원스파 카운터. 도현이 고개를 든다.');
      say('in', '아빠…');
      askThreat();
    } else if (dest === 'cheongun') {
      cap('청운고시원 304호 앞. 문은 잠겨 있다.');
      say('in', '그 학생 취소했어요.');
    } else if (dest === 'gucheong') {
      cap('성원구청역 앞. 도현에게 어디냐고 보냈다.');
      say('in', '…');
    } else {
      cap('도착했다. 여기에 도현은 없다.');
      say('in', '…');
    }

    const submit = () => {
      const text = inp.value.trim();
      if (!text) return;
      inp.value = '';
      say('out', text);
      if (money(text) && !LM.flag('CONFESS')) {
        LM.flag('CONFESS', true);
        setTimeout(() => say('in', '…언제부터 알았어'), 300);
      }
      if (dest === 'haedam' && !moved && !resolved) {
        const m = text.match(/(\d{2,4})/);
        if (!m) {
          setTimeout(() => say('in', '숫자로 말해.'), 350);
          return;
        }
        if (m[1] === '207') {
          resolved = true;
          LM.flag('LOC', 'exact');
          cap('207호 앞. 발소리가 들린다.');
          setTimeout(() => say('in', '…'), 300);
          askThreat();
        } else {
          LM.flag('LOC', 'near');
          cap('다른 방 문이 열린다. 낯선 사람이 나온다.');
          setTimeout(() => say('in', '…'), 500);
        }
      }
    };
    send.addEventListener('click', submit);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } });

    function finish() {
      if (!active) return;
      const node = active;
      active = null;
      if (LM.animate) LM.animate(node, [{ opacity: 1 }, { opacity: 0 }], { duration: 260 }).then(() => node.remove());
      else node.remove();
      setTimeout(() => {
        if (LM.ev && LM.ev.judge) LM.ev.judge('final');
        else if (LM.endings) LM.endings.judge('final');
      }, 300);
    }

    LM.emit('final:start', { dest: dest, loc: loc });
    setTimeout(() => inp.focus(), 120);
    return true;
  }

  LM.final = { start: start, threatResolved: threatResolved, destinations: DEST };
})();
