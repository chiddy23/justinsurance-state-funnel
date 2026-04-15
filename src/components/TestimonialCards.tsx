import React from "react";

const GENERIC_TESTIMONIALS = [
  {
    name: "Jennifer M.",
    role: "Licensed Agent",
    text: "JustInsurance's course content was thorough and well-organized. The practice exams were spot-on.",
    stars: 5,
    initials: "JM",
  },
  {
    name: "David R.",
    role: "Insurance Producer",
    text: "I passed on my first try thanks to JustInsurance. The self-paced format fit perfectly with my schedule.",
    stars: 5,
    initials: "DR",
  },
  {
    name: "Sarah K.",
    role: "Health Insurance Agent",
    text: "The video lessons broke down complicated regulations into plain language. I felt genuinely prepared walking into the exam room.",
    stars: 5,
    initials: "SK",
  },
  {
    name: "Marcus T.",
    role: "Life & Health Agent",
    text: "Flashcards and chapter quizzes made retention effortless. Finished my prelicensing in two weeks while working full time.",
    stars: 5,
    initials: "MT",
  },
  {
    name: "Rebecca L.",
    role: "Licensed Producer",
    text: "Pass guarantee gave me total peace of mind. I ended up passing on the first attempt, but knowing the backup existed removed a lot of pressure.",
    stars: 5,
    initials: "RL",
  },
  {
    name: "Thomas B.",
    role: "Insurance Professional",
    text: "Customer support answered my state-specific questions within hours. That level of responsiveness is rare in an online course platform.",
    stars: 5,
    initials: "TB",
  },
  {
    name: "Amanda W.",
    role: "Health Agent",
    text: "I tried two other courses before finding JustInsurance. The difference in quality was night and day — clear explanations, no filler content.",
    stars: 5,
    initials: "AW",
  },
  {
    name: "Christopher H.",
    role: "Insurance Agent",
    text: "The practice exams felt like the real thing. By test day I had taken so many mock exams that I was completely calm under pressure.",
    stars: 5,
    initials: "CH",
  },
  {
    name: "Nicole D.",
    role: "Licensed Professional",
    text: "Mobile-friendly format meant I could squeeze in study sessions during my lunch breaks. Got licensed in under a month without quitting my day job.",
    stars: 5,
    initials: "ND",
  },
  {
    name: "Michael P.",
    role: "Insurance Producer",
    text: "I appreciated that the course covered exactly what the state exam tests — nothing more, nothing less. No time wasted on irrelevant material.",
    stars: 5,
    initials: "MP",
  },
  {
    name: "Jessica R.",
    role: "Life Insurance Agent",
    text: "The self-paced structure let me rewatch any lesson as many times as I needed. Totally worth it for someone balancing family and studying.",
    stars: 5,
    initials: "JR",
  },
  {
    name: "Daniel F.",
    role: "Insurance Specialist",
    text: "Enrollment took five minutes, the content was immediately available, and I passed my exam three weeks later. Smooth from start to finish.",
    stars: 5,
    initials: "DF",
  },
  {
    name: "Lauren G.",
    role: "Property & Casualty Agent",
    text: "JustInsurance's practice tests nailed the question style and difficulty of my actual state exam. First attempt, passing score.",
    stars: 5,
    initials: "LG",
  },
  {
    name: "Kevin S.",
    role: "Licensed Insurance Agent",
    text: "The course organized every topic exactly the way the state exam breaks it down. Studying felt efficient rather than overwhelming.",
    stars: 5,
    initials: "KS",
  },
];

type Testimonial = (typeof GENERIC_TESTIMONIALS)[number];

function pickGenericPair(seed: string, pool: Testimonial[]): Testimonial[] {
  // Simple deterministic hash so same state always gets same pair
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  const idx1 = Math.abs(h) % pool.length;
  const idx2 = (Math.abs(h) + 7) % pool.length;
  // Ensure different items
  const second = idx2 === idx1 ? (idx2 + 1) % pool.length : idx2;
  return [pool[idx1], pool[second]];
}

const CE_TESTIMONIALS = [
  {
    name: "Patricia L.",
    role: "Licensed Agent, Renewal",
    text: "Completed all my CE hours in one weekend. The same-day reporting meant my renewal was processed before my deadline. Couldn't be easier.",
    stars: 5,
    initials: "PL",
  },
  {
    name: "Robert K.",
    role: "Insurance Producer",
    text: "I've renewed with JustInsurance three cycles in a row now. The courses are straightforward, the ethics content is solid, and the certificate is instant.",
    stars: 5,
    initials: "RK",
  },
];

export interface LeadTestimonial {
  quote: string;
  name: string;
  title: string;
  /** When present, renders a YouTube source link on the card */
  youtubeVideoId?: string;
}

interface TestimonialCardsProps {
  leadTestimonial?: LeadTestimonial;
  variant?: "prelicensing" | "ce";
  seed?: string;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  text,
  stars,
  initials,
  youtubeVideoId,
}: {
  name: string;
  role: string;
  text: string;
  stars: number;
  initials: string;
  youtubeVideoId?: string;
}) {
  const isYoutube = Boolean(youtubeVideoId);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col">
      <StarRating count={stars} />
      <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6 flex-grow">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isYoutube ? "bg-red-600" : "bg-navy"}`}>
          <span className="text-white font-bold text-xs">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-navy text-sm flex items-center gap-2 flex-wrap">
            {name}
            {isYoutube && (
              <a
                href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="See this comment on YouTube (opens in new tab)"
                className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded transition-colors"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                YouTube<span aria-hidden="true" className="text-[9px]">↗</span>
              </a>
            )}
          </p>
          <p className="text-gray-400 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TestimonialCards({ leadTestimonial, variant = "prelicensing", seed }: TestimonialCardsProps) {
  const isCE = variant === "ce";

  const heading = isCE ? "What Our Agents Say" : "What Our Students Say";
  const subheading = isCE
    ? "4.9 stars from 30,000+ agents who renewed with us"
    : "4.9 stars from 30,000+ students licensed nationwide";
  const genericTestimonials = isCE ? CE_TESTIMONIALS : GENERIC_TESTIMONIALS;

  const defaultLead = isCE ? (
    <TestimonialCard
      name="Angela S."
      role="Health Insurance Agent"
      text="Renewing my license used to be a hassle — finding approved courses, waiting for credits to post, worrying about deadlines. JustInsurance handles all of it. I finished my hours, got my certificate, and they reported to my state the same day."
      stars={5}
      initials="AS"
    />
  ) : (
    <TestimonialCard
      name="Marcus D."
      role="Life & Health Agent"
      text="I was nervous about the licensing exam, but JustInsurance's practice tests were spot-on. I passed on my first try and had my license in hand three weeks after I enrolled. The video lessons made even the complicated state regulations easy to understand."
      stars={5}
      initials="MD"
    />
  );

  return (
    <section className="bg-gray-bg py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
          {heading}
        </h2>
        <p className="text-gray-500 text-center mb-10">
          {subheading}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadTestimonial ? (
            <TestimonialCard
              name={leadTestimonial.name}
              role={leadTestimonial.title}
              text={leadTestimonial.quote}
              stars={5}
              initials={getInitials(leadTestimonial.name)}
              youtubeVideoId={leadTestimonial.youtubeVideoId}
            />
          ) : (
            defaultLead
          )}
          {(seed ? pickGenericPair(seed, genericTestimonials) : genericTestimonials.slice(0, 2)).map((t) => (
            <TestimonialCard
              key={t.name}
              name={t.name}
              role={t.role}
              text={t.text}
              stars={t.stars}
              initials={t.initials}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
