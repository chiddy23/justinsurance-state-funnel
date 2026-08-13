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
    <>
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
    {/* Microsoft Clarity (project y1rxfr87ic) — behavioral analytics: session
        recordings + heatmaps. Loaded here so it inherits GtmGate's route gate
        (never on /certificate/ PII pages) AND an opt-out consistent with the
        privacy policy: Clarity has no Google Consent Mode hook, so we skip the
        load entirely for Global Privacy Control browsers (mirrors the GPC
        analytics_storage:'denied' default the GTM bootstrap above sets).
        afterInteractive keeps it off the critical rendering path.

        RECORDING BRIDGE (2026-08-13): after loading, stamp the _ga client-id
        (== the GA4 user_pseudo_id on web) onto the Clarity session via identify()
        + a ga_client_id custom tag, so a pseudonymous journey in the analytics
        dashboard can be matched to that user's exact Clarity recording. Polls for
        the _ga cookie (GA/GTM also load afterInteractive) up to 10s, then stops.
        Cookie is parsed by split (no regex) to avoid template-literal escaping. */}
    <Script id="ms-clarity" strategy="afterInteractive">
      {`if(!navigator.globalPrivacyControl){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","y1rxfr87ic");(function(){function ck(n){var p=("; "+document.cookie).split("; "+n+"=");return p.length<2?null:p.pop().split(";").shift();}function gid(){var v=(ck("_ga")||"").split(".");return v.length>=4?v[2]+"."+v[3]:null;}function cuid(){var c=ck("_clck");if(!c)return null;var s=decodeURIComponent(c).split("^")[0];return /^[a-z0-9]{4,12}$/i.test(s)?s:null;}var stamped=false,sent=false,n=0,h=setInterval(function(){n++;var id=gid();if(id&&window.clarity&&!stamped){window.clarity("identify",id,undefined,undefined,id);window.clarity("set","ga_client_id",id);stamped=true;}if(id&&!sent){var cu=cuid();if(cu){sent=true;try{if(localStorage.getItem("ci_map_"+cu)!==id){var k=ck("_clsk");var ss=k?decodeURIComponent(k).split("^")[0]:"";fetch("https://justinsurance-dashboard.vercel.app/api/clarity-map",{method:"POST",keepalive:true,headers:{"Content-Type":"text/plain"},body:JSON.stringify({ga:id,clarity:cu,sess:ss,clck:ck("_clck")})}).catch(function(){});localStorage.setItem("ci_map_"+cu,id);}}catch(e){}}}if((stamped&&sent)||n>30){clearInterval(h);}},500);})();}`}
    </Script>
    </>
  );
}
