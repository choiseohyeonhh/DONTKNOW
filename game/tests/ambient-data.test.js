/* 배경 콘텐츠 데이터 테스트 (node, 브라우저 불필요).
 * 실행: node game/tests/ambient-data.test.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..', '..');
const AMBIENT = path.join(ROOT, 'game', 'js', 'content', 'ambient.js');
const LOOP = path.join(ROOT, 'game', 'js', 'apps', 'loop.js');
const GAME_START = new Date('2026-03-17T21:10:00+09:00');
const GAME_END = new Date('2026-03-18T09:00:00+09:00');
const CACHE_CUT = new Date('2026-03-15T03:58:00+09:00');

const LOOP_CIRCLES = new Set(['한서대 경영 26 동기', '성원고 동창', '서아의 영상과', '동네·생활', '관심사', '학교·기관 공식']);
const CONTACT_CIRCLES = new Set(['가족', '성원고 동창', '한서대 경영 26 동기', '서아·영상과', '풋살', '지난 알바', '학원·선생님', '동네·생활', '기관·업체']);

function load() {
  const src = fs.readFileSync(AMBIENT, 'utf8');
  const sandbox = { window: {}, console };
  vm.runInNewContext(src, sandbox, { filename: 'ambient.js' });
  assert.ok(sandbox.window.LM && sandbox.window.LM.C, 'window.LM.C missing');
  return sandbox.window.LM.C.ambient;
}

function ts(v) { const d = new Date(v); assert.ok(!Number.isNaN(d.getTime()), 'invalid date ' + v); return d; }
function tc(name, fn) { fn(); console.log('  ✓ ' + name); }

let failed = 0;
function run(name, fn) {
  try { tc(name, fn); } catch (e) { failed++; console.log('  ✗ ' + name + ' — ' + e.message); }
}

const A = load();

run('loopAccounts: 36개, 무리 분포 10/8/4/5/6/3', () => {
  assert.strictEqual(A.loopAccounts.length, 36);
  const c = {};
  for (const a of A.loopAccounts) c[a.circle] = (c[a.circle] || 0) + 1;
  assert.deepStrictEqual(c, {
    '한서대 경영 26 동기': 10, '성원고 동창': 8, '서아의 영상과': 4,
    '동네·생활': 5, '관심사': 6, '학교·기관 공식': 3,
  });
  const handles = new Set();
  for (const a of A.loopAccounts) {
    assert.ok(a.id && a.handle && a.displayName && a.name && a.bio);
    assert.ok(a.followsDohyun === true || a.followsDohyun === false);
    assert.ok(Number.isFinite(a.followers) && a.followers > 0);
    assert.ok(LOOP_CIRCLES.has(a.circle), 'bad circle ' + a.circle);
    assert.ok(!handles.has(a.handle), 'duplicate handle ' + a.handle);
    handles.add(a.handle);
  }
});

run('people: 64명, 톡 친구 54명, 김태윤 제외', () => {
  assert.strictEqual(A.people.length, 64);
  assert.strictEqual(A.people.filter((p) => p.talkFriend).length, 54);
  assert.strictEqual(A.people.filter((p) => p.talk === true).length, 54);
  const ids = new Set(A.people.map((p) => p.id));
  assert.strictEqual(ids.size, 64);
  for (const p of A.people) {
    assert.ok(p.name && p.relation && p.id);
    assert.ok(CONTACT_CIRCLES.has(p.circle), 'bad circle ' + p.circle);
    assert.ok(['plain', 'casual', 'emoji'].includes(p.tone));
    if (p.loop && !p.canon) {
      assert.ok(A.loopAccounts.some((a) => a.handle === p.loop), 'missing loop account ' + p.loop);
    }
  }
  const kim = A.people.find((p) => p.name === '김태윤');
  assert.ok(kim, '김태윤 missing');
  assert.strictEqual(kim.talkFriend, false);
});

run('loopPosts: 420개 정적 게시물, 작성자·무리·노이즈·미디어', () => {
  assert.strictEqual(A.loopPosts.length, 420);
  const handles = new Set(A.loopAccounts.map((a) => a.handle));
  const ids = new Set();
  for (const p of A.loopPosts) {
    assert.ok(p.id && !ids.has(p.id), 'duplicate post id ' + p.id); ids.add(p.id);
    assert.ok(handles.has(p.author), 'unknown author ' + p.author);
    assert.ok(LOOP_CIRCLES.has(p.circle), 'bad post circle ' + p.circle);
    assert.strictEqual(p.noise, true);
    assert.strictEqual(p.evidence, null);
    assert.ok(p.kind === 'photo' || p.kind === 'text');
    assert.ok(p.likes >= 0);
    assert.ok(Array.isArray(p.comments));
    assert.ok(Array.isArray(p.hashtags) && p.hashtags.length >= 1);
    const t = ts(p.createdAt);
    assert.ok(t < GAME_START, 'static post at/after game start ' + p.createdAt);
    assert.ok(t <= GAME_END);
    if (p.cache) assert.ok(t <= CACHE_CUT, 'cached post after cutoff ' + p.createdAt);
    if (p.kind === 'photo') {
      assert.ok(p.caption, 'photo caption missing');
      assert.ok(Array.isArray(p.media) && p.media.length === 1);
      assert.strictEqual(p.media[0].kind, 'photo');
      assert.ok(p.media[0].scene && Array.isArray(p.media[0].palette) && p.media[0].palette.length >= 2);
    } else {
      assert.ok(p.body, 'text body missing');
    }
    for (const c of p.comments) {
      assert.ok(handles.has(c.author), 'unknown comment author ' + c.author);
      assert.ok(c.body && ts(c.createdAt));
      assert.ok(ts(c.createdAt) <= GAME_END);
      if (p.cache) assert.ok(ts(c.createdAt) <= CACHE_CUT, 'cached comment after cutoff');
    }
  }
});

run('loopPostsLive: 게임 중 새 게시물, 21:10~09:00', () => {
  assert.ok(A.loopPostsLive.length >= 20 && A.loopPostsLive.length <= 48, 'live count ' + A.loopPostsLive.length);
  const handles = new Set(A.loopAccounts.map((a) => a.handle));
  for (const p of A.loopPostsLive) {
    assert.strictEqual(p.live, true);
    assert.ok(handles.has(p.author));
    assert.ok(LOOP_CIRCLES.has(p.circle));
    assert.strictEqual(p.noise, true);
    assert.strictEqual(p.evidence, null);
    const t = ts(p.createdAt);
    assert.ok(t >= GAME_START, 'live before start ' + p.createdAt);
    assert.ok(t <= GAME_END, 'live after end ' + p.createdAt);
    assert.ok(!p.cache);
  }
});

run('L20 노이즈 비율: 배경 >= 4 × 핵심', () => {
  const src = fs.readFileSync(LOOP, 'utf8');
  const pm = src.match(/const POSTS = \[([\s\S]*?)\n  \];/);
  const dm = src.match(/const DK_POSTS = \[([\s\S]*?)\n  \];/);
  assert.ok(pm && dm, 'loop.js post blocks not found');
  const postIds = [...pm[1].matchAll(/\{ id: '([^']+)'/g)].map((m) => m[1]);
  const canon = postIds.filter((x) => !x.startsWith('noise')).length;
  const dk = [...dm[1].matchAll(/\{ id: '([^']+)'/g)].length;
  const key = canon + dk;
  assert.ok(A.loopPosts.length + A.loopPostsLive.length >= 4 * key, 'noise ratio');
});

run('rooms: 그룹 5 + 1:1 13, 멤버·과거 대화', () => {
  assert.strictEqual(A.rooms.length, 18);
  const groups = A.rooms.filter((r) => r.type === 'group');
  const dms = A.rooms.filter((r) => r.type === '1:1');
  assert.strictEqual(groups.length, 5);
  assert.strictEqual(dms.length, 13);
  const byName = Object.fromEntries(groups.map((r) => [r.name, r]));
  assert.strictEqual(byName['경영 26 새내기'].count, 52);
  assert.strictEqual(byName['성원고 3-2'].count, 31);
  assert.strictEqual(byName['경영원론 3조'].count, 5);
  assert.strictEqual(byName['성원 풋살'].count, 14);
  assert.strictEqual(byName['편의점 알바(2024)'].count, 6);
  assert.strictEqual(byName['편의점 알바(2024)'].muted, true);
  const pids = new Set(A.people.map((p) => p.id));
  for (const r of A.rooms) {
    assert.ok(r.id && r.name && Array.isArray(r.members) && r.members.length > 0);
    assert.ok(Array.isArray(r.history) && r.history.length > 0);
    assert.ok(CONTACT_CIRCLES.has(r.circle), 'bad room circle ' + r.circle);
    for (const m of r.members) assert.ok(pids.has(m), 'unknown room member ' + m);
    for (const m of r.history) {
      assert.ok(m.dir === 'in' || m.dir === 'out');
      assert.ok(m.body && m.sender && m.day && m.time);
      assert.ok(ts(m.at) <= CACHE_CUT, 'history after cache cutoff ' + m.at);
    }
    if (r.type === '1:1') {
      for (const m of r.history) assert.ok(ts(m.at) < new Date('2026-03-14T00:00:00+09:00'), '1:1 history not before 3/14');
    }
  }
});

run('pool: 300문장 이상, 방·앱 참조, 3조 마감 화제', () => {
  assert.ok(A.pool && Array.isArray(A.pool.items));
  assert.ok(A.pool.total >= 300, 'pool total ' + A.pool.total);
  assert.strictEqual(A.pool.items.length, A.pool.total);
  const roomIds = new Set(A.rooms.map((r) => r.id));
  const seen = new Set();
  for (const it of A.pool.items) {
    assert.ok(it.id && it.text && it.circle);
    assert.ok(!seen.has(it.text), 'duplicate pool text ' + it.text); seen.add(it.text);
    assert.ok(it.room || it.app, 'pool item needs room or app');
    if (it.room) assert.ok(roomIds.has(it.room), 'unknown room ' + it.room);
    if (it.window) {
      assert.ok(Array.isArray(it.window) && it.window.length === 2);
      assert.ok(it.window.every((h) => Number.isInteger(h) && h >= 0 && h <= 24));
    }
  }
  const deadline = A.pool.items.filter((it) => it.room === 'talk.team3' && it.text.includes('3/18 23:59'));
  assert.ok(deadline.length >= 3, '3조 deadline items ' + deadline.length);
});

run('schedule: 3.9.3 값 그대로', () => {
  assert.strictEqual(JSON.stringify(A.schedule), JSON.stringify({
    rates: { '21-24': [8, 12], '00-02': [3, 6], '02-06': [0, 2], '06-09': [5, 9] },
    minGapSec: 30,
    eventQuietSec: 120,
    burst: [1, 5],
  }));
});

if (failed) {
  console.log('\n' + failed + ' test(s) failed.');
  process.exit(1);
}
console.log('\nambient-data: all tests passed.');
