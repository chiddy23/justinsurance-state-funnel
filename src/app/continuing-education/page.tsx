import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import TestimonialCards from "@/components/TestimonialCards";
import TrustBar from "@/components/TrustBar";
import PressLogosBar from "@/components/PressLogosBar";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import { passGuaranteeExcludedLabel } from "@/lib/pass-guarantee";

// ---------------------------------------------------------------------------
// Coverage and approval are different facts. We publish CE pages for every state
// except New York (49), but we hold a state CE provider approval number only
// where providerApprovalNumber !== "PENDING" — New York AND Washington are both
// "PENDING" today. The old "49 / State-approved CE in every market we serve"
// stat silently counted Washington as approved. Derived from states.ts so the
// copy self-corrects the moment an approval issues.
// ---------------------------------------------------------------------------
const SERVED_STATES = Object.values(STATES).filter((s) => s.slug !== "new-york");
const SERVED_STATE_COUNT = SERVED_STATES.length;
const CE_APPROVAL_PENDING = SERVED_STATES.filter(
  (s) => s.providerApprovalNumber === "PENDING"
);
const CE_APPROVED_COUNT = SERVED_STATE_COUNT - CE_APPROVAL_PENDING.length;

/** "A", "A and B", "A, B, and C" — for naming pending states in prose. */
const formatStateNames = (states: { name: string }[]): string => {
  const names = states.map((s) => s.name);
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
};

const CE_APPROVAL_SUB =
  CE_APPROVAL_PENDING.length === 0
    ? "State-approved CE in every market we serve"
    : `State-approved CE in ${CE_APPROVED_COUNT} of them — ${formatStateNames(CE_APPROVAL_PENDING)} approval pending`;

/** Lowercase, mid-sentence form of the same claim, for prose and metadata. */
const CE_APPROVAL_PHRASE =
  CE_APPROVAL_PENDING.length === 0
    ? `state-approved CE in all ${SERVED_STATE_COUNT} states we serve`
    : `state-approved CE in ${CE_APPROVED_COUNT} of the ${SERVED_STATE_COUNT} states we serve (our ${formatStateNames(CE_APPROVAL_PENDING)} approval is still pending)`;

// ---------------------------------------------------------------------------
// CE HOUR + ETHICS FACTS, DERIVED FROM states.ts (audit 2026-07-20).
// This page asserted "typically 20 to 24 hours", a "2–4 hrs" average completion
// time, and ethics "required in all states". None of the three is in the data:
// NOT ONE state requires 20–23 hours (the real spread is 10 in South Dakota to
// 48 in Arizona, with 24 the mode), no state's requirement can be earned in 2–4
// hours, and south-dakota.ce.ethicsHours is 0. Derive all of it from the
// records so the copy can never drift from the data again.
// ---------------------------------------------------------------------------
const ALL_STATES = Object.values(STATES);

/** Most frequently occurring value in a numeric list (the modal requirement). */
const modeOf = (vals: number[]): number => {
  const counts = new Map<number, number>();
  vals.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0];
};

const CE_HOUR_VALUES = ALL_STATES.map((s) => s.ce.totalHours);
const CE_HOURS_MIN = Math.min(...CE_HOUR_VALUES); // 10 (South Dakota)
const CE_HOURS_MAX = Math.max(...CE_HOUR_VALUES); // 48 (Arizona)
const CE_MODAL_HOURS = modeOf(CE_HOUR_VALUES); // 24
const CE_MODAL_HOUR_COUNT = CE_HOUR_VALUES.filter((h) => h === CE_MODAL_HOURS).length; // 41

const CE_TWO_YEAR_COUNT = ALL_STATES.filter((s) => s.ce.renewalPeriod === "2 years").length;
const YEAR_WORD: Record<string, string> = {
  "3 years": "three years",
  "4 years": "four years",
  "5 years": "five years",
};
/** e.g. "three years in Iowa, Massachusetts, and Nevada; four years in Arizona" */
const CE_LONGER_CYCLES = Array.from(new Set(ALL_STATES.map((s) => s.ce.renewalPeriod)))
  .filter((p) => p !== "2 years")
  .sort()
  .map(
    (p) =>
      `${YEAR_WORD[p] ?? p} in ${formatStateNames(
        ALL_STATES.filter((s) => s.ce.renewalPeriod === p)
      )}`
  )
  .join("; ");

