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
 * A state that MANDATES prelicensing (any line has numeric hours) but whose
 * JustInsurance provider approval is still PENDING must NOT publish
 * "state-approved prelicensing course" pages until approval issues. Held pages
 * render a neutral "opening soon" notice, are set noindex, and are excluded
 * from the sitemap. CE-only states (no numeric hours) are exam-prep, never held.
 * Reverts automatically once providerApprovalNumber is set to a real number.
 */
export function isPrelicensingHeld(state: {
  providerApprovalNumber: string;
  prelicensing: {
    life: { hours: number | string };
    health: { hours: number | string };
    lifeAndHealth: { hours: number | string };
  };
}): boolean {
  return (
    state.providerApprovalNumber === "PENDING" &&
    credentialKindFromHours([
      state.prelicensing.life.hours,
      state.prelicensing.health.hours,
      state.prelicensing.lifeAndHealth.hours,
    ]) === "prelicensing"
  );
}
