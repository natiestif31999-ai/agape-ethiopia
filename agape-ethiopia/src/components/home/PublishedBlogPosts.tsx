"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PublishedPost = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  published_at: string | null;
};

export default function PublishedBlogPosts() {
  const [posts, setPosts] = useState<PublishedPost[]>([]);

  useEffect(() => {
    let active = true;
    void fetch("/api/blog-posts?limit=3", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return [] as PublishedPost[];
        const result = await response.json() as { data?: PublishedPost[] };
        return result.data ?? [];
      })
      .then((data) => {
        if (active) setPosts(data);
      })
      .catch(() => {
        if (active) setPosts([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!posts.length) return null;

  return (
    <section className="border-t border-slate-200 pt-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-700">Updates</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Latest from Agape</h2>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {post.featured_image_url && (
              <Image src={post.featured_image_url} alt="" width={640} height={360} unoptimized className="aspect-video w-full object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-slate-900">{post.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">{post.excerpt || post.content}</p>
              {post.published_at && <time className="mt-3 block text-xs text-slate-500" dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString()}</time>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
