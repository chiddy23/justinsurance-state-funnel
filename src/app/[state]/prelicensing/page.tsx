import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/states";
import { generatePageMetadata } from "@/lib/metadata";
import { generateStateParams } from "@/lib/generateStaticParams";
import { generateArticleSchemaWithReviewer, generateBreadcrumbSchema, generateFAQSchema, SchemaMarkup } from "@/lib/schema";
import { getPrelicensingHubFAQs, buildFaqData } from "@/lib/faq-data";
import { hasClassroomWebinarHours, withIlWebinarFaq, IL_WEBINAR_SHORT_LINE } from "@/lib/il-webinar";
import { credentialKindFromHours, isPrelicensingHeld } from "@/lib/prelicensing-status";
import ArticleByline from "@/components/ArticleByline";
import IllinoisWebinarCallout from "@/components/IllinoisWebinarCallout";
import PrelicenseApprovalNotice from "@/components/PrelicenseApprovalNotice";
import PrelicensingHeldNotice from "@/components/PrelicensingHeldNotice";
import StateHero from "@/components/StateHero";
import LOASelector from "@/components/LOASelector";
import { RefundDisclosure } from "@/components/CTABanner";
import PassGuarantee from "@/components/PassGuarantee";
import FAQAccordion from "@/components/FAQAccordion";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import RelatedStatePages from "@/components/RelatedStatePages";
import LastUpdated from "@/components/LastUpdated";

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
  const baseMeta = generatePageMetadata({
    pageType: "prelicensing-hub",
    stateName: stateData.name,
    stateSlug: stateData.slug,
    hours: typeof stateData.prelicensing.lifeAndHealth.hours === "number" ? stateData.prelicensing.lifeAndHealth.hours : undefined,
  });
  if (stateData.slug === "alabama" || stateData.slug === "alaska" || stateData.slug === "arizona") {
    const title = `${stateData.name} Insurance Exam Prep Courses`;
    const description =
      `Optional ${stateData.name} Life, Health, and Life & Health insurance exam-prep courses. Study online with 30-day access and optional weekly instructor support.`;
    return {
      ...baseMeta,
      title,
      description,
      openGraph: { ...baseMeta.openGraph, title: `${title} | JustInsurance`, description },
      twitter: { ...baseMeta.twitter, title: `${title} | JustInsurance`, description },
    };
  }
  return isPrelicensingHeld(stateData)
    ? {
        title: `${stateData.name} Prelicensing — Enrollment Opening Soon | JustInsurance`,
        description: `Our ${stateData.name} prelicensing courses are completing state approval and will open for enrollment soon.`,
        robots: { index: false, follow: true },
      }
    : baseMeta;
}

