import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

export async function POST(req: Request) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    beneficiary_id,
    equipment_type,
    equipment_size,
    distribution_date,
    distribution_location,
    received_by,
    signature_confirmed,
    notes,
  } = body;

  if (!beneficiary_id || !equipment_type) {
    return NextResponse.json({ error: "Missing required distribution fields." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase.from("equipment_distributions").insert([
    {
      beneficiary_id,
      equipment_type: equipment_type?.trim() ?? null,
      equipment_size: equipment_size?.trim() ?? null,
      distribution_date: distribution_date ? new Date(distribution_date) : new Date(),
      distribution_location: distribution_location?.trim() ?? null,
      received_by: received_by?.trim() ?? null,
      signature_confirmed: Boolean(signature_confirmed),
      notes: notes?.trim() ?? null,
    },
  ]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
