import React from "react";
import { loaShortName } from "./loa";

const BASE_URL = "https://justinsuranceco.com";
const LOGO_URL = "https://justinsuranceco.com/justinsurance-logo.png";

// ---------------------------------------------------------------------------
// AggregateRating schema
// ---------------------------------------------------------------------------

export function generateAggregateRatingSchema(): object | null {
  // STRIPPED: AggregateRating schema removed until Google review count
  // reaches 25+. A 5.0 with 4 reviews looks thin in rich result snippets
  // and can hurt trust vs competitors with thousands of reviews.
  // Visual "5.0 on Google" badges remain on-page (HTML only, no schema).
  // Re-enable by returning the object below once ratingCount is credible:
  // return {
  //   "@type": "AggregateRating",
  //   "ratingValue": "5.0",
  //   "bestRating": "5",
  //   "worstRating": "1",
  //   "ratingCount": "XX",
  // };
  return null;
}

// ---------------------------------------------------------------------------
// Course schema
// ---------------------------------------------------------------------------

export function generateCourseSchema(params: {
  stateName: string;
  stateSlug: string;
  loaName: string;
  loaSlug: string;
  courseType: "prelicensing" | "continuing-education";
  /** Optional — emit time fields only when known. Avoids "PT0H" lies. */
  hours?: number;
  price: string;
  description: string;
}): object {
  const { stateName, stateSlug, loaName, loaSlug, courseType, hours, price, description } = params;
  const courseLabel =
    courseType === "prelicensing"
      ? "Prelicensing Course"
      : "Continuing Education Course";
  const pathSegment = courseType === "prelicensing" ? "prelicensing" : "continuing-education";
  const canonicalUrl = `${BASE_URL}/${stateSlug}/${pathSegment}/${loaSlug}`;
  const hasHours = typeof hours === "number" && hours > 0;
  const loaShort = loaShortName(loaName);
  const offer = {
    "@type": "Offer",
    price: price.replace(/[^0-9.]/g, ""),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: canonicalUrl,
    category: "Paid",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${stateName} ${loaName} ${courseLabel}`,
    description,
    image: LOGO_URL,
    provider: {
      "@type": "Organization",
      "@id": `${BASE_URL}#organization`,
      name: "JustInsurance LLC",
      url: BASE_URL,
      logo: LOGO_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      location: {
        "@type": "VirtualLocation",
        url: canonicalUrl,
      },
      instructor: {
        "@type": "Person",
        name: "Justin vom Eigen",
        jobTitle: "Licensed Insurance Agent, IDECC Certified Distance Education Instructor",
        url: `${BASE_URL}/about/justin-vom-eigen`,
      },
      ...(hasHours ? { courseWorkload: `PT${hours}H` } : {}),
      offers: offer,
    },
    offers: offer,
    educationalCredentialAwarded:
      courseType === "prelicensing"
        ? `${stateName} ${loaShort} Insurance Prelicensing Certificate`
        : `${stateName} ${loaShort} Insurance CE Certificate`,
    teaches: `${stateName} ${loaShort} insurance licensing requirements`,
    educationalLevel: "Beginner",
    coursePrerequisites: "None",
    // courseSchedule added 2026-06-12 per Semrush audit (773 invalid
    // structured-data items, 36 specifically missing this field). Reflects
    // our self-paced, always-available enrollment model with a 30-day
    // course access window matching the pass-guarantee terms.
    courseSchedule: {
      "@type": "Schedule",
      repeatFrequency: "P1D",
      duration: "PT30D",
    },
    ...(hasHours ? { timeRequired: `PT${hours}H` } : {}),
    inLanguage: "en-US",
    availableLanguage: "en",
    url: canonicalUrl,
  };
}

// ---------------------------------------------------------------------------
// State-hub Course schema (surfaces course rich results on /[state]/ pages)
// ---------------------------------------------------------------------------

