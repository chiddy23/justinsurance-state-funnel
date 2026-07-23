import { passGuaranteeExcludedLabel } from "@/lib/pass-guarantee";
import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import { credentialKindFromHours, pleRequirement } from "@/lib/prelicensing-status";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import TrustBar from "@/components/TrustBar";
import PressLogosBar from "@/components/PressLogosBar";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Coverage, approval, and credential kind are THREE different facts. Conflating
// them produces claims we cannot substantiate, so every number below is derived
// from states.ts and self-corrects the moment an approval issues.
//
//  1. Coverage — we publish course pages for every state except New York (49).
//  2. Approval — we hold a state provider approval number only where
//     providerApprovalNumber !== "PENDING". New York AND Washington are both
//     "PENDING" today, so the old "49 / State-approved in every market we serve"
//     stat silently counted Washington as approved.
//  3. Credential kind — a "state-approved PRELICENSING" claim is only truthful
//     in states that actually mandate prelicensing and therefore issue a
//     prelicensing-provider approval. In exam-only states our approval is
//     CE-only (see src/lib/prelicensing-status.ts), so a blanket "state-approved
//     prelicensing in N states" would assert a credential we do not hold.
//
// Net: of the 49 states we serve, 17 mandate prelicensing and we hold the
// prelicensing approval in all 17 (New York, the only pending mandate state, is
// not served). That is what the stat below says — no more.
// ---------------------------------------------------------------------------
const ALL_STATES = Object.values(STATES);
const SERVED_STATES = ALL_STATES.filter((s) => s.slug !== "new-york");
const SERVED_STATE_COUNT = SERVED_STATES.length;

const mandatesPrelicensing = (s: (typeof ALL_STATES)[number]): boolean =>
  credentialKindFromHours([
    s.prelicensing?.life?.hours,
    s.prelicensing?.health?.hours,
    s.prelicensing?.lifeAndHealth?.hours,
  ]) === "prelicensing";

const SERVED_PRELICENSING_STATES = SERVED_STATES.filter(mandatesPrelicensing);
const SERVED_PRELICENSING_PENDING = SERVED_PRELICENSING_STATES.filter(
  (s) => s.providerApprovalNumber === "PENDING"
);
const SERVED_PRELICENSING_APPROVED_COUNT =
  SERVED_PRELICENSING_STATES.length - SERVED_PRELICENSING_PENDING.length;

// ---------------------------------------------------------------------------
// COURSE-FORMAT FACTS — derived from states.ts, never retyped.
//
// This national page previously asserted four things the per-state data
// contradicts. Each is now computed from the same records the state pages
// render, so the copy self-corrects instead of drifting:
//
//  1. "40 to 60 hours" for combined L&H. Colorado mandates 50 hours PER LINE
//     = 100 combined, so the stated ceiling understated a Colorado buyer's
//     requirement by 40 hours. Real spread: 12 (CA) to 100 (CO), mode 40.
//  2. "One exam covering both lines." False in every state flagged
//     noCombinedExam — each line is tested separately, with two exam fees.
//     (Use the per-record flag, NOT the NO_COMBINED_EXAM_STATES constant in
//     states.ts, which is stale — it omits AR, IL and NC.)
//  3. "100% self-paced." Illinois mandates live, attendance-verified webinar
//     hours (classroomWebinarHours); California and Minnesota enforce
//     monitored seat time that cannot be accelerated. Those two are the only
//     seat-time states sitewide — verified against every rendered state page,
//     2026-07-20 — and there is no data field for it, hence prose.
//  4. "No deadlines." Every record carries a fixed courseAccessDays window.
// ---------------------------------------------------------------------------
const LH_HOURS: { name: string; hours: number }[] = [];
for (const s of SERVED_PRELICENSING_STATES) {
  const req = pleRequirement(s.prelicensing?.lifeAndHealth?.hours);
  // Wisconsin has no combined license at all, so it has no combined hour figure.
  if (req.required) LH_HOURS.push({ name: s.name, hours: req.hours });
}
const LH_MIN = LH_HOURS.reduce((lo, e) => (e.hours < lo.hours ? e : lo));
const LH_MAX = LH_HOURS.reduce((hi, e) => (e.hours > hi.hours ? e : hi));
/** Most common combined-L&H hour requirement among the states that mandate it. */
const LH_MODE_HOURS = (() => {
  const counts: Record<number, number> = {};
  for (const e of LH_HOURS) counts[e.hours] = (counts[e.hours] ?? 0) + 1;
  return Object.keys(counts)
    .map(Number)
    .sort((a, b) => counts[b] - counts[a] || a - b)[0];
})();

