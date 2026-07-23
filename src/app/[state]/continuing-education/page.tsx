import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import CeApprovalNotice from "@/components/CeApprovalNotice";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateParams } from "@/lib/generateStaticParams";
import { generateArticleSchemaWithReviewer, generateBreadcrumbSchema, generateCEHubCourseSchema, generateFAQSchema, SchemaMarkup } from "@/lib/schema";
import { getCEHubFAQs, buildFaqData } from "@/lib/faq-data";
import ArticleByline from "@/components/ArticleByline";
import StateHero from "@/components/StateHero";
import LOASelector from "@/components/LOASelector";
import { RefundDisclosure } from "@/components/CTABanner";
import FAQAccordion from "@/components/FAQAccordion";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CEComplianceSection from "@/components/CEComplianceSection";
import RelatedStatePages from "@/components/RelatedStatePages";
import LastUpdated from "@/components/LastUpdated";
import Link from "next/link";
import { PC_STATE_SLUGS } from "@/data/pc-ce-packages";
import CEIndividualCoursesTile from "@/components/CEIndividualCoursesTile";

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
  return generatePageMetadata({
    pageType: "ce-hub",
    stateName: stateData.name,
    stateSlug: stateData.slug,
    stateAbbreviation: stateData.abbreviation,
    hours: stateData.ce.totalHours,
    ceHours: stateData.ce.totalHours,
    ceRenewalPeriod: stateData.ce.renewalPeriod,
  });
}

