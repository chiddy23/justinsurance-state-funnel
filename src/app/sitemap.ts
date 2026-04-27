import { MetadataRoute } from "next";
import { generateSitemapEntries } from "@/lib/sitemap-data";
import { ALL_STATE_SLUGS } from "@/lib/states";

const BASE_URL = "https://justinsuranceco.com";

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseEntries = generateSitemapEntries().map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  // Append /[state]/cost URLs — 50 entries (filtered to exclude /new-york
  // for parity with generateSitemapEntries' filter rule).
  const lastModified = todayString();
  const costEntries: MetadataRoute.Sitemap = ALL_STATE_SLUGS
    .filter((slug) => slug !== "new-york")
    .map((slug) => ({
      url: `${BASE_URL}/${slug}/cost`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }));

  return [...baseEntries, ...costEntries];
}
