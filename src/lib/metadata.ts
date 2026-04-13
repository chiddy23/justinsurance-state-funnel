import type { Metadata } from "next";

const BASE_URL = "https://justinsuranceco.com";
const OG_IMAGE = "/og-image.png";

export type PageType =
  | "home"
  | "state-hub"
  | "prelicensing-hub"
  | "ce-hub"
  | "prelicensing-course"
  | "ce-course";

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
  const { stateName = "", loaName = "" } = params;

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
    "state-hub": [
      `${stateName} Insurance License | State-Approved | ${brand}`,
      `${stateName} Insurance License Course | ${brand}`,
      `${stateName} Insurance License | ${brand}`,
    ],
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
    ],
    "ce-course": [
      `${stateName} ${loaName} CE | Same-Day Reporting | ${brand}`,
      `${stateName} ${loaName} CE Course | ${brand}`,
      `${stateName} ${loaName} CE | ${brand}`,
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
      return "State-approved insurance prelicensing and CE courses for all 50 states. 100% online, self-paced, 93% pass rate, pass guarantee. From $199.";
    case "state-hub":
      return `Get your ${stateName} insurance license online. State-approved prelicensing and CE, 93% pass rate, same-day CE reporting. Pass guarantee — from $199.`;
    case "prelicensing-hub": {
      const h = hours ? `${hours}-hour ` : "";
      const desc = `Complete your ${stateName} insurance prelicensing requirement online. ${h}State-approved course, self-paced, practice exams included. 93% pass rate. $199.`;
      return desc.length <= 155 ? desc : `Complete your ${stateName} insurance prelicensing online. State-approved, self-paced, 93% pass rate, pass guarantee. $199.`;
    }
    case "ce-hub":
      return `Renew your ${stateName} insurance license with state-approved CE courses. Complete online at your own pace, same-day DOI reporting. From $39.`;
    case "prelicensing-course":
      return `${stateName} ${loaName} insurance prelicensing course online. $199, state-approved, 93% pass rate, pass guarantee. Self-paced with practice exams.`;
    case "ce-course":
      return `${stateName} ${loaName} CE course online. Same-day DOI reporting, self-paced, state-approved. Renew your insurance license with JustInsurance. From $39.`;
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
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface PageMetadataParams {
  pageType: PageType;
  stateName?: string;
  stateSlug?: string;
  loaName?: string;
  loaSlug?: string;
  hours?: number;
  price?: string;
}

export function generatePageMetadata(params: PageMetadataParams): Metadata {
  const { pageType } = params;

  const title = buildTitle(pageType, params);
  const description = buildDescription(pageType, params);
  const canonicalPath = buildCanonicalPath(pageType, params);
  const canonicalUrl = buildCanonical(canonicalPath);

  // Extract the raw string for OG/Twitter (which don't accept { absolute })
  const titleString = title.absolute;

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
          url: OG_IMAGE,
          alt: "JustInsurance — Online Insurance License Courses",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleString,
      description,
      images: [OG_IMAGE],
    },
  };
}
