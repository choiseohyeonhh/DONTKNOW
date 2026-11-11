#!/usr/bin/env python3
"""LUMA 프로토타입 빌드.

1) index.html의 앱 스크립트·CSS 목록을 js/apps/*.js, css/apps-*.css 로 갱신한다.
2) dist/luma-prototype.html 단일 파일을 만든다(CSS·JS·폰트 인라인, 외부 요청 0).
   폰 브라우저에서 파일 하나로 열 수 있다.

사용: python3 phone-prototype/tools/build.py
"""
import base64
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
APPS = sorted(p.name for p in (ROOT / "js" / "apps").glob("*.js"))
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
    t = block("<!-- APP-CSS:BEGIN -->", "<!-- APP-CSS:END -->", "\n".join(f'<link rel="stylesheet" href="css/{c}">' for c in CSS), t)
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
    out = ROOT / "dist" / "luma-prototype.html"
    out.parent.mkdir(exist_ok=True)
    single = inline(html)
    assert 'src="' not in re.sub(r"<script>.*?</script>", "", single, flags=re.S), "인라인 안 된 스크립트가 남았다"
    out.write_text(single, encoding="utf-8")
    print(f"앱 {len(APPS)}개, 앱 CSS {len(CSS)}개 → {out.relative_to(ROOT.parent)} ({out.stat().st_size / 1e6:.1f}MB)")


if __name__ == "__main__":
    main()
