import Image from "next/image";
import type { Metadata } from "next";
import AppHeader from "@/components/layout/AppHeader";
import TabPanel from "@/components/TabPanel";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";

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
                <LocalizedSectionHeader
                  titleKey="applicationName"
                  subtitleKey="heroTitle"
                  descriptionKey="heroSubtitle"
                  bullets={["beneficiaryRegistration", "equipmentTracking", "assessmentManagement"]}
                />
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
              <LocalizedSectionHeader titleKey="ourMission" subtitleKey="ourMissionTitle" descriptionKey="ourMissionText" />
            </div>
            <div className="flex flex-col gap-2 rounded-2xl bg-emerald-50 p-4">
              <LocalizedSectionHeader titleKey="coreServices.title" subtitleKey="coreServices.title" descriptionKey="coreServices.text" />
            </div>
            <div className="flex flex-col gap-2 rounded-2xl bg-blue-50 p-4">
              <LocalizedSectionHeader titleKey="impactDriven.title" subtitleKey="impactDriven.title" descriptionKey="impactDriven.text" />
            </div>
          </div>
        </section>

        {/* Illustration / Impact image */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <LocalizedSectionHeader titleKey="ourReach" subtitleKey="ourReachTitle" descriptionKey="ourReachText" />
            </div>
            <div className="hidden sm:block w-48">
              <Image src="/final.png" alt="Agape Ethiopia impact visual" width={320} height={180} className="rounded-xl object-cover shadow-md" />
            </div>
          </div>
        </section>

        {/* Main Dashboard */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <LocalizedSectionHeader titleKey="dashboard" subtitleKey="operationalDashboard" descriptionKey="dashboardDescription" />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <a href="/register" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm transition hover:border-emerald-400 hover:shadow-md">
            <LocalizedSectionHeader titleKey="selfRegistrationCard" subtitleKey="selfRegistrationTitle" descriptionKey="selfRegistrationText" />
          </a>
          <a href="/dashboard/staff" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
            <LocalizedSectionHeader titleKey="staffPanelCard" subtitleKey="staffPanelTitle" descriptionKey="staffPanelText" />
          </a>
          <a href="/admin" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <LocalizedSectionHeader titleKey="adminPanelCard" subtitleKey="adminPanelTitle" descriptionKey="adminPanelText" />
          </a>
        </section>

        <TabPanel />
      </main>
    </>
  );
}