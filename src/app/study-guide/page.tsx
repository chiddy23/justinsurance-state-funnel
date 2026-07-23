import type { Metadata } from "next";
import Link from "next/link";
import ArticleByline from "@/components/ArticleByline";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import FAQAccordion from "@/components/FAQAccordion";
import PressLogosBar from "@/components/PressLogosBar";
import TrustBar from "@/components/TrustBar";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import StudyGuideStateGrid from "@/components/StudyGuideStateGrid";
import PracticeQuestionCard from "@/components/PracticeQuestionCard";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema, generateArticleSchemaWithReviewer } from "@/lib/schema";
import { ALL_STATE_SLUGS, STATES, type StateData } from "@/lib/states";
import { credentialKindFromHours, stateClaims } from "@/lib/prelicensing-status";
import { formatPassingScore } from "@/lib/exam-score";
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
  title: { absolute: "Free Insurance Exam Study Guide + 7-Day Plan" },
  description:
    "Free insurance exam study guide — universal concepts, 50-term glossary, state-by-state breakdown, mnemonics, practice questions, and a 7-day plan.",
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

// Video metadata fetched from YouTube watch page meta tags (itemprop="datePublished" / "duration")
// on 2026-04-27. Source: https://www.youtube.com/watch?v=guiU55wnIqc
const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "The Key To Passing Your Insurance Exam On The First Try",
  description: "Insurance exam prep video from the Insurance Exam Prep YouTube channel by Justin vom Eigen.",
  thumbnailUrl: "https://i.ytimg.com/vi/guiU55wnIqc/hqdefault.jpg",
  uploadDate: "2026-01-08",
  duration: "PT10M10S",
  contentUrl: "https://www.youtube.com/watch?v=guiU55wnIqc",
  embedUrl: "https://www.youtube-nocookie.com/embed/guiU55wnIqc",
  publisher: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
};

const VALID_SLUGS = new Set(ALL_STATE_SLUGS);

// This is a NATIONAL page, so an unqualified "state-approved prelicensing
// provider" would assert a credential in states that do not issue one. A state
// prelicensing-provider approval only exists where prelicensing is MANDATED, and
// only counts once our approval has actually issued — exactly what
// stateClaims().canClaimPrelicensingApproval encodes (elsewhere the credential is
// a continuing-education approval). Derived from STATES so the number can never
// drift from src/lib/states.ts.
const PRELICENSING_APPROVED_COUNT = Object.values(STATES).filter(
  (s) => stateClaims(s).canClaimPrelicensingApproval,
).length;

// The companion figure. The page previously said we were a state-approved CE
// provider "elsewhere" — an unbounded claim covering every jurisdiction this
// guide names (51, D.C. included). states.ts records 50 states and no D.C. row,
// and two of those 50 carry providerApprovalNumber: "PENDING", so "elsewhere"
// asserted a credential we do not hold in three of them. Publish the number of
// approvals we actually hold outside the prelicensing states, and name the
// pending ones, instead of an "everywhere else" claim.
const CE_APPROVED_ELSEWHERE_COUNT = Object.values(STATES).filter((s) => {
  const c = stateClaims(s);
  return c.canClaimCeApproval && !c.canClaimPrelicensingApproval;
}).length;

// "Washington" alone is ambiguous on a page whose state list also contains
// Washington D.C., so the state is spelled out.
const PENDING_APPROVAL_STATES = Object.values(STATES)
  .filter((s) => stateClaims(s).approvalPending)
  .map((s) => (s.name === "Washington" ? "Washington State" : s.name));

