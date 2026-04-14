import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import FAQAccordion from "@/components/FAQAccordion";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import StudyGuideStateGrid from "@/components/StudyGuideStateGrid";
import PracticeQuestionCard from "@/components/PracticeQuestionCard";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import { ALL_STATE_SLUGS } from "@/lib/states";
import studyGuideStates from "@/lib/study-guide-states.json";
import {
  LIFE_INSURANCE_TYPES,
  ANNUITY_TYPES,
  HEALTH_PLAN_TYPES,
  DISABILITY_CONCEPTS,
  LTC_CONCEPTS,
  KEY_PROVISIONS,
  GOVERNMENT_PROGRAMS,
  CORE_PRINCIPLES,
  UNFAIR_PRACTICES,
  REGULATORY_FRAMEWORK,
  GLOSSARY,
  UNIVERSAL_MNEMONICS,
  STATE_LAW_MNEMONICS,
  PRACTICE_QUESTIONS,
  SEVEN_DAY_PLAN,
  EXAM_DAY_TIPS,
  type Mnemonic,
} from "@/lib/study-guide-content";

export const metadata: Metadata = {
  title: { absolute: "Free Insurance Exam Study Guide | JustInsurance" },
  description:
    "The most comprehensive free insurance exam study guide online. Universal concepts, 50-term glossary, state-by-state breakdown, mnemonics, 10 practice questions, and a 7-day study plan.",
  alternates: { canonical: "https://justinsuranceco.com/study-guide" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Study Guide", url: "https://justinsuranceco.com/study-guide" },
]);

const faqs = [
  { question: "Is this study guide really free?", answer: "Yes — 100% free, no email required. We've put our most comprehensive exam prep resource online because a well-prepared candidate is a candidate who recommends us. Scroll through, bookmark the state section you need, and come back whenever you need a refresher." },
  { question: "How should I use this guide?", answer: "Start with Part 2 (Universal Concepts) to build your foundation. Work through Part 3 (Glossary). Jump to Part 4 (your state) for state-specific laws. Use Parts 5–9 (mnemonics, practice questions, 7-day plan, exam day tips) to sharpen and test your knowledge. The full guide can be completed in a focused week." },
  { question: "Does this guide cover my state?", answer: "Yes — all 51 jurisdictions (50 states + Washington D.C.) are covered in Part 4. Each state has a full profile: exam format, question counts, time limit, topic weights, top failure points, state-specific laws, and insider tips." },
  { question: "Is the free guide enough to pass on its own?", answer: "For some candidates, yes — especially if you already have a background in finance or insurance. For most first-time candidates, we recommend pairing this guide with a state-approved prelicensing course and a full-length practice exam. Both are available on our state pages at $199 for the course (which includes a practice exam) or $59 for just the practice exam." },
  { question: "How is this different from your paid courses?", answer: "The paid prelicensing course is the state-approved education required to sit for the exam (where your state requires it) — it includes video lessons, reading modules, chapter quizzes, and a certificate of completion. The paid practice exam is a 300+ question library built to mirror your state's exam format. This free study guide is a high-level reference and study framework. They complement each other." },
];

const faqSchema = generateFAQSchema(faqs);

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Pass Your Insurance License Exam in 7 Days",
  description: "A step-by-step 7-day study plan to prepare for any state's Life & Health insurance licensing exam.",
  totalTime: "P7D",
  step: SEVEN_DAY_PLAN.map((d) => ({
    "@type": "HowToStep",
    name: `Day ${d.day}: ${d.goal}`,
    text: `Morning: ${d.morning} Afternoon: ${d.afternoon} Evening: ${d.evening}`,
  })),
};

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "The Key To Passing Your Insurance Exam On The First Try",
  description: "Insurance exam prep video from the Insurance Exam Prep YouTube channel by Justin vom Eigen.",
  thumbnailUrl: "https://i.ytimg.com/vi/guiU55wnIqc/hqdefault.jpg",
  uploadDate: "2024-01-01",
  contentUrl: "https://www.youtube.com/watch?v=guiU55wnIqc",
  embedUrl: "https://www.youtube-nocookie.com/embed/guiU55wnIqc",
  publisher: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
};

