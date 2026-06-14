import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/agape-logo.png"
        alt="Agape Ethiopia logo"
        width={60}
        height={60}
        priority
        className="rounded-2xl border border-emerald-100 bg-white shadow-sm"
      />

      <div>
        <h1 className="text-lg font-bold text-slate-900">Agape Ethiopia</h1>
        <p className="text-sm text-slate-500">Mobility Management System</p>
      </div>
    </div>
  );
}