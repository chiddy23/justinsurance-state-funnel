import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import { isPrelicensingHeld } from "@/lib/prelicensing-status";
import { passGuaranteeExcludedLabel } from "@/lib/pass-guarantee";

// ---------------------------------------------------------------------------
// "State-approved in 49 states" counted Washington as approved. Both New York
// AND Washington carry providerApprovalNumber === "PENDING" in states.ts, so the
// honest number is 48.
//
// Audit 2026-07-22: the earlier fix got the count right but broke the
// DISCLOSURE. It filtered New York out of the population BEFORE looking for
// pending approvals, so the pending list contained only Washington and the page
// read "...in 49 states. Our state provider approval is active in 48 of them.
// Our Washington provider approval is still pending." A reader takes that to
// mean Washington is the single outstanding approval. It is not: recounted
// directly from states.ts, there are 50 state records and
// providerApprovalNumber === "PENDING" in exactly two of them, new-york (line
// 5835) and washington (line 8507). Silently dropping New York from the
// denominator also contradicted this same page, which lists New York among the
// pass-guarantee exclusions via passGuaranteeExcludedLabel() with no
// explanation of why.
//
// Now derived over ALL states, so both pending approvals are always named and
// the whole block self-corrects the moment an approval issues. Prelicensing is
// held only where isPrelicensingHeld() is true (PENDING approval AND a numeric
// prelicensing hour requirement) — New York today; Washington requires no
// prelicensing on any line, so it is not held.
// ---------------------------------------------------------------------------
const ALL_STATES = Object.values(STATES);
const TOTAL_STATE_COUNT = ALL_STATES.length;
const APPROVAL_PENDING_STATES = ALL_STATES.filter(
  (s) => s.providerApprovalNumber === "PENDING"
);
const APPROVED_STATE_COUNT = TOTAL_STATE_COUNT - APPROVAL_PENDING_STATES.length;
// Split the pending states by what the pending approval actually costs the
// reader, so neither consequence is asserted about the wrong state. A held state
// has no prelicensing enrollment at all; a pending-but-not-held state sells the
// course but cannot report the completion to the DOI yet — the same distinction
// /license-renewal-guide draws with its "CE approval pending — not yet
// DOI-reportable" row badge.
const PRELICENSING_HELD_STATES = APPROVAL_PENDING_STATES.filter(isPrelicensingHeld);
const CE_REPORTING_PENDING_STATES = APPROVAL_PENDING_STATES.filter(
  (s) => !isPrelicensingHeld(s)
);

/** "A", "A and B", "A, B, and C" — for naming pending states in prose. */
const formatStateNames = (states: { name: string }[]): string => {
  const names = states.map((s) => s.name);
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
};

// No leading space in the string itself — the JSX site supplies an explicit
// {" "} separator, because Babel strips the trailing whitespace of a text line
// that ends in a newline and would otherwise run this note straight onto the
// preceding sentence. Empty string renders nothing once every approval issues.
const PENDING_APPROVAL_NOTE =
  APPROVAL_PENDING_STATES.length === 0
    ? ""
    : [
        `Approval is still pending in ${formatStateNames(
          APPROVAL_PENDING_STATES
        )}.`,
        PRELICENSING_HELD_STATES.length > 0 &&
          `Prelicensing in ${formatStateNames(
            PRELICENSING_HELD_STATES
          )} is not open for enrollment yet.`,
        CE_REPORTING_PENDING_STATES.length > 0 &&
          `CE completions in ${formatStateNames(
            CE_REPORTING_PENDING_STATES
          )} are not yet reportable to the state.`,
      ]
        .filter(Boolean)
        .join(" ");

// The 93% figure's real cohort, matching the methodology disclosed on /pass-rates.
// Reused everywhere the rate appears so the qualifier can't be silently truncated
// again: the short form ("students who complete the course") dropped the material
// 80%+-practice-exam condition and overstated who the 93% applies to.
const PASS_RATE_COHORT =
  "students who completed the full course, finished the recommended hours, and scored 80%+ on the practice exam three consecutive times before testing";

export const metadata: Metadata = {
  title: {
    absolute: "Press & Media | JustInsurance | NASDAQ · Yahoo Finance",
  },
  description: `JustInsurance press releases and media appearances. Justin vom Eigen featured on NASDAQ TradeTalks; press release syndicated to Yahoo Finance. 93% pass rate among students who complete the full course and recommended practice; 30,000+ students trained; state-approved in ${APPROVED_STATE_COUNT} states.`,
  robots: "index, follow",
  alternates: {
    canonical: "https://justinsuranceco.com/press",
  },
  openGraph: {
    title: "Press & Media | JustInsurance | NASDAQ · Yahoo Finance",
    description:
      "JustInsurance press releases and media appearances. Justin vom Eigen featured on NASDAQ TradeTalks. 93% pass rate among students who complete the full course and recommended practice.",
    url: "https://justinsuranceco.com/press/",
    siteName: "JustInsurance",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        alt: "JustInsurance — Online Insurance License Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press & Media | JustInsurance",
    description:
      "Justin vom Eigen featured on NASDAQ TradeTalks. 93% pass rate among students who complete the full course and recommended practice in insurance licensing education.",
    images: ["/og-image.png"],
  },
};

const pressSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "JustInsurance Unveils 93% Pass-Rate Breakthrough, Offering a Scalable Solution to the U.S. Insurance Agent Shortage",
  datePublished: "2025-12-10",
  dateModified: "2025-12-10",
  author: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
  publisher: {
    "@type": "Organization",
    name: "GlobeNewswire",
    url: "https://www.globenewswire.com",
  },
  description:
    "JustInsurance announces a 93% pass rate (among students who complete the full course and recommended practice) for insurance licensing exams, with 20,000+ students trained.",
  about: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
    foundingLocation: "Pembroke Pines, Florida",
    sameAs: [
      "https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html",
      "https://www.globenewswire.com/news-release/2025/12/10/3203363/0/en/JustInsurance-Unveils-93-Pass-Rate-Breakthrough-Offering-a-Scalable-Solution-to-the-U-S-Insurance-Agent-Shortage.html",
    ],
  },
};

const MEDIA_OUTLETS = [
  {
    name: "NASDAQ",
    logo: null,
    description: "TradeTalks — Live from NASDAQ MarketSite",
    url: "https://www.youtube.com/watch?v=AYuIOZCZpLQ&t=15s",
  },
  {
    name: "Yahoo Finance",
    logo: null,
    description: "Press release syndication",
    url: "https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html",
  },
  {
    name: "GlobeNewswire",
    logo: null,
    description: "Official press release distribution",
    url: "https://www.globenewswire.com/news-release/2025/12/10/3203363/0/en/JustInsurance-Unveils-93-Pass-Rate-Breakthrough-Offering-a-Scalable-Solution-to-the-U-S-Insurance-Agent-Shortage.html",
  },
];

// "900% year-over-year growth" removed: the release named no metric, baseline,
// period, or methodology, and nothing on the site substantiates it. An
// unqualified growth figure is the kind of claim we cannot defend, so it is out
// rather than merely footnoted.
const PRESS_STATS = [
  { value: "93%", label: "Student Pass Rate*" },
  { value: String(APPROVED_STATE_COUNT), label: "State Approvals" },
  { value: "30,000+", label: "Students Trained" },
];

