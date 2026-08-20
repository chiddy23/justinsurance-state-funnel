import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GtmGate from "@/components/GtmGate";
import GhlChatWidget from "@/components/GhlChatWidget";

// GA4 (G-MTQQ0C7DKL) is now fired exclusively by GTM (Configuration tag).
// Direct <GoogleAnalytics> removed 2026-05-01 after SEO team confirmed
// GTM-injected GA4 was flowing pageviews. Single source of truth via GTM.
// The GTM bootstrap script itself lives in <GtmGate>, alongside the site's
// Global Privacy Control handling. GTM_ID stays here only for the noscript
// fallback below.
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
  // NOTE: keep this fallback description guarantee-free. It is inherited by any
  // page that doesn't set its own description — including Ohio pages, where
  // guarantee offers are prohibited (OH Admin. Code 3901-5-07(H)(16)).
  description:
    "State-approved insurance prelicensing and CE courses nationwide. 100% online, self-paced, 93% completer pass rate, instant access. From $199.",
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
    // NOTE: keep this fallback description guarantee-free. It is inherited by
    // every page that doesn't set its own twitter block — including Ohio pages,
    // where guarantee offers are prohibited (OH Admin. Code 3901-5-07(H)(16)).
    description:
      "State-approved insurance prelicensing and CE courses nationwide. 100% online, self-paced, 93% completer pass rate, instant access. From $199.",
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
        <GtmGate />
        {/* Cart-link guard: ANY query param before the # on an Absorb hash
            deep-route (#/AddToCart, #/cart) empties the cart (verified — same
            failure as the old _gl bug). This strips known tracking params off
            every myabsorb.com link, defeating any tag-manager decoration.
            The click listener sits on documentElement in the CAPTURE phase so
            it runs AFTER document-level decorators and wins the race. */}
        <Script id="cart-link-guard" strategy="afterInteractive">
          {`(function(){
var BAD=['ji_vid','ji_src','_gl','_ga','_gac'];
function isCart(h){h=(h||'').toLowerCase();return h==='myabsorb.com'||h.slice(-13)==='.myabsorb.com';}
function clean(u){try{var x=new URL(u,location.href);if(!isCart(x.hostname))return u;var c=false;
for(var i=0;i<BAD.length;i++){if(x.searchParams.has(BAD[i])){x.searchParams['delete'](BAD[i]);c=true;}}
return c?x.toString():u;}catch(e){return u;}}
function sweep(){try{var as=document.getElementsByTagName('a');
for(var i=0;i<as.length;i++){var a=as[i];try{if(a.href&&isCart(a.hostname)){var c=clean(a.href);if(c!==a.href)a.href=c;}}catch(e){}}}catch(e){}}
sweep();setInterval(sweep,1500);
document.documentElement.addEventListener('click',function(ev){
try{var t=ev.target,a=t&&t.closest?t.closest('a'):null;if(a&&a.href&&isCart(a.hostname)){var c=clean(a.href);if(c!==a.href)a.href=c;}}catch(e){}},true);
})();`}
        </Script>
      </head>
      <body className="font-sans antialiased bg-white text-gray-dark min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-navy focus:font-semibold focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <main id="main-content" className="flex-grow">{children}</main>
        <Footer />
        <GhlChatWidget />
      </body>
    </html>
  );
}
