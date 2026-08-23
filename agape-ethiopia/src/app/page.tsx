import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import HomePageContent from "@/components/home/HomePageContent";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AGAPE",
  description: "AGAPE MOBILITY ETHIOPIA Beneficiary Management System dashboard for managing registrations, assessments, and equipment tracking.",
};

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <section className="border-b border-emerald-100 bg-emerald-50/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">Secure sign in</p>
            <p className="mt-1 text-sm text-slate-700">Access the Agape Ethiopia operations workspace.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Link href="/login?role=staff" className="rounded-xl bg-emerald-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-800">Sign in as Staff</Link>
            <Link href="/login?role=admin" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-800">Sign in as Admin</Link>
          </div>
        </div>
      </section>
      <HomePageContent />
    </>
  );
}