"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

type BeneficiaryRecord = {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  region?: string;
  disability_type?: string;
  notes?: string;
  status?: string;
  created_at?: string;
};

export default function StaffDashboard() {
  const [records, setRecords] = useState<BeneficiaryRecord[]>([]);
  const [filter, setFilter] = useState("all");
  const [statusMessage, setStatusMessage] = useState("Loading applications...");

  async function loadRecords() {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("beneficiaries").select("*").order("created_at", { ascending: false });
      if (error) {
        setStatusMessage(`Unable to load applications: ${error.message}`);
        return;
      }
      setRecords(data ?? []);
      setStatusMessage("Applications loaded.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to load applications.");
    }
  }

  useEffect(() => {
    void loadRecords();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("beneficiaries").update({ status }).eq("id", id);
      if (error) {
        setStatusMessage(`Unable to update status: ${error.message}`);
        return;
      }
      setStatusMessage(`Status updated to ${status}.`);
      await loadRecords();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to update status.");
    }
  }

  const visibleRecords = records.filter((record) => filter === "all" || (record.status ?? "pending") === filter);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Staff review dashboard</h1>
          <p className="mt-2 text-slate-600">Review registrations and approve or reject each case.</p>
        </div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-slate-500">{statusMessage}</p>

      <div className="mt-6 space-y-4">
        {visibleRecords.map((record) => (
          <article key={record.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {[record.first_name, record.last_name].filter(Boolean).join(" ") || "Unnamed beneficiary"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">Phone: {record.phone || "—"}</p>
                <p className="text-sm text-slate-600">Location: {record.region || "—"}</p>
                <p className="text-sm text-slate-600">Needs: {record.disability_type || "—"}</p>
                <p className="text-sm text-slate-600">Notes: {record.notes || "—"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">{record.status || "pending"}</span>
                <button type="button" onClick={() => updateStatus(record.id, "approved")} className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">Approve</button>
                <button type="button" onClick={() => updateStatus(record.id, "rejected")} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">Reject</button>
              </div>
            </div>
          </article>
        ))}
        {visibleRecords.length === 0 && <p className="text-sm text-slate-500">No applications match this filter.</p>}
      </div>
    </section>
  );
}
