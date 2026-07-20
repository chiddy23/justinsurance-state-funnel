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
