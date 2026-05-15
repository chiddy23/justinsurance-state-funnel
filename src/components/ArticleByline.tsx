import React from "react";
import Image from "next/image";
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
  lastReviewed = "May 2026",
}: ArticleBylineProps = {}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-gray-200 py-3 my-4 text-sm text-gray-600">
      {/* Reviewer headshot — small circular avatar */}
      <Image
        src="/headshot-justin.jpg"
        alt={`Headshot of ${name}`}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />


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
