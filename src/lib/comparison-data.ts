// Comparison data for /compare hub + /compare/[competitor] pages.
// Reconciled to site standard: 93% pass rate, 80%+ on practice exam three times in a row methodology.

export type ComparisonValue =
  | { kind: "yes"; label?: string }
  | { kind: "no"; label?: string }
  | { kind: "upcharge"; label: string }
  | { kind: "limited"; label: string };

export interface ComparisonRow {
  feature: string;
  justinsurance: ComparisonValue;
  xcel: ComparisonValue;
  examfx: ComparisonValue;
}

export interface Provider {
  slug: "xcel" | "examfx" | "adbanker" | "aceable";
  name: string;
  fullName: string;
  domain: string;
  weaknesses: string[];
  youShouldKnow: string;
}

export const PROVIDERS: Record<string, Provider> = {
  xcel: {
    slug: "xcel",
    name: "XCEL",
    fullName: "XCEL Solutions",
    domain: "xcelsolutions.com",
    weaknesses: [
      "XCEL describes its offering as a 3-part program (prelicensing, prep review, exam simulator), with access windows and inclusions that can vary by package",
      "Livestream class frequency, flashcard access, and extended study time may vary between package tiers and as paid upgrades",
      "Does not publish a specific first-attempt pass rate percentage with disclosed methodology on its public product pages",
      "Pass guarantee terms are not prominently featured on public product pages; refund-eligibility specifics vary by package and state",
    ],
    youShouldKnow:
      "XCEL Solutions markets a 3-part training program (prelicensing course, prep review course, and exam simulator). Access windows, livestream session frequency, flashcard availability, and extended study options can vary by package tier. JustInsurance takes a single all-inclusive approach: the $199 base price covers the same set of features for every student (100+ videos, unlimited adaptive practice exams, 5× weekly live instructor sessions, flashcards, audio vocabulary, AI-powered exam simulations). Always verify current XCEL package contents and guarantee terms at xcelsolutions.com before purchase.",
  },
  examfx: {
    slug: "examfx",
    name: "ExamFX",
    fullName: "ExamFX",
    domain: "examfx.com",
    weaknesses: [
      "Per ExamFX's published pass guarantee policy (examfx.com/pass-guarantee, verified May 2026): the pass guarantee requires taking the state licensing exam within 3 calendar days of scoring 80%+ on their Readiness Exam — verify current terms at examfx.com before purchase",
      "Per ExamFX's published refund policy (examfx.com/refund-policy, verified May 2026): the standard refund policy requires refund request within 48 hours of purchase, and course extensions and in-course purchases are non-refundable — verify current terms at examfx.com before purchase",
      "Pass-rate methodology counts self-reported survey respondents broadly; JustInsurance's published methodology applies a stricter inclusion bar (3× consecutive 80%+ practice-exam scores)",
    ],
    youShouldKnow:
      "ExamFX's pass guarantee requires candidates to take the Readiness Exam no more than three calendar days prior to their state licensing exam, scoring 80% or higher. Because Pearson VUE and PSI testing-center availability varies by market, candidates should plan the sequence carefully. JustInsurance's guarantee allows 30 days from first enrollment to sit for the exam, giving more scheduling flexibility. ExamFX uses multiple package tiers — live instructor sessions are typically reserved for higher-priced packages; verify current tier names and inclusions at examfx.com before purchase. ExamFX publishes line-of-authority pass rates (95% Life, 94% Life & Health, 99% P&C) with disclosed methodology — 2,826 self-reported survey respondents collected Feb 1 – Oct 17, 2025. JustInsurance publishes a 93% pass rate at /pass-rates using a stricter inclusion bar: students who completed the full course, finished recommended hours, and scored 80%+ on the practice exam three times in a row before testing. Both are disclosed; the qualifying criteria differ. (Comparison reflects ExamFX's consumer product; their enterprise Elite Learning platform is a separate B2B offering.)",
  },
  adbanker: {
    slug: "adbanker",
    name: "AD Banker",
    fullName: "AD Banker & Company",
    domain: "adbanker.com",
    weaknesses: [
      "Public product pages use tiered packaging (self-study and instructor-led live web class formats); feature inclusion (live instructor sessions, practice exam access windows, extension durations) can vary by package tier and state — verify current inclusions at adbanker.com before purchase",
      "AD Banker does not prominently publish a specific first-attempt pass rate percentage with disclosed methodology on its public product pages — verify any pass-rate claim and underlying methodology at adbanker.com before relying on it",
      "Pass guarantee and refund policy specifics vary by package and state; candidates should read the current terms on adbanker.com prior to enrolling",
      "Owned by The CE Shop (acquired December 2022, Waud Capital portfolio) — context to consider when evaluating AD Banker alongside other CE Shop-affiliated providers",
    ],
    youShouldKnow:
      "AD Banker & Company is a long-established prelicensing and continuing-education provider (founded 1979, acquired by The CE Shop in December 2022) with multiple product tiers (self-study and instructor-led live web class formats) and state-specific course catalogs. Feature inclusion, access duration, and guarantee terms can vary by package tier and state, so prospective students should read AD Banker's current product and policy pages directly at adbanker.com. JustInsurance takes a single all-inclusive approach instead: the $199 base price covers 100+ videos, unlimited adaptive practice exams, 5× weekly live instructor sessions, flashcards, audio vocabulary, AI-powered exam simulations, and white-glove licensing support — same set of features for every student, no tier shopping. JustInsurance also publishes a 93% pass rate at /pass-rates with full methodology disclosed. Always verify current AD Banker package contents, pass guarantee, and refund terms at adbanker.com before purchase.",
  },
  aceable: {
    slug: "aceable",
    name: "Aceable",
    fullName: "Aceable Insurance",
    domain: "aceable.com",
    weaknesses: [
      "Aceable is primarily known for mobile-first driver-education and real-estate courses; its insurance prelicensing catalog is one component of a broader multi-vertical product line — verify current state and line-of-authority availability at aceable.com/insurance",
      "Public-facing pass-rate claims on the Aceable Insurance product pages should be read carefully alongside their methodology disclosure; verify the current figure and the qualifying criteria at aceable.com/insurance before relying on it for a purchase decision",
      "Live instructor session frequency, flashcard inclusion, and practice-exam depth can vary by course and state — verify current inclusions at aceable.com/insurance before purchase",
      "Pass guarantee and refund terms are set by Aceable's published policy pages; specifics vary by course and state, so candidates should read the current terms at aceable.com/insurance prior to enrolling",
    ],
    youShouldKnow:
      "Aceable Insurance is part of Aceable's broader mobile-first education catalog (driver ed, real estate, insurance) and markets a primarily self-paced, app-based course experience. Pass-rate claims, guarantee terms, and course inclusions should be read directly from aceable.com/insurance with their stated methodology in mind — pass-rate figures are only meaningful alongside a clear disclosure of which students are counted. JustInsurance publishes a 93% pass rate at /pass-rates with a clearly disclosed, stricter inclusion bar: students who completed the full course, finished recommended study hours, and scored 80%+ on the practice exam three times in a row before testing. JustInsurance also includes live instructor sessions 5× per week, unlimited adaptive practice exams, flashcards, AI-powered exam simulations, audio vocabulary, and white-glove NIPR/fingerprint licensing support in the single $199 base price. Always verify current Aceable Insurance terms at aceable.com/insurance before purchase.",
  },
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "100+ Video Lessons Covering Every Exam Topic",
    justinsurance: { kind: "yes", label: "100+ videos included" },
    xcel: { kind: "limited", label: "Video depth varies by package tier" },
    examfx: { kind: "limited", label: "Video depth varies by package tier" },
  },
  {
    feature: "AI-Generated Coverage of State Exam Outline",
    justinsurance: { kind: "yes" },
    xcel: { kind: "limited", label: "Rubi AI Study Partner offered; scope not publicly disclosed" },
    examfx: { kind: "limited", label: "Not in current public consumer packages — verify at examfx.com" },
  },
  {
    feature: "Course Extension Options",
    justinsurance: { kind: "yes", label: "Multiple extensions included" },
    xcel: { kind: "limited", label: "Paid extension available" },
    examfx: { kind: "limited", label: "Paid extensions available per their refund policy" },
  },
  {
    feature: "Practice Exams",
    justinsurance: { kind: "yes", label: "Unlimited + adaptive" },
    xcel: { kind: "limited", label: "Count varies by package" },
    examfx: { kind: "limited", label: "Count varies by package" },
  },
  {
    feature: "Live Instructor Sessions",
    justinsurance: { kind: "yes", label: "5× weekly, included" },
    xcel: { kind: "limited", label: "Livestream availability varies by package" },
    examfx: { kind: "limited", label: "Live webinars offered; availability varies by package" },
  },
  {
    feature: "AI-Powered Adaptive Exam Simulations",
    justinsurance: { kind: "yes" },
    xcel: { kind: "limited", label: "Weighted-topic simulators only; not adaptive AI" },
    examfx: { kind: "limited", label: "Consumer product: weighted-topic only. Elite Learning (B2B) is separate." },
  },
  {
    feature: "Flashcards Included in Base Package",
    justinsurance: { kind: "yes", label: "Included in $199" },
    xcel: { kind: "limited", label: "Inclusion varies by package tier" },
    examfx: { kind: "limited", label: "Inclusion varies by package tier" },
  },
  {
    feature: "White-Glove Licensing Process Support",
    justinsurance: { kind: "yes", label: "NIPR + fingerprinting help" },
    xcel: { kind: "limited", label: "Not advertised in current packages — verify at xcelsolutions.com" },
    examfx: { kind: "limited", label: "Not advertised in current packages — verify at examfx.com" },
  },
  {
    feature: "Audio Vocabulary Lists",
    justinsurance: { kind: "yes" },
    xcel: { kind: "limited", label: "Not advertised in current packages — verify at xcelsolutions.com" },
    examfx: { kind: "limited", label: "Not advertised in current packages — verify at examfx.com" },
  },
  {
    feature: "Published Pass Rate with Methodology",
    justinsurance: { kind: "yes", label: "93%; inclusion requires 3× consecutive 80%+ practice exams" },
    xcel: { kind: "no", label: "Not published with methodology" },
    examfx: { kind: "yes", label: "94% L&H, 95% Life, 99% P&C; 2,826 self-reported respondents" },
  },
  {
    feature: "AI-Optimized Reading Level — 4th/5th Grade",
    justinsurance: { kind: "yes" },
    xcel: { kind: "limited", label: "No published reading-level standard — verify at xcelsolutions.com" },
    examfx: { kind: "limited", label: "No published reading-level standard — verify at examfx.com" },
  },
  {
    feature: "Free Report Card Review if Student Fails",
    justinsurance: { kind: "yes" },
    xcel: { kind: "limited", label: "Not advertised in current packages — verify at xcelsolutions.com" },
    examfx: { kind: "limited", label: "Not advertised in current packages — verify at examfx.com" },
  },
  {
    feature: "Developer API for Agency Onboarding Automation",
    justinsurance: { kind: "yes", label: "Documented API for integrations" },
    xcel: { kind: "limited", label: "Partner portal (no public API documentation)" },
    examfx: { kind: "limited", label: "Partner portal (no public API documentation)" },
  },
  {
    feature: "Real-Time Agency Dashboard for Candidate Tracking",
    justinsurance: { kind: "yes", label: "Real-time candidate progress" },
    xcel: { kind: "yes", label: "Partner reporting available" },
    examfx: { kind: "yes", label: "Manager tracking platform" },
  },
  {
    feature: "Custom Automation Packages for Recruiting Workflows",
    justinsurance: { kind: "yes", label: "Built per-agency" },
    xcel: { kind: "limited", label: "Partner-site tools + reporting; integration specifics vary" },
    examfx: { kind: "limited", label: "Pre-set partner portal configurations" },
  },
  {
    feature: "White-Label Sales Page for Partners",
    justinsurance: { kind: "yes", label: "Full white-label option" },
    xcel: { kind: "limited", label: "Dedicated partner-branded sites" },
    examfx: { kind: "limited", label: "Co-branded partner portals" },
  },
  {
    feature: "Adaptive Curriculum (Lessons Adjust to Weak Areas)",
    justinsurance: { kind: "yes", label: "Adapts throughout course" },
    xcel: { kind: "limited", label: "Primarily fixed curriculum" },
    examfx: { kind: "limited", label: "Readiness Exam flags weak areas; core curriculum fixed" },
  },
  {
    feature: "Support Hours",
    justinsurance: { kind: "yes", label: "7 days (M–F 7a–10p, Sat/Sun 8a–8p)" },
    xcel: { kind: "limited", label: "Standard business-hour support; verify at xcelsolutions.com" },
    examfx: { kind: "limited", label: "Standard business-hour support; verify at examfx.com" },
  },
  {
    feature: "Interactive Learning Portal",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "yes" },
  },
  {
    feature: "Readiness Exam with Weak-Point Analysis",
    justinsurance: { kind: "yes", label: "Detailed breakdown" },
    xcel: { kind: "no" },
    examfx: { kind: "yes" },
  },
];

export const PASS_RATE_FOOTNOTE =
  "93% pass rate measured among JustInsurance students nationwide who completed the full course and met the recommended study metrics — finishing the recommended hours and scoring 80% or higher on the practice exam three times in a row before sitting for the state exam. Individual results vary based on preparation, state, and line of authority. Full methodology at /pass-rates.";
