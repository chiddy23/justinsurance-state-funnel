"use client";

import { useId, useState } from "react";
import {
  LASTINGMARK_CE_CATALOGS,
} from "@/lib/lastingmark-ce-catalogs";

// State picker for the Lasting Mark CE landing page. Mirrors the client's GHL
// page: choose a state, click "Browse Courses", open that state's Absorb CE
// catalog in a new tab. Catalog URLs come from the live client page verbatim.
// useId() keeps the label/select association unique when rendered more than
// once on the same page (hero + lower section).
export default function LastingMarkStateSelect() {
  const [url, setUrl] = useState("");
  const selectId = useId();

  function browse() {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-stretch justify-center gap-3 sm:flex-row">
      <label htmlFor={selectId} className="sr-only">
        Select your state
      </label>
      <select
        id={selectId}
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
        className="rounded-lg bg-sky-400 px-6 py-3 font-semibold text-navy-dark shadow transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Browse Courses →
      </button>
    </div>
  );
}
