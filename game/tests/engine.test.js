/* 엔진 기초 통합 테스트 (node + playwright).
 * 실행: node game/tests/engine.test.js */
const path = require('path');
const { chromium } = require('playwright');

const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const results = [];
let failed = 0;

function ok(name, cond, extra) {
  if (cond) { results.push('  ✓ ' + name); }
  else { failed++; results.push('  ✗ ' + name + (extra ? ' — ' + extra : '')); }
}

async function open(browser, query) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(URL + (query || ''));
  await page.waitForFunction(() => window.LM && window.LM.G);
  return { ctx, page, errors };
}

async function run(name, fn) {
  try { await fn(); }
  catch (e) { failed++; results.push('  ✗ ' + name + ' — ' + e.message); }
}

(async () => {
  const browser = await chromium.launch();

  await run('새 게임: 프롤로그 3컷 → 잠금화면', async () => {
    const { ctx, page, errors } = await open(browser, '?new');
    await page.waitForSelector('.cine-prologue');
    const caps = await page.locator('.cine-line').allTextContents();
    ok('프롤로그 첫 자막', caps.join(' ').includes('3월 15일 밤'), caps.join(' | '));
    await page.locator('.cine-prologue').click();
    await page.waitForTimeout(350);
    await page.locator('.cine-prologue').click();
    await page.waitForTimeout(350);
    await page.locator('.cine-prologue').click();
    await page.waitForSelector('.cine-prologue', { state: 'detached' });
    const st = await page.evaluate(() => ({ seen: LM.G.prologueSeen, locked: LM.state.locked, unlocked: LM.G.unlocked }));
    ok('프롤로그를 본 것으로 기록', st.seen === true);
    ok('잠금화면으로 복귀', st.locked === true && st.unlocked === false);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('시계: ×4로 흐르고 일시정지하면 멈춘다', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    const t0 = await page.evaluate(() => LM.G.gameMs);
    await page.waitForTimeout(1200);
    const t1 = await page.evaluate(() => LM.G.gameMs);
    ok('시계가 흐른다', t1 > t0 + 1000, `${t1 - t0}ms`);
    await page.evaluate(() => LM.pause());
    const t2 = await page.evaluate(() => LM.G.gameMs);
    await page.waitForTimeout(900);
    const t3 = await page.evaluate(() => LM.G.gameMs);
    ok('일시정지 중에는 멈춘다', t3 === t2, `${t3 - t2}ms`);
    await page.evaluate(() => LM.resume());
    await page.waitForTimeout(700);
    const t4 = await page.evaluate(() => LM.G.gameMs);
    ok('재개하면 다시 흐른다', t4 > t3 + 500, `${t4 - t3}ms`);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('저장·불러오기: 새로고침 후 같은 게임 시각(±1분)', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await page.evaluate(() => LM.advance(42));
    const before = await page.evaluate(() => LM.G.gameMs);
    await page.reload();
    await page.waitForFunction(() => window.LM && window.LM.G);
    const after = await page.evaluate(() => LM.G.gameMs);
    ok('게임 시각이 이어진다', Math.abs(after - before) <= 60000, `${after - before}ms`);
    ok('자동 저장에서 복원', await page.evaluate(() => LM.listSaves()[0].exists === true));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('스케줄러: LM.advance에서 시간 순서로 발화', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await page.evaluate(() => {
      window.__order = [];
      LM.sched.after('e10', 10, () => window.__order.push('e10'));
      LM.sched.after('e5', 5, () => window.__order.push('e5'));
      LM.sched.after('e20', 20, () => window.__order.push('e20'));
      LM.advance(15);
    });
    const mid = await page.evaluate(() => ({ order: window.__order.slice(), events: Object.keys(LM.G.events) }));
    ok('15분 뒤: e5 → e10', mid.order.join(',') === 'e5,e10', mid.order.join(','));
    ok('e20은 아직', !mid.events.includes('e20'), mid.events.join(','));
    await page.evaluate(() => LM.advance(5));
    const end = await page.evaluate(() => ({ order: window.__order.slice(), events: Object.keys(LM.G.events), sched: LM.G.sched.map((e) => e.id) }));
    ok('20분 뒤: e20까지', end.order.join(',') === 'e5,e10,e20', end.order.join(','));
    ok('사용자 예약이 모두 발화되어 목록에서 사라짐', !end.sched.some((id) => ['e5', 'e10', 'e20'].indexOf(id) >= 0), end.sched.join(','));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('스케줄러: needsOnline은 오프라인에서 기다린다', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await page.evaluate(() => {
      LM.set({ wifi: false, airplane: false });
      window.__fired = false;
      LM.sched.after('neednet', 1, () => { window.__fired = true; }, { needsOnline: true });
      LM.advance(5);
    });
    ok('오프라인: 발화하지 않음', (await page.evaluate(() => window.__fired)) === false);
    await page.evaluate(() => LM.set({ wifi: true }));
    await page.waitForTimeout(250);
    ok('온라인: 발화함', (await page.evaluate(() => window.__fired)) === true);
    ok('firstOnline 기록', (await page.evaluate(() => LM.G.firstOnlineAt)) != null);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('스케줄러: 예약이 저장·불러오기 후에도 살아남는다', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await page.evaluate(() => {
      LM.sched.after('persist', 10, () => { window.__persist = true; });
      LM.saveGame('auto');
    });
    ok('예약이 G.sched에 저장됨', await page.evaluate(() => LM.G.sched.some((e) => e.id === 'persist')));
    await page.reload();
    await page.waitForFunction(() => window.LM && window.LM.G);
    await page.evaluate(() => {
      LM.sched.def('persist', () => { window.__persist = true; });
      LM.advance(10);
    });
    ok('불러온 뒤 발화', (await page.evaluate(() => window.__persist)) === true);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('알림: 알림 센터에 나타난다', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await page.evaluate(() => {
      LM.notify({ id: 'test-notif', app: 'msg', title: '테스트 알림', body: '본문입니다' });
      LM.openNotifCenter();
    });
    await page.waitForSelector('.nc .ncard');
    const text = await page.locator('.nc').innerText();
    ok('알림 센터에 본문 표시', text.includes('테스트 알림') && text.includes('본문입니다'), text.slice(0, 80));
    ok('G.notifs에 저장', await page.evaluate(() => LM.G.notifs.some((n) => n.id === 'test-notif')));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('온라인: 잠금 전에 켜 두면 해제 순간 첫 온라인', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await page.evaluate(() => { LM.set({ locked: true }); LM.set({ wifi: true, airplane: false }); });
    const before = await page.evaluate(() => LM.G.firstOnlineAt);
    ok('잠긴 동안에는 첫 온라인 없음', before == null, String(before));
    await page.evaluate(() => LM.set({ locked: false }));
    ok('해제하면 첫 온라인 기록', (await page.evaluate(() => LM.G.firstOnlineAt)) != null);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('일시정지 메뉴: 열면 시계가 멈추고 닫으면 재개', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await page.evaluate(() => LM.pauseUI.open());
    await page.waitForSelector('.pause');
    const t0 = await page.evaluate(() => LM.G.gameMs);
    await page.waitForTimeout(500);
    const t1 = await page.evaluate(() => LM.G.gameMs);
    ok('열려 있는 동안 시계 정지', t0 === t1, `${t1 - t0}ms`);
    ok('메뉴 항목 5개', (await page.locator('.pause-item').count()) === 5);
    await page.locator('.pause-item', { hasText: '계속하기' }).click();
    await page.waitForTimeout(250);
    ok('닫으면 시계 재개', (await page.evaluate(() => LM.paused())) === false);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await browser.close();
  console.log('\n엔진 테스트');
  console.log(results.join('\n'));
  console.log(failed ? `\n실패 ${failed}건` : '\n전부 통과');
  process.exit(failed ? 1 : 0);
})();
