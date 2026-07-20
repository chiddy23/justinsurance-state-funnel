import React from "react";
import Link from "next/link";
import type { StateData } from "@/lib/states";
import catalogLinks from "@/lib/catalog-links.json";
import { getCtaAttrs } from "@/lib/gtm-attrs";
import AddToCartLink from "@/components/AddToCartLink";
import {
  PC_STATE_SLUGS,
  getPCPackagesForState,
  isPCMultiPackageState,
} from "@/data/pc-ce-packages";

// States where the L/H/L&H CE Absorb catalog contains MULTIPLE packages per
// LOA (so the link is a picker, not a direct cart). For these states the
// L/H/L&H cards render "Choose a Package →" matching the P&C pattern, since
// "Enroll Now — $X" is misleading when the user still has to pick a package.
const MULTI_PACKAGE_LH_CE_STATES = new Set<string>(["florida", "massachusetts"]);

// Optional per-state price-display override for multi-package L/H/L&H states.
// Use when the multiple packages have DIFFERENT prices and a range is more
// accurate than a single number. FL omitted because both packages are $39.
const MULTI_PACKAGE_LH_CE_PRICE_OVERRIDE: Record<string, string> = {
  massachusetts: "$106.50 – $129",
};

function isOptionalHours(hours: number | string): boolean {
  if (typeof hours !== "string") return false;
  const lower = hours.toLowerCase();
  return lower.includes("none required") || lower.includes("not required");
}

function formatLoaHours(hours: number | string, completionTime?: string): string {
  const ct = completionTime ? completionTime.match(/\d+/) : null;
  if (isOptionalHours(hours)) {
    // Optional-prelicensing states: show the RECOMMENDED hours for THIS line
    // from completionTime (Life/Health 20, L&H 40) — not a hardcoded 40, which
    // overstates the single-line courses 2x.
    return ct ? `${ct[0]} (recommended)` : "40 (recommended)";
  }
  // Non-numeric marker like "no combined license" (Wisconsin): show the line's
  // completionTime hours (40 total) rather than printing the marker text.
  if (typeof hours === "string" && !/^\s*\d/.test(hours)) {
    return ct ? ct[0] : String(hours);
  }
  return String(hours);
}

type CatalogLinks = typeof catalogLinks;

interface LOASelectorProps {
  stateSlug: string;
  courseType: "prelicensing" | "continuing-education";
  stateData: StateData;
}

interface LOACardData {
  slug: string;
  name: string;
  description: string;
  hours: number | string;
  /** Per-line completionTime (e.g. "20 hours") — the recommended-hours source
   *  used when hours is optional/non-numeric so single lines aren't shown as 40. */
  completionTime?: string;
  hoursSubtext?: string;
  price: string;
  renewalYears?: number;
  pageHref: string;
  enrollHref: string;
}

