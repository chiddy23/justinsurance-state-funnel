import React from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
  showCluster?: boolean;
  featured?: boolean;
}

export default function BlogCard({ post, showCluster = false, featured = false }: BlogCardProps) {
  const href = `/blog/${post.cluster}/${post.slug}`;

  if (featured) {
    return (
      <article className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 flex flex-col md:flex-row group hover:shadow-lg transition-shadow">
        {/* Image — wider on featured */}
        <div className="relative md:w-2/5 flex-shrink-0">
          <Link href={href} aria-label={post.title} tabIndex={-1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.imageAlt}
              loading="lazy"
              className="w-full h-56 md:h-full object-cover"
            />
          </Link>
        </div>

        {/* Body */}
        <div className="flex flex-col justify-center p-6 md:p-8 flex-1">
          {showCluster && (
            <p className="text-gold font-semibold text-xs uppercase tracking-widest mb-2">
              {post.clusterName}
            </p>
          )}
          <h3 className="text-xl md:text-2xl font-bold text-navy leading-snug mb-3 group-hover:text-gold transition-colors">
            <Link href={href}>{post.title}</Link>
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {post.description}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs">{post.date}</p>
            <Link
              href={href}
              className="text-navy font-semibold text-sm hover:text-gold transition-colors inline-flex items-center gap-1"
            >
              Read more &rarr;
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex flex-col group hover:shadow-md transition-shadow">
      {/* 16:9 image wrapper */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <Link href={href} aria-label={post.title} tabIndex={-1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.imageAlt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {showCluster && (
          <p className="text-gold font-semibold text-xs uppercase tracking-widest mb-2">
            {post.clusterName}
          </p>
        )}
        <h3 className="text-base font-bold text-navy leading-snug mb-2 line-clamp-2 group-hover:text-gold transition-colors">
          <Link href={href}>{post.title}</Link>
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {post.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <p className="text-gray-500 text-xs">{post.date}</p>
          <Link
            href={href}
            className="text-navy font-semibold text-sm hover:text-gold transition-colors inline-flex items-center gap-1"
          >
            Read more &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
