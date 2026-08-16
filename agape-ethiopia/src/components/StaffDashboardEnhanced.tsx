"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { getSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";

interface KPIData {
  totalBeneficiaries: number;
  newRegistrations: number;
  pendingApprovals: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  assessmentsPending: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: "registration" | "approval" | "assessment" | "distribution";
  beneficiaryName: string;
  action: string;
  timestamp: string;
  status?: string;
}

interface RecentBeneficiary {
  id: string;
  first_name?: string;
  last_name?: string;
  registration_number?: string;
  status?: string;
  created_at?: string;
}

interface Beneficiary {
  id: string;
  first_name?: string;
  last_name?: string;
  registration_number?: string;
  status?: string;
  created_at?: string;
}

interface Assessment {
  id: string;
  beneficiary_id?: string;
  assessment_date?: string;
}

export default function StaffDashboardEnhanced() {
  const { t } = useLanguage();
  const [kpiData, setKpiData] = useState<KPIData>({
    totalBeneficiaries: 0,
    newRegistrations: 0,
    pendingApprovals: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    assessmentsPending: 0,
    recentActivity: [],
  });
  const [recentBeneficiaries, setRecentBeneficiaries] = useState<RecentBeneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = getSupabaseClient();

      // Load all necessary data in parallel
      const [beneficiariesResult, assessmentsResult] = await Promise.all([
        supabase
          .from("beneficiaries")
          .select("id,first_name,last_name,registration_number,status,created_at")
          .order("created_at", { ascending: false }),
        supabase.from("assessments").select("id,beneficiary_id,assessment_date").order("assessment_date", { ascending: false }).limit(100),
      ]);

      if (beneficiariesResult.error) {
        throw new Error(beneficiariesResult.error.message);
      }

      const beneficiaries = (beneficiariesResult.data || []) as Beneficiary[];
      const assessments = (assessmentsResult.data || []) as Assessment[];

      // Calculate KPIs
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const newRegs = beneficiaries.filter((b: Beneficiary) => {
        const createdAt = b.created_at ? new Date(b.created_at) : null;
        return createdAt && createdAt >= thirtyDaysAgo;
      }).length;

      const pending = beneficiaries.filter((b: Beneficiary) => b.status === "registered" || b.status === "pending").length;
      const approved = beneficiaries.filter((b: Beneficiary) => b.status === "approved").length;
      const rejected = beneficiaries.filter((b: Beneficiary) => b.status === "rejected").length;

      // Assessments pending (no completion date)
      const assessmentsPending = beneficiaries.filter((b: Beneficiary) => {
        const hasAssessment = assessments.some((a: Assessment) => a.beneficiary_id === b.id);
        return !hasAssessment;
      }).length;

      setKpiData({
        totalBeneficiaries: beneficiaries.length,
        newRegistrations: newRegs,
        pendingApprovals: pending,
        approvedRegistrations: approved,
        rejectedRegistrations: rejected,
        assessmentsPending: assessmentsPending,
        recentActivity: [],
      });

      setRecentBeneficiaries(beneficiaries.slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorLoadingData"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const KPICard = ({ label, value, color, href }: { label: string; value: number; color: string; href?: string }) => {
    const colorClasses = {
      blue: "border-blue-200 bg-blue-50 text-blue-700",
      emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
      amber: "border-amber-200 bg-amber-50 text-amber-700",
      rose: "border-rose-200 bg-rose-50 text-rose-700",
      slate: "border-slate-200 bg-slate-50 text-slate-700",
      purple: "border-purple-200 bg-purple-50 text-purple-700",
    };

    const content = (
      <article className={`rounded-xl border-2 p-6 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.slate}`}>
        <p className="text-sm font-semibold uppercase tracking-wide opacity-75">{label}</p>
        <p className="mt-3 text-4xl font-bold">{value}</p>
      </article>
    );

    return href ? <Link href={href}>{content}</Link> : content;
  };

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">{t("dashboard") || "Staff Dashboard"}</h1>
        <p className="mt-2 text-slate-600">{t("staffDashboardDescription") || "Overview of beneficiaries, registrations, and operational metrics."}</p>
      </div>

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
          {/* KPI Section */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("operationalMetrics") || "Operational Metrics"}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <KPICard
                label={t("totalBeneficiaries") || "Total Beneficiaries"}
                value={kpiData.totalBeneficiaries}
                color="blue"
                href="/records"
              />
              <KPICard
                label={t("newRegistrations") || "New (30 days)"}
                value={kpiData.newRegistrations}
                color="emerald"
                href="/beneficiaries"
              />
              <KPICard
                label={t("pendingApprovals") || "Pending Approval"}
                value={kpiData.pendingApprovals}
                color="amber"
                href="/records"
              />
              <KPICard
                label={t("approvedRegistrations") || "Approved"}
                value={kpiData.approvedRegistrations}
                color="emerald"
                href="/records"
              />
              <KPICard
                label={t("rejectedRegistrations") || "Rejected"}
                value={kpiData.rejectedRegistrations}
                color="rose"
                href="/records"
              />
              <KPICard
                label={t("assessmentsPending") || "Assessments Needed"}
                value={kpiData.assessmentsPending}
                color="purple"
                href="/assessments"
              />
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("quickActions") || "Quick Actions"}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/beneficiaries/new"
                className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-4 transition hover:border-emerald-400 hover:bg-emerald-100"
              >
                <div className="text-2xl">👤</div>
                <p className="mt-2 font-semibold text-emerald-900">{t("registerBeneficiary") || "Register Beneficiary"}</p>
                <p className="mt-1 text-sm text-emerald-700">{t("addNewBeneficiaryRecord") || "Add a new beneficiary"}</p>
              </Link>
              <Link
                href="/records"
                className="rounded-lg border-2 border-blue-300 bg-blue-50 p-4 transition hover:border-blue-400 hover:bg-blue-100"
              >
                <div className="text-2xl">🔍</div>
                <p className="mt-2 font-semibold text-blue-900">{t("searchBeneficiary") || "Search Beneficiary"}</p>
                <p className="mt-1 text-sm text-blue-700">{t("findExistingBeneficiary") || "Find existing beneficiary"}</p>
              </Link>
              <Link
                href="/assessments"
                className="rounded-lg border-2 border-purple-300 bg-purple-50 p-4 transition hover:border-purple-400 hover:bg-purple-100"
              >
                <div className="text-2xl">📋</div>
                <p className="mt-2 font-semibold text-purple-900">{t("newAssessment") || "New Assessment"}</p>
                <p className="mt-1 text-sm text-purple-700">{t("recordWheelchairMeasurements") || "Record measurements"}</p>
              </Link>
              <Link
                href="/distributions"
                className="rounded-lg border-2 border-slate-300 bg-slate-50 p-4 transition hover:border-slate-400 hover:bg-slate-100"
              >
                <div className="text-2xl">📦</div>
                <p className="mt-2 font-semibold text-slate-900">{t("distribution") || "Distribution"}</p>
                <p className="mt-1 text-sm text-slate-700">{t("recordEquipmentDistribution") || "Record distribution"}</p>
              </Link>
            </div>
          </section>

          {/* Recent Beneficiaries */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">{t("recentBeneficiaries") || "Recent Beneficiaries"}</h2>
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              {recentBeneficiaries.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-500">{t("noBeneficiariesFound") || "No beneficiaries found"}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">{t("name") || "Name"}</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">{t("registrationNumber") || "Registration #"}</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">{t("status") || "Status"}</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">{t("registered") || "Registered"}</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">{t("actions") || "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBeneficiaries.map((beneficiary) => (
                        <tr key={beneficiary.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm text-slate-900">
                            {[beneficiary.first_name, beneficiary.last_name].filter(Boolean).join(" ") || t("unnamed") || "Unnamed"}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{beneficiary.registration_number || "-"}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              beneficiary.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : beneficiary.status === "rejected"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}>
                              {beneficiary.status || t("pending")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {beneficiary.created_at ? new Date(beneficiary.created_at).toLocaleDateString() : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <Link
                              href={`/beneficiaries/${beneficiary.id}`}
                              className="text-emerald-700 hover:text-emerald-900 font-medium"
                            >
                              {t("view") || "View"}
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
