"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import type { EquipmentDistribution } from "@/lib/types";

export default function EquipmentDistributionForm({
  beneficiaryId,
  onCreated,
}: {
  beneficiaryId?: string;
  onCreated?: () => void;
}) {
  const { t } = useLanguage();
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(beneficiaryId ?? "");
  const [equipmentType, setEquipmentType] = useState("");
  const [equipmentSize, setEquipmentSize] = useState("");
  const [distributionDate, setDistributionDate] = useState("");
  const [distributionLocation, setDistributionLocation] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Ready to record equipment distribution.");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("Saving distribution record...");

    const payload: EquipmentDistribution = {
      beneficiary_id: selectedBeneficiary,
      equipment_type: equipmentType.trim(),
      equipment_size: equipmentSize.trim(),
      distribution_date: distributionDate || new Date().toISOString().slice(0, 10),
      distribution_location: distributionLocation.trim(),
      received_by: receivedBy.trim(),
      signature_confirmed: signatureConfirmed,
      notes: notes.trim(),
    };

    try {
      const response = await fetch("/api/equipment-distributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus(result?.error ? `Save failed: ${result.error}` : "Save failed.");
        setIsSaving(false);
        return;
      }

      setStatus("Equipment distribution saved successfully.");
      setEquipmentType("");
      setEquipmentSize("");
      setDistributionDate("");
      setDistributionLocation("");
      setReceivedBy("");
      setSignatureConfirmed(false);
      setNotes("");
      onCreated?.();
    } catch (error) {
      setStatus(error instanceof Error ? `Save failed: ${error.message}` : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Distribute Equipment</h2>
      <p className="mt-2 text-slate-600">Record wheelchair distribution events for beneficiaries.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          Beneficiary ID
          <input
            value={selectedBeneficiary}
            onChange={(event) => setSelectedBeneficiary(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Beneficiary UUID"
            required
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
            <option value="Adult Wheelchair">Adult Wheelchair</option>
            <option value="Children Wheelchair">Children Wheelchair</option>
            <option value="Crutches">Crutches</option>
            <option value="Walker">Walker</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Equipment size
          <select
            value={equipmentSize}
            onChange={(event) => setEquipmentSize(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">Select size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Distribution date
          <input
            type="date"
            value={distributionDate}
            onChange={(event) => setDistributionDate(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Location
          <input
            value={distributionLocation}
            onChange={(event) => setDistributionLocation(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Distribution location"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Received by
          <input
            value={receivedBy}
            onChange={(event) => setReceivedBy(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Recipient or staff name"
          />
        </label>

        <label className="flex items-center gap-3 text-sm font-medium text-slate-700 lg:col-span-2">
          <input
            type="checkbox"
            checked={signatureConfirmed}
            onChange={(event) => setSignatureConfirmed(event.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-emerald-700"
          />
          Signature confirmed
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Delivery details or beneficiary observations"
          />
        </label>

        <button type="submit" disabled={isSaving} className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white lg:col-span-2 disabled:cursor-not-allowed disabled:bg-slate-400">
          {isSaving ? "Saving distribution..." : "Save distribution"}
        </button>

        <p className="text-sm text-slate-500 lg:col-span-2">{status}</p>
      </form>
    </section>
  );
}
