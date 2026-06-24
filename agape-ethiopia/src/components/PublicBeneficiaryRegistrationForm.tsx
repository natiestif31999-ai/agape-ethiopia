"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function PublicBeneficiaryRegistrationForm() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [supportNeeds, setSupportNeeds] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [statusMessage, setStatusMessage] = useState("Share your details and we will review your request.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("Saving your request...");

    try {
      const supabase = getSupabaseClient();
      const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] ?? fullName.trim();
      const lastName = nameParts.slice(1).join(" ") || null;

      const { error } = await supabase.from("beneficiaries").insert([
        {
          registration_date: new Date().toISOString().slice(0, 10),
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber.trim(),
          region: location.trim(),
          disability_type: supportNeeds.trim(),
          notes: requestDescription.trim(),
          status: "pending",
        },
      ]);

      if (error) {
        setStatusMessage(`Submission failed: ${error.message}`);
        return;
      }

      setFullName("");
      setPhoneNumber("");
      setLocation("");
      setSupportNeeds("");
      setRequestDescription("");
      setStatusMessage("Your application was submitted successfully. A staff member will review it shortly.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Full name
        <input
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Example: Selam Bekele"
          required
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Phone number
        <input
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="+251 9xx xxx xxx"
          required
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Location
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Addis Ababa, Oromia, etc."
          required
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Disability or support needs
        <textarea
          value={supportNeeds}
          onChange={(event) => setSupportNeeds(event.target.value)}
          className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Describe mobility needs, support required, or accessibility needs."
          required
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Description of request
        <textarea
          value={requestDescription}
          onChange={(event) => setRequestDescription(event.target.value)}
          className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Tell us more about the support you need."
          required
        />
      </label>

      <button type="submit" disabled={isSubmitting} className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400">
        {isSubmitting ? "Submitting..." : "Submit application"}
      </button>

      <p className="text-sm text-slate-500">{statusMessage}</p>
    </form>
  );
}
