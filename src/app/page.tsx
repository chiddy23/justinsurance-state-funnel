import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import { stateClaims, isPrelicensingHeld } from "@/lib/prelicensing-status";
import TrustBar from "@/components/TrustBar";
import PressLogosBar from "@/components/PressLogosBar";
import CTABanner from "@/components/CTABanner";
import TrustpilotStars from "@/components/TrustpilotStars";
import { TRUSTPILOT, getTrustpilot, TRUSTPILOT_REVIEWS } from "@/lib/trustpilot";
import { SchemaMarkup, generateOrganizationSchema } from "@/lib/schema";
import { passGuaranteeExcludedLabel } from "@/lib/pass-guarantee";

// ---------------------------------------------------------------------------
// COVERAGE vs APPROVAL — two different facts, both derived from states.ts so the
// copy self-corrects when the data changes. We publish pages for every state
// except New York (49 served), but we hold a state CE provider approval number
// only where providerApprovalNumber !== "PENDING" (Washington is still PENDING
// among the states we serve). "Nationwide" asserted an approval we do not hold.
// Prelicensing counts come from stateClaims() over the same records: most states
// mandate no prelicensing education at all, so a blanket "every course meets each
// state's requirements" claim is not available to us.
// ---------------------------------------------------------------------------
const SERVED_STATES = Object.values(STATES).filter((s) => s.slug !== "new-york");
const SERVED_STATE_COUNT = SERVED_STATES.length;
// "Not live" = approval still pending OR approved-but-courses-coming-soon
// (ceCoursesLive === false, e.g. Washington #300632). Neither counts toward the
// live/available CE count; both surface as "approved, courses coming soon".
const CE_APPROVAL_PENDING = SERVED_STATES.filter(
  (s) => s.providerApprovalNumber === "PENDING" || s.ceCoursesLive === false
);
const CE_APPROVED_COUNT = SERVED_STATE_COUNT - CE_APPROVAL_PENDING.length;

// PRELICENSING is a separate credential from CE. Most states mandate no
// prelicensing education at all, so there is no state requirement for a course
// to "meet" and no prelicensing-provider approval to advertise — stateClaims()
// is the single source of truth for what may be asserted (see
// src/lib/prelicensing-status.ts). Counted over the states we actually serve.
const PRELICENSING_REQUIRED_SERVED = SERVED_STATES.filter(
  (s) => stateClaims(s).prelicensingRequired
);
const PRELICENSING_APPROVED_COUNT = SERVED_STATES.filter(
  (s) => stateClaims(s).canClaimPrelicensingApproval
).length;
const EXAM_PREP_ONLY_COUNT = SERVED_STATE_COUNT - PRELICENSING_REQUIRED_SERVED.length;

/**
 * Hero prelicensing reach. Owner-confirmed (2026-08-05) we hold prelicensing
 * approval in EVERY state that requires it, so when the data agrees
 * (approved-and-live count === required-state count) the hero reads "wherever
 * your state requires it"; otherwise it self-corrects to a count so the claim
 * can never silently become false. NY (approved, life course launching soon) is
 * excluded from SERVED and surfaced as "opening soon" on its own page, so it
 * does not weaken this claim.
 */
const PRELICENSING_REACH_PHRASE =
  PRELICENSING_REQUIRED_SERVED.length > 0 &&
  PRELICENSING_APPROVED_COUNT >= PRELICENSING_REQUIRED_SERVED.length
    ? "wherever your state requires it"
    : `in ${PRELICENSING_APPROVED_COUNT} of the ${PRELICENSING_REQUIRED_SERVED.length} states we serve that require it`;

/**
 * Hero CE reach — the plain count of states where our CE is state-approved and
 * live (avoids the awkward "48 of the 49 we serve" fraction, which reads as
 * "why not 50?"). The coming-soon detail (e.g. "Washington approved, courses
 * coming soon") still shows in the Choose Your State section below.
 * Auto-updates as pending CE states go live.
 */
const CE_REACH_PHRASE = `${CE_APPROVED_COUNT} states`;

