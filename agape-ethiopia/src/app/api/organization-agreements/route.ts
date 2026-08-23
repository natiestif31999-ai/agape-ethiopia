import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

const BUCKET = "organization-agreements";
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const PUBLIC_SUBMISSION_PREFIX = "public-submissions";

function getAdminClient() {
  const config = getSupabaseConfig();
  if (!config.serviceRoleKey) {
    return null;
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function safeFileName(name: string) {
  const baseName = name.split(/[\\/]/).pop() || "signed-agreement.pdf";
  const normalized = baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return normalized.toLowerCase().endsWith(".pdf") ? normalized : `${normalized}.pdf`;
}

function isValidPdf(file: File) {
  return file.type === "application/pdf" && file.name.toLowerCase().endsWith(".pdf");
}

function publicError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("organization_agreements")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ agreements: data ?? [] });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return publicError("Submit the agreement as multipart form data.");
  }

  const formData = await request.formData();
  const fileValue = formData.get("signed_pdf");
  const file = fileValue instanceof File ? fileValue : null;
  const organizationName = String(formData.get("organization_name") || "").trim();
  const contactPerson = String(formData.get("contact_person") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const organizationType = String(formData.get("organization_type") || "").trim();

  if (!file || !isValidPdf(file)) {
    return publicError("Please upload a PDF file with a .pdf extension.");
  }
  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    return publicError("The PDF must be smaller than 20 MB.");
  }
  if ([organizationName, contactPerson, email, phone, region, city, address, organizationType].some((value) => !value)) {
    return publicError("Complete all required organization and contact fields.");
  }

  const adminClient = getAdminClient();
  if (!adminClient) {
    console.error("Public agreement submission unavailable: service role is not configured");
    return publicError("Agreement submission is temporarily unavailable.", 503);
  }

  const submissionId = crypto.randomUUID();
  const storagePath = `${PUBLIC_SUBMISSION_PREFIX}/${submissionId}/${safeFileName(file.name)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString() !== "%PDF-") {
    return publicError("The uploaded file is not a valid PDF.");
  }

  const { error: uploadError } = await adminClient.storage.from(BUCKET).upload(storagePath, bytes, {
    contentType: "application/pdf",
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) {
    console.error("Public agreement storage upload failed:", uploadError);
    return publicError("The agreement could not be uploaded. Please try again.", 502);
  }

  const { error: insertError } = await adminClient.from("organization_agreements").insert({
    id: submissionId,
    organization_name: organizationName,
    organization_type: organizationType,
    contact_person: contactPerson,
    email,
    phone,
    region,
    city,
    address,
    public_message: String(formData.get("message") || "").trim() || null,
    agreement_file_name: file.name,
    agreement_file_path: storagePath,
    status: "Pending Review",
    submission_source: "uploaded_pdf",
  });

  if (insertError) {
    console.error("Public agreement database insert failed:", insertError);
    await adminClient.storage.from(BUCKET).remove([storagePath]);
    return publicError("The PDF uploaded, but the submission could not be saved. Please try again.", 502);
  }

  return NextResponse.json({ submissionId }, { status: 201 });
}

export async function PUT(request: Request) {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const allowedFields = [
    "organization_name",
    "organization_type",
    "contact_person",
    "email",
    "phone",
    "region",
    "city",
    "address",
    "agreement_number",
    "agreement_file_url",
    "agreement_file_name",
    "agreement_file_path",
    "uploaded_by",
    "status",
    "notes",
    "internal_notes",
    "public_message",
    "agreement_version",
    "signer_name",
    "signed_at",
    "signature_method",
    "submission_source",
  ];
  const insertData = Object.fromEntries(allowedFields.filter((field) => field in body).map((field) => [field, body[field]]));
  if (!insertData.organization_name || !insertData.organization_type || !insertData.contact_person || !insertData.email) {
    return NextResponse.json({ error: "Required organization fields are missing." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase.from("organization_agreements").insert(insertData).select("*").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ agreement: data });
}
