import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stateDisclosure } from "@/lib/state-disclosures";
import { getStateBySlug } from "@/lib/states";
import { credentialKindFromHours, isPrelicensingHeld, isCeAvailable, isCeApprovedComingSoon, isPrelicensingApprovedComingSoon } from "@/lib/prelicensing-status";
import { generateStateParams } from "@/lib/generateStaticParams";
import { hasPassGuarantee } from "@/lib/pass-guarantee";
import { hasClassroomWebinarHours, withIlWebinarFaq, IL_WEBINAR_SHORT_LINE } from "@/lib/il-webinar";
import {
  generateArticleSchemaWithReviewer,
  generateBreadcrumbSchema,
  generateFAQSchema,
  SchemaMarkup,
} from "@/lib/schema";
import StateHero from "@/components/StateHero";
import IllinoisWebinarCallout from "@/components/IllinoisWebinarCallout";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleByline from "@/components/ArticleByline";
import EditorialByline from "@/components/EditorialByline";
import SourcesBlock from "@/components/SourcesBlock";
import RelatedStatePages from "@/components/RelatedStatePages";
import LastUpdated from "@/components/LastUpdated";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { formatPassingScore } from "@/lib/exam-score";

// /[state]/requirements step-by-step walkthrough videos. Each state's video
// description points buyers to its /[state]/requirements URL specifically,
// closing the viewer-to-page loop. Single-source-of-truth registry lives
// in src/lib/youtube-videos.json; per-state map below carries the extra
// VideoObject schema fields. Added FL 2026-06-09; CA + TX 2026-06-12.
type RequirementsVideo = {
  videoId: string;
  title: string;
  uploadDate: string;
  duration: string;
  description: string;
  // Optional canonical thumbnail override. Defaults to hqdefault (below) when
  // omitted so FL/CA/TX are unchanged; NC supplies maxresdefault (verified live).
  thumbnailUrl?: string;
};
const REQUIREMENTS_VIDEOS: Record<string, RequirementsVideo> = {
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
  "north-carolina": {
    videoId: "jKVMGguG_UI",
    title: "How To Get Your North Carolina Life + Health Insurance License (Step by Step)",
    uploadDate: "2026-07-23",
    duration: "PT6M18S",
    description:
      "Step-by-step walkthrough of the North Carolina Life & Health insurance license process: North Carolina no longer requires prelicensing education hours (HB 737 / S.L. 2025-45, eff. 10/1/2025), but the Pearson VUE state exam still tests the full body of insurance knowledge — this video covers the steps to get licensed, what it costs, and the exam-prep mistakes that cause first-attempt failures. Hosted by Justin vom Eigen, IDECC Certified Distance Education Instructor and founder of JustInsurance LLC.",
    thumbnailUrl: "https://i.ytimg.com/vi/jKVMGguG_UI/maxresdefault.jpg",
  },
  arizona: {
    videoId: "hH2xmNwnHPc",
    title: "How To Get Your Arizona Life + Health Insurance License (Step by Step)",
    uploadDate: "2026-07-16",
    duration: "PT6M45S",
    description:
      "Step-by-step walkthrough of the Arizona Life & Health insurance license process: Arizona does not require prelicensing education hours, but limits candidates to 4 exam attempts per line of authority within a 12-month period, so real prep for the PSI state exam still matters — this video covers the 4 steps to get licensed, what it costs, and the mistakes that trip people up. Hosted by Justin vom Eigen, IDECC Certified Distance Education Instructor and founder of JustInsurance LLC.",
    thumbnailUrl: "https://i.ytimg.com/vi/hH2xmNwnHPc/maxresdefault.jpg",
  },
};

function buildRequirementsVideoSchema(v: RequirementsVideo) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: v.description,
    thumbnailUrl: v.thumbnailUrl ?? `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
    uploadDate: v.uploadDate,
    duration: v.duration,
    contentUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.videoId}`,
  };
}

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
  // Title: layout.tsx applies a "%s | JustInsurance" template to plain-string titles.
  // Use { absolute } to opt out of that template and keep the brand suffix exactly once.
  // Also honor the <=60 char target — use state abbreviation for long state names.
  const brand = "JustInsurance";
  const fullTitle = `${stateData.name} Insurance License Requirements 2026 | ${brand}`;
  const shortTitle = `${stateData.abbreviation} Insurance License Requirements 2026 | ${brand}`;
  const titleString = fullTitle.length <= 60 ? fullTitle : shortTitle;
  // Answer-first meta (2026-06-17): replaced the old topic-list
  // ("prelicensing hours, exam, fingerprinting, fees, CE renewal") with
  // concrete per-state numbers. GSC showed requirements pages ranking
  // ~pos 9-10 but converting ~0 — competitors win the click by surfacing
  // specifics (passing score, fee, CE hours) in the snippet, not a list of
  // topics. Numbers come from the same stateData fields that feed the
  // on-page requirements table. Kept <= ~160 chars across all 50 states.
  const fpRequired =
    !stateData.fingerprintingNotes.toLowerCase().includes("not required") &&
    !stateData.fingerprintingNotes.toLowerCase().includes("no fingerprint");
  const description = `${stateData.name} insurance license requirements (2026): must be ${stateData.minAge}+, pass the state exam (passing standard: ${formatPassingScore(stateData.slug, stateData.examInfo.passingScore)})${fpRequired ? ", get fingerprinted" : ""}, and pay a $${stateData.applicationFee} application fee. ${stateData.ce.totalHours}-hr CE to renew.`;
  return {
    title: { absolute: titleString },
    description,
    robots: "index, follow",
    alternates: {
      canonical: `https://justinsuranceco.com/${stateData.slug}/requirements`,
    },
    openGraph: {
      title: titleString,
      description,
      url: `https://justinsuranceco.com/${stateData.slug}/requirements`,
      siteName: "JustInsurance",
      type: "website",
    },
    // Ohio Admin. Code 3901-5-07(H)(16): without a page-level twitter block,
    // Next.js inherits the root layout's twitter:description, which contains
    // the sitewide pass-guarantee blurb. Override for excluded states only so
    // non-Ohio pages stay byte-identical.
    // 50 Ill. Adm. Code 3119: the same inherited root twitter:description
    // also carries an unqualified "100% online, self-paced" claim, so
    // Illinois takes the page-scoped override too. All other states are
    // unchanged.
    ...(hasPassGuarantee(stateData.slug) && !hasClassroomWebinarHours(stateData)
      ? {}
      : {
          twitter: {
            card: "summary_large_image" as const,
            title: titleString,
            description,
            images: ["/og-image.png"],
          },
        }),
  };
}

