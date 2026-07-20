import React from "react";
import type { StateExamInfo } from "@/lib/states";
import { hasPassGuarantee } from "@/lib/pass-guarantee";
import { formatPassingScore, isScaledScore } from "@/lib/exam-score";

interface ExamInfoSectionProps {
  stateName: string;
  examInfo: StateExamInfo;
  examProvider: string;
  examProviderUrl: string;
  examBookingUrl: string;
  noCombinedExam: boolean;
  applicationBeforeExam: boolean;
  /** Optional exam-fee display override. Used on Life & Health pages in
   * no-combined-exam states (e.g. Illinois) where the candidate sits two
   * separate line exams, so the single-line fee understates the real cost. */
  examFeeDisplay?: string;
  /** State page slug (e.g. "ohio"). When the state excludes the pass
   * guarantee (Ohio Admin. Code 3901-5-07(H)(16)), the guarantee note box
   * is replaced with neutral study copy — same box, no guarantee offer.
   * Omit on national pages — rendering is unchanged. */
  stateSlug?: string;
  /** LOA slug (life | health | life-and-health) when rendered on a line page.
   * Lets per-exam-score states (Michigan) show that exam's exact cut score
   * instead of the state-level range. */
  loaSlug?: string;
}

export default function ExamInfoSection({
  stateName,
  examInfo,
  examProvider,
  examProviderUrl,
  examBookingUrl,
  noCombinedExam,
  applicationBeforeExam,
  stateSlug,
  loaSlug,
  examFeeDisplay,
}: ExamInfoSectionProps) {
  const showGuarantee = hasPassGuarantee(stateSlug);
  // Illinois-specific exam facts: passing score is a scaled score (0–100),
  // not a percentage; and Illinois no longer offers online remote proctoring
  // (in-person Pearson VUE only). Gated so all other states are unchanged.
  const isIllinois = stateSlug === "illinois";
  // Illinois AND Florida no longer offer online remote proctoring — both are
  // in-person Pearson VUE only (FL since Feb 16, 2024). Gated so other states
  // keep the "remote proctoring (where available)" wording.
  const inPersonOnly = stateSlug === "illinois" || stateSlug === "florida";
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
          {stateName} Licensing Exam Info
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          Know what to expect on your {stateName} insurance licensing exam before you walk in.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Exam Stats Card */}
          <div className="bg-gray-bg rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Exam Details
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Passing Score</span>
                <span className="font-bold text-navy">{formatPassingScore(stateSlug, examInfo.passingScore, loaSlug)}</span>
              </li>
              <li className="flex justify-between items-center border-t border-gray-200 pt-3">
                <span className="text-gray-500 text-sm">Exam Fee</span>
                <span className="font-bold text-navy">{examFeeDisplay ?? `$${examInfo.examFee}`}</span>
              </li>
              <li className="flex justify-between items-center border-t border-gray-200 pt-3">
                <span className="text-gray-500 text-sm">Results Timing</span>
                <span className="font-bold text-navy">{examInfo.examResultsTiming}</span>
              </li>
              <li className="flex justify-between items-center border-t border-gray-200 pt-3">
                <span className="text-gray-500 text-sm">Exam Format</span>
                <span className="font-bold text-navy">Multiple Choice</span>
              </li>
            </ul>
            {isScaledScore(stateSlug) && (
              <p className="text-gray-500 text-xs mt-3 leading-snug">
                &ldquo;Scaled&rdquo; means {stateName} reports your result on a
                standardized 0&ndash;100 scale, where {examInfo.passingScore} is
                passing — it is not the percentage of questions you answered
                correctly.
              </p>
            )}
          </div>

          {/* Exam Provider Card */}
          <div className="bg-gray-bg rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Exam Provider
            </h3>
            <p className="font-bold text-navy text-lg mb-2">{examProvider}</p>
            <p className="text-gray-600 text-sm mb-4">
              The {stateName} insurance licensing exam is administered by {examProvider}. {inPersonOnly ? `You take the ${stateName} exam in person at a Pearson VUE test center — ${stateName} no longer offers online remote proctoring.` : "You can take the exam at a testing center near you or online with remote proctoring (where available)."}
            </p>
            <div className="space-y-2">
              <a
                href={examProviderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-navy hover:bg-navy-light text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Visit {examProvider} &rarr;
              </a>
              <a
                href={examBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Schedule Your Exam
              </a>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="space-y-4">
          {applicationBeforeExam && (
            <div className="bg-blue-50 border-l-4 border-navy rounded-r-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-navy text-sm">Important: Apply Before You Exam</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {stateName} requires you to submit your license application to the Department of Insurance <strong>before</strong> scheduling your state exam. Complete your prelicensing course, then apply for your license, and then schedule your exam.
                  </p>
                </div>
              </div>
            </div>
          )}

          {noCombinedExam && (
            <div className="bg-amber-50 border-l-4 border-gold rounded-r-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-gold-deep text-sm">Note: No Combined Life & Health Exam</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {/* The "two parts / four exams" structure is verified for
                        Illinois (Pearson VUE General + State portions). Other
                        no-combined-exam states run one exam per line — keep the
                        generic copy structure-agnostic (audit 2026-07-14). */}
                    {isIllinois ? (
                      <>
                        {stateName} does not offer a combined Life & Health exam. Each line&apos;s exam has two parts — a General exam and a State exam — so pursuing both lines means <strong>four exams in total</strong>: a Life General and Life State exam, plus a Health General and Health State exam, all with {examProvider}.
                      </>
                    ) : (
                      <>
                        {stateName} does not offer a single combined Life & Health exam. Life and Accident & Health are <strong>separate exams</strong> with {examProvider} — pursuing both lines means passing each line&apos;s exam. Check {examProvider}&apos;s {stateName} scheduling options: some states let you sit both exams in one appointment.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-green-50 border-l-4 border-success rounded-r-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-success-dark flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                {showGuarantee ? (
                  <>
                    <p className="font-semibold text-success-dark text-sm">Pass Guarantee</p>
                    <p className="text-gray-600 text-sm mt-1">
                      JustInsurance students who complete the full course pass at significantly higher rates. Meet the recommended study hours, score 80%+ on the practice exam three times in a row, and test within 30 days of your first enrollment. If you don&apos;t pass, we&apos;ll refund your course fee.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-success-dark text-sm">A Study Plan That Works</p>
                    <p className="text-gray-600 text-sm mt-1">
                      JustInsurance students who complete the full course pass at significantly higher rates. Meet the recommended study hours, score 80%+ on the practice exam three times in a row, and schedule your {stateName} exam while the material is fresh.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
