import * as SQLite from "expo-sqlite";
import type { BeneficiaryDraft, SyncState } from "./types";

const dbPromise = SQLite.openDatabaseAsync("agape-mobile.db");

export async function initializeStorage() {
  const db = await dbPromise;
  await db.execAsync(`CREATE TABLE IF NOT EXISTS beneficiary_queue (
    local_id TEXT PRIMARY KEY NOT NULL,
    client_change_id TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    region TEXT NOT NULL,
    gender TEXT NOT NULL,
    notes TEXT NOT NULL,
    date_of_birth TEXT NOT NULL DEFAULT '',
    kebele TEXT NOT NULL DEFAULT '',
    disability_type TEXT NOT NULL DEFAULT '',
    referral_source TEXT NOT NULL DEFAULT '',
    photo_uri TEXT,
    registration_number TEXT,
    sync_state TEXT NOT NULL,
    error TEXT,
    created_at TEXT NOT NULL
  );`);
  const columns = await db.getAllAsync<{ name: string }>("PRAGMA table_info(beneficiary_queue)");
  const existingColumns = new Set(columns.map((column) => column.name));
  const additions = [
    ["date_of_birth", "TEXT NOT NULL DEFAULT ''"],
    ["client_change_id", "TEXT NOT NULL DEFAULT ''"],
    ["kebele", "TEXT NOT NULL DEFAULT ''"],
    ["disability_type", "TEXT NOT NULL DEFAULT ''"],
    ["referral_source", "TEXT NOT NULL DEFAULT ''"],
    ["photo_uri", "TEXT"],
    ["registration_number", "TEXT"],
  ] as const;
  for (const [name, definition] of additions) {
    if (!existingColumns.has(name)) {
      await db.execAsync(`ALTER TABLE beneficiary_queue ADD COLUMN ${name} ${definition}`);
    }
  }
}

export async function listLocalBeneficiaries(): Promise<BeneficiaryDraft[]> {
  const db = await dbPromise;
  const rows = await db.getAllAsync<Record<string, string>>("SELECT * FROM beneficiary_queue ORDER BY created_at DESC");
  return rows.map((row) => ({ localId: row.local_id, clientChangeId: row.client_change_id || row.local_id, firstName: row.first_name, middleName: row.middle_name, lastName: row.last_name, phone: row.phone, region: row.region, gender: row.gender, notes: row.notes, dateOfBirth: row.date_of_birth, kebele: row.kebele, disabilityType: row.disability_type, referralSource: row.referral_source, photoUri: row.photo_uri ?? undefined, registrationNumber: row.registration_number ?? undefined, syncState: row.sync_state as SyncState, error: row.error ?? undefined, createdAt: row.created_at }));
}

export async function saveLocalBeneficiary(record: BeneficiaryDraft) {
  const db = await dbPromise;
  await db.runAsync(`INSERT OR REPLACE INTO beneficiary_queue (local_id, client_change_id, first_name, middle_name, last_name, phone, region, gender, notes, date_of_birth, kebele, disability_type, referral_source, photo_uri, registration_number, sync_state, error, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, record.localId, record.clientChangeId, record.firstName, record.middleName, record.lastName, record.phone, record.region, record.gender, record.notes, record.dateOfBirth, record.kebele, record.disabilityType, record.referralSource, record.photoUri ?? null, record.registrationNumber ?? null, record.syncState, record.error ?? null, record.createdAt);
}

export async function updateLocalBeneficiary(record: BeneficiaryDraft) {
  await saveLocalBeneficiary(record);
}
