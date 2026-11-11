/* stage 4: 엔딩 판정 진리표 + 최종 행동/택시 UI + 마감.
 * 실행: node game/tests/endings.test.js */
const path = require('path');
const { chromium } = require('playwright');

const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const results = [];
let failed = 0;

function ok(name, cond, extra) {
  if (cond) results.push('  ✓ ' + name);
  else { failed++; results.push('  ✗ ' + name + (extra ? ' — ' + extra : '')); }
}

async function open(browser, query) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(URL + (query || '?unlock'));
  await page.waitForFunction(() => window.LM && window.LM.G && window.LM.endings && window.LM.final);
  return { ctx, page, errors };
}

async function run(name, fn) {
  try { await fn(); }
  catch (e) { failed++; results.push('  ✗ ' + name + ' — ' + e.message); }
}

async function unitEnding(browser, flags) {
  const { ctx, page, errors } = await open(browser);
  const kind = await page.evaluate((f) => {
    Object.keys(f).forEach((k) => DK.set('flags.' + k, f[k]));
    LM.endings.judge('test');
    return LM.G.ending && LM.G.ending.kind;
  }, flags);
  await ctx.close();
  return { kind, errors };
}

async function startTaxi(page, query) {
  await page.evaluate(() => LM.set({ wifi: true, airplane: false }));
  if (query.indexOf('해담') >= 0) await page.evaluate(() => LM.seen('E-150'));
  await page.waitForTimeout(100);
  await page.evaluate(() => LM.pause('test'));
  await page.locator('.appwin[data-app="taxi"] .row', { hasText: '도착지 입력' }).click();
  await page.waitForSelector('.appwin[data-app="taxi"] input[type="search"]');
  await page.locator('.appwin[data-app="taxi"] input[type="search"]').fill(query);
  await page.waitForTimeout(80);
  await page.locator('.appwin[data-app="taxi"] .row', { hasText: query }).first().click();
  await page.locator('.appwin[data-app="taxi"] .btn.filled', { hasText: '호출' }).click();
  await page.locator('.sh-btn.strong', { hasText: '호출' }).click();
  await page.waitForSelector('.final-scene');
}

async function finishFinal(page) {
  await page.locator('.final-end').click();
  await page.waitForSelector('.cine-ending');
  return page.evaluate(() => LM.G.ending && LM.G.ending.kind);
}

(async () => {
  const browser = await chromium.launch();

  await run('진리표: D — 슬레이트 지우기', async () => {
    const r = await unitEnding(browser, { WIPE_SLATE: true });
    ok('D', r.kind === 'D', r.kind);
    ok('콘솔 오류 없음', r.errors.length === 0, r.errors.join(' / '));
  });
  await run('진리표: D — LEAK (exact 호출 아님)', async () => {
    const r = await unitEnding(browser, { LEAK: true });
    ok('D', r.kind === 'D', r.kind);
  });
  await run('진리표: D — WIPED + REC lost + LOC near', async () => {
    const r = await unitEnding(browser, { WIPED: true, REC: 'lost', LOC: 'near' });
    ok('D', r.kind === 'D', r.kind);
  });
  await run('진리표: B — MAIL deleted, 아무것도 안 보냄', async () => {
    const r = await unitEnding(browser, { MAIL: 'deleted' });
    ok('B', r.kind === 'B', r.kind);
  });
  await run('진리표: A — GO + exact + 위협 해소 + CONFESS', async () => {
    const r = await unitEnding(browser, { GO: true, LOC: 'exact', NAME_SENT: true, CONFESS: true });
    ok('A', r.kind === 'A', r.kind);
  });
  await run('진리표: A′ — GO + exact + 위협 해소, CONFESS 없음', async () => {
    const r = await unitEnding(browser, { GO: true, LOC: 'exact', NAME_SENT: true, CONFESS: false });
    ok('A′', r.kind === 'A′', r.kind);
  });
  await run('진리표: C — 그 외', async () => {
    const r = await unitEnding(browser, {});
    ok('C', r.kind === 'C', r.kind);
  });

  await run('UI: 택시 → 청운고시원 → 엔딩 C', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=taxi');
    await startTaxi(page, '청운고시원');
    const kind = await finishFinal(page);
    ok('C', kind === 'C', String(kind));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('UI: 택시 → 해담 + 207 + 한결 고백 → 엔딩 A', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=taxi');
    await page.evaluate(() => DK.set('flags.NAME_SENT', true));
    await startTaxi(page, '해담고시텔');
    await page.locator('.final-input').fill('한결');
    await page.locator('.final-send').click();
    await page.waitForTimeout(150);
    await page.locator('.final-input').fill('207');
    await page.locator('.final-send').click();
    await page.waitForTimeout(650);
    const loc = await page.evaluate(() => LM.flag('LOC'));
    ok('207 입력으로 LOC exact', loc === 'exact', String(loc));
    const kind = await finishFinal(page);
    ok('A', kind === 'A', String(kind));
    ok('CONFESS 기록', await page.evaluate(() => LM.flag('CONFESS')) === true);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('UI: 택시 → 해담 + 207, 고백 없음 → 엔딩 A′', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=taxi');
    await page.evaluate(() => DK.set('flags.NAME_SENT', true));
    await startTaxi(page, '해담고시텔');
    await page.locator('.final-input').fill('207');
    await page.locator('.final-send').click();
    await page.waitForTimeout(650);
    const kind = await finishFinal(page);
    ok('A′', kind === 'A′', String(kind));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('UI: 마감 09:00, 예약 메일 삭제 상태 → 엔딩 B', async () => {
    const { ctx, page, errors } = await open(browser);
    await page.evaluate(() => {
      DK.set('npc.DH', 3);
      DK.set('flags.MAIL', 'deleted');
      DK.set('flags.REC_SENT', false);
      DK.set('flags.NAME_SENT', false);
      DK.set('flags.PLATE_SENT', false);
      LM.pause('test');
      DK.advance(710);
    });
    await page.waitForSelector('.cine-ending');
    const kind = await page.evaluate(() => LM.G.ending && LM.G.ending.kind);
    ok('B', kind === 'B', String(kind));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('UI: LEAK 상태로 청운 택시 → 엔딩 D', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=taxi');
    await page.evaluate(() => DK.set('flags.LEAK', true));
    await startTaxi(page, '청운고시원');
    const kind = await finishFinal(page);
    ok('D', kind === 'D', String(kind));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('다시 보기: 찾지 못한 앱 수·남긴 흔적, 정답 비공개', async () => {
    const { ctx, page } = await open(browser);
    await page.evaluate(() => { DK.set('npc.DH', 3); DK.set('flags.MAIL', 'deleted'); LM.endings.judge('test'); });
    await page.waitForSelector('.cine-ending');
    for (let i = 0; i < 3; i++) await page.locator('.end-advance').click();
    await page.waitForSelector('.end-replay');
    const text = await page.locator('.end-replay').innerText();
    ok('열어 보지 않은 앱 기능 수', /열어 보지 않은 앱 기능/.test(text), text.slice(0, 80));
    ok('남긴 흔적 목록', /남긴 흔적/.test(text), text.slice(0, 80));
    ok('처음부터 / 마지막 저장에서', /처음부터/.test(text) && /마지막 저장에서/.test(text));
    await ctx.close();
  });

  await browser.close();
  console.log('\n엔딩·최종 행동 테스트');
  console.log(results.join('\n'));
  console.log(failed ? `\n실패 ${failed}건` : '\n전부 통과');
  process.exit(failed ? 1 : 0);
})();
