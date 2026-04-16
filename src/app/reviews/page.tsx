import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";
import { ALL_TESTIMONIALS, GOOGLE_REVIEWS, type Testimonial } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: { absolute: "JustInsurance Student Reviews & Testimonials" },
  description:
    "Real reviews from JustInsurance students who passed their state insurance licensing exam. 5-star Google rating, 30,000+ agents licensed across 50 states.",
  alternates: { canonical: "https://justinsuranceco.com/reviews" },
};

const REVIEWS = ALL_TESTIMONIALS;

function sourceLabel(t: Testimonial): string {
  if (t.source === "youtube") return "via YouTube comment";
  if (t.source === "google") return "via Google Review";
  if (t.source === "ce-renewal") return t.licenseType ? `CE Renewal · ${t.state ?? ""}`.trim() : "CE Renewal";
  if (t.licenseType) return `${t.licenseType}${t.state ? " · " + t.state : ""}`;
  return t.state ? `Verified Student · ${t.state}` : "Verified Student";
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Reviews", url: "https://justinsuranceco.com/reviews" },
]);

// Organization + AggregateRating only.
// Note: We intentionally do NOT embed individual Review objects inline here.
// Google's policy restricts Product/Organization schema with self-hosted
// review markup (self-serving review policy). AggregateRating alone is
// AggregateRating schema stripped until Google review count reaches 25+.
// Visual "5.0 on Google" badges remain on-page (HTML only).
// Re-enable Organization+AggregateRating schema here once review volume is credible.

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
            <p className="text-2xl font-bold">5.0 / 5</p>
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
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">5.0★</p>
            <p className="text-xs text-gray-700">Average rating</p>
          </div>
          <a
            href="https://www.google.com/search?q=JustInsurance+Pembroke+Pines+FL+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:opacity-80 transition-opacity"
          >
            <p className="text-2xl md:text-3xl font-bold text-navy flex items-center justify-center gap-1.5">
              5.0
              <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </p>
            <p className="text-xs text-gray-700">on Google</p>
          </a>
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

      {/* Google Reviews */}
      <section className="bg-gray-50 py-12 px-4 border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <h2 className="text-xl md:text-2xl font-bold text-navy">Google Reviews</h2>
            <span className="text-sm text-gray-500 ml-1">5.0 ★ · 4 reviews</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GOOGLE_REVIEWS.map((r) => (
              <article key={r.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{r.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{r.name}</p>
                    <p className="text-gray-500 text-xs">via Google</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-4">
            <a
              href="https://www.google.com/search?q=JustInsurance+Pembroke+Pines+FL+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-navy underline hover:text-gold"
            >
              See all reviews on Google →
            </a>
          </div>
        </div>
      </section>

      {/* YouTube & Student Reviews grid */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <article
                key={r.name + r.state}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col"
              >
                <StarRow />
                <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6 flex-grow">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${r.source === "youtube" ? "bg-red-600" : "bg-navy"}`}>
                    <span className="text-white font-bold text-xs">{r.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy text-sm flex items-center gap-2 flex-wrap">
                      {r.name}
                      {r.source === "youtube" && (
                        r.videoId ? (
                          <a
                            href={`https://www.youtube.com/watch?v=${r.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`See this comment on YouTube (opens in new tab)`}
                            className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded transition-colors"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            YouTube
                            <span aria-hidden="true" className="text-[9px]">↗</span>
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            YouTube
                          </span>
                        )
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

      {/* Competitor comparison cross-link */}
      <section className="bg-white py-10 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold-dark font-semibold uppercase tracking-wide text-xs mb-2">
            Still Comparing?
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">
            See Why Students Chose JustInsurance Over XCEL and ExamFX
          </h2>
          <p className="text-gray-600 mb-5 max-w-2xl mx-auto text-sm">
            Side-by-side comparison of the three major prelicensing providers —
            18 feature points, real pricing, and honest guarantee terms.
          </p>
          <Link
            href="/compare"
            className="inline-block bg-navy hover:bg-navy-light text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm"
          >
            Compare Providers →
          </Link>
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
            place of full names to protect student privacy. Our 5-star rating
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
