import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";
import { normalizeEthiopianPhone } from "@/lib/beneficiaryRegistration";

function normalizeRegionCode(value?: string | null) {
  const cleaned = (value ?? "").trim().toUpperCase().replace(/[^A-Z]/g, "");
  return cleaned ? cleaned.slice(0, 3) : null;
}

export async function GET(req: Request) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const limit = Number(url.searchParams.get("limit") ?? 25);

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  let query = supabase
    .from("beneficiaries")
    .select("id,beneficiary_id,registration_number,first_name,middle_name,last_name,phone,region,kebele,photo_url,created_at")
    .order("region", { ascending: true })
    .order("created_at", { ascending: true });

  if (search) {
    const orFilter = [
      `beneficiary_id.ilike.%${search}%`,
      `registration_number.ilike.%${search}%`,
      `first_name.ilike.%${search}%`,
      `middle_name.ilike.%${search}%`,
      `last_name.ilike.%${search}%`,
      `phone.ilike.%${search}%`,
      `region.ilike.%${search}%`,
      `kebele.ilike.%${search}%`,
    ].join(",");
    query = query.or(orFilter);
  }

  const { data, error } = await query.limit(Math.max(1, Math.min(limit, 100)));

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
  const {
    registration_date,
    first_name,
    middle_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    region,
    kifle_ketema,
    kebele,
    house_number,
    notes,
    photo_url,
    disability_type,
    referral_source,
    status,
  } = body;

  if (!first_name || !last_name || !gender || !phone || !region || !kebele) {
    return NextResponse.json({ error: "Missing required beneficiary fields." }, { status: 400 });
  }

  if (!['male', 'female'].includes(gender)) {
    return NextResponse.json({ error: "Invalid gender value." }, { status: 400 });
  }

  const normalizedPhone = normalizeEthiopianPhone(phone);
  if (!normalizedPhone) {
    return NextResponse.json({ error: "Please enter a valid Ethiopian phone number." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data: existingMatch, error: lookupError } = await supabase
    .from("beneficiaries")
    .select("id,first_name,last_name,phone")
    .or(`phone.eq.${normalizedPhone},phone.eq.${phone.trim()},phone.ilike.%${phone.trim()}%`)
    .limit(20);

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  if (existingMatch && existingMatch.length > 0) {
    return NextResponse.json({ error: "This phone number is already registered to a beneficiary." }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("beneficiaries")
    .insert([
      {
        beneficiary_id: null,
        registration_number: null,
        registration_date: registration_date || new Date().toISOString().slice(0, 10),
        first_name: first_name.trim(),
        middle_name: middle_name?.trim() ?? null,
        last_name: last_name.trim(),
        date_of_birth: date_of_birth || null,
        gender,
        phone: normalizedPhone,
        phone_normalized: normalizedPhone,
        region: region.trim(),
        region_code: normalizeRegionCode(region),
        kifle_ketema: kifle_ketema?.trim() ?? null,
        kebele: kebele.trim(),
        house_number: house_number?.trim() ?? null,
        notes: notes?.trim() ?? null,
        photo_url: photo_url?.trim() ?? null,
        disability_type: disability_type?.trim() ?? null,
        referral_source: referral_source?.trim() ?? null,
        status: status?.trim() || "registered",
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
