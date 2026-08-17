"use client";

export default function AdminReportsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="mt-2 text-gray-600">Generate and view operational reports</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-lg border border-slate-200 p-6 cursor-pointer hover:border-emerald-400 transition">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-gray-900">Beneficiary Report</h3>
          <p className="text-sm text-slate-600 mt-1">View beneficiary statistics and trends</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 cursor-pointer hover:border-emerald-400 transition">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-semibold text-gray-900">Donation Report</h3>
          <p className="text-sm text-slate-600 mt-1">View donation records and summaries</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 cursor-pointer hover:border-emerald-400 transition">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold text-gray-900">Staff Activity Report</h3>
          <p className="text-sm text-slate-600 mt-1">View staff actions and assignments</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 cursor-pointer hover:border-emerald-400 transition">
          <div className="text-3xl mb-3">📈</div>
          <h3 className="font-semibold text-gray-900">Operations Report</h3>
          <p className="text-sm text-slate-600 mt-1">View operational metrics and KPIs</p>
        </div>
      </div>
    </div>
  );
}