/** States whose course carries a mandated LIVE classroom/webinar component. */
const LIVE_COMPONENT_STATES = SERVED_STATES.filter(
  (s) => typeof s.classroomWebinarHours === "number"
);

/** "A", "A and B", "A, B, and C" — for naming states in prose. */
const formatStateNames = (states: { name: string }[]): string => {
  const names = states.map((s) => s.name);
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
};

/** Course access window — rendered only when it is uniform across served states. */
const ACCESS_DAY_VALUES = Array.from(
  new Set(SERVED_STATES.map((s) => s.courseAccessDays))
);
const UNIFORM_ACCESS_DAYS = ACCESS_DAY_VALUES.length === 1 ? ACCESS_DAY_VALUES[0] : null;

/**
 * Delivery-format caveats. "100% online, self-paced" is not true everywhere:
 * Illinois mandates live classroom/webinar hours with verified attendance
 * (50 Ill. Adm. Code Part 3119; 215 ILCS 5/500-35(b)), and a number of states
 * (CO, CT, MI, MN, MS, WV, WI ...) require the final course exam to be
 * administered by a disinterested third-party proctor the student arranges.
 */
const LIVE_COMPONENT_CAVEAT = LIVE_COMPONENT_STATES.length
  ? `${formatStateNames(LIVE_COMPONENT_STATES)} include${LIVE_COMPONENT_STATES.length === 1 ? "s" : ""} a live classroom/webinar component with verified attendance, and several states require a proctor-monitored final exam you arrange`
  : "several states require a proctor-monitored final exam you arrange";

/** Same caveat, sentence-initial. */
const LIVE_COMPONENT_SENTENCE =
  LIVE_COMPONENT_CAVEAT.charAt(0).toUpperCase() + LIVE_COMPONENT_CAVEAT.slice(1);

