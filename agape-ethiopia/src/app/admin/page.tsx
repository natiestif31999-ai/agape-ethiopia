import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AdminUserManagement from "@/components/AdminUserManagement";
import { requireAdmin } from "@/lib/auth/serverAuth";

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage users, roles, and system access for Agape Ethiopia.",
};

export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-emerald-50 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Admin panel</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Control users, content, and system settings</h1>
          <p className="mt-3 text-slate-700">Manage administrator access, update site content, oversee beneficiary operations, and keep the platform aligned with Agape Ethiopia’s workflows.</p>
        </section>
        <div className="mt-8">
          <AdminUserManagement />
        </div>
      </main>
    </>
  );
}
