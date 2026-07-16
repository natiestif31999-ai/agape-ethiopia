"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function DonationForm() {
  const { t } = useLanguage();
  const [donorName, setDonorName] = useState("");
  const [itemType, setItemType] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(t("donation.status.ready"));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(t("donation.status.saving"));

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
        setStatus(result?.error ? `${t("donation.status.saveFailed")} ${result.error}` : t("donation.status.saveFailed"));
        return;
      }

      setDonorName("");
      setItemType("");
      setNotes("");
      setStatus(t("donation.status.saved"));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("donation.status.saveFailed"));
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{t("donation.title")}</h2>
      <p className="mt-2 text-slate-600">{t("donation.description")}</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.donorName")}
          <input value={donorName} onChange={(event) => setDonorName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("donation.placeholder.donorName")} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.itemType")}
          <input value={itemType} onChange={(event) => setItemType(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("donation.placeholder.itemType")} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          {t("donation.notes")}
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-24 rounded-xl border border-slate-300 px-4 py-3" placeholder={t("donation.placeholder.notes")} />
        </label>
        <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white md:col-span-2">{t("donation.save")}</button>
        <p className="text-sm text-slate-500 md:col-span-2">{status}</p>
      </form>
    </section>
  );
}
