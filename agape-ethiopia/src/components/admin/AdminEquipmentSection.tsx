"use client";

export default function AdminEquipmentSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
        <p className="mt-2 text-gray-600">Manage equipment inventory and distributions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Total Equipment</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Available</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Assigned</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Distributed</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-500">
        Equipment inventory management coming soon
      </div>
    </div>
  );
}
