"use client";

import { useEffect, useRef } from "react";

/** Official Trustpilot Mini TrustBox for larger social-proof sections. */
export default function TrustpilotMini() {
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
    <div className="w-full min-h-[150px]" aria-label="JustInsurance rating on Trustpilot">
      <div
        ref={widgetRef}
        className="trustpilot-widget"
        data-locale="en-US"
        data-template-id="53aa8807dec7e10d38f59f32"
        data-businessunit-id="69fada3c283c86a87547f965"
        data-style-height="150px"
        data-style-width="100%"
        data-token="069b72b0-d140-4783-b8c6-4263c53e947f"
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
