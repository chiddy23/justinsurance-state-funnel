import React from "react";
import Link from "next/link";

interface CTAButton {
  text: string;
  href: string;
  variant?: "primary" | "secondary";
}

interface StateHeroProps {
  title: string;
  subtitle: string;
  ctaButtons: CTAButton[];
  eyebrow?: string;
}

export default function StateHero({ title, subtitle, ctaButtons, eyebrow }: StateHeroProps) {
  return (
    <section className="bg-navy-dark text-white py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {eyebrow && (
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-4 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <p className="text-sm text-blue-200 tracking-wide mb-8">
          State-approved insurance education since 2017
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {ctaButtons.map((btn, i) =>
            btn.variant === "secondary" ? (
              <Link
                key={i}
                href={btn.href}
                className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-white hover:text-navy transition-all"
              >
                {btn.text}
              </Link>
            ) : (
              <Link
                key={i}
                href={btn.href}
                className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                {btn.text}
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
