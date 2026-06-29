import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

export async function GET() {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false }).limit(20);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { item_type, quantity, status, notes } = body;

  if (!item_type) {
    return NextResponse.json({ error: "Missing required donation fields." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("donations")
    .insert([
      {
        item_type: item_type?.trim() ?? null,
        quantity: Number(quantity) || 0,
        status: status?.trim() || "available",
        notes: notes?.trim() ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
