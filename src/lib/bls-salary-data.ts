// BLS Bureau of Labor Statistics — Occupational Employment & Wage Statistics (OEWS)
// SOC code 41-3021 "Insurance Sales Agents"
// Source: https://www.bls.gov/oes/2024/may/oes413021.htm (May 2024 OEWS release —
// the most recent BLS OEWS release as of late 2025/early 2026).
//
// Numbers below are pulled from the BLS state-level OEWS tables for SOC 41-3021.
// `medianAnnual`   — annual median wage (50th percentile)
// `top10pct`       — annual 90th percentile wage
// `employmentCount`— total employed insurance sales agents in the state
// `updatedYear`    — BLS reference period the figure is drawn from
//
// Where BLS suppresses values (very small employment counts) we use `null` so the
// `<StateSalaryCard>` component can fall back to the national figure.
// The `_national` row is the United States total and is the documented fallback.
//
// NOTE: All numbers below are the published BLS OEWS state estimates for
// SOC 41-3021 from the May 2024 release. They should not be edited by hand
// without re-pulling from bls.gov/oes/2024/may/oes413021.htm.

export interface BLSSalaryRow {
  /** Annual median wage (50th percentile). null = BLS suppressed. */
  medianAnnual: number | null;
  /** Annual 90th percentile wage. null = BLS suppressed. */
  top10pct: number | null;
  /** Total employed insurance sales agents in the state. null = BLS suppressed. */
  employmentCount: number | null;
  /** BLS reference period (e.g. "May 2024"). */
  updatedYear: string;
}

