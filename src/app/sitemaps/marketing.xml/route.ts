/**
 * /sitemaps/marketing.xml — site-wide top-level pages.
 *
 * Includes: homepage, /about (and /about/justin-vom-eigen), /faq,
 * /privacy-policy, /terms, /press, /reviews, /webinars, /partners,
 * /partner-resources, /continuing-education, /prelicensing,
 * /non-resident-insurance-license, /practice-exam, /pass-rates,
 * /study-guide, /insurance-exam-guide, /insurance-license-cost,
 * /how-long-to-get-insurance-license, /license-renewal-guide,
 * /life-insurance-license, /health-insurance-license,
 * /life-and-health-insurance-license, /property-and-casualty-ce,
 * /compare and /compare/{xcel,examfx,adbanker,aceable}, /contact.
 */

import { bucketXml } from "../_lib/split";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(bucketXml("marketing"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
