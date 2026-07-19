"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/layout/SupabaseProvider";
import { useLanguage } from "@/components/layout/LanguageProvider";

const menuLinkClass =
  "rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800";

export default function AgapeMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { isAdmin, isStaff } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
      >
        {t("agapeMenu")}
        <span className="text-base">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          <p className="mb-3 text-sm font-semibold text-emerald-700">
            {t("agapeMenuDescription")}
          </p>
          <div className="grid gap-2">
            <Link href="/" className={menuLinkClass} onClick={() => setOpen(false)}>
              {t("home")}
            </Link>
            <Link href="/about" className={menuLinkClass} onClick={() => setOpen(false)}>
              {t("about")}
            </Link>
            <Link href="/services" className={menuLinkClass} onClick={() => setOpen(false)}>
              {t("services")}
            </Link>
            <Link href="/contact" className={menuLinkClass} onClick={() => setOpen(false)}>
              {t("contact")}
            </Link>
            <Link href="/donations" className={menuLinkClass} onClick={() => setOpen(false)}>
              {t("donations")}
            </Link>
            <Link href="/partnerships" className={menuLinkClass} onClick={() => setOpen(false)}>
              {t("partners")}
            </Link>
            <Link href="/register" className={menuLinkClass} onClick={() => setOpen(false)}>
              {t("registerBeneficiary")}
            </Link>
            <Link href="/login" className={menuLinkClass} onClick={() => setOpen(false)}>
              {t("login")}
            </Link>
            {(isStaff || isAdmin) && (
              <Link href="/dashboard/staff" className={menuLinkClass} onClick={() => setOpen(false)}>
                {t("staffDashboard")}
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className={menuLinkClass} onClick={() => setOpen(false)}>
                {t("adminPanel")}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
