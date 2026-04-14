"use client";

import { useState } from "react";
import type { PracticeQ } from "@/lib/study-guide-content";

export default function PracticeQuestionCard({ q }: { q: PracticeQ }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <header className="bg-navy text-white px-5 py-3 flex items-center justify-between">
        <span className="font-bold">{q.id.toUpperCase()}</span>
        <span className="text-gold text-xs font-semibold uppercase tracking-wide">{q.tag}</span>
      </header>
      <div className="p-5">
        <p className="text-navy font-medium mb-4 leading-relaxed">{q.text}</p>
        <ul className="space-y-2 mb-4">
          {q.options.map((opt) => {
            const isCorrect = revealed && opt.correct;
            return (
              <li
                key={opt.letter}
                className={`flex gap-3 items-start px-4 py-3 rounded-lg border text-sm ${
                  isCorrect
                    ? "bg-green-50 border-green-300 text-navy font-semibold"
                    : "bg-gray-bg border-gray-200 text-gray-700"
                }`}
              >
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? "bg-green-600 text-white" : "bg-navy text-white"}`}>
                  {opt.letter}
                </span>
                <span>
                  {opt.text}
                  {isCorrect && <span className="ml-2 text-green-700">✓</span>}
                </span>
              </li>
            );
          })}
        </ul>
        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="w-full bg-gold hover:bg-gold-dark text-gray-dark font-bold py-2.5 px-4 rounded-lg transition-colors"
          >
            Reveal Answer &amp; Explanation
          </button>
        )}
        {revealed && (
          <div className="bg-green-50 border-l-4 border-green-600 rounded-r-md p-4 text-sm">
            <p className="font-bold text-green-800 mb-1">✓ Correct Answer: {q.answer}</p>
            <p className="text-gray-700 leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>
    </article>
  );
}
