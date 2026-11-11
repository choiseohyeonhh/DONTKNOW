/* stage 6: UI만으로 시작→모든 엔딩까지 한 판씩. (게임 사실은 DK.set 금지, DK.advance는 대기 단축만)
 * 실행: python3 game/tools/build.py && node game/tests/playthrough.test.js
 * 스크린샷: game/tests/shots/<run>/NN-name.png (deviceScaleFactor 1) */
const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const DIST = 'file://' + path.join(ROOT, 'dist', 'dontknow.html');
const SHOTS = path.join(__dirname, 'shots');
const results = [];
let failed = 0;

function ok(name, cond, extra) {
  if (cond) results.push('  ✓ ' + name);
  else { failed++; results.push('  ✗ ' + name + (extra ? ' — ' + extra : '')); }
}

async function run(name, fn) {
  const line = '\n[' + name + ']';
  results.push(line);
  try { await fn(); }
  catch (e) { failed++; results.push('  ✗ 실행 실패 — ' + e.message); }
}

function mkShot(runId, page) {
  const dir = path.join(SHOTS, runId);
  fs.mkdirSync(dir, { recursive: true });
  let n = 0;
  return async (label) => {
    n++;
    const file = path.join(dir, String(n).padStart(2, '0') + '-' + label + '.png');
    await page.screenshot({ path: file });
    return file;
  };
}

