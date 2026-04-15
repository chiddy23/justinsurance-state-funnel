import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import FAQAccordion from "@/components/FAQAccordion";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "How Much Does an Insurance License Cost? 2026 Fees" },
  description:
    "Insurance license all-in cost runs $300 to $600. State-by-state exam, application, and fingerprint fees for 2026.",
  alternates: { canonical: "https://justinsuranceco.com/insurance-license-cost" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Insurance License Cost", url: "https://justinsuranceco.com/insurance-license-cost" },
]);

const faqs = [
  {
    question: "How much does an insurance license cost in total?",
    answer:
      "For most candidates, the total out-of-pocket cost falls between $300 and $600. That figure includes a prelicensing course ($199 at JustInsurance), the state exam fee (ranging from about $29 in Missouri to $98 in California), the state application fee (as low as $10 in Michigan and Ohio, as high as $225 in Massachusetts), and fingerprinting or background check costs ($30 to $50 in most states). If you add an optional state-specific practice exam ($59), you are still usually under $600.",
  },
  {
    question: "Why does the cost vary so much between states?",
    answer:
      "Two factors drive almost all of the variation: the exam fee charged by the state&apos;s contracted exam vendor (Pearson VUE or PSI) and the application fee set by the state Department of Insurance. California charges $98 per exam attempt and $188 per line of authority for the application. Michigan charges $41 for the exam and $10 for the application. Both are licensed insurance producers at the end of the process, but the sticker price differs by hundreds of dollars.",
  },
  {
    question: "Is the prelicensing course required, or can I skip it?",
    answer:
      "Most states require a state-approved prelicensing course before you are allowed to sit for the exam. A handful of states do not mandate prelicensing hours (for example, California eliminated line-specific prelicensing hours under AB 943 effective January 2026 and now only requires 12 hours of Ethics and Code), but in nearly every case the candidates who complete a course pass at dramatically higher rates than self-studiers. The course is where the cost savings on retake fees come from.",
  },
  {
    question: "Do I have to pay for fingerprinting separately?",
    answer:
      "In most states, yes. Fingerprinting and background check fees typically run $30 to $50 and are paid directly to a vendor like IdentoGO or Fieldprint, not to the Department of Insurance. A few states bundle the background check cost into the application fee. Check your state&apos;s licensing page or the NIPR application portal for specifics.",
  },
  {
    question: "What happens if I fail the exam — how much extra does that cost?",
    answer:
      "Every exam attempt requires a new full exam fee paid to Pearson VUE or PSI. If you pay $98 in California and fail twice before passing, that is $294 in exam fees alone. Retake fees are the single largest hidden cost of getting licensed, which is why investing in a quality prelicensing course and a state-specific practice exam is almost always cheaper than retaking the state exam.",
  },
  {
    question: "Are there ongoing costs after I get my license?",
    answer:
      "Yes. Licenses renew every 1 to 3 years depending on the state, and most states require continuing education (typically 24 CE hours per 2-year cycle). Renewal fees range from about $20 to $100 per line. If you get appointed by a carrier, the appointment fee (usually $10 to $40 per carrier per state) is typically paid by the carrier, not the agent. Our license renewal guide has full state-by-state renewal data.",
  },
];

const faqSchema = generateFAQSchema(faqs);

