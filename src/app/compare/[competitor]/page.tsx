import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ComparisonTable from "@/components/ComparisonTable";
import FAQAccordion from "@/components/FAQAccordion";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import { COMPARISON_ROWS, PROVIDERS, PASS_RATE_FOOTNOTE } from "@/lib/comparison-data";

export function generateStaticParams() {
  return Object.keys(PROVIDERS).map((slug) => ({ competitor: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ competitor: string }>;
}): Promise<Metadata> {
  const { competitor } = await params;
  const p = PROVIDERS[competitor];
  if (!p) return {};
  return {
    title: { absolute: `JustInsurance vs ${p.fullName}: Prelicensing Comparison | JustInsurance` },
    description: `Direct comparison of JustInsurance and ${p.fullName} insurance prelicensing — features, pricing, guarantees, and the real user complaints competitors don't publish.`,
    alternates: { canonical: `https://justinsuranceco.com/compare/${p.slug}` },
  };
}

function competitorFaqs(p: (typeof PROVIDERS)[string]) {
  if (p.slug === "xcel") {
    return [
      {
        question: "What's the main difference between JustInsurance and XCEL Solutions?",
        answer:
          "JustInsurance packages every feature you need to pass the state exam — 100+ videos, unlimited practice exams, flashcards, 5× weekly live sessions, AI-powered exam simulations, audio vocabulary, and white-glove licensing support — into a single $199 all-inclusive course. XCEL offers a lower-looking base price but layers flashcards, realistic simulations, extended access, and other essentials behind paid upgrades. By the time an XCEL student purchases the features they actually need, the total often exceeds JustInsurance's flat fee.",
      },
      {
        question: "How does XCEL Solutions' course access duration actually work?",
        answer:
          "XCEL's standard package gives you 30 days of access to the prelicensing course, plus an additional 30 days of access to the exam prep review. That's 60 days total, but split across two consecutive phases — not one continuous 60-day window. For candidates new to insurance, the 30-day prelicensing clock can still feel rushed if you need extra time on the main curriculum. Extending the prelicensing phase requires a paid upgrade. JustInsurance includes multiple extension options at no additional cost, so you can study at your own pace without a second clock starting.",
      },
      {
        question: "Does XCEL offer live instructor sessions?",
        answer:
          "Yes, XCEL offers livestream instructor-led webinar classes (with camera and ID verification required) as well as on-demand recorded content — but the livestream sessions are typically sold as a paid upgrade rather than included in the base package. JustInsurance runs genuine live instructor sessions 5× per week as part of the standard course, with no upcharge.",
      },
      {
        question: "Does XCEL publish its pass rate?",
        answer:
          "XCEL Solutions promotes 'top industry first-time pass rates' in marketing copy but does not publish a specific first-attempt pass rate figure with methodology on its product pages. JustInsurance publishes a 93% pass rate with full methodology disclosed at /pass-rates (students who completed the full course, met recommended study hours, and scored 80%+ on the practice exam three times in a row before testing). Methodology transparency is what makes a pass rate claim verifiable.",
      },
      {
        question: "Can I get a refund from XCEL if I don't pass?",
        answer:
          "XCEL's refund and pass guarantee terms vary by package and state — there is no single universally-advertised pass guarantee. JustInsurance offers a consistent pass guarantee on every prelicensing course: if you complete the recommended study hours, score 80%+ on the practice exam three times in a row, and sit for your first-time state exam within 30 days of enrollment, we refund your course fee in full if you don't pass.",
      },
    ];
  }
  // examfx
  return [
    {
      question: "What's the main difference between JustInsurance and ExamFX?",
      answer:
        "Both are well-established providers with 50-state coverage, and both publish pass rate figures. The biggest practical differences are (1) ExamFX's pass guarantee requires you to test within 3 calendar days of passing their Readiness Exam at 80%+, which is impractical for most working adults who can't schedule a Pearson VUE or PSI appointment on 3 days' notice, and (2) ExamFX publishes pass rates (93% aggregate, 94% Life & Health) without disclosing methodology or sample size, while JustInsurance publishes both the 93% figure and the full methodology at /pass-rates. ExamFX also charges for flashcards and livestream sessions as add-ons; JustInsurance includes both in the $199 base course.",
    },
    {
      question: "What are the exact terms of ExamFX's 3-day guarantee?",
      answer:
        "ExamFX's published pass guarantee requires: (1) passing their Readiness Exam at 80% or higher, (2) sitting for the state licensing exam within 3 calendar days of passing the Readiness Exam, (3) failing the state exam on your first attempt only (second-attempt failures don't qualify), (4) submitting your score sheet within 30 days of the licensing exam. Refunds exclude company-paid packages and shipping costs. The friction point is the 3-day window — Pearson VUE and PSI testing centers are typically booked 1–2 weeks out, so most candidates can't actually schedule a testing appointment within 72 hours. JustInsurance's guarantee allows 30 days from first enrollment to sit for the exam.",
    },
    {
      question: "How often does ExamFX run live sessions?",
      answer:
        "ExamFX offers livestream instructor sessions as a paid upgrade rather than as part of the base course, with more limited frequency than a daily-access model. JustInsurance runs genuine live sessions 5× per week as part of the standard $199 course — no upcharge.",
    },
    {
      question: "Does ExamFX publish its pass rate?",
      answer:
        "Yes, ExamFX prominently displays pass rate figures on its product pages (93% aggregate, 94% Life & Health, 95% Life, 99% Property & Casualty). However, ExamFX does not disclose the methodology behind those figures — no sample size, no time period, no definition of which students are included. JustInsurance publishes its 93% pass rate with a transparent methodology at /pass-rates: the figure represents students who completed the full course, met recommended study hours, and scored 80%+ on the practice exam three times in a row before testing. Methodology transparency is what makes a pass rate verifiable.",
    },
    {
      question: "Does ExamFX include flashcards and practice exam simulations?",
      answer:
        "ExamFX's base package includes limited practice exams (typically 2–3 static exam forms). Flashcards, AI-powered realistic exam simulations, and additional practice content are available as paid add-ons. JustInsurance includes unlimited adaptive practice exams, full flashcard decks, AI-powered realistic simulations, and audio vocabulary as part of the base $199 course — no upcharges for the features most predictive of passing.",
    },
  ];
}

export default async function CompetitorComparisonPage({
  params,
}: {
  params: Promise<{ competitor: string }>;
}) {
  const { competitor } = await params;
  const p = PROVIDERS[competitor];
  if (!p) notFound();

  const faqs = competitorFaqs(p);
  const faqSchema = generateFAQSchema(faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Compare Providers", url: "https://justinsuranceco.com/compare" },
    { name: `vs ${p.fullName}`, url: `https://justinsuranceco.com/compare/${p.slug}` },
  ]);

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Compare Providers", href: "/compare" },
          { name: `vs ${p.fullName}` },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold uppercase tracking-wide text-sm mb-3">
            Head-to-Head Comparison
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            JustInsurance vs {p.fullName}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            What&apos;s actually different — and what real students complain about.
          </p>
        </div>
      </section>

      {/* What you should know upfront */}
      <section className="bg-gold/10 border-b border-gold/30 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold-dark font-semibold uppercase tracking-wide text-xs mb-2 text-center">
            The Short Version
          </p>
          <p className="text-navy leading-relaxed text-center max-w-2xl mx-auto">
            {p.youShouldKnow}
          </p>
        </div>
      </section>

      {/* Weaknesses list */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            Where {p.fullName} Falls Short
          </h2>
          <ul className="space-y-3">
            {p.weaknesses.map((w) => (
              <li key={w} className="flex gap-3 bg-red-50 border-l-4 border-red-400 rounded-r-md p-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold mt-0.5">
                  ✗
                </span>
                <p className="text-gray-800 leading-relaxed">{w}</p>
              </li>
            ))}
          </ul>
          <p className="text-gray-500 text-sm mt-6 italic">
            Based on public product pages, published guarantee terms, and publicly available
            customer reviews as of April 2026.
          </p>
        </div>
      </section>

      {/* Comparison table — only this competitor */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Feature-by-Feature: JustInsurance vs {p.name}
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            18 comparison points across curriculum, support, guarantees, and features.
          </p>
          <ComparisonTable rows={COMPARISON_ROWS} highlightCompetitor={p.slug} />
          <p className="text-gray-500 text-xs italic text-center mt-4 max-w-3xl mx-auto">
            {PASS_RATE_FOOTNOTE}
          </p>
        </div>
      </section>

      {/* Guarantee comparison deep-dive */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            Pass Guarantee Comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gold/10 border-2 border-gold rounded-xl p-6">
              <p className="text-gold-dark font-bold uppercase tracking-wide text-xs mb-2">
                JustInsurance Pass Guarantee
              </p>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>✓ Complete recommended study hours</li>
                <li>✓ Score 80%+ on practice exam 3× in a row</li>
                <li>✓ Test within 30 days of first enrollment</li>
                <li>✓ Full course fee refund if you don&apos;t pass</li>
                <li>✓ Same terms every state, every line of authority</li>
              </ul>
            </div>
            <div className="bg-gray-bg border border-gray-200 rounded-xl p-6">
              <p className="text-gray-500 font-bold uppercase tracking-wide text-xs mb-2">
                {p.fullName} Guarantee
              </p>
              {p.slug === "examfx" ? (
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Score 80%+ on ExamFX practice exam</li>
                  <li>• <strong className="text-red-700">Test within 3 days</strong> of hitting 80%</li>
                  <li>• Most testing centers book 1–2 weeks out</li>
                  <li>• Missing the 3-day window voids the guarantee</li>
                </ul>
              ) : (
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• No universally-advertised pass guarantee</li>
                  <li>• Refund eligibility varies by package</li>
                  <li>• Refund eligibility varies by state</li>
                  <li>• Terms are not prominent on product pages</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            See Why 30,000+ Agents Chose JustInsurance
          </h2>
          <p className="text-blue-100 leading-relaxed mb-6 max-w-2xl mx-auto">
            State-approved prelicensing for all 50 states. $199 all-inclusive. Pass guarantee
            backed by published methodology. Same-day CE reporting. Live sessions 5× weekly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Find Your State
            </Link>
            <Link
              href="/compare"
              className="inline-block bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              See All Comparisons
            </Link>
          </div>
        </div>
      </section>

      <FAQAccordion faqs={faqs} heading={`JustInsurance vs ${p.fullName} FAQs`} />
    </>
  );
}
