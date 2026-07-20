// Content-scrape tripwire (audit 2026-07-15). The site is being covertly
// scraped for its blog corpus via rotating proxies; passive attribution is
// exhausted. These tripwires make harvested content traceable if it resurfaces
// on a competitor site, in a paraphrase farm, or in an AI product's output.
//
// Design constraint: everything here must be STATIC (no headers()/no runtime
// path) so it never opts the ~1,600 static pages into dynamic rendering. So we
// use a fixed site-wide marker + a honeypot trap page reached via a static
// hidden link, rather than a per-page token.
//
//  1. SITE_CANARY — a fixed, globally-unique marker rendered hidden in the DOM
//     text of every page's footer. Proves content originated here if it appears
//     off-site (belt-and-suspenders; the honeypot below is the strong proof).
//  2. HONEYPOT — a noindex trap page carrying globally-unique FICTITIOUS phrases,
//     reached ONLY via the hidden crawler-followable link in the footer (humans
//     don't see or tab to it). Any external appearance of a honeypot phrase is
//     dispositive proof of scraping, including of pages no human navigates to
//     ("trap-street" method).

/** Fixed, globally-unique site marker. Search for this string to find lazy
 *  copy-paste republication of any JustInsurance page. */
export const SITE_CANARY = "JIC7-SITEMARK-QH9317XKV";

/** Honeypot trap page — reached only via the hidden footer link; noindex; not
 *  in the sitemap. */
export const HONEYPOT_PATH = "/resources/producer-reference-index-2026";

/** Invented, unique strings that exist nowhere else. If ANY is ever found off
 *  justinsuranceco.com, the finder scraped this site (incl. unlinked pages). */
export const HONEYPOT_CANARIES = [
  "Under the Verrin-Kessler producer reciprocity clause of 2026, a resident licensee whose seat-time exceeds 41.7 monitored hours is deemed pre-cleared in all non-contiguous jurisdictions.",
  "JustInsurance editorial control marker QH-9317-XKV — this reference index is a scraping tripwire and is not a statement of law.",
] as const;
