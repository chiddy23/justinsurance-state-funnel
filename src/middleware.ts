import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

// Canonical apex host. Anything else (www subdomain, trailing slash on the
// path) must be redirected here in a single 308 — never a chain.
//
// Caveat: Vercel's platform-level trailing-slash redirect (driven by the
// project's "Trailing Slash" dashboard setting) fires at the edge BEFORE
// middleware. While that setting is enabled, this middleware will only
// fire on canonical requests (no-op) and never get a chance to intercept
// trailing-slash or www requests. Set the dashboard "Trailing Slash"
// setting to "No Preference" to hand control back to this middleware so
// host+slash transforms collapse into a single absolute 308.
// `skipTrailingSlashRedirect: true` in next.config.mjs disables the
// framework-level redirect but does NOT override the platform setting.
const APEX_HOST = "justinsuranceco.com";
const WWW_HOST = "www.justinsuranceco.com";

// Legacy WordPress paths that no longer exist and never will. Returning a
// 410 Gone (instead of 301-to-homepage) tells Google to permanently
// deindex these URLs rather than continuing to track them as "still
// alive somewhere". Matches /wp-admin, /wp-content, /wp-includes, /feed
// at the path root, with or without subpaths or trailing slashes. Also
// matches the WP-style nested feed URLs like /blog/feed.
//
// IMPORTANT: framework-level redirects in next.config.mjs and platform
// redirects in vercel.json fire BEFORE middleware. The corresponding
// rules in those files have been removed so this middleware can serve
// the 410 response.
const GONE_PATH_REGEX =
  /^\/(?:wp-admin|wp-content|wp-includes)(?:\/|$)|^\/feed(?:\/|$)|\/feed\/?$/;

const GONE_BODY =
  "Gone — this URL has been permanently removed.\n\nThis legacy WordPress path no longer exists on justinsuranceco.com.\n";

// ---------------------------------------------------------------------------
// Scraper-signal bitmask (MONITOR-ONLY — this NEVER affects the response).
//
// Computes an integer bitmask of per-request header fingerprints from the
// ORIGINAL request and logs it (sig_bits) alongside the visit record. This
// records which requests a FUTURE header-based defense WOULD flag, so we can
// prove it hits only scrapers before ever enforcing anything. It changes
// NOTHING about what a visitor is served — sig_bits is purely a logged field.
// Every header read is null-safe and the whole computation is wrapped so it can
// never throw; any uncertainty defaults a bit to 0.
//
// Bit map (value = 1 << bit):
//   0 (1)   Referer missing or empty
//   1 (2)   UA exactly matches a known scraper UA string
//   2 (4)   UA contains "Chrome/"
//   3 (8)   sec-ch-ua present & non-empty (real Chrome always sends it)
//   4 (16)  sec-fetch-mode present
//   5 (32)  accept-language present & non-empty
//   6 (64)  UA claims desktop Safari (Version/ + Safari, no Chrome)
//   7 (128) CANDIDATE scraper verdict — CLIENT-HINTS-CENTRIC composite (below).
//           A genuine modern Chrome ALWAYS sends sec-ch-ua; a request claiming
//           "Chrome/" with NO sec-ch-ua is the scraper tell. This no longer
//           requires an empty referer (bit0), so it also catches the
//           injected-referrer variant that started 2026-07-19.
//   8 (256) Injected/fake-referrer tell — referer host is baidu/yandex, or a
//           self-referrer with no client hints. OBSERVABILITY ONLY; NOT part of
//           the bit7 verdict and NEVER used for enforcement.
const KNOWN_SCRAPER_UAS: ReadonlyArray<string> = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Safari/605.1.15",
];

// Sig-bits-only bot allow-list. USED EXCLUSIVELY inside computeSigBits to exempt
// known search/social crawlers (plus HubSpot, which presents a plain Chrome UA)
// from the bit7 verdict. This is intentionally SEPARATE from the geo-fence's
// ALLOWED_BOT_UA: adding "hubspot" here must NOT widen what the geo-fence lets
// through the region wall. Keep the two lists independent.
const SIGBITS_UA_ALLOW =
  /(googlebot|bingbot|applebot|duckduckbot|facebookexternalhit|linkedinbot|twitterbot|slackbot|google-inspectiontool|hubspot)/i;

