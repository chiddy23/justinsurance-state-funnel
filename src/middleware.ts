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
//   7 (128) CANDIDATE scraper verdict (composite — see below)
const KNOWN_SCRAPER_UAS: ReadonlyArray<string> = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Safari/605.1.15",
];

function computeSigBits(req: NextRequest): number {
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

    // Reuse the site's existing allowed-bot regex so Googlebot/Bingbot/etc.
    // never get flagged as candidate scrapers.
    const notAllowedBot = !ALLOWED_BOT_UA.test(ua);

    const bit7 =
      bit0 &&
      ((bit2 && !bit3) || (bit6 && !bit5)) &&
      notAllowedBot &&
      !hasAdParam;

    return (
      (bit0 ? 1 : 0) |
      (bit1 ? 2 : 0) |
      (bit2 ? 4 : 0) |
      (bit3 ? 8 : 0) |
      (bit4 ? 16 : 0) |
      (bit5 ? 32 : 0) |
      (bit6 ? 64 : 0) |
      (bit7 ? 128 : 0)
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
  served = 200
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
      sig_bits: computeSigBits(req),
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
    logRequest(req, event, 403);
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
      logRequest(req, event, 200);
      return NextResponse.next();
    }
    // Surveillance while the site is dark: keep logging every request to
    // BigQuery (IP + user-agent + path + geo) so we can see who is hammering
    // the maintenance page — e.g. competitor scrapers (AD Banker 64.126.111.2 /
    // AS18712, ExamFX, masked/rotating-IP crawlers). logRequest self-skips
    // /certificate/, /api, prefetches, and empty-UA traffic, so this adds no
    // PII and no self-logging loop — and it honors GPC/opt-out (see logRequest).
    logRequest(req, event, 503);
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
    // Pass-through: the ONLY branch that logs. 410s and redirects are not
    // visits (the redirected request re-enters middleware and logs then).
    logRequest(req, event, 200);
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
