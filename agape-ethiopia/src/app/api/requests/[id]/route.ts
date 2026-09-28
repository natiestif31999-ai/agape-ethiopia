import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

const ALLOWED_STATUSES = new Set(["pending", "approved", "rejected", "matched", "delivered"]);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  if (typeof body.status !== "string" || !ALLOWED_STATUSES.has(body.status)) {
    return NextResponse.json({ error: "Invalid request status." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase.from("requests").update({ status: body.status }).eq("id", id).select().maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  return NextResponse.json({ data });
}
