import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

const BUCKET = "organization-agreements";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getSupabaseConfig();
  if (!config.serviceRoleKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const serverClient = getSupabaseServerClient();
  if (!serverClient) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data: agreement, error: agreementError } = await serverClient
    .from("organization_agreements")
    .select("agreement_file_path")
    .eq("id", id)
    .maybeSingle();
  if (agreementError || !agreement?.agreement_file_path) {
    return NextResponse.json({ error: "Agreement file not found." }, { status: 404 });
  }

  const adminClient = createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await adminClient.storage
    .from(BUCKET)
    .createSignedUrl(agreement.agreement_file_path, 3600);
  if (error || !data?.signedUrl) {
    console.error("Staff agreement signed URL generation failed:", error);
    return NextResponse.json({ error: "Agreement file is unavailable." }, { status: 502 });
  }

  return NextResponse.json({ url: data.signedUrl });
}