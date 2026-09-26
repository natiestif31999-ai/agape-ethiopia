export type Role = "Staff" | "Admin" | "Public";
export type SyncState = "LOCAL" | "PENDING_SYNC" | "SYNCING" | "SYNCED" | "FAILED";

export type BeneficiaryDraft = {
  localId: string;
  clientChangeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  region: string;
  gender: string;
  notes: string;
  dateOfBirth: string;
  kifleKetema: string;
  kebele: string;
  houseNumber: string;
  disabilityType: string;
  referralSource: string;
  photoUri?: string;
  photoFileName?: string;
  photoMimeType?: string;
  photoUrl?: string;
  serverId?: string;
  registrationNumber?: string;
  syncState: SyncState;
  error?: string;
  createdAt: string;
};
