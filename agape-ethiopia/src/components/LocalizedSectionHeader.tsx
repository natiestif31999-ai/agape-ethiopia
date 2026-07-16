"use client";

import React from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function LocalizedSectionHeader({
  titleKey,
  subtitleKey,
  descriptionKey,
  bullets,
}: {
  titleKey: string;
  subtitleKey?: string;
  descriptionKey?: string;
  bullets?: string[];
}) {
  const { t } = useLanguage();
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">{t(titleKey)}</p>
      {subtitleKey && <h1 className="mt-3 text-3xl font-bold text-slate-900">{t(subtitleKey)}</h1>}
      {descriptionKey && <p className="mt-3 text-slate-700">{t(descriptionKey)}</p>}
      {bullets && (
        <div className="mt-4 flex flex-wrap gap-3">
          {bullets.map((b) => (
            <div key={b} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              {t(b)}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
