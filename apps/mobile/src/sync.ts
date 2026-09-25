import { supabase } from "./supabase";
import { WEB_API_URL } from "./config";
import { listLocalBeneficiaries, updateLocalBeneficiary } from "./storage";
import type { BeneficiaryDraft } from "./types";

function apiUrl(path: string) {
  return WEB_API_URL ? `${WEB_API_URL}${path}` : null;
}

type SyncResult = { synced: number; failed: number; skipped: number };
let activeSync: Promise<SyncResult> | null = null;

function toFormData(record: BeneficiaryDraft) {
  const form = new FormData();
  form.append("first_name", record.firstName ?? "");
  form.append("middle_name", record.middleName ?? "");
  form.append("last_name", record.lastName ?? "");
  form.append("date_of_birth", record.dateOfBirth ?? "");
  form.append("gender", record.gender ?? "");
  form.append("phone", record.phone ?? "");
  form.append("region", record.region ?? "");
  form.append("kifle_ketema", "");
  form.append("kebele", record.kebele ?? "");
  form.append("house_number", "");
  form.append("disability_type", record.disabilityType ?? "");
  form.append("referral_source", record.referralSource ?? "");
  form.append("notes", record.notes ?? "");
  form.append("client_change_id", record.clientChangeId ?? record.localId);
  if (record.photoUri) {
    form.append("photo", { uri: record.photoUri, name: "beneficiary-photo.jpg", type: "image/jpeg" } as unknown as Blob);
  }
  return form;
}

export async function submitBeneficiaryToBackend(record: BeneficiaryDraft): Promise<BeneficiaryDraft> {
  const endpoint = apiUrl("/api/public-registration");
  if (!endpoint) {
    throw new Error("Sync is unavailable: configure EXPO_PUBLIC_WEB_API_URL.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "X-Client-Change-Id": record.clientChangeId || record.localId },
    body: toFormData(record),
  });

  const body = (await response.json().catch(() => null)) as {
    data?: { phone?: string; registration_number?: string };
    error?: string;
    errors?: string[];
  } | null;

  if (!response.ok) {
    const errorText = body?.error ?? body?.errors?.[0] ?? "The server rejected this registration.";
    if (response.status === 409 || errorText.toLowerCase().includes("already registered")) {
      throw new Error("This phone number is already registered. Please use a different number.");
    }
    throw new Error(errorText);
  }

  return {
    ...record,
    phone: body?.data?.phone ?? record.phone,
    syncState: "SYNCED",
    registrationNumber: body?.data?.registration_number ?? record.registrationNumber,
    error: undefined,
  };
}

export function syncPendingRecords(): Promise<SyncResult> {
  if (activeSync) return activeSync;
  activeSync = syncPendingRecordsOnce().finally(() => {
    activeSync = null;
  });
  return activeSync;
}

async function syncPendingRecordsOnce(): Promise<SyncResult> {
  const records = await listLocalBeneficiaries();
  const pending = records.filter((record) => record.syncState === "PENDING_SYNC" || record.syncState === "FAILED");
  if (!pending.length) return { synced: 0, failed: 0, skipped: 0 };

  const endpoint = apiUrl("/api/public-registration");
  if (!endpoint) {
    const message = "Sync is unavailable: configure EXPO_PUBLIC_WEB_API_URL.";
    await Promise.all(pending.map((record) => updateLocalBeneficiary({ ...record, syncState: "FAILED", error: message })));
    return { synced: 0, failed: pending.length, skipped: 0 };
  }

  let synced = 0;
  let failed = 0;
  for (const record of pending) {
    const syncing = { ...record, syncState: "SYNCING" as const, error: undefined };
    await updateLocalBeneficiary(syncing);
    try {
      const syncedRecord = await submitBeneficiaryToBackend(record);
      await updateLocalBeneficiary(syncedRecord);
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