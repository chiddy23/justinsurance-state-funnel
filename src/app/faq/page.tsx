import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import CTABanner from "@/components/CTABanner";
import { SchemaMarkup, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Insurance License FAQ | Common Questions | JustInsurance" },
  description:
    "Answers to the most common insurance licensing questions — requirements, exam scheduling, CE hours, costs, and how to apply in your state.",
  alternates: { canonical: "https://justinsuranceco.com/faq" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "FAQ", url: "https://justinsuranceco.com/faq" },
]);

// ─────────────────────────────────────────────────────────────────────────────
// All 20 Q&As — grouped for display, flattened for FAQ JSON-LD
// ─────────────────────────────────────────────────────────────────────────────

const gettingLicensedFaqs = [
  {
    question: "How do I get an insurance license?",
    answer:
      "The process has four main steps: (1) Complete a state-approved prelicensing education course for your line of authority — Life, Health, or Life & Health. (2) Pass the state insurance licensing exam at an approved test center or online. (3) Submit a license application through NIPR or your state's producer portal and pay the application fee. (4) Complete any background check or fingerprinting required by your state. Most agents go from enrollment to license in 4 to 8 weeks.",
  },
  {
    question: "Do I need a sponsor or employer to get licensed?",
    answer:
      "No. Most states allow you to obtain an insurance producer license without an employer sponsor. You can complete your prelicensing course, pass the exam, and apply for your license entirely on your own. Some states do require a sponsoring company to activate certain license types, but the majority do not require one to get initially licensed.",
  },
  {
    question: "How long does it take to get an insurance license?",
    answer:
      "Most applicants complete the process in 4 to 8 weeks. The prelicensing course typically takes 1 to 3 weeks of self-paced study. Scheduling the exam usually takes a few days to a week. Application processing by your state's DOI typically takes 1 to 4 weeks. Some states issue licenses in as little as 1 to 3 business days after a completed application.",
  },
  {
    question: "How much does it cost to get an insurance license?",
    answer:
      "Total costs vary by state but typically range from $150 to $400. The main expenses are: prelicensing course ($199), exam fee ($40–$70), state license application fee ($30–$150), and background check/fingerprinting if required ($10–$50). JustInsurance provides an exact cost breakdown on each state's page.",
  },
  {
    question: "Can I get licensed in multiple states?",
    answer:
      "Yes. Once you are licensed in your home state, you can apply for non-resident licenses in other states through a process called reciprocity. Most states participate in the NIPR reciprocal licensing system, which allows you to apply online without retaking the exam or completing additional prelicensing education. Non-resident application fees are typically $30 to $100 per state.",
  },
];

const ourCoursesFaqs = [
  {
    question: "How much do JustInsurance courses cost?",
    answer:
      "Prelicensing courses are $199 for any line of authority — Life, Health, or combined Life & Health. Prices are the same whether you choose a single line or the combined course. CE packages start at $39. All courses are one-time purchases with no subscription or hidden fees. Volume discounts are available for agencies enrolling multiple agents.",
  },
  {
    question: "How long do I have access to the course?",
    answer:
      "Prelicensing courses include 30 days of access from enrollment. CE courses are available until you complete them. If you need additional time, contact JustInsurance support and we will work with you. Most students complete their prelicensing course in 1 to 3 weeks.",
  },
  {
    question: "What is included in a JustInsurance course?",
    answer:
      "Every JustInsurance prelicensing course includes: full state-approved course content organized by exam topic, chapter quizzes and practice tests, full-length practice exams that mirror the state exam format, a final exam to earn your completion certificate, and access to live instructor Q&A sessions. CE packages include all required topic courses and the mandatory ethics course.",
  },
  {
    question: "Does JustInsurance offer a pass guarantee?",
    answer:
      "Yes. If you complete the recommended study hours for your state (20 hours single line, or 40 hours dual line in states that don't require prelicensing), score 80% or higher on the practice exam three times in a row, and sit for your first-time state exam attempt within 30 days of your first enrollment, we will refund your course fee in full if you don't pass. This guarantee reflects our confidence in the quality of our course content and your preparation.",
  },
  {
    question: "Are JustInsurance courses fully online?",
    answer:
      "Yes. All JustInsurance courses are 100% online and self-paced. You can study from any device — laptop, tablet, or phone — and pick up exactly where you left off. There are no scheduled class times, no in-person requirements, and no commuting. Live Q&A sessions are optional and held via video call.",
  },
];

