import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Session } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

export async function getSession(): Promise<Session | null> {
  const supabaseClient = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
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
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single();
  if (error || !data) {
    return null;
  }
  return data.role as string;
}
