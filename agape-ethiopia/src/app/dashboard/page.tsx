import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { requireStaff } from "@/lib/auth/serverAuth";

export const metadata: Metadata = {
  title: "Operational Dashboard",
  description: "Core operational workflow actions for Agape Ethiopia.",
};

const actions = [
  { href: "/beneficiaries/new", title: "Register Beneficiary", description: "Add a new beneficiary record." },
  { href: "/records", title: "Search Beneficiary", description: "Search existing beneficiaries." },
  { href: "/assessments", title: "New Assessment", description: "Record wheelchair assessment measurements." },
  { href: "/distributions", title: "Distribute Equipment", description: "Record equipment distribution events." },
  { href: "/reports", title: "Distribution Reports", description: "View operational reports and summaries." },
];

export default async function DashboardPage() {
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
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Operations</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Operational Actions</h1>
          <p className="mt-3 text-slate-700">Use the core workflow actions to register beneficiaries, capture assessments, and record distributions.</p>
        </section>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => (
            <a key={action.href} href={action.href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
              <h2 className="text-xl font-semibold text-slate-900">{action.title}</h2>
              <p className="mt-3 text-slate-600">{action.description}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
