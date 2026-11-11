#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""배경 콘텐츠 린터 (DATABASE_SCHEMA L19~L22).

실행: python3 game/tools/lint_ambient.py
종료 코드: 위반이 하나라도 있으면 1. 읽기 전용.
"""
import json
import os
import re
import sys
from datetime import datetime, timezone, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AMBIENT = os.path.join(ROOT, "game", "js", "content", "ambient.js")
LOOP_JS = os.path.join(ROOT, "game", "js", "apps", "loop.js")
KST = timezone(timedelta(hours=9))
GAME_END = datetime(2026, 3, 18, 9, 0, tzinfo=KST)
CACHE_CUT = datetime(2026, 3, 15, 3, 58, tzinfo=KST)
CANON_KEY_FALLBACK = 33

LOOP_CIRCLES = {
    "한서대 경영 26 동기", "성원고 동창", "서아의 영상과",
    "동네·생활", "관심사", "학교·기관 공식",
}
CONTACT_CIRCLES = {
    "가족", "성원고 동창", "한서대 경영 26 동기", "서아·영상과", "풋살",
    "지난 알바", "학원·선생님", "동네·생활", "기관·업체",
}

# SNS 8.11.3-3 + 작업 지시의 전체 금지 목록. 배경 콘텐츠만 검사한다.
FORBIDDEN = [
    # 핵심 장소
    "리버뷰", "리버뷰타워", "성원대교", "청운", "청운고시원", "해담", "해담고시텔",
    "고시텔", "고시원", "성원구청역", "성원스파",
    # 핵심 사물
    "검은 SUV", "SUV", "녹색 문자판", "녹색 시계", "스마트키", "엠블럼", "녹음",
    # 핵심 이름
    "강민석", "민석", "실장", "민지", "한결",
    # 사건·수법·광고 어휘
    "블링크", "보이스피싱", "계좌", "대출", "통장", "사기", "실종", "경찰", "수사", "사건",
    "자금세탁", "돈세탁", "탈취", "해킹", "대본", "수법", "고액 알바", "고액알바",
    # 실존 브랜드
    "카카오", "인스타", "인스타그램", "페이스북", "트위터", "틱톡", "유튜브",
    "스타벅스", "배민", "배달의민족", "쿠팡", "네이버", "구글", "애플", "삼성",
    "아이폰", "갤럭시", "맥도날드", "이마트", "세븐일레븐",
]
FORBIDDEN_NUM = ["7731", "5512", "680403", "070921", "110221", "38러", "1203", "207", "304"]

# L26: 배경 인물의 이름(성 제외)이 캐논 인물과 겹치면 안 된다.
CANON_GIVEN_NAMES = {"도현", "상철", "지훈", "서아", "하린", "민지", "민석", "태윤", "미선"}


def given_name_candidates(name):
    """성(첫 글자, 필요하면 두 글자)을 뗀 이름 후보. 기관명은 자연히 걸리지 않는다."""
    if not isinstance(name, str):
        return set()
    name = name.strip()
    cands = {name}
    if len(name) >= 2:
        cands.add(name[1:])
    if len(name) >= 3:
        cands.add(name[2:])
    return cands


def load_ambient():
    src = open(AMBIENT, encoding="utf-8").read()
    m = re.search(r"window\.LM\.C\.ambient\s*=\s*(\{.*\});\s*$", src, re.S)
    if not m:
        raise SystemExit("L00 FAIL ambient.js에서 window.LM.C.ambient 객체를 찾지 못했습니다")
    return json.loads(m.group(1))


def parse_ts(s):
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except Exception:
        return None


def walk_strings(value, path, out):
    if isinstance(value, str):
        out.append((path, value))
    elif isinstance(value, dict):
        for k, v in value.items():
            walk_strings(v, f"{path}.{k}", out)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            walk_strings(v, f"{path}[{i}]", out)


def has_final_consonant(text):
    """마지막 한글 음절의 받침 유무. 한글이 아니면 None."""
    if not text:
        return None
    ch = text[-1]
    if not (0xAC00 <= ord(ch) <= 0xD7A3):
        return None
    return (ord(ch) - 0xAC00) % 28 != 0


def final_is_rieul(text):
    if not text:
        return False
    ch = text[-1]
    if not (0xAC00 <= ord(ch) <= 0xD7A3):
        return False
    return (ord(ch) - 0xAC00) % 28 == 8


def expected_particles(name):
    has_batchim = has_final_consonant(name)
    if has_batchim is None:
        return None
    if has_batchim:
        return {"은", "이", "을", "과", "으로"} | ({"로"} if final_is_rieul(name) else set())
    return {"는", "가", "를", "와", "로"}


def check_particles(text, names, path, errors):
    for name in names:
        expected = expected_particles(name)
        if not expected:
            continue
        for m in re.finditer(re.escape(name) + r"(은|는|이|가|을|를|과|와|으로|로)", text):
            particle = m.group(1)
            if particle not in expected:
                errors.append((path, f"L25 particle after '{name}': '{particle}' (expected {'/'.join(sorted(expected))})", text[:80]))


def scan(text, path, errors):
    if not isinstance(text, str):
        return
    low = text.lower()
    for w in FORBIDDEN:
        if w.lower() in low:
            errors.append((path, f"forbidden='{w}'", text[:80]))
    for w in FORBIDDEN_NUM:
        if re.search(r"(?<!\d)" + re.escape(w) + r"(?!\d)", text):
            errors.append((path, f"forbidden_number='{w}'", text[:80]))
    if re.search(r"(?<![A-Za-z])K(?![A-Za-z])", text):
        errors.append((path, "forbidden='K'", text[:80]))


def canon_key_posts():
    try:
        src = open(LOOP_JS, encoding="utf-8").read()
        pm = re.search(r"const POSTS = \[(.*?)\n  \];", src, re.S)
        dm = re.search(r"const DK_POSTS = \[(.*?)\n  \];", src, re.S)
        if not pm:
            return CANON_KEY_FALLBACK, "fallback"
        post_ids = re.findall(r"\n\s*\{ id: '([^']+)'", pm.group(1))
        canon = [x for x in post_ids if not x.startswith("noise")]
        dk = re.findall(r"\n\s*\{ id: '([^']+)'", dm.group(1)) if dm else []
        return len(canon) + len(dk), f"loop.js POSTS={len(canon)} DK_POSTS={len(dk)}"
    except Exception:
        return CANON_KEY_FALLBACK, "fallback"


def main():
    A = load_ambient()
    errors = []
    warns = []

    people = A.get("people", [])
    rooms = A.get("rooms", [])
    accounts = A.get("loopAccounts", [])
    posts = A.get("loopPosts", [])
    live = A.get("loopPostsLive", [])
    pool_items = A.get("pool", {}).get("items", [])
    schedule = A.get("schedule", {})

    handles = {a.get("handle") for a in accounts}
    pids = {p.get("id") for p in people}

    # ---- L19 배경 금지어 ----
    for a in accounts:
        for k in ("handle", "displayName", "name", "bio"):
            scan(a.get(k), f"L19 loopAccounts[{a.get('id')}].{k}", errors)
    for p in people:
        if p.get("canon"):
            continue
        for k in ("name", "relation"):
            scan(p.get(k), f"L19 people[{p.get('id')}].{k}", errors)
    for r in rooms:
        scan(r.get("name"), f"L19 rooms[{r.get('id')}].name", errors)
        for i, msg in enumerate(r.get("history", [])):
            scan(msg.get("body"), f"L19 rooms[{r.get('id')}].history[{i}]", errors)
            scan(msg.get("sender"), f"L19 rooms[{r.get('id')}].history[{i}].sender", errors)
    for p in posts + live:
        for k in ("caption", "body", "place"):
            scan(p.get(k), f"L19 loopPosts[{p.get('id')}].{k}", errors)
        for h in p.get("hashtags", []):
            scan(h, f"L19 loopPosts[{p.get('id')}].hashtags", errors)
        for i, c in enumerate(p.get("comments", [])):
            scan(c.get("body"), f"L19 loopPosts[{p.get('id')}].comments[{i}]", errors)
    for it in pool_items:
        scan(it.get("text"), f"L19 pool[{it.get('id')}]", errors)

    # 도현 언급 비율(3/16 이후 그룹방·풀): 8개 중 1개 이하, 걱정 수준만.
    group_ids = {r["id"] for r in rooms if r.get("type") == "group"}
    after = datetime(2026, 3, 16, 0, 0, tzinfo=KST)
    for r in rooms:
        if r.get("type") != "group":
            continue
        msgs = [m for m in r.get("history", []) if (parse_ts(m.get("at", "")) or after) >= after]
        mentions = [m for m in msgs if "도현" in m.get("body", "")]
        if mentions and len(mentions) * 8 > len(msgs):
            errors.append((f"L19-DOHYUN rooms[{r['id']}]", f"도현 mentions {len(mentions)}/{len(msgs)} > 1/8", ""))
        for m in mentions:
            if any(w in m.get("body", "") for w in ["실종", "경찰", "사기", "고시원", "계좌"]):
                errors.append((f"L19-DOHYUN rooms[{r['id']}]", "도현 mention contains case context", m.get("body", "")[:80]))
    # 3조 마감 화제
    deadline = [p for p in pool_items if p.get("room") == "talk.team3" and "3/18 23:59" in p.get("text", "")]
    if len(deadline) < 3:
        warns.append(("R-3JO", f"3/18 23:59 deadline pool items = {len(deadline)} (<3)"))

    # ---- L20 노이즈 비율 ----
    canon_n, source = canon_key_posts()
    bg_n = len(posts) + len(live)
    if bg_n < 4 * canon_n:
        errors.append(("L20", f"background={bg_n} < 4x canon_key={canon_n} ({source})", ""))

    # ---- L21 작성자·무리·노이즈 ----
    for p in posts + live:
        pid = p.get("id")
        if p.get("author") not in handles:
            errors.append((f"L21 loopPosts[{pid}].author", f"unknown author={p.get('author')}", ""))
        if p.get("circle") not in LOOP_CIRCLES:
            errors.append((f"L21 loopPosts[{pid}].circle", f"invalid circle={p.get('circle')}", ""))
        if p.get("noise") is not True:
            errors.append((f"L21 loopPosts[{pid}].noise", "must be true", ""))
        if p.get("evidence") is not None:
            errors.append((f"L21 loopPosts[{pid}].evidence", "must be null", ""))
        for i, c in enumerate(p.get("comments", [])):
            if c.get("author") not in handles:
                errors.append((f"L21 loopPosts[{pid}].comments[{i}].author", f"unknown author={c.get('author')}", ""))
    for p in people:
        if p.get("circle") not in CONTACT_CIRCLES:
            errors.append((f"L21 people[{p.get('id')}].circle", f"invalid circle={p.get('circle')}", ""))
    for r in rooms:
        for mid in r.get("members", []):
            if mid not in pids:
                errors.append((f"L21 rooms[{r.get('id')}].members", f"unknown member={mid}", ""))
        if r.get("circle") not in CONTACT_CIRCLES:
            errors.append((f"L21 rooms[{r.get('id')}].circle", f"invalid circle={r.get('circle')}", ""))
        if r.get("count") is not None and r.get("count") < len(r.get("members", [])):
            errors.append((f"L21 rooms[{r.get('id')}].count", "count < named members", ""))

    # ---- L22 미래 시각 ----
    for p in posts + live:
        t = parse_ts(p.get("createdAt", ""))
        if not t:
            errors.append((f"L22 loopPosts[{p.get('id')}].createdAt", "invalid timestamp", p.get("createdAt", "")))
            continue
        if t > GAME_END:
            errors.append((f"L22 loopPosts[{p.get('id')}].createdAt", f"after 2026-03-18 09:00: {p.get('createdAt')}", ""))
        if p.get("cache") is True and t > CACHE_CUT:
            errors.append((f"L22 loopPosts[{p.get('id')}].cache", f"cached item after 03:58: {p.get('createdAt')}", ""))
        for i, c in enumerate(p.get("comments", [])):
            ct = parse_ts(c.get("createdAt", ""))
            if not ct:
                errors.append((f"L22 loopPosts[{p.get('id')}].comments[{i}].createdAt", "invalid timestamp", ""))
            elif ct > GAME_END:
                errors.append((f"L22 loopPosts[{p.get('id')}].comments[{i}]", f"after 09:00: {c.get('createdAt')}", ""))
            elif p.get("cache") is True and ct > CACHE_CUT:
                errors.append((f"L22 loopPosts[{p.get('id')}].comments[{i}]", f"cached comment after 03:58: {c.get('createdAt')}", ""))
    for r in rooms:
        for i, m in enumerate(r.get("history", [])):
            t = parse_ts(m.get("at", ""))
            if not t:
                errors.append((f"L22 rooms[{r.get('id')}].history[{i}].at", "invalid timestamp", ""))
            elif t > CACHE_CUT:
                errors.append((f"L22 rooms[{r.get('id')}].history[{i}].at", f"after cache cutoff: {m.get('at')}", ""))

    # ---- L23 중괄호 플레이스홀더 ----
    all_strings = []
    walk_strings(A, "L23", all_strings)
    for path, text in all_strings:
        if "{" in text or "}" in text:
            errors.append((path, "L23 brace placeholder", text[:80]))

    # ---- L24 풀·방 과거 대화 문장 중복 ----
    sentence_count = {}
    sentence_where = {}
    for it in pool_items:
        t = it.get("text")
        if isinstance(t, str):
            sentence_count[t] = sentence_count.get(t, 0) + 1
            sentence_where.setdefault(t, []).append(f"pool[{it.get('id')}]")
    for r in rooms:
        for i, msg in enumerate(r.get("history", [])):
            t = msg.get("body")
            if isinstance(t, str):
                sentence_count[t] = sentence_count.get(t, 0) + 1
                sentence_where.setdefault(t, []).append(f"rooms[{r.get('id')}].history[{i}]")
    for t, n in sentence_count.items():
        if n > 2:
            errors.append(("L24", f"duplicate sentence used {n} times (>2)", t[:80] + " :: " + ", ".join(sentence_where[t][:4])))

    # ---- L25 이름 뒤 조사 받침 ----
    name_set = set()
    for p in people:
        if p.get("name"):
            name_set.add(p["name"])
    for r in rooms:
        if r.get("name"):
            name_set.add(r["name"])
    names_by_len = sorted(name_set, key=len, reverse=True)
    for path, text in all_strings:
        check_particles(text, names_by_len, path, errors)

    # ---- L26 캐논 이름·캐논 발신자 침범 ----
    canon_people = [p for p in people if p.get("canon")]
    canon_names = {p.get("name") for p in canon_people if p.get("name")}
    canon_ids = {p.get("id") for p in canon_people}
    canon_handles = {
        a.get("handle") for a in accounts
        if a.get("personId") in canon_ids
        or a.get("displayName") in canon_names
        or a.get("name") in canon_names
    }
    for p in people:
        if p.get("canon"):
            continue
        hit = given_name_candidates(p.get("name")) & CANON_GIVEN_NAMES
        if hit:
            errors.append((f"L26 people[{p.get('id')}].name",
                           f"background given name collides with canon: {','.join(sorted(hit))}",
                           p.get("name", "")))
    for r in rooms:
        for i, msg in enumerate(r.get("history", [])):
            sender = msg.get("sender")
            if sender in canon_names:
                errors.append((f"L26 rooms[{r.get('id')}].history[{i}].sender",
                               f"canon person as background sender: {sender}", msg.get("body", "")[:80]))
    for it in pool_items:
        for k in ("sender", "author"):
            if it.get(k) in canon_names or it.get(k) in canon_handles:
                errors.append((f"L26 pool[{it.get('id')}].{k}",
                               f"canon person as background sender/author: {it.get(k)}", it.get("text", "")[:80]))
    for p in posts + live:
        pid = p.get("id")
        author = p.get("author")
        if author in canon_names or author in canon_handles:
            errors.append((f"L26 loopPosts[{pid}].author",
                           f"canon person as background author: {author}", ""))
        for i, c in enumerate(p.get("comments", [])):
            cauthor = c.get("author")
            if cauthor in canon_names or cauthor in canon_handles:
                errors.append((f"L26 loopPosts[{pid}].comments[{i}].author",
                               f"canon person as background comment author: {cauthor}", ""))

    # ---- 참고 검사 ----
    if len(pool_items) < 300:
        errors.append(("R-POOL", f"pool items={len(pool_items)} < 300", ""))
    seen = set()
    for it in pool_items:
        t = it.get("text")
        if t in seen:
            errors.append((f"R-POOL pool[{it.get('id')}]", "duplicate pool sentence", t))
        seen.add(t)
    if len(accounts) != 36:
        warns.append(("R-COUNT", f"loopAccounts={len(accounts)} (expected 36)"))
    if len(people) != 64:
        warns.append(("R-COUNT", f"people={len(people)} (expected 64)"))
    tf = sum(1 for p in people if p.get("talkFriend"))
    if tf != 54:
        warns.append(("R-COUNT", f"talkFriend={tf} (expected 54)"))
    if len(posts) != 420:
        warns.append(("R-COUNT", f"loopPosts={len(posts)} (expected 420)"))
    if schedule != {"rates": {"21-24": [8, 12], "00-02": [3, 6], "02-06": [0, 2], "06-09": [5, 9]},
                     "minGapSec": 30, "eventQuietSec": 120, "burst": [1, 5]}:
        errors.append(("R-SCHEDULE", "schedule does not match 3.9.3", json.dumps(schedule, ensure_ascii=False)))

    pass_msg = (
        f"L19 forbidden words: 0 | L20 noise: {bg_n} background vs {canon_n} canon key ({source}) | "
        f"L21 authors/circles: ok | L22 future/cache ts: ok | "
        f"L23 braces: 0 | L24 pool/history dup<=2 | L25 particle/받침: ok | "
        f"L26 canon given-name/sender: ok"
    )
    if errors:
        for path, msg, text in errors:
            print(f"FAIL {path} {msg}" + (f" :: {text}" if text else ""))
        for path, msg in warns:
            print(f"WARN {path} {msg}")
        print(f"\n{len(errors)} violation(s).")
        return 1
    for path, msg in warns:
        print(f"WARN {path} {msg}")
    print("PASS " + pass_msg)
    print(f"     loopAccounts={len(accounts)} people={len(people)} talkFriend={tf} "
          f"posts={len(posts)} live={len(live)} rooms={len(rooms)} pool={len(pool_items)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
