"use client";

import Image from "next/image";
import Link from "next/link";
import TabPanel from "@/components/TabPanel";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useAuth } from "@/components/layout/SupabaseProvider";
import PublicAnnouncements from "@/components/home/PublicAnnouncements";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const defaultVisitUs = {
  title: "Visit Us",
  description: "Meet our team and learn how we support mobility and inclusion across Ethiopia.",
  address: "Addis Ababa, Ethiopia",
  phone: "+251 900 000 000",
  email: "info@agapeethiopia.org",
  hours: "Mon–Sat | 8:00 AM – 5:00 PM",
};

const defaultSocialLinks = { facebook: "", instagram: "", linkedin: "", x: "" };

function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as T;
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function HomePageContent() {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { settings } = useSiteSettings();
  const visitUs = parseJsonSetting(settings.homepage_visit_us, defaultVisitUs);
  const socialLinks = parseJsonSetting(settings.homepage_social_links, defaultSocialLinks);
  const heroTitle = settings.homepage_hero_title?.trim() || "AGAPE MOBILITY ETHIOPIA";
  const heroSubtitle = settings.homepage_hero_subtitle?.trim() || "Supporting mobility, dignity, and inclusive access for persons with disabilities across Ethiopia.";

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
      <PublicAnnouncements />
      <section className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6 shadow-sm md:p-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">{t("applicationName")}</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-5xl">{heroTitle}</h1>
            <p className="mt-3 max-w-xl text-base text-slate-700 md:text-lg">{heroSubtitle}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                t("beneficiaryRegistration") || "Beneficiary registration",
                t("equipmentTracking") || "Equipment tracking",
                t("assessmentManagement") || "Assessment management",
              ].map((item) => (
                <span key={item} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <Image
              src="/c2.png"
              alt="AGAPE MOBILITY ETHIOPIA wheelchair with Ethiopia map logo - mobility assistance"
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
                <p className="text-sm text-slate-600">{t("beneficiariesSupported")}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">{t("partnerNetwork")}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">35+</p>
                <p className="text-sm text-slate-600">{t("partnerOrganizations")}</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <Image src="/final.png" alt="AGAPE MOBILITY ETHIOPIA impact visual" width={320} height={180} className="rounded-xl object-cover shadow-md" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <LocalizedSectionHeader titleKey="dashboard" subtitleKey="operationalDashboard" descriptionKey="dashboardDescription" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <a href="/partnerships" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
          <LocalizedSectionHeader titleKey="partnerPortalCard" subtitleKey="partnerPortalTitle" descriptionKey="partnerPortalCardDescription" />
        </a>
        <a href="/dashboard/staff" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
          <LocalizedSectionHeader titleKey="staffPanelCard" subtitleKey="staffPanelTitle" descriptionKey="staffPanelText" />
        </a>
        {isAdmin && (
          <a href="/admin" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <LocalizedSectionHeader titleKey="adminPanelCard" subtitleKey="adminPanelTitle" descriptionKey="adminPanelText" />
          </a>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">{visitUs.title}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{visitUs.title}</h2>
            <p className="mt-3 text-slate-700">{visitUs.description}</p>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Address:</span> {visitUs.address}</p>
              <p><span className="font-semibold text-slate-900">Phone:</span> {visitUs.phone}</p>
              <p><span className="font-semibold text-slate-900">Email:</span> {visitUs.email}</p>
              <p><span className="font-semibold text-slate-900">Hours:</span> {visitUs.hours}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Connect</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.facebook && <Link href={socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Facebook</Link>}
              {socialLinks.instagram && <Link href={socialLinks.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Instagram</Link>}
              {socialLinks.linkedin && <Link href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">LinkedIn</Link>}
              {socialLinks.x && <Link href={socialLinks.x} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">X / Twitter</Link>}
              {!socialLinks.facebook && !socialLinks.instagram && !socialLinks.linkedin && !socialLinks.x && (
                <p className="text-sm text-slate-600">Social links will appear here once saved by an admin.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {isAdmin && <TabPanel />}
    </main>
  );
}
