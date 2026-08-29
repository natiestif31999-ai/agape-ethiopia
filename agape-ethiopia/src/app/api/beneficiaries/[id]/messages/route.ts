import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";
import { logAudit } from "@/lib/audit/auditLog";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const profile = await requireStaff();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { id } = await context.params;
  const { data, error } = await supabase.from("beneficiary_messages").select("id,message,created_at,sender_email").eq("beneficiary_id", id).order("created_at", { ascending: false });
  if (error) {
    console.error("Beneficiary messages load failed:", error);
    return NextResponse.json({ error: "Messages could not be loaded." }, { status: 500 });
  }
  return NextResponse.json({ messages: data ?? [] });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const profile = await requireStaff();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { message?: string };
  try {
    body = (await request.json()) as { message?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const message = body.message?.trim() || "";
  if (!message || message.length > 4000) return NextResponse.json({ error: "Message must be between 1 and 4,000 characters." }, { status: 400 });
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const { id } = await context.params;
  const { data, error } = await supabase.from("beneficiary_messages").insert({ beneficiary_id: id, sender_id: profile.id, sender_email: profile.email, message }).select("id,message,created_at,sender_email").single();
  if (error) {
    console.error("Beneficiary message save failed:", error);
    return NextResponse.json({ error: "Message could not be saved." }, { status: 500 });
  }
  await logAudit(profile.id, profile.email, "beneficiary_message_sent", "beneficiary", id, { message });
  return NextResponse.json({ message: data }, { status: 201 });
}