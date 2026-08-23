import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase/env";

export type AuditAction =
  | "registration_created"
  | "registration_updated"
  | "registration_approved"
  | "registration_rejected"
  | "beneficiary_updated"
  | "beneficiary_message_sent"
  | "assessment_created"
  | "assessment_updated"
  | "donation_received"
  | "staff_created"
  | "staff_disabled"
  | "staff_enabled"
  | "password_reset"
  | "settings_changed";

export interface AuditLog {
  actor_id: string;
  actor_email: string;
  action: AuditAction;
  entity_type: string;
  entity_id: string;
  changes: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export async function logAudit(
  userId: string,
  userEmail: string,
  action: AuditAction,
  entityType: string,
  entityId: string,
  changes: Record<string, unknown> = {},
  metadata: Record<string, unknown> = {}
): Promise<{ error?: string; success: boolean }> {
  try {
    const config = getSupabaseConfig();
    const configError = getSupabaseConfigError(config);

    if (configError) {
      console.error("Supabase config error:", configError);
      return { error: configError, success: false };
    }

    // Use service role key for audit logging (server-side only)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error("SUPABASE_SERVICE_ROLE_KEY not configured");
      return { error: "Service role key not configured", success: false };
    }

    const supabase = createClient(config.url, serviceRoleKey);

    const { error } = await supabase.from("audit_logs").insert({
      actor_id: userId,
      actor_email: userEmail,
      action,
      entity_type: entityType,
      entity_id: entityId,
      changes,
      metadata,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Audit log error:", error);
      return { error: error.message, success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected audit log error:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    };
  }
}
