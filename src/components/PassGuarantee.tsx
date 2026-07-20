import React from "react";
import { hasPassGuarantee } from "@/lib/pass-guarantee";

interface PassGuaranteeProps {
  /** State page slug (e.g. "ohio"). When the state excludes the pass
   * guarantee (Ohio Admin. Code 3901-5-07(H)(16)), an Ohio-compliant
   * benefit section renders instead. Omit on national pages — rendering
   * is unchanged. */
  stateSlug?: string;
}

export default function PassGuarantee({ stateSlug }: PassGuaranteeProps) {
  if (!hasPassGuarantee(stateSlug)) {
    // Ohio-compliant alternative: same section shell (bordered gold card)
    // so page rhythm is preserved, zero guarantee language.
    return (
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="border-2 border-gold rounded-2xl p-8 md:p-12 text-center bg-amber-50">
            {/* Icon */}
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
              {stateSlug === "illinois"
                ? "Instant Access, Plus Scheduled Live Webinars"
                : "Instant Course Access"}
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              {stateSlug === "illinois"
                ? "Enroll and start your self-paced coursework within minutes. Illinois requires part of your hours as live, attendance-verified webinar sessions — you’ll reserve a session time after enrolling; the remaining hours are self-paced on any device."
                : "Enroll and start studying within minutes — no waiting, no shipping. Your course unlocks the moment your order completes."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="border-2 border-gold rounded-2xl p-8 md:p-12 text-center bg-amber-50">
          {/* Icon */}
          <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
            Our Pass Guarantee
          </h2>

          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            We&apos;re so confident in our courses that we back them with a pass guarantee. Put in the study time, master the practice exam, and test within your window. If you still don&apos;t pass your state exam, <strong>we&apos;ll refund your course fee</strong>. No runaround. No excuses.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold font-bold text-lg">1</span>
                <p className="font-semibold text-navy text-sm">Meet the Study Hours</p>
              </div>
              <p className="text-gray-600 text-sm">Complete the recommended study hours for your line of authority before you sit for the state exam.</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold font-bold text-lg">2</span>
                <p className="font-semibold text-navy text-sm">Master the Practice Exam</p>
              </div>
              <p className="text-gray-600 text-sm">Score 80% or higher on the practice exam three times in a row before sitting for the state exam.</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gold font-bold text-lg">3</span>
                <p className="font-semibold text-navy text-sm">Test Within 30 Days</p>
              </div>
              <p className="text-gray-600 text-sm">Take your first-time state exam attempt within 30 days of your first enrollment in the course.</p>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            Guarantee applies to first-time state exam attempts within 30 days of your first course enrollment, and requires the recommended study hours (your state&apos;s required course hours where prelicensing is mandatory) plus three consecutive 80%+ practice exam scores. Claims require your official score report from the failed first attempt, submitted within 30 days of the exam. Contact{" "}
            <a href="mailto:support@justinsuranceco.com" className="text-navy hover:text-gold transition-colors underline">
              support@justinsuranceco.com
            </a>{" "}
            for details.
          </p>

          <p className="text-gray-500 text-xs mt-3">
            Pass Guarantee not available for Ohio (Ohio Admin. Code 3901-5-07(H)(16)), Illinois, or West Virginia courses — see our Terms for details.
          </p>
        </div>
      </div>
    </section>
  );
}
