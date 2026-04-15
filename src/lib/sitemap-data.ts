import fs from "fs";
import path from "path";
import { ALL_STATE_SLUGS } from "./states";
import { ALL_LOA_SLUGS } from "./loa";

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
}

const BASE_URL = "https://justinsuranceco.com";

/**
 * Returns today's date as an ISO 8601 date string (YYYY-MM-DD).
 * Used as the lastModified value for all sitemap entries.
 */
function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Generates all sitemap entries for the JustInsurance state funnel.
 *
 * Entry counts:
 *   1   — homepage
 *   50  — state hub pages          (/[state]/)
 *   50  — prelicensing hub pages   (/[state]/prelicensing/)
 *   50  — CE hub pages             (/[state]/continuing-education/)
 *   50  — requirements pages       (/[state]/requirements/)
 *   150 — prelicensing course pages (/[state]/prelicensing/[loa]/)
 *   150 — CE course pages          (/[state]/continuing-education/[loa]/)
 *   1   — blog index               (/blog)
 *   29  — blog cluster pages       (/blog/[cluster])
 *   279 — blog post pages          (/blog/[cluster]/[slug])
 * ──────
 *   ~813 total (minus /new-york filtered entries)
 */
export function generateSitemapEntries(): SitemapEntry[] {
  const lastModified = todayString();
  const entries: SitemapEntry[] = [];

  // Homepage
  entries.push({
    url: BASE_URL + "/",
    lastModified,
    changeFrequency: "weekly",
    priority: 1.0,
  });

  // Global hub pages
  const globalHubs: Array<{ path: string; priority: number }> = [
    { path: "/prelicensing", priority: 0.85 },
    { path: "/continuing-education", priority: 0.85 },
    { path: "/practice-exam", priority: 0.85 },
    { path: "/compare", priority: 0.8 },
    { path: "/compare/xcel", priority: 0.75 },
    { path: "/compare/examfx", priority: 0.75 },
    { path: "/life-insurance-license", priority: 0.8 },
    { path: "/health-insurance-license", priority: 0.8 },
    { path: "/life-and-health-insurance-license", priority: 0.8 },
    { path: "/insurance-exam-guide", priority: 0.7 },
    { path: "/license-renewal-guide", priority: 0.7 },
    { path: "/faq", priority: 0.7 },
    { path: "/study-guide", priority: 0.85 },
    { path: "/about", priority: 0.6 },
    { path: "/partners", priority: 0.6 },
    { path: "/partner-resources", priority: 0.5 },
    { path: "/contact", priority: 0.5 },
    { path: "/press", priority: 0.5 },
    { path: "/privacy-policy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];
  for (const hub of globalHubs) {
    entries.push({
      url: BASE_URL + hub.path,
      lastModified,
      changeFrequency: "monthly",
      priority: hub.priority,
    });
  }

  for (const stateSlug of ALL_STATE_SLUGS) {
    // State hub page
    entries.push({
      url: `${BASE_URL}/${stateSlug}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // Prelicensing hub page
    entries.push({
      url: `${BASE_URL}/${stateSlug}/prelicensing/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    });

    // CE hub page
    entries.push({
      url: `${BASE_URL}/${stateSlug}/continuing-education/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    });

    // Requirements page
    entries.push({
      url: `${BASE_URL}/${stateSlug}/requirements/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    });

    // Practice exam page (paid offering)
    entries.push({
      url: `${BASE_URL}/${stateSlug}/practice-exam/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    });

    // Individual prelicensing course pages (one per LOA)
    for (const loaSlug of ALL_LOA_SLUGS) {
      entries.push({
        url: `${BASE_URL}/${stateSlug}/prelicensing/${loaSlug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    // Individual CE course pages (one per LOA)
    for (const loaSlug of ALL_LOA_SLUGS) {
      entries.push({
        url: `${BASE_URL}/${stateSlug}/continuing-education/${loaSlug}/`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Blog entries — read from src/content/blog/_index.json at build time
  const blogIndexPath = path.join(process.cwd(), "src", "content", "blog", "_index.json");
  interface BlogPost {
    slug: string;
    cluster: string;
  }
  const blogPosts: BlogPost[] = JSON.parse(fs.readFileSync(blogIndexPath, "utf8"));

  // Derive unique cluster slugs from the post data
  const clusterSlugs = Array.from(new Set(blogPosts.map((p) => p.cluster)));

  // Blog index page
  entries.push({
    url: BASE_URL + "/blog",
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
  });

  // Blog cluster pages (/blog/[cluster])
  for (const clusterSlug of clusterSlugs) {
    entries.push({
      url: `${BASE_URL}/blog/${clusterSlug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Individual blog post pages (/blog/[cluster]/[slug])
  for (const post of blogPosts) {
    entries.push({
      url: `${BASE_URL}/blog/${post.cluster}/${post.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries.filter((entry) => !entry.url.includes("/new-york"));
}
