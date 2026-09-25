"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type BlogPost = {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  status: "draft" | "published";
  is_featured: boolean;
  published_at: string | null;
};

type BlogForm = {
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  status: "draft" | "published";
  is_featured: boolean;
};

const emptyForm: BlogForm = {
  title: "",
  content: "",
  excerpt: "",
  featured_image_url: "",
  status: "draft",
  is_featured: false,
};

export default function AdminBlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/blog-posts?status=all&limit=100", { cache: "no-store" });
      const result = await response.json() as { data?: BlogPost[]; error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to load blog posts.");
      setPosts(result.data ?? []);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load blog posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  function editPost(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      content: post.content ?? "",
      excerpt: post.excerpt ?? "",
      featured_image_url: post.featured_image_url ?? "",
      status: post.status === "published" ? "published" : "draft",
      is_featured: post.is_featured,
    });
    setMessage("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(editingId ? `/api/blog-posts/${encodeURIComponent(editingId)}` : "/api/blog-posts", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          excerpt: form.excerpt || null,
          featured_image_url: form.featured_image_url || null,
        }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || "Unable to save blog post.");
      setMessage(editingId ? "Blog post updated." : "Blog post created.");
      resetForm();
      await loadPosts();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save blog post.");
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(post: BlogPost) {
    if (!window.confirm(`Delete “${post.title}”?`)) return;
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/blog-posts/${encodeURIComponent(post.id)}`, { method: "DELETE" });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || "Unable to delete blog post.");
      if (editingId === post.id) resetForm();
      setMessage("Blog post deleted.");
      await loadPosts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete blog post.");
    }
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)]">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Blog posts</h2>
            <p className="mt-1 text-sm text-slate-600">Draft and published posts use the existing blog content table.</p>
          </div>
          <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">New post</button>
        </div>
        {loading ? <p className="text-sm text-slate-600">Loading posts...</p> : posts.length === 0 ? <p className="text-sm text-slate-600">No blog posts yet.</p> : (
          <ul className="divide-y divide-slate-200">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{post.title}</p>
                  <p className="text-sm text-slate-600">{post.status === "published" ? "Published" : "Draft"}{post.is_featured ? " · Featured" : ""}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => editPost(post)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm">Edit</button>
                  <button type="button" onClick={() => void deletePost(post)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={savePost} className="grid content-start gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">{editingId ? "Edit post" : "Create post"}</h2>
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">Title<input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">Excerpt<textarea rows={2} value={form.excerpt} onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))} className="rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">Content<textarea required rows={6} value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} className="rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">Featured image URL<input type="url" value={form.featured_image_url} onChange={(event) => setForm((current) => ({ ...current, featured_image_url: event.target.value }))} className="rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">Publication status<select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as BlogForm["status"] }))} className="rounded-lg border border-slate-300 px-3 py-2"><option value="draft">Draft</option><option value="published">Published</option></select></label>
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.is_featured} onChange={(event) => setForm((current) => ({ ...current, is_featured: event.target.checked }))} />Featured post</label>
        <div className="flex flex-wrap gap-2">
          <button disabled={saving} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : editingId ? "Save changes" : "Create post"}</button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel edit</button>}
        </div>
      </form>
    </section>
  );
}
