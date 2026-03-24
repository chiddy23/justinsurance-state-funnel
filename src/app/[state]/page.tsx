import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateParams } from "@/lib/generateStaticParams";
import { generateBreadcrumbSchema, generateFAQSchema, SchemaMarkup } from "@/lib/schema";
import { getStateHubFAQs, buildFaqData } from "@/lib/faq-data";
import StateHero from "@/components/StateHero";
import TrustBar from "@/components/TrustBar";
import TwoPathSelector from "@/components/TwoPathSelector";
import StateRequirementsBlock from "@/components/StateRequirementsBlock";
import TestimonialCards from "@/components/TestimonialCards";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
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
    pageType: "state-hub",
    stateName: stateData.name,
    stateSlug: stateData.slug,
  });
}

export default async function StateHubPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) notFound();

  const faqs = getStateHubFAQs(buildFaqData(stateData));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}/` },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      <StateHero
        eyebrow={`${stateData.name} Insurance Licensing`}
        title={`Get Your ${stateData.name} Insurance License Online`}
        subtitle={`State-approved prelicensing and CE courses for ${stateData.name} life and health insurance agents. 100% online, self-paced, pass guarantee included.`}
        ctaButtons={[
          { text: "Start Prelicensing", href: `/${stateData.slug}/prelicensing/` },
          { text: "Renew with CE", href: `/${stateData.slug}/continuing-education/`, variant: "secondary" },
        ]}
      />

      <TrustBar />

      <TwoPathSelector stateSlug={stateData.slug} stateName={stateData.name} />

      <StateRequirementsBlock stateData={stateData} />

      {/* Why JustInsurance — inline section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Why Choose JustInsurance for Your {stateData.name} License?
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            We&apos;ve helped 15,000+ agents get licensed across all 50 states. Here&apos;s why they choose us.
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
                desc: "Complete the course and take your exam. If you don't pass, we refund your course fee. Simple as that.",
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

      <TestimonialCards />

      <FAQAccordion faqs={faqs} heading={`${stateData.name} Insurance License FAQs`} />

      <CTABanner
        title={`Ready to Get Your ${stateData.name} Insurance License?`}
        subtitle="Enroll in a state-approved prelicensing course today. 100% online, self-paced, and backed by our pass guarantee."
        ctaText="Browse Courses"
        ctaHref={`/${stateData.slug}/prelicensing/`}
      />
    </>
  );
}
