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

  const { data, error } = await supabase.from("inventory").select("*").order("item_name", { ascending: true });
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
  const { item_name, item_type, quantity, unit, status, notes } = body;

  if (!item_name || !item_type) {
    return NextResponse.json({ error: "Missing required inventory fields." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("inventory")
    .insert([
      {
        item_name: item_name?.trim() ?? null,
        item_type: item_type?.trim() ?? null,
        quantity: Number(quantity) || 0,
        unit: unit?.trim() ?? null,
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
