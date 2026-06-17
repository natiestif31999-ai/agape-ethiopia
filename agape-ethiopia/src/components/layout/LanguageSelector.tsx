"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";

export default function LanguageSelector() {
  const { locale, setLocale, locales, localeLabels, t } = useLanguage();

  return (
    <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
      <span>{t("selectLanguage")}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as typeof locale)}
        className="rounded-full border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900"
      >
        {locales.map((localeCode) => (
          <option key={localeCode} value={localeCode}>
            {localeLabels[localeCode]}
          </option>
        ))}
      </select>
    </label>
  );
}
