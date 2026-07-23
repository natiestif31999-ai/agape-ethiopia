"use client";

import Image from "next/image";
import TabPanel from "@/components/TabPanel";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function HomePageContent() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <LocalizedSectionHeader titleKey="ourReach" subtitleKey="ourReachTitle" descriptionKey="ourReachText" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("impactStats")}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">1,200+</p>
                <p className="text-sm text-slate-600">beneficiaries supported</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("partnerNetwork")}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">35+</p>
                <p className="text-sm text-slate-600">partner organizations</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <Image src="/final.png" alt="Agape Ethiopia impact visual" width={320} height={180} className="rounded-xl object-cover shadow-md" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <LocalizedSectionHeader titleKey="dashboard" subtitleKey="operationalDashboard" descriptionKey="dashboardDescription" />
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <a href="/register" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm transition hover:border-emerald-400 hover:shadow-md">
          <LocalizedSectionHeader titleKey="selfRegistrationCard" subtitleKey="selfRegistrationTitle" descriptionKey="selfRegistrationText" />
        </a>
        <a href="/partnerships" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
          <LocalizedSectionHeader titleKey="partnerPortalCard" subtitleKey="partnerPortalTitle" descriptionKey="partnerPortalCardDescription" />
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
  );
}
