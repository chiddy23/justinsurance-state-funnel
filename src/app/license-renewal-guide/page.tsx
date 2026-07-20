import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import FAQAccordion from "@/components/FAQAccordion";
import PressLogosBar from "@/components/PressLogosBar";
import TrustBar from "@/components/TrustBar";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema, generateArticleSchemaWithReviewer } from "@/lib/schema";
import Link from "next/link";
import ArticleByline from "@/components/ArticleByline";
import { STATES } from "@/lib/states";

// ---------------------------------------------------------------------------
// "JustInsurance is an approved CE provider in the states we serve" was an
// unqualified universal: Washington's providerApprovalNumber is "PENDING" in
// states.ts, so we are NOT an approved CE provider in every state we serve, and
// we cannot report CE to a DOI that has not approved us. Counts derive from
// states.ts so this copy self-corrects the moment an approval issues.
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

/** States whose approval is pending, including New York (not in SERVED_STATES). */
const ALL_PENDING_STATES = Object.values(STATES).filter(
  (s) => s.providerApprovalNumber === "PENDING"
);

export const metadata: Metadata = {
  title: { absolute: "Insurance License Renewal Guide 2026 | CE by State | JustInsurance" },
  description:
    "How to renew your insurance license — CE hour requirements by state, renewal deadlines, and how to report your CE. Typically same-day reporting. Updated 2026.",
  alternates: { canonical: "https://justinsuranceco.com/license-renewal-guide" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "License Renewal Guide", url: "https://justinsuranceco.com/license-renewal-guide" },
]);

const faqs = [
  {
    question: "How many CE hours do I need to renew my insurance license?",
    answer:
      "Most states require 24 hours of continuing education per renewal cycle, which is typically every 2 years. Some states require more — Arizona requires 48 hours over 4 years, Massachusetts requires 45 hours over 3 years, and Iowa requires 36 hours over 3 years. South Dakota is one of the lowest at 10 hours per year. Check the table on this page for your specific state's requirement.",
  },
  {
    question: "What happens if my insurance license lapses?",
    answer:
      "If your license lapses, you may be required to retake the prelicensing course and state exam before you can get relicensed — the same process as a first-time applicant. This is costly and time-consuming. Most states have a short grace period, but relying on it is risky. Complete your CE and renew before your expiration date.",
  },
  {
    question: "Does JustInsurance report my CE completion to my state DOI?",
    answer: `Yes — in the ${CE_APPROVED_COUNT} of the ${SERVED_STATE_COUNT} states we serve where our CE provider approval is active. See your state page for the approval number. Once you complete a CE course, we report your completion directly to your state's Department of Insurance — typically the same business day, and you do not need to submit anything yourself.${
      CE_APPROVAL_PENDING.length === 0
        ? ""
        : ` Our ${formatStateNames(
            CE_APPROVAL_PENDING
          )} CE provider approval is still pending, so completions in ${
            CE_APPROVAL_PENDING.length === 1 ? "that state" : "those states"
          } are not yet reported to the DOI — you receive a certificate of completion for your records until approval issues.`
    }`,
  },
  {
    question: "Can I start CE courses before my renewal window opens?",
    answer:
      "In most states, yes. You can complete CE courses at any time during your license period, not just during the final months. Completing CE early is actually recommended — it eliminates last-minute deadline pressure and gives you time to resolve any reporting issues well before expiration.",
  },
  {
    question: "How much does CE cost with JustInsurance?",
    answer:
      "JustInsurance CE packages start at $39. This covers the required CE hours for most states, including the ethics component. Individual courses are available for agents who only need specific credits. Visit /continuing-education to see pricing for your state.",
  },
];

const faqSchema = generateFAQSchema(faqs);

// CE data: [stateName, slug, ceHours, renewalPeriod]
// DERIVED from states.ts at build time — never hand-maintain this table. A
// hardcoded copy lived here and silently drifted from the source of truth it
// claimed to come from (it still said Virginia 24 after states.ts was corrected
// to 16 per Va. Code § 38.2-1866(C)). New York excluded per site policy.
const statesCEData: [string, string, number, string][] = Object.values(STATES)
  .filter((s) => s.slug !== "new-york")
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((s) => [s.name, s.slug, s.ce.totalHours, s.ce.renewalPeriod]);

const renewalSteps = [
  {
    step: "1",
    title: "Complete Your CE Hours",
    body: "Enroll in a JustInsurance CE package for your state. All courses are online and self-paced — complete them on your schedule, from any device. Study at your own pace over days or weeks.",
  },
  {
    step: "2",
    title: "We Report to Your DOI",
    body: "Once you pass each course, JustInsurance typically transmits your completion record to your state's Department of Insurance the same business day. Most states then post the credit to your license record within a few business days.",
  },
  {
    step: "3",
    title: "Confirm with Your State",
    body: "Log in to your state's producer licensing portal to verify your CE hours are on file. Most states display completion records within a few business days. Then submit your renewal application and pay the renewal fee.",
  },
  {
    step: "4",
    title: "You're Done",
    body: "Once your state processes the renewal, your license is extended for another full renewal period. You will receive a confirmation from your state. Keep a copy for your records.",
  },
];

