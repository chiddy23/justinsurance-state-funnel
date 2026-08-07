import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_CANARY, HONEYPOT_PATH } from "@/lib/canary";

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-12">
          {/* Brand — sits on the left */}
          <div className="lg:col-span-1">
            <Link href="/">
              <Image
                src="/justinsurance-logo.png"
                alt="JustInsurance LLC"
                width={136}
                height={48}
                className="h-12 w-auto mb-4"
                loading="lazy"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              State-approved online insurance prelicensing and CE courses for life and health agents nationwide. We&apos;ve helped 30,000+ students get and keep their insurance license.
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
                href="mailto:support@justinsuranceco.com"
                className="flex items-center gap-2 text-gray-300 hover:text-gold transition-colors text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@justinsuranceco.com
              </a>
              <div className="flex items-start gap-2 text-gray-300 text-sm">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Link columns — fill the space to the right of the brand */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10">
          {/* Courses Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Courses</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-gold transition-colors text-sm">All States</Link></li>
              <li><Link href="/prelicensing" className="text-gray-300 hover:text-gold transition-colors text-sm">Prelicensing Courses</Link></li>
              <li><Link href="/continuing-education" className="text-gray-300 hover:text-gold transition-colors text-sm">Continuing Education (CE)</Link></li>
              <li><Link href="/property-and-casualty-ce" className="text-gray-300 hover:text-gold transition-colors text-sm">Property &amp; Casualty CE</Link></li>
              <li><Link href="/life-insurance-license" className="text-gray-300 hover:text-gold transition-colors text-sm">Life Insurance License</Link></li>
              <li><Link href="/health-insurance-license" className="text-gray-300 hover:text-gold transition-colors text-sm">Health Insurance License</Link></li>
              <li><Link href="/life-and-health-insurance-license" className="text-gray-300 hover:text-gold transition-colors text-sm">Life &amp; Health License</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/insurance-exam-guide" className="text-gray-300 hover:text-gold transition-colors text-sm">Exam Guide</Link></li>
              <li><Link href="/study-guide" className="text-gray-300 hover:text-gold transition-colors text-sm">Study Guide</Link></li>
              <li><Link href="/license-renewal-guide" className="text-gray-300 hover:text-gold transition-colors text-sm">Renewal Guide</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-gold transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/pass-rates" className="text-gray-300 hover:text-gold transition-colors text-sm">Pass Rates by State</Link></li>
              <li><Link href="/reviews" className="text-gray-300 hover:text-gold transition-colors text-sm">Reviews</Link></li>
              <li><Link href="/insurance-license-cost" className="text-gray-300 hover:text-gold transition-colors text-sm">License Cost</Link></li>
              <li><Link href="/how-long-to-get-insurance-license" className="text-gray-300 hover:text-gold transition-colors text-sm">Licensing Timeline</Link></li>
              <li><Link href="/non-resident-insurance-license" className="text-gray-300 hover:text-gold transition-colors text-sm">Non-Resident License</Link></li>
              <li><Link href="/practice-exam" className="text-gray-300 hover:text-gold transition-colors text-sm">Practice Exams</Link></li>
              <li><Link href="/webinars" className="text-gray-300 hover:text-gold transition-colors text-sm">Live Classes</Link></li>
              <li><Link href="/press" className="text-gray-300 hover:text-gold transition-colors text-sm">Press &amp; Media</Link></li>
            </ul>
          </div>

          {/* Popular States Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Popular States</h3>
            <ul className="space-y-2">
              {POPULAR_STATES.slice(0, 8).map((state) => (
                <li key={state.slug}>
                  <Link
                    href={`/${state.slug}`}
                    className="text-gray-300 hover:text-gold transition-colors text-sm"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/" className="text-gold hover:text-gold-light transition-colors text-sm font-medium">
                  View All States &rarr;
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
                    href={`/${state.slug}`}
                    className="text-gray-300 hover:text-gold transition-colors text-sm"
                  >
                    {state.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/colorado" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Colorado
                </Link>
              </li>
              <li>
                <Link href="/washington" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Washington
                </Link>
              </li>
              <li>
                <Link href="/tennessee" className="text-gray-300 hover:text-gold transition-colors text-sm">
                  Tennessee
                </Link>
              </li>
            </ul>
          </div>

          {/* Blog Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Blog</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-gray-300 hover:text-gold transition-colors text-sm">All Articles</Link></li>
              <li><Link href="/blog/life-and-health-exam-prep" className="text-gray-300 hover:text-gold transition-colors text-sm">Exam Prep</Link></li>
              <li><Link href="/blog/ce-requirements-general" className="text-gray-300 hover:text-gold transition-colors text-sm">CE Requirements</Link></li>
              <li><Link href="/blog/florida-insurance-license" className="text-gray-300 hover:text-gold transition-colors text-sm">Florida License</Link></li>
              <li><Link href="/blog/texas-insurance-license" className="text-gray-300 hover:text-gold transition-colors text-sm">Texas License</Link></li>
              <li><Link href="/blog/state-license-california" className="text-gray-300 hover:text-gold transition-colors text-sm">California License</Link></li>
              <li><Link href="/blog/how-to-become-an-insurance-agent" className="text-gray-300 hover:text-gold transition-colors text-sm">Become an Agent</Link></li>
              <li><Link href="/blog" className="text-gold hover:text-gold-light transition-colors text-sm font-medium">View All Articles &rarr;</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-gold transition-colors text-sm">About Us</Link></li>
              <li><Link href="/partners" className="text-gray-300 hover:text-gold transition-colors text-sm">Partner With Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-gold transition-colors text-sm">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-300 hover:text-gold transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-gold transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/accessibility" className="text-gray-300 hover:text-gold transition-colors text-sm">Accessibility</Link></li>
              <li><Link href="/disclosures" className="text-gray-300 hover:text-gold transition-colors text-sm">Disclosures</Link></li>
              <li><Link href="/privacy-policy#do-not-sell" className="text-gray-300 hover:text-gold transition-colors text-sm">Do Not Sell or Share My Personal Information</Link></li>
            </ul>
          </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-light mt-10 pt-6 flex flex-col gap-4">
          <p className="text-gray-300 text-xs leading-relaxed text-center sm:text-left max-w-4xl">
            JustInsurance provides state-approved insurance education. Our courses, blog posts,
            and guides are for general educational and informational purposes only and are not
            legal, tax, financial, or regulatory advice. Licensing and CE requirements change
            frequently &mdash; always verify current rules with your state insurance
            regulator and consult a qualified professional before acting.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} JustInsurance LLC. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.youtube.com/@InsuranceExam" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-500 hover:text-gold transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/justinsurance-llc" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-gold transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Content-scrape tripwire (audit 2026-07-15) — static, SSR-visible to
          non-JS crawlers, zero render-cost. Hidden site marker + a crawler-only
          link to the honeypot trap. See src/lib/canary.ts. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          margin: -1,
          padding: 0,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        <span>
          Editorial reference {SITE_CANARY}. © JustInsurance; unauthorized
          reproduction of this content is monitored.
        </span>
        <a href={HONEYPOT_PATH} tabIndex={-1} rel="nofollow">
          reference index
        </a>
      </div>
    </footer>
  );
}
