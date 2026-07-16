"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useLanguage } from "@/components/layout/LanguageProvider";

export default function PublicBeneficiaryRegistrationForm() {
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [kifleKetema, setKifleKetema] = useState("");
  const [kebele, setKebele] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [disabilityType, setDisabilityType] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState(t("register.public.ready"));
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(t("register.public.saving"));

    try {
        if (!firstName.trim() || !lastName.trim() || !gender || !phone.trim() || !region.trim() || !kebele.trim()) {
        setStatusMessage(t("register.public.validation.required"));
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("first_name", firstName.trim());
      formData.append("middle_name", middleName.trim());
      formData.append("last_name", lastName.trim());
      formData.append("date_of_birth", dateOfBirth);
      formData.append("gender", gender);
      formData.append("phone", phone.trim());
      formData.append("region", region.trim());
      formData.append("kifle_ketema", kifleKetema.trim());
      formData.append("kebele", kebele.trim());
      formData.append("house_number", houseNumber.trim());
      formData.append("disability_type", disabilityType.trim());
      formData.append("referral_source", referralSource.trim());
      formData.append("notes", notes.trim());
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await fetch("/api/public-registration", {
        method: "POST",
        body: formData,
      });

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        const message = responseBody?.errors?.[0] || responseBody?.error || t("register.public.error");
        setStatusMessage(message);
        return;
      }

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
      setDisabilityType("");
      setReferralSource("");
      setNotes("");
      setPhotoFile(null);
      setStatusMessage(responseBody?.message || t("register.public.success"));
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : t("register.public.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("firstName")}
        <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("exampleFirstName")} required />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("fathersName")}
        <input value={middleName} onChange={(event) => setMiddleName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("exampleMiddleName")} />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("grandfathersName")}
        <input value={lastName} onChange={(event) => setLastName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("exampleLastName")} required />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("dateOfBirth")}
        <input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("gender")}
        <select value={gender} onChange={(event) => setGender(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3" required>
          <option value="">{t("selectGender")}</option>
          <option value="male">{t("male")}</option>
          <option value="female">{t("female")}</option>
        </select>
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("phone")}
        <input value={phone} onChange={(event) => setPhone(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("examplePhone")} required />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("region")}
        <input value={region} onChange={(event) => setRegion(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("exampleRegion")} required />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("kifleKetema")}
        <input value={kifleKetema} onChange={(event) => setKifleKetema(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("exampleNeighborhood")} />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("kebele")}
        <input value={kebele} onChange={(event) => setKebele(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("exampleKebele")} required />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("houseNumber")}
        <input value={houseNumber} onChange={(event) => setHouseNumber(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("exampleHouseNumber")} />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("notes")}
        <input value={disabilityType} onChange={(event) => setDisabilityType(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("exampleRegion")} />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {t("referralSource")}
        <input value={referralSource} onChange={(event) => setReferralSource(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder={t("referralSourcePlaceholder")} />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
        {t("uploadPhotoLabel")}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhotoFile(event.target.files ? event.target.files[0] : null)} className="rounded-xl border border-slate-300 bg-white px-4 py-3" />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
        {t("notes")}
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-24 rounded-xl border border-slate-300 px-4 py-3" placeholder={t("notesPlaceholder")} />
      </label>

      <button type="submit" disabled={isSubmitting} className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white lg:col-span-2 disabled:cursor-not-allowed disabled:bg-slate-400">
        {isSubmitting ? t("register.public.submitting") : t("register.public.submit")}
      </button>

      <p className="text-sm text-slate-500 lg:col-span-2">{statusMessage}</p>
    </form>
  );
}