const continuingEducationFaqs = [
  {
    question: "How many CE hours do I need to renew my insurance license?",
    answer:
      "Most states require 24 CE hours per 2-year renewal cycle. Exceptions include Arizona (48 hours / 4 years), Massachusetts (45 hours / 3 years), Iowa (36 hours / 3 years), Ohio (24 hours / 2 years), Wyoming (24 hours / 2 years), and South Dakota (10 hours / 1 year). Your state's requirement is shown on the /license-renewal-guide page.",
  },
  {
    question: "Does JustInsurance report CE completions to my state?",
    answer:
      "Yes. JustInsurance is a state-approved CE provider in all 50 states we serve. Completions are reported directly to your state's Department of Insurance — typically the same business day. You do not need to submit transcripts or paperwork yourself.",
  },
  {
    question: "What happens if I miss my CE deadline?",
    answer:
      "If you miss your renewal deadline, your license may be suspended or lapsed. Getting relicensed typically requires completing CE, paying late fees, and in some cases retaking the licensing exam. The safest approach is to complete CE at least 30 days before your license expiration date to allow time for reporting and processing.",
  },
  {
    question: "Do CE credits expire?",
    answer:
      "CE completions are tied to your renewal cycle. Credits completed before your previous renewal generally cannot be carried forward to the next cycle — they must be earned fresh each renewal period. Check your state's rules if you completed CE courses early and want to understand how they apply to your upcoming renewal.",
  },
  {
    question: "Are ethics courses required for CE renewal?",
    answer:
      "Yes, in nearly every state. Ethics is a mandatory CE component, typically 3 hours, that cannot be substituted with general CE electives. JustInsurance includes the state-approved ethics course in every CE package so you are automatically covered.",
  },
];

const examDayFaqs = [
  {
    question: "Who administers the insurance licensing exam?",
    answer:
      "Insurance licensing exams are administered by two main vendors: Pearson VUE and PSI. Which one applies to you depends on your state. Both offer in-person test centers and online proctored options. Your state's candidate handbook will specify the exam provider and link to the scheduling portal.",
  },
  {
    question: "What is the format of the insurance licensing exam?",
    answer:
      "The exam is multiple choice with 100 to 150 questions, a 2 to 3 hour time limit, and a passing score of 70% (75% in some states). You will not know which specific questions appeared in your score until results are posted — the exam is adaptive in some states. Results are provided immediately after completion.",
  },
  {
    question: "How many times can I retake the exam if I fail?",
    answer:
      "Most states allow unlimited retakes within a 12-month period, with a waiting period of 24 hours to 14 days between attempts. A few states limit the total number of attempts before requiring additional steps, such as retaking a prelicensing course. Your score report will specify the retake waiting period.",
  },
  {
    question: "Can I take the insurance exam online from home?",
    answer:
      "Yes, in most states. Pearson VUE offers online proctored testing through OnVUE, and PSI offers online testing through PSI Bridge. Online exams require a webcam, microphone, a clean and private test environment, and a stable internet connection. Some states still require in-person testing — check with your state's exam provider before scheduling.",
  },
  {
    question: "What should I bring to the exam?",
    answer:
      "Bring a valid government-issued photo ID (driver's license or passport) and your exam scheduling confirmation. Leave all study materials, notes, phones, smartwatches, and electronic devices in your car or at home — they are not permitted in the testing room. Arrive 15 to 30 minutes early. For online exams, complete the check-in process 10 to 15 minutes before your start time.",
  },
];

// All 20 questions flattened for FAQPage JSON-LD
const allFaqs = [
  ...gettingLicensedFaqs,
  ...ourCoursesFaqs,
  ...continuingEducationFaqs,
  ...examDayFaqs,
];

const faqSchema = generateFAQSchema(allFaqs);

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: FAQ category section
// ─────────────────────────────────────────────────────────────────────────────

function FAQCategory({
  heading,
  faqs,
  altBg = false,
}: {
  heading: string;
  faqs: { question: string; answer: string }[];
  altBg?: boolean;
}) {
  return (
    <section
      className="py-16 px-4"
      style={altBg ? { backgroundColor: "#F5F7FA" } : { backgroundColor: "#ffffff" }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-navy mb-8 pb-3 border-b border-gray-200">
          {heading}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border border-gray-200 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none bg-white hover:bg-gray-50 transition-colors select-none">
                <span className="font-semibold text-navy text-sm md:text-base leading-snug">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-navy group-open:rotate-45 transition-transform duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 pt-1 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "FAQ" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Help Center
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Answers to the most common questions about getting and renewing your insurance license.
          </p>
          {/* Quick jump links */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {["Getting Licensed", "Our Courses", "Continuing Education", "Exam Day"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Licensed */}
      <div id="getting-licensed">
        <FAQCategory heading="Getting Licensed" faqs={gettingLicensedFaqs} altBg={false} />
      </div>

      {/* Our Courses */}
      <div id="our-courses">
        <FAQCategory heading="Our Courses" faqs={ourCoursesFaqs} altBg={true} />
      </div>

      {/* Continuing Education */}
      <div id="continuing-education">
        <FAQCategory heading="Continuing Education" faqs={continuingEducationFaqs} altBg={false} />
      </div>

      {/* Exam Day */}
      <div id="exam-day">
        <FAQCategory heading="Exam Day" faqs={examDayFaqs} altBg={true} />
      </div>

      {/* Still have questions */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-navy mb-3">Still Have Questions?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Our support team is available by phone and email. Real humans answer — no chatbots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:754-223-9744"
              className="inline-flex items-center justify-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              754-223-9744
            </a>
            <a
              href="mailto:support@justinsuranceco.com"
              className="inline-flex items-center justify-center gap-2 border border-navy text-navy font-semibold px-6 py-3 rounded-lg hover:bg-navy/5 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        title="Ready to Get Started?"
        subtitle="Find your state's prelicensing or CE course and get licensed or renewed today. State-approved, self-paced, and backed by our pass guarantee."
        ctaText="Find Your State"
        ctaHref="/"
      />
    </>
  );
}