const commonMistakes = [
  {
    title: "Waiting Until the Last Week",
    body: "CE deadlines are strict. Waiting until the final days of your renewal period leaves no room for technical issues, course completion delays, or reporting lag. Start at least 30 days before your expiration date.",
  },
  {
    title: "Taking the Wrong Courses",
    body: "Not all CE courses count toward every line of authority. Make sure the courses you take are approved for your state and your specific license type (Life, Health, or Life & Health). JustInsurance packages are pre-filtered for your state and LOA.",
  },
  {
    title: "Name Mismatches",
    body: "Your name on your CE completion record must match your licensed name exactly. A maiden name, missing middle initial, or suffix discrepancy can cause your hours to fail to post. Use the exact name on your current license.",
  },
];

const articleSchema = generateArticleSchemaWithReviewer({
  headline: "Insurance License Renewal Guide",
  description:
    "How to renew your insurance license on time — CE hour requirements by state, ethics requirements, renewal cycles, late-filing consequences, and reinstatement.",
  datePublished: "2026-04-15",
  url: "https://justinsuranceco.com/license-renewal-guide",
});

export default function LicenseRenewalGuidePage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "License Renewal Guide" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            License Renewal
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Insurance License Renewal Guide
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Don&apos;t let your license lapse. Here&apos;s everything you need to renew on time.
          </p>
        </div>
      </section>

      <TrustBar />
      <PressLogosBar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline />
      </div>

      {/* How License Renewal Works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            How Insurance License Renewal Works
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Every active insurance license must be renewed on a schedule set by your state. Renewal requires completing continuing education (CE) credits before your expiration date.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-7 border border-gray-100">
              <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center mb-4">
                <span className="text-gold font-bold text-sm">CE</span>
              </div>
              <h3 className="font-bold text-navy text-base mb-2">CE Hours Required</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Most states require 24 hours of CE per renewal cycle. Hours must be completed through a state-approved provider like JustInsurance. At least a portion of those hours — typically 3 — must cover ethics.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-7 border border-gray-100">
              <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center mb-4">
                <span className="text-gold font-bold text-sm">E</span>
              </div>
              <h3 className="font-bold text-navy text-base mb-2">Ethics Requirement</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nearly every state mandates a dedicated ethics course as part of your CE requirement. This course cannot be substituted with general CE electives. JustInsurance includes the ethics course in every CE package.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-7 border border-gray-100">
              <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center mb-4">
                <span className="text-gold font-bold text-sm">↺</span>
              </div>
              <h3 className="font-bold text-navy text-base mb-2">Renewal Cycles</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                License renewal cycles range from 1 year (South Dakota) to 4 years (Arizona). Most states use a 2-year cycle. Your renewal date is typically tied to your birth month or license issue date. Check your state&apos;s portal for your exact deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Renewal Process */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Step-by-Step Renewal Process
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Renewing your insurance license with JustInsurance is straightforward. Here is the complete process from start to finish.
          </p>
          <div className="space-y-4">
            {renewalSteps.map((step) => (
              <div key={step.step} className="flex gap-5 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold text-lg">{step.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1 text-base">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Same-Day DOI Reporting */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
                JustInsurance Advantage
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-5">
                Same-Day DOI Reporting
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  When you complete a CE course through JustInsurance, we typically transmit your completion record to your state&apos;s Department of Insurance on the same business day you finish — not after a manual review queue. Most states then post the credit to your license record within a few business days.
                </p>
                <p>
                  This matters because your CE hours must be on file before your state will process your renewal. A provider that takes days to report can leave you in a limbo period where your license appears expired even though you finished your CE on time.
                </p>
                <p>
                  With same-day reporting in most cases, your completion reaches the state right away — it&apos;s still worth checking your state portal in the days that follow to confirm the credit has posted before you submit your renewal application.
                </p>
              </div>
            </div>
            <div className="bg-navy rounded-2xl p-8 text-center shadow-xl">
              <p className="text-blue-200 text-sm uppercase tracking-widest font-semibold mb-3">
                Reporting Speed
              </p>
              <p className="text-gold font-extrabold leading-none mb-3" style={{ fontSize: "3.5rem" }}>
                Same Day
              </p>
              <p className="text-white font-semibold">CE Completion Reported to Your State</p>
              <p className="text-blue-300 text-sm mt-2">
                Available in the states we serve. No manual submissions required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CE Requirements by State */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            CE Requirements by State
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            CE hours and renewal cycles nationwide served by JustInsurance. Click any state to see full CE details and enroll.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-100 text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left px-4 py-3 rounded-tl-xl font-semibold">State</th>
                  <th className="text-center px-4 py-3 font-semibold">CE Hours</th>
                  <th className="text-center px-4 py-3 rounded-tr-xl font-semibold">Renewal Cycle</th>
                </tr>
              </thead>
              <tbody>
                {statesCEData.map(([name, slug, hours, period], i) => (
                  <tr
                    key={slug}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/${slug}/continuing-education`}
                        className="text-navy font-medium hover:text-gold hover:underline transition-colors"
                      >
                        {name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block font-bold px-2 py-0.5 rounded-full text-xs ${
                          hours > 24
                            ? "bg-amber-100 text-amber-700"
                            : hours < 24
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {hours} hrs
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Was: "JustInsurance does not currently serve NY" — too broad, and
              contradicted by the New York practice-exam page we actually sell.
              The accurate, states.ts-backed statement is about CE approval. */}
          <p className="text-xs text-gray-500 text-center mt-4">
            New York not shown.{" "}
            {ALL_PENDING_STATES.length > 0 && (
              <>
                Our CE provider approval is still pending in{" "}
                {formatStateNames(ALL_PENDING_STATES)}, so JustInsurance CE is not yet available{" "}
                {ALL_PENDING_STATES.length === 1 ? "there" : "in those states"}.{" "}
              </>
            )}
            State requirement data verified March 2026.
          </p>
        </div>
      </section>

      {/* Common Renewal Mistakes */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Common Renewal Mistakes to Avoid
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            These are the most frequent reasons agents have renewal complications — and all of them are preventable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commonMistakes.map((mistake) => (
              <div key={mistake.title} className="bg-red-50 border border-red-100 rounded-xl p-7">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-red-600 font-bold text-sm">!</span>
                </div>
                <h3 className="font-bold text-navy mb-2 text-base">{mistake.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{mistake.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What if my license has already lapsed? */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            What If My License Has Already Lapsed?
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              If you missed your renewal deadline, your options depend on how
              long ago your license expired and which state you&apos;re in. Most
              states allow reinstatement within a grace period — typically 30 to
              90 days after expiration — by completing delinquent CE, paying late
              fees, and submitting a reinstatement application. After the grace
              period, reinstatement rules vary dramatically.
            </p>
            <p>
              <strong className="text-navy">Short windows (1 month or less):</strong>{" "}
              Ohio gives a 1-month grace period with a $50 late fee. Pennsylvania
              allows 60 days for retroactive reinstatement.
            </p>
            <p>
              <strong className="text-navy">Medium windows (90 days - 1 year):</strong>{" "}
              Texas gives a 90-day late renewal window. Nevada, Oregon, Wisconsin,
              and West Virginia allow up to 12 months. Illinois allows 12 months
              via NIPR with a $430 reinstatement total.
            </p>
            <p>
              <strong className="text-navy">Long windows (2 years):</strong>{" "}
              Vermont allows reinstatement up to 2 years after expiration via the
              initial licensing application process.
            </p>
            <p>
              <strong className="text-navy">No grace period, immediate lapse:</strong>{" "}
              California, Illinois (for CE completion), and New York lapse
              immediately on expiration. Oklahoma, North Carolina, and a
              handful of other states have strict non-grace structures.
            </p>
            <p>
              After the reinstatement window closes, most states require you to
              retake the prelicensing course AND pass the state licensing exam
              again — essentially starting over. The safest approach is to
              complete your CE at least 30 days before your expiration date to
              allow time for same-day reporting and state processing. For the
              exact rules in your state, see the {`"`}What Happens If You Miss Your CE
              Deadline?{`"`} section on your state&apos;s CE page (e.g.,{" "}
              <Link href="/florida/continuing-education" className="text-gold-deep font-semibold hover:underline">Florida</Link>
              ,{" "}
              <Link href="/texas/continuing-education" className="text-gold-deep font-semibold hover:underline">Texas</Link>
              ,{" "}
              <Link href="/california/continuing-education" className="text-gold-deep font-semibold hover:underline">California</Link>
              ).
            </p>
            <p>
              If your license has already lapsed, contact your state&apos;s
              Department of Insurance to confirm reinstatement requirements
              before enrolling in a CE course — some states require specific
              course content to satisfy the delinquent hours, not just any
              CE package.
            </p>
            <p className="pt-2">
              Our support team can help navigate state-specific reinstatement
              rules —{" "}
              <Link href="/contact" className="text-gold-deep font-semibold hover:underline">contact us</Link>
              {" "}or call{" "}
              <a href="tel:7542239744" className="text-gold-deep font-semibold hover:underline">754-223-9744</a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion faqs={faqs} heading="License Renewal FAQ" />

      {/* CTA */}
      <CTABanner
        title="Renew Your License Today"
        subtitle="Complete your CE hours online with JustInsurance. $39 packages, typically same-day DOI reporting, available nationwide."
        ctaText="Find CE Courses"
        ctaHref="/continuing-education"
      />
    </>
  );
}
