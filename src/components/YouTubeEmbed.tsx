"use client";

import React, { useState } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="bg-gray-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-navy mb-4">
          Video: {title}
        </h2>
        <div
          className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm"
          style={{ aspectRatio: "16/9" }}
        >
          {loaded ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <button
              onClick={() => setLoaded(true)}
              className="absolute inset-0 w-full h-full cursor-pointer group"
              aria-label={`Play video: ${title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-gray-500 text-xs">
            From the{" "}
            <a
              href="https://www.youtube.com/@InsuranceExam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy hover:text-gold underline"
            >
              Insurance Exam Prep
            </a>{" "}
            YouTube channel
          </p>
          <a
            href="https://www.youtube.com/@InsuranceExam?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-600 hover:text-red-700 font-semibold"
          >
            Subscribe &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
