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

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname, search } = req.nextUrl;

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
