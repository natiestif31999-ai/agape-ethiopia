"use client";

import { useSiteSettings } from "@/components/SiteSettingsProvider";

type Announcement = { title: string; body: string; published: boolean; updatedAt?: string };

export default function PublicAnnouncements() {
  const { settings, loading } = useSiteSettings();
  if (loading) return null;

  let announcement: Announcement | null = null;
  try {
    const parsed = JSON.parse(settings.daily_announcement || "null") as Announcement | null;
    if (parsed?.published && parsed.title?.trim() && parsed.body?.trim()) announcement = parsed;
  } catch {
    announcement = null;
  }
  if (!announcement) return null;

  return (
    <section className="border-y border-amber-200 bg-amber-50/80 px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-800">Agape Ethiopia Updates</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{announcement.title}</h2>
        <p className="mt-3 max-w-3xl whitespace-pre-wrap text-slate-700">{announcement.body}</p>
        {announcement.updatedAt && <p className="mt-3 text-xs text-slate-500">Updated {new Date(announcement.updatedAt).toLocaleDateString()}</p>}
      </div>
    </section>
  );
}