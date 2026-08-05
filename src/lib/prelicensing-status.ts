// Determines whether a state page may hold JustInsurance out as a "State-Approved
// [State] Prelicensing Provider" or must instead say "Continuing Education Provider."
//
// The distinction matters for truthful advertising. In states that MANDATE
// prelicensing education, the state runs a prelicensing-provider approval program
// and our approval number authorizes prelicensing — the "Prelicensing Provider"
// badge is accurate. In states that do NOT require prelicensing (exam prep is
// optional), no state prelicensing-provider credential exists; our state approval
// is a Continuing Education approval (NAIC SBS records it as "Continuing
// Education"). Advertising a "state-approved prelicensing provider" credential in
// those states invents a credential the state does not issue and repurposes a CE
// approval number — a false-advertising exposure. Verified across AZ/KS/NM/TN
// (all CE-only, no prelicensing program), 2026-07-06.
//
// The signal is data-driven: a state requires prelicensing iff any line's course
// hours is a numeric value (e.g., 20, 30, 60). "None required (optional)" / "Not
// Required" values are strings that do not begin with a digit.

export type CredentialKind = "prelicensing" | "ce";

const startsWithDigit = (v: unknown): boolean =>
  typeof v === "number" || (typeof v === "string" && /^\s*\d/.test(v));

/**
 * "prelicensing" if the state mandates prelicensing education (any line has a
 * numeric hour requirement); "ce" otherwise. Pass the three per-line hour values.
 */
export function credentialKindFromHours(
  hours: Array<number | string | null | undefined>,
): CredentialKind {
  return hours.some(startsWithDigit) ? "prelicensing" : "ce";
}

/**
 * Does a free-text requirement note MEAN "not required"?
 *
 * Several fields (fingerprintingNotes, prelicensing hours, ...) express absence in
 * prose rather than as a flag, and every ad-hoc attempt to detect that prose has
 * eventually missed a phrasing. `/^not required/i` handles "Not required" but not
 * "No fingerprinting required — Kentucky requires a criminal background check…",
 * which is the same failure shape that cost 33 states on the prelicensing gate.
 * Centralise the detection so a new phrasing is fixed in one place.
 */
export function meansNotRequired(note: string | null | undefined): boolean {
  const s = (note ?? "").trim().toLowerCase();
  if (!s) return false;
  return (
    /^not\s+required\b/.test(s) ||
    /^none\s+required\b/.test(s) ||
    /^no\s+\w+ing\s+required\b/.test(s) || // "No fingerprinting required …"
    /^n\/a\b/.test(s)
  );
}

/**
 * Per-line prelicensing requirement as a DISCRIMINATED UNION.
 *
 * WHY THIS EXISTS. The raw data encodes "no requirement" as English prose —
 * "None required (optional)", "Not Required (as of Jan 1, 2024)", "no combined
 * license". Templates repeatedly tried to detect that prose by string matching and
 * silently guessed wrong, falling back to plausible-looking output with no error:
 *
 *   - cost page   `/not\s*required/i`  matched "Not Required…" but MISSED
 *                 "None required (optional)" — the value 33 states use — so nine
 *                 cost surfaces sold prelicensing as mandatory in exam-only states.
 *   - faq-data    `loaName === "Life"`      never matched "Life Insurance".
 *   - faq-data    `loaName.toLowerCase()`   never matched the score-table key.
 *
 * Consuming THIS union instead of a raw `string | number` makes the compiler force
 * you to handle the not-required branch, so the bug becomes unrepresentable rather
 * than merely detectable. Prefer it over any ad-hoc test of `.hours`.
 */
export type PleRequirement =
  | { required: true; hours: number }
  | { required: false; note: string };

export function pleRequirement(
  raw: number | string | null | undefined,
): PleRequirement {
  if (typeof raw === "number") return { required: true, hours: raw };
  if (typeof raw === "string") {
    const m = raw.match(/^\s*(\d+(?:\.\d+)?)/);
    if (m) return { required: true, hours: Number(m[1]) };
    return { required: false, note: raw };
  }
  return { required: false, note: "Not required" };
}

/** Minimal shape needed to decide what a page may claim. */
interface ClaimSource {
  providerApprovalNumber: string;
  /** false = approved provider but courses not live yet ("coming soon"). Undefined = live. */
  ceCoursesLive?: boolean;
  prelicensingCoursesLive?: boolean;
  /** false = we do NOT hold a CE approval here yet (e.g. NY, CE not submitted),
   *  even if the provider number is real for another credential. Undefined = defaults
   *  to (providerApprovalNumber !== "PENDING"). */
  ceApproved?: boolean;
  prelicensing: {
    life: { hours: number | string };
    health: { hours: number | string };
    lifeAndHealth: { hours: number | string };
  };
}

/**
 * What a page is ALLOWED to assert for a state — computed ONCE, in one place.
 *
 * Previously ~10 files each re-derived eligibility inline, which is ten chances to
 * get it wrong; several did. The critical trap: `providerApprovalNumber` is a
 * CONTINUING EDUCATION credential, so "we are approved" is NOT the same question as
 * "we may advertise approved PRELICENSING." Read these booleans; never re-derive.
 */
