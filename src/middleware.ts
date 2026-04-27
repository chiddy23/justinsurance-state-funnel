import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Canonical apex host. Anything else (www subdomain, trailing slash on the
// path) must be redirected here in a single 308 — never a chain.
//
// Why middleware instead of vercel.json: Next.js's framework-level
// trailing-slash redirect (driven by `trailingSlash: false`) fires at the
// Vercel edge BEFORE vercel.json is consulted, with a relative `Location`.
// On a www request that means hop 1 (relative slash strip, stays on www)
// then hop 2 (www→apex). Middleware runs ahead of the framework redirect,
// so we can collapse host fix + slash fix into one absolute redirect here.
const APEX_HOST = "justinsuranceco.com";
const WWW_HOST = "www.justinsuranceco.com";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname, search } = req.nextUrl;

  const needsHostFix = host === WWW_HOST;
  const needsSlashFix = pathname !== "/" && pathname.endsWith("/");

  if (!needsHostFix && !needsSlashFix) {
    const res = NextResponse.next();
    res.headers.set("x-mw", "noop");
    return res;
  }

  const cleanPath = needsSlashFix ? pathname.replace(/\/+$/, "") : pathname;
  const target = `https://${APEX_HOST}${cleanPath}${search}`;
  const res = NextResponse.redirect(target, 308);
  res.headers.set("x-mw", needsHostFix && needsSlashFix ? "host+slash" : needsHostFix ? "host" : "slash");
  return res;
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
