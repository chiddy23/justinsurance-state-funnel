// Mandatory advertising disclosures that specific states require an approved
// insurance-education provider to display VERBATIM in its advertising. Rendered
// where we hold ourselves out as state-approved (StateProviderBadge). Keyed by
// slug; states with no such mandate are absent, so their output is unchanged.
//
// Sources (audit 2026-07-06):
//   Minnesota — Minn. Stat. 45.37(c) requires the exact approval statement, and
//     45.37(f) requires the number of approved hours to be prominently displayed.
//   Oregon — OAR 836-071-0190 (pre-licensing) / 836-071-0242 (CE) require the
//     "registered with the [Division]; registration does not imply endorsement"
//     statement in provider advertising.

export interface PrelicenseCourseApproval {
  /** State-assigned course approval ID (e.g. FL DFS course ID, IL SBS course #). */
  courseId: string;
  /** State-assigned offering ID (where the state issues one). */
  offeringId?: string;
  /** Human-readable date the current approval runs through (where published). */
  approvedThrough?: string;
}

export interface StateDisclosure {
  /** Exact statement required in PRELICENSING advertising. */
  prelicense: string;
  /** Exact statement required in CE advertising. */
  ce: string;
  /** Internal citation (not rendered). */
  cite: string;
  /**
   * Per-line-of-authority prelicensing course approvals, keyed by LOA slug
   * (life | health | life-and-health). Rendered in prelicensing advertising
   * where a state requires the course ID number shown (FL Rule 69B-227.250(1)).
   */
  prelicenseCourseIds?: Record<string, PrelicenseCourseApproval>;
  /**
   * Line-agnostic prelicensing course approval — for states where ONE approved
   * course satisfies a single prelicensing requirement common to every line of
   * authority, completed once (California post-AB 943: a single 12-hour Code &
   * Ethics course that meets the ethics requirement). Rendered on every prelicensing page
   * regardless of LOA, in place of the per-LOA prelicenseCourseIds above.
   */
  singleCourseId?: PrelicenseCourseApproval & { title?: string };
}

