"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getSupabaseClient } from "@/lib/supabase/client";

type DonationRecord = {
  id?: string;
  donor_name?: string;
  donor_email?: string;
  amount?: number;
  currency?: string;
  payment_provider?: string;
  donation_purpose?: string;
  status?: string;
  created_at?: string;
  receipt_number?: string;
};

export default function DonorDashboard({ donorId, onExit }: { donorId: string; onExit: () => void }) {
  const { t } = useLanguage();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadDonations = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("donor_id", donorId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error) {
        setDonations((data ?? []) as DonationRecord[]);
      }
    } finally {
      setLoading(false);
    }
  }, [donorId]);

  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const filteredDonations = donations.filter((d) => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  const totalDonated = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Your Donations</h2>
          <button
            type="button"
            onClick={onExit}
            className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            ← Back
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-lg bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">{t("donation.totalDonations")}</p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">{donations.length}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-700">Total Donated</p>
            <p className="mt-2 text-3xl font-bold text-blue-900">${totalDonated.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-sm text-purple-700">Average Donation</p>
            <p className="mt-2 text-3xl font-bold text-purple-900">
              ${donations.length > 0 ? (totalDonated / donations.length).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {["all", "completed", "processing", "pending", "failed"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === status
                  ? "bg-emerald-700 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>

        {/* Donations Table */}
        {loading ? (
          <p className="text-slate-600">Loading donations...</p>
        ) : filteredDonations.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">No donations found</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Receipt</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Purpose</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Method</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id || donation.receipt_number} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">
                      {donation.receipt_number?.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {donation.amount} {donation.currency || "USD"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{donation.donation_purpose}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{donation.payment_provider}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      {donation.created_at ? new Date(donation.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          donation.status === "completed"
                            ? "bg-emerald-100 text-emerald-900"
                            : donation.status === "pending"
                            ? "bg-yellow-100 text-yellow-900"
                            : donation.status === "failed"
                            ? "bg-red-100 text-red-900"
                            : "bg-blue-100 text-blue-900"
                        }`}
                      >
                        {donation.status || "pending"}
                      </span>
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
