import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import StaffDashboard from "@/components/StaffDashboard";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import LocalizedLink from "@/components/LocalizedLink";

export const metadata = {
  title: "Staff Dashboard",
  description: "Review and manage beneficiary applications.",
};

export default function StaffDashboardPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-6 shadow-sm">
          <LocalizedSectionHeader titleKey="staffPanelCard" subtitleKey="staffPanelTitle" descriptionKey="staffPanelText" />
          <div className="mt-6 flex flex-wrap gap-3">
            <LocalizedLink href="/beneficiaries/new" titleKey="newRegistration" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white" />
            <LocalizedLink href="/beneficiaries" titleKey="beneficiaries" className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700" />
            <LocalizedLink href="/assessments" titleKey="newAssessment" className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700" />
          </div>
        </section>

        <StaffDashboard />
      </main>
    </>
  );
}