const NO_COMBINED_EXAM_STATES_SERVED = SERVED_STATES.filter((s) => s.noCombinedExam);
const NO_COMBINED_EXAM_ABBRS = NO_COMBINED_EXAM_STATES_SERVED.map((s) => s.abbreviation).join(", ");

/** Shortest access window across all records — uniform at 30 today, and taking
 *  the minimum keeps this national claim true if any state ever differs. */
const COURSE_ACCESS_DAYS = Math.min(
  ...ALL_STATES.map((s) => Number(s.courseAccessDays)).filter((n) => Number.isFinite(n) && n > 0)
);

const IL_STATE = STATES["illinois"];
const IL_LIVE_HOURS = IL_STATE?.classroomWebinarHours;
const IL_LINE_REQ = pleRequirement(IL_STATE?.prelicensing?.life?.hours);
const IL_LIVE_PHRASE =
  IL_LIVE_HOURS && IL_LINE_REQ.required
    ? `Illinois requires ${IL_LIVE_HOURS} of the ${IL_LINE_REQ.hours} hours per line of authority to be completed as live, attendance-verified webinar sessions`
    : "Illinois requires part of your hours as live, attendance-verified webinar sessions";

/** "A", "A and B", "A, B, and C" — for naming pending states in prose. */
const formatStateNames = (states: { name: string }[]): string => {
  const names = states.map((s) => s.name);
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
};

const PRELICENSING_APPROVAL_SUB =
  SERVED_PRELICENSING_PENDING.length === 0
    ? `State-approved prelicensing in all ${SERVED_PRELICENSING_STATES.length} states we serve that require it`
    : `State-approved prelicensing in ${SERVED_PRELICENSING_APPROVED_COUNT} of the ${SERVED_PRELICENSING_STATES.length} states we serve that require it — ${formatStateNames(SERVED_PRELICENSING_PENDING)} approval pending`;

/** Lowercase, mid-sentence form of the same claim, for prose and metadata. */
const PRELICENSING_APPROVAL_PHRASE =
  SERVED_PRELICENSING_PENDING.length === 0
    ? "state-approved in every state we serve that requires prelicensing education"
    : `state-approved in ${SERVED_PRELICENSING_APPROVED_COUNT} of the ${SERVED_PRELICENSING_STATES.length} states we serve that require prelicensing education`;

const PAGE_TITLE = "Insurance Prelicensing Courses | Nationwide | JustInsurance";
const PAGE_DESC = `Insurance prelicensing courses online — $199 with pass guarantee in eligible states. Life, Health, and Life & Health courses, available in ${SERVED_STATE_COUNT} states and ${PRELICENSING_APPROVAL_PHRASE}.`;
const CANONICAL = "https://justinsuranceco.com/prelicensing";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESC,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: CANONICAL,
    type: "website",
    images: [{ url: "/og-image.png", alt: "Insurance Prelicensing Courses — JustInsurance" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    question: "What is insurance prelicensing?",
    answer:
      "Insurance prelicensing is a state-required education course in the 18 states that mandate it; in the other 32 you can sit for the exam without one. Where it is required, the state specifies a minimum number of hours — covering topics like insurance concepts, policy types, regulations, and ethics. JustInsurance courses satisfy these requirements nationwide where we operate.",
  },
  {
    question: "How long does prelicensing take to complete?",
    answer:
      `Most students complete their prelicensing course in 1 to 3 weeks studying part-time. The required hours vary by state and line of authority — life-only courses average around 20 hours, while combined life and health courses range from ${LH_MIN.hours} hours (${LH_MIN.name}) to ${LH_MAX.hours} hours (${LH_MAX.name}), with ${LH_MODE_HOURS} hours the most common requirement. You can spread your study across your ${COURSE_ACCESS_DAYS}-day course access window; California and Minnesota require monitored seat time, so those courses cannot be completed in less than the state-required hours.`,
  },
  {
    question: "Do I need prelicensing before taking the state exam?",
    answer:
      "It depends on your state. 17 of the 49 states we serve require proof of prelicensing course completion before you can register for the state licensing exam; in the other 32 you can schedule the exam directly and a course is optional preparation. Where a certificate is required, we issue one when you finish your JustInsurance course and you submit it to your state's exam vendor (typically Pearson VUE or PSI) to unlock exam eligibility.",
  },
  {
    question: "What happens if I don't pass the licensing exam?",
    answer:
      `JustInsurance backs every prelicensing course with a pass guarantee in eligible states (the guarantee is not offered in ${passGuaranteeExcludedLabel()}). If you complete the recommended study hours for your state (20 hours single line, or 40 hours dual line in states that don't require prelicensing), score 80% or higher on the practice exam three times in a row, and sit for your first-time state exam attempt within 30 days of your first enrollment, we will refund your course fee in full if you don't pass. Claims require your official score report from the failed first attempt, submitted within 30 days of the exam. Our 93% first-attempt pass rate reflects the quality of our curriculum, but the guarantee gives you peace of mind either way.`,
  },
];

