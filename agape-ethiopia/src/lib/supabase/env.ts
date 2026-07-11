export type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
};

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "",
  };
}

export function hasSupabaseAnonConfig(config: SupabaseConfig = getSupabaseConfig()) {
  return Boolean(config.url && config.anonKey);
}

export function getSupabaseConfigError(config: SupabaseConfig = getSupabaseConfig()) {
  const missing: string[] = [];

  if (!config.url) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!config.anonKey) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return missing.length ? `Missing Supabase environment variables: ${missing.join(", ")}` : null;
}

export function getSupabaseServiceRoleKey(config: SupabaseConfig = getSupabaseConfig()) {
  return config.serviceRoleKey;
}
export const dynamic = "force-dynamic";