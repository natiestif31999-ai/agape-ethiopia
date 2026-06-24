"use client";

import { useState } from "react";

export default function RequestPortal() {
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [itemNeeded, setItemNeeded] = useState("");
  const [needDetails, setNeedDetails] = useState("");
  const [status, setStatus] = useState("Ready to submit a beneficiary request.");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Submitting request...");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beneficiary_name: beneficiaryName,
          item_needed: itemNeeded,
          need_details: needDetails,
          status: "pending",
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus(result?.error ? `Submission failed: ${result.error}` : "Submission failed.");
        return;
      }

      setBeneficiaryName("");
      setItemNeeded("");
      setNeedDetails("");
      setStatus("Request saved successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Submission failed.");
    }
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
