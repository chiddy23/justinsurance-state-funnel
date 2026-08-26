import Link from "next/link";
import { getStateBySlug } from "@/lib/states";
import {
  credentialKindFromHours,
  isCeAvailable,
  isPrelicensingHeld,
} from "@/lib/prelicensing-status";

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
  // Only claim "state-approved PRELICENSING" where such an approval actually
  // exists: the provider approval must be granted (not PENDING) AND the state
  // must actually regulate prelicensing. In exam-only states the approval is
  // CE-only, so "state-approved prelicensing" asserts a credential we don't hold.
  const _st = getStateBySlug(stateSlug);
  const prelicensingApproved =
    !!_st &&
    _st.providerApprovalNumber !== "PENDING" &&
    credentialKindFromHours([
      _st.prelicensing.life.hours,
      _st.prelicensing.health.hours,
      _st.prelicensing.lifeAndHealth.hours,
    ]) === "prelicensing";
  // Availability gates for related-card copy. WA CE is approved-but-not-live and
  // NY CE is approval-pending → isCeAvailable is false for both, so CE cards must
  // not imply a live catalog/renewal. NY prelicensing is held (approved, not open)
  // → isPrelicensingHeld true. An unresolvable state falls back to the live copy
  // (ceAvailable=true / prelicensingHeld=false), keeping output byte-identical.
  const ceAvailable = !_st || isCeAvailable(_st);
  const prelicensingHeld = !!_st && isPrelicensingHeld(_st);
  const isOptionalExamPrep =
    stateSlug === "alabama" || stateSlug === "alaska" || stateSlug === "arizona";
  const all: LinkItem[] = [
    {
      href: `/${stateSlug}`,
      title: `${stateName} Insurance License Hub`,
      description: isOptionalExamPrep
        ? `Overview of licensing, CE, and exam requirements in ${stateName}.`
        : `Overview of prelicensing, CE, and exam requirements in ${stateName}.`,
      badge: "Overview",
    },
    {
      href: `/${stateSlug}/requirements`,
      title: `${stateName} License Requirements`,
      description: `Step-by-step legal and documentation requirements to get licensed in ${stateName}.`,
      badge: "Requirements",
    },
    {
      href: `/${stateSlug}/practice-exam`,
      title: `${stateName} Practice Exam`,
      description: isOptionalExamPrep
        ? `Free practice questions for additional ${stateName} licensing-exam preparation.`
        : `Free practice questions covering published ${stateName} licensing topics.`,
      badge: "Practice",
    },
    {
      href: `/${stateSlug}/prelicensing`,
      title: isOptionalExamPrep
        ? `${stateName} Insurance Exam Prep Courses`
        : `${stateName} Prelicensing Courses`,
      description: isOptionalExamPrep
        ? `Optional online exam-prep course options for ${stateName}.`
        : prelicensingHeld
          ? `${stateName} prelicensing — opening for enrollment soon.`
          : `All ${prelicensingApproved ? "state-approved " : ""}prelicensing course options for ${stateName}.`,
      badge: isOptionalExamPrep ? "Exam Prep" : "Prelicensing",
    },
    {
      href: `/${stateSlug}/prelicensing/life`,
      title: isOptionalExamPrep
        ? `${stateName} Life Insurance Exam Prep`
        : `${stateName} Life Insurance Prelicensing`,
      description: isOptionalExamPrep
        ? `Optional exam preparation for the Life-only license in ${stateName}.`
        : `Prelicensing course for the Life-only license in ${stateName}.`,
      badge: "Life",
    },
    {
      href: `/${stateSlug}/prelicensing/health`,
      title: isOptionalExamPrep
        ? `${stateName} Health Insurance Exam Prep`
        : `${stateName} Health Insurance Prelicensing`,
      description: isOptionalExamPrep
        ? `Optional exam preparation for the Health-only license in ${stateName}.`
        : `Prelicensing course for the Health-only license in ${stateName}.`,
      badge: "Health",
    },
    {
      href: `/${stateSlug}/prelicensing/life-and-health`,
      title: isOptionalExamPrep
        ? `${stateName} Life & Health Insurance Exam Prep`
        : `${stateName} Life & Health Prelicensing`,
      description: isOptionalExamPrep
        ? `Optional Life & Health exam preparation for ${stateName}.`
        : `Life & Health prelicensing course for ${stateName}.`,
      badge: "L&H",
    },
    {
      href: `/${stateSlug}/continuing-education`,
      title: `${stateName} Continuing Education`,
      description: ceAvailable
        ? `CE course catalog for ${stateName} license renewal.`
        : `${stateName} CE — coming soon.`,
      badge: "CE",
    },
    {
      href: `/${stateSlug}/continuing-education/life`,
      title: `${stateName} Life CE Renewal`,
      description: ceAvailable
        ? `CE hours for ${stateName} Life license renewal.`
        : `${stateName} Life CE — coming soon.`,
      badge: "CE Life",
    },
    {
      href: `/${stateSlug}/continuing-education/health`,
      title: `${stateName} Health CE Renewal`,
      description: ceAvailable
        ? `CE hours for ${stateName} Health license renewal.`
        : `${stateName} Health CE — coming soon.`,
      badge: "CE Health",
    },
    {
      href: `/${stateSlug}/continuing-education/life-and-health`,
      title: `${stateName} Life & Health CE Renewal`,
      description: ceAvailable
        ? `Combined Life & Health CE for ${stateName} license renewal.`
        : `${stateName} Life & Health CE — coming soon.`,
      badge: "CE L&H",
    },
  ];

  return all.filter((link) => {
    if (currentPage === "state-hub" && link.href === `/${stateSlug}`) return false;
    if (currentPage === "requirements" && link.href === `/${stateSlug}/requirements`) return false;
    if (currentPage === "practice-exam" && link.href === `/${stateSlug}/practice-exam`) return false;
    if (currentPage === "prelicensing-hub" && link.href === `/${stateSlug}/prelicensing`) return false;
    if (currentPage === "ce-hub" && link.href === `/${stateSlug}/continuing-education`) return false;
    if (currentPage === "prelicensing-loa" && currentLoa) {
      if (link.href === `/${stateSlug}/prelicensing/${currentLoa}`) return false;
    }
    if (currentPage === "ce-loa" && currentLoa) {
      if (link.href === `/${stateSlug}/continuing-education/${currentLoa}`) return false;
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
