"use client";

import { useState, type FormEvent } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function BeneficiaryRegistrationForm() {
  const { t } = useLanguage();

  const [registrationDate, setRegistrationDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [kifleKetema, setKifleKetema] = useState("");
  const [kebele, setKebele] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [houseNumber, setHouseNumber] = useState("");
  const [disabilityType, setDisabilityType] = useState("");
  const [otherDisabilityDetail, setOtherDisabilityDetail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(t("registrationReady"));
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(t("savingRecord"));
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
        middle_name: middleName.trim(),
        last_name: lastName.trim(),
        date_of_birth: dateOfBirth,
        gender,
        phone: phone.trim(),
        region: region.trim(),
        kifle_ketema: kifleKetema.trim(),
        kebele: kebele.trim(),
        house_number: houseNumber.trim(),
        notes: notes.trim(),
        disability_type: disabilityType === "Other" ? otherDisabilityDetail.trim() : disabilityType,
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
      setMiddleName("");
      setLastName("");
      setDateOfBirth("");
      setGender("");
      setPhone("");
      setRegion("");
      setKifleKetema("");
      setKebele("");
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
      <p className="mt-2 text-slate-600">{t("registerDescription")}</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("registrationNumber")}
          <input value={t("autoGeneratedOnly") || "Auto-generated on save"} disabled className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3" />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("registrationDate")}
          <input
            value={registrationDate}
            onChange={(event) => setRegistrationDate(event.target.value)}
            type="date"
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("firstName")}
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("exampleFirstName")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("middleName")}
          <input
            value={middleName}
            onChange={(event) => setMiddleName(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("exampleMiddleName")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("lastName")}
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("exampleLastName")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("dateOfBirth")}
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
            <option value="">{t("selectGender")}</option>
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("phone")}
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            type="tel"
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("examplePhone")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("region")}
          <input
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("exampleRegion")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("kifleKetema")}
          <input
            value={kifleKetema}
            onChange={(event) => setKifleKetema(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("exampleNeighborhood")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("kebele")}
          <input
            value={kebele}
            onChange={(event) => setKebele(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("exampleKebele")}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          {t("disabilityType")}
          <select
            value={disabilityType}
            onChange={(e) => setDisabilityType(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">{t("selectDisabilityType")}</option>
            <option value="Spinal Cord Injury">{t("Spinal Cord Injury") || "Spinal Cord Injury"}</option>
            <option value="Cerebral Palsy">{t("Cerebral Palsy") || "Cerebral Palsy"}</option>
            <option value="Amputation">{t("Amputation") || "Amputation"}</option>
            <option value="Polio">{t("Polio") || "Polio"}</option>
            <option value="Muscular Dystrophy">{t("Muscular Dystrophy") || "Muscular Dystrophy"}</option>
            <option value="Multiple Sclerosis">{t("Multiple Sclerosis") || "Multiple Sclerosis"}</option>
            <option value="Stroke">{t("Stroke") || "Stroke"}</option>
            <option value="Arthritis">{t("Arthritis") || "Arthritis"}</option>
            <option value="Congenital Disability">{t("Congenital Disability") || "Congenital Disability"}</option>
            <option value="Temporary Mobility Impairment">{t("Temporary Mobility Impairment") || "Temporary Mobility Impairment"}</option>
            <option value="Other">{t("other") || "Other"}</option>
          </select>
        </label>

        {disabilityType === "Other" && (
          <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
            {t("disabilityTypeOtherDescription")}
            <input
              value={otherDisabilityDetail}
              onChange={(e) => setOtherDisabilityDetail(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3"
              placeholder={t("disabilityTypeOtherPlaceholder")}
              required
            />
          </label>
        )}

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
          {t("houseNumber")}
          <input
            value={houseNumber}
            onChange={(event) => setHouseNumber(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("exampleHouseNumber")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          {t("notes")}
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
            placeholder={t("notesPlaceholder")}
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white md:col-span-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSaving ? t("savingRecord") : t("registerBeneficiary")}
        </button>

        <p className="text-sm text-slate-500 md:col-span-2">{status}</p>
      </form>
    </section>
  );
}
