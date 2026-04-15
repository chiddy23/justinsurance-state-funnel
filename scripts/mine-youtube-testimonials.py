"""
Scan yt-dlp .info.json files, extract testimonial-quality comments, and emit
a TypeScript-ready block for dropping into src/lib/testimonials.ts.

Filters:
- Excludes comments by channel owner (author_is_uploader=True)
- Excludes short (<30 chars) or spammy comments
- Requires positive signal keywords (passed, pass, thanks, helped, passed first try, etc.)
- Tags state mentions (all 50 states + DC) when found in the comment text
"""
import json
import glob
import re
from pathlib import Path

COMMENT_DIR = Path("C:/Users/Chidd/AppData/Local/Temp/yt-comments")

# Positive signal keywords — comment must match at least one
POSITIVE_PATTERNS = [
    r"\bpass(ed|ing)?\b",
    r"\bthank(s| you)\b",
    r"\bhelped\b",
    r"\bappreciate\b",
    r"\bgreat (video|content|job|channel|teacher|explanation)\b",
    r"\bbest (video|channel|teacher|content|explanation|prep)\b",
    r"\bgot (my|the) (license|license approved)\b",
    r"\bgod bless\b",
    r"\blife saver\b",
    r"\bsaved me\b",
    r"\bmade (it )?(so )?(much )?(easier|simpler|clearer)\b",
    r"\bfinally (understand|get(ting)? it|makes sense)\b",
    r"\beasy to understand\b",
    r"\bclear(ly)?( explained)?\b",
    r"\bi owe you\b",
]

# Spam/noise keywords to filter out
NEGATIVE_PATTERNS = [
    r"subscribe",
    r"my channel",
    r"check out",
    r"click (here|the link)",
    r"promo code",
    r"^\s*(lol|lmao|wtf|nice|cool|good|ok|yes|no|thanks!?)\s*$",  # too short
]

STATES = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
    "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
    "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
    "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
    "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
    "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
    "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","Washington","West Virginia","Wisconsin","Wyoming","DC",
]

# Short state abbreviations we'll detect (case-insensitive word boundary)
STATE_ABBREV = {
    "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California",
    "CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia",
    "HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa",
    "KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland",
    "MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi",
    "MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire",
    "NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina",
    "ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania",
    "RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee",
    "TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington",
    "WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming",
}


def detect_state(text: str) -> str | None:
    lower = text.lower()
    for state in STATES:
        if re.search(r"\b" + re.escape(state.lower()) + r"\b", lower):
            return state
    # Match uppercase state abbrevs with word boundary
    for abbr, full in STATE_ABBREV.items():
        if re.search(r"\b" + abbr + r"\b", text):  # case-sensitive for abbrevs
            return full
    return None


def is_positive(text: str) -> bool:
    lower = text.lower()
    return any(re.search(p, lower) for p in POSITIVE_PATTERNS)


def is_spam(text: str) -> bool:
    lower = text.lower()
    return any(re.search(p, lower) for p in NEGATIVE_PATTERNS)


def clean_name_and_initials(raw: str, state: str | None) -> tuple[str, str]:
    """Turn a YouTube display name into a cleaner 'First L.' style label.
    Falls back to 'Student, [State]' if the handle is pure garbage.
    Returns (display_name, initials)."""
    if not raw:
        return (f"Student, {state}" if state else "Student"), "??"
    raw = raw.lstrip("@").strip()
    if not raw:
        return (f"Student, {state}" if state else "Student"), "??"

    # Strip known noise suffixes: -12345, _92, random trailing digit blocks
    raw = re.sub(r"[-_]?\d{2,}$", "", raw).strip()
    raw = re.sub(r"[-_]{2,}", " ", raw)

    # Split into word-parts (skip pure digits)
    parts = re.split(r"[\s_.\-]+", raw)
    parts = [p for p in parts if p and not p.isdigit()]
    def state_initials(s: str | None) -> str:
        if not s: return "JI"
        # Known two-letter state codes
        abbr = next((k for k,v in STATE_ABBREV.items() if v == s), None)
        return abbr if abbr else s[:2].upper()

    if not parts:
        return (f"Student, {state}" if state else "JustInsurance Student"), state_initials(state)

    # If a "word" has obvious camelCase or random letter mash, treat it as a handle
    def looks_like_name(s: str) -> bool:
        # Real names: mostly letters, 2-12 chars, not a random letter mash
        if not s.isalpha():
            return False
        if len(s) < 2 or len(s) > 14:
            return False
        # Reject strings with 5+ consonants in a row (indicates garbled handle)
        if re.search(r"[bcdfghjklmnpqrstvwxyz]{5,}", s.lower()):
            return False
        # Reject vowel-less names >4 chars
        if len(s) > 4 and not re.search(r"[aeiouy]", s.lower()):
            return False
        return True

    name_parts = [p for p in parts if looks_like_name(p)]

    if not name_parts:
        return (f"Student, {state}" if state else "JustInsurance Student"), state_initials(state)

    if len(name_parts) == 1:
        first = name_parts[0].capitalize()
        initials = first[0] + (first[1].upper() if len(first) > 1 else "")
        # If only a first name, keep it (no last initial)
        return first[:14], initials
    first = name_parts[0].capitalize()
    last_initial = name_parts[-1][0].upper() + "."
    return f"{first} {last_initial}", (first[0] + name_parts[-1][0].upper())


