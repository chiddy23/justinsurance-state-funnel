"use client";

import React from "react";
import Link from "next/link";
import { getCtaAttrs } from "@/lib/gtm-attrs";
import AddToCartLink from "@/components/AddToCartLink";

interface StickyMobileCTAProps {
  text: string;
  href: string;
  price?: string;
  state?: string;
  loa?: string;
  courseType?: string;
}

export default function StickyMobileCTA({ text, href, price, state, loa, courseType }: StickyMobileCTAProps) {
  const buttonClassName = "flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-dark text-gray-dark font-bold text-base py-3.5 px-6 rounded-lg transition-colors";
  const buttonContents = (
    <>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      {text}
      {price && <span className="ml-1 font-extrabold">&mdash; {price}</span>}
    </>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="bg-white border-t border-gray-200 shadow-2xl px-4 py-3">
        {href.startsWith("#") ? (
          <Link
            href={href}
            {...getCtaAttrs({ href, location: "sticky-mobile", state, loa })}
            className={buttonClassName}
          >
            {buttonContents}
          </Link>
        ) : (
          <AddToCartLink
            href={href}
            price={price}
            state={state}
            loa={loa}
            courseType={courseType}
            gtmAttrs={getCtaAttrs({ href, location: "sticky-mobile", state, loa })}
            className={buttonClassName}
          >
            {buttonContents}
          </AddToCartLink>
        )}
        <p className="text-center text-[11px] text-gray-500 mt-1.5">
          <Link
            href="/terms#payment-refunds"
            aria-label="Refund policy"
            className="underline hover:text-gray-600"
          >
            Refund policy
          </Link>
        </p>
      </div>
    </div>
  );
}
