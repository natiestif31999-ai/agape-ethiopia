"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
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
  const { t } = useLanguage();
  const [status, setStatus] = useState(t("assignmentReady"));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(t("savingAssignment"));
    const supabase = getSupabaseClient();

    const { error } = await supabase.from("equipment_assignments").insert({
      beneficiary_id: beneficiaryId,
      issue_date: issueDate || new Date().toISOString().slice(0, 10),
      equipment_type: equipmentType.trim(),
      size: size.trim(),
      notes: notes.trim(),
    });

    if (error) {
      setStatus(t("saveFailed") + " " + error.message);
      return;
    }

    setIssueDate("");
    setEquipmentType("");
    setSize("");
    setNotes("");
    setStatus(t("assignmentSaved"));
    onCreated();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{t("addEquipmentAssignment")}</h3>
      <p className="mt-2 text-slate-600">{t("trackAssignedEquipment")}</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("issueDate")}
          <input
            type="date"
            value={issueDate}
            onChange={(event) => setIssueDate(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("equipmentType")}
          <select
            value={equipmentType}
            onChange={(event) => setEquipmentType(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">{t("selectEquipment")}</option>
            <option value="Wheelchair">{t("adultWheelchair")}</option>
            <option value="Crutches">{t("crutches")}</option>
            <option value="Walker">{t("walker")}</option>
            <option value="Other">{t("other")}</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("size")}
          <input
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={`${t("sizeSmall")} / ${t("sizeMedium")} / ${t("sizeLarge")}`}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          {t("notes")}
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("assignmentNotesPlaceholder")}
          />
        </label>

        <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white lg:col-span-2">
          {t("saveChanges")}
        </button>

        <p className="text-sm text-slate-500 lg:col-span-2">{status}</p>
      </form>
    </section>
  );
}
