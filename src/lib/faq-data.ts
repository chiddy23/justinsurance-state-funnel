export interface FAQ {
  question: string;
  answer: string;
}

/**
 * FAQs for state hub pages (/[state]/)
 * Targets queries like "how to get [state] insurance license"
 */
export function getStateHubFAQs(stateName: string, stateAbbrev: string): FAQ[] {
  return [
    {
      question: `How do I get an insurance license in ${stateName}?`,
      answer: `To get an insurance license in ${stateName}, you must complete a state-approved prelicensing education course, pass the ${stateAbbrev} state insurance licensing exam, and submit a license application through the National Insurance Producer Registry (NIPR) or directly to the ${stateName} Department of Insurance. Most candidates complete the entire process in four to eight weeks. JustInsurance offers fully online, self-paced prelicensing courses that meet all ${stateName} requirements and prepare you thoroughly for the state exam.`,
    },
    {
      question: `What types of insurance licenses are available in ${stateName}?`,
      answer: `${stateName} issues licenses by line of authority (LOA). The most common lines for individual agents are Life Insurance, Health Insurance, and the combined Life & Health Insurance license. Most new agents pursue the combined Life & Health license because it unlocks the widest range of products—from term life and annuities to major medical, Medicare Supplement, and long-term care—with a single exam and license application.`,
    },
    {
      question: `Do I need a background check to get an insurance license in ${stateName}?`,
      answer: `Yes. ${stateName} requires all license applicants to disclose criminal history and consent to a background check as part of the application process. Certain felony convictions—particularly those involving dishonesty, fraud, or breach of trust—may disqualify an applicant or require additional review. Minor or older offenses do not automatically prevent licensure. If you have a prior conviction, it is best to review the ${stateName} Department of Insurance guidance or consult an attorney before investing in prelicensing education.`,
    },
    {
      question: `How long does it take to get an insurance license in ${stateName}?`,
      answer: `Most motivated candidates complete the ${stateName} insurance licensing process in four to eight weeks. This includes finishing your prelicensing course (typically one to three weeks studying at your own pace), scheduling and passing the state exam, and waiting for your license application to be processed—usually two to five business days when submitted online. JustInsurance courses are built for efficiency, so you can move as fast or as steady as your schedule allows.`,
    },
    {
      question: `How much does it cost to get an insurance license in ${stateName}?`,
      answer: `The total cost of getting an insurance license in ${stateName} typically includes three components: the prelicensing course fee (JustInsurance courses start at $199), the state exam registration fee (usually $40–$80 depending on the exam provider), and the license application fee charged by the ${stateName} Department of Insurance (typically $25–$150 depending on the line of authority). Budget roughly $300–$500 in total before you take your first client.`,
    },
  ];
}

/**
 * FAQs for prelicensing hub pages (/[state]/prelicensing/)
 * Targets queries like "how many hours of prelicensing does [state] require"
 */
export function getPrelicensingHubFAQs(
  stateName: string,
  prelicensingHours: number
): FAQ[] {
  return [
    {
      question: `How many prelicensing hours does ${stateName} require?`,
      answer: `${stateName} requires candidates to complete a minimum of ${prelicensingHours} hours of approved prelicensing education before they can sit for the state insurance licensing exam. This requirement applies to the combined Life & Health line of authority. Individual Life-only or Health-only courses typically require fewer hours. JustInsurance courses are certified to meet the exact ${stateName} hour requirement for each line.`,
    },
    {
      question: `Can I take my ${stateName} insurance prelicensing course online?`,
      answer: `Yes. ${stateName} approves online, self-paced prelicensing courses, and that is exactly what JustInsurance offers. You can study on your laptop, tablet, or phone—at home, on your lunch break, or anywhere with an internet connection. There are no scheduled live sessions to attend. You simply work through the course material, pass the built-in chapter quizzes, and complete the final exam to earn your certificate of completion, which you then submit to the state exam provider to schedule your licensing exam.`,
    },
    {
      question: `What topics are covered in the ${stateName} insurance prelicensing course?`,
      answer: `The ${stateName} prelicensing curriculum covers the foundational concepts every licensed insurance producer must know: insurance principles and contract law, types of life insurance policies (term, whole life, universal life, variable products), annuities, health insurance products (major medical, disability income, long-term care, Medicare), ${stateName}-specific insurance regulations and statutes, agent ethics and the Unfair Trade Practices Act, and policy provisions and riders. The final portion of the exam closely follows these topics, so mastering the course content is the best exam preparation.`,
    },
    {
      question: `How long does the ${stateName} insurance prelicensing course take to complete?`,
      answer: `The time it takes depends on your study pace and prior familiarity with insurance concepts. Most students complete the ${stateName} prelicensing course in one to three weeks studying one to two hours per day. Because JustInsurance courses are fully self-paced, you can accelerate through sections you already know and spend more time on unfamiliar topics. There is no expiration deadline during your enrollment period, so you can take the time you need to feel truly prepared before you sit for the state exam.`,
    },
    {
      question: `Does my ${stateName} prelicensing certificate expire?`,
      answer: `Yes. In most states, including ${stateName}, a prelicensing certificate of completion is valid for a limited window—typically 12 months from the date of issuance—within which you must pass the state exam and apply for your license. If your certificate expires before you complete the process, you may be required to retake the prelicensing course. JustInsurance recommends scheduling your state exam promptly after you finish your course to avoid any expiration issues.`,
    },
  ];
}

