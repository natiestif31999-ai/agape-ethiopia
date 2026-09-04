import type { BeneficiaryDraft } from "./types";

const STORAGE_KEY = "agape-mobile-beneficiary-queue";

function readRecords(): BeneficiaryDraft[] {
  if (typeof localStorage === "undefined") {
    return [];
  }

  try {
    return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Partial<BeneficiaryDraft>[]).map((record) => ({
      localId: record.localId ?? `legacy-${Date.now()}`,
      clientChangeId: record.clientChangeId || record.localId || `legacy-${Date.now()}`,
      firstName: record.firstName ?? "",
      middleName: record.middleName ?? "",
      lastName: record.lastName ?? "",
      phone: record.phone ?? "",
      region: record.region ?? "",
      gender: record.gender ?? "",
      notes: record.notes ?? "",
      dateOfBirth: record.dateOfBirth ?? "",
      kebele: record.kebele ?? "",
      disabilityType: record.disabilityType ?? "",
      referralSource: record.referralSource ?? "",
      photoUri: record.photoUri,
      registrationNumber: record.registrationNumber,
      syncState: record.syncState ?? "PENDING_SYNC",
      error: record.error,
      createdAt: record.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function initializeStorage() {
  readRecords();
}

export async function listLocalBeneficiaries(): Promise<BeneficiaryDraft[]> {
  return readRecords();
}

export async function saveLocalBeneficiary(record: BeneficiaryDraft) {
  const records = readRecords().filter((current) => current.localId !== record.localId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...records]));
}

export async function updateLocalBeneficiary(record: BeneficiaryDraft) {
  await saveLocalBeneficiary(record);
}
