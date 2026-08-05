import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateParams } from "@/lib/generateStaticParams";
import { hasPassGuarantee } from "@/lib/pass-guarantee";
import { hasClassroomWebinarHours, withIlWebinarFaq, IL_WEBINAR_SHORT_LINE } from "@/lib/il-webinar";
import { generateArticleSchemaWithReviewer, generateBreadcrumbSchema, generateFAQSchema, generateStateHubCourseSchema, SchemaMarkup } from "@/lib/schema";
import { getStateHubFAQs, buildFaqData } from "@/lib/faq-data";
import ArticleByline from "@/components/ArticleByline";
import IllinoisWebinarCallout from "@/components/IllinoisWebinarCallout";
import Link from "next/link";
import StateHero from "@/components/StateHero";
import TrustBar from "@/components/TrustBar";
import TwoPathSelector from "@/components/TwoPathSelector";
import { PC_STATE_SLUGS, getPCPackagesForState } from "@/data/pc-ce-packages";
import StateRequirementsBlock from "@/components/StateRequirementsBlock";
import TestimonialCards from "@/components/TestimonialCards";
import TrustpilotStateReviews from "@/components/TrustpilotStateReviews";
import FAQAccordion from "@/components/FAQAccordion";
import PracticeExamCTA from "@/components/PracticeExamCTA";
import StateNoticesSection from "@/components/StateNoticesSection";
import StateProviderBadge from "@/components/StateProviderBadge";
import { credentialKindFromHours, isPrelicensingHeld, isCeAvailable, isCeApprovedComingSoon, isPrelicensingApprovedComingSoon } from "@/lib/prelicensing-status";
import LastUpdated from "@/components/LastUpdated";
import CTABanner from "@/components/CTABanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedStatePages from "@/components/RelatedStatePages";
import StateSalaryCard from "@/components/StateSalaryCard";
import HowToGetLicensed from "@/components/HowToGetLicensed";
import YouTubeEmbed from "@/components/YouTubeEmbed";

// State-hub step-by-step walkthrough videos. Single-source-of-truth video
// data lives in src/lib/youtube-videos.json; the per-state map below carries
// the additional fields needed for VideoObject schema (description + thumb).
// Added FL 2026-06-09; added CA + TX 2026-06-12.
type StateHubVideo = {
  videoId: string;
  title: string;
  uploadDate: string;
  duration: string;
  description: string;
};
const STATE_HUB_VIDEOS: Record<string, StateHubVideo> = {
  florida: {
    videoId: "o80zGv0ksMA",
    title: "How To Get Your Florida Life + Health Insurance License (Step by Step)",
    uploadDate: "2026-06-09",
    duration: "PT5M54S",
    description:
      "Step-by-step walkthrough of the Florida 2-15 Life, Health & Annuity license process: 60-hr prelicensing, $44 Pearson VUE exam, IdentoGO fingerprinting, and NIPR application. Hosted by Justin vom Eigen, IDECC Certified Distance Education Instructor and founder of JustInsurance LLC.",
  },
  california: {
    videoId: "urRztwGUnhY",
    title: "How To Get Your California Life + Health Insurance License (Step by Step)",
    uploadDate: "2026-06-11",
    duration: "PT7M18S",
    description:
      "Step-by-step walkthrough of the California Life & Health license process: 12-hour Code & Ethics requirement (post-AB 943), $98 PSI exam, Live Scan fingerprinting, and CDI application via NIPR. Hosted by Justin vom Eigen, IDECC Certified Distance Education Instructor and founder of JustInsurance LLC.",
  },
  texas: {
    videoId: "ZgLGWFzBcGA",
    title: "How To Get Your Texas Life + Health Insurance License (Step by Step)",
    uploadDate: "2026-06-11",
    duration: "PT5M51S",
    description:
      "Step-by-step walkthrough of the Texas General Lines Life, Accident & Health license process: optional prelicensing, $39 Pearson VUE InsTX-LAH05 exam, IdentoGO fingerprinting, and TDI application via Sircon/NIPR. Hosted by Justin vom Eigen, IDECC Certified Distance Education Instructor and founder of JustInsurance LLC.",
  },
};

