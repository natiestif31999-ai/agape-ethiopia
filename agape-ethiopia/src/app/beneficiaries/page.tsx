import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import BeneficiarySearch from "@/components/BeneficiarySearch";

export const metadata: Metadata = {
  title: "Beneficiaries",
  description: "Search and manage beneficiary records, view assessment history, and track equipment assignments.",
};

export default function BeneficiariesPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Beneficiary Registry</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Beneficiaries</h1>
          <p className="mt-3 text-slate-700">Search and review beneficiary records, assessment history, and equipment assignments.</p>
        </section>

        <div className="mt-8">
          <BeneficiarySearch />
        </div>
      </main>
    </>
  );
}
