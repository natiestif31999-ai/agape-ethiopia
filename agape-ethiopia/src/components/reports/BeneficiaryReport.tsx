"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Beneficiary } from "@/lib/types";

export default function BeneficiaryReport() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("beneficiaries")
        .select("id,registration_number,first_name,middle_name,last_name,region,kifle_ketema,kebele,house_number")
        .order("created_at", { ascending: false })
        .limit(50);
      if (!mounted) return;
      if (error) {
        console.warn("Beneficiary report failed:", error.message);
        setLoading(false);
        return;
      }
      setBeneficiaries(data ?? []);
      setLoading(false);
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Beneficiary Report</h3>
      <p className="mt-2 text-slate-600">Recent beneficiaries with registration and location details.</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Reg. #</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Kebele</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={4}>Loading beneficiaries...</td>
              </tr>
            ) : beneficiaries.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={4}>No beneficiaries found.</td>
              </tr>
            ) : (
              beneficiaries.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">{item.registration_number ?? "—"}</td>
                  <td className="px-4 py-3">{[item.first_name, item.middle_name, item.last_name].filter(Boolean).join(" ") || "Unknown"}</td>
                  <td className="px-4 py-3">{item.region ?? "—"}</td>
                  <td className="px-4 py-3">{item.kebele ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
