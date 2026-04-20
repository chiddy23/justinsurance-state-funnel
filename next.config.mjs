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
