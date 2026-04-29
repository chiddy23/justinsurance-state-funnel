# P&C CE Build Report

**Status:** Live in production. Site at 1311 static pages.

**Latest commits (most recent first):**
- `75bb403` — FL P&C CE: restructure 4 packages to 24-hour exact-match per Fla. Stat. §626.2815
- `d9f1a39` — P&C CE post-audit fix sprint: FAQ accuracy + routes + module consolidation
- `a693285` — P&C national hub: standardize on "25 states" — drop confusing 31 count
- `4bb8e4d` — P&C CE national hub: disambiguate hero state-count phrasing
- `cb1719b` — P&C CE product line: 31 packages, 25 states, 34 new pages

---

## Architecture

| Layer | Path | Owns |
|---|---|---|
| Data | `src/data/pc-ce-packages.ts` | 31 packages × 25 states; per-state `StateRequirement` lookup; pricing rule (matches L&H by state) |
| Route — single-package state | `src/app/[state]/continuing-education/property-and-casualty/page.tsx` | 25 state hubs; for FL/MA renders multi-package landing |
| Route — multi-package detail | `src/app/[state]/continuing-education/property-and-casualty/[package]/page.tsx` | 8 detail pages (FL ×6, MA ×2). Re-uses `PCPackageDetail` + `buildPCFAQs` from parent |
| National hub | `src/app/property-and-casualty-ce/page.tsx` | 25-state coverage grid + 25-state Coming Soon + WebPage + EducationalOccupationalCredential |
| Sitemap | `src/app/sitemap.ts` | 34 P&C URLs auto-included |
| Footer | `src/components/Footer.tsx` | "Property & Casualty CE" link |
| Cross-linking | State hub `[state]/page.tsx`, L&H CE `[state]/continuing-education/page.tsx` | 3-card layout + cross-link tile, both slug-conditional on PC_STATE_SLUGS |

---

## Package coverage

**31 packages across 25 states.** All Active. Pricing per state (matches L&H CE).

| State group | Count | Pricing |
|---|---|---|
| Standard 24-hour states (CA, FL, IL, KS, MA, ME, MT, NC, NE, NH, NJ, NM, OH, RI, TN, TX, VA, VT, WI, WV, WY, ID, IA) | 23 single-package + multi | $39 |
| AK | 1 | $75 (matches AK L&H premium) |
| AZ (48-hour 4-yr cycle) | 1 | $111 (matches AZ L&H 48-hour) |

**Multi-package states:**
- **FL** — 6 packages (20-Hour Advanced, 20-Hour Basic, Commercial Lines, Commercial+Flood, Personal Lines, Personal Lines+Flood). All 24-hour packages exact-match Fla. Stat. §626.2815. 20-hour packages serve the post-6-years 20-hour requirement.
- **MA** — 2 tiers (45-hour, 60-hour) for the standard vs extended renewal-cycle requirement.

---

## Schema audit — verified emitting per page type

| Page type | Schemas emitted | Status |
|---|---|---|
| National hub `/property-and-casualty-ce/` | WebPage + EducationalOccupationalCredential + BreadcrumbList + FAQPage + Article (with Person reviewer) + Organization | ✅ |
| State P&C hub `/[state]/continuing-education/property-and-casualty/` (single-package) | Course + CourseInstance + Offer + BreadcrumbList + FAQPage + Article + Person + Organization | ✅ |
| State P&C hub (multi-package landing — FL, MA) | BreadcrumbList + FAQPage + Article + Person (Course intentionally omitted; per-package routes carry it) | ✅ |
| Multi-package detail `/[state]/.../[package]/` | Course + CourseInstance + Offer + BreadcrumbList + FAQPage + Article + Person + Organization | ✅ |
| AggregateRating anywhere | Not emitted (no real review data; synthesized review schema is a Google policy violation) | ✅ |

---

## State requirement verification status

`StateRequirement` data lives in `PC_STATE_REQUIREMENTS` lookup table. Each package carries a `stateRequirement` field used by `buildPCFAQs` to surface state-truth (NOT package hours) in the "How many CE hours does [State] require?" FAQ.

### ✅ All 25 states verified (DOI worker completed 2026-04-29)

