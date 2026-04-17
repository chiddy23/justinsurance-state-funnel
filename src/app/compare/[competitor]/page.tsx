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
          "JustInsurance packages 100+ videos, unlimited adaptive practice exams, flashcards, 5× weekly live instructor sessions, AI-powered exam simulations, audio vocabulary, and white-glove licensing support into a single $199 all-inclusive course. XCEL Solutions describes its offering as a 3-part program (prelicensing course, prep review course, exam simulator), with access windows and feature inclusions that can vary by package tier. Always verify current XCEL package contents at xcelsolutions.com before purchase.",
      },
      {
        question: "How does XCEL Solutions' course access duration work?",
        answer:
          "XCEL Solutions publicly describes its program as having separate prelicensing and prep review phases. Exact access durations and whether those phases run continuously or on separate clocks can vary by package; verify the current policy at xcelsolutions.com before purchase. JustInsurance includes multiple extension options in its base $199 course, so you can study at your own pace without additional upgrades.",
      },
      {
        question: "Does XCEL offer live instructor sessions?",
        answer:
          "XCEL Solutions offers livestream instructor-led webinar classes (typically with camera and ID verification required) as well as on-demand recorded content. Whether live sessions are included with the base package or offered as an add-on can depend on the package tier; check xcelsolutions.com for current inclusions. JustInsurance runs live instructor sessions 5× per week as part of the standard $199 course with no package tiers.",
      },
      {
        question: "Does XCEL publish its pass rate?",
        answer:
          "XCEL Solutions markets 'top industry first-time pass rates' in its copy but does not publish a specific first-attempt pass rate figure with disclosed methodology on its public product pages. JustInsurance publishes a 93% pass rate with full methodology disclosed at /pass-rates — specifically, students who completed the full course, met recommended study hours, and scored 80%+ on the practice exam three times in a row before testing. Methodology transparency is what makes a pass rate claim verifiable.",
      },
      {
        question: "Can I get a refund from XCEL if I don't pass?",
        answer:
          "XCEL Solutions' pass guarantee and refund terms are not prominently featured on its public product pages, and specifics can vary by package and state. Always verify current terms at xcelsolutions.com before purchase. JustInsurance offers a consistent pass guarantee on every prelicensing course: if you complete the recommended study hours, score 80%+ on the practice exam three times in a row, and sit for your first-time state exam within 30 days of enrollment, we refund your course fee in full if you don't pass.",
      },
    ];
  }
  // examfx
  return [
    {
      question: "What's the main difference between JustInsurance and ExamFX?",
      answer:
        "Both are well-established providers with 50-state coverage, and both publish pass rates with disclosed methodology. The biggest practical differences are (1) ExamFX's pass guarantee requires you to take the state licensing exam within 3 calendar days of scoring 80%+ on their Readiness Exam, so candidates need to plan the testing-center sequence carefully; and (2) ExamFX's pass-rate methodology counts self-reported survey respondents broadly, while JustInsurance's published methodology applies a stricter inclusion bar (students who scored 80%+ on three consecutive practice exams before testing).",
    },
    {
      question: "What are the exact terms of ExamFX's 3-day guarantee?",
      answer:
        "Per ExamFX's published pass guarantee policy: (1) you must score 80% or higher on their Readiness Exam, (2) the Readiness Exam must be taken no more than three calendar days prior to the state licensing exam, (3) the guarantee applies to the first state licensing exam attempt, and (4) refunds exclude company-paid packages, renewals, and shipping costs. The 3-day window means candidates need to plan the sequence carefully: schedule the state exam first, then take the Readiness Exam within 3 calendar days before the scheduled state-exam date. JustInsurance's guarantee allows 30 days from first enrollment to sit for the state exam. Always verify current terms at examfx.com/pass-guarantee.",
    },
    {
      question: "How often does ExamFX run live sessions?",
      answer:
        "ExamFX offers live webinars and live online sessions as features in at least some of its packages; the exact cadence and which packages include them can vary. JustInsurance runs genuine live instructor sessions 5× per week as part of the standard $199 course — consistent across all states and lines of authority, included in the base price.",
    },
    {
      question: "Does ExamFX publish its pass rate?",
      answer:
        "Yes. ExamFX publishes line-of-authority pass rates on examfx.com/resources/candidates: 95% Life, 94% Life & Health, 90% Health, 99% Property & Casualty, 95% Personal Lines, and a 93% overall combined rate. ExamFX discloses the underlying methodology — self-reported survey responses from 2,826 learners collected between February 1, 2025 and October 17, 2025. JustInsurance publishes a 93% pass rate at /pass-rates using a stricter inclusion bar: students who completed the full course, met recommended study hours, and scored 80%+ on the practice exam three times in a row before testing. Both methodologies are disclosed; the qualifying criteria differ — ExamFX counts self-reported survey respondents broadly, while JustInsurance counts only students who hit the 3× consecutive 80%+ practice-exam bar.",
    },
    {
      question: "Does ExamFX include flashcards and practice exam simulations in the base package?",
      answer:
        "ExamFX's public insurance course pages list flashcards, videos, key facts, glossaries, and live webinars as study tools across multiple package tiers (Self-Study, Video Study, Live Online, Live In-Person); feature inclusion varies by tier. Per ExamFX's published refund policy, course extensions, digital add-on products, and in-course purchases are non-refundable once purchased. JustInsurance includes unlimited adaptive practice exams, full flashcard decks, AI-powered simulations, and audio vocabulary in the base $199 course — one tier, no add-ons for core study content.",
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

      {/* Comparison accuracy disclaimer */}
      <section className="bg-gray-50 border-b border-gray-200 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-navy">Comparison accuracy:</strong> Claims on this page reflect
            {" "}{p.fullName}&apos;s publicly available product pages, pass guarantee, refund policy,
            and FAQ documents as of April 17, 2026. Competitor terms, pricing, and features can change
            without notice. Always verify current terms directly at{" "}
            <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer" className="underline text-navy hover:text-gold">
              {p.domain}
            </a>{" "}
            before purchase.
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
            Claims on this page are based on {p.fullName}&apos;s publicly available product pages and
            published policy documents as of April 2026. Competitor policies and pricing can change —
            always verify current terms directly at {p.domain} before purchase.
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
                  <li>• Score 80%+ on ExamFX Readiness Exam</li>
                  <li>• <strong className="text-red-700">Take state exam within 3 calendar days</strong> of Readiness Exam (vs. JustInsurance&apos;s 30 days from enrollment)</li>
                  <li>• Company-paid packages, renewals, and shipping excluded</li>
                  <li>• Verify current terms at <a href="https://www.examfx.com/pass-guarantee" target="_blank" rel="noopener noreferrer" className="underline">examfx.com/pass-guarantee</a></li>
                </ul>
              ) : (
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Pass guarantee terms are not prominently featured on product pages</li>
                  <li>• Refund eligibility can vary by package and state</li>
                  <li>• Verify current terms at xcelsolutions.com before purchase</li>
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
            State-approved prelicensing nationwide. $199 all-inclusive. Pass guarantee
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
