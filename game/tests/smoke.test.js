/* 30개 앱이 다크·라이트에서 콘솔 오류 없이 열리는지 확인.
 * 실행: node game/tests/smoke.test.js */
const path = require('path');
const { chromium } = require('playwright');

const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto(URL + '?unlock');
  await page.waitForFunction(() => window.LM && window.LM.APPS);
  const apps = await page.evaluate(() => Object.keys(LM.APPS));
  let failed = 0;
  let checked = 0;

  for (const theme of ['dark', 'light']) {
    for (const id of apps) {
      errors.length = 0;
      const q = '?unlock&app=' + encodeURIComponent(id) + (theme === 'light' ? '&light' : '');
      await page.goto(URL + q);
      try {
        await page.waitForSelector(`.appwin[data-app="${id}"]`, { timeout: 4000 });
        await page.waitForTimeout(180);
      } catch (e) {
        failed++;
        console.log(`✗ ${theme} ${id}: 앱 창이 뜨지 않음`);
        continue;
      }
      checked++;
      if (errors.length) {
        failed++;
        console.log(`✗ ${theme} ${id}: ${errors.join(' / ')}`);
      }
    }
  }

  await browser.close();
  console.log(`\n앱 스모크: ${checked}/${apps.length * 2} 열림, 실패 ${failed}건`);
  process.exit(failed ? 1 : 0);
})();
