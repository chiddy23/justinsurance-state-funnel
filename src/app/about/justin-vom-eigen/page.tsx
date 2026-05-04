import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Justin vom Eigen — Founder, JustInsurance LLC" },
  description:
    "Justin vom Eigen — founder and CEO of JustInsurance. Licensed life and health insurance producer since 2017, IDECC Certified Distance Education Instructor, creator of @InsuranceExam (20,000+ subs).",
  alternates: {
    canonical: "https://justinsuranceco.com/about/justin-vom-eigen",
  },
  openGraph: {
    title: "Justin vom Eigen — Founder, JustInsurance LLC",
    description:
      "Founder and CEO of JustInsurance — licensed life and health insurance producer since 2017, IDECC Certified Distance Education Instructor, and editorial reviewer of state licensing content on justinsuranceco.com.",
    url: "https://justinsuranceco.com/about/justin-vom-eigen",
    siteName: "JustInsurance",
    type: "profile",
    images: [{ url: "/og/justin-vom-eigen.png", alt: "Justin vom Eigen — Founder, JustInsurance LLC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Justin vom Eigen — Founder, JustInsurance LLC",
    description:
      "Founder & CEO of JustInsurance — licensed L&H producer since 2017, IDECC CDEI, creator of @InsuranceExam.",
    images: ["/og/justin-vom-eigen.png"],
  },
  robots: "index, follow",
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "About", url: "https://justinsuranceco.com/about" },
  {
    name: "Justin vom Eigen",
    url: "https://justinsuranceco.com/about/justin-vom-eigen",
  },
]);

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Justin vom Eigen",
  jobTitle: "Founder, CEO & Course Instructor",
  url: "https://justinsuranceco.com/about/justin-vom-eigen",
  image: "https://justinsuranceco.com/headshot-justin.jpg",
  worksFor: {
    "@type": "Organization",
    name: "JustInsurance LLC",
    url: "https://justinsuranceco.com",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Northeastern University",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Boston",
      addressRegion: "MA",
      addressCountry: "US",
    },
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Licensed Life & Health Insurance Producer",
      credentialCategory: "license",
      validFrom: "2017-07-01",
      recognizedBy: { "@type": "Organization", name: "State Department of Insurance" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Certified Distance Education Instructor (CDEI)",
      credentialCategory: "certification",
      validFrom: "2025-06-18",
      recognizedBy: {
        "@type": "Organization",
        name: "International Distance Education Certification Center (IDECC)",
      },
    },
  ],
  knowsAbout: [
    "Insurance prelicensing education",
    "Insurance continuing education",
    "Life insurance",
    "Health insurance",
    "Annuities",
    "Distance education instruction",
    "State insurance licensing requirements",
  ],
  sameAs: [
    "https://www.youtube.com/@InsuranceExam",
    "https://www.linkedin.com/in/justin-vom-eigen-04198714a/",
  ],
};

const crumbs = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Justin vom Eigen" },
];

function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="text-2xl md:text-3xl font-bold text-navy mb-6 scroll-mt-24"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-700 text-base leading-relaxed mb-4">{children}</p>;
}

