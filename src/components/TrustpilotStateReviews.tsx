import React from "react";
import { TRUSTPILOT, getTrustpilot, getTrustpilotForState } from "@/lib/trustpilot";
import TrustpilotStars from "@/components/TrustpilotStars";

// Per-state Trustpilot social proof for state hubs. Features state-matched
// reviews first (locally relevant + unique content for SEO), then a deterministic
// per-state fill. Display-only — no self-serving schema.
export default async function TrustpilotStateReviews({ stateName }: { stateName: string }) {
  const reviews = getTrustpilotForState(stateName, 3);
  if (reviews.length === 0) return null;
  // Live Trustpilot score/count (auto-updates via ISR; static 92 fallback).
  const tp = await getTrustpilot();
  const hasStateMatch = reviews.some(
    (r) => r.state && r.state.toLowerCase() === stateName.toLowerCase()
  );

  return (
    <section className="bg-white py-14 px-4 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-navy">Excellent</span>
            <TrustpilotStars size="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-navy">
            {hasStateMatch
              ? `What ${stateName} Students Say on Trustpilot`
              : "JustInsurance Reviews on Trustpilot"}
          </h2>
          <p className="text-sm text-gray-600">
            Rated <strong>{tp.score}</strong> out of 5 based on{" "}
            <a
              href={TRUSTPILOT.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-navy underline hover:text-gold"
            >
              {tp.count} reviews
            </a>{" "}
            on{" "}
            <span className="font-bold" style={{ color: "#00B67A" }}>
              Trustpilot
            </span>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <article
              key={r.name + r.date}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col"
            >
              <TrustpilotStars size="w-4 h-4" count={r.stars} />
              <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6 flex-grow">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#00B67A" }}
                >
                  <span className="text-white font-bold text-xs">{r.initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-navy text-sm">{r.name}</p>
                  <p className="text-gray-500 text-xs">
                    via Trustpilot{r.state ? ` · ${r.state}` : ""}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-6">
          <a
            href={TRUSTPILOT.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-navy underline hover:text-gold"
          >
            See all {tp.count} reviews on Trustpilot →
          </a>
        </div>
        {/* FTC 16 CFR 255.2(b): typicality disclosure accompanies the
            endorsements wherever this component renders. */}
        <p className="text-xs text-gray-500 text-center mt-4 max-w-2xl mx-auto">
          Reviews are real, unedited Trustpilot posts. They reflect individual
          experiences — individual results vary and are not a guarantee of
          passing or of similar outcomes.
        </p>
      </div>
    </section>
  );
}
