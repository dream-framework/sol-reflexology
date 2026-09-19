"""
v3 analysis: vertical profile + OCR for specific bug verification.

Goals:
  - Detect sections (brightness/variance transitions)
  - OCR-scan for the Stats strip ("14" / "22k+" / "4.9" / "3") and detect
    the duplication bug ("22k+k+")
  - Find large flat-DARK regions (the post-Contact void bug)
  - Crop specific regions for parent-agent review
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw
import pytesseract

SRC = Path("/home/z/my-project/scripts/full-page-v3.png")
OUT = Path("/home/z/my-project/scripts/analysis_v3")
OUT.mkdir(parents=True, exist_ok=True)

img = Image.open(SRC).convert("RGB")
W, H = img.size
arr = np.asarray(img, dtype=np.float32)  # (H, W, 3)
print(f"Image: {W} x {H}")

# ---------------------------------------------------------------
# 1. Vertical profile
# ---------------------------------------------------------------
BAND = 40
bands = []
for y0 in range(0, H, BAND):
    y1 = min(H, y0 + BAND)
    slab = arr[y0:y1]
    mean = slab.reshape(-1, 3).mean(axis=0)
    std = slab.reshape(-1, 3).std(axis=0)
    bright = float(mean.mean())
    var = float(std.mean())
    gray = slab.mean(axis=2)
    edge = float(np.abs(np.diff(gray, axis=1)).mean())
    bands.append(dict(y0=y0, y1=y1, mean=mean.tolist(),
                      bright=bright, var=var, edge=edge))

# ---------------------------------------------------------------
# 2. Section detection (brightness/variance transitions)
# ---------------------------------------------------------------
sections = []
cur = {"y0": 0, "bright": bands[0]["bright"], "high_var": bands[0]["var"] > 60}
for b in bands[1:]:
    if abs(b["bright"] - cur["bright"]) > 18 or (b["var"] > 60) != cur["high_var"]:
        cur["y1"] = b["y0"]
        sections.append(cur)
        cur = {"y0": b["y0"], "bright": b["bright"], "high_var": b["var"] > 60}
    cur["high_var"] = b["var"] > 60
cur["y1"] = H
sections.append(cur)

# Merge tiny (< 80px) into previous
merged = []
for s in sections:
    if merged and s["y1"] - s["y0"] < 80:
        merged[-1]["y1"] = s["y1"]
    else:
        merged.append(s)
sections = merged

print(f"\n=== Detected sections ({len(sections)}) ===")
for i, s in enumerate(sections):
    sub = arr[s["y0"]:s["y1"]]
    m = sub.reshape(-1, 3).mean(axis=0)
    std = sub.reshape(-1, 3).std(axis=0).mean()
    h = s["y1"] - s["y0"]
    print(f"  #{i:2d}  y={s['y0']:5d}-{s['y1']:5d}  h={h:5d}  "
          f"mean=({m[0]:5.0f},{m[1]:5.0f},{m[2]:5.0f})  std={std:5.1f}")

# ---------------------------------------------------------------
# 3. Detect large FLAT-DARK regions (the void bug)
#    A region >= 200px tall, full width (or most of it), with
#    very low variance AND very dark mean is suspicious if it
#    sits between two content sections.
# ---------------------------------------------------------------
print("\n=== Flat-dark bands (potential voids) ===")
WIN = 40
voids = []
i = 0
while i < len(bands):
    b = bands[i]
    # very dark + low variance
    if b["bright"] < 25 and b["var"] < 6:
        # extend forward
        j = i
        while j < len(bands) and bands[j]["bright"] < 25 and bands[j]["var"] < 6:
            j += 1
        run_h = (bands[j-1]["y1"] - bands[i]["y0"]) if j > i else 0
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
    print(f"  y={v['y0']:5d}-{v['y1']:5d}  h={v['h']:5d}  "
          f"bright={v['bright']:5.1f}  var={v['var']:5.2f}")

# ---------------------------------------------------------------
# 4. OCR scan in horizontal slices, looking for stats values
# ---------------------------------------------------------------
print("\n=== OCR scan for Stats numbers (looking for 14, 22k+, 4.9, 3) ===")
# Stats section in v2 was around y=2920-3400 (sections 9-13).
# In v3 the layout may be similar.  We'll OCR a wide band there.
# To be safe we OCR several candidate bands and look for the patterns.

candidates = [
    ("y=2600-3700", (2600, 3700)),
    ("y=2400-3600", (2400, 3600)),
    ("y=2800-3800", (2800, 3800)),
]

found_stats_text = []
for label, (y0, y1) in candidates:
    if y1 > H:
        continue
    crop = img.crop((0, y0, W, y1))
    # Upscale 2x for better OCR
    crop2 = crop.resize((W * 2, (y1 - y0) * 2), Image.LANCZOS)
    txt = pytesseract.image_to_string(crop2, config="--psm 11")
    print(f"\n--- OCR {label} ---")
    # Print only lines with digits or k
    for line in txt.splitlines():
        s = line.strip()
        if s and (any(c.isdigit() for c in s) or "k" in s.lower()):
            print(f"   {s!r}")
            found_stats_text.append((y0, s))

# Look specifically for the duplication bug
print("\n=== Bug-marker scan ===")
joined = " | ".join(s for _, s in found_stats_text)
print(f"Joined text: {joined}")
print(f"Contains '22k+k+': {'22k+k+' in joined}")
print(f"Contains '22k+':   {'22k+' in joined}")
print(f"Contains '4.9':    {'4.9' in joined}")

# Save the stats region crop (likely y=2800-3400)
stats_crop = img.crop((0, 2700, W, 3500))
stats_crop.save(OUT / "stats-strip-v3.png")

# ---------------------------------------------------------------
# 5. Contact -> Footer gap analysis
#    In v2 the void was at y=7000-7800.  In v3 we look at the
#    bottom 2000px and find the largest flat-dark run.
# ---------------------------------------------------------------
print("\n=== Bottom-of-page analysis (Contact -> Footer) ===")
bottom_y0 = max(0, H - 2500)
bottom_bands = [b for b in bands if b["y0"] >= bottom_y0]
for b in bottom_bands:
    flag = ""
    if b["bright"] < 25 and b["var"] < 6:
        flag = "  <-- flat-dark (potential void)"
    print(f"  y={b['y0']:5d}-{b['y1']:5d}  bright={b['bright']:5.1f}  "
          f"var={b['var']:5.2f}  edge={b['edge']:5.2f}{flag}")

# Save contact-footer region crop
cf_crop = img.crop((0, max(0, H - 2200), W, H))
cf_crop.save(OUT / "contact-footer-v3.png")

# ---------------------------------------------------------------
# 6. Save full-page overview with section boundary lines
# ---------------------------------------------------------------
ov = img.copy()
draw = ImageDraw.Draw(ov)
for s in sections:
    draw.line([(0, s["y0"]), (W, s["y0"])], fill=(214, 178, 113), width=2)
    draw.text((10, s["y0"] + 6), f"y={s['y0']}", fill=(214, 178, 113))
ov_thumb = ov.resize((W // 3, H // 3), Image.LANCZOS)
ov_thumb.save(OUT / "overview-labeled-v3.png")

# Save the previously-known void region from v2 (y=7000-7800) as crop
# In v3 this may have moved. We'll save a wide crop around the contact/footer area.
# Look for the largest dark run in the bottom half
bot_half = [b for b in bands if b["y0"] > H // 2]
dark_runs = []
i = 0
while i < len(bot_half):
    b = bot_half[i]
    if b["bright"] < 25 and b["var"] < 6:
        j = i
        while j < len(bot_half) and bot_half[j]["bright"] < 25 and bot_half[j]["var"] < 6:
            j += 1
        run_h = bot_half[j-1]["y1"] - bot_half[i]["y0"]
        dark_runs.append((bot_half[i]["y0"], bot_half[j-1]["y1"], run_h))
        i = j
    else:
        i += 1
print(f"\nDark runs in bottom half (h>=200): "
      f"{[(y0, y1, h) for y0, y1, h in dark_runs if h >= 200]}")

# ---------------------------------------------------------------
# 7. FAQ section OCR (look for the first FAQ answer visible)
#    We OCR around the area where FAQ likely sits.
# ---------------------------------------------------------------
print("\n=== FAQ section OCR scan ===")
# FAQ section in v2 was around y=4360-4960.
faq_crop = img.crop((0, 4200, W, 5200))
faq_crop2 = faq_crop.resize((W * 2, 1000 * 2), Image.LANCZOS)
faq_txt = pytesseract.image_to_string(faq_crop2, config="--psm 11")
print("--- FAQ band OCR (y=4200-5200) ---")
for line in faq_txt.splitlines():
    s = line.strip()
    if s:
        print(f"   {s!r}")
faq_crop.save(OUT / "faq-region-v3.png")

# ---------------------------------------------------------------
# 8. Booking section OCR (look for "Step 1", service cards)
# ---------------------------------------------------------------
print("\n=== Booking section OCR scan ===")
# In v2 Booking was around y=1600-2800 (section 8, h=1200).
booking_crop = img.crop((0, 1500, W, 2900))
booking_crop2 = booking_crop.resize((W * 2, 1400 * 2), Image.LANCZOS)
booking_txt = pytesseract.image_to_string(booking_crop2, config="--psm 11")
print("--- Booking band OCR (y=1500-2900) ---")
for line in booking_txt.splitlines():
    s = line.strip()
    if s:
        print(f"   {s!r}")
booking_crop.save(OUT / "booking-region-v3.png")

# ---------------------------------------------------------------
# 9. Hero & philosophy image sanity (variance in expected photo slot)
# ---------------------------------------------------------------
print("\n=== Hero & Philosophy image sanity ===")
# Hero image area (top): y=80-680 in v2 had high variance (photo)
# Philosophy image: somewhere mid-page; in v2 around y=4360-4960 had a "photo-like" std.
def region_stats(y0, y1, label):
    if y1 > H: y1 = H
    sub = arr[y0:y1]
    m = sub.reshape(-1, 3).mean(axis=0)
    s = sub.reshape(-1, 3).std(axis=0).mean()
    print(f"  {label}: y={y0}-{y1}  mean=({m[0]:.0f},{m[1]:.0f},{m[2]:.0f})  std={s:.1f}")
    return s

hero_std = region_stats(80, 700, "Hero band")
philos_std = region_stats(4360, 4960, "Philosophy band (approx)")
contact_photo_std = region_stats(6360, 7000, "Contact photo band (approx, from v2)")

print(f"\nHero std > 40 (real photo likely)? {hero_std > 40}")
print(f"Philosophy std > 40 (real photo likely)? {philos_std > 40}")

# ---------------------------------------------------------------
# 10. Save full thumbnail strip
# ---------------------------------------------------------------
thumb = img.resize((W // 4, H // 4), Image.LANCZOS)
thumb.save(OUT / "full-thumb-v3.png")

# Save evenly-spaced slices for quick scan
NSLICES = 14
for i in range(NSLICES):
    y0 = int(H * i / NSLICES)
    y1 = int(H * (i + 1) / NSLICES)
    crop = img.crop((0, y0, W, y1))
    w, h = crop.size
    if w > 600:
        nh = int(h * 600 / w)
        crop = crop.resize((600, nh), Image.LANCZOS)
    crop.save(OUT / f"slice-{i:02d}_y{y0}-y{y1}.png")

# ---------------------------------------------------------------
# 11. JSON summary
# ---------------------------------------------------------------
summary = {
    "size": [W, H],
    "sections": [
        {"i": i, "y0": s["y0"], "y1": s["y1"], "h": s["y1"]-s["y0"],
         "mean_rgb": arr[s["y0"]:s["y1"]].reshape(-1,3).mean(axis=0).round(1).tolist(),
         "std": float(arr[s["y0"]:s["y1"]].reshape(-1,3).std(axis=0).mean())}
        for i, s in enumerate(sections)
    ],
    "flat_dark_voids": voids,
    "stats_ocr_text": found_stats_text,
    "has_duplication_bug": "22k+k+" in joined,
    "has_correct_22k": "22k+" in joined,
}
(OUT / "summary.json").write_text(json.dumps(summary, indent=2, default=str))
print(f"\nSaved summary.json to {OUT}")
