import type { Metadata } from "next";
import Link from "next/link";
import ArticleByline from "@/components/ArticleByline";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import PressLogosBar from "@/components/PressLogosBar";
import TrustBar from "@/components/TrustBar";
import { STATES, APPLICATION_BEFORE_EXAM_STATES } from "@/lib/states";
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
    "Most people get licensed in 2–6 weeks. Full-time study in a fast-issuing state like TX or FL can cut that to under 2 weeks. Courses from $199. Step-by-step timeline inside.",
  alternates: { canonical: "https://justinsuranceco.com/how-long-to-get-insurance-license" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "How Long to Get an Insurance License", url: "https://justinsuranceco.com/how-long-to-get-insurance-license" },
]);

// ---------------------------------------------------------------------------
// Facts derived from states.ts instead of hand-typed. Every figure below used
// to be written out by hand here and had drifted from the data:
//   • the application-fee range read "$30 to $200" — 8 states charge less than
//     $30 (Montana $0, Michigan and Ohio $10, Arkansas and Virginia $15,
//     Maine/South Carolina/South Dakota $25) and three charge more than $200
//     (Massachusetts $225, Illinois $215, New Hampshire $210);
//   • the exam copy told every visitor their state uses Pearson VUE or PSI —
//     six do not (MD/UT/VT/VA use Prometric, Alabama uses the University of
//     Alabama, Kentucky administers the exam itself), and no state lets a
//     candidate pick a vendor;
//   • the prelicensing card advertised approval "nationwide" while New York and
//     Washington provider approval is still PENDING in the same data.
// Deriving keeps this page in lockstep with the 50 state pages.
// ---------------------------------------------------------------------------
const ALL_STATES = Object.values(STATES);

