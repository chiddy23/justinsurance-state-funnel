// Whether a state's insurance PRELICENSING courses are approved per line of
// authority — meaning there is NO single combined "Life & Health" course. In
// those states the L&H offering is two separately state-approved courses (a
// Life course + an Accident & Health course), even if the state offers a
// combined EXAM. This is a course-structure fact, independent of the exam
// structure (see states.ts `noCombinedExam`, which is about the exam).
//
// VERIFIED per state against the regulator's own course-approval framework —
// do NOT add a state here without confirming it (many states, e.g. Florida with
// its single 2-15 Life & Health course #133726, DO approve a combined course):
//
//   Illinois — 50 Ill. Adm. Code 3119 certifies prelicensing courses per line
//     against separate content exhibits (Ex. E Life, Ex. F Accident & Health);
//     215 ILCS 5/500-25 treats Life and A&H as separate lines. IL has no
//     combined L&H course AND no combined exam. Owner-confirmed 2026-07-11.
//   Minnesota — the MN Dept. of Commerce prelicense course-approval application
//     is filed one line at a time ("CHOOSE ONE LINE OF AUTHORITY BELOW") and
//     requires "20 hours of education per line of authority"; Minn. Stat.
//     § 45.37 approval statements are issued per line. So MN L&H is two separate
//     approved courses. (MN DOES, however, offer a combined 135-item Life,
//     Accident & Health exam through PSI — verified 2026-07-14 against the PSI
//     MN candidate bulletin — so this is a course-only distinction for MN.)
const NO_COMBINED_COURSE = new Set(["illinois", "minnesota"]);

/**
 * True if the state approves prelicensing courses per line of authority, so its
 * "Life & Health" offering is two separately approved courses rather than one
 * combined course. Returns false for every unlisted state (default: a single
 * combined L&H course is permitted), so no other state's copy changes.
 */
export function hasNoCombinedCourse(slug?: string | null): boolean {
  return !!slug && NO_COMBINED_COURSE.has(slug.toLowerCase());
}
