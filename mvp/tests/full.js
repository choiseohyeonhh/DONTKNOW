/* P6 — 네 가지 엔딩 전체 플레이 테스트.
   실제 UI 클릭/탭만 사용한다. window.__game은 상태 확인용으로만 읽는다.
   실행: NODE_PATH=$(npm root -g) node mvp/tests/full.js
   단일 루트만: ONLY=A node mvp/tests/full.js */
const assert = require('assert');
const { chromium } = require('playwright');

const BASE = 'file:///home/user/DONTKNOW/mvp/index.html?debug=1&speed=30';
const ONLY = String(process.env.ONLY || '').toUpperCase();
const errors = [];
const pages = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function openPage(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  pages.push(page);
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  await page.goto(BASE);
  await page.evaluate(() => {
    window.__sawTitle = false;
    const mo = new MutationObserver(() => {
      if (document.querySelector('#dk-ending .dk-title h1')) window.__sawTitle = true;
    });
    mo.observe(document.body, { childList: true, subtree: true });
  });
  return { context, page };
}

async function state(page) {
  return page.evaluate(() => {
    const S = window.__game.S;
    return {
      session: S.session,
      phase: S.phase,
      place: S.place,
      clock: [...S.clock],
      unlocked: S.unlocked,
      know: { ...S.know },
      flags: { ...S.flags },
      v: { ...S.v },
      dlg: S.dlg ? {
        id: S.dlg.id, channel: S.dlg.channel, waiting: !!S.dlg.waiting,
        awaitTap: !!S.dlg.awaitTap, line: S.dlg.line && S.dlg.line.text,
      } : null,
      ov: S.ov && S.ov.type,
      cctv: !!S.cctv,
      travel: !!S.travel,
      ending: S.v && S.v.ending,
    };
  });
}

async function waitFn(page, fn, arg, timeout = 20000) {
  await page.waitForFunction(fn, arg, { timeout, polling: 25 });
}

async function waitSession(page, id, timeout = 20000) {
  await page.waitForFunction((sid) => {
    const g = window.__game;
    return g.S.session === sid || g.S.sessionDone[sid] === true || g.flag(sid + '.done') || g.flag(sid + '.ended');
  }, id, { timeout, polling: 25 });
}

async function waitHome(page, timeout = 10000) {
  await page.waitForSelector('.home', { timeout });
}

async function bootToHome(page) {
  await page.click('[data-act="noticeOk"]');
  await page.click('[data-act="start"]');
  await page.waitForSelector('#cine.show', { timeout: 10000 });
  await page.click('#cine .skip');
  await page.waitForSelector('.lock', { timeout: 10000 });
  await page.click('.lock [data-act="unlock"]');
  await waitHome(page);
}

async function goHome(page) {
  const hi = page.locator('#homeind');
  if (await hi.isEnabled().catch(() => false)) {
    await hi.click().catch(() => {});
    await sleep(30);
  }
  for (let i = 0; i < 5 && !(await page.locator('.home').count()); i++) {
    const back = page.locator('.hdr .lft[data-act="back"], .scene-back');
    if (!(await back.count())) break;
    await back.first().click().catch(() => {});
    await sleep(30);
  }
  await page.waitForSelector('.home', { timeout: 5000 });
}

async function labelsNow(page) {
  return page.evaluate(() => {
    const g = window.__game;
    const d = g.S.dlg;
    if (!d || !d.waiting) return null;
    return {
      channel: d.channel,
      labels: g.visibleOpts(d.waiting).map((o) => g.labelText(o, d.channel)),
    };
  });
}

async function waitChoice(page, timeout = 20000) {
  await page.waitForFunction(() => {
    const g = window.__game;
    const d = g.S.dlg;
    return !!(d && d.waiting && g.visibleOpts(d.waiting).length);
  }, null, { timeout, polling: 25 });
}

