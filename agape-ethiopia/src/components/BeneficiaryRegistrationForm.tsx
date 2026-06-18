"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function BeneficiaryRegistrationForm() {
  const { t } = useLanguage();

  const [registrationDate, setRegistrationDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [fathersName, setFathersName] = useState("");
  const [grandfathersName, setGrandfathersName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [kifleKetema, setKifleKetema] = useState("");
  const [woredaZone, setWoredaZone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [houseNumber, setHouseNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Ready to register a beneficiary.");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving beneficiary record...");
    setIsSaving(true);

    try {
      // Log: Before initialization
      console.log("[REGISTRATION] Starting form submission...");

      let supabase;
      try {
        supabase = getSupabaseClient();
        console.log("[REGISTRATION] Supabase client initialized:", !!supabase);
      } catch (initError) {
        console.error("[REGISTRATION] Failed to initialize Supabase client:", initError);
        setStatus(`Error: Failed to initialize Supabase - ${initError instanceof Error ? initError.message : String(initError)}`);
        return;
      }

      // Validate image if present
      if (photoFile) {
        const allowed = ["jpg", "jpeg", "png", "webp"];
        const ext = photoFile.name.split(".").pop()?.toLowerCase() ?? "";
        if (!allowed.includes(ext)) {
          setStatus(t("invalidFileType") || "Invalid image type.");
          setIsSaving(false);
          return;
        }
        if (photoFile.size > 3 * 1024 * 1024) {
          setStatus(t("invalidFileSize") || "Image too large.");
          setIsSaving(false);
          return;
        }
      }

      const payload: Record<string, unknown> = {
        registration_date: registrationDate || new Date().toISOString().slice(0, 10),
        first_name: firstName.trim(),
        fathers_name: fathersName.trim(),
        grandfathers_name: grandfathersName.trim(),
        date_of_birth: dateOfBirth,
        gender,
        phone: phone.trim(),
        region: region.trim(),
        kifle_ketema: kifleKetema.trim(),
        woreda_zone: woredaZone.trim(),
        house_number: houseNumber.trim(),
        notes: notes.trim(),
      };

      // Log: Before submit
      console.log("[REGISTRATION] Payload prepared:", payload);
      console.log("[REGISTRATION] Attempting to submit beneficiary record...");

      // If photo present, upload first and include URL in payload
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop() ?? "jpg";
        const filePath = `beneficiaries/${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("beneficiary-photos").upload(filePath, photoFile as File);
        if (uploadError) {
          console.error("[REGISTRATION] Photo upload failed:", uploadError);
          setStatus(`Photo upload failed: ${uploadError.message}`);
          setIsSaving(false);
          return;
        }

        const { data: publicData } = await supabase.storage.from("beneficiary-photos").getPublicUrl(filePath);
        payload.photo_url = publicData?.publicUrl ?? null;
      }

      const response = await fetch("/api/beneficiaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json().catch(() => null);

      // Log: After submit
      console.log("[REGISTRATION] Submit response - Status:", response.status, "Body:", responseBody);

      if (!response.ok) {
        const message = responseBody?.error || `Request failed with status ${response.status}`;
        console.error("[REGISTRATION] Submit failed:", message);
        setStatus(`Save failed: ${message}`);
        return;
      }

      const insertedRecord = responseBody?.data as Record<string, unknown> | undefined;
      if (!insertedRecord) {
        console.warn("[REGISTRATION] Submit succeeded but no saved record data was returned");
        setStatus("Beneficiary registered successfully! (ID auto-generated)");
      } else {
        console.log("[REGISTRATION] Submit succeeded with data:", insertedRecord);
        setStatus(`Beneficiary registered successfully! (ID: ${insertedRecord.id ?? "N/A"})`);
      }

      // Clear form
      setRegistrationDate("");
      setFirstName("");
      setFathersName("");
      setGrandfathersName("");
      setDateOfBirth("");
      setGender("");
      setPhone("");
      setRegion("");
      setKifleKetema("");
      setWoredaZone("");
      setHouseNumber("");
      setNotes("");
      setPhotoFile(null);
    } catch (unexpectedError) {
      console.error("[REGISTRATION] Unexpected error:", unexpectedError);
      setStatus(`Unexpected error: ${unexpectedError instanceof Error ? unexpectedError.message : String(unexpectedError)}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{t("registerBeneficiary")}</h2>
      <p className="mt-2 text-slate-600">
        Capture registration details for Agape Ethiopia beneficiaries and preserve records for future assessment and assignment tracking.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("registrationNumber")}
          <input value={t("autoGeneratedOnly") || "Auto-generated on save"} disabled className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3" />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Registration date
          <input
            value={registrationDate}
            onChange={(event) => setRegistrationDate(event.target.value)}
            type="date"
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          First name
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Example: Amanuel"
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("fathersName")}
          <input
            value={fathersName}
            onChange={(event) => setFathersName(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Example: Bekele"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("grandfathersName")}
          <input
            value={grandfathersName}
            onChange={(event) => setGrandfathersName(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Example: Tadesse"
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Date of birth
          <input
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            type="date"
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("gender")}
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">Select gender</option>
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Phone
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            type="tel"
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Example: +251 9xx xxx xxx"
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Region
          <input
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Addis Ababa, Oromia, Amhara"
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Kifle Ketema
          <input
            value={kifleKetema}
            onChange={(event) => setKifleKetema(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Neighborhood or sub-city"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("woredaZone")}
          <input
            value={woredaZone}
            onChange={(event) => setWoredaZone(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("woredaZone")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("uploadPhotoLabel")}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          House number
          <input
            value={houseNumber}
            onChange={(event) => setHouseNumber(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="House number"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Optional disability, access, or support details."
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white md:col-span-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSaving ? "Saving beneficiary..." : "Register beneficiary"}
        </button>

        <p className="text-sm text-slate-500 md:col-span-2">{status}</p>
      </form>
    </section>
  );
}
