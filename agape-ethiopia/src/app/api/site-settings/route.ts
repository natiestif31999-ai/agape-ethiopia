import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireAdmin } from "@/lib/auth/serverAuth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const category = url.searchParams.get("category");

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  try {
    let query = supabase.from("site_settings").select("key,value,description,category,is_json");

    if (key) {
      query = query.eq("key", key);
    } else if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (key && (!data || data.length === 0)) {
      return NextResponse.json({ error: "Setting not found." }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to fetch settings." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const profile = await requireAdmin();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "key and value are required." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    }

    const { data, error } = await supabase
      .from("site_settings")
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Setting updated successfully.", data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update setting." }, { status: 500 });
  }
}
