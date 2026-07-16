"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";

export default function OfflinePage() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 px-4 py-8">
      <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-5xl" aria-hidden>{t("offline.icon")}</div>

        <h1 className="mb-2 text-3xl font-bold text-gray-800">{t("offline.title")}</h1>

        <p className="mb-6 text-gray-600">{t("offline.message")}</p>

        <div className="mb-6 space-y-2 rounded-md bg-amber-50 p-4 text-left text-sm text-amber-800">
          <p className="font-semibold">{t("offline.whatYouCanDoTitle")}</p>
          <ul className="list-inside list-disc space-y-1">
            <li>{t("offline.checkConnection")}</li>
            <li>{t("offline.viewCached")}</li>
            <li>{t("offline.reviewSaved")}</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700"
          >
            {t("offline.tryAgain")}
          </button>

          <button
            onClick={() => window.history.back()}
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:border-gray-400"
          >
            {t("offline.goBack")}
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500">{t("offline.reconnectInfo")}</p>
      </div>
    </main>
  );
}
