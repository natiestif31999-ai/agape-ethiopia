import { userFacingRequestError } from "./requestErrors.ts";
import { logRegistrationDiagnostic } from "./registrationDiagnostics.ts";
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
  onLocalSaved?: () => void,
) {
  try {
    await saveLocal(record);
    onLocalSaved?.();
  } catch (error) {
    const message = userFacingRequestError(error, "Local save failed.");
    logRegistrationDiagnostic("local-save-failed", { localId: record.localId, syncState: record.syncState, operation: "sqlite_upsert", errorCategory: "local_storage_write" });
    return { record: { ...record, syncState: "FAILED" as const, error: message }, error: message, localSaved: false };
  }

  try {
    const synced = await submit(record);
    requireConfirmedRecord(synced);
    await updateLocal(synced);
    logRegistrationDiagnostic("remote-sync-success", { localId: record.localId, remoteId: synced.serverId, syncState: synced.syncState });
    return { record: synced, error: undefined, localSaved: true };
  } catch (error) {
    const failed = {
      ...record,
      syncState: "FAILED" as const,
      error: userFacingRequestError(error, "Submission failed."),
    };
    await updateLocal(failed).catch(() => undefined);
    logRegistrationDiagnostic("remote-sync-failed", { localId: record.localId, syncState: failed.syncState, message: failed.error });
    return { record: failed, error: failed.error, localSaved: true };
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
  logRegistrationDiagnostic("queue-sync-start", { records: pending.length, operation: "retry_pending" });

  if (!endpoint) {
    const message = "Sync is unavailable: configure EXPO_PUBLIC_WEB_API_URL.";
    await Promise.all(pending.map((record) => updateLocal({ ...record, syncState: "FAILED", error: message })));
    return { synced: 0, failed: pending.length };
  }

  let syncedCount = 0;
  let failedCount = 0;
  for (const record of pending) {
    try {
      await updateLocal({ ...record, syncState: "SYNCING", error: undefined });
      const synced = await submit(record);
      requireConfirmedRecord(synced);
      await updateLocal(synced);
      syncedCount += 1;
      logRegistrationDiagnostic("queue-record-synced", { localId: record.localId, remoteId: synced.serverId, syncState: synced.syncState });
    } catch (error) {
      await updateLocal({
        ...record,
        syncState: "FAILED",
        error: userFacingRequestError(error, "Synchronization failed."),
      }).catch(() => undefined);
      failedCount += 1;
      logRegistrationDiagnostic("queue-record-failed", { localId: record.localId, syncState: "FAILED", message: error instanceof Error ? error.message : "sync failed" });
    }
  }
  return { synced: syncedCount, failed: failedCount };
}