"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

type TrackingRecord = {
  registration_number?: string;
  status?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  region?: string;
  kebele?: string;
};

export default function RegistrationTracking() {
  const { t } = useLanguage();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [record, setRecord] = useState<TrackingRecord | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = registrationNumber.trim();
    if (!trimmed) {
      setStatusMessage(t("trackValidation"));
      return;
    }

    setIsChecking(true);
    setStatusMessage("");

    try {
      const response = await fetch(`/api/public-beneficiary-status?registration_number=${encodeURIComponent(trimmed)}`);
      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.data) {
        setRecord(null);
        setStatusMessage(body?.error || t("trackNotFound"));
        return;
      }

      setRecord(body.data);
      setStatusMessage(t("trackLoaded"));
    } catch (error) {
      setRecord(null);
      setStatusMessage(error instanceof Error ? error.message : t("trackError"));
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            {t("registrationNumber")}
            <input
              value={registrationNumber}
              onChange={(event) => setRegistrationNumber(event.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3"
              placeholder={t("registrationNumber")}
              required
            />
          </label>
          <button type="submit" disabled={isChecking} className="rounded-2xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400">
            {isChecking ? t("saving") : t("registerBeneficiary")}
          </button>
        </form>

        {statusMessage ? <p className="mt-4 text-sm text-slate-600">{statusMessage}</p> : null}
      </section>

      {record ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("registrationNumber")}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{record.registration_number || t("unknown")}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("status")}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{record.status || t("statusPending")}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("beneficiary")}</p>
              <p className="mt-1 text-slate-900">{record.first_name || t("unknown")} {record.last_name || ""}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("phone")}</p>
              <p className="mt-1 text-slate-900">{record.phone || t("unknown")}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("region")}</p>
              <p className="mt-1 text-slate-900">{record.region || t("unknown")}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("kebele")}</p>
              <p className="mt-1 text-slate-900">{record.kebele || t("unknown")}</p>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
