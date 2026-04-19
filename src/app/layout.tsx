import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-gray-dark min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
