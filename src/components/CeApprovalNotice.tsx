import { stateDisclosure } from "@/lib/state-disclosures";

/**
 * Renders a state's mandatory continuing-education approval statement on CE
 * advertising pages, verbatim, where the state requires it (e.g. Florida Rule
 * 69B-228.150 F.A.C.). Returns null for states with no CE-advertising mandate,
 * so every other state's output is unchanged. Data lives in state-disclosures.ts.
 */
export default function CeApprovalNotice({ stateSlug }: { stateSlug?: string }) {
  const disclosure = stateDisclosure(stateSlug);
  if (!disclosure?.ce) return null;

  return (
    <div className="bg-gold/10 border-y border-gold/30 py-3 px-4">
      <p className="max-w-4xl mx-auto text-center text-sm text-navy">
        {disclosure.ce}
      </p>
    </div>
  );
}
