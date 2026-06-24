import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase/env";

const config = getSupabaseConfig();
const configError = getSupabaseConfigError(config);

export const supabase = configError ? null : createClient(config.url, config.anonKey);

export async function getSession(): Promise<Session | null> {
  if (!supabase) {
    return null;
  }

  const supabaseClient = createClient(config.url, config.anonKey, {
    global: {
      headers: {
        Authorization: await cookies().then((cookieStore) => {
          const token = cookieStore.get("sb-access-token")?.value;
          return token ? `Bearer ${token}` : "";
        }),
      },
    },
  });

  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("Supabase getSession error:", error.message);
    return null;
  }

  return session;
}

export async function getUserRole(userId: string): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single();
  if (error || !data) {
    return null;
  }
  return data.role as string;
}
