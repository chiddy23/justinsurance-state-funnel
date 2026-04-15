interface Props {
  stateName: string;
  doiName: string;
  providerNumber: string;
  doiUrl?: string;
}

/**
 * Trust badge that surfaces the state DOI provider approval number.
 * Renders below the hero on state hub pages — a verifiable trust signal
 * from a third-party regulator (objectively credible, no self-attestation).
 */
export default function StateProviderBadge({
  stateName,
  doiName,
  providerNumber,
  doiUrl,
}: Props) {
  if (!providerNumber) return null;

  return (
    <section className="bg-gold/10 border-y border-gold/30 py-4 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
        {/* Verified badge icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gold rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div className="text-sm">
          <p className="text-navy font-bold">
            State-Approved {stateName} Prelicensing Provider
          </p>
          <p className="text-gray-700">
            Approval #{providerNumber} ·{" "}
            {doiUrl ? (
              <a
                href={doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gold-dark"
              >
                Verify with the {doiName}
              </a>
            ) : (
              <span>Verified with the {doiName}</span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
