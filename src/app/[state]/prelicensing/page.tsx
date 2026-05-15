import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateParams } from "@/lib/generateStaticParams";
import { generateArticleSchemaWithReviewer, generateBreadcrumbSchema, generateFAQSchema, SchemaMarkup } from "@/lib/schema";
import { getPrelicensingHubFAQs, buildFaqData } from "@/lib/faq-data";
import ArticleByline from "@/components/ArticleByline";
import StateHero from "@/components/StateHero";
import LOASelector from "@/components/LOASelector";
import PassGuarantee from "@/components/PassGuarantee";
import FAQAccordion from "@/components/FAQAccordion";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedStatePages from "@/components/RelatedStatePages";
import LastUpdated from "@/components/LastUpdated";

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
    pageType: "prelicensing-hub",
    stateName: stateData.name,
    stateSlug: stateData.slug,
    hours: typeof stateData.prelicensing.lifeAndHealth.hours === "number" ? stateData.prelicensing.lifeAndHealth.hours : undefined,
  });
}

export default async function PrelicensingHubPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) notFound();

  const faqs = getPrelicensingHubFAQs(buildFaqData(stateData));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
    { name: "Prelicensing", url: `https://justinsuranceco.com/${stateData.slug}/prelicensing` },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const articleHeadline = `${stateData.name} Insurance Prelicensing Courses`;
  const articleDescription = `Get your ${stateData.name} insurance license with a state-approved online prelicensing course. Choose your line of authority below and start studying today.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${stateData.slug}/prelicensing`,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}/` },
    { name: "Prelicensing" },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      <StateHero
        eyebrow={`${stateData.name} Prelicensing`}
        title={`${stateData.name} Insurance Prelicensing Courses`}
        subtitle={`Get your ${stateData.name} insurance license with a state-approved online prelicensing course. Choose your line of authority below and start studying today.`}
        ctaButtons={[
          { text: "Choose Your Course Below", href: "#courses" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* What is Prelicensing — 2-column explainer */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                What is Insurance Prelicensing?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {(() => {
                  const hrs = stateData.prelicensing.lifeAndHealth.hours;
                  const required =
                    typeof hrs === "number" ||
                    (typeof hrs === "string" && !/not required|none|no /i.test(hrs));
                  if (required) {
                    return `Before you can take the ${stateData.name} insurance licensing exam, state law requires you to complete a minimum number of hours of approved prelicensing education. This education covers the insurance concepts, policy types, and ${stateData.name} regulations you need to know to sell insurance professionally and ethically.`;
                  }
                  return `${stateData.name} does not require a formal prelicensing course to sit for the state licensing exam — but preparation still matters. JustInsurance's ${stateData.name} prelicensing course covers the insurance concepts, policy types, and ${stateData.name} regulations tested on the exam, giving you the structure first-time passers rely on even when it's not state-mandated.`;
                })()}
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                JustInsurance&apos;s {stateData.name} prelicensing courses are fully online and self-paced. You can study on any device, at any time. There are no live sessions to attend — just work through the lessons at your own pace and move on when you&apos;re ready.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Once you complete the required hours and pass the course assessments, you&apos;ll receive an official certificate of completion. Present that certificate to schedule your {stateData.name} state licensing exam with {stateData.examInfo.examProvider}.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Enroll Online", desc: "Choose your line of authority and enroll in minutes. Instant access to all course materials." },
                { step: "2", title: "Study at Your Pace", desc: `Complete ${stateData.prelicensing.lifeAndHealth.hours} hours of video lessons, readings, and quizzes on any device.` },
                { step: "3", title: "Earn Your Certificate", desc: "Pass the course assessments to receive your official certificate of completion from JustInsurance." },
                { step: "4", title: "Pass the State Exam", desc: `Schedule and pass the ${stateData.name} licensing exam with ${stateData.examInfo.examProvider}, then apply for your license.` },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 bg-gray-bg rounded-lg p-4">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-dark font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{item.title}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOA Selector */}
      <div id="courses">
        <LOASelector
          stateSlug={stateData.slug}
          courseType="prelicensing"
          stateData={stateData}
        />
      </div>

      {/* How It Works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            How to Get Your {stateData.name} Insurance License
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                icon: "📋",
                title: "Enroll in a Course",
                desc: "Choose your line of authority (Life, Health, or Life & Health) and enroll online.",
              },
              {
                step: "2",
                icon: "📚",
                title: "Complete Your Education",
                desc: `Study through all ${stateData.prelicensing.lifeAndHealth.hours} required hours online at your own pace.`,
              },
              {
                step: "3",
                icon: "🎓",
                title: "Pass the State Exam",
                desc: `Schedule and pass the ${stateData.name} exam at a ${stateData.examInfo.examProvider} testing center.`,
              },
              {
                step: "4",
                icon: "🪪",
                title: "Apply for Your License",
                desc: `Submit your license application to the ${stateData.doiName}${stateData.applicationBeforeExam ? " (apply before your exam in ${stateData.name})" : " after passing your exam"}.`,
              },
            ].map((item) => (
              <div key={item.step} className="text-center bg-gray-bg rounded-xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="font-bold text-navy mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PassGuarantee />

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} Prelicensing FAQs`}
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
        currentPage="prelicensing-hub"
        variant="gray"
      />
    </>
  );
}
