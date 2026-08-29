export const PUBLIC_BENEFICIARY_REQUIRED_FIELDS = [
  "first_name",
  "last_name",
  "gender",
  "phone",
  "region",
  "kebele",
] as const;

export const PUBLIC_REGISTRATION_STATUS = "Pending Review";

function normalizeValue(value: string | undefined | null) {
  return value?.trim() ?? "";
}

export function normalizeEthiopianPhone(value: string | undefined | null): string {
  const raw = normalizeValue(value);
  if (!raw) {
    return "";
  }

  const digitsOnly = raw.replace(/\D/g, "");
  if (!digitsOnly) {
    return "";
  }

  let compact = digitsOnly;
  if (compact.startsWith("251")) {
    compact = compact.slice(3);
  }

  if (compact.startsWith("0")) {
    compact = compact.slice(1);
  }

  if (compact.length !== 9 || !/^9\d{8}$/.test(compact)) {
    return "";
  }

  return `+251${compact}`;
}

export function isValidEthiopianPhone(value: string | undefined | null): boolean {
  return normalizeEthiopianPhone(value).length > 0;
}

export function normalizeRegionCode(value: string | undefined | null) {
  const cleaned = normalizeValue(value).trim();
  if (!cleaned) {
    return "";
  }

  const normalized = cleaned
    .toUpperCase()
    .replace(/[_-]/g, " ")
    .replace(/[^A-Z ]/g, "")
    .trim();

  const regionMap: Record<string, string> = {
    "ADDIS ABABA": "AA",
    "ADDISABABA": "AA",
    AFA: "AFA",
    AFAR: "AFA",
    AMH: "AMH",
    AMHARA: "AMH",
    BEN: "BEN",
    "BENISHANGUL GUMUZ": "BEN",
    "BENISHANGULGUMUZ": "BEN",
    DD: "DD",
    "DIRE DAWA": "DD",
    "DIREDAWA": "DD",
    GAM: "GAM",
    GAMBELA: "GAM",
    HAR: "HAR",
    HARARI: "HAR",
    OR: "ORO",
    ORO: "ORO",
    OROMIA: "ORO",
    SID: "SID",
    SIDAMA: "SID",
    SOM: "SOM",
    SOMALI: "SOM",
    SNN: "SNN",
    SNNP: "SNN",
    "SOUTH ETHIOPIA": "SET",
    "SOUTHETHIOPIA": "SET",
    "CENTRAL ETHIOPIA": "CET",
    "CENTRALETHIOPIA": "CET",
    TIG: "TIG",
    TIGRAY: "TIG",
    SWE: "SWE",
    "SOUTHWEST ETHIOPIA": "SWE",
    "SOUTHWESTETHIOPIA": "SWE",
  };

  return regionMap[normalized] || normalized.replace(/\s+/g, "").slice(0, 3) || "";
}

export function buildBeneficiaryId(region: string | undefined | null) {
  const code = normalizeRegionCode(region);
  const regionCode = code || "GEN";
  return `AG-B-${regionCode}-`;
}

export function validatePublicBeneficiaryFields(values: Record<string, string | undefined | null>) {
  const errors: string[] = [];

  for (const field of PUBLIC_BENEFICIARY_REQUIRED_FIELDS) {
    if (!normalizeValue(values[field])) {
      const label = field.replace(/_/g, " ");
      errors.push(`Please enter your ${label}.`);
    }
  }

  if (!isValidEthiopianPhone(values.phone)) {
    errors.push("Please enter a valid Ethiopian phone number.");
  }

  const gender = normalizeValue(values.gender).toLowerCase();
  if (gender && !["male", "female"].includes(gender)) {
    errors.push("Please select a valid gender.");
  }

  return errors;
}

export function buildPublicBeneficiaryPayload(values: Record<string, string | undefined | null>, photoUrl: string | null = null) {
  const normalized = {
    registration_date: normalizeValue(values.registration_date),
    first_name: normalizeValue(values.first_name),
    middle_name: normalizeValue(values.middle_name),
    last_name: normalizeValue(values.last_name),
    date_of_birth: normalizeValue(values.date_of_birth),
    gender: normalizeValue(values.gender).toLowerCase(),
    phone: normalizeEthiopianPhone(values.phone),
    region: normalizeValue(values.region),
    kifle_ketema: normalizeValue(values.kifle_ketema),
    kebele: normalizeValue(values.kebele),
    house_number: normalizeValue(values.house_number),
    notes: normalizeValue(values.notes),
    disability_type: normalizeValue(values.disability_type),
    referral_source: normalizeValue(values.referral_source),
  };

  return {
    registration_date: normalized.registration_date || new Date().toISOString().slice(0, 10),
    beneficiary_id: null,
    registration_number: null,
    region_code: normalizeRegionCode(values.region),
    first_name: normalized.first_name,
    middle_name: normalized.middle_name || null,
    last_name: normalized.last_name,
    date_of_birth: normalized.date_of_birth || null,
    gender: normalized.gender || "",
    phone: normalized.phone,
    phone_normalized: normalized.phone,
    region: normalized.region,
    kifle_ketema: normalized.kifle_ketema || null,
    kebele: normalized.kebele,
    house_number: normalized.house_number || null,
    notes: normalized.notes || null,
    photo_url: photoUrl,
    disability_type: normalized.disability_type || null,
    referral_source: normalized.referral_source || null,
    status: PUBLIC_REGISTRATION_STATUS,
  };
}
