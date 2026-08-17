"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

interface Donation {
  id: string;
  amount: number;
  currency: string;
  donation_date: string;
}

export default function AdminDonationsSection() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseClient();
        const { data, error: err } = await supabase
          .from("donations")
          .select("id,amount,currency,donation_date")
          .order("donation_date", { ascending: false });

        if (err) throw err;
        setDonations(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
        <p className="mt-2 text-gray-600">Manage donations and financial records</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Total Donations</p>
          <p className="mt-2 text-3xl font-bold">{totalDonations.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Donation Count</p>
          <p className="mt-2 text-3xl font-bold">{donations.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Avg Donation</p>
          <p className="mt-2 text-3xl font-bold">
            {donations.length > 0 ? (totalDonations / donations.length).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {error && <div className="p-4 bg-rose-50 text-rose-800">{error}</div>}

        {!loading && donations.length === 0 && (
          <div className="p-12 text-center text-slate-500">No donations found</div>
        )}

        {!loading && donations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Currency</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      {new Date(d.donation_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">{d.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{d.currency}</td>
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
