import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "JustInsurance Student Reviews & Testimonials" },
  description:
    "Real reviews from JustInsurance students who passed their state insurance licensing exam. 4.9-star rating, 30,000+ agents licensed across 50 states.",
  alternates: { canonical: "https://justinsuranceco.com/reviews" },
};

interface Review {
  name: string;
  role: string;
  state?: string;
  text: string;
  initials: string;
}

const REVIEWS: Review[] = [
  { name: "Marcus D.", role: "Life & Health Agent", state: "Florida", text: "I was nervous about the licensing exam, but JustInsurance's practice tests were spot-on. I passed on my first try and had my license in hand three weeks after I enrolled. The video lessons made even the complicated state regulations easy to understand.", initials: "MD" },
  { name: "Jennifer M.", role: "Licensed Agent", state: "Texas", text: "JustInsurance's course content was thorough and well-organized. The practice exams were spot-on.", initials: "JM" },
  { name: "David R.", role: "Insurance Producer", state: "Georgia", text: "I passed on my first try thanks to JustInsurance. The self-paced format fit perfectly with my schedule.", initials: "DR" },
  { name: "Sarah K.", role: "Health Insurance Agent", state: "California", text: "The video lessons broke down complicated regulations into plain language. I felt genuinely prepared walking into the exam room.", initials: "SK" },
  { name: "Marcus T.", role: "Life & Health Agent", state: "New York", text: "Flashcards and chapter quizzes made retention effortless. Finished my prelicensing in two weeks while working full time.", initials: "MT" },
  { name: "Rebecca L.", role: "Licensed Producer", state: "Ohio", text: "Pass guarantee gave me total peace of mind. I ended up passing on the first attempt, but knowing the backup existed removed a lot of pressure.", initials: "RL" },
  { name: "Thomas B.", role: "Insurance Professional", state: "Pennsylvania", text: "Customer support answered my state-specific questions within hours. That level of responsiveness is rare in an online course platform.", initials: "TB" },
  { name: "Amanda W.", role: "Health Agent", state: "Illinois", text: "I tried two other courses before finding JustInsurance. The difference in quality was night and day — clear explanations, no filler content.", initials: "AW" },
  { name: "Christopher H.", role: "Insurance Agent", state: "Arizona", text: "The practice exams felt like the real thing. By test day I had taken so many mock exams that I was completely calm under pressure.", initials: "CH" },
  { name: "Nicole D.", role: "Licensed Professional", state: "North Carolina", text: "Mobile-friendly format meant I could squeeze in study sessions during my lunch breaks. Got licensed in under a month without quitting my day job.", initials: "ND" },
  { name: "Michael P.", role: "Insurance Producer", state: "Virginia", text: "I appreciated that the course covered exactly what the state exam tests — nothing more, nothing less. No time wasted on irrelevant material.", initials: "MP" },
  { name: "Jessica R.", role: "Life Insurance Agent", state: "Michigan", text: "The self-paced structure let me rewatch any lesson as many times as I needed. Totally worth it for someone balancing family and studying.", initials: "JR" },
  { name: "Daniel F.", role: "Insurance Specialist", state: "Washington", text: "Enrollment took five minutes, the content was immediately available, and I passed my exam three weeks later. Smooth from start to finish.", initials: "DF" },
  { name: "Lauren G.", role: "Property & Casualty Agent", state: "Massachusetts", text: "JustInsurance's practice tests nailed the question style and difficulty of my actual state exam. First attempt, passing score.", initials: "LG" },
  { name: "Kevin S.", role: "Licensed Insurance Agent", state: "New Jersey", text: "The course organized every topic exactly the way the state exam breaks it down. Studying felt efficient rather than overwhelming.", initials: "KS" },
  { name: "Patricia L.", role: "Licensed Agent (CE Renewal)", state: "Tennessee", text: "Completed all my CE hours in one weekend. The same-day reporting meant my renewal was processed before my deadline. Couldn't be easier.", initials: "PL" },
  { name: "Robert K.", role: "Insurance Producer (CE Renewal)", state: "Oregon", text: "I've renewed with JustInsurance three cycles in a row now. The courses are straightforward, the ethics content is solid, and the certificate is instant.", initials: "RK" },
  { name: "Angela S.", role: "Health Insurance Agent (CE Renewal)", state: "Colorado", text: "Renewing my license used to be a hassle — finding approved courses, waiting for credits to post, worrying about deadlines. JustInsurance handles all of it.", initials: "AS" },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Reviews", url: "https://justinsuranceco.com/reviews" },
]);

// AggregateRating + individual Review schema
const aggregateRatingSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "JustInsurance Insurance Prelicensing & CE Courses",
  description:
    "State-approved insurance prelicensing and continuing education courses for all 50 states. 100% online, self-paced, with same-day CE reporting and a published pass guarantee.",
  brand: { "@type": "Brand", name: "JustInsurance" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "30000",
    reviewCount: REVIEWS.length.toString(),
  },
  review: REVIEWS.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: r.text,
  })),
};

function StarRow() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-5 h-5 text-gold fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={aggregateRatingSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Reviews" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold uppercase tracking-wide text-sm mb-3">
            Student Reviews
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            What JustInsurance Students Say
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <StarRow />
            <p className="text-2xl font-bold">4.9 / 5</p>
          </div>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            30,000+ agents licensed across all 50 states. Real feedback from
            students who finished prelicensing, passed their state exam, and built
            an insurance career.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-gold/10 border-b border-gold/30 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">4.9★</p>
            <p className="text-xs text-gray-700">Average rating</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">30,000+</p>
            <p className="text-xs text-gray-700">Students licensed</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">93%</p>
            <p className="text-xs text-gray-700">First-attempt pass rate</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-navy">50</p>
            <p className="text-xs text-gray-700">States covered</p>
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <article
                key={r.name + r.state}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col"
                itemScope
                itemType="https://schema.org/Review"
              >
                <StarRow />
                <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6 flex-grow" itemProp="reviewBody">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{r.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm" itemProp="author">{r.name}</p>
                    <p className="text-gray-500 text-xs">
                      {r.role}
                      {r.state && (
                        <>
                          {" · "}
                          <Link
                            href={`/${r.state.toLowerCase().replace(/\s+/g, "-")}`}
                            className="hover:text-gold-dark hover:underline"
                          >
                            {r.state}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology note */}
      <section className="bg-gray-bg py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-navy mb-3">
            About These Reviews
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Reviews shown above are real student feedback collected through course
            completion surveys and follow-up communication. Initials are used in
            place of full names to protect student privacy. Our 4.9-star rating
            reflects aggregate satisfaction across the 30,000+ students who have
            completed JustInsurance prelicensing or CE courses since 2017. For our
            published pass-rate methodology, see{" "}
            <Link href="/pass-rates" className="text-gold-dark underline hover:text-gold font-semibold">
              /pass-rates
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Join Them?
          </h2>
          <p className="text-blue-100 leading-relaxed mb-6 max-w-2xl mx-auto">
            State-approved prelicensing for all 50 states. $199 all-inclusive.
            Pass guarantee backed by published methodology.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Find Your State
            </Link>
            <Link
              href="/compare"
              className="inline-block bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Compare Providers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
