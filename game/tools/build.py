#!/usr/bin/env python3
"""DONTKNOW v6.2 단일 HTML 빌드.

1) index.html의 콘텐츠·엔진·앱 스크립트와 앱 CSS 목록을 glob으로 갱신한다.
   순서: core → icons → data → content/* → engine/*(고정 순서) → shell → apps/* → boot.
2) dist/dontknow.html 단일 파일을 만든다(CSS·JS·폰트 인라인, 외부 요청 0).

사용: python3 game/tools/build.py
"""
import base64
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
APPS = sorted(p.name for p in (ROOT / "js" / "apps").glob("*.js"))
CONTENT = sorted(p.name for p in (ROOT / "js" / "content").glob("*.js")) if (ROOT / "js" / "content").is_dir() else []
ENGINE_ORDER = ["state.js", "clock.js", "scheduler.js", "notify.js", "pause.js", "prologue.js", "debug.js"]
_engine_all = sorted(p.name for p in (ROOT / "js" / "engine").glob("*.js")) if (ROOT / "js" / "engine").is_dir() else []
ENGINE = [n for n in ENGINE_ORDER if n in _engine_all] + [n for n in _engine_all if n not in ENGINE_ORDER]
CSS = sorted(p.name for p in (ROOT / "css").glob("apps-*.css"))


def block(begin, end, body, text):
    pat = re.compile(re.escape(begin) + r".*?" + re.escape(end), re.S)
    new = begin + "\n" + body + "\n" + end
    if pat.search(text):
        return pat.sub(lambda _: new, text)
    raise SystemExit(f"index.html에 {begin} … {end} 표시가 없다")


def update_index():
    p = ROOT / "index.html"
    t = p.read_text(encoding="utf-8")
    # 처음 한 번: 단일 표시를 BEGIN/END 쌍으로 바꾼다
    t = t.replace("<!-- APP-CSS -->", "<!-- APP-CSS:BEGIN -->\n<!-- APP-CSS:END -->")
    t = t.replace("<!-- APPS -->", "<!-- APPS:BEGIN -->\n<!-- APPS:END -->")
    if "<!-- CONTENT:BEGIN -->" not in t:
        t = t.replace("<!-- APPS:BEGIN -->", "<!-- CONTENT:BEGIN -->\n<!-- CONTENT:END -->\n<!-- ENGINE:BEGIN -->\n<!-- ENGINE:END -->\n<!-- APPS:BEGIN -->")
    t = block("<!-- APP-CSS:BEGIN -->", "<!-- APP-CSS:END -->", "\n".join(f'<link rel="stylesheet" href="css/{c}">' for c in CSS), t)
    t = block("<!-- CONTENT:BEGIN -->", "<!-- CONTENT:END -->", "\n".join(f'<script src="js/content/{a}"></script>' for a in CONTENT), t)
    t = block("<!-- ENGINE:BEGIN -->", "<!-- ENGINE:END -->", "\n".join(f'<script src="js/engine/{a}"></script>' for a in ENGINE), t)
    t = block("<!-- APPS:BEGIN -->", "<!-- APPS:END -->", "\n".join(f'<script src="js/apps/{a}"></script>' for a in APPS), t)
    p.write_text(t, encoding="utf-8")
    return t


def inline(html):
    font = base64.b64encode((ROOT / "fonts" / "PretendardVariable.woff2").read_bytes()).decode()

    def css(m):
        src = (ROOT / m.group(1)).read_text(encoding="utf-8")
        src = src.replace("url('../fonts/PretendardVariable.woff2')", f"url(data:font/woff2;base64,{font})")
        return "<style>\n" + src + "\n</style>"

    def js(m):
        src = (ROOT / m.group(1)).read_text(encoding="utf-8")
        return "<script>\n" + src.replace("</script", "<\\/script") + "\n</script>"

    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
    html = re.sub(r'<script src="([^"]+)"></script>', js, html)
    return html


def main():
    html = update_index()
    out = ROOT / "dist" / "dontknow.html"
    out.parent.mkdir(exist_ok=True)
    single = inline(html)
    assert 'src="' not in re.sub(r"<script>.*?</script>", "", single, flags=re.S), "인라인 안 된 스크립트가 남았다"
    out.write_text(single, encoding="utf-8")
    print(f"콘텐츠 {len(CONTENT)}개, 엔진 {len(ENGINE)}개, 앱 {len(APPS)}개, 앱 CSS {len(CSS)}개 → {out.relative_to(ROOT.parent)} ({out.stat().st_size / 1e6:.1f}MB)")


if __name__ == "__main__":
    main()
