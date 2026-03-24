"use client";

import React, { useState } from "react";
import Link from "next/link";

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

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://justinsuranceco.com/wp-content/uploads/2024/03/logo-white-300x97.png"
              alt="JustInsurance LLC"
              width={150}
              height={49}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {/* Browse States Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                className="flex items-center gap-1 text-white hover:text-gold transition-colors font-medium"
                aria-expanded={dropdownOpen}
              >
                Browse States
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                >
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
                      View All 49 States &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Pass Rates */}
            <Link
              href="/pass-rates"
              className="text-white hover:text-gold transition-colors font-medium"
            >
              Pass Rates
            </Link>

            {/* About */}
            <Link
              href="/"
              className="text-white hover:text-gold transition-colors font-medium"
            >
              About
            </Link>

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
              View All 49 States &rarr;
            </Link>
            <div className="border-t border-navy-light pt-3">
              <Link
                href="/pass-rates"
                className="block px-2 py-2 text-white hover:text-gold transition-colors font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Pass Rates
              </Link>
              <Link
                href="/"
                className="block px-2 py-2 text-white hover:text-gold transition-colors font-medium"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
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
