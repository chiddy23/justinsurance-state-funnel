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
  slug: "xcel" | "examfx";
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
      "Pass guarantee requires taking the state licensing exam within 3 calendar days of scoring 80%+ on their Readiness Exam",
      "Standard refund policy requires refund request within 48 hours of purchase; course extensions and in-course purchases are non-refundable",
      "Pass-rate methodology counts self-reported survey respondents broadly; JustInsurance's published methodology applies a stricter inclusion bar (3× consecutive 80%+ practice-exam scores)",
    ],
    youShouldKnow:
      "ExamFX's pass guarantee requires candidates to take the Readiness Exam no more than three calendar days prior to their state licensing exam, scoring 80% or higher. Because Pearson VUE and PSI testing-center availability varies by market, candidates should plan the sequence carefully. JustInsurance's guarantee allows 30 days from first enrollment to sit for the exam, giving more scheduling flexibility. ExamFX publishes line-of-authority pass rates (95% Life, 94% Life & Health, 99% P&C) with disclosed methodology — 2,826 self-reported survey respondents collected Feb 1 – Oct 17, 2025. JustInsurance publishes a 93% pass rate at /pass-rates using a stricter inclusion bar: students who completed the full course, finished recommended hours, and scored 80%+ on the practice exam three times in a row before testing. Both are disclosed; the qualifying criteria differ.",
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
    feature: "AI-Generated Coverage of State Exam Outline (JustInsurance feature)",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "no" },
  },
  {
    feature: "Course Extension Options",
    justinsurance: { kind: "yes", label: "Multiple extensions included" },
    xcel: { kind: "limited", label: "Paid extension available" },
    examfx: { kind: "limited", label: "30/60-day paid extensions per their FAQ" },
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
    feature: "AI-Powered Adaptive Exam Simulations (JustInsurance feature)",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "no" },
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
    xcel: { kind: "no" },
    examfx: { kind: "no" },
  },
  {
    feature: "Audio Vocabulary Lists",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "no" },
  },
  {
    feature: "Published Pass Rate with Methodology",
    justinsurance: { kind: "yes", label: "93%; inclusion requires 3× consecutive 80%+ practice exams" },
    xcel: { kind: "no", label: "Not published with methodology" },
    examfx: { kind: "yes", label: "94% L&H, 95% Life, 99% P&C; 2,826 self-reported respondents" },
  },
  {
    feature: "AI-Optimized Reading Level — 4th/5th Grade (JustInsurance feature)",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "no" },
  },
  {
    feature: "Free Report Card Review if Student Fails",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "no" },
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
    xcel: { kind: "limited", label: "Integrations via 3rd-party tools (e.g., IdealTraits)" },
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
    examfx: { kind: "limited", label: "Standard business-hour support; verify at examfx.com/help-center" },
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