function computeSigBits(req: NextRequest, verifiedCrawler: boolean): number {
  try {
    const h = req.headers;
    const ua = h.get("user-agent") ?? "";
    const referer = h.get("referer") ?? "";
    const secChUa = (h.get("sec-ch-ua") ?? "").trim();
    const acceptLang = (h.get("accept-language") ?? "").trim();

    const bit0 = referer.trim() === ""; // Referer missing or empty
    const bit1 = KNOWN_SCRAPER_UAS.includes(ua); // exact known scraper UA
    const bit2 = ua.includes("Chrome/"); // Chrome-family UA
    const bit3 = secChUa !== ""; // sec-ch-ua present & non-empty
    const bit4 = h.get("sec-fetch-mode") !== null; // sec-fetch-mode present
    const bit5 = acceptLang !== ""; // accept-language present & non-empty
    const bit6 = // desktop Safari claim
      ua.includes("Version/") && ua.includes("Safari") && !ua.includes("Chrome");

    // No ad-attribution query params on the ORIGINAL request URL (a real ad
    // click almost always carries gclid/fbclid/utm_*).
    let hasAdParam = false;
    try {
      const sp = req.nextUrl.searchParams;
      hasAdParam =
        sp.has("gclid") ||
        sp.has("fbclid") ||
        Array.from(sp.keys()).some((k) => k.toLowerCase().startsWith("utm_"));
    } catch {
      hasAdParam = false; // uncertain → treat as "no ad param" won't force bit7
    }

    // Sig-bits-only allow-list so Googlebot/Bingbot/HubSpot/etc. never get
    // flagged as candidate scrapers. This is a belt on top of the spoof-proof IP
    // check (verifiedCrawler): it also spares social/link-preview crawlers whose
    // IPs we do not verify (applebot, facebookexternalhit, ...). It is DELIBERATELY
    // separate from the geo-fence's ALLOWED_BOT_UA — HubSpot is exempt here but
    // must not thereby be waved through the region wall.
    const notAllowedBot = !SIGBITS_UA_ALLOW.test(ua);

    // First-party returning-visitor exemption. A visitor carrying our own ji_vid
    // (set on a prior real visit — read from BOTH the cookie and the query string,
    // matching how logRequest / the collect route resolve it) is a returning human,
    // never the cookieless scraper (which sends 0 ji_vid in the data). Exempt them
    // from the bit7 verdict as defense-in-depth for when enforcement is enabled.
    let hasJiVid = false;
    try {
      hasJiVid = !!(
        req.cookies.get("ji_vid")?.value ||
        req.nextUrl.searchParams.get("ji_vid")
      );
    } catch {
      hasJiVid = false; // uncertain → never forces the verdict either way
    }

    // CLIENT-HINTS-CENTRIC verdict. The empty-referer requirement (bit0) is
    // DROPPED so this catches BOTH the original no-referer scraper AND the
    // 2026-07-19 injected-referrer variant (both omit sec-ch-ua). It stays
    // clean of real customers: a genuine modern Chrome always sends sec-ch-ua
    // (so bit3 clears BOTH branches); real non-Chrome browsers fail the Chrome-
    // claim; the Safari branch is guarded by accept-language AND sec-ch-ua; any
    // ad click (gclid/fbclid/utm) is exempt; returning visitors (ji_vid) are
    // exempt; and verified Googlebot/Bingbot IPs are exempt.
    const bit7 =
      ((bit2 && !bit3) || (bit6 && !bit5 && !bit3)) &&
      notAllowedBot &&
      !hasAdParam &&
      !hasJiVid &&
      !verifiedCrawler;

    // OBSERVABILITY-ONLY (bit8): injected/fake-referrer tell. A US/CA-only site
    // seeing a baidu/yandex referer, or a self-referrer with no client hints,
    // matches the injected-referrer scraper. NOT part of bit7, never enforced.
    let bit8 = false;
    try {
      if (referer) {
        const refHost = new URL(referer).hostname.toLowerCase();
        const fakeSearchRef = /(?:^|\.)(?:baidu\.com|yandex\.(?:com|ru))$/.test(
          refHost
        );
        const selfRefNoHints =
          (refHost === APEX_HOST || refHost === WWW_HOST) && !bit3;
        bit8 = fakeSearchRef || selfRefNoHints;
      }
    } catch {
      bit8 = false; // unparseable referer → no signal
    }

    return (
      (bit0 ? 1 : 0) |
      (bit1 ? 2 : 0) |
      (bit2 ? 4 : 0) |
      (bit3 ? 8 : 0) |
      (bit4 ? 16 : 0) |
      (bit5 ? 32 : 0) |
      (bit6 ? 64 : 0) |
      (bit7 ? 128 : 0) |
      (bit8 ? 256 : 0)
    );
  } catch {
    // Any unexpected failure → emit a neutral 0 rather than risk a throw.
    return 0;
  }
}

