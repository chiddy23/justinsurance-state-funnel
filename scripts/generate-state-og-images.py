"""
Generate per-state Open Graph images (1200x630 PNG) for justinsuranceco.com.

Output: public/og/<slug>.png  (50 files, one per state)

Brand kept consistent with public/og-image.png:
  - Navy gradient background  (#1a3868 -> #102342)
  - 10px gold accent bar at top  (#f5a623 — matches existing OG, close to spec #f5b800)
  - White headline typography, gold pill for tagline accent, white trust strip
  - "JustInsurance" wordmark + "justinsuranceco.com" small text bottom

State name uses bold sans-serif typography (Arial Black/Bold) at ~120pt with
auto-shrink for very long names (e.g. "Massachusetts", "New Hampshire").

Run:
    python scripts/generate-state-og-images.py

Dependencies: Pillow >= 9.0
"""
from __future__ import annotations

import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

WIDTH, HEIGHT = 1200, 630

# Brand colors
GOLD = (245, 166, 35)           # #f5a623 — matches existing /og-image.png
GOLD_DARK = (210, 140, 20)
NAVY_TOP = (26, 56, 104)        # #1a3868
NAVY_BOTTOM = (16, 35, 66)      # #102342
WHITE = (255, 255, 255)
LIGHT_BLUE = (190, 210, 240)    # tagline secondary text

# Layout
GOLD_BAR_HEIGHT = 10

# Fonts (Windows system fonts; both bold sans-serif). Falls back to default.
FONT_BOLD_PATH = "C:/Windows/Fonts/arialbd.ttf"
FONT_REGULAR_PATH = "C:/Windows/Fonts/arial.ttf"
FONT_BLACK_PATH = "C:/Windows/Fonts/seguibl.ttf"   # Segoe UI Black — heavier display weight

