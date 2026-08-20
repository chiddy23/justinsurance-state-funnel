/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security sweep 2026-08-10: stop advertising the framework via X-Powered-By
  // (minor info-disclosure hardening; no functional impact).
  poweredByHeader: false,
  // Disable Next.js's automatic trailing-slash redirect so middleware can
  // handle it with an ABSOLUTE Location header. Without this flag, the
  // framework redirect fires at the Vercel edge before middleware runs and
  // returns a relative `Location: /path`, which on www requests resolves
  // back onto the www subdomain — forcing a 2-hop chain (slash strip on
  // www, then www→apex). With this flag, middleware owns the redirect.
  skipTrailingSlashRedirect: true,
  async redirects() {
    // Legacy WordPress paths → new Next.js pages (301 permanent)
    // Preserves link equity from any backlinks or Google-indexed URLs.
    const stateRedirects = [
      "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
      "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho",
      "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana",
      "maine", "maryland", "massachusetts", "michigan", "minnesota",
      "mississippi", "missouri", "montana", "nebraska", "nevada",
      "new-hampshire", "new-jersey", "new-mexico", "north-carolina",
      "north-dakota", "ohio", "oklahoma", "oregon", "pennsylvania",
      "rhode-island", "south-carolina", "south-dakota", "tennessee",
      "texas", "utah", "vermont", "virginia", "washington",
      "west-virginia", "wisconsin", "wyoming",
    ].flatMap((state) => [
      // /state/life → /state/prelicensing
      { source: `/${state}/life`, destination: `/${state}/prelicensing`, permanent: true },
      // /state/health → /state/prelicensing
      { source: `/${state}/health`, destination: `/${state}/prelicensing`, permanent: true },
      // /state/life-and-health → /state/prelicensing
      { source: `/${state}/life-and-health`, destination: `/${state}/prelicensing`, permanent: true },
    ]);

    // Kaplan-pattern keyword-rich URL compatibility. Kaplan ranks 4 of top 10
    // for "insurance continuing education" via /insurance-continuing-education/[state]
    // sub-URLs. Adding 301 compatibility routes at that pattern so anyone typing
    // or linking to the Kaplan URL pattern lands on our canonical state CE pages
    // and passes link equity to them.
    const kaplanMirrorRedirects = [
      // Hub slug compatibility: /insurance-continuing-education → /continuing-education
      { source: "/insurance-continuing-education", destination: "/continuing-education", permanent: true },
      { source: "/insurance-prelicensing", destination: "/prelicensing", permanent: true },
      // Per-state CE: /insurance-continuing-education/[state] → /[state]/continuing-education
      ...[
        "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
        "connecticut", "delaware", "district-of-columbia", "florida", "georgia",
        "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky",
        "louisiana", "maine", "maryland", "massachusetts", "michigan", "minnesota",
        "mississippi", "missouri", "montana", "nebraska", "nevada", "new-hampshire",
        "new-jersey", "new-mexico", "north-carolina", "north-dakota", "ohio",
        "oklahoma", "oregon", "pennsylvania", "rhode-island", "south-carolina",
        "south-dakota", "tennessee", "texas", "utah", "vermont", "virginia",
        "washington", "west-virginia", "wisconsin", "wyoming",
      ].flatMap((state) => [
        {
          source: `/insurance-continuing-education/${state}`,
          destination: `/${state}/continuing-education`,
          permanent: true,
        },
        // /insurance/[state] → /[state] (Kaplan root-hub pattern)
        {
          source: `/insurance/${state}`,
          destination: `/${state}`,
          permanent: true,
        },
        // /insurance/[state]/state-requirements → /[state]/requirements (Kaplan requirements pattern)
        {
          source: `/insurance/${state}/state-requirements`,
          destination: `/${state}/requirements`,
          permanent: true,
        },
      ]),
    ];

    const legacyPageRedirects = [
      // ── Round 1: Short-slug legacy WordPress pages ──
      { source: "/insurance-pre-licensing-courses", destination: "/prelicensing", permanent: true },
      { source: "/insurance-license", destination: "/", permanent: true },
      { source: "/nc-life-insurance-practice-exam", destination: "/north-carolina/practice-exam", permanent: true },

      // ── Round 2: Full-slug legacy URLs (Google-indexed with old brand content) ──
      { source: "/get-a-life-insurance-license-step-by-step-guide-for-all-50-states", destination: "/life-insurance-license", permanent: true },
      { source: "/get-a-life-insurance-license-step-by-step-guide-for-all-50-states/:path*", destination: "/life-insurance-license", permanent: true },
      { source: "/get-a-life-insurance-license", destination: "/life-insurance-license", permanent: true },
      { source: "/get-a-life-insurance-license/:path*", destination: "/life-insurance-license", permanent: true },
      { source: "/texas-life-insurance-exam-prep", destination: "/texas/practice-exam", permanent: true },
      { source: "/texas-life-insurance-exam-prep/:path*", destination: "/texas/practice-exam", permanent: true },
      { source: "/nc-life-insurance-exam-study-guide", destination: "/north-carolina", permanent: true },
      { source: "/nc-life-insurance-exam-study-guide/:path*", destination: "/north-carolina", permanent: true },
      { source: "/insurance-licensing-courses", destination: "/prelicensing", permanent: true },
      { source: "/insurance-licensing-courses/:path*", destination: "/prelicensing", permanent: true },
      { source: "/partner-solutions", destination: "/partners", permanent: true },
      { source: "/partner-solutions/:path*", destination: "/partners", permanent: true },

      // ── Round 2 fix: full-slug URLs that were 404ing or misdirected ──
      { source: "/how-to-study-for-life-insurance-exam-easiest-tips-and-tricks", destination: "/insurance-exam-guide", permanent: true },
      { source: "/how-to-study-for-life-insurance-exam-easiest-tips-and-tricks/:path*", destination: "/insurance-exam-guide", permanent: true },
      { source: "/how-to-study-for-life-insurance-exam", destination: "/insurance-exam-guide", permanent: true },
      { source: "/how-to-study-for-life-insurance-exam/:path*", destination: "/insurance-exam-guide", permanent: true },
      { source: "/from-basics-to-pro-comprehensive-online-courses-for-your-insurance-license", destination: "/study-guide", permanent: true },
      { source: "/from-basics-to-pro-:path*", destination: "/study-guide", permanent: true },
      { source: "/from-basics-to-pro", destination: "/study-guide", permanent: true },

      // ── Remaining legacy paths ──
      { source: "/unlocking-your-future", destination: "/", permanent: true },
      { source: "/unlocking-your-future/:path*", destination: "/", permanent: true },
      { source: "/which-course-is-best", destination: "/prelicensing", permanent: true },
      { source: "/which-course-is-best/:path*", destination: "/prelicensing", permanent: true },
      { source: "/series-6-vs-series-7", destination: "/", permanent: true },
      { source: "/series-6-vs-series-7/:path*", destination: "/", permanent: true },

      // ── Round 3: GSC redirect drilldown 2026-04-20 — missing redirects ──
      // Legacy URL variants still indexed as "Page with redirect" errors
      { source: "/washington-dc", destination: "/district-of-columbia", permanent: true },
      { source: "/washington-dc/:path*", destination: "/district-of-columbia", permanent: true },
      { source: "/services", destination: "/", permanent: true },
      { source: "/services/:path*", destination: "/", permanent: true },
      // Old WordPress refund-policy page — current refund terms live on /terms
      { source: "/refund-policy", destination: "/terms", permanent: true },
      { source: "/refund-policy/:path*", destination: "/terms", permanent: true },
      // WordPress pagination (/blog/page/2, /blog/page/3, etc.) → /blog
      { source: "/blog/page/:num", destination: "/blog", permanent: true },
      // Old WP long-slug guide page → /prelicensing hub
      { source: "/why-an-online-insurance-license-course-is-the-smartest-way-to-get-licensed", destination: "/prelicensing", permanent: true },
      { source: "/why-an-online-insurance-license-course-is-the-smartest-way-to-get-licensed/:path*", destination: "/prelicensing", permanent: true },
      // WordPress admin/content/includes paths are now handled by middleware
      // (src/middleware.ts) and return a true 410 Gone response instead of
      // a 301 to homepage. Removing them here is REQUIRED — framework-level
      // redirects fire BEFORE middleware, so leaving these rules in would
      // hijack the request and prevent middleware from serving the 410.

      // ── Round 4: GSC "Crawled - currently not indexed" drilldown 2026-04-20 ──
      // Legacy WordPress state URLs: /[state]-insurance-license(-2)?/ → /[state]
      // ~20 URLs from GSC. Route to canonical state hub.
      ...[
        "delaware", "kentucky", "louisiana", "maine",
        "massachusetts", "michigan", "minnesota", "mississippi",
        "missouri", "montana", "new-hampshire", "new-mexico",
        "north-carolina", "north-dakota", "oklahoma", "pennsylvania",
        "south-carolina", "tennessee", "virginia", "washington",
        "west-virginia", "wisconsin",
      ].flatMap((state) => [
        { source: `/${state}-insurance-license`, destination: `/${state}`, permanent: true },
        { source: `/${state}-insurance-license/`, destination: `/${state}`, permanent: true },
        { source: `/${state}-insurance-license-2`, destination: `/${state}`, permanent: true },
        { source: `/${state}-insurance-license-2/`, destination: `/${state}`, permanent: true },
      ]),

      // Legacy product/content hubs
      { source: "/life-insurance-study-guide", destination: "/study-guide", permanent: true },
      { source: "/continuing-education-courses", destination: "/continuing-education", permanent: true },
      { source: "/prelicense-and-continuing-education", destination: "/prelicensing", permanent: true },
      { source: "/life-and-health-licensing", destination: "/life-and-health-insurance-license", permanent: true },
      { source: "/life-and-health-insurance-exam-reviews", destination: "/reviews", permanent: true },
      { source: "/state-insurance-license-classes", destination: "/prelicensing", permanent: true },

      // Legacy blog posts → blog hub (no preserved permalinks for these slugs)
      { source: "/preparing-for-the-iowa-life-insurance-exam", destination: "/iowa", permanent: true },
      { source: "/mississippi-life-insurance-exam-questions", destination: "/mississippi/practice-exam", permanent: true },
      { source: "/dual-licensing-state-life-insurance-license-health-license", destination: "/life-and-health-insurance-license", permanent: true },
      { source: "/becoming-a-licensed-insurance-agent", destination: "/blog/how-to-become-an-insurance-agent", permanent: true },
      { source: "/master-the-insurance-licensing-exam-complete-guide", destination: "/insurance-exam-guide", permanent: true },
      { source: "/top-10-tips-for-life-insurance-exam-preparation", destination: "/insurance-exam-guide", permanent: true },
      { source: "/is-the-life-insurance-exam-hard", destination: "/insurance-exam-guide", permanent: true },

      // Old WP pagination slugs /page-N/ (NOT /blog/page/N — that's handled earlier)
      { source: "/page-:num", destination: "/", permanent: true },

      // WP taxonomy archives — route to blog hub
      { source: "/tag/:path*", destination: "/blog", permanent: true },
      { source: "/category/:path*", destination: "/blog", permanent: true },

      // RSS feeds from pre-migration — now handled by middleware as 410 Gone
      // (src/middleware.ts). The /feed and /:path*/feed variants previously
      // 301'd to /blog; they now return 410 to permanently deindex the WP
      // feed URL space. Removing these rules is REQUIRED so middleware can
      // handle them (framework redirects fire before middleware).

      // Old WP opt-in landing
      { source: "/optin-3", destination: "/", permanent: true },
      { source: "/optin-3/", destination: "/", permanent: true },

      // ── Round 5: GSC "Not found (404)" drilldown 2026-04-20 ──
      // 153 URLs. Biggest pattern: /[state]-insurance-pre-licensing-courses-justinsurance*
      // ~50 states × variants. All route to /[state]/prelicensing canonical hub.
      ...[
        "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
        "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho",
        "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana",
        "maine", "maryland", "massachusetts", "michigan", "minnesota",
        "mississippi", "missouri", "montana", "nebraska", "nevada",
        "new-hampshire", "new-jersey", "new-mexico", "new-york",
        "north-carolina", "north-dakota", "ohio", "oklahoma", "oregon",
        "pennsylvania", "rhode-island", "south-carolina", "south-dakota",
        "tennessee", "texas", "utah", "vermont", "virginia", "washington",
        "washington-dc", "west-virginia", "wisconsin", "wyoming",
      ].flatMap((state) => {
        // washington-dc on old WP → /district-of-columbia/prelicensing
        const dest = state === "washington-dc" ? "district-of-columbia" : state;
        return [
          { source: `/${state}-insurance-pre-licensing-courses-justinsurance`, destination: `/${dest}/prelicensing`, permanent: true },
          { source: `/${state}-insurance-pre-licensing-courses-justinsurance/`, destination: `/${dest}/prelicensing`, permanent: true },
          { source: `/${state}-insurance-pre-licensing-courses-justinsurance-2`, destination: `/${dest}/prelicensing`, permanent: true },
          { source: `/${state}-insurance-pre-licensing-courses-justinsurance-2/`, destination: `/${dest}/prelicensing`, permanent: true },
          { source: `/${state}-insurance-pre-licensing-courses-justinsurance/:path*`, destination: `/${dest}/prelicensing`, permanent: true },
        ];
      }),

      // Additional legacy state URLs not covered in round 3
      { source: "/alaska-life-insurance-license", destination: "/alaska", permanent: true },
      { source: "/alaska-life-insurance-license/", destination: "/alaska", permanent: true },
      { source: "/arkansas-insurance-license", destination: "/arkansas", permanent: true },
      { source: "/arkansas-insurance-license/", destination: "/arkansas", permanent: true },
      { source: "/colorado-insurance-license", destination: "/colorado", permanent: true },
      { source: "/colorado-insurance-license/", destination: "/colorado", permanent: true },
      { source: "/connecticut-insurance-license", destination: "/connecticut", permanent: true },
      { source: "/connecticut-insurance-license/", destination: "/connecticut", permanent: true },
      { source: "/delaware-insurance-pre-licensing-courses", destination: "/delaware/prelicensing", permanent: true },
      { source: "/delaware-insurance-pre-licensing-courses/", destination: "/delaware/prelicensing", permanent: true },
      { source: "/hawaii-insurance-license", destination: "/hawaii", permanent: true },
      { source: "/hawaii-insurance-license/", destination: "/hawaii", permanent: true },
      { source: "/illinois-insurance-license", destination: "/illinois", permanent: true },
      { source: "/illinois-insurance-license/", destination: "/illinois", permanent: true },
      { source: "/iowa-insurance-license-2", destination: "/iowa", permanent: true },
      { source: "/iowa-insurance-license-2/", destination: "/iowa", permanent: true },
      { source: "/kansas-insurance-license", destination: "/kansas", permanent: true },
      { source: "/kansas-insurance-license/", destination: "/kansas", permanent: true },
      { source: "/new-jersey-insurance-license", destination: "/new-jersey", permanent: true },
      { source: "/new-jersey-insurance-license/", destination: "/new-jersey", permanent: true },
      { source: "/south-dakota-insurance-license", destination: "/south-dakota", permanent: true },
      { source: "/south-dakota-insurance-license/", destination: "/south-dakota", permanent: true },
      { source: "/texas-insurance-license", destination: "/texas", permanent: true },
      { source: "/texas-insurance-license/", destination: "/texas", permanent: true },
      { source: "/washington-dc-insurance-license", destination: "/district-of-columbia", permanent: true },
      { source: "/washington-dc-insurance-license/", destination: "/district-of-columbia", permanent: true },

      // Legacy blog-style state question posts → /[state]/practice-exam (best semantic match)
      { source: "/alabama-life-insurance-exam-questions", destination: "/alabama/practice-exam", permanent: true },
      { source: "/alabama-life-insurance-exam-questions/", destination: "/alabama/practice-exam", permanent: true },
      { source: "/florida-life-insurance-exam-questions-and-answers", destination: "/florida/practice-exam", permanent: true },
      { source: "/florida-life-insurance-exam-questions-and-answers/", destination: "/florida/practice-exam", permanent: true },
      { source: "/illinois-life-insurance-exam-questions", destination: "/illinois/practice-exam", permanent: true },
      { source: "/illinois-life-insurance-exam-questions/", destination: "/illinois/practice-exam", permanent: true },
      { source: "/arkanasas-life-insurance-practice-exam", destination: "/arkansas/practice-exam", permanent: true },
      { source: "/arkanasas-life-insurance-practice-exam/", destination: "/arkansas/practice-exam", permanent: true },
      { source: "/az-life-insurance-exam", destination: "/arizona/practice-exam", permanent: true },
      { source: "/az-life-insurance-exam/", destination: "/arizona/practice-exam", permanent: true },
      { source: "/pa-life-insurance-exam", destination: "/pennsylvania/practice-exam", permanent: true },
      { source: "/pa-life-insurance-exam/", destination: "/pennsylvania/practice-exam", permanent: true },
      { source: "/georgia-life-insurance-exam", destination: "/georgia/practice-exam", permanent: true },
      { source: "/georgia-life-insurance-exam/", destination: "/georgia/practice-exam", permanent: true },
      { source: "/indiana-life-insurance-exam", destination: "/indiana/practice-exam", permanent: true },
      { source: "/indiana-life-insurance-exam/", destination: "/indiana/practice-exam", permanent: true },
      { source: "/massachusetts-life-insurance-exam-prep", destination: "/massachusetts/practice-exam", permanent: true },
      { source: "/massachusetts-life-insurance-exam-prep/", destination: "/massachusetts/practice-exam", permanent: true },
      { source: "/iowa-life-insurance-exam-study-guide", destination: "/iowa/practice-exam", permanent: true },
      { source: "/iowa-life-insurance-exam-study-guide/", destination: "/iowa/practice-exam", permanent: true },
      { source: "/kentucky-life-insurance-exam-study-guide", destination: "/kentucky/practice-exam", permanent: true },
      { source: "/kentucky-life-insurance-exam-study-guide/", destination: "/kentucky/practice-exam", permanent: true },
      { source: "/texas-life-insurance-exam-flashcards-every-candidate-needs", destination: "/texas/practice-exam", permanent: true },
      { source: "/texas-life-insurance-exam-flashcards-every-candidate-needs/", destination: "/texas/practice-exam", permanent: true },
      { source: "/online-pre-licensing-training-for-florida-insurance-exam", destination: "/florida/prelicensing", permanent: true },
      { source: "/online-pre-licensing-training-for-florida-insurance-exam/", destination: "/florida/prelicensing", permanent: true },
      { source: "/everything-about-the-california-insurance-license-exam-requirements", destination: "/california/requirements", permanent: true },
      { source: "/everything-about-the-california-insurance-license-exam-requirements/", destination: "/california/requirements", permanent: true },
      { source: "/alabama-insurance-license-guide-to-the-70-passing-score", destination: "/alabama", permanent: true },
      { source: "/alabama-insurance-license-guide-to-the-70-passing-score/", destination: "/alabama", permanent: true },
      { source: "/alabama-online-insurance-prelicense-and-continuing-education-courses", destination: "/alabama", permanent: true },
      { source: "/alabama-online-insurance-prelicense-and-continuing-education-courses/", destination: "/alabama", permanent: true },

      // Legacy generic blog posts → /blog hub
      { source: "/health-insurance-license-exam-in-2026-whats-changed", destination: "/blog/health-insurance-license", permanent: true },
      { source: "/health-insurance-license-exam-in-2026-whats-changed/", destination: "/blog/health-insurance-license", permanent: true },
      { source: "/how-long-to-study-for-life-insurance-exam", destination: "/how-long-to-get-insurance-license", permanent: true },
      { source: "/how-long-to-study-for-life-insurance-exam/", destination: "/how-long-to-get-insurance-license", permanent: true },
      { source: "/how-pre-licensing-training-shapes-strong-insurance-careers", destination: "/blog/how-to-become-an-insurance-agent", permanent: true },
      { source: "/how-pre-licensing-training-shapes-strong-insurance-careers/", destination: "/blog/how-to-become-an-insurance-agent", permanent: true },
      { source: "/get-an-insurance-license-overview", destination: "/", permanent: true },
      { source: "/get-an-insurance-license-overview/", destination: "/", permanent: true },
      { source: "/life-insurance-exam-prep-work-life-balance", destination: "/insurance-exam-guide", permanent: true },
      { source: "/life-insurance-exam-prep-work-life-balance/", destination: "/insurance-exam-guide", permanent: true },
      { source: "/life-insurance-license-exam-creating-a-study-plan", destination: "/study-guide", permanent: true },
      { source: "/life-insurance-license-exam-creating-a-study-plan/", destination: "/study-guide", permanent: true },
      { source: "/unlock-your-career-potential-with-online-insurance-license-courses", destination: "/prelicensing", permanent: true },
      { source: "/unlock-your-career-potential-with-online-insurance-license-courses/", destination: "/prelicensing", permanent: true },
      { source: "/unlocking-your-future-the-path-to-becoming-a-licensed-insurance-agent", destination: "/blog/how-to-become-an-insurance-agent", permanent: true },
      { source: "/unlocking-your-future-the-path-to-becoming-a-licensed-insurance-agent/", destination: "/blog/how-to-become-an-insurance-agent", permanent: true },
      { source: "/which-course-is-best-for-life-and-health-insurance-license-exam", destination: "/prelicensing", permanent: true },
      { source: "/which-course-is-best-for-life-and-health-insurance-license-exam/", destination: "/prelicensing", permanent: true },
      { source: "/why-most-candidates-fail-the-regulatory-section-how-to-avoid-it", destination: "/insurance-exam-guide", permanent: true },
      { source: "/why-most-candidates-fail-the-regulatory-section-how-to-avoid-it/", destination: "/insurance-exam-guide", permanent: true },
      { source: "/pre-licensing-insurance-course", destination: "/prelicensing", permanent: true },
      { source: "/pre-licensing-insurance-course/", destination: "/prelicensing", permanent: true },
      { source: "/series-6-vs-series-7-which-finra-exam-is-best-for-insurance-agents", destination: "/", permanent: true },
      { source: "/series-6-vs-series-7-which-finra-exam-is-best-for-insurance-agents/", destination: "/", permanent: true },

      // Legacy hub/landing pages
      { source: "/landing", destination: "/", permanent: true },
      { source: "/landing/", destination: "/", permanent: true },
      { source: "/partner-solutions", destination: "/partners", permanent: true },
      { source: "/partner-solutions/", destination: "/partners", permanent: true },
      { source: "/press-and-media", destination: "/press", permanent: true },
      { source: "/press-and-media/", destination: "/press", permanent: true },
      { source: "/dynamic-data", destination: "/", permanent: true },
      { source: "/dynamic-data/", destination: "/", permanent: true },
      { source: "/insurance-pre-licensing-courses-justinsurance-page-3", destination: "/prelicensing", permanent: true },
      { source: "/insurance-pre-licensing-courses-justinsurance-page-3/", destination: "/prelicensing", permanent: true },

      // WP author archives + pagination variants
      { source: "/author/:path*", destination: "/about", permanent: true },
    ];

    // Force www.justinsuranceco.com → apex justinsuranceco.com (301 permanent).
    // Without this, www subdomain returns 200 at every URL — fragments
    // canonical authority and causes duplicate-content flags in GSC.
    const wwwRedirect = [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.justinsuranceco.com" }],
        destination: "https://justinsuranceco.com/:path*",
        permanent: true,
      },
    ];

    // Global trailing-slash → no-slash redirect. Must be LAST so that specific
    // rules above (e.g. /refund-policy/ → /terms) still fire first.
    // Destination is ABSOLUTE apex so on a www request this collapses
    // www+slash to a single hop (otherwise the relative `/path` resolves
    // back onto www and forces a second hop through the www→apex rule).
    const trailingSlashRedirect = [
      { source: "/:path+/", destination: "https://justinsuranceco.com/:path+", permanent: true },
    ];

    return [...wwwRedirect, ...kaplanMirrorRedirects, ...stateRedirects, ...legacyPageRedirects, ...trailingSlashRedirect];
  },
};

export default nextConfig;
