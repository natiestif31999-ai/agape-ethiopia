"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type RequestRecord = {
  id: string;
  beneficiary_name?: string;
  item_needed?: string;
  status?: string;
};

type DonationRecord = {
  id: string;
  item_type?: string;
  status?: string;
};

export default function AdminPanel() {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const [requestsResult, donationsResult] = await Promise.all([
        supabase.from("requests").select("*").order("created_at", { ascending: false }).limit(10),
        supabase.from("donations").select("*").order("created_at", { ascending: false }).limit(10),
      ]);

      if (!mounted) return;

      if (requestsResult.error) console.warn("Admin requests load failed:", requestsResult.error.message);
      if (donationsResult.error) console.warn("Admin donations load failed:", donationsResult.error.message);

      setRequests(requestsResult.data ?? []);
      setDonations(donationsResult.data ?? []);
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleStatusChange(requestId: string, status: string) {
    const { error } = await supabase.from("requests").update({ status }).eq("id", requestId);
    if (error) {
      console.warn("Status update failed:", error.message);
      return;
    }

    setRequests((current) => current.map((item) => (item.id === requestId ? { ...item, status } : item)));
  }

  const openRequests = requests.filter((item) => item.status !== "matched" && item.status !== "delivered").length;
  const availableWheelchairs = donations.filter((item) => item.item_type?.toLowerCase().includes("wheelchair") && item.status !== "matched").length;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Admin Center</h2>
      <p className="mt-2 text-slate-600">Review urgent requests, mark items as matched, and manage logistics queues.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">Open requests</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-950">{loading ? "..." : openRequests}</p>
        </article>
        <article className="rounded-2xl bg-amber-50 p-4">
          <p className="text-sm text-amber-700">Available wheelchairs</p>
          <p className="mt-2 text-3xl font-semibold text-amber-950">{loading ? "..." : availableWheelchairs}</p>
        </article>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Beneficiary</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-4 py-3">{request.beneficiary_name ?? "Unnamed"}</td>
                <td className="px-4 py-3">{request.item_needed ?? "—"}</td>
                <td className="px-4 py-3">
                  <select defaultValue={request.status ?? "pending"} onChange={(event) => handleStatusChange(request.id, event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
                    <option value="pending">Pending</option>
                    <option value="matched">Matched</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
