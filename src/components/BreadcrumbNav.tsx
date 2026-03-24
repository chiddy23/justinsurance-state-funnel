import React from "react";
import Link from "next/link";

interface Crumb {
  name: string;
  href?: string;
}

interface BreadcrumbNavProps {
  crumbs: Crumb[];
}

export default function BreadcrumbNav({ crumbs }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="max-w-7xl mx-auto">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {isLast || !crumb.href ? (
                  <span className="text-navy font-medium" aria-current={isLast ? "page" : undefined}>
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-navy hover:underline transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
