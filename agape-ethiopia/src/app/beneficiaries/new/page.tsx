import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import BeneficiaryRegistrationForm from "@/components/BeneficiaryRegistrationForm";

export const metadata: Metadata = {
  title: "Registration",
  description: "Register a new beneficiary in the Agape Ethiopia system.",
};

export default function NewBeneficiaryPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Register Beneficiary</h1>
          <p className="mt-3 text-slate-600">
            Capture beneficiary registration details to build the Agape Ethiopia record repository.
          </p>
        </section>

        <div className="mt-8">
          <BeneficiaryRegistrationForm />
        </div>
      </main>
    </>
  );
}