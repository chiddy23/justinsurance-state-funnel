import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import TrustBar from "@/components/TrustBar";
import PressLogosBar from "@/components/PressLogosBar";
import CTABanner from "@/components/CTABanner";
import TrustpilotStars from "@/components/TrustpilotStars";
import { TRUSTPILOT } from "@/lib/trustpilot";
import { SchemaMarkup, generateOrganizationSchema } from "@/lib/schema";

const homeTitle = "Insurance Prelicensing & CE Courses | JustInsurance";
const homeDesc = "State-approved insurance prelicensing and CE courses nationwide. 100% online, self-paced, 93% pass rate, pass guarantee. From $199.";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDesc,
  alternates: { canonical: "https://justinsuranceco.com/" },
  openGraph: {
    title: homeTitle,
    description: homeDesc,
    url: "https://justinsuranceco.com/",
    type: "website",
    images: [{ url: "/og-image.png", alt: "JustInsurance — Online Insurance License Courses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDesc,
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  const states = Object.values(STATES)
    .filter(s => s.slug !== "new-york")
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <SchemaMarkup schema={generateOrganizationSchema()} />

      {/* Hero */}
      <section className="bg-navy-dark text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            State-Approved Online Courses
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Get Your Insurance License Online
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            State-approved prelicensing and CE courses nationwide. 100% online, self-paced, and backed by our pass guarantee. Join 20,000+ students who&apos;ve trusted JustInsurance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#states"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Find My State
            </a>
            <a
              href="tel:7542239744"
              className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-white hover:text-navy transition-all"
            >
              Call 754-223-9744
            </a>
          </div>
          <div className="mt-6 flex justify-center">
            <a
              href={TRUSTPILOT.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors"
            >
              <TrustpilotStars size="w-4 h-4" />
              <span>
                <strong className="text-white">{TRUSTPILOT.label}</strong>{" "}
                {TRUSTPILOT.score}/5 · {TRUSTPILOT.count} reviews on{" "}
                <span className="font-semibold text-white">Trustpilot</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <TrustBar />
      <PressLogosBar />

      {/* Browse by Course Type — homepage hub anchors */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Browse by Course Type
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Already know what you need? Skip the state grid and jump straight to the course catalog for prelicensing or continuing education.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prelicensing */}
            <Link
              href="/prelicensing"
              className="group bg-white rounded-xl border-2 border-transparent hover:border-navy shadow-md hover:shadow-xl transition-all p-6 flex flex-col"
            >
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold-dark transition-colors">
                Prelicensing Courses
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                State-approved prelicensing for Life, Health, and Life &amp; Health insurance licenses. From $199. Pass guarantee included.
              </p>
              <span className="inline-flex items-center gap-1 text-navy font-semibold text-sm group-hover:text-gold-dark transition-colors">
                See Prelicensing Courses &rarr;
              </span>
            </Link>

            {/* L&H Continuing Education */}
            <Link
              href="/continuing-education"
              className="group bg-white rounded-xl border-2 border-gold shadow-md hover:shadow-xl transition-all p-6 flex flex-col"
            >
              <div className="bg-gold text-gray-dark text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full self-start mb-3">
                Most Popular
              </div>
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold-dark transition-colors">
                Continuing Education
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                Renew your Life &amp; Health insurance license with state-approved CE. Same-day DOI reporting. From $39.
              </p>
              <span className="inline-flex items-center gap-1 text-navy font-semibold text-sm group-hover:text-gold-dark transition-colors">
                See CE Courses &rarr;
              </span>
            </Link>

            {/* Property & Casualty CE */}
            <Link
              href="/property-and-casualty-ce"
              className="group bg-white rounded-xl border-2 border-transparent hover:border-gold shadow-md hover:shadow-xl transition-all p-6 flex flex-col"
            >
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-gold-dark transition-colors">
                Property &amp; Casualty CE
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                State-approved P&amp;C CE for personal auto, homeowners, commercial, and flood. 25-state coverage. From $39.
              </p>
              <span className="inline-flex items-center gap-1 text-navy font-semibold text-sm group-hover:text-gold-dark transition-colors">
                See P&amp;C CE Packages &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* State Grid */}
      <section id="states" className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Choose Your State
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            We offer state-approved insurance prelicensing and CE courses nationwide. Click your state to get started.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                className="group flex items-center gap-2 bg-gray-bg hover:bg-navy rounded-lg p-3 transition-all hover:shadow-md"
              >
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-200 w-8 flex-shrink-0">
                  {state.abbreviation}
                </span>
                <span className="text-sm font-medium text-navy group-hover:text-white leading-tight">
                  {state.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why JustInsurance */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Why 20,000+ Students Choose JustInsurance
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            We make getting and keeping your insurance license as simple as possible.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "State-Approved Nationwide",
                desc: "Every course meets the exact education requirements set by each state's Department of Insurance — no guesswork.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Study at Your Own Pace",
                desc: "No schedules, no deadlines within the course. Start today and study whenever it fits your life.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: "Pass Guarantee",
                desc: "Meet the study hours, score 80%+ on the practice exam three times in a row, and test within 30 days of enrollment. If you don't pass, we refund your course fee.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Same-Day CE Reporting",
                desc: "Finish your CE and we report your completion to the state the same day.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2v-1a7 7 0 10-14 0v1a2 2 0 002 2zM12 11V7" />
                  </svg>
                ),
                title: "Expert Support",
                desc: "Real humans answer your questions about course content or the licensing process. Call or email anytime.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                title: "Transparent, Affordable Pricing",
                desc: "Prelicensing from $199 and CE from $39. No subscriptions, no hidden fees. Pay once, get licensed.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-navy mb-3">{item.icon}</div>
                <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Get Your Insurance License?"
        subtitle="Choose your state above and enroll in a state-approved prelicensing or CE course today. Pass guarantee included."
        ctaText="Browse All States"
        ctaHref="#states"
      />
    </>
  );
}
