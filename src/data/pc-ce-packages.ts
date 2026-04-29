// P&C Continuing Education packages — 31 packages across 25 states.
//
// Pricing rule (per stakeholder, 2026-04-29):
//   "Pricing is the same as L&H by state. If state and hours match, price matches."
// Implementation:
//   - Default per-package price = state's L&H ceInfo.packagePrice (from states.ts)
//   - AZ priced at $111 (matches L&H AZ 48-hour package)
//   - AK priced at $75 (matches L&H AK premium)
//   - All other 23 states: $39 (matches L&H baseline)
//   - For non-standard hour packages (FL multi-package, MA tier 2, KS 18-hr, VA 16-hr, IA 36-hr),
//     defaulted to state's L&H base price; flagged for stakeholder confirmation in build report.
//
// Provider approval: same provider numbers cover both L&H and P&C per stakeholder confirmation.
// Pull provider numbers from states.ts at render time — do NOT duplicate here.
//
// Source: P&C packages list.xlsx (delivered 2026-04-29). 31 packages, all Active.

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
}

export const PC_CE_PACKAGES: PCPackage[] = [
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
    status: "Active", price: "$39", priceNeedsConfirmation: true,
  },
  {
    state: "ID", stateName: "Idaho", stateSlug: "idaho",
    packageName: "Idaho Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Idaho P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=619B808F-7017-4374-9A8B-14B4C659E284",
    specialNotes: [], status: "Active", price: "$39",
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
    status: "Active", price: "$39",
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
    status: "Active", price: "$39", priceNeedsConfirmation: true,
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
    status: "Active", price: "$39",
  },
  {
    state: "NC", stateName: "North Carolina", stateSlug: "north-carolina",
    packageName: "North Carolina Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "North Carolina P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=C0CCE0F9-42B5-428A-9C4E-BB4C23447FCF",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "NE", stateName: "Nebraska", stateSlug: "nebraska",
    packageName: "Nebraska Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Nebraska P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=A326832A-30F9-458E-9A91-457C366D8BBE",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "NH", stateName: "New Hampshire", stateSlug: "new-hampshire",
    packageName: "New Hampshire Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "New Hampshire P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=13D82FEE-FE0D-4943-B7EB-D258EF6CE98D",
    specialNotes: [], status: "Active", price: "$39",
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
    status: "Active", price: "$39",
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
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "TN", stateName: "Tennessee", stateSlug: "tennessee",
    packageName: "Tennessee Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Tennessee P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=DFFBA3A0-0E5A-43B2-8E1E-E3364C3F4CF5",
    specialNotes: [], status: "Active", price: "$39",
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
    status: "Active", price: "$39", priceNeedsConfirmation: true,
  },
  {
    state: "VT", stateName: "Vermont", stateSlug: "vermont",
    packageName: "Vermont Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Vermont P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=397262AF-2EEE-4F14-83A2-38C9E0CEA9C4",
    specialNotes: [], status: "Active", price: "$39",
  },
  {
    state: "WI", stateName: "Wisconsin", stateSlug: "wisconsin",
    packageName: "Wisconsin Property & Casualty CE Package — 3-Hr Ethics + 21-Hr P&C",
    shortName: "Wisconsin P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 21, totalHours: 24,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=E358162D-AEEC-4229-994A-A8C499CE3E42",
    specialNotes: [], status: "Active", price: "$39",
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
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=1536E1F8-315E-4743-92A2-CE8778E47B35",
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
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=C9EA6115-8407-4BA3-9E57-42A6914087C5",
    specialNotes: [
      "Florida 2-20 producers licensed 6+ years need 20 hours total per 2-year cycle; this Basic track covers core P&C fundamentals.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
    ],
    status: "Active", price: "$39",
  },
  {
    state: "FL", stateName: "Florida", stateSlug: "florida", packageSlug: "commercial-lines",
    packageName: "Florida Commercial Lines CE Package — 4-Hr L&E Update + 22-Hr P&C",
    shortName: "FL Commercial Lines CE",
    ethicsHours: 4, ethicsLabel: "Law & Ethics Update", pcHours: 22, totalHours: 26,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=0A1779C2-D4A9-46F8-ACA8-20BF829309EC",
    specialNotes: [
      "Designed for Florida producers focused on commercial property, commercial general liability, workers' compensation, and commercial auto coverage.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
    ],
    status: "Active", price: "$39", priceNeedsConfirmation: true,
  },
  {
    state: "FL", stateName: "Florida", stateSlug: "florida", packageSlug: "homeowners-flood",
    packageName: "Florida Homeowners Insurance + Flood CE Package — 4-Hr L&E Update + 22-Hr P&C",
    shortName: "FL Homeowners + Flood CE",
    ethicsHours: 4, ethicsLabel: "Law & Ethics Update", pcHours: 22, totalHours: 26,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=01449926-F002-4CF0-A6E7-6DDDEF3ECE43",
    specialNotes: [
      "Focused curriculum for FL producers writing homeowners coverage and NFIP flood policies — Florida's #1 weather-exposure market.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
    ],
    status: "Active", price: "$39", priceNeedsConfirmation: true,
  },
  {
    state: "FL", stateName: "Florida", stateSlug: "florida", packageSlug: "personal-auto",
    packageName: "Florida Personal Auto Insurance CE Package — 4-Hr L&E Update + 22-Hr P&C",
    shortName: "FL Personal Auto CE",
    ethicsHours: 4, ethicsLabel: "Law & Ethics Update", pcHours: 22, totalHours: 26,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=6D05FB7D-6D4E-4F51-9CB6-EC8533B6BECD",
    specialNotes: [
      "Personal Injury Protection (PIP), uninsured motorist, and FL-specific auto coverage requirements covered in depth.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
    ],
    status: "Active", price: "$39", priceNeedsConfirmation: true,
  },
  {
    state: "FL", stateName: "Florida", stateSlug: "florida", packageSlug: "personal-lines",
    packageName: "Florida Personal Lines Insurance CE Package — 4-Hr L&E Update + 24-Hr P&C",
    shortName: "FL Personal Lines CE",
    ethicsHours: 4, ethicsLabel: "Law & Ethics Update", pcHours: 24, totalHours: 28,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=1F91D9FF-6C18-4ADF-89A7-37A650BC40BC",
    specialNotes: [
      "Comprehensive personal-lines curriculum: homeowners, personal auto, umbrella, and inland marine coverage for FL consumers.",
      "Includes the 4-Hour Law & Ethics Update specifically approved for FL P&C licensees.",
    ],
    status: "Active", price: "$39", priceNeedsConfirmation: true,
  },

  // === Massachusetts — 2 multi-package state (hour tiers) ===
  {
    state: "MA", stateName: "Massachusetts", stateSlug: "massachusetts", packageSlug: "45-hour",
    packageName: "Massachusetts 45-Hour Property & Casualty CE Package — 3-Hr Ethics + 42-Hr P&C",
    shortName: "MA 45-Hour P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 42, totalHours: 45,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=59FDAD8B-558E-4FEB-9D02-331B64696C49",
    specialNotes: [
      "Massachusetts 45-hour CE tier — for licensees on the standard 3-year renewal track.",
    ],
    status: "Active", price: "$39", priceNeedsConfirmation: true,
  },
  {
    state: "MA", stateName: "Massachusetts", stateSlug: "massachusetts", packageSlug: "60-hour",
    packageName: "Massachusetts 60-Hour Property & Casualty CE Package — 3-Hr Ethics + 57-Hr P&C",
    shortName: "MA 60-Hour P&C CE",
    ethicsHours: 3, ethicsLabel: "Ethics", pcHours: 57, totalHours: 60,
    cartLink: "https://yourinsurancelicense.myabsorb.com/#/AddToCart?CourseIds=FA59E1EF-D9C7-4500-9D88-DB3FB23138F2",
    specialNotes: [
      "Massachusetts 60-hour CE tier — for licensees with the extended renewal-cycle requirement.",
    ],
    status: "Active", price: "$39", priceNeedsConfirmation: true,
  },
];

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
