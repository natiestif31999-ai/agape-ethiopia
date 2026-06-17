"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/SupabaseProvider";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Signing in...");

    const { error } = await signIn(email, password);
    if (error) {
      setStatus(error.message);
      return;
    }

    router.push("/");
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{t("login")}</h1>
        <p className="mt-3 text-slate-600">{t("login")} to access the Agape Ethiopia administrative system.</p>
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
