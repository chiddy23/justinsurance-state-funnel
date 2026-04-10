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
  let title: string;
  switch (pageType) {
    case "home":
      title = `Online Insurance License Courses | $199 | ${brand}`;
      break;
    case "state-hub":
      title = `${stateName} Insurance License | $199 | ${brand}`;
      break;
    case "prelicensing-hub":
      title = `${stateName} Insurance Prelicensing | $199 | ${brand}`;
      break;
    case "ce-hub":
      title = `${stateName} Insurance CE Courses | $39 | ${brand}`;
      break;
    case "prelicensing-course":
      title = `${stateName} ${loaName} Prelicensing | $199 | ${brand}`;
      break;
    case "ce-course":
      title = `${stateName} ${loaName} CE Course | $39 | ${brand}`;
      break;
  }

  // Trim if over 61 chars: drop price to fit
  if (title.length > 61) {
    switch (pageType) {
      case "state-hub":
        title = `${stateName} Insurance License Online | ${brand}`;
        break;
      case "prelicensing-hub":
        title = `${stateName} Prelicensing Courses | ${brand}`;
        break;
      case "ce-hub":
        title = `${stateName} CE Courses | $39 | ${brand}`;
        break;
      case "prelicensing-course":
        title = `${stateName} ${loaName} Prelicensing | ${brand}`;
        break;
      case "ce-course":
        title = `${stateName} ${loaName} CE Course | ${brand}`;
        break;
      default:
        break;
    }
  }

  return { absolute: title };
}

function buildDescription(
  pageType: PageType,
  params: PageMetadataParams
): string {
  // All descriptions target ≤ 160 characters.
  const { stateName = "", loaName = "" } = params;

  switch (pageType) {
    case "home":
      return "Get your insurance license online. $199 prelicensing, $39 CE in 50 states. Pass guarantee, same-day reporting. Enroll now.";
    case "state-hub":
      return `Get your ${stateName} insurance license online. $199 prelicensing, $39 CE. Pass guarantee, same-day DOI reporting. Enroll today.`;
    case "prelicensing-hub":
      return `${stateName} insurance prelicensing online. $199, state-approved, pass guarantee included. Life, health, and combined courses. Enroll now.`;
    case "ce-hub":
      return `${stateName} insurance CE courses online. $39, same-day DOI reporting. Renew your license fast with JustInsurance.`;
    case "prelicensing-course":
      return `${stateName} ${loaName} prelicensing course. $199, state-approved, pass guarantee. Practice exams included. Enroll with JustInsurance.`;
    case "ce-course":
      return `${stateName} ${loaName} CE course. $39, same-day DOI reporting, self-paced online. Renew with JustInsurance today.`;
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
