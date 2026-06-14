"use client";

import { useMemo, useState } from "react";
import DonationForm from "@/components/DonationForm";
import RequestPortal from "@/components/RequestPortal";
import AdminPanel from "@/components/AdminPanel";
import ImpactHero from "@/components/ImpactHero";

const tabs = [
  { id: "home", label: "Master Home" },
  { id: "donations", label: "Donation Form" },
  { id: "requests", label: "Request Portal" },
  { id: "admin", label: "Admin Center" },
] as const;

export default function TabPanel() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("home");

  const panel = useMemo(() => {
    switch (activeTab) {
      case "donations":
        return <DonationForm />;
      case "requests":
        return <RequestPortal />;
      case "admin":
        return <AdminPanel />;
      case "home":
      default:
        return <ImpactHero />;
    }
  }, [activeTab]);

  return (
    <section className="space-y-8">
      <nav className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {panel}
    </section>
  );
}
