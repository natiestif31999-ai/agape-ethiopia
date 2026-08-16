import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/serverAuth";
import { logAudit, type AuditAction } from "@/lib/audit/auditLog";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, entityType, entityId, changes, metadata } = body;

    if (!action || !entityType || !entityId) {
      return NextResponse.json(
        { error: "Missing required fields: action, entityType, entityId" },
        { status: 400 }
      );
    }

    const result = await logAudit(
      user.id,
      user.email || "unknown",
      action as AuditAction,
      entityType,
      entityId,
      changes || {},
      metadata || {}
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to log audit" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Audit logged successfully" });
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
