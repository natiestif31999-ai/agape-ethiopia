"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";
import LocalDonationFlow from "@/components/donations/LocalDonationFlow";
import InternationalDonationFlow from "@/components/donations/InternationalDonationFlow";
import DonorDashboard from "@/components/donations/DonorDashboard";

type DonationMode = "choose" | "local" | "international" | "dashboard";

export default function DonationPortal() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<DonationMode>("choose");
  const [donorId] = useState<string | null>(null);

  if (mode === "dashboard" && donorId) {
    return (
      <DonorDashboard donorId={donorId} onExit={() => setMode("choose")} />
    );
  }

  if (mode === "local") {
    return (
      <LocalDonationFlow onBack={() => setMode("choose")} />
    );
  }

  if (mode === "international") {
    return (
      <InternationalDonationFlow onBack={() => setMode("choose")} />
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-slate-900">{t("donation.howWould")}</h2>
        <p className="mt-2 text-lg text-slate-600">{t("donation.chooseFlow")}</p>
        <p className="mt-4 text-sm text-slate-500">{t("donation.yourSupport")}</p>
      </div>

      {/* Choice Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Local Donation Card */}
        <button
          type="button"
          onClick={() => setMode("local")}
          className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-emerald-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <div className="mb-6 text-5xl">🇪🇹</div>
          <h3 className="text-2xl font-bold text-slate-900">{t("donation.local")}</h3>
          <p className="mt-2 text-slate-600">{t("donation.localDescription")}</p>
          
          <div className="mt-6 space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{t("donation.acceptedMethods")}:</p>
            <ul className="list-inside list-disc space-y-1 text-xs text-slate-600">
              <li>CBE Birr</li>
              <li>Telebirr</li>
              <li>Bank Transfer (ETB)</li>
              <li>Cash at Office</li>
            </ul>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-emerald-700 font-semibold group-hover:translate-x-1 transition">
            {t("donation.donate")} →
          </div>
        </button>

        {/* International Donation Card */}
        <button
          type="button"
          onClick={() => setMode("international")}
          className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="mb-6 text-5xl">🌍</div>
          <h3 className="text-2xl font-bold text-slate-900">{t("donation.international")}</h3>
          <p className="mt-2 text-slate-600">{t("donation.internationalDescription")}</p>
          
          <div className="mt-6 space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{t("donation.acceptedMethods")}:</p>
            <ul className="list-inside list-disc space-y-1 text-xs text-slate-600">
              <li>PayPal</li>
              <li>Credit/Debit Card</li>
              <li>Bank Wire</li>
              <li>Other Gateways</li>
            </ul>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-blue-700 font-semibold group-hover:translate-x-1 transition">
            {t("donation.donate")} →
          </div>
        </button>
      </div>

      {/* Bank Information Section */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900">{t("donation.bankInfo")}</h3>
        <p className="mt-2 text-slate-600">{t("donation.bankInfoDescription")}</p>
        
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">{t("donation.bankName")}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Commercial Bank of Ethiopia</p>
            <p className="mt-4 text-sm text-slate-600">
              <strong>{t("donation.accountName")}:</strong><br/>
              AGAPE MOBILITY ETHIOPIA
            </p>
            <p className="mt-2 text-sm text-slate-600">
              <strong>{t("donation.accountNumber")}:</strong><br/>
              <code className="rounded bg-slate-100 px-2 py-1">****1234</code>
            </p>
            <button
              type="button"
              className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition"
            >
              {t("donation.copyAccount")}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-700">{t("donation.note")}</p>
            <p className="mt-2 text-sm text-slate-600">
              Always include your donation reference number when transferring funds to help us track and confirm your donation.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              {t("donation.contactSupport")}:<br/>
              <a href="mailto:support@agapemobility.org" className="text-blue-600 hover:underline">
                support@agapemobility.org
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900">{t("donation.faq")}</h3>
        
        <div className="mt-6 space-y-4">
          <details className="rounded-lg border border-slate-200 p-4">
            <summary className="cursor-pointer font-semibold text-slate-900 hover:text-slate-700">
              {t("donation.faqIsSecure")}
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              Yes. We use industry-standard security with Supabase and trusted payment processors to protect your information.
            </p>
          </details>

          <details className="rounded-lg border border-slate-200 p-4">
            <summary className="cursor-pointer font-semibold text-slate-900 hover:text-slate-700">
              {t("donation.faqReceipt")}
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              Yes, you will receive an email receipt immediately after successful donation with all details and a reference number.
            </p>
          </details>

          <details className="rounded-lg border border-slate-200 p-4">
            <summary className="cursor-pointer font-semibold text-slate-900 hover:text-slate-700">
              {t("donation.faqDeductible")}
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              Please consult with a tax professional. AGAPE MOBILITY ETHIOPIA is registered as a non-profit organization.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
