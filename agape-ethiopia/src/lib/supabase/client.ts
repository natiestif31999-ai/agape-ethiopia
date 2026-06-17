/**
 * Agape Ethiopia
 * Supabase Client
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseInstance: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initializeSupabaseClient(): any {
  if (typeof window === "undefined") {
    console.log("[SUPABASE] Server-side environment - returning null");
    return null;
  }

  // Log environment variable availability
  console.log("[SUPABASE] Environment check:");
  console.log("[SUPABASE] - NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing");
  console.log("[SUPABASE] - NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Set" : "✗ Missing");

  if (!supabaseUrl || !supabaseAnonKey) {
    const missing = [];
    if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    console.error("[SUPABASE] Missing environment variables:", missing.join(", "));
    return null;
  }

  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    console.log("[SUPABASE] Client created successfully for:", supabaseUrl);
    return client;
  } catch (error) {
    console.error("[SUPABASE] Failed to create client:", error);
    return null;
  }
}

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = initializeSupabaseClient();
  }

  if (!supabaseInstance) {
    const errorMsg =
      "Supabase client not initialized. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in the browser environment.";
    console.error("[SUPABASE]", errorMsg);
    throw new Error(errorMsg);
  }

  return supabaseInstance;
}
