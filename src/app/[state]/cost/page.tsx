import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateParams } from "@/lib/generateStaticParams";
import {
  generateArticleSchemaWithReviewer,
  generateBreadcrumbSchema,
  generateFAQSchema,
  SchemaMarkup,
} from "@/lib/schema";
import StateHero from "@/components/StateHero";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleByline from "@/components/ArticleByline";
import EditorialByline from "@/components/EditorialByline";
import RelatedStatePages from "@/components/RelatedStatePages";
import LastUpdated from "@/components/LastUpdated";

export function generateStaticParams() {
  return generateStateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) return {};
  return generatePageMetadata({
    pageType: "state-cost",
    stateName: stateData.name,
    stateSlug: stateData.slug,
    stateAbbreviation: stateData.abbreviation,
    totalCostRange: stateData.totalCostRange,
  });
}

// Helper: try to extract a numeric value from a fee string. Returns null
// when the string contains no digits (e.g. "No separate fee", "Varies",
// or empty). For range strings like "50-$75" we use the LOW end so the
// "low estimate" totals stay conservative.
function feeLow(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const cleaned = String(raw).replace(/[$,\s]/g, "");
  const match = cleaned.match(/[0-9]+(?:\.[0-9]+)?/);
  return match ? parseFloat(match[0]) : null;
}

function feeHigh(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const cleaned = String(raw).replace(/[$,\s]/g, "");
  const matches = cleaned.match(/[0-9]+(?:\.[0-9]+)?/g);
  if (!matches || matches.length === 0) return null;
  return parseFloat(matches[matches.length - 1]);
}

// Format a fee for display. Preserves the source string when it is
// non-numeric (e.g. "No separate fee") so users see the actual
// regulatory wording.
function feeDisplay(raw: string | undefined | null): string {
  if (raw === undefined || raw === null || raw === "") return "Included";
  const text = String(raw);
  if (!/[0-9]/.test(text)) return text;
  if (text.includes("$")) return text.startsWith("$") ? text : `$${text}`;
  if (text.includes("-")) return `$${text}`;
  return `$${text}`;
}

