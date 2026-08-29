import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

const BUCKET = "organization-agreements";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { searchParams } = new URL(request.url);
  const publicMode = searchParams.get("public") === "1" || searchParams.get("mode") === "public";
  const suppliedEmail = searchParams.get("email")?.trim().toLowerCase() ?? null;

  if (!publicMode) {
    const profile = await requireStaff();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const config = getSupabaseConfig();
  if (!config.serviceRoleKey) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const userClient = getSupabaseServerClient();
  if (!userClient) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data: agreement, error: agreementError } = await userClient
    .from("organization_agreements")
    .select("agreement_file_path, email")
    .eq("id", id)
    .maybeSingle();
  if (agreementError || !agreement?.agreement_file_path) {
    return NextResponse.json({ error: "Agreement file not found." }, { status: 404 });
  }

  if (publicMode) {
    if (!suppliedEmail || !agreement.email || agreement.email.trim().toLowerCase() !== suppliedEmail) {
      return NextResponse.json({ error: "This agreement is only viewable with the matching email address." }, { status: 403 });
    }
  }

  const adminClient = createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await adminClient.storage
    .from(BUCKET)
    .createSignedUrl(agreement.agreement_file_path, 3600);
  if (error || !data?.signedUrl) {
    console.error("Agreement signed URL generation failed:", error);
    return NextResponse.json({ error: "Agreement file is unavailable." }, { status: 502 });
  }

  return NextResponse.json({ url: data.signedUrl });
}