"use client";

export default function AdminPartnersSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
        <p className="mt-2 text-gray-600">Manage organizational partners and partnerships</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Total Partners</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Active</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Inactive</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-500">
        Partner management interface coming soon
      </div>
    </div>
  );
}
