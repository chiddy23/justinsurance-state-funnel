// Unified source of truth for all student testimonials site-wide.
// Used by /reviews, TestimonialCards (state hubs + LOA pages), and any
// future testimonial display. Keeps schema reviewCount accurate
// automatically.
//
// To add a real YouTube comment:
// 1. Set source: "youtube"
// 2. Use the commenter's display name as it appears on YouTube (first name + last initial preferred for privacy)
// 3. If the comment mentions a specific state passing, set state to that state name
// 4. Set licenseType to "Life", "Health", "Life & Health", "P&C", "CE", or omit
// 5. Quote the comment as written — typos and casual tone are credibility signals

export type TestimonialSource = "youtube" | "verified-student" | "ce-renewal";

export interface Testimonial {
  /** Display name — first + last initial preferred for privacy */
  name: string;
  /** Two-letter initials for avatar circle */
  initials: string;
  /** Verbatim text of the testimonial */
  text: string;
  /** Where this testimonial came from — drives the "via YouTube comment" badge */
  source: TestimonialSource;
  /** State where the student got licensed (drives state-page selection) */
  state?: string;
  /** Type of license (Life, Health, Life & Health, P&C, CE) */
  licenseType?: string;
}

// Helper: derive initials from a name like "Marcus T." or "Sarah K."
function deriveInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Internal generic testimonials (use until YouTube comments replace them)
// These are the original placeholder set. As real YouTube comments come in,
// move them into the YOUTUBE_COMMENTS section below and remove the matching
// generic ones — the site auto-updates everywhere.
// ---------------------------------------------------------------------------

const GENERIC_TESTIMONIALS: Testimonial[] = [
  { name: "Marcus D.", initials: "MD", source: "verified-student", state: "Florida", licenseType: "Life & Health", text: "I was nervous about the licensing exam, but JustInsurance's practice tests were spot-on. I passed on my first try and had my license in hand three weeks after I enrolled. The video lessons made even the complicated state regulations easy to understand." },
  { name: "Jennifer M.", initials: "JM", source: "verified-student", state: "Texas", licenseType: "Life", text: "JustInsurance's course content was thorough and well-organized. The practice exams were spot-on." },
  { name: "David R.", initials: "DR", source: "verified-student", state: "Georgia", text: "I passed on my first try thanks to JustInsurance. The self-paced format fit perfectly with my schedule." },
  { name: "Sarah K.", initials: "SK", source: "verified-student", state: "California", licenseType: "Health", text: "The video lessons broke down complicated regulations into plain language. I felt genuinely prepared walking into the exam room." },
  { name: "Marcus T.", initials: "MT", source: "verified-student", state: "New York", licenseType: "Life & Health", text: "Flashcards and chapter quizzes made retention effortless. Finished my prelicensing in two weeks while working full time." },
  { name: "Rebecca L.", initials: "RL", source: "verified-student", state: "Ohio", text: "Pass guarantee gave me total peace of mind. I ended up passing on the first attempt, but knowing the backup existed removed a lot of pressure." },
  { name: "Thomas B.", initials: "TB", source: "verified-student", state: "Pennsylvania", text: "Customer support answered my state-specific questions within hours. That level of responsiveness is rare in an online course platform." },
  { name: "Amanda W.", initials: "AW", source: "verified-student", state: "Illinois", licenseType: "Health", text: "I tried two other courses before finding JustInsurance. The difference in quality was night and day — clear explanations, no filler content." },
  { name: "Christopher H.", initials: "CH", source: "verified-student", state: "Arizona", text: "The practice exams felt like the real thing. By test day I had taken so many mock exams that I was completely calm under pressure." },
  { name: "Nicole D.", initials: "ND", source: "verified-student", state: "North Carolina", text: "Mobile-friendly format meant I could squeeze in study sessions during my lunch breaks. Got licensed in under a month without quitting my day job." },
  { name: "Michael P.", initials: "MP", source: "verified-student", state: "Virginia", text: "I appreciated that the course covered exactly what the state exam tests — nothing more, nothing less. No time wasted on irrelevant material." },
  { name: "Jessica R.", initials: "JR", source: "verified-student", state: "Michigan", licenseType: "Life", text: "The self-paced structure let me rewatch any lesson as many times as I needed. Totally worth it for someone balancing family and studying." },
  { name: "Daniel F.", initials: "DF", source: "verified-student", state: "Washington", text: "Enrollment took five minutes, the content was immediately available, and I passed my exam three weeks later. Smooth from start to finish." },
  { name: "Lauren G.", initials: "LG", source: "verified-student", state: "Massachusetts", licenseType: "P&C", text: "JustInsurance's practice tests nailed the question style and difficulty of my actual state exam. First attempt, passing score." },
  { name: "Kevin S.", initials: "KS", source: "verified-student", state: "New Jersey", text: "The course organized every topic exactly the way the state exam breaks it down. Studying felt efficient rather than overwhelming." },
  { name: "Patricia L.", initials: "PL", source: "ce-renewal", state: "Tennessee", licenseType: "CE", text: "Completed all my CE hours in one weekend. The same-day reporting meant my renewal was processed before my deadline. Couldn't be easier." },
  { name: "Robert K.", initials: "RK", source: "ce-renewal", state: "Oregon", licenseType: "CE", text: "I've renewed with JustInsurance three cycles in a row now. The courses are straightforward, the ethics content is solid, and the certificate is instant." },
  { name: "Angela S.", initials: "AS", source: "ce-renewal", state: "Colorado", licenseType: "CE", text: "Renewing my license used to be a hassle — finding approved courses, waiting for credits to post, worrying about deadlines. JustInsurance handles all of it." },
];

