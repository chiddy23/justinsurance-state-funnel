import React from "react";
import Link from "next/link";
import { getCtaAttrs } from "@/lib/gtm-attrs";
import AddToCartLink from "@/components/AddToCartLink";

interface CTABannerProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  externalLink?: boolean;
  // Optional enrichment for the GA4 add_to_cart event when this banner is an
  // external Absorb enroll CTA. courseId is auto-derived from ctaHref; price
  // is parsed from ctaText if not passed.
  state?: string;
  loa?: string;
  courseType?: string;
}

export default function CTABanner({ title, subtitle, ctaText, ctaHref, externalLink = false, state, loa, courseType }: CTABannerProps) {
  const gtmAttrs = getCtaAttrs({ href: ctaHref, location: "cta-banner" });
  return (
    <section className="bg-navy py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
          {subtitle}
        </p>
        {externalLink ? (
          <AddToCartLink
            href={ctaHref}
            price={ctaText}
            state={state}
            loa={loa}
            courseType={courseType}
            gtmAttrs={gtmAttrs}
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-10 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            {ctaText}
          </AddToCartLink>
        ) : (
          <Link
            href={ctaHref}
            {...gtmAttrs}
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-10 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}
