"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getSupabaseClient } from "@/lib/supabase/client";

type BeneficiaryRecord = {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  region?: string;
  disability_type?: string;
  notes?: string;
  status?: string;
  created_at?: string;
};

type EditingBeneficiary = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  region: string;
  disability_type: string;
  notes: string;
  status: string;
};

export default function StaffDashboard() {
  const { t } = useLanguage();
  const [records, setRecords] = useState<BeneficiaryRecord[]>([]);
  const [filter, setFilter] = useState("all");
  const [statusMessage, setStatusMessage] = useState(t("loadingApplications") || "Loading applications...");
  const [editingRecord, setEditingRecord] = useState<EditingBeneficiary | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  async function loadRecords() {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("beneficiaries").select("*").order("created_at", { ascending: false });
      if (error) {
        setStatusMessage(`${t("unableToLoadApplications")} ${error.message}`);
        return;
      }
      setRecords(data ?? []);
      setStatusMessage(t("applicationsLoaded"));
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : t("unableToLoadApplicationsShort"));
    }
  }

  useEffect(() => {
    void loadRecords();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("beneficiaries").update({ status }).eq("id", id);
      if (error) {
        setStatusMessage(`${t("unableToUpdateStatus")} ${error.message}`);
        return;
      }
        setStatusMessage(`${t("statusUpdated")} ${status}.`);
      await loadRecords();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to update status.");
    }
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingRecord) return;

    try {
      setIsSavingEdit(true);
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("beneficiaries")
        .update({
          first_name: editingRecord.first_name.trim() || null,
          last_name: editingRecord.last_name.trim() || null,
          phone: editingRecord.phone.trim() || null,
          region: editingRecord.region.trim() || null,
          disability_type: editingRecord.disability_type.trim() || null,
          notes: editingRecord.notes.trim() || null,
          status: editingRecord.status || "pending",
        })
        .eq("id", editingRecord.id);

      if (error) {
        setStatusMessage(`${t("unableToSaveChanges")} ${error.message}`);
        return;
      }

        setStatusMessage(t("beneficiaryUpdated"));
      setEditingRecord(null);
      await loadRecords();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to save changes.");
    } finally {
      setIsSavingEdit(false);
    }
  }

  const visibleRecords = records.filter((record) => filter === "all" || (record.status ?? "pending") === filter);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{t("staffReviewDashboard")}</h1>
          <p className="mt-2 text-slate-600">{t("staffReviewDescription")}</p>
        </div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3">
          <option value="all">{t("allStatuses")}</option>
          <option value="pending">{t("statusPending")}</option>
          <option value="approved">{t("statusApproved")}</option>
          <option value="rejected">{t("statusRejected")}</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-slate-500">{statusMessage}</p>

      <div className="mt-6 space-y-4">
        {visibleRecords.map((record) => {
          const isEditing = editingRecord?.id === record.id;

          return (
            <article key={record.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {[record.first_name, record.last_name].filter(Boolean).join(" ") || t("unnamed")}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{t("phone")} : {record.phone || t("unknown")}</p>
                  <p className="text-sm text-slate-600">{t("location")} : {record.region || t("unknown")}</p>
                  <p className="text-sm text-slate-600">{t("needs")} : {record.disability_type || t("unknown")}</p>
                  <p className="text-sm text-slate-600">{t("notes")} : {record.notes || t("unknown")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">{record.status || t("statusPending")}</span>
                  <button type="button" onClick={() => setEditingRecord({ id: record.id, first_name: record.first_name ?? "", last_name: record.last_name ?? "", phone: record.phone ?? "", region: record.region ?? "", disability_type: record.disability_type ?? "", notes: record.notes ?? "", status: record.status ?? "pending" })} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700">{t("edit")}</button>
                  <button type="button" onClick={() => updateStatus(record.id, "approved")} className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">{t("approve")}</button>
                  <button type="button" onClick={() => updateStatus(record.id, "rejected")} className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">{t("reject")}</button>
                </div>
              </div>

              {isEditing && editingRecord && (
                <form onSubmit={saveEdit} className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
                    <label className="grid gap-1 text-sm text-slate-700">
                    {t("firstName")}
                    <input value={editingRecord.first_name} onChange={(event) => setEditingRecord({ ...editingRecord, first_name: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2" />
                  </label>
                  <label className="grid gap-1 text-sm text-slate-700">
                    {t("grandfathersName")}
                    <input value={editingRecord.last_name} onChange={(event) => setEditingRecord({ ...editingRecord, last_name: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2" />
                  </label>
                  <label className="grid gap-1 text-sm text-slate-700">
                    {t("phone")}
                    <input value={editingRecord.phone} onChange={(event) => setEditingRecord({ ...editingRecord, phone: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2" />
                  </label>
                  <label className="grid gap-1 text-sm text-slate-700">
                    {t("region")}
                    <input value={editingRecord.region} onChange={(event) => setEditingRecord({ ...editingRecord, region: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2" />
                  </label>
                  <label className="grid gap-1 text-sm text-slate-700 md:col-span-2">
                    {t("needs")}
                    <input value={editingRecord.disability_type} onChange={(event) => setEditingRecord({ ...editingRecord, disability_type: event.target.value })} className="rounded-xl border border-slate-300 px-3 py-2" />
                  </label>
                  <label className="grid gap-1 text-sm text-slate-700 md:col-span-2">
                    {t("notes")}
                    <textarea value={editingRecord.notes} onChange={(event) => setEditingRecord({ ...editingRecord, notes: event.target.value })} className="min-h-24 rounded-xl border border-slate-300 px-3 py-2" />
                  </label>
                  <label className="grid gap-1 text-sm text-slate-700">
                    {t("status")}
                    <select value={editingRecord.status} onChange={(event) => setEditingRecord({ ...editingRecord, status: event.target.value })} className="rounded-xl border border-slate-300 bg-white px-3 py-2">
                      <option value="pending">{t("statusPending")}</option>
                      <option value="approved">{t("statusApproved")}</option>
                      <option value="rejected">{t("statusRejected")}</option>
                    </select>
                  </label>
                  <div className="flex gap-2 md:col-span-2">
                    <button type="submit" disabled={isSavingEdit} className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400">{isSavingEdit ? t("saving") : t("saveChanges")}</button>
                    <button type="button" onClick={() => setEditingRecord(null)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">{t("cancel")}</button>
                  </div>
                </form>
              )}
            </article>
          );
        })}
        {visibleRecords.length === 0 && <p className="text-sm text-slate-500">{t("noApplicationsMatch")}</p>}
      </div>
    </section>
  );
}
