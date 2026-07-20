import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Partner Resources | Training Videos | JustInsurance" },
  description:
    "Training videos for JustInsurance partner agencies. Dashboard walkthroughs, onboarding systems, and recruit-facing study guides.",
  alternates: { canonical: "https://justinsuranceco.com/partner-resources" },
  // Partner-facing coaching content — keep out of the index (audit 2026-07-14).
  robots: { index: false, follow: false },
  openGraph: {
    title: "Partner Resources | Training Videos | JustInsurance",
    description:
      "Training videos for partner agencies — dashboard, onboarding, study tips, and exam prep resources for your recruits.",
    url: "https://justinsuranceco.com/partner-resources",
    siteName: "JustInsurance",
    type: "website",
    images: [{ url: "/og-image.png", alt: "JustInsurance Partner Resources" }],
  },
};

export default function PartnerResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
