import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase/env";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const registrationNumber = url.searchParams.get("registration_number")?.trim();

  if (!registrationNumber) {
    return NextResponse.json({ error: "Registration number is required." }, { status: 400 });
  }

  const config = getSupabaseConfig();
  const configError = getSupabaseConfigError(config);

  if (configError || !config.url || !config.anonKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const supabase = createClient(config.url, config.anonKey);
  const { data, error } = await supabase
    .from("beneficiaries")
    .select("registration_number,status,first_name,middle_name,last_name,phone,region,kebele")
    .eq("registration_number", registrationNumber)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Registration number was not found." }, { status: 404 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
