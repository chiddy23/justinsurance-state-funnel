import Link from "next/link";

/**
 * "As featured in" press strip — text-based treatment, no logo files.
 * Renders as a quiet section that complements the TrustBar above it
 * without competing with it. Each entry is a clickable pill linking
 * to /press or /about for verifiability.
 */
export default function PressLogosBar() {
  return (
    <section className="bg-gray-bg py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-gray-500 text-xs uppercase tracking-[0.2em] font-semibold mb-5">
          As Featured In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <Link
            href="/press"
            aria-label="Read our NASDAQ TradeTalks coverage"
            className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-gold rounded-full px-5 py-2.5 transition-colors"
          >
            <span className="text-navy font-bold text-base group-hover:text-gold-dark transition-colors">
              NASDAQ
            </span>
            <span className="text-gray-500 text-xs">TradeTalks</span>
          </Link>

          <Link
            href="/press"
            aria-label="Read our Yahoo Finance coverage"
            className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-gold rounded-full px-5 py-2.5 transition-colors"
          >
            <span className="text-navy font-bold text-base group-hover:text-gold-dark transition-colors">
              Yahoo<span className="text-purple-600">!</span>
            </span>
            <span className="text-gray-500 text-xs">Finance</span>
          </Link>

          <Link
            href="/about"
            aria-label="Founder credentials"
            className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-gold rounded-full px-5 py-2.5 transition-colors"
          >
            <span className="text-gray-500 text-xs">Founded by</span>
            <span className="text-navy font-bold text-base group-hover:text-gold-dark transition-colors">
              Justin vom Eigen
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
