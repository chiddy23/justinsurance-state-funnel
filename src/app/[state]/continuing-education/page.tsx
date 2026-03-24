import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateParams } from "@/lib/generateStaticParams";
import { generateBreadcrumbSchema, generateFAQSchema, SchemaMarkup } from "@/lib/schema";
import { getCEHubFAQs, buildFaqData } from "@/lib/faq-data";
import StateHero from "@/components/StateHero";
import LOASelector from "@/components/LOASelector";
import FAQAccordion from "@/components/FAQAccordion";
import BreadcrumbNav from "@/components/BreadcrumbNav";

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
    hours: stateData.ce.totalHours,
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
  const faqs = getCEHubFAQs(buildFaqData(stateData));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}/` },
    {
      name: "Continuing Education",
      url: `https://justinsuranceco.com/${stateData.slug}/continuing-education/`,
    },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}/` },
    { name: "Continuing Education" },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      <StateHero
        eyebrow={`${stateData.name} CE Courses`}
        title={`${stateData.name} Insurance Continuing Education (CE) Courses`}
        subtitle={`Don't let your license lapse! Complete your ${stateData.name} CE hours online with state-approved courses. We report your completion to the state the same day.`}
        ctaButtons={[
          { text: "See CE Courses Below", href: "#ce-courses" },
        ]}
      />

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
                JustInsurance offers state-approved online CE courses that you can complete entirely at your own pace, on any device. When you finish, we report your completion directly to the {stateData.doiName} the same day — no paperwork, no delays.
              </p>
              <div className="bg-amber-50 border-l-4 border-gold rounded-r-lg p-4">
                <p className="font-semibold text-navy text-sm mb-1">Don&apos;t Wait Until the Last Minute</p>
                <p className="text-gray-600 text-sm">
                  License lapses can result in reinstatement fees and additional requirements. Complete your CE at least 30 days before your renewal deadline. JustInsurance courses can be finished in a single day.
                </p>
              </div>
            </div>

            {/* Requirements Summary */}
            <div className="bg-gray-bg rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-navy mb-4">CE Requirements Summary</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Total CE Hours</span>
                  <span className="font-bold text-navy">{ce.totalHours} hours</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Renewal Period</span>
                  <span className="font-bold text-navy">{ce.renewalPeriod}</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Ethics Hours Required</span>
                  <span className="font-bold text-navy">{ce.ethicsHours} hours</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">CE Reporting</span>
                  <span className="font-bold text-success">Same-Day</span>
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
                title: "We Report to the State",
                desc: `JustInsurance reports your completion to the ${stateData.doiName} the same day. No paperwork needed.`,
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
            When you complete your CE with JustInsurance, we electronically report your course completion to the {stateData.doiName} the same business day. Your CE credit appears on your license record automatically — no certificates to mail, no forms to submit.
          </p>
        </div>
      </section>

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} Insurance CE FAQs`}
      />
    </>
  );
}
