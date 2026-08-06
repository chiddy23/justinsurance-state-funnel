import { passGuaranteeExcludedLabel } from "@/lib/pass-guarantee";
import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import { STATES } from "@/lib/states";
import { pleRequirement } from "@/lib/prelicensing-status";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

// ---------------------------------------------------------------------------
// Coverage count is DERIVED, never hand-typed: we serve every state except
// New York, so this self-corrects if coverage changes. Same derivation as
// /press. A hard-coded "nationwide" previously shipped here and contradicted
// the 49-state figure printed elsewhere on this same page.
// ---------------------------------------------------------------------------
const ALL_STATES = Object.values(STATES);
const SERVED_STATES = ALL_STATES.filter((s) => s.slug !== "new-york");
const SERVED_STATE_COUNT = SERVED_STATES.length;

// ---------------------------------------------------------------------------
// CE APPROVAL is a different fact from COVERAGE. `providerApprovalNumber` is a
// CONTINUING EDUCATION credential (see src/lib/prelicensing-status.ts), and the
// value "PENDING" is NOT an approval. Among the states we serve, Washington is
// still pending, so "continuing education across 49 states" would assert an
// approval we do not hold. Derived here so it self-corrects when WA issues.
// ---------------------------------------------------------------------------
const CE_APPROVAL_PENDING = SERVED_STATES.filter(
  (s) => s.providerApprovalNumber === "PENDING"
);
const CE_APPROVED_COUNT = SERVED_STATE_COUNT - CE_APPROVAL_PENDING.length;

/** "A", "A and B", "A, B, and C" — for naming states in prose. */
const formatStateNames = (states: { name: string }[]): string => {
  const names = states.map((s) => s.name);
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
};

const CE_APPROVAL_PHRASE =
  CE_APPROVAL_PENDING.length === 0
    ? `continuing education in all ${SERVED_STATE_COUNT} states we serve`
    : `continuing education in ${CE_APPROVED_COUNT} of the ${SERVED_STATE_COUNT} states we serve (our ${formatStateNames(
        CE_APPROVAL_PENDING
      )} approval${CE_APPROVAL_PENDING.length === 1 ? " is" : "s are"} still pending)`;

// ---------------------------------------------------------------------------
// DELIVERY-FORMAT FACTS — derived from states.ts, never hand-typed.
//
// This page previously named ONLY Minnesota and Michigan as proctor states and
// then asserted "In every other state the coursework is fully self-paced."
// Both halves were wrong: states.ts documents a disinterested third-party
// proctor for the course final exam in seven states, and several states impose
// other non-self-paced formats (Illinois live webinar hours, New Mexico live
// CE hours, California/Minnesota monitored seat time). The universal claim is
// gone; the enumeration is now computed from the same records the state pages
// render.
//
// Ohio must NOT appear in the proctor list: OAC 3901-5-07(F) accepts an honor
// affidavit "in place of a live proctor, so no third-party proctor is needed."
// Matching the exact phrase "disinterested third-party proctor" excludes it,
// and the negative test below is belt-and-braces if that wording ever changes.
// ---------------------------------------------------------------------------
const PROCTORED_FINAL_STATES = SERVED_STATES.filter((s) =>
  (s.specialNotices ?? []).some(
    (n) =>
      n.body.includes("disinterested third-party proctor") &&
      !n.body.includes("no third-party proctor")
  )
);
const PROCTOR_STATE_NAMES = formatStateNames(PROCTORED_FINAL_STATES);

/** States whose CE hours include a mandated live-instructor block (New Mexico). */
const LIVE_CE_STATES = SERVED_STATES.filter(
  (s) => typeof s.ce?.liveInstructorHours === "number"
);

const IL = STATES["illinois"];
const IL_LIVE_HOURS = IL?.classroomWebinarHours;
const IL_LINE = pleRequirement(IL?.prelicensing?.life?.hours);

/** Illinois live-format sentence — hours come from the record, not from memory. */
const IL_LIVE_SENTENCE =
  IL_LIVE_HOURS && IL_LINE.required
    ? `Illinois requires ${IL_LIVE_HOURS} of the ${IL_LINE.hours} prelicensing hours per line of authority to be attendance-verified live classroom/webinar instruction (215 ILCS 5/500-30(b); 50 Ill. Adm. Code Part 3119), plus its ${IL.ce.ethicsHours} CE ethics hours in that same live format (50 Ill. Adm. Code 3119.45).`
    : "";

