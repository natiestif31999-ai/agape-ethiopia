"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/layout/Logo";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function AppHeader() {
  const { t } = useLanguage();

  return (
    <header className="border-b border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Logo />

        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
          <Link href="/" className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 transition hover:bg-slate-200">
            {t("home")}
          </Link>
          <Link href="/beneficiaries" className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 transition hover:bg-slate-200">
            {t("beneficiaries")}
          </Link>
          <Link href="/beneficiaries/new" className="rounded-full bg-emerald-700 px-4 py-2 text-white transition hover:bg-emerald-800">
            {t("newRegistration")}
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-emerald-700/10 px-4 py-2 text-emerald-900 shadow-sm">
            <Image src="/agape-logo.jpg" alt="Agape Ethiopia accent mark" width={24} height={24} className="rounded-full" />
            {t("liveDashboard")}
          </div>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
