import Image from "next/image";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function Logo() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      <Image
        src="/agape-logo.png"
        alt={t("applicationName")}
        width={60}
        height={60}
        priority
        className="rounded-2xl border border-emerald-100 bg-white shadow-sm"
      />

      <div>
        <h1 className="text-lg font-bold text-slate-900">{t("applicationName")}</h1>
        <p className="text-sm text-slate-500">{t("applicationTagline")}</p>
      </div>
    </div>
  );
}