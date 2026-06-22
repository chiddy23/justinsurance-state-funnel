import type { Metadata } from "next";
import Link from "next/link";
import ArticleByline from "@/components/ArticleByline";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import PressLogosBar from "@/components/PressLogosBar";
import TrustBar from "@/components/TrustBar";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema, generateArticleSchemaWithReviewer } from "@/lib/schema";

// Title/meta/answer rewrite 2026-06-08 — featured-snippet capture.
// Diagnosis (GSC May 10–June 6): pos 8.5 / 1875 imp / 0 clicks. Xcel
// Solutions holds the snippet ("two and six weeks"), sitting above all
// 10 organic results. We were ranging 4-8 weeks (wider/slower than Xcel's
// 2-6, NOIS's 1-4) — Google rewards the more confident credible number.
// Title now leads with the range; meta + hero + callout all unified on
// "2 to 6 weeks" with the number in the first 8-12 words of every answer.
export const metadata: Metadata = {
  title: { absolute: "Insurance License in 2–6 Weeks: Step-by-Step Timeline" },
  description:
    "Most people get licensed in 2–6 weeks. Full-time study in FL, TX, or GA can cut that to under 2 weeks. Courses from $199. Step-by-step timeline inside.",
  alternates: { canonical: "https://justinsuranceco.com/how-long-to-get-insurance-license" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "How Long to Get an Insurance License", url: "https://justinsuranceco.com/how-long-to-get-insurance-license" },
]);

const faqs = [
  {
    question: "How long does it take to get an insurance license?",
    answer:
      "For most people, getting an insurance license takes 2 to 6 weeks from enrollment to an active license number. Full-time students in real-time-issuance states like Florida, Texas, and Georgia can finish in under 2 weeks. Part-time candidates balancing study with work usually need 4 to 8 weeks. The four phases are prelicensing coursework, exam scheduling and sitting, fingerprinting and background check, and license application and state issuance.",
  },
  {
    question: "How fast can you get an insurance license?",
    answer:
      "Under 2 weeks with full-time study in a real-time-issuance state like Florida, Texas, or Georgia. Book fingerprints in week 1 so the background check runs in parallel with coursework, schedule the state exam the day you finish the course, and apply through NIPR within 24 hours of passing. Real-time-issuance states post the active license number within 1 to 2 business days of a clean application.",
  },
  {
    question: "How long does an insurance prelicensing course take?",
    answer:
      "20 to 52 hours of study, completable in 3 days to 3 weeks depending on state and pace. Most states require 20 to 40 hours per line of authority. California requires 12 hours of Ethics and Code only (post-AB 943). Texas, Pennsylvania, Arizona, and a handful of other states have no prelicensing requirement at all. A motivated full-time student can clear a 40-hour combined Life & Health course in 5 to 7 days.",
  },
  {
    question: "How long is an insurance license good for?",
    answer:
      "Most insurance licenses are valid for 2 years from the date of issue, with biennial renewal tied to your birth month or license anniversary. Ohio runs a 2-year cycle. A handful of states use different cycles — Iowa is 3 years, Arizona is 4 years. Continuing education credits (typically 24 hours per cycle including 3 hours of ethics) must be reported to your Department of Insurance before the renewal deadline to keep the license active.",
  },
  {
    question: "How long does it take to get a life insurance license?",
    answer:
      "2 to 6 weeks for a life-only license — the same end-to-end timeline as combined Life & Health, but the exam is shorter (typically 100 questions, 2 hours, vs. 150 questions, 3 hours for combined L&H). If you plan to sell both lines, take the combined exam to save 2 to 4 weeks of duplicated coursework, fingerprinting, and application steps.",
  },
  {
    question: "What is the fastest way to get an insurance license?",
    answer:
      "Get fingerprinted before you finish your course, schedule your state exam the same day you complete the final chapter, and apply for your license through NIPR within 24 hours of passing. In real-time-issuance states like Florida, Texas, and Georgia you can hold an active license within 2 to 3 weeks of enrollment if you study aggressively.",
  },
  {
    question: "Do I need to finish the prelicensing course before I take the exam?",
    answer:
      "Yes. Nearly every state requires you to complete a state-approved prelicensing course and receive a certificate of completion before you are eligible to schedule the state licensing exam. The certificate is transmitted electronically to the state or exam vendor in most jurisdictions.",
  },
  {
    question: "How long are exam results good for?",
    answer:
      "Most states require you to apply for your license within 12 months of passing the exam. Miss that window and you have to retake the test. A few states have shorter windows — for example, Florida requires license application within 12 months and the prelicensing certificate itself expires 12 months after course completion.",
  },
  {
    question: "How long does the background check take?",
    answer:
      "Fingerprint-based background checks run by the state DOI or a vendor like IdentoGO or Fieldprint typically clear in 3 to 10 business days if you have no criminal history. Applicants with prior convictions, name changes, or out-of-state records may face a manual review that adds 2 to 6 weeks.",
  },
  {
    question: "Can I sell insurance while waiting for my license number?",
    answer:
      "No. You are not an authorized producer until your state issues an active license number and your appointing carrier adds you to their roster. Quoting, binding, or collecting premium without a license is a violation of state insurance code and can result in fines or permanent disqualification.",
  },
];

