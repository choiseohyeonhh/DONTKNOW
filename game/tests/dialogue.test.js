/* 작성창·공유·NPC 대화 통합 테스트 (node + playwright).
 * 실행: node game/tests/dialogue.test.js */
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
  await page.waitForFunction(() => window.LM && window.LM.G);
  return { ctx, page, errors };
}
async function online(page) {
  await page.evaluate(() => LM.set({ wifi: true, airplane: false }));
  await page.waitForTimeout(80);
}
async function run(name, fn) {
  try { await fn(); }
  catch (e) { failed++; results.push('  ✗ ' + name + ' — ' + e.message); }
}

/* 공유 시트를 UI로 연다(앱의 공유 버튼/길게 누르기 대신 공용 시트 자체를 검사한다). */
async function shareViaSheet(page, payload) {
  await page.evaluate((p) => LM.share.open(p), payload);
  await page.waitForSelector('.share');
}
async function pickShareTarget(page, name) {
  await page.locator('.share-recent .share-t', { hasText: name }).first().click();
  await page.waitForSelector('.cmp-sheet');
}
async function openBlinkRoom(page) {
  await page.locator('.row', { hasText: '실장K' }).click();
  const open = page.locator('.as-btn', { hasText: '열기' });
  if (await open.count()) await open.click();
  await page.waitForSelector('.blink-room');
}
async function sendComposer(page) {
  await page.locator('.cmp-head-btn.strong').click();
  await page.waitForTimeout(150);
}

