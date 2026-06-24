"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

type DistributionRecord = {
  id: string;
  beneficiary_id: string;
  equipment_type?: string;
  equipment_size?: string;
  distribution_date?: string;
  distribution_location?: string;
  received_by?: string;
  signature_confirmed?: boolean;
  notes?: string;
};

export default function DistributionReport() {
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
      <h3 className="text-xl font-semibold text-slate-900">Distribution Report</h3>
      <p className="mt-2 text-slate-600">Recent equipment distribution events and beneficiary delivery details.</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Beneficiary</th>
              <th className="px-4 py-3">Equipment</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={6}>Loading distribution records...</td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={6}>No distribution records found.</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-3">{record.beneficiary_id}</td>
                  <td className="px-4 py-3">{record.equipment_type ?? "—"}</td>
                  <td className="px-4 py-3">{record.equipment_size ?? "—"}</td>
                  <td className="px-4 py-3">{record.distribution_date ?? "—"}</td>
                  <td className="px-4 py-3">{record.distribution_location ?? "—"}</td>
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
