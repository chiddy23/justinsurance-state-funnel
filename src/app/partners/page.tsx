"use client";

import React, { useState } from "react";
import Link from "next/link";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbywu4ABTejh0VaosesuFgbPBvJ4jbSMfzpem78lNqBMvceTYPlCNySXHUV9xLuonYDTiA/exec";

// ── Metadata is in layout or via generateMetadata in a separate file.
// Since this is a "use client" component, we export metadata from a
// companion file (see below). For now, the page renders fully client-side
// to support the interactive form.

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Agency Dashboard",
    desc: "Track every recruit\u2019s course progress in real time. See who\u2019s enrolled, who\u2019s completed, and who needs a nudge \u2014 all from one dashboard.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: "Bulk & Subscription Pricing",
    desc: "Volume discounts for agencies enrolling multiple agents. Subscription options available for high-volume partners. Contact us to build a plan that fits your team.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Dedicated Support",
    desc: "Your recruits get real human support. Your agency gets a dedicated partner contact. No bots, no ticket queues for urgent issues.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "API Integration",
    desc: "We\u2019re the first insurance education company with API integration. Plug our courses directly into your onboarding or AMS system.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "93% Pass Rate",
    desc: "Our students pass at 93% \u2014 nearly double the national average. Better-prepared agents means lower attrition and faster production.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Nationwide Coverage",
    desc: "State-approved nationwide. Whether you\u2019re a regional agency or national IMO, we have your markets covered.",
  },
];

const steps = [
  { num: "1", title: "Submit Your Application", desc: "Fill out the form below with your agency details." },
  { num: "2", title: "We Review & Contact You", desc: "Our team reviews and contacts you within 1 business day." },
  { num: "3", title: "Get Set Up", desc: "Get your agency dashboard, bulk pricing, and dedicated support contact." },
  { num: "4", title: "Start Enrolling", desc: "Start enrolling recruits and tracking their progress in real time." },
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  agentsPerMonth: string;
  heardFrom: string;
  about: string;
}

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  agentsPerMonth: "",
  heardFrom: "",
  about: "",
};

export default function PartnersPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      // no-cors means we can't read the response, but if fetch didn't throw, it sent
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

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
              <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-navy font-medium">Partners</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Agency Partnership Program
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            Partner with JustInsurance
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-3xl mx-auto">
            Give your recruits the highest pass rate in the industry. State-approved
            prelicensing and CE courses nationwide &mdash; with agency dashboards,
            bulk pricing, and dedicated support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply"
              className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Apply to Partner
            </a>
            <Link
              href="/partner-resources"
              className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-white hover:text-navy transition-all"
            >
              Partner Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Partnership Form — FIRST after hero */}
      <section id="apply" className="bg-white py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Apply to Partner
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Fill out the form and our team will contact you within 1 business day.
          </p>

          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-navy mb-2">Application Received!</h3>
              <p className="text-gray-600">
                Thanks! We&apos;ll be in touch within 1 business day. If you need immediate
                help, call{" "}
                <a href="tel:7542239744" className="text-navy font-semibold underline">
                  754-223-9744
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-navy mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-navy mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-navy mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="agentsPerMonth" className="block text-sm font-semibold text-navy mb-1">
                    Estimated Agents Per Month *
                  </label>
                  <select
                    id="agentsPerMonth"
                    name="agentsPerMonth"
                    required
                    value={form.agentsPerMonth}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="1-5">1-5</option>
                    <option value="6-15">6-15</option>
                    <option value="16-50">16-50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="heardFrom" className="block text-sm font-semibold text-navy mb-1">
                    How did you hear about us? *
                  </label>
                  <select
                    id="heardFrom"
                    name="heardFrom"
                    required
                    value={form.heardFrom}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="Google Search">Google Search</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="about" className="block text-sm font-semibold text-navy mb-1">
                  Tell us about your agency (optional)
                </label>
                <textarea
                  id="about"
                  name="about"
                  rows={4}
                  placeholder="Size, lines of authority, what you're looking for..."
                  value={form.about}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-navy focus:ring-1 focus:ring-navy outline-none resize-y"
                />
              </div>

              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">
                    Something went wrong. Please try again or call{" "}
                    <a href="tel:7542239744" className="font-semibold underline">
                      754-223-9744
                    </a>{" "}
                    directly.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg py-4 rounded-lg shadow-lg transition-all hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Submitting..." : "Submit Partnership Application"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Why Partner */}
      <section className="bg-gray-bg py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            Why Partner With Us
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Tools and support built specifically for agencies that recruit and onboard
            insurance agents.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-gold mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-navy mb-2 text-sm">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center bg-gray-bg rounded-xl p-6 border border-gray-200">
                <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-sm">{s.num}</span>
                </div>
                <h3 className="font-bold text-navy mb-2 text-sm">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Already a Student?
          </h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Looking for prelicensing or CE courses for yourself? Browse our
            state-approved courses.
          </p>
          <Link
            href="/"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold text-lg px-10 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Browse All States
          </Link>
        </div>
      </section>
    </>
  );
}