const VALID_SLUGS = new Set(ALL_STATE_SLUGS);

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Study Guide" },
];

function MnemonicCard({ m }: { m: Mnemonic }) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <header className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gold rounded-full flex items-center justify-center text-gray-dark font-bold">
          {m.num}
        </div>
        <div>
          <h4 className="font-bold text-navy leading-tight">{m.title}</h4>
          <p className="text-sm text-gold-dark italic mt-0.5">{m.phrase}</p>
        </div>
      </header>
      <ul className="text-sm text-gray-700 space-y-1.5 pl-4">
        {m.items.map((it, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: it.replace(/\*\*(.+?)\*\*/g, "<strong class='text-navy'>$1</strong>") }} />
        ))}
      </ul>
    </article>
  );
}

function ConceptList({ title, items }: { title: string; items: { name: string; desc: string }[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <h4 className="font-bold text-navy mb-3">{title}</h4>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.name} className="text-gray-700">
            <strong className="text-navy">{item.name}</strong> — {item.desc}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeader({ part, title, subtitle }: { part: string; title: string; subtitle: string }) {
  return (
    <header className="mb-8 text-center">
      <p className="inline-block bg-gold text-gray-dark text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-3">
        {part}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </header>
  );
}

function Callout({ kind, label, children }: { kind: "tip" | "example"; label: string; children: React.ReactNode }) {
  const icon = kind === "tip" ? "🎯" : "💡";
  return (
    <div className="bg-amber-50 border-l-4 border-gold rounded-r-lg p-4 my-5 flex gap-3">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div>
        <p className="font-semibold text-navy text-sm mb-1">{label}</p>
        <p className="text-gray-700 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export default function StudyGuidePage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={howToSchema} />
      <SchemaMarkup schema={videoSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold uppercase tracking-wide text-sm mb-3">
            Free — No Email Required
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            The <em className="text-gold not-italic">Ultimate</em> Insurance Exam Study Guide
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Everything you need to pass the Life &amp; Health insurance licensing exam on your
            first try — universal concepts, state-by-state breakdowns, 10 practice questions, and
            a 7-day study plan. All 50 states covered.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#states" className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors">
              Jump to Your State
            </a>
            <a href="#plan" className="inline-block bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              See the 7-Day Plan
            </a>
          </div>
        </div>
      </section>

      {/* Top-of-page CTA: paid practice exam */}
      <section className="bg-gold/10 border-b border-gold/30 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm">
          <p className="text-navy">
            <strong>Ready for a real test?</strong> Our{" "}
            <Link href="/practice-exam" className="text-gold-dark underline hover:text-gold font-semibold">
              state-specific practice exams
            </Link>{" "}
            mirror the real licensing exam — $59 per state. Or grab the{" "}
            <Link href="/prelicensing" className="text-gold-dark underline hover:text-gold font-semibold">
              full prelicensing course
            </Link>{" "}
            (includes practice exam).
          </p>
        </div>
      </section>

      {/* Table of Contents — sticky on desktop */}
      <section className="bg-white py-12 px-4 border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-2 text-center flex items-center justify-center gap-2">
            <span>📋</span> Table of Contents
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">Jump to any section</p>
          <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: "#intro", num: 1, label: "Introduction" },
              { href: "#universal", num: 2, label: "Universal Concepts" },
              { href: "#glossary", num: 3, label: "Key Terms Glossary" },
              { href: "#states", num: 4, label: "State-by-State Breakdown" },
              { href: "#mnemonics", num: 5, label: "Mnemonics & Memory" },
              { href: "#practice", num: 6, label: "Practice Questions" },
              { href: "#plan", num: 7, label: "7-Day Study Plan" },
              { href: "#examday", num: 8, label: "Exam Day Tips" },
              { href: "#resources", num: 9, label: "Resources" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 bg-gray-bg hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg px-4 py-3 transition-colors"
              >
                <span className="flex-shrink-0 w-7 h-7 bg-gold group-hover:bg-gold-dark text-gray-dark rounded-full flex items-center justify-center text-sm font-bold transition-colors">
                  {item.num}
                </span>
                <span className="text-navy font-semibold text-sm">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Part 1: Intro */}
      <section id="intro" className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeader part="Part 1" title="Introduction" subtitle="Your first step toward passing on the first try" />
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>Let&apos;s be honest: the first time you look at an insurance exam outline, it can feel like someone handed you a phone book and said &quot;memorize this by Tuesday.&quot;</p>
            <p>You&apos;re not alone in that feeling. Thousands of people sit down to study for their insurance license every week — and many hit that same wall. Too many terms. Too many policy types. Too many state-specific rules that seem designed to trip you up.</p>
            <p>But here&apos;s what we&apos;ve learned from helping over 30,000 students prepare for their exams: <strong className="text-navy">this test is very passable.</strong> It doesn&apos;t require a law degree or a finance background. It requires smart, focused preparation — the kind that teaches you <em>why</em> concepts matter, not just what to memorize.</p>
          </div>
          <Callout kind="tip" label="📌 How to Use This Guide">
            Start with Part 2 to build your universal foundation. Work through the Part 3 glossary. Then jump directly to your state in Part 4. Use Parts 5–9 to test yourself, memorize key concepts, and prepare for exam day.
          </Callout>
          <p className="text-gray-700 leading-relaxed">
            This guide covers all 50 states for Life &amp; Health licenses, and is maintained by the team at JustInsurance — a state-approved prelicensing provider that&apos;s helped 30,000+ students earn their licenses.
          </p>
        </div>
      </section>

      {/* Part 2: Universal Concepts */}
      <section id="universal" className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader part="Part 2" title="Universal Insurance Concepts" subtitle="Life & Health concepts that apply to every state exam" />

          <h3 className="text-xl font-bold text-navy mt-8 mb-4">Types of Life Insurance</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">Life insurance pays a death benefit to your beneficiaries when you die. The exam tests every variation of how that works — focusing on the balance between cost of protection and cash value accumulation.</p>
          <ConceptList title="Life Insurance Types at a Glance" items={LIFE_INSURANCE_TYPES} />
          <Callout kind="tip" label="Insider Tip — How It's Tested">
            Variable products <strong>ALWAYS</strong> require a securities registration (FINRA Series 6 or 63). If a question describes an agent selling variable products without a securities license — the answer involving a violation is almost always correct.
          </Callout>

          <h3 className="text-xl font-bold text-navy mt-8 mb-4">Annuities</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">An annuity is the opposite of life insurance. Life insurance protects against dying too soon. An annuity protects against living too long — running out of money in retirement. You deposit money and the insurer promises to pay you a stream of income.</p>
          <ConceptList title="Annuity Types" items={ANNUITY_TYPES} />
          <Callout kind="tip" label="Insider Tip">
            Know the difference between an <strong>immediate annuity</strong> (payments start within 12 months) and a <strong>deferred annuity</strong> (payments start later). Exam questions use subtle wording to mix these up.
          </Callout>

          <h3 className="text-xl font-bold text-navy mt-8 mb-4">Health Insurance Policies</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">Health insurance covers medical expenses. The exam tests both the types of health plans and the features of each — especially how they manage cost-sharing and provider access.</p>
          <ConceptList title="Health Plan Types" items={HEALTH_PLAN_TYPES} />

          <h3 className="text-xl font-bold text-navy mt-8 mb-4">Disability Income Insurance</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">Disability income insurance replaces a portion of your income if you can&apos;t work due to illness or injury. It does <strong>NOT</strong> cover medical bills — it replaces your paycheck.</p>
          <ConceptList title="Key Disability Concepts" items={DISABILITY_CONCEPTS} />
          <Callout kind="tip" label="Insider Tip">
            The exam asks which definition of disability is more favorable to the insured. The answer is always <strong>own-occupation</strong> — the insured wins if they can&apos;t do their specific job.
          </Callout>

          <h3 className="text-xl font-bold text-navy mt-8 mb-4">Long-Term Care Insurance</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">LTC insurance pays for custodial care — help with daily activities like bathing, dressing, and eating — that Medicare and regular health insurance won&apos;t cover. It covers nursing homes, assisted living, and in-home care.</p>
          <ConceptList title="LTC Key Concepts" items={LTC_CONCEPTS} />
          <Callout kind="tip" label="Insider Tip">
            Medicare covers <em>skilled nursing care</em> (not custodial care) only briefly after a hospitalization. Medicaid covers LTC but only after asset spend-down. LTC insurance fills the gap — and the exam LOVES to test this distinction.
          </Callout>

          <h3 className="text-xl font-bold text-navy mt-8 mb-4">Policy Provisions, Clauses &amp; Riders</h3>
          <ConceptList title="Key Provisions" items={KEY_PROVISIONS} />

          <h3 className="text-xl font-bold text-navy mt-8 mb-4">Social Insurance</h3>
          <ConceptList title="Government Programs" items={GOVERNMENT_PROGRAMS} />
          <Callout kind="tip" label="Memory Trick">
            <strong>Medica<u>RE</u></strong> = <strong>RE</strong>tirement age (65+). <strong>Medica<u>ID</u></strong> = <strong>In</strong>come/<strong>A</strong>sset nee<strong>d</strong>. This simple memory trick eliminates one of the most common exam errors.
          </Callout>

          <h3 className="text-xl font-bold text-navy mt-8 mb-4">Universal Principles &amp; Regulation</h3>
          <ConceptList title="Core Principles" items={CORE_PRINCIPLES} />
          <ConceptList title="Unfair Trade Practices" items={UNFAIR_PRACTICES} />
          <ConceptList title="Regulatory Framework" items={REGULATORY_FRAMEWORK} />
        </div>
      </section>

      {/* Part 3: Glossary */}
      <section id="glossary" className="bg-gray-bg py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader part="Part 3" title="Key Terms Glossary" subtitle="50 must-know terms that appear across all state exams" />
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            These 50 terms appear on virtually every state exam. Master them and you&apos;ll
            recognize familiar language in almost every question. Terms marked{" "}
            <span className="inline-block bg-gold/20 text-gold-dark text-xs font-bold px-2 py-0.5 rounded">L&amp;H</span>{" "}
            are especially important for Life &amp; Health exams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GLOSSARY.map((t) => (
              <div key={t.name} className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="font-bold text-navy mb-1 flex items-center gap-2">
                  {t.name}
                  {t.lh && <span className="bg-gold/20 text-gold-dark text-xs font-bold px-2 py-0.5 rounded">L&amp;H</span>}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{t.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Part 4: State-by-State */}
      <section id="states" className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader part="Part 4" title="State-by-State Exam Breakdown" subtitle="Every state's exam format, topic weights, top failure points, and insider tips" />
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Search for your state below. Each card includes the exam administrator, question
            counts, passing score, prelicensing hours, retake rules, and a one-paragraph state
            law summary.
          </p>
          <StudyGuideStateGrid states={studyGuideStates} validSlugs={VALID_SLUGS} />
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="bg-navy py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Practice What You&apos;ve Learned?
          </h2>
          <p className="text-blue-100 leading-relaxed mb-6">
            Our state-specific practice exams mirror the real state exam format — Life, Health, or
            Life &amp; Health. $59 each, instant access, unlimited retakes.
          </p>
          <Link href="/practice-exam" className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-8 rounded-lg transition-colors">
            See Practice Exams by State
          </Link>
        </div>
      </section>

      {/* Part 5: Mnemonics */}
      <section id="mnemonics" className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionHeader part="Part 5" title="Mnemonics & Memory Tricks" subtitle="10 universal mnemonics + 5 state-law heavy mnemonics" />
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Use these mnemonics, adapt them, make them your own. The best mnemonic is the one that
            sticks in YOUR brain — even the slightly ridiculous ones.
          </p>

          <h3 className="text-xl font-bold text-navy mb-5">Universal Concept Mnemonics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {UNIVERSAL_MNEMONICS.map((m) => <MnemonicCard key={m.num} m={m} />)}
          </div>

          <h3 className="text-xl font-bold text-navy mb-5">State-Law Heavy Topic Mnemonics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STATE_LAW_MNEMONICS.map((m) => <MnemonicCard key={m.num} m={m} />)}
          </div>
        </div>
      </section>

      {/* Part 6: Practice Questions */}
      <section id="practice" className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader part="Part 6" title="Practice Question Teaser" subtitle="10 exam-style questions — try them before revealing the answers" />
          <div className="space-y-5">
            {PRACTICE_QUESTIONS.map((q) => (
              <PracticeQuestionCard key={q.id} q={q} />
            ))}
          </div>

          <div className="bg-navy rounded-2xl p-8 text-center text-white mt-10">
            <h3 className="text-2xl font-bold mb-3">📚 Full Practice Exam Library — 300+ Questions</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              These 10 are just a sample. Our full practice exam library contains 300+ questions
              built to mirror your state&apos;s real format — with detailed explanations for every one.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/practice-exam" className="bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors">
                Access Practice Exams — $59
              </Link>
              <Link href="/prelicensing" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Start Prelicensing Course
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Part 7: 7-Day Plan */}
      <section id="plan" className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader part="Part 7" title="The 7-Day Exam Prep Plan" subtitle="A universal study schedule that works for every state" />
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            You don&apos;t need months to prepare. With a focused, structured approach, 7 days is
            enough to go from blank slate to ready to pass.
          </p>
          <div className="space-y-5">
            {SEVEN_DAY_PLAN.map((d) => (
              <article key={d.day} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <header className="bg-navy text-white px-5 py-3 flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold text-gray-dark rounded-full flex items-center justify-center font-bold">
                    {d.day}
                  </div>
                  <h3 className="font-bold m-0 text-white">Day {d.day}: {d.goal}</h3>
                </header>
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Morning", text: d.morning },
                    { label: "Afternoon", text: d.afternoon },
                    { label: "Evening", text: d.evening },
                  ].map((p) => (
                    <div key={p.label}>
                      <p className="text-xs uppercase tracking-wide text-gold-dark font-bold mb-1">{p.label}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{p.text}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Part 8: Exam Day Tips */}
      <section id="examday" className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <SectionHeader part="Part 8" title="Exam Day Tips" subtitle="10 practical, confidence-building strategies for the day that counts" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EXAM_DAY_TIPS.map((t) => (
              <article key={t.num} className="bg-gray-bg rounded-xl border border-gray-200 p-5">
                <header className="flex items-start gap-3 mb-2">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold rounded-full flex items-center justify-center text-gray-dark font-bold text-sm">
                    {t.num}
                  </div>
                  <h3 className="font-bold text-navy leading-tight">{t.title}</h3>
                </header>
                <p className="text-sm text-gray-700 leading-relaxed">{t.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube video */}
      <YouTubeEmbed videoId="guiU55wnIqc" title="The Key To Passing Your Insurance Exam On The First Try" />

      {/* Part 9: Resources */}
      <section id="resources" className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeader part="Part 9" title="Closing & Resources" subtitle="You've done the work. Now finish strong." />
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>You made it to the end of this guide. That says something about you.</p>
            <p>Most people skim. Most people look for shortcuts. You just worked through the most comprehensive free insurance exam resource available anywhere — and that kind of commitment is exactly what separates first-time passers from students who struggle.</p>
            <p>Here&apos;s the truth: <strong className="text-navy">the insurance exam is not designed to trick brilliant people.</strong> It&apos;s designed to screen out people who didn&apos;t prepare. You&apos;ve prepared. Now finish strong.</p>
          </div>
          <div className="bg-navy rounded-2xl p-8 text-center text-white mt-8">
            <h3 className="text-2xl font-bold mb-3">🎯 Your Two Best Tools for Final Exam Prep</h3>
            <p className="text-blue-100 mb-6">
              The single biggest predictor of first-time passing is how many practice questions
              you&apos;ve done. Pair this guide with a state-specific practice exam (or the full
              prelicensing course if you haven&apos;t started yet) and you&apos;ll walk in confident.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/practice-exam" className="bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors">
                📋 Practice Exams — $59
              </Link>
              <Link href="/prelicensing" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                🎓 Prelicensing Course
              </Link>
              <a href="https://www.youtube.com/@InsuranceExam" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                ▶ YouTube Channel
              </a>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion faqs={faqs} heading="Study Guide FAQs" />
    </>
  );
}
