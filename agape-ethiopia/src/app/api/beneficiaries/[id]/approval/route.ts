import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase/env";

// List of valid beneficiary status transitions
const VALID_STATUSES = ["Pending Review", "Approved", "Rejected", "On Hold"];

function getSupabaseAdminClient() {
  const config = getSupabaseConfig();
  const configError = getSupabaseConfigError(config);

  if (configError || !config.serviceRoleKey || !config.url) {
    throw new Error("Supabase is not configured.");
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

interface BeneficiaryUpdateRequest {
  status?: string;
  notes?: string | null;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const supabaseAdmin = getSupabaseAdminClient();

    // Fetch the beneficiary
    const { data, error } = await supabaseAdmin
      .from("beneficiaries")
      .select("id,registration_number,first_name,last_name,status,created_at,updated_at")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Beneficiary not found." }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to fetch beneficiary." }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    let body: BeneficiaryUpdateRequest;
    try {
      body = (await req.json()) as BeneficiaryUpdateRequest;
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { status, notes } = body;

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdminClient();

    // Prepare update payload
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updatePayload.status = status;
    }

    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    // Update the beneficiary
    const { data, error } = await supabaseAdmin
      .from("beneficiaries")
      .update(updatePayload)
      .eq("id", id)
      .select("id,registration_number,first_name,last_name,status,created_at,updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Beneficiary not found or could not be updated." }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: `Beneficiary status updated to ${status || "unchanged"}.`,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update beneficiary." }, { status: 500 });
  }
}
