/**
 * /sitemaps/states.xml — every URL whose first path segment is a state slug.
 *
 * Includes: /[state] (hub), /[state]/cost, /[state]/requirements,
 * /[state]/practice-exam, /[state]/prelicensing (+ per-LOA),
 * /[state]/continuing-education (+ per-LOA),
 * /[state]/continuing-education/property-and-casualty (+ multi-package detail),
 * and the Spanish pilot pages /es/florida, /es/texas.
 */

import { bucketXml } from "../_lib/split";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(bucketXml("states"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