const PROCTOR_SENTENCE = PROCTORED_FINAL_STATES.length
  ? `${PROCTOR_STATE_NAMES} require the course final exam to be administered by a disinterested third-party proctor you arrange — we supply the exam and the affidavit, you supply the proctor.`
  : "";

const LIVE_CE_SENTENCE = LIVE_CE_STATES.length
  ? `${formatStateNames(LIVE_CE_STATES)} require${
      LIVE_CE_STATES.length === 1 ? "s" : ""
    } ${LIVE_CE_STATES[0].ce.liveInstructorHours} of ${
      LIVE_CE_STATES.length === 1 ? "its" : "their"
    } ${LIVE_CE_STATES[0].ce.totalHours} biennial CE hours to be earned in a live-instructor format (13.4.7 NMAC).`
  : "";

/** Short form used in CTA copy, where the full enumeration will not fit. */
const SELF_PACED_CTA_CAVEAT = `Self-paced study in most of the ${SERVED_STATE_COUNT} states we serve${
  IL_LIVE_HOURS ? " — Illinois includes state-required live webinar hours" : " —"
}${
  PROCTORED_FINAL_STATES.length
    ? ` and ${PROCTORED_FINAL_STATES.length} states require a proctored final exam you arrange`
    : ""
}; New York is not currently served.`

export const metadata: Metadata = {
  title: { absolute: "About JustInsurance — 30,000+ Students Trained Since 2018" },
  description:
    "Founded by licensed agent Justin vom Eigen after watching talented people fail outdated exams. 30,000+ students trained. 93% completer pass rate. 49 states.",
  alternates: { canonical: "https://justinsuranceco.com/about" },
  openGraph: {
    title: "About JustInsurance — 30,000+ Students Trained Since 2018",
    description:
      "Founded by licensed agent Justin vom Eigen after watching talented people fail outdated exams. 30,000+ students trained. 93% completer pass rate.",
    url: "https://justinsuranceco.com/about",
    siteName: "JustInsurance",
    type: "website",
    images: [{ url: "/og-image.png", alt: "JustInsurance — About" }],
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "About", url: "https://justinsuranceco.com/about" },
]);

const orgPersonSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "JustInsurance LLC",
      alternateName: "Your Insurance License",
      url: "https://justinsuranceco.com",
      logo: "https://justinsuranceco.com/justinsurance-logo.png",
      foundingDate: "2018",
      founder: { "@type": "Person", name: "Justin vom Eigen" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "1806 N Flamingo Rd Ste 230",
        addressLocality: "Pembroke Pines",
        addressRegion: "FL",
        postalCode: "33028",
        addressCountry: "US",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "754-223-9744",
        email: "support@justinsuranceco.com",
      },
      sameAs: [
        "https://www.youtube.com/@InsuranceExam",
        "https://www.linkedin.com/company/justinsurance-llc",
        "https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html",
        "https://www.globenewswire.com/news-release/2025/12/10/3203363/0/en/JustInsurance-Unveils-93-Pass-Rate-Breakthrough-Offering-a-Scalable-Solution-to-the-U-S-Insurance-Agent-Shortage.html",
      ],
    },
    {
      "@type": "Person",
      name: "Justin vom Eigen",
      jobTitle: "Founder and CEO",
      worksFor: { "@type": "Organization", name: "JustInsurance LLC" },
      alumniOf: "Northeastern University",
      sameAs: [
        "https://www.youtube.com/@InsuranceExam",
        "https://www.linkedin.com/in/justin-vom-eigen-04198714a/",
        "https://www.nasdaq.com/tradetalks",
      ],
    },
  ],
};

const stats = [
  { value: "30,000+", label: "Students Trained" },
  { value: "93%", label: "First-Attempt Pass Rate*" },
  { value: String(SERVED_STATE_COUNT), label: "States Covered" },
  { value: "20,000+", label: "YouTube Subscribers" },
  { value: "$199", label: "Prelicensing" },
  { value: "$39", label: "CE (from)" },
];