const CE_REQUIREMENT_SENTENCE =
  `State CE requirements range from ${CE_HOURS_MIN} to ${CE_HOURS_MAX} hours per renewal cycle — ` +
  `${CE_MODAL_HOUR_COUNT} of the ${ALL_STATES.length} states require ${CE_MODAL_HOURS} hours — and the ` +
  `renewal cycle is two years in ${CE_TWO_YEAR_COUNT} states (${CE_LONGER_CYCLES}).`;

// Ethics is a PRODUCT claim, so it is scoped to the states we actually serve.
const CE_ETHICS_STATES = SERVED_STATES.filter((s) => s.ce.ethicsHours > 0);
const CE_NO_ETHICS_STATES = SERVED_STATES.filter((s) => s.ce.ethicsHours === 0);
const CE_ETHICS_HOUR_VALUES = CE_ETHICS_STATES.map((s) => s.ce.ethicsHours);
const CE_ETHICS_TYPICAL = modeOf(CE_ETHICS_HOUR_VALUES); // 3
const CE_ETHICS_MAX = Math.max(...CE_ETHICS_HOUR_VALUES); // 6 (Arizona)
const CE_ETHICS_MAX_STATES = CE_ETHICS_STATES.filter((s) => s.ce.ethicsHours === CE_ETHICS_MAX);
const CE_NO_ETHICS_CLAUSE = CE_NO_ETHICS_STATES.length
  ? `; ${formatStateNames(CE_NO_ETHICS_STATES)} ${
      CE_NO_ETHICS_STATES.length === 1 ? "has" : "have"
    } no separate ethics mandate`
  : "";
const CE_ETHICS_LABEL = `Ethics (required in ${CE_ETHICS_STATES.length} of the ${SERVED_STATE_COUNT} states we serve)`;
const CE_ETHICS_DESC = `typically ${CE_ETHICS_TYPICAL} hours, up to ${CE_ETHICS_MAX} in ${formatStateNames(
  CE_ETHICS_MAX_STATES
)}${CE_NO_ETHICS_CLAUSE} — included where your state requires it`;

const PAGE_TITLE = "Insurance CE Courses | Same-Day Reporting | JustInsurance";
const PAGE_DESC = `Renew your insurance license online. State-approved CE with same-day DOI reporting in most cases — ${CE_APPROVAL_PHRASE}. L&H from $39, P&C CE in 25 states.`;
const CANONICAL = "https://justinsuranceco.com/continuing-education";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESC,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: CANONICAL,
    type: "website",
    images: [{ url: "/og-image.png", alt: "Insurance CE Courses — JustInsurance" }],
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
    question: "What is insurance continuing education (CE)?",
    answer:
      `Insurance continuing education is the ongoing education requirement that licensed insurance agents must complete to renew their license. ${CE_REQUIREMENT_SENTENCE} CE courses cover insurance product updates, regulatory changes, ethics, and emerging topics relevant to practicing agents.`,
  },
  {
    question: "How often do I need to complete CE?",
    answer:
      "CE renewal cycles vary by state but are most commonly every two years. Your renewal deadline is usually tied to your license expiration date. JustInsurance courses include your state's required ethics hours as part of the package, so you can complete everything in one place without hunting for a separate ethics course.",
  },
  {
    question: "What does 'same-day DOI reporting' mean?",
    answer:
      "When you complete your CE course with JustInsurance, we typically electronically report your completion to your state's Department of Insurance the same business day you finish — no paperwork or transcripts for you to mail. Most states then post the credit to your license record within a few business days, so it's worth confirming your hours are on file in your state's producer portal before you submit your renewal.",
  },
  {
    question: "Can I take CE if my license has already expired?",
    answer:
      "In most states, you can still complete CE and apply for license reinstatement within a certain grace period after your expiration date — but the rules vary significantly by state. If your license has lapsed, we recommend contacting your state's Department of Insurance or our support team to confirm the reinstatement requirements before enrolling.",
  },
];

