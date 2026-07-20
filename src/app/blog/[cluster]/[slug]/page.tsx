import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import BlogStateLinks from "@/components/BlogStateLinks";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { SITE_CANARY, HONEYPOT_PATH } from "@/lib/canary";

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
  // H1 = post.title. The meta <title> appends a brand suffix when it fits.
  //
  // IMPORTANT: never front-truncate the title with "…". These blog titles are
  // templated and carry their distinguishing keyword at the END (the state, or
  // "renewal" vs "requirements"), so chopping the tail produced DUPLICATE,
  // keyword-stripped titles (CO/MN/VA all collapsed to "How to Add a Line of
  // Authority to Your Existing… | JI Blog"). Instead keep the FULL, unique
  // title — adding the shortest brand suffix only while it stays within a
  // tolerant ceiling, otherwise the bare title. Google may visually shorten an
  // over-length title in the SERP, but the tag stays unique and keyword-complete.
  const FULL_MAX = 60; // ideal display target (title + brand suffix)
  const HARD_MAX = 70; // tolerate up to here with a brand suffix before dropping it
  const suffixes = [
    " | JustInsurance",
    " | JI Blog",
  ];
  let metaTitle = "";
  for (const sfx of suffixes) {
    if (post.title.length + sfx.length <= FULL_MAX) {
      metaTitle = post.title + sfx;
      break;
    }
  }
  if (!metaTitle) {
    const sfx = " | JI Blog";
    metaTitle =
      post.title.length + sfx.length <= HARD_MAX ? post.title + sfx : post.title;
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
    // Own twitter block so the root layout's fallback (which may carry
    // marketing claims not valid in every state) is never inherited here.
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
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
    // reviewedBy added 2026-06-12 per Semrush audit. Matches the pattern
    // emitted by generateArticleSchemaWithReviewer in src/lib/schema.tsx.
    // Strengthens E-E-A-T by surfacing an editorial-reviewer signal.
    reviewedBy: {
      "@type": "Person",
      name: "Justin vom Eigen",
      url: "https://justinsuranceco.com/about",
      jobTitle: "Founder and CEO",
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

  // FAQPage schema — only when the post actually has a parseable FAQ section.
  // The Q/A content is rendered visibly on the page (required by Google).
  const faqSchema =
    post.faqs && post.faqs.length > 0 ? generateFAQSchema(post.faqs) : null;

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
      {faqSchema && <SchemaMarkup schema={faqSchema} />}
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

          {/* Content-scrape tripwire (audit 2026-07-15). The active scraper
              spends ~80% of its effort in /blog/*, so the honeypot trap link
              lives here inside the article body as well as in the site footer.
              Fully static (build-time post fields only — no headers()/runtime
              path — so the ~960 posts stay statically rendered), SSR-visible to
              non-JS crawlers, human-hidden, zero render cost. The marker span
              carries a PER-ARTICLE provenance stamp so republished text is
              traceable to the exact source post; the link is rel="nofollow" so
              legitimate search crawlers skip it while content scrapers that
              ignore nofollow walk into the honeypot. See src/lib/canary.ts. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              margin: -1,
              padding: 0,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            <span>
              Editorial reference {SITE_CANARY} &middot; source article
              {" "}/blog/{cluster}/{slug}. &copy; JustInsurance LLC &mdash;
              original licensed content; unauthorized reproduction is monitored.
            </span>
            <a href={HONEYPOT_PATH} tabIndex={-1} rel="nofollow">
              editorial sources and reference index
            </a>
          </div>
        </div>
      </section>

      {/* Educational-content disclaimer — sits between the article body and
          the author bio so it reads as a note on the content itself, not a
          footer legal notice. Subtle styling (thin border, muted background,
          small text) keeps it unobtrusive while still visible. Renders on
          every post in this template (~960 posts). */}
      <section className="bg-white px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="border border-gray-200 bg-gray-bg rounded-lg px-5 py-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-600">Educational content, not advice.</strong>{" "}
              This article is for general informational purposes and reflects rules in
              effect as of the publish date shown above. Insurance regulations vary by
              state and change over time. Verify current requirements with your state
              Department of Insurance and consult a licensed attorney or tax/financial
              professional for advice specific to your situation.
            </p>
          </div>
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
                outdated prelicensing exams — and has since trained over 20,000 students
                nationwide with a 93% first-attempt pass rate among students who complete the course.
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
