import React from "react";
import Link from "next/link";
import type { StateData } from "@/lib/states";
import catalogLinks from "@/lib/catalog-links.json";

type CatalogLinks = typeof catalogLinks;

interface LOASelectorProps {
  stateSlug: string;
  courseType: "prelicensing" | "continuing-education";
  stateData: StateData;
}

interface LOACardData {
  slug: string;
  name: string;
  description: string;
  hours: number;
  price: string;
  renewalYears?: number;
  pageHref: string;
  enrollHref: string;
}

export default function LOASelector({ stateSlug, courseType, stateData }: LOASelectorProps) {
  const catalogKey = courseType === "continuing-education" ? "continuing-education" : "prelicensing";
  const stateCatalog = (catalogLinks as CatalogLinks)[stateSlug as keyof CatalogLinks];

  function getEnrollLink(loaKey: "life" | "health" | "life-and-health"): string {
    if (!stateCatalog) return "https://yourinsurancelicense.myabsorb.com/";
    const section = stateCatalog[catalogKey as keyof typeof stateCatalog] as Record<string, string>;
    return section?.[loaKey] ?? "https://yourinsurancelicense.myabsorb.com/";
  }

  const cards: LOACardData[] =
    courseType === "prelicensing"
      ? [
          {
            slug: "life",
            name: "Life Insurance",
            description: "Sell term life, whole life, universal life, and annuity products. The essential license for any agent working in life insurance or financial services.",
            hours: stateData.prelicensing.life.hours,
            price: stateData.prelicensing.life.price,
            pageHref: `/${stateSlug}/prelicensing/life/`,
            enrollHref: getEnrollLink("life"),
          },
          {
            slug: "health",
            name: "Health Insurance",
            description: "Sell major medical, Medicare supplement, disability income, long-term care, and other health products. Essential for agents focused on health and Medicare markets.",
            hours: stateData.prelicensing.health.hours,
            price: stateData.prelicensing.health.price,
            pageHref: `/${stateSlug}/prelicensing/health/`,
            enrollHref: getEnrollLink("health"),
          },
          {
            slug: "life-and-health",
            name: "Life & Health Insurance",
            description: "The most popular choice — get licensed to sell both life and health products with a single combined course and exam. Maximize your earning potential from day one.",
            hours: stateData.prelicensing.lifeAndHealth.hours,
            price: stateData.prelicensing.lifeAndHealth.price,
            pageHref: `/${stateSlug}/prelicensing/life-and-health/`,
            enrollHref: getEnrollLink("life-and-health"),
          },
        ]
      : [
          {
            slug: "life",
            name: "Life Insurance CE",
            description: "Complete your life insurance continuing education requirements online. State-approved hours that keep your life license active and compliant.",
            hours: stateData.ce.life.hours,
            price: stateData.ce.life.price,
            renewalYears: stateData.ce.life.renewalYears,
            pageHref: `/${stateSlug}/continuing-education/life/`,
            enrollHref: getEnrollLink("life"),
          },
          {
            slug: "health",
            name: "Health Insurance CE",
            description: "Complete your health insurance CE requirements online. Covers all required topics including ethics. Same-day reporting to your state DOI.",
            hours: stateData.ce.health.hours,
            price: stateData.ce.health.price,
            renewalYears: stateData.ce.health.renewalYears,
            pageHref: `/${stateSlug}/continuing-education/health/`,
            enrollHref: getEnrollLink("health"),
          },
          {
            slug: "life-and-health",
            name: "Life & Health CE",
            description: "Fulfill the CE requirements for both your life and health licenses in one package. The most efficient way to renew your combined license.",
            hours: stateData.ce.lifeAndHealth.hours,
            price: stateData.ce.lifeAndHealth.price,
            renewalYears: stateData.ce.lifeAndHealth.renewalYears,
            pageHref: `/${stateSlug}/continuing-education/life-and-health/`,
            enrollHref: getEnrollLink("life-and-health"),
          },
        ];

  return (
    <section className="bg-gray-bg py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
          Choose Your Line of Authority
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          {courseType === "prelicensing"
            ? "Select the license type that matches your career goals. Not sure? Most agents choose Life & Health."
            : "Select the course that matches your current license type."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={card.slug}
              className={`bg-white rounded-xl shadow-md border-2 p-6 flex flex-col hover:shadow-xl transition-shadow ${
                idx === 2 ? "border-gold" : "border-transparent"
              }`}
            >
              {idx === 2 && (
                <div className="bg-gold text-gray-dark text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full self-start mb-3">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold text-navy mb-2">{card.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{card.description}</p>

              <div className="border-t border-gray-100 pt-4 mb-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Hours Required</span>
                  <span className="text-navy font-bold">{card.hours} hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Course Price</span>
                  <span className="text-navy font-bold">{card.price}</span>
                </div>
                {card.renewalYears && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Renewal Cycle</span>
                    <span className="text-navy font-bold">Every {card.renewalYears} yr{card.renewalYears > 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>

              <Link
                href={card.pageHref}
                className="block text-center text-navy border border-navy hover:bg-navy hover:text-white font-medium py-2 px-4 rounded-lg transition-colors mb-2 text-sm"
              >
                Learn More
              </Link>
              <a
                href={card.enrollHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-gold hover:bg-gold-dark text-gray-dark font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Enroll Now &mdash; {card.price}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
