import type { Metadata } from "next";
import { loaShortName } from "./loa";

const BASE_URL = "https://justinsuranceco.com";
const OG_IMAGE = "/og-image.png";

// PageTypes that resolve to a per-state OG image when stateSlug is provided.
// Other pageTypes (home, practice-exam-hub) keep the generic /og-image.png.
const STATE_OG_PAGE_TYPES: ReadonlySet<PageType> = new Set<PageType>([
  "state-hub",
  "prelicensing-hub",
  "ce-hub",
  "prelicensing-course",
  "ce-course",
  "practice-exam",
  "state-cost",
]);

// Slugs known to have a generated /public/og/<slug>.png — kept in sync with
// scripts/generate-state-og-images.py. Keeps us safe if a non-state slug
// ever sneaks into a stateful pageType (e.g. data hiccup) — we fall back
// to the generic OG instead of emitting a 404'd image URL.
const STATE_OG_SLUGS: ReadonlySet<string> = new Set<string>([
  "alabama", "alaska", "arizona", "arkansas", "california",
  "colorado", "connecticut", "delaware", "florida", "georgia",
  "hawaii", "idaho", "illinois", "indiana", "iowa",
  "kansas", "kentucky", "louisiana", "maine", "maryland",
  "massachusetts", "michigan", "minnesota", "mississippi", "missouri",
  "montana", "nebraska", "nevada", "new-hampshire", "new-jersey",
  "new-mexico", "new-york", "north-carolina", "north-dakota", "ohio",
  "oklahoma", "oregon", "pennsylvania", "rhode-island", "south-carolina",
  "south-dakota", "tennessee", "texas", "utah", "vermont",
  "virginia", "washington", "west-virginia", "wisconsin", "wyoming",
]);

/**
 * Returns the per-state OG image path if the slug has a generated asset,
 * otherwise the generic site-wide OG image.
 */
function getOGImageForState(stateSlug?: string): string {
  if (stateSlug && STATE_OG_SLUGS.has(stateSlug)) {
    return `/og/${stateSlug}.png`;
  }
  return OG_IMAGE;
}

export type PageType =
  | "home"
  | "state-hub"
  | "prelicensing-hub"
  | "ce-hub"
  | "prelicensing-course"
  | "ce-course"
  | "practice-exam"
  | "practice-exam-hub"
  | "state-cost";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function buildCanonical(path: string): string {
  // Ensure exactly one leading slash, no trailing slash except for root
  const normalised = path === "/" ? "" : `/${path.replace(/^\/|\/$/g, "")}`;
  return `${BASE_URL}${normalised}`;
}

