import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "About JustInsurance — 30,000+ Licensed Since 2017" },
  description:
    "Founded by licensed agent Justin vom Eigen after watching talented people fail outdated exams. 30,000+ agents trained. 93% pass rate. 50 states.",
  alternates: { canonical: "https://justinsuranceco.com/about" },
  openGraph: {
    title: "About JustInsurance — 30,000+ Licensed Since 2017",
    description:
      "Founded by licensed agent Justin vom Eigen after watching talented people fail outdated exams. 30,000+ agents trained. 93% pass rate.",
    url: "https://justinsuranceco.com/about",
    siteName: "JustInsurance",
    type: "website",
    images: [{ url: "/og-image.png", alt: "JustInsurance — About" }],
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "About", url: "https://justinsuranceco.com/about" },
]);

const orgPersonSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "JustInsurance LLC",
      alternateName: "Your Insurance License",
      url: "https://justinsuranceco.com",
      logo: "https://justinsuranceco.com/justinsurance-logo.png",
      foundingDate: "2018",
      founder: { "@type": "Person", name: "Justin vom Eigen" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "1806 N Flamingo Rd Ste 230",
        addressLocality: "Pembroke Pines",
        addressRegion: "FL",
        postalCode: "33028",
        addressCountry: "US",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "754-223-9744",
        email: "support@justinsuranceco.com",
      },
      sameAs: [
        "https://www.youtube.com/@InsuranceExam",
        "https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html",
        "https://www.globenewswire.com/news-release/2025/12/10/3203363/0/en/JustInsurance-Unveils-93-Pass-Rate-Breakthrough-Offering-a-Scalable-Solution-to-the-U-S-Insurance-Agent-Shortage.html",
      ],
    },
    {
      "@type": "Person",
      name: "Justin vom Eigen",
      jobTitle: "Founder and CEO",
      worksFor: { "@type": "Organization", name: "JustInsurance LLC" },
      alumniOf: "Northeastern University",
      sameAs: [
        "https://www.youtube.com/@InsuranceExam",
        "https://www.linkedin.com/in/justin-vom-eigen-04198714a/",
        "https://www.nasdaq.com/tradetalks",
      ],
    },
  ],
};

const stats = [
  { value: "30,000+", label: "Agents Trained" },
  { value: "93%", label: "First-Attempt Pass Rate" },
  { value: "50", label: "States Covered" },
  { value: "20,000+", label: "YouTube Subscribers" },
  { value: "$199", label: "Prelicensing" },
  { value: "$39", label: "CE (from)" },
];

const press = [
  {
    outlet: "NASDAQ TradeTalks",
    date: "Live at NASDAQ MarketSite",
    title: "Panel discussion on AI governance and innovation in financial services",
    href: "https://www.youtube.com/watch?v=AYuIOZCZpLQ",
  },
  {
    outlet: "Yahoo Finance",
    date: "Dec 10, 2025",
    title: "JustInsurance Unveils 93% Pass-Rate Breakthrough",
    href: "https://finance.yahoo.com/news/justinsurance-unveils-93-pass-rate-160000549.html",
  },
  {
    outlet: "GlobeNewswire",
    date: "Dec 10, 2025",
    title:
      "JustInsurance Unveils 93% Pass-Rate Breakthrough, Offering a Scalable Solution to the U.S. Insurance Agent Shortage",
    href: "https://www.globenewswire.com/news-release/2025/12/10/3203363/0/en/JustInsurance-Unveils-93-Pass-Rate-Breakthrough-Offering-a-Scalable-Solution-to-the-U-S-Insurance-Agent-Shortage.html",
  },
  {
    outlet: "CityBiz",
    date: "Oct 30, 2025",
    title:
      "Q&A with Justin vom Eigen, Founder and CEO of JustInsurance, on Modernizing Insurance Education",
    href: "https://citybiz.co/article/765855/qa-with-justin-vom-eigen-founder-and-ceo-of-justinsurance-on-modernizing-insurance-education/",
  },
  {
    outlet: "InsuranceNerds",
    date: "2025",
    title: "CEO Q&A republication",
    href: "https://insnerds.com",
  },
  {
    outlet: "Refresh Miami",
    date: "Dec 18, 2025",
    title:
      "JustInsurance offers pre-license education courses for aspiring agents and it's expanding in Miami",
    href: "https://refreshmiami.com/news/justinsurance-offers-pre-license-education-courses-for-aspiring-agents-and-its-expanding-in-miami/",
  },
];

const crumbs = [
  { name: "Home", href: "/" },
  { name: "About" },
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

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-bold text-navy mt-6 mb-2">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-700 text-base leading-relaxed mb-4">{children}</p>;
}

