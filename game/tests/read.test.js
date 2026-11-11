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
    // stage 3: 30분 위기(EV-06→EV-08)를 피하려고 도현에게 답한 상태로 둔다. 이 테스트는 읽음 계산만 본다.
    await page.evaluate(() => LM.ev.setDH(2));
    ok('첫 온라인 뒤 7(지훈 1 + 아빠 6)', (await page.evaluate(() => LM.badge('talk'))) === 7);
    ok('아빠 방 6', (await page.evaluate(() => LM.read.unreadCount('talk', 'dad'))) === 6);
    ok('홈 톡 배지 7', (await page.locator('.app[data-app="talk"] .badge').textContent()) === '7');

    await page.evaluate(() => LM.advance(80));
    await page.waitForTimeout(250);
    const afterAmbient = await page.evaluate(() => LM.badge('talk'));
    ok('배경 잡담이 온라인 뒤 홈·탭 숫자에 함께 들어간다(≥8)', afterAmbient >= 8, String(afterAmbient));

    await page.evaluate(() => LM.openApp('talk'));
    await page.waitForSelector('.appwin[data-app="talk"] .row');
    ok('홈·탭·단일 상태가 같은 수', (await page.locator('.app[data-app="talk"] .badge').textContent()) === String(afterAmbient) &&
      (await page.locator('.appwin[data-app="talk"] .tab-badge:not([hidden])').textContent()) === String(afterAmbient));
    const dadRow = page.locator('.appwin[data-app="talk"] .row', { hasText: '아빠' }).first();
    ok('채팅 목록 아빠 행 배지 6', (await dadRow.locator('.badge').textContent()) === '6');
    const rowSum = await page.evaluate(() => Array.from(document.querySelectorAll('.appwin[data-app="talk"] .row .badge')).reduce((n, b) => n + Number(b.textContent || 0), 0));
    ok('방 행 숫자 합 = 홈·탭 배지', rowSum === afterAmbient, rowSum + ' vs ' + afterAmbient);
    await dadRow.click();
    await page.waitForTimeout(300);
    const afterDad = await page.evaluate(() => LM.badge('talk'));
    ok('아빠 방 0', (await page.evaluate(() => LM.read.unreadCount('talk', 'dad'))) === 0);
    ok('아빠 방을 읽으면 홈·탭도 6 줄어든다', afterDad === afterAmbient - 6, afterAmbient + ' → ' + afterDad);
    ok('읽은 뒤에도 홈·탭이 같은 수', (await page.locator('.app[data-app="talk"] .badge').textContent()) === String(afterDad) &&
      (await page.locator('.appwin[data-app="talk"] .tab-badge:not([hidden])').textContent()) === String(afterDad));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('배지 일관성: 배경 메시지 1건이 방 행·탭·홈에서 같은 프레임에 늘고 준다', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=talk');
    await page.waitForSelector('.appwin[data-app="talk"] .row');
    await page.evaluate(() => LM.advance(5));
    await page.waitForTimeout(150);
    const base = await page.evaluate(() => LM.badge('talk'));
    await page.evaluate(() => LM.msg.add('talk', 'talk.biz26', {
      id: 'amb-badge-test', from: 'in', text: '배지 확인용 배경 메시지', at: LM.G.gameMs, silent: true, ambient: true,
    }));
    await page.waitForTimeout(120);
    const plus = await page.evaluate(() => LM.badge('talk'));
    const rowSum = await page.evaluate(() => Array.from(document.querySelectorAll('.appwin[data-app="talk"] .row .badge')).reduce((n, b) => n + Number(b.textContent || 0), 0));
    ok('배경 메시지가 단일 상태에서 1 증가', plus === base + 1, base + ' → ' + plus);
    ok('방 행 합 = 탭 = 홈', rowSum === plus &&
      (await page.locator('.appwin[data-app="talk"] .tab-badge:not([hidden])').textContent()) === String(plus) &&
      (await page.locator('.app[data-app="talk"] .badge').textContent()) === String(plus));
    await page.locator('.appwin[data-app="talk"] .row', { hasText: '경영 26 새내기' }).first().click();
    await page.waitForTimeout(250);
    const minus = await page.evaluate(() => LM.badge('talk'));
    ok('방을 열면 같은 상태에서 1 감소', minus === plus - 1, plus + ' → ' + minus);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('배지 일관성: 알림을 끈 방은 홈·탭·행 모두 점만, 숫자 없음', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=talk');
    await page.waitForSelector('.appwin[data-app="talk"] .row');
    await page.evaluate(() => {
      LM.read.items('talk').forEach((it) => LM.read.mark('talk', it.id));
    });
    await page.waitForTimeout(80);
    await page.evaluate(() => LM.msg.add('talk', 'talk.alba', {
      id: 'amb-muted-test', from: 'in', text: '교대 확인용 배경 메시지', at: LM.G.gameMs, silent: true, ambient: true,
    }));
    await page.waitForTimeout(120);
    const info = await page.evaluate(() => LM.badgeInfo('talk'));
    ok('숫자 0 · 점 1', info.count === 0 && info.dot === true, JSON.stringify(info));
    const home = page.locator('.app[data-app="talk"] .badge');
    const tab = page.locator('.appwin[data-app="talk"] .tab-badge:not([hidden])');
    ok('홈 배지 점', (await home.textContent()) === '•' && (await home.evaluate((el) => el.classList.contains('dot'))));
    ok('탭 배지 점', (await tab.textContent()) === '•');
    const row = page.locator('.appwin[data-app="talk"] .row', { hasText: '편의점 알바' }).first();
    ok('방 행은 점만, 숫자 배지 없음', (await row.locator('.talk-mutedot').count()) === 1 && (await row.locator('.badge').count()) === 0);
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
