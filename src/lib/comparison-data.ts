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
      "Course access is split: 30 days prelicensing + 30 days prep review (60 days total across two phases, not continuous)",
      "Livestream classes are a paid upgrade, not included in the base package",
      "Flashcards, exam simulations, and extended access are all paid add-ons",
      "Fixed curriculum — doesn't adapt to your weak areas",
      "No universally-advertised refund-style pass guarantee (policy is 'keep studying for free if you fail')",
      "No weekend or text support in standard plans",
    ],
    youShouldKnow:
      "XCEL positions itself as a budget-friendly option but layers the essentials you actually need — flashcards, realistic exam simulations, livestream instructor access, extended study time — behind paid upgrades. The base package gives you 30 days of prelicensing access plus 30 days of prep review, but that's two separate clocks, not one continuous window. If you're new to insurance and want everything bundled without surprises, the all-inclusive model at JustInsurance is more predictable.",
  },
  examfx: {
    slug: "examfx",
    name: "ExamFX",
    fullName: "ExamFX",
    domain: "examfx.com",
    weaknesses: [
      "Pass guarantee requires testing within 3 calendar days of passing their Readiness Exam at 80%+ — unrealistic for most working adults",
      "Pass guarantee only covers the first state exam attempt; second-attempt failures don't qualify",
      "Refunds exclude company-paid packages and shipping costs",
      "Livestream classes and flashcards are paid upgrades",
      "Fixed curriculum — doesn't adapt to your weak areas",
      "Publishes pass rate figures (93%/94%/95%/99%) but discloses no methodology or sample size",
    ],
    youShouldKnow:
      "ExamFX's pass guarantee has a specific trigger: pass their Readiness Exam at 80%+, then sit for the state licensing exam within 3 calendar days. That's the friction point — most adults can't schedule a Pearson VUE or PSI appointment with 3 days of notice. ExamFX does publish pass rates on their site (93% aggregate, 94% Life & Health), but they don't disclose how those figures were calculated. JustInsurance's guarantee allows 30 days from first enrollment to sit for the exam, and our 93% pass rate is published with full methodology at /pass-rates.",
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
    xcel: { kind: "limited", label: "2–3 static exams" },
    examfx: { kind: "limited", label: "2–3 static exams" },
  },
  {
    feature: "Live Instructor Sessions",
    justinsurance: { kind: "yes", label: "5× weekly, included" },
    xcel: { kind: "upcharge", label: "Livestream classes, paid upgrade" },
    examfx: { kind: "upcharge", label: "Paid upgrade, limited frequency" },
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
    xcel: { kind: "upcharge", label: "Paid add-on" },
    examfx: { kind: "upcharge", label: "Paid add-on" },
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
    xcel: { kind: "limited", label: "Fixed curriculum" },
    examfx: { kind: "limited", label: "Fixed curriculum" },
  },
  {
    feature: "Support Hours",
    justinsurance: { kind: "yes", label: "7 days, 12–15 hrs (M–F 7a–10p, Sat/Sun 8a–8p)" },
    xcel: { kind: "limited", label: "6 days (M–F 8:30a–7p, no weekend text support)" },
    examfx: { kind: "limited", label: "5.5 days (M–F 7a–6p, Sat 10a–2p)" },
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
