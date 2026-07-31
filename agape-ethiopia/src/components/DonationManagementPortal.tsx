"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useAuth } from "@/components/layout/SupabaseProvider";

type DonationRecord = {
  id?: string;
  donor_name?: string;
  donor_email?: string;
  donor_phone?: string;
  amount?: number;
  currency?: string;
  country?: string;
  payment_provider?: string;
  donation_purpose?: string;
  donation_type?: string;
  receipt_number?: string;
  transaction_reference?: string;
  status?: string;
  created_at?: string;
};

type PurposeRecord = {
  name?: string;
};

type BankAccountRecord = {
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  swift_code?: string;
  branch?: string;
  mobile_payment_info?: string;
  contact_information?: string;
};

const defaultPurposeOptions = [
  "General Fund",
  "Wheelchairs",
  "Children's Mobility",
  "Assistive Devices",
  "Medical Support",
  "Rehabilitation",
  "Emergency Support",
  "Other",
];

export default function DonationManagementPortal() {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccountRecord[]>([]);
  const [donationPurposes, setDonationPurposes] = useState<PurposeRecord[]>([]);
  const [history, setHistory] = useState<DonationRecord[]>([]);
  const [statusMessage, setStatusMessage] = useState(t("donation.status.ready"));
  const [donorName, setDonorName] = useState(userProfile?.email ?? "");
  const [donorEmail, setDonorEmail] = useState(userProfile?.email ?? "");
  const [donorPhone, setDonorPhone] = useState("");
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("Ethiopia");
  const [paymentProvider, setPaymentProvider] = useState("Stripe");
  const [donationPurpose, setDonationPurpose] = useState("General Fund");
  const [donationType, setDonationType] = useState("one-time");
  const [transactionReference, setTransactionReference] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadOptions() {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setDonationPurposes([]);
        setBankAccounts([]);
        return;
      }

      const [settingsResponse] = await Promise.all([
        supabase.from("site_settings").select("key,value"),
      ]);

      if (!mounted) return;

      const map = Object.fromEntries((settingsResponse.data ?? []).map((item: { key: string; value: string }) => [item.key, item.value]));
      const bankPayload = parseSettingsArray(map.donation_bank_accounts);
      const purposePayload = parseSettingsArray(map.donation_purposes);

      setBankAccounts(bankPayload as BankAccountRecord[]);
      setDonationPurposes((purposePayload as PurposeRecord[]).length > 0 ? (purposePayload as PurposeRecord[]) : []);

      const donorEmailToUse = donorEmail || userProfile?.email || "";
      if (donorEmailToUse) {
        const { data, error } = await supabase.from("donations").select("*").eq("donor_email", donorEmailToUse).order("created_at", { ascending: false }).limit(10);
        if (!error) {
          setHistory((data ?? []) as DonationRecord[]);
        }
      }
    }

    void loadOptions();
    return () => {
      mounted = false;
    };
  }, [donorEmail, userProfile?.email]);

  const filteredPurposeOptions = useMemo(() => {
    const options = donationPurposes.length > 0
      ? donationPurposes.map((item) => item.name ?? "Other")
      : defaultPurposeOptions;
    return Array.from(new Set(options));
  }, [donationPurposes]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(t("donation.status.saving"));

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          amount: Number(amount) || 0,
          currency,
          country,
          payment_provider: paymentProvider,
          transaction_reference: transactionReference,
          donation_purpose: donationPurpose,
          donation_type: donationType,
          status: "pending",
          notes,
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error ?? t("donation.status.saveFailed"));
      }

      const receiptNumber = result?.data?.receipt_number ?? `${Date.now()}`;
      setStatusMessage(`${t("donation.status.saved")} ${receiptNumber}`);
      setTransactionReference("");
      setNotes("");

      const nextRecord = {
        donor_name: donorName,
        donor_email: donorEmail,
        amount: Number(amount) || 0,
        currency,
        status: "pending",
        payment_provider: paymentProvider,
        donation_purpose: donationPurpose,
        transaction_reference: transactionReference,
        receipt_number: receiptNumber,
        created_at: new Date().toISOString(),
      } as DonationRecord;

      setHistory((current) => [nextRecord, ...current]);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : t("donation.status.saveFailed"));
    }
  }

  function handleDownloadReceipt() {
    const receiptText = [
      `Donation ID: ${Date.now()}`,
      `Receipt Number: ${history[0]?.receipt_number || "—"}`,
      `Date: ${new Date().toISOString()}`,
      `Donor: ${donorName || donorEmail || t("unknownProfile")}`,
      `Amount: ${amount} ${currency}`,
      `Payment provider: ${paymentProvider}`,
      `Transaction reference: ${transactionReference || "—"}`,
      `Purpose: ${donationPurpose}`,
    ].join("\n");

    const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "agape-donation-receipt.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">{t("donation.managementTitle")}</h2>
        <p className="text-slate-600">{t("donation.managementDescription")}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.donorName")}
          <input value={donorName} onChange={(event) => setDonorName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("donation.placeholder.donorName")} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.donorEmail")}
          <input type="email" value={donorEmail} onChange={(event) => setDonorEmail(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="donor@example.org" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.donorPhone")}
          <input value={donorPhone} onChange={(event) => setDonorPhone(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="+251 9xx xxx xxx" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.country")}
          <input value={country} onChange={(event) => setCountry(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Ethiopia" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.amount")}
          <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.currency")}
          <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3">
            <option value="USD">USD</option>
            <option value="ETB">ETB</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.paymentProvider")}
          <select value={paymentProvider} onChange={(event) => setPaymentProvider(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3">
            <option value="Stripe">Stripe</option>
            <option value="PayPal">PayPal</option>
            <option value="Google Pay">Google Pay</option>
            <option value="Apple Pay">Apple Pay</option>
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
            <option value="CBE Birr">CBE Birr</option>
            <option value="Telebirr">Telebirr</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.purpose")}
          <select value={donationPurpose} onChange={(event) => setDonationPurpose(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3">
            {filteredPurposeOptions.map((purpose) => (
              <option key={purpose} value={purpose}>{purpose}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("donation.type")}
          <select value={donationType} onChange={(event) => setDonationType(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3">
            <option value="one-time">One-time</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          {t("donation.transactionReference")}
          <input value={transactionReference} onChange={(event) => setTransactionReference(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Reference or approval code" />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          {t("donation.notes")}
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-28 rounded-xl border border-slate-300 px-4 py-3" placeholder={t("donation.placeholder.notes")} />
        </label>

        <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white md:col-span-2">{t("donation.save")}</button>
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button type="button" onClick={handleDownloadReceipt} className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-medium text-slate-800">{t("donation.downloadReceipt")}</button>
          <button type="button" onClick={() => window.print()} className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-medium text-slate-800">{t("donation.printReceipt")}</button>
          <a href={`mailto:${donorEmail || "support@agape.org"}?subject=Donation%20Receipt&body=${encodeURIComponent("Please email my donation receipt.")}`} className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-medium text-slate-800">{t("donation.emailReceipt")}</a>
        </div>
        <p className="text-sm text-slate-500 md:col-span-2">{statusMessage}</p>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{t("donation.bankAccountInformation")}</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {bankAccounts.length === 0 && (
            <p className="text-sm text-slate-500 md:col-span-2">{t("donation.noBankAccounts")}</p>
          )}
          {bankAccounts.map((account) => (
            <article key={`${account.bank_name}-${account.account_number}`} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-base font-semibold text-slate-900">{account.bank_name ?? t("unknown")}</p>
              <p className="mt-2 text-sm text-slate-600">{t("donation.accountName")}: {account.account_name ?? "—"}</p>
              <p className="text-sm text-slate-600">{t("donation.accountNumber")}: {account.account_number ?? "—"}</p>
              <p className="text-sm text-slate-600">{t("donation.swiftCode")}: {account.swift_code ?? "—"}</p>
              <p className="text-sm text-slate-600">{t("donation.branch")}: {account.branch ?? "—"}</p>
              <p className="text-sm text-slate-600">{t("donation.mobilePayment")}: {account.mobile_payment_info ?? "—"}</p>
              <p className="text-sm text-slate-600">{t("donation.contactInformation")}: {account.contact_information ?? "—"}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{t("donation.historyTitle")}</h3>
        <div className="mt-4 space-y-3">
          {history.length === 0 && <p className="text-sm text-slate-500">{t("donation.noHistory")}</p>}
          {history.map((record) => (
            <div key={`${record.id ?? record.receipt_number ?? record.created_at}`} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{record.receipt_number ?? t("unknown")}</p>
                <p className="text-sm text-slate-600">{record.status ?? t("statusPending")}</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">{record.amount ?? 0} {record.currency ?? "USD"} · {record.payment_provider ?? t("unknown")}</p>
              <p className="text-sm text-slate-600">{record.donation_purpose ?? t("unknown")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function parseSettingsArray(value?: string): Array<Record<string, string>> {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
