"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/layout/LanguageProvider";

type DistributionRecord = {
  id: string;
  equipment_type?: string;
  equipment_size?: string;
};

export default function EquipmentSizeSummary() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSummary() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("equipment_distributions")
        .select("equipment_type,equipment_size")
        .limit(200);

      if (!mounted) return;
      if (error) {
        console.warn("Equipment size summary load failed:", error.message);
        setLoading(false);
        return;
      }

      const counts: Record<string, number> = {};
      (data ?? []).forEach((item: DistributionRecord) => {
        const key = `${item.equipment_type ?? t("unknown")} - ${item.equipment_size ?? t("unknown")}`;
        counts[key] = (counts[key] ?? 0) + 1;
      });

      setSummary(counts);
      setLoading(false);
    }

    void loadSummary();
    return () => {
      mounted = false;
    };
  }, [t]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{t("equipment.sizeSummary.title")}</h3>
      <p className="mt-2 text-slate-600">{t("equipment.sizeSummary.description")}</p>
      <div className="mt-4 grid gap-3">
        {loading ? (
          <p className="text-slate-500">{t("equipment.sizeSummary.loading")}</p>
        ) : Object.keys(summary).length === 0 ? (
          <p className="text-slate-500">{t("equipment.sizeSummary.empty")}</p>
        ) : (
          Object.entries(summary).map(([key, count]) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{key}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{count}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
