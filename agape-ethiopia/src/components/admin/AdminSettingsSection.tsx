"use client";

export default function AdminSettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">System settings and configuration</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">System Configuration</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
            <input type="text" value="AGAPE MOBILITY ETHIOPIA" disabled className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Version</label>
            <input type="text" value="1.0.0" disabled className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-gray-600" />
          </div>
          <div className="pt-4 border-t border-slate-200">
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
