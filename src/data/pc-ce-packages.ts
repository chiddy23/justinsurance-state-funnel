// P&C Continuing Education packages — 31 packages across 25 states.
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
//     IL, KS, MA, MT, NE, NH, NM, RI, TN, VT, WI.)
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
// Source: P&C packages list.xlsx (delivered 2026-04-29). 31 packages, all Active.

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
 * Statute citations: all 25 entries verified against live state DOI / state code
 * as of 2026-04-28 (10-state verification round corrected AK, ID, ME, NE, NH,
 * RI, VT, WI, WV, WY citations to point at the actual CE-governing section
 * rather than unrelated/repealed statutes). Optional `requiresVerification: true`
 * may be re-added if a future amendment changes a citation pending recheck.
 */
const PC_STATE_REQUIREMENTS: Record<string, StateRequirement> = {
  AK: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "AS 21.27.020(f)" },
  AZ: { totalHours: 48, ethicsHours: 6, ethicsLabel: "ethics", renewalCycleYears: 4, statuteCitation: "A.R.S. §20-2902" },
  CA: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics (including a 1-hour insurance fraud study within the 3 hours)", renewalCycleYears: 2, statuteCitation: "Cal. Ins. Code §1749.3" },
  FL: { totalHours: 20, totalHoursNote: "Florida producers in their first 6 years of licensure need 24 hours; producers licensed 6+ years need 20 hours.", ethicsHours: 4, ethicsLabel: "Law & Ethics Update", renewalCycleYears: 2, statuteCitation: "Fla. Stat. §626.2815", carryoverHours: 24 },
  IA: { totalHours: 36, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 3, statuteCitation: "Iowa Admin. Code r. 191-11.3 (Iowa Code §522B.18)" },
  ID: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "Idaho Code §41-1013" },
  IL: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics (classroom or interactive webinar format)", renewalCycleYears: 2, statuteCitation: "215 ILCS 5/500-35" },
  KS: { totalHours: 18, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "K.S.A. 40-4903" },
  MA: { totalHours: 45, totalHoursNote: "Massachusetts runs a single 3-year (36-month) cycle: 60 hours are required before a producer's initial license renewal, then 45 hours (including 3 hours of ethics) each 3-year period after that (211 CMR 50.04).", ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 3, statuteCitation: "211 CMR 50.00" },
  ME: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "24-A M.R.S. §1482" },
  MT: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics plus a 1-hour Montana Insurance Law module", renewalCycleYears: 2, statuteCitation: "Mont. Code Ann. §33-17-1203" },
  NC: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "N.C. Gen. Stat. §58-33-130" },
  NE: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "Neb. Rev. Stat. §§44-3901 to 44-3908" },
  NH: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "N.H. Admin. Code Ins 1300" },
  NJ: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "N.J.A.C. 11:17-3.6 (under N.J.S.A. 17:22A-32)" },
  NM: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "NMSA 1978 §59A-12-26 (rule 13.4.7 NMAC)" },
  OH: { totalHours: 24, ethicsHours: 3, ethicsLabel: "ethics", renewalCycleYears: 2, statuteCitation: "Ohio Rev. Code §3905.481" },
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
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=B1CF775C-62CC-4135-8809-88BDC7D989C4",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "AZ", stateName: "Arizona", stateSlug: "arizona",
    packageName: "Arizona Property & Casualty CE Package — 6-Hr Ethics + 42-Hr P&C",
    shortName: "Arizona P&C CE",
    ethicsHours: 6, ethicsLabel: "Ethics", pcHours: 42, totalHours: 48,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=596A26B7-300B-45C7-9FBA-3D2629BAA118",
    specialNotes: ["Arizona uses a 4-year renewal cycle requiring 48 total CE hours."],
    status: "Active", price: "$111",
  },
  {
    state: "CA", stateName: "California", stateSlug: "california",
    packageName: "California Property & Casualty CE Package — 3-Hr Ethics with CA Anti-Fraud + 21-Hr P&C",
    shortName: "California P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics with CA Anti-Fraud", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=F7FE2EB9-93AF-40E5-B078-0AFB4B750C1A",
    specialNotes: [
      "Includes the 1-hour Anti-Fraud Awareness Training required by CDI for all California producers.",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "IA", stateName: "Iowa", stateSlug: "iowa",
    packageName: "Iowa Property & Casualty CE Package — 3-Hr Ethics + 33-Hr P&C",
    shortName: "Iowa P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 33, totalHours: 36,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=8520D459-F4DD-4E5A-A96C-B54D826E479D",
    specialNotes: ["Iowa requires 36 hours every 3-year renewal cycle, including 3 hours of ethics."],
    status: "Active", price: "$39",
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
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=B92F41D2-074E-4985-8F20-A3DF4AFAA2A3",
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
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=D923164E-0F6F-4939-BCC6-C5A1BB685776",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "MT", stateName: "Montana", stateSlug: "montana",
    packageName: "Montana Property & Casualty CE Package — 3-Hr Ethics + 1-Hr MT Law + 20-Hr P&C",
    shortName: "Montana P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=92C66C24-6B1A-42F8-8D82-A002EB3BEA18",
    specialNotes: [
      "Includes the 1-hour Montana Insurance Law module required by the Montana Commissioner of Securities and Insurance.",
    ],
    status: "Active", price: "$75",
  },
  {
    state: "NC", stateName: "North Carolina", stateSlug: "north-carolina",
    packageName: "North Carolina Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "North Carolina P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=C0CCE0F9-42B5-428A-9C4E-BB4C23447FCF",
    specialNotes: [
      "North Carolina P&C, personal-lines, and adjuster licensees who sell National Flood Insurance must complete a 3-hour NFIP-approved flood course in their first compliance period and every other renewal cycle (11 NCAC 06A .0802) — it counts within the 24-hour total.",
    ], status: "Active", price: "$39",
  },
  {
    state: "NE", stateName: "Nebraska", stateSlug: "nebraska",
    packageName: "Nebraska Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Nebraska P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=A326832A-30F9-458E-9A91-457C366D8BBE",
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
    state: "NJ", stateName: "New Jersey", stateSlug: "new-jersey",
    packageName: "New Jersey Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "New Jersey P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=4B561C94-467D-4F78-8C9C-819C86A8365B",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "NM", stateName: "New Mexico", stateSlug: "new-mexico",
    packageName: "New Mexico Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C (Includes Classroom Equivalent Hours)",
    shortName: "New Mexico P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=36F5FBB0-B3F7-4A67-AC04-6EBFD00D3116",
    specialNotes: [
      "Includes Classroom Equivalent Hours per New Mexico Office of Superintendent of Insurance requirements.",
    ],
    status: "Active", price: "$75",
  },
  {
    state: "OH", stateName: "Ohio", stateSlug: "ohio",
    packageName: "Ohio Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Ohio P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=F921EDFE-A321-439E-8386-34A130ED5E9B",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "RI", stateName: "Rhode Island", stateSlug: "rhode-island",
    packageName: "Rhode Island Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Rhode Island P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=AA4DDCAE-926A-42B2-8712-B9A5D80F9295",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "TN", stateName: "Tennessee", stateSlug: "tennessee",
    packageName: "Tennessee Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Tennessee P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=DFFBA3A0-0E5A-43B2-8E1E-E3364C3F4CF5",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "TX", stateName: "Texas", stateSlug: "texas",
    packageName: "Texas Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C (Includes 50% Classroom Equivalent)",
    shortName: "Texas P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=077A0E2F-5BA9-49DF-9F49-26A3D794BB52",
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
    // Original cart link in source spreadsheet was missing https:// scheme and used lowercase UUID;
    // preserved UUID exactly (Absorb LMS may be case-sensitive) and added the scheme.
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=23911cd2-544e-458e-834c-ad97738b4365",
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
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=397262AF-2EEE-4F14-83A2-38C9E0CEA9C4",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "WI", stateName: "Wisconsin", stateSlug: "wisconsin",
    packageName: "Wisconsin Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Wisconsin P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=E358162D-AEEC-4229-994A-A8C499CE3E42",
    specialNotes: [], status: "Active", price: "$75",
  },
  {
    state: "WV", stateName: "West Virginia", stateSlug: "west-virginia",
    packageName: "West Virginia Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "West Virginia P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=52E7BE62-0759-4A32-80AD-0EE9FA3CF457",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "WY", stateName: "Wyoming", stateSlug: "wyoming",
    packageName: "Wyoming Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Wyoming P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=FF0D3CC2-9B6C-46EB-971C-0D99CD830FE4",
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
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=59FDAD8B-558E-4FEB-9D02-331B64696C49",
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
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=FA59E1EF-D9C7-4500-9D88-DB3FB23138F2",
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
