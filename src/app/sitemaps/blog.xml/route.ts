/**
 * /sitemaps/blog.xml — /blog index, cluster hubs, and individual posts.
 *
 * Includes: /blog, /blog/[cluster], /blog/[cluster]/[slug].
 */

import { bucketXml } from "../_lib/split";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(bucketXml("blog"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
