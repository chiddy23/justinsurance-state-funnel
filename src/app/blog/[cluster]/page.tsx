import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";
import { getAllClusters, getClusterBySlug } from "@/lib/blog";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import videoData from "@/lib/youtube-videos.json";

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const clusters = getAllClusters();
  return clusters.map((c) => ({ cluster: c.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string }>;
}): Promise<Metadata> {
  const { cluster: clusterSlug } = await params;
  const cluster = getClusterBySlug(clusterSlug);
  if (!cluster) return {};

  // Clean up cluster name (strip editorial artifacts like "Insurance Education > Buyer's Guide >")
  const cleanName = cluster.name
    .replace(/^Insurance Education\s*>\s*[^>]+>\s*/i, "")
    .replace(/^State License\s*[–-]\s*/i, "")
    .trim();

  // Is this a state-license cluster? If so, use a keyword-rich title.
  const isStateCluster = clusterSlug.startsWith("state-license-");

  // Build title that stays 45-60 chars (SEO sweet spot). Try keyword-rich
  // candidates first, then fall back to shorter versions if needed.
  const candidates = isStateCluster
    ? [
        `${cleanName} Insurance License Guide | JustInsurance`,
        `${cleanName} Insurance License | JustInsurance Blog`,
        `${cleanName} Insurance License Articles | JustInsurance`,
        `${cleanName} Insurance License | JustInsurance`,
        `${cleanName} Insurance License Guide`,
      ]
    : [
        `${cleanName} Articles & Guides | JustInsurance Blog`,
        `${cleanName} Articles | JustInsurance Blog`,
        `${cleanName} | JustInsurance Blog`,
        `${cleanName} | JustInsurance`,
      ];

  // Pick first candidate in 45-60 char range, fallback to first under 60.
  const title =
    candidates.find((c) => c.length >= 45 && c.length <= 60) ||
    candidates.find((c) => c.length <= 60) ||
    candidates[candidates.length - 1].slice(0, 57) + "...";

  // Build a description in the 120-155 char SEO sweet spot, keyword-rich.
  // Use state name in the text for state clusters to differentiate from other states.
  const descBase = isStateCluster
    ? `Expert guides on ${cleanName} insurance licensing, exam prep, and continuing education. ${cluster.postCount} articles from licensed insurance agents.`
    : `${cluster.postCount} expert articles on ${cleanName.toLowerCase()} from JustInsurance. Real-world guidance from licensed insurance agents to help you get licensed.`;

  // Ensure 120-155 char range
  let description = descBase;
  if (description.length > 155) {
    description = description.slice(0, 152).replace(/\s+\S*$/, "") + "...";
  } else if (description.length < 120) {
    description = description + " Start your insurance career with confidence.";
    if (description.length > 155) {
      description = description.slice(0, 152).replace(/\s+\S*$/, "") + "...";
    }
  }

  // Thin/templated clusters flagged for noindex pending rewrite
  const NOINDEX_CLUSTERS = new Set([
    "ce-requirements-general",
  ]);
  const isNoindexed = NOINDEX_CLUSTERS.has(clusterSlug);

  return {
    title: { absolute: title },
    description,
    robots: isNoindexed ? { index: false, follow: true } : undefined,
    alternates: { canonical: `https://justinsuranceco.com/blog/${clusterSlug}` },
    openGraph: {
      title,
      description,
      url: `https://justinsuranceco.com/blog/${clusterSlug}`,
      siteName: "JustInsurance",
      type: "website",
      images: [{ url: "/og-image.png", alt: cluster.name }],
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ClusterPage({
  params,
}: {
  params: Promise<{ cluster: string }>;
}) {
  const { cluster: clusterSlug } = await params;
  const cluster = getClusterBySlug(clusterSlug);
  if (!cluster) notFound();

  const videoKey = `/blog/${clusterSlug}`;
  const video = (videoData as Record<string, { videoId: string; title: string }>)[videoKey] ?? null;

  // Clean cluster name for display (strip editorial prefixes)
  const cleanName = cluster.name
    .replace(/^Insurance Education\s*>\s*[^>]+>\s*/i, "")
    .replace(/^State License\s*[–-]\s*/i, "")
    .trim();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: cleanName },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Blog", url: "https://justinsuranceco.com/blog" },
    {
      name: cleanName,
      url: `https://justinsuranceco.com/blog/${clusterSlug}`,
    },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cleanName} | JustInsurance Blog`,
    description: `${cluster.postCount} articles on ${cleanName.toLowerCase()} from JustInsurance.`,
    url: `https://justinsuranceco.com/blog/${clusterSlug}`,
    publisher: {
      "@type": "Organization",
      name: "JustInsurance LLC",
      url: "https://justinsuranceco.com",
    },
  };

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={collectionSchema} />
      {video && (
        <SchemaMarkup schema={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: video.title,
          description: `Insurance exam prep video from the Insurance Exam Prep YouTube channel.`,
          thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
          uploadDate: "2024-01-01",
          contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
          publisher: {
            "@type": "Organization",
            name: "JustInsurance LLC",
            url: "https://justinsuranceco.com",
          },
        }} />
      )}
      <BreadcrumbNav crumbs={crumbs} />

      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            JustInsurance Blog
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            {cleanName}: Expert Guides
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            {cluster.postCount} expert article{cluster.postCount !== 1 ? "s" : ""} on{" "}
            {cleanName.toLowerCase()} — written by licensed insurance agents to help
            you get licensed, stay compliant, and grow your career.
          </p>
        </div>
      </section>

      {/* Post List */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cluster.posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${clusterSlug}/${post.slug}`}
                className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.image && (
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-base font-bold text-navy mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.description}
                  </p>
                  <span className="text-gold font-semibold text-sm group-hover:underline">
                    Read article &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {video && <YouTubeEmbed videoId={video.videoId} title={video.title} />}

      {/* Back to Blog */}
      <section className="bg-gray-bg py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href="/blog"
            className="inline-block bg-navy text-white font-semibold px-6 py-3 rounded-lg hover:bg-gold hover:text-navy transition-colors"
          >
            &larr; All Topics
          </Link>
        </div>
      </section>
    </>
  );
}
