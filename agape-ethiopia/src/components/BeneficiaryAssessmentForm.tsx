"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function BeneficiaryAssessmentForm({
  beneficiaryId,
  onCreated,
}: {
  beneficiaryId: string;
  onCreated: () => void;
}) {
  const [assessmentDate, setAssessmentDate] = useState("");
  const [measurements, setMeasurements] = useState("");
  const [wheelchairFit, setWheelchairFit] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [status, setStatus] = useState("Ready to add a new mobility assessment.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving assessment...");
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("assessments").insert({
      beneficiary_id: beneficiaryId,
      assessment_date: assessmentDate || new Date().toISOString().slice(0, 10),
      measurements: measurements.trim(),
      wheelchair_fit: wheelchairFit.trim(),
      notes: notes.trim(),
      recommendations: recommendations.trim(),
    });

    if (error) {
      setStatus(`Save failed: ${error.message}`);
      return;
    }

    setAssessmentDate("");
    setMeasurements("");
    setWheelchairFit("");
    setNotes("");
    setRecommendations("");
    setStatus("Assessment saved successfully.");
    onCreated();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Add assessment</h3>
      <p className="mt-2 text-slate-600">Save a new mobility assessment for this beneficiary.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Assessment date
          <input
            type="date"
            value={assessmentDate}
            onChange={(event) => setAssessmentDate(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Measurements
          <input
            value={measurements}
            onChange={(event) => setMeasurements(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Height, seat depth, etc."
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          Wheelchair fitting
          <input
            value={wheelchairFit}
            onChange={(event) => setWheelchairFit(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Fitting information"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Additional assessment observations"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          Recommendations
          <textarea
            value={recommendations}
            onChange={(event) => setRecommendations(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Recommended device, follow-up actions, or referrals"
          />
        </label>

        <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white lg:col-span-2">
          Save assessment
        </button>

        <p className="text-sm text-slate-500 lg:col-span-2">{status}</p>
      </form>
    </section>
  );
}