async function pick(page, text, { exact = false } = {}) {
  await waitChoice(page);
  const info = await labelsNow(page);
  const i = info.labels.findIndex((s) => (exact ? s === text : s.includes(text)));
  assert(i >= 0, `선택지 없음: ${text}\n현재(${info.channel}): ${JSON.stringify(info.labels)}`);
  if (info.channel === 'call') {
    await page.locator('.call .ch .opt').nth(i).click();
  } else if (info.channel === 'sms') {
    if (!(await page.locator('.sheet .opt:visible').count())) {
      await page.locator('.compose .field.ready').click();
      await page.waitForSelector('.sheet .opt', { timeout: 5000 });
    }
    await page.locator('.sheet .opt:visible').nth(i).click();
  } else {
    await page.locator('.scene .choices button').nth(i).click();
  }
  await sleep(40);
}

async function advanceFace(page, pred, timeout = 25000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const s = await state(page);
    if (pred(s)) return s;
    if (s.dlg && s.dlg.awaitTap && !s.dlg.waiting) {
      const dlg = page.locator('.scene .dlg');
      if (await dlg.count()) await dlg.click({ timeout: 500 }).catch(() => {});
    }
    await sleep(25);
  }
  throw new Error('advanceFace timeout');
}

async function travelTo(page, place, sessionId) {
  await goHome(page);
  await page.click('[data-app="map"]');
  await page.waitForSelector(`[data-act="route"][data-place="${place}"]`, { timeout: 8000 });
  await page.click(`[data-act="route"][data-place="${place}"]`);
  await page.waitForSelector('.route-card', { timeout: 8000 });
  await page.click('[data-act="startnav"]');
  await page.waitForSelector('.travel[data-k="travel"], .scene, .cctv', { timeout: 10000 });
  if (sessionId) await waitSession(page, sessionId, 20000);
}

async function openJihoon(page) {
  await page.click('[data-app="msg"]');
  await page.waitForSelector('[data-act="thread"][data-id="jihoon"]', { timeout: 8000 });
  await page.click('[data-act="thread"][data-id="jihoon"]');
}

async function finishCineIfAny(page) {
  const skip = page.locator('#cine.show .skip');
  if (await skip.count()) await skip.click().catch(() => {});
}

async function s2ByCall(page) {
  await openJihoon(page);
  await waitFn(page, () => {
    const g = window.__game;
    return g.S.session === 'S02' && g.S.dlg && g.S.dlg.channel === 'sms';
  }, null, 20000);

  await pick(page, '그래 지훈아 무슨 일이냐');
  await pick(page, '(전화한다)', { exact: true });
  await waitFn(page, () => {
    const g = window.__game;
    return !!(g.S.dlg && g.S.dlg.channel === 'call' && g.S.call && g.S.call.state === 'talk');
  }, null, 10000);
  await pick(page, '전화 줘서 고맙다');
  await pick(page, '폰을 계속 봤다');
  await pick(page, '혹시 도현이 폰 비밀번호 아냐');
  await pick(page, '대학 친구들한테는 물어봤냐');
  await pick(page, '알았다. 늦었는데');

  await waitFn(page, () => !!window.__game.S.flags['S02.ended'], null, 15000);
  await page.waitForSelector('#cine.show', { timeout: 10000 });
  await page.click('#cine .skip');
  await page.waitForFunction(() => {
    const g = window.__game;
    return g.S.session === 'S03' && !g.S.unlocked && g.S.clock[0] === 8 && g.S.clock[1] === 40;
  }, null, { timeout: 10000, polling: 25 });
  await page.waitForSelector('.lock', { timeout: 5000 });
}

async function s3School(page) {
  await page.click('.lock [data-act="unlock"]');
  await waitHome(page);
  await page.click('[data-app="map"]');
  await page.waitForSelector('[data-act="route"][data-place="school"]', { timeout: 8000 });
  await page.click('[data-act="route"][data-place="school"]');
  await page.waitForSelector('.route-card', { timeout: 8000 });
  await page.click('[data-act="startnav"]');
  await waitSession(page, 'S03', 20000);

  await waitChoice(page);
  await pick(page, '제가요? 저는 그런 거 보낸 적 없는데요');
  await waitFn(page, () => !!window.__game.S.flags['S03.seoyeonSent'], null, 15000);
  await waitChoice(page);
  await pick(page, '상담실로 간다');
  await waitChoice(page);
  await pick(page, '도현이가 없어졌습니다. 나흘쨉니다');
  await waitFn(page, () => !!window.__game.S.flags['S03.ended'], null, 15000);
  await waitHome(page);
}

