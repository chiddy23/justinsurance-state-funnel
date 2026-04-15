# YouTube Comments Intake — Drop Real Reviews Here

**File to edit:** `src/lib/testimonials.ts`
**Section:** `YOUTUBE_COMMENTS` array (around line 70)

## How to add a YouTube comment

For each comment you want on the site, add this block to the `YOUTUBE_COMMENTS` array in `src/lib/testimonials.ts`:

```ts
{
  name: "Sarah M.",                  // First name + last initial (privacy)
  initials: "SM",                    // 2 letters for the avatar circle
  source: "youtube",                 // Always "youtube" for this section
  state: "Florida",                  // OMIT this line if comment is generic / no state mentioned
  licenseType: "2-15",               // Optional: Life, Health, Life & Health, P&C, 2-15, etc.
  text: "passed my florida exam first try thanks to your videos!! best study material on youtube",
},
```

## Bucketing rules (per the playbook)

### Bucket 1: State-specific comments → set the `state` field

If the commenter says "passed my Florida exam" or "got my Texas license", set `state: "Florida"` or `state: "Texas"`. The site auto-routes these to:
- The matching state hub page (`/florida`, `/texas`, etc.)
- The matching state prelicensing pages
- The /reviews page with state attribution

### Bucket 2: Generic praise → omit the `state` field

If the commenter says "this course helped me pass" or "best insurance study material" without naming a state, omit `state`. These appear in the general rotation pool on /reviews and as filler on state pages when state-specific options run out.

## Naming conventions

- **First name + last initial** (Sarah M., Marcus T.) — protects YouTube commenter privacy while preserving credibility
- If a YouTube handle is the only identifier, use first 2 chars + appropriate format (e.g., "@johnsmith94" → "John S.")
- Avoid full last names unless the commenter has explicitly used theirs

## What NOT to do

- ❌ Don't fix typos or awkward grammar — they're credibility signals. "passed my florida exam first try thanks to your videos!!" reads as real. "I successfully passed the Florida licensing examination on my initial attempt" reads as fake.
- ❌ Don't paraphrase. Quote verbatim, even if the comment is short.
- ❌ Don't invent comments. Every entry must be traceable to a real YouTube comment we can pull up if asked.

## Automatic effects when you add comments

- `/reviews` page total count updates automatically (currently shows 18 → will show 18 + whatever you add)
- Schema `reviewCount` updates automatically — Google sees the new count without any deploy beyond the file change
- State hub pages start surfacing state-specific YouTube comments above generic placeholders
- Build picks up changes — push to git, Vercel auto-deploys

## Suggested first batch

Per the playbook, the highest-ROI first batch is:
- 5–10 comments mentioning **Florida** (highest-volume state for us)
- 5 comments mentioning **Texas** (second-highest)
- 3–5 each for **California, New York, Georgia, Ohio, Illinois, Pennsylvania**
- 10–15 generic "passed first try" comments without state

Even 30 real YouTube comments transforms `/reviews` from "18 testimonials" to "48 testimonials with verified social proof" — and the schema reviewCount comes alive.

## After you add them

The Trustpilot follow-up step (per the playbook): reply to those same commenters on YouTube and ask them to drop the same feedback on Trustpilot. Use a script like:

> Hey [name], so glad we helped you pass! Would you mind dropping this same feedback on our Trustpilot page? It helps other students find us. Here's the link: [your Trustpilot URL]

Even a 10% conversion rate on 30 comments = 3 real Trustpilot reviews from day one.

---

*Template ready. Drop comments into `src/lib/testimonials.ts` whenever you have them — no code changes needed beyond that file.*
