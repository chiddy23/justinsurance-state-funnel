import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import { getAllClusters, getClusterBySlug } from "@/lib/blog";
import { getStateForCluster } from "@/lib/blog-cluster-state-map";
import { getStateBySlug, type StateData } from "@/lib/states";
import FAQAccordion from "@/components/FAQAccordion";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import BlogStateLinks from "@/components/BlogStateLinks";
import videoData from "@/lib/youtube-videos.json";

// ---------------------------------------------------------------------------
// SEO enrichment allowlist (pilot). On these state-license cluster indexes we
// render an intent-matching guide block (head-term H1/title, "start here"
// internal links to the money hub/subpages, and a PAA-matching FAQ) sourced
// ENTIRELY from VERIFIED states.ts data + primary-source fact-checked wording.
// Every other cluster renders byte-identically. Add a slug ONLY after building
// and fact-checking its per-state FAQ block in buildGuideFaqs().
// ---------------------------------------------------------------------------
const ENRICHED_GUIDE_CLUSTERS = new Set([
  "state-license-california",
  "florida-insurance-license",
]);

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
  // Enriched guide clusters (e.g. Florida's custom "florida-insurance-license"
  // slug) also get the state-cluster title treatment — but their cleanName
  // already contains "Insurance License", so use the bare state name from the
  // cluster→state map to avoid a doubled "Insurance License Insurance License".
  const isStateCluster = clusterSlug.startsWith("state-license-");
  const enrichedRef = ENRICHED_GUIDE_CLUSTERS.has(clusterSlug)
    ? getStateForCluster(clusterSlug)
    : null;
  const useStateTitle = isStateCluster || !!enrichedRef;
  const stateNoun = enrichedRef ? enrichedRef.name : cleanName;

  // Build title that stays 45-60 chars (SEO sweet spot). Try keyword-rich
  // candidates first, then fall back to shorter versions if needed.
  const candidates = useStateTitle
    ? [
        `${stateNoun} Insurance License Guide | JustInsurance`,
        `${stateNoun} Insurance License | JustInsurance Blog`,
        `${stateNoun} Insurance License Articles | JustInsurance`,
        `${stateNoun} Insurance License | JustInsurance`,
        `${stateNoun} Insurance License Guide`,
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
  const descBase = useStateTitle
    ? `Expert guides on ${stateNoun} insurance licensing, exam prep, and continuing education. ${cluster.postCount} articles from licensed insurance agents.`
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
    // Own twitter block so the root layout's fallback (which may carry
    // marketing claims not valid in every state) is never inherited here.
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ---------------------------------------------------------------------------
// Enrichment FAQ builder — PER-STATE, primary-source-verified wording.
//
// Each state's answers are written explicitly (not blindly templated) because
// per-state facts differ in ways a template gets subtly wrong: prelicensing
// STRUCTURE (California's single 12-hr Code & Ethics course vs Florida's
// line-specific 30/40/60-hr courses), exam VENDOR (PSI vs Pearson VUE),
// passing SCORE, and how the exam FEE is composed (California's $98 is CDI $55
// + PSI $43; Florida's $44 is a single Pearson VUE fee). Q5 is always the
// state's own data-driven stateSpecificFAQ. Numbers come from verified
// states.ts fields, never hardcoded. Add a state ONLY after primary-source
// fact-checking it; unlisted states return [] and render no FAQ block.
// ---------------------------------------------------------------------------
function buildGuideFaqs(state: StateData): { question: string; answer: string }[] {
  const spec = {
    question: state.stateSpecificFAQ.question,
    answer: state.stateSpecificFAQ.answer,
  };

  if (state.slug === "california") {
    return [
      {
        question: `How do I get an insurance license in ${state.name}?`,
        answer: `Complete the required ${state.prelicensing.lifeAndHealth.hours}-hour ${state.name} Code & Ethics prelicensing course, pass the ${state.name} state licensing exam administered by ${state.examInfo.examProvider} (a passing score is ${state.examInfo.passingScore}%), complete fingerprinting for your background check, then submit your application to the ${state.doiName} through NIPR or Sircon.`,
      },
      {
        question: `How many prelicensing hours does ${state.name} require?`,
        answer: `${state.name} requires a ${state.prelicensing.lifeAndHealth.hours}-hour Code & Ethics prelicensing course for resident license applicants. Optional exam-prep for your specific line (Life, Health, or Life & Health) is recommended to help you pass the state exam.`,
      },
      {
        question: `What score do I need to pass the ${state.name} insurance exam?`,
        answer: `You need ${state.examInfo.passingScore}% to pass the ${state.name} licensing exam, which is administered by ${state.examInfo.examProvider}.`,
      },
      {
        question: `How much does a ${state.name} insurance license cost?`,
        answer: `JustInsurance ${state.name} prelicensing starts at ${state.prelicensing.lifeAndHealth.price}. On top of the course, you'll pay the ${state.name} state licensing exam fee ($${state.examInfo.examFee} total — the ${state.doiName} examination fee plus the ${state.examInfo.examProvider} scheduling fee), fingerprinting and background-check costs, and the state license application fee — see the full ${state.name} license cost breakdown for current amounts.`,
      },
      spec,
    ];
  }

  if (state.slug === "florida") {
    const p = state.prelicensing;
    return [
      {
        question: `How do I get an insurance license in ${state.name}?`,
        answer: `Complete a ${state.doiName}–approved prelicensing course for your license line — ${p.lifeAndHealth.hours} hours for the 2-15 Life, Health & Annuity license (${p.life.hours} hours for the 2-14 Life license or ${p.health.hours} hours for the 2-40 Health license) — then pass the ${state.name} state licensing exam in person at a ${state.examInfo.examProvider} test center (a passing score is ${state.examInfo.passingScore}%), complete electronic fingerprinting through IdentoGO for your background check, and submit your license application to the ${state.doiName} through NIPR.`,
      },
      {
        question: `How many prelicensing hours does ${state.name} require?`,
        answer: `${state.name} prelicensing hours depend on the license line: ${p.lifeAndHealth.hours} hours for the 2-15 Life, Health & Annuity license, ${p.life.hours} hours for the 2-14 Life (including annuities and variable contracts) license, and ${p.health.hours} hours for the 2-40 Health license. JustInsurance offers a state-approved course for each.`,
      },
      {
        question: `What score do I need to pass the ${state.name} insurance exam?`,
        answer: `You need ${state.examInfo.passingScore}% to pass the ${state.name} licensing exam, which is administered in person at ${state.examInfo.examProvider} test centers.`,
      },
      {
        question: `How much does a ${state.name} insurance license cost?`,
        answer: `JustInsurance ${state.name} prelicensing starts at ${p.lifeAndHealth.price}. You'll also pay the ${state.examInfo.examProvider} exam fee ($${state.examInfo.examFee}), electronic fingerprinting through IdentoGO (about $${state.backgroundCheckCost}), and the ${state.doiName} license application fee ($${state.applicationFee}) — see the full ${state.name} license cost breakdown for current amounts.`,
      },
      spec,
    ];
  }

  return [];
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
  const video = (videoData as Record<string, { videoId: string; title: string; uploadDate: string; duration: string }>)[videoKey] ?? null;

  // Clean cluster name for display (strip editorial prefixes)
  const cleanName = cluster.name
    .replace(/^Insurance Education\s*>\s*[^>]+>\s*/i, "")
    .replace(/^State License\s*[–-]\s*/i, "")
    .trim();

  // SEO enrichment (pilot): on allowlisted cluster indexes (ENRICHED_GUIDE_CLUSTERS,
  // module scope), render an intent-matching guide block (head-term H1, "start here"
  // internal links to the money hub/subpages, and a PAA-matching FAQ from
  // buildGuideFaqs). Per-state wording is verified in buildGuideFaqs; every other
  // cluster renders byte-identically.
  const stateRef = getStateForCluster(clusterSlug);
  const guideState =
    ENRICHED_GUIDE_CLUSTERS.has(clusterSlug) && stateRef
      ? getStateBySlug(stateRef.slug)
      : null;
  const guideFaqs = guideState ? buildGuideFaqs(guideState) : [];
  const guideFaqSchema =
    guideState && guideFaqs.length > 0 ? generateFAQSchema(guideFaqs) : null;

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
      {guideFaqSchema && <SchemaMarkup schema={guideFaqSchema} />}
      {video && (
        <SchemaMarkup schema={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: video.title,
          description: `Insurance exam prep video from the Insurance Exam Prep YouTube channel.`,
          thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
          // from src/lib/youtube-videos.json (real values, fetched 2026-04-27)
          uploadDate: video.uploadDate,
          duration: video.duration,
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
            {guideState ? `${guideState.name} Insurance License Guide` : `${cleanName}: Expert Guides`}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            {guideState ? (
              `How to get your ${guideState.name} insurance license — requirements, the state exam, cost, prelicensing, and CE — plus ${cluster.postCount} in-depth guides written by licensed insurance agents.`
            ) : (
              <>
                {cluster.postCount} expert article{cluster.postCount !== 1 ? "s" : ""} on{" "}
                {cleanName.toLowerCase()} — written by licensed insurance agents to help
                you get licensed, stay compliant, and grow your career.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Enrichment (allowlisted state clusters): "start here" internal-link
          funnel to the money hub + subpages. Concentrates the cluster's
          authority on the conversion pages and matches requirements/cost intent.
          Self-contained section; rendered only when guideState is set. */}
      {guideState && stateRef && (
        <section className="bg-gray-bg py-10 px-4 border-b border-gray-200">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg md:text-xl font-bold text-navy mb-5 text-center">
              Start Here: {guideState.name} Insurance License
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: `/${stateRef.slug}`, label: `${guideState.name} License Course`, sub: "From $199 — start here" },
                { href: `/${stateRef.slug}/requirements`, label: "Requirements", sub: "Hours, exam, fingerprinting, CE" },
                { href: `/${stateRef.slug}/cost`, label: "Cost Breakdown", sub: "Every fee, itemized" },
                { href: `/${stateRef.slug}/prelicensing`, label: "Prelicensing Course", sub: "Life, Health & combined" },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-gold hover:shadow-md transition-all"
                >
                  <p className="font-bold text-navy text-sm mb-1 leading-snug">{c.label}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{c.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* Enrichment FAQ (allowlisted state clusters): PAA-matching Q&A sourced
          from verified states.ts data, backed by the FAQPage schema emitted
          above. Rendered only when guideState is set. */}
      {guideState && guideFaqs.length > 0 && (
        <FAQAccordion
          faqs={guideFaqs}
          heading={`${guideState.name} Insurance License FAQs`}
        />
      )}

      <BlogStateLinks clusterSlug={clusterSlug} variant="full" />

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
