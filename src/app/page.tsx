import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/states";
import TrustBar from "@/components/TrustBar";
import PressLogosBar from "@/components/PressLogosBar";
import CTABanner from "@/components/CTABanner";
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
        </div>
      </section>

      <TrustBar />
      <PressLogosBar />

      {/* Comparison CTA strip */}
      <section className="bg-white py-8 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="text-gold-dark font-semibold uppercase tracking-wide text-xs mb-1">
              Comparing Providers?
            </p>
            <p className="text-navy font-bold text-lg">
              See how JustInsurance stacks up vs XCEL and ExamFX
            </p>
            <p className="text-gray-600 text-sm">
              18 feature points · real pricing · guarantee terms in plain English
            </p>
          </div>
          <a
            href="/compare"
            className="flex-shrink-0 inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap"
          >
            View Comparison →
          </a>
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
                href={`/${state.slug}/`}
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
                desc: "Finish your CE and we report your completion to the state the same day — so your renewal is never delayed.",
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
