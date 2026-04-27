import React from "react";
import { getBLSSalaryForState } from "@/lib/bls-salary-data";

interface StateSalaryCardProps {
  stateSlug: string;
  stateName: string;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function formatHeadcount(value: number): string {
  return value.toLocaleString("en-US");
}

export default function StateSalaryCard({
  stateSlug,
  stateName,
}: StateSalaryCardProps) {
  const { row, usedFallback } = getBLSSalaryForState(stateSlug);

  // Safe coercion — getBLSSalaryForState only returns a row whose three
  // numeric fields are non-null (the _national fallback covers any suppressed
  // state row), but we still narrow defensively for TypeScript.
  const median = row.medianAnnual ?? 0;
  const top10 = row.top10pct ?? 0;
  const employed = row.employmentCount ?? 0;

  const headingScope = usedFallback
    ? "What insurance agents earn nationwide"
    : `What insurance agents earn in ${stateName}`;

  const subheading = usedFallback
    ? `${stateName}-specific figures aren't published by BLS for this state at the moment, so the United States totals are shown as the closest reliable benchmark.`
    : `Bureau of Labor Statistics wage and employment data for ${stateName} insurance sales agents.`;

  const employedLabel = usedFallback
    ? "Insurance sales agents employed (U.S.)"
    : `Insurance sales agents employed in ${stateName}`;

  return (
    <section className="bg-gray-bg py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
          {headingScope}
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">
          {subheading}
        </p>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {/* Median annual salary — primary stat */}
            <div className="md:border-r md:border-gray-100 md:pr-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                Median Annual Salary
              </p>
              <p className="text-3xl md:text-4xl font-bold text-navy leading-tight">
                {formatCurrency(median)}
              </p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                The 50th-percentile wage — half of agents earn more, half less.
              </p>
            </div>

            {/* Top 10% earners */}
            <div className="md:border-r md:border-gray-100 md:px-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                Top 10% Earners
              </p>
              <p className="text-3xl md:text-4xl font-bold text-navy leading-tight">
                {formatCurrency(top10)}
              </p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Annual wage at the 90th percentile (high-performing agents).
              </p>
            </div>

            {/* Employment count */}
            <div className="md:pl-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
                {employedLabel}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-navy leading-tight">
                {formatHeadcount(employed)}
              </p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Total insurance sales agents currently employed (BLS estimate).
              </p>
            </div>
          </div>

          <p className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
            Source:{" "}
            <a
              href="https://www.bls.gov/oes/current/oes413021.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy underline hover:text-gold transition-colors"
            >
              U.S. Bureau of Labor Statistics, OEWS — Insurance Sales Agents (SOC 41-3021)
            </a>
            , {row.updatedYear}.
            {usedFallback && (
              <span className="block mt-1 text-gray-400">
                {stateName}-specific figures suppressed or unavailable in this BLS release; United States totals shown.
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
