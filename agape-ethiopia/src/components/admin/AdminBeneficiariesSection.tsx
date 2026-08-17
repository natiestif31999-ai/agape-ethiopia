"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Beneficiary {
  id: string;
  first_name: string;
  last_name: string;
  registration_number: string;
  status: string;
  created_at: string;
}

export default function AdminBeneficiariesSection() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseClient();
        let query = supabase
          .from("beneficiaries")
          .select("id,first_name,last_name,registration_number,status,created_at")
          .order("created_at", { ascending: false });

        if (filterStatus !== "all") {
          query = query.eq("status", filterStatus);
        }

        const { data, error: err } = await query;
        if (err) throw err;
        setBeneficiaries(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filterStatus]);

  const statusCounts = {
    approved: beneficiaries.filter((b) => b.status === "approved").length,
    pending: beneficiaries.filter((b) => b.status === "pending" || b.status === "registered").length,
    rejected: beneficiaries.filter((b) => b.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Beneficiary Control Center</h1>
        <p className="mt-2 text-gray-600">Manage all beneficiaries in the system</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Total Beneficiaries</p>
          <p className="mt-2 text-3xl font-bold">{beneficiaries.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-emerald-200 p-6">
          <p className="text-sm text-emerald-600">Approved</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">{statusCounts.approved}</p>
        </div>
        <div className="bg-white rounded-lg border border-amber-200 p-6">
          <p className="text-sm text-amber-600">Pending</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">{statusCounts.pending}</p>
        </div>
        <div className="bg-white rounded-lg border border-rose-200 p-6">
          <p className="text-sm text-rose-600">Rejected</p>
          <p className="mt-2 text-3xl font-bold text-rose-700">{statusCounts.rejected}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-lg ${filterStatus === "all" ? "bg-emerald-600 text-white" : "bg-white text-slate-900 border border-slate-200"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus("approved")}
          className={`px-4 py-2 rounded-lg ${filterStatus === "approved" ? "bg-emerald-600 text-white" : "bg-white text-slate-900 border border-slate-200"}`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`px-4 py-2 rounded-lg ${filterStatus === "pending" ? "bg-emerald-600 text-white" : "bg-white text-slate-900 border border-slate-200"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus("rejected")}
          className={`px-4 py-2 rounded-lg ${filterStatus === "rejected" ? "bg-emerald-600 text-white" : "bg-white text-slate-900 border border-slate-200"}`}
        >
          Rejected
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 text-rose-800">{error}</div>
        )}

        {!loading && beneficiaries.length === 0 && (
          <div className="p-12 text-center text-slate-500">No beneficiaries found</div>
        )}

        {!loading && beneficiaries.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Reg #</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Registered</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {beneficiaries.map((ben) => (
                  <tr key={ben.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">{ben.first_name} {ben.last_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{ben.registration_number}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          ben.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : ben.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ben.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(ben.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/beneficiaries/${ben.id}/details`} className="text-emerald-600 hover:text-emerald-800 font-medium">
                        View
                      </Link>
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
