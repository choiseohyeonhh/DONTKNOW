#!/usr/bin/env python3
"""FLUX 결과(1024x1024)를 게임 비율로 중앙 크롭한다. Pillow 필요.
사용: python3 tools/crop-image.py <입력> <출력> <9:16|3:4|16:9|1:1> [--upscale]
--upscale: 긴 변 기준 2배 LANCZOS(임시 확대. 최종 해상도는 업스케일 단계에서).
--cctv: 흑백 + 픽셀 블록 + 노이즈 + 주사선(저화질 CCTV 룩). numpy 필요."""
import sys
from PIL import Image
RATIOS = {"9:16": (9, 16), "3:4": (3, 4), "16:9": (16, 9), "1:1": (1, 1)}
src, dst, ratio = sys.argv[1:4]
im = Image.open(src).convert("RGB")
w, h = im.size
rw, rh = RATIOS[ratio]
if w * rh > h * rw:      # 너무 넓음 → 좌우 자름
    nw, nh = h * rw // rh, h
else:
    nw, nh = w, w * rh // rw
l, t = (w - nw) // 2, (h - nh) // 2
out = im.crop((l, t, l + nw, t + nh))
if "--cctv" in sys.argv:
    import numpy as np
    from PIL import ImageOps
    g = ImageOps.autocontrast(out.convert("L"), cutoff=1)
    sw, sh = g.size
    g = g.resize((sw // 6, sh // 6), Image.BILINEAR).resize((sw, sh), Image.NEAREST)
    a = np.asarray(g, dtype=np.float32)
    rng = np.random.default_rng(7)
    a += rng.normal(0, 9, a.shape)
    a[::4, :] *= 0.86                      # 주사선
    for y in rng.integers(0, sh, 6):       # 가로 노이즈 줄
        a[y:y + 2, :] = np.clip(a[y:y + 2, :] + rng.normal(30, 20, (min(2, sh - y), sw)), 0, 255)
    out = Image.fromarray(np.clip(a * 0.92, 0, 255).astype("uint8")).convert("RGB")
if "--upscale" in sys.argv:
    out = out.resize((nw * 2, nh * 2), Image.LANCZOS)
out.save(dst, quality=92)
print(dst, out.size)
