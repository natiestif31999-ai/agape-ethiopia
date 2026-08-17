"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

interface Assessment {
  id: string;
  beneficiary_id: string;
  assessment_date: string;
}

export default function AdminAssessmentsSection() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseClient();
        const { data, error: err } = await supabase
          .from("assessments")
          .select("id,beneficiary_id,assessment_date")
          .order("assessment_date", { ascending: false });

        if (err) throw err;
        setAssessments(data || []);
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
        <h1 className="text-3xl font-bold text-gray-900">Assessment Management</h1>
        <p className="mt-2 text-gray-600">Manage beneficiary assessments and measurements</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600">Total Assessments</p>
          <p className="mt-2 text-3xl font-bold">{assessments.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        )}

        {error && <div className="p-4 bg-rose-50 text-rose-800">{error}</div>}

        {!loading && assessments.length === 0 && (
          <div className="p-12 text-center text-slate-500">No assessments found</div>
        )}

        {!loading && assessments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Assessment Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Beneficiary ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      {new Date(a.assessment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{a.beneficiary_id}</td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-600 hover:text-emerald-800 font-medium">View</button>
                    </td>
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
