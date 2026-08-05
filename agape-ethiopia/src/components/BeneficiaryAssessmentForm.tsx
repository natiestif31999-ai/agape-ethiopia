"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
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
  const [seatWidth, setSeatWidth] = useState("");
  const [seatDepth, setSeatDepth] = useState("");
  const [backHeight, setBackHeight] = useState("");
  const [armrestHeight, setArmrestHeight] = useState("");
  const [footrestLength, setFootrestLength] = useState("");
  const [overallHeight, setOverallHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [wheelchairFit, setWheelchairFit] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const { t } = useLanguage();
  const [status, setStatus] = useState(t("assessmentReady"));

  function parseNumericValue(value: string) {
    const normalized = value.trim();
    if (!normalized) return null;
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(t("savingAssessment"));
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("assessments").insert({
      beneficiary_id: beneficiaryId,
      assessment_date: assessmentDate || new Date().toISOString().slice(0, 10),
      seat_width: seatWidth.trim() || null,
      seat_width_value: parseNumericValue(seatWidth),
      seat_depth: seatDepth.trim() || null,
      seat_depth_value: parseNumericValue(seatDepth),
      back_height: backHeight.trim() || null,
      back_height_value: parseNumericValue(backHeight),
      armrest_height: armrestHeight.trim() || null,
      arm_rest_height_value: parseNumericValue(armrestHeight),
      footrest_length: footrestLength.trim() || null,
      foot_rest_height_value: parseNumericValue(footrestLength),
      overall_height: overallHeight.trim() || null,
      height_value: parseNumericValue(overallHeight),
      weight: weight.trim() || null,
      weight_value: parseNumericValue(weight),
      wheelchair_fit: wheelchairFit.trim(),
      notes: notes.trim(),
      recommendations: recommendations.trim(),
    });

    if (error) {
      setStatus(t("saveFailed") + " " + error.message);
      return;
    }

    setAssessmentDate("");
    setSeatWidth("");
    setSeatDepth("");
    setBackHeight("");
    setArmrestHeight("");
    setFootrestLength("");
    setOverallHeight("");
    setWeight("");
    setWheelchairFit("");
    setNotes("");
    setRecommendations("");
    setStatus(t("assessmentSaved"));
    onCreated();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{t("newAssessment")}</h3>
      <p className="mt-2 text-slate-600">{t("assessmentDescription")}</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("assessmentDate")}
          <input
            type="date"
            value={assessmentDate}
            onChange={(event) => setAssessmentDate(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("seatWidth")}
          <input
            type="number"
            min="0"
            step="0.01"
            value={seatWidth}
            onChange={(event) => setSeatWidth(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("hipWidthPlaceholder")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("seatDepth")}
          <input
            type="number"
            min="0"
            step="0.01"
            value={seatDepth}
            onChange={(event) => setSeatDepth(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("seatDepthPlaceholder")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("backHeight")}
          <input
            type="number"
            min="0"
            step="0.01"
            value={backHeight}
            onChange={(event) => setBackHeight(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("backHeightPlaceholder")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("armrestHeight")}
          <input
            type="number"
            min="0"
            step="0.01"
            value={armrestHeight}
            onChange={(event) => setArmrestHeight(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("armrestHeight")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("footrestLength")}
          <input
            type="number"
            min="0"
            step="0.01"
            value={footrestLength}
            onChange={(event) => setFootrestLength(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("footrestLength")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("overallHeight")}
          <input
            type="number"
            min="0"
            step="0.01"
            value={overallHeight}
            onChange={(event) => setOverallHeight(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("overallHeight")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("weight")}
          <input
            type="number"
            min="0"
            step="0.1"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("weight")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          {t("wheelchairFitting")}
          <input
            value={wheelchairFit}
            onChange={(event) => setWheelchairFit(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("wheelchairFittingPlaceholder")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          {t("notes")}
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("additionalAssessmentNotes")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          {t("recommendations")}
          <textarea
            value={recommendations}
            onChange={(event) => setRecommendations(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("recommendationsPlaceholder")}
          />
        </label>

        <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white lg:col-span-2">
          {t("saveAssessment")}
        </button>

        <p className="text-sm text-slate-500 lg:col-span-2">{status}</p>
      </form>
    </section>
  );
}
