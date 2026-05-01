/**
 * Sitemap-splitting helpers. Lives under src/app/sitemaps/_lib so the
 * underscore prefix keeps Next.js routing from treating it as a route segment.
 *
 * We classify every entry produced by `generateSitemapEntries()` (plus the
 * extras the old monolithic sitemap.ts appended) into one of three buckets:
 *
 *   marketing — site-wide top-level pages (homepage, /about, /compare, etc.)
 *   states    — every URL whose first path segment is a state slug,
 *               plus the national /property-and-casualty-ce hub which is
 *               conceptually a state-product index page.
 *   blog      — /blog, /blog/[cluster], /blog/[cluster]/[slug]
 *
 * Returns one xml string per bucket, ready to be served by the route handlers.
 */

import { generateSitemapEntries, type SitemapEntry } from "@/lib/sitemap-data";
import { ALL_STATE_SLUGS } from "@/lib/states";
import { PC_STATE_SLUGS, PC_CE_PACKAGES } from "@/data/pc-ce-packages";

const BASE_URL = "https://justinsuranceco.com";

export type Bucket = "marketing" | "states" | "blog";

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Build the full URL set, mirroring what the previous monolithic sitemap.ts
 * returned. Kept colocated here so we don't have to touch src/lib/sitemap-data.ts.
 */
function allEntries(): SitemapEntry[] {
  const lastModified = todayString();
  const entries: SitemapEntry[] = [...generateSitemapEntries()];

  // /[state]/cost — 50 entries minus /new-york (parity with sitemap-data.ts).
  for (const slug of ALL_STATE_SLUGS) {
    if (slug === "new-york") continue;
    entries.push({
      url: `${BASE_URL}/${slug}/cost`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  // Spanish-language pilot pages.
  for (const slug of ["florida", "texas"]) {
    entries.push({
      url: `${BASE_URL}/es/${slug}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Author bio.
  entries.push({
    url: `${BASE_URL}/about/justin-vom-eigen`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  });

  // Property & Casualty CE — national hub.
  entries.push({
    url: `${BASE_URL}/property-and-casualty-ce/`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  });

  // P&C state hubs.
  for (const slug of PC_STATE_SLUGS) {
    entries.push({
      url: `${BASE_URL}/${slug}/continuing-education/property-and-casualty/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // P&C multi-package detail pages (only packages with packageSlug).
  for (const p of PC_CE_PACKAGES) {
    if (!p.packageSlug) continue;
    entries.push({
      url: `${BASE_URL}/${p.stateSlug}/continuing-education/property-and-casualty/${p.packageSlug}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  return entries;
}

/**
 * Classify a single URL into one of three buckets. The order of checks
 * matters: blog wins over state (no /blog URL contains a state slug, but
 * we keep blog first defensively), and the national /property-and-casualty-ce
 * hub stays in marketing.
 */
function classify(url: string): Bucket {
  // Strip protocol+host so we only inspect the path.
  const path = url.replace(BASE_URL, "");

  if (path === "/blog" || path.startsWith("/blog/")) {
    return "blog";
  }

  // State-prefixed URLs: /[state-slug]/...  (also matches Spanish /es/[state]/)
  // We also treat /[state]/continuing-education/property-and-casualty/* as state.
  // Detect by checking the first path segment against ALL_STATE_SLUGS.
  const firstSegment = path.split("/").filter(Boolean)[0];
  if (firstSegment && (ALL_STATE_SLUGS as readonly string[]).includes(firstSegment)) {
    return "states";
  }
  // Spanish state pages: /es/florida, /es/texas → group with states bucket
  // since they're state-specific surfaces.
  if (firstSegment === "es") {
    return "states";
  }

  return "marketing";
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function entriesToUrlset(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n` +
        `    <loc>${escapeXml(e.url)}</loc>\n` +
        `    <lastmod>${e.lastModified}</lastmod>\n` +
        `    <changefreq>${e.changeFrequency}</changefreq>\n` +
        `    <priority>${e.priority.toFixed(2)}</priority>\n` +
        `  </url>\n`
    )
    .join("");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls +
    `</urlset>\n`
  );
}

/**
 * Returns the XML body for one bucket. Cached per-bucket-per-request only;
 * route handlers run at build time when `force-static` is set so this runs once.
 */
export function bucketXml(bucket: Bucket): string {
  const filtered = allEntries().filter((e) => classify(e.url) === bucket);
  return entriesToUrlset(filtered);
}

/** Used by tests / inspection. */
export function bucketCount(bucket: Bucket): number {
  return allEntries().filter((e) => classify(e.url) === bucket).length;
}
