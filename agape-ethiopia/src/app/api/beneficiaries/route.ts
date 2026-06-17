import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/serverAuth";

export async function POST(req: Request) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    registration_date,
    first_name,
    fathers_name,
    grandfathers_name,
    date_of_birth,
    gender,
    phone,
    region,
    kifle_ketema,
    woreda_zone,
    house_number,
    notes,
    photo_url,
  } = body;

  if (!first_name || !grandfathers_name || !gender || !phone || !region || !woreda_zone) {
    return NextResponse.json({ error: "Missing required beneficiary fields." }, { status: 400 });
  }

  if (!["male", "female"].includes(gender)) {
    return NextResponse.json({ error: "Invalid gender value." }, { status: 400 });
  }

  const supabase = (await import("@/lib/auth/supabaseBrowser")).supabaseBrowser;
  const { data, error } = await supabase.from("beneficiaries").insert([
    {
      registration_date: registration_date || new Date().toISOString().slice(0, 10),
      first_name: first_name.trim(),
      fathers_name: fathers_name.trim(),
      grandfathers_name: grandfathers_name.trim(),
      date_of_birth: date_of_birth || null,
      gender,
      phone: phone.trim(),
      region: region.trim(),
      kifle_ketema: kifle_ketema?.trim() ?? null,
      woreda_zone: woreda_zone.trim(),
      house_number: house_number?.trim() ?? null,
      notes: notes?.trim() ?? null,
      photo_url: photo_url?.trim() ?? null,
    },
  ]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
