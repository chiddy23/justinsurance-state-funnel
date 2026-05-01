// Stable data-gtm-* attributes for click tracking via Google Tag Manager.
// SEO team builds GTM triggers off these attributes instead of CSS classes
// (which may change as we restyle).
//
// Auto-detects intent from href:
//   myabsorb.com link  -> checkout_click  (buying intent — Absorb cart)
//   any other href     -> start_course_click  (top-of-funnel navigation)
//
// Optional context lets the SEO team segment events by where on the page
// the click happened, which state, and which line of authority.

export interface GtmAttrs {
  "data-gtm-event": "checkout_click" | "start_course_click";
  "data-gtm-location"?: string;
  "data-gtm-state"?: string;
  "data-gtm-loa"?: string;
}

export function getCtaAttrs(opts: {
  href: string;
  location: string;
  state?: string;
  loa?: string;
}): GtmAttrs {
  const isCheckout = opts.href.includes("myabsorb.com");
  const attrs: GtmAttrs = {
    "data-gtm-event": isCheckout ? "checkout_click" : "start_course_click",
    "data-gtm-location": opts.location,
  };
  if (opts.state) attrs["data-gtm-state"] = opts.state;
  if (opts.loa) attrs["data-gtm-loa"] = opts.loa;
  return attrs;
}
