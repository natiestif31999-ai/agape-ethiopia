import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/serverAuth";
import { getSupabaseConfig } from "@/lib/supabase/env";

const BUCKET = "blog-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getSupabaseConfig();
  if (!config.serviceRoleKey) {
    return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Send the image as multipart form data." }, { status: 400 });
  }

  const value = formData.get("image");
  if (!(value instanceof File) || value.size <= 0) {
    return NextResponse.json({ error: "Choose a JPG, PNG, or WebP image." }, { status: 400 });
  }
  if (value.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "The image must be smaller than 5 MB." }, { status: 413 });
  }

  const extension = value.name.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME_BY_EXTENSION[extension];
  if (!contentType || (value.type && value.type !== contentType && !(["jpg", "jpeg"].includes(extension) && value.type === "image/jpg"))) {
    return NextResponse.json({ error: "Please upload a JPG, PNG, or WebP image." }, { status: 415 });
  }

  const supabase = createClient(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const objectPath = `posts/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(objectPath, Buffer.from(await value.arrayBuffer()), {
    contentType,
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    console.error("Blog image storage upload failed:", uploadError);
    return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 502 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  return NextResponse.json({ path: objectPath, publicUrl: data.publicUrl }, { status: 201 });
}