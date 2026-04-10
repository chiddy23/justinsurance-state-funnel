import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import FAQAccordion from "@/components/FAQAccordion";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Insurance Exam Study Guide | JustInsurance" },
  description:
    "Evidence-based study guide for your insurance licensing exam. 4 goals, 4-phase plan. Students who follow this guide pass at ~91%.",
  alternates: { canonical: "https://justinsuranceco.com/study-guide" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Study Guide", url: "https://justinsuranceco.com/study-guide" },
]);

const faqs = [
  {
    question: "How many hours should I study?",
    answer:
      "At least 30 hours total. Students who hit this benchmark along with the other 3 goals pass at ~91%.",
  },
  {
    question: "What practice test score do I need?",
    answer:
      "Score 80%+ three times in a row before scheduling your exam. Consistency proves readiness.",
  },
  {
    question: "How long should I take to finish the course?",
    answer:
      "Target 10 days for single-line or 14 days for dual-line. Set a daily schedule from day one.",
  },
  {
    question: "What if I'm not hitting 80% close to my exam?",
    answer:
      "Reschedule. It's better to push your exam date than to sit unprepared.",
  },
];

const faqSchema = generateFAQSchema(faqs);

const goals = [
  {
    metric: "80%+",
    description: "Score 80% or higher on practice exams — three times in a row",
  },
  {
    metric: "30 hrs",
    description: "Complete at least 30 hours of total course study time",
  },
  {
    metric: "State Laws",
    description: "Cover all State Law content thoroughly — at least twice through",
  },
  {
    metric: "Videos",
    description: "Watch every required video in your course, start to finish",
  },
];

const phases = [
  {
    number: "1",
    title: "Build Your Foundation",
    subtitle: "Complete all course material & videos",
    items: [
      "Complete all pre-license course material and watch every video. Every video in your course is there for a reason — don't skip or rush through them.",
      "Set a daily study schedule from day one. Target your exam 10 days after enrolling for single-line or 14 days for dual-line.",
    ],
  },
  {
    number: "2",
    title: "Don't Overlook State Laws",
    subtitle: "Go through State Law modules at least twice",
    items: [
      "State laws carry real weight on the exam. Many states put heavy emphasis on state-specific regulations. The first pass builds awareness — the second is where it actually sticks.",
      "Leave time for a final State Law review before exam day. A quick refresh close to your exam date goes a long way.",
    ],
  },
  {
    number: "3",
    title: "Exam Prep & Practice Tests",
    subtitle: "Complete all exam prep material, score 80%+ three times in a row",
    items: [
      "Score 80%+ on practice exams three times in a row before scheduling. That consistency proves real readiness — not just a lucky score.",
      "Complete all of your exam prep material and review every wrong answer before moving on. Don't skip sections — gaps in prep show up on test day.",
    ],
  },
  {
    number: "4",
    title: "Exam Week — Lock It In",
    subtitle: "Final days before your exam",
    items: [
      "Postpone if you're 3 days out and not consistently hitting 80%+. It's far better to reschedule than to sit for an exam you're not ready for.",
      "Light review only in the final 2 days — State Law and weak areas only. Sleep 7-8 hours the night before and arrive at your test center 20-30 minutes early.",
    ],
  },
];

export default function StudyGuidePage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Study Guide" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-5 text-balance">
            How to Pass Your Insurance Exam
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto mb-8">
            Evidence-based strategies built from real student outcomes
          </p>
          <Link
            href="/"
            className="inline-block bg-gold text-navy font-bold px-8 py-3 rounded-lg hover:bg-gold/90 transition-colors text-base shadow-md"
          >
            Start Your Course
          </Link>
        </div>
      </section>

      {/* 4 Goals */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Your 4 Goals to Pass
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Hit all four of these benchmarks before you schedule your exam.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {goals.map((goal) => (
              <div
                key={goal.metric}
                className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center shadow-sm"
              >
                <p className="text-4xl font-extrabold text-gold mb-3">{goal.metric}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{goal.description}</p>
              </div>
            ))}
          </div>

          {/* 91% callout */}
          <div className="rounded-xl border-2 border-gold bg-gold/10 px-8 py-6 text-center">
            <p className="text-3xl font-extrabold text-navy mb-1">~91% Pass Rate</p>
            <p className="text-gray-700 font-medium">
              Students who hit all 4 goals pass at a ~91% rate
            </p>
          </div>
        </div>
      </section>

      {/* 4-Phase Study Plan */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Your 4-Phase Study Plan
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Follow these phases in order. Each one builds on the last.
          </p>
          <div className="space-y-5">
            {phases.map((phase) => (
              <div
                key={phase.number}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
                  <div className="flex-shrink-0 w-11 h-11 bg-navy rounded-full flex items-center justify-center">
                    <span className="text-gold font-extrabold text-base">{phase.number}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-lg leading-tight">{phase.title}</h3>
                    <p className="text-gold text-xs font-semibold uppercase tracking-wide mt-0.5">
                      {phase.subtitle}
                    </p>
                  </div>
                </div>
                <ul className="px-6 py-5 space-y-3">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                      <span className="text-gold font-bold flex-shrink-0 mt-0.5">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Consistency Callout */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border-l-4 border-gold bg-gold/5 px-8 py-8">
            <p className="text-gold font-bold uppercase text-xs tracking-widest mb-3">
              Study Consistency
            </p>
            <p className="text-gray-800 text-base md:text-lg leading-relaxed">
              Students who study every day — even for just 20-30 minutes — consistently outperform
              those who cram or take multi-day breaks. Make it a daily habit from day one and your
              exam prep will feel natural by the time exam day arrives.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion faqs={faqs} heading="Insurance Exam Study Guide FAQ" />

      {/* CTA Banner */}
      <CTABanner
        title="Ready to Start? Join 30,000+ Successful Students."
        subtitle="State-approved prelicensing courses built around your state's exact exam content."
        ctaText="Start Your Course"
        ctaHref="/"
      />
    </>
  );
}
