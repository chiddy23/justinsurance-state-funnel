// Illinois live classroom/webinar format requirement. The HOUR MANDATE is
// STATUTORY: 215 ILCS 5/500-30(b) — 7.5 of the 20 prelicensing hours PER LINE
// of authority must be completed in a "classroom or webinar setting"
// (motor vehicle: 5 of 12.5). The verified-attendance element for webinars
// comes from 50 Ill. Adm. Code 3119.20 (Webinar/Virtual Class: attendance
// "monitored and validated based on personally identifiable information").
// Do NOT cite Part 3119 for the hour figures — Part 3119 sets only content
// distribution + procedural rules. The JustInsurance Illinois course includes
// the required live webinar component with attendance verification
// (owner-confirmed 2026-07-02, IL DOI compliance action).
//
// ALL copy below is attorney/owner-APPROVED VERBATIM — do not reword or
// strengthen. Gated on StateData.classroomWebinarHours so every other
// state's rendered output stays byte-identical.

import type { StateData } from "@/lib/states";
import type { FAQ } from "@/lib/faq-data";

export const IL_WEBINAR_CALLOUT_TITLE =
  "Illinois Format Requirement: Live Webinar Hours Included";

export const IL_WEBINAR_CALLOUT_BODY =
  "Illinois requires 7.5 of the 20 prelicensing hours for each line of authority to be completed through live classroom or webinar instruction with verified attendance; the remaining 12.5 hours per line are completed by self-study (215 ILCS 5/500-30(b); attendance-verified webinar per 50 Ill. Adm. Code 3119.20). Your JustInsurance Illinois course includes the required 7.5 live webinar hours per line — attendance is verified — plus 12.5 self-paced online hours per line.";

/** For heroes/cards where the full callout doesn't fit. */
export const IL_WEBINAR_SHORT_LINE =
  "7.5 live webinar + 12.5 self-paced hours per line — the format Illinois requires.";

export const IL_WEBINAR_FAQ: FAQ = {
  question: "Does Illinois require classroom or webinar hours for prelicensing?",
  answer:
    "Yes. Illinois requires 7.5 of the 20 hours per line of authority to be completed through live classroom or webinar instruction with verified attendance; the remaining 12.5 hours per line may be completed by self-study. JustInsurance's Illinois course includes the required 7.5 live webinar hours per line — attendance is verified — plus 12.5 self-paced online hours per line.",
};

/**
 * True when the state mandates live classroom/webinar prelicensing hours
 * (currently Illinois only). Use this — not `slug === "illinois"` — so the
 * behavior stays data-driven.
 */
export function hasClassroomWebinarHours(
  stateData: Pick<StateData, "classroomWebinarHours">
): boolean {
  return (
    typeof stateData.classroomWebinarHours === "number" &&
    stateData.classroomWebinarHours > 0
  );
}

/**
 * Exact-substring rewrites applied to FAQ answers on Illinois pages ONLY.
 * The shared FAQ string builders (src/lib/faq-data.ts) emit pure
 * self-paced / "no live sessions" claims that are FALSE for Illinois under
 * 50 Ill. Adm. Code 3119. Keyed on the exact source sentences so:
 *   (1) non-Illinois states are never touched (this runs only when
 *       classroomWebinarHours is set), and
 *   (2) each rewrite self-deactivates the moment the source string in
 *       faq-data.ts is itself corrected — no double-fix risk.
 */
