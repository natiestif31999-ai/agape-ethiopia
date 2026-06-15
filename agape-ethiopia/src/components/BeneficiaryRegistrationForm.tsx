"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function BeneficiaryRegistrationForm() {
  const [registrationNumber, setRegistrationNumber] = useState("");
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
  const [houseNumber, setHouseNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Ready to register a beneficiary.");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving beneficiary record...");
    const supabase = getSupabaseClient();

    const normalizedRegistrationNumber = registrationNumber.trim() || `AGAPE-${Date.now()}`;
    const payload = {
      registration_number: normalizedRegistrationNumber,
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
    };

    const { error } = await supabase.from("beneficiaries").insert(payload);

    if (error) {
      setStatus(`Save failed: ${error.message}`);
      return;
    }

    setRegistrationNumber("");
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
    setStatus("Beneficiary registered successfully in Supabase.");
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Beneficiary Registration</h2>
      <p className="mt-2 text-slate-600">
        Capture registration details for Agape Ethiopia beneficiaries and preserve records for future assessment and assignment tracking.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Registration number
          <input
            value={registrationNumber}
            onChange={(event) => setRegistrationNumber(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Optional auto-generated ID"
          />
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
          Middle name
          <input
            value={middleName}
            onChange={(event) => setMiddleName(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Example: Bekele"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Last name
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
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
          Gender
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
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
          Kebele
          <input
            value={kebele}
            onChange={(event) => setKebele(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Kebele"
            required
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

        <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white md:col-span-2">
          Register beneficiary
        </button>

        <p className="text-sm text-slate-500 md:col-span-2">{status}</p>
      </form>
    </section>
  );
}