const stats = [
  { value: "$199", label: "Flat course price", sub: "No hidden fees or subscriptions" },
  { value: "93%", label: "First-attempt pass rate", sub: "Among students who complete the course" },
  { value: String(SERVED_STATE_COUNT), label: "States covered", sub: PRELICENSING_APPROVAL_SUB },
  {
    value: "1–3 wks",
    label: "Avg. completion time",
    sub: `Self-paced within your ${COURSE_ACCESS_DAYS}-day access window (Illinois includes scheduled live webinars)`,
  },
];

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Pass Your Life & Health Insurance Exam — Full Live Class",
  description: "Insurance exam prep video from the Insurance Exam Prep YouTube channel by Justin vom Eigen.",
  thumbnailUrl: `https://i.ytimg.com/vi/sjk5B8bdO68/hqdefault.jpg`,
  // from src/lib/youtube-videos.json (real values, fetched 2026-04-27)
  uploadDate: "2026-01-02",
  duration: "PT2H51M10S",
  contentUrl: `https://www.youtube.com/watch?v=sjk5B8bdO68`,
  embedUrl: `https://www.youtube-nocookie.com/embed/sjk5B8bdO68`,
  publisher: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
};

// Hub-page schemas: WebPage + EducationalOccupationalCredential. Mirrors the
// non-resident-license + property-and-casualty-ce hubs so all 4 product/hub
// pages share the same hub-architecture schema set. Pairs with the homepage
// + navbar internal-link push (commit d768fdd) — gives Google an explicit
// "this is the canonical resource for the [credential]" signal.
const credentialSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalCredential",
  name: "State Insurance Producer License",
  description:
    "A state-issued license authorizing an individual to solicit, negotiate, and sell insurance products. Issued by each state's Department of Insurance after the candidate completes prelicensing education (where required), passes the state licensing exam, and clears a fingerprint-based background check.",
  credentialCategory: "license",
  educationalLevel: "Producer",
  competencyRequired:
    "State-approved prelicensing education (hours vary by state and line of authority) and a passing score on the state insurance licensing exam administered by Pearson VUE, PSI, or Prometric.",
  recognizedBy: {
    "@type": "Organization",
    name: "State Department of Insurance",
  },
  url: "https://justinsuranceco.com/prelicensing",
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Insurance Prelicensing Courses — Nationwide Coverage",
  url: "https://justinsuranceco.com/prelicensing",
  description: `Insurance prelicensing courses across ${SERVED_STATE_COUNT} states, ${PRELICENSING_APPROVAL_PHRASE}. Life, Health, and Life & Health combined courses for the State Insurance Producer License. $199 with pass guarantee in eligible states.`,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://justinsuranceco.com/prelicensing",
  },
  about: {
    "@type": "EducationalOccupationalCredential",
    name: "State Insurance Producer License",
  },
  isPartOf: {
    "@type": "WebSite",
    name: "JustInsurance",
    url: "https://justinsuranceco.com",
  },
  publisher: { "@id": "https://justinsuranceco.com#organization" },
  inLanguage: "en-US",
};

