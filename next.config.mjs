/** @type {import('next').NextConfig} */
const nextConfig = {
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
      { source: "/which-course-is-best", destination: "/compare", permanent: true },
      { source: "/which-course-is-best/:path*", destination: "/compare", permanent: true },
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
      // WordPress admin/content/includes paths — safe to redirect home (not malicious to us)
      { source: "/wp-admin/:path*", destination: "/", permanent: true },
      { source: "/wp-content/:path*", destination: "/", permanent: true },
      { source: "/wp-includes/:path*", destination: "/", permanent: true },

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

      // Old WP pagination slugs /page-N/ (NOT /blog/page/N — that's handled earlier)
      { source: "/page-:num", destination: "/", permanent: true },

      // WP taxonomy archives — route to blog hub
      { source: "/tag/:path*", destination: "/blog", permanent: true },
      { source: "/category/:path*", destination: "/blog", permanent: true },

      // RSS feeds from pre-migration — route to blog
      { source: "/feed", destination: "/blog", permanent: true },
      { source: "/feed/", destination: "/blog", permanent: true },
      { source: "/:path*/feed", destination: "/blog", permanent: true },
      { source: "/:path*/feed/", destination: "/blog", permanent: true },

      // Old WP opt-in landing
      { source: "/optin-3", destination: "/", permanent: true },
      { source: "/optin-3/", destination: "/", permanent: true },
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

    return [...wwwRedirect, ...stateRedirects, ...legacyPageRedirects];
  },
};

export default nextConfig;
