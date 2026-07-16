"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function RequestPortal() {
  const { t } = useLanguage();
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [itemNeeded, setItemNeeded] = useState("");
  const [needDetails, setNeedDetails] = useState("");
  const [status, setStatus] = useState(t("request.ready"));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(t("request.submitting"));

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          beneficiary_name: beneficiaryName,
          item_needed: itemNeeded,
          need_details: needDetails,
          status: "pending",
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus(result?.error ? `${t("request.submitFailed")} ${result.error}` : t("request.submitFailed"));
        return;
      }

      setBeneficiaryName("");
      setItemNeeded("");
      setNeedDetails("");
      setStatus(t("request.success"));
    } catch (error) {
      setStatus(error instanceof Error ? `${t("request.submitFailed")} ${error.message}` : t("request.submitFailed"));
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{t("request.title")}</h2>
      <p className="mt-2 text-slate-600">{t("request.description")}</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("request.beneficiaryName")}
          <input value={beneficiaryName} onChange={(event) => setBeneficiaryName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("request.exampleName")} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("request.itemNeeded")}
          <input value={itemNeeded} onChange={(event) => setItemNeeded(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("request.exampleItem")} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          {t("request.details")}
          <textarea value={needDetails} onChange={(event) => setNeedDetails(event.target.value)} className="min-h-24 rounded-xl border border-slate-300 px-4 py-3" placeholder={t("request.detailsPlaceholder")} />
        </label>
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white md:col-span-2">{t("request.create")}</button>
        <p className="text-sm text-slate-500 md:col-span-2">{status}</p>
      </form>
    </section>
  );
}
