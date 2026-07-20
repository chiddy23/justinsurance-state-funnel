import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import CeApprovalNotice from "@/components/CeApprovalNotice";
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
import { getCECourseFAQs, buildFaqData } from "@/lib/faq-data";
import catalogLinks from "@/lib/catalog-links.json";
import ArticleByline from "@/components/ArticleByline";
import StateHero from "@/components/StateHero";
import CourseOverviewBox from "@/components/CourseOverviewBox";
import CourseFeatures from "@/components/CourseFeatures";
import TestimonialCards from "@/components/TestimonialCards";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner, { RefundDisclosure } from "@/components/CTABanner";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedStatePages from "@/components/RelatedStatePages";
import LastUpdated from "@/components/LastUpdated";
import CEIndividualCoursesTile from "@/components/CEIndividualCoursesTile";

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
    stateAbbreviation: stateData.abbreviation,
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
  // Pending-approval states (providerApprovalNumber === "PENDING", currently NY
  // and WA): the CE course is not yet state-approved and completions cannot be
  // reported to the DOI. Gate every such claim off; approved states are
  // byte-identical.
  const providerApproved = stateData.providerApprovalNumber !== "PENDING";
  // First-term CE rule: some states require MORE hours before a producer's FIRST
  // renewal than per recurring cycle (states.ts ce.firstTermHours — currently
  // Massachusetts only: 60 credits, 3 of them ethics, before the first renewal
  // date, then 45 per 3-year cycle; M.G.L. c. 175, § 177E / 211 CMR 50.00).
  // The package sold on this page is sized to the RECURRING total, so a brand-new
  // licensee who buys it alone under-completes and can lapse. Surface the higher
  // first-term total wherever the hours render. The `>` guard keeps the
  // "N additional hours" arithmetic positive. Undefined for every other state →
  // their copy renders byte-identically.
  const firstTermHours =
    ce.firstTermHours && ce.firstTermHours > ce.totalHours ? ce.firstTermHours : undefined;
  const firstTermExtraHours = firstTermHours ? firstTermHours - ce.totalHours : 0;
  // "45 required CE hours" would tell a first-term licensee that 45 is their
  // total. Qualify it to the renewal cycle for those states only.
  const ceHoursPhrase = firstTermHours
    ? `${ce.totalHours} renewal-cycle CE hours`
    : `${ce.totalHours} required CE hours`;
  const ceRequirementPhrase = firstTermHours
    ? `${ce.totalHours}-hour renewal-cycle CE requirement`
    : `${ce.totalHours}-hour CE requirement`;
  const enrollLink = getCatalogLink(stateData.slug, loaDef.slug);
  const faqs = getCECourseFAQs(
    buildFaqData(stateData),
    loaDef.name,
    ce.totalHours
  );
  const ceTopics = CE_TOPICS[loaDef.slug];

  const courseSchema = generateCourseSchema({
    stateName: stateData.name,
    stateSlug: stateData.slug,
    loaName: loaDef.name,
    loaSlug: loaDef.slug,
    courseType: "continuing-education",
    hours: ce.totalHours,
    price: ce.packagePrice,
    description: providerApproved
      ? `${stateData.name} ${loaDef.name} continuing education course — ${ce.totalHours} hours state-approved CE, online, self-paced. Same-day DOI reporting in most cases. ${ce.packagePrice}.`
      : `${stateData.name} ${loaDef.name} continuing education course — ${ce.totalHours} hours, online, self-paced, built to the ${stateData.doiName} CE topic requirements. ${ce.packagePrice}.`,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
    {
      name: "Continuing Education",
      url: `https://justinsuranceco.com/${stateData.slug}/continuing-education`,
    },
    {
      name: loaDef.shortName,
      url: `https://justinsuranceco.com/${stateData.slug}/continuing-education/${loaDef.slug}`,
    },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const articleHeadline = `${stateData.name} ${loaDef.name} Continuing Education Course`;
  const articleDescription = providerApproved
    ? `Complete your ${ceHoursPhrase} online, at your own pace. We typically report your completion to the ${stateData.doiName} the same day. Only ${ce.packagePrice}.`
    : `Complete your ${ceHoursPhrase} online, at your own pace, with courses built to the ${stateData.doiName} CE topic requirements. Only ${ce.packagePrice}.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${stateData.slug}/continuing-education/${loaDef.slug}`,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}` },
    { name: "Continuing Education", href: `/${stateData.slug}/continuing-education` },
    { name: loaDef.shortName },
  ];

  return (
    <>
      <SchemaMarkup schema={courseSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      <CeApprovalNotice stateSlug={stateData.slug} />

      {/* Urgency Banner */}
      <div className="bg-gold text-gray-dark py-2 px-4 text-center text-sm font-semibold">
        Don&apos;t let your license lapse — complete your CE before your renewal deadline.
      </div>

      <StateHero
        eyebrow={`${stateData.name} ${loaDef.shortName} CE`}
        title={`${stateData.name} ${loaDef.name} Continuing Education Course`}
        subtitle={
          providerApproved
            ? `Complete your ${ceHoursPhrase} online, at your own pace. We typically report your completion to the ${stateData.doiName} the same day. Only ${ce.packagePrice}.`
            : `Complete your ${ceHoursPhrase} online, at your own pace, with courses built to the ${stateData.doiName} CE topic requirements. Only ${ce.packagePrice}.`
        }
        ctaButtons={[
          { text: `Enroll Now — ${ce.packagePrice}`, href: enrollLink },
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

      {/* Trust Badge Strip — hidden for pending-approval states (no DOI reporting yet). */}
      {providerApproved && (
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
      )}

      {/* First-term CE notice — renders ONLY for states that require more CE
          hours before a producer's FIRST renewal than per recurring cycle
          (states.ts ce.firstTermHours; currently Massachusetts: 60 then 45).
          This package covers the recurring total, so a newly licensed producer
          has to see the higher first-renewal number BEFORE they buy — otherwise
          they under-complete and can lapse. No other state renders this block. */}
      {firstTermHours ? (
        <section className="bg-white px-4 pt-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border-l-4 border-gold rounded-r-lg p-5">
              <p className="font-bold text-navy text-sm mb-1">
                Newly licensed in {stateData.name}? Your first renewal takes {firstTermHours} hours.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {stateData.name} requires {firstTermHours} CE hours before your <strong>first</strong>{" "}
                license renewal
                {ce.ethicsHours > 0 ? ` (including the same ${ce.ethicsHours} ethics hours)` : ""}, then{" "}
                {ce.totalHours} hours every {ce.renewalPeriod} for each renewal after that. This{" "}
                {ce.packagePrice} package covers the {ce.totalHours} hours required for a standard renewal
                cycle, so if you are heading into your first renewal you need {firstTermExtraHours} additional
                CE hours. Confirm your own requirement with the {stateData.doiName} before you enroll.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <CourseOverviewBox
        hours={ce.totalHours}
        price={ce.packagePrice}
        accessDuration="365 Days"
        includes={[
          firstTermHours ? `All ${ce.totalHours} renewal-cycle CE hours` : "All required CE hours",
          "Ethics hours included",
          "Interactive online modules",
          "Progress tracking",
          ...(providerApproved ? ["Same-day DOI reporting"] : []),
          "Instant certificate of completion",
          "Expert support",
        ]}
      />

      {/* Same-Day DOI Reporting Feature Row — hidden for pending-approval states. */}
      {providerApproved && (
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
                  Finish your course and we typically electronically report your CE completion to the {stateData.doiName} the same business day — no paperwork, no mailing certificates.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

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
                title: providerApproved ? "We Report It" : "Get Your Certificate",
                desc: providerApproved
                  ? `JustInsurance typically reports your CE completion to the ${stateData.doiName} the same day you finish.`
                  : `Download your certificate of completion as soon as you finish your ${loaDef.name} CE hours.`,
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
            {providerApproved ? "This state-approved course covers" : "This course covers"} all required topics for your {stateData.name} {loaDef.name} CE renewal.
          </p>
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ceTopics.map((topic) => (
                <li key={topic} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-success-dark flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Same-Day Reporting Callout — hidden for pending-approval states. */}
      {providerApproved && (
        <section className="bg-navy py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Same-Day DOI Reporting</h2>
            <p className="text-blue-100 leading-relaxed">
              When you complete this CE course, JustInsurance typically reports your completion electronically to the {stateData.doiName} the same business day. No certificates to mail, no forms to fill out. Your CE credit is recorded automatically.
            </p>
            <p className="text-xs text-blue-200/70 mt-2">
              Processing times at the state level may vary. Most states reflect credits within 3-5 business days.
            </p>
          </div>
        </section>
      )}

      <CourseFeatures
        variant="ce"
        ceEthicsWebinar={!!stateData.classroomWebinarHours}
        providerApproved={stateData.providerApprovalNumber !== "PENDING"}
      />

      <TestimonialCards variant="ce" stateName={stateData.name} seed={stateData.slug} />

      {/* Individual-courses catalog tile — same à-la-carte category as the
          hub. White background here to sit cleanly between the white
          TestimonialCards and the FAQ section. */}
      <CEIndividualCoursesTile
        stateSlug={stateData.slug}
        stateName={stateData.name}
        doiName={stateData.doiName}
        sectionClassName="bg-white px-4 pb-12"
        providerApproved={providerApproved}
      />

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} ${loaDef.name} CE FAQs`}
      />

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="ce-loa"
        currentLoa={loaDef.slug as "life" | "health" | "life-and-health"}
        variant="gray"
      />

      {/* Visible "Last updated" stamp above the final CTA */}
      <section className="bg-white py-6 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <LastUpdated date={stateData.lastVerified} />
        </div>
      </section>

      <CTABanner
        title={`Renew Your ${stateData.name} ${loaDef.shortName} License Today`}
        subtitle={
          providerApproved
            ? `Complete your ${ceRequirementPhrase} online. Only ${ce.packagePrice}. We typically report to the state same-day.`
            : `Complete your ${ceRequirementPhrase} online. Only ${ce.packagePrice}.`
        }
        ctaText={`Enroll Now — ${ce.packagePrice}`}
        ctaHref={enrollLink}
        externalLink
        disclosure={<RefundDisclosure />}
      />

      <StickyMobileCTA
        text="Enroll Now"
        href={enrollLink}
        price={ce.packagePrice}
        state={state}
        loa={loa}
      />
    </>
  );
}
