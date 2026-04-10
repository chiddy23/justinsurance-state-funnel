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

  // Fix 2 & 3 — use realPassRate / marketGrowthRate when available, otherwise
  // fall back to the existing examInfo / stateData values so FAQ text stays valid.
  const faqData = {
    ...buildFaqData(stateData),
    passRate:
      stateData.realPassRate !== null
        ? String(stateData.realPassRate)
        : stateData.examInfo.passRate,
    jobGrowth:
      stateData.marketGrowthRate !== null
        ? String(stateData.marketGrowthRate)
        : stateData.jobGrowth,
  };

  const baseFaqs = getStateHubFAQs(faqData);

  // Fix 6 — append state-specific FAQ as question 6
  const faqs = [
    ...baseFaqs,
    {
      question: stateData.stateSpecificFAQ.question,
      answer: stateData.stateSpecificFAQ.answer,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}/` },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name },
  ];

  // Fix 1 — hero subtitle from stateSpecificIntro with fallback
  const heroSubtitle =
    stateData.stateSpecificIntro && stateData.stateSpecificIntro.trim() !== ""
      ? stateData.stateSpecificIntro
      : "State-approved prelicensing and CE courses. 100% online, self-paced, pass guarantee included.";

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

      <BreadcrumbNav crumbs={crumbs} />

      {/* Fix 1 — hero subtitle uses stateSpecificIntro */}
      <StateHero
        eyebrow={`${stateData.name} Insurance Licensing`}
        title={`Get Your ${stateData.name} Insurance License Online`}
        subtitle={heroSubtitle}
        ctaButtons={[
          { text: "Start Prelicensing", href: `/${stateData.slug}/prelicensing/` },
          { text: "Renew with CE", href: `/${stateData.slug}/continuing-education/`, variant: "secondary" },
        ]}
      />

      <TrustBar />

      <TwoPathSelector stateSlug={stateData.slug} stateName={stateData.name} />

      <StateRequirementsBlock stateData={stateData} />

      {/* Fix 5 — Last Verified + Provider Approval Number */}
      <section className="bg-white py-4 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-x-8 gap-y-1 text-xs text-gray-400">
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

      {/* Fix 8 — Link to requirements page */}
      <section className="bg-white pb-6 px-4">
        <div className="max-w-5xl mx-auto">
          <a
            href={`/${stateData.slug}/requirements/`}
            className="text-sm text-navy underline hover:text-gold transition-colors"
          >
            {stateData.name} insurance license requirements &rarr;
          </a>
        </div>
      </section>

      {/* Why JustInsurance — inline section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Why Choose JustInsurance for Your {stateData.name} License?
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            We&apos;ve helped 30,000+ agents get licensed across all 50 states. Here&apos;s why they choose us.
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

      {/* Fix 4 — Lead testimonial uses state-matched data */}
      <TestimonialCards leadTestimonial={stateData.stateTestimonial} />

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

      <CTABanner
        title={`Ready to Get Your ${stateData.name} Insurance License?`}
        subtitle="Enroll in a state-approved prelicensing course today. 100% online, self-paced, and backed by our pass guarantee."
        ctaText="Browse Courses"
        ctaHref={`/${stateData.slug}/prelicensing/`}
      />
    </>
  );
}