export default function LOASelector({ stateSlug, courseType, stateData }: LOASelectorProps) {
  // Pending-approval states (providerApprovalNumber === "PENDING", currently NY
  // and WA) cannot claim "state-approved" hours or DOI reporting in the CE cards.
  const providerApproved = stateData.providerApprovalNumber !== "PENDING";
  const catalogKey = courseType === "continuing-education" ? "continuing-education" : "prelicensing";
  const stateCatalog = (catalogLinks as CatalogLinks)[stateSlug as keyof CatalogLinks];

  function getEnrollLink(loaKey: "life" | "health" | "life-and-health"): string {
    if (!stateCatalog) return "https://yourinsurancelicense.myabsorb.com/";
    const section = stateCatalog[catalogKey as keyof typeof stateCatalog] as Record<string, string>;
    return section?.[loaKey] ?? "https://yourinsurancelicense.myabsorb.com/";
  }

  const cards: LOACardData[] =
    courseType === "prelicensing"
      ? [
          {
            slug: "life",
            name: "Life Insurance",
            description: "Sell term life, whole life, universal life, and annuity products. The essential license for any agent working in life insurance or financial services.",
            hours: stateData.prelicensing.life.hours,
            completionTime: stateData.prelicensing.life.completionTime,
            price: stateData.prelicensing.life.price,
            pageHref: `/${stateSlug}/prelicensing/life`,
            enrollHref: getEnrollLink("life"),
          },
          {
            slug: "health",
            name: "Health Insurance",
            description: "Sell major medical, Medicare supplement, disability income, long-term care, and other health products. Essential for agents focused on health and Medicare markets.",
            hours: stateData.prelicensing.health.hours,
            completionTime: stateData.prelicensing.health.completionTime,
            price: stateData.prelicensing.health.price,
            pageHref: `/${stateSlug}/prelicensing/health`,
            enrollHref: getEnrollLink("health"),
          },
          {
            slug: "life-and-health",
            name: "Life & Health Insurance",
            // Illinois certifies Life and Accident & Health as SEPARATE lines
            // (215 ILCS 5/500-30(b)) — the L&H package is two separate courses
            // + two separate exams, never "a single combined course and exam."
            // Gated on classroomWebinarHours (IL) so other states are unchanged.
            description: stateData.classroomWebinarHours
              ? "The most popular choice — get licensed to sell both life and health products. In Illinois this package is two separately state-certified courses (a 20-hour Life course + a 20-hour Health course) bundled at one price, with separate Life and Health state exams."
              : stateData.noCombinedExam
              ? "The most popular choice — get licensed to sell both life and health products. This state has no combined Life & Health exam, so the package is two separate courses with two separate state exams. Maximize your earning potential from day one."
              : "The most popular choice — get licensed to sell both life and health products with a single combined course and exam. Maximize your earning potential from day one.",
            hours: stateData.prelicensing.lifeAndHealth.hours,
            completionTime: stateData.prelicensing.lifeAndHealth.completionTime,
            hoursSubtext:
              stateData.classroomWebinarHours &&
              Number(stateData.prelicensing.lifeAndHealth.hours) === 40
                ? "20h Life + 20h Health = 40 total · 15h live webinar + 25h self-study"
                : undefined,
            price: stateData.prelicensing.lifeAndHealth.price,
            pageHref: `/${stateSlug}/prelicensing/life-and-health`,
            enrollHref: getEnrollLink("life-and-health"),
          },
        ]
      : [
          {
            slug: "life",
            name: "Life Insurance CE",
            description: `Complete your life insurance continuing education requirements online. ${providerApproved ? "State-approved hours" : "Hours"} that keep your life license active and compliant.`,
            hours: stateData.ce.totalHours,
            price: stateData.ce.packagePrice,
            renewalYears: undefined,
            pageHref: `/${stateSlug}/continuing-education/life`,
            enrollHref: getEnrollLink("life"),
          },
          {
            slug: "health",
            name: "Health Insurance CE",
            description: `Complete your health insurance CE requirements online. Covers all required topics including ethics.${providerApproved ? " Same-day reporting to your state DOI in most cases." : ""}`,
            hours: stateData.ce.totalHours,
            price: stateData.ce.packagePrice,
            renewalYears: undefined,
            pageHref: `/${stateSlug}/continuing-education/health`,
            enrollHref: getEnrollLink("health"),
          },
          {
            slug: "life-and-health",
            name: "Life & Health CE",
            description: "Fulfill the CE requirements for both your life and health licenses in one package. The most efficient way to renew your combined license.",
            hours: stateData.ce.totalHours,
            price: stateData.ce.packagePrice,
            renewalYears: undefined,
            pageHref: `/${stateSlug}/continuing-education/life-and-health`,
            enrollHref: getEnrollLink("life-and-health"),
          },
        ];

  // Append P&C CE card when state has P&C packages. P&C is a separate line
  // of authority from L&H (different state DOI bucket, different curriculum,
  // different cycle in some states), so it belongs in the LOA selector for
  // dual-licensed producers. For multi-package states (FL, MA), card shows
  // the common totalHours value and links to the multi-package landing.
  if (
    courseType === "continuing-education" &&
    PC_STATE_SLUGS.includes(stateSlug)
  ) {
    const pcPackages = getPCPackagesForState(stateSlug);
    const isMulti = isPCMultiPackageState(stateSlug);
    // Determine display hours — if all packages share the same totalHours,
    // show that; otherwise show a range (min–max).
    const hoursValues = pcPackages.map((p) => p.totalHours);
    const minH = Math.min(...hoursValues);
    const maxH = Math.max(...hoursValues);
    const hoursDisplay = minH === maxH ? minH : `${minH}–${maxH}`;
    cards.push({
      slug: "property-and-casualty",
      name: "Property & Casualty CE",
      description: isMulti
        ? `${pcPackages.length} state-approved P&C packages — auto, homeowners, commercial, flood. ${stateData.name} producers writing P&C alongside L&H need both CE buckets to renew.`
        : `Complete your P&C continuing education online. ${stateData.name}-approved hours covering personal auto, homeowners, commercial property, GL, and workers' compensation.`,
      hours: hoursDisplay,
      price: pcPackages[0].price,
      renewalYears: undefined,
      pageHref: `/${stateSlug}/continuing-education/property-and-casualty`,
      // For multi-package states, send to the landing page (visitor picks
      // their specific package); for single-package states, link directly
      // to the cart.
      enrollHref: isMulti
        ? `/${stateSlug}/continuing-education/property-and-casualty`
        : pcPackages[0].cartLink,
    });
  }

  return (
    <section className="bg-gray-bg py-16 px-4">
      <div className={`mx-auto ${cards.length === 4 ? "max-w-7xl" : "max-w-5xl"}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
          Choose Your Line of Authority
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          {courseType === "prelicensing"
            ? "Select the license type that matches your career goals. Not sure? Most agents choose Life & Health."
            : "Select the course that matches your current license type."}
        </p>

        <div
          className={`grid grid-cols-1 ${
            cards.length === 4
              ? "md:grid-cols-2 lg:grid-cols-4 gap-5"
              : "md:grid-cols-3 gap-6"
          }`}
        >
          {cards.map((card, idx) => {
            // Detect L/H/L&H CE cards in multi-package states (FL, MA).
            // These point to an Absorb catalog with multiple packages, so
            // the user has to pick before adding to cart — render the same
            // "Choose a Package" affordance the P&C card uses, even though
            // the link is external.
            const isLHCard =
              courseType === "continuing-education" &&
              (card.slug === "life" || card.slug === "health" || card.slug === "life-and-health");
            const isMultiPackageLH = isLHCard && MULTI_PACKAGE_LH_CE_STATES.has(stateSlug);
            const displayPrice = isMultiPackageLH
              ? (MULTI_PACKAGE_LH_CE_PRICE_OVERRIDE[stateSlug] ?? card.price)
              : card.price;
            return (
            <div
              key={card.slug}
              className={`bg-white rounded-xl shadow-md border-2 ${
                cards.length === 4 ? "p-5" : "p-6"
              } flex flex-col hover:shadow-xl transition-shadow ${
                idx === 2 ? "border-gold" : "border-transparent"
              }`}
            >
              {idx === 2 && (
                <div className="bg-gold text-gray-dark text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full self-start mb-3">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold text-navy mb-2">{card.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{card.description}</p>

              <div className="border-t border-gray-100 pt-4 mb-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Hours Required</span>
                  <span className="text-navy font-bold">{formatLoaHours(card.hours, card.completionTime)} hrs</span>
                </div>
                {card.hoursSubtext && (
                  <p className="text-gray-500 text-xs leading-snug">{card.hoursSubtext}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Course Price</span>
                  <span className="text-navy font-bold">{displayPrice}</span>
                </div>
                {courseType === "continuing-education" && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Renewal Cycle</span>
                    <span className="text-navy font-bold">{stateData.ce.renewalPeriod}</span>
                  </div>
                )}
              </div>

              <Link
                href={card.pageHref}
                {...getCtaAttrs({ href: card.pageHref, location: "loa-card-learn-more", state: stateSlug, loa: card.slug })}
                className="block text-center text-navy border border-navy hover:bg-navy hover:text-white font-medium py-2 px-4 rounded-lg transition-colors mb-2 text-sm"
              >
                {card.name} Details
              </Link>
              {card.enrollHref.startsWith("/") ? (
                // Internal link (multi-package landing) — no new tab, "Choose"
                // label since the user is selecting a package, not paying yet.
                <Link
                  href={card.enrollHref}
                  {...getCtaAttrs({ href: card.enrollHref, location: "loa-card", state: stateSlug, loa: card.slug })}
                  className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Choose a Package &rarr;
                </Link>
              ) : isMultiPackageLH ? (
                // External Absorb catalog containing multiple L/H/L&H packages
                // (FL, MA). User still needs to pick a package, so use the
                // same "Choose" affordance instead of "Enroll Now — $price".
                <a
                  href={card.enrollHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...getCtaAttrs({ href: card.enrollHref, location: "loa-card", state: stateSlug, loa: card.slug })}
                  className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Choose a Package &rarr;
                </a>
              ) : (
                // External cart link (single-package) — open in new tab,
                // "Enroll Now" label with price. AddToCartLink fires the GA4
                // add_to_cart dataLayer event (courseId + price + state/loa)
                // and preserves the existing data-gtm-* attributes.
                <AddToCartLink
                  href={card.enrollHref}
                  price={card.price}
                  state={stateSlug}
                  loa={card.slug}
                  courseType={courseType}
                  itemName={`${stateData.name} ${card.name}`}
                  gtmAttrs={getCtaAttrs({ href: card.enrollHref, location: "loa-card", state: stateSlug, loa: card.slug })}
                  className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Enroll Now &mdash; {card.price}
                </AddToCartLink>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