async function newRun(browser, runId, opts) {
  opts = opts || {};
  const device = opts.desktop ? { viewport: { width: 1280, height: 900 }, hasTouch: true } : { ...devices['iPhone 13'], deviceScaleFactor: 1 };
  const ctx = await browser.newContext(device);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  await page.goto(DIST + '?new');
  await page.waitForFunction(() => window.LM && window.LM.G && window.LM.read && window.LM.final);
  const R = {
    ctx, page, errors,
    shot: mkShot(runId, page),
    screen: () => page.locator('.appwin .scr:not(.covered)').last(),
    vis(sel) { return sel ? this.screen().locator(sel) : this.screen(); },
    async advance(min) { await page.evaluate((m) => DK.advance(m), min); await page.waitForTimeout(450); },
    async home() { await page.locator('.home-ind').click(); await page.waitForTimeout(320); },
    async openApp(id) {
      await page.locator('.app[data-app="' + id + '"]').click();
      await page.waitForSelector('.appwin[data-app="' + id + '"]');
      await page.waitForTimeout(320);
    },
    async unlock() {
      await page.waitForSelector('.cine-prologue');
      for (let i = 0; i < 3; i++) { await page.locator('.cine-next').click(); await page.waitForTimeout(230); }
      await page.waitForSelector('.lock-hint');
      await page.locator('.lock-hint').click();
      await page.waitForSelector('.passcode');
      await page.locator('.passcode button', { hasText: '응급' }).click();
      await page.waitForSelector('.sheet-wrap');
      const medical = await page.locator('.sheet-wrap').innerText();
      ok('응급정보에 생년월일 2007.09.21', medical.includes('2007년 9월 21일'), medical.slice(0, 100));
      await page.locator('.sheet-wrap button', { hasText: '완료' }).click();
      for (const d of '070921') { await page.locator('.pc-key[aria-label="' + d + '"]').click(); await page.waitForTimeout(35); }
      await page.waitForTimeout(550);
      ok('070921로 잠금 해제', (await page.evaluate(() => !LM.state.locked)) === true);
    },
    async contactsBirthday() {
      await R.openApp('cont');
      await R.vis('input[type="search"]').fill('아빠');
      await R.page.waitForTimeout(250);
      await R.vis('.row').filter({ hasText: '아빠' }).first().click();
      await R.page.waitForTimeout(250);
      const text = await R.vis(null).innerText();
      ok('연락처 아빠 생일 1968.04.03', text.includes('1968년 4월 3일'), text.slice(0, 120));
      await R.home();
    },
    async unlockNote() {
      await R.openApp('note');
      await R.vis('.row').filter({ hasText: '잠긴 메모' }).first().click();
      await R.page.waitForTimeout(250);
      await R.vis('.row').filter({ hasText: '아빠한테' }).first().click();
      await R.page.waitForSelector('.nt-key');
      for (const d of '680403') { await R.page.locator('.nt-key[aria-label="' + d + '"]').click(); await R.page.waitForTimeout(30); }
      await R.page.waitForTimeout(450);
      ok('메모 암호 680403', (await page.evaluate(() => !!(LM.G.world && LM.G.world.noteUnlocked))) === true);
      await R.home();
    },
    async wifiOn() {
      await R.openApp('set');
      await R.vis('.row').filter({ hasText: 'Wi-Fi' }).first().click();
      await R.page.waitForTimeout(280);
      await R.vis('.row').filter({ hasText: 'Wi-Fi' }).locator('.sw').first().click();
      await R.advance(1);
      ok('Wi-Fi 켜짐 · 온라인', (await page.evaluate(() => LM.online())) === true);
      await R.home();
    },
    async readDadRoom() {
      await R.openApp('talk');
      await R.vis('.row').filter({ hasText: '아빠' }).first().click();
      await R.page.waitForTimeout(500);
      ok('아빠 톡 6통의 1이 읽으면 사라진다', (await page.evaluate(() => LM.read.unreadCount('talk', 'dad'))) === 0);
      await R.home();
    },
    async dh3() {
      await R.openApp('msg');
      await R.vis('.row').filter({ hasText: '도현의 슬레이트' }).first().click();
      await R.page.waitForTimeout(350);
      await R.vis('.cmp-sugg-chip').filter({ hasText: '아빠다' }).click();
      await R.vis('.cmp-send').click();
      await R.page.waitForTimeout(350);
      await R.advance(10);
      await R.home();
      await R.openApp('cam');
      await R.vis('.cam-dot[aria-label="서랍 구도"]').click();
      await R.page.waitForTimeout(180);
      await R.vis('.cam-drawer-front').click();
      await R.page.waitForTimeout(180);
      await R.vis('.cam-shutter').click();
      await R.page.waitForTimeout(350);
      await R.home();
      await R.openApp('msg');
      await R.vis('.row').filter({ hasText: '도현의 슬레이트' }).first().click();
      await R.page.waitForTimeout(350);
      await R.vis('.cmp-plus').click();
      await R.page.waitForTimeout(220);
      await R.page.locator('.as-btn', { hasText: '사진' }).first().click();
      await R.page.waitForSelector('.sheet-wrap .ph-cell[aria-label="서랍 봉투 박미선님 65"]');
      await R.page.locator('.sheet-wrap .ph-cell[aria-label="서랍 봉투 박미선님 65"]').click();
      await R.page.waitForTimeout(250);
      await R.vis('.cmp-send').click();
      await R.page.waitForTimeout(350);
      await R.advance(10);
      ok('서랍 사진 전송 → DH-3', (await page.evaluate(() => Number(LM.G.npc.DH))) === 3, String(await page.evaluate(() => LM.G.npc.DH)));
      await R.home();
    },
    async shareHankyul() {
      await R.openApp('bank');
      for (const d of '110221') { await R.vis('.b-key[aria-label="' + d + '"]').click(); await R.page.waitForTimeout(35); }
      await R.advance(1);
      await R.vis('.row').filter({ hasText: '거래내역' }).first().click();
      await R.page.waitForTimeout(350);
      await R.vis('.row').filter({ hasText: '한결캐피탈' }).first().click();
      await R.page.waitForTimeout(350);
      ok('거래 상세에 채무자 이상철', (await R.vis(null).innerText()).includes('채무자 이상철'));
      await R.vis('.nb-btn[aria-label="공유"]').click();
      await R.page.waitForSelector('.share-recent');
      await R.page.locator('.share-recent .share-t[aria-label="도현의 슬레이트"]').click();
      await R.page.waitForSelector('.sheet-wrap .cmp-send');
      await R.page.locator('.sheet-wrap .cmp-send').click();
      await R.page.waitForTimeout(450);
      ok('한결 이체 공유 → V-13 빚 고백', (await page.evaluate(() => LM.flag('CONFESS'))) === true);
      await R.home();
    },
    async mailName() {
      await R.openApp('mail');
      await R.vis('.nb-btn[aria-label="새 메일"]').click();
      await R.page.waitForSelector('.sheet-wrap input[aria-label="받는 사람"]');
      await R.page.locator('.sheet-wrap input[aria-label="받는 사람"]').fill('taeyun.kim@sw.police.kr');
      await R.page.locator('.sheet-wrap input[aria-label="제목"]').fill('아들 아버지입니다');
      await R.page.locator('.sheet-wrap textarea[aria-label="본문"]').fill('강민석입니다. 아들 계좌 관련해 연락드립니다.');
      await R.page.locator('.sheet-wrap .sh-btn.strong').click();
      await R.page.waitForTimeout(500);
      ok('김태윤에게 강민석 → V-11', (await page.evaluate(() => LM.flag('NAME_SENT'))) === true);
      await R.home();
    },
    async findHaedam() {
      await R.openApp('set');
      await R.vis('.row').filter({ hasText: '키보드' }).first().click();
      await R.page.waitForTimeout(300);
      ok('키보드 대치에 해담고시텔 207호', (await R.vis(null).innerText()).includes('해담고시텔'));
      await R.home();
      await R.openApp('hankki');
      await R.vis('.row').filter({ hasText: '해담고시텔' }).first().click();
      await R.page.waitForTimeout(350);
      ok('한끼 배송지 해담고시텔 207호', (await R.vis(null).innerText()).includes('해담고시텔 207호'));
      await R.home();
    },
    async taxi(dest, room) {
      await R.openApp('taxi');
      await R.vis('.row').filter({ hasText: '도착지 입력' }).click();
      await R.page.waitForTimeout(280);
      await R.vis('input[type="search"]').fill(dest);
      await R.page.waitForTimeout(300);
      await R.vis('.row').filter({ hasText: dest }).first().click();
      await R.page.waitForTimeout(220);
      await R.vis('.btn.filled').filter({ hasText: '호출' }).click();
      await R.page.waitForSelector('.sh-btn.strong');
      await R.page.locator('.sh-btn.strong', { hasText: '호출' }).click();
      await R.page.waitForSelector('.final-scene');
      if (room) {
        await R.page.locator('.final-input').fill(room);
        await R.page.locator('.final-send').click();
        await R.page.waitForTimeout(1000);
        ok('호실 207 입력 → F-LOC exact', (await page.evaluate(() => LM.flag('LOC'))) === 'exact', String(await page.evaluate(() => LM.flag('LOC'))));
      }
    },
    async finish(kind) {
      await R.page.locator('.final-end').click();
      await R.page.waitForSelector('.cine-ending');
      await R.page.waitForTimeout(300);
      const got = await page.evaluate(() => LM.G.ending && LM.G.ending.kind);
      ok('엔딩 ' + kind, got === kind, String(got));
      return got;
    },
    async replay(kind) {
      const captions = { A: 2, 'A′': 2, B: 2, C: 2, D: 1 }[kind] || 2;
      for (let i = 0; i < captions + 2; i++) {
        await page.locator('.end-advance').click();
        await page.waitForTimeout(220);
      }
      await page.waitForSelector('.end-replay');
    },
  };
  return R;
}

