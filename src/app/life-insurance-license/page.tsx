import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

const PAGE_TITLE = "Life Insurance License Course | Online | JustInsurance";
const PAGE_DESC =
  "Get your life insurance license online. $199 state-approved prelicensing with pass guarantee. Self-paced courses available nationwide. Enroll today.";
const CANONICAL = "https://justinsuranceco.com/life-insurance-license";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESC,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: CANONICAL,
    type: "website",
    images: [{ url: "/og-image.png", alt: "Life Insurance License Courses — JustInsurance" }],
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
    question: "What products can I sell with a life insurance license?",
    answer:
      "A life insurance license authorizes you to sell term life insurance, whole life insurance, universal life insurance, variable life products (with additional securities licensing), and fixed annuities. It is the foundation of most independent agent practices and one of the highest-commission product categories in the industry.",
  },
  {
    question: "How many prelicensing hours are required for a life insurance license?",
    answer:
      "Required prelicensing hours for life insurance vary by state — most fall between 20 and 40 hours. Some states have a standalone life-only requirement, while others only offer a combined life and health track. Check your state's page for the exact hour requirement and course options available to you.",
  },
  {
    question: "How much can I earn selling life insurance?",
    answer:
      "Life insurance agents are among the highest-earning professionals in financial services. First-year agents typically earn between $40,000 and $70,000 in commission income, while experienced agents and top producers regularly exceed $100,000 to $250,000 per year. Income scales significantly with your renewal book — clients who keep their policies pay you renewals year after year.",
  },
  {
    question: "Is a life license required to sell annuities?",
    answer:
      "Yes. Fixed annuities require a life insurance license in virtually every state. Variable annuities additionally require FINRA Series 6 or Series 7 securities licensing. If you plan to focus on retirement planning, annuity sales, or indexed universal life products, a life insurance license is your essential starting point.",
  },
];

const stats = [
  { value: "$199", label: "Prelicensing price", sub: "Flat rate, no hidden fees" },
  { value: "93%", label: "First-attempt pass rate", sub: "Among JustInsurance completers" },
  { value: "49", label: "States covered", sub: "State-approved life courses nationwide" },
  { value: "$100K+", label: "Top producer income", sub: "Avg. annual earnings for experienced agents" },
];

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "30 MORE Life Insurance Exam Terms You MUST Know (in UNDER 30 Minutes)",
  description: "Insurance exam prep video from the Insurance Exam Prep YouTube channel by Justin vom Eigen.",
  thumbnailUrl: `https://i.ytimg.com/vi/dl3L1bb6hMA/hqdefault.jpg`,
  uploadDate: "2024-01-01",
  contentUrl: `https://www.youtube.com/watch?v=dl3L1bb6hMA`,
  embedUrl: `https://www.youtube-nocookie.com/embed/dl3L1bb6hMA`,
  publisher: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
};

export default function LifeInsuranceLicensePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Life Insurance License", url: CANONICAL },
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
          { name: "Life Insurance License" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            State-Approved Prelicensing
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Life Insurance License Courses
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Earn your life insurance license online for $199. State-approved courses covering term, whole life, universal life, and annuities. Pass guarantee included.
          </p>
          <a
            href="#states"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-10 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Find My State
          </a>
        </div>
      </section>

      {/* What is a life insurance license */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            What Does a Life Insurance License Cover?
          </h2>
          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>
              A life insurance license gives you the legal authority to sell a broad range of life insurance and annuity products to consumers. This includes term life insurance — the most widely purchased coverage type — as well as permanent products like whole life and universal life insurance that build cash value over time. Most states also require a life insurance license to sell fixed annuities, making this credential the cornerstone of retirement and financial planning practices.
            </p>
            <p>
              The career opportunity in life insurance is substantial. The U.S. has an estimated 10 million households that are underinsured or have no life coverage at all. Independent agents who build a life insurance book of business benefit from renewal commissions that pay out year after year as clients keep their policies in force — creating a compounding income stream that rewards consistent effort.
            </p>
            <p>
              To sell life insurance legally, you must first complete a state-approved prelicensing course, pass the state licensing exam, submit a license application, and receive approval from your state&apos;s Department of Insurance. JustInsurance provides the prelicensing education for this process — online, self-paced, and at a flat $199 with no hidden fees. Select your state below to see the specific course hours required and what the exam covers.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            Life Insurance License by the Numbers
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
            Life Prelicensing by State
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Select your state to see life insurance prelicensing requirements, hours, exam details, and course pricing.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}/prelicensing/life/`}
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

      <YouTubeEmbed videoId="dl3L1bb6hMA" title="30 MORE Life Insurance Exam Terms You MUST Know (in UNDER 30 Minutes)" />

      <CTABanner
        title="Start Your Life Insurance Career Today"
        subtitle="Enroll in your state's prelicensing course for $199 and join 30,000+ agents who've trusted JustInsurance to get them licensed."
        ctaText="Find My State"
        ctaHref="#states"
      />
    </>
  );
}
