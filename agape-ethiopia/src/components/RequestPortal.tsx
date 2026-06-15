"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function RequestPortal() {
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [itemNeeded, setItemNeeded] = useState("");
  const [needDetails, setNeedDetails] = useState("");
  const [status, setStatus] = useState("Ready to submit a live beneficiary request.");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting request...");
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("requests").insert({
      beneficiary_name: beneficiaryName,
      item_needed: itemNeeded,
      need_details: needDetails,
      status: "pending",
    });

    if (error) {
      setStatus(`Submission failed: ${error.message}`);
      return;
    }

    setBeneficiaryName("");
    setItemNeeded("");
    setNeedDetails("");
    setStatus("Request saved to the live Supabase requests table.");
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Request Portal</h2>
      <p className="mt-2 text-slate-600">Log urgent mobility requests from beneficiaries and track matching progress.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Beneficiary name
          <input value={beneficiaryName} onChange={(event) => setBeneficiaryName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Example: Selam Bekele" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Item needed
          <input value={itemNeeded} onChange={(event) => setItemNeeded(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Wheelchair" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Need details
          <textarea value={needDetails} onChange={(event) => setNeedDetails(event.target.value)} className="min-h-24 rounded-xl border border-slate-300 px-4 py-3" placeholder="Describe urgency and delivery context." />
        </label>
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white md:col-span-2">Create request</button>
        <p className="text-sm text-slate-500 md:col-span-2">{status}</p>
      </form>
    </section>
  );
}