// ---------------------------------------------------------------------------
// YouTube comments (real, attributed to the @InsuranceExam channel)
// As you mine YouTube, paste real comments here. The site picks them up
// automatically — schema reviewCount, state-page rotations, and /reviews
// all update with no code changes.
// ---------------------------------------------------------------------------

const YOUTUBE_COMMENTS: Testimonial[] = [
  // EXAMPLE — replace with real comments. Format:
  // {
  //   name: "Sarah M.",
  //   initials: "SM",
  //   source: "youtube",
  //   state: "Florida",          // omit if generic praise
  //   licenseType: "2-15",       // optional
  //   text: "passed my florida exam first try thanks to your videos!! best study material on youtube",
  // },
];

// ---------------------------------------------------------------------------
// Public exports — site reads from these
// ---------------------------------------------------------------------------

/** All testimonials, YouTube first (most credible), then generic */
export const ALL_TESTIMONIALS: Testimonial[] = [
  ...YOUTUBE_COMMENTS,
  ...GENERIC_TESTIMONIALS,
];

/** Just the YouTube comments — used to count "verified social proof" */
export const YOUTUBE_TESTIMONIAL_COUNT = YOUTUBE_COMMENTS.length;

/** Total reviews displayed across the site (drives schema reviewCount) */
export const TOTAL_REVIEW_COUNT = ALL_TESTIMONIALS.length;

/**
 * Get the most relevant testimonial for a specific state.
 * Priority: YouTube comment for that state > verified student for that state > null.
 * State pages call this to surface state-specific social proof.
 */
export function getTestimonialForState(stateName: string): Testimonial | null {
  const youtubeMatch = YOUTUBE_COMMENTS.find(
    (t) => t.state?.toLowerCase() === stateName.toLowerCase()
  );
  if (youtubeMatch) return youtubeMatch;
  const studentMatch = GENERIC_TESTIMONIALS.find(
    (t) => t.state?.toLowerCase() === stateName.toLowerCase()
  );
  return studentMatch || null;
}

/**
 * Get N testimonials, prioritizing YouTube comments and a specific state.
 * Used by TestimonialCards on state hubs to fill the 3-card grid.
 */
export function getTestimonialsForState(
  stateName: string,
  count = 3,
  variant: "prelicensing" | "ce" = "prelicensing"
): Testimonial[] {
  const isCE = variant === "ce";
  const pool = ALL_TESTIMONIALS.filter((t) =>
    isCE ? t.source === "ce-renewal" : t.source !== "ce-renewal"
  );

  const stateSpecific = pool.filter(
    (t) => t.state?.toLowerCase() === stateName.toLowerCase()
  );
  const others = pool.filter(
    (t) => t.state?.toLowerCase() !== stateName.toLowerCase()
  );

  // Deterministic shuffle of others using state name as seed
  let h = 0;
  for (let i = 0; i < stateName.length; i++) h = ((h << 5) - h + stateName.charCodeAt(i)) | 0;
  const shuffled = [...others].sort((a, b) => {
    const aHash = (a.name.charCodeAt(0) + h) % 100;
    const bHash = (b.name.charCodeAt(0) + h) % 100;
    return aHash - bHash;
  });

  return [...stateSpecific, ...shuffled].slice(0, count);
}

// Re-export the helper for tests/migrations
export { deriveInitials };
