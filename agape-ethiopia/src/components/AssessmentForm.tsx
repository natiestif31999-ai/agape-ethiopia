"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import type { FormEvent } from "react";
import type { Assessment } from "@/lib/types";

export default function AssessmentForm({
  beneficiaryId,
}: {
  beneficiaryId?: string;
}) {
  const { t } = useLanguage();
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(beneficiaryId ?? "");
  const [hipWidth, setHipWidth] = useState("");
  const [seatDepth, setSeatDepth] = useState("");
  const [backHeight, setBackHeight] = useState("");
  const [recommendedEquipment, setRecommendedEquipment] = useState("");
  const [recommendedSize, setRecommendedSize] = useState("");
  const [assessorName, setAssessorName] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(t("assessmentReady") || "Ready to add a new assessment.");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(t("savingAssessment") || "Saving assessment...");

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
        setStatus(result?.error ? `${t("saveFailed")} ${result.error}` : t("saveFailed"));
        setIsSaving(false);
        return;
      }

      setStatus(t("assessmentSaved") || "Assessment saved successfully.");
      setHipWidth("");
      setSeatDepth("");
      setBackHeight("");
      setRecommendedEquipment("");
      setRecommendedSize("");
      setAssessorName("");
      setAssessmentDate("");
      setNotes("");
    } catch (error) {
      setStatus(error instanceof Error ? `${t("saveFailed")} ${error.message}` : t("saveFailed"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{t("newAssessment")}</h2>
      <p className="mt-2 text-slate-600">{t("assessmentDescription")}</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          {t("beneficiaryId")}
          <input
            value={selectedBeneficiary}
            onChange={(event) => setSelectedBeneficiary(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("beneficiaryIdPlaceholder")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("hipWidth")}
          <input
            value={hipWidth}
            onChange={(event) => setHipWidth(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("hipWidthPlaceholder")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("seatDepth")}
          <input
            value={seatDepth}
            onChange={(event) => setSeatDepth(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("seatDepthPlaceholder")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("backHeight")}
          <input
            value={backHeight}
            onChange={(event) => setBackHeight(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("backHeightPlaceholder")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("recommendedEquipment")}
          <select
            value={recommendedEquipment}
            onChange={(event) => setRecommendedEquipment(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">{t("selectEquipment")}</option>
            <option value="Adult Wheelchair">{t("adultWheelchair")}</option>
            <option value="Children Wheelchair">{t("childrenWheelchair")}</option>
            <option value="Crutches">{t("crutches")}</option>
            <option value="Walker">{t("walker")}</option>
            <option value="Other">{t("other")}</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("recommendedSize")}
          <select
            value={recommendedSize}
            onChange={(event) => setRecommendedSize(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">{t("selectSize")}</option>
            <option value="Small">{t("sizeSmall")}</option>
            <option value="Medium">{t("sizeMedium")}</option>
            <option value="Large">{t("sizeLarge")}</option>
            <option value="Extra Large">{t("sizeXL")}</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("assessorName")}
          <input
            value={assessorName}
            onChange={(event) => setAssessorName(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("assessorNamePlaceholder")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("assessmentDate")}
          <input
            type="date"
            value={assessmentDate}
            onChange={(event) => setAssessmentDate(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
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

        <button type="submit" disabled={isSaving} className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white lg:col-span-2 disabled:cursor-not-allowed disabled:bg-slate-400">
          {isSaving ? t("savingAssessment") : t("saveAssessment")}
        </button>

        <p className="text-sm text-slate-500 lg:col-span-2">{status}</p>
      </form>
    </section>
  );
}