// SEO title — lead with the high-volume head term. "Insurance license course(s)"
// draws ~1,900 US searches/mo and "insurance license" ~9,900, vs "prelicensing"
// at ~40/mo (DataForSEO, 2026-08), so the title leads with the license-course
// phrasing and keeps prelicensing + CE for topical coverage.
const homeTitle = "Insurance License Courses — Prelicensing & CE | JustInsurance";
// Meta description — CTR copy (not a ranking factor). Keyword-forward, no
// attorney-gated pass-rate claim, no awkward "48 of 49" fraction.
const homeDesc = `State-approved insurance prelicensing, continuing education (CE) & exam prep — 100% online and self-paced, trusted by 30,000+ students. From $199.`;

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDesc,
  alternates: { canonical: "https://justinsuranceco.com/" },
  openGraph: {
    title: homeTitle,
    description: homeDesc,
    url: "https://justinsuranceco.com/",
    type: "website",
    images: [{ url: "/og-image.png", alt: "JustInsurance — Online Insurance License Courses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDesc,
    images: ["/og-image.png"],
  },
};

export default async function HomePage() {
  // Live Trustpilot score/count (auto-updates via ISR; static 92 fallback).
  const tp = await getTrustpilot();
  // Homepage social proof — 3 real, compliance-verified Trustpilot reviews sourced
  // VERBATIM from the single review list (already competitor/FTC-filtered).
  // Display-only: we do NOT emit AggregateRating/Review JSON-LD (self-serving
  // review schema stays off). If a name is ever withheld at the source, it simply
  // drops out and the grid renders the remainder.
  const HOMEPAGE_REVIEW_NAMES = ["Rhonda B.", "Kisha E.", "Michael W."];
  const homepageReviews = HOMEPAGE_REVIEW_NAMES.map((n) =>
    TRUSTPILOT_REVIEWS.find((r) => r.name === n)
  ).filter((r): r is (typeof TRUSTPILOT_REVIEWS)[number] => Boolean(r));
  // `states` drives the DISCOVERY GRID, which lists EVERY state so each tile is
  // navigable — including New York, whose /new-york hub renders a held "opening
  // soon" notice while its provider approval is PENDING. This list is
  // intentionally BROADER than SERVED_STATES: SERVED_STATES excludes New York and
  // remains the single source of truth for the served/approved COUNTS above, so
  // adding a state to the grid never changes a rendered count or claim.
  const states = Object.values(STATES).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <SchemaMarkup schema={generateOrganizationSchema()} />

      {/* Hero */}
      <section className="bg-navy-dark text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            State-Approved Online Courses
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Get Your Insurance License Online
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            State-approved insurance prelicensing and continuing education (CE), plus exam prep &mdash; 100% online, self-paced in most states, with a pass guarantee where eligible. Approved for prelicensing {PRELICENSING_REACH_PHRASE}, with CE in {CE_REACH_PHRASE}. Join 30,000+ students who trust JustInsurance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#states"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Find My State
            </a>
            <a
              href="tel:7542239744"
              className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-white hover:text-navy transition-all"
            >
              Call 754-223-9744
            </a>
          </div>
          <div className="mt-6 flex justify-center">
            <a
              href={TRUSTPILOT.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors"
            >
              <TrustpilotStars size="w-4 h-4" />
              <span>
                <strong className="text-white">{TRUSTPILOT.label}</strong>{" "}
                {tp.score}/5 · {tp.count} reviews on{" "}
                <span className="font-semibold text-white">Trustpilot</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <TrustBar />
      <PressLogosBar />

      {/* Browse by Course Type — homepage hub anchors */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Browse by Course Type
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Already know what you need? Skip the state grid and jump straight to the course catalog for prelicensing or continuing education.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prelicensing */}
            <Link
              href="/prelicensing"
              className="group bg-white rounded-xl border-2 border-transparent hover:border-navy shadow-md hover:shadow-xl transition-all p-6 flex flex-col"
            >
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold-deep transition-colors">
                Prelicensing Courses
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                Prelicensing for Life, Health, and Life &amp; Health insurance licenses &mdash; state-approved where the state requires it. From $199. Pass guarantee included in eligible states.
              </p>
              <span className="inline-flex items-center gap-1 text-navy font-semibold text-sm group-hover:text-gold-deep transition-colors">
                See Prelicensing Courses &rarr;
              </span>
            </Link>

            {/* L&H Continuing Education */}
            <Link
              href="/continuing-education"
              className="group bg-white rounded-xl border-2 border-gold shadow-md hover:shadow-xl transition-all p-6 flex flex-col"
            >
              <div className="bg-gold text-gray-dark text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full self-start mb-3">
                Most Popular
              </div>
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold-deep transition-colors">
                Continuing Education
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                Renew your Life &amp; Health insurance license with state-approved CE. Typically same-day DOI reporting. From $39.
              </p>
              <span className="inline-flex items-center gap-1 text-navy font-semibold text-sm group-hover:text-gold-deep transition-colors">
                See CE Courses &rarr;
              </span>
            </Link>

            {/* Property & Casualty CE */}
            <Link
              href="/property-and-casualty-ce"
              className="group bg-white rounded-xl border-2 border-transparent hover:border-gold shadow-md hover:shadow-xl transition-all p-6 flex flex-col"
            >
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold-deep transition-colors">
                Property &amp; Casualty CE
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                State-approved P&amp;C CE for personal auto, homeowners, commercial, and flood. 25-state coverage. From $39.
              </p>
              <span className="inline-flex items-center gap-1 text-navy font-semibold text-sm group-hover:text-gold-deep transition-colors">
                See P&amp;C CE Packages &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* State Grid */}
      <section id="states" className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Choose Your State
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            We offer state-approved continuing education in {CE_APPROVED_COUNT} of the {SERVED_STATE_COUNT} states we serve (all except New York{CE_APPROVAL_PENDING.length > 0 ? `; ${formatStateNames(CE_APPROVAL_PENDING)} approved, courses coming soon` : ""}), plus prelicensing in the states where we are approved. Click your state to get started.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                className={`group flex items-center gap-2 bg-gray-bg hover:bg-navy rounded-lg p-3 transition-all hover:shadow-md${isPrelicensingHeld(state) ? " flex-wrap" : ""}`}
              >
                <span className="text-xs font-bold text-gray-500 group-hover:text-blue-200 w-8 flex-shrink-0">
                  {state.abbreviation}
                </span>
                <span className="text-sm font-medium text-navy group-hover:text-white leading-tight">
                  {state.name}
                </span>
                {isPrelicensingHeld(state) && (
                  <span className="ml-auto flex-shrink-0 whitespace-nowrap bg-gold text-gray-dark text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">
                    Opening soon
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why JustInsurance */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Why 30,000+ Students Choose JustInsurance
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            We make getting and keeping your insurance license as simple as possible.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: `State-Approved CE in ${CE_APPROVED_COUNT} States`,
                desc: `Our CE is approved by the Department of Insurance in the ${CE_APPROVED_COUNT} states where our courses are live, and our prelicensing courses are state-approved in the ${PRELICENSING_APPROVED_COUNT} states we serve that mandate prelicensing education. In the other ${EXAM_PREP_ONLY_COUNT}, the state requires no prelicensing course and ours is optional exam preparation.`,
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Self-Paced in Most States",
                desc: `Study whenever it fits your life${UNIFORM_ACCESS_DAYS ? `, with ${UNIFORM_ACCESS_DAYS} days of course access` : ""}. ${LIVE_COMPONENT_SENTENCE}.`,
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: "Pass Guarantee*",
                desc: `Meet the study hours, score 80% or higher on any three practice-exam attempts, and test within 30 days of enrollment. If you don't pass, we'll give you a fresh study period, reset your practice exams, and reimburse your state exam fee. Available in eligible states. *Not offered on courses for ${passGuaranteeExcludedLabel()}; see Terms.`,
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Same-Day CE Reporting",
                desc: "Finish your CE and we typically report your completion to the state the same day.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2v-1a7 7 0 10-14 0v1a2 2 0 002 2zM12 11V7" />
                  </svg>
                ),
                title: "Expert Support",
                desc: "Real humans answer your questions about course content or the licensing process. Call or email anytime.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                title: "Transparent, Affordable Pricing",
                desc: "Prelicensing from $199 and CE packages from $39. No subscriptions, no hidden fees. Pay once, get licensed.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-navy mb-3">{item.icon}</div>
                <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6 max-w-3xl mx-auto text-center">
            *JustInsurance typically transmits your completion to your state&apos;s Department of Insurance the same business day you finish; the time for your state to post the credit to your license record varies by state.
          </p>
        </div>
      </section>

      {/* Social proof — real, compliance-verified Trustpilot reviews.
          Display-only (no AggregateRating/Review JSON-LD); self-contained section
          so it can't reflow neighbors; responsive 1->3 col grid. */}
      {homepageReviews.length > 0 && (
        <section className="bg-white py-16 px-4 border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
              What Our Students Say
            </h2>
            <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
              Real, unedited reviews from students who used JustInsurance to prepare for their state exam.{" "}
              <a
                href={TRUSTPILOT.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-navy underline hover:text-gold-deep"
              >
                Rated {tp.score}/5 on Trustpilot
              </a>
              .
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homepageReviews.map((r) => (
                <article
                  key={r.name + r.date}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col"
                >
                  <TrustpilotStars size="w-4 h-4" count={r.stars} />
                  <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6 flex-grow">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#00B67A" }}
                    >
                      <span className="text-white font-bold text-xs">{r.initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy text-sm">{r.name}</p>
                      <p className="text-gray-500 text-xs">
                        via Trustpilot{r.state ? ` · ${r.state}` : ""}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1 text-navy font-semibold text-sm hover:text-gold-deep transition-colors"
              >
                Read more student reviews &rarr;
              </Link>
            </div>
            {/* FTC 16 CFR 255.2(b) typicality disclosure travels with the endorsements. */}
            <p className="text-xs text-gray-500 text-center mt-4 max-w-2xl mx-auto">
              Reviews are real, unedited Trustpilot posts and reflect individual
              experiences. Individual results vary and are not a guarantee of passing.
            </p>
          </div>
        </section>
      )}

      <CTABanner
        title="Ready to Get Your Insurance License?"
        subtitle="Choose your state above and enroll in a state-approved prelicensing or CE course today. Pass guarantee included in eligible states."
        ctaText="Browse All States"
        ctaHref="#states"
      />
    </>
  );
}
