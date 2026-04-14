// All long-form content for /study-guide, extracted from the source study guide.

export const LIFE_INSURANCE_TYPES = [
  { name: "Term Life", desc: "Pure death benefit for a defined period (10, 20, 30 years). No cash value. Cheapest way to buy a large death benefit." },
  { name: "Whole Life", desc: "Permanent coverage with guaranteed death benefit, fixed premiums, and guaranteed cash value growth. More expensive than term but builds equity." },
  { name: "Universal Life", desc: "Flexible permanent coverage. Premiums and death benefit can be adjusted. Cash value earns interest based on current rates with a minimum guaranteed rate." },
  { name: "Variable Life", desc: "Permanent coverage with cash value invested in sub-accounts (like mutual funds). Returns not guaranteed. Requires a securities license in addition to an insurance license." },
];

export const ANNUITY_TYPES = [
  { name: "Fixed Annuity", desc: "Guarantees a minimum interest rate. Safe, predictable, no market exposure." },
  { name: "Variable Annuity", desc: "Contract value tied to investment sub-accounts. Returns not guaranteed. Requires a securities license." },
  { name: "Indexed (Equity-Indexed)", desc: "Returns linked to a market index (like the S&P 500) but with downside protection — some upside with a floor against loss." },
];

export const HEALTH_PLAN_TYPES = [
  { name: "HMO", desc: "Members must use in-network providers and get a referral from a PCP to see a specialist. Lower costs, less flexibility." },
  { name: "PPO", desc: "Members can see any doctor without a referral. In-network costs less; out-of-network allowed but more expensive." },
  { name: "EPO", desc: "No referrals needed (like a PPO) but must stay in-network (like an HMO). Increasingly common on recent exams." },
  { name: "HSA", desc: "Tax-advantaged account paired with a High-Deductible Health Plan (HDHP). Contributions, growth, and qualified medical withdrawals are all tax-free." },
];

export const DISABILITY_CONCEPTS = [
  { name: "Elimination Period", desc: "The waiting period before benefits begin. Longer elimination period = lower premium." },
  { name: "Own-Occupation", desc: "You're disabled if you can't perform the duties of YOUR specific occupation. More favorable for the insured." },
  { name: "Any-Occupation", desc: "You're disabled only if you can't work ANY job for which you're reasonably suited. More restrictive — insurer-friendly." },
];

export const LTC_CONCEPTS = [
  { name: "ADLs (6)", desc: "Eating, bathing, dressing, toileting, transferring, and continence. Typically requires inability to perform 2 of 6 to trigger benefits." },
  { name: "Benefit Trigger", desc: "Inability to perform 2 of 6 ADLs or cognitive impairment." },
];

export const KEY_PROVISIONS = [
  { name: "Incontestability Clause", desc: "After 2 years in force, the insurer cannot deny a death claim based on misrepresentation (except fraud). Protects beneficiaries." },
  { name: "Grace Period", desc: "Time after a missed premium during which the policy stays in force (typically 31 days for life; 10 days for many others)." },
  { name: "Free Look Period", desc: "After receiving a new policy, the owner has 10–30 days to review and return it for a full refund." },
  { name: "Waiver of Premium Rider", desc: "If the insured becomes totally disabled, premiums are waived while the policy stays in force." },
];

export const GOVERNMENT_PROGRAMS = [
  { name: "Medicare Part A", desc: "Hospital insurance. Covers inpatient stays, skilled nursing, and some home health. Most people pay no premium." },
  { name: "Medicare Part B", desc: "Medical insurance. Covers doctor visits and outpatient services. Requires a monthly premium." },
  { name: "Medicare Part C", desc: "Medicare Advantage — private plan alternative to original Medicare." },
  { name: "Medicare Part D", desc: "Prescription drug coverage offered through private insurers." },
  { name: "Medicaid", desc: "Joint federal-state program for low-income individuals. Covers long-term care that Medicare doesn't." },
];