export default async function PrelicensingHubPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) notFound();

  // Approval pending in a prelicensing-mandate state -> hold the hub page.
  if (isPrelicensingHeld(stateData)) {
    return (
      <PrelicensingHeldNotice
        stateName={stateData.name}
        stateSlug={stateData.slug}
        providerApprovalNumber={stateData.providerApprovalNumber}
      />
    );
  }

  // 50 Ill. Adm. Code Part 3119 — Illinois requires 7.5 of the 20
  // prelicensing hours per line via live classroom/webinar with verified
  // attendance. Gates the callout, hybrid hero/format copy, and the appended
  // format FAQ below. Every other state renders byte-identically.
  const ilWebinar = hasClassroomWebinarHours(stateData);
  // California (AB 943, eff. 1/1/2026): the mandatory prelicensing is a single
  // 12-hour Code & Ethics course taken once, not per-line hours — so step copy
  // that ties "required hours" to a line of authority must be reframed. Gated.
  const isCalifornia = stateData.slug === "california";
  // Alabama eliminated mandatory prelicensing effective January 1, 2024. Its
  // live products are optional exam preparation with optional weekly instructor
  // sessions, so do not use the generic exam-only "no live sessions" or
  // state-certificate wording.
  const isAlabama = stateData.slug === "alabama";
  // Alaska also has no prelicensing-education prerequisite. Its three live
  // products are optional exam preparation and include optional weekly live
  // instructor support, so buyer-facing copy must not imply a mandatory course
  // or a state-recognized prelicensing certificate.
  const isAlaska = stateData.slug === "alaska";
  // Arizona also has no prelicensing-education prerequisite. Its live catalog
  // offers optional exam preparation with optional weekly instructor support.
  const isArizona = stateData.slug === "arizona";
  // Arkansas has optional weekly instructor support and requires the license
  // application/Authorization to Test before PSI exam scheduling.
  const isArkansas = stateData.slug === "arkansas";
  const isOptionalExamPrep = isAlabama || isAlaska || isArizona;
  // Minnesota: internet-delivered prelicensing requires a proctor-monitored final
  // exam (student arranges a disinterested third-party proctor who verifies ID and
  // signs an affidavit) before the certificate issues — Minn. Stat. § 45.305,
  // § 45.25 subd. 12. So the generic "no live sessions / instant certificate"
  // framing is inaccurate for Minnesota and is gated off. Gated so no other state changes.
  const isMinnesota = stateData.slug === "minnesota";

  // False-advertising guard: only claim a "state-approved prelicensing
  // course" in states that actually mandate prelicensing and issue a
  // prelicensing-provider approval. CE-only states (no numeric hours on any
  // line) get neutral exam-prep wording instead — see StateProviderBadge for
  // the same gate applied to the state-hub trust badge.
  const isCEOnlyState =
    credentialKindFromHours([
      stateData.prelicensing?.life?.hours,
      stateData.prelicensing?.health?.hours,
      stateData.prelicensing?.lifeAndHealth?.hours,
    ]) === "ce";

  const faqs = withIlWebinarFaq(
    getPrelicensingHubFAQs(buildFaqData(stateData)),
    stateData
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://justinsuranceco.com/" },
    { name: stateData.name, url: `https://justinsuranceco.com/${stateData.slug}` },
    { name: isOptionalExamPrep ? "Exam Prep" : "Prelicensing", url: `https://justinsuranceco.com/${stateData.slug}/prelicensing` },
  ]);
  const faqSchema = generateFAQSchema(faqs);

  const articleHeadline = isOptionalExamPrep
    ? `${stateData.name} Insurance Exam Prep Courses`
    : `${stateData.name} Insurance Prelicensing Courses`;
  const articleDescription = isCEOnlyState
    ? `Prepare for your ${stateData.name} insurance license exam with our online exam-prep courses. Choose your line of authority below and start studying today.`
    : `Get your ${stateData.name} insurance license with a state-approved online prelicensing course. Choose your line of authority below and start studying today.`;
  const articleSchema = generateArticleSchemaWithReviewer({
    headline: articleHeadline,
    description: articleDescription,
    datePublished: "2026-04-15",
    url: `https://justinsuranceco.com/${stateData.slug}/prelicensing`,
  });

  const crumbs = [
    { name: "Home", href: "/" },
    { name: stateData.name, href: `/${stateData.slug}` },
    { name: isOptionalExamPrep ? "Exam Prep" : "Prelicensing" },
  ];

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={articleSchema} />

      <BreadcrumbNav crumbs={crumbs} />

      <StateHero
        eyebrow={`${stateData.name} ${isOptionalExamPrep ? "Exam Prep" : "Prelicensing"}`}
        title={`${stateData.name} Insurance ${isOptionalExamPrep ? "Exam Prep Courses" : "Prelicensing Courses"}`}
        subtitle={
          // 50 Ill. Adm. Code 3119 — Illinois hero leads with the approved
          // short format line so the hybrid format is above the fold.
          ilWebinar
            ? `Get your ${stateData.name} insurance license with a state-approved prelicensing course. ${IL_WEBINAR_SHORT_LINE} Choose your line of authority below.`
            : isCEOnlyState
            ? `Prepare for your ${stateData.name} insurance license exam with our online exam-prep courses. Choose your line of authority below and start studying today.`
            : `Get your ${stateData.name} insurance license with ${stateData.providerApprovalNumber !== "PENDING" && !isCEOnlyState ? "a state-approved online" : "an online"} prelicensing course. Choose your line of authority below and start studying today.`
        }
        ctaButtons={[
          { text: "Choose Your Course Below", href: "#courses" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ArticleByline lastReviewed={stateData.lastVerified} />
      </div>

      {/* 50 Ill. Adm. Code 3119 — Illinois-only live-webinar format callout,
          top of main content before any course explainer copy. */}
      {ilWebinar && <IllinoisWebinarCallout />}

      {/* Approved-provider disclosure (provider # + SBS verification link) for
          states that require it — Illinois 50 Ill. Adm. Code 3119.30(j).
          Renders null for states with no disclosure mandate. */}
      <PrelicenseApprovalNotice stateSlug={stateData.slug} stateName={stateData.name} />

      {/* What is Prelicensing — 2-column explainer */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                {isOptionalExamPrep ? "What is Insurance Exam Prep?" : "What is Insurance Prelicensing?"}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {(() => {
                  // "required" must reflect whether the state mandates prelicensing
                  // on ANY line — not just the combined L&H line, which is the string
                  // "no combined license" in no-combined-exam states (e.g. Wisconsin),
                  // where Life and Health are 20 hrs each and prelicensing IS required.
                  const required = !isCEOnlyState;
                  if (required) {
                    if (stateData.slug === "california") {
                      return `The single 12-hour Code and Ethics prelicensing course is not required to schedule or sit the ${stateData.name} insurance licensing exam — you may take the exam first — but state law requires you to complete this course before your license can be issued. Effective January 1, 2026, California Assembly Bill 943 replaced the state's former line-specific product-hour requirements with this one course — completed once, regardless of which line(s) of authority you pursue. It covers the California Insurance Code, producer ethics and fiduciary duties, unfair trade practices, and the consumer protections you need to know to sell insurance professionally and ethically. California requires the full 12 hours to be completed as monitored seat time: the course tracks your active engagement, so it cannot be finished in less than 12 hours, and you confirm your participation by electronic affidavit at the end (10 CCR §§ 2188.2, 2188.5). A built-in timer counts down as you study, so you can always see how much active engagement time you have left.`;
                    }
                    if (stateData.slug === "mississippi") {
                      // HB 819 (Miss. Code § 83-17-251(2)(h)): Life-ONLY applicants
                      // are exempt from the prelicensing requirement; Health and
                      // combined Life & Health still require it. The blanket wording
                      // below would tell Life-only candidates a course is mandatory.
                      return `Before you can take the Mississippi insurance licensing exam, state law requires approved prelicensing education for the Health and combined Life & Health licenses. Applicants seeking the Life line of authority ONLY are exempt from the prelicensing requirement under House Bill 819 (Miss. Code § 83-17-251(2)(h)) — though the state licensing exam is still required. This education covers the insurance concepts, policy types, and Mississippi regulations you need to know to sell insurance professionally and ethically.`;
                    }
                    return `Before you can take the ${stateData.name} insurance licensing exam, state law requires you to complete a minimum number of hours of approved prelicensing education. This education covers the insurance concepts, policy types, and ${stateData.name} regulations you need to know to sell insurance professionally and ethically.`;
                  }
                  if (isAlabama) {
                    return `Alabama does not require prelicensing education to sit for its insurance licensing exam, and the Alabama Department of Insurance does not approve or authorize prelicensing courses. JustInsurance's Alabama courses are optional exam preparation organized around the published licensing-exam content outline, with structured lessons, practice, and instructor support.`;
                  }
                  if (isAlaska) {
                    return `Alaska does not require prelicensing education before its insurance licensing exams. JustInsurance's Alaska courses are optional exam preparation organized around the Life and Accident & Health exam topics, with structured lessons, practice, and instructor support.`;
                  }
                  if (isArizona) {
                    return `Arizona does not require prelicensing education before its insurance licensing exams. JustInsurance's Arizona courses are optional exam preparation organized around the current PSI content outlines for Life, Accident and Health or Sickness, and the combined Life and Health exam, with structured lessons, practice, and instructor support.`;
                  }
                  return `${stateData.name} does not require a formal prelicensing course to sit for the state licensing exam — but preparation still matters. JustInsurance's ${stateData.name} prelicensing course covers the insurance concepts, policy types, and ${stateData.name} regulations tested on the exam, giving you the structure first-time passers rely on even when it's not state-mandated.`;
                })()}
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                {ilWebinar ? (
                  // 50 Ill. Adm. Code 3119 — the generic "no live sessions"
                  // claim is false for Illinois; approved hybrid framing.
                  <>JustInsurance&apos;s {stateData.name} prelicensing courses combine the required 7.5 live webinar hours per line of authority — attendance is verified — with 12.5 self-paced online hours per line (20 hours total per line). The self-paced portion is available on any device, at any time.</>
                ) : isMinnesota ? (
                  <>JustInsurance&apos;s Minnesota prelicensing courses are fully online and flexible — study on any device, at any time, with no fixed class times. They are not self-paced in length, though: Minnesota enforces a minimum seat time, so the course is built to take the full required hours of interactive study and automatically logs you out if you are inactive for more than 10 minutes — it cannot be rushed. The one step you schedule is a proctored final exam: you arrange a disinterested third-party proctor who verifies your photo ID and signs an affidavit before your certificate of completion can be issued.</>
                ) : isCalifornia ? (
                  <>JustInsurance&apos;s California program is fully online and flexible to schedule, but the required 12-hour Code &amp; Ethics course uses monitored active-study time and cannot be completed in less than 12 hours. Optional weekly live instructor sessions are included for added exam-preparation support; attendance is not required to complete the monitored course.</>
                ) : stateData.slug === "florida" || isArkansas ? (
                  <>JustInsurance&apos;s {stateData.name} prelicensing courses are fully online and self-paced. You can study on any device, at any time. Weekly live instructor sessions are included as optional support; attendance is not required to complete your self-paced course.</>
                ) : isOptionalExamPrep ? (
                  <>JustInsurance&apos;s {stateData.name} exam-prep courses are fully online and self-paced. You can study on any device, at any time. Weekly live instructor sessions are included as optional support; attendance is not required to complete your course.</>
                ) : (
                  <>JustInsurance&apos;s {stateData.name} prelicensing courses are fully online and self-paced. You can study on any device, at any time. There are no live sessions to attend — just work through the lessons at your own pace and move on when you&apos;re ready.</>
                )}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {ilWebinar ? (
                  <>Once you complete every course module and assessment in forced-progression order, pass the final course exam with a score of 70% or higher, and complete the required 7.5-hour live webinar per line &mdash; meeting all attendance and participation requirements &mdash; you&apos;ll be issued your Illinois certificate of completion. You then register with {stateData.examInfo.examProvider} and present a copy of that certificate at the test center on exam day.</>
                ) : isMinnesota ? (
                  <>To earn your certificate, Minnesota requires you to pass a proctored final exam — you arrange a disinterested third-party proctor (not a relative, co-worker, or your instructor) who verifies your photo ID and signs an affidavit that you completed the exam without assistance (Minn. Stat. &sect; 45.305, subd. 5). Your certificate of completion is issued after you pass that proctored final and we receive the signed affidavit; JustInsurance then reports your completion to the Minnesota Department of Commerce. You schedule and take the state licensing exam separately with {stateData.examInfo.examProvider}.</>
                ) : isOptionalExamPrep ? (
                  <>Once you complete the optional exam-prep course and its assessments, your JustInsurance learner record will show the course as complete. {stateData.name} does not require this course completion to qualify for its licensing exam; schedule and take that exam separately with {stateData.examInfo.examProvider}.</>
                ) : (
                  <>Once you complete {isCEOnlyState ? "the course" : "the required hours"} and pass the course assessments, you&apos;ll receive an official certificate of completion for your {stateData.name} licensing exam with {stateData.examInfo.examProvider}.{stateData.providerApprovalNumber !== "PENDING" && !isCEOnlyState ? " Your approved provider also reports your completion to the state." : ""}</>
                )}
              </p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Enroll Online", desc: "Choose your line of authority and enroll in minutes. Instant access to all course materials." },
                // 50 Ill. Adm. Code 3119 — Illinois step 2 uses hybrid
                // format copy instead of the pure self-paced framing.
                ilWebinar
                  ? { step: "2", title: "Complete Your Hours", desc: `Complete the required 7.5 live webinar hours per line of authority (attendance verified) plus 12.5 self-paced hours per line — video lessons, readings, and quizzes.` }
                  : isCalifornia
                  ? { step: "2", title: "Complete Monitored Study", desc: `Complete the single monitored 12-hour Code and Ethics course — it satisfies the education requirement for every line of authority and is completed only once — with video lessons, readings, and quizzes on any device.` }
                  : { step: "2", title: "Study at Your Pace", desc: isCEOnlyState ? `Work through the exam-prep course at your own pace for your line of authority — video lessons, readings, and quizzes on any device.` : `Complete your required prelicensing hours for your line of authority — video lessons, readings, and quizzes on any device.` },
                ilWebinar
                  ? { step: "3", title: "Earn Your Certificate", desc: `Complete all modules and quizzes in forced-progression order, pass the final exam with 70% or higher, and attend and participate in the required 7.5-hour live webinar sessions — then you'll be issued your Illinois Certificate of Completion.` }
                  : isOptionalExamPrep
                  ? { step: "3", title: "Complete Your Course", desc: "Finish the optional exam-prep lessons and assessments; your JustInsurance learner record will show the course as complete." }
                  : { step: "3", title: "Earn Your Certificate", desc: "Pass the course assessments to receive your official certificate of completion from JustInsurance." },
                ...(isArkansas
                  ? [
                      { step: "4", title: "Apply and Receive Your ATT", desc: "Submit your Arkansas license application through NIPR and wait for your Authorization to Test before scheduling with PSI." },
                      { step: "5", title: "Pass the State Exam", desc: `Schedule and pass the Arkansas licensing exam with ${stateData.examInfo.examProvider} within your ATT window.` },
                    ]
                  : [{ step: "4", title: "Pass the State Exam", desc: `Schedule and pass the ${stateData.name} licensing exam with ${stateData.examInfo.examProvider}, then apply for your license.` }]),
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 bg-gray-bg rounded-lg p-4">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-dark font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{item.title}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOA Selector */}
      <div id="courses">
        <LOASelector
          stateSlug={stateData.slug}
          courseType="prelicensing"
          stateData={stateData}
        />
        {/* COM-08 (audit 2026-07-14): refund microcopy at the point of sale on
            the hub Enroll CTAs, matching the course-page pattern. */}
        <p className="max-w-4xl mx-auto px-4 pt-4 text-center text-xs text-gray-600">
          <RefundDisclosure />
        </p>
      </div>

      {/* How It Works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            How to Get Your {stateData.name} Insurance License
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                icon: "📋",
                title: "Enroll in a Course",
                desc: "Choose your line of authority (Life, Health, or Life & Health) and enroll online.",
              },
              {
                step: "2",
                icon: "📚",
                title: isOptionalExamPrep ? "Complete Your Exam Prep" : "Complete Your Education",
                // 50 Ill. Adm. Code 3119 — Illinois "how it works" copy uses
                // the hybrid format instead of unqualified self-paced.
                desc: ilWebinar
                  ? `Complete all required hours — 7.5 live webinar hours per line of authority (attendance verified) plus 12.5 self-paced online hours per line.`
                  : isCalifornia
                  ? `Complete the single monitored 12-hour Code and Ethics course — it satisfies the education requirement for every line of authority and is completed only once. You can schedule study sessions flexibly, but the course cannot be completed in less than 12 hours.`
                  : isCEOnlyState
                  ? `Work through the full course for your line of authority online at your own pace.`
                  : `Study through all the required hours for your line of authority online at your own pace.`,
              },
              {
                step: "3",
                icon: isArkansas ? "🪪" : "🎓",
                title: isArkansas ? "Apply and Receive Your ATT" : "Pass the State Exam",
                desc: isArkansas
                  ? "Submit your application through NIPR and wait for the Arkansas Insurance Department to issue your Authorization to Test."
                  : `Schedule and pass the ${stateData.name} exam at a ${stateData.examInfo.examProvider} testing center.`,
              },
              {
                step: "4",
                icon: isArkansas ? "🎓" : "🪪",
                title: isArkansas ? "Pass the State Exam" : "Apply for Your License",
                desc: isArkansas
                  ? `Schedule and pass the Arkansas exam with ${stateData.examInfo.examProvider} within your ATT window.`
                  : `Submit your license application to the ${stateData.doiName} after passing your exam.`,
              },
            ].map((item) => (
              <div key={item.step} className="text-center bg-gray-bg rounded-xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="font-bold text-navy mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ohio Admin. Code 3901-5-07(H)(16): PassGuarantee self-suppresses /
          swaps content for excluded states via the stateSlug prop. */}
      <PassGuarantee stateSlug={stateData.slug} />

      <FAQAccordion
        faqs={faqs}
        heading={`${stateData.name} ${isOptionalExamPrep ? "Insurance Exam Prep" : "Prelicensing"} FAQs`}
      />

      {/* Visible "Last updated" stamp at the bottom of the article body */}
      <section className="bg-white py-6 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <LastUpdated date={stateData.lastVerified} />
        </div>
      </section>

      <RelatedStatePages
        stateSlug={stateData.slug}
        stateName={stateData.name}
        currentPage="prelicensing-hub"
        variant="gray"
      />
    </>
  );
}