function Quote({ children, author }: { children: React.ReactNode; author: string }) {
  return (
    <blockquote className="border-l-4 border-gold bg-gray-bg rounded-r-lg py-5 px-6 my-6">
      <p className="text-gray-800 text-base md:text-lg italic leading-relaxed mb-3">
        &ldquo;{children}&rdquo;
      </p>
      <footer className="text-navy font-semibold text-sm not-italic">— {author}</footer>
    </blockquote>
  );
}

export default function AboutPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={orgPersonSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            About Us
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            About JustInsurance — Built by a Licensed Agent, for Aspiring Agents
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            JustInsurance was founded by Justin vom Eigen — a former New York Life agent who
            watched talented people wash out of the industry because of outdated,
            soul-crushing prelicensing courses. Today we&apos;ve trained over{" "}
            <strong className="text-white">30,000 agents</strong> across{" "}
            <Link href="/" className="underline hover:text-gold">
              nationwide
            </Link>{" "}
            with a <strong className="text-white">93% first-attempt pass rate</strong>,
            offering modern{" "}
            <Link href="/prelicensing" className="underline hover:text-gold">
              insurance prelicensing courses
            </Link>{" "}
            and{" "}
            <Link href="/continuing-education" className="underline hover:text-gold">
              continuing education
            </Link>{" "}
            online.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="origin">The Origin Story</H2>
          <P>
            Justin vom Eigen studied at Northeastern University before starting his career in
            car sales — where he learned how people actually make decisions, and that trust is
            the thing that closes deals. In 2017 he jumped to New York Life as a licensed
            agent, then moved into recruiting at Senior Life Services as a regional team
            builder.
          </P>
          <P>
            That&apos;s where the problem became obvious. Justin kept recruiting smart, motivated
            people who would get excited about an insurance career — and then get steamrolled by
            the prelicensing exam. The courses hadn&apos;t been updated in years. The content was
            dense, dry, and disconnected from how the exam was actually written. Good people
            were failing, quitting, or spending weeks grinding through material that should have
            taken days.
          </P>
          <P>
            So in 2018 he started making YouTube videos — plain-English insurance licensing exam
            walkthroughs, recorded on his phone, explaining the concepts the way he wished someone
            had explained them to him. The channel grew past 20,000 subscribers. Thousands of
            candidates started messaging him after passing their exams. That was the signal.
          </P>
          <P>
            JustInsurance launched publicly in 2022 as a full prelicensing education platform
            built on the same principle: explain it the way an agent would, cut the filler, and
            get people across the finish line.
          </P>
          <Quote author="Justin vom Eigen, Founder & CEO">
            I kept recruiting talented people who would fail their prelicensing exams or quit
            halfway through because the courses were ancient and soul-crushing. I started making
            YouTube videos to actually help people pass, and when thousands started using them, I
            realized I&apos;d stumbled onto something big.
          </Quote>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="what-we-do">What JustInsurance Does</H2>
          <P>
            JustInsurance is a fully online insurance education platform offering state-approved
            insurance prelicensing courses, insurance continuing education, and full licensing
            support across all 50 state Departments of Insurance. Every course is approved where
            required, self-paced, and built for the way candidates actually study.
          </P>

          <H3>For New Agents</H3>
          <P>
            If you&apos;ve never held a license, we handle the full path: a life and health
            insurance license prelicensing course, full-length practice exams, exam scheduling
            guidance, background check walkthroughs, and the NIPR application process. Most
            students finish in one to three weeks.
          </P>

          <H3>For Licensed Agents</H3>
          <P>
            For existing producers, we deliver CE packages that cover your state&apos;s required
            hours plus ethics — reported directly to your Department of Insurance, usually the
            same business day you finish.
          </P>

          <H3>For Agencies</H3>
          <P>
            Agencies plugging us into their recruiting funnel get a full B2B toolkit: a developer
            API for onboarding automation, real-time candidate tracking dashboards, white-label
            sales pages, and custom automation packages built around each agency&apos;s specific
            recruiting workflow. Most insurance education providers offer a portal; we offer a
            platform that integrates into whatever stack you already use.
          </P>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <H2 id="numbers">By the Numbers</H2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-gray-bg rounded-xl p-6 text-center border border-gray-200"
              >
                <p className="text-3xl md:text-4xl font-bold text-navy mb-1">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-6 text-center max-w-2xl mx-auto">
            93% first-attempt pass rate reflects JustInsurance student outcomes and is well above
            the ~46% national average across major state exam providers. Founded 2018, public
            since 2022.
          </p>
        </div>
      </section>

      {/* How We're Different */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="different">How We&apos;re Different</H2>
          <P>
            Most insurance education companies sell a course and stop there. We handle the whole
            journey, and we built the platform the way an agent would want it built:
          </P>
          <ul className="list-disc pl-6 space-y-3 text-gray-700 text-base leading-relaxed mb-6">
            <li>
              <strong className="text-navy">Developer API for agencies</strong> — plug recruits
              directly into your existing onboarding flow with a documented API, not a portal.
            </li>
            <li>
              <strong className="text-navy">Agency dashboards</strong> with real-time candidate
              tracking so you always know who&apos;s progressing and who&apos;s stuck.
            </li>
            <li>
              <strong className="text-navy">Custom automation packages</strong> — we&apos;ll build
              recruiting, onboarding, and licensing automations tailored to your agency&apos;s
              workflow, not a pre-baked template.
            </li>
            <li>
              <strong className="text-navy">White-label sales pages</strong> for partner agencies
              — your branding, your pricing, our LMS under the hood.
            </li>
            <li>
              <strong className="text-navy">Full licensing process handled</strong> — not just
              coursework. Exam scheduling, background checks, fingerprinting guidance, NIPR
              application walkthroughs.
            </li>
            <li>
              <strong className="text-navy">30% faster completion</strong> than traditional
              classroom formats. Students move at their own pace, on any device.
            </li>
            <li>
              <strong className="text-navy">Plain English instruction</strong> — no industry
              jargon, no outdated academic framing. Taught the way a working agent would explain
              it.
            </li>
            <li>
              <strong className="text-navy">Live Q&amp;A sessions</strong> included with every
              course.
            </li>
            <li>
              <strong className="text-navy">Pass guarantee</strong> — complete the course and your
              practice exams. If you don&apos;t pass, we refund the course fee.
            </li>
          </ul>
          <Quote author="Justin vom Eigen">
            We turned the most boring part of insurance into something that doesn&apos;t make you
            want to quit your career before it starts.
          </Quote>
        </div>
      </section>

      {/* About Justin */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="justin">About Justin vom Eigen</H2>
          <P>
            Justin vom Eigen is the Founder and CEO of JustInsurance LLC. A Northeastern
            University alum, he spent two years writing life and health policies as a licensed
            agent at New York Life before moving into recruiting and onboarding at Senior Life
            Services — where he saw firsthand just how broken the prelicensing pipeline was.
          </P>
          <P>
            Before JustInsurance was a company, it was a YouTube channel. Justin started{" "}
            <a
              href="https://www.youtube.com/@InsuranceExam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy font-semibold underline hover:text-gold"
            >
              @InsuranceExam
            </a>{" "}
            to give free exam prep to anyone trying to break into the industry. The channel
            passed 20,000 subscribers and became the direct origin of the business — real students
            using the videos, passing their exams, and asking for more.
          </P>
          <P>
            In 2025 Justin appeared live at NASDAQ MarketSite in New York on{" "}
            <a
              href="https://www.youtube.com/watch?v=AYuIOZCZpLQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy font-semibold underline hover:text-gold"
            >
              NASDAQ TradeTalks
            </a>
            , joining a panel alongside Dr. Christos Makridis of Gallup / Arizona State
            University to discuss AI governance, operational resilience, and innovation in
            financial services. JustInsurance is headquartered in Pembroke Pines, Florida, and
            opened a second office in the Miami Brickell district in December 2025.
          </P>
          <Quote author="Justin vom Eigen">
            Car sales taught me how people actually make decisions, and that trust is the key to
            relationships. Insurance taught me how brutal the entry barrier is for new agents. I
            combined those lessons to build a company that sells confidence and actually gets
            people across the finish line.
          </Quote>
        </div>
      </section>

      {/* As Seen In */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="press">As Seen In</H2>
          <P>
            JustInsurance has been featured in national financial media and insurance industry
            publications as part of broader coverage on modernizing insurance education and
            addressing the U.S. insurance agent shortage. Full{" "}
            <Link href="/press" className="text-navy font-semibold underline hover:text-gold">
              press and media
            </Link>{" "}
            coverage is collected here:
          </P>
          <ul className="space-y-4">
            {press.map((p) => (
              <li
                key={p.outlet + p.date}
                className="bg-white rounded-xl p-5 border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                  <p className="font-bold text-navy">{p.outlet}</p>
                  <p className="text-xs text-gray-400">{p.date}</p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">{p.title}</p>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold font-semibold text-sm hover:underline"
                >
                  Read coverage &rarr;
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <H2 id="mission">Our Mission</H2>
          <P>
            JustInsurance exists to help more good people become licensed insurance agents —
            faster, cheaper, and with more confidence than the legacy education industry allows.
            We build for working adults who don&apos;t have time to waste on filler, for career
            changers who need modern instruction, and for agencies who need reliable candidates.
          </P>
          <P>
            Our brand principle is simple:{" "}
            <strong className="text-navy">Built by agents, for agents.</strong>
          </P>
          <P>
            If you&apos;re ready to get your insurance license — or renew one you already hold —
            we&apos;re built to help. Have a question first? Check our{" "}
            <Link href="/faq" className="text-navy font-semibold underline hover:text-gold">
              FAQ
            </Link>
            .
          </P>
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
