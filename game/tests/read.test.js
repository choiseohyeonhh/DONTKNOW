/* stage 1b: 읽음·배지·원격 삭제·오프라인 게이트 통합 테스트.
 * 실행: node game/tests/read.test.js */
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
  await page.waitForFunction(() => window.LM && window.LM.G && window.LM.read);
  return { ctx, page, errors };
}

async function run(name, fn) {
  try { await fn(); }
  catch (e) { failed++; results.push('  ✗ ' + name + ' — ' + e.message); }
}

(async () => {
  const browser = await chromium.launch();

  await run('메시지: 방을 열면 목록·홈 배지가 즉시 사라진다', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=msg');
    await page.waitForSelector('.appwin[data-app="msg"] .row');
    ok('시작 msg 배지 4', (await page.evaluate(() => LM.badge('msg'))) === 4);
    const homeBefore = await page.locator('.app[data-app="msg"] .badge').textContent();
    ok('홈 배지 4', homeBefore === '4', String(homeBefore));
    ok('첫 방 안 읽음 1', (await page.evaluate(() => {
      const id = LM.read.items('msg')[0].threadId;
      return LM.read.unreadCount('msg', id);
    })) === 1);

    await page.locator('.appwin[data-app="msg"] .row').first().click();
    await page.waitForTimeout(200);
    const thread = await page.evaluate(() => LM.G.read.msg ? Object.keys(LM.G.read.msg)[0] : null);
    ok('읽음 상태가 G.read.msg에 남는다', !!thread, String(thread));
    ok('목록 첫 행 배지에서 1이 사라졌다', (await page.locator('.appwin[data-app="msg"] .row').first().locator('.badge').count()) === 0);

    await page.locator('.appwin[data-app="msg"] .nb-back').first().click();
    await page.waitForTimeout(400);
    const homeAfter = await page.locator('.app[data-app="msg"] .badge').textContent();
    ok('홈 배지 3', homeAfter === '3', String(homeAfter));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('톡: 온라인 후 아빠 방 6 → 열면 0, 탭·홈도 함께 줄어든다', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    ok('오프라인 시작 톡 배지 1(지훈)', (await page.evaluate(() => LM.badge('talk'))) === 1);
    await page.evaluate(() => LM.set({ airplane: false, wifi: true }));
    await page.waitForTimeout(300);
    ok('첫 온라인 뒤 7(지훈 1 + 아빠 6)', (await page.evaluate(() => LM.badge('talk'))) === 7);
    ok('아빠 방 6', (await page.evaluate(() => LM.read.unreadCount('talk', 'dad'))) === 6);
    ok('홈 톡 배지 7', (await page.locator('.app[data-app="talk"] .badge').textContent()) === '7');

    await page.evaluate(() => LM.advance(80));
    await page.waitForTimeout(250);
    ok('22:30 단톡 글 뒤 8', (await page.evaluate(() => LM.badge('talk'))) === 8, String(await page.evaluate(() => LM.badge('talk'))));

    await page.evaluate(() => LM.openApp('talk'));
    await page.waitForSelector('.appwin[data-app="talk"] .row');
    const dadRow = page.locator('.appwin[data-app="talk"] .row', { hasText: '아빠' }).first();
    ok('채팅 목록 아빠 행 배지 6', (await dadRow.locator('.badge').textContent()) === '6');
    ok('탭 배지 8', (await page.locator('.appwin[data-app="talk"] .tab-badge:not([hidden])').textContent()) === '8');
    await dadRow.click();
    await page.waitForTimeout(300);
    ok('아빠 방 0', (await page.evaluate(() => LM.read.unreadCount('talk', 'dad'))) === 0);
    ok('남은 전체 2(지훈 1 + 단톡 1)', (await page.evaluate(() => LM.badge('talk'))) === 2, String(await page.evaluate(() => LM.badge('talk'))));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('오프라인 읽음은 pending, 다음 온라인에 sent', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await page.evaluate(() => { window.__receipts = []; LM.on('receiptSent', (e) => window.__receipts.push(e)); });
    await page.evaluate(() => LM.openApp('talk'));
    await page.waitForSelector('.appwin[data-app="talk"] .row');
    await page.locator('.appwin[data-app="talk"] .row', { hasText: '지훈' }).first().click();
    await page.waitForTimeout(250);
    const pending = await page.evaluate(() => {
      const b = LM.G.read.talk || {};
      return Object.keys(b).map((k) => b[k].receipt);
    });
    ok('오프라인 읽음 receipt=pending', pending.length > 0 && pending.every((r) => r === 'pending'), pending.join(','));
    await page.evaluate(() => LM.set({ airplane: false, wifi: true }));
    await page.waitForTimeout(300);
    const sent = await page.evaluate(() => {
      const b = LM.G.read.talk || {};
      return Object.keys(b).map((k) => b[k].receipt);
    });
    ok('온라인 뒤 receipt=sent', sent.length > 0 && sent.every((r) => r === 'sent'), sent.join(','));
    ok('receiptSent 이벤트 발생', (await page.evaluate(() => window.__receipts.length)) > 0);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('원격 삭제: 0.4초 페이드 + 3초 문구, 목록·검색에서 사라짐', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=photo');
    await page.waitForSelector('.ph-cell[data-del="photo:family"]');
    await page.evaluate(() => LM.remoteDelete('photo', 'family'));
    ok('삭제 문구 표시', (await page.locator('.toast').textContent()).includes('1개 항목이 다른 기기에서 삭제됨'));
    ok('G.deleted에 기록', await page.evaluate(() => LM.isDeleted('photo', 'family')));
    await page.waitForTimeout(500);
    ok('화면에서 사라짐', (await page.locator('.ph-cell[data-del="photo:family"]').count()) === 0);
    ok('검색에서도 제외', await page.evaluate(() => !LM.searchSources.some((s) => s.app === 'photo' && s.items().some((it) => it.title === '가족사진'))));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('은행: 오프라인 진입 차단, 키패드 비활성', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=bank');
    await page.waitForSelector('.appwin[data-app="bank"]');
    ok('온라인 안내', (await page.locator('.b-guide').textContent()).includes('온라인이 필요합니다'));
    const allOff = await page.evaluate(() => Array.from(document.querySelectorAll('.b-key')).filter((b) => !b.classList.contains('ghost')).every((b) => b.disabled));
    ok('키패드 전부 비활성', allOff === true);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await browser.close();
  console.log('\n읽음·삭제·게이트 테스트');
  console.log(results.join('\n'));
  console.log(failed ? `\n실패 ${failed}건` : '\n전부 통과');
  process.exit(failed ? 1 : 0);
})();
