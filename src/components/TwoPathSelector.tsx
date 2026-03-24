import React from "react";
import Link from "next/link";

interface TwoPathSelectorProps {
  stateSlug: string;
  stateName: string;
}

export default function TwoPathSelector({ stateSlug, stateName }: TwoPathSelectorProps) {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
          What Do You Need?
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          Whether you&apos;re getting licensed for the first time or renewing your existing license, we have the course for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prelicensing Card */}
          <div className="border-2 border-navy rounded-xl p-8 flex flex-col hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-navy mb-3">Prelicensing</h3>
            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
              New to insurance? Get your {stateName} insurance license with a state-approved prelicensing course. Study online at your own pace, then pass the state exam.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                100% online &amp; self-paced
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pass guarantee included
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Starting at $199
              </li>
            </ul>
            <Link
              href={`/${stateSlug}/prelicensing/`}
              className="block text-center bg-navy hover:bg-navy-light text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Get My License &rarr;
            </Link>
          </div>

          {/* CE Card */}
          <div className="border-2 border-gold rounded-xl p-8 flex flex-col hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-navy mb-3">Continuing Education (CE)</h3>
            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
              Already licensed? Complete your {stateName} CE hours online before your renewal deadline. We report your completion to the state same-day.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Same-day DOI reporting
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete in one sitting
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Starting at $59
              </li>
            </ul>
            <Link
              href={`/${stateSlug}/continuing-education/`}
              className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Renew My License &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