def main():
    candidates = []
    seen_texts = set()

    for fp in COMMENT_DIR.glob("*.info.json"):
        with open(fp, encoding="utf-8") as f:
            data = json.load(f)
        vid_id = data.get("id", "?")
        vid_title = data.get("title", "?")

        for c in data.get("comments") or []:
            if c.get("author_is_uploader"):
                continue  # skip channel owner
            text = (c.get("text") or "").strip()
            if not text or len(text) < 30 or len(text) > 500:
                continue
            if is_spam(text):
                continue
            if not is_positive(text):
                continue
            # Normalize to de-duplicate exact repeats
            norm = re.sub(r"\s+", " ", text.lower())[:150]
            if norm in seen_texts:
                continue
            seen_texts.add(norm)

            candidates.append({
                "text": text,
                "author": c.get("author", ""),
                "likes": c.get("like_count") or 0,
                "state": detect_state(text),
                "video_id": vid_id,
                "video_title": vid_title,
            })

    # Sort: state-specific first (higher value), then by likes
    candidates.sort(key=lambda c: (c["state"] is None, -c["likes"]))

    print(f"\n{'='*60}")
    print(f"FILTERED: {len(candidates)} candidate testimonials\n")

    state_count = sum(1 for c in candidates if c["state"])
    generic_count = len(candidates) - state_count
    print(f"  State-specific: {state_count}")
    print(f"  Generic praise: {generic_count}")
    print(f"{'='*60}\n")

    # Pick best 60: all state-specific first, then top-liked generic praise
    state_specific = [c for c in candidates if c["state"]]
    generic = [c for c in candidates if not c["state"]]
    picked = state_specific[:45] + generic[:20]

    ts_lines = []
    for c in picked:
        name, initials = clean_name_and_initials(c["author"], c["state"])
        # Clean text: drop emoji clutter at end, normalize whitespace
        text = c["text"]
        text = re.sub(r"[\u2600-\u27BF\U0001F300-\U0001FAFF]+", "", text)  # strip emoji
        text = re.sub(r"\s+", " ", text).strip()
        text = re.sub(r"[!]{2,}", "!", text)
        # Drop hashtag trailers like "#7/11"
        text = re.sub(r"\s#\w+(/\w+)?$", "", text).strip()
        # Escape for TS string
        text_escaped = text.replace("\\", "\\\\").replace('"', '\\"')

        # Don't over-clean — real typos/casual tone are credibility signals
        lines = ["  {"]
        lines.append(f'    name: "{name}",')
        lines.append(f'    initials: "{initials}",')
        lines.append(f'    source: "youtube",')
        if c["state"]:
            lines.append(f'    state: "{c["state"]}",')
        lines.append(f'    text: "{text_escaped}",')
        lines.append(f'    videoId: "{c["video_id"]}",')
        lines.append("  },")
        ts_lines.append("\n".join(lines))

    output = "\n".join(ts_lines)
    out_path = Path("C:/Users/Chidd/Downloads/youtube-testimonials-mined.txt")
    out_path.write_text(output, encoding="utf-8")
    print(f"\nWrote TS-ready block to: {out_path}")
    print(f"\nFirst 3 candidates preview:\n")
    for c in picked[:3]:
        n, _ = clean_name_and_initials(c["author"], c["state"])
        print(f"  [{c['state'] or 'generic'}] {n}: {c['text'][:100]}...")


if __name__ == "__main__":
    main()
