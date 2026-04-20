import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";
import { getAllClusters, getAllPosts, getLatestPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: {
    absolute: "Insurance Exam Prep Blog — State Guides & Study Tips",
  },
  description:
    "Expert guides on insurance licensing, CE requirements, exam prep, and career tips for agents nationwide. Written by licensed agents.",
  alternates: { canonical: "https://justinsuranceco.com/blog" },
  openGraph: {
    title: "Insurance Exam Prep Blog — State Guides & Study Tips",
    description:
      "Expert guides on insurance licensing, CE requirements, exam prep, and career tips for agents nationwide.",
    url: "https://justinsuranceco.com/blog",
    siteName: "JustInsurance",
    type: "website",
    images: [{ url: "/og-image.png", alt: "JustInsurance Blog" }],
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Blog", url: "https://justinsuranceco.com/blog" },
]);

const crumbs = [{ name: "Home", href: "/" }, { name: "Blog" }];

export default function BlogIndexPage() {
  const clusters = getAllClusters();
  const latest = getLatestPosts(6);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "JustInsurance Blog",
    description:
      "Expert articles on insurance licensing, continuing education, and exam prep — written by licensed insurance agents.",
    url: "https://justinsuranceco.com/blog",
    publisher: {
      "@type": "Organization",
      name: "JustInsurance LLC",
      url: "https://justinsuranceco.com",
    },
    hasPart: {
      "@type": "ItemList",
      numberOfItems: getAllPosts().length,
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
            The JustInsurance Blog
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Insurance Education, Straight From Licensed Agents
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Guides, tips, and deep dives on insurance licensing, CE requirements, exam
            prep, and career growth — written for aspiring and working agents across all
            50 states.
          </p>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-8">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((post) => (
              <Link
                key={`${post.cluster}/${post.slug}`}
                href={`/blog/${post.cluster}/${post.slug}`}
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
                  <p className="text-xs text-gold font-semibold uppercase tracking-wide mb-2">
                    {post.clusterName}
                  </p>
                  <h3 className="text-base font-bold text-navy mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Topic Clusters */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">
            Browse by Topic
          </h2>
          <p className="text-gray-600 mb-8 text-base">
            {clusters.length} topic clusters covering every stage of your insurance career.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {clusters.map((cluster) => (
              <Link
                key={cluster.slug}
                href={`/blog/${cluster.slug}`}
                className="group block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gold transition-all"
              >
                <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                  {cluster.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {cluster.postCount} article{cluster.postCount !== 1 ? "s" : ""}
                </p>
                <span className="text-gold font-semibold text-sm group-hover:underline">
                  Browse topic &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
