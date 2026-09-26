"use client";

import Link from "next/link";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function HomeSignInBanner() {
  const { t } = useLanguage();

  return (
    <section className="border-b border-emerald-100 bg-emerald-50/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-800">{t("secureSignIn")}</p>
          <p className="mt-1 text-sm text-slate-700">{t("secureSignInDescription")}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Link href="/login?role=staff" className="rounded-xl bg-emerald-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-800">{t("signInAsStaff")}</Link>
          <Link href="/login?role=admin" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-800">{t("signInAsAdmin")}</Link>
        </div>
      </div>
    </section>
  );
}