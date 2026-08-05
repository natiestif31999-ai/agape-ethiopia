import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

function parseNumeric(value: unknown): number | null {
  const normalized = value === undefined || value === null ? "" : String(value).trim();
  if (normalized === "") {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

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
    armrest_height,
    footrest_length,
    overall_height,
    weight,
    recommended_equipment,
    recommended_size,
    assessor_name,
    assessment_date,
    notes,
    measurements,
    wheelchair_fit,
    recommendations,
  } = body;

  if (!beneficiary_id || !assessor_name) {
    return NextResponse.json({ error: "Missing required assessment fields." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const measurementSummary = [measurements, [hip_width, seat_depth, back_height].filter(Boolean).join(" | ")].filter(Boolean).join("\n") || null;
  const recommendationSummary = recommendations || [recommended_equipment, recommended_size].filter(Boolean).join(" / ") || null;

  const { data, error } = await supabase.from("assessments").insert([
    {
      beneficiary_id,
      hip_width: hip_width?.trim() ?? null,
      hip_width_value: parseNumeric(hip_width),
      seat_depth: seat_depth?.trim() ?? null,
      seat_depth_value: parseNumeric(seat_depth),
      back_height: back_height?.trim() ?? null,
      back_height_value: parseNumeric(back_height),
      armrest_height: armrest_height?.trim() ?? null,
      arm_rest_height_value: parseNumeric(armrest_height),
      footrest_length: footrest_length?.trim() ?? null,
      foot_rest_height_value: parseNumeric(footrest_length),
      overall_height: overall_height?.trim() ?? null,
      height_value: parseNumeric(overall_height),
      weight: weight?.trim() ?? null,
      weight_value: parseNumeric(weight),
      recommended_equipment: recommended_equipment?.trim() ?? null,
      recommended_size: recommended_size?.trim() ?? null,
      assessor_name: assessor_name?.trim() ?? null,
      assessment_date: assessment_date ? new Date(assessment_date) : new Date(),
      notes: notes?.trim() ?? null,
      measurements: measurementSummary,
      wheelchair_fit: wheelchair_fit?.trim() ?? null,
      recommendations: recommendationSummary,
    },
  ]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
