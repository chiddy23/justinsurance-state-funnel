// P&C Continuing Education packages — 32 packages across 26 states.
//
// Pricing rule (corrected 2026-05-26 — supersedes the 2026-04-29 note):
//   SBS / per-credit-hour states:  price = $39 base + $1.50 per credit hour.
//   Flat (non-SBS) states:          price = $39 flat, regardless of hours.
//
//   The $39+$1.50/hr formula reproduces every L&H price exactly:
//     18 hr -> $66    24 hr -> $75    36 hr -> $93
//     45 hr -> $106.50   48 hr -> $111   60 hr -> $129
//
//   SBS states get the formula (the 25 per State-Based Systems / NAIC):
//     AL, AK, AZ, AR, CT, DE, DC, HI, ID, IL, KS, MA, MT, NE, NH, NM, ND,
//     OK, OR, RI, SC, SD, TN, VT, WI. (We currently sell P&C in: AK, AZ, ID,
//     IL, KS, MA, MT, NE, NH, NM, OK, RI, TN, VT, WI.)
//
//   Flat-$39 (non-SBS) states confirmed by stakeholder: CA, IA, ME, NC, NJ,
//     OH, TX, WV, WY, VA (16-hr), and all 6 FL packages. These stay $39
//     regardless of hours — they do NOT carry the per-credit-hour SBS uplift.
//     (NOTE: Iowa is 36 hours but is NON-SBS, so it is flat $39 — do not
//     formula-price it. Its L&H price was corrected $59 -> $39 to match.)
//
//   ORIGINAL BUG: the 2026-04-29 build hardcoded every non-AK/AZ state to $39,
//   assuming "$39 = L&H baseline." That was wrong — the SBS states' L&H prices
//   were already formula-derived ($66/$75/$106.50/$111). 13 P&C packages were
//   underpriced as a result and corrected 2026-05-26 (NE/ID/IL/MT/NH/NM/RI/TN/
//   VT/WI -> $75, KS -> $66, MA 45-hr -> $106.50, MA 60-hr -> $129).
//
//   Provider approval: same provider numbers cover both L&H and P&C.
//   Pull provider numbers from states.ts at render time — do NOT duplicate here.
//
// Provider approval: same provider numbers cover both L&H and P&C per stakeholder confirmation.
// Pull provider numbers from states.ts at render time — do NOT duplicate here.
//
// Source: P&C packages list.xlsx (delivered 2026-04-29), plus the live Colorado
// package re-verified in Absorb on 2026-08-26. 32 packages, all Active.

/**
 * State-truth CE requirement (separate from package hours).
 * Source of truth for FAQ generation — NEVER use package.totalHours as the
 * "state requirement" answer; states have their own minimums independent of
 * which package a producer buys.
 */
export interface StateRequirement {
  /** What the state actually requires per cycle (minimum). */
  totalHours: number;
  /** Optional clarifier (e.g., "20 hours after 6 years of licensure; 24 first 6 years"). */
  totalHoursNote?: string;
  /** Ethics hours required by state. */
  ethicsHours: number;
  /** Ethics label as the state describes it. */
  ethicsLabel: string;
  /** Renewal cycle length, in years. */
  renewalCycleYears: number;
  /** Statute / regulation citation. */
  statuteCitation: string;
  /** Max excess CE hours that may carry forward to next cycle (if allowed). */
  carryoverHours?: number;
  /** True if statute citation is unverified — adds a "verify with DOI" line in FAQs. */
  requiresVerification?: boolean;
}

export interface PCPackage {
  /** Two-letter state code (uppercase) */
  state: string;
  /** Full state name (matches states.ts naming) */
  stateName: string;
  /** State slug (matches states.ts slug) */
  stateSlug: string;
  /** Package URL slug. null/undefined for single-package states. */
  packageSlug?: string;
  /** Display name shown in UI. Cleaned of encoding artifacts. */
  packageName: string;
  /** Short variant for headings */
  shortName: string;
  /** Ethics/L&E hours */
  ethicsHours: number;
  /** Ethics module label — varies by state (FL uses "Law & Ethics Update", IL uses "Ethics Webinar", CA includes Anti-Fraud) */
  ethicsLabel: string;
  /** Elective P&C hours */
  pcHours: number;
  /** Total hours (computed) */
  totalHours: number;
  /** Full HTTPS Absorb LMS cart URL */
  cartLink: string;
  /** State-specific compliance callouts (NFIP for KS, Anti-Fraud for CA, MT Law, etc.) */
  specialNotes: string[];
  /** Active or planned — all current packages are Active */
  status: "Active" | "Coming Soon";
  /** Price string with $ prefix, matches state's L&H CE pricing per stakeholder rule */
  price: string;
  /** Set true for packages where price needs stakeholder confirmation */
  priceNeedsConfirmation?: boolean;
  /**
   * State CE truth — what the state requires per cycle (NOT what the package
   * delivers). Used by FAQ generator to avoid YMYL bug where package hours
   * were rendered as the state mandate.
   */
  stateRequirement: StateRequirement;
}

