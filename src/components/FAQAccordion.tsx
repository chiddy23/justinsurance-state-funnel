import React from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
  heading?: string;
}

export default function FAQAccordion({ faqs, heading = "Frequently Asked Questions" }: FAQAccordionProps) {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
          {heading}
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border border-gray-200 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none bg-white hover:bg-gray-bg transition-colors select-none">
                <span className="font-semibold text-navy text-sm md:text-base leading-snug">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-bg flex items-center justify-center text-navy group-open:rotate-45 transition-transform duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 pt-1 bg-gray-bg border-t border-gray-200">
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
