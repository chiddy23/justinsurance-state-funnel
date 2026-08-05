import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stateDisclosure } from "@/lib/state-disclosures";
import { getStateBySlug } from "@/lib/states";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateParams } from "@/lib/generateStaticParams";
import { hasPassGuarantee } from "@/lib/pass-guarantee";
import { hasClassroomWebinarHours, IL_WEBINAR_SHORT_LINE } from "@/lib/il-webinar";
import { credentialKindFromHours, isPrelicensingHeld, meansNotRequired, isCeAvailable, isCeApprovedComingSoon, isPrelicensingApprovedComingSoon } from "@/lib/prelicensing-status";
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

  // Ohio Admin. Code 3901-5-07(H)(16) — no pass-guarantee offers on
  // Ohio-facing pages. Gates the retake FAQ, cost-table note, comparison
  // block, savings box, and closing CTA below. Other states unchanged.
  const guaranteeOk = hasPassGuarantee(stateData.slug);

  // Gates the "state-approved" DOI badge and any self-referential
  // "state-approved" product claim for states where JustInsurance's own
  // provider application is still pending (providerApprovalNumber ===
  // "PENDING", e.g. New York, Washington) — same condition already used
  // for the adjacent Provider Approval # badge.
  const isProviderApproved = stateData.providerApprovalNumber !== "PENDING";

  // AVAILABILITY GATE — true only for a state that MANDATES prelicensing (a
  // numeric hour requirement on any line) AND whose JustInsurance provider
  // approval is still "PENDING" (New York today). This is the SAME signal that
  // holds /[state]/prelicensing and renders the /new-york overview's
  // "enrollment is not open yet" alert. It is deliberately NOT bare
  // `=== "PENDING"`: Washington is also PENDING but requires no prelicensing,
  // sells exam-prep, and shows no availability notice on its overview — so it
  // must not show one on its cost page either. Reverts automatically the moment
  // providerApprovalNumber is set to a real number. Gates the pending-approval
  // disclosure below AND every purchase/price CTA on this page (the hero "Start
  // Now for $199" button, the "Everything Included at $199" card, the closing
  // "Start Your License for $199" CTA, and the all-in $199 cost FAQ) so a held
  // state never presents a buyable $199 course. The factual state-fee breakdown
  // table is left intact (reframed by the disclosure as planning reference).
  const prelicensingHeld = isPrelicensingHeld(stateData);
  // Approved prelicensing provider whose course isn't open yet (NY #80025): the
  // held disclosure + opening-soon copy say "approved — coming soon", not
  // "approval pending". CE availability drives the CE-cost FAQ: WA/NY hold no live
  // CE (WA #300632 approved-coming-soon; NY CE not submitted → ceApproved:false →
  // pending), so neither may say "offers a complete CE package for $X / same-day".
  const prelicensingApprovedComingSoon = isPrelicensingApprovedComingSoon(stateData);
  const ceAvailable = isCeAvailable(stateData);
  const ceComingSoon = isCeApprovedComingSoon(stateData);

  // 50 Ill. Adm. Code Part 3119 — Illinois-only: the approved short format
  // line is added to the cost-breakdown intro so this prelicensing surface
  // states the live-webinar + self-paced hybrid format. No rendered-output
  // change for any other state.
  const ilWebinar = hasClassroomWebinarHours(stateData);

  // -------------------------------------------------------------------------
  // Determine prelicensing requirement & cost
  // -------------------------------------------------------------------------
  // The old test was `/not\s*required/i` against the L&H hours only. That matched
  // Alabama's "Not Required (as of Jan 1, 2024)" but MISSED "None required
  // (optional)" — the value 33 states actually use ("None" contains no "not") — so
  // this page treated prelicensing as MANDATORY across nearly every exam-only
  // state, in all 9 places this flag is used. It also ignored the Life/Health
  // lines, which is what actually decides the requirement (e.g. Wisconsin, whose
  // L&H is "no combined license" but whose Life and Health lines DO require hours).
  // Use the canonical predicate instead.
  const noPrelicensingRequired =
    credentialKindFromHours([
      stateData.prelicensing.life.hours,
      stateData.prelicensing.health.hours,
      stateData.prelicensing.lifeAndHealth.hours,
    ]) === "ce";

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

  // States that charge nothing store regulatory wording ("No fee required",
  // "No separate fee") rather than a number, which read as "the No fee
  // required background-check cost" in the FAQ prose below. Detect that case
  // and reword instead of splicing the phrase in (audit 2026-07-20).
  const backgroundIsFree =
    backgroundDisplay !== "Included" &&
    !/[0-9]/.test(String(stateData.backgroundCheckCost));

  const examLow = feeLow(stateData.examInfo.examFee) ?? 0;
  const appLow = feeLow(stateData.applicationFee) ?? 0;
  // Only count the background-check fee toward the total when the cost table
  // below actually prices that line. In states with no fingerprint/background
  // requirement the row renders "Not required", so adding the fee anyway made
  // the Estimated Total larger than the sum of the visible rows — e.g. Colorado
  // showed $199 + exam + application with the background row "Not required",
  // then a total that silently included a background charge (audit 2026-07-20).
  const bgLow = meansNotRequired(stateData.fingerprintingNotes)
    ? 0
    : (feeLow(stateData.backgroundCheckCost) ?? 0);

  // Always include the $199 JustInsurance course: this page prices the "all-in
  // cost to get licensed THROUGH JustInsurance," and excluding it for optional-
  // prelicensing states produced a total that both under-counted the real cost
  // and contradicted the same sentence's "$199 prelicensing portion" (Alabama bug).
  const jiLow = JI_PRICE_NUM + examLow + appLow + bgLow;

  const formatRange = (low: number, high: number): string => {
    if (low === 0 && high === 0) return "Varies";
    const lowStr = `$${Math.round(low)}`;
    const highStr = `$${Math.round(high)}`;
    return low === high ? lowStr : `${lowStr}–${highStr}`;
  };

  const jiLowDisplay = noPrelicensingRequired
    ? formatRange(jiLow, jiLow)
    : `$${Math.round(jiLow)}`;

  // -------------------------------------------------------------------------
  // FAQs
  // -------------------------------------------------------------------------
  const ceFaqAnswer = ceAvailable
    ? `${stateData.name} requires ${stateData.ce.totalHours} hours of CE every ${stateData.ce.renewalPeriod}, including ${stateData.ce.ethicsHours} ethics hours. JustInsurance offers a complete ${stateData.name} CE package for ${stateData.ce.packagePrice}, with same-day reporting to the ${stateData.doiAbbr}. Single courses start at ${stateData.ce.individualCoursePrice}.`
    : ceComingSoon
    ? `${stateData.name} requires ${stateData.ce.totalHours} hours of CE every ${stateData.ce.renewalPeriod}, including ${stateData.ce.ethicsHours} ethics hours. JustInsurance is an approved ${stateData.name} CE provider (#${stateData.providerApprovalNumber}) — our ${stateData.name} CE courses are coming soon and not yet open for enrollment. Confirm your CE requirement with the ${stateData.doiAbbr}.`
    : `${stateData.name} requires ${stateData.ce.totalHours} hours of CE every ${stateData.ce.renewalPeriod}, including ${stateData.ce.ethicsHours} ethics hours. JustInsurance's ${stateData.name} CE provider approval is currently pending; our ${stateData.name} CE courses are not yet available. Confirm your CE requirement with the ${stateData.doiAbbr}.`;

  const examRetakeAnswer = noPrelicensingRequired
    ? `Failing the ${stateData.name} state exam means paying the ${examFeeDisplay} exam fee again for each retake. ${stateData.examInfo.retakeWaitingPeriod ? "Retake rules: " + stateData.examInfo.retakeWaitingPeriod + "." : ""} JustInsurance practice exams ($59) are designed to mirror the ${stateData.examInfo.examProvider} format so you pass on the first attempt.`
    : `If you fail the ${stateData.name} state exam, you'll pay the ${examFeeDisplay} exam fee again for each retake — and depending on your prelicensing provider, you may need to repurchase course access. ${stateData.examInfo.retakeWaitingPeriod ? "Retake rules: " + stateData.examInfo.retakeWaitingPeriod + "." : ""} ${
        guaranteeOk
          ? "JustInsurance includes a pass guarantee and unlimited practice exams to help you pass the first time and avoid retake fees."
          : "JustInsurance includes unlimited practice exams designed to help you pass on the first attempt and avoid retake fees."
      }`;

  const paymentPlanAnswer = `JustInsurance ${stateData.name} prelicensing is a flat, one-time $199 per course — we do not currently offer payment plans or third-party financing. You pay the course price in full when you enroll. State exam fees, application fees, and fingerprinting are paid separately and directly to the testing vendor, the ${stateData.doiAbbr}, and the fingerprint provider.`;

  const refundAnswer = `JustInsurance offers a 30-day refund policy (processing fee applies; unavailable after 50% course completion) on ${stateData.name} prelicensing courses — see our terms for full details. State-collected fees (exam fee, ${applicationFeeDisplay} application fee${backgroundIsFree ? `` : `, ${backgroundDisplay === "Included" ? "background check" : backgroundDisplay} background check`}) are non-refundable once paid to the ${stateData.doiAbbr} or the testing vendor. Always confirm requirements before paying state fees.`;

  // fid: this answer used to read "Plan for about {jiLowDisplay} all-in …
  // compared with the {totalCostRange} typical range in {state}, which reflects
  // higher-priced course options." Two problems:
  //   1) In California and Florida, totalCostRange IS the JustInsurance figure
  //      ("about $545 (course + state fees)" / "about $343 (course + state
  //      fees)" — exactly 199 + exam + application + background), so the
  //      sentence compared a number to itself.
  //   2) "which reflects higher-priced course options" is a comparative price
  //      claim about other providers that no source in this repo substantiates —
  //      totalCostRange is our own estimate of state fees plus our own course,
  //      not an independently sourced market survey.
  // No independently sourced market figure exists, so the comparison clause is
  // removed rather than re-based on an invented number. The remaining sentence
  // states only our own arithmetic, which the cost table on this page shows.
  // For a held state (isPrelicensingHeld — New York today) the prelicensing
  // course is not yet open for enrollment, so this answer must NOT present a
  // buyable $199 all-in JustInsurance total. State-collected fees stay factual;
  // the JustInsurance portion is described as opening soon, not as a purchase.
  const totalCostAnswer = prelicensingHeld
    ? `In ${stateData.name}, plan for the ${examFeeDisplay} ${stateData.examInfo.examProvider} exam fee and the ${applicationFeeDisplay} ${stateData.doiAbbr} application fee${backgroundIsFree ? `` : `, plus the ${backgroundDisplay} background-check cost`}. ${meansNotRequired(stateData.fingerprintingNotes) ? `Fingerprinting is not required in ${stateData.name}.` : `${stateData.fingerprintingNotes.split(/\.\s/)[0].trim().replace(/\.$/, "")}.`} ${prelicensingApprovedComingSoon ? `JustInsurance is an approved ${stateData.name} provider (#${stateData.providerApprovalNumber}); our ${stateData.name} prelicensing course is opening for enrollment soon — we'll post course pricing once it opens.` : `JustInsurance ${stateData.name} prelicensing is completing ${stateData.doiAbbr} approval and is not yet open for enrollment — we'll post course pricing once it opens.`}`
    : `Plan for about ${jiLowDisplay} all-in to get your ${stateData.name} insurance license through JustInsurance. That covers ${noPrelicensingRequired ? "the optional prelicensing course," : "the prelicensing course,"} the ${examFeeDisplay} ${stateData.examInfo.examProvider} exam fee, ${backgroundIsFree ? `and ` : ``}the ${applicationFeeDisplay} ${stateData.doiAbbr} application fee${backgroundIsFree ? `` : `, and the ${backgroundDisplay} background-check cost`}. ${meansNotRequired(stateData.fingerprintingNotes) ? `Fingerprinting is not required in ${stateData.name}.` : `${stateData.fingerprintingNotes.split(/\.\s/)[0].trim().replace(/\.$/, "")}.`} JustInsurance's all-in price for the prelicensing portion is ${JI_PRICE_LABEL}.`;

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
  const articleDescription = `The estimated total cost to get your ${stateData.name} insurance license is ${stateData.totalCostRange}. Here's the full breakdown — prelicensing, exam, application, and fingerprint fees — with JustInsurance's $199 all-in prelicensing.`;
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

  const fingerprintRequired = !meansNotRequired(stateData.fingerprintingNotes);
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
      ji: noPrelicensingRequired ? `${JI_PRICE_LABEL} (optional)` : JI_PRICE_LABEL,
      note: noPrelicensingRequired
        ? `${stateData.name} does not require prelicensing education — most candidates still study to pass on the first attempt.`
        : guaranteeOk
        ? `JustInsurance includes practice exams + pass guarantee in the $199 base price.`
        : `JustInsurance includes unlimited practice exams in the $199 base price.`,
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

      {/* ── 0. Availability disclosure (held states only) ───────────────────────
          Mirrors the /new-york overview's "enrollment is not open yet" alert so
          the COST page is consistent with the hub. Rendered ABOVE the hero so
          the pending-approval status is stated before any price or "Start Now"
          CTA appears. Gated on prelicensingHeld (isPrelicensingHeld: PENDING
          provider approval AND a numeric prelicensing hour requirement), NOT on
          a hardcoded slug — so it shows for New York today and reverts the
          moment DFS approval issues. The $199 / estimated-total / "Start Now"
          purchase claims below are intentionally left in place; this notice only
          reframes them as planning-reference-only. */}
      {prelicensingHeld && (
        <section className="bg-gray-bg px-4 pt-8">
          <div className="max-w-4xl mx-auto">
            <article className="bg-red-50 border-red-500 border-l-4 rounded-r-xl p-5 shadow-sm">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0" aria-hidden="true">
                  ⚠️
                </span>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide text-navy font-bold mb-1">
                    Important
                  </p>
                  <p className="font-bold text-navy mb-2 leading-snug">
                    JustInsurance {stateData.name} enrollment is not open yet —{" "}
                    {prelicensingApprovedComingSoon
                      ? `approved ${stateData.doiAbbr} provider (#${stateData.providerApprovalNumber}), courses coming soon`
                      : `${stateData.doiAbbr} approval pending`}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {prelicensingApprovedComingSoon
                      ? `JustInsurance is an approved ${stateData.name} provider (#${stateData.providerApprovalNumber}) with the ${stateData.doiName}, but our ${stateData.name} prelicensing courses are not open for enrollment yet.`
                      : `Our ${stateData.name} provider approval with the ${stateData.doiName} is still pending, so JustInsurance prelicensing courses are not open for enrollment in ${stateData.name}.`}{" "}
                    The course prices and all-in cost estimates
                    on this page — including the {JI_PRICE_LABEL} prelicensing
                    price and the estimated total — are shown for planning
                    reference only; they are not a purchase you can complete
                    today. The {stateData.name} licensing information here — fees,
                    exam structure, and deadlines — stays current and maintained
                    either way.
                  </p>
                  <p className="mt-3">
                    <Link
                      href="/contact"
                      className="text-gold-deep font-semibold hover:underline text-sm"
                    >
                      Get notified when {stateData.name} opens →
                    </Link>
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <StateHero
        eyebrow={`${stateData.name} License Cost`}
        title={`How Much Does It Cost to Get a ${stateData.name} Insurance License?`}
        subtitle={`The estimated total cost to get your ${stateData.name} insurance license is ${stateData.totalCostRange}. Here's the full breakdown — prelicensing, exam, application, and fingerprint fees — with JustInsurance's $199 all-in prelicensing.`}
        ctaButtons={
          // Held state (New York today): the "Start Now for $199" primary button
          // reads as a completed purchase, so swap it for a neutral "Learn More"
          // link to the prelicensing overview. "See Requirements" is unchanged.
          prelicensingHeld
            ? [
                {
                  text: "Learn More",
                  href: `/${stateData.slug}/prelicensing`,
                },
                {
                  text: "See Requirements",
                  href: `/${stateData.slug}/requirements`,
                  variant: "secondary",
                },
              ]
            : [
                {
                  text: "Start Now for $199",
                  href: `/${stateData.slug}/prelicensing`,
                },
                {
                  text: "See Requirements",
                  href: `/${stateData.slug}/requirements`,
                  variant: "secondary",
                },
              ]
        }
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
          {/* An unqualified "State-approved by {DOI}" on a PRELICENSING cost page
              reads as prelicensing approval. In exam-only states the DOI runs no
              prelicensing approval program at all and this number is a CE
              credential, so name the credential we actually hold. */}
          {isProviderApproved && (
            <span>
              {noPrelicensingRequired
                ? `${stateData.doiAbbr}-approved CE provider`
                : `State-approved by ${stateData.doiAbbr}`}
            </span>
          )}
        </div>
      </div>

      {stateDisclosure(stateData.slug)?.prelicense && (
        <div className="bg-navy px-4 pb-3">
          <p className="max-w-4xl mx-auto text-center text-xs text-blue-200 leading-relaxed">
            {stateDisclosure(stateData.slug)!.prelicense}
          </p>
        </div>
      )}

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
            insurance license — course, exam, application, and fingerprinting.
            {/* 50 Ill. Adm. Code 3119 — approved short format line (Illinois only) */}
            {ilWebinar && <> {IL_WEBINAR_SHORT_LINE}</>}
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-bg text-navy">
                  <th className="px-5 py-3 text-left font-semibold w-2/3">
                    Line Item
                  </th>
                  <th className="px-5 py-3 text-left font-semibold w-1/3">
                    Cost
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
                      {row.ji}
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-navy text-white">
                  <td className="px-5 py-4 font-bold">
                    Estimated Total
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
            authority, fingerprint provider, and county. Estimated total cost
            range: {stateData.totalCostRange}.
          </p>
        </div>
      </section>

      {/* ── 3. What's Included ──────────────────────────────────────────────── */}
      {/* Held state (New York today): the "$199 all-inclusive" pricing card reads
          as a completed purchase. Replace it with a neutral opening-soon panel
          and a non-purchase "Learn More" link; the factual state-fee table above
          is untouched. All other states render the original card unchanged. */}
      {prelicensingHeld ? (
        <section className="bg-gray-bg py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
              {stateData.name} Prelicensing — Opening for Enrollment Soon
            </h2>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
              {prelicensingApprovedComingSoon
                ? `JustInsurance is an approved ${stateData.name} provider (#${stateData.providerApprovalNumber}), but our ${stateData.name} prelicensing course is not open for enrollment yet.`
                : `Our ${stateData.name} prelicensing course is completing ${stateData.doiAbbr} approval and is not yet open for enrollment.`}{" "}
              The state fee breakdown above stays current so you can plan your{" "}
              {stateData.name} licensing budget ahead of time.
            </p>
            <Link
              href={`/${stateData.slug}/prelicensing`}
              className="inline-block text-navy font-semibold underline underline-offset-4 hover:text-gold-deep transition-colors"
            >
              Learn more about {stateData.name} prelicensing →
            </Link>
          </div>
        </section>
      ) : (
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Everything Included at {JI_PRICE_LABEL}
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
            One flat price for your {stateData.name} prelicensing — practice exams
            {guaranteeOk ? " and pass guarantee" : " and full course access"} bundled in,
            with no add-on tiers.
          </p>

          <div className="max-w-md mx-auto">
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
                  {/* "State-approved" here asserts a PRELICENSING approval. In
                      exam-only states our approval is CE-only, so gate on the
                      requirement too — same defect class as faq-data.ts. */}
                  {isProviderApproved && !noPrelicensingRequired
                    ? `State-approved ${stateData.name} prelicensing course`
                    : `${stateData.name} ${noPrelicensingRequired ? "exam-prep" : "prelicensing"} course`}
                </li>
                <li className="flex gap-2">
                  <span className="text-gold font-bold">✓</span>
                  Unlimited practice exam access
                </li>
                <li className="flex gap-2">
                  <span className="text-gold font-bold">✓</span>
                  {guaranteeOk
                    ? "Pass guarantee — course-fee refund if you fail your first attempt (terms apply)"
                    : "Instant course access — start studying within minutes of enrolling"}
                </li>
                <li className="flex gap-2">
                  <span className="text-gold font-bold">✓</span>
                  One-time $199 — pay once, no subscription
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      )}

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
            full licensing cost within their first month of selling.
            {" "}Insurance producers are in steady demand across{" "}
            {stateData.name}, with the largest concentrations in {stateData.city1} and{" "}
            {stateData.city2}. Career advancement is also fast: experienced
            agents in {stateData.name} earn between {stateData.experiencedIncome}{" "}
            and {stateData.experiencedIncomeHigh}, and top producers pull in
            {" "}{stateData.topProducerIncome}+ annually.
          </p>
          <p className="text-gray-500 text-sm italic leading-relaxed mb-6">
            Income figures are illustrative and drawn from public
            labor-market data (e.g., U.S. Bureau of Labor Statistics); they
            are not a guarantee or representation of earnings, and
            individual results vary.
          </p>
          {ceAvailable ? (
          <p className="text-gray-600 leading-relaxed">
            On the maintenance side, your {stateData.name} license renews every{" "}
            {stateData.ce.renewalPeriod} ({stateData.ce.totalHours} CE hours,
            {" "}{stateData.ce.ethicsHours} ethics) — that&apos;s another{" "}
            {stateData.ce.packagePrice} every {stateData.ce.renewalPeriod} for a
            JustInsurance CE package, or roughly{" "}
            {stateData.ce.individualCoursePrice}/course à la carte. Renewal
            deadline: {stateData.renewalDeadline}.
          </p>
          ) : (
          <p className="text-gray-600 leading-relaxed">
            On the maintenance side, your {stateData.name} license renews every{" "}
            {stateData.ce.renewalPeriod} ({stateData.ce.totalHours} CE hours,
            {" "}{stateData.ce.ethicsHours} ethics).{" "}
            {ceComingSoon
              ? `JustInsurance is an approved ${stateData.name} CE provider (#${stateData.providerApprovalNumber}) — our ${stateData.name} CE package will open soon.`
              : `Our ${stateData.name} CE package will open soon; our ${stateData.name} CE provider approval is pending.`}{" "}
            Renewal deadline: {stateData.renewalDeadline}.
          </p>
          )}
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
                to your prelicensing course, so a slipped test date doesn&apos;t
                force a repurchase. Certificate of completion validity in{" "}
                {stateData.name}: {stateData.certificateValidity}.
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
                  : isProviderApproved && !prelicensingHeld
                  ? "State-approved courses for every line of authority."
                  : "Courses for every line of authority."}
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
                {ceAvailable ? (
                  <>
                {stateData.ce.totalHours} hours every{" "}
                {stateData.ce.renewalPeriod} from {stateData.ce.packagePrice}.
                  </>
                ) : (
                  <>
                {stateData.ce.totalHours} hours every{" "}
                {stateData.ce.renewalPeriod} — coming soon.
                  </>
                )}
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
        title={
          // Held state (New York today): no buyable "$199" title or "Start Now"
          // CTA — swap for the neutral opening-soon message and a "Learn More"
          // link. Reverts automatically once provider approval issues.
          prelicensingHeld
            ? `${stateData.name} Prelicensing — Opening for Enrollment Soon`
            : `Start Your ${stateData.name} Insurance License for $199`
        }
        subtitle={
          prelicensingHeld
            ? prelicensingApprovedComingSoon
              ? `JustInsurance is an approved ${stateData.name} provider (#${stateData.providerApprovalNumber}) — our ${stateData.name} prelicensing course is opening for enrollment soon.`
              : `Our ${stateData.name} prelicensing course is completing state approval and will open for enrollment soon.`
            : guaranteeOk
            ? `All-inclusive $199 prelicensing — practice exams and a pass guarantee built in.`
            : `All-inclusive $199 prelicensing — practice exams and instant course access built in.`
        }
        ctaText={prelicensingHeld ? "Learn More" : "Start Now for $199"}
        ctaHref={`/${stateData.slug}/prelicensing`}
      />
    </>
  );
}
