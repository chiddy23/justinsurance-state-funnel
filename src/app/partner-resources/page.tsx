"use client";

import React, { useState } from "react";
import Link from "next/link";

const VIDEOS = [
  {
    id: "GvOwVZCh67c",
    title: "Day 1 Call",
    description: "What to expect on your first day as a JustInsurance partner. We walk through the onboarding process, set expectations, and get your agency started.",
    category: "Getting Started",
  },
  {
    id: "0pQ4NZklyzo",
    title: "Absorb Dashboard Walkthrough",
    description: "Full walkthrough of the agency dashboard — track enrollments, monitor progress, view completions, and manage your recruits in real time.",
    category: "Getting Started",
  },
  {
    id: "MPMfm4IJYyU",
    title: "Licensed To Launch System",
    description: "Our end-to-end system for taking a recruit from zero to licensed. Covers the full pipeline: enrollment, study plan, exam prep, and post-exam steps.",
    category: "Systems & Strategy",
  },
  {
    id: "AJdHNlx5utI",
    title: "Communication Best Practices",
    description: "How to communicate effectively with your recruits throughout the licensing process. Timing, tone, and the messages that keep candidates on track.",
    category: "Systems & Strategy",
  },
  {
    id: "BN3GvN1_9QA",
    title: "What To Do If A Candidate Fails",
    description: "A candidate failed their exam — now what? How to handle the conversation, rebuild confidence, and get them back on track for a retake.",
    category: "Systems & Strategy",
  },
  {
    id: "aK-hPCE6qpw",
    title: "How To Contact Our Team",
    description: "The fastest ways to reach JustInsurance support for partner-level issues. Who to contact, when, and what information to have ready.",
    category: "Support",
  },
  {
    id: "pZyvz2UAh8A",
    title: "Candidate Experience",
    description: "What your recruits see from their side — the enrollment flow, course interface, practice exams, and certificate delivery. Share this with new hires.",
    category: "For Your Recruits",
  },
  {
    id: "KcA7vw_S3zo",
    title: "How To Study Effectively",
    description: "Study strategies that work for the insurance licensing exam. Send this to recruits who need a structured approach to their coursework.",
    category: "For Your Recruits",
  },
  {
    id: "pOzZH75Nn0w",
    title: "Exam Day Expectations",
    description: "Everything your recruits need to know before exam day — what to bring, what to expect, how the test works, and how to stay calm under pressure.",
    category: "For Your Recruits",
  },
];

const CATEGORIES = [
  "All",
  "Getting Started",
  "Systems & Strategy",
  "Support",
  "For Your Recruits",
];

function VideoCard({
  video,
  onPlay,
}: {
  video: (typeof VIDEOS)[0];
  onPlay: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <button
        onClick={() => onPlay(video.id)}
        className="relative w-full cursor-pointer group"
        style={{ aspectRatio: "16/9" }}
        aria-label={`Play: ${video.title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>
      <div className="p-5">
        <span className="text-xs font-semibold text-gold uppercase tracking-wide">
          {video.category}
        </span>
        <h3 className="font-bold text-navy mt-1 mb-2 text-base leading-snug">
          {video.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {video.description}
        </p>
      </div>
    </div>
  );
}

export default function PartnerResourcesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filtered =
    activeFilter === "All"
      ? VIDEOS
      : VIDEOS.filter((v) => v.category === activeFilter);

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-200 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li className="flex items-center gap-1">
              <Link href="/" className="hover:text-navy hover:underline transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/partners" className="hover:text-navy hover:underline transition-colors">
                Partners
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-navy font-medium">Resources</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Partner Resources
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Training Videos for Partner Agencies
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            Everything you need to onboard recruits, use the dashboard, and get your
            candidates licensed faster. Share the recruit-facing videos directly with
            your team.
          </p>
        </div>
      </section>

      {/* Video Player Modal */}
      {playingId && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPlayingId(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPlayingId(null)}
              className="absolute -top-10 right-0 text-white hover:text-gold text-sm font-semibold"
            >
              Close &times;
            </button>
            <div style={{ aspectRatio: "16/9" }} className="rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${playingId}?autoplay=1&rel=0`}
                title="Partner Resource Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter + Grid */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeFilter === cat
                    ? "bg-navy text-white"
                    : "bg-gray-bg text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={setPlayingId} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
            Not a Partner Yet?
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Apply for the agency partnership program and get access to dashboards,
            bulk pricing, and dedicated support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/partners"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-8 py-3 rounded-lg shadow-lg transition-all"
            >
              Apply to Partner
            </Link>
            <a
              href="tel:7542239744"
              className="inline-block bg-white border-2 border-navy text-navy font-bold text-lg px-8 py-3 rounded-lg hover:bg-navy hover:text-white transition-colors"
            >
              Call 754-223-9744
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
