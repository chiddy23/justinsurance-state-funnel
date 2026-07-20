import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { isPrelicensingHeld, credentialKindFromHours } from "@/lib/prelicensing-status";
import PrelicensingHeldNotice from "@/components/PrelicensingHeldNotice";
import { LOA_DEFINITIONS, type LOASlug } from "@/lib/loa";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateLOAParams } from "@/lib/generateStaticParams";
import {
  generateArticleSchemaWithReviewer,
  generateCourseSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  SchemaMarkup,
} from "@/lib/schema";
import { getPrelicensingCourseFAQs, buildFaqData } from "@/lib/faq-data";
import { hasPassGuarantee } from "@/lib/pass-guarantee";
import { hasClassroomWebinarHours, withIlWebinarFaq, IL_WEBINAR_SHORT_LINE } from "@/lib/il-webinar";
import catalogLinks from "@/lib/catalog-links.json";
import ArticleByline from "@/components/ArticleByline";
import IllinoisWebinarCallout from "@/components/IllinoisWebinarCallout";
import StateHero from "@/components/StateHero";
import CourseOverviewBox from "@/components/CourseOverviewBox";
import CourseFeatures from "@/components/CourseFeatures";
import ExamInfoSection from "@/components/ExamInfoSection";
import PassGuarantee from "@/components/PassGuarantee";
import TestimonialCards from "@/components/TestimonialCards";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner, { RefundDisclosure } from "@/components/CTABanner";
import PracticeExamCTA from "@/components/PracticeExamCTA";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import PrelicenseApprovalNotice from "@/components/PrelicenseApprovalNotice";
import RelatedStatePages from "@/components/RelatedStatePages";
import LastUpdated from "@/components/LastUpdated";
import YouTubeEmbed from "@/components/YouTubeEmbed";

