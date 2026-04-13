"use client";

import React, { useState } from "react";
import Link from "next/link";

const RESOURCES_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Exam Guide", href: "/insurance-exam-guide" },
  { label: "Study Guide", href: "/study-guide" },
  { label: "Renewal Guide", href: "/license-renewal-guide" },
  { label: "FAQ", href: "/faq" },
  { label: "Pass Rates", href: "/pass-rates" },
  { label: "Partner With Us", href: "/partners" },
  { label: "Partner Resources", href: "/partner-resources" },
  { label: "Press & Media", href: "/press" },
  { label: "Contact", href: "/contact" },
];

const POPULAR_STATES = [
  { name: "Florida", slug: "florida" },
  { name: "Texas", slug: "texas" },
  { name: "California", slug: "california" },
  { name: "New York", slug: "new-york" },
  { name: "Georgia", slug: "georgia" },
  { name: "Ohio", slug: "ohio" },
  { name: "Illinois", slug: "illinois" },
  { name: "Pennsylvania", slug: "pennsylvania" },
  { name: "Arizona", slug: "arizona" },
  { name: "North Carolina", slug: "north-carolina" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/justinsurance-logo.png"
              alt="JustInsurance LLC"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Browse States Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href="/#states"
                className="flex items-center gap-1 text-white hover:text-gold transition-colors font-medium py-4"
                aria-expanded={dropdownOpen}
              >
                Browse States
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              <div className={`absolute top-full left-0 pt-0 w-56 z-50 transition-opacity duration-150 ${dropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                    {POPULAR_STATES.map((state) => (
                      <Link
                        key={state.slug}
                        href={`/${state.slug}/`}
                        className="block px-4 py-2 text-gray-dark hover:bg-gray-bg hover:text-navy transition-colors text-sm"
                      >
                        {state.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <Link
                        href="/"
                        className="block px-4 py-2 text-navy font-semibold hover:bg-gray-bg text-sm"
                      >
                        View All 50 States &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-white hover:text-gold transition-colors font-medium py-4"
                aria-expanded={resourcesOpen}
              >
                Resources
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`absolute top-full left-0 pt-0 w-48 z-50 transition-opacity duration-150 ${resourcesOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                    {RESOURCES_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-gray-dark hover:bg-gray-bg hover:text-navy transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
            </div>

            {/* Phone */}
            <a
              href="tel:7542239744"
              className="flex items-center gap-2 text-white hover:text-gold transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              754-223-9744
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-dark border-t border-navy-light">
          <div className="px-4 py-3 space-y-1">
            <p className="text-gold font-semibold text-sm uppercase tracking-wide py-2">Popular States</p>
            {POPULAR_STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}/`}
                className="block px-2 py-2 text-white hover:text-gold transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {state.name}
              </Link>
            ))}
            <Link
              href="/"
              className="block px-2 py-2 text-gold font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              View All 50 States &rarr;
            </Link>
            <div className="border-t border-navy-light pt-3">
              <p className="text-gold font-semibold text-sm uppercase tracking-wide px-2 py-2">Resources</p>
              {RESOURCES_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-2 py-2 text-white hover:text-gold transition-colors font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-navy-light pt-3">
              <a
                href="tel:7542239744"
                className="flex items-center gap-2 text-white hover:text-gold transition-colors py-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                754-223-9744
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
