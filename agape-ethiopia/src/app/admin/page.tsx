import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import AdminUserManagement from "@/components/AdminUserManagement";
import { requireAdmin } from "@/lib/auth/serverAuth";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";

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
          <LocalizedSectionHeader titleKey="adminPanel" subtitleKey="adminCenter" descriptionKey="adminCenterDescription" />
        </section>
        <div className="mt-8">
          <AdminUserManagement />
        </div>
      </main>
    </>
  );
}
