import { userFacingRequestError } from "./requestErrors.ts";
import type { BeneficiaryDraft } from "./types";

type SubmitRegistration = (record: BeneficiaryDraft) => Promise<BeneficiaryDraft>;
type UpdateRegistration = (record: BeneficiaryDraft) => Promise<void>;
type SyncResult = { synced: number; failed: number };

function requireConfirmedRecord(record: BeneficiaryDraft) {
  if (record.syncState !== "SYNCED" || !record.serverId) {
    throw new Error("The server response did not confirm a saved beneficiary record.");
  }
}

export async function saveAndSyncBeneficiary(
  record: BeneficiaryDraft,
  saveLocal: UpdateRegistration,
  updateLocal: UpdateRegistration,
  submit: SubmitRegistration,
) {
  await saveLocal(record);
  try {
    const synced = await submit(record);
    requireConfirmedRecord(synced);
    await updateLocal(synced);
    return { record: synced, error: undefined };
  } catch (error) {
    const failed = {
      ...record,
      syncState: "FAILED" as const,
      error: userFacingRequestError(error, "Submission failed."),
    };
    await updateLocal(failed);
    return { record: failed, error: failed.error };
  }
}

export async function syncBeneficiaryQueue(
  records: BeneficiaryDraft[],
  updateLocal: UpdateRegistration,
  submit: SubmitRegistration,
  endpoint: string | null,
): Promise<SyncResult> {
  const pending = records.filter((record) => record.syncState === "PENDING_SYNC" || record.syncState === "FAILED");
  if (!pending.length) return { synced: 0, failed: 0 };

  if (!endpoint) {
    const message = "Sync is unavailable: configure EXPO_PUBLIC_WEB_API_URL.";
    await Promise.all(pending.map((record) => updateLocal({ ...record, syncState: "FAILED", error: message })));
    return { synced: 0, failed: pending.length };
  }

  let syncedCount = 0;
  let failedCount = 0;
  for (const record of pending) {
    await updateLocal({ ...record, syncState: "SYNCING", error: undefined });
    try {
      const synced = await submit(record);
      requireConfirmedRecord(synced);
      await updateLocal(synced);
      syncedCount += 1;
    } catch (error) {
      await updateLocal({
        ...record,
        syncState: "FAILED",
        error: userFacingRequestError(error, "Synchronization failed."),
      });
      failedCount += 1;
    }
  }
  return { synced: syncedCount, failed: failedCount };
}