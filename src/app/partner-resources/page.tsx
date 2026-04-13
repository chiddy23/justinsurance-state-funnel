"use client";

import React, { useState } from "react";
import Link from "next/link";

// ── Video data ──
const PARTNER_VIDEOS = [
  { id: "GvOwVZCh67c", title: "How To Run the Day 1 Call", desc: "The script and framework for your first call with a new candidate \u2014 questions to ask, how to set the timeline, how to create urgency." },
  { id: "0pQ4NZklyzo", title: "Absorb Dashboard Walkthrough", desc: "How to log in, find your users, and read the data that tells you who\u2019s on track and who needs intervention." },
  { id: "MPMfm4IJYyU", title: "Licensed To Launch Dashboard", desc: "How to use our pipeline system to see candidates by exam date, spot red flags, and know exactly when to follow up." },
  { id: "AJdHNlx5utI", title: "Communication Best Practices", desc: "The follow-up cadence that works \u2014 when to call, when to text, and how to hold candidates accountable." },
  { id: "BN3GvN1_9QA", title: "What To Do When a Candidate Fails", desc: "How to have the conversation, diagnose what went wrong, get them rebooked, and request a custom retake study plan." },
  { id: "aK-hPCE6qpw", title: "How To Contact Our Team", desc: "Every way to reach JustInsurance support \u2014 for questions, escalations, report cards, or custom study plans." },
];

const CANDIDATE_VIDEOS = [
  { id: "pZyvz2UAh8A", title: "The Candidate Experience", desc: "Everything your candidate sees from enrollment through exam day \u2014 the platform, coursework, practice exams, and our support texts." },
  { id: "KcA7vw_S3zo", title: "How To Study Effectively", desc: "The right order to go through the material, when to start practice exams, and how to hit the benchmarks." },
  { id: "pOzZH75Nn0w", title: "What To Expect on Exam Day", desc: "Where to go, what to bring, what the testing center looks like, and how the exam is structured." },
];

