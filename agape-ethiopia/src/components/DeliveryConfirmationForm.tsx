"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function DeliveryConfirmationForm() {
  const { t } = useLanguage();
  const [registrationNumber, setRegistrationNumber] = useState("");
  type Beneficiary = {
    id?: string;
    registration_number?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    phone?: string;
    region?: string;
    kebele?: string;
    house_number?: string;
    gender?: string;
  } | null;
  const [beneficiary, setBeneficiary] = useState<Beneficiary>(null);
  const [wheelchairType, setWheelchairType] = useState("");
  const [wheelchairSize, setWheelchairSize] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [beneficiarySignature, setBeneficiarySignature] = useState("");
  const [partnerSignature, setPartnerSignature] = useState("");
  const [status, setStatus] = useState("");

  async function lookupBeneficiary() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("beneficiaries")
      .select("id,registration_number,first_name,middle_name,last_name,phone,region,kebele,house_number")
      .eq("registration_number", registrationNumber)
      .limit(1)
      .single();
    if (error) {
      setStatus(t("unableToLoadBeneficiary") + " " + error.message);
      return;
    }
    setBeneficiary((data as Beneficiary) ?? null);
    setStatus("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(t("saving") || "Saving...");
    const supabase = getSupabaseClient();

    const payload: Record<string, unknown> = {
      beneficiary_id: beneficiary?.id ?? null,
      beneficiary_name: beneficiary ? `${beneficiary.first_name} ${beneficiary.last_name}` : null,
      registration_number: beneficiary?.registration_number ?? registrationNumber,
      gender: beneficiary?.gender ?? null,
      phone: beneficiary?.phone ?? null,
      address: beneficiary ? `${beneficiary.region} ${beneficiary.kebele} ${beneficiary.house_number ?? ""}` : null,
      wheelchair_type: wheelchairType,
      wheelchair_size: wheelchairSize,
      serial_number: serialNumber,
      delivery_date: deliveryDate || new Date().toISOString().slice(0, 10),
      beneficiary_signature: beneficiarySignature,
      partner_signature: partnerSignature,
    };

    const { error } = await supabase.from("delivery_confirmations").insert(payload);
    if (error) {
      setStatus((t("saveFailed") || "Save failed:") + " " + error.message);
      return;
    }

    setStatus(t("savedSuccessfully") || "Saved successfully");
    // keep form values for printing
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{t("deliveryConfirmation")}</h2>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("registrationNumber")}
          <div className="flex gap-2">
            <input value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
            <button type="button" onClick={lookupBeneficiary} className="rounded-xl bg-slate-700 px-3 py-2 text-white">{t("searchBeneficiaries")}</button>
          </div>
        </label>

        <div className="lg:col-span-2">
          <h3 className="text-lg font-medium text-slate-800">{t("beneficiaryProfile")}</h3>
          <p className="text-sm text-slate-600">{beneficiary ? `${beneficiary.first_name} ${beneficiary.last_name} — ${beneficiary.phone}` : t("noBeneficiarySelected")}</p>
        </div>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("delivery.wheelchairType")}
          <input value={wheelchairType} onChange={(e) => setWheelchairType(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("delivery.wheelchairSize")}
          <input value={wheelchairSize} onChange={(e) => setWheelchairSize(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("delivery.serialNumber")}
          <input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("delivery.date")}
          <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          {t("delivery.beneficiarySignature")}
          <input value={beneficiarySignature} onChange={(e) => setBeneficiarySignature(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("beneficiarySignature") || ""} />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
          {t("delivery.partnerSignature")}
          <input value={partnerSignature} onChange={(e) => setPartnerSignature(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("delivery.partnerSignature") || ""} />
        </label>

        <div className="lg:col-span-2 flex items-center gap-3">
          <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white">{t("save")}</button>
          <button type="button" onClick={() => window.print()} className="rounded-xl border px-4 py-3">{t("delivery.print")}</button>
        </div>

        <p className="text-sm text-slate-500 lg:col-span-2">{status}</p>
      </form>
    </section>
  );
}
