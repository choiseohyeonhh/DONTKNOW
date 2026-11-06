/* 버그 회귀 테스트 (사람 플레이테스터 리포트 1~6)
   실행: NODE_PATH=$(npm root -g) node mvp/tests/bugs.js
   화면 조작은 실제 클릭을 사용하고, window.__game은 점프/상태 읽기/사전조건에만 쓴다. */
const assert = require('assert');
const path = require('path');
const { chromium } = require('playwright');

const URL = 'file://' + path.resolve(__dirname, '../index.html') + '?debug=1&speed=20';
const errors = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function openPage(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  await page.goto(URL);
  await page.evaluate(() => { const d = document.getElementById('debug'); if (d) d.style.display = 'none'; });
  return { context, page };
}

async function bootToHome(page) {
  await page.click('[data-act="noticeOk"]');
  await page.click('[data-act="start"]');
  await page.waitForSelector('#cine.show .skip', { timeout: 10000 });
  await page.click('#cine.show .skip');
  await page.waitForSelector('.lock', { timeout: 10000 });
  await page.click('.lock [data-act="unlock"]');
  await page.waitForSelector('.home', { timeout: 10000 });
}

async function goHome(page) {
  const hi = page.locator('#homeind');
  if (await hi.isEnabled().catch(() => false)) await hi.click().catch(() => {});
  await page.waitForSelector('.home', { timeout: 8000 });
}

async function waitFn(page, fn, arg, timeout = 15000) {
  await page.waitForFunction(fn, arg, { timeout, polling: 25 });
}

async function scenePick(page, text) {
  await waitFn(page, () => {
    const d = window.__game.S.dlg;
    return !!(d && d.waiting && window.__game.visibleOpts(d.waiting).length);
  });
  const idx = await page.evaluate((needle) => {
    const g = window.__game; const d = g.S.dlg;
    return g.visibleOpts(d.waiting).findIndex((o) => g.labelText(o, d.channel).includes(needle));
  }, text);
  assert(idx >= 0, `선택지 없음: ${text}`);
  await page.locator('.scene .choices button').nth(idx).click();
}

async function smsPick(page, text) {
  await waitFn(page, () => {
    const d = window.__game.S.dlg;
    return !!(d && d.waiting && window.__game.visibleOpts(d.waiting).length);
  });
  if (!(await page.locator('.sheet .opt:visible').count())) {
    await page.click('.compose .field.ready');
    await page.waitForSelector('.sheet .opt:visible', { timeout: 5000 });
  }
  const idx = await page.evaluate((needle) => {
    const g = window.__game; const d = g.S.dlg;
    return g.visibleOpts(d.waiting).findIndex((o) => g.labelText(o, d.channel).includes(needle));
  }, text);
  assert(idx >= 0, `문자 선택지 없음: ${text}`);
  await page.locator('.sheet .opt:visible').nth(idx).click();
}

async function contactsNames(page) {
  return page.evaluate(() => [...document.querySelectorAll('[data-act="contact"] .n')].map((e) => e.textContent));
}

async function openContacts(page) {
  await goHome(page);
  await page.click('[data-app="contacts"]');
  await page.waitForSelector('[data-act="contact"]', { timeout: 8000 });
}

async function openMessages(page) {
  await goHome(page);
  await page.click('[data-app="msg"]');
  await page.waitForSelector('[data-act="thread"]', { timeout: 8000 });
}

