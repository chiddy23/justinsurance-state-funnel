import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// GA4 (G-MTQQ0C7DKL) is now fired exclusively by GTM (Configuration tag).
// Direct <GoogleAnalytics> removed 2026-05-01 after SEO team confirmed
// GTM-injected GA4 was flowing pageviews. Single source of truth via GTM.
const GTM_ID = "GTM-PV25B4HX";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | JustInsurance",
    default:
      "Insurance Prelicensing & CE Courses | JustInsurance",
  },
  description:
    "State-approved insurance prelicensing and CE courses nationwide. 100% online, self-paced, 93% pass rate, pass guarantee. From $199.",
  metadataBase: new URL("https://justinsuranceco.com"),
  robots: "index, follow",
  // Explicit icons declaration with STABLE URLs (no Next.js content-hash query strings).
  // Google requires a stable favicon URL — the file-based icon convention in src/app/
  // adds a hash query string per build, which Google treats as a new asset each deploy.
  // Files are duplicated to /public/ for stable URLs; favicon.ico is multi-size 16/32/48.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    siteName: "JustInsurance",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        alt: "JustInsurance — Online Insurance License Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insurance Prelicensing & CE Courses | JustInsurance",
    description:
      "State-approved insurance prelicensing and CE courses nationwide. 100% online, self-paced, 93% pass rate, pass guarantee. From $199.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="font-sans antialiased bg-white text-gray-dark min-h-screen flex flex-col">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
