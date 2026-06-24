"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseConfig, hasSupabaseAnonConfig } from "@/lib/supabase/env";

type UserProfile = {
  id: string;
  email: string;
  role: "Admin" | "Staff";
  is_disabled: boolean;
};

type AuthContextValue = {
  session: Session | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

type SupabaseClientLike = ReturnType<typeof createBrowserClient> | null;

const AuthContext = createContext<AuthContextValue | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState<SupabaseClientLike>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const config = getSupabaseConfig();
    if (!hasSupabaseAnonConfig(config)) {
      return null;
    }

    return createBrowserClient(config.url, config.anonKey);
  });

  return <AuthStateProvider supabase={supabaseClient}>{children}</AuthStateProvider>;
}

function AuthStateProvider({ children, supabase }: { children: React.ReactNode; supabase: SupabaseClientLike }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!supabase) {
      setUserProfile(null);
      setSession(null);
      setIsLoading(false);
      return;
    }

    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setSession(currentSession);

      if (!currentSession?.user) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/user");
        if (!response.ok) {
          setUserProfile(null);
          return;
        }

        const result = await response.json();
        if (mounted && result?.profile) {
          setUserProfile(result.profile);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
        if (mounted) {
          setUserProfile(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: string, currentSession: { session: Session | null } | null) => {
      if (!mounted) return;
      setSession(currentSession?.session ?? null);
      if (!currentSession?.session?.user) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      void fetch("/api/auth/user")
        .then((response) => response.json())
        .then((result) => {
          if (mounted && result?.profile) {
            setUserProfile(result.profile);
          }
        })
        .catch((error) => console.error("Failed to refresh user profile:", error))
        .finally(() => {
          if (mounted) {
            setIsLoading(false);
          }
        });
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(
    () => ({
      session,
      userProfile,
      isLoading,
      isAdmin: userProfile?.role === "Admin",
      isStaff: userProfile?.role === "Staff" || userProfile?.role === "Admin",
      signIn: async (email: string, password: string) => {
        if (!supabase) {
          return { error: new Error("Supabase is not configured.") };
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error) {
          const response = await fetch("/api/auth/user");
          if (response.ok) {
            const result = await response.json();
            if (result?.profile) {
              setUserProfile(result.profile);
            }
          }
        }
        return { error };
      },
      signOut: async () => {
        if (supabase) {
          await supabase.auth.signOut();
        }
        setSession(null);
        setUserProfile(null);
      },
    }),
    [session, userProfile, supabase, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within SupabaseProvider");
  }
  return context;
}
