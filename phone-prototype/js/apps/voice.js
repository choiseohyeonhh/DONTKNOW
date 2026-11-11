/* 음성 메모 — 설계: design/03-features/MEDIA_SPECIFICATION.md 3절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-VOICE-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const SEGMENTS = [
    { sec: 190, time: '03:10', speaker: '실장', text: '그 돈 어디 있어. 그치? 너 아직 몰라서 그래.' },
    { sec: 702, time: '11:42', speaker: '실장', text: '니 아빠 이상철. 한빛물류 배차. 한결에 8천. 내가 모를 것 같아?' },
    { sec: 1625, time: '27:05', speaker: '남자', text: '강 대표님, 차 빼 드릴까요?' },
    { sec: 1627, time: '27:05', speaker: '실장', text: '어, B2.' },
    { sec: 2510, time: '41:50', speaker: '도현', text: '다 녹음했어요.' },
  ];

  const RECS = [
    {
      id: 'E-37', title: '새로운 녹음 37', dateLong: '3/14 20:09', date: '3/14',
      dur: 2551, durText: '42:31', size: '41MB', only: true, segments: SEGMENTS,
    },
    // 자리표시(캐논 없음): 목록의 노이즈 녹음.
    { id: 'n1', title: '받아쓰기 확인', dateLong: '3/2 09:12', date: '3/2', dur: 37, durText: '0:37', size: '0.4MB', only: false, segments: [] },
    { id: 'n2', title: '수업 메모', dateLong: '2/26 14:05', date: '2/26', dur: 86, durText: '1:26', size: '0.9MB', only: false, segments: [] },
  ];

  LM.register({
    id: 'voice',
    render(app) { app.start((nav) => list(nav)); },
  });

  const mmss = (s) => {
    const t = Math.max(0, Math.round(s));
    return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
  };

  function list(nav) {
    return ui.page({
      title: '음성 메모', nav,
      right: h('button', { class: 'nb-btn', 'aria-label': '정렬', onclick: () => ui.actionSheet({ title: '정렬', actions: [{ label: '최신순' }, { label: '이름순' }] }) }, LM.icon('sort')),
      body: ui.group({
        header: '녹음',
        footer: '새로운 녹음 37은 이 기기에만 있다. 시러스에 동기화되지 않았다.',
        rows: RECS.map((r) => ui.row({
          title: r.title,
          subtitle: r.dateLong + ' · ' + r.durText + ' · ' + r.size,
          icon: 'record',
          extra: r.only ? h('span', { class: 'voice-only' }, '기기에만 · 시러스에 없음') : null,
          onClick: () => nav.push(() => player(nav, r)),
        })),
      }),
    });
  }

  function heights(n) {
    const a = [];
    for (let i = 0; i < n; i++) {
      const v = Math.abs(Math.sin(i * 0.7) + Math.sin(i * 0.23) * 0.8 + Math.sin(i * 1.9) * 0.3);
      a.push(Math.round(14 + Math.min(86, v * 36)));
    }
    return a;
  }

  function player(nav, rec) {
    const dur = rec.dur;
    let pos = 0, playing = false, speed = 1;

    const timeCur = h('span', { class: 'voice-time' }, '0:00');
    const timeDur = h('span', { class: 'voice-time' }, rec.durText);
    const fill = h('i', { class: 'voice-fill' });
    const track = h('div', { class: 'voice-track', role: 'slider', tabindex: '0', 'aria-label': '재생 위치', onclick: (e) => {
      const r = track.getBoundingClientRect();
      pos = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * dur;
      redraw();
    } }, fill);

    const bars = [];
    const wave = h('div', { class: 'voice-wave', 'aria-hidden': true });
    heights(64).forEach((v) => { const b = h('i'); b.style.height = v + '%'; wave.appendChild(b); bars.push(b); });

    const playBtn = h('button', { class: 'voice-play', 'aria-label': '재생' });
    const speedBtn = h('button', { class: 'voice-ctrl', 'aria-label': '재생 속도', onclick: () => { speed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1; speedBtn.textContent = speed + '×'; } }, '1×');
    const jump = (d) => { pos = Math.max(0, Math.min(dur, pos + d)); redraw(); };

    const controls = h('div', { class: 'voice-controls' },
      h('button', { class: 'voice-jump', 'aria-label': '15초 뒤로', onclick: () => jump(-15) }, '−15'),
      playBtn,
      h('button', { class: 'voice-jump', 'aria-label': '15초 앞으로', onclick: () => jump(15) }, '+15'),
      speedBtn,
      h('button', { class: 'voice-ctrl', 'aria-label': '공유', onclick: () => ui.share(rec.title) }, LM.icon('share')));

    playBtn.addEventListener('click', () => {
      if (pos >= dur) pos = 0;
      playing = !playing;
      playBtn.setAttribute('aria-label', playing ? '일시정지' : '재생');
      redraw();
    });

    const redraw = () => {
      const ratio = dur ? pos / dur : 0;
      timeCur.textContent = mmss(pos);
      fill.style.width = (ratio * 100).toFixed(2) + '%';
      track.setAttribute('aria-valuetext', mmss(pos));
      bars.forEach((b, i) => b.classList.toggle('on', i / bars.length <= ratio));
      playBtn.replaceChildren(LM.icon(playing ? 'pause' : 'play'));
    };

    const transcript = LM.state.transcribe
      ? (rec.segments.length
        ? ui.row({ title: '전사', subtitle: '검색과 구간 이동', icon: 'text', onClick: () => nav.push(() => transcriptPage(nav, rec, (sec) => { pos = sec; redraw(); })) })
        : ui.notice('전사가 없는 녹음이다.'))
      : ui.notice('전사 없음 — 설정 › 손쉬운 사용에서 켤 수 있다.');

    const body = h('div', { class: 'voice-player' },
      h('div', { class: 'voice-meta' }, rec.dateLong + ' · ' + rec.durText + ' · ' + rec.size + (rec.only ? ' · 시러스에 없음' : '')),
      wave,
      h('div', { class: 'voice-bar' }, timeCur, track, timeDur),
      controls,
      h('div', { class: 'voice-sections' }, transcript),
      ui.group({ plain: true, rows: [
        ui.row({ title: '30초 구간 공유', icon: 'share', onClick: () => ui.share(rec.title + ' · 30초 구간') }),
      ] }),
    );

    redraw();

    const timer = setInterval(() => {
      if (!scr.isConnected) { clearInterval(timer); return; }
      if (!playing) return;
      pos = Math.min(dur, pos + speed * 0.5);
      if (pos >= dur) playing = false;
      redraw();
    }, 500);

    const scr = ui.page({
      title: rec.title, back: '음성 메모', nav, large: false,
      right: h('button', { class: 'nb-btn', 'aria-label': '더보기', onclick: () => ui.actionSheet({
        title: rec.title,
        actions: [
          { label: '이름 변경', onClick: () => ui.toast('프로토타입: 이름은 바뀌지 않는다') },
          { label: '공유', onClick: () => ui.share(rec.title) },
          { label: '삭제', destructive: true, onClick: () => ui.toast('프로토타입: 삭제는 일어나지 않는다') },
        ],
      }) }, LM.icon('more')),
      body,
    });
    return scr;
  }

  function transcriptPage(nav, rec, seek) {
    const res = h('div');
    const draw = (q) => {
      const qq = String(q || '').trim();
      const list = rec.segments.filter((s) => !qq || (s.speaker + s.text).includes(qq));
      res.replaceChildren();
      if (!list.length) { res.appendChild(ui.empty({ icon: 'text', title: '결과 없음' })); return; }
      res.appendChild(h('div', { class: 'grp-h', style: { padding: '4px 16px 8px' } }, '결과 ' + list.length));
      res.appendChild(ui.group({
        plain: true,
        rows: list.map((s) => ui.row({
          lead: h('span', { class: 'voice-seg-time' }, s.time),
          title: s.speaker,
          subtitle: s.text,
          onClick: () => { seek(s.sec); nav.pop(); },
        })),
      }));
    };
    draw('');
    return ui.page({ title: '전사', back: rec.title, nav, large: false, search: '전사 안 검색', onSearch: draw, body: res });
  }

  LM.searchSources.push({
    app: 'voice',
    items: () => RECS.map((r) => ({ title: r.title, sub: r.dateLong + ' · ' + r.durText, text: r.title + ' ' + r.dateLong })),
  });
})();
