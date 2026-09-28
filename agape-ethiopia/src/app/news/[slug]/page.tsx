type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
};

async function getPost(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/blog-posts?status=published&limit=200`, { cache: "no-store" });
  if (!response.ok) return null;
  const result = (await response.json()) as { data?: BlogPost[] };
  return (result.data ?? []).find((post) => post.slug === slug) ?? null;
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Post not found</h1>
        <p className="mt-3 text-slate-600">The requested news item could not be found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 lg:px-8">
      {post.featured_image_url && (
        <img src={post.featured_image_url} alt={post.title} className="mb-6 aspect-video w-full rounded-2xl object-cover shadow-sm" />
      )}
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">News & Activities</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">{post.title}</h1>
      {post.published_at && <time className="mt-3 block text-sm text-slate-500" dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString()}</time>}
      <article className="prose prose-slate mt-8 max-w-none leading-7 text-slate-700">
        {post.content ? post.content.split("\n").map((paragraph, index) => (
          <p key={`${post.id}-${index}`} className="mb-4">{paragraph}</p>
        )) : <p>{post.excerpt || "This story is unavailable at the moment."}</p>}
      </article>
    </main>
  );
}
