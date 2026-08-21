"use client";

import React from "react";
import type { GtmAttrs } from "@/lib/gtm-attrs";

// GA4 ecommerce "add to cart" tracking for Absorb enroll links.
//
// Why this exists: GA4 cross-domain linking (the `_gl` param) is incompatible
// with Absorb's hash-routed cart — it wedges `?_gl=…` before the `#` and the
// cart comes up empty. So cross-domain linking to myabsorb.com is disabled,
// and instead we capture the add-to-cart as a first-party dataLayer event on
// THIS domain (no cross-domain dependency). The SEO/GTM side builds a GA4
// `add_to_cart` tag off this event.
//
// Pushes on click both (a) FLAT top-level keys for easy GTM Data Layer
// Variables, and (b) a standard GA4 ecommerce object:
//   event:        "add_to_cart"
//   course_id, course_name, course_price, course_loa, course_state,
//   course_type   <- map these directly as GTM Data Layer Variables
//   ecommerce.items[0]: { item_id, item_name, item_category, item_variant,
//     price, quantity }   <- for the GA4 ecommerce tag
//
// Guard: only fires for real single-course purchase links: an Absorb
// …/#/AddToCart?CourseIds=<id> URL or the JustInsurance checkout with a valid
// `sku`. Catalog/picker/curricula links are ignored, so "Choose a Package"
// buttons don't emit a false add_to_cart.
//
// The element stays a normal <a> (target=_blank), so middle/⌘-click still
// work; the existing data-gtm-* attributes are preserved via `gtmAttrs` so
// nothing in the current GTM setup breaks during migration. Tracking errors
// never block navigation.

// GA4 event name — the contract with GTM. Change here if GTM expects another.
const ADD_TO_CART_EVENT = "add_to_cart";

// Ensure the dataLayer exists at module load (GTM also creates it, but this
// guards against a click landing before GTM's init in edge cases).
if (typeof window !== "undefined") {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
}

function extractItemId(href: string): string | null {
  const m = href.match(/CourseIds=([0-9a-fA-F-]{36})/);
  if (m) return m[1].toLowerCase();

  try {
    const url = new URL(href);
    if (url.hostname !== "justinsurance-checkout.vercel.app") return null;
    const sku = url.searchParams.get("sku");
    return sku && /^[a-z0-9-]{1,80}$/.test(sku) ? sku : null;
  } catch {
    return null;
  }
}

function parsePrice(price?: string): number | undefined {
  if (!price) return undefined;
  // Prefer a $-prefixed amount (handles "Enroll Now — $199" without picking
  // up stray digits like "2-15"); fall back to any numeric content.
  const dollar = String(price).match(/\$\s*([0-9][0-9,]*(?:\.[0-9]+)?)/);
  const raw = dollar ? dollar[1].replace(/,/g, "") : String(price).replace(/[^0-9.]/g, "");
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : undefined;
}

interface AddToCartLinkProps {
  href: string;
  /** Visible/known price string, e.g. "$199". Parsed to a number for GA4. */
  price?: string;
  state?: string;
  loa?: string;
  courseType?: string; // "prelicensing" | "continuing-education"
  /** Human course name for item_name, e.g. "Florida Life & Health Insurance". */
  itemName?: string;
  className?: string;
  children: React.ReactNode;
  /** Existing data-gtm-* attributes to preserve (from getCtaAttrs). */
  gtmAttrs?: GtmAttrs;
}

export default function AddToCartLink({
  href,
  price,
  state,
  loa,
  courseType,
  itemName,
  className,
  children,
  gtmAttrs,
}: AddToCartLinkProps) {
  function handleClick() {
    try {
      const courseId = extractItemId(href);
      if (!courseId) return; // not a real single-course cart add — don't fire
      const value = parsePrice(price);
      const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
      w.dataLayer = w.dataLayer || [];
      // Clear any prior ecommerce object so items don't merge across events.
      w.dataLayer.push({ ecommerce: null });
      w.dataLayer.push({
        event: ADD_TO_CART_EVENT,
        // Flat keys — map these 1:1 as GTM Data Layer Variables.
        course_id: courseId,
        course_name: itemName,
        course_price: value,
        course_loa: loa,
        course_state: state,
        course_type: courseType,
        // GA4 ecommerce object — for the GA4 add_to_cart tag.
        ecommerce: {
          currency: "USD",
          value,
          items: [
            {
              item_id: courseId,
              item_name: itemName,
              item_category: courseType,
              item_variant: loa,
              price: value,
              quantity: 1,
            },
          ],
        },
      });
    } catch {
      /* never let a tracking error block the enroll navigation */
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
      {...gtmAttrs}
    >
      {children}
    </a>
  );
}
