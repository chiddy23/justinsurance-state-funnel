import React from "react";
import Link from "next/link";
import { getCtaAttrs } from "@/lib/gtm-attrs";
import AddToCartLink from "@/components/AddToCartLink";

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
        <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {ctaButtons.map((btn, i) => {
            const isSecondary = btn.variant === "secondary";
            const cls = isSecondary
              ? "inline-block bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-white hover:text-navy transition-all"
              : "inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5";
            const location = isSecondary ? "hero-secondary" : "hero-primary";
            const gtmAttrs = getCtaAttrs({ href: btn.href, location });
            const isExternal = /^https?:\/\//.test(btn.href);
            // External Absorb enroll links → AddToCartLink (fires GA4
            // add_to_cart when the href is a real cart link; self-guards
            // otherwise). Internal nav stays a Next <Link>.
            return isExternal ? (
              <AddToCartLink
                key={i}
                href={btn.href}
                price={btn.text}
                gtmAttrs={gtmAttrs}
                className={cls}
              >
                {btn.text}
              </AddToCartLink>
            ) : (
              <Link key={i} href={btn.href} {...gtmAttrs} className={cls}>
                {btn.text}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
