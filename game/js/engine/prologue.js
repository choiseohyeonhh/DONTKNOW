/* 프롤로그 시네마틱. 스틸 3컷 + 하단 자막. 첫 재생에서는 탭/스페이스로 넘긴다.
 * 자막 원문: design/03-features/SYSTEM_SHELL_SPECIFICATION.md 4.11 · 8.10 (E-01) */
(function () {
  'use strict';
  const LM = window.LM;
  const h = LM.h;

  const CUTS = [
    {
      still: 'police',
      lines: [
        '3월 15일 밤, 이상철 씨는 아들의 실종을 신고했다.',
        '경찰 "성인이라 가출인으로 분류됩니다."',
      ],
    },
    {
      still: 'police2',
      lines: [
        '경찰 "여자친구분이 토요일 밤 10시까지 같이 있었다고 하시네요."',
        '인수증 "습득 3/15 01:10 바로택시 차내."',
      ],
    },
    {
      still: 'room',
      lines: ['3월 17일 밤 9시 10분.'],
    },
  ];

  function policeSVG(paper) {
    return `<svg class="cine-svg" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="p-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#191c22"/><stop offset=".62" stop-color="#101217"/><stop offset="1" stop-color="#08090c"/>
        </linearGradient>
        <linearGradient id="p-win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4b5361"/><stop offset="1" stop-color="#232833"/>
        </linearGradient>
        <linearGradient id="p-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2a2b2d"/><stop offset="1" stop-color="#151619"/>
        </linearGradient>
        <radialGradient id="p-lamp" cx=".5" cy=".2" r=".8">
          <stop offset="0" stop-color="#c9bfa6" stop-opacity=".28"/><stop offset="1" stop-color="#c9bfa6" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="390" height="844" fill="url(#p-wall)"/>
      <rect x="38" y="96" width="314" height="298" rx="6" fill="#0a0b0e"/>
      <rect x="48" y="108" width="294" height="274" fill="url(#p-win)"/>
      <g stroke="#0c0d10" stroke-width="5">
        <line x1="195" y1="108" x2="195" y2="382"/><line x1="48" y1="252" x2="342" y2="252"/>
      </g>
      <rect x="0" y="470" width="390" height="12" fill="#1e2026"/>
      <rect x="0" y="482" width="390" height="180" fill="url(#p-desk)"/>
      <rect x="0" y="482" width="390" height="3" fill="#3b3d44"/>
      <ellipse cx="195" cy="180" rx="260" ry="150" fill="url(#p-lamp)"/>
      <g fill="#0b0c0f">
        <circle cx="104" cy="454" r="30"/>
        <path d="M60 560c0-40 20-68 44-68s44 28 44 68z"/>
        <circle cx="286" cy="450" r="31"/>
        <path d="M240 558c0-42 21-70 46-70s46 28 46 70z"/>
      </g>
      <rect x="150" y="430" width="90" height="5" rx="2" fill="#3a3c42"/>
      <rect x="166" y="410" width="58" height="22" rx="2" fill="#0d0e11"/>
      ${paper ? `
      <g transform="rotate(-7 288 548)">
        <rect x="244" y="512" width="96" height="82" rx="3" fill="#d9d4c6" opacity=".92"/>
        <g stroke="#8b8577" stroke-width="3" opacity=".6">
          <line x1="258" y1="530" x2="326" y2="530"/><line x1="258" y1="546" x2="326" y2="546"/>
          <line x1="258" y1="562" x2="306" y2="562"/><line x1="258" y1="578" x2="318" y2="578"/>
        </g>
      </g>` : ''}
      <rect x="0" y="0" width="390" height="844" fill="#000" opacity=".18"/>
    </svg>`;
  }

  function roomSVG() {
    return `<svg class="cine-svg" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="r-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#15130f"/><stop offset=".6" stop-color="#0c0b09"/><stop offset="1" stop-color="#060606"/>
        </linearGradient>
        <radialGradient id="r-glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#cfe3ff" stop-opacity=".55"/><stop offset=".45" stop-color="#8fb6ff" stop-opacity=".16"/><stop offset="1" stop-color="#8fb6ff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="r-bed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#23211d"/><stop offset="1" stop-color="#12110f"/>
        </linearGradient>
      </defs>
      <rect width="390" height="844" fill="url(#r-wall)"/>
      <rect x="252" y="86" width="112" height="238" rx="3" fill="#090a0d"/>
      <rect x="260" y="94" width="96" height="222" fill="#1a2130" opacity=".7"/>
      <g stroke="#0a0b0e" stroke-width="4"><line x1="308" y1="94" x2="308" y2="316"/><line x1="260" y1="205" x2="356" y2="205"/></g>
      <path d="M0 574h390v270H0z" fill="url(#r-bed)"/>
      <rect x="0" y="566" width="390" height="8" fill="#2b2721"/>
      <rect x="22" y="486" width="222" height="16" rx="4" fill="#1c1a16"/>
      <rect x="42" y="502" width="10" height="74" fill="#141310"/><rect x="214" y="502" width="10" height="74" fill="#141310"/>
      <rect x="268" y="604" width="92" height="60" rx="6" fill="#1a1916"/>
      <path d="M314 664c0 26-10 38-30 46" fill="none" stroke="#2b2a26" stroke-width="5" stroke-linecap="round"/>
      <rect x="276" y="656" width="42" height="74" rx="9" fill="#0b0c10" stroke="#33363d" stroke-width="2"/>
      <rect x="280" y="661" width="34" height="62" rx="6" fill="#1c2b45"/>
      <ellipse cx="297" cy="694" rx="110" ry="120" fill="url(#r-glow)"/>
      <circle cx="297" cy="690" r="3.4" fill="#dbe9ff" opacity=".9"/>
      <rect x="0" y="0" width="390" height="844" fill="#000" opacity=".22"/>
    </svg>`;
  }

  function buildStill(kind) {
    const svg = kind === 'room' ? roomSVG() : policeSVG(kind === 'police2');
    return h('div', { class: 'cine-still still-' + kind, html: svg });
  }

  /* 'dk.meta'는 게임 밖 메타 기록(엔딩 목록). 엔딩을 본 적이 있으면 프롤로그를 건너뛸 수 있다. */
  function meta() {
    try {
      const raw = localStorage.getItem('dk.meta');
      const o = raw ? JSON.parse(raw) : {};
      return o && typeof o === 'object' ? o : {};
    } catch (e) { return {}; }
  }
  function writeMeta(o) {
    try { localStorage.setItem('dk.meta', JSON.stringify(o)); return true; } catch (e) { return false; }
  }
  LM.meta = {
    read: meta,
    hasEnding() {
      const o = meta();
      return Array.isArray(o.endings) && o.endings.length > 0;
    },
    recordEnding(id) {
      const o = meta();
      o.endings = Array.isArray(o.endings) ? o.endings : [];
      if (o.endings.indexOf(id) < 0) o.endings.push(id);
      o.lastEnding = id;
      o.lastEndingAt = Date.now();
      return writeMeta(o);
    },
  };

  function play(done) {
    if (!LM.G) return;
    const dev = document.querySelector('.device');
    if (!dev || dev.querySelector('.cine-prologue')) return;
    const canSkip = !!(LM.meta && LM.meta.hasEnding());

    LM.pause('cinematic');
    dev.classList.add('cine-open');

    let index = 0;
    let finished = false;
    const linesEl = h('div', { class: 'cine-caption' });
    const dots = h('div', { class: 'cine-dots', 'aria-hidden': 'true' }, CUTS.map(() => h('i')));
    const stillHolder = h('div', { class: 'cine-frames' });
    const el = h('div', { class: 'cine-prologue', role: 'dialog', 'aria-label': '프롤로그' },
      stillHolder,
      h('div', { class: 'cine-scrim' }),
      canSkip ? h('button', { class: 'cine-skip', onclick: (e) => { e.stopPropagation(); finish(); } }, '건너뛰기') : null,
      h('div', { class: 'cine-capwrap' }, linesEl),
      dots,
      h('button', { class: 'cine-next', 'aria-label': '다음 컷', onclick: (e) => { e.stopPropagation(); next(); } }, '다음'));

    function draw() {
      const cut = CUTS[index];
      stillHolder.replaceChildren(buildStill(cut.still));
      linesEl.replaceChildren(...cut.lines.map((line, i) => h('p', { class: 'cine-line' + (i ? ' quote' : '') }, line)));
      dots.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i === index));
      const anim = LM.motion ? LM.motion() : true;
      if (anim && LM.animate) {
        LM.animate(linesEl, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280 });
        LM.animate(stillHolder, [{ opacity: 0.3 }, { opacity: 1 }], { duration: 350 });
      }
    }

    function next() {
      if (index >= CUTS.length - 1) { finish(); return; }
      index++;
      draw();
    }

    function finish() {
      if (finished) return;
      finished = true;
      document.removeEventListener('keydown', onKey);
      if (LM.animate) {
        LM.animate(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 220 }).then(() => el.remove());
      } else el.remove();
      dev.classList.remove('cine-open');
      LM.gset('prologueSeen', true);
      LM.saveGame('auto');
      LM.resume('cinematic');
      LM.emit('prologue:end');
      if (typeof done === 'function') done();
    }

    function onKey(e) {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'Escape' && canSkip) { e.preventDefault(); finish(); }
    }

    el.addEventListener('click', () => next());
    document.addEventListener('keydown', onKey);
    dev.appendChild(el);
    draw();
    LM.emit('prologue:start');
  }

  LM.prologue = { play: play, cuts: CUTS };
})();
