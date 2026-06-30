import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildPublicBeneficiaryPayload, validatePublicBeneficiaryFields } from "@/lib/beneficiaryRegistration";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase/env";

const MAX_PHOTO_SIZE_BYTES = 3 * 1024 * 1024;
const ALLOWED_PHOTO_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

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

async function uploadPhoto(photoFile: File, fileName: string) {
  const supabaseAdmin = getSupabaseAdminClient();

  const extension = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const filePath = `self-registrations/${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${extension}`;

  const { error: uploadError } = await supabaseAdmin.storage.from("beneficiary-photos").upload(filePath, photoFile, {
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicData } = supabaseAdmin.storage.from("beneficiary-photos").getPublicUrl(filePath);
  return publicData?.publicUrl ?? null;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let formData: FormData;

    if (contentType.includes("multipart/form-data")) {
      formData = await req.formData();
    } else {
      const body = await req.json().catch(() => null);
      if (!body || typeof body !== "object") {
        return NextResponse.json({ error: "Request body must be a JSON object or multipart form data payload." }, { status: 400 });
      }

      formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return;
        }
        formData.append(key, typeof value === "string" ? value : JSON.stringify(value));
      });
    }

    const values: Record<string, string | undefined | null> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        values[key] = value;
      } else if (value instanceof File) {
        values[key] = value.name;
      }
    });

    const errors = validatePublicBeneficiaryFields(values);
    if (errors.length) {
      return NextResponse.json({ error: "Validation failed.", errors }, { status: 400 });
    }

    const photoFile = formData.get("photo") instanceof File ? (formData.get("photo") as File) : null;
    let photoUrl: string | null = null;

    if (photoFile) {
      const extension = photoFile.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_PHOTO_EXTENSIONS.includes(extension)) {
        return NextResponse.json({ error: "Please upload a JPG, PNG, or WebP photo." }, { status: 400 });
      }

      if (photoFile.size > MAX_PHOTO_SIZE_BYTES) {
        return NextResponse.json({ error: "Please upload a photo smaller than 3MB." }, { status: 400 });
      }

      photoUrl = await uploadPhoto(photoFile, photoFile.name);
    }

    const payload = buildPublicBeneficiaryPayload(values, photoUrl);

    const supabaseAdmin = getSupabaseAdminClient();

    const { data, error } = await supabaseAdmin.from("beneficiaries").insert([payload]).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Your registration request was received successfully. A staff member will review it shortly.",
      data,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to submit registration." }, { status: 500 });
  }
}
