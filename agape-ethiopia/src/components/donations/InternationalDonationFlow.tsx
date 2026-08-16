"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

type FormStep = "donor-info" | "amount" | "method" | "confirm" | "processing";

export default function InternationalDonationFlow({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState<FormStep>("donor-info");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorCountry, setDonorCountry] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [method, setMethod] = useState<"paypal" | "stripe" | "wire">("paypal");
  const [purpose, setPurpose] = useState("General Fund");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (step === "donor-info") {
      if (!donorName.trim() || !donorEmail.trim() || !donorCountry.trim()) {
        alert(t("donation.required"));
        return;
      }
      setStep("amount");
    } else if (step === "amount") {
      if (!amount || Number(amount) <= 0) {
        alert(t("donation.validAmount"));
        return;
      }
      setStep("method");
    } else if (step === "method") {
      setStep("confirm");
    } else if (step === "confirm") {
      await processPayment();
    }
  };

  const processPayment = async () => {
    setLoading(true);
    setStep("processing");
    
    try {
      // Record the donation intent
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: "",
          amount: Number(amount),
          currency,
          country: donorCountry,
          payment_provider: getProviderName(),
          donation_purpose: purpose,
          donation_type: "one-time",
          status: "processing",
          notes: `International donation via ${method}`,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      // In a real implementation, redirect to payment processor
      // For now, show a message
      alert(`${t("donation.donationRecorded")} "${result.data?.receipt_number || 'pending'}". ${t("donation.paymentWillBeHandledBy")} ${getProviderName()} ${t("donation.inProduction")}.`);
      onBack();
    } catch (error) {
      alert(`${t("donation.errorProcessing")}: ${error instanceof Error ? error.message : t("donation.failedProcess")}`);
      setStep("confirm");
    } finally {
      setLoading(false);
    }
  };

  const getProviderName = () => {
    const providers: Record<string, string> = {
      "paypal": "PayPal",
      "stripe": "Stripe",
      "wire": "Bank Wire",
    };
    return providers[method] || method;
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">🌍 {t("donation.international")}</h2>
          <p className="mt-1 text-slate-600">{t("donation.supportInternational")}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
        >
          ← {t("donation.back")}
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between">
        {["donor-info", "amount", "method", "confirm", "processing"].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                step === s
                  ? "bg-blue-700 text-white"
                  : ["donor-info", "amount", "method", "confirm"].includes(step) && i <= ["donor-info", "amount", "method", "confirm"].indexOf(step)
                  ? "bg-blue-100 text-blue-700"
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
              className="rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Email Address *</span>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="your@email.com"
              className="rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Country *</span>
            <input
              type="text"
              value={donorCountry}
              onChange={(e) => setDonorCountry(e.target.value)}
              placeholder="e.g., United States"
              className="rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                placeholder="0.00"
                min="1"
                step="0.01"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Donation Purpose</span>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option>General Fund</option>
              <option>Wheelchairs</option>
              <option>Medical Support</option>
              <option>Follow-up Care</option>
              <option>Emergency Support</option>
            </select>
          </label>
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            💡 Your donation will help provide mobility assistance for persons with disabilities in Ethiopia.
          </div>
        </div>
      )}

      {/* Step: Payment Method */}
      {step === "method" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Payment Method</h3>
          
          {/* PayPal */}
          <label className="flex items-start gap-4 rounded-lg border border-slate-200 p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
            <input
              type="radio"
              name="method"
              value="paypal"
              checked={method === "paypal"}
              onChange={(e) => setMethod(e.target.value as "paypal" | "stripe" | "wire")}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">PayPal</p>
              <p className="text-sm text-slate-600">Fast, secure, widely accepted worldwide</p>
            </div>
          </label>

          {/* Stripe */}
          <label className="flex items-start gap-4 rounded-lg border border-blue-300 bg-blue-50 p-4 cursor-pointer">
            <input
              type="radio"
              name="method"
              value="stripe"
              checked={method === "stripe"}
              onChange={(e) => setMethod(e.target.value as "paypal" | "stripe" | "wire")}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Credit/Debit Card</p>
              <p className="text-sm text-slate-600">Visa, Mastercard, and other cards via Stripe</p>
            </div>
          </label>

          {/* Bank Wire */}
          <label className="flex items-start gap-4 rounded-lg border border-slate-200 p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
            <input
              type="radio"
              name="method"
              value="wire"
              checked={method === "wire"}
              onChange={(e) => setMethod(e.target.value as "paypal" | "stripe" | "wire")}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Bank Wire Transfer</p>
              <p className="text-sm text-slate-600">International wire transfer via SWIFT</p>
            </div>
          </label>
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
            <div className="flex justify-between">
              <span className="text-slate-600">Country:</span>
              <span className="font-semibold text-slate-900">{donorCountry}</span>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            ℹ️ You will be redirected to {getProviderName()} to complete your payment. No payment information is stored on our servers.
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            ⚠️ This is a demonstration. In production, you will be redirected to the payment processor&apos;s secure payment page.
          </div>
        </div>
      )}

      {/* Step: Processing */}
      {step === "processing" && (
        <div className="space-y-4 text-center py-8">
          <div className="text-6xl animate-pulse">💳</div>
          <h3 className="text-2xl font-bold text-slate-900">Processing Payment...</h3>
          <p className="text-slate-600">Please wait while we process your donation</p>
          <p className="text-sm text-slate-500">You will be redirected to {getProviderName()} to complete the payment</p>
        </div>
      )}

      {/* Navigation Buttons */}
      {step !== "processing" && (
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
            className="flex-1 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition"
          >
            {loading ? "Processing..." : step === "confirm" ? "Proceed to Payment" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
