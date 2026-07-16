"use client";

import React from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function LocalizedActionCard({ href, titleKey, descKey }: { href: string; titleKey: string; descKey: string }) {
  const { t } = useLanguage();
  return (
    <a href={href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
      <h2 className="text-xl font-semibold text-slate-900">{t(titleKey)}</h2>
      <p className="mt-3 text-slate-600">{t(descKey)}</p>
    </a>
  );
}
