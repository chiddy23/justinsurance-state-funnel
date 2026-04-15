import type { ComparisonRow, ComparisonValue } from "@/lib/comparison-data";

interface Props {
  rows: ComparisonRow[];
  /** Optional — when set, only shows the JustInsurance column + one competitor */
  highlightCompetitor?: "xcel" | "examfx";
}

function Cell({ value, emphasized }: { value: ComparisonValue; emphasized?: boolean }) {
  if (value.kind === "yes") {
    return (
      <div className={`flex flex-col items-center gap-1 ${emphasized ? "text-navy" : "text-navy"}`}>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${
            emphasized ? "bg-gold" : "bg-green-600"
          }`}
          aria-label="Yes"
        >
          ✓
        </span>
        {value.label && (
          <span className={`text-xs text-center leading-tight ${emphasized ? "font-semibold" : ""}`}>
            {value.label}
          </span>
        )}
      </div>
    );
  }
  if (value.kind === "no") {
    return (
      <div className="flex flex-col items-center gap-1 text-gray-500">
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold"
          aria-label="No"
        >
          ✗
        </span>
        {value.label && <span className="text-xs text-center leading-tight">{value.label}</span>}
      </div>
    );
  }
  // partial
  return (
    <div className="flex flex-col items-center gap-1 text-gray-600">
      <span
        className="flex-shrink-0 px-2 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold"
        aria-label="Partial"
      >
        $ Upcharge
      </span>
      <span className="text-xs text-center leading-tight">{value.label}</span>
    </div>
  );
}

export default function ComparisonTable({ rows, highlightCompetitor }: Props) {
  const showXcel = !highlightCompetitor || highlightCompetitor === "xcel";
  const showExamfx = !highlightCompetitor || highlightCompetitor === "examfx";

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-[700px] px-4 sm:px-0">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Feature
              </th>
              <th className="p-4 text-center">
                <div className="bg-gold text-gray-dark rounded-lg py-2 px-3">
                  <p className="font-bold text-sm">JustInsurance</p>
                </div>
              </th>
              {showXcel && (
                <th className="p-4 text-center">
                  <div className="bg-gray-bg border border-gray-200 rounded-lg py-2 px-3">
                    <p className="font-bold text-sm text-navy">XCEL Solutions</p>
                  </div>
                </th>
              )}
              {showExamfx && (
                <th className="p-4 text-center">
                  <div className="bg-gray-bg border border-gray-200 rounded-lg py-2 px-3">
                    <p className="font-bold text-sm text-navy">ExamFX</p>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.feature}
                className={`${i % 2 === 0 ? "bg-white" : "bg-gray-bg/40"} border-t border-gray-100`}
              >
                <td className="p-4 text-sm text-navy font-medium">{row.feature}</td>
                <td className="p-4 align-middle">
                  <Cell value={row.justinsurance} emphasized />
                </td>
                {showXcel && (
                  <td className="p-4 align-middle">
                    <Cell value={row.xcel} />
                  </td>
                )}
                {showExamfx && (
                  <td className="p-4 align-middle">
                    <Cell value={row.examfx} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
