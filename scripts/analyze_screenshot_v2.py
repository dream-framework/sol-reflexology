"""
Programmatic analysis of /home/z/my-project/scripts/full-page-v2.png

We can't view images directly in the sub-agent context, so we compute:
  - vertical color/brightness/variance profile (section detection)
  - palette match vs the "earthy zen + dark luxury" design tokens
  - broken-image / blank-region detection (low-variance, near-white or
    flat mid-gray blocks)
  - text density per band (edge energy on dark background)
  - crop thumbnails of each detected section to disk for a parent agent
    with image access to view later
"""

from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw

SRC = Path("/home/z/my-project/scripts/full-page-v2.png")
OUT = Path("/home/z/my-project/scripts/analysis")
OUT.mkdir(parents=True, exist_ok=True)

img = Image.open(SRC).convert("RGB")
W, H = img.size
arr = np.asarray(img, dtype=np.float32)  # (H, W, 3)
print(f"Image: {W} x {H}")

# ---------------------------------------------------------------
# 1. Vertical profile: average color, brightness, variance per band
# ---------------------------------------------------------------
BAND = 40  # px per band
bands = []
for y0 in range(0, H, BAND):
    y1 = min(H, y0 + BAND)
    slab = arr[y0:y1]
    mean = slab.reshape(-1, 3).mean(axis=0)
    std = slab.reshape(-1, 3).std(axis=0)
    bright = mean.mean()
    var = std.mean()
    # text/edge energy: std of grayscale after horizontal diff
    gray = slab.mean(axis=2)
    edge = np.abs(np.diff(gray, axis=1)).mean()
    bands.append(dict(
        y0=y0, y1=y1, mean=mean.tolist(), bright=float(bright),
        var=float(var), edge=float(edge)
    ))

# ---------------------------------------------------------------
# 2. Palette match vs design tokens (OKLCH -> approximate sRGB)
# ---------------------------------------------------------------
# Approx sRGB (computed once mentally, ±a few units):
#   ink/background oklch(0.16 0.012 150)  -> ~ (31, 35, 33)
#   forest        oklch(0.21 0.014 150)  -> ~ (42, 48, 44)
#   forest-deep   oklch(0.13 0.012 150)  -> ~ (24, 27, 25)
#   cream         oklch(0.96 0.012 90)   -> ~ (244, 242, 236)
#   gold          oklch(0.78 0.11 85)    -> ~ (214, 178, 113)
#   sage          oklch(0.72 0.025 130)  -> ~ (170, 184, 158)
targets = {
    "ink":        np.array([31, 35, 33], dtype=np.float32),
    "forest":     np.array([42, 48, 44], dtype=np.float32),
    "forest-deep":np.array([24, 27, 25], dtype=np.float32),
    "cream":      np.array([244, 242, 236], dtype=np.float32),
    "gold":       np.array([214, 178, 113], dtype=np.float32),
    "sage":       np.array([170, 184, 158], dtype=np.float32),
}

# overall dominant colors via quantized histogram
small = arr[::4, ::4].reshape(-1, 3).astype(np.uint8) // 8 * 8
uniq, counts = np.unique(small, axis=0, return_counts=True)
order = np.argsort(-counts)[:12]
dominant = [(uniq[i].tolist(), int(counts[i])) for i in order]
total = int(counts.sum())

def classify(rgb):
    rgb = np.array(rgb, dtype=np.float32)
    best = None; bd = 1e9
    for name, t in targets.items():
        d = float(np.linalg.norm(rgb - t))
        if d < bd: bd = d; best = name
    return best, bd

print("\n=== Dominant colors (top 12 quantized) ===")
palette_hits = {}
for rgb, cnt in dominant:
    name, dist = classify(rgb)
    palette_hits[name] = palette_hits.get(name, 0) + cnt
    pct = 100 * cnt / total
    print(f"  rgb{tuple(rgb)}  count={cnt:7d} ({pct:5.2f}%)  nearest={name:11s} d={dist:5.1f}")

print("\n=== Palette coverage (nearest-token share of sampled pixels) ===")
for name in targets:
    c = palette_hits.get(name, 0)
    print(f"  {name:11s}: {100*c/total:5.2f}%")

# ---------------------------------------------------------------
# 3. Broken-image / blank-region detection
#    A real photo has high local variance. A broken-image placeholder
#    or a flat fallback gradient has very low variance over a wide area.
#    We scan with a 120x120 sliding window and flag large low-variance
#    regions whose mean is NOT the dark background (i.e. looks like a
#    missing photo slot — light gray, white, or single flat color).
# ---------------------------------------------------------------
WIN = 120
STEP = 60
suspicious = []
flat_light = []
for y in range(0, H - WIN, STEP):
    for x in range(0, W - WIN, STEP):
        win = arr[y:y+WIN, x:x+WIN]
        m = win.reshape(-1, 3).mean(axis=0)
        s = win.reshape(-1, 3).std(axis=0).mean()
        bright = m.mean()
        # flat light region = likely broken image placeholder
        if s < 6 and bright > 200:
            flat_light.append((y, x, bright, s))
        # flat mid-gray region (browser broken-image bg ~ #f0f0f0 / light)
        # OR an unexpectedly uniform dark area where a photo was expected
        if s < 4 and bright > 60:
            suspicious.append((y, x, bright, s))