// ---------------------------------------------------------------------------
// Attribution request logging (fire-and-forget).
//
// On the PASS-THROUGH path only (never the 410 or redirect branches) we POST a
// compact visit record to /api/collect, which streams it into BigQuery
// (site_requests). This powers IP+time purchase attribution against
// Authorize.net's customerIP/submitTimeUTC.
//
// HARD RULE for this revenue site: logging must NEVER affect the response.
// The whole block is wrapped in try/catch, the fetch gets .catch(()=>{}),
// and it runs inside event.waitUntil() so the response is never delayed.
// ---------------------------------------------------------------------------
function logRequest(
  req: NextRequest,
  event: NextFetchEvent,
  // HTTP status this request is being served (200 pass-through, 503 maintenance,
  // 403 geo-block). Warehoused so we can see whether scrapers are actually
  // getting content (200) or just harvesting the maintenance page (503).
  served = 200,
  // Whether the client IP is in a published Googlebot/Bingbot range. Threaded
  // in so sig_bits exempts verified crawlers (spoof-proof — see computeSigBits).
  verifiedCrawler = false
): void {
  try {
    const { pathname, searchParams, origin } = req.nextUrl;

    // Skip: API + Next internals (belt-and-suspenders — the matcher already
    // excludes these; /api especially, to prevent a self-logging loop).
    if (pathname.startsWith("/api") || pathname.startsWith("/_next")) return;

    // Skip: certificate pages. Absorb embeds these as
    // /certificate/<slug>?firstName=..&lastName=..&email=.. — that query
    // string is student PII and must never reach BigQuery via this logger.
    // Bail out entirely rather than logging with an empty query so no
    // certificate traffic (path or param) is captured by this pipeline.
    if (pathname.startsWith("/certificate/")) return;

    // Skip: empty user-agent (junk traffic, nothing to attribute).
    const userAgent = req.headers.get("user-agent") ?? "";
    if (!userAgent.trim()) return;

    // Skip: prefetches (Next router / browser speculative loads — not visits).
    const secPurpose = (req.headers.get("sec-purpose") ?? "").toLowerCase();
    const purpose = (req.headers.get("purpose") ?? "").toLowerCase();
    if (
      secPurpose.includes("prefetch") ||
      req.headers.get("next-router-prefetch") !== null ||
      purpose === "prefetch"
    ) {
      return;
    }

    // Skip: anything that isn't a real document navigation. Next.js App Router
    // viewport-prefetches every visible <Link> (RSC fetches that dodge the
    // headers above) — observed inflating one real pageview into dozens of
    // phantom "visits". Modern browsers mark true page loads with
    // Sec-Fetch-Dest: document; keep those plus requests without the header
    // (older browsers / non-browser clients, which the is_bot flag handles).
    const fetchDest = (req.headers.get("sec-fetch-dest") ?? "").toLowerCase();
    if (fetchDest && fetchDest !== "document" && fetchDest !== "iframe") {
      return;
    }
    if (req.headers.get("rsc") === "1") {
      return;
    }

    // Privacy audit 2026-07-14 (PRIV-01/PRIV-03): honor Global Privacy Control
    // and our own opt-out cookie for the first-party attribution pipeline —
    // the privacy policy promises GPC is treated as an opt-out of "sharing".
    // We still count the visit (aggregate analytics) but strip every
    // identifier/attribution field so nothing about the person is retained.
    const gpcOptOut =
      req.headers.get("sec-gpc") === "1" ||
      req.cookies.get("ji_optout")?.value === "1";

    // Real client IP = first entry of x-forwarded-for.
    const xff = req.headers.get("x-forwarded-for") ?? "";
    const ip = gpcOptOut ? "" : (xff.split(",")[0] ?? "").trim();

    // Vercel URI-encodes the city header (e.g. "S%C3%A3o%20Paulo").
    let city = req.headers.get("x-vercel-ip-city") ?? "";
    try {
      city = decodeURIComponent(city);
    } catch {
      // Malformed encoding — keep the raw header value.
    }

    const payload = {
      ts: new Date().toISOString(),
      ip,
      path: pathname,
      // Audit 2026-07-14 (SEC-05): warehouse only known marketing params —
      // never the raw query string, so a future link decorated with an email/
      // phone param can't land PII in BigQuery.
      query: (() => {
        const ALLOWED = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid","ji_vid","ref","src","KeyName"];
        const kept: string[] = [];
        searchParams.forEach((v, k) => {
          if (ALLOWED.includes(k)) kept.push(`${k}=${v.slice(0, 200)}`);
        });
        return kept.join("&");
      })(),
      referrer: req.headers.get("referer") ?? "",
      utm_source: searchParams.get("utm_source") ?? "",
      utm_medium: searchParams.get("utm_medium") ?? "",
      utm_campaign: searchParams.get("utm_campaign") ?? "",
      gclid: gpcOptOut ? "" : searchParams.get("gclid") ?? "",
      fbclid: gpcOptOut ? "" : searchParams.get("fbclid") ?? "",
      ji_vid: gpcOptOut
        ? ""
        : req.cookies.get("ji_vid")?.value ?? searchParams.get("ji_vid") ?? "",
      city,
      region: req.headers.get("x-vercel-ip-country-region") ?? "",
      country: req.headers.get("x-vercel-ip-country") ?? "",
      postal: gpcOptOut ? "" : req.headers.get("x-vercel-ip-postal-code") ?? "",
      user_agent: userAgent.slice(0, 400),
      status: served,
      // Monitor-only scraper-signal bitmask (0..255). Purely a logged field —
      // computed defensively, never affects the response. See computeSigBits.
      sig_bits: computeSigBits(req, verifiedCrawler),
    };

    event.waitUntil(
      fetch(`${origin}/api/collect`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-collect-key": process.env.COLLECT_KEY ?? "",
        },
        body: JSON.stringify(payload),
      }).catch(() => {})
    );
  } catch {
    // Swallow EVERYTHING — a logging bug must never break the site.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Abusive-scraper network blocklist.
//
// Hard-deny known datacenter/cloud IP ranges that ran covert full-site content
// scraping (2026-07-02 incident: Tencent Cloud / Aceville AS132203, Singapore +
// Hong Kong — ~1,600 rotating IPs, ~5,000 requests copying every state /
// prelicensing / blog page; confirmed via APNIC RDAP + bgp.he.net). These are
// hosting ASNs with negligible legitimate human traffic, so a 403 is safe.
// Terms Section 7 ("Acceptable Use & Automated Access") declares such access
// unauthorized; this enforces it at the edge. Add CIDRs as new abuse appears.
//
// This is IP/CIDR blocking in app middleware. For DURABLE ASN-level blocking
// that survives IP rotation across Tencent's ~1,000 prefixes, ALSO deny
// AS132203 in the Vercel Firewall (Project → Firewall) — it runs before
// middleware and doesn't consume invocations. To broaden here instead, add
// Tencent's parent allocation cidr("43.128.0.0", 10) (covers 43.128–43.191.x).
const BLOCKED_CIDRS: ReadonlyArray<readonly [number, number]> = [
  cidr("43.172.0.0", 15), // Tencent Cloud Singapore (covers 43.172.x + 43.173.x)
  cidr("43.154.0.0", 16), // Tencent Cloud Hong Kong (same operation)
  cidr("43.129.0.0", 16), // Tencent Cloud Hong Kong (same operation)
  cidr("43.132.0.0", 16), // Tencent Cloud Hong Kong (same operation)
  // Oracle Cloud (AS31898) — the "Scrapy/2.16.0" content-harvest operation that
  // rotated 129.153.93.55 / 129.153.107.251, 137.131.26.115, 132.226.106.216,
  // pulling blog + state pages 2026-07-02 → 2026-07-14 (still active, ~31 min/req,
  // working from a pre-built URL list). Datacenter — negligible human traffic.
  cidr("129.153.0.0", 16),
  cidr("137.131.0.0", 16),
  cidr("132.226.0.0", 16),
  // Microsoft Azure Atlanta (AS8075) — the 74.7.x rotating blog crawler (Mac/Chrome
  // UA, 11 IPs, ~2,200 hits, active through 2026-07-14). Only the /24s it used —
  // NOT all of AS8075, which also carries Bingbot.
  cidr("74.7.227.0", 24),
  cidr("74.7.228.0", 23), // 74.7.228.x + 74.7.229.x
  cidr("74.7.242.0", 24),
  cidr("74.7.36.0", 24),
  // 64.126.111.2 (Everfast Fiber / AS18712, static.aeshost.net, Overland Park KS —
  // AD Banker & Company's HQ city) pulled a 223-page near-full site mirror 2026-07-02.
  // Attribution to AD Banker is inferred (location + full-mirror behavior), NOT
  // confirmed by registration. Static hosting /24, so a block is safe.
  cidr("64.126.111.0", 24),
  // Cloud Innovation Ltd (AFRINIC, Seychelles; tech agent Larus Ltd HK; assoc. Lu
  // Heng) — the ROTATING residential-proxy content-scrape (~2,000 one-shot IPs/day,
  // spoofed Safari UA, faked google.com referrer; harvests the blog corpus; active
  // through 2026-07-15). RDAP-confirmed 2026-07-15 across 10 observed /24s. It
  // rotates across the whole allocation AND some exits masquerade as US Cox-
  // residential (so the geo-fence alone won't stop those) — block the parent CIL
  // blocks, not just the seen /24s. A US/CA-only site has zero legit users here.
  cidr("45.192.0.0", 12), //  45.192.0.0 – 45.207.255.255
  cidr("154.80.0.0", 12), // 154.80.0.0 – 154.95.255.255
  cidr("156.224.0.0", 11), // 156.224.0.0 – 156.255.255.255
  // NOT blocked: 156.63.69.0/24 — that is State of Ohio (ARIN, AS19902), a
  // mis-attributed outlier, not part of this scrape.
  //
  // 2026-07-16 escalation: the same operator (same spoofed "Chrome/143" +
  // "Version/26.2 Safari" UAs, no-referrer, one-shot-per-IP) MOVED to fresh
  // commercial-proxy vendors NOT covered above — ~2,300 IPs in 48h across
  // Datacamp/CDN77 (AS212238), M247 (AS9009), HostRoyale (AS203020/134450/
  // 44144/207990), Ace Data Centers (AS11798), Servers.com (AS7979), plus a
  // Bright Data residential layer that exits through real US ISP IPs. It hits
  // ~313 distinct /24s, so per-CIDR blocking here is futile — the durable fix
  // is an ASN-level deny at the Vercel Firewall for those datacenter ASNs
  // (zero legit human traffic on them). See SCRAPER-DEFENSE-2026-07-17.md.
  // The residential-proxy exits can't be IP-blocked without hitting real Cox/
  // Comcast users; while MAINTENANCE_MODE=1 they only reach the 503 page anyway.
];

// NOTE (2026-07-15): a UA-string kill was considered for the proxy scan's
// "Version/26.2 Safari" fingerprint, but that is a REAL Safari version — Apple
// moved to calendar versioning in 2025 (Safari 18 → 26; 26.2 shipped Dec 2025).
// Blocking it would poison real Mac visitors. The tool (identified as Botasaurus
// via its default faked google.com Referer) can only be reliably fingerprinted
// at the TLS/JA4 layer, which Vercel middleware does not expose. So the scan is
// handled by the IP blocklist above + the geo-fence; no UA rule.

/** IPv4 dotted-quad → unsigned 32-bit int. Returns null for IPv6/malformed. */
function ipToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
    n = ((n << 8) | octet) >>> 0;
  }
  return n >>> 0;
}

