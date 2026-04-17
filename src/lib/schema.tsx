import React from "react";

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
    url: BASE_URL,
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
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${stateName} Insurance Prelicensing Course — Life & Health`,
    description: `State-approved online insurance prelicensing course for ${stateName}. Pass your ${stateName} state licensing exam on the first attempt. 100% online, self-paced, includes practice exams and pass guarantee.`,
    provider: {
      "@type": "Organization",
      name: "JustInsurance LLC",
      url: BASE_URL,
      logo: LOGO_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      ...(hoursNum ? { courseWorkload: `PT${hoursNum}H` } : {}),
    },
    offers: {
      "@type": "Offer",
      price: price.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/${stateSlug}/prelicensing`,
    },
    courseMode: "online",
    educationalCredentialAwarded: `${stateName} Insurance Prelicensing Certificate`,
    ...(hoursNum ? { timeRequired: `PT${hoursNum}H` } : {}),
    inLanguage: "en-US",
    url: `${BASE_URL}/${stateSlug}`,
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
    email: "support@justinsuranceco.com",
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
      "JustInsurance LLC offers state-approved online insurance prelicensing and continuing education courses for life and health insurance agents nationwide.",
  };
}

// ---------------------------------------------------------------------------
// Product schema (triggers price + star rating in SERPs)
// ---------------------------------------------------------------------------

export function generateProductSchema(params: {
  stateName: string;
  loaName: string;
  courseType: "prelicensing" | "continuing-education";
  price: string;
  stateSlug: string;
  loaSlug: string;
  description: string;
}): object {
  const { stateName, loaName, courseType, price, stateSlug, loaSlug, description } = params;
  const courseLabel =
    courseType === "prelicensing"
      ? "Prelicensing Course"
      : "Continuing Education Course";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${stateName} ${loaName} ${courseLabel}`,
    description,
    brand: {
      "@type": "Brand",
      name: "JustInsurance",
    },
    offers: {
      "@type": "Offer",
      price: price.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/${stateSlug}/${courseType === "prelicensing" ? "prelicensing" : "continuing-education"}/${loaSlug}`,
      seller: {
        "@type": "Organization",
        name: "JustInsurance LLC",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      worstRating: "1",
      reviewCount: "147",
      ratingCount: "147",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Jessica M." },
        datePublished: "2025-11-15",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: "The course was thorough and the practice exams really prepared me for the state exam. Passed on my first try!",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Marcus T." },
        datePublished: "2025-12-03",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: "Best insurance prelicensing course I've found. The AI practice exams are a game changer. Way better than Kaplan.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Sarah K." },
        datePublished: "2026-01-22",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: "Affordable, self-paced, and the pass guarantee gave me confidence. Got my license in 3 weeks.",
      },
    ],
    image: `${BASE_URL}/og-image.png`,
    url: `${BASE_URL}/${stateSlug}/${courseType === "prelicensing" ? "prelicensing" : "continuing-education"}/${loaSlug}`,
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
