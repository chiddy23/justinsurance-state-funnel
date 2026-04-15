import type { StateData } from "@/lib/states";

export interface FAQ {
  question: string;
  answer: string;
}

export interface StateDataForFAQ {
  name: string;
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
  const combinedIsRequired = !isPleNotRequired(data.combinedHours);
  const pleStep = combinedIsRequired
    ? `complete a state-approved prelicensing course (${formatHours(data.combinedHours)} for the combined Life & Health line)`
    : `prepare for your exam — ${data.name} does not require a formal prelicensing course, though most candidates strongly recommend taking one`;

  return [
    {
      question: `How do I get my ${data.name} insurance license?`,
      answer: `Getting your ${data.name} insurance license involves four steps. First, ${pleStep}. Second, pass the ${data.name} state licensing exam administered by ${data.examProvider} — you need a score of at least ${data.passingScore}% to pass. Third, complete a background check${data.fingerprintRequirement.toLowerCase().includes("not required") || data.fingerprintRequirement.toLowerCase().includes("no finger") ? "" : ", including fingerprinting"}. Fourth, ${data.applicationProcess} and pay the ${data.doiName} application fee of ${$(data.applicationFee)}. Most candidates complete the entire process in ${data.totalLicensingTime}. JustInsurance offers fully online, self-paced prelicensing courses approved for ${data.name} that get you to exam day confident and prepared.`,
    },
    {
      question: `How much does it cost to get ${aOrAn(data.name)} ${data.name} insurance license?`,
      answer: `The total cost to get your ${data.name} insurance license typically runs ${data.totalCostRange}. Here is how it breaks down: the ${data.examProvider} exam fee is ${$(data.examFee)}, the ${data.doiName} application fee is ${$(data.applicationFee)}${data.backgroundRequirement.toLowerCase().includes("required") ? ", and a background check adds a small additional cost" : ""}. If you need a prelicensing course, JustInsurance's ${data.name} combined Life & Health package is ${$(data.combinedPrice)} — that's ${$(data.combinedSavings)} less than purchasing Life and Health courses separately. Everything you need to get licensed, with no hidden fees.`,
    },
    {
      question: `How long does it take to get licensed in ${data.name}?`,
      answer: `Most focused candidates complete the ${data.name} insurance licensing process in ${data.totalLicensingTime}. That timeframe covers${combinedIsRequired ? ` finishing your prelicensing course (you get ${data.courseAccessDays} days of access; most students finish in 5–10 days),` : ""} scheduling and passing the ${data.examProvider} state exam, clearing your background check, and waiting for the ${data.doiName} to process your application. The ${data.examProvider} exam delivers results quickly — most candidates receive their score before leaving the testing center. JustInsurance's self-paced format lets you move as fast or as steady as your schedule allows.`,
    },
    {
      question: `What is the pass rate for JustInsurance students on the ${data.name} insurance exam?`,
      answer: `JustInsurance students nationwide pass insurance licensing exams at a rate of approximately ${Math.round(parseFloat(data.passRate))}% on their first attempt — measured among students who complete the full course, finish the recommended study hours, and score 80%+ three times in a row on the practice exam before testing. The ${data.name} exam is administered by ${data.examProvider} and requires a minimum score of ${data.passingScore}% to pass. If you do not pass on your first attempt, you can retake it after ${data.retakeWaitingPeriod}. ${data.retakeLimitInfo} See our full pass rate methodology at /pass-rates.`,
    },
    {
      question: `How much do insurance agents make in ${data.name}?`,
      answer: `Insurance agents in ${data.name} earn an average of ${data.avgIncome} per year according to Bureau of Labor Statistics data. New agents starting out typically earn around ${data.firstYearIncome} in their first year while building a client base, and top producers in ${data.name} can earn ${data.topProducerIncome} or more annually. Demand for new insurance producers remains steady in ${data.name}. Income is heavily influenced by the lines of authority you hold and whether you work as a captive or independent agent — the combined Life & Health license unlocks the broadest product range and highest earning potential.`,
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

  let hoursAnswer: string;
  if (!lifeRequired && !healthRequired) {
    hoursAnswer = `${data.name} does not mandate prelicensing education hours before sitting for the state insurance exam — you can schedule your ${data.examProvider} exam directly without completing a formal course. That said, the exam covers complex insurance law, policy types, and ${data.name}-specific regulations. Candidates who use a structured course consistently outperform those who attempt it unprepared. JustInsurance offers ${data.name} exam-prep courses to help you pass on your first try.`;
  } else {
    const parts: string[] = [];
    if (lifeRequired) parts.push(`Life Insurance: ${formatHours(data.lifeHours)}`);
    if (healthRequired) parts.push(`Health Insurance: ${formatHours(data.healthHours)}`);
    if (combinedRequired) parts.push(`Life & Health (combined): ${formatHours(data.combinedHours)}`);
    hoursAnswer = `${data.name} requires the following prelicensing education hours before you can sit for the state exam: ${parts.join("; ")}. These hours must be completed through a ${data.doiName}-approved provider. JustInsurance is an approved provider and our courses are certified to meet ${data.name}'s exact hour requirements for each line of authority.`;
  }

  const pleBeforeExamAnswer = combinedRequired
    ? `Yes. ${data.name} requires proof of course completion before you can register for the state licensing exam through ${data.examProvider}. You must finish your approved prelicensing course, receive your certificate of completion, and submit it when scheduling your exam. You cannot sit for the ${data.name} exam without first satisfying the prelicensing hour requirement.`
    : `${data.name} does not require a prelicensing certificate to schedule your exam through ${data.examProvider} — you can register at any time. However, passing the ${data.name} licensing exam without structured preparation is significantly harder. JustInsurance strongly recommends completing a prelicensing course before your exam date regardless of the state requirement.`;

  return [
    {
      question: `How many hours of prelicensing does ${data.name} require?`,
      answer: hoursAnswer,
    },
    {
      question: `Can I complete ${data.name} insurance prelicensing online?`,
      answer: `Yes. ${data.name} approves online, self-paced prelicensing education, and that is exactly what JustInsurance provides. You can study on any device — laptop, tablet, or phone — from anywhere with an internet connection. There are no scheduled live sessions or fixed class times. Your enrollment gives you ${data.courseAccessDays} days of full course access, and most students complete the material in just 5–10 days. Once you finish, you receive a state-recognized certificate of completion immediately through the platform.`,
    },
    {
      question: `What does ${data.name} insurance prelicensing cover?`,
      answer: `The ${data.name} prelicensing curriculum is organized around the specific lines of authority you plan to obtain. Life Insurance courses cover term life, whole life, universal life, variable products, annuities, policy provisions and riders, beneficiary designations, and underwriting basics. Health Insurance courses cover major medical, disability income, long-term care, Medicare Supplement, Medicaid, and group health. Both tracks include ${data.name}-specific insurance statutes and regulations, producer ethics, the Unfair Trade Practices Act, and state-mandated consumer protections. The combined Life & Health course covers all of the above in a single enrollment.`,
    },
    {
      question: `Do I need to finish prelicensing before taking the ${data.name} exam?`,
      answer: pleBeforeExamAnswer,
    },
    {
      question: `How much does ${data.name} insurance prelicensing cost?`,
      answer: `JustInsurance offers the following ${data.name} prelicensing courses: Life Insurance at ${$(data.lifePrice)}, Health Insurance at ${$(data.healthPrice)}, and the combined Life & Health package at ${$(data.combinedPrice)}. Buying the combined course saves you ${$(data.combinedSavings)} versus purchasing both individually. Every course includes all required hour content, chapter quizzes, a full-length practice exam, and your official certificate of completion — no hidden fees, no required add-ons. Your ${data.courseAccessDays}-day access window starts the moment you enroll.`,
    },
  ];
}

/**
 * FAQs for CE hub pages (/[state]/continuing-education/)
 * Targets queries like "[state] insurance CE requirements" and renewal cycles
 */
export function getCEHubFAQs(data: StateDataForFAQ): FAQ[] {
  return [
    {
      question: `How many CE hours does ${data.name} require for insurance license renewal?`,
      answer: `${data.name} requires ${data.ceTotalHours} hours of continuing education (CE) every ${data.ceRenewalPeriod} to maintain an active insurance producer license. Of those ${data.ceTotalHours} hours, ${data.ceEthicsHours} must specifically cover ethics and professional conduct — this is a mandatory component, not optional. All CE must be completed through a ${data.doiName}-approved provider before your license renewal deadline. JustInsurance is an approved provider and offers a complete ${data.ceTotalHours}-hour CE package for ${data.cePackagePrice}, including the required ethics hours.`,
    },
    {
      question: `How much does ${data.name} insurance CE cost?`,
      answer: `JustInsurance offers a complete ${data.name} CE package — covering all ${data.ceTotalHours} required hours including the ${data.ceEthicsHours}-hour ethics requirement — for ${data.cePackagePrice}. This is a flat-fee bundle with no per-course upsells or surprise charges. Individual CE courses are also available for agents who need only specific topics to round out their renewal hours. Every purchase includes immediate online access, self-paced completion, and automatic CE credit reporting to the ${data.doiName} on your behalf.`,
    },
    {
      question: `Can I complete my ${data.name} insurance CE online?`,
      answer: `Yes. ${data.name} approves online CE courses, and JustInsurance provides a full catalog of self-paced courses that meet all ${data.doiName} requirements. You can study on any device, pause and resume whenever you need to, and complete your ${data.ceTotalHours}-hour requirement in a single sitting or spread across multiple sessions. Once you finish each course, JustInsurance reports your completion electronically to the ${data.doiName} — you do not need to mail certificates or manually update your license record.`,
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
            answer: `If your ${data.name} insurance license has lapsed, you typically have ${data.ceReinstatementWindow} to reinstate it before you must re-apply as a new licensee. Reinstatement in ${data.name} runs ${data.ceReinstatementFee}, and you must complete any outstanding CE hours from the lapsed period before the ${data.doiName} will process your reinstatement. The sooner you act, the simpler the process — waiting too long can mean retaking prelicensing education and the state exam from scratch. JustInsurance courses report electronically to the ${data.doiName}, so once your hours are complete your reinstatement moves fast.`,
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
      answer: `Yes. ${data.name} mandates that ${data.ceEthicsHours} of your ${data.ceTotalHours} required CE hours specifically cover ethics and professional conduct. This is not optional — you must satisfy the ethics component separately from general CE hours, and the ${data.doiName} tracks it independently. Failing to complete the ethics hours is treated the same as failing to complete your total CE requirement. JustInsurance's ${data.cePackagePrice} CE package includes a fully approved ${data.ceEthicsHours}-hour ethics course, so your entire renewal requirement is covered in one purchase.`,
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
  const hoursNotRequired = isPleNotRequired(hours);
  const hoursDisplay = formatHours(hours);

  const lengthAnswer = hoursNotRequired
    ? `${data.name} does not impose a minimum hour requirement for ${loaName} prelicensing. However, the JustInsurance ${data.name} ${loaName} course is structured to cover every topic tested on the ${data.examProvider} exam. You get ${data.courseAccessDays} days of access from enrollment, and most students work through the full course in 5–10 days at a comfortable pace — no mandatory session times and no live classes to attend.`
    : `The ${data.name} ${loaName} prelicensing course requires ${hoursDisplay} of state-approved education before you can sit for the licensing exam. JustInsurance's course is certified by the ${data.doiName} to fulfill this exact requirement. All ${hoursDisplay} are delivered through structured video lessons, reading materials, and chapter quizzes that you complete at your own pace. You have ${data.courseAccessDays} days of access from the day you enroll, and most students finish well within the first two weeks.`;

  return [
    {
      question: `How long is the ${data.name} ${loaName} prelicensing course?`,
      answer: lengthAnswer,
    },
    {
      question: `What is the pass rate for JustInsurance students on the ${data.name} ${loaName} exam?`,
      answer: `JustInsurance students nationwide pass insurance licensing exams at a rate of approximately ${Math.round(parseFloat(data.passRate))}% on their first attempt — measured among students who complete the full course, finish the recommended study hours, and score 80%+ three times in a row on the practice exam before testing. The ${data.name} ${loaName} exam is administered by ${data.examProvider} and requires a score of at least ${data.passingScore}% to pass. JustInsurance's course includes a full-length practice exam modeled on the actual ${data.examProvider} content outline, so you can benchmark your readiness. Full pass rate methodology at /pass-rates.`,
    },
    {
      question: `What happens if I fail the ${data.name} ${loaName} exam?`,
      answer: `If you do not pass the ${data.name} ${loaName} exam on your first attempt, you can retake it after ${data.retakeWaitingPeriod}. ${data.retakeLimitInfo} Each retake requires paying the ${$(data.examFee)} exam fee again to ${data.examProvider}. JustInsurance recommends reviewing your score report after a failed attempt to identify weak areas, then spending additional time on those topics before rescheduling. Your JustInsurance course access remains active throughout your ${data.courseAccessDays}-day enrollment window, so you can review material at no extra cost.`,
    },
    {
      question: `Is the JustInsurance ${data.name} ${loaName} course state-approved?`,
      answer: `Yes. The JustInsurance ${data.name} ${loaName} prelicensing course is approved by the ${data.doiName} and meets all state education requirements for the ${loaName} line of authority. Upon completing the course, you receive an official certificate of completion that ${data.examProvider} accepts for exam registration. JustInsurance maintains active approval status with the ${data.doiName} and updates course content whenever ${data.name} insurance law or exam content outlines change.`,
    },
    {
      question: `What's included in the ${data.name} ${loaName} prelicensing course?`,
      answer: `The JustInsurance ${data.name} ${loaName} prelicensing course at ${$(price)} includes everything you need in a single purchase: ${hoursNotRequired ? "comprehensive" : hoursDisplay + " of"} state-approved course content organized by exam topic, chapter-by-chapter review quizzes to reinforce key concepts, a full-length practice exam that mirrors the format and difficulty of the actual ${data.examProvider} exam, ${data.courseAccessDays} days of unlimited access across all your devices, and your official state-recognized certificate of completion issued immediately when you finish. There are no hidden fees, no required textbooks, and no add-on costs.`,
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
  return [
    {
      question: `How many ${loaName} CE hours does ${data.name} require?`,
      answer: `${data.name} requires ${data.ceTotalHours} total CE hours every ${data.ceRenewalPeriod} to renew any active insurance producer license, including the ${loaName} line. Of those ${data.ceTotalHours} hours, ${data.ceEthicsHours} must specifically cover ethics and professional conduct. The JustInsurance ${data.name} ${loaName} CE course covers ${hours} hours toward that total. If you want to satisfy your full ${data.ceTotalHours}-hour renewal requirement in one purchase, JustInsurance's complete CE package at ${data.cePackagePrice} bundles all required hours — including the mandatory ethics component.`,
    },
    {
      question: `How long do I have to complete my ${data.name} CE?`,
      answer: `Your ${data.name} insurance license renews on a ${data.ceRenewalPeriod} cycle, and all ${data.ceTotalHours} CE hours must be completed before your renewal deadline. Your specific deadline is tied to your license issue date or birth month — log in to your ${data.doiName} producer portal to confirm the exact date. JustInsurance recommends finishing your CE at least 30 days before your renewal date to allow time for electronic reporting to process. If you are cutting it close, the JustInsurance ${data.name} CE course can be completed in a single day.`,
    },
    {
      question: `Does JustInsurance report my ${data.name} CE to the DOI?`,
      answer: `Yes. When you complete a CE course through JustInsurance, we electronically report your completion directly to the ${data.doiName} — typically on the same day you finish. You do not need to mail certificates, fill out forms, or manually update your license record. After a few business days, log in to your ${data.doiName} producer portal to confirm your CE credits have been posted. If you see any discrepancy, JustInsurance support can resolve it quickly using your completion records.`,
    },
    {
      question: `Can I start my ${data.name} CE before my renewal date?`,
      answer: `Yes — and JustInsurance strongly recommends it. You can begin your ${data.name} CE courses at any point during your ${data.ceRenewalPeriod} renewal cycle. Starting early gives you the flexibility to spread your ${data.ceTotalHours} hours across multiple sessions, choose topics relevant to your practice, and avoid any last-minute technical issues. Completed CE hours are reported to the ${data.doiName} as you finish each course, so credits accumulate throughout the cycle rather than all at once at the end.`,
    },
    {
      question: `What topics are covered in the ${data.name} ${loaName} CE course?`,
      answer: `The JustInsurance ${data.name} ${loaName} CE course covers the core topics required to keep your knowledge current and your license compliant. Expect content on ${loaName.toLowerCase()} product updates and regulatory changes specific to ${data.name}, consumer protection requirements, claims handling and suitability standards, ${data.name} insurance statutes governing producer conduct, and ethics and professional responsibility — satisfying the mandatory ${data.ceEthicsHours}-hour ethics component. All course content is reviewed and updated whenever the ${data.doiName} revises its approved topic list, so you are always studying current material.`,
    },
  ];
}
