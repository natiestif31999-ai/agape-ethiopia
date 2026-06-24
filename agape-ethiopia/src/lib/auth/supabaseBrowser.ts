import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase/env";

let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (supabaseBrowserClient) {
    return supabaseBrowserClient;
  }

  const config = getSupabaseConfig();
  const configError = getSupabaseConfigError(config);

  if (configError) {
    return null;
  }

  supabaseBrowserClient = createBrowserClient(config.url, config.anonKey);
  return supabaseBrowserClient;
}

export const supabaseBrowser = getSupabaseBrowserClient();
