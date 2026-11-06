const assert = require('assert');
const { chromium } = require('playwright');

const URL = 'file:///home/user/DONTKNOW/mvp/index.html?debug=1&speed=20';
const errors = [];

async function openPage(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  await page.goto(URL);
  return { context, page };
}

async function startToLock(page) {
  await page.click('[data-act="noticeOk"]');
  await page.click('[data-act="start"]');
  await page.waitForSelector('#cine.show', { timeout: 5000 });
  await page.click('#cine .skip');
  await page.waitForSelector('.lock', { timeout: 5000 });
  await page.waitForFunction(() => window.__game.S.session === 'S01');
}

async function unlockToHome(page) {
  await page.click('.lock [data-act="unlock"]');
  await page.waitForSelector('.home', { timeout: 3000 });
}

async function openJihoon(page) {
  await page.click('[data-app="msg"]');
  await page.waitForSelector('[data-act="thread"][data-id="jihoon"]');
  await page.click('[data-act="thread"][data-id="jihoon"]');
  await page.waitForFunction(() => {
    const g = window.__game;
    return g.S.session === 'S02' && g.S.dlg && g.S.dlg.channel === 'sms';
  }, null, { timeout: 10000 });
}

async function pick(page, text) {
  await page.waitForFunction(() => {
    const g = window.__game;
    const d = g.S.dlg;
    return !!(d && d.waiting && g.visibleOpts(d.waiting).length);
  }, null, { timeout: 10000 });
  const info = await page.evaluate(() => {
    const g = window.__game;
    const ch = g.S.dlg.channel;
    const labels = g.visibleOpts(g.S.dlg.waiting).map((o) => {
      const L = o.label;
      if (typeof L === 'string') return L;
      return ch === 'call' ? (L.c || L.m || '') : (L.m || L.c || '');
    });
    return { ch, labels };
  });
  const index = info.labels.findIndex((s) => s.includes(text));
  assert(index >= 0, `선택지 없음: ${text} / ${JSON.stringify(info.labels)}`);
  if (info.ch === 'call') {
    await page.locator('.call .ch .opt:visible').nth(index).click();
  } else {
    const open = await page.locator('.sheet .opt:visible').count();
    if (open) {
      await page.locator('.sheet .opt:visible').nth(index).click();
    } else {
      await page.click('.compose .field.ready');
      await page.locator('.sheet .opt:visible').nth(index).click();
    }
  }
  await page.waitForTimeout(50);
}

async function finishS2(page) {
  await page.waitForFunction(() => window.__game.S.flags['S02.ended'], null, { timeout: 10000 });
  await page.waitForSelector('#cine.show', { timeout: 5000 });
  await page.click('#cine .skip');
  await page.waitForFunction(() => {
    const g = window.__game;
    return g.S.session === 'S03' && g.S.clock[0] === 8 && g.S.clock[1] === 40 && !g.S.unlocked;
  }, null, { timeout: 5000 });
  await page.waitForSelector('.lock', { timeout: 3000 });
}