export const CORE_PRINCIPLES = [
  { name: "Insurable Interest", desc: "Buyer must have a financial stake in the person or property insured. Must exist at application for life; at loss for property." },
  { name: "Indemnity", desc: "Insurance restores you to your pre-loss financial position — no better, no worse. You cannot profit from a claim." },
  { name: "Subrogation", desc: "After paying a claim, the insurer can pursue the responsible third party. Does NOT apply to life insurance." },
  { name: "Utmost Good Faith", desc: "Complete honesty required from both parties. Related: Misrepresentation, Concealment, Warranty." },
  { name: "Adhesion", desc: "Written entirely by the insurer; accepted or rejected as-is. Ambiguous language favors the insured." },
  { name: "Aleatory", desc: "Exchange of values is unequal and depends on a chance event." },
  { name: "Unilateral", desc: "Only the insurer makes an enforceable promise." },
];

export const UNFAIR_PRACTICES = [
  { name: "Misrepresentation", desc: "False statements about policy terms" },
  { name: "Twisting", desc: "Inducing replacement through misrepresentation" },
  { name: "Churning", desc: "Using cash value to buy new policy without genuine benefit" },
  { name: "Rebating", desc: "Giving value as inducement to buy — illegal in most states" },
  { name: "Defamation", desc: "False statements damaging a competitor" },
];

export const REGULATORY_FRAMEWORK = [
  { name: "State Regulation", desc: "Insurance is primarily regulated at the state level by the state insurance commissioner." },
  { name: "McCarran-Ferguson Act (1945)", desc: "Affirmed state authority over insurance regulation." },
  { name: "NAIC", desc: "Develops model laws but has NO enforcement authority — states choose to adopt them." },
  { name: "Gramm-Leach-Bliley Act", desc: "Allows financial institutions to affiliate; includes consumer privacy protections." },
];

export interface GlossaryTerm {
  name: string;
  def: string;
  lh?: boolean;
}

