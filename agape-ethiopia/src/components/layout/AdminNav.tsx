"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useState } from "react";

interface NavItem {
  href: string;
  labelKey: string;
  icon: string;
}

export default function AdminNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  const navItems: NavItem[] = [
    { href: "/dashboard/admin", labelKey: "dashboard", icon: "📊" },
    { href: "/admin", labelKey: "staffManagement", icon: "👨‍💼" },
    { href: "/beneficiaries", labelKey: "beneficiaryManagement", icon: "👥" },
    { href: "/donations", labelKey: "donationControl", icon: "💰" },
    { href: "/reports", labelKey: "operationalReports", icon: "📈" },
    { href: "/records", labelKey: "auditLog", icon: "📋" },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex h-full flex-col border-r border-slate-300 bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Mobile Toggle Button */}
      <div className="flex justify-end p-4 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Admin Header */}
      <div className={`px-4 py-6 text-center text-white ${!isOpen && "hidden md:block"}`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Admin Control</p>
        <h3 className="mt-2 text-lg font-bold">System Control Center</h3>
      </div>

      {/* Navigation Items */}
      <div className={`flex flex-col gap-1 px-3 py-4 ${!isOpen && "hidden md:flex"}`}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 font-semibold transition sm:px-4 ${
                active
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span className="text-lg sm:text-xl">{item.icon}</span>
              <span className="text-sm sm:text-base">{t(item.labelKey) || item.labelKey}</span>
            </Link>
          );
        })}
      </div>

      {/* Admin Footer */}
      <div className={`mt-auto flex flex-col gap-2 border-t border-slate-700 px-4 py-4 ${!isOpen && "hidden md:flex"}`}>
        <Link
          href="/change-password"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          🔐 {t("changePassword") || "Change Password"}
        </Link>
      </div>
    </nav>
  );
}
