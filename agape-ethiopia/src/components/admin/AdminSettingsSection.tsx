"use client";

import { useState, useEffect } from "react";

interface SiteSetting {
  key: string;
  value: string;
  description?: string;
  category?: string;
  is_json?: boolean;
}

interface CMSSettings {
  [key: string]: string;
}

export default function AdminSettingsSection() {
  const [settings, setSettings] = useState<CMSSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"homepage" | "about" | "social">("homepage");

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/site-settings?category=homepage,about");
        if (!response.ok) throw new Error("Failed to load settings");
        const data = (await response.json()) as { data: SiteSetting[] };
        const settingsMap: CMSSettings = {};
        data.data.forEach((setting) => {
          settingsMap[setting.key] = setting.value;
        });
        setSettings(settingsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    void loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Save all changed settings
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
      }));

      for (const update of updates) {
        const response = await fetch("/api/site-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
        });
        if (!response.ok) throw new Error(`Failed to save ${update.key}`);
      }

      setSuccess("Settings saved successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CMS & Settings</h1>
        <p className="mt-2 text-gray-600">Manage homepage, about page, and site content</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex border-b border-slate-200">
          {(["homepage", "about", "social"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "homepage" ? "Homepage" : tab === "about" ? "About Page" : "Social Media"}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {/* Homepage Tab */}
          {activeTab === "homepage" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={settings.homepage_hero_title || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, homepage_hero_title: e.target.value })
                  }
                  placeholder="Main headline for homepage"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                <textarea
                  value={settings.homepage_hero_subtitle || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, homepage_hero_subtitle: e.target.value })
                  }
                  placeholder="Supporting text for homepage hero"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Title</label>
                <input
                  type="text"
                  value={settings.about_title || ""}
                  onChange={(e) => setSettings({ ...settings, about_title: e.target.value })}
                  placeholder="Page title"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
                <textarea
                  value={settings.about_mission || ""}
                  onChange={(e) => setSettings({ ...settings, about_mission: e.target.value })}
                  placeholder="Organization mission"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision Statement</label>
                <textarea
                  value={settings.about_vision || ""}
                  onChange={(e) => setSettings({ ...settings, about_vision: e.target.value })}
                  placeholder="Organization vision"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Content</label>
                <textarea
                  value={settings.about_content || ""}
                  onChange={(e) => setSettings({ ...settings, about_content: e.target.value })}
                  placeholder="Main about page content"
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* Social Media Tab */}
          {activeTab === "social" && (
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
              <p className="text-sm text-blue-700">
                Social media links can be edited through the blog posts and newsletter sections.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Visit Us section includes: Address, Phone, Email, Hours
              </p>
            </div>
          )}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">System Information</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
            <input
              type="text"
              value={settings.site_name || "AGAPE MOBILITY ETHIOPIA"}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization Email</label>
            <input
              type="email"
              value={settings.site_email || ""}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization Phone</label>
            <input
              type="tel"
              value={settings.site_phone || ""}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
