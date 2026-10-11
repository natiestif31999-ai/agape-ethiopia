import type { BeneficiaryDraft } from "./types";

export const BENEFICIARY_INSERT_SQL = `INSERT OR REPLACE INTO beneficiary_queue (
  local_id,
  client_change_id,
  first_name,
  middle_name,
  last_name,
  phone,
  region,
  gender,
  notes,
  date_of_birth,
  kifle_ketema,
  kebele,
  house_number,
  disability_type,
  wheelchair_size,
  specific_apparatus_need,
  referral_source,
  photo_uri,
  photo_file_name,
  photo_mime_type,
  photo_url,
  server_id,
  registration_number,
  sync_state,
  error,
  created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export const RECOVER_INTERRUPTED_SYNC_SQL = "UPDATE beneficiary_queue SET sync_state = 'PENDING_SYNC', error = NULL WHERE sync_state = 'SYNCING'";

export function beneficiaryInsertValues(record: BeneficiaryDraft) {
  return [
    record.localId,
    record.clientChangeId || record.localId,
    record.firstName,
    record.middleName,
    record.lastName,
    record.phone,
    record.region,
    record.gender,
    record.notes,
    record.dateOfBirth,
    record.kifleKetema,
    record.kebele,
    record.houseNumber,
    record.disabilityType,
    record.wheelchairSize ?? "",
    record.specificApparatusNeed ?? "",
    record.referralSource,
    record.photoUri ?? null,
    record.photoFileName ?? null,
    record.photoMimeType ?? null,
    record.photoUrl ?? null,
    record.serverId ?? null,
    record.registrationNumber ?? null,
    record.syncState,
    record.error ?? null,
    record.createdAt,
  ];
}