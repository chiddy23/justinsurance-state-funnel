import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import FAQAccordion from "@/components/FAQAccordion";
import ArticleByline from "@/components/ArticleByline";
import TrustBar from "@/components/TrustBar";
import PressLogosBar from "@/components/PressLogosBar";
import { STATES } from "@/lib/states";
import {
  PC_STATE_SLUGS,
  getPCPackagesForState,
} from "@/data/pc-ce-packages";
import {
  SchemaMarkup,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateArticleSchemaWithReviewer,
} from "@/lib/schema";
import {
  CE_APPROVED_COUNT,
  CE_PENDING_LABEL,
  CE_PENDING_STATE_NAMES,
} from "@/lib/site-facts";

// ---------------------------------------------------------------------------
// COVERAGE vs. APPROVAL — two different facts this page used to blur.
//
// Counted directly from src/lib/states.ts (50 state records): exactly two carry
// providerApprovalNumber === "PENDING" — New York AND Washington. So our active
// state CE provider approval covers 48 states, not 49, and Washington was being
// silently counted as approved. Separately, we publish L&H CE for every state
// except New York, which is 49 states of *coverage*. The old copy quoted the
// 49-state coverage figure inside a paragraph about state approvals and named
// only New York as pending, which asserted an approval we do not hold in
// Washington.
//
// Both figures are derived (via src/lib/site-facts.ts, which reads states.ts) so
// the copy self-corrects the moment an approval issues. Note this does NOT touch
// the P&C coverage grid: neither pending state has a P&C CE package, so every
// state shown in that grid genuinely is state-approved.
// ---------------------------------------------------------------------------
const LH_CE_SERVED_COUNT = Object.values(STATES).filter(
  (s) => s.slug !== "new-york",
).length;

/** ", with New York and Washington still pending" — empty once every approval issues. */
const CE_PENDING_CLAUSE = CE_PENDING_STATE_NAMES.length
  ? `, with ${CE_PENDING_LABEL} still pending`
  : "";

/** Names every state where our CE provider approval has not issued yet. */
const CE_PENDING_SENTENCE = CE_PENDING_STATE_NAMES.length
  ? ` Our state CE provider approval is also still pending in ${CE_PENDING_LABEL}, so we do not describe CE in ${
      CE_PENDING_STATE_NAMES.length === 1 ? "that state" : "those states"
    } as state-approved.`
  : "";

// Title/meta/H1 rewrite 2026-06-08 — SERP CTR fix.
// Diagnosis (GSC May 10–June 6): pos 3.07 / 3,525 imp / 1 click / 0.03% CTR.
// Page was "ranked but invisible" — competitors (Kaplan $49, XCEL $40 FL,
// 360training $39) win every click by surfacing price + credit hours +
// state-approved + auto-reporting in the SERP snippet. Old title surfaced
// none of those four hooks. Each hook now in title or meta first 120 chars.
const PAGE_TITLE = "P&C CE from $39 — 24-Hr State-Approved | JustInsurance";
const PAGE_DESC =
  "State-approved Property & Casualty CE from $39. 24-hour packages in 25 states, typically same-day DOI reporting, instant certificate. IDECC-certified instructor — pick your state and finish today.";
const CANONICAL = "https://justinsuranceco.com/property-and-casualty-ce";