export default function PressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pressSchema).replace(/</g, "\u003c") }}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Press &amp; Media
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            JustInsurance in the News
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our 93% first-attempt pass rate (among {PASS_RATE_COHORT}) was
            announced in a company press release distributed via GlobeNewswire on
            December 10, 2025 and syndicated to Yahoo Finance.{" "}
            <Link href="/pass-rates" className="underline hover:text-gold">
              See methodology
            </Link>
            .
          </p>
        </div>
      </section>

      {/* As Seen On */}
      <section className="bg-gray-50 border-b border-gray-200 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-widest mb-8">
            Press Releases &amp; Appearances
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {MEDIA_OUTLETS.map((outlet) => (
              <a
                key={outlet.name}
                href={outlet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
                aria-label={`${outlet.name} — ${outlet.description}`}
              >
                <span className="text-2xl md:text-3xl font-bold text-gray-700 group-hover:text-navy transition-colors">
                  {outlet.name}
                </span>
                <span className="text-xs text-gray-500">{outlet.description}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {PRESS_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-navy mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            *93% pass rate among {PASS_RATE_COHORT}. Individual results vary by
            preparation, state, and line of authority.{" "}
            <Link href="/pass-rates" className="underline hover:text-navy">
              See how we calculate this
            </Link>
            .
          </p>
        </div>
      </section>

      {/* NASDAQ Trade Talks Video */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              NASDAQ TradeTalks
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
              Justin vom Eigen on NASDAQ TradeTalks
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              JustInsurance Founder &amp; CEO Justin vom Eigen joined NASDAQ TradeTalks
              host Jill Malandrino at the NASDAQ MarketSite to discuss AI-driven
              innovation in insurance education and cybersecurity resilience.
            </p>
          </div>
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/AYuIOZCZpLQ?start=15"
              title="JustInsurance on NASDAQ TradeTalks — Justin vom Eigen"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Broadcast live from the NASDAQ MarketSite &bull; Hosted by Jill Malandrino
          </p>
        </div>
      </section>

      {/* Featured Press Release */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-10 text-center">
            Featured Coverage
          </h2>

          <article className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {/* Article header */}
            <div className="bg-navy px-8 py-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Press Release
                </span>
                <span className="bg-navy-light text-white text-xs font-medium px-3 py-1 rounded-full">
                  December 10, 2025
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
                JustInsurance Unveils 93% Pass-Rate Breakthrough, Offering a
                Scalable Solution to the U.S. Insurance Agent Shortage
              </h3>
            </div>

            {/* Article body */}
            <div className="px-8 py-8 space-y-5 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-navy">Pembroke Pines, FL</strong> —
                JustInsurance LLC announced a landmark milestone in insurance
                education: a{" "}
                <strong>93% first-attempt pass rate</strong> for insurance
                licensing exams (among {PASS_RATE_COHORT}).
              </p>

              {/* Product description rewritten to match what we actually sell.
                  The prior copy described an "AI-powered adaptive learning
                  platform" with "personalized learning pathways" and
                  "real-world coaching that simulates agency environments" — no
                  such product exists on this site, and no other page describes
                  one. This paragraph now mirrors the course contents set out in
                  the FAQ on the state and hub pages. */}
              <p>
                The company, founded by Justin vom Eigen, attributes the result
                to how the courses are built rather than to any single
                technology: course content organized by state exam topic,
                chapter-by-chapter review quizzes, full-length practice exams
                that mirror the format and difficulty of the real state exam,
                and a final exam — all self-paced, on any device, and written in
                plain English by a licensed agent.
              </p>

              <blockquote className="border-l-4 border-gold pl-6 py-2 bg-gray-50 rounded-r-lg">
                <p className="text-navy font-medium italic">
                  &ldquo;The insurance industry faces a critical shortage of
                  qualified agents. Our platform was built to solve exactly
                  that — by removing the three barriers that cause most
                  candidates to fail: a lack of a clear path, overcomplicated
                  material, and outdated resources.&rdquo;
                </p>
                <footer className="mt-2 text-sm text-gray-500 not-italic">
                  — Justin vom Eigen, Founder, JustInsurance LLC
                </footer>
              </blockquote>

              <p>
                JustInsurance has trained{" "}
                <strong>20,000+ students</strong> in life, health, and life
                &amp; health insurance prelicensing and continuing education
                (CE). Based on the company&apos;s internal completion tracking,
                the platform&apos;s students also show{" "}
                <strong>strong course-completion rates</strong> — meaning more
                agents completing training and entering the field.
              </p>

              <p>
                The platform addresses the three most common failure points for
                insurance exam candidates:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Lack of a clear, measurable path to success</li>
                <li>Overcomplication of exam topics</li>
                <li>Limited access to updated, state-specific materials</li>
              </ul>

              {/* CE is not a flat $39 — ce.packagePrice in states.ts ranges from
                  $39 to $111 depending on the state's required hours. Every
                  other page says "from $39"; this one now matches. */}
              <p>
                With prelicensing courses at <strong>$199</strong> and CE
                packages <strong>from $39</strong> (CE package pricing varies by
                state), JustInsurance offers affordable pass-guarantee pricing in
                eligible states (the guarantee is not offered in{" "}
                {passGuaranteeExcludedLabel()}), with same-day DOI reporting in
                most cases after course completion.
              </p>
            </div>

            {/* Read the full release */}
            <div className="px-8 pb-8 flex flex-wrap gap-4">
              <a
                href="https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-navy text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-navy-dark transition-colors"
              >
                Read on Yahoo Finance
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://www.globenewswire.com/news-release/2025/12/10/3203363/0/en/JustInsurance-Unveils-93-Pass-Rate-Breakthrough-Offering-a-Scalable-Solution-to-the-U-S-Insurance-Agent-Shortage.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-navy text-navy px-5 py-3 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Full Release on GlobeNewswire
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                Media Contact
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                For press inquiries, interviews, or media assets, please reach
                out directly. We welcome opportunities to discuss the insurance
                licensing industry, agent shortage solutions, and our
                educational model.
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:support@justinsuranceco.com"
                  className="flex items-center gap-3 text-navy hover:text-gold transition-colors font-medium"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@justinsuranceco.com
                </a>
                <a
                  href="tel:7542239744"
                  className="flex items-center gap-3 text-navy hover:text-gold transition-colors font-medium"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  754-223-9744
                </a>
                <div className="flex items-start gap-3 text-gray-600 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="mb-1"><span className="text-gray-500 text-xs uppercase tracking-wide">Mail:</span> PO BOX 1025, Rincon PR 00677</p>
                    <p><span className="text-gray-500 text-xs uppercase tracking-wide">Registered:</span> 1806 N Flamingo Rd Ste 230, Pembroke Pines, FL 33028</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-navy mb-4">About JustInsurance</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                JustInsurance LLC (d/b/a Your Insurance License) is an online
                insurance education provider offering prelicensing and
                continuing education (CE) courses for life and health insurance
                agents. Our state provider approval is active in{" "}
                {APPROVED_STATE_COUNT} of the {TOTAL_STATE_COUNT} states.
                {" "}{PENDING_APPROVAL_NOTE}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Founded by Justin vom Eigen in Pembroke Pines, Florida,
                JustInsurance has trained 30,000+ students and maintains a
                93% first-attempt exam pass rate (among {PASS_RATE_COHORT}).
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  State-approved in {APPROVED_STATE_COUNT} states
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  93% first-attempt pass rate (among {PASS_RATE_COHORT})
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  30,000+ students trained
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Pass guarantee in eligible states
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Join 30,000+ Students Nationwide?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get your insurance license online — $199 prelicensing, CE from $39,
            pass guarantee in eligible states.
          </p>
          <Link
            href="/"
            className="inline-block bg-gold text-navy font-bold px-8 py-4 rounded-lg text-lg hover:bg-gold-light transition-colors"
          >
            Browse Courses by State
          </Link>
        </div>
      </section>
    </>
  );
}
