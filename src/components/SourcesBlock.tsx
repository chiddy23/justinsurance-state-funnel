import type { StateData } from "@/lib/states";

interface SourcesBlockProps {
  stateData: StateData;
}

export default function SourcesBlock({ stateData }: SourcesBlockProps) {
  const { citations, doiName, doiUrl, agentLicensingUrl, examInfo, name: stateName } = stateData;

  const regulators: Array<{ label: string; url: string }> = [];
  if (doiUrl) regulators.push({ label: doiName, url: doiUrl });
  if (agentLicensingUrl && agentLicensingUrl !== doiUrl) {
    regulators.push({ label: `${stateName} Agent Licensing Portal`, url: agentLicensingUrl });
  }
  if (examInfo?.examProviderUrl) {
    regulators.push({ label: `${examInfo.examProvider} Exam Scheduling`, url: examInfo.examProviderUrl });
  }
  if (citations?.statutesUrl) {
    regulators.push({ label: `${stateName} Insurance Statutes (${citations.insuranceCode})`, url: citations.statutesUrl });
  }
  if (citations?.adminCodeUrl) {
    regulators.push({ label: `${citations.adminCodeName || "State Admin Code"} — ${citations.adminCodeRef || ""}`.trim().replace(/— $/, ""), url: citations.adminCodeUrl });
  }

  const codes: string[] = [];
  if (citations?.prelicenseCode) codes.push(`Prelicensing: ${citations.prelicenseCode}`);
  if (citations?.ceRequirementsCode) codes.push(`CE: ${citations.ceRequirementsCode}`);
  if (citations?.ceEthicsCode && citations.ceEthicsCode !== citations.ceRequirementsCode) {
    codes.push(`CE Ethics: ${citations.ceEthicsCode}`);
  }

  if (regulators.length === 0 && codes.length === 0) return null;

  return (
    <section className="py-10 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Sources &amp; Regulators
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Information on this page is sourced from the {stateName} insurance regulator and state statutes. Check the links below for the most current regulations directly from the source.
        </p>

        {regulators.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-navy mb-2 uppercase tracking-wide">Primary Sources</h3>
            <ul className="space-y-1">
              {regulators.map((r) => (
                <li key={r.url} className="text-sm">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy underline hover:text-gold"
                  >
                    {r.label}
                  </a>
                  <span className="text-gray-500 ml-1">↗</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {codes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-navy mb-2 uppercase tracking-wide">Regulatory Citations</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {codes.map((c) => (
                <li key={c} className="font-mono text-xs sm:text-sm">{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
