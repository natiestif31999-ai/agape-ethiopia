import AppHeader from "@/components/layout/AppHeader";
import BeneficiarySearch from "@/components/BeneficiarySearch";

export default function BeneficiariesPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Beneficiaries</h1>
          <p className="mt-3 text-slate-600">Search and review beneficiary records, assessment history, and equipment assignments.</p>
        </section>

        <div className="mt-8">
          <BeneficiarySearch />
        </div>
      </main>
    </>
  );
}
