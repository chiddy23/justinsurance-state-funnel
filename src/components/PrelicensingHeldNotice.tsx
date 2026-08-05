import Link from "next/link";
import { isPrelicensingApprovedComingSoon } from "@/lib/prelicensing-status";

/**
 * Renders IN PLACE OF the full prelicensing course page for a state that
 * MANDATES prelicensing but whose JustInsurance provider approval is still
 * PENDING (see isPrelicensingHeld). We must not advertise a "state-approved
 * prelicensing course" before the state approval issues, so held pages show
 * this neutral "opening soon" notice, are set noindex, and are excluded from
 * the sitemap. Reverts automatically the moment the state's
 * providerApprovalNumber is set to a real number.
 */
export default function PrelicensingHeldNotice({
  stateName,
  stateSlug,
  loaName,
  providerApprovalNumber,
}: {
  stateName: string;
  stateSlug: string;
  loaName?: string;
  /**
   * The state's providerApprovalNumber. A REAL number (e.g. NY #80025) means the
   * provider approval HAS issued and the page is held only because the
   * prelicensing course is not open for enrollment yet (prelicensingCoursesLive
   * === false) — the notice then reads "Approved provider — courses coming soon"
   * WITH the number, not "approval pending". "PENDING" (or omitted) keeps the
   * genuinely-pending copy. Parent (state prelicensing page) passes this through.
   */
  providerApprovalNumber?: string;
}) {
  // Approved provider, courses simply not live yet — distinct from a genuinely
  // pending approval. isPrelicensingHeld already decided the page is held; within
  // a held page prelicensingCoursesLive is false, so the number alone decides.
  const approvedComingSoon = isPrelicensingApprovedComingSoon({
    providerApprovalNumber: providerApprovalNumber ?? "PENDING",
    prelicensingCoursesLive: false,
  });
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-gold-deep font-semibold uppercase tracking-wide text-sm mb-3">
        {stateName} Prelicensing{loaName ? ` — ${loaName}` : ""}
      </p>
      <h1 className="text-3xl md:text-4xl font-bold text-navy mb-5">
        Enrollment opening soon
      </h1>
      <p className="text-gray-600 leading-relaxed mb-8">
        {approvedComingSoon ? (
          <>
            JustInsurance is an approved {stateName} provider (#
            {providerApprovalNumber}) — our prelicensing course is coming soon
            and isn&apos;t open for enrollment yet. Tell us you&apos;re
            interested and we&apos;ll let you know the moment it&apos;s
            available.
          </>
        ) : (
          <>
            Our {stateName} prelicensing course is completing state approval and
            isn&apos;t open for enrollment yet. Tell us you&apos;re interested
            and we&apos;ll let you know the moment it&apos;s available.
          </>
        )}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/contact"
          className="bg-navy text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy-light transition-colors"
        >
          Get notified
        </Link>
        <Link
          href={`/${stateSlug}`}
          className="border-2 border-navy text-navy font-semibold px-6 py-3 rounded-lg hover:bg-navy hover:text-white transition-colors"
        >
          {stateName} license requirements
        </Link>
      </div>
    </main>
  );
}
