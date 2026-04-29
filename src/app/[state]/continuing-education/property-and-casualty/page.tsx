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
  PC_STATE_SLUGS,
  getPCPackagesForState,
  isPCMultiPackageState,
  type PCPackage,
} from "@/data/pc-ce-packages";
import ArticleByline from "@/components/ArticleByline";
import StateHero from "@/components/StateHero";
import CourseOverviewBox from "@/components/CourseOverviewBox";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedStatePages from "@/components/RelatedStatePages";

// ---------------------------------------------------------------------------
// Static params — only the 25 states with at least one P&C package
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return PC_STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  const packages = getPCPackagesForState(state);
  if (!stateData || packages.length === 0) return {};

  const isMulti = packages.length > 1;
  const totalHrsLabel = isMulti
    ? `${Math.min(...packages.map((p) => p.totalHours))}-${Math.max(
        ...packages.map((p) => p.totalHours)
      )} Hours`
    : `${packages[0].totalHours} Hours`;

  const title = isMulti
    ? `${stateData.name} P&C CE Packages — ${totalHrsLabel} | JustInsurance`
    : `${stateData.name} P&C CE Package — ${totalHrsLabel} | JustInsurance`;

  const description = isMulti
    ? `${packages.length} state-approved Property & Casualty CE packages for ${stateData.name} insurance producers. Hour ranges from ${totalHrsLabel}. Online, self-paced, same-day DOI reporting.`
    : `Complete your ${stateData.name} P&C continuing education in one package: ${packages[0].ethicsHours}-hour ${packages[0].ethicsLabel} + ${packages[0].pcHours}-hour P&C electives. Online, self-paced, same-day DOI reporting. ${packages[0].price}.`;

  const canonical = `https://justinsuranceco.com/${state}/continuing-education/property-and-casualty`;

  return {
    // .absolute prevents the root layout's "%s | JustInsurance" template from
    // double-appending the brand suffix (our title already includes it per spec).
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
// Shared FAQ generator — produces 7 P&C-specific Q&A using state-specific facts
// EXPORTED so the [package]/page.tsx route can reuse it.
// ---------------------------------------------------------------------------
export function buildPCFAQs(
  stateName: string,
  doiName: string,
  pkg: PCPackage,
  ceHours: number,
  ceRenewalPeriod: string,
  ceEthicsHours: number
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [
    {
      question: `How many CE hours do P&C agents in ${stateName} need each renewal cycle?`,
      answer: `${stateName} requires Property & Casualty insurance producers to complete ${pkg.totalHours} hours of continuing education every ${ceRenewalPeriod}, including ${pkg.ethicsHours} hours of ${pkg.ethicsLabel.toLowerCase()}. Our ${pkg.shortName} package satisfies this requirement in a single bundle. (For comparison, ${stateName} Life & Health agents need ${ceHours} hours every ${ceRenewalPeriod} with ${ceEthicsHours} ethics hours — a different requirement set.)`,
    },
    {
      question: `What's the difference between L&H CE and P&C CE in ${stateName}?`,
      answer: `Life & Health (L&H) CE covers life insurance, annuities, health insurance, Medicare, and long-term care topics. Property & Casualty (P&C) CE covers personal auto, homeowners, commercial property, general liability, workers' compensation, and similar coverages. The two CE tracks are tracked separately by the ${doiName} — completing L&H CE does NOT count toward your P&C requirement, and vice versa. Dual-licensed agents must complete CE for each line they hold.`,
    },
    {
      question: `Does this package include the ${stateName} ethics requirement?`,
      answer: `Yes. The ${pkg.shortName} package includes ${pkg.ethicsHours} hours of ${pkg.ethicsLabel} — the exact ethics module required by the ${doiName} for P&C CE renewal. You do not need to enroll in a separate ethics course.`,
    },
    {
      question: `How does CE reporting work?`,
      answer: `When you complete your final module, JustInsurance electronically reports your CE completion to the ${doiName} the same business day. Most states post the credit to your license record within 3-5 business days. There are no certificates to mail and no additional forms to submit on your end.`,
    },
    {
      question: `What happens if I miss my CE deadline?`,
      answer: `Missing your CE deadline can result in license suspension, late fees, and reinstatement requirements. ${stateName} typically requires you to complete all overdue CE plus any reinstatement penalties before your license is reactivated. We recommend completing your CE at least 30 days before your renewal date — the entire ${pkg.shortName} package can be finished in a single sitting if needed.`,
    },
    {
      question: `I hold both an L&H license and a P&C license. Do I need two separate CE packages?`,
      answer: `Yes. ${stateName} treats L&H CE and P&C CE as separate compliance tracks. You'll need to complete the full ${pkg.totalHours} hours of P&C CE for your P&C license AND the ${ceHours} hours of L&H CE for your L&H license each renewal cycle. JustInsurance offers both — you can bundle them at checkout.`,
    },
  ];

  // Add a 7th FAQ pulled from specialNotes when present, otherwise a generic
  // "what topics are covered" question.
  if (pkg.specialNotes.length > 0) {
    const note = pkg.specialNotes[0];
    faqs.push({
      question: `Does this package satisfy any state-specific P&C training requirements?`,
      answer: `${note} All other modules in the ${pkg.shortName} package are also state-approved by the ${doiName} for P&C CE credit.`,
    });
  } else {
    faqs.push({
      question: `What topics are covered in the P&C CE modules?`,
      answer: `The ${pkg.pcHours} hours of P&C electives cover personal lines (homeowners, personal auto, umbrella), commercial lines (commercial property, general liability, workers' compensation, commercial auto), claims handling, and risk management — all updated to reflect current ${stateName} insurance regulations and product trends.`,
    });
  }

  return faqs;
}

// ---------------------------------------------------------------------------
// Shared full-package detail renderer — used by single-package state hubs and
// by the [package]/page.tsx route. Exported so the package route can re-use it.
// ---------------------------------------------------------------------------
export function PCPackageDetail({
  stateData,
  pkg,
}: {
  stateData: NonNullable<ReturnType<typeof getStateBySlug>>;
  pkg: PCPackage;
}) {
  const { ce } = stateData;
  const providerLine = stateData.providerNumber
    ? `State-Approved ${stateData.doiName} CE Provider #${stateData.providerNumber}`
    : `State-Approved ${stateData.doiName} CE Provider`;

  return (
    <>
      {/* Urgency Banner */}
      <div className="bg-gold text-gray-dark py-2 px-4 text-center text-sm font-semibold">
        Don&apos;t let your P&amp;C license lapse — complete your CE before renewal.
      </div>

      <StateHero
        eyebrow={`${stateData.name} P&C CE`}
        title={`${stateData.name} Property & Casualty CE Package`}
        subtitle={`Complete your ${pkg.totalHours}-hour P&C CE requirement online: ${pkg.ethicsHours}-hr ${pkg.ethicsLabel} + ${pkg.pcHours}-hr P&C electives. Same-day reporting to the ${stateData.doiName}. ${pkg.price}.`}
        ctaButtons={[
          { text: `Enroll Now — ${pkg.price}`, href: pkg.cartLink },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline />
      </div>

      {/* Authority block — provider number */}
      <section className="bg-navy-dark border-t border-white/10 py-3 px-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <span className="inline-flex items-center gap-1.5 bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-semibold text-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {providerLine}
          </span>
        </div>
      </section>

      <CourseOverviewBox
        hours={pkg.totalHours}
        price={pkg.price}
        accessDuration="30 Days"
        includes={[
          `${pkg.ethicsHours}-hr ${pkg.ethicsLabel}`,
          `${pkg.pcHours}-hr P&C electives`,
          "Interactive online modules",
          "Module-end quizzes",
          "Same-day DOI reporting",
          "Instant certificate of completion",
          "Expert support",
        ]}
      />

      {/* Course breakdown table */}
      <section className="bg-white pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-bg rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-navy mb-4">Course Breakdown</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500">Ethics Hours</span>
                <span className="font-bold text-navy">
                  {pkg.ethicsHours} hrs ({pkg.ethicsLabel})
                </span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500">P&C Elective Hours</span>
                <span className="font-bold text-navy">{pkg.pcHours} hrs</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500">Total CE Hours</span>
                <span className="font-bold text-navy">{pkg.totalHours} hrs</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500">Course Format</span>
                <span className="font-bold text-navy">Online, Self-Paced</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-500">Course Access</span>
                <span className="font-bold text-navy">30 Days</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-500">Reporting</span>
                <span className="font-bold text-success">Same-Day to {stateData.doiAbbr || stateData.doiName}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Special Notes */}
      {pkg.specialNotes.length > 0 && (
        <section className="bg-white pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border-l-4 border-gold rounded-r-lg p-5">
              <h3 className="font-bold text-navy mb-3">Important Notes for {stateData.name} P&C Producers</h3>
              <ul className="space-y-2">
                {pkg.specialNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed">
                    <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* How CE Reporting Works — 5-step */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            How {stateData.name} P&amp;C CE Reporting Works
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            From course start to active license — five simple steps.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: "1",
                title: "Complete Modules",
                desc: `Work through ${pkg.totalHours} hours of state-approved P&C content at your own pace.`,
              },
              {
                step: "2",
                title: "Pass Module Quizzes",
                desc: `Each module ends with a short quiz to confirm comprehension and unlock your CE credit.`,
              },
              {
                step: "3",
                title: "We Report to the State",
                desc: `JustInsurance electronically files your completion with the ${stateData.doiName} the same business day.`,
              },
              {
                step: "4",
                title: "Verify Credits Posted",
                desc: `Most states show CE credits on your license record within 3-5 business days. Confirm via your state portal.`,
              },
              {
                step: "5",
                title: "Submit Renewal via NIPR",
                desc: `Complete your renewal application through NIPR or your state portal and pay the renewal fee.`,
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-bg rounded-xl p-5 text-center">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-dark font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="font-bold text-navy mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State CE Requirements (compares L&H vs this P&C package) */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            {stateData.name} CE Requirements at a Glance
          </h2>
          <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
            P&C and L&H CE are tracked separately. Here&apos;s how this package fits the {stateData.doiName}&apos;s requirements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <span className="inline-block bg-gold/20 text-gold-dark text-xs font-bold uppercase px-2 py-1 rounded">P&C</span>
                This Package
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Total CE Hours</span>
                  <span className="font-bold text-navy">{pkg.totalHours} hours</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Renewal Period</span>
                  <span className="font-bold text-navy">{ce.renewalPeriod}</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Ethics Module</span>
                  <span className="font-bold text-navy">{pkg.ethicsHours} hrs ({pkg.ethicsLabel})</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500">Package Price</span>
                  <span className="font-bold text-gold">{pkg.price}</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <span className="inline-block bg-navy/10 text-navy text-xs font-bold uppercase px-2 py-1 rounded">L&H</span>
                Separate Track
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Total CE Hours</span>
                  <span className="font-bold text-navy">{ce.totalHours} hours</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Renewal Period</span>
                  <span className="font-bold text-navy">{ce.renewalPeriod}</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-500">Ethics Required</span>
                  <span className="font-bold text-navy">{ce.ethicsHours} hours</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-500">More info</span>
                  <Link href={`/${stateData.slug}/continuing-education/`} className="font-semibold text-navy hover:text-gold transition-colors">
                    L&amp;H CE →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            Source: <a href={ce.requirementsUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">{stateData.doiName}</a>
          </p>
        </div>
      </section>

      {/* Internal-link cluster */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-navy mb-6">Related {stateData.name} Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href={`/${stateData.slug}/`} className="block bg-gray-bg hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg p-4 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold-dark mb-1">State Hub</p>
              <p className="font-semibold text-navy text-sm">{stateData.name} Insurance Licensing Hub</p>
            </Link>
            <Link href={`/${stateData.slug}/requirements/`} className="block bg-gray-bg hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg p-4 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold-dark mb-1">Requirements</p>
              <p className="font-semibold text-navy text-sm">{stateData.name} License Requirements</p>
            </Link>
            <Link href={`/${stateData.slug}/continuing-education/`} className="block bg-gray-bg hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg p-4 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold-dark mb-1">L&amp;H CE</p>
              <p className="font-semibold text-navy text-sm">{stateData.name} Life & Health CE</p>
            </Link>
            <Link href="/property-and-casualty-ce/" className="block bg-gray-bg hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg p-4 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold-dark mb-1">National</p>
              <p className="font-semibold text-navy text-sm">National P&C CE Hub (All States)</p>
            </Link>
            <Link href="/license-renewal/" className="block bg-gray-bg hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg p-4 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold-dark mb-1">Guide</p>
              <p className="font-semibold text-navy text-sm">License Renewal Guide</p>
            </Link>
            <Link href="/non-resident-license/" className="block bg-gray-bg hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg p-4 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold-dark mb-1">Multi-State</p>
              <p className="font-semibold text-navy text-sm">Non-Resident License Info</p>
            </Link>
          </div>
        </div>
      </section>

      <CTABanner
        title={`Renew Your ${stateData.name} P&C License Today`}
        subtitle={`Complete your ${pkg.totalHours}-hour P&C CE requirement online for ${pkg.price}. We report to the ${stateData.doiName} same-day.`}
        ctaText={`Enroll Now — ${pkg.price}`}
        ctaHref={pkg.cartLink}
        externalLink
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default async function PCStateHubPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  const packages = getPCPackagesForState(state);
  if (!stateData || packages.length === 0) notFound();

  const isMulti = isPCMultiPackageState(state);
  const canonicalUrl = `https://justinsuranceco.com/${state}/continuing-education/property-and-casualty`;

  // ----- Schemas (always emitted) -----
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
    {
      name: "Continuing Education",
      url: `https://justinsuranceco.com/${stateData.slug}/continuing-education`,
    },
    { name: "Property & Casualty", url: canonicalUrl },
  ]);

  // For FAQ schema: single-package states use the one package's FAQs.
  // Multi-package states use the first (Florida 20-Hour Advanced or MA 45-Hour) as a representative.
  const repPkg = packages[0];
  const faqs = buildPCFAQs(
    stateData.name,
    stateData.doiName,
    repPkg,
    stateData.ce.totalHours,
    stateData.ce.renewalPeriod,
    stateData.ce.ethicsHours
  );
  const faqSchema = generateFAQSchema(faqs);

  // Course schema — only emitted for single-package states (multi states use
  // per-package routes for Course schema instead, to avoid mixing prices).
  const courseSchema = !isMulti
    ? generateCourseSchema({
        stateName: stateData.name,
        stateSlug: stateData.slug,
        loaName: "Property & Casualty",
        loaSlug: "property-and-casualty",
        courseType: "continuing-education",
        hours: repPkg.totalHours,
        price: repPkg.price,
        description: `${stateData.name} Property & Casualty continuing education package — ${repPkg.totalHours} hours total (${repPkg.ethicsHours}-hr ${repPkg.ethicsLabel} + ${repPkg.pcHours}-hr P&C electives). Online, self-paced, same-day reporting to the ${stateData.doiName}. ${repPkg.price}.`,
      })
    : null;
  // Override the offers.url so it points at the Absorb cart link, satisfying
  // the requirement to make the cart link discoverable in structured data.
  if (courseSchema) {
    // Narrow type — generateCourseSchema returns object, we mutate offers.url.
    const cs = courseSchema as { offers: { url: string } };
    cs.offers.url = repPkg.cartLink;
  }

  const articleHeadline = isMulti
    ? `${stateData.name} Property & Casualty Continuing Education Packages`
    : `${stateData.name} Property & Casualty Continuing Education Package`;
  const articleDescription = isMulti
    ? `${packages.length} state-approved P&C CE packages for ${stateData.name} producers, ranging from ${Math.min(...packages.map((p) => p.totalHours))} to ${Math.max(...packages.map((p) => p.totalHours))} hours. Same-day reporting to the ${stateData.doiName}.`
    : `Complete your ${repPkg.totalHours}-hour ${stateData.name} P&C CE in one package. ${repPkg.ethicsHours}-hr ${repPkg.ethicsLabel} + ${repPkg.pcHours}-hr P&C electives. ${repPkg.price}.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-29",
    url: canonicalUrl,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}/` },
    { name: "Continuing Education", href: `/${stateData.slug}/continuing-education/` },
    { name: "Property & Casualty" },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      {courseSchema && <SchemaMarkup schema={courseSchema} />}
      <SchemaMarkup schema={articleSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* MULTI-PACKAGE LANDING (FL, MA) */}
      {isMulti ? (
        <>
          <StateHero
            eyebrow={`${stateData.name} P&C CE`}
            title={`${stateData.name} Property & Casualty CE Packages`}
            subtitle={`Choose the ${stateData.name} P&C CE package that matches your license type and renewal cycle. ${packages.length} state-approved options, all with same-day reporting to the ${stateData.doiName}.`}
            ctaButtons={[
              { text: "See Packages Below", href: "#packages" },
            ]}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <ArticleByline />
          </div>

          {/* Authority block */}
          <section className="bg-navy-dark border-t border-white/10 py-3 px-4">
            <div className="max-w-4xl mx-auto flex justify-center">
              <span className="inline-flex items-center gap-1.5 bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-semibold text-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {stateData.providerNumber
                  ? `State-Approved ${stateData.doiName} CE Provider #${stateData.providerNumber}`
                  : `State-Approved ${stateData.doiName} CE Provider`}
              </span>
            </div>
          </section>

          {/* Package cards */}
          <section id="packages" className="bg-white py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
                {stateData.name} P&amp;C CE Packages
              </h2>
              <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
                Pick the package that fits your license type and CE cycle. All packages include same-day DOI reporting.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {packages.map((p) => (
                  <Link
                    key={p.packageSlug}
                    href={`/${stateData.slug}/continuing-education/property-and-casualty/${p.packageSlug}/`}
                    className="block bg-gray-bg hover:bg-white border border-gray-200 hover:border-gold rounded-xl p-6 transition-all hover:shadow-md group"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gold-dark mb-2">
                      {p.totalHours}-Hour Package
                    </p>
                    <h3 className="font-bold text-navy text-lg mb-3 group-hover:text-gold-dark transition-colors leading-snug">
                      {p.shortName}
                    </h3>
                    <ul className="space-y-1.5 text-xs text-gray-600 mb-4">
                      <li>• {p.ethicsHours}-hr {p.ethicsLabel}</li>
                      <li>• {p.pcHours}-hr P&amp;C electives</li>
                      <li>• Same-day DOI reporting</li>
                    </ul>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-2xl font-bold text-gold">{p.price}</span>
                      <span className="text-xs font-semibold text-navy group-hover:text-gold-dark transition-colors">
                        View Package →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* State CE context */}
          <section className="bg-gray-bg py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-bold text-navy mb-4 text-center">
                {stateData.name} P&amp;C CE Context
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed text-center max-w-2xl mx-auto mb-6">
                {stateData.name} producers must complete CE every {stateData.ce.renewalPeriod}. P&amp;C and L&amp;H CE are tracked separately by the {stateData.doiName} — completing one does not satisfy the other.
              </p>
              <div className="text-center">
                <a
                  href={stateData.ce.requirementsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-navy hover:text-gold underline transition-colors"
                >
                  View {stateData.doiName} CE Requirements →
                </a>
              </div>
            </div>
          </section>
        </>
      ) : (
        // SINGLE-PACKAGE: render full detail
        <PCPackageDetail stateData={stateData} pkg={packages[0]} />
      )}

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} P&C CE FAQs`}
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
