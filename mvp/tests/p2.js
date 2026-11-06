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

async function state(page) {
  return page.evaluate(() => {
    const S = window.__game.S;
    return {
      dlg: S.dlg ? { channel: S.dlg.channel, waiting: !!S.dlg.waiting, line: S.dlg.line && S.dlg.line.text } : null,
      cctv: !!S.cctv,
      session: S.session,
      place: S.place,
      clock: [...S.clock],
      know: { ...S.know },
      flags: { ...S.flags },
      v: { ...S.v },
      mono: S.mono,
      stack: S.stack.map((x) => ({ ...x })),
    };
  });
}

async function advanceUntil(page, pred, timeout = 20000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const st = await state(page);
    if (pred(st)) return st;
    if (st.cctv || (st.dlg && st.dlg.waiting) || !st.dlg) return st;
    const tap = page.locator('.scene .dlg');
    if (await tap.count()) await tap.click({ timeout: 600 }).catch(() => {});
    await page.waitForTimeout(35);
  }
  throw new Error('advanceUntil timeout');
}

async function faceChoice(page, text) {
  await page.waitForFunction(() => {
    const d = window.__game.S.dlg;
    return !!(d && d.waiting && window.__game.visibleOpts(d.waiting).length);
  }, null, { timeout: 10000 });
  const labels = await page.evaluate(() => {
    const g = window.__game;
    const d = g.S.dlg;
    return g.visibleOpts(d.waiting).map((o) => g.labelText(o, d.channel));
  });
  const i = labels.findIndex((s) => s.includes(text));
  assert(i >= 0, `대면 선택지 없음: ${text} / ${JSON.stringify(labels)}`);
  await page.locator('.scene .choices button').nth(i).click();
  await page.waitForTimeout(40);
}

async function callChoice(page, text) {
  await page.waitForSelector('.call .ch .opt', { timeout: 10000 });
  const labels = await page.evaluate(() => {
    const g = window.__game;
    const d = g.S.dlg;
    return g.visibleOpts(d.waiting).map((o) => g.labelText(o, d.channel));
  });
  const i = labels.findIndex((s) => s.includes(text));
  assert(i >= 0, `통화 선택지 없음: ${text} / ${JSON.stringify(labels)}`);
  await page.locator('.call .ch .opt').nth(i).click();
  await page.waitForTimeout(40);
}

async function goHome(page) {
  const hi = page.locator('#homeind');
  if (await hi.isEnabled().catch(() => false)) await hi.click();
  await page.waitForSelector('.home', { timeout: 5000 });
}

async function travel(page, place) {
  await goHome(page);
  await page.click('[data-app="map"]');
  await page.waitForSelector(`[data-act="route"][data-place="${place}"]`, { timeout: 5000 });
  await page.click(`[data-act="route"][data-place="${place}"]`);
  await page.waitForSelector('.route-card', { timeout: 5000 });
  await page.click('[data-act="startnav"]');
}

async function openMessages(page, threadId) {
  await goHome(page);
  await page.click('[data-app="msg"]');
  await page.waitForSelector(`[data-act="thread"][data-id="${threadId}"]`, { timeout: 5000 });
  await page.click(`[data-act="thread"][data-id="${threadId}"]`);
  await page.waitForTimeout(80);
}

