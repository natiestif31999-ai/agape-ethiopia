"use client";

import { useEffect, useState } from "react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import AdminBlogManagement from "@/components/admin/AdminBlogManagement";

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
  tiktok: string;
  telegram: string;
  youtube: string;
};

const inputClass = "rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500";
const defaultVisitUs: VisitUsSettings = {
  title: "Visit Us",
  description: "Meet our team and learn how we support mobility and inclusion across Ethiopia.",
  address: "Addis Ababa, Ethiopia",
  phone: "+251 900 000 000",
  email: "info@agapeethiopia.org",
  hours: "Mon–Sat | 8:00 AM – 5:00 PM",
};
const defaultSocialLinks: SocialLinks = { facebook: "", instagram: "", linkedin: "", x: "", tiktok: "", telegram: "", youtube: "" };

function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value) as T;
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function AdminWebsiteSettings() {
  const { settings, refresh } = useSiteSettings();
  const [heroTitle, setHeroTitle] = useState("AGAPE MOBILITY ETHIOPIA");
  const [heroSubtitle, setHeroSubtitle] = useState("Supporting mobility, dignity, and inclusive access for persons with disabilities across Ethiopia.");
  const [aboutTitle, setAboutTitle] = useState("About AGAPE Mobility Ethiopia");
  const [aboutMission, setAboutMission] = useState("To provide comprehensive mobility solutions and support for persons with disabilities across Ethiopia.");
  const [aboutVision, setAboutVision] = useState("A world where persons with disabilities have full access to mobility, dignity, and equal participation in society.");
  const [aboutContent, setAboutContent] = useState("AGAPE Mobility Ethiopia is committed to providing quality equipment, assessments, and support services.");
  const [beneficiaryCount, setBeneficiaryCount] = useState("1,200+");
  const [partnerCount, setPartnerCount] = useState("35+");
  const [visitUs, setVisitUs] = useState<VisitUsSettings>(defaultVisitUs);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(defaultSocialLinks);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Manage public Home, About, Visit Us, and social content.");

  useEffect(() => {
    setHeroTitle(settings.homepage_hero_title?.trim() || "AGAPE MOBILITY ETHIOPIA");
    setHeroSubtitle(settings.homepage_hero_subtitle?.trim() || "Supporting mobility, dignity, and inclusive access for persons with disabilities across Ethiopia.");
    setAboutTitle(settings.about_title?.trim() || "About AGAPE Mobility Ethiopia");
    setAboutMission(settings.about_mission?.trim() || "To provide comprehensive mobility solutions and support for persons with disabilities across Ethiopia.");
    setAboutVision(settings.about_vision?.trim() || "A world where persons with disabilities have full access to mobility, dignity, and equal participation in society.");
    setAboutContent(settings.about_content?.trim() || "AGAPE Mobility Ethiopia is committed to providing quality equipment, assessments, and support services.");
    setBeneficiaryCount(settings.homepage_beneficiary_count?.trim() || "1,200+");
    setPartnerCount(settings.homepage_partner_count?.trim() || "35+");
    setVisitUs({ ...defaultVisitUs, ...parseJsonSetting(settings.homepage_visit_us, defaultVisitUs) });
    setSocialLinks({ ...defaultSocialLinks, ...parseJsonSetting(settings.homepage_social_links, defaultSocialLinks) });
  }, [settings]);

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("Saving public website content...");
    const updates = [
      { key: "homepage_hero_title", value: heroTitle, category: "homepage", is_json: false },
      { key: "homepage_hero_subtitle", value: heroSubtitle, category: "homepage", is_json: false },
      { key: "homepage_visit_us", value: JSON.stringify(visitUs), category: "homepage", is_json: true },
      { key: "homepage_social_links", value: JSON.stringify(socialLinks), category: "homepage", is_json: true },
      { key: "homepage_beneficiary_count", value: beneficiaryCount, category: "homepage", is_json: false },
      { key: "homepage_partner_count", value: partnerCount, category: "homepage", is_json: false },
      { key: "about_title", value: aboutTitle, category: "about", is_json: false },
      { key: "about_mission", value: aboutMission, category: "about", is_json: false },
      { key: "about_vision", value: aboutVision, category: "about", is_json: false },
      { key: "about_content", value: aboutContent, category: "about", is_json: false },
    ];

    try {
      for (const item of updates) {
        const response = await fetch("/api/site-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const result = await response.json().catch(() => null) as { error?: string } | null;
        if (!response.ok) throw new Error(result?.error || `Could not save ${item.key}.`);
      }
      await refresh();
      setStatus("Public website content saved successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The website settings could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase text-emerald-700">Public website</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Home and About content</h2>
        </div>
        <form onSubmit={saveSettings} className="grid gap-5">
          <h3 className="text-lg font-semibold text-slate-900">Home page</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">Hero title<input value={heroTitle} onChange={(event) => setHeroTitle(event.target.value)} className={inputClass} /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">Hero subtitle<textarea rows={3} value={heroSubtitle} onChange={(event) => setHeroSubtitle(event.target.value)} className={inputClass} /></label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">Beneficiaries supported<input value={beneficiaryCount} onChange={(event) => setBeneficiaryCount(event.target.value)} className={inputClass} /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">Partner organizations<input value={partnerCount} onChange={(event) => setPartnerCount(event.target.value)} className={inputClass} /></label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">Visit Us title<input value={visitUs.title} onChange={(event) => setVisitUs((current) => ({ ...current, title: event.target.value }))} className={inputClass} /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">Hours<input value={visitUs.hours} onChange={(event) => setVisitUs((current) => ({ ...current, hours: event.target.value }))} className={inputClass} /></label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Visit Us summary<textarea rows={3} value={visitUs.description} onChange={(event) => setVisitUs((current) => ({ ...current, description: event.target.value }))} className={inputClass} /></label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">Address<input value={visitUs.address} onChange={(event) => setVisitUs((current) => ({ ...current, address: event.target.value }))} className={inputClass} /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">Phone<input value={visitUs.phone} onChange={(event) => setVisitUs((current) => ({ ...current, phone: event.target.value }))} className={inputClass} /></label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Email<input type="email" value={visitUs.email} onChange={(event) => setVisitUs((current) => ({ ...current, email: event.target.value }))} className={inputClass} /></label>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">Social links</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {(["facebook", "instagram", "linkedin", "x", "tiktok", "telegram", "youtube"] as const).map((platform) => (
              <label key={platform} className="grid gap-2 text-sm font-medium capitalize text-slate-700">{platform === "x" ? "X / Twitter" : platform} URL<input type="url" value={socialLinks[platform]} onChange={(event) => setSocialLinks((current) => ({ ...current, [platform]: event.target.value }))} className={inputClass} /></label>
            ))}
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">About page</h3>
          <label className="grid gap-2 text-sm font-medium text-slate-700">About title<input value={aboutTitle} onChange={(event) => setAboutTitle(event.target.value)} className={inputClass} /></label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">Mission<textarea rows={3} value={aboutMission} onChange={(event) => setAboutMission(event.target.value)} className={inputClass} /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">Vision<textarea rows={3} value={aboutVision} onChange={(event) => setAboutVision(event.target.value)} className={inputClass} /></label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-slate-700">About content<textarea rows={5} value={aboutContent} onChange={(event) => setAboutContent(event.target.value)} className={inputClass} /></label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Save website content"}</button>
            <p role="status" className="text-sm text-slate-600">{status}</p>
          </div>
        </form>
      </section>
      <AdminBlogManagement />
    </>
  );
}