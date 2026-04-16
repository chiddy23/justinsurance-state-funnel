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
      // Old WordPress blog/marketing pages → relevant new pages
      { source: "/insurance-pre-licensing-courses", destination: "/prelicensing", permanent: true },
      { source: "/get-a-life-insurance-license", destination: "/life-insurance-license", permanent: true },
      { source: "/get-a-life-insurance-license/:path*", destination: "/life-insurance-license", permanent: true },
      { source: "/insurance-license", destination: "/", permanent: true },
      { source: "/from-basics-to-pro", destination: "/study-guide", permanent: true },
      { source: "/from-basics-to-pro/:path*", destination: "/study-guide", permanent: true },
      { source: "/unlocking-your-future", destination: "/", permanent: true },
      { source: "/unlocking-your-future/:path*", destination: "/", permanent: true },
      { source: "/how-to-study-for-life-insurance-exam", destination: "/insurance-exam-guide", permanent: true },
      { source: "/how-to-study-for-life-insurance-exam/:path*", destination: "/insurance-exam-guide", permanent: true },
      { source: "/which-course-is-best", destination: "/compare", permanent: true },
      { source: "/which-course-is-best/:path*", destination: "/compare", permanent: true },
      { source: "/series-6-vs-series-7", destination: "/", permanent: true },
      { source: "/series-6-vs-series-7/:path*", destination: "/", permanent: true },
      { source: "/nc-life-insurance-practice-exam", destination: "/north-carolina/practice-exam", permanent: true },
    ];

    return [...stateRedirects, ...legacyPageRedirects];
  },
};

export default nextConfig;
