import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ComparisonTable from "@/components/ComparisonTable";
import FAQAccordion from "@/components/FAQAccordion";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import { COMPARISON_ROWS, PROVIDERS, PASS_RATE_FOOTNOTE } from "@/lib/comparison-data";

export const metadata: Metadata = {
  title: { absolute: "Insurance Prelicensing Comparison: JustInsurance vs XCEL vs ExamFX" },
  description:
    "Compare the top insurance prelicensing providers side-by-side. Videos, live sessions, pass rates, support hours, and pricing — with nothing hidden behind upcharges.",
  alternates: { canonical: "https://justinsuranceco.com/compare" },
};

const faqs = [
  {
    question: "Which insurance prelicensing provider publishes its pass rate with methodology?",
    answer:
      "JustInsurance publishes a 93% pass rate with full methodology — measured among students who completed the full course, finished the recommended study hours, and scored 80%+ on the practice exam three times in a row before sitting for the state exam. ExamFX displays pass rate figures on its product pages (93% aggregate, 94% Life & Health, 95% Life, 99% Property & Casualty) but does not disclose sample size, time period, or methodology. XCEL Solutions markets 'top industry first-time pass rates' but does not publish a specific figure with methodology. Methodology transparency is what makes a pass rate verifiable — a number without it is a claim.",
  },
  {
    question: "Why are flashcards, live sessions, and extra access an upcharge at XCEL and ExamFX?",
    answer:
      "Both XCEL and ExamFX use a modular pricing model — the base course includes videos and a fixed number of practice exams, and students add flashcards, live sessions, or extended access as paid upgrades. JustInsurance uses an all-inclusive model: the single $199 course fee covers 100+ videos, unlimited practice exams, 5× weekly live sessions, flashcards, audio vocabulary, AI-powered exam simulations, and extended access options. This matters because the features most predictive of first-attempt pass rates (realistic practice exams, spaced repetition flashcards, live instructor support) are exactly the ones competitors charge extra for.",
  },
  {
    question: "What is the ExamFX 3-day guarantee window?",
    answer:
      "ExamFX's published pass guarantee requires you to sit for the state licensing exam within 3 calendar days of passing their Readiness Exam at 80%+. The guarantee only covers your first state exam attempt (second attempts don't qualify), and refunds exclude company-paid packages and shipping. The friction point is the 3-day window — Pearson VUE and PSI testing centers are typically booked 1–2 weeks out, so most candidates can't actually schedule an appointment within 72 hours. JustInsurance's guarantee allows 30 days from your first course enrollment to sit for the exam, which matches how real people schedule.",
  },
  {
    question: "How does XCEL Solutions' course access duration work?",
    answer:
      "XCEL's standard package is structured in two phases: 30 days of access to the prelicensing course followed by 30 days of access to the exam prep review — 60 days total, but split across consecutive clocks, not one continuous window. For candidates new to insurance, the 30-day prelicensing phase can feel rushed if you need extra time on the main curriculum, and extending it requires a paid upgrade. JustInsurance includes multiple extension options in the base course, so you can study at your own pace without juggling multiple access windows.",
  },
  {
    question: "Can I get a refund if I don't pass the state exam?",
    answer:
      "JustInsurance backs every prelicensing course with a pass guarantee. If you complete the recommended study hours, score 80%+ on the practice exam three times in a row, and sit for your first-time state exam attempt within 30 days of your first enrollment, we refund your course fee in full if you don't pass. ExamFX offers a refund-style guarantee with the restrictive 3-day window described above. XCEL Solutions' policy is different — instead of a refund, students who fail can continue studying in the course at no additional cost (provided the enrollment hasn't expired).",
  },
  {
    question: "Which states do JustInsurance, XCEL, and ExamFX cover?",
    answer:
      "JustInsurance offers prelicensing and CE nationwide for Life, Health, and Life & Health. XCEL and ExamFX also cover nationwide but have different state-specific course approvals — particularly around California's 12-hour Code & Ethics requirement, Florida's 2-15 combined license, and Texas's no-prelicensing-required status. Select your state on our homepage to see the specific JustInsurance course and pricing for your line of authority.",
  },
];

const faqSchema = generateFAQSchema(faqs);
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Compare Providers", url: "https://justinsuranceco.com/compare" },
]);

export default function ComparePage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Compare Providers" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold uppercase tracking-wide text-sm mb-3">
            Prelicense Provider Comparison
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            JustInsurance vs XCEL Solutions vs ExamFX
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            The features competitors hide behind upcharges — flashcards, live sessions, exam
            simulations, extensions — are all included in our single $199 course. Compare
            side-by-side.
          </p>
        </div>
      </section>

      {/* Key advantages band */}
      <section className="bg-gold/10 border-b border-gold/30 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">93%</p>
            <p className="text-xs text-gray-700">Published pass rate</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">$199</p>
            <p className="text-xs text-gray-700">All-inclusive price</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">100+</p>
            <p className="text-xs text-gray-700">Video lessons included</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">5×/wk</p>
            <p className="text-xs text-gray-700">Live sessions included</p>
          </div>
        </div>
      </section>

      {/* The full table */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Full Feature Comparison
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            18 comparison points across curriculum, support, guarantees, and features.
          </p>
          <ComparisonTable rows={COMPARISON_ROWS} />
          <p className="text-gray-500 text-xs italic text-center mt-4 max-w-3xl mx-auto">
            {PASS_RATE_FOOTNOTE}
          </p>
        </div>
      </section>

      {/* Competitor-specific CTAs */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            See How JustInsurance Beats Each Competitor
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Detailed head-to-head analysis including real user complaints, missing features, and
            the specific guarantee terms that matter.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(PROVIDERS).map((p) => (
              <Link
                key={p.slug}
                href={`/compare/${p.slug}`}
                className="bg-white rounded-xl border border-gray-200 hover:border-gold shadow-sm hover:shadow-lg transition-all p-6 group"
              >
                <p className="text-gold-dark font-semibold uppercase tracking-wide text-xs mb-2">
                  Head-to-Head
                </p>
                <h3 className="text-xl font-bold text-navy mb-2">
                  JustInsurance vs {p.fullName}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {p.youShouldKnow.split(".")[0]}.
                </p>
                <p className="text-gold-dark font-semibold text-sm group-hover:underline">
                  See full comparison →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="bg-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Start Your State-Approved Prelicensing?
          </h2>
          <p className="text-blue-100 leading-relaxed mb-6 max-w-2xl mx-auto">
            Nationwide coverage. One price — $199 — with every feature included. Pass guarantee
            backed by our published methodology.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Find Your State
            </Link>
            <Link
              href="/pass-rates"
              className="inline-block bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              See Pass Rate Methodology
            </Link>
          </div>
        </div>
      </section>

      <FAQAccordion faqs={faqs} heading="Comparison FAQs" />
    </>
  );
}