export const STATE_DISCLOSURES: Record<string, StateDisclosure> = {
  // Minnesota — Minn. Stat. § 45.37(c) requires the exact approval statement below
  // (naming the lines) in prelicensing advertising; § 45.37(f) requires the number
  // of approved hours to be prominently displayed. Both are baked into the
  // statement so every page that renders it stays compliant. Provider #21053306.
  minnesota: {
    prelicense:
      "This course has been approved by the Minnesota Commissioner of Commerce for life and accident and health prelicense education. Minnesota Department of Commerce approved provider #21053306. Approved prelicensing hours: Life 20; Accident & Health 20 (each line is a separately approved course).",
    ce: "This course has been approved by the Minnesota Commissioner of Commerce for continuing education (see course listing for the number of approved hours). Minnesota Department of Commerce approved provider #21053306.",
    cite: "Minn. Stat. 45.37(c) & (f)",
  },
  // Hawaii — HRS § 431:9A-159 (Advertising): a course may not be advertised as
  // approved for CE credit unless approved in writing by the Commissioner, and
  // any such ad must include (1) provider name, course title and course number,
  // (2) the exact statement below, (3) the number of approved credit hours, and
  // (4) tuition/fees. Audit 2026-07-14. ⚠ OWNER GATE BEFORE DEPLOY: confirm the
  // Hawaii CE provider certificate (§ 431:9A-151) and per-course approval
  // numbers/hours from the DCCA record; the course title/number/hours/tuition
  // must appear in the course listing this statement accompanies. If Hawaii
  // approval is NOT current, remove "approved" claims from HI CE pages instead.
  hawaii: {
    prelicense:
      "Hawaii does not require prelicensing education for insurance licensing. JustInsurance offers Hawaii exam-preparation courses; see the course listing for details and pricing.",
    ce: "Approved by the Hawaii State Insurance Commissioner for continuing education credit. See the course listing for the course title, course number, number of approved credit hours, and tuition.",
    cite: "HRS § 431:9A-159(a)-(b)",
  },
  oregon: {
    prelicense:
      "JustInsurance is registered with the Oregon Insurance Division. Registration does not imply endorsement by the Insurance Division.",
    ce: "JustInsurance is registered with the Oregon Division of Financial Regulation. Registration does not imply endorsement by the Division.",
    cite: "OAR 836-071-0190 / 836-071-0242",
  },
  // Florida — Rule 69B-228.150 F.A.C. requires the exact CE-approval statement
  // below on CE advertising, with the approved provider name + Department ID.
  // Rule 69B-227.250(1) requires prelicensing ads to show provider name/number
  // and study method (the Florida course ID number per course is owner-supplied
  // from the DFS provider portal and appended once available).
  florida: {
    prelicense:
      "JustInsurance is an approved Florida insurance prelicensing provider (Florida Department of Financial Services provider #373671). Courses are offered 100% online and self-paced.",
    ce: "This course has been approved by the Florida Department of Financial Services for insurance continuing education credit. Approved provider: JustInsurance (Florida DFS #373671). See the course listing for the number of approved credit hours.",
    cite: "Rule 69B-227.250(1) (prelicensing) & 69B-228.150 (CE), F.A.C.",
    prelicenseCourseIds: {
      // 2-14 Life (incl. Annuities & Variable). Owner-supplied from DFS portal 2026-07-07.
      life: { courseId: "129317", offeringId: "1225727", approvedThrough: "September 19, 2026" },
      // 2-40 Health.
      health: { courseId: "133612", offeringId: "1239866", approvedThrough: "April 18, 2027" },
      // 2-15 Life & Health combined.
      "life-and-health": { courseId: "133726", offeringId: "1239185", approvedThrough: "April 30, 2027" },
    },
  },
  // Illinois — 50 Ill. Adm. Code 3119.30(j): a provider may advertise a course
  // as approved only after Department approval. Approval owner-confirmed
  // 2026-07-11; #500030852 is the SBS/NAIC education provider ID. Per-course
  // SBS course numbers to be appended to prelicenseCourseIds once captured.
  illinois: {
    prelicense:
      "JustInsurance is an approved Illinois insurance-education provider (Illinois education provider #500030852). Verify our approval on the state's official system, State Based Systems, at statebasedsystems.com.",
    ce: "JustInsurance is an approved Illinois insurance continuing-education provider (Illinois education provider #500030852). Verify our approval at statebasedsystems.com. See the course listing for the number of approved credit hours.",
    cite: "50 Ill. Adm. Code 3119.30(j)",
    // SBS course-approval numbers (owner-supplied 2026-07-11). Illinois has NO
    // combined Life & Health course — the L&H package is these two separately
    // approved courses, so the L&H page shows both numbers.
    prelicenseCourseIds: {
      life: { courseId: "6000188882" },
      health: { courseId: "6000193666" },
    },
  },
  // California — CDI approves insurance prelicensing/CE providers. Effective
  // 1/1/2026, AB 943 (amending Cal. Ins. Code § 1749) repealed the former
  // line-specific product-hour requirements; the sole mandatory prelicensing is
  // a SINGLE 12-hour Code & Ethics course (CDI course #393177, owner-confirmed
  // 2026-07-13). It is line-agnostic — one course satisfies every line — so it
  // lives in singleCourseId, not the per-LOA prelicenseCourseIds. (The audit's
  // 392011/392731/392902 were the wrong/unverified per-line numbers; #393177 is
  // the one real approval.)
  california: {
    prelicense:
      "JustInsurance is an approved California insurance prelicensing education provider (California Department of Insurance provider #6012338). Effective January 1, 2026, California requires a single 12-hour Code and Ethics prelicensing course for resident license applicants (AB 943, Cal. Ins. Code § 1749). Courses are offered 100% online and self-paced.",
    ce: "This course is approved by the California Department of Insurance for insurance continuing education credit. Approved provider: JustInsurance (CDI provider #6012338). See the course listing for the number of approved credit hours.",
    cite: "Cal. Ins. Code § 1749 (as amended by AB 943, eff. 1/1/2026)",
    singleCourseId: {
      courseId: "393177",
      title: "12-Hour Study on Ethics and the California Insurance Code",
    },
  },
};

/** The mandatory disclosure for a state, or undefined if the state has none. */
export function stateDisclosure(slug?: string | null): StateDisclosure | undefined {
  return slug ? STATE_DISCLOSURES[slug.toLowerCase()] : undefined;
}
