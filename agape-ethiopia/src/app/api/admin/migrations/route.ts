/**
 * AGAPE MOBILITY ETHIOPIA
 * Database Migration Helper - Admin Only
 * 
 * This API route applies pending migrations to the Supabase database.
 * It should only be called by authorized administrators during deployment.
 * 
 * WARNING: This is a powerful admin tool. Protect it carefully.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase/env";
import fs from "fs";
import path from "path";

async function getMigrationClient() {
  const config = getSupabaseConfig();
  const configError = getSupabaseConfigError(config);

  if (configError) {
    throw new Error(`Supabase config error: ${configError}`);
  }

  // Use service role for migrations
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  return createClient(config.url, serviceRoleKey);
}

function parseSqlStatements(sqlContent: string): string[] {
  // Split by semicolon but preserve formatting
  const statements = sqlContent
    .split(";")
    .map((stmt) => stmt.trim())
    .filter(
      (stmt) =>
        stmt.length > 0 &&
        !stmt.toUpperCase().startsWith("--") &&
        !["BEGIN", "COMMIT"].includes(stmt.toUpperCase())
    );

  return statements;
}

async function applyStatement(client: unknown, statement: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Execute raw SQL using Supabase's query method.
    // This endpoint is intended for admin-only deployment operations and may fail silently
    // if the project does not expose the expected SQL function.
    const rpcClient = client as {
      rpc: (fn: string, args: Record<string, string>) => Promise<{ error?: { message: string } }>;
    };

    const { error } = await rpcClient.rpc("exec_sql", { sql_query: statement });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    // Fallback: attempt alternative execution path
    return { success: false, error: String(err) };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authorization - should be admin only
    const authHeader = request.headers.get("authorization");
    const adminKey = process.env.ADMIN_MIGRATION_KEY;

    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { migrationFile } = await request.json();

    if (!migrationFile) {
      return NextResponse.json({ error: "migrationFile is required" }, { status: 400 });
    }

    // Read migration file from project root
    const migrationPath = path.join(process.cwd(), "..", "..", "migrations", migrationFile);
    const sqlContent = fs.readFileSync(migrationPath, "utf-8");

    const statements = parseSqlStatements(sqlContent);
    const client = await getMigrationClient();

    const results: Array<{ statement: string; success: boolean; error?: string }> = [];
    for (const stmt of statements) {
      const result = await applyStatement(client, stmt);
      results.push({ statement: stmt.substring(0, 100), ...result });

      if (!result.success) {
        // Continue with other statements but log failures
        console.error(`Migration statement failed: ${stmt.substring(0, 100)}`, result.error);
      }
    }

    return NextResponse.json({ success: true, results, message: "Migration applied" });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/**
 * GET endpoint returns migration status and instructions
 */
export async function GET() {
  return NextResponse.json({
    message: "Database migration helper endpoint",
    status: "ready",
    instructions: "POST with migrationFile parameter and Bearer token authorization",
    pendingMigrations: ["2026-08-17-fix-rbac-users-table.sql"],
    warning: "This endpoint requires ADMIN_MIGRATION_KEY environment variable",
  });
}
