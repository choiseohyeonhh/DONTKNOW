/* stage 5: 배경 생활 — 결정적 알림, 오프라인, 조용한 창, 피드 비율·고정 순서, 게시물 열기.
 * 실행: node game/tests/ambient.test.js */
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
  await page.waitForFunction(() => window.LM && window.LM.G && window.LM.ambient);
  return { ctx, page, errors };
}
async function run(name, fn) {
  try { await fn(); } catch (e) { failed++; results.push('  ✗ ' + name + ' — ' + e.message); }
}
async function firstAmbient(browser, minutes) {
  const { ctx, page } = await open(browser, '?unlock&seed=1');
  const list = await page.evaluate((mins) => {
    LM.set({ wifi: true, airplane: false });
    LM.ev.setDH(2);
    LM.advance(mins);
    return LM.G.notifs.filter((n) => n.ambient)
      .slice().sort((a, b) => a.at - b.at)
      .map((n) => ({ at: n.at, app: n.app, body: n.body }));
  }, minutes);
  await ctx.close();
  return list;
}

(async () => {
  const browser = await chromium.launch();

  await run('같은 시드 = 같은 첫 20개(시각·문장)', async () => {
    const a = await firstAmbient(browser, 260);
    const b = await firstAmbient(browser, 260);
    ok('20개 이상', a.length >= 20, String(a.length));
    ok('첫 20개 완전 일치', JSON.stringify(a.slice(0, 20)) === JSON.stringify(b.slice(0, 20)));
  });

  await run('오프라인 동안 배경 알림 0', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&seed=1');
    const n = await page.evaluate(() => { LM.ev.setDH(2); LM.advance(120); return LM.G.notifs.filter((x) => x.ambient).length; });
    ok('0건', n === 0, String(n));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('캐논 EV-41 22:30 앞뒤 120초에 배경 알림 0', async () => {
    const list = await firstAmbient(browser, 120);
    const s = new Date(2026, 2, 17, 22, 28).getTime();
    const e = new Date(2026, 2, 17, 22, 32).getTime();
    const inWindow = list.filter((n) => n.at >= s && n.at <= e);
    ok('알림은 있다', list.length > 0, String(list.length));
    ok('조용한 창', inWindow.length === 0, JSON.stringify(inWindow));
  });

  await run('시간대 빈도(톡) 4구간', async () => {
    const list = await firstAmbient(browser, 705);
    const bands = { '21-24': [0, 0], '00-02': [0, 0], '02-06': [0, 0], '06-09': [0, 0] };
    list.filter((n) => n.app === 'talk').forEach((n) => {
      const h = new Date(n.at).getHours();
      if (h >= 21) bands['21-24'][0]++;
      else if (h < 2) bands['00-02'][0]++;
      else if (h < 6) bands['02-06'][0]++;
      else bands['06-09'][0]++;
    });
    ok('21–24 24~36', bands['21-24'][0] >= 24 && bands['21-24'][0] <= 36, JSON.stringify(bands));
    ok('00–02 6~12', bands['00-02'][0] >= 6 && bands['00-02'][0] <= 12, JSON.stringify(bands));
    ok('02–06 0~8', bands['02-06'][0] >= 0 && bands['02-06'][0] <= 8, JSON.stringify(bands));
    ok('06–09 15~27', bands['06-09'][0] >= 15 && bands['06-09'][0] <= 27, JSON.stringify(bands));
  });

  await run('피드 첫 50개: 배경 >= 4 × 핵심, 고정 역순', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&seed=1&app=loop');
    await page.waitForSelector('.appwin[data-app="loop"] .lp-card');
    const first = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.appwin[data-app="loop"] .lp-card')).slice(0, 50);
      const key = new Set(['dohyun.lee', 'jihoon_j', 'seoa.film', 'harin.daily', 'minji.sw', 'moneycoach.kang', 'side.money.kr', 'jh_lee_99']);
      const ids = cards.map((c) => c.dataset.del || (c.querySelector('.lp-handle') || {}).textContent);
      const k = cards.filter((c) => key.has((c.querySelector('.lp-handle') || {}).textContent)).length;
      return { n: cards.length, k: k, ids: ids.slice(0, 12) };
    });
    ok('50개를 그린다', first.n === 50, String(first.n));
    ok('핵심 20% 이하', first.n - first.k >= 4 * first.k, JSON.stringify(first));
    await page.reload();
    await page.waitForSelector('.appwin[data-app="loop"] .lp-card');
    const again = await page.evaluate(() => Array.from(document.querySelectorAll('.appwin[data-app="loop"] .lp-card')).slice(0, 12).map((c) => c.dataset.del || (c.querySelector('.lp-handle') || {}).textContent));
    ok('같은 시드 = 같은 순서', JSON.stringify(first.ids) === JSON.stringify(again), JSON.stringify(again));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('배경 게시물이 열린다', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&seed=1&app=loop');
    await page.waitForSelector('.appwin[data-app="loop"] .lp-card');
    const target = await page.evaluate(() => { const p = LM.ambient.posts()[0]; return { id: p.id, caption: p.caption || p.body }; });
    await page.locator('.lp-card[data-del="loop:' + target.id + '"] .lp-media').first().click();
    await page.waitForTimeout(420);
    const text = await page.locator('.appwin[data-app="loop"] .lp-detailbody, .appwin[data-app="loop"] .lp-cap').first().innerText();
    ok('상세가 열리고 내용이 보인다', text.includes(target.caption.slice(0, 8)), text.slice(0, 80) + ' / ' + target.caption);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await browser.close();
  console.log('\n배경 생활 테스트');
  console.log(results.join('\n'));
  console.log(failed ? `\n실패 ${failed}건` : '\n전부 통과');
  process.exit(failed ? 1 : 0);
})();
