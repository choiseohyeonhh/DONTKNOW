/* stage 3: 30분 위기(원격 지우기) 다섯 해법 + 동기화 방어 + 흔적 3종.
 * 실행: node game/tests/crisis.test.js */
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
  await page.waitForFunction(() => window.LM && window.LM.G && window.LM.ev && window.LM.trace);
  return { ctx, page, errors };
}

/* 게임 시계의 실시간 흐름을 멈추고 게임 분만 정확히 진행한다. */
async function goOnline(page) {
  await page.evaluate(() => LM.set({ wifi: true, airplane: false }));
  await page.waitForTimeout(120);
  await page.evaluate(() => LM.pause('test'));
}

async function run(name, fn) {
  try { await fn(); }
  catch (e) { failed++; results.push('  ✗ ' + name + ' — ' + e.message); }
}

(async () => {
  const browser = await chromium.launch();

  await run('해법 1: 답장 → DH-2, 30분 뒤 원격 지우기 없음', async () => {
    const { ctx, page, errors } = await open(browser);
    await goOnline(page);
    await page.evaluate(() => DK.advance(36));
    const before = await page.evaluate(() => ({
      dh: LM.G.npc.DH,
      ev06: LM.msg.list('msg', 'cirrus').some((m) => m.from === 'in' && /30분 안에 대답 없으면/.test(m.text)),
    }));
    ok('첫 온라인 뒤 DH-1', before.dh === 1, String(before.dh));
    ok('EV-06 경고 메시지 도착', before.ev06 === true);
    await page.evaluate(() => LM.sendMessage({ app: 'msg', thread: 'cirrus', npc: 'DH', name: '도현의 슬레이트' }, { text: '누구세요' }));
    const afterReply = await page.evaluate(() => LM.G.npc.DH);
    ok('답장하면 DH-2', afterReply === 2, String(afterReply));
    await page.evaluate(() => DK.advance(40));
    const st = await page.evaluate(() => ({
      wiped: LM.flag('WIPED'), screen: !!document.querySelector('.wipe-setup'),
    }));
    ok('DH-2에서는 지우기가 실행되지 않는다', st.wiped === false && st.screen === false, JSON.stringify(st));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('해법 2: "아빠다" + 서랍 사진 → DH-3, 삭제·지우기 취소, 아빠 톡 "1" 소거', async () => {
    const { ctx, page, errors } = await open(browser);
    await goOnline(page);
    await page.evaluate(() => LM.sendMessage({ app: 'msg', thread: 'cirrus', npc: 'DH', name: '도현의 슬레이트' }, { text: '아빠다' }));
    await page.evaluate(() => LM.sendMessage({ app: 'msg', thread: 'cirrus', npc: 'DH', name: '도현의 슬레이트' }, {
      text: '', attachment: { eid: 'E-217b', title: '서랍 봉투 박미선님 65', kind: 'photo', app: 'cam' },
    }));
    const st = await page.evaluate(() => ({
      dh: LM.G.npc.DH,
      sched: LM.G.sched.map((e) => e.id),
      read: [1, 2, 3, 4, 5, 6].map((i) => !!LM.G.read.talk['dad:' + i]),
      unread: [1, 2, 3, 4, 5, 6].map((i) => LM.read.isUnread('talk', 'dad:' + i)),
    }));
    ok('서랍 봉투 사진으로 DH-3', st.dh === 3, String(st.dh));
    ok('EV-04/05/06/07/08 예약이 모두 취소됨', !st.sched.some((id) => /^EV-0[4-8]$/.test(id)), st.sched.join(','));
    ok('아빠 톡 6통이 읽음 처리됨', st.read.every(Boolean), JSON.stringify(st.read));
    ok('"1"이 더 이상 안 읽음이 아니다', st.unread.every((v) => v === false), JSON.stringify(st.unread));
    await page.evaluate(() => DK.advance(10));
    const reply = await page.evaluate(() => LM.msg.list('msg', 'cirrus').some((m) => m.from === 'in' && /지우는 거 멈출게/.test(m.text)));
    ok('"…지우는 거 멈출게" 답장', reply === true);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('해법 3: 비행기 모드면 지우기는 다음 온라인까지 대기', async () => {
    const { ctx, page, errors } = await open(browser);
    await page.evaluate(() => { window.__judge = []; LM.on('judge', (e) => window.__judge.push(e.kind)); });
    await goOnline(page);
    await page.evaluate(() => DK.advance(36));
    await page.evaluate(() => LM.set({ airplane: true }));
    await page.evaluate(() => DK.advance(40));
    const offline = await page.evaluate(() => ({ wiped: LM.flag('WIPED'), screen: !!document.querySelector('.wipe-setup'), pending: LM.G.sched.some((e) => e.id === 'EV-08') }));
    ok('오프라인 동안 지우기 없음', offline.wiped === false && offline.screen === false, JSON.stringify(offline));
    ok('지우기 명령은 예약에 남아 있다', offline.pending === true);
    await page.evaluate(() => LM.set({ airplane: false }));
    await page.waitForTimeout(200);
    const on = await page.evaluate(() => ({ wiped: LM.flag('WIPED'), screen: !!document.querySelector('.wipe-setup') }));
    ok('다음 온라인 순간 지우기 실행', on.wiped === true && on.screen === true, JSON.stringify(on));
    await page.evaluate(() => DK.advance(2));
    const judged = await page.evaluate(() => window.__judge.slice());
    ok('초기 설정 화면 뒤 judge(wiped)', judged.indexOf('wiped') >= 0, judged.join(','));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('해법 4: 시러스 암호 변경 → DH-X, 지우기 취소', async () => {
    const { ctx, page, errors } = await open(browser);
    await goOnline(page);
    await page.evaluate(() => DK.advance(36));
    await page.evaluate(() => LM.ev.changeCirrusPassword());
    const x = await page.evaluate(() => LM.G.npc.DH);
    ok('암호 변경으로 DH-X', x === 'X', String(x));
    await page.evaluate(() => DK.advance(40));
    const st = await page.evaluate(() => ({ wiped: LM.flag('WIPED'), screen: !!document.querySelector('.wipe-setup') }));
    ok('지우기가 실행되지 않는다', st.wiped === false && st.screen === false, JSON.stringify(st));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('해법 5: 아무것도 안 함 → T+66 초기 설정 화면, 1분 뒤 judge', async () => {
    const { ctx, page, errors } = await open(browser);
    await page.evaluate(() => { window.__judge = []; LM.on('judge', (e) => window.__judge.push(e.kind)); });
    await goOnline(page);
    await page.evaluate(() => DK.advance(70));
    const st = await page.evaluate(() => ({
      wiped: LM.flag('WIPED'), rec: LM.flag('REC'),
      screen: !!document.querySelector('.wipe-setup'),
      hello: document.querySelector('.wipe-setup .wipe-hello') ? document.querySelector('.wipe-setup .wipe-hello').textContent : '',
      judge: window.__judge.slice(),
    }));
    ok('원격 지우기 실행', st.wiped === true);
    ok('초기 설정 화면이 떠 있다', st.screen === true && st.hello === '안녕하세요', JSON.stringify(st));
    ok('F-REC device → lost', st.rec === 'lost', String(st.rec));
    ok('judge(wiped) 이벤트', st.judge.indexOf('wiped') >= 0, st.judge.join(','));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('동기화 방어: 메모 동기화를 끄면 EV-04가 지우지 않는다', async () => {
    const { ctx, page, errors } = await open(browser);
    await page.evaluate(() => { LM.G.sync.notes = false; LM.set({ wifi: true, airplane: false }); });
    await page.waitForTimeout(120);
    await page.evaluate(() => LM.pause('test'));
    await page.evaluate(() => DK.advance(20));
    const st = await page.evaluate(() => ({
      deleted: LM.isDeleted('note', 'n-dad'), fired: !!LM.G.events['EV-04'],
    }));
    ok('EV-04는 발화했지만 삭제하지 않는다', st.fired === true, JSON.stringify(st));
    ok('"아빠한테" 메모가 남아 있다', st.deleted === false);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('흔적 TR-02: 온라인에서 안 읽은 아빠 톡방을 열면 기록', async () => {
    const { ctx, page, errors } = await open(browser);
    await goOnline(page);
    await page.evaluate(() => LM.openApp('talk'));
    await page.waitForSelector('.appwin[data-app="talk"] .row');
    await page.locator('.appwin[data-app="talk"] .row', { hasText: '아빠' }).first().click();
    await page.waitForTimeout(250);
    const tr = await page.evaluate(() => LM.G.traces['TR-02']);
    ok('TR-02가 기록됨', !!tr, JSON.stringify(tr));
    ok('온라인이라 즉시 전달됨', !!tr && tr.deliveredAt != null && tr.pending === false, JSON.stringify(tr));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('흔적 TR-05: 서아 스토리를 보면 조회 흔적', async () => {
    const { ctx, page, errors } = await open(browser);
    await goOnline(page);
    await page.evaluate(() => LM.openApp('loop'));
    await page.waitForSelector('.lp-story[aria-label="seoa.film 스토리"]');
    await page.locator('.lp-story[aria-label="seoa.film 스토리"]').click();
    await page.waitForTimeout(200);
    const tr = await page.evaluate(() => LM.G.traces['TR-05']);
    ok('TR-05가 기록됨', !!tr, JSON.stringify(tr));
    ok('본 사람은 서아', !!tr && tr.meta && tr.meta.handle === 'seoa.film', JSON.stringify(tr && tr.meta));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('흔적 TR-07: 사진 동기화가 켜진 카메라 촬영', async () => {
    const { ctx, page, errors } = await open(browser);
    await goOnline(page);
    await page.evaluate(() => LM.openApp('cam'));
    await page.waitForSelector('.cam-shutter');
    await page.locator('.cam-shutter').click();
    await page.waitForTimeout(200);
    const tr = await page.evaluate(() => LM.G.traces['TR-07']);
    ok('TR-07이 기록됨', !!tr, JSON.stringify(tr));
    ok('카메라 촬영이 출처', !!tr && tr.meta && tr.meta.source === 'cam', JSON.stringify(tr && tr.meta));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('초기 설정 화면 뒤에는 키보드 입력이 막힌다', async () => {
    const { ctx, page, errors } = await open(browser);
    await goOnline(page);
    await page.evaluate(() => DK.advance(70));
    await page.waitForSelector('.wipe-setup');
    const before = await page.evaluate(() => ({ pause: !!document.querySelector('.pause'), app: LM.current() ? LM.current().id : null }));
    await page.keyboard.press('Escape');
    await page.keyboard.type('abc');
    await page.waitForTimeout(120);
    const after = await page.evaluate(() => ({ pause: !!document.querySelector('.pause'), app: LM.current() ? LM.current().id : null }));
    ok('Esc로 일시정지가 열리지 않는다', before.pause === false && after.pause === false, JSON.stringify(after));
    ok('앱이 열리지 않는다', after.app === null, String(after.app));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await browser.close();
  console.log('\n위기·흔적 테스트');
  console.log(results.join('\n'));
  console.log(failed ? `\n실패 ${failed}건` : '\n전부 통과');
  process.exit(failed ? 1 : 0);
})();
