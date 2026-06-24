"use client";

import { useState } from "react";

export default function DonationForm() {
  const [donorName, setDonorName] = useState("");
  const [itemType, setItemType] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Ready to save a donation record.");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving donation...");

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_name: donorName,
          item_type: itemType,
          notes,
          status: "available",
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus(result?.error ? `Save failed: ${result.error}` : "Save failed.");
        return;
      }

      setDonorName("");
      setItemType("");
      setNotes("");
      setStatus("Donation saved successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Donation Form</h2>
      <p className="mt-2 text-slate-600">Capture donor details and inventory updates that sync into the live donations table.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Donor name
          <input value={donorName} onChange={(event) => setDonorName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Example: Addis Relief Fund" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Item type
          <input value={itemType} onChange={(event) => setItemType(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Wheelchair, walker, mattress" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-24 rounded-xl border border-slate-300 px-4 py-3" placeholder="Add delivery notes, urgency, or logistics details." />
        </label>
        <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white md:col-span-2">Save donation</button>
        <p className="text-sm text-slate-500 md:col-span-2">{status}</p>
      </form>
    </section>
  );
}
