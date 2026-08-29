"use client";

import Image from "next/image";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useAuth } from "@/components/layout/SupabaseProvider";
import LanguageSelector from "@/components/layout/LanguageSelector";

interface DashboardHeaderProps {
  title: string;
  userRole: string;
}

export default function DashboardHeader({ title, userRole }: DashboardHeaderProps) {
  const { t } = useLanguage();
  const { userProfile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Image src="/agape-logo.jpg" alt="AGAPE MOBILITY ETHIOPIA" width={40} height={40} className="rounded-full" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-600">{userRole}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{userProfile?.email || "User"}</p>
              <p className="text-xs text-slate-600">{userProfile?.role === "Admin" ? "Hello, welcome to Agape Admin" : "Hello, welcome to Agape Staff Member"}</p>
            </div>
            <button
              onClick={signOut}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              {t("signOut") || "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
