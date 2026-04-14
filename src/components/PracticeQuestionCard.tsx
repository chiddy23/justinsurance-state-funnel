"use client";

import { useState } from "react";
import type { PracticeQ } from "@/lib/study-guide-content";

export default function PracticeQuestionCard({ q }: { q: PracticeQ }) {
  const [selected, setSelected] = useState<string | null>(null);

  const correctLetter = q.options.find((o) => o.correct)?.letter;
  const isAnswered = selected !== null;
  const userWasCorrect = selected === correctLetter;

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
            const isSelected = selected === opt.letter;
            const isCorrect = opt.letter === correctLetter;

            let style = "bg-gray-bg border-gray-200 text-gray-700 hover:bg-gold/10 hover:border-gold cursor-pointer";
            let letterStyle = "bg-navy text-white";
            let rightIcon: React.ReactNode = null;

            if (isAnswered) {
              style = "cursor-default";
              if (isCorrect) {
                style += " bg-green-50 border-green-300 text-navy font-semibold";
                letterStyle = "bg-green-600 text-white";
                rightIcon = <span className="ml-auto text-green-700 font-bold">✓</span>;
              } else if (isSelected) {
                style += " bg-red-50 border-red-300 text-navy";
                letterStyle = "bg-red-600 text-white";
                rightIcon = <span className="ml-auto text-red-700 font-bold">✗</span>;
              } else {
                style += " bg-gray-bg border-gray-200 text-gray-500 opacity-60";
              }
            }

            return (
              <li key={opt.letter}>
                <button
                  type="button"
                  onClick={() => !isAnswered && setSelected(opt.letter)}
                  disabled={isAnswered}
                  className={`w-full flex gap-3 items-center px-4 py-3 rounded-lg border text-sm text-left transition-colors ${style}`}
                >
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${letterStyle}`}
                  >
                    {opt.letter}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                  {rightIcon}
                </button>
              </li>
            );
          })}
        </ul>

        {!isAnswered && (
          <p className="text-gray-500 text-xs text-center italic">
            Tap an answer to check your work
          </p>
        )}

        {isAnswered && (
          <div
            className={`border-l-4 rounded-r-md p-4 text-sm ${
              userWasCorrect
                ? "bg-green-50 border-green-600"
                : "bg-amber-50 border-gold"
            }`}
          >
            <p
              className={`font-bold mb-1 ${
                userWasCorrect ? "text-green-800" : "text-navy"
              }`}
            >
              {userWasCorrect
                ? `✓ Correct! — ${q.answer}`
                : `✗ Not quite. Correct answer: ${q.answer}`}
            </p>
            <p className="text-gray-700 leading-relaxed">{q.explanation}</p>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-3 text-gold-dark hover:text-gold text-xs font-semibold underline"
            >
              Try again →
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
