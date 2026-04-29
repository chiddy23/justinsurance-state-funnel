import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import FAQAccordion from "@/components/FAQAccordion";
import ArticleByline from "@/components/ArticleByline";
import { STATES } from "@/lib/states";
import {
  PC_CE_PACKAGES,
  PC_STATE_SLUGS,
  getPCPackagesForState,
} from "@/data/pc-ce-packages";
import {
  SchemaMarkup,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateArticleSchemaWithReviewer,
} from "@/lib/schema";

const PAGE_TITLE = "State-Approved Property & Casualty CE | JustInsurance";
const PAGE_DESC =
  "State-approved Property & Casualty continuing education in 25 states. IDECC-certified instructor, same-day DOI reporting, statutory citations on every package.";
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
      "Anyone holding an active resident or non-resident Property & Casualty producer license — including Personal Lines and Commercial Lines sub-licenses in states that issue them. If you sell auto, homeowners, business, or workers' comp insurance, your state's Department of Insurance requires you to complete P&C CE on a recurring schedule. Life & Health-only producers do not satisfy P&C CE with their L&H credits; the two are tracked separately.",
  },
  {
    question: "How often is P&C CE required?",
    answer:
      "Most states run a 2-year renewal cycle for P&C licensees. A handful operate on different cycles — Iowa is 3 years, Arizona is 4 years, and Massachusetts has both 3-year and extended-cycle tiers. Your CE deadline is typically tied to your license expiration date, and credits must be reported before that date to avoid a lapse.",
  },
  {
    question: "Do P&C hour requirements differ by state?",
    answer:
      "Yes — significantly. Most states require 24 hours per cycle (typically 21 P&C electives + 3 ethics). Virginia requires only 16 hours per 2-year cycle. Kansas requires 18 hours. Iowa requires 36 hours per 3-year cycle. Arizona requires 48 hours per 4-year cycle. Florida is 20 hours per 2-year cycle for established producers, while Massachusetts has both 45-hour and 60-hour tiers. Always check your specific state page for the exact breakdown that applies to your license type.",
  },
  {
    question: "Does my P&C CE need to include flood (NFIP) training?",
    answer:
      "Federal law requires every producer who sells flood insurance under the National Flood Insurance Program to complete a one-time 3-hour NFIP basic training plus ongoing training for renewals. This is separate from your standard P&C CE. Several state P&C packages — including our Florida Homeowners + Flood track — bundle NFIP-aligned content. Kansas, in particular, requires P&C and Personal Lines licensees who write flood coverage to complete the dedicated 3-hour NFIP course in addition to standard CE.",
  },
  {
    question: "When are CE credits reported to my state's Department of Insurance?",
    answer:
      "JustInsurance electronically reports your completion to your state's Department of Insurance the same business day you finish the course. Credits appear in the state's tracking system immediately, which protects your renewal from being blocked by a reporting lag. You receive a completion certificate by email at the same time so you have proof of credit on file.",
  },
  {
    question: "Can I combine my Life & Health and P&C CE in one package?",
    answer:
      "No. State Departments of Insurance track L&H and P&C credits in separate buckets, and a credit from an L&H-approved course does not count toward your P&C requirement (and vice versa). If you hold both license types, you need to complete both CE packages — but they can be done in parallel. Our L&H CE catalog is available at the Continuing Education hub, and pricing matches our P&C packages.",
  },
  {
    question: "What happens if I miss my P&C CE deadline?",
    answer:
      "Consequences vary by state, but the typical pattern is: your license becomes inactive on the expiration date, you cannot legally write new business, and you have a grace period (commonly 60 to 90 days) to complete your CE and pay a reinstatement fee. After the grace window, most states require you to re-apply as a new applicant — which can mean retaking the prelicensing course and the state exam. Always complete CE before your deadline, and use a same-day reporting provider so credits hit the state system immediately.",
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

    // All packages within a state share a price under our pricing rule, so
    // surface the first package's price. (Verified: every state in
    // PC_CE_PACKAGES has a single price across all of its packages.)
    const priceDisplay = packages[0].price;

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
  const packageCount = PC_CE_PACKAGES.length;

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={webPageSchema} />
      <SchemaMarkup schema={credentialSchema} />

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
            State-Approved Property &amp; Casualty Continuing Education
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            {packageCount} state-approved P&amp;C CE packages across {supportedCount} states. Built around an IDECC-certified instructor curriculum, same-day DOI reporting, and statutory citations on every state page. Auto, homeowners, commercial, and workers&apos; comp content written in plain English.
          </p>
          <a
            href="#states"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-10 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Find Your State
          </a>
        </div>
      </section>

      {/* Byline strip */}
      <section className="bg-white pt-6 px-4">
        <div className="max-w-4xl mx-auto">
          <ArticleByline />
        </div>
      </section>

      {/* What is P&C CE */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            What Is Property &amp; Casualty Continuing Education?
          </h2>
          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>
              Property &amp; Casualty continuing education is the state-mandated training that licensed P&amp;C insurance producers must complete to keep their license active. Every state&apos;s Department of Insurance sets a recurring CE requirement — most commonly 24 credit hours every two years, with 3 of those hours dedicated to ethics. State requirements range from Virginia&apos;s 16-hour cycle on the low end to Massachusetts&apos; 60-hour extended tier on the high end, with Arizona running a unique 48-hour, 4-year cycle.
            </p>
            <p>
              States require P&amp;C CE because the regulatory environment around property and casualty coverage moves quickly. Catastrophe modeling, NFIP flood program changes, commercial auto rate restructuring, and workers&apos; compensation classification updates all flow into how a producer must counsel clients. CE keeps every active producer current on coverage forms, statutory carve-outs, and the ethical duties owed to insureds.
            </p>
            <p>
              P&amp;C CE differs from Life &amp; Health CE in subject matter and is tracked in a separate bucket by every state DOI. L&amp;H credits cannot satisfy a P&amp;C requirement, and vice versa. P&amp;C coursework covers personal auto, homeowners, dwelling fire, inland marine, commercial property, commercial general liability (CGL), commercial auto, workers&apos; compensation, professional liability (E&amp;O), umbrella and excess coverage, and surety. State-specific modules layer on top — California Anti-Fraud, Florida 4-Hour Law &amp; Ethics Update, Montana Insurance Law, Texas 50% Classroom Equivalent — depending on where you hold a license.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {supportedStates.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}/continuing-education/property-and-casualty/`}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-navy hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-gold mb-1">
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
            Every package is built to clear your renewal in a single sitting and lock the credits into the state system the same day.
          </p>
          <ul className="space-y-3 max-w-3xl mx-auto">
            {[
              {
                label: "IDECC-certified instructor",
                desc: "Curriculum is led by a qualified instructor credentialed by the International Distance Education Certification Center — the certification most state DOIs recognize as the bar for online insurance education.",
              },
              {
                label: "Same-day DOI reporting",
                desc: "Credits transmit to your state Department of Insurance the same business day you finish — no lag, no manual upload, no risk of your renewal being blocked by a reporting delay.",
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
              Property &amp; Casualty CE rules are not uniform across the country. Hour totals, ethics formats, renewal cycles, classroom-equivalent rules, and flood-training expectations all shift state by state. A producer licensed in California works under different anti-fraud rules than one in Florida; a Massachusetts licensee may owe 45 or 60 hours depending on tier; Texas requires that 50% of P&amp;C CE be classroom-equivalent.
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
            Coming Soon — {unsupportedStates.length} States on the Roadmap
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            We are actively adding state-approved P&amp;C CE in these markets. If yours is below, your home state&apos;s licensing hub still has full prelicensing and L&amp;H CE coverage today.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
            {unsupportedStates.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}/`}
                className="group flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 border border-gray-100 transition-all"
              >
                <span className="text-xs font-bold text-gray-400 w-8 flex-shrink-0">
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
              {" "}— it covers all 50 states today.
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
                The 50-state L&amp;H continuing education catalog — same-day reporting, $39 starting price.
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
        subtitle={`P&C CE in ${supportedCount} states with same-day DOI reporting. Pick your state, complete the package, get your credits posted the same business day.`}
        ctaText="Find Your State"
        ctaHref="#states"
      />
    </>
  );
}
