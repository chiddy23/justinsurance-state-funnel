import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import FAQAccordion from "@/components/FAQAccordion";
import TrustBar from "@/components/TrustBar";
import PressLogosBar from "@/components/PressLogosBar";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "No Exam Needed: Get a Non-Resident Insurance License" },
  description:
    "Hold an active resident license? Apply for a non-resident insurance license via NIPR — no exam, state fees roughly $30–$380, decisions in 1–15 days.",
  alternates: { canonical: "https://justinsuranceco.com/non-resident-insurance-license" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Non-Resident Insurance License", url: "https://justinsuranceco.com/non-resident-insurance-license" },
]);

const faqs = [
  {
    question: "Do I need to retake the state exam to get a non-resident license?",
    answer:
      "In almost every case, no. Under NAIC reciprocity standards, if you hold an active resident license in good standing, you can apply for a non-resident license in another state without retesting. Reciprocity is broad but not universal — the NAIC certified 40 jurisdictions as reciprocal and notes that several large states are not yet fully reciprocal — so verify your target state on NIPR before applying.",
  },
  {
    question: "How long does a non-resident license application take?",
    answer:
      "Applications filed through NIPR.com are typically processed in 1 to 15 business days, depending on the state. States like Texas, Ohio, and Indiana often issue non-resident licenses in under 5 business days. California, Florida, and a handful of others can take 2 to 4 weeks because they run additional background checks or require supplemental forms outside the NIPR system.",
  },
  {
    question: "How much does a non-resident insurance license cost?",
    answer:
      "State application fees vary widely — most fall between about $30 and $200, but several states run far higher: Illinois is $380, Massachusetts $225 (plus a $75 lead-paint surcharge on property, casualty and personal lines) and California $188 for all lines of authority. Florida is near the bottom at $50 plus $5 per line of authority. Add a small NIPR transaction fee (typically around $5.60), and in fingerprint states such as Florida a background-check fee of about $49.50 through IdentoGO. Renewal fees are usually similar to the initial application fee. Check NIPR's state-requirements page for your target state before you budget.",
  },
  {
    question: "Do I need to complete CE for every non-resident state I hold a license in?",
    answer:
      "Most reciprocal states waive their non-resident CE requirement as long as you satisfy your home state's CE. This is the single biggest practical benefit of NAIC reciprocity. A few product-specific training rules do apply regardless of residency — the most-cited is California's annuity training under Cal. Ins. Code §1749.8, which requires 8 hours before selling annuities in California (plus 4 hours every two years) for resident and non-resident life licensees alike. Florida's 4-hour law and ethics update is not in that category: under Fla. Stat. §626.2815(6), a non-resident may satisfy Florida's CE with home-state CE where the home state reciprocates.",
  },
  {
    question: "Does my non-resident license expire when my resident license does?",
    answer:
      "Your non-resident license renewal is tied to the non-resident state's cycle, not your home state's. However, if your resident license lapses, suspends, or is revoked, every non-resident license you hold is immediately at risk — most states require you to report the change within 30 days and may terminate the non-resident license on the spot.",
  },
  {
    question: "Can I sell in a state without a non-resident license if the client is there temporarily?",
    answer:
      "No. The controlling rule is where the client is physically located at the time of solicitation and sale, not where they live. If your prospect sits in Georgia when you quote the policy, you need a Georgia license — even if they are a Tennessee resident. This is enforced under each state's insurance code and can result in fines or license action.",
  },
];

const faqSchema = generateFAQSchema(faqs);

