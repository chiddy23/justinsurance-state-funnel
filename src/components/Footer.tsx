import React from "react";
import Link from "next/link";

const POPULAR_STATES = [
  { name: "Florida", slug: "florida" },
  { name: "Texas", slug: "texas" },
  { name: "California", slug: "california" },
  { name: "Georgia", slug: "georgia" },
  { name: "Ohio", slug: "ohio" },
  { name: "Illinois", slug: "illinois" },
  { name: "Pennsylvania", slug: "pennsylvania" },
  { name: "Arizona", slug: "arizona" },
  { name: "North Carolina", slug: "north-carolina" },
  { name: "Michigan", slug: "michigan" },
  { name: "Virginia", slug: "virginia" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/justinsurance-logo.png"
                alt="JustInsurance LLC"
                width={180}
                height={60}
                className="h-12 w-auto mb-4"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              State-approved online insurance prelicensing and CE courses for life and health agents in all 50 states. We&apos;ve helped 30,000+ students get and keep their insurance license.
            </p>
            <div className="space-y-2">
              <a
                href="tel:7542239744"
                className="flex items-center gap-2 text-gray-300 hover:text-gold transition-colors text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                754-223-9744
              </a>
              <a
                href="mailto:support@yourinsurancelicense.com"
                className="flex items-center gap-2 text-gray-300 hover:text-gold transition-colors text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@yourinsurancelicense.com
              </a>
              <p className="flex items-start gap-2 text-gray-300 text-sm">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                1806 N Flamingo Rd Ste 230<br />Pembroke Pines, FL 33028
              </p>
            </div>
          </div>

          {/* Courses Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Courses</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-gold transition-colors text-sm">All States</Link></li>
              <li><Link href="/prelicensing/" className="text-gray-300 hover:text-gold transition-colors text-sm">Prelicensing Courses</Link></li>
              <li><Link href="/continuing-education/" className="text-gray-300 hover:text-gold transition-colors text-sm">Continuing Education (CE)</Link></li>
              <li><Link href="/life-insurance-license/" className="text-gray-300 hover:text-gold transition-colors text-sm">Life Insurance License</Link></li>
              <li><Link href="/health-insurance-license/" className="text-gray-300 hover:text-gold transition-colors text-sm">Health Insurance License</Link></li>
              <li><Link href="/life-and-health-insurance-license/" className="text-gray-300 hover:text-gold transition-colors text-sm">Life &amp; Health License</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/insurance-exam-guide/" className="text-gray-300 hover:text-gold transition-colors text-sm">Exam Guide</Link></li>
              <li><Link href="/study-guide/" className="text-gray-300 hover:text-gold transition-colors text-sm">Study Guide</Link></li>
              <li><Link href="/license-renewal-guide/" className="text-gray-300 hover:text-gold transition-colors text-sm">Renewal Guide</Link></li>
              <li><Link href="/faq/" className="text-gray-300 hover:text-gold transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/pass-rates/" className="text-gray-300 hover:text-gold transition-colors text-sm">Pass Rates</Link></li>
              <li><Link href="/press/" className="text-gray-300 hover:text-gold transition-colors text-sm">Press &amp; Media</Link></li>
            </ul>
          </div>

          {/* Popular States Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Popular States</h3>
            <ul className="space-y-2">
              {POPULAR_STATES.slice(0, 8).map((state) => (
                <li key={state.slug}>
                  <Link
                    href={`/${state.slug}/`}
                    className="text-gray-300 hover:text-gold transition-colors text-sm"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/" className="text-gold hover:text-gold-light transition-colors text-sm font-medium">
                  View All 50 States &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* More States Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">More States</h3>
            <ul className="space-y-2">
              {POPULAR_STATES.slice(8).map((state) => (
                <li key={state.slug}>
                  <Link
                    href={`/${state.slug}/`}
                    className="text-gray-300 hover:text-gold transition-colors text-sm"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/colorado/" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Colorado
                </Link>
              </li>
              <li>
                <Link href="/washington/" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Washington
                </Link>
              </li>
              <li>
                <Link href="/tennessee/" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Tennessee
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="text-gray-300 hover:text-gold transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-gold transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-light mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} JustInsurance LLC / Your Insurance License. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs text-center">
            State-approved insurance education since 2017 &mdash; 30,000+ students licensed
          </p>
        </div>
      </div>
    </footer>
  );
}
