import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

const REVIEW_STATUSES = new Set(["Pending Review", "Approved", "Rejected"]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { review_status?: string };
  try {
    body = await request.json() as { review_status?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.review_status || !REVIEW_STATUSES.has(body.review_status)) {
    return NextResponse.json({ error: "Invalid assessment review status." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { id } = await context.params;
  const reviewed = body.review_status !== "Pending Review";
  const { data, error } = await supabase
    .from("assessments")
    .update({
      review_status: body.review_status,
      reviewed_by: reviewed ? profile.id : null,
      reviewed_at: reviewed ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select("id,review_status,reviewed_by,reviewed_at")
    .maybeSingle();

  if (error) {
    console.error("Assessment review update failed:", error);
    return NextResponse.json({ error: "Assessment review could not be saved." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
  }

  return NextResponse.json({ assessment: data });
}