"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Product = "practice" | "prelicensing";
type LicenseType = "life" | "health" | "life-and-health";

type CheckoutOption = {
  url: string;
  available: boolean;
};

export type LiveStateOption = {
  slug: string;
  name: string;
  abbreviation: string;
  practice: Record<LicenseType, CheckoutOption>;
  prelicensing: Record<LicenseType, CheckoutOption>;
};

const LICENSE_LABELS: Record<LicenseType, string> = {
  life: "Life",
  health: "Health",
  "life-and-health": "Life & Health",
};

const PRODUCT_DETAILS = {
  practice: {
    label: "Practice exam",
    price: "$59",
    description: "State-specific questions, scoring, explanations, and unlimited retakes.",
  },
  prelicensing: {
    label: "Complete course",
    price: "$199",
    description: "Structured lessons and quizzes, with practice exams included.",
  },
} as const;

function pushEvent(event: string, values: Record<string, unknown>) {
  try {
    const browserWindow = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>;
    };
    browserWindow.dataLayer = browserWindow.dataLayer || [];
    browserWindow.dataLayer.push({ event, ...values });
  } catch {
    // Tracking must never interrupt the purchase path.
  }
}

export default function LiveCourseSelector({ states }: { states: LiveStateOption[] }) {
  const searchParams = useSearchParams();
  const landingTracked = useRef(false);
  const [product, setProduct] = useState<Product>("practice");
  const [stateSlug, setStateSlug] = useState("");
  const [licenseType, setLicenseType] = useState<LicenseType | "">("");

  const selectedState = states.find((state) => state.slug === stateSlug);
  const availableLicenses = useMemo(() => {
    if (!selectedState) return [];
    return (Object.keys(LICENSE_LABELS) as LicenseType[]).filter(
      (line) => selectedState[product][line].available,
    );
  }, [product, selectedState]);

  useEffect(() => {
    if (landingTracked.current) return;
    landingTracked.current = true;
    pushEvent("live_landing_view", {
      live_source: searchParams.get("utm_source") || "",
      live_medium: searchParams.get("utm_medium") || "",
      live_campaign: searchParams.get("utm_campaign") || "",
      live_content: searchParams.get("utm_content") || "",
    });
  }, [searchParams]);

  const checkoutUrl = useMemo(() => {
    if (!selectedState || !licenseType) return "";
    const option = selectedState[product][licenseType];
    if (!option.available || !option.url) return "";
    const url = new URL(option.url);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const value = searchParams.get(key);
      if (value) url.searchParams.set(key, value);
    }
    url.searchParams.set("ji_landing", "/live");
    return url.toString();
  }, [licenseType, product, searchParams, selectedState]);

  function selectProduct(nextProduct: Product) {
    setProduct(nextProduct);
    setLicenseType("");
    pushEvent("live_product_selected", { live_product: nextProduct });
  }

  function selectState(nextState: string) {
    setStateSlug(nextState);
    setLicenseType("");
    const state = states.find((item) => item.slug === nextState);
    pushEvent("live_state_selected", {
      live_product: product,
      course_state: state?.name || "",
    });
  }

  function selectLicense(nextLicense: LicenseType | "") {
    setLicenseType(nextLicense);
    if (!nextLicense || !selectedState) return;
    pushEvent("live_license_selected", {
      live_product: product,
      course_state: selectedState.name,
      course_loa: nextLicense,
    });
  }

  function trackCheckout() {
    if (!selectedState || !licenseType || !checkoutUrl) return;
    const details = PRODUCT_DETAILS[product];
    const itemId = new URL(checkoutUrl).searchParams.get("sku") || "";
    pushEvent("add_to_cart", {
      course_id: itemId,
      course_name: `${selectedState.name} ${LICENSE_LABELS[licenseType]} ${details.label}`,
      course_price: Number(details.price.replace("$", "")),
      course_loa: licenseType,
      course_state: selectedState.name,
      course_type: product,
      ecommerce: {
        currency: "USD",
        value: Number(details.price.replace("$", "")),
        items: [
          {
            item_id: itemId,
            item_name: `${selectedState.name} ${LICENSE_LABELS[licenseType]} ${details.label}`,
            item_category: product,
            item_variant: licenseType,
            price: Number(details.price.replace("$", "")),
            quantity: 1,
          },
        ],
      },
    });
  }

  const buttonLabel =
    product === "practice" ? "Start my practice exam — $59" : "Enroll in the complete course — $199";

  return (
    <div className="rounded-2xl bg-white p-4 text-left shadow-2xl shadow-black/20 sm:p-6">
      <fieldset>
        <legend className="mb-3 text-sm font-bold uppercase tracking-wide text-navy">
          1. Choose your study option
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(PRODUCT_DETAILS) as Product[]).map((key) => {
            const details = PRODUCT_DETAILS[key];
            const selected = product === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => selectProduct(key)}
                className={`relative rounded-xl border-2 p-3 text-left transition sm:p-4 ${
                  selected
                    ? "border-gold bg-amber-50 ring-2 ring-gold/20"
                    : "border-gray-200 bg-white hover:border-navy/30"
                }`}
              >
                {key === "practice" && (
                  <span className="absolute -top-2.5 left-2 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-gray-dark">
                    <span className="sm:hidden">Most popular</span>
                    <span className="hidden sm:inline">Most popular live offer</span>
                  </span>
                )}
                <span className="mt-4 block text-base font-bold text-navy sm:mt-1">
                  {details.label}
                </span>
                <span className="block text-2xl font-extrabold text-navy">{details.price}</span>
                <span className="mt-1 hidden text-sm leading-snug text-gray-600 sm:block">
                  {details.description}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:hidden">
          {PRODUCT_DETAILS[product].description}
        </p>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-navy">2. Which state are you testing in?</span>
          <select
            value={stateSlug}
            onChange={(event) => selectState(event.target.value)}
            className="min-h-12 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2.5 font-semibold text-navy outline-none transition focus:border-gold"
          >
            <option value="">Select your state</option>
            {states.map((state) => (
              <option key={state.slug} value={state.slug}>
                {state.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-navy">3. Which license are you studying for?</span>
          <select
            value={licenseType}
            disabled={!selectedState}
            onChange={(event) => selectLicense(event.target.value as LicenseType | "")}
            className="min-h-12 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2.5 font-semibold text-navy outline-none transition focus:border-gold disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">{selectedState ? "Select license type" : "Select a state first"}</option>
            {availableLicenses.map((line) => (
              <option key={line} value={line}>
                {LICENSE_LABELS[line]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedState && availableLicenses.length === 0 && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This option is not currently available in {selectedState.name}. Choose the other study option or contact us for help.
        </p>
      )}

      <a
        href={checkoutUrl || undefined}
        aria-disabled={!checkoutUrl}
        onClick={trackCheckout}
        className={`mt-5 flex min-h-14 w-full items-center justify-center rounded-xl px-5 text-center text-base font-extrabold transition sm:text-lg ${
          checkoutUrl
            ? "bg-gold text-gray-dark shadow-md hover:bg-gold-dark"
            : "pointer-events-none bg-gray-200 text-gray-500"
        }`}
      >
        {checkoutUrl ? buttonLabel : "Choose your state and license type"}
      </a>

      <p className="mt-3 text-center text-xs leading-relaxed text-gray-500">
        Secure checkout · instant access after purchase · the complete course includes practice exams
      </p>
    </div>
  );
}
