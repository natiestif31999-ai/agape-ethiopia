import { NextResponse } from "next/server";
import { getSupabaseServerClient, getCurrentUser } from "@/lib/auth/serverAuth";

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    return "Password must include uppercase, lowercase, and a number.";
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const currentUser = await getCurrentUser();

    if (!supabase || !currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const currentPassword = String(body.currentPassword ?? "");
    const newPassword = String(body.newPassword ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "Please complete all password fields." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
    }

    if (newPassword === currentPassword) {
      return NextResponse.json({ error: "New password must differ from the current password." }, { status: 400 });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    if (!currentUser.email) {
      return NextResponse.json({ error: "Your account is not fully configured." }, { status: 400 });
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: currentUser.email,
      password: currentPassword,
    });

    if (reauthError) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      return NextResponse.json({ error: updateError.message || "Unable to update password." }, { status: 400 });
    }

    await supabase
      .from("users")
      .update({ password_change_required: false, updated_at: new Date().toISOString() })
      .eq("id", currentUser.id);

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update password." }, { status: 500 });
  }
}
