import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Contact JustInsurance — Support 754-223-9744" },
  description:
    "Contact JustInsurance for help with prelicensing courses, continuing education, or state licensing questions. Phone, email, and support hours.",
  alternates: { canonical: "https://justinsuranceco.com/contact" },
  openGraph: {
    title: "Contact JustInsurance — Support 754-223-9744",
    description:
      "Reach JustInsurance support for prelicensing, CE, and state licensing questions. Phone, email, and office hours.",
    url: "https://justinsuranceco.com/contact",
    siteName: "JustInsurance",
    type: "website",
    images: [{ url: "/og-image.png", alt: "Contact JustInsurance" }],
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Contact", url: "https://justinsuranceco.com/contact" },
]);

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JustInsurance LLC",
  url: "https://justinsuranceco.com",
  logo: "https://justinsuranceco.com/justinsurance-logo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1806 N Flamingo Rd Ste 230",
    addressLocality: "Pembroke Pines",
    addressRegion: "FL",
    postalCode: "33028",
    addressCountry: "US",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+1-754-223-9744",
      contactType: "customer support",
      email: "support@justinsuranceco.com",
      areaServed: "US",
      availableLanguage: ["English"],
    },
  ],
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Contact" },
];

export default function ContactPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={contactSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Support & Contact
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Contact JustInsurance
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Have a question about prelicensing, continuing education, or your
            state licensing process? Our support team includes licensed
            insurance professionals who can help.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-bg rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-navy mb-2 text-lg">Call Us</h2>
              <a
                href="tel:7542239744"
                className="text-navy hover:text-gold transition-colors font-semibold text-lg block"
              >
                754-223-9744
              </a>
              <p className="text-gray-500 text-sm mt-2">
                Monday–Sunday, 8am–8pm ET
              </p>
            </div>

            <div className="bg-gray-bg rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-navy mb-2 text-lg">Email Us</h2>
              <a
                href="mailto:support@justinsuranceco.com"
                className="text-navy hover:text-gold transition-colors font-semibold text-sm block break-words"
              >
                support@justinsuranceco.com
              </a>
              <p className="text-gray-500 text-sm mt-2">
                Typical response within 1 business day
              </p>
            </div>

            <div className="bg-gray-bg rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-navy mb-2 text-lg">Mailing Address</h2>
              <address className="not-italic text-navy text-sm font-semibold leading-relaxed">
                PO BOX 1025<br />
                Rincon, PR 00677
              </address>
              <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                Registered Office: 1806 N Flamingo Rd Ste 230, Pembroke Pines, FL 33028
              </p>
            </div>
          </div>

          {/* What can we help with */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6 text-center">
              What Can We Help With?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-navy mb-2">Course & Enrollment Questions</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Need help choosing between Life, Health, or combined prelicensing? Have
                  a question about course access, completion requirements, or the pass
                  guarantee? Contact our support team or check our{" "}
                  <Link href="/faq" className="text-navy underline hover:text-gold">
                    FAQ
                  </Link>
                  .
                </p>
              </div>
              <div>
                <h3 className="font-bold text-navy mb-2">State Licensing Process</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Questions about your state&apos;s prelicensing hours, exam fees, fingerprinting,
                  or application process? Every state is different — see our{" "}
                  <Link href="/" className="text-navy underline hover:text-gold">
                    state directory
                  </Link>{" "}
                  or ask us directly.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-navy mb-2">CE Renewal & Reporting</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Worried about a renewal deadline, CE hour shortfall, or whether your
                  completion was reported? Our{" "}
                  <Link
                    href="/license-renewal-guide"
                    className="text-navy underline hover:text-gold"
                  >
                    license renewal guide
                  </Link>{" "}
                  covers most situations, or call us for faster help.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-navy mb-2">Agency & Volume Enrollment</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  If you&apos;re recruiting new agents or onboarding a team, we offer agency
                  dashboards, API integration, and bulk pricing. Email us for a
                  demo or consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
            Already Licensed? Ready to Enroll?
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Browse courses by state, read our exam prep guides, or learn more about
            JustInsurance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#states"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-8 py-3 rounded-lg shadow-lg transition-all"
            >
              Find My State
            </Link>
            <Link
              href="/about"
              className="inline-block bg-white border-2 border-navy text-navy font-bold text-lg px-8 py-3 rounded-lg hover:bg-navy hover:text-white transition-colors"
            >
              About JustInsurance
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
