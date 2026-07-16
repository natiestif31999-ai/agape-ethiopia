"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
type DistributionRecord = {
  id: string;
  beneficiary_id?: string;
  equipment_type?: string;
  equipment_size?: string;
  distribution_date?: string;
  distribution_location?: string;
  signature_confirmed?: boolean;
};
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function DistributionReport() {
  const { t } = useLanguage();
  const [records, setRecords] = useState<DistributionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("equipment_distributions")
        .select("id,beneficiary_id,equipment_type,equipment_size,distribution_date,distribution_location,received_by,signature_confirmed,notes")
        .order("distribution_date", { ascending: false })
        .limit(50);

      if (!mounted) return;
      if (error) {
        console.warn("Distribution report failed:", error.message);
        setLoading(false);
        return;
      }

      setRecords(data ?? []);
      setLoading(false);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{t("distributionReport.title")}</h3>
      <p className="mt-2 text-slate-600">{t("distributionReport.description")}</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">{t("report.beneficiary")}</th>
              <th className="px-4 py-3">{t("report.equipment")}</th>
              <th className="px-4 py-3">{t("report.size")}</th>
              <th className="px-4 py-3">{t("report.date")}</th>
              <th className="px-4 py-3">{t("location")}</th>
              <th className="px-4 py-3">{t("receivedBy")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={6}>{t("report.loadingDistributions")}</td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={6}>{t("report.noDistributions")}</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-3">{record.beneficiary_id ?? t("unknown")}</td>
                  <td className="px-4 py-3">{record.equipment_type ?? t("unknown")}</td>
                  <td className="px-4 py-3">{record.equipment_size ?? t("unknown")}</td>
                  <td className="px-4 py-3">{record.distribution_date ?? t("unknown")}</td>
                  <td className="px-4 py-3">{record.distribution_location ?? t("unknown")}</td>
                  <td className="px-4 py-3">{record.signature_confirmed ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