const faqSchema = generateFAQSchema(faqs);

const phases = [
  {
    num: "01",
    title: "Prelicensing Coursework",
    duration: "3 days – 3 weeks",
    body:
      "Most states require 20 to 40 hours of state-approved prelicensing instruction per line of authority. A motivated full-time student can clear a 40-hour combined Life & Health course in 5 to 7 days. Candidates studying around a job typically finish in 2 to 3 weeks. California eliminated line-specific prelicensing hours under AB 943 (effective January 2026) and now only requires a 12-hour Ethics and Code course.",
  },
  {
    num: "02",
    title: "Exam Scheduling and Sitting",
    duration: "1 – 14 days",
    body:
      "Pearson VUE and PSI both post next-day availability in most metro areas. Rural candidates or combined Life/Health test-takers may wait 5 to 10 days for an open seat. Online proctored exams through Pearson VUE OnVUE and PSI Bridge often have slots within 24 hours. Results are delivered on-screen at the end of the exam.",
  },
  {
    num: "03",
    title: "Fingerprinting and Background Check",
    duration: "Same day – 3 weeks",
    body:
      "Electronic fingerprinting through IdentoGO, Fieldprint, or a state-contracted vendor takes about 15 minutes at the appointment. Clean records clear the FBI and state criminal database check in 3 to 10 business days. Candidates with prior arrests, expungements, or out-of-state records should expect a 2 to 6 week manual review from the state DOI's licensing division.",
  },
  {
    num: "04",
    title: "License Application and State Issuance",
    duration: "Same day – 4 weeks",
    body:
      "You submit your license application through the National Insurance Producer Registry (NIPR) at nipr.com or directly through your state's DOI portal. Application fees run $30 to $200 depending on the state. Real-time-issuance states post an active license number within minutes of a clean application. Batch-processing states review applications in weekly or biweekly cycles.",
  },
];

