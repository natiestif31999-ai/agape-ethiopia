"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function PublicBeneficiaryRegistrationForm() {
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
  const [statusMessage, setStatusMessage] = useState("Share your details and we will review your request.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("Saving your registration request...");

    try {
      const supabase = getSupabaseClient();

      if (!firstName.trim() || !lastName.trim() || !gender || !phone.trim() || !region.trim() || !kebele.trim()) {
        setStatusMessage("Please complete the required beneficiary details before submitting.");
        setIsSubmitting(false);
        return;
      }

      let photoUrl: string | null = null;
      if (photoFile) {
        const allowed = ["jpg", "jpeg", "png", "webp"];
        const extension = photoFile.name.split(".").pop()?.toLowerCase() ?? "";
        if (!allowed.includes(extension)) {
          setStatusMessage("Please upload a JPG, PNG, or WebP photo.");
          setIsSubmitting(false);
          return;
        }

        if (photoFile.size > 3 * 1024 * 1024) {
          setStatusMessage("Please upload a photo smaller than 3MB.");
          setIsSubmitting(false);
          return;
        }

        const filePath = `self-registrations/${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("beneficiary-photos").upload(filePath, photoFile);
        if (!uploadError) {
          const { data: publicData } = supabase.storage.from("beneficiary-photos").getPublicUrl(filePath);
          photoUrl = publicData?.publicUrl ?? null;
        }
      }

      const { error } = await supabase.from("beneficiaries").insert([
        {
          registration_date: new Date().toISOString().slice(0, 10),
          first_name: firstName.trim(),
          middle_name: middleName.trim() || null,
          last_name: lastName.trim(),
          date_of_birth: dateOfBirth || null,
          gender,
          phone: phone.trim(),
          region: region.trim(),
          kifle_ketema: kifleKetema.trim() || null,
          kebele: kebele.trim(),
          house_number: houseNumber.trim() || null,
          disability_type: disabilityType.trim() || null,
          referral_source: referralSource.trim() || null,
          notes: notes.trim() || null,
          photo_url: photoUrl,
          status: "pending",
        },
      ]);

      if (error) {
        setStatusMessage(`Submission failed: ${error.message}`);
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
      setStatusMessage("Your registration was submitted successfully. A staff member will review it shortly.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        First name
        <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Example: Selam" required />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Middle name
        <input value={middleName} onChange={(event) => setMiddleName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Optional" />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Last name
        <input value={lastName} onChange={(event) => setLastName(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Example: Bekele" required />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Date of birth
        <input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Gender
        <select value={gender} onChange={(event) => setGender(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3" required>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Phone number
        <input value={phone} onChange={(event) => setPhone(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="+251 9xx xxx xxx" required />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Region
        <input value={region} onChange={(event) => setRegion(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Addis Ababa, Oromia, etc." required />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Kifle Ketema
        <input value={kifleKetema} onChange={(event) => setKifleKetema(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Neighborhood or sub-city" />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Kebele
        <input value={kebele} onChange={(event) => setKebele(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Kebele" required />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        House number
        <input value={houseNumber} onChange={(event) => setHouseNumber(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="House number" />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Disability or support needs
        <input value={disabilityType} onChange={(event) => setDisabilityType(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Wheelchair, mobility support, etc." />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Referral source
        <input value={referralSource} onChange={(event) => setReferralSource(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Clinic, family, community leader" />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
        Photo
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhotoFile(event.target.files ? event.target.files[0] : null)} className="rounded-xl border border-slate-300 bg-white px-4 py-3" />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700 lg:col-span-2">
        Notes
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-24 rounded-xl border border-slate-300 px-4 py-3" placeholder="Tell us more about the support you need." />
      </label>

      <button type="submit" disabled={isSubmitting} className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white lg:col-span-2 disabled:cursor-not-allowed disabled:bg-slate-400">
        {isSubmitting ? "Submitting..." : "Submit registration"}
      </button>

      <p className="text-sm text-slate-500 lg:col-span-2">{statusMessage}</p>
    </form>
  );
}
