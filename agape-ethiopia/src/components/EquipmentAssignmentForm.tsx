"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function EquipmentAssignmentForm({
  beneficiaryId,
  onCreated,
}: {
  beneficiaryId: string;
  onCreated: () => void;
}) {
  const [issueDate, setIssueDate] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [size, setSize] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Ready to add equipment assignment.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving equipment assignment...");
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("equipment_assignments").insert({
      beneficiary_id: beneficiaryId,
      issue_date: issueDate || new Date().toISOString().slice(0, 10),
      equipment_type: equipmentType.trim(),
      size: size.trim(),
      notes: notes.trim(),
    });

    if (error) {
      setStatus(`Save failed: ${error.message}`);
      return;
    }

    setIssueDate("");
    setEquipmentType("");
    setSize("");
    setNotes("");
    setStatus("Equipment assignment saved successfully.");
    onCreated();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Add equipment assignment</h3>
      <p className="mt-2 text-slate-600">Track issued mobility equipment for this beneficiary.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Issue date
          <input
            type="date"
            value={issueDate}
            onChange={(event) => setIssueDate(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Equipment type
          <select
            value={equipmentType}
            onChange={(event) => setEquipmentType(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">Select equipment</option>
            <option value="Wheelchair">Wheelchair</option>
            <option value="Crutches">Crutches</option>
            <option value="Walker">Walker</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Size
          <input
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Small / Medium / Large"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Condition, special needs, delivery details"
          />
        </label>

        <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white lg:col-span-2">
          Save assignment
        </button>

        <p className="text-sm text-slate-500 lg:col-span-2">{status}</p>
      </form>
    </section>
  );
}