export default function PrelicensingPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Prelicensing", url: CANONICAL },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  // Same source as SERVED_STATE_COUNT so the rendered list can never drift from
  // the "N states covered" number. Copy before sorting — sort() mutates.
  const states = [...SERVED_STATES].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={webPageSchema} />
      <SchemaMarkup schema={credentialSchema} />
      <SchemaMarkup schema={videoSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Prelicensing" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            State-Approved Online Courses
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Insurance Prelicensing Courses
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-4 max-w-2xl mx-auto">
            Complete your state-required prelicensing education online for $199. Self-paced in most states and backed by our pass guarantee in eligible states. Available in {SERVED_STATE_COUNT} states (all except New York) — and {PRELICENSING_APPROVAL_PHRASE}.
          </p>
          <p className="text-sm text-blue-200/80 mb-8 max-w-2xl mx-auto">
            Pass guarantee is available in most states and is not offered in {passGuaranteeExcludedLabel()}.{" "}
            <Link href="/pass-rates" className="underline hover:text-white">
              See guarantee terms
            </Link>
            .
          </p>
          <a
            href="#states"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-10 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Find My State
          </a>
        </div>
      </section>

      <TrustBar />
      <PressLogosBar />

      {/* What is prelicensing */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            What Is Insurance Prelicensing?
          </h2>
          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>
              Insurance prelicensing is state-required education in the states that mandate it &mdash; 17 of the 49 states we serve. Where it is required you must complete it before sitting for the state licensing exam; in the remaining states a prelicensing course is optional exam preparation that most successful candidates still take. In the states that do require it, the Department of Insurance sets the required number of study hours — typically between 20 and 40 hours — and defines the topics that must be covered, including life insurance concepts, health insurance products, policy structures, annuities, federal and state regulations, and professional ethics.
            </p>
            <p>
              JustInsurance prelicensing courses are delivered fully online and are self-paced in most states. {IL_LIVE_PHRASE}, and California and Minnesota enforce monitored seat time that cannot be accelerated. You study through video lessons, reading modules, and chapter quizzes, then take a final practice exam that mirrors your state&apos;s actual licensing test. When you pass, you receive a completion certificate — state-recognized in the states that approve prelicensing providers, where it unlocks your eligibility to sit for the official exam.
            </p>
            <p>
              Where a state requires prelicensing, the requirement applies to each line of authority you want to carry — life insurance, health insurance, or both. In the 32 states that do not require it, a course is optional exam preparation. The right course depends on the license type your state requires and the products you plan to offer clients. Use the state grid below to find the course options available in your state.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            Why Agents Choose JustInsurance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <p className="text-gold font-extrabold text-3xl md:text-4xl mb-1">{stat.value}</p>
                <p className="text-navy font-bold text-sm mb-1">{stat.label}</p>
                <p className="text-gray-500 text-xs leading-snug">{stat.sub}</p>
                {stat.label === "First-attempt pass rate" && (
                  <Link href="/pass-rates" className="block text-[11px] text-navy underline hover:text-gold-deep mt-1">
                    See methodology →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State grid */}
      <section id="states" className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Choose Your State
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Select your state to see prelicensing course options, required hours, and exam details.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}/prelicensing`}
                className="group flex items-center gap-2 bg-gray-50 hover:bg-navy rounded-lg p-3 transition-all hover:shadow-md border border-gray-100"
              >
                <span className="text-xs font-bold text-gray-500 group-hover:text-blue-200 w-8 flex-shrink-0">
                  {state.abbreviation}
                </span>
                <span className="text-sm font-medium text-navy group-hover:text-white leading-tight">
                  {state.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-navy mb-3 text-lg">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
                {faq.question === "What happens if I don't pass the licensing exam?" && (
                  <p className="mt-2 text-xs">
                    <Link href="/pass-rates" className="text-navy underline hover:text-gold-deep">
                      See how we calculate this →
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <YouTubeEmbed videoId="sjk5B8bdO68" title="Pass Your Life & Health Insurance Exam — Full Live Class" />

      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy mb-6 text-center">Prelicensing Courses by Line of Authority</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/life-insurance-license" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-bold text-navy mb-2">Life Insurance License</div>
              <div className="text-sm text-gray-600">Everything to know about the Life-only line: exam content, prelicensing hours, and state-by-state fees.</div>
            </Link>
            <Link href="/health-insurance-license" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-bold text-navy mb-2">Health Insurance License</div>
              <div className="text-sm text-gray-600">Accident &amp; Sickness (Health) line — coursework, exam prep, and Medicare/Medigap considerations.</div>
            </Link>
            <Link href="/life-and-health-insurance-license" className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-bold text-navy mb-2">Life &amp; Health License</div>
              <div className="text-sm text-gray-600">The combined L&amp;H license — one exam covering both lines in most states, though {NO_COMBINED_EXAM_STATES_SERVED.length} states ({NO_COMBINED_EXAM_ABBRS}) test each line separately.</div>
            </Link>
          </div>
          <div className="mt-6 text-center text-sm text-gray-600">
            New to the industry? See our guides on <Link href="/how-long-to-get-insurance-license" className="text-navy underline hover:text-gold">how long licensing takes</Link> and <Link href="/insurance-license-cost" className="text-navy underline hover:text-gold">total license cost</Link>.
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Start Your Prelicensing Course?"
        subtitle="Pick your state, enroll in minutes, and start studying today. Pass guarantee included in eligible states."
        ctaText="Find My State"
        ctaHref="#states"
      />
    </>
  );
}
