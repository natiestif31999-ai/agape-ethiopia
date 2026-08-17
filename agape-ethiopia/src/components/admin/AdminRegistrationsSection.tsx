"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
}

export default function AdminRegistrationsSection() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseClient();
        const { data, error: err } = await supabase
          .from("beneficiaries")
          .select("id,first_name,last_name,status,created_at")
          .in("status", ["pending", "registered"])
          .order("created_at", { ascending: false });

        if (err) throw err;
        setRegistrations(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registration Management</h1>
        <p className="mt-2 text-gray-600">Review and manage pending beneficiary registrations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Pending Review</p>
          <p className="mt-2 text-3xl font-bold">{registrations.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {error && <div className="p-4 bg-rose-50 text-rose-800">{error}</div>}

        {!loading && registrations.length === 0 && (
          <div className="p-12 text-center text-slate-500">No pending registrations</div>
        )}

        {!loading && registrations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Submitted</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">{reg.first_name} {reg.last_name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-600 hover:text-emerald-800 font-medium">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
