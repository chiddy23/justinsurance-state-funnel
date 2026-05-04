import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Press & Media | JustInsurance | NASDAQ · Yahoo Finance",
  },
  description:
    "JustInsurance press coverage. Featured on NASDAQ TradeTalks and Yahoo Finance. 93% student pass rate, 20,000+ students trained across 49 states.",
  robots: "index, follow",
  alternates: {
    canonical: "https://justinsuranceco.com/press",
  },
  openGraph: {
    title: "Press & Media | JustInsurance | NASDAQ · Yahoo Finance",
    description:
      "JustInsurance press coverage and media mentions. Featured on NASDAQ and Yahoo Finance for our 93% pass-rate breakthrough.",
    url: "https://justinsuranceco.com/press/",
    siteName: "JustInsurance",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        alt: "JustInsurance — Online Insurance License Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press & Media | JustInsurance",
    description:
      "Featured on NASDAQ and Yahoo Finance for our 93% pass-rate breakthrough in insurance licensing education.",
    images: ["/og-image.png"],
  },
};

const pressSchema = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline:
    "JustInsurance Unveils 93% Pass-Rate Breakthrough, Offering a Scalable Solution to the U.S. Insurance Agent Shortage",
  datePublished: "2025-12-10",
  dateModified: "2025-12-10",
  author: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
  publisher: {
    "@type": "Organization",
    name: "GlobeNewswire",
    url: "https://www.globenewswire.com",
  },
  description:
    "JustInsurance announces a 93% pass rate for insurance licensing exams — nearly double the national average — with 900% year-over-year growth and 20,000+ students trained.",
  about: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
    foundingLocation: "Pembroke Pines, Florida",
    sameAs: [
      "https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html",
      "https://www.globenewswire.com/news-release/2025/12/10/3203363/0/en/JustInsurance-Unveils-93-Pass-Rate-Breakthrough-Offering-a-Scalable-Solution-to-the-U-S-Insurance-Agent-Shortage.html",
    ],
  },
};

const MEDIA_OUTLETS = [
  {
    name: "NASDAQ",
    logo: null,
    description: "TradeTalks — Live from NASDAQ MarketSite",
    url: "https://www.youtube.com/watch?v=AYuIOZCZpLQ&t=15s",
  },
  {
    name: "Yahoo Finance",
    logo: null,
    description: "Press release coverage",
    url: "https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html",
  },
  {
    name: "GlobeNewswire",
    logo: null,
    description: "Official press release distribution",
    url: "https://www.globenewswire.com/news-release/2025/12/10/3203363/0/en/JustInsurance-Unveils-93-Pass-Rate-Breakthrough-Offering-a-Scalable-Solution-to-the-U-S-Insurance-Agent-Shortage.html",
  },
];

const PRESS_STATS = [
  { value: "93%", label: "Student Pass Rate" },
  { value: "2×", label: "National Average" },
  { value: "900%", label: "Year-Over-Year Growth" },
  { value: "20,000+", label: "Students Trained" },
];

