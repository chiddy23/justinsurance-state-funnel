import React from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import LastUpdated from "@/components/LastUpdated";

interface BlogPostLayoutProps {
  post: BlogPost;
  htmlContent: string;
}

export default function BlogPostLayout({ post, htmlContent }: BlogPostLayoutProps) {
  return (
    <article>
      {/* ── Hero ── */}
      <header className="bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Cluster breadcrumb badge */}
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <Link
              href="/blog"
              className="text-blue-200 hover:text-gold text-sm font-medium transition-colors"
            >
              Blog
            </Link>
            <svg
              className="w-4 h-4 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link
              href={`/blog/${post.cluster}`}
              className="text-gold hover:text-gold-light text-sm font-semibold transition-colors"
            >
              {post.clusterName}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance mb-6">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-blue-200 text-sm">
            <span className="flex items-center gap-1.5">
              {/* Author icon */}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-white font-medium">{post.author}</span>
            </span>
            <span aria-hidden="true">&middot;</span>
            <time dateTime={post.date}>{post.date}</time>
            {post.type === "pillar" && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span className="bg-gold text-navy text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  Pillar Guide
                </span>
              </>
            )}
          </div>
        </div>

        {/* Hero image — full bleed below the text block */}
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.imageAlt}
            loading="eager"
            className="w-full rounded-t-xl object-cover max-h-[420px]"
          />
        </div>
      </header>

      {/* ── Article body ── */}
      <div className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Description / lead paragraph */}
          <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-gold pl-4 italic">
            {post.description}
          </p>

          {/* Prose content */}
          <div
            className={[
              "prose prose-lg max-w-none",
              // headings
              "prose-headings:text-navy prose-headings:font-bold prose-headings:scroll-mt-24",
              "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4",
              "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
              "prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2",
              // body
              "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4",
              // links
              "prose-a:text-navy prose-a:font-semibold prose-a:underline hover:prose-a:text-gold",
              // lists
              "prose-ul:text-gray-700 prose-ol:text-gray-700",
              "prose-li:my-1",
              // blockquote
              "prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-gray-bg prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-800",
              // strong
              "prose-strong:text-navy prose-strong:font-semibold",
              // code
              "prose-code:bg-gray-bg prose-code:text-navy prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
              // hr
              "prose-hr:border-gray-200 prose-hr:my-8",
              // table
              "prose-table:text-sm prose-th:text-navy prose-th:bg-gray-bg prose-td:text-gray-700",
            ].join(" ")}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Visible "Last updated" stamp — pairs with schema dateModified */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <LastUpdated date={post.date} />
          </div>
        </div>
      </div>
    </article>
  );
}
