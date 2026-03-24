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
      "Online Insurance License Courses | $199 · 49 States · Pass Guarantee | JustInsurance",
  },
  description:
    "Get your insurance license online in 49 states. $199 prelicensing, $59 CE. Pass guarantee, same-day reporting, 15,000+ students. Enroll with JustInsurance.",
  metadataBase: new URL("https://justinsuranceco.com"),
  robots: "index, follow",
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
