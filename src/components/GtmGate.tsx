"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

// GA4 (G-MTQQ0C7DKL) is now fired exclusively by GTM (Configuration tag).
// Direct <GoogleAnalytics> removed 2026-05-01 after SEO team confirmed
// GTM-injected GA4 was flowing pageviews. Single source of truth via GTM.
const GTM_ID = "GTM-PV25B4HX";

// Certificate pages carry student PII (firstName/lastName/email) on their
// query string, decoded from the Absorb iframe embed. GTM must never load
// there — a Configuration/pageview tag would otherwise ship that PII-bearing
// URL straight into GA4. Route-gate the GTM bootstrap script on the pathname
// instead of loading it globally from the root layout.
//
// The GTM <noscript> fallback (the ns.html iframe) intentionally stays in
// layout.tsx, ungated. It never carries the page URL or query string — the
// iframe src is a fixed GTM-id URL and, being cross-origin, can't read the
// parent document's location — so it isn't part of the PII leak vector this
// gate exists for. It's also not gateable from here without putting an
// <iframe> inside a <head>-scoped <noscript>, which is invalid HTML (the
// spec limits head-noscript content to metadata elements).
function isCertificatePath(pathname: string | null): boolean {
  return !!pathname && pathname.startsWith("/certificate/");
}

export default function GtmGate() {
  const pathname = usePathname();
  if (isCertificatePath(pathname)) return null;

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];
// Privacy audit 2026-07-14 (PRIV-01): honor Global Privacy Control before GTM
// boots — the privacy policy promises GPC is treated as an opt-out of
// sharing/targeted advertising. Consent Mode v2 defaults: deny ad-side
// storage/signals for GPC browsers (analytics stays aggregate).
function g(){w[l].push(arguments);}
if (navigator.globalPrivacyControl) {
  g('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
} else {
  g('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
}
w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}
