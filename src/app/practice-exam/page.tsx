import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import { generatePageMetadata } from "@/lib/metadata";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  SchemaMarkup,
} from "@/lib/schema";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import FAQAccordion from "@/components/FAQAccordion";
import StatePickerRedirect from "@/components/StatePickerRedirect";

export const metadata: Metadata = generatePageMetadata({
  pageType: "practice-exam-hub",
});

const STATES_WITH_EXAMS = Object.values(STATES)
  .filter((s) => s.practiceExams)
  .map((s) => ({ slug: s.slug, name: s.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const faqs = [
  {
    question: "What's included in the JustInsurance practice exam?",
    answer:
      "Each practice exam is a full-length set of questions modeled on your state's actual insurance licensing exam. You get instant scoring, detailed answer explanations for every question (right or wrong), and unlimited retakes for the duration of your course access. Pick Life, Health, or Life & Health depending on the license you plan to test for.",
  },
  {
    question: "How close is the practice exam to the real state exam?",
    answer:
      "Our practice exams mirror the real Pearson VUE, PSI, or Prometric state exam in format, question style, and topic weighting. The content is written by licensed insurance educators who track each state's exam content outline. Students who score 80% or higher on the practice exam three times in a row typically pass the state exam on the first attempt — that's the threshold our pass guarantee uses.",
  },
  {
    question: "Which practice exam should I buy — Life, Health, or Life + Health?",
    answer:
      "Match your practice exam to the license you plan to test for. Taking just the Life exam? Buy the Life Practice Exam. Just Health? Buy Health. Taking the combined Life & Health exam (the most common path for new agents)? Buy the Life + Health Practice Exam — it covers both lines in one sitting exactly like the real state exam.",
  },
  {
    question: "Do I need to take a prelicensing course first?",
    answer:
      "It depends on your state. Some states (like Texas) don't require prelicensing. Others require a set number of hours before you can sit for the exam. The practice exam works as standalone prep, but for best results we recommend pairing it with our full prelicensing course — which actually includes a practice exam at no extra cost. If you already have a prelicensing course elsewhere, the $59 practice exam is a targeted way to sharpen weak areas before test day.",
  },
  {
    question: "How much does the practice exam cost?",
    answer:
      "$59 per practice exam. You can buy Life, Health, or Life + Health — or purchase multiple if you're testing for more than one line. Instant access at checkout, no waiting. Course access duration depends on your state.",
  },
  {
    question: "Can I get a refund if I don't pass?",
    answer:
      "The standalone practice exam is a study tool and is not covered by the prelicensing course pass guarantee. However, our full prelicensing course — which includes a practice exam — is backed by a pass guarantee if you meet the eligibility criteria (recommended study hours, 80%+ three times in a row on the practice exam, and testing within 30 days of enrollment). If the full prep package appeals to you, see our state prelicensing courses.",
  },
];

export default function PracticeExamHubPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Practice Exams", url: "https://justinsuranceco.com/practice-exam/" },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Practice Exams" },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* Hero with state picker */}
      <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold uppercase tracking-wide text-sm mb-3">
            Insurance Practice Exams
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Pass Your Insurance Exam With Confidence
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Full-length state-specific practice exams that mirror the real Life, Health, and Life
            &amp; Health licensing exam. Pick your state below to get started — $59 per exam.
          </p>

          <StatePickerRedirect
            states={STATES_WITH_EXAMS}
            pathTemplate="/{slug}/practice-exam"
          />

          <p className="text-blue-100 text-sm mt-4">
            {STATES_WITH_EXAMS.length} states available · instant access · unlimited retakes
          </p>
        </div>
      </section>

      {/* Trust band */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">93%</p>
            <p className="text-sm text-gray-600">first-attempt pass rate</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">$59</p>
            <p className="text-sm text-gray-600">per practice exam</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">3 LOAs</p>
            <p className="text-sm text-gray-600">Life, Health, Life &amp; Health</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">{STATES_WITH_EXAMS.length}</p>
            <p className="text-sm text-gray-600">states available</p>
          </div>
        </div>
      </section>

      {/* Why practice exams work */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-4">
            Why a Practice Exam Is the Single Best Prep Investment
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            The #1 reason candidates fail is walking in unfamiliar with the test format. Our
            practice exam closes that gap.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Know what the real exam looks like",
                desc: "Same question style, same timing, same topic weighting as the real state exam. No surprises on test day.",
              },
              {
                title: "Find your weak spots fast",
                desc: "Every wrong answer comes with a full explanation. You'll know exactly which topics to re-study — no guessing.",
              },
              {
                title: "Build the 80% benchmark",
                desc: "Students who score 80%+ three times in a row on our practice exam pass the real state exam on the first attempt.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State grid — SEO + crawlable links */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-4">
            Practice Exams by State
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Click your state to see Life, Health, and Life &amp; Health practice exam options.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {STATES_WITH_EXAMS.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}/practice-exam`}
                className="bg-gray-bg hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg px-3 py-2 text-sm font-medium text-navy hover:text-gold-dark transition-colors text-center"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Prelicensing upsell */}
      <section className="bg-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Need the Full Prep Package?
          </h2>
          <p className="text-blue-100 leading-relaxed mb-6">
            Our state-approved prelicensing courses include a full-length practice exam at no extra
            cost — plus complete video lessons, readings, and quizzes. One purchase, test-ready in
            days, and backed by our pass guarantee.
          </p>
          <Link
            href="/prelicensing"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-8 rounded-lg transition-colors"
          >
            See Prelicensing Courses
          </Link>
        </div>
      </section>

      <FAQAccordion faqs={faqs} heading="Practice Exam FAQs" />
    </>
  );
}
