"""
Final targeted checks:
  - Philosophy image: hunt the whole philosophy text region (y=3040-4000)
    for an embedded photo (high-variance sub-region).
  - Booking step-indicator: zoom into the very top of booking to count
    step circles explicitly.
  - Void2 follow-up: confirm the 280px void between Contact & Footer.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps
import pytesseract, re

SRC = Path("/home/z/my-project/scripts/full-page-v3.png")
OUT = Path("/home/z/my-project/scripts/analysis_v3")
img = Image.open(SRC).convert("RGB")
W, H = img.size
arr = np.asarray(img, dtype=np.float32)

# ---------------------------------------------------------------
# 1. Philosophy-image hunt: scan y=3000-4200 in 80px windows.
#    Report brightness + variance + max-std for each window.
#    A photo will have a HIGH std AND will likely be wider than
#    just a column of text.
# ---------------------------------------------------------------
print("="*70)
print("PHILOSOPHY-IMAGE HUNT  (y=3000-4200, 80px windows)")
print("="*70)
for y0 in range(3000, 4200, 80):
    y1 = min(H, y0 + 80)
    sub = arr[y0:y1]
    m = sub.reshape(-1, 3).mean(axis=0)
    s = sub.reshape(-1, 3).std(axis=0).mean()
    # also compute std of grayscale in horizontal direction (text has high horizontal std)
    # and vertical direction (photos have higher vertical std)
    gray = sub.mean(axis=2)
    h_std = gray.std(axis=1).mean()  # variation within each row
    v_std = gray.std(axis=0).mean()  # variation within each column
    flag = "PHOTO-LIKE" if s > 35 else ("text-like" if s < 20 else "mixed")
    print(f"  y={y0:5d}-{y1:5d}  mean=({m[0]:3.0f},{m[1]:3.0f},{m[2]:3.0f}) "
          f"std={s:5.1f}  h_std={h_std:5.1f}  v_std={v_std:5.1f}  {flag}")

# Save a crop of the whole philosophy region for visual inspection
phil_crop = img.crop((0, 2900, W, 4100))
phil_crop.save(OUT / "philosophy-full-v3.png")

# Also split philosophy into left & right halves to see if image is on one side
left = img.crop((0, 2900, W // 2, 4100))
right = img.crop((W // 2, 2900, W, 4100))
arrL = np.asarray(left, dtype=np.float32)
arrR = np.asarray(right, dtype=np.float32)
print(f"\nLeft half (y=2900-4100, x=0-{W//2}):  mean={arrL.mean():.1f}  std={arrL.std():.1f}")
print(f"Right half (y=2900-4100, x={W//2}-{W}): mean={arrR.mean():.1f}  std={arrR.std():.1f}")
left.save(OUT / "philosophy-left-v3.png")
right.save(OUT / "philosophy-right-v3.png")

# ---------------------------------------------------------------
# 2. Booking step-indicator — narrow crop at very top of booking
# ---------------------------------------------------------------
print("\n" + "="*70)
print("BOOKING STEP-INDICATOR  (zoom y=1280-1450)")
print("="*70)
step_crop = img.crop((0, 1280, W, 1450))
step_crop.save(OUT / "booking-step-indicator-zoom.png")
# Try several PSM modes with upscaling
for psm in (6, 11, 12, 4):
    w, h = step_crop.size
    big = step_crop.resize((w * 3, h * 3), Image.LANCZOS)
    txt = pytesseract.image_to_string(big, config=f"--psm {psm} --oem 3")
    if txt.strip():
        print(f"\n--- psm{psm} ---")
        for line in txt.splitlines():
            s = line.strip()
            if s:
                print(f"   {s!r}")

# Also try with digit-only whitelist
big = step_crop.resize((W * 3, 170 * 3), Image.LANCZOS)
txt_digits = pytesseract.image_to_string(big, config="--psm 11 -c tessedit_char_whitelist=0123456789")
print(f"\n--- digit-only whitelist ---")
for line in txt_digits.splitlines():
    s = line.strip()
    if s:
        print(f"   {s!r}")

# ---------------------------------------------------------------
# 3. Void2 confirmation — save annotated crop & re-measure
# ---------------------------------------------------------------
print("\n" + "="*70)
print("VOID2 (Contact -> Footer gap)  — annotated crop")
print("="*70)
# Crop a wide region: from y=7300 (end of contact) to y=8100 (footer top)
gap_crop = img.crop((0, 7350, W, 8100))
gap_crop.save(OUT / "void2-contact-footer-v3.png")
sub = arr[7640:7920]
print(f"  Void2 region y=7640-7920: mean={sub.mean():.2f}  std={sub.std():.2f}  "
      f"min={sub.min():.0f}  max={sub.max():.0f}  h={sub.shape[0]}px")
# What % of pixels are < 15 brightness (pure black)?
pct_black = (sub.mean(axis=2) < 15).mean() * 100
print(f"  % pixels with brightness < 15: {pct_black:.1f}%")

# Also check void1 (FAQ -> Visit Studio)
print("\n  Void1 region y=6520-6840 (FAQ -> Visit Studio):")
sub1 = arr[6520:6840]
print(f"  mean={sub1.mean():.2f}  std={sub1.std():.2f}  h={sub1.shape[0]}px")
pct_black1 = (sub1.mean(axis=2) < 15).mean() * 100
print(f"  % pixels with brightness < 15: {pct_black1:.1f}%")

# ---------------------------------------------------------------
# 4. Final summary: dimensions of every detected void across the
#    whole page (>= 200px tall flat-dark bands)
# ---------------------------------------------------------------
print("\n" + "="*70)
print("ALL FLAT-DARK VOIDS (h >= 200px, bright<25, var<6)")
print("="*70)
BAND = 40
bands = []
for y0 in range(0, H, BAND):
    y1 = min(H, y0 + BAND)
    slab = arr[y0:y1]
    mean = slab.reshape(-1, 3).mean(axis=0)
    std = slab.reshape(-1, 3).std(axis=0).mean()
    bands.append(dict(y0=y0, y1=y1, bright=float(mean.mean()), var=float(std)))

voids = []
i = 0
while i < len(bands):
    b = bands[i]
    if b["bright"] < 25 and b["var"] < 6:
        j = i
        while j < len(bands) and bands[j]["bright"] < 25 and bands[j]["var"] < 6:
            j += 1
        run_h = bands[j-1]["y1"] - bands[i]["y0"]
        if run_h >= 200:
            voids.append({
                "y0": bands[i]["y0"],
                "y1": bands[j-1]["y1"],
                "h": run_h,
                "bright": float(np.mean([bands[k]["bright"] for k in range(i, j)])),
                "var": float(np.mean([bands[k]["var"] for k in range(i, j)])),
            })
        i = j
    else:
        i += 1

for v in voids:
    print(f"  y={v['y0']:5d}-{v['y1']:5d}  h={v['h']:4d}px  "
          f"bright={v['bright']:5.1f}  var={v['var']:5.2f}")
print(f"\nTotal voids >= 200px: {len(voids)}")
print(f"Total void height: {sum(v['h'] for v in voids)}px "
      f"({100*sum(v['h'] for v in voids)/H:.1f}% of page)")