function aOrAn(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

export default async function RequirementsPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) notFound();

  // 50 Ill. Adm. Code Part 3119 — Illinois requires 7.5 of the 20
  // prelicensing hours per line via live classroom/webinar with verified
  // attendance. Gates the callout, the hybrid step-1 copy, the appended
  // format FAQ, and the closing CTA. Other states render byte-identically.
  const ilWebinar = hasClassroomWebinarHours(stateData);

  // Gates the "Approved by {doiAbbr}" DOI badge and any self-referential
  // "state-approved" product claim for states where JustInsurance's own
  // provider application is still pending (providerApprovalNumber ===
  // "PENDING", e.g. New York, Washington) — same condition already used
  // for the adjacent Provider Approval # badge.
  const isProviderApproved = stateData.providerApprovalNumber !== "PENDING";
  const prelicensingRequired =
    credentialKindFromHours([
      stateData.prelicensing.life.hours,
      stateData.prelicensing.health.hours,
      stateData.prelicensing.lifeAndHealth.hours,
    ]) === "prelicensing";
  // See [state]/page.tsx: a PRELICENSING approval claim needs approval granted
  // AND a state that regulates prelicensing (CE-only states must not claim it).
  const prelicensingApproved = isProviderApproved && prelicensingRequired;
  // AVAILABILITY GATE — a state that MANDATES prelicensing but whose JustInsurance
  // provider approval is still PENDING (New York today) must NOT present a live
  // purchase path. Mirrors the hub page + cost page gating. isPrelicensingHeld is
  // NY-only right now (Washington is also PENDING but exam-only, so it is NOT
  // held) and reverts automatically the moment providerApprovalNumber becomes a
  // real number. Used to reframe the closing CTA below only.
  const prelicensingHeld = isPrelicensingHeld(stateData);
  // Approved-but-not-live gating (WA #300632 CE coming soon; NY #80025 prelicensing
  // approved-coming-soon, CE not submitted → ceApproved:false → pending). The DOI
  // credential badge above keeps using prelicensingApproved (NY provider IS
  // approved); only the "we OFFER courses" claims below are gated on live-ness.
  const prelicensingApprovedComingSoon = isPrelicensingApprovedComingSoon(stateData);
  const ceAvailable = isCeAvailable(stateData);
  const ceComingSoon = isCeApprovedComingSoon(stateData);
  const prelicensingCoursesLiveApproved = prelicensingApproved && !prelicensingHeld;
  // Florida resident agent licenses are PERPETUAL (no license renewal/expiration).
  // What you maintain is CE (every 2 years, by end of birth month) plus at least
  // one active company appointment; the license only terminates after 48 months
  // with no appointment (official DFS: myfloridacfo.com Licensing FAQ). Gate the
  // generic "renew your license" framing off for Florida.
  const isFlorida = stateData.slug === "florida";

  const hasSpecialTraining =
    stateData.specialTrainingRequirements.ltc !== null ||
    stateData.specialTrainingRequirements.nfip !== null ||
    stateData.specialTrainingRequirements.annuity !== null ||
    stateData.specialTrainingRequirements.other !== null;

  const hasFingerprinting =
    stateData.fingerprintingNotes &&
    !stateData.fingerprintingNotes.toLowerCase().includes("not required") &&
    !stateData.fingerprintingNotes.toLowerCase().includes("no fingerprint");

  // backgroundCheckCost is a free-text field: most states store a bare number
  // ("39.5"), but the states that charge nothing store regulatory wording
  // ("No fee required", "No separate fee"). Blindly prefixing "$" produced
  // "$No fee required" in the at-a-glance table and the cost FAQ. Format the
  // number only when the value actually is one (audit 2026-07-20).
  const backgroundCostIsNumeric = /^[0-9.]+$/.test(stateData.backgroundCheckCost);
  const backgroundCostDisplay = backgroundCostIsNumeric
    ? `$${stateData.backgroundCheckCost}`
    : stateData.backgroundCheckCost;

  // Build FAQ list — templated questions + state-specific FAQ.
  // withIlWebinarFaq appends the approved Illinois live-webinar format FAQ
  // (50 Ill. Adm. Code 3119) when the state carries classroomWebinarHours;
  // no-op for every other state. Flows into FAQPage JSON-LD below.
  const faqs = withIlWebinarFaq([
    {
      question: `How long does it take to get ${aOrAn(stateData.name)} ${stateData.name} insurance license?`,
      answer: `Most candidates complete the ${stateData.name} insurance licensing process in ${stateData.totalLicensingTime}. This includes${prelicensingRequired ? " completing prelicensing education," : ""} passing the state exam, fingerprinting (if required), and waiting for license approval after submitting your application.`,
    },
    {
      question: `What happens if my name doesn't match my ID in ${stateData.name}?`,
      answer: stateData.nameMatchWarning,
    },
    hasFingerprinting
      ? {
          question: `Where do I get fingerprinted in ${stateData.name}?`,
          answer: stateData.fingerprintingNotes,
        }
      : {
          question: `Does ${stateData.name} require fingerprinting for an insurance license?`,
          answer: `No. ${stateData.name} does not require fingerprinting for resident insurance producer licensing.`,
        },
    {
      question: `Can I transfer my insurance license from another state to ${stateData.name}?`,
      answer: stateData.reciprocityInfo,
    },
    {
      question: `How much does ${aOrAn(stateData.name)} ${stateData.name} insurance license cost?`,
      answer: `The total cost to get your ${stateData.name} insurance license typically falls in the ${stateData.totalCostRange} range. This includes: prelicensing course fees, the exam fee ($${stateData.examInfo.examFee}), the state application fee ($${stateData.applicationFee})${backgroundCostIsNumeric ? `, and the background check cost ($${stateData.backgroundCheckCost})` : `. There is no separate background-check fee in ${stateData.name}`}. Individual costs vary based on the line of authority you choose.`,
    },
    {
      question: `What are the ${stateData.name} CE requirements?`,
      answer: `${stateData.name} requires licensed insurance agents to complete ${stateData.ce.firstTermHours ? `${stateData.ce.firstTermHours} hours of continuing education before your first renewal, then ${stateData.ce.totalHours} hours every ${stateData.ce.renewalPeriod}` : `${stateData.ce.totalHours} hours of continuing education every ${stateData.ce.renewalPeriod}`}, including ${stateData.ce.ethicsHours} hours of ethics training.${stateData.ce.mandatedTopicHours ? ` ${stateData.ce.mandatedTopicHours}` : ``} Renewal deadline: ${stateData.renewalDeadline}.${ilWebinar ? "" : ceAvailable ? ` JustInsurance offers state-approved CE packages starting at ${stateData.ce.packagePrice}.` : ceComingSoon ? ` JustInsurance is an approved ${stateData.name} CE provider (#${stateData.providerApprovalNumber}) — our ${stateData.name} CE courses are coming soon.` : ` JustInsurance's ${stateData.name} CE provider approval is pending; our ${stateData.name} CE courses are not yet available.`}`,
    },
    // State-specific FAQ from data
    stateData.stateSpecificFAQ,
    {
      question: `What are the prelicensing hour requirements in ${stateData.name}?`,
      answer:
        typeof stateData.prelicensing.life.hours === "number" ||
        typeof stateData.prelicensing.health.hours === "number" ||
        typeof stateData.prelicensing.lifeAndHealth.hours === "number"
          ? (() => {
              // Build the per-line hours list, then join grammatically. Doing
              // this by hand (each segment hard-coding a trailing comma with a
              // "." fallback for the absent combined-license slot) produced a
              // dangling ",." for separate-license states like Wisconsin that
              // have Life & Health hours but no combined figure.
              const segments: string[] = [];
              if (typeof stateData.prelicensing.life.hours === "number")
                segments.push(`${stateData.prelicensing.life.hours} hours for Life`);
              if (typeof stateData.prelicensing.health.hours === "number")
                segments.push(`${stateData.prelicensing.health.hours} hours for Health`);
              if (typeof stateData.prelicensing.lifeAndHealth.hours === "number")
                segments.push(`${stateData.prelicensing.lifeAndHealth.hours} hours for a combined Life & Health license`);
              const joined =
                segments.length === 1
                  ? segments[0]
                  : segments.length === 2
                  ? `${segments[0]} and ${segments[1]}`
                  : `${segments.slice(0, -1).join(", ")}, and ${segments[segments.length - 1]}`;
              // Mississippi HB 819 (Miss. Code § 83-17-251(2)(h)) exempts Life-ONLY
              // applicants. Without this note the hours sentence asserts a Life
              // requirement that step 1 on this same page says does not apply.
              const mississippiNote =
                stateData.slug === "mississippi"
                  ? " Under House Bill 819 (Miss. Code § 83-17-251(2)(h)), applicants seeking the Life line of authority ONLY are exempt from that requirement."
                  : "";
              // Held prelicensing state (NY today): drop the present-tense
              // "Courses are available fully online" availability claim for a
              // coming-soon line. Live/exam-only states are byte-identical
              // (prelicensingHeld === false).
              return `${stateData.name} requires ${joined}.${mississippiNote} ${
                prelicensingHeld
                  ? `Our ${stateData.name} prelicensing courses are opening for enrollment soon.`
                  : "Courses are available fully online through JustInsurance."
              }`;
            })()
          : `${stateData.name} does not require prelicensing education to sit for the state exam. JustInsurance still offers optional, fully online exam-prep courses.`,
    },
  ], stateData);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    {
      name: stateData.name,
      url: `https://justinsuranceco.com/${stateData.slug}`,
    },
    {
      name: "Requirements",
      url: `https://justinsuranceco.com/${stateData.slug}/requirements`,
    },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const articleHeadline = `${stateData.name} Insurance License Requirements (2026)`;
  const articleDescription = `Everything you need to know to get and keep your ${stateData.name} insurance license — hours, exam, fingerprinting, renewal, and state-specific rules.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${stateData.slug}/requirements`,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}` },
    { name: "Requirements" },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />
      {REQUIREMENTS_VIDEOS[stateData.slug] && (
        <SchemaMarkup schema={buildRequirementsVideoSchema(REQUIREMENTS_VIDEOS[stateData.slug])} />
      )}

      <BreadcrumbNav crumbs={crumbs} />

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <StateHero
        eyebrow={`${stateData.name} License Requirements`}
        title={`${stateData.name} Insurance License Requirements (2026)`}
        subtitle={`Everything you need to know to get and keep your ${stateData.name} insurance license — hours, exam, fingerprinting, renewal, and state-specific rules.`}
        ctaButtons={
          ilWebinar
            ? [{ text: "Start My Course", href: `/${stateData.slug}/prelicensing` }]
            : [
                {
                  // Held prelicensing state (NY today): NO "start/enroll" purchase
                  // path. Relabel to a neutral learn-more that keeps the
                  // /prelicensing href (that page renders the held "opening soon"
                  // notice). WA exam-prep is NOT held, so WA keeps "Start My Course".
                  // Live states are byte-identical (prelicensingHeld === false).
                  text: prelicensingHeld
                    ? `Learn About ${stateData.name} Prelicensing`
                    : "Start My Course",
                  href: `/${stateData.slug}/prelicensing`,
                },
                {
                  // Gate the CE purchase-path CTA on live CE. When CE is not
                  // available (WA #300632 coming soon; NY CE approval pending) show
                  // a neutral info label instead of "Renew My License". Live states
                  // are byte-identical (ceAvailable === true).
                  text: ceAvailable
                    ? "Renew My License"
                    : `View ${stateData.name} CE Info`,
                  href: `/${stateData.slug}/continuing-education`,
                  variant: "secondary",
                },
              ]
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* Verification badges under hero */}
      <div className="bg-navy border-t border-blue-800 py-3 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-blue-200">
          <span>Last Verified: {stateData.lastVerified}</span>
          {stateData.providerApprovalNumber !== "PENDING" && (
            <span>Provider Approval #{stateData.providerApprovalNumber}</span>
          )}
          {/* Use the prelicensingApproved predicate already computed above rather
              than the bare CE-approval flag: in an exam-only state an unqualified
              "Approved by {DOI}" implies a prelicensing approval that does not
              exist. Name the CE credential we actually hold instead. */}
          {isProviderApproved && (
            <span>
              {prelicensingApproved
                ? `Approved by ${stateData.doiAbbr}`
                : `${stateData.doiAbbr}-approved CE provider`}
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

      {/* Editorial byline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <EditorialByline lastVerified={stateData.lastVerified} />
      </div>

      {/* Step-by-step walkthrough video for the states that have one
          (FL/CA/TX as of 2026-06-12 — see REQUIREMENTS_VIDEOS above).
          Placed under the editorial byline so viewer-to-reader handoff is
          tight: each video's YouTube description points buyers to THIS
          URL, and they immediately see the same step-by-step they just
          watched. VideoObject schema emitted above. */}
      {/* NC-only descriptive intro above the embed (SEO): the shared
          YouTubeEmbed hardcodes its own "Video: {title}" h2, so the
          keyword-rich heading + supporting copy live here, gated to NC so no
          other state renders it. Stays factually aligned with the HB 737 /
          S.L. 2025-45 no-prelicensing copy already on this page. */}
      {stateData.slug === "north-carolina" && (
        <section className="bg-gray-bg pt-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">
              Watch: How to Get Your North Carolina Life &amp; Health Insurance License
            </h2>
            <p className="text-gray-700 leading-relaxed">
              In this step-by-step video, JustInsurance founder Justin vom Eigen
              walks through exactly how to get your North Carolina Life &amp;
              Health insurance license — from the state&rsquo;s
              no-prelicensing-hours rule (HB 737 / S.L. 2025-45) to passing the
              Pearson VUE state exam and filing your NIPR application. Watch the
              full walkthrough, then follow the detailed North Carolina license
              requirements below to start your L&amp;H licensing process.
            </p>
          </div>
        </section>
      )}
      {stateData.slug === "arizona" && (
        <section className="bg-gray-bg pt-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">
              Watch: How to Get Your Arizona Life &amp; Health Insurance License
            </h2>
            <p className="text-gray-700 leading-relaxed">
              In this step-by-step video, JustInsurance founder Justin vom Eigen
              walks through exactly how to get your Arizona Life &amp; Health
              insurance license — from the state&rsquo;s no-prelicensing-hours
              rule and 4-attempts-per-12-months exam limit to passing the PSI
              state exam and filing your NIPR application. Watch the full
              walkthrough, then follow the detailed Arizona license requirements
              below to start your L&amp;H licensing process.
            </p>
          </div>
        </section>
      )}
      {REQUIREMENTS_VIDEOS[stateData.slug] && (
        <YouTubeEmbed
          videoId={REQUIREMENTS_VIDEOS[stateData.slug].videoId}
          title={REQUIREMENTS_VIDEOS[stateData.slug].title}
        />
      )}

      {/* TL;DR direct-answer block — snippet/AI-overview bait. Added
          2026-06-17 (GSC: page ranks ~pos 9-10 but the first on-page prose
          was a marketing value-promise, weak snippet material). This bolded
          factual lead gives Google a query-shaped answer to pull and
          reinforces the meta so it's less likely to be rewritten.
          Template-safe: examProvider is per-state (NEVER hardcode a vendor —
          it's PSI / Pearson VUE / Prometric by state); backgroundCheckCost
          is guarded because 13 states store a non-numeric string
          ("No separate fee" etc.); prelicensing hours are kept generic
          because 33 states are non-numeric. */}
      <section className="bg-white pt-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-navy rounded-r-lg p-5">
            <p className="text-gray-800 leading-relaxed">
              <strong>Quick answer:</strong> To get {aOrAn(stateData.name)}{" "}
              {stateData.name} insurance license you must be {stateData.minAge}+,{prelicensingRequired ? (isProviderApproved ? " complete state-approved prelicensing," : " complete prelicensing,") : ""} pass the {stateData.examInfo.examProvider} state exam
              ({formatPassingScore(stateData.slug, stateData.examInfo.passingScore)} to pass)
              {hasFingerprinting && (
                <>
                  , get fingerprinted (
                  {/^[0-9.]+$/.test(stateData.backgroundCheckCost)
                    ? `~$${stateData.backgroundCheckCost}`
                    : stateData.backgroundCheckCost.toLowerCase()}
                  )
                </>
              )}, and submit a ${stateData.applicationFee} license application.
              {isFlorida ? (
                <>
                  Your license is perpetual — keep it active with{" "}
                  {stateData.ce.totalHours} CE hours (including{" "}
                  {stateData.ce.ethicsHours} ethics) every{" "}
                  {stateData.ce.renewalPeriod} and at least one active company
                  appointment.
                </>
              ) : (
                <>
                  Renewal requires {stateData.ce.totalHours} CE hours (including{" "}
                  {stateData.ce.ethicsHours} ethics) every {stateData.ce.renewalPeriod}.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 50 Ill. Adm. Code 3119 — Illinois-only live-webinar format callout,
          directly under the quick-answer block so the format requirement is
          established before the requirements table. */}
      {ilWebinar && <IllinoisWebinarCallout />}

      {/* ── 2. Quick Requirements Summary Table ─────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            {stateData.name} Insurance License Requirements at a Glance
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Key facts for getting and maintaining your {stateData.name}{" "}
            insurance license.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "Minimum Age", value: `${stateData.minAge} years old` },
                  { label: "Residency Requirement", value: stateData.residencyRequirement },
                  {
                    label: "Prelicensing Hours (Life)",
                    value:
                      typeof stateData.prelicensing.life.hours === "number"
                        ? `${stateData.prelicensing.life.hours} hours`
                        : String(stateData.prelicensing.life.hours),
                  },
                  {
                    label: "Prelicensing Hours (Health)",
                    value:
                      typeof stateData.prelicensing.health.hours === "number"
                        ? `${stateData.prelicensing.health.hours} hours`
                        : String(stateData.prelicensing.health.hours),
                  },
                  {
                    label: "Prelicensing Hours (Life & Health Combined)",
                    value:
                      typeof stateData.prelicensing.lifeAndHealth.hours === "number"
                        ? `${stateData.prelicensing.lifeAndHealth.hours} hours`
                        : String(stateData.prelicensing.lifeAndHealth.hours),
                  },
                  { label: "Exam Provider", value: stateData.examInfo.examProvider },
                  { label: "Exam Fee", value: `$${stateData.examInfo.examFee}` },
                  { label: "Passing Score", value: formatPassingScore(stateData.slug, stateData.examInfo.passingScore) },
                  { label: "Application Fee", value: `$${stateData.applicationFee}` },
                  { label: "Background Check Cost", value: backgroundCostDisplay },
                  {
                    label: "Fingerprinting Required",
                    value: hasFingerprinting ? "Yes" : "No",
                  },
                  {
                    label: "CE Hours Required",
                    value: `${stateData.ce.totalHours} hours every ${stateData.ce.renewalPeriod}`,
                  },
                  { label: "Ethics CE Hours", value: `${stateData.ce.ethicsHours} hours` },
                  // fid-215: states that mandate specific CE topic-hours BEYOND
                  // ethics (Oregon: 3 hrs Oregon statutes & administrative rules
                  // per OAR 836-071-0215; New York: law/ethics/DEI credits).
                  // Listing "Ethics CE Hours" alone understates the requirement
                  // and a renewing producer could under-complete. Sourced from
                  // states.ts ce.mandatedTopicHours — undefined elsewhere, so
                  // every other state renders byte-identically.
                  ...(stateData.ce.mandatedTopicHours
                    ? [
                        {
                          label: "Other Mandated CE Topics",
                          value: stateData.ce.mandatedTopicHours,
                        },
                      ]
                    : []),
                  { label: "Renewal Deadline", value: stateData.renewalDeadline },
                  { label: "License Duration", value: stateData.licenseDuration },
                  {
                    label: "Special Training Required",
                    value: hasSpecialTraining ? "Yes (see below)" : "No",
                  },
                  { label: "Total Cost Estimate", value: stateData.totalCostRange },
                  { label: "Total Licensing Time", value: stateData.totalLicensingTime },
                ].map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-bg"}
                  >
                    <td className="px-5 py-3.5 font-semibold text-navy w-1/2">
                      {row.label}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm italic text-center mt-4 max-w-2xl mx-auto">
            Not a {stateData.name} resident? Producers licensed in another state
            can also be licensed in {stateData.name} via reciprocity — see our{" "}
            <Link
              href="/non-resident-insurance-license"
              className="text-navy underline hover:text-gold not-italic font-semibold"
            >
              Non-Resident Insurance License
            </Link>{" "}
            guide.
          </p>
        </div>
      </section>

      {/* ── 3. Step-by-Step Licensing Process ───────────────────────────────── */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            How to Get Your {stateData.name} Insurance License
          </h2>
          {(() => {
            const stepPrelicensing = {
              key: "prelicensing",
              title: "Complete Prelicensing Education",
              content: (
                <>
                  {ilWebinar ? (
                    // 50 Ill. Adm. Code 3119 — Illinois step copy states the
                    // live classroom/webinar requirement instead of the
                    // unqualified self-paced claim.
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {stateData.name} requires 20 hours of state-approved
                      prelicensing education per line of authority (40 hours for
                      the combined Life &amp; Health license) before sitting for
                      the exam — and 7.5 of the 20 hours for each line of
                      authority must be completed through live classroom or
                      webinar instruction with verified attendance (215 ILCS
                      5/500-30(b)). JustInsurance&apos;s Illinois course includes
                      the required 7.5 live webinar hours per line plus 12.5
                      self-paced online hours per line. You&apos;ll receive an
                      official certificate of completion once you finish.
                    </p>
                  ) : typeof stateData.prelicensing.lifeAndHealth.hours === "number" ? (
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {stateData.slug === "california"
                        ? // AB 943 (eff. 1/1/2026): ONE 12-hour Code & Ethics course covering every
                          // line — NOT 12 hours per line. It is monitored seat time.
                          `California requires a single ${stateData.prelicensing.lifeAndHealth.hours}-hour Code and Ethics prelicensing course, taken once and covering every line of authority, before you can be licensed. Those ${stateData.prelicensing.lifeAndHealth.hours} hours are monitored seat time, so the course cannot be completed any faster.`
                        : stateData.slug === "mississippi"
                        ? // HB 819 (Miss. Code § 83-17-251(2)(h)): Life-ONLY applicants are exempt.
                          `Mississippi requires ${stateData.prelicensing.health.hours} hours of${isProviderApproved ? " state-approved" : ""} prelicensing education for the Health line and ${stateData.prelicensing.lifeAndHealth.hours} hours for the combined Life & Health license before sitting for the exam. Applicants seeking the Life line of authority ONLY are exempt from the prelicensing requirement under House Bill 819 (Miss. Code § 83-17-251(2)(h)) — the state exam is still required.`
                        : stateData.prelicensing.life.hours === stateData.prelicensing.health.hours
                        ? `${stateData.name} requires ${stateData.prelicensing.life.hours} hours of${isProviderApproved ? " state-approved" : ""} prelicensing education per line of authority (${stateData.prelicensing.lifeAndHealth.hours} hours for the combined Life & Health license) before sitting for the exam.`
                        : `${stateData.name} requires ${stateData.prelicensing.life.hours} hours of${isProviderApproved ? " state-approved" : ""} prelicensing education for the Life line, ${stateData.prelicensing.health.hours} hours for the Health line, and ${stateData.prelicensing.lifeAndHealth.hours} hours for the combined Life & Health license, before sitting for the exam.`}{" "}
                      {/* Held prelicensing state (NY today): replace the
                          present-tense "study at your own pace ... certificate
                          once you finish" live-course claim with a coming-soon
                          line. Live/exam-only states are byte-identical
                          (prelicensingHeld === false). */}
                      {prelicensingHeld
                        ? `JustInsurance's ${stateData.name} prelicensing courses are opening for enrollment soon.`
                        : "JustInsurance's online courses let you study at your own pace on any device. You'll receive an official certificate of completion once you finish."}
                    </p>
                  ) : typeof stateData.prelicensing.life.hours === "number" ||
                    typeof stateData.prelicensing.health.hours === "number" ? (
                    // Separate per-line prelicensing hours with no combined
                    // Life & Health license (e.g. Wisconsin). State the real
                    // per-line requirement instead of leaking the raw field
                    // value into a broken "education status: 20" stub.
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {stateData.prelicensing.life.hours === stateData.prelicensing.health.hours
                        ? `${stateData.name} requires ${stateData.prelicensing.life.hours} hours of${isProviderApproved ? " state-approved" : ""} prelicensing education per line of authority (${stateData.prelicensing.life.hours} hours Life, ${stateData.prelicensing.health.hours} hours Health) before you can sit for the state exam.`
                        : `${stateData.name} requires ${stateData.prelicensing.life.hours} hours of${isProviderApproved ? " state-approved" : ""} prelicensing education for the Life line and ${stateData.prelicensing.health.hours} hours for the Health line before you can sit for the state exam.`}{" "}
                      {/* Held prelicensing state (NY today): replace the
                          present-tense "study at your own pace ... certificate
                          once you finish" live-course claim with a coming-soon
                          line. Live/exam-only states are byte-identical
                          (prelicensingHeld === false). */}
                      {prelicensingHeld
                        ? `JustInsurance's ${stateData.name} prelicensing courses are opening for enrollment soon.`
                        : "JustInsurance's online courses let you study at your own pace on any device. You'll receive an official certificate of completion once you finish."}
                    </p>
                  ) : stateData.slug === "north-carolina" ? (
                    // HB 737 / S.L. 2025-45 (eff. 10/1/2025) repealed North
                    // Carolina's mandatory prelicensing-education requirement for
                    // all producer lines. Drop the "check with the NC DOI"
                    // send-away and state the verified fact with its citation.
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      North Carolina no longer requires a prelicensing course to
                      sit for the state exam (HB 737 / S.L. 2025-45, effective
                      October 1, 2025) — you just need to pass the Pearson VUE
                      exam. JustInsurance&apos;s North Carolina course is built to
                      get you exam-ready and through the state test on your first
                      try.
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      Prelicensing education status for {stateData.name}:{" "}
                      {String(stateData.prelicensing.life.hours)}. Check with
                      the {stateData.doiName} for current requirements.
                    </p>
                  )}
                  <Link
                    href={`/${stateData.slug}/prelicensing`}
                    className="text-sm font-semibold text-gold hover:underline"
                  >
                    Browse {stateData.name} Prelicensing Courses →
                  </Link>
                </>
              ),
            };

            const stepExamStandard = {
              key: "exam",
              title: "Schedule and Pass the State Exam",
              content: (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    The {stateData.name} insurance licensing exam is administered
                    by {stateData.examInfo.examProvider}. The exam fee is $
                    {stateData.examInfo.examFee}, and you&apos;ll need a passing
                    score of {formatPassingScore(stateData.slug, stateData.examInfo.passingScore)}.{" "}
                    {/* Exam-only states have no prelicensing to complete first —
                        saying the exam follows it invents a prerequisite. */}
                    {prelicensingRequired
                      ? "Schedule your exam online after completing your prelicensing education."
                      : `You can schedule your exam online at any time — ${stateData.name} does not require prelicensing education first.`}
                  </p>
                  {stateData.examInfo.examBookingUrl && (
                    <a
                      href={stateData.examInfo.examBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold hover:underline"
                    >
                      Schedule Your Exam with {stateData.examInfo.examProvider} →
                    </a>
                  )}
                </>
              ),
            };

            const stepExamAfterATT = {
              key: "exam",
              title: "Schedule and Pass the State Exam",
              content: (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    The {stateData.name} insurance licensing exam is administered
                    by {stateData.examInfo.examProvider}. The exam fee is $
                    {stateData.examInfo.examFee}, and you&apos;ll need a passing
                    score of {formatPassingScore(stateData.slug, stateData.examInfo.passingScore)}. Schedule your
                    exam online after receiving your Authorization to Test (ATT).
                  </p>
                  {stateData.examInfo.examBookingUrl && (
                    <a
                      href={stateData.examInfo.examBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold hover:underline"
                    >
                      Schedule Your Exam with {stateData.examInfo.examProvider} →
                    </a>
                  )}
                </>
              ),
            };

            const stepFingerprinting = {
              key: "fingerprinting",
              title: "Complete Fingerprinting",
              content: (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {stateData.fingerprintingNotes}
                </p>
              ),
            };

            const stepApplyStandard = {
              key: "apply",
              title: "Apply for Your License",
              content: (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {stateData.applicationProcess} The application fee is $
                    {stateData.applicationFee}. Processing typically takes{" "}
                    {stateData.applicationProcessingTime}.
                  </p>
                  {stateData.licenseApplicationPortal && (
                    <a
                      href={stateData.licenseApplicationPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold hover:underline"
                    >
                      Apply for Your {stateData.name} License →
                    </a>
                  )}
                </>
              ),
            };

            const stepApplyBeforeExam = {
              key: "apply",
              title: "Apply for Your License & Get ATT",
              content: (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {stateData.applicationProcess} The application fee is $
                    {stateData.applicationFee}. Processing typically takes{" "}
                    {stateData.applicationProcessingTime}.
                  </p>
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-3">
                    You must receive your Authorization to Test (ATT) before you
                    can schedule your exam.
                  </p>
                  {stateData.licenseApplicationPortal && (
                    <a
                      href={stateData.licenseApplicationPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gold hover:underline"
                    >
                      Apply for Your {stateData.name} License →
                    </a>
                  )}
                </>
              ),
            };

            const stepAppointment = {
              key: "appointment",
              title: "Get Appointed and Start Selling",
              content: (
                <p className="text-gray-600 text-sm leading-relaxed">
                  Once your {stateData.name} insurance license is issued, you
                  must be appointed by an insurance carrier before you can sell
                  their products. Each carrier you work with will submit an
                  appointment request to the {stateData.doiName}. Appointments
                  are typically processed within a few business days, and there
                  is no additional exam required. Your sponsoring agency or
                  carrier will guide you through this process.
                </p>
              ),
            };

            const steps = stateData.applicationBeforeExam
              ? [
                  stepPrelicensing,
                  stepApplyBeforeExam,
                  ...(hasFingerprinting ? [stepFingerprinting] : []),
                  stepExamAfterATT,
                  stepAppointment,
                ]
              : [
                  stepPrelicensing,
                  stepExamStandard,
                  ...(hasFingerprinting ? [stepFingerprinting] : []),
                  stepApplyStandard,
                  stepAppointment,
                ];

            // fid: the intro hard-coded "these five steps" while the list
            // actually renders four steps wherever the state has no
            // fingerprinting requirement (Arkansas, Colorado, Connecticut,
            // Illinois, Indiana, Kentucky, Maine, Maryland, Massachusetts,
            // Michigan, Mississippi, Missouri, Nebraska, New Hampshire,
            // New York, Oklahoma, South Dakota, Vermont — 18 states where
            // fingerprintingNotes says fingerprinting is not required).
            // Derive the number from the list that is actually rendered so
            // the sentence can never drift from the steps again.
            const stepCountWords = [
              "zero",
              "one",
              "two",
              "three",
              "four",
              "five",
              "six",
              "seven",
              "eight",
            ];
            const stepCountWord =
              stepCountWords[steps.length] ?? String(steps.length);

            return (
              <>
                <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
                  Follow these {stepCountWord} steps to go from zero to licensed
                  in {stateData.name}.
                </p>
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <div
                      key={step.key}
                      className="bg-white rounded-xl p-6 shadow-sm flex gap-5 items-start"
                    >
                      <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-dark font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-navy text-lg mb-2">
                          {step.title}
                        </h3>
                        {step.content}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* ── 4. Fingerprinting Requirements ──────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
            {stateData.name} Fingerprinting Requirements
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {stateData.fingerprintingNotes}
          </p>

          {/* Name Match Warning callout */}
          {stateData.nameMatchWarning && (
            <div className="bg-yellow-50 border-l-4 border-gold rounded-lg p-5">
              <div className="flex gap-3 items-start">
                <svg
                  className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">
                    Name Match Requirement
                  </p>
                  <p className="text-yellow-800 text-sm leading-relaxed">
                    {stateData.nameMatchWarning}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Special Training Requirements (conditional) ───────────────────── */}
      {hasSpecialTraining && (
        <section className="bg-gray-bg py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
              Special Training Requirements for {stateData.name}
            </h2>
            <p className="text-gray-500 mb-8">
              {stateData.name} requires additional training for agents selling
              certain specialty products. These are separate from standard
              prelicensing hours.
            </p>
            <div className="space-y-4">
              {stateData.specialTrainingRequirements.ltc !== null && (
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gold">
                  <h3 className="font-bold text-navy mb-2">
                    Long-Term Care (LTC) Training
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stateData.specialTrainingRequirements.ltc}
                  </p>
                </div>
              )}
              {stateData.specialTrainingRequirements.nfip !== null && (
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gold">
                  <h3 className="font-bold text-navy mb-2">
                    National Flood Insurance Program (NFIP) Training
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stateData.specialTrainingRequirements.nfip}
                  </p>
                </div>
              )}
              {stateData.specialTrainingRequirements.annuity !== null && (
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gold">
                  <h3 className="font-bold text-navy mb-2">
                    Annuity Training
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stateData.specialTrainingRequirements.annuity}
                  </p>
                </div>
              )}
              {stateData.specialTrainingRequirements.other !== null && (
                <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gold">
                  <h3 className="font-bold text-navy mb-2">
                    Additional Training Requirements
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stateData.specialTrainingRequirements.other}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. CE Renewal Requirements ──────────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
            {stateData.name} CE Renewal Requirements
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {isFlorida ? (
              <>
                Florida insurance licenses are <strong>perpetual</strong> — there
                is no license expiration or renewal fee to track. You keep your
                license active by completing your continuing education every{" "}
                {stateData.ce.renewalPeriod} (by the end of your birth month) and
                maintaining at least one active company appointment. A license
                only terminates after 48 months with no active appointment. Here
                are the CE details:
              </>
            ) : (
              <>
                To keep your {stateData.name} insurance license active, you must
                complete continuing education every {stateData.ce.renewalPeriod}.
                Here are the details:
              </>
            )}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {[
              {
                label: "Total CE Hours",
                value: `${stateData.ce.totalHours} hours`,
              },
              {
                label: "Ethics Hours Required",
                value: `${stateData.ce.ethicsHours} hours`,
              },
              {
                label: "Renewal Period",
                value: stateData.ce.renewalPeriod,
              },
              {
                label: "Renewal Deadline",
                value: stateData.renewalDeadline,
              },
              // CE package pricing suppressed for states with a live-CE-ethics
              // mandate (Illinois) until a compliant CE product ships.
              ...(ilWebinar || !ceAvailable
                ? []
                : [{ label: "CE Package Price", value: stateData.ce.packagePrice }]),
              {
                label: "Regulatory Body",
                value: stateData.doiAbbr,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-bg rounded-xl p-5 text-center"
              >
                <p className="text-2xl font-bold text-navy mb-1">
                  {item.value}
                </p>
                <p className="text-gray-500 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
          {/* fid-215: the stat grid above shows only "Ethics Hours Required".
              For states that mandate additional specific CE subjects inside the
              same total (Oregon: 3 hrs on Oregon statutes and administrative
              rules, separate from the 3 ethics hours — OAR 836-071-0215), the
              grid alone would let a renewing producer under-complete. Rendered
              from states.ts ce.mandatedTopicHours; undefined elsewhere. */}
          {stateData.ce.mandatedTopicHours && (
            <div className="bg-amber-50 border-l-4 border-gold rounded-r-lg p-5 mb-8">
              <p className="font-semibold text-navy text-sm mb-1">
                {stateData.name} mandates specific CE subjects beyond ethics
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {stateData.ce.mandatedTopicHours}
              </p>
            </div>
          )}
          {!ilWebinar && (
            <div className="text-center">
              <Link
                href={`/${stateData.slug}/continuing-education`}
                className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold px-8 py-4 rounded-lg shadow transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {ceAvailable ? `Browse ${stateData.name} CE Courses →` : `View ${stateData.name} CE Info →`}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── 7. Legal References ─────────────────────────────────────────────── */}
      {(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const citations = (stateData as any).citations as {
          insuranceCode?: string;
          insuranceCodeFull?: string;
          prelicenseCode?: string;
          ceRequirementsCode?: string;
          ceEthicsCode?: string;
          providerRegulation?: string;
          adminCodeName?: string;
          adminCodeRef?: string;
          adminCodeUrl?: string;
          statutesUrl?: string;
          ageCitation?: string;
          educationCitation?: string;
          examCitation?: string;
          backgroundCitation?: string;
          fingerprintCitation?: string;
          applicationCitation?: string;
        } | undefined;

        if (!citations) return null;

        const items: { label: string; value: string; url?: string }[] = [
          { label: "Insurance Code", value: citations.insuranceCodeFull ?? "", url: citations.statutesUrl },
          { label: "Prelicensing Education", value: citations.educationCitation ?? "" },
          { label: "Examination Requirements", value: citations.examCitation ?? "" },
          { label: "Age Requirements", value: citations.ageCitation ?? "" },
          { label: "Background Check", value: citations.backgroundCitation ?? "" },
          { label: "Fingerprinting", value: citations.fingerprintCitation ?? "" },
          { label: "License Application", value: citations.applicationCitation ?? "" },
          { label: "CE Requirements", value: citations.ceRequirementsCode ?? "" },
          { label: "CE Ethics", value: citations.ceEthicsCode ?? "" },
          { label: "Administrative Code", value: citations.adminCodeRef ?? "", url: citations.adminCodeUrl },
          { label: "Provider Regulation", value: citations.providerRegulation ?? "" },
        ].filter((item) => item.value.trim() !== "");

        if (items.length === 0) return null;

        return (
          <section className="bg-gray-bg py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
                {stateData.name} Insurance Licensing Laws &amp; Regulations
              </h2>
              <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
                Legal citations and statutory references governing insurance licensing in {stateData.name}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div key={item.label} className="bg-white rounded-xl p-5 shadow-sm">
                    <p className="font-semibold text-navy text-sm mb-1">{item.label}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {item.value}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-navy underline ml-2 hover:text-gold"
                        >
                          View Statute
                        </a>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── 8. FAQ Section ──────────────────────────────────────────────────── */}
      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} Insurance License Requirements — FAQs`}
      />

      {/* ── 9. Related Guides ───────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy mb-6">Related {stateData.name} Licensing Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/how-long-to-get-insurance-license" className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">Licensing Timeline</div>
              <div className="text-sm text-gray-600">How long it takes from enrollment to an active license number.</div>
            </Link>
            <Link href="/insurance-license-cost" className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">Total License Cost</div>
              <div className="text-sm text-gray-600">State-by-state breakdown of exam, application, and fingerprint fees.</div>
            </Link>
            <Link href="/non-resident-insurance-license" className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">Non-Resident License</div>
              <div className="text-sm text-gray-600">Already licensed elsewhere? See the reciprocity process for {stateData.name}.</div>
            </Link>
            <Link href={`/${stateData.slug}/practice-exam`} className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">{stateData.name} Practice Exam</div>
              <div className="text-sm text-gray-600">Mirror the real {stateData.examInfo?.examProvider || "state"} exam before test day.</div>
            </Link>
            <Link href={`/${stateData.slug}/prelicensing`} className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">{stateData.name} Prelicensing</div>
              <div className="text-sm text-gray-600">
                {prelicensingCoursesLiveApproved
                  ? "State-approved prelicensing courses for Life, Health, and Life & Health lines."
                  : "Prelicensing courses for Life, Health, and Life & Health lines."}
              </div>
            </Link>
            {!ilWebinar && (
              <Link href={`/${stateData.slug}/continuing-education`} className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
                <div className="font-semibold text-navy mb-1">{stateData.name} CE Courses</div>
                <div className="text-sm text-gray-600">
                  {ceAvailable
                    ? "Renew your license with state-approved continuing education."
                    : "Renew your license with continuing education."}
                </div>
              </Link>
            )}
            <Link href={`/${stateData.slug}/cost`} className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-gold hover:shadow-md transition-all">
              <div className="font-semibold text-navy mb-1">{stateData.name} License Cost Breakdown</div>
              <div className="text-sm text-gray-600">{stateData.name}-specific cost: course, exam, fingerprinting, and application fees.</div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. Sources & Regulators ─────────────────────────────────────────── */}
      <SourcesBlock stateData={stateData} />

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="requirements"
        variant="white"
      />

      {/* Visible "Last updated" stamp above the final CTA */}
      <section className="bg-white py-6 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <LastUpdated date={stateData.lastVerified} />
        </div>
      </section>

      {/* ── 11. CTA Banner ──────────────────────────────────────────────────── */}
      {/* Ohio Admin. Code 3901-5-07(H)(16): no pass-guarantee copy on Ohio pages. */}
      <CTABanner
        title={`Ready to Get Your ${stateData.name} Insurance License?`}
        subtitle={
          // A held state (isPrelicensingHeld: provider approval still PENDING —
          // New York today) must NOT present a "start / instant access" purchase
          // path. This branch takes precedence and gives held states the neutral
          // opening-soon message. Reverts automatically once approval issues.
          prelicensingHeld
            ? prelicensingApprovedComingSoon
              ? `JustInsurance is an approved ${stateData.name} provider (#${stateData.providerApprovalNumber}) — our ${stateData.name} prelicensing course is opening for enrollment soon.`
              : `Our ${stateData.name} prelicensing course is completing state approval and will open for enrollment soon.`
            // 50 Ill. Adm. Code 3119 — Illinois swaps the unqualified
            // "self-paced" claim for the approved hybrid format line.
            : ilWebinar
            ? `Start your ${prelicensingApproved ? "state-approved " : ""}prelicensing course today. ${IL_WEBINAR_SHORT_LINE}`
            : hasPassGuarantee(stateData.slug)
            ? `Start your ${prelicensingApproved ? "state-approved " : ""}prelicensing course today. 100% online, self-paced, and backed by our pass guarantee.`
            : `Start your ${prelicensingApproved ? "state-approved " : ""}prelicensing course today. 100% online, self-paced, with instant access the moment you enroll.`
        }
        ctaText={prelicensingHeld ? "Learn More" : "Start My Course Today"}
        ctaHref={`/${stateData.slug}/prelicensing`}
      />
    </>
  );
}