// State fee data sourced directly from src/lib/states.ts
// Format: [state, examFee, applicationFee]
const stateFeeTable: { state: string; slug: string; examFee: string; appFee: string }[] = [
  { state: "Alabama", slug: "alabama", examFee: "$50–$75", appFee: "$80" },
  { state: "Alaska", slug: "alaska", examFee: "$89", appFee: "$75" },
  { state: "Arizona", slug: "arizona", examFee: "$50", appFee: "$120" },
  { state: "Arkansas", slug: "arkansas", examFee: "$50", appFee: "$15" },
  { state: "California", slug: "california", examFee: "$98", appFee: "$188" },
  { state: "Colorado", slug: "colorado", examFee: "$48", appFee: "$47" },
  { state: "Connecticut", slug: "connecticut", examFee: "$65", appFee: "$140" },
  { state: "Florida", slug: "florida", examFee: "$44", appFee: "$50" },
  { state: "Georgia", slug: "georgia", examFee: "$67", appFee: "$100" },
  { state: "Illinois", slug: "illinois", examFee: "$92", appFee: "$215" },
  { state: "Indiana", slug: "indiana", examFee: "$69", appFee: "$40" },
  { state: "Louisiana", slug: "louisiana", examFee: "$36", appFee: "$75" },
  { state: "Massachusetts", slug: "massachusetts", examFee: "$39", appFee: "$225" },
  { state: "Michigan", slug: "michigan", examFee: "$41", appFee: "$10" },
  { state: "Missouri", slug: "missouri", examFee: "$29–$35", appFee: "$100" },
  { state: "Nevada", slug: "nevada", examFee: "$37", appFee: "$185" },
  { state: "New York", slug: "new-york", examFee: "$33", appFee: "$80" },
  { state: "North Carolina", slug: "north-carolina", examFee: "$45", appFee: "$82" },
  { state: "Ohio", slug: "ohio", examFee: "$49", appFee: "$10" },
  { state: "Pennsylvania", slug: "pennsylvania", examFee: "$43", appFee: "$55" },
  { state: "Texas", slug: "texas", examFee: "$39", appFee: "$50" },
  { state: "Virginia", slug: "virginia", examFee: "$51", appFee: "$15" },
  { state: "Washington", slug: "washington", examFee: "$35", appFee: "$55" },
];

const hiddenCosts = [
  {
    title: "Retake Fees",
    body: "Every failed attempt is a full exam fee paid again. In California that is $98 per try. In Illinois it is $92. In California, three failed attempts adds up to $294 in exam fees alone — more than the prelicensing course itself.",
  },
  {
    title: "Expiration and Reinstatement Penalties",
    body: "If you pass the exam but miss the deadline to submit your license application (most states require application within 12 months of passing), you will have to retake the exam at full price. Some states also charge reinstatement fees of $50 to $200 on top of the standard renewal fee if your license lapses.",
  },
  {
    title: "Appointment and Sponsorship Fees",
    body: "A resident license lets you hold an appointment, but each carrier you represent typically files an appointment ($10 to $40 per carrier per state). Most carriers pay this fee on behalf of the agent, but independent agents writing in multiple states should budget for it.",
  },
  {
    title: "Non-Resident License Fees",
    body: "If you want to write business in a second state, you need a non-resident license in that state. Non-resident application fees are often the same as resident application fees — meaning California would charge $188 for a non-resident license on top of whatever you paid in your home state.",
  },
  {
    title: "CE Course Costs at Renewal",
    body: "Every renewal cycle (usually 2 years) you will need to complete continuing education. CE costs range from $39 for a JustInsurance package to well over $150 at some legacy providers. Factor this into the lifetime cost of holding a license.",
  },
];

const minimizeCost = [
  {
    title: "Pass on the first attempt",
    body: "The single biggest variable in total licensing cost is how many times you sit for the exam. JustInsurance students pass at a 93% rate among those who met our recommended study metrics (recommended study hours plus 80%+ on the practice exam three times in a row). Compare that to the national first-attempt pass rate of roughly 55%. Every retake costs the full exam fee.",
  },
  {
    title: "Pick a fixed-price course",
    body: "JustInsurance charges a flat $199 for prelicensing regardless of state. Several competitors use an upcharge model where the advertised price only covers the video content and you pay extra for practice questions, flashcards, and instructor access. Read the /compare page for the full breakdown.",
  },
  {
    title: "Use a state-specific practice exam",
    body: "A $59 /practice-exam that mirrors your state&apos;s exact exam content outline is a fraction of the cost of a single retake in a high-fee state. If it saves you one retry in California, it has paid for itself and then some.",
  },
  {
    title: "Schedule your exam soon after completing the course",
    body: "Content retention drops off quickly. Candidates who sit for the exam within two weeks of finishing their prelicensing course pass at higher rates than those who wait 60+ days. Waiting does not make the exam cheaper — it makes retakes more likely.",
  },
  {
    title: "Apply for your license immediately after passing",
    body: "Most states require your license application within 12 months of passing the exam. If you miss that window, the exam fee is forfeit and you start over. File through NIPR or your state&apos;s licensing portal the same week you pass.",
  },
];

