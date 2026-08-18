import { createClient } from "@supabase/supabase-js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";

const BUCKET = "organization-agreements";
const AGREEMENT_VERSION = "Agape Agreement.pdf";
const MAX_SIGNATURE_BYTES = 2 * 1024 * 1024;

function getAdminClient() {
  const config = getSupabaseConfig();
  if (!config.serviceRoleKey) return null;
  return createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    action?: "preview" | "submit";
    organizationName?: string;
    organizationType?: string;
    representativeName?: string;
    email?: string;
    phone?: string;
    region?: string;
    city?: string;
    address?: string;
    message?: string;
    signingDate?: string;
    signatureDataUrl?: string;
    signatureMethod?: "drawn" | "image";
    previousSubmissionId?: string;
  };
  const values = {
    organizationName: body.organizationName?.trim() || "",
    organizationType: body.organizationType?.trim() || "",
    representativeName: body.representativeName?.trim() || "",
    email: body.email?.trim() || "",
    phone: body.phone?.trim() || "",
    region: body.region?.trim() || "",
    city: body.city?.trim() || "",
    address: body.address?.trim() || "",
    message: body.message?.trim() || "",
    signingDate: body.signingDate?.trim() || "",
    signatureDataUrl: body.signatureDataUrl || "",
    signatureMethod: body.signatureMethod || "drawn",
  };
  if ([values.organizationName, values.representativeName, values.email, values.phone, values.region, values.city, values.address, values.signingDate, values.signatureDataUrl].some((value) => !value)) {
    return NextResponse.json({ error: "Complete the partner information and sign the official PDF." }, { status: 400 });
  }
  if (!/^data:image\/(png|jpeg);base64,/.test(values.signatureDataUrl) || values.signatureDataUrl.length > MAX_SIGNATURE_BYTES * 2) {
    return NextResponse.json({ error: "Use a valid signature image." }, { status: 400 });
  }

  let templateBytes: Buffer;
  try {
    templateBytes = await readFile(join(process.cwd(), "public", AGREEMENT_VERSION));
  } catch (error) {
    console.error("Official agreement template could not be read:", error);
    return NextResponse.json({ error: "The official agreement template is unavailable." }, { status: 503 });
  }

  const document = await PDFDocument.load(templateBytes);
  const font = await document.embedFont(StandardFonts.Helvetica);
  const pages = document.getPages();
  const pageOne = pages[0];
  const pageThree = pages[2];
  const textColor = rgb(0.05, 0.1, 0.35);
  pageOne.drawText(values.signingDate, { x: 190, y: 702, size: 10, font, color: textColor });
  pageOne.drawText(values.organizationName, { x: 150, y: 631, size: 10, font, color: textColor, maxWidth: 365 });
  pageOne.drawText(`${values.region}, ${values.city}, ${values.address}`, { x: 150, y: 607, size: 9, font, color: textColor, maxWidth: 365 });
  pageThree.drawText(values.organizationName, { x: 307, y: 598, size: 9, font, color: textColor, maxWidth: 112 });
  pageThree.drawText(values.representativeName, { x: 307, y: 574, size: 9, font, color: textColor, maxWidth: 112 });
  const signatureBase64 = values.signatureDataUrl.split(",")[1];
  const signatureImage = values.signatureDataUrl.startsWith("data:image/jpeg")
    ? await document.embedJpg(Buffer.from(signatureBase64, "base64"))
    : await document.embedPng(Buffer.from(signatureBase64, "base64"));
  pageThree.drawImage(signatureImage, { x: 425, y: 570, width: 125, height: 42 });
  pageThree.drawText(values.signingDate, { x: 425, y: 548, size: 8, font, color: textColor, maxWidth: 125 });

  const pdfBytes = await document.save();
  if (body.action === "preview") {
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline; filename=agape-agreement-preview.pdf" },
    });
  }
  if (body.action !== "submit") {
    return NextResponse.json({ error: "Choose preview or submit." }, { status: 400 });
  }

  const adminClient = getAdminClient();
  if (!adminClient) {
    console.error("Online agreement submission unavailable: service role is not configured");
    return NextResponse.json({ error: "Agreement submission is temporarily unavailable." }, { status: 503 });
  }

  const submissionId = crypto.randomUUID();
  const storagePath = `public-submissions/${submissionId}/signed-agreement.pdf`;
  let previousSubmission: { id: string; email: string; status: string; version_number: number } | null = null;
  if (body.previousSubmissionId) {
    const { data, error } = await adminClient
      .from("organization_agreements")
      .select("id,email,status,version_number")
      .eq("id", body.previousSubmissionId)
      .maybeSingle();
    if (error || !data || data.email.toLowerCase() !== values.email.toLowerCase() || data.status !== "Rejected") {
      return NextResponse.json({ error: "Only a rejected submission belonging to this email can be replaced." }, { status: 400 });
    }
    previousSubmission = data;
  }
  const { error: uploadError } = await adminClient.storage.from(BUCKET).upload(storagePath, Buffer.from(pdfBytes), {
    contentType: "application/pdf",
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) {
    console.error("Generated agreement storage upload failed:", uploadError);
    return NextResponse.json({ error: "The generated agreement could not be stored." }, { status: 502 });
  }

  const { error: insertError } = await adminClient.from("organization_agreements").insert({
    id: submissionId,
    organization_name: values.organizationName,
    organization_type: values.organizationType,
    contact_person: values.representativeName,
    email: values.email,
    phone: values.phone,
    region: values.region,
    city: values.city,
    address: values.address,
    public_message: values.message || null,
    agreement_file_name: "signed-agreement.pdf",
    agreement_file_path: storagePath,
    status: "Pending Review",
    agreement_version: AGREEMENT_VERSION,
    signer_name: values.representativeName,
    signed_at: new Date().toISOString(),
    signature_method: values.signatureMethod,
    submission_source: "official_pdf_editor",
    previous_submission_id: previousSubmission?.id ?? null,
    version_number: (previousSubmission?.version_number ?? 0) + 1,
  });
  if (insertError) {
    console.error("Generated agreement database insert failed:", insertError);
    await adminClient.storage.from(BUCKET).remove([storagePath]);
    return NextResponse.json({ error: "The generated agreement could not be submitted." }, { status: 502 });
  }

  return NextResponse.json({ submissionId }, { status: 201 });
}