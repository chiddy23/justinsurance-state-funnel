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
 * ──────
 *   501 total
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
      priority: 0.8,
    });

    // CE hub page
    entries.push({
      url: `${BASE_URL}/${stateSlug}/continuing-education/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Requirements page
    entries.push({
      url: `${BASE_URL}/${stateSlug}/requirements/`,
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

  return entries.filter((entry) => !entry.url.includes("/new-york"));
}