export interface StateClaims {
  /** The state mandates prelicensing on at least one line. */
  prelicensingRequired: boolean;
  /** Our provider approval has not issued yet (NY/WA). */
  approvalPending: boolean;
  /** Safe to say "state-approved prelicensing course" / "approved by the DOI". */
  canClaimPrelicensingApproval: boolean;
  /** Safe to say we report PRELICENSING completions to the DOI. */
  canClaimPrelicensingReporting: boolean;
  /** Safe to say "state-approved CE" (CE approval exists in its own right). */
  canClaimCeApproval: boolean;
}

export function stateClaims(state: ClaimSource): StateClaims {
  const prelicensingRequired =
    credentialKindFromHours([
      state.prelicensing.life.hours,
      state.prelicensing.health.hours,
      state.prelicensing.lifeAndHealth.hours,
    ]) === "prelicensing";
  const approvalPending = state.providerApprovalNumber === "PENDING";
  const approved = !approvalPending;
  // Approval alone does not authorize a LIVE-product claim: a state can be an
  // approved provider while its courses are still "coming soon" (ceCoursesLive /
  // prelicensingCoursesLive === false, e.g. WA #300632 / NY #80025). Claims are
  // gated on approved AND live, so a coming-soon state never asserts "state-approved
  // [course]" — only the neutral "Approved — courses coming soon" message shows.
  const ceLive = state.ceCoursesLive !== false;
  const prelicensingLive = state.prelicensingCoursesLive !== false;
  return {
    prelicensingRequired,
    approvalPending,
    // Both conditions are required. An exam-only state has no prelicensing
    // approval program at all, so a CE number can never authorize this claim.
    canClaimPrelicensingApproval: approved && prelicensingRequired && prelicensingLive,
    canClaimPrelicensingReporting: approved && prelicensingRequired && prelicensingLive,
    canClaimCeApproval: ceApprovalHeld(state) && ceLive,
  };
}

/**
 * A state that MANDATES prelicensing (any line has numeric hours) but whose
 * JustInsurance provider approval is still PENDING must NOT publish
 * "state-approved prelicensing course" pages until approval issues. Held pages
 * render a neutral "opening soon" notice, are set noindex, and are excluded
 * from the sitemap. CE-only states (no numeric hours) are exam-prep, never held.
 * Reverts automatically once providerApprovalNumber is set to a real number.
 */
export function isPrelicensingHeld(state: {
  providerApprovalNumber: string;
  prelicensingCoursesLive?: boolean;
  prelicensing: {
    life: { hours: number | string };
    health: { hours: number | string };
    lifeAndHealth: { hours: number | string };
  };
}): boolean {
  // "Not live" = approval still pending OR approved-but-course-not-open-yet.
  // Either way a prelicensing-required state is held ("coming soon"), noindexed,
  // and sitemap-excluded until the course is actually purchasable.
  const notLive =
    state.providerApprovalNumber === "PENDING" ||
    state.prelicensingCoursesLive === false;
  return (
    notLive &&
    credentialKindFromHours([
      state.prelicensing.life.hours,
      state.prelicensing.health.hours,
      state.prelicensing.lifeAndHealth.hours,
    ]) === "prelicensing"
  );
}

/**
 * CE courses are LIVE and purchasable in this state: we hold provider approval
 * (providerApprovalNumber is a real number, not "PENDING") AND ceCoursesLive is
 * not false. This is the ONLY condition under which a CE purchase/enroll surface
 * or a live "state-approved CE" claim may render. Everywhere that used
 * `providerApprovalNumber !== "PENDING"` to gate CE PURCHASE should use this.
 */
/**
 * Whether we actually hold a CE provider approval in this state. Defaults to the
 * general provider approval (providerApprovalNumber !== "PENDING"), but a state
 * may override it: New York holds a PRELICENSING approval (#80025) while its CE
 * is NOT YET SUBMITTED for approval, so ceApproved:false keeps every CE claim in
 * the "approval pending" state even though the provider number is real. WA's
 * #300632 IS a CE approval, so WA leaves ceApproved at its default (true).
 */
function ceApprovalHeld(state: {
  providerApprovalNumber: string;
  ceApproved?: boolean;
}): boolean {
  return state.ceApproved ?? state.providerApprovalNumber !== "PENDING";
}

export function isCeAvailable(state: {
  providerApprovalNumber: string;
  ceCoursesLive?: boolean;
  ceApproved?: boolean;
}): boolean {
  return ceApprovalHeld(state) && state.ceCoursesLive !== false;
}

/**
 * Provider approval HAS issued but CE courses are not live yet — render
 * "Approved — courses coming soon" (with the provider number), NOT a purchase CTA
 * and NOT the "approval pending" copy. Mutually exclusive with isCeAvailable and
 * with the pending state.
 */
export function isCeApprovedComingSoon(state: {
  providerApprovalNumber: string;
  ceCoursesLive?: boolean;
  ceApproved?: boolean;
}): boolean {
  return ceApprovalHeld(state) && state.ceCoursesLive === false;
}

/**
 * Prelicensing analogue of isCeApprovedComingSoon: provider approval issued but the
 * prelicensing course is not open for enrollment yet → "Approved — courses coming
 * soon" rather than "approval pending". (isPrelicensingHeld already holds the page.)
 */
export function isPrelicensingApprovedComingSoon(state: {
  providerApprovalNumber: string;
  prelicensingCoursesLive?: boolean;
}): boolean {
  return (
    state.providerApprovalNumber !== "PENDING" &&
    state.prelicensingCoursesLive === false
  );
}
