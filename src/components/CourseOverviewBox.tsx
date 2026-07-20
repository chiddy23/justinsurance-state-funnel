import React from "react";
import { hasPassGuarantee } from "@/lib/pass-guarantee";

interface CourseOverviewBoxProps {
  hours: number;
  price: string;
  format?: string;
  accessDuration?: string;
  includes?: string[];
  /** State page slug (e.g. "ohio"). When the state excludes the pass
   * guarantee (Ohio Admin. Code 3901-5-07(H)(16)), any "Pass guarantee"
   * include is swapped 1-for-1 for a neutral benefit. Omit on national
   * pages — rendering is unchanged. */
  stateSlug?: string;
}

export default function CourseOverviewBox({
  hours,
  price,
  format = "Online, Self-Paced",
  // 30 days matches the FAQ + Pass Guarantee window (test within 30 days of
  // first enrollment). Earlier "12 Months" default conflicted with the FAQ
  // text on every prelicensing LOA page. CE template explicitly overrides
  // to "365 Days" and is unaffected.
  accessDuration = "30 Days",
  includes = [
    "Video lessons",
    "Interactive e-book",
    "Practice exams",
    "Flashcard review sets",
    "Progress tracking",
    "Expert support",
    "Certificate of completion",
    "Pass guarantee",
  ],
  stateSlug,
}: CourseOverviewBoxProps) {
  // Covers both the default list and caller-supplied `includes` arrays.
  // De-duped so a caller who already lists instant access doesn't produce
  // a duplicate row (and duplicate React key).
  const displayIncludes = hasPassGuarantee(stateSlug)
    ? includes
    : Array.from(
        new Set(
          includes.map((item) =>
            /pass\s*guarantee/i.test(item) ? "Instant course access" : item
          )
        )
      );
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-8">
          Course Overview
        </h2>
        <div className="bg-gray-bg rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200">
            <div className="p-5 text-center">
              <p className="text-3xl font-bold text-navy">{hours}</p>
              <p className="text-gray-500 text-sm mt-1">Credit Hours</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-3xl font-bold text-gold">{price}</p>
              <p className="text-gray-500 text-sm mt-1">Course Price</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-base font-bold text-navy">{format}</p>
              <p className="text-gray-500 text-sm mt-1">Course Format</p>
            </div>
            <div className="p-5 text-center">
              <p className="text-base font-bold text-navy">{accessDuration}</p>
              <p className="text-gray-500 text-sm mt-1">Access Duration</p>
            </div>
          </div>
          <div className="border-t border-gray-200 p-6">
            <h3 className="font-semibold text-navy mb-4">What&apos;s Included</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {displayIncludes.map((item) => (
                <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
