import React from "react";
import Link from "next/link";

interface BlogPaginationProps {
  currentCluster: string;
  allClusters: Array<{ slug: string; name: string }>;
}

export default function BlogPagination({ currentCluster, allClusters }: BlogPaginationProps) {
  // Sort clusters alphabetically by name
  const sorted = [...allClusters].sort((a, b) => a.name.localeCompare(b.name));
  const currentIndex = sorted.findIndex((c) => c.slug === currentCluster);

  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-8 border-t border-gray-200 mt-12"
      aria-label="Cluster pagination"
    >
      {/* Previous */}
      <div className="flex-1">
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="group flex flex-col items-start gap-0.5 p-4 rounded-xl border border-gray-200 bg-white hover:border-navy hover:shadow-sm transition-all"
          >
            <span className="text-gray-500 text-xs uppercase tracking-wide font-semibold flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous Cluster
            </span>
            <span className="text-navy font-bold text-sm group-hover:text-gold transition-colors">
              {prev.name}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Next */}
      <div className="flex-1 flex justify-end">
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="group flex flex-col items-end gap-0.5 p-4 rounded-xl border border-gray-200 bg-white hover:border-navy hover:shadow-sm transition-all w-full sm:w-auto sm:min-w-[220px]"
          >
            <span className="text-gray-500 text-xs uppercase tracking-wide font-semibold flex items-center gap-1">
              Next Cluster
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
            <span className="text-navy font-bold text-sm group-hover:text-gold transition-colors">
              {next.name}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
