"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/layout/LanguageProvider";

type DonationSummary = {
  amount?: number;
  currency?: string;
  payment_provider?: string;
  country?: string;
  status?: string;
  donation_purpose?: string;
  donation_date?: string;
};

export default function DonationReport() {
  const { t } = useLanguage();
  const [rows, setRows] = useState<DonationSummary[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setRows([]);
        return;
      }

      const { data, error } = await supabase.from("donations").select("amount,currency,payment_provider,country,status,donation_purpose,donation_date").order("donation_date", { ascending: false }).limit(100);

      if (!mounted) return;
      if (error) {
        console.warn("Donation report load failed:", error.message);
        setRows([]);
        return;
      }

      setRows((data ?? []) as DonationSummary[]);
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalDonations = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
    const providers = Object.entries(
      rows.reduce<Record<string, number>>((acc, row) => {
        const key = row.payment_provider || t("unknown");
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]);

    return {
      totalDonations,
      providers,
      pending: rows.filter((row) => row.status === "pending").length,
      successful: rows.filter((row) => row.status === "successful").length,
    };
  }, [rows, t]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{t("donation.reportTitle")}</h2>
      <p className="mt-2 text-slate-600">{t("donation.reportDescription")}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">{t("donation.totalDonations")}</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-950">{stats.totalDonations.toFixed(2)}</p>
        </article>
        <article className="rounded-2xl bg-amber-50 p-4">
          <p className="text-sm text-amber-700">{t("donation.pendingDonations")}</p>
          <p className="mt-2 text-3xl font-semibold text-amber-950">{stats.pending}</p>
        </article>
        <article className="rounded-2xl bg-sky-50 p-4">
          <p className="text-sm text-sky-700">{t("donation.successfulPayments")}</p>
          <p className="mt-2 text-3xl font-semibold text-sky-950">{stats.successful}</p>
        </article>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">{t("donation.amount")}</th>
              <th className="px-4 py-3">{t("donation.paymentProvider")}</th>
              <th className="px-4 py-3">{t("donation.country")}</th>
              <th className="px-4 py-3">{t("donation.purpose")}</th>
              <th className="px-4 py-3">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, index) => (
              <tr key={`${row.payment_provider ?? "provider"}-${row.donation_date ?? index}`}>
                <td className="px-4 py-3">{Number(row.amount ?? 0).toFixed(2)} {row.currency ?? "USD"}</td>
                <td className="px-4 py-3">{row.payment_provider ?? t("unknown")}</td>
                <td className="px-4 py-3">{row.country ?? t("unknown")}</td>
                <td className="px-4 py-3">{row.donation_purpose ?? t("unknown")}</td>
                <td className="px-4 py-3">{row.status ?? t("statusPending")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
