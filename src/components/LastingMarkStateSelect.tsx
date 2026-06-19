"use client";

import { useState } from "react";
import {
  LASTINGMARK_CE_CATALOGS,
} from "@/lib/lastingmark-ce-catalogs";

// State picker for the Lasting Mark CE landing page. Mirrors the client's GHL
// page: choose a state, click "Browse Courses", open that state's Absorb CE
// catalog in a new tab. Catalog URLs come from the live client page verbatim.
export default function LastingMarkStateSelect() {
  const [url, setUrl] = useState("");

  function browse() {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-stretch justify-center gap-3 sm:flex-row">
      <label htmlFor="lm-state" className="sr-only">
        Select your state
      </label>
      <select
        id="lm-state"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="min-w-[220px] flex-1 rounded-lg border border-white/30 bg-white px-4 py-3 text-gray-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        <option value="">-- Select Your State --</option>
        {LASTINGMARK_CE_CATALOGS.map((s) => (
          <option key={s.name} value={s.url}>
            {s.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={browse}
        disabled={!url}
        className="rounded-lg bg-sky-500 px-6 py-3 font-semibold text-white shadow transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Browse Courses →
      </button>
    </div>
  );
}
