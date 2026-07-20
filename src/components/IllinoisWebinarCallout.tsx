import React from "react";
import {
  IL_WEBINAR_CALLOUT_TITLE,
  IL_WEBINAR_CALLOUT_BODY,
} from "@/lib/il-webinar";

/**
 * Illinois live-webinar format callout — 50 Ill. Adm. Code Part 3119.
 * Amber/gold info panel using the same bordered-gold card shell as the
 * PassGuarantee section so it reads as a first-class site element, not a
 * bolted-on disclaimer. Copy is approved verbatim (see src/lib/il-webinar.ts).
 *
 * Render sites gate on `hasClassroomWebinarHours(stateData)` so this
 * component is NEVER mounted for any state other than Illinois — zero
 * rendered-output change elsewhere.
 */
export default function IllinoisWebinarCallout() {
  return (
    <section className="bg-white pt-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="border-2 border-gold rounded-2xl bg-amber-50 p-6 md:p-8">
          <div className="flex items-start gap-4">
            {/* Broadcast / live-session icon */}
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">
                {IL_WEBINAR_CALLOUT_TITLE}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {IL_WEBINAR_CALLOUT_BODY}
              </p>
              <p className="text-gray-700 leading-relaxed mt-3 text-sm">
                In the live webinar, your attendance and participation are
                actively monitored and verified at periodic intervals. To earn
                the required 7.5 hours (450 minutes) of credit per line, you must
                be present and engaged for the full session, respond to each
                periodic &ldquo;check-in&rdquo; poll confirming you are present,
                and complete every engagement activity. JustInsurance takes
                Illinois&apos;s live-instruction requirement seriously &mdash;{" "}
                <strong>no exceptions are granted</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
