// States whose licensing-exam passing score is a SCALED score (converted via
// equating, typically 0–100 with a cut of 70/75), NOT the raw percentage of
// questions answered correctly. Rendering "70%" in these states misrepresents
// the standard — the vendor handbooks state verbatim that the reported score
// "is neither the number of questions you answered correctly nor the
// percentage of questions you answered correctly."
//
// VERIFIED per state against the exam vendor's own current candidate handbook
// (audit 2026-07-14; every entry adversarially re-verified against the live
// primary source — see audit/findings_register.md). Do NOT add or remove a
// state without a current handbook citation:
//   Pearson VUE handbooks: AK, CO, DE, HI, ME, MO, MT, NC, RI, SC, SD, TN, TX, WV
//     (SC handbook 05.2023 p.7-8: score "should not be interpreted as the
//     percentage or number of correct answers")
//   PSI: AZ (PSI scaled-scoring policy; AZ handbook PDF unparseable — see register)
//   Illinois: Pearson VUE (site already labeled IL "(scaled)" before this helper)
//   Nevada: NAC 683A.270 + Pearson VUE NV handbook
// NOT in the set (verified raw): Arkansas ("must get 70% correct", AID/PSI
// handbook), Michigan (DIFS cut-score table, raw criterion-referenced),
// Mississippi (65% per-exam), Alabama (no scaling evidence; UA-administered).
// UNKNOWN/HELD (vendor publishes no number or no method — kept as "%", owner
// follow-up): ID, IA, KY, NH, VT.
const SCALED_SCORE_STATES: ReadonlySet<string> = new Set([
  "alaska",
  "arizona",
  "colorado",
  "delaware",
  "hawaii",
  "illinois",
  "maine",
  "missouri",
  "montana",
  "nevada",
  "north-carolina",
  "rhode-island",
  "south-carolina",
  "south-dakota",
  "tennessee",
  "texas",
  "west-virginia",
]);

/** True when the state's exam passing score is a scaled score, not a raw %. */
export function isScaledScore(stateSlug?: string | null): boolean {
  return !!stateSlug && SCALED_SCORE_STATES.has(stateSlug.toLowerCase());
}

// States whose cut score differs BY EXAM. Michigan: DIFS "Insurance Examination
// Cut Scores" table (eff. 5/1/2020, verified current 2026-07-14) — raw
// criterion-referenced percentages: Life Producer 72%, Accident & Health
// Producer 76%, combined Life/Accident/Health Producer 75%. A single
// state-level number understates the Health and L&H standards.
const PER_EXAM_SCORES: Record<
  string,
  { life: number; health: number; "life-and-health": number }
> = {
  michigan: { life: 72, health: 76, "life-and-health": 75 },
};

/**
 * Exact passing score for a specific line's exam, falling back to the state's
 * single score where no per-exam table exists.
 */
export function passingScoreForLoa(
  stateSlug: string | null | undefined,
  loaSlug: string | null | undefined,
  fallback: number
): number {
  const table = stateSlug ? PER_EXAM_SCORES[stateSlug.toLowerCase()] : undefined;
  if (!table || !loaSlug) return fallback;
  return table[loaSlug as keyof typeof table] ?? fallback;
}

/** Range string ("72%–76%") for per-exam-score states in state-level contexts. */
function perExamRange(stateSlug: string): string | null {
  const table = PER_EXAM_SCORES[stateSlug.toLowerCase()];
  if (!table) return null;
  const vals = Object.values(table);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  return `${lo}%–${hi}% (varies by exam)`;
}

/**
 * Format a passing score for display: "70%" for raw-percentage states,
 * "70 (scaled score)" where the vendor reports a scaled score.
 */
export function formatPassingScore(
  stateSlug: string | null | undefined,
  score: number,
  loaSlug?: string | null
): string {
  if (stateSlug && PER_EXAM_SCORES[stateSlug.toLowerCase()]) {
    // Per-exam-score state (Michigan): exact number when the line is known,
    // honest range in state-level contexts.
    if (loaSlug) return `${passingScoreForLoa(stateSlug, loaSlug, score)}%`;
    return perExamRange(stateSlug) as string;
  }
  return isScaledScore(stateSlug) ? `${score} (scaled score)` : `${score}%`;
}

/**
 * Sentence fragment for prose ("a score of at least ..."): returns
 * "70%" or "a scaled score of 70" so templates read naturally.
 */
export function passingScoreProse(
  stateSlug: string | null | undefined,
  score: number
): string {
  if (stateSlug && PER_EXAM_SCORES[stateSlug.toLowerCase()]) {
    return `${perExamRange(stateSlug)?.replace(" (varies by exam)", "")} depending on your exam`;
  }
  return isScaledScore(stateSlug) ? `a scaled score of ${score}` : `${score}%`;
}
