import type { StateData } from "@/lib/states";
import { hasNoCombinedCourse } from "@/lib/course-structure";
import { passingScoreProse, formatPassingScore } from "@/lib/exam-score";

export interface FAQ {
  question: string;
  answer: string;
}

export interface StateDataForFAQ {
  name: string;
  slug: string;
  abbreviation: string;
  doiName: string;
  doiPhone: string;
  doiUrl: string;
  minAge: number;
  residencyRequirement: string;
  backgroundRequirement: string;
  fingerprintRequirement: string;
  applicationProcess: string;
  applicationFee: string;
  totalCostRange: string;
  totalLicensingTime: string;
  passingScore: number;
  passRate: string;
  examProvider: string;
  examFee: string;
  retakeWaitingPeriod: string;
  retakeLimitInfo: string;
  licenseDuration: string;
  avgIncome: string;
  firstYearIncome: string;
  topProducerIncome: string;
  jobGrowth: string;
  reciprocityInfo: string;
  sponsorshipRequirement: string;
  // True unless the state's JustInsurance provider approval is still PENDING
  // (currently NY, WA). Gates every "state-approved" / "we report to the DOI"
  // claim so pending states never assert an approval that has not issued.
  providerApproved: boolean;
  // Prelicensing
  lifeHours: string | number;
  healthHours: string | number;
  combinedHours: string | number;
  lifePrice: string;
  healthPrice: string;
  combinedPrice: string;
  combinedSavings: string;
  courseAccessDays: string;
  // CE
  ceTotalHours: number;
  ceRenewalPeriod: string;
  ceEthicsHours: number;
  cePackagePrice: string;
  /**
   * Higher CE hour total a NEW licensee must complete before their FIRST
   * renewal, where the state sets one (states.ts `ce.firstTermHours`). Currently
   * Massachusetts only: 60 credits — 3 of them ethics — before the first renewal
   * date, then 45 credits (3 ethics) per 3-year cycle after that
   * (M.G.L. c. 175, § 177E; 211 CMR 50.00). Undefined for every other state, so
   * their CE copy renders unchanged.
   */
  ceFirstTermHours?: number;
  // CE compliance (optional — only populated for states with researched data)
  ceLateFee?: string;
  ceGracePeriod?: string;
  ceReinstatementFee?: string;
  ceReinstatementWindow?: string;
  ceCarryForward?: string;
  ceLapseConsequence?: string;
}

/**
 * Build the rich StateDataForFAQ object from a StateData record.
 * All data lives in states.ts — no secondary JSON import required.
 */