async function runA(browser) {
  const { context, page } = await openPage(browser);
  await startToLock(page);
  await unlockToHome(page);
  await openJihoon(page);

  await pick(page, '그래 지훈아 무슨 일이냐');
  await pick(page, '그래 연락 줘서 고맙다');
  await pick(page, '폰을 계속 봤다');
  await pick(page, '그래');
  await pick(page, '알았다. 늦었는데');

  await finishS2(page);

  const a = await page.evaluate(() => {
    const g = window.__game;
    const ck = JSON.parse(localStorage.getItem('dontknow.mvp.checkpoint') || 'null');
    return {
      know: { ...g.S.know },
      fx01: !!g.S.flags['FX-01'],
      dest: [...g.S.destinations],
      clock: [...g.S.clock],
      place: g.S.place,
      checkpoint: ck && ck.session,
    };
  });
  assert(a.know['K-01'], 'K-01 누락');
  assert(a.know['K-02'], 'K-02 누락');
  assert(a.know['K-03'], 'K-03 누락');
  assert(a.know['KX-02'], 'KX-02 누락');
  assert(!a.know['K-04'], '문자 경로에서 K-04가 획득됨');
  assert(!a.know['K-05'], '문자 경로에서 K-05가 획득됨');
  assert(!a.know['KX-04'], '문자 경로에서 KX-04가 획득됨');
  assert(!a.fx01, '문자 경로에서 통화 플래그 설정됨');
  assert(a.dest.includes('school'), '성원고 목적지 미등록');
  assert(a.clock[0] === 8 && a.clock[1] === 40, 'S2 종료 시각이 08:40이 아님');
  assert(a.checkpoint === 'S03', '체크포인트가 S03이 아님');

  await unlockToHome(page);
  await page.click('[data-app="map"]');
  await page.waitForSelector('[data-act="route"][data-place="school"]');
  await page.click('[data-act="route"][data-place="school"]');
  await page.waitForSelector('.route-card');
  const route = await page.locator('.route-card').innerText();
  assert(route.includes('성원고까지 20분'), `경로 카드: ${route}`);
  assert(route.includes('09:00'), `도착 예정 시각: ${route}`);
  await page.click('[data-act="startnav"]');
  await page.waitForSelector('.travel[data-k="travel"]');
  const travel = await page.locator('.travel[data-k="travel"]').innerText();
  assert(travel.includes('성원고'), '이동 화면 목적지 누락');
  assert(await page.locator('#travel-route').count() === 1, '경로선 누락');
  await page.waitForSelector('.scene .line', { timeout: 5000 });
  const line = await page.locator('.scene .line').innerText();
  assert(line.includes('S3는 다음 단계에서'), `도착 대사: ${line}`);
  const arrived = await page.evaluate(() => ({ place: window.__game.S.place, clock: [...window.__game.S.clock] }));
  assert(arrived.place === 'school', '도착 장소가 성원고가 아님');
  assert(arrived.clock[0] === 9 && arrived.clock[1] === 0, '이동 도착 시각이 09:00이 아님');

  await context.close();
}

async function runB(browser) {
  const { context, page } = await openPage(browser);
  await startToLock(page);
  await unlockToHome(page);
  await openJihoon(page);

  await pick(page, '그래 지훈아 무슨 일이냐');
  await pick(page, '그래 연락 줘서 고맙다');
  await pick(page, '폰을 계속 봤다');
  await pick(page, '(전화한다)');
  await page.waitForSelector('.call .ch .opt', { timeout: 5000 });
  await pick(page, '혹시 도현이 폰 비밀번호 아냐?');
  await pick(page, '대학 친구들한테는 물어봤냐?');
  await pick(page, '알았다. 늦었는데');

  await finishS2(page);

  const b = await page.evaluate(() => {
    const g = window.__game;
    return { know: { ...g.S.know }, fx01: !!g.S.flags['FX-01'], clock: [...g.S.clock] };
  });
  assert(b.know['K-01'], 'K-01 누락');
  assert(b.know['K-02'], 'K-02 누락');
  assert(b.know['K-03'], 'K-03 누락');
  assert(b.know['K-04'], 'K-04 누락');
  assert(b.know['K-05'], 'K-05 누락');
  assert(b.know['KX-02'], 'KX-02 누락');
  assert(b.know['KX-04'], 'KX-04 누락');
  assert(b.fx01, 'FX-01 누락');
  assert(b.clock[0] === 8 && b.clock[1] === 40, 'S2 종료 시각이 08:40이 아님');

  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await runA(browser);
    console.log('run A: PASS');
    await runB(browser);
    console.log('run B: PASS');
  } finally {
    await browser.close();
  }
  if (errors.length) {
    console.error('페이지 에러:');
    errors.forEach((e) => console.error(' - ' + e));
    process.exit(1);
  }
  console.log('page errors: 0');
})().catch((e) => {
  console.error(e.stack || e);
  if (errors.length) errors.forEach((x) => console.error(' - ' + x));
  process.exit(1);
});
