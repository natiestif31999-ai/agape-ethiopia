import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import BeneficiaryReport from "@/components/reports/BeneficiaryReport";
import DistributionReport from "@/components/reports/DistributionReport";
import EquipmentSizeSummary from "@/components/reports/EquipmentSizeSummary";
import { requireStaff } from "@/lib/auth/serverAuth";

export const metadata: Metadata = {
  title: "Reports",
  description: "Operational reports for beneficiaries and equipment distribution.",
};

export default async function ReportsPage() {
  try {
    await requireStaff();
  } catch {
    redirect("/login");
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-6 shadow-sm">
          <LocalizedSectionHeader titleKey="reports" subtitleKey="operationalReports" />
          <p className="mt-3 text-slate-700">{""}</p>
        </section>

        <div className="mt-8 space-y-6">
          <BeneficiaryReport />
          <DistributionReport />
          <EquipmentSizeSummary />
        </div>
      </main>
    </>
  );
}