(async () => {
  const browser = await chromium.launch();

  await run('톡: 지훈에게 E-23 공유 → 지연 뒤 JH-1 답장', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await online(page);
    await shareViaSheet(page, { eid: 'E-23', title: '지훈 톡 · 아빠한테는 말하지 마', kind: 'message', app: 'talk' });
    await pickShareTarget(page, '지훈');
    await sendComposer(page);
    const sent = await page.evaluate(() => LM.msg.list('talk', 'jihoon').some((m) => m.from === 'out' && m.attach && m.attach.eid === 'E-23'));
    ok('E-23 첨부가 지훈 톡에 들어갔다', sent);
    const before = await page.evaluate(() => LM.msg.list('talk', 'jihoon').filter((m) => m.from === 'in' && /도현이 살아 있어요/.test(m.text)).length);
    ok('지연 전에는 답장이 없다', before === 0, String(before));
    await page.evaluate(() => DK.advance(10));
    await page.waitForTimeout(120);
    const st = await page.evaluate(() => ({
      reply: LM.msg.list('talk', 'jihoon').some((m) => m.from === 'in' && /도현이 살아 있어요/.test(m.text)),
      state: LM.G.npc.JH,
    }));
    ok('JH-1 답장이 도착했다', st.reply);
    ok('지훈 상태 JH-1', st.state === 1, String(st.state));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('서아: V-05(E-42) 공유 → E-93 정정 답장', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await online(page);
    await shareViaSheet(page, { eid: 'E-42', title: '서아 하이라이트 3월 · 홍대', kind: 'story', app: 'loop' });
    await pickShareTarget(page, '서아');
    await sendComposer(page);
    await page.evaluate(() => DK.advance(30));
    await page.waitForTimeout(120);
    const st = await page.evaluate(() => ({
      reply: LM.msg.list('talk', 'seoa').some((m) => m.from === 'in' && /홍대 있었어요/.test(m.text)),
      seen: LM.hasSeen('E-93'),
      state: LM.G.npc.SA,
    }));
    ok('SA-2 정정 답장이 도착했다', st.reply);
    ok('E-93이 열람으로 기록된다', st.seen);
    ok('서아 상태 SA-2', st.state === 2, String(st.state));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('도현: 서랍 사진 E-217b → DH-3, "한결" → DH-4/CONFESS', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await online(page);
    await shareViaSheet(page, { eid: 'E-217b', title: '서랍 봉투 박미선님 65', kind: 'photo', app: 'cam' });
    await pickShareTarget(page, '도현의 슬레이트');
    await sendComposer(page);
    await page.evaluate(() => DK.advance(10));
    await page.waitForTimeout(120);
    const dh3 = await page.evaluate(() => ({
      state: LM.G.npc.DH,
      reply: LM.msg.list('msg', 'cirrus').some((m) => m.from === 'in' && /지우는 거 멈출게/.test(m.text)),
    }));
    ok('서랍 사진으로 DH-3', dh3.state === 3, String(dh3.state));
    ok('DH-3 답장이 도착했다', dh3.reply);
    const sent = await page.evaluate(() => LM.sendMessage({ app: 'msg', thread: 'cirrus', npc: 'DH', name: '도현의 슬레이트' }, { text: '한결' }));
    ok('한결 전송', sent === true);
    await page.evaluate(() => DK.advance(10));
    await page.waitForTimeout(120);
    const dh4 = await page.evaluate(() => ({
      state: LM.G.npc.DH,
      confess: LM.flag('CONFESS'),
      reply: LM.msg.list('msg', 'cirrus').some((m) => m.from === 'in' && /언제부터 알았어/.test(m.text)),
    }));
    ok('DH-4로 열림', dh4.state === 4, String(dh4.state));
    ok('CONFESS 기록', dh4.confess === true);
    ok('빚 고백 답장', dh4.reply);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('김태윤: "강민석" 메일은 08:10까지 답장이 없다가 회신', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=mail');
    await online(page);
    await page.locator('.nb-btn[aria-label="새 메일"]').click();
    await page.waitForSelector('.mail-compose');
    await page.locator('input[aria-label="받는 사람"]').fill('taeyun.kim@sw.police.kr');
    await page.locator('input[aria-label="제목"]').fill('수사 관련');
    await page.locator('textarea[aria-label="본문"]').fill('강민석입니다.');
    await page.locator('.sh-btn.strong', { hasText: '보내기' }).click();
    await page.waitForTimeout(200);
    const early = await page.evaluate(() => ({
      replies: LM.msg.list('mail', 'inbox').filter((m) => m.npc === 'KT').length,
      nameSent: LM.flag('NAME_SENT'),
    }));
    ok('보낸 직후에는 회신이 없다', early.replies === 0, String(early.replies));
    ok('NAME_SENT가 기록된다', early.nameSent === true);
    await page.evaluate(() => DK.advance(700));
    await page.waitForTimeout(150);
    const late = await page.evaluate(() => ({
      replies: LM.msg.list('mail', 'inbox').filter((m) => m.npc === 'KT'),
      seen: LM.hasSeen('E-94'),
    }));
    ok('08:10에 회신이 도착했다', late.replies.length === 1, String(late.replies.length));
    ok('회신에 이름 확인 문장', /그 이름/.test(late.replies[0] ? late.replies[0].text : ''), late.replies[0] && late.replies[0].text);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('김태윤: "민석"만 보내면 부분 회신', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=mail');
    await online(page);
    await page.locator('.nb-btn[aria-label="새 메일"]').click();
    await page.waitForSelector('.mail-compose');
    await page.locator('input[aria-label="받는 사람"]').fill('taeyun.kim@sw.police.kr');
    await page.locator('textarea[aria-label="본문"]').fill('민석이라는 이름을 봤습니다.');
    await page.locator('.sh-btn.strong', { hasText: '보내기' }).click();
    await page.evaluate(() => DK.advance(700));
    await page.waitForTimeout(150);
    const st = await page.evaluate(() => ({
      reply: LM.msg.list('mail', 'inbox').filter((m) => m.npc === 'KT')[0],
      nameSent: LM.flag('NAME_SENT'),
    }));
    ok('부분 회신이 도착했다', !!st.reply && /성까지 확인되면/.test(st.reply.text), st.reply && st.reply.text);
    ok('NAME_SENT는 아니다', st.nameSent === false);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('블링크: 실장에게 "해담" → LEAK', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=blink');
    await online(page);
    await openBlinkRoom(page);
    await page.locator('.cmp-input').fill('해담');
    await page.locator('.cmp-send').click();
    await page.waitForTimeout(120);
    const st = await page.evaluate(() => ({ leak: LM.flag('LEAK'), ks: LM.G.npc.KS }));
    ok('LEAK가 참이 된다', st.leak === true);
    ok('실장 상태 KS-3', st.ks === 3, String(st.ks));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('블링크: 실장에게 "청운" → LEAK 아님', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=blink');
    await online(page);
    await openBlinkRoom(page);
    await page.locator('.cmp-input').fill('청운');
    await page.locator('.cmp-send').click();
    await page.waitForTimeout(120);
    const st = await page.evaluate(() => ({ leak: LM.flag('LEAK'), ks: LM.G.npc.KS }));
    ok('청운은 LEAK가 아니다', st.leak === false);
    ok('대신 실장 상태가 오른다(KS-2)', st.ks === 2, String(st.ks));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('오프라인: 보내기 비활성 + 전송 거부', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=talk');
    await page.evaluate(() => LM.set({ wifi: false, airplane: false }));
    await page.locator('.row', { hasText: '지훈' }).first().click();
    await page.waitForSelector('.talk-room');
    const st = await page.evaluate(() => ({
      disabled: document.querySelector('.cmp-send') ? document.querySelector('.cmp-send').disabled : null,
      sent: LM.sendMessage({ app: 'talk', thread: 'jihoon', npc: 'JH', name: '지훈' }, { text: '안녕' }),
      count: LM.msg.list('talk', 'jihoon').filter((m) => m.from === 'out').length,
    }));
    ok('보내기 버튼 비활성', st.disabled === true, String(st.disabled));
    ok('LM.sendMessage가 거부한다', st.sent === false);
    ok('보낸 메시지가 늘지 않는다', st.count === 0, String(st.count));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('작성창: 텍스트 대치 ㅈㅅ + 스페이스', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=talk');
    await online(page);
    await page.locator('.row', { hasText: '지훈' }).first().click();
    await page.waitForSelector('.talk-room');
    const inp = page.locator('.cmp-input');
    await inp.fill('ㅈㅅ');
    await inp.press(' ');
    const v = await inp.inputValue();
    ok('대치가 주소로 바뀐다', v === '성원구청로 31 해담고시텔 207호 ', JSON.stringify(v));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('공유 시트: 스크린샷으로 저장은 오프라인에서도 된다', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock');
    await page.evaluate(() => LM.set({ wifi: false, airplane: false }));
    await shareViaSheet(page, { eid: 'E-42', title: '서아 하이라이트 3월 · 홍대', kind: 'story', app: 'loop' });
    await page.locator('.row', { hasText: '스크린샷으로 저장' }).click();
    const n = await page.evaluate(() => (LM.G.shots || []).length);
    ok('사진 목록에 스크린샷이 생긴다', n === 1, String(n));
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await run('블링크: 60초 삭제 타이머가 저장·불러오기에 남는다', async () => {
    const { ctx, page, errors } = await open(browser, '?unlock&app=blink');
    await online(page);
    await openBlinkRoom(page);
    await page.waitForTimeout(100);
    const before = await page.evaluate(() => Object.keys(LM.G.blink.expiry).length);
    ok('만료 시각이 G.blink.expiry에 있다', before > 0, String(before));
    await page.evaluate(() => LM.saveGame('auto'));
    await page.reload();
    await page.waitForFunction(() => window.LM && window.LM.G);
    const after = await page.evaluate(() => ({ opened: LM.G.blink.opened, n: Object.keys(LM.G.blink.expiry).length }));
    ok('불러온 뒤에도 만료 시각이 남는다', after.n === before, String(after.n));
    ok('비밀 대화 열림 상태도 남는다', after.opened === true);
    ok('콘솔 오류 없음', errors.length === 0, errors.join(' / '));
    await ctx.close();
  });

  await browser.close();
  console.log('\n대화 테스트');
  console.log(results.join('\n'));
  console.log(failed ? `\n실패 ${failed}건` : '\n전부 통과');
  process.exit(failed ? 1 : 0);
})();
