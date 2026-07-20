import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  SchemaMarkup,
} from "@/lib/schema";

const TITLE = "Live Insurance Exam Prep Classes 5x Weekly | JustInsurance";
const DESCRIPTION =
  "Join live insurance license exam prep classes 5 times a week with JustInsurance instructors. Included free with every prelicensing course. No extra fee.";
const CANONICAL = "https://justinsuranceco.com/webinars";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const faqs = [
  {
    question: "Do I have to pay extra for the live sessions?",
    answer:
      "No. Live instructor sessions are included free with every JustInsurance prelicensing course — the base $199 course gives you access to all five sessions per week at no upcharge, with no add-on tiers or package upgrades to shop through.",
  },
  {
    question: "What platform do the live sessions run on?",
    answer:
      "Live sessions run through our standard learning management system. Once you're enrolled, the join link, session schedule, and any required software details are posted directly in your course dashboard. If you can connect to a browser-based video call, you can attend — no special downloads or hardware required for most setups.",
  },
  {
    question: "Are sessions recorded if I can't attend live?",
    answer:
      "Yes. Every live session is recorded and posted to the course dashboard so enrolled students can catch up on their own schedule. That means if you work nights, travel, or just missed a session, you can watch the replay, pause to take notes, and rewatch the tricky sections as many times as you need.",
  },
  {
    question: "Who teaches the live sessions?",
    answer:
      "JustInsurance live sessions are led by licensed insurance educators — professionals who've carried real insurance licenses and have taught thousands of students through their state exams. You're not watching a pre-recorded actor. You're learning from instructors who know the test content and the regulatory environment you're about to walk into.",
  },
  {
    question: "How do I join a live session?",
    answer:
      "Enroll in any JustInsurance prelicensing course for your state at $199. Once enrolled, you'll see the upcoming live session schedule and join link inside your course dashboard. There's no separate webinar purchase, no registration form, and no additional fee — enrollment is the entire access path.",
  },
  {
    question: "Can I ask questions live during the sessions?",
    answer:
      "Yes. Each session ends with a dedicated live Q&A where you can ask your instructor about anything from specific exam topics to state regulatory rules to test-taking strategy. If your question doesn't get answered during the session, our support team is reachable directly from the course dashboard and will follow up.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Live Classes", url: CANONICAL },
]);

const faqSchema = generateFAQSchema(faqs);

const crumbs = [
  { name: "Home", href: "/" },
  { name: "Live Classes" },
];

const valueProps = [
  {
    title: "5x per week cadence",
    desc: "Live sessions run Monday through Friday so you never have to wait more than a day for your next real-time review with an instructor.",
  },
  {
    title: "Real licensed instructors",
    desc: "Sessions are taught by licensed insurance educators who've helped thousands of students pass — not pre-recorded lectures.",
  },
  {
    title: "Included in every $199 course — no upcharge",
    desc: "Live access is bundled into our base prelicensing course. No Premier tier, no webinar add-on, no upsell at checkout.",
  },
];

const topics = [
  {
    title: "State exam format walkthrough",
    desc: "How the real Pearson VUE, PSI, or Prometric exam is structured — question count, time limit, topic weights, and pacing strategy.",
  },
  {
    title: "Commonly missed questions by line of authority",
    desc: "Life, Health, and Property & Casualty each have predictable traps. Instructors break down the questions students miss most — and why.",
  },
  {
    title: "Practice exam review",
    desc: "Live walkthroughs of practice exam questions with explanations, so you see the reasoning behind every correct answer (and every wrong one).",
  },
  {
    title: "State-specific regulatory updates",
    desc: "Laws change. Instructors call out recent updates — like California's AB 943 elimination of line-specific prelicensing hours — so you're not studying stale material.",
  },
  {
    title: "Live Q&A with an instructor",
    desc: "Every session ends with an open mic. Ask about a concept you're stuck on, a state rule that doesn't make sense, or how to approach test day.",
  },
];

export default function WebinarsPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-dark text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold uppercase tracking-wide text-sm mb-3">
            Live Instructor Sessions
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Live Insurance Exam Prep Classes &mdash; 5x Weekly
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Join live insurance license exam prep classes Monday through Friday with JustInsurance
            instructors. Included <strong className="text-white">free</strong> with every $199
            prelicensing course &mdash; no Premier tier, no webinar add-on, no upcharge.
          </p>
          <Link
            href="/"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Find My State Course
          </Link>
          <p className="text-blue-100 text-sm mt-4">
            Live 5 days a week &middot; recorded replays &middot; no extra fee
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-4">
            Why Live Sessions Make a Difference
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Self-paced video is great for building a foundation. Live instruction is where
            hard-to-grasp concepts finally click.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {valueProps.map((item) => (
              <div key={item.title} className="bg-gray-bg rounded-xl p-6 border border-gray-200">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule — intentionally generic to stay truthful without a live feed */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold font-semibold uppercase tracking-wide text-xs mb-3">
            Session Schedule
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
            Monday Through Friday, Every Week
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Live sessions run Monday through Friday at consistent times. The current schedule is
            shared with enrolled students in the course dashboard alongside the join link for each
            upcoming session.
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            Enroll in any state prelicensing course to see the next upcoming session time and get
            instant access to the dashboard.
          </p>
          <Link
            href="/"
            className="inline-block bg-navy hover:bg-navy-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Find Your State &rarr;
          </Link>
        </div>
      </section>

      {/* Topics covered */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-4">
            What Gets Covered in Live Sessions
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Each session focuses on the parts of the exam students struggle with most &mdash;
            taught live, with room to ask follow-ups.
          </p>
          <ul className="space-y-4">
            {topics.map((topic) => (
              <li
                key={topic.title}
                className="flex items-start gap-4 bg-gray-bg border border-gray-200 rounded-xl p-5"
              >
                <div className="flex-shrink-0 w-9 h-9 bg-gold rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-gray-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{topic.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{topic.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it compares */}
      <section className="bg-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <p className="text-gold font-semibold uppercase tracking-wide text-xs mb-3">
            Included with Every Course
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-5">
            Live Classes Without the Package Tiers
          </h2>
          <p className="text-blue-100 leading-relaxed mb-4">
            Many prelicensing providers reserve live instruction for higher-priced package
            tiers or sell it as an add-on &mdash; which means comparing tier charts before you
            even start studying.
          </p>
          <p className="text-blue-100 leading-relaxed mb-8">
            <strong className="text-white">JustInsurance</strong> includes live instructor sessions
            5x per week in the base $199 course. One tier, same feature set for every student &mdash;
            no upgrade decisions at checkout.
          </p>
          <Link
            href="/prelicensing"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-7 rounded-lg transition-colors"
          >
            See What&apos;s Included &rarr;
          </Link>
        </div>
      </section>

      <FAQAccordion faqs={faqs} heading="Live Class FAQs" />

      <CTABanner
        title="Ready to Study With Real Instructors?"
        subtitle="Pick your state and enroll. Live sessions, recordings, practice exams, and our pass guarantee (in eligible states) — all included in the base $199 course."
        ctaText="Find My State"
        ctaHref="/"
      />
    </>
  );
}