async function testBug1(browser) {
  const { context, page } = await openPage(browser);
  await bootToHome(page);
  // 톡 친구/채팅 상태를 만들기 위한 사전 데이터(친구 추가 + 수신 메시지)
  await page.evaluate(() => {
    const g = window.__game;
    g.addTalkContact({ id: 'seoyeon', name: '한서연' });
    g.addTalkContact({ id: 'guard', name: '성원아파트 경비실' });
    g.addTalkMsg('seoyeon', g.nowMsg('them', '쉬는 시간마다 그거 보고 있었어요'), { banner: false });
    g.addTalkMsg('guard', g.nowMsg('them', '[경비실] 이상철 님, 손님 한 분이…'), { banner: false });
  });
  await page.click('[data-app="talk"]');
  await page.waitForSelector('.talk-profile', { timeout: 8000 });

  const friends = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.talk-friend')];
    return {
      listClass: !!document.querySelector('.scroll.list'),
      rows: rows.length,
      avatars: rows.filter((r) => r.querySelector('.av2')).length,
      previews: rows.map((r) => (r.querySelector('.p') || {}).textContent || ''),
      unread: document.querySelectorAll('.talk-friend .unread').length,
    };
  });
  assert(friends.listClass, '친구 탭 스크롤에 list 클래스가 없어 행 스타일이 적용되지 않음');
  assert(friends.rows >= 4, `친구 행 수: ${friends.rows}`);
  assert(friends.avatars === friends.rows, '친구 행에 아바타가 없는 항목이 있음');
  assert(friends.unread === 0, '친구 탭에 채팅 미읽 배지가 노출됨');
  for (const p of friends.previews) {
    assert(!p.includes('쉬는 시간마다') && !p.includes('[경비실]') && p.trim() !== '1', `친구 탭에 채팅 미리보기 노출: ${p}`);
  }

  await page.click('[data-act="talktab"][data-tab="chats"]');
  await page.waitForSelector('[data-act="talkopen"][data-id="seoyeon"]', { timeout: 8000 });
  const chats = await page.evaluate(() => {
    const row = document.querySelector('[data-act="talkopen"][data-id="seoyeon"]');
    return { preview: (row.querySelector('.p') || {}).textContent || '', unread: !!row.querySelector('.unread') };
  });
  assert(chats.preview.includes('쉬는 시간마다'), `채팅 탭 미리보기 누락: ${chats.preview}`);
  assert(chats.unread, '채팅 탭 미읽 배지 누락');
  await page.screenshot({ path: '/tmp/fix_1.png' });
  await context.close();
  console.log('bug1: PASS');
}

async function testBug2(browser) {
  const { context, page } = await openPage(browser);
  await bootToHome(page);
  await openContacts(page);
  const initial = await contactsNames(page);
  assert(initial.includes('103호'), `S01 초기 연락처에 103호(이웃 어머니)가 없음: ${JSON.stringify(initial)}`);
  assert(!initial.includes('준호'), `S01 초기 연락처에 준호가 미리 저장됨: ${JSON.stringify(initial)}`);
  assert(initial.includes('성원경찰서 김태윤'), `S01 초기 연락처에 김태윤 경위 누락: ${JSON.stringify(initial)}`);

  await page.evaluate(() => { window.__game.jump('S07'); });
  await openContacts(page);
  const s7 = await contactsNames(page);
  assert(s7.includes('준호'), `KX-03(S07) 이후 준호 연락처 누락: ${JSON.stringify(s7)}`);
  assert(s7.includes('103호'), '103호(준호 어머니) 연락처가 사라짐');
  await page.click('[data-act="contact"][data-id="junho"]');
  await page.waitForSelector('[data-act="dial"][data-num="010-XXXX-0315"]', { timeout: 8000 });
  await page.screenshot({ path: '/tmp/fix_2.png' });
  await context.close();
  console.log('bug2: PASS');
}

async function testBug3(browser) {
  const { context, page } = await openPage(browser);
  await bootToHome(page);
  await page.evaluate(() => { const g = window.__game; g.jump('S07'); g.setFlag('S06.done'); });
  await openContacts(page);
  await page.click('[data-act="contact"][data-id="junho"]');
  await page.waitForSelector('[data-act="dial"][data-num="010-XXXX-0315"]', { timeout: 8000 });
  await page.click('[data-act="dial"][data-num="010-XXXX-0315"]');
  await page.waitForSelector('.call [data-act="hangup"]', { timeout: 8000 });
  await page.click('.call [data-act="hangup"]');
  await sleep(100);
  await page.click('[data-act="dial"][data-num="010-XXXX-0315"]');
  await waitFn(page, () => {
    const g = window.__game; const d = g.S.dlg;
    return !!(d && d.id === 'S07.junho.sms' && d.waiting);
  }, null, 15000);
  await smsPick(page, '약속할게');

  await goHome(page);
  const before = await page.evaluate(() => ({ stack: window.__game.S.stack.map((x) => x.app + ':' + x.id), banner: window.__game.S.banner }));
  assert(before.stack.length === 0, `준호 문자 수신 전에 메시지 앱으로 강제 전환됨: ${JSON.stringify(before.stack)}`);

  await waitFn(page, () => !!(window.__game.S.banner && window.__game.S.banner.id === 'junho'), null, 10000);
  const b = await page.evaluate(() => ({
    stack: window.__game.S.stack.map((x) => x.app + ':' + x.id),
    title: window.__game.S.banner.title,
    body: window.__game.S.banner.body,
  }));
  assert(b.stack.length === 0, `준호 문자 도착 시 강제 전환됨: ${JSON.stringify(b.stack)}`);
  assert(b.title === '준호', `배너 발신자 표시: ${b.title}`);
  assert(b.body.includes('아저씨'), `배너 본문: ${b.body}`);

  // 배너를 실제로 탭해 스레드 열기 (디버그 배속에서 배너 수명이 짧아 DOM 클릭으로 고정)
  await page.evaluate(() => { const el = document.querySelector('[data-act="bannerTap"]'); if (el) el.click(); });
  await waitFn(page, () => {
    const g = window.__game; const top = g.S.stack[g.S.stack.length - 1];
    return !!(top && top.app === 'msg' && top.id === 'junho');
  }, null, 8000);
  const title = await page.locator('.hdr h1').innerText();
  assert(title === '준호', `준호 스레드 제목: ${title}`);
  await page.screenshot({ path: '/tmp/fix_3.png' });
  await context.close();
  console.log('bug3: PASS');
}

