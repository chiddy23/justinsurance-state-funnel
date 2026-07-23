"use client";

import { passGuaranteeExcludedLabel } from "@/lib/pass-guarantee";

import React, { useEffect, useState } from "react";
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
  const playingVideo = [...PARTNER_VIDEOS, ...CANDIDATE_VIDEOS].find(
    (v) => v.id === playingId
  );

  // A11Y-06 (audit 2026-07-14): close the video dialog on Escape.
  useEffect(() => {
    if (!playingId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPlayingId(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [playingId]);

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
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <Link href="/partners" className="hover:text-navy hover:underline">Partners</Link>
            </li>
            <li className="flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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
        <div role="dialog" aria-modal="true" aria-label={playingVideo ? `${playingVideo.title} — video` : "Video player"} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPlayingId(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button autoFocus onClick={() => setPlayingId(null)} className="absolute -top-10 right-0 text-white hover:text-gold text-sm font-semibold">Close &times;</button>
            <div style={{ aspectRatio: "16/9" }} className="rounded-xl overflow-hidden">
              <iframe src={`https://www.youtube-nocookie.com/embed/${playingId}?autoplay=1&rel=0`} title={playingVideo ? playingVideo.title : "Video"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
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
          {/* These benchmarks ARE the Pass Guarantee eligibility criteria in the
              Terms (Section 4), so they must match the Terms in substance: a
              partner who coaches to a looser number costs their candidate the
              guarantee. Corrected here:
                - "2-3x in a row" -> the Terms require 80%+ THREE times in a row.
                - "30 hrs Life & Health / 20 hrs Life or Health" -> the Terms set
                  recommended hours to the candidate's OWN state's required
                  course hours wherever prelicensing is required (a Florida
                  candidate coached to 30 hrs against a 60-hr requirement
                  forfeits the guarantee); the flat 20/40 figures apply ONLY in
                  states with no prelicensing requirement.
                - Added the 30-day first-attempt window, which is also a
                  guarantee condition partners must coach to.
                - Audit 2026-07-20: the grid also carried "90 min / State laws
                  section" and "30 min / Exam prep videos", which appear NOWHERE
                  in Terms Section 4. Presenting them as eligibility conditions
                  told partners the guarantee could be voided by terms the
                  company has no contractual basis to enforce. They are now
                  separated out and labelled as coaching recommendations.
                - Audit 2026-07-20: the grid also OMITTED Terms Section 4
                  conditions 4 and 5 (fail on the first attempt; submit the
                  refund request with the official score report within 30 days
                  of the failed exam) while telling partners this was the whole
                  list. Both are now shown. */}
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">Study Benchmarks</h2>
          <p className="text-gray-500 mb-2">
            The six tiles below are the Pass Guarantee eligibility conditions from our{" "}
            <a href="/terms" className="text-navy font-semibold underline hover:text-gold">
              Terms of Service
            </a>{" "}
            (Section 4), which controls in full. Coach to them exactly &mdash; if a candidate
            misses one, the guarantee does not apply.
          </p>
          <p className="text-gray-500 mb-8 text-sm">
            The Pass Guarantee is not offered in {passGuaranteeExcludedLabel()}, or in states
            where our provider approval is still pending.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { val: "State hours", label: "Recommended study hours = your candidate\u2019s state\u2019s required course hours, where prelicensing is required" },
              { val: "20 / 40 hrs", label: "Single line / dual line (Life & Health) \u2014 only in states with no prelicensing requirement" },
              { val: "80%+", label: "Practice exams, three times in a row, before sitting for the state exam" },
              { val: "30 days", label: "First state exam attempt, counted from first enrollment" },
              { val: "1st attempt", label: "The candidate must actually fail that first attempt \u2014 a passing score ends the claim" },
              { val: "30 days", label: "Deadline to submit the refund request with the official score report, counted from the failed exam" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200 text-center">
                <p className="text-2xl font-bold text-navy">{s.val}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 mt-8 mb-4 text-sm">
            <strong className="text-navy">Our coaching recommendations</strong> &mdash; these are study
            habits we suggest, <em>not</em> Pass Guarantee conditions. A candidate who skips them does
            not lose the guarantee.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
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
            <strong className="text-navy">The #1 thing that matters during the study period: daily engagement.</strong> Not everyone has the same schedule &mdash; some candidates can put in 4 hours a day, others can only do 1. That&apos;s fine. What matters is that they&apos;re logging in and studying every single day.
          </p>
        </div>
      </section>

      {/* ── POST-PASS WORKFLOW ──
          Shows partners what happens after their candidate passes: our own
          licensing-help process.
          Audit 2026-07-20: the intro used to read "the post-pass workflow most
          prelicensing providers don't offer." That is a comparative claim about
          the market as a class (Lanham Act 15 U.S.C. §1125(a)(1)(B); FTC
          Comparative Advertising Policy, 16 C.F.R. §14.15) and we hold NO survey
          or other substantiation for it — the sitewide comparison sweep removed
          every other such line and missed this one. Describe our own service
          only; do not reintroduce a "more/most/unlike other providers" framing
          without dated, competent substantiation on file. */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">What Happens After Your Candidate Passes</h2>
          <p className="text-gray-500 mb-8">Our post-pass workflow. Your candidates don&apos;t get stuck in NIPR &mdash; we walk them through.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-5">
              <div className="text-3xl mb-3">1</div>
              <h3 className="font-bold text-navy text-sm mb-2">Within 24 hours of passing</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Personal text outreach from our team. We confirm the pass, congratulate them, and start the licensing-help conversation.
              </p>
            </div>
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-5">
              <div className="text-3xl mb-3">2</div>
              <h3 className="font-bold text-navy text-sm mb-2">NIPR walkthrough</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                We help them navigate the NIPR application &mdash; lines of authority, fees, supplemental forms, document uploads.
              </p>
            </div>
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-5">
              <div className="text-3xl mb-3">3</div>
              <h3 className="font-bold text-navy text-sm mb-2">Fingerprinting guidance</h3>
              {/* Vendor-neutral: IdentoGO is only one of several vendors across
                  the states. Per states.ts, Arizona routes through Fieldprint,
                  California through Live Scan, and North Carolina through local
                  police departments. Selling "IdentoGO codes" as the deliverable
                  promises something that does not exist in much of the country. */}
              <p className="text-gray-700 text-sm leading-relaxed">
                Your candidate&rsquo;s state fingerprint vendor and code, scheduling, and what to bring. The vendor differs by state &mdash; IdentoGO, Fieldprint, Live Scan, or a local police department. This is the #1 place candidates get stuck without help.
              </p>
            </div>
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-5">
              <div className="text-3xl mb-3">4</div>
              <h3 className="font-bold text-navy text-sm mb-2">License issuance follow-up</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                We track the application through state DOI processing until the license number lands in their hands.
              </p>
            </div>
          </div>
          {/* Audit 2026-07-20, two corrections:
              1) "2-4 weeks from enrollment" was a bare national speed claim that
                 our own data contradicts.
              2) "almost zero post-exam abandonment" was a quantified outcome
                 claim with no metric, denominator, window or methodology
                 anywhere in the repo or on the site (FTC Act §5 prior
                 substantiation). Replaced with a qualitative description of the
                 service. Do not restore a number without published methodology.

              Audit 2026-07-22: the replacement range, "roughly 2-6 weeks," was
              ALSO false, and the note that produced it mis-stated the data.
              Recounted directly from src/lib/states.ts totalLicensingTime, all
              50 records:
                37  "2-4 weeks"
                 1  alabama        "3-4 weeks"
                 1  alaska         "2-5 weeks (for focused applicants)"
                 1  arizona        "Approximately 5-7 weeks from start to finish"
                 1  arkansas       "Approximately 3-4 weeks from start to finish"
                 1  california     "3-6 weeks start to finish"
                 1  delaware       "3-6 weeks"
                 1  hawaii         "8-12 weeks"
                 1  iowa           "4-8 weeks"
                 1  maine          "4-7 weeks"
                 1  michigan       "5-8 weeks"
                 1  new-mexico     "3-6 weeks"
                 1  north-carolina "4-8 weeks (NCDOI official standard: 60 days)"
                 1  north-dakota   "4-7 weeks"
              Seven states carry an upper bound ABOVE six weeks, so "2-6 weeks"
              understated the slowest states by as much as six weeks. The true
              envelope is 2 weeks at the fast end to 12 weeks in Hawaii; "most
              states" = the 37 records at 2-4 weeks. Not derived from states.ts
              at runtime because totalLicensingTime is free prose and this is a
              client component -- if that field changes, recount and update the
              figures here. */}
          <div className="mt-6 bg-navy text-white rounded-xl p-5 text-center">
            <p className="leading-relaxed">
              <strong className="text-gold">Net result for your agency:</strong> fewer candidates stalling after the exam, candidates who feel supported all the way through, and active license status in about 2&ndash;4 weeks from enrollment in most states &mdash; a number of states run considerably longer, up to 8&ndash;12 weeks in Hawaii, so check your state&apos;s page for its own timeline.
            </p>
          </div>
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
              // Audit 2026-07-22: "our completer pass rate is 93%" described the
              // cohort as course completers. Per /pass-rates, the 93% is
              // measured among students who completed the full course AND met
              // the recommended study metrics -- the recommended hours plus 80%+
              // on the practice exam three times in a row before testing.
              // Dropping the second half overstates who the figure applies to,
              // the same defect corrected on /partners and /press.
              { title: "Blaming the course material.", desc: "Our 93% first-attempt pass rate is measured among students who completed the full course, finished the recommended hours, and scored 80%+ on the practice exam three times in a row before testing. When someone doesn\u2019t pass, it\u2019s usually because the recommended study time and practice-exam reps weren\u2019t there \u2014 not because the material was lacking." },
              { title: "Letting candidates drift for weeks.", desc: "A 14-day sprint turns into a 30-day crawl, and then they never take the exam. Keep the timeline tight. Momentum is your best tool." },
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
              { q: "Can a candidate retake the exam if they fail?", a: "Yes. Most states allow retakes, though there may be a waiting period (typically 24 hours to 30 days). Email the report card to support@justinsuranceco.com and we\u2019ll build a custom retake plan." },
              { q: "How do I add another candidate?", a: "Reach out to our team via text at 850-790-4811 or through your agency contact, and we\u2019ll get them enrolled and set up in the system." },
              // Corrected: course access DOES expire. Terms Section 3: prelicensing
              // access runs 30 days from enrollment, and the FAQ says the same.
              // Telling partners there is no hard deadline sets their candidates up
              // to lose both their access and their guarantee.
              { q: "What if a candidate needs more time on the course?", a: "Prelicensing course access runs 30 days from the date of enrollment \u2014 that is a hard deadline (Terms, Section 3). If a candidate needs more time, have them contact support before their access expires; extensions are reviewed case by case. Keep in mind the Pass Guarantee separately requires their first state exam attempt within 30 days of first enrollment, so stalling can cost them the guarantee even if access is extended." },
              // Corrected (audit 2026-07-20): "pre-licensing and continuing
              // education courses nationwide" is false for prelicensing. This
              // same page says the guarantee is withheld in approval-pending
              // states, states.ts carries providerApprovalNumber "PENDING" for
              // new-york and washington, and the New York prelicensing page
              // itself says the course "is completing state approval and isn't
              // open for enrollment yet." isPrelicensingHeld() in
              // src/lib/prelicensing-status.ts is the gate. Advertising a
              // prelicensing course in a state where it is not yet approved is a
              // direct DOI advertising exposure for a licensed agent.
              //
              // Corrected again (audit 2026-07-22): the 07-20 pass left "We
              // offer continuing education NATIONWIDE" standing, which is the
              // same defect on the CE side. Recounted from src/lib/states.ts:
              // 50 state records, providerApprovalNumber === "PENDING" in
              // exactly two of them -- new-york (line 5835) and washington
              // (line 8507) -- so 48 real approvals. stateClaims() in
              // src/lib/prelicensing-status.ts sets canClaimCeApproval =
              // (providerApprovalNumber !== "PENDING"), and
              // /license-renewal-guide already badges those two rows "CE
              // approval pending - not yet DOI-reportable". CE is therefore
              // approved in 48 states, not nationwide. The vague "a few states
              // -- including New York" is also replaced: New York is the ONLY
              // state where prelicensing is held (isPrelicensingHeld() requires
              // PENDING approval AND a numeric prelicensing hour requirement;
              // Washington's prelicensing hours are "None required (optional)"
              // on all three lines, so it is not held). Matches the wording
              // already used on /partners. If either approval issues, update
              // the count and the state names here.
              { q: "What states do you cover?", a: "Our state CE provider approval is active in 48 of the 50 states \u2014 the New York and Washington approvals are still pending, so CE completions in those two states are not yet reportable to the state. Prelicensing is available in every state where our courses are state-approved; New York is still completing state approval and is not open for prelicensing enrollment yet. Contact us about a specific state\u2019s requirements or availability." },
              { q: "How does the 850-790-4811 support line work?", a: "Our team sends check-in texts to enrolled candidates and responds to incoming questions. It\u2019s not a replacement for your follow-up \u2014 it\u2019s a supplement." },
              { q: "Who do I contact if I have a question that\u2019s not here?", a: "Text or call 850-790-4811, or email support@justinsuranceco.com." },
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
            <a href="tel:8507904811" className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-8 py-3 rounded-lg shadow-lg transition-all">
              850-790-4811
            </a>
            <a href="mailto:support@justinsuranceco.com" className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-white hover:text-navy transition-colors">
              support@justinsuranceco.com
            </a>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            Not a partner yet?{" "}
            <Link href="/partners" className="text-gold hover:underline">Apply here</Link>
          </p>
        </div>
      </section>
    </>
  );
}
