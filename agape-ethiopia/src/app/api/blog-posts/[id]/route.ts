import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireAdmin } from "@/lib/auth/serverAuth";

type RouteContext = { params: Promise<{ id: string }> };
type BlogPostUpdate = {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  status?: "draft" | "published";
  is_featured?: boolean;
  published_at?: string | null;
};

function makeSlug(title: string) {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export async function PUT(req: Request, context: RouteContext) {
  const profile = await requireAdmin();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  try {
    const body = await req.json() as Record<string, unknown>;
    const { id } = await context.params;
    const update: BlogPostUpdate = {};

    if (typeof body.title === "string") {
      const title = body.title.trim();
      if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
      update.title = title;
      update.slug = makeSlug(title);
      if (!update.slug) return NextResponse.json({ error: "Title must include letters or numbers." }, { status: 400 });
    }
    if (typeof body.content === "string") {
      if (!body.content.trim()) return NextResponse.json({ error: "Content is required." }, { status: 400 });
      update.content = body.content;
    }
    if (typeof body.excerpt === "string") update.excerpt = body.excerpt;
    if (body.excerpt === null) update.excerpt = null;
    if (typeof body.featured_image_url === "string") update.featured_image_url = body.featured_image_url;
    if (body.featured_image_url === null) update.featured_image_url = null;
    if (typeof body.is_featured === "boolean") update.is_featured = body.is_featured;

    if (body.status !== undefined) {
      if (body.status !== "draft" && body.status !== "published") {
        return NextResponse.json({ error: "Status must be draft or published." }, { status: 400 });
      }
      update.status = body.status;
      const { data: current, error: currentError } = await supabase
        .from("blog_posts")
        .select("id,status,published_at")
        .eq("id", id)
        .maybeSingle();
      if (currentError) return NextResponse.json({ error: currentError.message }, { status: 500 });
      if (!current) return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
      update.published_at = body.status === "published"
        ? current.status === "published" ? current.published_at ?? new Date().toISOString() : new Date().toISOString()
        : null;
    }

    const { data, error } = await supabase.from("blog_posts").update(update).eq("id", id).select().maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update post." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const profile = await requireAdmin();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });

  const { id } = await context.params;
  const { data, error } = await supabase.from("blog_posts").delete().eq("id", id).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  return NextResponse.json({ message: "Blog post deleted." });
}