// FTC/Lanham hygiene: self-issued material must not be presented as independent
// editorial coverage. The Dec 10, 2025 item is ONE company press release we paid
// GlobeNewswire to distribute; Yahoo Finance carries the automated syndication of
// that same release and stamps it "This is a paid press release. Contact the press
// release distributor directly with any inquiries." Those two entries are labeled
// as a press release, not as coverage. The InsuranceNerds entry is a republication
// of a company-supplied Q&A and its link resolves only to that site's homepage.
type PressItem = {
  outlet: string;
  date: string;
  title: string;
  href: string;
  /** Link text — "Read coverage" is reserved for independent editorial items. */
  linkLabel: string;
  /** Provenance note shown when the item is not independent editorial. */
  note?: string;
};

const press: PressItem[] = [
  {
    outlet: "NASDAQ TradeTalks",
    date: "Live at NASDAQ MarketSite",
    title: "Panel discussion on AI governance and innovation in financial services",
    href: "https://www.youtube.com/watch?v=AYuIOZCZpLQ",
    linkLabel: "Watch the appearance",
  },
  {
    outlet: "Yahoo Finance",
    date: "Dec 10, 2025",
    title: "JustInsurance Unveils 93% Pass-Rate Breakthrough",
    href: "https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html",
    linkLabel: "Read the press release",
    note: "Company press release — our GlobeNewswire release syndicated to Yahoo Finance, which labels it a paid press release. Not Yahoo Finance reporting.",
  },
  {
    outlet: "GlobeNewswire",
    date: "Dec 10, 2025",
    title:
      "JustInsurance Unveils 93% Pass-Rate Breakthrough, Offering a Scalable Solution to the U.S. Insurance Agent Shortage",
    href: "https://www.globenewswire.com/news-release/2025/12/10/3203363/0/en/JustInsurance-Unveils-93-Pass-Rate-Breakthrough-Offering-a-Scalable-Solution-to-the-U-S-Insurance-Agent-Shortage.html",
    linkLabel: "Read the press release",
    note: "Company press release issued by JustInsurance over a paid distribution wire. Not independent reporting.",
  },
  {
    outlet: "CityBiz",
    date: "Oct 30, 2025",
    title:
      "Q&A with Justin vom Eigen, Founder and CEO of JustInsurance, on Modernizing Insurance Education",
    href: "https://citybiz.co/article/765855/qa-with-justin-vom-eigen-founder-and-ceo-of-justinsurance-on-modernizing-insurance-education/",
    linkLabel: "Read coverage",
  },
  {
    outlet: "InsuranceNerds",
    date: "2025",
    title: "CEO Q&A republication",
    href: "https://insnerds.com",
    linkLabel: "Visit InsuranceNerds",
    note: "Republication of the company-provided CEO Q&A. Link goes to the InsuranceNerds site, not to a standalone article.",
  },
  {
    outlet: "Refresh Miami",
    date: "Dec 18, 2025",
    title:
      "JustInsurance offers pre-license education courses for aspiring agents and it's expanding in Miami",
    href: "https://refreshmiami.com/news/justinsurance-offers-pre-license-education-courses-for-aspiring-agents-and-its-expanding-in-miami/",
    linkLabel: "Read coverage",
  },
];

const crumbs = [
  { name: "Home", href: "/" },
  { name: "About" },
];

function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="text-2xl md:text-3xl font-bold text-navy mb-6 scroll-mt-24"
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-bold text-navy mt-6 mb-2">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-700 text-base leading-relaxed mb-4">{children}</p>;
}

function Quote({ children, author }: { children: React.ReactNode; author: string }) {
  return (
    <blockquote className="border-l-4 border-gold bg-gray-bg rounded-r-lg py-5 px-6 my-6">
      <p className="text-gray-800 text-base md:text-lg italic leading-relaxed mb-3">
        &ldquo;{children}&rdquo;
      </p>
      <footer className="text-navy font-semibold text-sm not-italic">— {author}</footer>
    </blockquote>
  );
}

