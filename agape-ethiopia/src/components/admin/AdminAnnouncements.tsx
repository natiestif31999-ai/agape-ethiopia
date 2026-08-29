"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

const SETTING_KEY = "daily_announcement";
type Announcement = { title: string; body: string; published: boolean; updatedAt?: string };
const emptyAnnouncement: Announcement = { title: "", body: "", published: false };

export default function AdminAnnouncements() {
  const [announcement, setAnnouncement] = useState<Announcement>(emptyAnnouncement);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await getSupabaseClient().from("site_settings").select("value").eq("key", SETTING_KEY).maybeSingle();
      if (!error && data?.value) {
        try {
          const saved = JSON.parse(data.value) as Announcement;
          setAnnouncement({ ...emptyAnnouncement, ...saved });
        } catch {
          setFeedback("The saved announcement could not be read.");
        }
      }
      setLoading(false);
    }
    void load();
  }, []);

  async function saveAnnouncement(event: React.FormEvent) {
    event.preventDefault();
    if (!announcement.title.trim() || !announcement.body.trim()) {
      setFeedback("Add a title and message before publishing.");
      return;
    }
    setSaving(true);
    setFeedback(null);
    const value = JSON.stringify({ ...announcement, title: announcement.title.trim(), body: announcement.body.trim(), updatedAt: new Date().toISOString() });
    const supabase = getSupabaseClient();
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", SETTING_KEY).maybeSingle();
    const result = existing
      ? await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("id", existing.id)
      : await supabase.from("site_settings").insert({ key: SETTING_KEY, value });
    setSaving(false);
    setFeedback(result.error ? "The announcement could not be saved." : announcement.published ? "Announcement published." : "Announcement saved as a draft.");
  }

  async function removeAnnouncement() {
    setSaving(true);
    const { error } = await getSupabaseClient().from("site_settings").delete().eq("key", SETTING_KEY);
    setSaving(false);
    if (error) setFeedback("The announcement could not be removed.");
    else { setAnnouncement(emptyAnnouncement); setFeedback("Announcement removed from the home page."); }
  }

  if (loading) return <p className="text-sm text-slate-600">Loading announcement settings...</p>;

  return (
    <section id="announcements" className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">Public updates</p><h2 className="mt-1 text-xl font-semibold text-slate-900">Daily announcement</h2><p className="mt-1 text-sm text-slate-600">Publish a short update visible on the public home page.</p></div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${announcement.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>{announcement.published ? "Published" : "Draft"}</span>
      </div>
      <form onSubmit={saveAnnouncement} className="mt-5 grid gap-3">
        <input value={announcement.title} onChange={(event) => setAnnouncement((current) => ({ ...current, title: event.target.value }))} maxLength={140} placeholder="Announcement title" className="rounded-xl border border-slate-300 bg-white px-3 py-2" required />
        <textarea value={announcement.body} onChange={(event) => setAnnouncement((current) => ({ ...current, body: event.target.value }))} maxLength={2000} placeholder="Announcement message" className="min-h-28 rounded-xl border border-slate-300 bg-white px-3 py-2" required />
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={announcement.published} onChange={(event) => setAnnouncement((current) => ({ ...current, published: event.target.checked }))} /> Publish on the public home page</label>
        <div className="flex flex-wrap gap-2"><button type="submit" disabled={saving} className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Save announcement"}</button><button type="button" disabled={saving} onClick={removeAnnouncement} className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60">Remove</button></div>
      </form>
      {feedback && <p className="mt-3 text-sm text-slate-700" role="status">{feedback}</p>}
    </section>
  );
}