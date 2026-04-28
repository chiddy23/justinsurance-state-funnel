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

  // Spanish-language pilot pages (/es/florida, /es/texas).
  // Priority 0.8, monthly change frequency — matches the EN state hub cadence.
  const spanishEntries: MetadataRoute.Sitemap = ["florida", "texas"].map(
    (slug) => ({
      url: `${BASE_URL}/es/${slug}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // Author bio page — dedicated bio for Justin vom Eigen, target of all
  // ArticleByline/AuthorBio links across state hubs and guides.
  const authorEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/about/justin-vom-eigen`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  return [...baseEntries, ...costEntries, ...spanishEntries, ...authorEntries];
}
