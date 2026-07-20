import { stateDisclosure } from "@/lib/state-disclosures";

/**
 * Renders a state's mandatory prelicensing approval statement on prelicensing
 * advertising pages, including the per-course state course ID where required
 * (Florida Rule 69B-227.250(1) F.A.C.). Returns null for states with no
 * prelicensing-advertising mandate, so every other state's output is unchanged.
 * Data lives in state-disclosures.ts.
 */
export default function PrelicenseApprovalNotice({
  stateSlug,
  loaSlug,
  stateName,
}: {
  stateSlug?: string;
  loaSlug?: string;
  stateName?: string;
}) {
  const disclosure = stateDisclosure(stateSlug);
  if (!disclosure?.prelicense) return null;

  const ids = disclosure.prelicenseCourseIds;
  const course = loaSlug ? ids?.[loaSlug] : undefined;
  // Line-agnostic single-course approval (e.g. California's one 12-hour Code &
  // Ethics course): shown on every prelicensing page regardless of LOA.
  const single = disclosure.singleCourseId;
  // States with no combined Life & Health course (e.g. Illinois): the L&H page
  // is the two separate Life + Health courses, so show both approval numbers.
  const lhSplit =
    loaSlug === "life-and-health" && !course && ids?.life && ids?.health
      ? { life: ids.life, health: ids.health }
      : null;
  const st = stateName ?? "State";

  return (
    <div className="bg-gold/10 border-y border-gold/30 py-3 px-4">
      <p className="max-w-4xl mx-auto text-center text-sm text-navy">
        {disclosure.prelicense}
        {course && (
          <>
            {" "}
            {st} approved course #{course.courseId}
            {course.offeringId ? ` (offering ${course.offeringId})` : ""}
            {course.approvedThrough
              ? `, approved through ${course.approvedThrough}`
              : ""}
            .
          </>
        )}
        {lhSplit && (
          <>
            {" "}
            {st} approved courses: Life #{lhSplit.life.courseId} and Health #
            {lhSplit.health.courseId} — this package is two separately approved
            courses.
          </>
        )}
        {single && (
          <>
            {" "}
            {st}-approved course #{single.courseId}
            {single.title ? ` (“${single.title}”)` : ""} — this single course
            satisfies the ethics prelicensing requirement that applicants for
            every line of authority must complete, and only needs to be completed
            once, no matter how many lines you apply for.
          </>
        )}
      </p>
    </div>
  );
}