export default function PressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pressSchema) }}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Press &amp; Media
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            JustInsurance in the News
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our 93% pass-rate breakthrough has been recognized by leading
            financial and business media as a solution to the U.S. insurance
            agent shortage.
          </p>
        </div>
      </section>

      {/* As Seen On */}
      <section className="bg-gray-50 border-b border-gray-200 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-widest mb-8">
            As Seen On
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {MEDIA_OUTLETS.map((outlet) => (
              <a
                key={outlet.name}
                href={outlet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
                aria-label={`${outlet.name} — ${outlet.description}`}
              >
                <span className="text-2xl md:text-3xl font-bold text-gray-700 group-hover:text-navy transition-colors">
                  {outlet.name}
                </span>
                <span className="text-xs text-gray-500">{outlet.description}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {PRESS_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-navy mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NASDAQ Trade Talks Video */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              NASDAQ TradeTalks
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
              Justin vom Eigen on NASDAQ TradeTalks
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              JustInsurance Founder &amp; CEO Justin vom Eigen joined NASDAQ TradeTalks
              host Jill Malandrino at the NASDAQ MarketSite to discuss AI-driven
              innovation in insurance education and cybersecurity resilience.
            </p>
          </div>
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/AYuIOZCZpLQ?start=15"
              title="JustInsurance on NASDAQ TradeTalks — Justin vom Eigen"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Broadcast live from the NASDAQ MarketSite &bull; Hosted by Jill Malandrino
          </p>
        </div>
      </section>

      {/* Featured Press Release */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-10 text-center">
            Featured Coverage
          </h2>

          <article className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {/* Article header */}
            <div className="bg-navy px-8 py-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Press Release
                </span>
                <span className="bg-navy-light text-white text-xs font-medium px-3 py-1 rounded-full">
                  December 10, 2025
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
                JustInsurance Unveils 93% Pass-Rate Breakthrough, Offering a
                Scalable Solution to the U.S. Insurance Agent Shortage
              </h3>
            </div>

            {/* Article body */}
            <div className="px-8 py-8 space-y-5 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-navy">Pembroke Pines, FL</strong> —
                JustInsurance LLC announced a landmark milestone in insurance
                education: an industry-leading{" "}
                <strong>93% first-attempt pass rate</strong> for insurance
                licensing exams — nearly double the national average of 46%.
              </p>

              <p>
                The company, founded by Justin vom Eigen, attributes this
                breakthrough to its AI-powered adaptive learning platform, which
                features personalized learning pathways, instant practice test
                analysis, and real-world coaching that simulates agency
                environments. The result: students not only pass faster — they
                are better prepared for the field.
              </p>

              <blockquote className="border-l-4 border-gold pl-6 py-2 bg-gray-50 rounded-r-lg">
                <p className="text-navy font-medium italic">
                  &ldquo;The insurance industry faces a critical shortage of
                  qualified agents. Our platform was built to solve exactly
                  that — by removing the three barriers that cause most
                  candidates to fail: a lack of a clear path, overcomplicated
                  material, and outdated resources.&rdquo;
                </p>
                <footer className="mt-2 text-sm text-gray-500 not-italic">
                  — Justin vom Eigen, Founder, JustInsurance LLC
                </footer>
              </blockquote>

              <p>
                JustInsurance reported{" "}
                <strong>900% year-over-year growth</strong> and has trained
                over <strong>20,000 students</strong> across 49 states in life,
                health, and life &amp; health insurance prelicensing and
                continuing education (CE). The platform&apos;s students also
                show <strong>30% lower attrition</strong> than the industry
                standard — meaning more agents completing training and entering
                the field.
              </p>

              <p>
                The platform addresses the three most common failure points for
                insurance exam candidates:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Lack of a clear, measurable path to success</li>
                <li>Overcomplication of exam topics</li>
                <li>Limited access to updated, state-specific materials</li>
              </ul>

              <p>
                With prelicensing courses at{" "}
                <strong>$199 and CE at $39</strong>, JustInsurance offers one
                of the most affordable pass-guarantee programs in the market,
                with same-day DOI reporting after course completion.
              </p>
            </div>

            {/* Read the full release */}
            <div className="px-8 pb-8 flex flex-wrap gap-4">
              <a
                href="https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-navy text-white px-5 py-3 rounded-lg font-semibold text-sm hover:bg-navy-dark transition-colors"
              >
                Read on Yahoo Finance
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://www.globenewswire.com/news-release/2025/12/10/3203363/0/en/JustInsurance-Unveils-93-Pass-Rate-Breakthrough-Offering-a-Scalable-Solution-to-the-U-S-Insurance-Agent-Shortage.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-navy text-navy px-5 py-3 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Full Release on GlobeNewswire
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                Media Contact
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                For press inquiries, interviews, or media assets, please reach
                out directly. We welcome opportunities to discuss the insurance
                licensing industry, agent shortage solutions, and our
                educational model.
              </p>
              <div className="space-y-3">
                <a
                  href="mailto:support@justinsuranceco.com"
                  className="flex items-center gap-3 text-navy hover:text-gold transition-colors font-medium"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@justinsuranceco.com
                </a>
                <a
                  href="tel:7542239744"
                  className="flex items-center gap-3 text-navy hover:text-gold transition-colors font-medium"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  754-223-9744
                </a>
                <div className="flex items-start gap-3 text-gray-600 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="mb-1"><span className="text-gray-500 text-xs uppercase tracking-wide">Mail:</span> PO BOX 1025, Rincon PR 00677</p>
                    <p><span className="text-gray-500 text-xs uppercase tracking-wide">Registered:</span> 1806 N Flamingo Rd Ste 230, Pembroke Pines, FL 33028</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-navy mb-4">About JustInsurance</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                JustInsurance LLC (d/b/a Your Insurance License) is a
                state-approved online insurance education provider offering
                prelicensing and continuing education (CE) courses for life
                and health insurance agents across 49 states.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Founded by Justin vom Eigen in Pembroke Pines, Florida,
                JustInsurance has trained over 20,000 students and maintains a
                93% first-attempt exam pass rate — nearly double the national
                average.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  State-approved in 49 states
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  93% first-attempt pass rate
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  20,000+ students trained
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Pass guarantee on all courses
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Join 20,000+ Licensed Students Nationwide?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get your insurance license online — $199 prelicensing, $39 CE, pass
            guarantee included.
          </p>
          <Link
            href="/"
            className="inline-block bg-gold text-navy font-bold px-8 py-4 rounded-lg text-lg hover:bg-gold-light transition-colors"
          >
            Browse Courses by State
          </Link>
        </div>
      </section>
    </>
  );
}
