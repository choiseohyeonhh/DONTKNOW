# docs/content/father-phone-data.md 에서 부재중·한결 스레드 데이터를 읽어 data.js를 만든다.
import re, json, datetime, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
src = (ROOT / 'docs/content/father-phone-data.md').read_text(encoding='utf-8')
WD = '월화수목금토일'

def fmt_day(y, m, d):
    dt = datetime.date(int(y), int(m), int(d))
    return f"{y}년 {int(m)}월 {int(d)}일 ({WD[dt.weekday()]})"

def ts(y, m, d, hm):
    return f"{y}{m}{d}{hm.replace(':', '')}"

# 1) 한결 스레드 34건 (4.2)
hang = []
for line in src.splitlines():
    mm = re.match(r'^\| (\d{3}) \| (\d{4})-(\d{2})-(\d{2})\(.\) (\d{2}:\d{2}) \| (.+?) \| (읽음|미읽)', line)
    if mm:
        n, y, m, d, hm, text, st = mm.groups()
        hang.append({'d': fmt_day(y, m, d), 't': hm, 'x': text, 'ts': ts(y, m, d, hm)})
assert len(hang) == 34, len(hang)

# 2) 부재중 47건 (2장)
calls = []
for line in src.splitlines():
    mm = re.match(r'^\| (CL\.\d{3}) \| (\d{4})-(\d{2})-(\d{2})\(.\) (\d{2}:\d{2}) \| (.+?) \| (.+?) \| (.+?) \|$', line)
    if mm:
        cid, y, m, d, hm, num, name, real = mm.groups()
        calls.append({'d': f"{int(m)}/{int(d)}", 't': hm, 'n': num.strip(), 'name': '' if name.strip() == '(미저장)' else name.strip(), 'ts': ts(y, m, d, hm)})
assert len(calls) == 47, len(calls)
calls.sort(key=lambda c: c['ts'], reverse=True)

# 3) 배차실·대학교 (4.4, 4.5) — 문서 값 그대로
dispatch = [
    {'d': fmt_day(2026, 3, 12), 't': '07:40', 'x': '이 반장님 오늘 3번 차 배차 변경입니다', 'ts': '20260312' + '0740'},
    {'d': fmt_day(2026, 3, 16), 't': '09:05', 'x': '이 반장님 오늘 안 나오세요?', 'ts': '20260316' + '0905'},
    {'d': fmt_day(2026, 3, 17), 't': '09:10', 'x': '연락 부탁드립니다', 'ts': '20260317' + '0910'},
]
univ = [
    {'d': fmt_day(2026, 2, 3), 't': '10:00', 'x': '[○○대학교] 신입생 학부모님께 드리는 학사 안내', 'ts': '20260203' + '1000'},
    {'d': fmt_day(2026, 2, 20), 't': '10:00', 'x': '[○○대학교] 입학식 및 신입생 오리엔테이션 안내(3월 2일)', 'ts': '20260220' + '1000'},
]
# 4) 광고 7건 (4.3)
ads = [
    ('1666-XXXX', 2025, 11, 14, '11:02', '(광고) 서민 대환대출 한도 무료 조회'),
    ('1588-XXXX', 2025, 12, 3, '10:40', '(광고) 연말 특별 저금리 상품 안내'),
    ('070-XXXX-2290', 2026, 1, 8, '14:15', '(광고) 개인회생·파산 무료 상담'),
    ('1544-XXXX', 2026, 1, 22, '09:30', '(광고) 신용점수 올리는 방법 알려드립니다'),
    ('1666-XXXX', 2026, 2, 10, '16:20', '(광고) 설 명절 긴급자금 특별 한도'),
    ('070-XXXX-7710', 2026, 3, 4, '11:45', '(광고) 채무통합 상담 받아보세요'),
    ('1600-XXXX', 2026, 3, 16, '10:10', '(광고) 지원 대출 대상자 안내'),
]
ads_out = [{'num': a[0], 'd': fmt_day(a[1], a[2], a[3]), 't': a[4], 'x': a[5], 'ts': ts(a[1], f'{a[2]:02d}', f'{a[3]:02d}', a[4])} for a in ads]

data = {'hangyeol': hang, 'calls': calls, 'dispatch': dispatch, 'univ': univ, 'ads': ads_out}
out = '// 자동 생성: prototype/tutorial/make_data.py (docs/content/father-phone-data.md 기준). 직접 수정 금지.\nconst DATA = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n'
(pathlib.Path(__file__).parent / 'data.js').write_text(out, encoding='utf-8')
print('hangyeol', len(hang), 'calls', len(calls), 'ads', len(ads_out))
