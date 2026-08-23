import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

const allowedStatuses = new Set(["Pending Review", "Pending", "Under Review", "Approved", "Rejected"]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { status?: string; internal_notes?: string | null };
  try {
    body = (await request.json()) as { status?: string; internal_notes?: string | null };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const changes: { status?: string; internal_notes?: string | null; reviewed_by?: string; reviewed_at?: string | null } = {};
  if (body.status !== undefined) {
    if (!allowedStatuses.has(body.status)) {
      return NextResponse.json({ error: "Invalid agreement status." }, { status: 400 });
    }
    changes.status = body.status;
    changes.reviewed_by = profile.id;
    changes.reviewed_at = new Date().toISOString();
  }
  if (body.internal_notes !== undefined) {
    const notes = body.internal_notes?.trim() || null;
    if (notes && notes.length > 2000) {
      return NextResponse.json({ error: "Review comments must be 2,000 characters or fewer." }, { status: 400 });
    }
    changes.internal_notes = notes;
  }
  if (Object.keys(changes).length === 0) {
    return NextResponse.json({ error: "No agreement changes were provided." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const { data, error } = await supabase
    .from("organization_agreements")
    .update(changes)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) {
    console.error("Agreement review update failed:", error);
    return NextResponse.json({ error: "Agreement review could not be saved." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Agreement not found." }, { status: 404 });
  }

  return NextResponse.json({ agreement: data });
}