function listAnd(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const feeByState = ALL_STATES
  .map((s) => ({ name: s.name, fee: Number(s.applicationFee) }))
  .filter((e) => Number.isFinite(e.fee));
const lowestFee = feeByState.reduce((a, b) => (b.fee < a.fee ? b : a));
const highestFee = feeByState.reduce((a, b) => (b.fee > a.fee ? b : a));
// e.g. "$0 in Montana to $225 in Massachusetts"
const APPLICATION_FEE_RANGE = `$${lowestFee.fee} in ${lowestFee.name} to $${highestFee.fee} in ${highestFee.name}`;

const PEARSON_COUNT = ALL_STATES.filter((s) => /pearson/i.test(s.examInfo.examProvider)).length;
const PSI_COUNT = ALL_STATES.filter((s) => /\bPSI\b/i.test(s.examInfo.examProvider)).length;
const PROMETRIC_STATES = ALL_STATES.filter((s) => /prometric/i.test(s.examInfo.examProvider)).map((s) => s.name);
// Alabama and Kentucky are named in prose because each is the only state with
// its provider (University of Alabama College of Continuing Studies, verified
// at training.ua.edu/insurance-testing; Kentucky DOI eServices, verified at
// insurance.ky.gov). Counts and the Prometric list are derived above.
const EXAM_VENDOR_NOTE = `Pearson VUE (${PEARSON_COUNT} states) and PSI (${PSI_COUNT}) run most state insurance exams, but not all of them: ${listAnd(PROMETRIC_STATES)} test through Prometric, Alabama through the University of Alabama College of Continuing Studies, and Kentucky through the Department of Insurance itself.`;

// Provider approval still outstanding — these states may not be advertised as approved.
const PENDING_APPROVAL_STATES = ALL_STATES
  .filter((s) => s.providerApprovalNumber === "PENDING")
  .map((s) => s.name);

// Of the four states that require the license application to be on file before
// the exam can be scheduled, these are the ones with no prelicensing mandate —
// i.e. the ones that fall inside the "other 32 states" in the FAQ below.
const APPLY_BEFORE_EXAM_NO_COURSE_STATES = APPLICATION_BEFORE_EXAM_STATES
  .filter((slug) => typeof STATES[slug].prelicensing.life.hours !== "number")
  .map((slug) => STATES[slug].name);

const faqs = [
  {
    question: "How long does it take to get an insurance license?",
    answer:
      "For most people, getting an insurance license takes 2 to 6 weeks from enrollment to an active license number. Full-time students in fast-issuing states like Texas (about 1-2 business days to issue) or Florida (2-5) can finish in under 2 weeks. Part-time candidates balancing study with work usually need 4 to 8 weeks. The four phases are prelicensing coursework, exam scheduling and sitting, fingerprinting and background check, and license application and state issuance.",
  },
  {
    question: "How fast can you get an insurance license?",
    answer:
      "The typical range is 2 to 6 weeks. The fastest realistic case is under 2 weeks, achievable with full-time study in a state that turns applications around quickly, such as Texas (about 1-2 business days) or Florida (2-5). To hit that pace: book fingerprints in week 1 so the background check runs in parallel with coursework, schedule the state exam the day you finish the course, and apply through NIPR within 24 hours of passing. The quickest states post an active license number within a couple of business days of a clean application, but others take far longer — Georgia runs about 14 business days and Arizona up to 30 — so check your own state. Most candidates, especially those studying part-time, should expect the fuller 2-to-6-week range.",
  },
  {
    question: "How long does an insurance prelicensing course take?",
    answer:
      "Where a course is required, 8 to 100 hours of study depending on the state and lines you carry, completable in a few days to about 3 weeks. Only 18 of the 50 states require prelicensing at all; where required, hours vary widely — from 8 hours per line in Georgia and a single 12-hour course in California up to 50 per line in Colorado. California requires 12 hours of Ethics and Code only (post-AB 943). Texas, Pennsylvania, Arizona, and a handful of other states have no prelicensing requirement at all. A motivated full-time student can clear a 40-hour combined Life & Health course in 5 to 7 days.",
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
      "Get fingerprinted before you finish your course, schedule your state exam the same day you complete the final chapter, and apply for your license through NIPR within 24 hours of passing. In fast-issuing states like Texas or Florida you can hold an active license within 2 to 3 weeks of enrollment if you study aggressively. Georgia is slower than its reputation — about 14 business days for issuance alone.",
  },
  {
    question: "Do I need to finish the prelicensing course before I take the exam?",
    answer:
      // "You can schedule the exam directly" was false for two of those 32:
      // North Carolina and Kansas require the license application to be on file
      // with the DOI first (APPLICATION_BEFORE_EXAM_STATES in states.ts).
      `Only in the states that mandate it — 18 of the 50 states. In those states you must complete a state-approved prelicensing course and receive a certificate of completion before you are eligible to schedule the state licensing exam, and the certificate is transmitted electronically to the state or exam vendor in most of them. In the other 32 states no course certificate is required to sit the exam — but ${listAnd(APPLY_BEFORE_EXAM_NO_COURSE_STATES)} still require you to submit your license application to the state before you can schedule it.`,
  },
  {
    question: "How long are exam results good for?",
    answer:
      // The prior copy said Florida's PRELICENSING CERTIFICATE expires 12 months
      // after course completion. Licensing sources put the Florida Course
      // Completion Certificate at FOUR years; the 12-month clock attaches to the
      // EXAM PASS, not the certificate. Owner-reviewed 2026-07-20. Certificate
      // validity is stated per state from states.ts rather than asserted here.
      "Most states require you to apply for your license within 12 months of passing the exam — miss that window and you retake the test. Certificate validity is a separate clock and varies a lot: Indiana's prelicensing certificate is good for about 6 months and Ohio's for 180 days, while Florida's course completion certificate runs far longer. Check your state's page for both windows before you plan your timeline.",
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
      "Only 18 states require prelicensing at all. Where it is required, the number of hours varies by state and line of authority. A motivated full-time student can clear a 40-hour combined Life & Health course in 5 to 7 days. Candidates studying around a job typically finish in 2 to 3 weeks. California eliminated line-specific prelicensing hours under AB 943 (effective January 2026) and now only requires a 12-hour Ethics and Code course.",
  },
  {
    num: "02",
    title: "Exam Scheduling and Sitting",
    duration: "1 – 14 days",
    body:
      `${EXAM_VENDOR_NOTE} In the Pearson VUE and PSI states, next-day availability is common in metro areas, and the online proctored options (OnVUE and PSI Bridge) often have slots within 24 hours. Rural candidates or combined Life/Health test-takers may wait 5 to 10 days for an open seat. Results are delivered on-screen at the end of the exam.`,
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
      `You submit your license application through the National Insurance Producer Registry (NIPR) at nipr.com or directly through your state's DOI portal. State application fees vary widely — from ${APPLICATION_FEE_RANGE} — and are separate from the exam fee and any NIPR transaction fee. Processing time varies widely too — from about 1–2 business days in Texas to as long as 30 days in Arizona — so check your state's page for its current figures rather than assuming same-day issuance.`,
  },
];

// The issuance and total columns were hand-written and had drifted badly from the
// data: Arizona was advertised as "real-time ... within 1 business day" against an
// applicationProcessingTime of 30 days, New York was labelled a 6-10 week batch
// state against 1-5 business days, and Georgia/Michigan were called real-time
// against 14 and 14-21 business days. Derive both from states.ts so the table can
// never contradict the state pages again. The `notes` column keeps only
// non-speed facts (portals, fingerprint vendors); every speed claim it used to
// carry was unsupported.
const TABLE_STATES: Array<{ slug: string; hours: string; notes: string }> = [
  { slug: "florida", hours: "60 hr combined 2-15", notes: "MyProfile portal; fingerprints through IdentoGO" },
  { slug: "texas", hours: "Not required (optional)", notes: "IdentoGO fingerprints; no prelicensing mandate" },
  // "Shortest prelicensing hours in the Southeast" was false: NC, SC, TN, AL,
  // VA and LA require no prelicensing at all (prelicensing.life.hours =
  // "None required (optional)" / "Not Required" in states.ts). Georgia's 8
  // hours is the shortest MANDATORY requirement, not the shortest overall.
  { slug: "georgia", hours: "8 hr per line (16 combined, post-Jun 2025)", notes: "Shortest mandatory prelicensing hours in the Southeast; NC, SC, TN, AL, VA and LA require none" },
  { slug: "california", hours: "12 hr Ethics & Code (post-AB 943)", notes: "Live Scan fingerprints; CDI manual review" },
  { slug: "new-york", hours: "20 hr per line (40 combined)", notes: "DFS producer licensing; provider approval pending" },
  { slug: "illinois", hours: "20 hr per line (40 combined)", notes: "Part of the hours must be live, attendance-verified webinar" },
  { slug: "ohio", hours: "20 hr per line (40 combined)", notes: "ODI uses Sircon for producer licensing" },
  { slug: "pennsylvania", hours: "Not required (optional)", notes: "PID producer licensing" },
  { slug: "north-carolina", hours: "Not required (optional)", notes: "Prelicensing mandate repealed (S.L. 2025-45)" },
  { slug: "arizona", hours: "Not required (optional)", notes: "DIFI; PSI testing since Sept 2025" },
  { slug: "michigan", hours: "20 hr per line (40 combined)", notes: "DIFS; per-exam passing scores (72/76/75)" },
  { slug: "washington", hours: "Not required (optional)", notes: "OIC uses PSI for testing; provider approval pending" },
];

const stateTimes = TABLE_STATES.map(({ slug, hours, notes }) => {
  const s = STATES[slug];
  return {
    state: s.name,
    hours,
    issuance: s.applicationProcessingTime,
    total: s.totalLicensingTime,
    notes,
  };
});

const weekPlan = [
  { week: "Week 1", title: "Enroll and start coursework", detail: "Register for a state-approved prelicensing course. Schedule a fingerprint appointment with IdentoGO or your state's vendor for the following week. Complete the first 40% of your course." },
  { week: "Week 2", title: "Finish coursework and get fingerprinted", detail: "Complete the remaining course modules. Attend your fingerprint appointment (about 15 minutes). Begin taking full-length practice exams under timed conditions." },
  { week: "Week 3", title: "Practice exams and schedule the state exam", detail: "Score 80% or higher on three consecutive practice exams. Schedule your state exam through your state's testing vendor — Pearson VUE (pearsonvue.com), PSI (psiexams.com), Prometric, or a state-run testing program — for the earliest available slot, typically 2 to 5 days out." },
  { week: "Week 4", title: "Sit for the state exam", detail: "Arrive 15–30 minutes early. Exam runs 2 to 2.5 hours for single-line, up to 3 hours for combined Life & Health. Results are delivered on-screen. Submit your license application through NIPR the same day you pass." },
  { week: "Weeks 5–6", title: "State review and license issuance", detail: "Turnaround is state-specific and does not follow an obvious pattern: Texas runs about 1-2 business days and New York 1-5, while Georgia takes roughly 14 business days, California and Pennsylvania 2-3 weeks, and Arizona up to 30 days. Check your state page for its current figure." },
  { week: "Weeks 6–8", title: "Carrier appointments", detail: "Once your license number is active, your appointing carriers submit their appointment paperwork through NIPR. Most appointments clear within 3 to 5 business days. You are authorized to quote and bind only after the appointment is on file." },
];

const speedTips = [
  { title: "Book fingerprints in week 1, not after the exam", body: "Fingerprint results are valid for months in most states. Getting printed early means the background check runs in parallel with your coursework instead of stacking on top of it. This alone can shave 7 to 10 days off your total timeline." },
  { title: "Schedule the state exam the day you finish the course", body: "Whichever vendor your state uses — Pearson VUE, PSI, Prometric, or a state-run testing program — open seats are commonly available within a day or two in metro areas. If you wait a week to schedule, you lose a week. Log in to your exam vendor's site the same day you get your course completion certificate." },
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
      text: "If your state requires prelicensing (18 do), enroll in a state-approved course; hours vary by state and line of authority. A motivated full-time student finishes in 5 to 7 days; part-time candidates typically need 2 to 3 weeks.",
      timeRequired: "P3W",
      url: "https://justinsuranceco.com/prelicensing",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Schedule and pass the state exam",
      text: "Book your exam through your state's testing vendor as soon as you finish coursework — Pearson VUE or PSI in most states, Prometric in Maryland, Utah, Vermont and Virginia, the University of Alabama in Alabama, and the Department of Insurance itself in Kentucky. Next-day availability is common in metro areas. Results are delivered on-screen at the end of the exam.",
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
      text: `Apply through the National Insurance Producer Registry (nipr.com) within 24 hours of passing the exam. State application fees range from ${APPLICATION_FEE_RANGE}. Turnaround varies by state — roughly 1-2 business days in Texas up to 30 days in Arizona — so confirm your state's current processing time rather than assuming same-week issuance.`,
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
            2 to 6 weeks for most candidates. Full-time students in fast-issuing states like Texas (about 1-2 business days to issue) or Florida (2-5) can finish in under 2 weeks. Part-time candidates balancing study with work usually need 4 to 8 weeks. Here is the phase-by-phase breakdown, state comparison, and a realistic calendar.
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
              For most people, getting an insurance license takes <strong>2 to 6 weeks</strong> from enrollment to an active license number. Full-time students in fast-issuing states like Texas (about 1-2 business days to issue) or Florida (2-5) can finish in under 2 weeks. Part-time candidates balancing study with work usually need 4 to 8 weeks. The range exists because four independent stages — coursework, exam, background check, and state processing — each carry their own timeline, and states handle the final step very differently.
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
            Three structural factors explain why one applicant is licensed in about two weeks while another waits far longer — Texas issues in roughly 1-2 business days and Arizona can take 30.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-navy mb-3">Issuance Speed Varies by State</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {/* Owner-confirmed 2026-07-20 that the previous "within minutes"
                    claim was wrong. It was also contradicted by our own data in
                    both directions: Arizona was listed as fastest but records the
                    longest time (30 days), and New York was listed as slow but is
                    among the quickest (1-5 business days). Figures below come from
                    states.ts applicationProcessingTime. */}
                Processing time varies widely by state, and it does not track the
                size of the state. Texas turns clean applications around in about
                1&ndash;2 business days and New York in roughly 1&ndash;5, while
                Georgia runs about 14 business days and Arizona can take up to 30
                days. Check your state&apos;s page for its current processing time
                before planning around a start date.
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
            <a href="https://www.psiexams.com/" target="_blank" rel="noopener" className="underline">PSI Exams</a> publish real-time seat availability on their candidate portals. {EXAM_VENDOR_NOTE} Check your own state page for the vendor it uses.
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
              {/* "nationwide" contradicted the NY/WA rows in the table above and
                  the data behind them (providerApprovalNumber === "PENDING"). */}
              <p className="text-gray-600 text-sm">$199 state-approved courses for Life, Health, and combined lines. {listAnd(PENDING_APPROVAL_STATES)} provider approval pending.</p>
            </Link>
            <Link href="/insurance-exam-guide" className="block bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gold transition">
              <h3 className="font-bold text-navy mb-1">Insurance Exam Guide</h3>
              <p className="text-gray-600 text-sm">Exam format, passing scores, and study strategy for your state licensing exam.</p>
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
            {/* Was "Plan on 4 to 8 weeks", which contradicted the hero, the
                short-answer callout and the first FAQ (2 to 6 weeks typical, 4
                to 8 part-time). The component budget below sums to 4-9 weeks
                only if the phases are run end to end; they overlap when
                fingerprints are booked in week 1, which is what makes the 2-6
                week typical case reachable. */}
            <p>
              Plan on 2 to 6 weeks from enrollment to license issuance, or 4 to 8 weeks if you are studying part-time. Budget 1 to 3 weeks for your state-approved prelicensing course, 1 to 2 weeks to schedule and sit for the state exam through your state&apos;s testing vendor, and 2 to 4 weeks for fingerprinting, background check, and state DOI review — phases that overlap if you book fingerprints in week 1 instead of after the exam.
            </p>
            <p>
              If you live in a state that issues quickly — Texas (about 1-2 business days), New York (1-5), Florida (2-5), Illinois (a few days) — and you push on every phase, a 14-to-21-day timeline is realistic. Slower states add real time on the back end: Ohio runs 7-10 business days, Georgia about 14, Michigan 14-21, California and Pennsylvania 2-3 weeks, and Arizona up to 30 days. Speed does not track the size of the state, so check your own state page rather than assuming.
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
        subtitle="Pick your state and enroll in a prelicensing course today. Most students go from enrollment to an active license in 2 to 6 weeks — 4 to 8 if you are studying part-time."
        ctaText="Find Your State"
        ctaHref="/"
      />
    </>
  );
}
