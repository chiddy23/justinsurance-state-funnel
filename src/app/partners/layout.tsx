import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Partner with JustInsurance | Agency Partnership Program" },
  description:
    "Partner with JustInsurance to give your recruits the best chance of passing. State-approved courses in all 50 states. Agency dashboards and bulk pricing.",
  alternates: { canonical: "https://justinsuranceco.com/partners" },
  openGraph: {
    title: "Partner with JustInsurance | Agency Partnership Program",
    description:
      "Partner with JustInsurance to give your recruits the best chance of passing. Agency dashboards, bulk pricing, 93% pass rate.",
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
