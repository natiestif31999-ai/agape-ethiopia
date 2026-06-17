"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Locale, localeLabels, translations, supportedLocales } from "@/lib/i18n/translations";

export type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  locales: readonly Locale[];
  localeLabels: Record<Locale, string>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "agape-ethiopia-locale";

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (saved && supportedLocales.includes(saved)) {
    return saved;
  }

  const browserLocale = window.navigator.language.slice(0, 2).toLowerCase();
  if (supportedLocales.includes(browserLocale as Locale)) {
    return browserLocale as Locale;
  }

  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = (next: Locale) => {
    if (!supportedLocales.includes(next)) return;
    setLocaleState(next);
  };

  const t = (key: string) => translations[locale][key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, locales: supportedLocales, localeLabels }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
