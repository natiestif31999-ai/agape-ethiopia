import type { BeneficiaryDraft } from "./types";

type RegistrationResponseBody = {
  data?: {
    id?: string;
    phone?: string;
    photo_url?: string | null;
    registration_number?: string;
  };
  error?: string;
  errors?: string[];
};

type RegistrationRequestOptions = {
  fetcher?: typeof fetch;
  createPhoto?: (uri: string, fileName?: string) => { file: Blob; fileName: string };
};

export function createRegistrationFormData(record: BeneficiaryDraft, createPhoto?: RegistrationRequestOptions["createPhoto"]) {
  const form = new FormData();
  form.append("first_name", record.firstName ?? "");
  form.append("middle_name", record.middleName ?? "");
  form.append("last_name", record.lastName ?? "");
  form.append("date_of_birth", record.dateOfBirth ?? "");
  form.append("gender", record.gender ?? "");
  form.append("phone", record.phone ?? "");
  form.append("region", record.region ?? "");
  form.append("kifle_ketema", record.kifleKetema ?? "");
  form.append("kebele", record.kebele ?? "");
  form.append("house_number", record.houseNumber ?? "");
  form.append("disability_type", record.disabilityType ?? "");
  form.append("wheelchair_size", record.wheelchairSize ?? "");
  form.append("specific_apparatus_need", record.specificApparatusNeed ?? "");
  form.append("referral_source", record.referralSource ?? "");
  form.append("notes", record.notes ?? "");
  form.append("client_change_id", record.clientChangeId ?? record.localId);
  if (record.photoUri) {
    if (!createPhoto) throw new Error("The selected photo could not be prepared.");
    const photo = createPhoto(record.photoUri, record.photoFileName);
    form.append("photo", photo.file, photo.fileName);
  }
  return form;
}

function parseBody(body: unknown): RegistrationResponseBody | null {
  return body && typeof body === "object" ? body as RegistrationResponseBody : null;
}

export async function submitRegistrationRequest(
  record: BeneficiaryDraft,
  endpoint: string,
  options: RegistrationRequestOptions = {},
): Promise<BeneficiaryDraft> {
  const response = await (options.fetcher ?? fetch)(endpoint, {
    method: "POST",
    headers: { "X-Client-Change-Id": record.clientChangeId || record.localId },
    body: createRegistrationFormData(record, options.createPhoto),
  });
  const body = parseBody(await response.json().catch(() => null));

  if (!response.ok) {
    const errorText = body?.error ?? body?.errors?.[0] ?? "The server rejected this registration.";
    if (response.status === 409 || errorText.toLowerCase().includes("already registered")) {
      throw new Error("This phone number is already registered. Please use a different number.");
    }
    throw new Error(errorText);
  }

  const serverId = body?.data?.id?.trim();
  if (!serverId) {
    throw new Error("The server response did not confirm a saved beneficiary record.");
  }

  return {
    ...record,
    serverId,
    phone: body?.data?.phone ?? record.phone,
    photoUrl: body?.data?.photo_url ?? record.photoUrl,
    syncState: "SYNCED",
    registrationNumber: body?.data?.registration_number ?? record.registrationNumber,
    error: undefined,
  };
}