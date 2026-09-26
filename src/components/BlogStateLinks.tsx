import Link from "next/link";
import { getStateForCluster } from "@/lib/blog-cluster-state-map";
import { getStateBySlug } from "@/lib/states";
import { credentialKindFromHours } from "@/lib/prelicensing-status";

interface BlogStateLinksProps {
  clusterSlug: string;
  /** 'compact' for in-article footer (4 cards), 'full' for cluster hub (5 cards) */
  variant?: "compact" | "full";
  /** Optional override of section heading */
  heading?: string;
}

interface LinkCard {
  href: string;
  badge: string;
  title: string;
  description: string;
}

// NOTE: all hrefs are NO-trailing-slash to match the site canonical — the
// middleware 308-redirects trailing slashes, so a trailing slash here would
// waste a redirect hop and dilute the internal-link equity on ~800 posts.
function buildLinksForState(stateSlug: string, stateName: string, full: boolean): LinkCard[] {
  // Only 18 states mandate prelicensing; in the other 32 our approval is CE-ONLY,
  // so claiming "state-approved prelicensing" — or asserting the state HAS a
  // "prelicensing requirement" — is false there. These cards render on ~391 blog
  // posts in exam-only clusters (TN, VA, NC, PA, MD, WA, AZ, ...), several of
  // which repealed their mandate outright. Gate on the real credential kind.
  const _st = getStateBySlug(stateSlug);
  const prelicensingRequired =
    !!_st &&
    credentialKindFromHours([
      _st.prelicensing.life.hours,
      _st.prelicensing.health.hours,
      _st.prelicensing.lifeAndHealth.hours,
    ]) === "prelicensing";

  const cards: LinkCard[] = [
    {
      href: `/${stateSlug}`,
      badge: "Overview",
      title: `${stateName} Insurance Licensing`,
      description: prelicensingRequired
        ? `State-approved prelicensing & CE courses for ${stateName} agents.`
        : `Exam-prep & state-approved CE courses for ${stateName} agents.`,
    },
    {
      href: `/${stateSlug}/prelicensing`,
      badge: "Prelicensing",
      title: `${stateName} Prelicensing Courses`,
      description: prelicensingRequired
        ? `All state-approved options to satisfy ${stateName}'s prelicensing requirement.`
        : `Exam-prep course options for ${stateName} — no state prelicensing requirement.`,
    },
    {
      // Requirements is the priority in-post link — these pages sit on page 2
      // and need the internal-link equity from the blog to climb.
      href: `/${stateSlug}/requirements`,
      badge: "Requirements",
      title: `${stateName} License Requirements`,
      description: `Step-by-step requirements from the ${stateName} Department of Insurance.`,
    },
    {
      href: `/${stateSlug}/continuing-education`,
      badge: "CE",
      title: `${stateName} Continuing Education`,
      description: `Renew your ${stateName} license with same-day CE reporting in most cases.`,
    },
  ];

  if (full) {
    cards.push({
      href: `/${stateSlug}/practice-exam`,
      badge: "Practice Exam",
      title: `${stateName} Practice Exam`,
      description: `Free practice questions covering published ${stateName} licensing topics.`,
    });
  }

  return cards;
}

// Generic money-page links for non-state (topic) clusters so every blog post —
// not just state-cluster posts — funnels equity to a money page.
function buildGenericLinks(clusterSlug: string): LinkCard[] {
  const PRELICENSING: LinkCard = {
    href: "/prelicensing",
    badge: "Prelicensing",
    title: "Insurance Prelicensing Courses",
    description: "State-approved prelicensing nationwide — 100% online, self-paced.",
  };
  const STUDY: LinkCard = {
    href: "/study-guide",
    badge: "Study Guide",
    title: "Free Insurance Exam Study Guide",
    description: "Glossary, mnemonics, practice questions, and a 7-day study plan.",
  };
  const EXAM: LinkCard = {
    href: "/insurance-exam-guide",
    badge: "Exam Guide",
    title: "How to Pass the Insurance Exam",
    description: "What to expect, scoring, and proven test-day strategy.",
  };
  const PC: LinkCard = {
    href: "/property-and-casualty-ce",
    badge: "P&C CE",
    title: "Property & Casualty CE",
    description: "State-approved P&C continuing education with same-day reporting in most cases.",
  };
  const CE: LinkCard = {
    href: "/continuing-education",
    badge: "CE",
    title: "Continuing Education Courses",
    description: "Renew your license with state-approved CE and same-day reporting in most cases.",
  };

  if (clusterSlug === "p-and-c-exam-prep") return [PC, PRELICENSING, EXAM];
  if (clusterSlug === "ce-requirements-general") return [CE, PRELICENSING, STUDY];
  return [PRELICENSING, STUDY, EXAM];
}

export default function BlogStateLinks({
  clusterSlug,
  variant = "compact",
  heading,
}: BlogStateLinksProps) {
  const state = getStateForCluster(clusterSlug);

  const links = state
    ? buildLinksForState(state.slug, state.name, variant === "full")
    : buildGenericLinks(clusterSlug);

  const eyebrow = state ? `${state.name} Resources` : "JustInsurance Resources";
  const sectionHeading =
    heading ?? (state ? `Get Your ${state.name} Insurance License` : "Ready to Get Licensed?");
  const intro = state
    ? `Ready to take the next step? Browse ${state.name}-specific licensing courses and resources.`
    : "Ready to take the next step? Browse our state-approved courses and free exam resources.";
  const gridCols =
    links.length >= 5
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : links.length === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-3";

  return (
    <section className="bg-gray-bg py-12 px-4 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <p className="text-gold-deep font-semibold uppercase tracking-wide text-xs mb-2">
          {eyebrow}
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">
          {sectionHeading}
        </h2>
        <p className="text-gray-600 text-sm mb-6 max-w-2xl">{intro}</p>
        <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block bg-white hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg p-4 transition-colors group"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold-deep mb-1">
                {link.badge}
              </p>
              <h3 className="font-semibold text-navy text-sm mb-1 group-hover:text-gold-deep transition-colors leading-snug">
                {link.title}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
