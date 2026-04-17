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
      "Both JustInsurance and ExamFX publish pass-rate methodology. ExamFX publishes line-of-authority rates on examfx.com/resources/candidates (95% Life, 94% Life & Health, 90% Health, 99% P&C, 95% Personal Lines, 93% Overall Combined) with disclosed methodology — 2,826 self-reported survey respondents collected Feb 1 – Oct 17, 2025. JustInsurance publishes a 93% pass rate at /pass-rates with a stricter inclusion bar: students who completed the full course, finished recommended study hours, and scored 80%+ on the practice exam three times in a row before testing. XCEL Solutions markets 'top industry first-time pass rates' but does not publish a specific figure with disclosed methodology. Methodology disclosure is what lets a prospective student compare apples to apples.",
  },
  {
    question: "How does JustInsurance pricing compare to XCEL and ExamFX?",
    answer:
      "JustInsurance uses a single all-inclusive price: $199 covers 100+ videos, unlimited adaptive practice exams, 5× weekly live instructor sessions, flashcards, audio vocabulary, AI-powered exam simulations, and included extension options. XCEL Solutions and ExamFX both use tiered pricing models where feature availability and extended access can vary by package. For students new to insurance, an all-inclusive price avoids the need to evaluate upgrade paths mid-course. Per ExamFX's published refund policy, course extensions, digital add-on products, and in-course purchases are non-refundable once purchased.",
  },
  {
    question: "What is the ExamFX 3-day guarantee window?",
    answer:
      "Per ExamFX's published pass guarantee policy, the Readiness Exam must be taken no more than three calendar days prior to the state licensing exam, and candidates must score 80% or higher on the Readiness Exam to qualify. Refunds exclude company-paid packages, renewals, and shipping costs. The 3-day window means candidates need to plan the sequence carefully: schedule the state exam first, then take the Readiness Exam within 3 calendar days before the scheduled state-exam date. JustInsurance's guarantee allows 30 days from first enrollment to sit for the state exam, giving more scheduling flexibility. Always verify current terms at examfx.com/pass-guarantee.",
  },
  {
    question: "How does XCEL Solutions' course access duration work?",
    answer:
      "XCEL's standard package is structured in two phases: 30 days of access to the prelicensing course followed by 30 days of access to the exam prep review — 60 days total, but split across consecutive clocks, not one continuous window. For candidates new to insurance, the 30-day prelicensing phase can feel rushed if you need extra time on the main curriculum, and extending it requires a paid upgrade. JustInsurance includes multiple extension options in the base course, so you can study at your own pace without juggling multiple access windows.",
  },
  {
    question: "Can I get a refund if I don't pass the state exam?",
    answer:
      "JustInsurance backs every prelicensing course with a pass guarantee. If you complete the recommended study hours, score 80%+ on the practice exam three times in a row, and sit for your first-time state exam attempt within 30 days of your first enrollment, we refund your course fee in full if you don't pass. ExamFX offers a refund-style pass guarantee with the 3-day Readiness Exam window described above. XCEL Solutions publishes its own pass guarantee terms on its site; policy specifics vary by package and state, so verify current terms at xcelsolutions.com before purchase.",
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
