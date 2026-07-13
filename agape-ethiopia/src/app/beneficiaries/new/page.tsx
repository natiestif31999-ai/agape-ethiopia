import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import BeneficiaryRegistrationForm from "@/components/BeneficiaryRegistrationForm";
import { requireStaff } from "@/lib/auth/serverAuth";

export const metadata: Metadata = {
  title: "Registration",
  description: "Register a new beneficiary in the Agape Ethiopia system.",
};

export default async function NewBeneficiaryPage() {
  try {
    await requireStaff();
  } catch {
    redirect("/login");
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-emerald-50 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">New registration</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Register Beneficiary</h1>
          <p className="mt-3 text-slate-700">
            Capture beneficiary registration details to build the Agape Ethiopia record repository.
          </p>
          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Complete the form to add a beneficiary to the system, then assign assessments and equipment.</p>
          </div>
        </section>

        <div className="mt-8">
          <BeneficiaryRegistrationForm />
        </div>
      </main>
    </>
  );
}