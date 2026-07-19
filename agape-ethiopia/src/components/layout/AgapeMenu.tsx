"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useAuth } from "@/components/layout/SupabaseProvider";
import { useLanguage } from "@/components/layout/LanguageProvider";

const menuLinkClass =
  "block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800";

export default function AgapeMenu() {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 16, right: 16 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { isAdmin, isStaff } = useAuth();

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePosition = () => {
      if (!buttonRef.current) {
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: Math.max(16, window.innerWidth - rect.right),
      });
    };

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

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const menuContent = open && typeof window !== "undefined" && (
    <div
      ref={menuRef}
      className="agape-menu-dropdown fixed z-[9999] w-[min(90vw,20rem)] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
      style={{ top: menuPosition.top, right: menuPosition.right, maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}
      role="menu"
      aria-label={t("agapeMenu")}
    >
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
  );

  return (
    <div className="relative z-50">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {t("agapeMenu")}
        <span className="text-base">▾</span>
      </button>

      {typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </div>
  );
}
