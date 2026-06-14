import Image from "next/image";
import Logo from "@/components/layout/Logo";

export default function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
          <Image src="/agape-logo.jpg" alt="Agape Ethiopia accent mark" width={24} height={24} className="rounded-full" />
          Live logistics dashboard
        </div>
      </div>
    </header>
  );
}
