"use client";

import Link from "next/link";
import AppHeader from "@/components/layout/AppHeader";
import LocalizedSectionHeader from "@/components/LocalizedSectionHeader";
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

export default function AboutPage() {
  const { settings } = useSiteSettings();
  const visitUs = parseJsonSetting(settings.homepage_visit_us, defaultVisitUs);
  const socialLinks = parseJsonSetting(settings.homepage_social_links, defaultSocialLinks);

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <LocalizedSectionHeader
            titleKey="about"
            subtitleKey="aboutTitle"
            descriptionKey="aboutDescription"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-blue-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">{"Mission"}</h2>
              <p className="mt-2 text-slate-700">{"Provide compassionate mobility support and restore dignity for persons with disabilities across Ethiopia."}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">{"Vision"}</h2>
              <p className="mt-2 text-slate-700">{"Build a connected network that ensures access to mobility aids, rehabilitation, and inclusive community participation."}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">{visitUs.title}</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{visitUs.title}</h2>
          <p className="mt-3 max-w-2xl text-slate-700">{visitUs.description}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">Address:</span> {visitUs.address}</p>
              <p><span className="font-semibold text-slate-900">Phone:</span> {visitUs.phone}</p>
              <p><span className="font-semibold text-slate-900">Email:</span> {visitUs.email}</p>
              <p><span className="font-semibold text-slate-900">Hours:</span> {visitUs.hours}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Social media</p>
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
      </main>
    </>
  );
}
