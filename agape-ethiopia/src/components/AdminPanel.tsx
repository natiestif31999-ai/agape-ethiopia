"use client";

import { useEffect, useState } from "react";

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
      try {
        const [requestsResponse, donationsResponse] = await Promise.all([
          fetch("/api/requests"),
          fetch("/api/donations"),
        ]);

        if (!mounted) return;

        const [requestsResult, donationsResult] = await Promise.all([requestsResponse.json().catch(() => ({ data: [] })), donationsResponse.json().catch(() => ({ data: [] }))]);
        setRequests(requestsResult?.data ?? []);
        setDonations(donationsResult?.data ?? []);
      } catch (error) {
        console.warn("Admin data load failed:", error);
        if (mounted) {
          setRequests([]);
          setDonations([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleStatusChange(requestId: string, status: string) {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        console.warn("Status update failed");
        return;
      }

      setRequests((current) => current.map((item) => (item.id === requestId ? { ...item, status } : item)));
    } catch (error) {
      console.warn("Status update failed:", error);
    }
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
