"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";

interface AdminKPIData {
  totalBeneficiaries: number;
  registrationsToday: number;
  registrationsThisMonth: number;
  pendingApprovals: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  activeStaff: number;
  disabledStaff: number;
  donationTotal: number;
  recentDonations: number;
}

interface Beneficiary {
  id: string;
  status?: string;
  created_at?: string;
}

interface Donation {
  id?: string;
  amount?: number;
  currency?: string;
  donation_date?: string;
}

interface StaffMember {
  id: string;
  email?: string;
  role?: string;
  is_disabled?: boolean;
}

interface SystemAlert {
  id: string;
  type: "warning" | "info" | "error";
  message: string;
}

export default function AdminDashboardEnhanced() {
  const { t } = useLanguage();
  const [kpiData, setKpiData] = useState<AdminKPIData>({
    totalBeneficiaries: 0,
    registrationsToday: 0,
    registrationsThisMonth: 0,
    pendingApprovals: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    activeStaff: 0,
    disabledStaff: 0,
    donationTotal: 0,
    recentDonations: 0,
  });
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdminDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseClient();

      // Load all necessary data in parallel
      const [beneficiariesResult, staffResult, donationsResult] = await Promise.all([
        supabase.from("beneficiaries").select("id,status,created_at"),
        supabase.from("users").select("id,email,role,is_disabled"),
        supabase.from("donations").select("id,amount,currency,donation_date").order("donation_date", { ascending: false }).limit(100),
      ]);

      if (beneficiariesResult.error) {
        throw new Error(beneficiariesResult.error.message);
      }

      const beneficiaries = (beneficiariesResult.data || []) as Beneficiary[];
      const staff = (staffResult.data || []) as StaffMember[];
      const donations = (donationsResult.data || []) as Donation[];

      // Calculate date ranges
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Calculate KPIs
      const regsToday = beneficiaries.filter((b: Beneficiary) => {
        const createdAt = b.created_at ? new Date(b.created_at) : null;
        if (!createdAt) return false;
        createdAt.setHours(0, 0, 0, 0);
        return createdAt.getTime() === today.getTime();
      }).length;

      const regsThisMonth = beneficiaries.filter((b: Beneficiary) => {
        const createdAt = b.created_at ? new Date(b.created_at) : null;
        return createdAt && createdAt >= startOfMonth;
      }).length;

      const pending = beneficiaries.filter((b: Beneficiary) => b.status === "registered" || b.status === "pending").length;
      const approved = beneficiaries.filter((b: Beneficiary) => b.status === "approved").length;
      const rejected = beneficiaries.filter((b: Beneficiary) => b.status === "rejected").length;

      const activeStaff = staff.filter((s: StaffMember) => !s.is_disabled).length;
      const disabledStaff = staff.filter((s: StaffMember) => s.is_disabled).length;

      // Calculate donation total (simple numeric sum)
      const donationTotal = donations.reduce((sum: number, d: Donation) => {
        const amount = typeof d.amount === "number" ? d.amount : 0;
        return sum + amount;
      }, 0);

      const recentDonationsCount = donations.filter((d: Donation) => {
        const donationDate = d.donation_date ? new Date(d.donation_date) : null;
        return donationDate && donationDate >= startOfMonth;
      }).length;

      setKpiData({
        totalBeneficiaries: beneficiaries.length,
        registrationsToday: regsToday,
        registrationsThisMonth: regsThisMonth,
        pendingApprovals: pending,
        approvedRegistrations: approved,
        rejectedRegistrations: rejected,
        activeStaff: activeStaff,
        disabledStaff: disabledStaff,
        donationTotal: donationTotal,
        recentDonations: recentDonationsCount,
      });

      setStaffMembers(staff.slice(0, 5));

      // Generate system alerts
      const alerts: SystemAlert[] = [];
      if (pending > 10) {
        alerts.push({
          id: "1",
          type: "warning",
          message: `${pending} beneficiary applications are pending approval.`,
        });
      }
      if (disabledStaff > 0) {
        alerts.push({
          id: "2",
          type: "info",
          message: `${disabledStaff} staff member(s) are currently disabled.`,
        });
      }
      setSystemAlerts(alerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorLoadingData"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadAdminDashboardData();
  }, [loadAdminDashboardData]);

  const KPICard = ({ label, value, color, href, subtext }: { label: string; value: number | string; color: string; href?: string; subtext?: string }) => {
    const colorClasses = {
      blue: "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100",
      emerald: "border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100",
      amber: "border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100",
      rose: "border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100",
      slate: "border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100",
      purple: "border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100",
      indigo: "border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100",
    };

    const textColor = {
      blue: "text-blue-900",
      emerald: "text-emerald-900",
      amber: "text-amber-900",
      rose: "text-rose-900",
      slate: "text-slate-900",
      purple: "text-purple-900",
      indigo: "text-indigo-900",
    };

    const content = (
      <article className={`rounded-lg border-2 p-6 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.slate}`}>
        <p className={`text-xs font-semibold uppercase tracking-widest opacity-70 ${textColor[color as keyof typeof textColor] || textColor.slate}`}>
          {label}
        </p>
        <p className={`mt-4 text-3xl font-bold ${textColor[color as keyof typeof textColor] || textColor.slate}`}>{value}</p>
        {subtext && <p className="mt-2 text-xs opacity-60">{subtext}</p>}
      </article>
    );

    return href ? <Link href={href}>{content}</Link> : content;
  };

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-4xl">{t("adminControlCenter") || "Admin Control Center"}</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">{t("systemWideManagement") || "System-wide organizational management and oversight."}</p>
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {systemAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border-l-4 p-4 ${
                alert.type === "warning"
                  ? "border-amber-400 bg-amber-50 text-amber-800"
                  : alert.type === "error"
                  ? "border-rose-400 bg-rose-50 text-rose-800"
                  : "border-blue-400 bg-blue-50 text-blue-800"
              }`}
            >
              <p className="font-medium">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg border border-rose-300 bg-rose-50 p-4">
          <p className="text-sm text-rose-700">
            <strong>{t("error") || "Error"}:</strong> {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700 mx-auto"></div>
            <p className="text-slate-600">{t("loading") || "Loading..."}</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <AdminAnnouncements />
          {/* Top KPIs Section */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">{t("systemMetrics") || "System Metrics"}</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <KPICard
                label={t("totalBeneficiaries") || "Total Beneficiaries"}
                value={kpiData.totalBeneficiaries}
                color="blue"
                href="/beneficiaries"
              />
              <KPICard
                label={t("registrationsToday") || "Registrations Today"}
                value={kpiData.registrationsToday}
                color="emerald"
              />
              <KPICard
                label={t("registrationsThisMonth") || "Registrations (Month)"}
                value={kpiData.registrationsThisMonth}
                color="emerald"
              />
              <KPICard
                label={t("pendingApprovals") || "Pending Approvals"}
                value={kpiData.pendingApprovals}
                color="amber"
                href="/records"
              />
            </div>
          </section>

          {/* Approvals Section */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">{t("approvalStatus") || "Approval Status"}</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <KPICard
                label={t("approvedRegistrations") || "Approved"}
                value={kpiData.approvedRegistrations}
                color="emerald"
                subtext="Approved beneficiaries"
              />
              <KPICard
                label={t("rejectedRegistrations") || "Rejected"}
                value={kpiData.rejectedRegistrations}
                color="rose"
                subtext="Rejected applications"
              />
              <KPICard
                label={t("pendingApprovals") || "Pending"}
                value={kpiData.pendingApprovals}
                color="amber"
                subtext="Awaiting review"
              />
            </div>
          </section>

          {/* Staff Management Section */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">{t("staffManagement") || "Staff Management"}</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <KPICard label={t("activeStaff") || "Active Staff"} value={kpiData.activeStaff} color="emerald" href="/admin" />
              <KPICard label={t("disabledStaff") || "Disabled Staff"} value={kpiData.disabledStaff} color="rose" href="/admin" />
            </div>
          </section>

          {/* Donations Section */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">{t("donationOverview") || "Donation Overview"}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <KPICard
                label={t("donationTotal") || "Total Donations"}
                value={`${kpiData.donationTotal.toLocaleString()}`}
                color="purple"
                href="/donations"
              />
              <KPICard
                label={t("donationsThisMonth") || "Donations (Month)"}
                value={kpiData.recentDonations}
                color="indigo"
                href="/donations"
              />
            </div>
          </section>

          {/* Quick Admin Actions */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">{t("adminActions") || "Admin Actions"}</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/admin"
                className="rounded-lg border-2 border-blue-300 bg-blue-50 p-4 transition hover:border-blue-400 hover:bg-blue-100"
              >
                <div className="text-2xl">👨‍💼</div>
                <p className="mt-2 font-semibold text-blue-900">{t("staffManagement") || "Staff Management"}</p>
                <p className="mt-1 text-sm text-blue-700">{t("manageStaffAccounts") || "Manage staff accounts"}</p>
              </Link>
              <Link
                href="/beneficiaries"
                className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-4 transition hover:border-emerald-400 hover:bg-emerald-100"
              >
                <div className="text-2xl">👥</div>
                <p className="mt-2 font-semibold text-emerald-900">{t("beneficiaryControl") || "Beneficiary Control"}</p>
                <p className="mt-1 text-sm text-emerald-700">{t("allBeneficiaryRecords") || "All beneficiary records"}</p>
              </Link>
              <Link
                href="/donations"
                className="rounded-lg border-2 border-purple-300 bg-purple-50 p-4 transition hover:border-purple-400 hover:bg-purple-100"
              >
                <div className="text-2xl">💰</div>
                <p className="mt-2 font-semibold text-purple-900">{t("donationControl") || "Donation Control"}</p>
                <p className="mt-1 text-sm text-purple-700">{t("donationReports") || "Manage donations"}</p>
              </Link>
              <Link
                href="/reports"
                className="rounded-lg border-2 border-slate-300 bg-slate-50 p-4 transition hover:border-slate-400 hover:bg-slate-100"
              >
                <div className="text-2xl">📊</div>
                <p className="mt-2 font-semibold text-slate-900">{t("operationalReports") || "Reports"}</p>
                <p className="mt-1 text-sm text-slate-700">{t("generateReports") || "View reports"}</p>
              </Link>
            </div>
          </section>

          {/* Recent Staff Activity */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900 sm:text-2xl">{t("staffDirectory") || "Staff Directory"}</h2>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              {staffMembers.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-500">{t("noStaffFound") || "No staff members found"}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">{t("email") || "Email"}</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">{t("role") || "Role"}</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">{t("status") || "Status"}</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">{t("actions") || "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffMembers.map((staff) => (
                        <tr key={staff.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm text-slate-900">{staff.email || "-"}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{staff.role || "Staff"}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                staff.is_disabled ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {staff.is_disabled ? t("disabled") || "Disabled" : t("active") || "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <Link href="/admin" className="text-blue-700 hover:text-blue-900 font-medium">
                              {t("manage") || "Manage"}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