(async () => {
  const browser = await chromium.launch();

  await run('(a) 엔딩 A — iPhone 13, UI만으로 처음부터', async () => {
    const R = await newRun(browser, 'a-ending-A', { desktop: false });
    const t0 = Date.now();
    const startMs = await R.page.evaluate(() => LM.G.gameMs);
    await R.unlock();
    await R.shot('unlock');
    await R.contactsBirthday();
    await R.unlockNote();
    await R.shot('note-unlocked');
    await R.wifiOn();
    await R.shot('online');
    await R.readDadRoom();
    await R.shot('dad-room');
    await R.dh3();
    await R.shot('dh3');
    await R.shareHankyul();
    await R.shot('share-hankyul');
    await R.mailName();
    await R.shot('mail-name');
    await R.findHaedam();
    await R.shot('haedam-clue');
    await R.taxi('해담고시텔', '207');
    await R.shot('final-scene');
    await R.finish('A');
    await R.shot('ending');
    const endMs = await R.page.evaluate(() => LM.G.gameMs);
    const gameMin = Math.round((endMs - startMs) / 60000);
    const realSec = Math.round((endMs - startMs) / 4 / 1000);
    results.push('  · 게임 시각 ' + gameMin + '분 진행 · 시간 건너뛰기 없이 환산하면 약 ' + Math.floor(realSec / 60) + '분 ' + (realSec % 60) + '초 (실측 ' + Math.round((Date.now() - t0) / 1000) + '초)');
    await R.replay('A');
    await R.shot('replay');
    ok('끝까지 콘솔·페이지 오류 0', R.errors.length === 0, R.errors.join(' / '));
    await R.ctx.close();
  });

  await run('(b) 엔딩 A′ — 같은 경로, V-13 없음', async () => {
    const R = await newRun(browser, 'b-ending-A-prime', { desktop: true });
    await R.unlock();
    await R.wifiOn();
    await R.dh3();
    await R.mailName();
    await R.findHaedam();
    await R.taxi('해담고시텔', '207');
    ok('빚 고백 없음', (await R.page.evaluate(() => LM.flag('CONFESS'))) === false);
    await R.shot('final-scene');
    await R.finish('A′');
    await R.shot('ending');
    await R.replay('A′');
    await R.shot('replay');
    ok('끝까지 콘솔·페이지 오류 0', R.errors.length === 0, R.errors.join(' / '));
    await R.ctx.close();
  });

  await run('(c) 엔딩 C — 택시 청운고시원', async () => {
    const R = await newRun(browser, 'c-ending-C', { desktop: true });
    await R.unlock();
    await R.wifiOn();
    await R.taxi('청운고시원', null);
    await R.shot('final-scene');
    await R.finish('C');
    await R.shot('ending');
    await R.replay('C');
    await R.shot('replay');
    ok('끝까지 콘솔·페이지 오류 0', R.errors.length === 0, R.errors.join(' / '));
    await R.ctx.close();
  });

  await run('(d) 엔딩 D — 온라인 뒤 무응답 → 초기 설정 → 엔딩', async () => {
    const R = await newRun(browser, 'd-ending-D-wipe', { desktop: true });
    await R.unlock();
    await R.wifiOn();
    await R.advance(67);
    await R.page.waitForSelector('.wipe-setup');
    ok('원격 지우기 → LUMA 초기 설정 화면', (await R.page.locator('.wipe-setup').innerText()).includes('안녕하세요'));
    await R.shot('wipe-setup');
    await R.advance(1);
    await R.page.waitForSelector('.cine-ending');
    await R.page.waitForTimeout(300);
    ok('엔딩 D', (await R.page.evaluate(() => LM.G.ending && LM.G.ending.kind)) === 'D', String(await R.page.evaluate(() => LM.G.ending && LM.G.ending.kind)));
    await R.shot('ending');
    await R.replay('D');
    await R.shot('replay');
    ok('끝까지 콘솔·페이지 오류 0', R.errors.length === 0, R.errors.join(' / '));
    await R.ctx.close();
  });

  await run('(e) 엔딩 D — 블링크 실장K에게 "해담" 유출 뒤 택시', async () => {
    const R = await newRun(browser, 'e-ending-D-leak', { desktop: true });
    await R.unlock();
    await R.wifiOn();
    await R.page.locator('.app[data-folder="유틸"]').click();
    await R.page.waitForSelector('.folder-open');
    await R.page.locator('.folder-open .app[data-app="blink"]').click();
    await R.page.waitForSelector('.appwin[data-app="blink"]');
    await R.page.waitForTimeout(300);
    await R.vis('.row').filter({ hasText: '실장K' }).first().click();
    await R.page.waitForTimeout(250);
    await R.page.locator('.as-btn', { hasText: '열기' }).click();
    await R.page.waitForSelector('.appwin[data-app="blink"] .cmp-input');
    await R.vis('.cmp-input').fill('해담');
    await R.vis('.cmp-send').click();
    await R.page.waitForTimeout(400);
    ok('블링크 답장 → F-LEAK', (await R.page.evaluate(() => LM.flag('LEAK'))) === true);
    await R.shot('blink-leak');
    await R.home();
    await R.taxi('청운고시원', null);
    await R.shot('final-scene');
    await R.finish('D');
    await R.shot('ending');
    ok('끝까지 콘솔·페이지 오류 0', R.errors.length === 0, R.errors.join(' / '));
    await R.ctx.close();
  });

  await run('(f) 엔딩 B — 예약 메일 삭제, 경찰에 아무것도 안 보냄, 09:00', async () => {
    const R = await newRun(browser, 'f-ending-B', { desktop: true });
    await R.unlock();
    await R.wifiOn();
    await R.dh3();
    await R.openApp('mail');
    await R.vis('.row').filter({ hasText: '나중에 보내기' }).first().click();
    await R.page.waitForTimeout(350);
    await R.vis('.row').filter({ hasText: '자수하겠습니다' }).first().click();
    await R.page.waitForTimeout(350);
    await R.page.locator('.mail-sched-del').click();
    await R.page.waitForTimeout(250);
    await R.page.locator('.as-btn', { hasText: '삭제' }).click();
    await R.page.waitForTimeout(350);
    ok('예약 메일 삭제 → F-MAIL deleted', (await R.page.evaluate(() => LM.flag('MAIL'))) === 'deleted');
    await R.shot('mail-deleted');
    await R.advance(710);
    await R.page.waitForSelector('.cine-ending');
    await R.page.waitForTimeout(300);
    ok('엔딩 B', (await R.page.evaluate(() => LM.G.ending && LM.G.ending.kind)) === 'B', String(await R.page.evaluate(() => LM.G.ending && LM.G.ending.kind)));
    await R.shot('ending');
    await R.replay('B');
    await R.shot('replay');
    ok('끝까지 콘솔·페이지 오류 0', R.errors.length === 0, R.errors.join(' / '));
    await R.ctx.close();
  });

  await run('(g) 저장·불러오기 — 새로고침해도 진행이 남는다', async () => {
    const R = await newRun(browser, 'g-save-load', { desktop: true });
    await R.unlock();
    await R.unlockNote();
    await R.wifiOn();
    await R.readDadRoom();
    await R.shot('before-reload');
    const before = await R.page.evaluate(() => ({
      gameMs: LM.G.gameMs,
      note: !!(LM.G.world && LM.G.world.noteUnlocked),
      wifi: !!(LM.G.net && LM.G.net.wifi),
      dadRead: Object.keys((LM.G.read && LM.G.read.talk) || {}).filter((k) => k.indexOf('dad:') === 0).length,
      unlocked: !LM.state.locked,
    }));
    await R.page.evaluate(() => LM.saveGame('auto'));
    await R.page.goto(DIST);
    await R.page.waitForFunction(() => window.LM && window.LM.G && window.LM.read);
    await R.page.waitForTimeout(500);
    const after = await R.page.evaluate(() => ({
      gameMs: LM.G.gameMs,
      note: !!(LM.G.world && LM.G.world.noteUnlocked),
      wifi: !!(LM.G.net && LM.G.net.wifi),
      dadRead: Object.keys((LM.G.read && LM.G.read.talk) || {}).filter((k) => k.indexOf('dad:') === 0).length,
      unlocked: !LM.state.locked,
    }));
    ok('새로고침 뒤 잠금 해제 유지', after.unlocked === true);
    ok('메모 잠금 해제 유지', after.note === true);
    ok('Wi-Fi 상태 유지', after.wifi === true);
    ok('아빠 방 읽음 유지', after.dadRead === before.dadRead && after.dadRead >= 6, JSON.stringify({ before, after }));
    ok('게임 시각 유지', after.gameMs >= before.gameMs, JSON.stringify({ before, after }));
    await R.shot('after-reload');
    ok('끝까지 콘솔·페이지 오류 0', R.errors.length === 0, R.errors.join(' / '));
    await R.ctx.close();
  });

  await browser.close();
  console.log('\n플레이스루 (UI 전용) — 시작→모든 엔딩');
  console.log(results.join('\n'));
  console.log(failed ? '\n실패 ' + failed + '건' : '\n전부 통과');
  process.exit(failed ? 1 : 0);
})();
