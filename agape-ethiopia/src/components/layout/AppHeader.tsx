import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/layout/Logo";

export default function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Logo />

        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-700">
          <Link href="/beneficiaries" className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 transition hover:bg-slate-200">
            Beneficiaries
          </Link>
          <Link href="/beneficiaries/new" className="rounded-full btn-primary px-4 py-2 transition">
            New registration
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-[var(--brand-primary-600)]/10 px-4 py-2 text-[var(--brand-primary)] shadow-sm">
            <Image src="/agape-logo.jpg" alt="Agape Ethiopia accent mark" width={24} height={24} className="rounded-full" />
            Live dashboard
          </div>
        </div>
      </div>
    </header>
  );
}
