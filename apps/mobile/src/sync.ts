import { supabase } from "./supabase";
import { WEB_API_URL } from "./config";
import { File } from "expo-file-system";
import { listLocalBeneficiaries, recoverInterruptedSyncs, updateLocalBeneficiary } from "./storage";
import { submitRegistrationRequest } from "./registrationResponse";
import { syncBeneficiaryQueue } from "./registrationQueue";
import type { BeneficiaryDraft } from "./types";

function apiUrl(path: string) {
  return WEB_API_URL ? `${WEB_API_URL}${path}` : null;
}

type SyncResult = { synced: number; failed: number; skipped: number };
let activeSync: Promise<SyncResult> | null = null;

export async function submitBeneficiaryToBackend(record: BeneficiaryDraft): Promise<BeneficiaryDraft> {
  const endpoint = apiUrl("/api/public-registration");
  if (!endpoint) {
    throw new Error("Sync is unavailable: configure EXPO_PUBLIC_WEB_API_URL.");
  }

  return submitRegistrationRequest(record, endpoint, {
    fetcher: fetch,
    createPhoto: record.photoUri
      ? (uri, fileName) => {
          const file = new File(uri);
          return { file, fileName: fileName ?? file.name };
        }
      : undefined,
  });
}

export function syncPendingRecords(): Promise<SyncResult> {
  if (activeSync) {
    return activeSync.then(async (result) => {
      const records = await listLocalBeneficiaries();
      if (records.some((record) => record.syncState === "PENDING_SYNC")) {
        return syncPendingRecords();
      }
      return result;
    });
  }
  activeSync = syncPendingRecordsOnce().finally(() => {
    activeSync = null;
  });
  return activeSync;
}

async function syncPendingRecordsOnce(): Promise<SyncResult> {
  await recoverInterruptedSyncs();
  const records = await listLocalBeneficiaries();
  const endpoint = apiUrl("/api/public-registration");
  const result = await syncBeneficiaryQueue(records, updateLocalBeneficiary, submitBeneficiaryToBackend, endpoint);
  return { ...result, skipped: 0 };
}

export function hasBackendSync() {
  return Boolean(WEB_API_URL) || Boolean(supabase);
}