export function generateMetadata(): Metadata {
  return {
    title: { absolute: PAGE_TITLE },
    description: PAGE_DESC,
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: PAGE_TITLE,
      description: PAGE_DESC,
      url: CANONICAL,
      type: "website",
      images: [
        { url: "/og-image.png", alt: "Property & Casualty CE — JustInsurance" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: PAGE_TITLE,
      description: PAGE_DESC,
      images: ["/og-image.png"],
    },
  };
}

const faqs = [
  {
    question: "What is Property & Casualty (P&C) continuing education?",
    answer:
      "Property & Casualty continuing education is the state-mandated training that licensed P&C insurance producers must complete each renewal cycle to keep their license active. Coursework covers property coverage (homeowners, commercial property, inland marine), casualty coverage (personal and commercial auto, general liability, workers' compensation, professional liability), ethics, and any state-specific topics such as flood (NFIP), anti-fraud, or state insurance law updates.",
  },
  {
    question: "Who needs to complete P&C CE?",
    answer:
      "Anyone holding an active resident or non-resident Property & Casualty producer license — including Personal Lines and Commercial Lines sub-licenses in states that issue them. If you sell auto, homeowners, business, or workers' comp insurance, your state's Department of Insurance requires you to complete CE on a recurring schedule. In states that track credits by line of authority, L&H credits will not satisfy a P&C requirement; other states pool CE across every license you hold. Check your state page for which rule applies.",
  },
  {
    question: "How often is P&C CE required?",
    answer:
      "Most states run a 2-year renewal cycle for P&C licensees. A handful operate on different cycles — Iowa is 3 years, Arizona is 4 years, and Massachusetts runs a single 3-year (36-month) cycle with a higher first-term requirement: 60 hours before your initial renewal, then 45 hours including 3 hours of ethics every 3-year period after that (211 CMR 50.04). Your CE deadline is typically tied to your license expiration date, and credits must be reported before that date to avoid a lapse.",
  },
  {
    question: "Do P&C hour requirements differ by state?",
    answer:
      "Yes — significantly. Most states require 24 hours per cycle (typically 21 P&C electives + 3 ethics). South Dakota requires 10 hours per license qualification and New York 15 credits per 2-year cycle. Virginia and Missouri require 16 hours. Kansas requires 18 hours. Iowa requires 36 hours per 3-year cycle. Arizona requires 48 hours per 4-year cycle. Florida is 24 hours per 2-year cycle for producers in their first 6 years of licensure and 20 hours after that (Fla. Stat. §626.2815), while Massachusetts requires 60 hours before your first renewal and 45 hours each 3-year period after. Always check your specific state page for the exact breakdown that applies to your license type.",
  },
  {
    question: "Does my P&C CE need to include flood (NFIP) training?",
    answer:
      "Federal law sets a one-time requirement, not a recurring one: Section 207 of the Flood Insurance Reform Act of 2004, implemented through the FEMA notice at 70 Fed. Reg. 52,117 (Sept. 1, 2005), calls for a one-time minimum of 3 hours of flood education for producers who sell NFIP policies. Any recurring flood training comes from an individual state, not from federal law — New York, for example, requires P&C licensees to include 1 hour of flood instruction in each 2-year cycle. Several state P&C packages — including our Florida Homeowners + Flood track — bundle NFIP-aligned content. Kansas requires its resident P&C and Personal Lines licensees who may sell flood policies to complete a one-time 3-hour flood course, and counts those 3 hours inside the 18-hour biennial requirement rather than on top of it.",
  },
  {
    question: "When are CE credits reported to my state's Department of Insurance?",
    answer:
      "JustInsurance typically electronically reports your completion to your state's Department of Insurance the same business day you finish the course. Most states then post the credit to your license record within a few business days, and you receive a completion certificate by email the same day so you have proof of credit on file in the meantime.",
  },
  {
    question: "Can I combine my Life & Health and P&C CE in one package?",
    answer:
      "It depends on your state. Several states pool the requirement across every license you hold — Texas caps a producer at 24 hours total no matter how many licenses they carry (Tex. Ins. Code §4004.053), and Washington lets you apply any approved insurance CE course regardless of the lines of authority on your license — so in those states one package can satisfy both. Other states track credits per license qualification and expect P&C-specific coursework. Confirm on your state's CE page before buying a second package. Our L&H CE catalog is available at the Continuing Education hub, and pricing matches our P&C packages.",
  },
  {
    question: "What happens if I miss my P&C CE deadline?",
    answer:
      "Consequences vary widely by state. Your license generally becomes inactive on the expiration date and you cannot legally write new business. Grace periods are not uniform — many states have none at all, some allow 30 days, and several run a full year. In most states you then have a reinstatement window running to roughly 12 months from expiration in which you can complete your CE, pay a reinstatement fee, and reinstate without retesting; only after that window closes do you generally have to reapply as a new applicant, which can mean retaking the prelicensing course and the state exam. A few states are much shorter — Idaho is 90 days, North Carolina 4 months, South Carolina 180 days — and North Dakota cancels the license at expiration. Always complete CE well before your deadline — same-day reporting typically means your completion reaches the state the day you finish, but most states still take a few business days to post the credit to your record.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Property & Casualty CE", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(faqs);

const articleSchema = generateArticleSchemaWithReviewer({
  headline:
    "State-Approved Property & Casualty Continuing Education",
  description: PAGE_DESC,
  datePublished: "2026-04-29",
  url: CANONICAL,
});

// Hub-page schemas: WebPage + EducationalOccupationalCredential, mirroring
// the pattern shipped on /non-resident-insurance-license (commit 6bd1104).
// The credential schema gives Google an explicit "this is the canonical
// resource for this credential" signal, reinforcing the topical-cluster
// hub-and-spoke architecture across the 25 state P&C CE pages.
const credentialSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalCredential",
  name: "Property & Casualty Insurance Producer License — Continuing Education",
  description:
    "Continuing education credit hours required of licensed Property & Casualty insurance producers by each state Department of Insurance. Coursework covers property coverage, casualty coverage, ethics, and state-specific topics (flood, anti-fraud, state insurance law updates) needed to maintain an active P&C producer license.",
  credentialCategory: "Continuing Education",
  recognizedBy: {
    "@type": "Organization",
    name: "National Association of Insurance Commissioners (NAIC)",
    url: "https://content.naic.org",
  },
  educationalLevel: "Producer",
  competencyRequired:
    "Active Property & Casualty (or Personal Lines / Commercial Lines) producer license. CE hour requirements and renewal cycle vary by state — typically 24 hours every 2 years, including 3 hours of ethics.",
  url: CANONICAL,
};

// AggregateOffer over every P&C CE package in every supported state.
// Computed at build time so price range is always accurate. Enables Google
// to render the "from $39" price-rich SERP badge — a primary CTR lever
// missing in the May 10–June 6 GSC window (pos 3.07 / 0.03% CTR).
function buildAggregateOfferSchema() {
  const allPrices: number[] = [];
  let offerCount = 0;
  for (const slug of PC_STATE_SLUGS) {
    for (const pkg of getPCPackagesForState(slug)) {
      const n = parseFloat(pkg.price.replace(/[^0-9.]/g, ""));
      if (!isNaN(n) && n > 0) allPrices.push(n);
      offerCount++;
    }
  }
  const lowPrice = Math.min(...allPrices).toFixed(2);
  const highPrice = Math.max(...allPrices).toFixed(2);
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice,
    highPrice,
    offerCount,
    availability: "https://schema.org/InStock",
    url: CANONICAL,
    seller: { "@id": "https://justinsuranceco.com#organization" },
    itemOffered: {
      "@type": "EducationalOccupationalCredential",
      name: "Property & Casualty Insurance Producer License — Continuing Education",
    },
  };
}
const aggregateOfferSchema = buildAggregateOfferSchema();

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "State-Approved Property & Casualty Continuing Education",
  url: CANONICAL,
  description: PAGE_DESC,
  mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
  about: {
    "@type": "EducationalOccupationalCredential",
    name: "Property & Casualty Insurance Producer License — Continuing Education",
  },
  isPartOf: {
    "@type": "WebSite",
    name: "JustInsurance",
    url: "https://justinsuranceco.com",
  },
  publisher: { "@id": "https://justinsuranceco.com#organization" },
  inLanguage: "en-US",
};

