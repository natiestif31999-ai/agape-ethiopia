import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import BeneficiarySearch from "@/components/BeneficiarySearch";
import { requireStaff } from "@/lib/auth/serverAuth";

export const metadata: Metadata = {
  title: "Beneficiaries",
  description: "Search and manage beneficiary records, view assessment history, and track equipment assignments.",
};

export default async function BeneficiariesPage() {
  try {
    await requireStaff();
  } catch (err) {
    redirect("/login");
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Beneficiary Registry</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Beneficiaries</h1>
          <p className="mt-3 text-slate-700">Search and review beneficiary records, assessment history, and equipment assignments.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Total registered</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Manage all beneficiaries</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Assessments</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Track mobility evaluations</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Equipment</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Monitor assignments & history</p>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <BeneficiarySearch />
        </div>
      </main>
    </>
  );
}