// Hub-page schemas: WebPage + EducationalOccupationalCredential. Pairs with
// the 50 state-requirements pages each linking here with the exact-match
// "Non-Resident Insurance License" anchor — the credential schema gives Google
// an explicit "this is the canonical resource for this credential" signal,
// reinforcing the topical-cluster hub-and-spoke architecture.
const credentialSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalCredential",
  name: "Non-Resident Insurance Producer License",
  description:
    "An insurance producer license issued by a state to an individual whose primary residence is in a different state, granted under NAIC reciprocity standards adopted by most U.S. jurisdictions. Allows the producer to legally solicit, negotiate, and sell insurance in the issuing state.",
  credentialCategory: "license",
  recognizedBy: {
    "@type": "Organization",
    name: "National Association of Insurance Commissioners (NAIC)",
    url: "https://content.naic.org",
  },
  educationalLevel: "Producer",
  competencyRequired:
    "Active resident producer license in good standing in the applicant's home state. No additional examination required under reciprocity.",
  url: "https://justinsuranceco.com/non-resident-insurance-license",
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Non-Resident Insurance License: Reciprocity Guide",
  url: "https://justinsuranceco.com/non-resident-insurance-license",
  description:
    "Complete guide to non-resident insurance producer licensing across all 50 states — NAIC reciprocity rules, NIPR application process, fees, CE requirements, and common pitfalls.",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://justinsuranceco.com/non-resident-insurance-license",
  },
  about: {
    "@type": "EducationalOccupationalCredential",
    name: "Non-Resident Insurance Producer License",
  },
  isPartOf: {
    "@type": "WebSite",
    name: "JustInsurance",
    url: "https://justinsuranceco.com",
  },
  publisher: { "@id": "https://justinsuranceco.com#organization" },
  inLanguage: "en-US",
};

const applicationSteps = [
  {
    step: "1",
    title: "Confirm Your Resident License Is Active",
    body: "Log in to your home state's producer portal and confirm your license status is Active and in good standing. Any CE deficiency, unpaid fee, or pending administrative action will block the NIPR submission downstream.",
  },
  {
    step: "2",
    title: "Create or Log In to NIPR",
    body: "Go to nipr.com and use the Non-Resident Licensing tool. You will authenticate with your National Producer Number (NPN). If you do not know your NPN, look it up free on the NAIC lookup service at nipr.com/help/look-up-your-npn.",
  },
  {
    step: "3",
    title: "Select the State and Lines of Authority",
    body: "Choose the state you want a non-resident license in, then check the same lines of authority you already hold in your home state (Life, Accident & Health, Property, Casualty, etc.). You cannot apply for a line in a non-resident state that you do not hold at home.",
  },
  {
    step: "4",
    title: "Answer Background Questions and Pay",
    body: "Complete the background questions (felony convictions, administrative actions, child support arrears). State fees vary widely — commonly $30 to $200, with states such as Illinois ($380), Massachusetts ($225) and California ($188) higher — plus the NIPR transaction fee. Pay by credit card or ACH.",
  },
  {
    step: "5",
    title: "Wait for Issuance",
    body: "Most states return a decision within 1 to 15 business days. Once issued, you can download the license PDF directly from NIPR or the state producer portal. Appointments with carriers can then be filed through NIPR's appointment tool.",
  },
];

const reciprocityData: { name: string; category: "Full" | "Partial" | "Extra"; note: string }[] = [
  { name: "Texas", category: "Full", note: "Online issuance usually within 3–5 business days via NIPR" },
  { name: "Ohio", category: "Full", note: "No additional state-specific forms for reciprocal applicants" },
  { name: "Georgia", category: "Full", note: "Honors NAIC reciprocity; processed through NIPR" },
  { name: "Pennsylvania", category: "Full", note: "No retesting; full NIPR integration" },
  { name: "North Carolina", category: "Full", note: "Full reciprocity for resident producers in good standing" },
  { name: "Indiana", category: "Full", note: "Fast turnaround, often under a week" },
  { name: "Arizona", category: "Full", note: "Full reciprocity; Arizona runs a 4-year CE cycle that non-residents can satisfy via home-state reciprocity" },
  { name: "Missouri", category: "Full", note: "Standard NIPR application, reciprocal on all major LOAs" },
  { name: "Virginia", category: "Full", note: "Reciprocal under NAIC framework" },
  { name: "Illinois", category: "Full", note: "Reciprocal; non-residents file through NIPR" },
  { name: "California", category: "Extra", note: "May require supplemental forms for LOAs beyond the basics and longer background review — verify current form requirements with the CA DOI" },
  { name: "Florida", category: "Extra", note: "IdentoGO fingerprinting required for non-resident applicants (~$49.50); longer processing" },
  { name: "Hawaii", category: "Extra", note: "Higher fees; periodic supplemental documentation requests" },
  { name: "New York", category: "Extra", note: "Reciprocal for standard LOAs; unique carveouts for surplus lines and public adjuster lines" },
];

