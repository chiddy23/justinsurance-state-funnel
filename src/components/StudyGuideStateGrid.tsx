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
  /** Set of slugs that have matching pages on the site */
  validSlugs: Set<string>;
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function StudyGuideStateGrid({ states, validSlugs }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return states;
    return states.filter((s) => s.name.toLowerCase().includes(q));
  }, [query, states]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍  Search for your state..."
        className="w-full bg-white border-2 border-gray-200 focus:border-gold rounded-lg px-4 py-3 text-navy font-medium outline-none transition-colors mb-8"
        aria-label="Search for your state"
      />

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No states match your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((s) => {
            const slug = toSlug(s.name);
            const hasPages = validSlugs.has(slug);
            return (
              <article
                key={s.name}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <header className="mb-4 pb-4 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-navy mb-1">{s.name}</h3>
                  <p className="text-sm text-gray-600">
                    {s.admin} · {s.questions} questions · {s.time} · {s.pass} to pass
                  </p>
                </header>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gold font-semibold mb-1">
                      📚 Prelicensing
                    </p>
                    <p className="text-gray-700">{s.hours} required</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gold font-semibold mb-1">
                      📊 Exam Topics
                    </p>
                    <p className="text-gray-700">{s.topics.join(" · ")}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gold font-semibold mb-1">
                      🔁 Retake Policy
                    </p>
                    <p className="text-gray-700">{s.retake}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gold font-semibold mb-1">
                      📬 Application
                    </p>
                    <p className="text-gray-700">{s.apply}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-red-700 font-semibold mb-1">
                      ⚠️ Top 3 Failure Points
                    </p>
                    <ul className="text-gray-700 space-y-1 list-disc pl-5">
                      {s.fails.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gold font-semibold mb-1">
                      📜 Key State Law
                    </p>
                    <p className="text-gray-700">{s.law}</p>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-gold rounded-r-md p-3">
                    <p className="text-xs uppercase tracking-wide text-navy font-semibold mb-1">
                      💡 Insider Tip
                    </p>
                    <p className="text-gray-700">{s.tip}</p>
                  </div>

                  {hasPages && (
                    <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Link
                        href={`/${slug}`}
                        className="text-center bg-gray-bg hover:bg-gold/10 hover:text-gold-dark border border-gray-200 hover:border-gold text-navy font-semibold rounded-lg py-2 px-3 text-xs transition-colors"
                      >
                        {s.name} Overview
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
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
