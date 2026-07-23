// Ohio: OAC 3901-5-07(H)(16) bans guaranteeing exam passage (enforcement action).
// Illinois: no statutory ban, but suppressed during the active IDOI review of the
// prelicensing pages — a "guaranteed pass" promo claim invites extra scrutiny on
// pages a regulator is already examining. Reversible: remove "illinois" to restore.
// West Virginia: WV OIC Pre-Licensing Provider Information Packet (item 9) bars
// advertising any guarantee that a student will pass a required exam. Audit 2026-07-06.
export const PASS_GUARANTEE_EXCLUDED_STATES: ReadonlySet<string> = new Set(["ohio", "illinois", "west-virginia"]);
// Approval-pending states: NOT a legal ban — but we do not advertise an outcome
// guarantee for a course whose state approval is still pending (advertising-
// before-approval exposure). Remove a slug the moment its approval issues.
// Must stay in sync with every states.ts record whose providerApprovalNumber is
// "PENDING" — currently new-york AND washington. (Washington was PENDING but
// missing here, so hasPassGuarantee("washington") returned true and WA pages
// advertised the guarantee against this stated policy. Caught 2026-07-17.)
export const PASS_GUARANTEE_PENDING_APPROVAL_STATES: ReadonlySet<string> = new Set([
  "new-york",
  "washington",
]);
export function hasPassGuarantee(stateSlug?: string | null): boolean {
  if (!stateSlug) return true;
  const s = stateSlug.toLowerCase();
  return !PASS_GUARANTEE_EXCLUDED_STATES.has(s) && !PASS_GUARANTEE_PENDING_APPROVAL_STATES.has(s);
}

/**
 * The states where the guarantee is NOT offered, as display text.
 *
 * National pages hard-coded "Ohio, Illinois, or West Virginia" in six places. That
 * list omitted the two pending-approval states, so those pages advertised the
 * guarantee to New York and Washington readers while hasPassGuarantee() withheld it
 * for exactly those slugs — the copy and the gate disagreed. Derive the sentence
 * from the same sets the gate uses so the two can never drift apart again.
 */
const TITLE: Record<string, string> = {
  ohio: "Ohio",
  illinois: "Illinois",
  "west-virginia": "West Virginia",
  "new-york": "New York",
  washington: "Washington",
};

export function passGuaranteeExcludedLabel(): string {
  const slugs: string[] = [];
  PASS_GUARANTEE_EXCLUDED_STATES.forEach((s) => slugs.push(s));
  PASS_GUARANTEE_PENDING_APPROVAL_STATES.forEach((s) => slugs.push(s));
  const names = slugs.map((s) => TITLE[s] ?? s);
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}
