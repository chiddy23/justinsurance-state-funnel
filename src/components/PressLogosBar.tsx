import Link from "next/link";

/**
 * Text-based "As featured in" press strip — no logo files required.
 * Renders a quiet horizontal band that conveys credibility without
 * dominating the hero. Links to /press for the full coverage page.
 */
export default function PressLogosBar() {
  return (
    <section className="bg-white border-y border-gray-200 py-5 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
          As Featured In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <Link
            href="/press"
            className="text-navy font-bold text-base hover:text-gold transition-colors"
            aria-label="Read our NASDAQ TradeTalks coverage"
          >
            NASDAQ <span className="text-gray-400 font-normal text-sm">TradeTalks</span>
          </Link>
          <span className="text-gray-300" aria-hidden="true">·</span>
          <Link
            href="/press"
            className="text-navy font-bold text-base hover:text-gold transition-colors"
            aria-label="Read our Yahoo Finance coverage"
          >
            Yahoo<span className="text-purple-600">!</span>{" "}
            <span className="text-gray-400 font-normal text-sm">Finance</span>
          </Link>
          <span className="text-gray-300 hidden sm:inline" aria-hidden="true">·</span>
          <Link
            href="/about"
            className="text-navy font-bold text-base hover:text-gold transition-colors"
            aria-label="Founder credentials"
          >
            <span className="text-gray-400 font-normal text-sm">Founded by</span>{" "}
            Justin vom Eigen
          </Link>
        </div>
      </div>
    </section>
  );
}
