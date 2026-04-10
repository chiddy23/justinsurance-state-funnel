import React from "react";

const BASE_URL = "https://justinsuranceco.com";
const LOGO_URL = "https://justinsuranceco.com/justinsurance-logo.png";

// ---------------------------------------------------------------------------
// AggregateRating schema
// ---------------------------------------------------------------------------

export function generateAggregateRatingSchema(): object {
  return {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "bestRating": "5",
    "ratingCount": "30000",
    "reviewCount": "30000",
  };
}

// ---------------------------------------------------------------------------
// Course schema
// ---------------------------------------------------------------------------

export function generateCourseSchema(params: {
  stateName: string;
  loaName: string;
  courseType: "prelicensing" | "continuing-education";
  hours: number;
  price: string;
  description: string;
}): object {
  const { stateName, loaName, courseType, hours, price, description } = params;
  const courseLabel =
    courseType === "prelicensing"
      ? "Prelicensing Course"
      : "Continuing Education Course";

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${stateName} ${loaName} ${courseLabel}`,
    description,
    provider: {
      "@type": "Organization",
      name: "JustInsurance LLC",
      url: BASE_URL,
      logo: LOGO_URL,
    },
    aggregateRating: generateAggregateRatingSchema(),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${hours}H`,
    },
    offers: {
      "@type": "Offer",
      price: price.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    courseMode: "online",
    educationalCredentialAwarded:
      courseType === "prelicensing"
        ? `${stateName} ${loaName} Insurance Prelicensing Certificate`
        : `${stateName} ${loaName} Insurance CE Certificate`,
    teaches: `${stateName} ${loaName} insurance licensing requirements`,
    timeRequired: `PT${hours}H`,
    inLanguage: "en-US",
    isAccessibleForFree: false,
    url: BASE_URL,
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
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    name: "JustInsurance LLC",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 300,
      height: 97,
    },
    telephone: "754-223-9744",
    email: "support@yourinsurancelicense.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1806 N Flamingo Rd Ste 230",
      addressLocality: "Pembroke Pines",
      addressRegion: "FL",
      postalCode: "33028",
      addressCountry: "US",
    },
    foundingDate: "2017",
    aggregateRating: generateAggregateRatingSchema(),
    priceRange: "$$",
    areaServed: "US",
    sameAs: [BASE_URL],
    description:
      "JustInsurance LLC offers state-approved online insurance prelicensing and continuing education courses for life and health insurance agents across all 50 states.",
  };
}

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
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
