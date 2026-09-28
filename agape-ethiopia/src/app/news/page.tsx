import Link from "next/link";

async function getPosts() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/blog-posts?status=published&limit=50`, { cache: "no-store" });
  if (!response.ok) return [];
  const result = (await response.json()) as { data?: Array<{ id: string; title: string; slug: string; excerpt: string | null; content: string | null; featured_image_url: string | null; published_at: string | null }> };
  return result.data ?? [];
}

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">News & Activities</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Latest News & Activities</h1>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          No posts are published yet. Check back soon.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {post.featured_image_url && (
                <img src={post.featured_image_url} alt={post.title} className="aspect-video w-full object-cover" />
              )}
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Recent update"}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-700">{post.excerpt || post.content || "Read the latest update from AGAPE Mobility Ethiopia."}</p>
                <Link href={`/news/${post.slug}`} className="mt-4 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">Read more</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