async function mainRun(browser) {
  const { context, page } = await openPage(browser);

  await page.evaluate(() => window.__game.jump('S03'));
  await page.waitForSelector('.scene .line', { timeout: 5000 });
  let st = await state(page);
  assert(st.session === 'S03', 'S3 세션 시작 실패');
  assert(st.place === 'school', 'S3 장소가 학교가 아님');
  assert(st.clock[0] === 9 && st.clock[1] === 0, 'S3 시작 시각이 09:00이 아님');
  const status = await page.evaluate(() => {
    const el = document.querySelector('#status');
    return { display: getComputedStyle(el).display, text: el.innerText };
  });
  assert(status.display === 'flex', 'jump 후 상태바가 보이지 않음');
  assert(status.text.includes('09:00'), `상태바 시각 누락: ${status.text}`);

  await faceChoice(page, '제가요? 저는 그런 거 보낸 적 없는데요.');
  await advanceUntil(page, (s) => !!s.flags['S03.seoyeonSent']);

  await page.waitForTimeout(450);
  await page.click('.scene .phonebtn');
  await page.waitForSelector('.home', { timeout: 5000 });
  await page.click('[data-app="talk"]');
  await page.waitForSelector('[data-act="talkopen"][data-id="seoyeon"]', { timeout: 5000 });
  await page.click('[data-act="talkopen"][data-id="seoyeon"]');
  await page.waitForSelector('.talk-thread', { timeout: 5000 });
  await page.waitForFunction(() => window.__game.has('K-07'), null, { timeout: 5000 });
  await page.click('.talk-choices button:has-text("알려줘서 고마워요")');
  await page.waitForTimeout(120);
  await page.click('.scene-back');
  await page.waitForSelector('.scene .dlg', { timeout: 5000 });

  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '상담실로 간다');
  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '도현이가 없어졌습니다. 나흘쨉니다.');
  await advanceUntil(page, (s) => !s.dlg);
  await page.waitForFunction(() => window.__game.flag('S03.ended'), null, { timeout: 5000 });
  await page.waitForSelector('.home', { timeout: 5000 });

  st = await state(page);
  assert(st.know['K-06'], 'K-06 누락');
  assert(st.know['K-07'], 'K-07 누락');
  assert(st.know['KX-10'], 'KX-10 누락');
  assert(st.flags['S03.ended'], 'S3 종료 플래그 누락');

  await openMessages(page, 'teacher');
  await page.waitForFunction(() => window.__game.has('KX-01'), null, { timeout: 5000 });

  await travel(page, 'home');
  await page.waitForSelector('.scene .line', { timeout: 8000 });
  await page.waitForFunction(() => window.__game.S.session === 'S04', null, { timeout: 5000 });

  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '이렇게 와 줘서 고마워요.');
  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '준호가 어떤 앤데요?');
  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '…그랬군요.');
  await page.waitForFunction(() => window.__game.flag('S04.yujinDone'), null, { timeout: 8000 });

  st = await state(page);
  assert(st.know['K-08'], 'K-08 누락');
  assert(st.flags['F-01'], '신뢰 2회 이상인데 F-01 누락');
  assert((st.v.s4_trust_count || 0) >= 2, `신뢰 카운트: ${st.v.s4_trust_count}`);

  await page.waitForSelector('.sheet [data-act="accept"]', { timeout: 8000 });
  await page.click('.sheet [data-act="accept"]');
  await callChoice(page, '네, 지금 가겠습니다.');
  await page.waitForSelector('.route-card', { timeout: 8000 });
  const policeRoute = await page.locator('.route-card').innerText();
  assert(policeRoute.includes('성원경찰서'), `경찰서 경로: ${policeRoute}`);
  await page.click('[data-act="startnav"]');
  await page.waitForSelector('.scene .line', { timeout: 8000 });
  await page.waitForFunction(() => window.__game.S.session === 'S05', null, { timeout: 5000 });

  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, "'형'이라는");
  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '…알겠습니다. 수고하십시오.');
  await page.waitForFunction(() => window.__game.flag('S05.done'), null, { timeout: 8000 });

  st = await state(page);
  assert(st.know['K-09'], 'K-09 누락');
  assert(st.know['K-10'], 'K-10 누락');
  assert(st.know['K-11'], 'K-11 누락');

  await page.waitForSelector('.route-card', { timeout: 8000 });
  const martRoute = await page.locator('.route-card').innerText();
  assert(martRoute.includes('하루마트 성원역점'), `마트 경로: ${martRoute}`);
  await page.click('[data-act="startnav"]');
  await page.waitForSelector('.scene .line', { timeout: 8000 });
  await page.waitForFunction(() => window.__game.S.session === 'S06', null, { timeout: 5000 });

  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '그 애가 제 아들입니다.');
  await page.waitForSelector('.cctv', { timeout: 8000 });

  await page.evaluate(() => {
    const r = document.getElementById('cctv-range');
    r.value = '65';
    r.dispatchEvent(new Event('input', { bubbles: true }));
    r.value = '80';
    r.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const seen = await page.evaluate(() => window.__game.S.cctv && window.__game.S.cctv.seen);
  assert(seen >= 12000, `CCTV 15초 구간 시청량 부족: ${seen}`);
  await page.waitForSelector('.cctv-done:not([disabled])', { timeout: 5000 });
  await page.click('.cctv-done');
  await page.waitForFunction(() => window.__game.has('K-12'), null, { timeout: 5000 });

  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '그 남자가 애한테 뭐라고 하던가요?');
  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '…고맙습니다.');
  await page.waitForFunction(() => window.__game.flag('S06.done'), null, { timeout: 8000 });
  await page.waitForFunction(() => window.__game.S.mono === '준호.', null, { timeout: 5000 });
  await page.waitForFunction(() => window.__game.flag('RE.01'), null, { timeout: 10000 });

  st = await state(page);
  assert(st.know['K-12'], 'K-12 누락');
  assert(st.know['KX-09'], 'KX-09 누락');
  assert(st.flags['S06.cctvSeen'], 'CCTV 시청 플래그 누락');

  await page.waitForFunction(() => window.__game.flag('S06.numberOffered'), null, { timeout: 8000 });
  await openMessages(page, 'jihoon');
  await page.click('.compose .field.ready');
  await page.waitForSelector('.sheet [data-act="offerPick"]', { timeout: 5000 });
  await page.click('.sheet [data-act="offerPick"]');
  await page.waitForFunction(() => window.__game.has('KX-03'), null, { timeout: 5000 });

  st = await state(page);
  assert(st.know['K-06'], 'K-06 누락(최종)');
  assert(st.know['K-07'], 'K-07 누락(최종)');
  assert(st.know['K-08'], 'K-08 누락(최종)');
  assert(st.know['K-09'], 'K-09 누락(최종)');
  assert(st.know['K-10'], 'K-10 누락(최종)');
  assert(st.know['K-11'], 'K-11 누락(최종)');
  assert(st.know['K-12'], 'K-12 누락(최종)');
  assert(st.know['KX-01'], 'KX-01 누락(최종)');
  assert(st.know['KX-03'], 'KX-03 누락(최종)');
  assert(st.flags['F-01'], 'F-01 누락(최종)');

  await context.close();
}

