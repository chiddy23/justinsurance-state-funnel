import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";
import { ALL_TESTIMONIALS, type Testimonial } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: { absolute: "JustInsurance Student Reviews & Testimonials" },
  description:
    "Real reviews from JustInsurance students who passed their state insurance licensing exam. 4.9-star rating, 30,000+ agents licensed across 50 states.",
  alternates: { canonical: "https://justinsuranceco.com/reviews" },
};

const REVIEWS = ALL_TESTIMONIALS;

function sourceLabel(t: Testimonial): string {
  if (t.source === "youtube") return "via YouTube comment";
  if (t.source === "ce-renewal") return t.licenseType ? `CE Renewal · ${t.state ?? ""}`.trim() : "CE Renewal";
  if (t.licenseType) return `${t.licenseType}${t.state ? " · " + t.state : ""}`;
  return t.state ? `Verified Student · ${t.state}` : "Verified Student";
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Reviews", url: "https://justinsuranceco.com/reviews" },
]);

// AggregateRating + individual Review schema
const aggregateRatingSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "JustInsurance Insurance Prelicensing & CE Courses",
  description:
    "State-approved insurance prelicensing and continuing education courses for all 50 states. 100% online, self-paced, with same-day CE reporting and a published pass guarantee.",
  brand: { "@type": "Brand", name: "JustInsurance" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "30000",
    reviewCount: REVIEWS.length.toString(),
  },
  review: REVIEWS.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: r.text,
  })),
};

function StarRow() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-5 h-5 text-gold fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={aggregateRatingSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Reviews" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold uppercase tracking-wide text-sm mb-3">
            Student Reviews
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            What JustInsurance Students Say
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <StarRow />
            <p className="text-2xl font-bold">4.9 / 5</p>
          </div>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            30,000+ agents licensed across all 50 states. Real feedback from
            students who finished prelicensing, passed their state exam, and built
            an insurance career.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-gold/10 border-b border-gold/30 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">4.9★</p>
            <p className="text-xs text-gray-700">Average rating</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">30,000+</p>
            <p className="text-xs text-gray-700">Students licensed</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">93%</p>
            <p className="text-xs text-gray-700">First-attempt pass rate</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">50</p>
            <p className="text-xs text-gray-700">States covered</p>
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <article
                key={r.name + r.state}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col"
                itemScope
                itemType="https://schema.org/Review"
              >
                <StarRow />
                <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6 flex-grow" itemProp="reviewBody">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${r.source === "youtube" ? "bg-red-600" : "bg-navy"}`}>
                    <span className="text-white font-bold text-xs">{r.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy text-sm flex items-center gap-2 flex-wrap" itemProp="author">
                      {r.name}
                      {r.source === "youtube" && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                          YouTube
                        </span>
                      )}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {sourceLabel(r)}
                      {r.state && (
                        <>
                          {" · "}
                          <Link
                            href={`/${r.state.toLowerCase().replace(/\s+/g, "-")}`}
                            className="hover:text-gold-dark hover:underline"
                          >
                            {r.state}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology note */}
      <section className="bg-gray-bg py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">
            About These Reviews
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Reviews shown above are real student feedback collected through course
            completion surveys and follow-up communication. Initials are used in
            place of full names to protect student privacy. Our 4.9-star rating
            reflects aggregate satisfaction across the 30,000+ students who have
            completed JustInsurance prelicensing or CE courses since 2017. For our
            published pass-rate methodology, see{" "}
            <Link href="/pass-rates" className="text-gold-dark underline hover:text-gold font-semibold">
              /pass-rates
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Join Them?
          </h2>
          <p className="text-blue-100 leading-relaxed mb-6 max-w-2xl mx-auto">
            State-approved prelicensing for all 50 states. $199 all-inclusive.
            Pass guarantee backed by published methodology.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Find Your State
            </Link>
            <Link
              href="/compare"
              className="inline-block bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Compare Providers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
