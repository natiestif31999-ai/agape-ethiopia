"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

type FormStep = "donor-info" | "amount" | "method" | "confirm" | "success";

export default function LocalDonationFlow({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState<FormStep>("donor-info");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETB");
  const [method, setMethod] = useState<"cbe-birr" | "telebirr" | "bank-transfer" | "cash">("bank-transfer");
  const [purpose, setPurpose] = useState("General Fund");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

  const handleNext = async () => {
    if (step === "donor-info") {
      if (!donorName.trim() || !donorEmail.trim()) {
        alert("Please fill in all required fields");
        return;
      }
      setStep("amount");
    } else if (step === "amount") {
      if (!amount || Number(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
      }
      setStep("method");
    } else if (step === "method") {
      setStep("confirm");
    } else if (step === "confirm") {
      await submitDonation();
    }
  };

  const submitDonation = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          amount: Number(amount),
          currency,
          country: "Ethiopia",
          payment_provider: getProviderName(),
          donation_purpose: purpose,
          donation_type: "one-time",
          status: method === "cash" ? "pending" : "pending",
          notes: `Local donation via ${method}`,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setReceiptNumber(result.data?.receipt_number || `REF-${Date.now()}`);
      setStep("success");
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Failed to process donation"}`);
    } finally {
      setLoading(false);
    }
  };

  const getProviderName = () => {
    const providers: Record<string, string> = {
      "cbe-birr": "CBE Birr",
      "telebirr": "Telebirr",
      "bank-transfer": "Bank Transfer",
      "cash": "Cash",
    };
    return providers[method] || method;
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">🇪🇹 {t("donation.localDonation")}</h2>
          <p className="mt-1 text-slate-600">Simple and secure local donation</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
        >
          ← Back
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between">
        {["donor-info", "amount", "method", "confirm", "success"].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                step === s
                  ? "bg-emerald-700 text-white"
                  : ["donor-info", "amount", "method", "confirm"].includes(step) && i <= ["donor-info", "amount", "method", "confirm"].indexOf(step)
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {i + 1}
            </div>
            {i < 4 && <div className="h-1 w-12 bg-slate-200 md:w-24 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step: Donor Information */}
      {step === "donor-info" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Your Information</h3>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Full Name *</span>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Your full name"
              className="rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Email Address *</span>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="your@email.com"
              className="rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Phone Number (Optional)</span>
            <input
              type="tel"
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
              placeholder="+251 9xx xxx xxx"
              className="rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </div>
      )}

      {/* Step: Amount & Purpose */}
      {step === "amount" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Donation Amount</h3>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Amount *</span>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="1"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ETB">ETB</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Donation Purpose</span>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option>General Fund</option>
              <option>Wheelchairs</option>
              <option>Medical Support</option>
              <option>Follow-up Care</option>
              <option>Emergency Support</option>
            </select>
          </label>
          <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
            💡 Your donation will help provide mobility assistance for persons with disabilities in Ethiopia.
          </div>
        </div>
      )}

      {/* Step: Payment Method */}
      {step === "method" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Payment Method</h3>
          
          {/* CBE Birr */}
          <label className="flex items-start gap-4 rounded-lg border border-slate-200 p-4 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition">
            <input
              type="radio"
              name="method"
              value="cbe-birr"
              checked={method === "cbe-birr"}
              onChange={(e) => setMethod(e.target.value as "cbe-birr" | "telebirr" | "bank-transfer" | "cash")}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">CBE Birr Mobile App</p>
              <p className="text-sm text-slate-600">Scan QR code or send to phone number</p>
            </div>
          </label>

          {/* Telebirr */}
          <label className="flex items-start gap-4 rounded-lg border border-slate-200 p-4 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition">
            <input
              type="radio"
              name="method"
              value="telebirr"
              checked={method === "telebirr"}
              onChange={(e) => setMethod(e.target.value as "cbe-birr" | "telebirr" | "bank-transfer" | "cash")}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Telebirr (Ethio Telecom)</p>
              <p className="text-sm text-slate-600">*143# or Telebirr app</p>
            </div>
          </label>

          {/* Bank Transfer */}
          <label className="flex items-start gap-4 rounded-lg border border-emerald-300 bg-emerald-50 p-4 cursor-pointer">
            <input
              type="radio"
              name="method"
              value="bank-transfer"
              checked={method === "bank-transfer"}
              onChange={(e) => setMethod(e.target.value as "cbe-birr" | "telebirr" | "bank-transfer" | "cash")}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Bank Transfer (CBE)</p>
              <p className="text-sm text-slate-600">Direct transfer to AGAPE account</p>
            </div>
          </label>

          {/* Cash */}
          <label className="flex items-start gap-4 rounded-lg border border-slate-200 p-4 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition">
            <input
              type="radio"
              name="method"
              value="cash"
              checked={method === "cash"}
              onChange={(e) => setMethod(e.target.value as "cbe-birr" | "telebirr" | "bank-transfer" | "cash")}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Cash at Office</p>
              <p className="text-sm text-slate-600">Visit our office in Addis Ababa</p>
            </div>
          </label>

          {/* Reference Number for Bank Transfer */}
          {method === "bank-transfer" && (
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Transaction Reference (Optional)</span>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g., 1234567890"
                className="rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <p className="text-xs text-slate-500">Enter transaction reference number for tracking</p>
            </label>
          )}
        </div>
      )}

      {/* Step: Confirmation */}
      {step === "confirm" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Confirm Your Donation</h3>
          <div className="rounded-lg border border-slate-200 p-4 space-y-2 bg-slate-50">
            <div className="flex justify-between">
              <span className="text-slate-600">Donor Name:</span>
              <span className="font-semibold text-slate-900">{donorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Amount:</span>
              <span className="font-semibold text-slate-900">{amount} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Purpose:</span>
              <span className="font-semibold text-slate-900">{purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Payment Method:</span>
              <span className="font-semibold text-slate-900">{getProviderName()}</span>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            ℹ️ By proceeding, you confirm this donation and agree to receive a receipt at {donorEmail}
          </div>
        </div>
      )}

      {/* Step: Success */}
      {step === "success" && (
        <div className="space-y-4 text-center">
          <div className="text-6xl">✅</div>
          <h3 className="text-2xl font-bold text-emerald-700">Donation Recorded!</h3>
          <p className="text-slate-600">Thank you for your generous support</p>
          
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-slate-600">Receipt Number:</p>
            <p className="mt-2 font-mono text-lg font-semibold text-emerald-900">{receiptNumber}</p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(receiptNumber);
                alert("Receipt number copied!");
              }}
              className="mt-3 text-sm text-emerald-700 hover:text-emerald-900 font-semibold"
            >
              Copy Receipt Number
            </button>
          </div>

          <p className="text-sm text-slate-600">
            A confirmation email has been sent to<br/>
            <strong>{donorEmail}</strong>
          </p>

          <button
            type="button"
            onClick={onBack}
            className="mt-6 w-full rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 transition"
          >
            Return to Donations
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      {step !== "success" && (
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-lg border border-slate-300 bg-slate-100 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="flex-1 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition"
          >
            {loading ? "Processing..." : step === "confirm" ? "Complete Donation" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
