/**
 * Agape Ethiopia
 * Supabase Client
 */

import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase/env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseInstance: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initializeSupabaseClient(): any {
  if (typeof window === "undefined") {
    return null;
  }

  const config = getSupabaseConfig();
  const configError = getSupabaseConfigError(config);

  if (configError) {
    return null;
  }

  try {
    return createClient(config.url, config.anonKey);
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
