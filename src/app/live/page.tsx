import type { Metadata } from "next";
import { Suspense } from "react";
import LiveCourseSelector, { type LiveStateOption } from "@/components/LiveCourseSelector";
import { STATES } from "@/lib/states";
import { isPrelicensingLineAvailable, type PrelicensingLine } from "@/lib/prelicensing-status";

export const metadata: Metadata = {
  title: "Continue Your Insurance Exam Prep | JustInsurance",
  description: "Choose a state-specific insurance practice exam or complete prelicensing course after today's live study session.",
  alternates: { canonical: "https://justinsuranceco.com/live" },
  robots: { index: false, follow: true },
};

const LICENSE_TYPES: PrelicensingLine[] = ["life", "health", "life-and-health"];

function checkoutUrl(abbreviation: string, line: PrelicensingLine): string {
  const skuLine = line === "life-and-health" ? "life-health" : line;
  return `https://checkout.justinsuranceco.com/checkout?sku=${abbreviation.toLowerCase()}-${skuLine}`;
}

const states: LiveStateOption[] = Object.values(STATES)
  .map((state) => {
    const practiceUrls = {
      life: state.practiceExams?.lifeUrl || "",
      health: state.practiceExams?.healthUrl || "",
      "life-and-health": state.practiceExams?.combinedUrl || "",
    };
    const prelicensing = Object.fromEntries(
      LICENSE_TYPES.map((line) => [
        line,
        {
          url: checkoutUrl(state.abbreviation, line),
          available: isPrelicensingLineAvailable(state, line),
        },
      ]),
    ) as LiveStateOption["prelicensing"];

    return {
      slug: state.slug,
      name: state.name,
      abbreviation: state.abbreviation,
      practice: {
        life: { url: practiceUrls.life, available: Boolean(practiceUrls.life) },
        health: { url: practiceUrls.health, available: Boolean(practiceUrls.health) },
        "life-and-health": {
          url: practiceUrls["life-and-health"],
          available: Boolean(practiceUrls["life-and-health"]),
        },
      },
      prelicensing,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export default function LiveStudyPage() {
  return (
    <main className="bg-navy text-white">
      <section className="px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-gold">
              Continue after today&apos;s live session
            </p>
            <h1 className="text-balance text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Keep your licensing momentum going
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg">
              Choose focused practice or the complete course, then select your state and license type.
            </p>
          </div>

          <Suspense fallback={<div className="min-h-[430px] rounded-2xl bg-white/95" />}>
            <LiveCourseSelector states={states} />
          </Suspense>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/15 pt-5 text-center sm:gap-4">
            <div>
              <p className="text-base font-extrabold text-white sm:text-lg">30,000+</p>
              <p className="text-xs text-blue-100 sm:text-sm">students served</p>
            </div>
            <div>
              <p className="text-base font-extrabold text-white sm:text-lg">30 days</p>
              <p className="text-xs text-blue-100 sm:text-sm">course access</p>
            </div>
            <div>
              <p className="text-base font-extrabold text-white sm:text-lg">Online</p>
              <p className="text-xs text-blue-100 sm:text-sm">start immediately</p>
            </div>
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-blue-100/80">
            Practice products use original questions based on published state exam content outlines and do not contain or reproduce official licensing-exam questions. Product availability varies by state.
          </p>
        </div>
      </section>
    </main>
  );
}
