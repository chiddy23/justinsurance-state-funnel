import Link from "next/link";
import { getStateForCluster } from "@/lib/blog-cluster-state-map";

interface BlogStateLinksProps {
  clusterSlug: string;
  /** 'compact' for in-article footer (3 cards), 'full' for cluster hub (5 cards) */
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

function buildLinksForState(stateSlug: string, stateName: string, full: boolean): LinkCard[] {
  const cards: LinkCard[] = [
    {
      href: `/${stateSlug}/`,
      badge: "Overview",
      title: `${stateName} Insurance Licensing`,
      description: `State-approved prelicensing & CE courses for ${stateName} agents.`,
    },
    {
      href: `/${stateSlug}/prelicensing/`,
      badge: "Prelicensing",
      title: `${stateName} Prelicensing Courses`,
      description: `All state-approved options to satisfy ${stateName}'s prelicensing requirement.`,
    },
    {
      href: `/${stateSlug}/continuing-education/`,
      badge: "CE",
      title: `${stateName} Continuing Education`,
      description: `Renew your ${stateName} license with same-day CE reporting.`,
    },
  ];

  if (full) {
    cards.push(
      {
        href: `/${stateSlug}/requirements/`,
        badge: "Requirements",
        title: `${stateName} License Requirements`,
        description: `Step-by-step requirements from the ${stateName} Department of Insurance.`,
      },
      {
        href: `/${stateSlug}/practice-exam/`,
        badge: "Practice Exam",
        title: `${stateName} Practice Exam`,
        description: `Free practice questions modeled on the ${stateName} state licensing exam.`,
      },
    );
  }

  return cards;
}

export default function BlogStateLinks({
  clusterSlug,
  variant = "compact",
  heading,
}: BlogStateLinksProps) {
  const state = getStateForCluster(clusterSlug);
  if (!state) return null;

  const links = buildLinksForState(state.slug, state.name, variant === "full");
  const sectionHeading = heading ?? `Get Your ${state.name} Insurance License`;
  const gridCols = variant === "full" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-3";

  return (
    <section className="bg-gray-bg py-12 px-4 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <p className="text-gold-dark font-semibold uppercase tracking-wide text-xs mb-2">
          {state.name} Resources
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">
          {sectionHeading}
        </h2>
        <p className="text-gray-600 text-sm mb-6 max-w-2xl">
          Ready to take the next step? Browse {state.name}-specific licensing courses and resources.
        </p>
        <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block bg-white hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg p-4 transition-colors group"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold-dark mb-1">
                {link.badge}
              </p>
              <h3 className="font-semibold text-navy text-sm mb-1 group-hover:text-gold-dark transition-colors leading-snug">
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