async function s4YujinDoubt(page) {
  await travelTo(page, 'home', 'S04');
  await waitChoice(page);
  await pick(page, '도현이한테 여자친구 있단 얘기는 못 들었는데요');
  await waitChoice(page);
  await pick(page, '학교 선생님 말로는');
  await waitChoice(page);
  await pick(page, '도현이가 그런 말 할 애가 아닌데요');
  await waitFn(page, () => !!window.__game.S.flags['S04.yujinDone'], null, 15000);

  await page.waitForSelector('.sheet [data-act="accept"]', { timeout: 15000 });
  await page.click('.sheet [data-act="accept"]');
  await waitChoice(page);
  await pick(page, '네, 지금 가겠습니다');
  await page.waitForSelector('.route-card', { timeout: 10000 });
  const txt = await page.locator('.route-card').innerText();
  assert(txt.includes('성원경찰서'), `경찰서 경로: ${txt}`);
  await page.click('[data-act="startnav"]');
  await waitSession(page, 'S05', 20000);
}

async function s5HubFinish(page) {
  await waitChoice(page);
  await pick(page, "'형'이라는");
  await waitChoice(page);
  await pick(page, '…알겠습니다. 수고하십시오');
  await waitFn(page, () => !!window.__game.S.flags['S05.done'], null, 15000);
  await page.waitForSelector('.route-card', { timeout: 10000 });
  const txt = await page.locator('.route-card').innerText();
  assert(txt.includes('하루마트 성원역점'), `마트 경로: ${txt}`);
  await page.click('[data-act="startnav"]');
  await waitSession(page, 'S06', 20000);
}

