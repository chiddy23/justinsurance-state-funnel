"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface StateData {
  name: string;
  admin: string;
  questions: number;
  time: string;
  pass: string;
  hours: string;
  topics: string[];
  retake: string;
  apply: string;
  fails: string[];
  law: string;
  tip: string;
}

interface Props {
  states: StateData[];
  validSlugs: Set<string>;
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function StateCard({
  state,
  hasPages,
  isOpen,
  onToggle,
}: {
  state: StateData;
  hasPages: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const slug = toSlug(state.name);

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <h3 className="m-0">
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className={`w-full flex items-center justify-between px-5 py-4 text-left font-bold text-lg transition-colors ${
            isOpen
              ? "bg-gold/10 border-b border-gold/30 text-navy"
              : "bg-navy hover:bg-navy-light text-white"
          }`}
        >
          <span>{state.name}</span>
          <span
            className={`text-xl transition-transform duration-200 ${
              isOpen ? "rotate-180 text-gold-dark" : "text-gold"
            }`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>
      </h3>

      {/* Always-visible overview stats (even when closed) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-5 py-4 bg-gray-bg/50 text-sm">
        {[
          { label: "Exam Provider", val: state.admin },
          { label: "Questions", val: state.questions.toString() },
          { label: "Time Limit", val: state.time },
          { label: "Passing Score", val: state.pass },
          { label: "Pre-Licensing", val: state.hours },
          { label: "Retake Policy", val: state.retake },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-xs uppercase tracking-wide text-gold-dark font-semibold mb-0.5">
              {s.label}
            </p>
            <p className="text-navy font-semibold leading-tight">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Expanded detail */}
      {isOpen && (
        <div className="px-5 py-5 space-y-5 text-sm">
          <div>
            <p className="font-bold text-navy mb-2">📊 Exam Topics</p>
            <div className="flex flex-wrap gap-2">
              {state.topics.map((t) => (
                <span
                  key={t}
                  className="bg-gold/15 text-gold-dark text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-bold text-navy mb-2">❌ Top 3 Things Students Fail On</p>
            <ul className="text-gray-700 space-y-1.5 list-disc pl-5">
              {state.fails.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold text-navy mb-2">⚖️ State-Specific Law You Must Know</p>
            <div className="bg-gray-bg border-l-4 border-navy rounded-r-md p-3 text-gray-700 leading-relaxed">
              {state.law}
            </div>
          </div>

          <div>
            <p className="font-bold text-navy mb-2">💡 Insider Tip</p>
            <div className="bg-amber-50 border-l-4 border-gold rounded-r-md p-3 text-gray-700 leading-relaxed">
              {state.tip}
            </div>
          </div>

          <div>
            <p className="font-bold text-navy mb-2">📋 License Application</p>
            <p className="text-gray-700">{state.apply}</p>
          </div>

          {hasPages && (
            <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href={`/${slug}`}
                className="text-center bg-gray-bg hover:bg-gold/10 hover:text-gold-dark border border-gray-200 hover:border-gold text-navy font-semibold rounded-lg py-2 px-3 text-xs transition-colors"
              >
                {state.name} Overview
              </Link>
              <Link
                href={`/${slug}/prelicensing`}
                className="text-center bg-gray-bg hover:bg-gold/10 hover:text-gold-dark border border-gray-200 hover:border-gold text-navy font-semibold rounded-lg py-2 px-3 text-xs transition-colors"
              >
                Prelicensing Course
              </Link>
              <Link
                href={`/${slug}/practice-exam`}
                className="text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold rounded-lg py-2 px-3 text-xs transition-colors"
              >
                Practice Exam — $59
              </Link>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function StudyGuideStateGrid({ states, validSlugs }: Props) {
  const [query, setQuery] = useState("");
  const [openState, setOpenState] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return states;
    return states.filter((s) => s.name.toLowerCase().includes(q));
  }, [query, states]);

  return (
    <div>
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍  Search for your state..."
          className="w-full bg-white border-2 border-gray-200 focus:border-gold rounded-lg pl-4 pr-4 py-3 text-navy font-medium outline-none transition-colors"
          aria-label="Search for your state"
        />
      </div>

      <p className="text-gray-500 text-sm mb-4 text-center">
        Complete exam details for all 51 jurisdictions — click any state to expand.
      </p>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No states match your search.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <StateCard
              key={s.name}
              state={s}
              hasPages={validSlugs.has(toSlug(s.name))}
              isOpen={openState === s.name}
              onToggle={() => setOpenState(openState === s.name ? null : s.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
