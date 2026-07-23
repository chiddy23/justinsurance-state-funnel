// Mandatory advertising disclosures that specific states require an approved
// insurance-education provider to display VERBATIM in its advertising. Rendered
// where we hold ourselves out as state-approved (StateProviderBadge). Keyed by
// slug; states with no such mandate are absent, so their output is unchanged.
//
// Sources (audit 2026-07-06; regulator names re-verified against primary sources
// 2026-07-22):
//   Minnesota — Minn. Stat. 45.37(c) requires the exact approval statement, and
//     45.37(f) requires the number of approved hours to be prominently displayed.
//     Regulator is the Minnesota Department of Commerce / Commissioner of
//     Commerce (current). The 20 prelicensing hours per major line come from
//     Minn. Stat. 60K.36, subd. 4 ("20 hours per major line of authority").
//   Oregon — OAR 836-071-0190(4) (pre-licensing schools) and 836-071-0242(5) (CE
//     providers) each require a statement that the school/provider is registered
//     with the DIVISION OF FINANCIAL REGULATION and that registration does not
//     imply endorsement by the Division of Financial Regulation. Do NOT write
//     "Insurance Division": that body was folded into DFR in 2016, OAR
//     440-001-9001 (eff. 11/15/2016) makes every reference to the Oregon
//     Insurance Division a reference to DFR, and both rules were corrected to
//     name DFR on 8/16/2024 (ID 26-2024 and ID 27-2024). Verified against the
//     Oregon Secretary of State OARD 2026-07-22.

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
   * where a state requires the course ID number shown (FL Rule 69B-227.250(4)).
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
  // ⚠ OWNER GATE: § 45.37(c)'s CE form of the statement is "…approved by the
  // Minnesota Commissioner of Commerce for ..... hours for (relevant industry)
  // continuing education" — the hour count belongs INSIDE the statement. We point
  // at the course listing instead because the approved hours are per-course and
  // owner-supplied. Supply them and inline the number before relying on this for
  // Minnesota CE advertising.
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
  // (4) tuition/fees. Audit 2026-07-14. CE PROVIDER CERTIFICATE (§ 431:9A-151)
  // SUBSTANTIATED 2026-07-22: registration #500031918 (JUSTINSURANCE LLC, CE
  // Provider, Approved, exp 07/01/2027) from the owner's official NAIC SBS
  // provider-approval export, so the "#500031918" provider-registration number is
  // appended to `ce` below (mirrors the Oregon CE pattern). ⚠ OWNER GATE BEFORE
  // DEPLOY still applies to the PER-COURSE items: the course title, course number,
  // number of approved credit hours, and tuition remain owner-supplied and must
  // appear in the course listing this statement accompanies. If Hawaii approval is
  // NOT current, remove "approved" claims from HI CE pages instead.
  // Re-verified 2026-07-22: § 431:9A-159(b)(2) mandates the statement verbatim as
  // "Approved by the Hawaii State Insurance Commissioner for continuing education
  // credit" — do not reword it. § 431:9A-151 is indeed the CE course provider
  // certificate. The prelicense line below is confirmed by the Pearson VUE State
  // of Hawaii Insurance Examination Candidate Handbook (rev. 01/2026): "The
  // Hawaii Insurance Division does not require a specific program of
  // pre-licensing education, or otherwise pre-screen examination candidates."
  hawaii: {
    prelicense:
      "Hawaii does not require prelicensing education for insurance licensing. JustInsurance offers Hawaii exam-preparation courses; see the course listing for details and pricing.",
    ce: "Approved by the Hawaii State Insurance Commissioner for continuing education credit. See the course listing for the course title, course number, number of approved credit hours, and tuition. Hawaii Insurance Division continuing education provider registration #500031918.",
    cite: "HRS § 431:9A-159(a)-(b); § 431:9A-151 (CE course provider certificate); CE provider #500031918",
  },
  // Oregon — the regulator is the Division of Financial Regulation (DFR), a
  // division of the Department of Consumer and Business Services. The former
  // Oregon Insurance Division no longer exists. Both rules require the named
  // Division in BOTH halves of the statement (registered with / endorsement by),
  // and the CE rule requires saying the provider AND its courses are registered.
  //
  // Registration numbers (both 9-digit NAIC SBS provider IDs; DFR administers
  // Oregon insurance-education registration through State Based Systems):
  //   CE PROVIDER  #500031572 — OAR 836-071-0242 — substantiates the CE claim
  //     below. OWNER-RECONFIRMED 2026-07-22 as JustInsurance's Oregon CE provider
  //     number; matches the 2026-07-06 owner-supplied SBS provider export. Under
  //     OAR 836-071-0242(5) the "registered with DFR" CE claim is now backed by a
  //     real number, so it is appended to `ce` below.
  //   PRELICENSING SCHOOL #500030899 — OAR 836-071-0190 — a SEPARATE credential
  //     (Oregon mandates prelicensing). OAR 836-071-0190(4) does not require a
  //     number in the statement, so `prelicense` carries the mandated sentences
  //     only; the school number was NOT re-confirmed by the owner this session, so
  //     it is intentionally NOT asserted in rendered copy (HELD for owner).
  // HELD/verify caveat: the live public SBS provider-record lookup is interactive
  // (403 to a direct fetch), so 500031572 could not be independently re-pulled this
  // session — the CE number rests on owner authority + the SBS export, which is why
  // no "verify at <lookup>" invitation is added (avoids pointing a regulator at a
  // record we could not confirm resolves publicly).
  oregon: {
    prelicense:
      "JustInsurance is registered with the Oregon Division of Financial Regulation. Registration does not imply endorsement by the Division of Financial Regulation.",
    ce: "JustInsurance and its courses are registered with the Oregon Division of Financial Regulation. Registration does not imply endorsement by the Division of Financial Regulation. Oregon DFR continuing education provider registration #500031572.",
    cite: "OAR 836-071-0190(4) (prelicensing) & 836-071-0242(5) (CE); CE provider #500031572, prelicensing school #500030899",
  },
  // Florida — Rule 69B-228.150(5)(a) F.A.C. requires the exact CE-approval
  // statement below to be prominently displayed on CE advertising, alongside the
  // approved provider name + Department provider ID, the course name + course ID
  // number, and the approved credit hours.
  // Rule 69B-227.250(4) F.A.C. (NOT (1) — (1) is the "no advertising before
  // written approval" prohibition) requires prelicensing ads to display the
  // course name, course authority, provider number, provider name, the Florida
  // course identification number, and study method. Course IDs below are
  // owner-supplied from the DFS provider portal. ⚠ Course name and course
  // authority are NOT emitted by PrelicenseApprovalNotice.tsx yet — see that
  // component before relying on this for Florida prelicensing ad compliance.
  florida: {
    prelicense:
      "JustInsurance is an approved Florida insurance prelicensing provider (Florida Department of Financial Services provider #373671). Courses are offered 100% online and self-paced.",
    ce: "This course has been approved by the Florida Department of Financial Services for insurance continuing education credit. Approved provider: JustInsurance (Florida DFS #373671). See the course listing for the number of approved credit hours.",
    cite: "Rule 69B-227.250(4) (prelicensing) & 69B-228.150(5)(a) (CE), F.A.C.",
    prelicenseCourseIds: {
      // 2-14 Life (incl. Annuities & Variable). Owner-supplied from DFS portal 2026-07-07.
      life: { courseId: "129317", offeringId: "1225727", approvedThrough: "September 19, 2026" },
      // 2-40 Health.
      health: { courseId: "133612", offeringId: "1239866", approvedThrough: "April 18, 2027" },
      // 2-15 Life & Health combined.
      "life-and-health": { courseId: "133726", offeringId: "1239185", approvedThrough: "April 30, 2027" },
    },
  },
  // Illinois — 50 Ill. Adm. Code 3119.30(j) (amended at 50 Ill. Reg. 753, eff.
  // 12/30/2025): "Providers may not advertise a course as approved for
  // pre-licensing or continuing education credit in this State until the course
  // has been approved by the Department." It is a prohibition, not a mandated
  // verbatim statement — the wording below is ours, so it must stay literally
  // true. Regulator is the Illinois Department of Insurance (50 Ill. Adm. Code
  // Title 50, Ch. I), a standalone department, not IDFPR. Approval
  // owner-confirmed 2026-07-11; #500030852 is the SBS/NAIC education provider
  // ID. Per-course SBS course numbers to be appended once captured.
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
  // California — CDI approves insurance prelicensing/CE providers. AB 943
  // (Stats. 2025, ch. 566, approved 10/10/2025, no urgency or delayed operative
  // clause, so effective 1/1/2026) amended Cal. Ins. Code § 1749 to eliminate the
  // 20 hours of general prelicensing study; what remains is 12 hours of study on
  // ethics and the Insurance Code, including one hour on insurance fraud. Per
  // § 1749(a)(1) an applicant seeking more than one of the property broker-agent,
  // casualty broker-agent, life, accident and health or sickness, or personal
  // lines broker-agent licenses need complete only ONE 12-hour course — so the
  // approval is line-agnostic and lives in singleCourseId, not the per-LOA
  // prelicenseCourseIds. Note § 1749(a)(2) applies the same 12-hour requirement
  // to applicants already licensed in California as NONRESIDENTS, so the
  // requirement is not resident-only. CDI course #393177, owner-confirmed
  // 2026-07-13. (The audit's 392011/392731/392902 were the wrong/unverified
  // per-line numbers; #393177 is the one real approval.)
  california: {
    prelicense:
      "JustInsurance is an approved California insurance prelicensing education provider (California Department of Insurance provider #6012338). Effective January 1, 2026, California requires new license applicants to complete a single 12-hour course of study on ethics and the Insurance Code, including one hour on insurance fraud (AB 943, Cal. Ins. Code § 1749). Courses are offered 100% online and self-paced.",
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
