import Script from "next/script";

const WIDGET_ID = "6a86f09007754ad08ad3501e";

/**
 * Sitewide floating support chat.
 *
 * Load the widget directly from the application rather than through GTM so
 * there is one auditable installation and no risk of the loader running twice.
 * `afterInteractive` keeps it out of the server-rendered critical path while
 * ensuring the support bubble is not held up by another slow third-party load.
 */
export default function GhlChatWidget() {
  return (
    <Script
      id="ghl-support-chat"
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id={WIDGET_ID}
      strategy="afterInteractive"
    />
  );
}
