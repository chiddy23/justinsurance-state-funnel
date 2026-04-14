import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Insurance Exam Pass Rates | 93.2% First-Attempt | JustInsurance" },
  description:
    "JustInsurance students pass their insurance licensing exam at a 93.2% first-attempt rate vs ~55% national average. See how our courses compare.",
  alternates: { canonical: "https://justinsuranceco.com/pass-rates" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Pass Rates", url: "https://justinsuranceco.com/pass-rates" },
]);

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Pass Your Life & Health Exam Using ONLY AI",
  description: "Insurance exam prep video from the Insurance Exam Prep YouTube channel by Justin vom Eigen.",
  thumbnailUrl: `https://i.ytimg.com/vi/eoAHA07LXeI/hqdefault.jpg`,
  uploadDate: "2024-01-01",
  contentUrl: `https://www.youtube.com/watch?v=eoAHA07LXeI`,
  embedUrl: `https://www.youtube-nocookie.com/embed/eoAHA07LXeI`,
  publisher: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
};

const features = [
  {
    title: "Realistic Practice Exams",
    description:
      "Our practice exams mirror the actual state licensing exam — same question format, same topic weighting. Students who complete all practice exams pass at a significantly higher rate.",
  },
  {
    title: "State-Specific Content",
    description:
      "Every course is tailored to your state's Department of Insurance requirements. You study exactly what your exam tests — nothing irrelevant, nothing missing.",
  },
  {
    title: "Self-Paced Learning",
    description:
      "Study on your own schedule and revisit difficult sections as many times as you need. No timed lectures, no pressure — just effective learning at your pace.",
  },
  {
    title: "Expert Support",
    description:
      "Have a question about course content or the licensing process? Real humans are available by phone and email. You're never stuck studying alone.",
  },
  {
    title: "Pass Guarantee",
    description:
      "We're so confident in our courses that we back them with a pass guarantee. Meet the recommended study hours, score 80%+ on the practice exam three times in a row, and test within 30 days of your first enrollment. If you don't pass, we refund your course fee.",
  },
];

export default function PassRatesPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={videoSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Pass Rates" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Student Results
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Our Student Pass Rates
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            JustInsurance is built around one goal: getting you licensed. Our
            courses are designed from the ground up to maximize your chance of
            passing the state insurance licensing exam on the first attempt.
          </p>
        </div>
      </section>

      {/* Big stat callout */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* JustInsurance stat */}
            <div className="bg-navy rounded-2xl p-10 text-center shadow-xl">
              <p className="text-blue-200 text-sm uppercase tracking-widest font-semibold mb-3">
                JustInsurance Students
              </p>
              <p className="text-gold font-extrabold leading-none mb-3" style={{ fontSize: "5rem" }}>
                93%
              </p>
              <p className="text-white text-lg font-semibold">First-Attempt Pass Rate</p>
              <p className="text-blue-300 text-sm mt-2">
                Among students who complete the full course and practice exams
              </p>
            </div>

            {/* National average stat */}
            <div className="bg-gray-100 rounded-2xl p-10 text-center shadow-md">
              <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-3">
                National Average
              </p>
              <p
                className="font-extrabold leading-none mb-3 text-gray-400"
                style={{ fontSize: "5rem" }}
              >
                ~55%
              </p>
              <p className="text-gray-700 text-lg font-semibold">First-Attempt Pass Rate</p>
              <p className="text-gray-500 text-sm mt-2">
                Without structured preparation or a state-approved course
              </p>
            </div>
          </div>

          {/* Delta callout */}
          <div className="mt-8 bg-gold/10 border border-gold/30 rounded-xl p-6 text-center">
            <p className="text-navy font-bold text-xl">
              JustInsurance students pass at nearly{" "}
              <span className="text-gold">2x the national rate</span>
            </p>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="bg-gray-50 py-16 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-8">
            About These Numbers
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-sm space-y-5 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-navy">Our 93% figure</strong> is based on
              student-reported survey data collected from JustInsurance course
              completers. It reflects students who finished the full prelicensing
              course — including all required practice exams — before sitting for
              their state licensing exam.
            </p>
            <p>
              <strong className="text-navy">The ~55% national average</strong> reflects
              publicly available data and industry research on first-attempt pass
              rates for insurance licensing exams. Candidates who attempt the exam
              without completing a structured, state-approved course typically pass
              at rates between 50% and 60% on the first attempt, depending on the
              state and line of authority.
            </p>
            <p>
              <strong className="text-navy">Students who complete our full course</strong>{" "}
              and practice exams pass at a rate of 93%. This gap exists because our
              courses are purpose-built to align with your state&apos;s exact exam
              content outline — not generic insurance concepts.
            </p>
          </div>
        </div>
      </section>

      {/* What makes the difference */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            What Makes the Difference
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Five things that set JustInsurance students apart from candidates who
            go in unprepared.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100${
                  index === 4 ? " sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center mb-4">
                  <span className="text-navy font-bold text-sm">{index + 1}</span>
                </div>
                <h3 className="font-bold text-navy mb-2 text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-12 px-4" style={{ backgroundColor: "#F5F7FA" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-navy font-bold text-2xl mb-2">
            30,000+ Students Licensed
          </p>
          <p className="text-gray-600">
            JustInsurance has helped agents across all 50 states earn and renew
            their insurance license since 2017.
          </p>
        </div>
      </section>

      <YouTubeEmbed videoId="eoAHA07LXeI" title="Pass Your Life & Health Exam Using ONLY AI" />

      {/* CTA */}
      <CTABanner
        title="Ready to Join Our 30,000+ Successful Students?"
        subtitle="Enroll in a state-approved prelicensing course today. Study at your own pace, take unlimited practice exams, and pass with confidence."
        ctaText="Find Your State"
        ctaHref="/"
      />
    </>
  );
}
