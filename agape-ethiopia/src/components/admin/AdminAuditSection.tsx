"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  created_at: string;
}

export default function AdminAuditSection() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseClient();
        const { data, error: err } = await supabase
          .from("audit_logs")
          .select("id,action,entity_type,entity_id,user_id,created_at")
          .order("created_at", { ascending: false })
          .limit(100);

        if (err) throw err;
        setLogs(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-2 text-gray-600">View system audit logs and activity history</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Total Log Entries</p>
          <p className="mt-2 text-3xl font-bold">{logs.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {error && <div className="p-4 bg-rose-50 text-rose-800">{error}</div>}

        {!loading && logs.length === 0 && (
          <div className="p-12 text-center text-slate-500">No audit logs found</div>
        )}

        {!loading && logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Entity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">User ID</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium">{log.action}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{log.entity_type}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{log.user_id.substring(0, 8)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
