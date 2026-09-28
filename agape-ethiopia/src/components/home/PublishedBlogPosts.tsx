"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PublishedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  published_at: string | null;
};

export default function PublishedBlogPosts() {
  const [post, setPost] = useState<PublishedPost | null>(null);

  useEffect(() => {
    let active = true;
    void fetch("/api/blog-posts?featured=true&limit=1", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const result = await response.json() as { data?: PublishedPost[] };
        return result.data?.[0] ?? null;
      })
      .then((featuredPost) => {
        if (active) setPost(featuredPost);
      })
      .catch(() => {
        if (active) setPost(null);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!post) return null;

  const summary = post.excerpt?.trim() || post.content?.trim().slice(0, 180) || "";

  return (
    <aside aria-label="Featured activity" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Link href={`/news/${post.slug}`} aria-label={`Read more about ${post.title}`} className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
        {post.featured_image_url && <img src={post.featured_image_url} alt={post.title} className="aspect-[4/3] w-full object-cover" />}
        <div className="p-5">
          <p className="text-xs font-semibold uppercase text-emerald-700">Featured activity</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{post.title}</h2>
          {summary && <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-700">{summary}</p>}
          {post.published_at && <time className="mt-3 block text-xs text-slate-500" dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString()}</time>}
          <span className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white group-hover:bg-emerald-800">Read more</span>
        </div>
      </Link>
    </aside>
  );
}