/**
 * Per-state CE truth lookup. All packages in a multi-package state share the
 * same StateRequirement (FL: 20-hr base, MA: 45-hr base etc.).
 *
 * Statute citations: entries are verified against live state DOI / state code
 * as of 2026-04-28 (10-state verification round corrected AK, ID, ME, NE, NH,
 * RI, VT, WI, WV, WY citations to point at the actual CE-governing section
 * rather than unrelated/repealed statutes). Optional `requiresVerification: true`
 * may be re-added if a future amendment changes a citation pending recheck.
 */
const PC_STATE_REQUIREMENTS: Record<string, StateRequirement> = {
  AK: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "AS 21.27.020(f)" },
  AZ: { totalHours: 48, ethicsHours: 6, ethicsLabel: "ethics", renewalCycleYears: 4, statuteCitation: "A.R.S. §20-2902" },
  CA: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics (including a 1-hour insurance fraud study within the 3 hours)", renewalCycleYears: 2, statuteCitation: "Cal. Ins. Code §1749.3" },
  CO: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "3 CCR 702-1, Regulation 1-2-4", carryoverHours: 12 },
  DE: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "18 Del. Admin. Code 504 §8.2.1", carryoverHours: 5 },
  FL: { totalHours: 20, totalHoursNote: "Florida producers in their first 6 years of licensure need 24 hours; producers licensed 6+ years need 20 hours.", ethicsHours: 4, ethicsLabel: "Law & Ethics Update", renewalCycleYears: 2, statuteCitation: "Fla. Stat. §626.2815", carryoverHours: 24 },
  IA: { totalHours: 36, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 3, statuteCitation: "Iowa Admin. Code r. 191-11.3 (Iowa Code §522B.18)" },
  ID: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "Idaho Code §41-1013" },
  IL: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics (classroom or interactive webinar format)", renewalCycleYears: 2, statuteCitation: "215 ILCS 5/500-35" },
  KS: { totalHours: 18, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "K.S.A. 40-4903" },
  MA: { totalHours: 45, totalHoursNote: "Massachusetts runs a single 3-year (36-month) cycle: 60 hours are required before a producer's initial license renewal, then 45 hours (including 3 hours of ethics) each 3-year period after that (211 CMR 50.04).", ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 3, statuteCitation: "211 CMR 50.00" },
  ME: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "24-A M.R.S. §1482" },
  MT: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics plus a 1-hour Montana Insurance Law module", renewalCycleYears: 2, statuteCitation: "Mont. Code Ann. §33-17-1203" },
  NC: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "N.C. Gen. Stat. §58-33-130" },
  ND: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "N.D. Cent. Code §26.1-26-31.1" },
  NE: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "Neb. Rev. Stat. §§44-3901 to 44-3908" },
  NH: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "N.H. Admin. Code Ins 1300" },
  NV: { totalHours: 30, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 3, statuteCitation: "NAC 683A.330" },
  NJ: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "N.J.A.C. 11:17-3.6 (under N.J.S.A. 17:22A-32)" },
  NM: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "NMSA 1978 §59A-12-26 (rule 13.4.7 NMAC)" },
  OH: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "Ohio Rev. Code §3905.481" },
  OK: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics plus a 2-hour legislative update", renewalCycleYears: 2, statuteCitation: "36 O.S. §1435.29" },
  PA: { totalHours: 24, ethicsHours: 0, ethicsLabel: "no general ethics minimum specified", renewalCycleYears: 2, statuteCitation: "31 Pa. Code §37a.9" },
  RI: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "230-RICR-20-50-2 (Insurance Regulation 40)", carryoverHours: 12 },
  TN: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "Tenn. Code Ann. §56-6-107" },
  TX: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics (with 50% classroom-equivalent delivery)", renewalCycleYears: 2, statuteCitation: "Tex. Ins. Code §4004.051" },
  VA: { totalHours: 16, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "Va. Code §38.2-1866" },
  VT: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "8 V.S.A. §4800a" },
  WI: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "Wis. Admin. Code Ins 28.04 (under Wis. Stat. §628.04)" },
  WV: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "W. Va. Code §33-12-8", carryoverHours: 6 },
  WY: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "Wyo. Stat. §26-9-231" },
};

