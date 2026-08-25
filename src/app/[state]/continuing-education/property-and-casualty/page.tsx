import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import {
  generateArticleSchemaWithReviewer,
  generateBreadcrumbSchema,
  generateCourseSchema,
  generateFAQSchema,
  SchemaMarkup,
} from "@/lib/schema";
import {
  PC_STATE_SLUGS,
  getPCPackagesForState,
  isPCMultiPackageState,
  type PCPackage,
} from "@/data/pc-ce-packages";
import ArticleByline from "@/components/ArticleByline";
import StateHero from "@/components/StateHero";
import CourseOverviewBox from "@/components/CourseOverviewBox";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner, { RefundDisclosure } from "@/components/CTABanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CeApprovalNotice from "@/components/CeApprovalNotice";
import RelatedStatePages from "@/components/RelatedStatePages";
import CEIndividualCoursesTile from "@/components/CEIndividualCoursesTile";

// ---------------------------------------------------------------------------
// Static params — only the 25 states with at least one P&C package
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return PC_STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  const packages = getPCPackagesForState(state);
  if (!stateData || packages.length === 0) return {};

  const isMulti = packages.length > 1;
  const totalHrsLabel = isMulti
    ? `${Math.min(...packages.map((p) => p.totalHours))}-${Math.max(
        ...packages.map((p) => p.totalHours)
      )} Hours`
    : `${packages[0].totalHours} Hours`;

  const title = isMulti
    ? `${stateData.name} P&C CE Packages — ${totalHrsLabel} | JustInsurance`
    : `${stateData.name} P&C CE Package — ${totalHrsLabel} | JustInsurance`;

  const description = isMulti
    ? `${packages.length} state-approved Property & Casualty CE packages for ${stateData.name} insurance producers. Hour ranges from ${totalHrsLabel}. Online, self-paced, same-day DOI reporting in most cases.`
    : `Complete your ${stateData.name} P&C continuing education in one package: ${packages[0].ethicsHours}-hour ${packages[0].ethicsLabel} + ${packages[0].pcHours}-hour P&C electives. Online, self-paced, same-day DOI reporting in most cases. ${packages[0].price}.`;

  const canonical = `https://justinsuranceco.com/${state}/continuing-education/property-and-casualty`;

  return {
    // .absolute prevents the root layout's "%s | JustInsurance" template from
    // double-appending the brand suffix (our title already includes it per spec).
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    // Own twitter block so the root layout's fallback (which may carry
    // marketing claims not valid in every state) is never inherited here.
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ---------------------------------------------------------------------------
// CE STRUCTURE — how a state counts CE across MULTIPLE lines of authority.
//
// This page used to assert, for EVERY state, that "P&C and L&H CE are tracked
// separately," that "completing L&H CE does NOT count toward your P&C
// requirement," and that "dual-licensed agents must complete CE for each line
// they hold." That is false in most states, and it is a consumer-harm claim: a
// dual-licensed producer reading it could buy and complete roughly double the
// CE their state actually requires.
//
// `states.ts` carries no field describing multi-line CE structure (CEInfo has
// totalHours / ethicsHours / renewalPeriod only), so the map below is keyed by
// state NAME — both buildPCFAQs and PCPackageDetail have the display name — and
// lists ONLY states whose structure was confirmed against the primary source
// cited on each entry. Any state NOT listed falls through to neutral copy that
// asserts neither structure and points the producer at their DOI; that copy is
// true in every state, so adding a state here is purely additive.
// ---------------------------------------------------------------------------
type CeStructure =
  | {
      /**
       * One per-producer CE total covering every line held; approved CE in any
       * line of authority counts toward it. Holding P&C + L&H does not double
       * the hours owed.
       */
      kind: "combined";
      /**
       * True when the state publishes a single flat total that copy can name.
       * False when the total varies by tenure or license class (Florida: 24
       * hours in the first 6 years of licensure, 20 thereafter), in which case
       * copy must describe the structure without asserting one number.
       */
      flatTotal: boolean;
    }
  | {
      /**
       * The biennial total scales with the number of license CATEGORIES held
       * and carries a per-category minimum — neither "one combined total" nor
       * "a full separate requirement per line" is accurate.
       */
      kind: "per-category-minimum";
      singleCategoryHours: number;
      multiCategoryHours: number;
      perCategoryMinimum: number;
    };

const CE_STRUCTURE_BY_STATE: Partial<Record<string, CeStructure>> = {
  // 215 ILCS 5/500-35; 50 Ill. Adm. Code 3119 — 24 hours total per producer per
  // 2-year cycle, and approved CE in any line of authority counts toward it.
  Illinois: { kind: "combined", flatTotal: true },
  // Ohio Rev. Code §3905.481 + ODI CE Fact Sheet — a producer holding multiple
  // lines does not complete more than 24 hours, and a P&C-only agent may take a
  // life course for general credit.
  Ohio: { kind: "combined", flatTotal: true },
  // 044-20 Wyo. Code R. §20-3 (Basic Requirement): "Licensees shall complete
  // twenty-four (24) contact hours of continuing education within each two (2)
  // year licensing period" — owed per LICENSEE, not per line. Wyoming DOI CE
  // page (doi.wyo.gov/licensing/ce) states the 24 hours apply to resident
  // producers generally, with 3 in ethics.
  Wyoming: { kind: "combined", flatTotal: true },
  // Cal. Ins. Code §1749.3, as published by the CDI: "An individual licensed as
  // a property broker-agent or casualty broker-agent and as a life-only agent
  // or an accident and health agent shall satisfy the requirements of this
  // section by demonstrating completion of the courses, programs of
  // instruction, or seminars approved by the commissioner for any of the
  // license types listed in this section." One 24-hour term requirement.
  California: { kind: "combined", flatTotal: true },
  // TDI (tdi.texas.gov/agent/agcehome.html): 24 hours including 3 ethics per
  // 2-year period for every major license type, and "Courses are not divided by
  // license type" — only "General" and "Ethics" topic groups exist.
  Texas: { kind: "combined", flatTotal: true },
  // Fla. Stat. §626.2815 (flsenate.gov): "A licensee who holds multiple
  // insurance licenses must complete an update course that is specific to at
  // least one of the licenses held," with the remaining required hours elective
  // and satisfiable by any department-approved course. flatTotal is false
  // because Florida's total is 24 hours in the first 6 years and 20 after.
  Florida: { kind: "combined", flatTotal: false },
  // Idaho DOI (doi.idaho.gov/industry/licensing-services/continuing-education/
  // ce-producer/): 24 hours every 2 years, 3 in ethics, for a producer holding
  // "one or more" major lines — plus "Any courses in the course catalog are
  // acceptable; you are not limited to only the lines you carry on your
  // license."
  Idaho: { kind: "combined", flatTotal: true },
  // NIPR Iowa resident renewal requirements: "Complete 36 total CE credits
  // during each CE term" and "Complete at least 3 credits in Ethics." The only
  // line-based variation NIPR lists is crop-only producers (18 credits), so the
  // 36 is a per-producer total rather than a per-line one.
  Iowa: { kind: "combined", flatTotal: true },
  // Va. Code §38.2-1866 (law.lis.virginia.gov). Subsection (G): "any agent who
  // holds licenses from more than one category of licenses identified in
  // subsection A shall complete 24 hours of relevant continuing education
  // credits with a minimum of eight credit hours in each such category." A
  // single-category agent completes 16 hours. Subsection (H) requires 3 of the
  // biennial credits in insurance ethics. So Virginia genuinely scales — but it
  // scales 16 -> 24, it does not double to 32.
  Virginia: {
    kind: "per-category-minimum",
    singleCategoryHours: 16,
    multiCategoryHours: 24,
    perCategoryMinimum: 8,
  },
};

// ---------------------------------------------------------------------------
// Shared FAQ generator — produces 7 P&C-specific Q&A using state-specific facts
// EXPORTED so the [package]/page.tsx route can reuse it.
//
// CRITICAL (Fix 1.1, 2026-04-29): The "how many hours does the state require"
// answer MUST be sourced from `pkg.stateRequirement.totalHours` (state truth),
// NOT from `pkg.totalHours` (package contents). Earlier code rendered the
// package hours as the state mandate — for FL Personal Lines this produced
// "Florida requires 28 hours" when the actual statute requires 20.
// ---------------------------------------------------------------------------
export function buildPCFAQs(
  stateName: string,
  doiName: string,
  pkg: PCPackage,
  ceHours: number,
  ceRenewalPeriod: string,
  ceEthicsHours: number
): { question: string; answer: string }[] {
  const stateReq = pkg.stateRequirement;
  const cyclePhrase =
    stateReq.renewalCycleYears === 1
      ? "every year"
      : `every ${stateReq.renewalCycleYears} years`;

  // How this state counts CE across multiple lines of authority. See
  // CE_STRUCTURE_BY_STATE above — `undefined` means unconfirmed, which routes
  // every branch below to neutral copy that asserts neither structure.
  const ceStructure = CE_STRUCTURE_BY_STATE[stateName];
  const isCombinedCE = ceStructure?.kind === "combined";
  const combinedFlatTotal =
    ceStructure?.kind === "combined" && ceStructure.flatTotal;
  const perCategoryCE =
    ceStructure?.kind === "per-category-minimum" ? ceStructure : undefined;

  // Build the state-truth answer from stateReq fields.
  let stateReqAnswer =
    `${stateName} requires Property & Casualty insurance producers to complete ` +
    `${stateReq.totalHours} hours of continuing education ${cyclePhrase}, ` +
    `including ${stateReq.ethicsHours} hours of ${stateReq.ethicsLabel} (${stateReq.statuteCitation}).`;
  if (stateReq.totalHoursNote) {
    stateReqAnswer += ` ${stateReq.totalHoursNote}`;
  }

  if (pkg.totalHours > stateReq.totalHours) {
    const carryClause = stateReq.carryoverHours
      ? ` The additional hours can carry forward to your next renewal cycle (up to ${stateReq.carryoverHours} hours) per ${stateReq.statuteCitation}.`
      : "";
    stateReqAnswer +=
      ` Our ${pkg.shortName} package includes ${pkg.totalHours} hours, which exceeds the state minimum.` +
      carryClause;
  } else {
    stateReqAnswer += ` Our ${pkg.shortName} package satisfies this requirement in a single bundle.`;
  }
  if (combinedFlatTotal) {
    stateReqAnswer +=
      ` In ${stateName}, this counts toward one combined ${stateReq.totalHours}-hour CE total that also covers any Life & Health license you hold — you do not complete a separate ${ceHours} hours for L&H (${stateReq.statuteCitation}).`;
  } else if (isCombinedCE) {
    stateReqAnswer +=
      ` ${stateName} counts approved CE toward a single per-producer total rather than a separate total for each line, so these hours also cover any Life & Health license you hold — holding both lines does not double what you owe (${stateReq.statuteCitation}).`;
  } else if (perCategoryCE) {
    stateReqAnswer +=
      ` That ${perCategoryCE.singleCategoryHours}-hour figure is the requirement for an agent licensed in a single category. An agent who holds licenses in two or more categories — P&C plus Life & Health, for example — completes ${perCategoryCE.multiCategoryHours} hours per biennium instead, with a minimum of ${perCategoryCE.perCategoryMinimum} credit hours in each category held (${stateReq.statuteCitation}). Holding a second line raises your total; it does not double it.`;
  } else {
    stateReqAnswer +=
      ` If you also hold a Life & Health license, check with the ${doiName} how your hours are counted before you enroll in a second full package — many states apply one CE total across every line a producer holds rather than a separate requirement per line. ${stateName}'s published Life & Health figure is ${ceHours} hours every ${ceRenewalPeriod} with ${ceEthicsHours} ethics hours.`;
  }
  if (stateReq.requiresVerification) {
    stateReqAnswer += ` Always verify current requirements with the ${doiName} before scheduling your renewal.`;
  }

  const faqs: { question: string; answer: string }[] = [
    {
      question: `How many CE hours does ${stateName} require for P&C license renewal?`,
      answer: stateReqAnswer,
    },
    {
      question: `What's the difference between L&H CE and P&C CE in ${stateName}?`,
      answer: `Life & Health (L&H) CE covers life insurance, annuities, health insurance, Medicare, and long-term care topics. Property & Casualty (P&C) CE covers personal auto, homeowners, commercial property, general liability, workers' compensation, and similar coverages. ${
        combinedFlatTotal
          ? `The subject matter differs, but ${stateName} does not run them as two separate CE accounts — a resident producer completes ${stateReq.totalHours} hours per renewal cycle regardless of how many lines they hold, and approved CE in any line of authority counts toward that one total (${stateReq.statuteCitation}). Completing L&H CE therefore DOES count toward the same total that covers your P&C requirement.`
          : isCombinedCE
            ? `The subject matter differs, but ${stateName} does not run them as two separate CE accounts — approved CE in any line of authority counts toward one per-producer total, no matter how many lines you hold (${stateReq.statuteCitation}). Completing L&H CE therefore DOES count toward the same total that covers your P&C requirement.`
            : perCategoryCE
              ? `In ${stateName} the two are not fully interchangeable, but holding both does not mean two separate ${perCategoryCE.singleCategoryHours}-hour requirements either: an agent licensed in a single category completes ${perCategoryCE.singleCategoryHours} hours per biennium, while an agent licensed in two or more categories completes ${perCategoryCE.multiCategoryHours} hours with a minimum of ${perCategoryCE.perCategoryMinimum} credit hours applying to each category held (${stateReq.statuteCitation}).`
              : `States differ in how the two interact — some count all approved CE toward one per-producer total, others set line-specific minimums or a higher total for producers who hold more than one line. Before assuming you owe a full separate CE requirement for each license, confirm your exact obligation with the ${doiName}; you may owe fewer hours than you think.`
      }`,
    },
    {
      question: `Does this package include the ${stateName} ethics requirement?`,
      answer: `Yes. The ${pkg.shortName} package includes ${pkg.ethicsHours} hours of ${pkg.ethicsLabel} — the exact ethics module required by the ${doiName} for P&C CE renewal. You do not need to enroll in a separate ethics course.`,
    },
    {
      question: `How does CE reporting work?`,
      answer: `When you complete your final module, JustInsurance typically electronically reports your CE completion to the ${doiName} the same business day. Most states post the credit to your license record within 3-5 business days. There are no certificates to mail and no additional forms to submit on your end.`,
    },
    {
      question: `What happens if I miss my CE deadline?`,
      answer: `Missing your CE deadline can result in license suspension, late fees, and reinstatement requirements. ${stateName} typically requires you to complete all overdue CE plus any reinstatement penalties before your license is reactivated. We recommend completing your CE at least 30 days before your renewal date — the entire ${pkg.shortName} package can be finished in a single sitting if needed.`,
    },
    {
      question: `I hold both an L&H license and a P&C license. Do I need two separate CE packages?`,
      answer: combinedFlatTotal
        ? `No. ${stateName} applies a single combined CE total: you complete ${stateReq.totalHours} hours per renewal cycle regardless of how many lines you hold — not ${stateReq.totalHours} hours for each license. A dual-licensed P&C + L&H producer owes ${stateReq.totalHours} hours total (including ${stateReq.ethicsHours} hours of ${stateReq.ethicsLabel}), and approved CE in any line of authority counts toward that one total (${stateReq.statuteCitation}). One ${stateReq.totalHours}-hour package that includes the ethics requirement satisfies your entire renewal — you can choose whichever P&C or L&H topics fill your hours at checkout.`
        : isCombinedCE
          ? `No. ${stateName} applies a single per-producer CE total rather than a separate requirement for each license, and approved CE in any line of authority counts toward it — so a dual-licensed P&C + L&H producer does not owe two full CE requirements (${stateReq.statuteCitation}). One package that covers your hours and includes the required ethics module satisfies your entire renewal. Your exact hour count can depend on how long you have been licensed, so confirm the number with the ${doiName} before you renew.`
          : perCategoryCE
            ? `Not two full packages, though ${stateName} does scale. An agent licensed in a single category completes ${perCategoryCE.singleCategoryHours} hours per biennium; an agent licensed in two or more categories completes ${perCategoryCE.multiCategoryHours} hours, with a minimum of ${perCategoryCE.perCategoryMinimum} credit hours applying to each category held (${stateReq.statuteCitation}). A dual-licensed P&C + L&H agent therefore owes ${perCategoryCE.multiCategoryHours} hours in total — not ${perCategoryCE.singleCategoryHours} hours for each license. Because this ${pkg.totalHours}-hour P&C package is built to the single-category requirement, a dual-licensed agent should pair it with L&H hours to meet the ${perCategoryCE.perCategoryMinimum}-hour minimum in each category; you can bundle both at checkout.`
            : `It depends on how ${stateName} scales CE. ${stateName}'s published requirement is ${stateReq.totalHours} hours per renewal cycle. Some states apply one combined total across every line you hold, while others increase the total when you hold licenses in different scopes — they do not always simply double. Confirm your exact obligation with the ${doiName} before assuming you owe the ${ceHours} hours of L&H CE for your L&H license each renewal cycle (${stateReq.statuteCitation}). JustInsurance offers both — you can bundle them at checkout.`,
    },
  ];

  // Add a 7th FAQ pulled from specialNotes when present, otherwise a generic
  // "what topics are covered" question.
  if (pkg.specialNotes.length > 0) {
    const note = pkg.specialNotes[0];
    faqs.push({
      question: `Does this package satisfy any state-specific P&C training requirements?`,
      answer: `${note} All other modules in the ${pkg.shortName} package are also state-approved by the ${doiName} for P&C CE credit.`,
    });
  } else {
    faqs.push({
      question: `What topics are covered in the P&C CE modules?`,
      answer: `The ${pkg.pcHours} hours of P&C electives cover personal lines (homeowners, personal auto, umbrella), commercial lines (commercial property, general liability, workers' compensation, commercial auto), claims handling, and risk management — all updated to reflect current ${stateName} insurance regulations and product trends.`,
    });
  }

  return faqs;
}

// ---------------------------------------------------------------------------
// Shared full-package detail renderer — used by single-package state hubs and
// by the [package]/page.tsx route. Exported so the package route can re-use it.
// ---------------------------------------------------------------------------
export function PCPackageDetail({
  stateData,
  pkg,
}: {
  stateData: NonNullable<ReturnType<typeof getStateBySlug>>;
  pkg: PCPackage;
}) {
  const { ce } = stateData;
  // Owner decision: CE cannot be PURCHASED in pending-approval states
  // (providerApprovalNumber === "PENDING"). No current P&C state is pending — NY
  // and WA carry no P&C packages, so this branch never renders today — but the
  // gate is here defensively: if a pending state ever gains a P&C package, its
  // purchase surfaces (hero enroll, refund microcopy, closing CTA) are replaced
  // with a neutral notice. For every approved P&C state this is byte-identical.
  const providerApproved = stateData.providerApprovalNumber !== "PENDING";
  // How this state counts CE across multiple lines held (see
  // CE_STRUCTURE_BY_STATE). Unconfirmed states get neutral copy — the page must
  // never assert that P&C and L&H are "tracked separately," because in most
  // states they are not, and that claim can push a dual-licensed producer into
  // buying twice the CE they owe.
  const ceStructure = CE_STRUCTURE_BY_STATE[stateData.name];
  const isCombinedCreditState = ceStructure?.kind === "combined";
  const combinedFlatTotal =
    ceStructure?.kind === "combined" && ceStructure.flatTotal;
  const perCategoryCE =
    ceStructure?.kind === "per-category-minimum" ? ceStructure : undefined;
  const providerLine = stateData.providerNumber
    ? `State-Approved ${stateData.doiName} CE Provider #${stateData.ceProviderNumber ?? stateData.providerNumber}`
    : `State-Approved ${stateData.doiName} CE Provider`;

  return (
    <>
      {/* Urgency Banner */}
      <div className="bg-gold text-gray-dark py-2 px-4 text-center text-sm font-semibold">
        Don&apos;t let your P&amp;C license lapse — complete your CE before renewal.
      </div>

      <StateHero
        eyebrow={`${stateData.name} P&C CE`}
        title={`${stateData.name} Property & Casualty CE Package`}
        subtitle={`Complete your ${pkg.totalHours}-hour P&C CE requirement online: ${pkg.ethicsHours}-hr ${pkg.ethicsLabel} + ${pkg.pcHours}-hr P&C electives. Same-day reporting to the ${stateData.doiName} in most cases. ${pkg.price}.`}
        ctaButtons={
          providerApproved
            ? [{ text: `Enroll Now — ${pkg.price}`, href: pkg.cartLink }]
            : []
        }
      />

      <CeApprovalNotice stateSlug={stateData.slug} />

      {/* Under-hero band. Approved states: refund microcopy at the point of sale.
          Pending-approval states: no purchase is possible yet, so the buyable
          hero CTA is dropped (above) and this is replaced with a neutral
          "opening soon" notice. */}
      {providerApproved ? (
        <div className="bg-navy-dark px-4 pb-6">
          <p className="max-w-4xl mx-auto text-center text-blue-200 text-xs leading-relaxed">
            <RefundDisclosure />
          </p>
        </div>
      ) : (
        <div className="bg-navy-dark px-4 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold font-semibold text-base md:text-lg">
              Opening soon — our {stateData.name} CE provider approval is pending.
            </p>
            <p className="text-blue-200 text-sm leading-relaxed mt-2 max-w-2xl mx-auto">
              We&apos;ll open {stateData.name} P&amp;C CE enrollment as soon as the{" "}
              {stateData.doiName} issues our provider approval. The requirement
              details below are accurate and kept up to date.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* Authority block — provider number */}
      <section className="bg-navy-dark border-t border-white/10 py-3 px-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <span className="inline-flex items-center gap-1.5 bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-semibold text-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {providerLine}
          </span>
        </div>
      </section>

      {/* Every JustInsurance course includes 30 days of access from enrollment. */}
      <CourseOverviewBox
        hours={pkg.totalHours}
        price={pkg.price}
        accessDuration="30 Days"
        includes={[
          `${pkg.ethicsHours}-hr ${pkg.ethicsLabel}`,
          `${pkg.pcHours}-hr P&C electives`,
          "Interactive online modules",
          "Module-end quizzes",
          "Same-day DOI reporting",
          "Instant certificate of completion",
          "Expert support",
        ]}
      />

      {/* Course breakdown table */}
      <section className="bg-white pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-bg rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-navy mb-4">Course Breakdown</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500">Ethics Hours</span>
                <span className="font-bold text-navy">
                  {pkg.ethicsHours} hrs ({pkg.ethicsLabel})
                </span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500">P&C Elective Hours</span>
                <span className="font-bold text-navy">{pkg.pcHours} hrs</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500">Total CE Hours</span>
                <span className="font-bold text-navy">{pkg.totalHours} hrs</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500">Course Format</span>
                <span className="font-bold text-navy">Online, Self-Paced</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500">Course Access</span>
                <span className="font-bold text-navy">30 Days</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-500">Reporting</span>
                <span className="font-bold text-success-dark">Same-Day to {stateData.doiAbbr || stateData.doiName}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/*
        Fix 5.2 (2026-04-29): Split the legacy "Important Notes" block into
        two distinct callouts — "What's Covered" (curriculum) and "State
        Requirements Satisfied" (compliance). Classification is a string
        heuristic on `pkg.specialNotes`: if a note contains one of the
        compliance keywords (required by, satisfies, specifically approved,
        Includes the X-hour [mandate], must also complete, delivered in
        webinar format per, Anti-Fraud, Classroom Equivalent), it goes in
        the State Requirements Satisfied bucket. Everything else is treated
        as curriculum/coverage. Kept it heuristic-only to avoid touching all
        31 package entries with a second array field.
      */}
      {pkg.specialNotes.length > 0 && (() => {
        const COMPLIANCE_PATTERNS: RegExp[] = [
          /required by/i,
          /satisfies the/i,
          /specifically approved/i,
          /must also complete/i,
          /delivered in webinar format per/i,
          /anti-fraud/i,
          /classroom equivalent/i,
          /\bIncludes the \d+-(?:Hour|hour|hr)/i, // "Includes the 1-hour ...", "Includes the 4-Hour Law & Ethics ..."
        ];
        const compliance: string[] = [];
        const curriculum: string[] = [];
        for (const note of pkg.specialNotes) {
          if (COMPLIANCE_PATTERNS.some((re) => re.test(note))) {
            compliance.push(note);
          } else {
            curriculum.push(note);
          }
        }
        return (
          <section className="bg-white pb-8 px-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {curriculum.length > 0 && (
                <div className="bg-gray-bg border-l-4 border-navy rounded-r-lg p-5">
                  <h3 className="font-bold text-navy mb-3">What&apos;s Covered</h3>
                  <ul className="space-y-2">
                    {curriculum.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed">
                        <svg className="w-4 h-4 text-navy flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {compliance.length > 0 && (
                <div className="bg-amber-50 border-l-4 border-gold rounded-r-lg p-5">
                  <h3 className="font-bold text-navy mb-3">{stateData.name} State Requirements Satisfied</h3>
                  <ul className="space-y-2">
                    {compliance.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed">
                        <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* How CE Reporting Works — 5-step */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            How {stateData.name} P&amp;C CE Reporting Works
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            From course start to active license — five simple steps.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: "1",
                title: "Complete Modules",
                desc: `Work through ${pkg.totalHours} hours of state-approved P&C content at your own pace.`,
              },
              {
                step: "2",
                title: "Pass Module Quizzes",
                desc: `Each module ends with a short quiz to confirm comprehension and unlock your CE credit.`,
              },
              {
                step: "3",
                title: "We Report to the State",
                desc: `JustInsurance typically electronically files your completion with the ${stateData.doiName} the same business day.`,
              },
              {
                step: "4",
                title: "Verify Credits Posted",
                desc: `Most states show CE credits on your license record within 3-5 business days. Confirm via your state portal.`,
              },
              {
                step: "5",
                title: "Submit Renewal via NIPR",
                desc: `Complete your renewal application through NIPR or your state portal and pay the renewal fee.`,
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-bg rounded-xl p-5 text-center">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-dark font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="font-bold text-navy mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State CE Requirements (compares L&H vs this P&C package) */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            {stateData.name} CE Requirements at a Glance
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
            {combinedFlatTotal ? (
              <>{stateData.name} counts all CE toward one combined {ce.totalHours}-hour total. Here&apos;s how this {pkg.totalHours}-hour package fits the {stateData.doiName}&apos;s requirements.</>
            ) : isCombinedCreditState ? (
              <>{stateData.name} counts approved CE in any line of authority toward one per-producer total, not a separate total per line. Here&apos;s how this {pkg.totalHours}-hour package fits the {stateData.doiName}&apos;s requirements.</>
            ) : perCategoryCE ? (
              <>{stateData.name} sets a higher biennial total for agents licensed in more than one category, with a minimum number of hours in each. Here&apos;s how this {pkg.totalHours}-hour package fits the {stateData.doiName}&apos;s requirements.</>
            ) : (
              <>Here&apos;s how this {pkg.totalHours}-hour package fits the {stateData.doiName}&apos;s published requirements.</>
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <span className="inline-block bg-gold/20 text-gold-deep text-xs font-bold uppercase px-2 py-1 rounded">P&C</span>
                This Package
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Total CE Hours</span>
                  <span className="font-bold text-navy">{pkg.totalHours} hours</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Renewal Period</span>
                  <span className="font-bold text-navy">{ce.renewalPeriod}</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Ethics Module</span>
                  <span className="font-bold text-navy">{pkg.ethicsHours} hrs ({pkg.ethicsLabel})</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500">Package Price</span>
                  <span className="font-bold text-gold">{pkg.price}</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <span className="inline-block bg-navy/10 text-navy text-xs font-bold uppercase px-2 py-1 rounded">L&H</span>
                {combinedFlatTotal
                  ? `Same ${ce.totalHours}-Hour Total`
                  : isCombinedCreditState
                    ? "Same CE Total"
                    : perCategoryCE
                      ? `${perCategoryCE.perCategoryMinimum}-Hour Category Minimum`
                      : `${stateData.name} L&H Requirement`}
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Total CE Hours</span>
                  <span className="font-bold text-navy">{ce.totalHours} hours</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Renewal Period</span>
                  <span className="font-bold text-navy">{ce.renewalPeriod}</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Ethics Required</span>
                  <span className="font-bold text-navy">{ce.ethicsHours} hours</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500">More info</span>
                  <Link href={`/${stateData.slug}/continuing-education`} className="font-semibold text-navy hover:text-gold transition-colors">
                    L&amp;H CE →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6 max-w-2xl mx-auto">
            {combinedFlatTotal ? (
              <>{stateData.name} tracks all CE as one combined total: you complete {ce.totalHours} hours (including {ce.ethicsHours} ethics) every {ce.renewalPeriod} no matter how many lines you hold — <strong>not</strong> a separate {ce.totalHours} hours for each license. Completing this {pkg.totalHours}-hour P&amp;C package satisfies your entire {stateData.name} renewal, and approved CE in any line of authority counts toward the same total ({pkg.stateRequirement.statuteCitation}).</>
            ) : isCombinedCreditState ? (
              <>{stateData.name} counts approved CE toward one per-producer total rather than a separate total for each line, so holding both a P&amp;C and a Life &amp; Health license does <strong>not</strong> double the hours you owe — the hours in this {pkg.totalHours}-hour package count toward that single total ({pkg.stateRequirement.statuteCitation}). Your exact total depends on how long you have been licensed, so confirm the number with the {stateData.doiName} before you renew.</>
            ) : perCategoryCE ? (
              <>{stateData.name} does not require a full second package for a second license, but it does scale: an agent licensed in a single category completes {perCategoryCE.singleCategoryHours} hours per biennium, while an agent licensed in two or more categories completes {perCategoryCE.multiCategoryHours} hours with a minimum of {perCategoryCE.perCategoryMinimum} credit hours in <strong>each</strong> category held ({pkg.stateRequirement.statuteCitation}). The {perCategoryCE.singleCategoryHours}-hour figure shown above is the single-category requirement — if you also hold a Life &amp; Health license, pair this package with L&amp;H hours to cover both category minimums.</>
            ) : (
              <>The Life &amp; Health figures above are {stateData.name}&apos;s published L&amp;H CE requirement. If you hold both a P&amp;C and an L&amp;H license, don&apos;t assume the two totals simply add together — states differ in how CE is counted for producers who hold more than one line, and many apply a single total across all lines. Confirm your combined obligation with the {stateData.doiName} before enrolling in two full packages.</>
            )}
          </p>
          <p className="text-center text-xs text-gray-500 mt-6">
            Source: <a href={ce.requirementsUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">{stateData.doiName}</a>
          </p>
        </div>
      </section>

      {/*
        Fix 5.1 (2026-04-29): Removed the "Related {state} Resources" cluster
        that previously lived here — it duplicated the "Explore More {state}
        Resources" tile grid emitted by <RelatedStatePages /> further down the
        page, and the two grids overlapped on most links. Keeping a single
        canonical resources module matches the rest of the site's pattern and
        also retired two broken routes (/license-renewal/ → /license-renewal-guide/,
        /non-resident-license/ → /non-resident-insurance-license/) that were
        only present here.
      */}

      {/* Closing CTA. Approved states: purchasable "Enroll Now" banner. Pending
          states: replaced with a neutral "opening soon" notice (no purchase). */}
      {providerApproved ? (
        <CTABanner
          title={`Renew Your ${stateData.name} P&C License Today`}
          subtitle={`Complete your ${pkg.totalHours}-hour P&C CE requirement online for ${pkg.price}. We typically report to the ${stateData.doiName} same-day.`}
          ctaText={`Enroll Now — ${pkg.price}`}
          ctaHref={pkg.cartLink}
          externalLink
          disclosure={<RefundDisclosure />}
        />
      ) : (
        <section className="bg-navy py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {stateData.name} P&amp;C CE — Opening Soon
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Our {stateData.name} CE provider approval is pending with the{" "}
              {stateData.doiName}. Enrollment for this {pkg.totalHours}-hour P&amp;C
              CE package will open as soon as approval is issued.
            </p>
          </div>
        </section>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function PCStateHubPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  const packages = getPCPackagesForState(state);
  if (!stateData || packages.length === 0) notFound();

  const isMulti = isPCMultiPackageState(state);
  // Multi-line CE structure for the multi-package landing copy below. Only
  // states confirmed against a primary source are listed in
  // CE_STRUCTURE_BY_STATE; everything else renders the neutral variant.
  const hubCeStructure = CE_STRUCTURE_BY_STATE[stateData.name];
  const canonicalUrl = `https://justinsuranceco.com/${state}/continuing-education/property-and-casualty`;

  // ----- Schemas (always emitted) -----
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
    {
      name: "Continuing Education",
      url: `https://justinsuranceco.com/${stateData.slug}/continuing-education`,
    },
    { name: "Property & Casualty", url: canonicalUrl },
  ]);

  // For FAQ schema: single-package states use the one package's FAQs.
  // Multi-package states use the first (Florida 20-Hour Advanced or MA 45-Hour) as a representative.
  const repPkg = packages[0];
  const faqs = buildPCFAQs(
    stateData.name,
    stateData.doiName,
    repPkg,
    stateData.ce.totalHours,
    stateData.ce.renewalPeriod,
    stateData.ce.ethicsHours
  );
  const faqSchema = generateFAQSchema(faqs);

  // Course schema — only emitted for single-package states (multi states use
  // per-package routes for Course schema instead, to avoid mixing prices).
  const courseSchema = !isMulti
    ? generateCourseSchema({
        stateName: stateData.name,
        stateSlug: stateData.slug,
        loaName: "Property & Casualty",
        loaSlug: "property-and-casualty",
        courseType: "continuing-education",
        // P&C CE pages build only for PC_STATE_SLUGS (all live-CE; WA/NY are not
        // P&C), so P&C CE is always live here.
        available: true,
        hours: repPkg.totalHours,
        price: repPkg.price,
        description: `${stateData.name} Property & Casualty continuing education package — ${repPkg.totalHours} hours total (${repPkg.ethicsHours}-hr ${repPkg.ethicsLabel} + ${repPkg.pcHours}-hr P&C electives). Online, self-paced, same-day reporting to the ${stateData.doiName} in most cases. ${repPkg.price}.`,
      })
    : null;
  // Override the offers.url so it points at the Absorb cart link, satisfying
  // the requirement to make the cart link discoverable in structured data.
  if (courseSchema) {
    // Narrow type — generateCourseSchema returns object, we mutate offers.url.
    const cs = courseSchema as { offers: { url: string } };
    cs.offers.url = repPkg.cartLink;
  }

  const articleHeadline = isMulti
    ? `${stateData.name} Property & Casualty Continuing Education Packages`
    : `${stateData.name} Property & Casualty Continuing Education Package`;
  const articleDescription = isMulti
    ? `${packages.length} state-approved P&C CE packages for ${stateData.name} producers, ranging from ${Math.min(...packages.map((p) => p.totalHours))} to ${Math.max(...packages.map((p) => p.totalHours))} hours. Reporting to the ${stateData.doiName} is typically same-day.`
    : `Complete your ${repPkg.totalHours}-hour ${stateData.name} P&C CE in one package. ${repPkg.ethicsHours}-hr ${repPkg.ethicsLabel} + ${repPkg.pcHours}-hr P&C electives. ${repPkg.price}.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-29",
    url: canonicalUrl,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}` },
    { name: "Continuing Education", href: `/${stateData.slug}/continuing-education` },
    { name: "Property & Casualty" },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      {courseSchema && <SchemaMarkup schema={courseSchema} />}
      <SchemaMarkup schema={articleSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* MULTI-PACKAGE LANDING (FL, MA) */}
      {isMulti ? (
        <>
          <StateHero
            eyebrow={`${stateData.name} P&C CE`}
            title={`${stateData.name} Property & Casualty CE Packages`}
            subtitle={`Choose the ${stateData.name} P&C CE package that matches your license type and renewal cycle. ${packages.length} state-approved options, all with same-day reporting to the ${stateData.doiName} in most cases.`}
            ctaButtons={[
              { text: "See Packages Below", href: "#packages" },
            ]}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <ArticleByline lastReviewed={stateData.lastVerified} />
          </div>

          {/* Authority block */}
          <section className="bg-navy-dark border-t border-white/10 py-3 px-4">
            <div className="max-w-4xl mx-auto flex justify-center">
              <span className="inline-flex items-center gap-1.5 bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-semibold text-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {stateData.providerNumber
                  ? `State-Approved ${stateData.doiName} CE Provider #${stateData.ceProviderNumber ?? stateData.providerNumber}`
                  : `State-Approved ${stateData.doiName} CE Provider`}
              </span>
            </div>
          </section>

          {/* Package cards */}
          <section id="packages" className="bg-white py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
                {stateData.name} P&amp;C CE Packages
              </h2>
              <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
                Pick the package that fits your license type and CE cycle. All packages typically include same-day DOI reporting.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {packages.map((p) => (
                  <Link
                    key={p.packageSlug}
                    href={`/${stateData.slug}/continuing-education/property-and-casualty/${p.packageSlug}`}
                    className="block bg-gray-bg hover:bg-white border border-gray-200 hover:border-gold rounded-xl p-6 transition-all hover:shadow-md group"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gold-deep mb-2">
                      {p.totalHours}-Hour Package
                    </p>
                    <h3 className="font-bold text-navy text-lg mb-3 group-hover:text-gold-deep transition-colors leading-snug">
                      {p.shortName}
                    </h3>
                    <ul className="space-y-1.5 text-xs text-gray-600 mb-4">
                      <li>• {p.ethicsHours}-hr {p.ethicsLabel}</li>
                      <li>• {p.pcHours}-hr P&amp;C electives</li>
                      <li>• Same-day DOI reporting</li>
                    </ul>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-2xl font-bold text-gold">{p.price}</span>
                      <span className="text-xs font-semibold text-navy group-hover:text-gold-deep transition-colors">
                        View Package →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="text-center text-xs text-gray-500 mt-6">
                <RefundDisclosure />
              </p>
            </div>
          </section>

          {/* State CE context */}
          <section className="bg-gray-bg py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-navy mb-4 text-center">
                {stateData.name} P&amp;C CE Context
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed text-center max-w-2xl mx-auto mb-6">
                {stateData.name} producers must complete CE every {stateData.ce.renewalPeriod}.{" "}
                {hubCeStructure?.kind === "combined" ? (
                  <>The {stateData.doiName} counts approved CE in any line of authority toward one per-producer total, so holding both a P&amp;C and a Life &amp; Health license does not double the hours you owe ({repPkg.stateRequirement.statuteCitation}).</>
                ) : hubCeStructure?.kind === "per-category-minimum" ? (
                  <>An agent licensed in a single category completes {hubCeStructure.singleCategoryHours} hours per biennium, while an agent licensed in two or more categories completes {hubCeStructure.multiCategoryHours} hours with a minimum of {hubCeStructure.perCategoryMinimum} credit hours in each category held ({repPkg.stateRequirement.statuteCitation}).</>
                ) : (
                  <>If you also hold a Life &amp; Health license, check with the {stateData.doiName} how your hours are counted before enrolling in two full packages — states differ in whether a multi-line producer owes one combined total or line-specific minimums.</>
                )}
              </p>
              {/*
                Fix 1.2 (2026-04-29): Florida-only clarifying paragraph.
                Multi-package FL state has packages from 20 to 28 hours, but
                the actual statute (Fla. Stat. §626.2815) requires only 20
                (24 in the first 6 years). Without this paragraph, buyers
                landing on /florida/.../property-and-casualty/ saw 26-hour and
                28-hour packages with no explanation of why those exceed the
                state minimum — leading to "did I buy too much?" support
                tickets. The 24-hour carry-forward rule is the answer.
              */}
              {stateData.slug === "florida" && (
                <div className="bg-white border border-gold/40 rounded-lg p-5 max-w-3xl mx-auto mb-6">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Florida producers in their first 6 years of licensure need 24 P&amp;C CE hours every 2 years; producers licensed 6+ years need 20. All hours include the mandatory 4-hour Law &amp; Ethics Update. Some packages above exceed the state minimum to give producers additional electives in specialty areas (commercial, homeowners + flood, personal auto). Florida allows up to 24 excess CE hours to carry forward to your next renewal cycle per Fla. Stat. §626.2815, so over-quota packages remain useful — your extra hours don&apos;t go to waste.
                  </p>
                </div>
              )}
              <div className="text-center">
                <a
                  href={stateData.ce.requirementsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-navy hover:text-gold underline transition-colors"
                >
                  View {stateData.doiName} CE Requirements →
                </a>
              </div>
            </div>
          </section>
        </>
      ) : (
        // SINGLE-PACKAGE: render full detail
        <PCPackageDetail stateData={stateData} pkg={packages[0]} />
      )}

      {/* Individual-courses catalog tile — same à-la-carte category as the
          L&H CE pages (per catalog owner, P&C individual courses share the
          one "individual" category). Shared tail covers both the multi- and
          single-package render paths. */}
      <CEIndividualCoursesTile
        stateSlug={stateData.slug}
        stateName={stateData.name}
        doiName={stateData.doiName}
        providerApproved={stateData.providerApprovalNumber !== "PENDING"}
      />

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} P&C CE FAQs`}
      />

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="ce-hub"
        variant="gray"
      />
    </>
  );
}