const pitfalls = [
  {
    title: "Letting Your Resident License Lapse",
    body: "Your non-resident license is wholly dependent on your resident license. If you let CE slip and your home state marks you inactive, every non-resident state is supposed to be notified within 30 days — and most will terminate your non-resident license without warning.",
  },
  {
    title: "Confusing Reporting Rules for CE",
    body: "Most agents think they owe CE to every state they hold a license in. In reality, reciprocity means your home-state CE covers your non-resident obligations in most states. The exceptions are narrow and mostly product-specific — California's annuity training is the most commonly cited, while Florida's law and ethics update can be satisfied through reciprocal home-state CE under Fla. Stat. §626.2815(6) — but requirements can change, so verify current rules with each state's DOI before assuming you're covered. Agents frequently over-buy CE out of caution.",
  },
  {
    title: "Forgetting Appointment Transitions",
    body: "In most states a license alone does not let you write business — you must also be appointed by each carrier in each state. When you add a non-resident license, notify your carriers so they can file the appointment through NIPR. Appointment timing rules vary: some states let the insurer file the notice of appointment after the fact, such as North Carolina, where N.C. Gen. Stat. §58-33-40 gives the insurer 15 days after the first application is submitted. Confirm the rule in each target state before you write, rather than assuming one national deadline.",
  },
  {
    title: "Mismatched Legal Names",
    body: "The name on your NIPR record must match your resident license exactly. A maiden name, dropped middle initial, or typo will cause a mismatch and a rejected application. Correct the name at your home state first, then file non-resident applications.",
  },
];