/** Build a [network, mask] pair (both unsigned 32-bit) for a CIDR block. */
function cidr(base: string, bits: number): readonly [number, number] {
  const b = ipToInt(base) ?? 0;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return [(b & mask) >>> 0, mask] as const;
}

function isBlockedIp(ip: string): boolean {
  const n = ipToInt(ip);
  if (n === null) return false;
  for (const [net, mask] of BLOCKED_CIDRS) {
    if (((n & mask) >>> 0) === net) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Verified-crawler exemption by PUBLISHED IP RANGE (spoof-proof).
//
// A scraper can fake a Googlebot/Bingbot user-agent but it cannot source
// traffic from Google's or Microsoft's published crawler netblocks. We exempt
// those IPs from the bit7 verdict AND from any gated enforcement. This is the
// durable fix for the two legit crawlers the UA allow-list missed (a Google
// fetcher from 66.249.90.205 whose UA lacked the "Googlebot" token, and
// HubSpot presenting a plain Chrome UA).
//
// Ranges captured LIVE (do not hand-edit — refresh from source):
//   Google:  https://developers.google.com/search/apis/ipranges/googlebot.json
//            (creationTime 2026-07-22)
//   Bing:    https://www.bing.com/toolbox/bingbot.json
//
// The dense, contiguous Google blocks are stored as their parent aggregates.
// Each aggregate is wholly Google-owned crawler space (no third party sources
// from it), so this stays spoof-proof while keeping the list small. Critically,
// 66.249.64.0/19 also covers the observed real Googlebot-smartphone
// 66.249.90.205 — which the granular published file does NOT list (it currently
// stops at 66.249.79.x), so an exemption built from the raw /27s alone would
// STILL have missed it.
const VERIFIED_CRAWLER_CIDRS: ReadonlyArray<string> = [
  // --- Google (googlebot.json) ---
  "66.249.64.0/19", //  aggregate: published 66.249.64–79 /27s + covers 66.249.90.205
  "192.178.4.0/22", //  aggregate: published 192.178.4–7 /27s
  "2001:4860:4801::/48", // aggregate: published 2001:4860:4801:xx::/64 blocks
  "34.100.182.96/28", "34.101.50.144/28", "34.118.66.0/28", "34.118.254.0/28",
  "34.126.178.96/28", "34.146.150.144/28", "34.147.110.144/28", "34.151.74.144/28",
  "34.152.50.64/28", "34.154.114.144/28", "34.155.98.32/28", "34.165.18.176/28",
  "34.175.160.64/28", "34.176.130.16/28", "34.22.85.0/27", "34.64.82.64/28",
  "34.65.242.112/28", "34.80.50.80/28", "34.88.194.0/28", "34.89.10.80/28",
  "34.89.198.80/28", "34.96.162.48/28", "35.247.243.240/28",
  // --- Bing (bingbot.json) ---
  "157.55.39.0/24", "207.46.13.0/24", "40.77.167.0/24", "13.66.139.0/24",
  "13.66.144.0/24", "52.167.144.0/24", "13.67.10.16/28", "13.69.66.240/28",
  "13.71.172.224/28", "139.217.52.0/28", "191.233.204.224/28", "20.36.108.32/28",
  "20.43.120.16/28", "40.79.131.208/28", "40.79.186.176/28", "52.231.148.0/28",
  "20.79.107.240/28", "51.105.67.0/28", "20.125.163.80/28", "40.77.188.0/22",
  "65.55.210.0/24", "199.30.24.0/23", "40.77.202.0/24", "40.77.139.0/25",
  "20.74.197.0/28", "20.15.133.160/27", "40.77.177.0/24", "40.77.178.0/23",
];

// NOTE: no BigInt — this file's tsconfig target is < ES2020, so IPv6 addresses
// are represented as an array of eight 16-bit group numbers and matched group
// by group. IPv4 reuses the existing 32-bit ipToInt path. Edge-safe, no Node
// APIs, never throws.

/** Expand an IPv6 literal to eight 16-bit group numbers. Handles "::" and an
 *  embedded IPv4 tail (e.g. ::ffff:1.2.3.4). Returns null for malformed input. */
function ipv6ToGroups(ip: string): number[] | null {
  let s = ip.trim();
  const pct = s.indexOf("%"); // strip zone id
  if (pct !== -1) s = s.slice(0, pct);
  if (s.startsWith("[") && s.endsWith("]")) s = s.slice(1, -1);
  if (!s.includes(":")) return null;
  const halves = s.split("::");
  if (halves.length > 2) return null;
  const toGroups = (part: string): number[] | null => {
    if (part === "") return [];
    const gs = part.split(":");
    const out: number[] = [];
    for (const g of gs) {
      if (g.includes(".")) {
        const v4 = ipToInt(g); // embedded IPv4 → two 16-bit groups
        if (v4 === null) return null;
        out.push((v4 >>> 16) & 0xffff);
        out.push(v4 & 0xffff);
      } else {
        if (g.length === 0 || g.length > 4 || /[^0-9a-fA-F]/.test(g)) return null;
        out.push(parseInt(g, 16) & 0xffff);
      }
    }
    return out;
  };
  const head = toGroups(halves[0]);
  if (head === null) return null;
  let groups: number[];
  if (halves.length === 2) {
    const tail = toGroups(halves[1]);
    if (tail === null) return null;
    const missing = 8 - head.length - tail.length;
    if (missing < 0) return null;
    groups = head.concat(new Array<number>(missing).fill(0), tail);
  } else {
    groups = head;
  }
  return groups.length === 8 ? groups : null;
}

type VCidr =
  | { family: 4; base: number; mask: number }
  | { family: 6; groups: number[]; prefix: number };

/** Parse a CIDR string ("1.2.3.0/24" or "2001:db8::/32") into a match spec. */
function parseVCidr(c: string): VCidr | null {
  const slash = c.lastIndexOf("/");
  if (slash === -1) return null;
  const addr = c.slice(0, slash);
  const prefix = Number(c.slice(slash + 1));
  if (!Number.isInteger(prefix) || prefix < 0) return null;
  if (addr.includes(":")) {
    if (prefix > 128) return null;
    const g = ipv6ToGroups(addr);
    return g === null ? null : { family: 6, groups: g, prefix };
  }
  if (prefix > 32) return null;
  const n = ipToInt(addr);
  if (n === null) return null;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return { family: 4, base: (n & mask) >>> 0, mask };
}

const VERIFIED_CRAWLER_PARSED: ReadonlyArray<VCidr> = VERIFIED_CRAWLER_CIDRS
  .map(parseVCidr)
  .filter((c): c is VCidr => c !== null);

/** Prefix-match two IPv6 group arrays over `prefix` bits. */
function v6Match(ip: number[], net: number[], prefix: number): boolean {
  let bits = prefix;
  for (let i = 0; i < 8 && bits > 0; i++) {
    if (bits >= 16) {
      if (ip[i] !== net[i]) return false;
      bits -= 16;
    } else {
      const m = (0xffff << (16 - bits)) & 0xffff;
      if ((ip[i] & m) !== (net[i] & m)) return false;
      bits = 0;
    }
  }
  return true;
}

/** True when the client IP falls in a published Googlebot/Bingbot range.
 *  Edge-safe: pure integer/array math, no Node APIs. Never throws. */
function isVerifiedCrawler(ip: string): boolean {
  try {
    if (!ip) return false;
    let v4: number | null = null;
    if (ip.includes(":")) {
      const g = ipv6ToGroups(ip);
      if (g === null) return false;
      // IPv4-mapped/compatible (::ffff:a.b.c.d or ::a.b.c.d) → match as IPv4.
      if (g[0] === 0 && g[1] === 0 && g[2] === 0 && g[3] === 0 && g[4] === 0 &&
          (g[5] === 0xffff || g[5] === 0)) {
        v4 = (((g[6] << 16) | g[7]) >>> 0);
      } else {
        for (const c of VERIFIED_CRAWLER_PARSED) {
          if (c.family === 6 && v6Match(g, c.groups, c.prefix)) return true;
        }
        return false;
      }
    } else {
      v4 = ipToInt(ip);
    }
    if (v4 === null) return false;
    for (const c of VERIFIED_CRAWLER_PARSED) {
      if (c.family === 4 && ((v4 & c.mask) >>> 0) === c.base) return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Served to blocked scraper networks instead of a bare 403 — a self-contained
// taunt page that names the offender. Delivered with HTTP 200 ON PURPOSE:
// undiscerning scrapers store the body AS "content", so their dataset fills
// with this instead of real course data (poison-the-well). noindex keeps it
// out of search results, and it still cites the Terms §7 violation so it also
// serves as notice. No external assets, so it's cheap to serve.
const TROLL_PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Nice try, bot.</title>
<style>
:root{color-scheme:dark}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1020;color:#e6e9f2;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.card{max-width:640px;margin:24px;padding:32px 36px;background:#121a33;border:1px solid #24314f;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);line-height:1.65}
h1{margin:0 0 10px;font-size:30px}
a{color:#ffd166}b{color:#ffd166}
.tag{display:inline-block;background:#1e2a4a;border:1px solid #33436b;border-radius:999px;padding:3px 12px;font-size:12px;color:#9fb0d8;margin-bottom:18px;letter-spacing:.04em}
.small{color:#8090b8;font-size:12px;margin-top:22px}
</style></head>
<body><div class="card">
<div class="tag">AUTOMATED ACCESS DETECTED</div>
<h1>Gotcha.</h1>
<p>Hey there &mdash; yes, you. Rotating datacenter IPs, a spoofed browser user-agent, crawling on a slow timer to stay under the radar? We see all of it, and every request is logged. Bold look for one "person."</p>
<p>Bad news: there is nothing here for you. The whole site is walled off, every one of your requests gets blocked, and yes — this visit is logged too.</p>
<p>Scraping this site violates our <a href="/terms">Terms of Service, Section 7</a>. Consider yourself formally notified.</p>
<p>Enjoy this page instead — it is the only thing you are getting. Maybe go touch some grass?</p>
<p class="small">access unauthorized &middot; request logged &middot; JustInsurance LLC &middot; you are not a browser and we both know it</p>
</div></body></html>`;

// Geo-fence: JustInsurance serves the U.S. and Canadian insurance markets only.
// Everything else is denied at the edge — this alone removes the bulk of the
// foreign scanner/scraper noise (CN/VN/SG/BR/etc.). Vercel injects the visitor
// country via the x-vercel-ip-country header; when it is ABSENT (local dev / geo
// unavailable) we FAIL OPEN and never block. Known search + social-preview
// crawlers are allowed through regardless of country so SEO and link previews are
// unaffected. NOTE: this does NOT stop scrapers exiting through US proxy IPs
// (they read as "US") — those are handled by the IP/UA blocklist above.
const ALLOWED_COUNTRIES = new Set(["US", "CA"]);
const ALLOWED_BOT_UA =
  /(googlebot|bingbot|applebot|duckduckbot|facebookexternalhit|linkedinbot|twitterbot|slackbot|google-inspectiontool)/i;

const GEO_BLOCK_BODY = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Not available in your region</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1020;color:#e6e9f2;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif}.c{max-width:520px;margin:24px;padding:32px 36px;background:#121a33;border:1px solid #24314f;border-radius:16px;line-height:1.6;text-align:center}h1{margin:0 0 12px;font-size:24px}</style></head>
<body><div class="c"><h1>Not available in your region</h1><p>JustInsurance provides insurance prelicensing and continuing education for the <b>United States</b> and <b>Canada</b>. This site isn&rsquo;t available in your location.</p><p style="font-size:.8rem"><a style="color:#8fa6c8" href="/privacy-policy">Privacy Policy</a></p></div></body></html>`;

// Branded "we'll be back" page served to all human visitors while the marketing
// site is offline (MAINTENANCE_MODE env = "1"). Keeps enrolled students moving:
// the primary CTA links to the Absorb student portal so course/CE access is
// never interrupted, even when the marketing pages are down. Served with HTTP
// 503 + Retry-After (correct for temporary maintenance) and noindex so search
// engines don't cache the maintenance state. Self-contained (no external assets,
// which may 503 while offline).
const STUDENT_PORTAL_URL = "https://yourinsurancelicense.myabsorb.com/";
const MAINTENANCE_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Maintenance | JustInsurance</title>
<style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#0f2544;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}main{max-width:520px;padding:24px}h1{font-size:1.6rem;margin-bottom:.5rem}p{color:#c7d5ea;line-height:1.6}.btn{display:inline-block;margin:22px 0 8px;background:#f0c264;color:#0f2544;font-weight:700;font-size:1rem;text-decoration:none;padding:14px 34px;border-radius:10px;transition:background .15s}.btn:hover{background:#f5d489}</style>
</head><body><main>
<h1>Website Under Maintenance</h1>
<p>Our website is undergoing scheduled maintenance and will be back shortly. Your student portal is fully operational &mdash; log in below to access your courses and continue as usual.</p>
<a class="btn" href="${STUDENT_PORTAL_URL}">Student Login &rarr;</a>
<p>Questions? Email <a style="color:#f0c264" href="mailto:support@yourinsurancelicense.com">support@yourinsurancelicense.com</a>.</p>
<p style="font-size:.8rem;margin-top:14px"><a style="color:#8fa6c8" href="/privacy-policy">Privacy Policy</a> &middot; <a style="color:#8fa6c8" href="/terms">Terms</a></p>
</main></body></html>`;

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const host = req.headers.get("host") ?? "";
  const { pathname, search } = req.nextUrl;

  // Block abusive scraper networks before anything else — do not even serve
  // 410s or redirects to them. Client IP = first x-forwarded-for entry.
  const clientIp = ((req.headers.get("x-forwarded-for") ?? "").split(",")[0] ?? "").trim();
  // Poison known-bad IP ranges (incl. the Cloud Innovation proxy blocks added
  // 2026-07-15). See the UA note above for why there's no UA-based rule.
  if (clientIp && isBlockedIp(clientIp)) {
    return new NextResponse(TROLL_PAGE, {
      // 200 (not 403) on purpose — see TROLL_PAGE note (poison-the-well).
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "Cache-Control": "no-store",
      },
    });
  }

  // Spoof-proof verified-crawler flag (published Googlebot/Bingbot IP ranges).
  // Computed once; threaded into every logRequest (so sig_bits exempts verified
  // crawlers) and consulted by the gated enforcement branch below.
  const verifiedCrawler = isVerifiedCrawler(clientIp);

  // Geo-fence to US/CA. Runs after the IP blocklist (known bad actors still get
  // the poison page) and before maintenance/410 so out-of-region traffic is
  // denied regardless of site state. Fail open when the country header is missing;
  // let known crawlers through so SEO/link-previews are unaffected.
  const country = req.headers.get("x-vercel-ip-country");
  if (
    country &&
    !ALLOWED_COUNTRIES.has(country) &&
    !ALLOWED_BOT_UA.test(req.headers.get("user-agent") ?? "") &&
    // Privacy audit 2026-07-14 (PRIV-02/08): geo-blocked visitors are logged,
    // so the privacy policy must remain reachable for them.
    pathname !== "/privacy-policy"
  ) {
    logRequest(req, event, 403, verifiedCrawler);
    return new NextResponse(GEO_BLOCK_BODY, {
      status: 403,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
      },
    });
  }

  // 410 Gone for legacy WordPress paths. Must come BEFORE the host/slash
  // canonicalization branches so that a request to e.g.
  // www.justinsuranceco.com/wp-admin/ doesn't get bounced to apex first
  // and then 410'd on the second hop — single-hop is cheaper for crawlers
  // and clearer for SEO signals.
  if (GONE_PATH_REGEX.test(pathname)) {
    return new NextResponse(GONE_BODY, {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // Tell crawlers + CDNs not to cache the gone response too long;
        // a short cache is fine, but we don't want a stale 410 to outlive
        // a future legitimate revival of any of these path roots.
        "Cache-Control": "public, max-age=3600, must-revalidate",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  // Maintenance mode — serve the branded "back soon" page (with the student
  // portal login link) to every human visitor while the marketing site is
  // offline. The scraper blocklist and WP 410s above still take precedence.
  // Toggle by setting the MAINTENANCE_MODE env var to "1" in Vercel (then
  // redeploy); set it to anything else / unset to bring the full site back.
  if (process.env.MAINTENANCE_MODE === "1") {
    // Privacy audit 2026-07-14 (PRIV-02): the privacy policy + terms must stay
    // reachable while collection continues during maintenance (CCPA
    // notice-at-or-before-collection). Everything else still 503s.
    if (pathname === "/privacy-policy" || pathname === "/terms") {
      logRequest(req, event, 200, verifiedCrawler);
      return NextResponse.next();
    }
    // Surveillance while the site is dark: keep logging every request to
    // BigQuery (IP + user-agent + path + geo) so we can see who is hammering
    // the maintenance page — e.g. competitor scrapers (AD Banker 64.126.111.2 /
    // AS18712, ExamFX, masked/rotating-IP crawlers). logRequest self-skips
    // /certificate/, /api, prefetches, and empty-UA traffic, so this adds no
    // PII and no self-logging loop — and it honors GPC/opt-out (see logRequest).
    logRequest(req, event, 503, verifiedCrawler);
    return new NextResponse(MAINTENANCE_PAGE, {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
        "Retry-After": "3600",
      },
    });
  }

  const needsHostFix = host === WWW_HOST;
  const needsSlashFix = pathname !== "/" && pathname.endsWith("/");

  if (!needsHostFix && !needsSlashFix) {
    // GATED header-fingerprint enforcement (DEFAULT OFF — monitor-only).
    // Only when SCRAPER_ENFORCE === "1" AND this request carries the composite
    // scraper verdict (sig_bits bit7) AND is NOT a verified crawler do we serve
    // the SAME poison page the IP blocklist uses (poison-the-well, HTTP 200).
    // When the env is unset/anything-else the env check short-circuits FIRST —
    // computeSigBits is not even called here — so behavior is UNCHANGED and this
    // deploy alters ZERO visitor behavior. The verdict itself remains logged via
    // logRequest below regardless, so monitoring continues either way.
    if (
      process.env.SCRAPER_ENFORCE === "1" &&
      !verifiedCrawler &&
      (computeSigBits(req, verifiedCrawler) & 128) !== 0
    ) {
      logRequest(req, event, 200, verifiedCrawler);
      return new NextResponse(TROLL_PAGE, {
        // 200 (not 403) on purpose — see TROLL_PAGE note (poison-the-well).
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
          "Cache-Control": "no-store",
        },
      });
    }

    // Pass-through: the ONLY branch that logs. 410s and redirects are not
    // visits (the redirected request re-enters middleware and logs then).
    logRequest(req, event, 200, verifiedCrawler);
    return NextResponse.next();
  }

  const cleanPath = needsSlashFix ? pathname.replace(/\/+$/, "") : pathname;
  const target = `https://${APEX_HOST}${cleanPath}${search}`;
  return NextResponse.redirect(target, 308);
}

export const config = {
  // Match every page request except api routes, static assets, Next
  // internals, sitemaps, robots, favicon, and anything with a file extension
  // (images, CSS, JS). `api` is excluded so the middleware's own POST to
  // /api/collect can never re-enter middleware (self-logging loop); the only
  // other api route (certificate) doesn't rely on middleware.
  // The middleware itself short-circuits with NextResponse.next() when no
  // redirect is needed, so the cache path is undisturbed for normal traffic.
  matcher: [
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|video-sitemap.xml|.*\\..*).*)",
  ],
};
