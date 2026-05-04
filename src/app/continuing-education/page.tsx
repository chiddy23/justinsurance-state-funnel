import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import TestimonialCards from "@/components/TestimonialCards";
import TrustBar from "@/components/TrustBar";
import PressLogosBar from "@/components/PressLogosBar";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

const PAGE_TITLE = "Insurance CE Courses | Same-Day Reporting | JustInsurance";
const PAGE_DESC =
  "Renew your insurance license online. State-approved CE with same-day DOI reporting, IDECC-certified curriculum. L&H from $39, P&C CE in 25 states.";
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
      "Insurance continuing education is the ongoing education requirement that licensed insurance agents must complete to renew their license. Most states require agents to complete a set number of CE hours — typically 20 to 24 hours — every two years. CE courses cover insurance product updates, regulatory changes, ethics, and emerging topics relevant to practicing agents.",
  },
  {
    question: "How often do I need to complete CE?",
    answer:
      "CE renewal cycles vary by state but are most commonly every two years. Your renewal deadline is usually tied to your license expiration date. JustInsurance courses include your state's required ethics hours as part of the package, so you can complete everything in one place without hunting for a separate ethics course.",
  },
  {
    question: "What does 'same-day DOI reporting' mean?",
    answer:
      "When you complete your CE course with JustInsurance, we electronically report your completion to your state's Department of Insurance the same business day. This means your CE credits are recorded in the state system immediately — no waiting, no paperwork, and no risk of your renewal being delayed because of a reporting lag.",
  },
  {
    question: "Can I take CE if my license has already expired?",
    answer:
      "In most states, you can still complete CE and apply for license reinstatement within a certain grace period after your expiration date — but the rules vary significantly by state. If your license has lapsed, we recommend contacting your state's Department of Insurance or our support team to confirm the reinstatement requirements before enrolling.",
  },
];

const stats = [
  { value: "From $39", label: "CE package price", sub: "Includes all required hours and ethics" },
  { value: "Same day", label: "DOI reporting", sub: "Credits recorded immediately upon completion" },
  { value: "50", label: "States covered", sub: "State-approved CE in every market we serve" },
  { value: "2–4 hrs", label: "Avg. completion time", sub: "Complete your renewal in a single session" },
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
    "State-approved insurance continuing education for license renewal. Same-day DOI reporting, IDECC-certified instructor curriculum. Life & Health CE from $39, plus Property & Casualty CE in 25 states.",
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
    description: "State-approved online insurance CE courses for license renewal. Nationwide coverage. Same-day reporting to your state DOI. From $39.",
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

  const states = Object.values(STATES)
    .filter((s) => s.slug !== "new-york")
    .sort((a, b) => a.name.localeCompare(b.name));

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
            Renew your insurance license online starting at $39. State-approved CE packages with same-day DOI reporting. Available in 49 states (all except New York) — no classroom required.
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

      {/* What is CE */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            What Is Insurance Continuing Education?
          </h2>
          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>
              Insurance continuing education (CE) is the ongoing education requirement that all licensed insurance agents must satisfy to keep their license active. Every state&apos;s Department of Insurance mandates a certain number of CE credit hours — typically 20 to 24 hours — within each renewal period, which is usually two years. These hours must cover state-approved topics, and most states require that a portion of those hours address ethics and professional conduct.
            </p>
            <p>
              JustInsurance CE packages are designed to fulfill your entire renewal requirement in a single, convenient online bundle. Our courses are pre-approved by your state&apos;s DOI, so the credits are guaranteed to count. Each package includes the required ethics hours, and you can complete everything at your own pace — many agents finish in a single afternoon.
            </p>
            <p>
              One of the most important advantages of renewing with JustInsurance is same-day DOI reporting. The moment you complete your course, we transmit your completion record electronically to the state. Your credits appear in the state&apos;s system the same business day, protecting you from renewal delays that can arise when reporting lags behind your license expiration date.
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
            your state, the mandatory ethics course, and any state-specific specialty
            topics. Depending on your state, packages may include:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              { label: "Ethics (required in all states)", desc: "typically 3–4 hours, included in every package" },
              { label: "Annuity suitability", desc: "required before selling annuity products in most states" },
              { label: "Long-term care (LTC) training", desc: "required for agents selling LTC products" },
              { label: "National Flood Insurance Program (NFIP)", desc: "required for Property & Casualty agents in flood-prone states" },
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
                href={`/${state.slug}/continuing-education/`}
                className="group flex items-center gap-2 bg-gray-50 hover:bg-navy rounded-lg p-3 transition-all hover:shadow-md border border-gray-100"
              >
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-200 w-8 flex-shrink-0">
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
        subtitle="Complete your CE in as little as a few hours, get same-day DOI reporting, and keep your license active without the stress."
        ctaText="Renew My License Now"
        ctaHref="#states"
      />
    </>
  );
}