export const GLOSSARY: GlossaryTerm[] = [
  { name: "Actual Cash Value (ACV)", def: "Replacement cost of damaged property minus depreciation. Represents the property's fair market value at time of loss." },
  { name: "Adhesion", def: "A contract written entirely by the insurer and accepted or rejected as-is. Ambiguities are interpreted against the drafter (insurer)." },
  { name: "Agent", def: "A licensed person authorized to act on behalf of an insurer. Binds the company within the scope of their authority." },
  { name: "Aleatory Contract", def: "A contract where one party may receive significantly more or less than the other, depending on chance." },
  { name: "Annuity", def: "A contract with an insurer that provides a stream of income payments, typically used for retirement income.", lh: true },
  { name: "Assignment", def: "Transfer of ownership rights in a policy to another party. Life insurance policies can generally be assigned; property policies typically cannot without insurer consent.", lh: true },
  { name: "Beneficiary", def: "The person or entity designated to receive the death benefit from a life insurance policy.", lh: true },
  { name: "Binder", def: "A temporary insurance contract providing coverage until a formal policy is issued." },
  { name: "Breach of Warranty", def: "A violation of a statement guaranteed to be true in an insurance application. Can void the policy." },
  { name: "Broker", def: "A licensed producer who represents the insured (buyer), not the insurer. Cannot bind coverage without insurer authorization." },
  { name: "Cash Surrender Value", def: "Amount a policyowner receives when they voluntarily terminate a permanent life insurance policy before death or maturity.", lh: true },
  { name: "Claim", def: "A formal request by an insured to the insurer for compensation following a covered loss." },
  { name: "COBRA", def: "Federal law allowing employees who lose group health coverage to continue coverage for up to 18–36 months by paying the full premium themselves.", lh: true },
  { name: "Coinsurance", def: "In health: the percentage of costs the insured pays after the deductible (e.g., 80/20 split). In property: requirement to insure to a certain percentage of value for full replacement cost." },
  { name: "Concealment", def: "Intentional failure to disclose a material fact to an insurer. Can void a policy." },
  { name: "Consideration", def: "Something of value exchanged between parties to form a contract. In insurance: premiums from the insured; promise to pay covered claims from the insurer." },
  { name: "Deductible", def: "The amount the insured must pay out-of-pocket before insurance coverage kicks in." },
  { name: "Defamation", def: "Making false statements about a competitor that damage their reputation. An unfair trade practice." },
  { name: "Depreciation", def: "The reduction in value of property over time due to age, wear, and obsolescence. Applied to calculate ACV." },
  { name: "Endorsement (Rider)", def: "An amendment to an insurance policy that changes its terms, adds coverage, or excludes coverage." },
  { name: "Estoppel", def: "When an insurer's prior conduct prevents it from later denying coverage or asserting a defense it could have raised earlier." },
  { name: "Exclusion", def: "A specific condition, circumstance, or type of loss that a policy does NOT cover." },
  { name: "Face Amount", def: "The death benefit stated in a life insurance policy.", lh: true },
  { name: "Fiduciary", def: "A person who holds a position of trust and is legally required to act in another's best interest. Insurance agents are fiduciaries with respect to premium funds." },
  { name: "Fraud", def: "Intentional misrepresentation or concealment of a material fact to obtain a policy or claim benefit." },
  { name: "Grace Period", def: "The time after a missed premium during which coverage remains in force (typically 31 days for life; 10 days for some other types)." },
  { name: "Hazard", def: "A condition that increases the likelihood or severity of a loss. Types: physical hazard, moral hazard (intent to defraud), morale hazard (carelessness because of coverage)." },
  { name: "Indemnity", def: "Insurance restores the insured to their pre-loss financial condition — no profit from a claim." },
  { name: "Insurable Interest", def: "A financial stake in a person or property such that a loss would cause financial harm. Required for a valid insurance contract." },
  { name: "Insured", def: "The person or entity covered by an insurance policy." },
  { name: "Insurer", def: "The insurance company that accepts the risk and promises to pay covered claims." },
  { name: "Lapse", def: "Termination of a policy for non-payment of premium after the grace period expires." },
  { name: "Liability", def: "Legal responsibility to pay for harm caused to another person or their property." },
  { name: "Material Fact", def: "Information that would affect an insurer's decision to offer coverage or the terms offered. Must be disclosed truthfully." },
  { name: "Misrepresentation", def: "A false statement of a material fact in the application. Can make the policy voidable." },
  { name: "Moral Hazard", def: "Increased risk created when an insured has intent to cause or exaggerate a loss." },
  { name: "Morale Hazard", def: "Increased risk due to carelessness or indifference because insurance exists." },
  { name: "Named Insured", def: "The person or entity specifically identified in the policy declarations as the primary insured." },
  { name: "Negligence", def: "Failure to exercise reasonable care, resulting in harm to another person." },
  { name: "Peril", def: "The direct cause of a loss (fire, theft, windstorm, etc.)." },
  { name: "Premium", def: "The payment made by the insured in exchange for insurance coverage." },
  { name: "Rebating", def: "Giving any form of value (money, gifts, services) as an inducement to purchase insurance. Illegal in most states." },
  { name: "Replacement Cost", def: "The cost to repair or replace damaged property with new materials of like kind and quality, without deducting for depreciation." },
  { name: "Risk", def: "The uncertainty of loss; the possibility that a covered event will occur." },
  { name: "Subrogation", def: "The insurer's right to pursue a third party that caused a loss after paying the insured's claim." },
  { name: "Twisting", def: "Inducing a policyholder to cancel an existing policy and replace it with a new one through misrepresentation — to the client's detriment. An unfair trade practice." },
  { name: "Underwriting", def: "The process of evaluating and classifying risk to determine whether to offer coverage and at what premium." },
  { name: "Unilateral Contract", def: "Only the insurer makes an enforceable promise. The insured doesn't promise to pay premiums but loses coverage if they don't." },
  { name: "Utmost Good Faith", def: "Insurance contracts require complete honesty from both parties — the insured must disclose all material facts." },
  { name: "Waiver", def: "Voluntary, intentional surrender of a known right. Example: consistently accepting late premiums may waive the right to cancel for non-payment." },
];

export interface Mnemonic {
  num: number;
  title: string;
  phrase: string;
  items: string[];
}

