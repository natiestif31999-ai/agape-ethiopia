import { supabase } from "./supabase";
import { WEB_API_URL } from "./config";
import { listLocalBeneficiaries, updateLocalBeneficiary } from "./storage";
import type { BeneficiaryDraft } from "./types";

function apiUrl(path: string) {
  return WEB_API_URL ? `${WEB_API_URL}${path}` : null;
}

function toFormData(record: BeneficiaryDraft) {
  const form = new FormData();
  form.append("first_name", record.firstName);
  form.append("middle_name", record.middleName ?? "");
  form.append("last_name", record.lastName);
  form.append("date_of_birth", record.dateOfBirth ?? "");
  form.append("gender", record.gender);
  form.append("phone", record.phone);
  form.append("region", record.region);
  form.append("kifle_ketema", "");
  form.append("kebele", record.kebele ?? "");
  form.append("house_number", "");
  form.append("disability_type", record.disabilityType ?? "");
  form.append("referral_source", record.referralSource ?? "");
  form.append("notes", record.notes ?? "");
  form.append("client_change_id", record.clientChangeId);
  if (record.photoUri) {
    form.append("photo", { uri: record.photoUri, name: "beneficiary-photo.jpg", type: "image/jpeg" } as unknown as Blob);
  }
  return form;
}

export async function syncPendingRecords() {
  const records = await listLocalBeneficiaries();
  const pending = records.filter((record) => record.syncState === "PENDING_SYNC" || record.syncState === "FAILED");
  if (!pending.length) return { synced: 0, failed: 0, skipped: 0 };

  const endpoint = apiUrl("/api/public-registration");
  if (!endpoint) return { synced: 0, failed: 0, skipped: pending.length };

  let synced = 0;
  let failed = 0;
  for (const record of pending) {
    const syncing = { ...record, syncState: "SYNCING" as const, error: undefined };
    await updateLocalBeneficiary(syncing);
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "X-Client-Change-Id": record.clientChangeId }, body: toFormData(record) });
      const body = await response.json().catch(() => null) as { data?: { registration_number?: string }; error?: string } | null;
      if (!response.ok) {
        if (response.status === 409 || body?.error?.toLowerCase().includes("phone number is already registered")) {
          throw new Error("This phone number is already registered. Please use a different phone number.");
        }
        throw new Error(body?.error ?? "The server rejected this registration.");
      }
      await updateLocalBeneficiary({ ...record, syncState: "SYNCED", registrationNumber: body?.data?.registration_number });
      synced += 1;
    } catch (error) {
      await updateLocalBeneficiary({ ...record, syncState: "FAILED", error: error instanceof Error ? error.message : "Synchronization failed." });
      failed += 1;
    }
  }
  return { synced, failed, skipped: 0 };
}

export function hasBackendSync() {
  return Boolean(WEB_API_URL) || Boolean(supabase);
}