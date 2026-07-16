import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import BeneficiarySearch from "@/components/BeneficiarySearch";
import { requireStaff } from "@/lib/auth/serverAuth";

export const metadata: Metadata = {
  title: "Beneficiaries",
  description: "Search and manage beneficiary records, view assessment history, and track equipment assignments.",
};

export default async function BeneficiariesPage() {
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
          <div>
            <LocalizedSectionHeader titleKey="beneficiaryRegistry" subtitleKey="beneficiaries" />
            <p className="mt-3 text-slate-700">{/* description remains server-rendered but will be localized in the search component */}{/* consider moving to client if necessary */}</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <LocalizedSectionHeader titleKey="beneficiaries.totalRegisteredLabel" subtitleKey="beneficiaries.totalRegisteredTitle" />
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <LocalizedSectionHeader titleKey="beneficiaries.assessmentsLabel" subtitleKey="beneficiaries.assessmentsTitle" />
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <LocalizedSectionHeader titleKey="beneficiaries.equipmentLabel" subtitleKey="beneficiaries.equipmentTitle" />
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
