"use client";

import { useEffect, useRef } from "react";

/** Official Trustpilot Micro Combo TrustBox. */
export default function TrustpilotMicroCombo() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let attempts = 0;

    const loadWidget = () => {
      if (widgetRef.current && window.Trustpilot) {
        window.Trustpilot.loadFromElement(widgetRef.current, true);
        return true;
      }
      return false;
    };

    if (loadWidget()) return;

    const timer = window.setInterval(() => {
      attempts += 1;
      if (loadWidget() || attempts >= 40) window.clearInterval(timer);
    }, 250);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="w-[460px] max-w-full min-h-5" aria-label="JustInsurance reviews on Trustpilot">
      <div
        ref={widgetRef}
        className="trustpilot-widget"
        data-locale="en-US"
        data-template-id="5419b6ffb0d04a076446a9af"
        data-businessunit-id="69fada3c283c86a87547f965"
        data-style-height="20px"
        data-style-width="100%"
        data-theme="dark"
        data-token="403145ca-f445-407e-b13d-08dc737a2fbb"
      >
        <a
          href="https://www.trustpilot.com/review/justinsuranceco.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trustpilot
        </a>
      </div>
    </div>
  );
}