export default function InsuranceLicenseCostPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Insurance License Cost" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            2026 Cost Breakdown
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            How Much Does an Insurance License Cost?
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto mb-6">
            Most candidates spend between <strong className="text-gold">$300 and $600</strong> all-in to get a resident insurance producer license. The exact figure depends on your state, your line of authority, and whether you pass on the first attempt.
          </p>
          <p className="text-sm text-blue-200 max-w-2xl mx-auto">
            Updated April 2026. Fee data verified against state Department of Insurance sites, NIPR, Pearson VUE, and PSI.
          </p>
        </div>
      </section>

      {/* Short Answer */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
              Short Answer
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A resident life, health, or property &amp; casualty insurance license in most US states costs <strong className="text-navy">$300 to $600</strong> out of pocket when you add up every required fee. That total breaks down roughly as:
            </p>
            <ul className="space-y-2 text-gray-700 text-base">
              <li className="flex gap-3"><span className="text-gold font-bold">•</span><span><strong className="text-navy">Prelicensing course:</strong> $150 to $400 depending on provider. JustInsurance is a flat $199 per line.</span></li>
              <li className="flex gap-3"><span className="text-gold font-bold">•</span><span><strong className="text-navy">State exam fee:</strong> $29 in Missouri to $98 in California (paid per attempt).</span></li>
              <li className="flex gap-3"><span className="text-gold font-bold">•</span><span><strong className="text-navy">State application fee:</strong> $10 in Michigan or Ohio to $225 in Massachusetts.</span></li>
              <li className="flex gap-3"><span className="text-gold font-bold">•</span><span><strong className="text-navy">Fingerprinting or background check:</strong> $30 to $50 through IdentoGO, Fieldprint, or an equivalent vendor.</span></li>
              <li className="flex gap-3"><span className="text-gold font-bold">•</span><span><strong className="text-navy">Optional practice exam:</strong> $59 for a state-specific, full-length simulated exam.</span></li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Candidates in low-fee states like Michigan can get fully licensed for under $300. Texas runs about $330. Candidates in California, Illinois, or Massachusetts should plan for closer to $600, largely because the application fee is front-loaded.
            </p>
          </div>
        </div>
      </section>

      {/* Cost Breakdown Components */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Cost Breakdown: Every Fee You Will Pay
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Four required costs and one optional one. Here is what each covers and what drives the range.
          </p>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-7 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy text-lg mb-3">1. Prelicensing Course — $150 to $400</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                Most states require a state-approved prelicensing course before you can sit for the exam. Course prices vary widely: XCEL Solutions and Kaplan tend to sit in the $200 to $400 range with add-ons for practice questions and instructor access. ExamFX uses a tiered pricing model that also adds cost for features like cram sessions. <Link href="/prelicensing" className="text-navy underline underline-offset-2 hover:text-gold">JustInsurance charges a flat $199</Link> per line of authority, all-inclusive — every practice question, every flashcard, every instructor session is in the base price.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm">
                This is the one fee you actually control. Picking a course that is aligned to your state&apos;s exam content outline is the difference between passing on the first try and paying $98 per retake in a high-fee state.
              </p>
            </div>

            <div className="bg-white rounded-xl p-7 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy text-lg mb-3">2. State Exam Fee — $29 to $98</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                The state exam is administered by either <a href="https://home.pearsonvue.com/" target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2 hover:text-gold">Pearson VUE</a> or <a href="https://www.psiexams.com/" target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2 hover:text-gold">PSI</a>, depending on your state&apos;s contract. You pay the vendor directly when you schedule. Fees are charged per attempt — fail twice, pay twice.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm">
                Five real examples from the current fee schedule: <strong className="text-navy">Texas charges $39</strong>, <strong className="text-navy">Florida charges $44</strong>, <strong className="text-navy">Illinois charges $92</strong>, <strong className="text-navy">Alaska charges $89</strong>, and <strong className="text-navy">California charges $98</strong>. Missouri is the cheapest in the country at $29 to $35. South Dakota is one of the highest at $85.
              </p>
            </div>

            <div className="bg-white rounded-xl p-7 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy text-lg mb-3">3. State Application Fee — $10 to $225</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                After you pass, you submit your license application through <a href="https://nipr.com/" target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2 hover:text-gold">NIPR</a> or your state&apos;s online licensing portal. This fee goes to the state Department of Insurance and covers license issuance.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm">
                Five real examples: <strong className="text-navy">Michigan is $10</strong>, <strong className="text-navy">Ohio is $10</strong>, <strong className="text-navy">Texas is $50</strong>, <strong className="text-navy">California is $188</strong> per line of authority, and <strong className="text-navy">Massachusetts tops the chart at $225</strong>. Illinois is $215. Nevada is $185. If application cost is a deciding factor, know that it is the widest-ranging fee category in the process.
              </p>
            </div>

            <div className="bg-white rounded-xl p-7 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy text-lg mb-3">4. Fingerprinting and Background Check — $30 to $50</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Most states require a fingerprint-based background check. You schedule an appointment with IdentoGO, Fieldprint, or your state&apos;s designated vendor and pay the vendor directly. Typical cost is $30 to $50. A few states bundle the background check into the application fee — check your state&apos;s DOI page for the specifics before you book.
              </p>
            </div>

            <div className="bg-white rounded-xl p-7 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy text-lg mb-3">5. Optional Practice Exam — $59</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                A <Link href="/practice-exam" className="text-navy underline underline-offset-2 hover:text-gold">state-specific practice exam</Link> costs $59 and mirrors the actual state exam&apos;s format, timing, and topic weight. This is optional but recommended. In any state with a $60+ exam fee, a single avoided retake more than pays for the practice exam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* State-by-State Table */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            State-by-State Fee Comparison
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Exam fees paid to Pearson VUE or PSI, and application fees paid to the state Department of Insurance. Data verified April 2026.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">State</th>
                  <th className="text-left px-4 py-3 font-semibold">Exam Fee</th>
                  <th className="text-left px-4 py-3 font-semibold">Application Fee</th>
                  <th className="text-left px-4 py-3 font-semibold">State Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stateFeeTable.map((row, idx) => (
                  <tr key={row.slug} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-semibold text-navy">{row.state}</td>
                    <td className="px-4 py-3 text-gray-700">{row.examFee}</td>
                    <td className="px-4 py-3 text-gray-700">{row.appFee}</td>
                    <td className="px-4 py-3">
                      <Link href={`/${row.slug}`} className="text-navy underline underline-offset-2 hover:text-gold">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Fee data sourced from state Department of Insurance publications and verified against the NIPR fee schedule. Exam fees reflect the per-attempt cost charged by Pearson VUE or PSI.
          </p>
        </div>
      </section>

      {/* Hidden Costs */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Hidden Costs Candidates Often Miss
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            The sticker price is only the beginning. Here are the costs that catch first-time candidates off guard.
          </p>
          <div className="space-y-4">
            {hiddenCosts.map((c) => (
              <div key={c.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-navy mb-2 text-base">{c.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Minimize Cost */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            How to Keep Your Licensing Cost Low
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            The cheapest path to a license is the one where you pass on the first attempt and file your application on time.
          </p>
          <div className="space-y-4">
            {minimizeCost.map((t, i) => (
              <div key={t.title} className="flex gap-5 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold text-sm">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1 text-base">{t.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Pricing Comparison */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            How JustInsurance Pricing Compares
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            The advertised price is not always the all-in price. Here is how the three major providers actually charge.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl p-6 border-2 border-gold shadow-md">
              <h3 className="font-bold text-navy text-lg mb-2">JustInsurance</h3>
              <p className="text-2xl font-extrabold text-gold mb-3">$199 flat</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                One price per line of authority. Includes all practice questions, flashcards, instructor Q&amp;A, and pass guarantee access. No add-on tiers. Same price in every state.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-navy text-lg mb-2">XCEL Solutions</h3>
              <p className="text-2xl font-extrabold text-gray-500 mb-3">Tiered</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Three-tier pricing model. Base tier covers video content only. Upper tiers add practice questions, instructor support, and study resources at meaningfully higher prices. Short 30-day access window on lower tiers.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-navy text-lg mb-2">ExamFX</h3>
              <p className="text-2xl font-extrabold text-gray-500 mb-3">Add-on model</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Base course plus a la carte add-ons for cram sessions, additional practice questions, and pass protection. ExamFX&apos;s guarantee window is limited to just a few days after course completion, which most candidates cannot meet.
              </p>
            </div>
          </div>
          <p className="text-center mt-8 text-sm text-gray-600">
            Full feature-by-feature comparison:{" "}
            <Link href="/compare" className="text-navy underline underline-offset-2 hover:text-gold font-semibold">
              /compare
            </Link>
            {" "}·{" "}
            <Link href="/reviews" className="text-navy underline underline-offset-2 hover:text-gold font-semibold">
              Read student reviews
            </Link>
          </p>
        </div>
      </section>

      {/* Example Total */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Example: Total Cost in Three States
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Same candidate, same JustInsurance prelicensing course, same practice exam — different states.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-navy mb-3">Texas (low-fee)</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>Prelicensing: $199</li>
                <li>Exam fee: $39</li>
                <li>Application: $50</li>
                <li>Fingerprints: ~$40</li>
                <li>Practice exam: $59</li>
              </ul>
              <p className="mt-3 pt-3 border-t border-gray-200 font-bold text-navy">Total: $387</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-navy mb-3">Florida (mid-range)</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>Prelicensing: $199</li>
                <li>Exam fee: $44</li>
                <li>Application: $50</li>
                <li>Fingerprints: ~$48</li>
                <li>Practice exam: $59</li>
              </ul>
              <p className="mt-3 pt-3 border-t border-gray-200 font-bold text-navy">Total: $400</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-navy mb-3">California (high-fee)</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>Prelicensing: $199</li>
                <li>Exam fee: $98</li>
                <li>Application: $188</li>
                <li>Fingerprints: ~$49</li>
                <li>Practice exam: $59</li>
              </ul>
              <p className="mt-3 pt-3 border-t border-gray-200 font-bold text-navy">Total: $593</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Line */}
      <section className="py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Bottom Line</h2>
          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm space-y-4 text-gray-700 leading-relaxed">
            <p>
              An insurance license costs <strong className="text-navy">$300 to $600 all-in</strong> for most resident candidates. The largest line item is usually the prelicensing course, followed by the state application fee in high-fee states like California, Illinois, and Massachusetts.
            </p>
            <p>
              The real driver of total cost is not the sticker price — it is whether you pass on the first try. One retake in California ($98) plus the time lost studying again is more expensive than upgrading to a better course and a <Link href="/practice-exam" className="text-navy underline underline-offset-2 hover:text-gold">$59 practice exam</Link> would have been in the first place. Students who use the JustInsurance pass guarantee path — recommended study hours plus 80%+ on the practice exam three times in a row — pass at 93%, well above the national first-attempt rate.
            </p>
            <p>
              If you are just starting out, pick your state on the <Link href="/" className="text-navy underline underline-offset-2 hover:text-gold">homepage state selector</Link> to see your exact exam fee, application fee, and recommended study hours. If you already have a license and want to know the cost of renewing, the <Link href="/license-renewal-guide" className="text-navy underline underline-offset-2 hover:text-gold">license renewal guide</Link> has the full state-by-state CE breakdown.
            </p>
            <p className="text-sm text-gray-500 italic pt-4 border-t border-gray-100">
              By Justin vom Eigen, Licensed Insurance Agent and Founder of JustInsurance.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion faqs={faqs} heading="Insurance License Cost FAQ" />

      {/* CTA */}
      <CTABanner
        title="See Your State&apos;s Exact Cost"
        subtitle="Pick your state from the homepage selector to see your prelicensing requirements, exam fee, application fee, and study hours — all on one page."
        ctaText="Find Your State"
        ctaHref="/"
      />
    </>
  );
}
