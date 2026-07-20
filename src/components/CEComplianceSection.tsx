import React from "react";

export interface CEComplianceData {
  lateFee: string;
  gracePeriod: string;
  reinstatementFee: string;
  reinstatementWindow: string;
  carryForward: string;
  lapseConsequence: string;
}

interface CEComplianceSectionProps {
  stateName: string;
  doiName: string;
  compliance: CEComplianceData;
  /**
   * Pending-approval states (providerApprovalNumber === "PENDING", currently NY
   * and WA): completions cannot yet be reported to the DOI, so the "we report
   * same business day" claim is dropped. Defaults true (every approved state
   * renders byte-identical).
   */
  providerApproved?: boolean;
}

interface ComplianceCard {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function CEComplianceSection({
  stateName,
  doiName,
  compliance,
  providerApproved = true,
}: CEComplianceSectionProps) {
  const cards: ComplianceCard[] = [
    {
      label: "Grace Period",
      value: compliance.gracePeriod,
      icon: (
        <svg className="w-6 h-6 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Late Fee",
      value: compliance.lateFee,
      icon: (
        <svg className="w-6 h-6 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Reinstatement Fee",
      value: compliance.reinstatementFee,
      icon: (
        <svg className="w-6 h-6 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: "Reinstatement Window",
      value: compliance.reinstatementWindow,
      icon: (
        <svg className="w-6 h-6 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
          What Happens If You Miss Your {stateName} CE Deadline?
        </h2>
        <p className="text-gray-600 leading-relaxed mb-10 max-w-3xl">
          Letting your insurance license lapse is more than an inconvenience &mdash; it can mean lost
          income, reinstatement fees, and extra CE requirements before you can legally sell again.
          Below you&apos;ll find the specific grace periods, late fees, and reinstatement rules that
          apply in {stateName}, so you know exactly where you stand if a renewal deadline slips by.
        </p>

        {/* 4-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-gray-bg rounded-xl p-6 border border-gray-200 flex flex-col"
            >
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center mb-3">
                {card.icon}
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                {card.label}
              </div>
              <div className="text-navy font-bold text-lg leading-snug">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Warning callout */}
        <div className="bg-amber-50 border-l-4 border-gold rounded-r-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-gold-deep flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-semibold text-navy mb-1">Consequences of a Lapsed License</p>
              <p className="text-gray-600 text-sm leading-relaxed">{compliance.lapseConsequence}</p>
            </div>
          </div>
        </div>

        {/* Secondary info row */}
        <div className="bg-gray-bg rounded-xl p-6 border border-gray-200 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                Carry-Forward Rules
              </p>
              <p className="text-navy font-semibold leading-snug">{compliance.carryForward}</p>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed md:text-right">
              Rules can change mid-cycle &mdash; always confirm current requirements with the{" "}
              <span className="font-semibold text-navy">{doiName}</span>, which is the official
              source of truth for license status and CE compliance.
            </p>
          </div>
        </div>

        {/* CTA block */}
        <div className="bg-navy rounded-xl p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            Don&apos;t Let Your License Lapse
          </h3>
          <p className="text-blue-100 leading-relaxed mb-6 max-w-2xl mx-auto">
            {providerApproved ? (
              <>
                Complete your {stateName} CE today &mdash; we typically report your completion to the {doiName} the
                same business day, so you can renew on time.
              </>
            ) : (
              <>
                Get your {stateName} CE hours done early so you&apos;re ready well before your renewal deadline.
              </>
            )}
          </p>
          <a
            href="#ce-courses"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-8 rounded-lg transition-colors"
          >
            View {stateName} CE Courses
          </a>
        </div>
      </div>
    </section>
  );
}