print(f"\n=== Flat light/gray regions (broken-image candidates): {len(flat_light)} ===")
for y, x, b, s in flat_light[:20]:
    print(f"  y={y:5d} x={x:4d} bright={b:5.1f} std={s:4.2f}")

# ---------------------------------------------------------------
# 4. Section detection by brightness/variance transitions
#    Group consecutive bands with similar brightness into sections.
# ---------------------------------------------------------------
sections = []
cur = {"y0": 0, "bright": bands[0]["bright"]}
for b in bands[1:]:
    if abs(b["bright"] - cur["bright"]) > 18 or b["var"] > 60 != cur.get("high_var", False):
        cur["y1"] = b["y0"]
        sections.append(cur)
        cur = {"y0": b["y0"], "bright": b["bright"]}
    cur["high_var"] = b["var"] > 60
cur["y1"] = H
sections.append(cur)

# Merge tiny sections (< 80px) into neighbors
merged = []
for s in sections:
    if merged and s["y1"] - s["y0"] < 80:
        merged[-1]["y1"] = s["y1"]
    else:
        merged.append(s)
sections = merged

print(f"\n=== Detected sections ({len(sections)}) ===")
for i, s in enumerate(sections):
    # average color of the section
    sub = arr[s["y0"]:s["y1"]]
    m = sub.reshape(-1, 3).mean(axis=0)
    std = sub.reshape(-1, 3).std(axis=0).mean()
    name, _ = classify(m)
    h = s["y1"] - s["y0"]
    print(f"  #{i:2d}  y={s['y0']:5d}-{s['y1']:5d}  h={h:5d}  "
          f"mean=({m[0]:5.0f},{m[1]:5.0f},{m[2]:5.0f})  std={std:5.1f}  "
          f"nearest={name}")

# ---------------------------------------------------------------
# 5. Save thumbnail strips + per-section crops for parent agent
# ---------------------------------------------------------------
# Full-page thumbnail (1/4 scale)
thumb = img.resize((W // 4, H // 4), Image.LANCZOS)
thumb.save(OUT / "full-thumb.png")
print(f"\nSaved thumbnail: {OUT/'full-thumb.png'} ({thumb.size[0]}x{thumb.size[1]})")

# Save each section crop (full width, native height, capped to 1600 tall)
for i, s in enumerate(sections):
    crop = img.crop((0, s["y0"], W, s["y1"]))
    # downscale wide crops to <= 600px wide for easy viewing
    w, h = crop.size
    if w > 600:
        nh = int(h * 600 / w)
        crop = crop.resize((600, nh), Image.LANCZOS)
    crop.save(OUT / f"section-{i:02d}_y{s['y0']}-y{s['y1']}.png")

# Also save evenly-spaced horizontal slices for quick scan
NSLICES = 12
for i in range(NSLICES):
    y0 = int(H * i / NSLICES)
    y1 = int(H * (i + 1) / NSLICES)
    crop = img.crop((0, y0, W, y1))
    w, h = crop.size
    if w > 600:
        nh = int(h * 600 / w)
        crop = crop.resize((600, nh), Image.LANCZOS)
    crop.save(OUT / f"slice-{i:02d}_y{y0}-y{y1}.png")
print(f"Saved {NSLICES} horizontal slices + {len(sections)} section crops to {OUT}")

# ---------------------------------------------------------------
# 6. Save a labeled overview with section boundary lines
# ---------------------------------------------------------------
ov = img.copy()
draw = ImageDraw.Draw(ov)
for s in sections:
    draw.line([(0, s["y0"]), (W, s["y0"])], fill=(214, 178, 113), width=2)
    draw.text((10, s["y0"] + 6), f"y={s['y0']}", fill=(214, 178, 113))
ov_thumb = ov.resize((W // 3, H // 3), Image.LANCZOS)
ov_thumb.save(OUT / "overview-labeled.png")
print(f"Saved labeled overview: {OUT/'overview-labeled.png'}")

# ---------------------------------------------------------------
# 7. Dump JSON summary
# ---------------------------------------------------------------
summary = {
    "size": [W, H],
    "dominant_colors": [{"rgb": rgb, "count": c, "pct": 100*c/total} for rgb, c in dominant],
    "palette_coverage_pct": {k: round(100*v/total, 2) for k, v in palette_hits.items()},
    "flat_light_regions": flat_light[:30],
    "sections": [
        {"i": i, "y0": s["y0"], "y1": s["y1"], "h": s["y1"]-s["y0"],
         "mean_rgb": arr[s["y0"]:s["y1"]].reshape(-1,3).mean(axis=0).round(1).tolist()}
        for i, s in enumerate(sections)
    ],
}
(OUT / "summary.json").write_text(json.dumps(summary, indent=2))
print(f"Saved summary.json")
