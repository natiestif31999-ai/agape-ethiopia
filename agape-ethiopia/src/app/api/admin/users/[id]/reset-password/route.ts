import { NextResponse } from "next/server";
import { getSupabaseServerClient, requireAdmin } from "@/lib/auth/serverAuth";

function generateTemporaryPassword() {
  return `Temp-${Math.random().toString(36).slice(2, 10)}!A`;
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminProfile = await requireAdmin();
    if (!adminProfile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    }

    const targetUser = await supabase.from("users").select("id,email,role").eq("id", id).maybeSingle();
    if (targetUser.error || !targetUser.data) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const tempPassword = generateTemporaryPassword();
    const { error: authError } = await supabase.auth.admin.updateUserById(id, {
      password: tempPassword,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: "Unable to reset password." }, { status: 400 });
    }

    await supabase
      .from("users")
      .update({ password_change_required: true, updated_at: new Date().toISOString() })
      .eq("id", id);

    return NextResponse.json({
      message: "Temporary password generated successfully.",
      requiresPasswordChange: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to reset password." }, { status: 500 });
  }
}
