"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (element: HTMLElement, forceReload?: boolean) => void;
    };
  }
}

/**
 * Official Trustpilot Micro TrustScore TrustBox.
 *
 * The global Trustpilot bootstrap script is loaded once from the root layout.
 * Calling loadFromElement also makes the widget reliable after client-side
 * Next.js navigation, when Trustpilot's initial page scan has already run.
 */
export default function TrustpilotMicroTrustScore() {
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
    <div className="w-[280px] max-w-full min-h-5" aria-label="JustInsurance reviews on Trustpilot">
      <div
        ref={widgetRef}
        className="trustpilot-widget"
        data-locale="en-US"
        data-template-id="5419b637fa0340045cd0c936"
        data-businessunit-id="69fada3c283c86a87547f965"
        data-style-height="20px"
        data-style-width="100%"
        data-token="e8d95fbf-0119-4a3c-8139-73e6089087ed"
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