const IL_FALSE_CLAIM_REWRITES: ReadonlyArray<{ find: string; replace: string }> = [
  {
    // getPrelicensingHubFAQs — "Do I need to finish prelicensing before the exam?"
    // IDOI "Become a Resident Producer": complete prelicensing, THEN register with
    // Pearson VUE, and PRESENT proof of completion at the test center (not "submit
    // when scheduling"); the completion is valid 1 year (50 Ill. Adm. Code
    // 3119.45(a)(1): "The pre-licensing education course must be used within 1 year
    // after completion.").
    find: "receive your certificate of completion, and submit it when scheduling your exam.",
    replace:
      "receive your certificate of completion, then register with Pearson VUE and bring a copy to the test center on exam day — Illinois will not allow you to sit for the exam without it. Under 50 Ill. Adm. Code 3119.45(a)(1), your course completion must be used within one year.",
  },
  {
    // getPrelicensingCourseFAQs ([loa]) — "Is the course state-approved?"
    find: "you receive an official certificate of completion that Pearson VUE accepts for exam registration.",
    replace:
      "you receive an official certificate of completion; bring a copy to the Pearson VUE test center on exam day (Illinois will not let you sit without it), and use it within one year of completion (50 Ill. Adm. Code 3119.45(a)(1)).",
  },
  {
    // getPrelicensingHubFAQs — "Can I complete ... prelicensing online?"
    find: "There are no scheduled live sessions or fixed class times.",
    replace:
      "The required live webinar sessions are scheduled and attendance is verified; the remaining hours are self-paced with no fixed class times.",
  },
  {
    // getPrelicensingHubFAQs — same answer, opening claim
    find: "approves online, self-paced prelicensing education, and that is exactly what JustInsurance provides.",
    replace:
      "approves online prelicensing education, and JustInsurance's Illinois course is delivered online — the required live webinar sessions plus self-paced study for the remaining hours.",
  },
  {
    // getPrelicensingCourseFAQs — "How long is the ... course?"
    find: "are delivered through structured video lessons, reading materials, and chapter quizzes that you complete at your own pace.",
    replace:
      "are delivered as the required 7.5 live webinar hours per line of authority — attendance is verified — plus 12.5 self-paced hours per line of video lessons, reading materials, and chapter quizzes.",
  },
  {
    // getPrelicensingCourseFAQs (L&H) — "Is the ... course state-approved?"
    // Illinois certifies Life and A&H separately, so a single "Life & Health
    // ... line of authority" is inaccurate — it is two lines.
    find: "meets all state education requirements for the Life & Health Insurance line of authority",
    replace:
      "meets all Illinois education requirements for both the Life and the Accident & Health lines of authority",
  },
  {
    // getPrelicensingHubFAQs — "What does Illinois insurance prelicensing cover?"
    // Illinois certifies Life and A&H as separate lines (215 ILCS 5/500-30(b)),
    // so the L&H package is two courses, not one "single enrollment" course.
    find: "The combined Life & Health course covers all of the above in a single enrollment.",
    replace:
      "In Illinois, Life & Health is two separately state-certified courses — a 20-hour Life course and a 20-hour Accident & Health course — that together cover all of the above, bundled at one price.",
  },
  {
    // getStateHubFAQs — "How do I get my Illinois insurance license?"
    find: "JustInsurance offers fully online, self-paced prelicensing courses approved for Illinois that get you to exam day confident and prepared.",
    replace:
      "JustInsurance offers state-approved Illinois prelicensing — the required live webinar sessions plus self-paced online study — that gets you to exam day confident and prepared.",
  },
  {
    // getStateHubFAQs — "How long does it take to get licensed ...?"
    find: "JustInsurance's self-paced format lets you move as fast or as steady as your schedule allows.",
    replace:
      "The self-paced portion of JustInsurance's Illinois course lets you move as fast or as steady as your schedule allows.",
  },
  {
    // getStateHubFAQs — "How do I get my Illinois insurance license?" step 3.
    // Illinois does NOT require fingerprinting or a separate background check
    // for resident producers (fingerprints are public-adjuster only, 215 ILCS
    // 5/1520(c)); background history is self-disclosure on the NIPR
    // application. The shared template lists "complete a background check" as a
    // distinct step — false for Illinois.
    find: "Third, complete a background check.",
    replace:
      "Third, answer the background-history questions on your NIPR application — Illinois does not require fingerprinting or a separate background check for resident producers.",
  },
  {
    // getStateHubFAQs — "How long does it take to get licensed ...?" — same
    // false "background check" step in the timeline sentence.
    find: "clearing your background check, and waiting",
    replace: "and waiting",
  },
];

/**
 * Illinois-only FAQ pipeline: (1) rewrites answers containing claims that
 * are false for Illinois (see IL_FALSE_CLAIM_REWRITES), then (2) appends the
 * approved webinar-format FAQ. No-ops (returns the same array) for every
 * other state, and de-dupes in case another layer already added the
 * identical question — so FAQPage JSON-LD never double-emits it.
 */
export function withIlWebinarFaq(
  faqs: FAQ[],
  stateData: Pick<StateData, "classroomWebinarHours">
): FAQ[] {
  if (!hasClassroomWebinarHours(stateData)) return faqs;
  const sanitized = faqs.map((f) => {
    let answer = f.answer;
    for (const { find, replace } of IL_FALSE_CLAIM_REWRITES) {
      answer = answer.split(find).join(replace);
    }
    return answer === f.answer ? f : { ...f, answer };
  });
  if (sanitized.some((f) => f.question === IL_WEBINAR_FAQ.question)) {
    return sanitized;
  }
  return [...sanitized, IL_WEBINAR_FAQ];
}
