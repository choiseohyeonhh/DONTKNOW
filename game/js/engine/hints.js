/* "막혔을 때" 3단계 힌트. 설계: PROGRESSION_AND_ENDINGS 7절, BUSINESS_RULES BR-25,
 * SCREEN_SPECIFICATIONS_APPS SCR-PAUSE-HINT. 목표 목록은 화면에 나열하지 않는다. */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  function seen(id) { return !!(LM.hasSeen && LM.hasSeen(id)); }
  function dh() { const v = LM.G && LM.G.npc ? LM.G.npc.DH : 0; return v === 'X' ? 'X' : Number(v) || 0; }
  function locSeen() {
    return ['E-150', 'E-198', 'E-219', 'E-220', 'E-74', 'E-214b'].filter(seen).length;
  }

  const GOALS = [
    { id: 'lock', done: () => !!(LM.G && LM.G.unlocked), steps: [
      '잠긴 폰도 보여 주는 게 있다', '잠금화면 왼쪽 아래', '응급 → 생년월일',
    ] },
    { id: 'note', done: () => !!(LM.G && LM.G.world && LM.G.world.noteUnlocked), steps: [
      "힌트가 '아빠'다", '연락처나 캘린더', '연락처 → 아빠 → 생일',
    ] },
    { id: 'online', done: () => !!(LM.G && LM.G.firstOnlineAt != null), steps: [
      '이 폰은 사흘 전에 멈춰 있다', '제어 센터', 'Wi-Fi',
    ] },
    { id: 'wipe', done: () => { const d = dh(); return d === 'X' || (typeof d === 'number' && d >= 3); }, steps: [
      '도현이가 원하는 증거를 보내자', '카메라', '서랍을 열어 찍어서 메시지로',
    ] },
    { id: 'seoa', done: () => Number(LM.G && LM.G.npc && LM.G.npc.SA) >= 2, steps: [
      '그날 밤 서아는 어디 있었나', '루프 하이라이트', 'seoa.film → 3월 → 21:40',
    ] },
    { id: 'bank', done: () => !!(LM.G && LM.G.world && LM.G.world.bankOpened), steps: [
      '잠긴 메모에 규칙이 있다', '캘린더와 응급정보', '엄마 11/2 + 21',
    ] },
    { id: 'cheongun', done: () => seen('E-218'), steps: [
      '3/15 이후 메일', '메일 받은편지함', '청운고시원 3/15',
    ] },
    { id: 'place', done: () => locSeen() >= 2, steps: [
      '도현이도 밥은 먹는다', '한끼 / 설정 → 키보드', '주문 내역 배송지 / 텍스트 대치',
    ] },
    { id: 'name', done: () => !!(LM.G && LM.G.flags && LM.G.flags.NAME_SENT), steps: [
      '성과 이름이 다른 곳에 있다', '튜브 채널명 / 파일 정보', '교육자료.pdf → 정보 → 받은 곳',
    ] },
    { id: 'final', done: () => !!(LM.G && LM.G.flags && LM.G.flags.GO), steps: [
      '아들에게 갈 차례다', '바로택시', '도착지 검색',
    ] },
  ];

  function open(host) {
    const goal = GOALS.find((g) => { try { return !g.done(); } catch (e) { return false; } });
    if (!goal) { ui.toast('지금은 막힌 목표가 없다'); return; }
    let step = 0;
    const stepLabel = h('div', { class: 'pause-hint-step' }, '힌트 1/3');
    const text = h('p', { class: 'pause-hint-text', 'aria-live': 'polite' }, goal.steps[0]);
    const dots = h('div', { class: 'pause-hint-dots', 'aria-hidden': 'true' }, [0, 1, 2].map((i) => h('i', { class: i === 0 ? 'on' : '' })));
    const next = h('button', { class: 'btn filled m', onclick: () => {
      if (step >= 2) { const w = next.closest('.sheet-wrap'); if (w) w.close(); return; }
      step++; text.textContent = goal.steps[step];
      stepLabel.textContent = '힌트 ' + (step + 1) + '/3';
      next.textContent = step >= 2 ? '닫기' : '다음 단계';
      dots.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i <= step));
    } }, '다음 단계');
    const body = h('div', { class: 'pause-hint' },
      stepLabel, text, dots, next);
    ui.sheet(host || null, ui.sheetPage({ title: '막혔을 때', cancel: '닫기', body }), { size: 'medium' });
  }

  LM.hints = { open: open, goals: GOALS };
})();