/**
 * FAQs for CE hub pages (/[state]/continuing-education/)
 * Targets queries like "[state] insurance CE requirements" and renewal cycles
 */
export function getCEHubFAQs(
  stateName: string,
  ceHours: number,
  renewalYears: number
): FAQ[] {
  return [
    {
      question: `What are the continuing education requirements for insurance agents in ${stateName}?`,
      answer: `${stateName} requires licensed insurance producers to complete ${ceHours} hours of approved continuing education (CE) every ${renewalYears} year${renewalYears > 1 ? "s" : ""} to maintain an active license. A portion of those hours must typically cover ethics topics as mandated by state regulation. CE must be completed through an approved provider before your license renewal deadline. JustInsurance offers state-approved online CE courses that you can complete at your own pace—no classrooms or live sessions required.`,
    },
    {
      question: `When do I need to renew my insurance license in ${stateName}?`,
      answer: `${stateName} insurance licenses must be renewed every ${renewalYears} year${renewalYears > 1 ? "s" : ""}. Your renewal deadline is typically tied to your birth month or the anniversary of your original license issue date—check your ${stateName} Department of Insurance account for your exact deadline. You must complete all required CE hours and submit your renewal application before the deadline to avoid a lapse in licensure. JustInsurance recommends completing your CE at least 30 days before your renewal date.`,
    },
    {
      question: `Can I complete my ${stateName} insurance CE online?`,
      answer: `Yes. ${stateName} approves online CE courses, and JustInsurance provides a full catalog of self-paced online CE courses that meet all state requirements. You can start and stop at any time, pick up where you left off, and complete your hours on any device. Once you finish a course, JustInsurance reports your completion directly to the state on your behalf, so your CE credit is recorded automatically without any extra steps on your part.`,
    },
    {
      question: `What topics can count toward my ${stateName} CE requirement?`,
      answer: `Approved CE topics in ${stateName} include ethics and professional conduct (typically required as a mandatory subset of total hours), life insurance products and regulations, health insurance products, Medicare and Medicaid, long-term care, annuities, ${stateName} insurance statutes and regulations, flood insurance, and more. JustInsurance offers courses across all approved topic areas, so you can choose subjects that are relevant to your practice and complete your ${ceHours}-hour requirement efficiently.`,
    },
    {
      question: `What happens if I miss my ${stateName} insurance license renewal deadline?`,
      answer: `If you fail to complete your CE and renew your license before the ${stateName} deadline, your license will lapse. A lapsed license means you cannot legally sell or solicit insurance until your license is reinstated. ${stateName} typically offers a grace period or reinstatement window, but it may require additional fees, a reinstatement application, and in some cases completing additional CE hours. Letting your license lapse can also affect your ability to receive commissions. Complete your CE early to avoid this situation—JustInsurance makes it easy to finish in a single weekend if needed.`,
    },
  ];
}

/**
 * FAQs for individual prelicensing course pages (/[state]/prelicensing/[loa]/)
 * Targets queries like "[state] [LOA] prelicensing course cost" and exam specifics
 */
