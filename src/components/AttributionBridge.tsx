"use client";

import { useEffect } from "react";

const VISITOR_KEY = "ji_vid";
const ATTRIBUTION_KEY = "ji_attribution_v1";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type Attribution = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  landing: string;
  aiSource: string;
  capturedAt: number;
};

const AI_SOURCES: Array<[RegExp, string]> = [
  [/(^|\.)(chatgpt\.com|chat\.openai\.com)$/i, "chatgpt"],
  [/(^|\.)perplexity\.ai$/i, "perplexity"],
  [/(^|\.)gemini\.google\.com$/i, "gemini"],
  [/(^|\.)copilot\.microsoft\.com$/i, "microsoft-copilot"],
  [/(^|\.)claude\.ai$/i, "claude"],
  [/(^|\.)meta\.ai$/i, "meta-ai"],
  [/(^|\.)grok\.com$/i, "grok"],
  [/(^|\.)poe\.com$/i, "poe"],
  [/(^|\.)you\.com$/i, "you-com"],
  [/(^|\.)phind\.com$/i, "phind"],
];

function clean(value: string | null | undefined, max: number): string {
  return String(value || "")
    .trim()
    .replace(/[\u0000-\u001f\u007f<>"']/g, "")
    .slice(0, max);
}

function canonicalAiSource(value: string): string {
  const normalized = clean(value, 100).toLowerCase().replace(/^www\./, "");
  for (const [pattern, label] of AI_SOURCES) {
    if (pattern.test(normalized)) return label;
  }
  return "";
}

function uuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getVisitorId(): string {
  const cookieMatch = document.cookie.match(/(?:^|;\s*)ji_vid=([^;]+)/);
  const fromCookie = cookieMatch ? decodeURIComponent(cookieMatch[1]) : "";
  const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const id = valid.test(fromCookie) ? fromCookie.toLowerCase() : uuid();
  document.cookie = `${VISITOR_KEY}=${encodeURIComponent(id)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax; Secure`;
  return id;
}

function sourceFromLanding(): Attribution | null {
  const params = new URLSearchParams(window.location.search);
  const campaign = clean(params.get("utm_campaign"), 100);
  const content = clean(params.get("utm_content"), 100);
  const term = clean(params.get("utm_term"), 100);
  let source = clean(params.get("utm_source"), 100).toLowerCase();
  let medium = clean(params.get("utm_medium"), 50).toLowerCase();

  if (!source && params.get("gclid")) {
    source = "google";
    medium = "cpc";
  } else if (!source && params.get("fbclid")) {
    source = "facebook";
    medium = "paid-social";
  } else if (!source && params.get("msclkid")) {
    source = "bing";
    medium = "cpc";
  }

  if (!source && document.referrer) {
    try {
      const referrer = new URL(document.referrer);
      const refHost = referrer.hostname.toLowerCase().replace(/^www\./, "");
      const currentHost = window.location.hostname.toLowerCase().replace(/^www\./, "");
      if (refHost !== currentHost) {
        source = refHost;
        medium = "referral";
      }
    } catch {
      // Ignore malformed or browser-redacted referrers.
    }
  }

  if (!source) return null;
  const aiSource = canonicalAiSource(source);
  if (aiSource) {
    source = aiSource;
    medium = "ai-referral";
  }
  return {
    source,
    medium: medium || "(none)",
    campaign,
    content,
    term,
    landing: clean(window.location.pathname, 180),
    aiSource,
    capturedAt: Date.now(),
  };
}

function readStoredAttribution(): Attribution | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "null") as Attribution | null;
    if (!parsed || Date.now() - Number(parsed.capturedAt || 0) > MAX_AGE_SECONDS * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

function isCheckoutLink(url: URL): boolean {
  return (
    url.hostname === "checkout.justinsuranceco.com" ||
    url.hostname === "justinsurance-checkout.vercel.app" ||
    (/^justinsurance-checkout[-a-z0-9]*\.vercel\.app$/i.test(url.hostname))
  );
}

/**
 * Keeps privacy-safe first-party attribution attached to checkout purchases.
 * It changes only checkout query parameters at navigation time; page content,
 * canonicals, internal links, and every SEO-facing URL remain unchanged.
 */
export default function AttributionBridge() {
  useEffect(() => {
    if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;

    const visitorId = getVisitorId();
    const landingAttribution = sourceFromLanding();
    let attribution = readStoredAttribution();

    // Standard last-non-direct attribution. Retain a prior AI touch separately
    // so the dashboard can also report AI-assisted purchases.
    if (landingAttribution) {
      if (!landingAttribution.aiSource && attribution?.aiSource) {
        landingAttribution.aiSource = attribution.aiSource;
      }
      attribution = landingAttribution;
      try {
        localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
      } catch {
        // Storage may be blocked; visitor-id linking still works via the cookie.
      }
    }

    const decorate = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      try {
        const url = new URL(anchor.href, window.location.href);
        if (!isCheckoutLink(url)) return;
        url.searchParams.set("ji_vid", visitorId);
        if (attribution) {
          url.searchParams.set("ji_source", clean(attribution.source, 100));
          url.searchParams.set("ji_medium", clean(attribution.medium, 50));
          if (attribution.campaign) url.searchParams.set("ji_campaign", clean(attribution.campaign, 100));
          if (attribution.content) url.searchParams.set("ji_content", clean(attribution.content, 100));
          if (attribution.term) url.searchParams.set("ji_term", clean(attribution.term, 100));
          if (attribution.landing) url.searchParams.set("ji_landing", clean(attribution.landing, 180));
          if (attribution.aiSource) url.searchParams.set("ji_ai_source", clean(attribution.aiSource, 40));
        }
        anchor.href = url.toString();
      } catch {
        // Attribution must never block checkout navigation.
      }
    };

    document.documentElement.addEventListener("pointerdown", decorate, true);
    document.documentElement.addEventListener("click", decorate, true);
    return () => {
      document.documentElement.removeEventListener("pointerdown", decorate, true);
      document.documentElement.removeEventListener("click", decorate, true);
    };
  }, []);

  return null;
}
