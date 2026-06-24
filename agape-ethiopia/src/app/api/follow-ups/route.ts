import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/serverAuth";
import { getSupabaseBrowserClient } from "@/lib/auth/supabaseBrowser";

export async function POST(req: Request) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { beneficiary_id, follow_up_date, notes, status } = body;

  if (!beneficiary_id || !follow_up_date) {
    return NextResponse.json({ error: "Missing required follow-up fields." }, { status: 400 });
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("follow_ups")
    .insert([
      {
        beneficiary_id,
        follow_up_date: follow_up_date ? new Date(follow_up_date) : new Date(),
        notes: notes?.trim() ?? null,
        status: status?.trim() || "scheduled",
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
