import type { Metadata } from "next";

const BASE_URL = "https://justinsuranceco.com";
const LOGO_URL =
  "https://justinsuranceco.com/wp-content/uploads/2024/03/logo-300x97.png";

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

function buildTitle(pageType: PageType, params: PageMetadataParams): string {
  // NOTE: Root layout uses template "%s | JustInsurance", so do NOT append the brand suffix here
  const { stateName = "", loaName = "" } = params;

  switch (pageType) {
    case "home":
      return "Insurance License Courses";
    case "state-hub":
      return `${stateName} Insurance License Courses`;
    case "prelicensing-hub":
      return `${stateName} Insurance Prelicensing`;
    case "ce-hub":
      return `${stateName} Insurance CE Courses`;
    case "prelicensing-course":
      return `${stateName} ${loaName} Prelicensing`;
    case "ce-course":
      return `${stateName} ${loaName} CE Course`;
  }
}

function buildDescription(
  pageType: PageType,
  params: PageMetadataParams
): string {
  const { stateName = "", loaName = "", hours, price } = params;
  const hoursStr = hours ? `${hours}-hour` : "";
  const priceStr = price ? ` Starting at ${price}.` : "";

  switch (pageType) {
    case "home":
      return (
        "Get your insurance license online with JustInsurance. State-approved prelicensing and CE courses for life and health agents in all 50 states. Enroll today."
      );
    case "state-hub":
      return (
        `Get your ${stateName} insurance license online. State-approved prelicensing courses and CE packages for life and health agents. Enroll with JustInsurance today.`
      );
    case "prelicensing-hub":
      return (
        `Complete your ${stateName} insurance prelicensing online. State-approved courses for life, health, and life & health licenses. Pass guarantee included. Enroll now.`
      );
    case "ce-hub":
      return (
        `Renew your ${stateName} insurance license with state-approved CE courses. Life and health continuing education packages available online. Enroll with JustInsurance.`
      );
    case "prelicensing-course":
      return (
        `Complete your ${stateName} ${loaName} prelicensing online. ${hoursStr ? `${hoursStr} state-approved course, ` : "State-approved course, "}practice exams, pass guarantee.${priceStr} Enroll today.`
      );
    case "ce-course":
      return (
        `Renew your ${stateName} ${loaName} insurance license with state-approved CE. Online, self-paced course with instant certificate.${priceStr} Enroll with JustInsurance today.`
      );
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

  return {
    title,
    description,
    robots: "index, follow",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "JustInsurance",
      type: "website",
      images: [
        {
          url: LOGO_URL,
          width: 300,
          height: 97,
          alt: "JustInsurance LLC",
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [LOGO_URL],
    },
  };
}
