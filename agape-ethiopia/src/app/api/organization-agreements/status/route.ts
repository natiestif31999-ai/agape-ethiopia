import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  const email = searchParams.get("email")?.trim().toLowerCase();
  if (!id || !email) {
    return NextResponse.json({ error: "Submission ID and email are required." }, { status: 400 });
  }
  const config = getSupabaseConfig();
  if (!config.serviceRoleKey) {
    return NextResponse.json({ error: "Status lookup is temporarily unavailable." }, { status: 503 });
  }
  const supabase = createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase
    .from("organization_agreements")
    .select("id,organization_name,email,status,internal_notes,submitted_at,version_number,previous_submission_id")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("Agreement status lookup failed:", error);
    return NextResponse.json({ error: "Status lookup is temporarily unavailable." }, { status: 503 });
  }
  if (!data || data.email.toLowerCase() !== email) {
    return NextResponse.json({ error: "No matching submission was found." }, { status: 404 });
  }
  return NextResponse.json({ submission: {
    id: data.id,
    organizationName: data.organization_name,
    status: data.status,
    response: data.internal_notes,
    submittedAt: data.submitted_at,
    versionNumber: data.version_number,
    previousSubmissionId: data.previous_submission_id,
  } });
}