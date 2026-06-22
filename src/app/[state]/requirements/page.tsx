import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { generateStateParams } from "@/lib/generateStaticParams";
import {
  generateArticleSchemaWithReviewer,
  generateBreadcrumbSchema,
  generateFAQSchema,
  SchemaMarkup,
} from "@/lib/schema";
import StateHero from "@/components/StateHero";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleByline from "@/components/ArticleByline";
import EditorialByline from "@/components/EditorialByline";
import SourcesBlock from "@/components/SourcesBlock";
import RelatedStatePages from "@/components/RelatedStatePages";
import LastUpdated from "@/components/LastUpdated";
import YouTubeEmbed from "@/components/YouTubeEmbed";

// /[state]/requirements step-by-step walkthrough videos. Each state's video
// description points buyers to its /[state]/requirements URL specifically,
// closing the viewer-to-page loop. Single-source-of-truth registry lives
// in src/lib/youtube-videos.json; per-state map below carries the extra
// VideoObject schema fields. Added FL 2026-06-09; CA + TX 2026-06-12.
type RequirementsVideo = {
  videoId: string;
  title: string;
  uploadDate: string;
  duration: string;
  description: string;
};
const REQUIREMENTS_VIDEOS: Record<string, RequirementsVideo> = {
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

function buildRequirementsVideoSchema(v: RequirementsVideo) {
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
  // Title: layout.tsx applies a "%s | JustInsurance" template to plain-string titles.
  // Use { absolute } to opt out of that template and keep the brand suffix exactly once.
  // Also honor the <=60 char target — use state abbreviation for long state names.
  const brand = "JustInsurance";
  const fullTitle = `${stateData.name} Insurance License Requirements 2026 | ${brand}`;
  const shortTitle = `${stateData.abbreviation} Insurance License Requirements 2026 | ${brand}`;
  const titleString = fullTitle.length <= 60 ? fullTitle : shortTitle;
  // Answer-first meta (2026-06-17): replaced the old topic-list
  // ("prelicensing hours, exam, fingerprinting, fees, CE renewal") with
  // concrete per-state numbers. GSC showed requirements pages ranking
  // ~pos 9-10 but converting ~0 — competitors win the click by surfacing
  // specifics (passing score, fee, CE hours) in the snippet, not a list of
  // topics. Numbers come from the same stateData fields that feed the
  // on-page requirements table. Kept <= ~160 chars across all 50 states.
  const description = `${stateData.name} insurance license requirements (2026): must be ${stateData.minAge}+, pass the ${stateData.examInfo.passingScore}% state exam, get fingerprinted, and pay a $${stateData.applicationFee} application fee. ${stateData.ce.totalHours}-hr CE to renew.`;
  return {
    title: { absolute: titleString },
    description,
    robots: "index, follow",
    alternates: {
      canonical: `https://justinsuranceco.com/${stateData.slug}/requirements`,
    },
    openGraph: {
      title: titleString,
      description,
      url: `https://justinsuranceco.com/${stateData.slug}/requirements`,
      siteName: "JustInsurance",
      type: "website",
    },
  };
}

function aOrAn(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

export default async function RequirementsPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) notFound();

  const hasSpecialTraining =
    stateData.specialTrainingRequirements.ltc !== null ||
    stateData.specialTrainingRequirements.nfip !== null ||
    stateData.specialTrainingRequirements.annuity !== null ||
    stateData.specialTrainingRequirements.other !== null;

  const hasFingerprinting =
    stateData.fingerprintingNotes &&
    !stateData.fingerprintingNotes.toLowerCase().includes("not required") &&
    !stateData.fingerprintingNotes.toLowerCase().includes("no fingerprint");

  // Build FAQ list — templated questions + state-specific FAQ
  const faqs = [
    {
      question: `How long does it take to get ${aOrAn(stateData.name)} ${stateData.name} insurance license?`,
      answer: `Most candidates complete the ${stateData.name} insurance licensing process in ${stateData.totalLicensingTime}. This includes completing prelicensing education, passing the state exam, fingerprinting (if required), and waiting for license approval after submitting your application.`,
    },
    {
      question: `What happens if my name doesn't match my ID in ${stateData.name}?`,
      answer: stateData.nameMatchWarning,
    },
    {
      question: `Where do I get fingerprinted in ${stateData.name}?`,
      answer: stateData.fingerprintingNotes,
    },
    {
      question: `Can I transfer my insurance license from another state to ${stateData.name}?`,
      answer: stateData.reciprocityInfo,
    },
    {
      question: `How much does ${aOrAn(stateData.name)} ${stateData.name} insurance license cost?`,
      answer: `The total cost to get your ${stateData.name} insurance license typically falls in the ${stateData.totalCostRange} range. This includes: prelicensing course fees, the exam fee ($${stateData.examInfo.examFee}), the state application fee ($${stateData.applicationFee}), and the background check cost ($${stateData.backgroundCheckCost}). Individual costs vary based on the line of authority you choose.`,
    },
    {
      question: `What are the ${stateData.name} CE requirements?`,
      answer: `${stateData.name} requires licensed insurance agents to complete ${stateData.ce.totalHours} hours of continuing education every ${stateData.ce.renewalPeriod}, including ${stateData.ce.ethicsHours} hours of ethics training. Renewal deadline: ${stateData.renewalDeadline}. JustInsurance offers state-approved CE packages starting at ${stateData.ce.packagePrice}.`,
    },
    // State-specific FAQ from data
    stateData.stateSpecificFAQ,
    {
      question: `What are the prelicensing hour requirements in ${stateData.name}?`,
      answer: `${stateData.name} requires${
        typeof stateData.prelicensing.life.hours === "number"
          ? ` ${stateData.prelicensing.life.hours} hours for Life,`
          : ""
      }${
        typeof stateData.prelicensing.health.hours === "number"
          ? ` ${stateData.prelicensing.health.hours} hours for Health,`
          : ""
      }${
        typeof stateData.prelicensing.lifeAndHealth.hours === "number"
          ? ` and ${stateData.prelicensing.lifeAndHealth.hours} hours for a combined Life & Health license.`
          : typeof stateData.prelicensing.life.hours === "string"
          ? ` ${stateData.prelicensing.life.hours}.`
          : "."
      } Courses are available fully online through JustInsurance.`,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    {
      name: stateData.name,
      url: `https://justinsuranceco.com/${stateData.slug}`,
    },
    {
      name: "Requirements",
      url: `https://justinsuranceco.com/${stateData.slug}/requirements`,
    },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const articleHeadline = `${stateData.name} Insurance License Requirements (2026)`;
  const articleDescription = `Everything you need to know to get and keep your ${stateData.name} insurance license — hours, exam, fingerprinting, renewal, and state-specific rules.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${stateData.slug}/requirements`,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}` },
    { name: "Requirements" },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />
      {REQUIREMENTS_VIDEOS[stateData.slug] && (
        <SchemaMarkup schema={buildRequirementsVideoSchema(REQUIREMENTS_VIDEOS[stateData.slug])} />
      )}

      <BreadcrumbNav crumbs={crumbs} />

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <StateHero
        eyebrow={`${stateData.name} License Requirements`}
        title={`${stateData.name} Insurance License Requirements (2026)`}
        subtitle={`Everything you need to know to get and keep your ${stateData.name} insurance license — hours, exam, fingerprinting, renewal, and state-specific rules.`}
        ctaButtons={[
          {
            text: "Start My Course",
            href: `/${stateData.slug}/prelicensing`,
          },
          {
            text: "Renew My License",
            href: `/${stateData.slug}/continuing-education`,
            variant: "secondary",
          },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* Verification badges under hero */}
      <div className="bg-navy border-t border-blue-800 py-3 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-blue-200">
          <span>Last Verified: {stateData.lastVerified}</span>
          {stateData.providerApprovalNumber !== "PENDING" && (
            <span>Provider Approval #{stateData.providerApprovalNumber}</span>
          )}
          <span>Approved by {stateData.doiAbbr}</span>
        </div>
      </div>

      {/* Editorial byline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <EditorialByline lastVerified={stateData.lastVerified} />
      </div>

      {/* Step-by-step walkthrough video for the states that have one
          (FL/CA/TX as of 2026-06-12 — see REQUIREMENTS_VIDEOS above).
          Placed under the editorial byline so viewer-to-reader handoff is
          tight: each video's YouTube description points buyers to THIS
          URL, and they immediately see the same step-by-step they just
          watched. VideoObject schema emitted above. */}
      {REQUIREMENTS_VIDEOS[stateData.slug] && (
        <YouTubeEmbed
          videoId={REQUIREMENTS_VIDEOS[stateData.slug].videoId}
          title={REQUIREMENTS_VIDEOS[stateData.slug].title}
        />
      )}

      {/* TL;DR direct-answer block — snippet/AI-overview bait. Added
          2026-06-17 (GSC: page ranks ~pos 9-10 but the first on-page prose
          was a marketing value-promise, weak snippet material). This bolded
          factual lead gives Google a query-shaped answer to pull and
          reinforces the meta so it's less likely to be rewritten.
          Template-safe: examProvider is per-state (NEVER hardcode a vendor —
          it's PSI / Pearson VUE / Prometric by state); backgroundCheckCost
          is guarded because 13 states store a non-numeric string
          ("No separate fee" etc.); prelicensing hours are kept generic
          because 33 states are non-numeric. */}
      <section className="bg-white pt-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-navy rounded-r-lg p-5">
            <p className="text-gray-800 leading-relaxed">
              <strong>Quick answer:</strong> To get {aOrAn(stateData.name)}{" "}
              {stateData.name} insurance license you must be {stateData.minAge}+,
              complete state-approved
              prelicensing, pass the {stateData.examInfo.examProvider} state exam
              ({stateData.examInfo.passingScore}% to pass), get fingerprinted
              ({/^[0-9.]+$/.test(stateData.backgroundCheckCost)
                ? `~$${stateData.backgroundCheckCost}`
                : stateData.backgroundCheckCost.toLowerCase()}
              ), and submit a ${stateData.applicationFee} license application.
              Renewal requires {stateData.ce.totalHours} CE hours (including{" "}
              {stateData.ce.ethicsHours} ethics) every {stateData.ce.renewalPeriod}.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Quick Requirements Summary Table ─────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            {stateData.name} Insurance License Requirements at a Glance
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Key facts for getting and maintaining your {stateData.name}{" "}
            insurance license.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Minimum Age", value: `${stateData.minAge} years old` },
                  { label: "Residency Requirement", value: stateData.residencyRequirement },
                  {
                    label: "Prelicensing Hours (Life)",
                    value:
                      typeof stateData.prelicensing.life.hours === "number"
                        ? `${stateData.prelicensing.life.hours} hours`
                        : String(stateData.prelicensing.life.hours),
                  },
                  {
                    label: "Prelicensing Hours (Health)",
                    value:
                      typeof stateData.prelicensing.health.hours === "number"
                        ? `${stateData.prelicensing.health.hours} hours`
                        : String(stateData.prelicensing.health.hours),
                  },
                  {
                    label: "Prelicensing Hours (Life & Health Combined)",
                    value:
                      typeof stateData.prelicensing.lifeAndHealth.hours === "number"
                        ? `${stateData.prelicensing.lifeAndHealth.hours} hours`
                        : String(stateData.prelicensing.lifeAndHealth.hours),
                  },
                  { label: "Exam Provider", value: stateData.examInfo.examProvider },
                  { label: "Exam Fee", value: `$${stateData.examInfo.examFee}` },
                  { label: "Passing Score", value: `${stateData.examInfo.passingScore}%` },
                  { label: "Application Fee", value: `$${stateData.applicationFee}` },
                  { label: "Background Check Cost", value: `$${stateData.backgroundCheckCost}` },
                  {
                    label: "Fingerprinting Required",
                    value: hasFingerprinting ? "Yes" : "No",
                  },
                  {
                    label: "CE Hours Required",
                    value: `${stateData.ce.totalHours} hours every ${stateData.ce.renewalPeriod}`,
                  },
                  { label: "Ethics CE Hours", value: `${stateData.ce.ethicsHours} hours` },
                  { label: "Renewal Deadline", value: stateData.renewalDeadline },
                  { label: "License Duration", value: stateData.licenseDuration },
                  {
                    label: "Special Training Required",
                    value: hasSpecialTraining ? "Yes (see below)" : "No",
                  },
                  { label: "Total Cost Estimate", value: stateData.totalCostRange },
                  { label: "Total Licensing Time", value: stateData.totalLicensingTime },
                ].map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-bg"}
                  >
                    <td className="px-5 py-3.5 font-semibold text-navy w-1/2">
                      {row.label}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm italic text-center mt-4 max-w-2xl mx-auto">
            Not a {stateData.name} resident? Producers licensed in another state
            can also be licensed in {stateData.name} via reciprocity — see our{" "}
            <Link
              href="/non-resident-insurance-license"
              className="text-navy underline hover:text-gold not-italic font-semibold"
            >
              Non-Resident Insurance License
            </Link>{" "}
            guide.
          </p>
        </div>
      </section>

      {/* ── 3. Step-by-Step Licensing Process ───────────────────────────────── */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            How to Get Your {stateData.name} Insurance License
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Follow these five steps to go from zero to licensed in{" "}
            {stateData.name}.
          </p>
          {(() => {
            const stepPrelicensing = {
              key: "prelicensing",
              title: "Complete Prelicensing Education",
              content: (
                <>
                  {typeof stateData.prelicensing.lifeAndHealth.hours === "number" ? (
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {stateData.name} requires you to complete{" "}
                      {stateData.prelicensing.lifeAndHealth.hours} hours of
                      state-approved prelicensing education before sitting for
                      the exam. JustInsurance&apos;s online courses let you
                      study at your own pace on any device. You&apos;ll receive an
                      official certificate of completion once you finish.
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      Prelicensing education status for {stateData.name}:{" "}
                      {String(stateData.prelicensing.life.hours)}. Check with
                      the {stateData.doiName} for current requirements.
                    </p>
                  )}
                  <Link
                    href={`/${stateData.slug}/prelicensing`}
                    className="text-sm font-semibold text-gold hover:underline"
                  >
                    Browse {stateData.name} Prelicensing Courses →
                  </Link>
                </>
              ),
            };

            const stepExamStandard = {
              key: "exam",
              title: "Schedule and Pass the State Exam",
              content: (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    The {stateData.name} insurance licensing exam is administered
                    by {stateData.examInfo.examProvider}. The exam fee is $
                    {stateData.examInfo.examFee}, and you&apos;ll need a passing
                    score of {stateData.examInfo.passingScore}%. Schedule your
                    exam online after completing your prelicensing education.
                  </p>
                  {stateData.examInfo.examBookingUrl && (
                    <a
                      href={stateData.examInfo.examBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold hover:underline"
                    >
                      Schedule Your Exam with {stateData.examInfo.examProvider} →
                    </a>
                  )}
                </>
              ),
            };

            const stepExamAfterATT = {
              key: "exam",
              title: "Schedule and Pass the State Exam",
              content: (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    The {stateData.name} insurance licensing exam is administered
                    by {stateData.examInfo.examProvider}. The exam fee is $
                    {stateData.examInfo.examFee}, and you&apos;ll need a passing
                    score of {stateData.examInfo.passingScore}%. Schedule your
                    exam online after receiving your Authorization to Test (ATT).
                  </p>
                  {stateData.examInfo.examBookingUrl && (
                    <a
                      href={stateData.examInfo.examBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold hover:underline"
                    >
                      Schedule Your Exam with {stateData.examInfo.examProvider} →
                    </a>
                  )}
                </>
              ),
            };

            const stepFingerprinting = {
              key: "fingerprinting",
              title: "Complete Fingerprinting",
              content: (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {stateData.fingerprintingNotes}
                </p>
              ),
            };

            const stepApplyStandard = {
              key: "apply",
              title: "Apply for Your License",
              content: (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {stateData.applicationProcess} The application fee is $
                    {stateData.applicationFee}. Processing typically takes{" "}
                    {stateData.applicationProcessingTime}.
                  </p>
                  {stateData.licenseApplicationPortal && (
                    <a
                      href={stateData.licenseApplicationPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold hover:underline"
                    >
                      Apply for Your {stateData.name} License →
                    </a>
                  )}
                </>
              ),
            };

            const stepApplyBeforeExam = {
              key: "apply",
              title: "Apply for Your License & Get ATT",
              content: (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {stateData.applicationProcess} The application fee is $
                    {stateData.applicationFee}. Processing typically takes{" "}
                    {stateData.applicationProcessingTime}.
                  </p>
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-3">
                    You must receive your Authorization to Test (ATT) before you
                    can schedule your exam.
                  </p>
                  {stateData.licenseApplicationPortal && (
                    <a
                      href={stateData.licenseApplicationPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold hover:underline"
                    >
                      Apply for Your {stateData.name} License →
                    </a>
                  )}
                </>
              ),
            };

            const stepAppointment = {
              key: "appointment",
              title: "Get Appointed and Start Selling",
              content: (
                <p className="text-gray-600 text-sm leading-relaxed">
                  Once your {stateData.name} insurance license is issued, you
                  must be appointed by an insurance carrier before you can sell
                  their products. Each carrier you work with will submit an
                  appointment request to the {stateData.doiName}. Appointments
                  are typically processed within a few business days, and there
                  is no additional exam required. Your sponsoring agency or
                  carrier will guide you through this process.
                </p>
              ),
            };

            const steps = stateData.applicationBeforeExam
              ? [
                  stepPrelicensing,
                  stepApplyBeforeExam,
                  stepFingerprinting,
                  stepExamAfterATT,
                  stepAppointment,
                ]
              : [
                  stepPrelicensing,
                  stepExamStandard,
                  stepFingerprinting,
                  stepApplyStandard,
                  stepAppointment,
                ];

            return (
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div
                    key={step.key}
                    className="bg-white rounded-xl p-6 shadow-sm flex gap-5 items-start"
                  >
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-dark font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-navy text-lg mb-2">
                        {step.title}
                      </h3>
                      {step.content}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── 4. Fingerprinting Requirements ──────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            {stateData.name} Fingerprinting Requirements
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {stateData.fingerprintingNotes}
          </p>

          {/* Name Match Warning callout */}
          {stateData.nameMatchWarning && (
            <div className="bg-yellow-50 border-l-4 border-gold rounded-lg p-5">
              <div className="flex gap-3 items-start">
                <svg
                  className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">
                    Name Match Requirement
                  </p>
                  <p className="text-yellow-800 text-sm leading-relaxed">
                    {stateData.nameMatchWarning}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Special Training Requirements (conditional) ───────────────────── */}
      {hasSpecialTraining && (
        <section className="bg-gray-bg py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
              Special Training Requirements for {stateData.name}
            </h2>
            <p className="text-gray-500 mb-8">
              {stateData.name} requires additional training for agents selling
              certain specialty products. These are separate from standard
              prelicensing hours.
            </p>
            <div className="space-y-4">
              {stateData.specialTrainingRequirements.ltc !== null && (
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gold">
                  <h3 className="font-bold text-navy mb-2">
                    Long-Term Care (LTC) Training
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stateData.specialTrainingRequirements.ltc}
                  </p>
                </div>
              )}
              {stateData.specialTrainingRequirements.nfip !== null && (
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gold">
                  <h3 className="font-bold text-navy mb-2">
                    National Flood Insurance Program (NFIP) Training
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stateData.specialTrainingRequirements.nfip}
                  </p>
                </div>
              )}
              {stateData.specialTrainingRequirements.annuity !== null && (
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gold">
                  <h3 className="font-bold text-navy mb-2">
                    Annuity Training
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stateData.specialTrainingRequirements.annuity}
                  </p>
                </div>
              )}
              {stateData.specialTrainingRequirements.other !== null && (
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gold">
                  <h3 className="font-bold text-navy mb-2">
                    Additional Training Requirements
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stateData.specialTrainingRequirements.other}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. CE Renewal Requirements ──────────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
            {stateData.name} CE Renewal Requirements
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            To keep your {stateData.name} insurance license active, you must
            complete continuing education every {stateData.ce.renewalPeriod}.
            Here are the details:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {[
              {
                label: "Total CE Hours",
                value: `${stateData.ce.totalHours} hours`,
              },
              {
                label: "Ethics Hours Required",
                value: `${stateData.ce.ethicsHours} hours`,
              },
              {
                label: "Renewal Period",
                value: stateData.ce.renewalPeriod,
              },
              {
                label: "Renewal Deadline",
                value: stateData.renewalDeadline,
              },
              {
                label: "CE Package Price",
                value: stateData.ce.packagePrice,
              },
              {
                label: "Regulatory Body",
                value: stateData.doiAbbr,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-bg rounded-xl p-5 text-center"
              >
                <p className="text-2xl font-bold text-navy mb-1">
                  {item.value}
                </p>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href={`/${stateData.slug}/continuing-education`}
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold px-8 py-4 rounded-lg shadow transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Browse {stateData.name} CE Courses →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Legal References ─────────────────────────────────────────────── */}
      {(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const citations = (stateData as any).citations as {
          insuranceCode?: string;
          insuranceCodeFull?: string;
          prelicenseCode?: string;
          ceRequirementsCode?: string;
          ceEthicsCode?: string;
          providerRegulation?: string;
          adminCodeName?: string;
          adminCodeRef?: string;
          adminCodeUrl?: string;
          statutesUrl?: string;
          ageCitation?: string;
          educationCitation?: string;
          examCitation?: string;
          backgroundCitation?: string;
          fingerprintCitation?: string;
          applicationCitation?: string;
        } | undefined;

        if (!citations) return null;

        const items: { label: string; value: string; url?: string }[] = [
          { label: "Insurance Code", value: citations.insuranceCodeFull ?? "", url: citations.statutesUrl },
          { label: "Prelicensing Education", value: citations.educationCitation ?? "" },
          { label: "Examination Requirements", value: citations.examCitation ?? "" },
          { label: "Age Requirements", value: citations.ageCitation ?? "" },
          { label: "Background Check", value: citations.backgroundCitation ?? "" },
          { label: "Fingerprinting", value: citations.fingerprintCitation ?? "" },
          { label: "License Application", value: citations.applicationCitation ?? "" },
          { label: "CE Requirements", value: citations.ceRequirementsCode ?? "" },
          { label: "CE Ethics", value: citations.ceEthicsCode ?? "" },
          { label: "Administrative Code", value: citations.adminCodeRef ?? "", url: citations.adminCodeUrl },
          { label: "Provider Regulation", value: citations.providerRegulation ?? "" },
        ].filter((item) => item.value.trim() !== "");

        if (items.length === 0) return null;

        return (
          <section className="bg-gray-bg py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
                {stateData.name} Insurance Licensing Laws &amp; Regulations
              </h2>
              <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
                Legal citations and statutory references governing insurance licensing in {stateData.name}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div key={item.label} className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="font-semibold text-navy text-sm mb-1">{item.label}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {item.value}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-navy underline ml-2 hover:text-gold"
                        >
                          View Statute
                        </a>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── 8. FAQ Section ──────────────────────────────────────────────────── */}
      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} Insurance License Requirements — FAQs`}
      />

      {/* ── 9. Related Guides ───────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy mb-6">Related {stateData.name} Licensing Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/how-long-to-get-insurance-license" className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">Licensing Timeline</div>
              <div className="text-sm text-gray-600">How long it takes from enrollment to an active license number.</div>
            </Link>
            <Link href="/insurance-license-cost" className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">Total License Cost</div>
              <div className="text-sm text-gray-600">State-by-state breakdown of exam, application, and fingerprint fees.</div>
            </Link>
            <Link href="/non-resident-insurance-license" className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">Non-Resident License</div>
              <div className="text-sm text-gray-600">Already licensed elsewhere? See the reciprocity process for {stateData.name}.</div>
            </Link>
            <Link href={`/${stateData.slug}/practice-exam`} className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">{stateData.name} Practice Exam</div>
              <div className="text-sm text-gray-600">Mirror the real {stateData.examInfo?.examProvider || "state"} exam before test day.</div>
            </Link>
            <Link href={`/${stateData.slug}/prelicensing`} className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">{stateData.name} Prelicensing</div>
              <div className="text-sm text-gray-600">State-approved prelicensing courses for every line of authority.</div>
            </Link>
            <Link href={`/${stateData.slug}/continuing-education`} className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">{stateData.name} CE Courses</div>
              <div className="text-sm text-gray-600">Renew your license with state-approved continuing education.</div>
            </Link>
            <Link href={`/${stateData.slug}/cost`} className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">{stateData.name} License Cost Breakdown</div>
              <div className="text-sm text-gray-600">{stateData.name}-specific cost: course, exam, fingerprinting, and application fees.</div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. Sources & Regulators ─────────────────────────────────────────── */}
      <SourcesBlock stateData={stateData} />

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="requirements"
        variant="white"
      />

      {/* Visible "Last updated" stamp above the final CTA */}
      <section className="bg-white py-6 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <LastUpdated date={stateData.lastVerified} />
        </div>
      </section>

      {/* ── 11. CTA Banner ──────────────────────────────────────────────────── */}
      <CTABanner
        title={`Ready to Get Your ${stateData.name} Insurance License?`}
        subtitle={`Start your state-approved prelicensing course today. 100% online, self-paced, and backed by our pass guarantee.`}
        ctaText="Start My Course Today"
        ctaHref={`/${stateData.slug}/prelicensing`}
      />
    </>
  );
}
