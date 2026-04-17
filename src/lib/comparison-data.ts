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
      "Pass guarantee only applies to the candidate's first state exam attempt; subsequent attempts do not qualify per their published terms",
      "Refunds exclude company-paid packages, renewals, and shipping costs per their published pass guarantee policy",
      "Standard refund policy requires refund request within 48 hours of purchase; course extensions and in-course purchases are non-refundable",
      "Publishes a 93% overall pass rate without disclosing methodology, sample size, or time period",
    ],
    youShouldKnow:
      "ExamFX's published pass guarantee has a specific timing requirement: score 80% or higher on their Readiness Exam, then sit for the state licensing exam within 3 calendar days. Because Pearson VUE and PSI testing centers often book 1 to 2 weeks in advance in many markets, scheduling a state exam within that 3-day window can be impractical. ExamFX does publish a 93% overall pass rate, but does not disclose the underlying methodology, sample size, or time period. JustInsurance's guarantee allows 30 days from first enrollment to sit for the exam, and our 93% pass rate is published with full methodology at /pass-rates.",
  },
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "100+ Video Lessons Covering Every Exam Topic",
    justinsurance: { kind: "yes", label: "100+ videos" },
    xcel: { kind: "limited", label: "Limited videos" },
    examfx: { kind: "limited", label: "Limited videos" },
  },
  {
    feature: "State Exam Outline Covered by AI",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "no" },
  },
  {
    feature: "Multiple Extension Options",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "no" },
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
    feature: "AI-Powered Realistic Exam Simulations",
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
    justinsurance: { kind: "yes", label: "93%, methodology disclosed" },
    xcel: { kind: "no", label: "Not published" },
    examfx: { kind: "limited", label: "Rate shown, no methodology" },
  },
  {
    feature: "AI-Optimized Text — 4th/5th Grade Reading Level",
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
    xcel: { kind: "limited", label: "Weekday support; weekend availability limited" },
    examfx: { kind: "limited", label: "Weekday support; weekend availability limited" },
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
