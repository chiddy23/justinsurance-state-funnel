import React from "react";
import { TRUSTPILOT } from "@/lib/trustpilot";
import { hasPassGuarantee } from "@/lib/pass-guarantee";
import { getGoogleReviews } from "@/lib/google-reviews";
import { getStateBySlug } from "@/lib/states";

interface TrustSignal {
  icon: React.ReactNode;
  label: string;
  sub: string;
  href?: string;
}

const TRUST_SIGNALS: TrustSignal[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: "State-Approved",
    sub: "Official course approval",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    label: "20,000+ Students",
    sub: "Trained and counting",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    label: "4.9 on Google",
    sub: "Verified Google reviews",
    href: "https://www.google.com/search?q=JustInsurance+Pembroke+Pines+FL+reviews",
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="2" fill="#00B67A" />
        <path d="M12 4l2.06 5.06 5.44.4-4.16 3.52 1.31 5.3L12 15.9 7.35 18.28l1.31-5.3L4.5 9.46l5.44-.4L12 4z" fill="#fff" />
      </svg>
    ),
    label: `${TRUSTPILOT.score} on Trustpilot`,
    sub: `${TRUSTPILOT.count} Trustpilot reviews`,
    href: TRUSTPILOT.url,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    label: "Pass Guarantee",
    sub: "Pass or we refund",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: "Same-Day Reporting",
    sub: "Typically reported same business day",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    label: "Est. 2018",
    sub: "Educating agents since 2018",
  },
];

// 1-for-1 replacement for the Pass Guarantee signal in states where the
// guarantee cannot be offered (Ohio Admin. Code 3901-5-07(H)(16)). Keeps the
// 7-slot layout intact.
const INSTANT_ACCESS_SIGNAL: TrustSignal = {
  icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  label: "Instant Course Access",
  sub: "Start studying in minutes",
};

// Replacement signals for states whose JustInsurance provider approval is still
// PENDING (currently New York and Washington). We must not display an active
// "State-Approved / Official course approval" badge or a "Same-Day Reporting"
// badge, because both assert an approval the state has not granted. These swap
// in 1-for-1 and auto-revert the moment providerApprovalNumber is set.
const STATE_STANDARDS_SIGNAL: TrustSignal = {
  icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  label: "Built to State Standards",
  sub: "Aligned to the state exam outline",
};
const ONLINE_SELF_PACED_SIGNAL: TrustSignal = {
  icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  label: "100% Online",
  sub: "Self-paced on any device",
};

interface TrustBarProps {
  /** State page slug (e.g. "ohio"). When the state excludes the pass
   * guarantee, that signal is swapped for a neutral one. Omit on national
   * pages — rendering is unchanged. */
  stateSlug?: string;
  /** Set false on product surfaces the Pass Guarantee cannot reach — the CE
   * hub and any CE page. Terms § 4 limits the guarantee to qualifying
   * PRELICENSING courses and conditions it on a first-time state exam
   * attempt; CE renewal has no state exam, so no CE purchase can ever
   * trigger it. Defaults true, so every existing caller renders unchanged. */
  passGuaranteeApplies?: boolean;
}

export default async function TrustBar({ stateSlug, passGuaranteeApplies = true }: TrustBarProps) {
  // Live Google Business Profile rating + count (auto-updates via ISR; falls
  // back to the static display when no API key/place ID is configured).
  const google = await getGoogleReviews();

  // Pending-approval gate: states with providerApprovalNumber === "PENDING"
  // (currently NY, WA) cannot show the active "State-Approved" or "Same-Day
  // Reporting" badges — the approval that would make them true has not issued.
  const state = stateSlug ? getStateBySlug(stateSlug) : undefined;
  const providerApproved = !state || state.providerApprovalNumber !== "PENDING";

  // Audit 2026-07-14: on NATIONAL pages (no stateSlug) the bar is visible to
  // visitors from excluded states too, so the guarantee signal must carry the
  // eligibility hedge. State pages keep the short label (full terms render in
  // PassGuarantee on the same page); excluded states swap the signal entirely.
  const base = TRUST_SIGNALS.map((signal) => {
    if (!providerApproved) {
      if (signal.label === "State-Approved") return STATE_STANDARDS_SIGNAL;
      if (signal.label === "Same-Day Reporting") return ONLINE_SELF_PACED_SIGNAL;
    }
    if (signal.label === "Pass Guarantee") {
      // Product-level gate runs BEFORE the state-level gate: on a CE surface the
      // guarantee is unavailable in every state, eligible ones included.
      if (!passGuaranteeApplies) return INSTANT_ACCESS_SIGNAL;
      if (!stateSlug)
        return { ...signal, sub: "Pass or we refund — eligible states, terms apply" };
      if (!hasPassGuarantee(stateSlug)) return INSTANT_ACCESS_SIGNAL;
    }
    return signal;
  });

  const signals = base.map((signal) =>
    signal.label.endsWith("on Google")
      ? {
          ...signal,
          label: `${google.rating} on Google`,
          sub:
            google.count > 0
              ? `${google.count.toLocaleString()} verified Google reviews`
              : signal.sub,
        }
      : signal
  );
  return (
    <section className="bg-gray-bg border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 lg:grid lg:grid-cols-7 lg:gap-0">
          {signals.map((signal) => {
            const inner = (
              <>
                <span className="text-navy flex-shrink-0">{signal.icon}</span>
                <div>
                  <p className="text-navy font-bold text-sm leading-tight">{signal.label}</p>
                  <p className="text-gray-500 text-xs leading-tight hidden sm:block">{signal.sub}</p>
                </div>
              </>
            );
            return signal.href ? (
              <a
                key={signal.label}
                href={signal.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 lg:justify-center px-2 hover:opacity-80 transition-opacity"
              >
                {inner}
              </a>
            ) : (
              <div key={signal.label} className="flex items-center gap-2 lg:justify-center px-2">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