async function testBug4(browser) {
  const { context, page } = await openPage(browser);
  await bootToHome(page);
  await page.evaluate(() => {
    const g = window.__game;
    g.jump('S07');
    g.addMsg('junho', g.nowMsg('them', '아저씨 저 진짜몰라요'), { banner: false });
    g.addMsg('junho_mom', g.nowMsg('them', '도현이 아버지…'), { banner: false });
  });
  await openMessages(page);
  const rows = await page.evaluate(() => {
    const out = {};
    for (const id of ['junho', 'junho_mom']) {
      const row = document.querySelector(`[data-act="thread"][data-id="${id}"]`);
      out[id] = row ? row.querySelector('.n').textContent : null;
    }
    return out;
  });
  assert(rows.junho === '준호', `준호 스레드 목록 이름: ${rows.junho}`);
  assert(rows.junho_mom === '103호', `103호 스레드 목록 이름: ${rows.junho_mom}`);

  await page.click('[data-act="thread"][data-id="junho"]');
  let title = await page.locator('.hdr h1').innerText();
  assert(title === '준호', `준호 스레드 헤더가 raw id: ${title}`);
  await page.click('.hdr .lft[data-act="back"]');
  await page.waitForSelector('[data-act="thread"][data-id="junho_mom"]', { timeout: 8000 });
  await page.click('[data-act="thread"][data-id="junho_mom"]');
  title = await page.locator('.hdr h1').innerText();
  assert(title === '103호', `103호 스레드 헤더가 raw id: ${title}`);
  await page.screenshot({ path: '/tmp/fix_4.png' });
  await context.close();
  console.log('bug4: PASS');
}

async function testBug5(browser) {
  const { context, page } = await openPage(browser);
  await bootToHome(page);
  await page.click('[data-app="phone"]');
  await page.click('[data-act="tab"][data-tab="keypad"]');
  await page.waitForSelector('.dial .callkey', { timeout: 8000 });
  const geom = await page.evaluate(() => {
    const scr = document.querySelector('#screen').getBoundingClientRect();
    const btn = document.querySelector('.dial .callkey').getBoundingClientRect();
    const zero = [...document.querySelectorAll('.dial button')].find((b) => b.dataset.k === '0').getBoundingClientRect();
    const hdr = document.querySelector('.hdr').getBoundingClientRect();
    return {
      scr: { x: scr.x, y: scr.y, w: scr.width, h: scr.height },
      btn: { x: btn.x, y: btn.y, w: btn.width, h: btn.height },
      zero: { x: zero.x, y: zero.y, w: zero.width, h: zero.height },
      hdrBottom: hdr.bottom,
    };
  });
  assert(Math.abs((geom.btn.x + geom.btn.w / 2) - (geom.scr.x + geom.scr.w / 2)) < 3, `통화 버튼이 가로 중앙이 아님: ${JSON.stringify(geom)}`);
  assert(geom.btn.y > geom.zero.y, `통화 버튼이 0 키 아래가 아님: ${JSON.stringify(geom)}`);
  assert(geom.btn.y > geom.hdrBottom, '통화 버튼이 헤더 뒤에 겹침');
  assert(geom.btn.y + geom.btn.h < geom.scr.y + geom.scr.h, '통화 버튼이 화면 밖으로 나감');
  await page.screenshot({ path: '/tmp/fix_5.png' });
  await context.close();
  console.log('bug5: PASS');
}

