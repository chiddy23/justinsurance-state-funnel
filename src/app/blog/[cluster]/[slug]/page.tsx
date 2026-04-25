import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import BlogStateLinks from "@/components/BlogStateLinks";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ cluster: p.cluster, slug: p.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string; slug: string }>;
}): Promise<Metadata> {
  const { cluster, slug } = await params;
  const post = await getPostBySlug(cluster, slug);
  if (!post) return {};

  // Build a metaTitle that ALWAYS differs from the H1 for SEO.
  // H1 = post.title. Meta title appends a brand suffix, truncating the
  // title portion if needed to stay within 60 chars total.
  const suffixes = [
    " | JustInsurance",
    " | JI Blog",
  ];
  let metaTitle = "";
  for (const sfx of suffixes) {
    const max = 60 - sfx.length;
    if (post.title.length <= max) {
      metaTitle = post.title + sfx;
      break;
    }
  }
  if (!metaTitle) {
    // Title is longer than 60 - 10 = 50 chars; truncate title and add shortest suffix
    const sfx = " | JI Blog";
    const max = 60 - sfx.length - 3; // -3 for "..."
    metaTitle = post.title.slice(0, max).trim() + "..." + sfx;
  }

  const canonicalUrl = `https://justinsuranceco.com/blog/${cluster}/${slug}`;

  // Thin/templated clusters flagged for noindex pending rewrite
  const NOINDEX_CLUSTERS = new Set(["ce-requirements-general"]);
  const isNoindexed = NOINDEX_CLUSTERS.has(cluster);

  return {
    title: { absolute: metaTitle },
    description: post.description,
    robots: isNoindexed ? { index: false, follow: true } : undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      siteName: "JustInsurance",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image
        ? [{ url: post.image, alt: post.imageAlt }]
        : [{ url: "/og-image.png", alt: "JustInsurance Blog" }],
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ cluster: string; slug: string }>;
}) {
  const { cluster, slug } = await params;
  const post = await getPostBySlug(cluster, slug);
  if (!post) notFound();

  const related = getRelatedPosts(cluster, slug, 3);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.clusterName, href: `/blog/${cluster}` },
    { name: post.title },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Blog", url: "https://justinsuranceco.com/blog" },
    {
      name: post.clusterName,
      url: `https://justinsuranceco.com/blog/${cluster}`,
    },
    {
      name: post.title,
      url: `https://justinsuranceco.com/blog/${cluster}/${slug}`,
    },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image
      ? `https://justinsuranceco.com${post.image}`
      : "https://justinsuranceco.com/og-image.png",
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Justin vom Eigen",
      url: "https://justinsuranceco.com/about",
      jobTitle: "Founder and CEO",
      worksFor: {
        "@type": "Organization",
        name: "JustInsurance LLC",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "JustInsurance LLC",
      url: "https://justinsuranceco.com",
      logo: {
        "@type": "ImageObject",
        url: "https://justinsuranceco.com/justinsurance-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://justinsuranceco.com/blog/${cluster}/${slug}`,
    },
  };

  const formattedDate = post.date
    ? new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={articleSchema} />
      <BreadcrumbNav crumbs={crumbs} />

      {/* Hero */}
      <section className="bg-navy text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/blog/${cluster}`}
            className="inline-block text-gold font-semibold text-sm uppercase tracking-widest mb-4 hover:underline"
          >
            {post.clusterName}
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4 text-balance">
            {post.title}
          </h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-blue-200">
            <span>By {post.author}</span>
            {formattedDate && (
              <>
                <span aria-hidden="true">&middot;</span>
                <time dateTime={post.date}>{formattedDate}</time>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.image && (
        <div className="bg-white px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Body */}
      <section className="bg-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div
            className="prose prose-lg prose-navy max-w-none
              prose-headings:font-bold prose-headings:text-navy
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-navy prose-a:font-semibold prose-a:underline hover:prose-a:text-gold
              prose-strong:text-navy
              prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
              prose-li:text-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-gray-bg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      {/* Author Bio */}
      <section className="bg-gray-bg py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row gap-5 items-start">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-navy flex items-center justify-center text-white font-bold text-xl">
              J
            </div>
            <div>
              <p className="font-bold text-navy text-lg mb-1">{post.author}</p>
              <p className="text-sm text-gold font-semibold mb-2">
                Founder &amp; CEO, JustInsurance LLC
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Justin vom Eigen is a licensed insurance agent and the founder of
                JustInsurance. He built the company after watching talented people fail
                outdated prelicensing exams — and has since trained over 30,000 agents
                nationwide with a 93% first-attempt pass rate.
              </p>
              <Link
                href="/about"
                className="inline-block mt-3 text-navy font-semibold text-sm hover:text-gold hover:underline"
              >
                Learn more about Justin &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* State Money-Page Links (renders null for non-state clusters) */}
      <BlogStateLinks clusterSlug={cluster} variant="compact" />

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="bg-white py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-navy mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${cluster}/${rel.slug}`}
                  className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {rel.image && (
                    <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                      <Image
                        src={rel.image}
                        alt={rel.imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-navy mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {rel.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href={`/blog/${cluster}`}
                className="inline-block border-2 border-navy text-navy font-semibold px-6 py-3 rounded-lg hover:bg-navy hover:text-white transition-colors"
              >
                All {post.clusterName} articles &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
