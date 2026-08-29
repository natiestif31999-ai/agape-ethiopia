"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

type VisitUsSettings = {
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
};

type SocialLinks = {
  facebook: string;
  instagram: string;
  linkedin: string;
  x: string;
};

const defaultVisitUs: VisitUsSettings = {
  title: "Visit Us",
  description: "Meet our team and learn how we support mobility and inclusion across Ethiopia.",
  address: "Addis Ababa, Ethiopia",
  phone: "+251 900 000 000",
  email: "info@agapeethiopia.org",
  hours: "Mon–Sat | 8:00 AM – 5:00 PM",
};

const defaultSocialLinks: SocialLinks = {
  facebook: "",
  instagram: "",
  linkedin: "",
  x: "",
};

function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value) as T;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    // Ignore invalid JSON and fall back to defaults.
  }

  return fallback;
}

export default function AdminWebsiteSettings() {
  const { settings } = useSiteSettings();
  const [heroTitle, setHeroTitle] = useState("AGAPE MOBILITY ETHIOPIA");
  const [heroSubtitle, setHeroSubtitle] = useState("Supporting mobility, dignity, and inclusive access for persons with disabilities across Ethiopia.");
  const [visitUs, setVisitUs] = useState<VisitUsSettings>(defaultVisitUs);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocialLinks);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Manage the public home page and shared contact details.");

  useEffect(() => {
    const nextVisitUs = parseJsonSetting<VisitUsSettings>(settings.homepage_visit_us, defaultVisitUs);
    const nextSocialLinks = parseJsonSetting<SocialLinks>(settings.homepage_social_links, defaultSocialLinks);

    setHeroTitle(settings.homepage_hero_title?.trim() || "AGAPE MOBILITY ETHIOPIA");
    setHeroSubtitle(settings.homepage_hero_subtitle?.trim() || "Supporting mobility, dignity, and inclusive access for persons with disabilities across Ethiopia.");
    setVisitUs({ ...defaultVisitUs, ...nextVisitUs });
    setSocialLinks({ ...defaultSocialLinks, ...nextSocialLinks });
  }, [settings]);

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("Saving public website content...");

    try {
      const supabase = getSupabaseClient();
      const keys = [
        "homepage_hero_title",
        "homepage_hero_subtitle",
        "homepage_visit_us",
        "homepage_social_links",
      ];

      const { data: existingRows } = await supabase.from("site_settings").select("id,key").in("key", keys);
      type SiteSettingRow = { id: string; key: string };
      const existingMap = new Map((existingRows as SiteSettingRow[] | null ?? []).map((row: SiteSettingRow) => [row.key, row.id]));

      const updates = [
        { key: "homepage_hero_title", value: heroTitle },
        { key: "homepage_hero_subtitle", value: heroSubtitle },
        { key: "homepage_visit_us", value: JSON.stringify(visitUs) },
        { key: "homepage_social_links", value: JSON.stringify(socialLinks) },
      ];

      for (const item of updates) {
        const rowId = existingMap.get(item.key);
        if (rowId) {
          const { error } = await supabase.from("site_settings").update({ value: item.value }).eq("id", rowId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("site_settings").insert({ key: item.key, value: item.value });
          if (error) throw error;
        }
      }

      setStatus("Public website content saved successfully.");
    } catch (error) {
      console.error("Unable to save homepage settings", error);
      setStatus(error instanceof Error ? error.message : "The website settings could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Public website</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Home page content</h2>
        </div>
      </div>

      <form onSubmit={saveSettings} className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Hero title
            <input
              value={heroTitle}
              onChange={(event) => setHeroTitle(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Hero subtitle
            <input
              value={heroSubtitle}
              onChange={(event) => setHeroSubtitle(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Visit us title
            <input
              value={visitUs.title}
              onChange={(event) => setVisitUs((current) => ({ ...current, title: event.target.value }))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Hours
            <input
              value={visitUs.hours}
              onChange={(event) => setVisitUs((current) => ({ ...current, hours: event.target.value }))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Visit us summary
          <textarea
            value={visitUs.description}
            onChange={(event) => setVisitUs((current) => ({ ...current, description: event.target.value }))}
            rows={3}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Address
            <input
              value={visitUs.address}
              onChange={(event) => setVisitUs((current) => ({ ...current, address: event.target.value }))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Phone
            <input
              value={visitUs.phone}
              onChange={(event) => setVisitUs((current) => ({ ...current, phone: event.target.value }))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email
          <input
            value={visitUs.email}
            onChange={(event) => setVisitUs((current) => ({ ...current, email: event.target.value }))}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Facebook URL
            <input
              value={socialLinks.facebook}
              onChange={(event) => setSocialLinks((current) => ({ ...current, facebook: event.target.value }))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Instagram URL
            <input
              value={socialLinks.instagram}
              onChange={(event) => setSocialLinks((current) => ({ ...current, instagram: event.target.value }))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            LinkedIn URL
            <input
              value={socialLinks.linkedin}
              onChange={(event) => setSocialLinks((current) => ({ ...current, linkedin: event.target.value }))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            X / Twitter URL
            <input
              value={socialLinks.x}
              onChange={(event) => setSocialLinks((current) => ({ ...current, x: event.target.value }))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-500"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save settings"}
          </button>
          <p className="text-sm text-slate-600">{status}</p>
        </div>
      </form>
    </section>
  );
}