function buildTitle(
  pageType: PageType,
  params: PageMetadataParams
): { absolute: string } {
  // These titles are long and already include the brand name, so we bypass
  // the root layout's "%s | JustInsurance" template via { absolute }.
  const { stateName = "", stateAbbreviation = "", loaName = "" } = params;
  const shortState = stateAbbreviation || stateName;

  // Target: 45-61 characters. Use abbreviation for long state names to stay under limit.
  const brand = "JustInsurance";
  // Build title candidates ordered by preference — pick first that fits ≤60 chars.
  // Strategy: keyword-rich primary, progressively shorter fallbacks.
  const hours = params.hours;
  const hourStr = hours ? `${hours} Hours` : "";

  const candidatesByType: Record<PageType, string[]> = {
    home: [
      `Insurance Prelicensing & CE Courses | ${brand}`,
    ],
    "state-hub": (() => {
      // State-specific title overrides — lead with price ($199) for competitive
      // advantage signal in SERP titles (most competitors hide pricing).
      const stateSlug = params.stateSlug || "";
      const overrides: Record<string, string[]> = {
        florida: [
          `Florida Insurance License Course — $199 | ${brand}`,
        ],
        texas: [
          `Texas Insurance License Course — $199 | ${brand}`,
        ],
        california: [
          `California Insurance License — $199 CDI-Approved | ${brand}`,
        ],
      };
      if (overrides[stateSlug]) return overrides[stateSlug];
      // Default pattern: lead with price, fall back progressively to stay ≤60 chars
      return [
        `${stateName} Insurance License Course — $199 | ${brand}`,
        `${stateName} Insurance License — $199 | ${brand}`,
        `${stateName} Insurance License | ${brand}`,
        `${shortState} Insurance License — $199 | ${brand}`,
      ];
    })(),
    "prelicensing-hub": [
      `${stateName} Insurance Prelicensing | ${hourStr} | ${brand}`,
      `${stateName} Insurance Prelicensing Course | ${brand}`,
      `${stateName} Prelicensing Course | ${brand}`,
    ].filter(t => !t.includes("| |")), // remove empty hours variant
    "ce-hub": [
      `${stateName} Insurance CE | Same-Day Reporting | ${brand}`,
      `${stateName} Insurance CE Courses | ${brand}`,
      `${stateName} CE Courses | ${brand}`,
    ],
    "prelicensing-course": [
      `${stateName} ${loaName} Prelicensing Course | $199 | ${brand}`,
      `${stateName} ${loaName} Prelicensing Course | ${brand}`,
      `${stateName} ${loaName} Prelicensing | ${brand}`,
      `${shortState} ${loaName} Prelicensing | ${brand}`,
    ],
    "ce-course": [
      `${stateName} ${loaName} CE | Same-Day Reporting | ${brand}`,
      `${stateName} ${loaName} CE Course | ${brand}`,
      `${stateName} ${loaName} CE | ${brand}`,
      `${shortState} ${loaName} CE Course | ${brand}`,
    ],
    "practice-exam": [
      `${stateName} Insurance Practice Exam | $59 | ${brand}`,
      `${stateName} Insurance Practice Exam | ${brand}`,
      `${stateName} Practice Exam | ${brand}`,
    ],
    "practice-exam-hub": [
      `Insurance Practice Exams by State | $59 | ${brand}`,
      `Insurance Practice Exams | Nationwide | ${brand}`,
      `Insurance Practice Exams | ${brand}`,
    ],
    "state-cost": [
      `${stateName} Insurance License Cost — Full Breakdown | ${brand}`,
      `${stateName} Insurance License Cost Breakdown | ${brand}`,
      `${stateName} Insurance License Cost | ${brand}`,
      `${shortState} Insurance License Cost | ${brand}`,
    ],
  };

  const candidates = candidatesByType[pageType];
  // Pick first candidate in 45-60 range, fallback to first under 60.
  const title =
    candidates.find((c) => c.length >= 45 && c.length <= 60) ||
    candidates.find((c) => c.length <= 60) ||
    candidates[candidates.length - 1].slice(0, 57) + "...";

  return { absolute: title };
}

