"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseConfig, hasSupabaseAnonConfig } from "@/lib/supabase/env";

type UserProfile = {
  id: string;
  email: string;
  role: string;
  is_disabled: boolean;
};

const roles = ["Admin", "Staff"] as const;

export default function AdminUserManagement() {
  const { t } = useLanguage();
  const [supabase] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const config = getSupabaseConfig();
    if (!hasSupabaseAnonConfig(config)) {
      return null;
    }

    return createBrowserClient(config.url, config.anonKey);
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setStatus(t("supabaseNotConfigured"));
      setLoading(false);
      return;
    }

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
    if (!supabase) {
      setStatus(t("supabaseNotConfigured"));
      return;
    }

    const { error } = await supabase.from("users").update(updates).eq("id", userId);
    if (error) {
      setStatus(error.message);
      return;
    }
    void loadUsers();
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{t("users")}</h2>
      <p className="mt-2 text-slate-600">{t("usersDescription")}</p>
      {status && <p className="mt-4 text-sm text-red-600">{status}</p>}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3">{t("email")}</th>
              <th className="px-4 py-3">{t("role")}</th>
              <th className="px-4 py-3">{t("access")}</th>
              <th className="px-4 py-3">{t("actions")}</th>
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
                      <option key={role} value={role}>{t(role === "Admin" ? "roleAdmin" : "roleStaff")}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">{user.is_disabled ? t("disabled") : t("active")}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => updateUser(user.id, { is_disabled: !user.is_disabled })}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    {user.is_disabled ? t("enable") : t("disable")}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={4}>
                  {t("noUsersFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
