import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { LOA_DEFINITIONS, type LOASlug } from "@/lib/loa";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateLOAParams } from "@/lib/generateStaticParams";
import {
  generateCourseSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  SchemaMarkup,
} from "@/lib/schema";
import { getPrelicensingCourseFAQs, buildFaqData } from "@/lib/faq-data";
import catalogLinks from "@/lib/catalog-links.json";
import StateHero from "@/components/StateHero";
import CourseOverviewBox from "@/components/CourseOverviewBox";
import CourseFeatures from "@/components/CourseFeatures";
import ExamInfoSection from "@/components/ExamInfoSection";
import PassGuarantee from "@/components/PassGuarantee";
import TestimonialCards from "@/components/TestimonialCards";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import PracticeExamCTA from "@/components/PracticeExamCTA";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import BreadcrumbNav from "@/components/BreadcrumbNav";

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
  return generatePageMetadata({
    pageType: "prelicensing-course",
    stateName: stateData.name,
    stateSlug: stateData.slug,
    loaName: loaDef.name,
    loaSlug: loaDef.slug,
    hours: hoursNum,
    price: pricing?.price,
  });
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

  const enrollLink = getCatalogLink(stateData.slug, loaDef.slug);
  const hoursIsNumber = typeof pricing.hours === "number";
  const pricingHoursNum = hoursIsNumber ? (pricing.hours as number) : undefined;
  const faqs = getPrelicensingCourseFAQs(
    buildFaqData(stateData),
    loaDef.name,
    pricing.hours,
    pricing.price.replace("$", "")
  );
  const learnBullets = WHAT_YOULL_LEARN[loaDef.slug];

  const courseSchema = generateCourseSchema({
    stateName: stateData.name,
    loaName: loaDef.name,
    courseType: "prelicensing",
    hours: pricingHoursNum ?? 0,
    price: pricing.price,
    description: hoursIsNumber
      ? `${stateData.name} ${loaDef.name} prelicensing course — ${pricing.hours} hours, state-approved, online, self-paced. Pass guarantee included. ${pricing.price}.`
      : `${stateData.name} ${loaDef.name} prelicensing course — state-approved, online, self-paced. Pass guarantee included. ${pricing.price}.`,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}/` },
    { name: "Prelicensing", url: `https://justinsuranceco.com/${stateData.slug}/prelicensing/` },
    { name: loaDef.shortName, url: `https://justinsuranceco.com/${stateData.slug}/prelicensing/${loaDef.slug}/` },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}/` },
    { name: "Prelicensing", href: `/${stateData.slug}/prelicensing/` },
    { name: loaDef.shortName },
  ];

  return (
    <>
      <SchemaMarkup schema={courseSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      <StateHero
        eyebrow={`${stateData.name} ${loaDef.shortName} Prelicensing`}
        title={`${stateData.name} ${loaDef.name} Prelicensing Course`}
        subtitle={
          hoursIsNumber
            ? `${pricing.hours}-hour state-approved course. Study online at your own pace, then pass the ${stateData.name} licensing exam. Pass guarantee included. Only ${pricing.price}.`
            : `Complete our state-approved ${loaDef.name} prelicensing course online at your own pace, then pass the ${stateData.name} licensing exam. Pass guarantee included. Only ${pricing.price}.`
        }
        ctaButtons={[
          { text: `Enroll Now — ${pricing.price}`, href: enrollLink },
        ]}
      />

      {hoursIsNumber ? (
        <CourseOverviewBox
          hours={pricingHoursNum as number}
          price={pricing.price}
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
                  <p className="text-base font-bold text-navy">12 Months</p>
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
                    "Pass guarantee",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            This course covers everything tested on the {stateData.name} {loaDef.name} licensing exam.
          </p>
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {learnBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      />

      <PassGuarantee />

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

      <TestimonialCards stateName={stateData.name} seed={stateData.slug} />

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} ${loaDef.name} Prelicensing FAQs`}
      />

      <CTABanner
        title={`Ready to Start Your ${stateData.name} ${loaDef.shortName} Prelicensing?`}
        subtitle={
          hoursIsNumber
            ? `Enroll in our ${pricing.hours}-hour state-approved course today. Pass guarantee included. Only ${pricing.price}.`
            : `Enroll in our state-approved ${loaDef.name} course today. Pass guarantee included. Only ${pricing.price}.`
        }
        ctaText={`Enroll Now — ${pricing.price}`}
        ctaHref={enrollLink}
        externalLink
      />

      <StickyMobileCTA
        text="Enroll Now"
        href={enrollLink}
        price={pricing.price}
      />
    </>
  );
}
