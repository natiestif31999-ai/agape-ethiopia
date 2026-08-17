"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/components/layout/SupabaseProvider";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to change password.");
      }

      // Redirect based on user role
      if (userProfile?.role === "Admin") {
        router.push("/dashboard/admin");
      } else if (userProfile?.role === "Staff") {
        router.push("/dashboard/staff");
      } else {
        router.push("/");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to change password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Change Password</h1>
          <p className="mt-2 text-slate-600">Set a new password to continue to the staff portal.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Current password
              <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required className="rounded-xl border border-slate-300 px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              New password
              <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required className="rounded-xl border border-slate-300 px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Confirm new password
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required className="rounded-xl border border-slate-300 px-4 py-3" />
            </label>
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              Use at least 8 characters with uppercase, lowercase, and a number.
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60">
              {isSubmitting ? "Updating password..." : "Update password"}
            </button>
          </form>
          {status && <p className="mt-4 text-sm text-red-600">{status}</p>}
        </div>
      </main>
    </>
  );
}