async function doubtRun(browser) {
  const { context, page } = await openPage(browser);
  await page.evaluate(() => window.__game.jump('S04'));
  await page.waitForSelector('.scene .line', { timeout: 5000 });

  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '도현이한테 여자친구 있단 얘기는 못 들었는데요.');
  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '…');
  await advanceUntil(page, (s) => !!(s.dlg && s.dlg.waiting));
  await faceChoice(page, '도현이가 그런 말 할 애가 아닌데요.');
  await page.waitForFunction(() => window.__game.flag('S04.yujinDone'), null, { timeout: 8000 });

  let st = await state(page);
  assert(st.know['K-08'], '의심 경로 K-08 누락');
  assert(!st.flags['F-01'], '의심 선택만 했는데 F-01이 설정됨');
  assert((st.v.s4_doubt_count || 0) >= 2, `의심 카운트: ${st.v.s4_doubt_count}`);

  await page.evaluate(() => window.__game.jump('S07'));
  await page.waitForSelector('.home', { timeout: 5000 });
  st = await state(page);
  assert(st.session === 'S07', `S07 점프 세션: ${st.session}`);
  assert(st.place === 'home', 'S07 점프 장소가 집이 아님');
  assert(st.clock[0] === 14 && st.clock[1] === 0, 'S07 점프 시각이 14:00이 아님');
  assert(st.know['KX-03'], 'S07 점프 시 KX-03 누락');

  const home = await page.evaluate(() => {
    const status = document.querySelector('#status');
    const search = document.querySelector('.search');
    const cs = getComputedStyle(search);
    return {
      statusDisplay: getComputedStyle(status).display,
      statusText: status.innerText,
      searchText: search.innerText,
      whiteSpace: cs.whiteSpace,
      height: search.getBoundingClientRect().height,
    };
  });
  assert(home.statusDisplay === 'flex', 'S07 점프 후 상태바 누락');
  assert(home.statusText.includes('14:00'), `S07 상태바 시각: ${home.statusText}`);
  assert(home.searchText.trim() === '검색', `검색 필드 텍스트: ${home.searchText}`);
  assert(home.whiteSpace === 'nowrap', `검색 필드 줄바꿈 설정: ${home.whiteSpace}`);
  assert(home.height <= 34, `검색 필드 높이: ${home.height}`);

  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await mainRun(browser);
    console.log('P2 main S3-S6: PASS');
    await doubtRun(browser);
    console.log('P2 F-01 doubt case / jump: PASS');
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
