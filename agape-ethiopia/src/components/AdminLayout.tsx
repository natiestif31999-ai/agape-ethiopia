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
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 flex flex-col overflow-hidden`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="text-2xl font-bold">AGAPE</div>
          {sidebarOpen && <p className="text-xs text-slate-400 mt-1">Admin Control</p>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={section.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentSection === section.id
                  ? "bg-emerald-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              } ${sidebarOpen ? "" : "justify-center"}`}
              title={!sidebarOpen ? section.label : undefined}
            >
              <span className="text-lg">{section.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{section.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition text-sm"
          >
            <span className="text-lg">{sidebarOpen ? "◀" : "▶"}</span>
            {sidebarOpen && <span>Collapse</span>}
          </button>
          <button
            onClick={() => {
              signOut();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition text-sm"
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {sections.find((s) => s.id === currentSection)?.label || "Admin"}
          </h2>
          <div className="flex items-center gap-4">
            <Link href="/change-password" className="text-sm text-slate-600 hover:text-slate-900">
              {t("changePassword") || "Change Password"}
            </Link>
            <button
              onClick={() => {
                signOut();
                window.location.href = "/login";
              }}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              {t("logout") || "Logout"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