interface SupportedStateRow {
  slug: string;
  name: string;
  abbreviation: string;
  packageCount: number;
  totalHoursDisplay: string;
  priceDisplay: string;
}

function buildSupportedStates(): SupportedStateRow[] {
  return PC_STATE_SLUGS.map((slug): SupportedStateRow | null => {
    const state = STATES[slug];
    if (!state) return null;
    const packages = getPCPackagesForState(slug);
    const packageCount = packages.length;

    // For multi-package states, show the hour range (min–max) instead of a
    // single value. For single-package states, just show the totalHours.
    const hoursValues = packages.map((p) => p.totalHours);
    const minHours = Math.min(...hoursValues);
    const maxHours = Math.max(...hoursValues);
    const totalHoursDisplay =
      minHours === maxHours ? `${minHours} hrs` : `${minHours}–${maxHours} hrs`;

    // Most states price every package identically, but NOT all — Massachusetts
    // sells a 45-hour tier at $106.50 and a 60-hour tier at $129. The old
    // "single price per state" assumption quoted MA $22.50 under its real
    // 60-hour price, so derive a range whenever the prices actually differ.
    const priceNumbers = packages.map((p) =>
      parseFloat(p.price.replace(/[^0-9.]/g, "")),
    );
    const lowIdx = priceNumbers.indexOf(Math.min(...priceNumbers));
    const highIdx = priceNumbers.indexOf(Math.max(...priceNumbers));
    const priceDisplay =
      priceNumbers[lowIdx] === priceNumbers[highIdx]
        ? packages[lowIdx].price
        : `${packages[lowIdx].price}–${packages[highIdx].price}`;

    return {
      slug,
      name: state.name,
      abbreviation: state.abbreviation,
      packageCount,
      totalHoursDisplay,
      priceDisplay,
    };
  })
    .filter((row): row is SupportedStateRow => row !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function buildUnsupportedStates(): { slug: string; name: string; abbreviation: string }[] {
  const supportedSet = new Set(PC_STATE_SLUGS);
  return Object.values(STATES)
    .filter((s) => !supportedSet.has(s.slug))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => ({ slug: s.slug, name: s.name, abbreviation: s.abbreviation }));
}

export default function PropertyAndCasualtyCEPage() {
  const supportedStates = buildSupportedStates();
  const unsupportedStates = buildUnsupportedStates();
  const supportedCount = supportedStates.length;

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={webPageSchema} />
      <SchemaMarkup schema={credentialSchema} />
      <SchemaMarkup schema={aggregateOfferSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Property & Casualty CE" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            P&amp;C License Renewal
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Property &amp; Casualty CE from $39 — {supportedCount} States, Same-Day DOI Reporting
          </h1>

          {/* Price + hours + reporting + cert strip — answers the four pre-click
              qualifying questions competitors win on (added 2026-06-08). */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 text-sm md:text-base text-gold font-semibold">
            <span>From $39</span>
            <span className="text-blue-300">·</span>
            <span>24-hour packages</span>
            <span className="text-blue-300">·</span>
            <span>Same-day DOI reporting</span>
            <span className="text-blue-300">·</span>
            <span>Instant certificate</span>
          </div>

          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Renew your P&amp;C license today with state-approved CE packages starting at $39. Bundles are sized to the most common requirement in each state — usually 24 hours including Law &amp; Ethics — with separate tiers where a state has them (Florida requires 24 hours in your first 6 years and 20 after; Massachusetts requires 60 hours before your first renewal and 45 after), so pick the tier that applies to your license. Every package is typically filed with your Department of Insurance the same business day you finish, and ships with an instant printable certificate. IDECC-certified instructor curriculum across {supportedCount} states.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#states"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              See My State&apos;s Package
            </a>
            <a
              href="/continuing-education"
              className="inline-block bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-gray-dark font-bold text-lg px-8 py-4 rounded-lg transition-all"
            >
              Browse All CE
            </a>
          </div>
        </div>
      </section>

      <TrustBar passGuaranteeApplies={false} />
      <PressLogosBar />

      {/* What is P&C CE — byline moved INTO article so it reads as introducing the content (E-E-A-T review signal) rather than floating between trust signals */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <ArticleByline />
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6 mt-6">
            What Is Property &amp; Casualty Continuing Education?
          </h2>
          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>
              Property &amp; Casualty continuing education is the state-mandated training that licensed P&amp;C insurance producers must complete to keep their license active. Every state&apos;s Department of Insurance sets a recurring CE requirement — most commonly 24 credit hours every two years, with 3 of those hours dedicated to ethics. State requirements run from South Dakota&apos;s 10 hours per license qualification and New York&apos;s 15 credits per 2-year cycle on the low end up to the 60 hours Massachusetts requires before a producer&apos;s first renewal on the high end, with Arizona running a unique 48-hour, 4-year cycle.
            </p>
            <p>
              States require P&amp;C CE because the regulatory environment around property and casualty coverage moves quickly. Catastrophe modeling, NFIP flood program changes, commercial auto rate restructuring, and workers&apos; compensation classification updates all flow into how a producer must counsel clients. CE keeps every active producer current on coverage forms, statutory carve-outs, and the ethical duties owed to insureds.
            </p>
            <p>
              P&amp;C CE differs from Life &amp; Health CE in subject matter, but how the two are tracked depends on the state. Many states pool the requirement across every line you hold — Texas caps a producer at 24 hours total no matter how many licenses they carry (Tex. Ins. Code §4004.053), and Washington lets you apply any approved insurance CE course regardless of the lines of authority on your license. Other states count credits per license qualification (South Dakota, for example), so check your state page before assuming you owe two separate requirements. P&amp;C coursework covers personal auto, homeowners, dwelling fire, inland marine, commercial property, commercial general liability (CGL), commercial auto, workers&apos; compensation, professional liability (E&amp;O), umbrella and excess coverage, and surety. State-specific modules layer on top — California Anti-Fraud, Florida 4-Hour Law &amp; Ethics Update, Montana Insurance Law, Texas 50% Classroom Equivalent — depending on where you hold a license.
            </p>
          </div>
        </div>
      </section>

      {/* State coverage grid */}
      <section id="states" className="bg-gray-50 py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            P&amp;C CE Coverage — {supportedCount} States
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Each card opens the state-specific P&amp;C CE hub with full requirement detail, statutory citations, and Add-to-Cart links for every approved package.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {supportedStates.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}/continuing-education/property-and-casualty`}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-navy hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gold mb-1">
                      {s.abbreviation}
                    </p>
                    <h3 className="text-base font-bold text-navy leading-tight group-hover:text-navy">
                      {s.name}
                    </h3>
                  </div>
                  {s.packageCount > 1 && (
                    <span className="bg-gold text-gray-dark text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                      {s.packageCount} packages
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                  <span className="text-gray-600">
                    <span className="font-semibold text-navy">{s.totalHoursDisplay}</span>
                    {" total"}
                  </span>
                  <span className="font-bold text-navy">
                    {s.priceDisplay}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-3 group-hover:text-navy">
                  View P&amp;C CE details →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why JustInsurance for P&C CE */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Why Producers Choose JustInsurance for P&amp;C CE
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Every package is built to clear your renewal in a single sitting and typically lock the credits into the state system the same day.
          </p>
          <ul className="space-y-3 max-w-3xl mx-auto">
            {[
              {
                label: "IDECC-certified instructor",
                desc: "Curriculum is led by an instructor holding the Certified Distance Education Instructor (CDEI) designation from the International Distance Education Certification Center.",
              },
              {
                label: "Same-day DOI reporting",
                desc: "Credits typically transmit to your state Department of Insurance the same business day you finish — no manual upload, no transcripts to mail. Most states post the credit to your license record within a few business days after that.",
              },
              {
                label: "Statutory citations on every state page",
                desc: "Each state P&C CE hub cites the exact regulation governing CE hours, ethics, and any state-specific carve-out (NFIP, anti-fraud, classroom-equivalent). You can verify the requirement against your state code in one click.",
              },
              {
                label: "Plain-English curriculum",
                desc: "Coverage forms, regulatory updates, and ethics scenarios are written for working producers — not academics. Examples come from real claims, real endorsements, and real client conversations.",
              },
              {
                label: "Mobile-friendly delivery",
                desc: "Complete the full package on a phone, tablet, or desktop. Progress is saved automatically, so you can knock out a 3-hour ethics module on a lunch break and finish the electives later.",
              },
              {
                label: "State-aligned ethics modules",
                desc: "Florida licensees get the 4-Hour Law & Ethics Update. California licensees get Ethics with Anti-Fraud. Illinois licensees get the webinar-format Ethics module. The right module is bundled automatically — no separate purchase.",
              },
            ].map((b) => (
              <li key={b.label} className="bg-gray-50 rounded-lg p-5 border border-gray-100 flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 bg-gold rounded-full flex items-center justify-center text-gray-dark text-sm font-bold mt-0.5">
                  ✓
                </span>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong className="text-navy">{b.label}</strong> — {b.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* State requirements vary */}
      <section className="py-12 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-5">
            State Requirements Vary — Check Your State
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed text-base">
            <p>
              Property &amp; Casualty CE rules are not uniform across the country. Hour totals, ethics formats, renewal cycles, classroom-equivalent rules, and flood-training expectations all shift state by state. A producer licensed in California works under different anti-fraud rules than one in Florida; a Massachusetts licensee owes 60 hours before their first renewal and 45 hours in each 3-year period after; Texas requires that 50% of P&amp;C CE be classroom-equivalent.
            </p>
            <p>
              The state cards above link directly to the dedicated P&amp;C CE hub for each state, where the exact hour breakdown, statutory citation, ethics module, and any state-specific add-on (NFIP, anti-fraud, MT Law) is documented. Always renew against your current state&apos;s rules — not a generic 24-hour assumption.
            </p>
          </div>
        </div>
      </section>

      {/* Unsupported states */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Coming Soon
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            We are actively adding state-approved P&amp;C CE in these markets. If yours is below, your home state&apos;s licensing hub still has prelicensing and L&amp;H CE coverage today — New York is the one exception, because we do not sell CE there yet.{CE_PENDING_SENTENCE}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            {unsupportedStates.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="group flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-100 transition-all"
              >
                <span className="text-xs font-bold text-gray-500 w-8 flex-shrink-0">
                  {s.abbreviation}
                </span>
                <span className="text-sm font-medium text-gray-700 leading-tight">
                  {s.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="bg-blue-50 border-l-4 border-gold rounded-r-lg p-5 max-w-3xl mx-auto">
            <p className="font-bold text-navy mb-1">
              Looking for your state?
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              P&amp;C CE for the states above is on our roadmap. We&apos;ll publish state-approved packages as each Department of Insurance approval comes through. In the meantime, check our{" "}
              <Link href="/continuing-education" className="text-navy underline hover:text-gold font-medium">
                Life &amp; Health CE catalog
              </Link>
              {" "}— it covers {LH_CE_SERVED_COUNT} states today (all except New York). Our state CE provider approval is active in {CE_APPROVED_COUNT} states{CE_PENDING_CLAUSE}.
            </p>
          </div>
        </div>
      </section>

      {/* Internal-link cluster */}
      <section className="py-12 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-5">
            Related Licensing Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/continuing-education"
              className="bg-white rounded-xl p-5 border border-gray-100 hover:border-navy hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-navy mb-1 group-hover:text-navy">
                Life &amp; Health CE Hub
              </h3>
              <p className="text-sm text-gray-600">
                The {LH_CE_SERVED_COUNT}-state L&amp;H continuing education catalog — state-approved in {CE_APPROVED_COUNT} states, typically same-day reporting, $39 starting price.
              </p>
            </Link>
            <Link
              href="/license-renewal-guide"
              className="bg-white rounded-xl p-5 border border-gray-100 hover:border-navy hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-navy mb-1 group-hover:text-navy">
                License Renewal Guide
              </h3>
              <p className="text-sm text-gray-600">
                Step-by-step walkthrough of the renewal process, including CE timing, fees, and state-specific deadlines.
              </p>
            </Link>
            <Link
              href="/non-resident-insurance-license"
              className="bg-white rounded-xl p-5 border border-gray-100 hover:border-navy hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-navy mb-1 group-hover:text-navy">
                Non-Resident License Guide
              </h3>
              <p className="text-sm text-gray-600">
                Apply for non-resident P&amp;C licensing through NIPR — and learn how home-state CE satisfies most reciprocal states.
              </p>
            </Link>
            <Link
              href="/about/justin-vom-eigen"
              className="bg-white rounded-xl p-5 border border-gray-100 hover:border-navy hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-navy mb-1 group-hover:text-navy">
                About Justin vom Eigen
              </h3>
              <p className="text-sm text-gray-600">
                Licensed insurance agent and JustInsurance founder — the practitioner behind the curriculum.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion faqs={faqs} heading="Property & Casualty CE FAQ" />

      {/* Final CTA */}
      <CTABanner
        title="Find Your State and Renew Today"
        subtitle={`P&C CE in ${supportedCount} states with same-day DOI reporting in most cases. Pick your state, complete the package, and typically get your credits posted the same business day.`}
        ctaText="Find Your State"
        ctaHref="#states"
      />
    </>
  );
}
