import React from "react";
import Link from "next/link";

export default function AuthorBio() {
  return (
    <aside className="bg-gray-bg border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className="w-16 h-16 rounded-full bg-navy flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-white font-bold text-lg tracking-wide select-none">JVE</span>
        </div>
      </div>

      {/* Bio text */}
      <div className="flex-1 min-w-0">
        <p className="text-gold font-semibold text-xs uppercase tracking-widest mb-1">
          Written by
        </p>
        <h3 className="text-lg font-bold text-navy mb-0.5">Justin vom Eigen</h3>
        <p className="text-gray-500 text-sm mb-3">Founder &amp; CEO, JustInsurance LLC</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Justin vom Eigen is a licensed life and health insurance producer (since
          2017) and IDECC Certified Distance Education Instructor. He founded
          JustInsurance in January 2023 after eight years in life and health
          sales and agency leadership, and runs the{" "}
          <a
            href="https://www.youtube.com/@InsuranceExam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy font-semibold underline hover:text-gold"
          >
            @InsuranceExam
          </a>{" "}
          YouTube channel (20,000+ subscribers). Today, JustInsurance has helped
          20,000+ students get licensed nationwide with a 93% first-attempt pass
          rate.
        </p>
        <Link
          href="/about/justin-vom-eigen"
          className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold transition-colors"
        >
          More about Justin &rarr;
        </Link>
      </div>
    </aside>
  );
}
