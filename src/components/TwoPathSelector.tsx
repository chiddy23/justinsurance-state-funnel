import React from "react";
import Link from "next/link";
import { hasPassGuarantee } from "@/lib/pass-guarantee";
import { getStateBySlug } from "@/lib/states";
import { credentialKindFromHours, isCeAvailable, isCeApprovedComingSoon, isPrelicensingHeld } from "@/lib/prelicensing-status";

interface TwoPathSelectorProps {
  stateSlug: string;
  stateName: string;
}

export default function TwoPathSelector({ stateSlug, stateName }: TwoPathSelectorProps) {
  // Ohio Admin. Code 3901-5-07(H)(16): no pass-guarantee offers on Ohio
  // pages. Swap the bullet 1-for-1 to keep the three-item list intact.
  const showGuarantee = hasPassGuarantee(stateSlug);
  const state = getStateBySlug(stateSlug);
  // A CE purchase/price CTA or a live "same-day DOI reporting" claim may render
  // ONLY when CE is actually available: approved AND ceCoursesLive !== false.
  // Recording a real provider number for an approved-but-not-live state (WA
  // #300632 CE coming soon; NY #80025 is a PRELICENSING approval, CE not yet
  // submitted) must NOT turn CE purchase/claims on. ceComingSoon is the
  // approved-CE-but-not-live case (WA) → "Approved — courses coming soon" with the
  // number; NY CE falls to the neutral "approval pending" copy (ceApproved:false).
  const ceAvailable = !!state && isCeAvailable(state);
  const ceComingSoon = !!state && isCeApprovedComingSoon(state);
  // "state-approved prelicensing" requires a prelicensing approval regime AND a
  // live prelicensing course — an approved-but-not-live prelicensing state (NY) is
  // held, so it must not claim "state-approved prelicensing course" yet.
  const prelicensingApproved =
    !!state &&
    state.providerApprovalNumber !== "PENDING" &&
    !isPrelicensingHeld(state) &&
    credentialKindFromHours([
      state.prelicensing.life.hours,
      state.prelicensing.health.hours,
      state.prelicensing.lifeAndHealth.hours,
    ]) === "prelicensing";
  // NY prelicensing is approved (#80025) but held/not-live → the prelicensing
  // card must drop its enroll affordance (no "Get My License", no "instant
  // course access") and show a neutral "opening soon" block, mirroring the CE
  // card. Exam-only live states (WA/TX) and live prelicensing states (FL) are
  // NOT held, so their card renders byte-identically to today.
  const prelicensingHeld = !!state && isPrelicensingHeld(state);
  // CE package price varies by state ($39 / $54 / $75) — never hard-code $39.
  const ceStartPrice = state?.ce.packagePrice ?? "$39";
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
              New to insurance? Get your {stateName} insurance license with {prelicensingApproved ? "a state-approved" : "an online"} prelicensing course. Study online at your own pace, then pass the state exam.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                100% online &amp; self-paced
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {prelicensingHeld
                  ? "Opening for enrollment soon"
                  : showGuarantee
                  ? "Pass guarantee included"
                  : "Instant course access — start in minutes"}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Starting at $199
              </li>
            </ul>
            {prelicensingHeld ? (
              <>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  Approved {stateName} provider (#{state?.providerApprovalNumber}) — prelicensing courses opening soon.
                </p>
                <Link
                  href={`/${stateSlug}/prelicensing`}
                  className="block text-center border-2 border-navy text-navy hover:bg-navy/10 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  View {stateName} Prelicensing Info &rarr;
                </Link>
              </>
            ) : (
              <Link
                href={`/${stateSlug}/prelicensing`}
                className="block text-center bg-navy hover:bg-navy-light text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Get My License &rarr;
              </Link>
            )}
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
              Already licensed? Complete your {stateName} CE hours online before your renewal deadline.{ceAvailable ? " We typically report your completion to the state same-day." : ""}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {ceAvailable ? "Same-day DOI reporting" : "Self-paced on any device"}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete at your own pace
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-success-dark flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {ceAvailable
                  ? `Starting at ${ceStartPrice}`
                  : ceComingSoon
                  ? "Approved — courses coming soon"
                  : "State approval pending"}
              </li>
            </ul>
            {ceAvailable ? (
              <Link
                href={`/${stateSlug}/continuing-education`}
                className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Renew My License &rarr;
              </Link>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {ceComingSoon
                    ? `Approved ${stateName} CE provider (#${state?.providerApprovalNumber}) — courses coming soon.`
                    : `${stateName} CE course approval is pending.`}
                </p>
                <Link
                  href={`/${stateSlug}/continuing-education`}
                  className="block text-center border-2 border-gold text-navy hover:bg-gold/10 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  View {stateName} CE Info &rarr;
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
