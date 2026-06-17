"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

type UserProfile = {
  id: string;
  email: string;
  role: string;
  is_disabled: boolean;
};

const roles = ["Admin", "Staff"] as const;

export default function AdminUserManagement() {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    )
  );
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("id,email,role,is_disabled").order("created_at", { ascending: false });
    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }
    setUsers((data ?? []) as UserProfile[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function updateUser(userId: string, updates: Partial<UserProfile>) {
    const { error } = await supabase.from("users").update(updates).eq("id", userId);
    if (error) {
      setStatus(error.message);
      return;
    }
    void loadUsers();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
      <p className="mt-2 text-slate-600">Manage application accounts and assign roles for administrators and staff.</p>
      {status && <p className="mt-4 text-sm text-red-600">{status}</p>}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(event) => updateUser(user.id, { role: event.target.value })}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">{user.is_disabled ? "Disabled" : "Active"}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => updateUser(user.id, { is_disabled: !user.is_disabled })}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    {user.is_disabled ? "Enable" : "Disable"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={4}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