const formatList = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : items.length === 2
      ? `${items[0]} and ${items[1]}`
      : `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;

// ─────────────────────────────────────────────────────────────────────────────
// Part 4 state table — exam provider and prelicensing hours are DERIVED AT BUILD
// TIME from STATES (src/lib/states.ts), the single source of truth.
//
// study-guide-states.json is a hand-authored file that had drifted badly from
// states.ts (34 wrong exam providers, 32 states carrying an invented
// prelicensing-hour mandate). Because this page publishes a named-expert review
// attestation, those figures are never read from the JSON any more. The JSON is
// still the source for the fields states.ts does not carry (question count, time
// limit, passing score, topic weights, retake policy, application note, common
// failure points, and the law/tip prose).
// ─────────────────────────────────────────────────────────────────────────────

type StudyGuideState = (typeof studyGuideStates)[number];

const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

/**
 * states.ts stores some providers with a trailing qualifier — e.g.
 * "PSI (effective September 3, 2025)" or "Kentucky Department of Insurance
 * (administered directly at ~15 state testing sites; …)". The compact stat tile
 * shows the provider name only; the parenthetical is dropped for layout, never
 * for meaning (the remaining name is the provider in force today).
 */
const shortProvider = (provider: string) => provider.replace(/\s*\([^)]*\)\s*$/, "").trim();

const hoursLabel = (v: number | string) => (typeof v === "number" ? `${v} hrs` : String(v));

/**
 * Honest prelicensing label. If no line carries numeric hours the state does not
 * mandate prelicensing at all (credentialKindFromHours → "ce") and we say
 * "Not required" rather than printing a number the state does not require.
 * Handles per-line splits (20/20/40), single-course states (CA 12/12/12 under
 * AB 943), fully distinct lines (FL 30/40/60), and non-numeric combined values
 * (WI lifeAndHealth = "no combined license").
 */
function formatPrelicensingHours(pre: StateData["prelicensing"]): string {
  const life = pre.life.hours;
  const health = pre.health.hours;
  const both = pre.lifeAndHealth.hours;

  if (credentialKindFromHours([life, health, both]) === "ce") return "Not required";

  if (typeof life === "number" && life === health) {
    if (both === life) return `${life} hours`;
    return typeof both === "number"
      ? `${life} hrs per line · ${both} hrs Life & Health`
      : `${life} hrs per line · ${both}`;
  }
  return `Life ${hoursLabel(life)} · Health ${hoursLabel(health)} · L&H ${hoursLabel(both)}`;
}

// A number tied to a prelicensing claim ("20-hour pre-licensing course",
// "40 hours of pre-licensing education"). Deliberately narrow: it must NOT match
// exam time limits, retake waits, CE hours, or separate product-training
// mandates such as Nevada's 8-hour senior annuity suitability course.
const PRELICENSING_HOURS_CLAIM =
  /\d+[-–\s]*hours?\b[^.]{0,40}?pre-?licens|pre-?licens[^.]{0,40}?\b\d+[-–\s]*hours?/i;

const VENDOR_NAMES = ["Pearson VUE", "Prometric", "PSI"];

/**
 * True when hand-authored prose asserts something states.ts contradicts: an
 * hours mandate in a state that requires no prelicensing, or a testing vendor
 * that is not the state's provider. Such prose is withheld (never rewritten from
 * memory — the original text stays in study-guide-states.json for re-authoring).
 */
function contradictsStateFacts(text: string, facts: StateData): boolean {
  const kind = credentialKindFromHours([
    facts.prelicensing.life.hours,
    facts.prelicensing.health.hours,
    facts.prelicensing.lifeAndHealth.hours,
  ]);
  if (kind === "ce" && PRELICENSING_HOURS_CLAIM.test(text)) return true;
  return VENDOR_NAMES.some(
    (v) => new RegExp(`\\b${v}\\b`).test(text) && !facts.examInfo.examProvider.includes(v),
  );
}

/**
 * One-line retake summary built from states.ts, replacing the JSON's generic
 * "24-hour wait; unlimited". Prefers the explicit cap sentence when the state
 * records one, because "unlimited" is the specific claim that was wrong.
 */
function retakeSummary(facts: StateData): string {
  const limit = (facts.examInfo.retakeLimitInfo || "").trim();
  const wait = (facts.examInfo.retakeWaitingPeriod || "").trim();
  if (limit) {
    // Trim to the first sentence so the table cell stays readable.
    const first = limit.split(/(?<=\.)\s/)[0];
    return first.length > 180 ? first.slice(0, 177) + "..." : first;
  }
  if (wait) return `Retake after ${wait}`.slice(0, 180);
  return "See your state page for retake rules";
}

// ─────────────────────────────────────────────────────────────────────────────
// Vendor-verified corrections to the fields states.ts cannot supply.
//
// study-guide-states.json hard-codes questions: 150 for 50 of the 51 rows (160
// for Florida) and a 2.5-hour or 3-hour time limit for every row, and states.ts
// carries neither a question-count nor a time-limit field — so the derivation
// below cannot catch a wrong count. Washington D.C. has no states.ts record at
// all, so NOTHING is derived for it and every one of its values is
// hand-authored. Each row here was verified against the exam vendor's or the
// state's own current publication, cited inline.
//
// OPEN: the remaining rows still carry the hand-authored 150 / 2.5-3 hours. Two
// have since been confirmed accurate and need no correction — California (CDI's
// own "Examinations: Time Limit and Number of Questions" table: Life, Accident &
// Health or Sickness, 150 questions, 3 hours) and Texas (below) — but the rest
// are unverified, and 15 states carry noCombinedExam: true in states.ts, where a
// single question count and time limit cannot describe two separate exams.
// ─────────────────────────────────────────────────────────────────────────────
const ROW_CORRECTIONS: Record<string, Partial<StudyGuideState>> = {
  // Florida DFS / Pearson VUE, Florida Insurance Examination Content Outlines
  // #121003 (eff. 01/01/2026), "Florida Agent's Health & Life (including
  // Annuities & Variable Contracts)" — the 2-15:
  //  • "150 scored questions plus 15 pretest questions" = 165 items. The row
  //    said 160, states.ts records "approximately 150" (that is the SCORED
  //    count). This page counts total items presented, the same convention as
  //    the Texas and D.C. rows below, so the corrected figure is 165.
  //  • "Time limit: 2.75 hours" — 2 hours 45 minutes, confirmed independently by
  //    the Pearson VUE Florida Insurance Licensing Candidate Handbook #121000
  //    back cover ("InsFL-LHA05 … 2 hours, 45 minutes"). The row said 2.5 hours.
  //  • Weights, verbatim from the outline: general knowledge 10 + 10 + 8 + 5
  //    (life) + 11 + 10 + 4 + 4 (health) + 5 (field underwriting) = 67%; Florida
  //    statutes 13% common to all lines + 10% including variable products + 10%
  //    pertinent to health insurance = 33%. The row's "FL Laws 27%" understated
  //    the state-law load by six points.
  //  • Handbook, Score Reporting: "The passing score for all examinations is
  //    70%. This score is computed by dividing the number of questions answered
  //    correctly by the total number of examination questions." Raw percentage,
  //    which is what the derived `pass` already renders — left alone.
  //  • The row's failure points listed Florida No-Fault/PIP auto insurance and
  //    Citizens Property Insurance Corporation. Neither appears anywhere in the
  //    2-15 outline — both are General Lines (2-20) property-casualty topics —
  //    so they are replaced with the outline's own heaviest blocks.
  //  • "Florida has a 40-hour pre-licensing requirement" was a blanket claim.
  //    states.ts records 30 hours (life), 40 (health) and 60 (combined), which
  //    is what the card's own Pre-Licensing field displays.
  Florida: {
    questions: 165,
    time: "2 hours 45 minutes",
    topics: [
      "Life general knowledge 33%",
      "Health general knowledge 29%",
      "Field underwriting 5%",
      "FL law — all lines 13%",
      "FL law — life & variable products 10%",
      "FL law — health insurance 10%",
    ],
    fails: [
      "Florida law is the heaviest single block on the 2-15 — 33% of the scored questions, split into an all-lines section (13%), a life and variable products section (10%), and a health insurance section (10%).",
      "Variable contracts, which Florida tests twice over: inside the life product sections and again in the 10% Florida-law block that covers variable products.",
      "The health half of the exam, which carries the same weight as the life half — types of health policies (11%) plus health policy provisions, clauses and riders (10%).",
    ],
    law: "Florida sets prelicensing hours by line: 30 hours for the 2-14 Life (including Annuities & Variable Contracts) license, 40 hours for the 2-40 Health license, and 60 hours for the combined 2-15 Health & Life license. State law is also the heaviest part of the 2-15 exam — Florida statutes, rules and regulations account for 33% of the scored questions across three separate blocks (all lines, life and variable products, and health insurance).",
    tip: "The Florida 2-15 Health & Life exam is 165 questions — 150 scored plus 15 unscored pretest questions mixed in among them — with a 2-hour, 45-minute limit. Passing is 70%, computed as the number of questions you answer correctly divided by the total number of questions on the exam. Every Florida licensing exam is taken in person at a Pearson VUE test center; Florida discontinued remote proctoring on February 16, 2024.",
  },

  // Pearson VUE, Texas Insurance Content Outlines #124401 (eff. 12/01/2025):
  // "LIFE AND HEALTH-GENERAL KNOWLEDGE … (100 scoreable questions plus 10
  // pretest questions)" + "LIFE and HEALTH AGENT STATE SPECIFIC … (30 scoreable
  // questions plus 5 pretest questions)" = 145 items, 130 of them scored.
  // The 2.5-hour (150-minute) limit in the row is correct and is left alone.
  Texas: { questions: 145 },

  // Pearson VUE, District of Columbia Insurance Licensing Candidate Handbook
  // #120900 and DC Insurance Content Outlines #120901 (eff. 09/02/2025):
  //  • "All examinations are now offered individually. Combination examinations
  //    are no longer available." D.C. has no combined Life & Health exam, so the
  //    single-exam framing is carried by the tip below.
  //  • Life = (50 + 5 general) + (30 + 5 D.C.-specific) = 90 items, 80 scored.
  //    Accident & Health = (50 + 5) + (25 + 5) = 85 items, 75 scored.
  //  • Back cover "AVAILABLE EXAMINATIONS": Life 2 hours, Health 2 hours — not
  //    the 2.5 hours the JSON applied to every row.
  //  • "REQUIRED SCALED PASSING SCORES — Producer 70" is a SCALED cut, not a
  //    percentage of questions answered correctly.
  //  • "A mandatory course of at least forty (40) hours of Pre-Licensing is not
  //    mandated by the Commissioner of Insurance for the District of Columbia";
  //    candidates show proof of a course of study, with no hour mandate. The
  //    previous "20 hours" was hand-authored and no source supports it.
  //  • The handbook sets a 24-hour wait before rebooking and states no attempt
  //    cap either way, so the unsupported "unlimited" claim is dropped.
  "Washington D.C.": {
    questions: 90,
    time: "2 hours per exam",
    pass: "70 (scaled score)",
    hours: "No hour mandate — proof of a course of study",
    retake: "Must wait 24 hours before booking a retake",
    tip: "D.C. gives every line its own exam — combination examinations are no longer offered — so a Life & Health candidate sits two separate tests. Life is 90 questions (80 scored) in 2 hours; Accident & Health is 85 questions (75 scored) in 2 hours. Both are graded against a scaled 70. Pearson VUE test centers serving D.C. include three in the District plus sites in Vienna, VA and Baltimore, MD.",
  },
};

const tableStates: StudyGuideState[] = studyGuideStates.map((row) => {
  const facts: StateData | undefined = STATES[toSlug(row.name)];
  const correction = ROW_CORRECTIONS[row.name] ?? {};

  // Washington D.C. has no row in states.ts, so nothing can be derived for it —
  // only the vendor-verified corrections above are applied.
  if (!facts) return { ...row, ...correction };

  const admin = shortProvider(facts.examInfo.examProvider);
  return {
    ...row,
    admin,
    hours: formatPrelicensingHours(facts.prelicensing),
    // The JSON hard-coded "70%" for all 51 rows. That is wrong outright for four
    // states (CA 60, MI 72, MS 65, MT 75) and, for the 17 scaled-score states,
    // renders a scaled cut as a raw percentage of questions answered correctly.
    // Derive it from the same helper the state pages use so this table cannot
    // drift again — exactly like admin/hours above.
    pass: formatPassingScore(toSlug(row.name), facts.examInfo.passingScore),
    // The JSON carried five generic retake strings across all 51 rows — mostly
    // "24-hour wait; unlimited" — which is wrong for at least a dozen states that
    // states.ts records as capped or escalating: Arizona (4 attempts / 12 months),
    // Florida (5), New Mexico (4 + 6-month lockout), South Carolina (6), West
    // Virginia (8), Alabama (90/180-day escalations), Kansas (6-month wait after
    // the 3rd), Oklahoma (30-day), Tennessee (10/30-day), Georgia (14/60-day).
    // Telling a candidate retakes are unlimited when their state locks them out is
    // a material error, so derive it from the same source the state pages use.
    retake: retakeSummary(facts),
    law: contradictsStateFacts(row.law, facts)
      ? `We're re-verifying our ${row.name} law summary against primary sources. The current, source-verified ${row.name} requirements are on the ${row.name} state page linked below.`
      : row.law,
    tip: contradictsStateFacts(row.tip, facts)
      ? `Exam-day logistics for ${row.name} — test-center options and on-screen tools — are confirmed by ${admin} when you schedule.`
      : row.tip,
    // Vendor-verified overrides last: they correct fields states.ts cannot supply.
    ...correction,
  };
});

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
          <p className="text-sm text-gold-deep italic mt-0.5">{m.phrase}</p>
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

