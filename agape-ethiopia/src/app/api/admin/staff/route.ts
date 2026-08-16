/**
 * AGAPE MOBILITY ETHIOPIA
 * Admin Staff Management API
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/serverAuth";
import { createClient } from "@supabase/supabase-js";

interface CreateStaffRequest {
  email: string;
  password: string;
  role: "Admin" | "Staff";
}

// GET - List all staff members
export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // Get all users with Staff or Admin role
    const { data, error } = await client.from("users").select("*").in("role", ["Staff", "Admin"]);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Staff API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new staff member
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateStaffRequest = await request.json();

    if (!body.email || !body.password || !body.role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    // Create Supabase admin client
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // Create auth user
    const { data: authData, error: authError } = await client.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || "Failed to create user" }, { status: 400 });
    }

    // Create user profile in users table
    const { error: profileError } = await client.from("users").insert({
      id: authData.user.id,
      email: body.email,
      role: body.role,
      is_disabled: false,
      password_change_required: false,
    });

    if (profileError) {
      // Clean up - delete the auth user if profile creation fails
      await client.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Failed to create staff profile" },
        { status: 500 }
      );
    }

    // Log audit
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "staff_created",
          entityType: "user",
          entityId: authData.user.id,
          changes: { email: body.email, role: body.role },
        }),
      });
    } catch (err) {
      console.error("Error logging audit:", err);
    }

    return NextResponse.json({ success: true, userId: authData.user.id });
  } catch (error) {
    console.error("Staff creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
