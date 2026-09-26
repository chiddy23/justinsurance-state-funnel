# New York rollout compliance audit — 2026-08-28

Status: Website and checkout Previews built and passed rendered QA on 2026-08-28. Production remains intentionally held until the public Absorb wording findings below are resolved or explicitly accepted by the owner.

Preview deployments:

- Website: `https://justinsurance-state-funnel-inld42ni6-chad-8413s-projects.vercel.app`
- Checkout: `https://justinsurance-checkout-r0cryy050-chad-8413s-projects.vercel.app`

## Product and checkout truth

- Live prelicensing: New York Life only, Absorb curriculum `3f772833-68e9-4936-85d0-ba61148ab380`, public price $199.
- Not live: Health and combined Life, Accident & Health prelicensing. Both remain fail-closed with no checkout SKU or payment link.
- Live practice products: Life, Health, and Life & Health at $59 each. They are represented as independent study tools, not official state exams.
- Not live: New York continuing education. CE approval and checkout remain disabled.
- Provider number: New York prelicensing provider #80025. The DFS public provider registry displays JustInsurance LLC; the rendered registry did not display an online/webinar annotation next to the listing, so that administrative detail should be confirmed with DFS.

## Regulatory accuracy

- DFS requires at least 20 hours for Life, 20 hours for Accident & Health, and 40 hours for combined Life, Accident & Health education.
- PSI currently lists 100 questions / 2 hours for Life (17-51), 100 questions / 2 hours for Accident & Health (17-52), and 150 items / 2.5 hours for combined (17-55). Passing standard: 70%.
- A prelicensing certificate does not expire. The license application must be submitted within two years after passing the licensing exam.
- New York CE remains informational only: 15 credits per two-year period, including at least one credit each in insurance law, ethics and professionalism, and diversity, inclusion and elimination of bias; P&C licensees also need at least one flood-insurance credit.

## Advertising and claims

- Website and checkout copy does not say the products mimic, simulate, replicate, or contain official DFS/PSI exam questions.
- Checkout does not promise first-attempt success or a guaranteed passing result.
- The checkout avoids stating a New York Life course duration because the public Absorb description currently conflicts with itself: one section says 20 hours and another says the course is approved for 35 total hours.
- Current public Absorb Life and practice-exam descriptions contain high-risk phrases such as “simulate the real thing,” “modeled after actual state exam formatting,” “same style,” “same difficulty,” “closest simulation,” and first-try/pass-rate causation. These descriptions should be rewritten in Absorb before Production rollout is called fully compliant.
- The public New York CE catalog exposes a $0 empty package and a $999,999 “coming soon” placeholder. The website and checkout do not link to them as purchasable products, but they should be unpublished or cleaned up in Absorb.

## SEO and structured data

- Existing New York URLs are preserved; no slug, canonical, heading architecture, or unrelated ranked copy is removed.
- The New York prelicensing hub and Life detail page may be indexed when live.
- Health and combined detail pages remain `noindex,follow` and stay out of the sitemap.
- New York CE purchase/detail pages remain out of the sitemap while CE is unavailable.
- The NY CE requirements hub remains indexable as informational content. Its three unavailable CE product-detail pages are `noindex,follow`, have no checkout links, and are no longer promoted by related-resource cards.
- Course schema describes only the live Life offer; it does not publish an in-stock combined product.

## UX and accessibility

- Unavailable Health and combined cards keep informational requirement links but suppress price and payment buttons.
- The live Life card uses the original Absorb artwork.
- Practice checkout cards use the original Absorb artwork and distinguish their question counts from the official PSI formats.
- Desktop Preview QA confirmed clean card alignment and wrapping, one H1, no missing image alt attributes, no broken course artwork, no horizontal overflow, and exact CTA destinations.
- The unavailable Health and combined pages now preserve a valid H1 → H2 → H3 heading hierarchy.
- Checkout fields now have programmatically associated labels, error descriptions, and `aria-invalid` state. The password reveal control remains intentionally removed from sequential Tab order.
- Responsive CSS remains in place; this Browser session did not expose a reliable device-viewport switch, so a final physical narrow-screen glance is still recommended before Production.

## Security and operational gates

- SKU, price, currency, and Absorb course ID remain server-bound in the checkout catalog.
- No Health, combined prelicensing, or CE SKU exists, so browser parameter tampering cannot purchase an unavailable New York product.
- Security regression, typecheck, production build, and catalog preflight passed before Preview deployment.
- Preview payment initialization exposed Card, Klarna, Cash App Pay, and Amazon Pay without completing a charge.
- Direct Preview requests for `ny-health`, `ny-life-health`, and `ny-ce-life` all rendered `Course unavailable` with no payment button.
- Preview must be tested without completing a charge unless the owner separately authorizes a paid test.

## Preview verdict

- Website routing, SEO controls, structured data, claims, layout, accessibility, and checkout destinations: PASS.
- Checkout catalog integrity, amount/course binding regression suite, payment initialization, accessibility labels, original artwork, and unavailable-SKU fail-closed behavior: PASS.
- Production release: HOLD only for the public Absorb catalog wording/placeholder cleanup described above and one final physical mobile-width glance. No Production deployment was made during this audit.

## Primary sources

- New York DFS Life, Accident & Health licensing page: https://www.dfs.ny.gov/apps_and_licensing/agents_and_brokers/lic_app_la_lb
- New York DFS prelicensing criteria: https://www.dfs.ny.gov/apps_and_licensing/insurance_education_providers/prelicensing/criteria
- New York DFS provider registry: https://myportal.dfs.ny.gov/web/guest-applications/prelicensing-providers
- PSI New York candidate bulletin: https://test-takers.psiexams.com/api/content/bulletin/7217
- New York Insurance Law § 2103: https://www.nysenate.gov/legislation/laws/ISC/2103