// LOA-buy-page step-by-step walkthrough videos. Each video's YouTube
// description points buyers to /[state]/prelicensing/life-and-health as
// the secondary link, so embedding it here closes the loop for the small
// fraction of viewers who click that secondary CTA. Per-state map; only
// applies to the life-and-health LOA. Added FL+CA+TX 2026-06-12.
type LoaVideo = {
  videoId: string;
  title: string;
  uploadDate: string;
  duration: string;
  description: string;
};
const LOA_VIDEOS: Record<string, LoaVideo> = {
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

function buildLoaVideoSchema(v: LoaVideo) {
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

type CatalogLinks = typeof catalogLinks;

function getCatalogLink(stateSlug: string, loaSlug: LOASlug): string {
  const stateCatalog = (catalogLinks as CatalogLinks)[stateSlug as keyof CatalogLinks];
  if (!stateCatalog) return "https://yourinsurancelicense.myabsorb.com/";
  const section = stateCatalog["prelicensing"] as Record<string, string>;
  return section?.[loaSlug] ?? "https://yourinsurancelicense.myabsorb.com/";
}

// Map states.ts lifeAndHealth key to LOASlug
function getCoursePricing(stateSlug: string, loaSlug: LOASlug) {
  const stateData = getStateBySlug(stateSlug);
  if (!stateData) return null;
  if (loaSlug === "life") return stateData.prelicensing.life;
  if (loaSlug === "health") return stateData.prelicensing.health;
  return stateData.prelicensing.lifeAndHealth;
}

const WHAT_YOULL_LEARN: Record<LOASlug, string[]> = {
  life: [
    "Types of life insurance policies — term, whole life, universal life, and variable products",
    "Life insurance policy provisions, riders, and exclusions",
    "Annuity products — fixed, variable, and indexed annuities",
    "Beneficiary designations and settlement options",
    "Underwriting concepts and insurable interest",
    "State regulations governing life insurance producers",
    "Agent ethics and the Unfair Trade Practices Act",
    "Replacing and surrendering life insurance policies",
  ],
  health: [
    "Individual and group health insurance policy types",
    "Major medical coverage, deductibles, coinsurance, and out-of-pocket limits",
    "Medicare, Medicaid, and Medicare Supplement (Medigap) policies",
    "Disability income insurance — short-term and long-term",
    "Long-term care insurance products and options",
    "Accident and sickness policy provisions",
    "COBRA, HIPAA, and ACA compliance basics",
    "State-specific health insurance regulations and agent duties",
  ],
  "life-and-health": [
    "Life insurance fundamentals — term, whole life, universal life, and variable products",
    "Annuities — fixed, indexed, and variable types explained",
    "Health insurance plans — individual, group, and Medicare products",
    "Disability income and long-term care insurance",
    "Medicare Supplement (Medigap) products and enrollment periods",
    "Policy provisions, riders, exclusions, and beneficiary rules",
    "State insurance laws, regulations, and agent ethics",
    "Underwriting, replacement policies, and the application process",
  ],
};

export function generateStaticParams() {
  return generateStateLOAParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; loa: string }>;
}): Promise<Metadata> {
  const { state, loa } = await params;
  const stateData = getStateBySlug(state);
  const loaDef = LOA_DEFINITIONS[loa as LOASlug];
  if (!stateData || !loaDef) return {};
  const pricing = getCoursePricing(state, loa as LOASlug);
  const hoursNum = typeof pricing?.hours === "number" ? pricing.hours : undefined;
  const baseMeta = generatePageMetadata({
    pageType: "prelicensing-course",
    stateName: stateData.name,
    stateSlug: stateData.slug,
    stateAbbreviation: stateData.abbreviation,
    loaName: loaDef.name,
    loaSlug: loaDef.slug,
    hours: hoursNum,
    price: pricing?.price,
  });
  return isPrelicensingHeld(stateData)
    ? {
        title: `${stateData.name} ${loaDef.name} Prelicensing — Enrollment Opening Soon | JustInsurance`,
        description: `Our ${stateData.name} ${loaDef.name} prelicensing course is completing state approval and will open for enrollment soon.`,
        robots: { index: false, follow: true },
      }
    : baseMeta;
}

