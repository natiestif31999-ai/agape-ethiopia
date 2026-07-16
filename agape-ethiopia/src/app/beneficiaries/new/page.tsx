import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
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
          <LocalizedSectionHeader titleKey="newRegistration" subtitleKey="registerBeneficiary" />
          <p className="mt-3 text-slate-700">
            {""}
          </p>
          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{""}</p>
          </div>
        </section>

        <div className="mt-8">
          <BeneficiaryRegistrationForm />
        </div>
      </main>
    </>
  );
}