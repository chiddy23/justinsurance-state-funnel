import type { Metadata } from "next";
import { CE_APPROVAL_PHRASE } from "@/lib/site-facts";

export const metadata: Metadata = {
  title: { absolute: "Partner with JustInsurance | Agency Partnership Program" },
  // Audit 2026-07-20 (fid 9/50): the meta description carried the same false
  // "nationwide" CE claim as the body copy. CE approval is PENDING in New York
  // and Washington per src/lib/states.ts, so it is 48 states, not nationwide.
  // Derived from site-facts.ts (this layout is a server component, so importing
  // it costs nothing in the client bundle) rather than retyped.
  description:
    `Partner with JustInsurance for ${CE_APPROVAL_PHRASE}, plus state-approved prelicensing in the states where we are approved. Agency dashboards, bulk pricing, and dedicated support.`,
  alternates: { canonical: "https://justinsuranceco.com/partners" },
  openGraph: {
    title: "Partner with JustInsurance | Agency Partnership Program",
    description:
      "Partner with JustInsurance to give your recruits the best chance of passing. Agency dashboards, bulk pricing, and a 93% first-attempt pass rate among students who complete the full course and meet our practice-exam benchmarks.",
    url: "https://justinsuranceco.com/partners",
    siteName: "JustInsurance",
    type: "website",
    images: [{ url: "/og-image.png", alt: "Partner with JustInsurance" }],
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