export default function AboutPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={orgPersonSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            About Us
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            About JustInsurance — Built by a Licensed Agent, for Aspiring Agents
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            JustInsurance was founded by Justin vom Eigen — a former New York Life agent who
            watched talented people wash out of the industry because of outdated,
            soul-crushing prelicensing courses. Today we&apos;ve trained{" "}
            <strong className="text-white">over 30,000 students</strong> across{" "}
            <Link href="/#states" className="underline hover:text-gold">
              {SERVED_STATE_COUNT} states
            </Link>{" "}
            with a <strong className="text-white">93% first-attempt pass rate</strong>{" "}
            (among students who complete the course and recommended practice —{" "}
            <Link href="/pass-rates" className="underline hover:text-gold">
              see methodology
            </Link>
            ), offering modern{" "}
            <Link href="/prelicensing" className="underline hover:text-gold">
              insurance prelicensing courses
            </Link>{" "}
            and{" "}
            <Link href="/continuing-education" className="underline hover:text-gold">
              continuing education
            </Link>{" "}
            online.
          </p>
        </div>
      </section>

      {/* Credibility band — plain numbers, no animations.
          Surfaces year-founded + states + partners + students above the fold
          for B2B vendor diligence. Per CEO recs doc (2026-05-01). */}
      <section className="bg-gold/10 border-y border-gold/30 py-7 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-navy">2018</p>
            <p className="text-xs text-gray-700 uppercase tracking-wide mt-1">Since</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-navy">{SERVED_STATE_COUNT}</p>
            <p className="text-xs text-gray-700 uppercase tracking-wide mt-1">States</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-navy">1,000+</p>
            <p className="text-xs text-gray-700 uppercase tracking-wide mt-1">Agency Partners</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-navy">30,000+</p>
            <p className="text-xs text-gray-700 uppercase tracking-wide mt-1">Students Trained</p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="origin">The Origin Story</H2>
          <P>
            Justin vom Eigen studied at Northeastern University before starting his career in
            car sales — where he learned how people actually make decisions, and that trust is
            the thing that closes deals. In 2017 he jumped to New York Life as a licensed
            agent, then moved into recruiting at Senior Life Services as a regional team
            builder.
          </P>
          <P>
            That&apos;s where the problem became obvious. Justin kept recruiting smart, motivated
            people who would get excited about an insurance career — and then get steamrolled by
            the prelicensing exam. The courses hadn&apos;t been updated in years. The content was
            dense, dry, and disconnected from how the exam was actually written. Good people
            were failing, quitting, or spending weeks grinding through material that should have
            taken days.
          </P>
          <P>
            So in 2018 he started making YouTube videos — plain-English insurance licensing exam
            walkthroughs, recorded on his phone, explaining the concepts the way he wished someone
            had explained them to him. The channel grew past 20,000 subscribers. Thousands of
            candidates started messaging him after passing their exams. That was the signal.
          </P>
          {/* Launch year reconciled to January 2023 to match
              /about/justin-vom-eigen, which is both more specific ("founded
              JustInsurance LLC in November 2018; the platform launched in
              January 2023") and internally corroborated — that page has Justin
              in an agency-leadership role through December 2022, which a 2022
              platform launch would overlap. */}
          <P>
            JustInsurance launched publicly in January 2023 as a full prelicensing education
            platform built on the same principle: explain it the way an agent would, cut the
            filler, and get people across the finish line.
          </P>
          <Quote author="Justin vom Eigen, Founder & CEO">
            I kept recruiting talented people who would fail their prelicensing exams or quit
            halfway through because the courses were ancient and soul-crushing. I started making
            YouTube videos to actually help people pass, and when thousands started using them, I
            realized I&apos;d stumbled onto something big.
          </Quote>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="what-we-do">What JustInsurance Does</H2>
          <P>
            JustInsurance is a fully online insurance education platform offering insurance
            prelicensing courses, insurance continuing education, and full licensing support
            across {SERVED_STATE_COUNT} states. Our courses carry state approval wherever the
            state approves that course type &mdash; {CE_APPROVAL_PHRASE}, and prelicensing in the
            states that actually mandate it. Coursework is self-paced except where state law
            requires live instruction, monitored seat time, or a proctored exam.{" "}
            {IL_LIVE_SENTENCE} {PROCTOR_SENTENCE} {LIVE_CE_SENTENCE} California and Minnesota also
            enforce monitored seat time that cannot be accelerated, so those hours take as long as
            the state says they take (10 CCR &sect;&sect; 2188.2, 2188.5; Minn. Stat. 45.305,
            subd. 4). Outside those state-imposed formats you study on your own schedule &mdash;
            and everywhere, it&apos;s built for the way candidates actually study.
          </P>

          <H3>For New Agents</H3>
          <P>
            If you&apos;ve never held a license, we handle the full path: a life and health
            insurance license prelicensing course, full-length practice exams, exam scheduling
            guidance, background check walkthroughs, and the NIPR application process. Most
            students finish in two to six weeks, depending on the state.
          </P>

          <H3>For Licensed Agents</H3>
          <P>
            For existing producers, in the states where we hold CE approval, we deliver packages that cover your state&apos;s required
            hours plus ethics — reported directly to your Department of Insurance, typically the
            same business day you finish.
          </P>

          <H3>For Agencies</H3>
          <P>
            Agencies plugging us into their recruiting funnel get a full B2B toolkit: a developer
            API for onboarding automation, real-time candidate tracking dashboards, white-label
            sales pages, and custom automation packages built around each agency&apos;s specific
            recruiting workflow. Most insurance education providers offer a portal; we offer a
            platform that integrates into whatever stack you already use.
          </P>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <H2 id="numbers">By the Numbers</H2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-gray-bg rounded-xl p-6 text-center border border-gray-200"
              >
                <p className="text-3xl md:text-4xl font-bold text-navy mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-6 text-center max-w-2xl mx-auto">
            *93% first-attempt pass rate reflects JustInsurance student outcomes among students who
            complete the course and recommended practice. Founded 2018, public since January
            2023.{" "}
            <Link href="/pass-rates" className="text-navy font-semibold underline hover:text-gold">
              See how we calculate this →
            </Link>
          </p>
        </div>
      </section>

      {/* How We're Different */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="different">How We&apos;re Different</H2>
          <P>
            Most insurance education companies sell a course and stop there. We handle the whole
            journey, and we built the platform the way an agent would want it built:
          </P>
          <ul className="list-disc pl-6 space-y-3 text-gray-700 text-base leading-relaxed mb-6">
            <li>
              <strong className="text-navy">Developer API for agencies</strong> — plug recruits
              directly into your existing onboarding flow with a documented API, not a portal.
            </li>
            <li>
              <strong className="text-navy">Agency dashboards</strong> with real-time candidate
              tracking so you always know who&apos;s progressing and who&apos;s stuck.
            </li>
            <li>
              <strong className="text-navy">Custom automation packages</strong> — we&apos;ll build
              recruiting, onboarding, and licensing automations tailored to your agency&apos;s
              workflow, not a pre-baked template.
            </li>
            <li>
              <strong className="text-navy">White-label sales pages</strong> for partner agencies
              — your branding, your pricing, our LMS under the hood.
            </li>
            <li>
              <strong className="text-navy">Full licensing process handled</strong> — not just
              coursework. Exam scheduling, background checks, fingerprinting guidance, NIPR
              application walkthroughs.
            </li>
            <li>
              <strong className="text-navy">Self-paced completion in most states</strong> —
              students move at their own pace, on any device, without waiting on a fixed classroom
              schedule. Where state law requires otherwise, the schedule is the state&apos;s, not
              ours: Illinois requires {IL_LIVE_HOURS} attendance-verified live webinar hours per
              line of authority (plus live-format CE ethics hours); {PROCTOR_STATE_NAMES} require a
              final exam you schedule with a disinterested third-party proctor;{" "}
              {formatStateNames(LIVE_CE_STATES)} requires part of its CE hours in a live-instructor
              format; and California and Minnesota meter seat time, so those hours cannot be
              finished early.
            </li>
            <li>
              <strong className="text-navy">Plain English instruction</strong> — no industry
              jargon, no outdated academic framing. Taught the way a working agent would explain
              it.
            </li>
            <li>
              <strong className="text-navy">Live Q&amp;A sessions</strong> included with every
              course.
            </li>
            <li>
              <strong className="text-navy">Pass guarantee*</strong> (available in most states) —
              complete the recommended hours, score 80% or higher on any three practice-exam
              attempts, and sit for your state exam within 30 days of enrolling. If you
              don&apos;t pass, we&apos;ll give you a fresh study period, reset your practice exams,
              and reimburse your state exam fee.
            </li>
          </ul>
          <p className="text-gray-500 text-xs leading-relaxed mb-6">
            *Pass guarantee is available in most states and is not offered in{" "}
            {passGuaranteeExcludedLabel()}.{" "}
            <Link href="/pass-rates" className="text-navy font-semibold underline hover:text-gold">
              Full terms
            </Link>
            .
          </p>
          <Quote author="Justin vom Eigen">
            We turned the most boring part of insurance into something that doesn&apos;t make you
            want to quit your career before it starts.
          </Quote>
        </div>
      </section>

      {/* About Justin */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="justin">About Justin vom Eigen</H2>
          <P>
            Justin vom Eigen is the Founder and CEO of JustInsurance LLC. A Northeastern
            University alum, he spent two years writing life and health policies as a licensed
            agent at New York Life before moving into recruiting and onboarding at Senior Life
            Services — where he saw firsthand just how broken the prelicensing pipeline was.
          </P>
          <P>
            Before JustInsurance was a company, it was a YouTube channel. Justin started{" "}
            <a
              href="https://www.youtube.com/@InsuranceExam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy font-semibold underline hover:text-gold"
            >
              @InsuranceExam
            </a>{" "}
            to give free exam prep to anyone trying to break into the industry. The channel
            passed 20,000 subscribers and became the direct origin of the business — real students
            using the videos, passing their exams, and asking for more.
          </P>
          <P>
            In 2025 Justin appeared live at NASDAQ MarketSite in New York on{" "}
            <a
              href="https://www.youtube.com/watch?v=AYuIOZCZpLQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy font-semibold underline hover:text-gold"
            >
              NASDAQ TradeTalks
            </a>
            , joining a panel alongside Dr. Christos Makridis of Gallup / Arizona State
            University to discuss AI governance, operational resilience, and innovation in
            financial services. JustInsurance is headquartered in Pembroke Pines, Florida, and
            opened a second office in the Miami Brickell district in December 2025.
          </P>
          <Quote author="Justin vom Eigen">
            Car sales taught me how people actually make decisions, and that trust is the key to
            relationships. Insurance taught me how brutal the entry barrier is for new agents. I
            combined those lessons to build a company that sells confidence and actually gets
            people across the finish line.
          </Quote>
          <p className="mt-6">
            <Link
              href="/about/justin-vom-eigen"
              className="inline-flex items-center gap-1 text-navy font-semibold underline hover:text-gold"
            >
              Read Justin&apos;s full bio &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* As Seen In */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="press">As Seen In</H2>
          <P>
            JustInsurance has appeared in national financial media and insurance industry
            publications discussing the modernization of insurance education and the U.S.
            insurance agent shortage. The list below separates independent coverage &mdash; such
            as the NASDAQ TradeTalks appearance, the citybiz Q&amp;A, and Refresh Miami &mdash;
            from material we issued ourselves: the Dec 10, 2025 item is a JustInsurance press
            release distributed over a paid newswire and syndicated to Yahoo Finance, not
            third-party reporting. Full{" "}
            <Link href="/press" className="text-navy font-semibold underline hover:text-gold">
              press and media
            </Link>{" "}
            listings are collected here:
          </P>
          <ul className="space-y-4">
            {press.map((p) => (
              <li
                key={p.outlet + p.date}
                className="bg-white rounded-xl p-5 border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                  <p className="font-bold text-navy">{p.outlet}</p>
                  <p className="text-xs text-gray-500">{p.date}</p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">{p.title}</p>
                {p.note && (
                  <p className="text-gray-500 text-xs leading-relaxed mb-2 italic">{p.note}</p>
                )}
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold font-semibold text-sm hover:underline"
                >
                  {p.linkLabel} &rarr;
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="mission">Our Mission</H2>
          <P>
            JustInsurance exists to help more good people become licensed insurance agents —
            faster, cheaper, and with more confidence than the legacy education industry allows.
            We build for working adults who don&apos;t have time to waste on filler, for career
            changers who need modern instruction, and for agencies who need reliable candidates.
          </P>
          <P>
            Our brand principle is simple:{" "}
            <strong className="text-navy">Built by agents, for agents.</strong>
          </P>
          <P>
            If you&apos;re ready to get your insurance license — or renew one you already hold —
            we&apos;re built to help. Have a question first? Check our{" "}
            <Link href="/faq" className="text-navy font-semibold underline hover:text-gold">
              FAQ
            </Link>
            .
          </P>
        </div>
      </section>

      {/* subtitle is a STRING prop, not JSX — the count must be interpolated with
          ${...} inside a template literal. A bare {SERVED_STATE_COUNT} in a quoted
          string would render as literal source text to visitors. */}
      <CTABanner
        title="Ready to Get Licensed?"
        subtitle={`Prelicensing from $199, state-approved where the state requires it. Pass guarantee in most states. ${SELF_PACED_CTA_CAVEAT}`}
        ctaText="Find My State"
        ctaHref="/#states"
      />
    </>
  );
}
