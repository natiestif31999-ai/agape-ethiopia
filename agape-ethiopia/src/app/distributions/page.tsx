import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import EquipmentDistributionForm from "@/components/EquipmentDistributionForm";
import { requireStaff } from "@/lib/auth/serverAuth";

export const metadata: Metadata = {
  title: "Distribute Equipment",
  description: "Record wheelchair and mobility equipment distribution events.",
};

export default async function DistributionsPage() {
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
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Distribution</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Equipment Distribution</h1>
          <p className="mt-3 text-slate-700">Record distribution events and capture signature confirmation.</p>
        </section>
        <div className="mt-8">
          <EquipmentDistributionForm />
        </div>
      </main>
    </>
  );
}
