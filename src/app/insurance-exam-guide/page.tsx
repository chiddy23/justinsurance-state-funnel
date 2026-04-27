import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import FAQAccordion from "@/components/FAQAccordion";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import Link from "next/link";
import { STATES } from "@/lib/states";

const ALL_STATES_FOR_EXAM_GUIDE = Object.values(STATES)
  .filter((s) => s.practiceExams)
  .map((s) => ({ slug: s.slug, name: s.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const metadata: Metadata = {
  title: { absolute: "Insurance License Exam Guide 2026 — Pass Rates & Prep" },
  description:
    "Everything you need to pass your insurance license exam. State-by-state exam details, Pearson VUE and PSI prep tips, practice questions, and pass rate data.",
  alternates: { canonical: "https://justinsuranceco.com/insurance-exam-guide" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Insurance Exam Guide", url: "https://justinsuranceco.com/insurance-exam-guide" },
]);

const faqs = [
  {
    question: "How many questions are on the insurance licensing exam?",
    answer:
      "Most state insurance licensing exams contain between 100 and 150 scored questions, depending on your state and line of authority. Some states add unscored pilot questions that do not count toward your score. Check your state's candidate handbook from Pearson VUE or PSI for the exact count.",
  },
  {
    question: "What is the passing score for the insurance licensing exam?",
    answer:
      "Most states require a score of 70% to pass. A few states set the bar at 75%. The exact threshold is listed in your state's exam content outline — your JustInsurance course materials will reference the passing score for your state.",
  },
  {
    question: "Can I take the insurance licensing exam online?",
    answer:
      "Many states now allow online proctored exams through Pearson VUE OnVUE or PSI Bridge. However, some states still require in-person testing at an approved test center. Check with your state's exam provider to confirm which options are available in your state.",
  },
  {
    question: "How long is the insurance licensing exam?",
    answer:
      "Most exams have a time limit of 2 to 2.5 hours. Combined Life and Health exams may run up to 3 hours. The time limit is clearly stated in your scheduling confirmation — you will not be penalized for finishing early.",
  },
  {
    question: "When do I get my exam results?",
    answer:
      "Results are typically delivered immediately on-screen after you complete the exam at a test center, or within minutes for online proctored exams. You will receive a pass/fail result and a score report showing how you performed in each topic area.",
  },
];

const faqSchema = generateFAQSchema(faqs);

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "The Key To Passing Your Insurance Exam On The First Try",
  description: "Insurance exam prep video from the Insurance Exam Prep YouTube channel by Justin vom Eigen.",
  thumbnailUrl: `https://i.ytimg.com/vi/guiU55wnIqc/hqdefault.jpg`,
  // from src/lib/youtube-videos.json (real values, fetched 2026-04-27)
  uploadDate: "2026-01-08",
  duration: "PT10M10S",
  contentUrl: `https://www.youtube.com/watch?v=guiU55wnIqc`,
  embedUrl: `https://www.youtube-nocookie.com/embed/guiU55wnIqc`,
  publisher: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
};

const examTopics = [
  {
    exam: "Life Insurance Exam",
    topics: [
      "Types of life insurance (term, whole, universal, variable)",
      "Policy provisions, riders, and beneficiaries",
      "Annuities and retirement products",
      "Tax treatment of life insurance proceeds",
      "State insurance regulations and ethics",
    ],
  },
  {
    exam: "Health Insurance Exam",
    topics: [
      "Individual and group health plans",
      "Medicare and Medicaid basics",
      "HIPAA, COBRA, and ACA provisions",
      "Disability income and LTC coverage",
      "State-specific health regulations and ethics",
    ],
  },
  {
    exam: "Combined Life & Health Exam",
    topics: [
      "All Life exam content",
      "All Health exam content",
      "Integrated case studies across both lines",
      "State law applicable to both lines of authority",
      "Ethics requirements for dual-line agents",
    ],
  },
];

const studyTips = [
  {
    number: "01",
    title: "Complete the Full Prelicensing Course",
    body: "Your state-approved prelicensing course is built around the exact topics your exam tests. Students who finish every module — not just skim — score significantly higher. Don't skip sections you think you already know.",
  },
  {
    number: "02",
    title: "Take Practice Exams Under Real Conditions",
    body: "Simulate test-day conditions: timed, no notes, no phone. Our practice exams mirror the actual question style and topic weighting. Aim for consistent 80%+ scores before you schedule your state exam.",
  },
  {
    number: "03",
    title: "Focus on State-Specific Law",
    body: "Many candidates lose points on the state regulations section. These questions are often the difference between passing and failing. Review your state's insurance code, unfair trade practices, and producer licensing rules carefully.",
  },
  {
    number: "04",
    title: "Study in Focused Chunks",
    body: "Thirty to sixty minutes of focused study beats four-hour marathon sessions. Space your study across several days leading up to the exam. Use the days before your exam for review, not new material.",
  },
  {
    number: "05",
    title: "Join Live Study Sessions",
    body: "JustInsurance hosts live Q&A sessions where instructors walk through high-frequency exam topics and answer student questions. These sessions surface the concepts most likely to appear on your exam.",
  },
];

const testDayChecklist = [
  { item: "Government-issued photo ID (driver's license or passport)", allowed: true },
  { item: "Exam scheduling confirmation email or number", allowed: true },
  { item: "Arrive at the test center 15–30 minutes early", allowed: true },
  { item: "Notes, study guides, or textbooks", allowed: false },
  { item: "Cell phone, smartwatch, or any electronic device", allowed: false },
  { item: "Food or drink (unless medically necessary)", allowed: false },
];

export default function InsuranceExamGuidePage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={videoSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Insurance Exam Guide" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Exam Preparation
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Insurance Licensing Exam Guide
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know to pass your state insurance exam on the first attempt.
          </p>
        </div>
      </section>

      {/* What to Expect */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            What to Expect on Exam Day
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            The insurance licensing exam is a proctored, multiple-choice test administered by an approved exam vendor. Here is how it works.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-7 border border-gray-100">
              <h3 className="font-bold text-navy text-lg mb-3">Exam Format</h3>
              <ul className="space-y-2 text-gray-600 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-gold font-bold mt-0.5">—</span><span>100–150 multiple-choice questions depending on your state and line of authority</span></li>
                <li className="flex gap-2"><span className="text-gold font-bold mt-0.5">—</span><span>2 to 3 hours to complete (varies by state and exam type)</span></li>
                <li className="flex gap-2"><span className="text-gold font-bold mt-0.5">—</span><span>Passing score is typically 70% (some states require 75%)</span></li>
                <li className="flex gap-2"><span className="text-gold font-bold mt-0.5">—</span><span>Results delivered immediately upon completion</span></li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-7 border border-gray-100">
              <h3 className="font-bold text-navy text-lg mb-3">Proctoring Options</h3>
              <ul className="space-y-2 text-gray-600 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-gold font-bold mt-0.5">—</span><span><strong className="text-navy">Pearson VUE</strong> — in-person test centers or OnVUE online proctoring in most states</span></li>
                <li className="flex gap-2"><span className="text-gold font-bold mt-0.5">—</span><span><strong className="text-navy">PSI</strong> — in-person centers or PSI Bridge online proctoring in select states</span></li>
                <li className="flex gap-2"><span className="text-gold font-bold mt-0.5">—</span><span>Online exams require a webcam, microphone, and stable internet connection</span></li>
                <li className="flex gap-2"><span className="text-gold font-bold mt-0.5">—</span><span>In-person exams are available in hundreds of test centers nationwide</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Topics */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Exam Topics by Line of Authority
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            The content of your exam depends on which license you are pursuing. Here is what each exam covers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examTopics.map((et) => (
              <div key={et.exam} className="bg-white rounded-xl p-7 shadow-sm border border-gray-100">
                <h3 className="font-bold text-navy mb-4 text-base border-b border-gray-100 pb-3">
                  {et.exam}
                </h3>
                <ul className="space-y-2">
                  {et.topics.map((topic) => (
                    <li key={topic} className="flex gap-2 text-sm text-gray-600 leading-snug">
                      <span className="text-gold font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Study */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            How to Study for the Insurance Exam
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Five study strategies that separate candidates who pass on the first attempt from those who don&apos;t.
          </p>
          <div className="space-y-4">
            {studyTips.map((tip) => (
              <div key={tip.number} className="flex gap-5 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold text-xs">{tip.number}</span>
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1 text-base">{tip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Day Checklist */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Test Day Checklist
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Know exactly what to bring — and what to leave at home — before you walk into the exam.
          </p>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {testDayChecklist.map((row) => (
                <div key={row.item} className="flex items-center gap-4 px-6 py-4">
                  <div
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                      row.allowed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {row.allowed ? "✓" : "✗"}
                  </div>
                  <span className="text-sm text-gray-700 leading-snug">{row.item}</span>
                  <span
                    className={`ml-auto flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      row.allowed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {row.allowed ? "Required / Allowed" : "Not Allowed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 bg-navy/5 border border-navy/10 rounded-xl p-5">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-navy">Arrive early.</strong> Test centers lock out late arrivals. Plan to arrive at least 15 minutes before your scheduled start time. If you are taking an online proctored exam, complete the check-in process 10–15 minutes early to allow time for ID verification and system checks.
            </p>
          </div>
        </div>
      </section>

      {/* What If I Don't Pass */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            What If I Don&apos;t Pass?
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Not passing the first time is more common than you think — and it&apos;s not the end of the road.
          </p>
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 space-y-5 text-gray-700 leading-relaxed text-sm">
            <p>
              <strong className="text-navy">Retake policies vary by state.</strong> Most states allow you to reschedule your exam after a short waiting period — typically 24 hours to 14 days. Some states limit the number of attempts within a 12-month window before requiring additional steps.
            </p>
            <p>
              <strong className="text-navy">Review your score report.</strong> Your exam results include a breakdown by topic area. Use this to identify exactly where to focus your review — not just study everything again from scratch.
            </p>
            <p>
              <strong className="text-navy">Use our pass guarantee.</strong> JustInsurance students who meet the recommended study hours, score 80%+ on the practice exam three times in a row, and sit for their first-time state exam within 30 days of first enrollment are eligible for a full refund of their course fee if they don&apos;t pass. We stand behind our content.
            </p>
            <p>
              <strong className="text-navy">Most students pass on the second attempt</strong> when they take time to address the weak areas identified in their score report. The exam is passable — you just need the right preparation.
            </p>
          </div>
        </div>
      </section>

      {/* Our Pass Rate */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
            Our Pass Rate Speaks for Itself
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            JustInsurance students pass the insurance licensing exam at a 93% rate — nearly double the national average of ~55%. That gap exists because our courses are purpose-built to align with your state&apos;s exact exam content outline.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <div className="bg-navy rounded-2xl px-12 py-8 text-center shadow-lg">
              <p className="text-gold font-extrabold leading-none mb-2" style={{ fontSize: "4rem" }}>
                93%
              </p>
              <p className="text-white font-semibold text-sm">JustInsurance Pass Rate</p>
            </div>
            <div className="text-navy font-bold text-3xl hidden sm:block">vs</div>
            <div className="text-navy font-bold text-3xl sm:hidden">vs</div>
            <div className="bg-gray-100 rounded-2xl px-12 py-8 text-center shadow-md">
              <p className="text-gray-400 font-extrabold leading-none mb-2" style={{ fontSize: "4rem" }}>
                ~55%
              </p>
              <p className="text-gray-600 font-semibold text-sm">National Average</p>
            </div>
          </div>
          <Link
            href="/pass-rates"
            className="inline-block text-navy font-semibold underline underline-offset-4 hover:text-gold transition-colors"
          >
            See full pass rate data and methodology →
          </Link>
        </div>
      </section>

      <YouTubeEmbed videoId="guiU55wnIqc" title="The Key To Passing Your Insurance Exam On The First Try" />

      {/* Paid practice exams — state picker */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-gold font-semibold uppercase tracking-wide text-sm mb-2">
              Boost Your Score
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
              State-Specific Practice Exams — $59
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Full-length practice exams that mirror the real state exam. Detailed answer
              explanations, unlimited retakes. Available for all 48 states in Life, Health, and
              Life &amp; Health. Pick your state to get started.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {ALL_STATES_FOR_EXAM_GUIDE.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}/practice-exam`}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-navy hover:border-gold hover:text-gold-dark transition-colors text-center"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion faqs={faqs} heading="Insurance Exam FAQ" />

      {/* CTA */}
      <CTABanner
        title="Ready to Start Studying?"
        subtitle="Enroll in a state-approved prelicensing course today and prepare with the same content that has helped 30,000+ students earn their license."
        ctaText="Find Your State"
        ctaHref="/"
      />
    </>
  );
}