/**
 * Raw package definitions (without `stateRequirement`). The exported
 * `PC_CE_PACKAGES` below injects `stateRequirement` from `PC_STATE_REQUIREMENTS`
 * so we don't repeat the same state-truth block 6 times for FL or 2 times for MA.
 */
type PCPackageInput = Omit<PCPackage, "stateRequirement">;

const PC_CE_PACKAGES_RAW: PCPackageInput[] = [
  // === Single-package states (23) ===
  {
    state: "AK", stateName: "Alaska", stateSlug: "alaska",
    packageName: "Alaska Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Alaska P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=ak-ce-pc",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "AZ", stateName: "Arizona", stateSlug: "arizona",
    packageName: "Arizona Property & Casualty CE Package — 6-Hr Ethics + 42-Hr P&C",
    shortName: "Arizona P&C CE",
    ethicsHours: 6, ethicsLabel: "Ethics", pcHours: 42, totalHours: 48,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=az-ce-pc",
    specialNotes: ["Arizona uses a 4-year renewal cycle requiring 48 total CE hours."],
    status: "Active", price: "$111",
  },
  {
    state: "CA", stateName: "California", stateSlug: "california",
    packageName: "California Property & Casualty CE Package — 3-Hr Ethics with CA Anti-Fraud + 21-Hr P&C",
    shortName: "California P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics with CA Anti-Fraud", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=ca-ce-pc",
    specialNotes: [
      "Includes the 1-hour Anti-Fraud Awareness Training required by CDI for all California producers.",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "CO", stateName: "Colorado", stateSlug: "colorado",
    packageName: "Colorado Property & Casualty CE Package — 3-Hr Ethics + 18-Hr P&C + 3-Hr Colorado Homeowners",
    shortName: "Colorado P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=co-ce-pc",
    specialNotes: [
      "Includes the 3 hours of homeowners insurance coverage CE required for Colorado Property and Personal Lines producers.",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "DE", stateName: "Delaware", stateSlug: "delaware",
    packageName: "Delaware Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Delaware P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=de-ce-pc",
    specialNotes: ["Includes flood-insurance topics for Delaware Property & Casualty producers."],
    status: "Active", price: "$75",
  },
  {
    state: "IA", stateName: "Iowa", stateSlug: "iowa",
    packageName: "Iowa Property & Casualty CE Package — 3-Hr Ethics + 33-Hr P&C",
    shortName: "Iowa P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 33, totalHours: 36,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=ia-ce-pc",
    specialNotes: ["Iowa requires 36 hours every 3-year renewal cycle, including 3 hours of ethics."],
    status: "Active", price: "$59",
  },
  {
    state: "ID", stateName: "Idaho", stateSlug: "idaho",
    packageName: "Idaho Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Idaho P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=619B808F-7017-4374-9A8B-14B4C659E284",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "IL", stateName: "Illinois", stateSlug: "illinois",
    packageName: "Illinois Property & Casualty CE Package — 3-Hr Ethics Webinar + 21-Hr P&C",
    shortName: "Illinois P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics Webinar", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=1090FCF8-B6EF-4361-9F5B-AAA17A612D23",
    specialNotes: [
      "Ethics module is delivered in webinar format per Illinois Department of Insurance requirements.",
    ],
    status: "Active", price: "$75",
  },
  {
    state: "KS", stateName: "Kansas", stateSlug: "kansas",
    packageName: "Kansas Property & Casualty CE Package — 3-Hr Ethics + 15-Hr P&C",
    shortName: "Kansas P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 15, totalHours: 18,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=ks-ce-pc",
    specialNotes: [
      "Kansas P&C and Personal Lines licensees who sell flood insurance must also complete a one-time 3-hour NFIP course (not included in this package).",
    ],
    status: "Active", price: "$66",
  },
  {
    state: "ME", stateName: "Maine", stateSlug: "maine",
    packageName: "Maine Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Maine P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=me-ce-pc",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "MT", stateName: "Montana", stateSlug: "montana",
    packageName: "Montana Property & Casualty CE Package — 3-Hr Ethics + 1-Hr MT Law + 21-Hr P&C",
    shortName: "Montana P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics + 1-Hr MT Law", pcHours: 21, totalHours: 25,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=mt-ce-pc",
    specialNotes: [
      "Includes the 1-hour Montana Insurance Law module required by the Montana Commissioner of Securities and Insurance.",
    ],
    status: "Active", price: "$75",
  },
  {
    state: "NC", stateName: "North Carolina", stateSlug: "north-carolina",
    packageName: "North Carolina Property & Casualty CE Package — 4-Hr Ethics + 21-Hr P&C",
    shortName: "North Carolina P&C CE",
    ethicsHours: 4, ethicsLabel: "Ethics", pcHours: 21, totalHours: 25,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=nc-ce-pc",
    specialNotes: [
      "North Carolina P&C, personal-lines, and adjuster licensees who sell National Flood Insurance must complete a 3-hour NFIP-approved flood course in their first compliance period and every other renewal cycle (11 NCAC 06A .0802) — it counts within the 24-hour total.",
    ], status: "Active", price: "$39",
  },
  {
    state: "NE", stateName: "Nebraska", stateSlug: "nebraska",
    packageName: "Nebraska Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Nebraska P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=ne-ce-pc",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "NH", stateName: "New Hampshire", stateSlug: "new-hampshire",
    packageName: "New Hampshire Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "New Hampshire P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=13D82FEE-FE0D-4943-B7EB-D258EF6CE98D",
    specialNotes: [
      "New Hampshire P&C producers must complete a one-time NHID-approved basic flood (NFIP) course within one year of licensure (N.H. Admin. Code Ins 1304).",
    ], status: "Active", price: "$75",
  },
  {
    state: "NV", stateName: "Nevada", stateSlug: "nevada",
    packageName: "Nevada Property & Casualty CE Package — 6-Hr Ethics + 27-Hr P&C",
    shortName: "Nevada P&C CE",
    ethicsHours: 6, ethicsLabel: "Ethics", pcHours: 27, totalHours: 33,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=nv-ce-pc",
    specialNotes: [
      "This 33-hour package exceeds Nevada's 30-hour producer CE minimum and includes 6 ethics hours.",
    ], status: "Active", price: "$39",
  },
  {
    state: "NJ", stateName: "New Jersey", stateSlug: "new-jersey",
    packageName: "New Jersey Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "New Jersey P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=nj-ce-pc",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "NM", stateName: "New Mexico", stateSlug: "new-mexico",
    packageName: "New Mexico Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C (Includes Classroom Equivalent Hours)",
    shortName: "New Mexico P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=nm-ce-pc",
    specialNotes: [
      "Includes Classroom Equivalent Hours per New Mexico Office of Superintendent of Insurance requirements.",
    ],
    status: "Active", price: "$75",
  },
  {
    state: "ND", stateName: "North Dakota", stateSlug: "north-dakota",
    packageName: "North Dakota Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "North Dakota P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=nd-ce-pc",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "OH", stateName: "Ohio", stateSlug: "ohio",
    packageName: "Ohio Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Ohio P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=oh-ce-pc",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "OK", stateName: "Oklahoma", stateSlug: "oklahoma",
    packageName: "Oklahoma Property & Casualty CE Package — 3-Hr Ethics + 2-Hr Legislative Update + 19-Hr P&C",
    shortName: "Oklahoma P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 19, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=ok-ce-pc",
    specialNotes: ["Includes Oklahoma's required 2-hour legislative update."],
    status: "Active", price: "$75",
  },
  {
    state: "PA", stateName: "Pennsylvania", stateSlug: "pennsylvania",
    packageName: "Pennsylvania Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Pennsylvania P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=pa-ce-pc",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "RI", stateName: "Rhode Island", stateSlug: "rhode-island",
    packageName: "Rhode Island Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Rhode Island P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=ri-ce-pc",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "TN", stateName: "Tennessee", stateSlug: "tennessee",
    packageName: "Tennessee Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Tennessee P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=tn-ce-pc",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "TX", stateName: "Texas", stateSlug: "texas",
    packageName: "Texas Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C (Includes 50% Classroom Equivalent)",
    shortName: "Texas P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=tx-ce-pc",
    specialNotes: [
      "Satisfies the 50% Classroom Equivalent requirement set by the Texas Department of Insurance for online CE.",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "VA", stateName: "Virginia", stateSlug: "virginia",
    packageName: "Virginia Property & Casualty CE Package — 3-Hr Ethics + 13-Hr P&C",
    shortName: "Virginia P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 13, totalHours: 16,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=va-ce-pc",
    specialNotes: [
      "Virginia P&C agents need 16 hours every 2-year renewal cycle, including 3 hours of ethics.",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "VT", stateName: "Vermont", stateSlug: "vermont",
    packageName: "Vermont Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Vermont P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=vt-ce-pc",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "WI", stateName: "Wisconsin", stateSlug: "wisconsin",
    packageName: "Wisconsin Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Wisconsin P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=wi-ce-pc",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "WV", stateName: "West Virginia", stateSlug: "west-virginia",
    packageName: "West Virginia Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "West Virginia P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=wv-ce-pc",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "WY", stateName: "Wyoming", stateSlug: "wyoming",
    packageName: "Wyoming Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Wyoming P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=wy-ce-pc",
    specialNotes: [], status: "Active", price: "$39",
  },

  // === Florida — 6 multi-package state ===
  {
    state: "FL", stateName: "Florida", stateSlug: "florida", packageSlug: "20-hour-advanced",
    packageName: "Florida 20-Hour Advanced Property & Casualty CE Package — 4-Hr L&E Update + 16-Hr P&C",
    shortName: "FL 20-Hour Advanced P&C CE",
    ethicsHours: 4, ethicsLabel: "Law & Ethics Update", pcHours: 16, totalHours: 20,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=fl-ce-pc-20-advanced",
    specialNotes: [
      "Florida 2-20 producers licensed 6+ years need 20 hours total per 2-year cycle; this Advanced track covers more complex P&C topics.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "FL", stateName: "Florida", stateSlug: "florida", packageSlug: "20-hour-basic",
    packageName: "Florida 20-Hour Basic Property & Casualty CE Package — 4-Hr L&E Update + 16-Hr P&C",
    shortName: "FL 20-Hour Basic P&C CE",
    ethicsHours: 4, ethicsLabel: "Law & Ethics Update", pcHours: 16, totalHours: 20,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=fl-ce-pc-20-basic",
    specialNotes: [
      "Florida 2-20 producers licensed 6+ years need 20 hours total per 2-year cycle; this Basic track covers core P&C fundamentals.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "FL", stateName: "Florida", stateSlug: "florida", packageSlug: "commercial-lines",
    packageName: "Florida Commercial Lines CE Package — 4-Hr L&E Update + 20-Hr P&C",
    shortName: "FL Commercial Lines CE",
    ethicsHours: 4, ethicsLabel: "Law & Ethics Update", pcHours: 20, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=fl-ce-pc-commercial",
    specialNotes: [
      "Designed for Florida producers focused on commercial property, commercial general liability, workers' compensation, and commercial auto coverage.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
      "Exact-match for the FL 24-hour first-6-years CE requirement (Fla. Stat. §626.2815). Producers licensed 6+ years (20-hour requirement) can carry forward up to 24 excess hours per the same statute.",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "FL", stateName: "Florida", stateSlug: "florida", packageSlug: "commercial-flood",
    packageName: "Florida Commercial + Flood Insurance CE Package — 4-Hr L&E Update + 20-Hr P&C",
    shortName: "FL Commercial + Flood CE",
    ethicsHours: 4, ethicsLabel: "Law & Ethics Update", pcHours: 20, totalHours: 24,
    // Same Absorb course UUID as the previous "Personal Auto" SKU — LMS course
    // content was restructured to a 24-hour Commercial + Flood package; UUID
    // preserved to retain customer enrollment history. Old slug `personal-auto`
    // 301-redirected to `commercial-flood` (see next.config.mjs).
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=fl-ce-pc-commercial-flood",
    specialNotes: [
      "Bundle for FL commercial-lines producers who write NFIP flood policies — covers commercial property, GL, workers' comp, plus flood-specific coverage and underwriting.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
      "Exact-match for the FL 24-hour first-6-years CE requirement (Fla. Stat. §626.2815).",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "FL", stateName: "Florida", stateSlug: "florida", packageSlug: "personal-lines",
    packageName: "Florida Personal Lines Insurance CE Package — 4-Hr L&E Update + 20-Hr P&C",
    shortName: "FL Personal Lines CE",
    ethicsHours: 4, ethicsLabel: "Law & Ethics Update", pcHours: 20, totalHours: 24,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=fl-ce-pc-personal",
    specialNotes: [
      "Comprehensive personal-lines curriculum: homeowners, personal auto, umbrella, and inland marine coverage for FL consumers.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
      "Exact-match for the FL 24-hour first-6-years CE requirement (Fla. Stat. §626.2815). Producers licensed 6+ years (20-hour requirement) can carry forward up to 24 excess hours.",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "FL", stateName: "Florida", stateSlug: "florida", packageSlug: "personal-lines-flood",
    packageName: "Florida Personal Lines + Flood CE Package — 4-Hr L&E Update + 20-Hr P&C",
    shortName: "FL Personal Lines + Flood CE",
    ethicsHours: 4, ethicsLabel: "Law & Ethics Update", pcHours: 20, totalHours: 24,
    // Same Absorb course UUID as the previous "Homeowners + Flood" SKU — LMS
    // course content was restructured into a broader Personal Lines + Flood
    // bundle at 24 hours; UUID preserved. Old slug `homeowners-flood`
    // 301-redirected to `personal-lines-flood`.
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=fl-ce-pc-personal-flood",
    specialNotes: [
      "Bundle for FL personal-lines producers who write NFIP flood policies — covers homeowners, personal auto, umbrella, inland marine, plus flood-specific coverage and underwriting.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
      "Exact-match for the FL 24-hour first-6-years CE requirement (Fla. Stat. §626.2815).",
    ],
    status: "Active", price: "$39",
  },

  // === Massachusetts — 2 multi-package state (hour tiers) ===
  {
    state: "MA", stateName: "Massachusetts", stateSlug: "massachusetts", packageSlug: "45-hour",
    packageName: "Massachusetts 45-Hour Property & Casualty CE Package — 3-Hr Ethics + 42-Hr P&C",
    shortName: "MA 45-Hour P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 42, totalHours: 45,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=ma-ce-pc-45",
    specialNotes: [
      "Massachusetts 45-hour CE tier — for producers past their first renewal: 45 hours, including 3 hours of ethics, each 3-year period.",
    ],
    status: "Active", price: "$106.50",
  },
  {
    state: "MA", stateName: "Massachusetts", stateSlug: "massachusetts", packageSlug: "60-hour",
    packageName: "Massachusetts 60-Hour Property & Casualty CE Package — 3-Hr Ethics + 57-Hr P&C",
    shortName: "MA 60-Hour P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 57, totalHours: 60,
    cartLink: "https://checkout.justinsuranceco.com/checkout?sku=ma-ce-pc-60",
    specialNotes: [
      "Massachusetts 60-hour CE tier — required before a Massachusetts producer's initial license renewal.",
    ],
    status: "Active", price: "$129",
  },
];

/**
 * Final exported package list — each entry has `stateRequirement` injected
 * from `PC_STATE_REQUIREMENTS` based on the two-letter state code. If a state
 * is missing from the lookup table, the build will fail loudly here so we
 * never silently ship a package without a state-truth block.
 */
export const PC_CE_PACKAGES: PCPackage[] = PC_CE_PACKAGES_RAW.map((p) => {
  const stateReq = PC_STATE_REQUIREMENTS[p.state];
  if (!stateReq) {
    throw new Error(
      `pc-ce-packages: missing PC_STATE_REQUIREMENTS entry for ${p.state} (${p.stateName}). Add it before shipping packages for this state.`
    );
  }
  return { ...p, stateRequirement: stateReq };
});

/** All state slugs that have at least one P&C CE package. */
export const PC_STATE_SLUGS = Array.from(
  new Set(PC_CE_PACKAGES.map((p) => p.stateSlug)),
).sort();

/** Multi-package state slugs (FL, MA). */
export const PC_MULTI_PACKAGE_STATES = ["florida", "massachusetts"] as const;

/** Get all packages for a given state slug. */
export function getPCPackagesForState(stateSlug: string): PCPackage[] {
  return PC_CE_PACKAGES.filter((p) => p.stateSlug === stateSlug);
}

/** Get a specific package by state + package slug (for multi-package states). */
export function getPCPackageBySlugs(
  stateSlug: string,
  packageSlug?: string,
): PCPackage | undefined {
  const stateP = getPCPackagesForState(stateSlug);
  if (stateP.length === 0) return undefined;
  if (stateP.length === 1) return stateP[0];
  // Multi-package state — must match packageSlug
  if (!packageSlug) return undefined;
  return stateP.find((p) => p.packageSlug === packageSlug);
}

/** True if a state has multiple packages (FL, MA). */
export function isPCMultiPackageState(stateSlug: string): boolean {
  return getPCPackagesForState(stateSlug).length > 1;
}
