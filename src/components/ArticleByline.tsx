import React from "react";
import Link from "next/link";

export interface ArticleBylineProps {
  /** Reviewer's full name. Defaults to Justin vom Eigen. */
  name?: string;
  /** Reviewer's job title (e.g. "Licensed Insurance Agent"). */
  title?: string;
  /** Internal bio page URL the name should link to. */
  bioUrl?: string;
  /**
   * Stable human-readable last-reviewed date (e.g. "April 2026").
   * String, NOT auto-current-date — keeps SEO snapshots stable.
   */
  lastReviewed?: string;
}

/**
 * <ArticleByline />
 *
 * Light eyebrow-style byline that sits between the article H1 and the article
 * body. Subtler and smaller than <AuthorBio /> (which is the rich end-of-post
 * card). One-line horizontal strip with avatar, reviewer name, title, and a
 * stable "Last reviewed" date.
 *
 * Defaults are wired so callers can use `<ArticleByline />` with no args.
 */
export default function ArticleByline({
  name = "Justin vom Eigen",
  title = "Licensed Insurance Agent",
  bioUrl = "/about/justin-vom-eigen",
  lastReviewed = "April 2026",
}: ArticleBylineProps = {}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-gray-200 py-3 my-4 text-sm text-gray-600">
      {/* Avatar — initials JVE on navy circle, mirrors AuthorBio styling but smaller */}
      <div
        className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        <span className="text-white font-bold text-[10px] tracking-wide select-none">
          JVE
        </span>
      </div>

      {/* Reviewer + title */}
      <span className="flex flex-wrap items-baseline gap-x-1.5">
        <span className="text-gray-500">Reviewed by</span>
        <Link
          href={bioUrl}
          className="font-semibold text-navy hover:text-gold transition-colors"
        >
          {name}
        </Link>
        <span className="text-gray-500">, {title}</span>
      </span>

      {/* Last reviewed date — pushed to the end on wider screens */}
      <span className="text-gray-500 sm:ml-auto">
        Last reviewed:{" "}
        <span className="text-navy font-medium">{lastReviewed}</span>
      </span>
    </div>
  );
}
