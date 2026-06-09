import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/agape-logo.jpg"
        alt="Agape Ethiopia"
        width={60}
        height={60}
        priority
      />

      <div>
        <h1 className="font-bold text-lg">
          Agape Ethiopia
        </h1>

        <p className="text-sm text-gray-500">
          Mobility Management System
        </p>
      </div>
    </div>
  );
}