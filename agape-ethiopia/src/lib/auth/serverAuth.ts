import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { isAdmin, isStaff } from "@/lib/auth/permissions";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase/env";

export type AppUserProfile = {
  id: string;
  email: string;
  role: "Admin" | "Staff";
  is_disabled: boolean;
};

function getSupabaseServerClient() {
  const config = getSupabaseConfig();
  const configError = getSupabaseConfigError(config);

  if (configError) {
    return null;
  }

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll: async () => {
        const cookieItems = await cookies();
        return cookieItems.getAll().map((cookie) => ({ name: cookie.name, value: cookie.value }));
      },
      setAll: async () => {
        // Route handlers do not set cookies directly here.
      },
    },
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function getUserProfile(): Promise<AppUserProfile | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const { data, error } = await supabase.from("users").select("id,email,role,is_disabled").eq("id", currentUser.id).maybeSingle();
  if (error) {
    console.error("Error loading user profile:", error.message);
    return null;
  }

  if (data) {
    return data as AppUserProfile;
  }

  if (!currentUser.email) {
    return null;
  }

  const { data: newProfile, error: insertError } = await supabase
    .from("users")
    .insert({ id: currentUser.id, email: currentUser.email, role: "Staff" })
    .select("id,email,role,is_disabled")
    .single();

  if (insertError) {
    console.error("Error creating default user profile:", insertError.message);
    return null;
  }

  return newProfile as AppUserProfile;
}

export async function requireAuth() {
  const profile = await getUserProfile();
  if (!profile || profile.is_disabled) {
    return null;
  }
  return profile;
}

export async function requireStaff() {
  const profile = await requireAuth();
  if (!profile) {
    return null;
  }
  if (!isStaff(profile.role)) {
    return null;
  }
  return profile;
}

export async function requireAdmin() {
  const profile = await requireAuth();
  if (!profile) {
    return null;
  }
  if (!isAdmin(profile.role)) {
    return null;
  }
  return profile;
}
