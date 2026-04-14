"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  states: { slug: string; name: string }[];
  /** Template with {slug} placeholder, e.g. "/{slug}/practice-exam" */
  pathTemplate: string;
}

export default function StatePickerRedirect({ states, pathTemplate }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  function handleGo() {
    if (selected) router.push(pathTemplate.replace("{slug}", selected));
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
      <select
        aria-label="Select your state"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="flex-1 bg-white border-2 border-gray-200 focus:border-gold rounded-lg px-4 py-3 text-navy font-semibold outline-none transition-colors"
      >
        <option value="">Select your state...</option>
        {states.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleGo}
        disabled={!selected}
        className="bg-gold hover:bg-gold-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-dark font-bold py-3 px-8 rounded-lg transition-colors"
      >
        Continue →
      </button>
    </div>
  );
}
