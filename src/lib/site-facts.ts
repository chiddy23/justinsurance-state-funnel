import { STATES } from "@/lib/states";
import { credentialKindFromHours } from "@/lib/prelicensing-status";

/**
 * NATIONAL AGGREGATE FACTS, COMPUTED FROM states.ts AT BUILD TIME.
 *
 * WHY THIS EXISTS. Every national/category page hand-wrote its own version of the
 * same handful of aggregate claims, and none of them were kept in sync with the
 * per-state data. The 2026-07-20 LLM audit found all of these live in rendered
 * output at once:
 *
 *   "Most states require 20 to 40 prelicensing hours"   -> 32 states require ZERO
 *   "17 of the 49 we serve"                             -> 18 of 50 (I wrote this
 *                                                          wrong myself while
 *                                                          correcting the original)
 *   "Total costs ... $150 to $400"                      -> 44 states are $350-500
 *   "exam fee ($40-$70)"                                -> real range $29-$98
 *   "application fee ($30-$150)"                        -> real range $0-$225
 *   "passing score of 70% (75% in some states)"         -> CA is 60, MS is 65
 *   "Most states require 24 CE hours"                   -> real range 10-48
 *
 * Patching these sentence-by-sentence did not work: each phrasing that got fixed
 * left a differently-worded twin behind on another page. Import the values instead
 * of retyping them, so a data change updates every page that cites it.
 *
 * NOTE ON COUNTS: STATES contains 50 US states. Washington D.C. has no record.
 * PRELICENSING_REQUIRED_COUNT counts states where ANY line carries numeric hours.
 */

const ALL = Object.values(STATES);

const nums = (raw: unknown): number[] => {
  const found = String(raw ?? "").replace(/,/g, "").match(/\d+(?:\.\d+)?/g);
  return found ? found.map(Number) : [];
};

/** Total state records in the dataset (50 US states; D.C. is not one of them). */
export const STATE_COUNT = ALL.length;

/** States whose law mandates prelicensing on at least one line of authority. */
export const PRELICENSING_REQUIRED_COUNT = ALL.filter(
  (s) =>
    credentialKindFromHours([
      s.prelicensing.life.hours,
      s.prelicensing.health.hours,
      s.prelicensing.lifeAndHealth.hours,
    ]) === "prelicensing"
).length;

/** States that do NOT mandate prelicensing — exam-only. */
export const EXAM_ONLY_COUNT = STATE_COUNT - PRELICENSING_REQUIRED_COUNT;

/**
 * CE PROVIDER APPROVAL — grounded in states.ts providerApprovalNumber.
 *
 * The word "nationwide" appeared on home, partners, terms and reviews asserting
 * state-approved CE in all states. It is false: two records carry
 * providerApprovalNumber "PENDING" (New York and Washington). A page in the
 * repo even carried a code comment saying "we are NOT an approved CE provider in
 * every state we serve" — the knowledge existed, the copy contradicted it.
 * Derive the honest phrasing from the data so no page can reassert "nationwide".
 */
const CE_PENDING_SLUGS = ALL.filter(
  (s) => (s.providerApprovalNumber ?? "").trim().toUpperCase() === "PENDING"
).map((s) => s.name);
export const CE_APPROVED_COUNT = STATE_COUNT - CE_PENDING_SLUGS.length; // 48
export const CE_PENDING_STATE_NAMES = CE_PENDING_SLUGS; // ["New York","Washington"]

/** e.g. "New York and Washington" — the states whose CE approval is still pending. */
export const CE_PENDING_LABEL = (() => {
  const n = CE_PENDING_STATE_NAMES;
  if (n.length === 0) return "";
  if (n.length === 1) return n[0];
  if (n.length === 2) return `${n[0]} and ${n[1]}`;
  return `${n.slice(0, -1).join(", ")}, and ${n[n.length - 1]}`;
})();

/**
 * Honest inline phrase for CE reach. Reads e.g.:
 * "state-approved continuing education in 48 states (New York and Washington approvals pending)"
 */
export const CE_APPROVAL_PHRASE = CE_PENDING_STATE_NAMES.length
  ? `state-approved continuing education in ${CE_APPROVED_COUNT} states (${CE_PENDING_LABEL} ${CE_PENDING_STATE_NAMES.length === 1 ? "approval" : "approvals"} pending)`
  : `state-approved continuing education in all ${STATE_COUNT} states`;

const rangeOf = (vals: number[]): { min: number; max: number } => ({
  min: Math.min(...vals),
  max: Math.max(...vals),
});

const money = (n: number) => `$${Math.round(n)}`;

export const EXAM_FEE = rangeOf(ALL.flatMap((s) => nums(s.examInfo.examFee)));
export const APPLICATION_FEE = rangeOf(ALL.flatMap((s) => nums(s.applicationFee)));
export const PASSING_SCORE = rangeOf(ALL.map((s) => s.examInfo.passingScore));
export const CE_HOURS = rangeOf(ALL.map((s) => s.ce.totalHours));

/** "$29 to $98" — for prose. */
export const EXAM_FEE_LABEL = `${money(EXAM_FEE.min)} to ${money(EXAM_FEE.max)}`;
export const APPLICATION_FEE_LABEL = `${money(APPLICATION_FEE.min)} to ${money(APPLICATION_FEE.max)}`;
export const CE_HOURS_LABEL = `${CE_HOURS.min} to ${CE_HOURS.max} hours`;

/**
 * Honest one-liner for the prelicensing requirement, used wherever a page would
 * otherwise assert that prelicensing is universal or invent a state count.
 */
export const PRELICENSING_REQUIREMENT_SENTENCE =
  `${PRELICENSING_REQUIRED_COUNT} of the ${STATE_COUNT} states require prelicensing education; ` +
  `in the other ${EXAM_ONLY_COUNT} a course is optional exam preparation.`;
