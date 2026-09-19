"""
Targeted v3 verification — high-res OCR + visual crop inspection
for the specific bug-areas.
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps
import pytesseract

SRC = Path("/home/z/my-project/scripts/full-page-v3.png")
OUT = Path("/home/z/my-project/scripts/analysis_v3")
img = Image.open(SRC).convert("RGB")
W, H = img.size
arr = np.asarray(img, dtype=np.float32)

# ---------------------------------------------------------------
# Helper: aggressive OCR with multiple PSM modes
# ---------------------------------------------------------------
def ocr_multi(crop, label, save_path=None):
    if save_path:
        crop.save(save_path)
    # Upscale 3x for OCR
    w, h = crop.size
    big = crop.resize((w * 3, h * 3), Image.LANCZOS)
    # Invert for dark-bg images so tesseract sees light text
    gray = big.convert("L")
    inv = ImageOps.invert(gray)
    results = {}
    for psm in (6, 11, 12, 3):
        results[f"psm{psm}"] = pytesseract.image_to_string(big, config=f"--psm {psm}").strip()
        results[f"psm{psm}_inv"] = pytesseract.image_to_string(inv, config=f"--psm {psm}").strip()
    print(f"\n=== {label} ({crop.size[0]}x{crop.size[1]}) ===")
    for k, v in results.items():
        if v:
            print(f"--- {k} ---")
            for line in v.splitlines():
                s = line.strip()
                if s:
                    print(f"   {s!r}")
    return results


# ---------------------------------------------------------------
# A. Stats strip — find it precisely first.
#    Look for a row of 4 large display numbers.  In v3 the layout
#    is wider (1440 vs 1280) so the stats strip may sit a bit lower.
#    We'll scan y=2400-3600 in 200px windows and pick the one whose
#    OCR contains the most digit-like tokens.
# ---------------------------------------------------------------
print("\n" + "="*70)
print("A. STATS STRIP — searching y=2400-3600 in 200px windows")
print("="*70)
best = None
for y0 in range(2400, 3400, 100):
    y1 = y0 + 200
    crop = img.crop((0, y0, W, y1))
    w, h = crop.size
    big = crop.resize((w * 3, h * 3), Image.LANCZOS)
    txt = pytesseract.image_to_string(big, config="--psm 11")
    # count tokens that look like stat numbers
    score = 0
    for tok in ("14", "22", "4.9", "4,9", "k+", "k +", "3"):
        if tok in txt:
            score += 1
    if "k+k" in txt or "k+k+" in txt:
        score -= 5  # duplication bug
    if best is None or score > best[0]:
        best = (score, y0, y1, txt)

print(f"\nBest window: y={best[1]}-{best[2]} (score={best[0]})")
print(f"OCR text:\n{best[3]}")

# Save and re-OCR the best window with multiple PSMs
stats_crop = img.crop((0, best[1], W, best[2]))
ocr_multi(stats_crop, "STATS STRIP (best window)",
          save_path=str(OUT / "stats-strip-best-v3.png"))

# Also try a wider strip in case the stats sit higher
stats_wide = img.crop((0, 2800, W, 3300))
ocr_multi(stats_wide, "STATS STRIP (wide y=2800-3300)",
          save_path=str(OUT / "stats-strip-wide-v3.png"))

# ---------------------------------------------------------------
# B. Contact -> Footer transition
#    v3 has flat-dark bands at y=6520-6840 (320px) and
#    y=7520-7920 (400px).  We need to identify which is the
#    "post-Contact void".  We'll OCR the bands around them to
#    find what content sits immediately above and below each void.
# ---------------------------------------------------------------
print("\n" + "="*70)
print("B. POST-CONTACT VOID — verifying")
print("="*70)

# OCR the band just BEFORE each void and just AFTER each void
void1_y0, void1_y1 = 6520, 6840
void2_y0, void2_y1 = 7640, 7920

for vid, (name, (a, b)) in enumerate([("void1", (void1_y0, void1_y1)),
                                      ("void2", (void2_y0, void2_y1))], 1):
    print(f"\n--- {name}: y={a}-{b} (h={b-a}px) ---")
    # 200px above
    above = img.crop((0, max(0, a - 250), W, a))
    ocr_multi(above, f"{name} ABOVE (y={max(0,a-250)}-{a})",
              save_path=str(OUT / f"{name}-above-v3.png"))
    # 200px below
    below = img.crop((0, b, W, min(H, b + 250)))
    ocr_multi(below, f"{name} BELOW (y={b}-{min(H,b+250)})",
              save_path=str(OUT / f"{name}-below-v3.png"))
    # The void itself
    void_crop = img.crop((0, a, W, b))
    void_crop.save(OUT / f"{name}-itself-v3.png")
    # Check that the void is REALLY pure black
    sub = arr[a:b]
    print(f"  void stats: mean={sub.mean():.2f}  std={sub.std():.2f}  "
          f"min={sub.min():.0f}  max={sub.max():.0f}")

# ---------------------------------------------------------------
# C. FAQ section — search the whole page for "FAQ" / "Questions"
# ---------------------------------------------------------------
print("\n" + "="*70)
print("C. FAQ SECTION — searching for FAQ markers")
print("="*70)

# Search y=3500-5800 in 400px windows for FAQ markers
for y0 in range(3500, 5800, 400):
    y1 = min(H, y0 + 400)
    crop = img.crop((0, y0, W, y1))
    w, h = crop.size
    big = crop.resize((w * 2, h * 2), Image.LANCZOS)
    txt = pytesseract.image_to_string(big, config="--psm 11").lower()
    if any(m in txt for m in ["faq", "frequent", "question", "ask", "answer"]):
        print(f"\n>>> FAQ-like content found at y={y0}-{y1}:")
        for line in txt.splitlines():
            s = line.strip()
            if s:
                print(f"   {s!r}")
        # Save this crop
        crop.save(OUT / f"faq-candidate-y{y0}-y{y1}.png")

# ---------------------------------------------------------------
# D. Booking section — count service cards & step indicator
# ---------------------------------------------------------------
print("\n" + "="*70)
print("D. BOOKING SECTION — step indicator + service cards")
print("="*70)
# We already saw the booking section around y=1500-2900.
# Look for step indicator explicitly (the small numbered circles)
booking_top = img.crop((0, 1300, W, 1700))
ocr_multi(booking_top, "BOOKING TOP (step indicator area, y=1300-1700)",
          save_path=str(OUT / "booking-step-indicator-v3.png"))

# Count distinct "FROM $X" tokens to count service cards
booking_full = img.crop((0, 1500, W, 2900))
w, h = booking_full.size
big = booking_full.resize((w * 2, h * 2), Image.LANCZOS)
txt = pytesseract.image_to_string(big, config="--psm 11")
# Count occurrences of "FROM" and price tokens
from_count = txt.upper().count("FROM")
print(f"\nNumber of 'FROM' tokens (proxy for service cards): {from_count}")
# Count price tokens like $XXX
import re
prices = re.findall(r"\$\d+", txt)
print(f"Prices found: {prices}")
print(f"Number of distinct price tokens: {len(prices)}")

# Count step numbers (looking for "01", "02", ...)
# In the OCR we saw 'o1', '02', '03', '04', '05', '06'
step_tokens = re.findall(r"\b0[1-9]\b|\bo[1-9]\b", txt, re.IGNORECASE)
print(f"Step-number-like tokens: {step_tokens}")

# ---------------------------------------------------------------
# E. Hero & Philosophy image variance — confirm real photos
# ---------------------------------------------------------------
print("\n" + "="*70)
print("E. HERO & PHILOSOPHY IMAGE VARIANCE")
print("="*70)
# Hero image — check different sub-regions
for label, (y0, y1) in [
    ("Hero top", (0, 280)),
    ("Hero main", (280, 560)),
    ("Hero bottom", (560, 800)),
    ("Philosophy area A (y=3600-4100)", (3600, 4100)),
    ("Philosophy area B (y=4100-4500)", (4100, 4500)),
    ("Philosophy area C (y=4500-5000)", (4500, 5000)),
    ("Philosophy area D (y=5000-5400)", (5000, 5400)),
]:
    if y1 > H:
        continue
    sub = arr[y0:y1]
    m = sub.reshape(-1, 3).mean(axis=0)
    s = sub.reshape(-1, 3).std(axis=0).mean()
    # also save crop
    crop = img.crop((0, y0, W, y1))
    crop.save(OUT / f"region-{label.replace(' ', '_').replace('(', '').replace(')', '').replace('-', '')}.png")
    print(f"  {label}: mean=({m[0]:.0f},{m[1]:.0f},{m[2]:.0f}) std={s:.1f}  {'PHOTO-LIKE' if s > 35 else 'flat/text'}")