function buildDescription(
  pageType: PageType,
  params: PageMetadataParams
): string {
  // All descriptions target ≤ 160 characters.
  const { stateName = "", loaName = "" } = params;

  // Descriptions: 120-155 chars, include 2+ conversion signals (93% pass rate, $199, pass guarantee, state-approved, same-day reporting).
  const hours = params.hours;

  switch (pageType) {
    case "home":
      return "State-approved insurance prelicensing and CE courses nationwide. 100% online, self-paced, 93% pass rate, pass guarantee. From $199.";
    case "state-hub": {
      const ep = params.examProvider;
      const providerBit = ep ? `${ep} exam prep, ` : "";
      const desc = `Get your ${stateName} insurance license online — ${providerBit}state-approved prelicensing, 93% pass rate, pass guarantee. From $199.`;
      return desc.length <= 160
        ? desc
        : `Get your ${stateName} insurance license online. State-approved prelicensing and CE, 93% pass rate, pass guarantee. From $199.`;
    }
    case "prelicensing-hub": {
      const h = hours ? `${hours}-hour ` : "";
      const desc = `Complete your ${stateName} insurance prelicensing requirement online. ${h}State-approved course, self-paced, practice exams included. 93% pass rate. $199.`;
      return desc.length <= 155 ? desc : `Complete your ${stateName} insurance prelicensing online. State-approved, self-paced, 93% pass rate, pass guarantee. $199.`;
    }
    case "ce-hub": {
      const ch = params.ceHours;
      const cp = params.ceRenewalPeriod;
      if (ch && cp) {
        const desc = `Renew your ${stateName} insurance license — ${ch} CE hours every ${cp}. State-approved, same-day DOI reporting, self-paced. From $39.`;
        if (desc.length <= 160) return desc;
      }
      return `Renew your ${stateName} insurance license with state-approved CE courses. Complete online at your own pace, same-day DOI reporting. From $39.`;
    }
    case "prelicensing-course":
      return `${stateName} ${loaShortName(loaName)} insurance prelicensing course online. $199, state-approved, 93% pass rate, pass guarantee. Self-paced with practice exams.`;
    case "ce-course":
      return `${stateName} ${loaName} CE course online. Same-day DOI reporting, self-paced, state-approved. Renew your insurance license with JustInsurance. From $39.`;
    case "practice-exam":
      return `${stateName} insurance practice exam — Life, Health, and Life & Health versions. Mirror the real state exam. Boost your score, pass with confidence. $59.`;
    case "practice-exam-hub":
      return `State-approved insurance practice exams nationwide. Life, Health, and Life & Health — mirror the real state exam. Pick your state to start. $59.`;
    case "state-cost": {
      const range = params.totalCostRange;
      if (range && range.length <= 40) {
        const desc = `${stateName} insurance license cost: ${range}. Full breakdown of prelicensing, exam, application, and fingerprint fees. JustInsurance prelicensing $199.`;
        if (desc.length <= 160) return desc;
      }
      return `${stateName} insurance license cost breakdown: prelicensing, state exam, application, and fingerprint fees. JustInsurance prelicensing from $199.`;
    }
  }
}

function buildCanonicalPath(
  pageType: PageType,
  params: PageMetadataParams
): string {
  const { stateSlug = "", loaSlug = "" } = params;

  switch (pageType) {
    case "home":
      return "/";
    case "state-hub":
      return `/${stateSlug}/`;
    case "prelicensing-hub":
      return `/${stateSlug}/prelicensing/`;
    case "ce-hub":
      return `/${stateSlug}/continuing-education/`;
    case "prelicensing-course":
      return `/${stateSlug}/prelicensing/${loaSlug}/`;
    case "ce-course":
      return `/${stateSlug}/continuing-education/${loaSlug}/`;
    case "practice-exam":
      return `/${stateSlug}/practice-exam/`;
    case "practice-exam-hub":
      return "/practice-exam/";
    case "state-cost":
      return `/${stateSlug}/cost/`;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface PageMetadataParams {
  pageType: PageType;
  stateName?: string;
  stateSlug?: string;
  stateAbbreviation?: string;
  loaName?: string;
  loaSlug?: string;
  hours?: number;
  price?: string;
  examProvider?: string;
  ceHours?: number;
  ceRenewalPeriod?: string;
  totalCostRange?: string;
}

export function generatePageMetadata(params: PageMetadataParams): Metadata {
  const { pageType } = params;

  const title = buildTitle(pageType, params);
  const description = buildDescription(pageType, params);
  const canonicalPath = buildCanonicalPath(pageType, params);
  const canonicalUrl = buildCanonical(canonicalPath);

  // Extract the raw string for OG/Twitter (which don't accept { absolute })
  const titleString = title.absolute;

  // Per-state OG image when the pageType is one of the state-scoped types and
  // we have a known slug. Falls back to the generic site OG otherwise.
  const ogImagePath =
    STATE_OG_PAGE_TYPES.has(pageType)
      ? getOGImageForState(params.stateSlug)
      : OG_IMAGE;
  const ogAlt =
    ogImagePath === OG_IMAGE
      ? "JustInsurance — Online Insurance License Courses"
      : `${params.stateName ?? "JustInsurance"} Insurance License Course — JustInsurance`;

  return {
    title,
    description,
    robots: "index, follow",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: titleString,
      description,
      url: canonicalUrl,
      siteName: "JustInsurance",
      type: "website",
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleString,
      description,
      images: [ogImagePath],
    },
  };
}
