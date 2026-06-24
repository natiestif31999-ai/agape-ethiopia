"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

type UserProfile = {
  id: string;
  email?: string;
  role?: string;
  is_disabled?: boolean;
};

type BeneficiaryRecord = {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  region?: string;
  status?: string;
};

type SiteSetting = {
  id?: string;
  key: string;
  value: string;
};

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryRecord[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [title, setTitle] = useState("");
  const [heroText, setHeroText] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [statusMessage, setStatusMessage] = useState("Loading admin overview...");

  async function loadData() {
    try {
      const supabase = getSupabaseClient();
      const [profilesResult, beneficiariesResult, settingsResult] = await Promise.all([
        supabase.from("users").select("id,email,role,is_disabled").limit(20),
        supabase.from("beneficiaries").select("id,first_name,last_name,phone,region,status").order("created_at", { ascending: false }).limit(50),
        supabase.from("site_settings").select("id,key,value"),
      ]);

      if (profilesResult.error) {
        console.warn("Profiles load failed", profilesResult.error.message);
      }
      if (beneficiariesResult.error) {
        console.warn("Beneficiaries load failed", beneficiariesResult.error.message);
      }
      if (settingsResult.error) {
        console.warn("Settings load failed", settingsResult.error.message);
      }

      setProfiles(profilesResult.data ?? []);
      setBeneficiaries(beneficiariesResult.data ?? []);
      setSettings(settingsResult.data ?? []);

      const map = Object.fromEntries((settingsResult.data ?? []).map((setting) => [setting.key, setting.value]));
      setTitle(map.title ?? "Agape Mobility Ethiopia");
      setHeroText(map.hero_text ?? "Supporting mobility and dignity for vulnerable communities.");
      setButtonLabel(map.button_label ?? "Register now");
      setPrimaryColor(map.primary_color ?? "#0f766e");
      setStatusMessage("Admin overview loaded.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to load admin overview.");
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const supabase = getSupabaseClient();
      const payload: Array<{ key: string; value: string }> = [
        { key: "title", value: title },
        { key: "hero_text", value: heroText },
        { key: "button_label", value: buttonLabel },
        { key: "primary_color", value: primaryColor },
      ];

      for (const item of payload) {
        const existing = settings.find((record) => record.key === item.key);
        if (existing?.id) {
          const { error } = await supabase.from("site_settings").update({ value: item.value }).eq("id", existing.id);
          if (error) {
            throw error;
          }
        } else {
          const { error } = await supabase.from("site_settings").insert({ key: item.key, value: item.value });
          if (error) {
            throw error;
          }
        }
      }

      setStatusMessage("Settings saved successfully.");
      await loadData();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to save settings.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Master admin dashboard</h1>
        <p className="mt-2 text-slate-600">Manage users, oversee beneficiary applications, and update site settings.</p>
        <p className="mt-4 text-sm text-slate-500">{statusMessage}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Users</h2>
          <div className="mt-4 space-y-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{profile.email || "Unknown profile"}</p>
                <p className="mt-1 text-sm text-slate-600">Role: {profile.role || "Staff"}</p>
              </div>
            ))}
            {profiles.length === 0 && <p className="text-sm text-slate-500">No users found yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Beneficiary overview</h2>
          <div className="mt-4 space-y-3">
            {beneficiaries.map((beneficiary) => (
              <div key={beneficiary.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{[beneficiary.first_name, beneficiary.last_name].filter(Boolean).join(" ") || "Unnamed beneficiary"}</p>
                <p className="mt-1 text-sm text-slate-600">Phone: {beneficiary.phone || "—"}</p>
                <p className="text-sm text-slate-600">Location: {beneficiary.region || "—"}</p>
                <p className="text-sm text-slate-600">Status: {beneficiary.status || "pending"}</p>
              </div>
            ))}
            {beneficiaries.length === 0 && <p className="text-sm text-slate-500">No beneficiaries found yet.</p>}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Site settings</h2>
        <form onSubmit={saveSettings} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Website title
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Hero text
            <input value={heroText} onChange={(event) => setHeroText(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Button label
            <input value={buttonLabel} onChange={(event) => setButtonLabel(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Primary color
            <input value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
          </label>
          <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white md:col-span-2">Save site settings</button>
        </form>
      </section>
    </div>
  );
}
