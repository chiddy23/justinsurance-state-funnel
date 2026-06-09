import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateParams } from "@/lib/generateStaticParams";
import { generateArticleSchemaWithReviewer, generateBreadcrumbSchema, generateFAQSchema, generateStateHubCourseSchema, SchemaMarkup } from "@/lib/schema";
import { getStateHubFAQs, buildFaqData } from "@/lib/faq-data";
import ArticleByline from "@/components/ArticleByline";
import Link from "next/link";
import StateHero from "@/components/StateHero";
import TrustBar from "@/components/TrustBar";
import TwoPathSelector from "@/components/TwoPathSelector";
import { PC_STATE_SLUGS } from "@/data/pc-ce-packages";
import StateRequirementsBlock from "@/components/StateRequirementsBlock";
import TestimonialCards from "@/components/TestimonialCards";
import FAQAccordion from "@/components/FAQAccordion";
import PracticeExamCTA from "@/components/PracticeExamCTA";
import StateNoticesSection from "@/components/StateNoticesSection";
import StateProviderBadge from "@/components/StateProviderBadge";
import LastUpdated from "@/components/LastUpdated";
import CTABanner from "@/components/CTABanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedStatePages from "@/components/RelatedStatePages";
import StateSalaryCard from "@/components/StateSalaryCard";
import HowToGetLicensed from "@/components/HowToGetLicensed";
import YouTubeEmbed from "@/components/YouTubeEmbed";

// VideoObject schema for the Florida-only embed. Mirrors the pattern
// used on /health-insurance-license. Single-source-of-truth video data
// lives in src/lib/youtube-videos.json (key "/florida"). Added 2026-06-09.
const floridaVideoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "How To Get Your Florida Life + Health Insurance License (Step by Step)",
  description:
    "Step-by-step walkthrough of the Florida 2-15 Life, Health & Annuity license process: 60-hr prelicensing, $44 Pearson VUE exam, IdentoGO fingerprinting, and NIPR application. Hosted by Justin vom Eigen, IDECC Certified Distance Education Instructor and founder of JustInsurance LLC.",
  thumbnailUrl: "https://i.ytimg.com/vi/o80zGv0ksMA/hqdefault.jpg",
  uploadDate: "2026-06-09",
  duration: "PT5M54S",
  contentUrl: "https://www.youtube.com/watch?v=o80zGv0ksMA",
  embedUrl: "https://www.youtube-nocookie.com/embed/o80zGv0ksMA",
};

export function generateStaticParams() {
  return generateStateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) return {};
  const meta = generatePageMetadata({
    pageType: "state-hub",
    stateName: stateData.name,
    stateSlug: stateData.slug,
    stateAbbreviation: stateData.abbreviation,
    examProvider: stateData.examInfo?.examProvider,
  });

  // Spanish-language pilot — emit hreflang reciprocity ONLY for FL/TX.
  // Self-references "en-US" + "es-US" + "x-default" → English canonical.
  if (stateData.slug === "florida" || stateData.slug === "texas") {
    const enUrl = `https://justinsuranceco.com/${stateData.slug}/`;
    const esUrl = `https://justinsuranceco.com/es/${stateData.slug}/`;
    return {
      ...meta,
      alternates: {
        ...meta.alternates,
        languages: {
          "en-US": enUrl,
          "es-US": esUrl,
          "x-default": enUrl,
        },
      },
    };
  }

  return meta;
}

