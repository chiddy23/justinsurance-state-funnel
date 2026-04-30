import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import PressLogosBar from "@/components/PressLogosBar";
import TrustBar from "@/components/TrustBar";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

const PAGE_TITLE = "Health Insurance License Course | Online | JustInsurance";
const PAGE_DESC =
  "Get your health insurance license online. $199 state-approved prelicensing with pass guarantee. Self-paced courses available nationwide. Enroll today.";
const CANONICAL = "https://justinsuranceco.com/health-insurance-license";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESC,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: CANONICAL,
    type: "website",
    images: [{ url: "/og-image.png", alt: "Health Insurance License Courses — JustInsurance" }],
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
    question: "What products can I sell with a health insurance license?",
    answer:
      "A health insurance license authorizes you to sell major medical insurance, individual and group health plans, disability income insurance, long-term care (LTC) insurance, Medicare Supplement (Medigap) plans, and Medicare Advantage plans. With a growing aging population and high consumer demand for Medicare products, health-licensed agents are in strong demand across the country.",
  },
  {
    question: "Do I need a separate license to sell Medicare plans?",
    answer:
      "Yes — you need a health insurance license in the state where you sell. You also need to complete annual Medicare Sales Training (AHIP or carrier-equivalent) and hold a contract with each carrier whose Medicare plans you sell. The health insurance prelicensing course is the essential first step before any of those additional certifications.",
  },
  {
    question: "What is long-term care insurance and do I need a special license to sell it?",
    answer:
      "Long-term care (LTC) insurance pays for services like nursing home care, assisted living, and in-home care that are not covered by standard health insurance or Medicare. In most states, you need a health insurance license to sell LTC products, and some states also require additional LTC-specific training beyond the standard prelicensing curriculum.",
  },
  {
    question: "How is health insurance prelicensing structured?",
    answer:
      "Health insurance prelicensing courses cover topics including major medical insurance concepts, HMO and PPO plan structures, individual vs. group markets, disability insurance, Medicare and Medicaid programs, long-term care, applicable federal laws (ACA, HIPAA, ERISA), and state-specific regulations. Most states require between 20 and 40 prelicensing hours for the health line of authority.",
  },
];

const stats = [
  { value: "$199", label: "Prelicensing price", sub: "Flat rate, no hidden fees" },
  { value: "93%", label: "First-attempt pass rate", sub: "Among JustInsurance completers" },
  { value: "49", label: "States covered", sub: "State-approved health courses nationwide" },
  { value: "10,000+", label: "Medicare enrollees per day", sub: "Turning 65 in the U.S. daily" },
];

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Health Insurance Exam Practice Questions (30 MUST-KNOW) — Part 2",
  description: "Insurance exam prep video from the Insurance Exam Prep YouTube channel by Justin vom Eigen.",
  thumbnailUrl: `https://i.ytimg.com/vi/VqyHMiRvKSU/hqdefault.jpg`,
  // from src/lib/youtube-videos.json (real values, fetched 2026-04-27)
  uploadDate: "2026-04-06",
  duration: "PT30M13S",
  contentUrl: `https://www.youtube.com/watch?v=VqyHMiRvKSU`,
  embedUrl: `https://www.youtube-nocookie.com/embed/VqyHMiRvKSU`,
  publisher: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
};

export default function HealthInsuranceLicensePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Health Insurance License", url: CANONICAL },
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
          { name: "Health Insurance License" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            State-Approved Prelicensing
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Health Insurance License Courses
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Get your health insurance license online for $199. State-approved courses covering major medical, disability, LTC, and Medicare. Pass guarantee included.
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

      {/* What is a health insurance license */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            What Does a Health Insurance License Cover?
          </h2>
          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>
              A health insurance license grants you the legal authority to sell a wide spectrum of health and benefits products. The most common are individual and group major medical plans — including ACA marketplace plans — as well as short-term medical coverage. Beyond standard health plans, a health license is also required for disability income insurance, which replaces a portion of a client&apos;s income if they become unable to work due to illness or injury.
            </p>
            <p>
              Long-term care insurance and Medicare products represent two of the fastest-growing segments in the industry. More than 10,000 Americans turn 65 every single day, and virtually all of them need help navigating Medicare Supplement, Medicare Advantage, and Part D prescription drug plans. Health-licensed agents who specialize in the senior market are among the most in-demand in the country.
            </p>
            <p>
              To sell any of these products, you must hold an active health insurance license in each state where your clients reside. The licensing process starts with completing a state-approved prelicensing course, passing the state licensing exam, and submitting a license application to the Department of Insurance. JustInsurance provides the online prelicensing education — $199 flat, self-paced, and backed by our pass guarantee. Select your state below to get started.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            Health Insurance License by the Numbers
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
            Health Prelicensing by State
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Select your state to see health insurance prelicensing requirements, required hours, exam details, and course pricing.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}/prelicensing/health/`}
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

      <YouTubeEmbed videoId="VqyHMiRvKSU" title="Health Insurance Exam Practice Questions (30 MUST-KNOW) — Part 2" />

      <CTABanner
        title="Ready to Enter the Health Insurance Market?"
        subtitle="Enroll in your state's health prelicensing course for $199 and start building a career in one of the most in-demand segments of the insurance industry."
        ctaText="Find My State"
        ctaHref="#states"
      />
    </>
  );
}
