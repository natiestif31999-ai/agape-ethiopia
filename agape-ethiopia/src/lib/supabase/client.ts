/**
 * Agape Ethiopia
 * Supabase Client
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function initializeSupabaseClient(): ReturnType<typeof createClient> | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = initializeSupabaseClient();
  }

  if (!supabaseInstance) {
    throw new Error(
      "Supabase client not initialized. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in the browser environment."
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return supabaseInstance as any;
}