const stateTimes = [
  { state: "Florida", hours: "60 hr combined 2-15", issuance: "Real-time via NIPR", total: "2–4 weeks", notes: "MyProfile portal + fingerprints through IdentoGO" },
  { state: "Texas", hours: "Not required (optional)", issuance: "Real-time via Sircon/NIPR", total: "2–4 weeks", notes: "IdentoGO fingerprints; no prelicensing mandate" },
  { state: "Georgia", hours: "8 hr per line (16 combined, post-Jun 2025)", issuance: "Real-time via NIPR", total: "1–2 weeks", notes: "Shortest prelicensing in the Southeast" },
  { state: "California", hours: "12 hr Ethics & Code (post-AB 943)", issuance: "Batch review", total: "4–8 weeks", notes: "Live Scan fingerprints, CDI manual review common" },
  { state: "New York", hours: "20 hr per line (40 combined)", issuance: "Batch review", total: "6–10 weeks", notes: "DFS processes applications in weekly cycles" },
  { state: "Illinois", hours: "20 hr per line (40 combined)", issuance: "Real-time via NIPR", total: "3–5 weeks", notes: "IDOI issues within 48 hours of clean app" },
  { state: "Ohio", hours: "20 hr per line (40 combined)", issuance: "Real-time via NIPR", total: "3–5 weeks", notes: "ODI uses Sircon for producer licensing" },
  { state: "Pennsylvania", hours: "Not required (optional)", issuance: "Batch review", total: "4–6 weeks", notes: "PID reviews applications weekly" },
  { state: "North Carolina", hours: "Not required (optional)", issuance: "Batch review", total: "4–7 weeks", notes: "NCDOI manual review standard" },
  { state: "Arizona", hours: "Not required (optional)", issuance: "Real-time via NIPR", total: "2–4 weeks", notes: "DIFI posts licenses within 1 business day" },
  { state: "Michigan", hours: "20 hr per line (40 combined)", issuance: "Real-time via NIPR", total: "3–5 weeks", notes: "DIFS issues quickly after clean background" },
  { state: "Washington", hours: "Not required (optional)", issuance: "Batch review", total: "4–6 weeks", notes: "OIC uses Prometric for testing" },
];

const weekPlan = [
  { week: "Week 1", title: "Enroll and start coursework", detail: "Register for a state-approved prelicensing course. Schedule a fingerprint appointment with IdentoGO or your state's vendor for the following week. Complete the first 40% of your course." },
  { week: "Week 2", title: "Finish coursework and get fingerprinted", detail: "Complete the remaining course modules. Attend your fingerprint appointment (about 15 minutes). Begin taking full-length practice exams under timed conditions." },
  { week: "Week 3", title: "Practice exams and schedule the state exam", detail: "Score 80% or higher on three consecutive practice exams. Schedule your state exam through Pearson VUE (pearsonvue.com) or PSI (psiexams.com) for the earliest available slot — typically 2 to 5 days out." },
  { week: "Week 4", title: "Sit for the state exam", detail: "Arrive 15–30 minutes early. Exam runs 2 to 2.5 hours for single-line, up to 3 hours for combined Life & Health. Results are delivered on-screen. Submit your license application through NIPR the same day you pass." },
  { week: "Weeks 5–6", title: "State review and license issuance", detail: "Real-time-issuance states post your active license number within 1 to 2 business days of submitting a clean application. Batch-processing states like California, New York, and Pennsylvania add 2 to 4 weeks of review time before posting." },
  { week: "Weeks 6–8", title: "Carrier appointments", detail: "Once your license number is active, your appointing carriers submit their appointment paperwork through NIPR. Most appointments clear within 3 to 5 business days. You are authorized to quote and bind only after the appointment is on file." },
];

const speedTips = [
  { title: "Book fingerprints in week 1, not after the exam", body: "Fingerprint results are valid for months in most states. Getting printed early means the background check runs in parallel with your coursework instead of stacking on top of it. This alone can shave 7 to 10 days off your total timeline." },
  { title: "Schedule the state exam the day you finish the course", body: "Pearson VUE and PSI both show next-day availability in most metros. If you wait a week to schedule, you lose a week. Log in to your exam vendor's site the same day you get your course completion certificate." },
  { title: "Apply through NIPR, not paper", body: "The National Insurance Producer Registry (nipr.com) transmits your application to the state DOI electronically within minutes. Paper applications in states that still accept them add 1 to 3 weeks." },
  { title: "Disclose everything on the application", body: "State DOIs run FBI, state criminal, and judgment searches. A single undisclosed misdemeanor from 15 years ago can trigger a 4 to 8 week manual review and, in some states, an outright denial. Disclose, attach documentation, and keep moving." },
  { title: "Take the combined Life & Health exam if eligible", body: "One exam appointment, one fingerprint session, one application fee. Candidates who plan to sell both lines save 2 to 4 weeks by bundling instead of sitting two separate exams." },
];

