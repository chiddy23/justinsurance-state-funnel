import React from "react";
import type { StateData } from "@/lib/states";
import { SchemaMarkup } from "@/lib/schema";

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
  const { name, examInfo, applicationFee, totalLicensingTime, fingerprintRequirement } = stateData;

  const steps = [
    {
      n: 1,
      title: "Complete your prelicensing course",
      body: `Finish a state-approved prelicensing course covering the ${name} exam content outline. JustInsurance offers Life, Health, and Life & Health prelicensing online for $199 per line.`,
    },
    {
      n: 2,
      title: `Schedule and pass the ${name} state exam`,
      body: `Book your exam through ${examInfo.examProvider} (${examInfo.examFee ? `$${examInfo.examFee} per attempt` : "current fee at provider site"}). Passing score is ${examInfo.passingScore}%.`,
    },
    {
      n: 3,
      title: "Complete fingerprinting and background check",
      body: fingerprintRequirement || `Submit fingerprints through ${name}'s designated vendor (typically IdentoGO). Background check fees usually run $30–$50 paid directly to the vendor.`,
    },
    {
      n: 4,
      title: `Submit your license application`,
      body: `File your producer license application via NIPR with the ${applicationFee ? `$${applicationFee}` : "state"} application fee. Most ${name} applications are processed within ${totalLicensingTime || "2-4 weeks"}.`,
    },
  ];

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Get Your ${name} Insurance License`,
    description: `Step-by-step guide to becoming a licensed insurance producer in ${name} — prelicensing, exam, fingerprinting, and license application.`,
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
          Four steps from start to active license. Same path for Life, Health, and Life &amp; Health producers.
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
