import Link from "next/link";

/**
 * "As featured in" press strip — text-based treatment, no logo files.
 * Renders as a quiet section that complements the TrustBar above it
 * without competing with it. Each entry is a clickable pill linking
 * to /press or /about for verifiability.
 */
export default function PressLogosBar() {
  return (
    <section className="border-b border-gray-200 bg-gray-bg px-4 py-3">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
        <p className="whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.18em] text-gray-500">
          As Featured In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <Link
            href="/press"
            aria-label="Read our NASDAQ TradeTalks coverage"
            className="group inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1 shadow-sm transition-colors hover:border-gold"
          >
            <span className="text-sm font-bold leading-none text-navy transition-colors group-hover:text-gold-deep">
              NASDAQ
            </span>
            <span className="text-[11px] leading-none text-gray-500">TradeTalks</span>
          </Link>

          <Link
            href="/press"
            aria-label="Read our Yahoo Finance coverage"
            className="group inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1 shadow-sm transition-colors hover:border-gold"
          >
            <span className="text-sm font-bold leading-none text-navy transition-colors group-hover:text-gold-deep">
              Yahoo<span className="text-purple-600">!</span>
            </span>
            <span className="text-[11px] leading-none text-gray-500">Finance</span>
          </Link>

          <Link
            href="/about"
            aria-label="Founder credentials"
            className="group inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1 shadow-sm transition-colors hover:border-gold"
          >
            <span className="text-[11px] leading-none text-gray-500">Founded by</span>
            <span className="text-sm font-bold leading-none text-navy transition-colors group-hover:text-gold-deep">
              Justin vom Eigen
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
