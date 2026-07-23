import catalogLinks from "@/lib/catalog-links.json";
import { getCtaAttrs } from "@/lib/gtm-attrs";

// Cross-link tile to the à-la-carte "individual courses" Absorb catalog
// category. The package/LOA cards on CE pages link to the PACKAGE catalog;
// this tile links to the INDIVIDUAL course category (a distinct per-state
// catalog in Absorb). Per the catalog owner, individual courses for BOTH
// L&H and P&C live in the same per-state "individual" category, so this one
// component + URL serves every CE page type.
//
// Rendered as a standalone tile (never inside the LOA card grid) so it can
// drop onto any CE page — hub, LOA detail, P&C hub, P&C package — without
// touching that page's card-count layout. Added 2026-06-13.

interface CEIndividualCoursesTileProps {
  stateSlug: string;
  stateName: string;
  doiName: string;
  /** Tailwind classes for the wrapping <section>. Lets each page match its
   *  surrounding background (gray vs white) and spacing. */
  sectionClassName?: string;
  /** Pending-approval states (NY, WA) cannot claim DOI reporting yet; drops the
   *  "same-day reporting" line. Defaults true (approved states unchanged). */
  providerApproved?: boolean;
}

export default function CEIndividualCoursesTile({
  stateSlug,
  stateName,
  doiName,
  sectionClassName = "bg-gray-bg px-4 pb-16",
  providerApproved = true,
}: CEIndividualCoursesTileProps) {
  const ceCatalog = (
    catalogLinks as Record<string, { "continuing-education"?: Record<string, string> }>
  )[stateSlug]?.["continuing-education"];
  const individualCoursesUrl =
    ceCatalog?.individual ??
    ceCatalog?.category ??
    "https://yourinsurancelicense.myabsorb.com/";

  // Pending-approval states (NY, WA): CE is not purchasable yet, so this tile
  // must NOT link to the Absorb individual-courses catalog. Render a neutral,
  // non-purchase informational card instead. Approved states (and any caller
  // that omits providerApproved) render the linked tile exactly as before.
  if (!providerApproved) {
    return (
      <section className={sectionClassName}>
        <div className="max-w-5xl mx-auto">
          <div className="block bg-white border-l-4 border-navy rounded-r-xl p-5 shadow-sm">
            <p className="text-gold-deep font-semibold uppercase tracking-wide text-xs mb-1">
              Need just one topic?
            </p>
            <p className="text-navy font-bold text-base md:text-lg">
              Individual {stateName} CE courses are opening soon
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Opening soon — our {stateName} CE provider approval is pending with
              the {doiName}. À-la-carte {stateName} CE courses will be available to
              purchase as soon as approval is issued.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionClassName}>
      <div className="max-w-5xl mx-auto">
        <a
          href={individualCoursesUrl}
          target="_blank"
          rel="noopener noreferrer"
          {...getCtaAttrs({
            href: individualCoursesUrl,
            location: "ce-individual-catalog",
            state: stateSlug,
            loa: "individual",
          })}
          className="block bg-white border-l-4 border-navy rounded-r-xl p-5 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all group"
        >
          <p className="text-gold-deep font-semibold uppercase tracking-wide text-xs mb-1">
            Need just one topic?
          </p>
          <p className="text-navy font-bold text-base md:text-lg group-hover:underline">
            Browse all individual {stateName} CE courses in our catalog &rarr;
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Prefer to build your own hours? Pick à-la-carte CE courses to fill a
            specific gap or top off your remaining {stateName} hours
            {providerApproved ? (
              <>
                {" "}
                — with typically same-day {doiName} reporting.
              </>
            ) : (
              "."
            )}
          </p>
        </a>
      </div>
    </section>
  );
}
