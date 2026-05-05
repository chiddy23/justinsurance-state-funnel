import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname, search } = req.nextUrl;

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

  const needsHostFix = host === WWW_HOST;
  const needsSlashFix = pathname !== "/" && pathname.endsWith("/");

  if (!needsHostFix && !needsSlashFix) {
    return NextResponse.next();
  }

  const cleanPath = needsSlashFix ? pathname.replace(/\/+$/, "") : pathname;
  const target = `https://${APEX_HOST}${cleanPath}${search}`;
  return NextResponse.redirect(target, 308);
}

export const config = {
  // Match every page request except static assets, Next internals, sitemaps,
  // robots, favicon, and anything with a file extension (images, CSS, JS).
  // The middleware itself short-circuits with NextResponse.next() when no
  // redirect is needed, so the cache path is undisturbed for normal traffic.
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|video-sitemap.xml|.*\\..*).*)",
  ],
};
