/* 계산기 — 실제로 계산된다. 위로 쓸면 기록 20줄(E-170).
 * 설계: design/03-features/PERSONAL_DATA_APPS_SPECIFICATION.md 6절,
 * design/02-design/SCREEN_SPECIFICATIONS_APPS.md SCR-CALC-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;
  const ERROR = '계산할 수 없습니다.';

  /* 캐논 4줄(E-170) + 장식 16줄(캐논 없음, 새 단서를 만들지 않는 산수) */
  const HISTORY = [
    { at: '3/9 04:22', expr: '28,000,000 − 770,000', res: '27,230,000', canon: true, sort: 202603090422 },
    { at: '3/9 04:21', expr: '450,000 + 200,000 + 120,000', res: '770,000', canon: true, sort: 202603090421 },
    { at: '3/9 04:20', expr: '28,000,000 ÷ 300,000', res: '93.33', canon: true, sort: 202603090420 },
    { at: '2/26 15:40', expr: '80,000,000 − 19,200,000 − 6,200,000 − 6,400,000', res: '48,200,000', canon: true, sort: 202602261540 },
    // 자리표시(캐논 없음)
    { at: '3/8 12:10', expr: '4,500 × 2', res: '9,000' },
    { at: '3/7 19:05', expr: '12,400 + 3,600', res: '16,000' },
    { at: '3/6 09:30', expr: '45,000 − 8,000', res: '37,000' },
    { at: '3/4 22:12', expr: '2,500 × 4', res: '10,000' },
    { at: '3/3 08:45', expr: '30,000 ÷ 3', res: '10,000' },
    { at: '2/28 17:20', expr: '1,200 + 800', res: '2,000' },
    { at: '2/24 21:55', expr: '6,500 × 3', res: '19,500' },
    { at: '2/21 13:40', expr: '90,000 − 15,000', res: '75,000' },
    { at: '2/19 10:05', expr: '8,000 ÷ 2', res: '4,000' },
    { at: '2/16 23:30', expr: '3,300 + 1,700', res: '5,000' },
    { at: '2/12 18:15', expr: '7,200 × 2', res: '14,400' },
    { at: '2/09 11:25', expr: '5,000 − 1,500', res: '3,500' },
    { at: '2/05 16:50', expr: '10,000 + 4,500', res: '14,500' },
    { at: '2/02 20:35', expr: '24,000 ÷ 4', res: '6,000' },
    { at: '1/30 09:10', expr: '1,500 × 6', res: '9,000' },
    { at: '1/27 14:45', expr: '50,000 − 20,000', res: '30,000' },
  ].sort((a, b) => (b.sort || 0) - (a.sort || 0));

  let root = null;
  LM.register({ id: 'calc', render(app) { root = app.root; app.start(() => calculator()); } });

  function calculator() {
    let cur = '0';
    let acc = null;
    let op = null;
    let waiting = false;
    let error = false;

    const expression = h('div', { class: 'cc-expression', 'aria-hidden': 'true' });
    const display = h('div', { class: 'cc-display', role: 'status', 'aria-live': 'polite' }, '0');
    const opButtons = {};

    const sym = (o) => ({ '/': '÷', '*': '×', '-': '−', '+': '+' }[o] || '');
    const num = (s) => parseFloat(String(s).replace(/,/g, ''));
    const clean = (n) => {
      if (!isFinite(n)) return ERROR;
      const r = Math.round(n * 1e10) / 1e10;
      return String(r);
    };
    const displayOf = (s) => {
      if (s === ERROR) return s;
      const neg = s.startsWith('-');
      const t = neg ? s.slice(1) : s;
      const dot = t.indexOf('.');
      const i = dot >= 0 ? t.slice(0, dot) : t;
      const f = dot >= 0 ? t.slice(dot + 1) : null;
      const g = Number(i || '0').toLocaleString('en-US');
      return (neg ? '-' : '') + g + (f !== null ? '.' + f : '');
    };
    const paint = () => {
      display.textContent = error ? ERROR : displayOf(cur);
      display.classList.toggle('error', error);
      display.classList.toggle('small', (display.textContent || '').length > 10);
      display.classList.toggle('tiny', (display.textContent || '').length > 16);
      expression.textContent = (!error && op && acc != null) ? displayOf(clean(acc)) + ' ' + sym(op) : '';
      Object.keys(opButtons).forEach((k) => opButtons[k].classList.toggle('active', !error && op === k && waiting));
    };
    const reset = () => { cur = '0'; acc = null; op = null; waiting = false; error = false; paint(); };
    const digit = (d) => {
      if (error) reset();
      if (waiting) { cur = d; waiting = false; }
      else {
        const digits = cur.replace(/[-.]/g, '').length;
        if (digits >= 12) return;
        cur = cur === '0' ? d : cur + d;
      }
      paint();
    };
    const dot = () => {
      if (error) reset();
      if (waiting) { cur = '0.'; waiting = false; }
      else if (!cur.includes('.')) cur += '.';
      paint();
    };
    const sign = () => {
      if (error) return;
      if (cur === '0') return;
      cur = cur.startsWith('-') ? cur.slice(1) : '-' + cur;
      paint();
    };
    const percent = () => {
      if (error) return;
      cur = clean(num(cur) / 100); waiting = false; paint();
    };
    const calc = (a, b, o) => {
      if (o === '+') return a + b;
      if (o === '-') return a - b;
      if (o === '*') return a * b;
      if (o === '/') return b === 0 ? NaN : a / b;
      return b;
    };
    const setOp = (o) => {
      if (error) reset();
      if (op && waiting) { op = o; paint(); return; }
      const v = num(cur);
      if (op) { acc = calc(acc, v, op); if (!isFinite(acc)) { error = true; cur = ERROR; acc = null; op = null; waiting = true; paint(); return; } }
      else acc = v;
      cur = clean(acc); op = o; waiting = true;
      paint();
    };
    const equals = () => {
      if (error || !op) return;
      const v = num(cur);
      const res = calc(acc, v, op);
      if (!isFinite(res)) { error = true; cur = ERROR; acc = null; op = null; waiting = true; paint(); return; }
      acc = null; op = null; waiting = true; cur = clean(res);
      paint();
    };

    const key = (label, cls, fn, aria) => h('button', {
      class: 'cc-key ' + cls, 'aria-label': aria || label, onclick: fn,
    }, label);

    const keys = [];
    keys.push(key('AC', 'fn', reset));
    keys.push(key('±', 'fn', sign, '부호'));
    keys.push(key('%', 'fn', percent, '퍼센트'));
    keys.push(key('÷', 'op', () => setOp('/'), '나누기'));
    ['7', '8', '9'].forEach((d) => keys.push(key(d, 'num', () => digit(d))));
    keys.push(key('×', 'op', () => setOp('*'), '곱하기'));
    ['4', '5', '6'].forEach((d) => keys.push(key(d, 'num', () => digit(d))));
    keys.push(key('−', 'op', () => setOp('-'), '빼기'));
    ['1', '2', '3'].forEach((d) => keys.push(key(d, 'num', () => digit(d))));
    keys.push(key('+', 'op', () => setOp('+'), '더하기'));
    keys.push(key('0', 'num zero', () => digit('0')));
    keys.push(key('.', 'num', dot, '소수점'));
    keys.push(key('=', 'op eq', equals, '같음'));

    // 연산자 활성 표시용 참조
    const all = h('div', { class: 'cc-pad' }, keys);
    all.querySelectorAll('.cc-key.op').forEach((b) => {
      const t = b.getAttribute('aria-label');
      if (t === '나누기') opButtons['/'] = b;
      else if (t === '곱하기') opButtons['*'] = b;
      else if (t === '빼기') opButtons['-'] = b;
      else if (t === '더하기') opButtons['+'] = b;
    });

    const top = h('div', { class: 'cc-top' },
      h('button', { class: 'cc-hist-btn', 'aria-label': '계산 기록', onclick: openHistory }, LM.icon('history')),
      h('div', { class: 'cc-readout' }, expression, display));

    // 위로 쓸기 = 기록
    let sy = null;
    top.addEventListener('pointerdown', (e) => { sy = e.clientY; });
    top.addEventListener('pointerup', (e) => { if (sy != null && sy - e.clientY > 45) openHistory(); sy = null; });

    paint();
    return h('section', { class: 'cc-app' }, top, all);
  }

  function openHistory() {
    LM.C.see('E-170');
    const body = h('div', { class: 'cc-hist' }, HISTORY.map((row) => {
      const el = h('div', { class: 'cc-row' },
        h('div', { class: 'cc-row-expr' }, row.expr, h('span', { class: 'cc-row-res' }, ' = ' + row.res)),
        h('div', { class: 'cc-row-at' }, row.at));
      LM.longPress(el, () => ui.actionSheet({
        title: row.expr + ' = ' + row.res,
        actions: [
          { label: '복사', onClick: () => ui.toast('복사됨') },
          { label: '공유', onClick: () => ui.share(row.expr + ' = ' + row.res) },
        ],
      }));
      return el;
    }));
    ui.sheet(root, ui.sheetPage({ title: '기록', body }), { size: 'large' });
  }

  LM.searchSources.push({
    app: 'calc',
    items: () => HISTORY.slice(0, 20).map((r) => ({ title: r.expr + ' = ' + r.res, sub: '계산 기록 · ' + r.at, text: r.expr + ' ' + r.res })),
  });
})();
