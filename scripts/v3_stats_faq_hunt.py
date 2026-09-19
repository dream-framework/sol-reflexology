"""
v3 stats-section hunt + FAQ expand-state verification.
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
# 1. Full-page OCR sweep to locate Stats strip & FAQ section
# ---------------------------------------------------------------
print("="*70)
print("FULL-PAGE OCR SWEEP (200px windows)")
print("="*70)
for y0 in range(0, H, 200):
    y1 = min(H, y0 + 200)
    crop = img.crop((0, y0, W, y1))
    w, h = crop.size
    big = crop.resize((w * 2, h * 2), Image.LANCZOS)
    txt = pytesseract.image_to_string(big, config="--psm 11")
    # Look for marker tokens
    low = txt.lower()
    hits = []
    for m in ["faq", "question", "frequent", "asked", "stats", "rated",
              "reviews", "clients", "sessions", "years", "22k", "k+",
              "4.9", "rating", "trusted"]:
        if m in low:
            hits.append(m)
    if hits:
        print(f"y={y0:5d}-{y1:5d}  hits={hits}")
        # print the relevant lines
        for line in txt.splitlines():
            s = line.strip()
            if s:
                print(f"     {s!r}")

# ---------------------------------------------------------------
# 2. Targeted Stats strip hunt — look between hero and booking
#    y=600-1500 likely candidates
# ---------------------------------------------------------------
print("\n" + "="*70)
print("STATS-STRIP HUNT (y=600-1500, full-width OCR)")
print("="*70)
for y0 in range(600, 1500, 100):
    y1 = y0 + 100
    crop = img.crop((0, y0, W, y1))
    w, h = crop.size
    big = crop.resize((w * 3, h * 3), Image.LANCZOS)
    txt = pytesseract.image_to_string(big, config="--psm 11")
    print(f"\n--- y={y0}-{y1} ---")
    for line in txt.splitlines():
        s = line.strip()
        if s:
            print(f"   {s!r}")

# Save a wide crop of the suspected stats area
stats_suspect = img.crop((0, 700, W, 1300))
stats_suspect.save(OUT / "stats-suspect-y700-y1300.png")

# Also try OCR with inverted image (text may be light on dark)
big_inv = ImageOps.invert(stats_suspect.convert("L"))
big_inv = big_inv.resize((W * 3, 600 * 3), Image.LANCZOS)
txt = pytesseract.image_to_string(big_inv, config="--psm 11")
print("\n--- STATS SUSPECT y=700-1300 (inverted, psm11) ---")
for line in txt.splitlines():
    s = line.strip()
    if s:
        print(f"   {s!r}")

# Try psm 6 (uniform block)
txt6 = pytesseract.image_to_string(stats_suspect.resize((W * 3, 600 * 3), Image.LANCZOS), config="--psm 6")
print("\n--- STATS SUSPECT y=700-1300 (psm6) ---")
for line in txt6.splitlines():
    s = line.strip()
    if s:
        print(f"   {s!r}")

# ---------------------------------------------------------------
# 3. FAQ section expand-state check.
#    We saw at y=6270-6520 the questions all end with "+".
#    A "+" at the end of a question usually means "collapsed".
#    The first item should be EXPANDED (no "+", answer visible).
#    Save the FAQ region crop & OCR with finer detail.
# ---------------------------------------------------------------
print("\n" + "="*70)
print("FAQ EXPAND-STATE CHECK (y=5500-6600)")
print("="*70)
faq_full = img.crop((0, 5500, W, 6600))
faq_full.save(OUT / "faq-full-v3.png")
w, h = faq_full.size
big = faq_full.resize((w * 2, h * 2), Image.LANCZOS)
txt = pytesseract.image_to_string(big, config="--psm 6")
print("--- FAQ psm6 ---")
for line in txt.splitlines():
    s = line.strip()
    if s:
        print(f"   {s!r}")

# Also psm 11
txt11 = pytesseract.image_to_string(big, config="--psm 11")
print("\n--- FAQ psm11 ---")
for line in txt11.splitlines():
    s = line.strip()
    if s:
        print(f"   {s!r}")

# ---------------------------------------------------------------
# 4. Section-by-section overview crop generation
#    Save 800px-wide labeled vertical slices for parent agent
#    to inspect visually.
# ---------------------------------------------------------------
print("\n" + "="*70)
print("SAVING SECTION CROPS")
print("="*70)
section_crops = [
    ("01-hero",          0,    1000),
    ("02-hero-stats",    1000, 1320),  # the dark band between hero & booking
    ("03-booking",       1320, 3040),
    ("04-philosophy",    3040, 3600),
    ("05-philosophy2",   3600, 5080),
    ("06-transition",    5080, 5720),
    ("07-faq",           5720, 6520),
    ("08-void1",         6520, 6840),
    ("09-visit-studio",  6840, 7400),
    ("10-contact",       7400, 7640),
    ("11-void2",         7640, 7920),
    ("12-footer-top",    7920, 8160),
    ("13-footer-body",   8160, 8791),
]
for name, y0, y1 in section_crops:
    if y1 > H: y1 = H
    crop = img.crop((0, y0, W, y1))
    # Downscale to 720px wide for easy review
    w, h = crop.size
    nh = int(h * 720 / w)
    crop = crop.resize((720, nh), Image.LANCZOS)
    crop.save(OUT / f"section-{name}.png")
    print(f"  saved section-{name}.png  ({720}x{nh}, orig y={y0}-{y1})")
