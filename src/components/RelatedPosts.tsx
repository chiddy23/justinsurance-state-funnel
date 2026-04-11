import React from "react";
import type { BlogPost } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

interface RelatedPostsProps {
  posts: BlogPost[];
  heading?: string;
}

export default function RelatedPosts({ posts, heading = "Related Articles" }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-12 border-t border-gray-200 mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-navy mb-8">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} showCluster={false} />
        ))}
      </div>
    </section>
  );
}
