import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { isAdmin, isStaff } from "@/lib/auth/permissions";

export type AppUserProfile = {
  id: string;
  email: string;
  role: "Admin" | "Staff";
  is_disabled: boolean;
};

function getSupabaseServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll: async () => {
          const cookieItems = await cookies();
          return cookieItems.getAll().map((cookie) => ({ name: cookie.name, value: cookie.value }));
        },
        setAll: async () => {
          // Route handlers do not set cookies directly here.
        },
      },
    }
  );
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function getUserProfile(): Promise<AppUserProfile | null> {
  const supabase = getSupabaseServerClient();
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
    throw new Error("Unauthorized");
  }
  return profile;
}

export async function requireStaff() {
  const profile = await requireAuth();
  if (!isStaff(profile.role)) {
    throw new Error("Forbidden");
  }
  return profile;
}

export async function requireAdmin() {
  const profile = await requireAuth();
  if (!isAdmin(profile.role)) {
    throw new Error("Forbidden");
  }
  return profile;
}
