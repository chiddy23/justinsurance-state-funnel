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
    default: "Insurance License Courses | JustInsurance",
  },
  description:
    "Get your insurance license online with JustInsurance. State-approved prelicensing and CE courses for life and health agents in all 50 states. Enroll today.",
  metadataBase: new URL("https://justinsuranceco.com"),
  robots: "index, follow",
  openGraph: {
    siteName: "JustInsurance",
    type: "website",
    images: [
      {
        url: "https://justinsuranceco.com/wp-content/uploads/2024/03/logo-300x97.png",
        width: 300,
        height: 97,
        alt: "JustInsurance LLC",
      },
    ],
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
