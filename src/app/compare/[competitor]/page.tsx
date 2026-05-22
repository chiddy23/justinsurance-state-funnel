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
    description: `Direct comparison of JustInsurance and ${p.fullName} insurance prelicensing — features, pricing, guarantees, and the policy terms competitors don't always highlight.`,
    alternates: { canonical: `https://justinsuranceco.com/compare/${p.slug}` },
  };
}

function competitorFaqs(p: (typeof PROVIDERS)[string]) {
  if (p.slug === "adbanker") {
    return [
      {
        question: "What's the main difference between JustInsurance and AD Banker?",
        answer:
          "JustInsurance packages 100+ videos, unlimited adaptive practice exams, flashcards, 5× weekly live instructor sessions, AI-powered exam simulations, audio vocabulary, and white-glove licensing support into a single $199 all-inclusive course — one tier, same feature set for every student. AD Banker & Company offers multiple product tiers (self-study, live webinar, classroom) with feature inclusion and access durations that can vary by package and state. Before purchasing an AD Banker course, verify current package contents, access durations, and guarantee terms directly at adbanker.com.",
      },
      {
        question: "What does AD Banker's pass guarantee require?",
        answer:
          "AD Banker publishes its pass guarantee and refund terms on its product and policy pages, and specifics vary by package and state. Rather than paraphrase terms that can change, we encourage prospective students to read the current policy directly at adbanker.com before purchase. JustInsurance's guarantee is consistent: complete the recommended study hours, score 80%+ on the practice exam three times in a row, and sit for your first-time state exam within 30 days of first enrollment — if you don't pass, we refund your course fee in full. Same terms every state, every line of authority.",
      },
      {
        question: "Does AD Banker publish its pass rate?",
        answer:
          "AD Banker & Company does not prominently publish a specific first-attempt pass rate percentage with disclosed methodology on its public product pages. JustInsurance publishes a 93% pass rate at /pass-rates with full methodology disclosed: students who completed the full course, finished recommended study hours, and scored 80%+ on the practice exam three times in a row before testing. Methodology transparency is what lets a prospective student evaluate a pass-rate claim on equal footing. If AD Banker updates its public pages with a pass-rate figure and methodology, compare those qualifying criteria directly against the /pass-rates methodology before drawing a conclusion.",
      },
      {
        question: "What does AD Banker include vs charge extra for?",
        answer:
          "AD Banker's public product pages use tiered packaging: self-study, live webinar, and classroom options can include different combinations of video content, instructor contact, practice exams, flashcards, and extended access. Which features are included in the base package versus offered as an upgrade can vary by package tier and state — verify current inclusions at adbanker.com before purchase. JustInsurance avoids tier shopping by putting every core study feature — 100+ videos, unlimited adaptive practice exams, flashcards, 5× weekly live instructor sessions, AI-powered exam simulations, audio vocabulary, and extension options — in the base $199 price.",
      },
      {
        question: "Should I choose AD Banker or JustInsurance for my state?",
        answer:
          "If you value a single all-inclusive price with no tier decisions, live instructor sessions 5× per week included, a published 93% pass rate with disclosed methodology, and white-glove NIPR and fingerprinting support, JustInsurance is built for that student. If you have a specific preference for AD Banker's classroom format in your local market, read the current AD Banker state and course pages at adbanker.com carefully — package contents, guarantee terms, and pricing can change. Always verify current AD Banker terms before purchase.",
      },
    ];
  }
  if (p.slug === "aceable") {
    return [
      {
        question: "What's the main difference between JustInsurance and Aceable Insurance?",
        answer:
          "Aceable is primarily known for mobile-first driver-education and real-estate courses; its insurance prelicensing catalog (Aceable Insurance) markets a primarily self-paced, app-based experience. JustInsurance is an insurance-only provider with live instructor sessions 5× per week, unlimited adaptive practice exams, flashcards, AI-powered exam simulations, audio vocabulary, and white-glove NIPR and fingerprinting support — all included in a single $199 all-inclusive course. Both are legitimate providers; the JustInsurance model is built around live human instruction alongside the self-paced content. Verify current Aceable Insurance course contents at aceable.com/insurance before purchase.",
      },
      {
        question: "What does Aceable Insurance's pass guarantee require?",
        answer:
          "Aceable publishes its pass guarantee and refund policy on its product and policy pages, with specifics that can vary by course and state. We encourage prospective students to read the current policy directly at aceable.com/insurance rather than rely on paraphrased terms. JustInsurance's guarantee is consistent: complete the recommended study hours, score 80%+ on the practice exam three times in a row, and sit for your first-time state exam within 30 days of first enrollment — if you don't pass, we refund your course fee in full. Same terms every state, every line of authority.",
      },
      {
        question: "Does Aceable Insurance publish its pass rate?",
        answer:
          "Aceable Insurance publishes pass-rate claims on its product pages; any pass-rate figure is only meaningful alongside a clearly disclosed methodology (which students are counted, how the number was calculated, over what time window). Read Aceable's current figure and methodology disclosure directly at aceable.com/insurance and compare the qualifying criteria against other providers' methodologies before drawing conclusions. JustInsurance publishes a 93% pass rate at /pass-rates using a stricter, clearly disclosed inclusion bar: students who completed the full course, finished recommended study hours, and scored 80%+ on the practice exam three times in a row before testing. When two providers publish pass rates, the comparison that matters is the inclusion criteria — not the headline number.",
      },
      {
        question: "Does Aceable Insurance offer live instructor sessions?",
        answer:
          "Aceable's core product architecture is mobile-first, self-paced content; whether live instructor sessions are included in a given Aceable Insurance course can vary by state and product tier. Verify current inclusions at aceable.com/insurance before purchase. JustInsurance runs genuine live instructor sessions 5× per week (Monday through Friday) as part of the standard $199 course, consistent across all states and lines of authority. Live instruction gives students a real-time channel for complex exam concepts — policy provisions, riders, state-specific regulation nuances — that self-paced video alone can't fully cover.",
      },
      {
        question: "What does Aceable include vs charge extra for?",
        answer:
          "Aceable Insurance's public product pages list the core self-paced course content; feature inclusion (flashcards, practice exam depth, live sessions, extension windows) can vary by course and state. Read the current course-page checklist at aceable.com/insurance to see what's included in the base price versus offered as an upgrade. JustInsurance includes every core study feature — 100+ videos, unlimited adaptive practice exams, flashcards, 5× weekly live instructor sessions, AI-powered exam simulations, audio vocabulary, and extension options — in the base $199 price, with no tier upgrades for core study content.",
      },
      {
        question: "Should I pick Aceable or JustInsurance for my state?",
        answer:
          "If you want a mobile-first, primarily self-paced app experience and your state and line of authority are covered in Aceable's catalog, Aceable may suit your learning style — verify current coverage and terms at aceable.com/insurance. If you want live human instructors 5× per week, a 93% pass rate with disclosed methodology, white-glove licensing support, and an all-inclusive $199 price with no upgrade path for core features, JustInsurance is built for that student. Start on the JustInsurance homepage to see the specific course and pricing for your state and line of authority.",
      },
    ];
  }
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
          "XCEL Solutions publishes general pass-rate positioning language on its site (&quot;Trusted to Pass&quot; / &quot;9 in 10 students say XCEL helped them feel well prepared&quot;) but does not publish a specific first-attempt pass-rate percentage with disclosed methodology on its public product pages. JustInsurance publishes a 93% pass rate with full methodology disclosed at /pass-rates — specifically, students who completed the full course, met recommended study hours, and scored 80%+ on the practice exam three times in a row before testing. Methodology transparency is what makes a pass rate claim verifiable.",
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
        "ExamFX's public insurance course pages list online flashcards, on-demand video lectures, an interactive learning portal, a readiness exam, and live online training as study tools across their three published package tiers (Self-Study, Video Study, Live Online); feature inclusion varies by tier. Per ExamFX's published refund policy, course extensions, digital add-on products, and in-course purchases are non-refundable once purchased. JustInsurance includes unlimited adaptive practice exams, full flashcard decks, AI-powered simulations, and audio vocabulary in the base $199 course — one tier, no add-ons for core study content. Verify current ExamFX inclusions at examfx.com before purchase.",
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
            What&apos;s actually different — features, pricing, and the specific guarantee terms that matter.
          </p>
        </div>
      </section>

      {/* Comparison accuracy disclaimer */}
      <section className="bg-gray-50 border-b border-gray-200 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-navy">Comparison accuracy:</strong> Claims on this page reflect
            {" "}{p.fullName}&apos;s publicly available product pages, pass guarantee, refund policy,
            and FAQ documents as of May 22, 2026. Competitor terms, pricing, and features can change
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

      {/* Trade-offs list (formerly "Falls Short" — softened framing per Lanham audit 2026-05-22) */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            Trade-offs to Know About {p.fullName}
          </h2>
          <ul className="space-y-3">
            {p.weaknesses.map((w) => (
              <li key={w} className="flex gap-3 bg-gold/5 border-l-4 border-gold/60 rounded-r-md p-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center text-sm font-bold mt-0.5">
                  i
                </span>
                <p className="text-gray-800 leading-relaxed">{w}</p>
              </li>
            ))}
          </ul>
          <p className="text-gray-500 text-sm mt-6 italic">
            Claims on this page are based on {p.fullName}&apos;s publicly available product pages and
            published policy documents as of May 2026. Competitor policies and pricing can change —
            always verify current terms directly at {p.domain} before purchase.
          </p>
        </div>
      </section>

      {/* Comparison table — only for xcel/examfx (table currently supports those two columns) */}
      {(p.slug === "xcel" || p.slug === "examfx") && (
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
      )}

      {/* What JustInsurance includes — shown for competitors without a 2-column table row mapping */}
      {p.slug !== "xcel" && p.slug !== "examfx" && (
        <section className="bg-gray-bg py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
              What&apos;s Included in the JustInsurance $199 Course
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              One price. One tier. Every core study feature in the base course — no upgrade path
              for curriculum, practice exams, or live instruction.
            </p>
            <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-800">
              <li className="bg-white rounded-lg border border-gray-200 p-4">✓ 100+ video lessons covering every state exam topic</li>
              <li className="bg-white rounded-lg border border-gray-200 p-4">✓ Unlimited adaptive practice exams</li>
              <li className="bg-white rounded-lg border border-gray-200 p-4">✓ 5× weekly live instructor sessions (M–F)</li>
              <li className="bg-white rounded-lg border border-gray-200 p-4">✓ Full flashcard decks included</li>
              <li className="bg-white rounded-lg border border-gray-200 p-4">✓ AI-powered exam simulations</li>
              <li className="bg-white rounded-lg border border-gray-200 p-4">✓ Audio vocabulary lists</li>
              <li className="bg-white rounded-lg border border-gray-200 p-4">✓ Multiple course extension options</li>
              <li className="bg-white rounded-lg border border-gray-200 p-4">✓ White-glove NIPR + fingerprinting help</li>
              <li className="bg-white rounded-lg border border-gray-200 p-4">✓ Free report card review if a student fails</li>
              <li className="bg-white rounded-lg border border-gray-200 p-4">✓ 7-day support (M–F 7a–10p, Sat/Sun 8a–8p)</li>
            </ul>
            <p className="text-gray-500 text-xs italic text-center mt-6 max-w-3xl mx-auto">
              {PASS_RATE_FOOTNOTE}
            </p>
          </div>
        </section>
      )}

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
              {p.slug === "examfx" && (
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Score 80%+ on ExamFX Readiness Exam</li>
                  <li>• <strong className="text-red-700">Take state exam within 3 calendar days</strong> of Readiness Exam (vs. JustInsurance&apos;s 30 days from enrollment)</li>
                  <li>• Company-paid packages, renewals, and shipping excluded</li>
                  <li>• Verify current terms at <a href="https://www.examfx.com/pass-guarantee" target="_blank" rel="noopener noreferrer" className="underline">examfx.com/pass-guarantee</a></li>
                </ul>
              )}
              {p.slug === "xcel" && (
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Pass guarantee terms are not prominently featured on product pages</li>
                  <li>• Refund eligibility can vary by package and state</li>
                  <li>• Verify current terms at xcelsolutions.com before purchase</li>
                </ul>
              )}
              {p.slug === "adbanker" && (
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Pass guarantee terms can vary by package tier and state</li>
                  <li>• Refund eligibility specifics vary by package and state</li>
                  <li>• Verify current terms at{" "}
                    <a href="https://www.adbanker.com" target="_blank" rel="noopener noreferrer" className="underline">adbanker.com</a>{" "}
                    before purchase
                  </li>
                </ul>
              )}
              {p.slug === "aceable" && (
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Pass guarantee terms vary by course and state</li>
                  <li>• Refund eligibility specifics published on Aceable&apos;s policy pages</li>
                  <li>• Verify current terms at{" "}
                    <a href="https://www.aceable.com/insurance/" target="_blank" rel="noopener noreferrer" className="underline">aceable.com/insurance</a>{" "}
                    before purchase
                  </li>
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
            See Why 20,000+ Students Chose JustInsurance
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
