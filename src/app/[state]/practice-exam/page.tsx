import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStateBySlug } from "@/lib/states";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateParams } from "@/lib/generateStaticParams";
import { hasPassGuarantee } from "@/lib/pass-guarantee";
import { hasClassroomWebinarHours, IL_WEBINAR_SHORT_LINE } from "@/lib/il-webinar";
import { isPrelicensingHeld } from "@/lib/prelicensing-status";
import { generateArticleSchemaWithReviewer, generateBreadcrumbSchema, generateFAQSchema, SchemaMarkup } from "@/lib/schema";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ArticleByline from "@/components/ArticleByline";
import StateHero from "@/components/StateHero";
import FAQAccordion from "@/components/FAQAccordion";
import RelatedStatePages from "@/components/RelatedStatePages";
import AddToCartLink from "@/components/AddToCartLink";
import { formatPassingScore } from "@/lib/exam-score";

export function generateStaticParams() {
  return generateStateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) return {};
  return generatePageMetadata({
    pageType: "practice-exam",
    stateName: stateData.name,
    stateSlug: stateData.slug,
  });
}

export default async function PracticeExamPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) notFound();

  const { practiceExams, name: stateName, slug, examInfo, noCombinedExam } =
    stateData;

  // 50 Ill. Adm. Code Part 3119 — Illinois-only: the approved short format
  // line is added to the intro copy (this page markets prelicensing in its
  // cross-sell copy). No rendered-output change for any other state.
  const ilWebinar = hasClassroomWebinarHours(stateData);
  // NY prelicensing is held/coming soon — soften the prelicensing cross-sell so
  // the practice-exam page never markets a not-yet-open course as "one purchase,
  // test-ready in days". Practice exams themselves are a separate live product.
  const prelicensingHeld = isPrelicensingHeld(stateData);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateName, url: `https://justinsuranceco.com/${slug}` },
    { name: "Practice Exam", url: `https://justinsuranceco.com/${slug}/practice-exam` },
  ]);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateName, href: `/${slug}` },
    { name: "Practice Exam" },
  ];

  const faqs = [
    {
      question: `What is included in the ${stateName} insurance practice exam?`,
      answer: `Each ${stateName} practice exam is an independent study tool covering insurance topics for the selected line of authority. You get instant scoring, detailed answer explanations for every question (right or wrong), and unlimited retakes to build confidence before test day. It does not contain or reproduce official state exam questions.`,
    },
    {
      question: `How should I use the ${stateName} practice exam?`,
      // Ohio Admin. Code 3901-5-07(H)(16): the descriptive 80%-benchmark stat
      // is allowed everywhere; the pass-guarantee clause is dropped for
      // excluded states (flows into FAQPage JSON-LD automatically).
      answer: hasPassGuarantee(slug)
        ? `Use the JustInsurance practice exam to review insurance concepts, identify topics that need more study, and practice answering questions under time pressure. Students who score 80% or higher on any three practice-exam attempts typically pass the state exam on the first attempt — that's the benchmark our pass guarantee uses. The practice exam is an independent preparation product and is not an official state examination.`
        : `Use the JustInsurance practice exam to review insurance concepts, identify topics that need more study, and practice answering questions under time pressure. Students who score 80% or higher on the practice exam three times in a row typically pass the state exam on the first attempt. The practice exam is an independent preparation product and is not an official state examination.`,
    },
    {
      question: `Which practice exam should I buy — Life, Health, or Life + Health?`,
      answer: noCombinedExam
        ? `Match your practice exam to the license you plan to test for. If you're sitting for just the Life exam, buy the Life Practice Exam. If you're sitting for Health only, buy the Health Practice Exam. Note that ${stateName} has no combined Life & Health exam — Life and Accident & Health are two separate state exams — so if you're pursuing both lines, the Life + Health Practice Exam prepares you for each of the two exams you'll sit.`
        : `Match your practice exam to the license you plan to test for. If you're sitting for just the Life exam, buy the Life Practice Exam. If you're sitting for Health only, buy the Health Practice Exam. If you're taking a combined Life & Health exam, buy the Life + Health Practice Exam — it covers both lines in one preparation product.`,
    },
    {
      question: `Do I need to take a prelicensing course first?`,
      answer: `That depends on your state. Some states (including Texas) don't require a formal prelicensing course, though we still recommend completing ours before attempting the state exam. Other states require a specific number of prelicensing hours before you can sit for the exam. The practice exam works as a standalone exam prep tool, but for best results we recommend pairing it with our full prelicensing course.`,
    },
    {
      question: `How long do I have access to the practice exam?`,
      answer: `You get ${stateData.courseAccessDays} days of full access from the date of purchase. During that window you can retake the practice exam as many times as you want, review explanations for every question, and track your score trend over time.`,
    },
  ];
  const faqSchema = generateFAQSchema(faqs);

  const examCards = practiceExams
    ? [
        {
          loa: "Life",
          title: `${stateName} Life Insurance Practice Exam`,
          desc: `Full-length ${stateName} Life insurance practice test with scoring and detailed answer explanations for additional preparation.`,
          url: practiceExams.lifeUrl,
          accent: "from-blue-600 to-blue-700",
        },
        {
          loa: "Health",
          title: `${stateName} Health Insurance Practice Exam`,
          desc: `Full-length ${stateName} Health insurance practice test covering major health-insurance concepts with scoring and detailed answer explanations.`,
          url: practiceExams.healthUrl,
          accent: "from-teal-600 to-teal-700",
        },
        {
          loa: "Life + Health",
          title: `${stateName} Life & Health Insurance Practice Exam`,
          desc: noCombinedExam
            ? `Most popular. Covers both Life and Health — preps you for ${stateName}'s two separate Life and Accident & Health state exams (${stateName} has no combined exam).`
            : `Most popular. Covers both Life and Health topics in one combined preparation product.`,
          url: practiceExams.combinedUrl,
          accent: "from-gold to-gold-dark",
          popular: true,
        },
      ]
    : [];

  const articleHeadline = `${stateName} Insurance Practice Exam`;
  const articleDescription = `Online ${stateName} insurance practice exams with scoring and detailed answer explanations for additional preparation. Life, Health, and Life & Health options are $59 each.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${slug}/practice-exam`,
  });

  // Product schema per offering
  const productSchemas = examCards.map((card) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.title,
    description: card.desc,
    image: "https://justinsuranceco.com/justinsurance-logo.png",
    brand: {
      "@type": "Brand",
      "@id": "https://justinsuranceco.com#organization",
      name: "JustInsurance",
    },
    offers: {
      "@type": "Offer",
      price: "59.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: card.url,
      category: "Paid",
    },
  }));

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />
      {productSchemas.map((s, i) => (
        <SchemaMarkup key={i} schema={s} />
      ))}

      <BreadcrumbNav crumbs={crumbs} />

      <StateHero
        eyebrow={`${stateName} Exam Prep`}
        title={`${stateName} Insurance Practice Exam`}
        subtitle={`Online practice exams with scoring and detailed answer explanations for additional preparation. Life, Health, and Life & Health options are $59 each.`}
        ctaButtons={[{ text: "See Practice Exams", href: "#practice-exams" }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* Proof / trust band */}
      <section className="bg-navy text-white py-6">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gold">{Math.round(parseFloat(examInfo.passRate))}%</p>
            <p className="text-sm text-blue-100">pass rate*</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold">$59</p>
            <p className="text-sm text-blue-100">per practice exam</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold">{formatPassingScore(slug, examInfo.passingScore)}</p>
            <p className="text-sm text-blue-100">state exam passing score</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold">{stateData.courseAccessDays} days</p>
            <p className="text-sm text-blue-100">full access</p>
          </div>
        </div>
        <p className="max-w-5xl mx-auto px-4 text-xs text-blue-200 text-center mt-4">
          *Among JustInsurance students nationwide who complete the course and recommended practice.{" "}
          <Link href="/pass-rates" className="underline hover:text-gold">
            See how we calculate this &rarr;
          </Link>
        </p>
      </section>

      {/* Practice exam cards */}
      <section id="practice-exams" className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-4">
            Choose Your {stateName} Practice Exam
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Pick the exam that matches the license you&apos;re testing for. Each practice exam is
            full-length, includes detailed explanations, and can be retaken as many times as you
            need.
            {/* 50 Ill. Adm. Code 3119 — approved short format line (Illinois
                only), labeling the prelicensing course format. */}
            {ilWebinar && <> Illinois prelicensing note: {IL_WEBINAR_SHORT_LINE}</>}
          </p>

          {examCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {examCards.map((card) => (
                <div
                  key={card.loa}
                  className={`relative rounded-2xl p-6 shadow-lg border ${
                    card.popular ? "border-gold" : "border-gray-200"
                  } bg-white flex flex-col`}
                >
                  {card.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-gray-dark text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <div
                    className={`bg-gradient-to-br ${card.accent} text-white rounded-xl p-4 mb-4 text-center`}
                  >
                    <p className="text-sm font-semibold opacity-90">{card.loa} License</p>
                    <p className="text-3xl font-bold">$59</p>
                  </div>
                  <h3 className="font-bold text-navy mb-2 leading-snug">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{card.desc}</p>
                  <AddToCartLink
                    href={card.url}
                    price="$59"
                    state={slug}
                    loa={card.loa}
                    courseType="practice-exam"
                    itemName={`${stateName} ${card.loa} Practice Exam`}
                    className="block text-center bg-navy hover:bg-navy-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Buy &amp; Start Now
                  </AddToCartLink>
                  <p className="text-gray-500 text-xs text-center mt-2">
                    Instant access · {stateData.courseAccessDays}-day access
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-amber-50 border-l-4 border-gold rounded-r-lg p-6 max-w-2xl mx-auto text-center">
              <p className="font-semibold text-navy mb-1">{stateName} Practice Exams Coming Soon</p>
              <p className="text-gray-600 text-sm">
                We&apos;re finalizing our {stateName} practice exam catalog. In the meantime, our{" "}
                <Link href={`/${slug}/prelicensing`} className="text-gold hover:underline font-semibold">
                  {stateName} prelicensing course
                </Link>{" "}
                {prelicensingHeld
                  ? "will include a full-length practice exam when it opens for enrollment."
                  : "includes a full-length practice exam at no extra cost."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Secondary CTA — prelicensing course (placed under purchase cards for visibility) */}
      <section className="bg-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {prelicensingHeld ? `${stateName} Prelicensing — Opening Soon` : "Want the Full Prep Package?"}
          </h2>
          <p className="text-blue-100 leading-relaxed mb-6">
            {prelicensingHeld
              ? `Our ${stateName} prelicensing course is completing approval and will open for enrollment soon — it will include a full practice exam at no extra cost. In the meantime, the ${stateName} practice exams above are ready whenever you are.`
              : `Our ${stateName} prelicensing course includes a full practice exam at no extra cost. Get the complete curriculum plus the practice exam — one purchase, test-ready in days.`}
          </p>
          <Link
            href={`/${slug}/prelicensing`}
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {prelicensingHeld ? `Learn About ${stateName} Prelicensing` : `See ${stateName} Prelicensing Courses`}
          </Link>
        </div>
      </section>

      {/* How to use it — benchmarks */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            How to Use the Practice Exam to Actually Pass
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Take it cold",
                desc: `First attempt, no prep. See where you land. If you're below 65%, slow down on prelicensing content before retaking.`,
              },
              {
                step: "2",
                title: "Review every miss",
                desc: `Don't just re-take it. Read the explanation for every wrong answer until you can teach it back. That's where the score jumps happen.`,
              },
              {
                step: "3",
                title: "Hit 80% three times",
                desc: `Score 80%+ three consecutive attempts before scheduling the real exam. That's the threshold the ${stateName} pass rate data points to.`,
              },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center mb-3">
                  <span className="text-gray-dark font-bold">{s.step}</span>
                </div>
                <h3 className="font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free resources */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-4">
            Free {stateName} Exam Prep Resources
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Not ready to buy yet? Start here — all free, no email required.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/insurance-exam-guide"
              className="bg-gray-bg rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-200 block"
            >
              <p className="font-semibold text-navy mb-1">📘 Exam Guide</p>
              <p className="text-gray-600 text-sm">Complete walkthrough of what to expect on exam day — format, topics, test-day checklist.</p>
            </Link>
            <Link
              href="/study-guide"
              className="bg-gray-bg rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-200 block"
            >
              <p className="font-semibold text-navy mb-1">📝 Study Guide</p>
              <p className="text-gray-600 text-sm">How to structure your study time, which topics to weight, and how to retain what you learn.</p>
            </Link>
            <a
              href="https://www.youtube.com/@InsuranceExam"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-bg rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-200 block"
            >
              <p className="font-semibold text-navy mb-1">🎥 YouTube Channel</p>
              <p className="text-gray-600 text-sm">Free video lessons on the hardest exam topics — HMOs vs PPOs, riders, annuities, and more.</p>
            </a>
          </div>
        </div>
      </section>

      <FAQAccordion faqs={faqs} heading={`${stateName} Practice Exam FAQs`} />

      <RelatedStatePages
        stateSlug={slug}
        stateName={stateName}
        currentPage="practice-exam"
        variant="gray"
      />
    </>
  );
}
