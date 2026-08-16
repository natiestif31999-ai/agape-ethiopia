"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useAuth } from "@/components/layout/SupabaseProvider";
import { useLanguage } from "@/components/layout/LanguageProvider";

const menuLinkClass =
  "flex w-full items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800";

export default function AgapeMenu() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { t } = useLanguage();
  const { isAdmin, isStaff } = useAuth();

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) {
        return;
      }

      if (menuRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      previousFocusRef.current?.focus();
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const drawerMenu = open && typeof document !== "undefined" && (
    <div className="fixed inset-0 z-[9999] flex">
      <button
        type="button"
        aria-label={t("agapeMenu")}
        className="absolute inset-0 bg-slate-950/50"
        onClick={closeMenu}
      />
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("agapeMenu")}
        className="relative ml-0 flex h-full w-[min(90vw,22.5rem)] max-w-[360px] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl"
        style={{
          paddingTop: "max(1rem, env(safe-area-inset-top))",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="border-b border-slate-200 px-4 pb-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl">🦽</div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{t("applicationName")}</p>
              <p className="text-xs text-slate-500">{t("agapeMenuDescription")}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Home</p>
              <Link href="/" className={menuLinkClass} onClick={closeMenu}>{t("home")}</Link>
              <Link href="/about" className={menuLinkClass} onClick={closeMenu}>{t("about")}</Link>
              <Link href="/services" className={menuLinkClass} onClick={closeMenu}>{t("services")}</Link>
              <Link href="/contact" className={menuLinkClass} onClick={closeMenu}>{t("contact")}</Link>
            </div>

            <div className="space-y-2">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Registration</p>
              <Link href="/agape-registration" className={menuLinkClass} onClick={closeMenu}>Agape Registration</Link>
              <Link href="/agape-registration/register" className={menuLinkClass} onClick={closeMenu}>Self Registration</Link>
              <Link href="/agape-registration/bulk" className={menuLinkClass} onClick={closeMenu}>Multiple Registration</Link>
              <Link href="/agape-registration/track" className={menuLinkClass} onClick={closeMenu}>Track Registration</Link>
            </div>

            <div className="space-y-2">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Support</p>
              <Link href="/partnerships" className={menuLinkClass} onClick={closeMenu}>{t("partners")}</Link>
              <Link href="/donations" className={menuLinkClass} onClick={closeMenu}>{t("donations")}</Link>
            </div>

            {(isStaff || isAdmin) && (
              <div className="space-y-2">
                <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Staff Portal</p>
                <Link href="/dashboard/staff" className={menuLinkClass} onClick={closeMenu}>{t("staffDashboard")}</Link>
                <Link href="/beneficiaries" className={menuLinkClass} onClick={closeMenu}>{t("beneficiaries")}</Link>
                <Link href="/assessments" className={menuLinkClass} onClick={closeMenu}>{t("assessments")}</Link>
                <Link href="/distributions" className={menuLinkClass} onClick={closeMenu}>{t("distributions")}</Link>
                <Link href="/records" className={menuLinkClass} onClick={closeMenu}>{t("records")}</Link>
                <Link href="/reports" className={menuLinkClass} onClick={closeMenu}>{t("reports")}</Link>
              </div>
            )}

            {isAdmin && (
              <div className="space-y-2">
                <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Admin</p>
                <Link href="/dashboard/admin" className={menuLinkClass} onClick={closeMenu}>{t("adminPanel")}</Link>
                <Link href="/admin" className={menuLinkClass} onClick={closeMenu}>{t("adminCenter")}</Link>
              </div>
            )}

            {!isStaff && !isAdmin && (
              <div className="space-y-2">
                <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Access</p>
                <Link href="/login" className={menuLinkClass} onClick={closeMenu}>{t("staffAdminPortal")}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-50">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {t("agapeMenu")}
        <span className="text-base">▾</span>
      </button>

      {typeof document !== "undefined" && createPortal(drawerMenu, document.body)}
    </div>
  );
}