export function buildFaqData(stateData: StateData): StateDataForFAQ {
  return {
    name: stateData.name,
    slug: stateData.slug,
    abbreviation: stateData.abbreviation,
    doiName: stateData.doiName,
    doiPhone: stateData.doiPhone,
    doiUrl: stateData.doiUrl,
    minAge: stateData.minAge,
    residencyRequirement: stateData.residencyRequirement,
    backgroundRequirement: stateData.backgroundRequirement,
    fingerprintRequirement: stateData.fingerprintRequirement,
    applicationProcess: stateData.applicationProcess,
    applicationFee: stateData.applicationFee,
    totalCostRange: stateData.totalCostRange,
    totalLicensingTime: stateData.totalLicensingTime,
    passingScore: stateData.examInfo.passingScore,
    passRate: stateData.examInfo.passRate,
    examProvider: stateData.examInfo.examProvider,
    examFee: stateData.examInfo.examFee,
    retakeWaitingPeriod: stateData.examInfo.retakeWaitingPeriod,
    retakeLimitInfo: stateData.examInfo.retakeLimitInfo,
    licenseDuration: stateData.licenseDuration,
    avgIncome: stateData.avgIncome,
    firstYearIncome: stateData.firstYearIncome,
    topProducerIncome: stateData.topProducerIncome,
    jobGrowth: stateData.jobGrowth,
    reciprocityInfo: stateData.reciprocityInfo,
    sponsorshipRequirement: stateData.sponsorshipRequirement,
    providerApproved: stateData.providerApprovalNumber !== "PENDING",
    lifeHours: stateData.prelicensing.life.hours,
    healthHours: stateData.prelicensing.health.hours,
    combinedHours: stateData.prelicensing.lifeAndHealth.hours,
    lifePrice: stateData.prelicensing.life.price.replace("$", ""),
    healthPrice: stateData.prelicensing.health.price.replace("$", ""),
    combinedPrice: stateData.prelicensing.lifeAndHealth.price.replace("$", ""),
    combinedSavings: stateData.combinedSavings,
    courseAccessDays: stateData.courseAccessDays,
    ceTotalHours: stateData.ce.totalHours,
    ceRenewalPeriod: stateData.ce.renewalPeriod,
    ceEthicsHours: stateData.ce.ethicsHours,
    cePackagePrice: stateData.ce.packagePrice,
    ceFirstTermHours: stateData.ce.firstTermHours,
    ceLateFee: stateData.ce.compliance?.lateFee,
    ceGracePeriod: stateData.ce.compliance?.gracePeriod,
    ceReinstatementFee: stateData.ce.compliance?.reinstatementFee,
    ceReinstatementWindow: stateData.ce.compliance?.reinstatementWindow,
    ceCarryForward: stateData.ce.compliance?.carryForward,
    ceLapseConsequence: stateData.ce.compliance?.lapseConsequence,
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

// Returns "an" before vowel-initial words, "a" otherwise
function aOrAn(word: string): string {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

// Ensures a dollar value has exactly one $ prefix (handles "50", "$50", "$39")
function $(val: string): string {
  const s = val.toString().trim();
  return s.startsWith("$") ? s : `$${s}`;
}

// Returns true when the state does not require prelicensing hours for a given LOA
/**
 * Map a display LOA name to the slug used by PER_EXAM_SCORES ("life" | "health" |
 * "life-and-health"). LOA display names carry an " Insurance" suffix ("Health
 * Insurance", "Life & Health Insurance"), so a naive `loaName.toLowerCase()` or
 * `loaName === "Life & Health"` NEVER matches the score table — the lookup silently
 * fell back to the state-level score and rendered Michigan's Health exam as 72%
 * instead of 76%. Match on substance, not on the exact display string.
 */
function loaSlugFromName(loaName: string): "life" | "health" | "life-and-health" {
  if (/life\s*(&|and)\s*health/i.test(loaName)) return "life-and-health";
  if (/health/i.test(loaName)) return "health";
  return "life";
}

function isPleNotRequired(hours: string | number): boolean {
  if (typeof hours === "number") return false;
  const lower = hours.toLowerCase();
  return (
    lower.includes("not required") ||
    lower.includes("none required") ||
    lower.includes("no ") ||
    lower === "0"
  );
}

// Returns true for the literal states.ts value "no combined license" — a state
// that issues Life and Accident & Health as SEPARATE licenses, so no combined
// L&H license exists and there is no combined course to sell (currently
// Wisconsin: prelicensing.lifeAndHealth.hours === "no combined license", while
// Life and Health each still require their own 20 hours).
//
// This is deliberately a DATA-VALUE check, not a slug lookup: hasNoCombinedCourse()
// in course-structure.ts covers only the per-line course-APPROVAL states
// (Illinois, Minnesota) and does NOT include Wisconsin. Both conditions mean
// "there is no single combined L&H course", so callers OR them together.
function isNoCombinedLicense(hours: string | number): boolean {
  return typeof hours === "string" && /no combined/i.test(hours);
}

/**
 * The FIRST-renewal CE hour total, for states that require MORE hours before a
 * new licensee's first renewal than per recurring cycle (states.ts
 * `ce.firstTermHours`). Currently Massachusetts only: 60 credits before the
 * first renewal date, then 45 per 3-year cycle, 3 ethics either way
 * (M.G.L. c. 175, § 177E; 211 CMR 50.00). Our CE package is sized to the
 * RECURRING total, so a brand-new licensee who buys it alone under-completes
 * and can lapse — every hours answer has to say so.
 *
 * Returns undefined for every other state, so their answers are byte-identical.
 * The `>` guard keeps the "N additional hours" arithmetic positive; a state
 * whose first term were LOWER than its recurring total would need different
 * wording and is intentionally not surfaced by this copy.
 */
function firstTermCeHours(data: StateDataForFAQ): number | undefined {
  return data.ceFirstTermHours && data.ceFirstTermHours > data.ceTotalHours
    ? data.ceFirstTermHours
    : undefined;
}

// Returns a readable hours string, e.g. "40 hours" or "Not Required"
function formatHours(hours: string | number): string {
  if (typeof hours === "number") return `${hours} hours`;
  if (isPleNotRequired(hours)) return "Not Required";
  if (hours.toString().toLowerCase().includes("hour")) return hours.toString();
  return `${hours} hours`;
}

// ─── FAQ generators ───────────────────────────────────────────────────────────

/**
 * FAQs for state hub pages (/[state]/)
 * Targets queries like "how to get [state] insurance license"
 */
export function getStateHubFAQs(data: StateDataForFAQ): FAQ[] {
  const prelicensingRequired =
    !isPleNotRequired(data.lifeHours) ||
    !isPleNotRequired(data.healthHours) ||
    !isPleNotRequired(data.combinedHours);
  // No single combined L&H course exists either because the state approves
  // prelicensing per line (Illinois, Minnesota — hasNoCombinedCourse) or because
  // the state issues Life and Health as separate LICENSES (Wisconsin — the
  // "no combined license" data value, which hasNoCombinedCourse does not cover).
  const noCombinedCourse =
    hasNoCombinedCourse(data.slug) || isNoCombinedLicense(data.combinedHours);
  const combinedHoursNumeric =
    !isPleNotRequired(data.combinedHours) && /\d/.test(String(data.combinedHours));
  const approvedAdj = data.providerApproved ? "state-approved " : "";
  const pleStep = prelicensingRequired
    ? combinedHoursNumeric
      ? `complete a ${approvedAdj}prelicensing course (${formatHours(data.combinedHours)} ${
          noCombinedCourse
            ? "total for Life & Health — two separate courses"
            : "for the combined Life & Health line"
        })`
      : `complete a ${approvedAdj}prelicensing course — ${data.name} requires prelicensing education before you can sit for the exam`
    : `prepare for your exam — ${data.name} does not require a formal prelicensing course, though most candidates strongly recommend taking one`;

  return [
    {
      question: `How do I get my ${data.name} insurance license?`,
      answer: `Getting your ${data.name} insurance license involves four steps. First, ${pleStep}. Second, pass the ${data.name} state licensing exam administered by ${data.examProvider} — you need at least ${passingScoreProse(data.slug, data.passingScore)} to pass. Third, complete a background check${data.fingerprintRequirement.toLowerCase().includes("not required") || data.fingerprintRequirement.toLowerCase().includes("no finger") ? "" : ", including fingerprinting"}. Fourth, ${data.applicationProcess} and pay the ${data.doiName} application fee of ${$(data.applicationFee)}. Most candidates complete the entire process in ${data.totalLicensingTime}. JustInsurance offers fully online, self-paced ${prelicensingRequired ? "prelicensing" : "exam-prep"} courses ${data.providerApproved && prelicensingRequired ? `approved for ${data.name}` : `built to the ${data.name} exam content outline`} that get you to exam day confident and prepared.`,
    },
    {
      question: `How much does it cost to get ${aOrAn(data.name)} ${data.name} insurance license?`,
      answer: `The total cost to get your ${data.name} insurance license typically runs ${data.totalCostRange}. Here is how it breaks down: the ${data.examProvider} exam fee is ${$(data.examFee)}, the ${data.doiName} application fee is ${$(data.applicationFee)}${data.backgroundRequirement.toLowerCase().includes("required") ? ", and a background check adds a small additional cost" : ""}. If you need a prelicensing course, JustInsurance's ${data.name} ${noCombinedCourse ? "Life & Health package (the Life course and the Accident & Health course together) is" : "combined Life & Health package is"} ${$(data.combinedPrice)} — that's ${$(data.combinedSavings)} less than purchasing Life and Health courses separately. Everything you need to get licensed, with no hidden fees.`,
    },
    {
      question: `How long does it take to get licensed in ${data.name}?`,
      answer: `Most focused candidates complete the ${data.name} insurance licensing process in ${data.totalLicensingTime}. That timeframe covers${prelicensingRequired ? ` finishing your prelicensing course (you get ${data.courseAccessDays} days of access; most students finish in 5–10 days),` : ""} scheduling and passing the ${data.examProvider} state exam, clearing your background check, and waiting for the ${data.doiName} to process your application. The ${data.examProvider} exam delivers results quickly — most candidates receive their score before leaving the testing center. ${data.name === "California" ? "JustInsurance's flexible online format lets you fit your studying around your schedule — though California requires the full 12 hours of monitored seat time, so the 12-hour course itself cannot be shortened." : "JustInsurance's self-paced format lets you move as fast or as steady as your schedule allows."}`,
    },
    {
      question: `What is the pass rate for JustInsurance students on the ${data.name} insurance exam?`,
      answer: `JustInsurance students nationwide pass insurance licensing exams at a rate of approximately ${Math.round(parseFloat(data.passRate))}% on their first attempt — measured among students who complete the full course, finish the recommended study hours, and score 80%+ three times in a row on the practice exam before testing. The ${data.name} exam is administered by ${data.examProvider} and requires at least ${passingScoreProse(data.slug, data.passingScore)} to pass. If you do not pass on your first attempt, you can retake it after ${data.retakeWaitingPeriod}. ${data.retakeLimitInfo} See our full pass rate methodology at /pass-rates.`,
    },
    {
      question: `How much do insurance agents make in ${data.name}?`,
      answer: `Insurance agents in ${data.name} earn an average of ${data.avgIncome} per year based on public labor-market data and industry compensation surveys. New agents starting out typically earn around ${data.firstYearIncome} in their first year while building a client base, and top producers in ${data.name} can earn ${data.topProducerIncome} or more annually. Demand for new insurance producers remains steady in ${data.name}. Income is heavily influenced by the lines of authority you hold and whether you work as a captive or independent agent${isPleNotRequired(data.combinedHours) && /no combined/i.test(String(data.combinedHours)) ? ` — carrying both the Life and Health lines unlocks the broadest product range and highest earning potential` : ` — the combined Life & Health license unlocks the broadest product range and highest earning potential`}. Income figures are illustrative, based on public labor-market data, and are not a guarantee of income; individual results vary.`,
    },
  ];
}

/**
 * FAQs for prelicensing hub pages (/[state]/prelicensing/)
 * Targets queries like "[state] insurance prelicensing requirements"
 */
export function getPrelicensingHubFAQs(data: StateDataForFAQ): FAQ[] {
  const lifeRequired = !isPleNotRequired(data.lifeHours);
  const healthRequired = !isPleNotRequired(data.healthHours);
  const combinedRequired = !isPleNotRequired(data.combinedHours);
  // Prelicensing is required if ANY line requires it. Critical for no-combined-
  // LICENSE states (e.g. Wisconsin, combinedHours = "no combined license"):
  // combinedRequired is false there, but Life (20) and Health (20) ARE required,
  // so the "do I need prelicensing?" answer must key off any line, not combined.
  const anyLineRequired = lifeRequired || healthRequired || combinedRequired;

  // California: effective 1/1/2026, AB 943 (amending Cal. Ins. Code § 1749)
  // repealed the former line-specific prelicensing hours. The sole mandatory
  // prelicensing education is now a single 12-hour Code & Ethics course, taken
  // once regardless of line(s). Present it that way instead of as per-line hours.
  const isCalifornia = data.name === "California";
  // States that approve prelicensing per line of authority have NO single
  // combined Life & Health course — the L&H offering is two separate approved
  // courses (Illinois, Minnesota). Gate the "combined course" copy for them.
  //
  // Wisconsin reaches the same conclusion from different facts: it issues Life
  // and Accident & Health as separate LICENSES (states.ts
  // prelicensing.lifeAndHealth.hours === "no combined license"), so there is no
  // combined license and therefore no combined course. hasNoCombinedCourse()
  // does NOT list Wisconsin — the data value is what identifies it — so detect
  // it separately and OR the two into the shared "no combined course" gate.
  const noCombinedLicense = isNoCombinedLicense(data.combinedHours);
  const noCombinedCourse = hasNoCombinedCourse(data.slug) || noCombinedLicense;
  // Minnesota: internet-delivered prelicensing courses require the FINAL exam to
  // be taken under a disinterested third-party proctor the student arranges, who
  // verifies photo ID and signs an affidavit; the completion certificate issues
  // only after that proctored final is passed (Minn. Stat. § 45.305; proctor
  // defined § 45.25, subd. 12). So the generic "instant certificate / no live
  // sessions" framing is inaccurate for Minnesota and is gated off here.
  const isMinnesota = data.name === "Minnesota";
  // Michigan (Mich. Admin. Code R 500.5) also requires a proctor-monitored final
  // exam under signed affidavit before the certificate can issue, so any
  // "certificate immediately on finishing" wording is false there too.
  const certNeedsProctor = data.name === "Michigan";

  let hoursAnswer: string;
  if (isCalifornia) {
    hoursAnswer = `Effective January 1, 2026, California Assembly Bill 943 amended Insurance Code § 1749 to remove the state's former line-specific prelicensing hour requirements. California now requires a single 12-hour Code and Ethics prelicensing course. This one course satisfies the ethics prelicensing requirement that every applicant must complete — no matter which line(s) you pursue, whether Life, Accident & Health, or the combined Life & Health — and it is completed only once, regardless of how many lines you apply for. You do not complete a separate block of hours for each line. JustInsurance's California course meets this 12-hour requirement and includes line-specific exam preparation so you walk into your ${data.examProvider} exam ready.`;
  } else if (!lifeRequired && !healthRequired) {
    hoursAnswer = `${data.name} does not mandate prelicensing education hours before sitting for the state insurance exam — you can schedule your ${data.examProvider} exam directly without completing a formal course. That said, the exam covers complex insurance law, policy types, and ${data.name}-specific regulations. Candidates who use a structured course consistently outperform those who attempt it unprepared. JustInsurance offers ${data.name} exam-prep courses to help you pass on your first try.`;
  } else {
    const parts: string[] = [];
    if (lifeRequired) parts.push(`Life Insurance: ${formatHours(data.lifeHours)}`);
    if (healthRequired) parts.push(`Health Insurance: ${formatHours(data.healthHours)}`);
    if (combinedRequired)
      parts.push(
        noCombinedCourse
          ? `Life & Health (two separate courses): ${formatHours(data.combinedHours)} total`
          : `Life & Health (combined): ${formatHours(data.combinedHours)}`
      );
    hoursAnswer = `${data.name} requires the following prelicensing education hours before you can sit for the state exam${data.slug === "mississippi" ? " (under House Bill 819, Miss. Code § 83-17-251(2)(h), applicants seeking the Life line ONLY are exempt)" : ""}: ${parts.join("; ")}. These hours must be completed through an approved ${data.doiName} provider. ${
      data.providerApproved
        ? `JustInsurance is an approved provider and our courses are approved to meet ${data.name}'s exact hour requirements for each line of authority.`
        : `JustInsurance's courses are built to meet ${data.name}'s exact hour requirements for each line of authority.`
    }`;
  }

  const coverAnswer = isCalifornia
    ? `California's mandatory prelicensing is a single 12-hour Code and Ethics course covering the California Insurance Code, producer ethics and fiduciary duties, the Unfair Practices Act, and required consumer protections. Beyond that one state-required course, JustInsurance's program adds optional line-specific exam preparation — Life topics (term, whole, universal and variable life, annuities, policy provisions and riders) and Health topics (major medical, disability income, long-term care, Medicare Supplement, and group health) — so you're ready for the actual ${data.examProvider} exam. You complete the 12-hour course once, no matter how many lines of authority you plan to carry.`
    : `The ${data.name} prelicensing curriculum is organized around the specific lines of authority you plan to obtain. Life Insurance courses cover term life, whole life, universal life, variable products, annuities, policy provisions and riders, beneficiary designations, and underwriting basics. Health Insurance courses cover major medical, disability income, long-term care, Medicare Supplement, Medicaid, and group health. Both tracks include ${data.name}-specific insurance statutes and regulations, producer ethics, the Unfair Trade Practices Act, and state-mandated consumer protections. ${
        noCombinedLicense
          ? `${data.name} issues Life and Accident & Health as separate licenses, so there is no single combined Life & Health course — the Life & Health option is both courses together, a Life course and an Accident & Health course, covering all of the above.`
          : noCombinedCourse
          ? `In ${data.name}, Life and Accident & Health are approved as separate courses, so the Life & Health option is both courses together — a Life course and an Accident & Health course — covering all of the above.`
          : "The combined Life & Health course covers all of the above in a single enrollment."
      }`;

  const pleBeforeExamAnswer = isCalifornia
    ? `Yes — but you do not hand a certificate to ${data.examProvider}. California requires you to complete the single 12-hour Code and Ethics prelicensing course before you can be licensed. When you finish, JustInsurance reports your completion electronically to the California Department of Insurance, and the Department verifies your prelicensing education as part of your license application. You register for your ${data.examProvider} exam separately — you do not submit the certificate to ${data.examProvider} to schedule it.`
    : data.slug === "mississippi"
    ? `For most applicants, yes — with one exception. Mississippi requires proof of prelicensing course completion before you register for the state exam through ${data.examProvider} if you are pursuing the Health or combined Life & Health line. Under House Bill 819 (Miss. Code § 83-17-251(2)(h)), applicants seeking the Life line of authority ONLY are exempt from the 20-hour prelicensing requirement. Whichever line you pursue, the ${data.examProvider} licensing exam itself is still required — including for Life-only applicants.`
    : anyLineRequired
    ? `Yes. ${data.name} requires proof of course completion before you can register for the state licensing exam through ${data.examProvider}. You must finish your approved prelicensing course, receive your certificate of completion, and submit it when scheduling your exam. You cannot sit for the ${data.name} exam without first satisfying the prelicensing hour requirement.`
    : `${data.name} does not require a prelicensing certificate to schedule your exam through ${data.examProvider} — you can register at any time. However, passing the ${data.name} licensing exam without structured preparation is significantly harder. JustInsurance strongly recommends completing a prelicensing course before your exam date regardless of the state requirement.`;

  return [
    {
      question: `How many hours of prelicensing does ${data.name} require?`,
      answer: hoursAnswer,
    },
    {
      question: `Can I complete ${data.name} insurance prelicensing online?`,
      answer: isCalifornia
        ? `Yes. California approves online prelicensing education, and that is exactly what JustInsurance provides — study on any device, from anywhere, on your own schedule, with no scheduled live sessions or fixed class times. It is flexible in when and where you study, but it is not self-paced in length: the 12 hours are monitored seat time. The state requires the course to occupy the full 12 hours of active study, so it cannot be rushed or skipped ahead. A built-in timer counts down as you work through the material, so you can always see how much engaged study time is left, and you confirm your participation by electronic affidavit at the end (10 CCR §§ 2188.2, 2188.5). Your enrollment gives you ${data.courseAccessDays} days of access to fit those 12 hours around your schedule, and you receive your certificate of completion as soon as you finish.`
        : isMinnesota
        ? `Yes. Minnesota approves online, self-paced prelicensing education, and that is exactly what JustInsurance provides — study on any device, from anywhere, with no fixed class times. Two Minnesota rules to plan for. First, seat time: Minnesota requires the course to be built so it actually takes the full required hours of interactive study to complete — a course approved for a set number of hours must take at least that many hours — with technology that guarantees the seat time and automatically logs you out if you are inactive for more than 10 minutes, so you cannot finish faster than your required hours (Minn. Stat. § 45.305, subd. 4). Second, the final exam must be proctored: you arrange a disinterested third-party proctor (someone with no conflict of interest — not a relative, co-worker, or your instructor) who verifies your photo ID and signs an affidavit that you completed the exam without outside assistance (Minn. Stat. § 45.305, subd. 5; proctor defined § 45.25, subd. 12). Your enrollment gives you ${data.courseAccessDays} days of full course access, and your state-recognized certificate of completion is issued only after your seat time is met, you pass the proctored final exam, and we receive the signed proctor affidavit — not automatically when you finish the lessons.`
        : anyLineRequired
        ? data.providerApproved
          ? `Yes. ${data.name} approves online, self-paced prelicensing education, and that is exactly what JustInsurance provides. You can study on any device — laptop, tablet, or phone — from anywhere with an internet connection. There are no scheduled live sessions or fixed class times. Your enrollment gives you ${data.courseAccessDays} days of full course access, and most students complete the material in just 5–10 days. Once you finish, you receive a state-recognized certificate of completion${certNeedsProctor ? " once you pass Michigan's required proctor-monitored final exam and we receive your signed proctor affidavit (Mich. Admin. Code R 500.5)" : " immediately through the platform"}.`
          : `Yes. ${data.name} allows online, self-paced prelicensing education, and JustInsurance's course is delivered entirely online. You can study on any device — laptop, tablet, or phone — from anywhere with an internet connection. There are no scheduled live sessions or fixed class times. Your enrollment gives you ${data.courseAccessDays} days of full course access, and most students complete the material in just 5–10 days. Once you finish, you receive a certificate of completion${certNeedsProctor ? " once you pass Michigan's required proctor-monitored final exam and we receive your signed proctor affidavit (Mich. Admin. Code R 500.5)" : " immediately through the platform"}.`
        : `${data.name} does not require a prelicensing course to sit for the state exam, so there is no mandatory course to complete — but you can absolutely prepare online. JustInsurance's ${data.name} exam-prep course is fully self-paced: study on any device — laptop, tablet, or phone — from anywhere, with no scheduled live sessions or fixed class times. Your enrollment gives you ${data.courseAccessDays} days of full access, and most students complete the material in just 5–10 days. When you finish, you receive a certificate of completion${certNeedsProctor ? " once you pass Michigan's required proctor-monitored final exam and we receive your signed proctor affidavit (Mich. Admin. Code R 500.5)" : " immediately through the platform"}.`,
    },
    {
      question: `What does ${data.name} insurance prelicensing cover?`,
      answer: coverAnswer,
    },
    {
      question: `Do I need to finish prelicensing before taking the ${data.name} exam?`,
      answer: pleBeforeExamAnswer,
    },
    {
      question: `How much does ${data.name} insurance prelicensing cost?`,
      answer: `JustInsurance offers the following ${data.name} prelicensing courses: Life Insurance at ${$(data.lifePrice)}, Health Insurance at ${$(data.healthPrice)}, and the ${noCombinedCourse ? "Life & Health package (both courses)" : "combined Life & Health package"} at ${$(data.combinedPrice)}. Buying the ${noCombinedCourse ? "package" : "combined course"} saves you ${$(data.combinedSavings)} versus purchasing the two courses individually. Every course includes all required hour content, chapter quizzes, a full-length practice exam, and your official certificate of completion — no hidden fees, no required add-ons. Your ${data.courseAccessDays}-day access window starts the moment you enroll.`,
    },
  ];
}

/**
 * FAQs for CE hub pages (/[state]/continuing-education/)
 * Targets queries like "[state] insurance CE requirements" and renewal cycles
 */
export function getCEHubFAQs(data: StateDataForFAQ): FAQ[] {
  // Exam-only states have no prelicensing education to "retake" on reinstatement —
  // telling a lapsed producer there they may have to redo prelicensing invents a
  // requirement the state does not have. Gate that clause on the real signal.
  const ceHubPrelicensingRequired =
    !isPleNotRequired(data.lifeHours) ||
    !isPleNotRequired(data.healthHours) ||
    !isPleNotRequired(data.combinedHours);
  // Higher first-renewal total (Massachusetts: 60, then 45). Undefined
  // everywhere else — those answers render byte-identically. See firstTermCeHours.
  const firstTerm = firstTermCeHours(data);
  const firstTermExtra = firstTerm ? firstTerm - data.ceTotalHours : 0;
  return [
    {
      question: `How many CE hours does ${data.name} require for insurance license renewal?`,
      answer: `${data.name} requires ${data.ceTotalHours} hours of continuing education (CE) every ${data.ceRenewalPeriod} to maintain an active insurance producer license.${data.ceEthicsHours > 0 ? ` Of those ${data.ceTotalHours} hours, ${data.ceEthicsHours} must specifically cover ethics and professional conduct — this is a mandatory component, not optional.` : ``}${firstTerm ? ` Your first renewal is different: if you are newly licensed, ${data.name} requires ${firstTerm} CE hours before your FIRST renewal (${data.ceEthicsHours > 0 ? `still including the ${data.ceEthicsHours} ethics hours; ` : ``}not ${data.ceTotalHours}), then ${data.ceTotalHours} hours every ${data.ceRenewalPeriod} for each renewal after that.` : ``} All CE must be completed through a ${data.doiName}-approved provider before your license renewal deadline. ${data.providerApproved ? `JustInsurance is an approved provider and offers` : `JustInsurance offers`} a complete ${data.ceTotalHours}-hour CE package for ${data.cePackagePrice}${data.ceEthicsHours > 0 ? `, including the required ethics hours` : ``}.${firstTerm ? ` That package covers the ${data.ceTotalHours} hours required for a standard renewal cycle, so if you are heading into your first renewal you need ${firstTermExtra} additional CE hours to reach ${firstTerm}. Confirm your own requirement with the ${data.doiName}.` : ``}`,
    },
    {
      question: `How much does ${data.name} insurance CE cost?`,
      answer: `JustInsurance offers a complete ${data.name} CE package — covering ${firstTerm ? `the ${data.ceTotalHours} hours required for a standard renewal cycle` : `all ${data.ceTotalHours} required hours`}${data.ceEthicsHours > 0 ? ` including the ${data.ceEthicsHours}-hour ethics requirement` : ``} — for ${data.cePackagePrice}. This is a flat-fee bundle with no per-course upsells or surprise charges. Individual CE courses are also available for agents who need only specific topics to round out their renewal hours${firstTerm ? `, including the ${firstTermExtra} extra hours a newly licensed producer needs to reach the ${firstTerm}-hour first-renewal requirement` : ``}. Every purchase includes immediate online access, self-paced completion${data.providerApproved ? `, and automatic CE credit reporting to the ${data.doiName} on your behalf` : ``}.`,
    },
    {
      question: `Can I complete my ${data.name} insurance CE online?`,
      answer: `Yes. ${data.name} approves online CE courses, and JustInsurance provides a full catalog of self-paced courses ${data.providerApproved ? `that meet all ${data.doiName} requirements` : `aligned to ${data.doiName} requirements`}. You can study on any device, pause and resume whenever you need to, and complete your ${firstTerm ? `${data.ceTotalHours}-hour renewal-cycle requirement (${firstTerm} hours before your first renewal)` : `${data.ceTotalHours}-hour requirement`} in a single sitting or spread across multiple sessions. ${data.providerApproved ? `Once you finish each course, JustInsurance reports your completion electronically to the ${data.doiName} — you do not need to mail certificates or manually update your license record.` : `Once ${data.name} finalizes our CE provider approval, JustInsurance will report your completions electronically to the ${data.doiName}; until then you receive a certificate of completion for your records.`}`,
    },
    {
      question: `What happens if I don't complete my ${data.name} CE on time?`,
      answer: data.ceLapseConsequence
        ? `${data.ceLapseConsequence} Specifically in ${data.name}: the grace period is ${data.ceGracePeriod}, the late fee is ${data.ceLateFee}, and reinstatement runs ${data.ceReinstatementFee} with a window of ${data.ceReinstatementWindow}. A lapsed license also interrupts your commission flow and can trigger carrier appointment reviews. JustInsurance makes it easy to finish your hours well before your deadline — the entire ${data.cePackagePrice} package can be completed in a single day if needed.`
        : `If you fail to complete your ${data.ceTotalHours} CE hours and renew your license before your deadline, your ${data.name} insurance license will lapse. A lapsed license means you cannot legally sell, solicit, or negotiate insurance until it is reinstated. Reinstatement typically requires paying a late fee, submitting a reinstatement application to the ${data.doiName}, and in some cases completing additional CE hours beyond the standard ${data.ceTotalHours}. A lapsed license can also interrupt your commission flow and harm your carrier appointments. JustInsurance makes it easy to finish your hours well before your deadline — the entire ${data.cePackagePrice} package can be completed in a single day if needed.`,
    },
    ...(data.ceReinstatementFee
      ? [
          {
            question: `How do I reinstate a lapsed ${data.name} insurance license?`,
            answer: `If your ${data.name} insurance license has lapsed, you typically have ${data.ceReinstatementWindow} to reinstate it before you must re-apply as a new licensee. Reinstatement in ${data.name} runs ${data.ceReinstatementFee}, and you must complete any outstanding CE hours from the lapsed period before the ${data.doiName} will process your reinstatement. The sooner you act, the simpler the process — waiting too long can mean starting over${ceHubPrelicensingRequired ? ` with prelicensing education and the state exam` : ` and retaking the state exam`} from scratch.${data.providerApproved ? ` JustInsurance courses report electronically to the ${data.doiName}, so once your hours are complete your reinstatement moves fast.` : ``}`,
          },
        ]
      : []),
    ...(data.ceCarryForward
      ? [
          {
            question: `Do unused CE hours carry forward in ${data.name}?`,
            answer: `Carry-forward policy in ${data.name}: ${data.ceCarryForward}. Carry-forward rules matter if you finish your required hours early in the cycle — in some states, the extra hours apply to your next renewal period, while in others any excess is simply lost. Ethics hours often have separate, stricter carry-forward rules than general CE hours, so even if general hours roll over, you typically need a fresh ethics course each cycle. For the current official carry-forward policy, always verify with the ${data.doiName}, which is the authoritative source of truth for your CE account.`,
          },
        ]
      : []),
    {
      question: `Does ${data.name} require ethics CE hours?`,
      answer: data.ceEthicsHours > 0
        ? `Yes. ${data.name} mandates that ${data.ceEthicsHours} of your ${firstTerm ? `required CE hours (${data.ceTotalHours} per renewal cycle, ${firstTerm} before your first renewal)` : `${data.ceTotalHours} required CE hours`} specifically cover ethics and professional conduct. This is not optional — you must satisfy the ethics component separately from general CE hours, and the ${data.doiName} tracks it independently. Failing to complete the ethics hours is treated the same as failing to complete your total CE requirement. JustInsurance's ${data.cePackagePrice} CE package includes ${data.providerApproved ? `a fully approved ${data.ceEthicsHours}-hour ethics course` : `a ${data.ceEthicsHours}-hour ethics course built to the ${data.doiName} topic list (our ${data.name} provider approval is pending)`}, so ${firstTerm ? `your ethics requirement is covered in the same purchase — add ${firstTermExtra} more hours if you are completing your ${firstTerm}-hour first renewal` : `your entire renewal requirement is covered in one purchase`}.`
        : `No. ${data.name} does not set aside a dedicated ethics-hours requirement — none of your ${data.ceTotalHours} CE hours per ${data.ceRenewalPeriod} have to be ethics-specific, though ethics and professional-conduct courses still count toward your total. JustInsurance's ${data.cePackagePrice} CE package covers your ${firstTerm ? `${data.ceTotalHours}-hour standard renewal requirement (a first renewal takes ${firstTerm} hours)` : `full ${data.ceTotalHours}-hour renewal requirement`}, with ethics and professional-responsibility material included as part of the curriculum.`,
    },
  ];
}

/**
 * FAQs for individual prelicensing course pages (/[state]/prelicensing/[loa]/)
 * Targets queries like "[state] [LOA] prelicensing course cost" and exam specifics
 */
export function getPrelicensingCourseFAQs(
  data: StateDataForFAQ,
  loaName: string,
  hours: string | number,
  price: string
): FAQ[] {
  // "no combined license" (Wisconsin) means the state issues Life and Health as
  // SEPARATE licenses — there is no combined course — but each line still
  // requires its hours. It must NOT fall through to the optional-state path.
  const isNoCombinedLicense =
    typeof hours === "string" && hours.toLowerCase().includes("no combined");
  const combinedTotalHours = Number(data.lifeHours) + Number(data.healthHours);
  const hoursNotRequired = isPleNotRequired(hours) && !isNoCombinedLicense;
  // `providerApproved` is derived from providerApprovalNumber !== "PENDING" — a
  // CONTINUING EDUCATION provider approval. It must never be reused to assert
  // PRELICENSING approval: in exam-only states the DOI runs no prelicensing
  // approval program at all, so "approved by the {DOI}" / "meets all state
  // education requirements" / "state-recognized certificate" are false there.
  // Every state-approval claim below requires BOTH: we hold the approval AND
  // this line of authority actually mandates prelicensing.
  const prelicensingApproved = data.providerApproved && !hoursNotRequired;
  const hoursDisplay = isNoCombinedLicense
    ? `${Number.isFinite(combinedTotalHours) ? combinedTotalHours : 40} hours`
    : formatHours(hours);

  const lengthAnswer = isNoCombinedLicense
    ? `${data.name} issues Life and Accident & Health as separate licenses, so there is no single combined Life & Health prelicensing course. To carry both lines you complete two approved courses — a ${data.lifeHours}-hour Life prelicensing course and a ${data.healthHours}-hour Health prelicensing course. JustInsurance's ${data.name} Life & Health package includes both, and you have ${data.courseAccessDays} days of access from the day you enroll to work through them at your own pace.`
    : hoursNotRequired
    ? `${data.name} does not impose a minimum hour requirement for ${loaName} prelicensing. However, the JustInsurance ${data.name} ${loaName} course is structured to cover every topic tested on the ${data.examProvider} exam. You get ${data.courseAccessDays} days of access from enrollment, and most students work through the full course in 5–10 days at a comfortable pace — no mandatory session times and no live classes to attend.`
    : data.name === "California"
    ? `California requires a single 12-hour Code and Ethics prelicensing course before you can be licensed — it satisfies the ethics requirement for every line of authority and is completed only once — delivered through structured video lessons, readings, and chapter quizzes. California treats those 12 hours as monitored seat time: the course meters your active study time with a built-in timer that counts down the hours remaining, so it is built to occupy the full 12 hours and cannot be completed faster, and you confirm your participation by electronic affidavit when you finish (10 CCR §§ 2188.2, 2188.5). The timer lets you see exactly how much engaged study time you have left, and you have ${data.courseAccessDays} days of access to fit the 12 hours around your own schedule.`
    : data.name === "Minnesota"
    ? `Minnesota requires ${hoursDisplay} of state-approved prelicensing education before you can sit for the ${data.examProvider} exam, and Minnesota enforces a seat-time minimum: the course is built so it actually takes the full ${hoursDisplay} of interactive study to complete, with technology that guarantees the seat time and automatically logs you out if you are inactive for more than 10 minutes, so you cannot finish faster than the required ${hoursDisplay} (Minn. Stat. § 45.305, subd. 4). You have ${data.courseAccessDays} days of access to complete the hours around your own schedule. Minnesota then requires a proctor-monitored final exam — you arrange a disinterested third-party proctor who verifies your ID and signs an affidavit — before your certificate is issued (Minn. Stat. § 45.305, subd. 5).`
    : data.slug === "mississippi" && loaName === "Life Insurance"
    ? `Under Mississippi House Bill 819 (Miss. Code § 83-17-251(2)(h)), applicants seeking the Life line of authority ONLY are exempt from the 20-hour prelicensing requirement — this course is optional for Life-only candidates, though the ${data.examProvider} licensing exam is still required. Most Life-only applicants still take it to prepare: the JustInsurance Mississippi Life course covers every topic tested on the ${data.examProvider} exam, and you have ${data.courseAccessDays} days of access from enrollment, with most students finishing in 5–10 days.`
    : `The ${data.name} ${loaName} prelicensing course requires ${hoursDisplay} of state-approved education before you can sit for the licensing exam. JustInsurance's course is approved by the ${data.doiName} to fulfill this exact requirement. All ${hoursDisplay} are delivered through structured video lessons, reading materials, and chapter quizzes that you complete at your own pace. You have ${data.courseAccessDays} days of access from the day you enroll, and most students finish well within the first two weeks.`;

  return [
    {
      question: `How long is the ${data.name} ${loaName} prelicensing course?`,
      answer: lengthAnswer,
    },
    {
      question: `What is the pass rate for JustInsurance students on the ${data.name} ${loaName} exam?`,
      answer: `JustInsurance students nationwide pass insurance licensing exams at a rate of approximately ${Math.round(parseFloat(data.passRate))}% on their first attempt — measured among students who complete the full course, finish the recommended study hours, and score 80%+ three times in a row on the practice exam before testing. The ${data.name} ${loaName} exam is administered by ${data.examProvider} and requires at least ${formatPassingScore(data.slug, data.passingScore, loaSlugFromName(loaName))} to pass. JustInsurance's course includes a full-length practice exam modeled on the actual ${data.examProvider} content outline, so you can benchmark your readiness. Full pass rate methodology at /pass-rates.`,
    },
    {
      question: `What happens if I fail the ${data.name} ${loaName} exam?`,
      answer: `If you do not pass the ${data.name} ${loaName} exam on your first attempt, you can retake it after ${data.retakeWaitingPeriod}. ${data.retakeLimitInfo} Each retake requires paying the ${$(data.examFee)} exam fee again to ${data.examProvider}. JustInsurance recommends reviewing your score report after a failed attempt to identify weak areas, then spending additional time on those topics before rescheduling. Your JustInsurance course access remains active throughout your ${data.courseAccessDays}-day enrollment window, so you can review material at no extra cost.`,
    },
    {
      question: `Is the JustInsurance ${data.name} ${loaName} course ${prelicensingApproved || hoursNotRequired ? "state-approved" : "approved yet"}?`,
      answer: data.name === "California"
        ? `Yes. The JustInsurance California ${loaName} prelicensing course is approved by the California Department of Insurance and satisfies California's mandatory 12-hour Code and Ethics prelicensing requirement — a single course, taken once, regardless of line of authority (AB 943, effective January 1, 2026). When you finish, you receive an official certificate of completion and JustInsurance reports your completion to the CDI; the Department verifies your prelicensing education as part of your license application, so you do not submit the certificate to ${data.examProvider} to register for the exam. JustInsurance maintains active approval status with the CDI and updates course content whenever California insurance law or exam content outlines change.`
        : hoursNotRequired
        ? `${data.name} does not require prelicensing education for the ${loaName} line, so the ${data.doiName} does not approve or register prelicensing courses — there is no state prelicensing approval for any provider to hold. The JustInsurance ${data.name} ${loaName} course is exam preparation, built to the full ${data.examProvider} exam content outline.${data.providerApproved ? ` JustInsurance does hold ${data.doiName} approval as a continuing education provider, which is a separate credential from prelicensing and applies to license renewal, not to getting licensed.` : ``} You receive an official JustInsurance certificate of completion when you finish.`
        : prelicensingApproved
        ? `Yes. The JustInsurance ${data.name} ${loaName} prelicensing course is approved by the ${data.doiName} and meets all state education requirements for the ${loaName} line of authority. Upon completing the course, you receive an official certificate of completion that ${data.examProvider} accepts for exam registration. JustInsurance maintains active approval status with the ${data.doiName} and updates course content whenever ${data.name} insurance law or exam content outlines change.`
        : `The JustInsurance ${data.name} ${loaName} prelicensing course is built to the ${data.doiName}'s ${loaName} education standards and the full ${data.examProvider} exam content outline. Our ${data.name} provider approval is currently pending with the ${data.doiName}; JustInsurance will update this page as soon as the approval is finalized. You still receive an official certificate of completion when you finish the course.`,
    },
    {
      question: `What's included in the ${data.name} ${loaName} prelicensing course?`,
      answer: `The JustInsurance ${data.name} ${loaName} prelicensing course at ${$(price)} includes everything you need in a single purchase: ${hoursNotRequired ? "comprehensive" : hoursDisplay + " of"} ${prelicensingApproved ? "state-approved" : "exam-focused"} course content organized by exam topic, chapter-by-chapter review quizzes to reinforce key concepts, a full-length practice exam that mirrors the format and difficulty of the actual ${data.examProvider} exam, ${data.courseAccessDays} days of unlimited access across all your devices, and your official ${prelicensingApproved ? "state-recognized " : ""}certificate of completion${data.name === "Michigan" ? ", issued once you pass Michigan's required proctor-monitored final exam and we receive your signed proctor affidavit (Mich. Admin. Code R 500.5)." : data.name === "Minnesota" ? ", issued once you pass Minnesota's required proctor-monitored final exam and we receive your signed proctor affidavit (Minn. Stat. § 45.305, subd. 5). There are no hidden JustInsurance fees, required textbooks, or add-on course costs — though a proctor you arrange may charge its own fee." : " issued immediately when you finish. There are no hidden fees, no required textbooks, and no add-on costs."}`,
    },
  ];
}

/**
 * FAQs for individual CE course pages (/[state]/continuing-education/[loa]/)
 * Targets queries about CE hour requirements, renewal cycles, and online options
 */
export function getCECourseFAQs(
  data: StateDataForFAQ,
  loaName: string,
  hours: number
): FAQ[] {
  // Massachusetts-style first-term rule: 60 CE hours before the FIRST renewal,
  // then 45 per 3-year cycle. The package sold on this page is sized to the
  // RECURRING total, so a brand-new licensee who buys it alone under-completes
  // by 15 hours and can lapse — say so wherever the hours render. Undefined for
  // every other state, whose answers stay byte-identical.
  const firstTerm = firstTermCeHours(data);
  const firstTermExtra = firstTerm ? firstTerm - data.ceTotalHours : 0;
  return [
    {
      question: `How many ${loaName} CE hours does ${data.name} require?`,
      answer: `${data.name} requires ${data.ceTotalHours} total CE hours every ${data.ceRenewalPeriod} to renew any active insurance producer license, including the ${loaName} line.${data.ceEthicsHours > 0 ? ` Of those ${data.ceTotalHours} hours, ${data.ceEthicsHours} must specifically cover ethics and professional conduct.` : ``}${firstTerm ? ` One exception matters if you were licensed recently: ${data.name} requires ${firstTerm} CE hours before your FIRST renewal (${data.ceEthicsHours > 0 ? `still including the ${data.ceEthicsHours} ethics hours; ` : ``}not ${data.ceTotalHours}), and ${data.ceTotalHours} hours for every renewal after that.` : ``} The JustInsurance ${data.name} ${loaName} CE course covers ${hours} hours toward that total. ${
        firstTerm
          ? `If you want to satisfy the ${data.ceTotalHours}-hour standard renewal requirement in one purchase, JustInsurance's complete CE package at ${data.cePackagePrice} bundles those hours${data.ceEthicsHours > 0 ? ` — including the mandatory ethics component` : ``}. Because a first renewal takes ${firstTerm} hours, a newly licensed producer needs ${firstTermExtra} additional CE hours on top of the package. Confirm your own requirement with the ${data.doiName} before you enroll.`
          : `If you want to satisfy your full ${data.ceTotalHours}-hour renewal requirement in one purchase, JustInsurance's complete CE package at ${data.cePackagePrice} bundles all required hours${data.ceEthicsHours > 0 ? ` — including the mandatory ethics component` : ``}.`
      }`,
    },
    {
      question: `How long do I have to complete my ${data.name} CE?`,
      answer: `Your ${data.name} insurance license renews on a ${data.ceRenewalPeriod} cycle, and ${firstTerm ? `all ${firstTerm} CE hours must be completed before your FIRST renewal deadline, then ${data.ceTotalHours} hours before each renewal deadline after that` : `all ${data.ceTotalHours} CE hours must be completed before your renewal deadline`}. Your exact renewal deadline is set by the ${data.doiName} — log in to your producer portal to confirm it. JustInsurance recommends finishing your CE at least 30 days before your renewal date${data.providerApproved ? ` to allow time for electronic reporting to process` : ``}. If you are cutting it close, the JustInsurance ${data.name} CE course can be completed in a single day.`,
    },
    {
      question: `Does JustInsurance report my ${data.name} CE to the DOI?`,
      answer: data.providerApproved
        ? `Yes. When you complete a CE course through JustInsurance, we electronically report your completion directly to the ${data.doiName} — typically on the same day you finish. You do not need to mail certificates, fill out forms, or manually update your license record. After a few business days, log in to your ${data.doiName} producer portal to confirm your CE credits have been posted. If you see any discrepancy, JustInsurance support can resolve it quickly using your completion records.`
        : `Not yet. JustInsurance's ${data.name} CE provider approval is currently pending with the ${data.doiName}. Once it is finalized, we will electronically report your completions directly to the ${data.doiName} — typically within one business day — so you will not need to mail certificates or update your license record manually. Until then, you receive a certificate of completion to keep for your records.`,
    },
    {
      question: `Can I start my ${data.name} CE before my renewal date?`,
      answer: `Yes — and JustInsurance strongly recommends it. You can begin your ${data.name} CE courses at any point during your ${data.ceRenewalPeriod} renewal cycle. Starting early gives you the flexibility to spread your ${firstTerm ? `${data.ceTotalHours} hours (${firstTerm} if you are working toward your first renewal)` : `${data.ceTotalHours} hours`} across multiple sessions, choose topics relevant to your practice, and avoid any last-minute technical issues.${data.providerApproved ? ` Completed CE hours are reported to the ${data.doiName} as you finish each course, so credits accumulate throughout the cycle rather than all at once at the end.` : ``}`,
    },
    {
      question: `What topics are covered in the ${data.name} ${loaName} CE course?`,
      answer: `The JustInsurance ${data.name} ${loaName} CE course covers the core topics required to keep your knowledge current and your license compliant. Expect content on ${loaName.toLowerCase()} product updates and regulatory changes specific to ${data.name}, consumer protection requirements, claims handling and suitability standards, ${data.name} insurance statutes governing producer conduct, and ethics and professional responsibility${data.ceEthicsHours > 0 ? ` — satisfying the mandatory ${data.ceEthicsHours}-hour ethics component` : ``}. All course content is reviewed and updated whenever the ${data.doiName} revises its approved topic list, so you are always studying current material.`,
    },
  ];
}