export default async function CostPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) notFound();

  // -------------------------------------------------------------------------
  // Determine prelicensing requirement & cost
  // -------------------------------------------------------------------------
  const lhHours = stateData.prelicensing.lifeAndHealth.hours;
  const noPrelicensingRequired =
    typeof lhHours !== "number" &&
    /not\s*required/i.test(String(lhHours));

  const prelicensingDisplay = noPrelicensingRequired
    ? "Not required"
    : stateData.prelicensing.lifeAndHealth.totalCost ||
      stateData.prelicensing.lifeAndHealth.price ||
      "$199";

  // JustInsurance flat price
  const JI_PRICE_NUM = 199;
  const JI_PRICE_LABEL = "$199";

  // -------------------------------------------------------------------------
  // Build line items
  // -------------------------------------------------------------------------
  const examFeeDisplay = feeDisplay(stateData.examInfo.examFee);
  const applicationFeeDisplay = feeDisplay(stateData.applicationFee);
  const backgroundDisplay = feeDisplay(stateData.backgroundCheckCost);

  const examLow = feeLow(stateData.examInfo.examFee) ?? 0;
  const examHigh = feeHigh(stateData.examInfo.examFee) ?? examLow;
  const appLow = feeLow(stateData.applicationFee) ?? 0;
  const appHigh = feeHigh(stateData.applicationFee) ?? appLow;
  const bgLow = feeLow(stateData.backgroundCheckCost) ?? 0;
  const bgHigh = feeHigh(stateData.backgroundCheckCost) ?? bgLow;
  const preLow = noPrelicensingRequired
    ? 0
    : feeLow(stateData.prelicensing.lifeAndHealth.totalCost) ?? JI_PRICE_NUM;
  const preHigh = noPrelicensingRequired
    ? 0
    : feeHigh(stateData.prelicensing.lifeAndHealth.totalCost) ?? preLow;

  // Typical low/high estimated total — using JustInsurance's $199 prelicensing
  // for the JI total, and the source state's totalCost for the typical range.
  const typicalLow = preLow + examLow + appLow + bgLow;
  const typicalHigh = preHigh + examHigh + appHigh + bgHigh;

  const jiLow = (noPrelicensingRequired ? 0 : JI_PRICE_NUM) + examLow + appLow + bgLow;

  const formatRange = (low: number, high: number): string => {
    if (low === 0 && high === 0) return "Varies";
    const lowStr = `$${Math.round(low)}`;
    const highStr = `$${Math.round(high)}`;
    return low === high ? lowStr : `${lowStr}–${highStr}`;
  };

  const totalLowDisplay = formatRange(typicalLow, typicalHigh);
  const jiLowDisplay = noPrelicensingRequired
    ? formatRange(jiLow, jiLow)
    : `$${Math.round(jiLow)}`;
  const savingsLow = Math.max(0, Math.round(typicalLow - jiLow));
  const savingsHigh = Math.max(0, Math.round(typicalHigh - jiLow));
  const savingsDisplay =
    savingsLow === savingsHigh
      ? `$${savingsLow}`
      : `$${savingsLow}–$${savingsHigh}`;

  // -------------------------------------------------------------------------
  // FAQs
  // -------------------------------------------------------------------------
  const ceFaqAnswer = `${stateData.name} requires ${stateData.ce.totalHours} hours of CE every ${stateData.ce.renewalPeriod}, including ${stateData.ce.ethicsHours} ethics hours. JustInsurance offers a complete ${stateData.name} CE package for ${stateData.ce.packagePrice}, with same-day reporting to the ${stateData.doiAbbr}. Single courses start at ${stateData.ce.individualCoursePrice}.`;

  const examRetakeAnswer = noPrelicensingRequired
    ? `Failing the ${stateData.name} state exam means paying the ${examFeeDisplay} exam fee again for each retake. ${stateData.examInfo.retakeWaitingPeriod ? "Retake rules: " + stateData.examInfo.retakeWaitingPeriod + "." : ""} JustInsurance practice exams ($59) are designed to mirror the ${stateData.examInfo.examProvider} format so you pass on the first attempt.`
    : `If you fail the ${stateData.name} state exam, you'll pay the ${examFeeDisplay} exam fee again for each retake — and depending on your prelicensing provider, you may need to repurchase course access. ${stateData.examInfo.retakeWaitingPeriod ? "Retake rules: " + stateData.examInfo.retakeWaitingPeriod + "." : ""} JustInsurance includes a pass guarantee and unlimited practice exams to keep retake costs at zero.`;

  const paymentPlanAnswer = `Yes — JustInsurance offers ${stateData.name} prelicensing through Affirm, with monthly payment plans starting at $199 paid over 3, 6, or 12 months (subject to credit approval). You can also pay in full upfront. State exam fees, application fees, and fingerprinting are paid directly to the testing vendor, ${stateData.doiAbbr}, and the fingerprint provider — those aren't covered by Affirm financing.`;

  const refundAnswer = `JustInsurance offers a satisfaction-based refund policy on ${stateData.name} prelicensing courses — see our terms for full details. State-collected fees (exam fee, ${applicationFeeDisplay} application fee, ${backgroundDisplay === "Included" ? "background check" : backgroundDisplay} background check) are non-refundable once paid to the ${stateData.doiAbbr} or the testing vendor. Always confirm requirements before paying state fees.`;

  const totalCostAnswer = `Plan for ${totalLowDisplay} all-in to get your ${stateData.name} insurance license. That covers ${noPrelicensingRequired ? "the optional prelicensing course," : "prelicensing course,"} the ${examFeeDisplay} ${stateData.examInfo.examProvider} exam fee, the ${applicationFeeDisplay} ${stateData.doiAbbr} application fee, and the ${backgroundDisplay} background-check cost. Fingerprinting is ${/^not required/i.test(stateData.fingerprintingNotes) ? "not required in " + stateData.name : "handled per " + stateData.fingerprintingNotes.split(".")[0].toLowerCase() + "."} JustInsurance's all-in price for the prelicensing portion is ${JI_PRICE_LABEL}.`;

  const faqs = [
    {
      question: `What is the total cost to get an insurance license in ${stateData.name}?`,
      answer: totalCostAnswer,
    },
    {
      question: `What happens if I fail the ${stateData.name} insurance exam?`,
      answer: examRetakeAnswer,
    },
    {
      question: `How much does it cost to renew my ${stateData.name} insurance license?`,
      answer: ceFaqAnswer,
    },
    {
      question: `Does JustInsurance offer payment plans for ${stateData.name} prelicensing?`,
      answer: paymentPlanAnswer,
    },
    {
      question: `What is JustInsurance's refund policy on ${stateData.name} courses?`,
      answer: refundAnswer,
    },
  ];

  // -------------------------------------------------------------------------
  // Schema
  // -------------------------------------------------------------------------
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    {
      name: stateData.name,
      url: `https://justinsuranceco.com/${stateData.slug}`,
    },
    {
      name: "Cost",
      url: `https://justinsuranceco.com/${stateData.slug}/cost`,
    },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const articleHeadline = `How Much Does It Cost to Get a ${stateData.name} Insurance License?`;
  const articleDescription = `The estimated total cost to get your ${stateData.name} insurance license is ${stateData.totalCostRange}. Here's the full breakdown — prelicensing, exam, application, and fingerprint fees — plus how JustInsurance's $199 all-in prelicensing keeps you on the low end.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${stateData.slug}/cost`,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}` },
    { name: "Cost" },
  ];

  // -------------------------------------------------------------------------
  // Cost-table line items
  // -------------------------------------------------------------------------
  type Row = {
    label: string;
    typical: string;
    ji: string;
    note?: string;
  };

  const fingerprintRequired = !/^not required/i.test(
    stateData.fingerprintingNotes || ""
  );
  const fingerprintTypicalCost = fingerprintRequired
    ? backgroundDisplay
    : "Not required";
  const fingerprintJI = fingerprintRequired
    ? backgroundDisplay
    : "Not required";

  const costRows: Row[] = [
    {
      label: "Prelicensing course",
      typical: noPrelicensingRequired
        ? "Not required"
        : prelicensingDisplay,
      ji: noPrelicensingRequired ? "Optional" : JI_PRICE_LABEL,
      note: noPrelicensingRequired
        ? `${stateData.name} eliminated mandatory prelicensing — most candidates still study to pass on the first attempt.`
        : `JustInsurance includes practice exams + pass guarantee in the $199 base price.`,
    },
    {
      label: `State exam fee (${stateData.examInfo.examProvider})`,
      typical: examFeeDisplay,
      ji: examFeeDisplay,
      note: `Paid directly to ${stateData.examInfo.examProvider}; not refundable on a fail.`,
    },
    {
      label: `License application fee (${stateData.doiAbbr})`,
      typical: applicationFeeDisplay,
      ji: applicationFeeDisplay,
      note: `Paid to the ${stateData.doiName} via NIPR or sircon at submission.`,
    },
    {
      label: "Fingerprinting / background check",
      typical: fingerprintTypicalCost,
      ji: fingerprintJI,
      note: fingerprintRequired
        ? stateData.fingerprintingNotes
        : `${stateData.name} does not require fingerprinting for resident insurance license applicants.`,
    },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <StateHero
        eyebrow={`${stateData.name} License Cost`}
        title={`How Much Does It Cost to Get a ${stateData.name} Insurance License?`}
        subtitle={`The estimated total cost to get your ${stateData.name} insurance license is ${stateData.totalCostRange}. Here's the full breakdown — prelicensing, exam, application, and fingerprint fees — plus how JustInsurance's $199 all-in prelicensing keeps you on the low end.`}
        ctaButtons={[
          {
            text: "Start Now for $199",
            href: `/${stateData.slug}/prelicensing`,
          },
          {
            text: "See Requirements",
            href: `/${stateData.slug}/requirements`,
            variant: "secondary",
          },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* Trust strip */}
      <div className="bg-navy border-t border-blue-800 py-3 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-blue-200">
          <span>Last Verified: {stateData.lastVerified}</span>
          {stateData.providerApprovalNumber !== "PENDING" && (
            <span>Provider Approval #{stateData.providerApprovalNumber}</span>
          )}
          <span>State-approved by {stateData.doiAbbr}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <EditorialByline lastVerified={stateData.lastVerified} />
      </div>

      {/* ── 2. Cost Breakdown Table ─────────────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            {stateData.name} Insurance License Cost Breakdown
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Every fee you&apos;ll pay between today and your active {stateData.name}{" "}
            insurance license, side-by-side with the JustInsurance all-inclusive
            price.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-bg text-navy">
                  <th className="px-5 py-3 text-left font-semibold w-1/3">
                    Line Item
                  </th>
                  <th className="px-5 py-3 text-left font-semibold w-1/4">
                    Typical {stateData.abbreviation} Cost
                  </th>
                  <th className="px-5 py-3 text-left font-semibold w-1/4">
                    JustInsurance Path
                  </th>
                </tr>
              </thead>
              <tbody>
                {costRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-bg"}
                  >
                    <td className="px-5 py-3.5 align-top">
                      <p className="font-semibold text-navy">{row.label}</p>
                      {row.note && (
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                          {row.note}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 align-top text-gray-700 font-medium">
                      {row.typical}
                    </td>
                    <td className="px-5 py-3.5 align-top text-gray-700 font-medium">
                      {row.ji}
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-navy text-white">
                  <td className="px-5 py-4 font-bold">
                    Estimated Total (low–high)
                  </td>
                  <td className="px-5 py-4 font-bold">
                    {totalLowDisplay}
                  </td>
                  <td className="px-5 py-4 font-bold text-gold">
                    {jiLowDisplay}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            Estimates based on current published fees from the{" "}
            {stateData.doiName}, {stateData.examInfo.examProvider}, and the{" "}
            JustInsurance prelicensing catalog. Last verified{" "}
            {stateData.lastVerified}. Individual costs may vary by line of
            authority, fingerprint provider, and county. Total cost range
            reported by the {stateData.doiAbbr}: {stateData.totalCostRange}.
          </p>
        </div>
      </section>

      {/* ── 3. JustInsurance Comparison Block ───────────────────────────────── */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Why JustInsurance Costs Less in {stateData.name}
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            Most {stateData.name} prelicensing providers charge separately for
            practice exams, retake protection, and pass guarantees. We bundle
            all three into the $199 base price.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-gold">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                JustInsurance — All-Inclusive
              </p>
              <p className="text-3xl font-bold text-navy mb-3">
                {JI_PRICE_LABEL}
                <span className="text-base font-normal text-gray-500">
                  {" "}prelicensing
                </span>
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-gold font-bold">✓</span>
                  State-approved {stateData.name} prelicensing course
                </li>
                <li className="flex gap-2">
                  <span className="text-gold font-bold">✓</span>
                  Unlimited practice exam access
                </li>
                <li className="flex gap-2">
                  <span className="text-gold font-bold">✓</span>
                  Pass guarantee — refund or rebook if you fail (terms apply)
                </li>
                <li className="flex gap-2">
                  <span className="text-gold font-bold">✓</span>
                  Affirm financing (3, 6, or 12 months)
                </li>
                <li className="flex gap-2">
                  <span className="text-gold font-bold">✓</span>
                  93% pass rate among compliant students
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-gray-300">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                Typical {stateData.name} Provider Stack
              </p>
              <p className="text-3xl font-bold text-gray-700 mb-3">
                $300+
                <span className="text-base font-normal text-gray-500">
                  {" "}à la carte
                </span>
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-gray-400 font-bold">·</span>
                  Base prelicensing course ($199–$299)
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400 font-bold">·</span>
                  Practice exams sold separately ($49–$99)
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400 font-bold">·</span>
                  Pass guarantee usually a paid upgrade
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400 font-bold">·</span>
                  Limited course-access window (often 30 days)
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-400 font-bold">·</span>
                  No published pass rate
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm text-center border border-gold">
            <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider">
              Estimated savings vs typical {stateData.abbreviation} provider
              stack
            </p>
            <p className="text-3xl md:text-4xl font-bold text-navy mb-2">
              {savingsDisplay}
            </p>
            <p className="text-sm text-gray-600">
              Includes practice exams and pass guarantee — most providers
              charge $50–$100 more for these.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. State Cost Context (income/ROI) ──────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
            What Does a {stateData.name} Insurance License Pay Back?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Even at the high end of the {stateData.totalCostRange} range, a{" "}
            {stateData.name} insurance license is one of the lowest-cost
            licensed professional credentials in the United States. With the{" "}
            average {stateData.name} insurance agent earning {stateData.avgIncome}{" "}
            per year and entry-level agents starting at{" "}
            {stateData.firstYearIncome}, most new licensees earn back their
            full licensing cost within their first month of selling. The
            {" "}{stateData.doiAbbr} reports{" "}
            {stateData.studentsCount} licensed agents currently active in{" "}
            {stateData.name}, with concentrations in {stateData.city1} and{" "}
            {stateData.city2}. Career advancement is also fast: experienced
            agents in {stateData.name} earn between {stateData.experiencedIncome}{" "}
            and {stateData.experiencedIncomeHigh}, and top producers pull in
            {" "}{stateData.topProducerIncome}+ annually.
          </p>
          <p className="text-gray-600 leading-relaxed">
            On the maintenance side, your {stateData.name} license renews every{" "}
            {stateData.ce.renewalPeriod} ({stateData.ce.totalHours} CE hours,
            {" "}{stateData.ce.ethicsHours} ethics) — that&apos;s another{" "}
            {stateData.ce.packagePrice} every {stateData.ce.renewalPeriod} for a
            JustInsurance CE package, or roughly{" "}
            {stateData.ce.individualCoursePrice}/course à la carte. Renewal
            deadline: {stateData.renewalDeadline}.
          </p>
        </div>
      </section>

      {/* ── 5. Cost vs Other States Note ─────────────────────────────────────── */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
            Hidden Costs to Watch in {stateData.name}
          </h2>
          <ul className="space-y-4 text-gray-600 leading-relaxed">
            <li>
              <strong className="text-navy">Exam retakes.</strong> The{" "}
              {stateData.examInfo.examProvider} {stateData.name} exam fee (
              {examFeeDisplay}) is charged for every attempt.{" "}
              {stateData.examInfo.retakeWaitingPeriod
                ? "Retake rules: " + stateData.examInfo.retakeWaitingPeriod + "."
                : ""}{" "}
              Failing twice can add ${(examLow * 2 || 100).toFixed(0)}+ to your
              licensing cost — practice exams pay for themselves the first
              time you would have failed.
            </li>
            {fingerprintRequired && (
              <li>
                <strong className="text-navy">Fingerprinting logistics.</strong>{" "}
                {stateData.fingerprintingNotes} Travel time and any rescheduling
                fees are on you, not the state.
              </li>
            )}
            <li>
              <strong className="text-navy">Appointment fees.</strong> Once your{" "}
              {stateData.name} license is issued, each insurance carrier you
              represent submits an appointment to the {stateData.doiAbbr}.
              Carriers typically cover the appointment fee, but a few pass it
              through to new producers — confirm before signing.
            </li>
            {!noPrelicensingRequired && (
              <li>
                <strong className="text-navy">Course-access expiration.</strong>{" "}
                JustInsurance gives you {stateData.courseAccessDays}-day access
                to your prelicensing course; many competitors expire access
                after 30 days, forcing repurchase if your test-day slips.
                Certificate of completion validity in {stateData.name}:{" "}
                {stateData.certificateValidity}.
              </li>
            )}
            <li>
              <strong className="text-navy">CE non-compliance.</strong> Letting
              your {stateData.name} CE lapse triggers reinstatement fees and (if
              the lapse runs long) re-examination — a multi-hundred-dollar
              mistake. Renew on time: {stateData.renewalDeadline}.
            </li>
          </ul>
        </div>
      </section>

      {/* ── 6. FAQ ───────────────────────────────────────────────────────────── */}
      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} Insurance License Cost — FAQs`}
      />

      {/* ── 7. Internal Links ───────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy mb-6">
            Keep Exploring {stateData.name} Licensing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href={`/${stateData.slug}`}
              className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <div className="font-semibold text-navy mb-1">
                {stateData.name} Hub
              </div>
              <div className="text-sm text-gray-600">
                Everything you need to start your career in {stateData.name}.
              </div>
            </Link>
            <Link
              href={`/${stateData.slug}/prelicensing`}
              className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <div className="font-semibold text-navy mb-1">Prelicensing</div>
              <div className="text-sm text-gray-600">
                {noPrelicensingRequired
                  ? "Optional in " +
                    stateData.name +
                    " — but recommended for first-attempt success."
                  : "State-approved courses for every line of authority."}
              </div>
            </Link>
            <Link
              href={`/${stateData.slug}/requirements`}
              className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <div className="font-semibold text-navy mb-1">Requirements</div>
              <div className="text-sm text-gray-600">
                Hours, exam, fingerprinting, and renewal rules.
              </div>
            </Link>
            <Link
              href={`/${stateData.slug}/continuing-education`}
              className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all"
            >
              <div className="font-semibold text-navy mb-1">CE Renewal</div>
              <div className="text-sm text-gray-600">
                {stateData.ce.totalHours} hours every{" "}
                {stateData.ce.renewalPeriod} from {stateData.ce.packagePrice}.
              </div>
            </Link>
          </div>
        </div>
      </section>

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="state-hub"
        variant="white"
      />

      {/* Visible "Last updated" stamp above the final CTA */}
      <section className="bg-white py-6 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <LastUpdated date={stateData.lastVerified} />
        </div>
      </section>

      {/* ── 8. CTA Banner ────────────────────────────────────────────────────── */}
      <CTABanner
        title={`Start Your ${stateData.name} Insurance License for $199`}
        subtitle={`All-inclusive prelicensing — practice exams, pass guarantee, and Affirm financing built in. Most students recoup the cost in their first month selling.`}
        ctaText="Start Now for $199"
        ctaHref={`/${stateData.slug}/prelicensing`}
      />
    </>
  );
}
