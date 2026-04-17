# Comparative Content SOP

**Owner:** JustInsurance editorial / SEO team
**Last reviewed:** 2026-04-17
**Next reverification due:** 2026-07-17 (quarterly)

This SOP governs any page or post on justinsuranceco.com that names a competitor (XCEL Solutions, ExamFX, Kaplan, AD Banker, Aceable, WebCE, etc.) and makes a comparative claim about pricing, pass rates, guarantees, refund policies, package contents, support hours, or features.

---

## Why this matters

Comparative-advertising claims that are literally false (or true-but-misleading) expose JustInsurance to **Lanham Act §43(a)** false-advertising liability, plus state UDAP and tortious-interference claims. Per-se literal-falsity doesn't require proof of consumer confusion — only that the claim is verifiably untrue against the competitor's published terms.

Risk categories:

- **Per-se false** — claim is contradicted by competitor's own published page (e.g., "X does not disclose methodology" when X's page literally discloses methodology). **No safe harbor**.
- **Materially misleading** — technically true but framed in a way that creates a false impression. Defensible but expensive to litigate.
- **Editorial generalization** — "most adults can't…", "often impossible…" etc. Protected as opinion only when the underlying factual basis is reasonable. Avoid.
- **Defensible factual comparison** — direct citation to competitor's published policy with a verifiable link. **Safe harbor**.

---

## Required for every comparative claim

1. **Cite the competitor's specific source page** (URL, not just brand name). Example: "Per [examfx.com/pass-guarantee](https://www.examfx.com/pass-guarantee)..."
2. **Quote-or-paraphrase competitor language directly** rather than characterizing it. "X publishes Y" beats "X claims Y but doesn't really mean it."
3. **Date-stamp the verification.** Add "as of YYYY-MM-DD" in disclaimers and footers.
4. **Reciprocal scrutiny.** If you're flagging a competitor's restriction as a weakness, verify JustInsurance doesn't have the same restriction. (Example: don't flag "first-attempt-only guarantee" as a competitor weakness when our own guarantee is also first-attempt-only.)
5. **Avoid editorial generalizations.** Replace "most candidates can't…" with the underlying fact ("Pearson VUE testing centers often book 1–2 weeks in advance").
6. **Tell readers to verify themselves.** Include a "verify current terms at [domain] before purchase" line in every comparative section.

---

## Quarterly reverification checklist

Run this every 90 days. Update the "Last reviewed" date at the top of this file when complete.

### 1. Pass-rate methodology

For each named competitor:
- Visit their pass-rate page(s) with cleared cache.
- Confirm the published numbers match what we cite.
- Confirm the disclosed methodology (sample size, survey period, inclusion criteria) matches what we cite.

**Current verifications (April 17, 2026):**
- ExamFX: [examfx.com/resources/candidates](https://www.examfx.com/resources/candidates) — 95% Life, 94% L&H, 90% Health, 99% P&C, 95% Personal Lines, 93% Overall Combined; 2,826 self-reported respondents Feb 1 – Oct 17, 2025.
- ExamFX: [examfx.com/insurance](https://www.examfx.com/insurance) — 93% Overall Pass Rate (no methodology footnote on this page; full disclosure on /resources/candidates).
- XCEL Solutions: No specific pass rate published with methodology on public product pages (markets "top industry pass rates" generically).

### 2. Pass guarantee terms

- ExamFX: [examfx.com/pass-guarantee](https://www.examfx.com/pass-guarantee). Verify: 80% Readiness Exam threshold, 3-calendar-day window, first-attempt-only, exclusions for company-paid packages / renewals / shipping.
- XCEL: Refund/guarantee terms not prominently published on product pages. Verify nothing has changed.

### 3. Refund policy

- ExamFX: [examfx.com/refund-policy](https://www.examfx.com/refund-policy). Verify: 48-hour window for insurance courses, non-refundable extensions/add-ons, physical materials return policies.

### 4. Course extensions

- ExamFX: 30-day or 60-day paid extensions per their FAQ. Verify pricing and durations.

### 5. Package tiers

- ExamFX: Self-Study, Video Study, Live Online, Live In-Person. Verify the four tiers still exist and feature inclusions haven't shifted dramatically.
- XCEL: 3-part program (prelicensing course, prep review course, exam simulator). Verify structure.

### 6. Acceptance grep

Run from project root:
```bash
grep -rn "no methodology\|without disclosing\|does not disclose methodology\|impossible to schedule\|most candidates can't" src/content/blog src/app/compare src/lib/comparison-data.ts
```
Expected output: **zero hits**. If any appear, they're either factually accurate residual claims (verify) or new exposures (fix immediately).

---

## Surfaces governed by this SOP

| Surface | File path |
|---|---|
| /compare hub | [src/app/compare/page.tsx](../src/app/compare/page.tsx) |
| /compare/examfx and /compare/xcel | [src/app/compare/[competitor]/page.tsx](../src/app/compare/%5Bcompetitor%5D/page.tsx) |
| Comparison data source | [src/lib/comparison-data.ts](../src/lib/comparison-data.ts) |
| FL provider comparison post | [src/content/blog/florida-insurance-license/best-florida-insurance-prelicensing-courses-2026.md](../src/content/blog/florida-insurance-license/best-florida-insurance-prelicensing-courses-2026.md) |

If new comparison content is added (e.g., `/compare/adbanker` or a TX/CA equivalent of the FL post), add the path here.

---

## When an external audit flags a claim

1. **Verify the audit's source citation independently** before applying any fix. External audits sometimes confuse different competitor pages (e.g., insurance vs. securities methodology) — implementing a "fix" based on a wrong premise creates a NEW false statement on our side.
2. **Apply P0 fixes (literal falsity) immediately.** P1 (misleading framing) and P2 (accuracy polish) can batch.
3. **Update this SOP's "Last reviewed" date** and the verification snapshots in section 1–5 above with the new findings.

---

## Lessons learned

- ExamFX publishes methodology on `/resources/candidates`, NOT on `/insurance` or the homepage. Audit tools that scan only the landing page will incorrectly conclude no methodology exists. Always check the dedicated candidate-resources page.
- ExamFX's "85%+ program completion / 80%+ on final exams" inclusion criterion applies to **securities** courses, not insurance. Don't conflate.
- "First-attempt-only" guarantees are industry-standard. Calling out a competitor for this restriction when JustInsurance has the same restriction is reciprocal-scrutiny failure.