async function s6Mart(page) {
  await waitChoice(page);
  await pick(page, '그 애가 제 아들입니다');
  await page.waitForSelector('.cctv', { timeout: 10000 });
  await page.evaluate(() => {
    const r = document.getElementById('cctv-range');
    r.value = '65'; r.dispatchEvent(new Event('input', { bubbles: true }));
    r.value = '80'; r.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForSelector('.cctv-done:not([disabled])', { timeout: 8000 });
  await page.click('.cctv-done');
  await waitChoice(page);
  await pick(page, '그 남자가 애한테 뭐라고 하던가요');
  await waitChoice(page);
  await pick(page, '…고맙습니다');
  await waitFn(page, () => !!window.__game.S.flags['S06.done'], null, 15000);
  await waitFn(page, () => window.__game.has('KX-03'), null, 15000);
}

async function callJunhoOnce(page) {
  await goHome(page);
  await page.click('[data-app="contacts"]');
  await page.waitForSelector('[data-act="contact"][data-id="junho"]', { timeout: 8000 });
  await page.click('[data-act="contact"][data-id="junho"]');
  await page.waitForSelector('[data-act="dial"][data-num="010-XXXX-0315"]', { timeout: 8000 });
  await page.click('[data-act="dial"][data-num="010-XXXX-0315"]');
  await page.waitForSelector('.call [data-act="hangup"]', { timeout: 8000 });
}

async function s7Threat(page) {
  await callJunhoOnce(page);
  await sleep(350);
  await page.locator('.call [data-act="hangup"]').click();
  await sleep(80);

  await page.waitForSelector('[data-act="dial"][data-num="010-XXXX-0315"]', { timeout: 8000 });
  await page.click('[data-act="dial"][data-num="010-XXXX-0315"]');
  await waitFn(page, () => {
    const g = window.__game;
    return !!(g.S.dlg && g.S.dlg.id === 'S07.junho.sms' && g.S.dlg.waiting);
  }, null, 20000);
  await pick(page, '경찰에 신고했다');
  await waitFn(page, () => !!window.__game.S.flags['F-02'], null, 10000);

  await page.waitForSelector('.sheet [data-act="accept"]', { timeout: 20000 });
  await page.click('.sheet [data-act="accept"]');
  await waitChoice(page);
  await pick(page, '괜찮아. 말해 봐. 안 혼낸다');
  await waitFn(page, () => !!window.__game.S.flags['S07.ended'], null, 20000);
  await travelTo(page, 'home', 'S08');
}

async function s8OpenDoor(page) {
  await waitFn(page, () => !!window.__game.S.flags['S08.active'] || (window.__game.S.dlg && window.__game.S.dlg.id === 'S08.minjae'), null, 20000);
  await waitChoice(page);
  await pick(page, '문 연다');
  await waitChoice(page);
  await pick(page, '무슨 약? 무슨 소리야');
  await page.waitForSelector('.dk-receipt-close', { timeout: 20000 });
  await page.click('.dk-receipt-close');
  await waitFn(page, () => !!window.__game.S.flags['S08.done'], null, 15000);
}

async function goPoliceAfterS8(page) {
  const route = page.locator('.route-card');
  if (await route.count()) {
    const back = page.locator('.hdr .lft[data-act="back"]');
    if (await back.count()) await back.click().catch(() => {});
    await sleep(60);
  }
  await travelTo(page, 'police', null);
  await waitChoice(page);
  await pick(page, '형사님, 약 얘기가 나왔습니다');
  await waitChoice(page);
  await pick(page, '말하겠습니다');
  await waitChoice(page);
  await pick(page, '그래도 말하겠습니다');
  await waitFn(page, () => !!window.__game.S.flags['F-03'], null, 15000);
}

async function toPharmacy(page) {
  const route = page.locator('.route-card');
  if (await route.count()) {
    const back = page.locator('.hdr .lft[data-act="back"]');
    if (await back.count()) await back.click().catch(() => {});
    await sleep(60);
  }
  await travelTo(page, 'pharmacy', 'S09');
}

async function s9Photo(page) {
  await waitChoice(page);
  await pick(page, '(사진을 보여준다)');
  await page.waitForSelector('.dk-photopick', { timeout: 10000 });
  await page.locator('.dk-photopick .dk-pp-photo:has(img[src*="photo_father_son_2022"])').click();
  await page.waitForSelector('.dk-photopick', { state: 'detached', timeout: 8000 });
  await waitChoice(page);
  await pick(page, '…', { exact: true });
  await waitChoice(page);
  await pick(page, '그걸 다 보시고도, 왜 신고를 안 하셨습니까');
  await waitFn(page, () => !!window.__game.S.flags['S09.done'], null, 20000);
  await waitFn(page, () => window.__game.has('K-17'), null, 10000);
}

async function s9Pressure(page) {
  await waitChoice(page);
  await pick(page, '그럼 경찰서 가서 말씀하시겠습니까?');
  await waitChoice(page);
  await pick(page, '그럼 경찰서 가서 말씀하시겠습니까?');
  await waitFn(page, () => !!window.__game.S.flags['S09.done'], null, 20000);
  await waitFn(page, () => window.__game.has('KX-17a'), null, 10000);
  const s = await state(page);
  assert(!s.know['K-17'], '압박 경로에서 K-17이 획득됨');
}

async function s10EnvelopeAndPhone(page) {
  await waitSession(page, 'S10', 20000);
  await finishCineIfAny(page);
  await page.waitForSelector('[data-s10="open-envelope"]', { timeout: 15000 });
  await page.click('[data-s10="open-envelope"]');
  await page.waitForSelector('[data-s10="take-phone"]', { timeout: 8000 });
  await page.click('[data-s10="take-phone"]');
  await page.waitForSelector('#oldphone-layer.show [data-op="op-power"]', { timeout: 10000 });
  await page.click('#oldphone-layer [data-op="op-power"]');
  await page.waitForSelector('#oldphone-layer [data-op="op-charge"]', { timeout: 8000 });
  await page.click('#oldphone-layer [data-op="op-charge"]');
  await page.waitForSelector('#oldphone-layer .op-lock', { timeout: 12000 });
  for (const d of ['6', '8', '0', '4', '0', '3']) {
    await page.click(`#oldphone-layer [data-op="op-pin"][data-d="${d}"]`);
    await sleep(15);
  }
  await page.waitForSelector('#oldphone-layer .op-home', { timeout: 10000 });
  await page.click('#oldphone-layer .op-app[data-app="voice"]');
  await page.waitForSelector('#oldphone-layer [data-op="op-voice"]', { timeout: 8000 });
  await page.click('#oldphone-layer [data-op="op-voice"]');
  await page.waitForSelector('#oldphone-layer [data-op="op-vm-toggle"]', { timeout: 8000 });
  await page.click('#oldphone-layer [data-op="op-vm-toggle"]');
  await waitFn(page, () => window.__game.has('K-19'), null, 15000);

  await page.waitForSelector('#op-tabs [data-device="father"]', { timeout: 8000 });
  await page.click('#op-tabs [data-device="father"]');
  await page.click('[data-app="msg"]');
  await page.waitForSelector('[data-act="thread"][data-id="hangyeol"]', { timeout: 8000 });
  await page.click('[data-act="thread"][data-id="hangyeol"]');
  await waitFn(page, () => !!window.__game.S.flags['S11.active'], null, 15000);
}

async function opHome(page) {
  for (let i = 0; i < 6; i++) {
    if (await page.locator('#oldphone-layer .op-home').count()) return;
    const back = page.locator('#oldphone-layer [data-op="op-back"]');
    if (!(await back.count())) break;
    await back.first().click().catch(() => {});
    await sleep(25);
  }
}

async function s11Explore(page) {
  await page.waitForSelector('#op-tabs [data-device="old"]', { timeout: 8000 });
  await page.click('#op-tabs [data-device="old"]');
  await sleep(80);
  const homeBtn = page.locator('#oldphone-layer [data-op="op-home"]');
  if (await homeBtn.count()) await homeBtn.first().click().catch(() => {});
  await sleep(50);
  if (!(await page.locator('#oldphone-layer .op-home').count())) await opHome(page);
  await page.waitForSelector('#oldphone-layer .op-home', { timeout: 8000 });

  await page.click('#oldphone-layer .op-app[data-app="msg"]');
  for (const id of ['hyung', 'junho', 'yujin']) {
    await page.waitForSelector(`#oldphone-layer [data-op="op-thread"][data-id="${id}"]`, { timeout: 8000 });
    await page.click(`#oldphone-layer [data-op="op-thread"][data-id="${id}"]`);
    await sleep(40);
    await page.click('#oldphone-layer [data-op="op-back"]');
    await sleep(35);
  }
  await page.click('#oldphone-layer [data-op="op-home"]');
  await sleep(35);

  await page.click('#oldphone-layer .op-app[data-app="memo"]');
  for (const id of ['MM.o.remaining', 'MM.o.april_schedule']) {
    await page.waitForSelector(`#oldphone-layer [data-op="op-memo"][data-id="${id}"]`, { timeout: 8000 });
    await page.click(`#oldphone-layer [data-op="op-memo"][data-id="${id}"]`);
    await sleep(35);
    await page.click('#oldphone-layer [data-op="op-back"]');
    await sleep(35);
  }
  await page.click('#oldphone-layer [data-op="op-home"]');
  await sleep(35);

  await page.click('#oldphone-layer .op-app[data-app="photos"]');
  await page.waitForSelector('#oldphone-layer .op-thumb:has(img[src*="wall_sleeping_father"])', { timeout: 8000 });
  await page.click('#oldphone-layer .op-thumb:has(img[src*="wall_sleeping_father"])');
  await waitFn(page, () => window.__game.has('KX-18'), null, 8000);

  await page.click('#op-tabs [data-device="father"]');
  await sleep(80);
  await goHome(page);
  await page.click('[data-app="photos"]');
  await page.waitForSelector('#s11-layer.show [data-op="s11-photo"][data-id="PH.f.debt_adjustment"]', { timeout: 8000 });
  await page.click('#s11-layer [data-op="s11-photo"][data-id="PH.f.debt_adjustment"]');
  await waitFn(page, () => window.__game.has('KX-14'), null, 8000);
  await page.click('#s11-layer [data-op="s11-close"]');
  await sleep(60);

  await page.click('[data-app="camera"]');
  await page.waitForSelector('#s11-layer.show [data-op="s11-shutter"]', { timeout: 8000 });
  await page.click('#s11-layer [data-op="s11-shutter"]');
  await page.waitForSelector('#s11-layer [data-op="s11-wallpaper"]', { timeout: 8000 });
  await page.click('#s11-layer [data-op="s11-wallpaper"]');
  await waitFn(page, () => !!window.__game.S.flags['FX-07'], null, 8000);

  await waitFn(page, () => !!window.__game.S.flags['S11.allSeen'] || !!window.__game.S.flags['S11.exitScheduled'], null, 10000);
  await waitSession(page, 'S12', 20000);
}

async function s12Yujin(page, route) {
  await waitChoice(page);
  await pick(page, '너도… 거기서 나오고 싶었던 거 아니냐');
  if (route !== 'C') {
    await pick(page, '준호 얘기. 그거 다 거짓말이었지');
    await pick(page, '그 봉투, 네가 두고 간 거지');
  } else {
    await pick(page, '그 봉투, 네가 두고 간 거지');
    await pick(page, '도현이 지금 어디 있냐');
  }
  await waitFn(page, () => !!window.__game.S.flags['S12.yujinVerdict'], null, 15000);

  await page.waitForSelector('[data-s12="junho-call"]', { timeout: 20000 });
  await page.click('[data-s12="junho-call"]');

  if (route === 'B') {
    await waitFn(page, () => !!window.__game.S.flags['S12.b3'], null, 20000);
  } else {
    await waitFn(page, () => !!window.__game.S.flags['S12.b2'], null, 20000);
  }

  await page.waitForSelector('.sheet [data-act="accept"]', { timeout: 20000 });
  await page.click('.sheet [data-act="accept"]');
  await page.waitForSelector('[data-s12="depart"]', { timeout: 20000 });
  await page.click('[data-s12="depart"]');
  await waitSession(page, 'S13', 20000);
}

async function s13Choice(page, route) {
  await finishCineIfAny(page);
  await page.waitForSelector('.scene .dlg', { timeout: 15000 });
  await waitChoice(page);
  await pick(page, '…', { exact: true });
  await waitChoice(page);
  await pick(page, '…', { exact: true });
  await waitChoice(page);
  if (route === 'A') await pick(page, '그 빚, 내가 숨긴 거다');
  else if (route === 'B') await pick(page, '이미 경찰에 다 말했다');
  else if (route === 'C') await pick(page, '네가 내 아들한테 그 약 일 시킨 거지');
  else await pick(page, '…알겠다');
}

async function playEndingToEnd(page, expected) {
  await waitFn(page, (e) => window.__game.S.v && window.__game.S.v.ending === e, expected, 20000);
  await page.waitForSelector('#dk-ending.on', { timeout: 10000 });
  const deadline = Date.now() + 40000;
  while (Date.now() < deadline) {
    if (await page.locator('#dk-ending .dk-end').count()) break;
    const accept = page.locator('#dk-ending .dk-accept');
    if (await accept.count()) { await accept.click().catch(() => {}); await sleep(50); continue; }
    const send = page.locator('#dk-ending .dk-send');
    if (await send.count()) { await send.click().catch(() => {}); await sleep(60); continue; }
    const bplus = page.locator('#dk-ending .dk-bplus .dk-btn');
    if (await bplus.count()) { await bplus.click().catch(() => {}); await sleep(60); continue; }
    await page.locator('#dk-ending').click({ position: { x: 120, y: 300 } }).catch(() => {});
    await sleep(45);
  }
  await page.waitForSelector('#dk-ending .dk-end .logo', { timeout: 10000 });
  const sawTitle = await page.evaluate(() => !!window.__sawTitle);
  assert(sawTitle, '엔딩 타이틀 카드(DONTKNOW)가 표시되지 않음');
}

async function assertCommon(page) {
  const s = await state(page);
  assert(s.clock[0] >= 0, 'clock invalid');
  return s;
}

async function runA(browser) {
  const { context, page } = await openPage(browser);
  await bootToHome(page);
  await s2ByCall(page);
  await s3School(page);
  await s4YujinDoubt(page);
  await s5HubFinish(page);
  await s6Mart(page);
  await s7Threat(page);
  await s8OpenDoor(page);
  await toPharmacy(page);
  await s9Photo(page);
  await s10EnvelopeAndPhone(page);
  await s11Explore(page);
  await s12Yujin(page, 'A');
  await s13Choice(page, 'A');
  await playEndingToEnd(page, 'A');

  const s = await assertCommon(page);
  assert(s.know['K-17'], 'A: K-17 누락');
  assert(s.know['K-19'] && s.know['K-20'], 'A: K-19/K-20 누락');
  assert(s.know['K-21'] && s.know['K-22'] && s.know['KX-21'], 'A: 옛 폰 K 누락');
  assert(s.flags['F-02'] && !s.flags['F-02b'], 'A: F-02 분기 오류');
  assert(!s.flags['F-01'], 'A: F-01이 설정됨');
  assert(!s.flags['F-03'], 'A: F-03이 설정됨');
  assert(s.flags['FX-04'] && s.flags['FX-05'] && s.flags['FX-06'] && s.flags['FX-07'], 'A: FX 누락');
  assert(s.v.branchA === 'A-1', `A: branchA=${s.v.branchA}`);
  assert(s.v.branchB === 'B-2', `A: branchB=${s.v.branchB}`);
  assert(s.ending === 'A', `A: ending=${s.ending}`);
  await context.close();
}

async function runB(browser) {
  const { context, page } = await openPage(browser);
  await bootToHome(page);
  await s2ByCall(page);
  await s3School(page);
  await s4YujinDoubt(page);
  await s5HubFinish(page);
  await s6Mart(page);
  await s7Threat(page);
  await s8OpenDoor(page);
  await goPoliceAfterS8(page);
  await toPharmacy(page);
  await s9Photo(page);
  await s10EnvelopeAndPhone(page);
  await s11Explore(page);
  await s12Yujin(page, 'B');
  await s13Choice(page, 'B');
  await playEndingToEnd(page, 'B');

  const s = await assertCommon(page);
  assert(s.flags['F-02'] && s.flags['F-03'], 'B: F-02/F-03 분기 오류');
  assert(s.know['K-15'], 'B: K-15 누락');
  assert(s.know['K-17'], 'B: K-17 누락');
  assert(s.know['K-19'] && s.know['K-20'], 'B: K-19/K-20 누락');
  assert(s.v.branchB === 'B-3', `B: branchB=${s.v.branchB}`);
  assert(s.ending === 'B', `B: ending=${s.ending}`);
  assert(s.v.ending_variant === 'plus', `B: variant=${s.v.ending_variant}`);
  await context.close();
}

async function runC(browser) {
  const { context, page } = await openPage(browser);
  await bootToHome(page);
  await s2ByCall(page);
  await s3School(page);
  await s4YujinDoubt(page);
  await s5HubFinish(page);
  await s6Mart(page);
  await s7Threat(page);
  await s8OpenDoor(page);
  await toPharmacy(page);
  await s9Pressure(page);
  await s10EnvelopeAndPhone(page);
  await s11Explore(page);
  await s12Yujin(page, 'C');
  await s13Choice(page, 'C');
  await playEndingToEnd(page, 'C');

  const s = await assertCommon(page);
  assert(!s.know['K-17'], 'C: K-17이 획득됨');
  assert(s.know['KX-17a'], 'C: KX-17a 누락');
  assert(s.v.s13_choice === 4, `C: s13_choice=${s.v.s13_choice}`);
  assert(!s.flags['F-03'], 'C: F-03이 설정됨');
  assert(s.ending === 'C', `C: ending=${s.ending}`);
  await context.close();
}

async function runD(browser) {
  const { context, page } = await openPage(browser);
  await bootToHome(page);
  await s2ByCall(page);
  await s3School(page);
  await s4YujinDoubt(page);
  await s5HubFinish(page);
  await s6Mart(page);
  await s7Threat(page);
  await s8OpenDoor(page);
  await toPharmacy(page);
  await s9Photo(page);
  await s10EnvelopeAndPhone(page);
  await s11Explore(page);
  await s12Yujin(page, 'D');
  await s13Choice(page, 'D');
  await playEndingToEnd(page, 'D');

  const s = await assertCommon(page);
  assert(s.v.s13_choice === 2, `D: s13_choice=${s.v.s13_choice}`);
  assert(!s.flags['F-03'], 'D: F-03이 설정됨');
  assert(s.v.branchA === 'A-1', `D: branchA=${s.v.branchA}`);
  assert(s.ending === 'D', `D: ending=${s.ending}`);
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    if (!ONLY || ONLY === 'A') { await runA(browser); console.log('Ending A: PASS'); }
    if (!ONLY || ONLY === 'B') { await runB(browser); console.log('Ending B: PASS'); }
    if (!ONLY || ONLY === 'C') { await runC(browser); console.log('Ending C: PASS'); }
    if (!ONLY || ONLY === 'D') { await runD(browser); console.log('Ending D: PASS'); }
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