function buildStateVideoSchema(v: StateHubVideo) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: v.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
    uploadDate: v.uploadDate,
    duration: v.duration,
    contentUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.videoId}`,
  };
}

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
  // Availability gate centralized in generatePageMetadata (metadata.ts): a held
  // prelicensing state (NY #80025) gets a coming-soon title + the description
  // below instead of the default "$199 … instant online access" marketing. Live
  // and exam-only states (WA is not held) are byte-identical.
  const meta = generatePageMetadata({
    pageType: "state-hub",
    stateName: stateData.name,
    stateSlug: stateData.slug,
    stateAbbreviation: stateData.abbreviation,
    examProvider: stateData.examInfo?.examProvider,
    available: !isPrelicensingHeld(stateData),
    comingSoonDescription: isPrelicensingApprovedComingSoon(stateData)
      ? `JustInsurance is an approved ${stateData.name} provider (#${stateData.providerApprovalNumber}) — our ${stateData.name} prelicensing courses are opening for enrollment soon. See ${stateData.name} license requirements, exam info, and fees.`
      : `Our ${stateData.name} prelicensing courses are opening for enrollment soon. See ${stateData.name} license requirements, exam info, and fees.`,
  });

  // Spanish-language pilot — emit hreflang reciprocity ONLY for FL/TX.
  // Self-references "en-US" + "es-US" + "x-default" → English canonical.
  // URLs MUST be no-slash to match site canonical (middleware.ts:60-68
  // 308-redirects trailing slash → no-slash). Fixed 2026-06-12 after
  // Semrush flagged 8 hreflang errors caused by trailing slashes here.
  if (stateData.slug === "florida" || stateData.slug === "texas") {
    const enUrl = `https://justinsuranceco.com/${stateData.slug}`;
    const esUrl = `https://justinsuranceco.com/es/${stateData.slug}`;
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

  // Ohio Admin. Code 3901-5-07(H)(16) — no pass-guarantee offers on
  // Ohio-facing pages. Gates the hero fallback, the 3-card bullet, the
  // "Why Choose" grid card, and the closing CTA below. All other states
  // keep the guarantee unchanged.
  const guaranteeOk = hasPassGuarantee(stateData.slug);
  const isProviderApproved = stateData.providerApprovalNumber !== "PENDING";
  // CE PURCHASE / CE-CLAIM GATE — providerApprovalNumber becoming a REAL number for
  // an APPROVED-but-not-live state (WA #300632 / NY #80025) must NOT turn on a CE
  // enroll/price CTA or a live "same-day reporting" / "state-approved CE" claim,
  // because no CE course actually exists to buy or to report. ceAvailable is the
  // true purchase gate (approved AND ceCoursesLive !== false); ceComingSoon is the
  // approved-but-not-live case, which shows "courses coming soon" with the provider
  // number instead of a buy CTA. Live-and-approved states are unchanged
  // (ceAvailable === isProviderApproved there). Prelicensing/isPrelicensingHeld
  // logic below is deliberately left as-is (it already holds NY).
  const ceAvailable = isCeAvailable(stateData);
  const ceComingSoon = isCeApprovedComingSoon(stateData);
  // AVAILABILITY GATE — a state that MANDATES prelicensing but whose JustInsurance
  // provider approval is still PENDING (New York today) must NOT present a live
  // purchase path. Mirrors the requirements / cost / prelicensing sibling gating.
  // isPrelicensingHeld is NY-only right now (Washington is also PENDING but
  // exam-only, so it is NOT held) and reverts automatically the moment
  // providerApprovalNumber becomes a real number. Used to reframe the hero
  // subtitle (also the page meta description) and the closing CTA below.
  const prelicensingHeld = isPrelicensingHeld(stateData);
  // Approved provider whose prelicensing course is not open for enrollment yet
  // (New York #80025): drives "approved — opening soon" copy in the held hero /
  // CTA instead of the generic "completing state approval" wording.
  const prelicensingApprovedComingSoon = isPrelicensingApprovedComingSoon(stateData);
  // "Starting at" price for the inline overview P&C CE card — the state's lowest
  // P&C package price, never a hard-coded figure. Falls back to the L&H CE price.
  const pcStartPrice = PC_STATE_SLUGS.includes(stateData.slug)
    ? `$${Math.min(...getPCPackagesForState(stateData.slug).map((p) => Number(p.price.replace(/[^0-9.]/g, ""))))}`
    : stateData.ce.packagePrice;

  // 50 Ill. Adm. Code Part 3119 — Illinois requires 7.5 of the 20
  // prelicensing hours per line via live classroom/webinar with verified
  // attendance. When set (Illinois only), the webinar-format callout renders
  // high on the page, unqualified "self-paced" primary claims switch to the
  // approved hybrid framing, and the approved format FAQ is appended (flows
  // into FAQPage JSON-LD). All other states render byte-identically.
  const ilWebinar = hasClassroomWebinarHours(stateData);

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

  // Fix 6 — append state-specific FAQ as question 6.
  // withIlWebinarFaq appends the approved Illinois live-webinar format FAQ
  // (50 Ill. Adm. Code 3119) as the final question when the state carries
  // classroomWebinarHours; no-op for every other state.
  const faqs = withIlWebinarFaq(
    [
      ...baseFaqs,
      {
        question: stateData.stateSpecificFAQ.question,
        answer: stateData.stateSpecificFAQ.answer,
      },
    ],
    stateData
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
  ]);
  const faqSchema = generateFAQSchema(faqs);
  const lahHours = stateData.prelicensing?.lifeAndHealth?.hours;
  // Shared with the visible StateProviderBadge below so the JSON-LD Course
  // description never claims a "state-approved prelicensing" credential in
  // CE-only states (see src/lib/prelicensing-status.ts).
  const stateCredentialKind = credentialKindFromHours([
    stateData.prelicensing?.life?.hours,
    stateData.prelicensing?.health?.hours,
    stateData.prelicensing?.lifeAndHealth?.hours,
  ]);
  // A "state-approved PRELICENSING" claim needs BOTH: approval granted AND the
  // state actually regulating prelicensing. In exam-only states our approval is
  // CE-only, so isProviderApproved alone would assert a credential we do not hold.
  const prelicensingApproved =
    isProviderApproved && stateCredentialKind === "prelicensing" && !prelicensingHeld;
  // Do we have ANY live, approved course in this state? WA/NY hold provider
  // approvals but nothing live, so the "State-Approved Courses" trust card gives
  // them a truthful "approved provider — courses coming soon" variant instead of
  // "every course is approved" (false: nothing live) or "approval pending"
  // (false: they ARE approved).
  const anyCourseLiveApproved = ceAvailable || prelicensingApproved;
  const approvedProviderComingSoon = !anyCourseLiveApproved && isProviderApproved;
  const courseSchemaBase = generateStateHubCourseSchema({
    stateName: stateData.name,
    stateSlug: stateData.slug,
    price: stateData.prelicensing?.lifeAndHealth?.price || "$199",
    hours: typeof lahHours === "number" ? lahHours : undefined,
    credentialKind: stateCredentialKind,
    // Held prelicensing state (NY) → null: no InStock $199 prelicensing Offer.
    available: !prelicensingHeld,
  });
  // 50 Ill. Adm. Code 3119 — the shared Course-schema generator's description
  // contains an unqualified "100% online, self-paced" claim. Override the
  // description for Illinois only; all other states get the generator's
  // object untouched.
  const courseSchema = ilWebinar
    ? {
        ...courseSchemaBase,
        description: `State-approved online insurance prelicensing course for ${stateData.name}. Pass your ${stateData.name} state licensing exam on the first attempt. ${IL_WEBINAR_SHORT_LINE} Includes practice exams.`,
      }
    : courseSchemaBase;

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name },
  ];

  // Fix 1 — hero subtitle from stateSpecificIntro with fallback.
  // Illinois (50 Ill. Adm. Code 3119) currently always takes the
  // stateSpecificIntro branch (its intro is non-empty and makes no format
  // claim), but the fallback is gated too so an unqualified "self-paced"
  // claim can never surface on Illinois even if the intro is ever emptied.
  // A held state (isPrelicensingHeld — New York today) takes the TOP-priority
  // neutral opening-soon branch over stateSpecificIntro/ilWebinar/etc. so the
  // hero — and the page meta description, which is set to heroSubtitle — never
  // presents an enrollment/purchase claim while approval is still pending.
  const heroSubtitle = prelicensingHeld
    ? prelicensingApprovedComingSoon
      ? `JustInsurance is an approved ${stateData.name} provider (#${stateData.providerApprovalNumber}) — our ${stateData.name} prelicensing courses are opening for enrollment soon.`
      : `${stateData.name} prelicensing courses are completing state approval and will open for enrollment soon.`
    : stateData.stateSpecificIntro && stateData.stateSpecificIntro.trim() !== ""
      ? stateData.stateSpecificIntro
      : ilWebinar
      ? `State-approved prelicensing and CE courses. 100% online. ${IL_WEBINAR_SHORT_LINE}`
      : !prelicensingApproved
      ? "Prelicensing and CE courses. 100% online, self-paced, with instant access the moment you enroll."
      : guaranteeOk
      ? "State-approved prelicensing and CE courses. 100% online, self-paced, pass guarantee included."
      : "State-approved prelicensing and CE courses. 100% online, self-paced, with instant access the moment you enroll.";

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
      {/* Prelicensing Course JSON-LD carries a purchasable $199 InStock Offer
          (generateStateHubCourseSchema). A held prelicensing state (New York:
          approved #80025 but courses not yet open — isPrelicensingHeld) has no
          buyable prelicensing course, so emitting an InStock/Paid Offer would be
          a false machine-readable availability signal. Skip the block entirely
          for held states; every live/exam-only state (FL, TX, WA exam-prep, …)
          keeps its Course schema byte-identically. */}
      {!prelicensingHeld && <SchemaMarkup schema={courseSchema} />}
      <SchemaMarkup schema={articleSchema} />
      {STATE_HUB_VIDEOS[stateData.slug] && (
        <SchemaMarkup schema={buildStateVideoSchema(STATE_HUB_VIDEOS[stateData.slug])} />
      )}

      <BreadcrumbNav crumbs={crumbs} />

      {/* Spanish-language pilot — visible link to /es/{slug} for FL/TX only.
          Pairs with the hreflang annotations in generateMetadata so Spanish-speaking
          visitors landing on the EN hub can find the ES version. */}
      {(stateData.slug === "florida" || stateData.slug === "texas") && (
        <div className="bg-gold/10 border-y border-gold/30 py-3 px-4 text-center">
          <a
            href={`/es/${stateData.slug}`}
            hrefLang="es-US"
            className="text-navy font-semibold hover:text-gold-deep transition-colors text-sm md:text-base inline-flex items-center gap-2"
          >
            <span aria-hidden="true">🌎</span>
            <span>Curso de licencia de seguros en español — próximamente →</span>
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
        ctaButtons={
          ilWebinar
            ? [{ text: "Start Prelicensing", href: `/${stateData.slug}/prelicensing` }]
            : [
                // Held prelicensing state (NY: approved #80025, courses not open
                // yet — prelicensingHeld) gets a non-enroll "Opening Soon" label
                // instead of "Start Prelicensing"; WA exam-prep prelicensing IS
                // live, so it keeps "Start Prelicensing". Live states unchanged.
                {
                  text: prelicensingHeld ? "Prelicensing — Opening Soon" : "Start Prelicensing",
                  href: `/${stateData.slug}/prelicensing`,
                },
                // "Renew with CE" implies a live, purchasable CE renewal path.
                // Where CE isn't live (WA #300632 approved-coming-soon; NY CE
                // approval pending — !ceAvailable) relabel to the informational
                // "View CE Info" (same href). Live approved states unchanged.
                {
                  text: ceAvailable ? "Renew with CE" : "View CE Info",
                  href: `/${stateData.slug}/continuing-education`,
                  variant: "secondary",
                },
              ]
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* 50 Ill. Adm. Code 3119 — Illinois-only live-webinar format callout,
          placed at the very top of the main content (directly under the hero
          + byline) so the hybrid format is established before any course
          copy. Never rendered for other states. */}
      {ilWebinar && <IllinoisWebinarCallout />}

      <TrustBar stateSlug={stateData.slug} />

      <StateProviderBadge
        stateName={stateData.name}
        doiName={stateData.doiName}
        providerNumber={stateData.providerNumber}
        doiUrl={stateData.doiUrl}
        stateSlug={stateData.slug}
        credentialKind={stateCredentialKind}
      />

      {/* State-hub step-by-step walkthrough video for the states that have
          one (FL/CA/TX as of 2026-06-12 — see STATE_HUB_VIDEOS above).
          Placed after the provider badge so credibility signals (DOI +
          provider #) frame the video, and before specialNotices /
          TwoPathSelector so it gets dwell-time weight on these high-
          impression surfaces. VideoObject schema emitted above. */}
      {STATE_HUB_VIDEOS[stateData.slug] && (
        <YouTubeEmbed
          videoId={STATE_HUB_VIDEOS[stateData.slug].videoId}
          title={STATE_HUB_VIDEOS[stateData.slug].title}
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
                  {ilWebinar ? (
                    // 50 Ill. Adm. Code 3119 — approved short format line
                    // replaces the unqualified self-paced claim on Illinois.
                    <>New to insurance? Get your {stateData.name} insurance license with a state-approved prelicensing course. {IL_WEBINAR_SHORT_LINE} Then pass the state exam.</>
                  ) : (
                    <>New to insurance? Get your {stateData.name} insurance license with {prelicensingApproved ? "a state-approved" : "an online"} prelicensing course. Study online at your own pace, then pass the state exam.</>
                  )}
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {ilWebinar ? "Live webinar hours + self-paced study" : "100% online & self-paced"}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {guaranteeOk ? "Pass guarantee included" : "Instant course access"}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Starting at $199
                  </li>
                </ul>
                <Link
                  href={`/${stateData.slug}/prelicensing`}
                  className="block text-center bg-navy hover:bg-navy-light text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Get My License &rarr;
                </Link>
              </div>

              {/* CE cross-sell cards — hidden for states that require a live CE
                  ethics component (Illinois: 3 of 24 CE hours must be a
                  classroom/webinar ethics course, 215 ILCS 5/500-35(b)(1)), so
                  the hub never markets a self-paced CE package where the state
                  bars it. Non-IL states are unaffected (byte-identical). */}
              {!ilWebinar && (
                <>
              {/* L&H CE Card */}
              <div className="border-2 border-gold rounded-xl p-8 flex flex-col hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">L&amp;H Continuing Education</h3>
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                  Already licensed in life &amp; health? Complete your {stateData.name} CE hours online before your renewal deadline.{ceAvailable ? " We typically report your completion to the state same-day." : ""}
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {ceAvailable ? "Same-day DOI reporting" : "Self-paced on any device"}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Complete at your own pace
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {ceAvailable
                      ? `Starting at ${stateData.ce.packagePrice}`
                      : ceComingSoon
                      ? "Approved — courses coming soon"
                      : "State approval pending"}
                  </li>
                </ul>
                {ceAvailable ? (
                  <Link
                    href={`/${stateData.slug}/continuing-education`}
                    className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Renew L&amp;H License &rarr;
                  </Link>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {ceComingSoon
                        ? `Approved ${stateData.name} CE provider (#${stateData.providerApprovalNumber}) — courses coming soon.`
                        : `${stateData.name} CE course approval is pending.`}
                    </p>
                    <Link
                      href={`/${stateData.slug}/continuing-education`}
                      className="block text-center border-2 border-gold text-navy hover:bg-gold/10 font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      View {stateData.name} CE Info &rarr;
                    </Link>
                  </>
                )}
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
                  Hold a P&amp;C license? Complete your {stateData.name} P&amp;C continuing education online with {ceAvailable ? "state-approved " : ""}Ethics + P&amp;C electives.{ceAvailable ? " Same-day DOI reporting is typically included." : ""}
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {ceAvailable ? "State-approved " : ""}Ethics + P&amp;C
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {ceAvailable ? "Same-day DOI reporting" : "Self-paced on any device"}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {ceAvailable
                      ? `Starting at ${pcStartPrice}`
                      : ceComingSoon
                      ? "Approved — courses coming soon"
                      : "State approval pending"}
                  </li>
                </ul>
                {ceAvailable ? (
                  <Link
                    href={`/${stateData.slug}/continuing-education/property-and-casualty`}
                    className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Renew P&amp;C License &rarr;
                  </Link>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {ceComingSoon
                        ? `Approved ${stateData.name} CE provider (#${stateData.providerApprovalNumber}) — courses coming soon.`
                        : `${stateData.name} CE course approval is pending.`}
                    </p>
                    <Link
                      href={`/${stateData.slug}/continuing-education/property-and-casualty`}
                      className="block text-center border-2 border-gold text-navy hover:bg-gold/10 font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      View {stateData.name} P&amp;C CE Info &rarr;
                    </Link>
                  </>
                )}
              </div>
                </>
              )}
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
        <div className="max-w-5xl mx-auto flex flex-wrap gap-x-8 gap-y-1 text-xs text-gray-500">
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
              href={`/${stateData.slug}/requirements`}
              className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <p className="text-2xl mb-2" aria-hidden="true">📋</p>
              <h3 className="font-bold text-navy text-sm mb-1">{stateData.name} Requirements</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Hours, exam, fingerprinting, fees, and CE rules.
              </p>
            </Link>
            <Link
              href={`/${stateData.slug}/prelicensing`}
              className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <p className="text-2xl mb-2" aria-hidden="true">🎓</p>
              <h3 className="font-bold text-navy text-sm mb-1">{stateData.name} Prelicensing</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {prelicensingApproved ? "State-approved prelicensing courses for Life, Health, and Life & Health lines." : "Prelicensing courses for Life, Health, and Life & Health lines."}
              </p>
            </Link>
            {!ilWebinar && (
              <Link
                href={`/${stateData.slug}/continuing-education`}
                className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-gold hover:shadow-md transition-all"
              >
                <p className="text-2xl mb-2" aria-hidden="true">🔄</p>
                <h3 className="font-bold text-navy text-sm mb-1">{stateData.name} CE Courses</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Renew your {stateData.name} license with online CE.
                </p>
              </Link>
            )}
            <Link
              href={`/${stateData.slug}/practice-exam`}
              className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <p className="text-2xl mb-2" aria-hidden="true">📝</p>
              <h3 className="font-bold text-navy text-sm mb-1">{stateData.name} Practice Exam</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                Free practice questions modeled on the real {stateData.name} exam.
              </p>
            </Link>
            <Link
              href={`/${stateData.slug}/cost`}
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
            We&apos;ve helped train 30,000+ students nationwide. Here&apos;s why they choose us.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🏛️",
                title: anyCourseLiveApproved
                  ? "State-Approved Courses"
                  : approvedProviderComingSoon
                  ? "State-Approved Provider"
                  : "Built to State Standards",
                desc: anyCourseLiveApproved
                  ? `Every JustInsurance course is officially approved by the ${stateData.doiName} to fulfill ${stateCredentialKind === "prelicensing" ? "prelicensing and CE" : "CE"} requirements.`
                  : approvedProviderComingSoon
                  ? `JustInsurance is an approved ${stateData.doiName} provider (#${stateData.providerApprovalNumber}); our ${stateData.name} ${stateCredentialKind === "prelicensing" ? "" : "CE "}courses are coming soon.`
                  : `JustInsurance courses are built to the ${stateData.doiName}'s ${stateCredentialKind === "prelicensing" ? "prelicensing and CE" : "CE"} standards; full state approval is pending.`,
              },
              {
                icon: "📱",
                title: "Study Anywhere",
                desc: "Access your course on any device — desktop, tablet, or phone. Study at home, during lunch, or on the go.",
              },
              // Ohio Admin. Code 3901-5-07(H)(16): swap the guarantee card
              // 1-for-1 for excluded states so the 6-card grid keeps its shape.
              guaranteeOk
                ? {
                    icon: "✅",
                    title: "Pass Guarantee",
                    desc: "Meet the study hours, score 80%+ on the practice exam three times, and test within 30 days of enrollment. If you don't pass, we refund your course fee.",
                  }
                : {
                    icon: "⏱️",
                    title: "Instant Course Access",
                    // A held prelicensing state (NY) has nothing live to unlock,
                    // so the present-tense "unlocks the moment your order
                    // completes" claim is softened to a coming-soon promise.
                    // Every other state keeps the live wording byte-identically.
                    desc: prelicensingHeld
                      ? `Your ${stateData.name} courses are opening for enrollment soon — you'll be able to enroll and start online the moment they go live.`
                      : "Enroll and start studying within minutes — no waiting, no shipping. Your course unlocks the moment your order completes.",
                  },
              {
                icon: "⚡",
                title: ceAvailable ? "Same-Day CE Reporting" : "Self-Paced CE",
                desc: ceAvailable
                  ? `We typically report your CE completions to the ${stateData.doiName} the same day you finish. No paperwork needed.`
                  : `Our ${stateData.name} CE courses will be fully online and self-paced — study on any device, no classroom, no paperwork. Coming soon.`,
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
          {/* Footnote for the "Same-Day CE Reporting" card above. It is a
              DOI-reporting claim, so it must render ONLY where our provider
              approval has actually issued — pending states (NY, WA) cannot
              report completions to their regulator at all, and their own CE FAQ
              correctly says approval is pending. Gated on the same
              ceAvailable the card is gated on so an approved-but-not-live
              state (WA/NY) never claims same-day reporting for a course that
              does not exist yet; live approved states are byte-identical. */}
          {ceAvailable && (
            <p className="text-xs text-gray-500 mt-6 max-w-3xl mx-auto text-center">
              *JustInsurance typically transmits your completion to your state insurance regulator the same business day you finish; the time for your state to post the credit to your license record varies by state.
            </p>
          )}
        </div>
      </section>

      {/* Fix 4 — Lead testimonial uses state-matched data */}
      {/* Auto-fills all 3 cards with state-specific YouTube testimonials
          (falling back to generic when fewer than 3 are available). */}
      <TestimonialCards stateName={stateData.name} seed={stateData.slug} stateSlug={stateData.slug} />

      <TrustpilotStateReviews stateName={stateData.name} />

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
              <p className="text-gold-deep font-semibold uppercase tracking-wide text-xs mb-2">
                Recent Articles
              </p>
              <Link
                href={`/blog/state-license-${stateData.slug}`}
                className="text-base md:text-lg font-bold text-navy hover:text-gold-deep transition-colors underline-offset-4 hover:underline"
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
            href: "/blog/florida-insurance-license",
            title: "How to Get Your Florida Insurance License: Step-by-Step Guide",
          },
          texas: {
            href: "/blog/texas-insurance-license",
            title: "How to Get Your Texas Insurance License: Step-by-Step Guide",
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
              <p className="text-gold-deep font-semibold uppercase tracking-wide text-xs mb-2 text-center">
                Deep Dive
              </p>
              <a
                href={feat.href}
                className="block bg-gray-bg hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-xl p-6 transition-colors group"
              >
                <h3 className="text-lg md:text-xl font-bold text-navy mb-2 group-hover:text-gold-deep transition-colors">
                  {feat.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  Full walkthrough of the {stateData.name} licensing process with
                  primary-source data from the {stateData.doiName}, {stateData.examInfo.examProvider}, and NIPR.
                </p>
                <p className="mt-3 text-gold-deep font-semibold text-sm group-hover:underline">
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
        subtitle={
          // A held state (isPrelicensingHeld: provider approval still PENDING —
          // New York today) must NOT present an "enroll / instant access" purchase
          // path. This branch takes precedence and gives held states the neutral
          // opening-soon message. Reverts automatically once approval issues.
          prelicensingHeld
            ? prelicensingApprovedComingSoon
              ? `JustInsurance is an approved ${stateData.name} provider (#${stateData.providerApprovalNumber}) — our ${stateData.name} prelicensing course is opening for enrollment soon.`
              : `Our ${stateData.name} prelicensing course is completing state approval and will open for enrollment soon.`
            // 50 Ill. Adm. Code 3119 — Illinois swaps the unqualified
            // "self-paced" claim for the approved hybrid format line.
            : ilWebinar
            ? `Enroll in a state-approved prelicensing course today. ${IL_WEBINAR_SHORT_LINE}`
            : !prelicensingApproved
            ? "Enroll in an online prelicensing course today. 100% online, self-paced, with instant access the moment you enroll."
            : guaranteeOk
            ? "Enroll in a state-approved prelicensing course today. 100% online, self-paced, and backed by our pass guarantee."
            : "Enroll in a state-approved prelicensing course today. 100% online, self-paced, with instant access the moment you enroll."
        }
        ctaText={prelicensingHeld ? "Learn More" : "Browse Courses"}
        ctaHref={`/${stateData.slug}/prelicensing`}
      />
    </>
  );
}
