import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import FAQAccordion from "@/components/FAQAccordion";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Insurance License Renewal Guide 2026 | JustInsurance" },
  description:
    "How to renew your insurance license. CE requirements, deadlines, same-day DOI reporting. $39 CE packages from JustInsurance.",
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
    answer:
      "Yes. JustInsurance is an approved provider in all 50 states we serve. Once you complete a CE course, we report your completion directly to your state's Department of Insurance — typically the same business day. You do not need to submit anything yourself.",
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
// Source: states.ts — New York excluded per site policy
const statesCEData: [string, string, number, string][] = [
  ["Alabama", "alabama", 24, "2 years"],
  ["Alaska", "alaska", 24, "2 years"],
  ["Arizona", "arizona", 48, "4 years"],
  ["Arkansas", "arkansas", 24, "2 years"],
  ["California", "california", 24, "2 years"],
  ["Colorado", "colorado", 24, "2 years"],
  ["Connecticut", "connecticut", 24, "2 years"],
  ["Delaware", "delaware", 24, "2 years"],
  ["Florida", "florida", 24, "2 years"],
  ["Georgia", "georgia", 24, "2 years"],
  ["Hawaii", "hawaii", 24, "2 years"],
  ["Idaho", "idaho", 24, "2 years"],
  ["Illinois", "illinois", 24, "2 years"],
  ["Indiana", "indiana", 24, "2 years"],
  ["Iowa", "iowa", 36, "3 years"],
  ["Kansas", "kansas", 24, "2 years"],
  ["Kentucky", "kentucky", 24, "2 years"],
  ["Louisiana", "louisiana", 24, "2 years"],
  ["Maine", "maine", 24, "2 years"],
  ["Maryland", "maryland", 24, "2 years"],
  ["Massachusetts", "massachusetts", 45, "3 years"],
  ["Michigan", "michigan", 24, "2 years"],
  ["Minnesota", "minnesota", 24, "2 years"],
  ["Mississippi", "mississippi", 24, "2 years"],
  ["Missouri", "missouri", 24, "2 years"],
  ["Montana", "montana", 24, "2 years"],
  ["Nebraska", "nebraska", 24, "2 years"],
  ["Nevada", "nevada", 24, "2 years"],
  ["New Hampshire", "new-hampshire", 24, "2 years"],
  ["New Jersey", "new-jersey", 24, "2 years"],
  ["New Mexico", "new-mexico", 24, "2 years"],
  ["North Carolina", "north-carolina", 24, "2 years"],
  ["North Dakota", "north-dakota", 24, "2 years"],
  ["Ohio", "ohio", 24, "2 years"],
  ["Oklahoma", "oklahoma", 24, "2 years"],
  ["Oregon", "oregon", 24, "2 years"],
  ["Pennsylvania", "pennsylvania", 24, "2 years"],
  ["Rhode Island", "rhode-island", 24, "2 years"],
  ["South Carolina", "south-carolina", 24, "2 years"],
  ["South Dakota", "south-dakota", 10, "1 year"],
  ["Tennessee", "tennessee", 24, "2 years"],
  ["Texas", "texas", 24, "2 years"],
  ["Utah", "utah", 24, "2 years"],
  ["Vermont", "vermont", 24, "2 years"],
  ["Virginia", "virginia", 24, "2 years"],
  ["Washington", "washington", 24, "2 years"],
  ["West Virginia", "west-virginia", 24, "2 years"],
  ["Wisconsin", "wisconsin", 24, "2 years"],
  ["Wyoming", "wyoming", 24, "2 years"],
];

const renewalSteps = [
  {
    step: "1",
    title: "Complete Your CE Hours",
    body: "Enroll in a JustInsurance CE package for your state. All courses are online and self-paced — complete them on your schedule, from any device. Most agents finish their required hours in one or two evenings.",
  },
  {
    step: "2",
    title: "We Report to Your DOI",
    body: "Once you pass each course, JustInsurance automatically transmits your completion record to your state's Department of Insurance. Same-day reporting means your hours are on file the day you finish.",
  },
  {
    step: "3",
    title: "Confirm with Your State",
    body: "Log in to your state's producer licensing portal to verify your CE hours are on file. Most states display completion records within 1 business day. Then submit your renewal application and pay the renewal fee.",
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

export default function LicenseRenewalGuidePage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
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
                  When you complete a CE course through JustInsurance, we transmit your completion record to your state&apos;s Department of Insurance on the same business day — not in 5–7 business days, not after a manual review queue.
                </p>
                <p>
                  This matters because your CE hours must be on file before your state will process your renewal. A provider that takes days to report can leave you in a limbo period where your license appears expired even though you finished your CE on time.
                </p>
                <p>
                  With same-day reporting, you can complete your CE, confirm the hours posted to your state portal, and submit your renewal application — all within a single day if needed.
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
              <p className="text-white font-semibold">CE Credits Posted to Your State</p>
              <p className="text-blue-300 text-sm mt-2">
                Available in all 50 states we serve. No manual submissions required.
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
            CE hours and renewal cycles for all 50 states served by JustInsurance. Click any state to see full CE details and enroll.
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
          <p className="text-xs text-gray-400 text-center mt-4">
            New York not shown — JustInsurance does not currently serve NY. Data verified March 2026.
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

      {/* FAQ */}
      <FAQAccordion faqs={faqs} heading="License Renewal FAQ" />

      {/* CTA */}
      <CTABanner
        title="Renew Your License Today"
        subtitle="Complete your CE hours online with JustInsurance. $39 packages, same-day DOI reporting, available in all 50 states."
        ctaText="Find CE Courses"
        ctaHref="/continuing-education"
      />
    </>
  );
}
