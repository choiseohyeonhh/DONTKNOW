/* stage 4 MUST-FIX: 위기 해법을 실제 UI만으로 끝까지 (카메라 → 사진 → 메시지 전송).
 * 실행: node game/tests/crisis-ui.test.js */
const path = require('path');
const { chromium } = require('playwright');

const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const results = [];
let failed = 0;

function ok(name, cond, extra) {
  if (cond) results.push('  ✓ ' + name);
  else { failed++; results.push('  ✗ ' + name + (extra ? ' — ' + extra : '')); }
}

async function open(browser) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(URL + '?unlock');
  await page.waitForFunction(() => window.LM && window.LM.G && window.LM.ev && window.LM.trace);
  return { ctx, page, errors };
}

async function run(name, fn) {
  try { await fn(); }
  catch (e) { failed++; results.push('  ✗ ' + name + ' — ' + e.message); }
}

async function openMsgRoom(page) {
  await page.locator('.app[data-app="msg"]').click();
  await page.waitForSelector('.appwin[data-app="msg"] .row');
  await page.locator('.appwin[data-app="msg"] .row', { hasText: '도현의 슬레이트' }).first().click();
  await page.waitForSelector('.appwin[data-app="msg"] .msg-room');
}

(async () => {
  const browser = await chromium.launch();

  await run('UI만으로: Wi-Fi → 37분 → 아빠다 → 9분 → 서랍 사진 촬영 → 전송 → DH-3·지우기 취소', async () => {
    const { ctx, page, errors } = await open(browser);
    await page.evaluate(() => LM.set({ wifi: true, airplane: false }));
    await page.waitForTimeout(120);
    await page.evaluate(() => LM.pause('test'));
    await page.evaluate(() => DK.advance(37));

    await openMsgRoom(page);
    await page.locator('.cmp-input').fill('아빠다');
    await page.locator('.cmp-send').click();
    await page.evaluate(() => DK.advance(9));
    await page.waitForTimeout(120);
    const asked = await page.evaluate(() => LM.msg.list('msg', 'cirrus').some((m) => m.from === 'in' && /내 방 사진 찍어 보내/.test(m.text)));
    ok('도현이 서랍 사진을 요구했다', asked === true);

    // 카메라: 서랍 구도 → 서랍 열기 → 촬영
    await page.locator('.home-ind').click();
    await page.waitForTimeout(80);
    await page.locator('.app[data-app="cam"]').click();
    await page.waitForSelector('.cam-shutter');
    await page.locator('.cam-dot[aria-label="서랍 구도"]').click();
    await page.locator('.cam-drawer-front').click();
    await page.waitForTimeout(120);
    await page.locator('.cam-shutter').click();
    await page.waitForTimeout(120);
    const shot = await page.evaluate(() => (LM.G.shots || []).find((s) => s.app === 'cam'));
    ok('카메라 사진이 저장됐다', !!shot && shot.eid === 'E-217b', JSON.stringify(shot && { eid: shot.eid }));

    // 메시지 작성창 "+" → 사진 선택 → 최신 촬영 사진 → 전송
    await page.locator('.home-ind').click();
    await page.waitForTimeout(80);
    await openMsgRoom(page);
    await page.locator('.cmp-plus').click();
    await page.locator('.as-btn', { hasText: '사진' }).click();
    await page.waitForSelector('.cmp-pickgrid .ph-cell');
    await page.locator('.cmp-pickgrid .ph-cell').first().click();
    const chip = await page.locator('.cmp-attach .cmp-chip span').first().textContent();
    ok('고른 사진이 첨부로 붙었다', /서랍|봉투/.test(chip || ''), String(chip));
    await page.locator('.cmp-send').click();
    await page.evaluate(() => DK.advance(10));
    await page.waitForTimeout(150);

    const st = await page.evaluate(() => ({
      dh: LM.G.npc.DH,
      wiped: LM.flag('WIPED'),
      screen: !!document.querySelector('.wipe-setup'),
      ev08: LM.G.sched.some((e) => /^EV-08/.test(e.id)),
      dadUnread: [1, 2, 3, 4, 5, 6].map((i) => LM.read.isUnread('talk', 'dad:' + i)),
    }));
    ok('서랍 사진으로 DH-3', st.dh === 3, String(st.dh));
    ok('원격 지우기가 실행되지 않았다', st.wiped === false && st.screen === false, JSON.stringify(st));
    ok('EV-08 예약이 취소됐다', st.ev08 === false, String(st.ev08));
    ok('아빠 톡방의 "1"이 모두 사라졌다', st.dadUnread.every((v) => v === false), JSON.stringify(st.dadUnread));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('카메라 사진은 사진 > 최근 항목에 최신으로 뜨고 썸네일이 연다', async () => {
    const { ctx, page, errors } = await open(browser);
    await page.locator('.app[data-app="cam"]').click();
    await page.waitForSelector('.cam-shutter');
    await page.locator('.cam-shutter').click();
    await page.waitForTimeout(120);
    await page.locator('.home-ind').click();
    await page.waitForTimeout(80);
    await page.locator('.app[data-app="photo"]').click();
    await page.waitForSelector('.appwin[data-app="photo"] .ph-grid');
    const first = await page.locator('.appwin[data-app="photo"] .ph-cell').first().getAttribute('data-del');
    ok('최근 항목의 첫 사진이다', /shot-/.test(first || ''), String(first));
    await page.locator('.appwin[data-app="photo"] .ph-cell').first().click();
    await page.waitForSelector('.phv-img');
    ok('새 카메라 사진이 뷰어로 열린다', (await page.locator('.phv-img').count()) === 1);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await browser.close();
  console.log('\n위기 UI 테스트');
  console.log(results.join('\n'));
  console.log(failed ? `\n실패 ${failed}건` : '\n전부 통과');
  process.exit(failed ? 1 : 0);
})();
