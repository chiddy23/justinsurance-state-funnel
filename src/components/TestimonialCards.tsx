import React from "react";

const TESTIMONIALS = [
  {
    name: "Marcus D.",
    role: "Life & Health Agent, Florida",
    text: "I was nervous about the licensing exam, but JustInsurance's practice tests were spot-on. I passed on my first try and had my license in hand three weeks after I enrolled. The video lessons made even the complicated state regulations easy to understand.",
    stars: 5,
    initials: "MD",
  },
  {
    name: "Sarah K.",
    role: "Independent Agent, Texas",
    text: "The self-paced format was a game changer for me. I studied around my day job — a little each evening — and finished the course in two weeks. The flashcards were especially helpful for memorizing policy types. Highly recommend to anyone getting into insurance.",
    stars: 5,
    initials: "SK",
  },
  {
    name: "James T.",
    role: "Insurance Broker, California",
    text: "I needed to renew my CE credits before my deadline and JustInsurance made it painless. Finished the entire course on a Saturday morning, and my completion was reported to the state by the next business day. Zero stress. Will use again for my next renewal.",
    stars: 5,
    initials: "JT",
  },
];

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

export default function TestimonialCards() {
  return (
    <section className="bg-gray-bg py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
          What Our Students Say
        </h2>
        <p className="text-gray-500 text-center mb-10">
          4.9 stars from 15,000+ students licensed nationwide
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col">
              <StarRating count={t.stars} />
              <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6 flex-grow">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">{t.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
