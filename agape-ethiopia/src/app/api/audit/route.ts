/**
 * AGAPE MOBILITY ETHIOPIA
 * Audit Logging API
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/serverAuth";
import { logAudit, AuditAction } from "@/lib/audit/auditLog";

interface AuditRequest {
  action: AuditAction;
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: AuditRequest = await request.json();

    // Log the audit
    const result = await logAudit(
      auth.id,
      auth.email,
      body.action,
      body.entityType,
      body.entityId,
      body.changes || {},
      body.metadata || {}
    );

    if (result.error) {
      console.error("Audit logging failed:", result.error);
      return NextResponse.json(
        { error: "Failed to log audit", details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
