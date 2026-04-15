// Comparison data for /compare hub + /compare/[competitor] pages.
// Reconciled to site standard: 93% pass rate, 80%+ on practice exam three times in a row methodology.

export type ComparisonValue =
  | { kind: "yes"; label?: string }
  | { kind: "no"; label?: string }
  | { kind: "partial"; label: string };

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
      "30-day access window creates pressure to test before you're ready",
      "Live sessions not actually live — pre-recorded 'virtual classroom' videos",
      "Flashcards, simulations, and extensions are all paid upcharges",
      "Fixed curriculum — can't adapt to your weak areas",
      "No weekend support, no text/chat support",
      "Pass rate not disclosed publicly",
    ],
    youShouldKnow:
      "XCEL positions itself as a budget-friendly option but layers the essentials you actually need — flashcards, realistic exam simulations, extra access time — behind upcharges. Reviewers consistently flag the 30-day clock as rushed. If you're new to insurance and unsure how long you'll need, the flat extended-access model at JustInsurance removes that anxiety.",
  },
  examfx: {
    slug: "examfx",
    name: "ExamFX",
    fullName: "ExamFX",
    domain: "examfx.com",
    weaknesses: [
      "Guarantee requires testing within 3 days of hitting 80% — unrealistic for working adults",
      "Live sessions only 1× per week, and they're a paid upcharge",
      "Flashcards charged separately",
      "Fixed curriculum — no adaptation to your weak areas",
      "Pass rate not disclosed publicly",
      "5.5-day support window (no Sundays, limited Saturdays)",
    ],
    youShouldKnow:
      "ExamFX's published guarantee requires you to sit for the state exam within 3 days of hitting 80% on their practice test. That's a common complaint — most adults with jobs can't schedule a Pearson VUE or PSI appointment with 3 days of notice. JustInsurance's guarantee window is 30 days from enrollment, not 3 days from a score, which matches how real people schedule exams.",
  },
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "100+ Video Lessons Covering Every Exam Topic",
    justinsurance: { kind: "yes", label: "100+ videos" },
    xcel: { kind: "partial", label: "Limited videos" },
    examfx: { kind: "partial", label: "Limited videos" },
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
    xcel: { kind: "partial", label: "2–3 static exams" },
    examfx: { kind: "partial", label: "2–3 static exams" },
  },
  {
    feature: "Live Instructor Sessions",
    justinsurance: { kind: "yes", label: "5× weekly, included" },
    xcel: { kind: "partial", label: "Upcharge, pre-recorded" },
    examfx: { kind: "partial", label: "Upcharge, 1× weekly" },
  },
  {
    feature: "AI-Powered Realistic Exam Simulations",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "no" },
  },
  {
    feature: "Flashcards Included",
    justinsurance: { kind: "yes", label: "Included" },
    xcel: { kind: "partial", label: "Upcharge" },
    examfx: { kind: "partial", label: "Upcharge" },
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
    feature: "Published First-Attempt Pass Rate",
    justinsurance: { kind: "yes", label: "93% (methodology disclosed)" },
    xcel: { kind: "no", label: "Not disclosed" },
    examfx: { kind: "no", label: "Not disclosed" },
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
    feature: "API Integration for Agencies & Developers",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "no" },
  },
  {
    feature: "White-Label Sales Page for Partners",
    justinsurance: { kind: "yes" },
    xcel: { kind: "no" },
    examfx: { kind: "no" },
  },
  {
    feature: "Course Customization & Adaptation",
    justinsurance: { kind: "yes", label: "Adapts to weak areas" },
    xcel: { kind: "partial", label: "Fixed curriculum" },
    examfx: { kind: "partial", label: "Fixed curriculum" },
  },
  {
    feature: "Support Hours",
    justinsurance: { kind: "yes", label: "7 days, 12–15 hrs (M–F 7a–10p, Sat/Sun 8a–8p)" },
    xcel: { kind: "partial", label: "6 days (M–F 8:30a–7p, no weekend text support)" },
    examfx: { kind: "partial", label: "5.5 days (M–F 7a–6p, Sat 10a–2p)" },
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
