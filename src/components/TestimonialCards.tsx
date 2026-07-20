import React from "react";
import {
  ALL_TESTIMONIALS,
  isDisplayable,
  mentionsCompetitor,
  mentionsPassGuarantee,
  type Testimonial,
} from "@/lib/testimonials";
import { hasPassGuarantee } from "@/lib/pass-guarantee";

// NOTE: This component previously hardcoded fabricated placeholder personas
// (e.g. "Jennifer M.", "David R.", "Angela S.", "Patricia L.", "Robert K.")
// and rendered them as if they were real student/agent reviews. Those
// people do not exist. Displaying invented named testimonials as real
// social proof is deceptive under FTC guidance on endorsements, so all
// fabricated personas have been removed. This component now only renders
// real testimonials sourced from src/lib/testimonials.ts (real YouTube
// comments, real Google reviews). If no real testimonial exists for a given
// variant (this is currently the case for CE — there are zero real CE
// reviews), the component renders nothing rather than show a placeholder.

export interface LeadTestimonial {
  quote: string;
  name: string;
  title: string;
  /** When present, renders a YouTube source link on the card */
  youtubeVideoId?: string;
}

interface TestimonialCardsProps {
  leadTestimonial?: LeadTestimonial;
  variant?: "prelicensing" | "ce";
  /** Unused — kept for call-site compatibility with existing pages. */
  seed?: string;
  /** When set, prioritizes real testimonials (YouTube/Google) matching this
   * state before falling back to other real testimonials. No fabricated
   * placeholders are ever used. */
  stateName?: string;
  /** State page slug (e.g. "ohio"). When the state excludes the pass
   * guarantee (Ohio Admin. Code 3901-5-07(H)(16)), testimonials whose text
   * mentions the guarantee are filtered out of every selection path.
   * Omit on national pages — rendering is unchanged. */
  stateSlug?: string;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  text,
  stars,
  initials,
  youtubeVideoId,
}: {
  name: string;
  role: string;
  text: string;
  stars: number;
  initials: string;
  youtubeVideoId?: string;
}) {
  const isYoutube = Boolean(youtubeVideoId);
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col">
      <StarRating count={stars} />
      <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6 flex-grow">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isYoutube ? "bg-red-600" : "bg-navy"}`}>
          <span className="text-white font-bold text-xs">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-navy text-sm flex items-center gap-2 flex-wrap">
            {name}
            {isYoutube && (
              <a
                href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="See this comment on YouTube (opens in new tab)"
                className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded transition-colors"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                YouTube<span aria-hidden="true" className="text-[9px]">↗</span>
              </a>
            )}
          </p>
          <p className="text-gray-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Pick up to `count` real testimonials from the unified testimonials.ts
 * source (YouTube comments, Google reviews — no fabricated personas),
 * prioritizing state-matched testimonials, then stateless ones, then
 * testimonials tagged with a different state (shown with a state label).
 */
function pickFromUnified(
  stateName: string,
  count: number,
  variant: "prelicensing" | "ce",
  excludeGuaranteeMentions: boolean
): Testimonial[] {
  const isCE = variant === "ce";
  const pool = ALL_TESTIMONIALS.filter(
    (t) =>
      // ALL_TESTIMONIALS is already competitor-filtered at the source; this
      // re-applies the gate as defense in depth, so the component stays safe
      // even if it is ever pointed at a raw/unfiltered array.
      isDisplayable(t) &&
      (isCE ? t.source === "ce-renewal" : t.source !== "ce-renewal") &&
      (!excludeGuaranteeMentions || !mentionsPassGuarantee(t))
  );

  const stateMatches = (t: Testimonial) =>
    t.state?.toLowerCase() === stateName.toLowerCase();
  const isStateless = (t: Testimonial) => !t.state;
  const isMismatch = (t: Testimonial) => t.state && !stateMatches(t);

  // Priority tiers:
  // 1. State-matched testimonials (best — directly relevant)
  // 2. Stateless testimonials (neutral — no state claim, safe on any page)
  // 3. State-mismatched testimonials (last resort — displayed with state tag)
  // Within each tier, prefer YouTube > Google > verified-student for credibility.
  const stateYoutube = pool.filter((t) => t.source === "youtube" && stateMatches(t));
  const stateGoogle = pool.filter((t) => t.source === "google" && stateMatches(t));
  const stateVerified = pool.filter((t) => t.source === "verified-student" && stateMatches(t));

  const statelessYoutube = pool.filter((t) => t.source === "youtube" && isStateless(t));
  const statelessGoogle = pool.filter((t) => t.source === "google" && isStateless(t));
  const statelessVerified = pool.filter((t) => t.source === "verified-student" && isStateless(t));

  const mismatchYoutube = pool.filter((t) => t.source === "youtube" && isMismatch(t));
  const mismatchGoogle = pool.filter((t) => t.source === "google" && isMismatch(t));
  const mismatchVerified = pool.filter((t) => t.source === "verified-student" && isMismatch(t));

  const combined = [
    ...stateYoutube,
    ...stateGoogle,
    ...stateVerified,
    ...statelessYoutube,
    ...statelessGoogle,
    ...statelessVerified,
    ...mismatchYoutube,
    ...mismatchGoogle,
    ...mismatchVerified,
  ];
  // Deduplicate by name+text
  const seen = new Set<string>();
  const unique: Testimonial[] = [];
  for (const t of combined) {
    const key = t.name + "|" + t.text.slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(t);
  }
  return unique.slice(0, count);
}

export default function TestimonialCards({ leadTestimonial, variant = "prelicensing", stateName, stateSlug }: TestimonialCardsProps) {
  const isCE = variant === "ce";
  // Ohio Admin. Code 3901-5-07(H)(16): on excluded-state pages, no
  // testimonial that mentions the pass guarantee may render. When
  // stateSlug is absent (national pages) nothing is filtered.
  const guaranteeAllowed = hasPassGuarantee(stateSlug);
  const excludeGuaranteeMentions = !guaranteeAllowed;

  const heading = isCE ? "What Our Agents Say" : "What Our Students Say";

  // A caller-supplied lead testimonial must itself be a real quote (this
  // prop exists for real attributed leads, e.g. a specific YouTube/Google
  // review a page wants pinned first) — no fabricated fallback is used if
  // it's missing or filtered out.
  //
  // This prop bypasses ALL_TESTIMONIALS, so the source-level filter cannot see
  // it: the competitor gate has to be applied to the raw quote here, or a page
  // could pin a lead that names a competitor and it would render unfiltered.
  const safeLead =
    leadTestimonial &&
    !mentionsCompetitor({ text: leadTestimonial.quote }) &&
    (guaranteeAllowed || !mentionsPassGuarantee({ text: leadTestimonial.quote }))
      ? leadTestimonial
      : undefined;

  const leadCard = safeLead ? (
    <TestimonialCard
      key="lead"
      name={safeLead.name}
      role={safeLead.title}
      text={safeLead.quote}
      stars={5}
      initials={getInitials(safeLead.name)}
      youtubeVideoId={safeLead.youtubeVideoId}
    />
  ) : null;

  // Fill remaining slots from real testimonials only (YouTube comments,
  // Google reviews). Prioritizes matches for `stateName` when provided;
  // otherwise (e.g. the CE hub, which has no single state) just returns
  // the best available real testimonials. For CE, ALL_TESTIMONIALS
  // currently has zero entries with source "ce-renewal" — there are no
  // real CE reviews yet — so this correctly returns an empty array.
  const fillCount = safeLead ? 2 : 3;
  const fillPicks = pickFromUnified(stateName ?? "", fillCount, variant, excludeGuaranteeMentions);
  const fillCards = fillPicks.map((t) => (
    <TestimonialCard
      key={`${t.name}-${t.videoId ?? ""}-${t.text.slice(0, 24)}`}
      name={t.name}
      role={
        t.source === "youtube"
          ? `via YouTube comment${t.licenseType ? " · " + t.licenseType : t.state ? " · " + t.state : ""}`
          : t.source === "google"
          ? `via Google Review${t.state ? " · " + t.state : ""}`
          : t.licenseType
          ? `${t.licenseType} Agent${t.state ? " · " + t.state : ""}`
          : `Licensed${t.state ? " · " + t.state : ""}`
      }
      text={t.text}
      stars={5}
      initials={t.initials}
      youtubeVideoId={t.videoId}
    />
  ));

  const cards = [leadCard, ...fillCards].filter(
    (c): c is React.ReactElement => c !== null
  );

  // No real testimonials available for this variant (e.g. CE, which has
  // no real reviews yet) — render nothing rather than show a placeholder.
  if (cards.length === 0) return null;

  return (
    <section className="bg-gray-bg py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
          {heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{cards}</div>
        {/* FTC 16 CFR 255.2(b): the typicality disclosure must accompany the
            endorsements wherever they render — not only on /reviews. */}
        <p className="text-xs text-gray-500 text-center mt-6 max-w-2xl mx-auto">
          Real student feedback from public reviews and comments. Testimonials
          reflect individual experiences — individual results vary and are not
          a guarantee of passing or of similar outcomes.
        </p>
      </div>
    </section>
  );
}
