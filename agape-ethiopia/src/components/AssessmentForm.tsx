"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Assessment } from "@/lib/types";

export default function AssessmentForm({
  beneficiaryId,
}: {
  beneficiaryId?: string;
}) {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(beneficiaryId ?? "");
  const [hipWidth, setHipWidth] = useState("");
  const [seatDepth, setSeatDepth] = useState("");
  const [backHeight, setBackHeight] = useState("");
  const [recommendedEquipment, setRecommendedEquipment] = useState("");
  const [recommendedSize, setRecommendedSize] = useState("");
  const [assessorName, setAssessorName] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Ready to add a new assessment.");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus("Saving assessment...");

    const payload: Assessment = {
      beneficiary_id: selectedBeneficiary,
      hip_width: hipWidth.trim(),
      seat_depth: seatDepth.trim(),
      back_height: backHeight.trim(),
      recommended_equipment: recommendedEquipment.trim(),
      recommended_size: recommendedSize.trim(),
      assessor_name: assessorName.trim(),
      assessment_date: assessmentDate || new Date().toISOString().slice(0, 10),
      notes: notes.trim(),
    };

    try {
      const response = await fetch("/api/assessments", {
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

      setStatus("Assessment saved successfully.");
      setHipWidth("");
      setSeatDepth("");
      setBackHeight("");
      setRecommendedEquipment("");
      setRecommendedSize("");
      setAssessorName("");
      setAssessmentDate("");
      setNotes("");
    } catch (error) {
      setStatus(error instanceof Error ? `Save failed: ${error.message}` : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">New Assessment</h2>
      <p className="mt-2 text-slate-600">Capture structured wheelchair measurement data for a beneficiary.</p>
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
          Hip Width
          <input
            value={hipWidth}
            onChange={(event) => setHipWidth(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Hip width"
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Seat Depth
          <input
            value={seatDepth}
            onChange={(event) => setSeatDepth(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Seat depth"
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Back Height
          <input
            value={backHeight}
            onChange={(event) => setBackHeight(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Back height"
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Recommended equipment
          <select
            value={recommendedEquipment}
            onChange={(event) => setRecommendedEquipment(event.target.value)}
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
          Recommended size
          <select
            value={recommendedSize}
            onChange={(event) => setRecommendedSize(event.target.value)}
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
          Assessor name
          <input
            value={assessorName}
            onChange={(event) => setAssessorName(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Assessor name"
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Assessment date
          <input
            type="date"
            value={assessmentDate}
            onChange={(event) => setAssessmentDate(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Additional assessment notes"
          />
        </label>

        <button type="submit" disabled={isSaving} className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white lg:col-span-2 disabled:cursor-not-allowed disabled:bg-slate-400">
          {isSaving ? "Saving assessment..." : "Save assessment"}
        </button>

        <p className="text-sm text-slate-500 lg:col-span-2">{status}</p>
      </form>
    </section>
  );
}