export default async function PrelicensingCoursePage({
  params,
}: {
  params: Promise<{ state: string; loa: string }>;
}) {
  const { state, loa } = await params;
  const stateData = getStateBySlug(state);
  const loaDef = LOA_DEFINITIONS[loa as LOASlug];

  if (!stateData || !loaDef) notFound();

  const pricing = getCoursePricing(state, loa as LOASlug);
  if (!pricing) notFound();

  // Approval pending in a prelicensing-mandate state -> hold the course page.
  if (isPrelicensingHeld(stateData)) {
    return (
      <PrelicensingHeldNotice
        stateName={stateData.name}
        stateSlug={stateData.slug}
        loaName={loaDef.name}
      />
    );
  }

  const enrollLink = getCatalogLink(stateData.slug, loaDef.slug);
  const hoursIsNumber = typeof pricing.hours === "number";
  const pricingHoursNum = hoursIsNumber ? (pricing.hours as number) : undefined;

  // 50 Ill. Adm. Code Part 3119 — Illinois requires 7.5 of the 20
  // prelicensing hours per line via live classroom/webinar with verified
  // attendance. Gates the callout, hybrid hero/schema format copy, the
  // Course Overview format cell, and the appended format FAQ (flows into
  // FAQPage JSON-LD). Every other state renders byte-identically.
  const ilWebinar = hasClassroomWebinarHours(stateData);
  // California: AB 943 (eff. 1/1/2026, amending Cal. Ins. Code § 1749) repealed
  // line-specific product prelicensing hours. The only mandatory prelicensing is
  // a single 12-hour Code & Ethics course; line content is exam prep, not a
  // state-required line-specific curriculum. Gated so no other state changes.
  const isCalifornia = stateData.slug === "california";
  // States that impose monitored seat time / a required course duration (CA's
  // 12-hr timed C&E; MN's seat-time control) are NOT accurately "self-paced" —
  // the length is fixed. Gate the "online, self-paced / at your own pace" claims.
  const isMinnesota = stateData.slug === "minnesota";
  const monitoredHours = isCalifornia || isMinnesota;
  // Illinois live-webinar hours are charged PER LINE (7.5 live / 12.5 self of
  // each 20-hour line), so the combined 40-hour Life & Health course is
  // 15 live + 25 self — compute from the line count, never hardcode 7.5/12.5.
  const ilLineCount = hoursIsNumber
    ? Math.max(1, Math.round((pricingHoursNum as number) / 20))
    : 1;
  const ilLiveHours = ilWebinar
    ? (stateData.classroomWebinarHours as number) * ilLineCount
    : 0;
  const ilSelfHours =
    ilWebinar && hoursIsNumber ? (pricingHoursNum as number) - ilLiveHours : 0;

  const faqs = withIlWebinarFaq(
    getPrelicensingCourseFAQs(
      buildFaqData(stateData),
      loaDef.name,
      pricing.hours,
      pricing.price.replace("$", "")
    ),
    stateData
  );
  const learnBullets = WHAT_YOULL_LEARN[loaDef.slug];

  // Ohio Admin. Code 3901-5-07(H)(16): no pass-guarantee offers on Ohio
  // pages — hero copy, JSON-LD descriptions, "What's Included" list, and
  // the closing CTA all swap the guarantee clause for excluded states.
  const guaranteeOk = hasPassGuarantee(stateData.slug);
  const isProviderApproved = stateData.providerApprovalNumber !== "PENDING";
  const guaranteeSentence = guaranteeOk
    ? "Pass guarantee included."
    : "Instant course access.";

  const courseSchema = generateCourseSchema({
    stateName: stateData.name,
    stateSlug: stateData.slug,
    loaName: loaDef.name,
    loaSlug: loaDef.slug,
    courseType: "prelicensing",
    hours: pricingHoursNum,
    price: pricing.price,
    // 50 Ill. Adm. Code 3119 — Illinois Course schema descriptions use the
    // hybrid format instead of unqualified "online, self-paced".
    description: ilWebinar
      ? `${stateData.name} ${loaDef.name} prelicensing course — ${pricing.hours} hours per line (7.5 live webinar + 12.5 self-paced), state-approved. ${guaranteeSentence} ${pricing.price}.`
      : hoursIsNumber
      ? `${stateData.name} ${loaDef.name} prelicensing course — ${pricing.hours} hours, ${isProviderApproved ? "state-approved, " : ""}online, ${monitoredHours ? "on your own schedule" : "self-paced"}. ${guaranteeSentence} ${pricing.price}.`
      : `${stateData.name} ${loaDef.name} prelicensing course — online, ${monitoredHours ? "on your own schedule" : "self-paced"}. ${guaranteeSentence} ${pricing.price}.`,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
    { name: "Prelicensing", url: `https://justinsuranceco.com/${stateData.slug}/prelicensing` },
    { name: loaDef.shortName, url: `https://justinsuranceco.com/${stateData.slug}/prelicensing/${loaDef.slug}` },
  ]);
  const faqSchema = generateFAQSchema(faqs);
  // Product schema intentionally removed 2026-06-08: it was duplicating the
  // Course schema's entity, which Google was demoting to low-quality "product
  // snippets" (355 imp / pos 42.86 / 0.28% CTR in May 10 → June 6 GSC).
  // Course is the correct primary type for prelicensing pages; offers/pricing
  // already live inside the Course schema's hasCourseInstance.offers block.

  const articleHeadline = `${stateData.name} ${loaDef.name} Prelicensing Course`;
  // 50 Ill. Adm. Code 3119 — Illinois hero subtitle / Article description
  // swaps the unqualified self-paced claim for the approved short line.
  const articleDescription = ilWebinar
    ? `${pricing.hours}-hour state-approved course. ${IL_WEBINAR_SHORT_LINE} Then pass the ${stateData.name} licensing exam. ${guaranteeSentence} Only ${pricing.price}.`
    : hoursIsNumber
    ? `${pricing.hours}-hour ${isProviderApproved ? "state-approved " : ""}course. ${monitoredHours ? "Study online on your own schedule" : "Study online at your own pace"}, then pass the ${stateData.name} licensing exam. ${guaranteeSentence} Only ${pricing.price}.`
    : `Complete our ${loaDef.name} prelicensing course online at your own pace, then pass the ${stateData.name} licensing exam. ${guaranteeSentence} Only ${pricing.price}.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${stateData.slug}/prelicensing/${loaDef.slug}`,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}` },
    { name: "Prelicensing", href: `/${stateData.slug}/prelicensing` },
    { name: loaDef.shortName },
  ];

  return (
    <>
      <SchemaMarkup schema={courseSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />
      {loaDef.slug === "life-and-health" && LOA_VIDEOS[stateData.slug] && (
        <SchemaMarkup schema={buildLoaVideoSchema(LOA_VIDEOS[stateData.slug])} />
      )}

      <BreadcrumbNav crumbs={crumbs} />

      <PrelicenseApprovalNotice stateSlug={stateData.slug} loaSlug={loaDef.slug} stateName={stateData.name} />

      <StateHero
        eyebrow={`${stateData.name} ${loaDef.shortName} Prelicensing`}
        title={`${stateData.name} ${loaDef.name} Prelicensing Course`}
        subtitle={articleDescription}
        ctaButtons={[
          { text: `Enroll Now — ${pricing.price}`, href: enrollLink },
        ]}
      />

      {/* Item #6 — refund policy microcopy under the hero Enroll CTA */}
      <div className="bg-navy-dark px-4 pb-6">
        <p className="max-w-4xl mx-auto text-center text-blue-200 text-xs leading-relaxed">
          <RefundDisclosure />
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* 50 Ill. Adm. Code 3119 — Illinois-only live-webinar format callout,
          top of main content before the Course Overview box. */}
      {ilWebinar && <IllinoisWebinarCallout />}

      {/* Illinois treats Life and Accident & Health as SEPARATE lines of
          authority (215 ILCS 5/500-30(b)); Part 3119 certifies prelicensing
          courses per line against separate content exhibits (Ex. E Life, Ex. F
          A&H). So the "Life & Health" package is two individually IDOI-certified
          20-hour courses + two separate Pearson VUE exams — never one combined
          course/exam. IL L&H only. */}
      {ilWebinar && loaDef.slug === "life-and-health" && (
        <section className="bg-white py-10 px-4">
          <div className="max-w-4xl mx-auto bg-gray-bg border-l-4 border-gold rounded-r-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">
              How the Illinois Life &amp; Health package works
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              In Illinois, &ldquo;Life &amp; Health&rdquo; is not one combined
              course. State law treats Life and Accident &amp; Health as separate
              lines of authority (215 ILCS 5/500-25), so this package includes{" "}
              <strong>two individually state-approved prelicensing courses</strong>{" "}
              — a 20-hour Life course and a 20-hour Accident &amp; Health course
              (40 hours total), each with at least 7.5 hours of live classroom or
              webinar instruction. Each course is individually approved by the
              Illinois Department of Insurance.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your state exams are separate too: you&apos;ll sit a Life exam and a
              separate Accident &amp; Health exam through Pearson VUE, each with its
              own General and State portion — <strong>four exams in total</strong>{" "}
              for the Life &amp; Health license. We bundle both approved courses at
              one price so you&apos;re prepared for all four.
            </p>
          </div>
        </section>
      )}

      {/* Minnesota approves prelicensing per line of authority — the MN Dept.
          of Commerce course-approval application is filed one line at a time
          ("CHOOSE ONE LINE OF AUTHORITY") and requires 20 hours per line (Minn.
          Stat. § 45.37). So MN "Life & Health" is two separately approved
          courses, NOT one combined course. Unlike Illinois, though, MN DOES
          offer a combined Life, Accident & Health EXAM (135 items via PSI), so
          the exam side is a choice — verified 2026-07-14 vs. the PSI MN
          candidate bulletin. MN L&H only. */}
      {isMinnesota && loaDef.slug === "life-and-health" && (
        <section className="bg-white py-10 px-4">
          <div className="max-w-4xl mx-auto bg-gray-bg border-l-4 border-gold rounded-r-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">
              How the Minnesota Life &amp; Health package works
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              In Minnesota, &ldquo;Life &amp; Health&rdquo; is not one combined
              course. The Department of Commerce approves prelicensing education{" "}
              <strong>per line of authority</strong> — 20 hours per line — so
              this package includes{" "}
              <strong>two separately state-approved courses</strong>: a 20-hour
              Life course and a 20-hour Accident &amp; Health course (40 hours
              total). We bundle both approved courses at one price.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your exam, however, can go either way: after finishing both
              courses you may sit Minnesota&apos;s{" "}
              <strong>combined Life, Accident &amp; Health exam</strong> (a
              single 135-item exam) <em>or</em> take the separate Life and
              Accident &amp; Health exams — all administered by PSI. So the{" "}
              <strong>courses are separate, but the exam can be combined</strong>{" "}
              — the opposite of states like Illinois, which split both.
            </p>
          </div>
        </section>
      )}

      {/* Step-by-step walkthrough video for life-and-health buyers in
          states that have one (FL/CA/TX as of 2026-06-12 — see LOA_VIDEOS
          above). The video's YouTube description points buyers to this URL
          as the secondary CTA. Placed under byline + before CourseOverviewBox
          so the buyer sees the same step-by-step they just watched. */}
      {loaDef.slug === "life-and-health" && LOA_VIDEOS[stateData.slug] && (
        <YouTubeEmbed
          videoId={LOA_VIDEOS[stateData.slug].videoId}
          title={LOA_VIDEOS[stateData.slug].title}
        />
      )}

      {hoursIsNumber ? (
        <CourseOverviewBox
          hours={pricingHoursNum as number}
          price={pricing.price}
          stateSlug={stateData.slug}
          // 50 Ill. Adm. Code 3119 — Illinois overrides the default
          // "Online, Self-Paced" format cell and lists the live webinar
          // sessions in What's Included. Conditional spread so every other
          // state hits the component defaults byte-identically.
          {...(ilWebinar
            ? {
                format: `${ilLiveHours}h Live Webinar + ${ilSelfHours}h Self-Paced`,
                includes: [
                  "7.5 live webinar hours per line — attendance verified",
                  "Video lessons",
                  "Interactive e-book",
                  "Practice exams",
                  "Flashcard review sets",
                  "Progress tracking",
                  "Expert support",
                  "Certificate of completion",
                  "Pass guarantee",
                ],
              }
            : {})}
        />
      ) : (
        // When no mandatory hours, omit the Credit Hours stat to avoid showing "0"
        <section className="bg-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-8">
              Course Overview
            </h2>
            <div className="bg-gray-bg rounded-2xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="p-5 text-center">
                  <p className="text-3xl font-bold text-gold">{pricing.price}</p>
                  <p className="text-gray-500 text-sm mt-1">Course Price</p>
                </div>
                <div className="p-5 text-center">
                  <p className="text-base font-bold text-navy">Online, Self-Paced</p>
                  <p className="text-gray-500 text-sm mt-1">Course Format</p>
                </div>
                <div className="p-5 text-center">
                  <p className="text-base font-bold text-navy">{stateData.courseAccessDays} Days</p>
                  <p className="text-gray-500 text-sm mt-1">Access Duration</p>
                </div>
              </div>
              <div className="border-t border-gray-200 p-6">
                <h3 className="font-semibold text-navy mb-4">What&apos;s Included</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Video lessons",
                    "Interactive e-book",
                    "Practice exams",
                    "Flashcard review sets",
                    "Progress tracking",
                    "Expert support",
                    "Certificate of completion",
                    guaranteeOk ? "Pass guarantee" : "Instant course access",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                      <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What You'll Learn */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            What You&apos;ll Learn
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            {ilWebinar && loaDef.slug === "life-and-health"
              ? `These two courses cover everything tested on the two Illinois exams — Life and Accident & Health — required for a Life & Health license.`
              : isCalifornia
              ? `This course delivers California's required 12-hour Code & Ethics prelicensing content, plus focused exam preparation for the ${stateData.name} ${loaDef.name} licensing exam.`
              : `This course covers everything tested on the ${stateData.name} ${loaDef.name} licensing exam.`}
          </p>
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {learnBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-success-dark flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CourseFeatures />

      <ExamInfoSection
        stateName={stateData.name}
        examInfo={stateData.examInfo}
        examProvider={stateData.examInfo.examProvider}
        examProviderUrl={stateData.examInfo.examProviderUrl}
        examBookingUrl={stateData.examInfo.examBookingUrl}
        noCombinedExam={stateData.noCombinedExam}
        applicationBeforeExam={stateData.applicationBeforeExam}
        prelicensingRequired={
          credentialKindFromHours([
            stateData.prelicensing.life.hours,
            stateData.prelicensing.health.hours,
            stateData.prelicensing.lifeAndHealth.hours,
          ]) === "prelicensing"
        }
        stateSlug={stateData.slug}
        loaSlug={loaDef.slug}
        examFeeDisplay={
          loaDef.slug === "life-and-health" && stateData.noCombinedExam
            ? `$${2 * Number(stateData.examInfo.examFee)} (two exams)`
            : undefined
        }
      />

      {/* Ohio Admin. Code 3901-5-07(H)(16): PassGuarantee self-suppresses /
          swaps content for excluded states via the stateSlug prop. */}
      <PassGuarantee stateSlug={stateData.slug} />

      <PracticeExamCTA
        stateName={stateData.name}
        stateSlug={stateData.slug}
        practiceExams={stateData.practiceExams}
        loa={
          loaDef.slug === "life"
            ? "Life"
            : loaDef.slug === "health"
            ? "Health"
            : "Life + Health"
        }
      />

      <TestimonialCards stateName={stateData.name} seed={stateData.slug} stateSlug={stateData.slug} />

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} ${loaDef.name} Prelicensing FAQs`}
      />

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="prelicensing-loa"
        currentLoa={loa as "life" | "health" | "life-and-health"}
        variant="gray"
      />

      {/* Visible "Last updated" stamp above the final CTA */}
      <section className="bg-white py-6 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <LastUpdated date={stateData.lastVerified} />
        </div>
      </section>

      <CTABanner
        title={`Ready to Start Your ${stateData.name} ${loaDef.shortName} Prelicensing?`}
        subtitle={
          hoursIsNumber
            ? `Enroll in our ${pricing.hours}-hour ${isProviderApproved ? "state-approved " : ""}course today. ${guaranteeSentence} Only ${pricing.price}.`
            : `Enroll in our ${loaDef.name} course today. ${guaranteeSentence} Only ${pricing.price}.`
        }
        ctaText={`Enroll Now — ${pricing.price}`}
        ctaHref={enrollLink}
        externalLink
        disclosure={<RefundDisclosure />}
      />

      <StickyMobileCTA
        text="Enroll Now"
        href={enrollLink}
        price={pricing.price}
        state={state}
        loa={loa}
      />
    </>
  );
}