const stats = [
  { value: "From $39", label: "CE package price", sub: "Includes every hour your state requires" },
  { value: "Same day", label: "DOI reporting", sub: "We typically transmit your completion the same business day" },
  { value: String(SERVED_STATE_COUNT), label: "States covered", sub: CE_APPROVAL_SUB },
  {
    value: `${CE_HOURS_MIN}–${CE_HOURS_MAX} hrs`,
    label: "CE hours per cycle",
    sub: "Set by your state — work through them at your own pace",
  },
];

// Hub-page schemas: WebPage + EducationalOccupationalCredential. Mirrors the
// non-resident-license + property-and-casualty-ce hubs so all 4 product/hub
// pages share the same hub-architecture schema set. Pairs with the homepage
// + navbar internal-link push (commit d768fdd) — gives Google an explicit
// "this is the canonical resource for the [credential]" signal.
const credentialSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalCredential",
  name: "State Insurance Producer License — Continuing Education",
  description:
    "Continuing education credit hours required by each state's Department of Insurance to maintain an active insurance producer license. Hours and ethics requirements vary by state and license type. Required on a recurring renewal cycle (typically 2 years for Life & Health, with state-specific variations).",
  credentialCategory: "license",
  educationalLevel: "Producer",
  competencyRequired:
    "Active resident or non-resident insurance producer license. State-approved CE coursework completed and reported to the state DOI before the license expiration date.",
  recognizedBy: {
    "@type": "Organization",
    name: "State Department of Insurance",
  },
  url: "https://justinsuranceco.com/continuing-education",
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Insurance Continuing Education — Same-Day DOI Reporting",
  url: "https://justinsuranceco.com/continuing-education",
  description:
    "State-approved insurance continuing education for license renewal. Typically includes same-day DOI reporting. Life & Health CE from $39, plus Property & Casualty CE in 25 states.",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://justinsuranceco.com/continuing-education",
  },
  about: {
    "@type": "EducationalOccupationalCredential",
    name: "State Insurance Producer License — Continuing Education",
  },
  isPartOf: {
    "@type": "WebSite",
    name: "JustInsurance",
    url: "https://justinsuranceco.com",
  },
  publisher: { "@id": "https://justinsuranceco.com#organization" },
  inLanguage: "en-US",
};

