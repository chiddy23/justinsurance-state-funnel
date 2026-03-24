import { ALL_STATE_SLUGS } from "./states";
import { ALL_LOA_SLUGS } from "./loa";

// ---------------------------------------------------------------------------
// Static param generators for Next.js App Router dynamic routes
// ---------------------------------------------------------------------------

/**
 * Generates params for /[state]/ routes.
 * Returns one entry per state slug.
 */
export function generateStateParams(): { state: string }[] {
  return ALL_STATE_SLUGS.map((state) => ({ state }));
}

/**
 * Generates params for /[state]/prelicensing/[loa]/ and
 * /[state]/continuing-education/[loa]/ routes.
 * Returns the full cartesian product of all state slugs × all LOA slugs.
 */
export function generateStateLOAParams(): { state: string; loa: string }[] {
  const result: { state: string; loa: string }[] = [];

  for (const state of ALL_STATE_SLUGS) {
    for (const loa of ALL_LOA_SLUGS) {
      result.push({ state, loa });
    }
  }

  return result;
}
