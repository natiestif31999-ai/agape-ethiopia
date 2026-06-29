import Image from "next/image";
import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import TabPanel from "@/components/TabPanel";

export const metadata: Metadata = {
  title: "AGAPE ",
  description: "Agape Ethiopia Beneficiary Management System dashboard for managing registrations, assessments, and equipment tracking.",
};

export default function HomePage() {
  return (
    <>
      <AppHeader />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        {/* Hero Section with Branding */}
        <section className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6 shadow-sm md:p-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Agape Ethiopia</p>
              <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
                No More Crawling on the Floor
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-700 md:text-lg">
                 Your support brings hope, restores dignity,and changes lives in Ethiopia.  </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  ✓ Beneficiary Registration
                </div>
                <div className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  ✓ Equipment Tracking
                </div>
                <div className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  ✓ Assessment Management
                </div>
              </div>
            </div>

            {/* Branding Image */}
            <div className="relative flex items-center justify-center">
              <Image
                src="/c2.png"
                alt="Agape Ethiopia wheelchair with Ethiopia map logo - mobility assistance"
                width={400}
                height={400}
                className="drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </section>

        {/* Organization Overview */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-2xl bg-blue-50 p-4">
              <h3 className="text-lg font-semibold text-slate-900">Our Mission</h3>
              <p className="text-sm text-slate-700">Provide compassionate mobility assistance and comprehensive beneficiary support services across Ethiopia.</p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl bg-emerald-50 p-4">
              <h3 className="text-lg font-semibold text-slate-900">Core Services</h3>
              <p className="text-sm text-slate-700">Beneficiary registration, mobility assessments, equipment distribution, and impact tracking.</p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl bg-blue-50 p-4">
              <h3 className="text-lg font-semibold text-slate-900">Impact Driven</h3>
              <p className="text-sm text-slate-700">Transparent reporting, data-driven decisions, and measurable community impact.</p>
            </div>
          </div>
        </section>

        {/* Illustration / Impact image */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">Our Reach</h3>
              <p className="mt-2 text-sm text-slate-700">Visualizing our recent outreach and beneficiary impact.</p>
            </div>
            <div className="hidden sm:block w-48">
              <Image src="/final.png" alt="Agape Ethiopia impact visual" width={320} height={180} className="rounded-xl object-cover shadow-md" />
            </div>
          </div>
        </section>

        {/* Main Dashboard */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Dashboard Overview</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Operational Dashboard
          </h2>
          <p className="mt-4 max-w-3xl text-slate-700">
            The interface provides comprehensive tracking of impact metrics, donations, requests, and administrative oversight with real-time Supabase integration.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <a href="/register" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm transition hover:border-emerald-400 hover:shadow-md">
            <h3 className="text-xl font-semibold text-slate-900">Self registration</h3>
            <p className="mt-2 text-sm text-slate-700">Beneficiaries can submit their full profile, contact details, and photo directly.</p>
          </a>
          <a href="/dashboard/staff" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
            <h3 className="text-xl font-semibold text-slate-900">Staff panel</h3>
            <p className="mt-2 text-sm text-slate-700">Staff can save, review, edit, and manage beneficiary registrations and workflow actions.</p>
          </a>
          <a href="/admin" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <h3 className="text-xl font-semibold text-slate-900">Admin panel</h3>
            <p className="mt-2 text-sm text-slate-700">Administrators can manage users, site content, and the wider system from one place.</p>
          </a>
        </section>

        <TabPanel />
      </main>
    </>
  );
}