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
import { getCECourseFAQs, buildFaqData } from "@/lib/faq-data";
import catalogLinks from "@/lib/catalog-links.json";
import StateHero from "@/components/StateHero";
import CourseOverviewBox from "@/components/CourseOverviewBox";
import CourseFeatures from "@/components/CourseFeatures";
import TestimonialCards from "@/components/TestimonialCards";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import BreadcrumbNav from "@/components/BreadcrumbNav";

type CatalogLinks = typeof catalogLinks;

function getCatalogLink(stateSlug: string, loaSlug: LOASlug): string {
  const stateCatalog = (catalogLinks as CatalogLinks)[stateSlug as keyof CatalogLinks];
  if (!stateCatalog) return "https://yourinsurancelicense.myabsorb.com/";
  const section = stateCatalog["continuing-education"] as Record<string, string>;
  return section?.[loaSlug] ?? "https://yourinsurancelicense.myabsorb.com/";
}

const CE_TOPICS: Record<LOASlug, string[]> = {
  life: [
    "Life insurance product updates and regulatory changes",
    "Policy replacement rules and suitability standards",
    "Annuity product features and senior suitability",
    "Ethics and professional conduct for life insurance producers",
    "State insurance laws and producer responsibilities",
    "Long-term care and life insurance hybrid products",
  ],
  health: [
    "ACA updates and health insurance market regulations",
    "Medicare and Medicare Advantage plan changes",
    "Long-term care insurance and benefit triggers",
    "Disability income insurance products and policies",
    "Ethics, fraud prevention, and producer conduct",
    "State-specific health insurance regulations and compliance",
  ],
  "life-and-health": [
    "Life insurance product fundamentals and regulatory updates",
    "Annuities — suitability, disclosure, and product types",
    "Health insurance plans, ACA compliance, and market changes",
    "Medicare and Medicare Supplement updates",
    "Long-term care insurance products and planning",
    "Ethics, professional conduct, and anti-fraud requirements",
    "State insurance laws governing life and health producers",
    "Policy replacement rules and consumer protection standards",
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
  return generatePageMetadata({
    pageType: "ce-course",
    stateName: stateData.name,
    stateSlug: stateData.slug,
    loaName: loaDef.name,
    loaSlug: loaDef.slug,
    hours: stateData.ce.totalHours,
    price: stateData.ce.packagePrice,
  });
}

export default async function CECoursePage({
  params,
}: {
  params: Promise<{ state: string; loa: string }>;
}) {
  const { state, loa } = await params;
  const stateData = getStateBySlug(state);
  const loaDef = LOA_DEFINITIONS[loa as LOASlug];

  if (!stateData || !loaDef) notFound();

  const { ce } = stateData;
  const enrollLink = getCatalogLink(stateData.slug, loaDef.slug);
  const faqs = getCECourseFAQs(
    buildFaqData(stateData),
    loaDef.name,
    ce.totalHours
  );
  const ceTopics = CE_TOPICS[loaDef.slug];

  const courseSchema = generateCourseSchema({
    stateName: stateData.name,
    loaName: loaDef.name,
    courseType: "continuing-education",
    hours: ce.totalHours,
    price: ce.packagePrice,
    description: `${stateData.name} ${loaDef.name} continuing education course — ${ce.totalHours} hours state-approved CE, online, self-paced. Same-day DOI reporting. ${ce.packagePrice}.`,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}/` },
    {
      name: "Continuing Education",
      url: `https://justinsuranceco.com/${stateData.slug}/continuing-education/`,
    },
    {
      name: loaDef.shortName,
      url: `https://justinsuranceco.com/${stateData.slug}/continuing-education/${loaDef.slug}/`,
    },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}/` },
    { name: "Continuing Education", href: `/${stateData.slug}/continuing-education/` },
    { name: loaDef.shortName },
  ];

  return (
    <>
      <SchemaMarkup schema={courseSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* Urgency Banner */}
      <div className="bg-gold text-gray-dark py-2 px-4 text-center text-sm font-semibold">
        Don&apos;t let your license lapse — complete your CE before your renewal deadline.
      </div>

      <StateHero
        eyebrow={`${stateData.name} ${loaDef.shortName} CE`}
        title={`${stateData.name} ${loaDef.name} Continuing Education Course`}
        subtitle={`Complete your ${ce.totalHours} required CE hours online, at your own pace. We report your completion to the ${stateData.doiName} the same day. Only ${ce.packagePrice}.`}
        ctaButtons={[
          { text: `Enroll Now — ${ce.packagePrice}`, href: enrollLink },
        ]}
      />

      {/* Trust Badge Strip */}
      <div className="bg-navy-dark border-t border-white/10 py-3 px-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <span className="inline-flex items-center gap-1.5 bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Same-Day DOI Reporting
          </span>
        </div>
      </div>

      <CourseOverviewBox
        hours={ce.totalHours}
        price={ce.packagePrice}
        accessDuration="Until Completion"
        includes={[
          "State-approved CE content",
          "Online, self-paced access",
          "Ethics hours included",
          "Instant certificate of completion",
          "Same-day DOI reporting",
          "Mobile-friendly access",
          "Progress tracking",
          "Expert support",
        ]}
      />

      {/* Same-Day DOI Reporting Feature Row */}
      <section className="bg-white px-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-navy rounded-xl px-6 py-5 flex items-center gap-5">
            <div className="flex-shrink-0 bg-gold rounded-full p-3">
              <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-gold font-bold text-base">Same-Day DOI Reporting</p>
              <p className="text-white/90 text-sm mt-0.5">
                Finish your course and we electronically report your CE completion to the {stateData.doiName} the same business day — no paperwork, no mailing certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* License Renewal Process */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            {stateData.name} License Renewal Process
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            Renewing your {stateData.name} {loaDef.name} license is straightforward when you complete your CE on time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "1",
                title: "Check Your Deadline",
                desc: `Log into your ${stateData.doiName} account to confirm your license renewal date.`,
              },
              {
                step: "2",
                title: "Complete Your CE",
                desc: `Finish your ${ce.totalHours}-hour ${loaDef.name} CE course online at your own pace — takes just a few hours.`,
              },
              {
                step: "3",
                title: "We Report It",
                desc: `JustInsurance reports your CE completion to the ${stateData.doiName} the same day you finish.`,
              },
              {
                step: "4",
                title: "Renew Your License",
                desc: `Submit your renewal application through NIPR or the ${stateData.doiName} portal before your deadline.`,
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-bg rounded-xl p-5 text-center">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-dark font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="font-bold text-navy mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CE Topics Covered */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            CE Topics Covered
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            This state-approved course covers all required topics for your {stateData.name} {loaDef.name} CE renewal.
          </p>
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ceTopics.map((topic) => (
                <li key={topic} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Same-Day Reporting Callout */}
      <section className="bg-navy py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Same-Day DOI Reporting</h2>
          <p className="text-blue-100 leading-relaxed">
            When you complete this CE course, JustInsurance reports your completion electronically to the {stateData.doiName} the same business day. No certificates to mail, no forms to fill out. Your CE credit is recorded automatically.
          </p>
        </div>
      </section>

      <CourseFeatures />

      <TestimonialCards />

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} ${loaDef.name} CE FAQs`}
      />

      <CTABanner
        title={`Renew Your ${stateData.name} ${loaDef.shortName} License Today`}
        subtitle={`Complete your ${ce.totalHours}-hour CE requirement online. Only ${ce.packagePrice}. We report to the state same-day.`}
        ctaText={`Enroll Now — ${ce.packagePrice}`}
        ctaHref={enrollLink}
        externalLink
      />

      <StickyMobileCTA
        text="Enroll Now"
        href={enrollLink}
        price={ce.packagePrice}
      />
    </>
  );
}
