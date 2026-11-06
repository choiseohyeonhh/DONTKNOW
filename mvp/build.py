"""단일 HTML 빌드: CSS·스크립트·이미지·폰트를 한 파일에 인라인한다.
사용: python3 mvp/build.py OUT.html
"""
import base64
import json
import mimetypes
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).parent
out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else HERE / 'dist' / 'dontknow.html')
out.parent.mkdir(parents=True, exist_ok=True)


def data_uri(path):
    p = pathlib.Path(path)
    mime = mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
    if p.suffix == '.woff2':
        mime = 'font/woff2'
    return f'data:{mime};base64,' + base64.b64encode(p.read_bytes()).decode()


def inline_images(text):
    for p in sorted((HERE / 'img').iterdir(), key=lambda x: len(x.name), reverse=True):
        if p.is_file():
            text = text.replace(f'img/{p.name}', data_uri(p))
    return text


html = (HERE / 'index.html').read_text(encoding='utf-8')
css = (HERE / 'style.css').read_text(encoding='utf-8')
css = css.replace('fonts/PretendardVariable.woff2', data_uri(HERE / 'fonts' / 'PretendardVariable.woff2'))
css = inline_images(css)
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + '\n</style>')
html = inline_images(html)

assets = {}
for p in sorted((HERE / 'img').iterdir()):
    if p.is_file():
        assets[p.stem] = data_uri(p)
assets_js = 'window.__ASSETS = ' + json.dumps(assets, ensure_ascii=False) + ';'
html = html.replace('<script src="js/data.js"></script>', '<script>\n' + assets_js + '\n</script>\n<script src="js/data.js"></script>')


def inline_script(m):
    js = (HERE / m.group(1)).read_text(encoding='utf-8')
    js = inline_images(js)
    return '<script>\n' + js + '\n</script>'


html = re.sub(r'<script src="([^"]+)"></script>', inline_script, html)
out.write_text(html, encoding='utf-8')
print(out, round(out.stat().st_size / 1e6, 2), 'MB')
