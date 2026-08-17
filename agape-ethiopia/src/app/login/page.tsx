"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/SupabaseProvider";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, userProfile, session } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Effect: Redirect after successful login when profile is loaded
  useEffect(() => {
    if (!isSigningIn || !session || !userProfile) {
      return;
    }

    // Check if password change is required
    if (userProfile.password_change_required) {
      router.push("/change-password");
      return;
    }

    // Check if user is disabled
    if (userProfile.is_disabled) {
      setStatus(t("accountDisabled"));
      return;
    }

    // Redirect based on role
    if (userProfile.role === "Admin") {
      router.push("/dashboard/admin");
    } else if (userProfile.role === "Staff") {
      router.push("/dashboard/staff");
    } else {
      setStatus(t("noPermission"));
    }
  }, [isSigningIn, session, userProfile, router, t]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(t("signingIn"));
    setIsSigningIn(true);

    const { error } = await signIn(email, password);
    if (error) {
      setStatus(error.message);
      setIsSigningIn(false);
      return;
    }

    // Don't reset isSigningIn - let the effect handle the redirect
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{t("login")}</h1>
        <p className="mt-3 text-slate-600">{t("login")} {t("loginPrompt")}</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            {t("email")}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            {t("password")}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>
          <button type="submit" className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-white transition hover:bg-emerald-800">
            {t("signIn")}
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-red-600">{status}</p>}
      </div>
    </main>
  );
}
