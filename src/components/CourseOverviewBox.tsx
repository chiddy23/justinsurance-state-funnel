import React from "react";

interface CourseOverviewBoxProps {
  hours: number;
  price: string;
  format?: string;
  accessDuration?: string;
  includes?: string[];
}

export default function CourseOverviewBox({
  hours,
  price,
  format = "Online, Self-Paced",
  accessDuration = "12 Months",
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
}: CourseOverviewBoxProps) {
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
              {includes.map((item) => (
                <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
