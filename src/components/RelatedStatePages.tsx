import Link from "next/link";

type CurrentPage =
  | "state-hub"
  | "requirements"
  | "practice-exam"
  | "prelicensing-hub"
  | "prelicensing-loa"
  | "ce-hub"
  | "ce-loa";

interface RelatedStatePagesProps {
  stateSlug: string;
  stateName: string;
  currentPage: CurrentPage;
  /** Current LOA slug if on a LOA page — used to skip self-link */
  currentLoa?: "life" | "health" | "life-and-health";
  /** Optional override of the section heading */
  heading?: string;
  /** Background variant — 'white' for blog/light contexts, 'gray' for between sections */
  variant?: "white" | "gray";
}

interface LinkItem {
  href: string;
  title: string;
  description: string;
  badge: string;
}

function buildLinks(
  stateSlug: string,
  stateName: string,
  currentPage: CurrentPage,
  currentLoa?: string
): LinkItem[] {
  const all: LinkItem[] = [
    {
      href: `/${stateSlug}/`,
      title: `${stateName} Insurance License Hub`,
      description: `Overview of prelicensing, CE, and exam requirements in ${stateName}.`,
      badge: "Overview",
    },
    {
      href: `/${stateSlug}/requirements/`,
      title: `${stateName} License Requirements`,
      description: `Step-by-step legal and documentation requirements from the ${stateName} Department of Insurance.`,
      badge: "Requirements",
    },
    {
      href: `/${stateSlug}/practice-exam/`,
      title: `${stateName} Practice Exam`,
      description: `Free practice questions modeled on the ${stateName} state licensing exam.`,
      badge: "Practice",
    },
    {
      href: `/${stateSlug}/prelicensing/`,
      title: `${stateName} Prelicensing Courses`,
      description: `All state-approved prelicensing course options for ${stateName}.`,
      badge: "Prelicensing",
    },
    {
      href: `/${stateSlug}/prelicensing/life/`,
      title: `${stateName} Life Insurance Prelicensing`,
      description: `Prelicensing course for the Life-only license in ${stateName}.`,
      badge: "Life",
    },
    {
      href: `/${stateSlug}/prelicensing/health/`,
      title: `${stateName} Health Insurance Prelicensing`,
      description: `Prelicensing course for the Health-only license in ${stateName}.`,
      badge: "Health",
    },
    {
      href: `/${stateSlug}/prelicensing/life-and-health/`,
      title: `${stateName} Life & Health Prelicensing`,
      description: `Combined Life & Health prelicensing course for ${stateName}.`,
      badge: "L&H",
    },
    {
      href: `/${stateSlug}/continuing-education/`,
      title: `${stateName} Continuing Education`,
      description: `CE course catalog for ${stateName} license renewal.`,
      badge: "CE",
    },
    {
      href: `/${stateSlug}/continuing-education/life/`,
      title: `${stateName} Life CE Renewal`,
      description: `CE hours for ${stateName} Life license renewal.`,
      badge: "CE Life",
    },
    {
      href: `/${stateSlug}/continuing-education/health/`,
      title: `${stateName} Health CE Renewal`,
      description: `CE hours for ${stateName} Health license renewal.`,
      badge: "CE Health",
    },
    {
      href: `/${stateSlug}/continuing-education/life-and-health/`,
      title: `${stateName} Life & Health CE Renewal`,
      description: `Combined Life & Health CE for ${stateName} license renewal.`,
      badge: "CE L&H",
    },
  ];

  return all.filter((link) => {
    if (currentPage === "state-hub" && link.href === `/${stateSlug}/`) return false;
    if (currentPage === "requirements" && link.href === `/${stateSlug}/requirements/`) return false;
    if (currentPage === "practice-exam" && link.href === `/${stateSlug}/practice-exam/`) return false;
    if (currentPage === "prelicensing-hub" && link.href === `/${stateSlug}/prelicensing/`) return false;
    if (currentPage === "ce-hub" && link.href === `/${stateSlug}/continuing-education/`) return false;
    if (currentPage === "prelicensing-loa" && currentLoa) {
      if (link.href === `/${stateSlug}/prelicensing/${currentLoa}/`) return false;
    }
    if (currentPage === "ce-loa" && currentLoa) {
      if (link.href === `/${stateSlug}/continuing-education/${currentLoa}/`) return false;
    }
    return true;
  });
}

export default function RelatedStatePages({
  stateSlug,
  stateName,
  currentPage,
  currentLoa,
  heading,
  variant = "gray",
}: RelatedStatePagesProps) {
  const links = buildLinks(stateSlug, stateName, currentPage, currentLoa);
  const sectionBg = variant === "white" ? "bg-white" : "bg-gray-bg";
  const cardBg = variant === "white" ? "bg-gray-bg" : "bg-white";

  return (
    <section className={`${sectionBg} py-12 px-4 border-t border-gray-100`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-navy mb-2">
          {heading ?? `Explore More ${stateName} Resources`}
        </h2>
        <p className="text-gray-600 text-sm mb-6 max-w-2xl">
          Dive deeper into {stateName} licensing, exam prep, and CE renewal.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block ${cardBg} hover:bg-gold/10 border border-gray-200 hover:border-gold rounded-lg p-4 transition-colors group`}
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
