import React from "react";

const PRELICENSING_FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.862v6.276a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Video Lessons",
    description: "Engaging, expert-led video lessons that break down complex insurance concepts into easy-to-understand segments. Study on any device.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Practice Exams",
    description: "Full-length practice exams for additional preparation, with detailed feedback to help you identify the topics that need more review before test day.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Interactive E-Book",
    description: "A comprehensive digital textbook with highlighting, notes, and instant search. Reference any topic as you study or prepare for your exam.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Flashcards",
    description: "Digital flashcard sets for every key term, definition, and concept. Perfect for on-the-go review between study sessions.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Progress Tracking",
    description: "See exactly how far you've come and what's left to complete. Pick up right where you left off on any device at any time.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Expert Support",
    description: "Have a question about the material or the licensing process? Our team of licensed insurance educators is here to help you succeed.",
  },
];

const CE_FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "State-Approved Content",
    description: "Course content meets your state's CE requirements, including ethics hours.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Self-Paced Online",
    description: "Complete your CE hours on any device, at your own pace. No classroom required.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Same-Day Reporting",
    description: "We typically report your completion to your state insurance regulator the same day.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Instant Certificate",
    description: "Download your certificate of completion immediately after finishing your course.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Renewal Support",
    description: "Questions about your renewal deadline or requirements? Our support team is here to help.",
  },
];

interface CourseFeaturesProps {
  variant?: "prelicensing" | "ce";
  /**
   * Exam-only states such as Alabama do not require or approve prelicensing.
   * Keep the shared feature cards, but frame them as optional preparation
   * instead of a course that is required to qualify for the state exam.
   */
  examPrepOnly?: boolean;
  /**
   * Illinois only: 3 of the 24 CE hours must be classroom/webinar ethics
   * (215 ILCS 5/500-35(b)), so the generic "No classroom required" claim on
   * the Self-Paced card is false for IL. When true, that card's copy is
   * swapped. Every other state renders byte-identically (defaults false).
   */
  ceEthicsWebinar?: boolean;
  /**
   * Non-Illinois states whose CE rules mandate a minimum number of classroom,
   * live-instructor, or classroom-equivalent hours that a purely self-paced
   * package cannot satisfy on its own (currently New Mexico — at least 3 of 24
   * via formal classroom / live instructor, 13.4.7.10(D)(2) NMAC — and Utah —
   * at least 12 of 24 classroom/webinar/classroom-equivalent with no more than
   * 12 self-study, Utah Admin. Code R590-142). The generic "Self-Paced Online"
   * card claims "No classroom required," which is FALSE for these states, so
   * its title and body are swapped for the accurate per-state copy the CE page
   * builds from states.ts data. Mutually exclusive with ceEthicsWebinar
   * (Illinois's own approved carve-out). Undefined for every other state, whose
   * card renders byte-identically.
   */
  liveCeCard?: { title: string; description: string };
  /**
   * Pending-approval states (providerApprovalNumber === "PENDING", currently NY
   * and WA): the CE course is not yet state-approved and completions cannot be
   * reported to the DOI, so the "State-Approved Content" and "Same-Day
   * Reporting" cards and the "get reported to the state" subheading are swapped
   * for accurate copy. Every approved state renders byte-identical (default true).
   */
  providerApproved?: boolean;
}

export default function CourseFeatures({
  variant = "prelicensing",
  examPrepOnly = false,
  ceEthicsWebinar = false,
  liveCeCard,
  providerApproved = true,
}: CourseFeaturesProps) {
  const isCE = variant === "ce";
  let features = isCE ? CE_FEATURES : PRELICENSING_FEATURES;
  if (isCE && ceEthicsWebinar) {
    features = features.map((f) =>
      f.title === "Self-Paced Online"
        ? {
            ...f,
            title: "Self-Paced + Ethics Webinar",
            description:
              "Most CE hours are self-paced on any device. Per Illinois requirements (215 ILCS 5/500-35(b)), the 3 mandatory ethics hours are delivered in live classroom or webinar format with verified attendance.",
          }
        : f
    );
  } else if (isCE && liveCeCard) {
    // New Mexico / Utah (and any future state the CE page detects): the state
    // mandates classroom/live-instructor/classroom-equivalent CE hours, so the
    // "No classroom required" line on the Self-Paced card is false. Swap it for
    // the per-state disclosure the CE page built from states.ts data. `card` is
    // captured as a const so its non-undefined type survives into the closure.
    const card = liveCeCard;
    features = features.map((f) =>
      f.title === "Self-Paced Online"
        ? { ...f, title: card.title, description: card.description }
        : f
    );
  }
  if (isCE && !providerApproved) {
    features = features.map((f) => {
      if (f.title === "State-Approved Content")
        return {
          ...f,
          title: "State-Aligned Content",
          description: "Course content is built to your state's CE topic requirements, including ethics hours.",
        };
      if (f.title === "Same-Day Reporting")
        return {
          ...f,
          title: "Study on Any Device",
          description: "Complete your CE hours from any device, on your own schedule — laptop, tablet, or phone.",
        };
      return f;
    });
  }
  const heading = isCE
    ? "Everything You Need to Renew"
    : examPrepOnly
    ? "Everything You Need to Prepare"
    : "Everything You Need to Pass";
  const subheading = isCE
    ? providerApproved
      ? "Your CE course includes everything you need to complete your hours, get reported to the state, and keep your license active."
      : "Your CE course includes everything you need to complete your hours and keep your license active."
    : examPrepOnly
    ? "Optional study tools and instructor support help you review key exam topics and identify areas that need more practice."
    : "Your course includes all the tools designed to help students pass their state exam on the first try.";

  return (
    <section className="bg-gray-bg py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
          {heading}
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          {subheading}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-navy mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-navy mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