export const UNIVERSAL_MNEMONICS: Mnemonic[] = [
  { num: 1, title: "The Four Contract Principles", phrase: '"Always Use Umbrellas Accordingly"', items: ["**A** — Aleatory (random outcome, like rain)", "**U** — Unilateral (only insurer makes an enforceable promise)", "**U** — Utmost Good Faith (full honesty required)", "**A** — Adhesion (take it or leave it contract)"] },
  { num: 2, title: "Life Insurance Types", phrase: '"The Whole Universe Varies"', items: ["**T** — Term (temporary protection only)", "**W** — Whole (permanent, builds cash value)", "**U** — Universal (flexible premiums)", "**V** — Variable (investments, needs securities license)"] },
  { num: 3, title: "Annuity Phases", phrase: '"All Doctors Defer"', items: ["**A** — Accumulation (money going IN)", "**D** — Deferral (waiting period)", "**D** — Distribution (money coming OUT)"] },
  { num: 4, title: "HO Forms", phrase: '"Big Brown Spiders Can Comprehensively Conquer Messy Modifications"', items: ["**HO-1** — Basic", "**HO-2** — Broad", "**HO-3** — Special (most common)", "**HO-4** — Contents/Renters", "**HO-5** — Comprehensive", "**HO-6** — Condo", "**HO-8** — Modified (older homes)"] },
  { num: 5, title: "Surety Bond Parties", phrase: '"Possibly Obligated, Surely"', items: ["**P** — Principal (must perform the obligation)", "**O** — Obligee (the one who's protected)", "**S** — Surety (guarantees performance)"] },
  { num: 6, title: "Unfair Trade Practices", phrase: '"Most Rotten Traders Cheat Deliberately"', items: ["**M** — Misrepresentation", "**R** — Rebating", "**T** — Twisting", "**C** — Churning", "**D** — Defamation"] },
  { num: 7, title: "Medicare Parts", phrase: '"All Brave Consumers Deserve"', items: ["**A** — All hospital care (Part A)", "**B** — Basic medical/doctor (Part B)", "**C** — Combined/Advantage (Part C)", "**D** — Drugs/prescriptions (Part D)"] },
  { num: 8, title: "Monopolistic Workers' Comp States", phrase: '"No Other Workers Win"', items: ["**N** — North Dakota (WSI)", "**O** — Ohio (BWC)", "**W** — Washington (L&I)", "**W** — Wyoming (WCD)"] },
  { num: 9, title: "Disability Definitions", phrase: '"Own = Good for YOU, Any = Good for Insurer"', items: ["**Own-Occupation:** \"I can't do MY specific job\" → You win, benefits paid", "**Any-Occupation:** \"I can't do ANY job\" → Insurer wins, harder to qualify"] },
  { num: 10, title: "Community Property States", phrase: '"All Cars Idling Loudly Need New Tires Will Work"', items: ["**A**rizona · **C**alifornia · **I**daho · **L**ouisiana · **N**evada · **N**ew Mexico · **T**exas · **W**ashington · **W**isconsin"] },
];

export const STATE_LAW_MNEMONICS: Mnemonic[] = [
  { num: 11, title: "States Without Mandatory Auto Insurance", phrase: '"NH and VA Say No"', items: ["**New Hampshire:** No auto insurance requirement at all", "**Virginia:** Pay an annual uninsured motor vehicle fee ($500) instead", "These are the ONLY two states — remember them as a pair"] },
  { num: 12, title: "Free Look Period Variations", phrase: '"Ten Days Standard, Thirty Days Senior"', items: ["**10-day free look:** Most life and health policies", "**30-day free look:** Medicare Supplement policies and most replacement policies"] },
  { num: 13, title: "Surplus Lines Critical Rule", phrase: '"Non-Admitted = No State Guarantee"', items: ["Surplus lines insurers are non-admitted (not licensed in the state)", "They are NOT covered by state guaranty associations", "If a surplus lines insurer becomes insolvent, policyholders have no guaranty fund protection"] },
  { num: 14, title: "The NAIC's Role", phrase: '"Model, Not Mandatory"', items: ["NAIC creates model laws — templates for states to adopt", "NAIC does NOT enforce anything. Zero regulatory authority.", "Who regulates insurance? ALWAYS the state insurance commissioner — never the NAIC"] },
  { num: 15, title: "Incontestability & Suicide Clause", phrase: '"Two and Two — Both at Year Two"', items: ["**Incontestability:** After 2 years, insurer cannot deny a claim for misrepresentation", "**Suicide Clause:** After 2 years, suicidal death is covered as a normal death claim", "Both provisions have 2-year periods — the \"2 and 2\" rule"] },
];

export interface PracticeQ {
  id: string;
  tag: string;
  text: string;
  options: { letter: string; text: string; correct?: boolean }[];
  answer: string;
  explanation: string;
}