const articleSchema = generateArticleSchemaWithReviewer({
  headline: "The Ultimate Insurance Exam Study Guide",
  description:
    "A free Life & Health insurance exam study framework — universal concepts, state-by-state breakdowns, practice questions, and a 7-day study plan.",
  datePublished: "2026-04-15",
  url: "https://justinsuranceco.com/study-guide",
});

export default function StudyGuidePage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={articleSchema} />
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
            A free, comprehensive Life &amp; Health exam study framework — universal concepts,
            state-by-state breakdowns, 10 practice questions, and a 7-day study plan.
            Nationwide coverage.
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

      <TrustBar />
      <PressLogosBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline />
      </div>

      {/* Top-of-page CTA: paid practice exam */}
      <section className="bg-gold/10 border-b border-gold/30 py-6 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm">
          <p className="text-navy">
            <strong>Ready for a real test?</strong> Our{" "}
            <Link href="/practice-exam" className="text-gold-deep underline hover:text-gold font-semibold">
              state-specific practice exams
            </Link>{" "}
            mirror the real licensing exam — $59 per state. Or grab the{" "}
            <Link href="/prelicensing" className="text-gold-deep underline hover:text-gold font-semibold">
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
            <p>But here&apos;s what we&apos;ve learned from helping over 20,000 students prepare for their exams: <strong className="text-navy">this test is very passable.</strong> It doesn&apos;t require a law degree or a finance background. It requires smart, focused preparation — the kind that teaches you <em>why</em> concepts matter, not just what to memorize.</p>
          </div>
          <Callout kind="tip" label="📌 How to Use This Guide">
            Start with Part 2 to build your universal foundation. Work through the Part 3 glossary. Then jump directly to your state in Part 4. Use Parts 5–9 to test yourself, memorize key concepts, and prepare for exam day.
          </Callout>
          <p className="text-gray-700 leading-relaxed">
            This guide covers all 51 jurisdictions for Life &amp; Health licenses, and is maintained by the team at JustInsurance — a state-approved prelicensing provider in the {PRELICENSING_APPROVED_COUNT} states where prelicensing education is mandated and our approval has issued, and a state-approved continuing-education provider in {CE_APPROVED_ELSEWHERE_COUNT} more states. Our provider approvals in {formatList(PENDING_APPROVAL_STATES)} are still pending. We&apos;ve helped 20,000+ students earn their licenses.
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
            Variable products <strong>ALWAYS</strong> require a FINRA securities registration on top of the insurance license — the Series 6 or Series 7, taken after the SIE and held through a member broker-dealer. Most states also require the Series 63 as a state securities registration, but a Series 63 by itself never authorizes variable product sales. If a question describes an agent selling variable products without a securities license — the answer involving a violation is almost always correct.
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
            <span className="inline-block bg-gold/20 text-gold-deep text-xs font-bold px-2 py-0.5 rounded">L&amp;H</span>{" "}
            are especially important for Life &amp; Health exams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GLOSSARY.map((t) => (
              <div key={t.name} className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="font-bold text-navy mb-1 flex items-center gap-2">
                  {t.name}
                  {t.lh && <span className="bg-gold/20 text-gold-deep text-xs font-bold px-2 py-0.5 rounded">L&amp;H</span>}
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
          <StudyGuideStateGrid states={tableStates} validSlugs={VALID_SLUGS} />
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
                      <p className="text-xs uppercase tracking-wide text-gold-deep font-bold mb-1">{p.label}</p>
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
      <YouTubeEmbed videoId="dPSl3nJrXIs" title="30 Life Insurance Exam Terms in 30 Minutes (Simple Definitions)" />

      {/* Part 9: Resources */}
      <section id="resources" className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeader part="Part 9" title="Closing & Resources" subtitle="You've done the work. Now finish strong." />
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>You made it to the end of this guide. That says something about you.</p>
            <p>Most people skim. Most people look for shortcuts. You just worked through this guide end to end — and that kind of commitment is exactly what separates first-time passers from students who struggle.</p>
            <p>Here&apos;s the truth: <strong className="text-navy">the insurance exam is not designed to trick brilliant people.</strong> It&apos;s designed to screen out people who didn&apos;t prepare. You&apos;ve prepared. Now finish strong.</p>
          </div>
          <div className="bg-navy rounded-2xl p-8 text-center text-white mt-8">
            <h3 className="text-2xl font-bold mb-3">🎯 Your Two Best Tools for Final Exam Prep</h3>
            <p className="text-blue-100 mb-6">
              Working through practice questions is one of the most useful ways to find your gaps
              before exam day. Pair this guide with a state-specific practice exam (or the full
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
