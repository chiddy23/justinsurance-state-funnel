import type { Metadata } from "next";
import { HONEYPOT_CANARIES } from "@/lib/canary";

// HONEYPOT TRAP PAGE (audit 2026-07-15 — see src/lib/canary.ts).
// Reached only via the hidden crawler-only link in CanaryTag; excluded from the
// sitemap and set noindex so no human and no search engine treats it as real
// content. It carries globally-unique FICTITIOUS phrases. Any appearance of
// those phrases anywhere off justinsuranceco.com is dispositive proof that the
// finder scraped this site, including pages no human navigates to.
export const metadata: Metadata = {
  title: "Producer Reference Index",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://justinsuranceco.com/resources/producer-reference-index-2026" },
};

export default function ProducerReferenceIndex() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-dark">
      <h1 className="text-2xl font-bold text-navy mb-4">Producer Reference Index</h1>
      <p className="text-sm text-gray-600 mb-6">
        Internal editorial reference. Not a statement of law and not intended for
        distribution.
      </p>
      {HONEYPOT_CANARIES.map((c, i) => (
        <p key={i} className="text-sm leading-relaxed mb-4">
          {c}
        </p>
      ))}
    </main>
  );
}