export const PRACTICE_QUESTIONS: PracticeQ[] = [
  { id: "q1", tag: "Universal — Contract Principles", text: "An insurance policy is written entirely by the insurer and presented to the applicant on a 'take it or leave it' basis. Which contract characteristic does this best describe?", options: [{ letter: "A", text: "Aleatory" }, { letter: "B", text: "Unilateral" }, { letter: "C", text: "Adhesion", correct: true }, { letter: "D", text: "Indemnity" }], answer: "C — Adhesion", explanation: "An adhesion contract is written by one party and accepted or rejected as-is. Because the insured can't negotiate terms, ambiguous language is always interpreted in the insured's favor." },
  { id: "q2", tag: "Universal — Subrogation", text: "After a fire damages Jennifer's home, her homeowners insurer pays her $85,000 claim. The fire was caused by a neighbor's negligence. What right does Jennifer's insurer now have?", options: [{ letter: "A", text: "The right to cancel Jennifer's policy" }, { letter: "B", text: "The right to pursue the negligent neighbor for the $85,000 it paid", correct: true }, { letter: "C", text: "The right to increase Jennifer's premium at renewal" }, { letter: "D", text: "The right to deny future claims from Jennifer" }], answer: "B", explanation: "This is subrogation — the insurer \"steps into the shoes\" of the insured and can pursue the responsible third party to recover what it paid. This upholds the principle of indemnity (no one profits from insurance)." },
  { id: "q3", tag: "Universal — Life Insurance", text: "A 45-year-old client wants permanent life insurance with the flexibility to vary premium payments depending on his cash flow. Which policy type best fits this need?", options: [{ letter: "A", text: "20-year term" }, { letter: "B", text: "Whole life" }, { letter: "C", text: "Universal life", correct: true }, { letter: "D", text: "Variable annuity" }], answer: "C — Universal Life", explanation: "Universal life offers permanent coverage with flexible premiums — the client can adjust premium payments based on available cash value. Whole life has fixed premiums; term isn't permanent; variable annuity isn't life insurance." },
  { id: "q4", tag: "Universal — HO Forms", text: "Marcus is a tenant in an apartment building. He wants insurance to cover his personal property and personal liability. Which homeowners form should his agent recommend?", options: [{ letter: "A", text: "HO-3" }, { letter: "B", text: "HO-4", correct: true }, { letter: "C", text: "HO-6" }, { letter: "D", text: "HO-8" }], answer: "B — HO-4", explanation: "HO-4 is specifically designed for renters/tenants. It covers personal property and liability but does NOT cover the building structure (that's the landlord's concern). HO-6 is for condo owners; HO-3 for homeowners; HO-8 for older homes." },
  { id: "q5", tag: "Universal — Social Insurance", text: "Which of the following BEST describes the difference between Medicare and Medicaid?", options: [{ letter: "A", text: "Medicare is for low-income individuals; Medicaid is for people over age 65" }, { letter: "B", text: "Medicare is primarily for people age 65+ and certain disabled individuals; Medicaid is need-based for low-income individuals", correct: true }, { letter: "C", text: "Both Medicare and Medicaid are administered entirely by the federal government" }, { letter: "D", text: "Medicare covers long-term custodial care; Medicaid does not" }], answer: "B", explanation: "Medicare is a federal program primarily for people age 65 and older (and some younger disabled individuals). Medicaid is a joint federal-state program based on income and asset need. Medicare does NOT cover long-term custodial care — that's Medicaid's role." },
  { id: "q6", tag: "State-Specific — Texas", text: "Under Texas law, which of the following is TRUE regarding the sale of annuities to senior clients?", options: [{ letter: "A", text: "Texas agents require no special training before selling annuities to any client" }, { letter: "B", text: "Texas agents must complete a one-time 8-hour senior suitability training before selling annuities to clients age 65+", correct: true }, { letter: "C", text: "Variable annuities in Texas do not require a securities registration" }, { letter: "D", text: "Texas prohibits the sale of fixed indexed annuities to clients over age 70" }], answer: "B", explanation: "Texas, like Nevada and several other states, requires agents to complete a one-time 8-hour senior suitability training course before selling annuities to clients age 65+. This training must be documented and agents must make a suitability determination before recommending a product." },
  { id: "q7", tag: "State-Specific — California", text: "A California Life & Health agent replaces an existing life insurance policy for a client. Which of the following actions is REQUIRED under California law?", options: [{ letter: "A", text: "Nothing additional is required beyond a signed application" }, { letter: "B", text: "The agent must complete and provide the client with a replacement notice and submit it to the insurer", correct: true }, { letter: "C", text: "The agent must contact the prior insurer directly to cancel the old policy on the client's behalf" }, { letter: "D", text: "The client must wait 60 days before the new policy takes effect" }], answer: "B", explanation: "California, like most states, has specific replacement regulations. When an agent replaces an existing life insurance policy, they must provide the client with a signed replacement notice and submit a copy to the replacing insurer. Failure to do so is an unfair trade practice violation." },
  { id: "q8", tag: "State-Specific — Hawaii", text: "Under Hawaii's Prepaid Health Care Act, which employees must be provided health insurance by their employer?", options: [{ letter: "A", text: "All full-time employees working 40+ hours per week" }, { letter: "B", text: "All employees working 20 or more hours per week", correct: true }, { letter: "C", text: "Only salaried employees" }, { letter: "D", text: "Only employees employed for more than 1 year" }], answer: "B", explanation: "Hawaii's Prepaid Health Care Act requires employers to provide health insurance to employees working 20 or more hours per week. This is unique — no other state has this specific threshold in its employer health insurance mandate." },
  { id: "q9", tag: "State-Specific — Washington", text: "Washington State's WA Cares Fund is best described as:", options: [{ letter: "A", text: "A state flood insurance program" }, { letter: "B", text: "A state-funded long-term care benefit program funded by employee payroll tax", correct: true }, { letter: "C", text: "A Medicare Supplement program for Washington residents" }, { letter: "D", text: "A voluntary retirement savings account" }], answer: "B", explanation: "The WA Cares Fund is the nation's first mandatory state long-term care program. Washington employees pay a payroll tax (0.58% of wages) and can receive LTC benefits after meeting the vesting period requirements." },
  { id: "q10", tag: "State-Specific — Maine", text: "Under Maine's health insurance laws, which of the following is TRUE regarding individual health insurance policies?", options: [{ letter: "A", text: "Maine insurers may deny individual health coverage based on an applicant's health status" }, { letter: "B", text: "Maine uses experience rating, meaning healthier individuals pay lower premiums" }, { letter: "C", text: "Maine requires guaranteed issue for individual health insurance — insurers cannot deny coverage based on health status", correct: true }, { letter: "D", text: "Maine follows the same rules as most other states and allows medical underwriting for individual policies" }], answer: "C", explanation: "Maine has strong guaranteed issue health insurance laws that pre-date the ACA and are more expansive. Insurers in Maine cannot deny individual health coverage based on health status, and Maine uses community rating — the same premium regardless of health history." },
];

