export const APP_NAME = "Agape Mobility Ethiopia";
export const APP_ID = "com.agapemobilityethiopia";
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const WEB_API_URL = (process.env.EXPO_PUBLIC_WEB_API_URL ?? "").replace(/\/$/, "");

export function getPublicConfigDiagnostics() {
  const supabaseHost = SUPABASE_URL ? new URL(SUPABASE_URL).hostname : "missing";
  const webApiHost = WEB_API_URL ? new URL(WEB_API_URL).hostname : "missing";

  return {
    hasSupabaseUrl: Boolean(SUPABASE_URL),
    hasSupabaseAnonKey: Boolean(SUPABASE_ANON_KEY),
    hasWebApiUrl: Boolean(WEB_API_URL),
    supabaseHost,
    webApiHost,
    usesLocalhost: /localhost|127\.0\.0\.1|10\.0\.2\.2/.test(WEB_API_URL),
  };
}

export const PUBLIC_CONFIG_DIAGNOSTICS = getPublicConfigDiagnostics();