const articleSchema = generateArticleSchemaWithReviewer({
  headline: "How Long Does It Take to Get an Insurance License?",
  description:
    "Realistic timelines for getting your insurance license: prelicensing study time, exam scheduling, application processing, and fingerprinting wait. State-by-state.",
  datePublished: "2026-04-15",
  dateModified: "2026-06-08",
  url: "https://justinsuranceco.com/how-long-to-get-insurance-license",
});

// HowTo schema — mirrors the 4 phases below. Eligible for stepper rich
// results and used by Google as a content-classification signal even
// where rich results aren't rendered. ISO 8601 duration codes.
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Get an Insurance License",
  description:
    "Step-by-step guide to earning an insurance producer license in 2 to 6 weeks: prelicensing coursework, state exam, fingerprinting, and license application.",
  totalTime: "P6W",
  estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "199" },
  supply: [
    { "@type": "HowToSupply", name: "State-approved prelicensing course" },
    { "@type": "HowToSupply", name: "Government-issued photo ID" },
    { "@type": "HowToSupply", name: "Fingerprinting appointment with IdentoGO, Fieldprint, or state vendor" },
    { "@type": "HowToSupply", name: "NIPR account (nipr.com)" },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Complete prelicensing coursework",
      text: "Enroll in a state-approved prelicensing course. Most states require 20 to 40 hours of instruction per line of authority. A motivated full-time student finishes in 5 to 7 days; part-time candidates typically need 2 to 3 weeks.",
      timeRequired: "P3W",
      url: "https://justinsuranceco.com/prelicensing",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Schedule and pass the state exam",
      text: "Book your exam through Pearson VUE or PSI as soon as you finish coursework. Next-day availability is common in metro areas. Results are delivered on-screen at the end of the exam.",
      timeRequired: "P14D",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Get fingerprinted and complete background check",
      text: "Book a fingerprint appointment in week 1 so the background check runs in parallel with study. Clean records clear in 3 to 10 business days. Prior arrests or out-of-state records may add 2 to 6 weeks of manual review.",
      timeRequired: "P3W",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Submit license application via NIPR",
      text: "Apply through the National Insurance Producer Registry (nipr.com) within 24 hours of passing the exam. Fees run $30 to $200. Real-time-issuance states post an active license number within minutes; batch-review states (CA, NY, PA, NC, WA) review in weekly cycles.",
      timeRequired: "P4W",
      url: "https://nipr.com",
    },
  ],
};

// Speakable schema deferred — schema.org SpeakableSpecification is officially
// a PROPERTY of Article/WebPage, not a standalone @type. Would need to
// extend generateArticleSchemaWithReviewer to take a speakable param. Voice-
// snippet capture is also niche relative to web featured snippets — revisit
// only if voice queries become a meaningful share of GSC impressions.

