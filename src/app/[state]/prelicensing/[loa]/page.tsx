import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { isPrelicensingHeld, credentialKindFromHours } from "@/lib/prelicensing-status";
import PrelicensingHeldNotice from "@/components/PrelicensingHeldNotice";
import { LOA_DEFINITIONS, type LOASlug } from "@/lib/loa";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateLOAParams } from "@/lib/generateStaticParams";
import {
  generateArticleSchemaWithReviewer,
  generateCourseSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  SchemaMarkup,
} from "@/lib/schema";
import { getPrelicensingCourseFAQs, buildFaqData } from "@/lib/faq-data";
import { hasPassGuarantee } from "@/lib/pass-guarantee";
import { hasClassroomWebinarHours, withIlWebinarFaq, IL_WEBINAR_SHORT_LINE } from "@/lib/il-webinar";
import catalogLinks from "@/lib/catalog-links.json";
import ArticleByline from "@/components/ArticleByline";
import IllinoisWebinarCallout from "@/components/IllinoisWebinarCallout";
import StateHero from "@/components/StateHero";
import CourseOverviewBox from "@/components/CourseOverviewBox";
import CourseFeatures from "@/components/CourseFeatures";
import ExamInfoSection from "@/components/ExamInfoSection";
import PassGuarantee from "@/components/PassGuarantee";
import TestimonialCards from "@/components/TestimonialCards";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner, { RefundDisclosure } from "@/components/CTABanner";
import PracticeExamCTA from "@/components/PracticeExamCTA";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import PrelicenseApprovalNotice from "@/components/PrelicenseApprovalNotice";
import RelatedStatePages from "@/components/RelatedStatePages";
import LastUpdated from "@/components/LastUpdated";
import YouTubeEmbed from "@/components/YouTubeEmbed";

// LOA-buy-page step-by-step walkthrough videos. Each video's YouTube
// description points buyers to /[state]/prelicensing/life-and-health as
// the secondary link, so embedding it here closes the loop for the small
// fraction of viewers who click that secondary CTA. Per-state map; only
// applies to the life-and-health LOA. Added FL+CA+TX 2026-06-12.
type LoaVideo = {
  videoId: string;
  title: string;
  uploadDate: string;
  duration: string;
  description: string;
};
const LOA_VIDEOS: Record<string, LoaVideo> = {
  florida: {
    videoId: "o80zGv0ksMA",
    title: "How To Get Your Florida Life + Health Insurance License (Step by Step)",
    uploadDate: "2026-06-09",
    duration: "PT5M54S",
    description:
      "Step-by-step walkthrough of the Florida 2-15 Life, Health & Annuity license process: 60-hr prelicensing, $44 Pearson VUE exam, IdentoGO fingerprinting, and NIPR application. Hosted by Justin vom Eigen, IDECC Certified Distance Education Instructor and founder of JustInsurance LLC.",
  },
  california: {
    videoId: "urRztwGUnhY",
    title: "How To Get Your California Life + Health Insurance License (Step by Step)",
    uploadDate: "2026-06-11",
    duration: "PT7M18S",
    description:
      "Step-by-step walkthrough of the California Life & Health license process: 12-hour Code & Ethics requirement (post-AB 943), $98 PSI exam, Live Scan fingerprinting, and CDI application via NIPR. Hosted by Justin vom Eigen, IDECC Certified Distance Education Instructor and founder of JustInsurance LLC.",
  },
  texas: {
    videoId: "ZgLGWFzBcGA",
    title: "How To Get Your Texas Life + Health Insurance License (Step by Step)",
    uploadDate: "2026-06-11",
    duration: "PT5M51S",
    description:
      "Step-by-step walkthrough of the Texas General Lines Life, Accident & Health license process: optional prelicensing, $39 Pearson VUE InsTX-LAH05 exam, IdentoGO fingerprinting, and TDI application via Sircon/NIPR. Hosted by Justin vom Eigen, IDECC Certified Distance Education Instructor and founder of JustInsurance LLC.",
  },
};

