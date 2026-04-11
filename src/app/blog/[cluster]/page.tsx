import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";
import { getAllClusters, getClusterBySlug } from "@/lib/blog";

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

  const title = `${cluster.name} Articles | JustInsurance Blog`;
  const description = `Browse ${cluster.postCount} expert articles on ${cluster.name.toLowerCase()} — written by licensed insurance agents with real industry experience.`;

  return {
    title: { absolute: title },
    description,
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

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: cluster.name },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Blog", url: "https://justinsuranceco.com/blog" },
    {
      name: cluster.name,
      url: `https://justinsuranceco.com/blog/${clusterSlug}`,
    },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cluster.name} | JustInsurance Blog`,
    description: `${cluster.postCount} articles on ${cluster.name.toLowerCase()} from JustInsurance.`,
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
      <BreadcrumbNav crumbs={crumbs} />

      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            JustInsurance Blog
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            {cluster.name}: Expert Guides
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            {cluster.postCount} expert article{cluster.postCount !== 1 ? "s" : ""} on{" "}
            {cluster.name.toLowerCase()} — written by licensed insurance agents to help
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
