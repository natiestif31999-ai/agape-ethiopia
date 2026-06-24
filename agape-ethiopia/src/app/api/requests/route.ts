import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/serverAuth";
import { getSupabaseBrowserClient } from "@/lib/auth/supabaseBrowser";

export async function GET(req: Request) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get("status")?.trim();

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  let query = supabase.from("requests").select("*").order("created_at", { ascending: false }).limit(50);
  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
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
  const { beneficiary_name, item_needed, need_details, beneficiary_id, status } = body;

  if (!beneficiary_name || !item_needed) {
    return NextResponse.json({ error: "Missing required request fields." }, { status: 400 });
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("requests")
    .insert([
      {
        beneficiary_name: beneficiary_name?.trim() ?? null,
        item_needed: item_needed?.trim() ?? null,
        need_details: need_details?.trim() ?? null,
        beneficiary_id: beneficiary_id?.trim() ?? null,
        status: status?.trim() || "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
