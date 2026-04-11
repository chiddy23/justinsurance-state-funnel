import React from "react";
import Link from "next/link";

interface ClusterSummary {
  slug: string;
  name: string;
  postCount: number;
  description?: string;
}

interface BlogClusterGridProps {
  clusters: ClusterSummary[];
}

export default function BlogClusterGrid({ clusters }: BlogClusterGridProps) {
  if (!clusters || clusters.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {clusters.map((cluster) => (
        <Link
          key={cluster.slug}
          href={`/blog/${cluster.slug}`}
          className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-navy hover:shadow-md transition-all flex flex-col"
        >
          {/* Post count badge */}
          <p className="text-gold font-semibold text-xs uppercase tracking-widest mb-3">
            {cluster.postCount} {cluster.postCount === 1 ? "article" : "articles"}
          </p>

          {/* Cluster name */}
          <h3 className="text-lg font-bold text-navy leading-snug mb-2 group-hover:text-gold transition-colors">
            {cluster.name}
          </h3>

          {/* Optional description */}
          {cluster.description && (
            <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
              {cluster.description}
            </p>
          )}

          {/* CTA */}
          <p className="mt-auto pt-3 border-t border-gray-100 text-navy font-semibold text-sm group-hover:text-gold transition-colors inline-flex items-center gap-1">
            Browse articles &rarr;
          </p>
        </Link>
      ))}
    </div>
  );
}