export function getPrelicensingCourseFAQs(
  stateName: string,
  loaName: string,
  hours: number,
  price: string
): FAQ[] {
  return [
    {
      question: `How many hours is the ${stateName} ${loaName} prelicensing course?`,
      answer: `The ${stateName} ${loaName} prelicensing course requires ${hours} hours of approved education. This is the minimum required by the ${stateName} Department of Insurance before you can schedule your state licensing exam. The JustInsurance ${stateName} ${loaName} course is certified to fulfill this exact requirement. The ${hours} hours are delivered through video lessons, reading materials, and chapter quizzes that you complete at your own pace online.`,
    },
    {
      question: `How much does the ${stateName} ${loaName} prelicensing course cost?`,
      answer: `The JustInsurance ${stateName} ${loaName} prelicensing course is priced at ${price}. This includes full access to all ${hours} hours of course content, chapter review quizzes, a comprehensive practice exam that mirrors the format of the actual state exam, and your official certificate of completion—everything you need to get exam-ready in one purchase, with no hidden fees.`,
    },
    {
      question: `What does the ${stateName} ${loaName} insurance exam cover?`,
      answer: `The ${stateName} ${loaName} insurance licensing exam covers the core knowledge required to sell ${loaName.toLowerCase()} products professionally. Expect questions on policy types and provisions, riders and exclusions, underwriting basics, beneficiary designations, claims procedures, state-specific ${stateName} insurance laws and regulations, producer conduct and ethics, and the Unfair Trade Practices Act. JustInsurance's course content maps directly to the official ${stateName} exam content outline so you study exactly what will be tested.`,
    },
    {
      question: `How hard is the ${stateName} ${loaName} insurance licensing exam?`,
      answer: `The ${stateName} ${loaName} licensing exam is challenging for unprepared candidates, but very passable with the right preparation. First-time pass rates nationwide hover around 50–60% for candidates who take the exam without adequate study. Candidates who complete a thorough prelicensing course like the one offered by JustInsurance see significantly higher pass rates because they've reviewed all tested content and practiced with exam-style questions before test day. The key is not to rush—take the full practice exam before scheduling your real exam and aim for consistent scores above 75%.`,
    },
    {
      question: `How long do I have access to the JustInsurance ${stateName} ${loaName} prelicensing course?`,
      answer: `Once you enroll in the JustInsurance ${stateName} ${loaName} prelicensing course, you have access until you pass your state exam and receive your license—or for a full 12 months, whichever comes first. This gives you ample time to study without feeling rushed. If you have any questions along the way, JustInsurance support is available to help you get unstuck. Most students complete the course well within the first two to four weeks of enrollment.`,
    },
  ];
}

/**
 * FAQs for individual CE course pages (/[state]/continuing-education/[loa]/)
 * Targets queries about CE hour requirements, renewal cycles, and online options
 */
export function getCECourseFAQs(
  stateName: string,
  loaName: string,
  hours: number,
  renewalYears: number
): FAQ[] {
  return [
    {
      question: `How many CE hours do I need for my ${stateName} ${loaName} license?`,
      answer: `${stateName} requires ${hours} continuing education hours every ${renewalYears} year${renewalYears > 1 ? "s" : ""} to renew a ${loaName} license. Some of those hours must cover ethics as a mandatory component. JustInsurance offers a complete ${stateName} ${loaName} CE package that meets all ${hours}-hour requirements with courses approved directly by the ${stateName} Department of Insurance.`,
    },
    {
      question: `Can I complete my ${stateName} ${loaName} CE requirement entirely online?`,
      answer: `Yes. JustInsurance's ${stateName} ${loaName} CE courses are 100% online and self-paced. You can complete your ${hours} required hours from any device, at any time that fits your schedule. There are no live sessions, no commutes to a classroom, and no rigid deadlines within the course itself. Once you finish, JustInsurance reports your completion electronically to ${stateName} so your CE credit appears on your license record automatically.`,
    },
    {
      question: `When should I complete my ${stateName} ${loaName} CE before my license renewal?`,
      answer: `Your CE must be completed and reported to ${stateName} before your license renewal deadline, which falls every ${renewalYears} year${renewalYears > 1 ? "s" : ""}. JustInsurance recommends finishing your CE at least 30 days before your renewal date to allow time for completion records to be processed and to handle any unexpected issues. Waiting until the last week is risky—if there's a reporting delay or you need to retake a course assessment, you could miss your deadline and face a license lapse.`,
    },
    {
      question: `Does ${stateName} require ethics CE for ${loaName} license renewal?`,
      answer: `Yes. Like most states, ${stateName} mandates that a portion of your required CE hours cover ethics and professional conduct topics. This ethics requirement is built into the total ${hours}-hour requirement. JustInsurance's ${stateName} ${loaName} CE catalog includes ethics-approved courses that fulfill this mandatory component, so you can complete your entire renewal requirement in one place without needing to source ethics courses separately.`,
    },
    {
      question: `Will JustInsurance report my ${stateName} CE hours to the state for me?`,
      answer: `Yes. When you complete a CE course through JustInsurance, we electronically report your course completion to the ${stateName} Department of Insurance on your behalf. This reporting typically happens within one to two business days of course completion. You do not need to submit certificates yourself or manually update your state license record. We recommend logging into your ${stateName} Department of Insurance producer portal after a few days to confirm your CE credits have been posted before your renewal deadline.`,
    },
  ];
}
