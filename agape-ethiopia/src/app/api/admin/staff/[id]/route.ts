/**
 * AGAPE MOBILITY ETHIOPIA
 * Admin Staff Member Management API
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/serverAuth";
import { createClient } from "@supabase/supabase-js";

type StaffAction = "disable" | "enable" | "role-change" | "reset-password";

interface UpdateStaffRequest {
  action: StaffAction;
  role?: "Admin" | "Staff";
}

// PUT - Update staff member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: UpdateStaffRequest = await request.json();

    if (!body.action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    let updateData: Record<string, unknown> = {};

    switch (body.action) {
      case "disable":
        updateData = { is_disabled: true };
        break;
      case "enable":
        updateData = { is_disabled: false };
        break;
      case "role-change":
        if (!body.role) {
          return NextResponse.json({ error: "Role is required" }, { status: 400 });
        }
        updateData = { role: body.role };
        break;
      case "reset-password":
        updateData = { password_change_required: true };
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update user profile
    const { error } = await client
      .from("users")
      .update(updateData)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
    }

    // Log audit
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: body.action === "disable" || body.action === "enable" ? "staff_disabled" : "staff_updated",
          entityType: "user",
          entityId: id,
          changes: updateData,
        }),
      });
    } catch (err) {
      console.error("Error logging audit:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Staff update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
