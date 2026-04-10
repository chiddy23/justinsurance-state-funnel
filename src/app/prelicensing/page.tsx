import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

const PAGE_TITLE = "Insurance Prelicensing Courses | $199 | JustInsurance";
const PAGE_DESC =
  "State-approved insurance prelicensing courses online. $199, pass guarantee. Life, health, and combined. Start in any of 50 states.";
const CANONICAL = "https://justinsuranceco.com/prelicensing";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESC,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: CANONICAL,
    type: "website",
    images: [{ url: "/og-image.png", alt: "Insurance Prelicensing Courses — JustInsurance" }],
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
    question: "What is insurance prelicensing?",
    answer:
      "Insurance prelicensing is a state-mandated education requirement that must be completed before you can sit for your state insurance licensing exam. Each state specifies a minimum number of required hours — typically 20 to 40 hours — covering topics like insurance concepts, policy types, regulations, and ethics. JustInsurance courses satisfy these requirements in all 50 states where we operate.",
  },
  {
    question: "How long does prelicensing take to complete?",
    answer:
      "Most students complete their prelicensing course in 1 to 3 weeks studying part-time. The required hours vary by state and line of authority — life-only courses average around 20 hours, while combined life and health courses may require 40 to 60 hours depending on your state. Because our courses are fully self-paced, you can accelerate or spread out your study as needed.",
  },
  {
    question: "Do I need prelicensing before taking the state exam?",
    answer:
      "Yes. Almost every state requires proof of prelicensing course completion before you can register for the state licensing exam. Once you finish your JustInsurance course, we issue a completion certificate that you submit to your state's exam vendor (typically Pearson VUE or PSI) to unlock exam eligibility.",
  },
  {
    question: "What happens if I don't pass the licensing exam?",
    answer:
      "JustInsurance backs every prelicensing course with a pass guarantee. If you complete the full course — including all required practice exams — and do not pass your state licensing exam, we will refund your course fee in full. No questions asked. Our 93% first-attempt pass rate reflects the quality of our curriculum, but the guarantee gives you peace of mind either way.",
  },
];

const stats = [
  { value: "$199", label: "Flat course price", sub: "No hidden fees or subscriptions" },
  { value: "93%", label: "First-attempt pass rate", sub: "vs. ~55% national average" },
  { value: "50", label: "States covered", sub: "State-approved in every market we serve" },
  { value: "1–3 wks", label: "Avg. completion time", sub: "Fully self-paced, no deadlines" },
];

export default function PrelicensingPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Prelicensing", url: CANONICAL },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const states = Object.values(STATES)
    .filter((s) => s.slug !== "new-york")
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Prelicensing" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            State-Approved Online Courses
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Insurance Prelicensing Courses
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Complete your state-required prelicensing education online for $199. Self-paced, state-approved, and backed by our pass guarantee. Available in 50 states.
          </p>
          <a
            href="#states"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-10 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Find My State
          </a>
        </div>
      </section>

      {/* What is prelicensing */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            What Is Insurance Prelicensing?
          </h2>
          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>
              Insurance prelicensing is state-mandated education that every aspiring insurance agent must complete before sitting for the state licensing exam. Each state&apos;s Department of Insurance sets the required number of study hours — typically between 20 and 40 hours — and defines the topics that must be covered, including life insurance concepts, health insurance products, policy structures, annuities, federal and state regulations, and professional ethics.
            </p>
            <p>
              JustInsurance prelicensing courses are fully online and 100% self-paced. You study through video lessons, reading modules, and chapter quizzes, then take a final practice exam that mirrors your state&apos;s actual licensing test. When you pass, you receive a state-recognized completion certificate that unlocks your eligibility to sit for the official exam.
            </p>
            <p>
              Prelicensing is required for every line of authority — whether you want to sell life insurance, health insurance, or both. The right course depends on the license type your state requires and the products you plan to offer clients. Use the state grid below to find the course options available in your state.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            Why Agents Choose JustInsurance
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
            Choose Your State
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Select your state to see prelicensing course options, required hours, and exam details.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}/prelicensing/`}
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

      <CTABanner
        title="Ready to Start Your Prelicensing Course?"
        subtitle="Pick your state, enroll in minutes, and start studying today. Pass guarantee included with every course."
        ctaText="Find My State"
        ctaHref="#states"
      />
    </>
  );
}
