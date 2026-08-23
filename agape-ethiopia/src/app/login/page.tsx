"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/layout/SupabaseProvider";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signOut, userProfile, session } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requestedRole, setRequestedRole] = useState<"Staff" | "Admin" | null>(null);

  useEffect(() => {
    const role = new URLSearchParams(window.location.search).get("role");
    setRequestedRole(role === "admin" ? "Admin" : role === "staff" ? "Staff" : null);
  }, []);

  // Effect: Redirect after successful login when profile is loaded
  useEffect(() => {
    if (!isSigningIn || !session) {
      return;
    }

    if (!userProfile) {
      const profileTimeout = window.setTimeout(() => {
        setStatus("Authentication succeeded, but your account profile could not be loaded. Please contact support or run the RBAC migration for the users table.");
        setIsSigningIn(false);
      }, 2500);

      return () => window.clearTimeout(profileTimeout);
    }

    // Check if password change is required
    if (userProfile.password_change_required) {
      router.push("/change-password");
      return;
    }

    if (requestedRole && userProfile.role !== requestedRole) {
      setStatus(`This account is not authorized for the ${requestedRole} sign-in flow.`);
      void signOut();
      setIsSigningIn(false);
      return;
    }

    // Check if user is disabled
    if (userProfile.is_disabled) {
      setStatus(t("accountDisabled"));
      setIsSigningIn(false);
      return;
    }

    // Redirect based on role
    if (userProfile.role === "Admin") {
      router.push("/dashboard/admin");
    } else if (userProfile.role === "Staff") {
      router.push("/dashboard/staff");
    } else {
      setStatus(t("noPermission"));
      setIsSigningIn(false);
    }
  }, [isSigningIn, session, userProfile, requestedRole, router, signOut, t]);

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
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4 py-8 sm:py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="flex items-center gap-3">
          <Image src="/agape-logo.png" alt="AGAPE MOBILITY ETHIOPIA logo" width={56} height={56} className="rounded-2xl border border-emerald-100" priority />
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Agape Ethiopia</p><h1 className="text-2xl font-semibold text-slate-900">{requestedRole ? `${requestedRole} sign in` : t("login")}</h1></div>
        </div>
        <p className="mt-5 text-slate-600">Sign in securely to continue to your authorized workspace.</p>
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
            <span className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-14" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 px-4 text-lg text-slate-500 hover:text-emerald-700">{showPassword ? "◉" : "◌"}</button></span>
          </label>
          <button type="submit" disabled={isSigningIn} className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70">
            {isSigningIn ? "Signing in..." : t("signIn")}
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-red-600">{status}</p>}
      </div>
    </main>
  );
}
