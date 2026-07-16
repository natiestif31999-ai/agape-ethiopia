"use client";

import Link from "next/link";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function LocalizedLink({ href, titleKey, className }: { href: string; titleKey: string; className?: string }) {
  const { t } = useLanguage();
  return (
    <Link href={href} className={className}>
      {t(titleKey)}
    </Link>
  );
}
