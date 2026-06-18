import Link from "next/link";
import type { PracticeExams } from "@/lib/states";
import AddToCartLink from "@/components/AddToCartLink";

interface Props {
  stateName: string;
  stateSlug: string;
  practiceExams?: PracticeExams;
  /** When provided, render a single-LOA focused CTA (e.g. on a Life prelicensing page) */
  loa?: "Life" | "Health" | "Life + Health";
}

export default function PracticeExamCTA({ stateName, stateSlug, practiceExams, loa }: Props) {
  if (!practiceExams) return null;

  const directUrl = loa
    ? loa === "Life"
      ? practiceExams.lifeUrl
      : loa === "Health"
      ? practiceExams.healthUrl
      : practiceExams.combinedUrl
    : null;

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-navy to-navy-dark rounded-2xl p-8 md:p-10 text-white shadow-xl">
          <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="text-gold text-sm font-semibold uppercase tracking-wide mb-2">
                {loa ? `${loa} Practice Exam` : "Practice Exam"}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                {loa
                  ? `Ready for the ${stateName} ${loa} exam?`
                  : `Boost Your ${stateName} Exam Score`}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {loa
                  ? `Take our full-length ${stateName} ${loa} practice exam. Score 80%+ three times in a row and walk into the real exam confident. $59 — instant access.`
                  : `Full-length practice exams that mirror the real state exam. Detailed answer explanations, unlimited retakes. Life, Health, and Life + Health — $59 each.`}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-w-[200px]">
              {directUrl ? (
                <AddToCartLink
                  href={directUrl}
                  price="$59"
                  state={stateSlug}
                  loa={loa}
                  courseType="practice-exam"
                  itemName={`${stateName} ${loa} Practice Exam`}
                  className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Buy &amp; Start — $59
                </AddToCartLink>
              ) : null}
              <Link
                href={`/${stateSlug}/practice-exam`}
                className={`block text-center ${
                  directUrl
                    ? "bg-transparent border border-white/30 hover:border-gold text-white"
                    : "bg-gold hover:bg-gold-dark text-gray-dark"
                } font-semibold py-3 px-6 rounded-lg transition-colors`}
              >
                {directUrl ? "See All Options" : `See ${stateName} Practice Exams`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
