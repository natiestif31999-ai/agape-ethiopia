"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { EquipmentDistribution } from "@/lib/types";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function EquipmentDistributionForm({
  beneficiaryId,
  onCreated,
}: {
  beneficiaryId?: string;
  onCreated?: () => void;
}) {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(beneficiaryId ?? "");
  const [equipmentType, setEquipmentType] = useState("");
  const [equipmentSize, setEquipmentSize] = useState("");
  const [distributionDate, setDistributionDate] = useState("");
  const [distributionLocation, setDistributionLocation] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);
  const [notes, setNotes] = useState("");
  const { t } = useLanguage();
  const [status, setStatus] = useState(t("equipment.distribution.ready"));
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(t("equipment.distribution.saving"));

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
        setStatus(result?.error ? `${t("equipment.distribution.saveFailed")} ${result.error}` : t("equipment.distribution.saveFailed"));
        setIsSaving(false);
        return;
      }

      setStatus(t("equipment.distribution.saved"));
      setEquipmentType("");
      setEquipmentSize("");
      setDistributionDate("");
      setDistributionLocation("");
      setReceivedBy("");
      setSignatureConfirmed(false);
      setNotes("");
      onCreated?.();
    } catch (error) {
      setStatus(error instanceof Error ? `${t("equipment.distribution.saveFailed")} ${error.message}` : t("equipment.distribution.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{t("equipment.distribution.title")}</h2>
      <p className="mt-2 text-slate-600">{t("equipment.distribution.description")}</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          {t("equipment.fields.beneficiaryId")}
          <input
            value={selectedBeneficiary}
            onChange={(event) => setSelectedBeneficiary(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("equipment.placeholder.beneficiaryId")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("equipment.fields.type")}
          <select
            value={equipmentType}
            onChange={(event) => setEquipmentType(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">{t("equipment.placeholder.selectEquipment")}</option>
            <option value="Adult Wheelchair">{t("adultWheelchair")}</option>
            <option value="Children Wheelchair">{t("childrenWheelchair")}</option>
            <option value="Crutches">{t("crutches")}</option>
            <option value="Walker">{t("walker")}</option>
            <option value="Other">{t("other")}</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("equipment.fields.size")}
          <select
            value={equipmentSize}
            onChange={(event) => setEquipmentSize(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">{t("equipment.placeholder.selectSize")}</option>
            <option value="Small">{t("sizeSmall")}</option>
            <option value="Medium">{t("sizeMedium")}</option>
            <option value="Large">{t("sizeLarge")}</option>
            <option value="Extra Large">{t("sizeXL")}</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("equipment.fields.distributionDate")}
          <input
            type="date"
            value={distributionDate}
            onChange={(event) => setDistributionDate(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("location")}
          <input
            value={distributionLocation}
            onChange={(event) => setDistributionLocation(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("equipment.placeholder.distributionLocation")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("receivedBy")}
          <input
            value={receivedBy}
            onChange={(event) => setReceivedBy(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("equipment.placeholder.receivedBy")}
          />
        </label>

        <label className="flex items-center gap-3 text-sm font-medium text-slate-700 lg:col-span-2">
          <input
            type="checkbox"
            checked={signatureConfirmed}
            onChange={(event) => setSignatureConfirmed(event.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-emerald-700"
          />
          {t("equipment.fields.signatureConfirmed")}
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          {t("notes")}
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("equipment.placeholder.notes")}
          />
        </label>

        <button type="submit" disabled={isSaving} className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white lg:col-span-2 disabled:cursor-not-allowed disabled:bg-slate-400">
          {isSaving ? t("equipment.distribution.saving") : t("equipment.distribution.save")}
        </button>

        <p className="text-sm text-slate-500 lg:col-span-2">{status}</p>
      </form>
    </section>
  );
}
