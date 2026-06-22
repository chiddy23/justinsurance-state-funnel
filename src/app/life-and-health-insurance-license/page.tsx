import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import PressLogosBar from "@/components/PressLogosBar";
import TrustBar from "@/components/TrustBar";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

const PAGE_TITLE = "Life & Health Insurance License | Combined | JustInsurance";
const PAGE_DESC =
  "Get your combined life and health insurance license online. $199 state-approved prelicensing with pass guarantee. The most popular license type nationwide.";
const CANONICAL = "https://justinsuranceco.com/life-and-health-insurance-license";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESC,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: CANONICAL,
    type: "website",
    images: [{ url: "/og-image.png", alt: "Life & Health Insurance License Courses — JustInsurance" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "Why is the combined life and health license the most popular choice?",
    answer:
      "The combined life and health license is the most popular starting point for new agents because it unlocks the widest possible product portfolio in a single step. Rather than limiting yourself to either life products or health products, you can serve clients across term and permanent life insurance, annuities, disability income, long-term care, major medical, Medicare Supplement, and Medicare Advantage — all under one license. This breadth maximizes your earning potential and gives you the flexibility to serve clients at every stage of life.",
  },
  {
    question: "Does completing a combined course take significantly longer than a single line?",
    answer:
      "Yes, but not dramatically. Most states require between 30 and 40 hours for a combined life and health prelicensing course, compared to 20 to 30 hours for a single line of authority. The additional time is well worth it — you complete more education once and receive authorization to sell a much broader product set, avoiding the need to return for a second course later.",
  },
  {
    question: "Do I take one exam or two with a combined license?",
    answer:
      "This depends on your state. Most states administer a single combined life and health exam, often split into a general section and a state-law section. Some states offer separate life and health exams that you can take on the same day. Your state's specific exam page on JustInsurance will show you the format, passing score, and what topics to expect.",
  },
  {
    question: "Can I start selling with a life and health license right away after passing?",
    answer:
      "Once your state approves your license application, you are authorized to sell the products covered under your license. However, before selling specific carrier products — especially Medicare plans — you typically need to be appointed by that carrier and complete any required product certifications. For Medicare Advantage and Part D specifically, annual AHIP certification is required by CMS.",
  },
];

const stats = [
  { value: "$199", label: "Prelicensing price", sub: "One price, both lines of authority" },
  { value: "93%", label: "First-attempt pass rate", sub: "Among JustInsurance completers" },
  { value: "#1", label: "Most popular license type", sub: "Chosen by the majority of new agents" },
  { value: "2× products", label: "Broader product portfolio", sub: "Life + health under one credential" },
];

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Life + Health Insurance Exam Practice Questions (30 MUST-KNOW) Part 2",
  description: "Insurance exam prep video from the Insurance Exam Prep YouTube channel by Justin vom Eigen.",
  thumbnailUrl: `https://i.ytimg.com/vi/zFd-qEsGMZ8/hqdefault.jpg`,
  // from src/lib/youtube-videos.json (real values, fetched 2026-04-27)
  uploadDate: "2026-02-15",
  duration: "PT31M53S",
  contentUrl: `https://www.youtube.com/watch?v=zFd-qEsGMZ8`,
  embedUrl: `https://www.youtube-nocookie.com/embed/zFd-qEsGMZ8`,
  publisher: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
};

export default function LifeAndHealthInsuranceLicensePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Life & Health Insurance License", url: CANONICAL },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const states = Object.values(STATES)
    .filter((s) => s.slug !== "new-york")
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={videoSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Life & Health Insurance License" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Most Popular License Type
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Life &amp; Health Insurance License Courses
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Get the broadest insurance license available for $199. One combined course covers life, health, disability, LTC, annuities, and Medicare. Pass guarantee included.
          </p>
          <a
            href="#states"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-10 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Find My State
          </a>
        </div>
      </section>

      <TrustBar />
      <PressLogosBar />

      {/* Why combined */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            Why Choose the Combined Life &amp; Health License?
          </h2>
          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>
              The combined life and health insurance license is the single most popular license type for new and experienced agents alike — and for good reason. Instead of limiting yourself to one product category, a combined license authorizes you to sell the full spectrum of personal insurance products: term and permanent life insurance, fixed annuities, individual and group major medical plans, disability income insurance, long-term care insurance, Medicare Supplement plans, and Medicare Advantage plans. This breadth means you can serve one client from the beginning of their career through retirement with products that meet every protection need.
            </p>
            <p>
              From an income standpoint, the combined license is the highest-ceiling option for most agents. Life insurance renewals build a passive income stream as clients keep their policies. Medicare products pay recurring commissions for as long as the client remains enrolled. Annuity cases can generate some of the largest single-sale commissions in the industry. Agents who hold both lines consistently out-earn single-line agents because they have more entry points to serve each client and more cross-selling opportunities throughout that relationship.
            </p>
            <p>
              The combined prelicensing course covers all the education required for both lines of authority — typically 30 to 40 hours depending on your state. You take a single licensing exam (or two exams on the same day in select states) and receive one license credential authorizing both product categories. JustInsurance offers this course for $199 flat with a pass guarantee. Select your state below to see the specific requirements, hours, and exam format for your market.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            Combined License at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <p className="text-gold font-extrabold text-3xl md:text-4xl mb-1">{stat.value}</p>
                <p className="text-navy font-bold text-sm mb-1">{stat.label}</p>
                <p className="text-gray-500 text-xs leading-snug">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State grid */}
      <section id="states" className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Life &amp; Health Prelicensing by State
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Select your state to view combined life and health prelicensing requirements, required hours, exam structure, and course pricing.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}/prelicensing/life-and-health`}
                className="group flex items-center gap-2 bg-gray-50 hover:bg-navy rounded-lg p-3 transition-all hover:shadow-md border border-gray-100"
              >
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-200 w-8 flex-shrink-0">
                  {state.abbreviation}
                </span>
                <span className="text-sm font-medium text-navy group-hover:text-white leading-tight">
                  {state.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-navy mb-3 text-lg">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-bg py-12 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center mb-6">
          <p className="text-gold font-semibold uppercase tracking-wide text-xs mb-2">
            30 Must-Know Practice Questions
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
            Life &amp; Health Exam Walkthrough — Part 2 &amp; Part 3
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Two full walkthroughs of 30 must-know Life &amp; Health questions each — with the
            reasoning behind every answer.
          </p>
        </div>
      </section>
      <YouTubeEmbed videoId="zFd-qEsGMZ8" title="Life + Health Insurance Exam Practice Questions (30 MUST-KNOW) Part 2" />
      <YouTubeEmbed videoId="f3eCrvsW7pU" title="Life + Health Insurance Exam Practice Questions (30 MUST-KNOW) Part 3" />
      <YouTubeEmbed videoId="CFofL1mdURM" title="Pass Your Life + Health Insurance Exam - 6 Hour MASTERCLASS" />

      <CTABanner
        title="Get the License That Opens Every Door"
        subtitle="The combined life and health license is the most versatile credential in the industry. Enroll for $199 and start your career with the broadest possible product portfolio."
        ctaText="Find My State"
        ctaHref="#states"
      />
    </>
  );
}