async function testBug6(browser) {
  const { context, page } = await openPage(browser);
  await bootToHome(page);

  // 정답 사진
  await page.evaluate(() => { window.__game.jump('S09'); });
  await waitFn(page, () => {
    const d = window.__game.S.dlg;
    return !!(d && d.waiting && window.__game.visibleOpts(d.waiting).length);
  });
  await scenePick(page, '사진을 보여준다');
  await page.waitForSelector('.dk-photopick', { timeout: 5000 });
  await page.click('.dk-photopick [data-pi="1"]');
  await waitFn(page, () => !document.querySelector('.dk-photopick') && window.__game.S.flags['FX-05'], null, 5000);
  const correct = await page.evaluate(() => ({
    line: window.__game.S.dlg && window.__game.S.dlg.line && window.__game.S.dlg.line.text,
    path: window.__game.S.v.s9_path,
  }));
  assert(correct.path === 'photo', `사진 경로 플래그: ${correct.path}`);
  assert(correct.line && correct.line.includes('작년 봄부터'), `정답 사진 후 대사: ${correct.line}`);

  // 다른 사진 → 안내 후 재시도 가능
  await page.evaluate(() => { window.__game.jump('S09'); });
  await waitFn(page, () => {
    const d = window.__game.S.dlg;
    return !!(d && d.waiting && window.__game.visibleOpts(d.waiting).length);
  });
  await scenePick(page, '사진을 보여준다');
  await page.waitForSelector('.dk-photopick', { timeout: 5000 });
  await page.click('.dk-photopick [data-pi="0"]');
  await waitFn(page, () => {
    const d = window.__game.S.dlg;
    return !!(d && d.line && d.line.text.includes('이건 뭐예요'));
  }, null, 5000);
  await waitFn(page, () => {
    const d = window.__game.S.dlg;
    return !!(d && d.waiting && window.__game.visibleOpts(d.waiting).some((o) => window.__game.labelText(o, d.channel).includes('사진을 보여준다')));
  }, null, 5000);

  // 취소 → 선택지 복귀
  await page.evaluate(() => { window.__game.jump('S09'); });
  await waitFn(page, () => {
    const d = window.__game.S.dlg;
    return !!(d && d.waiting && window.__game.visibleOpts(d.waiting).length);
  });
  await scenePick(page, '사진을 보여준다');
  await page.waitForSelector('.dk-photopick', { timeout: 5000 });
  await page.click('.dk-photopick [data-cancel]');
  await waitFn(page, () => {
    const d = window.__game.S.dlg;
    return !document.querySelector('.dk-photopick') && !!(d && d.waiting && window.__game.visibleOpts(d.waiting).some((o) => window.__game.labelText(o, d.channel).includes('사진을 보여준다')));
  }, null, 5000);

  const status = await page.evaluate(() => {
    const el = document.querySelector('#status');
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { display: cs.display, color: cs.color, top: r.top, height: r.height };
  });
  assert(status.display === 'flex', `대면 장면 상태바 숨김: ${JSON.stringify(status)}`);
  assert(status.color === 'rgb(255, 255, 255)', `대면 장면 상태바 색상: ${status.color}`);
  assert(status.top === 0 && status.height > 40, `대면 장면 상태바 위치/높이: ${JSON.stringify(status)}`);
  await page.screenshot({ path: '/tmp/fix_6.png' });

  // S10 봉투 화면 상태바
  await page.evaluate(() => { const g = window.__game; g.addMsg('junho', g.nowMsg('them', 'x'), { banner: false }); g.jump('S10'); });
  const skip = await page.locator('#cine.show .skip').count();
  if (skip) await page.click('#cine.show .skip');
  await page.waitForSelector('#s10-layer', { state: 'visible', timeout: 10000 });
  await page.waitForFunction(() => {
    const el = document.querySelector('#s10-layer');
    return el && getComputedStyle(el).display !== 'none';
  }, null, { timeout: 10000 });
  const s10 = await page.evaluate(() => {
    const st = document.querySelector('#status');
    const cs = getComputedStyle(st);
    const layer = document.querySelector('#s10-layer');
    return {
      display: cs.display,
      color: cs.color,
      z: Number(cs.zIndex),
      layerZ: Number(getComputedStyle(layer).zIndex),
      body: document.body.className,
      text: st.innerText,
    };
  });
  assert(s10.display === 'flex', `S10 봉투 상태바 숨김: ${JSON.stringify(s10)}`);
  assert(s10.color === 'rgb(255, 255, 255)', `S10 봉투 상태바 색상: ${s10.color}`);
  assert(s10.z > s10.layerZ, `S10 봉투 레이어가 상태바를 가림: ${JSON.stringify(s10)}`);
  assert(s10.text.includes('19:10'), `S10 상태바 시각: ${s10.text}`);
  await page.screenshot({ path: '/tmp/fix_s10.png' });
  await context.close();
  console.log('bug6: PASS');
}

(async () => {
  const browser = await chromium.launch();
  try {
    await testBug1(browser);
    await testBug2(browser);
    await testBug3(browser);
    await testBug4(browser);
    await testBug5(browser);
    await testBug6(browser);
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