export default function ContinuingEducationPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: "Continuing Education", url: CANONICAL },
  ]);
  const faqSchema = generateFAQSchema(faqs);
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Insurance Continuing Education (CE) Courses",
    description: `Online insurance CE courses for license renewal — ${CE_APPROVAL_PHRASE}. Same-day reporting to your state DOI. From $39.`,
    provider: {
      "@type": "Organization",
      name: "JustInsurance LLC",
      url: "https://justinsuranceco.com",
      logo: "https://justinsuranceco.com/justinsurance-logo.png",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
    },
    offers: {
      "@type": "Offer",
      price: "39",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: CANONICAL,
    },
    courseMode: "online",
    inLanguage: "en-US",
    url: CANONICAL,
  };

  // Same source as SERVED_STATE_COUNT so the rendered list can never drift from
  // the "N states covered" number. Copy before sorting — sort() mutates.
  const states = [...SERVED_STATES].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={webPageSchema} />
      <SchemaMarkup schema={credentialSchema} />
      <SchemaMarkup schema={courseSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Continuing Education" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            License Renewal Made Simple
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Insurance Continuing Education (CE) Courses
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Renew your insurance license online starting at $39. CE packages with same-day DOI reporting in most cases, and {CE_APPROVAL_PHRASE}. Available in {SERVED_STATE_COUNT} states (all except New York) — no classroom required.
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
      {/* CE renewal has no state licensing exam, and the Terms (§ 4 / "Other
          products") limit the Pass Guarantee to qualifying PRELICENSING courses.
          The shared TrustBar still renders that badge on every national page, so
          the CE hub has to say plainly that the guarantee does not reach a CE
          purchase — and name the states where it is not offered at all.
          A TrustBar prop that swaps the badge out on non-prelicensing hubs is
          requested separately; this note is the in-page correction. */}
      <section className="bg-gray-bg border-b border-gray-200 px-4 pb-3">
        <p className="max-w-4xl mx-auto text-center text-xs text-gray-500 leading-snug">
          Pass Guarantee note: the guarantee applies only to qualifying prelicensing
          courses, which are conditioned on a first-time state exam attempt — continuing
          education renewal has no state exam, so a CE purchase is not covered. The
          guarantee is not offered in {passGuaranteeExcludedLabel()}. See our{" "}
          <Link href="/terms" className="underline hover:text-navy">
            Terms
          </Link>{" "}
          for full conditions.
        </p>
      </section>
      <PressLogosBar />

      {/* What is CE */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            What Is Insurance Continuing Education?
          </h2>
          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>
              Insurance continuing education (CE) is the ongoing education requirement that all licensed insurance agents must satisfy to keep their license active. Every state&apos;s Department of Insurance mandates a certain number of CE credit hours within each renewal period. {CE_REQUIREMENT_SENTENCE} These hours must cover state-approved topics, and most states require that a portion of those hours address ethics and professional conduct.
            </p>
            <p>
              JustInsurance CE packages are designed to fulfill your entire renewal requirement in a single, convenient online bundle. Our courses are approved by your state&apos;s insurance regulator — see each course listing for its approved credit hours. Each package includes any ethics hours your state requires, and you can complete everything at your own pace — your state sets the credit-hour count, and you can spread those hours across your renewal cycle.
            </p>
            <p>
              One of the most important advantages of renewing with JustInsurance is same-day DOI reporting in most cases. The moment you complete your course, we typically transmit your completion record electronically to your state&apos;s Department of Insurance — no paperwork or transcripts for you to mail. Most states then post the credit to your license record within a few business days, so it&apos;s worth confirming your hours are on file before your renewal deadline.
            </p>
          </div>
        </div>
      </section>

      {/* CE topics covered */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
            What Our CE Packages Cover
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Every JustInsurance CE package includes all required credit hours for
            your state, any ethics hours your state mandates, and any state-specific
            specialty topics. Depending on your state, packages may include:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              { label: CE_ETHICS_LABEL, desc: CE_ETHICS_DESC },
              { label: "Annuity suitability", desc: "required before selling annuity products in most states" },
              { label: "Long-term care (LTC) training", desc: "required for agents selling LTC products" },
              { label: "National Flood Insurance Program (NFIP)", desc: "a one-time federal training requirement — generally worth 3 CE hours — for any agent who sells NFIP flood policies, in every state (Flood Insurance Reform Act of 2004 § 207); some states add their own flood CE rules" },
              { label: "General CE electives", desc: "insurance law updates, product knowledge, regulatory changes" },
            ].map((t) => (
              <li key={t.label} className="bg-white rounded-lg p-4 border border-gray-200 flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-gray-dark text-xs font-bold mt-0.5">
                  ✓
                </span>
                <p className="text-gray-700 text-sm">
                  <strong className="text-navy">{t.label}</strong> — {t.desc}
                </p>
              </li>
            ))}
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Select your state below to see the exact package contents, required
            hours, and pricing for your license type.
          </p>
        </div>
      </section>

      {/* CE vs Prelicensing callout */}
      <section className="bg-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-gold rounded-r-lg p-5">
            <p className="font-bold text-navy mb-1">Already licensed? You need CE — not prelicensing.</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Continuing education (CE) is how you renew an active insurance license. It&apos;s shorter and simpler than prelicensing. If you&apos;re getting your insurance license for the first time,{" "}
              <Link href="/prelicensing" className="text-navy underline hover:text-gold font-medium">
                start here →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            The JustInsurance CE Advantage
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <p className="text-gold font-extrabold text-3xl md:text-4xl mb-1">{stat.value}</p>
                <p className="text-navy font-bold text-sm mb-1">{stat.label}</p>
                <p className="text-gray-500 text-xs leading-snug">{stat.sub}</p>
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
            Select your state to view CE requirements, package pricing, and renewal deadlines.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}/continuing-education`}
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

      {/* CE Testimonials */}
      <TestimonialCards variant="ce" seed="ce-hub" stateName="" />

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
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Don't Let Your License Lapse"
        subtitle="Work through your state's required CE hours at your own pace, typically get same-day DOI reporting, and keep your license active without the stress."
        ctaText="Renew My License Now"
        ctaHref="#states"
      />
    </>
  );
}
