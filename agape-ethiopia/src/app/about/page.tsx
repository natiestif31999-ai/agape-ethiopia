"use client";

import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

const defaultSocialLinks = { facebook: "", instagram: "", linkedin: "", x: "", tiktok: "", telegram: "", youtube: "" };

function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as T;
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function AboutPage() {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();
  const defaultVisitUs = {
    title: t("visitUsTitle"),
    description: t("visitUsDescription"),
    address: "Addis Ababa, Ethiopia",
    phone: "+251 900 000 000",
    email: "info@agapeethiopia.org",
    hours: t("visitUsHours"),
  };
  const visitUs = parseJsonSetting(settings.homepage_visit_us, defaultVisitUs);
  const socialLinks = parseJsonSetting(settings.homepage_social_links, defaultSocialLinks);

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase text-emerald-700">{t("about")}</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{settings.about_title || t("aboutTitle")}</h1>
          <p className="mt-4 max-w-3xl text-slate-700">{settings.about_content || t("aboutDescription")}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-blue-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">{t("aboutMissionLabel")}</h2>
              <p className="mt-2 text-slate-700">{settings.about_mission || t("ourMissionText")}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">{t("aboutVisionLabel")}</h2>
              <p className="mt-2 text-slate-700">{settings.about_vision || t("aboutVisionFallback")}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">{visitUs.title}</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{visitUs.title}</h2>
          <p className="mt-3 max-w-2xl text-slate-700">{visitUs.description}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">{t("addressLabel")}:</span> {visitUs.address}</p>
              <p><span className="font-semibold text-slate-900">{t("phoneLabel")}:</span> {visitUs.phone}</p>
              <p><span className="font-semibold text-slate-900">{t("emailLabel")}:</span> {visitUs.email}</p>
              <p><span className="font-semibold text-slate-900">{t("hoursLabel")}:</span> {visitUs.hours}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">{t("socialMedia")}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.facebook && <Link href={socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Facebook</Link>}
                {socialLinks.instagram && <Link href={socialLinks.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Instagram</Link>}
                {socialLinks.linkedin && <Link href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">LinkedIn</Link>}
                {socialLinks.x && <Link href={socialLinks.x} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">X / Twitter</Link>}
                {socialLinks.tiktok && <Link href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">TikTok</Link>}
                {socialLinks.telegram && <Link href={socialLinks.telegram} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Telegram</Link>}
                {socialLinks.youtube && <Link href={socialLinks.youtube} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">YouTube</Link>}
                {!Object.values(socialLinks).some(Boolean) && (
                  <p className="text-sm text-slate-600">{t("socialLinksEmpty")}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