export interface DayPlan {
  day: number;
  goal: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export const SEVEN_DAY_PLAN: DayPlan[] = [
  { day: 1, goal: "Build your L&H Foundation", morning: "Read Part 2 (Life & Health section) completely. Don't try to memorize everything — focus on understanding the logic. Why does whole life build cash value? How does a conditional receipt protect you? (2 hours)", afternoon: "Create flashcards for each key term in the L&H sections. Focus on: the four life insurance types, annuity phases, Medicare parts, and disability definitions. (2 hours)", evening: "Review your flashcards. Read through Part 5 Mnemonics — find the ones that click for you. (1 hour)" },
  { day: 2, goal: "Complete your Universal Foundation", morning: "Read Part 2, Property & Casualty section. Make a chart of HO forms: who they're for, what they cover. Map out auto insurance coverage types: liability, collision, comprehensive, UM/UIM. (2 hours)", afternoon: "Read Part 2, Universal Principles section. Create flashcards for: subrogation, indemnity, insurable interest, contract principles, and unfair trade practices. (2 hours)", evening: "Review Part 3, Key Terms Glossary — work through all 50 terms. Mark any you don't know well — these become your Day 6 focus. (1 hour)" },
  { day: 3, goal: "Master State-Specific Laws", morning: "Jump to your state's section in Part 4. Read the full profile: exam format, question counts, time limit, topic weights, and the Top 3 failure points. Find your state's DOI website and download the official exam content outline. (2–3 hours)", afternoon: "Study the state-specific law section at the level of detail required (states with 30% weight need more time than states with 17%). Focus on: licensing requirements, unfair practices, and unique programs in your state. (2 hours)", evening: "Review state-specific flashcards. Test yourself on the 3 failure areas noted in your state's section. (1 hour)" },
  { day: 4, goal: "Policy Types Deep Dive", morning: "Life & Health deep dive: Review policy provisions (grace period, free look, incontestability, suicide clause, waiver of premium). Understand HOW each provision is triggered and what outcome it produces. (2 hours)", afternoon: "Deep dive on Annuities and Long-Term Care: Know the difference between fixed, variable, and indexed annuities. Review LTC triggers — the 6 ADLs and how LTC interacts with Medicare and Medicaid. (2 hours)", evening: "Write a summary in your own words: \"If a client has X situation, they need Y policy.\" Scenario-based thinking is exactly what the exam tests. (1 hour)" },
  { day: 5, goal: "Practice Questions + Find the Gaps", morning: "Complete all 10 questions in Part 6 without looking at answers first. Grade yourself and note every wrong answer. For each wrong answer, go back to the relevant section and re-read it. (2 hours)", afternoon: "If you missed 3+ questions in any single category, add it to your Day 6 weak-area list. Realistic target: scoring at least 70% on Part 6. If you're below 60%, allocate more time on Days 6 and 7. (2 hours)", evening: "Rest and consolidate. Don't cram new concepts the night of Day 5 — let your brain process what it's absorbed." },
  { day: 6, goal: "Shore Up Weak Areas", morning: "Return to any concept area where you missed 2+ questions. Don't just re-read — write the concept out in your own words, then create a new example. Active recall locks in retention. (2 hours)", afternoon: "Re-test on your weak areas with additional practice questions from the full exam library. Track your improvement. (2 hours)", evening: "Light review — go through your flashcard deck one more time. Focus on any mnemonics you haven't fully locked in. Review state-specific mnemonics for your state. (1 hour)" },
  { day: 7, goal: "Final Mock Exam + Exam Day Prep", morning: "Take a full timed mock exam. Set a timer for your state's actual time limit. Don't stop to look anything up — simulate real testing conditions. (3 hours)", afternoon: "Review mock exam results. For anything wrong: one final read-through of the relevant concept. Don't try to learn new material on Day 7 — reinforce what you know. (1 hour)", evening: "Look up the testing center address and parking. Confirm appointment time and required ID. Set your alarm. Lay out everything you need tonight. Get to bed at a reasonable hour — rest genuinely improves performance." },
];

export const EXAM_DAY_TIPS = [
  { num: "01", title: "Bring the Right ID", text: "Every testing center requires a government-issued photo ID (driver's license or passport). Some require a secondary ID. Your name on the ID must exactly match your exam registration." },
  { num: "02", title: "Arrive 15–20 Minutes Early", text: "Testing centers will not admit you if you're late. Traffic happens; parking is unpredictable. Budget extra time. Late arrivals typically forfeit their exam fee with no refund." },
  { num: "03", title: "Understand the Format First", text: "Take 2–3 minutes to review the testing interface before answering your first question. Know how to flag/mark questions for review, navigate between questions, and see your progress." },
  { num: "04", title: "Budget Your Time", text: "For a 150-question, 2.5-hour exam: that's 1 minute per question. Spend no more than 90 seconds on any single question. If you're stuck, mark it and move on." },
  { num: "05", title: "Read Every Answer Choice", text: "The exam is built to catch students who stop reading after the first \"right-sounding\" answer. Read all four choices before selecting. The BEST answer is often the MOST correct one." },
  { num: "06", title: "Watch for Qualifier Words", text: "Words like \"always,\" \"never,\" \"only,\" and \"except\" change the meaning of questions entirely. Slow down when you see them. \"Which of the following is NOT...\" trips up a huge number of students." },
  { num: "07", title: "Use the Elimination Method", text: "If you don't know the answer, eliminate what you know is wrong. Usually two of the four choices are clearly incorrect. Now you have a 50/50 shot instead of 25%." },
  { num: "08", title: "Don't Over-Second-Guess", text: "Change an answer only if you have a clear, new reason. If you're just feeling uncertain, your first instinct is statistically more likely to be right. Anxious second-guessing costs more points than it saves." },
  { num: "09", title: "Trust Your Preparation", text: "The material is in your head. Take a breath if you feel panic rising. Anxiety is a liar — it tells you you're not ready when you are. Come back to what you know." },
  { num: "10", title: "Know What to Do After Passing", text: "Most centers print a score report on the spot. Keep it. Then apply for your license through your state's DOI (usually NIPR.com). Have your SSN, pre-licensing certificate, and payment ready." },
];
