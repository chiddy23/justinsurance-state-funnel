import React from "react";
import type { StateData } from "@/lib/states";
import { SchemaMarkup } from "@/lib/schema";
import { formatPassingScore } from "@/lib/exam-score";
import { credentialKindFromHours, isPrelicensingHeld } from "@/lib/prelicensing-status";

interface HowToGetLicensedProps {
  stateData: StateData;
}

/**
 * 4-step "How to Get Your [State] Insurance License" section.
 *
 * Renders both visible UI (per Google policy: HowTo schema requires visible
 * matching content on the page) and JSON-LD HowTo schema. Note: Google
 * deprecated HowTo rich results in SERPs in Sep 2023, so this won't earn
 * a SERP rich-result card — but the schema still helps generative search
 * (AI Overviews, Gemini, ChatGPT) parse the steps into clean answers.
 *
 * State-specific values pulled from stateData (exam fee, application fee,
 * fingerprint code, DOI URL, etc.) so each of the 50 hubs renders correctly.
 */
export default function HowToGetLicensed({ stateData }: HowToGetLicensedProps) {
  const { name, examInfo, applicationFee, totalLicensingTime, fingerprintRequirement, backgroundRequirement } = stateData;

  // Pending-approval states (providerApprovalNumber === "PENDING", currently NY
  // and WA) cannot claim a "state-approved" course until approval issues.
  const providerApproved = stateData.providerApprovalNumber !== "PENDING";
  // CE-only states must not be told to finish a "state-approved" prelicensing course.
  const prelicensingRequiredHere =
    credentialKindFromHours([
      stateData.prelicensing.life.hours,
      stateData.prelicensing.health.hours,
      stateData.prelicensing.lifeAndHealth.hours,
    ]) === "prelicensing";
  const prelicensingApproved =
    providerApproved &&
    credentialKindFromHours([
      stateData.prelicensing.life.hours,
      stateData.prelicensing.health.hours,
      stateData.prelicensing.lifeAndHealth.hours,
    ]) === "prelicensing";
  // States that require no fingerprinting (e.g. Arkansas) must not carry a
  // "Complete fingerprinting" step heading; the heading reflects the state's
  // actual fingerprint flag.
  const noFingerprint =
    fingerprintRequirement.toLowerCase().includes("not required") ||
    fingerprintRequirement.toLowerCase().includes("no finger");
  // A distinct background-check step applies only when the state runs
  // fingerprinting OR requires an actual criminal/name-based background check.
  // States that clear producer background purely through self-disclosure or
  // application-based review on the license application (e.g. Colorado,
  // Nebraska, South Dakota) have no such step — their backgroundRequirement
  // never contains the phrase "background check". Gate on the real field so the
  // step list and the "N steps" heading stay consistent.
  const backgroundStepRequired =
    !noFingerprint ||
    backgroundRequirement.toLowerCase().includes("background check");

  // The "$199 per line" JustInsurance offer is a present-tense PURCHASE claim, so
  // it may only appear where our prelicensing course is actually live. A
  // prelicensing-required state whose course is not open yet (isPrelicensingHeld —
  // New York today: approved #80025 but courses held) must NOT publish the buyable
  // offer even though its provider number is real; it renders a neutral
  // "opening for enrollment soon" notice instead. Exam-only / live states (e.g.
  // Washington #300632, Texas, Florida) are never held, so they keep the offer copy
  // byte-identical. When approval is still PENDING we drop the offer as before: a
  // prelicensing-required pending state says the course is completing approval, an
  // exam-only pending state keeps generic study guidance with no price. Every
  // non-held state renders byte-identically.
  const held = isPrelicensingHeld(stateData);
  const jiOfferSentence = !prelicensingRequiredHere
    ? " JustInsurance offers optional Life, Health, and Life & Health exam prep online for $199 per line."
    : providerApproved
    ? held
      ? ` JustInsurance's ${name} prelicensing courses are opening for enrollment soon.`
      : " JustInsurance offers Life, Health, and Life & Health prelicensing online for $199 per line."
    : prelicensingRequiredHere
    ? ` JustInsurance's ${name} prelicensing is completing state approval and will open for enrollment soon.`
    : "";
  const stepPrelicensing = {
    title: prelicensingRequiredHere
      ? "Complete your prelicensing course"
      : "Prepare for your exam (optional)",
    body: `${prelicensingRequiredHere ? `Finish ${prelicensingApproved ? "a state-approved" : "an online"} prelicensing course` : `${name} does not require education before the licensing exam. If you want structured preparation, work through an optional online exam-prep course`} covering the ${name} exam content outline.${jiOfferSentence}`,
  };
  const stepExam = {
    title: `Schedule and pass the ${name} state exam`,
    body: `Book your exam through ${examInfo.examProvider} (${stateData.slug === "arizona" ? "$50 for Life or Health; $59 for combined Life & Health" : examInfo.examFee ? `$${examInfo.examFee} per attempt` : "current fee at provider site"})${stateData.applicationBeforeExam ? ", after your application is processed and you receive your Authorization to Test" : ""}. Passing score: ${formatPassingScore(stateData.slug, examInfo.passingScore)}.`,
  };
  const stepBackground = {
    title: noFingerprint ? "Complete your background check" : "Complete fingerprinting and background check",
    // When fingerprinting is not required, fingerprintRequirement can be a bare
    // "Not required" (e.g. Maryland, Oklahoma) — which reads as a contradiction
    // under a "Complete your background check" heading. Fall back to the
    // backgroundRequirement, which describes the actual (name-based/criminal)
    // check in those states.
    body:
      noFingerprint && fingerprintRequirement.trim().toLowerCase() === "not required"
        ? backgroundRequirement
        : fingerprintRequirement || `Submit fingerprints through ${name}'s designated vendor (typically IdentoGO). Background check fees usually run $30–$50 paid directly to the vendor.`,
  };
  const stepApply = {
    title: stateData.applicationBeforeExam
      ? "Submit your license application and get your Authorization to Test"
      : "Submit your license application",
    body: `File your producer license application via NIPR with the ${applicationFee ? `$${applicationFee}` : "state"} application fee${stateData.applicationBeforeExam ? ` — ${name} requires you to apply and receive your Authorization to Test before you can schedule the exam` : ""}. Most ${name} applications are processed within ${stateData.applicationProcessingTime || "a few business days"}, and most candidates complete the whole process in ${totalLicensingTime || "2-4 weeks"}.`,
  };

  const steps = (
    stateData.applicationBeforeExam
      ? [stepPrelicensing, stepApply, ...(backgroundStepRequired ? [stepBackground] : []), stepExam]
      : [stepPrelicensing, stepExam, ...(backgroundStepRequired ? [stepBackground] : []), stepApply]
  ).map((s, i) => ({ n: i + 1, ...s }));

  // Derive the "N steps" heading from the list that actually renders so the
  // sentence can never drift from the steps (states without a background-check
  // step render three steps, not four).
  const stepCountWords = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
  ];
  const stepCountWord = stepCountWords[steps.length] ?? String(steps.length);
  const stepCountWordCap =
    stepCountWord.charAt(0).toUpperCase() + stepCountWord.slice(1);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Get Your ${name} Insurance License`,
    description: prelicensingRequiredHere
      ? `Step-by-step guide to becoming a licensed insurance producer in ${name} — prelicensing, exam, fingerprinting, and license application.`
      : `Step-by-step guide to becoming a licensed insurance producer in ${name} — optional exam preparation, licensing exam, background requirements, and license application.`,
    totalTime: totalLicensingTime ? `P${totalLicensingTime.match(/\d+/)?.[0] ?? "4"}W` : "P4W",
    step: steps.map((s) => ({
      "@type": "HowToStep",
      position: s.n,
      name: s.title,
      text: s.body,
    })),
  };

  return (
    <section className="bg-white py-16 px-4">
      <SchemaMarkup schema={howToSchema} />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
          How to Get Your {name} Insurance License
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
          {stepCountWordCap} steps from start to active license. Same path for Life, Health, and Life &amp; Health producers.
        </p>
        <ol className="space-y-5">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-5 bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex-shrink-0 w-10 h-10 bg-navy rounded-full flex items-center justify-center">
                <span className="text-gold font-bold text-base">{s.n}</span>
              </div>
              <div>
                <h3 className="font-bold text-navy text-base mb-1">{s.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
