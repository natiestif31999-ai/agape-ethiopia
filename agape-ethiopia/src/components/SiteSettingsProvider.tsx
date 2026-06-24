"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

type SiteSettingsContextValue = {
  settings: Record<string, string>;
  loading: boolean;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.from("site_settings").select("key,value");
        if (!mounted) return;
        if (!error) {
          const mapped = Object.fromEntries((data ?? []).map((item) => [item.key, item.value]));
          setSettings(mapped);
        }
      } catch (error) {
        console.warn("Site settings load failed", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({ settings, loading }), [settings, loading]);

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return context;
}