export default function HowLongToGetInsuranceLicensePage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={howToSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "How Long to Get an Insurance License" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Timeline Guide
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            How Long Does It Take to Get an Insurance License?
          </h1>
          <p className="text-sm text-blue-200/80 mb-4">Updated June 2026 · Reviewed by Justin vom Eigen, Licensed Insurance Agent</p>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto mb-8">
            2 to 6 weeks for most candidates. Full-time students in real-time-issuance states like Florida, Texas, and Georgia can finish in under 2 weeks. Part-time candidates balancing study with work usually need 4 to 8 weeks. Here is the phase-by-phase breakdown, state comparison, and a realistic calendar.
          </p>
          <div className="inline-flex flex-wrap gap-3 justify-center">
            <Link href="/prelicensing" className="bg-gold text-navy font-bold px-6 py-3 rounded-lg hover:brightness-95 transition">
              See prelicensing courses
            </Link>
            <Link href="/practice-exam" className="border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
              Browse practice exams
            </Link>
          </div>
        </div>
      </section>

      <TrustBar />
      <PressLogosBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline />
      </div>

      {/* Short Answer Callout — featured-snippet bait.
          Wrapper structure preserved to avoid sequencing risk per 2026-06-08
          diagnosis. The wrapping div will be stripped in a follow-up deploy
          after Google reindexes the new wording. */}
      <section className="bg-white py-12 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gold/10 border-l-4 border-gold rounded-r-xl p-6">
            <p className="text-sm uppercase tracking-wider text-gold font-bold mb-2">The short answer</p>
            <p className="text-navy text-lg leading-relaxed">
              For most people, getting an insurance license takes <strong>2 to 6 weeks</strong> from enrollment to an active license number. Full-time students in real-time-issuance states like Florida, Texas, and Georgia can finish in under 2 weeks. Part-time candidates balancing study with work usually need 4 to 8 weeks. The range exists because four independent stages — coursework, exam, background check, and state processing — each carry their own timeline, and states handle the final step very differently.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Phases */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            The Four Phases of Getting Licensed
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Every state follows the same four-phase sequence. The duration of each phase is where states diverge.
          </p>
          <div className="space-y-4">
            {phases.map((p) => (
              <div key={p.num} className="flex gap-5 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-14 h-14 bg-navy rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold">{p.num}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-bold text-navy text-lg">{p.title}</h3>
                    <span className="text-sm font-semibold text-gold">{p.duration}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs text-center mt-6">
            Source: state-approved prelicensing hour requirements published by each state Department of Insurance and the{" "}
            <a href="https://content.naic.org/state-insurance-departments" target="_blank" rel="noopener" className="underline">NAIC state DOI directory</a>.
          </p>
        </div>
      </section>

      {/* State Comparison Table */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            State-by-State Timeline Comparison
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Twelve high-volume states, their prelicensing hour requirements, and how the state DOI processes applications.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">State</th>
                  <th className="px-4 py-3 font-semibold">Prelicensing Hours</th>
                  <th className="px-4 py-3 font-semibold">Issuance Model</th>
                  <th className="px-4 py-3 font-semibold">Total Time</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stateTimes.map((row) => (
                  <tr key={row.state} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-navy">{row.state}</td>
                    <td className="px-4 py-3 text-gray-700">{row.hours}</td>
                    <td className="px-4 py-3 text-gray-700">{row.issuance}</td>
                    <td className="px-4 py-3 text-gray-700">{row.total}</td>
                    <td className="px-4 py-3 text-gray-600">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-xs text-center mt-4">
            Data compiled from individual state Department of Insurance producer licensing pages and{" "}
            <a href="https://nipr.com" target="_blank" rel="noopener" className="underline">NIPR.com</a>. Need your specific state?{" "}
            <Link href="/" className="underline font-semibold">Pick your state from the homepage</Link>.
          </p>
        </div>
      </section>

      {/* Why States Vary */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Why Timelines Vary So Much Between States
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Three structural factors explain why one applicant in Florida is licensed in 14 days and another in New York is still waiting at day 50.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-navy mb-3">Real-Time vs Batch Issuance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Florida, Texas, Georgia, Arizona, and Ohio push license numbers through NIPR within minutes of a clean application. California, New York, and Pennsylvania queue applications for weekly or biweekly DOI review cycles, which adds 1 to 3 weeks on the back end even when your paperwork is perfect.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-navy mb-3">Fingerprinting Workflow</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                States that use a single electronic vendor (IdentoGO, Fieldprint, or state-run Live Scan) clear fingerprint results in 3 to 5 business days. States that still accept ink cards or route prints to an FBI channeler add 10 to 21 days to the background phase.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-navy mb-3">Reciprocity and Non-Resident Licensing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                If you already hold a resident license in another state, non-resident licensing through NIPR typically clears in 1 to 7 days with no exam required. The{" "}
                <a href="https://content.naic.org/industry/producer-licensing" target="_blank" rel="noopener" className="underline">NAIC Producer Licensing Model Act</a> drives this reciprocity framework across nearly nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips to Speed Up */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Five Tips to Shorten Your Timeline
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Order of operations matters. These five adjustments can cut 10 to 20 days off a typical timeline.
          </p>
          <div className="space-y-4">
            {speedTips.map((t, i) => (
              <div key={t.title} className="flex gap-5 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex-shrink-0 w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-navy font-bold text-sm">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{t.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Realistic Calendar */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            A Realistic Calendar If You Start Today
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Week-by-week schedule for a candidate starting from zero in a typical 20-to-40-hour prelicensing state.
          </p>
          <div className="space-y-3">
            {weekPlan.map((w) => (
              <div key={w.week} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <span className="bg-navy text-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{w.week}</span>
                  <h3 className="font-bold text-navy">{w.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{w.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-navy/5 border border-navy/10 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
            <strong className="text-navy">Note on exam scheduling.</strong> Both{" "}
            <a href="https://home.pearsonvue.com/insurance" target="_blank" rel="noopener" className="underline">Pearson VUE</a> and{" "}
            <a href="https://www.psiexams.com/" target="_blank" rel="noopener" className="underline">PSI Exams</a> publish real-time seat availability on their candidate portals. Check both vendors for your state — a few states use one, most use the other, and a handful let you pick.
          </div>
        </div>
      </section>

      {/* Internal link block */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            Related Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <Link href="/prelicensing" className="block bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gold transition">
              <h3 className="font-bold text-navy mb-1">Prelicensing Courses</h3>
              <p className="text-gray-600 text-sm">$199 state-approved courses for Life, Health, and combined lines nationwide.</p>
            </Link>
            <Link href="/insurance-exam-guide" className="block bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gold transition">
              <h3 className="font-bold text-navy mb-1">Insurance Exam Guide</h3>
              <p className="text-gray-600 text-sm">Exam format, passing scores, and study strategy for Pearson VUE and PSI.</p>
            </Link>
            <Link href="/practice-exam" className="block bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gold transition">
              <h3 className="font-bold text-navy mb-1">Practice Exams</h3>
              <p className="text-gray-600 text-sm">Full-length practice tests that mirror the real state exam — $59 per state.</p>
            </Link>
            <Link href="/pass-rates" className="block bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gold transition">
              <h3 className="font-bold text-navy mb-1">Pass Rate Data</h3>
              <p className="text-gray-600 text-sm">93% pass rate among students who meet recommended study metrics. See methodology.</p>
            </Link>
            <Link href="/license-renewal-guide" className="block bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gold transition">
              <h3 className="font-bold text-navy mb-1">License Renewal Guide</h3>
              <p className="text-gray-600 text-sm">Renewal cycles, CE requirements, and deadlines once you are licensed.</p>
            </Link>
            <Link href="/study-guide" className="block bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gold transition">
              <h3 className="font-bold text-navy mb-1">Study Guide</h3>
              <p className="text-gray-600 text-sm">Hour-by-hour study plan aligned to the state exam content outline.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Line */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Bottom line</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Plan on 4 to 8 weeks from enrollment to license issuance. Budget 1 to 3 weeks for your state-approved prelicensing course, 1 to 2 weeks to schedule and sit for the state exam through Pearson VUE or PSI, and 2 to 4 weeks for fingerprinting, background check, and state DOI review.
            </p>
            <p>
              If you live in a real-time-issuance state — Florida, Texas, Georgia, Arizona, Ohio, Illinois, Michigan — and you push on every phase, a 14-to-21-day timeline is realistic. If you live in California, New York, Pennsylvania, or any state that batch-processes license applications, add 2 to 4 weeks on the back end and plan accordingly.
            </p>
            <p>
              The single biggest delay most candidates create for themselves is waiting until after the exam to start fingerprinting. Book the print appointment in week 1, apply through{" "}
              <a href="https://nipr.com" target="_blank" rel="noopener" className="underline">NIPR</a> the same day you pass, and disclose every background item on the application. Do that and you will beat the median timeline in your state.
            </p>
            <p className="text-sm text-gray-500 italic pt-4 border-t border-gray-200">
              By Justin vom Eigen, Licensed Insurance Agent and Founder of JustInsurance
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion faqs={faqs} heading="Frequently Asked Questions" />

      {/* CTA */}
      <CTABanner
        title="Ready to start the clock?"
        subtitle="Pick your state and enroll in a prelicensing course today. Most students go from enrollment to an active license in 4 to 8 weeks."
        ctaText="Find Your State"
        ctaHref="/"
      />
    </>
  );
}
