"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getSupabaseClient } from "@/lib/supabase/client";

type UserProfile = {
  id: string;
  email?: string;
  role?: string;
  is_disabled?: boolean;
};

type BeneficiaryRecord = {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  region?: string;
  status?: string;
};

type DonationRecord = {
  id?: string;
  donor_name?: string;
  donor_email?: string;
  amount?: number;
  currency?: string;
  country?: string;
  payment_provider?: string;
  donation_purpose?: string;
  status?: string;
  receipt_number?: string;
  donation_date?: string;
  created_at?: string;
};

type SiteSetting = {
  id?: string;
  key: string;
  value: string;
};

export default function AdminDashboard() {
  function capitalize(s?: string) {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryRecord[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [heroText, setHeroText] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [bankTransferSettings, setBankTransferSettings] = useState("[]");
  const [purposeSettings, setPurposeSettings] = useState("[]");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusMessage, setStatusMessage] = useState(t("loading") + "");

  const loadData = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      const [profilesResult, beneficiariesResult, donationsResult, settingsResult] = await Promise.all([
        supabase.from("users").select("id,email,role,is_disabled").limit(20),
        supabase.from("beneficiaries").select("id,first_name,last_name,phone,region,status").order("created_at", { ascending: false }).limit(50),
        supabase.from("donations").select("id,donor_name,donor_email,amount,currency,country,payment_provider,donation_purpose,status,receipt_number,donation_date,created_at").order("created_at", { ascending: false }).limit(100),
        supabase.from("site_settings").select("id,key,value"),
      ]);

      if (profilesResult.error) {
        console.warn("Profiles load failed", profilesResult.error.message);
      }
      if (beneficiariesResult.error) {
        console.warn("Beneficiaries load failed", beneficiariesResult.error.message);
      }
      if (donationsResult.error) {
        console.warn("Donations load failed", donationsResult.error.message);
      }
      if (settingsResult.error) {
        console.warn("Settings load failed", settingsResult.error.message);
      }

      const settingsRows = (settingsResult.data ?? []) as SiteSetting[];
      const settingMap = Object.fromEntries(settingsRows.map((setting) => [setting.key, setting.value]));

      setProfiles(profilesResult.data ?? []);
      setBeneficiaries(beneficiariesResult.data ?? []);
      setDonations(donationsResult.data ?? []);
      setSettings(settingsRows);
      setTitle(settingMap.title ?? t("applicationName"));
      setHeroText(settingMap.hero_text ?? t("adminCenterDescription"));
      setButtonLabel(settingMap.button_label ?? t("registerBeneficiary"));
      setPrimaryColor(settingMap.primary_color ?? "#0f766e");
      setBankTransferSettings(settingMap.donation_bank_accounts ?? "[]");
      setPurposeSettings(settingMap.donation_purposes ?? "[]");
      setStatusMessage(t("applicationsLoaded"));
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : t("unableToLoadApplicationsShort"));
    }
  }, [t]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const supabase = getSupabaseClient();
      const payload: Array<{ key: string; value: string }> = [
        { key: "title", value: title },
        { key: "hero_text", value: heroText },
        { key: "button_label", value: buttonLabel },
        { key: "primary_color", value: primaryColor },
        { key: "donation_bank_accounts", value: bankTransferSettings },
        { key: "donation_purposes", value: purposeSettings },
      ];

      for (const item of payload) {
        const existing = settings.find((record) => record.key === item.key);
        if (existing?.id) {
          const { error } = await supabase.from("site_settings").update({ value: item.value }).eq("id", existing.id);
          if (error) {
            throw error;
          }
        } else {
          const { error } = await supabase.from("site_settings").insert({ key: item.key, value: item.value });
          if (error) {
            throw error;
          }
        }
      }

      setStatusMessage(t("settings.saved"));
      await loadData();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : t("settings.saveFailed"));
    }
  }

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesQuery = query.length === 0 || [donation.donor_name, donation.donor_email, donation.payment_provider, donation.donation_purpose, donation.receipt_number].filter(Boolean).join(" ").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || donation.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [donations, searchTerm, statusFilter]);

  const donationMetrics = useMemo(() => {
    const total = donations.reduce((sum, donation) => sum + Number(donation.amount ?? 0), 0);
    const now = new Date();
    const monthly = donations.filter((donation) => {
      const date = donation.donation_date ?? donation.created_at;
      if (!date) return false;
      const donationDate = new Date(date);
      return donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear();
    }).reduce((sum, donation) => sum + Number(donation.amount ?? 0), 0);
    const annual = donations.filter((donation) => {
      const date = donation.donation_date ?? donation.created_at;
      if (!date) return false;
      const donationDate = new Date(date);
      return donationDate.getFullYear() === now.getFullYear();
    }).reduce((sum, donation) => sum + Number(donation.amount ?? 0), 0);
    const international = donations.filter((donation) => (donation.country ?? "").toLowerCase() !== "ethiopia").length;
    const ethiopian = donations.filter((donation) => (donation.country ?? "").toLowerCase() === "ethiopia").length;
    const pending = donations.filter((donation) => donation.status?.toLowerCase() === "pending").length;
    const failed = donations.filter((donation) => donation.status?.toLowerCase() === "failed").length;
    return { total, monthly, annual, international, ethiopian, pending, failed };
  }, [donations]);

  function exportCsv() {
    const header = ["receipt_number", "donor_name", "donor_email", "amount", "currency", "country", "payment_provider", "donation_purpose", "status"].join(",");
    const rows = filteredDonations.map((donation) => [
      donation.receipt_number ?? "",
      donation.donor_name ?? "",
      donation.donor_email ?? "",
      donation.amount ?? "",
      donation.currency ?? "",
      donation.country ?? "",
      donation.payment_provider ?? "",
      donation.donation_purpose ?? "",
      donation.status ?? "",
    ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    downloadBlob(blob, "agape-donations.csv");
  }

  function exportExcel() {
    exportCsv();
  }

  function exportPdf() {
    window.print();
  }

  function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{t("adminCenter")}</h1>
        <p className="mt-2 text-slate-600">{t("adminCenterDescription")}</p>
        <p className="mt-4 text-sm text-slate-500">{statusMessage}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">{t("donation.totalDonations")}</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-950">{donationMetrics.total.toFixed(2)}</p>
        </article>
        <article className="rounded-2xl bg-amber-50 p-4">
          <p className="text-sm text-amber-700">{t("donation.monthlyDonations")}</p>
          <p className="mt-2 text-3xl font-semibold text-amber-950">{donationMetrics.monthly.toFixed(2)}</p>
        </article>
        <article className="rounded-2xl bg-sky-50 p-4">
          <p className="text-sm text-sky-700">{t("donation.annualDonations")}</p>
          <p className="mt-2 text-3xl font-semibold text-sky-950">{donationMetrics.annual.toFixed(2)}</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{t("users")}</h2>
          <div className="mt-4 space-y-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{profile.email || t("unknownProfile")}</p>
                <p className="mt-1 text-sm text-slate-600">{t("role")}: {profile.role || t("roleStaff")}</p>
              </div>
            ))}
            {profiles.length === 0 && <p className="text-sm text-slate-500">{t("noUsersFound")}</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{t("beneficiary") + " " + t("overview")}</h2>
          <div className="mt-4 space-y-3">
            {beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{[beneficiary.first_name, beneficiary.last_name].filter(Boolean).join(" ") || t("unnamed")}</p>
                <p className="mt-1 text-sm text-slate-600">{t("phone")}: {beneficiary.phone || "—"}</p>
                <p className="text-sm text-slate-600">{t("location")}: {beneficiary.region || "—"}</p>
                <p className="text-sm text-slate-600">{t("status")}: {beneficiary.status ? t("status" + capitalize(beneficiary.status)) || beneficiary.status : t("statusPending")}</p>
              </div>
            ))}
            {beneficiaries.length === 0 && <p className="text-sm text-slate-500">{t("noRecords")}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{t("donation.reportTitle")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("donation.reportDescription")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportPdf} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">PDF</button>
            <button type="button" onClick={exportExcel} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">Excel</button>
            <button type="button" onClick={exportCsv} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">CSV</button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("searchPlaceholder")} />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
          </select>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{t("donation.pendingDonations")}: {donationMetrics.pending} · {t("donation.successfulPayments")}: {donations.filter((donation) => donation.status?.toLowerCase() === "successful").length}</div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">{t("donation.donorName")}</th>
                <th className="px-4 py-3">{t("donation.amount")}</th>
                <th className="px-4 py-3">{t("donation.paymentProvider")}</th>
                <th className="px-4 py-3">{t("donation.purpose")}</th>
                <th className="px-4 py-3">{t("status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredDonations.map((donation) => (
                <tr key={donation.id ?? donation.receipt_number ?? donation.created_at}>
                  <td className="px-4 py-3">{donation.donor_name ?? donation.donor_email ?? t("unknown")}</td>
                  <td className="px-4 py-3">{Number(donation.amount ?? 0).toFixed(2)} {donation.currency ?? "USD"}</td>
                  <td className="px-4 py-3">{donation.payment_provider ?? t("unknown")}</td>
                  <td className="px-4 py-3">{donation.donation_purpose ?? t("unknown")}</td>
                  <td className="px-4 py-3">{donation.status ?? t("statusPending")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">{t("donation.bankAccountInformation")}</h2>
        <form onSubmit={saveSettings} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
            {t("donation.bankAccountInformation")}
            <textarea value={bankTransferSettings} onChange={(event) => setBankTransferSettings(event.target.value)} className="min-h-40 rounded-xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
            {t("donation.purpose")}
            <textarea value={purposeSettings} onChange={(event) => setPurposeSettings(event.target.value)} className="min-h-32 rounded-xl border border-slate-300 px-4 py-3" />
          </label>
          <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white md:col-span-2">{t("saveChanges")}</button>
        </form>
      </section>
    </div>
  );
}
