import React from "react";
import type { StateData } from "@/lib/states";

interface StateRequirementsBlockProps {
  stateData: StateData;
}

export default function StateRequirementsBlock({ stateData }: StateRequirementsBlockProps) {
  const { name, doiName, doiUrl, prelicensing, ce, examInfo, noCombinedExam, applicationBeforeExam } = stateData;
  const { examProvider, examProviderUrl, examBookingUrl } = examInfo;

  return (
    <section className="bg-gray-bg py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
          {name} Insurance Licensing Requirements
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          Everything you need to know to get — and keep — your {name} insurance license.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prelicensing Hours */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Prelicensing Requirements
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Life Only</span>
                <span className="font-semibold text-navy">{prelicensing.life.hours} hours &mdash; {prelicensing.life.price}</span>
              </li>
              <li className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Health Only</span>
                <span className="font-semibold text-navy">{prelicensing.health.hours} hours &mdash; {prelicensing.health.price}</span>
              </li>
              <li className="flex justify-between py-2">
                <span className="text-gray-500">Life &amp; Health</span>
                <span className="font-semibold text-navy">{prelicensing.lifeAndHealth.hours} hours &mdash; {prelicensing.lifeAndHealth.price}</span>
              </li>
            </ul>
          </div>

          {/* CE Requirements */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              CE &amp; Renewal Requirements
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Total CE Hours</span>
                <span className="font-semibold text-navy">{ce.totalHours} hours</span>
              </li>
              <li className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Renewal Period</span>
                <span className="font-semibold text-navy">{ce.renewalPeriod}</span>
              </li>
              <li className="flex justify-between py-2">
                <span className="text-gray-500">Ethics Hours</span>
                <span className="font-semibold text-navy">{ce.ethicsHours} hours required</span>
              </li>
            </ul>
          </div>

          {/* Exam Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              State Exam
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Provider</span>
                <a href={examProviderUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy hover:text-gold transition-colors">{examProvider}</a>
              </li>
              <li className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Passing Score</span>
                <span className="font-semibold text-navy">{examInfo.passingScore}%</span>
              </li>
              <li className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Exam Fee</span>
                <span className="font-semibold text-navy">${examInfo.examFee}</span>
              </li>
              <li className="flex justify-between py-2">
                <span className="text-gray-500">Results</span>
                <span className="font-semibold text-navy">{examInfo.examResultsTiming}</span>
              </li>
            </ul>
            <a
              href={examBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center text-sm text-navy border border-navy hover:bg-navy hover:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Schedule Exam &rarr;
            </a>
          </div>

          {/* DOI Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {doiName}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Your license application is submitted to the {doiName}. Most applications are processed within 2–5 business days when submitted online through NIPR or the DOI portal.
            </p>
            {applicationBeforeExam && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-navy text-xs font-semibold">Apply before scheduling your exam</p>
                <p className="text-gray-600 text-xs mt-1">{name} requires license application approval before you can schedule the state exam.</p>
              </div>
            )}
            {noCombinedExam && (
              <div className="bg-amber-50 rounded-lg p-3 mb-4">
                <p className="text-gold-dark text-xs font-semibold">No combined Life &amp; Health exam</p>
                <p className="text-gray-600 text-xs mt-1">Life and Health exams must be scheduled and taken separately in {name}.</p>
              </div>
            )}
            <a
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm text-navy border border-navy hover:bg-navy hover:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Visit {doiName} &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
