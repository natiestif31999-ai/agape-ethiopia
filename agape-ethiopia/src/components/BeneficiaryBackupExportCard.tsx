"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface BeneficiaryBackupExportCardProps {
  totalBeneficiaries: number;
  totalRegions: number;
}

export default function BeneficiaryBackupExportCard({ totalBeneficiaries, totalRegions }: BeneficiaryBackupExportCardProps) {
  const { t } = useLanguage();
  const exportInProgress = useRef(false);
  const [status, setStatus] = useState<"ready" | "generating" | "success" | "error">("ready");
  const [message, setMessage] = useState<string>(t("beneficiaryExportReady") || "Ready");
  const [filename, setFilename] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [exportedCounts, setExportedCounts] = useState<{ beneficiaries: number; regions: number } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCurrentSummary = async () => {
      try {
        const response = await fetch("/api/beneficiaries/export?summary=1", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const summary = await response.json();
        if (active && Number.isFinite(summary.totalBeneficiaries) && Number.isFinite(summary.totalRegions)) {
          setExportedCounts({ beneficiaries: summary.totalBeneficiaries, regions: summary.totalRegions });
        }
      } catch {
        return;
      } finally {
        if (active) {
          setSummaryLoading(false);
        }
      }
    };

    void loadCurrentSummary();
    return () => {
      active = false;
    };
  }, []);

  const handleExport = async () => {
    if (exportInProgress.current) {
      return;
    }
    exportInProgress.current = true;
    setStatus("generating");
    setMessage(t("beneficiaryExportGenerating") || "Preparing beneficiary backup...");

    try {
      const response = await fetch("/api/beneficiaries/export", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(t("beneficiaryExportError") || "Unable to generate beneficiary backup. Please try again.");
      }

      const blob = await response.blob();
      const exportedBeneficiaries = Number(response.headers.get("X-Exported-Beneficiary-Count"));
      const exportedRegions = Number(response.headers.get("X-Exported-Region-Count"));
      const generatedTimestamp = response.headers.get("X-Generated-At");
      const disposition = response.headers.get("content-disposition") || "";
      const match = disposition.match(/filename="?([^";]+)"?/i) || disposition.match(/filename=([^;]+)/i);
      const resolvedFilename = match ? match[1].trim() : `Agape_Beneficiary_Backup_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.xlsx`;

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = resolvedFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      const generatedTime = generatedTimestamp ? new Date(generatedTimestamp).toLocaleString() : new Date().toLocaleString();
      setFilename(resolvedFilename);
      setGeneratedAt(generatedTime);
      setExportedCounts({
        beneficiaries: Number.isFinite(exportedBeneficiaries) ? exportedBeneficiaries : totalBeneficiaries,
        regions: Number.isFinite(exportedRegions) ? exportedRegions : totalRegions,
      });
      setStatus("success");
      const exportedCount = Number.isFinite(exportedBeneficiaries) ? exportedBeneficiaries : totalBeneficiaries;
      setMessage(`${t("beneficiaryExportSuccess") || "Beneficiary backup generated successfully."} (${exportedCount} ${t("beneficiaries") || "beneficiaries"})`);
    } catch {
      setStatus("error");
      setMessage(t("beneficiaryExportError") || "Unable to generate beneficiary backup. Please try again.");
    } finally {
      exportInProgress.current = false;
    }
  };

  const statusStyles = {
    ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
    generating: "border-amber-200 bg-amber-50 text-amber-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t("beneficiaryBackupExport") || "Beneficiary Backup & Export"}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{t("beneficiaryBackupExport") || "Beneficiary Backup & Export"}</h3>
        </div>
        <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusStyles[status]}`}>
          {status === "ready" ? t("beneficiaryExportReady") || "Ready" : status === "generating" ? t("beneficiaryExportGenerating") || "Preparing beneficiary backup..." : status === "success" ? t("beneficiaryExportSuccess") || "Backup generated successfully" : t("beneficiaryExportError") || "Unable to generate beneficiary backup."}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("totalBeneficiaries") || "Total Beneficiaries"}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{summaryLoading ? t("loading") || "Loading..." : exportedCounts?.beneficiaries ?? totalBeneficiaries}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("totalRegions") || "Total Regions"}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{summaryLoading ? t("loading") || "Loading..." : exportedCounts?.regions ?? totalRegions}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("lastGeneratedBackup") || "Last Generated Backup"}</p>
          <p className="mt-2 text-sm font-medium text-slate-700">{generatedAt || t("beneficiaryBackupNotGenerated") || "Not generated yet"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">{t("exportStatus") || "Export Status"}</p>
          <p className="mt-2 text-sm font-medium text-slate-700">{filename || t("beneficiaryExportReady") || "Ready"}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={handleExport}
          disabled={status === "generating"}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {status === "generating" ? t("beneficiaryExportGenerating") || "Preparing beneficiary backup..." : t("downloadFullBeneficiaryBackup") || "Download Full Beneficiary Backup"}
        </button>
        {message && <p className="text-sm text-slate-700">{message}</p>}
      </div>
    </section>
  );
}