function buildLoaVideoSchema(v: LoaVideo) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: v.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
    uploadDate: v.uploadDate,
    duration: v.duration,
    contentUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.videoId}`,
  };
}

type CatalogLinks = typeof catalogLinks;

function getCatalogLink(stateSlug: string, loaSlug: LOASlug): string {
  const stateCatalog = (catalogLinks as CatalogLinks)[stateSlug as keyof CatalogLinks];
  if (!stateCatalog) return "https://yourinsurancelicense.myabsorb.com/";
  const section = stateCatalog["prelicensing"] as Record<string, string>;
  return section?.[loaSlug] ?? "https://yourinsurancelicense.myabsorb.com/";
}

// Map states.ts lifeAndHealth key to LOASlug
function getCoursePricing(stateSlug: string, loaSlug: LOASlug) {
  const stateData = getStateBySlug(stateSlug);
  if (!stateData) return null;
  if (loaSlug === "life") return stateData.prelicensing.life;
  if (loaSlug === "health") return stateData.prelicensing.health;
  return stateData.prelicensing.lifeAndHealth;
}

const WHAT_YOULL_LEARN: Record<LOASlug, string[]> = {
  life: [
    "Types of life insurance policies — term, whole life, universal life, and variable products",
    "Life insurance policy provisions, riders, and exclusions",
    "Annuity products — fixed, variable, and indexed annuities",
    "Beneficiary designations and settlement options",
    "Underwriting concepts and insurable interest",
    "State regulations governing life insurance producers",
    "Agent ethics and the Unfair Trade Practices Act",
    "Replacing and surrendering life insurance policies",
  ],
  health: [
    "Individual and group health insurance policy types",
    "Major medical coverage, deductibles, coinsurance, and out-of-pocket limits",
    "Medicare, Medicaid, and Medicare Supplement (Medigap) policies",
    "Disability income insurance — short-term and long-term",
    "Long-term care insurance products and options",
    "Accident and sickness policy provisions",
    "COBRA, HIPAA, and ACA compliance basics",
    "State-specific health insurance regulations and agent duties",
  ],
  "life-and-health": [
    "Life insurance fundamentals — term, whole life, universal life, and variable products",
    "Annuities — fixed, indexed, and variable types explained",
    "Health insurance plans — individual, group, and Medicare products",
    "Disability income and long-term care insurance",
    "Medicare Supplement (Medigap) products and enrollment periods",
    "Policy provisions, riders, exclusions, and beneficiary rules",
    "State insurance laws, regulations, and agent ethics",
    "Underwriting, replacement policies, and the application process",
  ],
};

export function generateStaticParams() {
  return generateStateLOAParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; loa: string }>;
}): Promise<Metadata> {
  const { state, loa } = await params;
  const stateData = getStateBySlug(state);
  const loaDef = LOA_DEFINITIONS[loa as LOASlug];
  if (!stateData || !loaDef) return {};
  const pricing = getCoursePricing(state, loa as LOASlug);
  const hoursNum = typeof pricing?.hours === "number" ? pricing.hours : undefined;
  const baseMeta = generatePageMetadata({
    pageType: "prelicensing-course",
    stateName: stateData.name,
    stateSlug: stateData.slug,
    stateAbbreviation: stateData.abbreviation,
    loaName: loaDef.name,
    loaSlug: loaDef.slug,
    hours: hoursNum,
    price: pricing?.price,
  });
  if (stateData.slug === "alabama" || stateData.slug === "alaska") {
    const title = `${stateData.name} ${loaDef.shortName} Insurance Exam Prep Course`;
    const description = `Optional ${stateData.name} ${loaDef.shortName} insurance exam preparation. Study online at your own pace with 30-day access, optional weekly instructor support, and exam-focused practice.`;
    return {
      ...baseMeta,
      title,
      description,
      openGraph: { ...baseMeta.openGraph, title: `${title} | JustInsurance`, description },
      twitter: { ...baseMeta.twitter, title: `${title} | JustInsurance`, description },
    };
  }
  return isPrelicensingHeld(stateData)
    ? {
        title: `${stateData.name} ${loaDef.name} Prelicensing — Enrollment Opening Soon | JustInsurance`,
        description: `Our ${stateData.name} ${loaDef.name} prelicensing course is completing state approval and will open for enrollment soon.`,
        robots: { index: false, follow: true },
      }
    : baseMeta;
}

export default async function PrelicensingCoursePage({
  params,
}: {
  params: Promise<{ state: string; loa: string }>;
}) {
  const { state, loa } = await params;
  const stateData = getStateBySlug(state);
  const loaDef = LOA_DEFINITIONS[loa as LOASlug];

  if (!stateData || !loaDef) notFound();

  const pricing = getCoursePricing(state, loa as LOASlug);
  if (!pricing) notFound();

  // Approval pending in a prelicensing-mandate state -> hold the course page.
  if (isPrelicensingHeld(stateData)) {
    return (
      <PrelicensingHeldNotice
        stateName={stateData.name}
        stateSlug={stateData.slug}
        loaName={loaDef.name}
        providerApprovalNumber={stateData.providerApprovalNumber}
      />
    );
  }

  const enrollLink = getCatalogLink(stateData.slug, loaDef.slug);
  const hoursIsNumber = typeof pricing.hours === "number";
  const pricingHoursNum = hoursIsNumber ? (pricing.hours as number) : undefined;

  // 50 Ill. Adm. Code Part 3119 — Illinois requires 7.5 of the 20
  // prelicensing hours per line via live classroom/webinar with verified
  // attendance. Gates the callout, hybrid hero/schema format copy, the
  // Course Overview format cell, and the appended format FAQ (flows into
  // FAQPage JSON-LD). Every other state renders byte-identically.
  const ilWebinar = hasClassroomWebinarHours(stateData);
  // California: AB 943 (eff. 1/1/2026, amending Cal. Ins. Code § 1749) repealed
  // line-specific product prelicensing hours. The only mandatory prelicensing is
  // a single 12-hour Code & Ethics course; line content is exam prep, not a
  // state-required line-specific curriculum. Gated so no other state changes.
  const isCalifornia = stateData.slug === "california";
  // Alabama eliminated mandatory prelicensing effective January 1, 2024 and
  // no longer approves or authorizes prelicensing courses. Keep the established
  // route for discoverability, but present the product itself as optional exam
  // preparation everywhere a buyer sees or a crawler reads the offer.
  const isAlabama = stateData.slug === "alabama";
  // Alaska does not require prelicensing education before its licensing exams.
  // Its live products are optional exam preparation with optional weekly live
  // support, so the same buyer-facing guard applies without Alabama's separate
  // statement about course approval authority.
  const isAlaska = stateData.slug === "alaska";
  const isOptionalExamPrep = isAlabama || isAlaska;
  // States that impose monitored seat time / a required course duration (CA's
  // 12-hr timed C&E; MN's seat-time control) are NOT accurately "self-paced" —
  // the length is fixed. Gate the "online, self-paced / at your own pace" claims.
  const isMinnesota = stateData.slug === "minnesota";
  const monitoredHours = isCalifornia || isMinnesota;
  // Illinois live-webinar hours are charged PER LINE (7.5 live / 12.5 self of
  // each 20-hour line), so the combined 40-hour Life & Health course is
  // 15 live + 25 self — compute from the line count, never hardcode 7.5/12.5.
  const ilLineCount = hoursIsNumber
    ? Math.max(1, Math.round((pricingHoursNum as number) / 20))
    : 1;
  const ilLiveHours = ilWebinar
    ? (stateData.classroomWebinarHours as number) * ilLineCount
    : 0;
  const ilSelfHours =
    ilWebinar && hoursIsNumber ? (pricingHoursNum as number) - ilLiveHours : 0;

  const baseFaqs = withIlWebinarFaq(
    getPrelicensingCourseFAQs(
      buildFaqData(stateData),
      loaDef.name,
      pricing.hours,
      pricing.price.replace("$", "")
    ),
    stateData
  );
  // Some states charge MORE for the combined Life & Health exam than the
  // single-line Life or Health exam that states.ts stores as examInfo.examFee.
  // Apply the true combined fee on the L&H page only; every other state/LOA is
  // byte-identical. Used below for the exam-fee box AND the retake FAQ.
  //   • Utah — fid-227 (verified 2026-07-21 vs the XCEL Utah license-
  //     requirements page and the Prometric Utah Insurance Exam FAQ): combined
  //     Prometric L&H exam costs $44, more than the $32 single-line exam.
  //   • Wyoming — fid-238 (verified 2026-07-21 vs the Pearson VUE Wyoming
  //     Insurance Licensing Candidate Handbook, Stock #125100, "Available
  //     Examinations and Fees"): combined exam #05 "Life and Accident and
  //     Health or Sickness" (150 q, 2.5 hr) costs $113, more than the $96
  //     single-line Life #01 / Health #02 exam.
  //   • Nebraska — fid-199 (verified 2026-07-21 vs the PSI / Nebraska DOI
  //     Insurance Licensing Examination Candidate Information Bulletin fees
  //     table): the combined "Life, Accident and Health or Sickness" exam (PSI
  //     series 13-03, 150 items) costs $47, more than the $43 single-line Life
  //     (13-01) or Accident & Health (13-02) exam.
  //   • South Dakota — fid-221 (verified 2026-07-21 vs the XCEL South Dakota
  //     license-requirements page, "Exam fee - $85 for Single line and $95 for
  //     combined lines," and the Pearson VUE South Dakota candidate portal):
  //     combined-line L&H exam costs $95, more than the $85 single-line exam.
  //   • Washington — fid-231 (RE-VERIFIED 2026-07-22 against the PSI Washington
  //     OIC Candidate Information Bulletin PDF itself,
  //     https://test-takers.psiexams.com/waoic, "Last Revised 3/6/2026" with
  //     content outlines effective 4/1/2026, fee table: Life Producer /
  //     Disability Producer / Property / Casualty / Personal Lines / Credit /
  //     Adjuster / Crop Adjuster / Surety / Surplus Lines Broker = $38 each;
  //     "Life and Disability Producer Combo" (150 q, 195 min) = $55; "Property
  //     and Casualty Producer Combo" (150 q, 195 min) = $55): the combined Life
  //     & Disability exam is $55, more than the $38 single-line Life /
  //     Disability exam. This was a real PSI increase — the prior $52 combined /
  //     $35 single-line figures are GONE from the bulletin and appear nowhere in
  //     it. Do NOT "correct" this back from a web-search snippet: StateRequirement,
  //     XCEL, Aceable and this site's own indexed pages still echo $35/$52, so
  //     citing them is circular. Only the bulletin PDF governs.
  //     🚨 $55/$55 COLLISION — DO NOT DEDUPLICATE: Washington has TWO distinct,
  //     independently-payable $55 charges with different payees — this PSI EXAM
  //     fee (per attempt) and the WA OIC resident-producer APPLICATION fee paid
  //     via NIPR (states.ts applicationFee: "55", separately verified, once).
  //     A combined-route candidate pays BOTH. They are not the same fee, must
  //     never be merged/cross-referenced, and a blind find/replace on "$55"
  //     would corrupt the application fee.
  //   • Nevada — fid-201 (verified 2026-07-21 vs the Pearson VUE Nevada
  //     Insurance Licensing Candidate Handbook, Stock #122900, Oct 2024 —
  //     "EXAM FEES": "Single Line Exams is $37 and Combo Exams (Life/Health
  //     or Property/Casualty) is $47," corroborated by the "Available
  //     Examinations and Fees" table (exam InsNV_LAH05 "Life/Health Combo,"
  //     3 hr 35 min, $47): the combined exam costs $47, more than the $37
  //     single-line Life (InsNV_Life01) / Health (InsNV_Health02) exam.
  //   • Maine — fid-188 (verified 2026-07-21 vs the current Pearson VUE Maine
  //     Insurance Licensing Candidate Handbook, rev02/2026 [pub #122000],
  //     "AVAILABLE EXAMS AND FEES" table): combined exam 12-ME-01 "Life,
  //     Accident & Health Producer" (3 hr 30 min) costs $80, more than the
  //     $55 single-line Life (12-ME-41) or Accident & Health (12-ME-42) exam.
  //   • New Hampshire — fid-203 (verified 2026-07-21 vs the PSI New Hampshire
  //     Insurance Candidate Information Bulletin fee table: Life 12-61 = $59,
  //     Accident and Health 12-62 = $59, combined "Life, Accident and Health"
  //     12-63 = $72; corroborated by the NHID "Announces New Licensing Exam
  //     Vendor" notice — "$59 for single-line exams ... and $72 for combination
  //     exams"): the combined exam costs $72, more than the $59 single-line
  //     Life or Accident & Health exam.
  //   • Texas — fid-225 (verified 2026-07-21 vs the National Online Insurance
  //     School Texas exam-scheduling guide and the XCEL Texas license-
  //     requirements page): the combined General Lines – Life, Accident &
  //     Health exam costs $49, more than the $39 single-line Life exam that
  //     states.ts stores as examInfo.examFee.
  //   • Oregon — fid-214 (verified 2026-07-21 vs the PSI State of Oregon
  //     Insurance Candidate Information Bulletin fee table hosted on the Oregon
  //     DFR site, dfr.oregon.gov): combined exam 12-03 "Life and Health
  //     (Includes Law)" costs $55, more than the $45 single-line Life (12-01)
  //     or Health (12-02) exam.
  //   • Pennsylvania — fid-216 (verified 2026-07-21 against the PSI
  //     "Pennsylvania Insurance Department Licensing Examination Candidate
  //     Information Booklet," effective 1/22/2026, Fees table: Life Insurance
  //     16-01 $45.00, Accident and Health 16-02 $45.00, Life, Accident and
  //     Health 16-03 $55.00): the combined exam costs $55, more than the $45
  //     single-line Life or Accident & Health exam. NOTE: the audit proposed
  //     $53 (and states.ts still stores the stale single-line $43); the current
  //     PSI booklet supersedes both — single-line is $45, combined is $55.
  //   • Alabama — combined Producer L&H exam costs $75 (verified 2026-07-21
  //     against the official University of Alabama Insurance Testing fee
  //     schedule, training.ua.edu/insurance-testing: "Individual Producer exams
  //     are $50, Combined Producer exams are $75"): the combined exam is $75,
  //     above the $50 single-line Life-only / Health-only exam. states.ts
  //     stores the range "50-$75"; the L&H page pins the true combined $75.
  //   • Arizona — combined exam PSI series 13-33 costs $59 (verified 2026-07-21
  //     against the PSI Arizona (DIFI) Insurance Licensing Candidate Information
  //     Bulletin #12137, "Types of Licenses with Fees": Life 13-31 $50, Accident
  //     & Health 13-32 $50, Life/Accident & Health 13-33 $59): the combined exam
  //     is $59, above the $50 single-line exam. The Exam Details box renders this
  //     combined $59 clearly labeled against the $50 single-line exam, and the
  //     retake FAQ (which otherwise inherited $50) is rewritten to match — both
  //     via combinedExamFeeLabeled below. A secondary source claiming $49 is
  //     WRONG per the primary PSI handbook.
  //   • Connecticut — combined exam 12-CT-03 costs $105 (verified 2026-07-21
  //     against the Pearson VUE Connecticut Insurance Candidate Handbook, pub
  //     #120700, Mar 2026, "Available Exams and Fees": Life 12-CT-01 $65,
  //     Accident & Health 12-CT-02 $65, Life/Accident & Health 12-CT-03 $105):
  //     the combined exam is $105, above the $65 single-line exam.
  //   • Louisiana — combined exam PSI series 103 costs $58 (verified 2026-07-21
  //     against the PSI Louisiana DOI Licensing Examinations Candidate
  //     Information Bulletin, upd. 1/1/2025, fee table: Life 101 $36, Health &
  //     Accident 102 $36, Life/Health & Accident 103 $58): the combined exam is
  //     $58, above the $36 single-line exam.
  //   • Massachusetts — ARM REMOVED 2026-07-22. It stored $49, which came from
  //     the retired Prometric-era MA Division of Insurance Candidate Licensing
  //     Handbook ($39 single line / $49 two lines combined). MA moved to Pearson
  //     VUE effective 2026-07-22 (handbook #122300, rev 06/2026): the single-line
  //     Life / Accident & Health fee is $37 (states.ts, correct and current), and
  //     $49 appears NOWHERE in that handbook — it lists no combined Life &
  //     Accident & Health producer exam at all. The prior "left at $49 pending a
  //     primary-source combined fee" note is now resolved AGAINST $49: we could
  //     not source it, so the page must stop asserting it. Removing the arm makes
  //     the Exam Fee box and the retake FAQ fall back to the single-line $37 that
  //     every other Massachusetts page already prints — no new number is invented
  //     and there is no cross-page contradiction.
  //     ⚠️ HELD for the states.ts owner: massachusetts is still noCombinedExam:
  //     false. If a primary source confirms Pearson VUE offers no combined MA
  //     exam, flipping that flag to true is the whole fix — this page then
  //     automatically renders "$74 (two exams)" plus the "No Combined Life &
  //     Health Exam" note with NO further edit here. Do not hand-write $74.
  //   • Kansas — combined major-lines exam 12-KS-05 costs $64 (verified
  //     2026-07-22 against the Pearson VUE Kansas Insurance Licensing Candidate
  //     Handbook, rev 07/2026, #121700: Life 12-KS-01 $57, Accident & Health
  //     12-KS-02 $57, Life & Accident/Health 12-KS-05 $64; handbook body: "The
  //     exam fee, $64 for combination major lines and $57 for single line or
  //     limited line examinations"): the combined exam is $64, above the $57
  //     single-line exam. states.ts single-line corrected $67 → $57.
  //   • Missouri — combined exam code 54 costs $40 (verified 2026-07-21 against
  //     the Pearson VUE Missouri Insurance Licensing Candidate Handbook, pub
  //     #122600, Mar 2026, p.5 "Available Examinations and Fees": Life 50 $32,
  //     Accident & Health 51 $32, Life/Accident & Health 54 $40): the combined
  //     exam is $40, above the single-line exam. states.ts stores the range
  //     "29-$35"; the L&H page pins the true combined $40.
  //   • Tennessee — combined exam "Life and Accident & Health" costs $80
  //     (verified 2026-07-22 against the current Pearson VUE Tennessee Insurance
  //     Licensing Candidate Handbook, July 2025, available-exams-and-fees table):
  //     the combined exam is $80, above the $55 single-line Life or Accident &
  //     Health exam. The $55 single-line fee in states.ts is CORRECT and current —
  //     Tennessee's defect was never the number, it was the structural flag.
  //     ⚠️ HELD for the states.ts owner: tennessee is still noCombinedExam: true,
  //     which the July 2025 Pearson VUE handbook contradicts. Until that flag is
  //     flipped to false this arm stays dormant BY DESIGN (see the
  //     !stateData.noCombinedExam gate below) so the page can never say "$110 (two
  //     exams)" in the Exam Details box and "$80 combined" in the retake FAQ at
  //     the same time. Flipping the flag activates this arm and simultaneously
  //     fixes the Tennessee overview / requirements / practice-exam pages.
  //   • Vermont — combined exam costs $67.60 (verified 2026-07-22 against the
  //     Prometric Vermont insurance candidate information bulletin, "Effective as
  //     of March 18, 2026," vs. the $52 single-line exam; the 2020-08-15 and
  //     2021-07-20 revisions of the same bulletin both read $50 single / $65
  //     combined, so this is a real Prometric increase, not a misread).
  //     Note the cents: $67.60 is not a round dollar amount. Both the Exam Details
  //     label and the retake FAQ interpolate this string verbatim and never parse
  //     it as a number, so it renders correctly; the 2 * Number(examFee) doubling
  //     path is the noCombinedExam branch, which Vermont does not take.
  //     ⚠️ DISCLOSED AMBIGUITY: the current bulletin ships TWO CONFLICTING
  //     registration forms. $52 / $67.60 is judged operative because it is the
  //     only form whose figures were UPDATED in the 3/18/2026 revision, while the
  //     competing $73 / $87 page is byte-for-byte unchanged since the Aug-2020
  //     edition. Recorded here so a future auditor who finds $73/$87 in the same
  //     PDF does not "correct" this back without re-reading both forms.
  //   • New York and Ohio — deliberately NO arm. Both DO sell a combined Life &
  //     Health exam, but at exactly the single-line price (NY $40 for all 28 PSI
  //     exams incl. the 17-55 combined; OH one flat $49 for every insurance exam),
  //     so the no-override fallback already prints the right number once states.ts
  //     carries 40 / 49. Adding an arm would emit the contrast label "$40
  //     (combined Life & Health exam; single-line Life or Health exam is $40)",
  //     which is redundant and reads as a defect. The contrast label exists only to
  //     defuse a real numeric mismatch against a state's other pages; NY and OH
  //     have none. Verified against the fallback, not assumed.
  // GATE: an override is only meaningful in a state that actually SELLS a combined
  // Life & Health exam. Requiring !noCombinedExam keeps the Exam Details box (which
  // branches on noCombinedExam FIRST, before ever reading the override) and the
  // retake FAQ (which does not) from disagreeing. Verified 2026-07-22 to be a
  // no-op for every current override state — none carries noCombinedExam: true.
  const combinedExamFeeOverride =
    loaDef.slug === "life-and-health" && !stateData.noCombinedExam
      ? stateData.slug === "utah"
        ? "$44"
        : stateData.slug === "wyoming"
        ? "$113"
        : stateData.slug === "nebraska"
        ? "$47"
        : stateData.slug === "south-dakota"
        ? "$95"
        : stateData.slug === "washington"
        ? "$55"
        : stateData.slug === "nevada"
        ? "$47"
        : stateData.slug === "maine"
        ? "$80"
        : stateData.slug === "new-hampshire"
        ? "$72"
        : stateData.slug === "texas"
        ? "$49"
        : stateData.slug === "oregon"
        ? "$55"
        : stateData.slug === "pennsylvania"
        ? "$55"
        : stateData.slug === "alabama"
        ? "$75"
        : stateData.slug === "arizona"
        ? "$59"
        : stateData.slug === "connecticut"
        ? "$105"
        : stateData.slug === "louisiana"
        ? "$58"
        : stateData.slug === "missouri"
        ? "$40"
        : stateData.slug === "kansas"
        ? "$64"
        : stateData.slug === "tennessee"
        ? "$80"
        : stateData.slug === "vermont"
        ? "$67.60"
        : null
      : null;
  // ── Presentation fix (labeling only — NO fee VALUE is changed) ─────────────
  // Where combinedExamFeeOverride applies, the combined Life & Health exam fee
  // is higher than the single-line examFee that this state's overview /
  // requirements / cost / single-line pages all show. Rendering the higher
  // number under a bare "Exam Fee" label (and repeating it in the retake FAQ)
  // reads as an internal contradiction — auditors repeatedly flagged it. So
  // label it explicitly as the COMBINED Life & Health exam fee and, where the
  // single-line fee is a clean figure, note that single-line fee for contrast.
  // The only state whose states.ts examFee is a range is Alabama ("50-$75"),
  // for which a "single-line is $X" clause would not read cleanly, so it is
  // labeled without the contrast clause. singleLineExamFee is the SAME value the
  // rest of the site prints, so no new number is introduced anywhere.
  const singleLineExamFee = `$${stateData.examInfo.examFee}`;
  const singleLineFeeIsRange = stateData.examInfo.examFee.includes("-");
  const combinedExamFeeLabeled = combinedExamFeeOverride
    ? singleLineFeeIsRange
      ? `${combinedExamFeeOverride} (combined Life & Health exam)`
      : `${combinedExamFeeOverride} (combined Life & Health exam; single-line Life or Health exam is ${singleLineExamFee})`
    : null;

  // On these combined pages the retake FAQ inherits the flat single-line fee
  // from buildFaqData ("...paying the $55 exam fee again to Pearson VUE."):
  // relabel just that one sentence to the combined fee and apply the same
  // single-line contrast as the Exam Details box. Value is never changed.
  const retakeSearch = `the ${singleLineExamFee} exam fee again to ${stateData.examInfo.examProvider}.`;
  const retakeReplace = singleLineFeeIsRange
    ? `the ${combinedExamFeeOverride} combined Life & Health exam fee again to ${stateData.examInfo.examProvider}.`
    : `the ${combinedExamFeeOverride} combined Life & Health exam fee again to ${stateData.examInfo.examProvider} (the single-line Life or Health exam is ${singleLineExamFee}).`;
  const faqs = combinedExamFeeOverride
    ? baseFaqs.map((f) =>
        f.answer.includes("exam fee again to")
          ? { ...f, answer: f.answer.replace(retakeSearch, retakeReplace) }
          : f
      )
    : baseFaqs;
  const learnBullets = WHAT_YOULL_LEARN[loaDef.slug];

  // Ohio Admin. Code 3901-5-07(H)(16): no pass-guarantee offers on Ohio
  // pages — hero copy, JSON-LD descriptions, "What's Included" list, and
  // the closing CTA all swap the guarantee clause for excluded states.
  const guaranteeOk = hasPassGuarantee(stateData.slug);
  const isProviderApproved = stateData.providerApprovalNumber !== "PENDING";
  const guaranteeSentence = guaranteeOk
    ? "Pass guarantee included."
    : "Instant course access.";

  const courseSchema = generateCourseSchema({
    stateName: stateData.name,
    stateSlug: stateData.slug,
    loaName: loaDef.name,
    loaSlug: loaDef.slug,
    courseType: "prelicensing",
    // Prelicensing course pages are only reached when NOT held (held short-
    // circuits to the notice earlier), so this is true here; passing the real
    // signal keeps the InStock-offer gate correct if that ever changes.
    available: !isPrelicensingHeld(stateData),
    hours: pricingHoursNum,
    price: pricing.price,
    // 50 Ill. Adm. Code 3119 — Illinois Course schema descriptions use the
    // hybrid format instead of unqualified "online, self-paced".
    description: isOptionalExamPrep
      ? `Optional ${stateData.name} ${loaDef.shortName} insurance exam-prep course — online and self-paced, with optional weekly live instructor support and ${stateData.courseAccessDays} days of access. ${isAlabama ? "Alabama does not require or approve prelicensing courses." : "Alaska does not require prelicensing education before its licensing exams."} ${guaranteeSentence} ${pricing.price}.`
      : ilWebinar
      ? `${stateData.name} ${loaDef.name} prelicensing course — ${pricing.hours} hours per line (7.5 live webinar + 12.5 self-paced), state-approved. ${guaranteeSentence} ${pricing.price}.`
      : hoursIsNumber
      ? `${stateData.name} ${loaDef.name} prelicensing course — ${pricing.hours} hours, ${isProviderApproved ? "state-approved, " : ""}online, ${monitoredHours ? "on your own schedule" : "self-paced"}. ${guaranteeSentence} ${pricing.price}.`
      : `${stateData.name} ${loaDef.name} prelicensing course — online, ${monitoredHours ? "on your own schedule" : "self-paced"}. ${guaranteeSentence} ${pricing.price}.`,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
    { name: isOptionalExamPrep ? "Exam Prep" : "Prelicensing", url: `https://justinsuranceco.com/${stateData.slug}/prelicensing` },
    { name: loaDef.shortName, url: `https://justinsuranceco.com/${stateData.slug}/prelicensing/${loaDef.slug}` },
  ]);
  const faqSchema = generateFAQSchema(faqs);
  // Product schema intentionally removed 2026-06-08: it was duplicating the
  // Course schema's entity, which Google was demoting to low-quality "product
  // snippets" (355 imp / pos 42.86 / 0.28% CTR in May 10 → June 6 GSC).
  // Course is the correct primary type for prelicensing pages; offers/pricing
  // already live inside the Course schema's hasCourseInstance.offers block.

  const articleHeadline = isOptionalExamPrep
    ? `${stateData.name} ${loaDef.shortName} Insurance Exam Prep Course`
    : `${stateData.name} ${loaDef.name} Prelicensing Course`;
  // 50 Ill. Adm. Code 3119 — Illinois hero subtitle / Article description
  // swaps the unqualified self-paced claim for the approved short line.
  const articleDescription = isOptionalExamPrep
    ? `Optional ${stateData.name} ${loaDef.shortName} insurance exam preparation with online, self-paced study, optional weekly live instructor support, and ${stateData.courseAccessDays} days of access. ${stateData.name} does not require this course before the licensing exam. ${guaranteeSentence} Only ${pricing.price}.`
    : ilWebinar
    ? `${pricing.hours}-hour state-approved course. ${IL_WEBINAR_SHORT_LINE} Then pass the ${stateData.name} licensing exam. ${guaranteeSentence} Only ${pricing.price}.`
    : hoursIsNumber
    ? `${pricing.hours}-hour ${isProviderApproved ? "state-approved " : ""}course. ${monitoredHours ? "Study online on your own schedule" : "Study online at your own pace"}, then pass the ${stateData.name} licensing exam. ${guaranteeSentence} Only ${pricing.price}.`
    : `Complete our ${loaDef.name} prelicensing course online at your own pace, then pass the ${stateData.name} licensing exam. ${guaranteeSentence} Only ${pricing.price}.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${stateData.slug}/prelicensing/${loaDef.slug}`,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}` },
    { name: isOptionalExamPrep ? "Exam Prep" : "Prelicensing", href: `/${stateData.slug}/prelicensing` },
    { name: loaDef.shortName },
  ];

  return (
    <>
      <SchemaMarkup schema={courseSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />
      {loaDef.slug === "life-and-health" && LOA_VIDEOS[stateData.slug] && (
        <SchemaMarkup schema={buildLoaVideoSchema(LOA_VIDEOS[stateData.slug])} />
      )}

      <BreadcrumbNav crumbs={crumbs} />

      <PrelicenseApprovalNotice stateSlug={stateData.slug} loaSlug={loaDef.slug} stateName={stateData.name} />

      <StateHero
        eyebrow={`${stateData.name} ${loaDef.shortName} ${isOptionalExamPrep ? "Exam Prep" : "Prelicensing"}`}
        title={`${stateData.name} ${isOptionalExamPrep ? `${loaDef.shortName} Insurance Exam Prep Course` : `${loaDef.name} Prelicensing Course`}`}
        subtitle={articleDescription}
        ctaButtons={[
          { text: `Enroll Now — ${pricing.price}`, href: enrollLink },
        ]}
      />

      {/* Item #6 — refund policy microcopy under the hero Enroll CTA */}
      <div className="bg-navy-dark px-4 pb-6">
        <p className="max-w-4xl mx-auto text-center text-blue-200 text-xs leading-relaxed">
          <RefundDisclosure />
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* 50 Ill. Adm. Code 3119 — Illinois-only live-webinar format callout,
          top of main content before the Course Overview box. */}
      {ilWebinar && <IllinoisWebinarCallout />}

      {/* Illinois treats Life and Accident & Health as SEPARATE lines of
          authority (215 ILCS 5/500-30(b)); Part 3119 certifies prelicensing
          courses per line against separate content exhibits (Ex. E Life, Ex. F
          A&H). So the "Life & Health" package is two individually IDOI-certified
          20-hour courses + two separate Pearson VUE exams — never one combined
          course/exam. IL L&H only. */}
      {ilWebinar && loaDef.slug === "life-and-health" && (
        <section className="bg-white py-10 px-4">
          <div className="max-w-4xl mx-auto bg-gray-bg border-l-4 border-gold rounded-r-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">
              How the Illinois Life &amp; Health package works
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              In Illinois, &ldquo;Life &amp; Health&rdquo; is not one combined
              course. State law treats Life and Accident &amp; Health as separate
              lines of authority (215 ILCS 5/500-25), so this package includes{" "}
              <strong>two individually state-approved prelicensing courses</strong>{" "}
              — a 20-hour Life course and a 20-hour Accident &amp; Health course
              (40 hours total), each with at least 7.5 hours of live classroom or
              webinar instruction. Each course is individually approved by the
              Illinois Department of Insurance.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your state exams are separate too: you&apos;ll sit a Life exam and a
              separate Accident &amp; Health exam through Pearson VUE, each with its
              own General and State portion — <strong>four exams in total</strong>{" "}
              for the Life &amp; Health license. We bundle both approved courses at
              one price so you&apos;re prepared for all four.
            </p>
          </div>
        </section>
      )}

      {/* Minnesota approves prelicensing per line of authority — the MN Dept.
          of Commerce course-approval application is filed one line at a time
          ("CHOOSE ONE LINE OF AUTHORITY") and requires 20 hours per line (Minn.
          Stat. § 45.37). So MN "Life & Health" is two separately approved
          courses, NOT one combined course. Unlike Illinois, though, MN DOES
          offer a combined Life, Accident & Health EXAM (135 items via PSI), so
          the exam side is a choice — verified 2026-07-14 vs. the PSI MN
          candidate bulletin. MN L&H only. */}
      {isMinnesota && loaDef.slug === "life-and-health" && (
        <section className="bg-white py-10 px-4">
          <div className="max-w-4xl mx-auto bg-gray-bg border-l-4 border-gold rounded-r-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">
              How the Minnesota Life &amp; Health package works
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              In Minnesota, &ldquo;Life &amp; Health&rdquo; is not one combined
              course. The Department of Commerce approves prelicensing education{" "}
              <strong>per line of authority</strong> — 20 hours per line — so
              this package includes{" "}
              <strong>two separately state-approved courses</strong>: a 20-hour
              Life course and a 20-hour Accident &amp; Health course (40 hours
              total). We bundle both approved courses at one price.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your exam, however, can go either way: after finishing both
              courses you may sit Minnesota&apos;s{" "}
              <strong>combined Life, Accident &amp; Health exam</strong> (a
              single 135-item exam) <em>or</em> take the separate Life and
              Accident &amp; Health exams — all administered by PSI. So the{" "}
              <strong>courses are separate, but the exam can be combined</strong>{" "}
              — the opposite of states like Illinois, which split both.
            </p>
          </div>
        </section>
      )}

      {/* Step-by-step walkthrough video for life-and-health buyers in
          states that have one (FL/CA/TX as of 2026-06-12 — see LOA_VIDEOS
          above). The video's YouTube description points buyers to this URL
          as the secondary CTA. Placed under byline + before CourseOverviewBox
          so the buyer sees the same step-by-step they just watched. */}
      {loaDef.slug === "life-and-health" && LOA_VIDEOS[stateData.slug] && (
        <YouTubeEmbed
          videoId={LOA_VIDEOS[stateData.slug].videoId}
          title={LOA_VIDEOS[stateData.slug].title}
        />
      )}

      {hoursIsNumber ? (
        <CourseOverviewBox
          hours={pricingHoursNum as number}
          price={pricing.price}
          stateSlug={stateData.slug}
          // 50 Ill. Adm. Code 3119 — Illinois overrides the default
          // "Online, Self-Paced" format cell and lists the live webinar
          // sessions in What's Included. Conditional spread so every other
          // state hits the component defaults byte-identically.
          {...(ilWebinar
            ? {
                format: `${ilLiveHours}h Live Webinar + ${ilSelfHours}h Self-Paced`,
                includes: [
                  "7.5 live webinar hours per line — attendance verified",
                  "Video lessons",
                  "Interactive e-book",
                  "Practice exams",
                  "Flashcard review sets",
                  "Progress tracking",
                  "Expert support",
                  "Certificate of completion",
                  "Pass guarantee",
                ],
              }
            : {})}
        />
      ) : (
        // When no mandatory hours, omit the Credit Hours stat to avoid showing "0"
        <section className="bg-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-8">
              Course Overview
            </h2>
            <div className="bg-gray-bg rounded-2xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="p-5 text-center">
                  <p className="text-3xl font-bold text-gold">{pricing.price}</p>
                  <p className="text-gray-500 text-sm mt-1">Course Price</p>
                </div>
                <div className="p-5 text-center">
                  <p className="text-base font-bold text-navy">Online, Self-Paced</p>
                  <p className="text-gray-500 text-sm mt-1">Course Format</p>
                </div>
                <div className="p-5 text-center">
                  <p className="text-base font-bold text-navy">{stateData.courseAccessDays} Days</p>
                  <p className="text-gray-500 text-sm mt-1">Access Duration</p>
                </div>
              </div>
              <div className="border-t border-gray-200 p-6">
                <h3 className="font-semibold text-navy mb-4">What&apos;s Included</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(isOptionalExamPrep
                    ? [
                        "Video explanations",
                        "Condensed review summaries",
                        "AI-powered study tools",
                        "5 exam-style practice exams",
                        "Progress tracking",
                        "Expert support",
                        "Course completion record",
                        "Optional weekly live instructor sessions",
                        guaranteeOk ? "Pass guarantee" : "Instant course access",
                      ]
                    : [
                        "Video lessons",
                        "Interactive e-book",
                        "Practice exams",
                        "Flashcard review sets",
                        "Progress tracking",
                        "Expert support",
                        "Certificate of completion",
                        guaranteeOk ? "Pass guarantee" : "Instant course access",
                      ]).map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                      <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What You'll Learn */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            What You&apos;ll Learn
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            {isOptionalExamPrep
              ? `This optional exam-prep course reviews key topics from the published ${stateData.name} ${loaDef.name} licensing exam content outline.`
              : ilWebinar && loaDef.slug === "life-and-health"
              ? `These two courses cover everything tested on the two Illinois exams — Life and Accident & Health — required for a Life & Health license.`
              : isCalifornia
              ? `This course delivers California's required 12-hour Code & Ethics prelicensing content, plus focused exam preparation for the ${stateData.name} ${loaDef.name} licensing exam.`
              : loaDef.slug === "life-and-health" && stateData.noCombinedExam
              ? `This course covers everything tested on the ${stateData.name} Life and Health licensing exams — a separate state exam for each line of authority.`
              : `This course covers everything tested on the ${stateData.name} ${loaDef.name} licensing exam.`}
          </p>
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {learnBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-success-dark flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CourseFeatures examPrepOnly={isOptionalExamPrep} />

      <ExamInfoSection
        stateName={stateData.name}
        examInfo={stateData.examInfo}
        examProvider={stateData.examInfo.examProvider}
        examProviderUrl={stateData.examInfo.examProviderUrl}
        examBookingUrl={stateData.examInfo.examBookingUrl}
        noCombinedExam={stateData.noCombinedExam}
        applicationBeforeExam={stateData.applicationBeforeExam}
        prelicensingRequired={
          credentialKindFromHours([
            stateData.prelicensing.life.hours,
            stateData.prelicensing.health.hours,
            stateData.prelicensing.lifeAndHealth.hours,
          ]) === "prelicensing"
        }
        stateSlug={stateData.slug}
        loaSlug={loaDef.slug}
        examFeeDisplay={
          loaDef.slug === "life-and-health" && stateData.noCombinedExam
            ? // Colorado: no combined L&H exam, but that does NOT mean two
              // fees. Pearson VUE Colorado Candidate Handbook #120600 (Exam
              // Fees, eff. April 1, 2026): "Candidates may take up to two
              // examinations during one exam session for a single fee of $41."
              // Never double the fee for Colorado (audit 2026-07-20).
              stateData.slug === "colorado"
              ? `$${stateData.examInfo.examFee} (covers both exams in one session)`
              : // Rhode Island: no combined L&H exam, but the two separate
                // exams are buy-one-get-one-free when scheduled back-to-back
                // in one test-center session. Pearson VUE Rhode Island
                // Insurance Licensing Candidate Handbook #124000 (Feb 2026),
                // Available Examinations: Life Producer $80 / Accident &
                // Health Producer $80, "(If scheduled back to back, buy one
                // get one free)". Do NOT double the fee (audit 2026-07-21).
                stateData.slug === "rhode-island"
              ? `$${stateData.examInfo.examFee} (buy one get one free when both exams are scheduled back-to-back in one session)`
              : // Alaska: no combined L&H exam, but the two separate exams
                // (Life level 01, Health level 02) can be taken in ONE in-person
                // session at a physical Pearson VUE test center for a single $89
                // fee. Pearson VUE Alaska Insurance Licensing Candidate Handbook
                // (Sept 2023): "Candidates may take up to two examinations during
                // one exam session only at a physical Pearson VUE test center
                // location for a single fee of $89." OnVUE online charges per
                // exam. Never double the in-person fee for Alaska (audit 2026-07-21).
                stateData.slug === "alaska"
              ? `$${stateData.examInfo.examFee} (covers both exams in one in-person session)`
              : `$${2 * Number(stateData.examInfo.examFee)} (two exams)`
            : // States that DO offer a combined Life & Health exam priced ABOVE
              // the single-line exam (Arizona $59 vs $50, Connecticut $105 vs
              // $65, Maine $80 vs $55, Texas $49 vs $39, … — see
              // combinedExamFeeOverride). Render that combined fee explicitly
              // labeled as the combined Life & Health exam (and, where the
              // single-line fee is a clean figure, noting it for contrast) so it
              // is never read as a contradiction against the single-line fee
              // shown on this state's other pages. Arizona flows through the same
              // combinedExamFeeLabeled as every other override state. Value
              // unchanged — labeling only. L&H page only.
              (combinedExamFeeLabeled ?? undefined)
        }
      />

      {/* Ohio Admin. Code 3901-5-07(H)(16): PassGuarantee self-suppresses /
          swaps content for excluded states via the stateSlug prop. */}
      <PassGuarantee stateSlug={stateData.slug} />

      <PracticeExamCTA
        stateName={stateData.name}
        stateSlug={stateData.slug}
        practiceExams={stateData.practiceExams}
        loa={
          loaDef.slug === "life"
            ? "Life"
            : loaDef.slug === "health"
            ? "Health"
            : "Life + Health"
        }
      />

      <TestimonialCards stateName={stateData.name} seed={stateData.slug} stateSlug={stateData.slug} />

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} ${isOptionalExamPrep ? `${loaDef.shortName} Insurance Exam Prep` : `${loaDef.name} Prelicensing`} FAQs`}
      />

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="prelicensing-loa"
        currentLoa={loa as "life" | "health" | "life-and-health"}
        variant="gray"
      />

      {/* Visible "Last updated" stamp above the final CTA */}
      <section className="bg-white py-6 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <LastUpdated date={stateData.lastVerified} />
        </div>
      </section>

      <CTABanner
        title={`Ready to Start Your ${stateData.name} ${loaDef.shortName} ${isOptionalExamPrep ? "Exam Prep" : "Prelicensing"}?`}
        subtitle={
          isOptionalExamPrep
            ? `Enroll in our optional ${loaDef.shortName} insurance exam-prep course today. ${guaranteeSentence} Only ${pricing.price}.`
            : hoursIsNumber
            ? `Enroll in our ${pricing.hours}-hour ${isProviderApproved ? "state-approved " : ""}course today. ${guaranteeSentence} Only ${pricing.price}.`
            : `Enroll in our ${loaDef.name} course today. ${guaranteeSentence} Only ${pricing.price}.`
        }
        ctaText={`Enroll Now — ${pricing.price}`}
        ctaHref={enrollLink}
        externalLink
        disclosure={<RefundDisclosure />}
      />

      <StickyMobileCTA
        text="Enroll Now"
        href={enrollLink}
        price={pricing.price}
        state={state}
        loa={loa}
      />
    </>
  );
}
