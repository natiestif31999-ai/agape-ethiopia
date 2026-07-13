import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import BeneficiarySearch from "@/components/BeneficiarySearch";
import { requireStaff } from "@/lib/auth/serverAuth";

export const metadata: Metadata = {
  title: "Beneficiary Records",
  description: "Search and manage beneficiary records for Agape Ethiopia.",
};

export default async function BeneficiaryRecordsPage() {
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
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Beneficiary Records</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Search Beneficiaries</h1>
          <p className="mt-3 text-slate-700">Search and review beneficiary records and open a profile for assessments or distribution.</p>
        </section>
        <div className="mt-8">
          <BeneficiarySearch />
        </div>
      </main>
    </>
  );
}
