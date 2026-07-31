"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/layout/LanguageProvider";
import LanguageSelector from "@/components/layout/LanguageSelector";

const quickLinks = [
  { href: "/agape-registration/register", titleKey: "selfRegistrationTitle", descriptionKey: "selfRegistrationText" },
  { href: "/agape-registration/bulk", titleKey: "register.title", descriptionKey: "register.description" },
  { href: "/agape-registration/track", titleKey: "staffReviewDashboard", descriptionKey: "staffReviewDescription" },
  { href: "/agape-registration/partner", titleKey: "partnerPortalTitle", descriptionKey: "partnerPortalCardDescription" },
] as const;

export default function AgapeRegistrationHome() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-6 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/agape-logo.jpg" alt="AGAPE MOBILITY ETHIOPIA logo" width={48} height={48} className="rounded-full" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("applicationName")}</p>
                <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">{t("partnerPortalTitle")}</h1>
              </div>
            </div>
            <p className="max-w-2xl text-lg text-slate-700">{t("partnerPortalHeroDescription")}</p>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="text-sm font-semibold text-slate-700">{t("selectLanguage")}</span>
              <LanguageSelector />
            </div>
          </div>
          <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("ourMission")}</p>
              <p className="mt-2 text-sm text-slate-700">{t("ourMissionText")}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">{t("contactTitle")}</p>
              <p className="mt-2 text-sm text-slate-700">{t("contactDescription")}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("partnersTitle")}</p>
              <p className="mt-2 text-sm text-slate-700">{t("partnersDescription")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("applicationName")}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{t(item.titleKey)}</h2>
            <p className="mt-2 text-sm text-slate-600">{t(item.descriptionKey)}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