function VideoCard({ id, title, desc, onPlay }: { id: string; title: string; desc: string; onPlay: (id: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <button onClick={() => onPlay(id)} className="relative w-full cursor-pointer group" style={{ aspectRatio: "16/9" }} aria-label={`Play: ${title}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </button>
      <div className="p-5">
        <h3 className="font-bold text-navy mb-2 text-base">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function PartnerResourcesPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-200 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li className="flex items-center gap-1">
              <Link href="/" className="hover:text-navy hover:underline">Home</Link>
            </li>
            <li className="flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <Link href="/partners" className="hover:text-navy hover:underline">Partners</Link>
            </li>
            <li className="flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <span className="text-navy font-medium">Resources</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">Agency Partner Guide</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Get Them Licensed. The First Time.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
            The playbook your team needs to turn enrollments into passes. Videos, benchmarks, follow-up cadence, and the mistakes to avoid.
          </p>
        </div>
      </section>

      {/* Video Modal */}
      {playingId && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPlayingId(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPlayingId(null)} className="absolute -top-10 right-0 text-white hover:text-gold text-sm font-semibold">Close &times;</button>
            <div style={{ aspectRatio: "16/9" }} className="rounded-xl overflow-hidden">
              <iframe src={`https://www.youtube-nocookie.com/embed/${playingId}?autoplay=1&rel=0`} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
            </div>
          </div>
        </div>
      )}

      {/* ── TRAINING VIDEOS ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">Training Videos</h2>
          <p className="text-gray-500 mb-10">Short, focused walkthroughs. Watch all of them before your first enrollment.</p>

          <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gold rounded-full" /> For You (The Partner)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {PARTNER_VIDEOS.map((v) => (
              <VideoCard key={v.id} id={v.id} title={v.title} desc={v.desc} onPlay={setPlayingId} />
            ))}
          </div>

          <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gold rounded-full" /> Send These to Your Candidates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANDIDATE_VIDEOS.map((v) => (
              <VideoCard key={v.id} id={v.id} title={v.title} desc={v.desc} onPlay={setPlayingId} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDY BENCHMARKS ── */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">Study Benchmarks</h2>
          <p className="text-gray-500 mb-8">The numbers that predict a pass. If your candidates hit these targets, they pass.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { val: "30 hrs", label: "Life & Health combined" },
              { val: "20 hrs", label: "Life or Health only" },
              { val: "80%+", label: "Practice exams, 2\u20133x in a row" },
              { val: "90 min", label: "State laws section" },
              { val: "30 min", label: "Exam prep videos" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <p className="text-2xl font-bold text-navy">{s.val}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm mt-6 bg-white rounded-lg p-4 border border-gray-200">
            <strong className="text-navy">The #1 thing that matters during the study period: daily engagement.</strong> Not everyone has the same schedule \u2014 some candidates can put in 4 hours a day, others can only do 1. That&apos;s fine. What matters is that they&apos;re logging in and studying every single day.
          </p>
        </div>
      </section>

      {/* ── COMMON MISTAKES ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">Common Mistakes Partners Make</h2>
          <p className="text-gray-500 mb-8">We&apos;ve seen these patterns hundreds of times. Every one of them costs you licensed agents.</p>
          <div className="space-y-3">
            {[
              { title: "Enrolling people and then going silent.", desc: "The most common mistake, by far. You enroll someone, don\u2019t call them for 3 days, and by then they\u2019ve already lost momentum. The Day 1 call exists for a reason." },
              { title: "Assuming people will study on their own.", desc: "They won\u2019t. Most candidates need someone checking in on them regularly. If you\u2019re not looking at the dashboard and following up, nobody is." },
              { title: "Not rescheduling exams when the numbers aren\u2019t there.", desc: "If a candidate is 3 days from their exam and hasn\u2019t hit the benchmarks, letting them sit for it is setting them up to fail. Push the exam back." },
              { title: "Blaming the course material.", desc: "Our pass rate is 93%+ for a reason. When someone fails, it\u2019s almost always because the time and reps weren\u2019t there \u2014 not because the material was lacking." },
              { title: "Letting candidates drift for weeks.", desc: "A 14-day sprint turns into a 30-day crawl, and then they never take the exam. Keep the timeline tight. Urgency is your best tool." },
            ].map((m, i) => (
              <div key={i} className="bg-gray-bg rounded-xl p-5 border border-gray-200">
                <div className="flex gap-3 items-start">
                  <span className="text-red-500 font-bold text-lg flex-shrink-0">&times;</span>
                  <div>
                    <h3 className="font-bold text-navy text-sm mb-1">{m.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "Can a candidate retake the exam if they fail?", a: "Yes. Most states allow retakes, though there may be a waiting period (typically 24 hours to 30 days). Email the report card to support@yourinsurancelicense.com and we\u2019ll build a custom retake plan." },
              { q: "How do I add another candidate?", a: "Reach out to our team via text at 754-223-9744 or through your agency contact, and we\u2019ll get them enrolled and set up in the system." },
              { q: "What if a candidate needs more time on the course?", a: "Course access doesn\u2019t expire on a hard deadline, but the goal is to keep the timeline tight. If they need more time, have them reschedule their exam \u2014 but don\u2019t let \u201Cmore time\u201D become an excuse." },
              { q: "What states do you cover?", a: "We offer pre-licensing and continuing education courses in all 50 states. Contact us if you have questions about a specific state\u2019s requirements." },
              { q: "How does the 754-223-9744 support line work?", a: "Our team sends automated check-in texts to enrolled candidates and responds to incoming questions. It\u2019s not a replacement for your follow-up \u2014 it\u2019s a supplement." },
              { q: "Who do I contact if I have a question that\u2019s not here?", a: "Text or call 754-223-9744, or email support@yourinsurancelicense.com." },
            ].map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden bg-white">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none hover:bg-gray-bg transition-colors select-none">
                  <span className="font-semibold text-navy text-sm leading-snug">{faq.q}</span>
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-bg flex items-center justify-center text-navy group-open:rotate-45 transition-transform duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-1 bg-gray-bg border-t border-gray-200">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FOOTER ── */}
      <section className="bg-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need Help? We&apos;re Here.
          </h2>
          <p className="text-blue-100 text-lg mb-8">Reach out anytime &mdash; we&apos;re in this with you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:7542239744" className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-8 py-3 rounded-lg shadow-lg transition-all">
              754-223-9744
            </a>
            <a href="mailto:support@yourinsurancelicense.com" className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-white hover:text-navy transition-colors">
              support@yourinsurancelicense.com
            </a>
          </div>
          <p className="text-blue-200/60 text-sm mt-6">
            Not a partner yet?{" "}
            <Link href="/partners" className="text-gold hover:underline">Apply here</Link>
          </p>
        </div>
      </section>
    </>
  );
}