| State | Hours | Ethics | Cycle | Citation | Carryover |
|---|---|---|---|---|---|
| AK | 24 | 3 | 2 yrs | AS 21.27.020(f) | — |
| AZ | 48 | 3 | 4 yrs | A.R.S. §20-2904 | — |
| CA | 24 | 3 + 1 anti-fraud | 2 yrs | Cal. Ins. Code §1749.3 | — |
| FL | 20 (24 first 6 yrs) | 4 (L&E Update) | 2 yrs | Fla. Stat. §626.2815 | 24 |
| IA | 36 | 3 | 3 yrs | Iowa Code §522B.11 | — |
| ID | 24 | 3 | 2 yrs | Idaho Code §41-1013 | — |
| IL | 24 | 3 | 2 yrs | 215 ILCS 5/500-135 | — |
| KS | 18 | 3 | 2 yrs | K.S.A. 40-4903 | — |
| MA | 45 (60 extended) | 3 | 3 yrs | 211 CMR 81.00 | — |
| ME | 24 | 3 | 2 yrs | 24-A M.R.S. §1482 | — |
| MT | 24 | 3 + 1 MT Law | 2 yrs | Mont. Code Ann. §33-17-1204 | — |
| NC | 24 | 3 | 2 yrs | N.C. Gen. Stat. §58-33-130 | — |
| NE | 24 | 3 | 2 yrs | Neb. Rev. Stat. §§44-3901 to 44-3908 | — |
| NH | 24 | 3 | 2 yrs | N.H. Admin. Code Ins 1300 | — |
| NJ | 24 | 3 | 2 yrs | N.J.S.A. 17:22A-32 | — |
| NM | 24 | 3 | 2 yrs | N.M.S.A. §59A-12-19 | — |
| OH | 24 | 3 | 2 yrs | Ohio Rev. Code §3905.481 | — |
| RI | 24 | 3 | 2 yrs | 230-RICR-20-50-2 (Insurance Regulation 40) | 12 |
| TN | 24 | 3 | 2 yrs | Tenn. Code Ann. §56-6-104 | — |
| TX | 24 | 3 | 2 yrs | Tex. Ins. Code §4004.051 | — |
| VA | 16 | 3 | 2 yrs | Va. Code §38.2-1868.1 | — |
| VT | 24 | 3 | 2 yrs | 8 V.S.A. §4800a | — |
| WI | 24 | 3 | 2 yrs | Wis. Stat. §628.04(3) | — |
| WV | 24 | 3 | 2 yrs | W. Va. Code §33-12-8 | 6 |
| WY | 24 | 3 | 2 yrs | Wyo. Stat. §26-9-231 | — |

**0 states remain on `requiresVerification: true`.** Every P&C package page now emits an authoritative statute citation in the FAQ — strongest possible E-E-A-T signal for YMYL ranking.

**Bonus discovery during verification:** Rhode Island and West Virginia have CE carryforward provisions (12 hours and 6 hours respectively) that weren't in the original data. Now surfaced in their per-state FAQ output.

---

## Open stakeholder action items

### A1 — Pricing review
All 24/26-hour states uniformly $39 (matches L&H baseline). AK $75, AZ $111 priced to L&H equivalents. Market rates for P&C CE typically run $49-79.

**Recommendation:** Tier by package complexity — keep standard 24-hour states at $39 (price-leader anchor), bump FL specialty packages and MA 60-hour to $49 (~25% margin lift on highest-effort SKUs without losing the price-leadership position on standard).

### A2 — Absorb vanity domain
"Enroll Now" links currently land on `yourinsurancelicense.myabsorb.com` (legacy brand domain). Configure Absorb LMS custom domain (e.g., `learn.justinsuranceco.com`) to fix the URL-bar brand mismatch. Requires:
1. Absorb admin → set custom domain in LMS portal settings
2. DNS → CNAME pointing the chosen subdomain at Absorb's CNAME target
3. Code change post-DNS → swap subdomain in cart-link template (single config variable). Cart UUIDs do NOT change.

### A3 — MA tier rules
Document which producer categories require the 45-hour vs 60-hour MA tier. Add to MA P&C state hub copy.

### A4 — GSC sitemap resubmit
After this build, resubmit `https://justinsuranceco.com/sitemap.xml` in GSC → Sitemaps to nudge a recrawl of the 34 P&C URLs (now 36 with the FL renames; old slugs `homeowners-flood` and `personal-auto` 301-redirect to `personal-lines-flood` and `commercial-flood` respectively).

### A5 — 90-day GSC ranking monitor
Schedule a check ~90 days from initial deploy (cb1719b on 2026-04-29) to read GSC → Performance → Pages filtered to:
- `/property-and-casualty-ce/`
- `/[state]/continuing-education/property-and-casualty/`

If impressions plateau while internal-link count stays high, that's the footprint-detection signal. If position improves and traffic compounds, hub-and-spoke architecture is working.

---

## Verification log (V1/V2/V3 from PC_CE_REMAINING_WORK.md)

**V1 — FL Personal Lines "28 hours" state-requirement bug:** ✅ 0 instances of "28 hours" anywhere on the page (package now 24 hours after `75bb403`, so even legitimate package descriptions don't reference 28).

**V2 — FAQ propagation across all 6 FL multi-packages:** ✅ All 6 emit "Florida requires" FAQ exactly once (20-hour-advanced, 20-hour-basic, commercial-lines, commercial-flood, personal-lines, personal-lines-flood).

**V3 — Schema validation:** ✅ All 4 sampled URLs emit the full required schema set per page type (see Schema audit section above). No AggregateRating anywhere.

---

## YMYL accuracy notes

- **No invented state CE rules.** 15 states have verified statute citations; 10 states use hedge language pending verification.
- **No synthesized review schema.** AggregateRating is not emitted. Will be re-enabled only when a real third-party review feed (Trustpilot, Google reviews via API) is integrated.
- **Cart UUIDs case-preserved.** All 31 UUIDs match the source spreadsheet exactly. VA's lowercase UUID is documented in the data file as intentional (preserved from source).
- **Provider numbers from `states.ts`.** Same state DOI provider approval covers L&H and P&C per stakeholder confirmation; no separate P&C provider numbers needed.
- **FL hour structure now exact-match.** All 4 specialty FL packages (Personal Lines, Personal Lines+Flood, Commercial Lines, Commercial+Flood) deliver exactly 24 hours = the FL first-6-years requirement. The 2 "20-Hour Basic/Advanced" packages serve the post-6-years 20-hour requirement.