# 50 US states (slug -> display name). Mirrors src/lib/states.ts.
STATES = [
    ("alabama", "Alabama"),
    ("alaska", "Alaska"),
    ("arizona", "Arizona"),
    ("arkansas", "Arkansas"),
    ("california", "California"),
    ("colorado", "Colorado"),
    ("connecticut", "Connecticut"),
    ("delaware", "Delaware"),
    ("florida", "Florida"),
    ("georgia", "Georgia"),
    ("hawaii", "Hawaii"),
    ("idaho", "Idaho"),
    ("illinois", "Illinois"),
    ("indiana", "Indiana"),
    ("iowa", "Iowa"),
    ("kansas", "Kansas"),
    ("kentucky", "Kentucky"),
    ("louisiana", "Louisiana"),
    ("maine", "Maine"),
    ("maryland", "Maryland"),
    ("massachusetts", "Massachusetts"),
    ("michigan", "Michigan"),
    ("minnesota", "Minnesota"),
    ("mississippi", "Mississippi"),
    ("missouri", "Missouri"),
    ("montana", "Montana"),
    ("nebraska", "Nebraska"),
    ("nevada", "Nevada"),
    ("new-hampshire", "New Hampshire"),
    ("new-jersey", "New Jersey"),
    ("new-mexico", "New Mexico"),
    ("new-york", "New York"),
    ("north-carolina", "North Carolina"),
    ("north-dakota", "North Dakota"),
    ("ohio", "Ohio"),
    ("oklahoma", "Oklahoma"),
    ("oregon", "Oregon"),
    ("pennsylvania", "Pennsylvania"),
    ("rhode-island", "Rhode Island"),
    ("south-carolina", "South Carolina"),
    ("south-dakota", "South Dakota"),
    ("tennessee", "Tennessee"),
    ("texas", "Texas"),
    ("utah", "Utah"),
    ("vermont", "Vermont"),
    ("virginia", "Virginia"),
    ("washington", "Washington"),
    ("west-virginia", "West Virginia"),
    ("wisconsin", "Wisconsin"),
    ("wyoming", "Wyoming"),
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def make_gradient_background() -> Image.Image:
    """Vertical navy gradient, slightly lighter at top."""
    img = Image.new("RGB", (WIDTH, HEIGHT), NAVY_BOTTOM)
    px = img.load()
    for y in range(HEIGHT):
        t = y / (HEIGHT - 1)
        r = round(NAVY_TOP[0] * (1 - t) + NAVY_BOTTOM[0] * t)
        g = round(NAVY_TOP[1] * (1 - t) + NAVY_BOTTOM[1] * t)
        b = round(NAVY_TOP[2] * (1 - t) + NAVY_BOTTOM[2] * t)
        for x in range(WIDTH):
            px[x, y] = (r, g, b)
    return img


def draw_gold_bar(draw: ImageDraw.ImageDraw) -> None:
    draw.rectangle([(0, 0), (WIDTH, GOLD_BAR_HEIGHT)], fill=GOLD)


def load_font(path: str, size: int) -> ImageFont.FreeTypeFont:
    if os.path.exists(path):
        return ImageFont.truetype(path, size)
    # Fallback: PIL bundled DejaVu (always present)
    return ImageFont.truetype("DejaVuSans-Bold.ttf", size)


def text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> tuple[int, int]:
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def fit_font(
    draw: ImageDraw.ImageDraw,
    text: str,
    path: str,
    max_size: int,
    min_size: int,
    max_width: int,
) -> ImageFont.FreeTypeFont:
    """Binary-search a font size that keeps text within max_width."""
    lo, hi = min_size, max_size
    best = load_font(path, min_size)
    while lo <= hi:
        mid = (lo + hi) // 2
        f = load_font(path, mid)
        w, _ = text_size(draw, text, f)
        if w <= max_width:
            best = f
            lo = mid + 1
        else:
            hi = mid - 1
    return best


def draw_centered(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont,
    y: int,
    color: tuple[int, int, int],
) -> None:
    w, _ = text_size(draw, text, font)
    draw.text(((WIDTH - w) // 2, y), text, font=font, fill=color)


def draw_pill(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont,
    cy: int,
    fg: tuple[int, int, int],
    bg: tuple[int, int, int],
    pad_x: int = 32,
    pad_y: int = 14,
) -> None:
    # Use the actual glyph bbox (with offset) so we can vertically center via the
    # font's true ascent/descent. textbbox returns (l, t, r, b) where (l, t) is
    # the offset of the first glyph relative to the anchor.
    bbox = draw.textbbox((0, 0), text, font=font)
    glyph_w = bbox[2] - bbox[0]
    glyph_h = bbox[3] - bbox[1]
    pill_w = glyph_w + pad_x * 2
    pill_h = glyph_h + pad_y * 2
    x0 = (WIDTH - pill_w) // 2
    y0 = cy - pill_h // 2
    radius = pill_h // 2
    draw.rounded_rectangle(
        [(x0, y0), (x0 + pill_w, y0 + pill_h)],
        radius=radius,
        fill=bg,
    )
    # Compensate for the font's top offset (bbox[1]) so the visible glyphs sit
    # squarely inside the pill instead of dropping below the baseline.
    draw.text(
        (x0 + pad_x - bbox[0], y0 + pad_y - bbox[1]),
        text,
        font=font,
        fill=fg,
    )


# ---------------------------------------------------------------------------
# Per-state composer
# ---------------------------------------------------------------------------

def compose_og(state_name: str) -> Image.Image:
    img = make_gradient_background()
    draw = ImageDraw.Draw(img)

    # Top gold accent bar
    draw_gold_bar(draw)

    # Subtle decorative diagonal accent in the lower-left and upper-right corners
    # (small gold rectangles for design polish without overlapping text).
    accent = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    adraw = ImageDraw.Draw(accent)
    # Soft gold radial-ish glow approximated with two faint translucent rectangles
    adraw.ellipse([(-300, -300), (300, 300)], fill=(245, 166, 35, 20))
    adraw.ellipse([(WIDTH - 300, HEIGHT - 300), (WIDTH + 300, HEIGHT + 300)], fill=(245, 166, 35, 20))
    img = Image.alpha_composite(img.convert("RGBA"), accent).convert("RGB")
    draw = ImageDraw.Draw(img)
    draw_gold_bar(draw)  # ensure gold bar still crisp

    # Eyebrow label (gold uppercase) — small, above the headline
    eyebrow_font = load_font(FONT_BOLD_PATH, 32)
    eyebrow_text = "INSURANCE LICENSE COURSE"
    draw_centered(draw, eyebrow_text, eyebrow_font, y=85, color=GOLD)

    # Thin gold separator under eyebrow
    bar_y = 140
    draw.rectangle([(WIDTH // 2 - 50, bar_y), (WIDTH // 2 + 50, bar_y + 4)], fill=GOLD)

    # Headline: state name (auto-shrink up to 140pt).
    headline_font = fit_font(draw, state_name, FONT_BLACK_PATH, 140, 80, WIDTH - 120)
    h_bbox = draw.textbbox((0, 0), state_name, font=headline_font)
    hw = h_bbox[2] - h_bbox[0]
    headline_y = 200
    draw.text(((WIDTH - hw) // 2 - h_bbox[0], headline_y - h_bbox[1]), state_name, font=headline_font, fill=WHITE)
    # Bottom edge of actually-rendered headline glyphs (in image coords)
    headline_bottom = headline_y - h_bbox[1] + h_bbox[3]

    # Sub-tagline below headline — placed below the real headline glyph bottom
    sub_font = load_font(FONT_BOLD_PATH, 40)
    sub_text = "Online Prelicensing & Practice Exam"
    sub_y = headline_bottom + 30
    draw_centered(draw, sub_text, sub_font, y=sub_y, color=LIGHT_BLUE)

    # Trust strip — three values separated by gold dots
    trust_font = load_font(FONT_BOLD_PATH, 30)
    trust_items = ["$199", "93% Pass Rate", "Pass Guarantee"]
    sep = "   ·   "  # middle-dot
    trust_text = sep.join(trust_items)
    tw, th = text_size(draw, trust_text, trust_font)
    trust_y = HEIGHT - 160
    tx = (WIDTH - tw) // 2
    draw.text((tx, trust_y), trust_text, font=trust_font, fill=WHITE)
    # Color the dots gold
    cur_x = tx
    for i, item in enumerate(trust_items):
        iw, _ = text_size(draw, item, trust_font)
        cur_x += iw
        if i < len(trust_items) - 1:
            sw, _ = text_size(draw, sep, trust_font)
            dot_x = cur_x + (sw // 2) - 4
            draw.text((dot_x, trust_y), "·", font=trust_font, fill=GOLD)
            cur_x += sw

    # Bottom: gold pill with wordmark + url underneath
    wordmark_font = load_font(FONT_BLACK_PATH, 36)
    draw_pill(
        draw,
        "JustInsurance",
        wordmark_font,
        cy=HEIGHT - 78,
        fg=NAVY_BOTTOM,
        bg=GOLD,
        pad_x=32,
        pad_y=10,
    )
    url_font = load_font(FONT_BOLD_PATH, 22)
    draw_centered(draw, "justinsuranceco.com", url_font, y=HEIGHT - 32, color=LIGHT_BLUE)

    return img


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    out_dir = Path(__file__).resolve().parent.parent / "public" / "og"
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Generating {len(STATES)} OG images -> {out_dir}")
    for slug, name in STATES:
        img = compose_og(name)
        path = out_dir / f"{slug}.png"
        # optimize=True shrinks PNG palette; PNG is already lossless.
        img.save(path, format="PNG", optimize=True)
        size_kb = path.stat().st_size / 1024
        print(f"  {slug:<18} {name:<18} -> {path.name} ({size_kb:.1f} KB)")

    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