export function generateStateHubCourseSchema(params: {
  stateName: string;
  stateSlug: string;
  price: string;
  hours?: number | string;
}): object {
  const { stateName, stateSlug, price, hours } = params;
  const hoursNum = typeof hours === "number" ? hours : undefined;
  const prelicensingUrl = `${BASE_URL}/${stateSlug}/prelicensing`;
  const offer = {
    "@type": "Offer",
    price: price.replace(/[^0-9.]/g, ""),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: prelicensingUrl,
    category: "Paid",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${stateName} Insurance Prelicensing Course — Life & Health`,
    description: `State-approved online insurance prelicensing course for ${stateName}. Pass your ${stateName} state licensing exam on the first attempt. 100% online, self-paced, includes practice exams and pass guarantee.`,
    image: LOGO_URL,
    provider: {
      "@type": "Organization",
      "@id": `${BASE_URL}#organization`,
      name: "JustInsurance LLC",
      url: BASE_URL,
      logo: LOGO_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      location: {
        "@type": "VirtualLocation",
        url: prelicensingUrl,
      },
      instructor: {
        "@type": "Person",
        name: "Justin vom Eigen",
        jobTitle: "Licensed Insurance Agent, IDECC Certified Distance Education Instructor",
        url: `${BASE_URL}/about/justin-vom-eigen`,
      },
      ...(hoursNum ? { courseWorkload: `PT${hoursNum}H` } : {}),
      offers: offer,
    },
    offers: offer,
    educationalCredentialAwarded: `${stateName} Insurance Prelicensing Certificate`,
    educationalLevel: "Beginner",
    coursePrerequisites: "None",
    // courseSchedule parity with generateCourseSchema — same self-paced
    // 30-day window. Added 2026-06-12 per Semrush audit.
    courseSchedule: {
      "@type": "Schedule",
      repeatFrequency: "P1D",
      duration: "PT30D",
    },
    ...(hoursNum ? { timeRequired: `PT${hoursNum}H` } : {}),
    inLanguage: "en-US",
    availableLanguage: "en",
    url: prelicensingUrl,
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList schema
// ---------------------------------------------------------------------------

export function generateBreadcrumbSchema(
  crumbs: { name: string; url: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// ---------------------------------------------------------------------------
// Organization schema
// ---------------------------------------------------------------------------

export function generateOrganizationSchema(): object {
  const rating = generateAggregateRatingSchema();
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${BASE_URL}#organization`,
    name: "JustInsurance LLC",
    alternateName: "Just Insurance",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 300,
      height: 97,
    },
    image: {
      "@type": "ImageObject",
      url: "https://justinsuranceco.com/justinsurance-logo-square-512.png",
      width: 512,
      height: 512,
    },
    telephone: "+1-754-223-9744",
    email: "support@justinsuranceco.com",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-754-223-9744",
      contactType: "customer service",
      email: "support@justinsuranceco.com",
      areaServed: "US",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "1806 N Flamingo Rd Ste 230",
      addressLocality: "Pembroke Pines",
      addressRegion: "FL",
      postalCode: "33028",
      addressCountry: "US",
    },
    foundingDate: "2018",
    // Only include aggregateRating when we have a credible review count.
    // generateAggregateRatingSchema() returns null until review volume >= 25.
    ...(rating ? { aggregateRating: rating } : {}),
    priceRange: "$$",
    areaServed: "US",
    sameAs: [
      "https://www.youtube.com/@InsuranceExam",
      "https://www.linkedin.com/in/justin-vom-eigen-04198714a/",
      "https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html",
    ],
    description:
      "JustInsurance LLC offers state-approved online insurance prelicensing and continuing education courses for life and health insurance agents nationwide.",
  };
}

// Product schema for prelicensing/CE LOA pages was REMOVED 2026-06-08.
// It duplicated the Course schema's entity, causing Google to demote it to
// "product snippets" (355 imp / pos 42.86 / 0.28% CTR over May 10 → June 6).
// Course is the correct primary type — offers/pricing already live inside
// the Course schema's hasCourseInstance.offers block.
// Practice-exam cards still carry their own inline Product schema (legitimate
// — practice exams aren't courses), generated directly in practice-exam/page.tsx.

// ---------------------------------------------------------------------------
// FAQPage schema
// ---------------------------------------------------------------------------

export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// Person schema (reviewer / author identity for E-E-A-T)
// ---------------------------------------------------------------------------

/**
 * Generate a Schema.org Person node for the article author / reviewer.
 *
 * Defaults match <ArticleByline /> so a bare `generatePersonSchema()` call
 * produces Justin's identity. `sameAs` may include external profile URLs
 * (YouTube channel, LinkedIn, etc.) to strengthen entity linking.
 */
export function generatePersonSchema(opts?: {
  name?: string;
  jobTitle?: string;
  url?: string;
  sameAs?: string[];
}): object {
  const {
    name = "Justin vom Eigen",
    jobTitle = "Licensed Insurance Agent",
    url = `${BASE_URL}/about/justin-vom-eigen`,
    sameAs,
  } = opts ?? {};

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    url,
    ...(sameAs && sameAs.length > 0 ? { sameAs } : {}),
  };
}

// ---------------------------------------------------------------------------
// Article schema with explicit author + reviewedBy (Person nodes)
// ---------------------------------------------------------------------------

/**
 * Build an Article schema in which both `author` and `reviewedBy` resolve to
 * the same Person (Justin by default). Publisher is emitted as a reference to
 * the existing Organization @id so the consumer page need not repeat the full
 * org block. `dateModified` is only emitted when the caller passes it — we do
 * NOT silently bump it to "today" because that produces SEO churn.
 */
export function generateArticleSchemaWithReviewer(params: {
  headline: string;
  description: string;
  /** ISO 8601 string, e.g. "2026-04-15" or "2026-04-15T12:00:00Z" */
  datePublished: string;
  /** Optional ISO 8601 string. Only emitted when explicitly provided. */
  dateModified?: string;
  /** Canonical URL of the article. */
  url?: string;
  /** Optional override for the author/reviewer Person. */
  person?: {
    name?: string;
    jobTitle?: string;
    url?: string;
  };
}): object {
  const {
    headline,
    description,
    datePublished,
    dateModified,
    url,
    person,
  } = params;

  const personName = person?.name ?? "Justin vom Eigen";
  const personJobTitle = person?.jobTitle ?? "Licensed Insurance Agent";
  const personUrl = person?.url ?? `${BASE_URL}/about/justin-vom-eigen`;

  const personNode = {
    "@type": "Person",
    name: personName,
    jobTitle: personJobTitle,
    url: personUrl,
  };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    ...(url ? { url, mainEntityOfPage: url } : {}),
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    author: personNode,
    reviewedBy: personNode,
    publisher: {
      "@id": `${BASE_URL}#organization`,
    },
  };
}

// ---------------------------------------------------------------------------
// SchemaMarkup React component
// Renders a JSON-LD <script> tag suitable for Next.js App Router server
// components. dangerouslySetInnerHTML is safe here because the data is
// serialised from trusted internal objects, not user input.
// ---------------------------------------------------------------------------

export function SchemaMarkup({
  schema,
}: {
  schema: object;
}): React.ReactElement {
  // Escape "</script>" and HTML-significant sequences so the JSON-LD payload
  // cannot accidentally close the surrounding <script> tag, which would
  // produce a JSON parse error and invalidate the structured data.
  const json = JSON.stringify(schema).replace(/<\//g, "<\\/");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
