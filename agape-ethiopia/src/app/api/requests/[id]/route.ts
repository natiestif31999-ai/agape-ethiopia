import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/serverAuth";
import { getSupabaseBrowserClient } from "@/lib/auth/supabaseBrowser";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase.from("requests").update({ status: body.status }).eq("id", id).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
