import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/serverAuth";
import { getSupabaseBrowserClient } from "@/lib/auth/supabaseBrowser";

export async function POST(req: Request) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    beneficiary_id,
    hip_width,
    seat_depth,
    back_height,
    recommended_equipment,
    recommended_size,
    assessor_name,
    assessment_date,
    notes,
  } = body;

  if (!beneficiary_id || !assessor_name || !recommended_equipment || !recommended_size) {
    return NextResponse.json({ error: "Missing required assessment fields." }, { status: 400 });
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase.from("assessments").insert([
    {
      beneficiary_id,
      hip_width: hip_width?.trim() ?? null,
      seat_depth: seat_depth?.trim() ?? null,
      back_height: back_height?.trim() ?? null,
      recommended_equipment: recommended_equipment?.trim() ?? null,
      recommended_size: recommended_size?.trim() ?? null,
      assessor_name: assessor_name?.trim() ?? null,
      assessment_date: assessment_date ? new Date(assessment_date) : new Date(),
      notes: notes?.trim() ?? null,
    },
  ]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
