import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const limit = Number(url.searchParams.get("limit") ?? 20);
  const offset = Number(url.searchParams.get("offset") ?? 0);

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    let query = supabase.from("blog_posts").select("*", { count: "exact" });

    // Public only sees published posts
    // Staff sees all posts
    const profile = await getSupabaseServerClient();
    if (profile) {
      // Authenticated - allow all statuses
    } else {
      // Public - only published
      query = query.eq("status", "published");
    }

    if (status && status.toLowerCase() !== "all") {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query.order("published_at", { ascending: false }).range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, total: count });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to fetch posts." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, content, excerpt, featured_image_url, status, is_featured } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "title and content are required." }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title,
          slug,
          content,
          excerpt: excerpt || content.slice(0, 200),
          featured_image_url,
          author_id: profile.id,
          status: status || "draft",
          is_featured: is_featured || false,
          published_at: status === "published" ? new Date().toISOString() : null,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Blog post created successfully.", data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create post." }, { status: 500 });
  }
}
