/**
 * Sitemap index — references the three content-type sub-sitemaps.
 *
 * Next.js' built-in `sitemap.ts` metadata convention only emits a `<urlset>`,
 * so we hand-roll a route handler that returns a `<sitemapindex>` instead.
 *
 * Sub-sitemaps live under `/sitemaps/{type}.xml` and are implemented as their
 * own route handlers. Splitting by content type makes Search Console's
 * "discovered / indexed" reporting actionable per surface (marketing vs
 * states vs blog) instead of one undifferentiated bucket.
 */

const BASE_URL = "https://justinsuranceco.com";

const SUB_SITEMAPS = [
  "marketing",
  "states",
  "blog",
] as const;

export const dynamic = "force-static";

export function GET(): Response {
  const lastmod = new Date().toISOString();
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    SUB_SITEMAPS.map(
      (name) =>
        `  <sitemap>\n` +
        `    <loc>${BASE_URL}/sitemaps/${name}.xml</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `  </sitemap>\n`
    ).join("") +
    `</sitemapindex>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