export default function NonResidentInsuranceLicensePage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={webPageSchema} />
      <SchemaMarkup schema={credentialSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Non-Resident Insurance License" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Non-Resident Licensing
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            How to Get a Non-Resident Insurance License
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Short answer: if you hold an active resident license, most states let you apply online at{" "}
            <a href="https://nipr.com" className="underline text-white hover:text-gold" target="_blank" rel="noopener noreferrer">NIPR.com</a>
            {" "}with no new exam. State fees vary widely — commonly $30 to $200, with a few states such as Illinois and Massachusetts substantially higher — and most applications clear in under 15 business days.
          </p>
        </div>
      </section>

      <TrustBar />
      <PressLogosBar />

      {/* TL;DR quick-answer box — answer-first snippet bait */}
      <section className="bg-white pt-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-navy rounded-r-lg p-5">
            <p className="text-gray-800 leading-relaxed">
              <strong>Quick answer:</strong> If you already hold an active resident insurance license,
              you can get a non-resident license in almost any other state without retaking an exam.
              Apply online at{" "}
              <a href="https://nipr.com" className="text-navy underline hover:text-gold" target="_blank" rel="noopener noreferrer">NIPR.com</a>
              {" "}— the process takes under 20 minutes, state fees commonly run $30 to $200 (Illinois
              $380 and Massachusetts $225 are the high outliers) plus a ~$5.60 NIPR transaction fee,
              and most states issue a decision within 1 to 15 business days. Nearly every state honors
              NAIC reciprocity, so no new prelicensing course is required — verify your target state
              on NIPR before applying.
            </p>
          </div>
        </div>
      </section>

      {/* What is a non-resident license */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-5">
            What a Non-Resident Insurance License Is and When You Need One
          </h2>
          <div className="space-y-4 text-gray-700 text-base leading-relaxed">
            <p>
              A non-resident insurance license is a producer license issued by a state other than the one where you live. Your home state (for example,{" "}
              <Link href="/texas" className="text-navy underline hover:text-gold">Texas</Link>) issues your resident license after you complete prelicensing education and pass the state exam. Every additional state you want to sell in requires a non-resident license from that state&apos;s Department of Insurance.
            </p>
            <p>
              You need a non-resident license any time you solicit, negotiate, or sell an insurance product to a client who is physically located in a state where you are not a resident. The triggering event is the client&apos;s location at the point of sale — not their mailing address, not their driver&apos;s license, and not where the policy is underwritten.
            </p>
            <p>
              Typical scenarios where agents add non-resident licenses:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Writing group benefits for an employer with offices in multiple states</li>
              <li>Working in a metro area that crosses state lines (Kansas City, DC, NYC tri-state)</li>
              <li>Selling Medicare or final expense over the phone to clients in other states</li>
              <li>Handling referrals from a captive agent network that covers several states</li>
              <li>Representing a national insurance marketing organization (IMO) or FMO</li>
            </ul>
            <p>
              Under the{" "}
              <a href="https://content.naic.org/" className="text-navy underline hover:text-gold" target="_blank" rel="noopener noreferrer">National Association of Insurance Commissioners (NAIC)</a>
              {" "}Producer Licensing Model Act, the great majority of jurisdictions have adopted reciprocity provisions — the NAIC certified 40 jurisdictions as reciprocal and notes that several large states are not yet fully reciprocal. That means your home-state license is the gateway to nearly every other state in the country without having to sit through another{" "}
              <Link href="/prelicensing" className="text-navy underline hover:text-gold">prelicensing course</Link>
              {" "}or{" "}
              <Link href="/practice-exam" className="text-navy underline hover:text-gold">state exam</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* How NIPR reciprocity works */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-5">
            How NIPR Reciprocity Works
          </h2>
          <div className="space-y-4 text-gray-700 text-base leading-relaxed">
            <p>
              Insurance license reciprocity is administered through the{" "}
              <a href="https://nipr.com" className="text-navy underline hover:text-gold" target="_blank" rel="noopener noreferrer">National Insurance Producer Registry (NIPR)</a>
              , a nonprofit affiliate of the NAIC. NIPR operates the online gateway used by all 50 state insurance departments to receive non-resident applications, process fees, and transmit license data.
            </p>
            <p>
              Here is what reciprocity actually does for you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>No new prelicensing course.</strong> The lines of authority on your resident license transfer directly.</li>
              <li><strong>No new state exam.</strong> You are not retested in the non-resident state.</li>
              <li><strong>CE is waived in most cases.</strong> Satisfying your home state&apos;s CE satisfies the non-resident state&apos;s CE, with the narrow exceptions noted below.</li>
              <li><strong>Same lines of authority.</strong> You get the exact LOAs you hold at home — nothing more, nothing less. To add a new LOA you must add it at home first.</li>
            </ul>
            <p>
              The NIPR application is typically completed in under 20 minutes per state. Applications are routed automatically to the destination state&apos;s DOI system, decisions usually post within 1 to 15 business days, and the license PDF is available for download the moment it is issued.
            </p>
          </div>
        </div>
      </section>

      {/* Reciprocity tiers */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            States with Full Reciprocity vs Partial vs Extra Requirements
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
            The vast majority of states are fully reciprocal under the NAIC model. A handful maintain extra state-specific steps that can add time or paperwork.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-100 text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left px-4 py-3 rounded-tl-xl font-semibold">State</th>
                  <th className="text-center px-4 py-3 font-semibold">Reciprocity Tier</th>
                  <th className="text-left px-4 py-3 rounded-tr-xl font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {reciprocityData.map((row, i) => (
                  <tr key={row.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-navy">{row.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block font-bold px-2 py-0.5 rounded-full text-xs ${
                          row.category === "Full"
                            ? "bg-green-100 text-green-700"
                            : row.category === "Partial"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {row.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 space-y-4 text-gray-700 text-base leading-relaxed">
            <p>
              <strong>California</strong> is the most-cited outlier. The{" "}
              <a href="https://www.insurance.ca.gov/" className="text-navy underline hover:text-gold" target="_blank" rel="noopener noreferrer">California Department of Insurance</a>
              {" "}accepts NIPR applications but runs a deeper background review, and certain LOAs (annuities, long-term care) still require California-specific training even for non-residents. Plan on 2 to 4 weeks for issuance rather than a few days.
            </p>
            <p>
              <strong>Florida</strong> allows non-resident applications through NIPR but adds supplemental state steps — non-resident applicants must be fingerprinted through IdentoGO (about $49.50). Florida&apos;s 4-hour law and ethics update course applies to resident licensees; under Fla. Stat. §626.2815(6) a non-resident who completes CE in a home state that reciprocates may use that home-state CE to satisfy Florida&apos;s requirement. See our{" "}
              <Link href="/florida" className="text-navy underline hover:text-gold">Florida licensing hub</Link>
              {" "}for specifics.
            </p>
            <p>
              <strong>New York</strong> technically participates in reciprocity but has unique rules around surplus lines, adjusters, and title insurance that frequently trip up out-of-state applicants. JustInsurance does not currently serve New York students, but the non-resident process itself is still available via NIPR.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-step */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Step-by-Step Application Process
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Assumes you already hold an active resident license. If not, start with{" "}
            <Link href="/prelicensing" className="text-navy underline hover:text-gold">prelicensing</Link>
            {" "}in your home state first.
          </p>
          <div className="space-y-4">
            {applicationSteps.map((step) => (
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

      {/* Cost breakdown */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-5">
            Cost Breakdown: Fees and CE for Non-Residents
          </h2>
          <div className="space-y-4 text-gray-700 text-base leading-relaxed">
            <p>
              Non-resident licensing is inexpensive relative to resident licensing because there is no prelicensing course or exam fee. Your total out-of-pocket per state is the DOI application fee, the NIPR transaction fee, and — in fingerprint states such as Florida — a background-check fee (about $49.50 through IdentoGO).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-gold font-semibold text-xs uppercase tracking-widest mb-2">Application</p>
                <p className="text-2xl font-bold text-navy mb-1">$30 – $380</p>
                <p className="text-gray-600 text-sm">Per state, paid to the state DOI through NIPR. Most states charge one fee covering all lines of authority (California $188 for all LOAs); a few add a per-line charge (Florida $50 + $5 per LOA).</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-gold font-semibold text-xs uppercase tracking-widest mb-2">NIPR Fee</p>
                <p className="text-2xl font-bold text-navy mb-1">~$5.60</p>
                <p className="text-gray-600 text-sm">Flat transaction fee charged by NIPR per application.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-gold font-semibold text-xs uppercase tracking-widest mb-2">Renewal</p>
                <p className="text-2xl font-bold text-navy mb-1">$30 – $380</p>
                <p className="text-gray-600 text-sm">Usually mirrors the application fee (Illinois renews at $380). Most states run a 2-year cycle; a few run 3 or 4 years.</p>
              </div>
            </div>
            <p>
              <strong>CE for non-residents.</strong> Under NAIC reciprocity, most states waive CE for non-residents whose home-state CE is current. That means the bulk of your ongoing cost is absorbed by the CE you already take at home. Our{" "}
              <Link href="/continuing-education" className="text-navy underline hover:text-gold">CE catalog</Link>
              {" "}starts at $39 for the full home-state package, and that completion satisfies the reciprocal non-resident states automatically.
            </p>
            <p>
              <strong>Where CE still applies.</strong> A few product-specific training rules apply regardless of residency — California, for example, requires 8 hours of annuity training under Cal. Ins. Code §1749.8 before a resident or non-resident life licensee sells annuities there, plus 4 hours every two years. Long-term care training carries similar state-specific rules. Florida&apos;s law and ethics update, by contrast, can be satisfied through reciprocal home-state CE under Fla. Stat. §626.2815(6). Budget an additional $30 to $80 per state where a carveout does apply, and check each target state&apos;s DOI site for current rules.
            </p>
          </div>
        </div>
      </section>

      {/* Pitfalls */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Common Non-Resident Licensing Pitfalls
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            These issues cost agents time, money, and (in the worst cases) license actions. All are preventable with a few minutes of attention.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pitfalls.map((p) => (
              <div key={p.title} className="bg-red-50 border border-red-100 rounded-xl p-7">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-red-600 font-bold text-sm">!</span>
                </div>
                <h3 className="font-bold text-navy mb-2 text-base">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-state strategy */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-5">
            Multi-State Licensing Strategy
          </h2>
          <div className="space-y-4 text-gray-700 text-base leading-relaxed">
            <p>
              Agents who write in multiple states generally follow one of two patterns: geographic (adjoining states for walk-in and referral business) or volume-based (high-population states for tele-sales and online lead flow). Both are valid — the worst approach is buying every state at once, because you will pay renewal fees on states you never actually write in.
            </p>
            <p>
              <strong>Adjoining-state approach.</strong> Start with the two or three states bordering your home state. If you live in{" "}
              <Link href="/tennessee" className="text-navy underline hover:text-gold">Tennessee</Link>
              , that means Kentucky, Georgia, Alabama, Mississippi, Arkansas, Missouri, Virginia, and North Carolina. These are the states where referrals, employer groups, and cross-border clients naturally land.
            </p>
            <p>
              <strong>Volume-state approach.</strong> If you sell Medicare, final expense, or individual health over the phone, focus on the five largest insurance markets: California, Texas, Florida, New York, and Pennsylvania. Those five states account for roughly 35% of the US population. Adding Ohio,{" "}
              <Link href="/georgia" className="text-navy underline hover:text-gold">Georgia</Link>
              , North Carolina, and{" "}
              <Link href="/illinois" className="text-navy underline hover:text-gold">Illinois</Link>
              {" "}brings you to over half the country.
            </p>
            <p>
              <strong>Track your renewals.</strong> Every non-resident license has its own renewal cycle independent of your home state. Use a spreadsheet or NIPR&apos;s renewal dashboard to track expiration dates. Missing a non-resident renewal is not the end of the world — you can usually reapply — but it does create a gap in your authority and can disrupt carrier appointments.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion faqs={faqs} heading="Non-Resident Licensing FAQ" />

      {/* Related resources */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">More Licensing Resources</h2>
          <p className="text-gray-600 mb-6">
            Have a question we did not cover? Check our{" "}
            <Link href="/faq" className="text-navy underline hover:text-gold">FAQ</Link>
            {" "}or start with resident licensing on the{" "}
            <Link href="/" className="text-navy underline hover:text-gold">JustInsurance homepage</Link>
            . Other helpful pages:{" "}
            <Link href="/license-renewal-guide" className="text-navy underline hover:text-gold">License Renewal Guide</Link>
            ,{" "}
            <Link href="/insurance-exam-guide" className="text-navy underline hover:text-gold">Insurance Exam Guide</Link>
            ,{" "}
            <Link href="/study-guide" className="text-navy underline hover:text-gold">Study Guide</Link>
            , and{" "}
            <Link href="/pass-rates" className="text-navy underline hover:text-gold">Pass Rates</Link>
            .
          </p>
        </div>
      </section>

      {/* Bottom line */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-5">Bottom Line</h2>
          <div className="space-y-4 text-gray-700 text-base leading-relaxed">
            <p>
              If you already hold an active resident insurance license in good standing, a non-resident license in almost any other state is a paperwork exercise — not another exam. Go to NIPR.com, pay the state fee (commonly $30 to $200, but $380 in Illinois, $225 in Massachusetts, $188 in California, and $50 plus $5 per line in Florida), and wait up to 15 business days. In most states you also need a carrier appointment on file before or shortly after your first application before you can write business. Keep your resident license active, track renewal cycles state by state, and coordinate carrier appointments before writing policies. The reciprocity system is doing real work for you; the worst thing you can do is let your home-state license slip and collapse every non-resident license you own along with it.
            </p>
            <p className="text-gray-500 text-sm italic pt-4 border-t border-gray-200">
              By Justin vom Eigen, Licensed Insurance Agent and Founder of JustInsurance
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Need Your Resident License First?"
        subtitle="JustInsurance prelicensing is $199, online, and self-paced. Once you pass, you can add any non-resident state through NIPR."
        ctaText="See Prelicensing Courses"
        ctaHref="/prelicensing"
      />
    </>
  );
}
