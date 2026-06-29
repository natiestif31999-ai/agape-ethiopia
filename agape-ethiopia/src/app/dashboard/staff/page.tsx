import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import StaffDashboard from "@/components/StaffDashboard";

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
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Staff panel</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Manage beneficiary registrations</h1>
          <p className="mt-3 max-w-3xl text-slate-700">Use this workspace to save new registrations, review existing records, update details, and track assessments and distributions.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/beneficiaries/new" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white">New registration</Link>
            <Link href="/beneficiaries" className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700">Browse and edit beneficiaries</Link>
            <Link href="/assessments" className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700">Record assessment</Link>
          </div>
        </section>

        <StaffDashboard />
      </main>
    </>
  );
}
