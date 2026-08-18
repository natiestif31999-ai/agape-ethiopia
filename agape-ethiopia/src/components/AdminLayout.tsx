"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useAuth } from "@/components/layout/SupabaseProvider";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentSection: "overview" | "staff" | "beneficiaries" | "registrations" | "assessments" | "equipment" | "partners" | "donations" | "reports" | "audit" | "settings";
}

export default function AdminLayout({ children, currentSection }: AdminLayoutProps) {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sections = [
    { id: "overview", label: t("overview") || "Overview", href: "/dashboard/admin", icon: "📊" },
    { id: "staff", label: t("staffManagement") || "Users & Staff", href: "/dashboard/admin/staff", icon: "👨‍💼" },
    { id: "beneficiaries", label: t("beneficiaries") || "Beneficiaries", href: "/dashboard/admin/beneficiaries", icon: "👥" },
    { id: "registrations", label: t("registrations") || "Registrations", href: "/dashboard/admin/registrations", icon: "📋" },
    { id: "assessments", label: t("assessments") || "Assessments", href: "/dashboard/admin/assessments", icon: "📏" },
    { id: "equipment", label: t("equipment") || "Equipment", href: "/dashboard/admin/equipment", icon: "📦" },
    { id: "partners", label: t("partners") || "Partners", href: "/dashboard/admin/partners", icon: "🤝" },
    { id: "donations", label: t("donations") || "Donations", href: "/dashboard/admin/donations", icon: "💰" },
    { id: "reports", label: t("reports") || "Reports", href: "/dashboard/admin/reports", icon: "📈" },
    { id: "audit", label: t("auditLogs") || "Audit Logs", href: "/dashboard/admin/audit", icon: "🔍" },
    { id: "settings", label: t("settings") || "Settings", href: "/dashboard/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden bg-slate-900 text-white transition-transform duration-300 md:static md:w-64 md:translate-x-0 lg:w-72`}
        >
          <div className="border-b border-slate-700 p-4 sm:p-6">
            <div className="text-2xl font-bold tracking-tight">AGAPE</div>
            <p className="mt-1 text-xs text-slate-400">Admin Control</p>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto p-3 sm:p-4">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition sm:px-4 ${
                  currentSection === section.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-base sm:text-lg">{section.icon}</span>
                <span className="truncate">{section.label}</span>
              </Link>
            ))}
          </nav>

          <div className="space-y-2 border-t border-slate-700 p-3 sm:p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 sm:px-4"
            >
              <span className="text-base">{sidebarOpen ? "◀" : "▶"}</span>
              <span>Collapse</span>
            </button>
            <button
              onClick={() => {
                signOut();
                window.location.href = "/login";
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 sm:px-4"
            >
              <span className="text-base">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
          />
        )}

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <header className="border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-lg text-slate-700 md:hidden"
                  aria-label="Toggle menu"
                >
                  ☰
                </button>
                <h2 className="text-lg font-bold text-slate-900 sm:text-2xl">
                  {sections.find((s) => s.id === currentSection)?.label || "Admin"}
                </h2>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/change-password" className="text-xs text-slate-600 hover:text-slate-900 sm:text-sm">
                  {t("changePassword") || "Change Password"}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    window.location.href = "/login";
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 sm:text-sm"
                >
                  {t("logout") || "Logout"}
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