export default async function StateHubPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) notFound();

  // Fix 2 & 3 — use realPassRate / marketGrowthRate when available, otherwise
  // fall back to the existing examInfo / stateData values so FAQ text stays valid.
  const faqData = {
    ...buildFaqData(stateData),
    passRate:
      stateData.realPassRate !== null
        ? String(Math.round(stateData.realPassRate))
        : stateData.examInfo.passRate,
    jobGrowth:
      stateData.marketGrowthRate !== null
        ? String(stateData.marketGrowthRate)
        : stateData.jobGrowth,
  };

  const baseFaqs = getStateHubFAQs(faqData);

  // Fix 6 — append state-specific FAQ as question 6
  const faqs = [
    ...baseFaqs,
    {
      question: stateData.stateSpecificFAQ.question,
      answer: stateData.stateSpecificFAQ.answer,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
  ]);
  const faqSchema = generateFAQSchema(faqs);
  const lahHours = stateData.prelicensing?.lifeAndHealth?.hours;
  const courseSchema = generateStateHubCourseSchema({
    stateName: stateData.name,
    stateSlug: stateData.slug,
    price: stateData.prelicensing?.lifeAndHealth?.price || "$199",
    hours: typeof lahHours === "number" ? lahHours : undefined,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name },
  ];

  // Fix 1 — hero subtitle from stateSpecificIntro with fallback
  const heroSubtitle =
    stateData.stateSpecificIntro && stateData.stateSpecificIntro.trim() !== ""
      ? stateData.stateSpecificIntro
      : "State-approved prelicensing and CE courses. 100% online, self-paced, pass guarantee included.";

  const articleHeadline =
    stateData.slug === "florida"
      ? "Florida 2-15 License: Prelicensing & CE Courses Online"
      : stateData.slug === "texas"
      ? "Get Your Texas Insurance License — No Prelicensing Required"
      : stateData.slug === "california"
      ? "California Insurance License: 12-Hour Ethics + State Exam Prep"
      : `Get Your ${stateData.name} Insurance License Online`;

  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: heroSubtitle,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${stateData.slug}`,
  });

  // Fix 7 — determine if special training requirements exist
  const str = stateData.specialTrainingRequirements;
  const hasSpecialTraining =
    str.ltc !== null || str.nfip !== null || str.annuity !== null || str.other !== null;

  const specialTrainingItems: { label: string; description: string }[] = [];
  if (str.ltc !== null) specialTrainingItems.push({ label: "Long-Term Care (LTC)", description: str.ltc });
  if (str.nfip !== null) specialTrainingItems.push({ label: "National Flood Insurance Program (NFIP)", description: str.nfip });
  if (str.annuity !== null) specialTrainingItems.push({ label: "Annuity Training", description: str.annuity });
  if (str.other !== null) specialTrainingItems.push({ label: "Additional Requirements", description: str.other });

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={courseSchema} />
      <SchemaMarkup schema={articleSchema} />
      {stateData.slug === "florida" && <SchemaMarkup schema={floridaVideoSchema} />}

      <BreadcrumbNav crumbs={crumbs} />

      {/* Spanish-language pilot — visible link to /es/{slug} for FL/TX only.
          Pairs with the hreflang annotations in generateMetadata so Spanish-speaking
          visitors landing on the EN hub can find the ES version. */}
      {(stateData.slug === "florida" || stateData.slug === "texas") && (
        <div className="bg-gold/10 border-y border-gold/30 py-3 px-4 text-center">
          <a
            href={`/es/${stateData.slug}/`}
            hrefLang="es-US"
            className="text-navy font-semibold hover:text-gold-dark transition-colors text-sm md:text-base inline-flex items-center gap-2"
          >
            <span aria-hidden="true">🇪🇸</span>
            <span>Curso de licencia de seguros disponible en español →</span>
          </a>
        </div>
      )}

      {/* Fix 1 — hero subtitle uses stateSpecificIntro */}
      <StateHero
        eyebrow={`${stateData.name} Insurance Licensing`}
        title={
          stateData.slug === "florida"
            ? "Florida 2-15 License: Prelicensing & CE Courses Online"
            : stateData.slug === "texas"
            ? "Get Your Texas Insurance License — No Prelicensing Required"
            : stateData.slug === "california"
            ? "California Insurance License: 12-Hour Ethics + State Exam Prep"
            : `Get Your ${stateData.name} Insurance License Online`
        }
        subtitle={heroSubtitle}
        ctaButtons={[
          { text: "Start Prelicensing", href: `/${stateData.slug}/prelicensing/` },
          { text: "Renew with CE", href: `/${stateData.slug}/continuing-education/`, variant: "secondary" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      <TrustBar />

      <StateProviderBadge
        stateName={stateData.name}
        doiName={stateData.doiName}
        providerNumber={stateData.providerNumber}
        doiUrl={stateData.doiUrl}
      />

      {/* Florida step-by-step walkthrough video. Placed after the provider
          badge so credibility signals (DOI + provider #) frame the video,
          and before specialNotices / TwoPathSelector so it gets dwell-time
          weight on the highest-impression FL surface (GSC 1,550 imp /
          pos 25.6). VideoObject schema emitted above. Added 2026-06-09. */}
      {stateData.slug === "florida" && (
        <YouTubeEmbed
          videoId="o80zGv0ksMA"
          title="How To Get Your Florida Life + Health Insurance License (Step by Step)"
        />
      )}

      {stateData.specialNotices && (
        <StateNoticesSection
          stateName={stateData.name}
          notices={stateData.specialNotices}
        />
      )}

      {PC_STATE_SLUGS.includes(stateData.slug) ? (
        // 3-card variant — Prelicensing + L&H CE + P&C CE.
        // Mirrors TwoPathSelector styling exactly so the visual unity of the
        // "What Do You Need?" block is preserved. Rendered inline (rather than
        // extending TwoPathSelector) to keep cross-file changes scoped.
        <section className="bg-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
              What Do You Need?
            </h2>
            <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
              Whether you&apos;re getting licensed for the first time or renewing your existing license, we have the course for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Prelicensing Card */}
              <div className="border-2 border-navy rounded-xl p-8 flex flex-col hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">Prelicensing</h3>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  New to insurance? Get your {stateData.name} insurance license with a state-approved prelicensing course. Study online at your own pace, then pass the state exam.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    100% online &amp; self-paced
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Pass guarantee included
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Starting at $199
                  </li>
                </ul>
                <Link
                  href={`/${stateData.slug}/prelicensing/`}
                  className="block text-center bg-navy hover:bg-navy-light text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Get My License &rarr;
                </Link>
              </div>

              {/* L&H CE Card */}
              <div className="border-2 border-gold rounded-xl p-8 flex flex-col hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">L&amp;H Continuing Education</h3>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  Already licensed in life &amp; health? Complete your {stateData.name} CE hours online before your renewal deadline. We report your completion to the state same-day.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Same-day DOI reporting
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Complete at your own pace
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Starting at $39
                  </li>
                </ul>
                <Link
                  href={`/${stateData.slug}/continuing-education/`}
                  className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Renew L&amp;H License &rarr;
                </Link>
              </div>

              {/* P&C CE Card — only rendered when state is in PC_STATE_SLUGS */}
              <div className="border-2 border-gold rounded-xl p-8 flex flex-col hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">Property &amp; Casualty CE</h3>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  Hold a P&amp;C license? Complete your {stateData.name} P&amp;C continuing education online with state-approved Ethics + P&amp;C electives. Same-day DOI reporting included.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    State-approved Ethics + P&amp;C
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Same-day DOI reporting
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Starting at $39
                  </li>
                </ul>
                <Link
                  href={`/${stateData.slug}/continuing-education/property-and-casualty/`}
                  className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Renew P&amp;C License &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <TwoPathSelector stateSlug={stateData.slug} stateName={stateData.name} />
      )}

      <StateRequirementsBlock stateData={stateData} />

      <HowToGetLicensed stateData={stateData} />

      {/* BLS Bureau of Labor Statistics salary + employment snapshot */}
      <StateSalaryCard stateSlug={stateData.slug} stateName={stateData.name} />

      {/* Fix 5 — Last Verified + Provider Approval Number */}
      <section className="bg-white py-4 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-x-8 gap-y-1 text-xs text-gray-400">
          <span>Last Verified: {stateData.lastVerified}</span>
          {stateData.providerApprovalNumber !== "PENDING" && (
            <span>Provider Approval #: {stateData.providerApprovalNumber}</span>
          )}
        </div>
      </section>

      {/* Legal Basis — brief citations block */}
      {(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const citations = (stateData as any).citations as {
          insuranceCodeFull?: string;
          prelicenseCode?: string;
          ceRequirementsCode?: string;
          statutesUrl?: string;
        } | undefined;

        if (!citations) return null;

        const hasAny =
          (citations.insuranceCodeFull ?? "").trim() !== "" ||
          (citations.prelicenseCode ?? "").trim() !== "" ||
          (citations.ceRequirementsCode ?? "").trim() !== "";

        if (!hasAny) return null;

        return (
          <section className="bg-gray-bg py-6 px-4">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-sm font-semibold text-navy mb-2">Legal References</h3>
              <div className="text-xs text-gray-500 space-y-1">
                {citations.insuranceCodeFull && (
                  <p>
                    Insurance Code: {citations.insuranceCodeFull}
                    {citations.statutesUrl && (
                      <a
                        href={citations.statutesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy underline ml-1"
                      >
                        View Statutes
                      </a>
                    )}
                  </p>
                )}
                {citations.prelicenseCode && (
                  <p>Prelicensing: {citations.prelicenseCode}</p>
                )}
                {citations.ceRequirementsCode && (
                  <p>CE Requirements: {citations.ceRequirementsCode}</p>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* More {State} Resources — 5-card internal nav grid.
          Replaces the older single-link "Fix 8" block to surface the cost,
          practice-exam, and CE pages for crawlers (was diagnosed gap: cost
          page sitting at 2% crawl rate because state hubs never linked it). */}
      <section className="bg-gray-bg py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-navy mb-2 text-center">
            More {stateData.name} Insurance License Resources
          </h2>
          <p className="text-gray-500 text-center mb-8 text-sm max-w-2xl mx-auto">
            Everything you need in one place — requirements, course options, exam prep, and a transparent cost breakdown.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link
              href={`/${stateData.slug}/requirements/`}
              className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <p className="text-2xl mb-2" aria-hidden="true">📋</p>
              <h3 className="font-bold text-navy text-sm mb-1">{stateData.name} Requirements</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Hours, exam, fingerprinting, fees, and CE rules.
              </p>
            </Link>
            <Link
              href={`/${stateData.slug}/prelicensing/`}
              className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <p className="text-2xl mb-2" aria-hidden="true">🎓</p>
              <h3 className="font-bold text-navy text-sm mb-1">{stateData.name} Prelicensing</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                State-approved prelicensing courses, all lines of authority.
              </p>
            </Link>
            <Link
              href={`/${stateData.slug}/continuing-education/`}
              className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <p className="text-2xl mb-2" aria-hidden="true">🔄</p>
              <h3 className="font-bold text-navy text-sm mb-1">{stateData.name} CE Courses</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Renew your {stateData.name} license with online CE.
              </p>
            </Link>
            <Link
              href={`/${stateData.slug}/practice-exam/`}
              className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <p className="text-2xl mb-2" aria-hidden="true">📝</p>
              <h3 className="font-bold text-navy text-sm mb-1">{stateData.name} Practice Exam</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Free practice questions modeled on the real {stateData.name} exam.
              </p>
            </Link>
            <Link
              href={`/${stateData.slug}/cost/`}
              className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <p className="text-2xl mb-2" aria-hidden="true">💰</p>
              <h3 className="font-bold text-navy text-sm mb-1">{stateData.name} License Cost</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Total breakdown: course, exam, fingerprinting, application fees.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Why JustInsurance — inline section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Why Choose JustInsurance for Your {stateData.name} License?
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            We&apos;ve helped 20,000+ students get licensed nationwide. Here&apos;s why they choose us.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🏛️",
                title: "State-Approved Courses",
                desc: `Every JustInsurance course is officially approved by the ${stateData.doiName} to fulfill prelicensing and CE requirements.`,
              },
              {
                icon: "📱",
                title: "Study Anywhere",
                desc: "Access your course on any device — desktop, tablet, or phone. Study at home, during lunch, or on the go.",
              },
              {
                icon: "✅",
                title: "Pass Guarantee",
                desc: "Meet the study hours, score 80%+ on the practice exam three times, and test within 30 days of enrollment. If you don't pass, we refund your course fee.",
              },
              {
                icon: "⚡",
                title: "Same-Day CE Reporting",
                desc: `We report your CE completions to the ${stateData.doiName} the same day you finish. No paperwork needed.`,
              },
              {
                icon: "🎓",
                title: "Built to Pass",
                desc: "Practice exams that mirror your actual state exam, flashcards, and video lessons taught by licensed experts.",
              },
              {
                icon: "💬",
                title: "Real Support",
                desc: "Questions? Our expert support team answers real questions about the course and the licensing process.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-bg rounded-xl p-5">
                <p className="text-2xl mb-3">{item.icon}</p>
                <h3 className="font-bold text-navy mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fix 4 — Lead testimonial uses state-matched data */}
      {/* Auto-fills all 3 cards with state-specific YouTube testimonials
          (falling back to generic when fewer than 3 are available). */}
      <TestimonialCards stateName={stateData.name} seed={stateData.slug} />

      <PracticeExamCTA
        stateName={stateData.name}
        stateSlug={stateData.slug}
        practiceExams={stateData.practiceExams}
      />

      {/* Recent Articles — link to corresponding state-license-{slug} blog cluster.
          Allowlisted by slug because only ~30 of 50 states currently have a cluster
          (verified against src/content/blog/ at edit time). Florida & Texas use
          their own custom cluster names — handled by the curated "Deep Dive" block
          immediately below, so they're intentionally excluded here. */}
      {(() => {
        const stateLicenseClusterSlugs = new Set([
          "alabama",
          "arizona",
          "california",
          "colorado",
          "connecticut",
          "georgia",
          "illinois",
          "indiana",
          "kentucky",
          "louisiana",
          "maryland",
          "massachusetts",
          "michigan",
          "minnesota",
          "missouri",
          "nevada",
          "new-jersey",
          "new-york",
          "north-carolina",
          "ohio",
          "oregon",
          "pennsylvania",
          "south-carolina",
          "tennessee",
          "virginia",
          "washington",
          "wisconsin",
        ]);
        if (!stateLicenseClusterSlugs.has(stateData.slug)) return null;
        return (
          <section className="bg-white py-10 px-4 border-t border-gray-100">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gold-dark font-semibold uppercase tracking-wide text-xs mb-2">
                Recent Articles
              </p>
              <Link
                href={`/blog/state-license-${stateData.slug}/`}
                className="text-base md:text-lg font-bold text-navy hover:text-gold-dark transition-colors underline-offset-4 hover:underline"
              >
                {stateData.name} Insurance License — Articles, Guides &amp; News &rarr;
              </Link>
              <p className="text-gray-500 text-sm mt-2">
                Step-by-step guides, exam prep tips, and the latest {stateData.name} licensing updates.
              </p>
            </div>
          </section>
        );
      })()}

      {(() => {
        const blogMap: Record<string, { href: string; title: string }> = {
          florida: {
            href: "/blog/florida-insurance-license/best-florida-insurance-prelicensing-courses-2026",
            title: "Best Florida Insurance Prelicensing Courses 2026: JustInsurance vs XCEL vs ExamFX",
          },
          texas: {
            href: "/blog/texas-insurance-license/best-texas-insurance-prelicensing-courses-2026",
            title: "Best Texas Insurance Prelicensing Courses 2026: JustInsurance vs XCEL vs ExamFX vs AD Banker",
          },
          georgia: {
            href: "/blog/state-license-georgia/how-to-get-your-georgia-insurance-license-2026-step-by-step-guide",
            title: "How to Get Your Georgia Insurance License: 2026 Step-by-Step Guide",
          },
          ohio: {
            href: "/blog/state-license-ohio/how-to-get-your-ohio-insurance-license-2026-step-by-step-guide",
            title: "How to Get Your Ohio Insurance License: 2026 Step-by-Step Guide",
          },
          illinois: {
            href: "/blog/state-license-illinois/how-to-get-your-illinois-insurance-license-2026-step-by-step-guide",
            title: "How to Get Your Illinois Insurance License: 2026 Step-by-Step Guide",
          },
          pennsylvania: {
            href: "/blog/state-license-pennsylvania/how-to-get-your-pennsylvania-insurance-license-2026-step-by-step-guide",
            title: "How to Get Your Pennsylvania Insurance License: 2026 Step-by-Step Guide",
          },
          arizona: {
            href: "/blog/state-license-arizona/how-to-get-your-arizona-insurance-license-2026-step-by-step-guide",
            title: "How to Get Your Arizona Insurance License: 2026 Step-by-Step Guide",
          },
          "north-carolina": {
            href: "/blog/state-license-north-carolina/how-to-get-your-north-carolina-insurance-license-2026-step-by-step-guide",
            title: "How to Get Your North Carolina Insurance License: 2026 Step-by-Step Guide",
          },
        };
        const feat = blogMap[stateData.slug];
        if (!feat) return null;
        return (
          <section className="bg-white py-12 px-4 border-t border-gray-100">
            <div className="max-w-3xl mx-auto">
              <p className="text-gold-dark font-semibold uppercase tracking-wide text-xs mb-2 text-center">
                Deep Dive
              </p>
              <a
                href={feat.href}
                className="block bg-gray-bg hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-xl p-6 transition-colors group"
              >
                <h3 className="text-lg md:text-xl font-bold text-navy mb-2 group-hover:text-gold-dark transition-colors">
                  {feat.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  Full walkthrough of the {stateData.name} licensing process with
                  primary-source data from the {stateData.doiName}, Pearson VUE/PSI, and NIPR.
                </p>
                <p className="mt-3 text-gold-dark font-semibold text-sm group-hover:underline">
                  Read the full {stateData.name} guide →
                </p>
              </a>
            </div>
          </section>
        );
      })()}

      <FAQAccordion faqs={faqs} heading={`${stateData.name} Insurance License FAQs`} />

      {/* Fix 7 — Special training requirements section (FL, CA, TX, NY, etc.) */}
      {hasSpecialTraining && (
        <section className="bg-navy py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
              Special Training Requirements for {stateData.name}
            </h2>
            <p className="text-blue-200 text-center mb-10 max-w-xl mx-auto">
              {stateData.name} mandates additional training for agents selling certain product types. Review these requirements before you apply.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specialTrainingItems.map((item) => (
                <div key={item.label} className="bg-white/10 rounded-xl p-6 border border-white/20">
                  <h3 className="font-bold text-white mb-2 text-sm">{item.label}</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="state-hub"
        variant="gray"
      />

      {/* Visible "Last updated" stamp above the final CTA */}
      <section className="bg-white py-6 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <LastUpdated date={stateData.lastVerified} />
        </div>
      </section>

      <CTABanner
        title={`Ready to Get Your ${stateData.name} Insurance License?`}
        subtitle="Enroll in a state-approved prelicensing course today. 100% online, self-paced, and backed by our pass guarantee."
        ctaText="Browse Courses"
        ctaHref={`/${stateData.slug}/prelicensing/`}
      />
    </>
  );
}