export default function JustinVomEigenBioPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={personSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* Hero */}
      <section className="bg-navy text-white py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Headshot — circular crop, gold ring */}
          <div className="flex-shrink-0">
            <Image
              src="/headshot-justin.jpg"
              alt="Headshot of Justin vom Eigen, Founder & CEO of JustInsurance LLC"
              width={160}
              height={160}
              priority
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gold"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">
              Author &amp; Reviewer
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3 text-balance">
              Justin vom Eigen — Founder &amp; Licensed Insurance Producer
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Founder &amp; CEO, JustInsurance LLC · Licensed Life &amp; Health
              Insurance Producer (since 2017) · IDECC Certified Distance
              Education Instructor · Creator of the{" "}
              <a
                href="https://www.youtube.com/@InsuranceExam"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gold"
              >
                @InsuranceExam
              </a>{" "}
              YouTube channel.
            </p>
          </div>
        </div>
      </section>

      {/* Bio body */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="bio">About Justin</H2>

          <P>
            Justin vom Eigen is the founder and CEO of JustInsurance LLC and a
            licensed life and health insurance producer in active, good
            standing since July 2017. He is also a Certified Distance Education
            Instructor (CDEI) through the International Distance Education
            Certification Center (IDECC), the third-party body that certifies
            instructor competency in online prelicensing course design and
            delivery. He runs the editorial side of{" "}
            <Link href="/" className="text-navy font-semibold underline hover:text-gold">
              justinsuranceco.com
            </Link>{" "}
            personally — reviewing state-by-state licensing requirements,
            verifying continuing-education hour rules, and overseeing the
            technical accuracy of every guide, hub page, and exam-prep article
            on the site.
          </P>

          <P>
            Justin began his insurance career in July 2017 as a licensed life
            and health producer, selling term, whole life, universal life, and
            final-expense policies and consistently ranking as a top-producing
            agent. From January 2020 through December 2022 he served as an
            agency leader in final expense life insurance, recruiting,
            training, and managing a team of more than 100 producing agents,
            running daily sales training and coaching, and overseeing
            compliance with state insurance laws and producer-conduct rules.
            The pattern he saw across hundreds of new-agent onboardings is
            what eventually became JustInsurance: smart, motivated candidates
            were washing out — not because they lacked the ability, but
            because the prelicensing courses they were forced through were
            dense, outdated, and disconnected from how the state exams were
            actually written.
          </P>

          <P>
            Justin founded JustInsurance LLC in November 2018; the fully online
            prelicensing and continuing-education platform launched in January 2023,
            built on the same principle as Justin&apos;s{" "}
            <a
              href="https://www.youtube.com/@InsuranceExam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy font-semibold underline hover:text-gold"
            >
              @InsuranceExam
            </a>{" "}
            YouTube channel: explain insurance the way a working agent would
            explain it, cut the filler, and get candidates across the finish
            line. Curriculum is designed against the official Prometric and
            Pearson VUE state exam content outlines so coursework maps
            directly to what candidates will see on test day. Today
            JustInsurance offers state-approved{" "}
            <Link
              href="/prelicensing"
              className="text-navy font-semibold underline hover:text-gold"
            >
              prelicensing courses
            </Link>{" "}
            and{" "}
            <Link
              href="/continuing-education"
              className="text-navy font-semibold underline hover:text-gold"
            >
              continuing education
            </Link>{" "}
            in 45+ states, has produced over 120 instructional videos and
            practice-exam banks, and supports more than 1,000 agency
            partnerships serving 30,000+ monthly users.
          </P>

          <P>
            JustInsurance has helped more than{" "}
            <strong className="text-navy">20,000 students</strong> get
            licensed nationwide and reports a{" "}
            <strong className="text-navy">93% first-attempt pass rate</strong>{" "}
            among students who complete the recommended study hours and pass
            three full-length practice exams at 80% or higher before sitting
            for their state exam. With over 8 years of full-time experience
            in life and health insurance — sales, agency leadership,
            curriculum design, and instruction — Justin remains personally
            involved in course content and editorial review.
          </P>

          <P>
            Justin&apos;s focus on the editorial side of the business is
            simple: insurance education should be modern, honest, and written
            in plain English. Every state guide, exam-prep article, and CE
            requirements page on this site is reviewed for technical accuracy
            against the source-of-truth Department of Insurance bulletins and
            statutes for that state. When a state changes its prelicensing
            hours, exam vendor, or CE renewal cycle, the corresponding pages
            on justinsuranceco.com are updated to match — typically within
            days. That is the editorial standard he holds the site to.
          </P>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="credentials">Credentials</H2>
          <ul className="list-disc pl-6 space-y-3 text-gray-700 text-base leading-relaxed">
            <li>
              <strong className="text-navy">
                Licensed Life &amp; Health Insurance Producer
              </strong>{" "}
              — active and in good standing since July 2017
            </li>
            <li>
              <strong className="text-navy">
                Certified Distance Education Instructor (CDEI)
              </strong>{" "}
              — International Distance Education Certification Center (IDECC),
              valid through June 2028
            </li>
            <li>
              <strong className="text-navy">Founder &amp; CEO</strong>,
              JustInsurance LLC (since January 2023)
            </li>
            <li>
              <strong className="text-navy">Course Instructor</strong> —
              state-approved Accident &amp; Health and Life prelicensing
              courses; curriculum designed against Prometric and Pearson VUE
              exam content outlines
            </li>
            <li>
              <strong className="text-navy">Education</strong> — Northeastern
              University, Boston
            </li>
            <li>
              <strong className="text-navy">8+ years</strong> of full-time life
              and health insurance experience — sales, agency leadership (100+
              agent team), curriculum design, and instruction
            </li>
            <li>
              <strong className="text-navy">Creator</strong>, the{" "}
              <a
                href="https://www.youtube.com/@InsuranceExam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy font-semibold underline hover:text-gold"
              >
                @InsuranceExam
              </a>{" "}
              YouTube channel — 20,000+ subscribers
            </li>
            <li>
              <strong className="text-navy">Featured</strong> on NASDAQ
              TradeTalks, Yahoo Finance, GlobeNewswire, CityBiz, and Refresh
              Miami —{" "}
              <Link
                href="/press"
                className="text-navy font-semibold underline hover:text-gold"
              >
                see full press coverage
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Connect */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="connect">Connect</H2>
          <P>
            Justin is most active on YouTube, where he continues to post
            exam-prep walkthroughs and answer student questions in the
            comments.
          </P>
          <ul className="space-y-3 mt-4">
            <li>
              <a
                href="https://www.youtube.com/@InsuranceExam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-navy font-semibold underline hover:text-gold"
              >
                YouTube — @InsuranceExam &rarr;
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/justin-vom-eigen-04198714a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-navy font-semibold underline hover:text-gold"
              >
                LinkedIn — Justin vom Eigen &rarr;
              </a>
            </li>
            <li>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-navy font-semibold underline hover:text-gold"
              >
                Read more about JustInsurance &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <CTABanner
        title="Ready to Get Licensed?"
        subtitle="State-approved prelicensing from $199. Pass guarantee included. Study at your own pace nationwide."
        ctaText="Find My State"
        ctaHref="/#states"
      />
    </>
  );
}
