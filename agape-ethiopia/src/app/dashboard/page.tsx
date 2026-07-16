import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { requireStaff } from "@/lib/auth/serverAuth";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import LocalizedActionCard from "@/components/LocalizedActionCard";

export const metadata: Metadata = {
  title: "Operational Dashboard",
  description: "Core operational workflow actions for Agape Ethiopia.",
};

const actions = [
  { href: "/beneficiaries/new", titleKey: "action.registerBeneficiary.title", descKey: "action.registerBeneficiary.desc" },
  { href: "/records", titleKey: "action.searchBeneficiary.title", descKey: "action.searchBeneficiary.desc" },
  { href: "/assessments", titleKey: "action.newAssessment.title", descKey: "action.newAssessment.desc" },
  { href: "/distributions", titleKey: "action.distributeEquipment.title", descKey: "action.distributeEquipment.desc" },
  { href: "/reports", titleKey: "action.reports.title", descKey: "action.reports.desc" },
];

export default async function DashboardPage() {
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
          <LocalizedSectionHeader titleKey="operations" subtitleKey="operationalActions" descriptionKey="operationsDescription" />
        </section>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => (
            <LocalizedActionCard key={action.href} href={action.href} titleKey={action.titleKey} descKey={action.descKey} />
          ))}
        </div>
      </main>
    </>
  );
}