export default async function CEHubPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) notFound();

  const { ce } = stateData;
  // Pending-approval states (providerApprovalNumber === "PENDING", currently NY
  // and WA): the CE course is not yet state-approved and completions cannot be
  // reported to the DOI, so every "state-approved" / "same-day reporting" claim
  // on this page is gated off until approval issues. Approved states are
  // byte-identical.
  const providerApproved = stateData.providerApprovalNumber !== "PENDING";
  const faqs = getCEHubFAQs(buildFaqData(stateData));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
    {
      name: "Continuing Education",
      url: `https://justinsuranceco.com/${stateData.slug}/continuing-education`,
    },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const articleHeadline = `${stateData.name} Insurance Continuing Education (CE) Courses`;
  const articleDescription = providerApproved
    ? `Don't let your license lapse! Complete your ${stateData.name} CE hours online with state-approved courses. We typically report your completion to the state the same day.`
    : `Complete your ${stateData.name} CE hours online with self-paced courses built to the ${stateData.doiName} CE topic requirements.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${stateData.slug}/continuing-education`,
  });

  const courseSchema = generateCEHubCourseSchema({
    stateName: stateData.name,
    stateSlug: stateData.slug,
    price: ce.packagePrice,
    hours: ce.totalHours,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}` },
    { name: "Continuing Education" },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={courseSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      <CeApprovalNotice stateSlug={stateData.slug} />

      <StateHero
        eyebrow={`${stateData.name} CE Courses`}
        title={`${stateData.name} Insurance Continuing Education (CE) Courses`}
        subtitle={
          providerApproved
            ? `Don't let your license lapse! Complete your ${stateData.name} CE hours online with state-approved courses. We typically report your completion to the state the same day.`
            : `Don't let your license lapse! Complete your ${stateData.name} CE hours online with self-paced courses built to the ${stateData.doiName} CE topic requirements.`
        }
        ctaButtons={[
          { text: "See CE Courses Below", href: "#ce-courses" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* Same-Day DOI Reporting Banner — hidden for pending-approval states,
          which cannot yet report completions to the DOI. */}
      {providerApproved && (
        <section className="bg-navy text-white py-6">
          <div className="max-w-4xl mx-auto px-4 flex items-center gap-4">
            <div className="flex-shrink-0 bg-gold rounded-full p-3">
              <svg className="w-8 h-8 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gold">Same-Day CE Reporting</p>
              <p className="text-white/90">We typically report your CE completion to the {stateData.doiName} the same day you finish.</p>
            </div>
          </div>
        </section>
      )}

      {/* P&C CE cross-link tile — only rendered for states with a P&C package.
          Discreet gold/navy tile so dual-licensed agents can navigate to the P&C
          variant without leaving the L&H CE flow. */}
      {PC_STATE_SLUGS.includes(stateData.slug) && (
        <section className="bg-white pt-10 px-4">
          <div className="max-w-5xl mx-auto">
            <Link
              href={`/${stateData.slug}/continuing-education/property-and-casualty`}
              className="block bg-gold/10 border-l-4 border-gold rounded-r-lg p-5 hover:bg-gold/20 transition-colors group"
            >
              <p className="text-gold-deep font-semibold uppercase tracking-wide text-xs mb-1">
                Dual-licensed?
              </p>
              <p className="text-navy font-bold text-base md:text-lg group-hover:underline">
                Hold a P&amp;C license too? See our {stateData.name} Property &amp; Casualty CE package &rarr;
              </p>
              <p className="text-gray-600 text-sm mt-1">
                State-approved Ethics + P&amp;C electives, with same-day DOI reporting in most cases, satisfies your full {stateData.name} P&amp;C renewal cycle.
              </p>
            </Link>
          </div>
        </section>
      )}

      {/* CE Requirements Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                {stateData.name} CE Requirements
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {stateData.name} requires all licensed insurance producers to complete continuing education (CE) hours to renew their license every {ce.renewalPeriod}. This ensures agents stay current with changing insurance products, regulations, and ethics requirements.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                {providerApproved ? (
                  <>
                    JustInsurance offers state-approved online CE courses that you can complete entirely at your own pace, on any device. When you finish, we typically report your completion directly to the {stateData.doiName} the same day — no paperwork, no delays.
                  </>
                ) : (
                  <>
                    JustInsurance offers online CE courses built to the {stateData.doiName} CE topic requirements that you can complete entirely at your own pace, on any device. Our {stateData.name} CE provider approval is currently pending with the {stateData.doiName}.
                  </>
                )}
              </p>
              <div className="bg-amber-50 border-l-4 border-gold rounded-r-lg p-4">
                <p className="font-semibold text-navy text-sm mb-1">Don&apos;t Wait Until the Last Minute</p>
                <p className="text-gray-600 text-sm">
                  License lapses can result in reinstatement fees and additional requirements. Complete your CE at least 30 days before your renewal deadline. JustInsurance courses are self-paced online, so you can work through your required hours on your own schedule.
                </p>
              </div>

              {/* fid-228 (Utah Admin. Code R590-142; Utah Insurance Department
                  CE page, verified 2026-07-21): Utah caps self-study at 12 of the
                  24 hours — at least 12 must be classroom, webinar, or other
                  classroom-equivalent courses. Disclosed here so the self-paced
                  online framing does not imply all 24 hours can be self-study.
                  Utah-only; every other state renders byte-identically. */}
              {stateData.slug === "utah" && (
                <div className="bg-blue-50 border-l-4 border-navy rounded-r-lg p-4 mt-4">
                  <p className="font-semibold text-navy text-sm mb-1">Utah classroom-equivalent requirement</p>
                  <p className="text-gray-600 text-sm">
                    Utah requires at least 12 of your 24 CE hours to be completed in classroom, webinar, or other classroom-equivalent courses; no more than 12 hours may be completed by self-study (Utah Admin. Code R590-142). Confirm your course formats cover this split before you renew.
                  </p>
                </div>
              )}

              {/* fid-215: this page's prose and FAQ disclose only the ethics
                  component, while the à-la-carte catalog below invites agents to
                  assemble their own hours. States that mandate additional
                  specific CE subjects inside the same total (Oregon: 3 credit
                  hours on Oregon statutes and administrative rules, distinct
                  from the 3 ethics hours — OAR 836-071-0215) must surface that
                  before an agent picks courses, or they can under-complete.
                  Rendered from states.ts ce.mandatedTopicHours; undefined for
                  other states, which render byte-identically. */}
              {ce.mandatedTopicHours && (
                <div className="bg-blue-50 border-l-4 border-navy rounded-r-lg p-4 mt-4">
                  <p className="font-semibold text-navy text-sm mb-1">
                    {stateData.name} mandates specific CE subjects beyond ethics
                  </p>
                  <p className="text-gray-600 text-sm">
                    {ce.mandatedTopicHours} Check these topic requirements against your
                    course selections — especially if you are building your hours à la carte.
                  </p>
                </div>
              )}
            </div>

            {/* Requirements Summary */}
            <div className="bg-gray-bg rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-navy mb-4">CE Requirements Summary</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Total CE Hours</span>
                  <span className="font-bold text-navy">{ce.firstTermHours ? `${ce.firstTermHours} hrs first term, then ${ce.totalHours} hrs` : `${ce.totalHours} hours`}</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Renewal Period</span>
                  <span className="font-bold text-navy">{ce.renewalPeriod}</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Ethics Hours Required</span>
                  <span className="font-bold text-navy">{ce.ethicsHours} hours</span>
                </li>
                {/* States mandating specific topic-hours beyond ethics (e.g. New
                    York: insurance law + ethics + DEI). ethicsHours alone would
                    understate the requirement. Undefined elsewhere -> not rendered. */}
                {ce.mandatedTopicHours && (
                  <li className="pb-3 border-b border-gray-200">
                    <span className="text-gray-500 block mb-1">Mandated Topic Hours</span>
                    <span className="text-navy text-xs leading-relaxed block">{ce.mandatedTopicHours}</span>
                  </li>
                )}
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">CE Reporting</span>
                  <span className="font-bold text-success-dark">{providerApproved ? "Same-Day" : "On approval"}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500">DOI</span>
                  <a href={stateData.doiUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy hover:text-gold transition-colors text-right max-w-[200px] leading-tight">
                    {stateData.doiName}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LOA Selector */}
      <div id="ce-courses">
        <LOASelector
          stateSlug={stateData.slug}
          courseType="continuing-education"
          stateData={stateData}
        />
        {/* COM-08 (audit 2026-07-14): refund microcopy at the point of sale.
            Hidden for pending-approval states — there is no purchase to refund
            while CE enrollment is gated. */}
        {providerApproved && (
          <p className="max-w-4xl mx-auto px-4 pt-4 text-center text-xs text-gray-600">
            <RefundDisclosure />
          </p>
        )}

        {/* Individual-courses catalog tile — links to the à-la-carte
            INDIVIDUAL course category in Absorb (distinct from the PACKAGE
            catalog the LOA cards point to). Shared component, kept OUT of the
            LOA grid so it never alters the card-count layout. */}
        <CEIndividualCoursesTile
          stateSlug={stateData.slug}
          stateName={stateData.name}
          doiName={stateData.doiName}
          providerApproved={providerApproved}
        />
      </div>

      {/* How CE Works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            How CE Renewal Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: "📋",
                title: "Choose Your Course",
                desc: `Select the CE course that matches your ${stateData.name} license type (Life, Health, or Life & Health).`,
              },
              {
                step: "2",
                icon: "💻",
                title: "Complete Online",
                desc: "Finish your required CE hours entirely online, at your own pace, on any device.",
              },
              {
                step: "3",
                icon: "⚡",
                title: providerApproved ? "We Report to the State" : "Get Your Certificate",
                desc: providerApproved
                  ? `JustInsurance typically reports your completion to the ${stateData.doiName} the same day. No paperwork needed.`
                  : `Download your certificate of completion as soon as you finish your ${stateData.name} CE hours.`,
              },
            ].map((item) => (
              <div key={item.step} className="text-center bg-gray-bg rounded-xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
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

      {/* Same-Day Reporting Callout — hidden for pending-approval states, which
          cannot yet report completions to the DOI. */}
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
              When you complete your CE with JustInsurance, we typically electronically report your course completion to the {stateData.doiName} the same business day. Your CE credit appears on your license record automatically — no certificates to mail, no forms to submit.
            </p>
            <p className="text-xs text-blue-200/70 mt-2">
              JustInsurance typically transmits your completion to your state&apos;s Department of Insurance the same business day you finish; the time for your state to post the credit to your license record varies by state.
            </p>
          </div>
        </section>
      )}

      {ce.compliance && (
        <CEComplianceSection
          stateName={stateData.name}
          doiName={stateData.doiName}
          compliance={ce.compliance}
          providerApproved={stateData.providerApprovalNumber !== "PENDING"}
        />
      )}

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} Insurance CE FAQs`}
      />

      {/* Visible "Last updated" stamp at the bottom of the article body */}
      <section className="bg-white py-6 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <LastUpdated date={stateData.lastVerified} />
        </div>
      </section>

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="ce-hub"
        variant="gray"
      />
    </>
  );
}
