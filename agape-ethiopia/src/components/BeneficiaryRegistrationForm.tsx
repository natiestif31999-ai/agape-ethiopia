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

      // Log: Before insert
      console.log("[REGISTRATION] Payload prepared:", payload);
      console.log("[REGISTRATION] Attempting to insert into 'beneficiaries' table...");

      const insertPromise = supabase.from("beneficiaries").insert([payload]).select();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase request timed out after 20 seconds.")), 20000)
      );

      const result = await Promise.race([insertPromise, timeoutPromise]);
      const { data, error } = result as {
        data: unknown;
        error: { code?: string; message: string } | null;
      };

      // Log: After insert
      console.log("[REGISTRATION] Insert response - Data:", data, "Error:", error);

      if (error) {
        console.error("[REGISTRATION] Insert failed:", error);
        setStatus(`Save failed: ${error.code ? `[${error.code}] ` : ""}${error.message}`);
        return;
      }

      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.warn("[REGISTRATION] Insert succeeded but no data returned");
        setStatus("Beneficiary registered successfully! (ID auto-generated)");
      } else if (Array.isArray(data)) {
        console.log("[REGISTRATION] Insert succeeded with data:", data[0]);
        const firstItem = data[0] as Record<string, unknown>;
        setStatus(`Beneficiary registered successfully! (ID: ${firstItem.id ?? "N/A"})`);
      } else {
        console.log("[REGISTRATION] Insert succeeded with data object:", data);
        setStatus("Beneficiary registered successfully!");
      }

      // Clear form
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
    } catch (unexpectedError) {
      console.error("[REGISTRATION] Unexpected error:", unexpectedError);
      setStatus(`Unexpected error: ${unexpectedError instanceof Error ? unexpectedError.message : String(unexpectedError)}`);
    } finally {
      setIsSaving(false);
    }
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
