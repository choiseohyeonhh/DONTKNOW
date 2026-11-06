"""단일 HTML 빌드: style.css·data.js·app.js·이미지·폰트를 한 파일로 묶는다.
사용: python3 build.py <출력경로>   (기본: ./dist/tutorial.html)"""
import base64, mimetypes, pathlib, sys
HERE = pathlib.Path(__file__).parent
out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else HERE / 'dist' / 'tutorial.html')
out.parent.mkdir(parents=True, exist_ok=True)

def data_uri(rel):
    p = HERE / rel
    mime = mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
    if p.suffix == '.woff2': mime = 'font/woff2'
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()

html = (HERE / 'index.html').read_text(encoding='utf-8')
css = (HERE / 'style.css').read_text(encoding='utf-8')
for rel in ['fonts/PretendardVariable.woff2', 'img/wallpaper_toned.jpg', 'img/photo_family_2019.jpg', 'img/photo_father_son_2022.jpg', 'img/photo_graduation_gate.jpg']:
    css = css.replace(rel, data_uri(rel))
data_js = (HERE / 'data.js').read_text(encoding='utf-8')
app_js = (HERE / 'app.js').read_text(encoding='utf-8')
for rel in ['img/photo_family_2019.jpg', 'img/photo_father_son_2022.jpg', 'img/photo_graduation_gate.jpg']:
    app_js = app_js.replace(rel, data_uri(rel))
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + '\n</style>')
html = html.replace('<script src="data.js"></script>', '<script>\n' + data_js + '\n</script>')
html = html.replace('<script src="app.js"></script>', '<script>\n' + app_js + '\n</script>')
html = html.replace('<title>DONTKNOW 튜토리얼 프로토타입</title>', '<title>DONTKNOW 튜토리얼</title>\n<meta name="claude:viewport-fit-sides" content="cover">')
out.write_text(html, encoding='utf-8')
print(out, round(out.stat().st_size / 1e6, 2), 'MB')
