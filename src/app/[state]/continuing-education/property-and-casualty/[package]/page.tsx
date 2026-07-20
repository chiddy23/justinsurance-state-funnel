import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import {
  generateArticleSchemaWithReviewer,
  generateBreadcrumbSchema,
  generateCourseSchema,
  generateFAQSchema,
  SchemaMarkup,
} from "@/lib/schema";
import {
  PC_CE_PACKAGES,
  getPCPackageBySlugs,
  getPCPackagesForState,
  isPCMultiPackageState,
} from "@/data/pc-ce-packages";
import FAQAccordion from "@/components/FAQAccordion";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedStatePages from "@/components/RelatedStatePages";
import CEIndividualCoursesTile from "@/components/CEIndividualCoursesTile";
// Re-use the package detail renderer + FAQ builder defined in the parent route
// file. Next.js only consumes `default`, `generateMetadata`, and
// `generateStaticParams` from page.tsx — extra exports are inert and safe.
import { PCPackageDetail, buildPCFAQs } from "../page";

// ---------------------------------------------------------------------------
// Static params — only the 8 multi-package combinations (FL ×6, MA ×2)
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return PC_CE_PACKAGES.filter(
    (p) => isPCMultiPackageState(p.stateSlug) && p.packageSlug
  ).map((p) => ({ state: p.stateSlug, package: p.packageSlug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; package: string }>;
}): Promise<Metadata> {
  const { state, package: packageSlug } = await params;
  const stateData = getStateBySlug(state);
  const pkg = getPCPackageBySlugs(state, packageSlug);
  if (!stateData || !pkg) return {};

  const canonical = `https://justinsuranceco.com/${state}/continuing-education/property-and-casualty/${packageSlug}`;
  const title = `${pkg.shortName} | JustInsurance`;
  const description = `${pkg.totalHours}-hour ${stateData.name} Property & Casualty CE package: ${pkg.ethicsHours}-hr ${pkg.ethicsLabel} + ${pkg.pcHours}-hr P&C electives. Online, self-paced, same-day reporting to the ${stateData.doiName} in most cases. ${pkg.price}.`;

  return {
    // .absolute prevents root layout's "%s | JustInsurance" template from
    // double-appending the brand suffix.
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function PCPackagePage({
  params,
}: {
  params: Promise<{ state: string; package: string }>;
}) {
  const { state, package: packageSlug } = await params;
  const stateData = getStateBySlug(state);
  const pkg = getPCPackageBySlugs(state, packageSlug);
  if (!stateData || !pkg) notFound();

  const canonicalUrl = `https://justinsuranceco.com/${state}/continuing-education/property-and-casualty/${packageSlug}`;

  // Sibling FL/MA packages for lateral cross-link cluster
  const siblings = getPCPackagesForState(state).filter(
    (p) => p.packageSlug !== packageSlug
  );

  // ----- Schemas -----
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
    {
      name: "Continuing Education",
      url: `https://justinsuranceco.com/${stateData.slug}/continuing-education`,
    },
    {
      name: "Property & Casualty",
      url: `https://justinsuranceco.com/${stateData.slug}/continuing-education/property-and-casualty`,
    },
    { name: pkg.shortName, url: canonicalUrl },
  ]);

  const faqs = buildPCFAQs(
    stateData.name,
    stateData.doiName,
    pkg,
    stateData.ce.totalHours,
    stateData.ce.renewalPeriod,
    stateData.ce.ethicsHours
  );
  const faqSchema = generateFAQSchema(faqs);

  const courseSchema = generateCourseSchema({
    stateName: stateData.name,
    stateSlug: stateData.slug,
    loaName: "Property & Casualty",
    loaSlug: `property-and-casualty/${packageSlug}`,
    courseType: "continuing-education",
    hours: pkg.totalHours,
    price: pkg.price,
    description: `${pkg.packageName}. Online, self-paced, same-day reporting to the ${stateData.doiName} in most cases. ${pkg.price}.`,
  });
  // Override offers.url to the actual Absorb cart link.
  (courseSchema as { offers: { url: string } }).offers.url = pkg.cartLink;

  const articleSchema = generateArticleSchemaWithReviewer({
    headline: pkg.packageName,
    description: `${pkg.totalHours}-hour ${stateData.name} Property & Casualty CE package: ${pkg.ethicsHours}-hr ${pkg.ethicsLabel} + ${pkg.pcHours}-hr P&C electives.`,
    datePublished: "2026-04-29",
    url: canonicalUrl,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}` },
    { name: "Continuing Education", href: `/${stateData.slug}/continuing-education` },
    {
      name: "Property & Casualty",
      href: `/${stateData.slug}/continuing-education/property-and-casualty`,
    },
    { name: pkg.shortName },
  ];

  return (
    <>
      <SchemaMarkup schema={courseSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      <PCPackageDetail stateData={stateData} pkg={pkg} />

      {/* Lateral cross-links to other packages in same state (FL has 5 others, MA has 1) */}
      {siblings.length > 0 && (
        <section className="bg-gray-bg py-12 px-4 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">
              Other {stateData.name} P&amp;C CE Packages
            </h2>
            <p className="text-gray-600 text-sm mb-6 max-w-2xl">
              Looking for a different {stateData.name} P&amp;C CE option? Compare the full lineup.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {siblings.map((s) => (
                <Link
                  key={s.packageSlug}
                  href={`/${stateData.slug}/continuing-education/property-and-casualty/${s.packageSlug}`}
                  className="block bg-white hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg p-4 transition-colors group"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gold-deep mb-1">
                    {s.totalHours}-Hour Package
                  </p>
                  <h3 className="font-semibold text-navy text-sm mb-1 group-hover:text-gold-deep transition-colors leading-snug">
                    {s.shortName}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {s.ethicsHours}-hr {s.ethicsLabel} + {s.pcHours}-hr P&amp;C • {s.price}
                  </p>
                </Link>
              ))}
              <Link
                href={`/${stateData.slug}/continuing-education/property-and-casualty`}
                className="block bg-navy hover:bg-navy-dark text-white border border-navy rounded-lg p-4 transition-colors"
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-gold mb-1">All Packages</p>
                <h3 className="font-semibold text-sm mb-1 leading-snug">
                  See All {stateData.name} P&amp;C CE Packages
                </h3>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Compare hours, ethics modules, and pricing across the full {stateData.name} P&amp;C lineup.
                </p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Individual-courses catalog tile — same à-la-carte category as all
          other CE pages. */}
      <CEIndividualCoursesTile
        stateSlug={stateData.slug}
        stateName={stateData.name}
        doiName={stateData.doiName}
      />

      <FAQAccordion
        faqs={faqs}
        heading={`${pkg.shortName} FAQs`}
      />

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="ce-hub"
        variant="gray"
      />
    </>
  );
}