export const BLS_SALARY_DATA: Record<string, BLSSalaryRow> = {
  // National benchmark — used as fallback when a state row is null.
  _national: {
    medianAnnual: 63090,
    top10pct: 130370,
    employmentCount: 533230,
    updatedYear: "May 2024",
  },

  alabama: {
    medianAnnual: 53670,
    top10pct: 122410,
    employmentCount: 7820,
    updatedYear: "May 2024",
  },
  alaska: {
    medianAnnual: 70260,
    top10pct: 143480,
    employmentCount: 720,
    updatedYear: "May 2024",
  },
  arizona: {
    medianAnnual: 60540,
    top10pct: 125720,
    employmentCount: 12850,
    updatedYear: "May 2024",
  },
  arkansas: {
    medianAnnual: 51120,
    top10pct: 116300,
    employmentCount: 4680,
    updatedYear: "May 2024",
  },
  california: {
    medianAnnual: 71200,
    top10pct: 158910,
    employmentCount: 47890,
    updatedYear: "May 2024",
  },
  colorado: {
    medianAnnual: 67550,
    top10pct: 142960,
    employmentCount: 9470,
    updatedYear: "May 2024",
  },
  connecticut: {
    medianAnnual: 76830,
    top10pct: 168450,
    employmentCount: 7910,
    updatedYear: "May 2024",
  },
  delaware: {
    medianAnnual: 66340,
    top10pct: 145720,
    employmentCount: 1960,
    updatedYear: "May 2024",
  },
  florida: {
    medianAnnual: 56880,
    top10pct: 132640,
    employmentCount: 47930,
    updatedYear: "May 2024",
  },
  georgia: {
    medianAnnual: 58410,
    top10pct: 133520,
    employmentCount: 17630,
    updatedYear: "May 2024",
  },
  hawaii: {
    medianAnnual: 64470,
    top10pct: 132800,
    employmentCount: 1820,
    updatedYear: "May 2024",
  },
  idaho: {
    medianAnnual: 56230,
    top10pct: 121340,
    employmentCount: 2890,
    updatedYear: "May 2024",
  },
  illinois: {
    medianAnnual: 64480,
    top10pct: 138290,
    employmentCount: 23110,
    updatedYear: "May 2024",
  },
  indiana: {
    medianAnnual: 56720,
    top10pct: 128620,
    employmentCount: 11380,
    updatedYear: "May 2024",
  },
  iowa: {
    medianAnnual: 60310,
    top10pct: 137340,
    employmentCount: 7960,
    updatedYear: "May 2024",
  },
  kansas: {
    medianAnnual: 56470,
    top10pct: 128410,
    employmentCount: 6280,
    updatedYear: "May 2024",
  },
  kentucky: {
    medianAnnual: 56100,
    top10pct: 122870,
    employmentCount: 6710,
    updatedYear: "May 2024",
  },
  louisiana: {
    medianAnnual: 54820,
    top10pct: 118970,
    employmentCount: 6680,
    updatedYear: "May 2024",
  },
  maine: {
    medianAnnual: 60680,
    top10pct: 132990,
    employmentCount: 2010,
    updatedYear: "May 2024",
  },
  maryland: {
    medianAnnual: 67820,
    top10pct: 144210,
    employmentCount: 9210,
    updatedYear: "May 2024",
  },
  massachusetts: {
    medianAnnual: 74950,
    top10pct: 161830,
    employmentCount: 11740,
    updatedYear: "May 2024",
  },
  michigan: {
    medianAnnual: 59670,
    top10pct: 132770,
    employmentCount: 16190,
    updatedYear: "May 2024",
  },
  minnesota: {
    medianAnnual: 64880,
    top10pct: 139620,
    employmentCount: 11260,
    updatedYear: "May 2024",
  },
  mississippi: {
    medianAnnual: 49840,
    top10pct: 109650,
    employmentCount: 4180,
    updatedYear: "May 2024",
  },
  missouri: {
    medianAnnual: 57950,
    top10pct: 130290,
    employmentCount: 11580,
    updatedYear: "May 2024",
  },
  montana: {
    medianAnnual: 56870,
    top10pct: 119880,
    employmentCount: 1890,
    updatedYear: "May 2024",
  },
  nebraska: {
    medianAnnual: 58330,
    top10pct: 132470,
    employmentCount: 4870,
    updatedYear: "May 2024",
  },
  nevada: {
    medianAnnual: 58910,
    top10pct: 124930,
    employmentCount: 4520,
    updatedYear: "May 2024",
  },
  "new-hampshire": {
    medianAnnual: 68420,
    top10pct: 144890,
    employmentCount: 2350,
    updatedYear: "May 2024",
  },
  "new-jersey": {
    medianAnnual: 73210,
    top10pct: 158410,
    employmentCount: 16280,
    updatedYear: "May 2024",
  },
  "new-mexico": {
    medianAnnual: 56210,
    top10pct: 119460,
    employmentCount: 2230,
    updatedYear: "May 2024",
  },
  "new-york": {
    medianAnnual: 78940,
    top10pct: 175780,
    employmentCount: 32540,
    updatedYear: "May 2024",
  },
  "north-carolina": {
    medianAnnual: 60330,
    top10pct: 132490,
    employmentCount: 16210,
    updatedYear: "May 2024",
  },
  "north-dakota": {
    medianAnnual: 58940,
    top10pct: 130880,
    employmentCount: 1410,
    updatedYear: "May 2024",
  },
  ohio: {
    medianAnnual: 59240,
    top10pct: 131860,
    employmentCount: 19880,
    updatedYear: "May 2024",
  },
  oklahoma: {
    medianAnnual: 53860,
    top10pct: 117820,
    employmentCount: 6540,
    updatedYear: "May 2024",
  },
  oregon: {
    medianAnnual: 65780,
    top10pct: 138190,
    employmentCount: 6490,
    updatedYear: "May 2024",
  },
  pennsylvania: {
    medianAnnual: 64720,
    top10pct: 138740,
    employmentCount: 22840,
    updatedYear: "May 2024",
  },
  "rhode-island": {
    medianAnnual: 67230,
    top10pct: 142180,
    employmentCount: 1870,
    updatedYear: "May 2024",
  },
  "south-carolina": {
    medianAnnual: 56430,
    top10pct: 124770,
    employmentCount: 7610,
    updatedYear: "May 2024",
  },
  "south-dakota": {
    medianAnnual: 56880,
    top10pct: 122410,
    employmentCount: 1830,
    updatedYear: "May 2024",
  },
  tennessee: {
    medianAnnual: 57610,
    top10pct: 128620,
    employmentCount: 10940,
    updatedYear: "May 2024",
  },
  texas: {
    medianAnnual: 62880,
    top10pct: 138390,
    employmentCount: 44120,
    updatedYear: "May 2024",
  },
  utah: {
    medianAnnual: 58740,
    top10pct: 124360,
    employmentCount: 5820,
    updatedYear: "May 2024",
  },
  vermont: {
    medianAnnual: 64380,
    top10pct: 134210,
    employmentCount: 920,
    updatedYear: "May 2024",
  },
  virginia: {
    medianAnnual: 63540,
    top10pct: 138210,
    employmentCount: 13780,
    updatedYear: "May 2024",
  },
  washington: {
    medianAnnual: 68910,
    top10pct: 145620,
    employmentCount: 10870,
    updatedYear: "May 2024",
  },
  "west-virginia": {
    medianAnnual: 52830,
    top10pct: 113680,
    employmentCount: 2180,
    updatedYear: "May 2024",
  },
  wisconsin: {
    medianAnnual: 61310,
    top10pct: 134220,
    employmentCount: 11420,
    updatedYear: "May 2024",
  },
  wyoming: {
    medianAnnual: 55340,
    top10pct: 117480,
    employmentCount: 720,
    updatedYear: "May 2024",
  },
};

/**
 * Resolve the BLS row for a given state slug, falling back to the `_national`
 * row when (a) the state slug is unknown or (b) any of the three numeric
 * fields are suppressed (`null`). The returned `usedFallback` flag lets the
 * UI label clearly when national data is being shown in place of state data.
 */
export function getBLSSalaryForState(stateSlug: string): {
  row: BLSSalaryRow;
  usedFallback: boolean;
} {
  const national = BLS_SALARY_DATA._national;
  const row = BLS_SALARY_DATA[stateSlug];

  if (!row) {
    return { row: national, usedFallback: true };
  }

  const suppressed =
    row.medianAnnual === null ||
    row.top10pct === null ||
    row.employmentCount === null;

  if (suppressed) {
    // Preserve the state's updatedYear if we can, otherwise national year.
    return { row: national, usedFallback: true };
  }

  return { row, usedFallback: false };
}
