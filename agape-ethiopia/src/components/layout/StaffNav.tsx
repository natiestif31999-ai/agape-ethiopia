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

export default function StaffNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  const navItems: NavItem[] = [
    { href: "/dashboard/staff", labelKey: "dashboard", icon: "📊" },
    { href: "/beneficiaries", labelKey: "beneficiaries", icon: "👥" },
    { href: "/assessments", labelKey: "assessments", icon: "📋" },
    { href: "/distributions", labelKey: "distributions", icon: "📦" },
    { href: "/records", labelKey: "records", icon: "📝" },
    { href: "/reports", labelKey: "reports", icon: "📈" },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard/staff") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex h-full flex-col border-r border-slate-200 bg-slate-50">
      {/* Mobile Toggle Button */}
      <div className="flex justify-end p-4 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-900"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Navigation Items */}
      <div className={`flex flex-col gap-2 p-4 ${!isOpen && "hidden md:flex"}`}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 font-semibold transition sm:px-4 ${
                active
                  ? "bg-emerald-700 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span className="text-lg sm:text-xl">{item.icon}</span>
              <span className="text-sm sm:text-base">{t(item.labelKey) || item.labelKey}</span>
            </Link>
          );
        })}
      </div>

      {/* Staff Info Section */}
      <div className={`mt-auto flex flex-col gap-2 border-t border-slate-200 p-4 ${!isOpen && "hidden md:flex"}`}>
        <Link
          href="/change-password"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          🔐 {t("changePassword") || "Change Password"}
        </Link>
      </div>
    </nav>
  );
}
